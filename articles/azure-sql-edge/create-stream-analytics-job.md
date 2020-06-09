---
title: Create a T-SQL Streaming job in Azure SQL Edge (Preview) 
description: Learn about creating Stream Analytics jobs in Azure SQL Edge (Preview) 
keywords: 
services: sql-edge
ms.service: sql-edge
ms.topic: conceptual
author: SQLSourabh
ms.author: sourabha
ms.reviewer: sstein
ms.date: 05/19/2020
---

# Create Stream Analytics job in Azure SQL Edge (Preview) 

This article explains how to create a T-SQL Streaming job in Azure SQL Edge (Preview). To create a streaming job in SQL Edge, the following steps are needed

1. Create the external stream input and output objects
2. Define the streaming job query as part of the streaming job creation.

> [!NOTE]
> To enable the T-SQL Streaming feature in Azure SQL Edge, enable TF 11515 as a startup option, or use the [DBCC TRACEON]( https://docs.microsoft.com/sql/t-sql/database-console-commands/dbcc-traceon-transact-sql) command. For more information on how to enable trace flags using mssql.conf file, see [Configure using an mssql.conf file](configure.md#configure-by-using-an-mssqlconf-file). This requirement will be removed in future updates of Azure SQL Edge (Preview).

## Configure an External Stream Input and Output object

T-SQL Streaming makes use of the external data source functionality of SQL Server to define the data sources associated with the external stream inputs and outputs of the streaming job. The following T-SQL commands are required to create an external stream input or output object.

[CREATE EXTERNAL FILE FORMAT (Transact-SQL)](https://docs.microsoft.com/sql/t-sql/statements/create-external-file-format-transact-sql)

[CREATE EXTERNAL DATA SOURCE (Transact-SQL)](https://docs.microsoft.com/sql/t-sql/statements/create-external-data-source-transact-sql)

[CREATE EXTERNAL STREAM (Transact-SQL)](#example-create-an-external-stream-object-sql-database)

Additionally, in case of SQL Edge (or SQL Server, Azure SQL) being used as an output stream, the [CREATE DATABASE SCOPED CREDENTIAL (Transact-SQL)](https://docs.microsoft.com/sql/t-sql/statements/create-database-scoped-credential-transact-sql) T-SQL command is required to define the credentials to access SQL database.

### Supported Input and Output stream data sources

Azure SQL Edge currently only supports the following data sources as stream inputs and outputs.

| Data Source Type | Input | Output | Description |
|------------------|-------|--------|------------------|
| Azure IoT Edge Hub | Y | Y | Data Source to read/write streaming data to an Azure IoT Edge Hub. For more information on Azure IoT Edge Hub, refer [IoT Edge Hub](https://docs.microsoft.com/azure/iot-edge/iot-edge-runtime#iot-edge-hub)|
| SQL Database | N | Y | Data source connection to write streaming data to SQL Database. The SQL Database can be a local SQL Edge database or a remote SQL Server or Azure SQL Database|
| Azure Blob Storage | N | Y | Data source to write data to a blob on an Azure storage account. |
| Kafka | Y | N | Data source to read streaming data from a Kafka topic. This adapter is currently only available for Intel/AMD version of Azure SQL Edge and is not available for the ARM64 version of SQL Edge.|

### Example: Create an External Stream Input/Output object for Azure IoT Edge Hub

The example below creates an external stream object for the Edge Hub. To create an external stream input/output data source for Azure IoT Edge Hub, you first need to create an External File Format for SQL to understand the layout of the data being read/written too.

1. Create an External File Format with format type of JSON.

    ```sql
    Create External file format InputFileFormat
    WITH (  
       format_type = JSON,
    )
    go
    ```

2. Create a External Data Source for the IoT Edge Hub. The T-SQL script below create a data source connection to an Edge hub running on the same docker host as SQL Edge.

    ```sql
    CREATE EXTERNAL DATA SOURCE EdgeHubInput WITH (
    LOCATION = 'edgehub://'
    )
    go
    ```

3. Create the External Stream object for the IoT Edge Hub. T-SQL Script below create a stream object for the Edge Hub. In case of an Edge hub stream object, the LOCATION parameter is the name of the edge hub topic/channel being read or written to.

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

### Example: Create an external stream object SQL Database

The example below creates an external stream object to the local SQL Edge database. 

1. Create a master key on the database. This is required to encrypt the credential secret.

    ```sql
    CREATE MASTER KEY ENCRYPTION BY PASSWORD = '<<Strong_Password_For_Master_Key_Encryption>>';
    ```

2. Create a database scoped credential for accessing the SQL Server source. The following example creates a credential to the external data source with IDENTITY = 'username' and SECRET = 'password'.

    ```sql
    CREATE DATABASE SCOPED CREDENTIAL SQLCredential
    WITH IDENTITY = '<SQL_Login>', SECRET = '<SQL_Login_PASSWORD>'
    go
    ```

3. Create an external data source with CREATE EXTERNAL DATA SOURCE. The following example:

    * Creates an external data source named LocalSQLOutput
    * Identifies the external data source (LOCATION = '<vendor>://<server>[:<port>]'). In the example it points to a local instance of SQL Edge.
    * Finally, the example uses the credential created previously.

    ```sql
    CREATE EXTERNAL DATA SOURCE LocalSQLOutput WITH (
    LOCATION = 'sqlserver://tcp:.,1433'
    ,CREDENTIAL = SQLCredential
    )
    go
    ```

4. Create the External Stream object. The example below creates an external stream object pointing to a table *dbo.TemperatureMeasurements* in the database *MySQLDatabase*.

    ```sql
    CREATE EXTERNAL STREAM TemperatureMeasurements WITH (
    DATA_SOURCE = LocalSQLOutput,
    LOCATION = N'MySQLDatabase.dbo.TemperatureMeasurements',
    INPUT_OPTIONS = N'',
    OUTPUT_OPTIONS = N''
    )
    ```

## Create the Streaming job and the streaming queries

Use the **sys.sp_create_streaming_job** system stored procedure to define the streaming queries and create the streaming job. The **sp_create_streaming_job** stored procedure takes two parameters

- job_name - Name of the streaming job. Streaming job names are unique across the instance.
- statement - [Stream Analytics Query Language](https://docs.microsoft.com/stream-analytics-query/stream-analytics-query-language-reference?) based streaming query statements.

The example below create a simple streaming job with one streaming query. This query reads the inputs from the Edge Hub and write to the *dbo.TemperatureMeasurements* in the database.

```sql
EXEC sys.sp_create_streaming_job @name=N'StreamingJob1',
@statement= N'Select * INTO TemperatureMeasurements from MyEdgeHubInput'
```

The example below creates a more complex streaming job with multiple different queries, including a query which uses the in-built AnomalyDetection_ChangePoint function to identify anomalies in the temperature data.

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

## Start, Stop, drop and monitor Streaming jobs

To start a streaming job in SQL Edge, execute the **sys.sp_start_streaming_job** stored procedure. The stored procedure requires the same of the streaming job to start, as input.

```sql
exec sys.sp_start_streaming_job @name=N'StreamingJob1'
go
```

To stop a streaming job in SQL Edge, execute the **sys.sp_stop_streaming_job** stored procedure. The stored procedure requires the same of the streaming job to stop, as input.

```sql
exec sys.sp_stop_streaming_job @name=N'StreamingJob1'
go
```

To drop (or delete) a streaming job in SQL Edge, execute the **sys.sp_drop_streaming_job** stored procedure. The stored procedure requires the same of the streaming job to drop, as input.

```sql
exec sys.sp_drop_streaming_job @name=N'StreamingJob1'
go
```

To get the current status of a streaming job in SQL Edge, execute the **sys.sp_get_streaming_job** stored procedure. The stored procedure requires the same of the streaming job to drop, as input and outputs the name and the current status of the streaming job.

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

The streaming job can be in any one of the following statuses

| Status | Description |
|--------| ------------|
| Created | The streaming job was created, but has not yet been started |
| Starting | The streaming job is in the starting phase |
| Idle | The streaming job is running, however there is no input to process |
| Processing | The streaming job is running, and is processing inputs. This state indicates a healthy state for the streaming job |
| Degraded | The streaming job is running, however there were some non-fatal input/output serialization/de-serialization errors during input processing. The input job will continue to run, but will drop inputs which encounter errors |
| Stopped | The streaming job has been stopped |
| Failed | The streaming job Failed. This is generally an indication of a fatal error during processing |

## Next Steps

- [View metadata associated with streaming jobs in Azure SQL Edge (Preview)](streaming-catalog-views.md) 
- [Create an External Stream](create-external-stream-transact-sql.md)
