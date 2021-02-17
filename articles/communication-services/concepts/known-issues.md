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

# Known issues: Azure Communication Services

This article provides information about known issues associated with Azure Communication Services.

## Video streaming quality on Chrome/Android 

Video streaming performance may be degraded on Chrome Android.

### Possible causes
The quality of remote streams depend on the resolution of the client-side renderer that was used to initiate that stream. When subscribing to a remote stream, a receiver will determine its own resolution based on the sender's client-side renderer dimensions.

## Bluetooth headset microphones are not detected

You may experience issues connecting your bluetooth headset to a Communication Services call.

### Possible causes
There isn't an option to select Bluetooth microphone on iOS.


## Repeatedly switching video devices may cause video streaming to temporarily stop

Switching between video devices may cause your video stream to pause while the stream is acquired from the selected device.

### Possible causes
Streaming from and switching between media devices is computationally intensive. Switching frequently can cause performance degradation. Developers are encouraged to stop one device stream before starting another.
