// File: app/api/ticket/route.js

import { bookTicket, getUserTickets, returnTicket, lockTicket } from "../../controllers/ticketController";

export async function POST(req, res) {
    if (req.url === '/book') {
        return bookTicket(req, res);
    }
    res.status(404).json({ error: "Route not found" });
}

export async function GET(req, res) {
    if (req.url === '/userTickets') {
        return getUserTickets(req, res);
    }
    res.status(404).json({ error: "Route not found" });
}

export async function DELETE(req, res) {
    if (req.url === '/returnTicket/:ticketId') {
        return returnTicket(req, res);
    }
    if (req.url === '/lockTicket/:ticketId') {
        return lockTicket(req, res);
    }
    res.status(404).json({ error: "Route not found" });
}
