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
The [Azure Activity log](platform-logs-overview.md) is a [platform log](platform-logs-overview.md) that provides insight into subscription-level events that have occurred in Azure. While you can view the Activity log in the Azure portal, you should configure it to send to a Log Analytics workspace to enable additional features of Azure Monitor. This article describes how to perform this configuration and how to send the Activity log to Azure storage and event hubs.

Collecting the Activity Log in a Log Analytics workspace provides the following advantages:

- No charge for space Activity log data stored in a Log Analytics workspace.
- Correlate Activity log data with other monitoring data collected by Azure Monitor.
- Use [log queries](../log-query/log-query-overview.md) to perform complex analysis and gain deep insights on Activity Log entries.
- Store Activity log entries for longer than 90 days.
- Consolidate log entries from multiple Azure subscriptions into one location for analysis together.



## Collecting Activity log
The Activity log is collected automatically for [viewing in the Azure portal](activity-log-view.md). To send it to other destinations, create a [diagnostic setting](diagnostic-settings.md), which is the same method used by resource logs. 

To create a diagnostic setting for the Activity log, select **Diagnostic settings** from the **Activity log** menu in Azure Monitor. See [Create diagnostic setting to collect platform logs and metrics in Azure](diagnostic-settings.md) for details on creating the setting. See [Categories in the Activity log](activity-log-view.md#categories-in-the-activity-log) for a description of the categories you can filter in the setting. If you have any legacy settings, make sure you disable them before creating a diagnostic setting. Having both enabled may result in duplicate data.


> [!NOTE]
> Currently, you can only create a subscription level diagnostic setting using the Azure portal. To use other methods such as PowerShell or CLI, you can create a Resource Manager template.


## Legacy settings 
While diagnostic settings are the preferred method to send the Activity log to different destinations, legacy methods are still available and will continue to work if you don't choose to replace with a diagnostic setting. Diagnostic settings have the following advantages over the previous methods, and it's recommended that you change any legacy configuration to this new strategy:

- Consistent method for collecting all platform logs.
- Collect Activity log across multiple subscriptions and tenants.
- Filter collection to only collect logs for particular categories.
- Collect all Activity log categories. Some categories are not collected using legacy method.
- Faster latency for log ingestion. The previous method has about 15 minutes latency while diagnostic settings adds only about 1 minute.


### Log profiles
Log profiles are the legacy method for sending the Activity log to Azure storage or event hubs. Use the following procedure to continue working with a log profile or to disable it in preparation for migrating to a diagnostic setting.

1. From the **Azure Monitor** menu in the Azure portal, select **Activity log**.
3. Click **Diagnostic settings**.

   ![Diagnostic settings](media/diagnostic-settings-subscription/diagnostic-settings.png)

4. Click the purple banner for the legacy experience.

    ![Legacy experience](media/diagnostic-settings-subscription/legacy-experience.png)

### Log Analytics workspace
The legacy method for collecting the Activity log into a Log Analytics workspace is by connecting the log in the workspace configuration. 

1. From the **Log Analytics workspaces** menu in the Azure portal, select the workspace to collect the Activity Log.
1. In the **Workspace Data Sources** section of the workspace's menu, select **Azure Activity log**.
1. Click the subscription you want to connect.

    ![Workspaces](media/activity-log-collect/workspaces.png)

1. Click **Connect** to connect the Activity log in the subscription to the selected workspace. If the subscription is already connected to another workspace, click **Disconnect** first to disconnect it.

    ![Connect Workspaces](media/activity-log-collect/connect-workspace.png)


### Disable collection into Log Analytics workspace

1. Open the **Log Analytics workspaces** menu in the Azure portal and select the workspace to collect the Activity Log.
2. In the **Workspace Data Sources** section of the workspace's menu, select **Azure Activity log**.
3. Click the subscription you want to disconnect.
4. Click **Disconnect** and then **Yes** when asked to confirm your choice.


### Analysis of Activity log
You can [view the Activity log in the Azure portal](activity-log-view.md) without any configuration. When you configure it to be collected into a Log Analytics workspace, 

What is changing is analysis of Activity log entries in a Log Analytics workspace. Activity log events are still sent to the *AzureActivity* table, and the same log queries can be used to analyze them. The Activity Logs Analytics monitoring solution is being deprecated along with the deprecation of Azure Monitor views. A new Azure Monitor workbook will be provided in the near future providing queries and visualizations for gaining insights into the Activity log.



## Analyze Activity log in Log Analytics workspace
When you connect an Activity Log to a Log Analytics workspace, entries will be written to the workspace into a table called **AzureActivity** that you can retrieve with a [log query](../log-query/log-query-overview.md). The structure of this table varies depending on the [category of log entry](activity-log-view.md#categories-in-the-activity-log). See [Azure Activity Log event schema](activity-log-schema.md) for a description of each category.


### Differences in data
Diagnostic settings collect the same data as the legacy method used to collect the Activity log with some changes to the structure of the *AzureActivity* table.

The columns in the following table have been deprecated. They still exist in *AzureActivity* but they will have no data. The replacement for these columns are not new, but they contain the same data as the deprecated column. They are in a different format, so you may need to modify log queries that use them. 

| Deprecated column | Replacement column |
|:---|:---|
| ActivityStatus    | ActivityStatusValue    |
| ActivitySubstatus | ActivitySubstatusValue |
| OperationName     | OperationNameValue     |
| ResourceProvider  | ResourceProviderValue  |

The following column have been added to *AzureActivity*:

- Authorization_d
- Claims_d
- Properties_d

> [!IMPORTANT]
> In some cases, the values in these columns may be in all uppercase. If you have a query that includes these columns, you should use the [=~ operator](https://docs.microsoft.com/azure/kusto/query/datatypes-string-operators) to do a case insensitive comparison.

### Query sample



## Activity Logs Analytics monitoring solution
The Azure Log Analytics monitoring solution is currently being deprecated but can still be used if you already have it enabled. It cannot be used if you collect the Activity log using a diagnostic setting as described above. The option to enable the solution for a new subscription has been removed from the Azure portal, but you can enable it using the template and procedure in [Enable solution for new subscription](#enable-solution-for-new-subscription).

> [!IMPORTANT]
> The Activity Logs Analytics monitoring solution is not supported if you're collecting the Activity log using a diagnostic setting. You must continue to connect your subscription to a workspace to use the solution.


### Use the solution
Monitoring solutions are accessed from the **Monitor** menu in the Azure portal. Select **More** in the **Insights** section to open the **Overview** page with the solution tiles. The **Azure Activity Logs** tile displays a count of the number of **AzureActivity** records in your workspace.

![Azure Activity Logs tile](media/collect-activity-logs/azure-activity-logs-tile.png)


Click the **Azure Activity Logs** tile to open the **Azure Activity Logs** view. The view includes the visualization parts in the following table. Each part lists up to 10 items matching that parts's criteria for the specified time range. You can run a log query that returns all  matching records by clicking **See all** at the bottom of the part.

![Azure Activity Logs dashboard](media/collect-activity-logs/activity-log-dash.png)


### Enable the solution for new subscriptions
You can no longer add a new subscription to the Activity Logs Analytics solution using the Azure portal, but you can add a new subscription using a resource manager template. 

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




### Considerations
Consider the following details of Activity log collection using diagnostic settings before enabling this feature.

- The retention setting for collecting the Activity log to Azure storage has been removed meaning that data will be stored indefinitely until you remove it.



