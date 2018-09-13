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
