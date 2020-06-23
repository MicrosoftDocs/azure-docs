---
title: About Azure Migrate 
description: Learn about the Azure Migrate service.
ms.topic: overview
ms.date: 04/15/2020
ms.custom: mvc
---

# About Azure Migrate

This article provides a quick overview of the Azure Migrate service.

Azure Migrate provides a centralized hub to assess and migrate to Azure on-premises servers, infrastructure, applications, and data. It provides the following:

- **Unified migration platform**: A single portal to start, run, and track your migration to Azure.
- **Range of tools**: A range of tools for assessment and migration. Azure Migrate tools include Server Assessment and Azure Migrate: Server Migration. Azure Migrate also integrates with other Azure services and tools, and with independent software vendor (ISV) offerings.
- **Assessment and migration**: In the Azure Migrate hub, you can assess and migrate:
    - **Servers**: Assess on-premises servers and migrate them to Azure virtual machines.
    - **Databases**: Assess on-premises databases and migrate them to Azure SQL Database or to SQL Managed Instance.
    - **Web applications**: Assess on-premises web applications and migrate them to Azure App Service by using the Azure App Service Migration Assistant.
    - **Virtual desktops**: Assess your on-premises virtual desktop infrastructure (VDI) and migrate it to Windows Virtual Desktop in Azure.
    - **Data**: Migrate large amounts of data to Azure quickly and cost-effectively using Azure Data Box products.

## Integrated tools

The Azure Migrate hub includes these tools:

**Tool** | **Assess and migrate** | **Details**
--- | --- | ---
**Azure Migrate: Server Assessment** | Assess servers. | Discover and assess on-premises VMware VMs, Hyper-V VMs, and physical servers in preparation for migration to Azure.
**Azure Migrate: Server Migration** | Migrate servers. | Migrate VMware VMs, Hyper-V VMs, physical servers, other virtualized machines, and public cloud VMs to Azure.
**Data Migration Assistant** | Assess SQL Server databases for migration to Azure SQL Database, Azure SQL Managed Instance, or Azure VMs running SQL Server. | Data Migration Assistant helps pinpoint potential problems blocking migration. It identifies unsupported features, new features that can benefit you after migration, and the right path for database migration. [Learn more](https://docs.microsoft.com/sql/dma/dma-overview?view=sql-server-2017).
**Azure Database Migration Service** | Migrate on-premises databases to Azure VMs running SQL Server, Azure SQL Database, or SQL Managed Instances. | [Learn more](https://docs.microsoft.com/azure/dms/dms-overview) about Database Migration Service.
**Movere** | Assess servers. | [Learn more](#movere) about Movere.
**Web app migration assistant** | Assess on-premises web apps and migrate them to Azure. |  Use Azure App Service Migration Assistant to assess on-premises websites for migration to Azure App Service.<br/><br/> Use Migration Assistant to migrate .NET and PHP web apps to Azure. [Learn more](https://appmigration.microsoft.com/) about Azure App Service Migration Assistant.
**Azure Data Box** | Migrate offline data. | Use Azure Data Box products to move large amounts of offline data to Azure. [Learn more](https://docs.microsoft.com/azure/databox/).

> [!NOTE]
> If you're in Azure Government, external integrated tools and ISV offerings can't send data to Azure Migrate projects. You can use tools independently.

## ISV integration

Azure Migrate integrates with several ISV offerings. 

**ISV**    | **Feature**
--- | ---
[Carbonite](https://www.carbonite.com/globalassets/files/datasheets/carb-migrate4azure-microsoft-ds.pdf) | Migrate servers.
[Cloudamize](https://www.cloudamize.com/platform) | Assess servers.
[Corent Technology](https://www.corenttech.com/AzureMigrate/) | Assess and migrate servers.
[Device42](https://docs.device42.com/) | Assess servers.
[Lakeside](https://go.microsoft.com/fwlink/?linkid=2104908) | Assess VDI.
[RackWare](https://go.microsoft.com/fwlink/?linkid=2102735) | Migrate servers.
[Turbonomic](https://learn.turbonomic.com/azure-migrate-portal-free-trial) | Assess servers.
[UnifyCloud](https://www.cloudatlasinc.com/cloudrecon/) | Assess servers and databases.

## Azure Migrate: Server Assessment tool

The Azure Migrate: Server Assessment tool discovers and assesses on-premises VMware VMs, Hyper-V VMs, and physical servers for migration to Azure.

Here's what the tool does:

- **Azure readiness**: Assesses whether on-premises machines are ready for migration to Azure.
- **Azure sizing**: Estimates the size of Azure VMs after migration.
- **Azure cost estimation**: Estimates costs for running on-premises servers in Azure.
- **Dependency analysis**: Identifies cross-server dependencies and optimization strategies for moving interdependent servers to Azure. Learn more about Server Assessment with [dependency analysis](concepts-dependency-visualization.md).

Server Assessment uses a lightweight [Azure Migrate appliance](migrate-appliance.md) that you deploy on-premises.

- The appliance runs on a VM or physical server. You can install it easily using a downloaded template.
- The appliance discovers on-premises machines. It also continually sends machine metadata and performance data to Azure Migrate.
- Appliance discovery is agentless. Nothing is installed on discovered machines.
- After appliance discovery, you can gather discovered machines into groups and run assessments for each group.

## Azure Migrate: Server Migration tool

The Azure Migrate: Server Migration tool helps you migrate to Azure:

**Migrate** | **Details**
--- | ---
On-premises VMware VMs | Migrate VMs to Azure using agentless or agent-based migration.<br/><br/> For agentless migration, Server Migration uses an Azure Migrate appliance that you deploy on-premises. It's the same type of appliance you use for Server Assessment.<br/><br/> For agent-based migration, Server Assessment uses a replication appliance.
On-premises Hyper-V VMs | Migrate VMs to Azure.<br/><br/> Server Assessment uses provider agents installed on Hyper-V host for the migration.
On-premises physical servers | You can migrate physical machines to Azure. You can also migrate other virtualized machines, and VMs from other public clouds, by treating them as virtual machines for the purpose of migration. | Server Assessment uses a replication appliance for the migration.


## Selecting assessment and migration tools

In the Azure Migrate hub, you select the tool you want to use for assessment or migration and add it to an Azure Migrate project. If you add an ISV tool or Movere:

- To get started, obtain a license or sign up for a free trial by following the tool instructions. Each ISV or tool specifies tool licensing.
- Each tool has an option to connect to Azure Migrate. Follow the tool instructions to connect.
- Track your migration across all tools from within the Azure Migrate project.

## Movere

Movere is a software as a service (SaaS) platform. It increases business intelligence by accurately presenting entire IT environments within a single day. Organizations and enterprises grow, change, and digitally optimize. As they do so, Movere provides them with the needed confidence to see and control their environments, whatever the platform, application, or geography.

Microsoft [acquired](https://azure.microsoft.com/blog/microsoft-acquires-movere-to-help-customers-unlock-cloud-innovation-with-seamless-migration-tools/) Movere, and it's no longer sold as a standalone offer. Movere is available through Microsoft Solution Assessment and Microsoft Cloud Economics Program. [Learn more](https://www.movere.io) about Movere.

We encourage you to also look at Azure Migrate, our built-in migration service. Azure Migrate provides a central hub to simplify your cloud migration. The hub comprehensively supports workloads like physical and virtual servers, databases, and applications. End-to-end visibility lets you easily track progress throughout discovery, assessment, and migration.

With both Azure and partner ISV tools built in, Azure Migrate has an extensive range of features, including:

- Discovery of virtual and physical servers.
- Performance-based rightsizing.
- Cost planning.
- Import-based assessments.
- Dependency analysis of agentless applications.

If you're looking for expert help to get started, Microsoft has skilled [Azure Expert Managed Service Providers](https://azure.microsoft.com/partners) to guide you. Check out the [Azure Migrate website](https://azure.microsoft.com/services/azure-migrate/). 

## Azure Migrate versions

There are two versions of the Azure Migrate service.

- **Current version**: Use this version to create Azure Migrate projects, discover on-premises machines, and orchestrate assessments and migrations. [Learn more](whats-new.md) about what's new in this version.
- **Previous version**: The previous version of Azure Migrate supports only assessment of on-premises VMware VMs. If you used the previous version, you should now use the current version. You can no longer create Azure Migrate projects using the previous version. And we recommend that you don't do new discoveries with it.

    To access existing projects in the Azure portal, search for and select **Azure Migrate**. The **Azure Migrate** dashboard has a notification and a link to access old Azure Migrate projects.

## Next steps

- Try our tutorials to assess [VMware VMs](tutorial-prepare-vmware.md), [Hyper-V VMs](tutorial-prepare-hyper-v.md), or [physical servers](tutorial-prepare-physical.md).
- [Review frequently asked questions](resources-faq.md) about Azure Migrate.
