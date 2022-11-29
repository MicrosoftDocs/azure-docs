---
title: Build a business case with Azure Migrate | Microsoft Docs
description: Describes how to build a business case with Azure Migrate
author: rashi-ms
ms.author: rajosh
ms.manager: ronai
ms.topic: how-to
ms.date: 11/19/2022

---



# Build a business case

This article describes how to build a business case for on-premises servers and workloads in your VMware environment with Azure Migrate: Discovery and assessment tool.

[Azure Migrate](migrate-services-overview.md) helps you to plan and execute migration and modernization projects to Azure. Azure Migrate provides a centralized hub to track discovery, assessment, and migration of on-premises infrastructure, applications, and data to Azure. The hub provides Azure tools for assessment and migration, as well as third-party independent software vendor (ISV) offerings.

## Prerequisites

- Make sure you've [created](./create-manage-projects.md) an Azure Migrate project. You can also reuse an existing project to use this capability.
- Once you have created a project, the Azure Migrate: Discovery and assessment tool is automatically [added](how-to-assess.md) to the project.
- Before you build the business case, you need to set up an Azure Migrate appliance for [VMware](how-to-set-up-appliance-vmware.md). The appliance discovers on-premises servers, SQL Server instance and databases, and ASP.NET webapps and sends metadata and performance (resource utilization) data to Azure Migrate. [Learn more](migrate-appliance.md).


## Business Case overview

The business case capability helps you build a business proposal to understand how Azure can bring the most value to your business. It highlights:

- On-premises vs Azure total cost of ownership.
- Year on year cashflow analysis.
- Resource utilization based insights to identify servers and workloads that are ideal for cloud.
- Quick wins for migration and modernization including end of support Windows OS and SQL versions.
- Long term cost savings by moving from a capital expenditure model to an Operating expenditure model, by paying for only what you use.

Other key features:

- Helps remove guess work in your cost planning process and adds data insights driven calculations.
- It can be generated in just a few clicks after you have performed discovery using the Azure Migrate appliance.
- The feature is automatically enabled for existing Azure Migrate projects.

There are three types of migration staretgies that you can choose while building your business case:

***Migration Strategy** | **Details** | **Assessment insights**
--- | --- | ---
**Azure recommended to minimize cost** | You can get the most cost efficient and compatible target recommendation in Azure across Azure IaaS and Azure PaaS targets |  For SQL Servers, sizing and cost comes from the *Recommended report* with optimization strategy- minimize cost from Azure SQL assessment. For web apps, sizing and cost comes from Azure App Service assessment is picked. For general servers, sizing and cost comes from Azure VM assessment.
**Migrate to all IaaS (Infrastructure as a Service)** | You can get a quick lift and shift recommendation to Azure IaaS. | For SQL Servers, sizing and cost comes from the *Instance to SQL Server on Azure VM* report. For general servers and servers hosting web apps, sizing and cost comes from Azure VM assessment.
**Modernize to PaaS (Platform as a Service)** | You can get a PaaS preferred recommendation that means, the logic identifies workloads best fit for PaaS targets. General servers are recommended with a quick lift and shift recommendation to Azure IaaS |  For SQL Servers, sizing and cost comes from the *Instance to Azure SQL MI* report. For web apps, sizing and cost comes from Azure App Service assessment. For general servers, sizing and cost comes from Azure VM assessment.
Although the business case picks Azure recommendations from certain assessments, you won't be able to access the assessments directly. To deep dive into sizing, readiness and Azure cost estimates, you can create respective assessments for the servers or workloads.
## Build a business case
1. On the **Overview** page > **Servers, databases and web apps**, click **Discover, assess and migrate**.
    ![Location of discover, assess and migrate servers button](./media/tutorial-businesscase/assess.png)
1. In **Azure Migrate: Discovery and assessment**, click **Build business case**.
    ![Location of the build business case button](./media/tutorial-businesscase/build.png)
     We recommend that you wait at least a day after starting discovery before you build a business case so that enough performance/resource utilization data points are collected. Also, review the notifications/ resolve issues blades on Azure Migrate hub to identify any discovery related issues prior to business case computation. It will ensure that the IT estate in your datacenter is represented more accurately and the business case recommendations will be more valuable.
1. In **Business case name** > specify a name for the business case. Make sure the business case name is unique within a project, else the previous business case with the same name will get recomputed.
1. In **target location** > specify the Azure region to which you want to migrate.
    - Azure SKU size and cost recommendations are based on the location that you specify.
1. In **Migration strategy** > specify the migration strategy for your business case:
    
    - With the default "Azure recommended approach to minimize cost", you can get the most cost efficient and compatible target recommendation in Azure across Azure IaaS and Azure PaaS targets.
    - With "Migrate to all IaaS (Infrastructure as a Service)", you can get a quick lift and shift recommendation to Azure IaaS.
    - With "Modernize to PaaS (Platform as a Service)", you can get cost effective recommendations for Azure IaaS and more PaaS preferred targets in Azure PaaS.
1. In **Discount (%) on Pay as you go**, add any subscription-specific discounts you receive on top of the Azure offer. The default setting is 0%. Note that the discount is not applicable on top of reserved instance savings option.
1. **Currency** is defaulted to USD and can't be edited.
1. Review the chosen inputs, and click **Build business case**.
    ![Location of the button to intitate the buisiness case creation](./media/tutorial-businesscase/build-button.png)
1. You will be directed to the newly created business case with a banner that says that your business case is computing. The computation might take some time, depending on the number of servers and workloads in the project. You can come back to the business case page after ~30 minutes and click on refresh.
    
    ![Location of refresh button](./media/tutorial-businesscase/refresh.png)
    
## Review the business case
There are four major reports that you need to review:
- **Overview**: This report is an executive summary of the business case and covers:
    - Potential savings (TCO).
    - Estimated year on year cashflow savings based on the estimated migration completed that year.
    - Savings from unique Azure benefits like Azure Hybrid Benefit.
    - Discovery insights covering the scope of the business case.
- **On-premises vs Azure**: This report covers the breakdown of the total cost of ownership by cost categories and insights on savings.
- **Azure IaaS**: This report covers the Azure and on-premises footprint of the servers and workloads recommended for migrating to Azure IaaS.
- **Azure PaaS**: This report covers the Azure and on-premises footprint of the workloads recommended for migrating to Azure PaaS.
### View a business case
1. In **Servers, databases and web apps** > **Azure Migrate: Discovery and assessment** > Click the number below **Total migration business cases**.
1. In **Business Case**, select a business case to open it. As an example (estimations and costs for example only): 
![Business Case Overview](./media/tutorial-businesscase/overview.png)
### Overview
#### Potential savings
This card covers your potential total cost of ownership savings based on the chosen migration strategy. It includes one year savings from compute, storage, network, labor and facilities cost (based on assumptions) to help you envision how Azure benefits can turn into cost savings. You can see the insights of different cost categories in the *On-premises Vs Azure* report.
##### Estimated on-premises cost
It covers the cost of running all the servers scoped in the business case using some of the industry benchmarks. It does not cover Facilities (lease/colocation/power) cost by default, but you can edit it in the on-premises cost assumptions section. It includes one time cost for some of the capital expenditures like hardware acquisition etc, and annual cost for other components that you might pay as perating expenses like maintenance etc.
##### Estimated Azure cost
It covers the cost of all servers and workloads that have been identified as ready for migration/modernization as per the recommendation. Refre the respective *Azure IaaS* and *Azure PaaS* report for details. The Azure cost is calculated based on the right sized Azure configuration, ideal migration target and most suitable pricing offers for your workloads. You can override the migration strategy, target location or other settings in the 'Azure cost' assumptions to see how your savings could change by migrating to Azure.
#### YoY estimated current vs future state cost
As you plan to migrate to Azure in phases, this line chart shows your cashflow per year based on the estimated migration completed that year. By default, it's assumed that you will migrate 0% in the current year, 20% in Year 1, 50% in Year 2 and 100% in Year 3.
- Current state cost shows how your net cashflow will be on-premises, given your infrastructure is growing 5% per year.
- The future state cost shows how your net cashflow will be as you migrate some percentage to Azure per year as in the 'Azure cost' assumptions, while your infrastructure is growing 5% per year.
#### Savings with Azure Hybrid Benefits
Currently, this card shows a static percetage of max savings you could get with Azure hybrid Benefits. Soon, you will be able to see actual license cost savings assuming all your licenses are convertible to Azure and the savings are from bringing the existing Windows and SQL Server licenses to Azure.
#### Discovery insights
It covers the total severs scoped in the business case computation, virtualisation distribution, utilization insights and distribution of servers based on workloads running on them.
##### Utilization insights
It covers which servers are ideal for cloud, servers that can be decommissioned on-premises, and servers that can't be classified based on resource utilization/performance data:
- Ideal for cloud: These servers are best fit for migrating to Azure and comprises of active and idle servers:
    - Active servers: These servers delivered business value by being on and had their CPU and memory utilization above 5% and network utilization above 2%.
    - Idle servers: These servers were on but didn't deliver business value by having their CPU and memory utilization below 5% and network utilization below 2%.
- Decommission: These servers were expected to deliver business value, but didn't and can be decommissioned on-premises and recommended to not migrate to Azure:
    - Zombie: The CPU, memory and network utilization were 0% with no performance data collection issues.
- These servers were on but do not have adequate metrics available:
    - Unknown: Many servers can land in this section if the discovery is still ongoing or has some unaddressed discovery issues.
### On-premises Vs Azure
It covers cost components for on-premises and Azure, savings and insights to understand the savings better. 
### Azure IaaS
It covers:
In Azure tab:
- Cost estimate by recommended target (Annual cost and also includes Compute, Storage, Network, labor components) and savings from Hybrid benefits.
- Azure VM:
    - Estimated cost by savings options: This card includes compute cost for Azure VMs. All idle servers are recommended to be migrated via Pay as you go Dev/Test and others (Active and unknown) are recommended to be migrated using 3 year Reserved Instance to maximize savings.
    - Recommended VM family: This card covers the VM sizes recommended. The ones marked Unknown are the VMs that have some readiness issues and no SKUs could be found for them.
    - Recommended storage type: This card covers the storage cost distribution across different recommended storage types.
- SQL Server on Azure VM:
This section assumes instance to SQL Server on Azure VM migration recommendation, and the number of VMs here are the number of instances recommended to be migrated as SQL Server on Azure VM:
    - Estimated cost by savings options: This card includes compute cost for SQL Server on Azure VMs. All idle servers are recommended to be migrated via Pay as you go Dev/Test and others (Active and unknown) are recommended to be migrated using 3 year Reserved Instance to maximize savings.
    - Recommended VM family: This card covers the VM sizes recommended. The ones marked Unknown are the VMs that have some readiness issues and no SKUs could be found for them.
    - Recommended storage type: This card covers the storage cost distribution across different recommended storage types.
In on-premises tab:
- On-premises footprint of the servers recommended to be migrated to Azure IaaS.
- Contribution of Zombie servers in the on-premises cost.
- Distribution of servers by OS, virtualization and activity state.
### Azure PaaS
It covers:
In Azure tab:
- Cost estimate by recommended target (Annual cost and also includes Compute, Storage, Network, labor components) and savings from Hybrid benefits.
- Azure SQL:
    - Estimated cost by savings options: This card includes compute cost for Azure SQL MI.
    - Distribution by recommended service tier.
- Azure App Service:
   - Estimated cost by savings options: This card includes Azure App Service Plans cost.
   - Distribution by recommended plans.
In on-premises tab:
- On-premises footprint of the servers recommended to be migrated to Azure PaaS.
- Contribution of Zombie SQL instances in the on-premises cost.
- Distribution of SQL instances by SQL version and activity state.
## Next steps
- [Learn more](concepts-business-case-calculation.md) about how business cases are calculated.