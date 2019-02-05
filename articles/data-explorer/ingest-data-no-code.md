---
title: 'Tutorial: Ingest diagnostic and activity log data in Azure Data Explorer without one line of code'
description: 'In this tutorial, you learn how to ingest data to Azure Data Explorer without one line of code and query that data.'
services: data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: v-orspod
ms.service: data-explorer
ms.topic: tutorial
ms.date: 2/5/2019

#Customer intent: I want to ingest data to Azure Data Explorer without one line of code, so that I can explore and analyze my data using queries.
---

# Tutorial: Ingest data in Azure Data Explorer without one line of code

This tutorial will teach you how to ingest diagnostic and activity log data to an Azure Data Explorer cluster without one line of code, enabling you to query Azure Data Explorer for data analysis.

In this tutorial you will:
* Collect data from [Azure Monitor diagnostic logs](/azure/azure-monitor/platform/diagnostic-logs-overview) and [Azure Monitor activity logs](/azure/azure-monitor/platform/activity-logs-overview).
* Stream data to an [Event Hub](/azure/event-hubs/event-hubs-about).
* Connect the Event Hub to Azure Data Explorer.
* In an Azure Data Explorer database, create tables and an ingestion mapping. Format the ingested data using an update policy.
* Query the ingested data using Azure Data Explorer.

## Prerequisites

* If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.
* [An Azure Data Explorer cluster and database](create-cluster-database-portal.md). In this tutorial, the database name is 'AzureMonitoring'.

## Azure Monitoring data provider - diagnostic and activity logs

View and understand the data provided by the Azure Monitoring diagnostic and activity logs. We will create an ingestion pipeline based on these data schemas.

### Diagnostic logs example

Azure diagnostic logs are metrics emitted by an Azure service that provide data about the operation of that service. Data is aggregated with time grain of 1 minute. Each diagnostic logs event contains one record. This is an example of an Azure Data Explorer metric event schema, on query duration:

```json
{
	"count": 14,
	"total": 0,
	"minimum": 0,
	"maximum": 0,
	"average": 0,
	"resourceId": "/SUBSCRIPTIONS/F3101802-8C4F-4E6E-819C-A3B5794D33DD/RESOURCEGROUPS/KEDAMARI/PROVIDERS/MICROSOFT.KUSTO/CLUSTERS/KEREN",
	"time": "2018-12-20T17:00:00.0000000Z",
	"metricName": "QueryDuration",
	"timeGrain": "PT1M"
}
```

### Activity logs example

Azure activity logs are subscription level logs containing a collection of records. The logs provide insight into the operations performed on resources in your subscription. Unlike diagnostic logs, an activity logs event has an array of records. We will need to split this array of records later in the tutorial. This is an example of an activity log event for checking access:

```json
{
	"records": [
	{
		"time": "2018-12-26T16:23:06.1090193Z",
		"resourceId": "/SUBSCRIPTIONS/F80EB51C-C534-4F0B-80AB-AEBC290C1C19/RESOURCEGROUPS/CLEANUPSERVICE/PROVIDERS/MICROSOFT.WEB/SITES/CLNB5F73B70-DCA2-47C2-BB24-77B1A2CAAB4D/PROVIDERS/MICROSOFT.AUTHORIZATION",
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
		"resourceId": "/SUBSCRIPTIONS/F80EB51C-C534-4F0B-80AB-AEBC290C1C19/RESOURCEGROUPS/CLEANUPSERVICE/PROVIDERS/MICROSOFT.WEB/SITES/CLNB5F73B70-DCA2-47C2-BB24-77B1A2CAAB4D/PROVIDERS/MICROSOFT.AUTHORIZATION",
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

## Azure Data Explorer ingestion pipeline setup

The Azure Data Explorer pipeline setup contains various steps that include [table creation and data ingestion](/azure/data-explorer/ingest-sample-data#ingest-data) as well as manipulating, mapping, and updating the data.

### Connect to Azure Data Explorer Web UI

1. In your Azure Data Explorer 'AzureMonitoring' database, select **Query**, which will open the Azure Data Explorer web UI.

![Query](media/ingest-data-no-code/query-database.png)

### Create target tables

Use the Azure Data Explorer web UI to create the target tables in Azure Data Explorer database.

#### Diagnostic logs table

1. Create a table 'DiagnosticLogsRecords' in the 'AzureMonitoring' database that will receive the diagnostic log records using the `.create table` control command:

    ```kusto
    .create table DiagnosticLogsRecords (Timestamp:datetime, ResourceId:string, MetricName:string, Count:int, Total:double, Minimum:double, Maximum:double, Average:double, TimeGrain:string)
    ```

1. Select **Run** to create the table.

![Run Query](media/ingest-data-no-code/run-query.png)

#### Activity logs tables

Since the activity logs structure is not tabular, you will need to manipulate the data and expand each event to one or more records. The raw data will be ingested to an intermediate table 'ActivityLogsRawRecords' where the data will be manipulated and expanded. The data will then be re-ingested into the 'ActivityLogsRecords' table using an update policy. Therefore, you will need to create two separate tables for activity logs ingestion.

1. Create a table 'ActivityLogsRecords' in the 'AzureMonitoring' database that will receive activity log records. Run the following Azure Data Explorer query to create the table:

    ```kusto
    .create table ActivityLogsRecords (Timestamp:datetime, ResourceId:string, OperationName:string, Category:string, ResultType:string, ResultSignature:string, DurationMs:int, IdentityAuthorization:dynamic, IdentityClaims:dynamic, Location:string, Level:string)
    ```

1. Create the intermediate data table 'ActivityLogsRawRecords' in the 'AzureMonitoring' database for data manipulation:

    ```kusto
    .create table ActivityLogsRawRecords (Records:dynamic)
    .alter table ActivityLogsRawRecords policy retention '{"SoftDeletePeriod": "00:00:00" }'
    ```

[Retention](/azure/kusto/management/retention-policy) for an intermediate data table is set at zero retention policy.

### Create table mappings

 The data format is `json`, therefore, data mapping is required. The `json` mapping maps each json path to a table column name.

#### Diagnostic logs table mapping

    ```kusto
    .create table DiagnosticLogsRecords ingestion json mapping 'DiagnosticLogsRecordsMapping' '[{"column":"Timestamp","path":"$.time"},{"column":"ResourceId","path":"$.resourceId"},{"column":"MetricName","path":"$.metricName"},{"column":"Count","count":"$.time"},{"column":"Total","path":"$.total"},{"column":"Minimum","path":"$.minimum"},{"column":"Maximum","path":"$.maximum"},{"column":"Average","path":"$.average"},{"column":"TimeGrain","path":"$.timeGrain"}]'
    ```

#### Activity logs table mapping

    ```kusto
    .create table ActivityLogsRawRecords ingestion json mapping 'ActivityLogsRawRecordsMapping' '[{"column":"Records","path":"$.records"}]'
    ```

### Create update policy

First, create a [function](/azure/kusto/management/functions) that expands the collection of records so that each value in the collection receives a separate row. Use the [`mvexpand`](/azure/kusto/query/mvexpandoperator) operator:

    ```kusto
    .create function ActivityLogRecordsExpand() {
        ActivityLogsRawRecords 
        | mvexpand events = Records 
        | project 
            Timestamp = todatetime(events["time"]),
            ResourceId = tostring(events["resourceId"]),
            OperationName = tostring(events["operationName"]),
            Category = tostring(events["category"]),
            ResultType = tostring(events["resultType"]),
            ResultSignature = tostring(events["resultSignature"]),
            DurationMs = toint(events["durationMs"]),
            IdentityAuthorization = events["identity.authorization"],
            IdentityClaims = events["identity.claims"],
            Location = tostring(events["location"]),
            Level = tostring(events["level"])
    }
    ```

Add an [update policy](/azure/kusto/concepts/updatepolicy) to the target table. It will automatically run the query on any newly-ingested data in the 'ActivityLogsRawRecords' intermediate data table and ingest its results into 'ActivityLogsRecords' table:

    ```kusto
    .alter table ActivityLogRecords policy update @'[{"Source": "ActivityLogsRawRecords", "Query": "ActivityLogRecordsExpand()"}]'
    ```

## Create an Event Hub Namespace

Azure diagnostic logs enable exporting metrics to a Storage account or an Event Hub. In this tutorial, we route metrics via an Event Hub. Create an Event Hubs Namespace and Event Hub for diagnostic logs. Azure Monitoring will create the event hub 'insights-operational-logs' for activity logs.

You do this by .

1. Create an event hub using an Azure Resource Manager template in the Azure portal. Use the following button to start the deployment. Right-click and select **Open in new window**, so you can follow the rest of the steps in this article.

    [![Deploy to Azure](media/ingest-data-no-code/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F201-event-hubs-create-event-hub-and-consumer-group%2Fazuredeploy.json)

    The **Deploy to Azure** button takes you to the Azure portal to create an Event Hub and Event Hub Namespace.

    ![Event Hub creation]((media/ingest-data-no-code/eh-create.png)

Create an Event Hubs Namespace and Event Hub for diagnostic logs

Screen capture
Name of namespace and event hub. Name of consumer groups as wanted. subscription according to subscription.

## Connect Azure Monitoring logs to Event Hub

### Diagnostic logs connection to Event Hub

Select a resource from which to export metrics. There are several resource types that enables exporting diagnostic logs (Event Hub Namespace, KeyVault, IoT Hub, Azure Data Explorer cluster etc.). In this tutorial we use the Azure Data Explorer cluster as our resource.

1. Select your Kusto cluster in the Azure portal.
1. Select **Diagnostic settings** from left menu.
1. Click **Turn on diagnostics** link. (screen capture on my computer)
1. Select all metrics (optional) **Save**
1. Check **Stream to an Event Hub**
1. Configure exporting to the event hub you just created. (screen capture)

#### Activity logs connection to Event Hub

Select a subscription to export metrics from. Go to Activity Logs > Export to Event Hub. 
Note to select all regions.
An event hub with the name 'insights-operational-logs' will be created.

## Connect Event Hub to ADX
Database
Data Ingestion
Add Data Ingestion
// TODO: Table of Ingestion properties.

## Connect Azure Monitoring to Event Hub

1. Collect data from [Azure Monitoring diagnostic logs](/azure/azure-monitor/platform/diagnostic-logs-overview#how-to-enable-collection-of-diagnostic-logs).

## Query the new tables

you have a pipeline with data flowing. The kusto cluster reports metrics every 1 minute.

Note: Ingestion via the cluster take a few minutes by default so let the data flow for a few minutes.

Query the table:

### Diagnostic logs

    ```kusto
    DiagnosticLogsRecords
    | count
    ```

    ```kusto
    DiagnosticLogsRecords
    | where Timestamp > ago(15m) and MetricName == 'QueryDuration'
    | summarize avg(Average) by MetricName, ResourceId
    ```

### Activity logs

    ```kusto
    ActivityLogsRawRecords
    | take 1
    ```

    ```kusto
    ActivityLogsRecords
    | take 10
    ```

// TODO: links to relevent docs: update policy, function, dynamic data type

Link to web UI? (see mail) For more information re: running queries in Azure Data Explorer web UI [see] (https://docs.microsoft.com/en-us)/azure/data-explorer/web-query-data#run-queries) or create table []