---
title: Azure Communication Services Usage Log Schema
titleSuffix: An Azure Communication Services concept article
description: Learn about the Voice and Video Usage logs.
author:  amagginetti
services: azure-communication-services

ms.author: amagginetti
ms.date: 02/04/2025
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: calling
---

# Usage Log Schema
The usage log schema is used to.....

| Property | Description |
| -------- | ---------------|
| `Timestamp` | The time stamp (UTC) when the log was generated. |
| `Operation Name` | The operation associated with the log record. |
| `Operation Version` | The `api-version` value associated with the operation, if the `Operation Name` operation was performed through an API. If no API corresponds to this operation, the version represents the version of the operation, in case the properties associated with the operation change in the future. |
| `Category` | The log category of the event. The category is the granularity at which you can enable or disable logs on a resource. The properties that appear within the `properties` blob of an event are the same within a log category and resource type. |
| `Correlation ID` | The ID for correlated events. You can use it to identify correlated events between multiple tables. |
| `Properties` | Other data that's applicable to various modes of Communication Services. |
| `Record ID` | The unique ID for a usage record. |
| `Usage Type` | The mode of usage (for example, Chat, PSTN, or NAT). |
| `Unit Type` | The type of unit that usage is based on for a mode of usage (for example, minutes, megabytes, or messages). |
| `Quantity` | The number of units used or consumed for this record. |
