---
title: Introduction to availability and disaster recovery | Microsoft Docs
description: Describes how Azure Event Grid supports resiliency and disaster recovery.
ms.topic: conceptual
ms.date: 06/22/2022
---

# Introduction to availability and disaster recovery

## Availability zone resiliency

Azure availability zones are designed to help you achieve resiliency and reliability for your business-critical workloads. Azure maintains multiple geographies. These discrete demarcations define disaster recovery and data residency boundaries across one or multiple Azure regions. Maintaining many regions ensures customers are supported across the world. See [Resiliency in Azure Event Grid](availability-zone-resiliency.md) for more details.

## Disaster recovery

Event Grid supports automatic geo-disaster recovery of event subscription configuration data (metadata) for topics, system topics, domains, and partner topics. Event Grid automatically syncs your event-related infrastructure to a paired region. If an entire Azure region goes down, the events will begin to flow to the geo-paired region with no intervention from you. See [Server-side geo disaster recovery in Azure Event Grid](geo-disaster-recovery.md) for more details.

If you have decided not to replicate any data to a paired region, you'll need to invest in some practices to build your own disaster recovery scenario and recover from a severe loss of application functionality. See [Build your own disaster recovery plan for Azure Event Grid topics and domains](custom-disaster-recovery.md) for more details. See [Build your own client-side disaster recovery for Azure Event Grid topics](custom-disaster-recovery-client-side.md) in case you want to implement client-side disaster recovery for Azure Event Grid topics.

## More information

You may find more information availability zone resiliency and disaster recovery in Azure Event Grid in our [FAQ](event-grid-faq.md).