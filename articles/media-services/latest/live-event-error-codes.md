---
title: Azure Media Services live event error codes 
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
ms.topic: error-reference
ms.date: 02/11/2020
ms.author: inhenkel

---

# Media Services Live Event error codes

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

The tables in this section list the [Live Event](live-events-outputs-concept.md) error codes.

## LiveEventConnectionRejected

When you subscribe to the [Event Grid](../../event-grid/index.yml) events for a live event, you may see one of the following errors from the [LiveEventConnectionRejected](media-services-event-schemas.md#liveeventconnectionrejected) event.

>[!div class="mx-tdBreakAll"]
>| **Result code** | **Description** | **Suggested solution** |
>|--|--|--|
>| MPE_RTMP_APPID_AUTH_FAILURE | Incorrect ingest URL | APPID is a GUID token in RTMP ingest URL. Make sure it matches with Ingest URL from API. |
>| MPE_INGEST_ENCODER_CONNECTION_DENIED | Encoder IP isn't present in IP allow list configured | Make sure encoder's IP is in IP Allow List. Use online tool such as `whoismyip` or CIDR calculator to set proper value.  Make sure encoder can reach server before actual live event. |
>| MPE_INGEST_RTMP_SETDATAFRAME_NOT_RECEIVED | The RTMP encoder did not send setDataFrame command. | Most of commercial encoders send stream metadata. For an encoder that pushes a single bitrate ingest, this may not be issue since LiveEvent is able to calculate incoming bitrate when stream metadata is missing.  For multi bitrates that ingest for PassThru channel or double push scenario, you can try to append query string 'videodatarate' and 'audiodatarate' in ingest URL if you know bitrate from encoder settings. The approximate value may work. The unit is Kbit. ex) rtmp://hostname:1935/live/GUID_APPID/streamname?videodatarate=5000&audiodatarate=192 |
>| MPE_INGEST_CODEC_NOT_SUPPORTED | Codec specified isn't supported. | The LiveEvent received unsupported codec. For example of RTMP ingest, LiveEvent received non-AVC video codec.  Check encoder preset. |
>| MPE_INGEST_DESCRIPTION_INFO_NOT_RECEIVED | The media description information was not received before the actual media data was delivered. | The LiveEvent does not receive stream description(header or FLV tag) from encoder. This is protocol violation. Contact the encoder vendor. |
>| MPE_INGEST_MEDIA_QUALITIES_EXCEEDED | The count of qualities for audio or video type exceeded the maximum allowed limit. | When Live Event mode is Live Encoding, the encoder should push a single bitrate of video and audio.  Note that redundant push from same bitrate is allowed. Check the encoder preset or output settings to make sure it outputs a single bitrate stream. |
>| MPE_INGEST_BITRATE_AGGREGATED_EXCEEDED | The total incoming bitrate in a live event or channel service exceeded the maximum allowed limit. | The encoder exceeded the maximum incoming bitrate. This limit aggregates all incoming data from contribution encoder. Check encoder preset or output settings to reduce bitrate. |
>| MPE_RTMP_FLV_TAG_TIMESTAMP_INVALID | The timestamp for video or audio FLVTag is invalid from RTMP encoder. | Deprecated. |
>| MPE_INGEST_FRAMERATE_EXCEEDED | The incoming encoder ingested streams with frame rates exceeded the maximum allowed 30 fps for encoding live events/channels. | You should check encoder preset to lower frame rate under 36 fps. |  |
>| MPE_INGEST_VIDEO_RESOLUTION_NOT_SUPPORTED | The incoming encoder ingested streams exceeded the following allowed resolutions: 1920x1088 for encoding live events/channels and 4096 x 2160 for pass-through live events/channels. | You should check encoder preset to lower video resolution not to exceed the limit |
>| MPE_INGEST_RTMP_TOO_LARGE_UNPROCESSED_FLV | The live event has received a large amount of audio data at once, or a large amount of video data without any key frames. We have disconnected the encoder in order to give it a chance to retry with correct data. | You should ensure encoder to send key frame in every key frame interval(GOP).  Try to enable settings like "Constant bitrate(CBR)" or "Align Key Frames". Sometime, resetting contribution encoder may help. If it does not help, contact encoder vendor. |

## LiveEventEncoderDisconnected

You may see one of the following errors from the [LiveEventEncoderDisconnected](media-services-event-schemas.md#liveeventencoderdisconnected) event.

## See also

[Streaming Endpoint (Origin) error codes](streaming-endpoint-error-codes.md)

## Next steps

[Tutorial: Stream live with Media Services](stream-live-tutorial-with-api.md)
