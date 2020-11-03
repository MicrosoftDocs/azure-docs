---
title: Live events and live outputs concepts in Azure Media Services v3
titleSuffix: Azure Media Services
description: This topic provides an overview of live events and live outputs in Azure Media Services v3.
services: media-services
documentationcenter: ''
author: IngridAtMicrosoft
manager: femila
editor: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: ne
ms.topic: conceptual
ms.date: 10/23/2020
ms.author: inhenkel

---
# Live events and live outputs in Media Services

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

Azure Media Services lets you deliver live events to your customers on the Azure cloud. To set up your live streaming events in Media Services v3, you need to understand the concepts discussed in this article.

> [!TIP]
> For customers migrating from Media Services v2 APIs, the **live event** entity replaces **Channel** in v2 and **live output** replaces **program**.

## Live events

[Live events](/rest/api/media/liveevents) are responsible for ingesting and processing the live video feeds. When you create a live event, a primary and secondary input endpoint is created that you can use to send a live signal from a remote encoder. The remote live encoder sends the contribution feed to that input endpoint using either the [RTMP](https://www.adobe.com/devnet/rtmp.html) or [Smooth Streaming](/openspecs/windows_protocols/ms-sstr/8383f27f-7efe-4c60-832a-387274457251) (fragmented-MP4) input protocol. For the RTMP ingest protocol, the content can be sent in the clear (`rtmp://`) or securely encrypted on the wire(`rtmps://`). For the Smooth Streaming ingest protocol, the supported URL schemes are `http://` or `https://`.  

## Live event types

A [live event](/rest/api/media/liveevents) can be set to either a *pass-through* (an on-premises live encoder sends a multiple bitrate stream) or *live encoding* (an on-premises live encoder sends a single bitrate stream). The types are set during creation using [LiveEventEncodingType](/rest/api/media/liveevents/create#liveeventencodingtype):

* **LiveEventEncodingType.None**: An on-premises live encoder sends a multiple bitrate stream. The ingested stream passes through the live event without any further processing. Also called the pass-through mode.
* **LiveEventEncodingType.Standard**: An on-premises live encoder sends a single bitrate stream to the live event and Media Services creates multiple bitrate streams. If the contribution feed is of 720p or higher resolution, the **Default720p** preset will encode a set of 6 resolution/bitrates pairs.
* **LiveEventEncodingType.Premium1080p**: An on-premises live encoder sends a single bitrate stream to the live event and Media Services creates multiple bitrate streams. The Default1080p preset specifies the output set of resolution/bitrates pairs.

### Pass-through

![pass-through live event with Media Services example diagram](./media/live-streaming/pass-through.svg)

When using the pass-through **live event**, you rely on your on-premises live encoder to generate a multiple bitrate video stream and send that as the contribution feed to the live event (using RTMP or fragmented-MP4 protocol). The live event then carries through the incoming video streams without any further processing. Such a pass-through live event is optimized for long-running live events or 24x365 linear live streaming. When creating this type of live event, specify None (LiveEventEncodingType.None).

You can send the contribution feed at resolutions up to 4K and at a frame rate of 60 frames/second, with either H.264/AVC or H.265/HEVC video codecs, and AAC (AAC-LC, HE-AACv1, or HE-AACv2) audio codec. For more information, see [Live event types comparison](live-event-types-comparison.md).

> [!NOTE]
> Using a pass-through method is the most economical way to do live streaming when you're doing multiple events over a long period of time, and you have already invested in on-premises encoders. See [Pricing](https://azure.microsoft.com/pricing/details/media-services/) details.
>

See a .NET code example in [MediaV3LiveApp](https://github.com/Azure-Samples/media-services-v3-dotnet-core-tutorials/blob/master/NETCore/Live/MediaV3LiveApp/Program.cs#L126).

### Live encoding  

![live encoding with Media Services example diagram](./media/live-streaming/live-encoding.svg)

When using live encoding with Media Services, you configure your on-premises live encoder to send a single bitrate video as the contribution feed to the live event (using RTMP or Fragmented-Mp4 protocol). You then set up a live event so that it encodes that incoming single bitrate stream to a [multiple bitrate video stream](https://en.wikipedia.org/wiki/Adaptive_bitrate_streaming), and makes the output available for delivery to play back devices via protocols like MPEG-DASH, HLS, and Smooth Streaming.

When you use live encoding, you can send the contribution feed only at resolutions up to 1080p resolution at a frame rate of 30 frames/second, with H.264/AVC video codec and AAC (AAC-LC, HE-AACv1, or HE-AACv2) audio codec. Note that pass-through live events can support resolutions up to 4K at 60 frames/second. For more information, see [Live event types comparison](live-event-types-comparison.md).

The resolutions and bitrates contained in the output from the live encoder is determined by the preset. If using a **Standard** live encoder (LiveEventEncodingType.Standard), then the *Default720p* preset specifies a set of six resolution/bit rate pairs, going from 720p at 3.5 Mbps down to 192p at 200 kbps. Otherwise, if using a **Premium1080p** live encoder (LiveEventEncodingType.Premium1080p), then the *Default1080p* preset specifies a set of six resolution/bit rate pairs, going from 1080p at 3.5 Mbps down to 180p at 200 kbps. For information, see [System presets](live-event-types-comparison.md#system-presets).

> [!NOTE]
> If you need to customize the live encoding preset, open a support ticket via Azure portal. Specify the desired table of resolution and bitrates. Verify that there's only one layer at 720p (if requesting a preset for a Standard live encoder) or at 1080p (if requesting a preset for a Premium1080p live encoder), and 6 layers at most.

## Creating live events

### Options

When creating a live event, you can specify the following options:

* You can give the live event a name and a description.
* Cloud encoding includes Pass-through (no cloud encoding), Standard (up to 720p), or Premium (up to 1080p). For Standard and Premium encoding, you can choose the stretch mode of the encoded video.
  * None: Strictly respects the output resolution specified in the encoding preset without considering the pixel aspect ratio or display aspect ratio of the input video.
  * AutoSize:  Overrides the output resolution and changes it to match the display aspect ratio of the input, without padding. For example, if the input is 1920x1080 and the encoding preset asks for 1280x1280, then the value in the preset is overridden, and the output will be at 1280x720, which maintains the input aspect ratio of 16:9.
  * AutoFit: Pads the output (with either letterbox or pillar box) to honor the output resolution, while ensuring that the active video region in the output has the same aspect ratio as the input. For example, if the input is 1920x1080 and the encoding preset asks for 1280x1280, then the output will be at 1280x1280, which contains an inner rectangle of 1280x720 at aspect ratio of 16:9, with pillar box regions 280 pixels wide at the left and right.
* Streaming protocol (currently, the RTMP and Smooth Streaming protocols are supported). You can't change the protocol option while the live event or its associated live outputs are running. If you require different protocols, create a separate live event for each streaming protocol.
* Input ID which is a globally unique identifier for the live event input stream.
* Static hostname prefix which includes none (in which case a random 128 bit hex string will be used), Use live event name, or Use custom name.  When you choose to use a customer name, this value is the Custom hostname prefix.
* You can reduce end-to-end latency between the live broadcast and the playback by setting the input key frame interval, which is the duration (in seconds), of each media segment in the HLS output. The value should be a non-zero integer in the range of 0.5 to 20 seconds.  The value defaults to 2 seconds if *neither* of the input or output key frame intervals are set. The key frame interval is only allowed on pass-through events.
* When creating the event, you can set it to autostart. When autostart is set to true, the live event will be started after creation. The billing starts as soon as the live event starts running. You must explicitly call Stop on the live event resource to halt further billing. Alternatively, you can start the event when you're ready to start streaming.

> [!NOTE]
> The max framerate is 30 fps for both Standard and Premium encoding.

## StandBy mode

When you create a live event, you can set it to StandBy mode. While the event is in StandBy mode, you can edit the Description, the Static hostname prefix and restrict input and preview access settings.  StandBy mode is still a billable mode, but is priced differently than when you start a live stream.

For more information, see [Live event states and billing](live-event-states-billing.md).

* IP restrictions on the ingest and preview. You can define the IP addresses that are allowed to ingest a video to this live event. Allowed IP addresses can be specified as either a single IP address (for example '10.0.0.1'), an IP range using an IP address and a CIDR subnet mask (for example, '10.0.0.1/22'), or an IP range using an IP address and a dotted decimal subnet mask (for example, '10.0.0.1(255.255.252.0)').
<br/><br/>
If no IP addresses are specified and there's no rule definition, then no IP address will be allowed. To allow any IP address, create a rule and set 0.0.0.0/0.<br/>The IP addresses have to be in one of the following formats: IpV4 address with four numbers or CIDR address range.
<br/><br/>
If you want to enable certain IPs on your own firewalls or want to constrain inputs to your live events to Azure IP addresses, download a JSON file from [Azure Datacenter IP address ranges](https://www.microsoft.com/download/details.aspx?id=41653). For details about this file, select the **Details** section on the page.

* When creating the event, you can choose to turn on live transcriptions. By default, live transcription is disabled. For more information about live transcription read [Live transcription](live-transcription.md).

### Naming rules

* Max live event name is 32 characters.
* The name should follow this [regex](/dotnet/standard/base-types/regular-expression-language-quick-reference) pattern: `^[a-zA-Z0-9]+(-*[a-zA-Z0-9])*$`.

Also see [Streaming Endpoints naming conventions](streaming-endpoint-concept.md#naming-convention).

> [!TIP]
> To guarantee uniqueness of your live event name, you can generate a GUID then remove all the hyphens and curly brackets (if any). The string will be unique across all live events and its length is guaranteed to be 32.

## Live event ingest URLs

Once the live event is created, you can get ingest URLs that you'll provide to the live on-premises encoder. The live encoder uses these URLs to input a live stream. For more information, see [Recommended on-premises live encoders](recommended-on-premises-live-encoders.md).

>[!NOTE]
> As of the 2020-05-01 API release, vanity URLs are known as Static Host Names

You can either use non-vanity URLs or vanity URLs.

> [!NOTE]
> For an ingest URL to be predictive, set the "vanity" mode.

* Non-vanity URL

    Non-vanity URL is the default mode in Media Services v3. You potentially get the live event quickly but ingest URL is known only when the live event is started. The URL will change if you do stop/start the live event. Non-Vanity is useful in scenarios when an end user wants to stream using an app where the app wants to get a live event ASAP and having a dynamic ingest URL isn't a problem.

    If a client app doesn't need to pre-generate an ingest URL before the live event is created, let Media Services auto-generate the Access Token for the live event.

* Vanity URL

    Vanity mode is preferred by large media broadcasters who use hardware broadcast encoders and don't want to reconfigure their encoders when they start the live event. These broadcasters want a predictive ingest URL which doesn't change over time.

    > [!NOTE]
    > In the Azure portal, the vanity URL is named "*Static hostname prefix*".

    To specify this mode in the API, set `useStaticHostName` to `true` at creation time (default is `false`). When `useStaticHostname` is set to true, the `hostnamePrefix` specifies the first part of the hostname assigned to the live event preview and ingest endpoints. The final hostname would be a combination of this prefix, the media service account name and a short code for the Azure Media Services data center.

    To avoid a random token in the URL, you also need to pass your own access token (`LiveEventInput.accessToken`) at creation time.  The access token has to be a valid GUID string (with or without the hyphens). Once the mode is set, it can't be updated.

    The access token needs to be unique in your data center. If your app needs to use a vanity URL, it's recommended to always create a new GUID instance for your access token (instead of reusing any existing GUID).

    Use the following APIs to enable the Vanity URL and set the access token to a valid GUID (for example, `"accessToken": "1fce2e4b-fb15-4718-8adc-68c6eb4c26a7"`).  

    |Language|Enable vanity URL|Set access token|
    |---|---|---|
    |REST|[properties.vanityUrl](/rest/api/media/liveevents/create#liveevent)|[LiveEventInput.accessToken](/rest/api/media/liveevents/create#liveeventinput)|
    |CLI|[--vanity-url](/cli/azure/ams/live-event?view=azure-cli-latest#az-ams-live-event-create)|[--access-token](/cli/azure/ams/live-event?view=azure-cli-latest#optional-parameters)|
    |.NET|[LiveEvent.VanityUrl](/dotnet/api/microsoft.azure.management.media.models.liveevent.vanityurl?view=azure-dotnet#Microsoft_Azure_Management_Media_Models_LiveEvent_VanityUrl)|[LiveEventInput.AccessToken](/dotnet/api/microsoft.azure.management.media.models.liveeventinput.accesstoken?view=azure-dotnet#Microsoft_Azure_Management_Media_Models_LiveEventInput_AccessToken)|

### Live ingest URL naming rules

* The *random* string below is a 128-bit hex number (which is composed of 32 characters of 0-9 a-f).
* *your access token*: The valid GUID string you set when using the vanity mode. For example, `"1fce2e4b-fb15-4718-8adc-68c6eb4c26a7"`.
* *stream name*: Indicates the stream name for a specific connection. The stream name value is usually added by the live encoder you use. You can configure the live encoder to use any name to describe the connection, for example: "video1_audio1", "video2_audio1", "stream".

#### Non-vanity URL

##### RTMP

`rtmp://<random 128bit hex string>.channel.media.azure.net:1935/live/<auto-generated access token>/<stream name>`<br/>
`rtmp://<random 128bit hex string>.channel.media.azure.net:1936/live/<auto-generated access token>/<stream name>`<br/>
`rtmps://<random 128bit hex string>.channel.media.azure.net:2935/live/<auto-generated access token>/<stream name>`<br/>
`rtmps://<random 128bit hex string>.channel.media.azure.net:2936/live/<auto-generated access token>/<stream name>`<br/>

##### Smooth streaming

`http://<random 128bit hex string>.channel.media.azure.net/<auto-generated access token>/ingest.isml/streams(<stream name>)`<br/>
`https://<random 128bit hex string>.channel.media.azure.net/<auto-generated access token>/ingest.isml/streams(<stream name>)`<br/>

#### Vanity URL

In the following paths, `<live-event-name>` means either the name given to the event or the custom name used in the creation of the live event.

##### RTMP

`rtmp://<live event name>-<ams account name>-<region abbrev name>.channel.media.azure.net:1935/live/<your access token>/<stream name>`<br/>
`rtmp://<live event name>-<ams account name>-<region abbrev name>.channel.media.azure.net:1936/live/<your access token>/<stream name>`<br/>
`rtmps://<live event name>-<ams account name>-<region abbrev name>.channel.media.azure.net:2935/live/<your access token>/<stream name>`<br/>
`rtmps://<live event name>-<ams account name>-<region abbrev name>.channel.media.azure.net:2936/live/<your access token>/<stream name>`<br/>

##### Smooth streaming

`http://<live event name>-<ams account name>-<region abbrev name>.channel.media.azure.net/<your access token>/ingest.isml/streams(<stream name>)`<br/>
`https://<live event name>-<ams account name>-<region abbrev name>.channel.media.azure.net/<your access token>/ingest.isml/streams(<stream name>)`<br/>

## Live event preview URL

Once the live event starts receiving the contribution feed, you can use its preview endpoint to preview and validate that you're receiving the live stream before further publishing. After you've checked that the preview stream is good, you can use the live event to make the live stream available for delivery through one or more (pre-created) Streaming Endpoints. To accomplish this, create a new [live output](/rest/api/media/liveoutputs) on the live event.

> [!IMPORTANT]
> Make sure that the video is flowing to the preview URL before continuing!

## Live event long-running operations

For details, see [long-running operations](media-services-apis-overview.md#long-running-operations).

## Live outputs

Once you have the stream flowing into the live event, you can begin the streaming event by creating an [Asset](/rest/api/media/assets), [live output](/rest/api/media/liveoutputs), and [Streaming Locator](/rest/api/media/streaminglocators). live output will archive the stream and make it available to viewers through the [Streaming Endpoint](/rest/api/media/streamingendpoints).  

For detailed information about live outputs, see [Using a cloud DVR](live-event-cloud-dvr.md).

## Frequently asked questions

See the [Frequently asked questions](frequently-asked-questions.md#live-streaming) article.

## Ask questions and get updates

Check out the [Azure Media Services community](media-services-community.md) article to see different ways you can ask questions, give feedback, and get updates about Media Services.

## Next steps

[Live streaming tutorial](stream-live-tutorial-with-api.md)
