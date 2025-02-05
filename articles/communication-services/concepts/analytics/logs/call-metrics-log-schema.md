---
title: Azure Communication Services Call Metrics Log Schema
titleSuffix: An Azure Communication Services concept article
description: Learn about the Voice and Video Overview Metrics.
author:  amagginetti
services: azure-communication-services

ms.author: amagginetti
ms.date: 02/04/2025
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: calling
---


# Call Metrics Log Schema

This document explains the ACSCallingMetrics logs available to you through Azure Monitor in the form of [Resource Logs](/azure/azure-monitor/data-sources.md#azure-resources). 

Call Metrics logs are used in the **[Voice and video Insights Dashboard](../insights/voice-and-video-insights.md)** to visualize long term graphs of reliability, quality, and performance based on count of succeeded and failed Calling SDK api calls of various operations. Use these logs to gain a clearer understanding of daily aggregated calling metrics across various dimensions for your communication workloads. You can also set up automated alerts when a metric falls. **ankesh please explain how to do alerts**

Call Metrics logs contain aggregated calling metrics in daily bins based on attributes such as SDK Version, OS name, and Error Subcode.

## Data Concepts



a separate page that explains "metrics" conceptually
what is metric - Based on thresholds defined in ACSCallingMetrics.Goal how many distinct api calls succeded or failed in a daily bucket for dimentions liek SDK version, make model, subcode etc
what does it measure - Failure and success count for a particualr api call or a complex condition like UFD recovering (count of good UFD>= count of bad UFD)
what is success/what is failure
explain failures - high level - that somebody should review subcodes and go to subcode page etc..
failure - an api call failing with unexpected error or a complex condition failing like getting a bd UFD in a call.

> [!IMPORTANT]
>You must collect logs if you want to analyze them. To learn more see: **[How do I store logs?](#how-do-i-store-logs)**
>
>Azure doesn't store your call log data unless you enable these specific Diagnostic Settings. Your call data is not retroactively available. You accumulate data once you set up the Diagnostic Settings.

## Data Definitions

### Call metrics log schema

The table below describes each property.

| Property                     | Description                                                                                                                |
|----------------------------|----------------------------------------------------------------------------------------------------------------------------|
| `TimeGenerated`              | The timestamp (UTC) of when the log was generated.                                                                         |
| `OperationName`             | The operation associated with the log record.                                                                              |
| `OperationVersion`          | The API-version associated with the operation. Or the version of the operation if there is no API version.                                                   |
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
| `Platform`                  | The platform dimension (e.g., iOS, Android, Windows).                                                                      |
| `ResultType`                | The result type dimension (e.g., success or failure category).                                                             |
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

### Call Metrics log for P2P and group calls

For the call metric log, there's no difference between P2P and group call scenarios. **????????The number of logs depends on the SDK operations and call duration**. The following code is a generic sample showing the schema of these logs.

### Call Metrics Log

Here's a sample of the Call Metrics log: **Ankesh explain each part what they are**

{
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


{
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


 

## Frequently asked questions

### How do I store logs?
The following section explains this requirement.

Azure Communication Services logs are not stored in your Azure account by default so you need to begin storing them in order for tools like [Voice and video Insights Dashboard](../insights/voice-and-video-insights.md) and [Call Diagnostics](../../voice-video-calling/call-diagnostics.md) to work. To collect these call logs, you need to enable a diagnostic setting that directs the call data to a Log Analytics workspace. 

**Data isn’t stored retroactively, so you begin capturing call logs only after configuring the diagnostic setting.**

Follow instructions to add diagnostic settings for your resource in [Enable logs via Diagnostic Settings in Azure Monitor](../enable-logging.md). We recommend that you initially **collect all logs**. After you understand the capabilities in Azure Monitor, determine which logs you want to retain and for how long. When you add your diagnostic setting, you're prompted to [select logs](../enable-logging.md#adding-a-diagnostic-setting). To collect **all logs**, select **allLogs**.

Your data volume, retention, and usage in Log Analytics within Azure Monitor is billed through existing Azure data meters. We recommend that you monitor your data usage and retention policies for cost considerations as needed. For more information, see [Controlling costs](/azure/azure-monitor/essentials/diagnostic-settings#controlling-costs).

If you have multiple Azure Communications Services resource IDs, you must enable these settings for each resource ID.  

## Next steps

- Review the overview of all Voice and Video logs, see: [Overview of Azure Communication Services Voice Calling and Video Call logs](voice-and-video-logs.md)

- Learn best practices to manage your call quality and reliability, see: [Improve and manage call quality](../../voice-video-calling/manage-call-quality.md)

- Learn about the [insights dashboard to monitor Voice Calling and Video Calling logs](/azure/communication-services/concepts/analytics/insights/voice-and-video-insights).

- Learn how to use call logs to diagnose call quality and reliability
  issues with Call Diagnostics, see: [Call Diagnostics](../../voice-video-calling/call-diagnostics.md)
