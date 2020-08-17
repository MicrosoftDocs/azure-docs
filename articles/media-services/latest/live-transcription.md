---
title: Live transcription
titleSuffix: Azure Media Services
description: Learn about Azure Media Services live transcription.  
services: media-services
documentationcenter: ''
author: IngridAtMicrosoft
manager: femila
editor: ''
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: ne
ms.topic: article
ms.date: 06/12/2019
ms.author: inhenkel

---

# Live transcription (preview)

Azure Media Service delivers video, audio, and text in different protocols. When you publish your live stream using MPEG-DASH or HLS/CMAF, then along with video and audio, our service delivers the transcribed text in IMSC1.1 compatible TTML. The delivery is packaged into MPEG-4 Part 30 (ISO/IEC 14496-30) fragments. If using delivery via HLS/TS, then text is delivered as chunked VTT.

Additional charges apply when live transcription is turned on. Please review the pricing information in the Live Video section of the [Media Services pricing page](https://azure.microsoft.com/pricing/details/media-services/).

This article describes how to enable live transcription when streaming a Live Event with Azure Media Services. Before you continue, make sure you're familiar with the use of Media Services v3 REST APIs (see [this tutorial](stream-files-tutorial-with-rest.md) for details). You should also be familiar with the [live streaming](live-streaming-overview.md) concept. It's recommended to complete the [Stream live with Media Services](stream-live-tutorial-with-api.md) tutorial.

## Live transcription preview regions and languages

Live transcription is available in the following regions:

- Southeast Asia
- West Europe
- North Europe
- East US
- Central US
- South Central US
- West US 2
- Brazil South

This is the list of available languages that can be transcribed, use the language code in the API.

| Language | Language code |
| -------- | ------------- |
| Catalan  | ca-ES |
| Danish (Denmark) | da-DK |
| German (Germany) | de-DE |
| English (Australia) | en-AU |
| English (Canada) | en-CA |
| English (United Kingdom) | en-GB |
| English (India) | en-IN |
| English (New Zealand) | en-NZ |
| English (United States) | en-US |
| Spanish (Spain) | es-ES |
| Spanish (Mexico) | es-MX |
| Finnish (Finland) | fi-FI |
| French (Canada) | fr-CA |
| French (France) | fr-FR |
| Italian (Italy) | it-IT |
| Dutch (Netherlands) | nl-NL |
| Portuguese (Brazil) | pt-BR |
| Portuguese (Portugal) | pt-PT |
| Swedish (Sweden) | sv-SE |

## Create the live event with live transcription

To create a live event with the transcription turned on, send the PUT operation with the 2019-05-01-preview API version, for example:

```
PUT https://management.azure.com/subscriptions/:subscriptionId/resourceGroups/:resourceGroupName/providers/Microsoft.Media/mediaServices/:accountName/liveEvents/:liveEventName?api-version=2019-05-01-preview&autoStart=true 
```

The operation has the following body (where a pass-through Live Event is created with RTMP as the ingest protocol). Note the addition of a transcriptions property.

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

## Start or stop transcription after the live event has started

You can start and stop live transcription while the live event is in running state. For more information about starting and stopping live events, read the Long-running operations section at [Develop with Media Services v3 APIs](media-services-apis-overview.md#long-running-operations).

To turn on live transcriptions or to update the transcription language, patch the live event to include a “transcriptions” property. To turn off live transcriptions, remove the “transcriptions” property from the live event object.  

> [!NOTE]
> Turning the transcription on or off **more than once** during the live event is not a supported scenario.

This is the sample call to turn on live transcriptions.

PATCH: ```https://management.azure.com/subscriptions/:subscriptionId/resourceGroups/:resourceGroupName/providers/Microsoft.Media/mediaServices/:accountName/liveEvents/:liveEventName?api-version=2019-05-01-preview```

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

## Transcription delivery and playback

Review the [Dynamic packaging overview](dynamic-packaging-overview.md#to-prepare-your-source-files-for-delivery) article of how our service uses dynamic packaging to deliver video, audio, and text in different protocols. When you publish your live stream using MPEG-DASH or HLS/CMAF, then along with video and audio, our service delivers the transcribed text in IMSC1.1 compatible TTML. This delivery is packaged into MPEG-4 Part 30 (ISO/IEC 14496-30) fragments. If using delivery via HLS/TS, then the text is delivered as chunked VTT. You can use a web player such as the [Azure Media Player](use-azure-media-player.md) to play the stream.  

> [!NOTE]
> If using Azure Media Player, use version 2.3.3 or later.

## Known issues

For preview, the following are known issues with live transcription:

- Apps need to use the preview APIs, described in the [Media Services v3 OpenAPI Specification](https://github.com/Azure/azure-rest-api-specs/blob/master/specification/mediaservices/resource-manager/Microsoft.Media/preview/2019-05-01-preview/streamingservice.json).
- Digital rights management (DRM) protection does not apply to the text track, only AES envelope encryption is possible.

## Next steps

* [Media Services overview](media-services-overview.md)
