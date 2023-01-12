---
title: Collect resource logs from an Azure resource
description: Learn how to configure diagnostic settings to send resource logs from an Azure resource io a Log Analytics workspace where they can be analyzed with a log query.
ms.topic: article
author: bwren
ms.author: bwren
ms.date: 11/08/2021
ms.reviewer: lualderm
---

# Collect and analyze resource logs from an Azure resource
Resource logs provide insight into the detailed operation of an Azure resource and are useful for monitoring their health and availability. Azure resources generate resource logs automatically, but you must create a diagnostic setting to collect them. This tutorial takes you through the process of creating a diagnostic setting to send resource logs to a Log Analytics workspace where you can analyze them with log queries.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a Log Analytics workspace in Azure Monitor
> * Create a diagnostic setting to collect resource logs 
> * Create a simple log query to analyze logs


## Prerequisites

To complete the steps in this tutorial, you need the following: 

- An Azure resource to monitor. You can use any resource in your Azure subscription that supports diagnostic settings. To determine whether a resource supports diagnostic settings, go to its menu in the Azure portal and verify that there's a **Diagnostic settings** option in the **Monitoring** section of the menu.


> [!NOTE]
> This procedure does not apply to Azure virtual machines since their **Diagnostic settings** menu is used to configure the diagnostic extension.

## Create a Log Analytics workspace
[!INCLUDE [Create workspace](../../../includes/azure-monitor-tutorial-workspace.md)]

## Create a diagnostic setting
[Diagnostic settings](../essentials/diagnostic-settings.md) define where resource logs should be sent for a particular resource. A single diagnostic setting can have multiple [destinations](../essentials/diagnostic-settings.md#destinations), but we'll only use a Log Analytics workspace in this tutorial.

Under the **Monitoring** section of your resource's menu, select **Diagnostic settings** and click **Add diagnostic setting**.

> [!NOTE]
> Some resource may require additional selections. For example, a storage account requires you to select a resource before the **Add diagnostic setting** option is displayed. You may also notice a **Preview** label for some resources as their diagnostic settings are currently in public preview.

:::image type="content" source="media/tutorial-resource-logs/diagnostic-settings.png" lightbox="media/tutorial-resource-logs/diagnostic-settings.png"alt-text="Diagnostic settings":::


Each diagnostic setting has three basic parts:
 
   - **Name**: This has no significant effect and should simply be descriptive to you.
   - **Categories**: Categories of logs to send to each of the destinations. The set of categories will vary for each Azure service.
   - **Destinations**: One or more destinations to send the logs. All Azure services share the same set of possible destinations. Each diagnostic setting can define one or more destinations but no more than one destination of a particular type. 

Enter a name for the diagnostic setting and select the categories that you want to collect. See the documentation for each service for a definition of its available categories. **AllMetrics** will send that same platform metrics available in Azure Monitor Metrics for the resource to the workspace. This allows you to analyze this data with log queries along with other monitoring data. Select **Send to Log Analytics workspace** and then select the workspace that you created. 

:::image type="content" source="media/tutorial-resource-logs/diagnostic-setting-details.png" lightbox="media/tutorial-resource-logs/diagnostic-setting-details.png"alt-text="Diagnostic setting details":::

Click **Save** to save the diagnostic settings.

    
 
 ## Use a log query to retrieve logs
Data is retrieved from a Log Analytics workspace using a log query written in Kusto Query Language (KQL). A set of precreated queries is available for many Azure services so that you don't require knowledge of KQL to get started.

Select **Logs** from your resource's menu. Log Analytics opens with the **Queries** window that includes  prebuilt queries for your **Resource type**. 

> [!NOTE]
> If the **Queries** window doesn't open, click **Queries** in the top right. 

:::image type="content" source="media/tutorial-resource-logs/queries.png" lightbox="media/tutorial-resource-logs/queries.png"alt-text="Screenshot shows sample queries using resource logs.":::


Browse through the available queries. Identify one to run and click **Run**. The query is added to the query window and the results returned.

:::image type="content" source="media/tutorial-resource-logs/query-results.png" lightbox="media/tutorial-resource-logs/query-results.png"alt-text="Screenshot shows results of a sample log query.":::

## Next steps
Now that you're collecting resource logs, create a log query alert to be proactively notified when interesting data is identified in your log data.

> [!div class="nextstepaction"]
> [Create a log query alert for an Azure resource](../alerts/tutorial-log-alert.md)
