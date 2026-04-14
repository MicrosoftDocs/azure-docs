---
title: Build a Business Case with Azure Migrate | Microsoft Docs
description: This article describes how to build a business case with Azure Migrate.
ms.service: azure-migrate
ms.topic: how-to
ms.date: 03/20/2025
ms.reviewer: v-uhabiba
ms.custom:
  - engagement-fy23
  - sfi-image-nochange

# Customer intent: "As a cloud architect, I want to build a business case by using Azure Migrate so that I can assess the cost and benefits of migrating on-premises workloads to Azure for effective decision-making."
---

# Build a business case (preview)

This article describes how to build a business case for on-premises servers and workloads in your datacenter with the Azure Migrate Discovery and Assessment tool.

[Azure Migrate](migrate-services-overview.md) helps you to plan and execute migration and modernization projects to Azure. Azure Migrate provides a centralized hub to track discovery, assessment, and migration of on-premises infrastructure, applications, and data to Azure. The hub provides Azure tools for assessment and migration, and non-Microsoft software development company offerings.

## Prerequisites

- Make sure that you [created](./create-manage-projects.md) an Azure Migrate project. You can also reuse an existing project to use this capability.
- After you create a project, the Azure Migrate Discovery and Assessment tool is automatically added to the project.
- Before you build the business case, you need to first discover your IT estate. You can choose one of the two [discovery sources](./concepts-business-case-calculation.md#discovery-sources) based on your use case.

## Business case overview

A business case helps you understand where Azure can bring the most value to your organization by estimating total cost of ownership (TCO), potential savings, and sustainability impact for your applications and workloads. Highlights include:

- On‑premises versus Azure (including Azure VMware Solution) TCO and year‑over‑year (YoY) cash flow.
- Current on-premises versus on-premises with Azure Arc TCO.
- Savings from Azure Hybrid Benefit, Extended Security Updates (ESUs) on Azure, and security and management with Microsoft Defender for Cloud and Azure Monitor or Azure Update Manager.
- Long-term cost savings by moving from a capital expenditure model to an operating expenditure model by paying for only what you use.
- Sustainability insights (estimated emissions on‑premises versus Azure and YoY reductions).
- Discovery insights that summarize scope, utilization, OS/DB support status, and quick wins for migration or modernization.

There are three types of migration preferences that you can choose while you build your business case.

| Migration strategy | Details | Assessment insights |
| --- | --- | --- |
| Modernize with platform as a service (PaaS) | You can get a PaaS preferred recommendation, which means that the logic identifies workloads best fit for PaaS targets. <br/><br/>General servers are recommended with a quick lift-and-shift recommendation to Azure infrastructure as a service (IaaS). | For SQL servers, sizing and cost comes from the *Recommended report with optimization strategy - Modernize to PaaS* from the Azure SQL assessment.<br/><br/> For web apps, sizing and cost comes from Azure App Service and Azure Kubernetes Service assessments, with a preference to Azure App Service. For general servers, sizing and cost comes from Azure virtual machine (VM) assessment.<br/><br/> All the recommendations are aggregated by using the heterogenous assessments.
| Migrate to all IaaS | You can get a quick lift-and-shift recommendation to Azure IaaS. | For SQL servers, sizing and cost comes from the *Instance to SQL Server on Azure VM* report. <br/><br/>For general servers and servers that host web apps, sizing and cost comes from an Azure VM assessment. <br/><br/> All the recommendations are aggregated by using the heterogenous assessments. |
| Migrate to Azure VMware Solution | You can get the TCO for a quick lift-and-shift recommendation to Azure VMware Solution. | Sizing and cost are derived from an Azure VMware Solution assessment. <br/><br/> All the recommendations are aggregated by using the heterogenous assessments. |

Business case picks Azure recommendations from heterogenous assessments, and you can access the assessments directly. For more information on sizing, readiness, and Azure cost estimates, you can open the respective assessment for the applications or workloads.

## Build a business case

To build a business case, follow these steps:

1. On the service menu, select **All projects** and then select your project.

    :::image type="content" source="./media/how-to-build-a-business-case/all-projects.png" alt-text="Screenshot that shows how to build a project.":::

1. On the **Overview** tab, on the **Business case** card, select **Build business case**.

    :::image type="content" source="./media/how-to-build-a-business-case/build-a-business-case.png" alt-text="Screenshot that shows the Build business case card.":::

    > [!Note]
    > We recommend that you wait at least a day after you start discovery before you build a business case. This period allows for adequate performance and resource utilization data collection. Also, review the **Action Center** pane on the Azure Migrate **Overview** page to identify any discovery-related issues. This check ensures a more accurate representation of your datacenter's IT estate, which makes the business case recommendations more valuable.

1. For **Business case name**, specify a name for the business case. Make sure that the business case name is unique within a project. Otherwise, the previous business case with the same name gets recomputed.

1. Select the scope of the business case:

   1. Select **Entire datacenter** to create a business case for all discovered applications and workloads.

      :::image type="content" source="./media/how-to-build-a-business-case/entire-data-center.png" alt-text="Screenshot that shows how to select the entire datacenter.":::

   1. Choose **Selected workloads** to create a business case for a specific set of applications and workloads.
1. Select **Add applications** and **Add workloads** to choose the applications and workloads that you want to include in your business case. You can filter and select based on the tags and criteria that you set.
1. Select **Next**.

    :::image type="content" source="./media/how-to-build-a-business-case/add-workloads.png" alt-text="Screenshot that shows how to add workloads.":::

1. In **Target location**, specify the Azure region to which you want to migrate.

   Azure product size and cost recommendations are based on the location that you specify.

1. In **Migration preference**, specify the migration preference for your business case:

    - Keep the default **Modernize** option for the most cost-efficient and compatible target recommendation in Azure across Azure platform-as-a-service (PaaS) targets. The fallback is to IaaS targets if workloads aren't ready to be modernized to PaaS targets.
    - Select the **Migrate** option for a quick lift-and-shift recommendation to Azure IaaS offerings like Azure Virtual Machines and Azure VMware Solution.
    - Select **Azure Virtual Machines** as the preferred target for a quick lift-and-shift recommendation to Azure Virtual Machines.
    - Select **Azure VMware Solution** as the preferred target for the most cost-effective and compatible target recommendation for hosting workloads on Azure VMware Solution.
    > [!NOTE]
    > Only reserved instances are available as a savings option for migrating to Azure VMware Solution.

1. In **Savings options**, specify the combination that you want to consider to optimize Azure costs to maximize savings.

    Based on the availability of the savings option in your selected region and the targets, the business case recommends the appropriate options to help you save the most on Azure:

    - Select **Reserved Instance** if your datacenter mainly consists of resources that run consistently.
    - Select **Reserved Instance** and **Azure Savings Plan** if you need more flexibility and automated cost optimization for workloads eligible under an Azure savings plan. (Compute targets include Azure Virtual Machines and Azure App Service.)

1. In **Discount (%) on Pay as you go**, add any subscription-specific discounts that you receive on top of the Azure offer. The default setting is 0%. The discount doesn't apply on top of a reserved instance savings option.
1. In **Currency**, select the currency that you want to use to create the business case.
1. Review your selected inputs, and then select **Build business case**.

    :::image type="content" source="./media/how-to-build-a-business-case/review-and-build.png" alt-text="Screenshot that shows how to review and build a business case.":::

## Related content

- [Learn more](how-to-view-a-business-case.md) about how to review the business case reports.
