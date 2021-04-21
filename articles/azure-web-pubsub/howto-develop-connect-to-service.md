---
title: How to connect to Azure Web PubSub service
description: An overview on connecting to Azure Web PubSub service with different programming languages
author: yjin81
ms.author: yajin1
ms.service: azure-web-pubsub
ms.topic: how-to 
ms.date: 04/12/2021
---

# How to connect to Azure Web PubSub service

After [creating the instance of Azure Web PubSub](./howto-develop-create-instance.md), you need to connect your server or client to the Azure Web PubSub service. This how-to guide shows you the way to connect to Azure Web PubSub service with specific programming language.

## Connect client with Azure Web PubSub

### Generate the Client Access URL

As the first step, you need to get the Client URL from the Azure Web PubSub instance. 

- Go to Azure portal and find out the Azure Web PubSub instance.
- Go to the `Client URL Generator` in `Key` blade. 
- Set proper `Roles`.
- Generate and copy the `Client Access URL`. 

### Set up the environment 

# [JavaScript](#tab/javascript)
The browser already has the native support for WebSocket.

ForNode.js, install a code editor, such as [Visual Studio Code](https://code.visualstudio.com/), and also the library [Node.js](https://nodejs.org/en/download/), version 10.x. 

Install the package `ws` to connect client to service.

```nodejs
npm install ws
```

Install the [server SDK](choose-server-sdks.md) to connect server to service.

# [C#](#tab/csharp)
If you don't already have Visual Studio 2019 installed, you can download and use the **free** [Visual Studio 2019 Community Edition](https://www.visualstudio.com/downloads). Make sure that you enable **Azure development** during the Visual Studio setup.

Install the [.NET 3.1 or later](https://dotnet.microsoft.com/download/dotnet).

Install the [server SDK](choose-server-sdks.md) to connect server to service.

# [Java](#tab/java)
Install a code editor, such as [Visual Studio Code](https://code.visualstudio.com/), and also the library [Java Developer Kit](https://www.azul.com/downloads/zulu/) and [Apache Maven](https://maven.apache.org).

Add WebSocket dependency in Maven. 

```xml
<dependency>
    <groupId>javax.websocket</groupId>
    <artifactId>javax.websocket-api</artifactId>
    <version>1.1</version>
    <scope>provided</scope>
</dependency>
```

Install the [server SDK](choose-server-sdks.md) to connect server to service.

# [Python](#tab/python)
Install a code editor, such as [Visual Studio Code](https://code.visualstudio.com/), and also the library [Python 3.x](https://www.python.org/downloads/).

Install WebSocket library to connect client to service. 

```bash
pip install websockets
```

Install the [server SDK](choose-server-sdks.md) to connect server to service.

---

### Connect simple WebSocket client to Azure Web PubSub

The simple WebSocket client uses the WebSocket connection to connect to Azure Web PubSub service, and could have your own custom subprotocol.

# [JavaScript](#tab/javascript)

```js
const WebSocket = require('ws');
const client = new WebSocket("{Client_Access_URL}");
client.on('open', () => {
    client.on('message', msg => console.log(msg));
});
```

# [C#](#tab/csharp)

```csharp
using System;
using System.IO;
using System.Net.WebSockets;
using System.Text;
using System.Threading.Tasks;
namespace subscriber
{
    class Program
    {
        static async Task Main(string[] args)
        {
            using var webSocket = new ClientWebSocket();
            await webSocket.ConnectAsync("{Client_Access_URL}", default);
            Console.WriteLine("Connected");
            var ms = new MemoryStream();
            Memory<byte> buffer = new byte[1024];
            // receive loop
            while (true)
            {
                var receiveResult = await webSocket.ReceiveAsync(buffer, default);
                // Need to check again for NetCoreApp2.2 because a close can happen between a 0-byte read and the actual read
                if (receiveResult.MessageType == WebSocketMessageType.Close)
                {
                    try
                    {
                        await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, string.Empty, default);
                    }
                    catch
                    {
                        // It is possible that the remote is already closed
                    }
                    break;
                }
                await ms.WriteAsync(buffer.Slice(0, receiveResult.Count));
                if (receiveResult.EndOfMessage)
                {
                    Console.WriteLine(Encoding.UTF8.GetString(ms.ToArray()));
                    ms.SetLength(0);
                }
            }
        }
    }
}
```

# [Java](#tab/java)

# [Python](#tab/python)

```python
import asyncio
import websockets

async def websocket_client():
    async with websockets.connect('Client_Access_URL') as websocket:
        name = input("What's your name? ")
        await websocket.send(name)
        print("> {}".format(name))

        greeting = await websocket.recv()
        print("< {}".format(greeting))

asyncio.get_event_loop().run_until_complete(websocket_client())
```

---

### Connect PubSub WebSocket client to Azure Web PubSub

The Azure Web PubSub service supports a specific subprotocol called `json.webpubsub.azure.v1` which enables the clients to do publish/subscribe directly instead of a round trip to the upstream server. We call the WebSocket connection with `json.webpubsub.azure.v1` subprotocol a PubSub WebSocket client.

# [JavaScript](#tab/javascript)

```javascript
const WebSocket = require('ws');

async function main() {
  const subscriber = new WebSocket("{Client_Access_URL}", "json.webpubsub.azure.v1");
  const publisher = new WebSocket("{Client_Access_URL}", "json.webpubsub.azure.v1");

  publisher.on('message', msg => {
    console.log(msg);
  });
  const subscriberConnected = new Promise(resolve => subscriber.once('open', resolve));
  const publisherConnected = new Promise(resolve => publisher.once('open', resolve));
  const joined = new Promise(resolve => {
    subscriber.on('message', msg => {
      console.log(msg);
      const obj = JSON.parse(msg);
      if (obj.ackId && obj.success) {
        resolve();
      }
    });
  });

  // make sure both are connected
  await subscriberConnected;
  await publisherConnected;

  subscriber.send(JSON.stringify({
    type: "joinGroup",
    group: "group1",
    ackId: 1, // use ackId to receive ack messages
  }));

  // make sure the subscriber is successfully joined
  await joined;

  // publish to the group to see if the subscriber can receive the message
  publisher.send(JSON.stringify({
    type: "sendToGroup",
    group: "group1",
    data: {
      "msg1": "Hello world"
    }
  }));
}

main();
```

# [C#](#tab/csharp)

# [Java](#tab/java)

# [Python](#tab/python)

---

### Connect server to Azure Web PubSub

# [JavaScript](#tab/javascript)

```javascript
const { WebPubSubServiceClient } = require('@azure/web-pubsub');
let serviceClient = new WebPubSubServiceClient("{ConnectionString}", 'chat');

let token = await serviceClient.getAuthenticationToken({ userId: id });
await serviceClient.sendToAll("Hello", { contentType: 'text/plain'});
await serviceClient.sendToAll({"hello": "world"});
```

# [C#](#tab/csharp)

```csharp
using System;
using System.IO;
using System.Net.WebSockets;
using System.Text;
using System.Threading.Tasks;
using Azure.Messaging.WebPubSub;
namespace publisher
{
    class Program
    {
        static async Task Main(string[] args)
        {
            var serviceClient = new WebPubSubServiceClient(new Uri(endpoint), hub, new Azure.AzureKeyCredential(accesskey));
            await serviceClient.SendToAllAsync("hello");
        }
    }
}
```

# [Java](#tab/java)

```java
WebPubSubClientBuilder webPubSubClientBuilder = new WebPubSubClientBuilder()
    .connectionString(CONNECTION_STRING)
    .httpClient(HttpClient.createDefault())
    .hub("test");

WebPubSubServiceClient client = webPubSubClientBuilder
    .buildClient();
WebPubSubGroup groupClient = client.getGroup("test_group");

// Send plain text
client.sendToAllWithResponse(
        "Hello World - Broadcast test!",
        WebPubSubContentType.TEXT_PLAIN);

// Send JSON text
client.sendToAllWithResponse("{\"boolvalue\": true}");

// Group related
groupClient.checkUserExists("user1");
```

# [Python](#tab/python)

```python
from azure.messaging.webpubsubservice import WebPubSubServiceClient
from azure.core.credentials import AzureKeyCredential
from azure.messaging.webpubsubservice.rest import build_send_to_all_request

client = WebPubSubServiceClient(endpoint='{Endpoint}', credential=AzureKeyCredential('{AccessKey}'))

request = build_send_to_all_request('{HubName}', json={ 'Hello':  'webpubsub!' })
response = client.send_request(request)
```

---