---
title: 'TSI Gen2 migration to Azure Data Explorer | Microsoft Docs'
description: How to migrate Azure Time Series Insights Gen 2 environments to Azure Data Explorer.
ms.service: time-series-insights
services: time-series-insights
author: tedvilutis
ms.author: tvilutis
manager: 
ms.workload: big-data
ms.topic: conceptual
ms.date: 3/1/2022
ms.custom: tvilutis
---

# Migrating TSI Gen2 to Azure Data Explorer

## Overview

High-level migration recommendations.

| Feature | Gen2 State | Migration Recommended |
| ---| ---| ---|
| Ingesting JSON from Hub with flattening and escaping | TSI Ingestion | ADX - OneClick Ingest / Wizard |
| Open Cold store | Customer Storage Account |  [Continuous data export](../data-explorer/kusto/management/data-export/continuous-data-export.md) to customer specified external table in ADLS. |
| PBI Connector | Private Preview | Use ADX PBI Connector. Rewrite TSQ to KQL manually. |
| Spark Connector | Private Preview. Query telemetry data. Query model data. | Migrate data to ADX. Use ADX Spark connector for telemetry data + export model to JSON and load in Spark. Rewrite queries in KQL. |
| Bulk Upload | Private Preview | Use ADX OneClick Ingest and LightIngest. An optionally, set up partitioning within ADX. |
| Time Series Model | | Can be exported as JSON file. Can be imported to ADX to perform joins in KQL. |
| TSI Explorer | Toggling warm and cold | ADX Dashboards |
| Query language | Time Series Queries (TSQ) | Rewrite queries in KQL. Use Kusto SDKs instead of TSI ones. |

## Migrating Telemetry

Use `PT=Time` folder in the storage account to retrieve the copy of all telemetry in the environment. For more information, please see [Data Storage](./concepts-storage.md#cold-store).

### Migration Step 1 – Get Statistics about Telemetry Data 

Data 
1.	Env overview 
   1.	Record Environment ID from first part of Data Access FQDN (E.g. d390b0b0-1445-4c0c-8365-68d6382c1c2a From .env.crystal-dev.windows-int.net)
1.	Env Overview -> Storage Configuration -> Storage Account
1.	Use Storage Explorer to get folder statistics
    1.	Record size and the number of blobs of `PT=Time` folder. For customers in private preview of Bulk Import, also record `PT=Import` size and number of blobs.

### Migration Step 2 – Migrate Telemetry To ADX

#### Create ADX cluster

1.	Define the cluster size based on data size using the ADX Cost Estimator. 
    1.	From Event Hub (or IoT Hub) metrics, retrieve the rate of how much data it is ingested per day, and in the Storage Account connected to the TSI environment retrieve how much data there is in the blob container used by TSI. This information will be used to compute the ideal size of an ADX Cluster for your environment. 
    1.	Open [the Azure Data Explorer Cost Estimator](https://dataexplorer.azure.com/AzureDataExplorerCostEstimator.html) and fill the existing fields with the information found. Set “Workload type” as “Storage Optimized”, and "Hot Data" with the total amount of data queried actively.
    1.	After providing all the information, Azure Data Explorer Cost Estimator will suggest a VM size and number of instances for your cluster. Analyze if the size of actively queried data will fit in the Hot Cache multiplying the number of instances suggested by the cache size of the VM size, per example: 
| Cost Estimator suggestion: | 9x DS14 + 4TB (cache) |
| Total Hot Cache suggested: | 36TB = [9x (instances) x 4TB (of Hot Cache per node)] |

    1. Additional factors to consider:
        - Environment growth: when planning the ADX Cluster size consider the data growth along the time.
        - Hydration and Partitioning: when defining the number of instances in ADX Cluster, consider additional nodes (by 2-3x) to speed up hydration and partitioning.


See [Select the correct compute SKU for your Azure Data Explorer cluster](../data-explorer/manage-cluster-choose-sku.md) for more details.

1.	Configure Diagnostic Settings: to best monitor your cluster and the data ingestion you should enable Diagnostic Settings and send the data to a Log Analytics Workspace.
    1.	In the Azure Data Explorer blade go to “Monitoring | Diagnostic settings” and clickon “Add diagnostic setting”
    1.	Fill in the following
        1.	Diagnostic setting name: Display Name for this configuration
        1.	Logs: At minimum select SucceededIngestion, FailedIngestion, IngestionBatching
        1.	Select the Log Analytics Workspace to send the data to (if you don’t have one you’ll need to provision one before this step)
1.	Data partitioning.
    1.	For small size data, the default ADX partitioning is enough. For more complex scenario, with large datasets and right push rate custom ADX data partitioning is more appropriate. Data partitioning is beneficial for scenarios, as follows:
        1.	Improving query latency in big data sets.
        1.	When querying historical data.
        1.	When ingesting out-of-order data.
    1.	The custom data partitioning should include:
        1.	The timestamp column which results in time-based partitioning of extents. 
        1.	A string-based column which corresponds to the Time Series ID with highest cardinality. 
    1.	An example of data partitioning containing a Time Series ID column and a timestamp column is: 

```.alter table events policy partitioning
 {
   "PartitionKeys": [
     {
       "ColumnName": "timeSeriesId",
       "Kind": "Hash",
       "Properties": {
         "Function": "XxHash64",
         "MaxPartitionCount": 32,
         "PartitionAssignmentMode": "Uniform"
       }
     },
     {
       "ColumnName": "timestamp",
       "Kind": "UniformRange",
       "Properties": {
         "Reference": "1970-01-01T00:00:00",
         "RangeSize": "1.00:00:00",
         "OverrideCreationTime": true
       }
     }
   ] ,
  "EffectiveDateTime": "1970-01-01T00:00:00",
  "MinRowCountPerOperation": 0,
  "MaxRowCountPerOperation": 0,
  "MaxOriginalSizePerOperation": 0
 }
```
For more references check [ADX Data Partitioning Policy](../data-explorer/kusto/management/partitioningpolicy.md).

#### Prepare for Data Ingestion

1.	Go to [https://dataexplorer.azure.com](https://dataexplorer.azure.com).
1.	Go to Data tab and select ‘Ingest from blob container’
1.	Select Cluster, Database, and create a new Table with the name you choose for the TSI data
1.	Click Next: Source
1.	In the Source tab select the following:
    1.	Historical data
    1.	“Select Container”
    1.	Choose the Subscription and Storage account for your TSI data
    1.	Choose the container that correlates to your TSI Environment
1.	Click on Advanced settings
    1.	Creation time pattern: '/'yyyyMMddHHmmssfff'_'
    1.	Blob name pattern: *.parquet
    1.	Click on “Don’t wait for ingestion to complete” 
1.	Under File Filters add the Folder path `V=1/PT=Time`
1.	Click Next: Schema
> [!NOTE]
> TSI applies some flattening and escaping when persisting columns in Parquet files. See these links for more details: https://docs.microsoft.com/en-us/azure/time-series-insights/concepts-json-flattening-escaping-rules, https://docs.microsoft.com/en-us/azure/time-series-insights/ingestion-rules-update.
1.	If schema is unknown or varying.
    1. Remove all columns that are infrequently queried, leaving at least timestamp and TSID column(s).
    1.	Add new column of dynamic type and map it to the whole record using $ path.
1. If schema is known or fixed
    1.	Confirm that the data looks correct. Correct any types if needed.
    1.	Click Next: Summary
Copy the LightIngest command and store it somewhere so you can use it in the next step.

#### Data Ingestion

Before ingesting data you need to install the [LightIngest tool](../data-explorer/lightingest.md#prerequisites).
The command generated from One-Click tool includes a SAS token but it’s best to generate a new one so that you have control over the expiration time. In the portal navigate to the Blob Container for the TSI Environment and click on ‘Shared access token’
*> [!NOTE]
> It’s also recommended to scale up your cluster before kicking off a large ingestion. For instance, D14 or D32 with 8+ instances.
1. Set the following
    1. Permissions: Read and List
    1. Expiry: Set to a period you’re comfortable that the migration of data will be complete
1. Click on ‘Generate SAS token and URL’ and copy the ‘SAS Blob URL’
1. Go to the LightIngest command that you copied previously. Replace the -source parameter in the command with this ‘SAS Blob URL’
1. `Option 1: Ingest All Data`. For smaller environments you can ingest all of the data with a single command.
    1. Open a command prompt and change to the directory where the LightIngest tool was extracted to. Once there simply paste the LightIngest command and execute it.
1. `Option 2: Ingest Data by Year or Month`. For larger environments or to test on a smaller data set you can filter the Lightingest command further.
    1. By Year
    Change your -prefix parameter
	    Before: -prefix:"V=1/PT=Time"
	    After: -prefix:"V=1/PT=Time/Y=<Year>"
    	Example: -prefix:"V=1/PT=Time/Y=2021"
     1. By Month
    Change your -prefix parameter
	    Before: -prefix:"V=1/PT=Time"
    	After: -prefix:"V=1/PT=Time/Y=<Year>/M=<month #>"
	    Example: -prefix:"V=1/PT=Time/Y=2021/M=03"
Once you’ve modified the command execute it like above. One the ingestion is complete (using monitoring option below) modify the command for the next year and month you want to ingest.

#### Monitoring Ingestion

The LightIngest command included the -dontWait flag so the command itself won’t wait for ingestion to complete. The best way to monitor the progress while it’s happening is to utilize the “Insights” tab withing the portal.
Open the Azure Data Explorer cluster’s blade within the portal and go to ‘Monitoring | Insights’
You can use the ‘Ingestion (preview)’ section with the below settings to monitor the ingestion as it’s happening
-	Time range:Last 30 minutes
-	Look at Successful and by Table
-	If you have any failures look at Failed and by Table
You’ll know that the ingestion is complete once you see the metrics go to 0 for your table. If you want to see more details you can utilize Log Analytics. On the Azure Data Explorer cluster blade click on the ‘Log’ tab:

#### Useful Queries

Understand Schema if Dynamic Schema is Used
| project p=treepath(fullrecord)
| mv-expand p 
| summarize by tostring(p)

Accessing values in array
TBD: Better table and column names, explain what “fullrecord” mean.
dmdenarray4
| where id_string == "a"
| summarize avg(todouble(fullrecord.['nestedArray_v_double'])) by bin(timestamp, 1s)  
| render timechart 

### Migrating Time Series Model (TSM)

The model can be download in JSON format from TSI Environment using TSI Explorer UX or TSM Batch API.
Then the model can be imported to another system like Azure Data Explorer.

#### Migrate TSM to Azure Data Explorer

1.	Download TSM from TSI UX.
1.	Delete first 3 lines using VSCode or another editor.
1.	Using VSCode or another editor, search and replace as regex `\},\n    \{` with `}{`
1.	Ingest as JSON into ADX as a separate table using Upload from file functionality. 

### Translate Time Series Queries (TSQ) to KQL

### Migration from TSI PowerBI Connector to ADX PowerBI Connector