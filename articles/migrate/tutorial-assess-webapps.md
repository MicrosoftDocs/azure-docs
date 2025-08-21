---
title: Tutorial to assess web apps for migration to Azure App Service
description: Learn how to create assessment for Azure App Service in Azure Migrate
ms.topic: tutorial
ms.date: 02/07/2025
ms.service: azure-migrate
ms.custom: engagement-fy24, devx-track-extended-java
zone_pivot_groups: web-apps-assessment-app-service
::: moniker range="migrate"
# Customer intent: As an IT administrator managing on-premises web apps, I want to assess their readiness for migration to a cloud environment, so that I can identify risks and estimate costs involved in moving to a cloud-based application service.
---


# Tutorial: Assess web apps for migration to Azure App Service


::: zone pivot="asp-net"

As part of your migration journey to Azure, assess your on-premises workloads to measure cloud readiness, identify risks, and estimate costs and complexity.

This article shows you how to assess discovered ASP.NET web apps running on IIS web servers in preparation for migration to Azure App Service Code and Azure App Service Containers, using the Azure Migrate: Discovery and assessment tool. [Learn more](../app-service/overview.md) about Azure App Service.

::: zone-end

::: zone pivot="java"

As part of your migration journey to Azure, assess your on-premises workloads to measure cloud readiness, identify risks, and estimate costs and complexity.

This article shows you how to assess discovered Java web apps running on Tomcat servers in preparation for migration to Azure App Service Code and Azure App Service Containers, using the Azure Migrate: Discovery and assessment tool. [Learn more](../app-service/overview.md) about Azure App Service.

::: zone-end

In this tutorial, you learn how to: 

> [!div class="checklist"]
> * Run an assessment based on web apps configuration data.
> * Review an Azure App Service assessment.

> [!NOTE]
> Tutorials show the quickest path for trying out a scenario and use default options where possible. 

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.
- Before you follow this tutorial to assess your web apps for migration to Azure App Service, make sure you've discovered the web apps you want to assess using the Azure Migrate appliance for [VMware](tutorial-discover-vmware.md), [Hyper-V](tutorial-discover-hyper-v.md), or [Physical servers](tutorial-discover-physical.md).
- If you want to try out this feature in an existing project, ensure that you have completed the [prerequisites](how-to-discover-sql-existing-project.md) in this article.

## Run an assessment

To run an assessment, follow these steps:

1. Sign into the [Azure portal](https://ms.portal.azure.com/#home) and search for Azure Migrate.
1. On the **Azure Migrate** page, under **Migration goals**, select **Servers, databases and web apps**.
2. On the **Servers, databases and web apps** page, under **Assessments tools**, select **Web apps on Azure** from the **Assess** dropdown menu.

   :::image type="content" source="./media/tutorial-assess-webapps/assess-web-apps.png" alt-text="Screenshot of Overview page for Azure Migrate.":::

3. On the **Create assessment** page, under **Basics** tab, do the following:
    1. The assessment type is pre-selected as **Web apps on Azure** and the discovery source defaulted to **Servers discovered from Azure Migrate appliance**. Select the **Scenario** as **Web apps to App Service**. 

       :::image type="content" source="./media/tutorial-assess-webapps/create-assess-scenario.png" alt-text="Screenshot of Create assessment page for Azure Migrate.":::

    1. Select **Edit** to review the assessment properties.

       The following are included in Azure App Service assessment properties:

       :::image type="content" source="./media/tutorial-assess-webapps/settings.png" alt-text="Screenshot of assessment settings for Azure Migrate.":::

        **Property** | **Details**
        --- | ---
        **Target location** | The Azure region to which you want to migrate. Azure App Service configuration and cost recommendations are based on the location that you specify.
        **Environment type** | Type of environment in which it's running.
        **Offer** | The [Azure offer](https://azure.microsoft.com/support/legal/offer-details/) in which you're enrolled. The assessment estimates the cost for that offer.
        **Currency** | The billing currency for your account.
        **Discount (%)** | Any subscription-specific discounts that you receive on top of the Azure offer. The default setting is 0%.
        **EA subscription** | Specifies that an Enterprise Agreement (EA) subscription is used for cost estimation. Takes into account the discount applicable to the subscription. <br/><br/> Retain the default settings for reserved instances and discount (%) properties.
        **Savings options (Compute)** | The Savings option the assessment must consider.
        **Isolation required** | Select **Yes** if you want your web apps to run in a private and dedicated environment in an Azure datacenter.

    - In **Savings options (Compute)**, specify the savings option that you want the assessment to consider, helping to optimize your Azure Compute cost. 
        - [Azure reservations](../cost-management-billing/reservations/save-compute-costs-reservations.md) (one year or three year reserved) are a good option for the most consistently running resources.
        - [Azure Savings Plan](../cost-management-billing/savings-plan/savings-plan-compute-overview.md) (one year or three year savings plan) provides additional flexibility and automated cost optimization. Ideally post migration, you could use Azure reservation and savings plan at the same time (reservation is consumed first), but in the Azure Migrate assessments, you can only see cost estimates of 1 savings option at a time. 
        - When you select *None*, the Azure Compute cost is based on the Pay-as-you-go rate or based on actual usage.
        - You need to select Pay-as-you-go in offer/licensing program to be able to use Reserved Instances or Azure Savings Plan. When you select any savings option other than *None*, the **Discount (%)** setting isn't applicable.

    1. Select **Save** if you made any changes.
1. On the **Create assessment** page, select **Next: Select servers to assess**.
1. Under the **Select servers to assess** tab, do the following:
    - **Assessment name**: Specify a name for the assessment.
    - **Select or create a group**: Select **Create New** and specify a group name. You can also use an existing group.
    - **Appliance name**: Select the appliance.
    ::: zone pivot="asp-net"
    - **Web app type**: Select **ASP.NET**.
    ::: zone-end
    ::: zone pivot="java"
    - **Web app type**: Select **Java**.
    ::: zone-end
    - Select the servers that you want to add to the group from the table.
    - Select **Next**.

   :::image type="content" source="./media/tutorial-assess-webapps/server-selection.png" alt-text="Screenshot of selected servers.":::

1. Under **Review + create assessment** tab, review the assessment details, and select **Create assessment** to create the group and run the assessment.

   :::image type="content" source="./media/tutorial-assess-webapps/create-app-review.png" alt-text="Screenshot of create assessment.":::

1. After the assessment is created, go to **Servers, databases and web apps** > **Azure Migrate: Discovery and assessment**. Refresh the tile data by selecting the **Refresh** option on top of the tile. Wait for the data to refresh.
1. On the **Servers, databases and web apps** page, under **Assessment tools** > **Assessments**, select the number next to **Web apps on Azure** in the **Assessment** section. 
1. Select the assessment name, which you wish to view.


## Next steps

- Learn how to [perform at-scale agentless migration of ASP.NET web apps to Azure App Service](./tutorial-modernize-asp-net-appservice-code.md).
- [Learn more](concepts-azure-webapps-assessment-calculation.md) about how Azure App Service assessments are calculated.
