---
title: Reliability and availability in Azure Deployment Environments
description: Learn how Azure Deployment Environments supports disaster recovery. Understand reliability and availability within a single region and across regions.
ms.service: deployment-environments
ms.topic: conceptual
ms.author: rosemalcolm
author: RoseHJM
ms.date: 08/25/2023
ms.custom: subject-reliability, references_regions
---

# Reliability in Azure Deployment Environments 

This article describes reliability support in Azure Deployment Environments, and covers intra-regional resiliency with availability zones and inter region resiliency with disaster recovery. For a more detailed overview of reliability in Azure, see [Azure reliability](/azure/well-architected/resiliency/overview).

## Availability zone support 

[!INCLUDE [Availability zone description](../reliability/includes/reliability-availability-zone-description-include.md)]


Availability zone support for all resources in Azure Deployment Environments is enabled automatically. There's no action for you to take. 

Regions supported: 
- West US 2
- South Central US
- UK South
- West Europe
- East US
- Australia East
- East US 2
- North Europe
- West US 3
- Japan East
- East Asia
- Central India
- Korea Central
- Canada Central

For more detailed information on availability zones in Azure, see [Regions and availability zones](../reliability/availability-zones-overview.md). 

## Cross-region disaster recovery and business continuity

[!INCLUDE [introduction to disaster recovery](../reliability/includes/reliability-disaster-recovery-description-include.md)]

You can replicate the following Deployment Environments resources in an alternate region to prevent data loss if a cross-region failover occurs:
 
- Dev center
- Project
- Catalog
- Catalog items
- Dev center environment type
- Project environment type
- Environments



For more information on Azure disaster recovery architecture, see [Azure to Azure disaster recovery architecture](../site-recovery/azure-to-azure-architecture.md). 

## Next steps 

- To learn more about how Azure supports reliability, see [Azure reliability](/azure/reliability). 
- To learn more about Deployment Environments resources, see [Azure Deployment Environments key concepts](../deployment-environments/concept-environments-key-concepts.md).
- To get started with Deployment Environments, see [Quickstart: Create and configure the Azure Deployment Environments dev center](../deployment-environments/quickstart-create-and-configure-devcenter.md).
