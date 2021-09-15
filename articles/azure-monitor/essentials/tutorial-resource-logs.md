---
title: Tutorial - Collect resource logs from an Azure resource
description: Tutorial to configure diagnostic settings to collect resource logs from an Azure resource into a Log Analytics workspace where they can be analyzed with a log query.
ms.topic: tutorial
author: bwren
ms.author: bwren
ms.date: 12/15/2019
---

# Tutorial: Collect and analyze resource logs from an Azure resource
Resource logs provide insight into the detailed operation of an Azure resource and are useful for monitoring their health and availability. Azure resources generate resource logs automatically, but you must configure where they should be collected. This tutorial takes you through the process of creating a diagnostic setting to send resource logs to a Log Analytics workspace where you can analyze them with log queries.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a Log Analytics workspace in Azure Monitor
> * Create a diagnostic setting to collect resource logs 
> * Create a simple log query to analyze logs


## Prerequisites

To complete this tutorial you need the following: 

- An Azure resource to monitor. You can use any resource in your Azure subscription that supports diagnostic settings. To determine whether a resource supports diagnostic settings, go to its menu in the Azure portal and verify that there's a **Diagnostic settings** option in the **Monitoring** section of the menu.
- A Log Analytics workspace to collect the resource logs. If you don't already have a workspace, follow [Tutorial: Create Log Analytics workspace in Azure Monitor](../logs/tutorial-workspace.md) to create one.

> [!NOTE]
> This procedure does not apply to Azure virtual machines since their **Diagnostic settings** menu is used to configure the diagnostic extension.


## Create a diagnostic setting
[Diagnostic settings](../essentials/diagnostic-settings.md) define where resource logs should be sent for a particular resource. A single diagnostic setting can have multiple [destinations](../essentials/diagnostic-settings.md#destinations), but we'll only use a Log Analytics workspace in this tutorial.

Under the **Monitoring** section of your resource's menu, select **Diagnostic settings**. You should have a message "No diagnostic settings defined". Click **Add diagnostic setting**.

:::image type="content" source="media/tutorial-resource-logs/diagnostic-settings.png" lightbox="media/tutorial-resource-logs/diagnostic-settings.png"alt-text="Diagnostic settings":::


Each diagnostic setting has three basic parts:
 
   - **Name**: This has no significant effect and should simply be descriptive to you.
   - **Destinations**: One or more destinations to send the logs. All Azure services share the same set of three possible destinations. Each diagnostic setting can define one or more destinations but no more than one destination of a particular type. 
   - **Categories**: Categories of logs to send to each of the destinations. The set of categories will vary for each Azure service.

Select **Send to Log Analytics workspace** and then select the workspace that you created. Select the categories that you want to collect. See the documentation for each service for a definition of its available categories.

:::image type="content" source="media/tutorial-resource-logs/diagnostic-setting-details.png" lightbox="media/tutorial-resource-logs/diagnostic-setting-details.png"alt-text="Diagnostic setting details":::

Click **Save** to save the diagnostic settings.

    
 
 ## Use a log query to retrieve logs
Data is retrieved from a Log Analytics workspace using a log query written in Kusto Query Language (KQL). Insights and solutions in Azure Monitor will provide log queries to retrieve data for a particular service, but you can work directly with log queries and their results in the Azure portal with Log Analytics. 

Under the **Monitoring** section of your resource's menu, select **Logs**. Log Analytics opens with an empty query window with the scope set to your resource. Any queries will include only records from that resource.

    > [!NOTE]
    > If you opened Logs from the Azure Monitor menu, the scope would be set to the Log Analytics workspace. In this case, any queries will include all records in the workspace.

:::image type="content" source="media/tutorial-resource-logs/logs.png" lightbox="media/tutorial-resource-logs/logs.png"alt-text="Screenshot shows Logs for a logic app displaying a new query with the logic app name highlighted.":::


The service shown in the example writes resource logs to the **AzureDiagnostics** table, but other services may write to other tables. See [Supported services, schemas, and categories for Azure Resource Logs](../essentials/resource-logs-schema.md) for tables used by different Azure services.

    > [!NOTE]
    > Multiple services write resource logs to the AzureDiagnostics table. If you start Log Analytics from the Azure Monitor menu, then you would need to add a `where` statement with the `ResourceProvider` column to specify your particular service. When you start Log Analytics from a resource's menu, then the scope is set to only records from this resource so this column isn't required. See the service's documentation for sample queries.


Type in a query and click **Run** to inspect results.  See [Get started with log queries in Azure Monitor](../logs/get-started-queries.md) for a tutorial on writing log queries.

    ![Log query](media/tutorial-resource-logs/log-query-1.png)




## Next steps
Now that you're collecting resource logs, create a log query alert to be proactively notified when interesting data is identified in your log data.

> [!div class="nextstepaction"]
> [Create a log query alert for an Azure resource](../alerts/tutorial-log-alert.md)
