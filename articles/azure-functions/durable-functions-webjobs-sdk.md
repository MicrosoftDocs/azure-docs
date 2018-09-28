---
title: How to run durable functions as WebJobs - Azure
description: Learn how to code and configure Durable Functions to run in WebJobs by using the WebJobs SDK.
services: functions
author: ggailey777
manager: jeconnoc
keywords:
ms.service: azure-functions
ms.devlang: multiple
ms.topic: conceptual
ms.date: 04/25/2018
ms.author: azfuncdf
---

# How to run durable functions as WebJobs

[Azure Functions](functions-overview.md) and the [Durable Functions](durable-functions-overview.md) extension are built on the [WebJobs SDK](../app-service/web-sites-create-web-jobs.md). The `JobHost` in the WebJobs SDK is the runtime in Azure Functions. If you need to control `JobHost` behavior in ways not possible in Azure Functions, you can develop and run durable functions by using the WebJobs SDK yourself. You can then run your durable functions in an Azure WebJob or anywhere a console application runs.

The chaining Durable Functions sample is available in a WebJobs SDK version: download or clone the [Durable Functions repository](https://github.com/azure/azure-functions-durable-extension/) and navigate to the *samples\\webjobssdk\\chaining* folder.

## Prerequisites

This article assumes you're familiar with the basics of the WebJobs SDK, C# class library development for Azure Functions, and Durable Functions. If you need an introduction to these topics, see the following resources:

* [Get started with the WebJobs SDK](../app-service/webjobs-sdk-get-started.md)
* [Create your first function using Visual Studio](functions-create-your-first-function-visual-studio.md)
* [Durable Functions](durable-functions-sequence.md)

To complete the steps in this article:

* [Install Visual Studio 2017 version 15.6 or later](https://docs.microsoft.com/visualstudio/install/) with the **Azure development** workload.

  If you already have Visual Studio but don't have that workload, add the workload by selecting **Tools > Get Tools and Features**. 

  (You can use [Visual Studio Code](https://code.visualstudio.com/) instead, but some of the instructions are specific to Visual Studio.)

* Install and run [Azure Storage Emulator](../storage/common/storage-use-emulator.md) version 5.2 or later. An alternative is to update the *App.config* file with an Azure Storage connection string.

## WebJobs SDK versions

This article explains how to develop a WebJobs SDK 2.x project (equivalent to Azure Functions version 1.x). For information about version 3.x, see [WebJobs SDK 3.x](#webjobs-sdk-3x) later in this article. 

## Create console app

A WebJobs SDK project is just a console app project with the appropriate NuGet packages installed.

In the Visual Studio **New Project** dialog, select **Windows Classic Desktop > Console App (.NET Framework)**. In the project file, the `TargetFrameworkVersion` should be `v4.6.1`.

Visual Studio also has a WebJob project template, which you can use by selecting **Cloud > Azure WebJob (.NET Framework)**. This template installs many packages, some of which you might not need.

## Install NuGet packages

You need NuGet packages for the WebJobs SDK, core bindings, the logging framework, and the Durable Task extension. Here are **Package Manager Console** commands for those packages, with latest stable version numbers as of the date this article was written:

```powershell
Install-Package Microsoft.Azure.WebJobs.Extensions -version 2.2.0
Install-Package Microsoft.Extensions.Logging -version 2.0.1
Install-Package Microsoft.Azure.WebJobs.Extensions.DurableTask -version 1.4.0
```

You also need logging providers. The following commands install the Application Insights provider and the `ConfigurationManager`. The `ConfigurationManager` lets you get the Application Insights instrumentation key from app settings.

```powershell
Install-Package Microsoft.Azure.WebJobs.Logging.ApplicationInsights -version 2.2.0
Install-Package System.Configuration.ConfigurationManager -version 4.4.1
```

The following command installs the console provider:

```powershell
Install-Package Microsoft.Extensions.Logging.Console -version 2.0.1
```

## JobHost code

To use the Durable Functions extension, call `UseDurableTask` on the `JobHostConfiguration` object in your `Main` method:

```cs
var config = new JobHostConfiguration();
config.UseDurableTask(new DurableTaskExtension
{
    HubName = "MyTaskHub",
};
```

For a list of properties that you can set in the `DurableTaskExtension` object, see [host.json](functions-host-json.md#durabletask).

The `Main` method is also the place to set up logging providers. The following example configures console and Application Insights providers.

```cs
static void Main(string[] args)
{
    using (var loggerFactory = new LoggerFactory())
    {
        var config = new JobHostConfiguration();

        config.DashboardConnectionString = "";

        var instrumentationKey =
            ConfigurationManager.AppSettings["APPINSIGHTS_INSTRUMENTATIONKEY"];

        config.LoggerFactory = loggerFactory
            .AddApplicationInsights(instrumentationKey, null)
            .AddConsole();

        config.UseTimers();
        config.UseDurableTask(new DurableTaskExtension
        {
            HubName = "MyTaskHub",
        });
        var host = new JobHost(config);
        host.RunAndBlock();
    }
}
```

## Functions

There are a few differences in the code you write for WebJobs SDK functions compared to what you write for the Azure Functions service.

The WebJobs SDK doesn't support the following Azure Functions features:

* [FunctionName attribute](#functionname-attribute)
* [HTTP trigger](#http-trigger)
* [Durable Functions HTTP management API](#http-management-api)

### FunctionName attribute

In a WebJobs SDK project, the method name of a function is the function name. The `FunctionName` attribute is used only in Azure Functions.

### HTTP trigger

The WebJobs SDK does not have an HTTP trigger. The sample project's orchestration client uses a timer trigger:

```cs
public static async Task CronJob(
    [TimerTrigger("0 */2 * * * *")] TimerInfo timer,
    [OrchestrationClient] DurableOrchestrationClient client,
    ILogger logger)
{
  ...
}
```

### HTTP management API

Because it has no HTTP trigger, the WebJobs SDK has no [HTTP management API](durable-functions-http-api.md).

In a WebJobs SDK project, you can call methods on the orchestration client object instead of sending HTTP requests. The following methods correspond to the three tasks you can do with the HTTP management API:

* `GetStatusAsync`
* `RaiseEventAsync`
* `TerminateAsync`

The orchestration client function in the sample project starts the orchestrator function and then goes into a loop that calls `GetStatusAsync` every 2 seconds:

```cs
string instanceId = await client.StartNewAsync(nameof(HelloSequence), input: null);
logger.LogInformation($"Started new instance with ID = {instanceId}.");

DurableOrchestrationStatus status;
while (true)
{
    status = await client.GetStatusAsync(instanceId);
    logger.LogInformation($"Status: {status.RuntimeStatus}, Last update: {status.LastUpdatedTime}.");

    if (status.RuntimeStatus == OrchestrationRuntimeStatus.Completed ||
        status.RuntimeStatus == OrchestrationRuntimeStatus.Failed ||
        status.RuntimeStatus == OrchestrationRuntimeStatus.Terminated)
    {
        break;
    }

    await Task.Delay(TimeSpan.FromSeconds(2));
}
```

## Run the sample

This section provides an overview of how to run the [sample project](https://github.com/Azure/azure-functions-durable-extension/tree/master/samples/webjobssdk/chaining). For detailed instructions that explain how to run a WebJobs SDK project locally and deploy it to an Azure WebJob, see [Get started with the WebJobs SDK](../app-service/webjobs-sdk-get-started.md#deploy-as-a-webjob).

### Run locally

1. Make sure the Storage emulator is running (see [Prerequisites](#prerequisites)).

1. If you want to see logs in Application Insights when you run locally:

  a. Create an Application Insights resource, app type **General**.

  b. Save the instrumentation key in the *App.config* file.

1. Run the project.

### Run in Azure

1. Create a web app and a storage account.

1. In the web app, save the Storage connection string in an app setting named AzureWebJobsStorage.

1. Create an Application Insights resource, app type **General**.

1. Save the instrumentation key in an app setting named APPINSIGHTS_INSTRUMENTATIONKEY.

1. Deploy as a WebJob.

## WebJobs SDK 3.x

The main change introduced by 3.x is the use of .NET Core instead of .NET Framework. To create a 3.x project the instructions are the same, with these exceptions:

1. Create a .NET Core console app. In the Visual Studio **New Project** dialog, select  **.NET Core > Console App (.NET Core)**. The project file specifies that `TargetFramework` is `netcoreapp2.0`.

1. Choose the prerelease version 3.x of the following packages:

  * `Microsoft.Azure.WebJobs.Extensions`
  * `Microsoft.Azure.WebJobs.Logging.ApplicationInsights`

1. Change `Main` method code to get the Storage connection string and the Application Insights instrumentation key from an *appsettings.json* file, using the .NET Core configuration framework.  Here's an example:

   ```cs
   static void Main(string[] args)
   {
       var builder = new ConfigurationBuilder()
           .SetBasePath(Directory.GetCurrentDirectory())
           .AddJsonFile("appsettings.json");

       var appSettingsConfig = builder.Build();

       using (var loggerFactory = new LoggerFactory())
       {
           var config = new JobHostConfiguration();

           config.DashboardConnectionString = "";
           config.StorageConnectionString = 
               appSettingsConfig.GetConnectionString("AzureWebJobsStorage");
           var instrumentationKey =
               appSettingsConfig["APPINSIGHTS_INSTRUMENTATIONKEY"];

           config.LoggerFactory = loggerFactory
               .AddApplicationInsights(instrumentationKey, null)
               .AddConsole();

           config.UseTimers();
           config.UseDurableTask(new DurableTaskExtension
           {
               HubName = "MyTaskHub",
           });
           var host = new JobHost(config);
           host.RunAndBlock();
       }
   }
   ```

## Next steps

To learn more about the WebJobs SDK, see [How to use the WebJobs SDK](../app-service/webjobs-sdk-how-to.md).

