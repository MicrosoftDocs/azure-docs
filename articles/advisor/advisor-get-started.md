---
title: Get started with Azure Advisor
description: Get started with Azure Advisor.
ms.topic: article
ms.date: 09/15/2023

---

# Get started with Azure Advisor

Learn how to access Advisor through the Azure portal, configure Advisor settings, and get and manage recommendations.

> [!NOTE]
> Azure Advisor runs in the background to find newly created resources. It can take up to 24 hours to provide recommendations on those resources.

## Open Advisor

To access Azure Advisor, sign in to the [Azure portal](https://portal.azure.com) and open [Advisor](https://aka.ms/azureadvisordashboard). The Advisor **Score** page opens by default. 

   ![Access Azure Advisor using the Azure portal](./media/advisor-get-started/advisor-score-page3.png) 

## Read your score
See how your system configuration measures against Azure best practices.

   ![Optimize Azure workloads by using Advisor score](./media/advisor-get-started/advisor-score-detail.png) 

* The far-left graphic is your overall system Advisor score against Azure best practices. The **Learn more** link opens the [Optimize Azure workloads by using Advisor score](azure-advisor-score.md) page. 

* The middle graphic depicts the trend of your system Advisor score history. Roll over the graphic to activate a slider to see your trend at different points of time. Use the drop-down menu to pick a trend time frame.

* The far-right graphic shows a breakdown of your best practices Advisor score per category. Click a category bar to open the recommendations page for that category.

## Get recommendations

To display a specific list of recommendations, click a category tile. The following screenshot shows the **Reliability** tile selected.

   ![Azure view recommendation page](./media/advisor-get-started/advisor-score-page3-detail.png) 

The tiles on the Advisor **Score** page show the different categories of recommendations per subscription:  

* To get recommendations for a specific category, click one of the tiles. To open a list of all recommendations for all categories, click the **All recommendations** tile. By default, the **Cost** tile is selected. 

* You can filter the display using the buttons at the top of the page:
   * **Subscription**: Choose **All** for Advisor recommendations on all subscriptions. Alternatively, select specific subscriptions. Apply changes by clicking outside of the button.
   * **Recommendation Status**: **Active** (the default, recommendations that you haven't postponed or dismissed), **Postponed or Dismissed**. Apply changes by clicking outside of the button.
   * **Resource Group**: Choose **All** (the default) or specific resource groups. Apply changes by clicking outside of the button.
   * **Type**: Choose **All** (the default) or specific resources. Apply changes by clicking outside of the button.
   * **Commitments**: Applicable only to cost recommendations. Adjust your subscription **Cost** recommendations to reflect your committed **Term (years)** and chosen **Look-back period (days)**. Apply changes by clicking **Apply**.
   * For more advanced filtering, click **Add filter**.

* The **Commitments** button lets you adjust your subscription **Cost** recommendations to reflect your committed **Term (years)** and chosen **Look-back period (days)**.

* To download your recommendations from the **Score** or any **Recommendations** page, click **Download as CSV** or **Download as PDF** on the action bar at the top. The download option respects any filters you have applied to Advisor.  If you select the download option while viewing a specific recommendation category or recommendation, the downloaded summary only includes information for that category or recommendation.

## Get recommendation details and solution options

View recommendation details – such as the recommended actions and impacted resources – and the solution options, including postponing or dismissing a recommendation.

1. To review details of a recommendation, including the affected resources, open the recommendation list for a category and then click the **Description** link for a specific recommendation. The following screenshot shows a **Reliability** recommendation details page.

   Alternatively, go directly to the configuration page for an affected resource by clicking the **Impacted resources** link for the recommendation.

   ![Advisor view recommendation details](./media/advisor-get-started/advisor-score-reliability-recommendation-page2.png)

1. To see action details, click a **Recommended actions** link. The Azure page where you can act opens. Alternatively, open a page to the affected resources to take the recommended action (the two pages may be the same). The recommendation may necessitate you learning more about the affected configuration; to do so, open the **Learn more** link on the recommended action page, or at the top of the recommendations details page.

1.   You can postpone the recommendation.

   ![Advisor postpone recommendation](./media/advisor-get-started/advisor-recommendation-postpone2.png)

   You can't dismiss the recommendation without certain privileges. For information on permissions, see [Permissions in Azure Advisor](permissions.md).

## Manage subscriptions and Advisor rules

You can exclude subscriptions or resources, such as 'test' resources, from Advisor recommendations. You can also set Advisor compute rules for VM sizing recommendations.

> [!NOTE]
> To change subscriptions or Advisor compute rules, you must be a subscription Owner.  If you do not have the required permissions, the option is disabled in the user interface. For information on permissions, see [Permissions in Azure Advisor](permissions.md).

### Resources (subscriptions)

1. From any Azure Advisor page, click **Configuration** in the left navigation pane. The Advisor **Configuration** page opens with the default **Resources** tab selected. 

    ![Advisor configure resources example](./media/advisor-get-started/advisor-configure-resources-no-wsp.png)

1. Uncheck any subscriptions you don't want to receive Advisor recommendations for, click **Apply**. The page refreshes.

### VM/VMSS right sizing

You can adjust the average CPU utilization rule and the look back period on a per-subscription basis. Doing virtual machine (VM) right sizing requires specialized knowledge. 

Advisor monitors your VM usage for seven days by default, and then identifies your low-utilization VMs. Azure Advisor considers VMs low-utilization if their CPU utilization is 5% or less and their network utilization is less than 2%, or if the VM's current workload can be accommodated with a smaller VM.

You can set the  CPU utilization rule to 5%, 10%, 15%, 20%, or 100% (the default). If the trigger is set to 100%, Advisor presents recommendations for VMs with less than 5%, 10%, 15%, and 20% of CPU utilization. You can also select how far back in historical data, the look back, you want to analyze: seven days (default), 14, 21, 30, 60, or 90 days.

1. Select the subscriptions you’d like to adjust the average CPU utilization rule for, and then click **Edit**. Not all subscriptions can be edited for VM/VMSS right sizing.

1. Select the desired average CPU utilization value and click **Apply**. It can take up to 24 hours for the new settings to be reflected in recommendations.

  ![Advisor configure recommendation rules example](./media/advisor-get-started/advisor-configure-rules.png) 

## Next steps

To learn more about Advisor, see:

- [Introduction to Azure Advisor](advisor-overview.md)
- [Advisor Reliability recommendations](advisor-high-availability-recommendations.md)
- [Advisor Security recommendations](advisor-security-recommendations.md)
- [Advisor Performance recommendations](advisor-performance-recommendations.md)
- [Advisor Cost recommendations](advisor-cost-recommendations.md)
- [Advisor Operational Excellence recommendations](advisor-operational-excellence-recommendations.md)
