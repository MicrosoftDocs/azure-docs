---
title: 'Time Series Insights Gen2 migration to Real-Time Intelligence in Microsoft Fabric | Microsoft Docs'
description: How to migrate Azure Time Series Insights Gen 2 environments to Real-Time Intelligence in Microsoft Fabric.
ms.service: time-series-insights
author: tedvilutis
ms.author: tvilutis
ms.topic: conceptual
ms.date: 3/15/2022
ms.custom: tvilutis
---

# Migrating Time Series Insights Gen2 to Real-Time Intelligence in Microsoft Fabric

[!INCLUDE [retirement](../../includes/tsi-retirement.md)]

## Overview

[Eventhouse](/fabric/real-time-intelligence/eventhouse) is the time series database in Real-Time Intelligence. It serves as the target for migrating data away from Time Series Insights.

High-level migration recommendations.

| Feature                                  | Migration Recommended                                                                                     |
|------------------------------------------|-----------------------------------------------------------------------------------------------------------|
| Ingesting JSON from Hub with flattening and escaping | [Get data from Azure Event Hubs](/fabric/real-time-intelligence/get-data-event-hub)                                                                            |
| Open Cold store                          | [Eventhouse OneLake Availability](/fabric/real-time-intelligence/event-house-onelake-availability) |
| Power BI Connector                            | Use [Eventhouse Power BI Connector](/fabric/real-time-intelligence/create-powerbi-report). Rewrite TSQ to KQL manually.                                                       |
| Spark Connector                          | Migrate data to Eventhouse. [Use a notebook with Apache Spark to query an Eventhouse](/fabric/real-time-intelligence/spark-connector) or [Explore the data in your lakehouse with a notebook](/fabric/data-engineering/lakehouse-notebook-explore) |
| Bulk Upload                              | [Get data from Azure storage](/fabric/real-time-intelligence/get-data-azure-storage)                      |
| Time Series Model                        | Can be exported as JSON file. Can be [imported](/fabric/real-time-intelligence/get-data-local-file) to Eventhouse. [Kusto Graph Semantics](/azure/data-explorer/graph-overview?context=%2Ffabric%2Fcontext%2Fcontext-rti&pivots=fabric) allow model, traverse, and analyze Time Series Model hierarchy as a graph                            |
| Time Series Explorer                             | [Real-Time Dashboard](/fabric/real-time-intelligence/dashboard-real-time-create), [Power BI report](/fabric/real-time-intelligence/create-powerbi-report) or write a custom dashboard using [KustoTrender](https://github.com/Azure/azure-kusto-trender)                                                                                          |
| Query language                           | Rewrite queries in KQL.                                              |

## Migrating Telemetry

To retrieve the copy of all data in the environment, use `PT=Time` folder in the storage account. For more information, please see [Data Storage](./concepts-storage.md#cold-store).

### Migration Step 1 – Get Statistics about Telemetry Data 

Data 
1.	Env overview 
    -	Record Environment ID from first part of Data Access FQDN (for example, d390b0b0-1445-4c0c-8365-68d6382c1c2a From .env.crystal-dev.windows-int.net)
1.	Env Overview -> Storage Configuration -> Storage Account
1.	Use Storage Explorer to get folder statistics
    -	Record size and the number of blobs of `PT=Time` folder.


### Migration Step 2 – Migrate Data To Eventhouse

#### Create an Eventhouse

To set up an Eventhouse for your migration process, follow the steps in [creating an Eventhouse](/fabric/real-time-intelligence/create-eventhouse).

#### Data Ingestion

To retrieve data for the storage account corresponding to your Time Series Insights instance, follow the steps in [getting data from Azure Storage](/fabric/real-time-intelligence/get-data-azure-storage).

Make sure that you:

1. Select the appropriate container and provide its URI, along with the necessary [SAS token](/azure/data-explorer/kusto/api/connection-strings/storage-connection-strings#shared-access-sas-token) or [account key](/azure/data-explorer/kusto/api/connection-strings/storage-connection-strings#storage-account-access-key).

1. Configure file filters folder path as `V=1/PT=Time` to filter the relevant blobs.
1. Verify the inferred schema and remove any infrequently queried columns, while retaining at least the timestamp, TSID columns, and values. To ensure that all your data is copied to Eventhouse add another column and use the [DropMappedFields](/azure/data-explorer/kusto/management/mappings#dropmappedfields-transformation) mapping transformation.
1. Complete the ingestion process.

#### Querying the data

Now that you successfully ingested the data, you can begin exploring it using a [KQL queryset](/fabric/real-time-intelligence/create-query-set). If you need to access the data from your custom client application, Eventhouse provides SDKs for major programming languages such as C# ([link](/azure/data-explorer/kusto/api/netfx/about-the-sdk?context=%2Ffabric%2Fcontext%2Fcontext-rti&pivots=fabric)), Java ([link](/azure/data-explorer/kusto/api/java/kusto-java-client-library?context=%2Ffabric%2Fcontext%2Fcontext-rti&pivots=fabric)), and Node.js ([link](/azure/data-explorer/kusto/api/node/kusto-node-client-library?context=%2Ffabric%2Fcontext%2Fcontext-rti&pivots=fabric)).

## Migrating Time Series Model to Azure Data Explorer

The model can be download in JSON format from TSI Environment using TSI Explorer UX or TSM Batch API.
Then the model can be imported to Eventhouse.

1.	Download TSM from TSI UX.
1.	Delete first three lines using Visual Studio Code or another editor.

    :::image type="content" source="media/gen2-migration/adx-tsm-1.png" alt-text="Screenshot of TSM migration to the Azure Data Explorer - Delete first 3 lines" lightbox="media/gen2-migration/adx-tsm-1.png":::

1.	Using Visual Studio Code or another editor, search and replace as regex `\},\n    \{` with `}{`

    :::image type="content" source="media/gen2-migration/adx-tsm-2.png" alt-text="Screenshot of TSM migration to the Azure Data Explorer - search and replace" lightbox="media/gen2-migration/adx-tsm-2.png":::

1.	Ingest as JSON into ADX as a separate table using [Get data from a single file](/fabric/real-time-intelligence/get-data-local-file).

Once you migrated your time series data to Eventhouse in Fabric Real-Time Intelligence, you can use the power of [Kusto Graph Semantics](/azure/data-explorer/graph-overview?context=%2Ffabric%2Fcontext%2Fcontext-rti&pivots=fabric) to contextualize and analyze your data. Kusto Graph Semantics allows you to model, traverse, and analyze the hierarchy of your Time Series Model as a graph. By using Kusto Graph Semantics, you can gain insights into the relationships between different entities in your time series data, such as assets, sites, and data points. These insights help you to understand the dependencies and interactions between various components of your system.

## Translate Time Series Queries (TSQ) to KQL

### GetEvents

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


### GetEvents with filter

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


### GetEvents with projected variable

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

###	AggregateSeries  

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

###	AggregateSeries with filter

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

## Power BI

There's no automated process for migrating Power BI reports that were based on Time Series Insights. All queries relying on data stored in Time Series Insights must be migrated to [Eventhouse](/fabric/real-time-intelligence/create-powerbi-report).

To create efficient time series reports in Power BI, we recommend referring to the following informative blog articles:

- [Eventhouse time series capabilities in Power BI](https://techcommunity.microsoft.com/t5/azure-data-explorer-blog/using-azure-data-explorer-timeseries-capabilities-in-power-bi/ba-p/2727977)
- [How to use M dynamic parameters without most limitations](https://techcommunity.microsoft.com/t5/azure-data-explorer-blog/how-to-use-m-dynamic-parameters-without-most-limitations/ba-p/4117352)
- [Timespan/duration values in KQL, Power Query, and Power BI](https://techcommunity.microsoft.com/t5/azure-data-explorer-blog/timespan-duration-values-in-kql-power-query-and-power-bi/ba-p/4086091)
- [KQL query settings in Power BI](https://techcommunity.microsoft.com/t5/azure-data-explorer-blog/using-kql-query-settings-in-power-bi/ba-p/4013580)
- [Filtering and visualizing Kusto data in local time](https://techcommunity.microsoft.com/t5/azure-data-explorer-blog/filtering-and-visualizing-kusto-data-in-local-time/ba-p/3948778)
- [Near real-time reports in PBI + Kusto](https://techcommunity.microsoft.com/t5/azure-data-explorer-blog/near-real-time-reports-in-pbi-kusto/ba-p/3884322)
- [Power BI modeling with ADX - cheat sheet](https://techcommunity.microsoft.com/t5/azure-data-explorer-blog/power-bi-modeling-with-adx-cheat-sheet/ba-p/3768392)

Refer to these resources for guidance on creating effective time series reports in Power BI.

## Real-Time Dashboard

A Real-Time Dashboard in Fabric is a collection of tiles, optionally organized in pages, where each tile has an underlying query and a visual representation. You can natively export Kusto Query Language (KQL) queries to a dashboard as visuals and later modify their underlying queries and visual formatting as needed. In addition to ease of data exploration, this fully integrated dashboard experience provides improved query and visualization performance.

Start by creating a new dashboard in Fabric Real-Time Intelligence. This powerful feature allows you to explore data, customize visuals, apply conditional formatting, and utilize parameters. Furthermore, you can create alerts directly from your Real-Time Dashboards, enhancing your monitoring capabilities. For detailed instructions on how to create a dashboard, refer to the [official documentation](/fabric/real-time-intelligence/dashboard-real-time-create). 
