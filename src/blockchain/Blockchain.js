import stringify from 'json-stable-stringify'
import sjcl from 'sjcl'

export default class Blockchain {
  constructor() {
    this.chain = []
    this.currentTransactions = []

    // create the genesis block
    this.newBlock(100, 1)
  }

  hashBlock = block => this.hash(stringify(block))

  hash = (string) => {
    const bitArray = sjcl.hash.sha256.hash(string)
    return sjcl.codec.hex.fromBits(bitArray)
  }

  newBlock = (proof, previousHash) => {
    const index = this.chain.length + 1
    const timestamp = Date.now()
    const transactions = this.currentTransactions.slice(0)
    const blockPreviousHash = (
      previousHash ||
      this.hash(stringify(this.chain[this.chain.length - 1]))
    )

    const block = {
      index,
      timestamp,
      transactions,
      proof,
      previousHash: blockPreviousHash,
    }

    // reset the current transactions
    this.currentTransactions = []
    this.chain.push(block)

    return block
  }

  newTransaction = (sender, recipient, amount) => {
    this.currentTransactions.push({
      sender,
      recipient,
      amount,
    })

    return this.lastBlock().index + 1
  }

  lastBlock = () => this.chain[this.chain.length - 1]

  proofOfWork = (lastProof) => {
    let proof = 0
    while (this.validProof(lastProof, proof) === false) {
      proof += 1
    }

    return proof
  }

  validProof = (lastProof, proof) => {
    const guess = `${lastProof}${proof}`
    const guessHash = this.hash(guess)
    return guessHash.substr(guessHash.length - 3) === '000'
  }
}
