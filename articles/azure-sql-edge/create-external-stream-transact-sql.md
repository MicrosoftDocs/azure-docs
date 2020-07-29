---
title: CREATE EXTERNAL STREAM (Transact-SQL) - Azure SQL Edge (Preview)
description: Learn about the CREATE EXTERNAL STREAM statement in Azure SQL Edge (Preview) 
keywords: 
services: sql-edge
ms.service: sql-edge
ms.topic: conceptual
author: SQLSourabh
ms.author: sourabha
ms.reviewer: sstein
ms.date: 05/19/2020
---

# CREATE EXTERNAL STREAM (Transact-SQL)

The EXTERNAL STREAM object has a dual purpose of both an input and output. It can be used as an input to query streaming data from event ingestion services such as Azure Event or IoT hubs or used as an output to specify where and how to store results from a streaming query.

An EXTERNAL STREAM can also be specified and created as both an output and input for services such as Event Hub or Blob storage. This is for chaining scenarios where a streaming query is persisting results to the external stream as output and another streaming query reading from the same external stream as input. 


## Syntax

```sql
CREATE EXTERNAL STREAM {external_stream_name}  
(column definition [,column definitions ] * ) --Used for input - optional 
WITH  
(  
  DATA_SOURCE = <data_source_name>, 
  LOCATION = <location_name>, 
  EXTERNAL_FILE_FORMAT = <external_file_format_name>, --Used for input - optional 
   
  INPUT_OPTIONS =  
    ‘CONSUMER_GROUP=<consumer_group_name>; 
    ‘TIME_POLICY=<time_policy>; 
    LATE_EVENT_TOLERANCE=<late_event_tolerance_value>; 
    OUT_OF_ORDER_EVENT_TOLERANCE=<out_of_order_tolerance_value> 
     
    /* Edge options */ 
  , 
  OUTPUT_OPTIONS =  
    ‘REJECT_POLICY=<reject_policy>; 
    MINIMUM_ROWS=<row_value>; 
    MAXIMUM_TIME=<time_value_minutes>; 
    PARTITION_KEY_COLUMN=<partition_key_column_name>; 
    PROPERTY_COLUMNS=(); 
    SYSTEM_PROPERTY_COLUMNS=(); 
    PARTITION_KEY=<partition_key_name>; 
    ROW_KEY=<row_key_name>; 
    BATCH_SIZE=<batch_size_value>; 
    MAXIMUM_BATCH_COUNT=<batch_value>;	
    STAGING_AREA=<blob_data_source>’ 
     
    /* Edge options */ TAGS=<tag_column_value> 
); 
```


## Arguments


- [EXTERNAL DATA SOURCE](/sql/t-sql/statements/create-external-data-source-transact-sql/)
- [EXTERNAL FILE FORMAT](/sql/t-sql/statements/create-external-file-format-transact-sql/)
- **LOCATION**: Specifies the name for the actual data or location in the data source. In case of an Edge Hub or Kafka stream object, location specifies the name of the Edge Hub or Kafka topic to read from or write to.
- **INPUT_OPTIONS**: Specify options as key-value pairs for services such as Event and IOT Hubs that are inputs to streaming queries
    - CONSUMER_GROUP:
      Event and IoT Hubs limit the number of readers within one consumer group (to 5). Leaving this field empty will use the '$Default' consumer group.
      - Applies to Event and IOT Hubs
    - TIME_POLICY:
      Describes whether to drop events or adjust the event time when late events or out of order events pass their tolerance value.
      - Applies to Event and IOT Hubs
    - LATE_EVENT_TOLERANCE:
      The maximum acceptable time delay. The delay represents the difference between the event's timestamp and the system clock.
      - Applies to Event and IOT Hubs
    - OUT_OF_ORDER_EVENT_TOLERANCE:
      Events can arrive out of order after they've made the trip from the input to the streaming query. These events can be accepted as-is, or you can choose to pause for a set period to reorder them.
      - Applies to Event and IOT Hubs
- **OUTPUT_OPTIONS**: Specify options as key-value pairs for supported services that are outputs to streaming queries 
  - REJECT_POLICY:  DROP | RETRY 
    Species the data error handling policies when data conversion errors occur. 
    - Applies to all supported outputs 
  - MINIMUM_ROWS:  
    Minimum rows required per batch written to an output. For Parquet, every batch will create a new file. 
    - Applies to all supported outputs 
  - MAXIMUM_TIME:  
    Maximum wait time per batch. After this time, the batch will be written to the output even if the minimum rows requirement is not met. 
    - Applies to all supported outputs 
  - PARTITION_KEY_COLUMN:  
    The column that is used for the partition key. 
    - Applies to Event Hub and Service Bus topic 
  - PROPERTY_COLUMNS:  
    A comma-separated list of the names of output columns that will be attached to messages as custom properties if provided.  
    - Applies to Event Hub and Service Bus topic and queue 
  - SYSTEM_PROPERTY_COLUMNS:  
    A JSON-formatted collection of name/value pairs of System Property names and output columns to be populated on Service Bus messages. e.g. { "MessageId":   "column1", "PartitionKey": "column2"} 
    - Applies to Service Bus topic and queue 
  - PARTITION_KEY:  
    The name of the output column containing the partition key. The partition key is a unique identifier for the partition within a given table that forms   the first part of an entity's primary key. It is a string value that may be up to 1 KB in size. 
    - Applies to Table Storage and Azure Function 
  - ROW_KEY:  
    The name of the output column containing the row key. The row key is a unique identifier for an entity within a given partition. It forms the second   part of an entity's primary key. The row key is a string value that may be up to 1 KB in size. 
    - Applies to Table Storage and Azure Function 
  - BATCH_SIZE:  
    This represents the number of transactions for table storage where the maximum can go up to 100 records. For Azure Functions, this represents the batch   size in bytes sent to the function per call - default is 256 kB. 
    - Applies to Table Storage and Azure Function 
  - MAXIMUM_BATCH_COUNT:  
    Maximum number of events sent to the function per call for Azure function - default is 100. For SQL Database, this represents the maximum number of   records sent with every bulk insert transaction - default is 10,000. 
    - Applies to SQL Database and Azure function 
  - STAGING_AREA: EXTERNAL DATA SOURCE object to Blob Storage 
    The staging area for high-throughput data ingestion into SQL Data Warehouse 
    - Applies to SQL Data Warehouse


## Examples

### Example 1 - EdgeHub

Type: Input or Output<br>
Parameters:
- Input or Output
  - Alias 
  - Event serialization format 
  - Encoding 
- Input only: 
  - Event compression type 

Syntax:

```sql
CREATE EXTERNAL DATA SOURCE MyEdgeHub 
WITH  
(      
  LOCATION = 'edgehub://'       
); 
 
CREATE EXTERNAL FILE FORMAT myFileFormat  
WITH (  
   FORMAT_TYPE = 'JSON', 
); 
 
CREATE EXTERNAL STREAM Stream_A  
WITH    
(   
   DATA_SOURCE = MyEdgeHub, 
   EXTERNAL_FILE_FORMAT = myFileFormat, 
   LOCATION = ‘<mytopicname>’, 
   OUTPUT_OPTIONS =   
     ‘REJECT_TYPE: Drop’ 
);
```


### Example 2 - Azure SQL Database, Azure SQL Edge, SQL Server

Type: Output<br>
Parameters:
- Output alias  
- Database (required for SQL Database) 
- Server (required for SQL Database) 
- Username (required for SQL Database) 
- Password (required for SQL Database) 
- Table 
- Merge all input partitions into a single write or Inherit partition scheme of previous query step or input (required for SQL Database) 
- Max batch count 

Syntax:

```sql
CREATE DATABASE SCOPED CREDENTIAL SQLCredName 
WITH IDENTITY = '<user>’, 
SECRET = '<password>'; 
 
-- Azure SQL Database 
CREATE EXTERNAL DATA SOURCE MyTargetSQLTabl 
WITH 
(     
  LOCATION = ' <my_server_name>.database.windows.net’, 
  CREDENTIAL = SQLCredName 
); 
 
--SQL Server or Azure SQL Edge
CREATE EXTERNAL DATA SOURCE MyTargetSQLTabl 
WITH 
(     
  LOCATION = ' <sqlserver://<ipaddress>,<port>’, 
  CREDENTIAL = SQLCredName 
); 
 
--SQL Database/Edge 
CREATE EXTERNAL STREAM Stream_A 
WITH   
(  
    DATA_SOURCE = MyTargetSQLTable, 
    LOCATION = ‘<DatabaseName>.<SchemaName>.<TableName>’ 
   --Note: If table is container in the database, <TableName> should be sufficient 
   --Note: Do not need external file format in this case 
    EXTERNAL_FILE_FORMAT = myFileFormat,  
    OUTPUT_OPTIONS =  
      ‘REJECT_TYPE: Drop 
); 
```

### Example 3 - Kafka

Type: Input<br>
Parameters:

- Kafka bootstrap server 
- Kafka topic name 
- Source partition count 

Syntax:

```sql
CREATE EXTERNAL DATA SOURCE MyKafka_tweets 
WITH 
( 
  --The location maps to KafkaBootstrapServer 
  LOCATION = ' kafka://<kafkaserver>:<ipaddress>’, 
  CREDENTIAL = kafkaCredName 
 
); 
 
CREATE EXTERNAL FILE FORMAT myFileFormat 
WITH ( 
    FORMAT_TYPE = 'CSV', 
    DATA_COMPRESSION = 'GZIP', 
    ENCODING = ‘UTF-8’, 
    DELIMITER = ‘|’ 
); 
 
 
CREATE EXTERNAL STREAM Stream_A (user_id VARCHAR, tweet VARCHAR) 
WITH   
(  
    DATA_SOURCE = MyKafka_tweets, 
    LOCATION = ‘<KafkaTopicName>’, 
   --JSON: Format, CSV: Delimiter and Encoding, AVRO: None 
    EXTERNAL_FILE_FORMAT = myFileFormat,  
    INPUT_OPTIONS =  
      ‘PARTITIONS: 5’ 
); 
```

### Example 4 - Blob storage

Type: Input or Output<br>
Parameters:
- Input or Output:
  - Alias 
  - Storage account 
  - Storage account key 
  - Container 
  - Path pattern 
  - Date format 
  - Time format 
  - Event serialization format 
  - Encoding 
- Input only: 
  - Partitions (input) 
  - Event compression type (input) 
- Output only: 
  - Minimum rows (output) 
  - Maximum time (output) 
  - Authentication mode (output) 

Syntax:

```sql
CREATE DATABASE SCOPED CREDENTIAL StorageAcctCredName 
WITH IDENTITY = 'Shared Access Signature’, 
SECRET = 'AccountKey'; 
 
CREATE DATABASE SCOPED CREDENTIAL StorageAcctCredNameMSI 
WITH IDENTITY = 'Managed Identity’; 
 
CREATE EXTERNAL DATA SOURCE MyBlobStorage_tweets 
WITH 
(     
  LOCATION = 'sb://my-sb-namespace.servicebus.windows.net’, 
  CREDENTIAL = eventHubCredName 
); 
 
CREATE EXTERNAL FILE FORMAT myFileFormat 
WITH ( 
    FORMAT_TYPE = 'CSV', --Event serialization format 
    DATE_FORMAT = 'YYYY/MM/DD HH', --Both Date and Time format 
    ENCODING = ‘UTF-8’ 
); 
 
CREATE EXTERNAL STREAM Stream_A (user_id VARCHAR, tweet VARCHAR) 
WITH   
(  
    DATA_SOURCE = MyBlobStorage_tweets, 
    LOCATION = ‘<path_pattern>’, 
    EXTERNAL_FILE_FORMAT = myFileFormat,  
    INPUT_OPTIONS =  
      ‘PARTITIONS: 1’, 
  
    OUTPUT_OPTIONS =  
      ‘REJECT_TYPE: Drop, 
      PARTITION_KEY_COLUMN: , 
      PROPERTY_COLUMNS: (), 
      MINUMUM_ROWS: 100000, 
      MAXIMUM_TIME: 60’ 
); 
```

### Example 5 - Event Hub

Type: Input or Output<br>
Parameters:
- Input or Output:
  - Alias 
  - Service Bus namespace 
  - Event Hub name 
  - Event Hub policy name 
  - Event Hub policy key 
  - Event serialization format 
  - Encoding 
- Input only: 
  - Event Hub consumer group 
  - Event compression type 
- Output only: 
  - Partition key column 
  - Property columns 

Syntax:

```sql
CREATE DATABASE SCOPED CREDENTIAL eventHubCredName 
WITH IDENTITY = 'Shared Access Signature’, 
SECRET = '<policyName>'; 
 
CREATE EXTERNAL DATA SOURCE MyEventHub_tweets 
WITH 
(     
  LOCATION = 'sb://my-sb-namespace.servicebus.windows.net’, 
  CREDENTIAL = eventHubCredName 
); 
 
CREATE EXTERNAL FILE FORMAT myFileFormat 
WITH ( 
    FORMAT_TYPE = 'CSV', 
    DATA_COMPRESSION = 'GZIP', 
    ENCODING = ‘UTF-8’, 
    DELIMITER = ‘|’ 
); 
 
 
CREATE EXTERNAL STREAM Stream_A (user_id VARCHAR, tweet VARCHAR) 
WITH   
(  
    DATA_SOURCE = MyEventHub_tweets, 
    LOCATION = ‘<topicname>’, 
   --JSON: Format, CSV: Delimiter and Encoding, AVRO: None 
    EXTERNAL_FILE_FORMAT = myFileFormat,  
 
    INPUT_OPTIONS =  
      ‘CONSUMER_GROUP: FirstConsumerGroup’, 
          
    OUTPUT_OPTIONS =  
      ‘REJECT_TYPE: Drop, 
      PARTITION_KEY_COLUMN: , 
      PROPERTY_COLUMNS: ()’ 
);
```

### Example 6 - IOT Hub

Type: Input<br>
Parameters:

- Input alias 
- IoT Hub 
- Endpoint 
- Shared access policy name 
- Shared access policy key 
- Consumer group 
- Event serialization format 
- Encoding 
- Event compression type 

Syntax:

```sql
CREATE DATABASE SCOPED CREDENTIAL IoTHubCredName 
WITH IDENTITY = 'Shared Access Signature’, 
SECRET = '<policyName>'; 
 
CREATE EXTERNAL DATA SOURCE MyIoTHub_tweets 
WITH 
(     
  LOCATION = ' iot://iot_hub_name.azure-devices.net’, 
  CREDENTIAL = IoTHubCredName 
);	

CREATE EXTERNAL FILE FORMAT myFileFormat 
WITH ( 
    FORMAT_TYPE = 'CSV', --Event serialization format 
    DATA_COMPRESSION = 'GZIP', 
    ENCODING = ‘UTF-8’ 
); 
 
CREATE EXTERNAL STREAM Stream_A (user_id VARCHAR, tweet VARCHAR) 
WITH   
(  
    DATA_SOURCE = MyIoTHub_tweets, 
    LOCATION = ‘<name>’, 
    EXTERNAL_FILE_FORMAT = myFileFormat,  
    INPUT_OPTIONS =  
      ‘ENDPOINT: Messaging, 
      CONSUMER_GROUP: ‘FirstConsumerGroup’ 
); 
```

### Example 7 - Azure Synapse Analytics (formerly SQL Data Warehouse)

Type: Output<br>
Parameters:
- Output alias 
- Database 
- Server 
- Username 
- Password 
- Table 
- Staging area (for COPY) 

Syntax:

```sql
CREATE DATABASE SCOPED CREDENTIAL SQLCredName 
WITH IDENTITY = '<user>’, 
SECRET = '<password>'; 
 
CREATE EXTERNAL DATA SOURCE MyTargetSQLTable 
WITH 
(     
  LOCATION = ' <my_server_name>.database.windows.net’, 
  CREDENTIAL = SQLCredName 
); 
 
CREATE EXTERNAL STREAM MySQLTableOutput 
WITH ( 
   DATA_SOURCE = MyTargetSQLTable, 
   LOCATION = ‘<TableName>’ 
   --Note: Do not need external file format in this case 
   OUTPUT_OPTIONS =  
     ‘REJECT_TYPE: Drop, 
     STAGING_AREA: staging_area_data_source’, 
); 
```


### Example 8 - Table storage

Type: Output<br>
Parameters:
- Output alias 
- Storage account 
- Storage account key 
- Table name 
- Partition key 
- Row key 
- Batch size 

Syntax:

```sql
CREATE DATABASE SCOPED CREDENTIAL TableStorageCredName 
WITH IDENTITY = ‘Storage account Key’, 
SECRET = '<storage_account_key>'; 
 
CREATE EXTERNAL DATA SOURCE MyTargetTableStorage 
WITH 
(     
  LOCATION = 'abfss://<storage_account>.dfs.core.windows.net’, 
  CREDENTIAL = TableStorageCredName 
); 
 
CREATE EXTERNAL STREAM MyTargetTableStorageOutput 
WITH ( 
   DATA_SOURCE = MyTargetTableStorage, 
   LOCATION = ‘<TableName>’, 
   OUTPUT_OPTIONS =  
     ‘REJECT_TYPE: Drop, 
     PARTITION_KEY: <column_partition_key>, 
     ROW_KEY: <column_row_key>, 
     BATCH_SIZE: 100’ 
); 
```


### Example 9 - Service Bus Topic (same properties as queue)

Type: Output<br>
Parameters:
- Output alias 
- Service Bus namespace 
- Topic name 
- Topic policy name 
- Topic policy key 
- Property columns 
- System Property columns 
- Event serialization format 
- Encoding 

Syntax:

```sql
CREATE DATABASE SCOPED CREDENTIAL serviceBusCredName 
WITH IDENTITY = 'Shared Access Signature’, 
SECRET = '<policyName>'; 
 
CREATE EXTERNAL DATA SOURCE MyServiceBus_tweets 
WITH 
(     
  LOCATION = 'sb://my-sb-namespace.servicebus.windows.net’, 
  CREDENTIAL = serviceBusCredName 
); 
 
CREATE EXTERNAL FILE FORMAT myFileFormat 
WITH ( 
    FORMAT_TYPE = 'CSV', --Event serialization format 
    DATA_COMPRESSION = 'GZIP', 
    ENCODING = ‘UTF-8’ 
); 
 
CREATE EXTERNAL STREAM MyServiceBusOutput 
WITH ( 
   DATA_SOURCE = MyServiceBus_tweets, 
   LOCATION = ‘<topic_name>’, 
   EXTERNAL_FILE_FORMAT = myFileFormat 
       OUTPUT_OPTIONS =  
     ‘REJECT_TYPE: Drop, 
     PARTITION_KEY_COLUMN: , 
     PROPERTY_COLUMNS: (), 
     SYSTEM_PROPERTY_COLUMNS: ()’ 
   --JSON: Format, CSV: Delimiter and Encoding, AVRO: None 
           
); 
```


### Example 10 - Cosmos DB

Type: Output<br>
Parameters:
- Output alias 
- Account ID 
- Account key 
- Database 
- Container name 
- Document ID 


Syntax:

```sql
CREATE DATABASE SCOPED CREDENTIAL cosmosDBCredName 
WITH IDENTITY = ‘Storage Account Key’, 
SECRET = '<accountKey>'; 
 
CREATE EXTERNAL DATA SOURCE MyCosmosDB_tweets 
WITH 
(     
  LOCATION = ' cosmosdb://accountid.documents.azure.com:443/ database’, 
  CREDENTIAL = cosmosDBCredName 
); 
 
CREATE EXTERNAL STREAM MyCosmosDBOutput 
WITH ( 
   DATA_SOURCE = MyCosmosDB_tweets, 
   LOCATION = ‘<container/documentID>’ 
   OUTPUT_OPTIONS =  
     ‘REJECT_TYPE: Drop', 
     --Note: Do not need external file format in this case 
          
);
```



### Example 11 - Power BI

Type: Output<br>
Parameters:
- Output alias 
- Dataset name 
- Table name 


Syntax:

```sql
CREATE DATABASE SCOPED CREDENTIAL PBIDBCredName 
WITH IDENTITY = ‘Managed Identity’; 
 
CREATE EXTERNAL DATA SOURCE MyPbi_tweets 
WITH 
( 
  LOCATION = 'pbi://dataset/’, 
  CREDENTIAL = PBIDBCredName 
 
); 
 
CREATE EXTERNAL STREAM MyPbiOutput 
WITH ( 
   DATA_SOURCE = MyPbi_tweets, 
   LOCATION = 'tableName', 
   OUTPUT_OPTIONS =  
     ‘REJECT_TYPE: Drop' 
        
);
```

### Example 12 - Azure function

Type: Output<br>
Parameters:
- Function app 
- Function 
- Key 
- Max batch size 
- Max batch count 

Syntax:

```sql
CREATE DATABASE SCOPED CREDENTIAL AzureFunctionCredName 
WITH IDENTITY = ‘Function Key’, 
SECRET = '<function_key>'; 
 
CREATE EXTERNAL DATA SOURCE MyTargetTableStorage 
WITH 
(     
  LOCATION = 'abfss://<storage_account>.dfs.core.windows.net’, 
  CREDENTIAL = TableStorageCredName 
); 
 
CREATE EXTERNAL STREAM MyTargetTableStorageOutput 
WITH ( 
   DATA_SOURCE = MyTargetTableStorage, 
   LOCATION = ‘<TableName>’, 
   OUTPUT_OPTIONS =  
     ‘REJECT_TYPE: 'Drop'      
     PARTITION_KEY: ‘<column_partition_key>, 
     ROW_KEY: <column_row_key>, 
     BATCH_SIZE: 100’ 
); 
```


## See also

- [ALTER EXTERNAL STREAM (Transact-SQL)](alter-external-stream-transact-sql.md) 
- [DROP EXTERNAL STREAM (Transact-SQL)](drop-external-stream-transact-sql.md) 

