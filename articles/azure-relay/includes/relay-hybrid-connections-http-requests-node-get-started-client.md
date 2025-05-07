---
author: clemensv
ms.service: azure-relay
ms.topic: include
ms.date: 01/04/2024
ms.author: samurp
---

### Create a Node.js application

If you have disabled the "Requires Client Authorization" option when creating the Relay,
you can send requests to the Hybrid Connections URL with any browser. For accessing
protected endpoints, you need to create and pass a token in the `ServiceBusAuthorization`
header, which is shown here.

To start, create a new JavaScript file called `sender.js`.

### Add the Relay Node Package Manager package

Run `npm install hyco-https` from a Node command prompt in your project folder. This package
also imports the regular `https` package. For the client-side, the key difference is that
the package provides functions to construct Relay URIs and tokens.

### Write some code to send messages

1. Add the following `constants` to the top of the `sender.js` file.
   
    ```js
    const https = require('hyco-https');
    ```

2. Add the following constants to the `sender.js` file for the hybrid connection details. Replace the placeholders in brackets with the values you obtained when you created the hybrid connection.
   
   - `const ns` - The Relay namespace. Be sure to use the fully qualified namespace name; for example, `{namespace}.servicebus.windows.net`.
   - `const path` - The name of the hybrid connection.
   - `const keyrule` - Name of your Shared Access Policies key, which is `RootManageSharedAccessKey` by default.
   - `const key` -   The primary key of the namespace you saved earlier.

3. Add the following code to the `sender.js` file. You notice that the
   code doesn't differ significantly from the regular use of the Node.js
   HTTPS client; it just adds the authorization header.
   
   ```js
   https.get({
        hostname : ns,
        path : (!path || path.length == 0 || path[0] !== '/'?'/':'') + path,
        port : 443,
        headers : {
            'ServiceBusAuthorization' : 
                https.createRelayToken(https.createRelayHttpsUri(ns, path), keyrule, key)
        }
   }, (res) => {
        let error;
        if (res.statusCode !== 200) {
            console.error('Request Failed.\n Status Code: ${statusCode}');
            res.resume();
        } 
        else {
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                console.log(`BODY: ${chunk}`);
            });
            res.on('end', () => {
                console.log('No more data in response.');
            });
        };
   }).on('error', (e) => {
        console.error(`Got error: ${e.message}`);
   });
   ```
    Here's what your sender.js file should look like:
   
    ```js
    const https = require('hyco-https');
       
    const ns = "{RelayNamespace}";
    const path = "{HybridConnectionName}";
    const keyrule = "{SASKeyName}";
    const key = "{SASKeyValue}";
   
    https.get({
        hostname : ns,
        path : (!path || path.length == 0 || path[0] !== '/'?'/':'') + path,
        port : 443,
        headers : {
            'ServiceBusAuthorization' : 
                https.createRelayToken(https.createRelayHttpsUri(ns, path), keyrule, key)
        }
    }, (res) => {
        let error;
        if (res.statusCode !== 200) {
            console.error('Request Failed.\n Status Code: ${statusCode}');
            res.resume();
        } 
        else {
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                console.log(`BODY: ${chunk}`);
            });
            res.on('end', () => {
                console.log('No more data in response.');
            });
        };
    }).on('error', (e) => {
        console.error(`Got error: ${e.message}`);
    });
    ```


> [!NOTE]
> The sample code in this article uses a connection string to authenticate to an Azure Relay namespace to keep the tutorial simple. We recommend that you use Microsoft Entra ID authentication in production environments, rather than using connection strings or shared access signatures, which can be more easily compromised. For detailed information and sample code for using the Microsoft Entra ID authentication, see [Authenticate and authorize an application with Microsoft Entra ID to access Azure Relay entities](../authenticate-application.md) and [Authenticate a managed identity with Microsoft Entra ID to access Azure Relay resources](../authenticate-managed-identity.md).
