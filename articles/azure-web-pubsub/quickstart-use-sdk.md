---
title: Quickstart - Publish messages using the service SDK for the Azure Web PubSub instance
description: Quickstart showing how to use the service SDK
author: vicancy
ms.author: lianwei
ms.service: azure-web-pubsub
ms.topic: quickstart
ms.date: 11/01/2021
ms.custom: mode-api, devx-track-azurecli 
ms.devlang: azurecli
---

# Quickstart: Publish messages using the service SDK for the Azure Web PubSub instance

This quickstart shows you how to publish messages to the clients using service SDK.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment.md)]

- This quickstart requires version 2.22.0 or higher of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Create a resource group

[!INCLUDE [Create a resource group](includes/cli-rg-creation.md)]

## Create a Web PubSub instance

[!INCLUDE [Create a Web PubSub instance](includes/cli-awps-creation.md)]

## Get the ConnectionString for future use

[!INCLUDE [Get the connection string](includes/cli-awps-connstr.md)]

Copy the fetched **ConnectionString** and it will be used later when using service SDK as the value of `<connection_string>`.

## Connect to the instance

[!INCLUDE [az webpubsub client](includes/cli-awps-client-connect.md)]

## Publish messages using service SDK

Now let's use Azure Web PubSub SDK to publish a message to the connected client.

### Prerequisites

# [C#](#tab/csharp)

* [.NET Core 2.1 or above](https://dotnet.microsoft.com/download)

# [JavaScript](#tab/javascript)

* [Node.js 12.x or above](https://nodejs.org)

# [Python](#tab/python)
* [Python](https://www.python.org/)

# [Java](#tab/java)
- [Java Development Kit (JDK)](/java/azure/jdk/) version 8 or above.
- [Apache Maven](https://maven.apache.org/download.cgi).

---

### Set up the project to publish messages

# [C#](#tab/csharp)

1. Add a new project `publisher` and add the SDK package `package Azure.Messaging.WebPubSub`.

    ```bash
    mkdir publisher
    cd publisher
    dotnet new console
    dotnet add package Azure.Messaging.WebPubSub
    ```

2. Update the `Program.cs` file to use the `WebPubSubServiceClient` class and send messages to the clients.

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

                var service = new WebPubSubServiceClient(connectionString, hub);
                
                // Send messages to all the connected clients
                // You can also try SendToConnectionAsync to send messages to the specific connection
                await service.SendToAllAsync(message);
            }
        }
    }
    ```

    The `service.SendToAllAsync()` call simply sends a message to all connected clients in the hub.

3. Run the below command, replacing `<connection_string>` with the **ConnectionString** fetched in [previous step](#get-the-connectionstring-for-future-use):

    ```bash
    dotnet run "<connection_string>" "myHub1" "Hello World"
    ```

4. You can see that the previous CLI client received the message.
   
    ```json
    {"type":"message","from":"server","dataType":"text","data":"Hello World"}
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

    if (process.argv.length !== 3) {
      console.log('Usage: node publish <message>');
      return 1;
    }
    const hub = "myHub1";
    let service = new WebPubSubServiceClient(process.env.WebPubSubConnectionString, hub);
    // by default it uses `application/json`, specify contentType as `text/plain` if you want plain-text
    service.sendToAll(process.argv[2], { contentType: "text/plain" });
    ```

    The `sendToAll()` call simply sends a message to all connected clients in a hub.

3. Run the below command, replacing `<connection_string>` with the **ConnectionString** fetched in [previous step](#get-the-connectionstring-for-future-use):

    ```bash
    export WebPubSubConnectionString="<connection-string>"
    node publish "Hello World"
    ```

4. You can see that the previous CLI client received the message.
   
    ```json
    {"type":"message","from":"server","dataType":"text","data":"Hello World"}
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

    The `service.send_to_all()` method sends the message to all connected clients in a hub.

3. Run the below command, replacing `<connection_string>` with the **ConnectionString** fetched in [previous step](#get-the-connectionstring-for-future-use):

    ```bash
    python publish.py "<connection_string>" "myHub1" "Hello World"
    ```

4. You can see that the previous CLI client received the message.
   
    ```json
    {"type":"message","from":"server","dataType":"text","data":"Hello World"}
    ```

# [Java](#tab/java)

1. First let's use Maven to create a new console app `webpubsub-quickstart-publisher` and switch into the *webpubsub-quickstart-publisher* folder:
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

3. Now let's use Azure Web PubSub SDK to publish a message to the service. Let's navigate to the */src/main/java/com/webpubsub/quickstart* directory, open the *App.java* file in your editor and replace code with the below:

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

    The `service.sendToAll()` call simply sends a message to all connected clients in a hub.

4. Navigate to the directory containing the *pom.xml* file and compile the project by using the following `mvn` command.

    ```console
    mvn compile
    ```
5. Then build the package

    ```console
    mvn package
    ```
6. Run the following `mvn` command to execute the app, replacing `<connection_string>` with the **ConnectionString** fetched in [previous step](#get-the-connectionstring-for-future-use):

    ```console
    mvn exec:java -Dexec.mainClass="com.webpubsub.quickstart.App" -Dexec.cleanupDaemonThreads=false -Dexec.args="'<connection_string>' 'myHub1' 'Hello World'"
    ```

7. You can see that the previous CLI client received the message.
   
    ```json
    {"type":"message","from":"server","dataType":"text","data":"Hello World"}
    ```

---

## Next steps

This quickstart provides you a basic idea of how to connect to the Web PubSub service and how to publish messages to the connected clients.

In real-world applications, you can use SDKs in various languages build your own application. We also provide Function extensions for you to build serverless applications easily.

[!INCLUDE [next step](includes/include-next-step.md)]
