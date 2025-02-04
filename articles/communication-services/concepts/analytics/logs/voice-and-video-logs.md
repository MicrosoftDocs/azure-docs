---
title: Azure Communication Services Voice Calling and Video Calling logs 
titleSuffix: An Azure Communication Services concept article
description: Learn about logging for Azure Communication Services Voice Calling and Video Calling.
author:  amagginetti
services: azure-communication-services

ms.author: amagginetti
ms.date: 03/21/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: calling
---

# Overview of Azure Communication Services Voice Calling and Video Call logs

Azure Communication Services provides logging capabilities that you can use to monitor and debug your Communication Services solution. Configure these capabilities through the Azure portal.

The content in this article refers to logs enabled through [Azure Monitor](/azure/azure-monitor/overview) (see also [FAQ](/azure/azure-monitor/overview#frequently-asked-questions)). To enable these logs for Communication Services, see [Enable logging in diagnostic settings](../enable-logging.md).

## How to use Call Logs
By collecting call logs in a log analytics resource you can monitor your call usage and improve your call quality. 

There are two main tools you can use to monitor your calls and improve call quality. 
1. [Voice and video Insights Dashboard](../insights/voice-and-video-insights.md)
1. [Call Diagnostics](../../voice-video-calling/call-diagnostics.md)

We recommend using the **[Voice and video Insights Dashboard](../insights/voice-and-video-insights.md)** dashboards to start 
any quality investigations, and using **[Call Diagnostics](../../voice-video-calling/call-diagnostics.md)** as needed to explore individual calls when you need granular detail.

## Data concepts

The following high-level descriptions of data concepts are specific to Voice Calling and Video Calling. These concepts are important to review so that you can understand the meaning of the data captured in the logs.

### Entities and IDs

Become familiar with the following terms:

- **Call**: As represented in the data, a call is an abstraction depicted by `correlationId`. Values for `correlationId` are unique for each call, and are time-bound based on `callStartTime` and `callDuration`.

- **Participant**: Represents the connection between an endpoint and the server. A participant (`participantId`) is present only when the call is a group call.

- **Endpoint**: The most unique entity, represented by `endpointId`. Every call is an event that contains data from two or more endpoints. Endpoints represent the participants in the call.

  `EndpointType` tells you whether the endpoint is a human user (PSTN or VoIP), a bot, or the server that's managing multiple participants within a call. When an `endpointType` value is `"Server"`, the endpoint isn't assigned a unique ID. You can analyze `endpointType` and the number of `endpointId` values to determine how many users and other nonhuman participants (bots and servers) join a call.

  Native SDKs for Android and iOS reuse the same `endpointId` value for a user across multiple calls, so you can get an understanding of experiences across sessions. This process differs from web-based endpoints, which always generate a new `endpointId` value for each new call.

- **Stream**: The most granular entity. There's one stream for each direction (inbound or outbound) and `mediaType` value (for example, `Audio` or `Video`).  


### P2P vs. group calls

There are two types of calls, as represented by `callType`:

- **Peer to Peer (P2P) call**: A connection between only two endpoints, with no server endpoint. P2P calls are initiated as a call between those endpoints and aren't created as a group call event before the connection.

  :::image type="content" source="../media/call-logs-azure-monitor/p2p-diagram.png" alt-text="Diagram showing a P2P call across two endpoints.":::

- **Group call**: Any call that has more than two endpoints connected. Group calls include a server endpoint and the connection between each endpoint and the server. P2P calls that add another endpoint during the call cease to be P2P, and they become a group call. You can determine the timeline of when each endpoint joined the call by using the `participantStartTime` and `participantDuration` metrics.

  :::image type="content" source="../media/call-logs-azure-monitor/group-call-version-a.png" alt-text="Diagram showing a group call across multiple endpoints.":::

## Log structure 

Azure Communication Services creates six types of call logs:

- **Call Summary Logs**: Contain basic information about the call, including all the relevant IDs, time stamps, endpoints, and SDK information. For each participant within a call, Communication Services creates a distinct call summary log.

  If someone rejoins a call, that participant has the same `EndpointId` value but a different `ParticipantId` value. That endpoint can then have two call summary logs.

[Call Summary Log Schema](call-summary-log-schema.md)

- **Call Diagnostic Logs**: Contain information about the stream, along with a set of metrics that indicate quality of experience measurements. For each `EndpointId` within a call (including the server), Azure Communication Services creates a distinct call diagnostic log for each media stream (audio or video, for example) between endpoints.

To learn more see: [Call Diagnostic Log Schema](call-diagnostics-log-schema.md)

- **Call Client Operations Logs**: Contain detailed call client events. These log events are generated for each `EndpointId` in a call and the number of event logs generated depends on the operations the participant performed during the call. 

To learn more see: [Call Client Operations Log Schema](call-client-operations-log-schema.md)

- **Call Client Media Statistics Logs**: Contain detailed media stream values. These logs are generated for each media stream in a call. For each `EndpointId` within a call (including the server), Azure Communication Services creates a distinct log for each media stream (audio or video, for example) between endpoints. The volume of data generated in each log depends on the duration of call and number of media steams in the call. 

In a P2P call, each log contains data that relates to each of the outbound streams associated with each endpoint. In a group call, each stream associated with `endpointType` = `"Server"` creates a log that contains data for the inbound streams. All other streams create logs that contain data for the outbound streams for all nonserver endpoints. In group calls, use the `participantId` value as the key to join the related inbound and outbound logs into a distinct participant connection.

To learn more see: [Call Client Media Statistics Time Series Log Schema](call-client-media-statistics-log-schema.md)

- **End of Call Survey Logs**
These logs are populated when the web calling client submits a survey at the end of the call. You can use these logs to learn the subjective perception of your call quality from your users. 

To learn more see: [End of Call Survey overview](../../voice-video-calling/end-of-call-survey-concept.md)

- **Call Metric Logs**
These logs contain aggregated calling metrics in daily bins based on attributes such as SDK Version, OS name, and Error Subcode. These logs are used in the **[Voice and video Insights Dashboard](../insights/voice-and-video-insights.md)** to visualize long term graphs of reliability, quality, and performance based on count of succeeded and failed Calling SDK api calls of various operations. You can also set up automated alerts when a metric falls. **ankesh please explain how to do alerts**

To learn more see: [Call Metrics Log Schema](call-metrics-log-schema.md)

## Examples of various call types

### Example: P2P call

The following diagram represents two endpoints connected directly in a P2P call. In this example, Communication Services creates two call summary logs (one for each `participantID` value) and four call diagnostic logs (one for each media stream). 

For Azure Communication Services call client participants, there are also a series of call client operations logs and call client media statistics time series logs. The exact number of these logs depend on what kind of SDK operations are called and call duration. 

:::image type="content" source="../media/call-logs-azure-monitor/example-1-p2p-call-same-tenant.png" alt-text="Diagram showing a P2P call within the same tenant.":::

### Example: Group call

The following diagram represents a group call example with three `participantId` values (which means three participants) and a server endpoint. Multiple values for `endpointId` can potentially appear in multiple participants--for example, when they rejoin a call from the same device. Communication Services creates one call summary log for each `participantId` value. It creates four call diagnostic logs: one for each media stream per `participantId`. 

For Azure Communication Services call client participants, the call client operations logs are the same as P2P calls. For each participant using calling SDK, there are a series of call client operations logs. 

For Azure Communication Services call client participants, the call client operations logs and call client media statistics time series logs are the same as P2P calls. For each participant using calling SDK, there are a series of call client operations logs and call client media statistics time series logs. 

:::image type="content" source="../media/call-logs-azure-monitor/example-2-group-call-same-tenant.png" alt-text="Diagram showing a group call within the same tenant.":::

### Example: Cross-tenant P2P call 

The following diagram represents two participants across multiple tenants that are connected directly in a P2P call. In this example, Communication Services creates one call summary log (one for each participant) with redacted OS and SDK versions. Communication Services also creates four call diagnostic logs (one for each media stream). Each log contains data that relates to the outbound stream of `participantID`.

:::image type="content" source="../media/call-logs-azure-monitor/example-3-p2p-call-cross-tenant.png" alt-text="Diagram showing a cross-tenant P2P call.":::

### Example: Cross-tenant group call 

The following diagram represents a group call example with three `participantId` values across multiple tenants. Communication Services creates one call summary log for each participant with redacted OS and SDK versions. Communication Services also creates four call diagnostic logs that relate to each `participantId` value (one for each media stream).

:::image type="content" source="../media/call-logs-azure-monitor/example-4-group-call-cross-tenant.png" alt-text="Diagram showing a cross-tenant group call.":::

> [!NOTE]
> This release supports only outbound diagnostic logs.
> OS and SDK versions associated with the bot and the participant can be redacted because Communication Services treats identities of participants and bots the same way.

## Sample data for various call types

### P2P call 

Here are shared fields for all logs in a P2P call:

```json
"time":                     "2021-07-19T18:46:50.188Z",
"resourceId":               "SUBSCRIPTIONS/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/RESOURCEGROUPS/ACS-TEST-RG/PROVIDERS/MICROSOFT.COMMUNICATION/COMMUNICATIONSERVICES/ACS-PROD-CCTS-TESTS",
"correlationId":            "aaaa0000-bb11-2222-33cc-444444dddddd",
```

### Group call

Data for a group call is generated in three call summary logs and six call diagnostic logs. Here are shared fields for all logs in the call:

```json
"time":                     "2021-07-05T06:30:06.402Z",
"resourceId":               "SUBSCRIPTIONS/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/RESOURCEGROUPS/ACS-TEST-RG/PROVIDERS/MICROSOFT.COMMUNICATION/COMMUNICATIONSERVICES/ACS-PROD-CCTS-TESTS",
"correlationId":            "bbbb1111-cc22-3333-44dd-555555eeeeee",
```




### Call client operations log and call client media statistics logs for P2P and group calls

For call client operations log and call client media stats time series log, there's no difference between P2P and group call scenarios and the number of logs depends on the SDK operations and call duration. The following code is a generic sample showing the schema of these logs.

#### Call client operations log

Here's a call client operations log for "CreateView" operation:

```json
"properties": {
    "TenantId":               "aaaabbbb-0000-cccc-1111-dddd2222eeee",
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

Each participant can have many different metrics for a call. You can run the following query in Log Analytics in the Azure portal to list all the possible Operations in the call client operations log:

`ACSCallClientOperations | distinct OperationName`

#### Call client media statistics time series log

Here's an example of media statistics time series log. It shows the participant's Jitter metric for receiving an audio stream at a specific timestamp.

```json
"properties": {
    "TenantId":                     "aaaabbbb-0000-cccc-1111-dddd2222eeee",
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

Each participant can have many different media statistics metrics for a call. The following query can be run in Log Analytics in Azure portal to show all possible metrics in this log:

`ACSCallClientMediaStatsTimeSeries | distinct MetricName`

### Error codes 

The `participantEndReason` property contains a value from the set of Calling SDK error codes. You can refer to these codes to troubleshoot issues during the call, for each endpoint. See [Troubleshooting call end response codes for Calling SDK, Call Automation SDK, PSTN, Chat SDK, and SMS SDK](../../../resources/troubleshooting/voice-video-calling/troubleshooting-codes.md).


## Next steps

- Learn about the [insights dashboard to monitor Voice Calling and Video Calling logs and metrics](/azure/communication-services/concepts/analytics/insights/voice-and-video-insights).

- Learn best practices to manage your call quality and reliability, see: [Improve and manage call quality](../../voice-video-calling/manage-call-quality.md)
 

- Learn how to use call logs to diagnose call quality and reliability
  issues with Call Diagnostics, see: [Call Diagnostics](../../voice-video-calling/call-diagnostics.md)
