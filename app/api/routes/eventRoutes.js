import express from 'express';
import { getAllEvents, getEventById, createEvent, updateEvent, updateBookingStatus } from '../controllers/eventController';
import { authenticateUser } from '../middlewares/authMiddleware';
import {uploadImage} from '../middlewares/multerMiddlware';

const router = express.Router();

router.get("/events", getAllEvents);
router.get("/events/:eventId", getEventById);

router.post("/events", authenticateUser, uploadImage, createEvent);
router.put("/events/:eventId", authenticateUser, updateEvent);
router.patch("/events/:eventId/booking-status", authenticateUser, updateBookingStatus);

export default router;
