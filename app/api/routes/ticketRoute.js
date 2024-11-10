import express from 'express';
import { bookTicket, getUserTickets, returnTicket, lockTicket } from '../controllers/ticketController';
import { authenticateUser } from '../middleware/auth';

const router = express.Router();

router.post("/tickets/book", authenticateUser, bookTicket);
router.get("/tickets", authenticateUser, getUserTickets);
router.put("/tickets/return/:ticketId", authenticateUser, returnTicket);
router.patch("/tickets/lock/:ticketId", authenticateUser, lockTicket);

export default router;
