---
title: Azure Functions runtime versions overview
description: Azure Functions supports multiple versions of the runtime. Learn the differences between them and how to choose the one that's right for you.
services: functions
documentationcenter: 
author: ggailey777
manager: jeconnoc

ms.service: azure-functions
ms.topic: conceptual
ms.date: 10/03/2018
ms.author: glenga

---
# Azure Functions runtime versions overview

 There are two major versions of the Azure Functions runtime: 1.x and 2.x. The current version where new feature work and improvements are being made is 2.x, though both are supported for production scenarios.  The following details some of the differences between the two, how you can create each version, and upgrade from 1.x to 2.x.

> [!NOTE]
> This article refers to the cloud service Azure Functions. For information about the preview product that lets you run Azure Functions on-premises, see the [Azure Functions Runtime Overview](functions-runtime-overview.md).

## Cross-platform development

The version 2.x runtime runs on .NET Core 2, which enables it to run on all platforms supported by .NET Core, including macOS and Linux. Running on .NET Core enables cross-platform development and hosting scenarios.

By comparison, the version 1.x runtime only supports development and hosting in the Azure portal or on Windows computers.

## Languages

The version 2.x runtime uses a new language extensibility model. In version 2.x, all functions in a function app must share the same language. The language of functions in a function app is chosen when creating the app.

Azure Functions 1.x experimental languages won't be updated to use the new model, so they aren't supported in 2.x. The following table indicates which programming languages are currently supported in each runtime version.

[!INCLUDE [functions-supported-languages](../../includes/functions-supported-languages.md)]

For more information, see [Supported languages](supported-languages.md).

## <a name="creating-1x-apps"></a>Run on version 1.x

By default, function apps created in the Azure portal are set to version 2.x. When possible, you should use this runtime version, where new feature investments are being made. If you need to, you can still run a function app on the version 1.x runtime. You can only change the runtime version after you create your function app but before you add any functions. To learn how to pin the runtime version to 1.x, see [View and update the current runtime version](set-runtime-version.md#view-and-update-the-current-runtime-version).

## Migrating from 1.x to 2.x

You may choose to migrate an existing app written to use the version 1.x runtime to instead use version 2.x. Most of the changes you need to make are related to changes in the language runtime, such as C# API changes between .NET Framework 4.7 and .NET Core 2. You'll also need to make sure your code and libraries are compatible with the language runtime you choose. Finally, be sure to note any changes in trigger, bindings, and features highlighted below. For the best migration results, you should create a new function app for version 2.x and port your existing version 1.x function code to the new app.  

### Changes in triggers and bindings

Version 2.x requires you to install the extensions for specific triggers and bindings used by the functions in your app. The only exception for this HTTP and timer triggers, which don't require an extension.  For more information, see [Register and install binding extensions](./functions-triggers-bindings.md#register-binding-extensions).

There have also been a few changes in the `function.json` or attributes of the function between versions. For example, the Event Hub `path` property is now `eventHubName`. See the [existing binding table](#bindings) for links to documentation for each binding.

### Changes in features and functionality

A few features that have also been removed, updated, or replaced in the new version. This section details the changes you see in version 2.x after having used version 1.x.

In version 2.x, the following changes were made:

* Keys for calling HTTP endpoints are always stored encrypted in Azure Blob storage. In version 1.x, keys were stored in Azure File storage be default. When upgrading an app from version 1.x to version 2.x, existing secrets that are in file storage are reset.

* The version 2.x runtime doesn't include built-in support for webhook providers. This change was made to improve performance. You can still use HTTP triggers as endpoints for webhooks.

* The host configuration file (host.json) should be empty or have the string `"version": "2.0"`.

* To improve monitoring, the WebJobs dashboard in the portal, which used the [`AzureWebJobsDashboard`](functions-app-settings.md#azurewebjobsdashboard) setting is replaced with Azure Application Insights, which uses the [`APPINSIGHTS_INSTRUMENTATIONKEY`](functions-app-settings.md#appinsightsinstrumentationkey) setting. For more information, see [Monitor Azure Functions](functions-monitoring.md).

* All functions in a function app must share the same language. When you create a function app, you must choose a runtime stack for the app. The runtime stack is specified by the [`FUNCTIONS_WORKER_RUNTIME`](functions-app-settings.md#functionsworkerruntime) value in application settings. This requirement was added to improve footprint and startup time. When developing locally, you must also include this setting in the [local.settings.json file](functions-run-local.md#local-settings-file).

* The default timeout for functions in an App Service plan is changed to 30 minutes. You can manually change the timeout back to unlimited by using the [functionTimeout](functions-host-json.md#functiontimeout) setting in host.json.

* HTTP concurrency throttles are implemented by default for consumption plan functions, with a default of 100 concurrent requests per instance. You can change this in the [`maxConcurrentRequests`](functions-host-json.md#http) setting in the host.json file.

* Because of [.NET core limitations](https://github.com/Azure/azure-functions-host/issues/3414), support for F# script (.fsx) functions has been removed. Compiled F# functions (.fs) are still supported.

* The URL format of Event Grid trigger webhooks has been changed to `https://{app}/runtime/webhooks/{triggerName}`.

### Migrating a locally developed application

You may have existing function app projects that you developed locally using the version 1.x runtime. To upgrade to version 2.x, you should create a local function app project against version 2.x and port your existing code into the new app. You could manually update the existing project and code, a sort of "in-place" upgrade. However, there are a number of other improvements between version 1.x and version 2.x that you may still need to make. For example, in C# the debugging object was changed from `TraceWriter` to `ILogger`. By creating a new version 2.x project, you start off with updated functions based on the latest version 2.x templates.

#### Visual Studio runtime versions

In Visual Studio, you select the runtime version when you create a project. Azure Functions tools for Visual Studio supports both major runtime versions. The correct version is used when debugging and publishing based on project settings. The version settings are defined in the `.csproj` file in the following properties:

##### Version 1.x

```xml
<TargetFramework>net461</TargetFramework>
<AzureFunctionsVersion>v1</AzureFunctionsVersion>
```

##### Version 2.x

```xml
<TargetFramework>netstandard2.0</TargetFramework>
<AzureFunctionsVersion>v2</AzureFunctionsVersion>
```

When you debug or publish your project, the correct version of the runtime is used.

#### VS Code and Azure Functions Core Tools

[Azure Functions Core Tools](functions-run-local.md) is used for command line development and also by the [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) for Visual Studio Code. To develop against  version 2.x, install version 2.x of the Core Tools. Version 1.x development requires version 1.x of the Core Tools. For more information, see [Install the Azure Functions Core Tools](functions-run-local.md#install-the-azure-functions-core-tools).

For Visual Studio Code development, you may also need to update the user setting for the `azureFunctions.projectRuntime` to match the version of the tools installed.  This setting also updates the templates and languages used during function app creation.

### Changing version of apps in Azure

The version of the Functions runtime used by published apps in Azure is dictated by the [`FUNCTIONS_EXTENSION_VERSION`](functions-app-settings.md#functionsextensionversion) application setting. A value of `~2` targets the version 2.x runtime and `~1` targets the version 1.x runtime. Don't arbitrarily change this setting, because other app setting changes and code changes in your functions are likely required. To learn about the recommended way to migrate your function app to a different runtime version, see [How to target Azure Functions runtime versions](set-runtime-version.md).

## Bindings

The version 2.x runtime uses a new [binding extensibility model](https://github.com/Azure/azure-webjobs-sdk-extensions/wiki/Binding-Extensions-Overview) that offers these advantages:

* Support for third-party binding extensions.

* Decoupling of runtime and bindings. This change allows binding extensions to be versioned and released independently. You can, for example, opt to upgrade to a version of an extension that relies on a newer version of an underlying SDK.

* A lighter execution environment, where only the bindings in use are known and loaded by the runtime.

With the exception of HTTP and timer triggers, all bindings must be explicitly added to the function app project, or registered in the portal. For more information, see [Register binding extensions](functions-triggers-bindings.md#register-binding-extensions).

The following table shows which bindings are supported in each runtime version.

[!INCLUDE [Full bindings table](../../includes/functions-bindings.md)]

## Next steps

For more information, see the following resources:

* [Code and test Azure Functions locally](functions-run-local.md)
* [How to target Azure Functions runtime versions](set-runtime-version.md)
* [Release notes](https://github.com/Azure/azure-functions-host/releases)
