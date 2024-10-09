---
title: Quickstart - Add volume indicator to your Android calling app
titleSuffix: An Azure Communication Services document
description: In this quickstart, you'll learn how to check call volume within your calling app when using Azure Communication Services.
author: sloanster

ms.author: chengyuanlai
ms.date: 03/26/2024
ms.topic: include
ms.service: azure-communication-services
ms.subservice: calling
---

[!INCLUDE [Public Preview](../../../../includes/public-preview-include-document.md)]

As a developer you can have control over checking microphone volume. This quickstart shows examples of how to accomplish it within the Azure Communication Services Calling SDK.

## Checking the local audio stream volume
As a developer it can be nice to have the ability to check and display to end users the current local microphone volume level. Azure Communication Services calling API exposes this information using `getVolumeLevel`. The `getVolumeLevel` value is a float number ranging from 0 to 1 (with 0 noting zero audio detected, 100 as the max level detectable, -1 noting a failed operation).

### Example usage
This example shows how to generate the volume level by accessing `getVolumeLevel` of the local audio stream.

```java
//Get the volume of the local audio source
OutgoingAudioStream stream = call.getActiveOutgoingAudioStream();
try{
    float volume = stream.getVolumeLevel();
}catch (Exception e) {
    e.printStackTrace();
}
```

