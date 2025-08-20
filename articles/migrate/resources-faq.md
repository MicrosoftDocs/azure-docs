---
title: Azure Migrate FAQ
description: Get answers to common questions about the Azure Migrate service.
author: habibaum
ms.author: v-uhabiba 
ms.topic: faq
ms.date: 06/20/2024
ms.custom: engagement-fy25
# Customer intent: As a cloud administrator, I want to find comprehensive answers to common questions about Azure Migrate, so that I can effectively manage and execute the migration of on-premises infrastructure and applications to Azure.
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
- The Migration and modernization tool is purpose-built for server migration to Azure. It's optimized for migration. You don't need to learn about concepts and scenarios that aren't directly relevant to migration.
- There are no tool usage charges for migration for 180 days from the time replication is started for a VM. It gives you time to complete migration. You only pay for the storage and network resources used in replication, and for compute charges consumed during test migrations.
- Azure Migrate supports all migration scenarios supported by Site Recovery. Also, for VMware VMs, Azure Migrate provides an agentless migration option.
- We're prioritizing new migration features for the Migration and modernization tool only. These features aren't targeted for Site Recovery.

[Azure Site Recovery](../site-recovery/site-recovery-overview.md) should be used for disaster recovery only.

The Migration and modernization tool uses some back-end Site Recovery functionality for lift-and-shift migration of some on-premises machines.

## I have a project with the previous classic experience of Azure Migrate. How do I start using the new version?

Classic Azure Migrate is retiring in Feb 2024. After Feb 2024, classic version of Azure Migrate will no longer be supported, and the inventory metadata in the classic project will be deleted. You can't upgrade projects or components in the previous version to the new version. You need to [create a new Azure Migrate project](create-manage-projects.md), and [add assessment and migration tools](./create-manage-projects.md) to it. Use the tutorials to understand how to use the assessment and migration tools available. If you had a Log Analytics workspace attached to a classic project, you can attach it to a project of current version after you delete the classic project.

## What's the difference between Azure Migrate: Discovery and assessment and the MAP Toolkit?

Server Assessment provides assessment to help with migration readiness, and evaluation of workloads for migration to Azure. The [Microsoft Assessment and Planning (MAP) Toolkit](https://www.microsoft.com/download/details.aspx?id=7826) helps with other tasks, including migration planning for newer versions of Windows client and server operating systems, and software usage tracking. For these scenarios, continue to use the MAP Toolkit.

## What's the difference between Server Assessment and the Site Recovery Deployment Planner?

Server Assessment is a migration planning tool. The Site Recovery Deployment Planner is a disaster recovery planning tool.

Choose your tool based on what you want to do:

- **Plan on-premises migration to Azure**: If you plan to migrate your on-premises servers to Azure, use Server Assessment for migration planning. Server Assessment assesses on-premises workloads and provides guidance and tools to help you migrate. After the migration plan is in place, you can use tools like the Migration and modernization tool to migrate the machines to Azure.
- **Plan disaster recovery to Azure**: If you plan to set up disaster recovery from on-premises to Azure with Site Recovery, use the Site Recovery Deployment Planner. The Deployment Planner provides a deep, Site Recovery-specific assessment of your on-premises environment for disaster recovery. It provides recommendations related to disaster recovery, such as replication and failover.

## How does the Migration and modernization tool work with Site Recovery?

- If you use the Migration and modernization tool to perform an *agentless* migration of on-premises VMware VMs, migration is native to Azure Migrate and Site Recovery isn't used.
- If you use the Migration and modernization tool to perform an *agent-based* migration of VMware VMs, or if you migrate Hyper-V VMs or physical servers, the Migration and modernization tool uses the Azure Site Recovery replication engine.

## Which geographies are supported?

Review the supported geographies for [public](supported-geographies.md#public-cloud) and [government clouds](supported-geographies.md#azure-government).

## What does Azure Migrate do to ensure data residency?

When you create a project, you select a geography of your choice. The project and related resources are created in one of the regions in the geography, as allocated by the Azure Migrate service. 
See the metadata storage locations for each geography [here](supported-geographies.md#public-cloud).

Azure Migrate doesn't move or store customer data outside of the region allocated, guaranteeing data residency and resiliency in the same geography.

Azure Migrate provides an additional option for creating projects and ensuring data residency in preferred regions beyond the specified geographies. To avail this option, use the link - https://aka.ms/migrate/ProjectRegionSelection.

## Does Azure Migrate offer Backup and Disaster Recovery?

Azure Migrate is classified as customer managed Disaster Recovery, which means Azure Migrate doesn't offer to recover data from an alternate region and offer it to customers when the project region isn't available.

While using different capabilities, it's recommended that you export the software inventory, dependency analysis, and assessment report for an offline backup.

In the event of a regional failure or outage in the Azure region that your project is created in:
- You might not be able to access your Azure Migrate projects, assessments, and other reports during the outage. However, you can use the offline copies that you exported. 
- Any in-progress replication and/or migration are paused and you might have to restart it post the outage.

## How do I delete a project?

Learn how to [delete a project](how-to-delete-project.md).

## Can an Azure Migrate resource be moved?

No, Azure Migrate doesn't support moving resources. To move resources created by Azure Migrate, consider creating a new project in the desired region.


## Is Azure Migrate still supporting VDI migration?

Yes, Azure Migrate supports Virtual Desktop Infrastructure (VDI) migrations. For more information, see [tech community blog](https://techcommunity.microsoft.com/blog/azuremigrationblog/migrate-virtual-desktops-to-azure/1361120).

## Can I use Azure Migrate to move VMs from AVS to Azure?

No, you can't use Azure Migrate to move VMs from AVS to Azure. Azure Migrate supports moving VMs from on-premises to AVS or other Azure services, but not the other way around.

## What skills and expertise help manage migration effectively with Azure Migrate?

Customers who want to migrate must be familiar with the Azure portal and understand basic migration concepts like the 6Rs. They also need the following technical skills, which vary depending on what they migrate: 

- **Application migration**: Understand application architecture, dependencies, and code refactoring.
- **Cloud migration**: Know Azure roles, networking, and security.
- **Infrastructure migration**: Work with virtualization (VMware, Hyper-V), servers, storage, and backup.
- **Scripting**: Use Bash, PowerShell, or Python to automate parts of the migration and testing.
- **Integration**: Use APIs, middleware, and tools like MuleSoft or Boomi toto maintain interoperability.


## What migration approaches do I have with Azure Migrate, such as rehosting, replatforming, or refactoring?

Azure Migrate now offers options to create business cases and assessment reports for workloads that users want to rehost, replatform, or refactor.

For actual migration execution, Azure Migrate supports rehosting (also known as lift-and-shift).

For rehosting:

- **Server migration**: It helps move virtual machines (VMware, Hyper-V, or physical servers).
- **Database migration service (DMS)**: It supports migrating SQL Server and other databases.

This approach works best for:

- Legacy applications
- Quick migrations with minimal testing
- Time-sensitive lift-and-shift projects
- Applications with complex code that still run well on Azure


## Next steps

Read the [Azure Migrate overview](migrate-services-overview.md).