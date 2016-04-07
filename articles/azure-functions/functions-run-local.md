<properties
	pageTitle="Develop and run Azure functions locally | Microsoft Azure"
	description="Learn how to code and test Azure functions in Visual Studio before running them in Azure App Service."
	services="functions"
	documentationCenter="na"
	authors="tdykstra"
	manager="wpickett"
	editor=""/>

<tags
	ms.service="functions"
	ms.workload="na"
	ms.tgt_pltfrm="multiple"
	ms.devlang="multiple"
	ms.topic="article"
	ms.date="03/22/2016"
	ms.author="tdykstra"/>

# How to code and test Azure functions in Visual Studio

## Overview

[Azure Functions](functions-overview.md) are easy to code and test in the Azure portal, but sometimes it's useful to work with them locally before running in Azure. For example, some of the languages that Azure Functions supports are easier to write code for in Visual Studio because it provides [IntelliSense](https://msdn.microsoft.com/library/hcw1s69b.aspx). 

This article explains how to run functions locally by downloading the [WebJobs.Script](https://github.com/Azure/azure-webjobs-sdk-script/) project and running the Visual Studio solution it contains.

The runtime for Azure Functions is an implementation of the WebJobs.Script open source project. WebJobs.Script is in turn built on the [Azure WebJobs SDK](../app-service-web/websites-dotnet-webjobs-sdk.md). Both frameworks can run locally, except you do need to connect to an Azure storage account. The WebJobs SDK uses storage account features that the storage emulator doesn't support.

## Prerequisites

### An Azure account with a function app

This article assumes that you have worked with [Azure Functions](function-overview.md) in the portal and are familiar with Azure Functions concepts such as [triggers, bindings, and JobHost](functions-reference).

When you run functions locally, you get some output in the console window, but you'll also want to use the dashboard that is hosted by a live function app to view function invocations and logs.

### Visual Studio 2015 with the latest Azure SDK for .NET

If you have an earlier version of the SDK, or if you don't have Visual Studio 2015, [download the latest Azure SDK for Visual Studio 2015](http://go.microsoft.com/fwlink/?linkid=518003). Visual Studio 2015 is automatically installed with the SDK if you don't already have it.

## Conditional prerequisites

Some Azure resources and software installations are required only if you plan to run functions that use them, for example:  

* Azure resources
	* Service Bus
	* Easy Tables
	* DocumentDB
	* Event Hubs
	* Notification Hubs

* Compilers and script engines
	* F#
	* BASH
	* Python
	* PHP

For details about these requirements, including environment variables that you have to set for them, see the [wiki pages for the azure-webjobs-sdk-script repository](https://github.com/Azure/azure-webjobs-sdk-script/wiki/home)

If your purpose is to contribute to the WebJobs.SDK project, you need all of the conditional prerequisites to run complete tests.

## To run locally

1. Clone or download the [azure-webjobs-sdk-script](https://github.com/Azure/azure-webjobs-sdk-script/) repository.

2. Set environment variables for storage connection strings.

	* AzureWebJobsStorage
	* AzureWebJobsDashboard

	You can get these values from the App Service **Application Settings** portal blade for a function app.

	a. On the **Function app** blade, click **Function app settings**. 

	b. On the **Function App Settings** blade, click **Go to App Service Settings**.

	c. On the **Settings** blade, click **Application settings**.

	d. On the **Application settings** blade, scroll down to the **App settings** section.

	e. Set an environment variable with the same name and value as the `AzureWebJobsStorage` app setting.

	f. Do the same for the `AzureWebJobsDashboard` app setting.

3. Make sure any other environment variables that you need are set. (See preceding **Conditional prerequisites** section).

4. Start Visual Studio, and then open the WebJobs.Script solution.

6. Set the startup project. If you want to run functions that use HTTP or WebHook triggers, choose **WebJobs.Script.WebHost**; otherwise, choose **WebJobs.Script.Host**.

	To run HTTP or WebHook functions, you'll need to get or set API keys. For an example of how to do that, see the [App_Data/secrets](https://github.com/Azure/azure-webjobs-sdk-script/tree/master/src/WebJobs.Script.WebHost/App_Data/secrets) folder in the WebJobs.Script.WebHost project.   

4. In the **Debug** tab of the **Project Properties** window for the WebJobs.Script.Host project, set **Command line arguments** to `..\..\..\..\sample`. 

	This is a relative path to the *sample* folder in the repository.	The *sample* folder contains a *host.json* file that contains global settings, and a folder for each sample function. 

	To get started it's easiest to use the *sample* folder that's provided. Later you can add your own functions to the *sample* folder or use any folder that contains a *host.json* and function folders.

5. If your startup project is WebJobs.Script.WebHost, set an AzureWebJobsScriptRoot environment variable to the full path to the `sample` folder.

5. Open the *sample\host.json* file, and add a `functions` property to specify which functions you want to run.

	For example, the following JSON will make the WebJobs SDK JobHost look for only two functions. 

		{
		  "functions": [ "TimerTrigger-CSharp", "QueueTrigger-CSharp"],
		  "id": "5a709861cab44e68bfed5d2c2fe7fc0c"
		}

	When you use your own folder instead of the *sample* folder, include in it only the functions that you want to run. Then you can omit the `functions` property in *host.json*.
 
6. Build and run the solution.

	The console window shows that the JobHost only finds the functions specified in the `host.json` file. 

		Found the following functions:
		Host.Functions.QueueTrigger-CSharp
		Host.Functions.TimerTrigger-CSharp
		Job host started

7. Go to the dashboard for your function app to see function invocations.

	The dashboard is at the following URL:

		https://{function app name}.scm.azurewebsites.net/azurejobs/#/functions

	Note that it might take several minutes for function invocations to appear on the dashboard.

## Troubleshooting

Environment variable changes done while Visual Studio is running aren't picked up automatically. If you added or changed an environment variable after starting Visual Studio, shut down Visual Studio and restart it to make sure it is picking up the current values.

## Next steps

For more information about how to write code for Azure Functions, see [Azure Functions Developer Reference](functions-reference.md).
