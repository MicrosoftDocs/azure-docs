---
title: SMS metrics
titleSuffix: An Azure Communication Services article
description: This article describes the SMS metrics available in the Azure portal.
author: mkhribech
services: azure-communication-services
ms.author: mkhribech
ms.date: 06/23/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: data
---
# SMS metrics

Azure Communication Services provides metrics for Azure Communication Services. You can use [Azure Monitor metrics explorer](/azure/azure-monitor/essentials/analyze-metrics) to:

- Plot your own charts.
- Investigate abnormalities in your metric values.
- Understand your API traffic by using the metrics data that Chat requests emit.

## Where to find metrics

Each service in Azure Communication Services emits metrics for API requests. To view metrics, see the **Metrics** tab under your Communication Services resource. You can also create permanent dashboards by using the workbooks tab under your Communication Services resource.

## Metric definitions

All API request metrics contain three dimensions that you can use to filter your metrics data. These dimensions can be aggregated together by using the `Count` aggregation type. They support all standard Azure Aggregation time series, including `Sum`, `Average`, `Min`, and `Max`.

For more information on supported aggregation types and time series aggregations, see [Advanced features of Azure Metrics Explorer](/azure/azure-monitor/essentials/metrics-charts#aggregation).

- **Operation**: All operations or routes that can be called on the Azure Communication Services Chat gateway.
- **Status Code**: The status code response sent after the request.
- **StatusSubClass**: The status code series sent after the response.

### SMS API requests

The following operations are available on SMS API request metrics.

| Operation/Route | Description |
| --- | --- |
| `SMSMessageSent` | Sends an SMS message. |
| `SMSDeliveryReportsReceived` | Gets SMS Delivery Reports |
| `SMSMessagesReceived` | Gets SMS messages. |
