---
title: Register Azure Functions binding extensions
description: Learn to register an Azure Functions binding extension based on your environment.
services: functions
documentationcenter: na
author: craigshoemaker
manager: jeconnoc

ms.service: azure-functions
ms.devlang: multiple
ms.topic: reference
ms.date: 01/14/2019
ms.author: cshoe
---

# Register Azure Functions binding extensions

In some development environments, you must explicitly *register* a [binding](./functions-triggers-bindings.md). Binding extensions are provided in NuGet packages, and to register an extension you install the package. The following table indicates when and how you register binding extensions.

| Development environment |Registration<br/> in Functions 1.x  |Registration<br/> in Functions 2.x  |
|-------------------------|------------------------------------|------------------------------------|
|Azure portal|Automatic|[Automatic with prompt](#azure-portal-development)|
|Local using Azure Functions Core Tools|Automatic|[Use Core Tools CLI commands](#local-development-azure-functions-core-tools)|
|C# class library using Visual Studio 2017|[Use NuGet tools](#c-class-library-with-visual-studio-2017)|[Use NuGet tools](#c-class-library-with-visual-studio-2017)|
|C# class library using Visual Studio Code|N/A|[Use .NET Core CLI](#c-class-library-with-visual-studio-code)|

The following binding types are exceptions that don't require explicit registration because they are automatically registered in all versions and environments: HTTP and timer.

## Azure portal development

This section applies only to Functions 2.x. Binding extensions don't have to be explicitly registered in Functions 1.x.

When you create a function or add a binding, you are prompted when the extension for the trigger or binding requires registration. Respond to the prompt by clicking **Install** to register the extension. Installation can take up to 10 minutes on a consumption plan.

You need only install each extension one time for a given function app. For supported bindings that are not available in the portal or to update the an installed extension, you can also [manually install or update Azure Functions binding extensions from the portal](install-update-binding-extensions-manual.md).  

## Local development Azure Functions Core Tools

This section applies only to Functions 2.x. Binding extensions don't have to be explicitly registered in Functions 1.x.

[!INCLUDE [functions-core-tools-install-extension](../../includes/functions-core-tools-install-extension.md)]

<a name="local-csharp"></a>
### C# class library with Visual Studio 2017

In **Visual Studio 2017**, you can install packages from the Package Manager Console using the [Install-Package](https://docs.microsoft.com/nuget/tools/ps-ref-install-package) command, as shown in the following example:

```powershell
Install-Package Microsoft.Azure.WebJobs.Extensions.ServiceBus -Version <target_version>
```

The name of the package to use for a given binding is provided in the reference article for that binding. For an example, see the [Packages section of the Service Bus binding reference article](functions-bindings-service-bus.md#packages---functions-1x).

Replace `<target_version>` in the example with a specific version of the package, such as `3.0.0-beta5`. Valid versions are listed on the individual package pages at [NuGet.org](https://nuget.org). The major versions that correspond to Functions runtime 1.x or 2.x are specified in the reference article for the binding.

## C# class library with Visual Studio Code

In **Visual Studio Code**, you can install packages from the command prompt using the [dotnet add package](https://docs.microsoft.com/dotnet/core/tools/dotnet-add-package) command in the .NET Core CLI, as shown in the following example:

```terminal
dotnet add package Microsoft.Azure.WebJobs.Extensions.ServiceBus --version <target_version>
```

The .NET Core CLI can only be used for Azure Functions 2.x development.

The name of the package to use for a given binding is provided in the reference article for that binding. For an example, see the [Packages section of the Service Bus binding reference article](functions-bindings-service-bus.md#packages---functions-1x).

Replace `<target_version>` in the example with a specific version of the package, such as `3.0.0-beta5`. Valid versions are listed on the individual package pages at [NuGet.org](https://nuget.org). The major versions that correspond to Functions runtime 1.x or 2.x are specified in the reference article for the binding.

## Binding at runtime

In C# and other .NET languages, you can use an imperative binding pattern, as opposed to the declarative bindings in *function.json* and attributes. Imperative binding is useful when binding parameters need to be computed at runtime rather than design time. To learn more, see the [C# developer reference](functions-dotnet-class-library.md#binding-at-runtime) or the [C# script developer reference](functions-reference-csharp.md#binding-at-runtime).

## Next steps
> [!div class="nextstepaction"]
> [Azure Function trigger and binding example](./functions-bindings-example.md)

