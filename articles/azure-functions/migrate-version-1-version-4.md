---
title: Migrate apps from Azure Functions version 1.x to 4.x 
description: This article shows you how to upgrade your exsisting function apps running on version 1.x of the Azure Functions runtime to be able to run on version 4.x of the runtime. 
ms.service: azure-functions
ms.topic: how-to 
ms.date: 10/19/2022
ms.custom: template-how-to-pattern 
---

# Migrate apps from Azure Functions version 1.x to version 4.x 

If you are running on version 1.x of the Azure Functions runtime, it's likely because your C# app requires .NET Framework 2.1. Version 4.x of the runtime now lets you run .NET Framework 4.8 apps. At this point, you should consider migrating your version 1.x function apps to run on version 4.x.   

Migrating a C# function app from version 1.x (.NET Framework 2.1) to version 4.x (.NET Framework 4.8) requires you to make changes to your project code. Many of these changes are a result of changes in the core C# language and .NET APIs. This article guides you through how to update your C# function app project to be able to run on .NET Framework 4.8 in Functions version 4.x.    

>[!NOTE]
>When running on .NET Framework 4.8, C# apps must run in an isolated worker process. For more information, see [Guide for running C# Azure Functions in an isolated process](dotnet-isolated-process-guide.md).

Migrating from version 1.x to version 4.x also has impact on bindings. If you are migrating a JavaScript app, proceed directly to [General changes after version 1.x](#general-changes-after-version-1x). 

## Prepare the C# project for migration

The following sections let you compare C# code, project files, and behaviors between versions. This comparison makes it easier for you to prepare your application for migration. 

Use the tabs to switch between the following versions for comparison: 

+ **Version 1.x**: the current version of your C# app that requires .NET Framework 2.1. 

+ **Version 4.x**: migrated C# project code that requires .NET Framework 4.8. 

+ **.NET 7**:  C# project migrated to run on .NET 7 instead of .NET Framework 4.8. This migration is recommended when your migrated app no longer requires .NET Framework 4.8 APIs.

When applicable, these tabs compare the code directly from the templates for each version. 

### .csproj file

The following highlight the changes required in the .csproj file when moving from version 1.x to version 4.x, or directly to .NET 7.

# [Version 1.x](#tab/v1)

Complete project file for version 1.x:

:::code language="csharp" source="~/functions-quickstart-templates-v1/Functions.Templates/ProjectTemplate/Company.FunctionApp.csproj":::

# [Version 4.x](#tab/v4)

Update `PropertyGroup`:

```xml
<AzureFunctionsVersion>v4</AzureFunctionsVersion> 
```

Update `ItemGroup`:

:::code language="csharp" source="~/functions-quickstart-templates/Functions.Templates/ProjectTemplate_v4.x/CSharp-Isolated/Company.FunctionApp.csproj" range="12-15":::

Add new `ItemGroup`:

:::code language="csharp" source="~/functions-quickstart-templates/Functions.Templates/ProjectTemplate_v4.x/CSharp-Isolated/Company.FunctionApp.csproj" range="31-33":::

# [.NET 7](#tab/net7)

Update `PropertyGroup`:

```xml
<TargetFramework>TargetFrameworkValue</TargetFramework>
<AzureFunctionsVersion>AzureFunctionsVersionValue</AzureFunctionsVersion> 
<OutputType>Exe</OutputType>
<ImplicitUsings>enable</ImplicitUsings>
<Nullable>enable</Nullable>
```

Update `ItemGroup`:

:::code language="csharp" source="~/functions-quickstart-templates/Functions.Templates/ProjectTemplate_v4.x/CSharp-Isolated/Company.FunctionApp.csproj" range="12-15":::

Add new `ItemGroup`:

:::code language="csharp" source="~/functions-quickstart-templates/Functions.Templates/ProjectTemplate_v4.x/CSharp-Isolated/Company.FunctionApp.csproj" range="26-28":::

---

### program.cs file

# [Version 1.x](#tab/v1)

Not required in version 1.x.

# [Version 4.x](#tab/v4)

:::code language="csharp" source="~/functions-quickstart-templates/Functions.Templates/ProjectTemplate_v4.x/CSharp-Isolated/Program.cs" range="2-20":::

# [.NET 7](#tab/net7)

:::code language="csharp" source="~/functions-quickstart-templates/Functions.Templates/ProjectTemplate_v4.x/CSharp-Isolated/Program.cs" range="23-29":::

---

### host.json file

# [Version 1.x](#tab/v1)

:::code language="csharp" source="~/functions-quickstart-templates-v1/Functions.Templates/ProjectTemplate/host.json":::

# [Version 4.x](#tab/v4)

:::code language="csharp" source="~/functions-quickstart-templates/Functions.Templates/ProjectTemplate_v4.x/CSharp-Isolated/host.json":::

# [.NET 7](#tab/net7)

:::code language="csharp" source="~/functions-quickstart-templates//Functions.Templates/ProjectTemplate_v4.x/CSharp-Isolated/host.json":::

---

### local.settings.json file

# [Version 1.x](#tab/v1)

:::code language="csharp" source="~/functions-quickstart-templates-v1/Functions.Templates/ProjectTemplate/local.settings.json":::

# [Version 4.x](#tab/v4)

:::code language="csharp" source="~/functions-quickstart-templates/Functions.Templates/ProjectTemplate_v4.x/CSharp-Isolated/local.settings.json":::

# [.NET 7](#tab/net7)

:::code language="csharp" source="~/functions-quickstart-templates/Functions.Templates/ProjectTemplate_v4.x/CSharp-Isolated/local.settings.json":::

---

## General changes after version 1.x

This section details changes made after versionk 1.x in both trigger and binding behaviors as well as in core Functions features and behaviors.

## Changes in triggers and bindings

Starting with version 2.x, you must install the extensions for specific triggers and bindings used by the functions in your app. The only exception for this HTTP and timer triggers, which don't require an extension.  For more information, see [Register and install binding extensions](./functions-bindings-register.md).

There are also a few changes in the *function.json* or attributes of the function between versions. For example, the Event Hubs `path` property is now `eventHubName`. See the [existing binding table](functions-versions.md#bindings) for links to documentation for each binding.

## Changes in features and functionality

A few features were removed, updated, or replaced after version 1.x. This section details the changes you see in later versions after having used version 1.x.

In version 2.x, the following changes were made:

* Keys for calling HTTP endpoints are always stored encrypted in Azure Blob storage. In version 1.x, keys were stored in Azure Files by default. When you upgrade an app from version 1.x to version 2.x, existing secrets that are in Azure Files are reset.

* The version 2.x runtime doesn't include built-in support for webhook providers. This change was made to improve performance. You can still use HTTP triggers as endpoints for webhooks.

* The host configuration file (host.json) should be empty or have the string `"version": "2.0"`.

* To improve monitoring, the WebJobs dashboard in the portal, which used the [`AzureWebJobsDashboard`](functions-app-settings.md#azurewebjobsdashboard) setting is replaced with Azure Application Insights, which uses the [`APPINSIGHTS_INSTRUMENTATIONKEY`](functions-app-settings.md#appinsights_instrumentationkey) setting. For more information, see [Monitor Azure Functions](functions-monitoring.md).

* All functions in a function app must share the same language. When you create a function app, you must choose a runtime stack for the app. The runtime stack is specified by the [`FUNCTIONS_WORKER_RUNTIME`](functions-app-settings.md#functions_worker_runtime) value in application settings. This requirement was added to improve footprint and startup time. When developing locally, you must also include this setting in the [local.settings.json file](functions-develop-local.md#local-settings-file).

* The default timeout for functions in an App Service plan is changed to 30 minutes. You can manually change the timeout back to unlimited by using the [functionTimeout](functions-host-json.md#functiontimeout) setting in host.json.

* HTTP concurrency throttles are implemented by default for Consumption plan functions, with a default of 100 concurrent requests per instance. You can change this behavior in the [`maxConcurrentRequests`](functions-host-json.md#http) setting in the host.json file.

* Because of [.NET Core limitations](https://github.com/Azure/azure-functions-host/issues/3414), support for F# script (`.fsx` files) functions has been removed. Compiled F# functions (.fs) are still supported.

* The URL format of Event Grid trigger webhooks has been changed to follow this pattern: `https://{app}/runtime/webhooks/{triggerName}`.


## Next steps
TODO: Add your next step link(s)

<!--
Remove all the comments in this template before you sign-off or merge to the main branch.
-->