---
title: Authentication
description: Learn how to authenticate with Web PubSub for Socket.IO. 
keywords: Socket.IO, Socket.IO on Azure, authentication
author: xingsy97
ms.author: siyuanxing
ms.date: 09/22/2023
ms.service: azure-web-pubsub
ms.topic: how-to
---
# How to use authentication in Web PubSub for Socket.IO
## Background
[Socket.IO protocol](https://socket.io/docs/v4/socket-io-protocol/) is an application layer protocol, which is built on a transport layer protocol named [Engine.IO protocol](https://socket.io/docs/v4/engine-io-protocol/). 
Engine.IO is responsible for establishing the low-level connection between the server and the client. An Engine.IO connection manages exactly one real connection, which is either a HTTP long-polling connection or a WebSocket connection.

[Native authentication mechanism provided by Socket.IO library](https://socket.io/docs/v4/middlewares/#sending-credentials) are applied on Socket.IO connection level. The Engine.IO connection has already been built successfully before the authentication takes effect. The underlying Engine.IO connection could be built between client and server without any authentication mechanism. Attackers could make use of Engine.IO connection without any authentication to consume customer's resource without any restriction. 

## Authentication for Socket.IO connection
This level of authentication is NOT recommended in production environment. For it doesn't provide any protection for the low-level Engine.IO connection, which makes your resource easy to be attacked.

## Authentication for Engine.IO connection
This level of authentication is recommended for it protects the Engine.IO connection.
However, Socket.IO library didn't provide a native and easy-to-use feature for it. Our server SDK provides a negotiation mechanism and APIs to realize it.

Client sends negotiation request containing authentication information to server before the Engine.IO connection is built. Here are the details how the mechanism works:
 
1. Before connecting with the service endpoint, the client sends negotiation to the server, which carries information required by authentication. 
2. The server receives the negotiation request, parse the authentication information and authenticate the client according to the parsed information. Then the server responds the request with an access token. 
3. The client connects with the service endpoint with the access token given by server. The access token is put into the query string of Socket.IO request.

The web application that handles negotiation request could be an independent one or a part of Socket.IO application.

### Usage of simple negotiation
- Server-side

1. Create a Socket.IO server supported by the service
```javascript
const azure = require("@azure/web-pubsub-socket.io");
const app = express();
const server = require('http').createServer(app);

const io = require('socket.io')(server);
const wpsOptions = { hub: "eio_hub", connectionString: process.env.WebPubSubConnectionString };

azure.useAzureSocketIO(io, wpsOptions);
```

2. Define a `ConfigureNegotiateOptions`, which parses authentication information from the negotiation request and executes the authentication. If the authentication is passed, the method returns required information to generate an access token.

```javascript
const configureNegotiateOptions = (req) => {
    const query = parse(req.url || "", true).query
    const username = query["username"] ?? "annoyomous";
    const expirationMinutes = Number.parseInt(query["expirationMinutes"]) ?? 600;
    if (!authentiacte(username)) {
        throw new Error(`Authentication Failed for username = ${username}`);
    }
    return {
        userId: username,
        expirationTimeInMinutes: expirationMinutes
    };
}
```

3. Use `negotiate` to convert the Socket.IO server and `ConfigureNegotiateOptions` into a complete express handler:
```javascript
app.get("/negotiate", azure.negotiate(io, configureNegotiateOptions))
```


- Client-side
1. Execute the negotiation request and parse the result
```javascript
const negotiateResponse = await fetch(`/negotiate/?username=${username}&expirationMinutes=600`);
if (!negotiateResponse.ok) {
  console.log("Failed to negotiate, status code =", negotiateResponse.status);
  return ;
}
const json = await negotiateResponse.json();
```

2. Let the client connect with our service endpoint with the information in negotiation response.
```javascript
var socket = io(json.endpoint, {
  path: json.path,
  query: { access_token: json.token }
});
```

A complete sample is given in [chat-with-negotiate](https://github.com/Azure/azure-webpubsub/blob/main/sdk/webpubsub-socketio-extension/examples/chat-with-negotiate/index.js).

### Integration with Passport library

#### Background
In Node.js ecosystem, the most dominant Web authentication workflow is [`express`](https://www.npmjs.com/package/express) + [`express-session`](https://www.npmjs.com/package/express-session) + [`passport`](https://www.npmjs.com/package/passport). Here's a list explaining their roles:
- `express`: a backend framework
- `express-session`: an official session management library supported by Express team.
- `passport`: an authentication package for express. It focuses on request authentication and supports over 500 authentication strategies, including local authentication (username and password), OAuth (Google, GitHub, Facebook), JWT, OpenID, and more.
  - After a successful authentication, `passport` provides an object describing the authenticated user. This object is assigned to the `user` property in the express request variable. And the property could be accessed in subsequent middleware.

#### Usage

We provide a method to create `ConfigureNegotiateOptions` that puts information related to passport into negotiation response. And an express middleware `restorePassport` is provided to restore passport object into request.

Socket.IO provides a [example](https://github.com/socketio/socket.io/blob/4.6.2/examples/passport-example/index.js) showing how to use passport authentication with native Socket.IO library.

This part of code uses a set of Socket.IO middleware to restore passport object into request.
```javascript
const io = require('socket.io')(server);

// convert a connect middleware to a Socket.IO middleware
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

io.use((socket, next) => {
  if (socket.request.user) {
    next();
  } else {
    next(new Error('unauthorized'))
  }
});
```

After using `useAzureSocketIO` to enable the service, the developer should add a negotiation handler to express app. `usePassport` generates its `ConfigureNegotiateOptions`.
Then the express `restorePassport` should be used as a Socket.IO middleware to restore passport object into `socket.request`. 

```javascript
const io = require('socket.io')(server);

await useAzureSocketIO(io, { ...wpsOptions });

app.get("/negotiate", negotiate(io, usePassport()));

io.use(wrap(restorePassport()));

io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

io.use((socket, next) => {
  if (socket.request.user) {
    next();
  } else {
    next(new Error('unauthorized'))
  }
});
```

Session object isn't restored and it's inaccessible by Socket.IO middleware. `socket.request.session` doesn't work for it's always null.
```javascript
io.use((socket, next) => {
  var session = socket.request.session; 
  // ... some code uses `session`
});

io.on('connect', (socket) => {
  const session = socket.request.session;
  // ... some code uses `session`
});
```

A complete sample is given in [chat-with-auth-passport](https://github.com/Azure/azure-webpubsub/blob/main/sdk/webpubsub-socketio-extension/examples/chat-with-auth-passport).