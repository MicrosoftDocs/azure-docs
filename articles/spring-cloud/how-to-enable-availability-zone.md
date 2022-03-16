---
title: Create Azure Spring Cloud with availability zone enabled
titleSuffix: Azure Spring Cloud
description: How to create an azure spring cloud instance with availability zone enabled.
author: karlerickson
ms.author: wenhaozhang
ms.service: spring-cloud
ms.topic: how-to
ms.date: 03/14/2022
ms.custom: devx-track-java
---
# Create Azure Spring Cloud with availability zone enabled

In Azure, [Availability Zones (AZ)](../availability-zones/az-overview.md) are unique physical locations within an Azure region. Each zone is made up of one or more datacenters equipped with independent power, cooling, and networking, which could protects your applications and data from datacenter failures.

When an azure spring cloud service instance is configured as availability zone enabled, the platform would automatically spread the applications deployment instance across all three zones in the selected region. If the applications deployment's instance count is larger than three and is divisible by three, the instances will be spread evenly. Otherwise, instance counts beyond 3*N will get spread across the remaining one or two zones.

## Region availability

Azure Spring Cloud currently can be created with availability zone enabled in the following regions:
- Central US
- West US 2
- East US
- Australia East
- North Europe
- East US 2
- West Europe
- South Central US
- UK South
- Brazil South
- France Central

## Limitions

- Availability zone is not supported in basic tier.
- You can only enable availability zone at azure spring cloud creating time. You can't update an existing availability zone disabled azure spring cloud service instance into an availability zone enabled one and vice versa.


## Pricing

There's no additional cost associated with enabling the availability zone.