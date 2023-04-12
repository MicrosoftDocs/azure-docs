---
title: Tutorial to assess web apps for migration to Azure App Service
description: Learn how to create assessment for Azure App Service in Azure Migrate
author: rashi-ms
ms.author: rajosh
ms.topic: tutorial
ms.date: 02/28/2023
ms.custom: engagement-fy23
---


# Tutorial: Assess ASP.NET web apps for migration to Azure App Service

As part of your migration journey to Azure, you assess your on-premises workloads to measure cloud readiness, identify risks, and estimate costs and complexity.
This article shows you how to assess discovered ASP.NET web apps running on IIS web servers in preparation for migration to Azure App Service, using the Azure Migrate: Discovery and assessment tool.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Run an assessment based on web apps configuration data.
> * Review an Azure App Service assessment

> [!NOTE]
> Tutorials show the quickest path for trying out a scenario, and use default options where possible. 

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.
- Before you follow this tutorial to assess your web apps for migration to Azure App Service, make sure you've discovered the web apps you want to assess using the Azure Migrate appliance, [follow this tutorial](tutorial-discover-vmware.md)
- If you want to try out this feature in an existing project, ensure that you have completed the [prerequisites](how-to-discover-sql-existing-project.md) in this article.

## Run an assessment

Run an assessment as follows:

1. On the **Overview** page > **Servers, databases and web apps**, select **Discover, assess and migrate**.

    :::image type="content" source="./media/tutorial-assess-webapps/discover-assess-migrate.png" alt-text="Overview page for Azure Migrate":::

2. On **Azure Migrate: Discovery and assessment**, select **Assess** and choose the assessment type as **Azure App Service**.

    :::image type="content" source="./media/tutorial-assess-webapps/assess.png" alt-text="Dropdown to choose assessment type as Azure App Service":::

3. In **Create assessment**, you will be able to see the assessment type pre-selected as **Azure App Service** and the discovery source defaulted to **Servers discovered from Azure Migrate appliance**.

4. Select **Edit** to review the assessment properties.

     :::image type="content" source="./media/tutorial-assess-webapps/assess-webapps.png" alt-text="Edit button from where assessment properties can be customized":::

5. Here's what's included in Azure App Service assessment properties:

    **Property** | **Details**
    --- | ---
    **Target location** | The Azure region to which you want to migrate. Azure App Service configuration and cost recommendations are based on the location that you specify.
    **Isolation required** | Select yes if you want your web apps to run in a private and dedicated environment in an Azure datacenter using Dv2-series VMs with faster processors, SSD storage, and double the memory to core ratio compared to Standard plans.
    - In **Savings options (compute)**, specify the savings option that you want the assessment to consider to help optimize your Azure compute cost. 
        - [Azure reservations](../cost-management-billing/reservations/save-compute-costs-reservations.md) (1 year or 3 year reserved) are a good option for the most consistently running resources.
        - [Azure Savings Plan](../cost-management-billing/savings-plan/savings-plan-compute-overview.md) (1 year or 3 year savings plan) provide additional flexibility and automated cost optimization. Ideally post migration, you could use Azure reservation and savings plan at the same time (reservation will be consumed first), but in the Azure Migrate assessments, you can only see cost estimates of 1 savings option at a time. 
        - When you select 'None', the Azure compute cost is based on the Pay as you go rate or based on actual usage.
        - You need to select pay-as-you-go in offer/licensing program to be able to use Reserved Instances or Azure Savings Plan. When you select any savings option other than 'None', the 'Discount (%)' setting is not applicable.
    **Offer** | The [Azure offer](https://azure.microsoft.com/support/legal/offer-details/) in which you're enrolled. The assessment estimates the cost for that offer.
    **Currency** | The billing currency for your account.
    **Discount (%)** | Any subscription-specific discounts you receive on top of the Azure offer. The default setting is 0%.
    **EA subscription** | Specifies that an Enterprise Agreement (EA) subscription is used for cost estimation. Takes into account the discount applicable to the subscription. <br/><br/> Leave the settings for reserved instances, and discount (%) properties with their default settings.

1. In **Create assessment**, select **Next**.
1. In **Select servers to assess** > **Assessment name** > specify a name for the assessment.
1. In **Select or create a group**, select **Create New** and specify a group name.
1. Select the appliance, and select the servers that you want to add to the group. Select **Next**.
1. In **Review + create assessment**, review the assessment details, and select **Create Assessment** to create the group and run the assessment.
1. After the assessment is created, go to **Servers, databases and web apps** > **Azure Migrate: Discovery and assessment**. Refresh the tile data by selecting the **Refresh** option on top of the tile. Wait for the data to refresh.

    :::image type="content" source="./media/tutorial-assess-webapps/tile-refresh.png" alt-text="Refresh discovery and assessment tool data.":::

1. Select the number next to Azure App Service assessment.

    :::image type="content" source="./media/tutorial-assess-webapps/assessment-webapps-navigation.png" alt-text="Navigation to created assessment.":::

1. Select the assessment name, which you wish to view.

## Review an assessment

**To view an assessment**:

1. **Servers, databases and web apps** > **Azure Migrate: Discovery and assessment**, select the number next to the Azure App Service assessment.
2. Select the assessment name, which you wish to view.

  :::image type="content" source="./media/tutorial-assess-webapps/assessment-webapps-summary.png" alt-text="App Service assessment overview.":::

3. Review the assessment summary. You can also edit the assessment properties or recalculate the assessment.

#### Azure App Service readiness

This indicates the distribution of the assessed web apps. You can drill down to understand the details around migration issues/warnings that you can remediate before migration to Azure App Service. [Learn More](concepts-azure-webapps-assessment-calculation.md).
You can also view the recommended App Service SKU and plan for migrating to Azure App Service.

#### Azure App Service cost details

An [App Service plan](../app-service/overview-hosting-plans.md) carries a [charge](https://azure.microsoft.com/pricing/details/app-service/windows/) on the compute resources it uses.

### Review readiness

1. Select **Azure App Service readiness**.

    :::image type="content" source="./media/tutorial-assess-webapps/assessment-webapps-readiness.png" alt-text="Azure App Service readiness details.":::

1. Review Azure App Service readiness column in table, for the assessed web apps:
    1. If there are no compatibility issues found, the readiness is marked as **Ready** for the target deployment type.
    1. If there are non-critical compatibility issues, such as degraded or unsupported features that do not block the migration to a specific target deployment type, the readiness is marked as **Ready with conditions** (hyperlinked) with **warning** details and recommended remediation guidance.
    1. If there are any compatibility issues that may block the migration to a specific target deployment type, the readiness is marked as **Not ready** with **issue** details and recommended remediation guidance.
    1. If the discovery is still in progress or there are any discovery issues for a web app, the readiness is marked as **Unknown** as the assessment could not compute the readiness for that web app.
1. Review the recommended SKU for the web apps, which is determined as per the matrix below:

    **Isolation required** | **Reserved instance** | **App Service plan/ SKU**
    --- | --- | ---
    Yes  | Yes | I1
    Yes  | No  | I1
    No  | Yes | P1v3
    No  | No | P1v2

    **Azure App Service readiness** | **Determine App Service SKU** | **Determine Cost estimates**
    --- | --- | ---
    Ready  | Yes | Yes
    Ready with conditions  | Yes  | Yes
    Not ready  | No | No
    Unknown  | No | No

1. Select the App Service plan link in the Azure App Service readiness table to see the App Service plan details such as compute resources and other web apps that are part of the same plan.

### Review cost estimates

The assessment summary shows the estimated monthly costs for hosting you web apps in App Service. In App Service, you pay charges per App Service plan and not per web app. One or more apps can be configured to run on the same computing resources (or in the same App Service plan). The apps that you add into this App Service plan run on the compute resources defined by your App Service plan.
To optimize cost, Azure Migrate assessment allocates multiple web apps to each recommended App Service plan. The number of web apps allocated to each plan instance is shown below.

**App Service plan** | **Web apps per App Service plan**
--- | ---
I1  | 8
P1v2  | 8
P1v3  | 16

:::image type="content" source="./media/tutorial-assess-webapps/assessment-webapps-cost.png" alt-text="Cost details":::

## Next steps

- Learn how to [perform at-scale agentless migration of ASP.NET web apps to Azure App Service](./tutorial-modernize-asp-net-appservice-code.md).
- [Learn more](concepts-azure-webapps-assessment-calculation.md) about how Azure App Service assessments are calculated.