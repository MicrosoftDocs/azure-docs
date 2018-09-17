---
title: Azure Functions runtime versions overview
description: Azure Functions supports multiple versions of the runtime. Learn the differences between them and how to choose the one that's right for you.
services: functions
documentationcenter: 
author: ggailey777
manager: jeconnoc

ms.service: azure-functions
ms.topic: conceptual
ms.date: 09/14/2018
ms.author: glenga

---
# Azure Functions runtime versions overview

 There are two major versions of the Azure Functions runtime: 1.x and 2.x. The current version where new feature work and improvements are being made is 2.x, though both are supported for production scenarios.  The following details some of the differences between the two, how you can create each version, and upgrade from 1.x to 2.x.

> [!NOTE] 
> This article refers to the cloud service Azure Functions. For information about the preview product that lets you run Azure Functions on-premises, see the [Azure Functions Runtime Overview](functions-runtime-overview.md).

## Creating 1.x apps

New apps created in the Azure Portal are set to 2.x by default as this is the most current version and where new feature investments are being made.  However you can still create v1.x apps by doing the following.

1. Create an Azure Function from the Azure Portal
1. Open the created app, and while it is blank open up the **Function Settings**
1. Change the version from ~2 to ~1.  *This toggle will be disabled if you have functions in your app*.
1. Click save and restart the app.  All templates should now create and run in 1.x.

## Cross-platform development

Runtime 1.x supports development and hosting only in the portal or on Windows. Runtime 2.x runs on .NET Core 2, which means it can run on all platforms supported by .NET Core, including macOS and Linux. This enables cross-platform development and hosting scenarios.

## Languages

Runtime 2.x uses a new language extensibility model. In addition, to improve tooling and performance each app in 2.x is limited to only have functions in a single language. Currently supported languages in 2.x are C#, F#, JavaScript, Java, and Python. Azure Functions 1.x experimental languages haven't been updated to use the new model, so they are not supported in 2.x. The following table indicates which programming languages are supported in each runtime version.

[!INCLUDE [functions-supported-languages](../../includes/functions-supported-languages.md)]

For more information, see [Supported languages](supported-languages.md).

## Migrating from 1.x to 2.x

You may wish to move an existing app written in 1.x to 2.x.  Most of the considerations required in moving between versions are related to the language runtime changes listed above (for example C# moving from .NET Framework 4.7 to .NET Core 2).  You'll need to make sure your code and libraries are compatible with the language runtimes being used.  Also be sure to note any changes in trigger, bindings, and features highlighted below.

### Changes in triggers and bindings

While most of the trigger and binding properties and configurations remain the same between versions, in 2.x you will need to install any trigger or binding to the app. The only exception for this is HTTP and Timer triggers.  See [Register and install binding extensions](./functions-triggers-bindings.md#register-binding-extensions).  Note that there may also be changes in the `function.json` or attributes of the function between versions (for example, CosmosDB `connection` property is now `ConnectionStringSetting`).  Reference the [existing binding table](#bindings) for links to documentation for each binding.

### Changes in features available

In addition to changes in languages and bindings, there are some features that have been removed, updated, or replaced between versions.  Below are some of the main considerations to make when starting with 2.x after using 1.x.  In v2.x the following changes were made:

* Keys for calling a function will always be stored in encrypted blob storage. In 1.x by default they were in file storage and could be moved to blob if enabling features like slots.  If upgrading a 1.x app to 2.x and secrets are in file storage currently they will be reset.
* To improve performance, "webhook" type triggers are removed and replaced with "HTTP" triggers.
* Host configuration (`host.json`) should either be empty or contain `version` of `2.0` for one of the properties.
* To improve monitoring and observability, the WebJobs Dashboard (`AzureWebJobsDashboard`) is replaced with [Azure Application Insights](functions-monitoring.md) (`APPINSIGHTS_INSTRUMENTATIONKEY`)
* Application settings (`local.settings.json`) require a value for the property `FUNCTIONS_WORKER_RUNTIME` that maps to the language of the app `dotnet | node | java | python`.
    * To improve footprint and startup time, apps are limited to a single language. You can publish multiple apps to have functions in different languages for the same solution.
* Default timeout for functions in an app service plan is 30 minutes.  It can still be manually set to unlimited.
* [Due to .NET core limitiations](https://github.com/Azure/azure-functions-host/issues/3414), `.fsx` scripts for F# functions have been removed. Compiled F# functions are still supported.
* The format of webhook-based triggers (e.g. Event Grid) has changed to `https://{app}/runtime/webhooks/{triggerName}`

### Upgrading a locally developed application

If your v1.x app was developed locally, you can make changes to the app or project to make it compatible with v2.  It is recommended to create a new app and port over the code to the new app.  While there are changes that could be made to an existing app to perform an in place upgrade, there are a number of other improvements between v1 and v2 that legacy code likely is not taking advantage of (for example in C# the change from `TraceWriter` to `ILogger`).  

The recommended path is start from one of the v2 templates and move over code into a new project or app.

#### Visual Studio runtime versions

In Visual Studio you select the runtime version when you create a project.  Visual Studio has the bits for both major versions and can dynamically utilize the right one for the project.  These settings are derived from the `.csproj` file.  For 1.x apps the project has the properties

```xml
<TargetFramework>net461</TargetFramework>
<AzureFunctionsVersion>v1</AzureFunctionsVersion>
```

In v2 the project properties are

```xml
<TargetFramework>netstandard2.0</TargetFramework>
<AzureFunctionsVersion>v2</AzureFunctionsVersion>
```

Clicking debug or publish will correctly set the right version for the project settings.

#### VS Code and Azure Functions Core Tools

Other local tooling relies on the Azure Functions Core Tools.  Those tools are installed to the machine, and generally only one version is installed on a development machine at one time.  See [instructions how to install specific versions of the core tools](./functions-run-local.md).

For VS Code you may also need to update the user setting for the `azureFunctions.projectRuntime` to match the version of the tools installed.  This will also update the templates and languages surfaced during the creation of new apps.

### Changing version of apps in Azure

Published app versions are set through the application setting `FUNCTIONS_RUNTIME_VERSION`.  This is set to `~2` for v2 apps, and `~1` for v1 apps.  It is strongly discouraged to change the runtime version of an app that has existing functions published to it without also changing the code of those functions.  The recommended path is to create a new function app and set to the appropriate version, test changes, and then disable or delete the previous app.

## Bindings 

Runtime 2.x uses a new [binding extensibility model](https://github.com/Azure/azure-webjobs-sdk-extensions/wiki/Binding-Extensions-Overview) that offers these advantages:

* Support for third-party binding extensions.
* Decoupling of runtime and bindings. This allows binding extensions to be versioned and released independently. You can, for example, opt to upgrade to a version of an extension that relies on a newer version of an underlying SDK.
* A lighter execution environment, where only the bindings in use are known and loaded by the runtime.

All built-in Azure Functions bindings have adopted this model and are no longer included by default, except for the Timer trigger and the HTTP trigger. Those extensions are automatically installed when you create functions through tools like Visual Studio or through the portal.

The following table indicates which bindings are supported in each runtime version.

[!INCLUDE [Full bindings table](../../includes/functions-bindings.md)]

## Next steps

For more information, see the following resources:

* [Code and test Azure Functions locally](functions-run-local.md)
* [How to target Azure Functions runtime versions](set-runtime-version.md)
* [Release notes](https://github.com/Azure/azure-functions-host/releases)
