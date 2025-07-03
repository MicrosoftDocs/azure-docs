---
title: About Azure Migrate 
description: Learn about the Azure Migrate service.
author: Vikram1988
ms.author: vibansa
ms.manager: abhemraj
ms.topic: overview
ms.service: azure-migrate
ms.date: 03/20/2025
ms.custom: mvc, engagement-fy25
# Customer intent: "As an IT manager, I want to utilize Azure Migrate to assess and execute the migration of our on-premises workloads to Azure, so that I can minimize downtime and ensure a cost-effective and efficient transition to the cloud."
---

# What is Azure Migrate?

Azure Migrate is a service that helps you decide on, plan, and execute your migration to Azure. Azure Migrate helps you find the best migration path, assess for Azure readiness and cost of hosting workloads on Azure, and perform the migration with minimal downtime and risk. Azure Migrate provides support for servers, databases, web apps, virtual desktops, and large-scale offline migration by using Azure Data Box.

> [!NOTE]
> *Azure Migrate Classic* is the classic Azure Migrate experience where you can discover, plan, and migrate workloads. This view doesn't support application and cross-workload views.

## Migration phases

Azure Migrate provides a simplified migration, modernization, and optimization service for customers who want to migrate their on-premises workloads to Azure. It gives you a one-stop solution for migrating your infrastructure, data, and web application workloads.

A general migration journey includes the following phases. Azure Migrate provides support at each phase.

:::image type="content" source="./media/migrate-services-overview/migrate-journey.png" alt-text="Screenshot that shows the phases of migrating workloads to Azure." lightbox="./media/migrate-services-overview/migrate-journey.png":::

### Decide

The first step in a migration journey is to identify your workloads. This process of identification is called *discovery*. To discover your workloads, you can deploy a lightweight [Azure Migrate appliance](migrate-appliance.md) (recommended approach) or quickly import the inventory data for your workloads.

The Azure Migrate appliance is a virtual appliance that can be deployed on a server in your datacenter. The appliance collects the configuration and performance data for your servers and continually sends it to the Azure Migrate service.

After you identify the inventory of workloads, you can create a *business case* to make your decision to migrate your on-premises workloads to Azure. A business case helps you estimate the costs and savings of moving to Azure. It helps you identify:
  
- Total cost of ownership for on-premises versus Azure.
- Year-over-year comparison of cash flows.
- Resource utilization-based insights on Azure targets.
- Long-term cost reduction by switching from a capital expenditure (CapEx) model to an operating expenditure (OpEx) model.

[Learn more about business cases](concepts-business-case-calculation.md).

### Plan

After you make the decision to migrate to Azure, the next important phase of migration is planning. To plan migration in detail, use Azure Migrate assessments to find:

- **Azure readiness**: Assess whether on-premises servers, SQL servers, and web apps are ready for migration to Azure.
- **Right-sizing**: Estimate the size of Azure virtual machines (VMs), the Azure SQL configuration, and the number of Azure VMware Solution nodes after migration.
- **Azure cost estimation**: Estimate costs for running on-premises servers in Azure.
- **Dependency analysis**: Understand the network dependencies between servers in your datacenter so that you can make high-confidence migration plans without missing any critical dependency. [Learn more about dependency analysis](concepts-dependency-visualization.md).

### Execute

In the execution phase, you perform the migration or modernization of your workloads to move to Azure. You can use the Azure Migrate service or partner tools to migrate your servers, databases, web apps, or virtual desktops with minimal downtime and risk.

You can migrate the following workloads by using the integrated Azure Migrate and Modernize tool:

| Workload | Details |
|---|---|
| On-premises VMware VMs | Migrate VMs to Azure by using agentless or agent-based migration.<br><br>For agentless migration, the Azure Migrate and Modernize tool uses the same appliance that's used for discovery and assessment of servers.<br><br>For agent-based migration, the Azure Migrate and Modernize tool uses a replication appliance. |
| On-premises Hyper-V VMs | Migrate VMs to Azure.<br><br>The Azure Migrate and Modernize tool uses provider agents installed on a Hyper-V host for the migration. |
| On-premises physical servers or servers hosted on other clouds | Migrate physical servers to Azure. You can also migrate other virtualized servers, and VMs from other public clouds, by treating them as physical servers for the purpose of migration. The Azure Migrate and Modernize tool uses a replication appliance for the migration. |
| Web apps hosted on Windows in a VMware environment | Perform agentless migration of ASP.NET web apps at scale to [Azure App Service](https://azure.microsoft.com/services/app-service/) by using Azure Migrate. |

## Benefits of Azure Migrate

Azure Migrate offers these benefits for your cloud migration journey:

- **Unified migration platform**: You use a single portal to start, run, and track your migration to Azure. The unified platform supports discovery, assessment, and migration of variety of workloads, like servers, databases, and web applications.

- **Free service**: Azure Migrate is a free service that you can use to:

  1. Identify your inventory of workloads.
  1. Assess workloads for multiple infrastructure as a service (IaaS) and platform as a service (PaaS) Azure targets.
  1. Develop a plan for migration.
  1. Migrate the workloads by using in-product, Microsoft, and partner migration tools. (Partner tools might charge you for using their services.)

- **Range of tools**: Azure Migrate has tools for assessment and migration, as described [later in this article](#integrated-tools-and-features).  

- **Assessment, migration, and modernization**: In the Azure Migrate hub, you can assess, migrate, and modernize:

  - **Servers**: Assess on-premises servers and migrate them to Azure.

  - **Databases**: Assess on-premises SQL Server instances and databases to migrate them to a SQL server on an Azure VM, an Azure SQL managed instance, or an Azure SQL database.

  - **Web applications**: Assess on-premises web apps and migrate them to Azure App Service and Azure Kubernetes Service.

  - **Data**: Migrate large amounts of data to Azure quickly and cost-effectively by using Azure Data Box products.

::: moniker range="migrate-classic"
## Integrated tools and features

Azure Migrate includes the following integrated tools:

| Tool | Function | Details |
|---|---|---|
| Discovery and Assessment | Discover and assess servers, including servers for SQL and web apps. | Discover and assess on-premises servers running on VMware, Hyper-V, and physical servers in preparation for migration to Azure. |
| Migrate and Modernize | Migrate servers. | Migrate VMware VMs, Hyper-V VMs, physical servers, other virtualized servers, and public cloud VMs to Azure. |
|Data Migration Assistant | Assess SQL Server databases for migration to Azure SQL Database, Azure SQL Managed Instance, or Azure VMs running SQL Server. | Data Migration Assistant is a standalone tool to assess SQL servers. It helps pinpoint potential problems that block migration. It finds unsupported features, new features that can benefit you after migration, and the right path for database migration. [Learn more](/sql/dma/dma-overview). |
| Azure Database Migration Service | Migrate on-premises databases to Azure VMs running SQL Server, Azure SQL Database, or Azure SQL Managed Instance. | [Learn more about Database Migration Service](/azure/dms/dms-overview). |
| Azure App Service Migration Assistant | Assess on-premises web apps and migrate them to Azure. | Azure App Service Migration Assistant is a standalone tool to assess on-premises websites for migration to Azure App Service.<br><br>Use Migration Assistant to migrate .NET and PHP web apps to Azure. [Learn more](https://appmigration.microsoft.com/). |
| Azure Data Box | Migrate offline data. | Use Azure Data Box products to move large amounts of offline data to Azure. [Learn more](/azure/databox/). |
| Movere | Discover and assess on-premises workloads. | This tool is retired. Use Azure Migrate for your migration journey. |

The following features from software development companies (SDCs) are integrated into Azure Migrate:

| SDC | Function of feature |
| --- | --- |
| [Carbonite](https://www.carbonite.com/data-protection-resources/resource/Datasheet/carbonite-migrate-for-microsoft-azure) | Migrate servers. |
| [Cloudamize](https://www.cloudamize.com/platform) | Assess servers. |
| [CloudSphere](https://go.microsoft.com/fwlink/?linkid=2157454) | Assess servers. |
| [Corent](https://www.corenttech.com/AzureMigrate/) | Assess and migrate servers. |
| [Device42](https://docs.device42.com/) | Assess servers. |
| [Lakeside](https://go.microsoft.com/fwlink/?linkid=2104908) | Assess virtual desktop infrastructure. |
| [RackWare](https://go.microsoft.com/fwlink/?linkid=2102735) | Migrate servers. |
| [Turbonomic](https://go.microsoft.com/fwlink/?linkid=2094295) | Assess servers. |
| [CloudRecon](https://www.cloudatlasinc.com/cloudrecon/) | Assess servers and databases. |
| [Zerto](https://go.microsoft.com/fwlink/?linkid=2152102) | Migrate servers. |
::: moniker-end

## Related content

- Try tutorials to discover [VMware VMs](./tutorial-discover-vmware.md), [Hyper-V VMs](./tutorial-discover-hyper-v.md), or [physical servers](./tutorial-discover-physical.md).
- Review [frequently asked questions about Azure Migrate](resources-faq.md).
- Learn about the [Azure VMware Solution landing zone accelerator](/azure/cloud-adoption-framework/scenarios/azure-vmware/enterprise-scale-landing-zone).
