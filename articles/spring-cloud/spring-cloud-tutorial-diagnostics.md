---
title: Analyze logs and metrics with Diagnostics settings | Microsoft Docs
description: Analyze logs and metrics with Diagnostics settings
services: spring-cloud
author: v-vasuke
manager: gwallace
editor: ''

ms.service: spring-cloud
ms.topic: conceptual
ms.date: 09/26/2019
ms.author: v-vasuke

---
# Analyze logs and metrics with Diagnostics settings

The Diagnostics functionality of Azure Spring Cloud allows you to analyze logs and metrics using one of the following services:

* Analyze them with Azure Log Analytics, where the data is written immediately to Azure Log Analytics with no need to first write the data to storage.
* Save them to a Storage Account for auditing or manual inspection. You can specify the retention time (in days).
* Stream them to Event Hubs for ingestion by a third-party service or custom analytics solution.

To get started, you'll need to enable one of these services set up to receive the data.  To learn about configuring Log Analytics, review [this tutorial](../azure-monitor/log-query/get-started-portal.md).  
	

## Configure Diagnostic settings

1. Go to your Azure Spring Cloud instance in the Azure portal.
1. Click the **Diagnostic settings** menu option.
1. Click the **Add diagnostic setting** button.
1. Enter a name for the setting and choose where you want to send the logs. You can select any combination of the following three options:
    - Archive to a storage account
    - Stream to an event hub
    - Send to Log Analytics

1. Choose which log category and metric category you want to monitor, and specify the retention time (in days). The retention time only applies to storage account.
1. Click **Save** to apply the setting.

> [!NOTE]
> There may be up to 15 minutes between when logs or metrics are emitted and when they appear in Storage Account/Event Hub/Log Analytics.

## Viewing logs

### Using Log Analytics

1. From the Azure portal, locate and select Log Analytics from the left-hand navigation menu.
2. Locate and select the Log Analytics workspace you chose when adding Diagnostics settings.
3. Click `Logs` entry to open the Log Search blade.
4. Enter a simple query into the Log search box as below:

```sql
AppPlatformLogsforSpring
| limit 50
```

5. Click `Run` button and you can see the search result.
6. You can search the logs of the specific application or instance by setting a filter condition as below and you can find more query samples from [here](spring-cloud-overview.md):

```sql
AppPlatformLogsforSpring
| where ServiceName == "YourServiceName" and AppName == "YourAppName" and InstanceName == "YourInstanceName"
| limit 50
```

Learn more about the Query Language in the Log Analytics from [here](https://docs.microsoft.com/en-us/azure/azure-monitor/log-query/query-language) 

### Using logs and metrics in Storage Account 

1. From the Azure portal, locate and select Storage accounts from the left-hand navigation menu.
2. Locate and select the Storage account you chose when adding Diagnostics settings.
3. Click `Blobs` entry to open the Blob Container blade.
4. You can find a container called `insights-logs-applicationconsole` and all logs will be stored in this container.
5. You can find a container called `insights-metrics-pt1m` and all metrics will be stored in this container.

[Learn more how to send data to storage account from here](https://docs.microsoft.com/en-us/azure/azure-monitor/platform/diagnostics-extension-to-storage)

### Using Event Hubs

1. From the Azure portal, locate and select Event Hubs from the left-hand navigation menu.
2. Locate and select the Event Hubs you chose when adding Diagnostics settings.
3. Click `Event Hubs` entry to open the Event Hub List blade.
4. You can find an event hub called `insights-logs-applicationconsole` and all logs will be streamed into this event hub.
5. You can find an event hub called `insights-metrics-pt1m` and all metrics will be streamed into this event hub.

[Learn more how to send data to event hub from here](https://docs.microsoft.com/en-us/azure/azure-monitor/platform/diagnostics-extension-stream-event-hubs).

## Analyzing logs

Azure Log Analytics allows you to use Kusto to query your logs for analysis.  Review the [Log Analytics tutorial](../azure-monitor/log-query/get-started-portal.md) for a quick introduction to querying logs using Kusto.

Application logs provide critical information about your application's health, performance, and more.  Below are some simple queries to help you understand your application's current and past states.

### Show application logs from Azure Spring Cloud

To review a list of application logs from Azure Spring Cloud, sorted by time with the lastest logs shown first:

```kusto
AppPlatformLogsforSpring 
| project TimeGenerated , ServiceName , AppName , InstanceName , Log 
| sort by TimeGenerated desc 
```
### Show logs entries containing errors or exceptions

This query allows you to review log entries that mention an error or exception.  The results are not sorted.

```Kusto
AppPlatformLogsforSpring 
| project TimeGenerated , ServiceName , AppName , InstanceName , Log 
| where Log contains "error" or Log contains "exception"
```

Use this query to find errors, or modify the query terms to find specific error codes or exceptions.  

### Show the number of errors and exceptions reported by your application over the last hour

This query creates a pie chart displaying the number of errors and exceptions logged by your application in the last hour:

```sql
AppPlatformLogsforSpring 
| where TimeGenerated > ago(1h)
| where Log contains "error" or Log contains "exception"
| summarize count_per_app = count() by AppName
| sort by count_per_app desc 
| render piechart
```

### Learn more about querying application logs

Azure Monitor provides extensive support for querying application logs using Log Analytics.  To learn more about this service, review the tutorial on [log queries](../azure-monitor/log-query/get-started-queries.md) using Azure Monitor. The [Overview of Log Queries in Azure Monitor](../azure-monitor/log-query/log-query-overview.md) provides more information about building queries to analyse your application logs.
