---
title: Live transcription
titleSuffix: Azure Media Services
description: Learn about Azure Media Services live transcription.  
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: ne
ms.topic: article
ms.date: 11/19/2019
ms.author: juliako

---

# Live transcription (preview)

Azure Media Service delivers video, audio, and text in different protocols. When you publish your live stream using MPEG-DASH or HLS/CMAF, then along with video and audio, our service delivers the transcribed text in IMSC1.1 compatible TTML. The delivery is packaged into MPEG-4 Part 30 (ISO/IEC 14496-30) fragments. If using delivery via HLS/TS, then text is delivered as chunked VTT.

This article describes how to enable live transcription when streaming a Live Event with Azure Media Services v3. Before you continue, make sure you're familiar with the use of Media Services v3 REST APIs (see [this tutorial](stream-files-tutorial-with-rest.md) for details). You should also be familiar with the [live streaming](live-streaming-overview.md) concept. It's recommended to complete the [Stream live with Media Services](stream-live-tutorial-with-api.md) tutorial.

> [!NOTE]
> Currently, live transcription is only available as a preview feature in the West US 2 region. It supports transcription of spoken words in English to text. The API reference for this feature is located below—becasuse it's in preview, the details aren't available with our REST documents.

## Creating the Live Event

To create the Live Event, you send the PUT operation to the 2019-05-01-preview version, for example:

```
PUT https://management.azure.com/subscriptions/:subscriptionId/resourceGroups/:resourceGroupName/providers/Microsoft.Media/mediaServices/:accountName/liveEvents/:liveEventName?api-version=2019-05-01-preview&autoStart=true 
```

The operation has the following body (where a pass-through Live Event is created with RTMP as the ingest protocol). Note the addition of a transcriptions property. The only allowed value for language is en-US.

```
{ 
  "properties": { 
    "description": "Demonstrate how to enable live transcriptions", 
    "input": { 
      "streamingProtocol": "RTMP", 
      "accessControl": { 
        "ip": { 
          "allow": [ 
            { 
              "name": "Allow All", 
              "address": "0.0.0.0", 
              "subnetPrefixLength": 0 
            } 
          ] 
        } 
      } 
    }, 
    "preview": { 
      "accessControl": { 
        "ip": { 
          "allow": [ 
            { 
              "name": "Allow All", 
              "address": "0.0.0.0", 
              "subnetPrefixLength": 0 
            } 
          ] 
        } 
      } 
    }, 
    "encoding": { 
      "encodingType": "None" 
    }, 
    "transcriptions": [ 
      { 
        "language": "en-US" 
      } 
    ], 
    "vanityUrl": false, 
    "streamOptions": [ 
      "Default" 
    ] 
  }, 
  "location": "West US 2" 
} 
```

Poll the status of the Live Event until it goes into the "Running" state, which indicates that you can now send a contribution RTMP feed. You can now follow the same steps as in this tutorial, like checking the preview feed and creating Live outputs.

## Transcription delivery and playback

Review the [Dynamic packaging overview](dynamic-packaging-overview.md#to-prepare-your-source-files-for-delivery) article of how our service uses dynamic packaging to deliver video, audio, and text in different protocols. When you publish your live stream using MPEG-DASH or HLS/CMAF, then along with video and audio, our service delivers the transcribed text in IMSC1.1 compatible TTML. This delivery is packaged into MPEG-4 Part 30 (ISO/IEC 14496-30) fragments. If using delivery via HLS/TS, then the text is delivered as chunked VTT. You can use a web player such as the [Azure Media Player](use-azure-media-player.md) to play the stream.  

> [!NOTE]
> If using Azure Media Player, use version 2.3.3 or later.

## Known issues

For preview, the following are known issues with live transcription:

* The feature is available only in West US 2.
* Apps need to use the preview APIs, described in the [Media Services v3 OpenAPI Specification](https://github.com/Azure/azure-rest-api-specs/blob/master/specification/mediaservices/resource-manager/Microsoft.Media/preview/2019-05-01-preview/streamingservice.json).
* The only supported language is English (en-us).
* With content protection, only AES envelope encryption is supported.

## Next steps

* [Media Services overview](media-services-overview.md)
