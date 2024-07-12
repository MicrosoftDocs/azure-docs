---
title: Video issues - The video sender has high CPU load
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Learn how to troubleshoot poor video quality when the sender has high CPU load.
author: enricohuang
ms.author: enricohuang

services: azure-communication-services
ms.date: 04/05/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# The video sender has high CPU load
When the web browser detects high CPU load or poor network conditions, it can apply extra restraints on the output video resolution. If the user's machine has high CPU load, the final resolution sent out can be lower than the intended resolution.
It's an expected behavior, as lowering the encoding resolution can reduce the CPU load.
It's important to note that the browser controls this behavior, and we're unable to control it at the JavaScript layer.

## How to detect in the SDK
There's [`qualityLimitationReason`](https://developer.mozilla.org/en-US/docs/Web/API/RTCOutboundRtpStreamStats/qualityLimitationReason) in WebRTC Stats API, which can provide a detailed reason why the media quality in the stream is reduced. However, the Azure Communication Services WebJS SDK doesn't expose this information.

## How to mitigate or resolve
When the browser detects high CPU load, it degrades the encoding resolution, which isn't an issue from the SDK perspective.
If a user wants to improve the quality of the video they're sending, they should check their machine and identify which processes are causing high CPU load.
