---
title: Azure Communication Services Closed Captions logs
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

# Azure Communication Services Closed Captions logs

Azure Communication Services offers logging capabilities that you can use to monitor and debug your Communication Services solution. You configure these capabilities through the Azure portal.

The content in this article refers to logs enabled through [Azure Monitor](../../../../azure-monitor/overview.md) (see also [FAQ](../../../../azure-monitor/overview.md#frequently-asked-questions)). To enable these logs for Communication Services, see [Enable logging in diagnostic settings](../enable-logging.md).

## Usage log schema

| Property | Description |
| --- | --- |
| TimeGenerated | The timestamp (UTC) of when the log was generated. |
| OperationName | The operation associated with log record. ClosedCaptionsSummary |
| Type | The log category of the event. Logs with the same log category and resource type have the same property fields. ACSCallClosedCaptionsSummary |
| Level | The severity level of the operation. Informational |
| CorrelationId | The ID for correlated events. Can be used to identify correlated events between multiple tables. |
| ResourceId | The ID of Azure ACS resource to which a call with closed captions belongs |
| ResultType | The status of the operation. |
| SpeechRecognitionSessionId | The ID given to the closed captions this log refers to. |
| SpokenLanguage | The spoken language of the closed captions. |
| EndReason | The reason why the closed captions ended. |
| CancelReason | The reason why the closed captions cancelled. |
| StartTime | The time that the closed captions started. |
| Duration | Duration of the closed captions in seconds. |

Here's an example of a closed caption summary log:

```json
{
  "TimeGenerated": "2023-11-14T23:18:26.4332392Z",
  "OperationName": "ClosedCaptionsSummary",
  "Category": "ACSCallClosedCaptionsSummary",
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
