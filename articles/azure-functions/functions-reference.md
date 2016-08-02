<properties
	pageTitle="Azure Functions developer reference | Microsoft Azure"
	description="Understand Azure Functions concepts and components that are common to all languages and bindings."
	services="functions"
	documentationCenter="na"
	authors="christopheranderson"
	manager="erikre"
	editor=""
	tags=""
	keywords="azure functions, functions, event processing, webhooks, dynamic compute, serverless architecture"/>

<tags
	ms.service="functions"
	ms.devlang="multiple"
	ms.topic="reference"
	ms.tgt_pltfrm="multiple"
	ms.workload="na"
	ms.date="05/13/2016"
	ms.author="chrande"/>

# Azure Functions developer reference

Azure Functions share a few core technical concepts and components, regardless of the language or binding you use. Before you jump into learning details specific to a given language or binding, be sure to read through this overview that applies to all of them.

This article assumes that you've already read the [Azure Functions overview](functions-overview.md) and are familiar with [WebJobs SDK concepts such as triggers, bindings, and the JobHost runtime](../app-service-web/websites-dotnet-webjobs-sdk.md). Azure Functions is based on the WebJobs SDK. 

## function

A *function* is the primary concept in Azure Functions. You write code for a function in a language of your choice and save the code file(s) and a configuration file in the same folder. Configuration is in JSON, and the file is named `function.json`. A variety of languages are supported, and each one has a slightly different experience optimized to work best for that language. Sample folder structure:

```
mynodefunction
| - function.json
| - index.js
| - node_modules
| | - ... packages ...
| - package.json
mycsharpfunction
| - function.json
| - run.csx
```

## function.json and bindings

The `function.json` file contains configuration specific to a function, including its bindings. The runtime reads this file to determine which events to trigger off of, which data to include when calling the function, and where to send data passed along from the function itself. 

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

You can prevent the runtime from running the function by setting the `disabled` property to `true`.

The `bindings` property is where you configure both triggers and bindings. Each binding shares a few common settings and some settings which are specific to a particular type of binding. Every binding requires the following settings:

|Property|Values/Types|Comments|
|---|-----|------|
|`type`|string|Binding type. For example, `queueTrigger`.
|`direction`|'in', 'out'| Indicates whether the binding is for receiving data into the function or sending data from the function.
| `name` | string | The name that will be used for the bound data in the function. For C# this will be an argument name; for JavaScript it will be the key in a key/value list.

## Runtime (script host and web host)

The runtime, otherwise known as the script host, is the underlying WebJobs SDK host which listens for events, gathers and sends data, and ultimately runs your code. 

To facilitate HTTP triggers, there is also a web host which is designed to sit in front of the script host in production scenarios. This helps to isolate the script host from the front end traffic managed by the web host.

## Folder Structure

A script host points to a folder that contains a configuration file and one or more functions.

```
parentFolder (for example, wwwroot in a function app)
 | - host.json
 | - mynodefunction
 | | - function.json
 | | - index.js
 | | - node_modules
 | | | - ... packages ...
 | | - package.json
 | - mycsharpfunction
 | | - function.json
 | | - run.csx
```

The *host.json* file contains some script host specific configuration and sits in the parent folder. For information on settings that are available, see [host.json](https://github.com/Azure/azure-webjobs-sdk-script/wiki/host.json) in the WebJobs.Script repository wiki.

Each function has a folder that contains code file(s), *function.json*, and other dependencies.

When setting up a project for deploying functions to a function app in Azure App Service, you can treat this folder structure as your site code. You can use existing tools like continuous integration and deployment, or custom deployment scripts for doing deploy time package installation or code transpilation.

## <a id="fileupdate"></a> How to update function app files

The function editor built into the Azure portal lets you update the *function.json* file and the code file for a function. To upload or update other files such as *package.json* or *project.json* or dependencies, you have to use other deployment methods.

Function apps are built on App Service, so all of the [deployment options available to standard web apps](../app-service-web/web-sites-deploy.md) are available for function apps as well. Here are some methods you can use to upload or update function app files. 

#### To use Visual Studio Online (Monaco)

1. In the Azure Functions portal, click **Function app settings**.

2. In the **Advanced Settings** section, click **Go to App Service Settings**.

3. Click **Tools**.

4. Under **Develop**, click **Visual Studio Online**.

5. Turn it **On** if it is not already enabled, and click **Go**.

	After Visual Studio Online loads, you'll see the *host.json* file and function folders under *wwwroot*. 

6. Open files to edit them, or drag and drop from your development machine to upload files.

#### To use the function app's SCM (Kudu) endpoint

1. Navigate to: `https://<function_app_name>.scm.azurewebsites.net`.

2. Click **Debug Console > CMD**.

3. Navigate to `D:\home\site\wwwroot\` to update *host.json* or `D:\home\site\wwwroot\<function_name>` to update a function's files.

4. Drag-and-drop a file you want to upload into the appropriate folder in the file grid. There are two areas in the file grid where you can drop a file. For *.zip* files, a box appears with the label "Drag here to upload and unzip." For other file types, drop in the file grid but outside the "unzip" box.

#### To use FTP

1. Follow the instructions [here](../app-service-web/web-sites-deploy.md#ftp) to get FTP configured.

2. When you're connected to the function app site, copy an updated *host.json* file to `/site/wwwroot` or copy function files to `/site/wwwroot/<function_name>`.

## Parallel execution

When multiple triggering events occur faster than a single-threaded function runtime can process them, the runtime may invoke the function multiple times in parallel.  If a function app is using the [Dynamic Service Plan](functions-scale.md#dynamic-service-plan), the function app could scale out automatically up to 10 concurrent instances.  Each instance of the function app, whether the app runs on the Dynamic Service Plan or a regular [App Service Plan](../app-service/azure-web-sites-web-hosting-plans-in-depth-overview.md), might process concurrent function invocations in parallel using multiple threads.  The maximum number of concurrent function invocations in each function app instance varies based on the memory size of the function app.

## Azure Functions Pulse  

Pulse is a live event stream which shows how often your function runs, as well as successes and failures. You can also monitor your average execution time. We’ll be adding more features and customization to it over time. You can access the **Pulse** page from the **Monitoring** tab.

## Repositories

The code for Azure Functions is open source and stored in GitHub repositories:

* [Azure Functions runtime](https://github.com/Azure/azure-webjobs-sdk-script/)
* [Azure Functions portal](https://github.com/projectkudu/AzureFunctionsPortal)
* [Azure Functions templates](https://github.com/Azure/azure-webjobs-sdk-templates/)
* [Azure WebJobs SDK](https://github.com/Azure/azure-webjobs-sdk/)
* [Azure WebJobs SDK Extensions](https://github.com/Azure/azure-webjobs-sdk-extensions/)

## Bindings

Here is a table of all supported bindings.

[AZURE.INCLUDE [dynamic compute](../../includes/functions-bindings.md)]

## Reporting Issues

[AZURE.INCLUDE [Reporting Issues](../../includes/functions-reporting-issues.md)] 

## Next steps

For more information, see the following resources:

* [Azure Functions C# developer reference](functions-reference-csharp.md)
* [Azure Functions NodeJS developer reference](functions-reference-node.md)
* [Azure Functions triggers and bindings](functions-triggers-bindings.md)
* [Azure Functions: The Journey](https://blogs.msdn.microsoft.com/appserviceteam/2016/04/27/azure-functions-the-journey/) on the Azure App Service team blog. A history of how Azure Functions was developed.





