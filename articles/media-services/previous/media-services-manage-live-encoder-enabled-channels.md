---
title: Live streaming using Azure Media Services to create multi-bitrate streams | Microsoft Docs
description: 'This topic describes how to set up a Channel that receives a single bitrate live stream from an on-premises encoder and then performs live encoding to adaptive bitrate stream with Media Services. The stream can then be delivered to client playback applications through one or more Streaming Endpoints, using one of the following adaptive streaming protocols: HLS, Smooth Stream, MPEG DASH.'
services: media-services
documentationcenter: ''
author: anilmur
manager: femila
editor: ''

ms.assetid: 30ce6556-b0ff-46d8-a15d-5f10e4c360e2
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/20/2018
ms.author: juliako;anilmur

---

# Live streaming using Azure Media Services to create multi-bitrate streams

> [!NOTE]
> Starting May 12, 2018, live channels will no longer support the RTP/MPEG-2 transport stream ingest protocol. Please migrate from RTP/MPEG-2 to RTMP or fragmented MP4 (Smooth Streaming) ingest protocols.

## Overview
In Azure Media Services (AMS), a **Channel** represents a pipeline for processing live streaming content. A **Channel** receives live input streams in one of two ways:

* An on-premises live encoder sends a single-bitrate stream to the Channel that is enabled to perform live encoding with Media Services in one of the following formats: RTMP or Smooth Streaming (Fragmented MP4). The Channel then performs live encoding of the incoming single bitrate stream to a multi-bitrate (adaptive) video stream. When requested, Media Services delivers the stream to customers.
* An on-premises live encoder sends a multi-bitrate **RTMP** or **Smooth Streaming** (Fragmented MP4) to the Channel that is not enabled to perform live encoding with AMS. The ingested streams pass through **Channel**s without any further processing. This method is called **pass-through**. You can use the following live encoders that output multi-bitrate Smooth Streaming: MediaExcel, Ateme, Imagine Communications, Envivio, Cisco and Elemental. The following live encoders output RTMP: Adobe Flash Media Live Encoder (FMLE), Telestream Wirecast, Haivision, Teradek and Tricaster encoders.  A live encoder can also send a single bitrate stream to a channel that is not enabled for live encoding, but that is not recommended. When requested, Media Services delivers the stream to customers.
  
  > [!NOTE]
  > Using a pass-through method is the most economical way to do live streaming.
  > 
  > 

Starting with the Media Services 2.10 release, when you create a Channel, you can specify in which way you want for your channel to receive the input stream and whether or not you want for the channel to perform live encoding of your stream. You have two options:

* **None** – Specify this value, if you plan to use an on-premises live encoder which will output multi-bitrate stream (a pass-through stream). In this case, the incoming stream passed through to the output without any encoding. This is the behavior of a Channel prior to 2.10 release.  For more detailed information about working with channels of this type, see [Live streaming with on-premises encoders that create multi-bitrate streams](media-services-live-streaming-with-onprem-encoders.md).
* **Standard** – Choose this value, if you plan to use Media Services to encode your single bitrate live stream to multi-bitrate stream. Be aware that there is a billing impact for live encoding and you should remember that leaving a live encoding channel in the "Running" state will incur billing charges.  It is recommended that you immediately stop your running channels after your live streaming event is complete to avoid extra hourly charges.

> [!NOTE]
> This topic discusses attributes of channels that are enabled to perform live encoding (**Standard** encoding type). For information about working with channels that are not enabled to perform live encoding, see [Live streaming with on-premises encoders that create multi-bitrate streams](media-services-live-streaming-with-onprem-encoders.md).
> 
> Make sure to review the [Considerations](media-services-manage-live-encoder-enabled-channels.md#Considerations) section.
> 
> 

## Billing Implications
A live encoding channel begins billing as soon as it's state transitions to "Running" via the API.   You can also view the state in the Azure portal, or in the Azure Media Services Explorer tool (http://aka.ms/amse).

The following table shows how Channel states map to billing states in the API and Azure portal. The states are slightly different between the API and Portal UX. As soon as a channel is in the "Running" state via the API, or in the "Ready" or "Streaming" state in the Azure portal, billing will be active.
To stop the Channel from billing you further, you have to Stop the Channel via the API or in the Azure portal.
You are responsible for stopping your channels when you are done with the live encoding channel.  Failure to stop an encoding channel will result in continued billing.

### <a id="states"></a>Channel states and how they map to the billing mode
The current state of a Channel. Possible values include:

* **Stopped**. This is the initial state of the Channel after its creation (unless autostart was selected in the portal.) No billing occurs in this state. In this state, the Channel properties can be updated but streaming is not allowed.
* **Starting**. The Channel is being started. No billing occurs in this state. No updates or streaming is allowed during this state. If an error occurs, the Channel returns to the Stopped state.
* **Running**. The Channel is capable of processing live streams. It is now billing usage. You must stop the channel to prevent further billing. 
* **Stopping**. The Channel is being stopped. No billing occurs in this transient state. No updates or streaming is allowed during this state.
* **Deleting**. The Channel is being deleted. No billing occurs in this transient state. No updates or streaming is allowed during this state.

The following table shows how Channel states map to the billing mode. 

| Channel state | Portal UI Indicators | Is it Billing? |
| --- | --- | --- |
| Starting |Starting |No (transient state) |
| Running |Ready (no running programs)<br/>or<br/>Streaming (at least one running program) |YES |
| Stopping |Stopping |No (transient state) |
| Stopped |Stopped |No |

### Automatic shut-off for unused Channels
Starting with January 25, 2016, Media Services rolled out an update that automatically stops a Channel (with live encoding enabled) after it has been running in an unused state for a long period. This applies to Channels that have no active Programs, and which have not received an input contribution feed for an extended period of time.

The threshold for an unused period is nominally 12 hours, but is subject to change.

## Live Encoding Workflow
The following diagram represents a live streaming workflow where a channel receives a single bitrate stream in one of the following protocols: RTMP or Smooth Streaming; it then encodes the stream to a multi-bitrate stream. 

![Live workflow][live-overview]

## <a id="scenario"></a>Common Live Streaming Scenario
The following are general steps involved in creating common live streaming applications.

> [!NOTE]
> Currently, the max recommended duration of a live event is 8 hours. Please contact  amslived@microsoft.com if you need to run a Channel for longer periods of time. There is a billing impact for live encoding and you should remember that leaving a live encoding channel in the "Running" state will incur hourly billing charges.  It is recommended that you immediately stop your running channels after your live streaming event is complete to avoid extra hourly charges. 
> 
> 

1. Connect a video camera to a computer. Launch and configure an on-premises live encoder that can output a **single** bitrate stream in one of the following protocols: RTMP or Smooth Streaming. 
   
    This step could also be performed after you create your Channel.
2. Create and start a Channel. 
3. Retrieve the Channel ingest URL. 
   
    The ingest URL is used by the live encoder to send the stream to the Channel.
4. Retrieve the Channel preview URL. 
   
    Use this URL to verify that your channel is properly receiving the live stream.
5. Create a program. 
   
    When using the Azure portal, creating a program also creates an asset. 
   
    When using .NET SDK or REST you need to create an asset and specify to use this asset when creating a Program. 
6. Publish the asset associated with the program.   
   
    >[!NOTE]
	>When your AMS account is created a **default** streaming endpoint is added to your account in the **Stopped** state. The streaming endpoint from which you want to stream content has to be in the **Running** state. 
	
7. Start the program when you are ready to start streaming and archiving.
8. Optionally, the live encoder can be signaled to start an advertisement. The advertisement is inserted in the output stream.
9. Stop the program whenever you want to stop streaming and archiving the event.
10. Delete the Program (and optionally delete the asset).   

> [!NOTE]
> It is very important not to forget to Stop a Live Encoding Channel. Be aware that there is an hourly billing impact for live encoding and you should remember that leaving a live encoding channel in the "Running" state will incur billing charges.  It is recommended that you immediately stop your running channels after your live streaming event is complete to avoid extra hourly charges. 
> 
> 

## <a id="channel"></a>Channel's input (ingest) configurations
### <a id="Ingest_Protocols"></a>Ingest streaming protocol
If the **Encoder Type** is set to **Standard**, valid options are:

* Single bitrate **RTMP**
* Single bitrate **Fragmented MP4** (Smooth Streaming)

#### <a id="single_bitrate_RTMP"></a>Single bitrate RTMP
Considerations:

* The incoming stream cannot contain multi-bitrate video
* The video stream should have an average bitrate below 15 Mbps
* The audio stream should have an average bitrate below 1 Mbps
* Following are the supported codecs:
* MPEG-4 AVC / H.264 Video
* Baseline, Main, High Profile (8-bit 4:2:0)
* High 10 Profile (10-bit 4:2:0)
* High 422 Profile (10-bit 4:2:2)
* MPEG-2 AAC-LC Audio
* Mono, Stereo, Surround (5.1, 7.1)
* 44.1 kHz sampling rate
* MPEG-2 style ADTS packaging
* Recommended encoders include:
* Telestream Wirecast
* Flash Media Live Encoder

#### Single bitrate Fragmented MP4 (Smooth Streaming)
Typical use case:

Use on-premises live encoders from vendors like Elemental Technologies, Ericsson, Ateme, Envivio to send the input stream over the open internet to a nearby Azure data center.

Considerations:

Same as for [single bitrate RTMP](media-services-manage-live-encoder-enabled-channels.md#single_bitrate_RTMP).

#### Other considerations
* You cannot change the input protocol while the Channel or its associated programs are running. If you require different protocols, you should create separate channels for each input protocol.
* Maximum resolution for the incoming video stream is 1920x1080, and at most 60 fields/second if interlaced, or 30 frames/second if progressive.

### Ingest URLs (endpoints)
A Channel provides an input endpoint (ingest URL) that you specify in the live encoder, so the encoder can push streams to your Channels.

You can get the ingest URLs once you create a Channel. To get these URLs, the Channel does not have to be in the **Running** state. When you are ready to start pushing data into the Channel, it must be in the **Running** state. Once the Channel starts ingesting data, you can preview your stream through the preview URL.

You have an option of ingesting Fragmented MP4 (Smooth Streaming) live stream over an SSL connection. To ingest over SSL, make sure to update the ingest URL to HTTPS. Currently, AMS doesn’t support SSL with custom domains.  

### Allowed IP addresses
You can define the IP addresses that are allowed to publish video to this channel. Allowed IP addresses can be specified as either a single IP address (for example, '10.0.0.1'), an IP range using an IP address and a CIDR subnet mask (for example, ‘10.0.0.1/22’), or an IP range using an IP address and a dotted decimal subnet mask (for example, '10.0.0.1(255.255.252.0)').

If no IP addresses are specified and there is no rule definition then no IP address will be allowed. To allow any IP address, create a rule and set 0.0.0.0/0.

## Channel preview
### Preview URLs
Channels provide a preview endpoint (preview URL) that you use to preview and validate your stream before further processing and delivery.

You can get the preview URL when you create the channel. To get the URL, the channel does not have to be in the **Running** state.

Once the Channel starts ingesting data, you can preview your stream.

> [!NOTE]
> Currently the preview stream can only be delivered in Fragmented MP4 (Smooth Streaming) format regardless of the specified input type.  You can use a player hosted in the Azure portal to view your stream.
> 
> 

### Allowed IP Addresses
You can define the IP addresses that are allowed to connect to the preview endpoint. If no IP addresses are specified any IP address will be allowed. Allowed IP addresses can be specified as either a single IP address (for example, ‘10.0.0.1’), an IP range using an IP address and a CIDR subnet mask (for example, ‘10.0.0.1/22’), or an IP range using an IP address and a dotted decimal subnet mask (for example, ‘10.0.0.1(255.255.252.0)’).

## Live encoding settings
This section describes how the settings for the live encoder within the Channel can be adjusted, when the **Encoding Type** of a Channel is set to **Standard**.

> [!NOTE]
> Your contribution feed can only contain a single audio track – ingesting of multiple audio tracks is currently not supported. When doing live encoding with [on-premises live encodes](media-services-live-streaming-with-onprem-encoders.md), you can send a contribution feed in the Smooth Streaming protocol containing multiple audio tracks.
> 
> 

### Ad marker source
You can specify the source for ad markers signals. Default value is **Api**, which indicates that the live encoder within the Channel should listen to an asynchronous **Ad Marker API**.

### CEA 708 Closed Captions
An optional flag which tells the live encoder to ignore any CEA 708 captions data embedded in the incoming video. When the flag is set to false (default), the encoder will detect and re-insert CEA 708 data into the output video streams.

#### Index
It is recommended to send in a single program transport stream (SPTS). If the input stream contains multiple programs, the live encoder within the Channel parses the Program Map Table (PMT) in the input, identifies the inputs that have a stream type name of MPEG-2 AAC ADTS or AC-3 System-A or AC-3 System-B or MPEG-2 Private PES or MPEG-1 Audio or MPEG-2 Audio, and arranges them in the order specified in the PMT. The zero-based index is then used to pick up the n-th entry in that arrangement.

#### Language
The language identifier of the audio stream, conforming to ISO 639-2, such as ENG. If not present, the default is UND (undefined).

### <a id="preset"></a>System Preset
Specifies the preset to be used by the live encoder within this Channel. Currently, the only allowed value is **Default720p** (default).

Note that if you need custom presets, you should contact  amslived@microsoft.com.

**Default720p** will encode the video into the following 7 layers.

#### Output Video Stream
| BitRate | Width | Height | MaxFPS | Profile | Output Stream Name |
| --- | --- | --- | --- | --- | --- |
| 3500 |1280 |720 |30 |High |Video_1280x720_3500kbps |
| 2200 |960 |540 |30 |Main |Video_960x540_2200kbps |
| 1350 |704 |396 |30 |Main |Video_704x396_1350kbps |
| 850 |512 |288 |30 |Main |Video_512x288_850kbps |
| 550 |384 |216 |30 |Main |Video_384x216_550kbps |
| 350 |340 |192 |30 |Baseline |Video_340x192_350kbps |
| 200 |340 |192 |30 |Baseline |Video_340x192_200kbps |

#### Output Audio Stream

Audio is encoded to stereo AAC-LC at 128 kbps, sampling rate of 48 kHz.

## Signaling Advertisements
When your Channel has Live Encoding enabled, you have a component in your pipeline that is processing video, and can manipulate it. You can signal for the Channel to insert slates and/or advertisements into the outgoing adaptive bitrate stream. Slates are still images that you can use to cover up the input live feed in certain cases (for example during a commercial break). Advertising signals, are time-synchronized signals you embed into the outgoing stream to tell the video player to take special action – such as to switch to an advertisement at the appropriate time. See this [blog](https://codesequoia.wordpress.com/2014/02/24/understanding-scte-35/) for an overview of the SCTE-35 signaling mechanism used for this purpose. Below is a typical scenario you could implement in your live event.

1. Have your viewers get a PRE-EVENT image before the event starts.
2. Have your viewers get a POST-EVENT image after the event ends.
3. Have your viewers get an ERROR-EVENT image if there is a problem during the event (for example, power failure in the stadium).
4. Send an AD-BREAK image to hide the live event feed during a commercial break.

The following are the properties you can set when signaling advertisements. 

### Duration
The duration, in seconds, of the commercial break. This has to be a non-zero positive value in order to start the commercial break. When a commercial break is in progress, and the duration is set to zero with the CueId matching the on-going commercial break, then that break is canceled.

### CueId
A Unique ID for the commercial break, to be used by downstream application to take appropriate action(s). Needs to be a positive integer. You can set this value to any random positive integer or use an upstream system to track the Cue Ids. Make certain to normalize any IDs to positive integers before submitting through the API.

### Show slate
Optional. Signals the live encoder to switch to the [default slate](media-services-manage-live-encoder-enabled-channels.md#default_slate) image during a commercial break and hide the incoming video feed. Audio is also muted during slate. Default is **false**. 

The image used will be the one specified via the default slate asset Id property at the time of the channel creation. 
The slate will be stretched to fit the display image size. 

## Insert Slate  images
The live encoder within the Channel can be signaled to switch to a slate image. It can also be signaled to end an on-going slate. 

The live encoder can be configured to switch to a slate image and hide the incoming video signal in certain situations – for example, during an ad break. If such a slate is not configured, input video is not masked during that ad break.

### Duration
The duration of the slate in seconds. This has to be a non-zero positive value in order to start the slate. If there is an on-going slate, and a duration of zero is specified, then that on-going slate will be terminated.

### Insert slate on ad marker
When set to true, this setting configures the live encoder to insert a slate image during an ad break. The default value is true. 

### <a id="default_slate"></a>Default slate Asset Id

Optional. Specifies the Asset Id of the Media Services Asset which contains the slate image. Default is null. 


>[!NOTE] 
>Before creating the Channel, the slate image with the following constraints should be uploaded as a dedicated asset (no other files should be in this asset). This image is used only when the live encoder is inserting a slate due to an ad break, or has been explicitly signaled to insert a slate. The live encoder can also go into a slate mode during certain error conditions – for example if the input signal is lost. There is currently no option to use a custom image when the live encoder enters such an 'input signal lost' state. You can vote for this feature [here](https://feedback.azure.com/forums/169396-azure-media-services/suggestions/10190457-define-custom-slate-image-on-a-live-encoder-channel).


* At most 1920x1080 in resolution.
* At most 3 Mbytes in size.
* The file name must have a *.jpg extension.
* The image must be uploaded into an Asset as the only AssetFile in that Asset and this AssetFile should be marked as the primary file. The Asset cannot be storage encrypted.

If the **default slate Asset Id** is not specified, and **insert slate on ad marker** is set to **true**, a default Azure Media Services image will be used to hide the input video stream. Audio is also muted during slate. 

## Channel's programs
A channel is associated with programs that enable you to control the publishing and storage of segments in a live stream. Channels manage Programs. The Channel and Program relationship is very similar to traditional media where a Channel has a constant stream of content and a program is scoped to some timed event on that Channel.

You can specify the number of hours you want to retain the recorded content for the program by setting the **Archive Window** length. This value can be set from a minimum of 5 minutes to a maximum of 25 hours. Archive window length also dictates the maximum number of time clients can seek back in time from the current live position. Programs can run over the specified amount of time, but content that falls behind the window length is continuously discarded. This value of this property also determines how long the client manifests can grow.

Each program is associated with an Asset which stores the streamed content. An asset is mapped to a block blob container in the Azure Storage account and the files in the asset are stored as blobs in that container. To publish the program so your customers can view the stream you must create an OnDemand locator for the associated asset. Having this locator will enable you to build a streaming URL that you can provide to your clients.

A Channel supports up to three concurrently running programs so you can create multiple archives of the same incoming stream. This allows you to publish and archive different parts of an event as needed. For example, your business requirement is to archive 6 hours of a program, but to broadcast only last 10 minutes. To accomplish this, you need to create two concurrently running programs. One program is set to archive 6 hours of the event but the program is not published. The other program is set to archive for 10 minutes and this program is published.

You should not reuse existing programs for new events. Instead, create and start a new program for each event as described in the Programming Live Streaming Applications section.

Start the program when you are ready to start streaming and archiving. Stop the program whenever you want to stop streaming and archiving the event. 

To delete archived content, stop and delete the program and then delete the associated asset. An asset cannot be deleted if it is used by a program; the program must be deleted first. 

Even after you stop and delete the program, the users would be able to stream your archived content as a video on demand, for as long as you do not delete the asset.

If you do want to retain the archived content, but not have it available for streaming, delete the streaming locator.

## Getting a thumbnail preview of a live feed
When Live Encoding is enabled, you can now get a preview of the live feed as it reaches the Channel. This can be a valuable tool to check whether your live feed is actually reaching the Channel. 

## <a id="states"></a>Channel states and how states map to the billing mode
The current state of a Channel. Possible values include:

* **Stopped**. This is the initial state of the Channel after its creation. In this state, the Channel properties can be updated but streaming is not allowed.
* **Starting**. The Channel is being started. No updates or streaming is allowed during this state. If an error occurs, the Channel returns to the Stopped state.
* **Running**. The Channel is capable of processing live streams.
* **Stopping**. The Channel is being stopped. No updates or streaming is allowed during this state.
* **Deleting**. The Channel is being deleted. No updates or streaming is allowed during this state.

The following table shows how Channel states map to the billing mode. 

| Channel state | Portal UI Indicators | Billed? |
| --- | --- | --- |
| Starting |Starting |No (transient state) |
| Running |Ready (no running programs)<br/>or<br/>Streaming (at least one running program) |Yes |
| Stopping |Stopping |No (transient state) |
| Stopped |Stopped |No |

> [!NOTE]
> Currently, the Channel start average is about 2 minutes, but at times could take up to 20+ minutes. Channel resets can take up to 5 minutes.
> 
> 

## <a id="Considerations"></a>Considerations
* When a Channel of **Standard** encoding type experiences a loss of input source/contribution feed, it compensates for it by replacing the source video/audio with an error slate and silence. The Channel will continue to emit a slate until the input/contribution feed resumes. We recommend that a live channel not be left in such a state for longer than 2 hours. Beyond that point, the behavior of the Channel on input reconnection is not guaranteed, neither is its behavior in response to a Reset command. You will have to stop the Channel, delete it and create a new one.
* You cannot change the input protocol while the Channel or its associated programs are running. If you require different protocols, you should create separate channels for each input protocol.
* Every time you reconfigure the live encoder, call the **Reset** method on the channel. Before you reset the channel, you have to stop the program. After you reset the channel, restart the program.
* A channel can be stopped only when it is in the Running state, and all programs on the channel have been stopped.
* By default you can only add 5 channels to your Media Services account. This is a soft quota on all new accounts. For more information, see [Quotas and Limitations](media-services-quotas-and-limitations.md).
* You cannot change the input protocol while the Channel or its associated programs are running. If you require different protocols, you should create separate channels for each input protocol.
* You are only billed when your Channel is in the **Running** state. For more information, refer to [this](media-services-manage-live-encoder-enabled-channels.md#states) section.
* Currently, the max recommended duration of a live event is 8 hours. Please contact  amslived@microsoft.com if you need to run a Channel for longer periods of time.
* Make sure to have the streaming endpoint from which you want to stream content in the **Running** state.
* The encoding preset uses the notion of "max frame rate" of 30 fps. So if the input is 60fps/59.94i, the input frames are dropped/de-interlaced to 30/29.97 fps. If the input is 50fps/50i, the input frames are dropped/de-interlaced to 25 fps. If the input is 25 fps, output remains at 25 fps.
* Don't forget to STOP YOUR CHANNELS when done. If you don't, billing will continue.

## Known Issues
* Channel start up time has been improved to an average of 2 minutes, but at times of increased demand could still take up to 20+ minutes.
* Slate images should conform to restrictions described [here](media-services-manage-live-encoder-enabled-channels.md#default_slate). If you attempt to create a Channel with a default slate that is larger than 1920x1080, the request will eventually error out.
* Once again....don't forget to STOP YOUR CHANNELS when you are done streaming. If you don't, billing will continue.

## Next step
Review Media Services learning paths.

[!INCLUDE [media-services-learning-paths-include](../../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../../includes/media-services-user-voice-include.md)]

## Related topics
[Delivering Live Streaming Events with Azure Media Services](media-services-overview.md)

[Create channels that perform live encoding from a singe bitrate to adaptive bitrate stream with Portal](media-services-portal-creating-live-encoder-enabled-channel.md)

[Create channels that perform live encoding from a singe bitrate to adaptive bitrate stream with .NET SDK](media-services-dotnet-creating-live-encoder-enabled-channel.md)

[Manage channels with REST API](https://docs.microsoft.com/rest/api/media/operations/channel)
 
[Media Services Concepts](media-services-concepts.md)

[Azure Media Services Fragmented MP4 Live Ingest Specification](media-services-fmp4-live-ingest-overview.md)

[live-overview]: ./media/media-services-manage-live-encoder-enabled-channels/media-services-live-streaming-new.png

