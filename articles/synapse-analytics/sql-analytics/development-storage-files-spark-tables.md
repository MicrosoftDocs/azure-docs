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
SQL Analytics on-demand can synchronize metadata from Spark automatically. A SQL Analytics on-demand database will be created for each database existing in Spark. For each Spark table, there will be external table created in the SQL Analytics on-demand database. As such, you can shut down your Spark cluster and still query Spark tables from SQL Analytics on-demand.

When a table is partitioned in Spark, files in storage are organized by folders. SQL Analytics on-demand will utilize partitioning metadata and target only folders and files relevant for your query.

Metadata synchronization is automatically configured for each Spark pool provisioned in the Azure Synapse workspace. You can start querying Spark tables instantly.

Each Spark table is represented with an external table in a dbo schema that corresponds to a SQL Analytics on-demand database. To query a Spark table (spark_table) from a db Spark database, run a query that targets a spark_table external table. Before running the example below, make sure you have the appropriate [access to storage account](development-storage-files-storage-access-control.md) where the files reside. Example:

```sql
SELECT * FROM [db].dbo.[spark_table]
```

## Connecting SQL Analytics on-demand to additional Spark instances

Metadata synchronization is automatically configured for each Spark pool provisioned in the Azure Synapse workspace. Furthermore, you can control metadata synchronization by using the stored procedures below:

- **sp_metadata_sync_connector_add**
  Initiates the connector to Spark for metadata synchronization.
- **sp_metadata_sync_connectors_status**
  Returns connectors statuses.
- **sp_metadata_sync_connector_drop**
  Stops synchronization and drops connector to Spark from SQL Analytics on-demand.



### sp_metadata_sync_connector_add

Initiates the connection to Spark for metadata synchronization.

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

Specifies the type of connector to be used. Currently, only Spark is supported.

[ @jdbc_connection_url = ] 'jdbc_connection_url'

JDBC connection url for Spark pool database. Example: 

```
jdbc:sqlserver://mdsyncmetastoreserver.database.windows.net;database=MdSyncMetastore;encrypt=true;trustServerCertificate=true;create=false;loginTimeout=300
```

[ @driver_name = ] 'com.microsoft.sqlserver.jdbc.SQLServerDriver'

Driver used to connect to the metastore. Currently, only SQLServerDriver is supported.

[ @username = ] 'metastore_username'

Username that the connector will use to access the metastore.

[ @password = ] 'metastore_password'

Password that the connector will use to access the metastore.

[ , [ @max_retry_count = ] max_retry_count ]

Number of retries that connector will attempt to make If there is a connection error. The default is 3 and cannot be changed at this time. Provided argument value will be ignored at this time.

[ , [ @retry_interval_ms = ] retry_interval_ms ]

Number of milliseconds between retries. The default is 200. Provided argument value will be ignored at this time.

[ , [ @sql_command_timeout_sec = ] sql_command_timeout_sec ]

Number of seconds until command timeouts. The default is 60. Provided argument value will be ignored at this time.

[ , [ @sync_interval_sec = ] sync_interval_sec ]

Number of seconds between two synchronizations. The default is 20. Provided argument value will be ignored at this time.

[ , [ @mappings_json = ] mappings_json]

Argument is not used at this time. Provided argument value will be ignored.

#### Result set

No result set. An error will be provided if the operation fails.

#### Example

The following example adds a connector for Spark with the metastore server *mymetastoreserver* and database name *metastore*. It will initiate a metadata sync synchronization.

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

If specified, the state of the specific connector will be returned. When not specified, the states of all available connectors will be returned.

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

The following example shows all connectors.

```sql
exec sys.sp_metadata_sync_connectors_status
```

The following example shows a connector with a name. 

```sql
exec sys.sp_metadata_sync_connectors_status @unique_name = 'ConnectorForMYSpark'
```



### sp_metadata_sync_connector_drop

Stops synchronization for a specified connector and drops it.

#### Syntax

```
sp_metadata_sync_connector_drop { @unique_name = 'connector_name' }
```

#### Arguments

{ @unique_name = 'connector_name' }

The specified connector will be dropped and synchronization will stop.

#### Result set

No result set. An error will be provided if the operation fails.

#### Example

The following example stops synchronization for a specified connector and drops it.

```sql
exec sys.sp_metadata_sync_connector_drop @unique_name = 'ConnectorForMYSpark'
```



## Next steps

Advance to the next article to learn more about storage access control.
> [!div class="nextstepaction"]
> [Storage Access Control](development-storage-files-storage-access-control.md)
