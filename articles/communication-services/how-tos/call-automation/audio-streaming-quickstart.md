---
title: Audio streaming quickstart
titleSuffix: An Azure Communication Services quickstart document
description: Provides a quick start for developers to get audio streams through audio streaming APIs from Azure Communication Services calls.
author: alvin
ms.service: azure-communication-services
ms.topic: include
ms.date: 7/15/2024
ms.author: alvinhan
ms.custom: 
services: azure-communication-services
zone_pivot_groups: acs-js-csharp-java-python
---

# Quickstart: Server-side Audio Streaming

[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include-document.md)]

Get started with using audio streams through Azure Communication Services Audio Streaming API. This quickstart assumes you're already familiar with Call Automation APIs to build an automated call routing solution. 

Functionality described in this quickstart is currently in public preview.

::: zone pivot="programming-language-csharp"
[!INCLUDE [Audio Streaming with .NET](./includes//audio-streaming-quickstart-csharp.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [Audio Streaming with Java](./includes/audio-streaming-quickstart-java.md)]
::: zone-end

::: zone pivot="programming-language-javascript"
[!INCLUDE [Audio Streaming with JavaScript](./includes/audio-streaming-quickstart-js.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [Audio Streaming with Python](./includes/audio-streaming-quickstart-python.md)]
::: zone-end


## Audio streaming schema
After sending through the metadata packet, Azure Communication Services will start streaming audio media to your WebSocket server. Below is an example of what the media object your server will receive looks like. 

``` code
{
    "kind": <string>, // What kind of data this is, e.g. AudioMetadata, AudioData.
    "audioData":{
        "data": <string>, // Base64 Encoded audio buffer data
        "timestamp": <string>, // In ISO 8601 format (yyyy-mm-ddThh:mm:ssZ) 
        "participantRawID": <string>, 
        "silent": <boolean> // Indicates if the received audio buffer contains only silence.
    }
}
```


## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../../quickstarts/create-communication-resource.md#clean-up-resources).

## Next steps
- Learn more about [Audio Streaming](../../concepts/call-automation/audio-streaming-concept.md).
- Learn more about [Call Automation](../../concepts/call-automation/call-automation.md) and its features. 
- Learn more about [Play action](../../concepts/call-automation/play-action.md).
- Learn more about [Recognize action](../../concepts/call-automation/recognize-action.md).
