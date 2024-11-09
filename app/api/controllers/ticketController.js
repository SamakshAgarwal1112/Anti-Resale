import Ticket from "../models/ticketModel";
import Event from "../models/eventModel";
import User from "../models/userModel";

export const bookTicket = async (req, res) => {
    const { eventId, aadharNumbers } = req.body;
    const userId = req.userId;
    
    if (!Array.isArray(aadharNumbers) || aadharNumbers.length === 0) {
        return res.status(400).json({ error: "Aadhar numbers are required for booking tickets" });
    }

    try {
        const event = await Event.findById(eventId);
        if (!event || event.bookingStatus !== 'open') {
            return res.status(404).json({ error: "Event is not available or booking is closed" });
        }

        if (!event.isTicketAvailable()) {
            return res.status(400).json({ error: "No tickets available for this event" });
        }

        const tickets = aadharNumbers.map(aadharNumber => ({
            event: eventId,
            owner: userId,
            isIssued: true,
            issuedAt: new Date(),
            aadharNumber: aadharNumber,
        }));

        await Ticket.insertMany(tickets);

        event.ticketsBooked += aadharNumbers.length;
        event.ticketsAvailable -=aadharNumbers.length;
        await event.save();

        return res.status(201).json({ message: `${aadharNumbers.length} tickets booked successfully` });
    } catch (error) {
        return res.status(500).json({ error: "Error booking tickets" });
    }
};

export const getUserTickets = async (req, res) => {
    const userId = req.userId;

    try {
        const tickets = await Ticket.find({ owner: userId })
            .populate('event', 'name date time')
            .sort({ issuedAt: -1 });

        return res.status(200).json(tickets);
    } catch (error) {
        return res.status(500).json({ error: "Error fetching tickets" });
    }
};

export const returnTicket = async (req, res) => {
    const { ticketId } = req.params;

    try {
        const ticket = await Ticket.findById(ticketId).populate('event');
        if (!ticket) {
            return res.status(404).json({ error: "Ticket not found" });
        }

        if (ticket.isIssued === false) {
            return res.status(400).json({ error: "Ticket is already returned" });
        }

        const event = ticket.event;
        const returnDate = new Date();

        ticket.isIssued = false;
        ticket.issuedAt = null;
        await ticket.save();

        event.ticketsBooked -= 1;

        setTimeout(async () => {
            event.ticketsAvailable += 1;
            await event.save();
        }, 24 * 60 * 60 * 1000);

        await event.save();
        return res.status(200).json({ message: "Ticket returned successfully, available for re-buy in 24 hours" });
    } catch (error) {
        return res.status(500).json({ error: "Error returning ticket" });
    }
};

export const lockTicket = async (req, res) => {
    const { ticketId } = req.params;

    try {
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({ error: "Ticket not found" });
        }

        if (ticket.isIssued) {
            return res.status(400).json({ error: "Ticket is already locked/issued" });
        }

        ticket.isIssued = true;
        ticket.issuedAt = new Date();
        await ticket.save();

        return res.status(200).json({ message: "Ticket successfully locked and issued" });
    } catch (error) {
        return res.status(500).json({ error: "Error locking ticket" });
    }
};