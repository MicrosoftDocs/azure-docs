---
title: Ingest JSON formatted data into Azure Data Explorer
description: Learn about how to ingest JSON formatted data into Azure Data Explorer.
author: orspod
ms.author: orspodek
ms.reviewer: kerend
ms.service: data-explorer
ms.topic: how-to
ms.date: 05/19/2020
---

# Ingest JSON formatted sample data into Azure Data Explorer

This article shows you how to ingest JSON formatted data into an Azure Data Explorer database. You'll start with simple examples of raw and mapped JSON, continue to multi-lined JSON, and then tackle more complex JSON schemas containing arrays and dictionaries.  The examples detail the process of ingesting JSON formatted data using Kusto query language (KQL), C#, or Python. The Kusto query language `ingest` control commands are executed directly to the engine endpoint. In production scenarios, ingestion is executed to the Data Management service using client libraries or data connections. Read [Ingest data using the Azure Data Explorer Python library](python-ingest-data.md) and [Ingest data using the Azure Data Explorer .NET Standard SDK](./net-sdk-ingest-data.md) for a walk-through regarding ingesting data with these client libraries.

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* Create [a cluster and database](create-cluster-database-portal.md).

## The JSON format

Azure Data Explorer supports two JSON file formats:
* `json`: Line separated JSON. Each line in the input data has exactly one JSON record.
* `multijson`: Multi-lined JSON. The parser ignores the line separators and reads a record from the previous position to the end of a valid JSON.

For more information, see [JSON Lines](https://jsonlines.org/).

### Ingest and map JSON formatted data

Ingestion of JSON formatted data requires you to specify the *format* using [ingestion property](ingestion-properties.md). Ingestion of JSON data requires [mapping](kusto/management/mappings.md), which maps a JSON source entry to its target column. When ingesting data, use the `IngestionMapping` property with its `ingestionMappingReference` (for a pre-defined mapping) ingestion property or its `IngestionMappings` property. This article will use the `ingestionMappingReference` ingestion property, which is pre-defined on the table used for ingestion. In the examples below, we'll start by ingesting JSON records as raw data to a single column table. Then we'll use the mapping to ingest each property to its mapped column. 

### Simple JSON example

The following example is a simple JSON, with a flat structure. The data has temperature and humidity information, collected by several devices. Each record is marked with an ID and timestamp.

```json
{
    "timestamp": "2019-05-02 15:23:50.0369439",
    "deviceId": "2945c8aa-f13e-4c48-4473-b81440bb5ca2",
    "messageId": "7f316225-839a-4593-92b5-1812949279b3",
    "temperature": 31.0301639051317,
    "humidity": 62.0791099602725
}
```

## Ingest raw JSON records 

In this example, you ingest JSON records as raw data to a single column table. The data manipulation, using queries, and update policy is done after the data is ingested.

# [KQL](#tab/kusto-query-language)

Use Kusto query language to ingest data in a raw [JSON format](#the-json-format).

1. Sign in to [https://dataexplorer.azure.com](https://dataexplorer.azure.com).

1. Select **Add cluster**.

1. In the **Add cluster** dialog box, enter your cluster URL in the form `https://<ClusterName>.<Region>.kusto.windows.net/`, then select **Add**.

1. Paste in the following command, and select **Run** to create the table.

    ```kusto
    .create table RawEvents (Event: dynamic)
    ```

    This query creates a table with a single `Event` column of a [dynamic](kusto/query/scalar-data-types/dynamic.md) data type.

1. Create the JSON mapping.

    ```kusto
    .create table RawEvents ingestion json mapping 'RawEventMapping' '[{"column":"Event","Properties":{"path":"$"}}]'
    ```

    This command creates a mapping, and maps the JSON root path `$` to the `Event` column.

1. Ingest data into the `RawEvents` table.

    ```kusto
    .ingest into table RawEvents ('https://kustosamplefiles.blob.core.windows.net/jsonsamplefiles/simple.json') with '{"format":"json", "ingestionMappingReference":"RawEventMapping"}'
    ```

# [C#](#tab/c-sharp)

Use C# to ingest data in raw [JSON format](#the-json-format).

1. Create the `RawEvents` table.

    ```csharp
    var kustoUri = "https://<ClusterName>.<Region>.kusto.windows.net/";
    var kustoConnectionStringBuilder =
        new KustoConnectionStringBuilder(ingestUri)
        {
            FederatedSecurity = true,
            InitialCatalog = database,
            UserID = user,
            Password = password,
            Authority = tenantId
        };
    var kustoClient = KustoClientFactory.CreateCslAdminProvider(kustoConnectionStringBuilder);

    var table = "RawEvents";
    var command =
        CslCommandGenerator.GenerateTableCreateCommand(
            table,
            new[]
            {
                Tuple.Create("Events", "System.Object"),
            });

    kustoClient.ExecuteControlCommand(command);
    ```

1. Create the JSON mapping.
    
    ```csharp
    var tableMapping = "RawEventMapping";
    var command =
        CslCommandGenerator.GenerateTableMappingCreateCommand(
            Data.Ingestion.IngestionMappingKind.Json,
            tableName,
            tableMapping,
            new[] {
            new ColumnMapping {ColumnName = "Events", Properties = new Dictionary<string, string>() {
                {"path","$"} }
            } });

    kustoClient.ExecuteControlCommand(command);
    ```
    This command creates a mapping, and maps the JSON root path `$` to the `Event` column.

1. Ingest data into the `RawEvents` table.

    ```csharp
    var ingestUri = "https://ingest-<ClusterName>.<Region>.kusto.windows.net/";
    var blobPath = "https://kustosamplefiles.blob.core.windows.net/jsonsamplefiles/simple.json"; 
    var ingestConnectionStringBuilder =
        new KustoConnectionStringBuilder(ingestUri)
        {
            FederatedSecurity = true,
            InitialCatalog = database,
            UserID = user,
            Password = password,
            Authority = tenantId
        };
    var ingestClient = KustoIngestFactory.CreateQueuedIngestClient(ingestConnectionStringBuilder);
    
    var properties =
        new KustoQueuedIngestionProperties(database, table)
        {
            Format = DataSourceFormat.json,
            IngestionMapping = new IngestionMapping()
            {
                IngestionMappingReference = tableMapping
            }
        };

    await ingestClient.IngestFromStorageAsync(blobPath, properties).ConfigureAwait(false);
    ```

> [!NOTE]
> Data is aggregated according to [batching policy](kusto/management/batchingpolicy.md), resulting in a latency of a few minutes.

# [Python](#tab/python)

Use Python to ingest data in raw [JSON format](#the-json-format).

1. Create the `RawEvents` table.

    ```python
    KUSTO_URI = "https://<ClusterName>.<Region>.kusto.windows.net/"
    KCSB_DATA = KustoConnectionStringBuilder.with_aad_device_authentication(KUSTO_URI, AAD_TENANT_ID)
    KUSTO_CLIENT = KustoClient(KCSB_DATA)
    TABLE = "RawEvents"

    CREATE_TABLE_COMMAND = ".create table " + TABLE + " (Events: dynamic)"
    RESPONSE = KUSTO_CLIENT.execute_mgmt(DATABASE, CREATE_TABLE_COMMAND)
    dataframe_from_result_table(RESPONSE.primary_results[0])
    ```

1. Create the JSON mapping.

    ```python
    MAPPING = "RawEventMapping"
    CREATE_MAPPING_COMMAND = ".create table " + TABLE + " ingestion json mapping '" + MAPPING + """' '[{"column":"Event","path":"$"}]'"""
    RESPONSE = KUSTO_CLIENT.execute_mgmt(DATABASE, CREATE_MAPPING_COMMAND)
    dataframe_from_result_table(RESPONSE.primary_results[0])
    ```

1. Ingest data into the `RawEvents` table.

    ```python
    INGEST_URI = "https://ingest-<ClusterName>.<Region>.kusto.windows.net/"
    KCSB_INGEST = KustoConnectionStringBuilder.with_aad_device_authentication(INGEST_URI, AAD_TENANT_ID)
    INGESTION_CLIENT = KustoIngestClient(KCSB_INGEST)
    BLOB_PATH = 'https://kustosamplefiles.blob.core.windows.net/jsonsamplefiles/simple.json'
    
    INGESTION_PROPERTIES = IngestionProperties(database=DATABASE, table=TABLE, dataFormat=DataFormat.json, mappingReference=MAPPING)
    BLOB_DESCRIPTOR = BlobDescriptor(BLOB_PATH, FILE_SIZE)
    INGESTION_CLIENT.ingest_from_blob(
        BLOB_DESCRIPTOR, ingestion_properties=INGESTION_PROPERTIES)
    ```

    > [!NOTE]
    > Data is aggregated according to [batching policy](kusto/management/batchingpolicy.md), resulting in a latency of a few minutes.

---

## Ingest mapped JSON records

In this example, you ingest JSON records data. Each JSON property is mapped to a single column in the table. 

# [KQL](#tab/kusto-query-language)

1. Create a new table, with a similar schema to the JSON input data. We'll use this table for all the following examples and ingest commands. 

    ```kusto
    .create table Events (Time: datetime, Device: string, MessageId: string, Temperature: double, Humidity: double)
    ```

1. Create the JSON mapping.

    ```kusto
    .create table Events ingestion json mapping 'FlatEventMapping' '[{"column":"Time","Properties":{"path":"$.timestamp"}},{"column":"Device","Properties":{"path":"$.deviceId"}},{"column":"MessageId","Properties":{"path":"$.messageId"}},{"column":"Temperature","Properties":{"path":"$.temperature"}},{"column":"Humidity","Properties":{"path":"$.humidity"}}]'
    ```

    In this mapping, as defined by the table schema, the `timestamp` entries will be ingested to the column `Time` as `datetime` data types.

1. Ingest data into the `Events` table.

    ```kusto
    .ingest into table Events ('https://kustosamplefiles.blob.core.windows.net/jsonsamplefiles/simple.json') with '{"format":"json", "ingestionMappingReference":"FlatEventMapping"}'
    ```

    The file 'simple.json' has a few line-separated JSON records. The format is `json`, and the mapping used in the ingest command is the `FlatEventMapping` you created.

# [C#](#tab/c-sharp)

1. Create a new table, with a similar schema to the JSON input data. We'll use this table for all the following examples and ingest commands. 

    ```csharp
    var table = "Events";
    var command =
        CslCommandGenerator.GenerateTableCreateCommand(
            table,
            new[]
            {
                Tuple.Create("Time", "System.DateTime"),
                Tuple.Create("Device", "System.String"),
                Tuple.Create("MessageId", "System.String"),
                Tuple.Create("Temperature", "System.Double"),
                Tuple.Create("Humidity", "System.Double"),
            });

    kustoClient.ExecuteControlCommand(command);
    ```

1. Create the JSON mapping.

    ```csharp
    var tableMapping = "FlatEventMapping";
    var table = "Events";
    
    var command =
         CslCommandGenerator.GenerateTableMappingCreateCommand(
            Data.Ingestion.IngestionMappingKind.Json,
            table,
            tableMapping,
            new[]
            {
               new ColumnMapping() {ColumnName = "Time", Properties = new Dictionary<string, string>() {{ MappingConsts.Path, "$.timestamp"} } },
               new ColumnMapping() {ColumnName = "Device", Properties = new Dictionary<string, string>() {{ MappingConsts.Path, "$.deviceId" } } },
               new ColumnMapping() {ColumnName = "MessageId", Properties = new Dictionary<string, string>() {{ MappingConsts.Path, "$.messageId" } } },
               new ColumnMapping() {ColumnName = "Temperature", Properties = new Dictionary<string, string>() {{ MappingConsts.Path, "$.temperature" } } },
               new ColumnMapping() { ColumnName= "Humidity", Properties = new Dictionary<string, string>() {{ MappingConsts.Path, "$.humidity" } } },
            });

    kustoClient.ExecuteControlCommand(command);
    ```

    In this mapping, as defined by the table schema, the `timestamp` entries will be ingested to the column `Time` as `datetime` data types.    

1. Ingest data into the `Events` table.

    ```csharp
    var blobPath = "https://kustosamplefiles.blob.core.windows.net/jsonsamplefiles/simple.json";
    var properties =
        new KustoQueuedIngestionProperties(database, table)
        {
            Format = DataSourceFormat.json,
            IngestionMapping = new IngestionMapping()
            {
                IngestionMappingReference = tableMapping
            }
        };

    await ingestClient.IngestFromStorageAsync(blobPath, properties).ConfigureAwait(false);
    ```

    The file 'simple.json' has a few line-separated JSON records. The format is `json`, and the mapping used in the ingest command is the `FlatEventMapping` you created.

# [Python](#tab/python)

1. Create a new table, with a similar schema to the JSON input data. We'll use this table for all the following examples and ingest commands. 

    ```python
    TABLE = "Events"
    CREATE_TABLE_COMMAND = ".create table " + TABLE + " (Time: datetime, Device: string, MessageId: string, Temperature: double, Humidity: double)"
    RESPONSE = KUSTO_CLIENT.execute_mgmt(DATABASE, CREATE_TABLE_COMMAND)
    dataframe_from_result_table(RESPONSE.primary_results[0])
    ```

1. Create the JSON mapping.

    ```python
    MAPPING = "FlatEventMapping"
    CREATE_MAPPING_COMMAND = ".create table Events ingestion json mapping '" + MAPPING + """' '[{"column":"Time","Properties":{"path":"$.timestamp"}},{"column":"Device","Properties":{"path":"$.deviceId"}},{"column":"MessageId","Properties":{"path":"$.messageId"}},{"column":"Temperature","Properties":{"path":"$.temperature"}},{"column":"Humidity","Properties":{"path":"$.humidity"}}]'""" 
    RESPONSE = KUSTO_CLIENT.execute_mgmt(DATABASE, CREATE_MAPPING_COMMAND)
    dataframe_from_result_table(RESPONSE.primary_results[0])
    ```

1. Ingest data into the `Events` table.

    ```python
    BLOB_PATH = 'https://kustosamplefiles.blob.core.windows.net/jsonsamplefiles/simple.json'
    
    INGESTION_PROPERTIES = IngestionProperties(database=DATABASE, table=TABLE, dataFormat=DataFormat.json, mappingReference=MAPPING)
    BLOB_DESCRIPTOR = BlobDescriptor(BLOB_PATH, FILE_SIZE)
    INGESTION_CLIENT.ingest_from_blob(
        BLOB_DESCRIPTOR, ingestion_properties=INGESTION_PROPERTIES)
    ```

    The file 'simple.json' has a few line separated JSON records. The format is `json`, and the mapping used in the ingest command is the `FlatEventMapping` you created.    
---

## Ingest multi-lined JSON records

In this example, you ingest multi-lined JSON records. Each JSON property is mapped to a single column in the table. The file 'multilined.json' has a few indented JSON records. The format `multijson` tells the engine to read records by the JSON structure.

# [KQL](#tab/kusto-query-language)

Ingest data into the `Events` table.

```kusto
.ingest into table Events ('https://kustosamplefiles.blob.core.windows.net/jsonsamplefiles/multilined.json') with '{"format":"multijson", "ingestionMappingReference":"FlatEventMapping"}'
```

# [C#](#tab/c-sharp)

Ingest data into the `Events` table.

```csharp
var tableMapping = "FlatEventMapping";
var blobPath = "https://kustosamplefiles.blob.core.windows.net/jsonsamplefiles/multilined.json";
var properties =
    new KustoQueuedIngestionProperties(database, table)
    {
        Format = DataSourceFormat.multijson,
        IngestionMapping = new IngestionMapping()
        {
            IngestionMappingReference = tableMapping
        }
    };

await ingestClient.IngestFromStorageAsync(blobPath, properties).ConfigureAwait(false);
```

# [Python](#tab/python)

Ingest data into the `Events` table.

```python
MAPPING = "FlatEventMapping"
BLOB_PATH = 'https://kustosamplefiles.blob.core.windows.net/jsonsamplefiles/multilined.json'
INGESTION_PROPERTIES = IngestionProperties(database=DATABASE, table=TABLE, dataFormat=DataFormat.multijson, mappingReference=MAPPING)
BLOB_DESCRIPTOR = BlobDescriptor(BLOB_PATH, FILE_SIZE)
INGESTION_CLIENT.ingest_from_blob(
    BLOB_DESCRIPTOR, ingestion_properties=INGESTION_PROPERTIES)
```

---

## Ingest JSON records containing arrays

Array data types are an ordered collection of values. Ingestion of a JSON array is done by an [update policy](kusto/management/update-policy.md). The JSON is ingested as-is to an intermediate table. An update policy runs a pre-defined function on the `RawEvents` table, reingesting the results to the target table. We will ingest data with the following structure:

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

# [KQL](#tab/kusto-query-language)

1. Create an `update policy` function that expands the collection of `records` so that each value in the collection receives a separate row, using the `mv-expand` operator. We'll use table `RawEvents` as a source table and `Events` as a target table.

    ```kusto
    .create function EventRecordsExpand() {
        RawEvents
        | mv-expand records = Event.records
        | project
            Time = todatetime(records["timestamp"]),
            Device = tostring(records["deviceId"]),
            MessageId = tostring(records["messageId"]),
            Temperature = todouble(records["temperature"]),
            Humidity = todouble(records["humidity"])
    }
    ```

1. The schema received by the function must match the schema of the target table. Use `getschema` operator to review the schema.

    ```kusto
    EventRecordsExpand() | getschema
    ```

1. Add the update policy to the target table. This policy will automatically run the query on any newly ingested data in the `RawEvents` intermediate table and ingest the results into the `Events` table. Define a zero-retention policy to avoid persisting the intermediate table.

    ```kusto
    .alter table Events policy update @'[{"Source": "RawEvents", "Query": "EventRecordsExpand()", "IsEnabled": "True"}]'
    ```

1. Ingest data into the `RawEvents` table.

    ```kusto
    .ingest into table RawEvents ('https://kustosamplefiles.blob.core.windows.net/jsonsamplefiles/array.json') with '{"format":"multijson", "ingestionMappingReference":"RawEventMapping"}'
    ```

1. Review data in the `Events` table.

    ```kusto
    Events
    ```

# [C#](#tab/c-sharp)

1. Create an update function that expands the collection of `records` so that each value in the collection receives a separate row, using the `mv-expand` operator. We'll use table `RawEvents` as a source table and `Events` as a target table.   

    ```csharp
    var command =
        CslCommandGenerator.GenerateCreateFunctionCommand(
            "EventRecordsExpand",
            "UpdateFunctions",
            string.Empty,
            null,
            @"RawEvents
                | mv-expand records = Event
                | project
                    Time = todatetime(records['timestamp']),
                    Device = tostring(records['deviceId']),
                    MessageId = tostring(records['messageId']),
                    Temperature = todouble(records['temperature']),
                    Humidity = todouble(records['humidity'])",
            ifNotExists: false);

    kustoClient.ExecuteControlCommand(command);
    ```

    > [!NOTE]
    > The schema received by the function must match the schema of the target table.

1. Add the update policy to the target table. This policy will automatically run the query on any newly ingested data in the `RawEvents` intermediate table and ingest its results into the `Events` table. Define a zero-retention policy to avoid persisting the intermediate table.

    ```csharp
    var command =
        ".alter table Events policy update @'[{'Source': 'RawEvents', 'Query': 'EventRecordsExpand()', 'IsEnabled': 'True'}]";

    kustoClient.ExecuteControlCommand(command);
    ```

1. Ingest data into the `RawEvents` table.

    ```csharp
    var table = "RawEvents";
    var tableMapping = "RawEventMapping";
    var blobPath = "https://kustosamplefiles.blob.core.windows.net/jsonsamplefiles/array.json";
    var properties =
        new KustoQueuedIngestionProperties(database, table)
        {
            Format = DataSourceFormat.multijson,
            IngestionMapping = new IngestionMapping()
            {
                IngestionMappingReference = tableMapping
            }
        };

    await ingestClient.IngestFromStorageAsync(blobPath, properties).ConfigureAwait(false);
    ```
    
1. Review data in the `Events` table.

# [Python](#tab/python)

1. Create an update function that expands the collection of `records` so that each value in the collection receives a separate row, using the `mv-expand` operator. We'll use table `RawEvents` as a source table and `Events` as a target table.   

    ```python
    CREATE_FUNCTION_COMMAND = 
        '''.create function EventRecordsExpand() { 
            RawEvents
            | mv-expand records = Event
            | project
                Time = todatetime(records["timestamp"]),
                Device = tostring(records["deviceId"]),
                MessageId = tostring(records["messageId"]),
                Temperature = todouble(records["temperature"]),
                Humidity = todouble(records["humidity"])
            }'''
    RESPONSE = KUSTO_CLIENT.execute_mgmt(DATABASE, CREATE_FUNCTION_COMMAND)
    dataframe_from_result_table(RESPONSE.primary_results[0])
    ```

    > [!NOTE]
    > The schema received by the function has to match the schema of the target table.

1. Add the update policy to the target table. This policy will automatically run the query on any newly ingested data in the `RawEvents` intermediate table and ingest its results into the `Events` table. Define a zero-retention policy to avoid persisting the intermediate table.

    ```python
    CREATE_UPDATE_POLICY_COMMAND = 
        """.alter table Events policy update @'[{'Source': 'RawEvents', 'Query': 'EventRecordsExpand()', 'IsEnabled': 'True'}]"""
    RESPONSE = KUSTO_CLIENT.execute_mgmt(DATABASE, CREATE_UPDATE_POLICY_COMMAND)
    dataframe_from_result_table(RESPONSE.primary_results[0])
    ```

1. Ingest data into the `RawEvents` table.

    ```python
    TABLE = "RawEvents"
    MAPPING = "RawEventMapping"
    BLOB_PATH = 'https://kustosamplefiles.blob.core.windows.net/jsonsamplefiles/array.json'
    INGESTION_PROPERTIES = IngestionProperties(database=DATABASE, table=TABLE, dataFormat=DataFormat.multijson, mappingReference=MAPPING)
    BLOB_DESCRIPTOR = BlobDescriptor(BLOB_PATH, FILE_SIZE)
    INGESTION_CLIENT.ingest_from_blob(
        BLOB_DESCRIPTOR, ingestion_properties=INGESTION_PROPERTIES)
    ```

1. Review data in the `Events` table.

---    

## Ingest JSON records containing dictionaries

Dictionary structured JSON contains key-value pairs. Json records undergo ingestion mapping using logical expression in the `JsonPath`. You can ingest data with the following structure:

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

# [KQL](#tab/kusto-query-language)

1. Create a JSON mapping.

    ```kusto
    .create table Events ingestion json mapping 'KeyValueEventMapping' '[{"column":"Time","Properties":{"path":"$.event[?(@.Key == \'timestamp\')].Value"}},{"column":"Device","Properties":{"path":"$.event[?(@.Key == \'deviceId\')].Value","datatype":"StringBuffer"}},{"column":"MessageId","Properties":{"path":"$.event[?(@.Key == \'messageId\')].Value"}},{"column":"Temperature","Properties":{"path":"$.event[?(@.Key == \'temperature\')].Value"}},{"column":"Humidity","Properties":{"path":"$.event[?(@.Key == \'humidity\')].Value"}}]'
    ```

1. Ingest data into the `Events` table.

    ```kusto
    .ingest into table Events ('https://kustosamplefiles.blob.core.windows.net/jsonsamplefiles/dictionary.json') with '{"format":"multijson", "ingestionMappingReference":"KeyValueEventMapping"}'
    ```

# [C#](#tab/c-sharp)

1. Create a JSON mapping.

    ```csharp
    var tableName = "Events";
    var tableMapping = "KeyValueEventMapping";
    var command =
         CslCommandGenerator.GenerateTableMappingCreateCommand(
            Data.Ingestion.IngestionMappingKind.Json,
            "",
            tableMapping,
            new[]
            {
                new ColumnMapping() { ColumnName = "Time", Properties = new Dictionary<string, string>() { {
                    MappingConsts.Path,
                    "$.event[?(@.Key == 'timestamp')]"
                } } },
                    new ColumnMapping() { ColumnName = "Device", Properties = new Dictionary<string, string>() { {
                    MappingConsts.Path,
                    "$.event[?(@.Key == 'deviceId')]"
                } } }, new ColumnMapping() { ColumnName = "MessageId", Properties = new Dictionary<string, string>() { {
                    MappingConsts.Path,
                    "$.event[?(@.Key == 'messageId')]"
                } } }, new ColumnMapping() { ColumnName = "Temperature", Properties = new Dictionary<string, string>() { {
                    MappingConsts.Path,
                    "$.event[?(@.Key == 'temperature')]"
                } } }, new ColumnMapping() { ColumnName = "Humidity", Properties = new Dictionary<string, string>() { {
                    MappingConsts.Path,
                    "$.event[?(@.Key == 'humidity')]"
                } } },
            });

    kustoClient.ExecuteControlCommand(command);
    ```

1. Ingest data into the `Events` table.

    ```csharp
    var blobPath = "https://kustosamplefiles.blob.core.windows.net/jsonsamplefiles/dictionary.json";
    var properties =
        new KustoQueuedIngestionProperties(database, table)
        {
            Format = DataSourceFormat.multijson,
            IngestionMapping = new IngestionMapping()
            {
                IngestionMappingReference = tableMapping
            }
        };
    await ingestClient.IngestFromStorageAsync(blobPath, properties).ConfigureAwait(false);
    ```

# [Python](#tab/python)

1. Create a JSON mapping.

    ```python
    MAPPING = "KeyValueEventMapping"
    CREATE_MAPPING_COMMAND = ".create table Events ingestion json mapping '" + MAPPING + """' '[{"column":"Time","path":"$.event[?(@.Key == 'timestamp')]"},{"column":"Device","path":"$.event[?(@.Key == 'deviceId')]"},{"column":"MessageId","path":"$.event[?(@.Key == 'messageId')]"},{"column":"Temperature","path":"$.event[?(@.Key == 'temperature')]"},{"column":"Humidity","path":"$.event[?(@.Key == 'humidity')]"}]'""" 
    RESPONSE = KUSTO_CLIENT.execute_mgmt(DATABASE, CREATE_MAPPING_COMMAND)
    dataframe_from_result_table(RESPONSE.primary_results[0])
    ```

1. Ingest data into the `Events` table.

     ```python
    MAPPING = "KeyValueEventMapping"
    BLOB_PATH = 'https://kustosamplefiles.blob.core.windows.net/jsonsamplefiles/dictionary.json'
    INGESTION_PROPERTIES = IngestionProperties(database=DATABASE, table=TABLE, dataFormat=DataFormat.multijson, mappingReference=MAPPING)u
    BLOB_DESCRIPTOR = BlobDescriptor(BLOB_PATH, FILE_SIZE)
    INGESTION_CLIENT.ingest_from_blob(
        BLOB_DESCRIPTOR, ingestion_properties=INGESTION_PROPERTIES)
    ```

---    

## Next steps

* [Data ingestion overview](ingest-data-overview.md)
* [Write queries](write-queries.md)
