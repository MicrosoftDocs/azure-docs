---
title: Register Azure Functions binding extensions
description: Learn to register an Azure Functions binding extension based on your environment.
author: craigshoemaker

ms.topic: reference
ms.date: 08/16/2020
ms.author: cshoe
---

# Register Azure Functions binding extensions

Starting with Azure Functions version 2.x, the functions runtime only includes HTTP and timer triggers by default. Other [triggers and bindings](./functions-triggers-bindings.md) are available as separate packages.

.NET class library functions apps use bindings that are installed in the project as NuGet packages. Extension bundles allows non-.NET functions apps to use the same bindings without having to deal with the .NET infrastructure.

The following table indicates when and how you register bindings.

| Development environment |Registration<br/> in Functions 1.x  |Registration<br/> in Functions 3.x/2.x  |
|-------------------------|------------------------------------|------------------------------------|
|Azure portal|Automatic|Automatic<sup>*</sup>|
|Non-.NET languages|Automatic|Use [extension bundles](#extension-bundles) (recommended) or [explicitly install extensions](#explicitly-install-extensions)|
|C# class library using Visual Studio|[Use NuGet tools](#vs)|[Use NuGet tools](#vs)|
|C# class library using Visual Studio Code|N/A|[Use .NET Core CLI](#vs-code)|

<sup>*</sup> Portal uses extension bundles.

## Access extensions in non-.NET languages

For Java, JavaScript, PowerShell, Python, and Custom Handler function apps, we recommended using extension bundles to access bindings. In cases where extension bundles cannot be used, you can explicitly install binding extensions.

### <a name="extension-bundles"></a>Extension bundles

Extension bundles is a way to add a compatible set of binding extensions to your function app. You enable extension bundles in the app's *host.json* file.

You can use extension bundles with version 2.x and later versions of the Functions runtime.

Extension bundles are versioned. Each version contains a specific set of binding extensions that are verified to work together. Select a bundle version based on the extensions that you need in your app.

To add an extension bundle to your function app, add the `extensionBundle` section to *host.json*. In many cases, Visual Studio Code and Azure Functions Core Tools will automatically add it for you.

[!INCLUDE [functions-extension-bundles-json](../../includes/functions-extension-bundles-json.md)]

The following table lists the currently available versions of the default *Microsoft.Azure.Functions.ExtensionBundle* bundle and links to the extensions they include.

| Bundle version | Version in host.json | Included extensions |
| --- | --- | --- |
| 1.x | `[1.*, 2.0.0)` | See [extensions.json](https://github.com/Azure/azure-functions-extension-bundles/blob/v1.x/src/Microsoft.Azure.Functions.ExtensionBundle/extensions.json) used to generate the bundle |
| 2.x | `[2.*, 3.0.0)` | See [extensions.json](https://github.com/Azure/azure-functions-extension-bundles/blob/v2.x/src/Microsoft.Azure.Functions.ExtensionBundle/extensions.json) used to generate the bundle |

> [!NOTE]
> While you can a specify custom version range in host.json, we recommend you use a version value from this table.

### <a name="explicitly-install-extensions"></a>Explicitly install extensions

[!INCLUDE [functions-extension-register-core-tools](../../includes/functions-extension-register-core-tools.md)]

## <a name="local-csharp"></a>Install extensions from NuGet in .NET languages

For a C# class library-based functions project, you should install extensions directly. Extension bundles is designed specifically for projects that aren't C# class library-based.

### <a name="vs"></a> C\# class library with Visual Studio

In **Visual Studio**, you can install packages from the Package Manager Console using the [Install-Package](/nuget/tools/ps-ref-install-package) command, as shown in the following example:

```powershell
Install-Package Microsoft.Azure.WebJobs.Extensions.ServiceBus -Version <TARGET_VERSION>
```

The name of the package used for a given binding is provided in the reference article for that binding. For an example, see the [Packages section of the Service Bus binding reference article](functions-bindings-service-bus.md#functions-1x).

Replace `<TARGET_VERSION>` in the example with a specific version of the package, such as `3.0.0-beta5`. Valid versions are listed on the individual package pages at [NuGet.org](https://nuget.org). The major versions that correspond to Functions runtime 1.x or 2.x are specified in the reference article for the binding.

If you use `Install-Package` to reference a binding, you don't need to use [extension bundles](#extension-bundles). This approach is specific for class libraries built in Visual Studio.

### <a name="vs-code"></a> C# class library with Visual Studio Code

In **Visual Studio Code**, install packages for a C# class library project from the command prompt using the [dotnet add package](/dotnet/core/tools/dotnet-add-package) command in the .NET Core CLI. The following example demonstrates how you add a  binding:

```terminal
dotnet add package Microsoft.Azure.WebJobs.Extensions.<BINDING_TYPE_NAME> --version <TARGET_VERSION>
```

The .NET Core CLI can only be used for Azure Functions 2.x development.

Replace `<BINDING_TYPE_NAME>` with the name of the package that contains the binding you need. You can find the desired binding reference article in the [list of supported bindings](./functions-triggers-bindings.md#supported-bindings).

Replace `<TARGET_VERSION>` in the example with a specific version of the package, such as `3.0.0-beta5`. Valid versions are listed on the individual package pages at [NuGet.org](https://nuget.org). The major versions that correspond to Functions runtime 1.x or 2.x are specified in the reference article for the binding.

## Next steps
> [!div class="nextstepaction"]
> [Azure Function trigger and binding example](./functions-bindings-example.md)
