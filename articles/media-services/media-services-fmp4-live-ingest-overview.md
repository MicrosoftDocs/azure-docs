<properties 
	pageTitle="Azure Media Services Fragmented MP4 Live Ingest Specification" 
	description="This specification describes the protocol and format for Fragmented MP4 based live streaming ingestion for Microsoft Azure Media Services. Microsoft Azure Media Services provides live streaming service which allows customers to stream live events and broadcast content in real-time using Microsoft Azure as the cloud platform. This document also discusses best practices in building highly redundant and robust live ingest mechanisms." 
	services="media-services" 
	documentationCenter="" 
	authors="cenkdin" 
	manager="erikre" 
	editor=""/>

<tags 
	ms.service="media-services" 
	ms.workload="media" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/22/2016"     
	ms.author="cenkdin;juliako"/>

#Azure Media Services Fragmented MP4 Live Ingest Specification

This specification describes the protocol and format for Fragmented MP4 based live streaming ingestion for Microsoft Azure Media Services. Microsoft Azure Media Services provides live streaming service which allows customers to stream live events and broadcast content in real-time using Microsoft Azure as the cloud platform. This document also discusses best practices in building highly redundant and robust live ingest mechanisms.


##1. Conformance Notation

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in RFC 2119.

##2. Service Diagram 

The diagram below shows the high level architecture of the live streaming service in Microsoft Azure Media Services:

1.	Live Encoder pushes live feeds into Channels which are created and provisioned via the Microsoft Azure Media Services SDK.
2.	Channels, Programs and Streaming endpoint in Microsoft Azure Media Services handle all the live streaming functionalities including ingest, formatting, cloud DVR, security, scalability and redundancy.
3.	Optionally customers could choose to deploy a CDN layer between the Streaming endpoint and the client endpoints.
4.	Client endpoints stream from the Streaming endpoint using HTTP Adaptive Streaming protocols (e.g. Smooth Streaming, DASH, HDS or HLS).

![image1][image1]


##3. Bit-stream Format – ISO 14496-12 Fragmented MP4

The wire format for live streaming ingest that is discussed in this document is based on [ISO-14496-12]. Please refer to [[MS-SSTR]](http://msdn.microsoft.com/library/ff469518.aspx) for detailed explanation of Fragmented MP4 format and extensions for both video-on-demand files and live streaming ingestion.

###Live ingest format definitions 

Below is a list of special format definitions that apply to live ingest into Microsoft Azure Media Services:

1. The 'ftyp', LiveServerManifestBox, and 'moov' box MUST be sent with each request (HTTP POST).  It MUST be sent at the beginning of the stream and anytime the encoder must reconnect to resume stream ingest.  Please refer to Section 6 in [1] for more details.
2. Section 3.3.2 in [1] defines an optional box called StreamManifestBox for live ingest. Due to the routing logic of Microsoft Azure’s load balancer, usage of this box is deprecated and SHOULD NOT be present when ingesting into Microsoft Azure Media Service. If this box is present, Azure Media Services silently ignores it.
3. The TrackFragmentExtendedHeaderBox defined in 3.2.3.2 in [1] MUST be present for each fragment.
4. Version 2 of the TrackFragmentExtendedHeaderBox SHOULD be used in order to generate media segments with identical URLs in multiple datacenters. The fragment index field is REQUIRED for cross-datacenter failover of index-based streaming formats such as Apple HTTP Live Streaming (HLS) and index-based MPEG-DASH.  To enable cross-datacenter failover, the fragment index MUST be synchronized across multiple encoders, and increase by 1 for each successive media fragment, even across encoder restarts or failures.
5. Section 3.3.6 in [1] defines box called MovieFragmentRandomAccessBox ('mfra') that MAY be sent at the end of live ingestion to indicate EOS (End-of-Stream) to the channel. Due to the ingest logic of Azure Media Services, usage of EOS (End-of-Stream) is deprecated and the ‘mfra’ box for live ingestion SHOULD NOT be sent. If sent, Azure Media Services silently ignores it. It is recommended to use [Channel Reset](https://msdn.microsoft.com/library/azure/dn783458.aspx#reset_channels) to reset the state of the ingest point and also it is recommended to use [Program Stop](https://msdn.microsoft.com/library/azure/dn783463.aspx#stop_programs) to end a presentation and stream.
6. The MP4 fragment duration SHOULD be constant, in order to reduce the size of the client manifests and improve client download heuristics through use of repeat tags.  The duration MAY fluctuate in order to compensate for non-integer frame rates.
7. The MP4 fragment duration SHOULD be between approximately 2 and 6 seconds.
8. MP4 fragment timestamps and indexes (TrackFragmentExtendedHeaderBox fragment_ absolute_ time and fragment_index) SHOULD arrive in increasing order.  Although Azure Media Services is resilient to duplicate fragments, it has very limited ability to reorder fragments according to the media timeline.

##4. Protocol Format – HTTP

ISO Fragmented MP4 based live ingest for Microsoft Azure Media Services uses a standard long running HTTP POST request to transmit encoded media data packaged in Fragmented MP4 format to the service. Each HTTP POST sends a complete Fragmented MP4 bit-stream ("Stream") starting from beginning with header boxes ( 'ftyp', "Live Server Manifest Box", and 'moov' box) and continuing with a sequence of fragments (‘moof’ and ‘mdat’ boxes). Please refer to section 9.2 in [1] for URL syntax for HTTP POST request. An example of the POST URL is: 

	http://customer.channel.mediaservices.windows.net/ingest.isml/streams(720p)

###Requirements

Here are the detailed requirements:

1. Encoder SHOULD start the broadcast by sending an HTTP POST request with an empty “body” (zero content length) using the same ingestion URL. This can help quickly detect if the live ingestion endpoint is valid and if there is any authentication or other conditions required. Per HTTP protocol, the server won’t be able to send back HTTP response until the entire request including POST body is received. Given the long running nature of live event, without this step, the encoder may not be able to detect any error until it finishes sending all the data.
2. Encoder MUST handle any errors or authentication challenges as a result of (1). If (1) succeeds with a 200 response, continue.
3. Encoder MUST start a new HTTP POST request with the fragmented MP4 stream.  The payload MUST start with the header boxes followed by fragments.  Note the ‘ftyp’, “Live Server Manifest Box”, and ‘moov’ box (in this order) MUST be sent with each request, even if the encoder must reconnect because the previous request was terminated prior to the end of the stream. 
4. Encoder MUST use Chunked Transfer Encoding for uploading since it’s impossible to predict the entire content length of the live event.
5. When the event is over, after sending the last fragment, the encoder MUST gracefully end the Chunked Transfer Encoding message sequence (most HTTP client stacks handle it automatically). Encoder MUST wait for the service to return the final response code and then terminate the connection. 
6. Encoder MUST NOT use the Events() noun as described in 9.2 in [1] for live ingestion into Microsoft Azure Media Services.
7. If the HTTP POST request terminates or times out prior to the end of the stream with a TCP error, the encoder MUST issue a new POST request using a new connection and follow the requirements above with the additional requirement that the encoder MUST resend the previous two MP4 fragments for each track in the stream, and resume without introducing discontinuities in the media timeline.  Resending the last two MP4 fragments for each track ensures that there is no data loss.  In other words, if a stream contains both an audio and video track, and the current POST request fails, the encoder must reconnect and resend the last two fragments for the audio track, which were previously successfully sent, and the last two fragments for the video track, which were previously successfully sent, in order to ensure that there is no data loss.  The encoder MUST maintain a “forward” buffer of media fragments, which it resends when reconnecting.

##5. Timescale 

[[MS-SSTR]](https://msdn.microsoft.com/library/ff469518.aspx) describes the usage of “Timescale” for SmoothStreamingMedia (Section 2.2.2.1), StreamElement (Section 2.2.2.3), StreamFragmentElement(2.2.2.6) and LiveSMIL (Section 2.2.7.3.1). If timescale value is not present, the default value used is 10,000,000 (10 MHz). Although Smooth Streaming Format Specification doesn’t block usage of other timescale values, most of the encoder implementations uses this default value (10 MHz) to generate Smooth Streaming ingest data. Due to [Azure Media Dynamic Packaging](media-services-dynamic-packaging-overview.md) feature, it is recommend to use 90 kHz timescale for video streams and 44.1 or 48.1 kHz for audio streams. If different timescale values are used for different streams, the stream level timescale MUST be sent. Please refer to [[MS-SSTR]](https://msdn.microsoft.com/library/ff469518.aspx).     

##6. Definition of “Stream”  

“Stream” is the basic unit of operation in live ingestion for composing live presentation, handling streaming failover and redundancy scenarios. “Stream” is defined as one unique Fragmented MP4 bit-stream which may contain a single track or multiple tracks. A full live presentation could contain one or more streams depending on the configuration of the live encoder(s). The examples below illustrate various options of using stream(s) to compose a full live presentation.

**Example:** 

Customer wants to create a live streaming presentation which includes the following audio/video bitrates:

Video – 3000kbps, 1500kbps, 750kbps

Audio – 128kbps

###Option 1: All tracks in one stream

In this option, a single encoder generates all audio/video tracks and bundle them into one Fragmented MP4 bit-stream which then gets sent via a single HTTP POST connection. In this example, there is only one stream for this live presentation:

![image2][image2]

###Option 2: Each track in a separate stream

In this option, the encoder(s) only put one track into each Fragment MP4 bit-stream and post all the streams over multiple separate HTTP connections. This could be done with one encoders or multiple encoders. From live ingestion’s point of view, this live presentation is composed of four streams.

![image3][image3]

###Option 3: Bundle audio track with the lowest bitrate video track into one stream

In this option, the customer chooses to bundle the audio track with the lowest bitrate video track into one Fragment MP4 bit-stream and leave the other two video tracks each being its own stream. 


![image4][image4]


###Summary

What’s shown above is NOT an exhaustive list of all the possible ingestion options for this example. As a matter of fact, any grouping of tracks into streams is supported by the live ingestion. Customers and encoder vendors can choose their own implementations based on engineering complexity, encoder capacity, and redundancy and failover considerations. However it should be noted that in most cases there is only one audio track for the entire live presentation so it’s important to ensure the healthiness of the ingest stream that contains the audio track. This consideration often results in putting audio track into its own stream (as in Option 2) or bundling it with the lowest bitrate video track (as in Option 3). Also for better redundancy and fault-tolerance, sending the same audio track in two different streams (Option 2 with redundant audio tracks) or bundling the audio track at least two of the lowest bitrate video tracks (Option 3 with audio bundled in at least two video streams)  is highly recommended for live ingest into Microsoft Azure Media Services.

##7. Service Failover 

Given the nature of live streaming, good failover support is critical for ensuring the availability of the service. Microsoft Azure Media Services is designed to handle various types of failures including network errors, server errors, storage problems, etc. When used in conjunction with proper failover logic from the live encoder side, customer can achieve a highly reliable live streaming service from the cloud.

In this section, we will discuss service failover scenarios. In this case, the failure happens somewhere within the service and manifests itself as a network error. Here are some recommendations for the encoder implementation for handling service failover:


1. Use a 10 second timeout for establishing the TCP connection.  If an attempt to establish the connection takes longer than 10 seconds, abort the operation and try again. 
2. Use a short timeout for sending the HTTP request message chunks.  If the target MP4 fragment duration is N seconds, use a send timeout between N and 2N seconds; for example, use a timeout of 6 to 12 seconds if the MP4 fragment duration is 6 seconds.  If a timeout occurs, reset the connection, open a new connection, and resume stream ingest on the new connection. 
3. Maintain a rolling buffer containing the last two fragments, for each track, that were successfully and completely sent to the service.  If the HTTP POST request for a stream is terminated or times out prior to the end of the stream, open a new connection and begin another HTTP POST request, resend the stream headers, resend the last two fragments for each track, and resume the stream without introducing a discontinuity in the media timeline.  This will reduce the chance of data loss.
4. It is recommended that the encoder does NOT limit the number of retries to establish a connection or resume streaming after a TCP error occurs.
5. After a TCP error:
	1. The current connection MUST be closed, and a new connection MUST be created for a new HTTP POST request.
	2. The new HTTP POST URL MUST be the same as the initial POST URL.
	3. The new HTTP POST MUST include stream headers (‘ftyp’, “Live Server Manifest Box”, and ‘moov’ box) identical to the stream headers in the initial POST.
	4. The last two fragments sent for each track MUST be resent, and streaming resumed without introducing a discontinuity in the media timeline.  The MP4 fragment timestamps must increase continuously, even across HTTP POST requests.
6. The encoder SHOULD terminate the HTTP POST request if data is not being sent at a rate commensurate with the MP4 fragment duration.  An HTTP POST request that does not send data can prevent Azure Media Services from quickly disconnecting from the encoder in the event of a service update.  For this reason, the HTTP POST for sparse (ad signal) tracks SHOULD be short lived, terminating as soon as the sparse fragment is sent.

##8. Encoder Failover

Encoder failover is the second type of failover scenario that needs to be addressed for end-to-end live streaming delivery. In this scenario, the error condition happened on the encoder side. 

![image5][image5]


Below are the expectations from the live ingestion endpoint when encoder failover happens:

1. A new encoder instance SHOULD be created in order to continue streaming, as illustrated in the diagram above (Stream for 3000k video with dashed line).
2. The new encoder MUST use the same URL for HTTP POST requests as the failed instance.
3. The new encoder’s POST request MUST include the same fragmented MP4 header boxes as the failed instance.
4. The new encoder MUST be properly synchronized with all other running encoders for the same live presentation to generate synchronized audio/video samples with aligned fragment boundaries.
5. The new stream MUST be semantically equivalent with the previous stream and interchangeable at header and fragment level.
6. The new encoder SHOULD try to minimize data loss.  The fragment_absolute_time and fragment_index of media fragments SHOULD increase from the point where the encoder last stopped.  The fragment_absolute_time and fragment_index SHOULD increase in a continuous fashion, but it is permissible to introduce a discontinuity if necessary.  Azure Media Services will ignore fragments that it has already received and processed, so it is better to err on the side of resending fragments than to introduce discontinuities in the media timeline. 

##9. Encoder Redundancy 

For certain critical live events that demand even higher availability and quality of experience, it is recommended to employ active-active redundant encoders to achieve seamless failover with no data loss.

![image6][image6]

As illustrated in the diagram above, there are two group of encoders pushing two copies of each stream simultaneously into the live service. This setup is supported because Microsoft Azure Media Services has the ability to filter out duplicate fragments based on stream ID and fragment timestamp. The resulting live stream and archive will be a single of copy of all the streams that is the best possible aggregation from the two sources. For example, in a hypothetical extreme case, as long as there is one encoder (doesn’t have to be the same one) running at any given point in time for each stream, the resulting live stream from the service will be continuous without data loss. 

The requirement for this scenario is almost the same as the requirements in Encoder Failover case with the exception that the second set of encoders are running at the same time as the primary encoders.

##10. Service Redundancy  

For highly redundant global distribution, it is sometimes required to have cross-region backup to handle regional disasters. Expanding on the “Encoder Redundancy” topology, customers can choose to have a redundant service deployment in a different region which is connected with the 2nd set of encoders. Customers could also work with a CDN provider to deploy a GTM (Global Traffic Manager) in front of the two service deployments to seamlessly route client traffic. The requirements for the encoders are the same as “Encoder Redundancy” case with the only exception that the second set of encoders need to be pointed to a different live ingest end point. The diagram below shows this setup:

![image7][image7]

##11. Special Types of Ingestion Formats 

This section discusses some special type of live ingestion formats that are designed to handle some specific scenarios.

###Sparse Track

When delivering a live streaming presentation with rich client experience, it is often necessary to transmit time-synchronized events or signals in-band with the main media data. One example of this is dynamic live Ads insertion. This type of event signaling is different from regular audio/video streaming because of its sparse nature. In other words, the signaling data usually does not happen continuously and the interval can be hard to predict. The concept of Sparse Track was specifically designed to ingest and broadcast in-band signaling data.

Below is a recommended implementation for ingesting sparse track:

1. Create a separate Fragmented MP4 bit-stream which just contains sparse track(s) without audio/video tracks.
2. In the “Live Server Manifest Box” as defined in Section 6 in [1], use “parentTrackName” parameter to specify the name of the parent track. Please refer to section 4.2.1.2.1.2 in [1] for more details.
3. In the “Live Server Manifest Box”, manifestOutput MUST be set to “true”.
4. Given the sparse nature of the signaling event, it is recommended that:
	1. At the beginning of the live event, encoder sends the initial header boxes to the service which would allow the service to register the sparse track in the client manifest.
	2. The encoder SHOULD terminate the HTTP POST request when data is not being sent.  A long running HTTP POST that does not send data can prevent Azure Media Services from quickly disconnecting from the encoder in the event of a service update or server reboot, as the media server will be temporarily blocked in a receive operation on the socket. 
	3. During the time when signaling data is not available, the encoder SHOULD close the HTTP POST request.  While the POST request is active, the encoder SHOULD send data 
	4. When sending sparse fragments, encoder can set explicit Content-Length header if it’s available.
	5. When sending sparse fragment with a new connection, encoder SHOULD start sending from the header boxes followed by the new fragments. This is to handle the case where failover happened in between and the new sparse connection is being established to a new server which has not seen the sparse track before.
	6. The sparse track fragment will be made available to the client when the corresponding parent track fragment that has equal or bigger timestamp value is made available to the client. For example, if the sparse fragment has a timestamp of t=1000, it is expected after the client sees video (assuming the parent track name is video) fragment timestamp 1000 or beyond, it can download the sparse fragment t=1000. Please note that the actual signal could very well be used for a different position in the presentation timeline for its designated purpose. In the example above, it’s possible that the sparse fragment of t=1000 has a XML payload which is for inserting an Ad in a position that’s a few seconds later.
	7. The payload of sparse track fragment can be in various different formats (e.g. XML or text or binary, etc.) depending on different scenarios. 


###Redundant Audio Track

In a typical HTTP Adaptive Streaming scenario (e.g. Smooth Streaming or DASH), there is often only one audio track in the entire presentation. Unlike video tracks which have multiple quality levels for the client to choose from in error conditions, the audio track can be a single point of failure if the ingestion of the stream that contains the audio track is broken. 

To solve this problem, Microsoft Azure Media Services supports live ingestion of redundant audio tracks. The idea is that the same audio track can be sent multiple times in different streams. While the service will only register the audio track once in the client manifest, it is able to use redundant audio tracks as backups for retrieving audio fragments if the primary audio track is having issues. In order to ingest redundant audio tracks, the encoder needs to:

1. Create the same audio track in multiple Fragment MP4 bit-streams. The redundant audio tracks MUST be semantically equivalent with exactly the same fragment timestamps and interchangeable at header and fragment level.
2. Ensure that the “audio” entry in the Live Server Manifest (Section 6 in [1]) be the same for all redundant audio tracks.

Below is a recommended implementation for redundant audio tracks:

1. Send each unique audio track in a stream by itself.  Also send a redundant stream for each of these audio track streams, where the 2nd stream differs from the 1st only by the identifier in the HTTP POST URL:  {protocol}://{server address}/{publishing point path}/Streams({identifier}).
2. Use separate streams to send the two lowest video bitrates. Each of these streams SHOULD also contain a copy of each unique audio track.  For example, when multiple languages are supported, these streams SHOULD contain audio tracks for each language.
3. Use separate server (encoder) instances to encode and send the redundant streams mentioned in (1) and (2). 



##Media Services learning paths

[AZURE.INCLUDE [media-services-learning-paths-include](../../includes/media-services-learning-paths-include.md)]

##Provide feedback

[AZURE.INCLUDE [media-services-user-voice-include](../../includes/media-services-user-voice-include.md)]


[image1]: ./media/media-services-fmp4-live-ingest-overview/media-services-image1.png
[image2]: ./media/media-services-fmp4-live-ingest-overview/media-services-image2.png
[image3]: ./media/media-services-fmp4-live-ingest-overview/media-services-image3.png
[image4]: ./media/media-services-fmp4-live-ingest-overview/media-services-image4.png
[image5]: ./media/media-services-fmp4-live-ingest-overview/media-services-image5.png
[image6]: ./media/media-services-fmp4-live-ingest-overview/media-services-image6.png
[image7]: ./media/media-services-fmp4-live-ingest-overview/media-services-image7.png

 