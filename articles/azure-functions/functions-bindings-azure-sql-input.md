---
title: Azure SQL input binding for Functions
description: Learn to use the Azure SQL input binding in Azure Functions.
author: dzsquared
ms.topic: reference
ms.date: 5/3/2022
ms.author: drskwier
ms.reviewer: glenga
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Azure SQL input binding for Azure Functions (preview)

When a function runs, the Azure SQL input binding retrieves data from a database and passes it to the input parameter of the function. 

For information on setup and configuration details, see the [overview](./functions-bindings-azure-sql.md).

## Example

::: zone pivot="programming-language-csharp"

# [In-process](#tab/in-process)

This section contains the following examples:

* [HTTP trigger, look up ID from query string](#http-trigger-look-up-id-from-query-string-c)
* [HTTP trigger, get multiple docs from route data](#http-trigger-get-multiple-items-from-route-data-c)

The examples refer to a `ToDoItem` class and a corresponding database table:

:::code language="csharp" source="~/functions-sql-todo-sample/ToDoModel.cs" range="6-14":::

:::code language="sql" source="~/functions-sql-todo-sample/sql/create.sql" range="1-7":::


<a id="http-trigger-look-up-id-from-query-string-c"></a>

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
            [Sql("select [Id], [order], [title], [url], [completed] from dbo.ToDo where Id = @Id",
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
            [Sql("select [Id], [order], [title], [url], [completed] from dbo.ToDo where [Priority] > @Priority",
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

<a id="http-trigger-delete-one-or-multiple-rows-c"></a>

The following example shows a [C# function](functions-dotnet-class-library.md) that executes a stored procedure with input from the HTTP request query parameter.

The stored procedure `dbo.DeleteToDo` must be created on the SQL database.  In this example, the stored procedure deletes a single record or all records depending on the value of the parameter.

:::code language="sql" source="~/functions-sql-todo-sample/sql/create.sql" range="11-25":::

:::code language="csharp" source="~/functions-sql-todo-sample/DeleteToDo.cs" range="4-30":::

# [Isolated process](#tab/isolated-process)

Isolated process isn't currently supported.

<!-- Uncomment to support C# script examples.
# [C# Script](#tab/csharp-script)

-->
---

::: zone-end
::: zone pivot="programming-language-javascript,programming-language-python,programming-language-java,programming-language-powershell"  

> [!NOTE]
> In the current preview, Azure SQL bindings are only supported by [C# class library functions](functions-dotnet-class-library.md). 

::: zone-end

<!---### Use these pivots when we get other non-C# languages added. ###
::: zone pivot="programming-language-javascript"

::: zone-end  
::: zone pivot="programming-language-powershell" 
 

::: zone-end 
::: zone pivot="programming-language-python"  


::: zone-end
::: zone pivot="programming-language-java"

::: zone-end
--->

::: zone pivot="programming-language-csharp"
## Attributes 

In [C# class libraries](functions-dotnet-class-library.md), use the [Sql](https://github.com/Azure/azure-functions-sql-extension/blob/main/src/SqlAttribute.cs) attribute, which has the following properties:

| Attribute property |Description|
|---------|---------|
| **CommandText** | Required. The Transact-SQL query command or name of the stored procedure executed by the binding.  |
| **ConnectionStringSetting** | The name of an app setting that contains the connection string for the database against which the query or stored procedure is being executed. This isn't the actual connection string and must instead resolve to an environment variable. | 
| **CommandType** | A [CommandType](/dotnet/api/system.data.commandtype) value, which is [Text](/dotnet/api/system.data.commandtype#fields) for a query and [StoredProcedure](/dotnet/api/system.data.commandtype#fields) for a stored procedure. |
| **Parameters** | Zero or more parameter values passed to the command during execution as a single string. Must follow the format `@param1=param1,@param2=param2`. Neither the parameter name nor the parameter value can contain a comma (`,`) or an equals sign (`=`). |

::: zone-end  
<!---### Use these pivots when we get other non-C# languages added. ###
::: zone pivot="programming-language-java"  
## Annotations

In the [Java functions runtime library](/java/api/overview/azure/functions/runtime), use the `@Sql` annotation on parameters whose value would come from Azure SQL. This annotation supports the following elements:

| Element |Description|
|---------|---------|
| **commandText** | Required. The Transact-SQL query command or name of the stored procedure executed by the binding.  |
| **connectionStringSetting** | The name of an app setting that contains the connection string for the database against which the query or stored procedure is being executed. This isn't the actual connection string and must instead resolve to an environment variable. | 
| **commandType** | A [CommandType](/dotnet/api/system.data.commandtype) value, which is [Text](/dotnet/api/system.data.commandtype#fields) for a query and [StoredProcedure](/dotnet/api/system.data.commandtype#fields) for a stored procedure. |
| **parameters** | Zero or more parameter values passed to the command during execution as a single string. Must follow the format `@param1=param1,@param2=param2`. Neither the parameter name nor the parameter value can contain a comma (`,`) or an equals sign (`=`). |

::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-powershell,programming-language-python"  
## Configuration

The following table explains the binding configuration properties that you set in the *function.json* file.

|function.json property | Description|
|---------|----------------------|
|**type** |  Must be set to `table`. This property is set automatically when you create the binding in the Azure portal.|
|**direction** |  Must be set to `in`. This property is set automatically when you create the binding in the Azure portal. |
|**name** |  The name of the variable that represents the table or entity in function code. | 
| **commandText** | Required. The Transact-SQL query command or name of the stored procedure executed by the binding.  |
| **connectionStringSetting** | The name of an app setting that contains the connection string for the database against which the query or stored procedure is being executed. This isn't the actual connection string and must instead resolve to an environment variable. | 
| **commandType** | A [CommandType](/dotnet/api/system.data.commandtype) value, which is [Text](/dotnet/api/system.data.commandtype#fields) for a query and [StoredProcedure](/dotnet/api/system.data.commandtype#fields) for a stored procedure. |
| **parameters** | Zero or more parameter values passed to the command during execution as a single string. Must follow the format `@param1=param1,@param2=param2`. Neither the parameter name nor the parameter value can contain a comma (`,`) or an equals sign (`=`). |
::: zone-end  
-->

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

## Usage

::: zone pivot="programming-language-csharp"

The attribute's constructor takes the SQL command text, the command type, parameters, and the connection string setting name. The command can be a Transact-SQL (T-SQL) query with the command type `System.Data.CommandType.Text` or stored procedure name with the command type `System.Data.CommandType.StoredProcedure`. The connection string setting name corresponds to the application setting (in `local.settings.json` for local development) that contains the [connection string](/dotnet/api/microsoft.data.sqlclient.sqlconnection.connectionstring?view=sqlclient-dotnet-core-3.0&preserve-view=true#Microsoft_Data_SqlClient_SqlConnection_ConnectionString) to the Azure SQL or SQL Server instance.

::: zone-end

## Next steps

- [Save data to a database (Output binding)](./functions-bindings-azure-sql-output.md)
- [Review ToDo API sample with Azure SQL bindings](/samples/azure-samples/azure-sql-binding-func-dotnet-todo/todo-backend-dotnet-azure-sql-bindings-azure-functions/)
