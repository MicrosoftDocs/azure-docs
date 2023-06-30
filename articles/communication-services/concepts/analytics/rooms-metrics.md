---
title: Rooms metrics definitions for Azure Communication Service
titleSuffix: An Azure Communication Services concept document
description: This document covers definitions of rooms metrics available in the Azure portal.
author: mkhribech
manager: timmitchell
services: azure-communication-services
ms.author: mkhribech
ms.date: 06/26/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: data
---
# Rooms metrics overview

Azure Communication Services currently provides metrics for all ACS primitives. [Azure Metrics Explorer](../../../azure-monitor\essentials\metrics-getting-started.md) can be used to plot your own charts, investigate abnormalities in your metric values, and understand your API traffic by using the metrics data that rooms requests emit.

## Where to find metrics

Primitives in Azure Communication Services emit metrics for API requests. These metrics can be found in the Metrics tab under your Communication Services resource. You can also create permanent dashboards using the workbooks tab under your Communication Services resource.

## Metric definitions

All API request metrics contain three dimensions that you can use to filter your metrics data. These dimensions can be aggregated together using the `Count` aggregation type and support all standard Azure Aggregation time series including `Sum`, `Average`, `Min`, and `Max`.

More information on supported aggregation types and time series aggregations can be found [Advanced features of Azure Metrics Explorer](../../../azure-monitor/essentials/metrics-charts.md#aggregation).

- **Operation** - All operations or routes that can be called on the Azure Communication Services Chat gateway.
- **Status Code** - The status code response sent after the request.
- **StatusSubClass** - The status code series sent after the response. 

### Rooms API requests

The following operations are available on Rooms API request metrics:

| Operation / Route             | Description                                                                                    |
| ----------------------------- | ---------------------------------------------------------------------------------------------- |
| CreateRoom                    | Creates a Room. |
| DeleteRoom                    | Deletes a Room. |
| GetRoom                       | Gets a Room by Room ID. |
| PatchRoom                     | Updates a Room by Room ID. |
| ListRooms                     | Lists all the Rooms for an ACS Resource. |
| AddParticipants               | Adds participants to a Room.|
| RemoveParticipants            | Removes participants from a Room. |
| GetParticipants               | Gets list of participants for a Room. |
| UpdateParticipants            | Updates list of participants for a Room. |

:::image type="content" source="../media/rooms/rooms-metrics.png" alt-text="Screenshot showing Rooms Request Metrics.":::

## Next steps

- Learn more about [Data Platform Metrics](../../../azure-monitor/essentials/data-platform-metrics.md)
