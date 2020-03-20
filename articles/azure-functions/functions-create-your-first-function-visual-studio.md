---
title: "Quickstart: Create your first function in Azure using Visual Studio"
description: In this quickstart, you learn how to create and publish an HTTP-triggered Azure Function by using Visual Studio.
ms.assetid: 82db1177-2295-4e39-bd42-763f6082e796
ms.topic: quickstart
ms.date: 03/06/2020
ms.custom: mvc, devcenter, vs-azure, 23113853-34f2-4f
---
# Quickstart: Create your first function in Azure using Visual Studio

Azure Functions lets you run your code in a serverless environment without having to first create a VM or publish a web application.

In this quickstart, you learn how to use Visual Studio 2019 to locally create and test a "hello world" HTTP-triggered C# function app, which you then publish to Azure. 

![Function localhost response in the browser](./media/functions-create-your-first-function-visual-studio/functions-create-your-first-function-visual-studio-browser-local-final.png)

This quickstart is designed for Visual Studio 2019. 

## Prerequisites

To complete this tutorial, first install [Visual Studio 2019](https://azure.microsoft.com/downloads/). Ensure you select the **Azure development** workload during installation. If you want to create an Azure Functions project by using Visual Studio 2017 instead, you must first install the [latest Azure Functions tools](functions-develop-vs.md#check-your-tools-version).

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

Before you can publish your project, you must have a function app in your Azure subscription. Visual Studio publishing creates a function app for you the first time you publish your project.

[!INCLUDE [Publish the project to Azure](../../includes/functions-vstools-publish.md)]

## Test your function in Azure

1. Copy the base URL of the function app from the **Publish** profile page. Replace the `localhost:port` portion of the URL you used to test the function locally with the new base URL. Append the query string `?name=<YOUR_NAME>` to this URL and run the request.

    The URL that calls your HTTP triggered function is in the following format:

    `http://<APP_NAME>.azurewebsites.net/api/<FUNCTION_NAME>?name=<YOUR_NAME>`

2. Paste this new URL for the HTTP request into your browser's address bar. The following image shows the response in the browser to the remote GET request returned by the function:

    ![Function response in the browser](./media/functions-create-your-first-function-visual-studio/functions-create-your-first-function-visual-studio-browser-azure.png)

## Clean up resources

[!INCLUDE [Clean-up resources](../../includes/functions-quickstart-cleanup.md)]

## Next steps

In this quickstart, you used Visual Studio to create and publish a C# function app in Azure with a simple HTTP triggered function. 

Advance to the next article to learn how to add an Azure Storage queue binding to your function:
> [!div class="nextstepaction"]
> [Add an Azure Storage queue binding to your function](functions-add-output-binding-storage-queue-vs.md)

