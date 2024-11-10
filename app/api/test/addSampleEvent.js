// app/api/event/addSampleEvent/route.js
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/app/api/utils/dbConnect';
import Event from '@/app/api/models/eventModel';

// Connect to the database
connectDB();

export async function POST(req) {
  // Define sample event data
  const sampleEvent = {
    name: "Sample Web3 Conference",
    date: new Date("2024-03-15"),
    time: "10:00",
    venue: "San Francisco, CA",
    description: "A conference focusing on Web3 technologies and their impact on the future.",
    createdBy: new mongoose.Types.ObjectId(), // Replace with a real user ID if available
    photo: "/sample-event.jpg", // Replace with actual path to an image
    mode: "offline",
    ticketsAvailable: 100,
    ticketsBooked: 10,
    bookingStatus: "open",
    ticketPrice: 0.5,
  };

  try {
    const event = new Event(sampleEvent);
    await event.save();
    return NextResponse.json({ message: "Sample event created", event }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating event", error }, { status: 500 });
  }
}
