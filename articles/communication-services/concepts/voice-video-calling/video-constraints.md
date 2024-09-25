---
title: Azure Communication Services Video Constraints
titleSuffix: An Azure Communication Services concept article
description: Get an overview of the Video Constraints API.
author: sloanster
ms.author: micahvivion
manager: nmurav

services: azure-communication-services
ms.date: 2/15/2024
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: calling
---

# Video Constraints

The Video Constraints API enables developers to control the video quality from within video calls. With this API, developers can set maximum video resolutions, frame rate, and bitrate so that the call is optimized for the user's device and network conditions.

The Azure Communication Services video engine is optimized to allow the video quality to change dynamically based on a device's ability and the network quality. But there might be certain scenarios where the highest video quality isn't a priority, or you want to limit the video bandwidth usage in an application. To support those use cases, you can use the Video Constraints API to have tighter control over the video quality that users experience.

Another benefit of the Video Constraints API is that it enables developers to optimize the video call for different devices. For example, if a user is using an older device with limited processing power, you can set constraints on the video resolution to ensure that the video call runs smoothly on that device.

## Supported constraints

| Platform | Supported constraints |
| ----------- | ----------- |
| **Web** | **Incoming video**: resolution<br />**Outgoing video**: resolution, frame rate, bitrate |
| **Android** | **Incoming video**: resolution<br />**Outgoing video**: resolution, frame rate |
| **iOS** | **Incoming video**: resolution<br />**Outgoing video**: resolution, frame rate |
| **Windows** | **Incoming video**: resolution<br />**Outgoing video**: resolution, frame rate |

## Related content

- [Quickstart: Set video constraints in your calling app](../../quickstarts/voice-video-calling/get-started-video-constraints.md)
- [Enable media quality statistics in your application](./media-quality-sdk.md)
- [Quickstart: Add voice calling to your app](../../quickstarts/voice-video-calling/getting-started-with-calling.md)
