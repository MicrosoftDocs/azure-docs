---
title: Questions about Business case in Azure Migrate
description: Get answers to common questions about Business case in Azure Migrate.
author: rashijoshi
ms.author: rajosh
ms.manager: ronai
ms.topic: conceptual
ms.service: azure-migrate
ms.date: 07/17/2023
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

Currently, you can create a Business case on servers and workloads discovered using a lightweight Azure Migrate appliance in your VMware, Hyper-V and Physical/Baremetal environment. The appliance discovers on-premises servers and workloads. It then sends server metadata and performance data to Azure Migrate.

### Why is the Build business case feature disabled?

The **Build business case** feature will be enabled only when you have discovery performed using an Azure Migrate appliance for servers and workloads in your VMware, Hyper-V and Physical/Baremetal environment. The Business case feature isn't supported for servers and/or workloads imported via a .csv file.

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

### Why can't I change the currency during business case creation?
Currently, the currency is defaulted to USD.

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

