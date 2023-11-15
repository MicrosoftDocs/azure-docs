---
title: Business case in Azure Migrate 
description: Learn about Business case in Azure Migrate 
author: rashi-ms
ms.author: rajosh
ms.manager: ronai
ms.topic: conceptual
ms.service: azure-migrate
ms.date: 08/24/2023
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


## How do I build a business case?

Currently, you can create a Business case with the two discovery sources:

 **Discovery Source** | **Details** | **Migration strategies that can be used to build a business case**
    --- | --- | ---
    Use more accurate data insights collected via **Azure Migrate appliance** | You need to set up an Azure Migrate appliance for [VMware](how-to-set-up-appliance-vmware.md) or [Hyper-V](how-to-set-up-appliance-hyper-v.md) or [Physical/Bare-metal or other clouds](how-to-set-up-appliance-physical.md). The appliance discovers servers, SQL Server instance and databases, and ASP.NET webapps and sends metadata and performance (resource utilization) data to Azure Migrate. [Learn more](migrate-appliance.md). | Azure recommended to minimize cost, Migrate to all IaaS (Infrastructure as a Service), Modernize to PaaS (Platform as a Service)
    Build a quick business case using the **servers imported via a .csv file** | You need to provide the server inventory in a [.CSV file and import in Azure Migrate](tutorial-discover-import.md) to get a quick business case based on the provided inputs. You don't need to set up the Azure Migrate appliance to discover servers for this option. | Migrate to all IaaS (Infrastructure as a Service)

## How do I use the appliance?

If you're deploying an Azure Migrate appliance to discover on-premises servers, do the following steps:

1. Set up Azure and your on-premises environment to work with Azure Migrate.
1. For your first Business case, create an Azure project and add the Discovery and assessment tool to it.
1. Deploy a lightweight Azure Migrate appliance. The appliance continuously discovers on-premises servers and sends server metadata and performance data to Azure Migrate. Deploy the appliance as a VM. You don't need to install anything on servers that you want to assess.

After the appliance begins server discovery, you can start building your Business case. Follow our tutorials for [VMware](./tutorial-discover-vmware.md) or [Hyper-V](tutorial-discover-hyper-v.md) or [Physical/Bare-metal or other clouds](tutorial-discover-physical.md) to try out these steps.

We recommend that you wait at least a day after starting discovery before you build a Business case so that enough performance/resource utilization data points are collected. Also, review the notifications/resolve issues blades on Azure Migrate hub to identify any discovery related issues prior to Business case computation. It ensures that the IT estate in your datacenter is represented more accurately and the Business case recommendations are more valuable.

## What data does the appliance collect?

If you're using the Azure Migrate appliance, learn about the metadata and performance data that's collected for:
- [VMware](discovered-metadata.md#collected-metadata-for-vmware-servers).
- [Hyper-V](discovered-metadata.md#collected-metadata-for-hyper-v-servers)
- [Physical](discovered-metadata.md#collected-data-for-physical-servers)

## How does the appliance calculate performance data?

If you use the appliance for discovery, it collects performance data for compute settings with these steps:

1. The appliance collects a real-time sample point.
    - **VMware VMs**: A sample point is collected every 20 seconds.
    - **Hyper-V VMs**: A sample point is collected every 30 seconds.
    - **Physical servers**: A sample point is collected every five minutes.

1. The appliance combines the sample points to create a single data point every 10 minutes for VMware and Hyper-V servers, and every 5 minutes for physical servers. To create the data point, the appliance selects the peak values from all samples. It then sends the data point to Azure.
1. The assessment service stores all the 10-minute data points for the last month.
1. When you create a Business case, multiple assessments are triggered in the background.
1. The assessments identify the appropriate data point to use for rightsizing. Identification is based on the percentile values for *performance history* and *percentile utilization*.

    - For example, if the performance history is one week and the percentile utilization is the 95th percentile, the assessment sorts the 10-minute sample points for the last week. It sorts them in ascending order and picks the 95th percentile value for rightsizing.
    - The 95th percentile value makes sure you ignore any outliers, which might be included if you picked the 99th percentile.

1. This value is multiplied by the comfort factor to get the effective performance utilization data for these metrics that the appliance collects.

## How are utilization insights derived?

It covers which servers are ideal for cloud, servers that can be decommissioned on-premises, and servers that can't be classified based on resource utilization/performance data:

- **Ideal for cloud**: These servers are best fit for migrating to Azure and comprises of active and idle servers:
    - **Active servers**: These servers delivered business value by being on and had their CPU and memory utilization above 5% and network utilization above 2%.
    - **Idle servers**: These servers were on but didn't deliver business value by having their CPU and memory utilization below 5% and network utilization below 2%.
- **Decommission**: These servers were expected to deliver business value, but didn't and can be decommissioned on-premises and recommended to not migrate to Azure:
    - **Zombie**: The CPU, memory and network utilization were 0% with no performance data collection issues.
- These servers were on but don't have adequate metrics available:
    - **Unknown**: Many servers can land in this section if the discovery is still ongoing or has some unaddressed discovery issues.

## What comprises a business case?

There are four major reports that you need to review:

- **Overview**: This report is an executive summary of the Business case and covers:
    - Potential savings (TCO).
    - Estimated year on year cashflow savings based on the estimated migration completed that year.
    - Savings from unique Azure benefits like Azure Hybrid Benefit.
    - Discovery insights covering the scope of the Business case.
- **On-premises vs Azure**: This report covers the breakdown of the total cost of ownership by cost categories and insights on savings.
- **Azure IaaS**: This report covers the Azure and on-premises footprint of the servers and workloads recommended for migrating to Azure IaaS.
- **Azure PaaS**: This report covers the Azure and on-premises footprint of the workloads recommended for migrating to Azure PaaS.

## What's in a business case?

Here's what's included in a business case:

### Total cost of ownership (steady state)

#### On-premises cost

Cost components for running on-premises servers. For TCO calculations, an annual cost is computed for the following heads:

**Cost heads** | **Category** | **Component** | **Logic** |
 --- | --- | --- | --- |
| Compute | Hardware | Server Hardware (Host machines) | Total hardware acquisition cost is calculated using a cost per core linear regression formula: Cost per core = 16.232*(Hyperthreaded core: memory in GB ratio) + 113.87. Hyperthreaded cores = 2*(cores) 
|     | Software - SQL Server licensing | License cost | Calculated per two core pack license pricing of 2019 Enterprise or Standard. |
|     | SQL Server - Extended Security Update (ESU) | License cost | Calculated for 3 years after the end of support of SQL server license as follows:<br/><br/> ESU (Year 1) – 75% of the license cost <br/><br/> ESU (Year 2) – 100% of the license cost <br/><br/> ESU (Year 3) – 125% of the license cost <br/><br/> |
|     |     | Software Assurance | Calculated per year as in settings. |
|     | Software - Windows Server licensing | License cost | Calculated per two core pack license pricing of Windows Server. |
|     | Windows Server - Extended Security Update (ESU) | License cost | Calculated for 3 years after the end of support of Windows server license: <br/><br/> ESU (Year 1) – 75% of the license cost <br/><br/> ESU (Year 2) – 100% of the license cost <br/><br/> ESU (Year 3) – 125% of the license cost <br/><br/>|
|     |     | Software Assurance | Calculated per year as in settings. |
|     | Virtualization software for servers running in VMware environment | Virtualization Software (VMware license cost + support + management software cost) | License cost for vSphere Standard license + Production support for vSphere Standard license + Management software cost for vSphere Standard + production support cost of management software. _Not included- other hypervisor software cost_ or  _Antivirus / Monitoring Agents_.|
|     | Virtualization software for servers running in Microsoft Hyper-V environment| Virtualization Software (management software cost + software assurance) | Management software cost for System Center + software assurance. _Not included- other hypervisor software cost_ or  _Antivirus / Monitoring Agents_.|
| Storage | Storage Hardware |     | The total storage hardware acquisition cost is calculated by multiplying the Total volume of storage attached to  per GB cost. Default is USD 2 per GB per month. |
|     | Storage Maintenance |     | Default is 10% of storage hardware acquisition cost. |
| Network | Network Hardware and software | Network equipment (Cabinets, switches, routers, load balancers etc.) and software | As an industry standard and used by sellers in Business cases, it's a % of compute and storage cost. Default is 10% of storage and compute cost. |
|     | Maintenance | Maintenance | Defaulted to 15% of network hardware and software cost. |
| Security | General Servers | Server security cost | Default is USD 250 per year per server. This is multiplied with number of servers (General servers)|
|     | SQL Servers | SQL protection cost | Default is USD 1000 per year per server. This is multiplied with number of servers running SQL |
| Facilities | Facilities & Infrastructure | DC Facilities - Lease and Power | Facilities cost isn't applicable for Azure cost. |
| Labor | Labor | IT admin | DC admin cost = ((Number of virtual machines) / (Avg. # of virtual machines that can be managed by a full-time administrator)) * 730 * 12 |

#### Azure cost

| **Cost heads** | **Category** | **Component** | **Logic** |
 --- | --- | --- | --- |
| Compute | Compute (IaaS) | Azure VM, SQL Server on Azure VM | Compute cost (with AHUB) from Azure VM assessment, Compute cost (with AHUB) from Azure SQL assessment  |
|     | Compute (PaaS) | Azure SQL MI or Azure SQL DB | Compute cost (with AHUB) from Azure SQL assessment. |
|     | Compute(PaaS) | Azure App Service or Azure Kubernetes Service | Plan cost from Azure App Service and/or Node pool cost from Azure Kubernetes Service. |
| Storage | Storage (IaaS) | Azure VM - Managed disks, Server on Azure VM - Managed disk | Storage cost from Azure VM assessment/Azure SQL assessment. |
|     | Storage (PaaS) | Azure SQL MI or Azure SQL DB - Managed disks | Storage cost from Azure SQL assessment. |
|     | Storage (PaaS) | N/A | N/A |
| Network | Network Hardware and software | Network equipment (Cabinets, switches, routers, load balancers etc.) and software | As an industry standard and used by sellers in Business cases, it's a % of compute and storage cost. Default is 10% of storage and compute cost. |
|     | Maintenance | Maintenance | Defaulted to 15% of network hardware and software cost. |
| Security | Server security cost | Defender for servers | For servers recommended for Azure VM, if they're ready to run Defender for Server, the Defender for server cost (Plan 2) per server for that region is added |
|     | SQL security cost | Defender for SQL | For SQL Server instances and DBs recommended for SQL Server on Azure VM, Azure SQL MI or Azure SQL DB, if they're ready to run Defender for SQL, the Defender for SQL per SQL Server instance for that region is added. For DBs recommended to Azure SQL DB, cost is rolled up at instance level. |
|     | Azure App Service security cost | Defender for App Service | For web apps recommended for App Service or App Service containers, the Defender for App Service cost for that region is added. |
| Facilities | Facilities & Infrastructure | DC Facilities - Lease and Power | Facilities cost isn't applicable for Azure cost. |
| Labor | Labor | IT admin | DC admin cost = ((Number of virtual machines) / (Avg. # of virtual machines that can be managed by a full-time administrator)) * 730 * 12 |

### Year on Year costs

#### Current state (on-premises)

|   Component  | **Year 0** | **Year 1** | **Year 2** | **Year 3** | **Year 4** |
 --- | --- | --- | --- | --- | --- |
| CAPEX | Total CAPEX (A) | Y1 CAPEX = Total CAPEX (A) * (1+server growth rate%) | Y2 CAPEX = Y1 CAPEX (A) * (1+server growth rate%) | Y3 CAPEX = Y2 CAPEX (A) * (1+server growth rate%) | Y4 CAPEX = Y3 CAPEX (A) * (1+server growth rate%) |
| OPEX | Total OPEX (B) | Y1 OPEX = Total OPEX (B) * (1+server growth rate%) | Y2 OPEX = Y1 OPEX (B) * (1+server growth rate%) | Y3 OPEX = Y2 OPEX (B) * (1+server growth rate%) | Y4 OPEX = Y3 OPEX (B) * (1+server growth rate%) |
| Status Quo Cash Flow | Y0 Cashflow  = Total CAPEX (A) + Total OPEX (B) | Y1 Cashflow= Y1 CAPEX+ Y1 OPEX | Y2 Cashflow= Y2 CAPEX + Y2 OPEX | Y3 Cashflow= Y3 CAPEX (A) + Y3 OPEX (B) | Y4 Cashflow= Y4 CAPEX (A) + Y4 OPEX (B) |

**CAPEX & OPEX**

|   Component  | Sub component  | Assumptions | Azure retained |
 --- | --- | --- | --- |
| **Capital Asset Expense (CAPEX) (A)** |     |     |     |
| Server Depreciation | (Total server hardware acquisition cost)/(Depreciable life) | Depreciable life = 4 years |     |
| Storage Depreciation | (Total storage hardware acquisition cost)/(Depreciable life) | Depreciable life = 4 years |     |
| Fit out and Networking Equipment | (Total network hardware acquisition cost)/(Depreciable life) | Depreciable life = 5 years |     |
| License Amortization | (virtualization cost + Windows Server + SQL Server + Linux OS)/(Depreciable life) | Depreciable life = 5 years | VMware licenses aren't retained; Windows, SQL and Hyper-V management software licenses are retained based on AHUB option in Azure.|
| **Operating Asset Expense (OPEX) (B)** |     |     |     |
| Network maintenance | Per year |     |     |
| Storage maintenance | Per year | Power draw per Server, Average price per KW per month based on location. |     |
| License Support | License support cost for virtualization + Windows Server + SQL Server + Linux OS + Windows server extended security update (ESU) + SQL Server extended security update (ESU) |     | VMware licenses aren't retained; Windows, SQL and Hyper-V management software licenses are retained based on AHUB option in Azure. |
| Security | Per year |  Per server annual security/protection cost.  |  |
| Datacenter Admin cost | Number of people * hourly cost * 730 hours | Cost per hour based on location. |     |

#### Future state (on-premises + Azure)

It assumes that the customer does a phased migration to Azure with following % of servers migrated every year:

| **Year 0** | **Year 1** | **Year 2** | **Year 3** |
 --- | --- | --- | --- |
| 0%  | 20% | 50% | 100% |

You can override the above values in the assumptions section of the Business case.

 In Azure, there's no CAPEX, the yearly Azure cost is an OPEX

|  **Component**  | **Year 0** | **Year 1** | **Year 2** | **Year 3** | **Year 4** |
--- | --- | --- | --- | --- | --- |
| CAPEX | Total CAPEX (A) | Y1 CAPEX Azure =80%* (Y1 CAPEX On-premises) | Y2 CAPEX Azure =50%* (Y2 CAPEX On-premises) | Y3 CAPEX Azure =0%* (Y3 CAPEX On-premises) | Y4 CAPEX = 0%* (Y4 CAPEX On-premises) |
| OPEX | Total OPEX (B) | Y1 OPEX Azure = 80%* (Y1 OPEX On-premises)+20%* (Azure Yearly cost) * (1+server growth rate%) | Y2 OPEX Azure = 50%* (Y2 OPEX On-premises)+50%* (Azure Yearly cost) * (1+server growth rate%) | Y3 OPEX Azure = 100%* (Azure Yearly cost) * (1+server growth rate%) | Y4 OPEX Azure = 100%* (Azure Yearly cost) * (1+server growth rate%) |
| Future state Cash Flow | Y0 Cash Flow= Total CAPEX (A) + Total OPEX (B) | Y1 Cash Flow= Y1 CAPEX + Y1 OPEX | Y2 Cash Flow= Y2 CAPEX + Y2 OPEX | Y3 Cash Flow= Y3 CAPEX + Y3 OPEX | Y4 Cash Flow= Y4 CAPEX + Y4 OPEX |

## Glossary

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
- [Learn more](./migrate-services-overview.md) about Azure Migrate.