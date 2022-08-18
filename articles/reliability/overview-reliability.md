---
title: Azure service reliability documentation
description: Azure service reliability documentation for availability zones, cross-regional disaster recovery, availability of services for sovereign clouds, regions, and category.
author: anaharris-ms
ms.service: azure
ms.topic: conceptual
ms.date: 07/20/2022
ms.author: anaharris
ms.custom: 
---


# What is the Azure service reliability documentation?

The Azure service reliability documentation is organized into three sections:

* Reliability guides
* Availability zone guides
* Service availability 

# Reliability guides

Azure service reliability guides help you to learn how to prepare your applications and resources to recover from failures and continue to function. Reliability consists of two principles: resiliency and availability. The goal of resiliency is to return your application to a fully functioning state after a failure occurs. The goal of availability is to provide consistent access to your application or workload be users as they need to.

If a service supports Availability Zones, the guidance article for that service explains:

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


For more detailed information on reliability and reliability principles in Microsoft Azure services, see [Microsoft Azure Well-Architected Framework: Reliability](https://docs.microsoft.com/azure/architecture/framework/#reliability).


## Availability zone guides

The Availability zone guides section contains information related to Availability Zones for specific Azure services. Here, you will find information on which services support Availability Zones, how to migrate a service resource to availability zone support, or how to create a service resource for availability zone support.

## Availability of services

Availability of services across Azure regions depends on a region's type. Azure's general policy on deploying services into any given region is primarily driven by region type, service categories, sovereign cloud limitations, and customer demand.

The availability of services section contains information on which services are available per category, sovereign cloud, and region. These are organized in the following articles:


## Next steps

To learn which services support availability zones:

> [!div class="nextstepaction"]
> [Availability zones by region](availability-zone-services.md)

To see the availability of services:

> [!div class="nextstepaction"]
> [Availability of services by category](availability-service-by-category.md)
> [!div class="nextstepaction"]
> [Availability of services by sovereign cloud](availability-service-by-sovereign-cloud.md)
> [!div class="nextstepaction"]
>  [Availability of services by region](https://azure.microsoft.com/global-infrastructure/services/)

