---
title: Common questions about Azure Migrate
description: Get answers to common questions about the Azure Migrate service.
author: snehaamicrosoft
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 11/21/2019
ms.author: snehaa
---

# Azure Migrate: Common questions

This article answers common questions about Azure Migrate. If you have further queries after reading this article, post them on the [Azure Migrate forum](https://aka.ms/AzureMigrateForum). If you have other questions, review these articles:

- [Questions](common-questions-appliance.md) about the Azure Migrate appliance.
- [Questions](common-questions-discovery-assessment.md) about discovery, assessment, and dependency visualization.


## What is Azure Migrate?

Azure Migrate provides a central hub to track discovery, assessment and migration of your on-premises apps and workloads, and private/public cloud VMs, to Azure. The hub provides Azure Migrate tools for assessment and migration, as well as third-party independent software vendor (ISV) offerings. [Learn more](migrate-services-overview.md).


## What can I do with Azure Migrate?

Use Azure Migrate to discover, assess, and migrate on-premises infrastructure, applications, and data to Azure. Azure Migrate supports assessment and migration of on-premises VMware VMs, Hyper-V VMs, physical servers, other virtualized VMs, databases, web apps, and virtual desktops. 

## What's the difference between Azure Migrate and Site Recovery?

Azure Migrate provides a centralized hub for assessment and migration to Azure. [Azure Site Recovery](../site-recovery/site-recovery-overview.md) is a disaster recovery solution. The Azure Migrate: Server Migration tool uses some backend Site Recovery functionality for lift-and-shift migration of some on-premises machines.

## What's the difference between Azure Migrate Server Assessment and the MAP Toolkit?

Server Assessment provides assessment to help with migration readiness, and evaluation of workloads for migration to Azure. [Microsoft Assessment and Planning (MAP) Toolkit](https://www.microsoft.com/download/details.aspx?id=7826) helps with other tasks, including migration planning for newer versions of Windows client/server operating systems, and software usage tracking. For these scenarios, continue to use the MAP Toolkit.

## What's the difference between Server Assessment and the Site Recovery Deployment Planner?

Server Assessment is a migration planning tool. The Site Recovery Deployment Planner is a disaster recovery planning tool.

- **Plan on-premises migration to Azure**: If you plan to migrate your on-premises servers to Azure, use Server Assessment for migration planning. It assesses on-premises workloads and provides guidance and tools to help you migrate. After the migration plan is in place, you can use tools, including Azure Migrate Server Migration, to migrate the machines to Azure.
- **Plan disaster recovery to Azure**: If you plan to set up disaster recovery from on-premises to Azure with Site Recovery, use the Site Recovery Deployment Planner. The Deployment Planner provides a deep, Site Recovery-specific assessment of your on-premises environment for the purpose of disaster recovery. It provides recommendations around disaster recovery, such as replication and failover.

## How does Server Migration work with Site Recovery?

- If you use Azure Migrate: Server Migration to perform an agentless migration of on-premises VMware VMs, then migration is native to Azure Migrate and Site Recovery isn't used.
- If you use Azure Migrate: Server Migration to perform an agent-based migration of VMware VMs, or migrate Hyper-V VMs or  physical servers, then Azure Migrate Server Migration uses the Azure Site Recovery replication engine.


## Which geographies are supported?

Review the Azure Migrate supported geographies for [VMware VM](https://docs.microsoft.com/azure/migrate/migrate-support-matrix-vmware) and for [Hyper-V VMs](https://docs.microsoft.com/azure/migrate/migrate-support-matrix-hyper-v).

## How do I get started?

You identify the tool you need, and add it to an Azure Migrate project. If you’re adding an ISV tool or Movere:
- Get started by obtaining a license, or signing up for a free trial, in accordance with the tool policy. Licensing for tools is in accordance with the ISV or tool licensing model.
- In each tool, there's an option to connect to Azure Migrate. Follow the tool instructions and documentation, to connect the tool with Azure Migrate.
You centrally track your migration journey from within the Azure Migrate project, across Azure and other tools.

### How do I delete a project?

[Learn how to](how-to-delete-project.md) delete a project. 






## Next steps
Read the [Azure Migrate overview](migrate-services-overview.md).
