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

## Reference the latest package (.NET apps only)
.NET apps can get the latest version of the Durable Functions extension by referencing the latest [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.DurableTask). 

## Upgrade the extension bundle 
[Extension bundle](../functions-bindings-register.md#extension-bundles) provides an easy and convenient way for non-.NET function apps to reference and use Azure Function extension packages written in C#. For example, if you need to send a message to Event Hubs every time your function is triggered, you need the Event Hubs extension. The extension bundle gathers a set of Azure Functions extensions that have been verified to work together into a single package referenced in host.json; the Durable Functions extension is one of them. The extension bundle is automatically enabled during time of app creation. 

Most non-.NET applications, unless they reference a .NET assembly that has all Azure Functions extensions, rely on the extension bundle for the different extensions.  The [latest bundle release](https://github.com/Azure/azure-functions-extension-bundles) often contains the latest version of the Durable Functions extension with critical bug fixes and performance improvements. Therefore, it is important that your app uses the latest version of the extension bundle. You can check the version you have in the host.json file. 

## Upgrade the Durable Functions extension 
If upgrading the extension bundle did not resolve your problem, and you noticed a newer release of the Durable Functions extension containing a potential fix to your problem, then you could try to manually upgrade the extension itself. 

First, remove the `extensionBundle` section from your host.json file.

Then run the following to upgrade the Durable Functions extension:

```console
func extensions install Microsoft.Azure.WebJobs.Extensions.DurableTask -v <version>
```

For example:

```console
func extensions install Microsoft.Azure.WebJobs.Extensions.DurableTask -v 2.9.1
```

Because applications normally use more than one extension, it is recommended that you run just `func extensions install` to get **all** the latest extensions supported by Azure Functions, which would include the Durable Functions extension.  

Changes to the Durable Functions extension can be found in our release notes. You can also watch our Releases page on GitHub for notifications when new releases come out by going to the release notes page -> Watch -> check [“Releases”](https://github.com/Azure/azure-functions-durable-extension/releases).  
