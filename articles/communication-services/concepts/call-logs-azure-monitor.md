---
title: Azure Communication Services - Call Summary and Call Diagnostic Logs
titleSuffix: An Azure Communication Services concept document
description: Learn about Call Summary and Call Diagnostic Logs in Azure Monitor
author:  timmitchell
services: azure-communication-services

ms.author: timmitchell
ms.date: 07/22/2021
ms.topic: conceptual
ms.service: azure-communication-services
---

# Call Summary and Call Diagnostic Logs

[!INCLUDE [Private Preview Notice](../includes/private-preview-include.md)]

## Data Concepts

### Entities and IDs

A *Call*, as it relates to the entities represented in the data, is an abstraction represented by the `correlationId`. `CorrelationId`s are unique per Call, and are time-bound by `callStartTime` and `callDuration`. Every Call is an event that contains data from two or more *Endpoints*, which represent the various human, bot, or server participants in the Call.

A *Participant* (`participantId`) is present only when the Call is a *Group* Call, as it represents the connection between an Endpoint and the server. 

An *Endpoint* is the most unique entity, represented by `endpointId`. `EndpointType` tells you whether the Endpoint represents a human user (PSTN, VoIP), a Bot (Bot), or the server that is managing multiple Participants within a Call. When an `endpointType` is `"Server"`, the Endpoint will not be assigned a unique ID. By looking at `endpointType` and the number of `endpointId`s, you can always determine how many users and other non-human Participants (bots, servers) are on the Call. Native SDKs (like the Android calling SDK) reuse the same `endpointId` for a user across multiple Calls, thus enabling an understanding of experience across sessions. This differs from web-based Endpoints, which will always generate a new `endpointId` for each new Call.

A *Stream* is the most granular entity, as there is one Stream per direction (inbound/outbound) and `mediaType` (e.g. audio, video).  

### P2P vs. Group Calls

There are two types of Calls (represented by `callType`): P2P and Group. 

**P2P** calls are a connection between only two Endpoints, with no server Endpoint. P2P calls are initiated as a Call between those Endpoints and are not created as a group Call event prior to the connection.

:::image type="content" source="media\call-logs-images\call-logs-concepts-p2p.png" alt-text="p2p call":::

**Group** Calls include any Call that's created ahead of time as a meeting/calendar event and any Call that has more than 2 Endpoints connected. Group Calls will include a server Endpoint, and the connection between each Endpoint and the server constitutes a Participant. P2P Calls that add an additional Endpoint during the Call cease to be P2P, and they become a Group Call. By viewing the `participantStartTime` and `participantDuration`, the timeline of when each Endpoint joined the Call can be determined.

:::image type="content" source="media\call-logs-images\call-logs-concepts-group.png" alt-text="Group Call":::

## Log Structure
Two types of logs are created: **Call Summary** logs and **Call Diagnostic** logs. 

Call Summary Logs contain basic information about the Call, including all the relevant IDs, timestamps, Endpoint and SDK information. For each Endpoint within a Call (not counting the Server), a distinct Call Summary Log will be created.

Call Diagnostic Logs contain information about the Stream as well as a set of metrics that indicate quality of experience measurements. For each Endpoint within a Call (including the server), a distinct Call Diagnostic Log is created for each data stream (audio, video, etc.) between Endpoints. In a P2P Call, each log contains data relating to each of the outbound stream(s) associated with each Endpoint. In a Group Call, each stream associated with `endpointType`= `"Server"` will create a log containing data for the inbound streams, and all other streams will create logs containing data for the outbound streams for all non-sever endpoints. In Group Calls, use the `participantId` as the key to join the related inbound/outbound logs into a distinct Participant connection.

### Example 1: P2P Call

The below diagram represents two endpoints connected directly in a P2P Call. In this example, 2 Call Summary Logs would be created (1 per `endpointId`) and 4 Call Diagnostic Logs would be created (1 per media stream). Each log will contain data relating to the outbound stream of the `endpointId`.

:::image type="content" source="media\call-logs-images\call-logs-p2p-streams.png" alt-text="p2p Call streams":::


### Example 2: Group Call

The below diagram represents a Group Call example with three `particpantIds`, which means three `endpointIds` (`endpointIds` can potentially appear in multiple Participants, e.g. when rejoining a Call from the same device) and a Server Endpoint. For `participantId` 1, two Call Summary Logs would be created: one for for `endpointId`, and another for the server. Four Call Diagnostic Logs would be created relating to `participantId` 1, one for each media stream. The three logs with `endpointId` 1 would contain data relating to the outbound media streams, and the one log with `endpointId = null, endpointType = "Server"` would contain data relating to the inbound stream.

:::image type="content" source="media\call-logs-images\call-logs-concepts-group-call-endpoint-detail.png" alt-text="group Call detail":::

## Data Definitions

### Call Summary Log
The Call Summary Log contains data to help you identify key properties of all Calls. A different Call Summary Log will be created per each `participantId` (`endpointId` in the case of P2P calls) in the Call.

|     Property                  |     Description                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
|-------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|     time                      |     The timestamp (UTC) of when the log was generated.                                                                                                                                                                                                                                                                                                                                                                                                                       |
|     operationName             |     The operation associated with log record.                                                                                                                                                                                                                                                                                                                                                                                                                                |
|     operationVersion          |     The api-version associated with the operation, if the `operationName` was performed using an API. If there is no API that corresponds to this operation, the version represents the version of that operation in case the properties associated with the operation change in the future.                                                                                                                                                                           |
|     category                  |     The log category of the event. Category is the granularity at which you can enable or disable logs on a particular resource. The properties that appear within the `properties` blob of an event are the same within a particular log category and resource type.                                                                                                                                                                                                    |
|     correlationIdentifier     |     The `correlationIdentifier` identifies correlated events from all of the participants and endpoints that connect during a single Call. `correlationIdentifier` is the unique ID for a Call. If you ever need to open a support case with Microsoft, the `correlationID` will be used to easily identify the Call you're troubleshooting.                                                                                                                                                                      |
|     identifier                |     This is the unique ID for the user, matching the identity assigned by the Authentication service (MRI).                                                                                                                                                                                                                                                                                                                                                              |
|     callStartTime             |     A timestamp for the start of the call, based on the first attempted connection from any Endpoint.                                                                                                                                                                                                                                                                                                                                                                   |
|     callDuration              |     The duration of the Call expressed in seconds, based on the first attempted connection and end of the last connection between two endpoints.                                                                                                                                                                                                                                                                                                                         |
|     callType                  |     Will contain either `"P2P"` or `"Group"`. A `"P2P"` Call is a direct 1:1 connection between only two, non-server endpoints. A `"Group"` Call is a Call that has more than two endpoints or is created as `"Group"` Call prior to the connection.                                                                                                                                                                                                                                 |
|     teamsThreadId             |     This ID is only relevant when the Call is organized as a Microsoft Teams meeting, representing the Microsoft Teams – Azure Communication Services interoperability use-case. This ID is exposed in operational logs. You can also get this ID through the Chat APIs.                                                                                                                                                                                              |
|     participantId             |     This ID is generated to represent the two-way connection between a `"Participant"` Endpoint (`endpointType` = `"Server"`) and the server. When `callType` = `"P2P"`, there is a direct connection between two endpoints, and no `participantId` is generated.                                                                                                                                                                                                               |
|     participantStartTime      |     Timestamp for beginning of the first connection attempt by the participant.                                                                                                                                                                                                                                                                                                                                                                                            |
|     participantDuration       |     The duration of each Participant connection in seconds, from `participantStartTime` to the timestamp when the connection is ended.                                                                                                                                                                                                                                                                                                                                             |
|     participantEndReason      |     Contains Calling SDK error codes emitted by the SDK when relevant for each `participantId`. See Calling SDK error codes below.                                                                                                                                                                                                                                                                                                                          |
|     endpointId                |     Unique ID that represents each Endpoint connected to the call, where the Endpoint type is defined by `endpointType`. When the value is `null`, the connected entity is the Communication Services server (`endpointType`= `"Server"`). `EndpointId` can sometimes persist for the same user across multiple calls (`correlationIdentifier`) for native clients. The number of `endpointId`s will determine the number of Call Summary Logs. A distinct Summary Log is created for each `endpointId`.    |
|     endpointType              |     This value describes the properties of each Endpoint connected to the Call. Can contain `"Server"`, `"VOIP"`, `"PSTN"`, `"BOT"`, or `"Unknown"`.                                                                                                                                                                                                                                                                                                                               |
|     sdkVersion                |     Version string for the Communication Services Calling SDK version used by each relevant Endpoint. (Example: `"1.1.00.20212500"`)                                                                                                                                                                                                                                                                                                                                                          |
|     osVersion                 |     String that represents the operating system and version of each Endpoint device.                                                                                                                                                                                                                                                                                                                                                                                       |

### Call Diagnostic Log
Call Diagnostic Logs provide important information about the Endpoints and the media transfers for each Participant, as well as measurements that help to understand quality issues. 

|     Property              |     Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
|---------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|     operationName         |     The operation associated with log record.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
|     operationVersion      |     The `api-version` associated with the operation, if the `operationName` was performed using an API. If there is no API that corresponds to this   operation, the version represents the version of that operation in case the properties associated with the operation change in the future.                                                                                                                                                                                                                                                                                                                                                                  |
|     category              |     The log category of the event. Category is the granularity at which you can enable or disable logs on a particular resource. The properties   that appear within the `properties` blob of an event are the same within a particular log category and resource type.                                                                                                                                                                                                                                                                                                                                                                                         |
|     correlationIdentifier     |     The `correlationIdentifier` identifies correlated events from all of the participants and endpoints that connect during a single Call. `correlationIdentifier` is the unique ID for a Call. If you ever need to open a support case with Microsoft, the `correlationID` will be used to easily identify the Call you're troubleshooting.                                                                                                                                                                                                                                                                                                                                                                         |
|     participantId         |     This ID is generated to represent the two-way connection between a "Participant" Endpoint (`endpointType` =  `“Server”`) and the server. When `callType`   = `"P2P"`, there is a direct connection between two endpoints, and no `participantId` is generated.                                                                                                                                                                                                                                                                                                                                                                                                |
|     identifier            |     This ID represents the user identity, as defined by the Authentication service. Use this ID to correlate different events across calls and services.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
|     endpointId            |     Unique ID that represents each Endpoint connected to the call, with Endpoint type defined  by `endpointType`.   When the value is `null`, it means that the connected entity is the Communication Services server.  `EndpointId` can persist for the same user across multiple calls (`correlationIdentifier`) for native clients but will be unique for every Call when the client is a web browser.                                                                                                                                                                                                                                                                                  |
|     endpointType          |     This value describes the properties of each `endpointId`. Can contain  `“Server”`, `“VOIP”`, `“PSTN”`, `“BOT”`, or `“Unknown”`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
|     mediaType             |     This string value describes the type of media being transmitted between endpoints within each stream. Possible values include `“Audio”`, `“Video”`, `“VBSS”` (Video-Based Screen Sharing), and `“AppSharing”`.                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
|     streamId              |     Non-unique integer which, together with `mediaType`, can be used to uniquely identify streams of the same `participantId`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
|     transportType         |     String value which describes the network transport protocol per `participantId`. Can contain `"UDP”`, `“TCP”`, or `“Unrecognized”`. `"Unrecognized"` indicates that the system could not determine if the `transportType` was TCP or UDP.                                                                                                                                                                                                                                                                                                                                                                                                                                   |
|     roundTripTimeAvg      |     This is the average time it takes to get an IP packet from one Endpoint to another within a `participantDuration`. This network propagation delay is essentially tied to physical distance between the two points and the speed of light, including additional overhead taken by the various routers in between. The latency is measured as one-way or Round-trip Time (RTT).  Its value expressed in milliseconds, and an RTT greater than 500ms should be considered as negatively impacting the Call quality.                                                                                                                                                                      |
|     roundTripTimeMax      |     The maximum RTT (ms) measured per media stream during a `participantDuration` in a group Call or `callDuration` in a P2P Call.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
|     jitterAvg             |     This is the average change in delay between successive packets. Azure Communication Services can adapt to some levels of jitter through buffering. It's only when the jitter exceeds the buffering, which is approximately at `jitterAvg` >30 ms, that a negative quality impact is likely occurring. The packets arriving at different speeds cause a speaker's voice to sound robotic. This is measured per media stream over the `participantDuration` in a group Call or `callDuration` in a P2P Call.                                                                                                                                              |
|     jitterMax             |     The is the maximum jitter value measured between packets per media stream. Bursts in network conditions can cause issues in the audio/video traffic flow.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
|     packetLossRateAvg     |     This is the average percentage of packets that are lost. Packet loss directly affects audio quality—from small, individual lost packets that have almost no impact to back-to-back burst losses that cause audio to cut out completely. The packets being dropped and not arriving at their intended destination cause gaps in the media, resulting in missed  syllables and words, and choppy video and sharing. A packet loss rate of greater than 10% (0.1) should be considered a rate that's likely having a negative quality impact. This is measured per media stream  over the `participantDuration` in a group Call or `callDuration` in a P2P Call.    |
|     packetLossRateMax     |     This value represents the maximum packet loss rate (%) per media stream over the `participantDuration` in a group Call or `callDuration` in a P2P Call. Bursts in network conditions can cause issues in the audio/video traffic flow.                                                                                                                                                                                                                                                                                                                                                                                                                  |
|                           |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |

### Error Codes
The `participantEndReason` will contain a value from the set of Calling SDK error codes. You can refer to these codes to troubleshoot issues during the call, per Endpoint.

|     Error code                 |     Description                                                                                                       |     Action to take                                                                                                                                                                                                                                                             |
|--------------------------------|-----------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|     0                          |     Success                                                                                                           |     Call (P2P) or Participant (Group) terminated correctly.                                                                                                                                                                                                                    |
|     403                        |     Forbidden / Authentication failure.                                                                               |     Ensure that your Communication Services token is   valid and not expired. If you are using Teams Interoperability, make sure   your Teams tenant has been added to the preview access allowlist. To   enable/disable Teams tenant interoperability, complete this form.    |
|     404                        |     Call not found.                                                                                                   |     Ensure that the number you're calling (or Call   you're joining) exists.                                                                                                                                                                                                   |
|     408                        |     Call controller timed out.                                                                                        |     Call Controller timed out waiting for protocol   messages from user endpoints. Ensure clients are connected and available.                                                                                                                                                 |
|     410                        |     Local media stack or media infrastructure error.                                                                  |     Ensure that you're using the latest SDK in a   supported environment.                                                                                                                                                                                                      |
|     430                        |     Unable to deliver message to client application.                                                                  |     Ensure that the client application is running and   available.                                                                                                                                                                                                             |
|     480                        |     Remote client Endpoint not registered.                                                                            |     Ensure that the remote Endpoint is available.                                                                                                                                                                                                                              |
|     481                        |     Failed to handle incoming Call.                                                                                   |     File a support request through the Azure portal.                                                                                                                                                                                                                           |
|     487                        |     Call canceled, locally declined, ended due to an Endpoint   mismatch issue, or failed to generate media offer.    |     Expected behavior.                                                                                                                                                                                                                                                         |
|     490, 491, 496, 487, 498    |     Local Endpoint network issues.                                                                                    |     Check your network.                                                                                                                                                                                                                                                        |
|     500, 503, 504              |     Communication Services infrastructure error.                                                                      |     File a support request through the Azure portal.                                                                                                                                                                                                                           |
|     603                        |     Call globally declined by remote Communication Services Participant.                                             |     Expected behavior.                                                                                                                                                                                                                                                         |
|     Unknown                    |     Non-standard end reason (not part of the standard SIP codes).                                                      |                                                                                                                                                                                                                                                                                |

## Call Examples and Sample Data

### P2P Call

:::image type="content" source="media\call-logs-images\call-logs-concepts-p2p-sample.png" alt-text="P2P Sample Log Example":::

Shared fields for all logs in the call:

```
"time":                     "2021-07-19T18:46:50.188Z",
"resourceId":               "SUBSCRIPTIONS/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/RESOURCEGROUPS/ACS-PROD-CCTS-TESTS/PROVIDERS/MICROSOFT.COMMUNICATION/COMMUNICATIONSERVICES/ACS-PROD-CCTS-TESTS",
"correlationId":            "8d1a8374-344d-4502-b54b-ba2d6daaf0ae",
```

#### Call Summary Logs
Call Summary Logs have shared operation and category information:

```
"operationName":            "CallSummary",
"operationVersion":         "1.0",
"category":                 "CallSummaryPRIVATEPREVIEW",

```
Call Summary for VoIP user 1
```
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
```
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
#### Call Diagnostic Logs
Call diagnostics logs share operation information:
```
"operationName":            "CallDiagnostics",
"operationVersion":         "1.0",
"category":                 "CallDiagnosticsPRIVATEPREVIEW",
```
Diagnostic log for audio stream from VoIP Endpoint 1 to VoIP Endpoint 2:
```
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
```
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
```
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
In the following example, there are three users in a Group Call, two connected via VOIP, and one connected via PSTN. All are using only Audio. 

:::image type="content" source="media\call-logs-images\call-logs-concepts-group-sample.png" alt-text="Group Call Sample Log Example":::

The data would be generated in three Call Summary Logs and 6 Call Diagnostic Logs.

Shared fields for all logs in the Call:
```
"time":                     "2021-07-05T06:30:06.402Z",
"resourceId":               "SUBSCRIPTIONS/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/RESOURCEGROUPS/ACS-PROD-CCTS-TESTS/PROVIDERS/MICROSOFT.COMMUNICATION/COMMUNICATIONSERVICES/ACS-PROD-CCTS-TESTS",
"correlationId":            "341acde7-8aa5-445b-a3da-2ddadca47d22",
```

#### Call Summary Logs
Call Summary Logs have shared operation and category information:
```
"operationName":            "CallSummary",
"operationVersion":         "1.0",
"category":                 "CallSummaryPRIVATEPREVIEW",
```

Call summary for VoIP Endpoint 1:
```
"properties": {
    "identifier":               "acs:1797dbb3-f982-47b0-b98e-6a76084454f1_0000000b-1531-729f-ac00-343a0d00d975",
    "callStartTime":            "2021-07-05T06:16:40.240Z",
    "callDuration":             87,
    "callType":                 "Group",
    "teamsThreadId":            "19:meeting_MjZiOTAyN2YtZWU1Yi00ZTZiLTk2ZDUtYTZlM2I2ZjgxOTkw@thread.v2",
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
```
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
```
"properties": {
    "identifier":               "null",
    "callStartTime":            "2021-07-05T06:16:40.240Z",
    "callDuration":             87,
    "callType":                 "Group",
    "teamsThreadId":            "19:meeting_MjZiOTAyN2YtZWU1Yi00ZTZiLTk2ZDUtYTZlM2I2ZjgxOTkw@thread.v2",
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
#### Call Diagnostic Logs
Call diagnostics logs share operation information:
```
"operationName":            "CallDiagnostics",
"operationVersion":         "1.0",
"category":                 "CallDiagnosticsPRIVATEPREVIEW",
```
Diagnostic log for audio stream from VoIP Endpoint 1 to Server Endpoint:
```
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
```
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
```
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
```
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

## Next Steps

- Learn more about [Logging and Diagnostics](./logging-and-diagnostics.md)
