---
title: Upgrade Durable Functions extension version
description: Learn why it's important to use the latest version of the Durable Functions extension and how to upgrade to the latest.
author: lilyjma
ms.topic: conceptual
ms.custom: devx-track-dotnet
ms.date: 02/15/2023
ms.author: azfuncdf
---

# Upgrade Durable Functions extension version


Many issues users experience with Durable Functions can be resolved simply by upgrading to the latest version of the extension, which often contains important bug fixes and performance improvements. You can follow the instructions in this article to get the latest version of the Durable Functions extension. 

Changes to the extension can be found in the [Release page](https://github.com/Azure/azure-functions-durable-extension/releases) of the `Azure/azure-functions-durable-extension` repo. You can also configure to receive notifications whenever there's a new extension release by going to the **Releases page**, clicking on **Watch**, then on **Custom**, and finally selecting the **Releases** filter:

:::image type="content" source="media/durable-functions-best-practice/watch-releases-1.png" alt-text="Screenshot of step 1 to set up release notifications.":::

:::image type="content" source="media/durable-functions-best-practice/watch-releases-2.png" alt-text="Screenshot of step 2 to set up release notifications.":::

## Reference the latest NuGet packages (.NET apps only)
.NET apps can get the latest version of the Durable Functions extension by referencing the latest NuGet package: 

* [.NET in-process worker](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.DurableTask)
* [.NET isolated worker](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.DurableTask)

If you're using the Netherite or MSSQL [storage providers](durable-functions-storage-providers.md) (instead of Azure Storage), you need to reference one of the following:

* [Netherite, in-process worker](https://www.nuget.org/packages/Microsoft.Azure.DurableTask.Netherite.AzureFunctions)
* [Netherite, isolated worker](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.DurableTask.Netherite)
* [MSSQL, in-process worker](https://www.nuget.org/packages/Microsoft.DurableTask.SqlServer.AzureFunctions)
* [MSSQL, isolated worker](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.DurableTask.SqlServer)

## Upgrade the extension bundle 
[Extension bundles](../functions-bindings-register.md#extension-bundles) provide an easy and convenient way for non-.NET function apps to reference and use various Azure Function triggers and bindings. For example, if you need to send a message to Event Hubs every time your function is triggered, you can use the Event Hubs extension to gain access to Event Hubs bindings. The Durable Functions extension is also included in each version of extension bundles. Extension bundles are automatically configured in host.json when creating a function app using any of the supported development tools. 

Most non-.NET applications rely on extension bundles to gain access to various triggers and bindings. The [latest bundle release](https://github.com/Azure/azure-functions-extension-bundles) often contains the latest version of the Durable Functions extension with critical bug fixes and performance improvements. Therefore, it's important that your app uses the latest version of extension bundles. You can check your host.json file to see whether the version range you're using includes the latest extension bundle version. 

## Manually upgrade the Durable Functions extension
If upgrading the extension bundle didn't resolve your problem, and you noticed a newer release of the Durable Functions extension containing a potential fix to your problem, then you could try to manually upgrade the extension itself. Note that this is only intended for advanced scenarios or when time-sensitive fixes are necessary as there are many drawbacks to manually managing extensions. For example, you may have to deal to .NET errors when the extensions you use are incompatible with each other. You also need to manually upgrade extensions to get the latest fixes and patches instead of getting them automatically through the extension bundle.

First, remove the `extensionBundle` section from your host.json file.

Install the `dotnet` CLI if you don't already have it. You can get it from this [page](https://www.microsoft.com/net/download/).

Because applications normally use more than one extension, it's recommended that you run the following to manually install all the latest version of all extensions supported by Extension Bundles:

```console
func extensions install
```

However, if you **only** wish to install the latest Durable Functions extension release, you would run the following command: 

```console
func extensions install -p Microsoft.Azure.WebJobs.Extensions.DurableTask -v <version>
```

For example:

```console
func extensions install -p Microsoft.Azure.WebJobs.Extensions.DurableTask -v 2.9.1
```
