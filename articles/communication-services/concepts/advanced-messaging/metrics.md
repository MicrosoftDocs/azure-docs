---
title: Advanced Messaging metrics definitions for Azure Communication Service
titleSuffix: An Azure Communication Services concept document
description: This document covers definitions of Advanced Messaging metrics available in the Azure portal.
author: memontic-ms
services: azure-communication-services
ms.author: memontic
ms.date: 07/18/2024
ms.topic: conceptual
ms.service: azure-communication-services
---

# Advanced Messaging metrics overview

Azure Communication Services currently provides metrics for all Communication Services primitives. You can use [Azure Monitor metrics explorer](../../../azure-monitor/essentials/analyze-metrics.md) to:

- Plot your own charts.
- Investigate abnormalities in your metric values.
- Understand your API traffic by using the metrics data that Advanced Messaging requests emit.

## Where to find metrics

Primitives in Communication Services emit metrics for API requests. To find these metrics, see the **Metrics** tab under your Communication Services resource. You can also create permanent dashboards by using the workbooks tab under your Communication Services resource.

## Metric definitions

All API request metrics contain three dimensions that you can use to filter your metrics data. These dimensions can be aggregated together by using the `Count` aggregation type. They support all standard Azure Aggregation time series, including `Sum`, `Average`, `Min`, and `Max`.

For more information on supported aggregation types and time series aggregations, see [Azure Monitor Metrics aggregation and display explained](./../../../azure-monitor/essentials/metrics-aggregation-explained.md).

- **Operation**: All operations or routes that can be called on the Azure Communication Services Advanced Messaging gateway.
- **Status Code**: The status code response sent after the request.
- **StatusSubClass**: The status code series sent after the response.

For the complete list of all metrics emitted by Azure Communication Services, see [Metrics overview](./../metrics.md) or the reference documentation [Supported metrics for Microsoft.Communication/CommunicationServices](/azure/azure-monitor/reference/supported-metrics/microsoft-communication-communicationservices-metrics).

### Advanced Messaging API requests

The following operations are available on Advanced Messaging API request metrics:

| Operation / Route         | Description                        | Scenario                                                                                  |
|---------------------------|------------------------------------|-------------------------------------------------------------------------------------------|
| DownloadMedia             | Download media payload request.    | Business requested to download media payload.                                             |
| ListTemplates             | List templates request.            | Business requested to list templates for a given channel.                                 |
| ReceiveMessage            | Message received.                  | User sent a message to the business.                                                      |
| SendMessage               | Send message notification request. | Business requesting to send a message to the user.                                        |
| SendMessageDeliveryStatus | Delivery status received.          | Business received response about a message that the business requested to send to a user. |

:::image type="content" source="./../media/acs-advanced-messaging-metrics.png" alt-text="Screenshot of Advanced Messaging request metric."  lightbox="./../media/acs-advanced-messaging-metrics.png":::
