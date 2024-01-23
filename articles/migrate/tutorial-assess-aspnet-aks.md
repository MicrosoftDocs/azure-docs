---
title: Assess ASP.NET web apps for migration to Azure Kubernetes Service
description: Assessments of ASP.NET web apps to Azure Kubernetes Service using Azure Migrate
author: anraghun
ms.author: anraghun
ms.service: azure-migrate
ms.topic: tutorial
ms.date: 08/10/2023
ms.custom: template-tutorial
---

# Assess ASP.NET web apps for migration to Azure Kubernetes Service (preview)

This article shows you how to assess ASP.NET web apps for migration to [Azure Kubernetes Service (AKS)](../aks/intro-kubernetes.md) using Azure Migrate. Creating an assessment for your ASP.NET web app provides key insights such as **app-readiness**, **target right-sizing** and **cost** to host and run these apps month over month.

In this tutorial, you'll learn how to:

> [!div class="checklist"]
> * Choose a set of discovered ASP.NET web apps to assess for migration to AKS.
> * Provide assessment configurations such as Azure Reserved Instances, target region etc.
> * Get insights about the migration readiness of their assessed apps.
> * Get insights on the AKS Node SKUs that can optimally host and run these apps.
> * Get the estimated cost of running these apps on AKS.

> [!NOTE]
> Tutorials show you the simplest deployment path for a scenario so that you can quickly set up a proof-of-concept. Tutorials use default options where possible and don't show all possible settings and paths.

## Prerequisites

- Deploy and configure the Azure Migrate appliance in your [VMware](./tutorial-discover-vmware.md), [Hyper-V](./tutorial-discover-hyper-v.md) or [physical environment](./tutorial-discover-physical.md).
- Check the [appliance requirements](./migrate-appliance.md#appliance---vmware) and [URL access](./migrate-appliance.md#url-access) to be provided.
- Follow [these steps](./how-to-discover-sql-existing-project.md) to discover ASP.NET web apps running on your environment.

## Create an assessment

1. On the **Servers, databases and web apps** page, select **Assess** and then select **Web apps on Azure**.

    :::image type="content" source="./media/tutorial-assess-aspnet-aks/hub-assess-webapps.png" alt-text="Screenshot of selecting web app assessments.":::

2. On the **Basics** tab, select the **Scenario** dropdown and select **Web apps to AKS**.

    :::image type="content" source="./media/tutorial-assess-aspnet-aks/create-basics-scenario.png" alt-text="Screenshot of selecting the scenario for web app assessment.":::

3. On the same tab, select **Edit** to modify assessment settings. See the table below to update the various assessment settings.

    :::image type="content" source="./media/tutorial-assess-aspnet-aks/create-basics-settings.png" alt-text="Screenshot of changing the target settings for web app assessment.":::

    | Setting | Possible Values | Comments |
    | --- | --- | --- |
    | Target Location | All locations supported by AKS | Used to generate regional cost for AKS. |
    | Environment Type | Production <br> Dev/Test | Allows you to toggle between Pay-As-You-Go and Pay-As-You-Go Dev/Test [offers](https://azure.microsoft.com/support/legal/offer-details/). |
    | Offer/Licensing program | Pay-As-You-Go <br> Enterprise Agreement | Allows you to toggle between Pay-As-You-Go and Enterprise Agreement [offers](https://azure.microsoft.com/support/legal/offer-details/). |
    | Currency | All common currencies such as USD, INR, GBP, Euro | We generate the cost in the currency selected here. |
    | Discount Percentage | Numeric decimal value | Use this to factor in any custom discount agreements with Microsoft. This is disabled if Savings options are selected. |
    | EA subscription | Subscription ID | Select the subscription ID for which you have an Enterprise Agreement. |
    | Savings options | 1 year reserved <br> 3 years reserved <br> 1 year savings plan <br> 3 years savings plan <br> None | Select a savings option if you have opted for [Reserved Instances](../cost-management-billing/reservations/save-compute-costs-reservations.md) or [Savings Plan](https://azure.microsoft.com/pricing/offers/savings-plan-compute/). |
    | Category | All <br> Compute optimized <br> General purpose <br> GPU <br> High performance compute <br> Isolated <br> Memory optimized <br> Storage optimized | Selecting a particular SKU category will ensure we recommend the best AKS Node SKUs from that category. |
    | AKS pricing tier | Standard | Pricing tier for AKS |

4. After reviewing the assessment settings, select **Next**.

5. Select the list of servers which host the web apps to be assessed. Provide a name to this group of servers as well as the assessment. You can also filter web apps discovered by a specific appliance, in case your project has more than one.

    :::image type="content" source="./media/tutorial-assess-aspnet-aks/create-server-selection.png" alt-text="Screenshot of selecting servers containing the web apps to be assessed.":::

6. Select **Next** to review the high-level assessment details. Select **Create assessment**.

    :::image type="content" source="./media/tutorial-assess-aspnet-aks/create-review.png" alt-text="Screenshot of reviewing the high-level assessment details before creation.":::

## View assessment insights

The assessment can take around 10 minutes to complete.

1. On the **Servers, databases and web apps** page, select the hyperlink next to **Web apps on Azure**.

    :::image type="content" source="./media/tutorial-assess-aspnet-aks/hub-view-assessments.png" alt-text="Screenshot of clicking the hyperlink to see the list of web app assessments.":::

2. On the **Assessments** page, use the search bar to filter for your assessment. It should be in the **Ready** state.

    :::image type="content" source="./media/tutorial-assess-aspnet-aks/assessment-list.png" alt-text="Screenshot of filtering for the created assessment.":::

    | Assessment State | Definition |
    | --- | --- |
    | Creating | The assessment creation is in progress. It takes around 10 minutes to complete. |
    | Ready | The assessment has successfully been created. |
    | Invalid | There was an error in the assessment computation. |

### Assessment overview

:::image type="content" source="./media/tutorial-assess-aspnet-aks/assessment-overview.png" alt-text="Screenshot of the assessment overview.":::

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

Selecting the recommended cluster for the app opens the **Cluster details** page. This page surfaces details such as the number of system and user node pools, the SKU for each node pool as well as the web apps recommended for this cluster. Typically, an assessment will only generate a single cluster. The number of clusters increases when the web apps in the assessment start hitting AKS cluster limits.

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