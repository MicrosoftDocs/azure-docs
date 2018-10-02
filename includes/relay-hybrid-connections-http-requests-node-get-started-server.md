---
title: include file
description: include file
services: service-bus-relay
author: clemensv
ms.service: service-bus-relay
ms.topic: include
ms.date: 05/02/2018
ms.author: clemensv
ms.custom: include file

---

### Create a Node.js application

Create a new JavaScript file called `listener.js`.

### Add the Relay NPM package

Run `npm install hyco-https` from a Node command prompt in your project folder.

### Write some code to handle requests

1. Add the following constant to the top of the `listener.js` file.

    ```js
    const https = require('hyco-https');
    ```
2. Add the following constants to the `listener.js` file for the hybrid
   connection details. Replace the placeholders in brackets with the values you
   obtained when you created the hybrid connection.

   1. `const ns` - The Relay namespace. Be sure to use the fully qualified namespace name; for example, `{namespace}.servicebus.windows.net`.
   2. `const path` - The name of the hybrid connection.
   3. `const keyrule` - The name of the SAS key.
   4. `const key` - The SAS key value.

3. Add the following code to the `listener.js` file. :

    You will notice that the code is not much different from any simple HTTP server
    example you can find in Node.js beginner tutorials, which the exception of
    using the `createRelayedServer` instead of the typical `createServer`
    function.

    ```js
    var uri = https.createRelayListenUri(ns, path);
    var server = https.createRelayedServer(
        {
            server : uri,
            token : () => https.createRelayToken(uri, keyrule, key)
        },
        (req, res) => {
            console.log('request accepted: ' + req.method + ' on ' + req.url);
            res.setHeader('Content-Type', 'text/html');
            res.end('<html><head><title>Hey!</title></head><body>Relayed Node.js Server!</body></html>');
        });

    server.listen( (err) => {
            if (err) {
              return console.log('something bad happened', err)
            }
            console.log(`server is listening on ${port}`)
          });

    server.on('error', (err) => {
        console.log('error: ' + err);
    });
    ```
    Here is what your listener.js file should look like:
   
    ```js
    const https = require('hyco-https');
   
    const ns = "{RelayNamespace}";
    const path = "{HybridConnectionName}";
    const keyrule = "{SASKeyName}";
    const key = "{SASKeyValue}";
   
    var uri = https.createRelayListenUri(ns, path);
    var server = https.createRelayedServer(
        {
            server : uri,
            token : () => https.createRelayToken(uri, keyrule, key)
        },
        (req, res) => {
            console.log('request accepted: ' + req.method + ' on ' + req.url);
            res.setHeader('Content-Type', 'text/html');
            res.end('<html><head><title>Hey!</title></head><body>Relayed Node.js Server!</body></html>');
        });

    server.listen( (err) => {
            if (err) {
              return console.log('something bad happened', err)
            }
            console.log(`server is listening on ${port}`)
          });

    server.on('error', (err) => {
        console.log('error: ' + err);
    });
    ```

