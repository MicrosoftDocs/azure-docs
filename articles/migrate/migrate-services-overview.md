---
title: About Azure Migrate | Microsoft Docs
description: Provides an overview of the Azure Migrate service.
author: rayne-wiselman
ms.service: azure-migrate
ms.topic: overview
ms.date: 04/15/2019
ms.author: raynew
ms.custom: mvc
---


# About Azure Migrate

[Azure Migrate](migrate-services-overview.md) discovers, assesses, and migrates on-premises infrastructure, apps, and workloads to the Microsoft Azure cloud. This article summarizes the assessment and migration architecture and processes for Azure Migrate.

- **Unified migration platform**: Provides a single portal to centralize, manage, and track your migration journey to Azure.
- **Range of tools**: Provides assessment and migration with Azure Migrate, and integrates with other Azure services, and independent software vendor (ISV) tools.
- **Server assessment/migration**: Assess and migrate on-premises VMware VMs, Hyper-V VMs, and physical servers.
- **Database assessment/migration**: Assess Microsoft SQL Server for migration using the Data Migration Assistant (DMA). Migrate on-premises databases to Azure using the Azure Database Migration Service (DMS).

## ISV integration

Azure Migrate integrates with these ISV offerings.

**ISV**	| **Feature**
--- | ---
Cloudamize | Server assessment
Corent Tech	| Server assessment
Turbonomic	| Server assessment
Zerto | Server migration

## Assessment and migration

Azure Migrate assesses and migrates as follows:

- **Prepare for discovery and assessment**: Azure Migrate uses a lightweight appliance running on-premises as a VMware VM or Hyper-V VMs. The appliance is created from an OVF template file (VMware), or from a compressed VM (Hyyper-V) that's downloaded from the Azure portal. The appliance VM is registered with Azure Migrate.
- **Discover on-premises machines**: The Collector app on the appliance runs to discover on-premises VMs. The appliance is always connected to the Azure Migrate service, and and continually sends metadata and performance-related data from the VMs to Azure.
    - Nothing needs to be installed on the VMs you're discovering.
    - VM metadata includes information about cores, memory, disks, disk sizes, and network adapters.
    - Performance data includes information about CPU and memory usage, disk IOPS, disk throughput (MBps) , and network output (MBps)
- **Assess machines**: After discovery finishes, in the Azure portal you gather discovered VMs into groups that typically consist of VMs that you'd like to migrate together. You run an assessment on a group. After the assessment finishes, you can view it in the portal, or download it in Excel format. 
- **Migrate machines**: After you've analyze the assessments, you can migrate the machines to Azure.




## Next steps

- [Learn more](https://azure.microsoft.com/pricing/details/azure-migrate/) about Azure Migrate pricing.
- Review support requirements and limitations for discovery, assessment, and migration in the [VMware VM](migrate-support-matrix-vmware.md) and [Hyper-V VM](migrate-support-matrix-hyper-v.md) support matrices.
- [Review frequently asked questions](resources-faq.md) about Azure Migrate.

