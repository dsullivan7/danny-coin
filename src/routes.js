import express from 'express'
import uuid from 'uuid/v4'

import blockchain from './blockchain'

const routes = express.Router()
const nodeName = uuid()

routes.post('/blocks', (req, res) => {
  const lastBlock = blockchain.lastBlock()
  const lastProof = lastBlock.proof
  const proof = blockchain.proofOfWork(lastProof)

  blockchain.newTransaction('0', nodeName, 1)

  const previousHash = blockchain.hashBlock(lastBlock)
  const block = blockchain.newBlock(proof, previousHash)

  const response = {
    message: 'new block forged',
    index: block.index,
    transactions: block.transactions,
    proof: block.proof,
    previousHash: block.previousHash,
  }

  res.status(201).send(response)
})

routes.post('/transactions', (req, res) => {
  const { sender, recipient, amount } = req.body
  blockchain.newTransaction(sender, recipient, amount)
  res.status(201).send({
    message: 'new transaction created',
  })
})

routes.get('/chain', (req, res) => {
  const response = {
    chain: blockchain.chain,
    length: blockchain.chain.length,
  }

  res.status(200).send(response)
})

export default routes
