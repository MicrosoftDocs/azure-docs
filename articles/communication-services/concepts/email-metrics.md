---
title: Email metric definitions for Azure Communication Services
titleSuffix: An Azure Communication Services concept document
description: This document covers definitions of Azure Communication Services email metrics available in the Azure portal.
author: mkhribech
manager: timmitchell
services: azure-communication-services

ms.author: mkhribech
ms.date: 06/30/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: data
---
# Email metrics overview

Azure Communication Services currently provides metrics for all Azure communication services' primitives. [Azure Metrics Explorer](../../azure-monitor/essentials/metrics-getting-started.md) can be used to plot your own charts, investigate abnormalities in your metric values, and understand your API traffic by using the metrics data that email requests emit.

## Where to find metrics

Primitives in Azure Communication Services emit metrics for API requests. These metrics can be found in the Metrics tab under your Communication Services resource. You can also create permanent dashboards using the workbooks tab under your Communication Services resource.

## Metric definitions

All API request metrics contain three dimensions that you can use to filter your metrics data. These dimensions can be aggregated together using the `Count` aggregation type and support all standard Azure Aggregation time series including `Sum`, `Average`, `Min`, and `Max`.

More information on supported aggregation types and time series aggregations can be found [Advanced features of Azure Metrics Explorer](../../azure-monitor/essentials/metrics-charts.md#aggregation)

- **Operation** - All operations or routes that can be called on the Azure Communication Services Chat gateway.
- **Status Code** - The status code response sent after the request.
- **StatusSubClass** - The status code series sent after the response. 

### Email Service Delivery Status Updates
The `Email Service Delivery Status Updates` metric lets the email sender track SMTP and Enhanced SMTP status codes and get an idea of how many hard bounces they are encountering.

The following dimensions are available on the `Email Service Delivery Status Updates` metric:

| Dimension    | Description                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| Result       | High level status of the message delivery: Success, Failure. |
| MessageStatus       | Terminal state of the Delivered, Failed, Suppressed. Emails are suppressed when a user sends an email to an email address that is known not to exist. Sending emails to addresses that do not exist trigger a hard bounce. |
| IsHardBounce       | True when a message delivery failed due to a hard bounce or if an item was suppressed due to a previous hard bounce. |
| SenderDomain       | The domain portion of the senders email address. |
| SmtpStatusCode       | Smpt error code from for failed deliveries. |
| EnhancedSmtpStatusCode       | The EnhancedSmtpStatusCode status code will be emitted if it is available. This status code provides additional details not available with the SmtpStatusCode. |

:::image type="content" source="./media/acs-email-delivery-status-hardbounce-metrics.png" alt-text="Screenshot showing the Email delivery status update metric - IsHardBounce.":::
:::image type="content" source="./media/acs-email-delivery-status-smtp-metrics.png" alt-text="Screenshot showing the Email delivery status update metric - SmptStatusCode.":::

### Email Service API requests

The following operations are available for the `Email Service API Requests` metric. These standard dimensions are supported: StatusCode, StatusCodeClass, StatusCodeReason and Operation.

| Operation    | Description                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| SendMail       | Email Send API. |
| GetMessageStatus       | Get the delivery status of a messageId. |

:::image type="content" source="./media/acs-email-api-request-metrics.png" alt-text="Screenshot showing the Email API Request Metrics.":::

### Email User Engagement

The `Email Service User Engagement` metric is supported with HTML type emails and must be opted into on your Domains resource. These dimensions are available for `Email Service User Engagement` metrics:

| Dimension    | Description                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| EngagementType       | Type of interaction performed by the receiver of the email. |

:::image type="content" source="./media/acs-email-user-engagement-metrics.png" alt-text="Screenshot showing the Email user engagement metric.":::

## Next steps

- Learn more about [Data Platform Metrics](../../azure-monitor/essentials/data-platform-metrics.md)
