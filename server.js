const express = require("express");
const {graphqlHTTP} = require("express-graphql");
const {buildSchema} = require("graphql");

// Graphqlスキーマ言語を記述してスキーマを構築する
// スキーマはあくまで定義のみで実際のデータ操作は行わない
const schema = buildSchema(`
    input MessageInput {
        content: String
        author: String
    }
    
    type RandomDie {
        numSides: Int!
        rollOnce: Int!
        roll(numRolls: Int!): [Int]
    }
    
    type Query {
        hello: String
        quoteOfTheDay: String
        random: Float!
        rollThreeDice: [Int]
        rollDice(numDice: Int!, numSides: Int): [Int]
        getDie(numSides: Int): RandomDie
    }
`);

// リゾルバ関数内の処理をクラス化することも可能です。
class RandomDie {
    constructor(numSides) {
        this.numSides = numSides;
    }

    rollOnce() {
        return 1 + Math.floor(Math.random() * this.numSides);
    }

    roll({numRolls}) {
        let output = [];
        for (var i = 0; i < numRolls; i++) {
            output.push(this.rollOnce());
        }
        return output;
    }
}

// リゾルバ関数
// リゾルバ関数とは特定のフィールドのデータを返す関数で、実際のデータ操作を行う部分
const root = {
    hello: () => {
        return 'Hello world!'
    },
    quoteOfTheDay: () => {
        return Math.random() < 0.5 ? 'Take it easy' : 'Salvation lies within';
    },
    random: () => {
        return Math.random();
    },
    rollThreeDice: () => {
        return [1, 2, 3].map((_) => 1 + Math.floor(Math.random() * 6));
    },
    rollDice: ({numDice, numSides}) => {
        let output = [];
        for (var i = 0; i < numDice; i++) {
            output.push(1 + Math.floor(Math.random() * (numSides || 6)));
        }
        return output;
    },
    getDie: ({numSides}) => {
        return new RandomDie(numSides || 6);
    }
};

// Expressでサーバーを立てる
// graphiql: true　としたので Graphqlとして利用可能
const app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
app.listen(4000);
console.log('Running a Graphql API server at http://localhost:4000/graphiql');