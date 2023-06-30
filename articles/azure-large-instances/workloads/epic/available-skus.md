---
title: Available SKUs
description: Provides a list of ALI for Epic SKUs.
ms.topic: conceptual
author: jjaygbay1
ms.author: jacobjaygbay
ms.service: baremetal-infrastructure
ms.date: 06/01/2023
---

# Available SKUs

## Azure Large Instances availability by region

* West Europe
* North Europe
* Germany West Central with Zones support
* East US with Zones support
* East US 2
* South Central US
* West US 2 with Zones support

Azure Large Instances (ALI) for Epic has limited availability currently in the following regions:

* East US with Zones support
* South Central US
* West US 2 with Zones support

> [!Note]
> Zones support refers to availability zones within a region where Azure Large Instances can be deployed across zones for high resiliency and availability. This capability enables support for multi-site active-active scaling.

## Azure Large Instances for Epic availability

| Name            | Type              | Availability     |
|------------------- |-------------------|---------------|
|4S Compute v1 | S224SE - 4 x  Intel® Xeon® Platinum 8380HL processor  112 CPU cores |Available |
|8S Compute v1 | S448SE |Available |
|100TB v1      | <Engineering SKU name used for 100 TB Storage SKU>|Available|
|10TB v1|<Engineering SKU name used for 10 TB Storage SKU>|Available|

## Tenant considerations

A complete ALI for Epic stamp isn't exclusively allocated for a single customer's use.
This applies to the racks of compute and storage resources connected through a network fabric deployed in Azure as well.
ALI, like Azure, deploys different customer "tenants" that are isolated from one another in the following three levels.

### Network

Isolation through virtual networks within the ALI stamp for Epic.

### Storage

Isolation through storage virtual machines that have storage volumes assigned and isolate storage volumes between tenants.

### Compute 

Dedicated assignment of server units to a single tenant.
No hard or soft partitioning of server units.
No sharing of a single server or host unit between tenants.

The deployments of ALI units for Epic between different tenants aren't visible to each other.
ALI units for Epic deployed in different tenants can't communicate directly with each other on the ALI for Epic stamp level. Only ALI units for Epic within one tenant can communicate with each other on the ALI for Epic stamp level.

A deployed tenant in the ALI stamp is assigned to one Azure subscription for billing purposes. For a network, it can be accessed from virtual networks of other Azure subscriptions within the same Azure enrollment.
If you deploy with another Azure subscription in the same Azure region, you also can choose to ask for a separated ALI tenant.


## Next steps

Learn how to identify and interact with ALI instances through the Azure portal.

> [!div class="nextstepaction"]
> [What is Azure for Large Instances?](../../what-is-azure-large-instances.md)

A