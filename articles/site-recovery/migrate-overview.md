---
title: Compare Azure Migrate and Site Recovery for migration to Azure
description: Summarizes the advantages of using Azure Migrate for migration instead of Site Recovery.
services: site-recovery
ms.service: site-recovery
ms.topic: conceptual
ms.date: 10/31/2023
ms.author: ankitadutta
author: ankitaduttaMSFT
ms.custom: engagement-fy23
---

# Migrating to Azure

For migration, we recommend that you use the Azure Migrate service to migrate your VMs and servers to Azure, instead of using Azure Site Recovery service. Learn about [Azure Migrate](../migrate/migrate-services-overview.md).

## Why use Azure Migrate?

Using Azure Migrate for migration provides many advantages:
 
- Azure Migrate provides a centralized hub for discovery, assessment, and migration to Azure.
- Using Azure Migrate provides interoperability and future extensibility with Azure Migrate tools, other Azure services, and third-party tools.
- The Migration and modernization tool is purpose-built for server migration to Azure. It's optimized for migration. You don't need to learn about concepts and scenarios that aren't directly relevant to migration. 
- Azure Migrate can be used to identify modernization opportunities and migration previews.
- Some key features like OS upgrade are only available with Azure Migrate
- There are no tool usage charges for migration for 180 days, from the time replication is started for a VM. This gives you time to complete migration. You only pay for the storage and network resources used in replication, and for compute charges consumed during test migrations.
- Azure Migrate supports all migration scenarios supported by Site Recovery. In addition, for VMware VMs, Azure Migrate provides an agentless migration option.
- We're prioritizing new migration features for the Migration and modernization tool only. These features aren't targeted for Site Recovery.

## When to use Site Recovery?

Site Recovery should be used:

- For disaster recovery of on-premises machines to Azure.
- For disaster recovery of Azure VMs, between Azure regions.

## Which service to use for migration?
 
We recommend using Azure Migrate to migrate on-premises servers to Azure.  However, if you've already started your migration journey with Site Recovery, consider the following details:

- If you're already using Azure Site Recovery to replicate your servers, you don't need to deploy a Migrate appliance. Remove the BCDR protection, and replicate with a new appliance.
- However, there are benefits to conducting assessment, dependency analysis, and business case review with the Azure Migrate discovery appliance even for workloads that are already replicating.
- There could be architecture changes required to support the workload in the long term. In this case, address the requirements while continuing to use Azure Site Recovery to replicate so that you don't lose protections.


## Conclusion

Suggestions to choose between Azure Migrate and Site Recovery:

- **For new migration**: If you're beginning a new migration and don't have either Azure Site Recovery or Migrate in place, we recommend that you use Azure Migrate.
- **For disaster recovery of on-premises machines to Azure**: For disaster recovery of on-premises machines to Azure, we recommend that you use Azure Site Recovery. You can also use this service to migrate machines to Azure once it has been determined that they should be moved off-premise. 
- **For disaster recovery of Azure VMs between Azure region**: For disaster recovery of Azure VMs between Azure regions, we recommend that you use Azure Site Recovery. Although you can use Azure Migrate to initially move them into Azure.
- **If you're already using Azure Site Recovery**: If you're currently using Azure Site Recovery to actively protect your machines, continue to use it for replication. However, consider using Azure Migrate for conducting business cases and dependency analysis.

## Next steps

> [Review common questions](../migrate/resources-faq.md) about Azure Migrate.
