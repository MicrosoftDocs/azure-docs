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
ms.date: 05/23/2019
ms.author: juliako

---
# Filters

When delivering your content to customers (Live Streaming events or Video on Demand) your client might need more flexibility than what's described in the default asset's manifest file. Azure Media Services offers [Dynamic Manifests](filters-dynamic-manifest-overview.md) based on pre-defined filters. 

Filters are server-side rules that allow your customers to do things like: 

- Play back only a section of a video (instead of playing the whole video). For example:
  - Reduce the manifest to show a sub-clip of a live event ("sub-clip filtering"), or
  - Trim the start of a video ("trimming a video").
- Deliver only the specified renditions and/or specified language tracks that are supported by the device that is used to play back the content ("rendition filtering"). 
- Adjust Presentation Window (DVR) in order to provide a limited length of the DVR window in the player ("adjusting presentation window").

Media Services enables you to create **Account filters** and **Asset filters** for your content. In addition, you can associate your pre-created filters with a **Streaming Locator**.

## Defining filters

There are two types of filters: 

* [Account Filters](https://docs.microsoft.com/rest/api/media/accountfilters) (global) - can be applied to any asset in the Azure Media Services account, have a lifetime of the account.
* [Asset Filters](https://docs.microsoft.com/rest/api/media/assetfilters) (local) - can only be applied to an asset with which the filter was associated upon creation, have a lifetime of the asset. 

**Account Filters** and **Asset Filters** types have exactly the same properties for defining/describing the filter. Except when creating the **Asset Filter**, you need to specify the asset name with which you want to associate the filter.

Depending on your scenario, you decide what type of a filter is more suitable (Asset Filter or Account Filter). Account Filters are suitable for device profiles (rendition filtering) where Asset Filters could be used to trim a specific asset.

You use the following properties to describe the filters. 

|Name|Description|
|---|---|
|firstQuality|The first quality bitrate of the filter.|
|presentationTimeRange|The presentation time range. This property is used for filtering manifest start/end points, presentation window length, and the live start position. <br/>For more information, see [PresentationTimeRange](#presentationtimerange).|
|tracks|The tracks selection conditions. For more information, see [tracks](#tracks)|

### presentationTimeRange

Use this property with **Asset Filters**. It is not recommended to set the property with **Account Filters**.

|Name|Description|
|---|---|
|**endTimestamp**|Applies to Video on Demand (VoD).<br/>For the Live Streaming presentation, it is silently ignored and applied when the presentation ends and the stream becomes VoD.<br/>This is a long value that represents an absolute end point of the presentation, rounded to the closest next GOP start. The unit is the timescale, so an endTimestamp of 1800000000 would be for 3 minutes.<br/>Use startTimestamp and endTimestamp to trim the fragments that will be in the playlist (manifest).<br/>For example, startTimestamp=40000000 and endTimestamp=100000000 using the default timescale will generate a playlist that contains fragments from between 4 seconds and 10 seconds of the VoD presentation. If a fragment straddles the boundary, the entire fragment will be included in the manifest.|
|**forceEndTimestamp**|Applies to Live Streaming only.<br/>Indicates whether the endTimestamp property must be present. If true, endTimestamp must be specified or a bad request code is returned.<br/>Allowed values: false, true.|
|**liveBackoffDuration**|Applies to Live Streaming only.<br/> This value defines the latest live position that a client can seek to.<br/>Using this property, you can delay live playback position and create a server-side buffer for players.<br/>The unit for this property is timescale (see below).<br/>The maximum live back off duration is 300 seconds (3000000000).<br/>For example, a value of 2000000000 means that the latest available content is 20 seconds delayed from the real live edge.|
|**presentationWindowDuration**|Applies to Live Streaming only.<br/>Use presentationWindowDuration to apply a sliding window of fragments to include in a playlist.<br/>The unit for this property is timescale (see below).<br/>For example, set presentationWindowDuration=1200000000 to apply a two-minute sliding window. Media within 2 minutes of the live edge will be included in the playlist. If a fragment straddles the boundary, the entire fragment will be included in the playlist. The minimum presentation window duration is 60 seconds.|
|**startTimestamp**|Applies to Video on Demand (VoD) or Live Streaming.<br/>This is a long value that represents an absolute start point of the stream. The value gets rounded to the closest next GOP start. The unit is the timescale, so a startTimestamp of 150000000 would be for 15 seconds.<br/>Use startTimestamp and endTimestampp to trim the fragments that will be in the playlist (manifest).<br/>For example, startTimestamp=40000000 and endTimestamp=100000000 using the default timescale will generate a playlist that contains fragments from between 4 seconds and 10 seconds of the VoD presentation. If a fragment straddles the boundary, the entire fragment will be included in the manifest.|
|**timescale**|Applies to all timestamps and durations in a Presentation Time Range, specified as the number of increments in one second.<br/>Default is 10000000 -  ten million increments in one second, where each increment would be 100 nanoseconds long.<br/>For example, if you want to set a startTimestamp at 30 seconds, you would use a value of 300000000 when using the default timescale.|

### Tracks

You specify a list of filter track property conditions (FilterTrackPropertyConditions) based on which the tracks of your stream (Live Streaming or Video on Demand) should be included into dynamically created manifest. The filters are combined using a logical **AND** and **OR** operation.

Filter track property conditions describe track types, values (described in the following table), and operations (Equal, NotEqual). 

|Name|Description|
|---|---|
|**Bitrate**|Use the bitrate of the track for filtering.<br/><br/>The recommended value is a range of bitrates, in bits per second. For example, "0-2427000".<br/><br/>Note: while you can use a specific bitrate value, like 250000 (bits per second), this approach is not recommended, as the exact bitrates can fluctuate from one Asset to another.|
|**FourCC**|Use the FourCC value of the track for filtering.<br/><br/>The value is the first element of codecs format, as specified in [RFC 6381](https://tools.ietf.org/html/rfc6381). Currently, the following codecs are supported: <br/>For Video: "avc1", "hev1", "hvc1"<br/>For Audio: "mp4a", "ec-3"<br/><br/>To determine the FourCC values for tracks in an Asset, get and examine the manifest file.|
|**Language**|Use the language of the track for filtering.<br/><br/>The value is the tag of a language you want to include, as specified in RFC 5646. For example, "en".|
|**Name**|Use the name of the track for filtering.|
|**Type**|Use the type of the track for filtering.<br/><br/>The following values are allowed: "video", "audio", or "text".|

### Example

The following example defines a Live Streaming filter: 

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

## Associating filters with Streaming Locator

You can specify a list of [asset or account filters](filters-concept.md) on your [Streaming Locator](https://docs.microsoft.com/rest/api/media/streaminglocators/create#request-body). The [Dynamic Packager](dynamic-packaging-overview.md) applies this list of filters together with those your client specifies in the URL. This combination generates a [Dynamic Manifest](filters-dynamic-manifest-overview.md), which is based on filters in the URL + filters you specify on the Streaming Locator. 

See the following examples:

* [Associate filters with Streaming Locator - .NET](filters-dynamic-manifest-dotnet-howto.md#associate-filters-with-streaming-locator)
* [Associate filters with Streaming Locator - CLI](filters-dynamic-manifest-cli-howto.md#associate-filters-with-streaming-locator)

## Updating filters
 
**Streaming Locators** are not updatable while filters can be updated. 

It is not recommended to update the definition of filters associated with an actively published **Streaming Locator**, especially when CDN is enabled. Streaming servers and CDNs can have internal caches that may result in stale cached data to be returned. 

If the filter definition needs to be changed consider creating a new filter and adding it to the **Streaming Locator** URL or publishing a new **Streaming Locator** that references the filter directly.

## Next steps

The following articles show how to create filters programmatically.  

- [Create filters with REST APIs](filters-dynamic-manifest-rest-howto.md)
- [Create filters with .NET](filters-dynamic-manifest-dotnet-howto.md)
- [Create filters with CLI](filters-dynamic-manifest-cli-howto.md)

