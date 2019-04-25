---
title: include file
description: include file
services: functions
author: craigshoemaker
ms.service: functions
ms.topic: include
ms.date: 09/25/2018
ms.author: cshoe
ms.custom: include file
---

Extension bundles make all bindings published by the Azure Functions team available through a setting in the *host.json* file. For local development, ensure you have the latest version of [Azure Functions Core Tools](../articles/azure-functions/functions-run-local.md#install-the-azure-functions-core-tools).

To use extension bundles, update the *host.json* file to include the following entry for `extensionBundle`:

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
- The `version` references the version of the bundle.

Bundle versions increment as packages in the bundle changes. Major version changes happen only when packages in the bundle move a major version. The `version` property uses the [interval notation for specifying version ranges](https://docs.microsoft.com/nuget/reference/package-versioning#version-ranges-and-wildcards). The Functions runtime always picks the maximum permissible version defined by the version range or interval.

Once you reference the extension bundles in your project, then all default bindings are available to your functions. The bindings available in the [extension bundles](https://github.com/Azure/azure-functions-extension-bundles/blob/master/src/Microsoft.Azure.Functions.ExtensionBundle/extensions.json) are:

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