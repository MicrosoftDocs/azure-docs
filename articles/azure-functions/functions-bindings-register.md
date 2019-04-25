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
ms.date: 02/25/2019
ms.author: cshoe
---

# Register Azure Functions binding extensions

As of Azure Functions version 2.x, [bindings](./functions-triggers-bindings.md) are available as separate packages from the functions runtime. While .NET functions access bindings through NuGet packages, extension bundles also allow other functions access to all bindings through a configuration setting.

Consider the following items pertaining to binding extensions:

- Binding extensions aren't explicitly registered in Functions 1.x except when [creating a C# class library using Visual Studio 2017](#local-csharp).

- HTTP and timer triggers are supported by default and do not require an extension.

The following table indicates when and how you register bindings.

| Development environment |Registration<br/> in Functions 1.x  |Registration<br/> in Functions 2.x  |
|-------------------------|------------------------------------|------------------------------------|
|Azure portal|Automatic|Automatic|
|Non-.NET languages or local Azure Core Tools development|Automatic|[Use Azure Functions Core Tools and extension bundles](#local-development-with-azure-functions-core-tools-and-extension-bundles)|
|C# class library using Visual Studio 2017|[Use NuGet tools](#c-class-library-with-visual-studio-2017)|[Use NuGet tools](#c-class-library-with-visual-studio-2017)|
|C# class library using Visual Studio Code|N/A|[Use .NET Core CLI](#c-class-library-with-visual-studio-code)|

## Local development with Azure Functions Core Tools and extension bundles

[!INCLUDE [functions-core-tools-install-extension](../../includes/functions-core-tools-install-extension.md)]

<a name="local-csharp"></a>
## C# class library with Visual Studio 2017

In **Visual Studio 2017**, you can install packages from the Package Manager Console using the [Install-Package](https://docs.microsoft.com/nuget/tools/ps-ref-install-package) command, as shown in the following example:

```powershell
Install-Package Microsoft.Azure.WebJobs.Extensions.ServiceBus -Version <TARGET_VERSION>
```

The name of the package used for a given binding is provided in the reference article for that binding. For an example, see the [Packages section of the Service Bus binding reference article](functions-bindings-service-bus.md#packages---functions-1x).

Replace `<TARGET_VERSION>` in the example with a specific version of the package, such as `3.0.0-beta5`. Valid versions are listed on the individual package pages at [NuGet.org](https://nuget.org). The major versions that correspond to Functions runtime 1.x or 2.x are specified in the reference article for the binding.

## C# class library with Visual Studio Code

In **Visual Studio Code**, you can install packages from the command prompt using the [dotnet add package](https://docs.microsoft.com/dotnet/core/tools/dotnet-add-package) command in the .NET Core CLI, as shown in the following example:

```terminal
dotnet add package Microsoft.Azure.WebJobs.Extensions.ServiceBus --version <TARGET_VERSION>
```

The .NET Core CLI can only be used for Azure Functions 2.x development.

The name of the package to use for a given binding is provided in the reference article for that binding. For an example, see the [Packages section of the Service Bus binding reference article](functions-bindings-service-bus.md#packages---functions-1x).

Replace `<TARGET_VERSION>` in the example with a specific version of the package, such as `3.0.0-beta5`. Valid versions are listed on the individual package pages at [NuGet.org](https://nuget.org). The major versions that correspond to Functions runtime 1.x or 2.x are specified in the reference article for the binding.

## Next steps
> [!div class="nextstepaction"]
> [Azure Function trigger and binding example](./functions-bindings-example.md)

