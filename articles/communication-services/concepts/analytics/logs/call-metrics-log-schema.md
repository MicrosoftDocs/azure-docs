---
title: Azure Communication Services call metrics log schema
titleSuffix: An Azure Communication Services concept article
description: Learn about the voice and video overview metrics.
author:  amagginetti
services: azure-communication-services

ms.author: amagginetti
ms.date: 02/04/2025
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: calling
---


# Call metrics log schema

This document explains the ACSCallingMetrics logs available to you through Azure Monitor in the form of [Resource Logs](/azure/azure-monitor/data-sources.md#azure-resources). 

Call metrics logs are used in the **[voice and video insights dashboard](../insights/voice-and-video-insights.md)** to visualize long term graphs of reliability, quality, and performance based on count of succeeded and failed Calling SDK API calls of various operations. Use these logs to gain a clearer understanding of daily aggregated calling metrics across various dimensions for your communication workloads. 
Call metrics logs contain aggregated calling metrics in daily bins based on attributes such as SDK Version, OS name, and Error Subcode.

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


These metrics are visualized in the **[Voice and video Insights Dashboard](../insights/voice-and-video-insights.md)**, we recommend reviewing these visuals to understand how you can use these data if you want to build your own dashboard or customize the existing dashboards. You can edit the existing workbook in the Voice and Video Insights Dashboard to see the queries behind each visual.


This log schema has a property called `MetricName` that details the various metrics that are sent in this schema. The metrics are broken down into two main categories, **API Metrics** and **User Facing Diagnostics (UFD) metrics**. UFD metrics are further broken down into two groups that explain the **volume** of UFD occurrences and how well UFDs **recovered** from those occurrences during calls. 

Since these metrics give you an overview of your entire calling resource, you can set up automated alerts if a metric falls. To learn how to set up automated alerts, see: [Tutorial: Create a log search alert for an Azure resource](/azure/azure-monitor/alerts/tutorial-log-alert)


## Metric categories

### API metrics

These metrics measure both the successes and failures (dcount) of the calling SDK public APIs, for example (mute, join, etc.).

- reliability/api/CreateView/Local
- reliability/api/Join
- reliability/api/StartVideo
- reliability/api/AcceptIncomingCall
- reliability/api/CreateView/Remote
- reliability/api/StopVideo
- reliability/api/CallAgentInit
- reliability/api/StartCall

### User Facing Diagnostics (UFD) metrics

- To learn more about UFDs, see: [User Facing Diagnostics](../../voice-video-calling/user-facing-diagnostics.md)

#### User Facing Diagnostics (UFD) leg metrics: (dcount of participants (legs) that had at least one bad UFD during a call)

Provides counts of how many participants were impacted by a UFD in a call.   

- reliability/leg/UFD/NetworkReconnect
- reliability/leg/UFD/CameraStoppedUnexpectedly
- reliability/leg/UFD/MicrophoneMuteUnexpectedly
- reliability/leg/UFD/NetworkReceiveQuality
- reliability/leg/UFD/MicrophonePermissionDenied
- reliability/leg/UFD/MicrophoneNotFunctioning
- reliability/leg/UFD/NoMicrophoneDevicesEnumerated
- reliability/leg/UFD/CameraPermissionDenied
- reliability/leg/UFD/CameraStartFailed
- reliability/leg/UFD/CapturerStoppedUnexpectedly
- reliability/leg/UFD/CapturerStartFailed
- reliability/leg/UFD/CameraStartTimedOut
- reliability/leg/UFD/NoSpeakerDevicesEnumerated
- reliability/leg/UFD/CameraFreeze
- reliability/leg/UFD/NetworkRelaysNotReachable
- reliability/leg/UFD/SpeakingWhileMicrophoneIsMuted
- reliability/leg/UFD/NoNetwork
- reliability/leg/UFD/NetworkSendQuality
- reliability/leg/UFD/ScreenshareRecordingDisabled

#### User Facing Diagnostics (UFD) API recovery metrics: (dcount of occurrences that had an issue but then recovered during a call)  

Provides counts of how many UFDs were triggered during a call by the calling SDK, but subsequently recovered during the call. For example, if the `NetworkReconnect` UFD was triggered one time in a call, but the network successfully recovered during the call. In this example, the count of good API recovery UFD is ≥ the count of bad UFD leg metric. You could calculate a UFD recovery rate of 100%. 


- reliability/api/UFD/recovery/NetworkReceiveQuality
- reliability/api/UFD/recovery/NetworkReconnect
- reliability/api/UFD/recovery/CameraStoppedUnexpectedly
- reliability/api/UFD/recovery/NetworkSendQuality
- reliability/api/UFD/recovery/MicrophoneMuteUnexpectedly
- reliability/api/UFD/recovery/MicrophoneNotFunctioning
- reliability/api/UFD/recovery/CapturerStoppedUnexpectedly
- reliability/api/UFD/recovery/CameraFreeze
- reliability/api/UFD/recovery/CameraStartFailed
- reliability/api/UFD/recovery/NoMicrophoneDevicesEnumerated
- reliability/api/UFD/recovery/MicrophonePermissionDenied
- reliability/api/UFD/recovery/CameraPermissionDenied
- reliability/api/UFD/recovery/NoSpeakerDevicesEnumerated
- reliability/api/UFD/recovery/CapturerStartFailed
- reliability/api/UFD/recovery/ScreenshareRecordingDisabled
- reliability/api/UFD/recovery/NoNetwork
- reliability/api/UFD/recovery/CameraStartTimedOut
- reliability/api/UFD/recovery/SpeakingWhileMicrophoneIsMuted
- reliability/api/UFD/recovery/NetworkRelaysNotReachable


## Data definitions

### Call metrics log schema

This table describes each property.

| Property                     | Description                                                                                                                |
|----------------------------|----------------------------------------------------------------------------------------------------------------------------|
| `TimeGenerated`              | The timestamp (UTC) of when the log was generated.                                                                         |
| `OperationName`             | The operation associated with the log record.                                                                              |
| `OperationVersion`          | The API-version associated with the operation. Or the version of the operation if there's no API version.                                                   |
| `Category`                  | The log category of the event. Logs with the same log category and resource type share the same properties fields.           |
| `CorrelationId`             | A unique GUID that correlates events across the same dimension.                                                            |
| `TimestampMax`              | The maximum timestamp in UTC for each dimension.                                                                           |
| `TimestampBin`              | The daily timestamp bin for each dimension.                                                                                |
| `MetricValueAvg`            | The average value of the metric for each dimension.                                                                        |
| `Unit`                      | The unit of the metric.                                                                                                    |
| `Goal`                      | The threshold defined for a leg to succeed.                                                                                |
| `FailedLegsDcount`          | The number of failed participants (legs) per dimension.                                                                    |
| `SuccessLegsDcount`         | The count of successful participants (legs) per dimension.                                                                 |
| `CallsDcount`               | The total number of calls per dimension.                                                                                   |
| `LegsDcount`                | The total number of participants (legs) per dimension.                                                                     |
| `SubCode`                   | A dimension indicating the subcode.                                                                                        |
| `CallType`                  | A dimension indicating the type of call.                                                                                   |
| `Platform`                  | The platform dimension (for example, iOS, Android, Windows).                                                                      |
| `ResultType`                | The result type dimension (for example, success or failure category).                                                             |
| `DeviceModel`               | A dimension indicating the device model.                                                                                   |
| `DeviceBrand`               | A dimension indicating the device brand.                                                                                   |
| `DeviceFamily`              | A dimension indicating the device family.                                                                                  |
| `DeviceOsVersionMajor`      | Major version number of the device operating system.                                                                              |
| `DeviceOsVersionMinor`      | Minor version number of the device operating system.                                                                              |
| `DeviceBrowserVersionMinor` | Minor version number of the device browser.                                                                                       |
| `DeviceBrowserVersionMajor` | Major version number of the device browser.                                                                                       |
| `DeviceOsName`              | Name of the device operating system.                                                                                       |
| `DeviceBrowser`             | Name of the device browser.                                                                                                |
| `SdkVersion`                | The SDK version running on the client.                                                                                     |
| `MetricName`                | The name of the metric being measured.                                                                                     |

## Sample data for various call types

### Call metrics log for P2P and group calls

For the call metric log, there's no difference between P2P and group call scenarios. The following code is a generic sample showing the schema of these logs.

### Call metrics log

Here's are two sample rows of the call metrics log: 

```json
"properties": {
  "TenantId": "4e7403f8-515a-4df5-8e13-59f0e2b76e3a",
  "TimeGenerated": "2025-02-03T05:17:39.1840000Z",
  "OperationName": "CallingMetrics",
  "OperationVersion": "1.0-dev",
  "Category": "CallingMetrics",
  "CorrelationId": "1f27dac9e6d64c82cafdd6da73cdb785",
  "TimestampMax": "2025-02-02T14:35:55.0000000Z",
  "TimestampBin": "2025-02-02T00:00:00.0000000Z",
  "MetricValueAvg": 100,
  "Unit": "percentage",
  "Goal": ">= 100.0",
  "FailedLegsDcount": 0,
  "SuccessLegsDcount": 2,
  "CallsDcount": 1,
  "LegsDcount": 2,
  "SubCode": 0,
  "CallType": "1 to 1",
  "Platform": "Web",
  "ResultType": "Succeeded",
  "DeviceModel": "",
  "DeviceBrand": "",
  "DeviceFamily": "Other",
  "DeviceOsVersionMajor": "",
  "DeviceOsVersionMinor": 10,
  "DeviceBrowserVersionMinor": 0,
  "DeviceBrowserVersionMajor": 132,
  "DeviceOsName": "Windows",
  "DeviceBrowser": "Edge",
  "SdkVersion": "1.32.1.0_stable",
  "MetricName": "reliability/leg/UFD/CameraStoppedUnexpectedly",
  "SourceSystem": "",
  "Type": "ACSCallingMetrics",
  "_ResourceId": "/subscriptions/50ad1522-5c2c-4d9a-a6c8-67c11ecb75b8/resourcegroups/calling-sample-apps/providers/microsoft.communication/communicationservices/corertc-test-apps"
}
```

```json
"properties": {
  "TenantId": "4e7403f8-515a-4df5-8e13-59f0e2b76e3a",
  "TimeGenerated": "2025-02-03T05:17:39.1840000Z",
  "OperationName": "CallingMetrics",
  "OperationVersion": "1.0-dev",
  "Category": "CallingMetrics",
  "CorrelationId": "1f27dac9e6d64c82cafdd6da73cdb785",
  "TimestampMax": "2025-02-02T14:35:55.0000000Z",
  "TimestampBin": "2025-02-02T00:00:00.0000000Z",
  "MetricValueAvg": 100,
  "Unit": "percentage",
  "Goal": ">= 100.0",
  "FailedLegsDcount": 0,
  "SuccessLegsDcount": 2,
  "CallsDcount": 1,
  "LegsDcount": 2,
  "SubCode": 0,
  "CallType": "1 to 1",
  "Platform": "Web",
  "ResultType": "Succeeded",
  "DeviceModel": "",
  "DeviceBrand": "",
  "DeviceFamily": "Other",
  "DeviceOsVersionMajor": "",
  "DeviceOsVersionMinor": 10,
  "DeviceBrowserVersionMinor": 0,
  "DeviceBrowserVersionMajor": 132,
  "DeviceOsName": "Windows",
  "DeviceBrowser": "Edge",
  "SdkVersion": "1.32.1.0_stable",
  "MetricName": "reliability/leg/UFD/CameraStoppedUnexpectedly",
  "SourceSystem": "",
  "Type": "ACSCallingMetrics",
  "_ResourceId": "/subscriptions/50ad1522-5c2c-4d9a-a6c8-67c11ecb75b8/resourcegroups/calling-sample-apps/providers/microsoft.communication/communicationservices/corertc-test-apps"
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
