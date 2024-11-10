// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
 
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract EventTicketing is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
 
    Counters.Counter private _nextTokenId;
    uint256 public totalTickets;
    uint256 public soldTickets;
    uint256 public lockingPeriod;
 
    enum TicketStatus { Active, Refunded }
    mapping(uint256 => TicketStatus) public ticketStatus;
 
    mapping(bytes32 => string) public aadharHashToPhotoId;
    mapping(uint256 => bytes32) public ticketToAadharHash;
    mapping(uint256 => uint256) public ticketPurchaseTime;
 
    event TicketPurchased(uint256 tokenId);
    event TicketRefundRequested(uint256 tokenId);
    event TicketAvailableForPurchase(uint256 tokenId);
    event AadharRegistered(bytes32 aadharHash, string photoId);
 
    // Constructor, initializing ERC721 with name, symbol
    constructor(uint256 _totalTickets, uint256 _lockingPeriod) 
        ERC721("EventTicket", "ETK") 
    {
        totalTickets = _totalTickets;
        lockingPeriod = _lockingPeriod;
        soldTickets = 0;
    }
 
    // Securely register Aadhar and photo ID
    function registerAadharAndPhotoId(uint256 aadharNumber, string memory photoId) public {
        bytes32 aadharHash = keccak256(abi.encodePacked(aadharNumber));
        require(bytes(aadharHashToPhotoId[aadharHash]).length == 0, "Aadhar already registered");
 
        aadharHashToPhotoId[aadharHash] = photoId;
        emit AadharRegistered(aadharHash, photoId);
    }
 
    // Mint a ticket if Aadhar is verified
    function mintTicket(address to, string memory uri, uint256 aadharNumber) public onlyOwner {
        require(soldTickets < totalTickets, "All tickets sold out");
 
        bytes32 aadharHash = keccak256(abi.encodePacked(aadharNumber));
        require(bytes(aadharHashToPhotoId[aadharHash]).length > 0, "User Aadhar not registered");
 
        uint256 tokenId = _nextTokenId.current();
        _nextTokenId.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        ticketPurchaseTime[tokenId] = block.timestamp;
        ticketToAadharHash[tokenId] = aadharHash;
        ticketStatus[tokenId] = TicketStatus.Active;
        soldTickets++;
 
        emit TicketPurchased(tokenId);
    }
 
    // Get available tickets
    function getAvailableTickets() public view returns (uint256) {
        return totalTickets - soldTickets;
    }
 
    // Request refund for a ticket
    function requestRefund(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Only the ticket owner can request a refund");
        require(ticketStatus[tokenId] == TicketStatus.Active, "Ticket already refunded");
        require(block.timestamp >= ticketPurchaseTime[tokenId] + lockingPeriod, "Refund request before locking period");
 
        ticketStatus[tokenId] = TicketStatus.Refunded;
        soldTickets--;
 
        emit TicketRefundRequested(tokenId);
        emit TicketAvailableForPurchase(tokenId);
    }
}