---
title: Azure Communication Services Closed captions logs
titleSuffix: An Azure Communication Services concept article
description: Learn about logging for Azure Communication Services Closed captions.
author: Kunaal
services: azure-communication-services

ms.author: kpunjabi
ms.date: 02/06/2024
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: data
---

# Azure Communication Services Call Automation logs

Azure Communication Services offers logging capabilities that you can use to monitor and debug your Communication Services solution. You configure these capabilities through the Azure portal.

## Prerequisites

Azure Communication Services provides monitoring and analytics features via [Azure Monitor Logs](../../../../azure-monitor/logs/data-platform-logs.md) and [Azure Monitor Metrics](../../../../azure-monitor/essentials/data-platform-metrics.md). Each Azure resource requires its own diagnostic setting, which defines the following criteria:

* Categories of log and metric data sent to the destinations that the setting defines. The available categories vary by resource type.
* One or more destinations to send the logs. Current destinations include Log Analytics workspace, Azure Event Hubs, and Azure Storage.

  A single diagnostic setting can define no more than one of each destination type. If you want to send data to more than one destination type (for example, two Log Analytics workspaces), create multiple settings. Each resource can have up to five diagnostic settings.

The following instructions configure your Azure Monitor resource to start creating logs and metrics for your Communication Services instance. For detailed documentation about using diagnostic settings across all Azure resources, see [Enable logging in diagnostic settings](../enable-logging.md).

## Usage log schema

| Property | Description |
| --- | --- |
| timeGenerated | The timestamp (UTC) of when the log was generated. |
| operationName | The operation associated with log record. ClosedCaptionsSummary |
| category | The log category of the event. Logs with the same log category and resource type have the same property fields. CallClosedCaptionsSummary |
| level | The severity level of the operation. Informational |
| correlationId | The ID for correlated events. Can be used to identify correlated events between multiple tables. |
| resourceId | The ID of Azure ACS resource to which a call with closed captions belongs |
| resultType | The status of the operation. |
| speechRecognitionSessionId | The ID given to the closed captions this log refers to. |
| spokenLanguage | The spoken language of the closed captions. |
| endReason | The reason why the closed captions ended. |
| cancelReason | The reason why the closed captions cancelled. |
| startTime | The time that the closed captions started. |
| duration | Duration of the closed captions in seconds. |

Here's an example of a closed caption summary log:

```json
{
  "TimeGenerated": "2023-11-14T23:18:26.4332392Z",
  "OperationName": "ClosedCaptionsSummary",
  "Category": "CallClosedCaptionsSummary",
  "Level": "Informational",
  "CorrelationId": "336a0049-d98f-48ca-8b21-d39244c34486",
  "ResourceId": "d2241234-bbbb-4321-b789-cfff3f4a6666",
  "ResultType": "Succeeded",
  "SpeechRecognitionSessionId": "eyJQbGF0Zm9ybUVuZHBvaW50SWQiOiI0MDFmNmUwMC01MWQyLTQ0YjAtODAyZi03N2RlNTA2YTI3NGYiLCJffffffXJjZVNwZWNpZmljSWQiOiIzOTc0NmE1Ny1lNzBkLTRhMTctYTI2Yi1hM2MzZTEwNTk0Mwwwww",
  "SpokenLanguage": "cn-zh",
  "EndReason": "Stopped",
  "CancelReason": "",
  "StartTime": "2023-11-14T03:04:05.123Z",
  "Duration": "666.66"
}
```
