---
title: Defining filters in Azure Media Services 
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
ms.date: 02/12/2019
ms.author: juliako

---
# Define account filters and asset filters  

When delivering your content to customers (streaming Live events or Video on Demand) your client might need more flexibility than what's described in the default asset's manifest file. Azure Media Services enables you to define account filters and asset filters for your content. 

Filters are server-side rules that allow your customers to do things like: 

- Play back only a section of a video (instead of playing the whole video). For example:
  - Reduce the manifest to show a sub-clip of a live event ("sub-clip filtering"), or
  - Trim the start of a video ("trimming a video").
- Deliver only the specified renditions and/or specified language tracks that are supported by the device that is used to play back the content ("rendition filtering"). 
- Adjust Presentation Window (DVR) in order to provide a limited length of the DVR window in the player ("adjusting presentation window").

Media Services offers [Dynamic Manifests](filters-dynamic-manifest-overview.md) based on pre-defined filters. Once you define filters, your clients could use them in the streaming URL. Filters could be applied to adaptive bitrate streaming protocols: Apple HTTP Live Streaming (HLS), MPEG-DASH, and Smooth Streaming.

The following table shows some examples of URLs with filters:

|Protocol|Example|
|---|---|
|HLS V4|`http://testendpoint-testaccount.streaming.mediaservices.windows.net/fecebb23-46f6-490d-8b70-203e86b0df58/BigBuckBunny.ism/Manifest(format=m3u8-aapl,filter=myAccountFilter)`|
|HLS V3|`http://testendpoint-testaccount.streaming.mediaservices.windows.net/fecebb23-46f6-490d-8b70-203e86b0df58/BigBuckBunny.ism/Manifest(format=m3u8-aapl-v3,filter=myAccountFilter)`|
|MPEG DASH|`http://testendpoint-testaccount.streaming.mediaservices.windows.net/fecebb23-46f6-490d-8b70-203e86b0df58/BigBuckBunny.ism/Manifest(format=mpd-time-csf,filter=myAssetFilter)`|
|Smooth Streaming|`http://testendpoint-testaccount.streaming.mediaservices.windows.net/fecebb23-46f6-490d-8b70-203e86b0df58/BigBuckBunny.ism/Manifest(filter=myAssetFilter)`|

## Define filters

There are two types of asset filters: 

* [Account Filters](https://docs.microsoft.com/rest/api/media/accountfilters) (global) - can be applied to any asset in the Azure Media Services account, have a lifetime of the account.
* [Asset Filters](https://docs.microsoft.com/rest/api/media/assetfilters) (local) - can only be applied to an asset with which the filter was associated upon creation, have a lifetime of the asset. 

[Account Filter](https://docs.microsoft.com/rest/api/media/accountfilters) and [Asset Filter](https://docs.microsoft.com/rest/api/media/assetfilters) types have exactly the same properties for defining/describing the filter. Except when creating the **Asset Filter**, you need to specify the asset name with which you want to associate the filter.

Depending on your scenario, you decide what type of a filter is more suitable (Asset Filter or Account Filter). Account Filters are suitable for device profiles (rendition filtering) where Asset Filters could be used to trim a specific asset.

You use the following properties to describe the filters. 

|Name|Description|
|---|---|
|firstQuality|The first quality bitrate of the filter.|
|presentationTimeRange|The presentation time range. This property is used for filtering manifest start/end points, presentation window length, and the live start position. <br/>For more information, see [PresentationTimeRange](#PresentationTimeRange).|
|tracks|The tracks selection conditions. For more information, see [tracks](#tracks)|

### PresentationTimeRange

Use this property with **Asset Filters**. It is not recommended to set the property with **Account Filters**.

|Name|Description|
|---|---|
|**endTimestamp**|The absolute end time boundary. Applies to Video on Demand (VoD). For the Live presentation, it is silently ignored and applied when the presentation ends and the stream becomes VoD.<br/><br/>The value represents an absolute end point of the stream. It gets rounded to the closest next GOP start.<br/><br/>Use StartTimestamp and EndTimestamp to trim the playlist (manifest). For example, StartTimestamp=40000000 and EndTimestamp = 100000000 will generate a playlist that contains media between StartTimestamp and EndTimestamp. If a fragment straddles the boundary, the entire fragment will be included in the manifest.<br/><br/>Also, see the **forceEndTimestamp** definition that follows.|
|**forceEndTimestamp**|Applies to Live filters.<br/><br/>**forceEndTimestamp** is a boolean that indicates whether or not **endTimestamp** was set to a valid value. <br/><br/>If the value is **true**, the **endTimestamp** value should be specified. If it is not specified, then a bad request is returned.<br/><br/>If for example, you want to define a filter that starts at 5 minutes into the input video, and lasts until the end of the stream, you would set **forceEndTimestamp** to false and omit setting **endTimestamp**.|
|**liveBackoffDuration**|Applies to Live only. The property is used to define live playback position. Using this rule, you can delay live playback position and create a server-side buffer for players. LiveBackoffDuration is relative to the live position. The maximum live backoff duration is 300 seconds.|
|**presentationWindowDuration**|Applies to Live. Use **presentationWindowDuration** to apply a sliding window to the playlist. For example, set presentationWindowDuration=1200000000 to apply a two-minute sliding window. Media within 2 minutes of the live edge will be included in the playlist. If a fragment straddles the boundary, the entire fragment will be included in the playlist. The minimum presentation window duration is 60 seconds.|
|**startTimestamp**|Applies to VoD or Live streams. The value represents an absolute start point of the stream. The value gets rounded to the closest next GOP start.<br/><br/>Use **startTimestamp** and **endTimestamp** to trim the playlist (manifest). For example, startTimestamp=40000000 and endTimestamp = 100000000 will generate a playlist that contains media between StartTimestamp and EndTimestamp. If a fragment straddles the boundary, the entire fragment will be included in the manifest.|
|**timescale**|Applies to VoD or Live streams. The timescale used by the timestamps and durations specified above. The default timescale is 10000000. An alternative timescale can be used. Default is 10000000 HNS (hundred nanosecond).|

### Tracks

You specify a list of filter track property conditions (FilterTrackPropertyConditions) based on which the tracks of your stream (Live or Video on Demand) should be included into dynamically created manifest. The filters are combined using a logical **AND** and **OR** operation.

Filter track property conditions describe track types, values (described in the following table), and operations (Equal, NotEqual). 

|Name|Description|
|---|---|
|**Bitrate**|Use the bitrate of the track for filtering.<br/><br/>The recommended value is a range of bitrates, in bits per second. For example, "0-2427000".<br/><br/>Note: while you can use a specific bitrate value, like 250000 (bits per second), this approach is not recommended, as the exact bitrates can fluctuate from one Asset to another.|
|**FourCC**|Use the FourCC value of the track for filtering.<br/><br/>The value is the first element of codecs format, as specified in [RFC 6381](https://tools.ietf.org/html/rfc6381). Currently, the following codecs are supported: <br/>For Video: "avc1", "hev1", "hvc1"<br/>For Audio: "mp4a", "ec-3"<br/><br/>To determine the FourCC values for tracks in an Asset, [get and examine the manifest file](#get-and-examine-manifest-files).|
|**Language**|Use the language of the track for filtering.<br/><br/>The value is the tag of a language you want to include, as specified in RFC 5646. For example, "en".|
|**Name**|Use the name of the track for filtering.|
|**Type**|Use the type of the track for filtering.<br/><br/>The following values are allowed: "video", "audio", or "text".|

## Example

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

## Next steps

The following articles show how to create filters programmatically.  

- [Create filters with REST APIs](filters-dynamic-manifest-rest-howto.md)
- [Create filters with .NET](filters-dynamic-manifest-dotnet-howto.md)
- [Create filters with CLI](filters-dynamic-manifest-cli-howto.md)

