---
title: Billing model of Azure Web PubSub service
description:  An overview of key concepts about billing model of Azure Web PubSub service.
author: yjin81
ms.author: yajin1
ms.service: azure-web-pubsub
ms.topic: conceptual
ms.date: 03/29/2021
---

# Billing model of Azure Web PubSub service

The billing model for Azure Web PubSub service is based on the number of units and the size of outbound traffic (message count). This article explains how units and outbound traffic (message count) are defined and counted for billing.

## How units are counted with billing model

### What is the connection

The connection is between client and service. You could monitor the connection count in Azure portal. The view of "Connection (Max)" shows the maximum number of connections in a specific period. 

### What is the unit

The unit is an abstract concept of the capability of Azure Web PubSub service. Each unit supports 1,000 concurrent connections at most. Each Azure Web PubSub service instance could be 1, 2, 5, 10, 20, 50 or 100 units. So the unit count specifies how many connections your Web PubSub service instance can accept.

###  How units are counted with billing model

The units are counted based on the number of units and the usage time (seconds) of the units, and billed daily. 

For example, imagine you have one Azure Web PubSub service instance with 5 units, scale up to 10 units from 10:00 AM to 16:00 PM and then scale back to 5 units after 16:00 PM. It turns out 5 units for 18 hours and 10 units for 6 hours in a specific day.

> Usage of the units for billing = (5 units * 18 hours + 10 units * 6 hours) / 24 hours = 6.25 Unit/Day

## How outbound traffic is counted with billing model

### What is inbound/outbound traffic 

The outbound traffic is the messages sent out of Azure Web PubSub service. You could monitor the outbound traffic by Azure portal. The view of "Outbound Traffic (total)" shows the aggregated outbound messages size (bytes) in a specific period.

- The messages broadcasted from service to receivers.
- The messages sent from the service to the upstream webhooks.
- The diagnostic logs with [live trace tool](./howto-troubleshoot-diagnostic-logs.md#capture-diagnostic-logs-with-azure-web-pubsub-service-live-trace-tool). 

The inbound traffic is the messages sent to the Azure Web PubSub service. 

- The messages sent from clients to service.
- The messages sent from server or functions to service.

### What is message count

The message count for billing purpose is an abstract concept and defined as the size of outbound traffic (bytes) divided in 2 KB. For example, 100-KB traffic is counted as 50 messages.  

### How traffic is counted with billing model

For billing, only the outbound traffic is counted. 

For example, imagine you have an application with Azure Web PubSub service and Azure Functions. One user broadcast 4 KB data to 10 connections in a group. It turns out 4 KB for upstream from service to function and 40 KB from service broadcast to 10 connections.

> Outbound traffic for billing = 4 KB (upstream traffic) + 4 KB * 10 (service broadcasting to clients traffic) = 44 KB

> Equivalent message count = 44 KB / 2 KB = 22

The Azure Web PubSub service also offers daily free quota of outbound traffic (message count) based on the usage of the units. The outbound traffic (message count) beyond the free quota is the additional outbound traffic (additional messages). Taking standard tier as example, the free quota is 2,000,000-KB outbound traffic (1,000,000 messages) per unit/day.

Using the previous unit usage example, the application use 6.25 units per day that ensures the daily free quota as 12,500,000-KB outbound traffic (6.25 million messages). Imaging the daily outbound traffic is 30,000,000 KB (15 million messages), the additional messages will be 17,500,000-KB outbound traffic (8.75 million messages). As a result, you'll be billed with 6.25 standard units and 8.75 additional message units for the day.

## Pricing 

The Azure Web PubSub service offers multiple tiers with different pricing. Once you understand how the number of units and size of outbound traffic (message count) are counted with billing model, you could learn more pricing details from [Azure Web PubSub service pricing](https://azure.microsoft.com/pricing/details/web-pubsub).





