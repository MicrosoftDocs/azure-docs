---
title: Azure SignalR Service serverless quickstart - JavaScript
description: A quickstart for using Azure SignalR Service and Azure Functions to create an App showing GitHub star count using JavaScript.
author: vicancy
ms.author: lianwei
ms.date: 04/19/2023
ms.topic: quickstart
ms.service: signalr
ms.devlang: javascript
ms.custom: devx-track-js, mode-api
---
# Quickstart: Create a serverless app with Azure Functions and SignalR Service using JavaScript

 In this article, you use Azure SignalR Service, Azure Functions, and JavaScript to build a serverless application to broadcast messages to clients.

## Prerequisites

This quickstart can be run on macOS, Windows, or Linux.

| Prerequisite | Description |
| --- | --- |
| An Azure subscription |If you don't have a subscription, create an [Azure free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)|
| A code editor | You need a code editor such as [Visual Studio Code](https://code.visualstudio.com/). |
| [Azure Functions Core Tools](https://github.com/Azure/azure-functions-core-tools#installing)| Requires version 4.0.5611 or higher to run Node.js v4 programming model.|
|[Node.js LTS](https://nodejs.org/en/download/)| See supported node.js versions in the [Azure Functions JavaScript developer guide](../azure-functions/functions-reference-node.md#node-version).|
| [Azurite](../storage/common/storage-use-azurite.md)| SignalR binding needs Azure Storage. You can use a local storage emulator when a function is running locally. |
| [Azure CLI](/cli/azure/install-azure-cli)| Optionally, you can use the Azure CLI to create an Azure SignalR Service instance. 

## Create an Azure SignalR Service instance

[!INCLUDE [Create instance](includes/signalr-quickstart-create-instance.md)]

## Setup function project

Make sure you have Azure Functions Core Tools installed.

1. Open a command line.
1. Create project directory and then change into it. 
1. Run the Azure Functions `func init` command to initialize a new project.

  ```bash
  func init --worker-runtime javascript --language javascript --model V4
  ```
  
## Create the project functions

After you initialize a project, you need to create functions. This project requires three functions: 

- `index`: Hosts a web page for a client.
- `negotiate`: Allows a client to get an access token.
- `broadcast`: Uses a time trigger to periodically broadcast messages to all clients.

When you run the `func new` command from the root directory of the project, the Azure Functions Core Tools creates the function source files storing them in a folder with the function name.  You edit the files as necessary replacing the default code with the app code.

### Create the index function

1. Run the following command to create the `index` function.

    ```bash
    func new -n index -t HttpTrigger
    ```

1. Edit *src/functions/httpTrigger.js* and replace the contents with the following json code:

    :::code language="javascript" source="~/azuresignalr-samples/samples/QuickStartServerless/javascript/v4-programming-model/src/functions/index.js":::


### Create the negotiate function

1. Run the following command to create the `negotiate` function.

    ```bash
    func new -n negotiate -t HttpTrigger
    ```

1. Edit *src/functions/negotiate.js* and replace the contents with the following json code:

    :::code language="javascript" source="~/azuresignalr-samples/samples/QuickStartServerless/javascript/v4-programming-model/src/functions/negotiate.js":::

### Create a broadcast function.

1. Run the following command to create the `broadcast` function.

    ```bash
    func new -n broadcast -t TimerTrigger
    ```

1. Edit *src/functions/broadcast.js* and replace the contents with the following code:
  
    :::code language="javascript" source="~/azuresignalr-samples/samples/QuickStartServerless/javascript/v4-programming-model/src/functions/broadcast.js":::

### Create the index.html file

The client interface for this app is a web page. The `index` function reads HTML content from the *content/index.html* file.

1. Create a folder called `content` in your project root folder.
1. Create the file *content/index.html*.
1. Copy the following content to the *content/index.html* file and save it:

    :::code language="html" source="~/azuresignalr-samples/samples/QuickStartServerless/javascript/v4-programming-model/src/content/index.html":::

### Setup Azure Storage

Azure Functions requires a storage account to work. Choose either of the two following options:

* Run the free [Azure Storage Emulator](../storage/common/storage-use-azurite.md).
* Use the Azure Storage service. This may incur costs if you continue to use it.

#### [Local emulation](#tab/storage-azurite) 

1. Start the Azurite storage emulator:

    ```bash
    azurite -l azurite -d azurite\debug.log
    ```

1. Make sure the `AzureWebJobsStorage` in *local.settings.json* set to `UseDevelopmentStorage=true`.

#### [Azure Blob Storage](#tab/azure-blob-storage) 

Update the project to use the Azure Blob Storage connection string.

```bash
func settings add AzureWebJobsStorage "<storage-connection-string>"
```

---

### Add the SignalR Service connection string to the function app settings

You're almost done now. The last step is to set the SignalR Service connection string in Azure Function app settings.

1. In the Azure portal, go to the SignalR instance you deployed earlier.
1. Select **Keys** to view the connection strings for the SignalR Service instance.

    :::image type="content" source="media/signalr-quickstart-azure-functions-javascript/signalr-quickstart-keys.png" alt-text="Screenshot of Azure SignalR service Keys page.":::

1. Copy the primary connection string, and execute the command:

    ```bash
    func settings add AzureSignalRConnectionString "<signalr-connection-string>"
    ```
  
### Run the Azure Function app locally

Run the Azure Function app in the local environment:

  ```bash
  func start
  ```

After the Azure Function is running locally, go to `http://localhost:7071/api/index`. The page displays the current star count for the GitHub Azure/azure-signalr repository. When you star or unstar the repository in GitHub, you'll see the refreshed count every few seconds.

Having issues? Try the [troubleshooting guide](signalr-howto-troubleshoot-guide.md) or [let us know.](https://aka.ms/asrs/qscsharp)

[!INCLUDE [Cleanup](includes/signalr-quickstart-cleanup.md)]

## Sample code

You can get all code used in the article from GitHub repository: 

* [aspnet/AzureSignalR-samples](https://github.com/aspnet/AzureSignalR-samples/tree/main/samples/QuickStartServerless/javascript/v4-programming-model).

## Next steps

In this quickstart, you built and ran a real-time serverless application in localhost. Next, learn more about how to bi-directional communicating between clients and Azure Function with SignalR Service.

> [!div class="nextstepaction"]
> [SignalR Service bindings for Azure Functions](../azure-functions/functions-bindings-signalr-service.md)

> [!div class="nextstepaction"]
> [Bi-directional communicating in Serverless](https://github.com/aspnet/AzureSignalR-samples/tree/main/samples/BidirectionChat)

> [!div class="nextstepaction"]
> [Deploy Azure Functions with VS Code](/azure/developer/javascript/tutorial-vscode-serverless-node-01)
