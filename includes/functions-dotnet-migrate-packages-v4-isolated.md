---
author: mattchenderson
ms.service: azure-functions
ms.topic: include
ms.date: 07/31/2023
ms.author: mahender
---

Update your project to reference the latest stable versions of:
- [Microsoft.Azure.Functions.Worker](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker/)
- [Microsoft.Azure.Functions.Worker.Sdk](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Sdk/)

Depending on the triggers and bindings your app uses, your app may need to reference an additional set of packages. See [Supported bindings](../articles/azure-functions/functions-triggers-bindings.md#supported-bindings) for a list of extensions to consider, and consult each extension's documentation for full installation instructions for the isolated process model. The packages for these extensions will all be under the [Microsoft.Azure.Functions.Worker.Extensions](https://www.nuget.org/packages?q=Microsoft.Azure.Functions.Worker.Extensions) prefix. Be sure to install the latest stable version of any packages you are targeting.

**Your application should not reference any packages in the `Microsoft.Azure.WebJobs.*` namespaces.** If you have any remaining references to these, they should be removed.

> [!TIP]
> Your app may also depend on Azure SDK types, either as part of your triggers and bindings or as a standalone dependency. You should take this opportunity to upgrade these as well. The latest versions of the Functions extensions work with the latest versions of the [Azure SDK for .NET](/dotnet/azure/sdk/azure-sdk-for-dotnet), almost all of the packages for which are the form `Azure.*`.
