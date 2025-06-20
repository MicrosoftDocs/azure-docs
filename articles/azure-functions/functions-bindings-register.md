---
title: Register Azure Functions binding extensions
description: Learn how to register Azure Functions binding extensions so that the triggers and bindings defined by the extension can be used in your function code.
ms.topic: concept-article
ms.date: 05/30/2025
zone_pivot_groups: programming-languages-set-functions

#Customer intent: I want to understand how to correctly install binding extensions to make trigger and binding functionality available to my functions.
---

# Register Azure Functions binding extensions

The Azure Functions runtime natively runs HTTP and timer triggers. The behaviors of the other supported [triggers and bindings](./functions-triggers-bindings.md) are implemented in separate extension packages.

::: zone pivot="programming-language-csharp"  
.NET class library projects use binding extensions that are installed in the project as NuGet packages. 
::: zone-end  
::: zone pivot="programming-language-python,programming-language-java,programming-language-javascript,programming-language-typescript,programming-language-powershell"  
Extension bundles allow non-.NET apps to use binding extensions without having to interact with .NET infrastructure.

## Extension bundles

Extension bundles add a predefined set of compatible binding extensions to your function app. Extension bundles are versioned. Each version contains a specific set of binding extensions that are verified to work together. Select a bundle version based on the extensions that you need in your app.

When you create an Azure Functions project from a non-.NET template, extension bundles are already enabled in the app's *host.json* file. 

When possible, use the latest version range to obtain optimal app performance and access to the latest features. To learn more about extension bundles, see [Azure Functions extension bundles](extension-bundles.md). 

In the unlikely event you can't use an extension bundle, you must instead [explicitly install extensions](#explicitly-install-extensions).

::: zone-end

## Explicitly install extensions
::: zone pivot="programming-language-csharp"  
For compiled C# class library projects, you install the NuGet packages for the extensions that you need as you normally would in your apps. For more information, see the [Visual Studio Code developer guide](functions-develop-vs-code.md?tabs=csharp#install-binding-extensions) or the [Visual Studio developer guide](functions-develop-vs.md#add-bindings). 

Make sure to obtain the correct package because the namespace differs depending on the execution model:

| Execution model | Namespace |
| ----- | ----- |
| [Isolated worker process](dotnet-isolated-process-guide.md) | `Microsoft.Azure.Functions.Worker.Extensions.*`|
| [In-process](functions-dotnet-class-library.md) | `Microsoft.Azure.WebJobs.Extensions.*` |

Functions provides extension bundles for non-.NET projects, which contain a full set of binding extensions that are verified to be compatible. If you're having compatibility problems between two or more binding extensions, review compatible combinations of extension versions. For supported combinations of binding extensions, see the [extension bundles release page](https://github.com/Azure/azure-functions-extension-bundles/releases).
::: zone-end  
::: zone pivot="programming-language-python,programming-language-java,programming-language-javascript,programming-language-typescript,programming-language-powershell"  
There are cases when you can't use extension bundles, such as when you need to use a specific prerelease version of a specific extension. In these rare cases, you must manually install any required binding extensions in a C# project file that references the specific extensions required by your app. To manually install binding extensions:

1. Remove the extension bundle reference from your *host.json* file.

1. Use the [func extensions install](functions-core-tools-reference.md#func-extensions-install) command in Azure Functions Core Tools to generate the required *extensions.csproj* file in the root of your local project.

    For portal-only development, you need to manually create an extensions.csproj file in the root of your function app in Azure. To learn more, see [Manually install extensions](functions-how-to-use-azure-function-app-settings.md#manually-install-extensions).

1. Edit the *extensions.csproj* file by explicitly adding a `PackageReference` element for every specific binding extension and version required by your app.   

1. Validate your app functionality locally and then redeploy your project, including *extensions.csproj*, to your function app in Azure.  

As soon as possible, you should [switch your app back to using the latest supported extension bundle](./extension-bundles.md#define-an-extension-bundle-reference).
::: zone-end  
## Next steps
> [!div class="nextstepaction"]
> [Azure Function trigger and binding example](./functions-bindings-example.md)
