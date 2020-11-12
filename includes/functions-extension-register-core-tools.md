---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 08/07/2020
ms.author: glenga
---

If you aren't able to use extension bundles, you can use Azure Functions Core Tools locally to install the specific extension packages required by your project.

> [!IMPORTANT]
> You can't explicitly install extensions in a function app that is using extension bundles. Remove the `extensionBundle` section in *host.json* before explicitly installing extensions.

The following items describe some reasons you might need to install extensions manually:

* You need to access a specific version of an extension not available in a bundle.
* You need to access a custom extension not available in a bundle.
* You need to access a specific combination of extensions not available in a single bundle.

> [!NOTE]
> To manually install extensions by using Core Tools, you must have the [.NET Core 2.x SDK](https://dotnet.microsoft.com/download) installed. The .NET Core SDK is used by Azure Functions Core Tools to install extensions from NuGet. You don't need to know .NET to use Azure Functions extensions.

When you explicitly install extensions, a .NET project file named extensions.csproj is added to the root of your project. This file defines the set of NuGet packages required by your functions. While you can work with the [NuGet package references](/nuget/consume-packages/package-references-in-project-files) in this file, Core Tools lets you install extensions without having to manually edit the file.

There are several ways to use Core Tools to install the required extensions in your local project. 

#### Install all extensions 

Use the following command to automatically add all extension packages used by the bindings in your local project:

```dotnetcli
func extensions install
```
The command reads the *function.json* file to see which packages you need, installs them, and rebuilds the extensions project (extensions.csproj). It adds any new bindings at the current version but does not update existing bindings. Use the `--force` option to update existing bindings to the latest version when installing new ones.

If your function app uses bindings that Core Tools does not recognize, you must manually install the specific extension.

#### Install a specific extension

Use the following command to install a specific extension package at a specific version, in this case the Storage extension:

```dotnetcli
func extensions install --package Microsoft.Azure.WebJobs.Extensions.Storage --version 4.0.2
```
