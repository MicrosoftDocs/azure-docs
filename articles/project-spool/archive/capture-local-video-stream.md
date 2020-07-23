---
title: Capture A Local Video Stream
description: TODO
author: mikben    
manager: jken
services: azure-project-spool

ms.author: mikben
ms.date: 03/10/2020
ms.topic: overview
ms.service: azure-project-spool

---

> [!WARNING]
> This document is under construction.


## Capture A Local Video Stream

In this quickstart, you'll learn how to capture a local video stream from a camera-equipped device using the Azure Communication Services SDK.

### Prerequisites
- An active Azure Communication Services resource. [This quickstart](./get-started.md) shows you how to create and manage your first resource.
- A camera-equipped device with the latest version of Chrome or Edge installed.
- The ACS client-side JS SDK.


### Capture The Stream

A media stream can be captured and displayed after you create an instance of the ACS calling client:


```javascript
    
    const tokenCredential = new UserAccessTokenCredential(token);
    const callClient = await CallingFactory.create(tokenCredential);
    const cameraDevice = (await callClient.deviceManager.getCameraList())[0];
    const target = $('#video-canvas')[0];
    
    callClient.deviceManager.renderPreviewVideo(cameraDevice, target, 'Fit').then(
            previewRenderer => {
                // todo: discuss previewRenderer
            }
        );
```

