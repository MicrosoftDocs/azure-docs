---
title: Manage your alert instances
description: The alerts page summarizes all alert instances in all your Azure resources generated in the last 30 days and allows you to manage your alert instances.
ms.author: abbyweisberg
ms.topic: conceptual
ms.date: 01/21/2024
ms.reviewer: harelbr
---

# Manage your alert instances

The **Alerts** page summarizes all alert instances in all your Azure resources generated in the last 30 days. Alerts are stored for 30 days and are deleted after the 30-day retention period. 
For stateful alerts, while the alert itself is deleted after 30 days, and isn't viewable on the alerts page, the alert condition is stored until the alert is resolved, to prevent firing another alert, and so that notifications can be sent when the alert is resolved. For more information, see [Alerts and state](alerts-overview.md#alerts-and-state).

## Access the Alerts page

You can get to the **Alerts** page in a few ways:

- From the home page in the [Azure portal](https://portal.azure.com/), select **Monitor** > **Alerts**.  

  :::image type="content" source="media/alerts-managing-alert-instances/alerts-monitor-menu.png" alt-text="Screenshot that shows Alerts on the Azure Monitor menu. ":::
  
- From a specific resource, go to the **Monitoring** section and select **Alerts**. The page that opens contains the alerts for the specific resource.

  :::image type="content" source="media/alerts-managing-alert-instances/alerts-resource-menu.png" alt-text="Screenshot that shows Alerts on the menu of a resource in the Azure portal.":::

## Alerts summary pane

The **Alerts** summary pane summarizes the alerts fired in the last 24 hours. You can filter the list of alert instances by **Time range**, **Subscription**, **Alert condition**, **Severity**, and more. If you selected a specific alert severity to open the **Alerts** page, the list is prefiltered for that severity.

To see more information about a specific alert instance, select the alert instance to open the **Alert details** page.

  :::image type="content" source="media/alerts-managing-alert-instances/alerts-page.png" lightbox="media/alerts-managing-alert-instances/alerts-page.png" alt-text="Screenshot that shows the Alerts summary page in the Azure portal.":::


## View alerts as a timeline (preview)

You can see your alerts in a timeline view. In this view, you can see the number of alerts fired in a specific time range. The timeline shows you which resource the alerts were fired on to give you context of the alert in your Azure hierarchy. The alerts are grouped by the time they were fired. You can filter the alerts by severity, resource, and more. You can also select a specific time range to see the alerts fired in that time range.

  :::image type="content" source="media/alerts-managing-alert-instances/alerts-timeline.png" lightbox="media/alerts-managing-alert-instances/alerts-timeline.png" alt-text="Screenshot that shows the Alerts timeline page in the Azure portal.":::

To see the alerts in a timeline view, select **View as timeline** at the top of the Alerts summary page. You can choose to see the alerts timeline in with the severity of the alerts indicated by color, or a simplified view with critical or noncritical alerts.

  :::image type="content" source="media/alerts-managing-alert-instances/alerts-view-timeline.png" lightbox="media/alerts-managing-alert-instances/alerts-view-timeline.png" alt-text="Screenshot that shows the view timeline button in the Alerts summary page in the Azure portal.":::

You can drill down into a specific time range. Select one of the cards in the timeline to see the alerts fired in that time range.

  :::image type="content" source="media/alerts-managing-alert-instances/alerts-timeline-details.png" lightbox="media/alerts-managing-alert-instances/alerts-timeline-details.png" alt-text="Screenshot that shows the drilldown into a specific time range in the Alerts timeline page in the Azure portal.":::


### Customize the timeline view

You can customize the timeline view to suit your needs by changing the grouping of your alerts. 

1. From the timeline view of the alerts page, select the **Edit** icon in the groups box at the top of the page.

    :::image type="content" source="media/alerts-managing-alert-instances/alerts-timeline-edit-pencil.png" alt-text="Screenshot that shows the pencil icon to edit the timeline view of the alerts page in the Azure portal.":::

1. In the **Edit group** pane, drag and drop the fields to group by. You can change the order of the groupings, and add new dimensions, tags, labels, and more. Validation is run on the grouping to make sure that the grouping is valid. If you are at the alerts page for a specific resource, the options for grouping are filtered by that resource, and you can only group by items related to the resource.

    For AKS clusters, we provide suggested views based on popular groupings.
1. Select **Save**.

    :::image type="content" source="media/alerts-managing-alert-instances/alerts-edit-timeline-view.png" lightbox="media/alerts-managing-alert-instances/alerts-edit-timeline-view.png" alt-text="Screenshot that shows the edit group pane in the timeline view of the alerts page in the Azure portal.":::
1. The timeline displays the alerts grouped by the fields you selected. Alerts that don't logically belong in the grouping you selected are listed in a group called **Other**.
1. When you have the grouping you want, select **Save view** to save the view.

### Manage timeline views

You can save up to 10 views of the alerts timeline. The **default** view is the Azure default view. 

1. From the main **Alerts** page, select **Manage views** to see the list of views you saved. 
1. Select **Save view as** to save a new view.
1. Mark a view as **Favorite** to see that view every time you come to the **Alerts** page. 
1. Select **Browse all views** to see all the views you saved, select a favorite view, or delete a view. You can only see all of the views from the main alerts page, not from the alerts of an individual resource.

## Alert details page

The **Alert details** page provides more information about the selected alert:

 - To change the user response to the alert, select the pencil near **User response**.
 - To see the details of the alert, expand the **Additional details** section.
 - To see all closed alerts, select the **History** tab.  

:::image type="content" source="media/alerts-managing-alert-instances/alerts-details-page.png" lightbox="media/alerts-managing-alert-instances/alerts-details-page.png" alt-text="Screenshot that shows the Alerts details page in the Azure portal.":::

## Manage your alerts programmatically

You can query your alerts instances to create custom views outside of the Azure portal or to analyze your alerts to identify patterns and trends.

We recommend that you use [Azure Resource Graph](https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade) with the `AlertsManagementResources` schema to manage alerts across multiple subscriptions. For a sample query, see [Azure Resource Graph sample queries for Azure Monitor](../resource-graph-samples.md).

You can use Resource Graph:
 - With [Azure PowerShell](/powershell/module/az.monitor/).
 - In the Azure portal.

You can also use the [Alert Management REST API](/rest/api/monitor/alertsmanagement/alerts) for lower-scale querying or to update fired alerts.

## Next steps

- [Learn about Azure Monitor alerts](./alerts-overview.md)
- [Create a new alert rule](alerts-log.md)
