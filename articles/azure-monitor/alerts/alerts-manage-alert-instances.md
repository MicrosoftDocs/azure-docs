---
title: Manage your alert instances
description: The alerts page summarizes all alert instances in all your Azure resources generated in the last 30 days and allows you to manage your alert instances.
ms.topic: conceptual
ms.date: 08/03/2022
ms.reviewer: harelbr
---
# Manage your alert instances
The alerts page summarizes all alert instances in all your Azure resources generated in the last 30 days. You can see all types of alerts from multiple subscriptions in a single pane. You can search for a specific alert and manage alert instances. 

There are a few ways to get to the alerts page:

- From the home page in the [Azure portal](https://portal.azure.com/), select **Monitor** > **Alerts**.  

  :::image type="content" source="media/alerts-managing-alert-instances/alerts-monitor-menu.png" alt-text="Screenshot of the alerts link on the Azure monitor menu. ":::
  
- From a specific resource, go to the **Monitoring** section, and choose **Alerts**. The landing page contains the alerts on that specific resource.

  :::image type="content" source="media/alerts-managing-alert-instances/alerts-resource-menu.png" alt-text="Screenshot of the alerts link on the menu of a resource in the Azure portal.":::

## The alerts summary pane

The alerts summary pane summarizes the alerts fired in the last 24 hours. You can filter the list of alert instances by **time range**, **subscription**, **alert condition**, **severity**, and more. If you navigated to the alerts page by selecting a specific alert severity, the list is pre-filtered for that severity.

To see more details about a specific alert instance, select the alert instance to open the **Alert Details** page. 
   
:::image type="content" source="media/alerts-managing-alert-instances/alerts-page.png" alt-text="Screenshot of the alerts summary page in the Azure portal.":::

## The alerts details page

The **alerts details** page provides details about the selected alert. 
 
 - To change the user response to the alert, select **Change user response** .
 - To see all closed alerts, select the **History** tab.  

:::image type="content" source="media/alerts-managing-alert-instances/alerts-details-page.png" alt-text="Screenshot of the alerts details page in the Azure portal.":::
## Next steps

- [Learn about Azure Monitor alerts](./alerts-overview.md)
- [Create a new alert rule](alerts-log.md)