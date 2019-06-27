---
title: About Azure Migrate | Microsoft Docs
description: Provides an overview of the Azure Migrate service.
author: rayne-wiselman
ms.service: azure-migrate
ms.topic: overview
ms.date: 06/27/2019
ms.author: raynew
ms.custom: mvc
---


# About Azure Migrate

This article provides a quick overview of Azure Migrate.

[Azure Migrate](migrate-services-overview.md) helps you to discover, assess, and migrate servers, apps, and data to the Microsoft Azure cloud. It provides the following:

- **Unified migration platform**: Use a single portal to centralize, orchestrate, manage, and track your migration journey to Azure.
- **Range of tools**: Azure Migrate provides native tools, and integrates with other Azure services, as well as with independent software vendor (ISV) tools.
- **Azure Migrate Server Assessment/Server Migration**: Assess and migrate on-premises VMware VMs, Hyper-V VMs, and physical servers, as well as AWS/GCS VMs, using Azure Migrate tools.
- **Database assessment/migration**: Assess Microsoft SQL Server for migration using the Microsoft Data Migration Assistant (DMA). Migrate on-premises databases to Azure using the Azure Database Migration Service (DMS).


## Azure Migrate versions

There are two versions of the Azure Migrate service:

- **Current version**: Use this version to create Azure Migrate projects, discover on-premises assesses, and orchestrate assessments and migrations. [Learn more](whats-new.md#azure-migrate-new-version). [Learn more](whats-new.md) about what's new.
- **Previous version**: For customer using the previous version of Azure Migrate (only assessment of on-premises VMware VMs was supported), you should now use the current version. In the previous version, you can't create new Azure Migrate projects or perform new discoveries.

## ISV integration

Azure Migrate integrates with these ISV offerings.

**ISV**	| **Feature**
--- | ---
Cloudamize | Server assessment
Corent Tech	| Server assessment
Turbonomic	| Server assessment
Zerto | Server migration

## Azure Migrate Server Assessment 

Azure Migrate Server Assessment discovers and assesses on-premises VMware VMs and Hyper-V VMs using a lightweight appliance that's registered with the Azure Migrate service. The appliance connects to the service, and continually sends metadata and performance-related data to Azure Migrate.
- Nothing needs to be installed on the VMs you're discovering.
- VM metadata includes information about cores, memory, disks, disk sizes, and network adapters.
- Performance data includes information about CPU and memory usage, disk IOPS, disk throughput (MBps), and network output (MBps)

After machines are discovered, in the Azure portal you gather them into groups that typically consist of VMs that you'd like to migrate together, and then run an assessment on groups. You can then analyze the assessment to figure out your migration strategy.

## Azure Migrate Server Migration

Azure Migrate Server Migration helps you to migrate on-premises physical servers, VMware VMs, and Hyper-V VMs, as well as AWS and GCS VMs. You can migrate machines after assessing them, or without an assessment. For VMware, Azure Migrate currently provides a couple of migration methods, one that doesn't require you to install anything on the VMs you want to migrate, and one that migrates using an installed agent on each VM. [Learn more](server-migrate-overview.md) about VMware migration methods.


## Next steps

- [Learn more](https://azure.microsoft.com/pricing/details/azure-migrate/) about Azure Migrate pricing.
- [Review frequently asked questions](resources-faq.md) about Azure Migrate.
- Try out our tutorials to assess [VMware VMs](tutorial-assess-vmware.md) and [Hyper-V VMs](tutorial-assess-hyper-v.md).



