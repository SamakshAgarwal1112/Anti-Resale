'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Badge } from "@/components/ui/badge";
import { Web3Auth } from '@web3auth/modal';
import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from '@web3auth/base';
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';
import { Coins, Leaf, User, LogOut, ChevronDown, LogIn } from 'lucide-react';
import AadharModal from '@/components/Modal'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';

const clientId = process.env.WEB3_CLIENT_ID || '';
console.log(cle)

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

export default function Header({ totalEarnings }) {
  const [provider, setProvider] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [balance, setBalance] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aadharId, setAadharId] = useState('');
  const [isAadharSubmitted, setIsAadharSubmitted] = useState(false);
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
          if (user.email) {
            localStorage.setItem('userEmail', user.email);
            try {
              await createUser(user.email, user.name || 'Anonymous user');
            } catch (error) {
              console.error('Error creating user', error);
            }
          }
        }
      } catch (error) {
        console.error("Error init web3 auth", error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    const fetchUserBalance = async () => {
      if (userInfo && userInfo.email) {
        const user = await getUserByEmail(userInfo.email);
        if (user) {
          const userBalance = await getUserBalance(user.id);
          setBalance(userBalance);
        }
      }
    };
    fetchUserBalance();
  }, [userInfo]);

  const handelLogin = async () => {
    if (!web3Auth) {
      console.log('Not initialised web3Auth');
      return;
    }
    try {
      const web3AuthProvider = await web3Auth.connect();
      setProvider(web3AuthProvider);
      setLoggedIn(true);
      const user = await web3Auth.getUserInfo();
      setUserInfo(user);
      if (user) {
        setIsModalOpen(true);
      }
      if (user.email) {
        localStorage.setItem('userEmail', user.email);
        try {
          await createUser(user.email, user.name || 'Anonymous User');
        } catch (error) {
          console.error('Error creating user', error);
        }
      }
    } catch (error) {
      console.error('Error logging in', error);
    }
  };

  const handleLogOut = async () => {
    if (!web3Auth) {
      console.log('Not initialised web3Auth');
      return;
    }
    try {
      await web3Auth.logout();
      setProvider(null);
      setLoggedIn(false);
      setUserInfo(null);
      localStorage.removeItem('userEmail');
    } catch (error) {
      console.error('Error logging out', error);
    }
  };

   const handleAadharSubmit = async () => {
    try {
        const response = await axios.post('/api/submitAadhar', {aadharId});
        console.log('Aadhar submitted to backend', response.data)
    } catch (error) {
        console.error('Error submitting aadhar number', error);
    }
   }
  if (loading) {
    return <div>Loading Web3 Auth.......</div>;
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="flex items-center justify-between px-8 py-4">
        {/* Logo Section */}
        <div className="flex items-center space-x-2">
          <div className="bg-blue-500 rounded-full p-2">
            <span className="text-white font-bold">T</span>
          </div>
          <span className="text-black font-semibold text-lg">TON</span>
        </div>

        {/* Navigation Links */}
        <nav className="flex space-x-6 text-black font-medium">
          <Link href="/use">
            <span className="hover:text-blue-600 cursor-pointer">Use</span>
          </Link>
          <Link href="/learn">
            <span className="hover:text-blue-600 cursor-pointer">Learn</span>
          </Link>
          <Link href="/build">
            <span className="hover:text-blue-600 cursor-pointer">Build</span>
          </Link>
          <Link href="/community">
            <span className="hover:text-blue-600 cursor-pointer">Community</span>
          </Link>
        </nav>

        {/* Login/Logout Button */}
        <div>
          {!loggedIn ? (
            <Button onClick={handelLogin} className="bg-blue-600 hover:bg-blue-700 text-white">
              Login
            </Button>
          ) : (
            <Button onClick={handleLogOut} className="bg-blue-600 hover:bg-blue-700 text-white">
              Logout
            </Button>
          )}
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="bg-white rounded-lg shadow-lg p-6 text-center max-w-sm mx-auto">
            <DialogHeader>
              <DialogTitle>Enter Aadhar ID and Name</DialogTitle>
            </DialogHeader>
            <Input
              type="text"
              placeholder="Aadhar ID"
              value={aadharId}
              onChange={(e) => setAadharId(e.target.value)}
              maxLength={12}
              className="w-full mt-4 p-2 border rounded-lg"
            />
            <Input
              type="text"
              placeholder="Your Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full mt-4 p-2 border rounded-lg"
            />
            <Button
              onClick={handleAadharSubmit}
              className="mt-4 bg-blue-600 text-white w-full"
            >
              Submit
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}
