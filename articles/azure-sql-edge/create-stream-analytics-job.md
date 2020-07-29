---
title: Create a T-SQL streaming job in Azure SQL Edge (Preview) 
description: Learn about creating Stream Analytics jobs in Azure SQL Edge (Preview). 
keywords: 
services: sql-edge
ms.service: sql-edge
ms.topic: conceptual
author: SQLSourabh
ms.author: sourabha
ms.reviewer: sstein
ms.date: 05/19/2020
---

# Create an Azure Stream Analytics job in Azure SQL Edge (Preview) 

This article explains how to create a T-SQL streaming job in Azure SQL Edge (Preview). You create the external stream input and output objects, and then you define the streaming job query as part of the streaming job creation.

> [!NOTE]
> To enable the T-SQL streaming feature in Azure SQL Edge, enable TF 11515 as a startup option, or use the [DBCC TRACEON]( https://docs.microsoft.com/sql/t-sql/database-console-commands/dbcc-traceon-transact-sql) command. For more information on how to enable trace flags by using an mssql.conf file, see [Configure using an mssql.conf file](configure.md#configure-by-using-an-mssqlconf-file).

## Configure the external stream input and output objects

T-SQL streaming uses the external data source functionality of SQL Server to define the data sources associated with the external stream inputs and outputs of the streaming job. Use the following T-SQL commands to create an external stream input or output object:

- [CREATE EXTERNAL FILE FORMAT (Transact-SQL)](https://docs.microsoft.com/sql/t-sql/statements/create-external-file-format-transact-sql)

- [CREATE EXTERNAL DATA SOURCE (Transact-SQL)](https://docs.microsoft.com/sql/t-sql/statements/create-external-data-source-transact-sql)

- [CREATE EXTERNAL STREAM (Transact-SQL)](#example-create-an-external-stream-object-to-azure-sql-database)

Additionally, if Azure SQL Edge, SQL Server, or Azure SQL Database is used as an output stream, you need the [CREATE DATABASE SCOPED CREDENTIAL (Transact-SQL)](https://docs.microsoft.com/sql/t-sql/statements/create-database-scoped-credential-transact-sql). This T-SQL command defines the credentials to access the SQL database.

### Supported input and output stream data sources

Azure SQL Edge currently only supports the following data sources as stream inputs and outputs.

| Data source type | Input | Output | Description |
|------------------|-------|--------|------------------|
| Azure IoT Edge hub | Y | Y | Data source to read and write streaming data to an Azure IoT Edge hub. For more information, see [IoT Edge Hub](https://docs.microsoft.com/azure/iot-edge/iot-edge-runtime#iot-edge-hub).|
| SQL Database | N | Y | Data source connection to write streaming data to SQL Database. The SQL database can be a local database in Azure SQL Edge, or a remote database in SQL Server or Azure SQL Database.|
| Azure Blob storage | N | Y | Data source to write data to a blob on an Azure storage account. |
| Kafka | Y | N | Data source to read streaming data from a Kafka topic. This adapter is currently only available for Intel or AMD versions of Azure SQL Edge. It isn't available for the ARM64 version of Azure SQL Edge.|

### Example: Create an external stream input/output object for Azure IoT Edge hub

The following example creates an external stream object for Azure IoT Edge hub. To create an external stream input/output data source for Azure IoT Edge hub, you first need to create an external file format for the layout of the data being read or written too.

1. Create an external file format of the type JSON.

    ```sql
    Create External file format InputFileFormat
    WITH (  
       format_type = JSON,
    )
    go
    ```

2. Create an external data source for Azure IoT Edge hub. The following T-SQL script creates a data source connection to an IoT Edge hub that runs on the same Docker host as Azure SQL Edge.

    ```sql
    CREATE EXTERNAL DATA SOURCE EdgeHubInput WITH (
    LOCATION = 'edgehub://'
    )
    go
    ```

3. Create the external stream object for Azure IoT Edge hub. The following T-SQL script creates a stream object for the IoT Edge hub. In case of an IoT Edge hub stream object, the LOCATION parameter is the name of the IoT Edge hub topic or channel being read or written to.

    ```sql
    CREATE EXTERNAL STREAM MyTempSensors WITH (
    DATA_SOURCE = EdgeHubInput,
    FILE_FORMAT = InputFileFormat,
    LOCATION = N'TemperatureSensors',
    INPUT_OPTIONS = N'',
    OUTPUT_OPTIONS = N''
    )
    go
    ```

### Example: Create an external stream object to Azure SQL Database

The following example creates an external stream object to the local database in Azure SQL Edge. 

1. Create a master key on the database. This is required to encrypt the credential secret.

    ```sql
    CREATE MASTER KEY ENCRYPTION BY PASSWORD = '<<Strong_Password_For_Master_Key_Encryption>>';
    ```

2. Create a database-scoped credential for accessing the SQL Server source. The following example creates a credential to the external data source, with IDENTITY = username, and SECRET = password.

    ```sql
    CREATE DATABASE SCOPED CREDENTIAL SQLCredential
    WITH IDENTITY = '<SQL_Login>', SECRET = '<SQL_Login_PASSWORD>'
    go
    ```

3. Create an external data source with CREATE EXTERNAL DATA SOURCE. The following example:

    * Creates an external data source named *LocalSQLOutput*.
    * Identifies the external data source (LOCATION = '<vendor>://<server>[:<port>]'). In the example, it points to a local instance of Azure SQL Edge.
    * Uses the credential created previously.

    ```sql
    CREATE EXTERNAL DATA SOURCE LocalSQLOutput WITH (
    LOCATION = 'sqlserver://tcp:.,1433'
    ,CREDENTIAL = SQLCredential
    )
    go
    ```

4. Create the external stream object. The following example creates an external stream object pointing to a table *dbo.TemperatureMeasurements*, in the database *MySQLDatabase*.

    ```sql
    CREATE EXTERNAL STREAM TemperatureMeasurements WITH (
    DATA_SOURCE = LocalSQLOutput,
    LOCATION = N'MySQLDatabase.dbo.TemperatureMeasurements',
    INPUT_OPTIONS = N'',
    OUTPUT_OPTIONS = N''
    )
    ```

## Create the streaming job and the streaming queries

Use the `sys.sp_create_streaming_job` system stored procedure to define the streaming queries and create the streaming job. The `sp_create_streaming_job` stored procedure takes the following parameters:

- `job_name`: The name of the streaming job. Streaming job names are unique across the instance.
- `statement`: [Stream Analytics Query Language](https://docs.microsoft.com/stream-analytics-query/stream-analytics-query-language-reference?)-based streaming query statements.

The following example creates a simple streaming job with one streaming query. This query reads the inputs from the IoT Edge hub, and writes to `dbo.TemperatureMeasurements` in the database.

```sql
EXEC sys.sp_create_streaming_job @name=N'StreamingJob1',
@statement= N'Select * INTO TemperatureMeasurements from MyEdgeHubInput'
```

The following example creates a more complex streaming job with multiple different queries. These queries include one that uses the built-in `AnomalyDetection_ChangePoint` function to identify anomalies in the temperature data.

```sql
EXEC sys.sp_create_streaming_job @name=N'StreamingJob2', @statement=
N' Select * INTO TemperatureMeasurements1 from MyEdgeHubInput1

Select * Into TemperatureMeasurements2 from MyEdgeHubInput2

Select * Into TemperatureMeasurements3 from MyEdgeHubInput3

SELECT
Timestamp as [Time],
[Temperature] As [Temperature],
GetRecordPropertyValue(AnomalyDetection_ChangePoint(Temperature, 80, 1200) OVER(LIMIT DURATION(minute, 20)), ''Score'') as ChangePointScore,
GetRecordPropertyValue(AnomalyDetection_ChangePoint(Temperature, 80, 1200) OVER(LIMIT DURATION(minute, 20)), ''IsAnomaly'') as IsChangePointAnomaly,
INTO TemperatureAnomalies FROM MyEdgeHubInput2;
'
go
```

## Start, stop, drop, and monitor streaming jobs

To start a streaming job in Azure SQL Edge, run the `sys.sp_start_streaming_job` stored procedure. The stored procedure requires the name of the streaming job to start, as input.

```sql
exec sys.sp_start_streaming_job @name=N'StreamingJob1'
go
```

To stop a streaming job, run the `sys.sp_stop_streaming_job` stored procedure. The stored procedure requires the name of the streaming job to stop, as input.

```sql
exec sys.sp_stop_streaming_job @name=N'StreamingJob1'
go
```

To drop (or delete) a streaming job, run the `sys.sp_drop_streaming_job` stored procedure. The stored procedure requires the name of the streaming job to drop, as input.

```sql
exec sys.sp_drop_streaming_job @name=N'StreamingJob1'
go
```

To get the current status of a streaming job, run the `sys.sp_get_streaming_job` stored procedure. The stored procedure requires the name of the streaming job to drop, as input. It outputs the name and the current status of the streaming job.

```sql
exec sys.sp_get_streaming_job @name=N'StreamingJob1'
        WITH RESULT SETS
(
       (
       name nvarchar(256),
       status nvarchar(256)
       )
)
```

The streaming job can have any one of the following statuses:

| Status | Description |
|--------| ------------|
| Created | The streaming job was created, but hasn't yet been started. |
| Starting | The streaming job is in the starting phase. |
| Idle | The streaming job is running, but there's no input to process. |
| Processing | The streaming job is running, and is processing inputs. This state indicates a healthy state for the streaming job. |
| Degraded | The streaming job is running, but there were some non-fatal errors during input processing. The input job will continue to run, but will drop inputs that encounter errors. |
| Stopped | The streaming job has been stopped. |
| Failed | The streaming job failed. This is generally an indication of a fatal error during processing. |

## Next steps

- [View metadata associated with streaming jobs in Azure SQL Edge (Preview)](streaming-catalog-views.md) 
- [Create an external stream](create-external-stream-transact-sql.md)
