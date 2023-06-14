---
title: Azure Communication Services Call Automation logs
titleSuffix: An Azure Communication Services concept document
description: Learn about logging for Azure Communication Services Call Automation.
author: mkhribech
services: azure-communication-services

ms.author: mkhribech
ms.date: 05/24/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: data
---

# Azure Communication Services Call Automation Logs

Azure Communication Services offers logging capabilities that you can use to monitor and debug your Communication Services solution. These capabilities can be configured through the Azure portal.

## Prerequisites

Azure Communications Services provides monitoring and analytics features via [Azure Monitor Logs overview](../../../../azure-monitor/logs/data-platform-logs.md) and [Azure Monitor Metrics](../../../../azure-monitor/essentials/data-platform-metrics.md). Each Azure resource requires its own diagnostic setting, which defines the following criteria:
  * Categories of logs and metric data sent to the destinations defined in the setting. The available categories will vary for different resource types.
  * One or more destinations to send the logs. Current destinations include Log Analytics workspace, Event Hubs, and Azure Storage.
  * A single diagnostic setting can define no more than one of each of the destinations. If you want to send data to more than one of a particular destination type (for example, two different Log Analytics workspaces), then create multiple settings. Each resource can have up to five diagnostic settings.

> [!IMPORTANT]
> You must enable a Diagnostic Setting in Azure Monitor to send the log data of your surveys to a Log Analytics workspace, Event Hubs, or an Azure storage account to receive and analyze your survey data. If you do not send call automation data to one of these options your survey data will not be stored and will be lost
The following are instructions for configuring your Azure Monitor resource to start creating logs and metrics for your Communications Services. For detailed documentation about using Diagnostic Settings across all Azure resources, see: [Enable logging in Diagnostic Settings](../enable-logging.md)

> [!NOTE]
> Under diagnostic setting name please select “Operation call automation logs” and “Call Automation Events summary logs” to enable the logs for end of call automation logs.
 
 :::image type="content" source="..\media\log-analytics\call-automation-log.png" alt-text="Screenshot of diagnostic settings for call automation.":::


## Resource log categories

Communication Services offers the following types of logs that you can enable:

* **Usage logs** - provides usage data associated with each billed service offering.
* **Call Automation operational logs** - provides operational information on Call Automation API requests. These logs can be used to identify failure points and query all requests made in a call (using Correlation ID or Server Call ID).
* **Call Automation media summary logs** - Provides information about outcome of media operations. These come to the user asynchronously when making media requests using Call Automation APIs. These can be used to help identify failure points and possible patterns on how end users are interacting with your application. 

## Usage logs schema

| Property | Description |
| -------- | ---------------|
| `Timestamp` | The timestamp (UTC) of when the log was generated. |
| `Operation Name` | The operation associated with log record. |
| `Operation Version` | The `api-version` associated with the operation, if the operationName was performed using an API. If there's no API that corresponds to this operation, the version represents the version of that operation in case the properties associated with the operation change in the future. |
| `Category` | The log category of the event. Category is the granularity at which you can enable or disable logs on a particular resource. The properties that appear within the properties blob of an event are the same within a particular log category and resource type. |
| `Correlation ID` | The ID for correlated events. Can be used to identify correlated events between multiple tables. |
| `Properties` | Other data applicable to various modes of Communication Services. |
| `Record ID` | The unique ID for a given usage record. |
| `Usage Type` | The mode of usage. (for example, Chat, PSTN, NAT, etc.) |
| `Unit Type` | The type of unit that usage is based off for a given mode of usage. (for example, minutes, megabytes, messages, etc.). |
| `Quantity` | The number of units used or consumed for this record. |

## Call Automation operational logs

| Property | Description |
| -------- | ---------------|
| `TimeGenerated` | The timestamp (UTC) of when the log was generated. |
| `OperationName` | The operation associated with log record. |
| `CorrelationID` | The identifier to identify a call and correlate events for a unique call.  |
| `OperationVersion` | The `api-version` associated with the operation, if the `operationName` was performed using an API. If there's no API that corresponds to this operation, the version represents the version of that operation in case the properties associated with the operation change in the future. |
| `Category` | The log category of the event. Category is the granularity at which you can enable or disable logs on a particular resource. The properties that appear within the properties blob of an event are the same within a particular log category and resource type. |
| `ResultType` | The status of the operation. |
| `ResultSignature` | The sub status of the operation. If this operation corresponds to a REST API call, this field is the HTTP status code of the corresponding REST call. |
| `DurationMs` | The duration of the operation in milliseconds. |
| `CallerIpAddress` | The caller IP address, if the operation corresponds to an API call that would come from an entity with a publicly available IP address. |
| `Level` | The severity level of the event. |
| `URI` | The URI of the request. |
| `CallConnectionId` | ID representing the call connection, if available. This ID is different for each participant and is used to identify their connection to the call.  |
| `ServerCallId` | A unique ID to identify a call. |
| `SDKVersion` | SDK version used for the request. |
| `SDKType` | The SDK type used for the request. |
| `ParticipantId` | ID to identify the call participant that made the request. |
| `SubOperationName` | Used to identify the sub type of media operation (play, recognize) |
|`operationID`| it represents the operation ID used to correlate asynchronous events| 

**Examples**

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
| `TimeGenerated` | it represents the timestamp (UTC) of the event|
|`level`| It represents the severity level of the event. Must be one of Informational, Warning, Error, or Critical.   |
|`resourceId`| it represents the resource ID of the resource that emitted the event |
|`durationMs`| it represents the duration of the operation in milliseconds |
|`callerIpAddress`| |
|`correlationId`| Skype Chain ID   |
|`operationName`| The name of the operation represented by this event|
|`operationVersion`
| `resultType`| The status of the event. Typical values include Completed, Canceled, Failed|
| `resultSignature`| The sub status of the operation. If this operation corresponds to a REST API call, this field is the HTTP status code of the corresponding REST call|
|`operationId`| it represents the operation ID used to correlate asynchronous events|
|`recognizePromptSubOperationName`|A subtype of the operation. Potential values: File, TextToSpeech, SSML, etc.|
| `playInLoop`| True if looping was requested for the Play operation, else otherwise|
|`playToParticipant`| True if the Play operation had a target. False if it was a play to all operation|
| `interrupted`| True in case of the prompt being interrupted, false otherwise|
|`resultCode`|Operation Result Code |
|`resultSubcode`| Operation Result Subcode |
|`resultMessage`| Operation result message |


**Examples**
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
