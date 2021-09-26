const SHA256 = require("crypto-js/sha256");

class Transaction {
    constructor(fromAddress, toAddress, amt) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amt = amt;
    }
}

class Block {
    constructor(timestamp, transactions, previousHash = '') {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.index + this.timestamp + this.data + this.previousHash + JSON.stringify(this.transactions) + this.nonce).toString();

    }

    mineNewBlock(difficulty) {
        while (this.hash.substring(0, difficulty) != Array(difficulty + 1).join(0)) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("A new-block mined hash = " + this.hash);

    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTrans = [];
        this.miningReward = 10;
    }
    createGenesisBlock() {
        return new Block('01/11/2000', "This is genesis", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(mineRewardAddress) {
        let block = new Block(Date.now(), this.pendingTrans, this.getLatestBlock().hash);
        block.mineNewBlock(this.difficulty);
        console.log("Block mined successfully");
        this.chain.push(block);
        this.pendingTrans = [new Transaction(null, mineRewardAddress, this.miningReward)];
    }

    createTransaction(transaction) {
        this.pendingTrans.push(transaction);
    }

    getBalanceofAddress(address) {
        let balance = 0;
        for (const block of this.chain) {
            for (const tran of block.transactions) {
                if (tran.fromAddress === address) {
                    balance -= tran.amt;
                }
                if (tran.toAddress === address) {
                    balance += tran.amt;
                }
            }
        }
        return (balance);
    }

}

let BittyCoin = new Blockchain();

let tra1 = new Transaction("tom", "jerry", 100);
BittyCoin.createTransaction(tra1);

let tra2 = new Transaction("jerry", "tom", 20);
BittyCoin.createTransaction(tra2);

console.log("mining started");

BittyCoin.minePendingTransactions("donald");
console.log("tom bal " + BittyCoin.getBalanceofAddress("tom"));
console.log("jerry bal " + BittyCoin.getBalanceofAddress("jerry"));
console.log("donald bal " + BittyCoin.getBalanceofAddress("donald"));

BittyCoin.minePendingTransactions("donald");
console.log("tom bal " + BittyCoin.getBalanceofAddress("tom"));
console.log("jerry bal " + BittyCoin.getBalanceofAddress("jerry"));
console.log("donald bal " + BittyCoin.getBalanceofAddress("donald"));
console.log(JSON.stringify(BittyCoin, null, 4));
console.log(Date.now());