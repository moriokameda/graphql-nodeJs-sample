const express = require("express");
const {graphqlHTTP} = require("express-graphql");
const {buildSchema} = require("graphql");
const fs = require("fs")
const Resolver = require("./src/graphql/resolver");

// Graphqlスキーマ言語を記述してスキーマを構築する
// スキーマはあくまで定義のみで実際のデータ操作は行わない
const schema = buildSchema(fs.readFileSync("./src/graphql/schema.graphql", {encoding: 'utf-8'}))


// Expressでサーバーを立てる
// graphiql: true　としたので Graphqlとして利用可能
const app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: new Resolver(),
    graphiql: true
}));
app.listen(4000);
console.log('Running a Graphql API server at http://localhost:4000/graphiql');