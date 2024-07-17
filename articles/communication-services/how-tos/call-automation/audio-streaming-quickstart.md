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

Example of audio data being streamed:

``` json
{
  "kind": "AudioData",
  "audioData": {
    "timestamp": "2022-10-03T19:16:12.925Z",
    "participantRawID": "8:acs:3d20e1de-0f28-41c5-84a0-4960fde5f411_0000000b-faeb-c708-99bf-a43a0d0036b0",
    "data": "5ADwAOMA6AD0AOIA4ADkAN8AzwDUANEAywC+ALQArgC0AKYAnACJAIoAlACWAJ8ApwCiAKkAqgCqALUA0wDWANAA3QDVAN0A8wDzAPAA7wDkANkA1QDPAPIA6QDmAOcA0wDYAPMA8QD8AP0AAwH+AAAB/QAAAREBEQEDAQoB9wD3APsA7gDxAPMA7wDpAN0A6gD5APsAAgEHAQ4BEAETARsBMAFHAUABPgE2AS8BKAErATEBLwE7ASYBGQEAAQcBBQH5AAIBBwEMAQ4BAAH+APYA6gDzAPgA7gDkAOUA3wDcANQA2gDWAN8A3wDcAMcAxwDIAMsA1wDfAO4A3wDUANQA3wDvAOUA4QDpAOAA4ADhAOYA5wDkAOUA1gDxAOcA4wDpAOEA4gD0APoA7wD9APkA6ADwAPIA7ADrAPEA6ADfANQAzQDLANIAzwDaANcA3QDZAOQA4wDXANwA1ADbAOsA7ADyAPkA7wDiAOIA6gDtAOsA7gDeAOIA4ADeANUA6gD1APAA8ADgAOQA5wDgAPgA8ADnAN8A5gDgAOoA6wDcAOgA2gDZANUAyQDPANwA3gDgAO4A8QDyAAQBEwEDAewA+gDpAN4A6wDeAO8A8QDwAO8ABAEKAQUB/gD5AAMBAwEIARoBFAEeARkBDgH8AP0A+gD8APcA+gDrAO0A5wDcANEA0QDHAM4A0wDUAM4A0wDZANQAxgDSAM4A1ADVAOMA4QDhANUA2gDjAOYA5wDrANQA5wDrAMsAxQDWANsA5wDpAOEA4QDFAMoA0QDKAMgAwgDNAMsAwgCwAKkAtwCrAKoAsACgAJ4AlQCeAKAAoQCmAKwApwCsAK0AnQCVAA==",
    "silent": false
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
