---
title: Simulcast
titleSuffix: An Azure Communication Services article
description: This article describes how to send multiple video quality streams helps overall call quality.
author: sloanster
manager: chpalm
services: azure-communication-services

ms.author: micahvivion
ms.date: 07/22/2025
ms.topic: conceptual
ms.subservice: calling
ms.service: azure-communication-services
---
# Simulcast

Simulcast is a video streaming method that enables a sender, such as a WebJS client, to deliver multiple variants of the same video feed at varying resolutions and bitrates. This approach allows the Azure Communication Services infrastructure to dynamically select and distribute the most suitable stream to each participant according to their device capabilities, prevailing network conditions, and CPU performance. Simulcast enhances video quality and reliability in group calls, particularly when participants are accessing the service under diverse technical environments.

Without simulcast support, video calls with three or more people suffer if one participant has a poor connection, as the sender must lower video quality for everyone. Simulcast streaming reduces this issue by allowing each recipient to get an optimal stream, minimizing the negative impact of one user's network problems.
Simulcast is available in the Azure Communication Services SDK for WebJS and native SDKs for Android, iOS, and Windows. Sender-side simulcast is presently available on desktop browsers such as Chrome and Microsoft Edge. Receiver-side simulcast is supported across all platforms compatible with Azure Communication Services Calling. Support for sender-side simulcast from mobile browsers is planned for a future update.


## How simulcast works

The simulcast feature lets the Azure Communication Services calling SDK send multiple video qualities to the selective forwarding unit (SFU), which then forwards the optimal one to each endpoint based on their bandwidth, CPU, and resolution needs. This approach conserves publisher resources and ensures subscribers get the best available quality. The SFU doesn't alter video quality; it simply selects which stream to forward.

## Supported number of video qualities available with Simulcast

Simulcast streaming from a web desktop endpoint supports up to three distinct video quality levels. No other API configuration is required to activate Simulcast for Azure Communication Services, as this functionality is enabled by default and available for all video calls.

## Available video resolutions

When a participant utilizes simulcast streaming, there are no predefined resolutions for high or low quality video streams. Rather, the delivery of either a single or multiple video streams depends on various factors. If all video subscribers request and can support the highest resolution available, the publisher transmits only the maximum resolution stream.

Simulcast supports the following resolutions:

- 1080p
- 720p
- 540p
- 360p
- 240p
- 180p
