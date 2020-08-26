---
title: Filter your manifests using Dynamic Packager
titleSuffix: Azure Media Services
description: Learn how to create filters using Dynamic Packager to filter and selectively stream your manifests.
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
ms.date: 07/11/2019
ms.author: juliako
#Customer intent: As a developer or a content provider, when delivering adaptive bitrate streaming content to devices, you often need to target specific device capabilities or available network bandwidth. Pre-filtering manifests with Dynamic Packager allows your clients to manipulate the streaming of your content without you needing to create multiple copies of the same media file. 
---

# Filter your manifests using Dynamic Packager

When you're delivering adaptive bitrate streaming content to devices, you sometimes need to publish multiple versions of a manifest to target specific device capabilities or available network bandwidth. The [Dynamic Packager](dynamic-packaging-overview.md) lets you specify filters which can filter out specific codecs, resolutions, bitrates, and audio track combinations on-the-fly. This filtering removes the need to create multiple copies. You simply need to publish a new URL with a specific set of filters configured to your target devices (iOS, Android, SmartTV, or browsers) and the network capabilities (high-bandwidth, mobile, or low-bandwidth scenarios). In this case, clients can manipulate the streaming of your content through the query string (by specifying available [Asset filters or Account filters](filters-concept.md)) and use filters to stream specific sections of a stream.

Some delivery scenarios require that you make sure a customer can't access specific tracks. For example, maybe you don't want to publish a manifest that contains HD tracks to a specific subscriber tier. Or, maybe you want to remove specific adaptive bitrate (ABR) tracks to reduce cost of delivery to a specific device that wouldn't benefit from the additional tracks. In this case, you could associate a list of pre-created filters with your [Streaming Locator](streaming-locators-concept.md) on creation. Clients then can't manipulate how the content is streamed because it's defined by the **Streaming Locator**.

You can combine filtering through specifying [filters on Streaming Locator](filters-concept.md#associating-filters-with-streaming-locator) + additional device-specific filters that your client specifies in the URL. This combination is useful to restrict additional tracks like metadata or event streams, audio languages, or descriptive audio tracks.

This ability to specify different filters on your stream provides a powerful **Dynamic Manifest** manipulation solution to target multiple use-case scenarios for your target devices. This topic explains concepts related to **Dynamic Manifests** and gives examples of scenarios in which you can use this feature.

> [!NOTE]
> Dynamic Manifests don't change the asset and the default manifest for that asset.

## Overview of manifests

Azure Media Services supports HLS, MPEG DASH, and Smooth Streaming protocols. As part of [Dynamic Packaging](dynamic-packaging-overview.md), the streaming client manifests (HLS Master Playlist, DASH Media Presentation Description [MPD], and Smooth Streaming) are dynamically generated based on the format selector in the URL. For more information, see the delivery protocols in [Common on-demand workflow](dynamic-packaging-overview.md#to-prepare-your-source-files-for-delivery).

### Get and examine manifest files

You specify a list of filter track property conditions based on which tracks of your stream (live or video on-demand [VOD]) should be included in a dynamically created manifest. To get and examine the properties of the tracks, you have to load the Smooth Streaming manifest first.

The [Upload, encode, and stream files with .NET](stream-files-tutorial-with-api.md#get-streaming-urls) tutorial shows you how to build the streaming URLs with .NET. If you run the app, one of the URLs points to the Smooth Streaming manifest: `https://amsaccount-usw22.streaming.media.azure.net/00000000-0000-0000-0000-0000000000000/ignite.ism/manifest`.<br/> Copy and paste the URL into the address bar of a browser. The file will be downloaded. You can open it in any text editor.

For a REST example, see [Upload, encode, and stream files with REST](stream-files-tutorial-with-rest.md#list-paths-and-build-streaming-urls).

### Monitor the bitrate of a video stream

You can use the [Azure Media Player demo page](https://aka.ms/azuremediaplayer) to monitor the bitrate of a video stream. The demo page displays diagnostics info on the **Diagnostics** tab:

![Azure Media Player diagnostics][amp_diagnostics]

### Examples: URLs with filters in query string

You can apply filters to ABR streaming protocols: HLS, MPEG-DASH, and Smooth Streaming. The following table shows some examples of URLs with filters:

|Protocol|Example|
|---|---|
|HLS|`https://amsv3account-usw22.streaming.media.azure.net/fecebb23-46f6-490d-8b70-203e86b0df58/bigbuckbunny.ism/manifest(format=m3u8-aapl,filter=myAccountFilter)`|
|MPEG DASH|`https://amsv3account-usw22.streaming.media.azure.net/fecebb23-46f6-490d-8b70-203e86b0df58/bigbuckbunny.ism/manifest(format=mpd-time-csf,filter=myAssetFilter)`|
|Smooth Streaming|`https://amsv3account-usw22.streaming.media.azure.net/fecebb23-46f6-490d-8b70-203e86b0df58/bigbuckbunny.ism/manifest(filter=myAssetFilter)`|

## Rendition filtering

You can choose to encode your asset to multiple encoding profiles (H.264 Baseline, H.264 High, AACL, AACH, Dolby Digital Plus) and multiple quality bitrates. However, not all client devices will support all your asset's profiles and bitrates. For example, older Android devices support only H.264 Baseline+AACL. Sending higher bitrates to a device that can't get the benefits wastes bandwidth and device computation. Such a device must decode all the given information, only to scale it down for display.

With Dynamic Manifest, you can create device profiles (such as mobile, console, or HD/SD) and include the tracks and qualities that you want to be a part of each profile. That's called rendition filtering. The following diagram shows an example of it.

![Example of rendition filtering with Dynamic Manifest][renditions2]

In the following example, an encoder was used to encode a mezzanine asset into seven ISO MP4s video renditions (from 180p to 1080p). The encoded asset can be [dynamically packaged](dynamic-packaging-overview.md) into any of the following streaming protocols: HLS, MPEG DASH, and Smooth.

The top of the following diagram shows the HLS manifest for the asset with no filters. (It contains all seven renditions.)  In the lower left, the diagram shows an HLS manifest to which a filter named "ott" was applied. The "ott" filter specifies the removal of all bitrates below 1 Mbps, so the bottom two quality levels were stripped off in the response. In the lower right, the diagram shows the HLS manifest to which a filter named "mobile" was applied. The "mobile" filter specifies the removal of renditions where the resolution is larger than 720p, so the two 1080p renditions were stripped off.

![Rendition filtering with Dynamic Manifest][renditions1]

## Removing language tracks
Your assets might include multiple audio languages such as English, Spanish, French, and so on. Usually, the Player SDK manages default audio track selection and available audio tracks per user selection.

Developing such Player SDKs is challenging because it requires different implementations across device-specific player frameworks. Also, on some platforms, Player APIs are limited and don't include the audio selection feature where users can't select or change the default audio track. With asset filters, you can control the behavior by creating filters that only include desired audio languages.

![Filtering of language tracks with Dynamic Manifest][language_filter]

## Trimming the start of an asset

In most live streaming events, operators run some tests before the actual event. For example, they might include a slate like this before the start of the event: "Program will begin momentarily."

If the program is archiving, the test and slate data are also archived and included in the presentation. However, this information shouldn't be shown to the clients. With Dynamic Manifest, you can create a start time filter and remove the unwanted data from the manifest.

![Trimming start of an asset with Dynamic Manifest][trim_filter]

## Creating subclips (views) from a live archive

Many live events are long running and live archive might include multiple events. After the live event ends, broadcasters may want to break up the live archive into logical program start and stop sequences.

You can publish these virtual programs separately without post processing the live archive and not creating separate assets (which doesn't get the benefit of the existing cached fragments in the CDNs). Examples of such virtual programs are the quarters of a football or basketball game, innings in baseball, or individual events of any sports program.

With Dynamic Manifest, you can create filters by using start/end times and create virtual views over the top of your live archive.

![Subclip filter with Dynamic Manifest][subclip_filter]

Here's the filtered asset:

![Filtered asset with Dynamic Manifest][skiing]

## Adjusting the presentation window (DVR)

Currently, Azure Media Services offers circular archive where the duration can be configured between 1 minute - 25 hours. Manifest filtering can be used to create a rolling DVR window over the top of the archive, without deleting media. There are many scenarios where broadcasters want to provide a limited DVR window to move with the live edge and at the same time keep a bigger archiving window. A broadcaster may want to use the data that's out of the DVR window to highlight clips, or they may want to provide different DVR windows for different devices. For example, most of the mobile devices don't handle large DVR windows (you can have a 2-minute DVR window for mobile devices and one hour for desktop clients).

![DVR window with Dynamic Manifest][dvr_filter]

## Adjusting LiveBackoff (live position)

Manifest filtering can be used to remove several seconds from the live edge of a live program. Filtering allows broadcasters to watch the presentation on the preview publication point and create advertisement insertion points before the viewers receive the stream (backed off by 30 seconds). Broadcasters can then push these advertisements to their client frameworks in time for them to receive and process the information before the advertisement opportunity.

In addition to the advertisement support, the live back-off setting can be used to adjust the viewers' position so that when clients drift and hit the live edge, they can still get fragments from the server. That way, clients won't get an HTTP 404 or 412 error.

![Filter for live back-off with Dynamic Manifest][livebackoff_filter]

## Combining multiple rules in a single filter

You can combine multiple filtering rules in a single filter. For example, you can define a "range rule" to remove slates from a live archive and also filter out available bitrates. When you're applying multiple filtering rules, the end result is the intersection of all rules.

![Multiple filtering rules with Dynamic Manifest][multiple-rules]

## Combining multiple filters (filter composition)

You can also combine multiple filters in a single URL. The following scenario demonstrates why you might want to combine filters:

1. You need to filter your video qualities for mobile devices, like Android or iPad (in order to limit video qualities). To remove the unwanted qualities, you'll create an account filter suitable for the device profiles. You can use account filters for all your assets under the same Media Services account without any further association.
1. You also want to trim the start and end time of an asset. To do the trimming, you'll create an asset filter and set the start/end time.
1. You want to combine both of these filters. Without combination, you would need to add quality filtering to the trimming filter, which would make filter usage more difficult.

To combine filters, set the filter names to the manifest/playlist URL in semicolon-delimited format. Let’s assume you have a filter named *MyMobileDevice* that filters qualities, and you have another named *MyStartTime* to set a specific start time. You can combine up to three filters.

For more information, see [this blog post](https://azure.microsoft.com/blog/azure-media-services-release-dynamic-manifest-composition-remove-hls-audio-only-track-and-hls-i-frame-track-support/).

## Considerations and limitations

- The values for **forceEndTimestamp**, **presentationWindowDuration**, and **liveBackoffDuration** shouldn't be set for a VOD filter. They're used only for live filter scenarios.
- A dynamic manifest operates in GOP boundaries (key frames), so trimming has GOP accuracy.
- You can use the same filter name for account and asset filters. Asset filters have higher precedence and will override account filters.
- If you update a filter, it can take up to 2 minutes for the streaming endpoint to refresh the rules. If you used filters to serve the content (and you cached the content in proxies and CDN caches), updating these filters can result in player failures. We recommend that you clear the cache after updating the filter. If this option isn't possible, consider using a different filter.
- Customers need to manually download the manifest and parse the exact start time stamp and time scale.

    - To determine properties of the tracks in an asset, [get and examine the manifest file](#get-and-examine-manifest-files).
    - The formula to set the asset filter time-stamp properties is: <br/>startTimestamp = &lt;start time in the manifest&gt; +  &lt;expected filter start time in seconds&gt; * timescale

## Next steps

The following articles show how to create filters programmatically:  

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
