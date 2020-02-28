---
title: Quickstart: Create your first function in Azure using Visual Studio
description: In this quickstart, you learn how to create and publish an HTTP-triggered Azure Function by using Visual Studio.
ms.assetid: 82db1177-2295-4e39-bd42-763f6082e796
ms.topic: quickstart
ms.date: 02/28/2020
ms.custom: mvc, devcenter, vs-azure, 23113853-34f2-4f
---
# Quickstart: Create your first function in Azure using Visual Studio

Azure Functions lets you execute your code in a [serverless](https://azure.microsoft.com/solutions/serverless/) environment without having to first create a VM or publish a web application.

In this quickstart, you learn how to use Visual Studio 2019 to locally create and test a "hello world" function, and then publish it to Azure. This quickstart is designed for Visual Studio 2019. If you create a Azure Functions project by using Visual Studio 2017, you must first install the [latest Azure Functions tools](functions-develop-vs.md#check-your-tools-version).

![Function localhost response in the browser](./media/functions-create-your-first-function-visual-studio/functions-create-your-first-function-visual-studio-browser-local-final.png)

To learn more about developing functions as .NET class libraries, see [Azure Functions C# developer reference](functions-dotnet-class-library.md).

## Prerequisites

To complete this tutorial, you must first install [Visual Studio 2019](https://azure.microsoft.com/downloads/). Make sure that the **Azure development** workload is also installed.

![Install Visual Studio with the Azure development workload](media/functions-create-your-first-function-visual-studio/functions-vs-workloads.png)

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Create a function app project

[!INCLUDE [Create a project using the Azure Functions template](../../includes/functions-vstools-create.md)]

Visual Studio creates a project and class that contains boilerplate code for the HTTP trigger function type. The `FunctionName` method attribute sets the name of the function, which by default is `Function1`. The `HttpTrigger` attribute specifies that the function is triggered by an HTTP request. The boilerplate code sends an HTTP response that includes a value from the request body or query string.

Expand the capabilities of your function with input and output bindings by applying the appropriate attributes to the method. For more information, see the [Triggers and bindings](functions-dotnet-class-library.md#triggers-and-bindings) section of the [Azure Functions C# developer reference](functions-dotnet-class-library.md).

Now that you've created your function project and an HTTP-triggered function, you can test it on your local computer.

## Run the function locally

Visual Studio integrates with Azure Functions Core Tools so that you can test your functions locally using the full Azure Functions runtime.  

[!INCLUDE [functions-run-function-test-local-vs](../../includes/functions-run-function-test-local-vs.md)]

After you've verified that the function runs correctly on your local computer, it's time to publish the project to Azure.

## Publish the project to Azure

You must have a function app in your Azure subscription before you can publish your project. Visual Studio publishing creates a function app for you the first time you publish your project.

[!INCLUDE [Publish the project to Azure](../../includes/functions-vstools-publish.md)]

## Test your function in Azure

1. Copy the base URL of the function app from the Publish profile page. Replace the `localhost:port` portion of the URL you used when testing the function locally with the new base URL. As before, make sure to append the query string `?name=<YOUR_NAME>` to this URL and execute the request.

    The URL that calls your HTTP triggered function is in the following format:

        http://<APP_NAME>.azurewebsites.net/api/<FUNCTION_NAME>?name=<YOUR_NAME> 

2. Paste this new URL for the HTTP request into your browser's address bar. The following image shows the response in the browser to the remote GET request returned by the function:

    ![Function response in the browser](./media/functions-create-your-first-function-visual-studio/functions-create-your-first-function-visual-studio-browser-azure.png)

## Next steps

In this quickstart, you've used Visual Studio to create and publish a C# function app in Azure with a simple HTTP triggered function. 

Advance to the next article to learn how to add an Azure Storage queue binding to your function:
> [!div class="nextstepaction"]
> [Add an Azure Storage queue binding to your function](functions-add-output-binding-storage-queue-vs.md)

