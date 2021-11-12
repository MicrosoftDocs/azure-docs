---
title: Azure SQL input binding for Functions
description: Learn to use the Azure SQL input binding in Azure Functions.
author: dzsquared
ms.topic: reference
ms.date: 11/12/2021
ms.author: drskwier
ms.reviewer: cachai
---

# Azure SQL input binding for Azure Functions (preview)

The Azure SQL input binding retrieves data from a database and passes it to the input parameter of the function.

For information on setup and configuration details, see the [overview](./functions-bindings-azure-sql.md).

<a id="example" name="example"></a>

# [C#](#tab/csharp)

This section contains the following examples:

* [HTTP trigger, look up ID from query string](#http-trigger-look-up-id-from-query-string-c)
* [HTTP trigger, get multiple docs from route data](#http-trigger-get-multiple-items-from-route-data-c)

The examples refer to a `ToDoItem` type and a corresponding database table:

```cs
namespace AzureSQLSamples
{
    public class ToDoItem
    {
        public string Id { get; set; }
        public int Priority { get; set; }
        public string Description { get; set; }
    }
}
```

```sql
CREATE TABLE dbo.ToDo (
    [Id] int primary key,
    [Priority] int null,
    [Description] nvarchar(200) not null
)
```

<a id="http-trigger-look-up-id-from-query-string-c"></a>

### HTTP trigger, look up ID from query string

The following example shows a [C# function](functions-dotnet-class-library.md) that retrieves a single record. The function is triggered by an HTTP request that uses a query string to specify the ID. That ID is used to retrieve a `ToDoItem` record with the specified query.

> [!NOTE]
> The HTTP query string parameter is case-sensitive.
>

```cs
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;

namespace AzureSQLSamples
{
    public static class GetToDoItem
    {
        [FunctionName("GetToDoItem")]
        public static IActionResult Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "gettodoitem")]
            HttpRequest req,
            [Sql("select * from dbo.ToDo where Id = @Id",
                CommandType = System.Data.CommandType.Text,
                Parameters = "@Id={Query.id}",
                ConnectionStringSetting = "SqlConnectionString")]
            IEnumerable<ToDoItem> toDoItem)
        {
            return new OkObjectResult(toDoItem.FirstOrDefault());
        }
    }
}
```

<a id="http-trigger-get-multiple-items-from-route-data-c"></a>

### HTTP trigger, get multiple items from route data

The following example shows a [C# function](functions-dotnet-class-library.md) that retrieves documents returned by the query. The function is triggered by an HTTP request that uses route data to specify the value of a query parameter. That parameter is used to filter the `ToDoItem` records in the specified query.

```cs
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;

namespace AzureSQLSamples
{
    public static class GetToDoItems
    {
        [FunctionName("GetToDoItems")]
        public static IActionResult Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "gettodoitems/{priority}")]
            HttpRequest req,
            [Sql("select * from dbo.ToDo where [Priority] > @Priority",
                CommandType = System.Data.CommandType.Text,
                Parameters = "@Priority={priority}",
                ConnectionStringSetting = "SqlConnectionString")]
            IEnumerable<ToDoItem> toDoItems)
        {
            return new OkObjectResult(toDoItems);
        }
    }
}
```

# [JavaScript](#tab/javascript)

The Azure SQL binding for Azure Functions does not currently support JavaScript.

# [Python](#tab/python)

The Azure SQL binding for Azure Functions does not currently support Python.

 ---

## Attributes and annotations

# [C#](#tab/csharp)

In [C# class libraries](functions-dotnet-class-library.md), use the [Sql](https://github.com/Azure/azure-functions-sql-extension/blob/main/src/SqlAttribute.cs) attribute.

The attribute's constructor takes the SQL command text, the command type, parameters, and the connection string setting name. The command can be a Transact-SQL (T-SQL) query with the command type `System.Data.CommandType.Text` or stored procedure name with the command type `System.Data.CommandType.StoredProcedure`. The connection string setting name corresponds to the application setting (in `local.settings.json` for local development) that contains the [connection string](/dotnet/api/microsoft.data.sqlclient.sqlconnection.connectionstring?view=sqlclient-dotnet-core-3.0&preserve-view=true#Microsoft_Data_SqlClient_SqlConnection_ConnectionString) to the Azure SQL or SQL Server instance.

Here's a `Sql` attribute example in a method signature:

```csharp
    [FunctionName("GetToDoItems")]
    public static IActionResult Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "gettodoitems/{priority}")]
            HttpRequest req,
            [Sql("select * from dbo.ToDo where [Priority] > @Priority",
                CommandType = System.Data.CommandType.Text,
                Parameters = "@Priority={priority}",
                ConnectionStringSetting = "SqlConnectionString")]
            IEnumerable<ToDoItem> toDoItems)
    {
        ...
    }
```

# [JavaScript](#tab/javascript)

The Azure SQL binding for Azure Functions does not currently support JavaScript.

# [Python](#tab/python)

The Azure SQL binding for Azure Functions does not currently support Python.


---


[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]



## Next steps

- [Save data to a database (Output binding)](./functions-bindings-azure-sql-output.md)
