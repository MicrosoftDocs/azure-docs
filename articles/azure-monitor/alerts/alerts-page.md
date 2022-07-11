---
title: View and manage your alert instances
description: The alerts page summarizes all alert instances in all your Azure resources generated in the last 30 days.
ms.topic: conceptual
ms.date: 2/23/2022
ms.reviewer: harelb

---
# View and manage your alert instances

The alerts page summarizes all alert instances in all your Azure resources generated in the last 30 days. You can see all your different types of alerts from multiple subscriptions in a single pane, and you can find specific alert instances for troubleshooting purposes. 

You can get to the alerts page in any of the following ways:

- From the home page in the [Azure portal](https://portal.azure.com/), select **Monitor** > **Alerts**.  

  :::image type="content" source="media/alerts-managing-alert-instances/alerts-monitor-menu.png" alt-text="Screenshot of alerts link on monitor menu. ":::
  
- From a specific resource, go to the **Monitoring** section, and choose **Alerts**. The landing page is pre-filtered for alerts on that specific resource.

  :::image type="content" source="media/alerts-managing-alert-instances/alerts-resource-menu.png" alt-text="Screenshot of alerts link on a resource's menu.":::
## Alert rule recommendations (preview)

> [!NOTE]
> The alert rule recommendations feature is currently in preview and is only enabled for VMs.

If you don't have alert rules defined for the selected resource, either individually or as part of a resource group or subscription, you can [create a new alert rule](alerts-log.md#create-a-new-log-alert-rule-in-the-azure-portal), or [enable recommended out-of-the-box alert rules in the Azure portal (preview)](alerts-log.md#enable-recommended-out-of-the-box-alert-rules-in-the-azure-portal-preview). 

:::image type="content" source="media/alerts-managing-alert-instances/enable-recommended-alert-rules.jpg" alt-text="Screenshot of alerts page with link to recommended alert rules.":::

## The alerts summary pane

If you have alerts configured for this resource, the alerts summary pane summarizes the alerts fired in the last 24 hours. You can modify the list of alert instances by selecting filters such as **time range**, **subscription**, **alert condition**, **severity**, and more. Select an alert instance.

To see more details about a specific alert instance, select the alerts instance to open the **Alert Details** page. 
> [!NOTE]
> If you navigated to the alerts page by selecting a specific alert severity, the list is pre-filtered for that severity.   

:::image type="content" source="media/alerts-managing-alert-instances/alerts-page.png" alt-text="Screenshot of alerts page.":::
 
## The alerts details page

 The **Alerts details** page provides details about the selected alert. Select **Change user response** to change the user response to the alert. You can see all closed alerts in the **History** tab.  

:::image type="content" source="media/alerts-managing-alert-instances/alerts-details-page.png" alt-text="Screenshot of alerts details page.":::

## Next steps

- [Learn about Azure Monitor alerts](./alerts-overview.md)
- [Create a new alert rule](alerts-log.md)