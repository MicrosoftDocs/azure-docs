---
title: Collect Azure Activity log with diagnostic settings (preview) - Azure Monitor | Microsoft Docs
description: Use diagnostic settings to forward Azure Activity logs to Azure Monitor Logs, Azure storage, or Azure Event Hubs.
author: bwren
ms.service: azure-monitor
ms.subservice: logs
ms.topic: conceptual
ms.author: bwren
ms.date: 10/31/2019

---

# Collect Azure Activity log with diagnostic settings (preview)
The [Azure Activity log](activity-logs-overview.md) is a [platform log](platform-logs-overview.md) that provides insight into subscription-level events that have occurred in Azure. Until now, you created a log profile to send Activity log entries to [an event hub or storage account](activity-log-export.md) and used a connector to collect them into a [Log Analytics workspace](activity-log-collect.md).

You can now configure collection of the Azure Activity log using the same [diagnostic settings](diagnostic-settings.md) that are used to collect [resource logs](resource-logs-overview.md). Using diagnostic settings has the following advantages over the current methods:

- Consistent method for collecting all platform logs.
- Collect Activity log across multiple subscriptions and tenants.
- Filter collection to only collect logs for particular categories.

## Considerations
Consider the following details of Activity log collection using diagnostic settings before enabling this feature.

- You should disable existing collection of the Activity before enabling it using diagnostic settings. Having both enabled may result in duplicate data.
- The retention setting for collecting the Activity log to Azure storage has been removed meaning that data will be stored indefinitely until you remove it.
- You can send the Activity log from multiple subscriptions to a single Log Analytics workspace. You can send the Activity log from any single subscription to up to five Log Analytics workspaces.

## Configure diagnostic settings
Use the following procedure to create a diagnostic setting in the Azure portal to collect the Azure Activity log. You cannot currently create a subscription level diagnostic setting using other methods.

1. Disable existing Log Analytics workspace collection for the Activity log:
   1. Open the **Log Analytics workspaces** menu in the Azure portal and select the workspace to collect the Activity Log.
   2. In the **Workspace Data Sources** section of the workspace's menu, select **Azure Activity log**.
   3. Click the subscription you want to disconnect.
   4. Click **Disconnect** and then **Yes** when asked to confirm your choice.
2. From the **Azure Monitor** menu in the Azure portal, select **Activity log**.
3. Click **Diagnostic settings**.
   
   ![Diagnostic settings](media/diagnostic-settings-subscription/diagnostic-settings.png)
   
4. Click the purple banner for the legacy experience and disable any current collection to storage or event hubs. 

    ![Legacy experience](media/diagnostic-settings-subscription/legacy-experience.png)

5. Follow the procedures in [Create diagnostic settings in Azure portal](diagnostic-settings.md#create-diagnostic-settings-in-azure-portal) to create a diagnostic setting. See [Categories in the Activity Log](activity-logs-overview.md#categories-in-the-activity-log) for an explanation of the categories you can use to filter events from the Activity log. 


## Differences in data
Diagnostic settings collect the same data as the previous methods used to collect the Activity log with the following current differences:

The following properties have been removed:

- ActivityStatus
- ActivitySubstatus
- OperationName
- ResourceProvider 

The following properties have been added:

- Authorization_d
- Claims_d
- Properties_d

## Activity Log monitoring solution
The Azure Log Analytics monitoring solution includes multiple log queries and views for analyzing the Activity Log records in your Log Analytics workspace. This solution uses log data collected in a Log Analytics workspace and will continue to work without any changes if you collect the Activity log using diagnostic settings. See [Activity Logs Analytics monitoring solution](activity-log-collect.md#activity-logs-analytics-monitoring-solution) for details on this solution.

## Next steps

* [Learn more about the Activity Log](../../azure-resource-manager/resource-group-audit.md)
* [Learn more about diagnostic settings](diagnostic-settings.md)
