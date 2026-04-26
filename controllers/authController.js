import { check, validationResult } from "express-validator";
import User from "../models/user.js";
import bcrypt from 'bcryptjs';
import user from "../models/user.js";

export const getSignup = (req, res, next) => {
  res.render('auth/signup',
    {
      pageTitle: 'Signup',
      isLoggedIn: false,
      errors: [],
      oldInput: { firstName: '', lastName: '', email: '', userType: '' },
      user: {}
    });
};

export const postSignup = [
  check('firstName')
    .trim()
    .isLength({ min: 3 })
    .withMessage('First name must be at least 3 characters long')
    .matches(/^[A-Za-z]+$/)
    .withMessage('First name must contain only letters'),

  check('lastName')
    .matches(/^[A-Za-z]+$/)
    .withMessage('Last name must contain only letters'),

  check('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),

  check('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number')
    .trim(),

  check('confirmPassword')
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),

  check('userType')
    .notEmpty()
    .withMessage('Please select a user type')
    .isIn(['host', 'guest'])
    .withMessage('Invalid user type'),

  check('terms')
    .notEmpty()
    .withMessage('You must accept the terms and conditions')
    .custom((value) => {
      if (value !== 'on') {
        throw new Error('You must accept the terms and conditions');
      }
      return true;
    }),

  (req, res, next) => {
    const { firstName, lastName, email, password, userType } = req.body
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).render('auth/signup', {
        pageTitle: 'Signup',
        isLoggedIn: false,
        errors: errors.array().map(err => err.msg),
        oldInput: { firstName, lastName, email, password, userType },
        user: {}
      })
    }

    //for password encryption
    bcrypt.hash(password, 12).then(hashedPassword => {
      const user = new User({ firstName, lastName, email, password: hashedPassword, userType })
      return user.save()
    }).then(() => {
      res.redirect('/login')
    }).catch(err => {
      return res.status(422).render('auth/signup', {
        pageTitle: 'Signup',
        isLoggedIn: false,
        errors: [err.message],
        oldInput: { firstName, lastName, email, userType },
        user: {}
      })
    })
  }
]

//login
export const getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    isLoggedIn: false,
    errors: [],
    oldInput: {email: ''},
     user: {}
  });
};

export const postLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).render("auth/login", {
        pageTitle: "Login",
        isLoggedIn: false,
        errors: ["User does not exist"],
        oldInput: { email },
        user: {}
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).render("auth/login", {
        pageTitle: "Login",
        isLoggedIn: false,
        errors: ["Invalid password"],
        oldInput: { email },
        user: {}
      });
    }
    console.log("Login success");
    console.log(req.session);

    req.session.isLoggedIn = true;
    req.session.user = {
      _id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      userType: user.userType
    };

    req.session.save((err) => {
      if (err) {
        console.log("Session Save Error:", err);
      }
      return res.redirect("/");
    });

  } catch (err) {
    console.log(err);
    res.redirect("/login");
  }
};
export const postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/login')
  })
}

