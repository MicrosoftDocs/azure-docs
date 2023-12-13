---
title: Azure SQL output binding for Functions
description: Learn to use the Azure SQL output binding in Azure Functions.
author: dzsquared
ms.topic: reference
ms.custom: event-tier1-build-2022, build-2023, devx-track-extended-java, devx-track-js, devx-track-python
ms.date: 4/17/2023
ms.author: drskwier
ms.reviewer: glenga
zone_pivot_groups: programming-languages-set-functions
---

# Azure SQL output binding for Azure Functions

The Azure SQL output binding lets you write to a database.

For information on setup and configuration details, see the [overview](./functions-bindings-azure-sql.md).

::: zone pivot="programming-language-javascript,programming-language-typescript"
[!INCLUDE [functions-nodejs-model-tabs-description](../../includes/functions-nodejs-model-tabs-description.md)]
::: zone-end

## Examples
<a id="example"></a>

::: zone pivot="programming-language-csharp"

[!INCLUDE [functions-bindings-csharp-intro-with-csx](../../includes/functions-bindings-csharp-intro-with-csx.md)]

# [Isolated worker model](#tab/isolated-process)

More samples for the Azure SQL output binding are available in the [GitHub repository](https://github.com/Azure/azure-functions-sql-extension/tree/main/samples/samples-outofproc).

This section contains the following examples:

* [HTTP trigger, write one record](#http-trigger-write-one-record-c-oop)
* [HTTP trigger, write to two tables](#http-trigger-write-to-two-tables-c-oop)

The examples refer to a `ToDoItem` class and a corresponding database table:

:::code language="csharp" source="~/functions-sql-todo-sample/ToDoModel.cs" range="6-16":::

:::code language="sql" source="~/functions-sql-todo-sample/sql/create.sql" range="1-7":::

To return [multiple output bindings](./dotnet-isolated-process-guide.md#multiple-output-bindings) in our samples, we will create a custom return type:

```cs
public static class OutputType
{
    [SqlOutput("dbo.ToDo", connectionStringSetting: "SqlConnectionString")]
    public ToDoItem ToDoItem { get; set; }
    public HttpResponseData HttpResponse { get; set; }
}
```

<a id="http-trigger-write-one-record-c-oop"></a>

### HTTP trigger, write one record

The following example shows a [C# function](functions-dotnet-class-library.md) that adds a record to a database, using data provided in an HTTP POST request as a JSON body.  The return object is the `OutputType` class we created to handle both an HTTP response and the SQL output binding.

```cs
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker.Extensions.Sql;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace AzureSQL.ToDo
{
    public static class PostToDo
    {
        // create a new ToDoItem from body object
        // uses output binding to insert new item into ToDo table
        [FunctionName("PostToDo")]
        public static async Task<OutputType> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "PostFunction")] HttpRequestData req,
                FunctionContext executionContext)
        {
            var logger = executionContext.GetLogger("PostToDo");
            logger.LogInformation("C# HTTP trigger function processed a request.");

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

            return new OutputType()
            {
                ToDoItem = toDoItem,
                HttpResponse = req.CreateResponse(System.Net.HttpStatusCode.Created)
            }
        }
    }

    public static class OutputType
    {
        [SqlOutput("dbo.ToDo", connectionStringSetting: "SqlConnectionString")]
        public ToDoItem ToDoItem { get; set; }

        public HttpResponseData HttpResponse { get; set; }
    }
}
```

<a id="http-trigger-write-to-two-tables-c-oop"></a>

### HTTP trigger, write to two tables

The following example shows a [C# function](functions-dotnet-class-library.md) that adds records to a database in two different tables (`dbo.ToDo` and `dbo.RequestLog`), using data provided in an HTTP POST request as a JSON body and multiple output bindings.

```sql
CREATE TABLE dbo.RequestLog (
    Id int identity(1,1) primary key,
    RequestTimeStamp datetime2 not null,
    ItemCount int not null
)
```

To use an additional output binding, we add a class for `RequestLog` and  modify our `OutputType` class:

```cs
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker.Extensions.Sql;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace AzureSQL.ToDo
{
    public static class PostToDo
    {
        // create a new ToDoItem from body object
        // uses output binding to insert new item into ToDo table
        [FunctionName("PostToDo")]
        public static async Task<OutputType> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "PostFunction")] HttpRequestData req,
                FunctionContext executionContext)
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

            requestLog = new RequestLog();
            requestLog.RequestTimeStamp = DateTime.Now;
            requestLog.ItemCount = 1;

            return new OutputType()
            {
                ToDoItem = toDoItem,
                RequestLog = requestLog,
                HttpResponse = req.CreateResponse(System.Net.HttpStatusCode.Created)
            }
        }
    }

    public class RequestLog {
        public DateTime RequestTimeStamp { get; set; }
        public int ItemCount { get; set; }
    }
    
    public static class OutputType
    {
        [SqlOutput("dbo.ToDo", connectionStringSetting: "SqlConnectionString")]
        public ToDoItem ToDoItem { get; set; }

        [SqlOutput("dbo.RequestLog", connectionStringSetting: "SqlConnectionString")]
        public RequestLog RequestLog { get; set; }

        public HttpResponseData HttpResponse { get; set; }
    }

}
```

# [In-process model](#tab/in-process)

More samples for the Azure SQL output binding are available in the [GitHub repository](https://github.com/Azure/azure-functions-sql-extension/tree/main/samples/samples-csharp).

This section contains the following examples:

* [HTTP trigger, write one record](#http-trigger-write-one-record-c)
* [HTTP trigger, write to two tables](#http-trigger-write-to-two-tables-c)
* [HTTP trigger, write records using IAsyncCollector](#http-trigger-write-records-using-iasynccollector-c)

The examples refer to a `ToDoItem` class and a corresponding database table:

:::code language="csharp" source="~/functions-sql-todo-sample/ToDoModel.cs" range="6-16":::

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
            [Sql(commandText: "dbo.ToDo", connectionStringSetting: "SqlConnectionString")] IAsyncCollector<ToDoItem> toDoItems,
            [Sql(commandText: "dbo.RequestLog", connectionStringSetting: "SqlConnectionString")] IAsyncCollector<RequestLog> requestLogs)
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
            [Sql(commandText: "dbo.ToDo", connectionStringSetting: "SqlConnectionString")] IAsyncCollector<ToDoItem> newItems)
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

---

::: zone-end

::: zone pivot="programming-language-java"

More samples for the Azure SQL output binding are available in the [GitHub repository](https://github.com/Azure/azure-functions-sql-extension/tree/main/samples/samples-java).

This section contains the following examples:

* [HTTP trigger, write a record to a table](#http-trigger-write-record-to-table-java)
* [HTTP trigger, write to two tables](#http-trigger-write-to-two-tables-java)

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

<a id="http-trigger-write-record-to-table-java"></a>
### HTTP trigger, write a record to a table

The following example shows a SQL output binding in a Java function that adds a record to a table, using data provided in an HTTP POST request as a JSON body.  The function takes an additional dependency on the [com.fasterxml.jackson.core](https://github.com/FasterXML/jackson) library to parse the JSON body.

```xml
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.13.4.1</version>
</dependency>
```

```java
package com.function;

import java.util.*;
import com.microsoft.azure.functions.annotation.*;
import com.microsoft.azure.functions.*;
import com.microsoft.azure.functions.sql.annotation.SQLOutput;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Optional;

public class PostToDo {
    @FunctionName("PostToDo")
    public HttpResponseMessage run(
            @HttpTrigger(name = "req", methods = {HttpMethod.POST}, authLevel = AuthorizationLevel.ANONYMOUS) HttpRequestMessage<Optional<String>> request,
            @SQLOutput(
                name = "toDoItem",
                commandText = "dbo.ToDo",
                connectionStringSetting = "SqlConnectionString")
                OutputBinding<ToDoItem> output) throws JsonParseException, JsonMappingException, JsonProcessingException {
        String json = request.getBody().get();
        ObjectMapper mapper = new ObjectMapper();
        ToDoItem newToDo = mapper.readValue(json, ToDoItem.class);

        newToDo.Id = UUID.randomUUID();
        output.setValue(newToDo);

        return request.createResponseBuilder(HttpStatus.CREATED).header("Content-Type", "application/json").body(output).build();
    }
}
```

<a id="http-trigger-write-to-two-tables-java"></a>
### HTTP trigger, write to two tables

The following example shows a SQL output binding in a JavaS function that adds records to a database in two different tables (`dbo.ToDo` and `dbo.RequestLog`), using data provided in an HTTP POST request as a JSON body and multiple output bindings.  The function takes an additional dependency on the [com.fasterxml.jackson.core](https://github.com/FasterXML/jackson) library to parse the JSON body.

```xml
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.13.4.1</version>
</dependency>
```

The second table, `dbo.RequestLog`, corresponds to the following definition:

```sql
CREATE TABLE dbo.RequestLog (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    RequestTimeStamp DATETIME2 NOT NULL DEFAULT(GETDATE()),
    ItemCount INT NOT NULL
)
```

and Java class in `RequestLog.java`:

```java
package com.function;

import java.util.Date;

public class RequestLog {
    public int Id;
    public Date RequestTimeStamp;
    public int ItemCount;

    public RequestLog() {
    }

    public RequestLog(int Id, Date RequestTimeStamp, int ItemCount) {
        this.Id = Id;
        this.RequestTimeStamp = RequestTimeStamp;
        this.ItemCount = ItemCount;
    }
}
```


```java
package com.function;

import java.util.*;
import com.microsoft.azure.functions.annotation.*;
import com.microsoft.azure.functions.*;
import com.microsoft.azure.functions.sql.annotation.SQLOutput;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Optional;

public class PostToDoWithLog {
    @FunctionName("PostToDoWithLog")
    public HttpResponseMessage run(
            @HttpTrigger(name = "req", methods = {HttpMethod.POST}, authLevel = AuthorizationLevel.ANONYMOUS) HttpRequestMessage<Optional<String>> request,
            @SQLOutput(
                name = "toDoItem",
                commandText = "dbo.ToDo",
                connectionStringSetting = "SqlConnectionString")
                OutputBinding<ToDoItem> output,
            @SQLOutput(
                name = "requestLog",
                commandText = "dbo.RequestLog",
                connectionStringSetting = "SqlConnectionString")
                OutputBinding<RequestLog> outputLog,
            final ExecutionContext context) throws JsonParseException, JsonMappingException, JsonProcessingException {
        context.getLogger().info("Java HTTP trigger processed a request.");

        String json = request.getBody().get();
        ObjectMapper mapper = new ObjectMapper();
        ToDoItem newToDo = mapper.readValue(json, ToDoItem.class);
        newToDo.Id = UUID.randomUUID();
        output.setValue(newToDo);

        RequestLog newLog = new RequestLog();
        newLog.ItemCount = 1;
        outputLog.setValue(newLog);

        return request.createResponseBuilder(HttpStatus.CREATED).header("Content-Type", "application/json").body(output).build();
    }
}
```

::: zone-end  

::: zone pivot="programming-language-javascript,programming-language-typescript"

More samples for the Azure SQL output binding are available in the [GitHub repository](https://github.com/Azure/azure-functions-sql-extension/tree/main/samples/samples-js).

This section contains the following examples:

* [HTTP trigger, write records to a table](#http-trigger-write-records-to-table-javascript)
* [HTTP trigger, write to two tables](#http-trigger-write-to-two-tables-javascript)

The examples refer to a database table:

:::code language="sql" source="~/functions-sql-todo-sample/sql/create.sql" range="1-7":::

<a id="http-trigger-write-records-to-table-javascript"></a>
### HTTP trigger, write records to a table

The following example shows a SQL output binding that adds records to a table, using data provided in an HTTP POST request as a JSON body.

::: zone-end
::: zone pivot="programming-language-typescript"  

# [Model v4](#tab/nodejs-v4)

:::code language="typescript" source="~/azure-functions-nodejs-v4/ts/src/functions/sqlOutput1.ts" :::

# [Model v3](#tab/nodejs-v3)

TypeScript samples are not documented for model v3.

---

::: zone-end
::: zone pivot="programming-language-javascript"  

# [Model v4](#tab/nodejs-v4)

:::code language="javascript" source="~/azure-functions-nodejs-v4/js/src/functions/sqlOutput1.js" :::

# [Model v3](#tab/nodejs-v3)

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
    context.log('HTTP trigger and SQL output binding function processed a request.');

    context.bindings.todoItems = req.body;
    context.res = {
        status: 201
    }
}
```
---

::: zone-end
::: zone pivot="programming-language-javascript,programming-language-typescript"

<a id="http-trigger-write-to-two-tables-javascript"></a>
### HTTP trigger, write to two tables

The following example shows a SQL output binding that adds records to a database in two different tables (`dbo.ToDo` and `dbo.RequestLog`), using data provided in an HTTP POST request as a JSON body and multiple output bindings.

The second table, `dbo.RequestLog`, corresponds to the following definition:

```sql
CREATE TABLE dbo.RequestLog (
    Id int identity(1,1) primary key,
    RequestTimeStamp datetime2 not null,
    ItemCount int not null
)
```

::: zone-end
::: zone pivot="programming-language-typescript"

# [Model v4](#tab/nodejs-v4)

:::code language="typescript" source="~/azure-functions-nodejs-v4/ts/src/functions/sqlOutput2.ts" :::

# [Model v3](#tab/nodejs-v3)

TypeScript samples are not documented for model v3.

---

::: zone-end
::: zone pivot="programming-language-javascript"  

# [Model v4](#tab/nodejs-v4)

:::code language="javascript" source="~/azure-functions-nodejs-v4/js/src/functions/sqlOutput2.js" :::

# [Model v3](#tab/nodejs-v3)

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
    context.log('HTTP trigger and SQL output binding function processed a request.');

    const newLog = {
        RequestTimeStamp: Date.now(),
        ItemCount: 1
    };
    context.bindings.requestLog = newLog;

    context.bindings.todoItems = req.body;
    context.res = {
        status: 201
    }
}
```

---

::: zone-end
::: zone pivot="programming-language-powershell"

More samples for the Azure SQL output binding are available in the [GitHub repository](https://github.com/Azure/azure-functions-sql-extension/tree/main/samples/samples-powershell).

This section contains the following examples:

* [HTTP trigger, write records to a table](#http-trigger-write-records-to-table-powershell)
* [HTTP trigger, write to two tables](#http-trigger-write-to-two-tables-powershell)

The examples refer to a database table:

:::code language="sql" source="~/functions-sql-todo-sample/sql/create.sql" range="1-7":::


<a id="http-trigger-write-records-to-table-powershell"></a>
### HTTP trigger, write records to a table

The following example shows a SQL output binding in a function.json file and a PowerShell function that adds records to a table, using data provided in an HTTP POST request as a JSON body.

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

The following is sample PowerShell code for the function in the `run.ps1` file:

```powershell

```powershell
using namespace System.Net

param($Request)

Write-Host "PowerShell function with SQL Output Binding processed a request."

# Update req_body with the body of the request
$req_body = $Request.Body

# Assign the value we want to pass to the SQL Output binding. 
# The -Name value corresponds to the name property in the function.json for the binding
Push-OutputBinding -Name todoItems -Value $req_body

Push-OutputBinding -Name res -Value ([HttpResponseContext]@{
    StatusCode = [HttpStatusCode]::OK
    Body = $req_body
})
```

<a id="http-trigger-write-to-two-tables-powershell"></a>
### HTTP trigger, write to two tables

The following example shows a SQL output binding in a function.json file and a PowerShell function that adds records to a database in two different tables (`dbo.ToDo` and `dbo.RequestLog`), using data provided in an HTTP POST request as a JSON body and multiple output bindings.

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

The following is sample PowerShell code for the function in the `run.ps1` file:

```powershell
using namespace System.Net

param($Request)

Write-Host "PowerShell function with SQL Output Binding processed a request."

# Update req_body with the body of the request
$req_body = $Request.Body
$new_log = @{
    RequestTimeStamp = [DateTime]::Now
    ItemCount = 1
}

Push-OutputBinding -Name todoItems -Value $req_body
Push-OutputBinding -Name requestLog -Value $new_log

Push-OutputBinding -Name res -Value ([HttpResponseContext]@{
    StatusCode = [HttpStatusCode]::OK
    Body = $req_body
})
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

The following example shows a SQL output binding in a function.json file and a Python function that adds records to a table, using data provided in an HTTP POST request as a JSON body.

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
        rows = func.SqlRowList(map(lambda r: func.SqlRow.from_dict(r), req_body))
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

The following example shows a SQL output binding in a function.json file and a Python function that adds records to a database in two different tables (`dbo.ToDo` and `dbo.RequestLog`), using data provided in an HTTP POST request as a JSON body and multiple output bindings.

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
        rows = func.SqlRowList(map(lambda r: func.SqlRow.from_dict(r), req_body))
    except ValueError:
        pass

    requestLog.set(func.SqlRow({
        "RequestTimeStamp": datetime.now(),
        "ItemCount": 1
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


::: zone pivot="programming-language-csharp"
## Attributes 

The [C# library](functions-dotnet-class-library.md) uses the [SqlAttribute](https://github.com/Azure/azure-functions-sql-extension/blob/main/src/SqlAttribute.cs) attribute to declare the SQL bindings on the function, which has the following properties:

| Attribute property |Description|
|---------|---------|
| **CommandText** | Required. The name of the table being written to by the binding.  |
| **ConnectionStringSetting** | Required. The name of an app setting that contains the connection string for the database to which data is being written. This isn't the actual connection string and must instead resolve to an environment variable. | 


::: zone-end  

::: zone pivot="programming-language-java"  
## Annotations

In the [Java functions runtime library](/java/api/overview/azure/functions/runtime), use the `@SQLOutput` annotation (`com.microsoft.azure.functions.sql.annotation.SQLOutput`) on parameters whose value would come from Azure SQL. This annotation supports the following elements:

| Element |Description|
|---------|---------|
| **commandText** | Required.  The name of the table being written to by the binding.  |
| **connectionStringSetting** | Required. The name of an app setting that contains the connection string for the database to which data is being written. This isn't the actual connection string and must instead resolve to an environment variable.| 
|**name** |  Required. The unique name of the function binding. | 

::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript"

## Configuration

# [Model v4](#tab/nodejs-v4)

The following table explains the properties that you can set on the `options` object passed to the `output.sql()` method.

| Property | Description |
|---------|----------------------|
| **commandText** | Required. The name of the table being written to by the binding.  |
| **connectionStringSetting** | Required. The name of an app setting that contains the connection string for the database to which data is being written. This isn't the actual connection string and must instead resolve to an environment variable. Optional keywords in the connection string value are [available to refine SQL bindings connectivity](./functions-bindings-azure-sql.md#sql-connection-string). |

# [Model v3](#tab/nodejs-v3)

The following table explains the binding configuration properties that you set in the *function.json* file.

| Property | Description |
|---------|----------------------|
|**type** | Required. Must be set to `sql`.|
|**direction** | Required. Must be set to `out`. |
|**name** | Required. The name of the variable that represents the entity in function code. | 
| **commandText** | Required. The name of the table being written to by the binding.  |
| **connectionStringSetting** | Required. The name of an app setting that contains the connection string for the database to which data is being written. This isn't the actual connection string and must instead resolve to an environment variable. Optional keywords in the connection string value are [available to refine SQL bindings connectivity](./functions-bindings-azure-sql.md#sql-connection-string). |

---

::: zone-end
::: zone pivot="programming-language-powershell,programming-language-python"
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

The `CommandText` property is the name of the table where the data is to be stored. The connection string setting name corresponds to the application setting that contains the [connection string](/dotnet/api/microsoft.data.sqlclient.sqlconnection.connectionstring?view=sqlclient-dotnet-core-5.0&preserve-view=true#Microsoft_Data_SqlClient_SqlConnection_ConnectionString) to the Azure SQL or SQL Server instance.

The output bindings use the T-SQL [MERGE](/sql/t-sql/statements/merge-transact-sql) statement which requires [SELECT](/sql/t-sql/statements/merge-transact-sql#permissions) permissions on the target database.

If an exception occurs when a SQL output binding is executed then the function code stop executing.  This may result in an error code being returned, such as an HTTP trigger returning a 500 error code.  If the `IAsyncCollector` is used in a .NET function then the function code can handle exceptions throw by the call to `FlushAsync()`.

## Next steps

- [Read data from a database (Input binding)](./functions-bindings-azure-sql-input.md)
- [Run a function when data is changed in a SQL table (Trigger)](./functions-bindings-azure-sql-trigger.md)
- [Review ToDo API sample with Azure SQL bindings](/samples/azure-samples/azure-sql-binding-func-dotnet-todo/todo-backend-dotnet-azure-sql-bindings-azure-functions/)
