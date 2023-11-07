---
title: Register Azure Functions binding extensions
description: Learn to register an Azure Functions binding extension based on your environment.
ms.topic: reference
ms.date: 03/19/2022
---

# Register Azure Functions binding extensions

Starting with Azure Functions version 2.x, the functions runtime only includes HTTP and timer triggers by default. Other [triggers and bindings](./functions-triggers-bindings.md) are available as separate packages.

.NET class library functions apps use bindings that are installed in the project as NuGet packages. Extension bundles allow non-.NET functions apps to use the same bindings without having to deal with the .NET infrastructure.

The following table indicates when and how you register bindings.

| Development environment |Registration<br/> in Functions 1.x  |Registration<br/> in Functions 2.x or later  |
|-------------------------|------------------------------------|------------------------------------|
|Azure portal|Automatic|Automatic<sup>*</sup>|
|Non-.NET languages|Automatic|Use [extension bundles](#extension-bundles) (recommended) or [explicitly install extensions](#explicitly-install-extensions)|
|C# class library using Visual Studio|[Use NuGet tools](functions-develop-vs.md#add-bindings)|[Use NuGet tools](functions-develop-vs.md#add-bindings)|
|C# class library using Visual Studio Code|N/A|[Use .NET Core CLI](functions-develop-vs-code.md?tabs=csharp#install-binding-extensions)|

<sup>*</sup> Portal uses extension bundles, including C# script.

## <a name="extension-bundles"></a>Extension bundles

By default, extension bundles are used by Java, JavaScript, PowerShell, Python, C# script, and Custom Handler function apps to work with binding extensions. In cases where extension bundles can't be used, you can explicitly install binding extensions with your function app project. Extension bundles are supported for version 2.x and later version of the Functions runtime.

Extension bundles are a way to add a pre-defined set of compatible binding extensions to your function app. Extension bundles are versioned. Each version contains a specific set of binding extensions that are verified to work together. Select a bundle version based on the extensions that you need in your app.

When you create a non-.NET Functions project from tooling or in the portal, extension bundles are already enabled in the app's *host.json* file. 

An extension bundle reference is defined by the `extensionBundle` section in a *host.json* as follows: 

[!INCLUDE [functions-extension-bundles-json](../../includes/functions-extension-bundles-json.md)]

The following table lists the currently available version ranges of the default *Microsoft.Azure.Functions.ExtensionBundle* bundles and links to the extensions they include.

| Bundle version | Version in host.json | Included extensions |
| --- | --- | --- |
| 1.x | `[1.*, 2.0.0)` | See [extensions.json](https://github.com/Azure/azure-functions-extension-bundles/blob/v1.x/src/Microsoft.Azure.Functions.ExtensionBundle/extensions.json) used to generate the bundle. |
| 2.x | `[2.*, 3.0.0)` | See [extensions.json](https://github.com/Azure/azure-functions-extension-bundles/blob/v2.x/src/Microsoft.Azure.Functions.ExtensionBundle/extensions.json) used to generate the bundle. |
| 3.x | `[3.3.0, 4.0.0)` | See [extensions.json](https://github.com/Azure/azure-functions-extension-bundles/blob/4f5934a18989353e36d771d0a964f14e6cd17ac3/src/Microsoft.Azure.Functions.ExtensionBundle/extensions.json) used to generate the bundle. |
| 4.x | `[4.0.0, 5.0.0)` | See [extensions.json](https://github.com/Azure/azure-functions-extension-bundles/blob/v4.x/src/Microsoft.Azure.Functions.ExtensionBundle/extensions.json) used to generate the bundle. |


> [!NOTE]
> Even though host.json supports custom ranges for `version`, you should use a version range value from this table, such as  `[3.3.0, 4.0.0)`.

## Explicitly install extensions

For compiled C# class library projects ([in-process](functions-dotnet-class-library.md) and [isolated worker process](dotnet-isolated-process-guide.md)), you install the NuGet packages for the extensions that you need as you normally would. For examples see either the [Visual Studio Code developer guide](functions-develop-vs-code.md?tabs=csharp#install-binding-extensions) or the [Visual Studio developer guide](functions-develop-vs.md#add-bindings).  

For non-.NET languages and C# script, when you can't use extension bundles you need to manually install required binding extensions in your local project. The easiest way is to use Azure Functions Core Tools. For more information, see [func extensions install](functions-core-tools-reference.md#func-extensions-install).  

For portal-only development, you need to manually create an extensions.csproj file in the root of your function app. To learn more, see [Manually install extensions](functions-how-to-use-azure-function-app-settings.md#manually-install-extensions).

## Next steps
> [!div class="nextstepaction"]
> [Azure Function trigger and binding example](./functions-bindings-example.md)
