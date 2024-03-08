---
title: Azure Communication Services Call Automation logs
titleSuffix: An Azure Communication Services concept article
description: Learn about logging for Azure Communication Services Call Automation.
author: mkhribech
services: azure-communication-services

ms.author: mkhribech
ms.date: 05/24/2023
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

> [!IMPORTANT]
> You must enable a diagnostic setting in Azure Monitor to send the log data of your surveys to a Log Analytics workspace, an event hub, or an Azure storage account to receive and analyze your survey data. If you don't send Call Automation data to one of these options, your survey data won't be stored and will be lost.

The following instructions configure your Azure Monitor resource to start creating logs and metrics for your Communication Services instance. For detailed documentation about using diagnostic settings across all Azure resources, see [Enable logging in diagnostic settings](../enable-logging.md).

Under the diagnostic setting name, select **Operation Call Automation Logs** and **Call Automation Events Summary Logs** to enable the logs for Call Automation.

:::image type="content" source="..\media\log-analytics\call-automation-log.png" alt-text="Screenshot of diagnostic settings for Call Automation.":::

## Resource log categories

Communication Services offers the following types of logs that you can enable:

* **Usage logs**: Provide usage data associated with each billed service offering.
* **Call automation operational logs**: Provide operational information on Call Automation API requests. You can use these logs to identify failure points and query all requests made in a call (by using the correlation ID or server call ID).
* **Call Automation media summary logs**: Provide information about the outcome of media operations. These logs come to you asynchronously when you're making media requests by using Call Automation APIs. You can use these logs to help identify failure points and possible patterns on how users interact with your application.

## Usage log schema

| Property | Description |
| ----------------------- | ---------------|
| `Timestamp`             | The time stamp (UTC) of when the log was generated. |
| `OperationName`        | The operation associated with the log record. |
| `OperationVersion`     | The `api-version` value associated with the operation, if the `OperationName` operation was performed through an API. If no API corresponds to this operation, the version represents the version of the operation, in case the properties associated with the operation change in the future. |
| `Category`              | The log category of the event. The category is the granularity at which you can enable or disable logs on a resource. The properties that appear within the `properties` blob of an event are the same within a log category and resource type. |
| `CorrelationID`        | The ID for correlated events. You can use it to identify correlated events between multiple tables. |
| `Properties`            | Other data that's applicable to various modes of Communication Services. |
| `RecordID`             | The unique ID for a usage record. |
| `UsageType`            | The mode of usage (for example, Chat, PSTN, or NAT). |
| `UnitType`             | The type of unit that usage is based on for a mode of usage (for example, minutes, megabytes, or messages). |
| `Quantity`              | The number of units used or consumed for this record. |

## Call Automation operational logs

| Property | Description |
| -------- | ---------------|
| `TimeGenerated` | The time stamp (UTC) of when the log was generated. |
| `OperationName` | The operation associated with the log record. |
| `CorrelationID` | The identifier to identify a call and correlate events for a unique call.  |
| `OperationVersion` | The `api-version` version associated with the operation, if the `operationName` operation was performed through an API. If no API corresponds to this operation, the version represents the version of the operation, in case the properties associated with the operation change in the future. |
| `Category` | The log category of the event. The category is the granularity at which you can enable or disable logs on a resource. The properties that appear within the `properties` blob of an event are the same within a log category and resource type. |
| `ResultType` | The status of the operation. |
| `ResultSignature` | The substatus of the operation. If this operation corresponds to a REST API call, this field is the HTTP status code of the corresponding REST call. |
| `DurationMs` | The duration of the operation in milliseconds. |
| `CallerIpAddress` | The caller IP address, if the operation corresponds to an API call that comes from an entity with a publicly available IP address. |
| `Level` | The severity level of the event. |
| `URI` | The URI of the request. |
| `CallConnectionId` | The ID that represents the call connection, if available. This ID is different for each participant and is used to identify their connection to the call.  |
| `ServerCallId` | A unique ID to identify a call. |
| `SDKVersion` | The SDK version used for the request. |
| `SDKType` | The SDK type used for the request. |
| `ParticipantId` | The ID to identify the call participant that made the request. |
| `SubOperationName` | The name that's used to identify the subtype of media operation (play or recognize). |
|`operationID`| The ID that's used to correlate asynchronous events.|

Here's an example of a Call Automation operational log:

```json
[
{
"TimeGenerated [UTC]": "5/25/2023, 5:43:25.746 PM",
"Level": "Informational",
"CorrelationId": "e2a97d52-0cbb-4adf-8c4b-e10f791fb764",
"OperationName": "Play",
"OperationVersion": "3/6/23",
"URI": "ccts-media-synthetics-prod.communication.azure.com",
"ResultType": "Succeeded",
"ResultSignature": "202",
"DurationMs": "82",
"CallerIpAddress": "40.88.50.228",
"CallConnectionId": "401f3500-fcb6-4b84-927e-81cd6372560b",
"ServerCallId": "aHR0cHM6Ly9hcGkuZmxpZ2h0cHJveHkuc2t5cGUuY29tL2FwaS92Mi9jcC9jb252LXVzZWEyLTAxLmNvbnYuc2t5cGUuY29tL2NvbnYvZzRoWlVoS1ZEVUtma19HenRDZ1JTQT9pPTEyJmU9NjM4MjA1NDc4MDg5MzEzMjIz",
"SdkVersion": "",
"SdkType": "unknown",
"SubOperationName": "File",
"OperationId": "5fab0875-3211-4879-8051-c688d0854c4d",
}
```

## Call Automation media summary logs

| Property | Description |
| -------- | ---------------|
| `TimeGenerated` | The time stamp (UTC) of the event.|
| `level`| The severity level of the event. It must be one of `Informational`, `Warning`, `Error`, or `Critical`.   |
| `resourceId` | The ID of the resource that emitted the event. |
| `durationMs` | The duration of the operation in milliseconds. |
| `callerIpAddress` | |
| `correlationId` | The Skype chain ID.   |
| `operationName` | The name of the operation that this event represents.|
| `operationVersion` | |
| `resultType` | The status of the event. Typical values include `Completed`, `Canceled`, and `Failed`.|
| `resultSignature` | The substatus of the operation. If this operation corresponds to a REST API call, this field is the HTTP status code of the corresponding REST call.|
| `operationId` | The operation ID that's used to correlate asynchronous events.|
| `recognizePromptSubOperationName` | A subtype of the operation. Potential values include `File`, `TextToSpeech`, and `SSML`.|
| `playInLoop` | `True` if looping was requested for the play operation. `False` if otherwise.|
| `playToParticipant` | `True` if the play operation had a target. `False` if it was a play-to-all operation.|
| `interrupted` | `True` if the prompt is interrupted. `False` if otherwise.|
| `resultCode` | The result code of the operation. |
| `resultSubcode` | The result subcode of the operation. |
| `resultMessage` | The result message of the operation. |

Here's an example of a Call Automation media summary log:

```json
[
{
"TimeGenerated [UTC]": "5/24/2023, 7:57:40.480 PM",
"Level": "Informational",
"CorrelationId": "d149d528-a392-404c-8fcd-69087e9d0802",
"ResultType": "Completed",
"OperationName": "Play",
"OperationId": "7bef24d5-eb95-4ee6-bbab-0b7d45d91288",
"PlayInLoop": "FALSE",
"PlayToParticipant": "TRUE",
"PlayInterrupted": "FALSE",
"RecognizePromptSubOperationName": "",
"ResultCode": "200",
"ResultSubcode": "0",
"ResultMessage": "Action completed successfully."
}

````

## Next steps

- Learn about the [insights dashboard to monitor Call Automation logs and metrics](/azure/communication-services/concepts/analytics/insights/call-automation-insights).
