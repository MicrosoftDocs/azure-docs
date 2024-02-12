---
author: mattchenderson
ms.service: azure-functions
ms.topic: include
ms.date: 07/31/2023
ms.author: mahender
---

Update your project to reference the latest stable version of [Microsoft.NET.Sdk.Functions](https://www.nuget.org/packages/Microsoft.NET.Sdk.Functions).

Depending on the triggers and bindings your app uses, your app may need to reference an additional set of packages. See [Supported bindings](../articles/azure-functions/functions-triggers-bindings.md#supported-bindings) for a list of extensions to consider, and consult each extension's documentation for full installation instructions for the in-process process model. Be sure to install the latest stable version of any packages you are targeting.

> [!TIP]
> Your app may also depend on Azure SDK types, either as part of your triggers and bindings or as a standalone dependency. You should take this opportunity to upgrade these as well. The latest versions of the Functions extensions work with the latest versions of the [Azure SDK for .NET](/dotnet/azure/sdk/azure-sdk-for-dotnet), almost all of the packages for which are the form `Azure.*`.
