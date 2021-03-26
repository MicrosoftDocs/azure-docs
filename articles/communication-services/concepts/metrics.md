---
title: Metric definitions for Azure Communication Service
titleSuffix: An Azure Communication Services concept document
description: This document covers definitions of metrics available in the Azure portal.
author: mikben
manager: jken
services: azure-communication-services

ms.author: mikben
ms.date: 03/10/2021
ms.topic: overview
ms.service: azure-communication-services
---
# Metrics overview

Azure Communication Services currently provides metrics for Chat and SMS. [Azure Metrics Explorer](../../azure-monitor/essentials/metrics-getting-started.md) can be used to plot your own charts, investigate abnormalities in your metric values, and understand your API traffic by using the metrics data that Chat and SMS requests emit.

## Where to find Metrics

Chat and SMS services in Azure Communication Services emit metrics for API requests. These metrics can be found in the Metrics blade under your Communication Services resource. You can also create permanent dashboards using the workbooks blade under your Communication Services resource.

## Metric definitions

There are two types of requests that are represented within Communication Services metrics: **Chat API requests** and **SMS API requests**.

Both Chat and SMS API request metrics contain three dimensions that you can use to filter your metrics data. These dimensions can be aggregated together using the `Count` aggregation type and support all standard Azure Aggregation time series including `Sum`, `Average`, `Min`, and `Max`.

More information on supported aggregation types and time series aggregations can be found [Advanced features of Azure Metrics Explorer](../../azure-monitor/essentials/metrics-charts.md#aggregation)

- **Operation** - All operations or routes that can be called on the ACS Chat gateway.
- **Status Code** - The status code response sent after the request.
- **StatusSubClass** - The status code series sent after the response. 


### Chat API request metric operations

The following operations are available on Chat API request metrics:

| Operation / Route    | Description                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| GetChatMessage       | Gets a message by message id. |
| ListChatMessages     | Gets a list of chat messages from a thread. |
| SendChatMessage      | Sends a chat message to a thread. |
| UpdateChatMessage    | Updates a chat message. |
| DeleteChatMessage    | Deletes a chat message. |
| GetChatThread        | Gets a chat thread. |
| ListChatThreads      | Gets the list of chat threads of a user. |
| UpdateChatThread     | Updates a chat thread's properties. |
| CreateChatThread     | Creates a chat thread. |
| DeleteChatThread     | Deletes a thread. |
| GetReadReceipts      | Gets read receipts for a thread. |
| SendReadReceipt      | Sends a read receipt event to a thread, on behalf of a user. |
| SendTypingIndicator           | Posts a typing event to a thread, on behalf of a user. |
| ListChatThreadParticipants    | Gets the members of a thread. |
| AddChatThreadParticipants     | Adds thread members to a thread. If members already exist, no change occurs. |
| RemoveChatThreadParticipant   | Remove a member from a thread. |

:::image type="content" source="./media/chat-metric.png" alt-text="Chat API Request Metric.":::

If a request is made to an operation that isn't recognized, you'll receive a "Bad Route" value response.

### SMS API requests

The following operations are available on SMS API request metrics:

| Operation / Route    | Description                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| SMSMessageSent       | Sends a SMS message. |
| SMSDeliveryReportsReceived     | Gets SMS Delivery Reports |
| SMSMessagesReceived      | Gets SMS messages. |


:::image type="content" source="./media/sms-metric.png" alt-text="SMS API Request Metric.":::

### Authentication API requests

The following operations are available on Authentication API request metrics:

| Operation / Route    | Description                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| CreateIdentity       | Creates an identity representing a single user. |
| DeleteIdentity       | Deletes an identity. |
| CreateToken          | Creates an access token. |
| RevokeToken          | Revokes all access tokens created for an identity before a time given. |

:::image type="content" source="./media/acs-auth-metrics.png" alt-text="Authentication Request Metric.":::

## Next Steps

- Learn more about [Data Platform Metrics](../../azure-monitor/essentials/data-platform-metrics.md)
