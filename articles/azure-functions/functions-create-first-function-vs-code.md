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
ms.date: 09/07/2018
ms.author: glenga
ms.custom: mvc, devcenter

---
# Create your first function using Visual Studio Code

Azure Functions lets you execute your code in a [serverless](https://azure.microsoft.com/solutions/serverless/) environment without having to first create a VM or publish a web application.

In this article, you learn how to use the [Azure Functions extension for Visual Studio Code] to create and test a "hello world" function on your local computer using Microsoft Visual Studio Code. You then publish the function code to Azure from Visual Studio Code.

![Azure Functions code in a Visual Studio project](./media/functions-create-first-function-vs-code/functions-vscode-intro.png)

The extension currently fully supports C#, JavaScript, and Java functions, with Python support currently in Preview. The steps in this article may vary depending on your choice of language for your Azure Functions project. The extension is currently in preview. To learn more, see the [Azure Functions extension for Visual Studio Code] extension page.

## Prerequisites

To complete this quickstart:

* Install [Visual Studio Code](https://code.visualstudio.com/) on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms). This article was developed and tested on a device running macOS (High Sierra).

* Install version 2.x of the [Azure Functions Core Tools](functions-run-local.md#v2), which is still in preview.

* Install the specific requirements for your chosen language:

    | Language | Extension |
    | -------- | --------- |
    | **C#** | [C# for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-vscode.csharp)<br/>[.NET Core CLI tools](https://docs.microsoft.com/dotnet/core/tools/?tabs=netcore2x)*   |
    | **Java** | [Debugger for Java](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-debug)<br/>[Java 8](https://aka.ms/azure-jdks)<br/>[Maven 3+](https://maven.apache.org/) |
    | **JavaScript** | [Node 8.0+](https://nodejs.org/)  |

    \* Also required by Core Tools.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [functions-install-vs-code-extension](../../includes/functions-install-vs-code-extension.md)]

[!INCLUDE [functions-create-function-app-vs-code](../../includes/functions-create-function-app-vs-code.md)]

## Create an HTTP triggered function

1. From **Azure: Functions**, choose the Create Function icon.

    ![Create a function](./media/functions-create-first-function-vs-code/create-function.png)

1. Select the folder with your function app project and select the **HTTP trigger** function template.

    ![Choose the HTTP trigger template](./media/functions-create-first-function-vs-code/create-function-choose-template.png)

1. Type `HTTPTrigger` for the function name and press Enter, then select **Anonymous** authentication.

    ![Choose anonymous authentication](./media/functions-create-first-function-vs-code/create-function-anonymous-auth.png)

    A function is created in your chosen language using the template for an HTTP-triggered function.

    ![HTTP triggered function template in Visual Studio Code](./media/functions-create-first-function-vs-code/new-function-full.png)

You can add input and output bindings to your function by modifying the function.json file. For more information, see  [Azure Functions triggers and bindings concepts](functions-triggers-bindings.md).

Now that you've created your function project and an HTTP-triggered function, you can test it on your local computer.

## Test the function locally

Azure Functions Core Tools lets you run an Azure Functions project on your local development computer. You're prompted to install these tools the first time you start a function from Visual Studio Code.  

1. To test your function, set a breakpoint in the function code and press F5 to start the function app project. Output from Core Tools is displayed in the **Terminal** panel.

1. In the **Terminal** panel, copy the URL endpoint of your HTTP-triggered function.

    ![Azure local output](./media/functions-create-first-function-vs-code/functions-vscode-f5.png)

1. Paste the URL for the HTTP request into your browser's address bar. Append the query string `?name=<yourname>` to this URL and execute the request. Execution is paused when the breakpoint is hit.

    ![Function hitting breakpoint in Visual Studio Code](./media/functions-create-first-function-vs-code/function-debug-vscode-js.png)

1. When you continue the execution, the following shows the response in the browser to the GET request:

    ![Function localhost response in the browser](./media/functions-create-first-function-vs-code/functions-test-local-browser.png)

1. To stop debugging, press Shift + F5.

After you've verified that the function runs correctly on your local computer, it's time to publish the project to Azure.

[!INCLUDE [functions-sign-in-vs-code](../../includes/functions-sign-in-vs-code.md)]

[!INCLUDE [functions-publish-project-vscode](../../includes/functions-publish-project-vscode.md)]

## Test your function in Azure

1. Copy the URL of the HTTP trigger from the **Output** panel. As before, make sure to add the query string `?name=<yourname>` to the end of this URL and execute the request.

    The URL that calls your HTTP-triggered function should be in the following format:

        http://<functionappname>.azurewebsites.net/api/<functionname>?name=<yourname> 

1. Paste this new URL for the HTTP request into your browser's address bar. The following shows the response in the browser to the remote GET request returned by the function: 

    ![Function response in the browser](./media/functions-create-first-function-vs-code/functions-test-remote-browser.png)

## Next steps

You have used Visual Studio Code to create a function app with a simple HTTP-triggered function. You may also want to learn more about [local testing and debugging from the Terminal or command prompt](functions-run-local.md) using the Azure Functions Core Tools.

> [!div class="nextstepaction"]
> [Enable Application Insights integration](functions-monitoring.md#manually-connect-an-app-insights-resource)

[Azure Functions Core Tools]: functions-run-local.md
[Azure Functions extension for Visual Studio Code]: https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions
