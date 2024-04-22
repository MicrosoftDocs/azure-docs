---
title: Business case in Azure Migrate 
description: Learn about Business case in Azure Migrate 
author: rashi-ms
ms.author: rajosh
ms.manager: ronai
ms.topic: conceptual
ms.service: azure-migrate
ms.date: 04/15/2024
ms.custom: engagement-fy24
---

# Business case (preview) overview

This article provides an overview of assessments in the [Azure Migrate: Discovery and assessment](migrate-services-overview.md#azure-migrate-discovery-and-assessment-tool) tool. The tool can assess on-premises servers in VMware virtual and Hyper-V environment, and physical servers for migration to Azure.

## What's a business case?

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

This capability can only be used to create Business cases in public cloud regions. For Azure Government, you can use the existing assessment capability.

## Migration strategies in a business case

There are three types of migration strategies that you can choose while building your Business case:

**Migration Strategy** | **Details** | **Assessment insights**
--- | --- | ---
**Azure recommended to minimize cost** | You can get the most cost efficient and compatible target recommendation in Azure across Azure IaaS and Azure PaaS targets. |  For SQL Servers, sizing and cost comes from the *Recommended report* with optimization strategy - minimize cost from Azure SQL assessment.<br/><br/> For web apps, sizing and cost comes from Azure App Service and Azure Kubernetes Service assessments depending on web app readiness and minimum cost. <br/><br/>For general servers, sizing and cost comes from Azure VM assessment.
**Migrate to all IaaS (Infrastructure as a Service)** | You can get a quick lift and shift recommendation to Azure IaaS. | For SQL Servers, sizing and cost comes from the *Instance to SQL Server on Azure VM* report. <br/><br/>For general servers and servers hosting web apps, sizing and cost comes from Azure VM assessment.
**Modernize to PaaS (Platform as a Service)** | You can get a PaaS preferred recommendation that means, the logic identifies workloads best fit for PaaS targets. <br/><br/>General servers are recommended with a quick lift and shift recommendation to Azure IaaS. | For SQL Servers, sizing and cost comes from the *Recommended report* with optimization strategy - *Modernize to PaaS* from Azure SQL assessment.<br/><br/> For web apps, sizing and cost comes from Azure App Service and Azure Kubernetes Service assessments, with a preference to App Service. For general servers, sizing and cost comes from Azure VM assessment. 
 
Although the Business case picks Azure recommendations from certain assessments, you won't be able to access the assessments directly. To deep dive into sizing, readiness, and Azure cost estimates, you can create respective assessments for the servers or workloads.


## Discovery sources

Currently, you can create a Business case with the following two discovery sources:

**Discovery Source** | **Details** | **Migration strategies that can be used to build a business case**
--- | --- | ---
Use more accurate data insights collected via **Azure Migrate appliance** | You need to set up an Azure Migrate appliance for [VMware](how-to-set-up-appliance-vmware.md) or [Hyper-V](how-to-set-up-appliance-hyper-v.md) or [Physical/Bare-metal or other clouds](how-to-set-up-appliance-physical.md). The appliance discovers servers, SQL Server instance and databases, and ASP.NET/Java webapps and sends metadata and performance (resource utilization) data to Azure Migrate. [Learn more](migrate-appliance.md). | Azure recommended to minimize cost, Migrate to all IaaS (Infrastructure as a Service), Modernize to PaaS (Platform as a Service), Migrate to AVS (Azure VMware Solution)
Build a quick business case using the **servers imported via a .csv file** | You need to provide the server inventory in a [.CSV file and import in Azure Migrate](tutorial-discover-import.md) to get a quick business case based on the provided inputs. You don't need to set up the Azure Migrate appliance to discover servers for this option. | Migrate to all IaaS (Infrastructure as a Service), Migrate to AVS (Azure VMware Solution)


## Glossary for Business case (preview)

|   Term  |   Details  |
--- | --- |
| **Business case** | A Business case provides justification for a go/no go for a project. It evaluates the benefit, cost and risk of alternative options and provides a rationale for the preferred solution. |
| **Total cost of ownership (TCO)** | TCO (Total cost of ownership) is a financial estimate to help companies calculate precisely, the economic impact during the whole life cycle of IT projects. |
| **Return on Investment (ROI)** | A project’s expected return in percentage terms. ROI is calculated by dividing net benefits (benefits less costs) by costs. |
| **Cash flow statement** | It explains how much cash went out and in the door for a business. |
| **Net cash flow (NCF)** | It's the difference between the money coming in and the money coming out of your business for a specific period. |
| **Net Present Value (NPV)** | The present or current value of (discounted) future net cash flows given an interest rate (the discount rate). A positive project NPV normally indicates that the investment should be made unless other projects have higher NPVs. |
| **Payback period** | The breakeven point for an investment. It's the point in time at which net benefits (benefits minus costs) equal initial investment or cost. |
| **Capital Expense (CAPEX)** | Up front investments in assets that are capitalized and put into the balance sheet. |
| **Operating Expense (OPEX)** | Running expenses of a business. |
| **MDC** | Microsoft Defender for cloud. [Learn more](https://www.microsoft.com/security/business/cloud-security/microsoft-defender-cloud). |


## Next steps
- [Learn more](./concepts-business-case-calculation-faq.md) FAQ for business case.
