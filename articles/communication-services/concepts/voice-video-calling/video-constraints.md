---
title: Azure Communication Services Video constraints
titleSuffix: An Azure Communication Services concept document
description: Overview of Video Constraints
author: sloanster
ms.author: micahvivion
manager: nmurav

services: azure-communication-services
ms.date: 2/20/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: calling
---

# Video constraints

[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include.md)]

The Video Constraints API is a powerful tool that enables developers to control the video quality from within their video calls. With this API, developers can set maximum video resolutions, frame rate, and bitrate used so that the call is optimized for the user's device and network conditions. The ACS video engine is optimized to allow the video quality to change dynamically based on devices ability and network quality. But there might be certain scenarios where you would want to have tighter control of the video quality that end users experience. For instance, there may be situations where the highest video quality is not a priority, or you may want to limit the video bandwidth usage in the application. To support those use cases, you can use the Video Constraints API to have tighter control over video quality.

Another benefit of the Video Constraints API is that it enables developers to optimize the video call for different devices. For example, if a user is using an older device with limited processing power, developers can set constraints on the video resolution to ensure that the video call runs smoothly on that device

ACS Web Calling SDK supports setting the maximum video resolution, framerate, or bitrate that a client sends. The sender video constraints are supported on Desktop browsers (Chrome, Edge, Firefox) and when using iOS Safari mobile browser or Android Chrome mobile browser.

The native Calling SDK (Android, iOS, Windows) supports setting the maximum values of video resolution and framerate for outgoing video streams and setting the maximum resolution for incoming video streams. These constraints can be set at the start of the call and during the call.

## Supported constraints

| Platform | Supported Constraints | 
| ----------- | ----------- |
| Web | Outgoing video: resolution, framerate, bitrate |
| Android | Incoming video: resolution<br />Outgoing video: resolution, framerate |
| iOS | Incoming video: resolution<br />Outgoing video: resolution, framerate |
| Windows | Incoming video: resolution<br />Outgoing video: resolution, framerate |

## Next steps
For more information, see the following articles:
- [Tutorial on how to enable video constraints](../../quickstarts/voice-video-calling/get-started-video-constraints.md)
- [Enable Media Quality Statistics in your application](./media-quality-sdk.md)
- Learn about [Calling SDK capabilities](../../quickstarts/voice-video-calling/getting-started-with-calling.md)
