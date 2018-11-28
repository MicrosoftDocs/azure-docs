---
title: Filters and Azure Media Services dynamic manifests | Microsoft Docs
description: This topic describes how to create filters so your client can use them to stream specific sections of a stream. Media Services creates dynamic manifests to archive this selective streaming.
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
ms.date: 11/26/2018
ms.author: juliako

---
# Filters and dynamic manifests

When delivering your content to customers (streaming Live events or Video on Demand) your client might need more flexibility than what's described in the default asset's manifest file. Azure Media Services enables you to define account filters and asset filters for your content. 

Filters are server-side rules that allow your customers to do things like: 

- Play back only a section of a video (instead of playing the whole video). For example:

    - Reduce the manifest to show a sub-clip of a live event ("sub-clip filtering"), or
    - Trim the start of a video ("trimming a video").

- Deliver only the specified renditions and/or specified language tracks that are supported by the device that is used to play back the content ("rendition filtering"). 
- Adjust Presentation Window (DVR) in order to provide a limited length of the DVR window in the player ("adjusting presentation window").

This topic describes [Concepts](#concepts) and [shows filters definitions](#definitions). It then gives details about [common scenarios](#common-scenarios). At the end of the article, you find links that show how to create filters programmatically.  

## Concepts

### Dynamic manifests

Media Services offers **Dynamic Manifests** based on pre-defined [filters](#filters). Once you define filters, your clients could use them to stream a specific rendition or sub-clips of your video. They would specify filter(s) in the streaming URL. Filters could be applied to adaptive bitrate streaming protocols: Apple HTTP Live Streaming (HLS), MPEG-DASH, and Smooth Streaming. 

The following table shows some examples of URLs with filters:

|Protocol|Example|
|---|---|
|HLS V4|`http://testendpoint-testaccount.streaming.mediaservices.windows.net/fecebb23-46f6-490d-8b70-203e86b0df58/BigBuckBunny.ism/Manifest(format=m3u8-aapl, filter=myAccountFilter)`|
|HLS V3|`http://testendpoint-testaccount.streaming.mediaservices.windows.net/fecebb23-46f6-490d-8b70-203e86b0df58/BigBuckBunny.ism/Manifest(format=m3u8-aapl-v3, filter=myAccountFilter)`|
|MPEG DASH|`http://testendpoint-testaccount.streaming.mediaservices.windows.net/fecebb23-46f6-490d-8b70-203e86b0df58/BigBuckBunny.ism/Manifest(format=mpd-time-csf,filter=myAssetFilter)`|
|Smooth Streaming|`http://testendpoint-testaccount.streaming.mediaservices.windows.net/fecebb23-46f6-490d-8b70-203e86b0df58/BigBuckBunny.ism/Manifest(filter=myAssetFilter)`|

> [!NOTE]
> Dynamic Manifests do not change the asset and the default manifest for that asset. Your client can choose to request a stream with or without filters. 
> 
> 

### Manifest files

When you encode an asset for adaptive bitrate streaming, a **manifest** (playlist) file is created (the file is text-based or XML-based). The **manifest** file includes streaming metadata such as: track type (audio, video, or text), track name, start and end time, bitrate (qualities), track languages, presentation window (sliding window of fixed duration), video codec (FourCC). It also instructs the player to retrieve the next fragment by providing information about the next playable video fragments available and their location. Fragments (or segments) are the actual "chunks" of a video content.

Here is an example of an HLS manifest file: 

```
#EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="audio",NAME="aac_eng_2_128041_2_1",LANGUAGE="eng",DEFAULT=YES,AUTOSELECT=YES,URI="QualityLevels(128041)/Manifest(aac_eng_2_128041_2_1,format=m3u8-aapl)"
#EXT-X-STREAM-INF:BANDWIDTH=536209,RESOLUTION=320x180,CODECS="avc1.64000d,mp4a.40.2",AUDIO="audio"
QualityLevels(380658)/Manifest(video,format=m3u8-aapl)
#EXT-X-I-FRAME-STREAM-INF:BANDWIDTH=536209,RESOLUTION=320x180,CODECS="avc1.64000d",URI="QualityLevels(380658)/Manifest(video,format=m3u8-aapl,type=keyframes)"
#EXT-X-STREAM-INF:BANDWIDTH=884474,RESOLUTION=480x270,CODECS="avc1.640015,mp4a.40.2",AUDIO="audio"
QualityLevels(721426)/Manifest(video,format=m3u8-aapl)
#EXT-X-I-FRAME-STREAM-INF:BANDWIDTH=884474,RESOLUTION=480x270,CODECS="avc1.640015",URI="QualityLevels(721426)/Manifest(video,format=m3u8-aapl,type=keyframes)"
#EXT-X-STREAM-INF:BANDWIDTH=1327838,RESOLUTION=640x360,CODECS="avc1.64001e,mp4a.40.2",AUDIO="audio"
QualityLevels(1155246)/Manifest(video,format=m3u8-aapl)
#EXT-X-I-FRAME-STREAM-INF:BANDWIDTH=1327838,RESOLUTION=640x360,CODECS="avc1.64001e",URI="QualityLevels(1155246)/Manifest(video,format=m3u8-aapl,type=keyframes)"
#EXT-X-STREAM-INF:BANDWIDTH=2414544,RESOLUTION=960x540,CODECS="avc1.64001f,mp4a.40.2",AUDIO="audio"
QualityLevels(2218559)/Manifest(video,format=m3u8-aapl)
#EXT-X-I-FRAME-STREAM-INF:BANDWIDTH=2414544,RESOLUTION=960x540,CODECS="avc1.64001f",URI="QualityLevels(2218559)/Manifest(video,format=m3u8-aapl,type=keyframes)"
#EXT-X-STREAM-INF:BANDWIDTH=3805301,RESOLUTION=1280x720,CODECS="avc1.640020,mp4a.40.2",AUDIO="audio"
QualityLevels(3579378)/Manifest(video,format=m3u8-aapl)
#EXT-X-I-FRAME-STREAM-INF:BANDWIDTH=3805301,RESOLUTION=1280x720,CODECS="avc1.640020",URI="QualityLevels(3579378)/Manifest(video,format=m3u8-aapl,type=keyframes)"
#EXT-X-STREAM-INF:BANDWIDTH=139017,CODECS="mp4a.40.2",AUDIO="audio"
QualityLevels(128041)/Manifest(aac_eng_2_128041_2_1,format=m3u8-aapl)
```

### Get and examine manifest files

You specify a list of filter track property conditions based on which the tracks of your stream (Live or Video on Demand) should be included into dynamically created manifest. To get and examine the properties of the tracks, you have to load the Smooth Streaming manifest first.

The [Upload, encode, and stream files with .NET](stream-files-tutorial-with-api.md) tutorial shows you how to build the streaming URLs with .NET (see, the [building URLs](stream-files-tutorial-with-api.md#get-streaming-urls) section). If you run the app, one of the URLs points to the Smooth Streaming manifest: `https://amsaccount-usw22.streaming.media.azure.net/00000000-0000-0000-0000-0000000000000/ignite.ism/manifest`.<br/>Copy and paste the URL into the address bar of a browser. The file will be downloaded. You can open it in a text editor of your choice.

For the REST example, see [Upload, encode, and stream files with REST](stream-files-tutorial-with-rest.md#list-paths-and-build-streaming-urls).

### Monitor the bitrate of a video stream

You can use the [Azure Media Player demo page](http://aka.ms/amp) to monitor the bitrate of a video stream. The demo page displays diagnostics info in the **Diagnostics** tab:

![Azure Media Player diagnostics][amp_diagnostics]

## Defining filters

There are two types of asset filters: 

* [Account Filters](https://docs.microsoft.com/rest/api/media/accountfilters) (global) - can be applied to any asset in the Azure Media Services account, have a lifetime of the account.
* [Asset Filters](https://docs.microsoft.com/rest/api/media/assetfilters) (local) - can only be applied to an asset with which the filter was associated upon creation, have a lifetime of the asset. 

[Account Filter](https://docs.microsoft.com/rest/api/media/accountfilters) and [Asset Filter](https://docs.microsoft.com/rest/api/media/assetfilters) types have exactly the same properties for defining/describing the filter. Except when creating the **Asset Filter**, you need to specify the asset name with which you want to associate the filter.

Depending on your scenario, you decide what type of a filter is more suitable (Asset Filter or Account Filter). Account Filters are suitable for device profiles (rendition filtering) where Asset Filters could be used to trim a specific asset.

You use the following properties to describe the filters. 

|Name|Description|
|---|---|
|firstQuality|The first quality bitrate of the filter.|
|presentationTimeRange|The presentation time range. This property is used for filtering manifest start/end points, presentation window length, and the live start position. <br/>For more details, see [PresentationTimeRange](#PresentationTimeRange).|
|tracks|The tracks selection conditions. For more details, see [tracks](#tracks)|

### PresentationTimeRange

Use this property with **Asset Filters**. It is not recommended to set the property with **Account Filters**.

|Name|Description|
|---|---|
|endTimestamp|The absolute end time boundary. Applies to Video on Demand (VoD). For the Live presentation, it is silently ignored and applied when the presentation ends and the stream becomes VoD.<br/><br/>The value represents an absolute end point of the stream. It gets rounded to the closest next GOP start.<br/><br/>Use StartTimestamp and EndTimestamp to trim the playlist (manifest). For example, StartTimestamp=40000000 and EndTimestamp = 100000000 will generate a playlist that contains media between StartTimestamp and EndTimestamp. If a fragment straddles the boundary, the entire fragment will be included in the manifest.|
|forceEndTimestamp|Applies to Live filters. The indicator of forcing the end of time stamp.|
|liveBackoffDuration|Applies to Live only. The property is used to define live playback position. Using this rule, you can delay live playback position and create a server-side buffer for players. LiveBackoffDuration is relative to the live position. The maximum live backoff duration is 60 seconds.|
|presentationWindowDuration|Applies to Live. Use PresentationWindowDuration to apply a sliding window to the playlist. For example, set PresentationWindowDuration=1200000000 to apply a two-minute sliding window. Media within 2 minutes of the live edge will be included in the playlist. If a fragment straddles the boundary, the entire fragment will be included in the playlist. The minimum presentation window duration is 120 seconds.|
|startTimestamp|Applies to VoD or Live streams. The value represents an absolute start point of the stream. The value gets rounded to the closest next GOP start.<br/><br/>Use StartTimestamp and EndTimestamp to trim the playlist (manifest). For example, StartTimestamp=40000000 and EndTimestamp = 100000000 will generate a playlist that contains media between StartTimestamp and EndTimestamp. If a fragment straddles the boundary, the entire fragment will be included in the manifest.|
|timescale|Applies to VoD or Live streams. The timescale used by the timestamps and durations specified above. The default timescale is 10000000. An alternative timescale can be used. Default is 10000000 HNS (hundred nanosecond).|

### Tracks

You specify a list of filter track property conditions (FilterTrackPropertyConditions) based on which the tracks of your stream (Live or Video on Demand) should be included into dynamically created manifest. The filters are combined using a logical **AND** and **OR** operation.

Filter track property conditions describe track types, values (described in the following table), and operations (Equal, NotEqual). 

|Name|Description|
|---|---|
|Bitrate|Use the bitrate of the track for filtering.<br/><br/>The recommended value is a range of bitrates, in bits per second. For example, "0-2427000".<br/><br/>Note: while you can use a specific bitrate value, like 250000 (bits per second), this approach is not recommended, as the exact bitrates can fluctuate from one Asset to another.|
|FourCC|Use the FourCC value of the track for filtering.<br/><br/>The value is the first element of codecs format, as specified in [RFC 6381](https://tools.ietf.org/html/rfc6381). Currently, the following codecs are supported: <br/>For Video: "avc1", "hev1", "hvc1"<br/>For Audio: "mp4a", "ec-3"<br/><br/>To determine the FourCC values for tracks in an Asset, [get and examine the manifest file](#get-and-examine-manifest-files).|
|Language|Use the language of the track for filtering.<br/><br/>The value is the tag of a language you want to include, as specified in RFC 5646. For example, "en".|
|Name|Use the name of the track for filtering.|
|Type|Use the type of the track for filtering.<br/><br/>The following values are allowed: "video", "audio", or "text".|

### Example

```json
{
  "properties": {
    "presentationTimeRange": {
      "startTimestamp": 0,
      "endTimestamp": 170000000,
      "presentationWindowDuration": 9223372036854776000,
      "liveBackoffDuration": 0,
      "timescale": 10000000,
      "forceEndTimestamp": false
    },
    "firstQuality": {
      "bitrate": 128000
    },
    "tracks": [
      {
        "trackSelections": [
          {
            "property": "Type",
            "operation": "Equal",
            "value": "Audio"
          },
          {
            "property": "Language",
            "operation": "NotEqual",
            "value": "en"
          },
          {
            "property": "FourCC",
            "operation": "NotEqual",
            "value": "EC-3"
          }
        ]
      },
      {
        "trackSelections": [
          {
            "property": "Type",
            "operation": "Equal",
            "value": "Video"
          },
          {
            "property": "Bitrate",
            "operation": "Equal",
            "value": "3000000-5000000"
          }
        ]
      }
    ]
  }
}
```

## Rendition filtering

You may choose to encode your asset to multiple encoding profiles (H.264 Baseline, H.264 High, AACL, AACH, Dolby Digital Plus) and multiple quality bitrates. However, not all client devices will support all your asset's profiles and bitrates. For example, older Android devices only support H.264 Baseline+AACL. Sending higher bitrates to a device, which cannot get the benefits, wastes bandwidth, and device computation. Such device must decode all the given information, only to scale it down for display.

With Dynamic Manifest, you can create device profiles such as mobile, console, HD/SD, etc. and include the tracks and qualities, which you want to be a part of each profile.

![Rendition filtering example][renditions2]

In the following example, an encoder was used to encode a mezzanine asset into seven ISO MP4s video renditions (from 180p to 1080p). The encoded asset can be dynamically packaged into any of the following streaming protocols: HLS, MPEG DASH, and Smooth.  At the top of the diagram, the HLS manifest for the asset with no filters is shown (it contains all seven renditions).  In the bottom left, the HLS manifest to which a filter named "ott" was applied is shown. The "ott" filter specifies to remove all bitrates below 1 Mbps, which resulted in the bottom two quality levels being stripped off in the response. In the bottom right, the HLS manifest to which a filter named "mobile" was applied is shown. The "mobile" filter specifies to remove renditions where the resolution is larger than 720p, which resulted in the two 1080p renditions being stripped off.

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

## Considerations and limitations

- The values for **forceEndTimestamp**, **presentationWindowDuration**, and **liveBackoffDuration** should not be set for a VoD filter. They are only used for live filter scenarios. 
- Dynamic manifest operates in GOP boundaries (Key Frames) hence trimming has GOP accuracy. 
- You can use same filter name for Account and Asset filters. Asset filters have higher precedence and will override Account filters.
- If you update a filter, it can take up to 2 minutes for streaming endpoint to refresh the rules. If the content was served using some filters (and cached in proxies and CDN caches), updating these filters can result in player failures. It is recommended to clear the cache after updating the filter. If this option is not possible, consider using a different filter.
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