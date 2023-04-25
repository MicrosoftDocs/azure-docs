---
title: include file
description: java call recording bring your own storage
services: azure-communication-services
author: dbasantes
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 03/17/2023
ms.topic: include
ms.custom: include file
ms.author: dbasantes
---

## Using Azure blob storage for external storage

```java
StartRecordingOptions recordingOptions = new StartRecordingOptions(new ServerCallLocator("<serverCallId>"))
                .setExternalStorage(new BlobStorage("<Insert Container / Blob Uri>"));

Response<StartCallRecordingResult> response = callAutomationClient.getCallRecording()
.startRecordingWithResponse(recordingOptions, null);
```
