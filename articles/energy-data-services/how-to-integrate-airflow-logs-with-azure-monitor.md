---
title: Integrate airflow logs with Azure Monitor - Microsoft Energy Data Services Preview
description: This is a how-to article on how to start collecting Airflow Task logs in Azure Monitor, archiving them to a storage account, and querying them in Log Analytics Workspace.
author: nitinnms
ms.author: nitindwivedi
ms.service: energy-data-services
ms.topic: how-to 
ms.date: 08/18/2022
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# Integrate airflow logs with Azure Monitor

This article describes how you can start collecting Airflow Logs for your Microsoft Energy Data Services instances into Azure Monitor. This integration feature helps you debug Airflow DAG run failures. 


## Prerequisites

* An existing **log analytics workspace**. 
    This workspace will be used to query the Airflow Logs using the Kusto Query Language (KQL) query editor in the Log Analytics Workspace. Useful Resource: [Create a log analytics workspace in Azure portal](/articles/azure-monitor/logs/quick-create-workspace.md).


* An existing **storage account**. 
    This storage account will be used to store JSON dumps of Airflow Logs. The Storage Account doesn’t have to be in the same subscription as your Log Analytics workspace. 


## Enabling Diagnostic Settings to collect logs in a Storage Account
Every Microsoft Energy Data instance comes inbuilt with an Azure Data Factory-managed Airflow instance. We collect Airflow logs for internal troubleshooting and debugging purposes. Airflow logs can be integrated with Azure Monitor in the following ways:

* Storage Account
* Log Analytics Workspace

To access logs via any of the above two options, you need to create a Diagnostic Setting. Each Diagnostic Setting has three basic parts:

| Title | Description |
|-|-|
| Name  | This is the name of the diagnostic log. Ensure a unique name is set for each log. |
| Categories | Category of logs to send to each of the destinations. The set of categories will vary for each Azure service. Visit: [Supported Resource Log Categories](/articles/azure-monitor/essentials/resource-logs-categories.md) |
| Destinations | One or more destinations to send the logs. All Azure services share the same set of possible destinations. Each diagnostic setting can define one or more destinations but no more than one destination of a particular type. It should be a storage account, an event hub namespace or an event hub. |

Follow the following steps to set up Diagnostic Settings:

1. Open Azure Energy Data Services' "**Overview**" page
1. Select "**Diagnostic Settings**" from the left panel

    [![Screenshot for Azure monitor diagnostic setting overview page. The page shows a list of existing diagnostic settings and the option to add a new one.](media/how-to-integrate-airflow-logs-with-azure-monitor/azure-monitor-diagnostic-settings-overview-page.png)](media/how-to-integrate-airflow-logs-with-azure-monitor/azure-monitor-diagnostic-settings-overview-page.png#lightbox)


1. Select "**Add Diagnostic Setting**"

1. Select "**Airflow Task Logs**" under Logs

1. Select "**Archive to Storage Account**"

    [![Screenshot for creating a diagnostic setting to archive logs to a storage account. The image shows the subscription and the storage account chosen for a diagnostic setting.](media/how-to-integrate-airflow-logs-with-azure-monitor/creating-diagnostic-setting-destination-storage-account.png)](media/how-to-integrate-airflow-logs-with-azure-monitor/creating-diagnostic-setting-destination-storage-account.png#lightbox)

6. Verify the subscription and storage account to which you want to archive the logs


## Navigating Storage Account to download Airflow Logs

After a diagnostic setting is created for archiving Airflow Task logs into a storage account, you can navigate to the storage account overview page. You can then use the "Storage Browser" on the left panel to find the right JSON file that you want to investigate. Browsing through different directories is intuitive as you move from a year to a month to a day. 

1. Navigate through storage browser, available on the left panel. 

    [![Screenshot for exploring archived logs in the containers of the storage account. The container will show logs from all the sources you have created a diagnostic setting for.](media/how-to-integrate-airflow-logs-with-azure-monitor/storage-account-containers-page-showing-collected-logs-explorer.png)](media/how-to-integrate-airflow-logs-with-azure-monitor/storage-account-containers-page-showing-collected-logs-explorer.png#lightbox)

2. Open the information pane on the right. It contains a "download" button to save the log file locally. 


1. Downloaded logs can be analyzed in any editor.



## Enabling Diagnostic Settings to integrate logs to Log Analytics Workspace

You can integrate Airflow logs with Log Analytics Workspace by using **Diagnostic Settings** under the left panel of your Azure Energy Data Services Instance overview page - just like you did for archiving Airflow logs to a storage account. 

[![Screenshot for creating a diagnostic setting to integrate with log analytics workspace. It shows the options to select subscription and log analytics workspace.](media/how-to-integrate-airflow-logs-with-azure-monitor/creating-diagnostic-setting-choosing-destination-retention.png)](media/how-to-integrate-airflow-logs-with-azure-monitor/creating-diagnostic-setting-choosing-destination-retention.png#lightbox)

## Working with the integrated Airflow Logs in Log Analytics Workspace

Data is retrieved from a Log Analytics Workspace using a log query written in Kusto Query Language (KQL). A set of precreated queries is available for many Azure services (not available for Airflow at the moment) so that you don't require knowledge of KQL to get started. Visit: [Sample Kusto Queries](/articles/data-explorer/kusto/query/samples?pivots=azuredataexplorer.md)

Browse through the available queries. Identify one to run and select Run. The query is added to the query window and the results returned.

[![Screenshot for Azure Monitor Log Analytics page for viewing collected logs. Under log management, tables from all sources will be visible.](media/how-to-integrate-airflow-logs-with-azure-monitor/azure-monitor-log-analytics-page-viewing-collected-logs.png)](media/how-to-integrate-airflow-logs-with-azure-monitor/azure-monitor-log-analytics-page-viewing-collected-logs.png#lightbox)

1. Select Logs from your resource's menu. Log Analytics opens with the Queries window that includes prebuilt queries for your Resource type.


2. Browse through the available queries. Identify one to run and select Run. The query is added to the query window and the results returned.




## Next steps
Now that you're collecting resource logs, create a log query alert to be proactively notified when interesting data is identified in your log data.

- [Create a log query alert for an Azure resource](/articles/azure-monitor/alerts/tutorial-log-alert.md)
