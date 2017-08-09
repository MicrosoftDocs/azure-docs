---
title: Azure Media Services fragmented MP4 live ingest specification | Microsoft Docs
description: This specification describes the protocol and format for fragmented MP4-based live streaming ingestion for Microsoft Azure Media Services. Azure Media Services allows customers to stream live events and broadcast content in real time using Azure as the cloud platform. This document also discusses best practices in building highly redundant and robust live ingest mechanisms.
services: media-services
documentationcenter: ''
author: cenkdin
manager: erikre
editor: ''

ms.assetid: 43fac263-a5ea-44af-8dd5-cc88e423b4de
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/29/2017
ms.author: cenkd;juliako

---
# Azure Media Services fragmented MP4 live ingest specification
This specification describes the protocol and format for fragmented MP4-based live streaming ingestion for Microsoft Azure Media Services. Microsoft Azure Media Services provides live streaming service that allows customers to stream live events and broadcast content in real-time using Microsoft Azure as the cloud platform. This document also discusses best practices in building highly redundant and robust live ingest mechanisms.

## 1. Conformance notation
The key words "MUST," "MUST NOT," "REQUIRED," "SHALL," "SHALL NOT," "SHOULD," "SHOULD NOT," "RECOMMENDED," "MAY," and "OPTIONAL" in this document are to be interpreted as described in RFC 2119.

## 2. Service diagram
The following diagram shows the high-level architecture of the live streaming service in Azure Media Services:

1. Live encoder pushes live feeds into channels that are created and provisioned via the Azure Media Services SDK.
2. Channels, programs, and streaming endpoints in Azure Media Services handle all the live streaming functionalities, including ingest, formatting, cloud DVR, security, scalability, and redundancy.
3. Optionally, customers can choose to deploy an Azure Content Delivery Network layer between the streaming endpoint and the client endpoints.
4. Client endpoints stream from the streaming endpoint using HTTP Adaptive Streaming protocols (for example, Smooth Streaming, DASH, or HLS).

![ingest flow][image1]

## 3. Bitstream format – ISO 14496-12 fragmented MP4
The wire format for live streaming ingest discussed in this document is based on [ISO-14496-12]. Refer to [[MS-SSTR]](http://msdn.microsoft.com/library/ff469518.aspx) for a detailed explanation of fragmented MP4 format and extensions for both video-on-demand files and live streaming ingestion.

### Live ingest format definitions
The following is a list of special format definitions that apply to live ingest into Azure Media Services:

1. The "ftyp," "Live Server Manifest Box," and "moov" box MUST be sent with each request (HTTP POST).  It MUST be sent at the beginning of the stream and anytime the encoder must reconnect to resume stream ingest.  Refer to Section 6 in [1] for more details.
2. Section 3.3.2 in [1] defines an optional box called StreamManifestBox for live ingest. Due to the routing logic of the Azure load balancer, usage of this box is deprecated and SHOULD NOT be present when ingesting into Azure Media Services. If this box is present, Azure Media Services silently ignores it.
3. The TrackFragmentExtendedHeaderBox defined in 3.2.3.2 in [1] MUST be present for each fragment.
4. Version 2 of the TrackFragmentExtendedHeaderBox SHOULD be used to generate media segments with identical URLs in multiple datacenters. The fragment index field is REQUIRED for cross-datacenter failover of index-based streaming formats such as Apple HTTP Live Streaming (HLS) and index-based MPEG-DASH.  To enable cross-datacenter failover, the fragment index MUST be synchronized across multiple encoders and increase by 1 for each successive media fragment, even across encoder restarts or failures.
5. Section 3.3.6 in [1] defines a box called MovieFragmentRandomAccessBox ("mfra") that MAY be sent at the end of live ingestion to indicate EOS (End-of-Stream) to the channel. Due to the ingest logic of Azure Media Services, usage of EOS is deprecated and the "mfra" box for live ingestion SHOULD NOT be sent. If sent, Azure Media Services silently ignores it. It's recommended to use [Channel Reset](https://docs.microsoft.com/rest/api/media/operations/channel#reset_channels) to reset the state of the ingest point. It's also recommended to use [Program Stop](https://msdn.microsoft.com/library/azure/dn783463.aspx#stop_programs) to end a presentation and stream.
6. The MP4 fragment duration SHOULD be constant, to reduce the size of the client manifests, and improve client download heuristics through the use of repeat tags. The duration MAY fluctuate to compensate for non-integer frame rates.
7. The MP4 fragment duration SHOULD be between approximately 2 and 6 seconds.
8. MP4 fragment timestamps and indexes (TrackFragmentExtendedHeaderBox fragment_ absolute_ time and fragment_index) SHOULD arrive in increasing order.  Although Azure Media Services is resilient to duplicate fragments, it has limited ability to reorder fragments according to the media timeline.

## 4. Protocol format – HTTP
ISO fragmented MP4-based live ingest for Azure Media Services uses a standard long-running HTTP POST request to transmit encoded media data packaged in fragmented MP4 format to the service. Each HTTP POST sends a complete fragmented MP4 bitstream ("stream") starting from the beginning with header boxes ("ftyp," "Live Server Manifest Box," and "moov" box) and continuing with a sequence of fragments ("moof" and "mdat" boxes). Refer to section 9.2 in [1] for URL syntax for HTTP POST request. An example of the POST URL is: 

    http://customer.channel.mediaservices.windows.net/ingest.isml/streams(720p)

### Requirements
Here are the detailed requirements:

1. Encoder SHOULD start the broadcast by sending an HTTP POST request with an empty “body” (zero content length) using the same ingestion URL. This can help quickly detect if the live ingestion endpoint is valid and if there is any authentication or other conditions required. Per HTTP protocol, the server won’t be able to send back an HTTP response until the entire request, including POST body, is received. Given the long-running nature of a live event, without this step, the encoder may not be able to detect any error until it finishes sending all the data.
2. Encoder MUST handle any errors or authentication challenges because of (1). If (1) succeeds with a 200 response, continue.
3. Encoder MUST start a new HTTP POST request with the fragmented MP4 stream.  The payload MUST start with the header boxes, followed by fragments.  Note that the "ftyp," “Live Server Manifest Box,” and "moov" box (in this order) MUST be sent with each request, even if the encoder must reconnect because the previous request was terminated prior to the end of the stream. 
4. Encoder MUST use Chunked Transfer Encoding for uploading since it’s impossible to predict the entire content length of the live event.
5. When the event is over, after sending the last fragment, the encoder MUST gracefully end the Chunked Transfer Encoding message sequence (most HTTP client stacks handle it automatically). Encoder MUST wait for the service to return the final response code and then terminate the connection. 
6. Encoder MUST NOT use the Events() noun as described in 9.2 in [1] for live ingestion into Azure Media Services.
7. If the HTTP POST request terminates or times out prior to the end of the stream with a TCP error, the encoder MUST issue a new POST request using a new connection and follow the preceding requirements. Additionally, the encoder MUST resend the previous two MP4 fragments for each track in the stream, and resume without introducing discontinuities in the media timeline.  Resending the last two MP4 fragments for each track ensures that there is no data loss.  In other words, if a stream contains both an audio and a video track, and the current POST request fails, the encoder must reconnect and resend the last two fragments for the audio track, which were previously successfully sent, and the last two fragments for the video track, which were previously successfully sent, to ensure that there is no data loss.  The encoder MUST maintain a “forward” buffer of media fragments, which it resends when reconnecting.

## 5. Timescale
[[MS-SSTR]](https://msdn.microsoft.com/library/ff469518.aspx) describes the usage of “Timescale” for SmoothStreamingMedia (Section 2.2.2.1), StreamElement (Section 2.2.2.3), StreamFragmentElement (Section 2.2.2.6), and LiveSMIL (Section 2.2.7.3.1). If the timescale value is not present, the default value used is 10,000,000 (10 MHz). Although the Smooth Streaming Format specification doesn’t block usage of other timescale values, most of the encoder implementations use this default value (10 MHz) to generate Smooth Streaming ingest data. Due to the [Azure Media Dynamic Packaging](media-services-dynamic-packaging-overview.md) feature, it is recommended to use 90-KHz timescale for video streams and 44.1 KHz or 48.1 KHz for audio streams. If different timescale values are used for different streams, the stream level timescale MUST be sent. More for information, refer to [[MS-SSTR]](https://msdn.microsoft.com/library/ff469518.aspx).     

## 6. Definition of “stream”
“Stream” is the basic unit of operation in live ingestion for composing live presentation, handling streaming failover and redundancy scenarios. “Stream” is defined as one unique fragmented MP4 bitstream that may contain a single track or multiple tracks. A full live presentation can contain one or more streams depending on the configuration of the live encoders. The following examples illustrate various options of using streams to compose a full live presentation.

**Example:** 

A customer wants to create a live streaming presentation that includes the following audio/video bitrates:

Video – 3000 kbps, 1500 kbps, 750 kbps

Audio – 128 kbps

### Option 1: All tracks in one stream
In this option, a single encoder generates all audio/video tracks and bundles them into one fragmented MP4 bitstream, which then is sent via a single HTTP POST connection. In this example, there is only one stream for this live presentation.

![Streams-one track][image2]

### Option 2: Each track in a separate stream
In this option, the encoder puts one track into each fragment MP4 bitstream and posts all of the streams over separate HTTP connections. This can be done with one encoder or multiple encoders. The live ingestion sees this live presentation as composed of four streams.

![Streams-separate tracks][image3]

### Option 3: Bundle audio track with the lowest bitrate video track into one stream
In this option, the customer chooses to bundle the audio track with the lowest bitrate video track into one fragment MP4 bitstream and leave the other two video tracks as separate streams. 

![Streams-audio and video tracks][image4]

### Summary
This is not an exhaustive list of all possible ingestion options for this example. As a matter of fact, any grouping of tracks into streams is supported by the live ingestion. Customers and encoder vendors can choose their own implementations based on engineering complexity, encoder capacity, and redundancy and failover considerations. However, it should be noted that in most cases there is only one audio track for the entire live presentation, so it’s important to ensure the healthiness of the ingest stream that contains the audio track. This consideration often results in putting the audio track into its own stream (as in Option 2) or bundling it with the lowest bitrate video track (as in Option 3). Also, for better redundancy and fault tolerance, sending the same audio track in two different streams (Option 2 with redundant audio tracks) or bundling the audio track with at least two of the lowest bitrate video tracks (Option 3 with audio bundled in at least two video streams)  is highly recommended for live ingest into Azure Media Services.

## 7. Service failover
Given the nature of live streaming, good failover support is critical for ensuring the availability of the service. Azure Media Services is designed to handle various types of failures, including network errors, server errors, and storage problems. When used in conjunction with proper failover logic from the live encoder side, customers can achieve a highly reliable live streaming service from the cloud.

In this section, we discuss service failover scenarios. In this case, the failure happens somewhere within the service and manifests itself as a network error. Here are some recommendations for the encoder implementation for handling service failover:

1. Use a 10-second timeout for establishing the TCP connection.  If an attempt to establish the connection takes longer than 10 seconds, abort the operation and try again. 
2. Use a short timeout for sending the HTTP request message chunks.  If the target MP4 fragment duration is N seconds, use a send timeout between N and 2 N seconds; for example, use a timeout of 6 to 12 seconds if the MP4 fragment duration is 6 seconds.  If a timeout occurs, reset the connection, open a new connection, and resume stream ingest on the new connection. 
3. Maintain a rolling buffer containing the last two fragments for each track that were successfully and completely sent to the service.  If the HTTP POST request for a stream is terminated or times out prior to the end of the stream, open a new connection and begin another HTTP POST request, resend the stream headers, resend the last two fragments for each track, and resume the stream without introducing a discontinuity in the media timeline.  This reduces the chance of data loss.
4. It's recommended that the encoder does NOT limit the number of retries to establish a connection or resume streaming after a TCP error occurs.
5. After a TCP error:
  
    a. The current connection MUST be closed, and a new connection MUST be created for a new HTTP POST request.

    b. The new HTTP POST URL MUST be the same as the initial POST URL.
  
    c. The new HTTP POST MUST include stream headers ("ftyp," “Live Server Manifest Box,” and "moov" box) identical to the stream headers in the initial POST.
  
    d. The last two fragments sent for each track must be resent, and streaming resumed without introducing a discontinuity in the media timeline.  The MP4 fragment timestamps must increase continuously, even across HTTP POST requests.
6. The encoder SHOULD terminate the HTTP POST request if data is not being sent at a rate commensurate with the MP4 fragment duration.  An HTTP POST request that does not send data can prevent Azure Media Services from quickly disconnecting from the encoder in the event of a service update.  For this reason, the HTTP POST for sparse (ad signal) tracks SHOULD be short-lived, terminating as soon as the sparse fragment is sent.

## 8. Encoder failover
Encoder failover is the second type of failover scenario that needs to be addressed for end-to-end live streaming delivery. In this scenario, the error condition happened on the encoder side. 

![encoder failover][image5]

The following are the expectations from the live ingestion endpoint when encoder failover happens:

1. A new encoder instance SHOULD be created to continue streaming, as illustrated in the diagram (Stream for 3000k video with dashed line).
2. The new encoder MUST use the same URL for HTTP POST requests as the failed instance.
3. The new encoder’s POST request MUST include the same fragmented MP4 header boxes as the failed instance.
4. The new encoder MUST be properly synchronized with all other running encoders for the same live presentation to generate synchronized audio/video samples with aligned fragment boundaries.
5. The new stream MUST be semantically equivalent with the previous stream and interchangeable at header and fragment level.
6. The new encoder SHOULD try to minimize data loss.  The fragment_absolute_time and fragment_index of media fragments SHOULD increase from the point where the encoder last stopped.  The fragment_absolute_time and fragment_index SHOULD increase in a continuous fashion, but it is permissible to introduce a discontinuity if necessary.  Azure Media Services ignores fragments that it has already received and processed, so it's better to err on the side of resending fragments than to introduce discontinuities in the media timeline. 

## 9. Encoder redundancy
For certain critical live events that demand even higher availability and quality of experience, it's recommended to employ active-active redundant encoders to achieve seamless failover with no data loss.

![encoder redundancy][image6]

As illustrated in this diagram, there are two groups of encoders pushing two copies of each stream simultaneously into the live service. This setup is supported because Azure Media Services can filter out duplicate fragments based on stream ID and fragment timestamp. The resulting live stream and archive is a single copy of all the streams that's the best possible aggregation from the two sources. For example, in a hypothetical extreme case, as long as there is one encoder (it doesn’t have to be the same one) running at any given point in time for each stream, the resulting live stream from the service is continuous without data loss. 

The requirements for this scenario are almost the same as the requirements in the "Encoder failover" case, with the exception that the second set of encoders are running at the same time as the primary encoders.

## 10. Service redundancy
For highly redundant global distribution, it's sometimes required to have cross-region backup to handle regional disasters. Expanding on the “Encoder redundancy” topology, customers can choose to have a redundant service deployment in a different region that's connected with the second set of encoders. Customers can also work with a Content Delivery Network provider to deploy a Global Traffic Manager in front of the two service deployments to seamlessly route client traffic. The requirements for the encoders are the same as the “Encoder redundancy” case, with the only exception that the second set of encoders needs to be pointed to a different live ingest endpoint. The following diagram shows this setup:

![service redundancy][image7]

## 11. Special types of ingestion formats
This section discusses special types of live ingestion formats that are designed to handle specific scenarios.

### Sparse track
When delivering a live streaming presentation with rich client experience, it's often necessary to transmit time-synchronized events or signals in-band with the main media data. One example of this is dynamic live ads insertion. This type of event signaling is different from regular audio/video streaming because of its sparse nature. In other words, the signaling data usually does not happen continuously and the interval can be hard to predict. The concept of sparse track was designed to ingest and broadcast in-band signaling data.

The following steps are a recommended implementation for ingesting sparse track:

1. Create a separate fragmented MP4 bitstream that just contains sparse tracks without audio/video tracks.
2. In the “Live Server Manifest Box” as defined in Section 6 in [1], use the “parentTrackName” parameter to specify the name of the parent track. For more information, see section 4.2.1.2.1.2 in [1].
3. In the “Live Server Manifest Box,” manifestOutput MUST be set to “true.”
4. Given the sparse nature of the signaling event, it's recommended that:
   
    a. At the beginning of the live event, the encoder sends the initial header boxes to the service, which allows the service to register the sparse track in the client manifest.
   
    b. The encoder SHOULD terminate the HTTP POST request when data is not being sent.  A long-running HTTP POST that does not send data can prevent Azure Media Services from quickly disconnecting from the encoder in the event of a service update or server reboot, as the media server is temporarily blocked in a receive operation on the socket.
   
    c. During the time when signaling data is not available, the encoder SHOULD close the HTTP POST request.  While the POST request is active, the encoder SHOULD send data.

    d. When sending sparse fragments, the encoder can set an explicit content-length header if it’s available.

    e. When sending sparse fragments with a new connection, the encoder SHOULD start sending from the header boxes, followed by the new fragments. This is for cases in which failover happened in-between and the new sparse connection is being established to a new server that has not seen the sparse track before.

    f. The sparse track fragment becomes available to the client when the corresponding parent track fragment that has an equal or larger timestamp value is made available to the client. For example, if the sparse fragment has a timestamp of t=1000, it is expected after the client sees video (assuming the parent track name is video) fragment timestamp 1000 or beyond, it can download the sparse fragment t=1000. Note that the actual signal could be used for a different position in the presentation timeline for its designated purpose. In this example, it’s possible that the sparse fragment of t=1000 has an XML payload, which is for inserting an ad in a position that’s a few seconds later.

    g. The payload of sparse track fragments can be in different formats (such as XML, text, or binary) depending on different scenarios.

### Redundant audio track
In a typical HTTP adaptive streaming scenario (for example, Smooth Streaming or DASH), there is often only one audio track in the entire presentation. Unlike video tracks, which have multiple quality levels for the client to choose from in error conditions, the audio track can be a single point of failure if the ingestion of the stream that contains the audio track is broken. 

To solve this problem, Azure Media Services supports live ingestion of redundant audio tracks. The idea is that the same audio track can be sent multiple times in different streams. While the service only registers the audio track once in the client manifest, it is able to use redundant audio tracks as backups for retrieving audio fragments if the primary audio track is having issues. To ingest redundant audio tracks, the encoder needs to:

1. Create the same audio track in multiple fragment MP4 bitstreams. The redundant audio tracks MUST be semantically equivalent with the same fragment timestamps, and be interchangeable at the header and fragment level.
2. Ensure that the “audio” entry in the Live Server Manifest (Section 6 in [1]) is the same for all redundant audio tracks.

The following is a recommended implementation for redundant audio tracks:

1. Send each unique audio track in a stream by itself.  Also send a redundant stream for each of these audio track streams, where the second stream differs from the first only by the identifier in the HTTP POST URL:  {protocol}://{server address}/{publishing point path}/Streams({identifier}).
2. Use separate streams to send the two lowest video bitrates. Each of these streams SHOULD also contain a copy of each unique audio track.  For example, when multiple languages are supported, these streams SHOULD contain audio tracks for each language.
3. Use separate server (encoder) instances to encode and send the redundant streams mentioned in (1) and (2). 

## Media Services learning paths
[!INCLUDE [media-services-learning-paths-include](../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../includes/media-services-user-voice-include.md)]

[image1]: ./media/media-services-fmp4-live-ingest-overview/media-services-image1.png
[image2]: ./media/media-services-fmp4-live-ingest-overview/media-services-image2.png
[image3]: ./media/media-services-fmp4-live-ingest-overview/media-services-image3.png
[image4]: ./media/media-services-fmp4-live-ingest-overview/media-services-image4.png
[image5]: ./media/media-services-fmp4-live-ingest-overview/media-services-image5.png
[image6]: ./media/media-services-fmp4-live-ingest-overview/media-services-image6.png
[image7]: ./media/media-services-fmp4-live-ingest-overview/media-services-image7.png
