---
title: Azure Communication Services call client operations log schema
titleSuffix: An Azure Communication Services concept article
description: Learn about the voice and video call client operations logs.
author:  amagginetti
services: azure-communication-services

ms.author: amagginetti
ms.date: 02/04/2025
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: calling
---

# Call client operations log schema


The **call client operations** log provides client-side information about the calling endpoints and participants involved in a call. These logs are currently in preview and show client events that occurred in a call and which actions a customer takes during a call.  

This log provides detailed information on actions taken during a call and can be used to visualize and investigate call issues by using Call Diagnostics for your Azure Communication Services Resource. [Learn more about call diagnostics](../../voice-video-calling/call-diagnostics.md)

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

### Call client operations log schema

This table describes each property.


| Property | Description |
|--- |--- |
|     `CallClientTimeStamp`         |     The timestamp for when on operation occurred on the SDK in UTC.   |
|     `OperationName`         |    The name of the operation triggered on the calling SDK.   |
|     `CallId`    |              The unique ID for a call. It identifies correlated events from all of the participants and endpoints that connect during a single call, and you can use it to join data from different logs. It's similar to the correlationId in call summary log and call diagnostics log.               |
|     `ParticipantId`    |            The unique identifier for each call leg (in Group calls) or call participant (in Peer to Peer calls). This ID is the main correlation point between CallSummary, CallDiagnostic, CallClientOperations, and CallClientMediaStats logs.             |
|     `OperationType`    |              Call Client Operation.               |
|     `OperationId`    |             A unique GGUID identifying an SDK operation.                 |
|     `DurationMs`    |              The time took by a Calling SDK operation to fail or succeed.                |
|     `ResultType`    |               Field describing success or failure of an operation.               |
|     `ResultSignature`    |         HTTP-like failure or success code (200, 500).                    |
|     `SdkVersion`    |                   The version of Calling SDK being used.           |
|     `UserAgent`    |          The standard user agent string based on the browser or the platform Calling SDK is used.        |
|     `ClientInstanceId`    |            A unique GGUID identifying the CallClient object.                  |
|     `EndpointId`    |             The unique ID that represents each endpoint connected to the call, where endpointType defines the endpoint type. When the value is null, the connected entity is the Communication Services server (endpointType = "Server").  <BR><BR> The endpointId value can sometimes persist for the same user across multiple calls (correlationId) for native clients. The number of endpointId values determines the number of call summary logs. A distinct summary log is created for each endpointId value.                |
|     `OperationPayload`    |     A dynamic payload that varies based on the operation providing more operation specific details.       |


## Sample data for various call types

### Call client operations log

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