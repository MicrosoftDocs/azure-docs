---
title: Business case in Azure Migrate 
description: Learn about Business case in Azure Migrate 
author: rashi-ms
ms.author: rajosh
ms.manager: ronai
ms.topic: conceptual
ms.service: azure-migrate
ms.date: 10/29/2024
ms.custom: engagement-fy25
---

# Business case (preview) overview

This article provides an overview of assessments in the [Azure Migrate: Discovery and assessment](migrate-services-overview.md) tool. The tool can assess on-premises servers in VMware virtual and Hyper-V environment, and physical servers for migration to Azure.

## What's a business case?

The Business case capability helps you build a business proposal to understand how Azure can bring the most value to your business. It highlights:

- On-premises vs Azure Total Cost of Ownership (TCO).
- Current on-premises vs On-premises with Arc TCO.
- Cost savings and other benefits of using Azure security (Microsoft Defender for Cloud) and management (Azure Monitor and Update Management) via Arc, as well as ESUs enabled by Arc for your on-premises servers.
- Year on year (YOY) cashflow analysis.
- Resource utilization based insights to identify servers and workloads that are ideal for cloud.
- Quick wins for migration and modernization including end of support Windows OS and SQL versions.
- Long term cost savings by moving from a capital expenditure model to an Operating expenditure model, by paying for only what you use.

Other key features:

- Helps remove guess work in your cost planning process and adds data insights driven calculations.
- It can be generated almost instantly after you have performed discovery using the Azure Migrate appliance.
- The feature is automatically enabled for existing Azure Migrate projects.

This capability can only be used to create Business cases in public cloud regions. For Azure Government, you can use the existing assessment capability.

## Migration strategies in a business case

There are three types of migration strategies that you can choose while building your Business case:

| Migration Strategy | Details | Assessment insights |
| --- | --- | --- |
| **Azure recommended to minimize cost** | You can get the most cost efficient and compatible target recommendation in Azure across Azure IaaS and Azure PaaS targets. |  For SQL Servers, sizing and cost comes from the *Recommended report* with optimization strategy - minimize cost from Azure SQL assessment.<br/><br/> For web apps, sizing and cost comes from Azure App Service and Azure Kubernetes Service assessments depending on web app readiness and minimum cost. <br/><br/>For general servers, sizing and cost comes from Azure VM assessment.
| **Migrate to all IaaS (Infrastructure as a Service)** | You can get a quick lift and shift recommendation to Azure IaaS. | For SQL Servers, sizing and cost comes from the *Instance to SQL Server on Azure VM* report. <br/><br/>For general servers and servers hosting web apps, sizing and cost comes from Azure VM assessment.
| **Modernize to PaaS (Platform as a Service)** | You can get a PaaS preferred recommendation that means, the logic identifies workloads best fit for PaaS targets. <br/><br/>General servers are recommended with a quick lift and shift recommendation to Azure IaaS. | For SQL Servers, sizing and cost comes from the *Recommended report* with optimization strategy - *Modernize to PaaS* from Azure SQL assessment.<br/><br/> For web apps, sizing and cost comes from Azure App Service and Azure Kubernetes Service assessments, with a preference to App Service. For general servers, sizing and cost comes from Azure VM assessment. |
 
Although the Business case picks Azure recommendations from certain assessments, you won't be able to access the assessments directly. To deep dive into sizing, readiness, and Azure cost estimates, you can create respective assessments for the servers or workloads.


## Discovery sources to create a Business case

Currently, you can create a Business case with the two discovery sources:

| Discovery Source | Details | Migration strategies to build a business case |
| --- | --- | --- |
| Use more accurate data insights collected via **Azure Migrate appliance** | You need to set up an Azure Migrate appliance for [VMware](how-to-set-up-appliance-vmware.md) or [Hyper-V](how-to-set-up-appliance-hyper-v.md) or [Physical/Bare-metal or other clouds](how-to-set-up-appliance-physical.md). The appliance discovers servers, SQL Server instance and databases, and ASP.NET/Java webapps and sends metadata and performance (resource utilization) data to Azure Migrate. [Learn more](migrate-appliance.md). | Azure recommended to minimize cost, Migrate to all IaaS (Infrastructure as a Service), Modernize to PaaS (Platform as a Service) |
| Build a quick business case using the **servers imported via a .csv file** | You need to provide the server inventory in a [.CSV file and import in Azure Migrate](tutorial-discover-import.md) to get a quick business case based on the provided inputs. You don't need to set up the Azure Migrate appliance to discover servers for this option. | Migrate to all IaaS (Infrastructure as a Service) |

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
    - Estimated YOY cashflow savings based on the estimated migration completed that year.
    - Savings from unique Azure benefits like Azure Hybrid Benefit.
    - Savings from Security and Management capabilities.
    - Discovery insights covering the scope of the Business case.
- **Current on-premises vs Future**: This report covers the breakdown of the TCO by cost categories and insights on savings.
- **On-premises with Azure Arc**: This report covers the breakdown of the TCO for your on-premises estate with and without Arc.
- **Azure IaaS**: This report covers the Azure and on-premises footprint of the servers and workloads recommended for migrating to Azure IaaS.
- **Azure PaaS**: This report covers the Azure and on-premises footprint of the workloads recommended for migrating to Azure PaaS.

## What's in a business case?

Here's what's included in a business case:

### TCO (steady state): On-premises cost

Cost components for running on-premises servers. For TCO calculations, an annual cost is computed for the following heads:

| Cost heads | Category | Component | Logic |
| --- | --- | --- | --- |
| **Compute** | **Hardware** | Server Hardware (Host machines) | Total hardware acquisition cost is calculated using a cost per core linear regression formula: Cost per core = 16.232*(Hyperthreaded core: memory in GB ratio) + 113.87. Hyperthreaded cores = 2*(cores) |
|     | **Software - SQL Server licensing** | License cost | Calculated per two core pack license pricing of 2019 Enterprise or Standard. |
|     | **SQL Server - Extended Security Update (ESU)** | License cost | Calculated for 3 years after the end of support of SQL server license as follows:<br/><br/> ESU (Year 1) – 75% of the license cost <br/><br/> ESU (Year 2) – 100% of the license cost <br/><br/> ESU (Year 3) – 125% of the license cost <br/><br/> |
|     |     | Software Assurance | Calculated per year as in settings. |
|     | **Software - Windows Server licensing** | License cost | Calculated per two core pack license pricing of Windows Server. |
|     | **Windows Server - Extended Security Update (ESU)** | License cost | Calculated for 3 years after the end of support of Windows server license: <br/><br/> ESU (Year 1) – 75% of the license cost <br/><br/> ESU (Year 2) – 100% of the license cost <br/><br/> ESU (Year 3) – 125% of the license cost <br/><br/>|
|     |     | Software Assurance | Calculated per year as in settings. |
|     | **Virtualization software for servers running in VMware environment** | Virtualization Software (VMware license cost) | License cost based on VMware Cloud Foundation licensing. |
| **Storage** | **Storage Hardware** |     | The total storage hardware acquisition cost is calculated by multiplying the Total volume of storage attached to  per GB cost. Default is USD 2 per GB per month. |
|     | **Storage Maintenance** |     | Default is 10% of storage hardware acquisition cost. |
| **Network** | **Network Hardware and software** | Network equipment (Cabinets, switches, routers, load balancers etc.) and software | As an industry standard and used by sellers in Business cases, it's a % of compute and storage cost. Default is 10% of storage and compute cost. |
|     | **Maintenance** | Maintenance | Defaulted to 15% of network hardware and software cost. |
| **Security** | **General Servers** | Server security cost | Default is USD 250 per year per server. This is multiplied with number of servers (General servers) |
|     | **SQL Servers** | SQL protection cost | Default is USD 1000 per year per server. This is multiplied with number of servers running SQL |
| **Facilities** | **Facilities & Infrastructure** | DC Facilities - Lease and Power | The Facilities cost is based on a colocation model, which includes space, power, and lease costs per kWh.<br> Annual facilities cost = Total energy capacity * Average colocation costs * 12. (Assume 40% of datacenter energy capacity remains unused.) <br> Total energy capacity = Energy consumption by current workloads / (1 - unused energy capacity). <br>To determine energy consumption for your workloads: <br>- Compute resources: Total physical cores * On-Prem TDP (0.009 kWh per core) * Load factor (2.00) * On-Prem PUE (1.80).<br> - Storage resources: Total storage in TB * On-Prem storage power rating (10 kWh per TB) * Conversion factor (0.0001) * Load factor (2.00) * On-Prem PUE (1.80). |
| **Labor** | **Labor** | IT admin | DC admin cost = ((Number of virtual machines) / (Avg. # of virtual machines that can be managed by a full-time administrator)) * 730 * 12 |
| **Management** | **Management Software licensing** | System center Management software | Used for cost of the System center management software that includes monitoring, hardware and virtual machine provisioning, automation, backup and configuration management capabilities. Cost of Microsoft system center management software is added when the system center agents are identified on any of the discovered resources. This is applicable only for windows servers and SQL servers related scenarios and includes Software assurance. |
|     |    | Other Management software | This is the cost of the management software for Partner management products. |
|     | **Management cost other than software** | Monitoring cost | Specify costs other than monitoring software. Default is USD 430 per year per server. This is multiplied with the number of servers. The default used is the cost associated with a monitoring administrator. |
|     |    | Patch Management cost | Specify costs other than patch management software. Default is USD 430 per year per server. This is multiplied with the number of servers. Default is the cost associated with a patch management administrator. |
|     |    | Backup cost | Specify costs other than backup software. Default is USD 580 per year per server. This is multiplied with the number of servers. Default used includes the cost per server for a backup administrator and storage required locally for backup. |

### TCO (steady state): Azure cost

| Cost heads | Category | Component | Logic |
| --- | --- | --- | --- |
| **Compute** | **Compute (IaaS)** | Azure VM, SQL Server on Azure VM | Compute cost (with AHUB) from Azure VM assessment, Compute cost (with AHUB) from Azure SQL assessment  |
|     | **Compute (PaaS)** | Azure SQL MI or Azure SQL DB | Compute cost (with AHUB) from Azure SQL assessment. |
|     | **Compute(PaaS)** | Azure App Service or Azure Kubernetes Service | Plan cost from Azure App Service and/or Node pool cost from Azure Kubernetes Service. |
| **Storage** | **Storage (IaaS)** | Azure VM - Managed disks, Server on Azure VM - Managed disk | Storage cost from Azure VM assessment/Azure SQL assessment. |
|     | **Storage (PaaS)** | Azure SQL MI or Azure SQL DB - Managed disks | Storage cost from Azure SQL assessment. |
|     | **Storage (PaaS)** | N/A | N/A |
| **Network** | **Network Hardware and software** | Network equipment (Cabinets, switches, routers, load balancers etc.) and software | As an industry standard and used by sellers in Business cases, it's a % of compute and storage cost. Default is 10% of storage and compute cost. |
|     | **Maintenance** | Maintenance | Defaulted to 15% of network hardware and software cost. |
| **Security** | **Server security cost** | Defender for servers | For servers recommended for Azure VM, if they're ready to run Defender for Server, the Defender for server cost (Plan 2) per server for that region is added |
|     | **SQL security cost** | Defender for SQL | For SQL Server instances and DBs recommended for SQL Server on Azure VM, Azure SQL MI or Azure SQL DB, if they're ready to run Defender for SQL, the Defender for SQL per SQL Server instance for that region is added. For DBs recommended to Azure SQL DB, cost is rolled up at instance level. |
|     | **Azure App Service security cost** | Defender for App Service | For web apps recommended for App Service or App Service containers, the Defender for App Service cost for that region is added. |
| **Facilities** | **Facilities & Infrastructure** | DC Facilities - Lease and Power | Facilities cost isn't applicable for Azure cost. |
| **Labor** | **Labor** | IT admin | DC admin cost = ((Number of virtual machines) / (Avg. # of virtual machines that can be managed by a full-time administrator)) * 730 * 12 |
| **Management** | **Azure Management Services** | Azure Monitor, Azure Backup and Azure Update Manager | Azure Monitor costs for each server as per listed price in the region assuming collection of logs ingestion for the guest operating system and one custom application is enabled for the server, totaling logs data of 3GB/month. <br/><br/> Azure Backup cost for each server/month is dynamically estimated based on the [Azure Backup Pricing](/azure/backup/azure-backup-pricing), which includes a protected instance fee, snapshot storage and recovery services vault storage. <br/><br/> Azure Update Manager is free for Azure servers. |
| **Azure Arc setting**  |  |  | For your on-premises servers, this setting assumes that you have Arc-enabled all your servers at the beginning of the migration journey and will migrate them to Azure over time. Azure Arc helps you manage your Azure estate and remaining on-premises estate through a single pane during migration and post-migration. |

### TCO (steady state): On-premises with Azure Arc cost

| Cost heads | Category | Component | Logic |
| --- | --- | --- | --- |
| **Compute and Licensing** | **Hardware and Licenses** | Server Hardware (Host machines) and Licenses | Estimated as a sum of total server hardware acquisition cost + software cost (Windows license + SQL license + Virtualization software cost) + maintenance cost </br> Total hardware acquisition cost is calculated using a cost per core linear regression formula. </br> SQL license cost is assumed to be using the pay-as-you-go model via Arc enabled SQL Server. ESU licenses for Windows Server and SQL Server are also assumed to be paid via Azure through ESUs enabled by Azure Arc. |
| **Storage** | **Storage Hardware** |   | Estimated as a sum of total storage hardware acquisition cost + software maintenance cost. <br> Total storage hardware acquisition cost = Total volume of storage attached to VMs (across all machines) * Cost per GB per month * 12. Cost per GB can be customized in the assumptions similar to the current On-premises storage cost. |
| **Network** | **Network Hardware and software** | Network equipment (Cabinets, switches, routers, load balancers etc.) and software  | Estimated as a sum of total network hardware and software cost + network maintenance cost  Total network hardware and software cost is defaulted to 10%* (compute and licensing +storage cost) and can be customized in the assumptions. Network maintenance cost is defaulted to 15%*(Total network hardware and software cost) and can be customized in the assumptions Same as current On-premises networking cost. |
| **Security** | **General Servers** | Server security cost | Estimated as sum of total protection cost for general servers and SQL workloads using MDC via Azure Arc. MDC Servers plan 2 is assumed for servers. Microsoft Defender for SQL on Azure-connected databases is assumed for SQL Server |
| **acilities** | **Facilities & Infrastructure** | DC Facilities - Lease and Power | The facilities cost is based on a colocation model, which includes space, power, and lease costs per kWh.<br> Annual facilities cost = Total energy capacity * Average colocation costs * 12. (Assume 40% of datacenter energy capacity remains unused.) <br> Total energy capacity = Energy consumption by current workloads / (1 - unused energy capacity). <br>To determine energy consumption for your workloads: <br>- Compute resources: Total physical cores * On-Prem TDP (0.009 kWh per core) * Load factor (2.00) * On-Prem PUE (1.80).<br>- Storage resources: Total storage in TB * On-Prem storage power rating (10 kWh per TB) * Conversion factor (0.0001) * Load factor (2.00) * On-Prem PUE (1.80). |
| **Labor** | **Labor**  | IT admin | Same as current On-premises labor cost.|
| **Management** | **Management Software licensing** | System center or other management software | Estimated as sum of total management cost for general servers. This includes monitoring and patching. Patching is assumed to be free via Azure Update Manager as it is included in MDC Servers plan 2. Monitoring cost is calculated per day based on log storage and alerts and multiplied*365 Estimated as 70% of on-premises management labor cost by default as it is assumed that 30% of labor effects could be redirected to other high impact projects for the company due to productivity improvements.  Labor costs can be customized in Azure Arc setting under Azure cost assumptions. |

### Year on year costs (current state): On-premises cost

| Component | Year 0 | Year 1 | Year 2 | Year 3 | Year 4 |
| --- | --- | --- | --- | --- | --- |
| **CAPEX** | Total CAPEX (A) | Y1 CAPEX = Total CAPEX (A) * (1+server growth rate%) | Y2 CAPEX = Y1 CAPEX (A) * (1+server growth rate%) | Y3 CAPEX = Y2 CAPEX (A) * (1+server growth rate%) | Y4 CAPEX = Y3 CAPEX (A) * (1+server growth rate%) |
| **OPEX** | Total OPEX (B) | Y1 OPEX = Total OPEX (B) * (1+server growth rate%) | Y2 OPEX = Y1 OPEX (B) * (1+server growth rate%) | Y3 OPEX = Y2 OPEX (B) * (1+server growth rate%) | Y4 OPEX = Y3 OPEX (B) * (1+server growth rate%) |
| **Status Quo Cash Flow** | Y0 Cashflow  = Total CAPEX (A) + Total OPEX (B) | Y1 Cashflow= Y1 CAPEX+ Y1 OPEX | Y2 Cashflow= Y2 CAPEX + Y2 OPEX | Y3 Cashflow= Y3 CAPEX (A) + Y3 OPEX (B) | Y4 Cashflow= Y4 CAPEX (A) + Y4 OPEX (B) |

#### YOY (current state): CAPEX (A) costs

| Component | Subcomponent | Assumptions | Azure retained |
| --- | --- | --- | --- |
| **Server Depreciation** | (Total server hardware acquisition cost)/(Depreciable life) | Depreciable life = 4 years |    |
| **Storage Depreciation** | (Total storage hardware acquisition cost)/(Depreciable life) | Depreciable life = 4 years |    |
| **Fit out and Networking Equipment** | (Total network hardware acquisition cost)/(Depreciable life) | Depreciable life = 5 years |    |
| **License Amortization** | (virtualization cost + Windows Server + SQL Server + Linux OS)/(Depreciable life) | Depreciable life = 5 years | VMware licenses aren't retained; Windows, SQL and Hyper-V management software licenses are retained based on AHUB option in Azure. |

#### YOY (current state): OPEX (B) costs

| Component | Subcomponent | Assumptions | Azure retained |
| --- | --- | --- | --- |
| **Network maintenance** | Per year |     |     |
| **Storage maintenance** | Per year | Power draw per Server, Average price per KW per month based on location. |     |
| **License Support** | License support cost for virtualization + Windows Server + SQL Server + Linux OS + Windows server extended security update (ESU) + SQL Server extended security update (ESU) |     | VMware licenses aren't retained; Windows, SQL and Hyper-V management software licenses are retained based on AHUB option in Azure. |
| **Security** | Per year |  Per server annual security/protection cost.  |    |
| **Datacenter Admin cost** | Number of people * hourly cost * 730 hours | Cost per hour based on location. |     |

### On-premises with Arc and Azure (future state)

When you create a business case, by default, servers remaining on-premises are assumed to be Arc-enabled. You can disable Arc calculation by editing Azure cost assumptions.

| Component | Year 0 | Year 1 | Year 2 | Year 3 | Methodology |
| --- | --- | --- | --- | --- | --- |
| **Estate migrated per year** | 0% | 20% | 50% | 100% | User input |
 
> [!NOTE]
> Servers remaining on-premises are assumed to be Azure Arc-enabled. When you create a business case, by default, servers remaining on-premises are assumed to be Arc-enabled. You can disable Arc calculation by editing Azure cost assumptions. 

#### Future state: CAPEX and OPEX

| Component | Methodology |
| --- | --- |
| **CAPEX** | Year n CAPEX = (100- estimated migration % that year)* Year n CAPEX in current state |
| **OPEX** | Year n OPEX = (estimated migration % that year) * Total Azure TCO * (1+ infrastructure growth rate%) + (100- estimated migration % that year)* Year n OPEX in current state |
| **Future state Cash Flow** | Sum of CAPEX and OPEX per year |
| **Annual NPV**| NPV per year = (Year n Cashflow)/ (1+WACC)^n <br> WACC is defaulted to 7% and can be customized in the assumptions. |
| **Future state NPV** | Sum of annual NPV |

## Glossary

| Term | Details |
| --- | --- |
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
- [Review](best-practices-assessment.md) the best practices for creating assessments.
- Learn more on how to [build](how-to-build-a-business-case.md) and [view](how-to-view-a-business-case.md) a business case.
