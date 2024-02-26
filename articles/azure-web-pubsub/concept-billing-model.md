---
title: Billing model of Azure Web PubSub service
description:  An overview of key concepts about billing model of Azure Web PubSub service.
author: vicancy
ms.author: lianwei
ms.service: azure-web-pubsub
ms.topic: conceptual
ms.date: 07/29/2022
---

# Billing model for Azure Web PubSub service

The billing model for Azure Web PubSub service is based on the number of units allocated and the message count of outbound traffic. This article explains how units and outbound traffic (message count) are defined and counted for billing.

## Terms used in billing

### Connection

A *connection*, also known as a client or a client connection, represents an individual WebSocket connection connected to the Web PubSub service. 

### Unit

A *unit* is an abstract concept of the capability of Web PubSub service. Each unit supports up to 1,000 concurrent connections. Each Web PubSub service instance can have 1, 2, 5, 10, 20, 50 or 100 units. The unit count * 1000 equals the maximum number of connections your Web PubSub service instance can accept. 

In production, it's recommended to plan for no more than 80% unit utilization before scaling up to more units to maintain acceptable system performance. For more information, see [Performance guide for Azure Web PubSub service](concept-performance.md).

### Message count

The *message count* is an abstract concept for billing purposes. It's defined as the size of outbound traffic (bytes) in 2-KB increments, with each increment counting as one message for billing. For example, 100 KB of traffic is counted as 50 messages. 

### Outbound traffic

The *outbound traffic* is the messages sent out of Web PubSub service. 

- The messages broadcasted from service to receivers.
- The messages sent from the service to the upstream webhooks.
- The resource logs with live trace tool. 

### Inbound traffic

The *inbound traffic* is the messages sent to the Azure Web PubSub service. 

- The messages sent from clients to service.
- The messages sent from server or functions to service.

For more information, see [Metrics in Azure Web PubSub service](concept-metrics.md).

##  How units are counted for billing

The units are counted based on the number of units and the usage time in seconds, and billed daily. 

For example, imagine you have one Web PubSub Enterprise tier instance with five units allocated. You've added a custom scale condition to scale up to 10 units from 10:00 AM to 16:00 PM and then scale back to five units after 16:00 PM. Total usage for the day is 5 units for 18 hours and 10 units for 6 hours.

> Total units are used for billing = (5 units * 18 hours + 10 units * 6 hours) / 24 hours = 6.25 Unit/Day

## How outbound traffic is counted for billing

Only the outbound traffic is counted for billing.

For example, imagine you have an application with Web PubSub service and Azure Functions. One user broadcast 4 KB of data to 10 connections in a group. Total data is 4 KB upstream from service to function, and 40 KB from the service broadcast to 10 connections * 4 KB each.

> Outbound traffic for billing = 4 KB (upstream traffic to Azure Functions) + 4 KB * 10 (from service broadcasting to clients) = 44 KB

> Equivalent message count = 44 KB / 2 KB = 22

The  Web PubSub service also offers a daily free quota of outbound traffic (message count) based on the usage of the units. The outbound traffic beyond the free quota is the outbound traffic not included in the base quota. Consider standard tier as example: the free quota is 2,000,000-KB outbound traffic (1,000,000 messages) per unit per day.

For example, an application that uses 6.25 units per day has a daily free quota of 12,500,000-KB outbound traffic or 6.25 million messages. Assuming that the actual daily outbound traffic is 30,000,000 KB (15 million messages), the extra messages above the free quota is 17,500,000-KB outbound traffic, which counts as 8.75 million messages for billing. 

As a result, you'll be billed with 6.25 standard units and 8.75 additional message units for the day. 

## How replica is billed

Replica is a feature of Premium tier of Azure Web PubSub service. When you create a replica in desired regions, you incur Premium fees for each region.

Each replica is billed separately according to its own units and outbound traffic. Free message quota is also calculated separately.

## Pricing 

The Web PubSub service offers multiple tiers with different pricing. For more information about Web PubSub pricing, see [Azure Web PubSub service pricing](https://azure.microsoft.com/pricing/details/web-pubsub).