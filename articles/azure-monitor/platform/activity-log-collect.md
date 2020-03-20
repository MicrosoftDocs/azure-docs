---
title: Collect and analyze Azure activity log in Azure Monitor
description: Collect the Azure Activity Log in Azure Monitor Logs and use the monitoring solution to analyze and search the Azure activity log across all your Azure subscriptions.
ms.subservice: logs
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 03/20/2020

---

# Collect and analyze Azure Activity log in Azure Monitor
The [Azure Activity log](platform-logs-overview.md) is a [platform log](platform-logs-overview.md) that provides insight into subscription-level events that have occurred in Azure. While you can view the Activity log in the Azure portal, you can send the entries to other destinations to provide different methods of analysis. The methods to configure different destinations for the Activity log are in the process of changing.  This article describes this transition and the roadmap for the collection and analysis for the Activity log.

## Summary of changes

### Collection of Activity log
Like other platform logs, the Activity log can be sent to a Log Analytics workspace, Azure storage, or Azure Event Hubs. This configuration is now performed for the Activity log with a [diagnostic setting](diagnostic-setting.md), which is the same method used by resource logs. Prior to this change, there were two ways to sent the Activity log to these destinations: 

- Send to a Log Analytics workspace by connect the Activity log to the workspace in the workspace configuration.
- Send to Azure storage or event hubs by creating a log profile. 

### Analysis of Activity log
You can still [view the Activity log in the Azure portal](activity-log-view.md) without any configuration. What is changing is analysis of Activity log entries in a Log Analytics workspace. Activity log events are still sent to the *AzureActivity* table, and the same log queries can be used to analyze them. The Activity Logs Analytics monitoring solution is being deprecated along with the deprecation of Azure Monitor views. A new Azure Monitor workbook will be provided in the near future providing queries and visualizations for gaining insights into the Activity log.



## Collecting Activity log
The method to send Activity log entries to an event hub or storage account or to a Log Analytics workspace has changed to use [diagnostic settings](diagnostic-settings.md) which has the following advantages over the previous methods:

- Consistent method for collecting all platform logs.
- Collect Activity log across multiple subscriptions and tenants.
- Filter collection to only collect logs for particular categories.
- Collect all Activity log categories. Some categories are not collected using legacy method.
- Faster latency for log ingestion. The previous method has about 15 minutes latency while diagnostic settings adds only about 1 minute.

Connecting the Activity Log to a Log Analytics workspace provides the following benefits:

- Consolidate the Activity Log from multiple Azure subscriptions into one location for analysis.
- Store Activity Log entries for longer than 90 days.
- Correlate Activity Log data with other monitoring data collected by Azure Monitor.
- Use [log queries](../log-query/log-query-overview.md) to perform complex analysis and gain deep insights on Activity Log entries.

### Considerations
Consider the following details of Activity log collection using diagnostic settings before enabling this feature.

- The retention setting for collecting the Activity log to Azure storage has been removed meaning that data will be stored indefinitely until you remove it.
- Currently, you can only create a subscription level diagnostic setting using the Azure portal. To use other methods such as PowerShell or CLI, you can create a Resource Manager template.


### Work with legacy settings
Legacy settings for collecting the Activity log will continue to work if you don't choose to replace with a diagnostic setting. Use the following method to manage the log profile for a subscription.

1. From the **Azure Monitor** menu in the Azure portal, select **Activity log**.
3. Click **Diagnostic settings**.

   ![Diagnostic settings](media/diagnostic-settings-subscription/diagnostic-settings.png)

4. Click the purple banner for the legacy experience.

    ![Legacy experience](media/diagnostic-settings-subscription/legacy-experience.png)



### Disable existing settings
If you have existing settings to collect the Activity log, you should disable them before enabling it using diagnostic settings. Having both enabled may result in duplicate data.

### Disable collection into Log Analytics workspace

1. Open the **Log Analytics workspaces** menu in the Azure portal and select the workspace to collect the Activity Log.
2. In the **Workspace Data Sources** section of the workspace's menu, select **Azure Activity log**.
3. Click the subscription you want to disconnect.
4. Click **Disconnect** and then **Yes** when asked to confirm your choice.

### Disable log profile

1. Use the procedure described in [Work with legacy settings](#work-with-legacy-settings) to open legacy settings.
2. Disable any current collection to storage or event hubs.


## Analyze Activity log in Log Analytics workspace
When you connect an Activity Log to a Log Analytics workspace, entries will be written to the workspace into a table called **AzureActivity** that you can retrieve with a [log query](../log-query/log-query-overview.md). The structure of this table varies depending on the [category of log entry](activity-log-view.md#categories-in-the-activity-log). See [Azure Activity Log event schema](activity-log-schema.md) for a description of each category.


### Differences in data
Diagnostic settings collect the same data as the previous methods used to collect the Activity log with the following current differences:

The following columns have been removed. The replacement for these columns are in a different format, so you may need to modify log queries that use them. You may still see removed columns in the schema, but they won't be populated with data.

| Removed column | Replacement column |
|:---|:---|
| ActivityStatus    | ActivityStatusValue    |
| ActivitySubstatus | ActivitySubstatusValue |
| OperationName     | OperationNameValue     |
| ResourceProvider  | ResourceProviderValue  |

The following column have been added:

- Authorization_d
- Claims_d
- Properties_d

> [!IMPORTANT]
> In some cases, the values in these columns may be in all uppercase. If you have a query that includes these columns, you should use the [=~ operator](https://docs.microsoft.com/azure/kusto/query/datatypes-string-operators) to do a case insensitive comparison.


## Activity Logs Analytics monitoring solution
The Azure Log Analytics monitoring solution is currently being deprecated but can still be used if you already have it enabled. The option to enable the solution for a new subscription has been removed from the Azure portal, but you can enable it using the template and procedure in [Enable solution for new subscription](#enable-solution-for-new-subscription).


### Use the solution
Monitoring solutions are accessed from the **Monitor** menu in the Azure portal. Select **More** in the **Insights** section to open the **Overview** page with the solution tiles. The **Azure Activity Logs** tile displays a count of the number of **AzureActivity** records in your workspace.

![Azure Activity Logs tile](media/collect-activity-logs/azure-activity-logs-tile.png)


Click the **Azure Activity Logs** tile to open the **Azure Activity Logs** view. The view includes the visualization parts in the following table. Each part lists up to 10 items matching that parts's criteria for the specified time range. You can run a log query that returns all  matching records by clicking **See all** at the bottom of the part.

![Azure Activity Logs dashboard](media/collect-activity-logs/activity-log-dash.png)

| Visualization part | Description |
| --- | --- |
| Azure Activity Log Entries | Shows a bar chart of the top Azure Activity Log entry record totals for the date range that you have selected and shows a list of the top 10 activity callers. Click the bar chart to run a log search for `AzureActivity`. Click a caller item to run a log search returning all Activity Log entries for that item. |
| Activity Logs by Status | Shows a doughnut chart for Azure Activity Log status for the selected date range and a list of the top ten status records. Click the chart to run a log query for `AzureActivity | summarize AggregatedValue = count() by ActivityStatus`. Click a status item to run a log search returning all Activity Log entries for that status record. |
| Activity Logs by Resource | Shows the total number of resources with Activity Logs and lists the top ten resources with record counts for each resource. Click the total area to run a log search for `AzureActivity | summarize AggregatedValue = count() by Resource`, which shows all Azure resources available to the solution. Click a resource to run a log query returning all activity records for that resource. |
| Activity Logs by Resource Provider | Shows the total number of resource providers that produce Activity Logs and lists the top ten. Click the total area to run a log query for `AzureActivity | summarize AggregatedValue = count() by ResourceProvider`, which shows all Azure resource providers. Click a resource provider to run a log query returning all activity records for the provider. |

## Enable solution for new subscription
To enable the solution to collect and analyze the Activity log for a new subscription, follow the procedure below.

1. Copy the following json into a file called *ActivityLogTemplate*.json.

    ```json
    {
    "$schema": "https://schema.management.azure.com/schemas/2014-04-01-preview/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "workspaceName": {
            "type": "String",
            "defaultValue": "my-workspace",
            "metadata": {
              "description": "Specifies the name of the workspace."
            }
        },
        "location": {
            "type": "String",
            "allowedValues": [
              "east us",
              "west us",
              "australia central",
              "west europe"
            ],
            "defaultValue": "australia central",
            "metadata": {
              "description": "Specifies the location in which to create the workspace."
            }
        }
      },
        "resources": [
        {
            "type": "Microsoft.OperationalInsights/workspaces",
            "name": "[parameters('workspaceName')]",
            "apiVersion": "2015-11-01-preview",
            "location": "[parameters('location')]",
            "properties": {
                "features": {
                    "searchVersion": 2
                }
            }
        },
        {
            "type": "Microsoft.OperationsManagement/solutions",
            "apiVersion": "2015-11-01-preview",
            "name": "[concat('AzureActivity(', parameters('workspaceName'),')')]",
            "location": "[parameters('location')]",
            "dependsOn": [
                "[resourceId('microsoft.operationalinsights/workspaces', parameters('workspaceName'))]"
            ],
            "plan": {
                "name": "[concat('AzureActivity(', parameters('workspaceName'),')')]",
                "promotionCode": "",
                "product": "OMSGallery/AzureActivity",
                "publisher": "Microsoft"
            },
            "properties": {
                "workspaceResourceId": "[resourceId('microsoft.operationalinsights/workspaces', parameters('workspaceName'))]",
                "containedResources": [
                    "[concat(resourceId('microsoft.operationalinsights/workspaces', parameters('workspaceName')), '/views/AzureActivity(',parameters('workspaceName'))]"
                ]
            }
        },
        {
          "type": "Microsoft.OperationalInsights/workspaces/datasources",
          "kind": "AzureActivityLog",
          "name": "[concat(parameters('workspaceName'), '/', subscription().subscriptionId)]",
          "apiVersion": "2015-11-01-preview",
          "location": "[parameters('location')]",
          "dependsOn": [
              "[parameters('WorkspaceName')]"
          ],
          "properties": {
              "linkedResourceId": "[concat(subscription().Id, '/providers/microsoft.insights/eventTypes/management')]"
          }
        }
      ]
    }    
    ```

2. Deploy the template using the following PowerShell commands:

    ```PowerShell
    Connect-AzAccount
    Select-AzSubscription <SubscriptionName>
    New-AzResourceGroupDeployment -Name activitysolution -ResourceGroupName <ResourceGroup> -TemplateFile <Path to template file>
    ```


## Next steps

- Learn more about the [Activity Log](platform-logs-overview.md).
- Learn more about the [Azure Monitor data platform](data-platform.md).
- Use [log queries](../log-query/log-query-overview.md) to view detailed information from your Activity Log.
