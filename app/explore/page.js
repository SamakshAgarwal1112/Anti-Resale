'use client'
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, MapPin, Search, Tag } from "lucide-react";
import Image from "next/image";

export default function Component() {
  const [purchasedEvents, setPurchasedEvents] = useState({});

  const events = [
    {
      id: 1,
      title: "Web3 Conference 2024",
      date: "March 15-17, 2024",
      location: "San Francisco, CA",
      price: "0.5 ETH",
      category: "Technology",
      image: "/gallery_thumb.jpg",
    },
    // ... Other events
  ];

  const handleBuyTicket = (id) => {
    setPurchasedEvents((prev) => ({ ...prev, [id]: true }));
  };

  const handleReturnTicket = (id) => {
    setPurchasedEvents((prev) => ({ ...prev, [id]: false }));
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-600">TicketChain</h1>
          <nav>
            <ul className="flex space-x-4">
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Explore</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Book</a></li>
              <li><Button className="bg-blue-600 hover:bg-blue-700 text-white">Get Started</Button></li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <h2 className="mb-8 text-3xl font-bold text-gray-800">Explore Events</h2>
        
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input className="pl-10 border-gray-300" placeholder="Search events..." />
          </div>
          
          <div className="flex gap-4">
            <Select>
              <SelectTrigger className="w-[160px] border-gray-300">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="art">Art</SelectItem>
                <SelectItem value="gaming">Gaming</SelectItem>
                <SelectItem value="education">Education</SelectItem>
              </SelectContent>
            </Select>
            
            <Select>
              <SelectTrigger className="w-[160px] border-gray-300">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-asc">Date: Earliest first</SelectItem>
                <SelectItem value="date-desc">Date: Latest first</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden border border-gray-200">
              <CardHeader className="p-0">
                <Image
                  alt={event.title}
                  className="aspect-video w-full object-cover"
                  height={400}
                  src={event.image}
                  width={600}
                />
              </CardHeader>
              <CardContent className="p-4">
                <h3 className="mb-2 text-xl font-bold text-gray-800">{event.title}</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-blue-600" />
                    <span>{event.category}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-center p-4 bg-gray-50 space-y-2">
                <span className="font-bold text-gray-800">{event.price}</span>
                {!purchasedEvents[event.id] ? (
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => handleBuyTicket(event.id)}
                  >
                    Buy Ticket
                  </Button>
                ) : (
                  <Button 
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => handleReturnTicket(event.id)}
                  >
                    Return Ticket
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
