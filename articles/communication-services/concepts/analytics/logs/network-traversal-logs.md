---
title: Azure Communication Services Network Traversal logs
titleSuffix: An Azure Communication Services concept document
description: Learn about logging for Azure Communication Services Network Traversal.
author: tophpalmer
services: azure-communication-services
ms.author: chpalm
ms.date: 03/21/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: data
---

# Azure Communication Services Network Traversal Logs

Azure Communication Services offers logging capabilities that you can use to monitor and debug your Communication Services solution. These capabilities can be configured through the Azure portal.

> [!IMPORTANT]
> The following refers to logs enabled through [Azure Monitor](../../../../azure-monitor/overview.md) (see also [FAQ](../../../../azure-monitor/faq.yml)). To enable these logs for your Communications Services, see: [Enable logging in Diagnostic Settings](../enable-logging.md)

## Resource log categories

Communication Services offers the following types of logs that you can enable:

* **Usage logs** - provides usage data associated with each billed service offering
* **Network Traversal operational logs** - provides basic information related to the Network Traversal service

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

## Network Traversal operational logs

| Dimension | Description|
|------------------|--------------------|
| `TimeGenerated` | The timestamp (UTC) of when the log was generated. |
| `OperationName` | The operation associated with log record.  |
| `CorrelationId`    | The ID for correlated events. Can be used to identify correlated events between multiple tables.                                                      |
| `OperationVersion` | The API-version associated with the operation or version of the operation (if there's no API version).                                               |
| `Category`         | The log category of the event. Logs with the same log category and resource type will have the same properties fields.                                |
| `ResultType`       | The status of the operation (for example, Succeeded or Failed). |
| `ResultSignature`  | The sub status of the operation. If this operation corresponds to a REST API call, this field is the HTTP status code of the corresponding REST call. |
| `DurationMs`       | The duration of the operation in milliseconds.  |
| `Level`            | The severity level of the operation.           |
| `URI`              | The URI of the request.                         |
| `Identity`         | The request sender's identity, if provided.     |
| `SdkType`          | The SDK type being used in the request.          |
| `PlatformType`     | The platform type being used in the request.      |
| `RouteType`        | The routing methodology to where the ICE server will be located from the client (for example, Any or Nearest). |

