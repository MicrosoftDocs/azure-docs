---
title: Azure Communication Services billing usage log schema
titleSuffix: An Azure Communication Services concept article
description: Learn about the Azure Communication Services billing usage logs.
author:  amagginetti
services: azure-communication-services

ms.author: amagginetti
ms.date: 02/04/2025
ms.topic: conceptual
ms.service: azure-communication-services

---

# Billing usage log schema
The billing usage log schema give an overview of the different services you use. 

## Data concepts

> [!IMPORTANT]
>You must collect logs if you want to analyze them. To learn more, see: **[How do I store logs?](#how-do-i-store-logs)**
>
>Azure doesn't store your call log data unless you enable these specific Diagnostic Settings. Your call data isn't retroactively available. You accumulate data once you create the Diagnostic Settings.

## Data definitions

### Billing usage log schema

This table describes each property.


| Property | Description |
| -------- | ---------------|
| `Timestamp` | The time stamp (UTC) when the log was generated. |
| `Operation Name` | The operation associated with the log record. |
| `Operation Version` | The `api-version` value associated with the operation, if the `Operation Name` operation was performed through an API. If no API corresponds to this operation, the version represents the version of the operation, in case the properties associated with the operation change in the future. |
| `Category` | The log category of the event. The category is the granularity at which you can enable or disable logs on a resource. The properties that appear within the `properties` blob of an event are the same within a log category and resource type. |
| `Correlation ID` | The ID for correlated events. You can use it to identify correlated events between multiple tables. |
| `Properties` | Other data that's applicable to various modes of Communication Services. |
| `Record ID` | The unique ID for a usage record. |
| `Usage Type` | The mode of usage (for example, Chat, PSTN, or NAT). |
| `Unit Type` | The type of unit that usage is based on for a mode of usage (for example, minutes, megabytes, or messages). |
| `Quantity` | The number of units used or consumed for this record. |


## Frequently asked questions

### How do I store logs?
The following section explains this requirement.

Azure Communication Services logs aren't stored in your Azure account by default so you need to begin storing them in order for tools like [voice and video insights dashboard](../insights/voice-and-video-insights.md) and [call diagnostics](../../voice-video-calling/call-diagnostics.md) to work. To collect these call logs, you need to enable a diagnostic setting that directs the call data to a Log Analytics workspace. 

**Data isn’t stored retroactively, so you begin capturing call logs only after configuring the diagnostic setting.**

Follow instructions to add diagnostic settings for your resource in [Enable logs via Diagnostic Settings in Azure Monitor](../enable-logging.md). We recommend that you initially **collect all logs**. After you understand the capabilities in Azure Monitor, determine which logs you want to retain and for how long. When you add your diagnostic setting, you're prompted to [select logs](../enable-logging.md#adding-a-diagnostic-setting). To collect **all logs**, select **allLogs**.

Your data volume, retention, and usage in Log Analytics within Azure Monitor is billed through existing Azure data meters. We recommend that you monitor your data usage and retention policies for cost considerations as needed. For more information, see [Controlling costs](/azure/azure-monitor/essentials/diagnostic-settings#controlling-costs).

If you have multiple Azure Communications Services resource IDs, you must enable these settings for each resource ID.  

## Next steps

- Learn about the [insights dashboard to monitor Voice Calling and Video Calling logs](/azure/communication-services/concepts/analytics/insights/voice-and-video-insights).

- Learn how to use call logs to diagnose call quality and reliability
  issues with Call Diagnostics, see: [Call Diagnostics](../../voice-video-calling/call-diagnostics.md)