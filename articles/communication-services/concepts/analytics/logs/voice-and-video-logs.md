---
title: Azure Communication Services Voice Calling and Video Calling logs 
titleSuffix: An Azure Communication Services concept article
description: Learn about logging for Azure Communication Services Voice Calling and Video Calling.
author:  mkhribech
services: azure-communication-services

ms.author: mkhribech
ms.date: 03/21/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: calling
---

# Azure Communication Services Voice Calling and Video Calling logs

Azure Communication Services offers logging capabilities that you can use to monitor and debug your Communication Services solution. You configure these capabilities through the Azure portal.

The content in this article refers to logs enabled through [Azure Monitor](../../../../azure-monitor/overview.md) (see also [FAQ](../../../../azure-monitor/overview.md#frequently-asked-questions)). To enable these logs for Communication Services, see [Enable logging in diagnostic settings](../enable-logging.md).

## Data concepts

The following high-level descriptions of data concepts are specific to Voice Calling and Video Calling. These concepts are important to review so that you can understand the meaning of the data captured in the logs.

### Entities and IDs

Become familiar with the following terms:

- **Call**: As represented in the data, a call is an abstraction that's depicted by `correlationId`. Values for `correlationId` are unique for each call, and they're time-bound by `callStartTime` and `callDuration`.

- **Participant**: This entity represents the connection between an endpoint and the server. A participant (`participantId`) is present only when the call is a group call.

- **Endpoint**: This is the most unique entity, represented by `endpointId`. Every call is an event that contains data from two or more endpoints. Endpoints represent the participants in the call.

  `EndpointType` tells you whether the endpoint is a human user (PSTN or VoIP), a bot, or the server that's managing multiple participants within a call. When an `endpointType` value is `"Server"`, the endpoint is not assigned a unique ID. You can analyze `endpointType` and the number of `endpointId` values to determine how many users and other nonhuman participants (bots and servers) join a call.

  Native SDKs for Android and iOS reuse the same `endpointId` value for a user across multiple calls, so you can get an understanding of experiences across sessions. This process differs from web-based endpoints, which always generate a new `endpointId` value for each new call.

- **Stream**: This is the most granular entity. There's one stream for each direction (inbound or outbound) and `mediaType` value (for example, `Audio` or `Video`).  

## Data definitions

### Usage log schema

| Property | Description |
| -------- | ---------------|
| `Timestamp` | The time stamp (UTC) of when the log was generated. |
| `Operation Name` | The operation associated with the log record. |
| `Operation Version` | The `api-version` value associated with the operation, if the `Operation Name` operation was performed through an API. If no API corresponds to this operation, the version represents the version of the operation, in case the properties associated with the operation change in the future. |
| `Category` | The log category of the event. The category is the granularity at which you can enable or disable logs on a resource. The properties that appear within the `properties` blob of an event are the same within a log category and resource type. |
| `Correlation ID` | The ID for correlated events. You can use it to identify correlated events between multiple tables. |
| `Properties` | Other data that's applicable to various modes of Communication Services. |
| `Record ID` | The unique ID for a usage record. |
| `Usage Type` | The mode of usage (for example, Chat, PSTN, or NAT). |
| `Unit Type` | The type of unit that usage is based on for a mode of usage (for example, minutes, megabytes, or messages). |
| `Quantity` | The number of units used or consumed for this record. |

### Call summary log schema

The call summary log contains data to help you identify key properties of all calls. A different call summary log is created for each `participantId` (`endpointId` in the case of peer-to-peer [P2P] calls) value in the call.

> [!IMPORTANT]
> Participant information in the call summary log varies based on the participant tenant. The SDK version and OS version are redacted if the participant is not within the same tenant (also called *cross-tenant*) as the Communication Services resource. Cross-tenant participants are classified as external users invited by a resource tenant to join and collaborate during a call.

|     Property                  |       Description                  |
|-------------------------------|-------------------------|
|     `time`                      |     The time stamp (UTC) of when the log was generated.     |
|     `operationName`             |     The operation associated with the log record.                |
|     `operationVersion`          |     The `api-version` value associated with the operation, if the `operationName` operation was performed through an API. If no API corresponds to this operation, the version represents the version of the operation, in case the properties associated with the operation change in the future.                                                   |
|     `category`                  |     The log category of the event. This property is the granularity at which you can enable or disable logs on a resource. The properties that appear within the `properties` blob of an event are the same within a log category and resource type.   |
|     `correlationId`     |    The unique ID for a call. It identifies correlated events from all of the participants and endpoints that connect during a single call, and you can use it to join data from different logs. If you ever need to open a support case with Microsoft, you can use the `correlationId` value to easily identify the call that you're troubleshooting.                                                                                                                                                                      |
|     `identifier`                |     The unique ID for the user. The identity can be an Azure Communication Services user, a Microsoft Entra user ID, a Teams anonymous user ID, or a Teams bot ID. You can use this ID to correlate user events across logs.                  |
|     `callStartTime`             |     A time stamp for the start of the call, based on the first attempted connection from any endpoint.                                                  |
|     `callDuration`              |     The duration of the call, expressed in seconds. It's based on the first attempted connection and the end of the last connection between two endpoints.               |
|     `callType`                  |     The type of the call. It contains either `"P2P"` or `"Group"`. A `"P2P"` call is a direct 1:1 connection between only two, non-server endpoints. A `"Group"` call is a call that has more than two endpoints or is created as `"Group"` call before the connection.                  |
|     `teamsThreadId`             |     The Teams thread ID. This ID is relevant only when the call is organized as a Teams meeting. It then represents the use case of interoperability between Microsoft Teams and Azure Communication Services. <br><br>This ID is exposed in operational logs. You can also get this ID through the Chat APIs.   |
|     `participantId`             |     The ID that's generated to represent the two-way connection between a `"Participant"` endpoint (`endpointType` = `"Server"`) and the server. When `callType` = `"P2P"`, there's a direct connection between two endpoints, and no `participantId` value is generated.       |
|     `participantStartTime`      |     The time stamp for the beginning of the participant's first connection attempt.                                                                                 |
|     `participantDuration`       |     The duration of each participant connection in seconds, from `participantStartTime` to the time stamp when the connection ended.                                 |
|     `participantEndReason`      |     The reason for the end of a participant connection. It contains Calling SDK error codes that the SDK emits (when relevant) for each `participantId` value.            |
|     `endpointId`                |     The unique ID that represents each endpoint connected to the call, where `endpointType` defines the endpoint type. When the value is `null`, the connected entity is the Communication Services server (`endpointType` = `"Server"`). <br><br>The `endpointId` value can sometimes persist for the same user across multiple calls (`correlationId`) for native clients. The number of `endpointId` values determines the number of call summary logs. A distinct summary log is created for each `endpointId` value.    |
|     `endpointType`              |     This value describes the properties of each endpoint that's connected to the call. It can contain `"Server"`, `"VOIP"`, `"PSTN"`, `"BOT"`, or `"Unknown"`.               |
|     `sdkVersion`                |     The version string for the Communication Services Calling SDK version that each relevant endpoint uses (for example, `"1.1.00.20212500"`).                                               |
|     `osVersion`                 |     A string that represents the operating system and version of each endpoint device.                                                                        |
|     `participantTenantId`               |    The ID of the Microsoft tenant associated with the identity of the participant. The tenant can either be the Azure tenant that owns the Azure Communication Services resource or the Microsoft tenant of an M365 identity. This field is used to guide cross-tenant redaction.
|`participantType` | 	Description of the participant as a combination of its client (Azure Communication Services or Teams), and its identity, (Azure Communication Services or Microsoft 365). Possible values include: Azure Communication Services (Azure Communication Services identity and Azure Communication Services SDK), Teams (Teams identity and Teams client), Azure Communication Services as Teams external user (Azure Communication Services identity and Azure Communication Services SDK in Teams call or meeting), Azure Communication Services as Microsoft 365 user (M365 identity and Azure Communication Services client), and Teams Voice Apps.
| `pstnPartcipantCallType `|It represents the type and direction of PSTN participants including Emergency calling, direct routing, transfer, forwarding, etc.| 

### Call diagnostic log schema

Call diagnostic logs provide important information about the endpoints and the media transfers for each participant. They also provide measurements that help you understand quality problems.

For each endpoint within a call, a distinct call diagnostic log is created for outbound media streams (audio or video, for example) between endpoints. In a P2P call, each log contains data that relates to each of the outbound streams associated with each endpoint. In group calls, `participantId` serves as a key identifier to join the related outbound logs into a distinct participant connection. Call diagnostic logs remain intact and are the same regardless of the participant tenant.

> [!NOTE]
> In this article, P2P and group calls are within the same tenant, by default, for all call scenarios that are cross-tenant. They're specified accordingly throughout the article.

|     Property              |     Description                     |
|---------------------------|-------------------------------------|
|     `operationName`         |     The operation associated with the log record.   |
|     `operationVersion`      |     The `api-version` value associated with the operation, if the `operationName` operation was performed through an API. If no API corresponds to this operation, the version represents the version of the operation, in case the properties associated with the operation change in the future.                                   |
|     `category`              |     The log category of the event. This property is the granularity at which you can enable or disable logs on a resource. The properties that appear within the `properties` blob of an event are the same within a log category and resource type.             |
|     `correlationId`     |     The unique ID for a call. It identifies correlated events from all of the participants and endpoints that connect during a single call. If you ever need to open a support case with Microsoft, you can use the `correlationId` value to easily identify the call that you're troubleshooting.                       |
|     `participantId`         |     The ID that's generated to represent the two-way connection between a `"Participant"` endpoint (`endpointType` =  `"Server"`) and the server. When `callType`   = `"P2P"`, there's a direct connection between two endpoints, and no `participantId` value is generated.       |
|     `identifier`            |     The unique ID for the user. The identity can be an Azure Communication Services user, a Microsoft Entra user ID, a Teams object ID, or a Teams bot ID. You can use this ID to correlate user events across logs.                  |
|     `endpointId`            |     The unique ID that represents each endpoint that's connected to the call, where `endpointType` defines the endpoint type. When the value is `null`, the connected entity is the Communication Services server. `EndpointId` can persist for the same user across multiple calls (`correlationId`) for native clients but is unique for every call when the client is a web browser.                    |
|     `endpointType`          |     The value that describes the properties of each `endpointId` instance. It can contain  `"Server"`, `"VOIP"`, `"PSTN"`, `"BOT"`, `"Voicemail"`, `"Anonymous"`, or `"Unknown"`.           |
|     `mediaType`             |     The string value that describes the type of media that's being transmitted between endpoints within each stream. Possible values include `"Audio"`, `"Video"`, `"VBSS"` (video-based screen sharing), and `"AppSharing"`.                    |
|     `streamId`              |     A non-unique integer that, together with `mediaType`, you can use to uniquely identify streams of the same `participantId` value.|
|     `transportType`         |     The string value that describes the network transport protocol for each `participantId` value. It can contain `"UDP"`, `"TCP"`, or `"Unrecognized"`. `"Unrecognized"` indicates that the system could not determine if the transport type was TCP or UDP.              |
|     `roundTripTimeAvg`      |     The average time that it takes to get an IP packet from one endpoint to another within a `participantDuration` period. This network propagation delay is related to the physical distance between the two points, the speed of light, and any overhead that the various routers take in between. <br><br>The latency is measured as one-way time or round-trip time (RTT). Its value expressed in milliseconds. An RTT greater than 500 ms is negatively affecting the call quality.          |
|     `roundTripTimeMax`      |     The maximum RTT (in milliseconds) measured fo reach media stream during a `participantDuration` period in a group call or during a `callDuration` period in a P2P call.        |
|     `jitterAvg`             |     The average change in delay between successive packets. Azure Communication Services can adapt to some levels of jitter through buffering. When the jitter exceeds the buffering, which is approximately at a `jitterAvg` time greater than 30 ms, a negative quality impact is likely occurring. The packets arriving at different speeds cause a speaker's voice to sound robotic. <br><br>This metric is measured for each media stream over the `participantDuration` period in a group call or over the `callDuration` period in a P2P call.      |
|     `jitterMax`             |     The maximum jitter value measured between packets for each media stream. Bursts in network conditions can cause problems in the audio/video traffic flow.  |
|     `packetLossRateAvg`     |     The average percentage of packets that are lost. Packet loss directly affects audio quality. Small, individual lost packets have almost no impact, whereas back-to-back burst losses cause audio to cut out completely. The packets being dropped and not arriving at their intended destination cause gaps in the media. This situation results in missed syllables and words, along with choppy video and sharing. <br><br>A packet loss rate of greater than 10% (0.1) is likely having a negative quality impact. This metric is measured for each media stream over the `participantDuration` period in a group call or over the `callDuration` period in a P2P call.    |
|     `packetLossRateMax`     |     This value represents the maximum packet loss rate (percentage) for each media stream over the `participantDuration` period in a group call or over the `callDuration` period in a P2P call. Bursts in network conditions can cause problems in the audio/video traffic flow.
|     `JitterBufferSizeAvg`     |     The average size of jitter buffer over the duration of each media stream. A jitter buffer is a shared data area where voice packets can be collected, stored, and sent to the voice processor in evenly spaced intervals. Jitter buffer is used to counter the effects of jitter. <br><br> Jitter buffers can be either static or dynamic. Static jitter buffers are set to a fixed size, while dynamic jitter buffers can adjust their size based on network conditions. The goal of the jitter buffer is to provide a smooth and uninterrupted stream of audio and video data to the user. <br><br> In the web SDK, this 'JitterBufferSizeAvg' is the average value of the 'jitterBufferDelay' during the call, the 'jitterBufferDelay' is the duration of an audio sample or a video frame that stays in the jitter buffer. <br><br> Normally when 'JitterBufferSizeAvg' value is greater than 200 ms, it will cause a negative quality impact.   
|     `JitterBufferSizeMax`     |    The maximum jitter buffer size measured during the duration of each media stream.  <br><br> Normally when this value is greater than 200 ms, it will cause a negative quality impact.  
|     `HealedDataRatioAvg`     |    The average percentage of lost or damaged data packets that are successfully reconstructed or recovered by the healer over the duration of audio stream. Healed data ratio is a measure of the effectiveness of error correction techniques used in VoIP systems.  <br><br> When this value is greater than 0.1 (10%),  we consider the stream as bad quality. 
|     `HealedDataRatioMax`     |    The maximum healed data ratio measured during the duration of each media stream. <br><br> When this value is greater than 0.1 (10%),  we consider the stream as bad quality. 
|     `VideoFrameRateAvg`     |    The average number of video frames that are transmitted per second during a video/screensharing call. The video frame rate can impact the quality and smoothness of the video stream, with higher frame rates generally resulting in smoother and more fluid motion. The standard frame rate for WebRTC video is typically 30 frames per second (fps), although this can vary depending on the specific implementation and network conditions.  <br><br> The stream quality is considered poor when this value is less than 7 for video stream, or less than 1 for screensharing stream. 
|     `RecvResolutionHeight`     |    The average of vertical size of the incoming video stream that is transmitted during a video/screensharing call. It's measured in pixels and is one of the factors that determines the overall resolution and quality of the video stream. The specific resolution used may depend on the capabilities of the devices and network conditions involved in the call.  <br><br> The stream quality is considered poor when this value is less than 240 for video stream, or less than 768 for screensharing stream. 
|     `RecvFreezeDurationPerMinuteInMs`     |    The average freeze duration in milliseconds per minute for incoming video/screensharing stream. Freezes are typically due to bad network condition and can degrade the stream quality.  <br><br> The stream quality is considered poor when this value is greater than 6,000 ms for video stream, or greater than 25,000 ms for screensharing stream. 

### Call client operations log schema
[!INCLUDE [Public Preview Disclaimer](../../../includes/public-preview-include-document.md)]


The **call client operations** log provides client-side information about the calling endpoints and participants involved in a call. These logs are currently in preview and show client events that occurred in a call and what actions a customer may have taken during a call.  

This log provides detailed information on actions taken during a call and can be used to visualize and investigate call issues by using Call Diagnostics for your Azure Communication Services Resource. [Learn more about Call Diagnostics](../../voice-video-calling/call-diagnostics.md)

|     Property              |     Description                     |
|---------------------------|-------------------------------------|
|     `CallClientTimeStamp`         |     The timestamp for when on operation occurred on the SDK in UTC.   |
|     `OperationName`         |    The name of the operation triggered on the calling SDK.   |
|     `CallId`    |              The unique ID for a call. It identifies correlated events from all of the participants and endpoints that connect during a single call, and you can use it to join data from different logs. It is similar to the correlationId in call summary log and call diagnostic log.               |
|     `ParticipantId`    |            The unique identifier for each call leg (in Group calls) or call participant (in Peer to Peer calls). This ID is the main correlation point between CallSummary, CallDiagnostic, CallClientOperations, and CallClientMediaStats logs.             |
|     `OperationType`    |              Call Client Operation.               |
|     `OperationId`    |             A unique GGUID identifying an SDK operation.                 |
|     `DurationMs`    |              The time took by a Calling SDK operation to fail or succeed.                |
|     `ResultType`    |               Field describing success or failure of an operation.               |
|     `ResultSignature`    |         HTTP like failure or success code (200, 500).                    |
|     `SdkVersion`    |                   The version of Calling SDK being used.           |
|     `UserAgent`    |          The standard user agent string based on the browser or the platform Calling SDK is used.        |
|     `ClientInstanceId`    |            A unique GGUID identifying the CallClient object.                  |
|     `EndpointId`    |             The unique ID that represents each endpoint connected to the call, where endpointType defines the endpoint type. When the value is null, the connected entity is the Communication Services server (endpointType = "Server").  <BR><BR> The endpointId value can sometimes persist for the same user across multiple calls (correlationId) for native clients. The number of endpointId values determines the number of call summary logs. A distinct summary log is created for each endpointId value.                |
|     `OperationPayload`    |     A dynamic payload that varies based on the operation providing more operation specific details.       |

<!-- ### Call client media stats time series log schema
[!INCLUDE [Public Preview Disclaimer](../../../includes/public-preview-include-document.md)]

The **call client media statistics time series** log provides
client-side information about the media streams between individual
participants involved in a call. These logs are currently in limited preview and provide detailed time series
data on the audio, video, and screenshare media steams between
participants with a default 10-seconds aggregation interval. The logs contain granular time series information about media stream type, direction, codec as well as bitrate properties (for example, max, min, average).


This log provides more detailed information than the Call Diagnostic log
to understand the quality of media steams between participants. It can be used to
visualize and investigate quality issues for your calls through Call
Diagnostics for your Azure Communication Services Resource. [Learn more about Call Diagnostics](../../voice-video-calling/call-diagnostics.md)




| Property                   | Description                                                                                                                                                                                                                                                                                                                                                                               |
|----------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `OperationName`              | The operation associated with the log record.                                                                                                                                                                                                                                                                                                                                             |
| `CallId`                     | The unique ID for a call. It identifies correlated events from all of the participants and endpoints that connect during a single call, and you can use it to join data from different logs. It is similar to the correlationId in call summary log and call diagnostic log.                                                                                                              |
| `CallClientTimeStamp`        | The timestamp when the media stats is recorded.                                                                                                                                                                                                                                                                                                                                           |
| `MetricName`                 | The name of the media statistics, such as Bitrate, JitterInMs, PacketsPerSecond etc.                                                                                                                                                                                                                                                                                                      |
| `Count`                      | The number of data points sampled at a given timestamp.                                                                                                                                                                                                                                                                                                                            |
| `Sum`                        | The sum of metric values of all the data points sampled.                                                                                                                                                                                                                                                                                                                                  |
| `Average`                    | The average metric value of the data points sampled. Average = Sum / Count                                                                                                                                                                                                                                                                                                                |
| `Minimum`                    | The minimum of metric values of all the data points sampled.                                                                                                                                                                                                                                                                                                                              |
| `Maximum`                    | The maximum of metric values of all the data points sampled.                                                                                                                                                                                                                                                                                                                              |
| `MediaStreamDirection`       | The direction of the media stream. It can be send or receive                                                                                                                                                                                                                                                                                                                                |
| `MediaStreamType`            | The type of the media stream. It can be video, audio or screen.                                                                                                                                                                                                                                                                                                                           |
| `MediaStreamCodec`           | The codec used to encode/decode the media stream, such as H264, OPUS, VP8 etc.                                                                                                                                                                                                                                                                                                            |
| `ParticipantId`              | The unique ID that is generated to represent each endpoint in the call.                                                                                                                                                                                                                                                                                                                    |
| `ClientInstanceId`           | The unique ID that represents the Call Client object created in the calling SDK.                                                                                                                                                                                                                                                                                                          |
| `EndpointId`                 | The unique ID that represents each endpoint that is connected to the call. EndpointId can persist for the same user across multiple calls (callIds) for native clients but is unique for every call when the client is a web browser. Note that EndpointId is not currently instrumented in this log. When implemented in future, it will match the values in CallSummary/Diagnostics logs |
| `RemoteParticipantId`        | The unique ID that represents the remote endpoint in the media stream. For example, a user can render multiple video streams for the other users in the same call. Each video stream has a different RemoteParticipantId.                                                                                                                                                                  |
| `RemoteEndpointId`           | Same as EndpointId, but it represents the user on the remote side of the stream.                                                                                                                                                                                                                                                                                                          |
| `MediaStreamId`              | A unique ID that represents each media stream in the call. MediaStreamId is not currently instrumented in clients. When implemented, it will match the streamId column in CallDiagnostics logs.                                                                                                                                                                                            |
| `AggregationIntervalSeconds` | The time interval for aggregating the media statistics. Currently in calling SDK, the media metrics are sampled every 1 second, and when we report in the log we aggregate all samples every 10 seconds. So each row in this table at most have 10 sampling points.                                                                                                                                                                                                            -->



### P2P vs. group calls

There are two types of calls, as represented by `callType`:

- **Peer to Peer (P2P) call**: A connection between only two endpoints, with no server endpoint. P2P calls are initiated as a call between those endpoints and are not created as a group call event before the connection.

  :::image type="content" source="../media/call-logs-azure-monitor/p2p-diagram.png" alt-text="Diagram that shows a P2P call across two endpoints.":::

- **Group call**: Any call that has more than two endpoints connected. Group calls include a server endpoint and the connection between each endpoint and the server. P2P calls that add another endpoint during the call cease to be P2P, and they become a group call. You can determine the timeline of when each endpoint joined the call by using the `participantStartTime` and `participantDuration` metrics.

  :::image type="content" source="../media/call-logs-azure-monitor/group-call-version-a.png" alt-text="Diagram that shows a group call across multiple endpoints.":::

## Log structure 

Azure Communication Services creates four types of logs:

- **Call summary logs**: Contain basic information about the call, including all the relevant IDs, time stamps, endpoints, and SDK information. For each participant within a call, Communication Services creates a distinct call summary log.

  If someone rejoins a call, that participant has the same `EndpointId` value but a different `ParticipantId` value. That endpoint can then have two call summary logs.

- **Call diagnostic logs**: Contain information about the stream, along with a set of metrics that indicate quality of experience measurements. For each `EndpointId` within a call (including the server), Azure Communication Services creates a distinct call diagnostic log for each media stream (audio or video, for example) between endpoints.


- **Call client operations logs**: Contain detailed call client events. These log events are generated for each `EndpointId` in a call and the number of event logs generated will depend on the operations the participant performed during the call. 

<!-- - **Call client media statistics logs**: Contain detailed media stream values. These logs are generated for each media stream in a call.  For each `EndpointId` within a call (including the server), Azure Communication Services creates a distinct log for each media stream (audio or video, for example) between endpoints. The volume of data generated in each log depends on the duration of call and number of media steams in the call. 

In a P2P call, each log contains data that relates to each of the outbound streams associated with each endpoint. In a group call, each stream associated with `endpointType` = `"Server"` creates a log that contains data for the inbound streams. All other streams create logs that contain data for the outbound streams for all non-server endpoints. In group calls, use the `participantId` value as the key to join the related inbound and outbound logs into a distinct participant connection. -->

### Example: P2P call

The following diagram represents two endpoints connected directly in a P2P call. In this example, Communication Services creates two call summary logs (one for each `participantID` value) and four call diagnostic logs (one for each media stream). 

<!-- For Azure Communication Services (ACS) call client participants there will also be a series of call client operations logs and call client media stats time series logs. The exact number of these logs depend on what kind of SDK operations are called and how long the call is.  -->

:::image type="content" source="../media/call-logs-azure-monitor/example-1-p2p-call-same-tenant.png" alt-text="Diagram that shows a P2P call within the same tenant.":::

### Example: Group call

The following diagram represents a group call example with three `participantId` values (which means three participants) and a server endpoint. Multiple values for `endpointId` can potentially appear in multiple participants--for example, when they rejoin a call from the same device. Communication Services creates one call summary log for each `participantId` value. It creates four call diagnostic logs: one for each media stream per `participantId`. 

For Azure Communication Services (ACS) call client participants the call client operations logs are the same as P2P calls. For each participant using calling SDK, there will be a series of call client operations logs. 

<!-- For Azure Communication Services (ACS) call client participants the call client operations logs and call client media statistics time series logs are the same as P2P calls. For each participant using calling SDK, there will be a series of call client operations logs and call client media statistics time series logs.  -->

:::image type="content" source="../media/call-logs-azure-monitor/example-2-group-call-same-tenant.png" alt-text="Diagram that shows a group call within the same tenant.":::

### Example: Cross-tenant P2P call 

The following diagram represents two participants across multiple tenants that are connected directly in a P2P call. In this example, Communication Services creates one call summary log (one for each participant) with redacted OS and SDK versions. Communication Services also creates four call diagnostic logs (one for each media stream). Each log contains data that relates to the outbound stream of `participantID`.

:::image type="content" source="../media/call-logs-azure-monitor/example-3-p2p-call-cross-tenant.png" alt-text="Diagram that shows a cross-tenant P2P call.":::

### Example: Cross-tenant group call 

The following diagram represents a group call example with three `participantId` values across multiple tenants. Communication Services creates one call summary log for each participant with redacted OS and SDK versions. Communication Services also creates four call diagnostic logs that relate to each `participantId` value (one for each media stream).

:::image type="content" source="../media/call-logs-azure-monitor/example-4-group-call-cross-tenant.png" alt-text="Diagram that shows a cross-tenant group call.":::

> [!NOTE]
> This release supports only outbound diagnostic logs.
> OS and SDK versions associated with the bot and the participant can be redacted because Communication Services treats identities of participants and bots the same way.

## Sample data

### P2P call 

Here are shared fields for all logs in a P2P call:

```json
"time":                     "2021-07-19T18:46:50.188Z",
"resourceId":               "SUBSCRIPTIONS/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/RESOURCEGROUPS/ACS-TEST-RG/PROVIDERS/MICROSOFT.COMMUNICATION/COMMUNICATIONSERVICES/ACS-PROD-CCTS-TESTS",
"correlationId":            "8d1a8374-344d-4502-b54b-ba2d6daaf0ae",
```

#### Call summary logs 

Call summary logs have shared operation and category information:

```json
"operationName":            "CallSummary",
"operationVersion":         "1.0",
"category":                 "CallSummary",

```

Here's a call summary for VoIP user 1:

```json
"properties": {
    "identifier":               "acs:61fddbe3-0003-4066-97bc-6aaf143bbb84_0000000b-4fee-66cf-ac00-343a0d003158",
    "callStartTime":            "2021-07-19T17:54:05.113Z",
    "callDuration":             6,
    "callType":                 "P2P",
    "teamsThreadId":            "null",
    "participantId":            "null",    
    "participantStartTime":     "2021-07-19T17:54:06.758Z",
    "participantDuration":      "5",
    "participantEndReason":     "0",
    "endpointId":               "570ea078-74e9-4430-9c67-464ba1fa5859",
    "endpointType":             "VoIP",
    "sdkVersion":               "1.0.1.0",
    "osVersion":                "Windows 10.0.17763 Arch: x64"
}
```

Here's a call summary for VoIP user 2:

```json
"properties": {
    "identifier":               "acs:7af14122-9ac7-4b81-80a8-4bf3582b42d0_06f9276d-8efe-4bdd-8c22-ebc5434903f0",
    "callStartTime":            "2021-07-19T17:54:05.335Z",
    "callDuration":             6,
    "callType":                 "P2P",
    "teamsThreadId":            "null",
    "participantId":            "null",
    "participantStartTime":     "2021-07-19T17:54:06.335Z",
    "participantDuration":      "5",
    "participantEndReason":     "0",
    "endpointId":               "a5bd82f9-ac38-4f4a-a0fa-bb3467cdcc64",
    "endpointType":             "VoIP",
    "sdkVersion":               "1.1.0.0",
    "osVersion":                "null"
}
```

Here's a cross-tenant call summary log for VoIP user 1:

```json
"properties": {
    "identifier":               "1e4c59e1-r1rr-49bc-893d-990dsds8f9f5",
    "callStartTime":            "2022-08-14T06:18:27.010Z",
    "callDuration":             520,
    "callType":                 "P2P",
    "teamsThreadId":            "null",
    "participantId":            "null",
    "participantTenantId":      "02cbdb3c-155a-4b95-b829-6d56a45787ca",
    "participantStartTime":     "2022-08-14T06:18:27.010Z",
    "participantDuration":      "520",
    "participantEndReason":     "0",
    "endpointId":               "02cbdb3c-155a-4d98-b829-aaaaa61d44ea",
    "endpointType":             "VoIP",
    "sdkVersion":               "Redacted",
    "osVersion":                "Redacted"
}
```

Here's a call summary for a PSTN call:

> [!NOTE]
> P2P or group call logs have OS and SDK versions redacted regardless of whether it's the participant's tenant or the bot's tenant.

```json
"properties": {
    "identifier": "b1999c3e-bbbb-4650-9b23-9999bdabab47",
    "callStartTime": "2022-08-07T13:53:12Z",
    "callDuration": 1470,
    "callType": "Group",
    "teamsThreadId": "19:36ec5177126fff000aaa521670c804a3@thread.v2",
    "participantId": " b25cf111-73df-4e0a-a888-640000abe34d",
    "participantStartTime": "2022-08-07T13:56:45Z",
    "participantDuration": 960,
    "participantEndReason": "0",
    "endpointId": "8731d003-6c1e-4808-8159-effff000aaa2",
    "endpointType": "PSTN",
    "sdkVersion": "Redacted",
    "osVersion": "Redacted"
}
```

#### Call diagnostic logs 

Call diagnostic logs share operation information:

```json
"operationName":            "CallDiagnostics",
"operationVersion":         "1.0",
"category":                 "CallDiagnostics",
```

Here's a diagnostic log for an audio stream from VoIP endpoint 1 to VoIP endpoint 2:

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
}
```

Here's a diagnostic log for an audio stream from VoIP endpoint 2 to VoIP endpoint 1:

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
}
```

Here's a diagnostic log for a video stream from VoIP endpoint 1 to VoIP endpoint 2:

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
}
```

### Group call

Data for a group call is generated in three call summary logs and six call diagnostic logs. Here are shared fields for all logs in the call:

```json
"time":                     "2021-07-05T06:30:06.402Z",
"resourceId":               "SUBSCRIPTIONS/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/RESOURCEGROUPS/ACS-TEST-RG/PROVIDERS/MICROSOFT.COMMUNICATION/COMMUNICATIONSERVICES/ACS-PROD-CCTS-TESTS",
"correlationId":            "341acde7-8aa5-445b-a3da-2ddadca47d22",
```

#### Call summary logs

Call summary logs have shared operation and category information:

```json
"operationName":            "CallSummary",
"operationVersion":         "1.0",
"category":                 "CallSummary",
```

Here's a call summary for VoIP endpoint 1:

```json
"properties": {
    "identifier":               "acs:1797dbb3-f982-47b0-b98e-6a76084454f1_0000000b-1531-729f-ac00-343a0d00d975",
    "callStartTime":            "2021-07-05T06:16:40.240Z",
    "callDuration":             87,
    "callType":                 "Group",
    "teamsThreadId":            "19:meeting_MjZiOTAyN2YtZWU1Yi00ZTZiLT77777OOOOO99999jgxOTkw@thread.v2",
    "participantId":            "04cc26f5-a86d-481c-b9f9-7a40be4d6fba",
    "participantStartTime":     "2021-07-05T06:16:44.235Z",
    "participantDuration":      "82",
    "participantEndReason":     "0",
    "endpointId":               "5ebd55df-ffff-ffff-89e6-4f3f0453b1a6",
    "endpointType":             "VoIP",
    "sdkVersion":               "1.0.0.3",
    "osVersion":                "Darwin Kernel Version 18.7.0: Mon Nov 9 15:07:15 PST 2020; root:xnu-4903.272.3~3/RELEASE_ARM64_S5L8960X"
}
```

Here's a call summary for VoIP endpoint 3:

```json
"properties": {
    "identifier":               "acs:1797dbb3-f982-47b0-b98e-6a76084454f1_0000000b-1531-57c6-ac00-343a0d00d972",
    "callStartTime":            "2021-07-05T06:16:40.240Z",
    "callDuration":             87,
    "callType":                 "Group",
    "teamsThreadId":            "19:meeting_MjZiOTAyN2YtZWU1Yi00ZTZiLTk2ZDUtYTZlM2I2ZjgxOTkw@thread.v2",
    "participantId":            "1a9cb3d1-7898-4063-b3d2-26c1630ecf03",
    "participantStartTime":     "2021-07-05T06:16:40.240Z",
    "participantDuration":      "87",
    "participantEndReason":     "0",
    "endpointId":               "5ebd55df-ffff-ffff-ab89-19ff584890b7",
    "endpointType":             "VoIP",
    "sdkVersion":               "1.0.0.3",
    "osVersion":                "Android 11.0; Manufacturer: Google; Product: redfin; Model: Pixel 5; Hardware: redfin"
}
```

Here's a call summary for PSTN endpoint 2:

```json
"properties": {
    "identifier":               "null",
    "callStartTime":            "2021-07-05T06:16:40.240Z",
    "callDuration":             87,
    "callType":                 "Group",
    "teamsThreadId":            "19:meeting_MjZiOTAyN2YtZWU1Yi00ZTZiLT77777OOOOO99999jgxOTkw@thread.v2",
    "participantId":            "515650f7-8204-4079-ac9d-d8f4bf07b04c",
    "participantStartTime":     "2021-07-05T06:17:10.447Z",
    "participantDuration":      "52",
    "participantEndReason":     "0",
    "endpointId":               "46387150-692a-47be-8c9d-1237efe6c48b",
    "endpointType":             "PSTN",
    "sdkVersion":               "null",
    "osVersion":                "null"
}
```

Here's a cross-tenant call summary log:

```json
"properties": {
    "identifier":               "1e4c59e1-r1rr-49bc-893d-990dsds8f9f5",
    "callStartTime":            "2022-08-14T06:18:27.010Z",
    "callDuration":             912,
    "callType":                 "Group",
    "teamsThreadId":            "19:meeting_MjZiOTAyN2YtZWU1Yi00ZTZiLT77777OOOOO99999jgxOTkw@thread.v2",
    "participantId":            "aa1dd7da-5922-4bb1-a4fa-e350a111fd9c",
    "participantTenantId":      "02cbdb3c-155a-4b95-b829-6d56a45787ca",
    "participantStartTime":     "2022-08-14T06:18:27.010Z",
    "participantDuration":      "902",
    "participantEndReason":     "0",
    "endpointId":               "02cbdb3c-155a-4d98-b829-aaaaa61d44ea",
    "endpointType":             "VoIP",
    "sdkVersion":               "Redacted",
    "osVersion":                "Redacted"
}
```

Here's a cross-tenant call summary log with a bot as a participant:

```json

"properties": {
    "identifier":             "b1902c3e-b9f7-4650-9b23-9999bdabab47",
    "callStartTime":          "2022-08-09T16:00:32Z",
    "callDuration":            1470,
    "callType":               "Group",
    "teamsThreadId":         "19:meeting_MmQwZDcwYTQtZ000HWE6NzI4LTg1YTAtNXXXXX99999ZZZZZ@thread.v2",
    "participantId":           "66e9d9a7-a434-4663-d91d-fb1ea73ff31e",
    "participantStartTime":    "2022-08-09T16:14:18Z",
    "participantDuration":      644,
    "participantEndReason":    "0",
    "endpointId":             "69680ec2-5ac0-4a3c-9574-eaaa77720b82",
    "endpointType":           "Bot",
    "sdkVersion":             "Redacted",
    "osVersion":              "Redacted"
}
```

#### Call diagnostic logs

Call diagnostic logs share operation information:

```json
"operationName":            "CallDiagnostics",
"operationVersion":         "1.0",
"category":                 "CallDiagnostics",
```

Here's a diagnostic log for an audio stream from VoIP endpoint 1 to a server endpoint:

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
}
```

Here's a diagnostic log for an audio stream from a server endpoint to VoIP endpoint 1:

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
}
```

Here's a diagnostic log for an audio stream from VoIP endpoint 3 to a server endpoint:

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
}
```

Here's a diagnostic log for an audio stream from a server endpoint to VoIP endpoint 3:

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
```
### Call client operations logs for P2P and group calls

For call client operations log, there is no difference between P2P and group call scenarios and the number of logs depends on the SDK operations and call duration. The following provide some generic samples that show the schema of these logs.


<!-- ### Call client operations log and call client media statistics logs for P2P and group calls

For call client operations log and call client media stats time series log, there is no difference between P2P and group call scenarios and the number of logs depends on the SDK operations and call duration. The following provide some generic samples that show the schema of these logs. -->

#### Call client operations log

Here's a call client operations log for "CreateView" operation:

```json
"properties": {
    "TenantId":               "4e7403f8-515a-4df5-8e13-59f0e2b76e3a",
    "TimeGenerated":          "2024-01-09T17:06:50.3Z",
    "CallClientTimeStamp":    "2024-01-09T15:07:56.066Z",
    "OperationName":          "CreateView" ,   
    "CallId":                 "92d800c4-abde-40be-91e9-3814ee786b19",
    "ParticipantId":          "2656fd6c-6d4a-451d-a1a5-ce1baefc4d5c",
    "OperationType":          "client-api-request",
    "OperationId":            "0d987336-37e0-4acc-aba3-e48741d88103",
    "DurationMs":             "577",
    "ResultType":             "Succeeded",
    "ResultSignature":        "200",
    "SdkVersion":             "1.19.2.2_beta",
    "UserAgent":              "azure-communication-services/1.3.1-beta.1 azsdk-js-communication-calling/1.19.2-beta.2 (javascript_calling_sdk;#clientTag:904f667c-5f25-4729-9ee8-6968b0eaa40b). Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "ClientInstanceId":       "d08a3d05-db90-415f-88a7-87ae74edc1dd",
    "OperationPayload":       "{"StreamType":"Video","StreamId":"2.0","Source":"remote","RemoteParticipantId":"remote"}",
    "Type":                   "ACSCallClientOperations"
}
```
Each participant can have many different metrics for a call. The following query can be run in Log Analytics in Azure portal to list all the possible Operations in the call client operations log:

`ACSCallClientOperations | distinct OperationName`

<!-- #### Call client media statistics time series log

The following is an example of media statistics time series log. It shows the participant's Jitter metric for receiving an audio stream at a specific timestamp.

```json
"properties": {
    "TenantId":                     "4e7403f8-515a-4df5-8e13-59f0e2b76e3a",
    "TimeGenerated":                "2024-01-10T07:36:51.771Z",
    "OperationName":                "CallClientMediaStatsTimeSeries" ,  
    "CallId":                       "92d800c4-abde-40be-91e9-3814ee786b19", 
    "CallClientTimeStamp":          "2024-01-09T15:07:56.066Z",
    "MetricName":                   "JitterInMs",
    "Count":                        "2",
    "Sum":                          "34",
    "Average":                      "17",
    "Minimum":                      "10",
    "Maximum":                      "25",
    "MediaStreamDirection":         "recv",
    "MediaStreamType":              "audio",
    "MediaStreamCodec":             "OPUS",
    "ParticipantId":                "2656fd6c-6d4a-451d-a1a5-ce1baefc4d5c",
     "ClientInstanceId":            "d08a3d05-db90-415f-88a7-87ae74edc1dd",
    "AggregationIntervalSeconds":   "10",
    "Type":                         "ACSCallClientMediaStatsTimeSeries"
}
```

Each participant can have many different media statistics metrics for a call. The following query can be run in Log Analytics in Azure Portal to show all possible metrics in this log:

`ACSCallClientMediaStatsTimeSeries | distinct MetricName` -->

### Error codes 

The `participantEndReason` property contains a value from the set of Calling SDK error codes. You can refer to these codes to troubleshoot issues during the call, for each endpoint. See [Troubleshooting in Azure Communication Services](../../troubleshooting-info.md?tabs=csharp%2cios%2cdotnet#calling-sdk-error-codes).

## Next steps

- Learn about the [insights dashboard to monitor Voice Calling and Video Calling logs and metrics](/azure/communication-services/concepts/analytics/insights/voice-and-video-insights).

- Learn best practices to manage your call quality and reliability, see: [Improve and manage call quality](../../voice-video-calling/manage-call-quality.md)
 

- Learn how to use call logs to diagnose call quality and reliability
  issues with Call Diagnostics, see: [Call Diagnostics](../../voice-video-calling/call-diagnostics.md)