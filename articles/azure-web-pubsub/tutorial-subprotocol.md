---
title: Tutorial - Publish and subscribe messages between WebSocket clients using subprotocol in Azure Web PubSub service
description: A tutorial to walk through how to use Azure Web PubSub service and Azure Functions to build a serverless application.
author: vicancy
ms.author: lianwei
ms.service: azure-web-pubsub
ms.topic: tutorial 
ms.date: 08/16/2021
---

# Tutorial: Publish and subscribe messages between WebSocket clients using subprotocol

In [previous tutorial](./tutorial-build-chat.md) you have learned how to use WebSocket APIs to send and receive data with Azure Web PubSub. You can see there is no protocol needed when client is communicating with the service. For example, you can use `WebSocket.send()` to send any data and server will receive the data as is. This is easy to use, but the functionality is also limited. You cannot, for example, specify the event name when sending the event to server, or publish message to other clients instead of sending it to server. In this tutorial you will learn how to use subprotocol to extend the functionality of client.

The complete code sample of this tutorial can be found [here][code].

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a Web PubSub service instance
> * Generate the full URL to establish the WebSocket connection
> * Publish messages between WebSocket clients using subprotocol

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment.md)]

- This setup requires version 2.22.0 or higher of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Create a resource group

[!INCLUDE [Create a resource group](includes/cli-rg-creation.md)]

## Create a Web PubSub instance

[!INCLUDE [Create a Web PubSub instance](includes/cli-awps-creation.md)]

## Get the ConnectionString for future use

[!INCLUDE [Get the connection string](includes/cli-awps-connstr.md)]

Copy the fetched **ConnectionString** and it will be used later in this tutorial as the value of `<connection_string>`.

## Set up the project

### Prerequisites

# [C#](#tab/csharp)

* [ASP.NET Core 3.1 or above](/aspnet/core)

# [JavaScript](#tab/javascript)

* [Node.js 12.x or above](https://nodejs.org)

# [Python](#tab/python)
* [Python](https://www.python.org/)

---

## Using a subprotocol

# [C#](#tab/csharp)

Different WebSocket SDKs provide different ways to specify the subprotocol of the WebSocket connection. For example, when using [
System.Net.WebSockets.ClientWebSocket](/dotnet/api/system.net.websockets.clientwebsocket) API, the way to configure the subprotocol is like below:

```csharp
var ws = new ClientWebSocket();
ws.Options.AddSubProtocol(subprotocol);
```

# [JavaScript](#tab/javascript)

To specify a subprotocol, you just need to use the [protocol](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/WebSocket#parameters) parameter in the constructor:

```javascript
let ws = new WebSocket(url, subprotocol);
```

# [Python](#tab/python)

Set the subprotocol through the `subprotocols` parameter:

```python
websockets.connect(url, subprotocols=[subprotocol])
```
---

Currently Azure Web PubSub supports one subprotocol: `json.webpubsub.azure.v1`.

> If you use other protocol names, they will be ignored by the service and passthrough to server in the connect event handler, so you can build your own protocols.

Now let's create a simple web application using the subprotocol.

1.  Install dependencies

    # [C#](#tab/csharp)
    
    
    # [JavaScript](#tab/javascript)
    
    ```bash
    npm init -y
    npm install --save express
    npm install --save ws
    npm install --save node-fetch
    npm install --save @azure/web-pubsub
    ```

    # [Python](#tab/python)
    
    
    ---
    
2.  Create the server-side to host the `/negotiate` API and web page.

    # [C#](#tab/csharp)
    
    
    # [JavaScript](#tab/javascript)

    Create a `server.js` and add below code:

    ```javascript
    const express = require('express');
    const { WebPubSubServiceClient } = require('@azure/web-pubsub');

    let endpoint = new WebPubSubServiceClient(process.argv[2], 'stream');
    const app = express();

    app.get('/negotiate', async (req, res) => {
      let token = await endpoint.getAuthenticationToken();
      res.send({
        url: token.url
      });
    });

    app.use(express.static('public'));
    app.listen(8080, () => console.log('server started'));
    ```

    # [Python](#tab/python)
    
    
    ---
    
3.  Create the web page

    # [C#](#tab/csharp)
    Create an HTML page with below content and save it as `wwwroot/index.html`:
    
    # [JavaScript](#tab/javascript)

    Create an HTML page with below content and save it as `public/index.html`:

    # [Python](#tab/python)
    
    ---
    
    ```html
    <html>

    <body>
      <div id="output"></div>
      <script>
        (async function () {
          let res = await fetch('/negotiate')
          let data = await res.json();
          let ws = new WebSocket(data.url, 'json.webpubsub.azure.v1');
          ws.onopen = () => {
            console.log('connected');
          };

          let output = document.querySelector('#output');
          ws.onmessage = event => {
            let d = document.createElement('p');
            d.innerText = event.data;
            output.appendChild(d);
          };
        })();
      </script>
    </body>

    </html>
    ```

    It just connects to the service and print any message received to the page. The main change here is we specify the subprotocol when creating the WebSocket connection.

4. Run the server

    Now the below command, replacing `<connection-string>` with the **ConnectionString** fetched in [previous step](#get-the-connectionstring-for-future-use):

    # [C#](#tab/csharp)
    
    
    # [JavaScript](#tab/javascript)
    
    ```bash
    
    node server "<connection-string>"
    ```
    
    # [Python](#tab/python)
    
    
    ---

    Open `http://localhost:8080` in browser, you can see the WebSocket connection is established as before, with below `connected` event message received in client. You can see that you can get the `connectionId` generated for this client.
    
    ```json
    {"type":"system","event":"connected","userId":null,"connectionId":"<the_connection_id>"}
    ```

You can see that with the help of subprotocol, you can get some metadata of the connection when the connection is `connected`.

Please also note that, instead of a plain text, client now receives a json message that contains more information, like what's the message type and where it is from. So you can use this information to do additional processing to the message (for example, display the message in a different style if it's from a different source), which you can find in later sections.

## Publish messages from client

In the [create a chat app](./tutorial-build-chat.md) tutorial, when client sends a message through WebSocket connection, it will trigger a user event at server side. With subprotocol, client will have more functionalities by sending a JSON message. For example, you can publish message directly from client to other clients.

This will be useful if you want to stream a large amount of data to other clients in real time. Let's use this feature to build a log streaming application, which can stream console logs to browser in real time.

1. Creating the streaming program
 
    # [C#](#tab/csharp)
    
    
    # [JavaScript](#tab/javascript)
    Create a `stream.js` with the following content.
    
    ```javascript
    const WebSocket = require('ws');
    const fetch = require('node-fetch');

    async function main() {
      let res = await fetch(`http://localhost:8080/negotiate`);
      let data = await res.json();
      let ws = new WebSocket(data.url, 'json.webpubsub.azure.v1');
      ws.on('open', () => {
        process.stdin.on('data', data => {
          ws.send(JSON.stringify({
            type: 'sendToGroup',
            group: 'stream',
            dataType: 'text',
            data: data.toString()
          }));
          process.stdout.write(data);
        });
      });
      process.stdin.on('close', () => ws.close());
    }

    main();
    ```

    The code above creates a WebSocket connection to the service and then whenever it receives some data it uses `ws.send()` to publish the data. In order to publish to others, you just need to set `type` to `sendToGroup` and specify a group name in the message.

    # [Python](#tab/python)
    
    
    ---
    
 
    You can see there is a new concept "group" here. Group is logical concept in a hub where you can publish message to a group of connections. In a hub you can have multiple groups and one client can subscribe to multiple groups at the same time. When using subprotocol, you can only publish to a group instead of broadcasting to the whole hub.

2.  Since we use group here, we also need to update the web page `index.html` to join the group when the WebSocket connection is established inside `ws.onopen` callback..
    
    ```javascript
    ws.onopen = () => {
      console.log('connected');
      ws.send(JSON.stringify({
        type: 'joinGroup',
        group: 'stream'
      }));
    };
    ```

    You can see client joins the group by sending a message in `joinGroup` type.

3.  Let's also update the `ws.onmessage` callback logic a little bit to parse the JSON response and print out the messages only from `stream` group so that it acts as live stream printer.

    ```javascript
    ws.onmessage = event => {
      let message = JSON.parse(event.data);
      if (message.type === 'message' && message.group === 'stream') {
        let d = document.createElement('span');
        d.innerText = message.data;
        output.appendChild(d);
        window.scrollTo(0, document.body.scrollHeight);
      }
    };
    ```

4.  For security consideration, by default a client cannot publish or subscribe to a group by itself. We also need to update the token generation code to give client such `roles`:

    # [C#](#tab/csharp)
    
    
    # [JavaScript](#tab/javascript)

    Add the `roles` when `getAuthenticationToken` in `server.js` like below:

    ```javascript
    app.get('/negotiate', async (req, res) => {
      let token = await endpoint.getAuthenticationToken({
        roles: ['webpubsub.sendToGroup.stream', 'webpubsub.joinLeaveGroup.stream']
      });
      ...
    });
    
    ```
    
    # [Python](#tab/python)
    
    
    ---
    

5.  Finally also apply some style to `index.html` so it displays nicely.

    ```html
    <html>

      <head>
        <style>
          #output {
            white-space: pre;
            font-family: monospace;
          }
        </style>
      </head>
    ```

Now run below code and type any text and they will be displayed in the browser in real time:

# [C#](#tab/csharp)


# [JavaScript](#tab/javascript)

`node stream`

Or you can also use this app pipe any output from another console app and stream it to the browser. For example:

```bash
ls -R | node stream
```


Or you make it slower so you can see the data is streamed to browser in real time:

```bash
for i in $(ls -R); do echo $i; sleep 0.1; done | node stream
```

The complete code sample of this tutorial can be found [here][code].

# [Python](#tab/python)


---


## Next steps

This tutorial provides you a basic idea of how to connect to the Web PubSub service and how to publish messages to the connected clients using subprotocol.

Check other tutorials to further dive into how to use the service.

> [!div class="nextstepaction"]
> [Explore more Azure Web PubSub samples](https://aka.ms/awps/samples)

[code]: https://github.com/Azure/azure-webpubsub/tree/main/samples/javascript/logstream/
