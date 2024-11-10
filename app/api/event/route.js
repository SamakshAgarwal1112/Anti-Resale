// File: app/api/event/route.js

import { createEvent, updateEvent, getAllEvents, getEventById, updateBookingStatus } from "../../controllers/eventController";

export async function POST(req, res) {
    if (req.url === '/create') {
        return createEvent(req, res);
    }
    res.status(404).json({ error: "Route not found" });
}

export async function PUT(req, res) {
    if (req.url === '/update/:eventId') {
        return updateEvent(req, res);
    }
    if (req.url === '/updateBookingStatus/:eventId') {
        return updateBookingStatus(req, res);
    }
    res.status(404).json({ error: "Route not found" });
}

export async function GET(req, res) {
    if (req.url === '/all') {
        return getAllEvents(req, res);
    }
    if (req.url.includes('/event/:eventId')) {
        return getEventById(req, res);
    }
    res.status(404).json({ error: "Route not found" });
}
