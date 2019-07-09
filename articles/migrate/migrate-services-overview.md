---
title: About Azure Migrate | Microsoft Docs
description: Provides an overview of the Azure Migrate service.
author: rayne-wiselman
ms.service: azure-migrate
ms.topic: overview
ms.date: 07/09/2019
ms.author: raynew
ms.custom: mvc
---


# About Azure Migrate

This article provides a quick overview of Azure Migrate.

[Azure Migrate](migrate-services-overview.md) helps you migrate to the Microsoft Azure cloud. Azure Migrate provides a central hub to track discovery, assessment and migration of your on-premises apps and workloads, and cloud VMs, to Azure. The hub provides Azure Migrate tools for assessment and migration, as well as third-party independent software vendor (ISV) offerings. It provides:

- **Unified migration platform**: Use a single portal to start, run, and track your migration journey to Azure.
- **Range of tools**: Azure Migrate provides native tools, and integrates with other Azure services, as well as with ISV tools. Select the right assessment and migration toolsb, ased on your organizational requirements.
- **Azure Migrate Server Assessment**: Use the Server Assessmentn tool to assess on-premises VMware VMs and Hyper-V VMs for migration to Azure.
- **Azure Migrate Server Migration**: Use the Server Migration tool to migrate on-premises VMware VMs, Hyper-V VMs, and physical servers to Azure. In addition, migrate private and public cloud instances to Azure.
- **Database assessment/migration**: Assess on-premises databases for migration to Azure, using the Microsoft Data Migration Assistant (DMA). Migrate on-premises databases to Azure using the Azure Database Migration Service (DMS).


## Azure Migrate versions

There are two versions of the Azure Migrate service:

- **Current version**: Use this version to create Azure Migrate projects, discover on-premises assesses, and orchestrate assessments and migrations. [Learn more](whats-new.md) about what's new.
- **Previous version**: For customer using the previous version of Azure Migrate (only assessment of on-premises VMware VMs was supported), you should now use the current version. In the previous version, you can no longer create new Azure Migrate projects or perform new discoveries.

## ISV integration

In addition to Azure Migrate Server Assessment and Server Migration, Azure Migrate integrates with a number of ISV offerings. You identify the tool you need, add it to your Azure Migrate project. You can then track all tools from within the Azure Migrate project.

**ISV**	| **Feature** 
--- | --- 
[Cloudamize](https://www.cloudamize.com/platform) | Assess
[Turbonomic](https://learn.turbonomic.com/azure-migrate-portal-free-trial) | Assess
[Corent Technology](https://www.corenttech.com/AzureMigrate/) | Assess & migrate
[Carbonite](https://www.carbonite.com/globalassets/files/datasheets/carb-migrate4azure-microsoft-ds.pdf | Migrate

## Selecting an ISV tool

If you choose an ISV tool, you can start by obtaining a license, or signing up for a free trial, in accordance with the ISV policy. In each tool, there's an option to connect to Azure Migrate. Follow the tool instructions to connect the app workspace with Azure Migrate. 

## Azure Migrate Server Assessment 

Azure Migrate Server Assessment discovers and assesses on-premises VMware VMs and Hyper-V VMs, for migration to Azure. It uses a lightweight appliance that you deploy on-premises, and register with Server Assessment. The appliance connects to Server Assessment, and continually sends metadata and performance-related data to Azure Migrate.
- Discovery is agentless. Nothing needs to be installed on the VMs you're discovering.
- Collected data includes VM metadata, and performance data. [Learn what's collected](migrate-appliance.md#collected-data).

After machines are discovered, you gather them into groups that typically consist of VMs that you'd like to migrate together. Then you use the Server Assessment tool to assess a group. You can then analyze the assessment, to figure out your migration strategy.

## Azure Migrate Server Migration

Azure Migrate Server Migration helps you to migrate on-premises VMware VMs, Hyper-V VMs, physical servers, other virtualized machines, and private/public cloud instances to Azure. You can migrate machines after assessing them, or without an assessment.

## Database migration

From the Azure Migrate hub you can run tools to assess and migrate on-premises databases to Azure.

- **Database Migration Assistant**: Download and run the Database Migration Assistant (DMA) to assess for migration. The DMA provides information about potential blocking issues for migration, identifies unsupported features, as well as new features that you can benefit from after migration, and helps you identify the right path for database migration. [Learn more](https://docs.microsoft.com/sql/dma/dma-overview?view=sql-server-2017)
- **Database Migration Service**: The Azure Database Migration Service helps you migrate on-premises SQL Server databases to Azure VMs running SQL, as well as to Azure SQL DB, and Azure SQL Managed Instances. [Learn more](https://docs.microsoft.com/azure/dms/dms-overview)

## App migration

From the Azure Migrate hub you can run tools to assess and migrate on-premises apps to Azure.

- **Assess apps online**: You can assess apps with a public URL online, using the Azure App Service Migration Assistant.
- **.NET/PHP**: For internal .NET and PHP apps, you can download and run the Migration Assistant.


## On-premises data

You can use the Data Box offline products to move large amount of data to Azure. [Learn more](https://docs.microsoft.com/azure/databox/)

## Next steps

- [Learn more](https://azure.microsoft.com/pricing/details/azure-migrate/) about Azure Migrate pricing.
- [Review frequently asked questions](resources-faq.md) about Azure Migrate.
- Try out our tutorials to assess [VMware VMs](tutorial-assess-vmware.md) and [Hyper-V VMs](tutorial-assess-hyper-v.md).



