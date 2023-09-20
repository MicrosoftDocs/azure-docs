---
title: CREATE EXTERNAL STREAM (Transact-SQL) - Azure SQL Edge
description: Learn about the CREATE EXTERNAL STREAM statement in Azure SQL Edge
author: rwestMSFT
ms.author: randolphwest
ms.date: 09/14/2023
ms.service: sql-edge
ms.topic: conceptual
---
# CREATE EXTERNAL STREAM (Transact-SQL)

> [!IMPORTANT]  
> Azure SQL Edge no longer supports the ARM64 platform.

The EXTERNAL STREAM object has a dual purpose of both an input and output stream. It can be used as an input to query streaming data from event ingestion services such as Azure Event Hubs, Azure IoT Hub (or Edge Hub) or Kafka or it can be used as an output to specify where and how to store results from a streaming query.

An EXTERNAL STREAM can also be specified and created as both an output and input for services such as Event Hubs or Blob storage. This facilitates chaining scenarios where a streaming query is persisting results to the external stream as output and another streaming query reading from the same external stream as input.

Azure SQL Edge currently only supports the following data sources as stream inputs and outputs.

| Data source type | Input | Output | Description |
| --- | --- | --- | --- |
| Azure IoT Edge hub | Y | Y | Data source to read and write streaming data to an Azure IoT Edge hub. For more information, see [IoT Edge Hub](../iot-edge/iot-edge-runtime.md#iot-edge-hub). |
| SQL Database | N | Y | Data source connection to write streaming data to SQL Database. The database can be a local database in Azure SQL Edge, or a remote database in SQL Server or Azure SQL Database. |
| Kafka | Y | N | Data source to read streaming data from a Kafka topic. |

## Syntax

```syntaxsql
CREATE EXTERNAL STREAM { external_stream_name }
( <column_definition> [ , <column_definition> ] * ) -- Used for Inputs - optional
WITH  ( <with_options> )

<column_definition> ::=
  column_name <column_data_type>

<data_type> ::=
[ type_schema_name . ] type_name
    [ ( precision [ , scale ] | max ) ]

<with_options> ::=
  DATA_SOURCE = data_source_name ,
  LOCATION = location_name ,
  [ FILE_FORMAT = external_file_format_name ] , --Used for Inputs - optional
  [ <optional_input_options> ] ,
  [ <optional_output_options> ] ,
  TAGS = <tag_column_value>

<optional_input_options> ::=
  INPUT_OPTIONS = ' [ <input_options_data> ] '

<Input_option_data> ::=
      <input_option_values> [ , <input_option_values> ]

<input_option_values> ::=
  PARTITIONS: [ number_of_partitions ]
  | CONSUMER_GROUP: [ consumer_group_name ]
  | TIME_POLICY: [ time_policy ]
  | LATE_EVENT_TOLERANCE: [ late_event_tolerance_value ]
  | OUT_OF_ORDER_EVENT_TOLERANCE: [ out_of_order_tolerance_value ]

<optional_output_options> ::=
  OUTPUT_OPTIONS = ' [ <output_option_data> ] '

<output_option_data> ::=
      <output_option_values> [ , <output_option_values> ]

<output_option_values> ::=
   REJECT_POLICY: [ reject_policy ]
   | MINIMUM_ROWS: [ row_value ]
   | MAXIMUM_TIME: [ time_value_minutes ]
   | PARTITION_KEY_COLUMN: [ partition_key_column_name ]
   | PROPERTY_COLUMNS: [ ( [ output_col_name ] ) ]
   | SYSTEM_PROPERTY_COLUMNS: [ ( [ output_col_name ] ) ]
   | PARTITION_KEY: [ partition_key_name ]
   | ROW_KEY: [ row_key_name ]
   | BATCH_SIZE: [ batch_size_value ]
   | MAXIMUM_BATCH_COUNT: [ batch_value ]
   | STAGING_AREA: [ blob_data_source ]

<tag_column_value> ::= -- Reserved for Future Usage
);
```

## Arguments

#### DATA_SOURCE

For more information, see [DATA_SOURCE](/sql/t-sql/statements/create-external-data-source-transact-sql/).

#### FILE_FORMAT

For more information, see [FILE_FORMAT](/sql/t-sql/statements/create-external-file-format-transact-sql/).

#### LOCATION

Specifies the name for the actual data or location in the data source.

- For Edge Hub or Kafka stream objects, location specifies the name of the Edge Hub or Kafka topic to read from or write to.
- For SQL stream objects (SQL Server, Azure SQL Database or Azure SQL Edge), the location specifies the name of the table. If the stream is created in the same database and schema as the destination table, then just the Table name suffices. Otherwise you need to fully qualify the table name (`<database_name>.<schema_name>.<table_name>`).
- For Azure Blob Storage stream object location refers to the path pattern to use inside the blob container. For more information, see [Outputs from Azure Stream Analytics](../stream-analytics/blob-storage-azure-data-lake-gen2-output.md).

#### INPUT_OPTIONS

Specify options as key-value pairs for services such as Kafka and IoT Edge Hubs, which are inputs to streaming queries.

- PARTITIONS:

  Number of partitions defined for a topic. The maximum number of partitions that can be used is limited to 32 (Applies to Kafka Input Streams).

  - CONSUMER_GROUP:

    Event and IoT Hubs limit the number of readers within one consumer group (to 5). Leaving this field empty will use the '$Default' consumer group.

    - Reserved for future usage. Doesn't apply to Azure SQL Edge.

  - TIME_POLICY:

    Describes whether to drop events or adjust the event time when late events or out of order events pass their tolerance value.

    - Reserved for future usage. Doesn't apply to Azure SQL Edge.

  - LATE_EVENT_TOLERANCE:

    The maximum acceptable time delay. The delay represents the difference between the event's timestamp and the system clock.

    - Reserved for future usage. Doesn't apply to Azure SQL Edge.

  - OUT_OF_ORDER_EVENT_TOLERANCE:

    Events can arrive out of order after they've made the trip from the input to the streaming query. These events can be accepted as-is, or you can choose to pause for a set period to reorder them.

    - Reserved for future usage. Doesn't apply to Azure SQL Edge.

#### OUTPUT_OPTIONS

Specify options as key-value pairs for supported services that are outputs to streaming queries

- REJECT_POLICY:  DROP | RETRY

  Species the data error handling policies when data conversion errors occur.

  - Applies to all supported outputs.

- MINIMUM_ROWS:

  Minimum rows required per batch written to an output. For Parquet, every batch creates a new file.

  - Applies to all supported outputs.

- MAXIMUM_TIME:

  Maximum wait time in minutes per batch. After this time, the batch will be written to the output even if the minimum rows requirement isn't met.

  - Applies to all supported outputs.

- PARTITION_KEY_COLUMN:

  The column that is used for the partition key.

  - Reserved for future usage. Doesn't apply to Azure SQL Edge.

- PROPERTY_COLUMNS:

  A comma-separated list of the names of output columns that are attached to messages as custom properties, if provided.

  - Reserved for future usage. Doesn't apply to Azure SQL Edge.

- SYSTEM_PROPERTY_COLUMNS:

  A JSON-formatted collection of name/value pairs of System Property names and output columns to be populated on Service Bus messages. For example, `{ "MessageId": "column1", "PartitionKey": "column2" }`.

  - Reserved for future usage. Doesn't apply to Azure SQL Edge.

- PARTITION_KEY:

  The name of the output column containing the partition key. The partition key is a unique identifier for the partition within a given table that forms   the first part of an entity's primary key. It's a string value that may be up to 1 KB in size.

  - Reserved for future usage. Doesn't apply to Azure SQL Edge.

- ROW_KEY:

  The name of the output column containing the row key. The row key is a unique identifier for an entity within a given partition. It forms the second   part of an entity's primary key. The row key is a string value that may be up to 1 KB in size.

  - Reserved for future usage. Doesn't apply to Azure SQL Edge.

- BATCH_SIZE:

  This represents the number of transactions for table storage where the maximum can go up to 100 records. For Azure Functions, this represents the batch   size in bytes sent to the function per call - default is 256 kB.

  - Reserved for future usage. Doesn't apply to Azure SQL Edge.

- MAXIMUM_BATCH_COUNT:

  Maximum number of events sent to the function per call for Azure function - default is 100. For SQL Database, this represents the maximum number of   records sent with every bulk insert transaction - default is 10,000.

  - Applies to all SQL based outputs

- STAGING_AREA: EXTERNAL DATA SOURCE object to Blob Storage

  The staging area for high-throughput data ingestion into Azure Synapse Analytics

  - Reserved for future usage. Doesn't apply to Azure SQL Edge.

For more information about supported input and output options corresponding to the data source type, see [Azure Stream Analytics - Input Overview](../stream-analytics/stream-analytics-add-inputs.md) and [Azure Stream Analytics - Outputs Overview](../stream-analytics/stream-analytics-define-outputs.md) respectively.

## Examples

### Example A: EdgeHub

Type: Input or Output.

```sql
CREATE EXTERNAL DATA SOURCE MyEdgeHub
    WITH (LOCATION = 'edgehub://');

CREATE EXTERNAL FILE FORMAT myFileFormat
    WITH (FORMAT_TYPE = JSON);

CREATE EXTERNAL STREAM Stream_A
    WITH (
            DATA_SOURCE = MyEdgeHub,
            FILE_FORMAT = myFileFormat,
            LOCATION = '<mytopicname>',
            OUTPUT_OPTIONS = 'REJECT_TYPE: Drop'
            );
```

### Example B: Azure SQL Database, Azure SQL Edge, SQL Server

Type: Output

```sql
CREATE DATABASE SCOPED CREDENTIAL SQLCredName
    WITH IDENTITY = '<user>',
        SECRET = '<password>';

-- Azure SQL Database
CREATE EXTERNAL DATA SOURCE MyTargetSQLTabl
    WITH (
            LOCATION = '<my_server_name>.database.windows.net',
            CREDENTIAL = SQLCredName
            );

--SQL Server or Azure SQL Edge
CREATE EXTERNAL DATA SOURCE MyTargetSQLTabl
    WITH (
            LOCATION = ' <sqlserver://<ipaddress>,<port>',
            CREDENTIAL = SQLCredName
            );

CREATE EXTERNAL STREAM Stream_A
    WITH (
            DATA_SOURCE = MyTargetSQLTable,
            LOCATION = '<DatabaseName>.<SchemaName>.<TableName>',
            --Note: If table is contained in the database, <TableName> should be sufficient
            OUTPUT_OPTIONS = 'REJECT_TYPE: Drop'
            );
```

### Example C: Kafka

Type: Input

```sql
CREATE EXTERNAL DATA SOURCE MyKafka_tweets
    WITH (
            --The location maps to KafkaBootstrapServer
            LOCATION = 'kafka://<kafkaserver>:<ipaddress>',
            CREDENTIAL = kafkaCredName
            );

CREATE EXTERNAL FILE FORMAT myFileFormat
    WITH (
            FORMAT_TYPE = JSON,
            DATA_COMPRESSION = 'org.apache.hadoop.io.compress.GzipCodec'
            );

CREATE EXTERNAL STREAM Stream_A (
    user_id VARCHAR,
    tweet VARCHAR
    )
    WITH (
            DATA_SOURCE = MyKafka_tweets,
            LOCATION = '<KafkaTopicName>',
            FILE_FORMAT = myFileFormat,
            INPUT_OPTIONS = 'PARTITIONS: 5'
            );
```

## See also

- [DROP EXTERNAL STREAM (Transact-SQL)](drop-external-stream-transact-sql.md)
