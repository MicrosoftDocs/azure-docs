---
title: Questions about Business case in Azure Migrate
description: Get answers to common questions about Business case in Azure Migrate.
author: rashijoshi
ms.author: rajosh
ms.manager: ronai
ms.topic: conceptual
ms.service: azure-migrate
ms.date: 04/22/2024
ms.custom: references_regions, engagement-fy23
---

# Business case (preview) - Common questions

This article answers common questions about Business case in Azure Migrate. If you have other questions, check these resources:

- [General questions](resources-faq.md) about Azure Migrate.
- Questions about the [Azure Migrate appliance](common-questions-appliance.md).

## General

### How can I export the business case?

You can select export from the Business case to export it in an .xlsx file. If you see the **Export** gesture as disabled, you need to recalculate the business case by modifying any one assumption (Azure or on-premises) in the Business Case and select **Save**. For example:

1. Go to a business case and select **Edit assumptions** and choose **Azure assumptions**.
1. Select **Reset** next to **Performance history duration date range is outdated** warning. You could also choose to change any other setting.
1. Select **Save**.

This will recalculate the business case with the updated assumptions and will enable the export gesture.

### What is the difference between an assessment and a business case?

An assessment helps you understand the readiness, sizing and Azure cost estimates (only compute and storage) of a particular source and targets. It's useful in understanding *How to migrate to Azure*.

A Business case helps you understand on-premises cost estimates, Azure cost estimates and potential savings (TCO and YoY). It helps you understand *Why Azure?* and helps understand the quick wins and unique Azure Benefits.

### Why is my business case in computing status?

Business case creates assessments in the background, which could take some time depending on the number of servers, SQL servers and web apps present in your project. It could take somewhere between 15 mins to 3 hours for the Business case to get computed. If it's still stuck in computing status, create a support request.

## Build business case 

### How do I build a business case?

Currently, you can create a Business case on servers and workloads discovered using a lightweight Azure Migrate appliance in your VMware, Hyper-V, and Physical/Baremetal environment or servers discovered using a .csv or RVTools .xlsx import. The appliance discovers on-premises servers and workloads. It then sends server metadata and performance data to Azure Migrate.

### Why can’t I build business case from my project?

You won't be able to create a business case if your project is in one of these two project regions:

Germany West Central and Sweden Central

To verify in an existing project:
1. You can use the https://portal.azure.com/ URL to get started
2. In Azure Migrate, go to **Servers, databases and webapps** > **Migration goals**.
3. On the **Azure Migrate: Discovery and assessment** tool, select **Overview**.
4. Under Project details, select **Properties**.
5. Check the Project location.
6. The Business case feature isn't supported in the following regions:

    Germany West Central and Sweden Central

### How do I add facilities costs to my business case?

1. Go to your business case and select **Edit assumptions** and choose **On-premises cost assumptions**.
1. Select **Facilities** tab. 
1. Specify estimated annual lease/colocation/power costs that you want to include as facilities costs in the calculations.

If you aren't aware of your facilities costs, use the following methodology.

#### Step-by-step guide to calculate facilities costs
 The facilities cost calculation in Azure Migrate is based on the Cloud Economics methodology, tailored specifically for your on-premises datacenter. This methodology is based on a colocation model, which prescribes an average cost value per kWh, which includes space, power and lease costs, which usually comprise facilities costs for a datacenter.   
1. **Determine the current energy consumption (in kWh) for your workloads**: Energy consumption by current workloads = Energy consumption for compute resources + Energy consumption for storage resources.
    1. **Energy consumption for compute resources**:  
        1. **Determine the total number of physical cores in your on-premises infrastructure**: In case you don't have the number of physical cores, you can use the formula - Total number of physical cores = Total number of virtual cores/2.
        1. **Input the number of physical cores into the given formula**: Energy consumption for compute resources (kWh) = Total number of physical cores * On-Prem Thermal Design Power or TDP (kWh per core) * Integration of Load factor * On-premises Power Utilization Efficiency or PUE.
        1. If you aren't aware of the values of TDP, Integration of Load factor and On-premises PUE for your datacenter, you can use the following assumptions for your calculations:
            1. On-Prem TDP (kWh per core) = **0.009**
            1. Integration of Load factor = **2.00** 
            1. On-Prem PUE = **1.80**
    1. **Energy consumption for storage resources**:
        1. **Determine the total storage in use for your on-premises infrastructure in Terabytes (TB)**. 
        1. **Input the storage in TB into the given formula**: Energy consumption for storage resources (kWh) = Total storage capacity in TB * On-Prem storage Power Rating (kWh per TB) * Conversion of energy consumption into Peak consumption * Integration of Load factor * On-premises PUE (Power utilization effectiveness).
        1. If you aren't aware of the values of On-premises storage power rating, conversion factor for energy consumption into peak consumption, and Integration of Load factor and On-premises PUE, you can use the following assumptions for your calculations:
            1. On-Prem storage power rating (kWh per TB) = **10**
            1. Conversion of energy consumption into peak consumption = **0.0001**
            1. Integration of Load factor = **2.00**
            1. On-Prem PUE = **1.80**
1. **Determine the unused energy capacity for your on-premises infrastructure**: By default you can assume that **40%** of the datacenter energy capacity remains unused. 
1. **Determine the total energy capacity of the datacenter**: Total energy capacity = Energy consumption by current workloads / (1-unused energy capacity).
1. **Calculate total facilities costs per year**: Facilities costs per year = Total energy capacity * Average colocation costs ($ per kWh per month) * 12. You can assume the average colocation cost = **$340 per kWh per month**.

**Sample example**  

Assume that Contoso, an e-commerce company has 10,000 virtual cores and 5,000 TB of storage. Let's use the formula to calculate facilities cost:
1. Total number physical cores = **10,000/2** = **5,000**
1. Energy consumption for compute resources = **5,000 * 0.009 * 2 * 1.8 = 162 kWh**
1. Energy consumption for storage resources = **5,000 * 10 * 0.0001 * 2 * 1.8 = 18 kWh**
1. Energy consumption for current workloads = **(162 + 18) kWh = 180 kWh**
1. Total energy capacity of datacenter = **180/(1-0.4) = 300 kWh**
1. Yearly facilities cost = **300 kWh * $340 per kWh * 12 = $1,224,000 = $1.224 Mn**

### What does the different migration strategies mean?
**Migration Strategy** | **Details** | **Assessment insights**
--- | --- | ---
**Azure recommended to minimize cost** | You can get the most cost efficient and compatible target recommendation in Azure across Azure IaaS and Azure PaaS targets |  For SQL Servers, sizing and cost comes from the *Recommended report* with optimization strategy- minimize cost from Azure SQL assessment.<br/><br/> For web apps, sizing and cost comes from Azure App Service assessment is picked.<br/><br/> For general servers, sizing and cost comes from Azure VM assessment.
**Migrate to all IaaS (Infrastructure as a Service)** | You can get a quick lift and shift recommendation to Azure IaaS. | For SQL Servers, sizing and cost comes from the *Instance to SQL Server on Azure VM* report.<br/><br/> For general servers and servers hosting web apps, sizing and cost comes from Azure VM assessment.
**Modernize to PaaS (Platform as a Service)** | You can get a PaaS preferred recommendation that means, the logic identifies workloads best fit for PaaS targets.<br/><br/> General servers are recommended with a quick lift and shift recommendation to Azure IaaS. |  For SQL Servers, sizing and cost comes from the *Recommended report* with optimization strategy - *Modernize to PaaS* from Azure SQL assessment.<br/><br/> For web apps, sizing and cost comes from Azure App Service assessment. For general servers, sizing and cost comes from Azure VM assessment.

> [!NOTE]
> Although the Business case picks Azure recommendations from certain assessments, you won't be able to access the assessments directly. To deep dive into sizing, readiness and Azure cost estimates, you can create respective assessments for the servers or workloads.

## Business case recommendation


### I can't see some servers and SQL instances

There are multiple possibilities for this issue.

- Discovery hasn't completed - Wait for the discovery to complete. It's recommended to wait for at least 24 hours.
- Check and resolve any discovery issues.
- Changes to discovery happened after creating the Business case.

To fetch latest discovery data, recalculate by selecting the **Recalculate** button, or changing the assumptions and selecting **Save**.


### Why are all or some of the servers marked as unknown in the utilization insights?

We couldn't collect sufficient data points to classify these servers. We recommend that you wait at least a day after starting discovery so that the Business case has enough utilization data points. Also, review the notifications/resolve issues blades on Azure Migrate hub to identify any discovery related issues prior to Business case computation. Reviewing issues prior to building a Business case will ensure that the IT estate in your datacenter is represented more accurately.

### Was the readiness taken into consideration in the recommendations?
Yes, but you won't be able to access the assessments directly. To deep dive into sizing, readiness, and Azure cost estimates, you can create respective assessments for the servers or workloads.

### Why was I recommended this Azure target?
Based on the migration strategy, this was the best recommended target. To understand detailed readiness and sizing, create an assessment and refer to the details.


### How do I get to know details for servers or workloads that aren't ready for Azure?
To deep dive into sizing, readiness, and Azure cost estimates, you can create respective assessments for the servers or workloads.


### Does the Azure SQL recommendation logic include SQL consolidation?
No, it doesn't include SQL consolidation.

## Next steps

- [Learn more](how-to-build-a-business-case.md) about how to build a Business case.
- [Learn more](how-to-view-a-business-case.md) about how to review the Business case reports.

