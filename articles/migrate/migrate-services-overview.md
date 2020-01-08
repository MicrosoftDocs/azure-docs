---
title: About Azure Migrate 
description: Learn about the Azure Migrate service.
ms.topic: overview
ms.date: 12/29/2019
ms.custom: mvc
---


# About Azure Migrate

This article provides a quick overview of the Azure Migrate service.

Use Azure Migrate to migrate to Azure. Azure Migrate provides a centralized hub to assess and migrate on-premises infrastructure, applications, and data to Azure, with the following features:

- **Unified migration platform**: A single portal to start, run, and track your migration journey to Azure.
- **Range of tools**: A range of tools for assessment and migration. The hub includes Azure Migrate: Server Assessment and Azure Migrate: Server Migration. It integrates with other Azure services, and with other tools and independent software vendor (ISV) offerings.
- **Assessment and migration**: In the Azure Migrate hub you can assess and migrate:
    - **Servers**: Assess and migrate on-premises servers to Azure VMs.
    - **Databases**: Assess and migrate on-premises databases to Azure SQL DB, or to Azure SQL Managed Instance.
    - **Web applications**: Assess and migrate on-premises web applications to Azure App Service, using the Azure App Service Assistant.
    - **Virtual desktops**: Assess and migrate your on-premises virtual desktop infrastructure (VDI) to Windows Virtual Desktop in Azure.
    - **Data**: Migrate large amounts of data to Azure quickly and cost-effectively, using Azure Data Box products. 


## Integrated tools

The Azure Migrate hub provides the following tools.

**Tool** | **Assess/Migrate** | **Details**
--- | --- | ---
**Azure Migrate: Server Assessment** | Assess servers | Discover and assess on-premises VMware VMs, Hyper-V VMs,and physical servers, to figure out whether they're ready for migration to Azure.
**Azure Migrate: Server Migration** | Migrate servers | Migrate VMware VMs, Hyper-V VMs, physical servers, as well as other virtualized machines, and public cloud VMs, to Azure. 
**Database Migration Assistant (DMA)** | Assess on-premises SQL Server databases for migration to Azure SQL DB, Azure SQL Managed Instance, or Azure VMs running SQL Server. | DMA provides information about potential blocking issues for migration. It identifies unsupported features, as well as new features that you can benefit from after migration, and helps you to identify the right path for database migration. [Learn more](https://docs.microsoft.com/sql/dma/dma-overview?view=sql-server-2017).
**Database Migration Service (DMS)** | Migrate on-premises databases to Azure VMs running SQL, Azure SQL DB, and Azure SQL Managed Instances. | [Learn more](https://docs.microsoft.com/azure/dms/dms-overview) about DMS.
**Movere** | Assess servers | [Learn more](#movere) about Movere.
**Web App Migration Assistant** | Assess and migrate on-premises web apps to Azure. |  Use the Azure App Service Migration Assistant to assess on-premises websites for migration to Azure App Service.<br/><br/> Migrate .NET and PHP web apps to Azure, using Azure App Service Migration Assistant. [Learn more](https://appmigration.microsoft.com/) about the Assistant.
**Azure Data Box** | Offline data migration. | Use Azure Data Box products to move large amounts of data offline to Azure. [Learn more](https://docs.microsoft.com/azure/databox/).

## ISV integration

Azure Migrate integrates with a number of ISV offerings. 

**ISV**	| **Feature**
--- | ---
[Carbonite](https://www.carbonite.com/globalassets/files/datasheets/carb-migrate4azure-microsoft-ds.pdf) | Migrate servers
[Cloudamize](https://www.cloudamize.com/platform) | Assess servers
[Corent Technology](https://www.corenttech.com/AzureMigrate/) | Assess and migrate servers
[Device 42](https://docs.device42.com/) | Assess servers
[Lakeside](https://go.microsoft.com/fwlink/?linkid=2104908) | Assess VDI
[RackWare](https://go.microsoft.com/fwlink/?linkid=2102735) | Migrate servers
[Turbonomic](https://learn.turbonomic.com/azure-migrate-portal-free-trial) | Assess servers
[UnifyCloud](https://www.cloudatlasinc.com/cloudrecon/) | Assess servers and databases


## Azure Migrate: Server Assessment tool

The Azure Migrate: Server Assessment tool discovers and assesses on-premises VMware VMs, Hyper-V VMs,and physical servers, for migration to Azure. It helps you identify the following:

- **Azure readiness:** Assess whether on-premises machines are ready for migration to Azure.
- **Azure sizing:** The estimated size of Azure VMs after migration.
- **Azure cost estimation:** Estimated costs for running on-premises servers in Azure.
- **Dependency visualization:** If you use Server Assessment with dependency visualization, you can effectively identify cross-server dependencies, and optimum ways to move dependent servers to Azure.

Server Assessment uses a lightweight appliance that you deploy on-premises, and register with Server Assessment.

- The appliance runs on a physical server or VM, and is easily installed using a downloaded template.
- The appliance discovers on-premises machines, and continually sends machines metadata and performance data to Azure Migrate.
- Appliance discovery is agentless. Nothing needs to be installed on discovered machines.
- After discovery, you gather discovered machines into groups, and assess groups for migration.


## Azure Migrate: Server Migration tool

The Azure Migrate: Server Migration tool helps you to migrate on-premises VMware VMs, Hyper-V VMs, physical servers, other virtualized machines, and public cloud VMs to Azure. You can migrate machines after assessing them, or migrate them without an assessment.


## Select a tool

In the Azure Migrate hub, you select the tool you want to use for assessment, and add it to an Azure Migrate project. If you add an ISV tool or Movere:

- Get started by obtaining a license, or signing up for a free trial, in accordance with the tool instructions. Tools licensing is determined by the ISV/tool. 
- In each tool, there's an option to connect to Azure Migrate. Follow instructions to connect.
- Track your migration journey from within the Azure Migrate project, across all tools.


## Movere

Movere is a SaaS platform that increases business intelligence by accurately presenting entire IT environments within a single day. As organizations grow, change, and digitally optimize, the solution provides enterprises with the confidence they need to have visibility and control of their environments regardless of platform, application or geography. Movere was [acquired](https://azure.microsoft.com/blog/microsoft-acquires-movere-to-help-customers-unlock-cloud-innovation-with-seamless-migration-tools/) by Microsoft and is no longer sold as a standalone offer.  Movere is available through the Microsoft Solution Assessment and Cloud Economics Programs. [Learn more](https://www.movere.io) about Movere. If you have questions, submit them to: movereq@microsoft.com or contact your Microsoft representative.

We encourage you to also look at Azure Migrate, our built-in migration service. Azure Migrate provides a central hub to simplify your migration to the cloud. The hub features comprehensive support for different workloads, including physical and virtual servers, databases, and applications. End-to-end visibility makes it easy to track progress throughout discovery, assessment, and migration. With both Azure and partner ISV tools built in, Azure Migrate also has an extensive range of features, including virtual and physical server discovery, performance-based right sizing, cost planning, import-based assessments, and agentless application dependency analysis. If you’re looking for expert help to get started, Microsoft has skilled [Azure Expert Managed Service Provider](https://azure.microsoft.com/partners) to guide you along the journey. Check out the [Azure Migrate website](https://azure.microsoft.com/services/azure-migrate/). 
 

## Azure Migrate versions

There are two versions of the Azure Migrate service:

- **Current version**: Use this version to create Azure Migrate projects, discover on-premises machines, and orchestrate assessments and migrations. [Learn more](whats-new.md) about what's new in this version.
- **Previous version**: If you used the previous version of Azure Migrate (only assessment of on-premises VMware VMs was supported), you should now use the current version. You can no longer create Azure Migrate projects using the previous version, and we recommend that you don't perform new discoveries. To access existing projects, in the Azure portal, search for and select **Azure Migrate**. On the **Azure Migrate** dashboard, there's a notification and a link to access old Azure Migrate projects.



## Next steps

- Try our tutorials to assess [VMware VMs](tutorial-prepare-vmware.md), [Hyper-V VMs](tutorial-prepare-hyper-v.md), and [physical servers](tutorial-prepare-physical.md).
- [Review frequently asked questions](resources-faq.md) about Azure Migrate.
