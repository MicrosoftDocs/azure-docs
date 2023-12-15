---
title: Azure SQL input binding for Functions
description: Learn to use the Azure SQL input binding in Azure Functions.
author: dzsquared
ms.topic: reference
ms.custom: event-tier1-build-2022, build-2023, devx-track-extended-java, devx-track-js, devx-track-python
ms.date: 4/17/2023
ms.author: drskwier
ms.reviewer: glenga
zone_pivot_groups: programming-languages-set-functions
---

# Azure SQL input binding for Azure Functions

When a function runs, the Azure SQL input binding retrieves data from a database and passes it to the input parameter of the function. 

For information on setup and configuration details, see the [overview](./functions-bindings-azure-sql.md).

::: zone pivot="programming-language-javascript,programming-language-typescript"
[!INCLUDE [functions-nodejs-model-tabs-description](../../includes/functions-nodejs-model-tabs-description.md)]
::: zone-end

## Examples
<a id="example"></a>

::: zone pivot="programming-language-csharp"

[!INCLUDE [functions-bindings-csharp-intro-with-csx](../../includes/functions-bindings-csharp-intro-with-csx.md)]

# [Isolated worker model](#tab/isolated-process)

More samples for the Azure SQL input binding are available in the [GitHub repository](https://github.com/Azure/azure-functions-sql-extension/tree/main/samples/samples-outofproc).

This section contains the following examples:

* [HTTP trigger, get row by ID from query string](#http-trigger-look-up-id-from-query-string-c-oop)
* [HTTP trigger, get multiple rows from route data](#http-trigger-get-multiple-items-from-route-data-c-oop)
* [HTTP trigger, delete rows](#http-trigger-delete-one-or-multiple-rows-c-oop)

The examples refer to a `ToDoItem` class and a corresponding database table:

:::code language="csharp" source="~/functions-sql-todo-sample/ToDoModel.cs" range="6-16":::

:::code language="sql" source="~/functions-sql-todo-sample/sql/create.sql" range="1-7":::

<a id="http-trigger-look-up-id-from-query-string-c-oop"></a>
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
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Extensions.Sql;
using Microsoft.Azure.Functions.Worker.Http;

namespace AzureSQLSamples
{
    public static class GetToDoItem
    {
        [FunctionName("GetToDoItem")]
        public static IActionResult Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "gettodoitem")]
            HttpRequest req,
            [SqlInput(commandText: "select [Id], [order], [title], [url], [completed] from dbo.ToDo where Id = @Id",
                commandType: System.Data.CommandType.Text,
                parameters: "@Id={Query.id}",
                connectionStringSetting: "SqlConnectionString")]
            IEnumerable<ToDoItem> toDoItem)
        {
            return new OkObjectResult(toDoItem.FirstOrDefault());
        }
    }
}
```

<a id="http-trigger-get-multiple-items-from-route-data-c-oop"></a>
### HTTP trigger, get multiple rows from route parameter

The following example shows a [C# function](functions-dotnet-class-library.md) that retrieves documents returned by the query. The function is triggered by an HTTP request that uses route data to specify the value of a query parameter. That parameter is used to filter the `ToDoItem` records in the specified query.

```cs
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Extensions.Sql;
using Microsoft.Azure.Functions.Worker.Http;

namespace AzureSQLSamples
{
    public static class GetToDoItems
    {
        [FunctionName("GetToDoItems")]
        public static IActionResult Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "gettodoitems/{priority}")]
            HttpRequest req,
            [SqlInput(commandText: "select [Id], [order], [title], [url], [completed] from dbo.ToDo where [Priority] > @Priority",
                commandType: System.Data.CommandType.Text,
                parameters: "@Priority={priority}",
                connectionStringSetting: "SqlConnectionString")]
            IEnumerable<ToDoItem> toDoItems)
        {
            return new OkObjectResult(toDoItems);
        }
    }
}
```

<a id="http-trigger-delete-one-or-multiple-rows-c-oop"></a>
### HTTP trigger, delete rows

The following example shows a [C# function](functions-dotnet-class-library.md) that executes a stored procedure with input from the HTTP request query parameter.

The stored procedure `dbo.DeleteToDo` must be created on the SQL database.  In this example, the stored procedure deletes a single record or all records depending on the value of the parameter.

:::code language="sql" source="~/functions-sql-todo-sample/sql/create.sql" range="11-25":::

```cs
namespace AzureSQL.ToDo
{
    public static class DeleteToDo
    {
        // delete all items or a specific item from querystring
        // returns remaining items
        // uses input binding with a stored procedure DeleteToDo to delete items and return remaining items
        [FunctionName("DeleteToDo")]
        public static IActionResult Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "DeleteFunction")] HttpRequest req,
            ILogger log,
            [SqlInput(commandText: "DeleteToDo", commandType: System.Data.CommandType.StoredProcedure, 
                parameters: "@Id={Query.id}", connectionStringSetting: "SqlConnectionString")] 
                IEnumerable<ToDoItem> toDoItems)
        {
            return new OkObjectResult(toDoItems);
        }
    }
}
```

# [In-process model](#tab/in-process)

More samples for the Azure SQL input binding are available in the [GitHub repository](https://github.com/Azure/azure-functions-sql-extension/tree/main/samples/samples-csharp).

This section contains the following examples:

* [HTTP trigger, get row by ID from query string](#http-trigger-look-up-id-from-query-string-c)
* [HTTP trigger, get multiple rows from route data](#http-trigger-get-multiple-items-from-route-data-c)
* [HTTP trigger, delete rows](#http-trigger-delete-one-or-multiple-rows-c)

The examples refer to a `ToDoItem` class and a corresponding database table:

:::code language="csharp" source="~/functions-sql-todo-sample/ToDoModel.cs" range="6-16":::

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
            [Sql(commandText: "select [Id], [order], [title], [url], [completed] from dbo.ToDo where Id = @Id",
                commandType: System.Data.CommandType.Text,
                parameters: "@Id={Query.id}",
                connectionStringSetting: "SqlConnectionString")]
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
            [Sql(commandText: "select [Id], [order], [title], [url], [completed] from dbo.ToDo where [Priority] > @Priority",
                commandType: System.Data.CommandType.Text,
                parameters: "@Priority={priority}",
                connectionStringSetting: "SqlConnectionString")]
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

---

::: zone-end

::: zone pivot="programming-language-java"


More samples for the Azure SQL input binding are available in the [GitHub repository](https://github.com/Azure/azure-functions-sql-extension/tree/main/samples/samples-java).

This section contains the following examples:

* [HTTP trigger, get multiple rows](#http-trigger-get-multiple-items-java)
* [HTTP trigger, get row by ID from query string](#http-trigger-look-up-id-from-query-string-java)
* [HTTP trigger, delete rows](#http-trigger-delete-one-or-multiple-rows-java)

The examples refer to a `ToDoItem` class (in a separate file `ToDoItem.java`) and a corresponding database table:

```java
package com.function;
import java.util.UUID;

public class ToDoItem {
    public UUID Id;
    public int order;
    public String title;
    public String url;
    public boolean completed;

    public ToDoItem() {
    }

    public ToDoItem(UUID Id, int order, String title, String url, boolean completed) {
        this.Id = Id;
        this.order = order;
        this.title = title;
        this.url = url;
        this.completed = completed;
    }
}
```

:::code language="sql" source="~/functions-sql-todo-sample/sql/create.sql" range="1-7":::

<a id="http-trigger-get-multiple-items-java"></a>
### HTTP trigger, get multiple rows

The following example shows a SQL input binding in a Java function that reads from a query and returns the results in the HTTP response.

```java
package com.function;

import com.microsoft.azure.functions.HttpMethod;
import com.microsoft.azure.functions.HttpRequestMessage;
import com.microsoft.azure.functions.HttpResponseMessage;
import com.microsoft.azure.functions.HttpStatus;
import com.microsoft.azure.functions.annotation.AuthorizationLevel;
import com.microsoft.azure.functions.annotation.FunctionName;
import com.microsoft.azure.functions.annotation.HttpTrigger;
import com.microsoft.azure.functions.sql.annotation.SQLInput;

import java.util.Optional;

public class GetToDoItems {
    @FunctionName("GetToDoItems")
    public HttpResponseMessage run(
            @HttpTrigger(
                name = "req",
                methods = {HttpMethod.GET},
                authLevel = AuthorizationLevel.ANONYMOUS)
                HttpRequestMessage<Optional<String>> request,
            @SQLInput(
                name = "toDoItems",
                commandText = "SELECT * FROM dbo.ToDo",
                commandType = "Text",
                connectionStringSetting = "SqlConnectionString")
                ToDoItem[] toDoItems) {
        return request.createResponseBuilder(HttpStatus.OK).header("Content-Type", "application/json").body(toDoItems).build();
    }
}
```

<a id="http-trigger-look-up-id-from-query-string-java"></a>
### HTTP trigger, get row by ID from query string

The following example shows a SQL input binding in a Java function that reads from a query filtered by a parameter from the query string and returns the row in the HTTP response.

```java
public class GetToDoItem {
    @FunctionName("GetToDoItem")
    public HttpResponseMessage run(
            @HttpTrigger(
                name = "req",
                methods = {HttpMethod.GET},
                authLevel = AuthorizationLevel.ANONYMOUS)
                HttpRequestMessage<Optional<String>> request,
            @SQLInput(
                name = "toDoItems",
                commandText = "SELECT * FROM dbo.ToDo",
                commandType = "Text",
                parameters = "@Id={Query.id}",
                connectionStringSetting = "SqlConnectionString")
                ToDoItem[] toDoItems) {
        ToDoItem toDoItem = toDoItems[0];
        return request.createResponseBuilder(HttpStatus.OK).header("Content-Type", "application/json").body(toDoItem).build();
    }
}
```

<a id="http-trigger-delete-one-or-multiple-rows-java"></a>
### HTTP trigger, delete rows

The following example shows a SQL input binding in a Java function that executes a stored procedure with input from the HTTP request query parameter.

The stored procedure `dbo.DeleteToDo` must be created on the database.  In this example, the stored procedure deletes a single record or all records depending on the value of the parameter.

:::code language="sql" source="~/functions-sql-todo-sample/sql/create.sql" range="11-25":::


```java
public class DeleteToDo {
    @FunctionName("DeleteToDo")
    public HttpResponseMessage run(
            @HttpTrigger(
                name = "req",
                methods = {HttpMethod.GET},
                authLevel = AuthorizationLevel.ANONYMOUS)
                HttpRequestMessage<Optional<String>> request,
            @SQLInput(
                name = "toDoItems",
                commandText = "dbo.DeleteToDo",
                commandType = "StoredProcedure",
                parameters = "@Id={Query.id}",
                connectionStringSetting = "SqlConnectionString")
                ToDoItem[] toDoItems) {
        return request.createResponseBuilder(HttpStatus.OK).header("Content-Type", "application/json").body(toDoItems).build();
    }
}

```

::: zone-end

::: zone pivot="programming-language-javascript,programming-language-typescript"

More samples for the Azure SQL input binding are available in the [GitHub repository](https://github.com/Azure/azure-functions-sql-extension/tree/main/samples/samples-js).

This section contains the following examples:

* [HTTP trigger, get multiple rows](#http-trigger-get-multiple-items-javascript)
* [HTTP trigger, get row by ID from query string](#http-trigger-look-up-id-from-query-string-javascript)
* [HTTP trigger, delete rows](#http-trigger-delete-one-or-multiple-rows-javascript)

The examples refer to a database table:

:::code language="sql" source="~/functions-sql-todo-sample/sql/create.sql" range="1-7":::

<a id="http-trigger-get-multiple-items-javascript"></a>
### HTTP trigger, get multiple rows

The following example shows a SQL input binding that reads from a query and returns the results in the HTTP response.

::: zone-end
::: zone pivot="programming-language-typescript"  

# [Model v4](#tab/nodejs-v4)

:::code language="typescript" source="~/azure-functions-nodejs-v4/ts/src/functions/sqlInput1.ts" :::

# [Model v3](#tab/nodejs-v3)

TypeScript samples are not documented for model v3.

---

::: zone-end
::: zone pivot="programming-language-javascript"  

# [Model v4](#tab/nodejs-v4)

:::code language="javascript" source="~/azure-functions-nodejs-v4/js/src/functions/sqlInput1.js" :::

# [Model v3](#tab/nodejs-v3)

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

---

::: zone-end
::: zone pivot="programming-language-javascript,programming-language-typescript"

<a id="http-trigger-look-up-id-from-query-string-javascript"></a>
### HTTP trigger, get row by ID from query string

The following example shows a SQL input binding that reads from a query filtered by a parameter from the query string and returns the row in the HTTP response.

::: zone-end
::: zone pivot="programming-language-typescript"  

# [Model v4](#tab/nodejs-v4)

:::code language="typescript" source="~/azure-functions-nodejs-v4/ts/src/functions/sqlInput2.ts" :::

# [Model v3](#tab/nodejs-v3)

TypeScript samples are not documented for model v3.

---

::: zone-end
::: zone pivot="programming-language-javascript"  

# [Model v4](#tab/nodejs-v4)

:::code language="javascript" source="~/azure-functions-nodejs-v4/js/src/functions/sqlInput2.js" :::

# [Model v3](#tab/nodejs-v3)

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

---

::: zone-end
::: zone pivot="programming-language-javascript,programming-language-typescript"

<a id="http-trigger-delete-one-or-multiple-rows-javascript"></a>
### HTTP trigger, delete rows

The following example shows a SQL input binding that executes a stored procedure with input from the HTTP request query parameter.

The stored procedure `dbo.DeleteToDo` must be created on the database.  In this example, the stored procedure deletes a single record or all records depending on the value of the parameter.

:::code language="sql" source="~/functions-sql-todo-sample/sql/create.sql" range="11-25":::

::: zone-end
::: zone pivot="programming-language-typescript"  

# [Model v4](#tab/nodejs-v4)

:::code language="typescript" source="~/azure-functions-nodejs-v4/ts/src/functions/sqlInput3.ts" :::

# [Model v3](#tab/nodejs-v3)

TypeScript samples are not documented for model v3.

---

::: zone-end
::: zone pivot="programming-language-javascript"  

# [Model v4](#tab/nodejs-v4)

:::code language="javascript" source="~/azure-functions-nodejs-v4/js/src/functions/sqlInput3.js" :::

# [Model v3](#tab/nodejs-v3)

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

---

::: zone-end
::: zone pivot="programming-language-powershell"

More samples for the Azure SQL input binding are available in the [GitHub repository](https://github.com/Azure/azure-functions-sql-extension/tree/main/samples/samples-powershell).

This section contains the following examples:

* [HTTP trigger, get multiple rows](#http-trigger-get-multiple-items-powershell)
* [HTTP trigger, get row by ID from query string](#http-trigger-look-up-id-from-query-string-powershell)
* [HTTP trigger, delete rows](#http-trigger-delete-one-or-multiple-rows-powershell)

The examples refer to a database table:

:::code language="sql" source="~/functions-sql-todo-sample/sql/create.sql" range="1-7":::

<a id="http-trigger-get-multiple-items-powershell"></a>
### HTTP trigger, get multiple rows

The following example shows a SQL input binding in a function.json file and a PowerShell function that reads from a query and returns the results in the HTTP response.

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

The following is sample PowerShell code for the function in the `run.ps1` file:

```powershell
using namespace System.Net

param($Request, $todoItems)

Write-Host "PowerShell function with SQL Input Binding processed a request."

Push-OutputBinding -Name res -Value ([HttpResponseContext]@{
    StatusCode = [System.Net.HttpStatusCode]::OK
    Body = $todoItems
})
```

<a id="http-trigger-look-up-id-from-query-string-powershell"></a>
### HTTP trigger, get row by ID from query string

The following example shows a SQL input binding in a PowerShell function that reads from a query filtered by a parameter from the query string and returns the row in the HTTP response.

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

The following is sample PowerShell code for the function in the `run.ps1` file:


```powershell
using namespace System.Net

param($Request, $todoItem)

Write-Host "PowerShell function with SQL Input Binding processed a request."

Push-OutputBinding -Name res -Value ([HttpResponseContext]@{
    StatusCode = [System.Net.HttpStatusCode]::OK
    Body = $todoItem
})
```

<a id="http-trigger-delete-one-or-multiple-rows-powershell"></a>
### HTTP trigger, delete rows

The following example shows a SQL input binding in a function.json file and a PowerShell function that executes a stored procedure with input from the HTTP request query parameter.

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

The following is sample PowerShell code for the function in the `run.ps1` file:


```powershell
using namespace System.Net

param($Request, $todoItems)

Write-Host "PowerShell function with SQL Input Binding processed a request."

Push-OutputBinding -Name res -Value ([HttpResponseContext]@{
    StatusCode = [System.Net.HttpStatusCode]::OK
    Body = $todoItems
})
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


::: zone pivot="programming-language-csharp"
## Attributes 

The [C# library](functions-dotnet-class-library.md) uses the [SqlAttribute](https://github.com/Azure/azure-functions-sql-extension/blob/main/src/SqlAttribute.cs) attribute to declare the SQL bindings on the function, which has the following properties:

| Attribute property |Description|
|---------|---------|
| **CommandText** | Required. The Transact-SQL query command or name of the stored procedure executed by the binding.  |
| **ConnectionStringSetting** | Required. The name of an app setting that contains the connection string for the database against which the query or stored procedure is being executed. This value isn't the actual connection string and must instead resolve to an environment variable name. | 
| **CommandType** | Required. A [CommandType](/dotnet/api/system.data.commandtype) value, which is [Text](/dotnet/api/system.data.commandtype#fields) for a query and [StoredProcedure](/dotnet/api/system.data.commandtype#fields) for a stored procedure. |
| **Parameters** | Optional. Zero or more parameter values passed to the command during execution as a single string. Must follow the format `@param1=param1,@param2=param2`. Neither the parameter name nor the parameter value can contain a comma (`,`) or an equals sign (`=`). |

::: zone-end  

::: zone pivot="programming-language-java"  
## Annotations

In the [Java functions runtime library](/java/api/overview/azure/functions/runtime), use the `@SQLInput` annotation (`com.microsoft.azure.functions.sql.annotation.SQLInput`) on parameters whose value would come from Azure SQL. This annotation supports the following elements:

| Element |Description|
|---------|---------|
| **commandText** | Required. The Transact-SQL query command or name of the stored procedure executed by the binding.  |
| **connectionStringSetting** | Required. The name of an app setting that contains the connection string for the database against which the query or stored procedure is being executed. This value isn't the actual connection string and must instead resolve to an environment variable name. | 
| **commandType** | Required. A [CommandType](/dotnet/api/system.data.commandtype) value, which is ["Text"](/dotnet/api/system.data.commandtype#fields) for a query and ["StoredProcedure"](/dotnet/api/system.data.commandtype#fields) for a stored procedure. |
|**name** |  Required. The unique name of the function binding. | 
| **parameters** | Optional. Zero or more parameter values passed to the command during execution as a single string. Must follow the format `@param1=param1,@param2=param2`. Neither the parameter name nor the parameter value can contain a comma (`,`) or an equals sign (`=`). |

::: zone-end 
::: zone pivot="programming-language-javascript,programming-language-typescript"  

## Configuration

# [Model v4](#tab/nodejs-v4)

The following table explains the properties that you can set on the `options` object passed to the `input.sql()` method.

| Property | Description |
|---------|----------------------|
| **commandText** | Required. The Transact-SQL query command or name of the stored procedure executed by the binding.  |
| **connectionStringSetting** | Required. The name of an app setting that contains the connection string for the database against which the query or stored procedure is being executed. This value isn't the actual connection string and must instead resolve to an environment variable name.  Optional keywords in the connection string value are [available to refine SQL bindings connectivity](./functions-bindings-azure-sql.md#sql-connection-string). |
| **commandType** | Required. A [CommandType](/dotnet/api/system.data.commandtype) value, which is [Text](/dotnet/api/system.data.commandtype#fields) for a query and [StoredProcedure](/dotnet/api/system.data.commandtype#fields) for a stored procedure. |
| **parameters** | Optional. Zero or more parameter values passed to the command during execution as a single string. Must follow the format `@param1=param1,@param2=param2`. Neither the parameter name nor the parameter value can contain a comma (`,`) or an equals sign (`=`). |

# [Model v3](#tab/nodejs-v3)

The following table explains the binding configuration properties that you set in the function.json file.

| Property | Description |
|---------|----------------------|
|**type** |  Required. Must be set to `sql`. |
|**direction** | Required. Must be set to `in`. |
|**name** |  Required. The name of the variable that represents the query results in function code. | 
| **commandText** | Required. The Transact-SQL query command or name of the stored procedure executed by the binding.  |
| **connectionStringSetting** | Required. The name of an app setting that contains the connection string for the database against which the query or stored procedure is being executed. This value isn't the actual connection string and must instead resolve to an environment variable name.  Optional keywords in the connection string value are [available to refine SQL bindings connectivity](./functions-bindings-azure-sql.md#sql-connection-string). |
| **commandType** | Required. A [CommandType](/dotnet/api/system.data.commandtype) value, which is [Text](/dotnet/api/system.data.commandtype#fields) for a query and [StoredProcedure](/dotnet/api/system.data.commandtype#fields) for a stored procedure. |
| **parameters** | Optional. Zero or more parameter values passed to the command during execution as a single string. Must follow the format `@param1=param1,@param2=param2`. Neither the parameter name nor the parameter value can contain a comma (`,`) or an equals sign (`=`). |

---

::: zone-end
::: zone pivot="programming-language-powershell,programming-language-python"  
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

The attribute's constructor takes the SQL command text, the command type, parameters, and the connection string setting name. The command can be a Transact-SQL (T-SQL) query with the command type `System.Data.CommandType.Text` or stored procedure name with the command type `System.Data.CommandType.StoredProcedure`. The connection string setting name corresponds to the application setting (in `local.settings.json` for local development) that contains the [connection string](/dotnet/api/microsoft.data.sqlclient.sqlconnection.connectionstring?view=sqlclient-dotnet-core-5.0&preserve-view=true#Microsoft_Data_SqlClient_SqlConnection_ConnectionString) to the Azure SQL or SQL Server instance.

Queries executed by the input binding are [parameterized](/dotnet/api/microsoft.data.sqlclient.sqlparameter) in Microsoft.Data.SqlClient to reduce the risk of [SQL injection](/sql/relational-databases/security/sql-injection) from the parameter values passed into the binding.

If an exception occurs when a SQL input binding is executed then the function code will not execute.  This may result in an error code being returned, such as an HTTP trigger returning a 500 error code.

## Next steps

- [Save data to a database (Output binding)](./functions-bindings-azure-sql-output.md)
- [Run a function when data is changed in a SQL table (Trigger)](./functions-bindings-azure-sql-trigger.md)
- [Review ToDo API sample with Azure SQL bindings](/samples/azure-samples/azure-sql-binding-func-dotnet-todo/todo-backend-dotnet-azure-sql-bindings-azure-functions/)
