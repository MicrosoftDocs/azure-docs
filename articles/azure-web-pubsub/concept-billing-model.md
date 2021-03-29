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

There is only client connection with Azure Web PubSub service right now, and you could monitor the connection count by Azure portal. The view of "Connection (Max)" shows the maximum number of connections aggregated in a specific period. 

### What is the unit

The unit is an abstract concept of the capability of Azure Web PubSub service. Each unit supports 1,000 concurrent connections at most. Each Azure Web PubSub service instance could be 1, 2, 5, 10, 20, 50 or 100 units. So the unit count specifies how many connections your Web PubSub service instance can accept.

###  How units are counted 

The units are counted based on the number of units and the usage time (seconds) of the units, and billed daily. 

For example, imagine you have one Azure Web PubSub service instance with 5 units and scale up to 10 units from 11:00 AM to 13:00 PM today. The usage of the units for billing will be sum of 5 units usage (5 units * 22 hours) and 10 units usage (10 units * 2 hours) today. 

## How outbound traffic is counted with billing model

### What is inbound/outbound traffic 

The outbound traffic is the messages sent out of Azure Web PubSub service. You could monitor the outbound traffic by Azure portal. The view of "Outbound Traffic (total)" shows the aggregated outbound messages size (bytes) in a specific period.

* The messages broadcasted from service to receivers.
* The upstream messages from service to server or functions.
* The diagnostic logs with live trace from service to clients. 

The inbound traffic is the messages sent to the Azure Web PubSub service. 

* The messages sent from clients to service.
* The messages sent from server or functions to service.

### What is message count

The message count for billing purpose is an abstract concept and defined as traffic (bytes) divide 2 KB. 

### How traffic is counted

For billing, only the outbound traffic is counted as bytes. 

For example, imagine you have an application with Azure Web PubSub service and Azure Functions. One user broadcast 1 message (3 KB) to 10 users in a group. The outbound traffic for billing will be sum of 3 KB for upstream from service to function and 30 KB from service broadcast to 10 users. The corresponding message count will be 33-KB outbound traffic divide 2 KB.  




