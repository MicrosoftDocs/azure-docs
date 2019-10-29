---
title: Querying Spark tables using SQL Analytics on-demand
description: Describes querying Spark tables using SQL Analytics on-demand
services: synapse-analytics 
author: julieMSFT
ms.service: synapse-analytics 
ms.topic: overview
ms.subservice:
ms.date: 10/17/2019
ms.author: jrasnick
ms.reviewer: jrasnick
---

# Querying Spark tables
SQL Analytics on-demand can synchronize metadata from Spark automatically. SQL Analytics on-demand database will be created for each database existing in Spark. For each Spark table, there will be external table created in SQL Analytics on-demand database. This way you can shut down your Spark cluster and still query Spark tables from SQL Analytics on-demand.

When table is partitioned in Spark, files in storage are organized by folders. SQL Analytics on-demand will utilize partitioning metadata and target only folders and files relevant for your query.

Metadata synchronization is automatically configured for each Spark pool provisioned in the Azure Synapse workspace. You can start querying Spark tables instantly.

Each Spark table is represented with external table in dbo schema in corresponding SQL Analytics on-demand database. To query Spark table spark_table from db Spark database, run query that targets spark_table external table. Before running example below, make sure you have appropriate [access to storage account](development-storage-files-storage-access-control.md) where files reside. Example:

```sql
SELECT * FROM [db].dbo.[spark_table]
```

## Connecting SQL Analytics on-demand to additional Spark instances

Metadata synchronization is automatically configured for each Spark pool provisioned in the Azure Synapse workspace. Further, you can control metadata synchronization using stored procedures below.

- **sp_metadata_sync_connector_add**
  Initiates connector to Spark for metadata synchronization.
- **sp_metadata_sync_connectors_status**
  Returns connectors statuses.
- **sp_metadata_sync_connector_drop**
  Stops synchronization and drops connector to Spark from SQL Analytics on-demand.



### sp_metadata_sync_connector_add

Initiate connection to Spark for metadata synchronization.

#### Syntax

```
sp_metadata_sync_connector_add [ @unique_name = ] 'connector_name'
	, [ @type = ] 'Spark'
	, [ @jdbc_connection_url = ] 'jdbc_connection_url'
	, [ @driver_name = ] 'com.microsoft.sqlserver.jdbc.SQLServerDriver'
	, [ @username = ] 'metastore_username'
	, [ @password = ] 'metastore_password'
	[ , [ @max_retry_count = ] max_retry_count ]
	[ , [ @retry_interval_ms = ] retry_interval_ms ]
	[ , [ @sql_command_timeout_sec = ] sql_command_timeout_sec ]
	[ , [ @sync_interval_sec = ] sync_interval_sec ]
	[ , [ @mappings_json = ] mappings_json ]
```

#### Arguments

[ @type = ] 'Spark'

Specifies type of connector to be used. Currently only Spark is supported.

[ @jdbc_connection_url = ] 'jdbc_connection_url'

JDBC connection url for Spark pool database. Example: 

```
jdbc:sqlserver://mdsyncmetastoreserver.database.windows.net;database=MdSyncMetastore;encrypt=true;trustServerCertificate=true;create=false;loginTimeout=300
```

[ @driver_name = ] 'com.microsoft.sqlserver.jdbc.SQLServerDriver'

Driver used to connect to metastore. Currently only SQLServerDriver is supported.

[ @username = ] 'metastore_username'

Username that connector will use to access metastore.

[ @password = ] 'metastore_password'

Password that connector will use to access metastore.

[ , [ @max_retry_count = ] max_retry_count ]

Number of retries that connector will attempt to make If there is connection error. Default is 3 and cannot be changed at this time. Provided argument value will be ignored at this moment.

[ , [ @retry_interval_ms = ] retry_interval_ms ]

Number of milliseconds between retries. Default is 200. Provided argument value will be ignored at this moment.

[ , [ @sql_command_timeout_sec = ] sql_command_timeout_sec ]

Number of seconds until command timeouts. Default is 60. Provided argument value will be ignored at this moment.

[ , [ @sync_interval_sec = ] sync_interval_sec ]

Number of seconds between two synchronizations. Default is 20. Provided argument value will be ignored at this moment.

[ , [ @mappings_json = ] mappings_json]

Argument is not used at this moment. Provided argument value will be ignored.

#### Result set

No result set. Error will be provided if operation fails.

#### Example

Following example adds connector for Spark with metastore server *mymetastoreserver* and database name *metastore*. It will initiate metadata sync synchronization.

```sql
exec sys.sp_metadata_sync_connector_add 
	@unique_name = 'ConnectorForMYSpark',
	@type = 'Spark',
	@jdbc_connection_url = 'jdbc:sqlserver://mymetastoreserver.database.windows.net;database=metastore;encrypt=true;trustServerCertificate=true;create=false;loginTimeout=300',
	@driver_name = 'com.microsoft.sqlserver.jdbc.SQLServerDriver',
	@username = 'MetastoreUsername',
	@password = 'MetastorePassword',
```



### sp_metadata_sync_connectors_status

Returns metadata synchronization connectors state.

#### Syntax

```
sp_metadata_sync_connectors_status [ @unique_name = 'connector_name' ]
```

#### Arguments

[ @unique_name = 'connector_name' ]

If specified, state of specified connector will be returned. When not specified, states of all available connectors will be returned.

#### Result set

Returns row per connector:

| Column name     | Data type     | Description                                                  |
| --------------- | ------------- | ------------------------------------------------------------ |
| UniqueName      | varchar(max)  | Connector name                                               |
| LogDate         | datetime      | Last synchronization date and time                           |
| ConnectorStatus | nvarchar(max) | Connector status:<br />CREATED<br />FAILED TO DROP<br />UPDATED<br />FAILED TO UPDATE<br />empty value - create or drop connector operation is in progress |
| SyncStatus      | nvarchar(max) | Last synchronization status:<br />SUCCEEDED<br />FAILED<br />empty value - synchronization is in progress |
| Message         | nvarchar(max) | Error message describing error during synchronization if any. Blank if no error occurred. |

#### Example

Following example shows all connectors.

```sql
exec sys.sp_metadata_sync_connectors_status
```

Following example shows connector with name 

```sql
exec sys.sp_metadata_sync_connectors_status @unique_name = 'ConnectorForMYSpark'
```



### sp_metadata_sync_connector_drop

Stops synchronization for specified connector and drops it.

#### Syntax

```
sp_metadata_sync_connector_drop { @unique_name = 'connector_name' }
```

#### Arguments

{ @unique_name = 'connector_name' }

Specified connector will be dropped and synchronization will stop.

#### Result set

No result set. Error will be provided if operation fails.

#### Example

Following example stops synchronization for specified connector and drops it.

```sql
exec sys.sp_metadata_sync_connector_drop @unique_name = 'ConnectorForMYSpark'
```

