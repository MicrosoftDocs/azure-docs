---
title: Build a Business case with Azure Migrate | Microsoft Docs
description: Describes how to build a Business case with Azure Migrate
author: rashi-ms
ms.author: rajosh
ms.manager: ronai
ms.service: azure-migrate
ms.topic: how-to
ms.date: 01/17/2023
ms.custom: engagement-fy23

---



# Build a business case (preview)

This article describes how to build a Business case for on-premises servers and workloads in your datacenter with Azure Migrate: Discovery and assessment tool.

[Azure Migrate](migrate-services-overview.md) helps you to plan and execute migration and modernization projects to Azure. Azure Migrate provides a centralized hub to track discovery, assessment, and migration of on-premises infrastructure, applications, and data to Azure. The hub provides Azure tools for assessment and migration, and third-party independent software vendor (ISV) offerings.

## Prerequisites

- Make sure you've [created](./create-manage-projects.md) an Azure Migrate project. You can also reuse an existing project to use this capability.
- Once you've created a project, the Azure Migrate: Discovery and assessment tool is automatically [added](how-to-assess.md) to the project.
- Before you build the Business case, you need to first discover your IT estate. You can choose one of the two discovery sources based on your use case:

    **Discovery Source** | **Details** | **Migration strategies that can be used to build a business case**
    --- | --- | ---
    Use more accurate data insights collected via **Azure Migrate appliance** | You need to set up an Azure Migrate appliance for [VMware](how-to-set-up-appliance-vmware.md) or [Hyper-V](how-to-set-up-appliance-hyper-v.md) or [Physical/Bare-metal or other clouds](how-to-set-up-appliance-physical.md). The appliance discovers servers, SQL Server instance and databases, and ASP.NET webapps and sends metadata and performance (resource utilization) data to Azure Migrate. [Learn more](migrate-appliance.md). | Azure recommended to minimize cost, Migrate to all IaaS (Infrastructure as a Service), Modernize to PaaS (Platform as a Service)
    Build a quick business case using the **servers imported via a .csv file** | You need to provide the server inventory in a [.CSV file and import in Azure Migrate](tutorial-discover-import.md) to get a quick business case based on the provided inputs. You don't need to set up the Azure Migrate appliance to discover servers for this option. | Migrate to all IaaS (Infrastructure as a Service)

## Business case overview

The Business case capability helps you build a business proposal to understand how Azure can bring the most value to your business. It highlights:

- On-premises vs Azure total cost of ownership.
- Year on year cashflow analysis.
- Resource utilization based insights to identify servers and workloads that are ideal for cloud.
- Quick wins for migration and modernization including end of support Windows OS and SQL versions.
- Long term cost savings by moving from a capital expenditure model to an Operating expenditure model, by paying for only what you use.

Other key features:

- Helps remove guess work in your cost planning process and adds data insights driven calculations.
- It can be generated in just a few clicks after you have performed discovery using the Azure Migrate appliance.
- The feature is automatically enabled for existing Azure Migrate projects.

There are three types of migration strategies that you can choose while building your Business case:

**Migration Strategy** | **Details** | **Assessment insights**
--- | --- | ---
**Azure recommended to minimize cost** | You can get the most cost efficient and compatible target recommendation in Azure across Azure IaaS and Azure PaaS targets. |  For SQL Servers, sizing and cost comes from the *Recommended report* with optimization strategy - minimize cost from Azure SQL assessment.<br/><br/> For web apps, sizing and cost comes from Azure App Service assessment is picked.<br/><br/> For general servers, sizing and cost comes from Azure VM assessment.
**Migrate to all IaaS (Infrastructure as a Service)** | You can get a quick lift and shift recommendation to Azure IaaS. | For SQL Servers, sizing and cost comes from the *Instance to SQL Server on Azure VM* report. <br/><br/> For general servers and servers hosting web apps, sizing and cost comes from Azure VM assessment.
**Modernize to PaaS (Platform as a Service)** | You can get a PaaS preferred recommendation that means, the logic identifies workloads best fit for PaaS targets.<br/><br/> General servers are recommended with a quick lift and shift recommendation to Azure IaaS. |  For SQL Servers, sizing and cost comes from the *Instance to Azure SQL MI* report.<br/><br/> For web apps, sizing and cost comes from Azure App Service assessment. <br/><br/> For general servers, sizing and cost comes from Azure VM assessment.<br/><br/> 

> [!Note]
> Although the Business case picks Azure recommendations from certain assessments, you won't be able to access the assessments directly. To deep dive into sizing, readiness and Azure cost estimates, you can create respective assessments for the servers or workloads.

## Build a business case

1. On the **Get started** page > **Servers, databases and web apps**, select **Discover, assess and migrate**.

    :::image type="content" source="./media/how-to-build-a-business-case/assess-inline.png" alt-text="Screenshot of the discover, assess and migrate servers button." lightbox="./media/how-to-build-a-business-case/assess-expanded.png":::

1. In **Azure Migrate: Discovery and assessment**, select **Build business case**.

    :::image type="content" source="./media/how-to-build-a-business-case/build-inline.png" alt-text="Screenshot of the Build Business case button." lightbox="./media/how-to-build-a-business-case/build-expanded.png":::

   We recommend that you wait at least a day after starting discovery before you build a Business case so that enough performance/resource utilization data points are collected. Also, review the **Notifications**/**Resolve issues** blades on the Azure Migrate hub to identify any discovery related issues prior to Business case computation. It ensures that the IT estate in your datacenter is represented more accurately and the Business case recommendations are more valuable.

1. In **Business case name**, specify a name for the Business case. Make sure the Business case name is unique within a project, else the previous Business case with the same name gets recomputed.

1. In **Target location**, specify the Azure region to which you want to migrate.

   Azure SKU size and cost recommendations are based on the location that you specify.

1. In **Discovery source**, specify the discovery source on which you wish to create the business case. The options to build the business case using data discovered via the  appliance or imported via a .csv file is present based on the type of discovered servers present in your project. The discovery source will be defaulted to the option chosen by you while building the business case and you won't be able to update this field later.

1. In **Migration strategy**, specify the migration strategy for your Business case:
    
    - With the default *Azure recommended approach to minimize cost*, you can get the most cost-efficient and compatible target recommendation in Azure across Azure IaaS and Azure PaaS targets.
    - With *Migrate to all IaaS (Infrastructure as a Service)*, you can get a quick lift and shift recommendation to Azure IaaS.
    - With *Modernize to PaaS (Platform as a Service)*, you can get cost effective recommendations for Azure IaaS and more PaaS preferred targets in Azure PaaS.
1. In **Savings options**, specify the savings options combination that you want to be considered while optimizing your Azure costs and maximize savings. Based on the availability of the savings option in the chosen region and the targets, the business case recommends the appropriate savings options to maximize your savings on Azure.
    - Choose 'Reserved Instance', if your datacenter comprises most consistently running resources.
    - Choose 'Reserved Instance + Azure Savings Plan', if you want additional flexibility and automated cost optimization for workloads applicable for Azure Savings Plan (Compute targets including Azure VM and Azure App Service).

1. In **Discount (%) on Pay as you go**, add any subscription-specific discounts you receive on top of the Azure offer. The default setting is 0%. The discount isn't applicable on top of reserved instance savings option.
1. **Currency** is defaulted to USD and can't be edited.
1. Review the chosen inputs, and select **Build business case**.

    :::image type="content" source="./media/how-to-build-a-business-case/build-button.png" alt-text="Screenshot of the button to initiate the Business case creation.":::

1. You're directed to the newly created Business case with a banner that says that your Business case is computing. The computation might take some time, depending on the number of servers and workloads in the project. You can come back to the Business case page after ~30 minutes and select **Refresh**.
    
    :::image type="content" source="./media/how-to-build-a-business-case/refresh-inline.png" alt-text="Screenshot of the refresh button to refresh the Business case." lightbox="./media/how-to-build-a-business-case/refresh-expanded.png":::
    
## Next steps
- [Learn more](how-to-view-a-business-case.md) about how to review the Business case reports.