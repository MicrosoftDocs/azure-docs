---
title: Tutorial - Publish and subscribe messages using WebSocket API and Azure Web PubSub service SDK
description: A tutorial to walk through how to use Azure Web PubSub service and Azure Functions to build a serverless application.
author: vicancy
ms.author: lianwei
ms.service: azure-web-pubsub
ms.topic: tutorial 
ms.date: 11/01/2021
---

# Tutorial: Publish and subscribe messages using WebSocket API and Azure Web PubSub service SDK

The Azure Web PubSub service helps you build real-time messaging web applications using WebSockets and the publish-subscribe pattern easily. In this tutorial, you'll learn how to subscribe to the service using WebSocket API and publish messages and using the service SDK.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a Web PubSub service instance
> * Generate the full URL to establish the WebSocket connection
> * Subscribe messages using standard WebSocket protocol
> * Publish messages using service SDK

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment.md)]

- This setup requires version 2.22.0 or higher of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Create an Azure Web PubSub instance

### Create a resource group

[!INCLUDE [Create a resource group](includes/cli-rg-creation.md)]

### Create a Web PubSub instance

[!INCLUDE [Create a Web PubSub instance](includes/cli-awps-creation.md)]

### Get the ConnectionString for future use

[!INCLUDE [Get the connection string](includes/cli-awps-connstr.md)]

Copy the fetched **ConnectionString** and it will be used later in this tutorial as the value of `<connection_string>`.

## Set up the project
### Prerequisites

# [C#](#tab/csharp)

* [.NET Core 2.1 or above](https://dotnet.microsoft.com/download)

# [JavaScript](#tab/javascript)

* [Node.js 12.x or above](https://nodejs.org)

# [Python](#tab/python)
* [Python](https://www.python.org/)

# [Java](#tab/java)
- [Java Development Kit (JDK)](/java/azure/jdk/) version 8 or above
- [Apache Maven](https://maven.apache.org/download.cgi)

---

## Set up the subscriber

Clients connect to the Azure Web PubSub service through the standard WebSocket protocol using [JSON Web Token (JWT)](../active-directory/develop/security-tokens.md#json-web-tokens-and-claims) authentication. The service SDK provides helper methods to generate the token. In this tutorial, the subscriber directly generates the token from *ConnectionString*. In real applications, we usually use a server-side application to handle the authentication/authorization workflow. Try the [Build a chat app](./tutorial-build-chat.md) tutorial to better understand the workflow.

# [C#](#tab/csharp)

1. First let's create a new folder `subscriber` for this project and install required dependencies:
    * The package [Websocket.Client](https://github.com/Marfusios/websocket-client) is a third-party package supporting WebSocket connection. You can use any API/library that supports WebSocket to do so.
    * The SDK package `Azure.Messaging.WebPubSub` helps to generate the JWT token. 

    ```bash
    mkdir subscriber
    cd subscriber
    dotnet new console
    dotnet add package Websocket.Client --version 4.3.30
    dotnet add package Azure.Messaging.WebPubSub --version 1.0.0
    ```

2. Update the `Program.cs` file to connect to the service:

    ```csharp
    using System;
    using System.Threading.Tasks;
    
    using Azure.Messaging.WebPubSub;
    
    using Websocket.Client;
    
    namespace subscriber
    {
        class Program
        {
            static async Task Main(string[] args)
            {
                if (args.Length != 2)
                {
                    Console.WriteLine("Usage: subscriber <connectionString> <hub>");
                    return;
                }
                var connectionString = args[0];
                var hub = args[1];
    
                // Either generate the URL or fetch it from server or fetch a temp one from the portal
                var serviceClient = new WebPubSubServiceClient(connectionString, hub);
                var url = serviceClient.GetClientAccessUri();
    
                using (var client = new WebsocketClient(url))
                {
                    // Disable the auto disconnect and reconnect because the sample would like the client to stay online even no data comes in
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

    The code above creates a WebSocket connection to connect to a hub in Azure Web PubSub. Hub is a logical unit in Azure Web PubSub where you can publish messages to a group of clients. [Key concepts](./key-concepts.md) contains the detailed explanation about the terms used in Azure Web PubSub.
    
    Azure Web PubSub service uses [JSON Web Token (JWT)](../active-directory/develop/security-tokens.md#json-web-tokens-and-claims) authentication, so in the code sample we use `WebPubSubServiceClient.GetClientAccessUri()` in Web PubSub SDK to generate a url to the service that contains the full URL with a valid access token.
    
    After the connection is established, you'll receive messages through the WebSocket connection. So we use `client.MessageReceived.Subscribe(msg => ...));` to listen to incoming messages.

3. Run the below command, replacing `<connection_string>` with the **ConnectionString** fetched in [previous step](#get-the-connectionstring-for-future-use):

    ```bash
    dotnet run "<connection_string>" "myHub1"
    ```

# [JavaScript](#tab/javascript)

1. First let's create a new folder `subscriber` for this project and install required dependencies:

    ```bash
    mkdir subscriber
    cd subscriber
    npm init -y
    npm install --save ws
    npm install --save @azure/web-pubsub

    ```
2. Then use WebSocket API to connect to service. Create a `subscribe.js` file with the below code:

    ```javascript
    const WebSocket = require('ws');
    const { WebPubSubServiceClient } = require('@azure/web-pubsub');

    async function main() {
      const hub = "pubsub";
      let service = new WebPubSubServiceClient(process.env.WebPubSubConnectionString, hub);
      let token = await service.getClientAccessToken();
      let ws = new WebSocket(token.url);
      ws.on('open', () => console.log('connected'));
      ws.on('message', data => console.log('Message received: %s', data));
    }

    main();
    ```
    
    The code above creates a WebSocket connection to connect to a hub in Azure Web PubSub. Hub is a logical unit in Azure Web PubSub where you can publish messages to a group of clients. [Key concepts](./key-concepts.md) contains the detailed explanation about the terms used in Azure Web PubSub.
    
    Azure Web PubSub service uses [JSON Web Token (JWT)](../active-directory/develop/security-tokens.md#json-web-tokens-and-claims) authentication, so in the code sample we use `WebPubSubServiceClient.getClientAccessToken()` in Web PubSub SDK to generate a url to the service that contains the full URL with a valid access token.
    
    After connection is established, you'll receive messages through the WebSocket connection. So we use `WebSocket.on('message', ...)` to listen to incoming messages.
    
3. Run the below command, replacing `<connection_string>` with the **ConnectionString** fetched in [previous step](#get-the-connectionstring-for-future-use):

    ```bash
    export WebPubSubConnectionString="<connection-string>"
    node subscribe
    ```

# [Python](#tab/python)

1. First let's create a new folder `subscriber` for this project and install required dependencies:

    ```bash
    mkdir subscriber
    cd subscriber
    # Create venv
    python -m venv env
    # Activate venv
    source ./env/bin/activate

    pip install azure-messaging-webpubsubservice
    pip install websockets

    ```

2. Then use WebSocket API to connect to service. Create a `subscribe.py` file with the below code:

    ```python
    import asyncio
    import sys
    import websockets
    
    from azure.messaging.webpubsubservice import WebPubSubServiceClient
    
    
    async def connect(url):
        async with websockets.connect(url) as ws:
            print('connected')
            while True:
                print('Received message: ' + await ws.recv())
    
    if __name__ == '__main__':
    
        if len(sys.argv) != 3:
            print('Usage: python subscribe.py <connection-string> <hub-name>')
            exit(1)
    
        connection_string = sys.argv[1]
        hub_name = sys.argv[2]
    
        service = WebPubSubServiceClient.from_connection_string(connection_string, hub=hub_name)
        token = service.get_client_access_token()
    
        try:
            asyncio.get_event_loop().run_until_complete(connect(token['url']))
        except KeyboardInterrupt:
            pass
    
    ```

    The code above creates a WebSocket connection to connect to a hub in Azure Web PubSub. Hub is a logical unit in Azure Web PubSub where you can publish messages to a group of clients. [Key concepts](./key-concepts.md) contains the detailed explanation about the terms used in Azure Web PubSub.
    
    Azure Web PubSub service uses [JSON Web Token (JWT)](../active-directory/develop/security-tokens.md#json-web-tokens-and-claims) authentication, so in the code sample we use `service.get_client_access_token()` provided by the SDK to generate a url to the service that contains the full URL with a valid access token.
    
    After connection is established, you'll receive messages through the WebSocket connection. So we use `await ws.recv()` to listen to incoming messages.

3. Run the below command, replacing `<connection_string>` with the **ConnectionString** fetched in [previous step](#get-the-connectionstring-for-future-use):

    ```bash
    python subscribe.py "<connection_string>" "myHub1"
    ```

# [Java](#tab/java)
1. First let's create a new folder `pubsub` for this tutorial
    ```cmd
    mkdir pubsub
    cd pubsub
    ```

1. Then inside this `pubsub` folder let's use Maven to create a new console app `webpubsub-quickstart-subscriber` and switch into the *webpubsub-quickstart-subscriber* folder:

    ```console
    mvn archetype:generate --define interactiveMode=n --define groupId=com.webpubsub.quickstart --define artifactId=webpubsub-quickstart-subscriber --define archetypeArtifactId=maven-archetype-quickstart --define archetypeVersion=1.4
    cd webpubsub-quickstart-subscriber
    ```

2. Let's add WebSocket and Azure Web PubSub SDK dependency into the `dependencies` node of `pom.xml`:

    * `azure-messaging-webpubsub`: Web PubSub service SDK for Java
    * `Java-WebSocket`: WebSocket client SDK for Java

    ```xml
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-messaging-webpubsub</artifactId>
        <version>1.0.0</version>
    </dependency>

    <dependency>
        <groupId>org.java-websocket</groupId>
        <artifactId>Java-WebSocket</artifactId>
        <version>1.5.1</version>
    </dependency>

    ```

3. In Azure Web PubSub, you can connect to the service and subscribe to messages through WebSocket connections. WebSocket is a full-duplex communication channel so service can push messages to your client in real time. You can use any API/library that supports WebSocket to do so. For this sample, we use package [Java-WebSocket](https://github.com/TooTallNate/Java-WebSocket). Let's navigate to the */src/main/java/com/webpubsub/quickstart* directory, open the *App.java* file in your editor, and replace code with the below:

    ```java
    package com.webpubsub.quickstart;
    
    import com.azure.messaging.webpubsub.*;
    import com.azure.messaging.webpubsub.models.*;
    
    import org.java_websocket.client.WebSocketClient;
    import org.java_websocket.handshake.ServerHandshake;
    
    import java.io.IOException;
    import java.net.URI;
    import java.net.URISyntaxException;
    
    /**
    * Connect to Azure Web PubSub service using WebSocket protocol
    *
    */
    public class App 
    {
        public static void main( String[] args ) throws IOException, URISyntaxException
        {
            if (args.length != 2) {
                System.out.println("Expecting 2 arguments: <connection-string> <hub-name>");
                return;
            }
    
            WebPubSubServiceClient service = new WebPubSubServiceClientBuilder()
                .connectionString(args[0])
                .hub(args[1])
                .buildClient();
    
            WebPubSubClientAccessToken token = service.getClientAccessToken(new GetClientAccessTokenOptions());
    
            WebSocketClient webSocketClient = new WebSocketClient(new URI(token.getUrl())) {
                @Override
                public void onMessage(String message) {
                    System.out.println(String.format("Message received: %s", message));
                }
    
                @Override
                public void onClose(int arg0, String arg1, boolean arg2) {
                    // TODO Auto-generated method stub
                }
    
                @Override
                public void onError(Exception arg0) {
                    // TODO Auto-generated method stub
                }
    
                @Override
                public void onOpen(ServerHandshake arg0) {
                    // TODO Auto-generated method stub
                }
    
            };
    
            webSocketClient.connect();
            System.in.read();
        }
    }

    ```

    The code above creates a WebSocket connection to connect to a hub in Azure Web PubSub. Hub is a logical unit in Azure Web PubSub where you can publish messages to a group of clients. [Key concepts](./key-concepts.md) contains the detailed explanation about the terms used in Azure Web PubSub.
    
    Azure Web PubSub service uses [JSON Web Token (JWT)](../active-directory/develop/security-tokens.md#json-web-tokens-and-claims) authentication, so in the code sample we use `WebPubSubServiceClient.getClientAccessToken(new GetClientAccessTokenOptions())` in Web PubSub SDK to generate a url to the service that contains the full URL with a valid access token.
    
    After connection is established, you'll receive messages through the WebSocket connection. So we use `onMessage(String message)` to listen to incoming messages.

4. Navigate to the directory containing the *pom.xml* file and run the app with below code, replacing `<connection_string>` with the **ConnectionString** fetched in [previous step](#get-the-connectionstring-for-future-use):

    ```console
    mvn compile & mvn package & mvn exec:java -Dexec.mainClass="com.webpubsub.quickstart.App" -Dexec.cleanupDaemonThreads=false -Dexec.args="'<connection_string>' 'myHub1'"
    ```

---

## Publish messages using service SDK

Now let's use Azure Web PubSub SDK to publish a message to the connected client.

# [C#](#tab/csharp)

1. First let's create a new folder `publisher` for this project and install required dependencies:

    ```bash
    mkdir publisher
    cd publisher
    dotnet new console
    dotnet add package Azure.Messaging.WebPubSub
    ```

2. Now let's update the `Program.cs` file to use the `WebPubSubServiceClient` class and send messages to the clients.

    ```csharp
    using System;
    using System.Threading.Tasks;
    using Azure.Messaging.WebPubSub;
    
    namespace publisher
    {
        class Program
        {
            static async Task Main(string[] args)
            {
                if (args.Length != 3) {
                    Console.WriteLine("Usage: publisher <connectionString> <hub> <message>");
                    return;
                }
                var connectionString = args[0];
                var hub = args[1];
                var message = args[2];
                
                // Either generate the token or fetch it from server or fetch a temp one from the portal
                var serviceClient = new WebPubSubServiceClient(connectionString, hub);
                await serviceClient.SendToAllAsync(message);
            }
        }
    }
    
    ```

    The `SendToAllAsync()` call simply sends a message to all connected clients in the hub.

3. Run the below command, replacing `<connection_string>` with the **ConnectionString** fetched in [previous step](#get-the-connectionstring-for-future-use):

    ```bash
    dotnet run "<connection_string>" "myHub1" "Hello World"
    ```

4. You can see that the previous subscriber received the below message:
   
    ```
    Message received: Hello World
    ```

# [JavaScript](#tab/javascript)

1. First let's create a new folder `publisher` for this project and install required dependencies:

    ```bash
    mkdir publisher
    cd publisher
    npm init -y
    npm install --save @azure/web-pubsub

    ```
2. Now let's use Azure Web PubSub SDK to publish a message to the service. Create a `publish.js` file with the below code:

    ```javascript
    const { WebPubSubServiceClient } = require('@azure/web-pubsub');

    const hub = "pubsub";
    let service = new WebPubSubServiceClient(process.env.WebPubSubConnectionString, hub);

    // by default it uses `application/json`, specify contentType as `text/plain` if you want plain-text
    service.sendToAll(process.argv[2], { contentType: "text/plain" });
    ```

    The `service.sendToAll()` call simply sends a message to all connected clients in a hub.

3. Run the below command, replacing `<connection_string>` with the **ConnectionString** fetched in [previous step](#get-the-connectionstring-for-future-use):

    ```bash
    export WebPubSubConnectionString="<connection-string>"
    node publish "Hello World"
    ```

4. You can see that the previous subscriber received the below message:
   
    ```
    Message received: Hello World
    ```

# [Python](#tab/python)

1. First let's create a new folder `publisher` for this project and install required dependencies:
    ```bash
    mkdir publisher
    cd publisher
    # Create venv
    python -m venv env
    # Active venv
    source ./env/bin/activate

    pip install azure-messaging-webpubsubservice

    ```
2. Now let's use Azure Web PubSub SDK to publish a message to the service. Create a `publish.py` file with the below code:

    ```python
    import sys
    from azure.messaging.webpubsubservice import WebPubSubServiceClient
    
    if __name__ == '__main__':
    
        if len(sys.argv) != 4:
            print('Usage: python publish.py <connection-string> <hub-name> <message>')
            exit(1)
    
        connection_string = sys.argv[1]
        hub_name = sys.argv[2]
        message = sys.argv[3]
    
        service = WebPubSubServiceClient.from_connection_string(connection_string, hub=hub_name)
        res = service.send_to_all(message, content_type='text/plain')
        print(res)
    ```

    The `send_to_all()` send the message to all connected clients in a hub.

3. Run the below command, replacing `<connection_string>` with the **ConnectionString** fetched in [previous step](#get-the-connectionstring-for-future-use):

    ```bash
    python publish.py "<connection_string>" "myHub1" "Hello World"
    ```

4. You can see that the previous subscriber received the below message:
   
    ```
    Received message: Hello World
    ```

# [Java](#tab/java)

1.  Let's use another terminal and go back to the `pubsub` folder to create a publisher console app `webpubsub-quickstart-publisher` and switch into the *webpubsub-quickstart-publisher* folder:
    ```console
    mvn archetype:generate --define interactiveMode=n --define groupId=com.webpubsub.quickstart --define artifactId=webpubsub-quickstart-publisher --define archetypeArtifactId=maven-archetype-quickstart --define archetypeVersion=1.4
    cd webpubsub-quickstart-publisher
    ```

2. Let's add Azure Web PubSub SDK dependency into the `dependencies` node of `pom.xml`:

    ```xml
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-messaging-webpubsub</artifactId>
        <version>1.0.0</version>
    </dependency>
    ```

3. Now let's use Azure Web PubSub SDK to publish a message to the service. Let's navigate to the */src/main/java/com/webpubsub/quickstart* directory, open the *App.java* file in your editor, and replace code with the below:

    ```java

    package com.webpubsub.quickstart;
    
    import com.azure.messaging.webpubsub.*;
    import com.azure.messaging.webpubsub.models.*;
    
    /**
    * Publish messages using Azure Web PubSub service SDK
    *
    */
    public class App 
    {
        public static void main( String[] args )
        {
            if (args.length != 3) {
                System.out.println("Expecting 3 arguments: <connection-string> <hub-name> <message>");
                return;
            }
    
            WebPubSubServiceClient service = new WebPubSubServiceClientBuilder()
                .connectionString(args[0])
                .hub(args[1])
                .buildClient();
            service.sendToAll(args[2], WebPubSubContentType.TEXT_PLAIN);
        }
    }

    ```

    The `sendToAll()` call simply sends a message to all connected clients in a hub.

4. Navigate to the directory containing the *pom.xml* file and run the project using the below command, replacing `<connection_string>` with the **ConnectionString** fetched in [previous step](#get-the-connectionstring-for-future-use):

    ```console
    mvn compile & mvn package & mvn exec:java -Dexec.mainClass="com.webpubsub.quickstart.App" -Dexec.cleanupDaemonThreads=false -Dexec.args="'<connection_string>' 'myHub1' 'Hello World'"
    ```

5. You can see that the previous subscriber received the below message:
   
    ```
    Message received: Hello World
    ```

---

## Next steps

This tutorial provides you a basic idea of how to connect to the Web PubSub service and how to publish messages to the connected clients.

Check other tutorials to further dive into how to use the service.

> [!div class="nextstepaction"]
> [Tutorial: Create a chatroom with Azure Web PubSub](./tutorial-build-chat.md)

> [!div class="nextstepaction"]
> [Explore more Azure Web PubSub samples](https://aka.ms/awps/samples)
