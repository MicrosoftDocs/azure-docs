---
title: Azure SQL input binding for Functions
description: Learn to use the Azure SQL input binding in Azure Functions.
author: dzsquared
ms.topic: reference
ms.custom: event-tier1-build-2022
ms.date: 5/24/2022
ms.author: drskwier
ms.reviewer: glenga
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Azure SQL input binding for Azure Functions (preview)

When a function runs, the Azure SQL input binding retrieves data from a database and passes it to the input parameter of the function. 

For information on setup and configuration details, see the [overview](./functions-bindings-azure-sql.md).

## Examples
<a id="example"></a>

::: zone pivot="programming-language-csharp"

More samples for the Azure SQL input binding are available in the [GitHub repository](https://github.com/Azure/azure-functions-sql-extension/tree/main/samples/samples-csharp).

# [In-process](#tab/in-process)

This section contains the following examples:

* [HTTP trigger, get row by ID from query string](#http-trigger-look-up-id-from-query-string-c)
* [HTTP trigger, get multiple rows from route data](#http-trigger-get-multiple-items-from-route-data-c)
* [HTTP trigger, delete rows](#http-trigger-delete-one-or-multiple-rows-c)

The examples refer to a `ToDoItem` class and a corresponding database table:

:::code language="csharp" source="~/functions-sql-todo-sample/ToDoModel.cs" range="6-14":::

:::code language="sql" source="~/functions-sql-todo-sample/sql/create.sql" range="1-7":::

<a id="http-trigger-look-up-id-from-query-string-c"></a>
### HTTP trigger, get row by ID from query string

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
### HTTP trigger, get multiple rows from route parameter

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
### HTTP trigger, delete rows

The following example shows a [C# function](functions-dotnet-class-library.md) that executes a stored procedure with input from the HTTP request query parameter.

The stored procedure `dbo.DeleteToDo` must be created on the SQL database.  In this example, the stored procedure deletes a single record or all records depending on the value of the parameter.

:::code language="sql" source="~/functions-sql-todo-sample/sql/create.sql" range="11-25":::

:::code language="csharp" source="~/functions-sql-todo-sample/DeleteToDo.cs" range="4-30":::

# [Isolated process](#tab/isolated-process)

Isolated worker process isn't currently supported.

<!-- Uncomment to support C# script examples.
# [C# Script](#tab/csharp-script)

-->
---

::: zone-end

::: zone pivot="programming-language-java,programming-language-powershell"

> [!NOTE]
> In the current preview, Azure SQL bindings are only supported by [C# class library functions](functions-dotnet-class-library.md), [JavaScript functions](functions-reference-node.md), and [Python functions](functions-reference-python.md). 

::: zone-end

::: zone pivot="programming-language-javascript"

More samples for the Azure SQL input binding are available in the [GitHub repository](https://github.com/Azure/azure-functions-sql-extension/tree/main/samples/samples-js).

This section contains the following examples:

* [HTTP trigger, get multiple rows](#http-trigger-get-multiple-items-javascript)
* [HTTP trigger, get row by ID from query string](#http-trigger-look-up-id-from-query-string-javascript)
* [HTTP trigger, delete rows](#http-trigger-delete-one-or-multiple-rows-javascript)

The examples refer to a database table:

:::code language="sql" source="~/functions-sql-todo-sample/sql/create.sql" range="1-7":::

<a id="http-trigger-get-multiple-items-javascript"></a>
### HTTP trigger, get multiple rows

The following example shows a SQL input binding in a function.json file and a JavaScript function that reads from a query and returns the results in the HTTP response.

The following is binding data in the function.json file:

```json
{
    "authLevel": "anonymous",
    "type": "httpTrigger",
    "direction": "in",
    "name": "req",
    "methods": [
        "get"
    ]
},
{
    "type": "http",
    "direction": "out",
    "name": "res"
},
{
    "name": "todoItems",
    "type": "sql",
    "direction": "in",
    "commandText": "select [Id], [order], [title], [url], [completed] from dbo.ToDo",
    "commandType": "Text",
    "connectionStringSetting": "SqlConnectionString"
}
```

The [configuration](#configuration) section explains these properties.

The following is sample JavaScript code:


```javascript
module.exports = async function (context, req, todoItems) {
    context.log('JavaScript HTTP trigger and SQL input binding function processed a request.');
    
    context.res = {
        // status: 200, /* Defaults to 200 */
        mimetype: "application/json",
        body: todoItems
    };
}
```

<a id="http-trigger-look-up-id-from-query-string-javascript"></a>
### HTTP trigger, get row by ID from query string

The following example shows a SQL input binding in a JavaScript function that reads from a query filtered by a parameter from the query string and returns the row in the HTTP response.

The following is binding data in the function.json file:

```json
{
    "authLevel": "anonymous",
    "type": "httpTrigger",
    "direction": "in",
    "name": "req",
    "methods": [
        "get"
    ]
},
{
    "type": "http",
    "direction": "out",
    "name": "res"
},
{
    "name": "todoItem",
    "type": "sql",
    "direction": "in",
    "commandText": "select [Id], [order], [title], [url], [completed] from dbo.ToDo where Id = @Id",
    "commandType": "Text",
    "parameters": "@Id = {Query.id}",
    "connectionStringSetting": "SqlConnectionString"
}
```

The [configuration](#configuration) section explains these properties.

The following is sample JavaScript code:


```javascript
module.exports = async function (context, req, todoItem) {
    context.log('JavaScript HTTP trigger and SQL input binding function processed a request.');

    context.res = {
        // status: 200, /* Defaults to 200 */
        mimetype: "application/json",
        body: todoItem
    };
}
```

<a id="http-trigger-delete-one-or-multiple-rows-javascript"></a>
### HTTP trigger, delete rows

The following example shows a SQL input binding in a function.json file and a JavaScript function that executes a stored procedure with input from the HTTP request query parameter.

The stored procedure `dbo.DeleteToDo` must be created on the database.  In this example, the stored procedure deletes a single record or all records depending on the value of the parameter.

:::code language="sql" source="~/functions-sql-todo-sample/sql/create.sql" range="11-25":::


```json
{
    "authLevel": "anonymous",
    "type": "httpTrigger",
    "direction": "in",
    "name": "req",
    "methods": [
        "get"
    ]
},
{
    "type": "http",
    "direction": "out",
    "name": "res"
},
{
    "name": "todoItems",
    "type": "sql",
    "direction": "in",
    "commandText": "DeleteToDo",
    "commandType": "StoredProcedure",
    "parameters": "@Id = {Query.id}",
    "connectionStringSetting": "SqlConnectionString"
}
```

The [configuration](#configuration) section explains these properties.

The following is sample JavaScript code:


```javascript
module.exports = async function (context, req, todoItems) {
    context.log('JavaScript HTTP trigger and SQL input binding function processed a request.');

    context.res = {
        // status: 200, /* Defaults to 200 */
        mimetype: "application/json",
        body: todoItems
    };
}
```

::: zone-end  

::: zone pivot="programming-language-python"  

More samples for the Azure SQL input binding are available in the [GitHub repository](https://github.com/Azure/azure-functions-sql-extension/tree/main/samples/samples-python).

This section contains the following examples:

* [HTTP trigger, get multiple rows](#http-trigger-get-multiple-items-python)
* [HTTP trigger, get row by ID from query string](#http-trigger-look-up-id-from-query-string-python)
* [HTTP trigger, delete rows](#http-trigger-delete-one-or-multiple-rows-python)

The examples refer to a database table:

:::code language="sql" source="~/functions-sql-todo-sample/sql/create.sql" range="1-7":::

<a id="http-trigger-get-multiple-items-python"></a>
### HTTP trigger, get multiple rows

The following example shows a SQL input binding in a function.json file and a Python function that reads from a query and returns the results in the HTTP response.

The following is binding data in the function.json file:

```json
{
    "authLevel": "anonymous",
    "type": "httpTrigger",
    "direction": "in",
    "name": "req",
    "methods": [
        "get"
    ]
},
{
    "type": "http",
    "direction": "out",
    "name": "$return"
},
{
    "name": "todoItems",
    "type": "sql",
    "direction": "in",
    "commandText": "select [Id], [order], [title], [url], [completed] from dbo.ToDo",
    "commandType": "Text",
    "connectionStringSetting": "SqlConnectionString"
}
```

The [configuration](#configuration) section explains these properties.

The following is sample Python code:


```python
import azure.functions as func
import json

def main(req: func.HttpRequest, todoItems: func.SqlRowList) -> func.HttpResponse:
    rows = list(map(lambda r: json.loads(r.to_json()), todoItems))

    return func.HttpResponse(
        json.dumps(rows),
        status_code=200,
        mimetype="application/json"
    ) 
```

<a id="http-trigger-look-up-id-from-query-string-python"></a>
### HTTP trigger, get row by ID from query string

The following example shows a SQL input binding in a Python function that reads from a query filtered by a parameter from the query string and returns the row in the HTTP response.

The following is binding data in the function.json file:

```json
{
    "authLevel": "anonymous",
    "type": "httpTrigger",
    "direction": "in",
    "name": "req",
    "methods": [
        "get"
    ]
},
{
    "type": "http",
    "direction": "out",
    "name": "$return"
},
{
    "name": "todoItem",
    "type": "sql",
    "direction": "in",
    "commandText": "select [Id], [order], [title], [url], [completed] from dbo.ToDo where Id = @Id",
    "commandType": "Text",
    "parameters": "@Id = {Query.id}",
    "connectionStringSetting": "SqlConnectionString"
}
```

The [configuration](#configuration) section explains these properties.

The following is sample Python code:


```python
import azure.functions as func
import json

def main(req: func.HttpRequest, todoItem: func.SqlRowList) -> func.HttpResponse:
    rows = list(map(lambda r: json.loads(r.to_json()), todoItem))

    return func.HttpResponse(
        json.dumps(rows),
        status_code=200,
        mimetype="application/json"
    ) 
```


<a id="http-trigger-delete-one-or-multiple-rows-python"></a>
### HTTP trigger, delete rows

The following example shows a SQL input binding in a function.json file and a Python function that executes a stored procedure with input from the HTTP request query parameter.

The stored procedure `dbo.DeleteToDo` must be created on the database.  In this example, the stored procedure deletes a single record or all records depending on the value of the parameter.

:::code language="sql" source="~/functions-sql-todo-sample/sql/create.sql" range="11-25":::


```json
{
    "authLevel": "anonymous",
    "type": "httpTrigger",
    "direction": "in",
    "name": "req",
    "methods": [
        "get"
    ]
},
{
    "type": "http",
    "direction": "out",
    "name": "$return"
},
{
    "name": "todoItems",
    "type": "sql",
    "direction": "in",
    "commandText": "DeleteToDo",
    "commandType": "StoredProcedure",
    "parameters": "@Id = {Query.id}",
    "connectionStringSetting": "SqlConnectionString"
}
```

The [configuration](#configuration) section explains these properties.

The following is sample Python code:


```python
import azure.functions as func
import json

def main(req: func.HttpRequest, todoItems: func.SqlRowList) -> func.HttpResponse:
    rows = list(map(lambda r: json.loads(r.to_json()), todoItems))

    return func.HttpResponse(
        json.dumps(rows),
        status_code=200,
        mimetype="application/json"
    ) 
```

::: zone-end

<!---### Use these pivots when we get other non-C# languages added. ###
::: zone pivot="programming-language-powershell" 
 

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
| **ConnectionStringSetting** | Required. The name of an app setting that contains the connection string for the database against which the query or stored procedure is being executed. This value isn't the actual connection string and must instead resolve to an environment variable name. | 
| **CommandType** | Required. A [CommandType](/dotnet/api/system.data.commandtype) value, which is [Text](/dotnet/api/system.data.commandtype#fields) for a query and [StoredProcedure](/dotnet/api/system.data.commandtype#fields) for a stored procedure. |
| **Parameters** | Optional. Zero or more parameter values passed to the command during execution as a single string. Must follow the format `@param1=param1,@param2=param2`. Neither the parameter name nor the parameter value can contain a comma (`,`) or an equals sign (`=`). |

::: zone-end  
<!---### Use these pivots when we get other non-C# languages added. ###
::: zone pivot="programming-language-java"  
## Annotations

In the [Java functions runtime library](/java/api/overview/azure/functions/runtime), use the `@Sql` annotation on parameters whose value would come from Azure SQL. This annotation supports the following elements:

| Element |Description|
|---------|---------|
| **commandText** | Required. The Transact-SQL query command or name of the stored procedure executed by the binding.  |
| **connectionStringSetting** | The name of an app setting that contains the connection string for the database against which the query or stored procedure is being executed. This value isn't the actual connection string and must instead resolve to an environment variable name. | 
| **commandType** | A [CommandType](/dotnet/api/system.data.commandtype) value, which is [Text](/dotnet/api/system.data.commandtype#fields) for a query and [StoredProcedure](/dotnet/api/system.data.commandtype#fields) for a stored procedure. |
| **parameters** | Zero or more parameter values passed to the command during execution as a single string. Must follow the format `@param1=param1,@param2=param2`. Neither the parameter name nor the parameter value can contain a comma (`,`) or an equals sign (`=`). |

::: zone-end 
--> 
::: zone pivot="programming-language-javascript,programming-language-python"  
## Configuration

The following table explains the binding configuration properties that you set in the function.json file.

|function.json property | Description|
|---------|----------------------|
|**type** |  Required. Must be set to `sql`. |
|**direction** | Required. Must be set to `in`. |
|**name** |  Required. The name of the variable that represents the query results in function code. | 
| **commandText** | Required. The Transact-SQL query command or name of the stored procedure executed by the binding.  |
| **connectionStringSetting** | Required. The name of an app setting that contains the connection string for the database against which the query or stored procedure is being executed. This value isn't the actual connection string and must instead resolve to an environment variable name.  Optional keywords in the connection string value are [available to refine SQL bindings connectivity](./functions-bindings-azure-sql.md#sql-connection-string). |
| **commandType** | Required. A [CommandType](/dotnet/api/system.data.commandtype) value, which is [Text](/dotnet/api/system.data.commandtype#fields) for a query and [StoredProcedure](/dotnet/api/system.data.commandtype#fields) for a stored procedure. |
| **parameters** | Optional. Zero or more parameter values passed to the command during execution as a single string. Must follow the format `@param1=param1,@param2=param2`. Neither the parameter name nor the parameter value can contain a comma (`,`) or an equals sign (`=`). |
::: zone-end  


[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

## Usage

::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-python"

The attribute's constructor takes the SQL command text, the command type, parameters, and the connection string setting name. The command can be a Transact-SQL (T-SQL) query with the command type `System.Data.CommandType.Text` or stored procedure name with the command type `System.Data.CommandType.StoredProcedure`. The connection string setting name corresponds to the application setting (in `local.settings.json` for local development) that contains the [connection string](/dotnet/api/microsoft.data.sqlclient.sqlconnection.connectionstring?view=sqlclient-dotnet-core-3.1&preserve-view=true#Microsoft_Data_SqlClient_SqlConnection_ConnectionString) to the Azure SQL or SQL Server instance.

Queries executed by the input binding are [parameterized](/dotnet/api/microsoft.data.sqlclient.sqlparameter) in Microsoft.Data.SqlClient to reduce the risk of [SQL injection](/sql/relational-databases/security/sql-injection) from the parameter values passed into the binding.


::: zone-end

## Next steps

- [Save data to a database (Output binding)](./functions-bindings-azure-sql-output.md)
- [Review ToDo API sample with Azure SQL bindings](/samples/azure-samples/azure-sql-binding-func-dotnet-todo/todo-backend-dotnet-azure-sql-bindings-azure-functions/)
