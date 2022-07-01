---
title: Azure SQL output binding for Functions
description: Learn to use the Azure SQL output binding in Azure Functions.
author: dzsquared
ms.topic: reference
ms.custom: event-tier1-build-2022
ms.date: 5/24/2022
ms.author: drskwier
ms.reviewer: glenga
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Azure SQL output binding for Azure Functions (preview)

The Azure SQL output binding lets you write to a database.

For information on setup and configuration details, see the [overview](./functions-bindings-azure-sql.md).

## Examples
<a id="example"></a>

::: zone pivot="programming-language-csharp"

More samples for the Azure SQL output binding are available in the [GitHub repository](https://github.com/Azure/azure-functions-sql-extension/tree/main/samples/samples-csharp).

# [In-process](#tab/in-process)

This section contains the following examples:

* [HTTP trigger, write one record](#http-trigger-write-one-record-c)
* [HTTP trigger, write to two tables](#http-trigger-write-to-two-tables-c)
* [HTTP trigger, write records using IAsyncCollector](#http-trigger-write-records-using-iasynccollector-c)

The examples refer to a `ToDoItem` class and a corresponding database table:

:::code language="csharp" source="~/functions-sql-todo-sample/ToDoModel.cs" range="6-14":::

:::code language="sql" source="~/functions-sql-todo-sample/sql/create.sql" range="1-7":::


<a id="http-trigger-write-one-record-c"></a>

### HTTP trigger, write one record

The following example shows a [C# function](functions-dotnet-class-library.md) that adds a record to a database, using data provided in an HTTP POST request as a JSON body.

:::code language="csharp" source="~/functions-sql-todo-sample/PostToDo.cs" range="4-49":::

<a id="http-trigger-write-to-two-tables-c"></a>

### HTTP trigger, write to two tables

The following example shows a [C# function](functions-dotnet-class-library.md) that adds records to a database in two different tables (`dbo.ToDo` and `dbo.RequestLog`), using data provided in an HTTP POST request as a JSON body and multiple output bindings.

```sql
CREATE TABLE dbo.RequestLog (
    Id int identity(1,1) primary key,
    RequestTimeStamp datetime2 not null,
    ItemCount int not null
)
```


```cs
namespace AzureSQL.ToDo
{
    public static class PostToDo
    {
        // create a new ToDoItem from body object
        // uses output binding to insert new item into ToDo table
        [FunctionName("PostToDo")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "PostFunction")] HttpRequest req,
            ILogger log,
            [Sql("dbo.ToDo", ConnectionStringSetting = "SqlConnectionString")] IAsyncCollector<ToDoItem> toDoItems,
            [Sql("dbo.RequestLog", ConnectionStringSetting = "SqlConnectionString")] IAsyncCollector<RequestLog> requestLogs)
        {
            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            ToDoItem toDoItem = JsonConvert.DeserializeObject<ToDoItem>(requestBody);

            // generate a new id for the todo item
            toDoItem.Id = Guid.NewGuid();

            // set Url from env variable ToDoUri
            toDoItem.url = Environment.GetEnvironmentVariable("ToDoUri")+"?id="+toDoItem.Id.ToString();

            // if completed is not provided, default to false
            if (toDoItem.completed == null)
            {
                toDoItem.completed = false;
            }

            await toDoItems.AddAsync(toDoItem);
            await toDoItems.FlushAsync();
            List<ToDoItem> toDoItemList = new List<ToDoItem> { toDoItem };

            requestLog = new RequestLog();
            requestLog.RequestTimeStamp = DateTime.Now;
            requestLog.ItemCount = 1;
            await requestLogs.AddAsync(requestLog);
            await requestLogs.FlushAsync();

            return new OkObjectResult(toDoItemList);
        }
    }

    public class RequestLog {
        public DateTime RequestTimeStamp { get; set; }
        public int ItemCount { get; set; }
    }
}
```

<a id="http-trigger-write-records-using-iasynccollector-c"></a>

### HTTP trigger, write records using IAsyncCollector

The following example shows a [C# function](functions-dotnet-class-library.md) that adds a collection of records to a database, using data provided in an HTTP POST body JSON array.

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
            [Sql("dbo.ToDo", ConnectionStringSetting = "SqlConnectionString")] IAsyncCollector<ToDoItem> newItems)
        {
            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var incomingItems = JsonConvert.DeserializeObject<ToDoItem[]>(requestBody);
            foreach (ToDoItem newItem in incomingItems)
            {
                await newItems.AddAsync(newItem);
            }
            // Rows are upserted here
            await newItems.FlushAsync();

            return new CreatedResult($"/api/addtodo-asynccollector", "done");
        }
    }
}
```


# [Isolated process](#tab/isolated-process)

Isolated process isn't currently supported.

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

More samples for the Azure SQL output binding are available in the [GitHub repository](https://github.com/Azure/azure-functions-sql-extension/tree/main/samples/samples-js).

This section contains the following examples:

* [HTTP trigger, write records to a table](#http-trigger-write-records-to-table-javascript)
* [HTTP trigger, write to two tables](#http-trigger-write-to-two-tables-javascript)

The examples refer to a database table:

:::code language="sql" source="~/functions-sql-todo-sample/sql/create.sql" range="1-7":::


<a id="http-trigger-write-records-to-table-javascript"></a>
### HTTP trigger, write records to a table

The following example shows a SQL input binding in a function.json file and a JavaScript function that adds records to a table, using data provided in an HTTP POST request as a JSON body.

The following is binding data in the function.json file:

```json
{
    "authLevel": "anonymous",
    "type": "httpTrigger",
    "direction": "in",
    "name": "req",
    "methods": [
        "post"
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
    "direction": "out",
    "commandText": "dbo.ToDo",
    "connectionStringSetting": "SqlConnectionString"
}
```

The [configuration](#configuration) section explains these properties.

The following is sample JavaScript code:

```javascript
module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger and SQL output binding function processed a request.');
    context.log(req.body);

    if (req.body) {
        context.bindings.todoItems = req.body;
        context.res = {
            body: req.body,
            mimetype: "application/json",
            status: 201
        }
    } else {
        context.res = {
            status: 400,
            body: "Error reading request body"
        }
    }
}
```

<a id="http-trigger-write-to-two-tables-javascript"></a>
### HTTP trigger, write to two tables

The following example shows a SQL input binding in a function.json file and a JavaScript function that adds records to a database in two different tables (`dbo.ToDo` and `dbo.RequestLog`), using data provided in an HTTP POST request as a JSON body and multiple output bindings.

The second table, `dbo.RequestLog`, corresponds to the following definition:

```sql
CREATE TABLE dbo.RequestLog (
    Id int identity(1,1) primary key,
    RequestTimeStamp datetime2 not null,
    ItemCount int not null
)
```

The following is binding data in the function.json file:

```json
{
    "authLevel": "anonymous",
    "type": "httpTrigger",
    "direction": "in",
    "name": "req",
    "methods": [
        "post"
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
    "direction": "out",
    "commandText": "dbo.ToDo",
    "connectionStringSetting": "SqlConnectionString"
},
{
    "name": "requestLog",
    "type": "sql",
    "direction": "out",
    "commandText": "dbo.RequestLog",
    "connectionStringSetting": "SqlConnectionString"
}
```

The [configuration](#configuration) section explains these properties.

The following is sample JavaScript code:

```javascript
module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger and SQL output binding function processed a request.');
    context.log(req.body);

    const newLog = {
        RequestTimeStamp = Date.now(),
        ItemCount = 1
    }

    if (req.body) {
        context.bindings.todoItems = req.body;
        context.bindings.requestLog = newLog;
        context.res = {
            body: req.body,
            mimetype: "application/json",
            status: 201
        }
    } else {
        context.res = {
            status: 400,
            body: "Error reading request body"
        }
    }
}
```


::: zone-end  
::: zone pivot="programming-language-python"  

More samples for the Azure SQL output binding are available in the [GitHub repository](https://github.com/Azure/azure-functions-sql-extension/tree/main/samples/samples-python).

This section contains the following examples:

* [HTTP trigger, write records to a table](#http-trigger-write-records-to-table-python)
* [HTTP trigger, write to two tables](#http-trigger-write-to-two-tables-python)

The examples refer to a database table:

:::code language="sql" source="~/functions-sql-todo-sample/sql/create.sql" range="1-7":::


<a id="http-trigger-write-records-to-table-python"></a>
### HTTP trigger, write records to a table

The following example shows a SQL input binding in a function.json file and a Python function that adds records to a table, using data provided in an HTTP POST request as a JSON body.

The following is binding data in the function.json file:

```json
{
    "authLevel": "anonymous",
    "type": "httpTrigger",
    "direction": "in",
    "name": "req",
    "methods": [
        "post"
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
    "direction": "out",
    "commandText": "dbo.ToDo",
    "connectionStringSetting": "SqlConnectionString"
}
```

The [configuration](#configuration) section explains these properties.

The following is sample Python code:

```python
import logging
import azure.functions as func


def main(req: func.HttpRequest, todoItems: func.Out[func.SqlRow]) -> func.HttpResponse:
    logging.info('Python HTTP trigger and SQL output binding function processed a request.')

    try:
        req_body = req.get_json()
        rows = list(map(lambda r: json.loads(r.to_json()), req_body))
    except ValueError:
        pass

    if req_body:
        todoItems.set(rows)
        return func.HttpResponse(
            todoItems.to_json(),
            status_code=201,
            mimetype="application/json"
        )
    else:
        return func.HttpResponse(
            "Error accessing request body",
            status_code=400
        )
```

<a id="http-trigger-write-to-two-tables-python"></a>
### HTTP trigger, write to two tables

The following example shows a SQL input binding in a function.json file and a Python function that adds records to a database in two different tables (`dbo.ToDo` and `dbo.RequestLog`), using data provided in an HTTP POST request as a JSON body and multiple output bindings.

The second table, `dbo.RequestLog`, corresponds to the following definition:

```sql
CREATE TABLE dbo.RequestLog (
    Id int identity(1,1) primary key,
    RequestTimeStamp datetime2 not null,
    ItemCount int not null
)
```

The following is binding data in the function.json file:

```json
{
    "authLevel": "anonymous",
    "type": "httpTrigger",
    "direction": "in",
    "name": "req",
    "methods": [
        "post"
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
    "direction": "out",
    "commandText": "dbo.ToDo",
    "connectionStringSetting": "SqlConnectionString"
},
{
    "name": "requestLog",
    "type": "sql",
    "direction": "out",
    "commandText": "dbo.RequestLog",
    "connectionStringSetting": "SqlConnectionString"
}
```

The [configuration](#configuration) section explains these properties.

The following is sample Python code:

```python
import logging
from datetime import datetime
import azure.functions as func


def main(req: func.HttpRequest, todoItems: func.Out[func.SqlRow], requestLog: func.Out[func.SqlRow]) -> func.HttpResponse:
    logging.info('Python HTTP trigger and SQL output binding function processed a request.')

    try:
        req_body = req.get_json()
        rows = list(map(lambda r: json.loads(r.to_json()), req_body))
    except ValueError:
        pass

    requestLog.set(func.SqlRow({
        RequestTimeStamp: datetime.now(),
        ItemCount: 1
    }))

    if req_body:
        todoItems.set(rows)
        return func.HttpResponse(
            todoItems.to_json(),
            status_code=201,
            mimetype="application/json"
        )
    else:
        return func.HttpResponse(
            "Error accessing request body",
            status_code=400
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
| **CommandText** | Required. The name of the table being written to by the binding.  |
| **ConnectionStringSetting** | Required. The name of an app setting that contains the connection string for the database to which data is being written. This isn't the actual connection string and must instead resolve to an environment variable. | 


::: zone-end  
<!---### Use these pivots when we get other non-C# languages added. ###
::: zone pivot="programming-language-java"  
## Annotations

In the [Java functions runtime library](/java/api/overview/azure/functions/runtime), use the `@Sql` annotation on parameters whose value would come from Azure SQL. This annotation supports the following elements:

| Element |Description|
|---------|---------|
| **commandText** | Required. The Transact-SQL query command or name of the stored procedure executed by the binding.  |
| **connectionStringSetting** | The name of an app setting that contains the connection string for the database to which data is being written. This isn't the actual connection string and must instead resolve to an environment variable.| 

::: zone-end  
-->

::: zone pivot="programming-language-javascript,programming-language-python"  
## Configuration

The following table explains the binding configuration properties that you set in the *function.json* file.

|function.json property | Description|
|---------|----------------------|
|**type** | Required. Must be set to `sql`.|
|**direction** | Required. Must be set to `out`. |
|**name** | Required. The name of the variable that represents the entity in function code. | 
| **commandText** | Required. The name of the table being written to by the binding.  |
| **connectionStringSetting** | Required. The name of an app setting that contains the connection string for the database to which data is being written. This isn't the actual connection string and must instead resolve to an environment variable. Optional keywords in the connection string value are [available to refine SQL bindings connectivity](./functions-bindings-azure-sql.md#sql-connection-string). |

::: zone-end  

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

## Usage

::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-python"
The `CommandText` property is the name of the table where the data is to be stored. The connection string setting name corresponds to the application setting that contains the [connection string](/dotnet/api/microsoft.data.sqlclient.sqlconnection.connectionstring?view=sqlclient-dotnet-core-3.1&preserve-view=true#Microsoft_Data_SqlClient_SqlConnection_ConnectionString) to the Azure SQL or SQL Server instance.

The output bindings uses the T-SQL [MERGE](/sql/t-sql/statements/merge-transact-sql) statement which requires [SELECT](/sql/t-sql/statements/merge-transact-sql#permissions) permissions on the target database. 

::: zone-end

## Next steps

- [Read data from a database (Input binding)](./functions-bindings-azure-sql-input.md)
- [Review ToDo API sample with Azure SQL bindings](/samples/azure-samples/azure-sql-binding-func-dotnet-todo/todo-backend-dotnet-azure-sql-bindings-azure-functions/)
