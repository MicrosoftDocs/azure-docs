---
title: Azure Communication Services Rooms logs
titleSuffix: An Azure Communication Services concept document
description: Learn about logging for Azure Communication Services Rooms.
author: shwali
services: azure-communication-services

ms.author: shwali
ms.date: 05/25/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: data
---

# Azure Communication Services Rooms Logs

Azure Communication Services offers logging capabilities that you can use to monitor and debug your Communication Services solution. These capabilities can be configured through the Azure portal.

> [!IMPORTANT]
> The following refers to logs enabled through [Azure Monitor](../../../../azure-monitor/overview.md) (see also [FAQ](../../../../azure-monitor/faq.yml)). To enable these logs for your Communications Services, see: [Enable logging in Diagnostic Settings](../enable-logging.md)

## Pre-requisites

Azure Communications Services provides monitoring and analytics features via [Azure Monitor Logs overview](../../../../azure-monitor/logs/data-platform-logs.md) and [Azure Monitor Metrics](../../../../azure-monitor/essentials/data-platform-metrics.md). Each Azure resource requires its own diagnostic setting, which defines the following criteria:
  * Categories of logs and metric data sent to the destinations defined in the setting. The available categories will vary for different resource types.
  * One or more destinations to send the logs. Current destinations include Log Analytics workspace, Event Hubs, and Azure Storage.
  * A single diagnostic setting can define no more than one of each of the destinations. If you want to send data to more than one of a particular destination type (for example, two different Log Analytics workspaces), then create multiple settings. Each resource can have up to five diagnostic settings.

The following are instructions for configuring your Azure Monitor resource to start creating logs and metrics for your Communications Services. For detailed documentation about using Diagnostic Settings across all Azure resources, see: [Enable logging in Diagnostic Settings](../enable-logging.md)

> [!NOTE]
> Under diagnostic setting name please select “Operational Rooms Logs” to enable the logs for Rooms.

## **Overview**

Rooms operational logs are records of events and activities that provide insights into your Rooms API requests. They captured details about the performance and functionality of the Rooms primitive, including details about the status of request whether rooms were successfully created, updated, deleted or failed.
Rooms operational logs contain information that help identify trends and patterns of Rooms usage.

## Log categories

Communication Services offers the following types of logs that you can enable:

* **Operational Rooms logs** - provides basic information related to the Rooms service


### Operational Rooms logs schema

| Property | Description |
| -------- | ---------------|
| `Correlation ID` | Room id for correlated events. Can be used to identify correlated events between multiple tables. |
| `Level` | The severity level of the event. |
| `Operation Name` | The operation associated with log record. |
| `Operation Version` | The `api-version` associated with the operation, if the operationName was performed using an API. If there's no API that corresponds to this operation, the version represents the version of that operation in case the properties associated with the operation change in the future. |
| `ResultType` | The status of the operation. |
| `ResultSignature` | The sub status of the operation. If this operation corresponds to a REST API call, this field is the HTTP status code of the corresponding REST call. |
| `RoomLifeSpan` | Life span of the Room.based on Valid From and Valid To date time of the Room. |
| `RoomJoinPolicy` | The join policy of the Room. |
| `TenantId` | The tenant id of the resource. |
| `TimeGenerated` | The timestamp (UTC) of when the log was generated. |
| `Type` | The type of the log. |
| `_ResourceId` | The resource id of the resource. |


#### Example Rooms log

```json
    [
      {
      "CorrelationId": "99466898241024408",
      "Level": "Informational",
      "OperationName": "CreateRoom",
      "OperationVersion": "2022-02-01",
      "ResultType": "Succeeded",
      "ResultSignature": 201,
      "RoomLifespan": 61,
      "RoomJoinPolicy": "InviteOnly",
      "TenantId": "f606d782-d5dd-47e9-a299-815b9be0ea25",
      "TimeGenerated [UTC]": "5/25/2023, 4:32:49.469 AM",
      "Type": "ACSRoomsIncomingOperations",
      "_ResourceId": "/subscriptions/ed463725-1c38-43fc-bd8b-cac509b41e96/resourcegroups/acs-rooms-e2e-prod/providers/microsoft.communication/communicationservices/rooms-e2e-prod"
      }
    ]
```

 (see also [FAQ](../../../../azure-monitor/faq.yml)). 
