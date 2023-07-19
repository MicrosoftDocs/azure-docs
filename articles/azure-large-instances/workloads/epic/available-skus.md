---
title: Available Azure Large Instances SKUs
description: Provides a list of Azure Large Instances for Epic SKUs.
titleSuffix: Azure Large Instances for Epic
ms.title: Available Azure Large Instances SKUs
ms.topic: conceptual
ms.custom: references_regions
author: jjaygbay1
ms.author: jacobjaygbay
ms.service: azure-large-instances
ms.date: 06/01/2023
---

# Azure Large Instances for Epic workload SKUs     

This article provides a list of available Azure Large Instances for Epic<sup>®</sup> workload SKUs.
## Azure Large Instances availability by region

* West Europe
* North Europe
* Germany West Central with Zones support
* East US with Zones support
* East US 2
* South Central US
* West US 2 with Zones support

Azure Large Instances for Epic<sup>®</sup> workload has limited availability and is currently available in the following regions:

* East US with Zones support
* South Central US
* West US 2 with Zones support

> [!Note]
> Zones support refers to availability zones within a region where Azure Large Instances can be deployed across zones for high resiliency and availability. This capability enables support for multi-site active-active scaling.

## Azure Large Instances for Epic availability

| Name            | Type              | Availability     |
|------------------- |-------------------|---------------|
|4S Compute v1 | S224SE - 4 x  Intel® Xeon® Platinum 8380HL processor  112 CPU cores |Available |
|8S Compute v1 | S448SE - 8 x Intel® Xeon® Platinum 8276L processor 224 CPU cores  |Available |
|100TB v1      | N100 | Available|
|10TB v1|N10 |Available|

## Tenant considerations

A complete Azure Large Instances for Epic stamp isn't exclusively allocated for a single customer's use.
This applies to the racks of compute and storage resources connected through a network fabric deployed in Azure as well.
Azure Large Instances, like Azure, deploys different customer "tenants" that are isolated from one another in the following three levels.

### Network

Isolation through virtual networks within the Azure Large Instances stamp for Epic.

### Storage

Isolation through storage virtual machines that have storage volumes assigned and isolate storage volumes between tenants.

### Compute 

Dedicated assignment of server units to a single tenant.
No hard or soft partitioning of server units.
No sharing of a single server or host unit between tenants.

The deployments of Azure Large Instances units for Epic between different tenants aren't visible to each other.
Azure Large Instances units for Epic deployed in different tenants can't communicate directly with each other on the Azure Large Instances for Epic stamp level. Only Azure Large Instances units for Epic within one tenant can communicate with each other on the Azure Large Instances for Epic stamp level.

A deployed tenant in the Azure Large Instances stamp is assigned to one Azure subscription for billing purposes. For a network, it can be accessed from virtual networks of other Azure subscriptions within the same Azure enrollment.
If you deploy with another Azure subscription in the same Azure region, you also request for a separated Azure Large Instances tenant.




