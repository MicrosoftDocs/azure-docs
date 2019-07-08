---
title: Register Azure Functions binding extensions
description: Learn to register an Azure Functions binding extension based on your environment.
services: functions
documentationcenter: na
author: craigshoemaker
manager: gwallace

ms.service: azure-functions
ms.devlang: multiple
ms.topic: reference
ms.date: 07/08/2019
ms.author: cshoe
---

# Register Azure Functions binding extensions

In Azure Functions version 2.x, [bindings](./functions-triggers-bindings.md) are available as separate packages from the functions runtime. While .NET functions access bindings through NuGet packages, extension bundles allow other functions access to all bindings through a configuration setting.

Consider the following items related to binding extensions:

- Binding extensions aren't explicitly registered in Functions 1.x except when [creating a C# class library using Visual Studio](#local-csharp).

- HTTP and timer triggers are supported by default and don't require an extension.

The following table indicates when and how you register bindings.

| Development environment |Registration<br/> in Functions 1.x  |Registration<br/> in Functions 2.x  |
|-------------------------|------------------------------------|------------------------------------|
|Azure portal|Automatic|Automatic|
|Non-.NET languages or local Azure Core Tools development|Automatic|[Use Azure Functions Core Tools and extension bundles](#extension-bundles)|
|C# class library using Visual Studio|[Use NuGet tools](#vs)|[Use NuGet tools](#vs)|
|C# class library using Visual Studio Code|N/A|[Use .NET Core CLI](#vs-code)|

## <a name="extension-bundles"></a>Extension bundles for local development

Extension bundles is a local development technology for the version 2.x runtime that lets you add a compatible set of Functions binding extensions to your function app project. These extension packages are then included in the deployment package when you deploy to Azure. Bundles makes all bindings published by Microsoft available through a setting in the *host.json* file. Extension packages defined in a bundle are compatible with each other, which helps you avoid conflicts between packages. When developing locally, make sure you are using the latest version of [Azure Functions Core Tools](functions-run-local.md#v2).

Use extension bundles for all local development using Azure Functions Core Tools or Visual Studio Code.

If you don't use extension bundles, you must install the .NET Core 2.x SDK on your local computer before you install any binding extensions. Bundles removes this requirement for local development. 

To use extension bundles, update the *host.json* file to include the following entry for `extensionBundle`:

```json
{
    "version": "2.0",
    "extensionBundle": {
        "id": "Microsoft.Azure.Functions.ExtensionBundle",
        "version": "[1.*, 2.0.0)"
    }
}
```

The following properties are available in `extensionBundle`:

| Property | Description |
| -------- | ----------- |
| **`id`** | The namespace for Microsoft Azure Functions extension bundles. |
| **`version`** | The version of the bundle to install. The Functions runtime always picks the maximum permissible version defined by the version range or interval. The version value above allows all bundle versions from 1.0.0 up to but not including 2.0.0. For more information, see the [interval notation for specifying version ranges](https://docs.microsoft.com/nuget/reference/package-versioning#version-ranges-and-wildcards). |

Bundle versions increment as packages in the bundle change. Major version changes occur when packages in the bundle increment by a major version, which usually coincides with a change in the major version of the Functions runtime.  

The current set of extensions installed by the default bundle are enumerated in this [extensions.json file](https://github.com/Azure/azure-functions-extension-bundles/blob/master/src/Microsoft.Azure.Functions.ExtensionBundle/extensions.json).

<a name="local-csharp"></a>

## <a name="vs"></a> C\# class library with Visual Studio

In **Visual Studio**, you can install packages from the Package Manager Console using the [Install-Package](https://docs.microsoft.com/nuget/tools/ps-ref-install-package) command, as shown in the following example:

```powershell
Install-Package Microsoft.Azure.WebJobs.Extensions.ServiceBus -Version <TARGET_VERSION>
```

The name of the package used for a given binding is provided in the reference article for that binding. For an example, see the [Packages section of the Service Bus binding reference article](functions-bindings-service-bus.md#packages---functions-1x).

Replace `<TARGET_VERSION>` in the example with a specific version of the package, such as `3.0.0-beta5`. Valid versions are listed on the individual package pages at [NuGet.org](https://nuget.org). The major versions that correspond to Functions runtime 1.x or 2.x are specified in the reference article for the binding.

If you use `Install-Package` to reference a binding, you do not need to use [extension bundles](#extension-bundles). This approach is specific for class libraries built in Visual Studio.

## <a name="vs-code"></a> C# class library with Visual Studio Code

> [!NOTE]
> We recommend using [extension bundles](#extension-bundles) to have Functions automatically install a compatible set of binding extension packages.

In **Visual Studio Code**, install packages for a C# class library project from the command prompt using the [dotnet add package](https://docs.microsoft.com/dotnet/core/tools/dotnet-add-package) command in the .NET Core CLI. The following example demonstrates how you add a  binding:

```terminal
dotnet add package Microsoft.Azure.WebJobs.Extensions.<BINDING_TYPE_NAME> --version <TARGET_VERSION>
```

The .NET Core CLI can only be used for Azure Functions 2.x development.

Replace `<BINDING_TYPE_NAME>` with the name of the package provided in the reference article for your desired binding. You can find the desired binding reference article in the [list of supported bindings](./functions-triggers-bindings.md#supported-bindings).

Replace `<TARGET_VERSION>` in the example with a specific version of the package, such as `3.0.0-beta5`. Valid versions are listed on the individual package pages at [NuGet.org](https://nuget.org). The major versions that correspond to Functions runtime 1.x or 2.x are specified in the reference article for the binding.

## Next steps
> [!div class="nextstepaction"]
> [Azure Function trigger and binding example](./functions-bindings-example.md)
