### Create a Node.js application
* Create a new JavaScript file called `sender.js`.

### Add the Relay NPM package
* Run `npm install hyco-ws` from a Node command prompt in your project folder.

### Write some code to send messages
1. Add the following `constants` to the top of the `sender.js` file.
   
    ```js
    const WebSocket = require('hyco-ws');
    const readline = require('readline')
        .createInterface({
            input: process.stdin,
            output: process.stdout
        });;
    ```
2. Add the following Relay `constants` to the `sender.js` for the Hybrid Connection connection details. Replace the placeholders in brackets with the proper values that were obtained when creating the Hybrid Connection.
   
   1. `const ns` - The Relay namespace (use FQDN - e.g. `{namespace}.servicebus.windows.net`)
   2. `const path` - The name of the Hybrid Connection
   3. `const keyrule` - The name of the SAS key
   4. `const key` - The SAS key value
3. Add the following code to the `sender.js` file:
   
    ```js
    WebSocket.relayedConnect(
        WebSocket.createRelaySendUri(ns, path),
        WebSocket.createRelayToken('http://'+ns, keyrule, key),
        function (wss) {
            readline.on('line', (input) => {
                wss.send(input, null);
            });
   
            console.log('Started client interval.');
            wss.on('close', function () {
                console.log('stopping client interval');
                process.exit();
            });
        }
    );
    ```
    Here is what your listener.js should look like:
   
    ```js
    const WebSocket = require('hyco-ws');
    const readline = require('readline')
        .createInterface({
            input: process.stdin,
            output: process.stdout
        });;
   
    const ns = "{RelayNamespace}";
    const path = "{HybridConnectionName}";
    const keyrule = "{SASKeyName}";
    const key = "{SASKeyValue}";
   
    WebSocket.relayedConnect(
        WebSocket.createRelaySendUri(ns, path),
        WebSocket.createRelayToken('http://'+ns, keyrule, key),
        function (wss) {
            readline.on('line', (input) => {
                wss.send(input, null);
            });
   
            console.log('Started client interval.');
            wss.on('close', function () {
                console.log('stopping client interval');
                process.exit();
            });
        }
    );
    ```

