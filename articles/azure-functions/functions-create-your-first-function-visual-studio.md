---
title: Create your first Azure Function using the Azure Functions Tools for Visual Studio 
description: Create an Azure Function using Azure Functions Tools for Visual Studio. 
services: functions
documentationcenter: functions
author: rachelappel
manager: erikre
editor: ''
tags: ''
keywords: azure functions, functions, event processing, compute, serverless architecture

ms.assetid: 
ms.service: functions
ms.devlang: multiple
ms.topic: ms-hero
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 05/01/2017
ms.author: rachelap

---
# Create your first Azure Function using the Azure Functions Tools for Visual Studio 

In this tutorial, you will learn how to create an Azure Function app using *Functions Core Tools* for Visual Studio.

## Create a new Azure Functions App project in Visual Studio

1. Open Visual Studio and launch the *New Project* dialog.
2. Click *Visual C#* > *Cloud* from the list of templates on the left, then click *Azure Functions*. 
3. Type a name for your function app, select a location, and click *Ok*.

![Create a new Azure Function](./media/functions-create-your-first-function-visual-studio/functions-vstools-new-project.png)

Visual Studio will create a project containing an *appsettings.json* and *host.json* file. You now must create one or more Azure functions for your Function App.

## Create a new Azure Function

Once you have created your function app, you must add individual functions to it. 

1. Click File > Add > New File or Right mouse click on the project in Solution Explorer and click *Add* > *New Item*. 
2. Choose *Azure Function* from the dialog box.

![Create a new Azure Function](./media/functions-create-your-first-function-visual-studio/functions-vstools-add-new-function.png)

A new dialog will appear giving you more options.

4. Select *QueueTrigger* and provide the following information in the next dialog box:
  * A unique function name. The function's name is the same name that will appear in the portal. If the function is an HTTP trigger function, it also defines the default route.
  * The name of the storage account connection. 
  * The path for accessing items in the queue. 

![Create a new Azure Function](./media/functions-create-your-first-function-visual-studio/functions-vstools-add-new-function-2.png)

You may be asked for different information, such as which storage account or queue you want to use when selecting other project templates.

Note: All triggers except the HTTP trigger require setting *AzureWebJobsStorage*, because internally the runtime creates queues to schedule work.  

Visual Studio creates the following assets:

* *host.json* : A file for host customizations.
* *local.settings.json* : A file containing local settings for the Functions Core Tools.

You can view the files in *Solution Explorer*.

## Review the function's bindings

The *function.json* file contains settings for the trigger, as well as input and output bindings, and other information. 

```json
{
  "bindings": [
    {
      "type": "queueTrigger",
      "queueName": "myqueue-items",
      "connection": "AzureWebJobsStorage",
      "direction": "in",
      "name": "myQueueItem"
    }
  ],
  "disabled": false,
  "scriptFile": "..\\FunctionApp1.dll",
  "entryPoint": "FunctionApp1.Function1.Run"
}
```

## Review the function's code

In the *run.cs* file is the function's code. Since this function is a queue triggered function, there is a string argument representing the queued item. All functions contain an argument of type *TraceWriter* that you can use for logging purposes.

```csharp
using System;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;

namespace FunctionApp1
{
    public static class Function1
    {
        [FunctionName("QueueTriggerCSharp")]        
        public static void Run([QueueTrigger("myqueue-items", Connection = "AzureWebJobsStorage")]string myQueueItem, TraceWriter log)
        {
            log.Info($"C# Queue trigger function processed: {myQueueItem}");
        }
    }
}
```

## Test the function 

Just as you would with other Visual Studio projects, you can use the built-in debugging tools to test your function.

1. Click *Start* > *Debug* or press *F5* to run the application. Notice that Visual Studio launches a command window that prepares a local environment in which to test your function. To test your HTTP Trigger: 

![Azure local runtime](./media/functions-create-your-first-function-visual-studio/functions-vstools-f5.png)

When you run the function, notice that the build process creates a *function.json* file with the required bindings for the function's trigger, input, and output bindings.  Visual Studio creates the *function.json* file from the attributes applied to the `Run` method in your code. In the previous example, the bindings are defined in the `HttpTrigger` attribute.

2. Obtain the endpoint for your function by examining the output of the functions runtime. You will see a local address, port, and path. 
3. Open a browser and navigate to the function's HTTP endpoint. Verify that the function works.

To stop debugging, click the *Stop* button on the Visual Studio toolbar, or click *Debug* > *Stop Debugging*.

## Publish the function to Azure

1. Click the *Build* menu, then select *Publish* to launch the *Publish* dialog box. Alternatively, you can right mouse click on the project in *Solution Explorer* and select *Publish* from the context menu.
2. Select *Azure Function App* as your publish target.
3. Choose *Create New* to publish this as a new function in a new Function App, or choose *Select existing* to publish this function to a Function App that is already deployed to Azure.
4. Click the *Publish* button.
5. Fill in the following fields:

| Field | Value |
|---|---|
| Function App Name | The function's name. This must be unique.  |
| Subscription | The MSDN subscription that this function will be published under. |
| Resource Group | The Azure resource group to contain the function. |
| App Service Plan | The function's App Service plan.  |
| Storage Account | The storage account for the function. |

6. Verify that your function has been published by logging into the Azure portal and reviewing the function.

## Next steps

For more information about Azure Functions, see the following topics:

[!INCLUDE [Getting help note](../../includes/functions-get-help.md)]

[!INCLUDE [functions-quickstart-next-steps](../../includes/functions-quickstart-next-steps.md)]
