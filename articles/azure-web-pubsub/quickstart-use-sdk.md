---
title: Quickstart - Publish messages using the service SDK for the Azure Web PubSub instance
description: Quickstart showing how to use the service SDK
ms.author: lianwei
ms.service: azure-web-pubsub
ms.topic: quickstart
ms.date: 08/06/2021
---

# Quickstart: Publish messages using the service SDK for the Azure Web PubSub instance

This quickstart shows you how to connect to the Azure Web PubSub using the WebSocket APIs. It also shows you the ability to publish messages to these clients using service SDK.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment.md)]

- This quickstart requires version 2.22.0 or higher of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Create a resource group

[!INCLUDE [Create a resource group](includes/cli-rg-creation.md)]

## Create a Web PubSub instance

[!INCLUDE [Create a Web PubSub instance](includes/cli-awps-creation.md)]

## Connect to the instance

[!INCLUDE [az webpubsub client](includes/cli-awps-client-connect.md)]

## Publish messages using service SDK

Now let's use Azure Web PubSub SDK to publish a message to the connected client.

### Prerequisites

# [C#](#tab/csharp)

1. [.NET Core 2.1 or above](https://dotnet.microsoft.com/download)

# [JavaScript](#tab/javascript)

1. [Node.js](https://nodejs.org)

---

### Using the service SDK

# [C#](#tab/csharp)

1. Add a new project `publisher` and add the SDK package `package Azure.Messaging.WebPubSub`.

    ```bash
    mkdir publisher
    cd publisher
    dotnet new console
    dotnet add package Azure.Messaging.WebPubSub --prerelease
    ```

2. Update the `Program.cs` file to use the `WebPubSubServiceClient` class and send messages to the clients.

    ```csharp
    using System;
    using Azure.Messaging.WebPubSub;
    
    namespace publisher
    {
        class Program
        {
            static void Main(string[] args)
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
                serviceClient.SendToAll(message);
            }
        }
    }
    
    ```

    The `sendToAll()` call simply sends a message to all connected clients in a hub. Save the code above and run `dotnet run "<connection-string>" <hub-name> <message>` with the same connection string and hub name you used in subscriber, you'll see the message printed out in the subscriber.

3. Run the project and input any messages to send to the clients.

    ```bash
    dotnet run "<connection_string>" hub1 "Hello World"
    ```

4. You can see that the previous CLI client received the message.
   
    ```json
    {"type":"message","from":"server","dataType":"text","data":"Hello World"}
    ```

# [JavaScript](#tab/javascript)

1. First install required dependencies:

    ```bash
    npm init -y
    npm install --save ws
    npm install --save @azure/web-pubsub

    ```
2. Now let's use Azure Web PubSub SDK to publish a message to the service:

```javascript
const { WebPubSubServiceClient } = require('@azure/web-pubsub');

if (process.argv.length !== 5) {
  console.log('Usage: node publish <connection-string> <hub-name> <message>');
  return 1;
}

let serviceClient = new WebPubSubServiceClient(process.argv[2], process.argv[3]);

// by default it uses `application/json`, specify contentType as `text/plain` if you want plain-text
serviceClient.sendToAll(process.argv[4], { contentType: "text/plain" });
```

The `sendToAll()` call simply sends a message to all connected clients in a hub. Save the code above as `publish.js`.

3. Run the project and input any messages to send to the clients.
    ```bash
    node publish "<connection_string>" hub1 "Hello World"
    ```

4. You can see that the previous CLI client received the message.
   
    ```json    
    {"type":"message","from":"server","dataType":"text","data":"Hello World"}
    ```

---

## Next steps

This quickstart provides you a basic idea of how to connect to the Web PubSub service and how to publish messages to the connected clients.

[!INCLUDE [next step](includes/include-next-step.md)]
