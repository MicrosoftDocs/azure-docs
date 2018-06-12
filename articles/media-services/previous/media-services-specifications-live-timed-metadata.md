---
title: Azure Media Services - Signaling Timed Metadata in Live Streaming | Microsoft Docs
description: This specification outlines two modes that are supported by Media Services for signaling timed metadata within live streaming. This includes support for generic timed metadata signals, as well as SCTE-35 signaling for ad splice insertion. 
services: media-services
documentationcenter: ''
author: cenkdin
manager: cfowler
editor: johndeu

ms.assetid: 265b94b1-0fb8-493a-90ec-a4244f51ce85
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/17/2018
ms.author: johndeu;

---
# Signaling Timed Metadata in Live Streaming


## 1 Introduction 
In order to facilitate the insertion of advertisements, or custom events on a client player, broadcasters often make use of timed metadata embedded within the video. To enable these scenarios, Media Services provides support for the transport of timed metadata along with the media, from the ingest point of the live streaming channel to the client application.
This specification outlines two modes that are supported by Media Services for timed metadata within live streaming signals:

1. [SCTE-35] signaling that heeds the recommended practices outlined by [SCTE-67]

2. A generic timed metadata signaling mode, for messages that are not [SCTE-35]

### 1.2 Conformance Notation
The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in RFC 2119

### 1.3 Terms Used

| Term              | Definition                                                                                                                                                                                                                       |
|-------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Presentation Time | The time that an event is presented to a viewer. The  time represents the moment on the media timeline that a viewer would see the event. For example, the presentation time of a SCTE-35 splice_info() command message is the splice_time(). |
| Arrival Time      | The time that an event message arrives. The time is typically distinct from the presentation time of the event, since event messages are sent ahead of the presentation time of the event.                                     |
| Sparse track      | media track that is not continuous, and is time synchronized with a parent or control track.                                                                                                                                    |
| Origin            | The Azure Media Streaming Service                                                                                                                                                                                                |
| Channel Sink      | The Azure Media Live Streaming Service                                                                                                                                                                                           |
| HLS               | Apple HTTP Live Streaming protocol                                                                                                                                                                                               |
| DASH              | Dynamic Adaptive Streaming Over HTTP                                                                                                                                                                                             |
| Smooth            | Smooth Streaming Protocol                                                                                                                                                                                                        |
| MPEG2-TS          | MPEG 2 Transport Streams                                                                                                                                                                                                         |
| RTMP              | Real-Time Multimedia Protocol                                                                                                                                                                                                    |
| uimsbf            | Unsigned integer, most significant bit first.                                                                                                                                                                                    |

-----------------------

## 2 Timed Metadata Ingest
## 2.1 RTMP Ingest
RTMP supports timed metadata signals sent as AMF cue messages embedded within the RTMP stream. The cue messages may be sent some time before the actual event, or ad splice insertion needs to occur. To support this scenario, the actual time of the splice or segment is sent within the cure message. For more information, see [AMF0].

The following table describes the format of the AMF message payload that Media Services will ingest.

The name of the AMF message can be used to differentiate multiple event streams of the same type.  For [SCTE-35] messages, the name of the AMF message MUST be “onAdCue” as recommended in [SCTE-67].  Any fields not listed below MUST be ignored, so that innovation of this design is not inhibited in the future.

### Signal Syntax
For RTMP simple mode, Media Services supports a single AMF cue message called "onAdCue" with the following format:

### Simple Mode

| Field Name | Field Type | Required? | Descriptions                                                                                                             |
|------------|------------|----------|--------------------------------------------------------------------------------------------------------------------------|
| cue        | String     | Required | The event message.  Shall be "SpliceOut" to designate a simple mode splice.                                              |
| id         | String     | Required | A unique identifier describing the splice or segment. Identifies this instance of the message                            |
| duration   | Number     | Required | The duration of the splice. Units are fractional seconds.                                                                |
| elapsed    | Number     | Optional | When the signal is being repeated in order to support tune in, this field shall be the amount of presentation time that has elapsed since the splice began. Units are fractional seconds. When using simple mode, this value should not exceed the original duration of the splice.                                                  |
| time       | Number     | Required | Shall be the time of the splice, in presentation time. Units are fractional seconds.                                     |

---------------------------

### SCTE-35 Mode

| Field Name | Field Type | Required? | Descriptions                                                                                                             |
|------------|------------|----------|--------------------------------------------------------------------------------------------------------------------------|
| cue        | String     | Required | The event message.  For [SCTE-35] messages, this MUST be the base64 (IETF RFC 4648) binary encoded splice_info_section() in order for messages to be sent to HLS, Smooth, and Dash clients in compliance with [SCTE-67].                                              |
| type       | String     | Required | A URN or URL identifying the message scheme; for example, "urn:example:signaling:1.0".  For [SCTE-35] messages, this MUST be "urn:scte:scte35:2013a:bin" in order for messages to be sent to HLS, Smooth, and Dash clients in compliance with [SCTE-67].  |
| id         | String     | Required | A unique identifier describing the splice or segment. Identifies this instance of the message.  Messages with equivalent semantics shall have the same value.|
| duration   | Number     | Required | The duration of the event or ad splice-segment, if known. If unknown, the value should be 0.                                                                 |
| elapsed    | Number     | Optional | When the [SCTE-35] ad signal is being repeated in order to tune in, this field shall be the amount of presentation time that has elapsed since the splice began. Units are fractional seconds. In [SCTE-35] mode, this value may exceed the original specified duration of the splice or segment.                                                  |
| time       | Number     | Required | The presentation time of the event or ad splice.  The presentation time and duration SHOULD align with Stream Access Points (SAP) of type 1 or 2, as defined in [ISO-14496-12] Annex I. For HLS egress, time and duration SHOULD align with segment boundaries. The presentation time and duration of different event messages within the same event stream MUST not overlap. Units are fractional seconds.

---------------------------

#### 2.1.1 Cancelation and Updates

Messages can be canceled or updated by sending multiple messages with the same
presentation time and ID. The presentation time and ID uniquely identify the
event, and the last message received for a specific presentation time that meets
pre-roll constraints is the message that is acted upon. The updated event replaces any
previously received messages. The pre-roll constraint is four seconds. Messages
received at least four seconds prior to the presentation time will be acted upon.

## 2.2 Fragmented MP4 Ingest (Smooth Streaming)
Refer to [LIVE-FMP4] for requirements on live stream ingest. The following sections provide details regarding ingest of timed presentation metadata.  Timed presentation metadata is ingested as a sparse track, which is defined in both the Live Server Manifest Box (see MS-SSTR) and the Movie Box (‘moov’).  Each sparse fragment consists of a Movie Fragment Box (‘moof’) and Media Data Box (‘mdat’), where the ‘mdat’ box is the binary message.

#### 2.2.1 Live Server Manifest Box
The sparse track MUST be declared in the Live Server Manifest box with a
\<textstream\> entry and it MUST have the following attributes set:

| **Attribute Name** | **Field Type** | **Required?** | **Description**                                                                                                                                                                                                                                                 |
|--------------------|----------------|---------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| systemBitrate      | Number         | Required      | MUST be “0”, indicating a track with unknown, variable bitrate.                                                                                                                                                                                                 |
| parentTrackName    | String         | Required      | MUST be the name of the parent track, to which the sparse track time codes are timescale aligned. The parent track cannot be a sparse track.                                                                                                                    |
| manifestOutput     | Boolean        | Required      | MUST be “true”, to indicate that the sparse track will be embedded in the Smooth client manifest.                                                                                                                                                               |
| Subtype            | String         | Required      | MUST be the four character code “DATA”.                                                                                                                                                                                                                         |
| Scheme             | String         | Required      | MUST be a URN or URL identifying the message scheme; for example, "urn:example:signaling:1.0". For [SCTE-35] messages, this MUST be "urn:scte:scte35:2013a:bin" in order for messages to be sent to HLS, Smooth, and Dash clients in compliance with [SCTE-67]. |
| trackName          | String         | Required      | MUST be the name of the sparse track. The trackName can be used to differentiate multiple event streams with the same scheme. Each unique event stream must have a unique track name.                                                                           |
| timescale          | Number         | Optional      | MUST be the timescale of the parent track.                                                                                                                                                                                                                      |

-------------------------------------

### 2.2.2 Movie Box

The Movie Box (‘moov’) follows the Live Server Manifest Box as part of the
stream header for a sparse track.

The ‘moov’ box SHOULD contain a **TrackHeaderBox (‘tkhd’)** box as defined in
[ISO-14496-12] with the following constraints:

| **Field Name** | **Field Type**          | **Required?** | **Description**                                                                                                |
|----------------|-------------------------|---------------|----------------------------------------------------------------------------------------------------------------|
| duration       | 64-bit unsigned integer | Required      | SHOULD be 0, since the track box has zero samples and the total duration of the samples in the track box is 0. |
-------------------------------------

The ‘moov’ box SHOULD contain a **HandlerBox (‘hdlr’)** as defined in
[ISO-14496-12] with the following constraints:

| **Field Name** | **Field Type**          | **Required?** | **Description**   |
|----------------|-------------------------|---------------|-------------------|
| handler_type   | 32-bit unsigned integer | Required      | SHOULD be ‘meta’. |
-------------------------------------

The ‘stsd’ box SHOULD contain a MetaDataSampleEntry box with a coding name as defined in [ISO-14496-12].  For example, for SCTE-35 messages the coding name SHOULD be 'scte'.

### 2.2.3 Movie Fragment Box and Media Data Box

Sparse track fragments consist of a Movie Fragment Box (‘moof’) and a Media Data
Box (‘mdat’).

The MovieFragmentBox (‘moof’) box MUST contain a
**TrackFragmentExtendedHeaderBox (‘uuid’)** box as defined in [MS-SSTR] with the
following fields:

| **Field Name**         | **Field Type**          | **Required?** | **Description**                                                                               |
|------------------------|-------------------------|---------------|-----------------------------------------------------------------------------------------------|
| fragment_absolute_time | 64-bit unsigned integer | Required      | MUST be the arrival time of the event. This value aligns the message with the parent track.   |
| fragment_duration      | 64-bit unsigned integer | Required      | MUST be the duration of the event. The duration can be zero to indicate that the duration is unknown. |

------------------------------------


The MediaDataBox (‘mdat’) box MUST have the following format:

| **Field Name**          | **Field Type**                   | **Required?** | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
|-------------------------|----------------------------------|---------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| version                 | 32-bit unsigned integer (uimsbf) | Required      | Determines the format of the contents of the ‘mdat’ box. Unrecognized versions will be ignored. Currently the only supported version is 1.                                                                                                                                                                                                                                                                                                                                                      |
| id                      | 32-bit unsigned integer (uimsbf) | Required      | Identifies this instance of the message. Messages with equivalent semantics shall have the same value; that is, processing any one event message box with the same id is sufficient.                                                                                                                                                                                                                                                                                                            |
| presentation_time_delta | 32-bit unsigned integer (uimsbf) | Required      | The sum of the fragment_absolute_time, specified in the TrackFragmentExtendedHeaderBox, and the presentation_time_delta MUST be the presentation time of the event. The presentation time and duration SHOULD align with Stream Access Points (SAP) of type 1 or 2, as defined in [ISO-14496-12] Annex I. For HLS egress, time and duration SHOULD align with segment boundaries. The presentation time and duration of different event messages within the same event stream MUST not overlap. |
| message                 | byte array                       | Required      | The event message. For [SCTE-35] messages, the message is the binary splice_info_section(), although [SCTE-67] recommends something else. For [SCTE-35] messages, this MUST be the splice_info_section() in order for messages to be sent to HLS, Smooth, and Dash clients in compliance with [SCTE-67]. For [SCTE-35] messages, the binary splice_info_section() is the payload of the ‘mdat’ box, and it is NOT base64 encoded.                                                            |

------------------------------


### 2.2.4 Cancelation and Updates
Messages can be canceled or updated by sending multiple messages with the same presentation time and ID.  The presentation time and ID uniquely identify the event. The last message received for a specific presentation time, that meets pre-roll constraints, is the message that is acted upon. The updated message replaces any previously received messages.  The pre-roll constraint is four seconds. Messages received at least four seconds prior to the presentation time will be acted upon. 


## 3 Timed Metadata Delivery

Event stream data is opaque to Media Services. Media Services merely
passes three pieces of information between the ingest endpoint and the client
endpoint. The following properties are delivered to the client, in compliance
with [SCTE-67] and/or the client’s streaming protocol:

1.  Scheme – a URN or URL identifying the scheme of the message.

2.  Presentation Time – the presentation time of the event on the media
    timeline.

3.  Duration – the duration of the event.

4.  ID – an optional unique identifier for the event.

5.  Message – the event data.


## 3.1 Smooth Streaming Delivery

Refer to sparse track handling details in [MS-SSTR].

#### Smooth Client Manifest Example
~~~ xml
<?xml version=”1.0” encoding=”utf-8”?>
<SmoothStreamingMedia MajorVersion=”2” MinorVersion=”0” TimeScale=”10000000” IsLive=”true” Duration=”0”
  LookAheadFragmentCount=”2” DVRWindowLength=”6000000000”>

  <StreamIndex Type=”video” Name=”video” Subtype=”” Chunks=”0” TimeScale=”10000000”
    Url=”QualityLevels({bitrate})/Fragments(video={start time})”>
    <QualityLevel Index=”0” Bitrate=”230000”
      CodecPrivateData=”250000010FC3460B50878A0B5821FF878780490800704704DC0000010E5A67F840” FourCC=”WVC1”
      MaxWidth=”364” MaxHeight=”272”/>
    <QualityLevel Index=”1” Bitrate=”305000”
      CodecPrivateData=”250000010FC3480B50878A0B5821FF87878049080894E4A7640000010E5A67F840” FourCC=”WVC1”
      MaxWidth=”364” MaxHeight=”272”/>
    <c t=”0” d=”20000000” r=”300” />
  </StreamIndex>
  <StreamIndex Type=”audio” Name=”audio” Subtype=”” Chunks=”0” TimeScale=”10000000”
    Url=”QualityLevels({bitrate})/Fragments(audio={start time})”>
    <QualityLevel Index=”0” Bitrate=”96000” CodecPrivateData=”1000030000000000000000000000E00042C0”
      FourCC=”WMAP” AudioTag=”354” Channels=”2” SamplingRate=”44100” BitsPerSample=”16” PacketSize=”4459”/>
    <c t=”0” d=”20000000” r=”300” />
  </StreamIndex>
  <StreamIndex Type=”text” Name=”scte35-event-stream” Subtype=”DATA” Chunks=”0” TimeScale=”10000000”
    ParentStreamIndex=”video” ManifestOutput=”true” 
    Url=”QualityLevels({bitrate})/Fragments(captions={start time})”>
    <QualityLevel Index=”0” Bitrate=”0” CodecPrivateData=”” FourCC=””>
      <CustomAttributes>
        <Attribute Name=”Scheme” Value=”urn:scte:scte35:2013a:bin”/>
      </CustomAttributes>
    </QualityLevel>
    <!-- <f> contains base-64 encoded splice_info_section() message 
    <c t=”600000000” d=”300000000”>
<f>PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48QWNxdWlyZWRTaWduYWwgeG1sbnM9InVybjpjYWJsZWxhYnM6bWQ6eHNkOnNpZ25hbGluZzozLjAiIGFjcXVpc2l0aW9uUG9pbnRJZGVudGl0eT0iRVNQTl9FYXN0X0FjcXVpc2l0aW9uX1BvaW50XzEiIGFjcXVpc2l0aW9uU2lnbmFsSUQ9IjRBNkE5NEVFLTYyRkExMUUxQjFDQTg4MkY0ODI0MDE5QiIgYWNxdWlzaXRpb25UaW1lPSIyMDEyLTA5LTE4VDEwOjE0OjI2WiI+PFVUQ1BvaW50IHV0Y1BvaW50PSIyMDEyLTA5LTE4VDEwOjE0OjM0WiIvPjxTQ1RFMzVQb2ludERlc2NyaXB0b3Igc3BsaWNlQ29tbWFuZFR5cGU9IjUiPjxTcGxpY2VJbnNlcnQgc3BsaWNlRXZlbnRJRD0iMzQ0NTY4NjkxIiBvdXRPZk5ldHdvcmtJbmRpY2F0b3I9InRydWUiIHVuaXF1ZVByb2dyYW1JRD0iNTUzNTUiIGR1cmF0aW9uPSJQVDFNMFMiIGF2YWlsTnVtPSIxIiBhdmFpbHNFeHBlY3RlZD0iMTAiLz48L1NDVEUzNVBvaW50RGVzY3JpcHRvcj48U3RyZWFtVGltZXM+PFN0cmVhbVRpbWUgdGltZVR5cGU9IkhTUyIgdGltZVZhbHVlPSI1MTUwMDAwMDAwMDAiLz48L1N0cmVhbVRpbWVzPjwvQWNxdWlyZWRTaWduYWw+</f>
    </c>
    <c t=”1200000000” d=”400000000”>      <f>PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48QWNxdWlyZWRTaWduYWwgeG1sbnM9InVybjpjYWJsZWxhYnM6bWQ6eHNkOnNpZ25hbGluZzozLjAiIGFjcXVpc2l0aW9uUG9pbnRJZGVudGl0eT0iRVNQTl9FYXN0X0FjcXVpc2l0aW9uX1BvaW50XzEiIGFjcXVpc2l0aW9uU2lnbmFsSUQ9IjRBNkE5NEVFLTYyRkExMUUxQjFDQTg4MkY0ODI0MDE5QiIgYWNxdWlzaXRpb25UaW1lPSIyMDEyLTA5LTE4VDEwOjE0OjI2WiI+PFVUQ1BvaW50IHV0Y1BvaW50PSIyMDEyLTA5LTE4VDEwOjE0OjM0WiIvPjxTQ1RFMzVQb2ludERlc2NyaXB0b3Igc3BsaWNlQ29tbWFuZFR5cGU9IjUiPjxTcGxpY2VJbnNlcnQgc3BsaWNlRXZlbnRJRD0iMzQ0NTY4NjkxIiBvdXRPZk5ldHdvcmtJbmRpY2F0b3I9InRydWUiIHVuaXF1ZVByb2dyYW1JRD0iNTUzNTUiIGR1cmF0aW9uPSJQVDFNMFMiIGF2YWlsTnVtPSIxIiBhdmFpbHNFeHBlY3RlZD0iMTAiLz48L1NDVEUzNVBvaW50RGVzY3JpcHRvcj48U3RyZWFtVGltZXM+PFN0cmVhbVRpbWUgdGltZVR5cGU9IkhTUyIgdGltZVZhbHVlPSI1MTYyMDAwMDAwMDAiLz48L1N0cmVhbVRpbWVzPjwvQWNxdWlyZWRTaWduYWw+</f>
    </c>
  </StreamIndex>
</SmoothStreamingMedia> 
~~~ 

## 3.2	Apple HLS Delivery
Timed metadata for Apple HTTP Live Streaming (HLS) may be embedded in the segment playlist within a custom M3U tag.  The application layer can parse the M3U playlist and process M3U tags. 
Azure Media Services will embed timed metadata in the EXT-X-CUE tag defined in [HLS].  The EXT-X-CUE tag is currently used by DynaMux for messages of type ADI3.  To support SCTE-35 and non SCTE-35 messages, set the attributes of the EXT-X-CUE tag as defined below:

| **Attribute Name** | **Type**                      | **Required?**                             | **Description**                                                                                                                                                                                                                                                                      |
|--------------------|-------------------------------|-------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| CUE                | quoted string                 | Required                                  | The message encoded as a base64 string as described in [IETF RFC 4648](http://tools.ietf.org/html/rfc4648). For [SCTE-35] messages, this is the base64 encoded splice_info_section().                                                                                                |
| TYPE               | quoted string                 | Required                                  | A URN or URL identifying the message scheme; for example, “urn:example:signaling:1.0”. For [SCTE-35] messages, the type takes the special value “scte35”.                                                                                                                                |
| ID                 | quoted string                 | Required                                  | A unique identifier for the event. If the ID is not specified when the message is ingested, Azure Media Services will generate a unique id.                                                                                                                                          |
| DURATION           | decimal floating point number | Required                                  | The duration of the event. If unknown, the value should be 0. Units are factional seconds.                                                                                                                                                                                           |
| ELAPSED            | decimal floating point number | Optional, but Required for sliding window | When the signal is being repeated to support a sliding presentation window, this field MUST be the amount of presentation time that has elapsed since the event began. Units are fractional seconds. This value may exceed the original specified duration of the splice or segment. |
| TIME               | decimal floating point number | Required                                  | The presentation time of the event. Units are fractional seconds.                                                                                                                                                                                                                    |


The HLS player application layer will use the TYPE to identify the format of the message, decode the message, apply the necessary time conversions, and process the event.  The events are time synchronized in the segment playlist of the parent track, according to the event timestamp.  They are inserted before the nearest segment (#EXTINF tag).

#### HLS Segment Playlist Example
~~~
#EXTM3U
#EXT-X-VERSION:4
#EXT-X-ALLOW-CACHE:NO
#EXT-X-MEDIA-SEQUENCE:0
#EXT-X-TARGETDURATION:6
#EXT-X-PROGRAM-DATE-TIME:1970-01-01T00:00:00.000+00:00
#EXTINF:6.000000,no-desc
Fragments(video=0,format=m3u8-aapl)
#EXTINF:6.000000,no-desc
Fragments(video=60000000,format=m3u8-aapl)
#EXTINF:6.000000,no-desc
#EXT-X-CUE: ID=”metadata-12.000000”,TYPE=”urn:example:signaling:1.0”,TIME=”12.000000”, DURATION=”18.000000”,CUE=”HrwOi8vYmWVkaWEvhhaWFRlRDa=”
Fragments(video=120000000,format=m3u8-aapl)
#EXTINF:6.000000,no-desc
Fragments(video=180000000,format=m3u8-aapl)
#EXTINF:6.000000,no-desc
Fragments(video=240000000,format=m3u8-aapl)
#EXTINF:6.000000,no-desc
Fragments(video=300000000,format=m3u8-aapl)
#EXTINF:6.000000,no-desc
Fragments(video=360000000,format=m3u8-aapl)
#EXT-X-CUE: ID=”metadata-42.000000”,TYPE=”urn:example:signaling:1.0”,TIME=”42.000000”, DURATION=”60.000000”,CUE=”PD94bWwgdm0iMS4wIiBlbmNvpD4=”
#EXTINF:6.000000,no-desc
Fragments(video=420000000,format=m3u8-aapl)
#EXTINF:6.000000,no-desc
Fragments(video=480000000,format=m3u8-aapl)
…
~~~

#### HLS Message Handling

Events are signaled in the segment playlist of each video and audio track. The
position of the EXT-X-CUE tag MUST always be either immediately before the first
HLS segment (for splice out or segment start) or immediately after the last HLS
segment (for splice in or segment end) to which its TIME and DURATION
attributes refer, as required by [HLS].

When a sliding presentation window is enabled, the EXT-X-CUE tag MUST be
repeated often enough that the splice or segment is always fully described in
the segment playlist, and the ELAPSED attribute MUST be used to indicate the
amount of time the splice or segment has been active, as required by [HLS].

When a sliding presentation window is enabled, the EXT-X-CUE tags are removed
from the segment playlist when the media time that they refer to has rolled out
of the sliding presentation window.

## 3.3	DASH Delivery
[DASH] provides three ways to signal events:

1.  Events signaled in the MPD
2.  Events signaled in-band in the Representation (using Event Message Box
    (‘emsg’)
3.  A combination of both 1 and 2

Events signaled in the MPD are useful for VOD streaming because clients have
access to all the events, immediately when the MPD is downloaded. The in-band
solution is useful for live streaming because clients do not need to download the MPD again. For time-based segmentation, the client determines the URL for the next segment by adding the duration and timestamp of the current segment. If that request fails, the client assumes a discontinuity and downloads the MPD, but otherwise continues streaming without downloading the MPD.

Azure Media Services will do both signaling in the MPD and in-band signaling
using the Event Message Box.

#### MPD Signaling

Events will be signaled in the MPD using the EventStream element, which appears
within the Period element.

The EventStream element has the following attributes:

| **Attribute Name** | **Type**                | **Required?** | **Description**                                                                                                                                                                                                                                                                                   |
|--------------------|-------------------------|---------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| scheme_id_uri      | string                  | Required      | Identifies the scheme of the message. The scheme is set to the value of the Scheme attribute in the Live Server Manifest box. The value SHOULD be a URN or URL identifying the message scheme; for example, “urn:example:signaling:1.0”.                                                                |
| value              | string                  | Optional      | An additional string value used by the owners of the scheme to customize the semantics of the message. In order to differentiate multiple event streams with the same scheme, the value MUST be set to the name of the event stream (trackName for Smooth ingest or AMF message name for RTMP ingest). |
| Timescale          | 32-bit unsigned integer | Required      | The timescale, in ticks per second, of the times and duration fields within the ‘emsg’ box.                                                                                                                                                                                                       |


Zero or more Event elements are contained within the EventStream element, and they have the following attributes:

| **Attribute Name**  | **Type**                | **Required?** | **Description**                                                                                                                                                                                                             |
|---------------------|-------------------------|---------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| presentation_time   | 64-bit unsigned integer | Optional      | MUST be the media presentation time of the event relative to the start of the Period. The presentation time and duration SHOULD align with Stream Access Points (SAP) of type 1 or 2, as defined in [ISO-14496-12] Annex I. |
| duration            | 32-bit unsigned integer | Optional      | The duration of the event. This MUST be omitted if the duration is unknown.                                                                                                                                                 |
| id                  | 32-bit unsigned integer | Optional      | Identifies this instance of the message. Messages with equivalent semantics shall have the same value. If the ID is not specified when the message is ingested, Azure Media Services will generate a unique id.             |
| Event element value | string                  | Required      | The event message as a base64 string as described in [IETF RFC 4648](http://tools.ietf.org/html/rfc4648).                                                                                                                   |

#### XML Syntax and Example for DASH manifest (MPD) Signaling

~~~ xml
<!-- XML Syntax -->
<xs:complexType name=”EventStreamType”>
  <xs:sequence>
    <xs:element name=”Event” type=”EventType” minOccurs=”0” maxOccurs=”unbounded”/>
    <xs:any namespace=”##other” processContents=”lax” minOccurs=”0” maxOccurs=”unbounded”/>
  </xs:sequence>
  <xs:attribute ref=”xlink:href”/>
  <xs:attribute ref=”xlink:actuate” default=”onRequest”/>
  <xs:attribute name=”schemeIdUri” type=”xs:anyURI” use=”required”/>
  <xs:attribute name=”value” type=”xs:string”/>
  <xs:attribute name=”timescale” type=”xs:unsignedInt”/>
</xs:complexType>
<!-- Event -->
<xs:complexType name=”EventType”>
  <xs:sequence>
    <xs:any namespace=”##other” processContents=”lax” minOccurs=”0” maxOccurs=”unbounded”/>
  </xs:sequence>
  <xs:attribute name=”presentationTime” type=”xs:unsignedLong” default=”0”/>
  <xs:attribute name=”duration” type=”xs:unsignedLong”/>
  <xs:attribute name=”id” type=”xs:unsignedInt”/>
  <xs:anyAttribute namespace=”##other” processContents=”lax”/>
</xs:complexType><?xml version=”1.0” encoding=”utf-8”?>


<!-- Example Section in MPD -->

<EventStream schemeIdUri=”urn:example:signaling:1.0” timescale=”1000” value=”player-statistics”>
  <Event presentationTime=”0” duration=”10000” id=”0”> PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48QWNxdWlyZWRTaWduYWwgeG1sbnM9InVybjpjYWJsZWxhYnM6bWQ6eHNkOnNpZ25hbGluZzozLjAiIGFjcXVpc2l0aW9uUG9pbnRJZGVudGl0eT0iRVNQTl9FYXN0X0FjcXVpc2l0aW9uX1BvaW50XzEiIGFjcXVpc2l0aW9uU2lnbmFsSUQ9IjRBNkE5NEVFLTYyRkExMUUxQjFDQTg4MkY0ODI0MDE5QiIgYWNxdWlzaXRpb25UaW1lPSIyMDEyLTA5LTE4VDEwOjE0OjI2WiI+PFVUQ1BvaW50IHV0Y1BvaW50PSIyMDEyLTA5LTE4VDEwOjE0OjM0WiIvPjxTQ1RFMzVQb2ludERlc2NyaXB0b3Igc3BsaWNlQ29tbWFuZFR5cGU9IjUiPjxTcGxpY2VJbnNlcnQgc3BsaWNlRXZlbnRJRD0iMzQ0NTY4NjkxIiBvdXRPZk5ldHdvcmtJbmRpY2F0b3I9InRydWUiIHVuaXF1ZVByb2dyYW1JRD0iNTUzNTUiIGR1cmF0aW9uPSJQVDFNMFMiIGF2YWlsTnVtPSIxIiBhdmFpbHNFeHBlY3RlZD0iMTAiLz48L1NDVEUzNVBvaW50RGVzY3JpcHRvcj48U3RyZWFtVGltZXM+PFN0cmVhbVRpbWUgdGltZVR5cGU9IkhTUyIgdGltZVZhbHVlPSI1MTUwMDAwMDAwMDAiLz48L1N0cmVhbVRpbWVzPjwvQWNxdWlyZWRTaWduYWw+</Event>
  <Event presentationTime=”20000” duration=”10000” id=”1”> PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48QWNxdWlyZWRTaWduYWwgeG1sbnM9InVybjpjYWJsZWxhYnM6bWQ6eHNkOnNpZ25hbGluZzozLjAiIGFjcXVpc2l0aW9uUG9pbnRJZGVudGl0eT0iRVNQTl9FYXN0X0FjcXVpc2l0aW9uX1BvaW50XzEiIGFjcXVpc2l0aW9uU2lnbmFsSUQ9IjRBNkE5NEVFLTYyRkExMUUxQjFDQTg4MkY0ODI0MDE5QiIgYWNxdWlzaXRpb25UaW1lPSIyMDEyLTA5LTE4VDEwOjE0OjI2WiI+PFVUQ1BvaW50IHV0Y1BvaW50PSIyMDEyLTA5LTE4VDEwOjE0OjM0WiIvPjxTQ1RFMzVQb2ludERlc2NyaXB0b3Igc3BsaWNlQ29tbWFuZFR5cGU9IjUiPjxTcGxpY2VJbnNlcnQgc3BsaWNlRXZlbnRJRD0iMzQ0NTY4NjkxIiBvdXRPZk5ldHdvcmtJbmRpY2F0b3I9InRydWUiIHVuaXF1ZVByb2dyYW1JRD0iNTUzNTUiIGR1cmF0aW9uPSJQVDFNMFMiIGF2YWlsTnVtPSIxIiBhdmFpbHNFeHBlY3RlZD0iMTAiLz48L1NDVEUzNVBvaW50RGVzY3JpcHRvcj48U3RyZWFtVGltZXM+PFN0cmVhbVRpbWUgdGltZVR5cGU9IkhTUyIgdGltZVZhbHVlPSI1MTYyMDAwMDAwMDAiLz48L1N0cmVhbVRpbWVzPjwvQWNxdWlyZWRTaWduYWw+</Event>
</EventStream>
~~~

>[!NOTE]
>Note that presentationTime is the presentation time of the event, not the arrival time of the message.
>

### 4.3.1 In-band Event Message Box Signaling
An in-band event stream requires the MPD to have an InbandEventStream element at the Adaptation Set level.  This element has a mandatory schemeIdUri attribute and optional timescale attribute, which also appear in the Event Message Box (‘emsg’).  Event message boxes with scheme identifiers that are not defined in the MPD should not be present. If a DASH client detects an event message box with a scheme that is not defined in the MPD, the client is expected to ignore it.
The Event Message box (‘emsg’) provides signaling for generic events related to the media presentation time. If present, any ‘emsg’ box shall be placed before any ‘moof’ box.

### DASH Event Message Box ‘emsg’
~~~
Box Type: `emsg’
Container: Segment
Mandatory: No
Quantity: Zero or more
~~~

~~~ c
aligned(8) class DASHEventMessageBox extends FullBox(‘emsg’, version = 0, flags =0) 
{
    string scheme_id_uri;
    string value;
    unsigned int(32) timescale;
    unsigned int(32) presentation_time_delta;
    unsigned int(32) event_duration;
    unsigned int(32) id;
    unsigned int(8) message_data[];
}
~~~

The fields of the DASHEventMessageBox are defined below:

| **Field Name**          | **Field Type**          | **Required?** | **Description**                                                                                                                                                                                                                                                                                                                                                    |
|-------------------------|-------------------------|---------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| scheme_id_uri           | string                  | Required      | Identifies the scheme of the message. The scheme is set to the value of the Scheme attribute in the Live Server Manifest box. The value SHOULD be a URN or URL identifying the message scheme; for example, “urn:example:signaling:1.0”. For [SCTE-35] messages, this takes the special value “urn:scte:scte35:2013a:bin”, although [SCTE-67] recommends something else. |
| Value                   | string                  | Required      | An additional string value used by the owners of the scheme to customize the semantics of the message. In order to differentiate multiple event streams with the same scheme, the value will be set to the name of the event stream (trackName for Smooth ingest or AMF message name for RTMP ingest).                                                                  |
| Timescale               | 32-bit unsigned integer | Required      | The timescale, in ticks per second, of the times and duration fields within the ‘emsg’ box.                                                                                                                                                                                                                                                                        |
| Presentation_time_delta | 32-bit unsigned integer | Required      | The media presentation time delta of the presentation time of the event and the earliest presentation time in this segment. The presentation time and duration SHOULD align with Stream Access Points (SAP) of type 1 or 2, as defined in [ISO-14496-12] Annex I.                                                                                            |
| event_duration          | 32-bit unsigned integer | Required      | The duration of the event, or 0xFFFFFFFF to indicate an unknown duration.                                                                                                                                                                                                                                                                                          |
| Id                      | 32-bit unsigned integer | Required      | Identifies this instance of the message. Messages with equivalent semantics shall have the same value. If the ID is not specified when the message is ingested, Azure Media Services will generate a unique id.                                                                                                                                                    |
| Message_data            | byte array              | Required      | The event message. For [SCTE-35] messages, the message data is the binary splice_info_section(), although [SCTE-67] recommends something else.                                                                                                                                                                                                                                 |

### 3.3.2 DASH Message Handling

Events are signaled in-band, within the ‘emsg’ box, for both video and audio tracks.  The signaling occurs for all segment requests for which the presentation_time_delta is 15 seconds or less. 
When a sliding presentation window is enabled, event messages are removed from the MPD when the sum of the time and duration of the event message is less than the time of the media data in the manifest.  In other words, the event messages are removed from the manifest when the media time to which they refer has rolled out of the sliding presentation window.

## 4 SCTE-35 Ingest

[SCTE-35] messages are ingested in binary format using the Scheme
**“urn:scte:scte35:2013a:bin”** for Smooth ingest and the type **“scte35”** for
RTMP ingest. To facilitate the conversion of [SCTE-35] timing, which is based on
MPEG-2 transport stream presentation time stamps (PTS), a mapping between PTS
(pts_time + pts_adjustment of the splice_time()) and the media timeline is
provided by the event presentation time (the fragment_absolute_time field for
Smooth ingest and the time field for RTMP ingest). The mapping is necessary because the
33-bit PTS value rolls over approximately every 26.5 hours.

Smooth Streaming ingest requires that the Media Data Box (‘mdat’) MUST contain the
**splice_info_section()** defined in Table 8-1 of [SCTE-35]. For RTMP ingest,
the cue attribute of the AMF message is set to the base64encoded
**splice_info_section()**. When the messages have the format described above,
they are sent to HLS, Smooth, and Dash clients in compliance with [SCTE-67].


## 5 References

**[SCTE-35]** ANSI/SCTE 35 2013a – Digital Program Insertion Cueing Message for
Cable, 2013a

**[SCTE-67]** ANSI/SCTE 67 2014 –Recommended Practice for SCTE 35: Digital Program
Insertion Cueing Message for Cable

**[DASH]** ISO/IEC 23009-1 2014 – Information technology – Dynamic adaptive
streaming over HTTP (DASH) – Part 1: Media Presentation description and segment
formats, 2nd edition

**[HLS]** [“HTTP Live Streaming”, draft-pantos-http-live-streaming-14, October 14,
2014,](http://tools.ietf.org/html/draft-pantos-http-live-streaming-14)

**[MS-SSTR]** [“Microsoft Smooth Streaming Protocol”, May 15, 2014](http://download.microsoft.com/download/9/5/E/95EF66AF-9026-4BB0-A41D-A4F81802D92C/%5bMS-SSTR%5d.pdf)

**[AMF0]** ["Action Message Format AMF0"](http://download.macromedia.com/pub/labs/amf/amf0_spec_121207.pdf)

**[LIVE-FMP4]** [Azure Media Services Fragmented MP4 Live Ingest
Specification](https://docs.microsoft.com/azure/media-services/media-services-fmp4-live-ingest-overview)

**[ISO-14496-12]** ISO/IEC 14496-12: Part 12 ISO base media file format, Fourth
Edition 2012-07-15.

**[RTMP]** [“Adobe’s Real-Time Messaging Protocol”, December 21, 2012](https://www.adobe.com/devnet/rtmp.html) 

------------------------------------------

## Next steps
View Media Services learning paths.

[!INCLUDE [media-services-learning-paths-include](../../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../../includes/media-services-user-voice-include.md)]
