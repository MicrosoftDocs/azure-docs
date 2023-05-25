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
| `Correlation ID` | The ID of the room, which is a distinguished identifier for an existing room. |
| `Level` | The severity level of the event. |
| `Operation Name` | The operation associated with log record. e.g., CreateRoom, PatchRoom, GetRoom, ListRooms, DeleteRoom, GetParticipants, AddParticipants, UpdateParticipants, or RemoveParticipants. |
| `Operation Version` | The API-version associated with the operation or version of the operation (if there is no API version). |
| `ResultType` | The status of the operation. |
| `ResultSignature` | The sub status of the operation. If this operation corresponds to a REST API call, this field is the HTTP status code of the corresponding REST call. |
| `RoomLifeSpan` | The Room lifespan in minutes. |
| `RoomParticipantsCount` | The count of participants in a room. |
| `RoomParticipantsConsumer` | The participants count with consumer role. |
| `RoomParticipantsAttendee` | The participants count with attendee role. |
| `RoomParticipantsPresenter` | The participants count with presenter role. |
| `RoomJoinPolicy` | [Deprecated in version 2023-03-31-preview, all rooms are InviteOnly by default] The policy of a room indicating invite only or CommunicationServiceUsers. |
| `AddedRoomParticipantsCount` | The count of participants added to a room. |
| `UpsertedRoomParticipantsCount` | The count of participants upserted in a room. |
| `RemovedRoomParticipantsCount` | The count of participants removed in a room. |
| `TenantId` | The tenant id of the resource. |
| `TimeGenerated` | The timestamp (UTC) of when the log was generated. |


#### Example CreateRoom log

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
      "RoomParticipantsCount": 3,
      "RoomParticipantsConsumer": 1,
      "RoomParticipantsAttendee": 1,
      "RoomParticipantsPresenter": 1,
      "RoomJoinPolicy": "InviteOnly",
      "AddedRoomParticipantsCount": 0,
      "UpsertedRoomParticipantsCount": 0,
      "RemovedRoomParticipantsCount": 0,
      "TenantId": "f606d782-d5dd-47e9-a299-815b9be0ea25",
      "TimeGenerated [UTC]": "5/25/2023, 4:32:49.469 AM",
      }
    ]
```

#### Example GetRoom log

```json
    [
      {
      "CorrelationId": "99466387192310000",
      "Level": "Informational",
      "OperationName": "GetRoom",
      "OperationVersion": "2022-02-01",
      "ResultType": "Succeeded",
      "ResultSignature": "200",
      "RoomLifespan": 61,
      "RoomParticipantsCount": 5,
      "RoomParticipantsConsumer": 1,
      "RoomParticipantsAttendee": 2,
      "RoomParticipantsPresenter": 2,
      "RoomJoinPolicy": "CommunicationServiceUsers",
      "AddedRoomParticipantsCount": 0,
      "UpsertedRoomParticipantsCount": 0,
      "RemovedRoomParticipantsCount": 0,
      "TenantId": "f606d782-d5dd-47e9-a299-815b9be0ea25",
      "TimeGenerated": "2022-08-19T17:07:30.2400300Z",
      },
    ]
```
 (see also [FAQ](../../../../azure-monitor/faq.yml)). 
