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

[Azure Migrate](migrate-services-overview.md) helps you to discover, assess, and migrate servers, apps, and data to the Microsoft Azure cloud. Azure Migrate provides a central hub to track discovery, assessment and migration of your on-premises apps and workloads, and AWS/GCP VM instances, to Azure. The hub provides Azure Migrate tools for assessment and migration, as well as third-party independent software vendor (ISV) offerings. It provides:


- **Unified migration platform**: Use a single portal to strat, run, and track your migration journey to Azure.
- **Range of tools**: Azure Migrate provides native tools, and integrates with other Azure services, as well as with independent software vendor (ISV) tools. Select the right assessment and migration tools based on your organizational needed.
- **Azure Migrate Server Assessment**: Assess on-premises VMware VMs and Hyper-V VMs for migration to Azure.
- **Azure Migrate Server Migration**: Migrate on-premises VMware VMs, Hyper-V VMs and physical servers. In addition, migrate AWS and GCP instances to Azure.
- **Database assessment/migration**: Assess on-premises SQL Server for migration to Azure, using the Microsoft Data Migration Assistant (DMA). Migrate on-premises databases to Azure using the Azure Database Migration Service (DMS).


## Azure Migrate versions

There are two versions of the Azure Migrate service:

- **Current version**: Use this version to create Azure Migrate projects, discover on-premises assesses, and orchestrate assessments and migrations. [Learn more](whats-new.md) about what's new.
- **Previous version**: For customer using the previous version of Azure Migrate (only assessment of on-premises VMware VMs was supported), you should now use the current version. In the previous version, you can't create new Azure Migrate projects or perform new discoveries.

## ISV integration

Azure Migrate integrates with a number of ISV offerings. You identify the tool you need, add it to your Azure Migrate project, and track your assessment and migration tools from a single location.

**ISV**	| **Feature**
--- | ---
Carbonite | Assess & migrate
Cloudamize | Assess
Corent Technology	| Assess & migrate
Turbonomic	| Assess
UnifyCloud | Assess
Device42 | Assess

## Azure Migrate Server Assessment 

Azure Migrate Server Assessment discovers and assesses on-premises VMware VMs and Hyper-V VMs for migration to Azure. It uses a lightweight appliance that you deploy on-premises, and register with the Azure Migrate service. The appliance connects to Azure Migrate Server Assessment, and continually sends metadata and performance-related data to Azure Migrate.
- Discovery is agentless. Nothing needs to be installed on the VMs you're discovering.
- Collected data includes VM metadata, and performance data. [Learn more](migrate-appliance.md#collected-data).

After machines are discovered, in the Azure portal you gather them into groups that typically consist of VMs that you'd like to migrate together, and then run an assessment for a group. You can then analyze the assessment to figure out your migration strategy.

## Azure Migrate Server Migration

Azure Migrate Server Migration helps you to migrate on-premises physical servers, VMware VMs, and Hyper-V VMs, as well as AWS and GCP VMs. You can migrate machines after assessing them, or without an assessment. For VMware, Azure Migrate currently provides a couple of migration methods, an agentless method that doesn't need anything installed on VMs you want to migrate, and one that migrates using an installed agent on each VM. [Learn more](server-migrate-overview.md) about VMware migration methods.

## Database migration

From the Azure Migrate hub you can run tools to assess and migrate on-premises SQL Server databases to Azure.

- **Database Migration Assistant**: Download and run the Database Migration Assistant (DMA) to assess for migration. The DMA provides information about potential blocking issues for migration, identifies unsupported features, as well as new features that you can benefit from after migration, and helps you identify the right path for database migration.
- **Database Migration Service**: The Azure Database Migration Service helps you migrate on-premises SQL Server databases to Azure VMs running SQL, as well as to Azure SQL DB, and Azure SQL Managed Instances.

## App migration

From the Azure Migrate hub you can run tools to assess and migrate on-premises apps to Azure.

- **Assess apps online**: You can assess apps with a public URL online, using the Azure App Service Migration Assistant.
- **.NET/PHP**: For internal .NET and PHP apps, you can download and run the Migration Assistant.

## Next steps

- [Learn more](https://azure.microsoft.com/pricing/details/azure-migrate/) about Azure Migrate pricing.
- [Review frequently asked questions](resources-faq.md) about Azure Migrate.
- Try out our tutorials to assess [VMware VMs](tutorial-assess-vmware.md) and [Hyper-V VMs](tutorial-assess-hyper-v.md).



