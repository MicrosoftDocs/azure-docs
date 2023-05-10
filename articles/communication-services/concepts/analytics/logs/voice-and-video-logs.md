---
title: Azure Communication Services - voice and video logs 
titleSuffix: An Azure Communication Services concept document
description: Learn about logging for Azure Communication Services Voice and Video.
author:  timmitchell
services: azure-communication-services

ms.author: timmitchell
ms.date: 03/21/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: calling
---

# Azure Communication Services voice and video Logs 

Azure Communication Services offers logging capabilities that you can use to monitor and debug your Communication Services solution. These capabilities can be configured through the Azure portal.

> [!IMPORTANT]
> The following refers to logs enabled through [Azure Monitor](../../../../azure-monitor/overview.md) (see also [FAQ](../../../../azure-monitor/faq.yml)). To enable these logs for your Communications Services, see: [Enable logging in Diagnostic Settings](../enable-logging.md)

## Data Concepts
The following are high level descriptions of data concepts specific to Voice and Video calling. These concepts are important to review in order to understand the meaning of the data captured in the logs.

### Entities and IDs

A *Call*, as represented in the data, is an abstraction depicted by the `correlationId`. `CorrelationId`s are unique per Call, and are time-bound by `callStartTime` and `callDuration`. Every Call is an event that contains data from two or more *Endpoints*, which represent the various human, bot, or server participants in the Call.

A *Participant* (`participantId`) is present only when the Call is a *Group* Call, as it represents the connection between an Endpoint and the server. 

An *Endpoint* is the most unique entity, represented by `endpointId`. `EndpointType` tells you whether the Endpoint represents a human user (PSTN, VoIP), a Bot (Bot), or the server that is managing multiple Participants within a Call. When an `endpointType` is `"Server"`, the Endpoint is not assigned a unique ID. By analyzing endpointType and the number of `endpointIds`, you can determine how many users and other non-human Participants (bots, servers) join a Call. Our native SDKs (Android, iOS) reuse the same `endpointId` for a user across multiple Calls, thus enabling an understanding of experience across sessions. This differs from web-based Endpoints, which always generates a new `endpointId` for each new Call.

A *Stream* is the most granular entity, as there is one Stream per direction (inbound/outbound) and `mediaType` (for example, audio and video).  

## Data Definitions

### Usage logs schema

| Property | Description |
| -------- | ---------------|
| `Timestamp` | The timestamp (UTC) of when the log was generated. |
| `Operation Name` | The operation associated with log record. |
| `Operation Version` | The `api-version` associated with the operation, if the operationName was performed using an API. If there's no API that corresponds to this operation, the version represents the version of that operation in case the properties change in the future. |
| `Category` | The log category of the event. Category is the granularity at which you can enable or disable logs on a particular resource. The properties that appear within the properties blob of an event are the same within a particular log category and resource type. |
| `Correlation ID` | The ID for correlated events. Can be used to identify correlated events between multiple tables. |
| `Properties` | Other data applicable to various modes of Communication Services. |
| `Record ID` | The unique ID for a given usage record. |
| `Usage Type` | The mode of usage. (for example, Chat, PSTN, NAT, etc.) |
| `Unit Type` | The type of unit that usage is based off for a given mode of usage. (for example, minutes, megabytes, messages, etc.). |
| `Quantity` | The number of units used or consumed for this record. |

### Call Summary log schema
The Call Summary Log contains data to help you identify key properties of all Calls. A different Call Summary Log is created per each `participantId` (`endpointId` in the case of P2P calls) in the Call.

> [!IMPORTANT]
> Participant information in the call summary log vary based on the participant tenant. The SDK and OS version is redacted if the participant is not within the same tenant (also referred to as cross-tenant) as the ACS resource. Cross-tenants’ participants are classified as external users invited by a resource tenant to join and collaborate during a call.

|     Property                  |       Description                  |
|-------------------------------|-------------------------|
|     `time`                      |     The timestamp (UTC) of when the log was generated.     |
|     `operationName`             |     The operation associated with log record.                |
|     `operationVersion`          |     The api-version associated with the operation, if the `operationName` was performed using an API. If there is no API that corresponds to this operation, the version represents the version of that operation in case the properties associated with the operation change in the future.                                                   |
|     `category`                  |     The log category of the event. Category is the granularity at which you can enable or disable logs on a particular resource. The properties that appear within the `properties` blob of an event are the same within a particular log category and resource type.   |
|     `correlationId`     |    `correlationId` is the unique ID for a Call. The `correlationId` identifies correlated events from all of the participants and endpoints that connect during a single Call, and it can be used to join data from different logs.  If you ever need to open a support case with Microsoft, the `correlationId` is used to easily identify the Call you're troubleshooting.                                                                                                                                                                      |
|     `identifier`                |     This value is the unique ID for the user. The identity can be an Azure Communications Services user, Azure AD user ID, Teams anonymous user ID or Teams bot ID. You can use this ID to correlate user events across different logs.                  |
|     `callStartTime`             |     A timestamp for the start of the call, based on the first attempted connection from any Endpoint.                                                  |
|     `callDuration`              |     The duration of the Call expressed in seconds, based on the first attempted connection and end of the last connection between two endpoints.               |
|     `callType`                  |     Contains either `"P2P"` or `"Group"`. A `"P2P"` Call is a direct 1:1 connection between only two, non-server endpoints. A `"Group"` Call is a Call that has more than two endpoints or is created as `"Group"` Call prior to the connection.                  |
|     `teamsThreadId`             |     This ID is only relevant when the Call is organized as a Microsoft Teams meeting, representing the Microsoft Teams – Azure Communication Services interoperability use-case. This ID is exposed in operational logs. You can also get this ID through the Chat APIs.   |
|     `participantId`             |     This ID is generated to represent the two-way connection between a `"Participant"` Endpoint (`endpointType` = `"Server"`) and the server. When `callType` = `"P2P"`, there is a direct connection between two endpoints, and no `participantId` is generated.       |
|     `participantStartTime`      |     Timestamp for beginning of the first connection attempt by the participant.                                                                                 |
|     `participantDuration`       |     The duration of each Participant connection in seconds, from `participantStartTime` to the timestamp when the connection is ended.                                 |
|     `participantEndReason`      |     Contains Calling SDK error codes emitted by the SDK when relevant for each `participantId`. See Calling SDK error codes.            |
|     `endpointId`                |     Unique ID that represents each Endpoint connected to the call, where the Endpoint type is defined by `endpointType`. When the value is `null`, the connected entity is the Communication Services server (`endpointType`= `"Server"`). `EndpointId` can sometimes persist for the same user across multiple calls (`correlationId`) for native clients. The number of `endpointId`s determine the number of Call Summary Logs. A distinct Summary Log is created for each `endpointId`.    |
|     `endpointType`              |     This value describes the properties of each Endpoint connected to the Call. Can contain `"Server"`, `"VOIP"`, `"PSTN"`, `"BOT"`, or `"Unknown"`.               |
|     `sdkVersion`                |     Version string for the Communication Services Calling SDK version used by each relevant Endpoint. (Example: `"1.1.00.20212500"`)                                               |
|     `osVersion`                 |     String that represents the operating system and version of each Endpoint device.                                                                        |
|     `participantTenantId`               |    The ID of the Microsoft tenant associated with the participant. This field is used to guide cross-tenant redaction.


### Call Diagnostic log schema
Call Diagnostic Logs provide important information about the Endpoints and the media transfers for each Participant, and as measurements that help to understand quality issues.
For each Endpoint within a Call, a distinct Call Diagnostic Log is created for outbound media streams (audio, video, etc.) between Endpoints.
In a P2P Call, each log contains data relating to each of the outbound stream(s) associated with each Endpoint. In Group Calls the participantId serves as key identifier to join the related outbound logs into a distinct Participant connection. Note that Call diagnostic logs remain intact and are the same regardless of the participant tenant.

> [!NOTE]
> In this document, P2P and group calls are by default within the same tenant, for all call scenarios that are cross-tenant they are specified accordingly throughout the document.

|     Property              |     Description                     |
|---------------------------|-------------------------------------|
|     `operationName`         |     The operation associated with log record.   |
|     `operationVersion`      |     The `api-version` associated with the operation, if the `operationName` was performed using an API. If there is no API that corresponds to this   operation, the version represents the version of that operation in case the properties associated with the operation change in the future.                                   |
|     `category`              |     The log category of the event. Category is the granularity at which you can enable or disable logs on a particular resource. The properties   that appear within the `properties` blob of an event are the same within a particular log category and resource type.             |
|     `correlationId`     |     The `correlationId` identifies correlated events from all of the participants and endpoints that connect during a single Call. `correlationId` is the unique ID for a Call. If you ever need to open a support case with Microsoft, the `correlationId` can used to easily identify the Call you're troubleshooting.                       |
|     `participantId`         |     This ID is generated to represent the two-way connection between a "Participant" Endpoint (`endpointType` =  `“Server”`) and the server. When `callType`   = `"P2P"`, there is a direct connection between two endpoints, and no `participantId` is generated.       |
|     `identifier`            |     This valueis the unique ID for the user. The identity can be an Azure Communications Services user, Azure AD user ID, Teams object ID or Teams bot ID. You can use this ID to correlate user events across different logs.                  |
|     `endpointId`            |     Unique ID that represents each Endpoint connected to the call, with Endpoint type defined  by `endpointType`.   When the value is `null`, it means that the connected entity is the Communication Services server.  `EndpointId` can persist for the same user across multiple calls (`correlationId`) for native clients but are unique for every Call when the client is a web browser.                    |
|     `endpointType`          |     This value describes the properties of each `endpointId`. Can contain  `“Server”`, `“VOIP”`, `“PSTN”`, `“BOT”`, `"Voicemail"`, `"Anonymous"`, or `"Unknown"`.           |
|     `mediaType`             |     This string value describes the type of media being transmitted between endpoints within each stream. Possible values include `“Audio”`, `“Video”`, `“VBSS”` (Video-Based Screen Sharing), and `“AppSharing”`.                    |
|     `streamId`              |     Non-unique integer which, together with `mediaType`, can be used to uniquely identify streams of the same `participantId`.|
|     `transportType`         |     String value which describes the network transport protocol per `participantId`. Can contain `"UDP”`, `“TCP”`, or `“Unrecognized”`. `"Unrecognized"` indicates that the system could not determine if the `transportType` was TCP or UDP.              |
|     `roundTripTimeAvg`      |     This metric is the average time it takes to get an IP packet from one Endpoint to another within a `participantDuration`. This network propagation delay is related to the physical distance between the two points, the speed of light, and any overhead taken by the various routers in between. The latency is measured as one-way or Round-trip Time (RTT).  Its value expressed in milliseconds, and an RTT greater than 500ms should be considered as negatively impacting the Call quality.          |
|     `roundTripTimeMax`      |     The maximum RTT (ms) measured per media stream during a `participantDuration` in a group Call or `callDuration` in a P2P Call.        |
|     `jitterAvg`             |     This metric is the average change in delay between successive packets. Azure Communication Services can adapt to some levels of jitter through buffering. It's only when the jitter exceeds the buffering, which is approximately at `jitterAvg` >30 ms, that a negative quality impact is likely occurring. The packets arriving at different speeds cause a speaker's voice to sound robotic. This metric is measured per media stream over the `participantDuration` in a group Call or `callDuration` in a P2P Call.      |
|     `jitterMax`             |     This metric is the maximum jitter value measured between packets per media stream. Bursts in network conditions can cause issues in the audio/video traffic flow.  |
|     `packetLossRateAvg`     |     This metric is the average percentage of packets that are lost. Packet loss directly affects audio quality—from small, individual lost packets that have almost no impact to back-to-back burst losses that cause audio to cut out completely. The packets being dropped and not arriving at their intended destination cause gaps in the media, resulting in missed  syllables and words, and choppy video and sharing. A packet loss rate of greater than 10% (0.1) should be considered a rate that's likely having a negative quality impact. This metric is measured per media stream  over the `participantDuration` in a group Call or `callDuration` in a P2P Call.    |
|     `packetLossRateMax`     |     This value represents the maximum packet loss rate (%) per media stream over the `participantDuration` in a group Call or `callDuration` in a P2P Call. Bursts in network conditions can cause issues in the audio/video traffic flow.                                                                                                                                
### P2P vs. Group Calls

There are two types of Calls (represented by `callType`): P2P and Group. 

**P2P** calls are a connection between only two Endpoints, with no server Endpoint. P2P calls are initiated as a Call between those Endpoints and are not created as a group Call event prior to the connection.

  :::image type="content" source="../media/call-logs-azure-monitor/p2p-diagram.png" alt-text="Screenshot displays P2P call across 2 endpoints."::: 

**Group** Calls include any Call that has more than 2 Endpoints connected. Group Calls include a server Endpoint, and the connection between each Endpoint and the server. P2P Calls that add an additional Endpoint during the Call cease to be P2P, and they become a Group Call. You can determine the timeline of when each endpoints joined the call by using the `participantStartTime` and `participantDuration` metrics.


  :::image type="content" source="../media/call-logs-azure-monitor/group-call-version-a.png" alt-text="Screenshot displays group call across multiple endpoints.":::


## Log Structure

Two types of logs are created: **Call Summary** logs and **Call Diagnostic** logs. 

Call Summary Logs contain basic information about the Call, including all the relevant IDs, timestamps, Endpoint and SDK information. For each participant within a call, a distinct call summary log is created (if someone rejoins a call, they have the same EndpointId, but a different ParticipantId, so there can be two Call Summary logs for that endpoint).

Call Diagnostic Logs contain information about the Stream as well as a set of metrics that indicate quality of experience measurements. For each Endpoint within a Call (including the server), a distinct Call Diagnostic Log is created for each media stream (audio, video, etc.) between Endpoints. In a P2P Call, each log contains data relating to each of the outbound stream(s) associated with each Endpoint. In a Group Call, each stream associated with `endpointType`= `"Server"` creates a log containing data for the inbound streams, and all other streams creates logs containing data for the outbound streams for all non-sever endpoints. In Group Calls, use the `participantId` as the key to join the related inbound/outbound logs into a distinct Participant connection.

### Example 1: P2P Call

The below diagram represents two endpoints connected directly in a P2P Call. In this example, 2 Call Summary Logs would be created (one per `participantID`) and four Call Diagnostic Logs would be created (one per media stream). Each log contains data relating to the outbound stream of the `participantID`.

:::image type="content" source="../media/call-logs-azure-monitor/example-1-p2p-call-same-tenant.png" alt-text="Screenshot displays P2P call within the same tenant.":::


### Example 2: Group Call

The below diagram represents a Group Call example with three `participantIDs`, which means three `participantIDs` (`endpointIds` can potentially appear in multiple Participants, e.g. when rejoining a Call from the same device) and a Server Endpoint. One Call Summary Logs would be created per `participantID`, and four Call Diagnostic Logs would be created relating to each `participantID`, one for each media stream. 

:::image type="content" source="../media/call-logs-azure-monitor/example-2-group-call-same-tenant.png" alt-text="Screenshot displays group call within the same tenant.":::
                                                                   
### Example 3: P2P Call cross-tenant
The below diagram represents two participants across multiple tenants that are connected directly in a P2P Call. In this example, one Call Summary Logs would be created (one per participant) with redacted OS and SDK versioning and four Call Diagnostic Logs would be created (one per media stream). Each log contains data relating to the outbound stream of the `participantID`.
 
:::image type="content" source="../media/call-logs-azure-monitor/example-3-p2p-call-cross-tenant.png" alt-text="Screenshot displays P2P call cross-tenant.":::


### Example 4: Group Call cross-tenant
The below diagram represents a Group Call example with three `participantIds` across multiple tenants. One Call Summary Logs would be created per participant with redacted OS and SDK versioning, and four Call Diagnostic Logs would be created relating to each `participantId` , one for each media stream. 

:::image type="content" source="../media/call-logs-azure-monitor/example-4-group-call-cross-tenant.png" alt-text="Screenshot displays group call cross-tenant.":::


> [!NOTE]
> Only outbound diagnostic logs can be supported in this release. 
> Please note that participants and bots identity are treated the same way, as a result OS and SDK versioning associated to the bot and the participant can be redacted 

## Sample Data

### P2P Call

Shared fields for all logs in the call:

```json
"time":                     "2021-07-19T18:46:50.188Z",
"resourceId":               "SUBSCRIPTIONS/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/RESOURCEGROUPS/ACS-TEST-RG/PROVIDERS/MICROSOFT.COMMUNICATION/COMMUNICATIONSERVICES/ACS-PROD-CCTS-TESTS",
"correlationId":            "8d1a8374-344d-4502-b54b-ba2d6daaf0ae",
```

#### Call Summary Logs
Call Summary Logs have shared operation and category information:

```json
"operationName":            "CallSummary",
"operationVersion":         "1.0",
"category":                 "CallSummary",

```
Call Summary for VoIP user 1
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

Call summary for VoIP user 2
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
Call Summary Logs crossed tenants: Call summary for VoIP user 1
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
> P2P or group call logs emitted have OS, and SDK version redacted regardless is the participant or bot’s tenant

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

#### Call Diagnostic Logs
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
### Group Call

The data would be generated in three Call Summary Logs and 6 Call Diagnostic Logs. Shared fields for all logs in the Call:
```json
"time":                     "2021-07-05T06:30:06.402Z",
"resourceId":               "SUBSCRIPTIONS/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/RESOURCEGROUPS/ACS-TEST-RG/PROVIDERS/MICROSOFT.COMMUNICATION/COMMUNICATIONSERVICES/ACS-PROD-CCTS-TESTS",
"correlationId":            "341acde7-8aa5-445b-a3da-2ddadca47d22",
```

#### Call Summary Logs
Call Summary Logs have shared operation and category information:
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
Call Summary Logs cross-tenant
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
#### Call Diagnostic Logs
Call diagnostics logs share operation information:
```json
"operationName":            "CallDiagnostics",
"operationVersion":         "1.0",
"category":                 "CallDiagnostics",
```
Diagnostic log for audio stream from VoIP Endpoint 1 to Server Endpoint:
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
Diagnostic log for audio stream from Server Endpoint to VoIP Endpoint 1:
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
Diagnostic log for audio stream from VoIP Endpoint 3 to Server Endpoint:
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
Diagnostic log for audio stream from Server Endpoint to VoIP Endpoint 3:
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
### Error Codes
The `participantEndReason` contains a value from the set of Calling SDK error codes. You can refer to these codes to troubleshoot issues during the call, per Endpoint. See [troubleshooting in Azure communication Calling SDK error codes](../../troubleshooting-info.md?tabs=csharp%2cios%2cdotnet#calling-sdk-error-codes)
