---
title: Integrate elastic logs with Azure Monitor - Microsoft Azure Data Manager for Energy
description: This is a how-to article on how to start collecting ElasticSearch logs in Azure Monitor, archiving them to a storage account, and querying them in Log Analytics workspace.
author: nitinnms
ms.author: nitindwivedi
ms.service: energy-data-services
ms.topic: how-to 
ms.date: 08/18/2022
ms.custom: template-how-to
---

# Integrate elastic logs with Azure Monitor

In this article, you'll learn how to start collecting Elasticsearch logs for your Azure Data Manager for Energy instances in Azure Monitor. This integration feature is developed to help you debug Elasticsearch related issues inside Azure Monitor. 


## Prerequisites

- You need to have a Log Analytics workspace. It will be used to query the Elasticsearch logs dataset using the Kusto Query Language (KQL) query editor in the Log Analytics workspace. [Create a log Analytics workspace in Azure portal](../azure-monitor/logs/quick-create-workspace.md).


- You need to have a storage account. It will be used to store JSON dumps of Elasticsearch & Elasticsearch Operator logs. The storage account doesn’t have to be in the same subscription as your Log Analytics workspace. 


## Enabling Diagnostic Settings to collect logs in a storage account & a Log Analytics workspace
Every Azure Data Manager for Energy instance comes inbuilt with a managed Elasticsearch service. We collect Elasticsearch logs for internal troubleshooting and debugging purposes. You can get access to these logs by integrating Elasticsearch logs with Azure Monitor. 



Each diagnostic setting has three basic parts:

| Part | Description |
|-|-|
| Name  | This is the name of the diagnostic log. Ensure a unique name is set for each log. |
| Categories | Category of logs to send to each of the destinations. The set of categories will vary for each Azure service. Visit: [Supported Resource Log Categories](../azure-monitor/essentials/resource-logs-categories.md) |
| Destinations | One or more destinations to send the logs. All Azure services share the same set of possible destinations. Each diagnostic setting can define one or more destinations but no more than one destination of a particular type. It should be a storage account, an Event Hubs namespace or an event hub. |

We support two destinations for your Elasticsearch logs from Azure Data Manager for Energy instance:

* Storage account
* Log Analytics workspace



## Steps to enable diagnostic setting to collect Elasticsearch logs

1. Open *Azure Data Manager for Energy* overview page
1. Select *Diagnostic Settings* from the left panel
  
    [![Screenshot for diagnostic settings overview page. It shows the list of existing settings as well as the option to create a new diagnostic setting.](media/how-to-integrate-elastic-logs-with-azure-monitor/diagnostic-setting-overview-page.png)](media/how-to-integrate-elastic-logs-with-azure-monitor/diagnostic-setting-overview-page.png#lightbox)

1. Select *Add diagnostic setting*.

1. Select *Elasticsearch logs* and *Elasticsearch Operator logs* under Log categories
 
1. Select *Send to a Log Analytics workspace*

1. Choose Subscription and the Log Analytics workspace name. You would have created it already as a prerequisite.

  
    [![Screenshot for choosing destination settings for Log Analytics workspace. The image shows the subscription and Log Analytics workspace chosen.](media/how-to-integrate-elastic-logs-with-azure-monitor/diagnostic-setting-log-analytics-workspace.png)](media/how-to-integrate-elastic-logs-with-azure-monitor/diagnostic-setting-log-analytics-workspace.png#lightbox)


1. Select *Archive to storage account*
1. Choose Subscription and storage account name. You would have created it already as a prerequisite.
    [![Screenshot that shows choosing destination settings for storage account. Required fields include regions, subscription and storage account.](media/how-to-integrate-elastic-logs-with-azure-monitor/diagnostic-setting-archive-storage-account.png)](media/how-to-integrate-elastic-logs-with-azure-monitor/diagnostic-setting-archive-storage-account.png#lightbox)

1. Select *Save*.

Go back to the Diagnostic Settings page. You would now see a new diagnostic setting created along with the names of the destination storage account and Log Analytics workspace you chose for this setting. 
 
[![Screenshot for diagnostic settings overview page. The page shows a sample diagnostic setting to link Elasticsearch logs with Azure Monitor.](media/how-to-integrate-elastic-logs-with-azure-monitor/diagnostic-setting-created-page.png)](media/how-to-integrate-elastic-logs-with-azure-monitor/diagnostic-setting-created-page.png#lightbox)

## View Elasticsearch logs in Log Analytics workspace or download them as JSON files using storage account

### How to view & query logs in Log Analytics workspace
The editor in Log Analytics workspace support Kusto (KQL) queries through which you can easily perform complicated queries to extract interesting logs data from the Elasticsearch service running in your Azure Data Manager for Energy instance.
 
 
* Run queries and see Elasticsearch logs in the Log Analytics workspace.

    [![Screenshot for Elasticsearch logs. The image shows the simplest KQL query that shows all logs in the last 24 hours.](media/how-to-integrate-elastic-logs-with-azure-monitor/view-elasticsearch-logs.png)](media/how-to-integrate-elastic-logs-with-azure-monitor/view-elasticsearch-logs.png#lightbox)

* Run queries and see Elasticsearch Operator logs in the Log Analytics workspace.

    [![Screenshot for elasticsearch Operator logs. The image shows the simplest KQL query that shows all logs in the last 24 hours.](media/how-to-integrate-elastic-logs-with-azure-monitor/view-elasticsearch-operator-logs.png)](media/how-to-integrate-elastic-logs-with-azure-monitor/view-elasticsearch-operator-logs.png#lightbox)


### How to download logs as JSON files from storage account

* The *Containers* menu option in the left panel of your storage account's overview page allows you to browse through the various directories that neatly store your log files. 
    

    [![Screenshot for storage account that stores elastic logs. The logs can be viewed by selecting 'containers' under the data storage menu-item.](media/how-to-integrate-elastic-logs-with-azure-monitor/storage-account-containers-page.png)](media/how-to-integrate-elastic-logs-with-azure-monitor/storage-account-containers-page.png#lightbox)
 
* Logs are organized into different folders. Drill down by month, date and time. 

    [![Screenshot for JSON file view in storage account. The image shows tracked path from year, month, data, and time to locate a log file.](media/how-to-integrate-elastic-logs-with-azure-monitor/storage-account-log-file.png)](media/how-to-integrate-elastic-logs-with-azure-monitor/storage-account-log-file.png#lightbox)
 
* Select any JSON file in your containers to view other options. 

    [![Screenshot to view the downloaded JSON file from storage account. Other options shown include getting a URL for the JSON file.](media/how-to-integrate-elastic-logs-with-azure-monitor/storage-account-download-log-file-json.png)](media/how-to-integrate-elastic-logs-with-azure-monitor/storage-account-download-log-file-json.png#lightbox)

* Select *Download* option to download the JSON file. Open it in a code editor of your choice. 
 
    [![Screenshot to view downloaded JSON file locally. The images shows formatted logs in Visual Studio Code.](media/how-to-integrate-elastic-logs-with-azure-monitor/logs-downloaded-opened-editor.png)](media/how-to-integrate-elastic-logs-with-azure-monitor/logs-downloaded-opened-editor.png#lightbox)

 
## Next steps

After collecting resource logs as explained in this article, there are more capabilities you can explore.

* Create a log query alert to be proactively notified when interesting data is identified in your log data.
    [Create a log query alert for an Azure resource](../azure-monitor/alerts/tutorial-log-alert.md)

* Start collecting logs from other sources such as Airflow in your Azure Data Manager for Energy instance. 
    [How to Integrate Airflow logs with Azure Monitor](how-to-integrate-airflow-logs-with-azure-monitor.md)

