---
title: Create your first function in Azure using Visual Studio Code
description: Create and publish to Azure a simple HTTP triggered function by using Azure Functions extension in Visual Studio Code. 
services: functions
documentationcenter: na
author: ggailey777
manager: jeconnoc
keywords: azure functions, functions, event processing, compute, serverless architecture

ms.service: azure-functions
ms.devlang: multiple
ms.topic: quickstart
ms.date: 06/25/2019
ms.author: glenga
ms.custom: mvc, devcenter
---

# Create your first function using Visual Studio Code

Azure Functions lets you execute your code in a [serverless](https://azure.microsoft.com/solutions/serverless/) environment without having to first create a VM or publish a web application.

In this article, you learn how to use the [Azure Functions extension for Visual Studio Code] to create and test a "hello world" function on your local computer using Microsoft Visual Studio Code. You then publish the function code to Azure from Visual Studio Code.

![Azure Functions code in a Visual Studio project](./media/functions-create-first-function-vs-code/functions-vscode-intro.png)

The extension currently supports C#, JavaScript, and Java functions, with Python support currently in Preview. The steps in this article and the article that follows support only JavaScript and C# functions. To learn how to use Visual Studio Code to create and publish Python functions, see [Deploy Python to Azure Functions](https://code.visualstudio.com/docs/python/tutorial-azure-functions). To learn how to use Visual Studio Code to create and publish PowerShell functions, see [Create your first PowerShell function in Azure](functions-create-first-function-powershell.md). 

The extension is currently in preview. To learn more, see the [Azure Functions extension for Visual Studio Code] extension page.

## Prerequisites

To complete this quickstart:

* Install [Visual Studio Code](https://code.visualstudio.com/) on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms).

* Install version 2.x of the [Azure Functions Core Tools](functions-run-local.md#v2).

* Install the specific requirements for your chosen language:

    | Language | Requirement |
    | -------- | --------- |
    | **C#** | [C# extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.csharp)  |
    | **JavaScript** | [Node.js](https://nodejs.org/)<sup>*</sup> | 
 
    <sup>*</sup>Active LTS and Maintenance LTS versions (8.11.1 and 10.14.1 recommended).

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [functions-install-vs-code-extension](../../includes/functions-install-vs-code-extension.md)]

[!INCLUDE [functions-create-function-app-vs-code](../../includes/functions-create-function-app-vs-code.md)]

[!INCLUDE [functions-run-function-test-local-vs-code](../../includes/functions-run-function-test-local-vs-code.md)]

After you've verified that the function runs correctly on your local computer, it's time to publish the project to Azure.

[!INCLUDE [functions-sign-in-vs-code](../../includes/functions-sign-in-vs-code.md)]

[!INCLUDE [functions-publish-project-vscode](../../includes/functions-publish-project-vscode.md)]

## Run the function in Azure

1. Copy the URL of the HTTP trigger from the **Output** panel. As before, make sure to add the query string `?name=<yourname>` to the end of this URL and execute the request.

    The URL that calls your HTTP-triggered function should be in the following format:

        http://<functionappname>.azurewebsites.net/api/<functionname>?name=<yourname> 

1. Paste this new URL for the HTTP request into your browser's address bar. The following shows the response in the browser to the remote GET request returned by the function: 

    ![Function response in the browser](./media/functions-create-first-function-vs-code/functions-test-remote-browser.png)

## Next steps

You have used Visual Studio Code to create a function app with a simple HTTP-triggered function. In the next article, you expand that function by adding an output binding. This binding writes the string from the HTTP request to a message in an Azure Queue Storage queue. The next article also shows you how to clean up these new Azure resources by removing the resource group you created.

> [!div class="nextstepaction"]
> [Add an Azure Storage queue binding to your function](functions-add-output-binding-storage-queue-vs-code.md)

[Azure Functions Core Tools]: functions-run-local.md
[Azure Functions extension for Visual Studio Code]: https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions
