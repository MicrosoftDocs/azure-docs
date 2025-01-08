---
author: clemensv
ms.service: azure-relay
ms.topic: include
ms.date: 01/04/2024
ms.author: samurp
---
### Create a Node.js application

Create a new JavaScript file called `sender.js`.

### Add the Relay Node Package Manager package

Run `npm install hyco-ws` from a Node command prompt in your project folder.

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
2. Add the following constants to the `sender.js` file for the hybrid connection details. Replace the placeholders in brackets with the values you obtained when you created the hybrid connection.
   
   - `const ns` - The Relay namespace. Be sure to use the fully qualified namespace name; for example, `{namespace}.servicebus.windows.net`.
   - `const path` - The name of the hybrid connection.
   - `const keyrule` - Name of your Shared Access Policies key, which is `RootManageSharedAccessKey` by default.
   - `const key` -   The primary key of the namespace you saved earlier.

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
    Here's what your sender.js file should look like:
   
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


> [!NOTE]
> The sample code in this article uses a connection string to authenticate to an Azure Relay namespace to keep the tutorial simple. We recommend that you use Microsoft Entra ID authentication in production environments, rather than using connection strings or shared access signatures, which can be more easily compromised. For detailed information and sample code for using the Microsoft Entra ID authentication, see [Authenticate and authorize an application with Microsoft Entra ID to access Azure Relay entities](../authenticate-application.md) and [Authenticate a managed identity with Microsoft Entra ID to access Azure Relay resources](../authenticate-managed-identity.md).
