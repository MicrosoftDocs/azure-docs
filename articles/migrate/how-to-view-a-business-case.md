---
title: Review a business case with Azure Migrate | Microsoft Docs
description: Describes how to review a business case with Azure Migrate
author: rashi-ms
ms.author: rajosh
ms.manager: ronai
ms.topic: how-to
ms.service: azure-migrate
ms.date: 11/08/2024
ms.custom: engagement-fy25

---

# View a business case (preview)

This article describes how to review the business case reports for on-premises servers and workloads in your datacenter with Azure Migrate: Discovery and assessment tool.

[Azure Migrate](migrate-services-overview.md) helps you to plan and execute migration and modernization projects to Azure. Azure Migrate provides a centralized hub to track discovery, assessment, and migration of on-premises infrastructure, applications, and data to Azure. The hub provides Azure tools for assessment and migration, and partner Independent Software Vendor (ISV) offerings.

## Prerequisites

- [Build](how-to-build-a-business-case.md) a business case if you didn't build one earlier.

## Review the business case

There are four major reports that you need to review:
- **Overview**: This report is an executive summary of the business case and covers:
    - Potential savings (TCO).
    - Estimated year on year cashflow savings based on the estimated migration completed that year.
    - Savings from unique Azure benefits like Azure Hybrid Benefit.
    - Savings from Security and Management capabilities.
    - Discovery insights covering the scope of the business case.
    - Support status of the operating system and database licenses.
- **Current on-premises vs Future**: This report covers the breakdown of the total cost of ownership by cost categories and insights on savings.
- **On-premises with Azure Arc**: This report covers the breakdown of the total cost of ownership for your on-premises estate with and without Arc.
- **Azure IaaS**: This report covers the Azure and on-premises footprint of the servers and workloads recommended for migrating to Azure IaaS.
- **On-premises vs AVS (Azure VMware Solution)**: If you build a business case to *Migrate to AVS*, you see this report which covers the AVS and on-premises footprint of the workloads for migrating to AVS.
- **Azure PaaS**: This report covers the Azure and on-premises footprint of the workloads recommended for migrating to Azure PaaS.

## View a business case

1. In **Servers, databases and web apps** > **Azure Migrate: Discovery and assessment**, select the number below **Total migration business cases**.
1. In **Business Case**, select a business case to open it.

## Overview report

### Potential savings
This card covers your potential total cost of ownership savings based on the chosen migration strategy. It includes one year savings from compute, storage, network, labor, and facilities cost (based on assumptions) to help you envision how Azure benefits can turn into cost savings. You can see the insights of different cost categories in the **On-premises vs Azure** report.

### Estimated on-premises cost
It covers the cost of running all the servers scoped in the business case using some of the industry benchmarks. It includes one time cost for some of the capital expenditures like hardware acquisition etc., and annual cost for other components that you might pay as operating expenses like maintenance etc.

### Estimated Azure cost
It covers the cost of all servers and workloads that have been identified as ready for migration/modernization as per the recommendation. Refer to the respective [Azure IaaS](how-to-view-a-business-case.md#azure-iaas-report) and [Azure PaaS](how-to-view-a-business-case.md#azure-paas-report) report for details. The Azure cost is calculated based on the right sized Azure configuration, ideal migration target, and most suitable pricing offers for your workloads. You can override the migration strategy, target location, or other settings in the 'Azure cost' assumptions to see how your savings could change by migrating to Azure.

### YoY estimated current vs future state cost
As you plan to migrate to Azure in phases, this line chart shows your cashflow per year based on the estimated migration completed that year. By default, it's assumed that you'll migrate 0% in the current year, 20% in Year 1, 50% in Year 2, and 100% in Year 3.
- Current state cost shows how your net cashflow will be on-premises, given your infrastructure is growing 5% per year.
- The future state cost shows how your net cashflow will be as you migrate some percentage to Azure per year as in the 'Azure cost' assumptions, while your infrastructure is growing 5% per year.

### Savings with Azure Hybrid Benefits
This card shows a static percentage of maximum savings you could get with Azure hybrid Benefits. 

### Savings with Extended security updates
It shows the potential savings with respect to extended security update license. It's the cost of extended security update license required to run Windows Server and SQL Server securely after the end of support of its licenses on-premises. Extended security updates are offered at no extra cost on Azure.

### Savings with security and management

It shows the potential savings with respect to securing your migration with Microsoft Defender for Cloud and Azure Management services including Azure Monitor, Azure Backup, and Azure Update Manager for streamlining your operations.

### Discovery insights
It covers the total servers scoped in the business case computation, virtualization distribution, utilization insights, support status of the licenses, and distribution of servers based on workloads running on them.

#### Utilization insights
It covers which servers are ideal for cloud, servers that can be decommissioned on-premises, and servers that can't be classified based on resource utilization/performance data:
- Ideal for cloud: These servers are best fit for migrating to Azure and comprises of active and idle servers:
    - Active servers: These servers delivered business value by being on and had their CPU and memory utilization above 5% and network utilization above 2%.
    - Idle servers: These servers were on but didn't deliver business value by having their CPU and memory utilization below 5% and network utilization below 2%.
- Decommission: These servers were expected to deliver business value, but didn't and can be decommissioned on-premises and recommended to not migrate to Azure:
    - Zombie: The CPU, memory, and network utilization were 0% with no performance data collection issues.
- These servers were on but don't have adequate metrics available:
    - Unknown: Many servers can land in this section if the discovery is still ongoing or has some unaddressed discovery issues.
    
## Current on-premises vs future report 
This report covers the breakdown of the total cost of ownership by cost categories and insights on savings.

:::image type="content" source="./media/how-to-view-a-business-case/comparison-inline.png" alt-text="Screenshot of on-premises and Azure comparison." lightbox="./media/how-to-view-a-business-case/comparison-expanded.png":::

## Azure IaaS report

#### [Azure](#tab/iaas-azure)

This section contains the cost estimate by recommended target (Annual cost and also includes Compute, Storage, Network, labor components) and savings from Hybrid benefits.
- IaaS cost estimate:
    - **Estimated cost by target**: This card includes the cost based on the target.
    - **Compute and license cost**: This card shows the comparison of compute and license cost when using Azure hybrid benefit and without Azure hybrid benefit.
    - **Savings** - This card displays the estimated maximum savings when using Azure hybrid benefit and with extended security updates over a period of one year.
- Azure VM:
    - **Estimated cost by savings options**: This card includes compute cost for Azure VMs. It's recommended that all idle servers are migrated via Pay as you go Dev/Test and others (Active and unknown) are migrated using 3 year Reserved Instance or 3 year Azure Savings Plan to maximize savings.
    - **Recommended VM family**: This card covers the VM sizes recommended. The ones marked Unknown are the VMs that have some readiness issues and no SKUs could be found for them.
    - **Recommended storage type**: This card covers the storage cost distribution across different recommended storage types.
- SQL Server on Azure VM:
This section assumes instance to SQL Server on Azure VM migration recommendation, and the number of VMs here are the number of instances recommended to be migrated as SQL Server on Azure VM:
    - **Estimated cost by savings options**: This card includes compute cost for SQL Server on Azure VMs. It's recommended that all idle servers are migrated via Pay as you go Dev/Test and others (Active and unknown) are migrated using 3 year Reserved Instance or 3 year Azure Savings Plan to maximize savings.
    - **Recommended VM family**: This card covers the VM sizes recommended. The ones marked Unknown are the VMs that have some readiness issues and no SKUs could be found for them.
    - **Recommended storage type**: This card covers the storage cost distribution across different recommended storage types.

#### [On-premises](#tab/iaas-on-premises)

- On-premises footprint of the servers recommended to be migrated to Azure IaaS.
- Contribution of Zombie servers in the on-premises cost.
- Distribution of servers by OS, virtualization, and activity state.
- Distribution by support status of OS licenses and OS versions. 

---

## Azure PaaS report

#### [Azure](#tab/paas-azure)

This section contains the cost estimate by recommended target (Annual cost and also includes Compute, Storage, Network, labor components) and savings from Hybrid benefits.
- PaaS cost estimate:
    - **Estimated cost by target**: This card includes the cost based on the target.
    - **Compute and license cost**: This card shows the comparison of compute and license cost when using Azure hybrid benefit and without Azure hybrid benefit.
    - **Savings** - This card displays the estimated maximum savings when using Azure hybrid benefit and with extended security updates over a period of one year.
- Azure SQL:
    - **Estimated cost by savings options**: This card includes compute cost for Azure SQL MI. It's recommended that all idle SQL instances are migrated via Pay as you go Dev/Test and others (Active and unknown) are migrated using 3 year Reserved Instance to maximize savings.
    - **Distribution by recommended service tier** : This card covers the recommended service tier.
- Azure App Service and App Service Container:
   - **Estimated cost by savings options**: This card includes Azure App Service Plans cost. It's recommended that the web apps are migrated using 3 year Reserved Instance or 3 year Savings Plan to maximize savings.
   - **Distribution by recommended plans** : This card covers the recommended App Service plan.
- Azure Kubernetes Service:
   - **Estimated cost by savings options**: This card includes the cost of the recommended AKS node pools. It's recommended that the web apps are migrated using 3 year Reserved Instance or 3 year Savings Plan to maximize savings.
   - **Distribution by recommended Node pool SKU**: This card covers the recommended SKUs for AKS node pools.

#### [On-premises](#tab/paas-on-premises)

- On-premises footprint of the servers recommended to be migrated to Azure PaaS.
- Contribution of Zombie SQL instances in the on-premises cost.
- Distribution by support status of OS licenses and OS versions.
- Distribution of SQL instances by SQL version and activity state.

---

## On-premises vs AVS report
It covers cost components for on-premises and AVS, savings, and insights to understand the savings better.
:::image type="content" source="./media/how-to-view-a-business-case/comparison-avs-inline.png" alt-text="Screenshot of on-premises and AVS comparison." lightbox="./media/how-to-view-a-business-case/comparison-avs-expanded.png":::

## AVS report

#### [AVS (Azure VMware Solution)](#tab/avs-azure)

This section contains the cost estimate by recommended target (Annual cost includes Compute, Storage, Network, labor components) and savings from Hybrid benefits.

#### AVS cost estimate

**Estimated AVS cost**:  This card includes the total cost of ownership for hosting all workloads on AVS including the AVS nodes cost (which includes storage cost), networking, and labor cost. The node cost is computed by taking the most cost optimum AVS node SKU. The infrastructure settings used are as follows:
    
- The number and SKU of AVS hosts used in a business case aligns to the SKUs available in the given region and optimized to use the least number of nodes required to host all VMs ready to be migrated.
- Azure NetApp File (ANF) is used when it can be used to optimize the number of AVS hosts required. ANF Standard tier is used when the VMs have been imported using RVTools. For an Azure Migrate appliance-based business case, the tier of ANF used in the business case depends on the IOPS & throughput data for VMs. 
    - CPU over-subscription of 4:1
    - Memory overcommit of 100% 
    - Compression and deduplication factor of 1.5. You can learn more about this [here](concepts-azure-vmware-solution-assessment-calculation.md#whats-in-an-azure-vmware-solution-assessment). 

**Compute and license cost**: This card shows the comparison of compute and license cost when using Azure hybrid benefit and without Azure hybrid benefit. 

#### Savings and optimization:
    
**Savings with 3-year RI**: This card shows the node cost with 3-year RI.

**Savings with Azure Hybrid Benefit & Extended Security Updates**: This card displays the estimated maximum savings when using Azure hybrid benefit and with extended security updates over a period of one year.

:::image type="content" source="./media/how-to-view-a-business-case/avs-estimation-inline.png" alt-text="Screenshot of AVS estimation." lightbox="./media/how-to-view-a-business-case/avs-estimation-expanded.png":::

#### [On-premises](#tab/avs-on-premises)

- On-premises footprint of the servers recommended to be migrated to AVS.
- Contribution of Zombie servers in the on-premises cost.
- Distribution of servers by OS, virtualization, and activity state.
- Distribution by support status of OS licenses and OS versions. 

---

## On-premises with Azure Arc report 
This section contains the cost and savings estimate by Arc-enabling your on-premises estate: 

#### Arc cost estimate
   - **Compute and license cost**: Estimated as a sum of total server hardware acquisition cost on-premises, software cost (Windows license, SQL license, Virtualization software cost), and maintenance cost, SQL license cost is assumed to be using pay-as-you-go model via Arc-enabled SQL Server. ESU licenses for Windows Server and SQL Server are also assumed to be paid via Azure through ESUs enabled by Azure Arc.
   - **Security and Management Cost**: Security cost is estimated as sum of total protection cost for general servers and SQL workloads using MDC via Azure Arc and management cost is estimated as sum of total management cost  for general servers.
   - **Storage, Network and facilities cost** : Storage cost is Cost per GB and can be customized in the assumptions. Network and facilities cost is considered same as that of current on-premises costs.
#### Arc savings
   - **Estimated ESU savings**: This report includes the savings by paying ESUs monthly instead of annual licensing and deploying them seamlessly to your on-premises servers.
   - **IT Productivity Savings**: Azure Arc improves IT productivity by reducing the time they spend on routine activities. This report includes that and management savings.
   - **Threat protection and Savings using MDC**: The report also includes  the savings by using Microsoft Defender for Cloud to secure your on-premises server. You can mitigate threats 50% faster and improve your security posture with Microsoft Defender for cloud.

:::image type="content" source="./media/how-to-view-a-business-case/azure-arc-inline.png" alt-text="Screenshot of comparison of on-premises servers with Arc and without Arc." lightbox="./media/how-to-view-a-business-case/azure-arc-expanded.png":::


## Next steps
- [Learn more](concepts-business-case-calculation.md) about how business cases are calculated.