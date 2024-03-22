---
title: Tutorial - Publish and subscribe messages between WebSocket clients using subprotocol in Azure Web PubSub service
description: A tutorial to walk through how to use Azure Web PubSub service and its supported WebSocket subprotocol to sync between clients.
author: vicancy
ms.author: lianwei
ms.service: azure-web-pubsub
ms.custom: devx-track-azurecli
ms.topic: tutorial 
ms.date: 01/02/2024
---

# Tutorial: Publish and subscribe messages between WebSocket clients using subprotocol

In [Build a chat app tutorial](./tutorial-build-chat.md), you learned how to use WebSocket APIs to send and receive data with Azure Web PubSub. You can see there's no protocol needed when client is communicating with the service. For example, you can send any type of data using `WebSocket.send()`, and the server receives it just as it is. WebSocket APIs process is easy to use, but the functionality is limited. For example, you can't specify the event name when sending the event to your server, or publish message to other clients instead of sending it to your server. In this tutorial, you learn how to use subprotocol to extend the functionality of client.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a Web PubSub service instance
> * Generate the full URL to establish the WebSocket connection
> * Publish messages between WebSocket clients using subprotocol

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

- This setup requires version 2.22.0 or higher of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Create an Azure Web PubSub instance

### Create a resource group

[!INCLUDE [Create a resource group](includes/cli-rg-creation.md)]

### Create a Web PubSub instance

[!INCLUDE [Create a Web PubSub instance](includes/cli-awps-creation.md)]

### Get the ConnectionString for future use

[!INCLUDE [Get the connection string](includes/cli-awps-connstr.md)]

Copy the fetched **ConnectionString** and use later in this tutorial as the value of `<connection_string>`.

## Set up the project

### Prerequisites

# [C#](#tab/csharp)

* [ASP.NET Core 3.1 or above](/aspnet/core)

# [JavaScript](#tab/javascript)

* [Node.js 12.x or above](https://nodejs.org)

# [Python](#tab/python)
* [Python](https://www.python.org/)

# [Java](#tab/java)
- [Java Development Kit (JDK)](/java/azure/jdk/) version 8 or above
- [Apache Maven](https://maven.apache.org/download.cgi)

---

## Using a subprotocol

The client can start a WebSocket connection using a specific [subprotocol](https://datatracker.ietf.org/doc/html/rfc6455#section-1.9). Azure Web PubSub service supports a subprotocol called `json.webpubsub.azure.v1` to empower the clients to do publish/subscribe directly through the Web PubSub service instead of a round trip to the upstream server. Check [Azure Web PubSub supported JSON WebSocket subprotocol](./reference-json-webpubsub-subprotocol.md) for details about the subprotocol.

> If you use other protocol names, they will be ignored by the service and passthrough to server in the connect event handler, so you can build your own protocols.

Now let's create a web application using the `json.webpubsub.azure.v1` subprotocol.

1.  Install dependencies

    # [C#](#tab/csharp)
    ```bash
    mkdir logstream
    cd logstream
    dotnet new web
    dotnet add package Microsoft.Extensions.Azure
    dotnet add package Azure.Messaging.WebPubSub
    ```
    
    # [JavaScript](#tab/javascript)
    
    ```bash
    mkdir logstream
    cd logstream
    npm init -y
    npm install --save express
    npm install --save ws
    npm install --save node-fetch
    npm install --save @azure/web-pubsub
    ```

    # [Python](#tab/python)
    
    ```bash
    mkdir logstream
    cd logstream
    # Create venv
    python -m venv env
    # Active venv
    source ./env/bin/activate

    pip install azure-messaging-webpubsubservice
    ```
    
    # [Java](#tab/java)
    
    You use the [Javalin](https://javalin.io/) web framework to host the web pages。
    
    1. First let's use Maven to create a new app `logstream-webserver` and switch into the *logstream-webserver* folder:
    
        ```console
        mvn archetype:generate --define interactiveMode=n --define groupId=com.webpubsub.tutorial --define artifactId=logstream-webserver --define archetypeArtifactId=maven-archetype-quickstart --define archetypeVersion=1.4
        cd logstream-webserver
        ```
    
    2. Let's add the Azure Web PubSub SDK and the `javalin` web framework dependency into the `dependencies` node of `pom.xml`:
    
        * `javalin`: simple web framework for Java
        * `slf4j-simple`: Logger for Java
        * `azure-messaging-webpubsub`: The service client SDK for using Azure Web PubSub

        ```xml
        <dependency>
            <groupId>com.azure</groupId>
            <artifactId>azure-messaging-webpubsub</artifactId>
            <version>1.0.0</version>
        </dependency>
        <!-- https://mvnrepository.com/artifact/io.javalin/javalin -->
        <dependency>
            <groupId>io.javalin</groupId>
            <artifactId>javalin</artifactId>
            <version>3.13.6</version>
        </dependency>
    
        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-simple</artifactId>
            <version>1.7.30</version>
        </dependency>
        ```
    ---
    
2.  Create the server-side to host the `/negotiate` API and web page.

    # [C#](#tab/csharp)

    Update `Program.cs` with the below code.
    - Use `AddAzureClients` to add the service client, and read the connection string from configuration. 
    - Add `app.UseStaticFiles();` before `app.Run();` to support static files. 
    - And update `app.MapGet` to generate the client access token with `/negotiate` requests.

    ```csharp
    using Azure.Messaging.WebPubSub;
    using Microsoft.Extensions.Azure;
    
    var builder = WebApplication.CreateBuilder(args);
    builder.Services.AddAzureClients(s =>
    {
        s.AddWebPubSubServiceClient(builder.Configuration["Azure:WebPubSub:ConnectionString"], "stream");
    });
    
    var app = builder.Build();
    app.UseStaticFiles();
    app.MapGet("/negotiate", async context =>
    {
        var service = context.RequestServices.GetRequiredService<WebPubSubServiceClient>();
        var response = new
        {
            url = service.GetClientAccessUri(roles: new string[] { "webpubsub.sendToGroup.stream", "webpubsub.joinLeaveGroup.stream" }).AbsoluteUri
        };
        await context.Response.WriteAsJsonAsync(response);
    });
    
    app.Run();
    ```
    
    # [JavaScript](#tab/javascript)

    Create a `server.js` and add below code:

    ```javascript
    const express = require('express');
    const { WebPubSubServiceClient } = require('@azure/web-pubsub');

    let service = new WebPubSubServiceClient(process.env.WebPubSubConnectionString, 'stream');
    const app = express();

    app.get('/negotiate', async (req, res) => {
      let token = await service.getClientAccessToken({
        roles: ['webpubsub.sendToGroup.stream', 'webpubsub.joinLeaveGroup.stream']
      });
      res.send({
        url: token.url
      });
    });

    app.use(express.static('public'));
    app.listen(8080, () => console.log('server started'));
    ```

    # [Python](#tab/python)
    
    Create a `server.py` to host the `/negotiate` API and web page.

    ```python
    import json
    import sys
    
    from http.server import HTTPServer, SimpleHTTPRequestHandler
    
    from azure.messaging.webpubsubservice import WebPubSubServiceClient
    
    service = WebPubSubServiceClient.from_connection_string(sys.argv[1], hub='stream')
    
    class Resquest(SimpleHTTPRequestHandler):
        def do_GET(self):
            if self.path == '/':
                self.path = 'public/index.html'
                return SimpleHTTPRequestHandler.do_GET(self)
            elif self.path == '/negotiate':
                roles = ['webpubsub.sendToGroup.stream',
                         'webpubsub.joinLeaveGroup.stream']
                token = service.get_client_access_token(roles=roles)
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'url': token['url']
                }).encode())
    
    if __name__ == '__main__':
        if len(sys.argv) != 2:
            print('Usage: python server.py <connection-string>')
            exit(1)
    
        server = HTTPServer(('localhost', 8080), Resquest)
        print('server started')
        server.serve_forever()
    
    ```
    
    # [Java](#tab/java)

    Let's navigate to the */src/main/java/com/webpubsub/tutorial* directory, open the *App.java* file in your editor, use `Javalin.create` to serve static files:

    ```java
    package com.webpubsub.tutorial;
    
    import com.azure.messaging.webpubsub.WebPubSubServiceClient;
    import com.azure.messaging.webpubsub.WebPubSubServiceClientBuilder;
    import com.azure.messaging.webpubsub.models.GetClientAccessTokenOptions;
    import com.azure.messaging.webpubsub.models.WebPubSubClientAccessToken;
    
    import io.javalin.Javalin;
    
    public class App {
        public static void main(String[] args) {
            
            if (args.length != 1) {
                System.out.println("Expecting 1 arguments: <connection-string>");
                return;
            }
    
            // create the service client
            WebPubSubServiceClient service = new WebPubSubServiceClientBuilder()
                    .connectionString(args[0])
                    .hub("chat")
                    .buildClient();
    
            // start a server
            Javalin app = Javalin.create(config -> {
                config.addStaticFiles("public");
            }).start(8080);
    
            
            // Handle the negotiate request and return the token to the client
            app.get("/negotiate", ctx -> {
                GetClientAccessTokenOptions option = new GetClientAccessTokenOptions();
                option.addRole("webpubsub.sendToGroup.stream");
                option.addRole("webpubsub.joinLeaveGroup.stream");
                WebPubSubClientAccessToken token = service.getClientAccessToken(option);
    
                // return JSON string
                ctx.result("{\"url\":\"" + token.getUrl() + "\"}");
                return;
            });
        }
    }
    ```

    Depending on your setup, you might need to explicitly set the language level to Java 8 in the pom.xml. Add the following snippet:
    ```xml
    <build>
        <plugins>
            <plugin>
              <artifactId>maven-compiler-plugin</artifactId>
              <version>3.8.0</version>
              <configuration>
                <source>1.8</source>
                <target>1.8</target>
              </configuration>
            </plugin>
        </plugins>
    </build>
    ```
    ---
    
3.  Create the web page

    # [C#](#tab/csharp)
    Create an HTML page with below content and save it as `wwwroot/index.html`:
    
    # [JavaScript](#tab/javascript)

    Create an HTML page with below content and save it as `public/index.html`:

    # [Python](#tab/python)

    Create an HTML page with below content and save it as `public/index.html`:
    
    # [Java](#tab/java)

    Create an HTML page with below content and save it to */src/main/resources/public/index.html*:

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

    The code above connects to the service and print any message received to the page. The main change is that we specify the subprotocol when creating the WebSocket connection.

4. Run the server
    # [C#](#tab/csharp)
    We use [Secret Manager](/aspnet/core/security/app-secrets#secret-manager) tool for .NET Core to set the connection string. Run the below command, replacing `<connection_string>` with the one fetched in [previous step](#get-the-connectionstring-for-future-use), and open http://localhost:5000/index.html in browser:

    ```bash
    dotnet user-secrets init
    dotnet user-secrets set Azure:WebPubSub:ConnectionString "<connection-string>"
    dotnet run
    ```
    
    # [JavaScript](#tab/javascript)
    
    Now run the below command, replacing `<connection-string>` with the **ConnectionString** fetched in [previous step](#get-the-connectionstring-for-future-use), and open http://localhost:8080 in browser:

    ```bash
    export WebPubSubConnectionString="<connection-string>"
    node server
    ```
    
    # [Python](#tab/python)

    Now run the below command, replacing `<connection-string>` with the **ConnectionString** fetched in [previous step](#get-the-connectionstring-for-future-use), and open http://localhost:8080 in browser:

    ```bash
    python server.py "<connection-string>"
    ```

    # [Java](#tab/java)

    Now run the below command, replacing `<connection-string>` with the **ConnectionString** fetched in [previous step](#get-the-connectionstring-for-future-use), and open http://localhost:8080 in browser:

    ```console
    mvn compile & mvn package & mvn exec:java -Dexec.mainClass="com.webpubsub.tutorial.App" -Dexec.cleanupDaemonThreads=false -Dexec.args="'<connection_string>'"
    ```
    ---

    If you're using Chrome, you can press F12 or right-click -> **Inspect** -> **Developer Tools**, and select the **Network** tab. Load the web page, and you can see the WebSocket connection is established. Select to inspect the WebSocket connection, you can see below `connected` event message is received in client. You can see that you can get the `connectionId` generated for this client.
    
    ```json
    {"type":"system","event":"connected","userId":null,"connectionId":"<the_connection_id>"}
    ```

You can see that with the help of subprotocol, you can get some metadata of the connection when the connection is `connected`.

The client now receives a JSON message instead of a plain text. JSON message contains more information such as type and source of the message. So you can use this information to do more processing to the message (for example, display the message in a different style if it's from a different source), which you can find in later sections.

## Publish messages from client

In the [Build a chat app](./tutorial-build-chat.md) tutorial, when client sends a message through WebSocket connection to the Web PubSub service, the service triggers a user event at your server side. With subprotocol, client has more functionalities by sending a JSON message. For example, you can publish messages directly from client through the Web PubSub service to other clients.

This is useful if you want to stream a large amount of data to other clients in real time. Let's use this feature to build a log streaming application, which can stream console logs to browser in real time.

1. Creating the streaming program
 
    # [C#](#tab/csharp)
    Create a `stream` program:
    ```bash
    mkdir stream
    cd stream
    dotnet new console
    ```
    
    Update `Program.cs` with the following content:
    ```csharp
    using System;
    using System.Net.Http;
    using System.Net.WebSockets;
    using System.Text;
    using System.Text.Json;
    using System.Threading.Tasks;
    
    namespace stream
    {
        class Program
        {
            private static readonly HttpClient http = new HttpClient();
            static async Task Main(string[] args)
            {
                // Get client url from remote
                var stream = await http.GetStreamAsync("http://localhost:5000/negotiate");
                var url = (await JsonSerializer.DeserializeAsync<ClientToken>(stream)).url;
                var client = new ClientWebSocket();
                client.Options.AddSubProtocol("json.webpubsub.azure.v1");
    
                await client.ConnectAsync(new Uri(url), default);
    
                Console.WriteLine("Connected.");
                var streaming = Console.ReadLine();
                while (streaming != null)
                {
                    if (!string.IsNullOrEmpty(streaming))
                    {
                        var message = JsonSerializer.Serialize(new
                        {
                            type = "sendToGroup",
                            group = "stream",
                            data = streaming + Environment.NewLine,
                        });
                        Console.WriteLine("Sending " + message);
                        await client.SendAsync(Encoding.UTF8.GetBytes(message), WebSocketMessageType.Text, true, default);
                    }
    
                    streaming = Console.ReadLine();
                }
    
                await client.CloseAsync(WebSocketCloseStatus.NormalClosure, null, default);
            }
    
            private sealed class ClientToken
            {
                public string url { get; set; }
            }
        }
    }
    
    ```

    # [JavaScript](#tab/javascript)
    Create a `stream.js` with the following content.
    
    ```javascript
    const WebSocket = require('ws');
    const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

    async function main() {
      let res = await fetch(`http://localhost:8080/negotiate`);
      let data = await res.json();
      let ws = new WebSocket(data.url, 'json.webpubsub.azure.v1');
      let ackId = 0;
      ws.on('open', () => {
        process.stdin.on('data', data => {
          ws.send(JSON.stringify({
            type: 'sendToGroup',
            group: 'stream',
            ackId: ++ackId,
            dataType: 'text',
            data: data.toString()
          }));
        });
      });
      ws.on('message', data => console.log("Received: %s", data));
      process.stdin.on('close', () => ws.close());
    }

    main();
    ```

    The code above creates a WebSocket connection to the service and then whenever it receives some data it uses `ws.send()` to publish the data. In order to publish to others, you just need to set `type` to `sendToGroup` and specify a group name in the message.

    # [Python](#tab/python)

    Open another bash window for the `stream` program, and install the `websockets` dependency:

    ```bash
    mkdir stream
    cd stream

    # Create venv
    python -m venv env
    # Active venv
    source ./env/bin/activate

    pip install websockets
    ```

    Create a `stream.py` with the following content.

    ```python
    import asyncio
    import sys
    import threading
    import time
    import websockets
    import requests
    import json
    
    async def connect(url):
        async with websockets.connect(url, subprotocols=['json.webpubsub.azure.v1']) as ws:
            print('connected')
            id = 1
            while True:
                data = input()
                payload = {
                    'type': 'sendToGroup',
                    'group': 'stream',
                    'dataType': 'text',
                    'data': str(data + '\n'),
                    'ackId': id
                }
                id = id + 1
                await ws.send(json.dumps(payload))
                await ws.recv()
    
    if __name__ == '__main__':
        res = requests.get('http://localhost:8080/negotiate').json()
    
        try:
            asyncio.get_event_loop().run_until_complete(connect(res['url']))
        except KeyboardInterrupt:
            pass
    
    ```

    The code above creates a WebSocket connection to the service and then whenever it receives some data it uses `ws.send()` to publish the data. In order to publish to others, you just need to set `type` to `sendToGroup` and specify a group name in the message.
    
    # [Java](#tab/java)

    1.  Let's use another terminal and go back to the root folder to create a streaming console app `logstream-streaming` and switch into the *logstream-streaming* folder:
        ```console
        mvn archetype:generate --define interactiveMode=n --define groupId=com.webpubsub.quickstart --define artifactId=logstream-streaming --define archetypeArtifactId=maven-archetype-quickstart --define archetypeVersion=1.4
        cd logstream-streaming
        ```
    
    2. Let's add HttpClient dependencies into the `dependencies` node of `pom.xml`:
    
        ```xml
        <!-- https://mvnrepository.com/artifact/org.apache.httpcomponents/httpclient -->
        <dependency>
            <groupId>org.apache.httpcomponents</groupId>
            <artifactId>httpclient</artifactId>
            <version>4.5.13</version>
        </dependency>
        <dependency>
          <groupId>com.google.code.gson</groupId>
          <artifactId>gson</artifactId>
          <version>2.8.9</version>
        </dependency>
        ```
    
    3. Now let's use WebSocket to connect to the service. Let's navigate to the */src/main/java/com/webpubsub/quickstart* directory, open the *App.java* file in your editor, and replace code with the below:
    ```java
    package com.webpubsub.quickstart;
    
    import java.io.BufferedReader;
    import java.io.IOException;
    import java.io.InputStreamReader;
    import java.net.URI;
    import java.net.http.HttpClient;
    import java.net.http.HttpRequest;
    import java.net.http.HttpResponse;
    import java.net.http.WebSocket;
    import java.util.concurrent.CompletionStage;
    
    import com.google.gson.Gson;
    
    public class App 
    {
        public static void main( String[] args ) throws IOException, InterruptedException
        {
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("http://localhost:8080/negotiate"))
                .build();
    
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            
            Gson gson = new Gson();
    
            String url = gson.fromJson(response.body(), Entity.class).url;
    
            WebSocket ws = HttpClient.newHttpClient().newWebSocketBuilder().subprotocols("json.webpubsub.azure.v1")
                    .buildAsync(URI.create(url), new WebSocketClient()).join();
            int id = 0;
            BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
            String streaming = reader.readLine();
            App app = new App();
            while (streaming != null && !streaming.isEmpty()){
                String frame = gson.toJson(app.new GroupMessage(streaming + "\n", ++id));
                System.out.println("Sending: " + frame);
                ws.sendText(frame, true);
                streaming = reader.readLine();
            }
        }
    
        private class GroupMessage{
            public String data;
            public int ackId;
            public final String type = "sendToGroup";
            public final String group = "stream";
            
            GroupMessage(String data, int ackId){
                this.data = data;
                this.ackId = ackId;
            }
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
    
        private static final class Entity {
            public String url;
        }
    }
    
    ```

    4. Navigate to the directory containing the *pom.xml* file and run the project using the below command
    
      ```console
      mvn compile & mvn package & mvn exec:java -Dexec.mainClass="com.webpubsub.quickstart.App" -Dexec.cleanupDaemonThreads=false
      ```
    
    ---
    
    You can see there's a new concept "group" here. Group is logical concept in a hub where you can publish message to a group of connections. In a hub, you can have multiple groups and one client can subscribe to multiple groups at the same time. When using subprotocol, you can only publish to a group instead of broadcasting to the whole hub. For details about the terms, check the [basic concepts](./key-concepts.md).

2.  Since we use group here, we also need to update the web page `index.html` to join the group when the WebSocket connection is established inside `ws.onopen` callback.
    
    ```javascript
    let ackId = 0;
    ws.onopen = () => {
      console.log('connected');
      ws.send(JSON.stringify({
        type: 'joinGroup',
        group: 'stream',
        ackId: ++ackId
      }));
    };
    ```

    You can see client joins the group by sending a message in `joinGroup` type.

3.  Also update the `ws.onmessage` callback logic slightly to parse the JSON response and print the messages only from `stream` group so that it acts as live stream printer.

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

4.  For security consideration, by default a client can't publish or subscribe to a group by itself. So you noticed that we set `roles` to the client when generating the token:

    # [C#](#tab/csharp)
    Set the `roles` when `GenerateClientAccessUri` in `Startup.cs` like below:
    ```csharp
    service.GenerateClientAccessUri(roles: new string[] { "webpubsub.sendToGroup.stream", "webpubsub.joinLeaveGroup.stream" })
    ```

    # [JavaScript](#tab/javascript)

    Add the `roles` when `getClientAccessToken` in `server.js` like below:

    ```javascript
    app.get('/negotiate', async (req, res) => {
      let token = await service.getClientAccessToken({
        roles: ['webpubsub.sendToGroup.stream', 'webpubsub.joinLeaveGroup.stream']
      });
      ...
    });
    
    ```
    
    # [Python](#tab/python)
    
    Set the correct roles to the client in `server.py` during the access token generation process:

    ```python
    roles = ['webpubsub.sendToGroup.stream',
              'webpubsub.joinLeaveGroup.stream']
    token = service.get_client_access_token(roles=roles)
    ```
    
    # [Java](#tab/java)
    
    Set the correct roles to the client in `App.java` during the access token generation process:

    ```java
    GetClientAccessTokenOptions option = new GetClientAccessTokenOptions();
    option.addRole("webpubsub.sendToGroup.stream");
    option.addRole("webpubsub.joinLeaveGroup.stream");
    WebPubSubClientAccessToken token = service.getClientAccessToken(option);

    ```
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

Now run below code and type any text and they're displayed in the browser in real time:

# [C#](#tab/csharp)

```bash
ls -R | dotnet run

# Or call `dir /s /b | dotnet run` when you are using CMD under Windows

```

Or you make it slower so you can see the data is streamed to browser in real time:

```bash
for i in $(ls -R); do echo $i; sleep 0.1; done | dotnet run
```

The complete code sample of this tutorial can be found [here][code-csharp].

# [JavaScript](#tab/javascript)

`node stream`

Or you can also use this app pipe any output from another console app and stream it to the browser. For example:

```bash
ls -R | node stream

# Or call `dir /s /b | node stream` when you are using CMD under Windows
```

Or you make it slower so you can see the data is streamed to browser in real time:

```bash
for i in $(ls -R); do echo $i; sleep 0.1; done | node stream
```

The complete code sample of this tutorial can be found [here][code-js].

# [Python](#tab/python)

Now you can run `python stream.py`, type any text and they're displayed in the browser in real time.

Or you can also use this app pipe any output from another console app and stream it to the browser. For example:

```bash
ls -R | python stream.py

# Or call `dir /s /b | python stream.py` when you are using CMD under Windows
```

Or you make it slower so you can see the data is streamed to browser in real time:

```bash
for i in $(ls -R); do echo $i; sleep 0.1; done | python stream.py
```

The complete code sample of this tutorial can be found [here][code-python].


# [Java](#tab/java)

Now you can run below code, type any text and they're displayed in the browser in real time.

```console
mvn compile & mvn package & mvn exec:java -Dexec.mainClass="com.webpubsub.quickstart.App" -Dexec.cleanupDaemonThreads=false
```

The complete code sample of this tutorial can be found [here][code-java].

---


## Next steps

This tutorial provides you with a basic idea of how to connect to the Web PubSub service and how to publish messages to the connected clients using subprotocol.

Check other tutorials to further dive into how to use the service.

> [!div class="nextstepaction"]
> [Explore more Azure Web PubSub samples](https://aka.ms/awps/samples)

[code-csharp]: https://github.com/Azure/azure-webpubsub/tree/main/samples/csharp/logstream/

[code-js]: https://github.com/Azure/azure-webpubsub/tree/main/samples/javascript/logstream/

[code-python]: https://github.com/Azure/azure-webpubsub/tree/main/samples/python/logstream/

[code-java]: https://github.com/Azure/azure-webpubsub/tree/main/samples/java/logstream/
