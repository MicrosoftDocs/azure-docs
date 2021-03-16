---
title: Azure Communication Services - FAQ / Known issues
description: Learn more about Azure Communication Services
author: mikben
manager: jken
services: azure-communication-services

ms.author: mikben
ms.date: 03/10/2021
ms.topic: troubleshooting
ms.service: azure-communication-services
---

# FAQ / Known issues
This article provides information about known issues and frequently asked questions related to Azure Communication Services.

## FAQ

### Why is the quality of my video degraded?

The quality of video streams is determined by the size of the client-side renderer that was used to initiate that stream. When subscribing to a remote stream, a receiver will determine its own resolution based on the sender's client-side renderer dimensions.

### Why is it not possible to enumerate/select mic/speaker devices on Safari?

Applications can't enumerate/select mic/speaker devices (like bluetooth) on Safari iOS/iPad. It's a limitation of the OS - there's always only one device.

For Safari on MacOS - app can't enumerate/select speaker through Communication Services Device Manager - these have to be selected via the OS. If you use Chrome on MacOS, the app can enumerate/select devices through the Communication Services Device Manager.

## Known issues

This section provides information about known issues associated with Azure Communication Services.

### Repeatedly switching video devices may cause video streaming to temporarily stop

Switching between video devices may cause your video stream to pause while the stream is acquired from the selected device.

#### Possible causes
Streaming from and switching between media devices is computationally intensive. Switching frequently can cause performance degradation. Developers are encouraged to stop one device stream before starting another.
