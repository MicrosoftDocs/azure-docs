---
title: Ingest json formatted data into Azure Data Explorer
description: Learn about how to ingest json formatted data into Azure Data Explorer.
author: orspod
ms.author: orspodek
ms.reviewer: kerend
ms.service: data-explorer
ms.topic: conceptual
ms.date: 11/18/2019
---

# Ingest json formatted sample data into Azure Data Explorer

This article shows you how to ingest json formatted data into an Azure Data Explorer database. This article will start with a simple example of a flattened json and build up to more complex json schemas containing arrays and dictionaries.

## Prerequisites

[A test cluster and database](create-cluster-database-portal.md)

## The json format

ADX supports two json file formats:
* `json`: Line separated json. Each line in the input data has exactly one json record.
* `multijson`: Multi-lined json. The parser ignores the line separators and reads a record from the previous position to the end of a valid json.

Ingestion of json formatted data requires you to specify the *format* [ingestion property](/azure/kusto/management/data-ingestion/index#ingestion-properties). The ingest command default is the `csv` format.

## Ingestion mapping

Ingestion of json data requires mapping, which maps a json source entry to its target column. 
[Mapping](/azure/kusto/management/mappings) can be pre-defined on a table using the `jsonMappingReference` ingestion property or specified by the `jsonMapping`ingestion property.

This article will use the *jsonMappingReference* ingestion property which is pre-defined on the table used for ingestion.

## Source data

The following example is a simple json, with a flat structure. The data has temperature and humidity information, collected by several devices. Each record is marked with an ID and timestamp.

```json
{
    "timestamp": "2019-05-02 15:23:50.0369439",
    "deviceId": "2945c8aa-f13e-4c48-4473-b81440bb5ca2",
    "messageId": "7f316225-839a-4593-92b5-1812949279b3",
    "temperature": 31.0301639051317,
    "humidity": 62.0791099602725
}
```

We'll start by ingesting json records as raw data to a single column table. Later we'll use the mapping to ingest each property to its mapped column.

## Ingest json raw records 

In this example the data manipulation, using queries and update policy, is done after the data is ingested.

1. Sign in to [https://dataexplorer.azure.com](https://dataexplorer.azure.com).

1. In the upper-left of the application, select **Add cluster**.

1. In the **Add cluster** dialog box, enter your cluster URL in the form `https://<ClusterName>.<Region>.kusto.windows.net/`, then select **Add**.

1. Paste in the following command, and select **Run** to create the table.

    ```Kusto
    .create table RawEvents (Event: dynamic)
    ```

    This query creates a table with a single `Event` column of a [dynamic](/azure/kusto/query/scalar-data-types/dynamic) data type.

1. Create a json mapping

    ```Kusto
    .create table RawEvents ingestion json mapping 'RawEventMapping' '[{"column":"Event","path":"$"}]'
    ```

    This query creates a mapping, and maps the json root path `$` to the `Event` column.

1. Ingest data into the `RawEvents` table.

    \\TODO: Remove the following note + ingest command, replace it with code sample (C# + Python + KQL with comment) - all places.\\ 

    > [!NOTE]
    > Ingestion is via DM and has ~5 minutes latency

    > [!NOTE]
    > This article shows the control commands executed directly to the engine endpoint. In production scenarios, ingestion is executed to the Data Management service using the \\[Kusto Client Library](../api/netfx/about-kusto-data.md) NuGet package.\\

    ```Kusto
    .ingest into table RawEvents h'https://kustosamplefiles.blob.core.windows.net/jsonsamplefiles/simple.json?st=2018-08-31T22%3A02%3A25Z&se=2020-09-01T22%3A02%3A00Z&sp=r&sv=2018-03-28&sr=b&sig=LQIbomcKI8Ooz425hWtjeq6d61uEaq21UVX7YrM61N4%3D' with (format=json, jsonMappingReference=RawEventMapping)
    ```

## Ingest flattened json records

1. Create a new table, with the schema similar to the json input data. We will use this table for all the following ingest commands. 

> [!NOTE]
> Column names are a little different.

    ```Kusto
    .create table Events (Time: datetime, Device: string, MessageId: string, Temperature: double, Humidity: double)
    ```

1. Create a json mapping

    ```Kusto
    .create table Events ingestion json mapping 'FlatEventMapping' '[{"column":"Time","path":"$.timestamp"},{"column":"Device","path":"$.timestamp"},{"column":"MessageId","path":"$.timestamp"},{"column":"Temperature","path":"$.timestamp"},{"column":"Humidity","path":"$.timestamp"}]'
    ```

    In this mapping, the `timestamp` entries will be ingested to the column `Time`, and will be ingested as `datetime` data type, as defined by the table schema.

1. Ingest data into the table `Events`.

    ```Kusto
    .ingest into table Events h'https://kustosamplefiles.blob.core.windows.net/jsonsamplefiles/simple.json?st=2018-08-31T22%3A02%3A25Z&se=2020-09-01T22%3A02%3A00Z&sp=r&sv=2018-03-28&sr=b&sig=LQIbomcKI8Ooz425hWtjeq6d61uEaq21UVX7YrM61N4%3D' with (format=json, jsonMappingReference=FlatEventMapping)
    ```

    The file 'simple.json' has a few line separated json records. The format is `json`, and the mapping used in the ingest command is the `FlatEventMapping` you just created.

## Ingest multi-lined json records

1. Ingest data into the table `Events`.

    ```Kusto
    .ingest into table Events h'https://kustosamplefiles.blob.core.windows.net/jsonsamplefiles/simple.json?st=2018-08-31T22%3A02%3A25Z&se=2020-09-01T22%3A02%3A00Z&sp=r&sv=2018-03-28&sr=b&sig=LQIbomcKI8Ooz425hWtjeq6d61uEaq21UVX7YrM61N4%3D' with (format=multijson, jsonMappingReference=FlatEventMapping)
    ```

    The file *multilined.json* has a few indented json records. The format `multijson` tells the engine to read records by the json structure.

## Ingest json records containing arrays

Ingestion of a json array is usually done by an [update policy](/azure/kusto/management/update-policy). The json is ingested as-is to an intermediate table, and an update policy run a pre-defined function on tha source raw table, re-ingesting the results to the target table. We will ingest data with the following structure:

```json
{
	"records": 
	[
		{
			"timestamp": "2019-05-02 15:23:50.0000000",
			"deviceId": "ddbc1bf5-096f-42c0-a771-bc3dca77ac71",
			"messageId": "7f316225-839a-4593-92b5-1812949279b3",
			"temperature": 31.0301639051317,
			"humidity": 62.0791099602725
		},
		{
			"timestamp": "2019-05-02 15:23:51.0000000",
			"deviceId": "ddbc1bf5-096f-42c0-a771-bc3dca77ac71",
			"messageId": "57de2821-7581-40e4-861e-ea3bde102364",
			"temperature": 33.7529423105311,
			"humidity": 75.4787976739364
		}
	]
}
```

1. Create an update function that expands the collection of `records` so that each value in the collection receives a separate row, using the mv-expand operator. We will use table `RawEvents` as a source table and `Events` as a target table.

    ```Kusto
    .create function EventRecordsExpand() {
        RawEvents
        | mv-expand records = Event
        | project
            Time = todatetime(records["timestamp"]),
            Device = tostring(records["deviceId"]),
            MessageId = tostring(records["messageId"]),
            Temperature = todouble(records["temperature"]),
            Humidity = todouble(records["humidity"])
    }
    ```

    Notice the schema received by the function has to match the schema of the target table. Use `getschema` operator to review the schema:

    ```Kusto
    EventRecordsExpand() | getschema
    ```

1. Add the update policy to the target table. This policy will automatically run the query on any newly ingested data in the RawEvents intermediate table and ingest its results into the Events table. Define a zero-retention policy to avoid persisting the intermediate table.

    ```Kusto
    .alter table Events policy update @'[{"Source": "RawEvents", "Query": "EventRecordsExpand()", "IsEnabled": "True"}]'
    ```

1. Ingest data into the table `RawEvents`.

    ```Kusto
    .ingest into table Events h'https://kustosamplefiles.blob.core.windows.net/jsonsamplefiles/array.json?st=2018-08-31T22%3A02%3A25Z&se=2020-09-01T22%3A02%3A00Z&sp=r&sv=2018-03-28&sr=b&sig=LQIbomcKI8Ooz425hWtjeq6d61uEaq21UVX7YrM61N4%3D' with (format=multijson, jsonMappingReference=RawEventMapping)
    ```

1. Review data in table `Events`

    ```Kusto
    Events
    ```


## Ingest json records containing dictionaries

Referring key value pairs in a json record can be done by ingestion mapping. You can ingest data with the following structure:

```json
{
	"event": 
	[
		{
			"Key": "timestamp",
			"Value": "2019-05-02 15:23:50.0000000"
		},
		{
			"Key": "deviceId",
			"Value": "ddbc1bf5-096f-42c0-a771-bc3dca77ac71"
		},
		{
			"Key": "messageId",
			"Value": "7f316225-839a-4593-92b5-1812949279b3"
		},
		{
			"Key": "temperature",
			"Value": 31.0301639051317
		},
		{
			"Key": "humidity",
			"Value": 62.0791099602725
		}
	]
}
```

1. Create a json mapping

    ```Kusto
    .create table Events ingestion json mapping 'KeyValueEventMapping' '[{"column":"Time","path":"$.event[?(@.Key == 'timestamp')]"},{"column":"Device","path":"$.event[?(@.Key == 'deviceId')]"},{"column":"MessageId","path":"$.event[?(@.Key == 'messageId')]"},{"column":"Temperature","path":"$.event[?(@.Key == 'temperature')]"},{"column":"Humidity","path":"$.event[?(@.Key == 'humidity')]"}]'
    ```

    In this mapping, the `timestamp` entries will be ingested to the column `Time`, and will be ingested as `datetime` data type, as defined by the table schema.

    Ingestion mapping is referring a key-value pair by the key. The json path in the mapping has a conditional statement.
    

1. Add the update policy to the target table. This policy will automatically run the query on any newly ingested data in the *RawEvents* intermediate table and ingest its results into the Events table. We will defined a zero retention policy to avoid persisting the intermediate table.

    ```Kusto
    .alter table Events policy update @'[{"Source": "RawEvents", "Query": "EventRecordsExpand()", "IsEnabled": "True"}]'
    ```

1. Ingest data into the table `RawEvents`.

    ```Kusto
    .ingest into table Events h'https://kustosamplefiles.blob.core.windows.net/jsonsamplefiles/array.json?st=2018-08-31T22%3A02%3A25Z&se=2020-09-01T22%3A02%3A00Z&sp=r&sv=2018-03-28&sr=b&sig=LQIbomcKI8Ooz425hWtjeq6d61uEaq21UVX7YrM61N4%3D' with (format=multijson, jsonMappingReference=RawEventMapping)
    ```

1. Review data in table `Events`

    ```Kusto
    Events
    ```

