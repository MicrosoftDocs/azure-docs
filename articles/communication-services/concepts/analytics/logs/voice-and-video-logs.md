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

> [!IMPORTANT]
>You must collect logs if you want to analyze them. To learn more see: **[How do I store logs?](#how-do-i-store-logs)**
>
>Azure doesn't store your call log data unless you enable these specific Diagnostic Settings. Your call data is not retroactively available. You accumulate data once you set up the Diagnostic Settings.

## How to use Call Logs
By collecting call logs in a log analytics resource you can monitor your call usage and improve your call quality. 

There are two main tools you can use to monitor your calls and improve call quality. 
1. [Voice and video Insights Dashboard](../insights/voice-and-video-insights.md)
1. [Call Diagnostics](../../voice-video-calling/call-diagnostics.md)

We recommend using the **[Voice and video Insights Dashboard](../insights/voice-and-video-insights.md)** dashboards to start 
any quality investigations, and using **[Call Diagnostics](../../voice-video-calling/call-diagnostics.md)** as needed to explore individual calls when you need granular detail.

## Available logs 

Azure Communication Services creates six types of call logs and they share a common usage log:

- **Usage Logs**: Contains common information that you can use to reference information across multiple tables. **NEED INPUT FROM TEAM ON THIS**

- **Call Summary Logs**: Contain basic information about the call, including all the relevant IDs, time stamps, endpoints, and SDK information. For each participant within a call, Communication Services creates a distinct call summary log.

  If someone rejoins a call, that participant has the same `EndpointId` value but a different `ParticipantId` value. That endpoint can then have two call summary logs.

[Call Summary Log Schema](call-summary-log-schema.md)

- **Call Diagnostics Logs**: Contain information about the stream, along with a set of metrics that indicate quality of experience measurements. For each `EndpointId` within a call (including the server), Azure Communication Services creates a distinct call diagnostics log for each media stream (audio or video, for example) between endpoints.

To learn more see: [Call Diagnostics Log Schema](call-diagnostics-log-schema.md)

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

> [!NOTE]
> In this article, P2P and group calls are within the same tenant by default. All call scenarios that are cross-tenant are specified accordingly throughout the article.

There are two types of calls, as represented by `callType`:

- **Peer to Peer (P2P) call**: A connection between only two endpoints, with no server endpoint. P2P calls are initiated as a call between those endpoints and aren't created as a group call event before the connection.

  :::image type="content" source="../media/call-logs-azure-monitor/p2p-diagram.png" alt-text="Diagram showing a P2P call across two endpoints.":::

- **Group call**: Any call that has more than two endpoints connected. Group calls include a server endpoint and the connection between each endpoint and the server. P2P calls that add another endpoint during the call cease to be P2P, and they become a group call. You can determine the timeline of when each endpoint joined the call by using the `participantStartTime` and `participantDuration` metrics.

  :::image type="content" source="../media/call-logs-azure-monitor/group-call-version-a.png" alt-text="Diagram showing a group call across multiple endpoints.":::


## Examples of various call types

> [!NOTE]
> In this article, P2P and group calls are within the same tenant by default. All call scenarios that are cross-tenant are specified accordingly throughout the article.

### Example: P2P call

The following diagram represents two endpoints connected directly in a P2P call. In this example, Communication Services creates two call summary logs (one for each `participantID` value) and four call diagnostics logs (one for each media stream). 

For Azure Communication Services call client participants, there are also a series of call client operations logs and call client media statistics time series logs. The exact number of these logs depend on what kind of SDK operations are called and call duration. 

:::image type="content" source="../media/call-logs-azure-monitor/example-1-p2p-call-same-tenant.png" alt-text="Diagram showing a P2P call within the same tenant.":::

### Example: Group call

The following diagram represents a group call example with three `participantId` values (which means three participants) and a server endpoint. Multiple values for `endpointId` can potentially appear in multiple participants--for example, when they rejoin a call from the same device. Communication Services creates one call summary log for each `participantId` value. It creates four call diagnostics logs: one for each media stream per `participantId`. 

For Azure Communication Services call client participants, the call client operations logs are the same as P2P calls. For each participant using calling SDK, there are a series of call client operations logs. 

For Azure Communication Services call client participants, the call client operations logs and call client media statistics time series logs are the same as P2P calls. For each participant using calling SDK, there are a series of call client operations logs and call client media statistics time series logs. 

:::image type="content" source="../media/call-logs-azure-monitor/example-2-group-call-same-tenant.png" alt-text="Diagram showing a group call within the same tenant.":::

### Example: Cross-tenant P2P call 

The following diagram represents two participants across multiple tenants that are connected directly in a P2P call. In this example, Communication Services creates one call summary log (one for each participant) with redacted OS and SDK versions. Communication Services also creates four call diagnostics logs (one for each media stream). Each log contains data that relates to the outbound stream of `participantID`.

:::image type="content" source="../media/call-logs-azure-monitor/example-3-p2p-call-cross-tenant.png" alt-text="Diagram showing a cross-tenant P2P call.":::

### Example: Cross-tenant group call 

The following diagram represents a group call example with three `participantId` values across multiple tenants. Communication Services creates one call summary log for each participant with redacted OS and SDK versions. Communication Services also creates four call diagnostics logs that relate to each `participantId` value (one for each media stream).

:::image type="content" source="../media/call-logs-azure-monitor/example-4-group-call-cross-tenant.png" alt-text="Diagram showing a cross-tenant group call.":::

> [!NOTE]
> This release supports only outbound diagnostics logs.
> OS and SDK versions associated with the bot and the participant can be redacted because Communication Services treats identities of participants and bots the same way.


## Frequently asked questions

### How do I store logs?
The following section explains this requirement.

Azure Communication Services logs are not stored in your Azure account by default so you need to begin storing them in order for tools like [Voice and video Insights Dashboard](../insights/voice-and-video-insights.md) and [Call Diagnostics](../../voice-video-calling/call-diagnostics.md) to work. To collect these call logs, you need to enable a diagnostic setting that directs the call data to a Log Analytics workspace. 

**Data isn’t stored retroactively, so you begin capturing call logs only after configuring the diagnostic setting.**

Follow instructions to add diagnostic settings for your resource in [Enable logs via Diagnostic Settings in Azure Monitor](../enable-logging.md). We recommend that you initially **collect all logs**. After you understand the capabilities in Azure Monitor, determine which logs you want to retain and for how long. When you add your diagnostic setting, you're prompted to [select logs](../enable-logging.md#adding-a-diagnostic-setting). To collect **all logs**, select **allLogs**.

Your data volume, retention, and usage in Log Analytics within Azure Monitor is billed through existing Azure data meters. We recommend that you monitor your data usage and retention policies for cost considerations as needed. For more information, see [Controlling costs](/azure/azure-monitor/essentials/diagnostic-settings#controlling-costs).

If you have multiple Azure Communications Services resource IDs, you must enable these settings for each resource ID.  

## Next steps

- Learn best practices to manage your call quality and reliability, see: [Improve and manage call quality](../../voice-video-calling/manage-call-quality.md)
- 
- Learn about the [insights dashboard to monitor Voice Calling and Video Calling logs](/azure/communication-services/concepts/analytics/insights/voice-and-video-insights).

- Learn how to use call logs to diagnose call quality and reliability
  issues with Call Diagnostics, see: [Call Diagnostics](../../voice-video-calling/call-diagnostics.md)
