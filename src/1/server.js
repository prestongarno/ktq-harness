/*
 * Copyright (C) 2017 Preston Garno
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

const express = require('express');
const graphqlHTTP = require('express-graphql');
const graphqlTools = require('graphql-tools');

const schemaText = `

  type Query {
    me: Actor
  }
  
  union Actor = User | Bot
  
  type User {
    name: String
  }
  
  type Bot {
    name: String
    owner: Actor
  }
`;

const resolvers = {

  Query: {
    me: () => {
      return {
        name: () => "Mr. Robot",
        owner: () => { return { name: () => "prestongarno"}}
      }
    },
  },

  Actor: {
    __resolveType(obj, context, info) {
      console.log(obj);
      if (obj.owner) {
        return "Bot"
      } else if (obj.name) {
        return "User"
      } else {
        return null
      }
    },
  },
};

const app = express();

app.get('/status', function (req, res) {
  res.code = 200;
  res.setHeader('Content-Type', 'application/json');
  res.send('{ "status": "okay" }');
});

app.use('/graphql', graphqlHTTP({
  schema: graphqlTools.makeExecutableSchema({
    typeDefs: schemaText, resolvers: resolvers
  }), graphiql: false,
}));

app.listen(4000);
process.title = 'ktq-node';
