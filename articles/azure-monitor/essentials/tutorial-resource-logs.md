---
title: Collect resource logs from an Azure resource
description: Learn how to configure diagnostic settings to send resource logs from an Azure resource to a Log Analytics workspace where they can be analyzed with a log query.
ms.topic: article
author: bwren
ms.author: bwren
ms.date: 08/08/2023
ms.reviewer: lualderm
---

# Collect and analyze resource logs from an Azure resource
Resource logs provide insight into the detailed operation of an Azure resource and are useful for monitoring their health and availability. Azure resources generate resource logs automatically, but you must create a diagnostic setting to collect them. This tutorial takes you through the process of creating a diagnostic setting to send resource logs to a Log Analytics workspace where you can analyze them with log queries.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a Log Analytics workspace in Azure Monitor.
> * Create a diagnostic setting to collect resource logs.
> * Create a simple log query to analyze logs.

## Prerequisites

To complete the steps in this tutorial, you need an Azure resource to monitor.

You can use any resource in your Azure subscription that supports diagnostic settings. To determine whether a resource supports diagnostic settings, go to its menu in the Azure portal and verify that there's a **Diagnostic settings** option in the **Monitoring** section of the menu.

> [!NOTE]
> This procedure doesn't apply to Azure virtual machines. Their **Diagnostic settings** menu is used to configure the diagnostic extension.

## Create a Log Analytics workspace
[!INCLUDE [Create workspace](../../../includes/azure-monitor-tutorial-workspace.md)]

## Create a diagnostic setting
[Diagnostic settings](../essentials/diagnostic-settings.md) define where to send resource logs for a particular resource. A single diagnostic setting can have multiple [destinations](../essentials/diagnostic-settings.md#destinations), but we only use a Log Analytics workspace in this tutorial.

Under the **Monitoring** section of your resource's menu, select **Diagnostic settings**. Then select **Add diagnostic setting**.

> [!NOTE]
> Some resources might require other selections. For example, a storage account requires you to select a resource before the **Add diagnostic setting** option is displayed. You might also notice a **Preview** label for some resources because their diagnostic settings are currently in preview.

:::image type="content" source="media/tutorial-resource-logs/diagnostic-settings.png" lightbox="media/tutorial-resource-logs/diagnostic-settings.png"alt-text="Screenshot that shows Diagnostic settings.":::

Each diagnostic setting has three basic parts:

   - **Name**: The name has no significant effect and should be descriptive to you.
   - **Categories**: Categories of logs to send to each of the destinations. The set of categories varies for each Azure service.
   - **Destinations**: One or more destinations to send the logs. All Azure services share the same set of possible destinations. Each diagnostic setting can define one or more destinations but no more than one destination of a particular type.

Enter a name for the diagnostic setting and select the categories that you want to collect. See the documentation for each service for a definition of its available categories. **AllMetrics** sends the same platform metrics available in Azure Monitor Metrics for the resource to the workspace. As a result, you can analyze this data with log queries along with other monitoring data. Select **Send to Log Analytics workspace** and then select the workspace that you created.

:::image type="content" source="media/tutorial-resource-logs/diagnostic-setting-details.png" lightbox="media/tutorial-resource-logs/diagnostic-setting-details.png"alt-text="Screenshot that shows Diagnostic setting details.":::

Select **Save** to save the diagnostic settings.

 ## Use a log query to retrieve logs
Data is retrieved from a Log Analytics workspace by using a log query written in Kusto Query Language (KQL). A set of pre-created queries is available for many Azure services, so you don't require knowledge of KQL to get started.

Select **Logs** from your resource's menu. Log Analytics opens with the **Queries** window that includes prebuilt queries for your resource type.

> [!NOTE]
> If the **Queries** window doesn't open, select **Queries** in the upper-right corner.

:::image type="content" source="media/tutorial-resource-logs/queries.png" lightbox="media/tutorial-resource-logs/queries.png"alt-text="Screenshot that shows sample queries using resource logs.":::

Browse through the available queries. Identify one to run and select **Run**. The query is added to the query window and the results are returned.

:::image type="content" source="media/tutorial-resource-logs/query-results.png" lightbox="media/tutorial-resource-logs/query-results.png"alt-text="Screenshot that shows the results of a sample log query.":::

## Next steps
Now that you're collecting resource logs, create a log query alert to be proactively notified when interesting data is identified in your log data.

> [!div class="nextstepaction"]
> [Create a log query alert for an Azure resource](../alerts/tutorial-log-alert.md)
