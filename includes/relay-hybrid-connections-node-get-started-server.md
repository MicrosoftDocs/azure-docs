### Create a Node.js application
* Create a new JavaScript file called `listener.js`.

### Add the Relay NPM package
* Run `npm install hyco-ws` from a Node command prompt in your project folder.

### Write some code to receive messages
1. Add the following `constant` to the top of the `listener.js` file.
   
    ```js
    const WebSocket = require('hyco-ws');
    ```
2. Add the following Relay `constants` to the `listener.js` for the Hybrid Connection connection details. Replace the placeholders in brackets with the proper values that were obtained when creating the Hybrid Connection.
   
   1. `const ns` - The Relay namespace (use FQDN - e.g. `{namespace}.servicebus.windows.net`)
   2. `const path` - The name of the Hybrid Connection
   3. `const keyrule` - The name of the SAS key
   4. `const key` - The SAS key value
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
    Here is what your listener.js should look like:
   
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

