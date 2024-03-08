---
title: SMS metrics definitions for Azure Communication Service
titleSuffix: An Azure Communication Services concept document
description: This document covers definitions of SMS metrics available in the Azure portal.
author: mkhribech
manager: timmitchell
services: azure-communication-services
ms.author: mkhribech
ms.date: 06/23/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: data
---
# SMS metrics overview

Azure Communication Services currently provides metrics for all Communication Services primitives. You can use [Azure Monitor metrics explorer](../../../azure-monitor\essentials\analyze-metrics.md) to:

- Plot your own charts.
- Investigate abnormalities in your metric values.
- Understand your API traffic by using the metrics data that Chat requests emit.

## Where to find metrics

Primitives in Communication Services emit metrics for API requests. To find these metrics, see the **Metrics** tab under your Communication Services resource. You can also create permanent dashboards by using the workbooks tab under your Communication Services resource.

## Metric definitions

All API request metrics contain three dimensions that you can use to filter your metrics data. These dimensions can be aggregated together by using the `Count` aggregation type. They support all standard Azure Aggregation time series, including `Sum`, `Average`, `Min`, and `Max`.

For more information on supported aggregation types and time series aggregations, see [Advanced features of Azure Metrics Explorer](../../../azure-monitor/essentials/metrics-charts.md#aggregation).

- **Operation**: All operations or routes that can be called on the Azure Communication Services Chat gateway.
- **Status Code**: The status code response sent after the request.
- **StatusSubClass**: The status code series sent after the response.

### SMS API requests

The following operations are available on SMS API request metrics.

| Operation/Route    | Description                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| SMSMessageSent       | Sends an SMS message. |
| SMSDeliveryReportsReceived     | Gets SMS Delivery Reports |
| SMSMessagesReceived      | Gets SMS messages. |
