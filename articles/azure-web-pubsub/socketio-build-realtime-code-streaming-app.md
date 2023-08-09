---
title: Build a real-time code streaming app using Socket.IO and host it on Azure
description: An end-to-end tutorial demonstrating how to build an app that allows coders to share coding activities with their audience in real time using Web PubSub for Socket.IO 
author: xingsy97
ms.author: siyuanxing
ms.date: 08/01/2023
ms.service: azure-web-pubsub
ms.topic: how-to
---

# Build a real-time code streaming app using Socket.IO and host it on Azure

Building a real-time experience like the cocreation feature from [Microsoft Word](https://www.microsoft.com/microsoft-365/word) can be challenging. 

Through its easy-to-use APIs, [Socket.IO](https://socket.io/) has proven itself as a battle-tested library for real-time communication between clients and server. However, Socket.IO users often report difficulty around scaling Socket.IO's connections. With Web PubSub for Socket.IO, developers no longer need to worry about managing persistent connections. 

## Overview
This tutorial shows how to build an app that allows a coder to stream his/her coding activities to an audience. We build this application using
>[!div class="checklist"]
> * Monitor Editor, the code editor that powers VS code
> * [Express](https://expressjs.com/), a Node.js web framework
> * APIs provided by Socket.IO library for real-time communication
> * Host Socket.IO connections using Web PubSub for Socket.IO

### The finished app
The finished app allows a code editor user to share a web link through which people can watch him/her typing. 

:::image type="content" source="./media/socketio-build-realtime-code-streaming-app/code-stream-app.jpg" alt-text="Screenshot of the finished code stream app.":::

To keep this tutorial focused and digestible in around 15 minutes, we define two user roles and what they can do in the editor
- a writer, who can type in the online editor and the content is streamed
- viewers, who receive real-time content typed by the writer and cannot edit the content

### Architecture
|  /  | Purpose           | Benefits         | 
|----------------------|-------------------|------------------|
|[Socket.IO library](https://socket.io/) | Provides low-latency, bi-directional data exchange mechanism between the backend application and clients | Easy-to-use APIs that cover most real-time communication scenarios
|Web PubSub for Socket.IO | Host WebSocket or poll-based persistent connections with Socket.IO clients | 100 K concurrent connections built-in; Simplify application architecture;

:::image type="content" source="./media/socketio-build-realtime-code-streaming-app/webpubsub-for-socketio-architecture.jpg" alt-text="Screenshot of Web PubSub for Socket.IO service.":::

## Prerequisites 
In order to follow the step-by-step guide, you need
> [!div class="checklist"]
> * An [Azure](https://portal.azure.com/) account. If you don't have an Azure subscription, create an [Azure free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.
> * [Azure CLI](/cli/azure/install-azure-cli) (version 2.29.0 or higher) or [Azure Cloud Shell](../cloud-shell/quickstart.md) to manage Azure resources.
> * Basic familiarity of [Socket.IO's APIs](https://socket.io/docs/v4/)

## Create a Web PubSub for Socket.IO resource
We are going to use Azure CLI to create the resource. 
```bash
az webpubsub create -n <resource-name> \
                    -l <resource-location> \
                    -g <resource-group> \
                    --kind SocketIO \
                    --sku Free_F1
```
## Get connection string
A connection string allows you to connect with Web PubSub for Socket.IO. Keep the returned connection string somewhere for use as we need it when we run the application at the end of the tutorial.
```bash
az webpubsub key show -n <resource-name> \ 
                      -g <resource-group> \ 
                      --query primaryKey \
                      -o tsv
```

## Write the application
>[!NOTE]
> This tutorial focuses on explaining the core code for implementing real-time communication. Complete code can be found in the [samples repository](https://github.com/Azure/azure-webpubsub/tree/main/experimental/sdk/webpubsub-socketio-extension/examples/codestream). 

### Server-side code
#### Build an HTTP server
1. Create a Node.js project
    ```bash
    mkdir codestream
    cd codestream
    npm init
    ```

2. Install server SDK and Express
    ```bash
    npm install @azure/web-pubsub-socket.io
    npm install express
    ```

3.  Import required packages and create an HTTP server to serve static files
    ```javascript
    /* server.js*/

    // Import required packages
    const express = require('express');
    const path = require('path');

    // Create a HTTP server based on Express
    const app = express();
    const server = require('http').createServer(app);

    app.use(express.static(path.join(__dirname, 'public')));
    ```

4. Define an endpoint called `/negotiate`. A **writer** client hits this endpoint first. This endpoint returns an HTTP response, which contains
- an endpoint the client should establish a persistent connection with, 
- `room` the client is assigned to

    ```javascript 
    /* server.js*/
    app.get('/negotiate', async (req, res) => {
        res.json({
            url: endpoint
            room_id: Math.random().toString(36).slice(2, 7),
        });
    });

    // Make the Socket.IO server listen on port 3000
    io.httpServer.listen(3000, () => {
        console.log('Visit http://localhost:%d', 3000);
    });
    ```

#### Create Web PubSub for Socket.IO server
1. Import Web PubSub for Socket.IO SDK and define options
    ```javascript
    /* server.js*/
    const { useAzureSocketIO } = require("@azure/web-pubsub-socket.io");

    const wpsOptions = {
        hub: "codestream",
        connectionString: process.argv[2]
    };
    ```

2. Create a Web PubSub for Socket.IO server
    ```javascript
    /* server.js*/

    const io = require("socket.io")();
    useAzureSocketIO(io, wpsOptions);
    ```

The two steps are slightly different than how you would normally create a Socket.IO server as [described here](https://socket.io/docs/v4/server-installation/). With these two steps, your server-side code can offload managing persistent connections to an Azure service. With the help of an Azure service, your application server acts **only** as a lightweight HTTP server. 

Now that we've created a Socket.IO server hosted by Web PubSub, we can define how the clients and server communicate using Socket.IO's APIs. This process is referred to as implementing business logic.

#### Implement business logic
1. After a client is connected, the application server tells the client that "you are logged in" by sending a custom event named `login`.

    ```javascript
    /* server.js*/
    io.on('connection', socket => {
        socket.emit("login");
    });
    ```

2. Each client emits two events `joinRoom` and `sendToRoom` that the server can respond to. After the server getting the `room_id` a client wishes to join, we use Socket.IO's API `socket.join` to join the target client to the specified room.

    ```javascript
    /* server.js*/
    socket.on('joinRoom', async (message) => {
        const room_id = message["room_id"];
        await socket.join(room_id);
    });
    ```

3. After a client has successfully been joined, the server informs the client of the successful result with the `message` event. Upon receiving an `message` event with a type of `ackJoinRoom`, the client can ask the server to send the latest editor state. 

    ```javascript
    /* server.js*/
    socket.on('joinRoom', async (message) => {
        // ...
        socket.emit("message", {
            type: "ackJoinRoom", 
            success: true 
        })
    });
    ```

    ```javascript
    /* client.js*/
    socket.on("message", (message) => {
        let data = message;
        if (data.type === 'ackJoinRoom' && data.success) {
            sendToRoom(socket, `${room_id}-control`, { data: 'sync'});
        }
        // ... 
    })
    ```

4. When a client sends `sendToRoom` event to the server, the server broadcasts the **changes to the code editor state** to the specified room. All clients in the room can now receive the latest update.

    ```javascript
    socket.on('sendToRoom', (message) => {
        const room_id = message["room_id"]
        const data = message["data"]

        socket.broadcast.to(room_id).emit("message", {
            type: "editorMessage",
            data: data
        });
    });
    ```

Now that the server-side is finished. Next, we work on the client-side. 

### Client-side code
#### Initial setup
1. On the client side, we need to create an Socket.IO client to communicate with the server. The question is which server the client should establish a persistent connection with. Since we use Web PubSub for Socket.IO, the server is an Azure service. Recall that we defined [`/negotiate`](#build-an-http-server) route to serve clients an endpoint to Web PubSub for Socket.IO.

    ```javascript
    /*client.js*/

    async function initialize(url) {
        let data = await fetch(url).json()

        updateStreamId(data.room_id);

        let editor = createEditor(...); // Create a editor component

        var socket = io(data.url, {
            path: "/clients/socketio/hubs/codestream",
        });

        return [socket, editor, data.room_id];
    }
    ```
The `initialize(url)` organizes a few setup operations together. 
- fetches the endpoint to an Azure service from your HTTP server,
- creates a Monoca editor instance,
- establishes a persistent connection with Web PubSub for Socket.IO

#### Writer client
[As mentioned earlier](#the-finished-app), we have two user roles on the client side. The first one is the writer and another one is viewer. Anything written by the writer is streamed to the viewer's screen.  

##### Writer client
1. Get the endpoint to Web PubSub for Socket.IO and the `room_id`.
    ```javascript
    /*client.js*/
    
    let [socket, editor, room_id] = await initialize('/negotiate');
    ```

2. When the writer client is connected with server, the server sends a `login` event to him. The writer can respond by asking the server to join itself to a specified room. Importantly, every 200 ms the writer sends its latest editor state to the room. A function aptly named `flush` organizes the sending logic.

    ```javascript
    /*client.js*/

    socket.on("login", () => {
        updateStatus('Connected');
        joinRoom(socket, `${room_id}`);
        setInterval(() => flush(), 200);
        // Update editor content
        // ...
    });
    ```

3. If a writer doesn't make any edits, `flush()` does nothing and simply returns. Otherwise, the **changes to the editor state** are sent to the room.
    ```javascript
    /*client.js*/

    function flush() {
        // No change from editor need to be flushed
        if (changes.length === 0) return;

        // Broadcast the changes made to editor content
        sendToRoom(socket, room_id, {
            type: 'delta',
            changes: changes
            version: version++,
        });

        changes = [];
        content = editor.getValue();
    }
    ```

4. When a new viewer client is connected, the viewer needs to get the latest **complete state** of the editor. To achieve this, a message containing `sync` data will be sent to the writer client, asking the writer client to send the complete editor state.
    ```javascript
    /*client.js*/

    socket.on("message", (message) => {
        let data = message.data;
        if (data.data === 'sync') {
            // Broadcast the full content of the editor to the room
            sendToRoom(socket, room_id, {
                type: 'full',
                content: content
                version: version,
            });
        }
    });
    ```

##### Viewer client
1. Same with the writer client, the viewer client creates its Socket.IO client through `initialize()`. When the viewer client is connected and received a `login` event from server, it asks the server to join itself to the specified room. The query `room_id` specifies the room .

    ```javascript
    /*client.js*/

    let [socket, editor] = await initialize(`/register?room_id=${room_id}`)
    socket.on("login", () => {
        updateStatus('Connected');
        joinRoom(socket, `${room_id}`);
    });
    ```

2. When a viewer client receives a `message` event from server and the data type is `ackJoinRoom`, the viewer client asks the writer client in the room to send over the complete editor state.

    ```javascript
    /*client.js*/

    socket.on("message", (message) => {
        let data = message;
        // Ensures the viewer client is connected
        if (data.type === 'ackJoinRoom' && data.success) { 
            sendToRoom(socket, `${id}`, { data: 'sync'});
        } 
        else //...
    });
    ```

3. If the data type is `editorMessage`, the viewer client **updates the editor** according to its actual content.

    ```javascript
    /*client.js*/

    socket.on("message", (message) => {
        ...
        else 
            if (data.type === 'editorMessage') {
            switch (data.data.type) {
                case 'delta':
                    // ... Let editor component update its status
                    break;
                case 'full':
                    // ... Let editor component update its status
                    break;
            }
        }
    });
    ```

4. Implement `joinRoom()` and `sendToRoom()` using Socket.IO's APIs
    ```javascript
    /*client.js*/

    function joinRoom(socket, room_id) {
        socket.emit("joinRoom", {
            room_id: room_id,
        });
    }

    function sendToRoom(socket, room_id, data) {
        socket.emit("sendToRoom", {
            room_id: room_id,
            data: data
        });
    }
    ```

## Run the application
### Locate the repo
We dived deep into the core logic related to synchronizing editor state between viewers and writer. The complete code can be found in [ examples repository](https://github.com/Azure/azure-webpubsub/tree/main/experimental/sdk/webpubsub-socketio-extension/examples/codestream).

### Clone the repo
You can clone the repo and run `npm install` to install project dependencies.

### Start the server
```bash
node index.js <web-pubsub-connection-string>
```
> [!NOTE]
> This is the connection string you received from [a previous step](#get-connection-string). 

### Play with the real-time code editor
Open `http://localhost:3000` in a browser tab and open another tab with the url displayed in the first web page. 

If you write code in the first tab, you should see your typing reflected real-time in the other tab. Web PubSub for Socket.IO facilitates message passing in the cloud. Your `express` server only serves the static `index.html` and `/negotiate` endpoint.