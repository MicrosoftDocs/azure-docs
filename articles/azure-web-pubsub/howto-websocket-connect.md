---
title: How to start a WebSocket connection to Azure Web PubSub
description: Learn how to start a WebSocket connection to the Azure Web PubSub service in different languages.
author: vicancy
ms.author: lianwei
ms.service: azure-web-pubsub
ms.topic: how-to 
ms.date: 11/08/2021
---

#  Start a WebSocket connection to Azure Web PubSub

Clients connect to the Azure Web PubSub service by using the standard [WebSocket](https://tools.ietf.org/html/rfc6455) protocol. You can use languages that have WebSocket client support to write a client for the service. In this article, you'll see several WebSocket client samples in different languages.

## Authorization

Web PubSub uses a [JSON Web Token (JWT)](https://tools.ietf.org/html/rfc7519.html) to validate and authorize clients. Clients can either put the token in the `access_token` query parameter, or put it in the `Authorization` header when connecting to the service.

Typically, the client communicates with its app server first, to get the URL of the service and the token. Then, the client opens the WebSocket connection to the service by using the URL and token it receives.

The portal also provides a tool to generate the client URL with the token dynamically. This tool can be useful to do a quick test.

:::image type="content" source="./media/howto-websocket-connect/generate-client-url.png" alt-text="Screenshot showing where to find the Client URL Generator.":::

> [!NOTE]
> Make sure to only include necessary roles when you're generating the token.
>

In the following sections, to simplify the sample workflow, we use this temporarily generated URL from the portal for the client to connect. We use `<Client_URL_From_Portal>` to represent the value. The token generated expires in 60 minutes by default, so don't forget to regenerate one when the token expires.

The service supports two types of WebSocket clients: one is the simple WebSocket client, and the other is the PubSub WebSocket client. Here we show how these two kinds of clients connect to the service. For more information about these clients, see [WebSocket client protocols for Azure Web PubSub](./concept-client-protocols.md).

## Dependency

# [In Browser](#tab/browser)
In most modern browsers, `WebSocket` API is natively supported. 

# [Node.js](#tab/javascript)

* [Node.js 12.x or later](https://nodejs.org)
* `npm install ws`

# [Python](#tab/python)
* [Python](https://www.python.org/)
* `pip install websockets`

# [C#](#tab/csharp)

* [.NET Core 2.1 or later](https://dotnet.microsoft.com/download)
* `dotnet add package Websocket.Client`
    * [Websocket.Client](https://github.com/Marfusios/websocket-client) is a third-party WebSocket client with built-in reconnection and error handling.

# [Java](#tab/java)
- [Java Development Kit (JDK)](/java/azure/jdk/) version 8 or later.
- [Apache Maven](https://maven.apache.org/download.cgi).

---

## Simple WebSocket client

# [In Browser](#tab/browser)

Inside the `script` block of the HTML page:
```html
<script>
    // Don't forget to replace this <Client_URL_From_Portal> with the value fetched from the portal
    let ws = new WebSocket("<Client_URL_From_Portal>");
    ws.onopen = () => {
        // Do things when the WebSocket connection is established
    };

    ws.onmessage = event => {
        // Do things when messages are received.
    };
</script>
```

# [Node.js](#tab/javascript)

```js
const WebSocket = require('ws');
// Don't forget to replace this <Client_URL_From_Portal> with the value fetched from the portal
const client = new WebSocket("<Client_URL_From_Portal>");
client.on('open', () => {
     // Do things when the WebSocket connection is established
});
client.on('message', msg => {
     // Do things when messages are received.
});
```

# [Python](#tab/python)

```python
import asyncio
import websockets

async def hello():
    # Don't forget to replace this <Client_URL_From_Portal> with the value fetched from the portal
    uri = '<Client_URL_From_Portal>'
    async with websockets.connect(uri) as ws:
        while True:
            await ws.send('hello')
            greeting = await ws.recv()
            print(greeting)

asyncio.get_event_loop().run_until_complete(hello())
```

# [C#](#tab/csharp)

```csharp
using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using Websocket.Client;

namespace subscriber
{
    class Program
    {
        static async Task Main(string[] args)
        {
            // Don't forget to replace this <Client_URL_From_Portal> with the value fetched from the portal
            using (var client = new WebsocketClient(new Uri("<Client_URL_From_Portal>")))
            {
                // Disable the auto disconnect and reconnect because the sample would like the client to stay online even if no data comes in
                client.ReconnectTimeout = null;
                client.MessageReceived.Subscribe(msg => Console.WriteLine($"Message received: {msg}"));
                await client.Start();
                Console.WriteLine("Connected.");
                Console.Read();
            }
        }
    }
}
```

# [Java](#tab/java)

```java
package client;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.WebSocket;
import java.util.concurrent.CompletionStage;

/**
 * A simple WebSocket Client.
 *
 */
public final class SimpleClient {
    private SimpleClient() {
    }

    /**
     * Starts a simple WebSocket connection.
     * @param args The arguments of the program.
     */
    public static void main(String[] args) throws Exception {
        // Don't forget to replace this <Client_URL_From_Portal> with the value fetched from the portal
        WebSocket ws = HttpClient.newHttpClient().newWebSocketBuilder()
                .buildAsync(URI.create("<Client_URL_From_Portal>"), new WebSocketClient()).join();
        System.in.read();
    }

    private static final class WebSocketClient implements WebSocket.Listener {
        private WebSocketClient() {
        }

        @Override
        public void onOpen(WebSocket webSocket) {
            System.out.println("onOpen using subprotocol " + webSocket.getSubprotocol());
            WebSocket.Listener.super.onOpen(webSocket);
        }

        @Override
        public CompletionStage<?> onText(WebSocket webSocket, CharSequence data, boolean last) {
            System.out.println("onText received " + data);
            return WebSocket.Listener.super.onText(webSocket, data, last);
        }

        @Override
        public void onError(WebSocket webSocket, Throwable error) {
            System.out.println("Bad day! " + webSocket.toString());
            WebSocket.Listener.super.onError(webSocket, error);
        }
    }
}

```


---

## PubSub WebSocket client

# [In Browser](#tab/browser)

Inside the `script` block of the HTML page:
```html
<script>
    // Don't forget to replace this <Client_URL_From_Portal> with the value fetched from the portal
    let ws = new WebSocket("<Client_URL_From_Portal>", 'json.webpubsub.azure.v1');
    ws.onopen = () => {
        // Do things when the WebSocket connection is established
    };

    ws.onmessage = event => {
        // Do things when messages are received.
    };
</script>
```

# [Node.js](#tab/javascript)

```js
const WebSocket = require('ws');
// Don't forget to replace this <Client_URL_From_Portal> with the value fetched from the portal
const client = new WebSocket("<Client_URL_From_Portal>", "json.webpubsub.azure.v1");
client.on('open', () => {
     // Do things when the WebSocket connection is established
});
client.on('message', msg => {
     // Do things when messages are received.
});
```

# [Python](#tab/python)

```python
import asyncio
import websockets

async def join_group():
    # Don't forget to replace this <Client_URL_From_Portal> with the value fetched from the portal
    uri = '<Client_URL_From_Portal>'
    async with websockets.connect(uri, subprotocols=['json.webpubsub.azure.v1']) as ws:
        await ws.send('{"type":"joinGroup","ackId":1,"group":"group1"}')
        return await ws.recv()

print(asyncio.get_event_loop().run_until_complete(join_group()))
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
            // Don't forget to replace this <Client_URL_From_Portal> with the value fetched from the portal
            using (var client = new WebsocketClient(new Uri("<Client_URL_From_Portal>"), () =>
            {
                var inner = new ClientWebSocket();
                inner.Options.AddSubProtocol("json.webpubsub.azure.v1");
                return inner;
            }))
            {
                // Disable the auto disconnect and reconnect because the sample would like the client to stay online even if no data comes in
                client.ReconnectTimeout = null;
                client.MessageReceived.Subscribe(msg => Console.WriteLine($"Message received: {msg}"));
                await client.Start();
                Console.WriteLine("Connected.");
                Console.Read();
            }
        }
    }
}
```

# [Java](#tab/java)

```java
package client;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.WebSocket;
import java.util.concurrent.CompletionStage;

/**
 * A PubSub WebSocket Client.
 *
 */
public final class SubprotocolClient {
    private SubprotocolClient() {
    }

    /**
     * Starts a PubSub WebSocket connection.
     * @param args The arguments of the program.
     */
    public static void main(String[] args) throws Exception {
        // Don't forget to replace this <Client_URL_From_Portal> with the value fetched from the portal
        WebSocket ws = HttpClient.newHttpClient().newWebSocketBuilder().subprotocols("json.webpubsub.azure.v1")
                .buildAsync(URI.create("<Client_URL_From_Portal>"), new WebSocketClient()).join();

        ws.sendText("{\"type\":\"joinGroup\",\"ackId\":1,\"group\":\"group1\"}", true);
        System.in.read();
    }

    private static final class WebSocketClient implements WebSocket.Listener {
        private WebSocketClient() {
        }

        @Override
        public void onOpen(WebSocket webSocket) {
            System.out.println("onOpen using subprotocol " + webSocket.getSubprotocol());
            WebSocket.Listener.super.onOpen(webSocket);
        }

        @Override
        public CompletionStage<?> onText(WebSocket webSocket, CharSequence data, boolean last) {
            System.out.println("onText received " + data);
            return WebSocket.Listener.super.onText(webSocket, data, last);
        }

        @Override
        public void onError(WebSocket webSocket, Throwable error) {
            System.out.println("Bad day! " + webSocket.toString());
            WebSocket.Listener.super.onError(webSocket, error);
        }
    }
}
```

---

## Next steps

In this article, you learned how to connect to the service by using the URL generated from the portal. To see how the clients communicate with the app server to get the URL in real-world applications, read these tutorials and check out the samples.

> [!div class="nextstepaction"]
> [Tutorial: Create a chatroom with Azure Web PubSub](./tutorial-build-chat.md)

> [!div class="nextstepaction"]
> [Tutorial: Client streaming using service-supported subprotocol](./tutorial-subprotocol.md)

> [!div class="nextstepaction"]
> [Explore more Azure Web PubSub samples](https://aka.ms/awps/samples)

