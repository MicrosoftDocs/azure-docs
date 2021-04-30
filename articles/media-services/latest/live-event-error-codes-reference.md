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
ms.date: 03/26/2021
ms.author: inhenkel

---

# Media Services Live Event error codes

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

The following tables list the [Live Event](live-event-outputs-concept.md) error codes.

## LiveEventConnectionRejected

When you subscribe to the [Event Grid](../../event-grid/index.yml) events for a
live event, you may see one of the following errors from the
[LiveEventConnectionRejected](monitoring/media-services-event-schemas.md\#liveeventconnectionrejected)
event.
> [!div class="mx-tdCol2BreakAll"]
>| Error | Information |
>|--|--|
>|**MPE_RTMP_APPID_AUTH_FAILURE** ||
>|Description | Incorrect ingest URL |
>|Suggested solution| APPID is a GUID token in RTMP ingest URL. Make sure it matches with Ingest URL from API. |
>|**MPE_INGEST_ENCODER_CONNECTION_DENIED** ||
>| Description |Encoder IP isn't present in the configured IP allow list |
>| Suggested solution| Make sure the encoder's IP is in the IP Allow List. Use an online tool such as *whoismyip* or *CIDR calculator* to set the proper value.  Make sure the encoder can reach the server before the actual live event. |
>|**MPE_INGEST_RTMP_SETDATAFRAME_NOT_RECEIVED** ||
>| Description|The RTMP encoder did not send the `setDataFrame` command. |
>| Suggested solution|Most commercial encoders send stream metadata. For an encoder that pushes a single bitrate ingest, this may not be issue. The LiveEvent is able to calculate incoming bitrate when the stream metadata is missing.  For multi-bitrate ingest for a PassThru channel or double push scenario, you can try to append the query string with 'videodatarate' and 'audiodatarate' in the ingest URL. The approximate value may work. The unit is in Kbit. For example,  `rtmp://hostname:1935/live/GUID_APPID/streamname?videodatarate=5000&audiodatarate=192` |
>|**MPE_INGEST_CODEC_NOT_SUPPORTED** ||
>| Description|The codec specified isn't supported.|
>| Suggested solution| The LiveEvent received unsupported codec. For example, an RTMP ingest, LiveEvent received non-AVC video codec.  Check encoder preset. |
>|**MPE_INGEST_DESCRIPTION_INFO_NOT_RECEIVED** ||
>| Description |The media description information was not received before the actual media data was delivered. |
>| Suggested solution|The LiveEvent does not receive the stream description (header or FLV tag) from the encoder. This is a protocol violation. Contact encoder vendor. |
>|**MPE_INGEST_MEDIA_QUALITIES_EXCEEDED** ||
>| Description|The count of qualities for audio or video type exceeded the maximum allowed limit. |
>| Suggested solution|When Live Event mode is Live Encoding, the encoder should push a single bitrate of video and audio.  Note that a redundant push from the same bitrate is allowed. Check the encoder preset or output settings to make sure it outputs a single bitrate stream. |
>|**MPE_INGEST_BITRATE_AGGREGATED_EXCEEDED** ||
>| Description|The total incoming bitrate in a live event or channel service exceeded the maximum allowed limit. |
>| Suggested solution|The encoder exceeded the maximum incoming bitrate. This limit aggregates all incoming data from the contributing encoder. Check encoder preset or output settings to reduce bitrate. |
>|**MPE_RTMP_FLV_TAG_TIMESTAMP_INVALID** ||
>| Description|The timestamp for video or audio FLVTag is invalid from the RTMP encoder. |
>| Suggested solution|Deprecated. |
>|**MPE_INGEST_FRAMERATE_EXCEEDED** ||
>| Description|The incoming encoder ingested streams with frame rates exceeded the maximum allowed 30 fps for encoding live events/channels. |
>| Suggested solution|Check encoder preset to lower frame rate to under 36 fps. |
>|**MPE_INGEST_VIDEO_RESOLUTION_NOT_SUPPORTED** ||
>| Description|The incoming encoder ingested streams exceeded the following allowed resolutions: 1920x1088 for encoding live events/channels and 4096 x 2160 for pass-through live events/channels. |
>| Suggested solution|Check encoder preset to lower video resolution so it doesn't exceed the limit. |
>|**MPE_INGEST_RTMP_TOO_LARGE_UNPROCESSED_FLV** |
>| Description|The live event has received a large amount of audio data at once, or a large amount of video data without any key frames. We have disconnected the encoder to give it a chance to retry with correct data. |
>| Suggested solution|Ensure that the encoder sends a key frame for every key frame interval(GOP).  Enable settings like "Constant bitrate(CBR)" or "Align Key Frames". Sometimes, resetting the contributing encoder may help. If it doesn't help, contact encoder vendor. |

## LiveEventEncoderDisconnected

You may see one of the following errors from the
[LiveEventEncoderDisconnected](monitoring/media-services-event-schemas.md\#liveeventencoderdisconnected)
event.

> [!div class="mx-tdCol2BreakAll"]
>| Error | Information |
>|--|--|
>|**MPE_RTMP_SESSION_IDLE_TIMEOUT** |
>| Description|RTMP session timed out after being idle for allowed time limit. |
>|Suggested solution|This typically happens when an encoder stops receiving the input feed so that the session becomes idle because there is no data to push out. Check if the encoder or input feed status is in a healthy state. |
>|**MPE_RTMP_FLV_TAG_TIMESTAMP_INVALID** |
>|Description| The timestamp for the video or audio FLVTag is invalid from RTMP encoder. |
>| Suggested solution| Deprecated. |
>|**MPE_CAPACITY_LIMIT_REACHED** |
>| Description|Encoder sending data too fast. |
>| Suggested solution|This happens when the encoder bursts out a large set of fragments in a brief period.  This can theoretically happen when the encoder can't push data for while due to a network issue and the bursts out data when the network is available. Find the reason from encoder log or system log. |
>|**Unknown error codes** |
>| Description| These error codes can range from memory error to duplicate entries in hash map. This can happen when the encoder sends out a large set of fragments in a brief period.  This can also happen when the encoder couldn't push data for while due to a network issue and then sends all the delayed fragments at once when the network becomes available. |
>|Suggested solution| Check the encoder logs.|

## Other error codes

> [!div class="mx-tdCol2BreakAll"]
>| Error | Information |Rejected/Disconnected Event|
>|--|--|--|
>|**ERROR_END_OF_MEDIA** ||Yes|
>| Description|This is general error. ||
>|Suggested solution| None.||
>|**MPI_SYSTEM_MAINTENANCE** ||Yes|
>| Description|The encoder disconnected due to service update or system maintenance. ||
>|Suggested solution|Make sure the encoder enables 'auto connect'. It allows the encoder to reconnect to the redundant live event endpoint that is not in maintenance. ||
>|**MPE_BAD_URL_SYNTAX** ||Yes|
>| Description|The ingest URL is incorrectly formatted. ||
>|Suggested solution|Make sure the ingest URL is correctly formatted. For RTMP, it should be `rtmp[s]://hostname:port/live/GUID_APPID/streamname` ||
>|**MPE_CLIENT_TERMINATED_SESSION** ||Yes|
>| Description|The encoder disconnected the session.  ||
>|Suggested solution|This is not error. The encoder initiated disconnection, including graceful disconnection. If this is an unexpected disconnect, check the encoder logs. |
>|**MPE_INGEST_BITRATE_NOT_MATCH** ||No|
>| Description|The incoming data rate does not match with expected bitrate. ||
>|Suggested solution|This is a warning which happens when incoming data rate is too slow or fast. Check encoder log or system log.||
>|**MPE_INGEST_DISCONTINUITY** ||No|
>| Description| There is discontinuty in incoming data.||
>|Suggested solution| This is a warning that the encoder drops data due to a network issue or a system resource issue. Check the encoder log or system log. Monitor the system resource (CPU, memory or network) as well. If the system CPU is too high, try to lower the bitrate or use the H/W encoder option from the system graphics card.||

## See also

[Streaming Endpoint (Origin) error codes](stream-streaming-endpoint-error-codes-reference.md)

## Next steps

[Tutorial: Stream live with Media Services](stream-live-tutorial-with-api.md)
