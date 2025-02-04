---
title: Azure Communication Services Call Client Media Statistics Log Schema
titleSuffix: An Azure Communication Services concept article
description: Learn about the Voice and Video Call Client Media Statistics Time Series Logs.
author:  amagginetti
services: azure-communication-services

ms.author: amagginetti
ms.date: 02/04/2025
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: calling
---

# Call Client Media Statistics Time Series Log Schema

The **call client media statistics time series** log provides
client-side information about the media streams between individual
participants involved in a call. These logs are currently in limited preview and provide detailed time series
data on the audio, video, and screen share media steams between
participants with a default 10-seconds aggregation interval. The logs contain granular time series information about media stream type, direction, codec, and bitrate properties (for example, max, min, average).


This log provides more detailed information than the Call Diagnostic log
to understand the quality of media steams between participants. It can be used to
visualize and investigate quality issues for your calls through Call
Diagnostics for your Azure Communication Services Resource. [Learn more about Call Diagnostics](../../voice-video-calling/call-diagnostics.md)




| Property | Description |
|--- |--- |
| `OperationName` | The operation associated with the log record. |
| `CallId` | The unique ID for a call. It identifies correlated events from all of the participants and endpoints that connect during a single call, and you can use it to join data from different logs. It's similar to the correlationId in call summary log and call diagnostic log. |
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
