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

When you create an Azure Functions project from a non-.NET template, extension bundles are already enabled in the app's *host.json* file. 

### Define an extension bundle

You define an extension bundle reference in the *host.json* project file by adding an `extensionBundle` section, as in this example: 

[!INCLUDE [functions-extension-bundles-json](../../includes/functions-extension-bundles-json.md)]

### Supported extension bundles

The following table lists the default `Microsoft.Azure.Functions.ExtensionBundle` bundles that are currently generally available (GA).

| Bundle version | Version in host.json | Included extensions |
| --- | --- | --- |
| 4.x | `[4.0.0, 5.0.0)` | See [extensions.json](https://github.com/Azure/azure-functions-extension-bundles/blob/main/src/Microsoft.Azure.Functions.ExtensionBundle/extensions.json) used to generate the bundle. |
| 3.x | `[3.3.0, 4.0.0)` | See [extensions.json](https://github.com/Azure/azure-functions-extension-bundles/blob/main-v3/src/Microsoft.Azure.Functions.ExtensionBundle/extensions.json) used to generate the bundle. |
| 2.x | `[2.*, 3.0.0)` | See [extensions.json](https://github.com/Azure/azure-functions-extension-bundles/blob/main-v2/src/Microsoft.Azure.Functions.ExtensionBundle/extensions.json) used to generate the bundle. |
| 1.x | `[1.*, 2.0.0)` | See [extensions.json](https://github.com/Azure/azure-functions-extension-bundles/blob/v1.x/src/Microsoft.Azure.Functions.ExtensionBundle/extensions.json) used to generate the bundle. |

The default extension bundles are defined using version ranges, and this table links to the extension definitions for the bundle. For a complete list of extension bundle releases and extension versions in each release, see the [extension bundles release page](https://github.com/Azure/azure-functions-extension-bundles/releases).

### Extension bundles considerations

Keep these considerations in mind when working with extension bundles:

+ When possible, you should set a `version` range value in *host.json* from this table, such as `[4.0.0, 5.0.0)`, instead of defining a custom range. 
+ Use the latest version range to obtain optimal app performance and access to the latest features. 

### Preview extension bundles

Prerelease versions of specific binding extensions are frequently made available in preview extension bundles. These preview extension bundles, which have an ID of `Microsoft.Azure.Functions.ExtensionBundle.Preview`, allow you to take advantage of new extension behaviors before they are declared as GA. Keep these considerations in mind when choosing to use a non-GA extension bundle:

+ Preview bundles can include features that are still under development and not yet ready for production use. 
+ Breaking changes occur between preview versions without prior notice, which can include changes to:
    + Trigger and binding definitions
    + Extensions included in the preview
    + Performance characteristics and stability 
+ Security updates might require you to upgrade versions.
+ You must completely test preview bundles in nonproduction environments and avoid using preview bundles in production. When you must use a preview bundle in production, take these extra precautions:
    + Pin your bundle to a specific well-tested bundle version instead of to a range. Pinning prevents automatic upgrading of your bundle version before you have a chance to verify the update in a nonproduction environment. 
    + Move your app to using a GA bundle version as soon as the functionality becomes available in a fully supported bundle release.
+ To stay informed about bundle updates, including moving from preview to GA, you should: 
    + Monitor preview bundle version releases on the [extension bundles release page](https://github.com/Azure/azure-functions-extension-bundles/releases). - Releases · Azure/azure-functions-extension-bundles
    + Monitor [extension specific reference documentation](./functions-triggers-bindings.md).
    + Review the NuGet package versions of specific preview extensions you're using. 
    + Track significant updates or changes on the change logs published on NuGet.org for each preview extension.

::: zone-end

## Explicitly install extensions
::: zone pivot="programming-language-csharp"  
For compiled C# class library projects, you install the NuGet packages for the extensions that you need as you normally would in your apps. For more information, see the [Visual Studio Code developer guide](functions-develop-vs-code.md?tabs=csharp#install-binding-extensions) or the [Visual Studio developer guide](functions-develop-vs.md#add-bindings). 

Make sure to obtain the correct package because the namespace differs depending on the execution model:

| Execution model | Namespace |
| ----- | ----- |
| [Isolated worker process](dotnet-isolated-process-guide.md) | `Microsoft.Azure.Functions.Worker.Extensions.*`|
| [In-process](functions-dotnet-class-library.md) | `Microsoft.Azure.WebJobs.Extensions.*` |

Functions provides extension bundles for non-.NET projects, which contain a full set of binding extensions that are verified to be compatible. If you're having compatibility problems between two or more binding extensions, see the [extension bundles release page](https://github.com/Azure/azure-functions-extension-bundles/releases) to review compatible combinations of extension versions.
::: zone-end  
::: zone pivot="programming-language-python,programming-language-java,programming-language-javascript,programming-language-typescript,programming-language-powershell,programming-language-other"  
There are cases when you can't use extension bundles, such as when you need to use a specific prerelease version of a specific extension. In these rare cases, you must manually install any required binding extensions in a C# project file  (*extensions.csproj*) that references the specific extensions required by your app. 

The easiest way to create this C# file in your local project is by using Azure Functions Core Tools. For more information, see the [func extensions install](functions-core-tools-reference.md#func-extensions-install) command, which generates this project for you.  

For portal-only development, you need to manually create an extensions.csproj file in the root of your function app in Azure. To learn more, see [Manually install extensions](functions-how-to-use-azure-function-app-settings.md#manually-install-extensions).
::: zone-end  
## Next steps
> [!div class="nextstepaction"]
> [Azure Function trigger and binding example](./functions-bindings-example.md)
