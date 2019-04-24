---
title: Azure Functions binding extensions 
description: Reference Azure Functions binding extensions 
author: craigshoemaker
ms.author: cshoe
ms.date: 4/25/2019
ms.topic: article
ms.service: functions
ms.prod: azure
manager: jeconnoc
---
# Azure Functions bindings extensions

As of Azure Functions version 2.x, bindings are available as separate packages from the functions runtime. While .NET functions access bindings through NuGet packages, extension bundles allow non-.NET functions access to all bindings through a configuration setting.

## Extensions via NuGet for .NET functions

To reference binding extensions in your .NET function, install the packages as required by your application using NuGet. The following table lists the binding extensions available as NuGet packages:

|Package |Version|
|---------|---------|
|Microsoft.Azure.WebJobs.Extensions.CosmosDB|3.0.0|
|Microsoft.Azure.WebJobs.Extensions.DurableTask|1.4.0|
|Microsoft.Azure.Webjobs.Extensions.EventGrid|2.0.0|
|Microsoft.Azure.Webjobs.Extensions.EventHubs|3.0.0|
|Microsoft.Azure.Webjobs.Extensions.MicrosoftGraph|1.0.0-beta|
|Microsoft.Azure.WebJobs.Extensions.ServiceBus|3.0.0|
|Microsoft.Azure.WebJobs.Extensions.Storage|3.0.0|
<!-- Missing: SendGrid, Twilio, SignalR  -->

## Extension bundles for non-.NET functions

Extension bundles make all bindings published by the Azure Functions team available to non-.NET functions through a setting in the *host.json* file.

To make bindings available to your non-.NET function, update the *host.json* file to include the following entry for `extensionBundle`:

```json
{
    "version": "2.0",
    "extensionBundle": {
        "id": "Microsoft.Azure.Functions.ExtensionBundle",
        "version": "[1.*, 2.0.0)"
    }
}
```

- The `id` property references the namespace for Microsoft Azure Functions extension bundles.
- The `version` references the version of the bundle. Bundle versions increment as packages in the bundle changes. Major version changes happen only when packages in the bundle move a major version. The `version` property uses the [interval notation for specifying version ranges](https://docs.microsoft.com/nuget/reference/package-versioning#version-ranges-and-wildcards).

For local development, ensure you have the latest version of [Azure Functions Core Tools](./functions-run-local.md#install-the-azure-functions-core-tools).

Once you reference the extension bundles in your project, then all default bindings are available to your functions.

The bindings available in the [extension bundles](https://github.com/Azure/azure-functions-extension-bundles/blob/master/src/Microsoft.Azure.Functions.ExtensionBundle/extensions.json) are:

|Package  |Version  |
|---------|---------|
|Microsoft.Azure.WebJobs.Extensions.CosmosDB|3.0.3|
|Microsoft.Azure.WebJobs.Extensions.DurableTask|1.8.0|
|Microsoft.Azure.WebJobs.Extensions.EventGrid|2.0.0|
|Microsoft.Azure.WebJobs.Extensions.EventHubs|3.0.3|
|Microsoft.Azure.WebJobs.Extensions.SendGrid|3.0.0|
|Microsoft.Azure.WebJobs.Extensions.ServiceBus|3.0.3|
|Microsoft.Azure.WebJobs.Extensions.SignalRService|1.0.0|
|Microsoft.Azure.WebJobs.Extensions.Storage|3.0.4|
|Microsoft.Azure.WebJobs.Extensions.Twilio|3.0.0|

## Next Steps

- [Manually install or update Azure Functions binding extensions from the portal](./install-update-binding-extensions-manual.md)