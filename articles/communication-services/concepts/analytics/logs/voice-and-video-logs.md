---
title: Azure Communication Services - voice and video logs 
titleSuffix: An Azure Communication Services concept article
description: Learn about logging for Azure Communication Services voice and video.
author:  timmitchell
services: azure-communication-services

ms.author: timmitchell
ms.date: 03/21/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: calling
---

# Azure Communication Services voice and video Logs

Azure Communication Services offers logging capabilities that you can use to monitor and debug your Communication Services solution. You configure these capabilities through the Azure portal.

The content in this article refers to logs enabled through [Azure Monitor](../../../../azure-monitor/overview.md) (see also [FAQ](../../../../azure-monitor/faq.yml)). To enable these logs for Communications Services, see [Enable logging in diagnostic settings](../enable-logging.md).

## Data concepts

The following high-level descriptions of data concepts are specific to voice and video calling. These concepts are important to review so that you can understand the meaning of the data captured in the logs.

### Entities and IDs

A *call*, as represented in the data, is an abstraction that's depicted by `correlationId`. `CorrelationId` vales are unique per call, and they're time-bound by `callStartTime` and `callDuration`.

A *participant* (`participantId`) is present only when the call is a *group* call. It represents the connection between an endpoint and the server.

An *endpoint* is the most unique entity, represented by `endpointId`. Every call is an event that contains data from two or more endpoints. Endpoints represent the various participants in the call. 

`EndpointType` tells you whether the endpoint represents a human user (PSTN, VoIP), a bot, or the server that's managing multiple participants within a call. When an `endpointType` value is `"Server"`, the endpoint is not assigned a unique ID. By analyzing `endpointType` and the number of `endpointId` values, you can determine how many users and other non-human participants (bots and servers) join a call.

Our native SDKs (Android and iOS) reuse the same `endpointId` value for a user across multiple calls, so you can get an understanding of experiences across sessions. This process differs from web-based endpoints, which always generate a new `endpointId` value for each new call.

A *stream* is the most granular entity. There's one stream per direction (inbound or outbound) and `mediaType` value (for example, audio or video).  

## Data definitions

### Usage logs schema

| Property | Description |
| -------- | ---------------|
| `Timestamp` | The time stamp (UTC) of when the log was generated. |
| `Operation Name` | The operation that's associated with the log record. |
| `Operation Version` | The `api-version` value that's associated with the operation, if the `Operation Name`operation was performed through an API. If no API corresponds to this operation, the version represents the version of the operation, in case the properties change in the future. |
| `Category` | The log category of the event. `Category` is the granularity at which you can enable or disable logs on a particular resource. The properties that appear within the `properties` blob of an event are the same within a particular log category and resource type. |
| `Correlation ID` | The ID for correlated events. You can use it to identify correlated events between multiple tables. |
| `Properties` | Other data that's applicable to various modes of Communication Services. |
| `Record ID` | The unique ID for a usage record. |
| `Usage Type` | The mode of usage (for example, chat, PSTN, or NAT). |
| `Unit Type` | The type of unit that usage is based on for a mode of usage (for example, minutes, megabytes, or messages). |
| `Quantity` | The number of units used or consumed for this record. |

### Call summary log schema

The call summary log contains data to help you identify key properties of all calls. A different call summary log is created for each `participantId` (`endpointId` in the case of P2P calls) value in the call.

> [!IMPORTANT]
> Participant information in the call summary log varies based on the participant tenant. The SDK version and OS version are redacted if the participant is not within the same tenant (also called *cross-tenant*) as the Communication Services resource. Cross-tenants' participants are classified as external users invited by a resource tenant to join and collaborate during a call.

|     Property                  |       Description                  |
|-------------------------------|-------------------------|
|     `time`                      |     The time stamp (UTC) of when the log was generated.     |
|     `operationName`             |     The operation that's associated with the log record.                |
|     `operationVersion`          |     The `api-version` value that's associated with the operation, if the `operationName` operation was performed through an API. If no API corresponds to this operation, the version represents the version of the operation, in case the properties associated with the operation change in the future.                                                   |
|     `category`                  |     The log category of the event. This property is the granularity at which you can enable or disable logs on a particular resource. The properties that appear within the `properties` blob of an event are the same within a particular log category and resource type.   |
|     `correlationId`     |    The unique ID for a call. It identifies correlated events from all of the participants and endpoints that connect during a single call, and you can use it to join data from different logs. If you ever need to open a support case with Microsoft, you can use the `correlationId` value to easily identify the call that you're troubleshooting.                                                                                                                                                                      |
|     `identifier`                |     The unique ID for the user. The identity can be an Azure Communications Services user, an Azure Active Directory (Azure AD) user ID, a Teams anonymous user ID, or a Teams bot ID. You can use this ID to correlate user events across logs.                  |
|     `callStartTime`             |     A time stamp for the start of the call, based on the first attempted connection from any endpoint.                                                  |
|     `callDuration`              |     The duration of the call expressed in seconds, based on the first attempted connection and the end of the last connection between two endpoints.               |
|     `callType`                  |     The type of the call. It contains either `"P2P"` or `"Group"`. A `"P2P"` call is a direct 1:1 connection between only two, non-server endpoints. A `"Group"` call is a call that has more than two endpoints or is created as `"Group"` call before the connection.                  |
|     `teamsThreadId`             |     The Teams thread ID. This ID is relevant only when the call is organized as a Microsoft Teams meeting. It then represents the Microsoft Teams – Azure Communication Services interoperability use case. <br><br>This ID is exposed in operational logs. You can also get this ID through the Chat APIs.   |
|     `participantId`             |     The ID that's generated to represent the two-way connection between a `"Participant"` endpoint (`endpointType` = `"Server"`) and the server. When `callType` = `"P2P"`, there is a direct connection between two endpoints, and no `participantId` value is generated.       |
|     `participantStartTime`      |     The time stamp for beginning of the first connection attempt by the participant.                                                                                 |
|     `participantDuration`       |     The duration of each participant connection in seconds, from `participantStartTime` to the time stamp when the connection is ended.                                 |
|     `participantEndReason`      |     The reason for the end of a participant connection. It contains Calling SDK error codes that the SDK emits when relevant for each `participantId` value.            |
|     `endpointId`                |     The unique ID that represents each endpoint that's connected to the call, where `endpointType` defines the endpoint type. When the value is `null`, the connected entity is the Communication Services server (`endpointType`= `"Server"`). `EndpointId` can sometimes persist for the same user across multiple calls (`correlationId`) for native clients. The number of `endpointId` values determines the number of call summary logs. A distinct summary log is created for each `endpointId` value.    |
|     `endpointType`              |     This value describes the properties of each endpoint thats' connected to the call. It can contain `"Server"`, `"VOIP"`, `"PSTN"`, `"BOT"`, or `"Unknown"`.               |
|     `sdkVersion`                |     The version string for the Communication Services Calling SDK version that each relevant endpoint uses (example: `"1.1.00.20212500"`).                                               |
|     `osVersion`                 |     A string that represents the operating system and version of each endpoint device.                                                                        |
|     `participantTenantId`               |    The ID of the Microsoft tenant that's associated with the participant. This field is used to guide cross-tenant redaction.

### Call diagnostic log schema

Call diagnostic logs provide important information about the endpoints and the media transfers for each participant. They also provide measurements that help you understand quality problems.

For each endpoint within a call, a distinct call diagnostic log is created for outbound media streams (audio or video, for example) between endpoints. In a P2P call, each log contains data that relates to each of the outbound streams that are associated with each endpoint. In group calls, `participantId` serves as a key identifier to join the related outbound logs into a distinct participant connection. Call diagnostic logs remain intact and are the same regardless of the participant tenant.

> [!NOTE]
> In this article, P2P and group calls are within the same tenant, by default, for all call scenarios that are cross-tenant. They're specified accordingly throughout the article.

|     Property              |     Description                     |
|---------------------------|-------------------------------------|
|     `operationName`         |     The operation that's associated with the log record.   |
|     `operationVersion`      |     The `api-version` value that's associated with the operation, if the `operationName` operation was performed through an API. If no API corresponds to this operation, the version represents the version of the operation, in case the properties associated with the operation change in the future.                                   |
|     `category`              |     The log category of the event. This property is the granularity at which you can enable or disable logs on a particular resource. The properties that appear within the `properties` blob of an event are the same within a particular log category and resource type.             |
|     `correlationId`     |     The unique ID for a call. It identifies correlated events from all of the participants and endpoints that connect during a single call. If you ever need to open a support case with Microsoft, you can use the `correlationId` value to easily identify the call that you're troubleshooting.                       |
|     `participantId`         |     The ID that's generated to represent the two-way connection between a `"Participant"` endpoint (`endpointType` =  `"Server"`) and the server. When `callType`   = `"P2P"`, there's a direct connection between two endpoints, and no `participantId` value is generated.       |
|     `identifier`            |     The unique ID for the user. The identity can be an Azure Communications Services user, an Azure AD user ID, a Teams object ID, or a Teams bot ID. You can use this ID to correlate user events across logs.                  |
|     `endpointId`            |     The unique ID that represents each endpoint that's connected to the call, where `endpointType` defines the endpoint type. When the value is `null`, the connected entity is the Communication Services server. `EndpointId` can persist for the same user across multiple calls (`correlationId`) for native clients but is unique for every call when the client is a web browser.                    |
|     `endpointType`          |     The value that describes the properties of each `endpointId` instance. It can contain  `"Server"`, `"VOIP"`, `"PSTN"`, `"BOT"`, `"Voicemail"`, `"Anonymous"`, or `"Unknown"`.           |
|     `mediaType`             |     The string value that describes the type of media that's being transmitted between endpoints within each stream. Possible values include `"Audio"`, `"Video"`, `"VBSS"` (Video-Based Screen Sharing), and `"AppSharing"`.                    |
|     `streamId`              |     A non-unique integer that, together with `mediaType`, you can use to uniquely identify streams of the same `participantId` value.|
|     `transportType`         |     The string value that describes the network transport protocol per `participantId` value. It can contain `"UDP"`, `"TCP"`, or `"Unrecognized"`. `"Unrecognized"` indicates that the system could not determine if transport type was TCP or UDP.              |
|     `roundTripTimeAvg`      |     The average time that it takes to get an IP packet from one endpoint to another within a `participantDuration`. This network propagation delay is related to the physical distance between the two points, the speed of light, and any overhead taken by the various routers in between. The latency is measured as one-way or Round-trip Time (RTT).  Its value expressed in milliseconds, and an RTT greater than 500ms should be considered as negatively impacting the call quality.          |
|     `roundTripTimeMax`      |     The maximum RTT (ms) measured per media stream during a `participantDuration` in a group call or `callDuration` in a P2P call.        |
|     `jitterAvg`             |     This metric is the average change in delay between successive packets. Azure Communication Services can adapt to some levels of jitter through buffering. It's only when the jitter exceeds the buffering, which is approximately at `jitterAvg` >30 ms, that a negative quality impact is likely occurring. The packets arriving at different speeds cause a speaker's voice to sound robotic. This metric is measured per media stream over the `participantDuration` in a group call or `callDuration` in a P2P call.      |
|     `jitterMax`             |     This metric is the maximum jitter value measured between packets per media stream. Bursts in network conditions can cause issues in the audio/video traffic flow.  |
|     `packetLossRateAvg`     |     This metric is the average percentage of packets that are lost. Packet loss directly affects audio quality—from small, individual lost packets that have almost no impact to back-to-back burst losses that cause audio to cut out completely. The packets being dropped and not arriving at their intended destination cause gaps in the media, resulting in missed  syllables and words, and choppy video and sharing. <br><br>A packet loss rate of greater than 10% (0.1) should be considered a rate that's likely having a negative quality impact. This metric is measured per media stream  over the `participantDuration` in a group call or `callDuration` in a P2P call.    |
|     `packetLossRateMax`     |     This value represents the maximum packet loss rate (%) per media stream over the `participantDuration` in a group call or `callDuration` in a P2P call. Bursts in network conditions can cause issues in the audio/video traffic flow.

### P2P vs. group calls

There are two types of calls (represented by `callType`):

- **P2P** calls are a connection between only two endpoints, with no server endpoint. P2P calls are initiated as a call between those endpoints and are not created as a group call event prior to the connection.

  :::image type="content" source="../media/call-logs-azure-monitor/p2p-diagram.png" alt-text="Screenshot displays P2P call across 2 endpoints."::: 

- **Group** calls include any call that has more than 2 endpoints connected. Group calls include a server endpoint, and the connection between each endpoint and the server. P2P calls that add an additional endpoint during the call cease to be P2P, and they become a group call. You can determine the timeline of when each endpoints joined the call by using the `participantStartTime` and `participantDuration` metrics.

  :::image type="content" source="../media/call-logs-azure-monitor/group-call-version-a.png" alt-text="Screenshot displays group call across multiple endpoints.":::

## Log structure

Two types of logs are created: *call summary* logs and *call diagnostic* logs.

Call summary logs contain basic information about the call, including all the relevant IDs, time stamps, endpoint and SDK information. For each participant within a call, a distinct call summary log is created (if someone rejoins a call, they have the same EndpointId, but a different ParticipantId, so there can be two call summary logs for that endpoint).

Call diagnostic logs contain information about the stream as well as a set of metrics that indicate quality of experience measurements. For each endpoint within a call (including the server), a distinct call diagnostic log is created for each media stream (audio or video, for example) between endpoints.

In a P2P call, each log contains data relating to each of the outbound stream(s) associated with each endpoint. In a group call, each stream associated with `endpointType`= `"Server"` creates a log containing data for the inbound streams, and all other streams creates logs containing data for the outbound streams for all non-sever endpoints. In group calls, use the `participantId` as the key to join the related inbound/outbound logs into a distinct participant connection.

### Example 1: P2P call

The following diagram represents two endpoints connected directly in a P2P call. In this example, 2 call summary logs would be created (one per `participantID`) and four call diagnostic logs would be created (one per media stream). Each log contains data relating to the outbound stream of the `participantID`.

:::image type="content" source="../media/call-logs-azure-monitor/example-1-p2p-call-same-tenant.png" alt-text="Screenshot displays P2P call within the same tenant.":::

### Example 2: Group call

The following diagram represents a group call example with three `participantIDs`, which means three `participantIDs`. (`endpointIds` can potentially appear in multiple participants--for example, when rejoining a call from the same device) and a server endpoint. One call summary logs would be created per `participantID`, and four call diagnostic logs would be created relating to each `participantID`, one for each media stream.

:::image type="content" source="../media/call-logs-azure-monitor/example-2-group-call-same-tenant.png" alt-text="Screenshot displays group call within the same tenant.":::

### Example 3: P2P call cross-tenant

The following diagram represents two participants across multiple tenants that are connected directly in a P2P call. In this example, one call summary log would be created (one per participant) with redacted OS and SDK versioning and four call diagnostic logs would be created (one per media stream). Each log contains data relating to the outbound stream of the `participantID`.

:::image type="content" source="../media/call-logs-azure-monitor/example-3-p2p-call-cross-tenant.png" alt-text="Screenshot displays P2P call cross-tenant.":::

### Example 4: Group call cross-tenant

The following diagram represents a group call example with three `participantIds` across multiple tenants. One call summary log would be created per participant with redacted OS and SDK versioning, and four call diagnostic logs would be created relating to each `participantId` , one for each media stream.

:::image type="content" source="../media/call-logs-azure-monitor/example-4-group-call-cross-tenant.png" alt-text="Screenshot displays group call cross-tenant.":::

> [!NOTE]
> Only outbound diagnostic logs can be supported in this release. 
> Please note that participants and bots identity are treated the same way, as a result OS and SDK versioning associated to the bot and the participant can be redacted.

## Sample data

### P2P call

Shared fields for all logs in the call:

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

Call summary for VoIP user 1:

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

Call summary for VoIP user 2:

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

Call summary logs crossed tenants: Call summary for VoIP user 1

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

Call summary for PSTN call

> [!NOTE]
> P2P or group call logs emitted have OS, and SDK version redacted regardless is the participant or bot's tenant

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

Call diagnostics logs share operation information:

```json
"operationName":            "CallDiagnostics",
"operationVersion":         "1.0",
"category":                 "CallDiagnostics",
```

Diagnostic log for audio stream from VoIP Endpoint 1 to VoIP Endpoint 2:

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

Diagnostic log for audio stream from VoIP Endpoint 2 to VoIP Endpoint 1:

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

Diagnostic log for video stream from VoIP Endpoint 1 to VoIP Endpoint 2:

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

The data would be generated in three call summary logs and 6 call diagnostic logs. Shared fields for all logs in the call:

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

Call summary for VoIP Endpoint 1:

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

Call summary for VoIP Endpoint 3:

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

Call summary for PSTN Endpoint 2:

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

Call summary logs cross-tenant

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

Call summary log crossed tenant with bot as a participant
Call summary for bot

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

Call diagnostics logs share operation information:

```json
"operationName":            "CallDiagnostics",
"operationVersion":         "1.0",
"category":                 "CallDiagnostics",
```

Diagnostic log for audio stream from VoIP Endpoint 1 to server endpoint:

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

Diagnostic log for audio stream from server endpoint to VoIP Endpoint 1:

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

Diagnostic log for audio stream from VoIP Endpoint 3 to server endpoint:

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

Diagnostic log for audio stream from server endpoint to VoIP Endpoint 3:

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

### Error codes

The `participantEndReason` contains a value from the set of Calling SDK error codes. You can refer to these codes to troubleshoot issues during the call, per endpoint. See [troubleshooting in Azure communication Calling SDK error codes](../../troubleshooting-info.md?tabs=csharp%2cios%2cdotnet#calling-sdk-error-codes)
