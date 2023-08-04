---
title: How to build a realtime application from the ground using Web PubSub for Socket.IO
description: Learn how to build a realtime application using Web PubSub for Socket.IO from the ground
author: siyuanxing
ms.author: xiyuanxing
ms.date: 08/01/2023
ms.service: azure-web-pubsub
ms.topic: how-to
---
# How to build a realtime application from the ground using Web PubSub for Socket.IO 
This article shows how to build a realtime application using Web PubSub for Socket.IO from the ground.

Our purpose is to build a realtime editor. There are two types of roles: the first role is writer client, who can write codes in the online editor and the content will be streamed to others. And the second role is watcher client, who cannot change the content of the online editor and will receives realtime contents written by writer client. And the architecture is the same as [Overview of Web PubSub for Socket.IO](./socketio-overview.md).

# Prerequisites
1. Create a Web PubSub for Socket.IO resource
The recommended way is to use Azure CLI Tools:
```bash
az webpubsub create -n <resource-name> \
                    -l <resource-location> \
                    -g <resource-group> \
                    --kind SocketIO \
                    --sku Premium_P1
```

# Server
## Build a HTTP server
1. Create a Node.JS project
```bash
mkdir codestream
cd codestream
npm init
```

2. Install server SDK and Express to the project
```bash
npm install @azure/web-pubsub-socket.io
npm install express
```

3.  Let's import the required packages and create a HTTP server to serve static files
```javascript
// Import required package
const express = require('express');
const path = require('path');

// Create a HTTP server based on Express
const app = express();
const server = require('http').createServer(app);

app.use(express.static(path.join(__dirname, 'public')));
```

## Build a Socket.IO server supported by Web PubSub
1. Import Web PubSub for Socket.IO SDK package and its options
```javascript
const wpsExt = require("@azure/web-pubsub-socket.io");

const wpsOptions = {
    hub: "eio_hub",
    connectionString: process.argv[2]
};
```

2. Create a Socket.IO server supported by Web PubSub
```javascript
let io = require('socket.io')(server)
await io.useAzureSocketIO(wpsOptions);
```

Now we have a Socket.IO server supported by Web PubSub for Socket.IO. Then we should design its behaviour and implement it.

## Implement the application logic
1. After a client is connected, the server should tell the client that "you are logined" by sending a event named "login".

```javascript
io.on('connection', socket => {
    socket.emit("login");
});
```

2. For each client, we have two event for them: `joinRoom` and `sendToRoom`. Room name is parsed from message and then we use Socket.IO API `socket.join` to join the target client to the specified room.

```javascript
socket.on('joinRoom', async (message) => {
    const room_id = message["room_id"];
    await socket.join(room_id);
});
```

3. After a client has joined the room, we want the server sync the latest status to it. So after joining is finished, let client tell server a acknowledge information, indicating the client has joined the room successfully and need a full sync of editor content.

```javascript
socket.on('joinRoom', async (message) => {
    // ...
    socket.emit("message", {
        type: "ackJoinRoom", 
        success: true 
    })
});
```

4. When a client send `sendToRoom` event to the server, the server should broadcast the data to the specified room.

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

5.
To let client know which room it is assigned with and what is the endpoint it should connect, server could 
deploy a API called `/negotiate` to the Express server. 
```javascript 
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

Now the service-side is finished. Let's go to the client-side part.

## Client side
## Preparation
1. In client side, we should create a Socket.IO client to communicate with the server. The first question is what endpoint it should connect to. Leveraging the `/negotiate` API we mentioned before, the endpoint could be easily got. The room id which the client is assigned with is also written in the API response.

```javascript
async function initialize(url) {
    let data = await fetch(url).json()

    updateStreamId(data.room_id);

    let editor = createEditor(...); // Create a editor component

    var socket = io(data.url, {
        path: "/clients/socketio/hubs/eio_hub",
    });

    return [socket, editor, data.room_id];
}
```

We have two roles in client. The first one is the writer and another one is watcher. Anything written by the writer will be streamed to the watcher's screen. Let's start with the writer part. 

## Writer client
1. Firstly, it should get the endpoint and the room id.
```javascript
let [socket, editor, room_id] = await initialize('/negotiate');
```

2. 
When the writer client is connected with server, the server will send a `login` event to him. 
Once logined, the writer should ask server to join the specified room. And he should flush his editor content to other clients periodically.

```javascript
socket.on("login", () => {
    updateStatus('Connected');
    joinRoom(socket, `${room_id}`);
    setInterval(() => flush(), 200);
    // Update editor content
    // ...
});
```

Method `flush` could be written like this:
```javascript
function flush() {
    // No change from editor need to be flushed
    if (changes.length === 0) return;

    // Broadcast the modification of editor content to the room
    sendToRoom(socket, room_id, {
        type: 'delta',
        changes: changes
        version: version++,
    });

    changes = [];
    content = editor.getValue();
}
```
Now the part of writer client is finshed. Let's go to the part of watcher client.

3. As mentioned before, once a new watcher client is connected, a message containing "sync" data will be sent to the writer client. 

```javascript
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
Now, the writer part is finished. Let's go to the watcher client part.

## Watcher client
1. Same with the writer client, the watcher client could its Socket.IO client through `initialize`. When the watcher client is connected and received a `login` event from server, it should ask the server to join it into the specified room.

```javascript
let [socket, editor] = await initialize(`/register?room_id=${room_id}`)
socket.on("login", () => {
    updateStatus('Connected');
    joinRoom(socket, `${id}`);
});
```

2. When a watcher client receives a `message` event from server and the data type is `ackJoinRoom`, the watcher client should ask the writer client in the room to send the full content to it.

```javascript
socket.on("message", (message) => {
    let data = message;
    // If the server ensures the watcher client is connected
    if (data.type === 'ackJoinRoom' && data.success) { 
        sendToRoom(socket, `${id}`, { data: 'sync'});
    } 
    else ...
});
```

3. Otherwise, if the data type is `editorMessage`, the writer client should update the editor according to its actual content.

```javascript
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

4. The last part is to write methods to send `joinRoom` and `sendToRoom` event to server.
```javascript
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

# Run the application
1. Codes snippets above are the core part of this application. You should complete it with other necessary parts like how to update editor component and other frontend work like importing packages, css and other static resources.
The full code is put in [our examples repository](https://github.com/Azure/azure-webpubsub/tree/main/experimental/sdk/webpubsub-socketio-extension/examples/codestream)

2. After you finish other necessary work, run the server by
```bash
node index.js <web-pubsub-connection-string>
```
And open your first web browser with `http://localhost:3000'. Open another tab with the url displayed in the web page. Write code in the first tab and see what happending in the second tab.