---
title: Reliability and availability in Azure Deployment Environments
description: Learn how Azure Deployment Environments supports reliability. Understand availability zone support within a single region and cross-region disaster recovery.
ms.service: azure-deployment-environments
ms.topic: reliability-article
ms.author: rosemalcolm
author: RoseHJM
ms.date: 03/07/2025
ms.custom: subject-reliability, references_regions
---

# Reliability in Azure Deployment Environments 

This article describes reliability support in Azure Deployment Environments. It covers intra-regional resiliency with availability zones and inter-region resiliency with disaster recovery. For a more detailed overview of reliability in Azure, see [Azure reliability](/azure/well-architected/resiliency/overview).

## Availability zone support 

[!INCLUDE [Availability zone description](../reliability/includes/reliability-availability-zone-description-include.md)]

Availability zone support for all resources in Azure Deployment Environments is enabled automatically. There's no action for you to take. 

The following regions support both Deployment Environments and availability zones:
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

## Cross-region disaster recovery and business continuity

[!INCLUDE [introduction to disaster recovery](../reliability/includes/reliability-disaster-recovery-description-include.md)]

You can replicate the following Deployment Environments resources in an alternate region to prevent data loss if a cross-region failover occurs:
 
- Dev centers
- Projects
- Catalogs
- Catalog items
- Dev center environment types
- Project environment types
- Environments

For more information, see [Azure to Azure disaster recovery architecture](../site-recovery/azure-to-azure-architecture.md). 

## Next steps 

- To learn more about how Azure supports reliability, see [Azure reliability](/azure/reliability). 
- To learn more about Deployment Environments resources, see [Azure Deployment Environments key concepts](../deployment-environments/concept-environments-key-concepts.md).
- To get started with Deployment Environments, see [Quickstart: Configure Azure Deployment Environments](../deployment-environments/quickstart-create-and-configure-devcenter.md).
