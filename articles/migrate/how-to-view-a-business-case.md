---
title: Review a Business Case with Azure Migrate | Microsoft Docs
description: This article describes how to review a business case with Azure Migrate.
ms.topic: how-to
ms.service: azure-migrate
ms.reviewer: v-uhabiba
ms.date: 02/06/2025
ms.custom: engagement-fy24

# Customer intent: As a cloud solutions architect, I want to review business case reports by using a migration assessment tool so that I can effectively plan and evaluate the cost savings and operational benefits of migrating on-premises workloads to the cloud.
---

# View a business case (preview)

This article describes how to review the business case reports for on-premises applications and workloads in your datacenter with Azure Migrate.

[Azure Migrate](migrate-services-overview.md) helps you to plan and execute migration and modernization projects to Azure. Azure Migrate provides a centralized hub to track discovery, assessment, and migration of on-premises infrastructure, applications, and data to Azure.

## Prerequisites

[Build](how-to-build-a-business-case.md) a business case if you didn't build one earlier.

## Review the business case

You need to review five major reports:

- **Overview**: This report is an executive summary of the business case and covers:

    - Potential savings in total cost of ownership (TCO).
    - Estimated year-over-year cash-flow savings based on the estimated migration completed that year.
    - Savings from unique Azure benefits like Azure Hybrid Benefit.
    - Carbon emissions reductions by moving to Azure.
    - Savings from security and management capabilities.
    - Discovery insights covering the scope of the business case.
    - Support status of the operating system and database licenses.

- **Current on-premises versus future**: This report covers the breakdown of the TCO by cost categories and insights on savings.
- **Migration strategies**: This unified view maps recommended targets to Gartner's 6R motions and shows both cost and savings.
- **On-premises with Azure Arc**: This report covers the breakdown of the TCO for your on-premises estate with and without Azure Arc.
- **On-premises versus Azure VMware Solution**: If you build a business case with the migration preference as **Migrate to IaaS** and the preferred target as **Azure VMware Solution**, this report covers the Azure VMware Solution and on-premises footprint of the workloads for migrating to Azure VMware Solution.

## View a business case

1. On the service menu, select **Business cases**.
1. On the **Business case** card, select a business case to open it.

You can also open the most recently created business case directly from the business case card on the **Overview** tab.

## Overview report

### Potential savings

This card covers your potential TCO savings based on the chosen migration strategy. One-year savings from compute, storage, network, labor, and facilities cost (based on assumptions) help you envision how Azure benefits can turn into cost savings. You can see the insights of different cost categories in the **On-premises versus Azure** report.

### Estimated on-premises cost

This card covers the cost of running all the servers scoped in the business case by using some of the industry benchmarks. It includes the one-time cost for some of the capital expenditures, like hardware acquisition. It also includes the annual cost for other components that you might pay as operating expenses, such as maintenance.

### Estimated Azure cost

This card covers the cost of all servers and workloads that were identified as ready for migration or modernization according to the recommendation. Refer to the respective **Migration strategies** report for details.

The Azure cost is calculated based on the rightsized Azure configuration, the ideal migration target, and the most suitable pricing offers for your workloads. You can override the migration strategy, target location, or other settings in the Azure cost assumptions to see how your savings could change by migrating to Azure.

### Year-over-year estimated current vs. future state cost

As you plan to migrate to Azure in phases, this line chart shows your cash flow per year based on the estimated migration completed that year. By default, it assumes that you migrate 0% in the current year, 20% in Year 1, 50% in Year 2, and 100% in Year 3.

- The current state cost shows what your net cash flow is on-premises if your infrastructure grows at 5% per year.
- The future state cost shows what your net cash flow is when you migrate some percentage to Azure per year, as in the **Azure cost** assumptions, while your infrastructure grows at 5% per year.

### Savings with Azure Hybrid Benefit

This card shows a static percentage of maximum savings that you could get with Azure Hybrid Benefit.

### Savings with Extended Security Updates

This card shows the potential savings with respect to an Extended Security Updates (ESU) license. It's the cost of the ESU licenses that are required to run Windows Server and SQL Server securely after the end of support of its licenses on-premises. ESUs are offered at no extra cost on Azure.

### Savings with security and management

This card shows the potential savings with respect to securing your migration with Microsoft Defender for Cloud and Azure management services. Services like Azure Monitor, Azure Backup, and Azure Update Manager help you to streamline your operations.

## Sustainability insights: Lower emissions with Azure

The **Sustainability benefits** capability is now embedded in the Azure Migrate business case feature. It empowers IT, finance, and sustainability teams to:

- **Estimate on-premises emissions**: Uses a standardized methodology (MtCO₂e) that considers compute, storage, power usage, and geographic carbon intensity.
- **Compare against Azure emissions**: Calculates by using the Microsoft internally validated carbon rate cards for each product and region.
- **Visualize year-over-year reductions**: Shows reductions as workloads migrate from on-premises to Azure.
- **Align cross-functional stakeholders**: Presents both economic and environmental benefits in one unified view.

### Scoped items

This report covers the total servers and applications that are scoped in the business case computation. Virtualization distribution, utilization insights, support status of the licenses, and distribution of servers are based on the workloads that run on them.

## Current on-premises vs. future report

This report covers the breakdown of the TCO by cost categories and insights on savings.

:::image type="content" source="./media/how-to-view-a-business-case/comparison-inline.png" alt-text="Screenshot that shows on-premises and Azure comparison." lightbox="./media/how-to-view-a-business-case/comparison-expanded.png":::

## Migration strategies report

This report contains detailed insights about the Azure costs for the applications and workloads ready to be migrated or modernized to Azure.

- Azure cost details:

    - **Azure cost**: This card includes the cost and savings distribution between applications (custom and commercial off-the-shelf) and workloads ready for migration.
    - **Compute and license cost**: This card shows the comparison of compute and license cost with and without Azure Hybrid Benefit.
    - **Estimated cost by recommended offer**: This card includes the compute cost for products on Azure. We recommend that all idle servers are migrated via pay as you go. Dev/test and others (active and unknown) are migrated by using a three-year reserved instance or a three-year Azure savings plan to maximize savings.

- Cost details by migration strategy:

    - **Rehost**: Covers the costs of applications and workloads rehosted to targets such as Azure VMs or SQL Server on Azure VMs.
    - **Replatform**: Covers the costs of applications and workloads replatformed to targets such as Azure SQL Managed Instance or Azure App Service.
    - **Refactor**: Covers the costs of applications and workloads refactored to Azure native-PaaS and serverless services.
    - **Retain**: Covers the costs of Azure Arc-enabling applications and workloads retained in their current state without migration or modernization to Azure.
    - **Retire**: Covers the savings from applications and workloads that are planned for retirement in instances where the workload is decommissioned.

- Cost details by Azure target:

    - **Infrastructure cost**: This card shows the cost split of applications and workloads moving to infrastructure targets (for example, Azure VMs, Azure VMware Solution, and SQL Server on Azure VMs).
    - **Database cost**: This card shows the cost of application workloads moving to database targets on Azure (for example, Azure SQL Database or Azure SQL Managed Instance and Azure Database for MySQL).
    - **Azure Web App cost**: This card shows the cost of application workloads moving to Azure Web App targets on Azure (for example, Azure App Service and Azure Kubernetes Service).

---

## On-premises with Azure Arc report

This section contains the cost and savings estimate by enabling your on-premises estate with Azure Arc.

#### Azure Arc cost estimate

   - **Compute and license cost**: The cost is estimated as a sum of the total server hardware acquisition cost on-premises, software cost (Windows license, SQL license, and virtualization software cost), and maintenance cost. The SQL license cost assumes the use of a pay-as-you-go model via Azure Arc-enabled SQL Server. Payment for ESU licenses for Windows Server and SQL Server is also assumed to occur via Azure through ESUs enabled by Azure Arc.
   - **Security and management cost**: Security cost is estimated as the sum of the total protection cost for general servers and SQL workloads by using Defender for Cloud via Azure Arc. Management cost is estimated as the sum of the total management cost for general servers.
   - **Storage, network, and facilities cost**: Storage cost is cost per GB, and you can customize it in the assumptions. The network and facilities costs are considered the same as the current on-premises costs.

#### Azure Arc savings

   - **Estimated ESU savings**: This report includes the savings by paying ESUs monthly instead of annual licensing and deploying them seamlessly to your on-premises servers.
   - **IT productivity savings**: This report includes productivity and management savings. Azure Arc improves IT productivity by reducing the time spent on routine activities.
   - **Threat protection and savings by using Defender for Cloud**: This report also includes the savings by using Defender for Cloud to secure your on-premises server. You can mitigate threats 50% faster and improve your security posture with Defender for Cloud.

:::image type="content" source="./media/how-to-view-a-business-case/azure-arc-inline.png" alt-text="Screenshot that shows a comparison of on-premises servers with and without Azure Arc." lightbox="./media/how-to-view-a-business-case/azure-arc-expanded.png":::

## Related content

- [Learn more](concepts-business-case-calculation.md) about how business cases are calculated.