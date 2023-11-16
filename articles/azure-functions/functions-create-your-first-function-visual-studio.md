---
title: "Quickstart: Create your first C# function in Azure using Visual Studio"
description: "In this quickstart, you learn how to use Visual Studio to create and publish a C# HTTP triggered function to Azure Functions."
ms.assetid: 82db1177-2295-4e39-bd42-763f6082e796
ms.topic: quickstart
ms.date: 02/28/2023
ms.devlang: csharp
ms.custom: devx-track-csharp, mvc, devcenter, vs-azure, 23113853-34f2-4f, contperf-fy21q3-portal, mode-ui
---

# Quickstart: Create your first C# function in Azure using Visual Studio

Azure Functions lets you use Visual Studio to create local C# function projects and then easily publish this project to run in a scalable serverless environment in Azure. If you prefer to develop your C# apps locally using Visual Studio Code, you should instead consider the [Visual Studio Code-based version](create-first-function-vs-code-csharp.md) of this article.

By default, this article shows you how to create C# functions that run on .NET 8 in an [isolated worker process](dotnet-isolated-process-guide.md). Function apps that run in an isolated worker process are supported on all versions of .NET that are supported by Functions. For more information, see [Supported versions](dotnet-isolated-process-guide.md#supported-versions).

In this article, you learn how to:

> [!div class="checklist"]
> * Use Visual Studio to create a C# class library project.
> * Create a function that responds to HTTP requests.
> * Run your code locally to verify function behavior.
> * Deploy your code project to Azure Functions.

Completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.

## Prerequisites

+ [Visual Studio 2022](https://visualstudio.microsoft.com/vs/). Make sure to select the **Azure development** workload during installation.

+ [Azure subscription](../guides/developer/azure-developer-guide.md#understanding-accounts-subscriptions-and-billing). If you don't already have an account, [create a free one](https://azure.microsoft.com/free/dotnet/) before you begin.

## Create a function app project

The Azure Functions project template in Visual Studio creates a C# class library project that you can publish to a function app in Azure. You can use a function app to group functions as a logical unit for easier management, deployment, scaling, and sharing of resources.

1. From the Visual Studio menu, select **File** > **New** > **Project**.

1. In **Create a new project**, enter *functions* in the search box, choose the **Azure Functions** template, and then select **Next**.

1. In **Configure your new project**, enter a **Project name** for your project, and then select **Next**. The function app name must be valid as a C# namespace, so don't use underscores, hyphens, or any other nonalphanumeric characters.

1. For the remaining **Additional information** settings, 
     
    | Setting      | Value  | Description                      |
    | ------------ |  ------- |----------------------------------------- |
    | **Functions worker** | **.NET 8.0 Isolated (Long Term Support)** | Your functions run on .NET 8 in an isolated worker process. | 
    | **Function** | **HTTP trigger** | This value creates a function triggered by an HTTP request. |
    | **Use Azurite for runtime storage account (AzureWebJobsStorage)**  | Enable | Because a function app in Azure requires a storage account, one is assigned or created when you publish your project to Azure. An HTTP trigger doesn't use an Azure Storage account connection string; all other trigger types require a valid Azure Storage account connection string. When you select this option, the [Azurite emulator](../storage/common/storage-use-azurite.md?tabs=visual-studio) is used. |
    | **Authorization level** | **Anonymous** | The created function can be triggered by any client without providing a key. This authorization setting makes it easy to test your new function. For more information about keys and authorization, see [Authorization keys](./functions-bindings-http-webhook-trigger.md#authorization-keys) and [HTTP and webhook bindings](./functions-bindings-http-webhook.md). |
    
     :::image type="content" source="../../includes/media/functions-vs-tools-create/functions-project-settings-v4-isolated.png" alt-text="Screenshot of Azure Functions project settings.":::
    
    Make sure you set the **Authorization level** to **Anonymous**. If you choose the default level of **Function**, you're required to present the [function key](./functions-bindings-http-webhook-trigger.md#authorization-keys) in requests to access your function endpoint in Azure.

2. Select **Create** to create the function project and HTTP trigger function.

Visual Studio creates a project and class that contains boilerplate code for the HTTP trigger function type. The boilerplate code sends an HTTP response that includes a value from the request body or query string. The `HttpTrigger` attribute specifies that the function is triggered by an HTTP request.

## Rename the function

The `Function` method attribute sets the name of the function, which by default is generated as `Function1`. Since the tooling doesn't let you override the default function name when you create your project, take a minute to create a better name for the function class, file, and metadata.

1. In **File Explorer**, right-click the Function1.cs file and rename it to `HttpExample.cs`.

1. In the code, rename the Function1 class to `HttpExample`.

1. In the method named `Run`, rename the `Function` method attribute to `HttpExample`.

Your function definition should now look like the following code:

```csharp
[Function("HttpExample")]
public static HttpResponseData Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequestData req,
    FunctionContext executionContext)
```

Now that you've renamed the function, you can test it on your local computer.

## Run the function locally

Visual Studio integrates with Azure Functions Core Tools so that you can test your functions locally using the full Azure Functions runtime.

[!INCLUDE [functions-run-function-test-local-vs](../../includes/functions-run-function-test-local-vs.md)]

After you've verified that the function runs correctly on your local computer, it's time to publish the project to Azure.

## Publish the project to Azure

Visual Studio can publish your local project to Azure. Before you can publish your project, you must have a function app in your Azure subscription. If you don't already have a function app in Azure, Visual Studio publishing creates one for you the first time you publish your project. In this article, you create a function app and related Azure resources.

[!INCLUDE [Publish the project to Azure](../../includes/functions-vstools-publish.md)]

## Verify your function in Azure

1. In Cloud Explorer, your new function app should be selected. If not, expand your subscription > **App Services**, and select your new function app.

1. Right-click the function app and choose **Open in Browser**. This opens the root of your function app in your default web browser and displays the page that indicates your function app is running.

    :::image type="content" source="media/functions-create-your-first-function-visual-studio/function-app-running-azure-v4.png" alt-text="Function app running":::

1. In the address bar in the browser, append the string `/api/HttpExample?name=Functions` to the base URL and run the request.

    The URL that calls your HTTP trigger function is in the following format:

    `http://<APP_NAME>.azurewebsites.net/api/HttpExample?name=Functions`

1. Go to this URL and you see a response in the browser to the remote GET request returned by the function, which looks like the following example:

    :::image type="content" source="media/functions-create-your-first-function-visual-studio/functions-create-your-first-function-visual-studio-browser-azure.png" alt-text="Function response in the browser":::

## Clean up resources

*Resources* in Azure refer to function apps, functions, storage accounts, and so forth. They're grouped into *resource groups*, and you can delete everything in a group by deleting the group.

You created Azure resources to complete this quickstart. You may be billed for these resources, depending on your [account status](https://azure.microsoft.com/account/) and [service pricing](https://azure.microsoft.com/pricing/). Other quickstarts in this collection build upon this quickstart. If you plan to work with subsequent quickstarts, tutorials, or with any of the services you've created in this quickstart, don't clean up the resources.

[!INCLUDE [functions-vstools-cleanup](../../includes/functions-vstools-cleanup.md)]

## Next steps

In this quickstart, you used Visual Studio to create and publish a C# function app in Azure with a simple HTTP trigger function.

To learn more about working with C# functions that run in an isolated worker process, see the [Guide for running C# Azure Functions in an isolated worker process](dotnet-isolated-process-guide.md). Check out [.NET supported versions](functions-dotnet-class-library.md#supported-versions) to see other versions of supported .NET versions in an isolated worker process.

Advance to the next article to learn how to add an Azure Storage queue binding to your function:
> [!div class="nextstepaction"]
> [Add an Azure Storage queue binding to your function](functions-add-output-binding-storage-queue-vs.md?tabs=isolated-process)


