import express from 'express';
import * as storeController from '../controllers/storeController.js';

const storeRouter = express.Router();

// Home / Landing page
storeRouter.get('/index', storeController.getIndex);

// Browse all homes (guest view)
storeRouter.get('/homes', storeController.gethomes);

// Single home detail
storeRouter.get('/homes/:homeId', storeController.getHomeDetails);

// Bookings
storeRouter.get('/bookings', storeController.getBookings);
storeRouter.post('/bookings', storeController.postAddToBookings);
storeRouter.post('/bookings/delete/:homeId', storeController.postRemoveFromBookings);

// Favourites
storeRouter.get('/favourites', storeController.getFavouriteList);
storeRouter.post('/favourites', storeController.postAddToFavourites);
storeRouter.post('/favourites/delete/:homeId', storeController.postRemoveFromFavourites);

export default storeRouter;
