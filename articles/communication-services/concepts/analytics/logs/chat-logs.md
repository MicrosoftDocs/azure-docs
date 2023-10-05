---
title: Azure Communication Services chat logs
titleSuffix: An Azure Communication Services concept document
description: Learn about logging for Azure Communication Services chat.
author: tophpalmer
services: azure-communication-services
ms.author: chpalm
ms.date: 03/21/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: data
---

# Azure Communication Services chat logs

Azure Communication Services offers logging capabilities that you can use to monitor and debug your Communication Services solution. These capabilities can be configured through the Azure portal.

> [!IMPORTANT]
> The following refers to logs enabled through [Azure Monitor](../../../../azure-monitor/overview.md) (see also [FAQ](../../../../azure-monitor/faq.yml)). To enable these logs for your Communications Services, see: [Enable logging in Diagnostic Settings](../enable-logging.md)

## Resource log categories

Communication Services offers the following types of logs that you can enable:

* **Usage logs** - provides usage data associated with each billed service offering
* **Authentication operational logs** - provides basic information related to the Authentication service
* **Chat operational logs** - provides basic information related to the chat service

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

## Authentication operational logs

| Property | Description |
| -------- | ---------------|
| `TimeGenerated` | The timestamp (UTC) of when the log was generated. |
| `OperationName` | The operation associated with log record. |
| `CorrelationID` | The ID for correlated events. Can be used to identify correlated events between multiple tables. |
| `OperationVersion` | The `api-version` associated with the operation, if the `operationName` was performed using an API. If there's no API that corresponds to this operation, the version represents the version of that operation in case the properties associated with the operation change in the future. |
| `Category` | The log category of the event. Category is the granularity at which you can enable or disable logs on a particular resource. The properties that appear within the properties blob of an event are the same within a particular log category and resource type. |
| `ResultType` | The status of the operation. |
| `ResultSignature` | The sub-status of the operation. If this operation corresponds to a REST API call, this field is the HTTP status code of the corresponding REST call. |
| `DurationMs` | The duration of the operation in milliseconds. |
| `CallerIpAddress` | The caller IP address, if the operation corresponds to an API call that would come from an entity with a publicly available IP address. |
| `Level` | The severity level of the event. |
| `URI` | The URI of the request. |
| `SdkType` | The SDK type used in the request. |
| `PlatformType` | The platform type used in the request. |
| `Identity` | The identity of Azure Communication Services or Teams user related to the operation. |
| `Scopes` | The Communication Services scopes present in the access token. |

## Chat operational logs

| Property | Description |
| -------- | ---------------|
| TimeGenerated | The timestamp (UTC) of when the log was generated. |
| OperationName | The operation associated with log record. |
| CorrelationID | The ID for correlated events. Can be used to identify correlated events between multiple tables. |
| OperationVersion | The api-version associated with the operation, if the operationName was performed using an API. If there's no API that corresponds to this operation, the version represents the version of that operation in case the properties associated with the operation change in the future. |
| Category | The log category of the event. Category is the granularity at which you can enable or disable logs on a particular resource. The properties that appear within the properties blob of an event are the same within a particular log category and resource type. |
| ResultType | The status of the operation. |
| ResultSignature | The sub status of the operation. If this operation corresponds to a REST API call, this field is the HTTP status code of the corresponding REST call. |
| ResultDescription | The static text description of this operation. |
| DurationMs | The duration of the operation in milliseconds. |
| CallerIpAddress | The caller IP address, if the operation corresponds to an API call that would come from an entity with a publicly available IP address. |
| Level | The severity level of the event. |
| URI | The URI of the request. |
| UserId | The request sender's user ID. |
| ChatThreadId | The chat thread ID associated with the request. |
| ChatMessageId | The chat message ID associated with the request. |
| SdkType | The Sdk type used in the request. |
| PlatformType | The platform type used in the request. |
