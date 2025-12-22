---
title: Azure Communication Services call diagnostics updates log schema
titleSuffix: An Azure Communication Services concept article
description: Learn about the voice and video call diagnostics updates logs.
author:  amagginetti
services: azure-communication-services

ms.author: amagginetti
ms.date: 02/04/2025
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: calling
---

# Call diagnostics updates log schema

The only difference in properties between the call diagnostics updates log schema and the [call diagnostics log schema](call-diagnostics-log-schema.md) is the additional `CallUpdatesVersion` property. The `CallUpdatesVersion` property indicates how recent the log is. The call diagnostics updates log schema has lower latency than the [call diagnostics log schema](call-diagnostics-log-schema.md), it achieves this low latency by sending schema properties as soon as they can be sent. In contrast, the [call diagnostics log schema](call-diagnostics-log-schema.md) does not send you a log schema until the entire log schema has completed internal Microsoft creation. 

The call diagnostics updates logs provide important information about the endpoints and the media transfers for each participant. They also provide measurements that help you understand quality problems.

For each `EndpointId` within a call (including the server), Azure Communication Services creates a distinct call diagnostics updates log for each media stream (audio or video, for example) between endpoints.
In a P2P call, each log contains data that relates to each of the outbound streams associated with each endpoint. In group calls, `participantId` serves as a key identifier to join the related outbound logs into a distinct participant connection. Call diagnostics updates logs remain intact and are the same regardless of the participant tenant.

## How to use call logs
We recommend you collect all available call logs in a log analytics resource so you can monitor your call usage and improve your call quality and receive new logs from Azure Communication Services as we release them.  

There are two main tools you can use to monitor your calls and improve call quality. 
- [Voice and video insights dashboard](../insights/voice-and-video-insights.md)
- [Call diagnostics](../../voice-video-calling/call-diagnostics.md)

We recommend using the **[voice and video insights dashboard](../insights/voice-and-video-insights.md)** dashboards to start 
any quality investigations, and using **[call diagnostics](../../voice-video-calling/call-diagnostics.md)** as needed to explore individual calls when you need granular detail.

## Data concepts

> [!IMPORTANT]
>You must collect logs if you want to analyze them. To learn more, see: **[How do I store logs?](#how-do-i-store-logs)**
>
>Azure doesn't store your call log data unless you enable these specific Diagnostic Settings. Your call data isn't retroactively available. You accumulate data once you create the Diagnostic Settings.

When using the Call Diagnostics Updates Log Schema, always refer to the highest `CallUpdatesVersion` number to ensure you have the most up-to-date information. Whenever call data is updated, a new version of the log is created containing the most up-to-date information. For example, the higher the `CallUpdatesVersion` number, the more recent the update. This means that version 3 is newer and includes more recent changes compared to version 1.

### More about log versions and data latency

The call diagnostics updates log schema may require approximately 60 minutes following the end of a call to propagate data, most logs may be available within 40 minutes. 

After a call ends, an initial version (version 1) of the log is sent to the CallSummaryUpdates and CallDiagnosticUpdates tables. Initial versions may contain `null` values, if more information becomes available updated versions of the logs are created with more complete information. For example, client data can be delayed because of network connectivity issues between the client computer and our servers, or something as simple as a user closing the lid on their laptop post-call before their client data was sent and re-opening it hours (or days) later. 


Because of to such collection variations, you might see incremental versions arrive hours or even days later. You can use versions for a faster understanding of your calling resource than waiting until all calling SDK client data is received. The best case scenario is for all call participants to end their calls and for the calling SDK to be able to send data to the server.


## Data definitions

### Call diagnostics updates log schema

This table describes each property.


| Property | Description |
|--- |--- |
| `operationName` | The operation associated with the log record. |
| `operationVersion` | The `api-version` value associated with the operation, if the `operationName` operation was performed through an API. If no API corresponds to this operation, the version represents the version of the operation, in case the properties associated with the operation change in the future. |
| `category` | The log category of the event. This property is the granularity at which you can enable or disable logs on a resource. The properties that appear within the `properties` blob of an event are the same within a log category and resource type. |
| `correlationId` | The unique ID for a call. It identifies correlated events from all of the participants and endpoints that connect during a single call. If you ever need to open a support case with Microsoft, you can use the `correlationId` value to easily identify the call that you're troubleshooting. |
| `participantId` | ID generated to represent the two-way connection between a `"Participant"` endpoint (`endpointType` =  `"Server"`) and the server. When `callType` = `"P2P"`, there's a direct connection between two endpoints, and no `participantId` value is generated. |
| `identifier` | The unique ID for the user. The identity can be an Azure Communication Services user, a Microsoft Entra user ID, a Teams object ID, or a Teams bot ID. You can use this ID to correlate user events across logs. |
| `endpointId` | The unique ID that represents each endpoint connected to the call, where `endpointType` defines the endpoint type. When the value is `null`, the connected entity is the Communication Services server. `EndpointId` can persist for the same user across multiple calls (`correlationId`) for native clients but is unique for every call when the client is a web browser. |
| `endpointType` | The value that describes the properties of each `endpointId` instance. It can contain  `"Server"`, `"VOIP"`, `"PSTN"`, `"BOT"`, `"Voicemail"`, `"Anonymous"`, or `"Unknown"`. |
| `mediaType` | The string value that describes the type of media that's being transmitted between endpoints within each stream. Possible values include `"Audio"`, `"Video"`, `"VBSS"` (screen sharing), and `"AppSharing"` (data channel).|
| `streamId` | A nonunique integer that, together with `mediaType`, you can use to uniquely identify streams of the same `participantId` value. |
| `transportType` | The string value that describes the network transport protocol for each `participantId` value. It can contain `"UDP"`, `"TCP"`, or `"Unrecognized"`. `"Unrecognized"` indicates that the system couldn't determine if the transport type was TCP or UDP. |
| `roundTripTimeAvg` | The average time that it takes to get an IP packet from one endpoint to another within a `participantDuration` period. This network propagation delay is related to the physical distance between the two points, the speed of light, and any overhead that the various routers take in between. <br><br>The latency is measured as one-way time or round-trip time (RTT). Its value expressed in milliseconds. An RTT greater than 500 ms is negatively affecting the call quality. |
| `roundTripTimeMax` | The maximum RTT (in milliseconds) measured fo reach media stream during a `participantDuration` period in a group call or during a `callDuration` period in a P2P call. |
| `jitterAvg` | The average change in delay between successive packets. Azure Communication Services can adapt to some levels of jitter through buffering. When the jitter exceeds the buffering, which is approximately at a `jitterAvg` time greater than 30 ms, it can negatively affect quality. The packets arriving at different speeds cause a speaker's voice to sound robotic. <br><br> This metric is measured for each media stream over the `participantDuration` period in a group call or over the `callDuration` period in a P2P call. |
| `jitterMax` | The maximum jitter value measured between packets for each media stream. Bursts in network conditions can cause problems in the audio/video traffic flow.  |
| `packetLossRateAvg` | The average percentage of packets that are lost. Packet loss directly affects audio quality. Small, individual lost packets have almost no impact, whereas back-to-back burst losses cause audio to cut out completely. The packets being dropped and not arriving at their intended destination cause gaps in the media. This situation results in missed syllables and words, along with choppy video and sharing. <br><br> A packet loss rate of greater than 10% (0.1) is likely having a negative quality impact. This metric is measured for each media stream over the `participantDuration` period in a group call or over the `callDuration` period in a P2P call.    |
| `packetLossRateMax` | This value represents the maximum packet loss rate (percentage) for each media stream over the `participantDuration` period in a group call or over the `callDuration` period in a P2P call. Bursts in network conditions can cause problems in the audio/video traffic flow. |
| `JitterBufferSizeAvg` | The average size of jitter buffer over the duration of each media stream. A jitter buffer is a shared data area where voice packets can be collected, stored, and sent to the voice processor in evenly spaced intervals. Jitter buffer is used to counter the effects of jitter. <br><br> Jitter buffers can be either static or dynamic. Static jitter buffers are set to a fixed size, while dynamic jitter buffers can adjust their size based on network conditions. The goal of the jitter buffer is to provide a smooth and uninterrupted stream of audio and video data to the user. <br><br> In the web SDK, this `JitterBufferSizeAvg` is the average value of the `jitterBufferDelay` during the call. The `jitterBufferDelay` is the duration of an audio sample or a video frame that stays in the jitter buffer. <br><br> Normally when `JitterBufferSizeAvg` value is greater than 200 ms, it negatively impacts quality. |
| `JitterBufferSizeMax` | The maximum jitter buffer size measured during the duration of each media stream.  <br><br> Normally when this value is greater than 200 ms, it negatively impacts quality. |
| `HealedDataRatioAvg` | The average percentage of lost or damaged data packets successfully reconstructed or recovered by the healer over the duration of audio stream. Healed data ratio is a measure of the effectiveness of error correction techniques used in VoIP systems.  <br><br> When this value is greater than 0.1 (10%), we consider the stream as bad quality. |
| `HealedDataRatioMax` | The maximum healed data ratio measured during the duration of each media stream. <br><br> When this value is greater than 0.1 (10%),  we consider the stream as bad quality. |
| `VideoFrameRateAvg` | The average number of video frames that are transmitted per second during a video/screensharing call. The video frame rate can impact the quality and smoothness of the video stream, with higher frame rates generally resulting in smoother and more fluid motion. The standard frame rate for WebRTC video is typically 30 frames per second (fps), although frame rate can vary depending on the specific implementation and network conditions. <br><br> The stream quality is considered poor when this value is less than 7 for video stream, or less than 1 for screen sharing stream. |
| `RecvResolutionHeight` | The average of vertical size of the incoming video stream that is transmitted during a video/screensharing call. It's measured in pixels and is one of the factors that determines the overall resolution and quality of the video stream. The specific resolution used may depend on the capabilities of the devices and network conditions involved in the call.  <br><br> The stream quality is considered poor when this value is less than 240 for video stream, or less than 768 for screen sharing stream. |
| `RecvFreezeDurationPerMinuteInMs` | The average freeze duration in milliseconds per minute for incoming video/screensharing stream. Freezes are typically due to bad network condition and can degrade the stream quality.  <br><br> The stream quality is considered poor when this value is greater than 6,000 ms for video stream, or greater than 25,000 ms for screen sharing stream. |
| `PacketUtilization` | The packets sent or received for a given media stream.  <br><br> Usually the longer the call, the higher the value is. If this value is zero, it could indicate that media is not flowing. |
| `VideoBitRateAvg` | The average bitrate (bits per second) for a video or screenshare stream.  <br><br> A low bitrate value could indicate poor network issue. The minimum bitrate (bandwidth) required can be found here: [Network bandwidth](../../voice-video-calling/network-requirements.md#network-bandwidth). |
| `VideoBitRateMax` | The maximum bitrate (bits per second) for a video or screenshare stream.  <br><br> A low bitrate value could indicate poor network issue. The minimum bitrate (bandwidth) required can be found here: [Network bandwidth](../../voice-video-calling/network-requirements.md#network-bandwidth). |
| `StreamDirection` | The direction of the media stream. It is either Inbound or Outbound. |
| `CodecName` | The name of the codec used for processing media streams. It can be OPUS, G722, H264S, SATIN, and so on. |
| `CallUpdatesVersion`| Represents the log version, with higher numbers indicating the most recently published version. |
| `TPE`| This value indicates that the call is associated with a Teams Phone extensibility scenario.|

## Sample data for various call types

> [!NOTE]
> In this article, P2P and group calls are within the same tenant by default. All call scenarios that are cross-tenant are specified accordingly throughout the article.

### P2P call 

Here are shared fields for all logs in a P2P call:

```json
"time":                     "2021-07-19T18:46:50.188Z",
"resourceId":               "SUBSCRIPTIONS/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/RESOURCEGROUPS/ACS-TEST-RG/PROVIDERS/MICROSOFT.COMMUNICATION/COMMUNICATIONSERVICES/ACS-PROD-CCTS-TESTS",
"correlationId":            "aaaa0000-bb11-2222-33cc-444444dddddd",
```

#### Call diagnostics Updates logs 

Call diagnostics updates logs share operation information:

```json
"operationName":            "CallDiagnostics",
"operationVersion":         "1.0",
"category":                 "CallDiagnostics",
```

Here's a diagnostics updates log for an audio stream from VoIP endpoint 1 to VoIP endpoint 2:

```json
"properties": {
    "identifier":           "acs:61fddbe3-0003-4066-97bc-6aaf143bbb84_0000000b-4fee-66cf-ac00-343a0d003158",
    "participantId":        "null",
    "endpointId":           "570ea078-74e9-4430-9c67-464ba1fa5859",
    "endpointType":         "VoIP",
    "mediaType":            "Audio",
    "streamId":             "1000",
    "transportType":        "UDP",
    "roundTripTimeAvg":     "82",
    "roundTripTimeMax":     "88",
    "jitterAvg":            "1",
    "jitterMax":            "1",
    "packetLossRateAvg":    "0",
    "packetLossRateMax":    "0"
    "callupdatesversion":   "2"
}
```

Here's a diagnostics updates log for an audio stream from VoIP endpoint 2 to VoIP endpoint 1:

```json
"properties": {
    "identifier":           "acs:7af14122-9ac7-4b81-80a8-4bf3582b42d0_06f9276d-8efe-4bdd-8c22-ebc5434903f0",
    "participantId":        "null",
    "endpointId":           "a5bd82f9-ac38-4f4a-a0fa-bb3467cdcc64",
    "endpointType":         "VoIP",
    "mediaType":            "Audio",
    "streamId":             "1363841599",
    "transportType":        "UDP",
    "roundTripTimeAvg":     "78",
    "roundTripTimeMax":     "84",
    "jitterAvg":            "1",
    "jitterMax":            "1",
    "packetLossRateAvg":    "0",
    "packetLossRateMax":    "0"
    "callupdatesversion":   "2"
}
```

Here's a diagnostics updates log for a video stream from VoIP endpoint 1 to VoIP endpoint 2:

```json
"properties": {
    "identifier":           "acs:61fddbe3-0003-4066-97bc-6aaf143bbb84_0000000b-4fee-66cf-ac00-343a0d003158",
    "participantId":        "null",
    "endpointId":           "570ea078-74e9-4430-9c67-464ba1fa5859",
    "endpointType":         "VoIP",
    "mediaType":            "Video",
    "streamId":             "2804",
    "transportType":        "UDP",
    "roundTripTimeAvg":     "103",
    "roundTripTimeMax":     "143",
    "jitterAvg":            "0",
    "jitterMax":            "4",
    "packetLossRateAvg":    "3.146336E-05",
    "packetLossRateMax":    "0.001769911"
    "callupdatesversion":   "2"
}
```

### Group call

Data for a group call is generated in three call summary logs and six call diagnostics updates logs. Here are shared fields for all logs in the call:

```json
"time":                     "2021-07-05T06:30:06.402Z",
"resourceId":               "SUBSCRIPTIONS/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/RESOURCEGROUPS/ACS-TEST-RG/PROVIDERS/MICROSOFT.COMMUNICATION/COMMUNICATIONSERVICES/ACS-PROD-CCTS-TESTS",
"correlationId":            "bbbb1111-cc22-3333-44dd-555555eeeeee",
```



#### Call diagnostics updates logs

Call diagnostics updates logs share operation information:

```json
"operationName":            "CallDiagnostics",
"operationVersion":         "1.0",
"category":                 "CallDiagnostics",
```

Here's a diagnostics updates log for an audio stream from VoIP endpoint 1 to a server endpoint:

```json
"properties": {
    "identifier":           "acs:1797dbb3-f982-47b0-b98e-6a76084454f1_0000000b-1531-729f-ac00-343a0d00d975",
    "participantId":        "04cc26f5-a86d-481c-b9f9-7a40be4d6fba",
    "endpointId":           "5ebd55df-ffff-ffff-89e6-4f3f0453b1a6",
    "endpointType":         "VoIP",
    "mediaType":            "Audio",
    "streamId":             "14884",
    "transportType":        "UDP",
    "roundTripTimeAvg":     "46",
    "roundTripTimeMax":     "48",
    "jitterAvg":            "0",
    "jitterMax":            "1",
    "packetLossRateAvg":    "0",
    "packetLossRateMax":    "0"
    "callupdatesversion":   "2"
}
```

Here's a diagnostics updates log for an audio stream from a server endpoint to VoIP endpoint 1:

```json
"properties": {
    "identifier":           null,
    "participantId":        "04cc26f5-a86d-481c-b9f9-7a40be4d6fba",
    "endpointId":           null,
    "endpointType":         "Server",
    "mediaType":            "Audio",
    "streamId":             "2001",
    "transportType":        "UDP",
    "roundTripTimeAvg":     "42",
    "roundTripTimeMax":     "44",
    "jitterAvg":            "1",
    "jitterMax":            "1",
    "packetLossRateAvg":    "0",
    "packetLossRateMax":    "0"
    "callupdatesversion":   "2"
}
```

Here's a diagnostics updates log for an audio stream from VoIP endpoint 3 to a server endpoint:

```json
"properties": {
    "identifier":           "acs:1797dbb3-f982-47b0-b98e-6a76084454f1_0000000b-1531-57c6-ac00-343a0d00d972",
    "participantId":        "1a9cb3d1-7898-4063-b3d2-26c1630ecf03",
    "endpointId":           "5ebd55df-ffff-ffff-ab89-19ff584890b7",
    "endpointType":         "VoIP",
    "mediaType":            "Audio",
    "streamId":             "13783",
    "transportType":        "UDP",
    "roundTripTimeAvg":     "45",
    "roundTripTimeMax":     "46",
    "jitterAvg":            "1",
    "jitterMax":            "2",
    "packetLossRateAvg":    "0",
    "packetLossRateMax":    "0"
    "callupdatesversion":   "2"
}
```

Here's a diagnostics updates log for an audio stream from a server endpoint to VoIP endpoint 3:

```json
"properties": {
    "identifier":           "null",
    "participantId":        "1a9cb3d1-7898-4063-b3d2-26c1630ecf03",
    "endpointId":           null,
    "endpointType":         "Server"    
    "mediaType":            "Audio",
    "streamId":             "1000",
    "transportType":        "UDP",
    "roundTripTimeAvg":     "45",
    "roundTripTimeMax":     "46",
    "jitterAvg":            "1",
    "jitterMax":            "4",
    "packetLossRateAvg":    "0",
    "callupdatesversion":   "2"
}
```

## Frequently asked questions

### How do I store logs?
The following section explains this requirement.

Azure Communication Services logs aren't stored in your Azure account by default so you need to begin storing them in order for tools like [voice and video insights dashboard](../insights/voice-and-video-insights.md) and [call diagnostics](../../voice-video-calling/call-diagnostics.md) to work. To collect these call logs, you need to enable a diagnostic setting that directs the call data to a Log Analytics workspace. 

**Data isn’t stored retroactively, so you begin capturing call logs only after configuring the diagnostic setting.**

Follow instructions to add diagnostic settings for your resource in [Enable logs via Diagnostic Settings in Azure Monitor](../enable-logging.md). We recommend that you initially **collect all logs**. After you understand the capabilities in Azure Monitor, determine which logs you want to retain and for how long. When you add your diagnostic setting, you're prompted to [select logs](../enable-logging.md#adding-a-diagnostic-setting). To collect **all logs**, select **allLogs**.

Your data volume, retention, and usage in Log Analytics within Azure Monitor is billed through existing Azure data meters. We recommend that you monitor your data usage and retention policies for cost considerations as needed. For more information, see [Controlling costs](/azure/azure-monitor/essentials/diagnostic-settings#controlling-costs).

If you have multiple Azure Communications Services resource IDs, you must enable these settings for each resource ID.  

## Next steps

- Review the overview of all voice and video logs, see: [Overview of Azure Communication Services call logs](voice-and-video-logs.md)

- Learn best practices to manage your call quality and reliability, see: [Improve and manage call quality](../../voice-video-calling/manage-call-quality.md)

- Learn about the [insights dashboard to monitor Voice Calling and Video Calling logs](/azure/communication-services/concepts/analytics/insights/voice-and-video-insights).

- Learn how to use call logs to diagnose call quality and reliability
  issues with Call Diagnostics, see: [Call Diagnostics](../../voice-video-calling/call-diagnostics.md)
