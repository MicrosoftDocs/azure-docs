---
title: 'Tutorial: Ingest monitoring data in Azure Data Explorer without code'
description: In this tutorial, you learn how to ingest monitoring data to Azure Data Explorer without one line of code and query that data.
author: orspod
ms.author: orspodek
ms.reviewer: kerend
ms.service: data-explorer
ms.topic: tutorial
ms.date: 01/29/2020

# Customer intent: I want to ingest monitoring data to Azure Data Explorer without one line of code, so that I can explore and analyze my data by using queries.
---

# Tutorial: Ingest and query monitoring data in Azure Data Explorer 

This tutorial will teach you how to ingest data from diagnostic and activity logs to an Azure Data Explorer cluster without writing code. With this simple ingestion method, you can quickly begin querying Azure Data Explorer for data analysis.

In this tutorial, you'll learn how to:

> [!div class="checklist"]
> * Create tables and ingestion mapping in an Azure Data Explorer database.
> * Format the ingested data by using an update policy.
> * Create an [event hub](/azure/event-hubs/event-hubs-about)  and connect it to Azure Data Explorer.
> * Stream data to an event hub from Azure Monitor [diagnostic metrics and logs](/azure/azure-monitor/platform/diagnostic-settings) and [activity logs](/azure/azure-monitor/platform/activity-logs-overview).
> * Query the ingested data by using Azure Data Explorer.

> [!NOTE]
> Create all resources in the same Azure location or region. 

## Prerequisites

* If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.
* [An Azure Data Explorer cluster and database](create-cluster-database-portal.md). In this tutorial, the database name is *TestDatabase*.

## Azure Monitor data provider: diagnostic metrics and logs and activity logs

View and understand the data provided by the Azure Monitor diagnostic metrics and logs and activity logs below. You'll create an ingestion pipeline based on these data schemas. Note that each event in a log has an array of records. This array of records will be split later in the tutorial.

### Examples of diagnostic metrics and logs and activity logs

Azure diagnostic metrics and logs and activity logs are emitted by an Azure service and provide data about the operation of that service. 

# [Diagnostic metrics](#tab/diagnostic-metrics)
#### Example

Diagnostic metrics are aggregated with a time grain of 1 minute. Following is an example of an Azure Data Explorer metric-event schema on query duration:

```json
{
	"records": [
	{
    	"count": 14,
    	"total": 0,
    	"minimum": 0,
    	"maximum": 0,
    	"average": 0,
    	"resourceId": "/SUBSCRIPTIONS/<subscriptionID>/RESOURCEGROUPS/<resource-group>/PROVIDERS/MICROSOFT.KUSTO/CLUSTERS/<cluster-name>",
    	"time": "2018-12-20T17:00:00.0000000Z",
    	"metricName": "QueryDuration",
    	"timeGrain": "PT1M"
    },
    {
    	"count": 12,
    	"total": 0,
    	"minimum": 0,
    	"maximum": 0,
    	"average": 0,
    	"resourceId": "/SUBSCRIPTIONS/<subscriptionID>/RESOURCEGROUPS/<resource-group>/PROVIDERS/MICROSOFT.KUSTO/CLUSTERS/<cluster-name>",
    	"time": "2018-12-21T17:00:00.0000000Z",
    	"metricName": "QueryDuration",
    	"timeGrain": "PT1M"
    }
    ]
}
```

# [Diagnostic logs](#tab/diagnostic-logs)
#### Example

Following is an example of an Azure Data Explorer [diagnostic ingestion log](using-diagnostic-logs.md#diagnostic-logs-schema):

```json
{
	"time": "2019-08-26T13:22:36.8804326Z",
	"resourceId": "/SUBSCRIPTIONS/<subscriptionID>/RESOURCEGROUPS/<resource-group>/PROVIDERS/MICROSOFT.KUSTO/CLUSTERS/<cluster-name>",
	"operationName": "MICROSOFT.KUSTO/CLUSTERS/INGEST/ACTION",
	"operationVersion": "1.0",
	"category": "FailedIngestion",
	"resultType": "Failed",
	"correlationId": "d59882f1-ad64-4fc4-b2ef-d663b6cc1cc5",
	"properties": {
		"OperationId": "00000000-0000-0000-0000-000000000000",
		"Database": "Kusto",
		"Table": "Table_13_20_prod",
		"FailedOn": "2019-08-26T13:22:36.8804326Z",
		"IngestionSourceId": "d59882f1-ad64-4fc4-b2ef-d663b6cc1cc5",
		"Details":
		{
			"error": 
			{
				"code": "BadRequest_DatabaseNotExist",
				"message": "Request is invalid and cannot be executed.",
				"@type": "Kusto.Data.Exceptions.DatabaseNotFoundException",
				"@message": "Database 'Kusto' was not found.",
				"@context": 
				{
					"timestamp": "2019-08-26T13:22:36.7179157Z",
					"serviceAlias": "<cluster-name>",
					"machineName": "KEngine000001",
					"processName": "Kusto.WinSvc.Svc",
					"processId": 5336,
					"threadId": 6528,
					"appDomainName": "Kusto.WinSvc.Svc.exe",
					"clientRequestd": "DM.IngestionExecutor;a70ddfdc-b471-4fc7-beac-bb0f6e569fe8",
					"activityId": "f13e7718-1153-4e65-bf82-8583d712976f",
					"subActivityId": "2cdad9d0-737b-4c69-ac9a-22cf9af0c41b",
					"activityType": "DN.AdminCommand.DataIngestPullCommand",
					"parentActivityId": "2f65e533-a364-44dd-8d45-d97460fb5795",
					"activityStack": "(Activity stack: CRID=DM.IngestionExecutor;a70ddfdc-b471-4fc7-beac-bb0f6e569fe8 ARID=f13e7718-1153-4e65-bf82-8583d712976f > DN.Admin.Client.ExecuteControlCommand/5b764b32-6017-44a2-89e7-860eda515d40 > P.WCF.Service.ExecuteControlCommandInternal..IAdminClientServiceCommunicationContract/c2ef9344-069d-44c4-88b1-a3570697ec77 > DN.FE.ExecuteControlCommand/2f65e533-a364-44dd-8d45-d97460fb5795 > DN.AdminCommand.DataIngestPullCommand/2cdad9d0-737b-4c69-ac9a-22cf9af0c41b)"
				},
				"@permanent": true
			}
		},
		"ErrorCode": "BadRequest_DatabaseNotExist",
		"FailureStatus": "Permanent",
		"RootActivityId": "00000000-0000-0000-0000-000000000000",
		"OriginatesFromUpdatePolicy": false,
		"ShouldRetry": false,
		"IngestionSourcePath": "https://c0skstrldkereneus01.blob.core.windows.net/aam-20190826-temp-e5c334ee145d4b43a3a2d3a96fbac1df/3216_test_3_columns_invalid_8f57f0d161ed4a8c903c6d1073005732_59951f9ca5d143b6bdefe52fa381a8ca.zip"
	}
}
```
# [Activity logs](#tab/activity-logs)
#### Example

Azure activity logs are subscription-level logs that provide insight into the operations performed on resources in your subscription. Following is an example of an activity-log event for checking access:

```json
{
	"records": [
	{
        "time": "2018-12-26T16:23:06.1090193Z",
        "resourceId": "/SUBSCRIPTIONS/<subscriptionID>/RESOURCEGROUPS/<resource-group>/PROVIDERS/MICROSOFT.WEB/SITES/CLNB5F73B70-DCA2-47C2-BB24-77B1A2CAAB4D/PROVIDERS/MICROSOFT.AUTHORIZATION",
		"operationName": "MICROSOFT.AUTHORIZATION/CHECKACCESS/ACTION",
		"category": "Action",
		"resultType": "Start",
		"resultSignature": "Started.",
		"durationMs": 0,
		"callerIpAddress": "13.66.225.188",
		"correlationId": "0de9f4bc-4adc-4209-a774-1b4f4ae573ed",
		"identity": {
			"authorization": {
                ...
            },
            "claims": {
                ...
            }
		},
		"level": "Information",
		"location": "global",
		"properties": {
			...
		}
	},
	{
		"time": "2018-12-26T16:23:06.3040244Z",
		"resourceId": "/SUBSCRIPTIONS/<subscriptionID>/RESOURCEGROUPS/<resource-group>/PROVIDERS/MICROSOFT.WEB/SITES/CLNB5F73B70-DCA2-47C2-BB24-77B1A2CAAB4D/PROVIDERS/MICROSOFT.AUTHORIZATION",
		"operationName": "MICROSOFT.AUTHORIZATION/CHECKACCESS/ACTION",
		"category": "Action",
		"resultType": "Success",
		"resultSignature": "Succeeded.OK",
		"durationMs": 194,
		"callerIpAddress": "13.66.225.188",
		"correlationId": "0de9f4bc-4adc-4209-a774-1b4f4ae573ed",
		"identity": {
			"authorization": {
                ...
            },
            "claims": {
                ...
            }
		},
		"level": "Information",
		"location": "global",
		"properties": {
			"statusCode": "OK",
			"serviceRequestId": "87acdebc-945f-4c0c-b931-03050e085626"
		}
	}]
}
```
---

## Set up an ingestion pipeline in Azure Data Explorer

Setting up an Azure Data Explorer pipeline involves several steps, such as [table creation and data ingestion](/azure/data-explorer/ingest-sample-data#ingest-data). You can also manipulate, map, and update the data.

### Connect to the Azure Data Explorer Web UI

In your Azure Data Explorer *TestDatabase* database, select **Query** to open the Azure Data Explorer Web UI.

![Query page](media/ingest-data-no-code/query-database.png)

### Create the target tables

The structure of the Azure Monitor logs isn't tabular. You'll manipulate the data and expand each event to one or more records. The raw data will be ingested to an intermediate table named *ActivityLogsRawRecords* for activity logs and *DiagnosticRawRecords* for diagnostic metrics and logs. At that time, the data will be manipulated and expanded. Using an update policy, the expanded data will then be ingested into the *ActivityLogs* table for activity logs, *DiagnosticMetrics* for diagnostic metrics and *DiagnosticLogs* for diagnostic logs. This means that you'll need to create two separate tables for ingesting activity logs and three separate tables for ingesting diagnostic metrics and logs.

Use the Azure Data Explorer Web UI to create the target tables in the Azure Data Explorer database.

# [Diagnostic metrics](#tab/diagnostic-metrics)
#### Create tables for the diagnostic metrics

1. In the *TestDatabase* database, create a table named *DiagnosticMetrics* to store the diagnostic metrics records. Use the following `.create table` control command:

    ```kusto
    .create table DiagnosticMetrics (Timestamp:datetime, ResourceId:string, MetricName:string, Count:int, Total:double, Minimum:double, Maximum:double, Average:double, TimeGrain:string)
    ```

1. Select **Run** to create the table.

    ![Run query](media/ingest-data-no-code/run-query.png)

1. Create the intermediate data table named *DiagnosticRawRecords* in the *TestDatabase* database for data manipulation using the following query. Select **Run** to create the table.

    ```kusto
    .create table DiagnosticRawRecords (Records:dynamic)
    ```

1. Set zero [retention policy](/azure/kusto/management/retention-policy) for the intermediate table:

    ```kusto
    .alter-merge table DiagnosticRawRecords policy retention softdelete = 0d
    ```

# [Diagnostic logs](#tab/diagnostic-logs)
#### Create tables for the diagnostic logs 

1. In the *TestDatabase* database, create a table named *DiagnosticLogs* to store the diagnostic log records. Use the following `.create table` control command:

    ```kusto
    .create table DiagnosticLogs (Timestamp:datetime, ResourceId:string, OperationName:string, Result:string, OperationId:string, Database:string, Table:string, IngestionSourceId:string, IngestionSourcePath:string, RootActivityId:string, ErrorCode:string, FailureStatus:string, Details:string)
    ```

1. Select **Run** to create the table.

1. Create the intermediate data table named *DiagnosticRawRecords* in the *TestDatabase* database for data manipulation using the following query. Select **Run** to create the table.

    ```kusto
    .create table DiagnosticRawRecords (Records:dynamic)
    ```

1. Set zero [retention policy](/azure/kusto/management/retention-policy) for the intermediate table:

    ```kusto
    .alter-merge table DiagnosticRawRecords policy retention softdelete = 0d
    ```

# [Activity logs](#tab/activity-logs)
#### Create tables for the activity logs 

1. Create a table named *ActivityLogs* in the *TestDatabase* database to receive activity log records. To create the table, run the following Azure Data Explorer query:

    ```kusto
    .create table ActivityLogs (Timestamp:datetime, ResourceId:string, OperationName:string, Category:string, ResultType:string, ResultSignature:string, DurationMs:int, IdentityAuthorization:dynamic, IdentityClaims:dynamic, Location:string, Level:string)
    ```

1. Create the intermediate data table named *ActivityLogsRawRecords* in the *TestDatabase* database for data manipulation:

    ```kusto
    .create table ActivityLogsRawRecords (Records:dynamic)
    ```

1. Set zero [retention policy](/azure/kusto/management/retention-policy) for the intermediate table:

    ```kusto
    .alter-merge table ActivityLogsRawRecords policy retention softdelete = 0d
    ```
---

### Create table mappings

 Because the data format is `json`, data mapping is required. The `json` mapping maps each json path to a table column name.

# [Diagnostic metrics / Diagnostic logs](#tab/diagnostic-metrics+diagnostic-logs) 
#### Map diagnostic metrics and logs to the table

To map the diagnostic metric and log data to the table, use the following query:

```kusto
.create table DiagnosticRawRecords ingestion json mapping 'DiagnosticRawRecordsMapping' '[{"column":"Records","path":"$.records"}]'
```

# [Activity logs](#tab/activity-logs)
#### Map activity logs to the table

To map the activity log data to the table, use the following query:

```kusto
.create table ActivityLogsRawRecords ingestion json mapping 'ActivityLogsRawRecordsMapping' '[{"column":"Records","path":"$.records"}]'
```
---

### Create the update policy for metric and log data

# [Diagnostic metrics](#tab/diagnostic-metrics)
#### Create data update policy for diagnostics metrics

1. Create a [function](/azure/kusto/management/functions) that expands the collection of diagnostic metric records so that each value in the collection receives a separate row. Use the [`mv-expand`](/azure/kusto/query/mvexpandoperator) operator:
     ```kusto
    .create function DiagnosticMetricsExpand() {
        DiagnosticRawRecords
        | mv-expand events = Records
        | where isnotempty(events.metricName)
        | project
            Timestamp = todatetime(events['time']),
            ResourceId = tostring(events.resourceId),
            MetricName = tostring(events.metricName),
            Count = toint(events['count']),
            Total = todouble(events.total),
            Minimum = todouble(events.minimum),
            Maximum = todouble(events.maximum),
            Average = todouble(events.average),
            TimeGrain = tostring(events.timeGrain)
    }
    ```

2. Add the [update policy](/azure/kusto/concepts/updatepolicy) to the target table. This policy will automatically run the query on any newly ingested data in the *DiagnosticRawRecords* intermediate data table and ingest its results into the *DiagnosticMetrics* table:

    ```kusto
    .alter table DiagnosticMetrics policy update @'[{"Source": "DiagnosticRawRecords", "Query": "DiagnosticMetricsExpand()", "IsEnabled": "True", "IsTransactional": true}]'
    ```

# [Diagnostic logs](#tab/diagnostic-logs)
#### Create data update policy for diagnostics logs

1. Create a [function](/azure/kusto/management/functions) that expands the collection of diagnostic logs records so that each value in the collection receives a separate row. You'll enable ingestion logs on an Azure Data Explorer cluster, and use [ingestion logs schema](/azure/data-explorer/using-diagnostic-logs#diagnostic-logs-schema). You'll create one table for succeeded and for failed ingestion, while some of the fields will be empty for succeeded ingestion (ErrorCode for example). Use the [`mv-expand`](/azure/kusto/query/mvexpandoperator) operator:

    ```kusto
    .create function DiagnosticLogsExpand() {
        DiagnosticRawRecords
        | mv-expand events = Records
        | where isnotempty(events.operationName)
        | project
            Timestamp = todatetime(events['time']),
            ResourceId = tostring(events.resourceId),
            OperationName = tostring(events.operationName),
            Result = tostring(events.resultType),
            OperationId = tostring(events.properties.OperationId),
            Database = tostring(events.properties.Database),
            Table = tostring(events.properties.Table),
            IngestionSourceId = tostring(events.properties.IngestionSourceId),
            IngestionSourcePath = tostring(events.properties.IngestionSourcePath),
            RootActivityId = tostring(events.properties.RootActivityId),
            ErrorCode = tostring(events.properties.ErrorCode),
            FailureStatus = tostring(events.properties.FailureStatus),
            Details = tostring(events.properties.Details)
    }
    ```

2. Add the [update policy](/azure/kusto/concepts/updatepolicy) to the target table. This policy will automatically run the query on any newly ingested data in the *DiagnosticRawRecords* intermediate data table and ingest its results into the *DiagnosticLogs* table:

    ```kusto
    .alter table DiagnosticLogs policy update @'[{"Source": "DiagnosticRawRecords", "Query": "DiagnosticLogsExpand()", "IsEnabled": "True", "IsTransactional": true}]'
    ```

# [Activity logs](#tab/activity-logs)
#### Create data update policy for activity logs

1. Create a [function](/azure/kusto/management/functions) that expands the collection of activity log records so that each value in the collection receives a separate row. Use the [`mv-expand`](/azure/kusto/query/mvexpandoperator) operator:

    ```kusto
    .create function ActivityLogRecordsExpand() {
        ActivityLogsRawRecords
        | mv-expand events = Records
        | project
            Timestamp = todatetime(events['time']),
            ResourceId = tostring(events.resourceId),
            OperationName = tostring(events.operationName),
            Category = tostring(events.category),
            ResultType = tostring(events.resultType),
            ResultSignature = tostring(events.resultSignature),
            DurationMs = toint(events.durationMs),
            IdentityAuthorization = events.identity.authorization,
            IdentityClaims = events.identity.claims,
            Location = tostring(events.location),
            Level = tostring(events.level)
    }
    ```

2. Add the [update policy](/azure/kusto/concepts/updatepolicy) to the target table. This policy will automatically run the query on any newly ingested data in the *ActivityLogsRawRecords* intermediate data table and ingest its results into the *ActivityLogs* table:

    ```kusto
    .alter table ActivityLogs policy update @'[{"Source": "ActivityLogsRawRecords", "Query": "ActivityLogRecordsExpand()", "IsEnabled": "True", "IsTransactional": true}]'
    ```
---

## Create an Azure Event Hubs namespace

Azure diagnostic settings enable exporting metrics and logs to a storage account or to an event hub. In this tutorial, we'll route the metrics and logs via an event hub. You'll create an Event Hubs namespace and an event hub for the diagnostic metrics and logs in the following steps. Azure Monitor will create the event hub *insights-operational-logs* for the activity logs.

1. Create an event hub by using an Azure Resource Manager template in the Azure portal. To follow the rest of the steps in this article, right-click the **Deploy to Azure** button, and then select **Open in new window**. The **Deploy to Azure** button takes you to the Azure portal.

    [![Deploy to Azure button](media/ingest-data-no-code/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F201-event-hubs-create-event-hub-and-consumer-group%2Fazuredeploy.json)

1. Create an Event Hubs namespace and an event hub for the diagnostic logs.

    ![Event hub creation](media/ingest-data-no-code/event-hub.png)

1. Fill out the form with the following information. For any settings not listed in the following table, use the default values.

    **Setting** | **Suggested value** | **Description**
    |---|---|---|
    | **Subscription** | *Your subscription* | Select the Azure subscription that you want to use for your event hub.|
    | **Resource group** | *test-resource-group* | Create a new resource group. |
    | **Location** | Select the region that best meets your needs. | Create the Event Hubs namespace in the same location as other resources.
    | **Namespace name** | *AzureMonitoringData* | Choose a unique name that identifies your namespace.
    | **Event hub name** | *DiagnosticData* | The event hub sits under the namespace, which provides a unique scoping container. |
    | **Consumer group name** | *adxpipeline* | Create a consumer group name. Consumer groups enable multiple consuming applications to each have a separate view of the event stream. |
    | | |

## Connect Azure Monitor metrics and logs to your event hub

Now you need to connect your diagnostic metrics and logs and your activity logs to the event hub.

# [Diagnostic metrics / Diagnostic logs](#tab/diagnostic-metrics+diagnostic-logs) 
### Connect diagnostic metrics and logs to your event hub

Select a resource from which to export metrics. Several resource types support exporting diagnostic data, including Event Hubs namespace, Azure Key Vault, Azure IoT Hub, and Azure Data Explorer clusters. In this tutorial, we'll use an Azure Data Explorer cluster as our resource, we'll review query performance metrics and ingestion results logs.

1. Select your Kusto cluster in the Azure portal.
1. Select **Diagnostic settings**, and then select the **Turn on diagnostics** link. 

    ![Diagnostic settings](media/ingest-data-no-code/diagnostic-settings.png)

1. The **Diagnostics settings** pane opens. Take the following steps:
   1. Give your diagnostics log data the name *ADXExportedData*.
   1. Under **LOG**, select both **SucceededIngestion** and **FailedIngestion** check boxes.
   1. Under **METRIC**, select the **Query performance** check box.
   1. Select the **Stream to an event hub** check box.
   1. Select **Configure**.

      ![Diagnostics settings pane](media/ingest-data-no-code/diagnostic-settings-window.png)

1. In the **Select event hub** pane, configure how to export data from diagnostic logs to the event hub you created:
    1. In the **Select event hub namespace** list, select *AzureMonitoringData*.
    1. In the **Select event hub name** list, select *DiagnosticData*.
    1. In the **Select event hub policy name** list, select **RootManagerSharedAccessKey**.
    1. Select **OK**.

1. Select **Save**.

# [Activity logs](#tab/activity-logs)
### Connect activity logs to your event hub

1. In the left menu of the Azure portal, select **Activity log**.
1. The **Activity log** window opens. Select **Export to Event Hub**.

    ![Activity log window](media/ingest-data-no-code/activity-log.png)

1. The **Export activity log** window opens:
 
    ![Export activity log window](media/ingest-data-no-code/export-activity-log.png)

1. In the **Export activity log** window, take the following steps:
      1. Select your subscription.
      1. In the **Regions** list, choose **Select all**.
      1. Select the **Export to an event hub** check box.
      1. Choose **Select a service bus namespace** to open the **Select event hub** pane.
      1. In the **Select event hub** pane, select your subscription.
      1. In the **Select event hub namespace** list, select *AzureMonitoringData*.
      1. In the **Select event hub policy name** list, select the default event hub policy name.
      1. Select **OK**.
      1. In the upper-left corner of the window, select **Save**.
   An event hub with the name *insights-operational-logs* will be created.
---

### See data flowing to your event hubs

1. Wait a few minutes until the connection is defined, and the activity-log export to the event hub is finished. Go to your Event Hubs namespace to see the event hubs you created.

    ![Event hubs created](media/ingest-data-no-code/event-hubs-created.png)

1. See data flowing to your event hub:

    ![Event hub's data](media/ingest-data-no-code/event-hubs-data.png)

## Connect an event hub to Azure Data Explorer

Now you need to create the data connections for your diagnostic metrics and logs and activity logs.

### Create the data connection for diagnostic metrics and logs and activity logs

1. In your Azure Data Explorer cluster named *kustodocs*, select **Databases** in the left menu.
1. In the **Databases** window, select your *TestDatabase* database.
1. In the left menu, select **Data ingestion**.
1. In the **Data ingestion** window, click **+ Add Data Connection**.
1. In the **Data connection** window, enter the following information:

    ![Event hub data connection](media/ingest-data-no-code/event-hub-data-connection.png)

# [Diagnostic metrics / Diagnostic logs](#tab/diagnostic-metrics+diagnostic-logs) 

1. Use the following settings in the **Data Connection** window:

    Data source:

    **Setting** | **Suggested value** | **Field description**
    |---|---|---|
    | **Data connection name** | *DiagnosticsLogsConnection* | The name of the connection you want to create in Azure Data Explorer.|
    | **Event hub namespace** | *AzureMonitoringData* | The name you chose earlier that identifies your namespace. |
    | **Event hub** | *DiagnosticData* | The event hub you created. |
    | **Consumer group** | *adxpipeline* | The consumer group defined in the event hub you created. |
    | | |

    Target table:

    There are two options for routing: *static* and *dynamic*. For this tutorial, you'll use static routing (the default), where you specify the table name, the data format, and the mapping. Leave **My data includes routing info** unselected.

     **Setting** | **Suggested value** | **Field description**
    |---|---|---|
    | **Table** | *DiagnosticRawRecords* | The table you created in the *TestDatabase* database. |
    | **Data format** | *JSON* | The format used in the table. |
    | **Column mapping** | *DiagnosticRawRecordsMapping* | The mapping you created in the *TestDatabase* database, which maps incoming JSON data to the column names and data types of the *DiagnosticRawRecords* table.|
    | | |

1. Select **Create**.  

# [Activity logs](#tab/activity-logs)

1. Use the following settings in the **Data Connection** window:

    Data source:

    **Setting** | **Suggested value** | **Field description**
    |---|---|---|
    | **Data connection name** | *ActivityLogsConnection* | The name of the connection you want to create in Azure Data Explorer.|
    | **Event hub namespace** | *AzureMonitoringData* | The name you chose earlier that identifies your namespace. |
    | **Event hub** | *insights-operational-logs* | The event hub you created. |
    | **Consumer group** | *$Default* | The default consumer group. If needed, you can create a different consumer group. |
    | | |

    Target table:

    There are two options for routing: *static* and *dynamic*. For this tutorial, you'll use static routing (the default), where you specify the table name, data format, and mapping. Leave **My data includes routing info** unselected.

     **Setting** | **Suggested value** | **Field description**
    |---|---|---|
    | **Table** | *ActivityLogsRawRecords* | The table you created in the *TestDatabase* database. |
    | **Data format** | *JSON* | The format used in the table. |
    | **Column mapping** | *ActivityLogsRawRecordsMapping* | The mapping you created in the *TestDatabase* database, which maps incoming JSON data to the column names and data types of the *ActivityLogsRawRecords* table.|
    | | |

1. Select **Create**.  
---

## Query the new tables

You now have a pipeline with data flowing. Ingestion via the cluster takes 5 minutes by default, so allow the data to flow for a few minutes before beginning to query.

# [Diagnostic metrics](#tab/diagnostic-metrics)
### Query the diagnostic metrics table

The following query analyzes query duration data from diagnostic metric records in Azure Data Explorer:

```kusto
DiagnosticMetrics
| where Timestamp > ago(15m) and MetricName == 'QueryDuration'
| summarize avg(Average)
```

Query results:

|   |   |
| --- | --- |
|   |  avg_Average |
|   | 00:06.156 |
| | |

# [Diagnostic logs](#tab/diagnostic-logs)
### Query the diagnostic logs table

This pipeline produces ingestions via an event hub. You'll review the results of these ingestions.
The following query analyzes how many ingestions accrued in a minute, including a sample of `Database`, `Table` and `IngestionSourcePath` for each interval:

```kusto
DiagnosticLogs
| where Timestamp > ago(15m) and OperationName has 'INGEST'
| summarize count(), any(Database, Table, IngestionSourcePath) by bin(Timestamp, 1m)
```

Query results:

|   |   |
| --- | --- |
|   |  count_ | any_Database | any_Table | any_IngestionSourcePath
|   | 00:06.156 | TestDatabase | DiagnosticRawRecords | https://rtmkstrldkereneus00.blob.core.windows.net/20190827-readyforaggregation/1133_TestDatabase_DiagnosticRawRecords_6cf02098c0c74410bd8017c2d458b45d.json.zip
| | |

# [Activity logs](#tab/activity-logs)
### Query the activity logs table

The following query analyzes data from activity log records in Azure Data Explorer:

```kusto
ActivityLogs
| where OperationName == 'MICROSOFT.EVENTHUB/NAMESPACES/AUTHORIZATIONRULES/LISTKEYS/ACTION'
| where ResultType == 'Success'
| summarize avg(DurationMs)
```

Query results:

|   |   |
| --- | --- |
|   |  avg(DurationMs) |
|   | 768.333 |
| | |

---

## Next steps

* Learn to write many more queries on the data you extracted from Azure Data Explorer by using [Write queries for Azure Data Explorer](write-queries.md).
* [Monitor Azure Data Explorer ingestion operations using diagnostic logs](using-diagnostic-logs.md)
* [Use metrics to monitor cluster health](using-metrics.md)
