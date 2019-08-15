---
title: Guidance for developing Azure Functions | Microsoft Docs
description: Learn the Azure Functions concepts and techniques that you need to develop functions in Azure, across all programming languages and bindings.
services: functions
documentationcenter: na
author: ggailey777
manager: jeconnoc
keywords: developer guide, azure functions, functions, event processing, webhooks, dynamic compute, serverless architecture

ms.assetid: d8efe41a-bef8-4167-ba97-f3e016fcd39e
ms.service: azure-functions
ms.devlang: multiple
ms.topic: reference
ms.date: 10/12/2017
ms.author: glenga

---
# Azure Functions developers guide
In Azure Functions, specific functions share a few core technical concepts and components, regardless of the language or binding you use. Before you jump into learning details specific to a given language or binding, be sure to read through this overview that applies to all of them.

This article assumes that you've already read the [Azure Functions overview](functions-overview.md).

## Function code
A *function* is the primary concept in Azure Functions. A function contains two important pieces - your code, which can be written in a variety of languages, and some config, the function.json file. For compiled languages, this config file is generated automatically from annotations in your code. For scripting languages, you must provide the config file yourself.

The function.json file defines the function's trigger, bindings, and other configuration settings. Every function has one and only one trigger. The runtime uses this config file to determine the events to monitor and how to pass data into and return data from a function execution. The following is an example function.json file.

```json
{
    "disabled":false,
    "bindings":[
        // ... bindings here
        {
            "type": "bindingType",
            "direction": "in",
            "name": "myParamName",
            // ... more depending on binding
        }
    ]
}
```

The `bindings` property is where you configure both triggers and bindings. Each binding shares a few common settings and some settings which are specific to a particular type of binding. Every binding requires the following settings:

| Property | Values/Types | Comments |
| --- | --- | --- |
| `type` |string |Binding type. For example, `queueTrigger`. |
| `direction` |'in', 'out' |Indicates whether the binding is for receiving data into the function or sending data from the function. |
| `name` |string |The name that is used for the bound data in the function. For C#, this is an argument name; for JavaScript, it's the key in a key/value list. |

## Function app
A function app provides an execution context in Azure in which your functions run. A function app is comprised of one or more individual functions that are managed, deployed, and scaled together. All of the functions in a function app share the same pricing plan, continuous deployment and runtime version. Think of a function app as a way to organize and collectively manage your functions. 

> [!NOTE]
> All functions in a function app must be authored in the same language. In [previous versions](functions-versions.md) of the Azure Functions runtime, this wasn't required.

## Folder structure
[!INCLUDE [functions-folder-structure](../../includes/functions-folder-structure.md)]

The above is the default (and recommended) folder structure for a Function app. If you wish to change the file location of a function's code, modify the `scriptFile` section of the _function.json_ file. We also recommend using [package deployment](deployment-zip-push.md) to deploy your project to your function app in Azure. You can also use existing tools like [continuous integration and deployment](functions-continuous-deployment.md) and Azure DevOps.

> [!NOTE]
> If deploying a package manually, make sure to deploy your _host.json_ file and function folders directly to the `wwwroot` folder. Do not include the `wwwroot` folder in your deployments. Otherwise, you end up with `wwwroot\wwwroot` folders.

#### Use local tools and publishing
Function apps can be authored and published using a variety of tools, including [Visual Studio](./functions-develop-vs.md), [Visual Studio Code](functions-create-first-function-vs-code.md), [IntelliJ](./functions-create-maven-intellij.md), [Eclipse](./functions-create-maven-eclipse.md), and the [Azure Functions Core Tools](./functions-develop-local.md). For more information, see [Code and test Azure Functions locally](./functions-develop-local.md).

<!--NOTE: I've removed documentation on FTP, because it does not sync triggers on the consumption plan --glenga -->

## <a id="fileupdate"></a> How to edit functions in the Azure portal
The Functions editor built into the Azure portal lets you update your code and your *function.json* file directly inline. This is recommended only for small changes or proofs of concept - best practice is to use a local development tool like VS Code.

## Parallel execution
When multiple triggering events occur faster than a single-threaded function runtime can process them, the runtime may invoke the function multiple times in parallel.  If a function app is using the [Consumption hosting plan](functions-scale.md#how-the-consumption-and-premium-plans-work), the function app could scale out automatically.  Each instance of the function app, whether the app runs on the Consumption hosting plan or a regular [App Service hosting plan](../app-service/overview-hosting-plans.md), might process concurrent function invocations in parallel using multiple threads.  The maximum number of concurrent function invocations in each function app instance varies based on the type of trigger being used as well as the resources used by other functions within the function app.

## Functions runtime versioning

You can configure the version of the Functions runtime using the `FUNCTIONS_EXTENSION_VERSION` app setting. For example, the value "~2" indicates that your Function App will use 2.x as its major version. Function Apps are upgraded to each new minor version as they are released. For more information, including how to view the exact version of your function app, see [How to target Azure Functions runtime versions](set-runtime-version.md).

## Repositories
The code for Azure Functions is open source and stored in GitHub repositories:

* [Azure Functions](https://github.com/Azure/Azure-Functions)
* [Azure Functions host](https://github.com/Azure/azure-functions-host/)
* [Azure Functions portal](https://github.com/azure/azure-functions-ux)
* [Azure Functions templates](https://github.com/azure/azure-functions-templates)
* [Azure WebJobs SDK](https://github.com/Azure/azure-webjobs-sdk/)
* [Azure WebJobs SDK Extensions](https://github.com/Azure/azure-webjobs-sdk-extensions/)

## Bindings
Here is a table of all supported bindings.

[!INCLUDE [dynamic compute](../../includes/functions-bindings.md)]

Having issues with errors coming from the bindings? Review the [Azure Functions Binding Error Codes](functions-bindings-error-pages.md) documentation.

## Reporting Issues
[!INCLUDE [Reporting Issues](../../includes/functions-reporting-issues.md)]

## Next steps
For more information, see the following resources:

* [Azure Functions triggers and bindings](functions-triggers-bindings.md)
* [Code and test Azure Functions locally](./functions-develop-local.md)
* [Best Practices for Azure Functions](functions-best-practices.md)
* [Azure Functions C# developer reference](functions-dotnet-class-library.md)
* [Azure Functions NodeJS developer reference](functions-reference-node.md)
