---
title: How to use Azure Socket.IO
description: How to use Azure Socket.IO
author: xingsy97

ms.author: xingsy97
ms.date: 07/21/2023
ms.service: azure-web-pubsub
ms.topic: how-to
---

# How to use Azure Socket.IO

## What is Azure Socket.IO

Azure Socket.IO is a fully-managed cloud service for Socket.IO, the most popular real-time messaging framework in JavaScript. 

## Benefits of using Azure Socket.IO

### High performance, scaliblity and availability

In the design of native Socket.IO, clients establish WebSocket or long-polling connections directly with the server. However, maintaining stateful connections bring heavy workload to Socket.IO server, which significantly limits the maximum concurrent connection number and increases the messaging latency.

In Azure Socket.IO, server won't build connections with numerous clients directly. As the diagram below shown, clients will build connections with managed Azure Socket.IO service. And server will only communicates with the service rather than clients.

Azure Socket.IO is build on the top of Azure Web PubSub service. It is designed for large-scale real-time applications. The service allows multiple instances to work together and scale to millions of client connections. Meanwhile, it also supports multiple global regions for sharding, high availability, or disaster recovery purposes.

:::image type="content" source="./media/howto-use-socketio/architecture.png" alt-text="architecture":::

### Easier to deploy Socket.IO application

Scaling statful connections is a challenging engineering problem. An extra backlane is always necessary to solve it. 

Socket.IO abstracts an concept called "Adapter". It's a component designed to work together with backplanes, such as Redis, MongoDB or Postgres, to handle scaling work. If you are an user of native Socket.IO, you have to build and host a backplane yourself. Besides, extra code logic to utilize the adapter is also necessary.

With the help of Azure Socket.IO, the service handles all the scaling issue, which free customer from hosting backplane and code logic related to adapter.

### Same programming model as native Socket.IO

To use Azure Socket.IO, customer only needs to add several lines of code in server side and change endpoint address in client side. No more change is needed to migrate native Socket.IO application to Azure Socket.IO. Customer will use the exactly programming model and experience as native Socket.IO.

:::image type="content" source="./media/howto-use-socketio/benefits.png" alt-text="benefits":::

## Prerequisites

### Access to Azure Socket.IO

Azure Socket.IO is in the Private Preview stage currently. Only granted customers have access to it.

### Limitation of Azure Socket.IO

Socket.IO provides a set of [server API](https://socket.io/docs/v4/server-api/). 
The following server APIs are partially supported or unsupported by Azure Socket.IO.

| Server API                                                                                                   | Support     |
|--------------------------------------------------------------------------------------------------------------|-------------|
| [fetchSockets](https://socket.io/docs/v4/server-api/#serverfetchsockets)                                     | Local Only  |
| [serverSideEmit](https://socket.io/docs/v4/server-api/#serverserversideemiteventname-args)                   | Unsupprted  |
| [serverSideEmitWithAck](https://socket.io/docs/v4/server-api/#serverserversideemitwithackeventname-args)     | Unsupported |

All the other server APIs are fully supported.

## How to create an Azure Socket.IO resource

Please ensure you create resource in following subscription and region:

**Subscription**: AzureSignalR Dogfood SoutheastAsia

**Region**: Southeast Asia

### Deploy ARM template via Azure Portal 
1. In web browser, open [the template](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Flivedemopackages.blob.core.windows.net%2Ftemplate%2Fazure-socketio-instance.json).
2. Select subscrption and region as required.
3. Type a resource name and create it.

### Deploy ARM template via Azure CLI
1. Download ARM template file via link https://livedemopackages.blob.core.windows.net/template/azure-socketio-instance.json.
2. Update resource name in the file.
3. Run az CLI command:
```powershell
az deployment group create --resource-group <resource-group> --template-file "azure-socketio-instance.json"
```

## How to migrate a native Socket.IO application to Azure Socket.IO

Let's take an offical sample [chat](https://github.com/socketio/socket.io/tree/4.6.2/examples/chat) of Socket.IO as example:

### Server side
In server code `index.js`:

1. Add package `@azure/web-pubsub-socket.io`
```bash
npm install @azure/web-pubsub-socket.io
```

2. Import package in server code `index.js`
```javascript
const wpsExt = require("@azure/web-pubsub-socket.io")
```

3. Add configuration from Azure Web PubSub
```javascript
const wpsOptions = {
    hub: "eio_hub",
    connectionString: process.argv[2]
};
```
	
4. Find where Socket.IO server is created, append `useAzureSocketIO(wpsOptinos)` to its end:
```javascript
const io = await require('socket.io')(server).useAzureSocketIO(wpsOptions);
```

Notice: method `useAzureSocketIO` is an asynchorouns method. So you need to wrap it and related code in an asynchrouns function.

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