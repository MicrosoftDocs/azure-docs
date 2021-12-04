---
title: Update or merge records in Azure SQL Database from Azure Stream Analytics
description: This article describes how to configure an Azure Stream Analytics job to update or merge records in a SQL Database
author: fleid

ms.author: fleide
ms.service: stream-analytics
ms.topic: how-to
ms.date: 12/03/2021
---

# Update or merge records in Azure SQL Database from Azure Stream Analytics

Currently, [Azure Stream Analytics](https://docs.microsoft.com/en-us/azure/stream-analytics/) (ASA) only supports inserting rows to SQL outputs ([Azure SQL Databases](https://docs.microsoft.com/en-us/azure/stream-analytics/sql-database-output), and [Azure Synapse Analytics](https://docs.microsoft.com/en-us/azure/stream-analytics/azure-synapse-analytics-output)).

This article discusses workarounds to enable UPDATE, UPSERT, or MERGE on SQL databases with Azure Stream Analytics. It also provides code samples to use Azure Functions as an intermediary layer.

## Design

### Requirements

Writing data in a table can generally adapt the following modes:

|Mode|Requirements|Equivalent T-SQL statement|
|-|-|-|
|Append|None|[INSERT](https://docs.microsoft.com/en-us/sql/t-sql/statements/insert-transact-sql?view=sql-server-ver15)|
|Replace|Unique key|[MERGE](https://docs.microsoft.com/en-us/sql/t-sql/statements/merge-transact-sql?view=sql-server-ver15), UPDATE|
|Accumulate|Unique key and accumulator|MERGE (UPDATE) with compound assignment [operator](https://docs.microsoft.com/en-us/sql/t-sql/queries/update-transact-sql?view=sql-server-ver15#arguments) (`+=`, `-=`...)|

To illustrate the differences, we can look at what happens when ingesting the following data:

|Arrival Time|Key|Value|
|-|-|-|
|10:00|A|1|
|10:05|A|20|

We get the resulting state in **append** mode:

|Time|Key|Value|
|-|-|-|
|10:00|A|1|
|10:05|A|20|

We get only the last value in **replace** mode:

|Time|Key|Value|
|-|-|-|
|10:05|A|20|

Finally, we can sum values thanks to the **accumulate** mode (with `+=` on Value):

|Time|Key|Value|
|-|-|-|
|10:05|A|**21**|


For performance considerations, the SQL database output connectors of ASA currently only support append mode natively.

This article we discuss workarounds to implement Replace and Accumulate modes for ASA.


### Solutions

There are multiple ways to achieve the expected result. The list below isn't exhaustive, it only presents the most likely solutions.

From the database perspective:

- **Post-processing** : a background task will operate once the data is inserted in the database via the standard ASA SQL outputs
  - For Azure SQL, INSTEAD OF [DML triggers](https://docs.microsoft.com/en-us/sql/relational-databases/triggers/dml-triggers?view=azuresqldb-current) can be used to intercept the INSERT commands issued by ASA and replace them with UPDATEs
  - For Synapse SQL, the table where ASA writes can be considered as a [staging table](https://docs.microsoft.com/en-us/azure/synapse-analytics/sql/data-loading-best-practices#load-to-a-staging-table). A recurring task can then transform the data as needed into an intermediary table, before [moving the data](https://docs.microsoft.com/en-us/azure/synapse-analytics/sql-data-warehouse/sql-data-warehouse-tables-partition?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json#partition-switching) to the production table. We won't go into details here as the linked documentation covers that pattern exhaustively.
- **Pre-processing** : an intermediary service will consume the stream from the ASA job and deliver the missing capabilities
  - Replacing the target SQL database by Azure Cosmos DB, that [supports UPSERT natively](https://docs.microsoft.com/en-us/azure/stream-analytics/stream-analytics-documentdb-output#upserts-from-stream-analytics). Doing so requires a change in the overall application design
  - Via Cosmos DB Synapse Link. If the target database is Synapse SQL, it's possible to use [Azure Synapse Link for Azure Cosmos DB](https://docs.microsoft.com/en-us/azure/cosmos-db/synapse-link) to easily move data to Synapse once it's been ingested in Cosmos DB
  - Via Azure Functions, to pilot the SQL command issued to the target database

Each approach offers different value proposition and capabilities:

|||Modes|Azure SQL Database|Azure Synapse Analytics|
|---|---|---|---|---|
|Post-Processing|||||
||Triggers|Replace, Accumulate|+|N/A, triggers aren't available in Synapse SQL|
||Staging|Replace, Accumulate|+|+|
|Pre-Processing|||||
||Azure Functions|Replace, Accumulate|+|-|
||Cosmos DB replacement|Replace|N/A|N/A|
||Cosmos DB Synapse Link|Replace|N/A|+|


Contrary to the SQL outputs, the Cosmos DB output adapter [natively supports UPSERT](https://docs.microsoft.com/en-us/azure/stream-analytics/stream-analytics-documentdb-output#upserts-from-stream-analytics). Here only append/replace is possible since accumulations must be managed client-side in Cosmos DB. For certain scenarios, it may make sense to change the overall architecture and switch from SQL database to Cosmos DB as the final data store. If the destination is Synapse SQL, [Azure Synapse Link for Azure Cosmos DB](https://docs.microsoft.com/en-us/azure/cosmos-db/synapse-link) can be used to create an [analytical store](https://docs.microsoft.com/en-us/azure/cosmos-db/analytical-store-introduction). This data store can then be queried directly in Synapse SQL.

Using Azure Functions works best for Azure SQL. With Synapse SQL, it may create performance issues due to the transactional traffic it emits (one T-SQL query per event). This differs from the ASA SQL output adapters behavior as they rely on bulk insert mode.

## Pre-processing with Azure Functions

Here the UPDATE, UPSERT, or MERGE capabilities will be implemented in the function script. There are currently two options to reference a SQL Database in a function, either via [binding](https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-azure-sql) (C# only, replace mode only) or via the appropriate [Azure SQL driver](https://docs.microsoft.com/en-us/sql/connect/sql-connection-libraries?view=azuresqldb-current) ([Microsoft.Data.SqlClient](https://github.com/dotnet/SqlClient) for .NET).

For both examples below, we'll assume the following table schema - **a primary key must be set**, it will be used to update by key:

```SQL
CREATE TABLE [dbo].[device_updated](
	[DeviceId] [bigint] NOT NULL,
	[Value] [decimal](18, 10) NULL,
	[Timestamp] [datetime2](7) NULL,
 CONSTRAINT [PK_device_updated] PRIMARY KEY CLUSTERED
(
	[DeviceId] ASC
)
);
```

Finally, it's important to remember the following expectations on Azure Functions when using it as an [output from ASA](https://docs.microsoft.com/en-us/azure/stream-analytics/azure-functions-output):

- Azure Stream Analytics expects HTTP status 200 from the Functions app for batches that were processed successfully
- When Azure Stream Analytics receives a 413 ("http Request Entity Too Large") exception from an Azure function, it reduces the size of the batches that it sends to Azure Function
- During test connection, Stream Analytics sends an empty batch to Azure Functions and expects HTTP status 20x to validate the test


## Option 1: Update by key with the Azure Function SQL Binding

This sample was built on:

- Azure Functions runtime [version 4](https://docs.microsoft.com/en-us/azure/azure-functions/functions-versions?tabs=in-process%2Cv4&pivots=programming-language-csharp)
- [.NET 6.0](https://docs.microsoft.com/en-us/dotnet/core/whats-new/dotnet-6)
- Microsoft.Azure.WebJobs.Extensions.Sql [0.1.131-preview](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Sql/0.1.131-preview)

To better understand the binding approach, it's recommended the follow [this tutorial](https://github.com/Azure/azure-functions-sql-extension#quick-start) first.

First, create a default HttpTrigger function app by following this [tutorial](https://docs.microsoft.com/en-us/azure/azure-functions/create-first-function-vs-code-csharp?tabs=in-process). The following information will be used:

- Language : `C#`
- Runtime `.NET 6` (under function/runtime v4)
- Template : `HTTP trigger`

Install the binding extension by running the following command in a terminal located in the project folder:

```PowerShell
dotnet add package Microsoft.Azure.WebJobs.Extensions.Sql --prerelease
```

Add the `SqlConnectionString` item in the Values section of your local.settings.json, filling in the connection string of the destination server:

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

```DOTNET
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

```DOTNET
            [Sql("dbo.device_updated", ConnectionStringSetting = "SqlConnectionString")] IAsyncCollector<Device> devices
```

Update the `Device` class and mapping section to match your own schema:

```DOTNET
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

You can now test the wiring between the local function and the database by debugging (F5 in VS Code). The SQL database needs to be reachable from your machine. [SSMS](https://docs.microsoft.com/en-us/sql/ssms/sql-server-management-studio-ssms?view=sql-server-ver15) can be used to check connectivity. Then a tool like [Postman](https://www.postman.com/) can be used to issue POST requests to the local endpoint. A request with an empty body should return http 204. A request with an actual payload should be persisted in the destination table (in replace / update mode). Here's a sample payload corresponding to the schema used in this sample:

```JSON
[{"DeviceId":3,"Value":13.4,"Timestamp":"2021-11-30T03:22:12.991Z"},{"DeviceId":4,"Value":41.4,"Timestamp":"2021-11-30T03:22:12.991Z"}]
```

The function can now be deployed, defined as an output in the ASA job, and used to replace records instead of inserting them. The Azure SQL **Server** firewall should [allow Azure services](https://docs.microsoft.com/en-us/azure/azure-sql/database/network-access-controls-overview) in for the live function to reach it.


## Option 2: Merge with compound assignment (accumulate) via a custom SQL query

This sample was built on:

- Azure Functions runtime [version 4](https://docs.microsoft.com/en-us/azure/azure-functions/functions-versions?tabs=in-process%2Cv4&pivots=programming-language-csharp)
- [.NET 6.0](https://docs.microsoft.com/en-us/dotnet/core/whats-new/dotnet-6)
- Microsoft.Data.SqlClient [4.0.0](https://www.nuget.org/packages/Microsoft.Data.SqlClient/)

First, create a default HttpTrigger function app by following this [tutorial](https://docs.microsoft.com/en-us/azure/azure-functions/create-first-function-vs-code-csharp?tabs=in-process). The following information will be used:

- Language : `C#`
- Runtime `.NET 6` (under function/runtime v4)
- Template : `HTTP trigger`

Install the SqlClient library by running the following command in a terminal located in the project folder:

```PowerShell
dotnet add package Microsoft.Data.SqlClient --version 4.0.0
```

Add the `SqlConnectionString` item in the Values section of your local.settings.json, filling in the connection string of the destination server:

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

```DOTNET
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

```DOTNET
                    var sqltext =
                    $"MERGE INTO [device03] AS old " +
                    $"USING (VALUES ({DeviceId},{Value},'{Timestamp}')) AS new (DeviceId, Value, Timestamp) " +
                    $"ON new.DeviceId = old.DeviceId " +
                    $"WHEN MATCHED THEN UPDATE SET old.Value += new.Value, old.Timestamp = new.Timestamp " +
                    $"WHEN NOT MATCHED BY TARGET THEN INSERT (DeviceId, Value, TimeStamp) VALUES (DeviceId, Value, Timestamp);";
```

You can now test the wiring between the local function and the database by debugging (F5 in VS Code). The SQL database needs to be reachable from your machine. [SSMS](https://docs.microsoft.com/en-us/sql/ssms/sql-server-management-studio-ssms?view=sql-server-ver15) can be used to check connectivity. Then a tool like [Postman](https://www.postman.com/) can be used to issue POST requests to the local endpoint. A request with an empty body should return http 204. A request with an actual payload should be persisted in the destination table (in accumulate / merge mode). Here's a sample payload corresponding to the schema used in this sample:

```JSON
[{"DeviceId":3,"Value":13.4,"Timestamp":"2021-11-30T03:22:12.991Z"},{"DeviceId":4,"Value":41.4,"Timestamp":"2021-11-30T03:22:12.991Z"}]
```

The function can now be deployed, defined as an output in the ASA job, and used to accumulate values instead of inserting them. The Azure SQL **Server** firewall should [allow Azure services](https://docs.microsoft.com/en-us/azure/azure-sql/database/network-access-controls-overview) in for the live function to reach it.

## Get support

For further assistance, try our [Microsoft Q&A question page for Azure Stream Analytics](/answers/topics/azure-stream-analytics.html).

## Next steps

* [Understand outputs from Azure Stream Analytics](stream-analytics-define-outputs.md)
* [Azure Stream Analytics output to Azure SQL Database](stream-analytics-sql-output-perf.md)
* [Use managed identities to access Azure SQL Database or Azure Synapse Analytics from an Azure Stream Analytics job](sql-database-output-managed-identity.md)
* [Quickstart: Create a Stream Analytics job by using the Azure portal](stream-analytics-quick-create-portal.md)
