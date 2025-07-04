---
title: Simulcast
titleSuffix: An Azure Communication Services article
description: This article describes how to send multiple video quality streams helps overall call quality.
author: sloanster
manager: chpalm
services: azure-communication-services

ms.author: micahvivion
ms.date: 06/26/2025
ms.topic: conceptual
ms.subservice: calling
ms.service: azure-communication-services
---
# Simulcast

Simulcast is a technique that enables video streaming applications to send multiple versions of the same video content at different resolutions and bitrates. This way, the receiver can choose the most suitable version based on their network conditions and device capabilities. 

The lack of simulcast support leads to a degraded video experience in calls with three or more participants. If a video receiver with poor network conditions joins the conference, it impacts the quality of video received from the sender without simulcast support for all other participants. The video sender optimizes its video feed against the lowest common denominator. When simulcast streaming is available, the potential impact of one person affecting the entire streaming quality experience is minimized.

Simulcast is supported on Azure Communication Services SDK for WebJS (1.9.1-beta.1+) and native SDK for Android, iOS, and Windows. Currently, simulcast on the sender side is supported on following desktop browsers - Chrome and Microsoft Edge. Simulcast on receiver side is supported on all platforms that Azure Communication Services Calling supports. Support for Sender side Simulcast capability from mobile browsers is planned for a future release.

## How simulcast works

The simulcast feature enables a publisher, in this case the Azure Communication Services calling SDK, to send different qualities of the same video to the selective forwarding unit (SFU). The SFU then forwards the most suitable quality to each other endpoint on a call, based on their bandwidth, CPU, and resolution preferences. This way, the publisher can save resources and the subscribers can receive the best possible quality. The SFU doesn't change the video quality. The SFU only selects which one to forward.

## Supported number of video qualities available with Simulcast

Simulcast streaming from a web endpoint supports a maximum two video qualities. There aren't API controls needed to enable Simulcast for Azure Communication Services. Simulcast is enabled and available for all video calls.

## Available video resolutions

When a participant is streaming with simulcast, there are no set resolutions for high or low quality simulcast video streams. Instead, based on many different variables, either a single or multiple video streams are delivered. If every subscriber to video is requesting and capable of receiving maximum resolution what publisher can provide, only that it sends maximum resolution.

Simulcast supports the following resolutions:

- 1080p
- 720p
- 540p
- 360p
- 240p
- 180p