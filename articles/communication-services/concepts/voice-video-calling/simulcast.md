---
title: Azure Communication Services Simulcast
titleSuffix: An Azure Communication Services concept document
description: Overview of Simulcast - how sending multiple video quality streams helps overall call quality
author: chriswhilar
manager: artur.kania@skype.net
services: azure-communication-services

ms.author: chwhilar
ms.date: 11/21/2022
ms.topic: conceptual
ms.service: azure-communication-services
---
# What is Simulcast?
Simulcast is a technique that allows video streaming applications to send multiple versions of the same video content at different resolutions and bitrates. This way, the receiver can choose the most suitable version based on their network conditions and device capabilities. 

The lack of simulcast support leads to a degraded video experience in calls with three or more participants. If a video receiver with poor network conditions joins the conference, it impacts the quality of video received from the sender without simulcast support for all other participants. The video sender optimizes its video feed against the lowest common denominator. When simulcast streaming is available the potential impact of one person affecting the entire streaming quality experience is minimized.

Simulcast is supported on Azure Communication Services SDK for WebJS (1.9.1-beta.1+) and native SDK for Android, iOS, and Windows. Currently, simulcast on the sender side is supported on following desktop browsers - Chrome and Edge. Simulcast on receiver side is supported on all platforms that Azure Communication Services Calling supports. Support for Sender side Simulcast capability from mobile browsers will be added in the future.

## How Simulcast works
Simulcast is a feature that allows a publisher, in this case the ACS calling SDK, to send different qualities of the same video to the SFU. The SFU then forwards the most suitable quality to each other endpoint on a call, based on their bandwidth, CPU, and resolution preferences. This way, the publisher can save resources and the subscribers can receive the best possible quality. The SFU doesn't change the video quality, it only selects which one to forward.

## Supported number of video qualities available with Simulcast.
Simulcast streaming from a web endpoint supports a maximum two video qualities. There aren't API controls needed to enable Simulcast for ACS. Simulcast is enabled and available for all video calls.

## Available video resolutions
When streaming with simulcast, there are no set resolutions for high or low quality simulcast video streams. Instead, based on many different variables, either a single or multiple video steams are delivered. If every subscriber to video is requesting and capable of receiving maximum resolution what publisher can provide, only that maximum resolution will be sent. The following resolutions are supported:
- 720p
- 540p
- 360p
- 240p
- 180p
