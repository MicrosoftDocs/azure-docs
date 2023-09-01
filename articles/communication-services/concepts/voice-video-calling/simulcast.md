---
title: Azure Communication Services Simulcast
titleSuffix: An Azure Communication Services concept document
description: Overview of Simulcast - how sending multiple video quality rendentations helps overall call quality
author: chriswhilar
manager: artur.kania@skype.net
services: azure-communication-services

ms.author: chwhilar
ms.date: 11/21/2022
ms.topic: conceptual
ms.service: azure-communication-services
---
# Simulcast
Simulcast is a technique that allows video streaming applications to send multiple versions of the same video content at different resolutions and bitrates. This way, the receiver can choose the most suitable version based on their network conditions and device capabilities. 

The lack of simulcast support leads to a degraded video experience in calls with three or more participants. If a video receiver with poor network conditions joins the conference, it will impact the quality of video received from the sender without simulcast support for all other participants. This is because the video sender optimizes its video feed against the lowest common denominator. With simulcast, the impact of lowest common denominator is minimized because the video sender produces specialized low fidelity video encoding for a subset of receivers that run on poor networks (or otherwise constrained).

Simulcast is supported on Azure Communication Services SDK for WebJS (1.9.1-beta.1+) and native SDK for Android, iOS, and Windows. Currently, simulcast on the sender side is supported on following desktop browsers - Chrome and Edge. Simulcast on receiver side is supported on all platforms that Azure Communication Services Calling supports. Support for Sender side Simulcast capability from mobile browsers will be added in the future.

## How Simulcast works
Simulcast is adaptively enabled on-demand to save bandwidth and CPU resources of the publisher. Subscribers notify SFU of its maximum resolution preference based on the size of the renderer element. SFU tracks the bandwidth conditions and resolution requirements of all current subscribers to the publisher’s video and forwards the aggregated parameters of all subscribers to the publisher. Publisher will pick the best set of parameters to give optimal quality to all receivers considering all publisher’s and subscribers’ constraints. 
SFU will receive multiple qualities  of the content and will choose the quality to forward to the subscriber. There will be no transcoding of the content on the SFU. SFU won't forward higher resolution than requested by the subscriber.

## Limitations
Web endpoints support simulcast only for video content with maximum two distinct qualities. 

## Resolutions
In adaptive simulcast, there are no set resolutions for high- and low-quality video streams. Optimal set of either single or multiple streams are chosen. If every subscriber to video is requesting and capable of receiving maximum resolution what publisher can provide, only that maximum resolution will be sent.
Following resolutions are supported and requested by the receivers in web simulcast – 180p, 240p, 360p, 540p, 720p.
In limited input resolution, resolution received will be capped at that resolution.
In simulcast, effective resolution sent can be also degraded internally, thus actual received resolution of video can vary.
