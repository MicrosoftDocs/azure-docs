---
title: What's new in Azure Migrate | Microsoft Docs
description: Provides an overview of the Azure Migrate service.
author: rayne-wiselman
ms.service: azure-migrate
ms.topic: overview
ms.date: 05/29/2019
ms.author: raynew
ms.custom: mvc
---

# What's new in Azure Migrate

[Azure Migrate](migrate-services-overview.md) discovers, assesses, and migrates on-premises infrastructure, apps, and workloads to the Microsoft Azure cloud. This article summarizes new features and updates for Azure Migrate.

## Azure Migrate new version

A new version of Azure Migrate has recently been released (June 2019). The new version replaces the earlier one. If you're using the old version, you can continue to manage backups, but you can't create new Azure Migrate projects.??????

The new version of Azure Migrate provides a number of new features:

- **Unified migration platform**: Azure Migrate now provides single portal to centralize, manage, and track your migration journey to Azure, with an improved deployment flow and portal experience.
- **Server assessment and migration**: You can assess on-premises VMware VMs and Hyper-V VMs for migration to Azure using the Azure Migrate Server Assessment tool, or integrated third-party tools. You can migrate on-premises VMware VMs, Hyper-V VMs, physical servers, AWS and GCP instances to Azure using the Azure Migrate Server Migration tool, or integrated third-party tools.
- **VMware VM migration**:  Azure Migrate provides an agentless migration experience for migration of VMware VMs to Azure. Discovery,assessment, and migration is handled by an Azure Migrate appliance running as a VMware VM, interacting with vCenter Server. An alternative agent-based migration is also available.
 - **Database assessment and migration**: From Azure Migrate, you can assess on-premises databases for migration to Azure using the Azure Database Migration Assistant. You can migrate databases using the Azure Database Migration Service.
- **Web app migration**: You can assess web apps using a public endpoint URL with the Azure App Service. For migration of internal .NET apps you can download and run the App Service Migration Assistant. 
- **Data Box**: Import offline Data Box data into Azure from Azure Migrate.
- **Azure Migrate appliance**: A lightweight, easily-deployed appliance for discovery and assessment of on-premises VMware VMs and Hyper-V VMs using Azure Migrate Server Assessment and Migration.
**Continuous discovery of VMs**: The Azure Migrate appliance continuous discovers server metadata and performance data for the purposes of assessment and migration.  
**Performance-based assessment**: The Azure Migrate appliance now gathers, measures, and assesses server performance data.


## ISV integration

Azure Migrate integrates with these ISV offerings.

**ISV**	| **Feature**
--- | ---
Cloudamize | Server assessment
Corent Tech	| Server assessment
Turbonomic	| Server assessment
Zerto | Server migration


## Next steps

- [Learn more](https://azure.microsoft.com/pricing/details/azure-migrate/) about Azure Migrate pricing.
- Review the support matrix for information about requirements and limitations for discovery, assessment, and migration of [VMware VMs](migrate-support-matrix-vmware.md) and [Hyper-V VMs](migrate-support-matrix-hyper-v.md).
- [Review frequently asked questions](resources-faq.md) about Azure Migrate.

