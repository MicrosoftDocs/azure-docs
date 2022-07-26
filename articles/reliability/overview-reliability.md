---
title: Azure service reliability guide
description: Azure service reliability guide that documents the reliability offerings in Azure services.
author: anaharris-ms
ms.service: azure
ms.topic: conceptual
ms.date: 07/20/2022
ms.author: anaharris
ms.reviewer: cynthn
ms.custom: 
---


# What is the Azure service reliability guide?

The Azure service reliability guide is a collection of guidance articles for each service that has a reliability offering. 

Reliability is a system’s ability to ensure its availability and to easily recover from failures such as data loss, major downtime, or ransomware incidents. In that sense, reliability can be comprehended as in two ways: reliability in terms of *availability* and reliability in terms of *resiliency*.

For more detailed information on reliability principles in Microsoft Azure services, see [Microsoft Azure Well-Architected Framework: Reliability](https://docs.microsoft.com/azure/architecture/framework/#reliability).

If the service support Availability Zones, the guidance article for that service will explain:

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

This guide also contains information on service availability. These are organized in the following articles:

* [Availability of services by category](availability-service-by-category.md)
* [Availability of services by sovereign cloud](availability-service-by-sovereign-cloud.md)
* [Availability of services by region](https://azure.microsoft.com/global-infrastructure/services/)


## Next steps

- [Azure Well-Architected Framework](https://www.aka.ms/WellArchitected/Framework)
- [Azure architecture guidance](/azure/architecture/high-availability/building-solutions-for-high-availability)
