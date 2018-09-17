---
title: Tutorial for authenticating Azure SignalR Service clients | Microsoft Docs
description: In this tutorial, you learn how to authenticate Azure SignalR Service clients
services: signalr
documentationcenter: ''
author: sffamily
manager: cfowler
editor: ''

ms.assetid: 
ms.service: signalr
ms.workload: tbd
ms.devlang: na
ms.topic: tutorial
ms.custom: mvc
ms.date: 09/18/2018
ms.author: zhshang
---
# Tutorial: Azure SignalR Service authentication with Azure Functions

A step by step tutorial to build a chat room with authentication and private messaging using Azure Functions, App Service Authentication, and SignalR Service.

## Introduction

### Technologies used

* [Azure Functions](https://azure.microsoft.com/services/functions/?WT.mc_id=serverlesschatlab-tutorial-antchu) - Backend API for authenticating users and sending chat messages
* [Azure SignalR Service](https://azure.microsoft.com/services/signalr-service/?WT.mc_id=serverlesschatlab-tutorial-antchu) - Broadcast new messages to connected chat clients
* [Azure Storage](https://azure.microsoft.com/services/storage/?WT.mc_id=serverlesschatlab-tutorial-antchu) - Host the static website for the chat client UI

### Prerequisites

The following software is required to build this tutorial.

* [Git](https://git-scm.com/downloads)
* [Node.js](https://nodejs.org/en/download/) (Version 10.x)
* [.NET SDK](https://www.microsoft.com/net/download) (Version 2.x, required for Functions extensions)
* [Azure Functions Core Tools](https://github.com/Azure/azure-functions-core-tools) (Version 2)
* [Visual Studio Code](https://code.visualstudio.com/) (VS Code) with the following extensions
    * [Azure Functions](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) - work with Azure Functions in VS Code
    * [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) - serve web pages locally for testing


## Sign into the Azure portal

1. Go to the [Azure portal](https://portal.azure.com/) and sign in with your credentials.


## Create an Azure SignalR Service instance

You will build and test the Azure Functions app locally. The app will access SignalR Service in Azure that needs to be created ahead of time.

1. Click on the **Create a resource** (**+**) button for creating a new Azure resource.

1. Search for **SignalR Service** and select it. Click **Create**.

1. Enter the following information.

    | Name | Value |
    |---|---|
    | Resource name | A unique name for the SignalR Service instance |
    | Resource group | Select the same resource group as the Cosmos DB account |
    | Location | Select a location close to you |
    | Pricing Tier | Free |

    ![](https://github.com/Azure-Samples/functions-serverless-chat-app-tutorial/raw/master/media/create-signalr-screenshot.png)
    
1. Click **Create**.


## Initialize the function app

### Create a new Azure Functions project

1. In a new VS Code window, use `File > Open Folder` in the menu to create and open an empty folder in an appropriate location. This will be the main project folder for the application that you will build.

    ![](https://github.com/Azure-Samples/functions-serverless-chat-app-tutorial/raw/master/media/vscode-new-folder-screenshot.png)

1. Using the Azure Functions extension in VS Code, initialize a Function app in the main project folder.
    1. Open the Command Palette in VS Code by selecting **View > Command Palette** from the menu (shortcut `Ctrl-Shift-P`, macOS: `Cmd-Shift-P`).
    1. Search for the **Azure Functions: Create New Project** command and select it.
    1. The main project folder should appear. Select it (or use "Browse" to locate it).
    1. In the prompt to choose a language, select **JavaScript**.

    ![](https://github.com/Azure-Samples/functions-serverless-chat-app-tutorial/raw/master/media/vscode-new-function-project-screenshot.png)


### Install function app extensions

This tutorial uses Azure Functions bindings to interact with Azure SignalR Service. Like most other Azure Functions bindings, the SignalR Service bindings are available as an extension that needs to be installed using the Azure Functions Core Tools CLI before they can be used.

1. Open a terminal in VS Code by selecting **View > Integrated Terminal** from the menu (Ctrl-`).

1. Ensure the main project folder is the current directory.

1. Install the SignalR Service function app extension.
    ```
    func extensions install -p Microsoft.Azure.WebJobs.Extensions.SignalRService -v 1.0.0-preview1-10002
    ```

    ![](https://github.com/Azure-Samples/functions-serverless-chat-app-tutorial/raw/master/media/vscode-install-func-extensions-screenshot.png)

### Configure application settings

When running and debugging the Azure Functions runtime locally, application settings are read from **local.settings.json**. Update this file with the connection string of the SignalR Service instance that you created earlier.

1. In VS Code, select **local.settings.json** in the Explorer pane to open it.

1. Replace the file's contents with the following.
    ```json
    {
        "IsEncrypted": false,
        "Values": {
            "AzureSignalRConnectionString": "<signalr-connection-string>",
            "WEBSITE_NODE_DEFAULT_VERSION": "10.0.0",
            "FUNCTIONS_WORKER_RUNTIME": "node"
        },
        "Host": {
            "LocalHttpPort": 7071,
            "CORS": "*"
        }
    }
    ```

    * Enter the Azure SignalR Service connection string into a setting named `AzureSignalRConnectionString`. Obtain the value from the **Keys** page in the Azure SignalR Service resource in the Azure portal; either the primary or secondary connection string can be used.
    * The `WEBSITE_NODE_DEFAULT_VERSION` setting is not used locally, but is required when deployed to Azure.
    * The `Host` section configures the port and CORS settings for the local Functions host (this setting has no effect when running in Azure).

1. Save the file.

    ![](https://github.com/Azure-Samples/functions-serverless-chat-app-tutorial/raw/master/media/vscode-localsettings-screenshot.png)


## Create an Azure Function to authenticate users to SignalR Service

When the chat app first starts up, it requires valid connection credentials to connect to Azure SignalR Service. You'll create an HTTP triggered function named *SignalRInfo* in your function app to return this connection information.

1. Open the VS Code command palette (`Ctrl-Shift-P`, macOS: `Cmd-Shift-P`).

1. Search for and select the **Azure Functions: Create Function** command.

1. When prompted, provide the following information.

    | Name | Value |
    |---|---|
    | Function app folder | select the main project folder |
    | Template | HTTP Trigger |
    | Name | SignalRInfo |
    | Authorization level | Anonymous |
    
    A folder named **SignalRInfo** is created that contains the new function.

1. Open **SignalRInfo/function.json** to configure bindings for the function. Modify the content of the file to the following. This adds an input binding that generates valid credentials for a client to connect to an Azure SignalR Service hub named `chat`.
    ```json
    {
        "disabled": false,
        "bindings": [
            {
                "authLevel": "anonymous",
                "type": "httpTrigger",
                "direction": "in",
                "name": "req"
            },
            {
                "type": "http",
                "direction": "out",
                "name": "res"
            },
            {
                "type": "signalRConnectionInfo",
                "name": "connectionInfo",
                "hubName": "chat",
                "direction": "in"
            }
        ]
    }
    ```

1. Open **SignalRInfo/index.js** to view the body of the function. Modify the content of the file to the following.

    ```javascript
    module.exports = function (context, req, connectionInfo) {
        context.res = { body: connectionInfo };
        context.done();
    };
    ```

    This function takes the SignalR connection information from the input binding and returns it to the client in the HTTP response body.


## Create an Azure Function to send chat messages

The app also requires an HTTP API to send messages. You will create an HTTP triggered function named *SendMessage* that sends messages to all connected clients using SignalR Service.

1. Open the VS Code command palette (`Ctrl-Shift-P`, macOS: `Cmd-Shift-P`).

1. Search for and select the **Azure Functions: Create Function** command.

1. When prompted, provide the following information.

    | Name | Value |
    |---|---|
    | Function app folder | select the main project folder |
    | Template | HTTP Trigger |
    | Name | SendMessage |
    | Authorization level | Anonymous |
    
    A folder named **SendMessage** is created that contains the new function.

1. Open **SendMessage/function.json** to configure bindings for the function. Modify the content of the file to the following.
    ```json
    {
        "disabled": false,
        "bindings": [
            {
                "authLevel": "anonymous",
                "type": "httpTrigger",
                "direction": "in",
                "name": "req",
                "route": "messages",
                "methods": [
                    "post"
                ]
            },
            {
                "type": "http",
                "direction": "out",
                "name": "res"
            },
            {
                "type": "signalR",
                "name": "signalRMessages",
                "hubName": "chat",
                "direction": "out"
            }
        ]
    }
    ```
    This makes two changes to the function:
    * Changes the route to `messages` and restricts the HTTP trigger to the **POST** HTTP method.
    * Adds a SignalR Service output binding that sends message(s) to all clients connected to a SignalR Service hub named `chat`.

1. Save the file.

1. Open **SendMessage/index.js** to view the body of the function. Modify the content of the file to the following.
    ```javascript
    module.exports = function (context, req) {  
        context.bindings.signalRMessages = [{
            "target": "newMessage",
            "arguments": [req.body]
        }];
        context.done();
    };
    ```
    This function takes the body from the HTTP request and sends it to clients connected to SignalR Service.

1. Save the file.

## Create and run the chat client web user interface

The chat application's UI is a simple single page application (SPA) created with Vue JavaScript framework. It will be hosted separately from the function app. Locally, you will run the web interface using the Live Server VS Code extension.

1. In VS Code, create a new folder named **content** at the root of the main project folder.

1. In the **content** folder, create a new file named **index.html**.

1. Copy and paste the content of **[index.html](https://raw.githubusercontent.com/Azure-Samples/functions-serverless-chat-app-tutorial/master/snippets/index.html)**.

1. Save the file.

1. Press **F5** to run the function app locally and attach a debugger.

1. With **index.html** open, start Live Server by opening the VS Code command palette (`Ctrl-Shift-P`, macOS: `Cmd-Shift-P`) and selecting **Live Server: Open with Live Server**. Live Server will open the application in a browser.

1. When the application prompts for a username, enter one. If you tested the function earlier, messages from your testing session will appear.

1. Enter a message in the chat box and press enter. Refresh the application to see new messages.


## Deploy to Azure

You have been running the function app and chat application locally. You will now deploy them to Azure.


### Log into Azure with VS Code

1. Open the VS Code command palette (`Ctrl-Shift-P`, macOS: `Cmd-Shift-P`).

1. Search for and select the **Azure: Sign in** command.

1. Follow the instructions to complete the sign in process in your browser.


### Deploy function app

1. Select the Azure icon on the VS Code activity bar (left side).

1. Hover your mouse over the **Functions** pane and click the **Deploy to Function App** button.

1. When prompted, provide the following information.

    | Name | Value |
    |---|---|
    | Folder to deploy | Select the main project folder |
    | Subscription | Select your subscription |
    | Function app | Select **Create New Function App** |
    | Function app name | Enter a unique name |
    | Resource group | Select the same resource group as the Cosmos DB account and SignalR Service instance |
    | Storage account | Select **Create new storage account** |
    | Storage account name | Enter a unique name (3-24 characters, alphanumeric only) |
    | Location | Select a location close to you |
    
    A new function app is created in Azure and the deployment begins.

1. If prompted to switch the function app version from *latest* to *beta*, select **Update remote runtime**.

    ![](https://github.com/Azure-Samples/functions-serverless-chat-app-tutorial/raw/master/media/vscode-update-function-version-screenshot.png)


### Upload function app local settings

1. Open the VS Code command palette (`Ctrl-Shift-P`, macOS: `Cmd-Shift-P`).

1. Search for and select the **Azure Functions: Upload local settings** command.

1. When prompted, provide the following information.

    | Name | Value |
    |---|---|
    | Local settings file | local.settings.json |
    | Subscription | Select your subscription |
    | Function app | Select the previously deployed function app |
    | Function app name | Enter a unique name |

Local settings are uploaded to the function app in Azure. If prompted to overwrite existing settings, select **Yes to all**.

![](https://github.com/Azure-Samples/functions-serverless-chat-app-tutorial/raw/master/media/vscode-update-function-settings-screenshot.png)


### Enable function app cross origin resource sharing (CORS)

Although there is a CORS setting in **local.settings.json**, it is not propagated to the function app in Azure. You need to set it separately.

1. Open the VS Code command palette (`Ctrl-Shift-P`, macOS: `Cmd-Shift-P`).

1. Search for and select the **Azure Functions: Open in portal** command.

1. Select the subscription and function app name to open the function app in the Azure portal.

1. Under the **Platform features** tab, select **CORS**.

    ![](https://github.com/Azure-Samples/functions-serverless-chat-app-tutorial/raw/master/media/functions-platform-features-screenshot.png)


1. Add an entry with the value `*`.

1. Remove all other existing entries.

1. Click **Save** to persist the CORS settings.

    ![](https://github.com/Azure-Samples/functions-serverless-chat-app-tutorial/raw/master/media/functions-cors-screenshot.png)

> In a real-world application, instead of allowing CORS on all domains (`*`), a more secure approach is to enter specific CORS entries for each domains that requires it.

### Update function app URL in chat UI

1. In the Azure portal, navigate to the function app's overview page.

1. Copy the function app's URL.

    ![](https://github.com/Azure-Samples/functions-serverless-chat-app-tutorial/raw/master/media/functions-get-url-screenshot.png)

1. In VS Code, open **index.html** and replace the value of `window.apiBaseUrl` with the function app's URL.

1. Save the file.

    ![](https://github.com/Azure-Samples/functions-serverless-chat-app-tutorial/raw/master/media/vscode-paste-function-url-screenshot.png)


### Deploy web UI to blob storage

The web UI will be hosted using Azure Blob Storage's static websites feature.

1. Click on the **New** (**+**) button for creating a new Azure resource.

1. Under **Storage**, select **Storage account**.

1. Enter the following information.

    | Name | Value |
    |---|---|
    | Name | A unique name for the blob storage account |
    | Deployment model | Resource manager |
    | Account kind | StorageV2 (general purpose V2) |
    | Location | Select the same region as your other resources |
    | Replication | Locally-redundant storage (LRS) |
    | Performance | Standard |
    | Access tier | Hot |
    | Secure transfer required | Enabled |
    | Resource group | Select the same resource group as the Cosmos DB account |
    
    ![](https://github.com/Azure-Samples/functions-serverless-chat-app-tutorial/raw/master/media/create-storage-screenshot.png)

1. Click **Create**.

1. When the storage account is created, open it in the Azure portal.

1. Select **Static website (preview)** in the left navigation.

1. Select **Enable**.

1. Enter `index.html` as the **Index document name**.

1. Click **Save**.

    ![](https://github.com/Azure-Samples/functions-serverless-chat-app-tutorial/raw/master/media/storage-enable-static-websites-screenshot.png)

1. Click on the **$web** link on the page to open the blob container.

1. Click **Upload** and upload all the files in the **content** folder.

    ![](https://github.com/Azure-Samples/functions-serverless-chat-app-tutorial/raw/master/media/storage-upload-screenshot.png)

1. Go back to the **Static website** page. Copy the **Primary endpoint** address and open it in a browser.

    ![](https://github.com/Azure-Samples/functions-serverless-chat-app-tutorial/raw/master/media/storage-primary-endpoint-screenshot.png)

The chat application will appear. Congratulations on creating and deploying a serverless chat application to Azure!