---
title: Video issues - The video sender has high CPU load
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Learn how to troubleshoot poor video quality when the sender has high CPU load
author: enricohuang
ms.author: enricohuang

services: azure-communication-services
ms.date: 02/24/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# The video sender has high CPU load
When the web browser detects high CPU load or poor network conditions, it can apply additional constraints on the video encoder.
If the user's machine has high CPU load, the final resolution sent out can be lower than the intended resolution.
This is an expected behavior, as lowering the encoding resolution can reduce the CPU load.
It's important to note that this behavior is controlled by the browser, and we are unable to control it at the JavaScript layer.

## How to detect
### SDK
Although WebRTC Stats API provides `qualityLimitationReason` in the stats report, the ACS Web Calling SDK currently has no plans to expose this information in the MediaStats feature.

## How to mitigate or resolve
When the browser detects high CPU load, it degrades the encoding resolution.
Usually, this is not an issue from the SDK perspective.
If a user wants to improve the quality of the video they are sending, they should check their machine and identify which processes are causing high CPU load.
