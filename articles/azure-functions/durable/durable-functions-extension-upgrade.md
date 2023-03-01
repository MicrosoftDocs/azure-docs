---
title: Upgrade Durable Functions extension version
description: Learn why it is important to use the latest version of the Durable Functions extension and how to upgrade to the latest.
author: lilyjma
ms.topic: conceptual
ms.date: 02/15/2023
ms.author: azfuncdf
---

# Upgrade Durable Functions extension version

Some issues users experience with Durable Functions can be resolved by upgrading to the latest version of the extension which contains important bug fixes and performance improvements. You can do the following to get the latest version of the Durable Functions extension. 

## Reference the latest nuget packages (.NET apps only)
.NET apps can get the latest version of the Durable Functions extension by referencing the latest NuGet package: 

* [.NET in-process worker](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.DurableTask)
* [.NET isolated worker](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.DurableTask)

If you're using the Netherite or Microsoft SQL [storage providers](durable-functions-storage-providers.md) (instead of Azure Storage), you'll need to reference the following:

* [Netherite, in-process worker](https://www.nuget.org/packages/Microsoft.Azure.DurableTask.Netherite.AzureFunctions)
* [Netherite, isolated worker](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.DurableTask.Netherite)
* [MSSQL, in-process worker](https://www.nuget.org/packages/Microsoft.DurableTask.SqlServer.AzureFunctions)
* [MSSQL, isolated worker](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.DurableTask.SqlServer)

## Upgrade the extension bundle 
[Extension bundles](../functions-bindings-register.md#extension-bundles) provide an easy and convenient way for non-.NET function apps to reference and use various Azure Function triggers and bindings. For example, if you need to send a message to Event Hubs every time your function is triggered, you can use the Event Hubs extension to gain access to Event Hubs bindings. The Durable Functions extension is also included in each version of extension bundles. Extension bundles are automatically configured in host.json when creating a function app using any of the supported development tools. 

Most non-.NET applications rely on extension bundles to gain access to various triggers and bindings.  The [latest bundle release](https://github.com/Azure/azure-functions-extension-bundles) often contains the latest version of the Durable Functions extension with critical bug fixes and performance improvements. Therefore, it is important that your app uses the latest version of the extension bundle. You can check your host.json file to see whether the version range you're using includes the latest extension bundle version. 

## Upgrade the Durable Functions extension 
If upgrading the extension bundle did not resolve your problem, and you noticed a newer release of the Durable Functions extension containing a potential fix to your problem, then you could try to manually upgrade the extension itself. Note this is only intended for advanced scenarios or when time-sensitive fixes are necessary since there are many drawbacks to this approach.

First, remove the `extensionBundle` section from your host.json file.

The following command requires the `dotnet` cli to be installed. You can install it from this [page](https://www.microsoft.com/net/download/). Then run the command to upgrade the Durable Functions extension:

```console
func extensions install Microsoft.Azure.WebJobs.Extensions.DurableTask -v <version>
```

For example:

```console
func extensions install Microsoft.Azure.WebJobs.Extensions.DurableTask -v 2.9.1
```

Because applications normally use more than one extension, it is recommended that you run just `func extensions install` to get **all** the latest extensions supported by Azure Functions, which would include the Durable Functions extension.  

Changes to the Durable Functions extension can be found in our [release notes](https://github.com/Azure/azure-functions-durable-extension/releases). You can also receive notifications whenever there is a new extension release by going to the Releases page -> Watch -> check “Releases”.
