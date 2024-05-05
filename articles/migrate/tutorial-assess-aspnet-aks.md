---
title: Assess ASP.NET/Java web apps for migration to Azure Kubernetes Service
description: Assessments of ASP.NET web apps to Azure Kubernetes Service using Azure Migrate
author: anraghun
ms.author: anraghun
ms.service: azure-migrate
ms.topic: tutorial
ms.date: 04/01/2024
ms.custom: template-tutorial
zone_pivot_groups: web-apps-assessment-aks
---

# Assess web apps for migration to Azure Kubernetes Service (preview)

::: zone pivot="asp-net"

This article shows you how to assess ASP.NET web apps for migration to [Azure Kubernetes Service (AKS)](../aks/intro-kubernetes.md) using Azure Migrate. Creating an assessment for your ASP.NET web app provides key insights such as **app-readiness**, **target right-sizing** and **cost** to host and run these apps month over month.

::: zone-end

::: zone pivot="java"

This article shows you how to assess Java web apps for migration to [Azure Kubernetes Service (AKS)](../aks/intro-kubernetes.md) using Azure Migrate. Creating an assessment for your Java web app provides key insights such as **app-readiness**, **target right-sizing** and **cost** to host and run these apps month over month.

::: zone-end

In this tutorial, you'll learn how to:

::: zone pivot="asp-net"
> [!div class="checklist"]
> * Choose a set of discovered ASP.NET web apps to assess for migration to AKS.
> * Provide assessment configurations such as Azure Reserved Instances, target region etc.
> * Get insights about the migration readiness of their assessed apps.
> * Get insights on the AKS Node SKUs that can optimally host and run these apps.
> * Get the estimated cost of running these apps on AKS.
::: zone-end

::: zone pivot="java"
> [!div class="checklist"]
> * Choose a set of discovered Java web apps to assess for migration to AKS.
> * Provide assessment configurations such as Azure Reserved Instances, target region etc.
> * Get insights about the migration readiness of their assessed apps.
> * Get insights on the AKS Node SKUs that can optimally host and run these apps.
> * Get the estimated cost of running these apps on AKS.
::: zone-end

> [!NOTE]
> Tutorials show you the simplest deployment path for a scenario so that you can quickly set up a proof-of-concept. Tutorials use default options where possible and don't show all possible settings and paths.

## Prerequisites

- Deploy and configure the Azure Migrate appliance in your [VMware](./tutorial-discover-vmware.md), [Hyper-V](./tutorial-discover-hyper-v.md) or [physical environment](./tutorial-discover-physical.md).
- Check the [appliance requirements](./migrate-appliance.md#appliance---vmware) and [URL access](./migrate-appliance.md#url-access) to be provided.
::: zone pivot="asp-net"
- Follow [these steps](./how-to-discover-sql-existing-project.md) to discover ASP.NET web apps running on your environment.
::: zone-end
::: zone pivot="java"
- Follow [these steps](./how-to-discover-sql-existing-project.md) to discover Java web apps running on your environment.
::: zone-end

## Create an assessment

1. Sign into the [Azure portal](https://ms.portal.azure.com/#home) and search for Azure Migrate.
1. On the **Azure Migrate** page, under **Migration goals**, select **Servers, databases and web apps**.
1. On the **Servers, databases and web apps** page, under **Assessments tools**, select **Web apps on Azure** from the **Assess** dropdown menu.

    :::image type="content" source="./media/tutorial-assess-aspnet-aks/hub-assess-webapps.png" alt-text="Screenshot of selecting web app assessments.":::

1. On the **Create assessment** page, under **Basics** tab, do the following:
    1. **Scenario**: Select **Web apps to AKS**.

    :::image type="content" source="./media/tutorial-assess-aspnet-aks/create-basics-scenario.png" alt-text="Screenshot of selecting the scenario for web app assessment.":::

    2. Select **Edit** to modify assessment settings. See the table below to update the various assessment settings.

    :::image type="content" source="./media/tutorial-assess-aspnet-aks/create-basics-settings.png" alt-text="Screenshot of changing the target settings for web app assessment.":::

    | Setting | Possible Values | Comments |
    | --- | --- | --- |
    | Target Location | All locations supported by AKS | Used to generate regional cost for AKS. |
    | Environment Type | Production <br> Dev/Test | Allows you to toggle between pay-as-you-go and pay-as-you-go Dev/Test [offers](https://azure.microsoft.com/support/legal/offer-details/). |
    | Offer/Licensing program | Pay-as-you-go <br> Enterprise Agreement | Allows you to toggle between pay-as-you-go and Enterprise Agreement [offers](https://azure.microsoft.com/support/legal/offer-details/). |
    | Currency | All common currencies such as USD, INR, GBP, Euro | We generate the cost in the currency selected here. |
    | Discount Percentage | Numeric decimal value | Use this to factor in any custom discount agreements with Microsoft. This is disabled if Savings options are selected. |
    | EA subscription | Subscription ID | Select the subscription ID for which you have an Enterprise Agreement. |
    | Savings options | 1 year reserved <br> 3 years reserved <br> 1 year savings plan <br> 3 years savings plan <br> None | Select a savings option if you've opted for [Reserved Instances](../cost-management-billing/reservations/save-compute-costs-reservations.md) or [Savings Plan](https://azure.microsoft.com/pricing/offers/savings-plan-compute/). |
    | Category | All <br> Compute optimized <br> General purpose <br> GPU <br> High performance compute <br> Isolated <br> Memory optimized <br> Storage optimized | Selecting a particular SKU category ensures we recommend the best AKS Node SKUs from that category. |
    | AKS pricing tier | Standard | Pricing tier for AKS |

1. After reviewing the assessment settings, select **Next: Select servers to assess**.

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
    - Select the servers, which host the web apps to be assessed from the table.
    - Select **Next** to review the high-level assessment details.

        :::image type="content" source="./media/tutorial-assess-aspnet-aks/create-server-selection.png" alt-text="Screenshot of selecting servers containing the web apps to be assessed.":::

1. Under **Review + create assessment** tab, review the assessment details, and select **Create assessment** to create the group and run the assessment.

    :::image type="content" source="./media/tutorial-assess-aspnet-aks/create-review.png" alt-text="Screenshot of reviewing the high-level assessment details before creation.":::

## View assessment insights

The assessment can take around 10 minutes to complete.

1. On the **Azure Migrate** page, under **Migration goals**, select **Servers, databases and web apps**.
1. On the **Servers, databases and web apps** page, under **Assessment tools** > **Assessments**, select the number next to the Web apps on Azure assessment. 
1. On the **Assessments** page, select a desired assessment name to view from the list of assessments.

    :::image type="content" source="./media/tutorial-assess-aspnet-aks/hub-view-assessments.png" alt-text="Screenshot of clicking the hyperlink to see the list of web app assessments.":::

2. Use the search bar to filter for your assessment. It should be in the **Ready** state. 

    :::image type="content" source="./media/tutorial-assess-aspnet-aks/assessment-list.png" alt-text="Screenshot of filtering for the created assessment.":::

    | Assessment State | Definition |
    | --- | --- |
    | Creating | The assessment creation is in progress. It takes around 10 minutes to complete. |
    | Ready | The assessment has successfully been created. |
    | Invalid | There was an error in the assessment computation. |

### Assessment overview

::: zone pivot="asp-net"
:::image type="content" source="./media/tutorial-assess-aspnet-aks/assessment-overview.png" alt-text="Screenshot of the assessment overview.":::
::: zone-end

::: zone pivot="java"
:::image type="content" source="./media/tutorial-assess-aspnet-aks/assessment-overview-java.png" alt-text="Screenshot of the assessment overview for Java.":::
::: zone-end

On the **Overview** page, you're provided with the following details:

1. **Assessed entities**: This section provides the count of servers, web servers and web apps that are part of this assessment.

2. **Migration readiness**: The assessed web apps will have one of the following statuses:

    | Status | Definition |
    | --- | --- |
    | *Ready* | The web app is ready to be migrated |
    | *Ready with conditions* | The web app needs minor changes to be ready for migration |
    | *Not ready* | The web app needs major/breaking changes to be ready for migration |
    | *Unknown* | The web app discovery data was either incomplete or corrupt to calculate readiness |

> [!NOTE]
> Web apps that are either *Ready* or *Ready with conditions* are recommended for migration.

3. **Monthly cost estimate**: This section provides the month over month cost projection of running your migration-ready web apps on AKS.

You can update the **Settings** of the assessment after it's created. This triggers a recalculation.

Selecting the **Export assessment** option exports the entire assessment to an Excel spreadsheet.

### Assessment details

#### Readiness

On the **Readiness** tab, you see the list of web apps assessed. For each web app, you see the readiness status, the cluster and the recommended AKS Node SKU.

:::image type="content" source="./media/tutorial-assess-aspnet-aks/assessment-readiness-list.png" alt-text="Screenshot of the readiness tab in the assessment details page.":::

Select the readiness condition of an app to see the migration warnings or issues. For apps that are *Ready with conditions*, you'll only see warnings. For apps that are *Not ready*, you'll see errors and potentially warnings.

For each issue or warning, you're provided the description, cause and mitigation steps along with useful documentation/blogs for reference.

:::image type="content" source="./media/tutorial-assess-aspnet-aks/assessment-readiness-errors.png" alt-text="Screenshot of the readiness errors and warnings for a web app.":::

Selecting the recommended cluster for the app opens the **Cluster details** page. This page surfaces details such as the number of system and user node pools, the SKU for each node pool and the web apps recommended for this cluster. Typically, an assessment will only generate a single cluster. The number of clusters increases when the web apps in the assessment start hitting AKS cluster limits.

:::image type="content" source="./media/tutorial-assess-aspnet-aks/assessment-cluster.png" alt-text="Screenshot of the recommended cluster page.":::

#### Cost details

On the **Cost details** tab, you see the breakdown of the monthly cost estimate distributed across AKS node pools. AKS pricing is intrinsically dependent on the node pool costs.

For each node pool, you see the associated node SKU, node count and the number of web apps recommended to be scheduled, along with the cost. By default, there will be at least 2 node pools:

1. *System*: Used to host critical system pods such as `CoreDNS`.
2. *User*: As ASP.NET framework apps need a Windows node to run, the assessment recommends at least one additional Windows-based node pool.

:::image type="content" source="./media/tutorial-assess-aspnet-aks/assessment-cost-details.png" alt-text="Screenshot of the cost breakup of the assessment.":::

## Next steps

- [Modernize](./tutorial-modernize-asp-net-aks.md) your ASP.NET web apps at-scale to Azure Kubernetes Service.
- Optimize [Windows Dockerfiles](/virtualization/windowscontainers/manage-docker/optimize-windows-dockerfile?context=/azure/aks/context/aks-context).
- [Review and implement best practices](../aks/best-practices.md) to build and manage apps on AKS.
