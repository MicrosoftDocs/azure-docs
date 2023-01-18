---
title: Quickstart - Publish messages using Azure Web PubSub service SDK
description: Quickstart showing how to use the Azure Web PubSub service SDK
author: vicancy
ms.author: lianwei
ms.service: azure-web-pubsub
ms.topic: quickstart
ms.date: 01/17/2023
ms.custom: mode-api, devx-track-azurecli 
ms.devlang: azurecli
---

# Quickstart: Publish messages using the Azure Web PubSub service SDK

Azure Web PubSub helps you manage WebSocket clients. This quickstart shows you how to publish messages to the WebSocket clients using Azure Web PubSub service SDK.


## Prerequisites

- An Azure subscription, if you don't have one, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Either a Bash or PowerShell command shell.
- A file editor such as VSCode.
- Azure CLI [install the Azure CLI](/cli/azure/install-azure-cli)


## Setup

To sign in to Azure from the CLI, run the following command and follow the prompts to complete the authentication process.

```azurecli
az login
```

Ensure you're running the latest version of the CLI via the upgrade command.

```azurecli
az upgrade
```

Next, install or update the Azure Web PubSub extension for the CLI.

```azurecli
az extension add --name webpubsub --upgrade
```

Set the following environment variables.  Replace the \<placeholder\> with a unique Web PubSub name. 

# [Bash](#tab/bash)

```azurecli
RESOURCE_GROUP="my-container-apps"
LOCATION="canadacentral"
WEB_PUBSUB_NAME=<your-unique-name>
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
$ResourceGroupName = 'webpubsub-resource-group'
$Location = 'EastUS'
$WebPubSubName = <YourUniqueName>
```

---

Create a resource group for the Web PubSub project.

# [Bash](#tab/bash)

```azurecli
az group create \
  --name $RESOURCE_GROUP \
  --location $LOCATION
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
az group create -Location $Location -Name $ResourceGroupName
```

---

## Create and start a Web PubSub service instance

Use the Azure CLI [az webpubsub create](/cli/azure/webpubsub#az-webpubsub-create) command to create and start the Web PubSub service.

# [Bash](#tab/bash)

```azurecli
az webpubsub create --name $WEB_PUBSUB_NAME --resource-group $RESOURCE_GROUP --location LOCATION --sku Free_F1
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
az webpubsub create --name $WebPubSubName -Location $Location --resource-group $ResourceGroupName -sku Free_F1
```

---

Save the service's connection string.  The connection string is used by the service SDK to publish messages.

>[!IMPORTANT]
> In a production environment, you should securely store connection strings using Azure Key Vault.

# [Bash](#tab/bash)

```azurecli
$connection_string=(az webpubsub key show --name $WEB_PUBSUB_NAME --resource-group $RESOURCE_GROUP --query primaryConnectionString)
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
$connection_string = (az webpubsub key show --name $WebPubSubName --resource-group $ResourceGroupName --query primaryConnectionString)
```

---

## Connect a client to the instance

Create a Web PubSub client. The client maintains a connection to the service until it's terminated.

Use the `az webpubsub client` command to start a WebSocket client connection to the service. The client will provide a hub that is used for groups of client connections.

# [Bash](#tab/bash)

```azurecli
az webpubsub client start \
  --name $WEB_PUBSUB_NAME \
  --resource-group $RESOURCE_GROUP \
  --hub-name "myHub1" \
  --user-id "user1"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
az webpubsub client start `
  --name $WebPubSubName `
  --resource-group $ResourceGroupName `
  --hub-name "myHub1" `
  --user-id "user1"
```

---

The connection to the Web PubSub service is established when you see a JSON message indicating that the client is now successfully connected, and is assigned with a unique `connectionId`:

```json
{"type":"system","event":"connected","userId":"user1","connectionId":"<your_unique_connection_id>"}
```

## Publish messages using service SDK

You'll use the Azure Web PubSub SDK to publish a message to all connected clients.

### Set up the project to publish messages

Start by opening another command shell.
Select the language for your project.  The dependencies for each language are installed in the steps for that language.

# [C#](#tab/csharp)

1. Add a new project `publisher` and the SDK package `Azure.Messaging.WebPubSub`.

    ```bash
    mkdir publisher
    cd publisher
    dotnet new console
    dotnet add package Azure.Messaging.WebPubSub
    ```

1. Update the `Program.cs` file to use the `WebPubSubServiceClient` class and send messages to the clients.  Replace the code in the `Program.cs` file with the following code.

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

1. Run the following command to publish a message to the service.

    ```bash
    dotnet run $connection_string "myHub1" "Hello World"
    ```

1. The previous command shell shows the received message.

    ```json
    {"type":"message","from":"server","dataType":"text","data":"Hello World"}
    ```

# [JavaScript](#tab/javascript)

1. Create a new folder `publisher` for this project and install required dependencies:

    ```bash
    mkdir publisher
    cd publisher
    npm init -y
    npm install --save @azure/web-pubsub
    ```

1. Use Azure Web PubSub SDK to publish a message to the service. Create a `publish.js` file containing the code:

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

1. Run the following command to publish a message to the service:

    ```bash
    export WebPubSubConnectionString=$connection-string
    node publish "Hello World"
    ```

1. The previous command shell shows the received message.

    ```json
    {"type":"message","from":"server","dataType":"text","data":"Hello World"}
    ```

# [Python](#tab/python)

1. Create a new folder `publisher` for this project and install required dependencies:

    ```bash
    mkdir publisher
    cd publisher
    # Create venv
    python -m venv env
    # Active venv
    source ./env/bin/activate
    pip install azure-messaging-webpubsubservice
    ```

1. Use Azure Web PubSub SDK to publish a message to the service. Create a `publish.py` file with the below code:

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

1. Run the following command to publish a message to the service:

    ```bash
    python publish.py $connection_string "myHub1" "Hello World"
    ```

1. The previous command shell shows the received message.

    ```json
    {"type":"message","from":"server","dataType":"text","data":"Hello World"}
    ```

# [Java](#tab/java)

1. Use Maven to create a new console app `webpubsub-quickstart-publisher` and change to the *webpubsub-quickstart-publisher* directory:

    ```console
    mvn archetype:generate --define interactiveMode=n --define groupId=com.webpubsub.quickstart --define artifactId=webpubsub-quickstart-publisher --define archetypeArtifactId=maven-archetype-quickstart --define archetypeVersion=1.4
    cd webpubsub-quickstart-publisher
    ```

1. Add Azure Web PubSub SDK to the `dependencies` node of `pom.xml`:

    ```xml
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-messaging-webpubsub</artifactId>
        <version>1.0.0</version>
    </dependency>
    ```

1. Use Azure Web PubSub SDK to publish a message to the service. Navigate to the */src/main/java/com/webpubsub/quickstart* directory.  Replace the contents in the *App.java* file with the following code:

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

1. Go to the directory containing the *pom.xml* file and compile the project by using the following `mvn` command.

    ```console
    mvn compile
    ```

1. Build the package.

    ```console
    mvn package
    ```

1. Run the following `mvn` command to execute the app to publish a message to the service:

    ```console
    mvn exec:java -Dexec.mainClass="com.webpubsub.quickstart.App" -Dexec.cleanupDaemonThreads=false -Dexec.args="$connection_string 'myHub1' 'Hello World'"
    ```

1. The previous command shell shows the received message.

    ```json
    {"type":"message","from":"server","dataType":"text","data":"Hello World"}
    ```

---

## Cleanup

You can delete the resources that you created in this quickstart by deleting the resource group that contains them.

```azurecli
az group delete --name $RESOURCE_GROUP --yes
```

```azurepowershell
az group delete --name $ResourceGroup --yes
```

## Next steps

This quickstart provides you a basic idea of how to connect to the Web PubSub service and how to publish messages to the connected clients.

In real-world applications, you can use SDKs in various languages build your own application. We also provide Function extensions for you to build serverless applications easily.

[!INCLUDE [next step](includes/include-next-step.md)]
