---
title: Azure Media Services - Signaling Timed Metadata in Live Streaming
description: This specification outlines methods  for signaling timed metadata when ingesting and streaming to Azure Media Services. This includes support for generic timed metadata signals (ID3), as well as SCTE-35 signaling for ad insertion and splice condition signaling. 
services: media-services
documentationcenter: ''
author: johndeu
manager: femila
editor: johndeu

ms.assetid: 265b94b1-0fb8-493a-90ec-a4244f51ce85
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/22/2019
ms.author: johndeu

---
# Signaling Timed Metadata in Live Streaming 

Last Updated: 2019-08-22

### Conformance Notation

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in RFC 2119

## 1. Introduction 

In order to signal the insertion of advertisements or custom metadata events on a client player, broadcasters often make use of timed metadata embedded within the video. To enable these scenarios, Media Services provides support for the transport of timed metadata from the ingest point of the live streaming channel to the client application.
This specification outlines several modes that are supported by Media Services for timed metadata within live streaming signals.

1. [SCTE-35] signaling that complies with the standards outlined by [SCTE-35], [SCTE-214-1], [SCTE-214-3] and [RFC8216]

2. [SCTE-35] signaling that complies with the legacy [Adobe-Primetime] specification for RTMP ad signaling.
   
3. A generic timed metadata signaling mode, for messages that are **NOT** [SCTE-35] and could carry [ID3v2] or other custom schemas defined by the application developer.

## 1.1 Terms Used

| Term                | Definition                                                                                                                                                                                                                                    |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ad Break            | A location or point in time where one or more ads may be scheduled for delivery; same as avail and placement opportunity.                                                                                                                     |
| Ad Decision Service | external service that decides which ad(s) and durations will be shown to the user. The services is typically provided by a partner and are out of scope for this document.                                                                    |
| Cue                 | Indication of time and parameters of the upcoming ad break. Note that cues can indicate a pending switch to an ad break, pending switch to the next ad within an ad break, and pending switch from an ad break to the main content.           |
| Packager            | The Azure Media Services "Streaming Endpoint" provides dynamic packaging capabilities for DASH and HLS and is referred to as a "Packager" in the media industry.                                                                              |
| Presentation Time   | The time that an event is presented to a viewer. The  time represents the moment on the media timeline that a viewer would see the event. For example, the presentation time of a SCTE-35 splice_info() command message is the splice_time(). |
| Arrival Time        | The time that an event message arrives. The time is typically distinct from the presentation time of the event, since event messages are sent ahead of the presentation time of the event.                                                    |
| Sparse track        | media track that is not continuous, and is time synchronized with a parent or control track.                                                                                                                                                  |
| Origin              | The Azure Media Streaming Service                                                                                                                                                                                                             |
| Channel Sink        | The Azure Media Live Streaming Service                                                                                                                                                                                                        |
| HLS                 | Apple HTTP Live Streaming protocol                                                                                                                                                                                                            |
| DASH                | Dynamic Adaptive Streaming Over HTTP                                                                                                                                                                                                          |
| Smooth              | Smooth Streaming Protocol                                                                                                                                                                                                                     |
| MPEG2-TS            | MPEG 2 Transport Streams                                                                                                                                                                                                                      |
| RTMP                | Real-Time Multimedia Protocol                                                                                                                                                                                                                 |
| uimsbf              | Unsigned integer, most significant bit first.                                                                                                                                                                                                 |

---

## 1.2 Normative References

The following documents contain provisions, which, through reference in this text, constitute provisions of this document. All documents are subject to revision by the standards bodies, and readers are encouraged to investigate the possibility of applying the most recent editions of the documents listed below. Readers are also reminded that newer editions of the referenced documents might not be compatible with this version of the timed metadata specification for Azure Media Services.


| Standard          | Definition                                                                                                                                                                                                     |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Adobe-Primetime] | [Primetime Digital Program Insertion Signaling Specification 1.2](https://www.adobe.com/content/dam/acom/en/devnet/primetime/PrimetimeDigitalProgramInsertionSignalingSpecification.pdf)                       |
| [Adobe-Flash-AS]  | [FLASH ActionScript Language Reference](https://help.adobe.com/archive/en_US/as2/flashlite_2.x_3.x_aslr.pdf)                                                                                                   |
| [AMF0]            | ["Action Message Format AMF0"](https://download.macromedia.com/pub/labs/amf/amf0_spec_121207.pdf)                                                                                                              |
| [DASH-IF-IOP]     | DASH Industry Forum Interop Guidance v 4.2 [https://dashif-documents.azurewebsites.net/DASH-IF-IOP/master/DASH-IF-IOP.html](https://dashif-documents.azurewebsites.net/DASH-IF-IOP/master/DASH-IF-IOP.html)    |
| [HLS-TMD]         | Timed Metadata for HTTP Live Streaming - [https://developer.apple.com/streaming](https://developer.apple.com/streaming)                                                                                        |
| [CMAF-ID3]        | [Timed Metadata in the Common Media Application Format (CMAF)](https://github.com/AOMediaCodec/id3-emsg)                                                                                                        |
| [ID3v2]           | ID3 Tag version 2.4.0  [http://id3.org/id3v2.4.0-structure](http://id3.org/id3v2.4.0-structure)                                                                                                                |
| [ISO-14496-12]    | ISO/IEC 14496-12: Part 12 ISO base media file format, FourthEdition 2012-07-15                                                                                                                                 |
| [MPEGDASH]        | Information technology -- Dynamic adaptive streaming over HTTP (DASH) -- Part 1: Media presentation description and segment formats. May 2014. Published. URL: https://www.iso.org/standard/65274.html         |
| [MPEGCMAF]        | Information technology -- Multimedia application format (MPEG-A) -- Part 19: Common media application format (CMAF) for segmented media. January 2018. Published. URL: https://www.iso.org/standard/71975.html |
| [MPEGCENC]        | Information technology -- MPEG systems technologies -- Part 7: Common encryption in ISO base media file format files. February 2016. Published. URL: https://www.iso.org/standard/68042.html                   |
| [MS-SSTR]         | ["Microsoft Smooth Streaming Protocol", May 15, 2014](https://docs.microsoft.com/openspecs/windows_protocols/ms-sstr/8383f27f-7efe-4c60-832a-387274457251)                                                     |
| [MS-SSTR-Ingest]  | [Azure Media Services Fragmented MP4 Live Ingest Specification](https://docs.microsoft.com/azure/media-services/media-services-fmp4-live-ingest-overview)                                                      |
| [RFC8216]         | R. Pantos, Ed.; W. May. HTTP Live Streaming. August 2017. Informational. [https://tools.ietf.org/html/rfc8216](https://tools.ietf.org/html/rfc8216)                                                            |
| [RFC4648]         | The Base16, Base32, and Base64 Data Encodings - [https://tools.ietf.org/html/rfc4648](https://tools.ietf.org/html/rfc4648)                                                                                     |
| [RTMP]            | ["Adobe's Real-Time Messaging Protocol", December 21, 2012](https://www.adobe.com/devnet/rtmp.html)                                                                                                            |
| [SCTE-35-2019]    | SCTE 35: 2019 - Digital Program Insertion Cueing Message for Cable - https://www.scte.org/SCTEDocs/Standards/ANSI_SCTE%2035%202019r1.pdf                                                                       |
| [SCTE-214-1]      | SCTE 214-1 2016 – MPEG DASH for IP-Based Cable Services Part 1: MPD Constraints and Extensions                                                                                                                 |
| [SCTE-214-3]      | SCTE 214-3 2015 MPEG DASH for IP-Based Cable Services Part 3: DASH/FF Profile                                                                                                                                  |
| [SCTE-224]        | SCTE 224 2018r1 – Event Scheduling and Notification Interface                                                                                                                                                  |
| [SCTE-250]        | Event and Signaling Management API (ESAM)                                                                                                                                                                      |

---


## 2. Timed Metadata Ingest

Azure Media Services supports real-time in-band metadata for both [RTMP] and Smooth Streaming [MS-SSTR-Ingest] protocols. Real-time metadata can be used to define custom events, with your own unique custom schemas (JSON, Binary, XML), as well as industry defined formats like ID3, or SCTE-35 for ad signaling in a broadcast stream. 

This article provides the details for how to send custom timed metadata signals using the supported ingest protocols of Azure Media Services. The article also explains how the manifests for HLS, DASH, and Smooth Streaming are decorated with the timed metadata signals, as well as how it is carried in-band when the content is delivered using CMAF (MP4 fragments) or Transport Stream (TS) segments for HLS. 

Common use case scenarios for timed metadata include:

 - SCTE-35 ad signals to trigger ad breaks in a live event or linear broadcast
 - Custom ID3 metadata that can trigger events at a client application (browser, iOS, or Android)
 - Custom defined JSON, Binary, or XML metadata to trigger events at a client application
 - Telemetry from a live encoder, IP Camera or Drone
 - Events from an IP Camera like Motion, face detection, etc.
 - Geographic position information from an action camera, drone, or moving device
 - Song lyrics
 - Program boundaries on a linear live feed
 - Images or augmented metadata to be displayed on a live feed
 - Sports scores or game-clock information
 - Interactive advertising packages to be displayed alongside the video in the browser
 - Quizzes or polls
  
Azure Media Services Live Events and Packager are capable of receiving these timed metadata signals and converting them into a stream of metadata that can reach client applications using standards-based protocols like HLS and DASH.


## 2.1 RTMP Timed Metadata

The [RTMP] protocol allows for timed metadata signals to be sent for various scenarios including custom metadata, and SCTE-35 ad signals. 

Advertising signals (cue messages) are sent as [AMF0] cue messages embedded within the [RTMP] stream. The cue messages may be sent sometime before the actual event or [SCTE35] ad splice signal needs to occur. To support this scenario, the actual presentation timestamp of the event is sent within the cue message. For more information, see [AMF0].

The following [AMF0] commands are supported by Azure Media Services for RTMP ingest:

- **onUserDataEvent** - used for custom metadata or [ID3v2] timed metadata
- **onAdCue** - used primarily for signaling an advertisement placement opportunity in the live stream. Two forms of the cue are supported, a simple mode and a "SCTE-35" mode. 
- **onCuePoint** - supported by certain on-premises hardware encoders, like the Elemental Live encoder, to signal [SCTE35] messages. 
  

The following table describes the format of the AMF message payload that Media Services will ingest for both "simple" and [SCTE35] message modes.

The name of the [AMF0] message can be used to differentiate multiple event streams of the same type.  For both [SCTE-35] messages and "simple" mode, the name of the AMF message MUST be "onAdCue" as required in the [Adobe-Primetime] specification.  Any fields not listed below SHALL be ignored by Azure Media Services at ingest.

## 2.1.1 RTMP with custom metadata using "onUserDataEvent"

If you want to provide custom metadata feeds from your upstream encoder, IP Camera, Drone, or device using the RTMP protocol, use the "onUserDataEvent" [AMF0] data message command type.

The **"onUserDataEvent"** data message command MUST carry a message payload with the following definition to be captured by Media Services and packaged into the in-band file format as well as the manifests for HLS, DASH and Smooth Streaming.
It is recommended to send timed-metadata messages no more frequently than once every 0.5 seconds (500ms) or stability issues with the live stream may occur. Each message could aggregate metadata from multiple frames if you need to provide frame-level metadata. 
If you are sending multi-bitrate streams, it is recommended that you also provide the metadata on a single bitrate only to reduce the bandwidth and avoid interference with video/audio processing. 

The payload for the **"onUserDataEvent"** should be an [MPEGDASH] EventStream XML format message. This makes it easy to pass in custom defined schemas that can be carried in 'emsg' payloads in-band for CMAF [MPEGCMAF] content that is delivered over HLS or DASH protocols. 
Each DASH Event Stream message contains a schemeIdUri that functions as a URN message scheme identifier and defines the payload of the message. Some schemes such as "https://aomedia.org/emsg/ID3" for [ID3v2], or **urn:scte:scte35:2013:bin** for [SCTE-35] are standardized by industry consortia for interoperability. Any application provider can define their own custom scheme using a URL that they control (owned domain) and may provide a specification at that URL if they choose. If a player has a handler for the defined scheme, then that is the only component that needs to understand the payload and protocol.

The schema for the [MPEG-DASH] EventStream XML payload is defined as (excerpt from DASH ISO-IEC-23009-1-3rd Edition). 
Note that only one "EventType" per "EventStream" is supported at this time. Only the first **Event** element will be processed if multiple events are provided in the **EventStream**.

```xml
  <!-- Event Stream -->
  <xs:complexType name="EventStreamType">
    <xs:sequence>
      <xs:element name="Event" type="EventType" minOccurs="0" maxOccurs="unbounded"/>
      <xs:any namespace="##other" processContents="lax" minOccurs="0" maxOccurs="unbounded"/>
    </xs:sequence>
    <xs:attribute ref="xlink:href"/>
    <xs:attribute ref="xlink:actuate" default="onRequest"/>
    <xs:attribute name="schemeIdUri" type="xs:anyURI" use="required"/>
    <xs:attribute name="value" type="xs:string"/>
    <xs:attribute name="timescale" type="xs:unsignedInt"/>
  </xs:complexType>
  <!-- Event  -->
  <xs:complexType name="EventType">
    <xs:sequence>
      <xs:any namespace="##other" processContents="lax" minOccurs="0" maxOccurs="unbounded"/>
    </xs:sequence>
    <xs:attribute name="presentationTime" type="xs:unsignedLong" default="0"/>
    <xs:attribute name="duration" type="xs:unsignedLong"/>
    <xs:attribute name="id" type="xs:unsignedInt"/>
    <xs:attribute name="contentEncoding" type="ContentEncodingType"/>
    <xs:attribute name="messageData" type="xs:string"/>
    <xs:anyAttribute namespace="##other" processContents="lax"/>
  </xs:complexType>
```


### Example XML Event Stream with ID3 schema ID and base64-encoded data payload.  
```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <EventStream schemeIdUri="https://aomedia.org/emsg/ID3">
         <Event contentEncoding="Base64">
          -- base64 encoded ID3v2 full payload here per [CMAF-TMD] --
         </Event>
   <EventStream>
```

### Example Event Stream with custom schema ID and base64-encoded binary data  
```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <EventStream schemeIdUri="urn:example.org:custom:binary">
         <Event contentEncoding="Base64">
          -- base64 encoded custom binary data message --
         </Event>
   <EventStream>
```

### Example Event Stream with custom schema ID and custom JSON  
```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <EventStream schemeIdUri="urn:example.org:custom:JSON">
         <Event>
          [
            {"key1" : "value1"},
            {"key2" : "value2"}
          ]
         </Event>
   <EventStream>
```

### Built-in supported Scheme ID URIs
| Scheme ID URI                 | Description                                                                                                                                                                                                                                          |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| https:\//aomedia.org/emsg/ID3 | Describes how [ID3v2] metadata can be carried as timed metadata in a CMAF-compatible [MPEGCMAF] fragmented MP4. For more information see the [Timed Metadata in the Common Media Application Format (CMAF)](https://github.com/AOMediaCodec/id3-emsg) |

### Event processing and manifest signaling

On receipt of a valid **"onUserDataEvent"** event, Azure Media Services will look for a valid XML payload that matches the EventStreamType (defined in [MPEGDASH] ), parse the XML payload and convert it into an [MPEGCMAF] MP4 fragment 'emsg' version 1 box for storage in the live archive and transmission to the Media Services Packager.   The Packager will detect the 'emsg' box in the live stream and:

- (a)    "dynamically package" it into TS segments for delivery to HLS clients in compliance with the HLS timed metadata specification [HLS-TMD], or
- (b)    pass it through for delivery in CMAF fragments via HLS or DASH, or 
- (c)    convert it into a sparse track signal for delivery via Smooth Streaming [MS-SSTR].

In addition to the in-band 'emsg' format CMAF or TS PES packets for HLS, the manifests for DASH (MPD), and Smooth Streaming will contain a reference to the in-band event streams (also known as sparse stream track in Smooth Streaming). 

Individual events or their data payloads are NOT output directly in the HLS, DASH, or Smooth manifests. 

### Additional informational constraints and defaults for onUserDataEvent events

- If the timescale is not set in the EventStream element, the RTMP 1 kHz timescale is used by default
- Delivery of an onUserDataEvent message is limited to once every 500ms max. If you send events more frequently, it can impact the bandwidth and the stability of the live feed

## 2.1.2 RTMP ad cue signaling with "onAdCue"

Azure Media Services can listen and respond to several [AMF0] message types which can be used to signal various real time synchronized metadata in the live stream.  The [Adobe-Primetime] specification defines two cue types called "simple" and "SCTE-35" mode. For "simple" mode, Media Services supports a single AMF cue message called "onAdCue" using a payload that matches the table below defined for the  "Simple Mode" signal.  

The following section shows RTMP "simple" mode" payload, which can be used to signal a basic "spliceOut" ad signal that will be carried through to the client manifest for HLS, DASH, and Microsoft Smooth Streaming. This is very useful for scenarios where the customer does not have a complex SCTE-35 based ad signaling deployment or insertion system, and is using a basic on-premises encoder to send in the cue message via an API. Typically the on-premises encoder will support a REST-based API to trigger this signal, which will also "splice-condition" the video stream by inserting an IDR frame into the video, and starting a new GOP.

## 2.1.3  RTMP ad cue signaling with "onAdCue" - Simple Mode

| Field Name | Field Type | Required? | Descriptions                                                                                                                                                                                                                                                                        |
| ---------- | ---------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type       | String     | Required  | The event message.  Shall be "SpliceOut" to designate a simple mode splice.                                                                                                                                                                                                         |
| id         | String     | Required  | A unique identifier describing the splice or segment. Identifies this instance of the message                                                                                                                                                                                       |
| duration   | Number     | Required  | The duration of the splice. Units are fractional seconds.                                                                                                                                                                                                                           |
| elapsed    | Number     | Optional  | When the signal is being repeated in order to support tune in, this field shall be the amount of presentation time that has elapsed since the splice began. Units are fractional seconds. When using simple mode, this value should not exceed the original duration of the splice. |
| time       | Number     | Required  | Shall be the time of the splice, in presentation time. Units are fractional seconds.                                                                                                                                                                                                |

---
 
#### Example MPEG DASH manifest output when using Adobe RTMP simple mode

See example [3.3.2.1 MPEG DASH .mpd EventStream using Adobe simple mode](#3321-example-mpeg-dash-mpd-manifest-signaling-of-rtmp-streaming-using-adobe-simple-mode)

See example [3.3.3.1 DASH manifest with single period and Adobe simple mode ](#3331-example-mpeg-dash-manifest-mpd-with-single-period-eventstream-using-adobe-simple-mode-signals)

#### Example HLS manifest output when using Adobe RTMP simple mode

See example [3.2.2 HLS manifest using Adobe simple mode and EXT-X-CUE tag](#322-apple-hls-with-adobe-primetime-ext-x-cue-legacy)

## 2.1.4 RTMP ad cue signaling with "onAdCue" - SCTE-35 Mode

When you are working with a more advanced broadcast production workflow that requires the full SCTE-35 payload message to be carried through to the HLS or DASH manifest, it is best to use the "SCTE-35 Mode" of the [Adobe-Primetime] specification.  This mode supports in-band SCTE-35 signals being sent directly into an on-premises live encoder, which then encodes the signals out into the RTMP stream using the "SCTE-35 Mode" specified in the [Adobe-Primetime] specification. 

Typically SCTE-35 messages can appear only in MPEG-2 transport stream (TS) inputs on an on-premises encoder. Check with your encoder manufacturer for details on how to configure a transport stream ingest that contains SCTE-35 and enable it for pass-through to RTMP in Adobe SCTE-35 mode.

In this scenario, the following payload MUST be sent from the on-premises encoder using the **"onAdCue"** [AMF0] message type.

| Field Name | Field Type | Required? | Descriptions                                                                                                                                                                                                                                                                                                                                                                                                        |
| ---------- | ---------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| cue        | String     | Required  | The event message.  For [SCTE-35] messages, this MUST be the base64-encoded [RFC4648] binary splice_info_section() in order for messages to be sent to HLS, Smooth, and Dash clients.                                                                                                                                                                                                                               |
| type       | String     | Required  | A URN or URL identifying the message scheme. For [SCTE-35] messages, this **SHOULD** be **"scte35"** in order for messages to be sent to HLS, Smooth, and Dash clients, in compliance with [Adobe-Primetime]. Optionally, the URN "urn:scte:scte35:2013:bin" may also be used to signal a [SCTE-35] message.                                                                                                        |
| id         | String     | Required  | A unique identifier describing the splice or segment. Identifies this instance of the message.  Messages with equivalent semantics shall have the same value.                                                                                                                                                                                                                                                       |
| duration   | Number     | Required  | The duration of the event or ad splice-segment, if known. If unknown, the value **SHOULD** be 0.                                                                                                                                                                                                                                                                                                                    |
| elapsed    | Number     | Optional  | When the [SCTE-35] ad signal is being repeated in order to tune in, this field shall be the amount of presentation time that has elapsed since the splice began. Units are fractional seconds. In [SCTE-35] mode, this value may exceed the original specified duration of the splice or segment.                                                                                                                   |
| time       | Number     | Required  | The presentation time of the event or ad splice.  The presentation time and duration **SHOULD** align with Stream Access Points (SAP) of type 1 or 2, as defined in [ISO-14496-12] Annex I. For HLS egress, time and duration **SHOULD** align with segment boundaries. The presentation time and duration of different event messages within the same event stream MUST not overlap. Units are fractional seconds. |

---

#### Example MPEG DASH .mpd manifest with SCTE-35 mode
See [Section 3.3.3.2 example DASH manifest with SCTE-35](#3332-example-mpeg-dash-manifest-mpd-with-multi-period-eventstream-using-adobe-scte35-mode-signaling)

#### Example HLS manifest .m3u8 with SCTE-35 mode signal
See [Section 3.2.1.1 example HLS manifest with SCTE-35](#3211-example-hls-manifest-m3u8-showing-ext-x-daterange-signaling-of-scte-35)

## 2.1.5 RTMP Ad signaling with "onCuePoint" for Elemental Live

The Elemental Live on-premises encoder supports ad markers in the RTMP signal. Azure Media Services currently only supports the "onCuePoint" Ad Marker type for RTMP.  This can be enabled in the Adobe RTMP Group Settings in the Elemental Media Live encoder settings or API by setting the "**ad_markers**" to "onCuePoint".  Please refer to the Elemental Live documentation for details. 
Enabling this feature in the RTMP Group will pass SCTE-35 signals to the Adobe RTMP outputs to be processed by Azure Media Services.

The "onCuePoint" message type is defined in [Adobe-Flash-AS] and has the following payload structure when sent from the Elemental Live RTMP output.


| Property   | Description                                                                                                                                                                                                                     |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name       | The name SHOULD be '**scte35**' by Elemental Live.                                                                                                                                                                              |
| time       | The time in seconds at which the cue point occurred in the video file during timeline                                                                                                                                           |
| type       | The type of cue point SHOULD be set to "**event**".                                                                                                                                                                             |
| parameters | An associative array of name/value pair strings containing the information from the SCTE-35 message, including Id and duration. These values are parsed out by Azure Media Services and included in the manifest decoration tag. |


When this mode of ad marker is used, the HLS manifest output is similar to Adobe "Simple" mode.


#### Example MPEG DASH MPD, single period, Adobe Simple mode signals

~~~ xml
<?xml version="1.0" encoding="utf-8"?>
<MPD xmlns="urn:mpeg:dash:schema:mpd:2011" 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" profiles="urn:mpeg:dash:profile:isoff-live:2011" type="dynamic" publishTime="2020-01-07T18:58:03Z" minimumUpdatePeriod="PT0S" timeShiftBufferDepth="PT58M56S" availabilityStartTime="2020-01-07T17:44:47Z" minBufferTime="PT7S">
    <Period start="PT0S">
        <EventStream schemeIdUri="urn:com:adobe:dpi:simple:2015" value="scte35" timescale="10000000">
            <Event presentationTime="1583497601000000" duration="300000000" id="1085900"/>
            <Event presentationTime="1583500901666666" duration="300000000" id="1415966"/>
            <Event presentationTime="1583504202333333" duration="300000000" id="1746033"/>
            <Event presentationTime="1583507502666666" duration="300000000" id="2076066"/>
            <Event presentationTime="1583510803333333" duration="300000000" id="2406133"/>
            <Event presentationTime="1583514104000000" duration="300000000" id="2736200"/>
            <Event presentationTime="1583517404666666" duration="300000000" id="3066266"/>
            <Event presentationTime="1583520705333333" duration="300000000" id="3396333"/>
            <Event presentationTime="1583524006000000" duration="300000000" id="3726400"/>
            <Event presentationTime="1583527306666666" duration="300000000" id="4056466"/>
            <Event presentationTime="1583530607333333" duration="300000000" id="4386533"/>
        </EventStream>
        <AdaptationSet id="1" group="1" profiles="ccff" bitstreamSwitching="false" segmentAlignment="true" contentType="video" mimeType="video/mp4" codecs="avc1.4D400C" maxWidth="256" maxHeight="144" startWithSAP="1">
            <InbandEventStream schemeIdUri="urn:mpeg:dash:event:2012" value="1"/>
            <InbandEventStream schemeIdUri="urn:com:adobe:dpi:simple:2015" value="scte35"/>
            <SegmentTemplate timescale="10000000" presentationTimeOffset="1583486678426666" media="QualityLevels($Bandwidth$)/Fragments(video=$Time$,format=mpd-time-csf)" initialization="QualityLevels($Bandwidth$)/Fragments(video=i,format=mpd-time-csf)">
                <SegmentTimeline>
                    <S t="1583495318000000" d="64000000" r="34"/>
                    <S d="43000000"/>
                    <S d="21000000"/>
                    <!-- ... Truncated for brevity of sample-->

                </SegmentTimeline>
            </SegmentTemplate>
            <ProducerReferenceTime id="1583495318000000" type="0" wallClockTime="2020-01-07T17:59:10.957Z" presentationTime="1583495318000000"/>
            <Representation id="1_V_video_3750956353252827751" bandwidth="149952" width="256" height="144"/>
        </AdaptationSet>
        <AdaptationSet id="2" group="5" profiles="ccff" bitstreamSwitching="false" segmentAlignment="true" contentType="audio" mimeType="audio/mp4" codecs="mp4a.40.2" lang="en">
            <InbandEventStream schemeIdUri="urn:mpeg:dash:event:2012" value="1"/>
            <InbandEventStream schemeIdUri="urn:com:adobe:dpi:simple:2015" value="scte35"/>
            <Label>ambient</Label>
            <SegmentTemplate timescale="10000000" presentationTimeOffset="1583486678426666" media="QualityLevels($Bandwidth$)/Fragments(ambient=$Time$,format=mpd-time-csf)" initialization="QualityLevels($Bandwidth$)/Fragments(ambient=i,format=mpd-time-csf)">
                <SegmentTimeline>
                    <S t="1583495254426666" d="64000000" r="35"/>
                    <S d="43093334"/>
                    <S d="20906666"/>
                    <!-- ... Truncated for brevity of sample-->

                </SegmentTimeline>
            </SegmentTemplate>
            <ProducerReferenceTime id="1583495254426666" type="0" wallClockTime="2020-01-07T17:59:04.600Z" presentationTime="1583495254426666"/>
            <Representation id="5_A_ambient_9125670592623055209" bandwidth="96000" audioSamplingRate="48000"/>
        </AdaptationSet>
    </Period>
</MPD>
~~~

#### Example HLS playlist, Adobe Simple mode signals using EXT-X-CUE tag (truncated "..." for brevity)

The following example shows the output from the Media Services dynamic packager for an RTMP ingest stream using Adobe "simple" mode signals and the legacy [Adobe-Primetime] EXT-X-CUE tag.  

~~~
#EXTM3U
#EXT-X-VERSION:8
#EXT-X-MEDIA-SEQUENCE:0
#EXT-X-TARGETDURATION:7
#EXT-X-INDEPENDENT-SEGMENTS
#EXT-X-PROGRAM-DATE-TIME:2020-01-07T17:44:47Z
#EXTINF:6.400000,no-desc
Fragments(video=1583486742000000,format=m3u8-aapl-v8)
#EXTINF:6.400000,no-desc
Fragments(video=1583486806000000,format=m3u8-aapl-v8)
...
#EXTINF:6.166667,no-desc
Fragments(video=1583487638000000,format=m3u8-aapl-v8)
#EXT-X-CUE:ID=95766,TYPE="SpliceOut",DURATION=30.000000,TIME=158348769.966667
#EXTINF:0.233333,no-desc
Fragments(video=1583487699666666,format=m3u8-aapl-v8)
#EXT-X-CUE:ID=95766,TYPE="SpliceOut",DURATION=30.000000,TIME=158348769.966667,ELAPSED=0.233333
#EXTINF:6.400000,no-desc
Fragments(video=1583487702000000,format=m3u8-aapl-v8)
#EXT-X-CUE:ID=95766,TYPE="SpliceOut",DURATION=30.000000,TIME=158348769.966667,ELAPSED=6.633333
#EXTINF:6.400000,no-desc
Fragments(video=1583487766000000,format=m3u8-aapl-v8)
#EXT-X-CUE:ID=95766,TYPE="SpliceOut",DURATION=30.000000,TIME=158348769.966667,ELAPSED=13.033333
#EXTINF:6.400000,no-desc
Fragments(video=1583487830000000,format=m3u8-aapl-v8)
#EXT-X-CUE:ID=95766,TYPE="SpliceOut",DURATION=30.000000,TIME=158348769.966667,ELAPSED=19.433333
#EXTINF:6.400000,no-desc
Fragments(video=1583487894000000,format=m3u8-aapl-v8)
#EXT-X-CUE:ID=95766,TYPE="SpliceOut",DURATION=30.000000,TIME=158348769.966667,ELAPSED=25.833333
#EXTINF:4.166667,no-desc
Fragments(video=1583487958000000,format=m3u8-aapl-v8)
#EXTINF:2.233333,no-desc
Fragments(video=1583487999666666,format=m3u8-aapl-v8)
#EXTINF:6.400000,no-desc
Fragments(video=1583488022000000,format=m3u8-aapl-v8)
...

~~~

### 2.1.6 Cancellation and Updates

Messages can be canceled or updated by sending multiple messages with the same
presentation time and ID. The presentation time and ID uniquely identify the
event, and the last message received for a specific presentation time that meets
pre-roll constraints is the message that is acted upon. The updated event replaces any
previously received messages. The pre-roll constraint is four seconds. Messages
received at least four seconds prior to the presentation time will be acted upon.

## 2.2 Fragmented MP4 Ingest (Smooth Streaming)

Refer to [MS-SSTR-Ingest] for requirements on live stream ingest. The following sections provide details regarding ingest of timed presentation metadata.  Timed presentation metadata is ingested as a sparse track, which is defined in both the Live Server Manifest Box (see MS-SSTR) and the Movie Box ('moov').  

Each sparse fragment consists of a Movie Fragment Box ('moof') and Media Data Box ('mdat'), where the 'mdat' box is the binary message.

In order to achieve frame-accurate insertion of ads, the encoder MUST split the fragment at the presentation time where the cue is required to be inserted.  A new fragment MUST be created that begins with a newly created IDR frame, or Stream Access Points (SAP) of type 1 or 2, as defined in [ISO-14496-12] Annex I. This allows the Azure Media Packager to properly generate an HLS manifest and a DASH multi-period manifest where the new Period begins at the frame-accurate splice conditioned presentation time.

### 2.2.1 Live Server Manifest Box

The sparse track **MUST** be declared in the Live Server Manifest box with a
**\<textstream\>** entry and it **MUST** have the following attributes set:

| **Attribute Name** | **Field Type** | **Required?** | **Description**                                                                                                                                                                                                              |
| ------------------ | -------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| systemBitrate      | Number         | Required      | **MUST** be "0", indicating a track with unknown, variable bitrate.                                                                                                                                                          |
| parentTrackName    | String         | Required      | **MUST** be the name of the parent track, to which the sparse track time codes are timescale aligned. The parent track cannot be a sparse track.                                                                             |
| manifestOutput     | Boolean        | Required      | **MUST** be "true", to indicate that the sparse track will be embedded in the Smooth client manifest.                                                                                                                        |
| Subtype            | String         | Required      | **MUST** be the four character code "DATA".                                                                                                                                                                                  |
| Scheme             | String         | Required      | **MUST** be a URN or URL identifying the message scheme. For [SCTE-35] messages, this **MUST** be "urn:scte:scte35:2013:bin" in order for messages to be sent to HLS, Smooth, and Dash clients in compliance with [SCTE-35]. |
| trackName          | String         | Required      | **MUST** be the name of the sparse track. The trackName can be used to differentiate multiple event streams with the same scheme. Each unique event stream **MUST** have a unique track name.                                |
| timescale          | Number         | Optional      | **MUST** be the timescale of the parent track.                                                                                                                                                                               |

---

### 2.2.2 Movie Box

The Movie Box ('moov') follows the Live Server Manifest Box as part of the
stream header for a sparse track.

The 'moov' box **SHOULD** contain a **TrackHeaderBox ('tkhd')** box as defined in
[ISO-14496-12] with the following constraints:

| **Field Name** | **Field Type**          | **Required?** | **Description**                                                                                                    |
| -------------- | ----------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------ |
| duration       | 64-bit unsigned integer | Required      | **SHOULD** be 0, since the track box has zero samples and the total duration of the samples in the track box is 0. |

---

The 'moov' box **SHOULD** contain a **HandlerBox ('hdlr')** as defined in
[ISO-14496-12] with the following constraints:

| **Field Name** | **Field Type**          | **Required?** | **Description**       |
| -------------- | ----------------------- | ------------- | --------------------- |
| handler_type   | 32-bit unsigned integer | Required      | **SHOULD** be 'meta'. |

---

The 'stsd' box **SHOULD** contain a MetaDataSampleEntry box with a coding name as defined in [ISO-14496-12].  For example, for SCTE-35 messages the coding name **SHOULD** be 'scte'.

### 2.2.3 Movie Fragment Box and Media Data Box

Sparse track fragments consist of a Movie Fragment Box ('moof') and a Media Data
Box ('mdat').

> [!NOTE]
> In order to achieve frame-accurate insertion of ads, the encoder MUST split the fragment at the presentation time where the cue is
> required to be inserted.  A new fragment MUST be created that begins with a newly created IDR frame, or Stream Access Points (SAP) of
> type 1 or 2, as defined in [ISO-14496-12] Annex I
> 

The MovieFragmentBox ('moof') box **MUST** contain a
**TrackFragmentExtendedHeaderBox ('uuid')** box as defined in [MS-SSTR] with the
following fields:

| **Field Name**         | **Field Type**          | **Required?** | **Description**                                                                                           |
| ---------------------- | ----------------------- | ------------- | --------------------------------------------------------------------------------------------------------- |
| fragment_absolute_time | 64-bit unsigned integer | Required      | **MUST** be the arrival time of the event. This value aligns the message with the parent track.           |
| fragment_duration      | 64-bit unsigned integer | Required      | **MUST** be the duration of the event. The duration can be zero to indicate that the duration is unknown. |

---


The MediaDataBox ('mdat') box **MUST** have the following format:

| **Field Name**          | **Field Type**                   | **Required?** | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ----------------------- | -------------------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| version                 | 32-bit unsigned integer (uimsbf) | Required      | Determines the format of the contents of the 'mdat' box. Unrecognized versions will be ignored. Currently the only supported version is 1.                                                                                                                                                                                                                                                                                                                                                                      |
| id                      | 32-bit unsigned integer (uimsbf) | Required      | Identifies this instance of the message. Messages with equivalent semantics shall have the same value; that is, processing any one event message box with the same id is sufficient.                                                                                                                                                                                                                                                                                                                            |
| presentation_time_delta | 32-bit unsigned integer (uimsbf) | Required      | The sum of the fragment_absolute_time, specified in the TrackFragmentExtendedHeaderBox, and the presentation_time_delta **MUST** be the presentation time of the event. The presentation time and duration **SHOULD** align with Stream Access Points (SAP) of type 1 or 2, as defined in [ISO-14496-12] Annex I. For HLS egress, time and duration **SHOULD** align with segment boundaries. The presentation time and duration of different event messages within the same event stream **MUST** not overlap. |
| message                 | byte array                       | Required      | The event message. For [SCTE-35] messages, the message is the binary splice_info_section(). For [SCTE-35] messages, this **MUST** be the splice_info_section() in order for messages to be sent to HLS, Smooth, and Dash clients in compliance with [SCTE-35]. For [SCTE-35] messages, the binary splice_info_section() is the payload of the 'mdat' box, and it is **NOT** base64 encoded.                                                                                                                     |

---


### 2.2.4 Cancellation and Updates

Messages can be canceled or updated by sending multiple messages with the same presentation time and ID.  The presentation time and ID uniquely identify the event. The last message received for a specific presentation time, that meets pre-roll constraints, is the message that is acted upon. The updated message replaces any previously received messages.  The pre-roll constraint is four seconds. Messages received at least four seconds prior to the presentation time will be acted upon. 


## 3 Timed Metadata Delivery

Event stream data is opaque to Media Services. Media Services merely
passes three pieces of information between the ingest endpoint and the client
endpoint. The following properties are delivered to the client, in compliance
with [SCTE-35] and/or the client's streaming protocol:

1.  Scheme – a URN or URL identifying the scheme of the message.
2.  Presentation Time – the presentation time of the event on the media
    timeline.
3.  Duration – the duration of the event.
4.  ID – an optional unique identifier for the event.
5.  Message – the event data.

## 3.1 Microsoft Smooth Streaming Manifest  

Refer to sparse track handling [MS-SSTR] for details on how to format a sparse message track.
For [SCTE35] messages, Smooth Streaming will output the base64-encoded splice_info_section() into a sparse fragment.
The StreamIndex **MUST** have a Subtype of "DATA", and the CustomAttributes **MUST** contain an Attribute with Name="Schema" and Value="urn:scte:scte35:2013:bin".

#### Smooth Client Manifest Example showing base64-encoded [SCTE35] splice_info_section()
~~~ xml
<?xml version="1.0" encoding="utf-8"?>
<SmoothStreamingMedia MajorVersion="2" MinorVersion="0" TimeScale="10000000" IsLive="true" Duration="0"
  LookAheadFragmentCount="2" DVRWindowLength="6000000000">

  <StreamIndex Type="video" Name="video" Subtype="" Chunks="0" TimeScale="10000000"
    Url="QualityLevels({bitrate})/Fragments(video={start time})">
    <QualityLevel Index="0" Bitrate="230000"
      CodecPrivateData="250000010FC3460B50878A0B5821FF878780490800704704DC0000010E5A67F840" FourCC="WVC1"
      MaxWidth="364" MaxHeight="272"/>
    <QualityLevel Index="1" Bitrate="305000"
      CodecPrivateData="250000010FC3480B50878A0B5821FF87878049080894E4A7640000010E5A67F840" FourCC="WVC1"
      MaxWidth="364" MaxHeight="272"/>
    <c t="0" d="20000000" r="300" />
  </StreamIndex>
  <StreamIndex Type="audio" Name="audio" Subtype="" Chunks="0" TimeScale="10000000"
    Url="QualityLevels({bitrate})/Fragments(audio={start time})">
    <QualityLevel Index="0" Bitrate="96000" CodecPrivateData="1000030000000000000000000000E00042C0"
      FourCC="WMAP" AudioTag="354" Channels="2" SamplingRate="44100" BitsPerSample="16" PacketSize="4459"/>
    <c t="0" d="20000000" r="300" />
  </StreamIndex>
  <StreamIndex Type="text" Name="scte35-sparse-stream" Subtype="DATA" Chunks="0" TimeScale="10000000"
    ParentStreamIndex="video" ManifestOutput="true" 
    Url="QualityLevels({bitrate})/Fragments(captions={start time})">
    <QualityLevel Index="0" Bitrate="0" CodecPrivateData="" FourCC="">
      <CustomAttributes>
        <Attribute Name="Scheme" Value="urn:scte:scte35:2013:bin"/>
      </CustomAttributes>
    </QualityLevel>
    <!-- The following <c> and <f> fragments contains the base64-encoded [SCTE35] splice_info_section() message -->
    <c t="600000000" d="300000000">    <f>PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48QWNxdWlyZWRTaWduYWwgeG1sbnM9InVybjpjYWJsZWxhYnM6bWQ6eHNkOnNpZ25hbGluZzozLjAiIGFjcXVpc2l0aW9uUG9pbnRJZGVudGl0eT0iRVNQTl9FYXN0X0FjcXVpc2l0aW9uX1BvaW50XzEiIGFjcXVpc2l0aW9uU2lnbmFsSUQ9IjRBNkE5NEVFLTYyRkExMUUxQjFDQTg4MkY0ODI0MDE5QiIgYWNxdWlzaXRpb25UaW1lPSIyMDEyLTA5LTE4VDEwOjE0OjI2WiI+PFVUQ1BvaW50IHV0Y1BvaW50PSIyMDEyLTA5LTE4VDEwOjE0OjM0WiIvPjxTQ1RFMzVQb2ludERlc2NyaXB0b3Igc3BsaWNlQ29tbWFuZFR5cGU9IjUiPjxTcGxpY2VJbnNlcnQgc3BsaWNlRXZlbnRJRD0iMzQ0NTY4NjkxIiBvdXRPZk5ldHdvcmtJbmRpY2F0b3I9InRydWUiIHVuaXF1ZVByb2dyYW1JRD0iNTUzNTUiIGR1cmF0aW9uPSJQVDFNMFMiIGF2YWlsTnVtPSIxIiBhdmFpbHNFeHBlY3RlZD0iMTAiLz48L1NDVEUzNVBvaW50RGVzY3JpcHRvcj48U3RyZWFtVGltZXM+PFN0cmVhbVRpbWUgdGltZVR5cGU9IkhTUyIgdGltZVZhbHVlPSI1MTUwMDAwMDAwMDAiLz48L1N0cmVhbVRpbWVzPjwvQWNxdWlyZWRTaWduYWw+</f>
    </c>
    <c t="1200000000" d="400000000">      <f>PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48QWNxdWlyZWRTaWduYWwgeG1sbnM9InVybjpjYWJsZWxhYnM6bWQ6eHNkOnNpZ25hbGluZzozLjAiIGFjcXVpc2l0aW9uUG9pbnRJZGVudGl0eT0iRVNQTl9FYXN0X0FjcXVpc2l0aW9uX1BvaW50XzEiIGFjcXVpc2l0aW9uU2lnbmFsSUQ9IjRBNkE5NEVFLTYyRkExMUUxQjFDQTg4MkY0ODI0MDE5QiIgYWNxdWlzaXRpb25UaW1lPSIyMDEyLTA5LTE4VDEwOjE0OjI2WiI+PFVUQ1BvaW50IHV0Y1BvaW50PSIyMDEyLTA5LTE4VDEwOjE0OjM0WiIvPjxTQ1RFMzVQb2ludERlc2NyaXB0b3Igc3BsaWNlQ29tbWFuZFR5cGU9IjUiPjxTcGxpY2VJbnNlcnQgc3BsaWNlRXZlbnRJRD0iMzQ0NTY4NjkxIiBvdXRPZk5ldHdvcmtJbmRpY2F0b3I9InRydWUiIHVuaXF1ZVByb2dyYW1JRD0iNTUzNTUiIGR1cmF0aW9uPSJQVDFNMFMiIGF2YWlsTnVtPSIxIiBhdmFpbHNFeHBlY3RlZD0iMTAiLz48L1NDVEUzNVBvaW50RGVzY3JpcHRvcj48U3RyZWFtVGltZXM+PFN0cmVhbVRpbWUgdGltZVR5cGU9IkhTUyIgdGltZVZhbHVlPSI1MTYyMDAwMDAwMDAiLz48L1N0cmVhbVRpbWVzPjwvQWNxdWlyZWRTaWduYWw+</f>
    </c>
  </StreamIndex>
</SmoothStreamingMedia>
~~~

## 3.2 Apple HLS Manifest Decoration

Azure Media Services supports the following HLS manifest tags for signaling ad avail information during a live or on-demand event. 

- EXT-X-DATERANGE as defined in Apple HLS [RFC8216]
- EXT-X-CUE as defined in [Adobe-Primetime] - this mode is considered "legacy". Customers should  adopt the EXT-X-DATERANGE tag when possible.

The data output to each tag will vary based on the ingest signal mode used. For example, RTMP ingest with Adobe Simple mode does not contain the full SCTE-35 base64-encoded payload.

## 3.2.1 Apple HLS with EXT-X-DATERANGE (recommended)

The Apple HTTP Live Streaming [RFC8216] specification allows for signaling of [SCTE-35] messages. The messages are inserted into the segment playlist in an EXT-X-DATERANGE tag per [RFC8216] section titled "Mapping SCTE-35 into EXT-X-DATERANGE".  The client application layer can parse the M3U playlist and process M3U tags, or receive the events through the Apple player framework.  

The **RECOMMENDED** approach in Azure Media Services (version 3 API) is to follow [RFC8216] and use the EXT-X_DATERANGE tag for [SCTE35] ad avail decoration in the manifest.

## 3.2.1.1 Example HLS manifest .m3u8 showing EXT-X-DATERANGE signaling of SCTE-35

The following example HLS manifest output from the Media Services dynamic packager shows the use of the EXT-X-DATERANGE tag from [RFC8216] signaling the SCTE-35 events in the stream. In addition, this stream contains the "legacy" EXT-X-CUE tag for [Adobe-Primetime].

~~~
#EXTM3U
#EXT-X-VERSION:8
#EXT-X-MEDIA-SEQUENCE:0
#EXT-X-TARGETDURATION:2
#EXT-X-INDEPENDENT-SEGMENTS
#EXT-X-PROGRAM-DATE-TIME:2020-01-07T19:40:50Z
#EXTINF:1.501500,no-desc
Fragments(video=22567545,format=m3u8-aapl-v8)
#EXTINF:1.501500,no-desc
Fragments(video=22702680,format=m3u8-aapl-v8)
#EXTINF:1.501500,no-desc
Fragments(video=22837815,format=m3u8-aapl-v8)
#EXTINF:1.501500,no-desc
Fragments(video=22972950,format=m3u8-aapl-v8)
#EXTINF:1.501500,no-desc
Fragments(video=23108085,format=m3u8-aapl-v8)
#EXTINF:1.234567,no-desc
Fragments(video=23243220,format=m3u8-aapl-v8)
#EXTINF:0.016689,no-desc
Fragments(video=23354331,format=m3u8-aapl-v8)
#EXT-X-DATERANGE:ID="1002",START-DATE="2020-01-07T19:45:09.509Z",SCTE35-OUT=0xFC30250000000005DD00FFF01405000003EA7FEFFE016461B8FE00526363000101010000F20D5E37
#EXT-X-CUE:ID="1002",TYPE="scte35",DURATION=59.993278,TIME=259.509244,CUE="/DAlAAAAAAXdAP/wFAUAAAPqf+/+AWRhuP4AUmNjAAEBAQAA8g1eNw==",ELAPSED=0.000022
#EXTINF:0.250244,no-desc
Fragments(video=23355833,format=m3u8-aapl-v8)
#EXT-X-DATERANGE:ID="1002",START-DATE="2020-01-07T19:45:09.509Z",SCTE35-OUT=0xFC30250000000005DD00FFF01405000003EA7FEFFE016461B8FE00526363000101010000F20D5E37
#EXT-X-CUE:ID="1002",TYPE="scte35",DURATION=59.993278,TIME=259.509244,CUE="/DAlAAAAAAXdAP/wFAUAAAPqf+/+AWRhuP4AUmNjAAEBAQAA8g1eNw==",ELAPSED=0.250267
#EXTINF:0.850856,no-desc
Fragments(video=23378355,format=m3u8-aapl-v8)
#EXT-X-DATERANGE:ID="1002",START-DATE="2020-01-07T19:45:09.509Z",SCTE35-OUT=0xFC30250000000005DD00FFF01405000003EA7FEFFE016461B8FE00526363000101010000F20D5E37
#EXT-X-CUE:ID="1002",TYPE="scte35",DURATION=59.993278,TIME=259.509244,CUE="/DAlAAAAAAXdAP/wFAUAAAPqf+/+AWRhuP4AUmNjAAEBAQAA8g1eNw==",ELAPSED=1.101122
#EXT-X-DATERANGE:ID="1002",START-DATE="2020-01-07T19:45:10.610Z",SCTE35-IN=0xFC30200000000005DD00FFF00F05000003EA7F4FFE0165E4D3000101010000607CE85A
#EXT-X-CUE:ID="1002",TYPE="scte35",DURATION=0.000000,TIME=260.610344,CUE="/DAgAAAAAAXdAP/wDwUAAAPqf0/+AWXk0wABAQEAAGB86Fo="
#EXTINF:0.650644,no-desc
Fragments(video=23454932,format=m3u8-aapl-v8)
#EXT-X-DATERANGE:ID="1002",START-DATE="2020-01-07T19:45:09.509Z",SCTE35-OUT=0xFC30250000000005DD00FFF01405000003EA7FEFFE016461B8FE00526363000101010000F20D5E37
#EXT-X-CUE:ID="1002",TYPE="scte35",DURATION=59.993278,TIME=259.509244,CUE="/DAlAAAAAAXdAP/wFAUAAAPqf+/+AWRhuP4AUmNjAAEBAQAA8g1eNw==",ELAPSED=1.751767
#EXTINF:0.050044,no-desc
Fragments(video=23513490,format=m3u8-aapl-v8)
#EXT-X-DATERANGE:ID="1002",START-DATE="2020-01-07T19:45:09.509Z",SCTE35-OUT=0xFC30250000000005DD00FFF01405000003EA7FEFFE016461B8FE00526363000101010000F20D5E37
#EXT-X-CUE:ID="1002",TYPE="scte35",DURATION=59.993278,TIME=259.509244,CUE="/DAlAAAAAAXdAP/wFAUAAAPqf+/+AWRhuP4AUmNjAAEBAQAA8g1eNw==",ELAPSED=1.801811
#EXTINF:1.451456,no-desc
Fragments(video=23517994,format=m3u8-aapl-v8)
#EXT-X-DATERANGE:ID="1002",START-DATE="2020-01-07T19:45:09.509Z",SCTE35-OUT=0xFC30250000000005DD00FFF01405000003EA7FEFFE016461B8FE00526363000101010000F20D5E37
#EXT-X-CUE:ID="1002",TYPE="scte35",DURATION=59.993278,TIME=259.509244,CUE="/DAlAAAAAAXdAP/wFAUAAAPqf+/+AWRhuP4AUmNjAAEBAQAA8g1eNw==",ELAPSED=3.253267
#EXTINF:1.501500,no-desc
Fragments(video=23648625,format=m3u8-aapl-v8)
#EXT-X-DATERANGE:ID="1002",START-DATE="2020-01-07T19:45:09.509Z",SCTE35-OUT=0xFC30250000000005DD00FFF01405000003EA7FEFFE016461B8FE00526363000101010000F20D5E37
#EXT-X-CUE:ID="1002",TYPE="scte35",DURATION=59.993278,TIME=259.509244,CUE="/DAlAAAAAAXdAP/wFAUAAAPqf+/+AWRhuP4AUmNjAAEBAQAA8g1eNw==",ELAPSED=4.754767
#EXTINF:1.501500,no-desc
Fragments(video=23783760,format=m3u8-aapl-v8)
#EXT-X-DATERANGE:ID="1002",START-DATE="2020-01-07T19:45:09.509Z",SCTE35-OUT=0xFC30250000000005DD00FFF01405000003EA7FEFFE016461B8FE00526363000101010000F20D5E37
#EXT-X-CUE:ID="1002",TYPE="scte35",DURATION=59.993278,TIME=259.509244,CUE="/DAlAAAAAAXdAP/wFAUAAAPqf+/+AWRhuP4AUmNjAAEBAQAA8g1eNw==",ELAPSED=6.256267
#EXTINF:1.501500,no-desc
Fragments(video=23918895,format=m3u8-aapl-v8)
#EXT-X-DATERANGE:ID="1002",START-DATE="2020-01-07T19:45:09.509Z",SCTE35-OUT=0xFC30250000000005DD00FFF01405000003EA7FEFFE016461B8FE00526363000101010000F20D5E37
#EXT-X-CUE:ID="1002",TYPE="scte35",DURATION=59.993278,TIME=259.509244,CUE="/DAlAAAAAAXdAP/wFAUAAAPqf+/+AWRhuP4AUmNjAAEBAQAA8g1eNw==",ELAPSED=7.757767
#EXTINF:1.501500,no-desc
Fragments(video=24054030,format=m3u8-aapl-v8)
#EXT-X-DATERANGE:ID="1002",START-DATE="2020-01-07T19:45:09.509Z",SCTE35-OUT=0xFC30250000000005DD00FFF01405000003EA7FEFFE016461B8FE00526363000101010000F20D5E37
#EXT-X-CUE:ID="1002",TYPE="scte35",DURATION=59.993278,TIME=259.509244,CUE="/DAlAAAAAAXdAP/wFAUAAAPqf+/+AWRhuP4AUmNjAAEBAQAA8g1eNw==",ELAPSED=9.259267
#EXTINF:1.501500,no-desc
Fragments(video=24189165,format=m3u8-aapl-v8)
#EXT-X-DATERANGE:ID="1002",START-DATE="2020-01-07T19:45:09.509Z",SCTE35-OUT=0xFC30250000000005DD00FFF01405000003EA7FEFFE016461B8FE00526363000101010000F20D5E37
#EXT-X-CUE:ID="1002",TYPE="scte35",DURATION=59.993278,TIME=259.509244,CUE="/DAlAAAAAAXdAP/wFAUAAAPqf+/+AWRhuP4AUmNjAAEBAQAA8g1eNw==",ELAPSED=10.760767
#EXTINF:1.501500,no-desc
Fragments(video=24324300,format=m3u8-aapl-v8)
#EXT-X-DATERANGE:ID="1002",START-DATE="2020-01-07T19:45:09.509Z",SCTE35-OUT=0xFC30250000000005DD00FFF01405000003EA7FEFFE016461B8FE00526363000101010000F20D5E37
#EXT-X-CUE:ID="1002",TYPE="scte35",DURATION=59.993278,TIME=259.509244,CUE="/DAlAAAAAAXdAP/wFAUAAAPqf+/+AWRhuP4AUmNjAAEBAQAA8g1eNw==",ELAPSED=12.262267
#EXTINF:1.501500,no-desc
Fragments(video=24459435,format=m3u8-aapl-v8)
#EXT-X-DATERANGE:ID="1002",START-DATE="2020-01-07T19:45:09.509Z",SCTE35-OUT=0xFC30250000000005DD00FFF01405000003EA7FEFFE016461B8FE00526363000101010000F20D5E37
#EXT-X-CUE:ID="1002",TYPE="scte35",DURATION=59.993278,TIME=259.509244,CUE="/DAlAAAAAAXdAP/wFAUAAAPqf+/+AWRhuP4AUmNjAAEBAQAA8g1eNw==",ELAPSED=13.763767
#EXTINF:1.501500,no-desc
Fragments(video=24594570,format=m3u8-aapl-v8)
#EXT-X-DATERANGE:ID="1002",START-DATE="2020-01-07T19:45:09.509Z",SCTE35-OUT=0xFC30250000000005DD00FFF01405000003EA7FEFFE016461B8FE00526363000101010000F20D5E37
#EXT-X-CUE:ID="1002",TYPE="scte35",DURATION=59.993278,TIME=259.509244,CUE="/DAlAAAAAAXdAP/wFAUAAAPqf+/+AWRhuP4AUmNjAAEBAQAA8g1eNw==",ELAPSED=15.265267
#EXTINF:1.501500,no-desc
Fragments(video=24729705,format=m3u8-aapl-v8)
#EXT-X-DATERANGE:ID="1002",START-DATE="2020-01-07T19:45:09.509Z",SCTE35-OUT=0xFC30250000000005DD00FFF01405000003EA7FEFFE016461B8FE00526363000101010000F20D5E37
#EXT-X-CUE:ID="1002",TYPE="scte35",DURATION=59.993278,TIME=259.509244,CUE="/DAlAAAAAAXdAP/wFAUAAAPqf+/+AWRhuP4AUmNjAAEBAQAA8g1eNw==",ELAPSED=16.766767
#EXTINF:1.501500,no-desc
Fragments(video=24864840,format=m3u8-aapl-v8)
#EXT-X-DATERANGE:ID="1002",START-DATE="2020-01-07T19:45:09.509Z",SCTE35-OUT=0xFC30250000000005DD00FFF01405000003EA7FEFFE016461B8FE00526363000101010000F20D5E37
#EXT-X-CUE:ID="1002",TYPE="scte35",DURATION=59.993278,TIME=259.509244,CUE="/DAlAAAAAAXdAP/wFAUAAAPqf+/+AWRhuP4AUmNjAAEBAQAA8g1eNw==",ELAPSED=18.268267
#EXTINF:1.501500,no-desc
Fragments(video=24999975,format=m3u8-aapl-v8)
#EXT-X-DATERANGE:ID="1002",START-DATE="2020-01-07T19:45:09.509Z",SCTE35-OUT=0xFC30250000000005DD00FFF01405000003EA7FEFFE016461B8FE00526363000101010000F20D5E37
#EXT-X-CUE:ID="1002",TYPE="scte35",DURATION=59.993278,TIME=259.509244,CUE="/DAlAAAAAAXdAP/wFAUAAAPqf+/+AWRhuP4AUmNjAAEBAQAA8g1eNw==",ELAPSED=19.769767
#EXTINF:1.501500,no-desc
Fragments(video=25135110,format=m3u8-aapl-v8)
#EXT-X-DATERANGE:ID="1002",START-DATE="2020-01-07T19:45:09.509Z",SCTE35-OUT=0xFC30250000000005DD00FFF01405000003EA7FEFFE016461B8FE00526363000101010000F20D5E37
#EXT-X-CUE:ID="1002",TYPE="scte35",DURATION=59.993278,TIME=259.509244,CUE="/DAlAAAAAAXdAP/wFAUAAAPqf+/+AWRhuP4AUmNjAAEBAQAA8g1eNw==",ELAPSED=21.271267
#EXTINF:1.501500,no-desc
Fragments(video=25270245,format=m3u8-aapl-v8)
#EXT-X-DATERANGE:ID="1002",START-DATE="2020-01-07T19:45:09.509Z",SCTE35-OUT=0xFC30250000000005DD00FFF01405000003EA7FEFFE016461B8FE00526363000101010000F20D5E37
#EXT-X-CUE:ID="1002",TYPE="scte35",DURATION=59.993278,TIME=259.509244,CUE="/DAlAAAAAAXdAP/wFAUAAAPqf+/+AWRhuP4AUmNjAAEBAQAA8g1eNw==",ELAPSED=22.772767
#EXTINF:1.501500,no-desc
Fragments(video=25405380,format=m3u8-aapl-v8)
#EXT-X-DATERANGE:ID="1002",START-DATE="2020-01-07T19:45:09.509Z",SCTE35-OUT=0xFC30250000000005DD00FFF01405000003EA7FEFFE016461B8FE00526363000101010000F20D5E37
#EXT-X-CUE:ID="1002",TYPE="scte35",DURATION=59.993278,TIME=259.509244,CUE="/DAlAAAAAAXdAP/wFAUAAAPqf+/+AWRhuP4AUmNjAAEBAQAA8g1eNw==",ELAPSED=24.274267
#EXTINF:1.501500,no-desc
Fragments(video=25540515,format=m3u8-aapl-v8)
#EXT-X-DATERANGE:ID="1002",START-DATE="2020-01-07T19:45:09.509Z",SCTE35-OUT=0xFC30250000000005DD00FFF01405000003EA7FEFFE016461B8FE00526363000101010000F20D5E37
#EXT-X-CUE:ID="1002",TYPE="scte35",DURATION=59.993278,TIME=259.509244,CUE="/DAlAAAAAAXdAP/wFAUAAAPqf+/+AWRhuP4AUmNjAAEBAQAA8g1eNw==",ELAPSED=25.775767
#EXTINF:1.501500,no-desc
Fragments(video=25675650,format=m3u8-aapl-v8)
#EXT-X-DATERANGE:ID="1002",START-DATE="2020-01-07T19:45:09.509Z",SCTE35-OUT=0xFC30250000000005DD00FFF01405000003EA7FEFFE016461B8FE00526363000101010000F20D5E37
#EXT-X-CUE:ID="1002",TYPE="scte35",DURATION=59.993278,TIME=259.509244,CUE="/DAlAAAAAAXdAP/wFAUAAAPqf+/+AWRhuP4AUmNjAAEBAQAA8g1eNw==",ELAPSED=27.277267
#EXTINF:1.501500,no-desc
Fragments(video=25810785,format=m3u8-aapl-v8)
#EXT-X-DATERANGE:ID="1002",START-DATE="2020-01-07T19:45:09.509Z",SCTE35-OUT=0xFC30250000000005DD00FFF01405000003EA7FEFFE016461B8FE00526363000101010000F20D5E37
#EXT-X-CUE:ID="1002",TYPE="scte35",DURATION=59.993278,TIME=259.509244,CUE="/DAlAAAAAAXdAP/wFAUAAAPqf+/+AWRhuP4AUmNjAAEBAQAA8g1eNw==",ELAPSED=28.778767
#EXTINF:1.501500,no-desc
Fragments(video=25945920,format=m3u8-aapl-v8)
#EXT-X-DATERANGE:ID="1002",START-DATE="2020-01-07T19:45:09.509Z",SCTE35-OUT=0xFC30250000000005DD00FFF01405000003EA7FEFFE016461B8FE00526363000101010000F20D5E37
#EXT-X-CUE:ID="1002",TYPE="scte35",DURATION=59.993278,TIME=259.509244,CUE="/DAlAAAAAAXdAP/wFAUAAAPqf+/+AWRhuP4AUmNjAAEBAQAA8g1eNw==",ELAPSED=30.280267
#EXTINF:1.501500,no-desc
Fragments(video=26081055,format=m3u8-aapl-v8)
#EXT-X-DATERANGE:ID="1002",START-DATE="2020-01-07T19:45:09.509Z",SCTE35-OUT=0xFC30250000000005DD00FFF01405000003EA7FEFFE016461B8FE00526363000101010000F20D5E37
#EXT-X-CUE:ID="1002",TYPE="scte35",DURATION=59.993278,TIME=259.509244,CUE="/DAlAAAAAAXdAP/wFAUAAAPqf+/+AWRhuP4AUmNjAAEBAQAA8g1eNw==",ELAPSED=31.781767
#EXTINF:1.501500,no-desc
Fragments(video=26216190,format=m3u8-aapl-v8)
#EXT-X-DATERANGE:ID="1002",START-DATE="2020-01-07T19:45:09.509Z",SCTE35-OUT=0xFC30250000000005DD00FFF01405000003EA7FEFFE016461B8FE00526363000101010000F20D5E37
#EXT-X-CUE:ID="1002",TYPE="scte35",DURATION=59.993278,TIME=259.509244,CUE="/DAlAAAAAAXdAP/wFAUAAAPqf+/+AWRhuP4AUmNjAAEBAQAA8g1eNw==",ELAPSED=33.283267
#EXTINF:1.501500,no-desc
Fragments(video=26351325,format=m3u8-aapl-v8)
#EXT-X-DATERANGE:ID="1002",START-DATE="2020-01-07T19:45:09.509Z",SCTE35-OUT=0xFC30250000000005DD00FFF01405000003EA7FEFFE016461B8FE00526363000101010000F20D5E37
#EXT-X-CUE:ID="1002",TYPE="scte35",DURATION=59.993278,TIME=259.509244,CUE="/DAlAAAAAAXdAP/wFAUAAAPqf+/+AWRhuP4AUmNjAAEBAQAA8g1eNw==",ELAPSED=34.784767
#EXTINF:1.501500,no-desc
Fragments(video=26486460,format=m3u8-aapl-v8)
#EXT-X-DATERANGE:ID="1002",START-DATE="2020-01-07T19:45:09.509Z",SCTE35-OUT=0xFC30250000000005DD00FFF01405000003EA7FEFFE016461B8FE00526363000101010000F20D5E37
#EXT-X-CUE:ID="1002",TYPE="scte35",DURATION=59.993278,TIME=259.509244,CUE="/DAlAAAAAAXdAP/wFAUAAAPqf+/+AWRhuP4AUmNjAAEBAQAA8g1eNw==",ELAPSED=36.286267
#EXTINF:1.501500,no-desc
Fragments(video=26621595,format=m3u8-aapl-v8)
#EXT-X-DATERANGE:ID="1002",START-DATE="2020-01-07T19:45:09.509Z",SCTE35-OUT=0xFC30250000000005DD00FFF01405000003EA7FEFFE016461B8FE00526363000101010000F20D5E37
#EXT-X-CUE:ID="1002",TYPE="scte35",DURATION=59.993278,TIME=259.509244,CUE="/DAlAAAAAAXdAP/wFAUAAAPqf+/+AWRhuP4AUmNjAAEBAQAA8g1eNw==",ELAPSED=37.787767
#EXTINF:1.501500,no-desc
Fragments(video=26756730,format=m3u8-aapl-v8)
#EXT-X-DATERANGE:ID="1002",START-DATE="2020-01-07T19:45:09.509Z",SCTE35-OUT=0xFC30250000000005DD00FFF01405000003EA7FEFFE016461B8FE00526363000101010000F20D5E37
#EXT-X-CUE:ID="1002",TYPE="scte35",DURATION=59.993278,TIME=259.509244,CUE="/DAlAAAAAAXdAP/wFAUAAAPqf+/+AWRhuP4AUmNjAAEBAQAA8g1eNw==",ELAPSED=39.289267
#EXTINF:1.501500,no-desc
Fragments(video=26891865,format=m3u8-aapl-v8)
#EXT-X-DATERANGE:ID="1002",START-DATE="2020-01-07T19:45:09.509Z",SCTE35-OUT=0xFC30250000000005DD00FFF01405000003EA7FEFFE016461B8FE00526363000101010000F20D5E37
#EXT-X-CUE:ID="1002",TYPE="scte35",DURATION=59.993278,TIME=259.509244,CUE="/DAlAAAAAAXdAP/wFAUAAAPqf+/+AWRhuP4AUmNjAAEBAQAA8g1eNw==",ELAPSED=40.790767
#EXTINF:1.501500,no-desc
Fragments(video=27027000,format=m3u8-aapl-v8)
#EXT-X-DATERANGE:ID="1002",START-DATE="2020-01-07T19:45:09.509Z",SCTE35-OUT=0xFC30250000000005DD00FFF01405000003EA7FEFFE016461B8FE00526363000101010000F20D5E37
#EXT-X-CUE:ID="1002",TYPE="scte35",DURATION=59.993278,TIME=259.509244,CUE="/DAlAAAAAAXdAP/wFAUAAAPqf+/+AWRhuP4AUmNjAAEBAQAA8g1eNw==",ELAPSED=42.292267
#EXTINF:1.501500,no-desc
Fragments(video=27162135,format=m3u8-aapl-v8)
#EXT-X-DATERANGE:ID="1002",START-DATE="2020-01-07T19:45:09.509Z",SCTE35-OUT=0xFC30250000000005DD00FFF01405000003EA7FEFFE016461B8FE00526363000101010000F20D5E37
#EXT-X-CUE:ID="1002",TYPE="scte35",DURATION=59.993278,TIME=259.509244,CUE="/DAlAAAAAAXdAP/wFAUAAAPqf+/+AWRhuP4AUmNjAAEBAQAA8g1eNw==",ELAPSED=43.793767
#EXTINF:1.501500,no-desc
Fragments(video=27297270,format=m3u8-aapl-v8)
#EXT-X-DATERANGE:ID="1002",START-DATE="2020-01-07T19:45:09.509Z",SCTE35-OUT=0xFC30250000000005DD00FFF01405000003EA7FEFFE016461B8FE00526363000101010000F20D5E37
#EXT-X-CUE:ID="1002",TYPE="scte35",DURATION=59.993278,TIME=259.509244,CUE="/DAlAAAAAAXdAP/wFAUAAAPqf+/+AWRhuP4AUmNjAAEBAQAA8g1eNw==",ELAPSED=45.295267
#EXTINF:1.501500,no-desc
Fragments(video=27432405,format=m3u8-aapl-v8)
#EXT-X-DATERANGE:ID="1002",START-DATE="2020-01-07T19:45:09.509Z",SCTE35-OUT=0xFC30250000000005DD00FFF01405000003EA7FEFFE016461B8FE00526363000101010000F20D5E37
#EXT-X-CUE:ID="1002",TYPE="scte35",DURATION=59.993278,TIME=259.509244,CUE="/DAlAAAAAAXdAP/wFAUAAAPqf+/+AWRhuP4AUmNjAAEBAQAA8g1eNw==",ELAPSED=46.796767
#EXTINF:1.501500,no-desc
Fragments(video=27567540,format=m3u8-aapl-v8)
#EXT-X-DATERANGE:ID="1002",START-DATE="2020-01-07T19:45:09.509Z",SCTE35-OUT=0xFC30250000000005DD00FFF01405000003EA7FEFFE016461B8FE00526363000101010000F20D5E37
#EXT-X-CUE:ID="1002",TYPE="scte35",DURATION=59.993278,TIME=259.509244,CUE="/DAlAAAAAAXdAP/wFAUAAAPqf+/+AWRhuP4AUmNjAAEBAQAA8g1eNw==",ELAPSED=48.298267
#EXTINF:1.501500,no-desc
Fragments(video=27702675,format=m3u8-aapl-v8)
#EXT-X-DATERANGE:ID="1002",START-DATE="2020-01-07T19:45:09.509Z",SCTE35-OUT=0xFC30250000000005DD00FFF01405000003EA7FEFFE016461B8FE00526363000101010000F20D5E37
#EXT-X-CUE:ID="1002",TYPE="scte35",DURATION=59.993278,TIME=259.509244,CUE="/DAlAAAAAAXdAP/wFAUAAAPqf+/+AWRhuP4AUmNjAAEBAQAA8g1eNw==",ELAPSED=49.799767
#EXTINF:1.501500,no-desc
Fragments(video=27837810,format=m3u8-aapl-v8)
#EXT-X-DATERANGE:ID="1002",START-DATE="2020-01-07T19:45:09.509Z",SCTE35-OUT=0xFC30250000000005DD00FFF01405000003EA7FEFFE016461B8FE00526363000101010000F20D5E37
#EXT-X-CUE:ID="1002",TYPE="scte35",DURATION=59.993278,TIME=259.509244,CUE="/DAlAAAAAAXdAP/wFAUAAAPqf+/+AWRhuP4AUmNjAAEBAQAA8g1eNw==",ELAPSED=51.301267
#EXTINF:1.501500,no-desc
Fragments(video=27972945,format=m3u8-aapl-v8)
#EXT-X-DATERANGE:ID="1002",START-DATE="2020-01-07T19:45:09.509Z",SCTE35-OUT=0xFC30250000000005DD00FFF01405000003EA7FEFFE016461B8FE00526363000101010000F20D5E37
#EXT-X-CUE:ID="1002",TYPE="scte35",DURATION=59.993278,TIME=259.509244,CUE="/DAlAAAAAAXdAP/wFAUAAAPqf+/+AWRhuP4AUmNjAAEBAQAA8g1eNw==",ELAPSED=52.802767
#EXTINF:1.501500,no-desc
Fragments(video=28108080,format=m3u8-aapl-v8)
#EXT-X-DATERANGE:ID="1002",START-DATE="2020-01-07T19:45:09.509Z",SCTE35-OUT=0xFC30250000000005DD00FFF01405000003EA7FEFFE016461B8FE00526363000101010000F20D5E37
#EXT-X-CUE:ID="1002",TYPE="scte35",DURATION=59.993278,TIME=259.509244,CUE="/DAlAAAAAAXdAP/wFAUAAAPqf+/+AWRhuP4AUmNjAAEBAQAA8g1eNw==",ELAPSED=54.304267
#EXTINF:1.501500,no-desc
Fragments(video=28243215,format=m3u8-aapl-v8)
#EXT-X-DATERANGE:ID="1002",START-DATE="2020-01-07T19:45:09.509Z",SCTE35-OUT=0xFC30250000000005DD00FFF01405000003EA7FEFFE016461B8FE00526363000101010000F20D5E37
#EXT-X-CUE:ID="1002",TYPE="scte35",DURATION=59.993278,TIME=259.509244,CUE="/DAlAAAAAAXdAP/wFAUAAAPqf+/+AWRhuP4AUmNjAAEBAQAA8g1eNw==",ELAPSED=55.805767
#EXTINF:1.501500,no-desc
Fragments(video=28378350,format=m3u8-aapl-v8)
#EXT-X-DATERANGE:ID="1002",START-DATE="2020-01-07T19:45:09.509Z",SCTE35-OUT=0xFC30250000000005DD00FFF01405000003EA7FEFFE016461B8FE00526363000101010000F20D5E37
#EXT-X-CUE:ID="1002",TYPE="scte35",DURATION=59.993278,TIME=259.509244,CUE="/DAlAAAAAAXdAP/wFAUAAAPqf+/+AWRhuP4AUmNjAAEBAQAA8g1eNw==",ELAPSED=57.307267
#EXTINF:1.501500,no-desc
Fragments(video=28513485,format=m3u8-aapl-v8)
#EXT-X-DATERANGE:ID="1002",START-DATE="2020-01-07T19:45:09.509Z",SCTE35-OUT=0xFC30250000000005DD00FFF01405000003EA7FEFFE016461B8FE00526363000101010000F20D5E37
#EXT-X-CUE:ID="1002",TYPE="scte35",DURATION=59.993278,TIME=259.509244,CUE="/DAlAAAAAAXdAP/wFAUAAAPqf+/+AWRhuP4AUmNjAAEBAQAA8g1eNw==",ELAPSED=58.808767
#EXTINF:1.501500,no-desc
Fragments(video=28648620,format=m3u8-aapl-v8)

~~~


## 3.2.2 Apple HLS with Adobe Primetime EXT-X-CUE (legacy)

There is also a "legacy" implementation provided in Azure Media Services (version 2 and 3 API) that uses the EXT-X-CUE tag as defined in [Adobe-Primetime] "SCTE-35 Mode". In this mode, Azure Media Services will embed base64-encoded [SCTE-35] splice_info_section() in the EXT-X-CUE tag.  

The "legacy" EXT-X-CUE tag is defined as below and also can be normative referenced in the [Adobe-Primetime] specification. This should only be used for legacy SCTE35 signaling where needed, otherwise the recommended tag is defined in [RFC8216] as EXT-X-DATERANGE. 

| **Attribute Name** | **Type**                      | **Required?**                             | **Description**                                                                                                                                                                                                                                                                          |
| ------------------ | ----------------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CUE                | quoted string                 | Required                                  | The message encoded as a base64-encoded string as described in [RFC4648]. For [SCTE-35] messages, this is the base64-encoded splice_info_section().                                                                                                                                      |
| TYPE               | quoted string                 | Required                                  | A URN or URL identifying the message scheme. For [SCTE-35] messages, the type takes the special value "scte35".                                                                                                                                                                          |
| ID                 | quoted string                 | Required                                  | A unique identifier for the event. If the ID is not specified when the message is ingested, Azure Media Services will generate a unique id.                                                                                                                                              |
| DURATION           | decimal floating point number | Required                                  | The duration of the event. If unknown, the value **SHOULD** be 0. Units are factional seconds.                                                                                                                                                                                           |
| ELAPSED            | decimal floating point number | Optional, but Required for sliding window | When the signal is being repeated to support a sliding presentation window, this field **MUST** be the amount of presentation time that has elapsed since the event began. Units are fractional seconds. This value may exceed the original specified duration of the splice or segment. |
| TIME               | decimal floating point number | Required                                  | The presentation time of the event. Units are fractional seconds.                                                                                                                                                                                                                        |


The HLS player application layer will use the TYPE to identify the format of the message, decode the message, apply the necessary time conversions, and process the event.  The events are time synchronized in the segment playlist of the parent track, according to the event timestamp.  They are inserted before the nearest segment (#EXTINF tag).

### 3.2.3 HLS .m3u8 manifest example using "Legacy" Adobe Primetime EXT-X-CUE

The following example shows HLS manifest decoration using the Adobe Primetime EXT-X-CUE tag.  The "CUE" parameter contains only the TYPE and Duration properties which means that this was an RTMP source using Adobe "simple" mode signaling.  If this was a SCTE-35 mode signal, the tag would include the base64 encoded binary SCTE-35 payload as seen in the [3.2.1.1 example](#3211-example-hls-manifest-m3u8-showing-ext-x-daterange-signaling-of-scte-35).

~~~
#EXTM3U
#EXT-X-VERSION:4
#EXT-X-PLAYLIST-TYPE:VOD
#EXT-X-ALLOW-CACHE:NO
#EXT-X-MEDIA-SEQUENCE:0
#EXT-X-TARGETDURATION:11
#EXT-X-PROGRAM-DATE-TIME:2019-12-10T09:18:14Z
#EXTINF:10.010000,no-desc
Fragments(video=4011540820,format=m3u8-aapl)
#EXTINF:10.010000,no-desc
Fragments(video=4011550830,format=m3u8-aapl)
#EXTINF:10.010000,no-desc
Fragments(video=4011560840,format=m3u8-aapl)
#EXT-X-CUE:ID=4011578265,TYPE="SpliceOut",DURATION=119.987000,TIME=4011578.265000
#EXTINF:8.008000,no-desc
Fragments(video=4011570850,format=m3u8-aapl)
#EXT-X-CUE:ID=4011578265,TYPE="SpliceOut",DURATION=119.987000,TIME=4011578.265000,ELAPSED=0.593000
#EXTINF:4.170000,no-desc
Fragments(video=4011578858,format=m3u8-aapl)
#EXT-X-CUE:ID=4011578265,TYPE="SpliceOut",DURATION=119.987000,TIME=4011578.265000,ELAPSED=4.763000
#EXTINF:9.844000,no-desc
Fragments(video=4011583028,format=m3u8-aapl)
#EXT-X-CUE:ID=4011578265,TYPE="SpliceOut",DURATION=119.987000,TIME=4011578.265000,ELAPSED=14.607000
#EXTINF:10.010000,no-desc
Fragments(video=4011592872,format=m3u8-aapl)
#EXT-X-CUE:ID=4011578265,TYPE="SpliceOut",DURATION=119.987000,TIME=4011578.265000,ELAPSED=24.617000
#EXTINF:10.010000,no-desc
Fragments(video=4011602882,format=m3u8-aapl)
#EXT-X-CUE:ID=4011578265,TYPE="SpliceOut",DURATION=119.987000,TIME=4011578.265000,ELAPSED=34.627000
#EXTINF:10.010000,no-desc
Fragments(video=4011612892,format=m3u8-aapl)
#EXT-X-CUE:ID=4011578265,TYPE="SpliceOut",DURATION=119.987000,TIME=4011578.265000,ELAPSED=44.637000
#EXTINF:10.010000,no-desc
Fragments(video=4011622902,format=m3u8-aapl)
#EXT-X-CUE:ID=4011578265,TYPE="SpliceOut",DURATION=119.987000,TIME=4011578.265000,ELAPSED=54.647000
#EXTINF:10.010000,no-desc
Fragments(video=4011632912,format=m3u8-aapl)
#EXT-X-CUE:ID=4011578265,TYPE="SpliceOut",DURATION=119.987000,TIME=4011578.265000,ELAPSED=64.657000
#EXTINF:10.010000,no-desc
Fragments(video=4011642922,format=m3u8-aapl)
#EXT-X-CUE:ID=4011578265,TYPE="SpliceOut",DURATION=119.987000,TIME=4011578.265000,ELAPSED=74.667000
#EXTINF:10.010000,no-desc
Fragments(video=4011652932,format=m3u8-aapl)
#EXT-X-CUE:ID=4011578265,TYPE="SpliceOut",DURATION=119.987000,TIME=4011578.265000,ELAPSED=84.677000
#EXTINF:10.010000,no-desc
Fragments(video=4011662942,format=m3u8-aapl)
#EXT-X-CUE:ID=4011578265,TYPE="SpliceOut",DURATION=119.987000,TIME=4011578.265000,ELAPSED=94.687000
#EXTINF:10.010000,no-desc
Fragments(video=4011672952,format=m3u8-aapl)
#EXT-X-CUE:ID=4011578265,TYPE="SpliceOut",DURATION=119.987000,TIME=4011578.265000,ELAPSED=104.697000
#EXTINF:10.010000,no-desc
Fragments(video=4011682962,format=m3u8-aapl)
#EXT-X-CUE:ID=4011578265,TYPE="SpliceOut",DURATION=119.987000,TIME=4011578.265000,ELAPSED=114.707000
#EXTINF:10.010000,no-desc
Fragments(video=4011692972,format=m3u8-aapl)
#EXTINF:8.008000,no-desc
Fragments(video=4011702982,format=m3u8-aapl)

~~~

### 3.2.4 HLS Message Handling for "Legacy" Adobe Primetime EXT-X-CUE

Events are signaled in the segment playlist of each video and audio track. The
position of the EXT-X-CUE tag **MUST** always be either immediately before the first
HLS segment (for splice out or segment start) or immediately after the last HLS
segment (for splice in or segment end) to which its TIME and DURATION
attributes refer, as required by [Adobe-Primetime].

When a sliding presentation window is enabled, the EXT-X-CUE tag **MUST** be
repeated often enough that the splice or segment is always fully described in
the segment playlist, and the ELAPSED attribute **MUST** be used to indicate the
amount of time the splice or segment has been active, as required by [Adobe-Primetime].

When a sliding presentation window is enabled, the EXT-X-CUE tags are removed
from the segment playlist when the media time that they refer to has rolled out
of the sliding presentation window.

## 3.3 DASH Manifest Decoration (MPD)

[MPEGDASH] provides three ways to signal events:

1.  Events signaled in the MPD EventStream
2.  Events signaled in-band using the Event Message Box ('emsg')
3.  A combination of both 1 and 2

Events signaled in the MPD EventStream are useful for VOD streaming because clients have
access to all the events, immediately when the MPD is downloaded. It is also useful for SSAI signaling, where the downstream SSAI vendor needs to parse the signals from a multi-period MPD manifest, and insert ad content dynamically.  The in-band ('emsg')solution is useful for live streaming where clients do not need to download the MPD again, or there is no SSAI manifest manipulation happening between the client and the origin. 

Azure Media Services default behavior for DASH is to signal both in the MPD EventStream and in-band using the Event Message Box ('emsg').

Cue messages ingested over [RTMP] or [MS-SSTR-Ingest] are mapped into DASH events, using in-band 'emsg' boxes and/or in-MPD EventStreams. 

In-band SCTE-35 signaling for DASH follows the definition and requirements defined in [SCTE-214-3] and also in [DASH-IF-IOP] section 13.12.2 ('SCTE35 Events'). 

For in-band [SCTE-35] carriage, the Event Message box ('emsg') uses the schemeId = "urn:scte:scte35:2013:bin". 
For MPD manifest decoration the EventStream schemeId uses "urn:scte:scte35:2014:xml+bin".  This format is an XML representation of the event which includes a binary base64-encoded output of the complete SCTE-35 message that arrived at ingest. 

Normative reference definitions of carriage of [SCTE-35] cue messages in DASH are available in [SCTE-214-1] sec 6.7.4 (MPD) and [SCTE-214-3] sec 7.3.2 (Carriage of SCTE 35 cue messages).

### 3.3.1 MPEG DASH (MPD) EventStream Signaling

Manifest (MPD) decoration of events will be signaled in the MPD using the EventStream element, which appears within the Period element. The schemeId used is "urn:scte:scte35:2014:xml+bin".

> [!NOTE]
> For brevity purposes [SCTE-35] allows use of the base64-encoded section in Signal.Binary element (rather than the
> Signal.SpliceInfoSection element) as an alternative to
> carriage of a completely parsed cue message.
> Azure Media Services uses this 'xml+bin' approach to signaling in the MPD manifest.
> This is also the recommended method used in the [DASH-IF-IOP] - see section titled ['Ad insertion event streams' of the DASH IF IOP guideline](https://dashif-documents.azurewebsites.net/DASH-IF-IOP/master/DASH-IF-IOP.html#ads-insertion-event-streams)
> 

The EventStream element has the following attributes:

| **Attribute Name** | **Type**                | **Required?** | **Description**                                                                                                                                                                                                                                                                                                                                                                         |
| ------------------ | ----------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| scheme_id_uri      | string                  | Required      | Identifies the scheme of the message. The scheme is set to the value of the Scheme attribute in the Live Server Manifest box. The value **SHOULD** be a URN or URL identifying the message scheme; The supported output schemeId should be "urn:scte:scte35:2014:xml+bin" per [SCTE-214-1] sec 6.7.4 (MPD), as the service supports only "xml+bin" at this time for brevity in the MPD. |
| value              | string                  | Optional      | An additional string value used by the owners of the scheme to customize the semantics of the message. In order to differentiate multiple event streams with the same scheme, the value **MUST** be set to the name of the event stream (trackName for [MS-SSTR-Ingest] or AMF message name for [RTMP] ingest).                                                                         |
| Timescale          | 32-bit unsigned integer | Required      | The timescale, in ticks per second.                                                                                                                                                                                                                                                                                                                                                     |


### 3.3.2 Example Event Streams for MPEG DASH

#### 3.3.2.1 Example MPEG DASH .mpd manifest signaling of RTMP streaming using Adobe simple mode

The following example shows an excerpt EventStream from the Media Services dynamic packager for an RTMP stream using Adobe "simple" mode signaling.

~~~ xml
<!-- Example EventStream element using "urn:com:adobe:dpi:simple:2015" Adobe simple signaling per [Adobe-Primetime] -->
    <EventStream schemeIdUri="urn:com:adobe:dpi:simple:2015" value="simplesignal" timescale="10000000">
        <Event presentationTime="1583497601000000" duration="300000000" id="1085900"/>
        <Event presentationTime="1583500901666666" duration="300000000" id="1415966"/>
        <Event presentationTime="1583504202333333" duration="300000000" id="1746033"/>
        <Event presentationTime="1583507502666666" duration="300000000" id="2076066"/>
        <Event presentationTime="1583510803333333" duration="300000000" id="2406133"/>
        <Event presentationTime="1583514104000000" duration="300000000" id="2736200"/>
        <Event presentationTime="1583517404666666" duration="300000000" id="3066266"/>
        <Event presentationTime="1583520705333333" duration="300000000" id="3396333"/>
        <Event presentationTime="1583524006000000" duration="300000000" id="3726400"/>
        <Event presentationTime="1583527306666666" duration="300000000" id="4056466"/>
        <Event presentationTime="1583530607333333" duration="300000000" id="4386533"/>
    </EventStream>
~~~

#### 3.3.2.2 Example MPEG DASH .mpd manifest signaling of an RTMP stream using Adobe SCTE-35 mode

The following example shows an excerpt EventStream from the Media Services dynamic packager for an RTMP stream using Adobe SCTE-35 mode signaling.

~~~ xml
<!-- Example EventStream element using xml+bin style signaling per [SCTE-214-1] -->

      <EventStream schemeIdUri="urn:scte:scte35:2014:xml+bin" value="scte35" timescale="10000000">
        <Event presentationTime="2595092444" duration="11011000" id="1002">
            <Signal xmlns="http://www.scte.org/schemas/35/2016">
                <Binary>/DAlAAAAAAXdAP/wFAUAAAPqf+/+AWRhuP4AUmNjAAEBAQAA8g1eNw==</Binary>
            </Signal>
        </Event>
        <Event presentationTime="2606103444" id="1002">
            <Signal xmlns="http://www.scte.org/schemas/35/2016">
                <Binary>/DAgAAAAAAXdAP/wDwUAAAPqf0/+AWXk0wABAQEAAGB86Fo=</Binary>
            </Signal>
        </Event>
      </EventStream>
~~~

> [!IMPORTANT]
> Note that presentationTime is the presentation time of the [SCTE-35] event translated to be relative to the Period Start time, not the arrival time of the message.
> [MPEGDASH] defines the Event@presentationTime as "Specifies the presentation time of the event relative to the start of the Period.
> The value of the presentation time in seconds is the division of the value of this attribute and the value of the EventStream@timescale attribute.
> If not present, the value of the presentation time is 0.

#### 3.3.3.1 Example MPEG DASH manifest (MPD) with single-period, EventStream, using Adobe simple mode signals

The following example shows the output from the Media Services dynamic packager for a source RTMP stream using the Adobe "simple" mode ad signal method. The output is a single period manifest showing an EventStream using the schemeId Uri set to "urn:com:adobe:dpi:simple:2015" and value property set to "simplesignal".
Each simple signal is provided in an Event element with the @presentationTime, @duration, and @id properties populated based on the incoming simple signals.

~~~ xml
<?xml version="1.0" encoding="utf-8"?>
<MPD xmlns="urn:mpeg:dash:schema:mpd:2011" 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" profiles="urn:mpeg:dash:profile:isoff-live:2011" type="static" mediaPresentationDuration="PT28M1.680S" minBufferTime="PT3S">
    <Period>
        <EventStream schemeIdUri="urn:com:adobe:dpi:simple:2015" value="simplesignal" timescale="1000">
            <Event presentationTime="4011578265" duration="119987" id="4011578265"/>
        </EventStream>
        <AdaptationSet id="1" group="1" profiles="ccff" bitstreamSwitching="false" segmentAlignment="true" contentType="video" mimeType="video/mp4" codecs="avc1.4D4028" maxWidth="1920" maxHeight="1080" startWithSAP="1">
            <InbandEventStream schemeIdUri="urn:com:adobe:dpi:simple:2015" value="simplesignal"/>
            <ProducerReferenceTime id="4011460740" type="0" wallClockTime="2020-01-25T19:35:54.740Z" presentationTime="4011460740"/>
            <SegmentTemplate timescale="1000" presentationTimeOffset="4011460740" media="QualityLevels($Bandwidth$)/Fragments(video=$Time$,format=mpd-time-csf)" initialization="QualityLevels($Bandwidth$)/Fragments(video=i,format=mpd-time-csf)">
                <SegmentTimeline>
                    <S t="4011460740" d="2002" r="57"/>
                    <S d="1401"/>
                    <S d="601"/>
                    <S d="2002"/>

                     <!--> ... video segments truncated for sample brevity </-->

                </SegmentTimeline>
            </SegmentTemplate>
            <Representation id="1_V_video_14759481473095519504" bandwidth="6000000" width="1920" height="1080"/>
            <Representation id="1_V_video_1516803357996956148" bandwidth="4000000" codecs="avc1.4D401F" width="1280" height="720"/>
            <Representation id="1_V_video_5430608182379669372" bandwidth="2600000" codecs="avc1.4D401F" width="960" height="540"/>
            <Representation id="1_V_video_3780180650986497347" bandwidth="1000000" codecs="avc1.4D401E" width="640" height="360"/>
            <Representation id="1_V_video_13759117363700265707" bandwidth="699000" codecs="avc1.4D4015" width="480" height="270"/>
            <Representation id="1_V_video_6140004908920393176" bandwidth="400000" codecs="avc1.4D4015" width="480" height="270"/>
            <Representation id="1_V_video_10673801877453424365" bandwidth="200000" codecs="avc1.4D400D" width="320" height="180"/>
        </AdaptationSet>
        <AdaptationSet id="2" group="5" profiles="ccff" bitstreamSwitching="false" segmentAlignment="true" contentType="audio" mimeType="audio/mp4" codecs="mp4a.40.2">
            <InbandEventStream schemeIdUri="urn:com:adobe:dpi:simple:2015" value="simplesignal"/>
            <ProducerReferenceTime id="4011460761" type="0" wallClockTime="2020-01-25T19:35:54.761Z" presentationTime="4011460761"/>
            <Label>audio</Label>
            <SegmentTemplate timescale="1000" presentationTimeOffset="4011460740" media="QualityLevels($Bandwidth$)/Fragments(audio=$Time$,format=mpd-time-csf)" initialization="QualityLevels($Bandwidth$)/Fragments(audio=i,format=mpd-time-csf)">
                <SegmentTimeline>
                    <S t="4011460761" d="1984"/>
                    <S d="2005" r="1"/>
                    <S d="2006"/>

                    <!--> ... audio segments truncated for example brevity </-->

                </SegmentTimeline>
            </SegmentTemplate>
            <Representation id="5_A_audio_17504386117102112482" bandwidth="128000" audioSamplingRate="48000"/>
        </AdaptationSet>
    </Period>
</MPD>

~~~

#### 3.3.3.2 Example MPEG DASH manifest (MPD) with multi-period, EventStream, using Adobe SCTE35 mode signaling

The following example shows the output from the Media Services dynamic packager for a source RTMP stream using the Adobe SCTE35 mode signaling.
In this case, the output manifest is a multi-period DASH .mpd with an EventStream element, and @schemeIdUri property set to "urn:scte:scte35:2014:xml+bin" and a @value property set to "scte35". Each Event element in the EventStream contains the full base64 encoded binary SCTE35 signal 

~~~ xml
<?xml version="1.0" encoding="utf-8"?>
<MPD xmlns="urn:mpeg:dash:schema:mpd:2011" 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" profiles="urn:mpeg:dash:profile:isoff-live:2011" type="dynamic" publishTime="2020-01-07T19:42:44Z" minimumUpdatePeriod="PT0S" timeShiftBufferDepth="PT58M56S" availabilityStartTime="2020-01-07T19:40:50Z" minBufferTime="PT4S">
    <Period start="PT2M48.168S" id="main-content_0">
        <AdaptationSet id="1" group="1" profiles="ccff" bitstreamSwitching="false" segmentAlignment="true" contentType="video" mimeType="video/mp4" codecs="avc1.640020" maxWidth="1280" maxHeight="720" startWithSAP="1">
            <InbandEventStream schemeIdUri="urn:mpeg:dash:event:2012" value="1"/>
            <InbandEventStream schemeIdUri="urn:com:adobe:dpi:simple:2015" value="amssignal"/>
            <SegmentTemplate timescale="90000" presentationTimeOffset="15135120" media="QualityLevels($Bandwidth$)/Fragments(video=$Time$,format=mpd-time-csf)" initialization="QualityLevels($Bandwidth$)/Fragments(video=i,format=mpd-time-csf)">
                <SegmentTimeline>
                    <S t="15135120" d="135135" r="59"/>
                    <S d="111111"/>
                    <S d="1502"/>
                </SegmentTimeline>
            </SegmentTemplate>
            <ProducerReferenceTime id="15135120" type="0" wallClockTime="2020-01-07T19:40:50Z" presentationTime="15135120"/>
            <Representation id="1_V_video_5322324134428436312" bandwidth="3500000" width="1280" height="720"/>
            <Representation id="1_V_video_16981495139092747609" bandwidth="2200000" width="960" height="540"/>
            <Representation id="1_V_video_1384718563016940751" bandwidth="1350000" codecs="avc1.64001F" width="704" height="396"/>
            <Representation id="1_V_video_4425970933904124207" bandwidth="850000" codecs="avc1.64001E" width="512" height="288"/>
            <Representation id="1_V_video_11952982975776937431" bandwidth="550000" codecs="avc1.640016" width="384" height="216"/>
            <Representation id="1_V_video_10673801877453424365" bandwidth="200000" codecs="avc1.640015" width="340" height="192"/>
        </AdaptationSet>
        <AdaptationSet id="2" group="5" profiles="ccff" bitstreamSwitching="false" segmentAlignment="true" contentType="audio" mimeType="audio/mp4" codecs="mp4a.40.5" lang="en">
            <InbandEventStream schemeIdUri="urn:mpeg:dash:event:2012" value="1"/>
            <InbandEventStream schemeIdUri="urn:com:adobe:dpi:simple:2015" value="amssignal"/>
            <Label>audio</Label>
            <SegmentTemplate timescale="44100" presentationTimeOffset="7416208" media="QualityLevels($Bandwidth$)/Fragments(audio=$Time$,format=mpd-time-csf)" initialization="QualityLevels($Bandwidth$)/Fragments(audio=i,format=mpd-time-csf)">
                <SegmentTimeline>
                    <S t="7417856" d="133120"/>
                    <S d="132096" r="1"/>
                    
                    <!--> ... aduio segments truncated for sample brevity </-->

                </SegmentTimeline>
            </SegmentTemplate>
            <ProducerReferenceTime id="7417856" type="0" wallClockTime="2020-01-07T19:40:50.037Z" presentationTime="7417856"/>
            <Representation id="5_A_audio_17504386117102112482" bandwidth="128000" audioSamplingRate="44100"/>
        </AdaptationSet>
    </Period>
    <Period start="PT4M19.509S" id="scte-35_0">
        <EventStream schemeIdUri="urn:scte:scte35:2014:xml+bin" value="scte35" timescale="10000000">
            <Event presentationTime="2595092444" duration="11011000" id="1002">
                <Signal xmlns="http://www.scte.org/schemas/35/2016">
                    <Binary>/DAlAAAAAAXdAP/wFAUAAAPqf+/+AWRhuP4AUmNjAAEBAQAA8g1eNw==</Binary>
                </Signal>
            </Event>
            <Event presentationTime="2606103444" id="1002">
                <Signal xmlns="http://www.scte.org/schemas/35/2016">
                    <Binary>/DAgAAAAAAXdAP/wDwUAAAPqf0/+AWXk0wABAQEAAGB86Fo=</Binary>
                </Signal>
            </Event>
        </EventStream>
        <AdaptationSet id="1" group="1" profiles="ccff" bitstreamSwitching="false" segmentAlignment="true" contentType="video" mimeType="video/mp4" codecs="avc1.640020" maxWidth="1280" maxHeight="720" startWithSAP="1">
            <InbandEventStream schemeIdUri="urn:mpeg:dash:event:2012" value="1"/>
            <InbandEventStream schemeIdUri="urn:com:adobe:dpi:simple:2015" value="amssignal"/>
            <SegmentTemplate timescale="90000" presentationTimeOffset="23355832" media="QualityLevels($Bandwidth$)/Fragments(video=$Time$,format=mpd-time-csf)" initialization="QualityLevels($Bandwidth$)/Fragments(video=i,format=mpd-time-csf)">
                <SegmentTimeline>
                    <S t="23355833" d="22522"/>
                    <S d="76577"/>
                </SegmentTimeline>
            </SegmentTemplate>
            <ProducerReferenceTime id="23355833" type="0" wallClockTime="2020-01-07T19:42:21.341Z" presentationTime="23355833"/>
            <Representation id="1_V_video_5322324134428436312" bandwidth="3500000" width="1280" height="720"/>
            <Representation id="1_V_video_16981495139092747609" bandwidth="2200000" width="960" height="540"/>
            <Representation id="1_V_video_1384718563016940751" bandwidth="1350000" codecs="avc1.64001F" width="704" height="396"/>
            <Representation id="1_V_video_4425970933904124207" bandwidth="850000" codecs="avc1.64001E" width="512" height="288"/>
            <Representation id="1_V_video_11952982975776937431" bandwidth="550000" codecs="avc1.640016" width="384" height="216"/>
            <Representation id="1_V_video_10673801877453424365" bandwidth="200000" codecs="avc1.640015" width="340" height="192"/>
        </AdaptationSet>
        <AdaptationSet id="2" group="5" profiles="ccff" bitstreamSwitching="false" segmentAlignment="true" contentType="audio" mimeType="audio/mp4" codecs="mp4a.40.5" lang="en">
            <InbandEventStream schemeIdUri="urn:mpeg:dash:event:2012" value="1"/>
            <InbandEventStream schemeIdUri="urn:com:adobe:dpi:simple:2015" value="amssignal"/>
            <Label>audio</Label>
            <SegmentTemplate timescale="44100" presentationTimeOffset="11444358" media="QualityLevels($Bandwidth$)/Fragments(audio=$Time$,format=mpd-time-csf)" initialization="QualityLevels($Bandwidth$)/Fragments(audio=i,format=mpd-time-csf)">
                <SegmentTimeline>
                    <S t="11446272" d="49152"/>
                </SegmentTimeline>
            </SegmentTemplate>
            <ProducerReferenceTime id="11446272" type="0" wallClockTime="2020-01-07T19:42:21.384Z" presentationTime="11446272"/>
            <Representation id="5_A_audio_17504386117102112482" bandwidth="128000" audioSamplingRate="44100"/>
        </AdaptationSet>
    </Period>
    <Period start="PT4M20.610S" id="main-content_1">
        <AdaptationSet id="1" group="1" profiles="ccff" bitstreamSwitching="false" segmentAlignment="true" contentType="video" mimeType="video/mp4" codecs="avc1.640020" maxWidth="1280" maxHeight="720" startWithSAP="1">
            <InbandEventStream schemeIdUri="urn:mpeg:dash:event:2012" value="1"/>
            <InbandEventStream schemeIdUri="urn:com:adobe:dpi:simple:2015" value="amssignal"/>
            <SegmentTemplate timescale="90000" presentationTimeOffset="23454931" media="QualityLevels($Bandwidth$)/Fragments(video=$Time$,format=mpd-time-csf)" initialization="QualityLevels($Bandwidth$)/Fragments(video=i,format=mpd-time-csf)">
                <SegmentTimeline>
                    <S t="23454932" d="58558"/>
                    <S d="4504"/>
                    <S d="130631"/>
                    <S d="135135" r="12"/>
                </SegmentTimeline>
            </SegmentTemplate>
            <ProducerReferenceTime id="23454932" type="0" wallClockTime="2020-01-07T19:42:22.442Z" presentationTime="23454932"/>
            <Representation id="1_V_video_5322324134428436312" bandwidth="3500000" width="1280" height="720"/>
            <Representation id="1_V_video_16981495139092747609" bandwidth="2200000" width="960" height="540"/>
            <Representation id="1_V_video_1384718563016940751" bandwidth="1350000" codecs="avc1.64001F" width="704" height="396"/>
            <Representation id="1_V_video_4425970933904124207" bandwidth="850000" codecs="avc1.64001E" width="512" height="288"/>
            <Representation id="1_V_video_11952982975776937431" bandwidth="550000" codecs="avc1.640016" width="384" height="216"/>
            <Representation id="1_V_video_10673801877453424365" bandwidth="200000" codecs="avc1.640015" width="340" height="192"/>
        </AdaptationSet>
        <AdaptationSet id="2" group="5" profiles="ccff" bitstreamSwitching="false" segmentAlignment="true" contentType="audio" mimeType="audio/mp4" codecs="mp4a.40.5" lang="en">
            <InbandEventStream schemeIdUri="urn:mpeg:dash:event:2012" value="1"/>
            <InbandEventStream schemeIdUri="urn:com:adobe:dpi:simple:2015" value="amssignal"/>
            <Label>audio</Label>
            <SegmentTemplate timescale="44100" presentationTimeOffset="11492916" media="QualityLevels($Bandwidth$)/Fragments(audio=$Time$,format=mpd-time-csf)" initialization="QualityLevels($Bandwidth$)/Fragments(audio=i,format=mpd-time-csf)">
                <SegmentTimeline>
                    <S t="11495424" d="28672"/>
                    <S d="1024"/>
                    <S d="131072"/>
                    <S d="132096"/>
                    <S d="133120"/>
                    <S d="132096" r="1"/>
                    <S d="133120"/>
                </SegmentTimeline>
            </SegmentTemplate>
            <ProducerReferenceTime id="11495424" type="0" wallClockTime="2020-01-07T19:42:22.499Z" presentationTime="11495424"/>
            <Representation id="5_A_audio_17504386117102112482" bandwidth="128000" audioSamplingRate="44100"/>
        </AdaptationSet>
    </Period>
</MPD>

~~~
### 3.3.4 MPEG DASH In-band Event Message Box Signaling

An in-band event stream requires the MPD to have an InbandEventStream element at the Adaptation Set level.  This element has a mandatory schemeIdUri attribute and optional timescale attribute, which also appear in the Event Message Box ('emsg').  Event message boxes with scheme identifiers that are not defined in the MPD **SHOULD** not be present.

For in-band [SCTE-35] carriage, signals **MUST** use the schemeId = "urn:scte:scte35:2013:bin".
Normative definitions of carriage of [SCTE-35] in-band messages are defined in [SCTE-214-3] sec 7.3.2 (Carriage of SCTE 35 cue messages).

The following details outline the specific values the client should expect in the 'emsg' in compliance with [SCTE-214-3]:

| **Field Name**          | **Field Type**          | **Required?** | **Description**                                                                                                                                                                                                                                                                                        |
| ----------------------- | ----------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| scheme_id_uri           | string                  | Required      | Identifies the scheme of the message. The scheme is set to the value of the Scheme attribute in the Live Server Manifest box. The value **MUST** be a URN identifying the message scheme. For [SCTE-35] messages, this **MUST** be "urn:scte:scte35:2013:bin" in compliance with [SCTE-214-3]          |
| Value                   | string                  | Required      | An additional string value used by the owners of the scheme to customize the semantics of the message. In order to differentiate multiple event streams with the same scheme, the value will be set to the name of the event stream (trackName for Smooth ingest or AMF message name for RTMP ingest). |
| Timescale               | 32-bit unsigned integer | Required      | The timescale, in ticks per second, of the times and duration fields within the 'emsg' box.                                                                                                                                                                                                            |
| Presentation_time_delta | 32-bit unsigned integer | Required      | The media presentation time delta of the presentation time of the event and the earliest presentation time in this segment. The presentation time and duration **SHOULD** align with Stream Access Points (SAP) of type 1 or 2, as defined in [ISO-14496-12] Annex I.                                  |
| event_duration          | 32-bit unsigned integer | Required      | The duration of the event, or 0xFFFFFFFF to indicate an unknown duration.                                                                                                                                                                                                                              |
| Id                      | 32-bit unsigned integer | Required      | Identifies this instance of the message. Messages with equivalent semantics shall have the same value. If the ID is not specified when the message is ingested, Azure Media Services will generate a unique id.                                                                                        |
| Message_data            | byte array              | Required      | The event message. For [SCTE-35] messages, the message data is the binary splice_info_section() in compliance with [SCTE-214-3]                                                                                                                                                                        |


#### Example InBandEvenStream entity for Adobe Simple mode
~~~ xml

      <InbandEventStream schemeIdUri="urn:com:adobe:dpi:simple:2015" value="amssignal"/>
~~~

### 3.3.5 DASH Message Handling

Events are signaled in-band, within the 'emsg' box, for both video and audio tracks.  The signaling occurs for all segment requests for which the presentation_time_delta is 15 seconds or less. 

When a sliding presentation window is enabled, event messages are removed from the MPD when the sum of the time and duration of the event message is less than the time of the media data in the manifest.  In other words, the event messages are removed from the manifest when the media time to which they refer has rolled out of the sliding presentation window.

## 4. SCTE-35 Ingest Implementation Guidance for Encoder Vendors

The following guidelines are common issues that can impact an encoder vendor's implementation of this specification.  The guidelines below have been collected based on real world partner feedback to make it easier to implement this specification for others. 

[SCTE-35] messages are ingested in binary format using the Scheme
**"urn:scte:scte35:2013:bin"** for [MS-SSTR-Ingest] and the type **"scte35"** for
[RTMP] ingest. To facilitate the conversion of [SCTE-35] timing, which is based on
MPEG-2 transport stream presentation time stamps (PTS), a mapping between PTS
(pts_time + pts_adjustment of the splice_time()) and the media timeline is
provided by the event presentation time (the fragment_absolute_time field for
Smooth ingest and the time field for RTMP ingest). The mapping is necessary because the
33-bit PTS value rolls over approximately every 26.5 hours.

Smooth Streaming ingest [MS-SSTR-Ingest] requires that the Media Data Box ('mdat') **MUST** contain the **splice_info_section()** defined in [SCTE-35]. 

For RTMP ingest,the cue attribute of the AMF message is set to the base64-encoded **splice_info_section()** defined in [SCTE-35].  

When the messages have the format described above, they are sent to HLS, Smooth, and DASH clients as defined above.  

When testing your implementation with the Azure Media Services platform, please start testing with a "pass-through" LiveEvent first, before moving to testing on an encoding LiveEvent.

---

## Change History

| Date     | Changes                                                                                                             |
| -------- | ------------------------------------------------------------------------------------------------------------------- |
| 07/2/19  | Revised RTMP ingest for SCTE35 support, added RTMP "onCuePoint" for Elemental Live                                  |
| 08/22/19 | Updated to add OnUserDataEvent to RTMP for custom metadata                                                          |
| 1/08/20  | Fixed error on RTMP Simple and RTMP SCTE35 mode. Changed from "onCuePoint" to "onAdCue". Updated Simple mode table. |

## Next steps
View Media Services learning paths.

[!INCLUDE [media-services-learning-paths-include](../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../includes/media-services-user-voice-include.md)]
