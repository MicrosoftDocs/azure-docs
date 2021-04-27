---
title: Azure Web PubSub service serverless quickstart
description: A quickstart for using Azure Web PubSub service and Azure Functions to a serverless application.
author: yjin81
ms.author: yajin1
ms.service: azure-web-pubsub
ms.topic: overview 
ms.date: 03/11/2021
---

# Quickstart: Create a serverless application with Azure Functions and Azure Web PubSub service 

The Azure Web PubSub service helps you build real-time messaging web applications using WebSockets and the publish-subscribe pattern easily. Azure Functions is a serverless platform that lets you run your code without managing any infrastructure. In this quickstart, learn how to use Azure Web PubSub service and Azure Functions to build a serverless application with real-time messaging and the publish-subscribe pattern.

## Prerequisites

# [JavaScript](#tab/javascript)

Install a code editor, such as [Visual Studio Code](https://code.visualstudio.com/), and also the library [Node.js](https://nodejs.org/en/download/), version 10.x

   > [!NOTE]
   > For more information about the supported versions of Node.js, see [Azure Functions runtime versions documentation](../azure-functions/functions-versions.md#languages).

Install the [Azure Functions Core Tools](https://github.com/Azure/azure-functions-core-tools#installing) (version 2.7.1505 or higher) to run Azure Function apps locally.

---

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [create-instance-portal](includes/create-instance-portal.md)]

## Clone the sample application

While the service is deploying, let's switch to working with code. Clone the [sample app from GitHub](https://github.com/Azure/azure-webpubsub/tree/main/samples/simplechat) as the first step.

1. Open a git terminal window. Change to a folder where you want to clone the sample project.

1. Run the following command to clone the sample repository. This command creates a copy of the sample app on your computer.

    ```bash
    git clone https://github.com/Azure/azure-webpubsub.git
    ```

## Configure and run the Azure Function app

- In the browser, open the Azure portal and confirm the SignalR Service instance you deployed earlier was successfully created by searching for its name in the search box at the top of the portal. Select the instance to open it.
- Select **Keys** to view the connection strings for the Web PubSub service instance.
- Select and copy the primary connection string.
- Since [Azure Functions requires an Azure Storage account](https://docs.microsoft.com/azure/azure-functions/storage-considerations), you could choose one of the options below: 
    - Option #1: Create [Azure storage](https://docs.microsoft.com/azure/storage/common/storage-introduction#core-storage-services) instance and copy the primary connection string.
    - Option #2: Use the [Azure storage emulator](https://docs.microsoft.com/azure/storage/common/storage-use-emulator).

# [JavaScript](#tab/javascript)

- Open the *samples/simplechat/function-js* folder in the cloned repository.
- Rename *local.settings.sample.json* to *local.settings.json*
- In *local.settings.json*, you need to make these changes and then save the file.
    - Paste the Azure Web PubSub instance connection string into the value of the **WebPubSubConnectionString** setting. 
    - For **AzureWebJobsStorage** setting, 
        - If you created the Azure storage instance, paste the Azure storage instance connection string.
        - If you installed and launched Azure storage emulator, paste "UseDevelopmentStorage=true".
- JavaScript functions are organized into folders. In each folder are two files: *function.json* defines the bindings that are used in the function, and *index.js* is the body of the function. There are several triggered functions in this function app:

    - **login** - This is the HTTP triggered function. Uses the *webPubSubConnection* input binding to generate and return valid connection information.
    - **messages** - This is the WebPubSubTrigger triggered function. Receives a chat message in the request body and uses the *webPubSub* output binding to broadcast the message to all connected client applications.
    - **connect** and **connected** - These are the WebPubSubTrigger triggered functions. Handle the connect and connected events. 

- In the terminal, ensure that you are in the *samples/simplechat/function-js* folder. Install the extensions and run the function app.

    ```bash
    func extensions install

    func start
    ```

- The local function will use port defined in the local.settings.json file. To make it available in public network. You need to work with [ngrok](https://ngrok.com) to expose this endpoint. Run command below and you'll get a forwarding endpoint.

    ```bash
    ngrok http 7071
    ```    

- Go to the settings of Azure Web PubSub instance, create a new hub with the name `simplechat` defined in function attributes and then set the endpoint to Azure Web PubSub service settings as `<forwarding endpoint>/runtime/webhooks/webpubsub`，like http://d3d17c23a4f2.ngrok.io/runtime/webhooks/webpubsub

---

## Run the web application

1. To simplify your client testing, open your browser to our sample [single page web application](http://jialinxin.github.io/webpubsub/). 

1. When prompted for the function app base URL, enter `http://localhost:7071`.

1. Enter a username when prompted.

1. The web application calls the *login* function in the function app to retrieve the connection information to connect to Azure Web PubSub service. When the connection is complete, the chat message input box appears.

1. Type a message and press enter. The application sends the message to the *messages* function in the Azure Function app, which then uses the Web PubSub output binding to broadcast the message to all connected clients. If everything is working correctly, the message should appear in the application.

1. Open another instance of the web application in a different browser window. You will see that any messages sent will appear in all instances of the application.

## Clean up resources

If you're not going to continue to use this app, delete all resources created by this doc with the following steps so you don't incur any charges:

1. In the Azure portal, select **Resource groups** on the far left, and then select the resource group you created. You may use the search box to find the resource group by its name instead.

1. In the window that opens, select the resource group, and then select **Delete resource group**.

1. In the new window, type the name of the resource group to delete, and then select **Delete**.