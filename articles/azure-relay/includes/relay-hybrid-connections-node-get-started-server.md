---
author: clemensv
ms.service: service-bus-relay
ms.topic: include
ms.date: 01/04/2024
ms.author: clemensv
---

### Create a Node.js application

Create a new JavaScript file called `listener.js`.

### Add the Relay package

Run `npm install hyco-ws` from a Node command prompt in your project folder.

### Write some code to receive messages

1. Add the following constant to the top of the `listener.js` file.
   
    ```js
    const WebSocket = require('hyco-ws');
    ```
2. Add the following constants to the `listener.js` file for the hybrid connection details. Replace the placeholders in brackets with the values you obtained when you created the hybrid connection.
   
   - `const ns` - The Relay namespace. Be sure to use the fully qualified namespace name; for example, `{namespace}.servicebus.windows.net`.
   - `const path` - The name of the hybrid connection.
   - `const keyrule` - Name of your Shared Access Policies key, which is `RootManageSharedAccessKey` by default.
   - `const key` -   The primary key of the namespace you saved earlier.

3. Add the following code to the `listener.js` file:
   
    ```js
    var wss = WebSocket.createRelayedServer(
    {
        server : WebSocket.createRelayListenUri(ns, path),
        token: WebSocket.createRelayToken('http://' + ns, keyrule, key)
    }, 
    function (ws) {
        console.log('connection accepted');
        ws.onmessage = function (event) {
            console.log(event.data);
        };
        ws.on('close', function () {
            console.log('connection closed');
        });       
    });
   
    console.log('listening');
   
    wss.on('error', function(err) {
        console.log('error' + err);
    });
    ```
    Here's what your listener.js file should look like:
   
    ```js
    const WebSocket = require('hyco-ws');
   
    const ns = "{RelayNamespace}";
    const path = "{HybridConnectionName}";
    const keyrule = "{SASKeyName}";
    const key = "{SASKeyValue}";
   
    var wss = WebSocket.createRelayedServer(
        {
            server : WebSocket.createRelayListenUri(ns, path),
            token: WebSocket.createRelayToken('http://' + ns, keyrule, key)
        }, 
        function (ws) {
            console.log('connection accepted');
            ws.onmessage = function (event) {
                console.log(event.data);
            };
            ws.on('close', function () {
                console.log('connection closed');
            });       
    });
   
    console.log('listening');
   
    wss.on('error', function(err) {
        console.log('error' + err);
    });
    ```

