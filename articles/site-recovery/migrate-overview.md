---
title: Migrating servers and VMs to Azure with Azure Site Recovery 
description: Describes how to migrate on-premises and Azure IaaS VMs to Azure using the Azure Site Recovery service.
services: site-recovery
author: rayne-wiselman
manager: carmonm
ms.service: site-recovery
ms.topic: conceptual
ms.date: 07/27/2020
ms.author: raynew

---

# About migration

Use the Azure Migrate service to migrate VMs and servers to Azure, rather than the Azure Site Recovery service. [Learn more](../migrate/migrate-services-overview.md) about Azure Migrate.


## Why use Azure Migrate?

Using Azure Migrate for migration provides a number of advantages:
 
 
- Azure Migrate provides a centralized hub for discovery, assessment, and migration to Azure.
- Using Azure Migrate provides interoperability and future extensibility with Azure Migrate tools, other Azure services, and third-party tools.
- The Azure Migrate:Server Migration tool is purpose-built for server migration to Azure. It's optimized for migration. You don't need to learn about concepts and scenarios that aren't directly relevant to migration. 
- There are no tool usage charges for migration for 180 days, from the time replication is started for a VM. This gives you time to complete migration. You only pay for the storage and network resources used in replication, and for compute charges consumed during test migrations.
- For VMware VMs, Azure Migrate provides agentless migration, in addition to agent-based migration.
- We're prioritizing new migration features for the Azure Migrate:Server Migration tool only.

## When to use Site Recovery?

Site Recovery should be used:

- For disaster recovery of on-premises machines to Azure.
- For disaster recovery of Azure VMs, between Azure regions.

Although we recommend using Azure Migrate to migrate on-premises servers to Azure, if you've already started your migration journey with Site Recovery, you can continue using it to complete your migration.  

## Next steps

> [Review common questions](../migrate/resources-faq.md) about Azure Migrate.
