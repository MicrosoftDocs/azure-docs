---
title: Azure Media Services live transcription | Microsoft Docs
description: This article explains what the Azure Media Services live transcription is.  
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

Azure Media Service delivers video, audio, and now text in different protocols. When you publish your live stream using MPEG-DASH or HLS/CMAF, then along with video and audio, our service will deliver the transcribed text in IMSC1.1 compatible TTML, packaged into MPEG-4 Part 30 (ISO/IEC 14496-30) fragments. If using delivery via HLS/TS, then text is delivered as chunked VTT. 

This article describes how to enable live transcription when streaming a Live Event with Azure Media Services v3. Before you proceed, make sure you are familiar with the use of Media Services v3 REST APIs (see [this tutorial](stream-files-tutorial-with-rest.md) for details). You should also be familiar with the [live streaming](live-streaming-overview.md) concept. It is recommended to complete the [Stream live with Media Services](stream-live-tutorial-with-api.md) tutorial. 

> [!NOTE]
> Currently, live transcription is only available as a preview feature in the West US 2 region. It supports transcription of spoken words in English to text. The API reference for this feature is in this document – since it is in preview, the details are not available with our REST documents. 

## Creating the Live Event 

To create the Live Event, you would send the PUT operation to the 2019-05-01-preview version, such as: 

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

You should poll the status of the Live Event until it goes into the “Running” state, which indicates that you can now send a contribution RTMP feed. You can now follow the same steps as in this tutorial, such as checking the preview feed, and creating Live Outputs. 

## Delivery and playback 

Review the [Dynamic packaging overview](dynamic-packaging-overview.md#to-prepare-your-source-files-for-delivery) article of how our service uses dynamic packaging to deliver video, audio, and now text in different protocols. When you publish your live stream using MPEG-DASH or HLS/CMAF, then along with video and audio, our service will deliver the transcribed text in IMSC1.1 compatible TTML, packaged into MPEG-4 Part 30 (ISO/IEC 14496-30) fragments. If using delivery via HLS/TS, then text is delivered as chunked VTT. You can use a web player such as the [Azure Media Player](use-azure-media-player.md) to play the stream.  

> [!NOTE]
>  If using Azure Media Player, use version 2.3.3 or later.

## Known issues 

At preview, following are the known issues with Live Transcription 

* The feature is available only in West US 2.
* Applications need to use the preview APIs, described in the [Media Services v3 OpenAPI Specification](https://github.com/Azure/azure-rest-api-specs/blob/master/specification/mediaservices/resource-manager/Microsoft.Media/preview/2019-05-01-preview/streamingservice.json) specification.
* The only supported language is English (en-us).
* With respect to content protection, only AES envelope encryption is supported.

## Next steps

[Media Services overview](media-services-overview.md)
