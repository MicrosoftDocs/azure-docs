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

The connection is between client and service. You could monitor the connection count in Azure portal. The view of "Connection (Max)" shows the maximum number of connections aggregated in a specific period. 

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
- The upstream messages from service to server or functions.
- The diagnostic logs with live trace from service to clients. 

The inbound traffic is the messages sent to the Azure Web PubSub service. 

- The messages sent from clients to service.
- The messages sent from server or functions to service.

### What is message count

The message count for billing purpose is an abstract concept and defined as the size of outbound traffic (bytes) divided in 2 KB. 

### How traffic is counted with billing model

For billing, only the outbound traffic is counted. 

For example, imagine you have an application with Azure Web PubSub service and Azure Functions. One user broadcast 1 message (4 KB) to 10 users in a group. It turns out 4 KB for upstream from service to function and 40 KB from service broadcast to 10 users.

> Outbound traffic for billing = 4 KB + 40 KB = 44 KB

> Equivalent message count = 44 KB / 2 KB = 22

The Azure Web PubSub service also offers daily free quota of outbound traffic (message count) based on the usage of the units. The outbound traffic (message count) beyond the free quota is the additional outbound traffic (message count).

For example, imagine you have one standard tier Azure Web PubSub service instance with 5 units, scale up to 10 units from 10:00 AM to 16:00 PM and then scale back to 5 units after 16:00 PM. It turns out 5 units for 18 hours and 10 units for 6 hours in a specific day. The total outbound traffic is 30,000,000 KB. 

> Usage of the units for billing = (5 units * 18 hours + 10 units * 6 hours) / 24 hours = 6.25 Unit/Day

> Free quota of outbound traffic = Usage of the units for billing * 1 million * 2 KB = 6.25 * 1,000,000 * 2 KB = 12,500,000 KB

> Equivalent free quota of message count = Usage of the units for billing * 1 million = 6.25 million

> Additional outbound traffic = 30,000,000 KB - free quota of outbound traffic = 30,000,000 KB - 12,500,000 KB = 17,500,000 KB

> Equivalent additional message count = (30,000,000 KB / 2 KB) - 6.25 million = 8.25 million




