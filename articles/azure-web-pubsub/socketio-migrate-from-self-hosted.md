---
title: How to migrate a self-hosted Socket.IO to fully managed on Azure
description: A tutorial...
author: xingsy97

ms.author: xingsy97
ms.date: 07/21/2023
ms.service: azure-web-pubsub
ms.topic: how-to
---

# How to migrate a self-hosted Socket.IO app to fully managed on Azure
>[!NOTE]
> Web PubSub for Socket.IO is in "Private Preview" and is available to selected customers only. If you wish... please...

## Prerequisites
> [!div class="checklist"]
> * An Azure account with an active subscription. If you don't have one, you can [create a free accout](https://azure.microsoft.com/en-us/free/). 
> * Some familiarity with Socket.IO library.

## Create a Web PubSub for Socket.IO resource
[...content missing!!!!]
**Subscription**: AzureSignalR Dogfood SoutheastAsia
**Region**: Southeast Asia

## Migrate an official Socket.IO sample app 
To focus this guide to the migration, we are going to use a sample chat app provided on [Socket.IO's website](https://github.com/socketio/socket.io/tree/4.6.2/examples/chat). We need to make some minor changes to both the **server-side** and **client-side** code.

### Server side
Locate `index.js` in the server-side code.

1. Add package `@azure/web-pubsub-socket.io`
```bash
npm install @azure/web-pubsub-socket.io
```

2. Import package in server code `index.js`
```javascript
const wpsExt = require("@azure/web-pubsub-socket.io")
```

3. Add configuration so that the server can connect with your Web PubSub for Socket.IO resource.
```javascript
const wpsOptions = {
    hub: "eio_hub",
    connectionString: process.argv[2]
};
```
	
4. Locate in your server-side code where Socket.IO server is created and append `.useAzureSocketIO(wpsOptinos)` to its end:
```javascript
const io = await require('socket.io')(server).useAzureSocketIO(wpsOptions);
```
>[!IMPORTANT]
> `useAzureSocketIO` is an asynchorouns method. Here we `await` ... So you need to wrap it and related code in an asynchrouns function.

5. Following server APIs are asynchronous now, add `async` before using them
- [server.socketsJoin](https://socket.io/docs/v4/server-api/#serversocketsjoinrooms)
- [server.socketsLeave](https://socket.io/docs/v4/server-api/#serversocketsleaverooms)
- [socket.join](https://socket.io/docs/v4/server-api/#socketjoinroom)
- [socket.leave](https://socket.io/docs/v4/server-api/#socketleaveroom)

For example, if there is code like:
```javascript
io.on("connection", (socket) => { socket.join("room abc"); });
```
you should update it to:
```javascript
io.on("connection", async (socket) => { await socket.join("room abc"); });
```

In this chat example, none of them are used. So no change is needed.

### Client Side
In client-side code `./public/main.js`

1. Find where Socket.IO client is created. Then replace its endpoint with Azure Socket.IO endpoint and add add an `path` option.
Here is an example:
```javascript
var socket = io("https://socketio.webpubsubdev.azure.com", {
    path: "/clients/socketio/hubs/eio_hub",
});
```


## Server APIs supported by Web PubSub for Socket.IO

Socket.IO library provides a set of [server API](https://socket.io/docs/v4/server-api/). 
The following server APIs are partially supported or unsupported by Web PubSub for Socket.IO.

| Server API                                                                                                   | Support     |
|--------------------------------------------------------------------------------------------------------------|-------------|
| [fetchSockets](https://socket.io/docs/v4/server-api/#serverfetchsockets)                                     | Local only  |
| [serverSideEmit](https://socket.io/docs/v4/server-api/#serverserversideemiteventname-args)                   | Unsupported  |
| [serverSideEmitWithAck](https://socket.io/docs/v4/server-api/#serverserversideemitwithackeventname-args)     | Unsupported |

Apart from the mentioned server APIs, all other server APIs are fully supported.