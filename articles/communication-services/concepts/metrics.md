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

Azure Communication services currently provide metrics for chat and SMS. Follow Azure's Getting started with Azure Metrics Explorer to learn how to start plotting your own charts, investigate abnormalities in your metric values and understand your API traffic for Chat and SMS.
https://docs.microsoft.com/azure/azure-monitor/platform/metrics-getting-started

## Where to find Metrics

Chat and SMS services in Azure Communication Services emit metrics for API requests. These metrics can be found in the Metrics blade under your ACS resource. You can also create permanent dashboards using the workbooks blade under your ACS resource.

## Metric definitions
Chat API Requests - Count of all API requests to ACS chat gateway endpoint.

SMS API Requests - Count of all API requests to ACS SMS gateway endpoint.

### ChatAPIRequests

The Chat API request metric contains three dimension to filter on. The dimensions can be aggregated together using count and supports all standard Azure Aggregation time series.

Operation - All operations or routes that can be called on the ACS Chat gateway.
Status Code - The status code response sent after the request.
StatusSubClass - The status code series sent after the response. 

The list below are the possible operations or route values that can be returned by the Chat API request metric. If a request is made to a route that is not recognized, you will receive a "Bad Route" value for Operation.

Operation – (All routes) - GetChatMessage, ListChatMessages, SendChatMessage, UpdateChatMessage, DeleteChatMessage, GetChatThread, ListChatThreads, UpdateChatThread,  CreateChatThread, DeleteChatThread, GetReadReceipts, SendTypingIndicator, ListChatThreadParticipants, AddChatThreadParticipants and RemoveChatThreadParticipant.

:::image type="content" source="./media/chat-metric.png" alt-text="Chat API Request Metric.":::

### SMSAPIRequests

The SMS API request metric contains three dimension to filter on. The dimensions can be aggregated together using count and supports all standard Azure Aggregation time series.

Operation - All operations or routes that can be called on the ACS SMS gateway.
Status Code - The status code response sent after the request.
StatusSubClass - The status code series sent after the response. 

The list below are the possible operations or route values that can be returned by the SMS API request metric. If a request is made to a route that is not recognized, you will receive a "Bad Route" value for Operation.

Operation – (All routes) - SMSMessageSent, SMSDeliveryReportsReceived, and SMSMessagesReceived

:::image type="content" source="./media/sms-metric.png" alt-text="SMS API Request Metric.":::

## References

https://docs.microsoft.com/azure/azure-monitor/platform/data-platform-metrics 
