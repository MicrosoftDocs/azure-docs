---
title: Get started with Azure Advisor
description: Get started with Azure Advisor.
author: mabrahms
ms.author: v-mabrahms
ms.service: azure
ms.topic: article
ms.date: 09/15/2023

---

# Get started with Azure Advisor

Learn how to access Advisor through the Azure portal, get and manage recommendations, and configure Advisor settings.

> [!NOTE]
> Azure Advisor runs in the background to find newly created resources. It can take up to 24 hours to provide recommendations on those resources.

## Open Advisor

To access Azure Advisor, sign in to the [Azure portal](https://portal.azure.com) and open [Advisor](https://aka.ms/azureadvisordashboard). The Advisor score page opens by default. 

You can also use the search bar at the top, or the left navigation pane, to find Advisor.

:::image type="content" source="./media/advisor-get-started/advisor-score-page.png" alt-text="Screenshot of the Azure Advisor opening score page." lightbox="./media/advisor-get-started/advisor-score-page.png":::

## Read your score
See how your system configuration measures against Azure best practices.

:::image type="content" source="./media/advisor-get-started/advisor-score-page-graphs-detail.png" alt-text="Screenshot detail of Azure Advisor workloads score graphs." lightbox="./media/advisor-get-started/advisor-score-page-graphs-detail.png":::

* The far-left graphic is your overall system Advisor score against Azure best practices. The **Learn more** link opens the [Optimize Azure workloads by using Advisor score](azure-advisor-score.md) page. 

* The middle graphic depicts the trend of your system Advisor score history. Roll over the graphic to activate a slider to see your trend at different points of time. Use the drop-down menu to pick a trend time frame.

* The far-right graphic shows a breakdown of your best practices Advisor score per category. Click a category bar to open the recommendations page for that category.

## Get recommendations

To display a specific list of recommendations, click a category tile. 

The tiles on the Advisor score page show the different categories of recommendations per subscription:  

* To get recommendations for a specific category, click one of the tiles. To open a list of all recommendations for all categories, click the **All recommendations** tile. By default, the **Cost** tile is selected. 

* You can filter the display using the buttons at the top of the page:
   * **Subscription**: Choose *All* for Advisor recommendations on all subscriptions. Alternatively, select specific subscriptions. Apply changes by clicking outside of the button.
   * **Recommendation Status**: *Active* (the default, recommendations that you haven't postponed or dismissed), *Postponed* or *Dismissed*. Apply changes by clicking outside of the button.
   * **Resource Group**: Choose *All* (the default) or specific resource groups. Apply changes by clicking outside of the button.
   * **Type**: Choose *All* (the default) or specific resources. Apply changes by clicking outside of the button.
   * **Commitments**: Applicable only to cost recommendations. Adjust your subscription **Cost** recommendations to reflect your committed **Term (years)** and chosen **Look-back period (days)**. Apply changes by clicking **Apply**.
   * For more advanced filtering, click **Add filter**.

* The **Commitments** button lets you adjust your subscription **Cost** recommendations to reflect your committed **Term (years)** and chosen **Look-back period (days)**.

## Get recommendation details and solution options

View recommendation details – such as the recommended actions and impacted resources – and the solution options, including postponing or dismissing a recommendation.

1. To review details of a recommendation, including the affected resources, open the recommendation list for a category and then click the **Description** or the **Impacted resources** link for a specific recommendation. The following screenshot shows a **Reliability** recommendation details page.

   :::image type="content" source="./media/advisor-get-started/advisor-score-reliability-recommendation-page.png" alt-text="Screenshot of Azure Advisor reliability recommendation details example." lightbox="./media/advisor-get-started/advisor-score-reliability-recommendation-page.png":::

1. To see action details, click a **Recommended actions** link. The Azure page where you can act opens. Alternatively, open a page to the affected resources to take the recommended action (the two pages may be the same).
  
   Understand the recommendation before you act by clicking the **Learn more** link on the recommended action page, or at the top of the recommendations details page.

1.   You can postpone the recommendation.
   
   :::image type="content" source="./media/advisor-get-started/advisor-recommendation-postpone.png" alt-text="Sreenshot of Azure Advisor recommendation postpone option." lightbox="./media/advisor-get-started/advisor-recommendation-postpone.png":::

   You can't dismiss the recommendation without certain privileges. For information on permissions, see [Permissions in Azure Advisor](permissions.md).

## Download recommendations

To download your recommendations from the Advisor score or any recommendation details page, click **Download as CSV** or **Download as PDF** on the action bar at the top. The download option respects any filters you have applied to Advisor.  If you select the download option while viewing a specific recommendation category or recommendation, the downloaded summary only includes information for that category or recommendation.

## Configure recommendations

You can exclude subscriptions or resources, such as 'test' resources, from Advisor recommendations and configure Advisor to generate recommendations only for specific subscriptions and resource groups.

> [!NOTE]
> To change subscriptions or Advisor compute rules, you must be a subscription Owner.  If you do not have the required permissions, the option is disabled in the user interface. For information on permissions, see [Permissions in Azure Advisor](permissions.md). For details on right sizing VMs, see [Reduce service costs by using Azure Advisor](advisor-cost-recommendations.md).

From any Azure Advisor page, click **Configuration** in the left navigation pane. The Advisor Configuration page opens with the **Resources** tab selected, by default. 

:::image type="content" source="./media/advisor-get-started/advisor-configure-resources.png" alt-text="Screenshot of Azure Advisor configuration option for resources." lightbox="./media/advisor-get-started/advisor-configure-resources.png":::

* **Resources**: Uncheck any subscriptions you don't want to receive Advisor recommendations for, click **Apply**. The page refreshes.

* **VM/VMSS right sizing**: You can adjust the average CPU utilization rule and the look back period on a per-subscription basis. Doing virtual machine (VM) right sizing requires specialized knowledge.

  1. Select the subscriptions you’d like to adjust the average CPU utilization rule for, and then click **Edit**. Not all subscriptions can be edited for VM/VMSS right sizing and certain privileges are required; for more information on permissions, see [Permissions in Azure Advisor](permissions.md).
    
  1. Select the desired average CPU utilization value and click **Apply**. It can take up to 24 hours for the new settings to be reflected in recommendations.

  :::image type="content" source="./media/advisor-get-started/advisor-configure-rules.png" alt-text="Screenshot of Azure Advisor configuration option for VM/VMSS sizing rules." lightbox="./media/advisor-get-started/advisor-configure-rules.png":::

## Next steps

To learn more about Advisor, see:

- [Introduction to Azure Advisor](advisor-overview.md)
- [Advisor Cost recommendations](advisor-cost-recommendations.md)
- [Advisor Security recommendations](advisor-security-recommendations.md)
- [Advisor Reliability recommendations](advisor-high-availability-recommendations.md)
- [Advisor Operational Excellence recommendations](advisor-operational-excellence-recommendations.md)
- [Advisor Performance recommendations](advisor-performance-recommendations.md)
