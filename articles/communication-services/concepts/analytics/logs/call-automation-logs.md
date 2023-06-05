---
title: Azure Communication Services Call Automation logs
titleSuffix: An Azure Communication Services concept document
description: Learn about logging for Azure Communication Services Call Automation.
author: ddematheu2
services: azure-communication-services

ms.author: dademath
ms.date: 03/21/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: data
---

# Azure Communication Services Call Automation Logs

Azure Communication Services offers logging capabilities that you can use to monitor and debug your Communication Services solution. These capabilities can be configured through the Azure portal.

> [!IMPORTANT]
> The following refers to logs enabled through [Azure Monitor](../../../../azure-monitor/overview.md) (see also [FAQ](../../../../azure-monitor/faq.yml)). To enable these logs for your Communications Services, see: [Enable logging in Diagnostic Settings](../enable-logging.md)

## Resource log categories

Communication Services offers the following types of logs that you can enable:

* **Usage logs** - provides usage data associated with each billed service offering
* **Call Automation operational logs** - provides operational information on Call Automation API requests. These logs can be used to identify failure points, query all requests made in a call (using Correlation ID or Server Call ID) or query all requests made by a specific service application in the call (using Participant ID).

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