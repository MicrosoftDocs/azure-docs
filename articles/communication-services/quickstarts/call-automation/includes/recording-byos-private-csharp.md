---
title: include file
description: C# call recording bring your own storage
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

```csharp
StartRecordingOptions recordingOptions = new StartRecordingOptions(new ServerCallLocator("<serverCallId>"))
{
    //...
    ExternalStorage = new BlobStorage(new Uri("<Insert Container / Blob Uri>"))
};
               
Response<RecordingStateResult> startRecordingWithResponse = await callAutomationClient.GetCallRecording()
        .StartRecordingAsync(options: recordingOptions);
```
