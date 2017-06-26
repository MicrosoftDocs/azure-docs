---
title: Develop Azure Functions using Visual Studio  | Microsoft Docs
description: Learn how to develop and test Azure Functions by using Azure Functions Tools for Visual Studio 2017.
services: functions
documentationcenter: .net
author: ggailey777  
manager: erikre
editor: ''

ms.service: functions
ms.workload: na
ms.tgt_pltfrm: dotnet
ms.devlang: na
ms.topic: article
ms.date: 06/23/2017
ms.author: glenga, donnam
---
# Azure Functions Tools for Visual Studio  

Azure Functions Tools for Visual Studio 2017 is an extension for Visual Studio that lets you develop, test, and deploy C# functions to Azure. If this is your first experience with Azure Functions, you can learn more at [An introduction to Azure Functions](functions-overview.md).

The Azure Functions Tools provides the following benefits: 

* Edit, build, and run functions on your local development computer. 
* Publish your Azure Functions project directly to Azure. 
* Use WebJobs attributes to declare function bindings directly in the C# code instead of maintaining a separate function.json for binding definitions.
* Develop and deploy pre-compiled C# functions. Pre-complied functions provide a better cold-start performance than C# script-based functions. 
* Code your functions in C# while having all of the benefits of Visual Studio development. 

This topic shows you how to use the Azure Functions Tools for Visual Studio 2017 to develop your functions in C#. You also learn how to publish your project to Azure as a .NET assembly.

## Prerequisites

Before you install Azure Functions Tools, you must have installed [Visual Studio 2017 Preview version 15.3](https://www.visualstudio.com/vs/preview/), including one of the following workloads:

* Azure development
* ASP.NET and web development

To create and deploy functions, you also need:

* An active Azure subscription. If you don't have an Azure subscription, [free accounts](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) are available.

* An Azure Storage account. To create a storage account, see [Create a storage account](../storage/storage-create-storage-account.md#create-a-storage-account).  

## Install the Azure Functions Tools

You can [download and install the extension package](https://marketplace.visualstudio.com/vsgallery/e3705d94-7cc3-4b79-ba7b-f43f30774d28), or use the following steps to install it from Visual Studio.  

[!INCLUDE [Install the Azure Functions Tools for Visual Studio](../../includes/functions-install-vstools.md)] 


## Create an Azure Functions project 

[!INCLUDE [Install the Azure Functions Tools for Visual Studio](../../includes/functions-vstools-create.md)]


## Configure the project for local development

When you create a new project using the Azure Functions template, you get an empty C# project that contains the following files:

* **host.json**: Lets you configure the Functions host. These settings apply both when running locally and in Azure. For more information, see [host.json](https://github.com/Azure/azure-webjobs-sdk-script/wiki/host.json) reference article.
    
* **local.settings.json**: Maintains settings used when running functions locally. These settings are not used by Azure, they are used by the Azure Functions Core Tools. Use this file to specify settings, such as connection strings to other Azure services. Add a new key to the **Values** array for each connection required by functions in your project. 

The Functions runtime uses an Azure Storage account internally. For all trigger types other than HTTP and webhooks, you must set the **Values.AzureWebJobsStorage** key to a valid Azure Storage account connection string. To set the storage account connection string:

1. In the [Azure portal](https://portal.azure.com/), navigate to your storage account, click **All settings** > **Access keys**, then copy the **Connection string** for one of your keys. 

2. In your project in Visual Studio, open the local.settings.json project file and set the value of the **AzureWebJobsStorage** key to the connection string you copied.

3. Repeat the previous step to add unique keys to the **Values** array for any other connections required by your functions.  

## Create a function

In pre-compiled functions, the bindings used by the function are defined by applying attributes in the code. When you use the Azure Functions Tools to create your functions from the provided templates, these attributes are applied for you. 

1. In **Solution Explorer**, right-click on your project node and select **Add** > **New Item**. Select **Azure Function**, type a **Name** for the class, and click **Add**.

2. Choose your trigger, set the binding properties, and click **Create**. The following example shows the settings when creating a Queue storage triggered function. 

    ![](./media/functions-develop-vs/functions-vstools-create-queuetrigger.png)
    
    A connection string key named **QueueStorage** is supplied, which is defined in the local.settings.json file. The class name 
 
3. Examine the newly added class. You see a static **Run** method, that is attributed with the **FunctionName** attribute. This attribute indicates that the method is the entry point for the function. 

    For example, the following C# class represents a basic Queue storage triggered function:

    ````csharp
    using System;
    using Microsoft.Azure.WebJobs;
    using Microsoft.Azure.WebJobs.Host;
    
    namespace FunctionApp1
    {
        public static class Function1
        {
            [FunctionName("QueueTriggerCSharp")]        
            public static void Run([QueueTrigger("myqueue-items", Connection = "QueueStorage")]string myQueueItem, TraceWriter log)
            {
                log.Info($"C# Queue trigger function processed: {myQueueItem}");
            }
        }
    } 
    ````
 
    A binding-specific attribute is applied to each binding parameter supplied to the entry point method. The attribute takes the binding information as parameters. In the previous example, The first parameter has a **QueueTrigger** attribute applied, indicating queue triggered function. The queue name and connection string setting name are passed as parameters.  

## Testing functions

[!INCLUDE [Test the function locally](../../includes/functions-vstools-test.md)]

With the project running, you can test your code as you would test deployed function. For more information, see [Strategies for testing your code in Azure Functions](functions-test-a-function.md). When running in debug mode, breakpoints are hit in Visual Studio as expected. 

For an example of how to test a queue triggered function, see the [queue triggered function quickstart tutorial](functions-create-storage-queue-triggered-function.md#test-the-function).  

To learn more about using the Azure Functions Core Tools, see [Code and test Azure functions locally](functions-run-local.md).

## Publish to Azure

[!INCLUDE [Publish the project to Azure](../../includes/functions-vstools-publish.md)]

## Next steps

For more information about Azure Functions Tools, see the Common Questions section of the [Visual Studio 2017 Tools for Azure Functions](https://blogs.msdn.microsoft.com/webdev/2017/05/10/azure-function-tools-for-visual-studio-2017/) blog post.

To learn more about the Azure Functions Core Tools, see [Code and test Azure functions locally](functions-run-local.md).