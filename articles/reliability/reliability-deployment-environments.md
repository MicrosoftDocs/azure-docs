---
title: Reliability and availability in Azure Deployment Environments
description: Learn how Azure Deployment Environments supports reliability. Understand availability zone support within a single region and cross-region disaster recovery.
ms.service: azure-deployment-environments
ms.topic: reliability-article
ms.author: rosemalcolm
author: RoseHJM
ms.date: 03/07/2025
ms.custom: subject-reliability, references_regions

#customer intent: As a platform engineer, I want to get information about reliability in Azure Deployment Environments so that I can improve the reliability of my workloads.
---

# Reliability in Azure Deployment Environments 

This article describes reliability support in Azure Deployment Environments. It covers intra-regional resiliency with availability zones and inter-region resiliency with disaster recovery. For a more detailed overview of reliability in Azure, see [Azure reliability](/azure/well-architected/resiliency/overview).

## Availability zone support 

[!INCLUDE [Availability zone description](../reliability/includes/reliability-availability-zone-description-include.md)]

Availability zone support for all resources in Azure Deployment Environments is enabled automatically. There's no action for you to take. 

The following regions support both Deployment Environments and availability zones:
- Australia East
- Brazil South
- Canada Central
- Central India
- Central US
- East Asia
- East US
- East US 2
- Germany West Central
- Italy North
- Japan East
- Korea Central
- North Europe
- South Africa North
- South Central US
- Southeast Asia
- Sweden Central
- Switzerland North
- UK South
- West Europe
- West US 2
- West US 3

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

## Related content

- To learn more about how Azure supports reliability, see [Azure reliability](/azure/reliability). 
- To learn more about Deployment Environments resources, see [Azure Deployment Environments key concepts](../deployment-environments/concept-environments-key-concepts.md).
- To get started with Deployment Environments, see [Quickstart: Configure Azure Deployment Environments](../deployment-environments/quickstart-create-and-configure-devcenter.md).
