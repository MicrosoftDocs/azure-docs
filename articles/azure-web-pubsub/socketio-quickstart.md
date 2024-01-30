---
title: 'Quickstart: Incorporate Web PubSub for Socket.IO in your app'
description: In this quickstart, you learn how to use Web PubSub for Socket.IO on an existing Socket.IO app.
keywords: Socket.IO, Socket.IO on Azure, multi-node Socket.IO, scaling Socket.IO, socketio, azure socketio
author: xingsy97
ms.author: siyuanxing
ms.date: 08/01/2023
ms.service: azure-web-pubsub
ms.topic: quickstart
---

# Quickstart: Incorporate Web PubSub for Socket.IO in your app

This quickstart demonstrates how to create a Web PubSub for Socket.IO resource and quickly incorporate it in your Socket.IO app to simplify development, speed up deployment, and achieve scalability without complexity.

Code shown in this quickstart is in CommonJS. If you want to use an ECMAScript module, see the [chat demo for Socket.IO with Azure Web PubSub](https://aka.ms/awps/sio/sample/quickstart-esm).

## Prerequisites

> [!div class="checklist"]
> * An Azure account with an active subscription. If you don't have one, you can [create a free account](https://azure.microsoft.com/free/). 
> * Some familiarity with the Socket.IO library.

## Create a Web PubSub for Socket.IO resource

To create a Web PubSub for Socket.IO, you can use the following one-click button to create or follow the actions below to search in Azure portal.

- Use the following button to create a Web PubSub for Socket.IO resource in Azure

    [![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://ms.portal.azure.com/#create/Microsoft.WebPubSubForSocketIO)

- Search from Azure portal search bar

    1. Go to the [Azure portal](https://portal.azure.com/).

    1. Search for **socket.io**, in the search bar and then select **Web PubSub for Socket.IO**.

        :::image type="content" source="./media/socketio-quickstart/search.png" alt-text="Screenshot of searching the Web PubSub for Socket.IO service in the Azure portal.":::

- Search from Marketplace

    1. Go to the [Azure portal](https://portal.azure.com/).

    1. Select the **Create a resource** button found on the upper left-hand corner of the Azure portal. Type **socket.io** in the search box and press enter. Select the **Web PubSub for Socket.IO** in the search result.

        :::image type="content" source="./media/socketio-quickstart/marketplace.png" alt-text="Screenshot of the Web PubSub for Socket.IO service in the marketplace.":::

    1. Click **Create** in the pop out page.

        :::image type="content" source="./media/socketio-migrate-from-self-hosted/create-resource.png" alt-text="Screenshot of the Web PubSub for Socket.IO service in the Azure portal.":::

## Sending messages with Socket.IO libraries and Web PubSub for Socket.IO

In the following steps, you create a Socket.IO project and integrate with Web PubSub for Socket.IO.

### Initialize a Node project and install required packages

```bash
mkdir quickstart
cd quickstart
npm init
npm install @azure/web-pubsub-socket.io socket.io-client
```

### Write server code

Create a `server.js` file and add following code to create a Socket.IO server and integrate with Web PubSub for Socket.IO.

```javascript
/*server.js*/
const { Server } = require("socket.io");
const { useAzureSocketIO } = require("@azure/web-pubsub-socket.io");

let io = new Server(3000);

// Use the following line to integrate with Web PubSub for Socket.IO
useAzureSocketIO(io, {
    hub: "Hub", // The hub name can be any valid string.
    connectionString: process.argv[2]
});

io.on("connection", (socket) => {
    // Sends a message to the client
    socket.emit("hello", "world");

    // Receives a message from the client
    socket.on("howdy", (arg) => {
        console.log(arg);   // Prints "stranger"
    })
});
```

### Write client code

Create a `client.js` file and add following code to connect the client with Web PubSub for Socket.IO.

```javascript
/*client.js*/
const io = require("socket.io-client");

const socket = io("<web-pubsub-socketio-endpoint>", {
    path: "/clients/socketio/hubs/Hub",
});

// Receives a message from the server
socket.on("hello", (arg) => {
    console.log(arg);
});

// Sends a message to the server
socket.emit("howdy", "stranger")
```

When you use Web PubSub for Socket.IO, `<web-pubsub-socketio-endpoint>` and `path` are required for the client to connect to the service. The `<web-pubsub-socketio-endpoint>` and `path` can be found in Azure portal.

1. Go to the **key** blade of Web PubSub for Socket.IO

1. Type in your hub name and copy the **Client Endpoint** and **Client Path**

    :::image type="content" source="./media/socketio-quickstart/client-url.png" alt-text="Screenshot of the Web PubSub for Socket.IO service in the Azure portal client endpoints blade.":::

## Run the app

1. Run the server app:

    ```bash
    node server.js "<connection-string>"
    ```

    The `<connection-string>` is the connection string that contains the endpoint and keys to access your Web PubSub for Socket.IO resource. You can also find the connection string in Azure portal

    :::image type="content" source="./media/socketio-quickstart/connection-string.png" alt-text="Screenshot of the Web PubSub for Socket.IO service in the Azure portal connection string blade.":::

2. Run the client app in another terminal:

    ```bash
    node client.js
    ```
