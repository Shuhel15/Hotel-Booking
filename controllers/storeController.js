
import Home from '../models/home.js';
import User from '../models/user.js';

const renderHomesPage = (res, view, pageTitle) => {
  Home.find()
    .then((registeredHomes) => {
      res.render(view, {
        registeredHomes,
        pageTitle,
      });
    })
    .catch((error) => {
      console.log(`Error loading ${pageTitle.toLowerCase()}:`, error);
      res.status(500).render(view, {
        registeredHomes: [],
        pageTitle,
      });
    });
};

export const getIndex = (req, res, next) => {
  console.log('Session value:', req.session);
  Home.find().then((registeredHomes) => {
    res.render('store/index', {
      registeredHomes,
      pageTitle: 'NestVio — Find Your Perfect Stay',
      isLoggedIn: req.session.isLoggedIn || false,
      user: req.session.user
    });
  })
};

export const gethomes = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render('store/home-list', {
      registeredHomes,
      pageTitle: 'Homes List',
      isLoggedIn: req.session.isLoggedIn || false,
      user: req.session.user
    });
  })
};

export const getHomeDetails = (req, res, next) => {
  Home.findById(req.params.homeId)
    .then((home) => {
      if (!home) {
        console.log('Home not found');
        return res.redirect('/homes');
      }

      res.render('store/home-detail', {
        home,
        pageTitle: 'Home Detail',
        isLoggedIn: req.session.isLoggedIn || false,
        user: req.session.user
      });
    })
    .catch((error) => {
      console.log('Error loading home details:', error);
      res.redirect('/homes');
    });
};

//*********************BOOKINGS****************************

export const getBookings = async (req, res, next) => {
  const userId = req.session.user._id
  const user = await User.findById(userId).populate('bookings')
  res.render('store/bookings', {
    bookedHomes: user.bookings,
    pageTitle: 'My Bookings',
    isLoggedIn: req.session.isLoggedIn || false,
    user: req.session.user
  });
}
export const postAddToBookings = async (req, res, next) => {
  const homeId = req.body.id;
  const userId = req.session.user._id;
  const user = await User.findById(userId)
  if (!user.bookings.includes(homeId)) {
    user.bookings.push(homeId);
    await user.save();
  }
  res.redirect('/bookings');
};

export const postRemoveFromBookings = async (req, res, next) => {
  const homeId = req.params.homeId;
  const userId = req.session.user._id;
  const user = await User.findById(userId)
  if (user.bookings.includes(homeId)) {
    user.bookings = user.bookings.filter(favId => favId.toString() !== homeId);
    await user.save();
  }
  res.redirect('/bookings');
};

// ********************FAVOURITES**************************
export const getFavouriteList = async (req, res, next) => {
  const userId = req.session.user._id
  const user = await User.findById(userId).populate('favourites')
  res.render('store/favourite-list', {
    favouriteHomes: user.favourites,
    pageTitle: 'My Favourites',
    isLoggedIn: req.session.isLoggedIn || false,
    user: req.session.user
  });
}
export const postAddToFavourites = async (req, res, next) => {
  const homeId = req.body.id;
  const userId = req.session.user._id;
  const user = await User.findById(userId)
  if (!user.favourites.includes(homeId)) {
    user.favourites.push(homeId);
    await user.save();
  }
  res.redirect('/favourites');
};

export const postRemoveFromFavourites = async (req, res, next) => {
  const homeId = req.params.homeId;
  const userId = req.session.user._id;
  const user = await User.findById(userId)
  if (user.favourites.includes(homeId)) {
    user.favourites = user.favourites.filter(favId => favId.toString() !== homeId);
    await user.save();
  }
  res.redirect('/favourites');
};

