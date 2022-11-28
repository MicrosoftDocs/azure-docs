---
title: Update or merge records in Azure SQL Database with Azure Functions
description: This article describes how to use Azure Functions to update or merge records from Azure Stream Analytics to Azure SQL Database
ms.service: stream-analytics
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 12/03/2021
---

# Update or merge records in Azure SQL Database with Azure Functions

Currently, [Azure Stream Analytics](./index.yml) (ASA) only supports inserting (appending) rows to SQL outputs ([Azure SQL Databases](./sql-database-output.md), and [Azure Synapse Analytics](./azure-synapse-analytics-output.md)). This article discusses workarounds to enable UPDATE, UPSERT, or MERGE on SQL databases, with Azure Functions as the intermediary layer.

Alternative options to Azure Functions are presented at the end.

## Requirement

Writing data in a table can generally be done in the following manner:

|Mode|Equivalent T-SQL statement|Requirements|
|-|-|-|
|Append|[INSERT](/sql/t-sql/statements/insert-transact-sql)|None|
|Replace|[MERGE](/sql/t-sql/statements/merge-transact-sql) (UPSERT)|Unique key|
|Accumulate|MERGE (UPSERT) with compound assignment [operator](/sql/t-sql/queries/update-transact-sql#arguments) (`+=`, `-=`...)|Unique key and accumulator|

To illustrate the differences, we can look at what happens when ingesting the following two records:

|Arrival_Time|Device_Id|Measure_Value|
|-|-|-|
|10:00|A|1|
|10:05|A|20|

In **append** mode, we insert the two records. The equivalent T-SQL statement is:

```SQL
INSERT INTO [target] VALUES (...);
```

Resulting in:

|Modified_Time|Device_Id|Measure_Value|
|-|-|-|
|10:00|A|1|
|10:05|A|20|

In **replace** mode, we get only the last value by key. Here we will use **Device_Id as the key.** The equivalent T-SQL statement is:

```SQL
MERGE INTO [target] t
USING (VALUES ...) AS v (Modified_Time,Device_Id,Measure_Value)
ON t.Device_Key = v.Device_Id
-- Replace when the key exists
WHEN MATCHED THEN
    UPDATE SET
        t.Modified_Time = v.Modified_Time,
        t.Measure_Value = v.Measure_Value
-- Insert new keys
WHEN NOT MATCHED BY t THEN
    INSERT (Modified_Time,Device_Key,Measure_Value)
    VALUES (v.Modified_Time,v.Device_Id,v.Measure_Value)
```

Resulting in:

|Modified_Time|Device_Key|Measure_Value|
|-|-|-|
|10:05|A|20|

Finally, in **accumulate** mode we sum `Value` with a compound assignment operator (`+=`). Here also we will use Device_Id as the key:

```SQL
MERGE INTO [target] t
USING (VALUES ...) AS v (Modified_Time,Device_Id,Measure_Value)
ON t.Device_Key = v.Device_Id
-- Replace and/or accumulate when the key exists
WHEN MATCHED THEN
    UPDATE SET
        t.Modified_Time = v.Modified_Time,
        t.Measure_Value += v.Measure_Value
-- Insert new keys
WHEN NOT MATCHED BY t THEN
    INSERT (Modified_Time,Device_Key,Measure_Value)
    VALUES (v.Modified_Time,v.Device_Id,v.Measure_Value)
```

Resulting in:

|Modified_Time|Device_Key|Measure_Value|
|-|-|-|
|10:05|A|**21**|

For **performance** considerations, the ASA SQL database output adapters currently only support append mode natively. These adapters use bulk insert to maximize throughput and limit back pressure.

This article shows how to use Azure Functions to implement Replace and Accumulate modes for ASA. By using a function as an intermediary layer, the potential write performance won't affect the streaming job. In this regard, using Azure Functions will work best with Azure SQL. With Synapse SQL, switching from bulk to row-by-row statements may create greater performance issues.

## Azure Functions Output

In our job, we'll replace the ASA SQL output by the [ASA Azure Functions output](./azure-functions-output.md). The UPDATE, UPSERT, or MERGE capabilities will be implemented in the function.

There are currently two options to access a SQL Database in a function. First is the [Azure SQL output binding](../azure-functions/functions-bindings-azure-sql.md). It's currently limited to C#, and only offers replace mode. Second is to compose a SQL query to be submitted via the appropriate [SQL driver](/sql/connect/sql-connection-libraries) ([Microsoft.Data.SqlClient](https://github.com/dotnet/SqlClient) for .NET).

For both samples below, we'll assume the following table schema. The binding option requires **a primary key** to be set on the target table. It's not necessary, but recommended, when using a SQL driver.

```SQL
CREATE TABLE [dbo].[device_updated](
	[DeviceId] [bigint] NOT NULL, -- bigint in ASA
	[Value] [decimal](18, 10) NULL, -- float in ASA
	[Timestamp] [datetime2](7) NULL, -- datetime in ASA
CONSTRAINT [PK_device_updated] PRIMARY KEY CLUSTERED
(
	[DeviceId] ASC
)
);
```

A function has to meet the following expectations to be used as an [output from ASA](./azure-functions-output.md):

- Azure Stream Analytics expects HTTP status 200 from the Functions app for batches that were processed successfully
- When Azure Stream Analytics receives a 413 ("http Request Entity Too Large") exception from an Azure function, it reduces the size of the batches that it sends to Azure Function
- During test connection, Stream Analytics sends a POST request with an empty batch to Azure Functions and expects HTTP status 20x back to validate the test

## Option 1: Update by key with the Azure Function SQL Binding

This option uses the [Azure Function SQL Output Binding](../azure-functions/functions-bindings-azure-sql.md). This extension can replace an object in a table, without having to write a SQL statement. At this time, it doesn't support compound assignment operators (accumulations).

This sample was built on:

- Azure Functions runtime [version 4](../azure-functions/functions-versions.md?pivots=programming-language-csharp&tabs=in-process%2cv4)
- [.NET 6.0](/dotnet/core/whats-new/dotnet-6)
- Microsoft.Azure.WebJobs.Extensions.Sql [0.1.131-preview](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Sql/0.1.131-preview)

To better understand the binding approach, it's recommended to follow [this tutorial](https://github.com/Azure/azure-functions-sql-extension#quick-start).

First, create a default HttpTrigger function app by following this [tutorial](../azure-functions/create-first-function-vs-code-csharp.md?tabs=in-process). The following information will be used:

- Language: `C#`
- Runtime: `.NET 6` (under function/runtime v4)
- Template: `HTTP trigger`

Install the binding extension by running the following command in a terminal located in the project folder:

```PowerShell
dotnet add package Microsoft.Azure.WebJobs.Extensions.Sql --prerelease
```

Add the `SqlConnectionString` item in the `Values` section of your `local.settings.json`, filling in the connection string of the destination server:

```JSON
{
    "IsEncrypted": false,
    "Values": {
        "AzureWebJobsStorage": "UseDevelopmentStorage=true",
        "FUNCTIONS_WORKER_RUNTIME": "dotnet",
        "SqlConnectionString": "Your connection string"
    }
}
```

Replace the entire function (.cs file in the project) by the following code snippet. Update the namespace, class name, and function name by your own:

```C#
using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Company.Function
{
    public static class HttpTrigger1{
        [FunctionName("HttpTrigger1")]
        public static async Task<IActionResult> Run (
            // http trigger binding
            [HttpTrigger(AuthorizationLevel.Function, "get","post", Route = null)] HttpRequest req,
            ILogger log,
            [Sql("dbo.device_updated", ConnectionStringSetting = "SqlConnectionString")] IAsyncCollector<Device> devices
            )
        {

            // Extract the body from the request
            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            if (string.IsNullOrEmpty(requestBody)) {return new StatusCodeResult(204);} // 204, ASA connectivity check

            dynamic data = JsonConvert.DeserializeObject(requestBody);

            // Reject if too large, as per the doc
            if (data.ToString().Length > 262144) {return new StatusCodeResult(413);} //HttpStatusCode.RequestEntityTooLarge

            // Parse items and send to binding
            for (var i = 0; i < data.Count; i++)
            {
                var device = new Device();
                device.DeviceId = data[i].DeviceId;
                device.Value = data[i].Value;
                device.Timestamp = data[i].Timestamp;

                await devices.AddAsync(device);
            }
            await devices.FlushAsync();

            return new OkResult(); // 200
        }
    }

    public class Device{
        public int DeviceId { get; set; }
        public double Value { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
```

Update the destination table name in the binding section:

```C#
[Sql("dbo.device_updated", ConnectionStringSetting = "SqlConnectionString")] IAsyncCollector<Device> devices
```

Update the `Device` class and mapping section to match your own schema:

```C#
...
                device.DeviceId = data[i].DeviceId;
                device.Value = data[i].Value;
                device.Timestamp = data[i].Timestamp;
...
    public class Device{
        public int DeviceId { get; set; }
        public double Value { get; set; }
        public DateTime Timestamp { get; set; }
```

You can now test the wiring between the local function and the database by debugging (F5 in VS Code). The SQL database needs to be reachable from your machine. [SSMS](/sql/ssms/sql-server-management-studio-ssms) can be used to check connectivity. Then a tool like [Postman](https://www.postman.com/) can be used to issue POST requests to the local endpoint. A request with an empty body should return http 204. A request with an actual payload should be persisted in the destination table (in replace / update mode). Here's a sample payload corresponding to the schema used in this sample:

```JSON
[{"DeviceId":3,"Value":13.4,"Timestamp":"2021-11-30T03:22:12.991Z"},{"DeviceId":4,"Value":41.4,"Timestamp":"2021-11-30T03:22:12.991Z"}]
```

The function can now be [published](../azure-functions/create-first-function-vs-code-csharp.md#publish-the-project-to-azure) to Azure. An [application setting](../azure-functions/functions-how-to-use-azure-function-app-settings.md?tabs=portal#settings) should be set for `SqlConnectionString`. The Azure SQL **Server** firewall should [allow Azure services](/azure/azure-sql/database/network-access-controls-overview) in for the live function to reach it.

The function can then be defined as an output in the ASA job, and used to replace records instead of inserting them.

## Option 2: Merge with compound assignment (accumulate) via a custom SQL query

> [!NOTE]
> Upon restart and recovery, ASA may re-send output events that were already emitted. This is an expected behavior that can cause the accumulation logic to fail (doubling individual values). To prevent this, it is recommended to output the same data in a table via the native ASA SQL Output. This control table can then be used to detect issues and re-synch the accumulation when necessary.

This option uses [Microsoft.Data.SqlClient](https://github.com/dotnet/SqlClient). This library lets us issue any SQL queries to a SQL Database.

This sample was built on:

- Azure Functions runtime [version 4](../azure-functions/functions-versions.md?pivots=programming-language-csharp&tabs=in-process%2cv4)
- [.NET 6.0](/dotnet/core/whats-new/dotnet-6)
- Microsoft.Data.SqlClient [4.0.0](https://www.nuget.org/packages/Microsoft.Data.SqlClient/)

First, create a default HttpTrigger function app by following this [tutorial](../azure-functions/create-first-function-vs-code-csharp.md?tabs=in-process). The following information will be used:

- Language: `C#`
- Runtime: `.NET 6` (under function/runtime v4)
- Template:  `HTTP trigger`

Install the SqlClient library by running the following command in a terminal located in the project folder:

```PowerShell
dotnet add package Microsoft.Data.SqlClient --version 4.0.0
```

Add the `SqlConnectionString` item in the `Values` section of your `local.settings.json`, filling in the connection string of the destination server:

```JSON
{
    "IsEncrypted": false,
    "Values": {
        "AzureWebJobsStorage": "UseDevelopmentStorage=true",
        "FUNCTIONS_WORKER_RUNTIME": "dotnet",
        "SqlConnectionString": "Your connection string"
    }
}
```

Replace the entire function (.cs file in the project) by the following code snippet. Update the namespace, class name, and function name by your own:

```C#
using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Microsoft.Data.SqlClient;

namespace Company.Function
{
    public static class HttpTrigger1{
        [FunctionName("HttpTrigger1")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get","post", Route = null)] HttpRequest req,
            ILogger log)
        {
            // Extract the body from the request
            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            if (string.IsNullOrEmpty(requestBody)) {return new StatusCodeResult(204);} // 204, ASA connectivity check

            dynamic data = JsonConvert.DeserializeObject(requestBody);

            // Reject if too large, as per the doc
            if (data.ToString().Length > 262144) {return new StatusCodeResult(413);} //HttpStatusCode.RequestEntityTooLarge

            var SqlConnectionString = Environment.GetEnvironmentVariable("SqlConnectionString");
            using (SqlConnection conn = new SqlConnection(SqlConnectionString))
            {
                conn.Open();

                // Parse items and send to binding
                for (var i = 0; i < data.Count; i++)
                {
                    int DeviceId = data[i].DeviceId;
                    double Value = data[i].Value;
                    DateTime Timestamp = data[i].Timestamp;

                    var sqltext =
                    $"MERGE INTO [device_updated] AS old " +
                    $"USING (VALUES ({DeviceId},{Value},'{Timestamp}')) AS new (DeviceId, Value, Timestamp) " +
                    $"ON new.DeviceId = old.DeviceId " +
                    $"WHEN MATCHED THEN UPDATE SET old.Value += new.Value, old.Timestamp = new.Timestamp " +
                    $"WHEN NOT MATCHED BY TARGET THEN INSERT (DeviceId, Value, TimeStamp) VALUES (DeviceId, Value, Timestamp);";

                    //log.LogInformation($"Running {sqltext}");

                    using (SqlCommand cmd = new SqlCommand(sqltext, conn))
                    {
                        // Execute the command and log the # rows affected.
                        var rows = await cmd.ExecuteNonQueryAsync();
                        log.LogInformation($"{rows} rows updated");
                    }
                }
                conn.Close();
            }
            return new OkResult(); // 200
        }
    }
}
```

Update the `sqltext` command building section to match your own schema (notice how accumulation is achieved via the `+=` operator on update):

```C#
    var sqltext =
    $"MERGE INTO [device_updated] AS old " +
    $"USING (VALUES ({DeviceId},{Value},'{Timestamp}')) AS new (DeviceId, Value, Timestamp) " +
    $"ON new.DeviceId = old.DeviceId " +
    $"WHEN MATCHED THEN UPDATE SET old.Value += new.Value, old.Timestamp = new.Timestamp " +
    $"WHEN NOT MATCHED BY TARGET THEN INSERT (DeviceId, Value, TimeStamp) VALUES (DeviceId, Value, Timestamp);";
```

You can now test the wiring between the local function and the database by debugging (F5 in VS Code). The SQL database needs to be reachable from your machine. [SSMS](/sql/ssms/sql-server-management-studio-ssms) can be used to check connectivity. Then a tool like [Postman](https://www.postman.com/) can be used to issue POST requests to the local endpoint. A request with an empty body should return http 204. A request with an actual payload should be persisted in the destination table (in accumulate / merge mode). Here's a sample payload corresponding to the schema used in this sample:

```JSON
[{"DeviceId":3,"Value":13.4,"Timestamp":"2021-11-30T03:22:12.991Z"},{"DeviceId":4,"Value":41.4,"Timestamp":"2021-11-30T03:22:12.991Z"}]
```

The function can now be [published](../azure-functions/create-first-function-vs-code-csharp.md#publish-the-project-to-azure) to Azure. An [application setting](../azure-functions/functions-how-to-use-azure-function-app-settings.md?tabs=portal#settings) should be set for `SqlConnectionString`. The Azure SQL **Server** firewall should [allow Azure services](/azure/azure-sql/database/network-access-controls-overview) in for the live function to reach it.

The function can then be defined as an output in the ASA job, and used to replace records instead of inserting them.

## Alternatives

Outside of Azure Functions, there are multiple ways to achieve the expected result. We'll mention the most likely solutions below.

### Post-processing in the target SQL Database

A background task will operate once the data is inserted in the database via the standard ASA SQL outputs.

For Azure SQL, `INSTEAD OF` [DML triggers](/sql/relational-databases/triggers/dml-triggers?view=azuresqldb-current&preserve-view=true) can be used to intercept the INSERT commands issued by ASA:

```SQL
CREATE TRIGGER tr_devices_updated_upsert ON device_updated INSTEAD OF INSERT
AS
BEGIN
	MERGE device_updated AS old
	
	-- In case of duplicates on the key below, use a subquery to make the key unique via aggregation or ranking functions
	USING inserted AS new
		ON new.DeviceId = old.DeviceId

	WHEN MATCHED THEN 
		UPDATE SET
			old.Value += new.Value, 
			old.Timestamp = new.Timestamp

	WHEN NOT MATCHED THEN
		INSERT (DeviceId, Value, Timestamp)
		VALUES (new.DeviceId, new.Value, new.Timestamp);  
END;
```

For Synapse SQL, ASA can insert into a [staging table](../synapse-analytics/sql/data-loading-best-practices.md#load-to-a-staging-table). A recurring task can then transform the data as needed into an intermediary table. Finally the [data is moved](../synapse-analytics/sql-data-warehouse/sql-data-warehouse-tables-partition.md#partition-switching) to the production table.

### Pre-processing in Azure Cosmos DB

Azure Cosmos DB [supports UPSERT natively](./stream-analytics-documentdb-output.md#upserts-from-stream-analytics). Here only append/replace is possible. Accumulations must be managed client-side in Azure Cosmos DB.

If the requirements match, an option is to replace the target SQL database by an Azure Cosmos DB instance. Doing so requires an important change in the overall solution architecture.

For Synapse SQL, Azure Cosmos DB can be used as an intermediary layer via [Azure Synapse Link for Azure Cosmos DB](../cosmos-db/synapse-link.md). Synapse Link can be used to create an [analytical store](../cosmos-db/analytical-store-introduction.md). This data store can then be queried directly in Synapse SQL.

### Comparison of the alternatives

Each approach offers different value proposition and capabilities:

|Type|Option|Modes|Azure SQL Database|Azure Synapse Analytics|
|---|---|---|---|---|
|Post-Processing|||||
||Triggers|Replace, Accumulate|+|N/A, triggers aren't available in Synapse SQL|
||Staging|Replace, Accumulate|+|+|
|Pre-Processing|||||
||Azure Functions|Replace, Accumulate|+|- (row-by-row performance)|
||Azure Cosmos DB replacement|Replace|N/A|N/A|
||Azure Cosmos DB Synapse Link|Replace|N/A|+|

## Get support

For further assistance, try our [Microsoft Q&A question page for Azure Stream Analytics](/answers/topics/azure-stream-analytics.html).

## Next steps

* [Understand outputs from Azure Stream Analytics](stream-analytics-define-outputs.md)
* [Azure Stream Analytics output to Azure SQL Database](sql-database-output.md)
* [Increase throughput performance to Azure SQL Database from Azure Stream Analytics](stream-analytics-sql-output-perf.md)
* [Use managed identities to access Azure SQL Database or Azure Synapse Analytics from an Azure Stream Analytics job](sql-database-output-managed-identity.md)
* [Use reference data from a SQL Database for an Azure Stream Analytics job](sql-reference-data.md)
* [Run Azure Functions in Azure Stream Analytics jobs - Tutorial for Redis output](stream-analytics-with-azure-functions.md)
* [Quickstart: Create a Stream Analytics job by using the Azure portal](stream-analytics-quick-create-portal.md)
