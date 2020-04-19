---
title: Migrate JMS applications from ActiveMQ to Azure Service Bus | Microsoft Docs
description: This article explains how to migrate existing JMS applications that interact with Active MQ to interact with Azure Service Bus.
services: service-bus-messaging
documentationcenter: ''
author: axisc
manager: timlt
editor: spelluru

ms.service: service-bus-messaging
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/24/2020
ms.author: aschhab

---

# Migrate existing Java Message Service(JMS) 2.0 applications from Active MQ to Azure Service Bus

This guide describes what you should be aware of when you want to modify an existing Java Message Service (JMS) 2.0 application that interacts with a JMS Broker (specifically Apache ActiveMQ or Amazon MQ) to interact with Azure Service Bus.

## Before you start

### Differences between Azure Service Bus and Apache ActiveMQ

Azure Service Bus and Apache ActiveMQ are both message brokers that are functioning as JMS providers for client applications to send messages to and receive messages from. They both enable the point-to-point semantics with **Queues** and publish-subscribe semantics with **Topics** and **Subscriptions**. 

Even so, there are some differences in the two.

| Category | Active MQ | Azure Service Bus |
| --- | --- | --- |
| Application tiering | Monolith | Two-tier <br> (Gateway + Backend) |
| Protocol support | <ul> <li>AMQP</li> <li> STOMP </li> <li> OpenWire </li> </ul> | AMQP |
| Provisioning mode | <ul> <li> IaaS (on-premises) </li> <li> Amazon MQ (managed PaaS) </li> | Managed PaaS |
| Message size | Customer configurable | 1 MB (Premium tier) |
| High Availability | Customer managed | Platform managed |
| Disaster Recovery | Customer managed | Platform managed | 

TODO - more to add.

### Current supported and unsupported features

TODO - create a table separately and link here

| Features | Status |
|---|---|
| Queues   | Supported |
| Topics   | Supported |
| Temporary Queues | Supported |
| Temporary Topics | Supported |
| Message Selectors | Supported |
| Queue Browsers | Supported |
| Shared Durable Subscriptions | Supported|
| Unshared Durable Subscriptions | Supported |
| Shared Non-durable Subscriptions | Supported |
| Unshared Non-durable Subscriptions | Supported |
| Distributed Transactions | Not supported|
| Durable Terminus | Not supported|

### Caveats

TODO - separate into it's own document that can be plugged in.

The two-tiered nature of Azure Service Bus affords various business continuity capabilities (high availability and disaster recovery). However, there are some considerations when utilizing JMS features.

#### Service restarts

In the event of Service restarts or timeouts, temporary Queues or Topics will be deleted.

If the application is sensitive to data loss on temporary Queues or Topics, it is recommended to **not** use Temporary Queues or Topics and use durable Queues, Topics and Subscriptions instead.

#### Data migration

As part of migrating/modifying your client applications to interact with Azure Service Bus, the data held in ActiveMQ will not be migrated to Service Bus.

A custom application may be needed to drain the ActiveMQ queues, topics and subscriptions and replay the messages to Service Bus' queues, topics and subscriptions.

## Pre-migration

### Version check

### Ensure that AMQP ports are open

### Set up enterprise configurations (VNET, Firewall, private endpoint, etc.)

## Migration

To migrate your existing JMS 2.0 application to interact with Azure Service Bus, the below steps need to be performed.

### Export topology from ActiveMQ and create the entities in Azure Service Bus (optional)

### Import the maven dependency for Service Bus JMS implementation

### Update the application properties

### Replace the ActiveMQConnectionFactory with ServiceBusJmsConnectionFactory

## Post-migration

Now that you have modified the application to starting sending and receiving messages from Azure Service Bus, you should verify that it works as you expect. Once that is done, you can proceed to further refine and modernize your application stack.
