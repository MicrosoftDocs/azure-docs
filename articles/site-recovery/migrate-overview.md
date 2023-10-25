---
title: Compare Azure Migrate and Site Recovery for migration to Azure
description: Summarizes the advantages of using Azure Migrate for migration, instead of Site Recovery.
services: site-recovery
ms.service: site-recovery
ms.topic: conceptual
ms.date: 12/12/2022
ms.author: ankitadutta
author: ankitaduttaMSFT
ms.custom: engagement-fy23
---

# Migrating to Azure

For migration, we recommend that you use the Azure Migrate service to migrate VMs and servers to Azure, rather than the Azure Site Recovery service. [Learn more](../migrate/migrate-services-overview.md) about Azure Migrate.


## Why use Azure Migrate?

Using Azure Migrate for migration provides a number of advantages:
 
 
- Azure Migrate provides a centralized hub for discovery, assessment, and migration to Azure.
- Using Azure Migrate provides interoperability and future extensibility with Azure Migrate tools, other Azure services, and third-party tools.
- The Migration and modernization tool is purpose-built for server migration to Azure. It's optimized for migration. You don't need to learn about concepts and scenarios that aren't directly relevant to migration.
- Azure Migrate can be used to identify modernization opportunities as well as migration previews.
- Some key features like OS upgrade are only available with Azure Migrate.
- There are no tool usage charges for migration for 180 days, from the time replication is started for a VM. This gives you time to complete migration. You only pay for the storage and network resources used in replication, and for compute charges consumed during test migrations.
- Azure Migrate supports all migration scenarios supported by Site Recovery. In addition, for VMware VMs, Azure Migrate provides an agentless migration option.
- We're prioritizing new migration features for the Migration and modernization tool only. These features aren't targeted for Site Recovery.

## When to use Site Recovery?

Site Recovery should be used:

- For disaster recovery of on-premises machines to Azure.
- For disaster recovery of Azure VMs, between Azure regions.

## What Should I Use?

We recommend using Azure Migrate to migrate on-premises servers to Azure.  However, if you've already started your migration journey with Site Recovery, consider the following:

- With ASR already replicating your servers, there is no need to deploy a Migrate appliance, remove the BCDR protection, and replicate with a new appliance.
- However, there are benefits to doing assessment, dependency analysis, and business case review with the Azure Migrate discovery appliance even for workloads that are already replicating.
- There may be architecture changes needed to support the workload long term; in that case, address those but continue to use ASR to replicate so that you do not remove protections.

In sum:

- If you are beginning a new migration with neither ASR nor Migrate in place, use Azure Migrate.
- If you have ASR in place actively protecting machines, continue to use it.
- For disaster recovery of on-premises machines to Azure, use ASR; this tool can be used to eventually migrate machines to Azure when it is determined they should be moved off-premise.
- For disaster recovery of Azure VMs, between Azure regions, use ASR though Azure Migrate may be used to initially move them into Azure.   

## Next steps

> [Review common questions](../migrate/resources-faq.md) about Azure Migrate.
