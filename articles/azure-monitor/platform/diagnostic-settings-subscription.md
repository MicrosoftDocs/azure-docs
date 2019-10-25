---
title: Collect Azure Activity log with diagnostic settings (preview) | Microsoft Docs
description: Use diagnostic settings to forward Azure Activity logs to Azure Monitor Logs, Azure storage, or Azure Event Hubs.
author: bwren
ms.service: azure-monitor
ms.subservice: logs
ms.topic: conceptual
ms.author: bwren
ms.date: 10/24/2019

---

# Collect Azure Activity log with diagnostic settings (preview)
The [Azure Activity log](activity-logs-overview.md) is a [platform log](platform-logs-overview.md) that provides insight into subscription-level events that have occurred in Azure. You create a log profile to send Activity log entries to [an event hub or storage account](activity-log-export.md) and use a connector to collect them into a [Log Analytics workspace](activity-log-collect.md).

You can now configure collection of the Azure Activity log using the same [diagnostic settings](diagnostic-settings.md) that are used to collect [resource logs](resource-logs-overview.md). Using diagnostic settings has the following advantages over the current methods:

- Consistent method for collecting all [platform logs](platform-logs-overview.md).
- Collect Activity log across multiple subscriptions and tenants.
- Filter collection to only collect logs for particular categories.

## Configure diagnostic settings
Use the following procedure to create a diagnostic setting in the Azure portal to collect the Azure Activity log. You cannot currently create a subscription level diagnostic setting using other methods.

- [Collect Azure Activity log with diagnostic settings (preview)](#collect-azure-activity-log-with-diagnostic-settings-preview)
  - [Configure diagnostic settings](#configure-diagnostic-settings)
  - [Disable existing collection](#disable-existing-collection)
    - [Log Analytics workspace connection](#log-analytics-workspace-connection)
    - [Log profile](#log-profile)
  - [Differences in data](#differences-in-data)
  - [Activity Log monitoring solution](#activity-log-monitoring-solution)
  - [Next steps](#next-steps)
See [Categories in the Activity Log](activity-logs-overview.md#categories-in-the-activity-log) for an explanation of the categories you can use to filter in the diagnostic setting. 

## Disable existing collection
If you have existing log profiles for the subscription or if it's connected to any Log Analytics workspaces, you should disable these settings before configuring diagnostic settings to collect Activity logs. Leaving these settings enabled may result in duplicate data being collected.

### Log Analytics workspace connection
Use the following procedure to disconnect any Log Analytics workspaces.

1. Open the **Log Analytics workspaces** menu in the Azure portal and select the workspace to collect the Activity Log.
2. In the **Workspace Data Sources** section of the workspace's menu, select **Azure Activity log**.
3. Click the subscription you want to disconnect.
4. Click **Disconnect** and then **Yes** when asked to confirm your choice.

### Log profile
Use the following procedure to disable any log profiles.

1. Open the **Azure Monitor** menu in the Azure portal and then select **Activity log**.
2. Select **Export to Event Hub**.
3. Select a subscription.
4. Note any settings for storage account and event hub that you may want to configure in a diagnostic setting.
5. Uncheck **Export to a storage account** and **Export to an event hub**.
6. Click **Save**.

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
