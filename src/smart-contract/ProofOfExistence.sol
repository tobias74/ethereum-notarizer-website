pragma solidity ^0.6.0;

contract ProofOfExistence {
    
    struct Record {
        uint mineTime;
        uint blockNumber;
    }
  
    mapping (bytes32 => Record) private proofs;
    
    event DocumentNotarized(
        address from,
        bytes32 hash,
        uint mineTime,
        uint blockNumber
    );
    
    function notarize(bytes32 hash) public {
        require(proofs[hash].mineTime == 0);
        Record memory newRecord = Record(now, block.number);
        proofs[hash] = newRecord;
        emit DocumentNotarized(msg.sender, hash, newRecord.mineTime, newRecord.blockNumber);
    }
    
    function getByHash(bytes32 hash) public view returns (uint, uint) {
        return (proofs[hash].mineTime, proofs[hash].blockNumber);        
    }
}
