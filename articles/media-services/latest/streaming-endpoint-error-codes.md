---
title: Azure Media Services packaging and origin errors | Microsoft Docs
description: This topic describes errors that you may receive from the Azure Media Services Streaming Endpoint (Orgin) service.
author: Juliako
manager: femila
editor: ''
services: media-services
documentationcenter: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/07/2019
ms.author: juliako

---

# Streaming Endpoint (Origin) errors 

This topic describes errors that you may receive from the Azure Media Services [Streaming Endpoint service](streaming-endpoint-concept.md).

## 400 Bad Request

The request contains invalid information and is rejected with these error codes and due to one of the following reasons:

|Error code|Hexadecimal value |Error description|
|---|---|---|
|MPE_BAD_URL_SYNTAX |0x80890201|A URL syntax or format error. Examples include requests for an invalid type, an invalid fragment, or an invalid track. |
|MPE_ENC_ENCRYPTION_NOT_SPECIFIED_IN_URL |0x8088024C|The request has no encryption tag in the URL. CMAF requests require an encryption tag in the URL. Other protocols that are configured with more than one encryption type also require the encryption tag for disambiguation. |
|MPE_STORAGE_BAD_URL_SYNTAX |0x808900E9|The request to storage to fulfill the request failed with a Bad Request error. |

## 403 Forbidden

The request is not allowed due to one of the following reasons:

|Error code|Hexadecimal value |Error description|
|---|---|---|
|MPE_STORAGE_AUTHENTICATION_FAILED |0x808900EA|The request to storage to fulfill the request failed with an Authentication failure. This can happen if the storage keys were rotated and the service was unable to sync the storage keys. <br/><br/>Contact Azure support by going to [Help + support](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) in the Azure portal.|
|MPE_STORAGE_INSUFFICIENT_ACCOUNT_PERMISSIONS |0x808900EB |Storage Operation error, access failed due to Insufficient Account Permissions. |
|MPE_STORAGE_ACCOUNT_IS_DISABLED |0x808900EC |The request to storage to fulfill the request failed because the storage account Is Disabled. |
|MPE_STORAGE_AUTHENTICATION_FAILURE |0x808900F3 |Storage Operation error, access failed due to generic errors. |
|MPE_OUTPUT_FORMAT_BLOCKED |0x80890207 |The output format is blocked due to the configuration in the StreamingPolicy. |
|MPE_ENC_ENCRYPTION_REQUIRED |0x8088021E |Encryption is required for the content, Delivery policy is required for the output format. |
|MPE_ENC_ENCRYPTION_NOT_SET_IN_DELIVERY_POLICY |0x8088024D |Encryption is not set in delivery policy settings. |

## 404 Not Found

The operation is attempting to act on a resource that no longer exists. For example, the resource may have already been deleted.

|Error code|Hexadecimal value |Error description|
|---|---|---|
|MPE_EGRESS_TRACK_NOT_FOUND |0x80890209 |The requested track is not found. |
|MPE_RESOURCE_NOT_FOUND |0x808901F9 |The requested resource is not found. |
|MPE_UNAUTHORIZED |0x80890244 |The access is unauthorized. |
|MPE_EGRESS_TIMESTAMP_NOT_FOUND |0x8089020A |The requested timestamp is not found. |
|MPE_EGRESS_FILTER_NOT_FOUND |0x8089020C |The requested dynamic manifest filter is not found. |
|MPE_FRAGMENT_BY_INDEX_NOT_FOUND |0x80890252 |The requested fragment index is beyond the valid range. |
|MPE_LIVE_MEDIA_ENTRIES_NOT_FOUND |0x80890254 |Live media entries cannot be found to get moov buffer. |
|MPE_FRAGMENT_TIMESTAMP_NOT_FOUND |0x80890255 |Unable to find the fragment at the requested time for a particular track.<br/><br/>Could be that the fragment isn't in storage. Try a different layer of the presentation that might have a fragment. |
|MPE_MANIFEST_MEDIA_ENTRY_NOT_FOUND |0x80890256 |Unable to find the media entry for the requested bitrate in the manifest. <br/><br/>Could be that the player asked for a video track of a certain bitrate that wasn't in the manifest.|
|MPE_METADATA_NOT_FOUND |0x80890257 |Unable to find certain metadata in the manifest or unable to find rebase from storage. |
|MPE_STORAGE_RESOURCE_NOT_FOUND |0x808900ED |Storage Operation error, resource not found. |

## 409 Conflict

The ID provided for a resource on a `PUT` or `POST` operation has been taken by an existing resource. Use another ID for the resource to resolve this issue.

|Error code|Hexadecimal value |Error description|
|---|---|---|
|MPE_STORAGE_CONFLICT  |0x808900EE  |Storage Operation error, conflict error.  |

## 410

|Error code|Hexadecimal value |Error description|
|---|---|---|
|MPE_FILTER_FORCE_END_LEFT_EDGE_CROSSED_DVR_WINDOW|0x80890263|For live streaming, when the filter that has forceEndTimestamp set to true, the start or end timestamp is outside of the current DVR window.|

## 412 Precondition Failure

The operation specified an eTag that is different from the version available at the server, that is, an optimistic concurrency error. Retry the request after reading the latest version of the resource and updating the eTag on the request.

|Error code|Hexadecimal value |Error description|
|---|---|---|
|MPE_FRAGMENT_NOT_READY	|0x80890200	|The requested fragment is not ready.|
|MPE_STORAGE_PRECONDITION_FAILED| 0x808900EF|Storage operation error, a precondition failure.|

## 415 Unsupported Media Type

The payload format sent by the client is in an unsupported format.

|Error code|Hexadecimal value |Error description|
|---|---|---|
|MPE_ENC_ALREADY_ENCRYPTED|	0x8088021F|	Should not apply encryption on already encrypted content.|
|MPE_ENC_INVALID_INPUT_ENCRYPTION_FORMAT|0x8088021D	|The encryption is invalid for the input format.|
|MPE_INVALID_ASSET_DELIVERY_POLICY_TYPE|0x8088021C|	Delivery policy type is invalid.|
|MPE_ENC_MULTIPLE_SAME_DELIVERY_TYPE|0x8088024E	|The original settings could be shared by multiple output formats.|
|MPE_FORMAT_NOT_SUPPORTED|0x80890205|The media format or type is unsupported. For example, Media Services does not support quality level count that is over 64. In FLV video tag, Media Services does not support a video frame with multiple SPS and multiple PPS.|
|MPE_INPUT_FORMAT_NOT_SUPPORTED|0x80890218|	The input format of asset requested is not supported. Media Services supports Smooth (live), MP4 (VoD) and Progressive download formats.|
|MPE_OUTPUT_FORMAT_NOT_SUPPORTED|0x8089020D|The output format requested is not supported. Media Services supports Smooth, DASH(CSF, CMAF), HLS (v3, v4, CMAF), and Progressive download formats.|
|MPE_ENCRYPTION_NOT_SUPPORTED|0x80890208|Encountered unsupported encryption type.|
|MPE_MEDIA_TYPE_NOT_SUPPORTED|0x8089020E|The media type requested is not supported by the output format. The supported types are video, audio or "SUBT" subtitle.|
|MPE_MEDIA_ENCODING_NOT_SUPPORTED|0x8089020F|The source asset media was encoded with a media format that is not compatible with the output format.|
|MPE_VIDEO_ENCODING_NOT_SUPPORTED|0x80890210|The source asset was encoded with a video format that is not compatible with the output format. H.264, AVC, H.265 (HEVC, hev1 or hvc1) are supported.|
|MPE_AUDIO_ENCODING_NOT_SUPPORTED|0x80890211|The source asset was encoded with an audio format that is not compatible with the output format. Supported audio formats are AAC, E-AC3 (DD+), Dolby DTS.|
|MPE_SOURCE_PROTECTION_CONVERSION_NOT_SUPPORTED|0x80890212|The source protected asset cannot be converted to the output format.|
|MPE_OUTPUT_PROTECTION_FORMAT_NOT_SUPPORTED|0x80890213|The protection format is not supported by the output format.|
|MPE_INPUT_PROTECTION_FORMAT_NOT_SUPPORTED|0x80890219|The protection format is not supported by the input format.|
|MPE_INVALID_VIDEO_NAL_UNIT|0x80890231|Invalid video NAL unit, for example, only the first NAL in the sample can be an AUD.|
|MPE_INVALID_NALU_SIZE|0x80890260|Invalid NAL unit size.|
|MPE_INVALID_NALU_LENGTH_FIELD|0x80890261|Invalid NAL unit length value.|
|MPE_FILTER_INVALID|0x80890236|Invalid dynamic manifest filters.|
|MPE_FILTER_VERSION_INVALID|0x80890237|Invalid or unsupported filter versions.|
|MPE_FILTER_TYPE_INVALID|0x80890238|Invalid filter type.|
|MPE_FILTER_RANGE_ATTRIBUTE_INVALID|0x80890239|Invalid range is specified by the filter.|
|MPE_FILTER_TRACK_ATTRIBUTE_INVALID|0x8089023A|Invalid track attribute is specified by the filter.|
|MPE_FILTER_PRESENTATION_WINDOW_INVALID|0x8089023B|Invalid presentation window length is specified by the filter.|
|MPE_FILTER_LIVE_BACKOFF_INVALID|0x8089023C|Invalid live back off is specified by the filter.|
|MPE_FILTER_MULTIPLE_SAME_TYPE_FILTERS|0x8089023D|Only one absTimeInHNS element is supported in legacy filters.|
|MPE_FILTER_REMOVED_ALL_STREAMS|0x8089023E|There is no more streams at all after applying the filters.|
|MPE_FILTER_LIVE_BACKOFF_OVER_DVRWINDOW|0x8089023F|The live back off is beyond the DVR window.|
|MPE_FILTER_LIVE_BACKOFF_OVER_PRESENTATION_WINDOW|0x80890262|The live back off is greater than the presentation window.|
|MPE_FILTER_COMPOSITION_FILTER_COUNT_OVER_LIMIT|0x80890246|Exceeded ten (10) maximum allowed default filters.|
|MPE_FILTER_COMPOSITION_MULTIPLE_FIRST_QUALITY_OPERATOR_NOT_ALLOWED|0x80890248|Multiple first video quality operator is not allowed in combined request filters.|
|MPE_FILTER_FIRST_QUALITY_ATTRIBUTE_INVALID|0x80890249|The number of first quality bitrate attributes must be one (1).|
|MPE_HLS_SEGMENT_TOO_LARGE|0x80890243|HLS segment duration must smaller than one third of the DVR window and HLS back off.|
|MPE_KEY_FRAME_INTERVAL_TOO_LARGE|0x808901FE|Fragment durations must be less than or equal to approximately 20 seconds, or the input quality levels are not time aligned.|
|MPE_DTS_RESERVEDBOX_EXPECTED|0x80890105|DTS-specific error, cannot find the ReservedBox when it should present in the DTSSpecficBox during DTS box parsing.|
|MPE_DTS_INVALID_CHANNEL_COUNT|0x80890106|DTS-specific error, no channels found in the DTSSpecficBox during DTS box parsing.|
|MPE_DTS_SAMPLETYPE_MISMATCH|0x80890107|DTS-specific error, sample type mismatch in the DTSSpecficBox.|
|MPE_DTS_MULTIASSET_DTSH_MISMATCH|0x80890108|DTS-specific error, multi-asset is set but DTSH sample type mismatch.|
|MPE_DTS_INVALID_CORESTREAM_SIZE|0x80890109|DTS-specific error, core stream size is invalid.|
|MPE_DTS_INVALID_SAMPLE_RESOLUTION|0x8089010A|DTS-specific error, sample resolution is invalid.|
|MPE_DTS_INVALID_SUBSTREAM_INDEX|0x8089010B|DTS-specific error, sub-stream extension index is invalid.|
|MPE_DTS_INVALID_BLOCK_NUM|0x8089010C|DTS-specific error, sub-stream block number is invalid.|
|MPE_DTS_INVALID_SAMPLING_FREQUENCE|0x8089010D|DTS-specific error, sampling frequency is invalid.|
|MPE_DTS_INVALID_REFCLOCKCODE|0x8089010E|DTS-specific error, the reference clock code in sub-stream extension is invalid.|
|MPE_DTS_INVALID_SPEAKERS_REMAP|0x8089010F|DTS-specific error, the number of speakers remap set is invalid.|

For encryption articles and examples, see:

- [Concept: content protection](content-protection-overview.md)
- [Concept: Content Key Policies](content-key-policy-concept.md)
- [Concept: Streaming Policies](streaming-policy-concept.md)
- [Sample: protect with AES encryption](protect-with-aes128.md)
- [Sample: protect with DRM](protect-with-drm.md)

For filter guidance, see:

- [Concept: dynamic manifests](filters-dynamic-manifest-overview.md)
- [Concept: filters](filters-concept.md)
- [Sample: create filters with REST APIs](filters-dynamic-manifest-rest-howto.md)
- [Sample: create filters with .NET](filters-dynamic-manifest-dotnet-howto.md)
- [Sample: create filters with CLI](filters-dynamic-manifest-cli-howto.md)

For live articles and samples, see:

- [Concept: live streaming overview](live-streaming-overview.md)
- [Concept: Live Events and Live Outputs](live-events-outputs-concept.md)
- [Sample: live streaming tutorial](stream-live-tutorial-with-api.md)

## 416 Range Not Satisfiable

|Error code|Hexadecimal value |Error description|
|---|---|---|
|MPE_STORAGE_INVALID_RANGE|0x808900F1|Storage Operation error, returned http 416 error, invalid range.|

## 500 Internal Server Error

During the processing of the request, Media Services encounters some error that prevents the processing from continuing.  

|Error code|Hexadecimal value |Error description|
|---|---|---|
|MPE_STORAGE_SOCKET_TIMEOUT|0x808900F4|Received and translated from Winhttp error code of ERROR_WINHTTP_TIMEOUT (0x00002ee2).|
|MPE_STORAGE_SOCKET_CONNECTION_ERROR|0x808900F5|Received and translated from Winhttp error code of ERROR_WINHTTP_CONNECTION_ERROR (0x00002efe).|
|MPE_STORAGE_SOCKET_NAME_NOT_RESOLVED|0x808900F6|Received and translated from Winhttp error code of ERROR_WINHTTP_NAME_NOT_RESOLVED (0x00002ee7).|
|MPE_STORAGE_INTERNAL_ERROR|0x808900E6|Storage Operation error, general InternalError of one of HTTP 500 errors.|
|MPE_STORAGE_OPERATION_TIMED_OUT|0x808900E7|Storage Operation error, general OperationTimedOut of one of HTTP 500 errors.|
|MPE_STORAGE_FAILURE|0x808900F2|Storage Operation error, other HTTP 500 errors than InternalError or OperationTimedOut.|

## 503 Service Unavailable

The server is currently unable to receive requests. This error may be caused by excessive requests to the service. Media Services throttling mechanism restricts the resource usage for applications that make excessive request to the service.

> [!NOTE]
> Check the error message and error code string to get more detailed information about the reason you got the 503 error. This error does not always mean throttling.
> 

|Error code|Hexadecimal value |Error description|
|---|---|---|
|MPE_STORAGE_SERVER_BUSY|0x808900E8|Storage Operation error, received HTTP server busy error 503.|

## Ask questions, give feedback, get updates

Check out the [Azure Media Services community](media-services-community.md) article to see different ways you can ask questions, give feedback, and get updates about Media Services.

## See also

- [Encoding error codes](https://docs.microsoft.com/rest/api/media/jobs/get#joberrorcode)
- [Azure Media Services concepts](concepts-overview.md)
- [Quotas and Limitations](limits-quotas-constraints.md)

## Next steps

[Example: access ErrorCode and Message from ApiException with .NET](configure-connect-dotnet-howto.md#connect-to-the-net-client)
