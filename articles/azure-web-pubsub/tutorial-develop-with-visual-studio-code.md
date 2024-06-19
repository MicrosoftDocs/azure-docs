---
title: 'Visual Studio Code Extension for Azure Web PubSub'
description: Develop with Visual Studio Code extension
author: xingsy97
ms.author: siyuanxing
ms.service: azure-web-pubsub
ms.topic: reference
ms.date: 04/28/2024
---

# Quickstart: Develop with Visual Studio Code Extension
Azure Web PubSub helps developer build real-time messaging web applications using WebSockets and the publish-subscribe pattern easily.

In this tutorial, you create a chat application using Azure Web PubSub with the help of Visual Studio Code.

## Prerequisites

- An Azure account with an active subscription is required. If you don't already have one, you can [create an account for free](https://azure.microsoft.com/free).
- Visual Studio Code, available as a [free download](https://code.visualstudio.com/).
- The following Visual Studio Code extensions installed:
    - The [Azure Account extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azure-account)
    - The [Azure Web PubSub extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurewebpubsub)

## Clone the project

1. Open a new Visual Studio Code window.

1. Press <kbd>F1</kbd> to open the command palette.

1. Enter **Git: Clone** and press enter.

1. Enter the following URL to clone the sample project:

    ```git
    https://github.com/Azure/azure-webpubsub.git
    ```

    > [!NOTE]
    > This tutorial uses a JavaScript project, but the steps are language agnostic.

1. Select a folder to clone the project into.

1. Select **Open -> Open Folder** to `azure-webpubsub/samples/javascript/chatapp/nativeapi` in Visual Studio Code.

## Sign in to Azure

1. Press <kbd>F1</kbd> to open the command palette.

1. Select **Azure: Sign In** and follow the prompts to authenticate.

1. Once signed in, return to Visual Studio Code.

## Create an Azure Web PubSub Service

The Azure Web PubSub extension for Visual Studio Code enables users to quickly create, manage, and utilize Azure Web PubSub Service and its developer tools such as [Azure Web PubSub Local Tunnel Tool](https://www.npmjs.com/package/@azure/web-pubsub-tunnel-tool).
In this scenario, you create a new Azure Web PubSub Service resource and configure it to host your application. After installing the Web PubSub extension, you can access its features under the Azure control panel in Visual Studio Code.

1. Press <kbd>F1</kbd> to open the command palette and run the **Azure Web PubSub: Create Web PubSub Service** command.

1. Enter the following values as prompted by the extension.

    | Prompt | Value |
    |--|--|
    | Select subscription | Select the Azure subscription you want to use. |
    | Select resource group | Select the Azure resource group you want to use. |
    | Enter a name for the service | Enter `my-wps`. |
    | Select a location | Select an Azure region close to you. |
    | Select a pricing tier | Select a pricing tier you want to use. |
    | Select a unit count | Select a unit count you want to use.|

    The Azure activity log panel opens and displays the deployment progress. This process might take a few minutes to complete.

1. Once this process finishes, Visual Studio Code displays a notification. 

## Create a hub setting
1. Open **Azure** icon in the Activity Bar in the left side of Visual Studio Code. 

    > [!NOTE]
    > If your activity bar is hidden, you won't be able to access the extension. Show the Activity Bar by clicking **View > Appearance > Show Activity Bar**

1. In the resource tree, find the Azure Web PubSub resource `my-wps` you created and click it to expand

1. Right click the item **Hub Settings** and then select **Create Hub Setting**

1. Input `sample_chat` as the hub name and create the hub setting. It doesn't matter whether to create extra event handlers or not. Wait for the progress notification shown as finished

1. Below the item **Hub Settings**, a new subitem *Hub sample_chat* shall appear. Right click on the new item and then choose "Attach Local Tunnel"

1. A notification reminds you to create a tunnel-enabled event handler pops up. Click **Yes** button. Then enter the following values as prompted by the extension

    | Prompt | Value |
    |--|--|
    | Select User Events | Select **All** |
    | Select System Events | Select **connected** |
    | Input Server Port | Enter **8080** |

1. The extension creates a new terminal to run the Local Tunnel Tool and a notification reminds you to open Local Tunnel Portal shows up. Click the button "Yes" or open "http://localhost:4000" in web browser manually to view the portal.

## Run the server application
1. Ensure working directory is `azure-webpubsub/samples/javascript/chatapp/nativeapi`

1. Install Node.js dependencies

    ```bash
    npm install
    ```

1. Open **Azure** icon in the Activity Bar and find the Azure Web PubSub resource `my-wps`. Then right click on the resource item and select **Copy Connection String**. The connection string is copied to your clipboard

1. Run the server application with copied connection string

    ```bash
    node server.js "<connection-string>"
    ```

1. Open `http://localhost:8080/index.html` in browser to try your chat application. 

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Web PubSub repo](https://github.com/azure/azure-webpubsub/).