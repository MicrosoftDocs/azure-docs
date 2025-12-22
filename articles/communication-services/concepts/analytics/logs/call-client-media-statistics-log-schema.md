---
title: Azure Communication Services call client media statistics log schema
titleSuffix: An Azure Communication Services concept article
description: Learn about the voice and video call client media statistics time series logs.
author:  amagginetti
services: azure-communication-services

ms.author: amagginetti
ms.date: 02/04/2025
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: calling
---

# Call client media statistics time series log schema

The **call client media statistics time series** log provides
client-side information about the media streams between individual
participants involved in a call. These logs are currently in limited preview and provide detailed time series
data on the audio, video, and screen share media streams between
participants with a default 10-seconds aggregation interval. The logs contain granular time series information about media stream type, direction, codec, and bitrate properties (for example, max, min, average).


This log provides more detailed information than the call diagnostics log
to understand the quality of media streams between participants. It can be used to
visualize and investigate quality issues for your calls through call
diagnostics for your Azure Communication Services Resource. [Learn more about call diagnostics](../../voice-video-calling/call-diagnostics.md)


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

## Data definitions

### Call client media statistics time series log schema

This table describes each property.


| Property | Description |
|--- |--- |
| `OperationName` | The operation associated with the log record. |
| `CallId` | The unique ID for a call. It identifies correlated events from all of the participants and endpoints that connect during a single call, and you can use it to join data from different logs. It's similar to the correlationId in call summary log and call diagnostics log. |
| `CallClientTimeStamp` | The timestamp when the media stats is recorded. |
| `MetricName` | The name of the media statistics, such as `Bitrate`, `JitterInMs`, `PacketsPerSecond`, and so on.  |
| `Count`| The number of data points sampled at a given timestamp. |
| `Sum` | The sum of metric values of all the data points sampled. |
| `Average` | The average metric value of the data points sampled. Average = Sum / Count. |
| `Minimum` | The minimum of metric values of all the data points sampled. |
| `Maximum` | The maximum of metric values of all the data points sampled. |
| `MediaStreamDirection` | The direction of the media stream. It can be `send` or `receive`. |
| `MediaStreamType` | The type of the media stream. It can be `video`, `audio`, or `screen`. |
| `MediaStreamCodec` | The codec used to encode/decode the media stream, such as `H264`, `OPUS`, `VP8`, and so on. |
| `ParticipantId` | The unique ID generated to represent each endpoint in the call. |
| `ClientInstanceId` | The unique ID representing the Call Client object created in the calling SDK. |
| `EndpointId` | The unique ID that represents each endpoint that is connected to the call. EndpointId can persist for the same user across multiple calls (`callIds`) for native clients but is unique for every call when the client is a web browser. The `EndpointId` isn't currently instrumented in this log. When implemented, it matches the values in CallSummary/Diagnostics logs |
| `RemoteParticipantId` | The unique ID that represents the remote endpoint in the media stream. For example, a user can render multiple video streams for the other users in the same call. Each video stream has a different `RemoteParticipantId`. |
| `RemoteEndpointId` | Same as `EndpointId`, but it represents the user on the remote side of the stream. |
| `MediaStreamId` | A unique ID that represents each media stream in the call. `MediaStreamId` isn't currently instrumented in clients. When implemented, it matches the `streamId` column in CallDiagnostics logs. |
| `AggregationIntervalSeconds` | The time interval for aggregating the media statistics. Currently in the Calling SDK, media metrics are sampled every 1 second, and when we report in the log we aggregate all samples every 10 seconds. So each row in this table has, at most, 10 sampling points. |


## Sample data for various call types

### Call client media statistics logs for P2P and group calls

For call client media stats time series log, there's no difference between P2P and group call scenarios. The number of logs depends on the SDK operations and call duration. The following code is a generic sample showing the schema of these logs.

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