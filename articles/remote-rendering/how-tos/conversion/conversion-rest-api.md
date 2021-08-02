---
title: The asset conversion REST API
description: Describes how to convert an asset via the REST API
author: florianborn71
ms.author: flborn
ms.date: 02/04/2020
ms.topic: how-to
---

# Use the model conversion REST API

The [model conversion](model-conversion.md) service is controlled through a [REST API](https://en.wikipedia.org/wiki/Representational_state_transfer). This API can be used to create conversions, get conversion properties, and list existing conversions.

## REST API reference

The Remote Rendering REST API reference documentation can be found [here](/rest/api/mixedreality/2021-01-01/remoterendering), and the swagger definitions [here](https://github.com/Azure/azure-rest-api-specs/tree/master/specification/mixedreality/data-plane/Microsoft.MixedReality).

We provide a PowerShell script in the [ARR samples repository](https://github.com/Azure/azure-remote-rendering) in the *Scripts* folder, called *Conversion.ps1*, which demonstrates the use of our service. The script and its configuration are described here: [Example PowerShell scripts](../../samples/powershell-example-scripts.md). We also provide SDKs for [.NET](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/remoterendering/Azure.MixedReality.RemoteRendering/README.md) and [Java]( https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/remoterendering/azure-mixedreality-remoterendering/README.md).

## Next steps

- [Use Azure Blob Storage for model conversion](blob-storage.md)
- [Model conversion](model-conversion.md)