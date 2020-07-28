---
title: "Quickstart: Create your first function in Azure using Visual Studio"
description: In this quickstart, you learn how to create and publish an HTTP trigger Azure Function by using Visual Studio.
ms.assetid: 82db1177-2295-4e39-bd42-763f6082e796
ms.topic: quickstart
ms.date: 03/06/2020
ms.custom: mvc, devcenter, vs-azure, 23113853-34f2-4f
---
# Quickstart: Create your first function in Azure using Visual Studio

In this article, you use Visual Studio to create a C# class library-based function that responds to HTTP requests. After testing the code locally, you deploy it to the serverless environment of Azure Functions.  

Completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.

## Prerequisites

To complete this tutorial, first install [Visual Studio 2019](https://azure.microsoft.com/downloads/). Ensure you select the **Azure development** workload during installation. If you want to create an Azure Functions project by using Visual Studio 2017 instead, you must first install the [latest Azure Functions tools](functions-develop-vs.md#check-your-tools-version).

![Install Visual Studio with the Azure development workload](media/functions-create-your-first-function-visual-studio/functions-vs-workloads.png)

If you don't have an [Azure subscription](../guides/developer/azure-developer-guide.md#understanding-accounts-subscriptions-and-billing), create a [free account](https://azure.microsoft.com/free/dotnet/) before you begin.

## Create a function app project

[!INCLUDE [Create a project using the Azure Functions template](../../includes/functions-vstools-create.md)]

Visual Studio creates a project and class that contains boilerplate code for the HTTP trigger function type. The boilerplate code sends an HTTP response that includes a value from the request body or query string. The `HttpTrigger` attribute specifies that the function is triggered by an HTTP request. 

## Rename the function

The `FunctionName` method attribute sets the name of the function, which by default is generated as `Function1`. Since the tooling doesn't let you override the default function name when you create your project, take a minute to create a better name for the function class, file, and metadata.

1. In **File Explorer**, right-click the Function1.cs file and rename it to `HttpExample.cs`.

1. In the code, rename the Function1 class to `HttpExample'.

1. In the `HttpTrigger` method named `Run`, rename the `FunctionName` method attribute to `HttpExample`.

Now that you've renamed the function, you can test it on your local computer.

## Run the function locally

Visual Studio integrates with Azure Functions Core Tools so that you can test your functions locally using the full Azure Functions runtime.  

[!INCLUDE [functions-run-function-test-local-vs](../../includes/functions-run-function-test-local-vs.md)]

After you've verified that the function runs correctly on your local computer, it's time to publish the project to Azure.

## Publish the project to Azure

Before you can publish your project, you must have a function app in your Azure subscription. Visual Studio publishing creates a function app for you the first time you publish your project.

[!INCLUDE [Publish the project to Azure](../../includes/functions-vstools-publish.md)]

## Test your function in Azure

1. In Cloud Explorer, your new function app should be selected. If not, expand your subscription > **App Services**, and select your new function app.

1. Right-click the function app and choose **Open in Browser**. This opens the root of your function app in your default web browser and displays the page that indicates your function app is running. 

    :::image type="content" source="media/functions-create-your-first-function-visual-studio/function-app-running-azure.png" alt-text="Function app running":::

1. In the address bar in the browser, append the string `/api/HttpExample?name=Functions` to the base URL and run the request.

    The URL that calls your HTTP trigger function is in the following format:

    `http://<APP_NAME>.azurewebsites.net/api/HttpExample?name=Functions`

2. Go to this URL and you see a response in the browser to the remote GET request returned by the function, which looks like the following example:

    :::image type="content" source="media/functions-create-your-first-function-visual-studio/functions-create-your-first-function-visual-studio-browser-azure.png" alt-text="Function response in the browser":::

## Clean up resources

Other quickstarts in this collection build upon this quickstart. If you plan to work with subsequent quickstarts, tutorials, or with any of the services you have created in this quickstart, do not clean up the resources.

*Resources* in Azure refer to function apps, functions, storage accounts, and so forth. They're grouped into *resource groups*, and you can delete everything in a group by deleting the group. 

You created resources to complete these quickstarts. You may be billed for these resources, depending on your [account status](https://azure.microsoft.com/account/) and [service pricing](https://azure.microsoft.com/pricing/). If you don't need the resources anymore, here's how to delete them:

1. In the Cloud Explorer, expand your subscription > **App Services**, right-click your function app, and choose **Open in Portal**. 

1. In the function app page, select the **Overview** tab and then select the link under **Resource group**.

   :::image type="content" source="media/functions-create-your-first-function-visual-studio/functions-app-delete-resource-group.png" alt-text="Select the resource group to delete from the function app page":::

2. In the **Resource group** page, review the list of included resources, and verify that they're the ones you want to delete.
 
3. Select **Delete resource group**, and follow the instructions.

   Deletion may take a couple of minutes. When it's done, a notification appears for a few seconds. You can also select the bell icon at the top of the page to view the notification.

## Next steps

In this quickstart, you used Visual Studio to create and publish a C# function app in Azure with a simple HTTP trigger function. 

Advance to the next article to learn how to add an Azure Storage queue binding to your function:
> [!div class="nextstepaction"]
> [Add an Azure Storage queue binding to your function](functions-add-output-binding-storage-queue-vs.md)

