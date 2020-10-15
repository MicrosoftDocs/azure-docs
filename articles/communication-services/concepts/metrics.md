---
title: Metric definitions for Azure Communication Service
titleSuffix: An Azure Communication Services concept document
description: This document covers definitions of metrics available in the Azure portal.
author: mikben
manager: jken
services: azure-communication-services

ms.author: mikben
ms.date: 05/19/2020
ms.topic: overview
ms.service: azure-communication-services
---
# Metrics overview

Azure Communication Services currently provides metrics for Chat and SMS. [Azure Metrics Explorer](https://docs.microsoft.com/azure/azure-monitor/platform/metrics-getting-started) can be used to plot your own charts, investigate abnormalities in your metric values, and understand your API traffic by using the metrics data that Chat and SMS requests emit.

## Where to find Metrics

Chat and SMS services in Azure Communication Services emit metrics for API requests. These metrics can be found in the Metrics blade under your Communication Services resource. You can also create permanent dashboards using the workbooks blade under your Communication Services resource.

## Metric definitions

There are two types of requests that are represented within Communication Services metrics: **Chat API requests** and **SMS API requests**.

Both Chat and SMS API request metrics contain three dimensions that you can use to filter your metrics data. These dimensions can be aggregated together using `count` and support all standard Azure Aggregation time series:

TODO: clarify what 'Count' means, and what the following items represent (to a developer who is new to Azure and Aggregation)

- **Operation** - All operations or routes that can be called on the ACS Chat gateway.
- **Status Code** - The status code response sent after the request.
- **StatusSubClass** - The status code series sent after the response. 


### Chat API request metric operations

The following operations are available on Chat API request metrics:

TODO: turn this into a table that describes each item, maybe explain how a dev might invoke/consume these, how they can help the developer

Operation – (All routes) - GetChatMessage, ListChatMessages, SendChatMessage, UpdateChatMessage, DeleteChatMessage, GetChatThread, ListChatThreads, UpdateChatThread,  CreateChatThread, DeleteChatThread, GetReadReceipts, SendTypingIndicator, ListChatThreadParticipants, AddChatThreadParticipants and RemoveChatThreadParticipant.

:::image type="content" source="./media/chat-metric.png" alt-text="Chat API Request Metric.":::

If a request is made to an operation that isn't recognized, you'll receive a "Bad Route" value response.

### SMS API requests

The following operations are available on SMS API request metrics:

TODO: turn this into a table that describes each item, maybe explain how a dev might invoke/consume these

Operation – (All routes) - SMSMessageSent, SMSDeliveryReportsReceived, and SMSMessagesReceived

:::image type="content" source="./media/sms-metric.png" alt-text="SMS API Request Metric.":::

## Next Steps

- Learn more about [Data Platform Metrics](https://docs.microsoft.com/azure/azure-monitor/platform/data-platform-metrics)
