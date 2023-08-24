---
title: How to migrate a self-hosted Socket.IO to be fully managed on Azure
description: A tutorial showing how to migrate an Socket.IO chat app to Azure
author: xingsy97
ms.author: siyuanxing
ms.date: 07/21/2023
ms.service: azure-web-pubsub
ms.topic: how-to
---

# How to migrate a self-hosted Socket.IO app to be fully managed on Azure

## Prerequisites
> [!div class="checklist"]
> * An Azure account with an active subscription. If you don't have one, you can [create a free accout](https://azure.microsoft.com/free/). 
> * Some familiarity with Socket.IO library.

## Create a Web PubSub for Socket.IO resource
Head over to Azure portal and search for `socket.io`.
:::image type="content" source="./media/socketio-migrate-from-self-hosted/create-resource.png" alt-text="Screenshot of Web PubSub for Socket.IO service.":::

## Migrate an official Socket.IO sample app 
To focus this guide to the migration process, we're going to use a sample chat app provided on [Socket.IO's website](https://github.com/socketio/socket.io/tree/4.6.2/examples/chat). We need to make some minor changes to both the **server-side** and **client-side** code to complete the migration.

### Server side
Locate `index.js` in the server-side code.

1. Add package `@azure/web-pubsub-socket.io`
    ```bash
    npm install @azure/web-pubsub-socket.io
    ```

2. Import package in server code `index.js`
    ```javascript
    const { useAzureSocketIO } = require("@azure/web-pubsub-socket.io");
    ```
    
3. Locate in your server-side code where Socket.IO server is created and wrap it with `useAzureSocketIO()`:
    ```javascript
    const io = require("socket.io")();
    useAzureSocketIO(io, {
        hub: "eio_hub", // The hub name can be any valid string.
        connectionString: process.argv[2]
    });
    ```
    >[!IMPORTANT]
    > `useAzureSocketIO` is an asynchronous method and it does initialization steps to connect to Web PubSub. You can `await useAzureSocketIO(...)` or use `useAzureSocketIO(...).then(...)` to make sure your app server starts to serve requests after the initialization succeeds.

4. If you use the following server APIs, add `async` before using them as they're asynchronous with Web PubSub for Socket.IO.
- [server.socketsJoin](https://socket.io/docs/v4/server-api/#serversocketsjoinrooms)
- [server.socketsLeave](https://socket.io/docs/v4/server-api/#serversocketsleaverooms)
- [socket.join](https://socket.io/docs/v4/server-api/#socketjoinroom)
- [socket.leave](https://socket.io/docs/v4/server-api/#socketleaveroom)

    For example, if there's code like:
    ```javascript
    io.on("connection", (socket) => { socket.join("room abc"); });
    ```
    you should update it to:
    ```javascript
    io.on("connection", async (socket) => { await socket.join("room abc"); });
    ```

    In this chat example, none of them are used. So no changes are needed.

### Client Side
In client-side code found in `./public/main.js`

:::image type="content" source="./media/socketio-migrate-from-self-hosted/get-resource-endpoint.png" alt-text="Screenshot of getting the endpoint to Web PubSub for Socket.IO resource.":::

Find where Socket.IO client is created, then replace its endpoint with Azure Socket.IO endpoint and add an `path` option. You can find the endpoint to your resource on Azure portal. 
```javascript
const socket = io("<web-pubsub-for-socketio-endpoint>", {
    path: "/clients/socketio/hubs/eio_hub",
});
```

