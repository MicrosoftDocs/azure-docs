---
title: About Azure Migrate | Microsoft Docs
description: Provides an overview of the Azure Migrate service.
author: rayne-wiselman
ms.service: azure-migrate
ms.topic: overview
ms.date: 10/14/2019
ms.author: raynew
ms.custom: mvc
---


# About Azure Migrate

This article provides a quick overview of Azure Migrate.

Azure Migrate helps you to migrate to Azure. Azure Migrate provides a centralized hub to track discovery, assessment, and migration of on-premises infrastructure, applications, and data to Azure. The hub provides Azure tools for assessment and migration, as well as third-party independent software vendor (ISV) offerings. It provides:

- **Unified migration platform**: Use a single portal to start, run, and track your migration journey to Azure.
- **Range of tools**: Azure Migrate provides native tools, and integrates with other Azure services, as well as with ISV tools. Select the right assessment and migration tools, based on your organizational requirements. Azure Migrate provides assessment and migration tools for the following workloads:
    - **Servers**: Use Microsoft tools or ISV tools for assessment and migration of servers to Azure VMs
    - **Databases**: Leverage Microsoft and ISV tools for assessment and migration of on-premises databases to Azure SQL DB or Azure SQL MI
    - **Web applications**: Use Azure App Service Assistant to assess and migrate on-premises web applications to Azure App Service
    - **Virtual Desktops**: Use ISV tools to assess and migrate on-premises virtual desktop infrastructure to Windows Virtual Desktop on Azure
    - **Data**: Use Azure Data Box family of products to quickly and cost-effectively migrate data to Azure

## Azure Migrate versions

There are two versions of the Azure Migrate service:

- **Current version**: Use this version to create Azure Migrate projects, discover on-premises machines, and orchestrate assessments and migrations. [Learn more](whats-new.md) about what's new in this version.
- **Previous version**: If you were using the previous version of Azure Migrate (only assessment of on-premises VMware VMs was supported), you should now use the current version. You can no longer create Azure Migrate projects using the previous version, and we recommend that you don't perform new discoveries. To access existing projects, in the Azure portal > **All services**, search for **Azure Migrate**. On the Azure Migrate dashboard, there's a notification and a link to access old Azure Migrate projects.

## ISV integration

In addition to native Microsoft tools, Azure Migrate integrates with a number of ISV offerings. You identify the tool you need, and add it to an Azure Migrate project. You can centrally track your migration journey from within the Azure Migrate project, across Azure and ISV tools.

**ISV**	| **Feature**
--- | ---
[Cloudamize](https://www.cloudamize.com/platform) | Assess
[Device 42](https://docs.device42.com/) | Assess
[Turbonomic](https://learn.turbonomic.com/azure-migrate-portal-free-trial) | Assess
[UnifyCloud](https://www.cloudatlasinc.com/cloudrecon/) | Assess
[Corent Technology](https://www.corenttech.com/AzureMigrate/) | Assess and migrate
[Carbonite](https://www.carbonite.com/globalassets/files/datasheets/carb-migrate4azure-microsoft-ds.pdf) | Migrate
[Lakeside](https://go.microsoft.com/fwlink/?linkid=2104908) | Assess

### Selecting an ISV tool

After adding an ISV tool to an Azure Migrate project, get started with the tool by obtaining a license, or signing up for a free trial, in accordance with the ISV policy. In each tool, there's an option to connect to Azure Migrate. Follow the tool instructions and documentation, to connect the tool with Azure Migrate. Licensing for ISV tools is in accordance with the ISV licensing model.

## Microsoft tools for migration of servers

### Azure Migrate Server Assessment

Azure Migrate Server Assessment discovers and assesses on-premises VMware VMs and Hyper-V VMs, for migration to Azure. It helps you identify the following:

- **Azure readiness:** Assess whether on-premises machines are ready for migration to Azure.
- **Azure sizing:** Estimate the size of Azure VMs after migration.
- **Azure cost estimation:** Estimates costs for running on-premises servers in Azure.
- **Dependency visualization:** Identify cross-server dependencies, and the best way to move dependent servers to Azure.

Server Assessment uses a lightweight appliance that you deploy on-premises, and register with Server Assessment.

- The appliance discovers on-premises machines, connects to Server Assessment, and continually sends metadata and performance-related data to Azure Migrate.
- Discovery is agentless. Nothing needs to be installed on discovered VMs.
- After machines are discovered, you gather them into groups that typically consist of VMs you'd like to migrate together.
- You create an assessment for a group. You can then analyze the assessment, to figure out your migration strategy.

### Azure Migrate Server Migration

Azure Migrate Server Migration helps you to migrate on-premises VMware VMs, Hyper-V VMs, physical servers, other virtualized machines, and public cloud VMs, to Azure. You can migrate machines after assessing them, or without an assessment.

## Microsoft tools for migration of databases

### Azure Migrate Database Assessment

Azure Migrate integrates with Data Migration Assistant (DMA) to assess on-premises SQL Server databases for migration to Azure SQL DB, Azure SQL Managed Instance, or Azure VMs running SQL Server. DMA provides information about potential blocking issues for migration. It identifies unsupported features, as well as new features that you can benefit from after migration, and helps you to identify the right path for database migration. [Learn more](https://docs.microsoft.com/sql/dma/dma-overview?view=sql-server-2017).

### Azure Migrate Database Migration

Azure Migrate integrates with the Azure Database Migration Service (DMS), to migrate on-premises databases to Azure. Use DMS to migrate on-premises databases to Azure VMs running SQL, Azure SQL DB, and Azure SQL Managed Instances. [Learn more](https://docs.microsoft.com/azure/dms/dms-overview).

## Microsoft tool for migration of web applications

### Azure App Service Migration Assistant

From the Azure Migrate hub, you can assess and migrate on-premises web apps to Azure.

- **Assess web apps online**: Use Azure App Service Migration Assistant to assess on-premises websites for migration to Azure App Service.
- **Migrate web apps**: Migrate .NET and PHP web apps to Azure, using Azure App Service Migration Assistant.

[Learn more.](https://appmigration.microsoft.com/)

## Microsoft tool for offline data migration

You can use the Data Box offline family of products to move large amounts of data to Azure. [Learn more](https://docs.microsoft.com/azure/databox/)

## Next steps

- Try out our tutorials to assess [VMware VMs](tutorial-assess-vmware.md) and [Hyper-V VMs](tutorial-assess-hyper-v.md).
- [Learn more](https://azure.microsoft.com/pricing/details/azure-migrate/) about Azure Migrate pricing.
- [Review frequently asked questions](resources-faq.md) about Azure Migrate.
