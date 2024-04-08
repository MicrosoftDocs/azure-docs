---
title: Migrate a self-hosted Socket.IO app to be fully managed on Azure
description: Learn how to migrate a Socket.IO chat app to Azure.
keywords: Socket.IO, Socket.IO on Azure, multi-node Socket.IO, scaling Socket.IO
author: xingsy97
ms.author: siyuanxing
ms.date: 07/21/2023
ms.service: azure-web-pubsub
ms.topic: how-to
---

# Migrate a self-hosted Socket.IO app to be fully managed on Azure

In this article, you migrate a Socket.IO chat app to Azure by using Web PubSub for Socket.IO.

## Prerequisites

> [!div class="checklist"]
> * An Azure account with an active subscription. If you don't have one, you can [create a free account](https://azure.microsoft.com/free/). 
> * Some familiarity with the Socket.IO library.

## Create a Web PubSub for Socket.IO resource

1. Go to the [Azure portal](https://portal.azure.com/).
1. Search for **socket.io**, and then select **Web PubSub for Socket.IO**.
1. Select a plan, and then select **Create**.

   :::image type="content" source="./media/socketio-migrate-from-self-hosted/create-resource.png" alt-text="Screenshot of the Web PubSub for Socket.IO service in the Azure portal.":::

## Migrate the app

For the migration process in this guide, you use a sample chat app provided on [Socket.IO's website](https://github.com/socketio/socket.io/tree/4.6.2/examples/chat). You need to make some minor changes to both the server-side and client-side code to complete the migration.

### Server side

1. Locate `index.js` in the server-side code.

2. Add the `@azure/web-pubsub-socket.io` package:

    ```bash
    npm install @azure/web-pubsub-socket.io
    ```

3. Import the package:

    ```javascript
    const { useAzureSocketIO } = require("@azure/web-pubsub-socket.io");
    ```

4. Locate in your server-side code where you created the Socket.IO server, and append useAzureSocketIO(...):

    ```javascript
    const io = require("socket.io")();
    useAzureSocketIO(io, {
        hub: "eio_hub", // The hub name can be any valid string.
        connectionString: process.argv[2]
    });
    ```

   >[!IMPORTANT]
   > The `useAzureSocketIO` method is asynchronous, and it does initialization steps to connect to Web PubSub. You can use `await useAzureSocketIO(...)` or use `useAzureSocketIO(...).then(...)` to make sure your app server starts to serve requests after the initialization succeeds.

5. If you use the following server APIs, add `async` before using them, because they're asynchronous with Web PubSub for Socket.IO:

   * [server.socketsJoin](https://socket.io/docs/v4/server-api/#serversocketsjoinrooms)
   * [server.socketsLeave](https://socket.io/docs/v4/server-api/#serversocketsleaverooms)
   * [socket.join](https://socket.io/docs/v4/server-api/#socketjoinroom)
   * [socket.leave](https://socket.io/docs/v4/server-api/#socketleaveroom)

    For example, if there's code like this:

    ```javascript
    io.on("connection", (socket) => { socket.join("room abc"); });
    ```

    Update it to:

    ```javascript
    io.on("connection", async (socket) => { await socket.join("room abc"); });
    ```

    This chat example doesn't use any of those APIs. So you don't need to make any changes.

### Client side

1. Find the endpoint to your resource on the Azure portal.

   :::image type="content" source="./media/socketio-migrate-from-self-hosted/get-resource-endpoint.png" alt-text="Screenshot of getting the endpoint to a Web PubSub for Socket.IO resource.":::

1. Go to `./public/main.js` in the client-side code.

1. Find where the Socket.IO client is created. Replace its endpoint with the Socket.IO endpoint in Azure, and add a `path` option:

   ```javascript
   const socket = io("<web-pubsub-for-socketio-endpoint>", {
       path: "/clients/socketio/hubs/eio_hub",
   });
   ```
