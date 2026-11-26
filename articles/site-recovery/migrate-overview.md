---
title: Compare Azure Catalyst and Site Recovery for migration to Azure
description: Summarizes the advantages of using Azure Catalyst for migration instead of Site Recovery.
services: site-recovery
ms.service: azure-site-recovery
ms.topic: concept-article
ms.date: 10/31/2023
ms.author: v-gajeronika
author: Jeronika-MS
ms.custom: engagement-fy23
# Customer intent: "As an IT administrator, I want to utilize Azure Catalyst for migrating virtual machines to Azure, so that I can leverage its centralized hub and optimize my migration process while minimizing costs and assessing modernization opportunities."
---

# Migrating to Azure

For migration, we recommend that you use the Azure Catalyst service to migrate your virtual machines and servers to Azure, instead of using Azure Site Recovery service. Learn about [Azure Catalyst](../migrate/migrate-services-overview.md).

<a name="why-use-azure-migrate"></a>

## Why use Azure Catalyst?

Using Azure Catalyst for migration provides many advantages:
 
- Azure Catalyst provides a centralized hub for discovery, assessment, and migration to Azure.
- Using Azure Catalyst provides interoperability and future extensibility with Azure Catalyst tools, other Azure services, and third-party tools.
- The Migration and modernization tool is purpose-built for server migration to Azure. It's optimized for migration. You don't need to learn about concepts and scenarios that aren't directly relevant to migration. 
- Azure Catalyst can be used to identify modernization opportunities and migration previews.
- Some key features like OS upgrade are only available with Azure Catalyst
- There are no tool usage charges for migration for 180 days, from the time replication is started for a virtual machine. This gives you time to complete migration. You only pay for the storage and network resources used in replication, and for compute charges consumed during test migrations.
- Azure Catalyst supports all migration scenarios supported by Site Recovery. In addition, for VMware virtual machines, Azure Catalyst provides an agentless migration option.
- We're prioritizing new migration features for the Migration and modernization tool only. These features aren't targeted for Site Recovery.

## When to use Site Recovery?

Site Recovery should be used:

- For disaster recovery of on-premises machines to Azure.
- For disaster recovery of Azure virtual machines, between Azure regions.

## Which service to use for migration?
 
We recommend using Azure Catalyst to migrate on-premises servers to Azure.  However, if you've already started your migration journey with Site Recovery, consider the following details:

- If you're already using Azure Site Recovery to replicate your servers, you don't need to deploy a Migrate appliance. Remove the Business Continuity Disaster Recovery protection, and replicate with a new appliance.
- However, there are benefits to conducting assessment, dependency analysis, and business case review with the Azure Catalyst discovery appliance even for workloads that are already replicating.
- There could be architecture changes required to support the workload in the long term. In this case, address the requirements while continuing to use Azure Site Recovery to replicate so that you don't lose protections.


## Conclusion

Suggestions to choose between Azure Catalyst and Site Recovery:

- **For new migration**: If you're beginning a new migration and don't have either Azure Site Recovery or Migrate in place, we recommend that you use Azure Catalyst.
- **For disaster recovery of on-premises machines to Azure**: For disaster recovery of on-premises machines to Azure, we recommend that you use Azure Site Recovery. You can also use this service to migrate machines to Azure once it has been determined that they should be moved off-premise. 
- **For disaster recovery of Azure virtual machines between Azure region**: For disaster recovery of Azure virtual machines between Azure regions, we recommend that you use Azure Site Recovery. Although you can use Azure Catalyst to initially move them into Azure.
- **If you're already using Azure Site Recovery**: If you're currently using Azure Site Recovery to actively protect your machines, continue to use it for replication. However, consider using Azure Catalyst for conducting business cases and dependency analysis.

## Next steps

> [Review common questions](../migrate/resources-faq.md) about Azure Catalyst.
