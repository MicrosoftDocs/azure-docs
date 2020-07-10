---
title: Playback of recordings - Azure
description: You can use Live Video Analytics on IoT Edge for continuous video recording, whereby you can record video into the cloud for weeks or months. You can also limit your recording to clips that are of interest, via event-based recording. This article talks about how to playback recordings.
ms.topic: how-to
ms.date: 04/27/2020

---
# Playback of recordings 

## Pre-read  

* [Video playback](video-playback-concept.md)
* [Continuous video recording](continuous-video-recording-concept.md)
* [Event-based video recording](event-based-video-recording-concept.md)

## Background  

You can use Live Video Analytics on IoT Edge for [continuous video recording](continuous-video-recording-concept.md) (CVR), whereby you can record video into the cloud for weeks or months. You can also limit your recording to clips that are of interest, via [event-based video recording](event-based-video-recording-concept.md) (EVR). 

Your Media Service  account is linked to an Azure Storage account, and when you record video to the cloud, the content is written to a [Media Service asset](terminology.md#asset). Media Services allows you to [stream that content](terminology.md#streaming), either after the recording is complete, or while the recording is ongoing. Media Services provides you with the necessary capabilities to deliver streams via HLS or MPEG-DASH protocols to playback devices (clients). See the [video playback](video-playback-concept.md) article for more details. You would use Media Service APIs to generate the requisite streaming URLs – used by clients to play back the video & audio. To construct the streaming URL for an asset, see [create a streaming locator and build URLs](../latest/create-streaming-locator-build-url.md). Once the streaming URL has been created for an asset, you can and should store the association of the URL with the video source (that is, camera) in your content management system.

For example, when streaming via HLS, the streaming URL would look like `https://{hostname-here}/{locatorGUID}/content.ism/manifest(format=m3u8-aapl).m3u8`. For MPEG-DASH, it would look like `https://{hostname-here}/{locatorGUID}/content.ism/manifest(format=mpd-time-cmaf).mpd`.

This returns a  manifest file, which, amongst other things, describes the overall duration of the stream that is being delivered, and whether it represents pre-recorded content, or the on-going ‘live’ feed.

### Live vs. VoD  

Streaming protocols like HLS and MPEG-DASH were authored to handle scenarios like streaming of live videos, as well as streaming of on-demand/pre-recorded content like TV shows and movies. For live videos, HLS and MPEG-DASH clients are designed to start playing from the ‘most recent’ time onwards. With movies, however, viewers expect to be able to start from the beginning and jump around if they choose to. The HLS and MPEG-DASH manifests have flags that indicate to the clients whether the video represents a live stream, or it is pre-recorded content.
This concept also applies to HLS and MPEG-DASH streams from Assets that contain video recorded using Live Video Analytics on IoT Edge.

## Browsing and selective playback of recordings  

Consider the scenario where you have used Live Video Analytics on IoT Edge to record video only from 8AM to 10AM on days when a school was open, for the entire academic year. Or perhaps you are recording video only from 7AM to 7PM on national holidays. In either of these two scenarios, when attempting to browse and view your video recording, you would need:

* A way to determine what dates/hours of video you have in a  recording.
* A way to select a portion (for example, 9AM to 11AM on New Years Day) of that recording to playback.

Media Services provides you with a query API (availableMedia) to address the first issue, and time-range filters (startTime, endTime) to address the second.

## Query API 

When using CVR, playback devices (clients) cannot request a manifest covering playback of the entire recording.  A multi-year recording would produce a manifest file that was too large for playback and it would be unwieldy to parse into usable portions on the client side.  The client needs to know what datetime ranges have data in the recording so that it can make valid requests without much guess work. This is where the new Query API comes in – clients can now use this server-side API to discover content.

Where the precision value can be one of: year, month, day, or full (as shown below). 

|Precision|year|month|day|full|
|---|---|---|---|---|
|Query|`/availableMedia?precision=year&startTime=2018&endTime=2019`|`/availableMedia?precision=month& startTime=2018-01& endTime=2019-02`|`/availableMedia?precision=day& startTime=2018-01-15& endTime=2019-02-02`|`/availableMedia?precision=full& startTime=2018-01-15T10:08:11.123& endTime=2019-01-015T12:00:01.123`|
|Response|`{  "timeRanges":[{ "start":"2018", "end":"2019" }]}`|`{  "timeRanges":[{ "start":"2018-03", "end":"2019-01" }]}`|`{  "timeRanges":[    { "start":"2018-03-01", "end":"2018-03-07" },    { "start":"2018-03-09", "end":"2018-03-31" }  ]}`|Full fidelity response. If there were no gaps at all, the start would be startTime, and end would be endTime.|
|Constrains|&#x2022;startTime <= endTime<br/>&#x2022;Both should be in YYYY format, otherwise return error.<br/>&#x2022;Values can be any number of years apart.<br/>&#x2022;Values are inclusive.|&#x2022;startTime <= endTime<br/>&#x2022;Both should be in YYYY-MM format, otherwise return error.<br/>&#x2022;Values can be at most 12 months apart.<br/>&#x2022;Values are inclusive.|&#x2022;startTime <= endTime<br/>&#x2022;Both should be in YYYY-MM-DD format, otherwise return error.<br/>&#x2022;Values can be at most 31 days apart.<br/>Values are inclusive.|&#x2022;startTime < endTime<br/>&#x2022;Values can be at most 25 hours apart.<br/>&#x2022;Values are inclusive.|

#### Additional request format considerations

* All times are in UTC
* The precision query string parameter is required.  
* The startTime and endTime query string parameters are required for the month, day, and full precision values.  
* The startTime and endTime query string parameters are optional for the year precision value (none, either, or both is supported).  

    * If the startTime is omitted, it is assumed to be the first year in the recording.
    * If the endTime is omitted, it is assumed to be the last year in the recording.
    * For example, if your recording started in 2011, and has continued until 2020, then:

        * /availableMedia?precision=year is the same as /availableMedia?precision=year&startTime=2011&endTime=2020
        * /availableMedia?precision=year&startTime=2015 is the same as /availableMedia?precision=year&startTime=2015&endTime=2020
        * /availableMedia?precision=year&endTime=2018 is the same as /availableMedia?precision=year&startTime=2011&endTime=2018

If no media data is available for the time ranges, then an empty list is returned.

If the asset does not contain a recording from a media graph, then an HTTP 400 response will be returned with an error message explaining that this feature is only available for content recorded via a media graph.

If the duration of time specified by the parameters is larger than allowed by the Maximum Time Range for a given query type, then an HTTP 400 will be returned with an error message explaining the maximum allowed time range for the requested query type.

Assuming the time range is valid for the parameters given, no errors will be returned for queries that are outside of the time window of data in the recording.  Meaning if the recording started 7 hours ago but the customer asks for available media from {UtcNow – 24 hours} to UtcNow, then we’d just return the {UtcNow – 7} hours of data.

### Response format  

The availableMedia call returns a set of time values.

The response will be a JSON body, with timeRanges values being an array of ISO 8601 UTC dates for the year (in YYYY format), month (in YYYY-MM format), or day (YYYY-MM-DD) depending on the precision requested.  The full timeRanges will contain both a start and end value formatted as an ISO 8601 UTC date time (in YYYY-MM-DDThh:mm:ss.sssZ format).

For the availableMedia query, the API will key off of the video timeline. Any discontinuities in the timeline will show up as gaps in the response.

#### Response example for availableMedia

##### Example 1: Live recording with no gaps

Here is a response showing all of the available media for December 21, 2019, where the recording was 100% complete. Response has only one start/end pair.

```
GET https://hostname/locatorId/content.ism/availableMedia?precision=full&startTime=2019-12-21T00:00:00Z&endTime=2019-12-22T00:00:00Z
{
   "timeRanges":[
   {
         "start":"2019-12-21T00:00:00.000Z", 
         "end":"2019-12-22T00:00:00.000Z"
    }
   ]
}
```

##### Example 2: Live recording with a 2-second gap

Suppose for some reason, the camera failed to send valid video for a 2-second interval on a day. Here is a response showing all of the available media for December 21, 2019:

```
GET https://hostname/locatorId/content.ism/availableMedia?precision=full&startTime=2019-12-21T00:00:00Z&endTime=2019-12-22T00:00:00Z
{
   "timeRanges":[
    {
         "start":"2019-12-21T00:00:00Z", 
         "end":"2019-12-21T04:01:08Z"
    },
    {
         "start":"2019-12-21T04:01:10Z", 
         "end":"2019-12-22T00:00:00Z"
    }
   ]
}
```

##### Example 3: Live recording with an 8 hour gap

Suppose the camera and/or on-premise facility lost power for an 8-hour period during the day, from 4 AM UTC to noon UTC, and there was no backup power source. Here is a response showing all of the available media for such a day

```
GET https://hostname/locatorId/content.ism/availableMedia?precision=full&startTime=2019-12-21T00:00:00Z&endTime=2019-12-22T00:00:00Z
{
   "timeRanges":[
    {
         "start":"2019-12-21T00:00:00Z", 
         "end":"2019-12-21T04:00:00Z"
    },
    {
         "start":"2019-12-21T12:00:00Z", 
         "end":"2019-12-22T00:00:00Z"
    }
   ]
}
```

#### Example 4: Live recording where no video is recorded over summer holidays

Suppose you recorded video only when the school was in session, and recording was stopped from June 17 through September 6. A query for available months would look like:

```
GET https://hostname/locatorId/content.ism/availableMedia?precision=month&startTime=2019-01&endTime=2019-12
{
   "timeRanges":[
    {
         "start":"2019-01", 
         "end":"2019-06"
    },
    {
         "start":"2019-09", 
         "end":"2019-12"
    }
   ]
}
```

If you then asked for the available days in June, you would see:

```
GET https://hostname/locatorId/content.ism/availableMedia?precision=day&startTime=2019-06-01&endTime=2019-06-30
{
   "timeRanges":[
    {
         "start":"2019-06-01", 
         "end":"2019-06-17"
    }
   ]
}
```

##### Example 5: Live recording where no video is recorded over weekends or holidays

Suppose you recorded video only during business hours. A query for available days would look like

```
GET https://hostname/locatorId/content.ism/availableMedia?precision=day&startTime=2020-02-01&endTime=2020-02-29
{
   "timeRanges":[
    {
         "start":"2020-02-03", 
         "end":"2020-02-07"
    },
    {
         "start":"2020-02-10", 
         "end":"2020-02-14"
    },
    {
         "start":"2020-02-18", // Monday Feb 17th was a holiday
         "end":"2020-02-21"
    },
    {
         "start":"2020-02-24", 
         "end":"2020-02-28"
    }
   ]
}
```

## Time range filters

As mentioned above, these filters help you select portions of your recording (for example, from 9AM to 11AM on New Years Day) for playback. When streaming via HLS, the streaming URL would look like `https://{hostname-here}/{locatorGUID}/content.ism/manifest(format=m3u8-aapl).m3u8`. In order to select a portion of your recording, you would add a startTime and an endTime parameter, such as: `https://{hostname-here}/{locatorGUID}/content.ism/manifest(format=m3u8-aapl,startTime=2019-12-21T08:00:00Z,endTime=2019-12-21T10:00:00Z).m3u8`. Thus, the time range filters are URL modifiers used to describe the portion of the recording’s timeline that is included in the streaming manifest:

* `starttime` is an ISO 8601 DateTime stamp that describes the desired start time of the video timeline in the returned manifest.
* `endtime` is an ISO 8601 DateTime stamp that describes the desired end time of the video timeline returned in the manifest.

The maximum length (in time) of such a manifest cannot exceed 24 hours.

Here are the constraints on the filters.

|startTime|	endTime	|Result|
|---|---|---|
|Absent	|Absent	|Returns the most recent portion of the video in the Asset, up to a maximum length of 4 hours.<br/><br/>If the Asset has not been written to (no new video data coming in) recently, an on-demand (VoD) manifest is returned. Else, a live manifest is returned.|
|Present|Absent|	Return a manifest with whatever video is available that is newer than startTime, if such a manifest would be shorter than 24 hours.<br/>If the length of the manifest would exceed 24 hours, then return an error.<br/>If the Asset has not been written to (no new video data coming in) recently, an on-demand (VoD) manifest is returned. Else, a live manifest is returned.
|Absent|Present	|Error – if startTime is present, then endTime is mandatory.|
|Present|Present|Return a VoD manifest with whatever video is available between startTime and endTime.<br/>The span (startTime, endTime) cannot exceed 24 hours.|

### Response examples  

#### Example 1: Live recording with no gaps

Here is a response showing all of the available media for December 21, 2019, where the recording was 100% complete. Response has only one start/end pair.

```
GET https://hostname/locatorId/content.ism/availableMedia?precision=full&startTime=2019-12-21T00:00:00Z&endTime=2019-12-22T00:00:00Z
{
   "timeRanges":[
   {
         "start":"2019-12-21T00:00:00Z", 
         "end":"2019-12-22T00:00:00Z"
    }
   ]
}
```

When the recording is continuous, then you can request HLS or DASH manifests for any portion of time within that Start/End pair – as long as the span is 24 hours or less. An example for a 4-hour HLS manifest request for the above would be:

`GET https://{hostname-here}/{locatorGUID}/content.ism/manifest(format=m3u8-aapl,startTime=2019-12-21T14:00:00.000Z,endTime=2019-12-21T18:00:00.000Z).m3u8`

#### Example 2: Live recording with a 2-second gap

Suppose for some reason, the camera failed to send valid video for a 2-second interval on a day. Here is a response showing the available media for December 21, 2019:

```
GET https://hostname/locatorId/content.ism/availableMedia?precision=full&startTime=2019-12-21T00:00:00Z&endTime=2019-12-22T00:00:00Z
{
   "timeRanges":[
    {
         "start":"2019-12-21T00:00:00Z", 
         "end":"2019-12-21T04:01:08Z"
    },
    {
         "start":"2019-12-21T04:01:10Z", 
         "end":"2019-12-22T00:00:00Z"
    }
   ]
}
```

With a recording such as the above, again, you could request HLS and DASH manifests with any startTime/endTime pairs, as long as the span was below 24 hours. If these values straddled the gap at 04:01:08AM UTC, then the returned manifest would signal the discontinuity in the media timeline, per the relevant specs for those protocols.

#### Example 3: Live recording with an 8-hour gap

Suppose the camera and/or on-premise facility lost power for an 8-hour period during the day, from 4 AM UTC to noon UTC, and there was no backup power source. Here is a response showing all of the available media for such a day.

```
GET https://hostname/locatorId/content.ism/availableMedia?precision=full&startTime=2019-12-21T00:00:00Z&endTime=2019-12-22T00:00:00Z
{
   "timeRanges":[
    {
         "start":"2019-12-21T00:00:00Z", 
         "end":"2019-12-21T04:00:00Z"
    },
    {
         "start":"2019-12-21T12:00:00Z", 
         "end":"2019-12-22T00:00:00Z"
    }
   ]
}
```

With such a recording:

* If you request a manifest where both startTime/endTime range filters were inside the ‘available’ parts of the timeline, namely from midnight to 4AM, or noon to midnight, then the service would return a manifest that covers the time from startTime to endTime, such as:

    `GET https://{hostname-here}/{locatorGUID}/content.ism/manifest(format=m3u8-aapl,startTime=2019-12-21T14:01:00.000Z,endTime=2019-12-21T03:00:00.000Z).m3u8`
* If you request a manifest where the startTime and endTime were inside the ‘hole’ in the middle – say from 8AM to 10AM UTC, then the service would behave the same way as if an Asset Filter were to result in an empty result.

    [This is a request that gets an empty response] `GET https://{hostname-here}/{locatorGUID}/content.ism/manifest(format=m3u8-aapl,startTime=2019-12-21T08:00:00.000Z,endTime=2019-12-21T10:00:00.000Z).m3u8`
* If you request a manifest where only one of the startTime or endTime is inside the ‘hole’, then the returned manifest would only include a portion of that timespan. It would snap the startTime or endTime value to the nearest valid boundary. For example, if you asked for a 3-hr stream from 10AM to 1PM, the response would contain 1-hr worth of media for 12 noon to 1PM

    `GET https://{hostname-here}/{locatorGUID}/content.ism/manifest(format=m3u8-aapl,startTime=2019-12-21T10:00:00.000Z,endTime=2019-12-21T13:00:00.000Z).m3u8`
    
    Returned manifest would start at 2019-12-21T12:00:00.000Z, even though the request asked for a start of 10AM. When building a video management system with a player plugin, care should be taken to signal this to the viewer. An unaware viewer would be confused as to why the playback timeline was beginning at noon, and not 10AM as requested

## Recording and playback latencies

When using Live Video Analytics on IoT Edge to record to an Asset, you will specify a segmentLength property which tells the module to aggregate a minimum duration of video (in seconds) before it is recorded to the cloud. For example, if segmentLength is set to 300, then the module will accumulate 5 minutes worth of video before uploading one 5 minutes “chunk”, then go into accumulation mode for the next 5 minutes, and upload again. Increasing the segmentLength has the benefit of lowering your Azure Storage transaction costs, as the number of reads and writes will be no more frequent than once every segmentLength seconds.

Consequently, streaming of the video from Media Services will be delayed by at least that much time. 

Another factor that determines playback latency (the delay between the time an event occurs in front of the camera, to the time it can be viewed on a playback device) is the group-of-pictures [GOP](https://en.wikipedia.org/wiki/Group_of_pictures) duration. As [reducing the delay of live streams by using 3 simple techniques](https://medium.com/vrt-digital-studio/reducing-the-delay-of-live-streams-by-using-3-simple-techniques-e8e028b0a641) explains, longer the GOP duration, longer the latency. It’s common to have IP cameras used in surveillance and security scenarios configured to use GOPs longer than 30 seconds. This has a large impact on the overall latency.

## Next steps

[Continuous video recording tutorial](continuous-video-recording-tutorial.md)
