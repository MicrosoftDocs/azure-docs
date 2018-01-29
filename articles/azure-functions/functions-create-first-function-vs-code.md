---
title: Create your first function in Azure using Visual Studio Code | Microsoft Docs
description: Create and publish a simple HTTP triggered function to Azure by using Azure Functions extension to Visual Studio Code. 
services: functions
documentationcenter: na
author: ggailey777
manager: cfowler
editor: ''
tags: ''
keywords: azure functions, functions, event processing, compute, serverless architecture

ms.service: functions
ms.devlang: multiple
ms.topic: quickstart
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 01/25/2018
ms.author: glenga
ms.custom: mvc, devcenter

---
# Create your first function using Visual Studio Code

Azure Functions lets you execute your code in a [serverless](https://azure.microsoft.com/overview/serverless-computing/) environment without having to first create a VM or publish a web application.

In this article, you learn how to use the [Azure Functions extension for Visual Studio Code] to locally create and test a "hello world" function. You then publish the function code to Azure. The extension uses the [Azure Functions Core Tools] for local debugging. 

![Azure Functions code in a Visual Studio project](./media/functions-create-first-function-vs-code/functions-vscode-intro.png)

## Prerequisites

To complete this tutorial:

* Install [Visual Studio Code](https://code.visualstudio.com/) on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms). This topic was developed and tested on a device running MacOS (High Sierra).    

* Install the following components, which are required by the [Azure Functions Core Tools]: 

    * [Node.js 8.5 or a later version](https://docs.npmjs.com/getting-started/installing-node), which includes npm. 

    * [.NET Core 2.0](https://www.microsoft.com/net/core)

* Use the following command to install the correct version of the [Core Tools][Azure Functions Core Tools]: 

    ```bash
    npm install -g azure-functions-core-tools@core
    ``` 
    
     When installing on Ubuntu, you may need to use `sudo`. On MacOS and LInux, you may need to use the `unsafe-perm` flag, as follows:
    
    ```bash
    sudo npm install -g azure-functions-core-tools@core --unsafe-perm true
    ```
        
    This [version of the Core Tools](functions-run-local.md#version-2x-runtime) uses the Azure Functions version 2.x runtime and .NET Core and is still in preview. 

    
[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)] 

## Install the extension

The Azure Functions extension is used to create, test, and deploy functions to Azure.

1. In VS Code, open **Extensions** and search for `azure functions`, or [open this link in VS Code](vscode:extension/ms-azuretools.vscode-azurefunctions).

2. Select **Install** to install the extension to VS Code. 

    ![Install the VS Code extension for Azure Functions](./media/functions-create-first-function-vs-code/vscode-install-extension.png)

3. Restart VS Code. You should see a new Azure Functions area in the **Explorer**.

    ![Azure Functions area in the Explorer](./media/functions-create-first-function-vs-code/azure-functions-window-vscode.png)

The Azure Functions extension for VS Code is in preview. To learn more, see [Azure Functions extension for Visual Studio Code].

## Create a function app project

The Azure Functions project template in Visual Studio creates a project that can be published to a function app in Azure. A function app lets you group functions as a logical unit for management, deployment, and sharing of resources. 

1. In the VS Code, open the **Explorer** and select the create project icon in the **Azure Functions** area.

    ![Create a function app project](./media/functions-create-first-function-vs-code/create-function-app-project.png)

2. Choose a location for your project workspace and choose **Select**, then select a language for your function app project.

    ![Choose project language](./media/functions-create-first-function-vs-code/create-function-app-project-language.png)

Visual Studio creates a workspace and function app project. This project contains [host.json](functions-host-json.md) and a [local.settings.json](functions-run-local.md#local-settings-file) configuration files.

## Create the function

1. From **Azure Functions** in the **Explorer**, choose the create function icon. 

    ![Create a function](./media/functions-create-first-function-vs-code/create-function.png)

2. Select the folder containing your function app project, select the **HTTP trigger** function template. 

    ![Choose the HTTP trigger template](./media/functions-create-first-function-vs-code/create-function-choose-template.png)

3. Type a function name and press Enter, then select **Anonymous** authentication. 

    ![Choose anonymous authentication](./media/functions-create-first-function-vs-code/create-function-anonymous-auth.png)

    A function is created in your chosen language using the template for an HTTP triggered function. 

    ![HTTP triggered function template in VS Code](./media/functions-create-first-function-vs-code/functions-vscode-intro.png)

Now that you have created your function project and an HTTP-triggered function, you can test it on your local computer.

## Test the function locally

Azure Functions Core Tools lets you run an Azure Functions project on your local development computer. You are prompted to install these tools the first time you start a function from Visual Studio.  

1. To test your function, press F5 to start the function app project. Output from Core Tools is dislayed in the **Terminal** panel.

2. In the **Terminal** panel, copy the URL endpoint of your HTTP triggered function. 

    ![Azure local runtime](./media/functions-create-first-function-vs-code/functions-vscode-f5.png)

3. Paste the URL for the HTTP request into your browser's address bar. Append the query string `?name=<yourname>` to this URL and execute the request. The following shows the response in the browser to the local GET request returned by the function: 

    ![Function localhost response in the browser](./media/functions-create-first-function-vs-code/functions-test-local-browser.png)

4. To stop debugging, press Shift + F5.

After you have verified that the function runs correctly on your local computer, it's time to publish the project to Azure.

## Sign in to Azure

Before you can publish your app, you must sign in to Azure. 

1. In **Azure Functions** in the **Explorer**, click **Sign in to Azure...**.

    ![Function localhost response in the browser](./media/functions-create-first-function-vs-code/functions-sign-into-azure.png)

2.  When prompted, select **Copy & Open**, or copy the displayed code and open <https://aka.ms/devicelogin> in your browser. 

3. Paste the copied code in the **Device Login** page, verify the sign in is for VS Code, then select **Continue**.  

4. Complete the sign in using your Azure account credentials. After you have successfully signed in, you can close the browser. 

## Publish the project to Azure

VS Code lets you publish your Azure Functions project directly to Azure. In the process, you create a function app and related resources in your Azure subscription. The project is then deployed to the new function app in Azure. 

1. In the **Azure Functions** area of the **Explorer**, select the publish icon.

    ![Function app settings](./media/functions-create-first-function-vs-code/function-app-publish-project.png)

2. Choose the project folder, which is your current workspace. 

2. Choose your subscription, then choose **+ Create New Function App**. 

3. Type a globally unique name that identifies your function app and press Enter. Valid characters for a function app name are `a-z`, `0-9`, and `-`.

4. Choose **+ Create New Resource Group**, type a resource group name, like `myResourceGroup`, and press enter. You can also use an existing resource group.

5. Choose a location in a [region](https://azure.microsoft.com/regions/) near you or near other services your functions access.

6. Choose **+Create New Storage Account**, type a globally unique name of the new storage account used by your function app and press Enter. Storage account names must be between 3 and 24 characters in length and may contain numbers and lowercase letters only. You can also use an existing account.

The output panel shows the Azure resources that you created in a resource group in your subscription. 

![Function app create output](./media/functions-create-first-function-vs-code/function-create-output.png)

Make a note of the URL of the new function app in Azure. You use this to test your function after the project is published to Azure.

Back in the **Azure Functions** area of the **Explorer**, you see the new function app displayed under your subscription. When you expand this node, you see the application settings and functions in the function app.

![Function app settings](./media/functions-create-first-function-vs-code/function-app-project-settings.png)

From your function app node, you can Ctrl + click and choose to perform various management and configuration tasks against the function app in Azure. You can also choose to view the function app in the Azure portal. 

## Test your function in Azure

1. Copy the URL of the HTTP trigger from the **Output** panel. As before, make sure to add the query string `?name=<yourname>` to the end of this URL and execute the request.

    The URL that calls your HTTP triggered function should be in the following format:

        http://<functionappname>.azurewebsites.net/api/<functionname>?name=<yourname> 

2. Paste this new URL for the HTTP request into your browser's address bar. The following shows the response in the browser to the remote GET request returned by the function: 

    ![Function response in the browser](./media/functions-create-first-function-vs-code/functions-test-remote-browser.png)

## Next steps

You have used VS Code to create a function app with a simple HTTP triggered function. 

+ To learn more about local testing and debugging using the Azure Functions Core Tools, see [Code and test Azure Functions locally](functions-run-local.md). 
+ To learn more about developing functions in a specific language, see the language reference guides for [JavaScript](functions-reference-node.md), [.NET](functions-dotnet-class-library.md), or [Java](functions-reference-java.md).

[Azure Functions Core Tools]: functions-run-local.md
[Azure Functions extension for Visual Studio Code]: https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions