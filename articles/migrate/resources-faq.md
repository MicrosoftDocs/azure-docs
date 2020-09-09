---
title: Azure Migrate FAQ
description: Get answers to common questions about the Azure Migrate service.
ms.topic: conceptual
ms.date: 04/15/2020
---

# Azure Migrate: Common questions

This article answers common questions about Azure Migrate. If you have questions after you read this article, you can post them in the [Azure Migrate forum](https://aka.ms/AzureMigrateForum). You also can review these articles:

- Questions about the [Azure Migrate appliance](common-questions-appliance.md)
- Questions about [discovery, assessment, and dependency visualization](common-questions-discovery-assessment.md)

## What is Azure Migrate?

Azure Migrate provides a central hub to track discovery, assessment, and migration of your on-premises apps and workloads and private and public cloud VMs to Azure. The hub provides Azure Migrate tools for assessment and migration and third-party ISV offerings. [Learn more](migrate-services-overview.md).

## What can I do with Azure Migrate?

Use Azure Migrate to discover, assess, and migrate on-premises infrastructure, applications, and data to Azure. Azure Migrate supports assessment and migration of on-premises VMware VMs, Hyper-V VMs, physical servers, other virtualized VMs, databases, web apps, and virtual desktops. 

## What's the difference between Azure Migrate and Azure Site Recovery?

[Azure Migrate](migrate-services-overview.md) provides a centralized hub for assessment and migration to Azure. 

- Using Azure Migrate provides interoperability and future extensibility with Azure Migrate tools, other Azure services, and third-party tools.
- The Azure Migrate:Server Migration tool is purpose-built for server migration to Azure. It's optimized for migration. You don't need to learn about concepts and scenarios that aren't directly relevant to migration. 
- There are no tool usage charges for migration for 180 days, from the time replication is started for a VM. This gives you time to complete migration. You only pay for the storage and network resources used in replication, and for compute charges consumed during test migrations.
- Azure Migrate supports all migration scenarios supported by Site Recovery. In addition, for VMware VMs, Azure Migrate provides an agentless migration option.
- We're prioritizing new migration features for the Azure Migrate:Server Migration tool only. These features aren't targeted for Site Recovery.

[Azure Site Recovery](../site-recovery/site-recovery-overview.md) should be used for disaster recovery only.

The Azure Migrate: Server Migration tool uses some back-end Site Recovery functionality for lift-and-shift migration of some on-premises machines.

## I have a project with the previous Classic experience of Azure Migrate. How do I start using the new version?

You can't upgrade projects or components in the previous version to the new version. You need to [create a new Azure Migrate project](create-manage-projects.md), and [add assessment and migration tools](how-to-add-tool-first-time.md) to it. Use the tutorials to understand how to use the assessment and migration tools available. If you had a Log Analytics workspace attached to a Classic project, you can attach it to a project of current version after you delete the Classic project.

## What's the difference between Azure Migrate: Server Assessment and the MAP Toolkit?

Server Assessment provides assessment to help with migration readiness, and evaluation of workloads for migration to Azure. The [Microsoft Assessment and Planning (MAP) Toolkit](https://www.microsoft.com/download/details.aspx?id=7826) helps with other tasks, including migration planning for newer versions of Windows client and server operating systems, and software usage tracking. For these scenarios, continue to use the MAP Toolkit.

## What's the difference between Server Assessment and the Site Recovery Deployment Planner?

Server Assessment is a migration planning tool. The Site Recovery Deployment Planner is a disaster recovery planning tool.

Choose your tool based on what you want to do:

- **Plan on-premises migration to Azure**: If you plan to migrate your on-premises servers to Azure, use Server Assessment for migration planning. Server Assessment assesses on-premises workloads and provides guidance and tools to help you migrate. After the migration plan is in place, you can use tools like Azure Migrate: Server Migration to migrate the machines to Azure.
- **Plan disaster recovery to Azure**: If you plan to set up disaster recovery from on-premises to Azure with Site Recovery, use the Site Recovery Deployment Planner. The Deployment Planner provides a deep, Site Recovery-specific assessment of your on-premises environment for the purpose of disaster recovery. It provides recommendations related to disaster recovery, such as replication and failover.

## How does Server Migration work with Site Recovery?

- If you use Azure Migrate: Server Migration to perform an *agentless* migration of on-premises VMware VMs, migration is native to Azure Migrate and Site Recovery isn't used.
- If you use Azure Migrate: Server Migration to perform an *agent-based* migration of VMware VMs, or if you migrate Hyper-V VMs or physical servers, Azure Migrate: Server Migration uses the Azure Site Recovery replication engine.

## Which geographies are supported?

Review the supported geographies for [public](migrate-support-matrix.md#supported-geographies-public-cloud) and [government clouds](migrate-support-matrix.md#supported-geographies-azure-government).

## How do I get started?

Identify the tool you need, and then add the tool to an Azure Migrate project. 

To add an ISV tool or Movere:

1. Get started by obtaining a license, or sign up for a free trial, in accordance with the tool policy. Licensing for tools is in accordance with the ISV or tool licensing model.
2. In each tool, there's an option to connect to Azure Migrate. Follow the tool instructions and documentation to connect the tool with Azure Migrate.

You can track your migration journey from within the Azure Migrate project, across Azure, and in other tools.

## How do I delete a project?

Learn how to [delete a project](how-to-delete-project.md). 

## Next steps

Read the [Azure Migrate overview](migrate-services-overview.md).
