---
title: About Azure Migrate 
description: Learn about the Azure Migrate service.
author: Vikram1988
ms.author: vibansa
ms.manager: abhemraj
ms.topic: overview
ms.service: azure-migrate
ms.date: 09/26/2024
ms.custom: mvc, engagement-fy25
---

# Azure Migrate Overview

Azure Migrate is a service that helps you decide, plan, and execute your migration to Azure. Azure Migrate helps you find the best migration path, assess for Azure readiness and cost of hosting workloads on Azure, and perform the migration with minimal downtime and risk. Azure Migrate provides support for servers, databases, web apps, virtual desktops, and large-scale offline migration using databox.  

## What is Azure Migrate? 

Azure Migrate provides a simplified migration, modernization, and optimization service for customers who are looking at migrating their on-premises workloads to Azure. This tool provides you with a one stop solution to discover, generate business case, assess, right-size, and eventually migrate your infrastructure, data, and web application workloads. A general migration journey includes the following phases:

:::image type="content" source="./media/migrate-services-overview/migrate-journey.png" alt-text="Screenshot that shows the migration journey." lightbox="./media/migrate-services-overview/migrate-journey.png":::

- **Decide**: The first step in a migration journey is to identify your workloads. This process of identification is known as discovery. To discover your workloads, you can deploy a light-weight [Azure Migrate appliance](migrate-appliance.md) (recommended approach) or quickly import the inventory data for your workloads. The Azure Migrate appliance is a virtual appliance that can be deployed on a server on your datacenter. The appliance collects the configuration and performance data for your servers and continually sends it over to Azure Migrate Service. Once the inventory of workloads is identified, you can create a business case to make your decision to migrate to Azure.  

- **Business case** helps you decide if you should migrate your on-premises workloads to Azure, by estimating the costs and savings of moving to Azure. The business case helps you identify- 
  - On-premises vs Azure total cost of ownership
  - YoY comparison of cash flows
  - Resource utilization-based insights on Azure targets. 
  - Long-term cost reduction by switching from a capital expenditure (Capex) model to an Operating expenditure (Opex) model. Learn more about [business case](concepts-business-case-calculation.md).

- **Plan**: Once the decision is made to migrate to Azure, the next important phase is planning of migration. To plan migration in detail you can  assess your discovered workloads using Azure Migrate assessments to find the readiness, right-sized targets, configuration of the target Azure resources, cost of hosting target resources on Azure, and migration guidance. 
  - **Azure readiness**: Assesses whether on-premises servers, SQL Servers, and web apps are ready for migration to Azure.
  - **Right** **sizing**: Estimates the size of Azure VMs/Azure SQL configuration/number of Azure VMware Solution nodes after migration.
  - **Azure cost estimation**: Estimates costs for running on-premises servers in Azure.
  - **Dependency Analysis:** Dependency analysis helps you understand the network dependencies between servers in your datacenter so that you can make high confidence migration plans without missing any critical dependency during migration. Learn more about [dependency analysis](concepts-dependency-visualization.md).
    
- **Execute**: In this phase, you perform the migration or modernization of your workloads to move to Azure. You can use the Azure Migrate service or partner tools to migrate your servers, databases, web apps, or virtual desktops with minimal downtime and risk. You can migrate the following workloads using the integrated migration tool.

  | **Migrate** | **Details** |
  |---|---|
  | **On-premises VMware VMs** | Migrate VMs to Azure using agentless or agent-based migration.<br><br>For agentless migration, the **Migration and modernization tool** uses the same appliance, used for discovery and assessment of servers.<br><br>For agent-based migration, the Migration and modernization tool uses a replication appliance. |
  | **On-premises Hyper-V VMs** | Migrate VMs to Azure.<br><br>The **Migration and modernization tool** uses provider agents installed on Hyper-V host for the migration. |
  | **On-premises physical servers or servers hosted on other clouds** | You can migrate physical servers to Azure. You can also migrate other virtualized servers, and VMs from other public clouds, by treating them as physical servers for the purpose of migration. The Migration and modernization tool uses a replication appliance for the migration. |
  | **Web apps hosted on Windows OS in a VMware environment** | You can perform agentless migration of ASP.NET web apps at-scale to [Azure App Service](https://azure.microsoft.com/services/app-service/) using Azure Migrate. |

Azure Migrate provides support for end-to-end migration of your workloads to Azure at each phase mentioned above. 


## Why use Azure Migrate?

Azure Migrate offers multiple benefits for your cloud migration journey, such as:

- **Unified migration platform**: A single portal to start, run, and track your migration to Azure. The unified platform supports discovery, assessment, and migration of variety of workloads like servers, databases, and Web applications.

- **Free tool**: Azure Migrate is a free self-service tool that you can use to identify your inventory of workloads, assess them for multiple IaaS and PaaS Azure targets, develop plan for their migration, and finally migrate them using in-product, first-party, and partner migration tools (Partner tools might charge you for using their services). 

- **Range of tools**: Azure Migrate has tools for assessment and migration which includes Azure Migrate: Discovery and assessment and Migration and modernization.  

- **Assessment, migration, and modernization**: In the Azure Migrate hub, you can assess, migrate, and modernize:

  - **Servers, databases and web apps**: Assess on-premises servers including web apps and SQL Server instances and migrate them to Azure.

  - **Databases**: Assess on-premises SQL Server instances and databases to migrate them to an SQL Server on an Azure VM or an Azure SQL Managed Instance or to an Azure SQL Database.

  - **Web applications**: Assess on-premises web applications and migrate them to Azure App Service and Azure Kubernetes Service.

  - **Data**: Migrate large amounts of data to Azure quickly and cost-effectively using Azure Data Box products.
 
### Integrated tools

Azure Migrate has a suite of the following tools integrated within the product: 

| **Tool** | **Assess and migrate** | **Details** |
|---|---|---|
| **Azure Migrate: Discovery and assessment** | Discover and assess servers including SQL and web apps | Discover and assess on-premises servers running on VMware, Hyper-V, and physical servers in preparation for migration to Azure. |
| **Migration and modernization** | Migrate servers | Migrate VMware VMs, Hyper-V VMs, physical servers, other virtualized servers, and public cloud VMs to Azure. |
| **Data Migration Assistant** | Assess SQL Server databases for migration to Azure SQL Database, Azure SQL Managed Instance, or Azure VMs running SQL Server. | Data Migration Assistant is a stand-alone tool to assess SQL Servers. It helps pinpoint potential problems blocking migration. It finds unsupported features, new features that can benefit you after migration, and the right path for database migration. [Learn more](/sql/dma/dma-overview). |
| **Azure Database Migration Service** | Migrate on-premises databases to Azure VMs running SQL Server, Azure SQL Database, or SQL Managed Instances | [Learn more](/azure/dms/dms-overview) about Database Migration Service. |
| **Web app migration assistant** | Assess on-premises web apps and migrate them to Azure. | Azure App Service Migration Assistant is a standalone tool to assess on-premises websites for migration to Azure App Service.<br><br>Use Migration Assistant to migrate .NET and PHP web apps to Azure. [Learn more](https://appmigration.microsoft.com/) about Azure App Service Migration Assistant. |
| **Azure Data Box** | Migrate offline data | Use Azure Data Box products to move large amounts of offline data to Azure. [Learn more](/azure/databox/). |
| **Movere** | Deprecated | Use Azure Migrate for your migration journey. |

#### ISV integration

**ISV**    | **Feature**
--- | ---
[Carbonite](https://www.carbonite.com/data-protection-resources/resource/Datasheet/carbonite-migrate-for-microsoft-azure) | Migrate servers.
[Cloudamize](https://www.cloudamize.com/platform) | Assess servers.
[CloudSphere](https://go.microsoft.com/fwlink/?linkid=2157454) | Assess servers.
[Corent Technology](https://www.corenttech.com/AzureMigrate/) | Assess and migrate servers.
[Device42](https://docs.device42.com/) | Assess servers.
[Lakeside](https://go.microsoft.com/fwlink/?linkid=2104908) | Assess VDI.
[RackWare](https://go.microsoft.com/fwlink/?linkid=2102735) | Migrate servers.
[Turbonomic](https://go.microsoft.com/fwlink/?linkid=2094295) | Assess servers.
[UnifyCloud: CloudRecon](https://www.cloudatlasinc.com/cloudrecon/) | Assess servers and databases.
[Zerto](https://go.microsoft.com/fwlink/?linkid=2152102) | Migrate servers.

## Next steps
- Try our tutorials to discover [VMware VMs](./tutorial-discover-vmware.md), [Hyper-V VMs](./tutorial-discover-hyper-v.md), or [physical servers](./tutorial-discover-physical.md).
- [Review frequently asked questions](resources-faq.md) about Azure Migrate.