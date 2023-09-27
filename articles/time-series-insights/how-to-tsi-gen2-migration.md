---
title: 'Time Series Insights Gen2 migration to Azure Data Explorer | Microsoft Docs'
description: How to migrate Azure Time Series Insights Gen 2 environments to Azure Data Explorer.
ms.service: time-series-insights
author: tedvilutis
ms.author: tvilutis
ms.workload: big-data
ms.topic: conceptual
ms.date: 3/15/2022
ms.custom: tvilutis
---

# Migrating Time Series Insights (TSI) Gen2 to Azure Data Explorer

[!INCLUDE [retirement](../../includes/tsi-retirement.md)]

## Overview

High-level migration recommendations.

| Feature | Gen2 State | Migration Recommended |
| ---| ---| ---|
| Ingesting JSON from Hub with flattening and escaping | TSI Ingestion | ADX - OneClick Ingest / Wizard |
| Open Cold store | Customer Storage Account |  [Continuous data export](/azure/data-explorer/kusto/management/data-export/continuous-data-export) to customer specified external table in ADLS. |
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
    -	Record Environment ID from first part of Data Access FQDN (for example, d390b0b0-1445-4c0c-8365-68d6382c1c2a From .env.crystal-dev.windows-int.net)
1.	Env Overview -> Storage Configuration -> Storage Account
1.	Use Storage Explorer to get folder statistics
    -	Record size and the number of blobs of `PT=Time` folder. For customers in private preview of Bulk Import, also record `PT=Import` size and number of blobs.


### Migration Step 2 – Migrate Telemetry To ADX

#### Create ADX cluster

1.	Define the cluster size based on data size using the ADX Cost Estimator. 
    1.	From Event Hubs (or IoT Hub) metrics, retrieve the rate of how much data it's ingested per day. From the Storage Account connected to the TSI environment, retrieve how much data there is in the blob container used by TSI. This information will be used to compute the ideal size of an ADX Cluster for your environment. 
    1.	Open [the Azure Data Explorer Cost Estimator](https://dataexplorer.azure.com/AzureDataExplorerCostEstimator.html) and fill the existing fields with the information found. Set “Workload type” as “Storage Optimized”, and "Hot Data" with the total amount of data queried actively.
    1.	After providing all the information, Azure Data Explorer Cost Estimator will suggest a VM size and number of instances for your cluster. Analyze if the size of actively queried data will fit in the Hot Cache. Multiply the number of instances suggested by the cache size of the VM size, per example: 
        - Cost Estimator suggestion: 9x DS14 + 4 TB (cache)
        - Total Hot Cache suggested: 36 TB = [9x (instances) x 4 TB (of Hot Cache per node)]
    1. More factors to consider:
        - Environment growth: when planning the ADX Cluster size consider the data growth along the time.
        - Hydration and Partitioning: when defining the number of instances in ADX Cluster, consider extra nodes (by 2-3x) to speed up hydration and partitioning.
        - For more information about compute selection, see [Select the correct compute SKU for your Azure Data Explorer cluster](/azure/data-explorer/manage-cluster-choose-sku).
1.	To best monitor your cluster and the data ingestion, you should enable Diagnostic Settings and send the data to a Log Analytics Workspace.
    1.	In the Azure Data Explorer blade, go to “Monitoring | Diagnostic settings” and click on “Add diagnostic setting”

        :::image type="content" source="media/gen2-migration/adx-diagnostic.png" alt-text="Screenshot of the Azure Data Explorer blade Monitoring | Diagnostic settings" lightbox="media/gen2-migration/adx-diagnostic.png":::

    1.	Fill in the following
        1.	Diagnostic setting name: Display Name for this configuration
        1.	Logs: At minimum select SucceededIngestion, FailedIngestion, IngestionBatching
        1.	Select the Log Analytics Workspace to send the data to (if you don’t have one you’ll need to provision one before this step)

        :::image type="content" source="media/gen2-migration/adx-log-analytics.png" alt-text="Screenshot of the Azure Data Explorer Log Analytics Workspace" lightbox="media/gen2-migration/adx-log-analytics.png":::

1.	Data partitioning.
    1.	For most data sets, the default ADX partitioning is enough.
    1.	Data partitioning is beneficial in a very specific set of scenarios, and shouldn't be applied otherwise:
        1.	Improving query latency in big data sets where most queries filter on a high cardinality string column, e.g. a time-series ID.
        1.	When ingesting out-of-order data, e.g. when events from the past may be ingested days or weeks after their generation in the origin.
    1.	For more information, check [ADX Data Partitioning Policy](/azure/data-explorer/kusto/management/partitioningpolicy).

#### Prepare for Data Ingestion

1.	Go to [https://dataexplorer.azure.com](https://dataexplorer.azure.com).

    :::image type="content" source="media/gen2-migration/adx-landing-page.png" alt-text="Screenshot of the Azure Data Explorer landing page" lightbox="media/gen2-migration/adx-landing-page.png":::

1.	Go to Data tab and select ‘Ingest from blob container’

    :::image type="content" source="media/gen2-migration/adx-ingest-blob.png" alt-text="Screenshot of the Azure Data Explorer ingestion from blob container" lightbox="media/gen2-migration/adx-ingest-blob.png":::

1.	Select Cluster, Database, and create a new Table with the name you choose for the TSI data

    :::image type="content" source="media/gen2-migration/adx-ingest-table.png" alt-text="Screenshot of the Azure Data Explorer ingestion selection of cluster, database, and table" lightbox="media/gen2-migration/adx-ingest-table.png":::

1.	Select Next: Source
1.	In the Source tab select:
    1.	Historical data
    1.	“Select Container”
    1.	Choose the Subscription and Storage account for your TSI data
    1.	Choose the container that correlates to your TSI Environment

    :::image type="content" source="media/gen2-migration/adx-ingest-container.png" alt-text="Screenshot of the Azure Data Explorer ingestion selection of container" lightbox="media/gen2-migration/adx-ingest-container.png":::

1.	Select on Advanced settings
    1.	Creation time pattern: '/'yyyyMMddHHmmssfff'_'
    1.	Blob name pattern: *.parquet
    1.	Select on “Don’t wait for ingestion to complete” 

    :::image type="content" source="media/gen2-migration/adx-ingest-advanced.png" alt-text="Screenshot of the Azure Data Explorer ingestion selection of advanced settings" lightbox="media/gen2-migration/adx-ingest-advanced.png":::

1.	Under File Filters, add the Folder path `V=1/PT=Time`

    :::image type="content" source="media/gen2-migration/adx-ingest-folder-path.png" alt-text="Screenshot of the Azure Data Explorer ingestion selection of folder path" lightbox="media/gen2-migration/adx-ingest-folder-path.png":::

1.	Select Next: Schema
    > [!NOTE]
    > TSI applies some flattening and escaping when persisting columns in Parquet files. See these links for more details: [flattening and escaping rules](concepts-json-flattening-escaping-rules.md), [ingestion rules updates](ingestion-rules-update.md).
- If schema is unknown or varying
    1. Remove all columns that are infrequently queried, leaving at least timestamp and TSID column(s).

        :::image type="content" source="media/gen2-migration/adx-ingest-schema.png" alt-text="Screenshot of the Azure Data Explorer ingestion selection of schema" lightbox="media/gen2-migration/adx-ingest-schema.png":::

    1.	Add new column of dynamic type and map it to the whole record using $ path.

        :::image type="content" source="media/gen2-migration/adx-ingest-dynamic-type.png" alt-text="Screenshot of the Azure Data Explorer ingestion for dynamic type" lightbox="media/gen2-migration/adx-ingest-dynamic-type.png":::

        Example:

        :::image type="content" source="media/gen2-migration/adx-ingest-dynamic-type-example.png" alt-text="Screenshot of the Azure Data Explorer ingestion for dynamic type example" lightbox="media/gen2-migration/adx-ingest-dynamic-type-example.png":::

- If schema is known or fixed
    1.	Confirm that the data looks correct. Correct any types if needed.
    1.	Select Next: Summary

Copy the LightIngest command and store it somewhere so you can use it in the next step.

:::image type="content" source="media/gen2-migration/adx-ingest-lightingest-command.png" alt-text="Screenshot of the Azure Data Explorer ingestion for Lightingest command" lightbox="media/gen2-migration/adx-ingest-lightingest-command.png":::

## Data Ingestion

Before ingesting data you need to install the [LightIngest tool](/azure/data-explorer/lightingest#prerequisites).
The command generated from One-Click tool includes a SAS token. It’s best to generate a new one so that you have control over the expiration time. In the portal, navigate to the Blob Container for the TSI Environment and select on ‘Shared access token’

:::image type="content" source="media/gen2-migration/adx-ingest-sas-token.png" alt-text="Screenshot of the Azure Data Explorer ingestion for SAS token" lightbox="media/gen2-migration/adx-ingest-sas-token.png":::

> [!NOTE]
> It’s also recommended to scale up your cluster before kicking off a large ingestion. For instance, D14 or D32 with 8+ instances.
1. Set the following
    1. Permissions: Read and List
    1. Expiry: Set to a period you’re comfortable that the migration of data will be complete

    :::image type="content" source="media/gen2-migration/adx-ingest-sas-expiry.png" alt-text="Screenshot of the Azure Data Explorer ingestion for permission expiry" lightbox="media/gen2-migration/adx-ingest-sas-expiry.png":::

1. Select on ‘Generate SAS token and URL’ and copy the ‘Blob SAS URL’

    :::image type="content" source="media/gen2-migration/adx-ingest-sas-blob.png" alt-text="Screenshot of the Azure Data Explorer ingestion for SAS Blob URL" lightbox="media/gen2-migration/adx-ingest-sas-blob.png":::

1. Go to the LightIngest command that you copied previously. Replace the -source parameter in the command with this ‘SAS Blob URL’
1. **Option 1: Ingest All Data**. For smaller environments, you can ingest all of the data with a single command.
    1. Open a command prompt and change to the directory where the LightIngest tool was extracted to. Once there, paste the LightIngest command and execute it.

    :::image type="content" source="media/gen2-migration/adx-ingest-lightingest-prompt.png" alt-text="Screenshot of the Azure Data Explorer ingestion for command prompt" lightbox="media/gen2-migration/adx-ingest-lightingest-prompt.png":::

1. **Option 2: Ingest Data by Year or Month**. For larger environments or to test on a smaller data set you can filter the Lightingest command further.

   1. By Year: Change your -prefix parameter
       
      - Before: `-prefix:"V=1/PT=Time"`
      - After: `-prefix:"V=1/PT=Time/Y=<Year>"`
      - Example: `-prefix:"V=1/PT=Time/Y=2021"`

   1. By Month: Change your -prefix parameter

      - Before: `-prefix:"V=1/PT=Time"`
      - After: `-prefix:"V=1/PT=Time/Y=<Year>/M=<month #>"`
      - Example: `-prefix:"V=1/PT=Time/Y=2021/M=03"`

Once you’ve modified the command, execute it like above. One the ingestion is complete (using monitoring option below) modify the command for the next year and month you want to ingest.

## Monitoring Ingestion

The LightIngest command included the -dontWait flag so the command itself won’t wait for ingestion to complete. The best way to monitor the progress while it’s happening is to utilize the “Insights” tab within the portal.
Open the Azure Data Explorer cluster’s section within the portal and go to ‘Monitoring | Insights’

:::image type="content" source="media/gen2-migration/adx-ingest-monitoring-insights.png" alt-text="Screenshot of the Azure Data Explorer ingestion for Monitoring Insights" lightbox="media/gen2-migration/adx-ingest-monitoring-insights.png":::

You can use the ‘Ingestion (preview)’ section with the below settings to monitor the ingestion as it’s happening
-	Time range: Last 30 minutes
-	Look at Successful and by Table
-	If you have any failures, look at Failed and by Table

:::image type="content" source="media/gen2-migration/adx-ingest-monitoring-results.png" alt-text="Screenshot of the Azure Data Explorer ingestion for Monitoring results" lightbox="media/gen2-migration/adx-ingest-lightingest-command.png":::

You’ll know that the ingestion is complete once you see the metrics go to 0 for your table. If you want to see more details,, you can use Log Analytics. On the Azure Data Explorer cluster section select on the ‘Log’ tab:

:::image type="content" source="media/gen2-migration/adx-ingest-monitoring-logs.png" alt-text="Screenshot of the Azure Data Explorer ingestion for Monitoring logs" lightbox="media/gen2-migration/adx-ingest-monitoring-logs.png":::

#### Useful Queries

Understand Schema if Dynamic Schema is used
```
| project p=treepath(fullrecord)
| mv-expand p 
| summarize by tostring(p)
```

Accessing values in array
```
| where id_string == "a"
| summarize avg(todouble(fullrecord.['nestedArray_v_double'])) by bin(timestamp, 1s)  
| render timechart 
```

## Migrating Time Series Model (TSM) to Azure Data Explorer

The model can be download in JSON format from TSI Environment using TSI Explorer UX or TSM Batch API.
Then the model can be imported to another system like Azure Data Explorer.

1.	Download TSM from TSI UX.
1.	Delete first three lines using VSCode or another editor.

    :::image type="content" source="media/gen2-migration/adx-tsm-1.png" alt-text="Screenshot of TSM migration to the Azure Data Explorer - Delete first 3 lines" lightbox="media/gen2-migration/adx-tsm-1.png":::

1.	Using VSCode or another editor, search and replace as regex `\},\n    \{` with `}{`

    :::image type="content" source="media/gen2-migration/adx-tsm-2.png" alt-text="Screenshot of TSM migration to the Azure Data Explorer - search and replace" lightbox="media/gen2-migration/adx-tsm-2.png":::

1.	Ingest as JSON into ADX as a separate table using Upload from file functionality. 

    :::image type="content" source="media/gen2-migration/adx-tsm-3.png" alt-text="Screenshot of TSM migration to the Azure Data Explorer - Ingest as JSON" lightbox="media/gen2-migration/adx-tsm-3.png":::

## Translate Time Series Queries (TSQ) to KQL

#### GetEvents

```TSQ
{
  "getEvents": {
    "timeSeriesId": [
      "assest1",
      "siteId1",
      "dataId1"
    ],
    "searchSpan": {
      "from": "2021-11-01T00:00:0.0000000Z",
      "to": "2021-11-05T00:00:00.000000Z"
    },
    "inlineVariables": {},
  }
}
``` 
	
```KQL
events
| where timestamp >= datetime(2021-11-01T00:00:0.0000000Z) and timestamp < datetime(2021-11-05T00:00:00.000000Z)
| where assetId_string == "assest1" and siteId_string == "siteId1" and dataid_string == "dataId1"
| take 10000
```


#### GetEvents with filter

```TSQ
{
  "getEvents": {
    "timeSeriesId": [
      "deviceId1",
      "siteId1",
      "dataId1"
    ],
    "searchSpan": {
      "from": "2021-11-01T00:00:0.0000000Z",
      "to": "2021-11-05T00:00:00.000000Z"
    },
    "filter": {
      "tsx": "$event.sensors.sensor.String = 'status' AND $event.sensors.unit.String = 'ONLINE"
    }
  }
} 
```

```KQL
events
| where timestamp >= datetime(2021-11-01T00:00:0.0000000Z) and timestamp < datetime(2021-11-05T00:00:00.000000Z)
| where deviceId_string== "deviceId1" and siteId_string == "siteId1" and dataId_string == "dataId1"
| where ['sensors.sensor_string'] == "status" and ['sensors.unit_string'] == "ONLINE"
| take 10000
```


#### GetEvents with projected variable

```TSQ
{
  "getEvents": {
    "timeSeriesId": [
      "deviceId1",
      "siteId1",
      "dataId1"
    ],
    "searchSpan": {
      "from": "2021-11-01T00:00:0.0000000Z",
      "to": "2021-11-05T00:00:00.000000Z"
    },
    "inlineVariables": {},
    "projectedVariables": [],
    "projectedProperties": [
      {
        "name": "sensors.value",
        "type": "String"
      },
      {
        "name": "sensors.value",
        "type": "bool"
      },
      {
        "name": "sensors.value",
        "type": "Double"
      }
    ]
  }
}	 
```

```KQL
events
| where timestamp >= datetime(2021-11-01T00:00:0.0000000Z) and timestamp < datetime(2021-11-05T00:00:00.000000Z)
| where deviceId_string== "deviceId1" and siteId_string == "siteId1" and dataId_string == "dataId1"
| take 10000
| project timestamp, sensorStringValue= ['sensors.value_string'], sensorBoolValue= ['sensors.value_bool'], sensorDoublelValue= ['sensors.value_double']
```

####	AggregateSeries  

```TSQ
{
  "aggregateSeries": {
    "timeSeriesId": [
      "deviceId1"
    ],
    "searchSpan": {
      "from": "2021-11-01T00:00:00.0000000Z",
      "to": "2021-11-05T00:00:00.0000000Z"
    },
    "interval": "PT1M",
    "inlineVariables": {
      "sensor": {
        "kind": "numeric",
        "value": {
          "tsx": "coalesce($event.sensors.value.Double, todouble($event.sensors.value.Long))"
        },
        "aggregation": {
          "tsx": "avg($value)"
        }
      }
    },
    "projectedVariables": [
      "sensor"
    ]
  }	
```

```KQL
events
| where timestamp >= datetime(2021-11-01T00:00:00.0000000Z) and timestamp < datetime(2021-11-05T00:00:00.0000000Z)
| where  deviceId_string == "deviceId1"
| summarize avgSensorValue= avg(coalesce(['sensors.value_double'], todouble(['sensors.value_long']))) by bin(IntervalTs = timestamp, 1m)
| project IntervalTs, avgSensorValue
```

####	AggregateSeries with filter

```TSQ
{
  "aggregateSeries": {
    "timeSeriesId": [
      "deviceId1"
    ],
    "searchSpan": {
      "from": "2021-11-01T00:00:00.0000000Z",
      "to": "2021-11-05T00:00:00.0000000Z"
    },
    "filter": {
      "tsx": "$event.sensors.sensor.String = 'heater' AND $event.sensors.location.String = 'floor1room12'"
    },
    "interval": "PT1M",
    "inlineVariables": {
      "sensor": {
        "kind": "numeric",
        "value": {
          "tsx": "coalesce($event.sensors.value.Double, todouble($event.sensors.value.Long))"
        },
        "aggregation": {
          "tsx": "avg($value)"
        }
      }
    },
    "projectedVariables": [
      "sensor"
    ]
  }
}	
```

```KQL
events
| where timestamp >= datetime(2021-11-01T00:00:00.0000000Z) and timestamp < datetime(2021-11-05T00:00:00.0000000Z)
| where  deviceId_string == "deviceId1"
| where ['sensors.sensor_string'] == "heater" and ['sensors.location_string'] == "floor1room12"
| summarize avgSensorValue= avg(coalesce(['sensors.value_double'], todouble(['sensors.value_long']))) by bin(IntervalTs = timestamp, 1m)
| project IntervalTs, avgSensorValue
```

## Migration from TSI Power BI Connector to ADX Power BI Connector

The manual steps involved in this migration are
1.	Convert Power BI query to TSQ
1.	Convert TSQ to KQL
Power BI query to TSQ:
The Power BI query copied from TSI UX Explorer looks like as shown below
####	For Raw Data(GetEvents API)
```
{"storeType":"ColdStore","isSearchSpanRelative":false,"clientDataType":"RDX_20200713_Q","environmentFqdn":"6988946f-2b5c-4f84-9921-530501fbab45.env.timeseries.azure.com", "queries":[{"getEvents":{"searchSpan":{"from":"2019-10-31T23:59:39.590Z","to":"2019-11-01T05:22:18.926Z"},"timeSeriesId":["Arctic Ocean",null],"take":250000}}]}
```
- To convert it to TSQ, build a JSON from the above payload. The GetEvents API documentation also has examples to understand it better. Query - Execute - REST API (Azure Time Series Insights) | Microsoft Docs
- The converted TSQ looks like as shown below. It's the JSON payload inside “queries” 
```
{
  "getEvents": {
    "timeSeriesId": [
      "Arctic Ocean",
      "null"
    ],
    "searchSpan": {
      "from": "2019-10-31T23:59:39.590Z",
      "to": "2019-11-01T05:22:18.926Z"
    },
    "take": 250000
  }
}
```

#### For Aggradate Data(Aggregate Series API)

- For single inline variable, PowerBI query from TSI UX Explorer looks like as shown bellow:
```
{"storeType":"ColdStore","isSearchSpanRelative":false,"clientDataType":"RDX_20200713_Q","environmentFqdn":"6988946f-2b5c-4f84-9921-530501fbab45.env.timeseries.azure.com", "queries":[{"aggregateSeries":{"searchSpan":{"from":"2019-10-31T23:59:39.590Z","to":"2019-11-01T05:22:18.926Z"},"timeSeriesId":["Arctic Ocean",null],"interval":"PT1M", 		"inlineVariables":{"EventCount":{"kind":"aggregate","aggregation":{"tsx":"count()"}}},"projectedVariables":["EventCount"]}}]}
```
- To convert it to TSQ, build a JSON from the above payload. The AggregateSeries API documentation also has examples to understand it better. [Query - Execute - REST API (Azure Time Series Insights) | Microsoft Docs](/rest/api/time-series-insights/dataaccessgen2/query/execute#queryaggregateseriespage1)
-	The converted TSQ looks like as shown below. It's the JSON payload inside “queries”
```
{
  "aggregateSeries": {
    "timeSeriesId": [
      "Arctic Ocean",
      "null"
    ],
    "searchSpan": {
      "from": "2019-10-31T23:59:39.590Z",
      "to": "2019-11-01T05:22:18.926Z"
    },
    "interval": "PT1M",
    "inlineVariables": {
      "EventCount": {
        "kind": "aggregate",
        "aggregation": {
          "tsx": "count()"
        }
      }
    },
    "projectedVariables": [
      "EventCount",
    ]
  }
}
```
-	For more than one inline variable, append the json into “inlineVariables” as shown in the example below. The Power BI query for more than one inline variable looks like:
```
{"storeType":"ColdStore","isSearchSpanRelative":false,"clientDataType":"RDX_20200713_Q","environmentFqdn":"6988946f-2b5c-4f84-9921-530501fbab45.env.timeseries.azure.com","queries":[{"aggregateSeries":{"searchSpan":{"from":"2019-10-31T23:59:39.590Z","to":"2019-11-01T05:22:18.926Z"},"timeSeriesId":["Arctic Ocean",null],"interval":"PT1M", "inlineVariables":{"EventCount":{"kind":"aggregate","aggregation":{"tsx":"count()"}}},"projectedVariables":["EventCount"]}}, {"aggregateSeries":{"searchSpan":{"from":"2019-10-31T23:59:39.590Z","to":"2019-11-01T05:22:18.926Z"},"timeSeriesId":["Arctic Ocean",null],"interval":"PT1M", "inlineVariables":{"Magnitude":{"kind":"numeric","value":{"tsx":"$event['mag'].Double"},"aggregation":{"tsx":"max($value)"}}},"projectedVariables":["Magnitude"]}}]}

{
  "aggregateSeries": {
    "timeSeriesId": [
      "Arctic Ocean",
      "null"
    ],
    "searchSpan": {
      "from": "2019-10-31T23:59:39.590Z",
      "to": "2019-11-01T05:22:18.926Z"
    },
    "interval": "PT1M",
    "inlineVariables": {
      "EventCount": {
        "kind": "aggregate",
        "aggregation": {
          "tsx": "count()"
        }
      },
      "Magnitude": {
        "kind": "numeric",
        "value": {
          "tsx": "$event['mag'].Double"
        },
        "aggregation": {
          "tsx": "max($value)"
        }
      }
    },
    "projectedVariables": [
      "EventCount",
      "Magnitude",
    ]
  }
}
```
-	If you want to query the latest data("isSearchSpanRelative": true), manually calculate the searchSpan as mentioned below
    - Find the difference between “from” and “to” from the Power BI payload. Let’s call that difference as “D” where “D” = “from” - “to”
    - Take the current timestamp(“T”) and subtract the difference obtained in first step. It will be new “from”(F) of searchSpan where “F” = “T” - “D”
    - Now, the new “from” is “F” obtained in step 2 and new “to” is “T”(current timestamp)
