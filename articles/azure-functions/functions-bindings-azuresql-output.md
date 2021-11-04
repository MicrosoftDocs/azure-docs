---
title: Azure SQL output binding for Functions
description: Learn to use the Azure SQL output binding in Azure Functions.
author: dzsquared
ms.topic: reference
ms.date: 11/9/2021
ms.author: drskwier
---

# Azure SQL output binding for Azure Functions

The Azure SQL output binding lets you write to an Azure SQL database.

For information on setup and configuration details, see the [overview](./functions-bindings-azuresql.md).


<a id="example" name="example"></a>

# [C#](#tab/csharp)

This section contains the following examples:

* [Http trigger, write one record](#http-trigger-write-one-record-c)
* [Http trigger, write records using IAsyncCollector](#http-trigger-write-records-using-iasynccollector-c)

The examples refer to a simple `ToDoItem` type:

```cs
namespace AzureSQLSamples
{
    public class ToDoItem
    {
        public string Id { get; set; }
        public string Description { get; set; }
    }
}
```

<a id="http-trigger-write-one-record-c"></a>

### Http trigger, write one record

The following example shows a [C# function](functions-dotnet-class-library.md) that adds a document to a database, using data provided in message from Queue storage.

```cs
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.Logging;
using System;

namespace AzureSQLSamples
{
    public static class WriteOneRecord
    {
        [FunctionName("WriteOneRecord")]
        public static IActionResult Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "addtodo")] HttpRequest req,
            ILogger log,
            [Sql("dbo.ToDo", ConnectionStringSetting = "SqlConnectionString")] out ToDoItem newitem)
        {
            newitem = new ToDoItem
            {
                Id = req.Query["id"],
                Description =req.Query["desc"]
            };

            log.LogInformation($"C# HTTP trigger function inserted one row");
            return new CreatedResult($"/api/addtodo", newitem);
        }
    }
}
```

<a id="http-trigger-write-records-using-iasynccollector-c"></a>

### HTTP trigger, write records using IAsyncCollector

The following example shows a [C# function](functions-dotnet-class-library.md) that adds a collection of records to a database, using data provided in an HTTP POST body JSON.

```cs
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Newtonsoft.Json;
using System.IO;
using System.Threading.Tasks;

namespace AzureSQLSamples
{
    public static class WriteRecordsAsync
    {
        [FunctionName("WriteRecordsAsync")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "addtodo-asynccollector")]
            HttpRequest req,
            [Sql("dbo.Products", ConnectionStringSetting = "SqlConnectionString")] IAsyncCollector<ToDoItem> newitems)
        {
            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var incomingitems = JsonConvert.DeserializeObject<ToDoItem[]>(requestBody);
            foreach (ToDoItem newitem in incomingitems)
            {
                await newitems.AddAsync(newitem);
            }
            // Rows are upserted here
            await newitems.FlushAsync();

            return new CreatedResult($"/api/addtodo-asynccollector", "done");
        }
    }
}
```

# [JavaScript](#tab/javascript)

The Azure SQL binding for Azure Functions does not yet support JavaScript.

# [Python](#tab/python)

The Azure SQL binding for Azure Functions does not yet support Python.

---

## Attributes and annotations

# [C#](#tab/csharp)

In [C# class libraries](functions-dotnet-class-library.md), use the [Sql](https://github.com/Azure/azure-functions-sql-extension/blob/main/src/SqlAttribute.cs) attribute.

The attribute's constructor takes the SQL command text and the connection string setting name. For an output binding, the SQL command string is a table name where the data is to be stored. The connection string setting name corresponds to the application setting (in `local.settings.json` for local development) that contains the [connection string](https://docs.microsoft.com/dotnet/api/microsoft.data.sqlclient.sqlconnection.connectionstring?view=sqlclient-dotnet-core-3.0#Microsoft_Data_SqlClient_SqlConnection_ConnectionString) to the Azure SQL or SQL Server instance.

Here's a `Sql` attribute example in a method signature:

```csharp
    [FunctionName("HTTPtoSQL")]
    public static IActionResult Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "addtodo")] HttpRequest req,
            [Sql("dbo.ToDo", ConnectionStringSetting = "SqlConnectionString")] out ToDoItem newitem)
    {
        ...
    }
```

# [JavaScript](#tab/javascript)

The Azure SQL binding for Azure Functions does not yet support JavaScript.

# [Python](#tab/python)

The Azure SQL binding for Azure Functions does not yet support Python.

---


[!INCLUDE [functions-azuresql-connections](../../includes/functions-azuresql-connections.md)]

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]



## Next steps

- [Read data from a SQL database (Input binding)](./functions-bindings-azuresql-input.md)
