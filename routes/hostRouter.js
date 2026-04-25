import express from 'express';
import * as hostController from '../controllers/hostController.js';

const hostRouter = express.Router();

// home add karne ka route.
hostRouter.get("/add-home", hostController.getAddHome);
// home dikhane kab route.
hostRouter.post("/add-home", hostController.postAddHome);
hostRouter.get("/host-home-list", hostController.getHostHomes);
hostRouter.get("/edit-home/:homeId", hostController.getEditHome);
hostRouter.post("/edit-home", hostController.postEditHome);
hostRouter.post("/delete-home/:homeId", hostController.postDeleteHome);

export default hostRouter;