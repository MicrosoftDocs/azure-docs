---
title: Azure Communication Services Simulcast
titleSuffix: An Azure Communication Services concept document
description: Overview of Simulcast
author: chriswhilar
manager: artur.kania@skype.net
services: azure-communication-services

ms.author: chwhilar
ms.date: 11/21/2022
ms.topic: conceptual
ms.service: azure-communication-services
---
# Simulcast

Simulcast is supported starting from 1.9.1-beta.1+ release of Azure Communication Services Calling Web SDK. Currently, simulcast on the sender side is supported on following desktop browsers - Chrome and Edge. Simulcast on receiver side is supported on all platforms that Azure Communication Services Calling supports.
Support for Sender side Simulcast capability from mobile browsers will be added in the future.

Simulcast is a technique by which an endpoint encodes the same video feed using different qualities, sends these video feeds of multiple qualities to a selective forwarding unit – SFU that decides which of the receivers gets which quality.  
The lack of simulcast support leads to a degraded video experience in calls with three or more participants. If a video receiver with poor network conditions joins the conference, it will impact the quality of video received from the sender without simulcast support for all other participants. This is because the video sender will optimize its video feed against the lowest common denominator. With simulcast, the impact of lowest common denominator will be minimized. That is because the video sender will produce specialized low fidelity video encoding for a subset of receivers that run on poor networks (or otherwise constrained).  
## Scenarios where simulcast is useful
- Users with unknown bandwidth constraints joining. When a new joiner joins the call, its bandwidth conditions are unknown when starting to receive video. It will not be sent high quality content before reliable estimation of its bandwidth is known to prevent overshooting the available bandwidth. In unicast, if everyone was receiving high quality content, then that would cause degradation for every other receiver until the reliable estimate of the bandwidth conditions can be achieved. In simulcast, lower resolution video can be sent to the new joiner until its’ bandwidth conditions are known while other keep receiving high quality video.
In a similar way, if one of the receivers is on poor network, video quality of all other receivers on good network will be degraded to accommodate for the receiver on poor network in unicast. But in simulcast, lower resolution/bitrate content can be sent to the receiver on poor network and higher resolution/bitrate content can be sent to receivers on good network.
- In content sharing, where thumbnails are often used for video content, lower resolution videos are requested from the producers. If in parallel zooming of someone’s video is needed, zoomed video will be low quality to prevent others looking at the content not to receive both content and video at high quality thus wasting bandwidth.
- When video is sent to a receiver who has a larger view(like a desktop receiver. On desktop, videos are usually rendered on big views) than another receiver who has a smaller view(like a mobile receiver. Mobile screens are usually small). With simulcast, the quality of the larger view will not be affected by the quality of the smaller view. Sender will send a high resolution to the larger view receiver and a smaller resolution to the smaller view receiver.

## How it's used/works
Simulcast is adaptively enabled on-demand to save bandwidth and CPU resources of the publisher. 
Subscribers notify SFU of its maximum resolution preference based on the size of the renderer element. 
SFU tracks the bandwidth conditions and resolution requirements of all current subscribers to the publisher’s video and forwards the aggregated parameters of all subscribers to the publisher. Publisher will pick the best set of parameters to give optimal quality to all receivers considering all publisher’s and subscribers’ constraints. 
SFU will receive multiple qualities  of the content and will choose the quality to forward to the subscriber. There will be no transcoding of the content on the SFU. SFU won't forward higher resolution than requested by the subscriber.
## Limitations
Web endpoints support simulcast only for video content with maximum two distinct qualities. 
## Resolutions
In adaptive simulcast, there are no set resolutions for high- and low-quality video streams. Optimal set of either single or multiple streams are chosen. If every subscriber to video is requesting and capable of receiving maximum resolution what publisher can provide, only that maximum resolution will be sent.
Following resolutions are supported and requested by the receivers in web simulcast – 180p, 240p, 360p, 540p, 720p.
In limited input resolution, resolution received will be capped at that resolution.
In simulcast, effective resolution sent can be also degraded internally, thus actual received resolution of video can vary.
