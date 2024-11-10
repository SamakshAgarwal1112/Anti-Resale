'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Ticket, Search, Calendar, Shield, Users, Star } from 'lucide-react'

// Importing UI components
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Web3Auth } from '@web3auth/modal';
import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from '@web3auth/base';
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';
import AadharModal from '@/components/Modal';
import axios from 'axios';


const clientId = process.env.WEB3_CLIENT_ID || '';

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: '0xaa36a7',
  rpcTarget: 'https://rpc.ankr.com/eth_sepolia',
  displayName: 'Sepolia Testnet',
  blockExplorerId: 'https://sepolia.etherscan.io',
  ticker: 'ETH',
  tickerName: 'Ethereum',
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

const web3Auth = new Web3Auth({
  clientId,
  web3AuthNetwork: 'sapphire_devnet',
  privateKeyProvider,
});

export default function LandingPage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [provider, setProvider] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aadharId, setAadharId] = useState('');
  const [userName, setUserName] = useState('');
  

  useEffect(() => {
    const init = async () => {
      try {
        await web3Auth.initModal();
        setProvider(web3Auth.provider);
        if (web3Auth.connected) {
          setLoggedIn(true);
          const user = await web3Auth.getUserInfo();
          setUserInfo(user);
        }
      } catch (error) {
        console.error("Error initializing Web3Auth:", error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleLogin = async () => {
    try {
      const web3AuthProvider = await web3Auth.connect();
      setProvider(web3AuthProvider);
      setLoggedIn(true);
      const user = await web3Auth.getUserInfo();
      setUserInfo(user);
      if (user) setIsModalOpen(true);
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const handleLogOut = async () => {
    try {
      await web3Auth.logout();
      setProvider(null);
      setLoggedIn(false);
      setUserInfo(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleAadharSubmit = async () => {
    try {
      const response = await axios.post('/api/submitAadhar', { aadharId });
      console.log('Aadhar submitted:', response.data);
    } catch (error) {
      console.error("Error submitting Aadhar:", error);
    }
  };


  const testimonials = [
    { name: "Alex Johnson", role: "Event Organizer", content: "TicketChain has revolutionized how we manage our events. The blockchain technology ensures security and transparency like never before." },
    { name: "Sarah Lee", role: "Concert Attendee", content: "I love how easy it is to buy and transfer tickets. The peace of mind knowing my tickets are authentic is priceless." },
    { name: "Michael Brown", role: "Festival Director", content: "The analytics and insights provided by TicketChain have helped us optimize our events and increase attendance significantly." },
  ]

  if (loading) {
    return <div>Loading Web3 Auth...</div>;
  }

  return (
    <div className="min-h-screen bg-white ">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-semibold text-blue-600">
              TicketChain
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/explore" className="text-sm font-medium text-gray-600 hover:text-blue-600">
                Explore
              </Link>
              <Link href="/book" className="text-sm font-medium text-gray-600 hover:text-blue-600">
                Book
              </Link>
              <div>
              {!loggedIn ? (
                <Button onClick={handleLogin} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Login
                </Button>
              ) : (
                <Button onClick={handleLogOut} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Logout
                </Button>
              )}
                          {isModalOpen && (
                <AadharModal
                    userName={userName}
                    onSubmit={handleAadharSubmit}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
            </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="flex min-h-screen flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <h1 className="text-[clamp(2.5rem,8vw,5.5rem)] font-bold leading-none tracking-tight">
              The Decentralized
              <br />
              <span className="text-blue-600">ticketing network</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mt-6">
              A secure and transparent ticketing platform, powered by blockchain technology
              and built for everyone.
            </p>
            <div className="flex gap-4 pt-8 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Explore Events
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </motion.div>
        </section>

        <section className="py-24">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Choose TicketChain?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="flex flex-col items-center p-6">
                <Shield className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Secure</h3>
                <p className="text-center text-gray-600">Blockchain technology ensures your tickets are tamper-proof and authentic.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center p-6">
                <Search className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Easy to Use</h3>
                <p className="text-center text-gray-600">Intuitive interface for buying, selling, and transferring tickets with ease.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center p-6">
                <Users className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Community-Driven</h3>
                <p className="text-center text-gray-600">A platform that puts the power back in the hands of event organizers and attendees.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-24 bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="flex items-start">
                <Ticket className="w-8 h-8 text-blue-600 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Smart Tickets</h3>
                  <p className="text-gray-600">Each ticket is a unique token on the blockchain, ensuring authenticity and preventing fraud.</p>
                </div>
              </div>
              <div className="flex items-start">
                <Calendar className="w-8 h-8 text-blue-600 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Event Management</h3>
                  <p className="text-gray-600">Powerful tools for organizers to create, manage, and analyze their events.</p>
                </div>
              </div>
              <div className="flex items-start">
                <Users className="w-8 h-8 text-blue-600 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Easy Transfer</h3>
                  <p className="text-gray-600">Securely transfer tickets to friends or resell them on our built-in marketplace.</p>
                </div>
              </div>
              <div className="flex items-start">
                <Shield className="w-8 h-8 text-blue-600 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Fraud Prevention</h3>
                  <p className="text-gray-600">Advanced algorithms and blockchain technology work together to prevent ticket fraud.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24">
          <h2 className="text-3xl font-bold mb-12 text-center">What Our Users Say</h2>
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[0, 1, 2, 3, 4].map((star) => (
                    <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">{testimonials[activeTestimonial].content}</p>
                <p className="font-semibold">{testimonials[activeTestimonial].name}</p>
                <p className="text-sm text-gray-500">{testimonials[activeTestimonial].role}</p>
              </CardContent>
            </Card>
            <div className="flex justify-center mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full mx-1 ${
                    index === activeTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                  onClick={() => setActiveTestimonial(index)}
                  aria-label={`View testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-blue-600 text-white -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Revolutionize Your Event Experience?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">Join TicketChain today and experience the future of event ticketing. Secure, transparent, and effortless.</p>
            <Button size="lg" variant="secondary">
              Get Started Now
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                TicketChain
              </Link>
              <p className="text-sm text-gray-600 mt-2">Decentralized Ticketing for Everyone</p>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/about" className="text-sm text-gray-600 hover:text-blue-600">
                About
              </Link>
              <Link href="/faq" className="text-sm text-gray-600 hover:text-blue-600">
                FAQ
              </Link>
              <Link href="/contact" className="text-sm text-gray-600 hover:text-blue-600">
                Contact
              </Link>
              <Link href="/privacy" className="text-sm text-gray-600 hover:text-blue-600">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-gray-600 hover:text-blue-600">
                Terms of Service
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-gray-600">
            © {new Date().getFullYear()} TicketChain. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}