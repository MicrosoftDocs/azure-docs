---
title: Filters and Azure Media Services dynamic manifests | Microsoft Docs
description: This topic describes how to create filters so your client can use them to stream specific sections of a stream. Media Services creates dynamic manifests to achieve this selective streaming.
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
ms.date: 03/20/2019
ms.author: juliako

---
# Dynamic manifests

Media Services offers **Dynamic Manifests** based on pre-defined filters. Once you define filters (see [define filters](filters-concept.md)), your clients could use them to stream a specific rendition or sub-clips of your video. They would specify filter(s) in the streaming URL. Filters could be applied to adaptive bitrate streaming protocols: Apple HTTP Live Streaming (HLS), MPEG-DASH, and Smooth Streaming. 

The following table shows some examples of URLs with filters:

|Protocol|Example|
|---|---|
|HLS|`https://amsv3account-usw22.streaming.media.azure.net/fecebb23-46f6-490d-8b70-203e86b0df58/bigbuckbunny.ism/manifest(format=m3u8-aapl,filter=myAccountFilter)`|
|MPEG DASH|`https://amsv3account-usw22.streaming.media.azure.net/fecebb23-46f6-490d-8b70-203e86b0df58/bigbuckbunny.ism/manifest(format=mpd-time-csf,filter=myAssetFilter)`|
|Smooth Streaming|`https://amsv3account-usw22.streaming.media.azure.net/fecebb23-46f6-490d-8b70-203e86b0df58/bigbuckbunny.ism/manifest(filter=myAssetFilter)`|
 
> [!NOTE]
> Dynamic Manifests do not change the asset and the default manifest for that asset. Your client can choose to request a stream with or without filters. 
> 

This topic explains concepts related to **Dynamic Manifests** and gives examples of scenarios in which you might want to use this feature.

## Manifests overview

Media Services supports HLS, MPEG DASH, Smooth Streaming protocols. As part of [Dynamic Packaging](dynamic-packaging-overview.md), the streaming client manifests (HLS Master Playlist, DASH Media Presentation Description (MPD), and Smooth Streaming) are dynamically generated based on the format selector in the URL. See the delivery protocols in [this section](dynamic-packaging-overview.md#delivery-protocols). 

### Get and examine manifest files

You specify a list of filter track property conditions based on which the tracks of your stream (Live or Video on Demand) should be included into dynamically created manifest. To get and examine the properties of the tracks, you have to load the Smooth Streaming manifest first.

The [Upload, encode, and stream files with .NET](stream-files-tutorial-with-api.md) tutorial shows you how to build the streaming URLs with .NET (see, the [building URLs](stream-files-tutorial-with-api.md#get-streaming-urls) section). If you run the app, one of the URLs points to the Smooth Streaming manifest: `https://amsaccount-usw22.streaming.media.azure.net/00000000-0000-0000-0000-0000000000000/ignite.ism/manifest`.<br/>Copy and paste the URL into the address bar of a browser. The file will be downloaded. You can open it in a text editor of your choice.

For the REST example, see [Upload, encode, and stream files with REST](stream-files-tutorial-with-rest.md#list-paths-and-build-streaming-urls).

### Monitor the bitrate of a video stream

You can use the [Azure Media Player demo page](https://aka.ms/amp) to monitor the bitrate of a video stream. The demo page displays diagnostics info in the **Diagnostics** tab:

![Azure Media Player diagnostics][amp_diagnostics]

## Rendition filtering

You may choose to encode your asset to multiple encoding profiles (H.264 Baseline, H.264 High, AACL, AACH, Dolby Digital Plus) and multiple quality bitrates. However, not all client devices will support all your asset's profiles and bitrates. For example, older Android devices only support H.264 Baseline+AACL. Sending higher bitrates to a device, which cannot get the benefits, wastes bandwidth, and device computation. Such device must decode all the given information, only to scale it down for display.

With Dynamic Manifest, you can create device profiles such as mobile, console, HD/SD, etc. and include the tracks and qualities, which you want to be a part of each profile.

![Rendition filtering example][renditions2]

In the following example, an encoder was used to encode a mezzanine asset into seven ISO MP4s video renditions (from 180p to 1080p). The encoded asset can be [dynamically packaged](dynamic-packaging-overview.md) into any of the following streaming protocols: HLS, MPEG DASH, and Smooth.  At the top of the diagram, the HLS manifest for the asset with no filters is shown (it contains all seven renditions).  In the bottom left, the HLS manifest to which a filter named "ott" was applied is shown. The "ott" filter specifies to remove all bitrates below 1 Mbps, which resulted in the bottom two quality levels being stripped off in the response. In the bottom right, the HLS manifest to which a filter named "mobile" was applied is shown. The "mobile" filter specifies to remove renditions where the resolution is larger than 720p, which resulted in the two 1080p renditions being stripped off.

![Rendition filtering][renditions1]

## Removing language tracks
Your assets might include multiple audio languages such as English, Spanish, French, etc. Usually, the Player SDK managers default audio track selection and available audio tracks per user selection. It is challenging to develop such Player SDKs, it requires different implementations across device-specific player-frameworks. Also, on some platforms, Player APIs are limited and do not include audio selection feature where users cannot select or change the default audio track. With asset filters, you can control the behavior by creating filters that only include desired audio languages.

![Language tracks filtering][language_filter]

## Trimming start of an asset
In most live streaming events, operators run some tests before the actual event. For example, they might include a slate like this before the start of the event: "Program will begin momentarily". If the program is archiving, the test and slate data are also archived and included in the presentation. However, this information should not be shown to the clients. With Dynamic Manifest, you can create a start time filter and remove the unwanted data from the manifest.

![Trimming start][trim_filter]

## Creating subclips (views) from a live archive
Many live events are long running and live archive might include multiple events. After the live event ends, broadcasters may want to break up the live archive into logical program start and stop sequences. Next, publish these virtual programs separately without post processing the live archive and not creating separate assets (which does not get the benefit of the existing cached fragments in the CDNs). Examples of such virtual programs are the quarters of a football or basketball game, innings in baseball, or individual events of any sports program.

With Dynamic Manifest, you can create filters using start/end times and create virtual views over the top of your live archive. 

![Subclip filter][subclip_filter]

Filtered Asset:

![Skiing][skiing]

## Adjusting Presentation Window (DVR)
Currently, Azure Media Services offers circular archive where the duration can be configured between 5 minutes - 25 hours. Manifest filtering can be used to create a rolling DVR window over the top of the archive, without deleting media. There are many scenarios where broadcasters want to provide a limited DVR window to move with the live edge and at the same time keep a bigger archiving window. A broadcaster may want to use the data that is out of the DVR window to highlight clips, or they may want to provide different DVR windows for different devices. For example, most of the mobile devices don't handle large DVR windows (you can have a 2-minute DVR window for mobile devices and one hour for desktop clients).

![DVR window][dvr_filter]

## Adjusting LiveBackoff (live position)
Manifest filtering can be used to remove several seconds from the live edge of a live program. Filtering allows broadcasters to watch the presentation on the preview publication point and create advertisement insertion points before the viewers receive the stream (backed-off by 30 seconds). Broadcasters can then push these advertisements to their client frameworks in time for them to received and process the information before the advertisement opportunity.

In addition to the advertisement support, the LiveBackoff setting can be used to adjusting the viewers position so that when clients drift and hit the live edge they can still get fragments from server instead of getting an HTTP 404 or 412 error.

![livebackoff_filter][livebackoff_filter]

## Combining multiple rules in a single filter
You can combine multiple filtering rules in a single filter. As an example you can define a "range rule" to remove slates from a live archive and also filter out available bitrates. When applying multiple filtering rules, the end result is the intersection of all rules.

![multiple-rules][multiple-rules]

## Combining multiple filters (filter composition)

You can also combine multiple filters in a single URL. 

The following scenario demonstrates why you might want to combine filters:

1. You need to filter your video qualities for mobile devices such as Android or iPAD (in order to limit video qualities). To remove the unwanted qualities, you would create an Account filter suitable for the device profiles. Account filters can be used for all your assets under the same media services account without any further association. 
2. You also want to trim the start and end time of an asset. To achieve this, you would create an Asset filter and set the start/end time. 
3. You want to combine both of these filters (without combination, you need to add quality filtering to the trimming filter, which makes filter usage more difficult).

To combine filters, you need to set the filter names to the manifest/playlist URL with semicolon delimited. Let’s assume you have a filter named *MyMobileDevice* that filters qualities and you have another named *MyStartTime* to set a specific start time. You can combine them like this:

You can combine up to three filters. 

For more information, see [this](https://azure.microsoft.com/blog/azure-media-services-release-dynamic-manifest-composition-remove-hls-audio-only-track-and-hls-i-frame-track-support/) blog.

## Associate filters with Streaming Locator

See [Filters: associate with Streaming Locators](filters-concept.md#associate-filters-with-streaming-locator).

## Considerations and limitations

- The values for **forceEndTimestamp**, **presentationWindowDuration**, and **liveBackoffDuration** should not be set for a VoD filter. They are only used for live filter scenarios. 
- Dynamic manifest operates in GOP boundaries (Key Frames) hence trimming has GOP accuracy. 
- You can use same filter name for Account and Asset filters. Asset filters have higher precedence and will override Account filters.
- If you update a filter, it can take up to 2 minutes for the Streaming Endpoint to refresh the rules. If the content was served using some filters (and cached in proxies and CDN caches), updating these filters can result in player failures. It is recommended to clear the cache after updating the filter. If this option is not possible, consider using a different filter.
- Customers need to manually download the manifest and parse the exact startTimestamp and time scale.
    
    - To determine properties of the tracks in an Asset, [get and examine the manifest file](#get-and-examine-manifest-files).
    - The formula to set the asset filter timestamp properties: <br/>startTimestamp = &lt;start time in the manifest&gt; +  &lt;expected filter start time in seconds&gt;*timescale

## Next steps

The following articles show how to create filters programmatically.  

- [Create filters with REST APIs](filters-dynamic-manifest-rest-howto.md)
- [Create filters with .NET](filters-dynamic-manifest-dotnet-howto.md)
- [Create filters with CLI](filters-dynamic-manifest-cli-howto.md)

[renditions1]: ./media/filters-dynamic-manifest-overview/media-services-rendition-filter.png
[renditions2]: ./media/filters-dynamic-manifest-overview/media-services-rendition-filter2.png

[rendered_subclip]: ./media/filters-dynamic-manifests/media-services-rendered-subclip.png
[timeline_trim_event]: ./media/filters-dynamic-manifests/media-services-timeline-trim-event.png
[timeline_trim_subclip]: ./media/filters-dynamic-manifests/media-services-timeline-trim-subclip.png

[multiple-rules]:./media/filters-dynamic-manifest-overview/media-services-multiple-rules-filters.png

[subclip_filter]: ./media/filters-dynamic-manifest-overview/media-services-subclips-filter.png
[trim_event]: ./media/filters-dynamic-manifests/media-services-timeline-trim-event.png
[trim_subclip]: ./media/filters-dynamic-manifests/media-services-timeline-trim-subclip.png
[trim_filter]: ./media/filters-dynamic-manifest-overview/media-services-trim-filter.png
[redered_subclip]: ./media/filters-dynamic-manifests/media-services-rendered-subclip.png
[livebackoff_filter]: ./media/filters-dynamic-manifest-overview/media-services-livebackoff-filter.png
[language_filter]: ./media/filters-dynamic-manifest-overview/media-services-language-filter.png
[dvr_filter]: ./media/filters-dynamic-manifest-overview/media-services-dvr-filter.png
[skiing]: ./media/filters-dynamic-manifest-overview/media-services-skiing.png
[amp_diagnostics]: ./media/filters-dynamic-manifest-overview/amp_diagnostics.png
