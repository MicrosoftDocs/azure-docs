---
title: The session management REST API
description: Describes how to manage sessions
author: florianborn71
ms.author: flborn
ms.date: 02/11/2020
ms.topic: article
---

# Use the session management REST API

To use Azure Remote Rendering functionality, you need to create a *session*. Each session corresponds to a server being allocated in Azure to which a client device can connect. When a device connects, the server renders the requested data and serves the result as a video stream. During session creation, you chose which [kind of server](../reference/vm-sizes.md) you want to run on, which determines pricing. Once the session isn't needed anymore, it should be stopped. If not stopped manually, it will be shut down automatically when the session's *lease time* expires.

## REST API reference

The REST API reference can be found [here](/rest/api/mixedreality/2021-01-01preview/remoterendering) and the swagger definitions [here](https://github.com/Azure/azure-rest-api-specs/tree/master/specification/mixedreality/data-plane/Microsoft.MixedReality).
We provide a PowerShell script in the [ARR samples repository](https://github.com/Azure/azure-remote-rendering) in the *Scripts* folder, called *RenderingSession.ps1*, which demonstrates the use of our service. The script and its configuration are described here: [Example PowerShell scripts](../samples/powershell-example-scripts.md).
We also provide SDKs for [.NET](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/remoterendering/Azure.MixedReality.RemoteRendering/README.md) and [Java](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/remoterendering/azure-mixedreality-remoterendering/README.md).

> [!IMPORTANT]
> Latency is an important factor when using remote rendering. For the best experience create sessions in the region that is closest to you. The [Azure Latency Test](https://www.azurespeed.com/Azure/Latency) can be used to determine which region is closest to you.

> [!IMPORTANT]
> An ARR runtime SDK is needed for a client device to connect to a rendering session. These SDKs are available in [.NET](/dotnet/api/microsoft.azure.remoterendering) and [C++](/cpp/api/remote-rendering/). Apart from connecting to the service, these SDKs can also be used to start and stop sessions.

## Next steps

* [Using the Azure Frontend APIs for authentication](frontend-apis.md)
* [Example PowerShell scripts](../samples/powershell-example-scripts.md)