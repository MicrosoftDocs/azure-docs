---
title: Azure Web PubSub service serverless quickstart
description: A quickstart for using Azure Web PubSub service and Azure Functions to a serverless application.
author: yjin81
ms.author: yajin1
ms.service: azure-web-pubsub
ms.topic: overview 
ms.date: 03/11/2021
---

# Quickstart: Create a serverless chat with Azure Functions and Azure Web PubSub service 

The Azure Web PubSub service helps you build real-time messaging web applications using WebSockets and the publish-subscribe pattern easily. Azure Functions is a serverless platform that lets you run your code without managing any infrastructure. In this quickstart, learn how to use Azure Web PubSub service and Azure Functions to build a serverless application with real-time messaging and the publish-subscribe pattern.

## Prerequisites

# [JavaScript](#tab/javascript)

Install a code editor, such as [Visual Studio Code](https://code.visualstudio.com/), and also the library [Node.js](https://nodejs.org/en/download/), version 10.x

   > [!NOTE]
   > For more information about the supported versions of Node.js, see [Azure Functions runtime versions documentation](../azure-functions/functions-versions.md#languages).

Install the [Azure Functions Core Tools](https://github.com/Azure/azure-functions-core-tools#installing) (version 2.7.1505 or higher) to run Azure Function apps locally.

# [C#](#tab/csharp)

Install a code editor, such as [Visual Studio Code](https://code.visualstudio.com/).

Install the [Azure Functions Core Tools](https://github.com/Azure/azure-functions-core-tools#installing) (version 3 or higher) to run Azure Function apps locally.

---

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [create-instance-portal](includes/create-instance-portal.md)]

## Clone the sample application

While the service is deploying, let's switch to working with code. Clone the [sample app from GitHub](https://github.com/Azure/azure-webpubsub/tree/main/samples/functions/js/simplechat) as the first step.

1. Open a git terminal window. Navigate to a folder where you want to clone the sample project.

1. Run the following command to clone the sample repository. This command creates a copy of the sample app on your computer.

    ```bash
    git clone https://github.com/Azure/azure-webpubsub.git
    ```

## Configure and run the Azure Function app

- In the browser, open the **Azure portal** and confirm the Web PubSub Service instance you deployed earlier was successfully created. Navigate to the instance.
- Select **Keys** and copy out the connection string.

:::image type="content" source="media/quickstart-serverless/copy-connection-string.png" alt-text="Screenshot of copying the Web PubSub connection string.":::

# [JavaScript](#tab/javascript)

- Update function configuration.

  Open the */samples/functions/js/simplechat* folder in the cloned repository. Edit *local.settings.json* to add service connection string.
  In *local.settings.json*, you need to make these changes and then save the file.
    - Replace the place holder *<connection-string>* to the real one copied from **Azure portal** for **`WebPubSubConnectionString`** setting. 
    - For **`AzureWebJobsStorage`** setting, this is required due to [Azure Functions requires an Azure Storage account](../azure-functions/storage-considerations.md).
        - If you have [Azure Storage Emulator](https://go.microsoft.com/fwlink/?linkid=717179&clcid=0x409) run in local, keep the original settings of "UseDevelopmentStorage=true".
        - If you have an Azure storage connection string, replace the value with it.
 
- JavaScript functions are organized into folders. In each folder are two files: `function.json` defines the bindings that are used in the function, and `index.js` is the body of the function. There are several triggered functions in this function app:

    - **login** - This is the HTTP triggered function. It uses the *webPubSubConnection* input binding to generate and return valid service connection information.
    - **messages** - This is the `WebPubSubTrigger` triggered function. Receives a chat message in the request body and uses the `WebPubSub` output binding to broadcast the message to all connected client applications.
    - **connect** and **connected** - These are the `WebPubSubTrigger` triggered functions. Handle the connect and connected events.

- In the terminal, ensure that you are in the */samples/functions/js/simplechat* folder. Install the extensions and run the function app.

    ```bash
    func extensions install

    func start
    ```

# [C#](#tab/csharp)

- Update function configuration.

  Open the */samples/functions/csharp/simplechat* folder in the cloned repository. Edit *local.settings.json* to add service connection string.
  In *local.settings.json*, you need to make these changes and then save the file.
    - Replace the place holder *<connection-string>* to the real one copied from **Azure portal** for **`WebPubSubConnectionString`** setting. 
    - For **`AzureWebJobsStorage`** setting, this is required due to [Azure Functions requires an Azure Storage account](../azure-functions/storage-considerations.md).
        - If you have [Azure Storage Emulator](https://go.microsoft.com/fwlink/?linkid=717179&clcid=0x409) run in local, keep the original settings of "UseDevelopmentStorage=true".
        - If you have an Azure storage connection string, replace the value with it.

- C# functions are organized by file Functions.cs. There are several triggered functions in this function app:

    - **login** - This is the HTTP triggered function. It uses the *webPubSubConnection* input binding to generate and return valid service connection information.
    - **connected** - This is the `WebPubSubTrigger` triggered function. Receives a chat message in the request body and broadcast the message to all connected client applications with multiple tasks.
    - **broadcast** - This is the `WebPubSubTrigger` triggered function. Receives a chat message in the request body and broadcast the message to all connected client applications with single task.
    - **connect** and **disconnect** - These are the `WebPubSubTrigger` triggered functions. Handle the connect and disconnect events.

- In the terminal, ensure that you are in the */samples/functions/csharp/simplechat* folder. Install the extensions and run the function app.

    ```bash
    func extensions install

    func start
    ```

---

- The local function will use port defined in the `local.settings.json` file. To make it available in public network, you need to work with [ngrok](https://ngrok.com) to expose this endpoint. Run command below and you'll get a forwarding endpoint, for example: http://{ngrok-id}.ngrok.io -> http://localhost:7071.

    ```bash
    ngrok http 7071
    ``` 

- Set `Event Handler` in Azure Web PubSub service. Go to **Azure portal** -> Find your Web PubSub resource -> **Settings**. Add a new hub settings mapping to the one function in use as below. Replace the {ngrok-id} to yours.

   - Hub Name: simplechat
   - URL Template: **http://{ngrok-id}.ngrok.io/runtime/webhooks/webpubsub**
   - User Event Pattern: *
   - System Events: connect, connected, disconnected.

:::image type="content" source="media/quickstart-serverless/set-event-hanlder.png" alt-text="Screenshot of setting the event handler.":::

## Run the web application

1. To simplify your client testing, open your browser to our sample [single page web application](http://jialinxin.github.io/webpubsub/). 

1. Enter the function app base URL as local: `http://localhost:7071`.

1. Enter a username.

1. The web application calls the *login* function in the function app to retrieve the connection information to connect to Azure Web PubSub service. When you saw `Client websocket opened.`, it means the connection is established. 

1. Type a message and press enter. The application sends the message to the *messages* function in the Azure Function app, which then uses the Web PubSub output binding to broadcast the message to all connected clients. If everything is working correctly, the message will appear in the application.

1. Open another instance of the web application in a different browser window. You will see that any messages sent will appear in all instances of the application.

## Clean up resources

If you're not going to continue to use this app, delete all resources created by this doc with the following steps so you don't incur any charges:

1. In the Azure portal, select **Resource groups** on the far left, and then select the resource group you created. You may use the search box to find the resource group by its name instead.

1. In the window that opens, select the resource group, and then select **Delete resource group**.

1. In the new window, type the name of the resource group to delete, and then select **Delete**.

## Next steps

In this quickstart, you learned how to run a serverless simple chat application. Now, you could start to build your own application. 

> [!div class="nextstepaction"]
> [Quick start: Create a simple chatroom with Azure Web PubSub](https://azure.github.io/azure-webpubsub/getting-started/create-a-chat-app/js-handle-events)

> [!div class="nextstepaction"]
> [Azure Web PubSub bindings for Azure Functions](https://azure.github.io/azure-webpubsub/references/functions-bindings)

> [!div class="nextstepaction"]
> [Explore more Azure Web PubSub samples](https://github.com/Azure/azure-webpubsub/tree/main/samples)