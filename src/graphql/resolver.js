/**
 * リゾルバ関数
 * リゾルバ関数とは特定のフィールドのデータを返す関数で、実際のデータ操作を行う部分
 */
// クラスのインポート
const RandomDie = require("./type/RandomDie");
const Message = require("./type/Message");
module.exports = class Resolver {
    constructor() {
        this.fakeDatabase = {};
    }
    hello() {
        return "Hello world!";
    }
    quoteOfTheDay() {
        return Math.random() < 0.5 ? 'Take it easy' : 'Salvation lies within';
    }
    rollThreeDice() {
        return [1, 2, 3].map((_) => 1 + Math.floor(Math.random() * 6));
    }
    rollDice(numDice, numSides) {
        let output = [];
        for (var i = 0; i < numDice; i++) {
            output.push(1 + Math.floor(Math.random() * (numSides || 6)));
        }
        return output;
    }
    getDie({numSides}) {
        return new RandomDie(numSides || 6);
    }
    getMessage({id}) {
        if (!this.fakeDatabase[id]) {
            throw new Error('no message exists with id' + id)
        }
        return new Message(id, this.fakeDatabase[id]);
    }
    createMessage({input}) {
        let id = require('crypto').randomBytes(10).toString('hex');
        this.fakeDatabase[id] = input;
        return new Message(id,input)
    }
    updateMessage({id,input}) {
        if (!this.fakeDatabase[id]) {
            throw new Error('no message exists with id' + id)
        }
        this.fakeDatabase[id] = input;
        return new Message(id,input)
    }
}