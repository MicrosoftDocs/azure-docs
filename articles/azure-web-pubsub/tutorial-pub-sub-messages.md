---
title: Tutorial - Publish and subscribe messages using WebSocket API and Azure Web PubSub service SDK
description: A tutorial to walk through how to use Azure Web PubSub service and Azure Functions to build a serverless application.
author: vicancy
ms.author: lianwei
ms.service: azure-web-pubsub
ms.custom: devx-track-azurecli
ms.topic: tutorial 
ms.date: 03/09/2023
---

# Tutorial: Publish and subscribe messages using WebSocket API and Azure Web PubSub service SDK

The Azure Web PubSub service helps you to easily build real-time web messaging applications. In this tutorial, you'll learn how to subscribe to the service using WebSocket API and publish messages using the Web PubSub service SDK.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a Web PubSub service instance
> * Generate the full URL to establish the WebSocket connection
> * Create a Web PubSub subscriber client to receive messages using standard WebSocket protocol
> * Create a Web PubSub publisher client to publish messages using Web PubSub service SDK

[!INCLUDE [azure-web-pubsub-tutorial-prerequisites](includes/cli-awps-prerequisites.md)]

You can use the Windows cmd.exe command shell instead of a Bash shell to run the commands in this tutorial.

If creating the project on a local machine, you'll need to install the dependencies for the language you're using:

# [C#](#tab/csharp)

[.NET Core](https://dotnet.microsoft.com/download)

# [JavaScript](#tab/javascript)

[Node.js](https://nodejs.org)

# [Python](#tab/python)

[Python](https://www.python.org/)

# [Java](#tab/java)

* [Java Development Kit (JDK)](/java/openjdk/install/).
* [Apache Maven](https://maven.apache.org/download.cgi)

---

## Prepare your environment

# [Local Azure CLI](#tab/LocalBash)

[!INCLUDE [azure-web-pubsub-az-cli-setup](includes/cli-awps-setup.md)]

# [Azure Cloud Shell ](#tab/Cloud)

[![Launch Cloud Shell in a new window](../../includes/media/cloud-shell-try-it/hdi-launch-cloud-shell.png)](https://shell.azure.com)

---

## Create a resource group

[!INCLUDE [Create a resource group](includes/cli-rg-creation.md)]

---

## 1. Create an Azure Web PubSub instance


### Create a Web PubSub instance

Use the Azure CLI [az webpubsub create](/cli/azure/webpubsub#az-webpubsub-create) command to create a Web PubSub in the resource group you've created. The following command creates a _Free_ Web PubSub resource under resource group `myResourceGroup` in `EastUS`:

Each Web PubSub resource must have a unique name. Replace &lt;your-unique-resource-name&gt; with the name of your Web PubSub instance in the following command.

```azurecli
az webpubsub create --resource-group myResourceGroup --name <your-unique-resource-name> --location EastUS --sku Free_F1
```

The output of this command shows properties of the newly created resource. Take note of the two properties listed below:

* **name**: The Web PubSub name you provided in the `--name` parameter above.
* **hostName**: In the example, the host name is `<your-unique-resource-name>.webpubsub.azure.com/`.

At this point, your Azure account is the only one authorized to perform any operations on this new resource.

### Get the connection string

[!INCLUDE [Get the connection string](includes/cli-awps-connstr.md)]

## Create a subscriber client

Clients connect to the Azure Web PubSub service through the standard WebSocket protocol using [JSON Web Token (JWT)](../active-directory/develop/security-tokens.md#json-web-tokens-and-claims) authentication. The service SDK provides helper methods to generate the token. In this tutorial, the subscriber directly generates the token from *ConnectionString*. In real applications, a server-side application usually handles the authentication/authorization workflow. To better understand the workflow, see the tutorial [Build a chat app](./tutorial-build-chat.md).

# [C#](#tab/csharp)

1. First, create a project directory named `subscriber` for this project and install required dependencies:

    * The package [Websocket.Client](https://github.com/Marfusios/websocket-client) is a third-party package supporting WebSocket connections. You can use any API/library that supports WebSocket.
    * The SDK package `Azure.Messaging.WebPubSub` helps to generate the JWT token. 

    ```bash
    mkdir subscriber
    cd subscriber
    dotnet new console
    dotnet add package Websocket.Client --version 4.3.30
    dotnet add package Azure.Messaging.WebPubSub --version 1.0.0
    ```

1. Replace the code in the `Program.cs` with the following code that will connect to the service:

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

    The code creates a WebSocket connection that is connected to a hub in Web PubSub. A hub is a logical unit in Web PubSub where you can publish messages to a group of clients. [Key concepts](./key-concepts.md) contains the detailed explanation about the terms used in Web PubSub.

    The Web PubSub service uses [JSON Web Token (JWT)](../active-directory/develop/security-tokens.md#json-web-tokens-and-claims) authentication. The sample code uses `WebPubSubServiceClient.GetClientAccessUri()` in Web PubSub SDK to generate a URL to the service that contains the full URL with a valid access token.

     After the connection is established, your client receives messages through the WebSocket connection. The client uses `client.MessageReceived.Subscribe(msg => ...));` to listen for incoming messages.

1. To start the subscriber, run the following command replacing `<Web-PubSub-connection-string>` with the connection string you copied earlier:

    ```bash
    dotnet run <Web-PubSub-connection-string> "myHub1"
    ```

# [JavaScript](#tab/javascript)

1. First, create a project directory named `subscriber` and install required dependencies:

    ```bash
    mkdir subscriber
    cd subscriber
    npm init -y
    npm install --save ws
    npm install --save @azure/web-pubsub

    ```

1. Use the WebSocket API to connect to the Web PubSub service. Create a `subscribe.js` file with the following code:

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

    The code creates a WebSocket connection that is connected to a hub in Web PubSub. A hub is a logical unit in Web PubSub where you can publish messages to a group of clients. [Key concepts](./key-concepts.md) contains the detailed explanation about the terms used in Web PubSub.

    The Web PubSub service uses [JSON Web Token (JWT)](../active-directory/develop/security-tokens.md#json-web-tokens-and-claims) authentication. The sample code uses `WebPubSubServiceClient.GetClientAccessUri()` in Web PubSub SDK to generate a URL to the service that contains the full URL with a valid access token.

     After the connection is established, your client receives messages through the WebSocket connection. The client uses `client.MessageReceived.Subscribe(msg => ...));` to listen for incoming messages.

1. Run the following command replacing `<Web-PubSub-connection-string>` with the connection string you copied earlier. If you are using Windows command shell, you can use `set` instead of `export`.

    ```bash
    export WebPubSubConnectionString=<Web-PubSub-connection-string>
    node subscribe.js
    ```

# [Python](#tab/python)

1. First, create a project directory named `subscriber` and install required dependencies:

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

1. Use the WebSocket API to connect to the Web PubSub service. Create a `subscribe.py` file with the following code:

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

    The code creates a WebSocket connection that is connected to a hub in Web PubSub. A hub is a logical unit in Web PubSub where you can publish messages to a group of clients. [Key concepts](./key-concepts.md) contains the detailed explanation about the terms used in Web PubSub.

    The Web PubSub service uses [JSON Web Token (JWT)](../active-directory/develop/security-tokens.md#json-web-tokens-and-claims) authentication. The sample code uses `WebPubSubServiceClient.GetClientAccessUri()` in Web PubSub SDK to generate a URL to the service that contains the full URL with a valid access token.

    After the connection is established, your client will receive messages through the WebSocket connection. Use `await ws.recv()` to listen for incoming messages.

1. Run the following command replacing `<Web-PubSub-connection-string>` with the connection string you copied earlier:

    ```bash
    python subscribe.py <Web-PubSub-connection-string> "myHub1"
    ```

# [Java](#tab/java)

1. First, create a project directory named `pubsub` for this tutorial.

    ```cmd
    mkdir pubsub
    cd pubsub
    ```

1. Inside the `pubsub` directory, use Maven to create a new console app called `webpubsub-quickstart-subscriber`, then go to the *webpubsub-quickstart-subscriber* directory:

    ```bash
    mvn archetype:generate --define interactiveMode=n --define groupId=com.webpubsub.quickstart --define artifactId=webpubsub-quickstart-subscriber --define archetypeArtifactId=maven-archetype-quickstart --define archetypeVersion=1.4
    cd webpubsub-quickstart-subscriber
    ```

1. Add WebSocket and Azure Web PubSub SDK to the `dependencies` node in `pom.xml`:

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

    In Web PubSub, you can connect to the service and subscribe to messages through WebSocket connections. WebSocket is a full-duplex communication channel allowing the service to push messages to your client in real time. You can use any API or library that supports WebSocket. For this sample, we use package [Java-WebSocket](https://github.com/TooTallNate/Java-WebSocket). 

1. Go to the */src/main/java/com/webpubsub/quickstart* directory.
1. Edit replace the contents of the *App.java* file with the following code:

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

    This code creates a WebSocket connection that is connected to a hub in Azure Web PubSub. A hub is a logical unit in Azure Web PubSub where you can publish messages to a group of clients. [Key concepts](./key-concepts.md) contains the detailed explanation about the terms used in Azure Web PubSub.

    The Web PubSub service uses [JSON Web Token (JWT)](../active-directory/develop/security-tokens.md#json-web-tokens-and-claims) authentication. The sample code uses `WebPubSubServiceClient.GetClientAccessUri()` in Web PubSub SDK to generate a URL to the service that contains the full URL with a valid access token.

    After connection is established, your client will receive messages through the WebSocket connection. Use `onMessage(String message)` to listen for incoming messages.

1.  To start the subscriber app, go to the *webpubsub-quickstart-subscriber* directory and run the  following command. Replace `<Web-PubSub-connection-string>` with the connection string you copied earlier.

    ```bash
    mvn compile & mvn package & mvn exec:java -Dexec.mainClass="com.webpubsub.quickstart.App" -Dexec.cleanupDaemonThreads=false -Dexec.args="<Web-PubSub-connection-string> 'myHub1'"
    ```

---

## 2. Publish messages using service SDK

Create a publisher using the Azure Web PubSub SDK to publish a message to the connected client.  For this project, you'll need to open another command shell.

# [C#](#tab/csharp)

1. First, create a project directory named `publisher` and install required dependencies:

    ```bash
    mkdir publisher
    cd publisher
    dotnet new console
    dotnet add package Azure.Messaging.WebPubSub
    ```

1. Update the `Program.cs` file to use the `WebPubSubServiceClient` class and send messages to the clients.

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

1. Send a message by running the following command. Replace `<Web-PubSub-connection-string>` with the connection string you copied earlier.

    ```bash
    dotnet run <Web-PubSub-connection-string> "myHub1" "Hello World"
    ```

1. Check the command shell of the subscriber to see that it received the message:

    ```console
    Message received: Hello World
    ```

# [JavaScript](#tab/javascript)

1. First, create a project directory named `publisher` and install required dependencies:

    ```bash
    mkdir publisher
    cd publisher
    npm init -y
    npm install --save @azure/web-pubsub

    ```

1. Use Azure Web PubSub SDK to publish a message to the service. Create a `publish.js` file with the below code:

    ```javascript
    const { WebPubSubServiceClient } = require('@azure/web-pubsub');

    const hub = "pubsub";
    let service = new WebPubSubServiceClient(process.env.WebPubSubConnectionString, hub);

    // by default it uses `application/json`, specify contentType as `text/plain` if you want plain-text
    service.sendToAll(process.argv[2], { contentType: "text/plain" });
    ```

    The `service.sendToAll()` call simply sends a message to all connected clients in a hub.

1. To send a message, run the following command replacing `<Web-PubSub-connection-string>` with the connection string you copied earlier. If you are using Windows command shell, you can use `set` instead of `export`.

    ```bash
    export WebPubSubConnectionString=<Web-PubSub-connection-string>
    node publish "Hello World"
    ```

1. You can see that the subscriber received the message:

    ```console
    Message received: Hello World
    ```

# [Python](#tab/python)

1. First, create a project directory named `publisher` and install required dependencies:

    ```bash
    mkdir publisher
    cd publisher
    # Create venv
    python -m venv env
    # Active venv
    source ./env/bin/activate

    pip install azure-messaging-webpubsubservice

    ```

1. Use the Azure Web PubSub SDK to publish a message to the service. Create a `publish.py` file with the below code:

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

1. To send a message, run the following command replacing `<Web-PubSub-connection-string>` with the connection string you copied earlier.

    ```bash
    python publish.py <Web-PubSub-connection-string> "myHub1" "Hello World"
    ```

1. Check the previous command shell to that the subscriber received the message:

    ```console
    Received message: Hello World
    ```

# [Java](#tab/java)

1. Go to the `pubsub` directory.  Use Maven to create a publisher console app `webpubsub-quickstart-publisher` and go to the *webpubsub-quickstart-publisher* directory:

    ```bash
    mvn archetype:generate --define interactiveMode=n --define groupId=com.webpubsub.quickstart --define artifactId=webpubsub-quickstart-publisher --define archetypeArtifactId=maven-archetype-quickstart --define archetypeVersion=1.4
    cd webpubsub-quickstart-publisher
    ```

1. Add the Azure Web PubSub SDK dependency into the `dependencies` node of `pom.xml`:

    ```xml
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-messaging-webpubsub</artifactId>
        <version>1.0.0</version>
    </dependency>
    ```

1. Use the Azure Web PubSub SDK to publish a message to the service. Go to the */src/main/java/com/webpubsub/quickstart* directory, open the *App.java* file in your editor, and replace the contents with the following code:

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

    The `sendToAll()` call sends a message to all connected clients in a hub.

1. To send a message, go to the *webpubsub-quickstart-publisher* directory and run the project using the following command.  Replace the  `<Web-PubSub-connection-string>` with the connection string you copied earlier.

    ```bash
    mvn compile & mvn package & mvn exec:java -Dexec.mainClass="com.webpubsub.quickstart.App" -Dexec.cleanupDaemonThreads=false -Dexec.args="<Web-PubSub-connection-string> 'myHub1' 'Hello World'"
    ```

1. You can see that the subscriber received the message:

    ```console
    Message received: Hello World
    ```

---

## Cleanup

You can delete the resources that you created in this quickstart by deleting the resource group that contains them.

```azurecli
az group delete --name myResourceGroup --yes
```

If you aren't planning to continue using Azure Cloud Shell, you can avoid accumulating costs by deleting the resource group that contains the associated the storage account. The resource group is named `cloud-shell-storage-<your-region>`.  Run the following command, replacing `<CloudShellResourceGroup>` with the Cloud Shell group name.


```azurecli
az group delete --name <CloudShellResourceGroup> --yes

```

>[!CAUTION]
> Deleting resource groups will delete all resources, including resources created outside the scope of this tutorial.

## Next steps

This tutorial provides you with a basic idea of how to connect to the Web PubSub service and publish messages to the connected clients.

Check other tutorials to dive further into how to use the service.

> [!div class="nextstepaction"]
> [Tutorial: Create a chatroom with Azure Web PubSub](./tutorial-build-chat.md)

> [!div class="nextstepaction"]
> [Explore more Azure Web PubSub samples](https://aka.ms/awps/samples)
