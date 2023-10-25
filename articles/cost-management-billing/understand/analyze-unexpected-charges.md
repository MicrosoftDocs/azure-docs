---
title: Identify anomalies and unexpected changes in cost
titleSuffix: Microsoft Cost Management
description: Learn how to identify anomalies and unexpected changes in cost.
author: bandersmsft
ms.reviewer: micflan
ms.service: cost-management-billing
ms.subservice: cost-management
ms.topic: conceptual
ms.date: 08/09/2023
ms.author: banders
---

# Identify anomalies and unexpected changes in cost

The article helps you identify anomalies and unexpected changes in your cloud costs using Cost Management and Billing. There's no charge to use Cost Management and Billing features for your Azure subscriptions. You start with anomaly detection for subscriptions in cost analysis to identify any atypical usage patterns based on your cost and usage trends. Then, you learn how to drill into cost information to find and investigate cost spikes and dips.

You can also create an anomaly alert to automatically get notified when an anomaly is detected.

In general, there are three types of changes that you might want to investigate:

- New costs—For example, a resource that was started or added such as a virtual machine. New costs often appear as a cost starting from zero.
- Removed costs—For example, a resource that was stopped or deleted. Removed costs often appear as costs ending in zero.
- Changed costs (increased or decreased)—For example, a resource was changed in some way that caused a cost increase or decrease. Some changes, like resizing a virtual machine, might be surfaced as a new meter that replaces a removed meter, both under the same resource.

## Identify cost anomalies

The cloud comes with the promise of significant cost savings compared to on-premises costs. However, savings require diligence to proactively plan, govern, and monitor your cloud solutions. Even with proactive processes, cost surprises can still happen. For example, you might notice that something has changed, but you're not sure what. Using Cost Management anomaly detection for your subscriptions can help minimize surprises.

Whether you know if you have any existing cost anomalies or not, Cost analysis informs you if it finds anything unusual as part of Insights. If not, Cost analysis shows **No anomalies detected**.

### View anomalies in Cost analysis

Anomaly detection is available in Cost analysis smart views when you select a subscription scope. You can view your anomaly status as part of **[Insights](https://azure.microsoft.com/blog/azure-cost-management-and-billing-updates-february-2021/#insights)**.

In the Azure portal, navigate to Cost Management from Azure Home. Select a subscription scope and then in the left menu, select **Cost analysis**. In the view list, select any view under **Smart views**. In the following example, the **Resources** smart view is selected. If you have a cost anomaly, you see an insight.

:::image type="content" source="./media/analyze-unexpected-charges/insight-recommendation-01.png" alt-text="Example screenshot showing an insight." lightbox="./media/analyze-unexpected-charges/insight-recommendation-01.png" :::

If you don't have any anomalies, you see a **No anomalies detected** insight, confirming the dates that were evaluated.

:::image type="content" source="./media/analyze-unexpected-charges/insight-no-anomalies.png" alt-text="Example screenshot showing No anomalies detected message." lightbox="./media/analyze-unexpected-charges/insight-no-anomalies.png" :::

### Drill into anomaly details

To drill into the underlying data for something that has changed, select the insight link. It opens a view in classic cost analysis where you can review your daily usage by resource group for the time range that was evaluated.

Continuing from the previous example of the anomaly labeled **Daily run rate down 748% on Sep 28**, let's examine its details after the link is selected. The following example image shows details about the anomaly. Notice the large increase in costs, a cost spike, and eventual drop in from a temporary, short-lived resource.

:::image type="content" source="./media/analyze-unexpected-charges/anomaly-details-cost-analysis.png" alt-text="Example screenshot showing a cost increase from a short-lived resource." lightbox="./media/analyze-unexpected-charges/anomaly-details-cost-analysis.png" :::

Cost anomalies are evaluated for subscriptions daily and compare the day's total usage to a forecasted total based on the last 60 days to account for common patterns in your recent usage. For example, spikes every Monday. Anomaly detection runs 36 hours after the end of the day (UTC) to ensure a complete data set is available.

The anomaly detection model is a univariate time-series, unsupervised prediction and reconstruction-based model that uses 60 days of historical usage for training, then forecasts expected usage for the day. Anomaly detection forecasting uses a deep learning algorithm called [WaveNet](https://www.deepmind.com/blog/wavenet-a-generative-model-for-raw-audio). It's different than the Cost Management forecast. The total normalized usage is determined to be anomalous if it falls outside the expected range based on a predetermined confidence interval.

Anomaly detection is available to every subscription monitored using the cost analysis. To enable anomaly detection for your subscriptions, open a cost analysis smart view and select your subscription from the scope selector at the top of the page. You see a notification informing you that your subscription is onboarded and you start to see your anomaly detection status within 24 hours.

## Create an anomaly alert

You can create an alert to automatically get notified when an anomaly is detected. Creating an anomaly alert requires the Cost Management Contributor or greater role or the `Microsoft.CostManagement/scheduledActions/write` permission for custom roles. For more information, see [Feature behavior for each role](../costs/understand-work-scopes.md#feature-behavior-for-each-role).

>[!NOTE]
> Anomaly alerts are sent based on the current access of the rule creator at the time that the email is sent. If your organization has a policy that prohibits permanently assigning higher privileges to users, you can use a service principal and create the alert directly using the [Scheduled Actions API](/rest/api/cost-management/scheduled-actions/create-or-update-by-scope#createorupdateinsightalertscheduledactionbyscope).

An anomaly alert email includes a summary of changes in resource group count and cost. It also includes the top resource group changes for the day compared to the previous 60 days. And, it has a direct link to the Azure portal so that you can review the cost and investigate further.

An anomaly alert email is sent only one time when it's detected.

1. From Azure Home, select **Cost Management** under **Tools**.
1. Verify you've selected the correct subscription in the scope at the top of the page.
1. In the left menu, select **Cost alerts**.
1. On the toolbar, select **+ Add**.
1. On the Create alert rule page, select **Anomaly** as the **Alert type**.
1. Enter all the required information, then select **Create**.  
    :::image type="content" source="./media/analyze-unexpected-charges/subscribe-emails.png" alt-text="Screenshot showing the Create alert rule page where you enter notification information for an alert." lightbox="./media/analyze-unexpected-charges/subscribe-emails.png" :::
  You can view and manage the anomaly alert rule by navigating to **Alert rules** in the left navigation menu.

Here's an example email generated for an anomaly alert.

:::image type="content" source="./media/analyze-unexpected-charges/anomaly-alert-email.png" alt-text="Screenshot showing an example anomaly alert email." lightbox="./media/analyze-unexpected-charges/anomaly-alert-email.png" :::

## Manually find unexpected cost changes

Let's look at a more detailed example of finding a change in cost. When you navigate to Cost analysis and then select a subscription scope, you start with the **Accumulated costs** view. The following screenshot shows an example of what you might see.

:::image type="content" source="./media/analyze-unexpected-charges/drill-in-default-view.png" alt-text="Example screenshot showing the accumulated costs view." lightbox="./media/analyze-unexpected-charges/drill-in-default-view.png" :::

With the default view and current month (March 2022), the example image doesn't show any dips or spikes.

Change the view to **Daily costs** and then expand the date range to Last year (2021). Then, set the granularity to **Monthly**. In the following image, notice that there's a significant increase in costs for the `arcticmustang` resource group starting in July.

:::image type="content" source="./media/analyze-unexpected-charges/drill-in-articmustang.png" alt-text="Example screenshot showing an increase in monthly costs." lightbox="./media/analyze-unexpected-charges/drill-in-articmustang.png" :::

Let's examine the increase in cost for the resource group more fully. To drill into the time frame of the change, change the date range. In the following example, we set a custom date range from June to July 2021 and then set the Granularity to **Daily**. In the example, the daily cost for the resource group was about $4.56. On June 30, the cost increased to $20.68. Later on July 1 and after, the daily cost went to $30.22.

:::image type="content" source="./media/analyze-unexpected-charges/drill-in-articmustang-daily-cost.png" alt-text="Example screenshot showing an increase in daily costs." lightbox="./media/analyze-unexpected-charges/drill-in-articmustang-daily-cost.png" :::

So far, we've found an increase in cost for the `articmustang` resource group at the end of June and the beginning of July. You might notice that the cost increase spanned over two days. The change took two days because a change in the middle of a day doesn't show the full effect of that change until the following full day.

Let's continue drilling into the data to find out more about the cost increase. Select the item that increased in cost (`articmustang`) to automatically set a filter for the resource group name. Then, change the **Group by** list to **Resource**. Then set the date range to a smaller period. For example, June 28 to July 4. In the following example image, the increase in cost is clearly shown. The type of resource is shown as _microsoft.network/virtualnetworkgateways_.

:::image type="content" source="./media/analyze-unexpected-charges/drill-in-resource-increase-cost.png" alt-text="Example screenshot showing increased cost for a resource type." lightbox="./media/analyze-unexpected-charges/drill-in-resource-increase-cost.png" :::

Next, select the resource in the chart that increased in cost `articring` to set another filter for the resource. Now, costs are shown for just that resource. Then, set the **Group by** list to **Meter**.

:::image type="content" source="./media/analyze-unexpected-charges/drill-in-resource-meter-change.png" alt-text="Example screenshot showing increased cost for a specific resource." lightbox="./media/analyze-unexpected-charges/drill-in-resource-meter-change.png" :::

In the previous example, you see that the virtual private network resource named VpnGw1 stopped getting used on June 30. On June 30, a more expensive virtual private network resource named VpnGw3 started getting used.

At this point, you know what changed and the value that costs changed. However, you might not know _why_ the change happened. At this point, you should contact the people that created or used the resource. Continue to the next section to learn more.

## Find people responsible for changed resource use

Using Cost analysis, you might have found resources that had sudden changes in usage. However, it might not be obvious who is responsible for the resource or why the change was made. Often, the team responsible for a given resource knows about changes that were made to a resource. Engaging them is useful as you identify why charges might appear. For example, the owning team may have recently created the resource, updated its SKU (thereby changing the resource rate), or increased the load on the resource due to code changes.

The [Get resource changes](../../governance/resource-graph/how-to/get-resource-changes.md) article for Azure Resource Graph might help you to find additional information about configuration changes to resources.

Continue reading the following sections for more techniques to determine who owns a resource.

### Analyze the audit logs for the resource

If you have permission to view a resource, you should be able to access its audit logs. Review the logs to find the user who was responsible for the most recent changes to a resource. To learn more, see [View and retrieve Azure Activity log events](../../azure-monitor/essentials/activity-log.md#view-the-activity-log).

### Analyze user permissions to the resource's parent scope

People that have write access to a subscription or resource group typically have information about the resources that were created or updated. They should be able to explain the purpose of a resource or point you to the person who knows. To identify the people with permissions for a subscription scope, see [Check access for a user to Azure resources](../../role-based-access-control/check-access.md). You can use a similar process for billing scopes, resource groups, and management groups.

### Examine tagged resources

If you have an existing policy of [tagging resources](../costs/cost-mgt-best-practices.md#tag-shared-resources), the resource might be tagged with identifying information. For example, resources might be tagged with owner, cost center, or development environment information. If you don't already have a resource tagging policy in place, consider adopting one to help identify resources in the future.

## Get help to identify charges

If you've used the preceding strategies and you still don't understand why you received a charge or if you need other help with billing issues, [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Next steps

- Learn about how to [Optimize your cloud investment with Cost Management](../costs/cost-mgt-best-practices.md).
