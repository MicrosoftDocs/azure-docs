---
title: Create an Azure Spring Apps assessment
description: Learn how to assess apps for migration to Azure Spring Apps
author: yangyizhe90
ms.author: yangtony
ms.topic: tutorial
ms.service: azure-migrate
ms.date: 09/04/2023
ms.custom: engagement-fy23
---

# Create an Azure Spring Apps assessment (preview)

As part of your migration journey to Azure, you assess your on-premises workloads to measure cloud readiness, identify risks, and estimate costs and complexity.
This article shows you how to assess discovered Spring Boot apps for migration to Azure Spring Apps, using the Azure Migrate for Spring apps.

> [!Note]
> Discovery and assessment of Spring Boot apps is now in preview. If you want to try out this feature in an existing project, ensure that you meet the [prerequisites](how-to-discover-sql-existing-project.md) in this article.

## Before you start

- Ensure you've [created](./create-manage-projects.md) an Azure Migrate project and have Azure Migrate for Spring apps added.
- Set up an Azure Migrate appliance. The [appliance](migrate-appliance.md) discovers on-premises servers and sends metadata and performance data to Azure Migrate. The same appliance discovers Spring Boot apps that are running in your environment.

## Azure Spring Apps assessment overview

An Azure Spring Apps assessment provides the following sizing criteria:

**Sizing criteria** | **Details** | **Data**
--- | --- | ---
**Performance-based** | Assessment that makes recommendations based on collected resource consumption data | The Azure Spring Apps assessment is calculated based on the memory consumption of your discovered workload, and an estimated consumption of CPU cores.

[Learn more](concepts-azure-spring-apps-assessment-calculation.md) about Azure Spring Apps assessments.

## Run an assessment

Run an assessment using the following steps:

1. On the **Overview** page > **Servers, databases and web apps**, select **Discover, assess and migrate**.

    :::image type="content" source="./media/how-to-create-azure-spring-apps-assessment/discover-assess-migrate.png" alt-text="Screenshot of Overview page for Azure Migrate." lightbox="./media/how-to-create-azure-spring-apps-assessment/discover-assess-migrate.png":::

2. On **Azure Migrate: Discovery and assessment**, select **Assess** and choose the assessment type as **Azure Spring Apps**.

    :::image type="content" source="./media/how-to-create-azure-spring-apps-assessment/assess-inline.png" alt-text="Screenshot of dropdown to choose assessment type as Web apps on Azure." lightbox="./media/how-to-create-azure-spring-apps-assessment/assess-expanded.png":::

   In **Create assessment**, you'll see the assessment type pre-selected as **Web apps on Azure**, the scenario pre-selected as **Spring Boot to Azure Spring Apps**, and the discovery source defaulted to **Servers discovered from Azure Migrate appliance**.
4. Select **Edit** to review the assessment properties.

    :::image type="content" source="./media/how-to-create-azure-spring-apps-assessment/assess-webapps-inline.png" alt-text="Screenshot of Edit button from where assessment properties can be customized." lightbox="./media/how-to-create-azure-spring-apps-assessment/assess-webapps-expanded.png":::

1. The following are included in Azure Spring Apps assessment properties:

    | **Property** | **Details** |
    | --- | --- |
    | **Target location** | The Azure region to which you want to migrate. Azure Spring Apps configuration and cost recommendations are based on the location that you specify. |
    | **Environment type** | Specifies the environment to apply pricing applicable to Production or Dev/Test. |
    | **Offer/Licensing program** | The [Azure offer](https://azure.microsoft.com/support/legal/offer-details/) in which you're enrolled. The assessment estimates the cost for that offer. |
    | **Currency** | The billing currency for your account. |
    | **Discount (%)** | Any subscription-specific discounts that you receive on top of the Azure offer. The default setting is 0%. |
    | **EA subscription** | Specifies that an Enterprise Agreement (EA) subscription is used for cost estimation. Takes into account the discount applicable to the subscription. <br/><br/> Retain the settings for reserved instances, and discount (%) properties with their default settings. |
    | **Savings options (compute)** | Specify the savings option that you want the assessment to consider, to help optimize your Azure Compute cost. <br><br> We recommend [Azure reservations](../cost-management-billing/reservations/save-compute-costs-reservations.md) (1 year or 3 years reserved) for the most consistently running resources.<br><br> [Azure Savings Plan](../cost-management-billing/savings-plan/savings-plan-compute-overview.md) (1 year or 3 years savings plan) provide more flexibility and automated cost optimization. Ideally post migration, you could use Azure reservation and savings plan at the same time (reservation is first), but in the Azure Migrate assessments, you can only see cost estimates of one savings option at a time. <br><br> When you select **None**, the Azure Compute cost is based on the Pay-as-you-go rate or based on actual usage.<br><br> You need to select pay-as-you-go in offer/licensing program to be able to use Reserved Instances or Azure Savings Plan. When you select any savings option other than **None**, the **Discount (%)** setting isn't applicable. The monthly cost estimates are calculated by multiplying 744 hours with the hourly price of the recommended SKU.|

1. In **Create assessment**, select **Next**.
1. In **Select servers to assess** > **Assessment name** > specify a name for the assessment.
1. In **Select or create a group** > select **Create New** and specify a group name.
1. Select the appliance, and select the servers you want to add to the group. Select **Next**.
1. In **Review + create assessment**, review the assessment details, and select **Create Assessment** to create the group and run the assessment.
1. After the assessment is created, go to **Servers, databases and web apps** > **Azure Migrate: Discovery and assessment** tile and refresh the tile data by selecting the **Refresh** option on top of the tile. Wait for data to get refreshed.

     :::image type="content" source="./media/how-to-create-azure-spring-apps-assessment/tile-refresh-inline.png" alt-text="Screenshot of refreshed discovery and assessment tool data." lightbox="./media/how-to-create-azure-spring-apps-assessment/tile-refresh-expanded.png":::

1. Select the number next to **Azure Spring Apps** assessment.

     :::image type="content" source="./media/how-to-create-azure-spring-apps-assessment/assessment-webapps-navigation-inline.png" alt-text="Screenshot of navigation to created assessment." lightbox="./media/how-to-create-azure-spring-apps-assessment/assessment-webapps-navigation-expanded.png":::

1. Select the assessment name that you want to view.

## Review an assessment

**To view an assessment**:

1. In **Servers, databases and web apps** > **Azure Migrate: Discovery and assessment**,  select the number next to Azure Spring Apps assessment.
2. Select the assessment name that you wish to view.
3. Review the assessment summary. You can also edit the assessment properties or recalculate the assessment. The assessment summary consists of the **Overview** and the **Azure Spring apps** sections.

:::image type="content" source="./media/how-to-create-azure-spring-apps-assessment/assessment-webapps-summary-inline.png" alt-text="Screenshot of the assessment created." lightbox="./media/how-to-create-azure-spring-apps-assessment/assessment-webapps-summary-expanded.png":::

### Overview

This card shows the distribution of assessed apps based on their readiness. In addition, it estimates the monthly costs for apps marked with **Ready** or **Ready with conditions** status. The cost estimation is based upon the current memory consumption and estimated CPU consumption of your apps.

### Azure Spring Apps

This card shows the list of assessed apps with the average memory consumption and estimated CPU consumption for each app instance. You can drill down to understand details around migration issues/warnings that you can remediate before migration to Azure Spring Apps. [Learn more](concepts-azure-spring-apps-assessment-calculation.md).

### Review cost estimates

The assessment summary shows the estimated monthly costs for hosting your apps in Spring Apps. In Azure Spring Apps, you pay charges per Azure Spring Apps service instance and not per app. One or more apps can be configured to run on the same service instance. You can choose the apps to be included in the Azure Spring apps service instance.

For estimating cost, we assume you add all your assessed apps into the same Azure Spring Apps service instance. Learn more about the details of Azure Spring Apps pricing from the [pricing page](https://azure.microsoft.com/pricing/details/spring-apps/) and [pricing calculator](https://azure.microsoft.com/pricing/calculator/). The monthly cost on this card assumes each month has 744 hours instead of 730 hours.

The estimated cost applies for both Azure Spring Apps Standard tier and Enterprise tier. For Enterprise tier, there is an additional cost on [software IP](https://azuremarketplace.microsoft.com/marketplace/apps/vmware-inc.azure-spring-cloud-vmware-tanzu-2?tab=PlansAndPrice) and resource consumption for Tanzu components, which aren't included in cost estimation.

   :::image type="content" source="./media/how-to-create-azure-spring-apps-assessment/assessment-webapps-cost-inline.png" alt-text="Screenshot of Cost details." lightbox="./media/how-to-create-azure-spring-apps-assessment/assessment-webapps-cost-expanded.png":::

### Review readiness

1. Select **Azure Spring Apps**.

    :::image type="content" source="./media/how-to-create-azure-spring-apps-assessment/assessment-webapps-readiness-inline.png" alt-text="Screenshot of Azure Spring Apps readiness details." lightbox="./media/how-to-create-azure-spring-apps-assessment/assessment-webapps-readiness-expanded.png":::

1. Review Azure Spring Apps readiness column in table, for the assessed apps:
    1. If there are no compatibility issues found, the readiness is marked as **Ready** for the target deployment type.
    1. If there are non-critical compatibility issues, such as degraded or unsupported features that do not block the migration, the readiness is marked as **Ready with conditions** (hyperlinked) with **warning** details and recommended remediation guidance. You may migrate such apps first and optimize later.
    1. If there are any compatibility issues that may block the migration to a specific target deployment type, the readiness is marked as **Not ready** with **issue** details and recommended remediation guidance.
    1. If the discovery is still in progress or there are any discovery issues for a web app, the readiness is marked as **Unknown** as the assessment couldn't compute the readiness for that web app.

## Next steps

- [Learn more](concepts-azure-spring-apps-assessment-calculation.md) about how Azure Spring Apps assessments are calculated.