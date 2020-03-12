---
title: Register Azure Functions binding extensions
description: Learn to register an Azure Functions binding extension based on your environment.
author: craigshoemaker

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

Extension bundles is a deployment technology that lets you add a compatible set of Functions binding extensions to your function app. A predefined set of extensions are added when you build your app. Extension packages defined in a bundle are compatible with each other, which helps you avoid conflicts between packages. You enable extension bundles in the app's host.json file.  

You can use extension bundles with version 2.x and later versions of the Functions runtime. When developing locally, make sure you are using the latest version of [Azure Functions Core Tools](functions-run-local.md#v2).

Use extension bundles for local development using Azure Functions Core Tools, Visual Studio Code, and when you build remotely.

If you don't use extension bundles, you must install the .NET Core 2.x SDK on your local computer before you install any binding extensions. Extension bundles removes this requirement for local development. 

To use extension bundles, update the *host.json* file to include the following entry for `extensionBundle`:
 
[!INCLUDE [functions-extension-bundles-json](../../includes/functions-extension-bundles-json.md)]

<a name="local-csharp"></a>

## <a name="vs"></a> C\# class library with Visual Studio

In **Visual Studio**, you can install packages from the Package Manager Console using the [Install-Package](https://docs.microsoft.com/nuget/tools/ps-ref-install-package) command, as shown in the following example:

```powershell
Install-Package Microsoft.Azure.WebJobs.Extensions.ServiceBus -Version <TARGET_VERSION>
```

The name of the package used for a given binding is provided in the reference article for that binding. For an example, see the [Packages section of the Service Bus binding reference article](functions-bindings-service-bus.md#functions-1x).

Replace `<TARGET_VERSION>` in the example with a specific version of the package, such as `3.0.0-beta5`. Valid versions are listed on the individual package pages at [NuGet.org](https://nuget.org). The major versions that correspond to Functions runtime 1.x or 2.x are specified in the reference article for the binding.

If you use `Install-Package` to reference a binding, you don't need to use [extension bundles](#extension-bundles). This approach is specific for class libraries built in Visual Studio.

## <a name="vs-code"></a> C# class library with Visual Studio Code

In **Visual Studio Code**, install packages for a C# class library project from the command prompt using the [dotnet add package](https://docs.microsoft.com/dotnet/core/tools/dotnet-add-package) command in the .NET Core CLI. The following example demonstrates how you add a  binding:

```terminal
dotnet add package Microsoft.Azure.WebJobs.Extensions.<BINDING_TYPE_NAME> --version <TARGET_VERSION>
```

The .NET Core CLI can only be used for Azure Functions 2.x development.

Replace `<BINDING_TYPE_NAME>` with the name of the package that contains the binding you need. You can find the desired binding reference article in the [list of supported bindings](./functions-triggers-bindings.md#supported-bindings).

Replace `<TARGET_VERSION>` in the example with a specific version of the package, such as `3.0.0-beta5`. Valid versions are listed on the individual package pages at [NuGet.org](https://nuget.org). The major versions that correspond to Functions runtime 1.x or 2.x are specified in the reference article for the binding.

## Next steps
> [!div class="nextstepaction"]
> [Azure Function trigger and binding example](./functions-bindings-example.md)
