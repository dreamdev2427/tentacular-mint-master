/*
So here are the steps to check if wallet is in WL on the contract:
1. create merkle tree 
let al_leaves = fs.readFileSync('./al.txt', 'utf-8').split(/\r?\n/);        // read file with a wallets list (1 per line)
al_leaves = al_leaves.map(x => keccak(x))                                                           
const al_tree = new MerkleTree(al_leaves, keccak, { sortPairs: true })      // { sortPairs: true } should be set! In other case contract merke library will not be able to check it in correct way

2. get proof for specific wallet using this tree
al_leaf = keccak('0x647a36F2f04f5b54Cb4c8022b9026f7fbDAd7F1b')              // generate keccak from wallet we want to check
al_proof=al_tree.getHexProof(al_leaf)     

3. use this proof calling the corresponded function
await sale_contract.isInALMerkleTree('0x647a36F2f04f5b54Cb4c8022b9026f7fbDAd7F1b', al_proof)
*/

const { MerkleTree } = require('merkletreejs')
const keccak = require('keccak256')
const fs = require('fs');

// Create AL root
let al_leaves = fs.readFileSync('./al.txt', 'utf-8').split(/\r?\n/);        // read file with a wallets list (1 per line)
al_leaves = al_leaves.map(x => keccak(x))                                                           
const al_tree = new MerkleTree(al_leaves, keccak, { sortPairs: true })      // { sortPairs: true } should be set! In other case contract merke library will not be able to check it in correct way

al_leaf = keccak('0x647a36F2f04f5b54Cb4c8022b9026f7fbDAd7F1b')              // generate keccak from wallet we want to check
al_proof=al_tree.getHexProof(al_leaf)                                       // get proof for the leaf                     // returns true or false

//////// To check if wallet is in whitelist on the contract side:
await sale_contract.isInALMerkleTree('0x647a36F2f04f5b54Cb4c8022b9026f7fbDAd7F1b', al_proof) // please note that you should call it with wallet address, not keccak(wallet), use isInFreeMerkleTree to check the free mint list instead

/* /////////////////////////////////////
you can also check what this code returns to you
al_root = al_tree.getRoot().toString('hex')
free_root = free_tree.getRoot().toString('hex')

from my side that was
al root
0x19a2573d4a2596824f63c7de22230d5eeef1556319ace1080faff624d21568c9

free root
0x60c61debf4cae71225e74b3cb8a95145ff38f07331e468a7898aeaffa94a07db

these roots uploaded to the contract rn

///////////////////////////////////////////// */