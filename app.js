const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const isAuth = require('./midelware/isAuth');
const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');

const app = express();
app.use(bodyParser.json());

app.use(isAuth);

app.use('/graphql', graphqlHTTP({
  schema: graphQlSchema,
  rootValue: graphQlResolvers,
  graphiql: true,
}));

try {
  mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${encodeURI(process.env.MONGO_PASSWORD)}@cluster0-uknzq.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`);

  app.listen(3000);
} catch (error) {
  console.log(error);
}

