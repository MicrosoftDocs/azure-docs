---
title: Register Azure Functions binding extensions
description: Learn to register an Azure Functions binding extension based on your environment.
ms.topic: reference
ms.date: 05/07/2025
zone_pivot_groups: programming-languages-set-functions-full
---

# Register Azure Functions binding extensions

The Azure Functions runtime natively runs HTTP and timer triggers. Other supported [triggers and bindings](./functions-triggers-bindings.md) are available as separate NuGet extension packages.

::: zone pivot="programming-language-csharp"  
.NET class library projects use binding extensions that are installed in the project as NuGet packages. 
::: zone-end  
::: zone pivot="programming-language-python,programming-language-java,programming-language-javascript,programming-language-typescript,programming-language-powershell,programming-language-other"  
Extension bundles allow non-.NET apps to use binding extensions without having to interact with .NET infrastructure.

## <a name="extension-bundles"></a>Extension bundles

Extension bundles add a predefined set of compatible binding extensions to your function app. Extension bundles are versioned. Each version contains a specific set of binding extensions that are verified to work together. Select a bundle version based on the extensions that you need in your app.

When you create a non-.NET Functions project from tooling or in the portal, extension bundles are already enabled in the app's *host.json* file. 

You define an extension bundle reference in the *host.json* project file by adding an `extensionBundle` section, as in this example: 

[!INCLUDE [functions-extension-bundles-json](../../includes/functions-extension-bundles-json.md)]

The following table lists the currently available version ranges of the default *Microsoft.Azure.Functions.ExtensionBundle* bundles and links to the extensions they include.

| Bundle version | Version in host.json | Included extensions |
| --- | --- | --- |
| 4.x | `[4.0.0, 5.0.0)` | See [extensions.json](https://github.com/Azure/azure-functions-extension-bundles/blob/main/src/Microsoft.Azure.Functions.ExtensionBundle/extensions.json) used to generate the bundle. |
| 3.x | `[3.3.0, 4.0.0)` | See [extensions.json](https://github.com/Azure/azure-functions-extension-bundles/blob/main-v3/src/Microsoft.Azure.Functions.ExtensionBundle/extensions.json) used to generate the bundle. |
| 2.x | `[2.*, 3.0.0)` | See [extensions.json](https://github.com/Azure/azure-functions-extension-bundles/blob/main-v2/src/Microsoft.Azure.Functions.ExtensionBundle/extensions.json) used to generate the bundle. |
| 1.x | `[1.*, 2.0.0)` | See [extensions.json](https://github.com/Azure/azure-functions-extension-bundles/blob/v1.x/src/Microsoft.Azure.Functions.ExtensionBundle/extensions.json) used to generate the bundle. |

Keep these considerations in mind when working with extension bundles:

+ When possible, you should set a `version` range value in *host.json* from this table, such as `[4.0.0, 5.0.0)`, instead of defining a custom range. 
+ Use the latest version range to obtain optimal app performance and access to the latest features. 

For a complete list of extension bundle releases and extension versions in each release, see the [extension bundles release page](https://github.com/Azure/azure-functions-extension-bundles/releases).
::: zone-end

## Explicitly install extensions
::: zone pivot="programming-language-csharp"  
For compiled C# class library projects ([in-process](functions-dotnet-class-library.md) and [isolated worker process](dotnet-isolated-process-guide.md)), you install the NuGet packages for the extensions that you need as you normally would. For examples, see either the [Visual Studio Code developer guide](functions-develop-vs-code.md?tabs=csharp#install-binding-extensions) or the [Visual Studio developer guide](functions-develop-vs.md#add-bindings). See the [extension bundles release page](https://github.com/Azure/azure-functions-extension-bundles/releases) to review combinations of extension versions that are verified compatible.
::: zone-end  
::: zone pivot="programming-language-python,programming-language-java,programming-language-javascript,programming-language-typescript,programming-language-powershell,programming-language-other"  
When you can't use extension bundles you instead must manually install any required binding extensions in your local project. The easiest way to generate the correct C# project is to use Azure Functions Core Tools. For more information, see [func extensions install](functions-core-tools-reference.md#func-extensions-install).  

For portal-only development, you need to manually create an extensions.csproj file in the root of your function app. To learn more, see [Manually install extensions](functions-how-to-use-azure-function-app-settings.md#manually-install-extensions).
::: zone-end  
## Next steps
> [!div class="nextstepaction"]
> [Azure Function trigger and binding example](./functions-bindings-example.md)
