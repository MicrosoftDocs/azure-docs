---
title: Business Case in Azure Migrate 
description: Learn what a business case in Azure Migrate is, what reports it contains, and the core concepts and formulas that are used.
ms.topic: concept-article
ms.service: azure-migrate
ms.reviewer: v-uhabiba
ms.date: 10/29/2024
ms.custom: engagement-fy25
# Customer intent: "As a business analyst, I want to create a business case for migrating to the cloud so that I can assess potential cost savings and identify the most suitable migration strategies for my organization."
---

# Business case (preview) overview

Azure Migrate helps you plan and execute migration and modernization to Azure through a centralized hub for discovery, assessment, and migration.

## What is a business case?

A *business case* helps you understand where Azure can bring the most value to your organization by estimating total cost of ownership (TCO), potential savings, and sustainability impact for your applications and workloads. Here are highlights:

- On‑premises versus Azure TCO and year‑over‑year cash flow.
- Current on-premises versus on-premises with Azure Arc TCO.
- Savings from Azure Hybrid Benefit, Extended Security Updates (ESUs) on Azure, and security and management with Defender for Cloud and Azure Monitor or Azure Update Manager.
- Long-term cost savings by moving from a capital expenditure model to an operating expenditure model by paying for only what you use.
- Sustainability insights (estimated emissions on‑premises versus Azure and year‑over‑year reductions).
- Discovery insights that summarize scope, utilization, OS/database support status, and quick wins for migration or modernization.

You can use this capability only to create business cases in public cloud regions. For Azure Government, you can use the existing assessment capability.

## What comprises a business case?

The new experience organizes reports in the following ways:

- **Overview**: Contains the executive summary with potential savings, year‑over‑year cash flow, cloud benefits (Azure Hybrid Benefit, ESUs, security and management), sustainability insights, and discovery insights.
- **Current on‑premises versus Azure**: Shows a side‑by‑side TCO breakdown and insights across cost categories.
- **Migration strategies**: Presents a unified view that maps recommended targets to Gartner's 6R motions and shows both cost and savings.
- **On‑premises versus Azure Arc**: Compares on‑premises TCO with and without Azure Arc and summarizes savings and benefits specific to Azure Arc.
- **Azure cost (assumptions)**: Inputs controlling target region, migration cadence and growth, savings options, comfort factor, and other modeling settings.

> [!NOTE]
> The earlier standalone **Azure IaaS** and **Azure PaaS** pages are replaced by the unified **Migration strategies** page.

## Migration preferences in a business case

There are two types of migration preferences that you can choose when you build your business case.

| Migration strategy | Details | Assessment insights |
| --- | --- | --- |
| Modernize with platform as a service (PaaS) | You can get a PaaS preferred recommendation, which means that the logic identifies workloads best fit for PaaS targets. <br/><br/>General servers are recommended with a quick lift-and-shift recommendation to Azure infrastructure as a service (IaaS). | For SQL servers, sizing and cost comes from the *Recommended report with optimization strategy - Modernize to PaaS* from the Azure SQL assessment.<br/><br/> For web apps, sizing and cost comes from Azure App Service and Azure Kubernetes Service assessments, with a preference to Azure App Service. For general servers, sizing and cost comes from Azure virtual machine (VM) assessment.<br/><br/> All the recommendations are aggregated by using the heterogenous assessments.
| Migrate to all IaaS | You can get a quick lift-and-shift recommendation to Azure IaaS. | For SQL servers, sizing and cost comes from the *Instance to SQL Server on Azure VM* report. <br/><br/>For general servers and servers that host web apps, sizing and cost comes from an Azure VM assessment. <br/><br/> All the recommendations are aggregated by using the heterogenous assessments. |

A business case picks Azure recommendations from heterogenous assessments, and you can access the assessments directly. For more information on sizing, readiness, and Azure cost estimates, you can open the respective assessment for the applications or workloads.

## Discovery sources

You can build a business case by using the following options:

- **Azure Migrate appliance discovery or Azure Migrate collector-based discovery**: Use for the most accurate metadata and performance data.
- **Comma-separated value (CSV) import**: Use for a quick estimate when inventory is available as a CSV.

## Key concepts and formulas (summary)

### TCO (steady state): On-premises cost

Cost components for running on-premises servers. For TCO calculations, an annual cost is computed for the following heads.

| Cost heads | Category | Component | Logic |
| --- | --- | --- | --- |
| Compute | Hardware | Server hardware (host machines) | Total hardware acquisition cost is calculated by using a cost per core linear regression formula: Cost per core = 16.232 * (Hyperthreaded core: memory in GB ratio) + 113.87. Hyperthreaded cores = 2 * (cores). |
|     | Software - SQL Server licensing | License cost | Calculated per two-core pack license pricing of 2019 Enterprise or Standard. |
|     | SQL Server - ESU | License cost | Calculated for three years after the end of support of a SQL Server license as follows:<br/><br/> ESU (Year 1) – 75% of the license cost. <br/><br/> ESU (Year 2) – 100% of the license cost. <br/><br/> ESU (Year 3) – 125% of the license cost. <br/><br/> |
|     |     | Software Assurance | Calculated per year as in settings. |
|     | Software - Windows Server licensing | License cost | Calculated per two-core pack license pricing of Windows Server. |
|     | Windows Server - ESUs | License cost | Calculated for three years after the end of support of a Windows Server license: <br/><br/> ESU (Year 1) – 75% of the license cost. <br/><br/> ESU (Year 2) – 100% of the license cost. <br/><br/> ESU (Year 3) – 125% of the license cost. <br/><br/>|
|     |     | Software Assurance | Calculated per year as in settings. |
|     | Virtualization software for servers running in VMware environment | Virtualization software (VMware license cost) | License cost based on VMware Cloud Foundation licensing. |
| Storage | Storage hardware |     | The total storage hardware acquisition cost is calculated by multiplying the total volume of storage attached to per GB cost. Default is $2 per GB. |
|     | Storage maintenance |     | Default is 10% of storage hardware acquisition cost. |
| Network | Network hardware and software | Calculated based on the number of cabinets and routers required. Default cost per cabinet is $906, and the default number of physical servers per cabinet is 16. |
|     | Maintenance | Maintenance | Defaulted to 15% of network hardware and software cost. |
| Security | General servers | Server security cost | Default is $250 per year per server. This amount is multiplied with the number of servers (general servers). |
|     | SQL servers | SQL protection cost | Default is $1,000 per year per server. This amount is multiplied with the number of servers running SQL. |
| Facilities | Facilities & infrastructure | DC facilities - Lease and power | The facilities cost is based on a colocation model, which includes space, power, and lease costs per kWh.<br> Annual facilities cost = Total energy capacity * Average colocation costs * 12. (Assume that 40% of datacenter energy capacity remains unused.) <br> Total energy capacity = Energy consumption by current workloads/(1 - unused energy capacity). <br>To determine energy consumption for your workloads: <br>- Compute resources: Total physical cores * On-premises thermal design power (TDP) (0.009 kWh per core) * Load factor (2.00) * On-premises power usage effectiveness (PUE) (1.80).<br> - Storage resources: Total storage in TB * On-premises storage power rating (10 kWh per TB) * Conversion factor (0.0001) * Load factor (2.00) * On-premises PUE (1.80). |
| Labor | Labor | IT admin | DC admin cost = Number of VMs/Average number of VMs that a full-time administrator can manage * Average hourly rate for an IT administrator * Average yearly working hours. |
| Management | Management software licensing | System Center management software | Used for cost of the System Center management software that includes monitoring, hardware and VM provisioning, automation, backup, and configuration management capabilities. Cost of System Center management software is added when the System Center agents are identified on any of the discovered resources. This amount applies only to scenarios related to Windows Server and SQL Server and includes Software Assurance. |
|     |    | Other management software | This amount is the cost of the management software for partner management products. |
|     | Management cost other than software | Monitoring cost | Specify costs other than monitoring software. Default is $145 per year per server. This amount is multiplied with the number of servers. The default used is the cost associated with a monitoring administrator. |
|     |    | Patch management cost | Specify costs other than patch management software. Default is $145 per year per server. This amount is multiplied by the number of servers. The default is the cost associated with a patch management administrator. |
|     |    | Backup cost | There are two components for backup cost. Default backup admin cost is $145 per server. Backup cost on-premises also includes a per-GB backup cost as $0.022 per GB. Backup costs are applied only to product servers. |

### TCO (steady state): Azure cost

| Cost heads | Category | Component | Logic |
| --- | --- | --- | --- |
|Compute | Compute (IaaS) | Azure VMs, SQL Server on Azure VMs | Compute cost (with Azure Hybrid Benefit) from Azure VM assessment. Compute cost (with Azure Hybrid Benefit) from Azure SQL assessment. |
|     | Compute (PaaS) | Azure SQL Managed Instance or Azure SQL Database | Compute cost (with Azure Hybrid Benefit) from Azure SQL assessment. |
|     | Compute (PaaS) | Azure App Service or Azure Kubernetes Service | Plan cost from Azure App Service or node pool cost from Azure Kubernetes Service. |
| Storage | Storage (IaaS) | Azure VM - Managed disks, Server on Azure VM - Managed disks | Storage cost from Azure VM assessment/Azure SQL assessment. |
|     | Storage (PaaS) | Azure SQL Managed Instance or Azure SQL Database - Managed disks | Storage cost from Azure SQL assessment. |
|     | Storage (PaaS) | N/A | N/A |
| Network | Network hardware and software | Network equipment (cabinets, switches, routers, and load balancers) and software | As an industry standard and used by sellers in business cases, it's a percentage of compute and storage cost. Default is 10% of storage and compute cost. |
|     | Maintenance | Maintenance | Defaulted to 15% of network hardware and software cost. |
| Security | Server security cost | Defender for Servers | For servers recommended for Azure VM, if they're ready to run Defender for Servers, the Defender for Servers (Plan 2) cost per server for that region is added. |
|     | SQL security cost | Defender for SQL | If SQL Server instances and databases that are recommended for SQL Server on Azure VMs, Azure SQL Managed Instance, or Azure SQL Database are ready to run Defender for SQL, the Defender for SQL per SQL Server instance for that region is added. For databases recommended to Azure SQL Database, cost is rolled up at instance level. |
|     | Azure App Service security cost | Defender for App Service | For web apps recommended for App Service or App Service containers, the Defender for App Service cost for that region is added. |
| Facilities | Facilities & infrastructure | DC facilities - Lease and power | Facilities cost isn't applicable for Azure cost. |
| Labor | Labor | IT admin | DC admin cost = number of VMs/average number of VMs that a full-time administrator can manage * 730 * 12. |
| Management | Azure management services | Azure Monitor, Azure Backup, and Azure Update Manager | Azure Monitor costs for each server are according to the listed price in the region. The costs also assume log ingestion for the guest operating system and that one custom application is enabled for the server. The total for logs data is 3 GB per month. <br/><br/> Azure Backup cost for each server per month is dynamically estimated based on the [Azure Backup Pricing](/azure/backup/azure-backup-pricing), which includes a protected instance fee, snapshot storage, and recovery services vault storage. <br/><br/> Azure Update Manager is free for Azure servers. |
| Azure Arc setting  |  |  | For your on-premises servers, this setting assumes that you enabled all of your servers for Azure Arc at the beginning of the migration journey. It also assumes that you'll migrate them to Azure over time. Azure Arc helps you manage your Azure estate and remaining on-premises estate through a single pane during migration and post-migration. |

### TCO (steady state): On-premises with Azure Arc cost

| Cost heads | Category | Component | Logic |
| --- | --- | --- | --- |
| Compute and licensing | Hardware and licenses | Server hardware (host machines) and licenses | Estimated as a sum of total server hardware acquisition cost + software cost (Windows license + SQL license + virtualization software cost) + maintenance cost. </br> Total hardware acquisition cost is calculated by using a cost per core linear regression formula. </br> SQL license cost is assumed to be using the pay-as-you-go model via Azure Arc-enabled SQL Server. Payment for ESU licenses for Windows Server and SQL Server is also assumed to occur via Azure through ESUs enabled by Azure Arc. |
| Storage | Storage hardware |   | Estimated as a sum of total storage hardware acquisition cost + software maintenance cost. <br> Total storage hardware acquisition cost = Total volume of storage attached to VMs (across all machines) * Cost per GB per month * 12. You can customize the cost per GB in the assumptions similar to the current on-premises storage cost. |
| Network | Network hardware and software | Network equipment (such as cabinets, switches, routers, and load balancers) and software.  | Estimated as a sum of total network hardware and software cost + network maintenance cost. Total network hardware and software cost defaults to 10% * (compute and licensing + storage cost). You can customize the cost in the assumptions. Network maintenance cost is defaulted to 15% * (total network hardware and software cost). You can customize the cost in the assumptions. Same as current on-premises networking cost. |
| Security | General servers | Server security cost | Estimated as the sum of the total protection cost for general servers and SQL workloads by using Defender for Cloud via Azure Arc. Defender for Cloud Servers Plan 2 is assumed for servers. Defender for SQL on Azure-connected databases is assumed for SQL Server. |
| Facilities | Facilities & infrastructure | DC facilities - Lease and power | The facilities cost is based on a colocation model, which includes space, power, and lease costs per kWh.<br> Annual facilities cost = Total energy capacity * Average colocation costs * 12. (Assume 40% of datacenter energy capacity remains unused.) <br> Total energy capacity = Energy consumption by current workloads/(1 - unused energy capacity). <br>To determine energy consumption for your workloads: <br>- Compute resources: Total physical cores * On-premises TDP (0.009 kWh per core) * Load factor (2.00) * On-premises PUE (1.80).<br>- Storage resources: Total storage in TB * On-premises storage power rating (10 kWh per TB) * Conversion factor (0.0001) * Load factor (2.00) * On-premises PUE (1.80). |
| Labor | Labor  | IT admin | Same as current on-premises labor cost.|
| Management | Management software licensing | System Center or other management software | Estimated as sum of total management cost for general servers. This amount includes monitoring and patching. Patching is assumed to be free via Azure Update Manager because Defender for Cloud Servers Plan 2 includes it. Monitoring cost is calculated per day based on log storage and alerts and multiplied * 365. The cost is estimated as 70% of on-premises management labor cost by default. The assumption is that 30% of labor effects could be redirected to other high-impact projects for the company because of productivity improvements. You can customize labor costs in the Azure Arc setting under Azure cost assumptions. |

### Year-over-year costs (current state): On-premises cost

| Component | Year 0 | Year 1 | Year 2 | Year 3 | Year 4 |
| --- | --- | --- | --- | --- | --- |
| Capital expense (CAPEX) | Total CAPEX (A) | Y1 CAPEX = Total CAPEX (A) * (1+server growth rate%) | Y2 CAPEX = Y1 CAPEX (A) * (1+server growth rate%) | Y3 CAPEX = Y2 CAPEX (A) * (1+server growth rate%) | Y4 CAPEX = Y3 CAPEX (A) * (1+server growth rate%) |
| OPEX | Total OPEX (B) | Y1 OPEX = Total OPEX (B) * (1+server growth rate%) | Y2 OPEX = Y1 OPEX (B) * (1+server growth rate%) | Y3 OPEX = Y2 OPEX (B) * (1+server growth rate%) | Y4 OPEX = Y3 OPEX (B) * (1+server growth rate%) |
| Status quo cash flow | Y0 cash flow = Total CAPEX (A) + Total OPEX (B) | Y1 cash flow = Y1 CAPEX+ Y1 OPEX | Y2 cash flow = Y2 CAPEX + Y2 OPEX | Y3 cash flow = Y3 CAPEX (A) + Y3 OPEX (B) | Y4 cash flow = Y4 CAPEX (A) + Y4 OPEX (B) |

#### Year over year (current state): CAPEX (A) costs

| Component | Subcomponent | Assumptions | Azure retained |
| --- | --- | --- | --- |
| Server depreciation | (Total server hardware acquisition cost)/(Depreciable life) | Depreciable life = 4 years |    |
| Storage depreciation | (Total storage hardware acquisition cost)/(Depreciable life) | Depreciable life = 4 years |    |
| Fit out and networking equipment | (Total network hardware acquisition cost)/(Depreciable life) | Depreciable life = 5 years |    |
| License amortization | (Virtualization cost + Windows Server + SQL Server + Linux OS)/(Depreciable life) | Depreciable life = 5 years | VMware licenses aren't retained. Windows, SQL, and Hyper-V management software licenses are retained based on Azure Hybrid Benefit option in Azure. |

#### Year over year (current state): OPEX (B) costs

| Component | Subcomponent | Assumptions | Azure retained |
| --- | --- | --- | --- |
| Network maintenance | Per year |     |     |
| Storage maintenance | Per year | Power draw per server. Average price per kW per month based on location. |     |
| License support | License support cost for virtualization + Windows Server + SQL Server + Linux OS + Windows Server ESU + SQL Server ESU |     | VMware licenses aren't retained. Windows, SQL, and Hyper-V management software licenses are retained based on Azure Hybrid Benefit option in Azure. |
| Security | Per year |  Per server, annual security/protection cost.  |    |
| Datacenter admin cost | Number of people * hourly cost * 730 hours | Cost per hour based on location. |     |

## Sustainability insights: Lower emissions with Azure

The sustainability benefits capability is now embedded in the Azure Migrate business case. It empowers IT, finance, and sustainability teams to:

- Estimate on-premises emissions (in MtCO₂e) by using a standardized methodology considering compute, storage, power usage, and geographic carbon intensity.
- Compare against Azure emissions calculated by using the Microsoft internally validated carbon rate cards for each product and region.
- Visualize year-over-year reduction as workloads migrate from on-premises to Azure.
- Align cross-functional stakeholders by presenting both economic and environmental benefits in one unified view.

The method to calculate these emissions is explained in the following table.

| Category | Component | Logic |
| --- | --- | --- |
| On-premises emissions | Scope 1 emissions | Scope 1 includes emissions from on-premises generators that use fossil fuels. <br/><br/> Scope 1 emissions (MtCO₂e)  = Number of generators (1) * Average usage hours (2 hours per year) * Fuel consumption (0.4 L/hp hour) * Power output (1,000 hp) * Fuel emission factor (0.002 MtCO2e/L) * Power alignment factor.
|  | Scope 2 emissions – Compute emissions + Storage emissions | Scope 2 includes indirect emissions from the electricity used by physical servers. <br/><br/> Scope 2 compute emissions (MtCO2e) = Total cores count * Hours in a year * On-premises TDP (0.009 kWh per core) * On-premises PUE (1.8) * On-premises carbon intensity (based on region) * (1-% Power from renewable sources). <br/><br/> Scope 2 storage emissions (MtCO2e) = Total storage capacity (TB) * On-premises storage power rating (10 kWh/year per TB) * On-premises PUE (1.8) * On-premises carbon intensity (based on region) * (1-% Power from renewable sources). </br><br/> These calculations use the market view for emissions. To calculate location view, follow the same steps but skip the adjustment for renewable energy.
|  | Scope 3 emissions | Scope 3 accounts for emissions embedded in the manufacture, transport, and end of life of physical servers. <br/><br/> Scope 3 compute emissions (MtCO2e) – Total physical servers * {Manufacturing share of total emissions (18.2%) + Transport share of total emissions (0.1%) + End-of-life share of total emissions (0.5%)}. <br/><br/> Scope 3 storage emissions (MtCO2e) – Total storage (in TB) * {Manufacturing share of total emissions (58 MtCO2e) + Transport share of total emissions (2 MtCO2e) + End-of-life share of total emissions (1 MtCO2e)} (MtCO2e) – Total physical servers * {Manufacturing share of total emissions (18.2%) + Transport share of total emissions (0.1%) + End-of-life share of total emissions (0.5%)}.
| Azure emissions | Scope 1, Scope 2, and Scope 3 | Azure emissions are powered by Microsoft's carbon rate card. For more information, see [Calculation methodology](/industry/sustainability/sustainability-data-solutions-fabric/azure-emissions-insights-calculation-methodology). The calculation methodology ensures consistency and transparency across the Microsoft sustainability offerings.

### On-premises with Azure Arc and Azure (future state)

When you create a business case, by default, servers that remain on-premises are assumed to be Azure Arc-enabled. You can disable Azure Arc calculation by editing Azure cost assumptions.

| Component | Year 0 | Year 1 | Year 2 | Year 3 | Methodology |
| --- | --- | --- | --- | --- | --- |
| Estate migrated per year | 0% | 20% | 50% | 100% | User input |
 
> [!NOTE]
> Servers remaining on-premises are assumed to be Azure Arc-enabled. When you create a business case, by default, servers that remain on-premises are assumed to be Azure Arc-enabled. You can disable Azure Arc calculation by editing Azure cost assumptions.

#### Future state: CAPEX and OPEX

| Component | Methodology |
| --- | --- |
| CAPEX | Year n CAPEX = (100- estimated migration % that year) * Year n CAPEX in current state. |
| OPEX | Year n OPEX = (estimated migration % that year) * Total Azure TCO * (1+ infrastructure growth rate%) + (100- estimated migration % that year) * Year n OPEX in current state. |
| Future state cash flow | Sum of CAPEX and OPEX per year. |
| Annual net present value (NPV)| NPV per year = (Year n cash flow)/(1+weighted average cost of capital)^n. <br> Weighted average cost of capital is defaulted to 7%. You can customize it in the assumptions. |
| Future state NPV | Sum of annual NPV. |

## Glossary

| Term | Details |
| --- | --- |
| Business case | A business case provides justification for a go/no go for a project. It evaluates the benefit, cost, and risk of alternative options and provides a rationale for the preferred solution. |
| Total cost of ownership | TCO is a financial estimate to help companies precisely calculate the economic impact during the whole life cycle of IT projects. |
| Return on investment (ROI) | A project's expected return in percentage terms. ROI is calculated by dividing net benefits (benefits less costs) by costs. |
| Cash flow statement | It explains how much cash went out and in the door for a business. |
| Net cash flow | It's the difference between the money coming in and the money coming out of your business for a specific period. |
| Net present value | The present or current value of (discounted) future net cash flows given an interest rate (the discount rate). A positive project NPV normally indicates that the investment should be made unless other projects have higher NPVs. |
| Payback period | The break-even point for an investment. It's the point in time at which net benefits (benefits minus costs) equal initial investment or cost. |
| Capital expense (CAPEX) | Upfront investments in assets that are capitalized and put into the balance sheet. |
| Operating expense (OPEX) | Running expenses of a business. |
| Defender for Cloud | To learn more about Defender for Cloud, see [Microsoft Defender for Cloud](https://www.microsoft.com/security/business/cloud-security/microsoft-defender-cloud). |

## Related content

- [Build a business case](./how-to-build-a-business-case.md)
- [View business case reports](./how-to-view-a-business-case.md)
