---
title: Azure Communication Services - Known issues
description: Learn about known issues with Azure Communication Services
author: mikben
manager: jken
services: azure-communication-services

ms.author: mikben
ms.date: 10/03/2020
ms.topic: troubleshooting
ms.service: azure-communication-services
---

# FAQ
This part of the article provides information about the frequently asked questions with Azure Communication Services.

## Why the quality of my video is bad?

Quality of video stream send from device is driven by the size of the renderer(s) of all other participants that render that stream and depend on the resolution of the client-side renderer that was used to initiate that stream. When subscribing to a remote stream, a receiver will determine its own resolution based on the sender's client-side renderer dimensions.

## Why it's not possible enumerate/select mic/speaker devices on Safari?

Application can't enumerate/select mic/speaker devices ( e.g. bluetooth ) on Safari iOS/iPad. It's a limitation of OS and there's always only 1 device.
Safari on MacOS - app can't enumerate/select speaker through ACS Device Manager - these have to updated via OS but if you use Chrome on MacOS - app can enumerate/select speaker through ACS Device Manager.

# Known issues: Azure Communication Services

This article provides information about known issues associated with Azure Communication Services.

## Repeatedly switching video devices may cause video streaming to temporarily stop

Switching between video devices may cause your video stream to pause while the stream is acquired from the selected device.

### Possible causes
Streaming from and switching between media devices is computationally intensive. Switching frequently can cause performance degradation. Developers are encouraged to stop one device stream before starting another.
