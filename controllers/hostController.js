import Home from '../models/home.js';
import fs from 'fs';

export const getAddHome = (req, res, next) => {
  res.render('host/edit-Home', {
    pageTitle: 'Add home to ',
    editing: false,
    isLoggedIn: req.session.isLoggedIn || false,
    user: req.session.user
  });
};

// Ye getHostHomes function database se saare homes laakar
//  Host Home List page pe show karta hai.
export const getHostHomes = (req, res, next) => {
  Home.find()
    .then((registeredHomes) => {
      res.render('host/host-home-list', {
        registeredHomes,
        pageTitle: 'Host Home List',
        isLoggedIn: req.session.isLoggedIn || false,
        user: req.session.user
      });
    })
    .catch((error) => {
      console.log('Error loading host homes', error);
      res.status(500).render('host/host-home-list', {
        registeredHomes: [],
        pageTitle: 'Host Home List',
      });
    });
};

//Ye postAddHome function naya home database me save karta
// hai jab user Add Home form submit karta hai.
export const postAddHome = (req, res, next) => {
  const { homeName, price, location, rating, description } = req.body;
  console.log(homeName, price, location, rating, description);
  console.log(req.file);

  if (!req.file) {
    return res.status(400).send('No image provided');
  }

  const photo = req.file.path;

  const newHome = new Home({
    homeName,
    price,
    location,
    rating,
    photo,
    description
  });

  newHome.save()
    .then(() => {
      res.redirect('/host/host-home-list');
    })
    .catch((error) => {
      console.log('Error adding home', error);
      res.redirect('/host/add-home');
    });
};

// Ye getEditHome function Edit Home page open karne ke liye
// data fetch kar raha hai Jab user kisi home ko edit karna
// chahta hai, tab ye function database se us home ka data 
// nikal ke form me fill karke page render karta hai.
export const getEditHome = (req, res, next) => {
  const editing = req.query.editing === 'true';
  const homeId = req.params.homeId;

  Home.findById(homeId)
    .then((home) => {
      if (!home) {
        console.log('Home not found for editing');
        return res.redirect('/host/host-home-list');
      }

      res.render('host/edit-Home', {
        pageTitle: 'Edit your home',
        editing,
        homeId,
        home,
        isLoggedIn: req.session.isLoggedIn || false,
        user: req.session.user
      });
    })
    .catch((error) => {
      console.log('Error fetching home for edit', error);
      res.redirect('/host/host-home-list');
    });
};
// home ki details edit karne ke liye
export const postEditHome = async (req, res, next) => {
  try {
    const { id, homeName, price, location, rating, description } = req.body;
    const home = await Home.findById(id);
    if (!home) {
      return res.redirect('/host/host-home-list');
    }

    home.homeName = homeName;
    home.price = price;
    home.location = location;
    home.rating = rating;
    home.description = description;

    if (req.file) {
      if (home.photo) {
        fs.unlink(home.photo, (err) => {
          if (err) {
            console.log("Error while deleting old photo", err)
          }
        })
      }
      home.photo = req.file.path;
    }

    await home.save();
    console.log("Home Updated");
    res.redirect('/host/host-home-list');
  } catch (err) {
    console.log("Error while updating home", err);
    res.redirect('/host/host-home-list');
  }
};

//home delete karne ke liye 
export const postDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId
  console.log("Came to delete", homeId)
  Home.findByIdAndDelete(homeId)
    .then(() => {
      res.redirect('/host/host-home-list');
    })
    .catch((err) => {
      console.log("Error while deleting", err);
    })
}