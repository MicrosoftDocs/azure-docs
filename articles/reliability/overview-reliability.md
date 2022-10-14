---
title: Azure reliability documentation
description: Azure reliability documentation for availability zones, cross-regional disaster recovery, availability of services for sovereign clouds, regions, and category.
author: anaharris-ms
ms.service: azure
ms.topic: conceptual
ms.date: 07/20/2022
ms.author: anaharris
ms.custom: 
---


# What is the Azure reliability documentation?

Azure includes built-in reliability services that you can use and manage based on your business needs. Whether it’s a single hardware node failure, a rack level failure, a datacenter outage, or a large-scale regional outage, Azure provides solutions that improve reliability. For example, availability sets ensure that the virtual machines deployed on Azure are distributed across multiple isolated hardware nodes in a cluster. Availability zones protect customers’ applications and data from datacenter failures across multiple physical locations within a region. **Regions** and **availability zones** are central to your application design and reliability strategy.

The Azure reliability documentation offers reliability guidance for each Azure service. Each service-specific guidance shows you how to prepare your applications and resources to recover from failures and continue to function. Reliability consists of two principles: resiliency and availability. The goal of resiliency is to return your application to a fully functioning state after a failure occurs. The goal of availability is to provide consistent access to your application or workload be users as they need to.

If a service supports availability zones, the guidance article for that service explains:

> [!div class="checklist"]
> * How to create a resource using availability zones
> * Zonal failover support
> * Fault tolerance
> * Zone down scenarios
> * Zone outage preparation and recovery
> * Low-latency design
> * Safe deployment techniques
> * Availability zone redeployment and migration

Each service guide will also provide the following disaster recovery information:

> [!div class="checklist"]
> * Disaster recovery and cross-region failover in single and multi region geography
> * Outage detection, notification, and management
> * Disaster recovery setup and outage detection
> * Capacity and proactive disaster recovery resiliency

For more detailed information on reliability and reliability principles in Microsoft Azure services, see [Microsoft Azure Well-Architected Framework: Reliability](/azure/architecture/framework/#reliability).


## Availability zone support

The availability zone support section contains information related to availability zones for specific Azure services. The section contains the following toics:

> [!div class="checklist"]
> * [Availability zone service and regional support](az-service-support.md)
> * [Cross-region replication](cross-region-replication-azure.md)
> * [Migration guidance](az-migration-overview.md)

## Availability of services

Azure's general policy on deploying services into any given region is primarily driven by region type, service categories, sovereign cloud limitations, and customer demand.

The availability of services section contains information on which services are available per category, sovereign cloud, and region. These are organized in the following articles:

> [!div class="checklist"]
> * [Availability of services by category](availability-service-by-category.md)
> * [Availability of services by sovereign cloud](availability-service-by-sovereign-cloud.md)
> * [Availability of services by region](https://azure.microsoft.com/global-infrastructure/services/)

