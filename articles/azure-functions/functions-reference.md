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

This article assumes that you've already read the [Azure Functions overview](functions-overview.md) and are familiar with [WebJobs SDK concepts such as triggers, bindings, and the JobHost runtime](https://github.com/Azure/azure-webjobs-sdk/wiki). Azure Functions is based on the WebJobs SDK. 

## Function code
A *function* is the primary concept in Azure Functions. You write code for a function in a language of your choice and save the code and configuration files in the same folder. The configuration is named `function.json`, which contains JSON configuration data. Various languages are supported, and each one has a slightly different experience optimized to work best for that language. 

The function.json file defines the function bindings and other configuration settings. The runtime uses this file to determine the events to monitor and how to pass data into and return data from function execution. The following is an example function.json file.

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

Set the `disabled` property to `true` to prevent the function from being executed.

The `bindings` property is where you configure both triggers and bindings. Each binding shares a few common settings and some settings, which are specific to a particular type of binding. Every binding requires the following settings:

| Property | Values/Types | Comments |
| --- | --- | --- |
| `type` |string |Binding type. For example, `queueTrigger`. |
| `direction` |'in', 'out' |Indicates whether the binding is for receiving data into the function or sending data from the function. |
| `name` |string |The name that is used for the bound data in the function. For C#, this is an argument name; for JavaScript, it's the key in a key/value list. |

## Function app
A function app provides an execution context in Azure in which your functions run. A function app is comprised of one or more individual functions that are managed together by Azure App Service. All of the functions in a function app share the same pricing plan, continuous deployment and runtime version. Think of a function app as a way to organize and collectively manage your functions. 

> [!NOTE]
> Starting with [version 2.x](functions-versions.md) of the Azure Functions runtime, all functions in a function app must be authored in the same language.

## Runtime
The Azure Functions runtime, or script host, is the underlying host that listens for events, gathers and sends data, and ultimately runs your code. This same host is used by the WebJobs SDK.

There is also a web host that handles HTTP trigger requests for the runtime. Having two hosts helps to isolate the runtime from the front end traffic managed by the web host.

## Folder structure
[!INCLUDE [functions-folder-structure](../../includes/functions-folder-structure.md)]

When setting-up a project for deploying functions to a function app in Azure, you can treat this folder structure as your site code. We recommend using [package deployment](deployment-zip-push.md) to deploy your project to your function app in Azure. You can also use existing tools like [continuous integration and deployment](functions-continuous-deployment.md) and Azure DevOps.

> [!NOTE]
> Make sure to deploy your `host.json` file and function folders directly to the `wwwroot` folder. Do not include the `wwwroot` folder in your deployments. Otherwise, you end up with `wwwroot\wwwroot` folders.

## <a id="fileupdate"></a> How to update function app files
The function editor built into the Azure portal lets you update the *function.json* file and the code file for a function. To upload or update other files such as *package.json* or *project.json* or dependencies, you have to use other deployment methods.

Function apps are built on App Service, so all the [deployment options available to standard web apps](../app-service/app-service-deploy-local-git.md) are also available for function apps. Here are some methods you can use to upload or update function app files. 

#### Use local tools and publishing
Function apps can be authored and published using various tools, including [Visual Studio](./functions-develop-vs.md), [Visual Studio Code](functions-create-first-function-vs-code.md), [IntelliJ](./functions-create-maven-intellij.md), [Eclipse](./functions-create-maven-eclipse.md), and the [Azure Functions Core Tools](./functions-develop-local.md). For more information, see [Code and test Azure Functions locally](./functions-develop-local.md).

<!--NOTE: I've removed documentation on FTP, because it does not sync triggers on the consumption plan --glenga -->

#### Continuous deployment
Follow the instructions in the topic [Continuous deployment for Azure Functions](functions-continuous-deployment.md).

## Parallel execution
When multiple triggering events occur faster than a single-threaded function runtime can process them, the runtime may invoke the function multiple times in parallel.  If a function app is using the [Consumption hosting plan](functions-scale.md#how-the-consumption-plan-works), the function app could scale out automatically.  Each instance of the function app, whether the app runs on the Consumption hosting plan or a regular [App Service hosting plan](../app-service/azure-web-sites-web-hosting-plans-in-depth-overview.md), might process concurrent function invocations in parallel using multiple threads.  The maximum number of concurrent function invocations in each function app instance varies based on the type of trigger being used as well as the resources used by other functions within the function app.

## Functions runtime versioning

You can configure the version of the Functions runtime using the `FUNCTIONS_EXTENSION_VERSION` app setting. For example, the value "~2" indicates that your Function App will use 2.x as its major version. Function Apps are upgraded to each new minor version as they are released. For more information, including how to view the exact version of your function app, see [How to target Azure Functions runtime versions](set-runtime-version.md).

## Repositories
The code for Azure Functions is open source and stored in GitHub repositories:

* [Azure Functions runtime](https://github.com/Azure/azure-webjobs-sdk-script/)
* [Azure Functions portal](https://github.com/projectkudu/AzureFunctionsPortal)
* [Azure Functions templates](https://github.com/Azure/azure-webjobs-sdk-templates/)
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

* [Best Practices for Azure Functions](functions-best-practices.md)
* [Azure Functions C# developer reference](functions-reference-csharp.md)
* [Azure Functions F# developer reference](functions-reference-fsharp.md)
* [Azure Functions NodeJS developer reference](functions-reference-node.md)
* [Azure Functions triggers and bindings](functions-triggers-bindings.md)
* [Azure Functions: The Journey](https://blogs.msdn.microsoft.com/appserviceteam/2016/04/27/azure-functions-the-journey/) on the Azure App Service team blog. A history of how Azure Functions was developed.

