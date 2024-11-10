import Event from "../models/eventModel";
import User from "../models/userModel";

export const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find()
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });
        return res.status(200).json(events);
    } catch (error) {
        return res.status(500).json({ error: "Error fetching events" });
    }
};

export const getEventById = async (req, res) => {
    const { eventId } = req.params;
    
    try {
        const event = await Event.findById(eventId)
            .populate('createdBy', 'name email')
            .populate('photos');
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }
        return res.status(200).json(event);
    } catch (error) {
        return res.status(500).json({ error: "Error fetching event details" });
    }
};

export const createEvent = async (req, res) => {
    const { name, date, time, venue, description, mode, ticketsAvailable, ticketPrice } = req.body;
    const userId = req.userId;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const photoPath = req.files?.photo?.[0]?.path;

        if (!photoPath) {
            return res.status(400).json({ error: "Photo is required" });
        }

        const newEvent = new Event({
            name,
            date,
            time,
            venue,
            description,
            createdBy: userId,
            photo: photoPath,
            mode,
            ticketsAvailable,
            ticketPrice
        });

        await newEvent.save();
        return res.status(201).json({ message: "Event created successfully", event: newEvent });
    } catch (error) {
        return res.status(500).json({ error: "Error creating event" });
    }
};

export const updateEvent = async (req, res) => {
    const { eventId } = req.params;
    const { name, date, time, venue, description, mode, ticketsAvailable, ticketPrice, photo } = req.body;
    
    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        event.name = name || event.name;
        event.date = date || event.date;
        event.time = time || event.time;
        event.venue = venue || event.venue;
        event.description = description || event.description;
        event.photo = photo || event.photo;
        event.mode = mode || event.mode;
        event.ticketsAvailable = ticketsAvailable || event.ticketsAvailable;
        event.ticketPrice = ticketPrice || event.ticketPrice;

        await event.save();
        return res.status(200).json({ message: "Event updated successfully", event });
    } catch (error) {
        return res.status(500).json({ error: "Error updating event details" });
    }
};

export const updateBookingStatus = async (req, res) => {
    const { eventId } = req.params;
    const { bookingStatus } = req.body;

    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        if (['open', 'closed'].includes(bookingStatus)) {
            event.bookingStatus = bookingStatus;
            await event.save();
            return res.status(200).json({ message: "Booking status updated successfully", event });
        } else {
            return res.status(400).json({ error: "Invalid booking status" });
        }
    } catch (error) {
        return res.status(500).json({ error: "Error updating booking status" });
    }
};
