---
title: Azure Functions runtime versions overview
description: Azure Functions supports multiple versions of the runtime. Learn the differences between them and how to choose the one that's right for you.
services: functions
documentationcenter: 
author: ggailey777
manager: jeconnoc

ms.service: azure-functions
ms.topic: conceptual
ms.date: 07/29/2018
ms.author: glenga

---
# Azure Functions runtime versions overview

 There are two major versions of the Azure Functions runtime: 1.x and 2.x. Only 1.x is approved for production use. This article explains what's new in 2.x, which is in preview.

| Runtime | Status |
|---------|---------|
|1.x|Generally Available (GA)|
|2.x|Preview<sup>*</sup>|

<sup>*</sup>To receive important updates on version 2.x, including breaking changes announcements, watch the [Azure App Service announcements](https://github.com/Azure/app-service-announcements/issues) repository.

> [!NOTE] 
> This article refers to the cloud service Azure Functions. For information about the product that lets you run Azure Functions on-premises, see the [Azure Functions Runtime Overview](functions-runtime-overview.md).

## Cross-platform development

Runtime 1.x supports development and hosting only in the portal or on Windows. Runtime 2.x runs on .NET Core, which means it can run on all platforms supported by .NET Core, including macOS and Linux. This enables cross-platform development and hosting scenarios that aren't possible with 1.x.

## Languages

Runtime 2.x uses a new language extensibility model. Initially, JavaScript and Java are taking advantage of this new model. Azure Functions 1.x experimental languages haven't been updated to use the new model, so they are not supported in 2.x. The following table indicates which programming languages are supported in each runtime version.

[!INCLUDE [functions-supported-languages](../../includes/functions-supported-languages.md)]

For more information, see [Supported languages](supported-languages.md).

## Migrating from 1.x to 2.x

You may wish to move an existing app written in 1.x to 2.x.  Most of the considerations required in moving between versions are related to the language runtime changes listed above (for example C# moving from .NET Framework 4.7 to .NET Core 2).  You'll need to make sure your code and libraries are compatible with the language runtimes being used.

### Changes in triggers and bindings

While most of the trigger and binding properties and configurations remain the same between versions, in 2.x you will need to install any trigger or binding to the app. The only exception for this is HTTP and Timer triggers.  See [Register and install binding extensions](./functions-triggers-bindings.md#register-binding-extensions).  Note that there may also be changes in the `function.json` or attributes of the function between versions (for example, CosmosDB `connection` property is now `ConnectionStringSetting`).  Reference the [existing binding table](#bindings) for links to documentation for each binding.

### Upgrading a locally developed application

If your v1.x app was developed locally, you can make changes to the app or project to make it compatible with v2.  It is recommended to create a new app and port over the code to the new app.  While there are changes that could be made to an existing app to perform an in place upgrade, there are a number of other improvements between v1 and v2 that legacy code likely is not taking advantage of (for example in C# the change from `TraceWriter` to `ILogger`).  

There are also changes in required properties in application settings (`local.settings.json`) and `host.json` including:

* Application settings (`local.settings.json`) require a value for the property `FUNCTIONS_WORKER_RUNTIME` that maps to the language of the app `dotnet | node | java | python`.
* Host configuration (`host.json`) should either be empty or contain `version` of `2.0`.

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

## Known issues in 2.x

For more information about bindings support and other functional gaps in 2.x, see [Runtime 2.0 known issues](https://github.com/Azure/azure-webjobs-sdk-script/wiki/Azure-Functions-runtime-2.0-known-issues).

## Next steps

For more information, see the following resources:

* [Code and test Azure Functions locally](functions-run-local.md)
* [How to target Azure Functions runtime versions](set-runtime-version.md)
* [Release notes](https://github.com/Azure/azure-functions-host/releases)
