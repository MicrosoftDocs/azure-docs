---
title: Azure Advisor portal basics
description: Learn how to get started with Azure Advisor through the Azure portal, get and manage recommendations, and configure Advisor settings.
ms.service: azure
ms.topic: article
ms.date: 03/07/2024

---

# Azure Advisor portal basics

Learn how to access Azure Advisor through the Azure portal, get and manage recommendations, and configure Advisor settings.

> [!NOTE]
> Advisor runs in the background to find newly created resources. It can take up to 24 hours to provide recommendations on those resources.

## Open Advisor

To access Advisor, sign in to the [Azure portal](https://portal.azure.com). Then select the [Advisor](https://aka.ms/azureadvisordashboard) icon at the top of the page or use the search bar at the top to search for Advisor. You can also use the left pane and select **Advisor**. The Advisor **Overview** page opens by default.

## View the Advisor dashboard

On the Advisor **Overview** page, you see personalized and actionable recommendations.

:::image type="content" source="./media/advisor-get-started/advisor-overview-page-m-1.png" alt-text="Screenshot that shows the Azure Advisor opening **Overview** page." lightbox="./media/advisor-get-started/advisor-overview-page-m-1.png":::

* The links at the top offer options for **Feedback**, downloading recommendations as comma-separated value (CSV) files or PDFs, and a link to Advisor **Workbooks**.
* The filter buttons underneath them focus the recommendations.
* The tiles represent the different recommendation categories and include your current score in each category.
* **Get started** takes you to options for direct access to Advisor workbooks, recommendations, and the Azure Well-Architected Framework main page.

### Filter and access recommendations

The tiles on the Advisor **Overview** page show the different categories of recommendations for all the subscriptions to which you have access, by default.

To filter the display, use the buttons at the top of the page:

* **Subscription**: Select **All** for Advisor recommendations on all subscriptions. Alternatively, select specific subscriptions. Apply changes by clicking outside of the button.
* **Recommendation Status**: **Active** (the default, recommendations not postponed or dismissed), **Postponed** or **Dismissed**. Apply changes by clicking outside of the button.
* **Resource Group**: Select **All** (the default) or specific resource groups. Apply changes by clicking outside of the button.
* **Type**: Select **All** (the default) or specific resources. Apply changes by clicking outside of the button.
* For more advanced filtering, select **Add filter**.

To display a specific list of recommendations, select a category tile.

:::image type="content" source="./media/advisor-get-started/advisor-reliability-tile-small.png" alt-text="Screenshot  that shows the Advisor Reliability recommendation tile." lightbox="./media/advisor-get-started/advisor-reliability-tile-small.png":::

Each tile provides information about the recommendations for that category:

* Your overall score for the category.
* The total number of recommendations for the category, and the specific number per impact.
* The number of impacted resources by the recommendations.

For detailed graphics and information on your Advisor score, see [Optimize Azure workloads by using Advisor score](/azure/advisor/azure-advisor-score).

### Get recommendation details and solution options

You can view recommendation details, such as the recommended actions and affected resources. You can also see the solution options, including postponing or dismissing a recommendation.

1. To review details of a recommendation, including the affected resources, open the recommendation list for a category. Then select **Description** or **Impacted resources** for a specific recommendation. The following screenshot shows a Reliability recommendation details page.

   :::image type="content" source="./media/advisor-get-started/advisor-score-reliability-recommendation-page.png" alt-text="Screenshot that shows an Advisor Reliability Recommendation details example." lightbox="./media/advisor-get-started/advisor-score-reliability-recommendation-page.png":::

1. To see action details, select a **Recommended actions** link. The Azure page where you can act opens. Alternatively, open a page to the affected resources to take the recommended action (the two pages might be the same).
  
   To help you understand the recommendation before you act, select **Learn more** on the **Recommended action** page or at the top of the **Recommendation details** page.

1. You can postpone the recommendation.

   :::image type="content" source="./media/advisor-get-started/advisor-recommendation-postpone.png" alt-text="Screenshot that shows an Advisor recommendation postpone option." lightbox="./media/advisor-get-started/advisor-recommendation-postpone.png":::

   You can't dismiss the recommendation without certain privileges. For information on permissions, see [Permissions in Azure Advisor](permissions.md).

### Download recommendations

To download your recommendations, select **Download as CSV** or **Download as PDF** on the action bar at the top of any recommendation list or details page. The download option respects any filters you applied to Advisor. If you select the download option while viewing a specific recommendation category or recommendation, the downloaded summary only includes information for that category or recommendation.

## Configure recommendations

You can exclude subscriptions or resources, such as test resources, from Advisor recommendations and configure Advisor to generate recommendations only for specific subscriptions and resource groups.

> [!NOTE]
> To change subscriptions or Advisor compute rules, you must be a subscription owner. If you don't have the required permissions, the option is disabled in the user interface. For information on permissions, see [Permissions in Azure Advisor](permissions.md). For details on right-sizing VMs, see [Reduce service costs by using Azure Advisor](advisor-cost-recommendations.md).

From any Azure Advisor page, select **Configuration** in the left pane. The Advisor configuration page opens with the **Resources** tab selected, by default.

Use the **Resources** tab to select or unselect subscriptions for Advisor recommendations. When you're ready, select **Apply**. The page refreshes.

:::image type="content" source="./media/advisor-get-started/advisor-configure-resources.png" alt-text="Screenshot that shows an Advisor configuration option for resources." lightbox="./media/advisor-get-started/advisor-configure-resources.png":::

Use the **VM/VMSS right sizing** tab to adjust Advisor virtual machine (VM) and virtual machine scale sets (VMSS) recommendations. Specifically, you can set up a filter for each subscription to only show recommendations for machines with certain CPU utilization. This setting filters recommendations by machine, but it doesn't change how they're generated. Follow these steps:

1. Select the subscriptions for which you want to set up a filter for average CPU utilization. Then select **Edit**. Not all subscriptions can be edited for VM/VMSS right sizing, and certain privileges are required. For more information on permissions, see [Permissions in Azure Advisor](permissions.md).

1. Select the average CPU utilization value you want and select **Apply**. It can take up to 24 hours for the new settings to be reflected in recommendations.

   :::image type="content" source="./media/advisor-get-started/advisor-configure-rules.png" alt-text="Screenshot that shows an Advisor configuration option for VM/VMSS sizing rules." lightbox="./media/advisor-get-started/advisor-configure-rules.png":::

## Related content

To learn more about Advisor, see:

- [Introduction to Azure Advisor](advisor-overview.md)
- [Advisor cost recommendations](advisor-cost-recommendations.md)
- [Advisor security recommendations](advisor-security-recommendations.md)
- [Advisor reliability recommendations](advisor-high-availability-recommendations.md)
- [Advisor operational excellence recommendations](advisor-operational-excellence-recommendations.md)
- [Advisor performance recommendations](advisor-performance-recommendations.md)
