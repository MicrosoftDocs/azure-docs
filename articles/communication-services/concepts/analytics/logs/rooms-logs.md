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
> Under diagnostic setting name please select "Operational Rooms Logs" to enable the logs for Rooms.

## Overview

Rooms operational logs are records of events and activities that provide insights into your Rooms API requests. They capture details about the performance and functionality of the Rooms primitive, including the status of each Rooms request as well as additional properties.
Rooms operational logs contain information that help identify trends and patterns of Rooms usage.

## Log categories

Communication Services offers the following types of logs that you can enable:

* **Operational Rooms logs** - provides basic information related to the Rooms service


### Operational Rooms logs schema

| Property | Description |
| -------- | ---------------|
| `Correlation ID` | Unique ID of the request. |
| `Level` | The severity level of the event. |
| `Operation Name` | The operation associated with log record. E.g., CreateRoom, PatchRoom, GetRoom, ListRooms, DeleteRoom, GetParticipants, UpdateParticipants.|
| `Operation Version` | The api-version associated with the operation. |
| `ResultType` | The status of the operation. |
| `ResultSignature` | The sub status of the operation. If this operation corresponds to a REST API call, this field is the HTTP status code of the corresponding REST call. |
|.`RoomId` | The ID of the Room. |
| `RoomLifeSpan` | The Room lifespan in minutes. |
| `AddedRoomParticipantsCount` | The count of participants added to a Room. |
| `UpsertedRoomParticipantsCount` | The count of participants upserted in a Room. |
| `RemovedRoomParticipantsCount` | The count of participants removed from a Room. |
| `TimeGenerated` | The timestamp (UTC) of when the log was generated. |


#### Example CreateRoom log

```json
    [
      {
      "CorrelationId": "Y4x6ZabFE0+E8ERwMpd68w",
      "Level": "Informational",
      "OperationName": "CreateRoom",
      "OperationVersion": "2022-03-31-preview",
      "ResultType": "Succeeded",
      "ResultSignature": 201,
      "RoomId": "99466898241024408",
      "RoomLifespan": 61,
      "AddedRoomParticipantsCount": 4,
      "TimeGenerated": "5/25/2023, 4:32:49.469 AM",
      }
    ]
```

#### Example GetRoom log

```json
    [
      {
      "CorrelationId": "CNiZIX7fvkumtBSpFq7fxg",
      "Level": "Informational",
      "OperationName": "GetRoom",
      "OperationVersion": "2022-03-31-preview",
      "ResultType": "Succeeded",
      "ResultSignature": "200",
      "RoomId": "99466387192310000",
      "RoomLifespan": 61,
      "TimeGenerated": "2022-08-19T17:07:30.2400300Z",
      },
    ]
```

#### Example UpdateRoom log

```json
    [
      {
      "CorrelationId": "Bwqzh0pdnkGPDwNcMnBkng",
      "Level": "Informational",
      "OperationName": "UpdateRoom",
      "OperationVersion": "2022-03-31-preview",
      "ResultType": "Succeeded",
      "ResultSignature": "200",
      "RoomId": "99466387192310000",
      "RoomLifespan": 121,
      "TimeGenerated": "2022-08-19T17:07:30.3543160Z",
      },
    ]
```

#### Example DeleteRoom log

```json
    [
      {
      "CorrelationId": "x7rMXmihYEe3GFho9T/H2w",
      "Level": "Informational",
      "OperationName": "DeleteRoom",
      "OperationVersion": "2022-02-01",
      "ResultType": "Succeeded",
      "ResultSignature": "204",
      "RoomId": "99466387192310000",
      "RoomLifespan": 121,
      "TimeGenerated": "2022-08-19T17:07:30.5393800Z",
      },
    ]
```

 #### Example ListRooms log

```json
	[
	  {
	  "CorrelationId": "KibM39CaXkK+HTInfsiY2w",
	  "Level": "Informational",
	  "OperationName": "ListRooms",
	  "OperationVersion": "2022-03-31-preview",
	  "ResultType": "Succeeded",
	  "ResultSignature": "200",
	  "TimeGenerated": "2022-08-19T17:07:30.5393800Z",
	  },
	]
```

#### Example UpdateParticipants log

```json
    [
      {
      "CorrelationId": "zHT8snnUMkaXCRDFfjQDJw",
      "Level": "Informational",
      "OperationName": "UpdateParticipants",
      "OperationVersion": "2022-03-31-preview",
      "ResultType": "Succeeded",
      "ResultSignature": "200",
      "RoomId": "99466387192310000",
      "RoomLifespan": 121,
      "UpsertedRoomParticipantsCount": 5,
      "RemovedRoomParticipantsCount": 1,
      "TimeGenerated": "2023-04-14T17:07:30.5393800Z",
      },
    ]
```

 (See also [FAQ](../../../../azure-monitor/faq.yml)).
