---
title: Azure Media Services live event error codes | Microsoft Docs
description: This article lists live event error codes.
author: IngridAtMicrosoft
manager: femila
editor: ''
services: media-services
documentationcenter: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/4/2020
ms.author: inhenkel

---

# Media Services Live Event error codes

The tables in this section list the [Live Event](live-events-outputs-concept.md) error codes.

## LiveEventConnectionRejected

When you subscribe to the [Event Grid](https://docs.microsoft.com/azure/event-grid/) events for a live event, you may see one of the following errors from the [LiveEventConnectionRejected](media-services-event-schemas.md#liveeventconnectionrejected)  event.

| Result code | Description |
| ----------- | ----------- |
| MPE_RTMP_APPID_AUTH_FAILURE | Incorrect ingest URL |
| MPE_INGEST_ENCODER_CONNECTION_DENIED | Encoder IP isn't present in IP allow list configured |
| MPE_INGEST_RTMP_SETDATAFRAME_NOT_RECEIVED | The RTMP encoder did not send setDataFrame command. |
| MPE_INGEST_CODEC_NOT_SUPPORTED | Codec specified isn't supported. |
| MPE_INGEST_DESCRIPTION_INFO_NOT_RECEIVED |The media description information was not received before the actual media data was delivered.|
| MPE_INGEST_MEDIA_QUALITIES_EXCEEDED |The count of qualities for audio or video type exceeded the maximum allowed limit.|
| MPE_INGEST_BITRATE_AGGREGATED_EXCEEDED |The total incoming bitrate in a live event or channel service exceeded the maximum allowed limit.|
| MPE_RTMP_FLV_TAG_TIMESTAMP_INVALID | The timestamp for video or audio FLVTag is invalid from RTMP encoder. |
| MPE_INGEST_FRAMERATE_EXCEEDED | The incoming encoder ingested streams with framerates exceeded the maximum allowed 30fps for encoding live events/channels.|
| MPE_INGEST_VIDEO_RESOLUTION_NOT_SUPPORTED | The incoming encoder ingested streams exceeded the following allowed resolutions: 1920x1088 for encoding live events/channels and 4096 x 2160 for pass-through live events/channels.|
| MPE_INGEST_RTMP_TOO_LARGE_UNPROCESSED_FLV | The live event has received a large amount of audio data at once, or a large amount of video data without any key frames. We have disconnected the encoder in order to give it a chance to retry with correct data. |

## LiveEventEncoderDisconnected

You may see one of the following errors from the [LiveEventEncoderDisconnected](media-services-event-schemas.md#liveeventencoderdisconnected) event.

|Result code|Description|
|---|---|
|MPE_RTMP_SESSION_IDLE_TIMEOUT|RTMP session timed out after being idle for allowed time limit.|
|MPE_RTMP_FLV_TAG_TIMESTAMP_INVALID|The timestamp for video or audio FLVTag is invalid from RTMP encoder.|
|MPE_CAPACITY_LIMIT_REACHED|Encoder sending data too fast.|
|Unknown error codes|These error codes can range from memory error to duplicate entries in hash map.|


## See also

[Streaming Endpoint (Origin) error codes](streaming-endpoint-error-codes.md)

## Next steps

[Tutorial: Stream live with Media Services](stream-live-tutorial-with-api.md)
