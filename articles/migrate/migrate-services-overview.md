---
title: About Azure Migrate | Microsoft Docs
description: Provides an overview of the Azure Migrate service.
author: rayne-wiselman
ms.service: azure-migrate
ms.topic: overview
ms.date: 07/11/2019
ms.author: raynew
ms.custom: mvc
---


# About Azure Migrate

This article provides a quick overview of Azure Migrate.

Azure Migrate helps you migrate your on-premises datacenter to Azure. Azure Migrate provides a central hub to track discovery, assessment and migration of on-premises infrastructure, application and data to Azure. The hub provides Microsoft tools for assessment and migration, as well as third-party independent software vendor (ISV) offerings. It provides:

- **Unified migration platform**: Use a single portal to start, run, and track your migration journey to Azure.
- **Range of tools**: Azure Migrate provides native tools, and integrates with other Azure services, as well as with ISV tools. Select the right assessment and migration tools, based on your organizational requirements.
- **Azure Migrate Server Assessment**: Use the Server Assessment tool to assess on-premises VMware VMs and Hyper-V VMs for migration to Azure.
- **Azure Migrate Server Migration**: Use the Server Migration tool to migrate on-premises VMware VMs, Hyper-V VMs, cloud VMs and physical servers to Azure.
- **Azure Migrate Database Assessment**: Assess on-premises databases for migration to Azure, using the Microsoft Data Migration Assistant (DMA)
- **Azure Migrate Database Migration**: . Migrate on-premises databases to Azure using the Azure Database Migration Service (DMS).


## Azure Migrate versions

There are two versions of the Azure Migrate service:

- **Current version**: Use this version to create Azure Migrate projects, discover on-premises machines, and orchestrate assessments and migrations. [Learn more](whats-new.md) about what's new in this version.
- **Previous version**: If you were using the previous version of Azure Migrate (only assessment of on-premises VMware VMs was supported), you should now use the current version. You can no longer create new Azure Migrate projects using the previous version, or perform new discoveries with the previous version. However, you can still access existing projects. To do this in the Azure portal > **All services**, search for **Azure Migrate**. On the Azure Migrate dashboard, you will see a notification to access with a link to access old Azure Migrate projects.

## ISV integration

In addition to native Microsoft tools, Azure Migrate also integrates with a number of ISV offerings to enable richer assessment and migration capabilities. You identify the tool you need, add it to your Azure Migrate project. You can then centrally track the progress of your migration journey from within the Azure Migrate project across Microsoft and ISV tools.

**ISV**	| **Feature**
--- | ---
[Cloudamize](https://www.cloudamize.com/platform) | Assess
[Device 42](https://docs.device42.com/) | Assess
[Turbonomic](https://learn.turbonomic.com/azure-migrate-portal-free-trial) | Assess
[UnifyCloud](https://www.cloudatlasinc.com/cloudrecon/) | Assess
[Corent Technology](https://www.corenttech.com/AzureMigrate/) | Assess & migrate
[Carbonite](https://www.carbonite.com/globalassets/files/datasheets/carb-migrate4azure-microsoft-ds.pdf) | Migrate

### Selecting an ISV tool

If you add an ISV tool to an Azure Migrate project, get started with the tool by obtaining a license, or signing up for a free trial, in accordance with the ISV policy. In each tool, there's an option to connect to Azure Migrate. Follow the tool instructions and documentation, to connect the tool with Azure Migrate.

## Azure Migrate Server Assessment

Azure Migrate Server Assessment discovers and assesses on-premises VMware VMs and Hyper-V VMs, for migration to Azure It helps you identify the following details:

- **Azure readiness:** Whether the on-premises machines are ready for migration to Azure
- **Azure sizing:** What should be the right VM SKU and disk SKU for the on-premises VMs and disks based on utilization data
- **Azure cost estimation:** What would be the cost of running the on-premises servers on Azure
- **Dependency visualization:** How do I identify the servers that are dependent on each other and should be moved together to Azure

Server Assessment uses a lightweight appliance that you deploy on-premises, and register with Server Assessment to do the discovery. The appliance connects to Server Assessment, and continually sends metadata and performance-related data to Azure Migrate.
- Discovery is agentless. Nothing needs to be installed on the VMs you're discovering.
- Collected data includes VM metadata, and performance data. Learn more about data collected for [VMware](migrate-appliance.md#collected-performance-data-vmware) and [Hyper-V](migrate-appliance.md#collected-performance-data-hyper-v).

After the machines are discovered, you gather them into groups that typically consist of VMs that you'd like to migrate together. You can then use the Server Assessment tool to assess a group. You can then analyze the assessment, to figure out your migration strategy.

## Azure Migrate Server Migration

Azure Migrate Server Migration helps you to migrate on-premises VMware VMs, Hyper-V VMs, physical servers, other virtualized machines, and public cloud VMs to Azure. You can migrate machines after assessing them, or without an assessment. For migration of VMware VMs, you have both agent-based and agentless options. Hyper-V VM migration is agentless.

## Azure Migrate Database Assessment

Azure Migrate integrates with Data Migration Assistant (DMA) to enable assessments of on-premises databases for migration to Azure. You can download and run the Data Migration Assistant (DMA) tool to assess on-premises SQL Server databases for migration to Azure SQL DB, Azure SQL Managed Instance or Azure SQL VM. DMA provides information about potential blocking issues for migration, identifies unsupported features, as well as new features that you can benefit from after migration, and helps you identify the right path for database migration. [Learn more](https://docs.microsoft.com/sql/dma/dma-overview?view=sql-server-2017)


## Azure Migrate Database Migration

Azure Migrate integrates with Database Migration Service (DMS) to enable migration of on-premises databases to Azure. The Azure Database Migration Service helps you migrate on-premises databases to Azure VMs running SQL, as well as to Azure SQL DB, and Azure SQL Managed Instances. [Learn more](https://docs.microsoft.com/azure/dms/dms-overview)

## Web application assessment and migration

From the Azure Migrate hub you can run tools to assess and migrate on-premises web apps to Azure.

- **Assess web apps online**: Use Azure App Service Migration Assistant to assess if an on-premises website is suitable for migration to Azure App Service.
- **Migrate web apps**: Migrate .NET and PHP web apps to Azure using Azure App Service Migration Assistant.

[Learn more.](https://appmigration.microsoft.com/)

## Offline data migration

You can use the Data Box offline family of products to move large amounts of data to Azure. [Learn more](https://docs.microsoft.com/azure/databox/)

## Next steps

- Try out our tutorials to assess [VMware VMs](tutorial-assess-vmware.md) and [Hyper-V VMs](tutorial-assess-hyper-v.md).
- [Learn more](https://azure.microsoft.com/pricing/details/azure-migrate/) about Azure Migrate pricing.
- [Review frequently asked questions](resources-faq.md) about Azure Migrate.
