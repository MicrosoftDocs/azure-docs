---
title: 'Quickstart: Incorporate Web PubSub for Socket.IO in your app'
description: In this quickstart, you learn how to use Web PubSub for Socket.IO on an existing Socket.IO app.
author: xingsy97
ms.author: siyuanxing
ms.date: 08/01/2023
ms.service: azure-web-pubsub
ms.topic: quickstart
---

# Quickstart: Incorporate Web PubSub for Socket.IO in your app

This quickstart is for existing Socket.IO users. It demonstrates how quickly you can incorporate Web PubSub for Socket.IO in your app to simplify development, speed up deployment, and achieve scalability without complexity.

Code shown in this quickstart is in CommonJS. If you want to use an ECMAScript module, see the [chat demo for Socket.IO with Azure Web PubSub](https://github.com/Azure/azure-webpubsub/tree/main/experimental/sdk/webpubsub-socketio-extension/examples/chat).

## Prerequisites

> [!div class="checklist"]
> * An Azure account with an active subscription. If you don't have one, you can [create a free account](https://azure.microsoft.com/free/). 
> * Some familiarity with the Socket.IO library.

## Create a Web PubSub for Socket.IO resource

1. Go to the [Azure portal](https://portal.azure.com/).
1. Search for **socket.io**, and then select **Web PubSub for Socket.IO**.
1. Select a plan, and then select **Create**.

   :::image type="content" source="./media/socketio-migrate-from-self-hosted/create-resource.png" alt-text="Screenshot of the Web PubSub for Socket.IO service in the Azure portal.":::

## Initialize a Node project and install required packages

```bash
mkdir quickstart
cd quickstart
npm init
npm install @azure/web-pubsub-socket.io socket.io-client
```

## Write server code

1. Import required packages and create a configuration for Web PubSub:

    ```javascript
    /*server.js*/
    const { Server } = require("socket.io");
    const { useAzureSocketIO } = require("@azure/web-pubsub-socket.io");

    // Add a Web PubSub option
    const wpsOptions = {
        hub: "eio_hub", // The hub name can be any valid string.
        connectionString: process.argv[2] || process.env.WebPubSubConnectionString
    }
    ```

2. Create a Socket.IO server that Web PubSub for Socket.IO supports:

    ```javascript
    /*server.js*/
    let io = new Server(3000);
    useAzureSocketIO(io, wpsOptions);
    ```

3. Write server logic:

    ```javascript
    /*server.js*/
    io.on("connection", (socket) => {
        // Sends a message to the client
        socket.emit("hello", "world");

        // Receives a message from the client
        socket.on("howdy", (arg) => {
            console.log(arg);   // Prints "stranger"
        })
    });
    ```

## Write client code

1. Create a Socket.IO client:

    ```javascript
    /*client.js*/
    const io = require("socket.io-client");

    const webPubSubEndpoint = process.argv[2] || "<web-pubsub-socketio-endpoint>";
    const socket = io(webPubSubEndpoint, {
        path: "/clients/socketio/hubs/eio_hub",
    });
    ```

2. Define the client behavior:

    ```javascript
    /*client.js*/

    // Receives a message from the server
    socket.on("hello", (arg) => {
        console.log(arg);
    });

    // Sends a message to the server
    socket.emit("howdy", "stranger")
    ```

## Run the app

1. Run the server app:

    ```bash
    node server.js "<web-pubsub-connection-string>"
    ```

2. Run the client app in another terminal:

    ```bash
    node client.js "<web-pubsub-endpoint>"
    ```
