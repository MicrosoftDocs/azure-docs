---
title: Azure Cosmos DB input binding for Functions 2.x and higher
description: Learn to use the Azure Cosmos DB input binding in Azure Functions.
ms.topic: reference
ms.date: 03/02/2023
ms.devlang: csharp, java, javascript, powershell, python
ms.custom: devx-track-csharp, devx-track-python, ignite-2022, devx-track-extended-java, devx-track-js
zone_pivot_groups: programming-languages-set-functions
---

# Azure Cosmos DB input binding for Azure Functions 2.x and higher

The Azure Cosmos DB input binding uses the SQL API to retrieve one or more Azure Cosmos DB documents and passes them to the input parameter of the function. The document ID or query parameters can be determined based on the trigger that invokes the function.

For information on setup and configuration details, see the [overview](./functions-bindings-cosmosdb-v2.md).

> [!NOTE]
> When the collection is [partitioned](../cosmos-db/partitioning-overview.md#logical-partitions), lookup operations must also specify the partition key value.
>

::: zone pivot="programming-language-javascript,programming-language-typescript"
[!INCLUDE [functions-nodejs-model-tabs-description](../../includes/functions-nodejs-model-tabs-description.md)]
::: zone-end
::: zone pivot="programming-language-python"
Azure Functions supports two programming models for Python. The way that you define your bindings depends on your chosen programming model.

# [v2](#tab/python-v2)
The Python v2 programming model lets you define bindings using decorators directly in your Python function code. For more information, see the [Python developer guide](functions-reference-python.md?pivots=python-mode-decorators#programming-model).

# [v1](#tab/python-v1)
The Python v1 programming model requires you to define bindings in a separate *function.json* file in the function folder. For more information, see the [Python developer guide](functions-reference-python.md?pivots=python-mode-configuration#programming-model).

---

This article supports both programming models.

::: zone-end

## Example

Unless otherwise noted, examples in this article target version 3.x of the [Azure Cosmos DB extension](functions-bindings-cosmosdb-v2.md). For use with extension version 4.x, you need to replace the string `collection` in property and attribute names with `container`. 

::: zone pivot="programming-language-csharp"

[!INCLUDE [functions-bindings-csharp-intro](../../includes/functions-bindings-csharp-intro.md)]

# [Isolated worker model](#tab/isolated-process)

This section contains examples that require version 3.x of Azure Cosmos DB extension and 5.x of Azure Storage extension. If not already present in your function app, add reference to the following NuGet packages:

  * [Microsoft.Azure.Functions.Worker.Extensions.CosmosDB](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.CosmosDB)
  * [Microsoft.Azure.Functions.Worker.Extensions.Storage.Queues](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Storage.Queues/5.0.0)

* [Queue trigger, look up ID from JSON](#queue-trigger-look-up-id-from-json-isolated)

The examples refer to a simple `ToDoItem` type:

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/CosmosDB/CosmosInputBindingFunctions.cs" range="244-264":::

<a id="queue-trigger-look-up-id-from-json-isolated"></a>

### Queue trigger, look up ID from JSON

The following example shows a function that retrieves a single document. The function is triggered by a JSON message in the storage queue. The queue trigger parses the JSON into an object of type `ToDoItemLookup`, which contains the ID and partition key value to retrieve. That ID and partition key value are used to return a `ToDoItem` document from the specified database and collection.

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/CosmosDB/CosmosInputBindingFunctions.cs" range="244-264":::

# [In-process model](#tab/in-process)

This section contains the following examples for using [in-process C# class library functions](functions-dotnet-class-library.md) with extension version 3.x:

* [Queue trigger, look up ID from JSON](#queue-trigger-look-up-id-from-json-c)
* [HTTP trigger, look up ID from query string](#http-trigger-look-up-id-from-query-string-c)
* [HTTP trigger, look up ID from route data](#http-trigger-look-up-id-from-route-data-c)
* [HTTP trigger, look up ID from route data, using SqlQuery](#http-trigger-look-up-id-from-route-data-using-sqlquery-c)
* [HTTP trigger, get multiple docs, using SqlQuery](#http-trigger-get-multiple-docs-using-sqlquery-c)
* [HTTP trigger, get multiple docs, using DocumentClient](#http-trigger-get-multiple-docs-using-documentclient-c)
* [HTTP trigger, get multiple docs, using CosmosClient (v4 extension)](#http-trigger-get-multiple-docs-using-cosmosclient-c)

The examples refer to a simple `ToDoItem` type:

```cs
namespace CosmosDBSamplesV2
{
    public class ToDoItem
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("partitionKey")]
        public string PartitionKey { get; set; }

        public string Description { get; set; }
    }
}
```

<a id="queue-trigger-look-up-id-from-json-c"></a>

### Queue trigger, look up ID from JSON

The following example shows a [C# function](functions-dotnet-class-library.md) that retrieves a single document. The function is triggered by a queue message that contains a JSON object. The queue trigger parses the JSON into an object of type `ToDoItemLookup`, which contains the ID and partition key value to look up. That ID and partition key value are used to retrieve a `ToDoItem` document from the specified database and collection.

```cs
namespace CosmosDBSamplesV2
{
    public class ToDoItemLookup
    {
        public string ToDoItemId { get; set; }

        public string ToDoItemPartitionKeyValue { get; set; }
    }
}
```

```cs
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.Logging;

namespace CosmosDBSamplesV2
{
    public static class DocByIdFromJSON
    {
        [FunctionName("DocByIdFromJSON")]
        public static void Run(
            [QueueTrigger("todoqueueforlookup")] ToDoItemLookup toDoItemLookup,
            [CosmosDB(
                databaseName: "ToDoItems",
                collectionName: "Items",
                ConnectionStringSetting = "CosmosDBConnection",
                Id = "{ToDoItemId}",
                PartitionKey = "{ToDoItemPartitionKeyValue}")]ToDoItem toDoItem,
            ILogger log)
        {
            log.LogInformation($"C# Queue trigger function processed Id={toDoItemLookup?.ToDoItemId} Key={toDoItemLookup?.ToDoItemPartitionKeyValue}");

            if (toDoItem == null)
            {
                log.LogInformation($"ToDo item not found");
            }
            else
            {
                log.LogInformation($"Found ToDo item, Description={toDoItem.Description}");
            }
        }
    }
}
```

<a id="http-trigger-look-up-id-from-query-string-c"></a>

### HTTP trigger, look up ID from query string

The following example shows a [C# function](functions-dotnet-class-library.md) that retrieves a single document. The function is triggered by an HTTP request that uses a query string to specify the ID and partition key value to look up. That ID and partition key value are used to retrieve a `ToDoItem` document from the specified database and collection.

> [!NOTE]
> The HTTP query string parameter is case-sensitive.
>

```cs
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.Logging;

namespace CosmosDBSamplesV2
{
    public static class DocByIdFromQueryString
    {
        [FunctionName("DocByIdFromQueryString")]
        public static IActionResult Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)]
                HttpRequest req,
            [CosmosDB(
                databaseName: "ToDoItems",
                collectionName: "Items",
                ConnectionStringSetting = "CosmosDBConnection",
                Id = "{Query.id}",
                PartitionKey = "{Query.partitionKey}")] ToDoItem toDoItem,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            if (toDoItem == null)
            {
                log.LogInformation($"ToDo item not found");
            }
            else
            {
                log.LogInformation($"Found ToDo item, Description={toDoItem.Description}");
            }
            return new OkResult();
        }
    }
}
```

<a id="http-trigger-look-up-id-from-route-data-c"></a>

### HTTP trigger, look up ID from route data

The following example shows a [C# function](functions-dotnet-class-library.md) that retrieves a single document. The function is triggered by an HTTP request that uses route data to specify the ID and partition key value to look up. That ID and partition key value are used to retrieve a `ToDoItem` document from the specified database and collection.

```cs
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.Logging;

namespace CosmosDBSamplesV2
{
    public static class DocByIdFromRouteData
    {
        [FunctionName("DocByIdFromRouteData")]
        public static IActionResult Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post",
                Route = "todoitems/{partitionKey}/{id}")]HttpRequest req,
            [CosmosDB(
                databaseName: "ToDoItems",
                collectionName: "Items",
                ConnectionStringSetting = "CosmosDBConnection",
                Id = "{id}",
                PartitionKey = "{partitionKey}")] ToDoItem toDoItem,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            if (toDoItem == null)
            {
                log.LogInformation($"ToDo item not found");
            }
            else
            {
                log.LogInformation($"Found ToDo item, Description={toDoItem.Description}");
            }
            return new OkResult();
        }
    }
}
```

<a id="http-trigger-look-up-id-from-route-data-using-sqlquery-c"></a>

### HTTP trigger, look up ID from route data, using SqlQuery

The following example shows a [C# function](functions-dotnet-class-library.md) that retrieves a single document. The function is triggered by an HTTP request that uses route data to specify the ID to look up. That ID is used to retrieve a `ToDoItem` document from the specified database and collection.

The example shows how to use a binding expression in the `SqlQuery` parameter. You can pass route data to the `SqlQuery` parameter as shown, but currently [you can't pass query string values](https://github.com/Azure/azure-functions-host/issues/2554#issuecomment-392084583).

> [!NOTE]
> If you need to query by just the ID, it is recommended to use a look up, like the [previous examples](#http-trigger-look-up-id-from-query-string-c), as it will consume less [request units](../cosmos-db/request-units.md). Point read operations (GET) are [more efficient](../cosmos-db/optimize-cost-reads-writes.md) than queries by ID.
>

```cs
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;

namespace CosmosDBSamplesV2
{
    public static class DocByIdFromRouteDataUsingSqlQuery
    {
        [FunctionName("DocByIdFromRouteDataUsingSqlQuery")]
        public static IActionResult Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post",
                Route = "todoitems2/{id}")]HttpRequest req,
            [CosmosDB("ToDoItems", "Items",
                ConnectionStringSetting = "CosmosDBConnection",
                SqlQuery = "select * from ToDoItems r where r.id = {id}")]
                IEnumerable<ToDoItem> toDoItems,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            foreach (ToDoItem toDoItem in toDoItems)
            {
                log.LogInformation(toDoItem.Description);
            }
            return new OkResult();
        }
    }
}
```

<a id="http-trigger-get-multiple-docs-using-sqlquery-c"></a>

### HTTP trigger, get multiple docs, using SqlQuery

The following example shows a [C# function](functions-dotnet-class-library.md) that retrieves a list of documents. The function is triggered by an HTTP request. The query is specified in the `SqlQuery` attribute property.

```cs
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;

namespace CosmosDBSamplesV2
{
    public static class DocsBySqlQuery
    {
        [FunctionName("DocsBySqlQuery")]
        public static IActionResult Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)]
                HttpRequest req,
            [CosmosDB(
                databaseName: "ToDoItems",
                collectionName: "Items",
                ConnectionStringSetting = "CosmosDBConnection",
                SqlQuery = "SELECT top 2 * FROM c order by c._ts desc")]
                IEnumerable<ToDoItem> toDoItems,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");
            foreach (ToDoItem toDoItem in toDoItems)
            {
                log.LogInformation(toDoItem.Description);
            }
            return new OkResult();
        }
    }
}
```

<a id="http-trigger-get-multiple-docs-using-documentclient-c"></a>

### HTTP trigger, get multiple docs, using DocumentClient

The following example shows a [C# function](functions-dotnet-class-library.md) that retrieves a list of documents. The function is triggered by an HTTP request. The code uses a `DocumentClient` instance provided by the Azure Cosmos DB binding to read a list of documents. The `DocumentClient` instance could also be used for write operations.

> [!NOTE]
> You can also use the [IDocumentClient](/dotnet/api/microsoft.azure.documents.idocumentclient) interface to make testing easier.

```cs
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents.Linq;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace CosmosDBSamplesV2
{
    public static class DocsByUsingDocumentClient
    {
        [FunctionName("DocsByUsingDocumentClient")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post",
                Route = null)]HttpRequest req,
            [CosmosDB(
                databaseName: "ToDoItems",
                collectionName: "Items",
                ConnectionStringSetting = "CosmosDBConnection")] DocumentClient client,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            var searchterm = req.Query["searchterm"];
            if (string.IsNullOrWhiteSpace(searchterm))
            {
                return (ActionResult)new NotFoundResult();
            }

            Uri collectionUri = UriFactory.CreateDocumentCollectionUri("ToDoItems", "Items");

            log.LogInformation($"Searching for: {searchterm}");

            IDocumentQuery<ToDoItem> query = client.CreateDocumentQuery<ToDoItem>(collectionUri)
                .Where(p => p.Description.Contains(searchterm))
                .AsDocumentQuery();

            while (query.HasMoreResults)
            {
                foreach (ToDoItem result in await query.ExecuteNextAsync())
                {
                    log.LogInformation(result.Description);
                }
            }
            return new OkResult();
        }
    }
}
```

<a id="http-trigger-get-multiple-docs-using-cosmosclient-c"></a>

### HTTP trigger, get multiple docs, using CosmosClient

The following example shows a [C# function](functions-dotnet-class-library.md) that retrieves a list of documents. The function is triggered by an HTTP request. The code uses a `CosmosClient` instance provided by the Azure Cosmos DB binding, available in [extension version 4.x](./functions-bindings-cosmosdb-v2.md?tabs=extensionv4), to read a list of documents. The `CosmosClient` instance could also be used for write operations.

```csharp
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;

namespace CosmosDBSamplesV2
{
    public static class DocsByUsingCosmosClient
    {  
        [FunctionName("DocsByUsingCosmosClient")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post",
                Route = null)]HttpRequest req,
            [CosmosDB(
                databaseName: "ToDoItems",
                containerName: "Items",
                Connection = "CosmosDBConnection")] CosmosClient client,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            var searchterm = req.Query["searchterm"].ToString();
            if (string.IsNullOrWhiteSpace(searchterm))
            {
                return (ActionResult)new NotFoundResult();
            }

            Container container = client.GetDatabase("ToDoItems").GetContainer("Items");

            log.LogInformation($"Searching for: {searchterm}");

            QueryDefinition queryDefinition = new QueryDefinition(
                "SELECT * FROM items i WHERE CONTAINS(i.Description, @searchterm)")
                .WithParameter("@searchterm", searchterm);
            using (FeedIterator<ToDoItem> resultSet = container.GetItemQueryIterator<ToDoItem>(queryDefinition))
            {
                while (resultSet.HasMoreResults)
                {
                    FeedResponse<ToDoItem> response = await resultSet.ReadNextAsync();
                    ToDoItem item = response.First();
                    log.LogInformation(item.Description);
                }
            }

            return new OkResult();
        }
    }
}
```

---

::: zone-end
::: zone pivot="programming-language-java"

This section contains the following examples:

* [HTTP trigger, look up ID from query string - String parameter](#http-trigger-look-up-id-from-query-string---string-parameter-java)
* [HTTP trigger, look up ID from query string - POJO parameter](#http-trigger-look-up-id-from-query-string---pojo-parameter-java)
* [HTTP trigger, look up ID from route data](#http-trigger-look-up-id-from-route-data-java)
* [HTTP trigger, look up ID from route data, using SqlQuery](#http-trigger-look-up-id-from-route-data-using-sqlquery-java)
* [HTTP trigger, get multiple docs from route data, using SqlQuery](#http-trigger-get-multiple-docs-from-route-data-using-sqlquery-java)

The examples refer to a simple `ToDoItem` type:

```java
public class ToDoItem {

  private String id;
  private String description;

  public String getId() {
    return id;
  }

  public String getDescription() {
    return description;
  }

  @Override
  public String toString() {
    return "ToDoItem={id=" + id + ",description=" + description + "}";
  }
}
```

<a id="http-trigger-look-up-id-from-query-string---string-parameter-java"></a>

### HTTP trigger, look up ID from query string - String parameter

The following example shows a Java function that retrieves a single document. The function is triggered by an HTTP request that uses a query string to specify the ID and partition key value to look up. That ID and partition key value are used to retrieve a document from the specified database and collection, in String form.

```java
public class DocByIdFromQueryString {

    @FunctionName("DocByIdFromQueryString")
    public HttpResponseMessage run(
            @HttpTrigger(name = "req",
              methods = {HttpMethod.GET, HttpMethod.POST},
              authLevel = AuthorizationLevel.ANONYMOUS)
            HttpRequestMessage<Optional<String>> request,
            @CosmosDBInput(name = "database",
              databaseName = "ToDoList",
              collectionName = "Items",
              id = "{Query.id}",
              partitionKey = "{Query.partitionKeyValue}",
              connectionStringSetting = "Cosmos_DB_Connection_String")
            Optional<String> item,
            final ExecutionContext context) {

        // Item list
        context.getLogger().info("Parameters are: " + request.getQueryParameters());
        context.getLogger().info("String from the database is " + (item.isPresent() ? item.get() : null));

        // Convert and display
        if (!item.isPresent()) {
            return request.createResponseBuilder(HttpStatus.BAD_REQUEST)
                          .body("Document not found.")
                          .build();
        }
        else {
            // return JSON from Cosmos. Alternatively, we can parse the JSON string
            // and return an enriched JSON object.
            return request.createResponseBuilder(HttpStatus.OK)
                          .header("Content-Type", "application/json")
                          .body(item.get())
                          .build();
        }
    }
}
```

In the [Java functions runtime library](/java/api/overview/azure/functions/runtime), use the `@CosmosDBInput` annotation on function parameters whose value would come from Azure Cosmos DB. This annotation can be used with native Java types, POJOs, or nullable values using `Optional<T>`.

<a id="http-trigger-look-up-id-from-query-string---pojo-parameter-java"></a>

### HTTP trigger, look up ID from query string - POJO parameter

The following example shows a Java function that retrieves a single document. The function is triggered by an HTTP request that uses a query string to specify the ID and partition key value to look up. That ID and partition key value used to retrieve a document from the specified database and collection. The document is then converted to an instance of the `ToDoItem` POJO previously created, and passed as an argument to the function.

```java
public class DocByIdFromQueryStringPojo {

    @FunctionName("DocByIdFromQueryStringPojo")
    public HttpResponseMessage run(
            @HttpTrigger(name = "req",
              methods = {HttpMethod.GET, HttpMethod.POST},
              authLevel = AuthorizationLevel.ANONYMOUS)
            HttpRequestMessage<Optional<String>> request,
            @CosmosDBInput(name = "database",
              databaseName = "ToDoList",
              collectionName = "Items",
              id = "{Query.id}",
              partitionKey = "{Query.partitionKeyValue}",
              connectionStringSetting = "Cosmos_DB_Connection_String")
            ToDoItem item,
            final ExecutionContext context) {

        // Item list
        context.getLogger().info("Parameters are: " + request.getQueryParameters());
        context.getLogger().info("Item from the database is " + item);

        // Convert and display
        if (item == null) {
            return request.createResponseBuilder(HttpStatus.BAD_REQUEST)
                          .body("Document not found.")
                          .build();
        }
        else {
            return request.createResponseBuilder(HttpStatus.OK)
                          .header("Content-Type", "application/json")
                          .body(item)
                          .build();
        }
    }
}
```

<a id="http-trigger-look-up-id-from-route-data-java"></a>

### HTTP trigger, look up ID from route data

The following example shows a Java function that retrieves a single document. The function is triggered by an HTTP request that uses a route parameter to specify the ID and partition key value to look up. That ID and partition key value are used to retrieve a document from the specified database and collection, returning it as an `Optional<String>`.

```java
public class DocByIdFromRoute {

    @FunctionName("DocByIdFromRoute")
    public HttpResponseMessage run(
            @HttpTrigger(name = "req",
              methods = {HttpMethod.GET, HttpMethod.POST},
              authLevel = AuthorizationLevel.ANONYMOUS,
              route = "todoitems/{partitionKeyValue}/{id}")
            HttpRequestMessage<Optional<String>> request,
            @CosmosDBInput(name = "database",
              databaseName = "ToDoList",
              collectionName = "Items",
              id = "{id}",
              partitionKey = "{partitionKeyValue}",
              connectionStringSetting = "Cosmos_DB_Connection_String")
            Optional<String> item,
            final ExecutionContext context) {

        // Item list
        context.getLogger().info("Parameters are: " + request.getQueryParameters());
        context.getLogger().info("String from the database is " + (item.isPresent() ? item.get() : null));

        // Convert and display
        if (!item.isPresent()) {
            return request.createResponseBuilder(HttpStatus.BAD_REQUEST)
                          .body("Document not found.")
                          .build();
        }
        else {
            // return JSON from Cosmos. Alternatively, we can parse the JSON string
            // and return an enriched JSON object.
            return request.createResponseBuilder(HttpStatus.OK)
                          .header("Content-Type", "application/json")
                          .body(item.get())
                          .build();
        }
    }
}
```

 <a id="http-trigger-look-up-id-from-route-data-using-sqlquery-java"></a>

### HTTP trigger, look up ID from route data, using SqlQuery

The following example shows a Java function that retrieves a single document. The function is triggered by an HTTP request that uses a route parameter to specify the ID to look up. That ID is used to retrieve a document from the specified database and collection, converting the result set to a `ToDoItem[]`, since many documents may be returned, depending on the query criteria.

> [!NOTE]
> If you need to query by just the ID, it is recommended to use a look up, like the [previous examples](#http-trigger-look-up-id-from-query-string---pojo-parameter-java), as it will consume less [request units](../cosmos-db/request-units.md). Point read operations (GET) are [more efficient](../cosmos-db/optimize-cost-reads-writes.md) than queries by ID.
>

```java
public class DocByIdFromRouteSqlQuery {

    @FunctionName("DocByIdFromRouteSqlQuery")
    public HttpResponseMessage run(
            @HttpTrigger(name = "req",
              methods = {HttpMethod.GET, HttpMethod.POST},
              authLevel = AuthorizationLevel.ANONYMOUS,
              route = "todoitems2/{id}")
            HttpRequestMessage<Optional<String>> request,
            @CosmosDBInput(name = "database",
              databaseName = "ToDoList",
              collectionName = "Items",
              sqlQuery = "select * from Items r where r.id = {id}",
              connectionStringSetting = "Cosmos_DB_Connection_String")
            ToDoItem[] item,
            final ExecutionContext context) {

        // Item list
        context.getLogger().info("Parameters are: " + request.getQueryParameters());
        context.getLogger().info("Items from the database are " + item);

        // Convert and display
        if (item == null) {
            return request.createResponseBuilder(HttpStatus.BAD_REQUEST)
                          .body("Document not found.")
                          .build();
        }
        else {
            return request.createResponseBuilder(HttpStatus.OK)
                          .header("Content-Type", "application/json")
                          .body(item)
                          .build();
        }
    }
}
```

 <a id="http-trigger-get-multiple-docs-from-route-data-using-sqlquery-java"></a>

### HTTP trigger, get multiple docs from route data, using SqlQuery

The following example shows a Java function that retrieves multiple documents. The function is triggered by an HTTP request that uses a route parameter `desc` to specify the string to search for in the `description` field. The search term is used to retrieve a collection of documents from the specified database and collection, converting the result set to a `ToDoItem[]` and passing it as an argument to the function.

```java
public class DocsFromRouteSqlQuery {

    @FunctionName("DocsFromRouteSqlQuery")
    public HttpResponseMessage run(
            @HttpTrigger(name = "req",
              methods = {HttpMethod.GET},
              authLevel = AuthorizationLevel.ANONYMOUS,
              route = "todoitems3/{desc}")
            HttpRequestMessage<Optional<String>> request,
            @CosmosDBInput(name = "database",
              databaseName = "ToDoList",
              collectionName = "Items",
              sqlQuery = "select * from Items r where contains(r.description, {desc})",
              connectionStringSetting = "Cosmos_DB_Connection_String")
            ToDoItem[] items,
            final ExecutionContext context) {

        // Item list
        context.getLogger().info("Parameters are: " + request.getQueryParameters());
        context.getLogger().info("Number of items from the database is " + (items == null ? 0 : items.length));

        // Convert and display
        if (items == null) {
            return request.createResponseBuilder(HttpStatus.BAD_REQUEST)
                          .body("No documents found.")
                          .build();
        }
        else {
            return request.createResponseBuilder(HttpStatus.OK)
                          .header("Content-Type", "application/json")
                          .body(items)
                          .build();
        }
    }
}
```

::: zone-end  
::: zone pivot="programming-language-typescript"  

This section contains the following examples that read a single document by specifying an ID value from various sources:

* [Queue trigger, look up ID from JSON](#queue-trigger-look-up-id-from-json-typescript)
* [HTTP trigger, look up ID from query string](#http-trigger-look-up-id-from-query-string-typescript)
* [HTTP trigger, look up ID from route data](#http-trigger-look-up-id-from-route-data-typescript)
* [Queue trigger, get multiple docs, using SqlQuery](#queue-trigger-get-multiple-docs-using-sqlquery-typescript)

<a id="queue-trigger-look-up-id-from-json-typescript"></a>

### Queue trigger, look up ID from JSON

The following example shows a [TypeScript function](functions-reference-node.md?tabs=typescript) that reads a single document and updates the document's text value.

# [Model v4](#tab/nodejs-v4)

:::code language="typescript" source="~/azure-functions-nodejs-v4/ts/src/functions/cosmosInput1.ts" :::

# [Model v3](#tab/nodejs-v3)

TypeScript samples are not documented for model v3.

---

<a id="http-trigger-look-up-id-from-query-string-typescript"></a>

### HTTP trigger, look up ID from query string

The following example shows a [TypeScript function](functions-reference-node.md?tabs=typescript) that retrieves a single document. The function is triggered by an HTTP request that uses a query string to specify the ID and partition key value to look up. That ID and partition key value are used to retrieve a `ToDoItem` document from the specified database and collection.

# [Model v4](#tab/nodejs-v4)

:::code language="typescript" source="~/azure-functions-nodejs-v4/ts/src/functions/cosmosInput2.ts" :::

# [Model v3](#tab/nodejs-v3)

TypeScript samples are not documented for model v3.

---

<a id="http-trigger-look-up-id-from-route-data-typescript"></a>

### HTTP trigger, look up ID from route data

The following example shows a [TypeScript function](functions-reference-node.md?tabs=typescript) that retrieves a single document. The function is triggered by an HTTP request that uses route data to specify the ID and partition key value to look up. That ID and partition key value are used to retrieve a `ToDoItem` document from the specified database and collection.

# [Model v4](#tab/nodejs-v4)

:::code language="typescript" source="~/azure-functions-nodejs-v4/ts/src/functions/cosmosInput3.ts" :::

# [Model v3](#tab/nodejs-v3)

TypeScript samples are not documented for model v3.

---

<a id="queue-trigger-get-multiple-docs-using-sqlquery-typescript"></a>

### Queue trigger, get multiple docs, using SqlQuery

The following example shows a [TypeScript function](functions-reference-node.md?tabs=typescript) that retrieves multiple documents specified by a SQL query, using a queue trigger to customize the query parameters.

The queue trigger provides a parameter `departmentId`. A queue message of `{ "departmentId" : "Finance" }` would return all records for the finance department.

# [Model v4](#tab/nodejs-v4)

:::code language="typescript" source="~/azure-functions-nodejs-v4/ts/src/functions/cosmosInput4.ts" :::

# [Model v3](#tab/nodejs-v3)

TypeScript samples are not documented for model v3.

---

::: zone-end  
::: zone pivot="programming-language-javascript"  

This section contains the following examples that read a single document by specifying an ID value from various sources:

* [Queue trigger, look up ID from JSON](#queue-trigger-look-up-id-from-json-javascript)
* [HTTP trigger, look up ID from query string](#http-trigger-look-up-id-from-query-string-javascript)
* [HTTP trigger, look up ID from route data](#http-trigger-look-up-id-from-route-data-javascript)
* [Queue trigger, get multiple docs, using SqlQuery](#queue-trigger-get-multiple-docs-using-sqlquery-javascript)

<a id="queue-trigger-look-up-id-from-json-javascript"></a>

### Queue trigger, look up ID from JSON

The following example shows a [JavaScript function](functions-reference-node.md) that reads a single document and updates the document's text value.

# [Model v4](#tab/nodejs-v4)

:::code language="javascript" source="~/azure-functions-nodejs-v4/js/src/functions/cosmosInput1.js" :::

# [Model v3](#tab/nodejs-v3)

Here's the binding data in the *function.json* file:

```json
{
    "name": "inputDocumentIn",
    "type": "cosmosDB",
    "databaseName": "MyDatabase",
    "collectionName": "MyCollection",
    "id" : "{queueTrigger_payload_property}",
    "partitionKey": "{queueTrigger_payload_property}",
    "connectionStringSetting": "MyAccount_COSMOSDB",
    "direction": "in"
},
{
    "name": "inputDocumentOut",
    "type": "cosmosDB",
    "databaseName": "MyDatabase",
    "collectionName": "MyCollection",
    "createIfNotExists": false,
    "partitionKey": "{queueTrigger_payload_property}",
    "connectionStringSetting": "MyAccount_COSMOSDB",
    "direction": "out"
}
```

The [configuration](#configuration) section explains these properties.

Here's the JavaScript code:

```javascript
    // Change input document contents using Azure Cosmos DB input binding, using context.bindings.inputDocumentOut
    module.exports = async function (context) {
        context.bindings.inputDocumentOut = context.bindings.inputDocumentIn;
        context.bindings.inputDocumentOut.text = "This was updated!";
    };
```

---

<a id="http-trigger-look-up-id-from-query-string-javascript"></a>

### HTTP trigger, look up ID from query string

The following example shows a [JavaScript function](functions-reference-node.md) that retrieves a single document. The function is triggered by an HTTP request that uses a query string to specify the ID and partition key value to look up. That ID and partition key value are used to retrieve a `ToDoItem` document from the specified database and collection.

# [Model v4](#tab/nodejs-v4)

:::code language="javascript" source="~/azure-functions-nodejs-v4/js/src/functions/cosmosInput2.js" :::

# [Model v3](#tab/nodejs-v3)

Here's the *function.json* file:

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "name": "req",
      "type": "httpTrigger",
      "direction": "in",
      "methods": [
        "get",
        "post"
      ]
    },
    {
      "name": "$return",
      "type": "http",
      "direction": "out"
    },
    {
      "type": "cosmosDB",
      "name": "toDoItem",
      "databaseName": "ToDoItems",
      "collectionName": "Items",
      "connectionStringSetting": "CosmosDBConnection",
      "direction": "in",
      "Id": "{Query.id}",
      "PartitionKey": "{Query.partitionKeyValue}"
    }
  ],
  "disabled": false
}
```

Here's the JavaScript code:

```javascript
module.exports = async function (context, req, toDoItem) {
    context.log('JavaScript queue trigger function processed work item');
    if (!toDoItem)
    {
        context.log("ToDo item not found");
    }
    else
    {
        context.log("Found ToDo item, Description=" + toDoItem.Description);
    }
};
```
---

<a id="http-trigger-look-up-id-from-route-data-javascript"></a>

### HTTP trigger, look up ID from route data

The following example shows a [JavaScript function](functions-reference-node.md) that retrieves a single document. The function is triggered by an HTTP request that uses route data to specify the ID and partition key value to look up. That ID and partition key value are used to retrieve a `ToDoItem` document from the specified database and collection.

# [Model v4](#tab/nodejs-v4)

:::code language="javascript" source="~/azure-functions-nodejs-v4/js/src/functions/cosmosInput3.js" :::

# [Model v3](#tab/nodejs-v3)

Here's the *function.json* file:

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "name": "req",
      "type": "httpTrigger",
      "direction": "in",
      "methods": [
        "get",
        "post"
      ],
      "route":"todoitems/{partitionKeyValue}/{id}"
    },
    {
      "name": "$return",
      "type": "http",
      "direction": "out"
    },
    {
      "type": "cosmosDB",
      "name": "toDoItem",
      "databaseName": "ToDoItems",
      "collectionName": "Items",
      "connectionStringSetting": "CosmosDBConnection",
      "direction": "in",
      "Id": "{id}",
      "PartitionKey": "{partitionKeyValue}"
    }
  ],
  "disabled": false
}
```

Here's the JavaScript code:

```javascript
module.exports = async function (context, req, toDoItem) {
    context.log('JavaScript queue trigger function processed work item');
    if (!toDoItem)
    {
        context.log("ToDo item not found");
    }
    else
    {
        context.log("Found ToDo item, Description=" + toDoItem.Description);
    }
};
```

---

<a id="queue-trigger-get-multiple-docs-using-sqlquery-javascript"></a>

### Queue trigger, get multiple docs, using SqlQuery

The following example shows a [JavaScript function](functions-reference-node.md) that retrieves multiple documents specified by a SQL query, using a queue trigger to customize the query parameters.

The queue trigger provides a parameter `departmentId`. A queue message of `{ "departmentId" : "Finance" }` would return all records for the finance department.

# [Model v4](#tab/nodejs-v4)

:::code language="javascript" source="~/azure-functions-nodejs-v4/js/src/functions/cosmosInput4.js" :::

# [Model v3](#tab/nodejs-v3)

Here's the binding data in the *function.json* file:

```json
{
    "name": "documents",
    "type": "cosmosDB",
    "direction": "in",
    "databaseName": "MyDb",
    "collectionName": "MyCollection",
    "sqlQuery": "SELECT * from c where c.departmentId = {departmentId}",
    "connectionStringSetting": "CosmosDBConnection"
}
```

The [configuration](#configuration) section explains these properties.

Here's the JavaScript code:

```javascript
module.exports = async function (context, input) {
  var documents = context.bindings.documents;
  for (const document of documents) {
    // operate on each document
  }
};
```

---

::: zone-end  
::: zone pivot="programming-language-powershell"  

* [Queue trigger, look up ID from JSON](#queue-trigger-look-up-id-from-json-ps)
* [HTTP trigger, look up ID from query string](#http-trigger-id-query-string-ps)
* [HTTP trigger, look up ID from route data](#http-trigger-id-route-data-ps)
* [Queue trigger, get multiple docs, using SqlQuery](#queue-trigger-multiple-docs-sqlquery-ps)

### Queue trigger, look up ID from JSON

The following example demonstrates how to read and update a single Azure Cosmos DB document. The document's unique identifier is provided through JSON value in a queue message.

The Azure Cosmos DB input binding is listed first in the list of bindings found in the function's configuration file (_function.json_).

<a name="queue-trigger-look-up-id-from-json-ps"></a>

```json
{
  "name": "InputDocumentIn",
  "type": "cosmosDB",
  "databaseName": "MyDatabase",
  "collectionName": "MyCollection",
  "id": "{queueTrigger_payload_property}",
  "partitionKey": "{queueTrigger_payload_property}",
  "connectionStringSetting": "CosmosDBConnection",
  "direction": "in"
},
{
  "name": "InputDocumentOut",
  "type": "cosmosDB",
  "databaseName": "MyDatabase",
  "collectionName": "MyCollection",
  "createIfNotExists": false,
  "partitionKey": "{queueTrigger_payload_property}",
  "connectionStringSetting": "CosmosDBConnection",
  "direction": "out"
}
```

The _run.ps1_ file has the PowerShell code which reads the incoming document and outputs changes.

```powershell
param($QueueItem, $InputDocumentIn, $TriggerMetadata)

$Document = $InputDocumentIn 
$Document.text = 'This was updated!'

Push-OutputBinding -Name InputDocumentOut -Value $Document  
```

<a name="http-trigger-id-query-string-ps"></a>

### HTTP trigger, look up ID from query string

The following example demonstrates how to read and update a single Azure Cosmos DB document from a web API. The document's unique identifier is provided through a querystring parameter from the HTTP request, as defined in the binding's `"Id": "{Query.Id}"` property.

The Azure Cosmos DB input binding is listed first in the list of bindings found in the function's configuration file (_function.json_).

```json
{ 
  "bindings": [ 
    { 
      "type": "cosmosDB", 
      "name": "ToDoItem", 
      "databaseName": "ToDoItems", 
      "collectionName": "Items", 
      "connectionStringSetting": "CosmosDBConnection", 
      "direction": "in", 
      "Id": "{Query.id}", 
      "PartitionKey": "{Query.partitionKeyValue}" 
    },
    { 
      "authLevel": "anonymous", 
      "name": "Request", 
      "type": "httpTrigger", 
      "direction": "in", 
      "methods": [ 
        "get", 
        "post" 
      ] 
    }, 
    { 
      "name": "Response", 
      "type": "http", 
      "direction": "out" 
    },
  ], 
  "disabled": false 
} 
```

The _run.ps1_ file has the PowerShell code which reads the incoming document and outputs changes.

```powershell
using namespace System.Net

param($Request, $ToDoItem, $TriggerMetadata)

Write-Host 'PowerShell HTTP trigger function processed a request'

if (-not $ToDoItem) { 
    Write-Host 'ToDo item not found'

    Push-OutputBinding -Name Response -Value ([HttpResponseContext]@{ 
        StatusCode = [HttpStatusCode]::NotFound 
        Body = $ToDoItem.Description 
    })

} else {

    Write-Host "Found ToDo item, Description=$($ToDoItem.Description)"

    Push-OutputBinding -Name Response -Value ([HttpResponseContext]@{ 
        StatusCode = [HttpStatusCode]::OK 
        Body = $ToDoItem.Description 
    }) 
}
```

<a name="http-trigger-id-route-data-ps"></a>

### HTTP trigger, look up ID from route data

The following example demonstrates how to read and update a single Azure Cosmos DB document from a web API. The document's unique identifier is provided through a route parameter. The route parameter is defined in the HTTP request binding's `route` property and referenced in the Azure Cosmos DB `"Id": "{Id}"` binding property.

The Azure Cosmos DB input binding is listed first in the list of bindings found in the function's configuration file (_function.json_).

```json
{ 
  "bindings": [ 
    { 
      "type": "cosmosDB", 
      "name": "ToDoItem", 
      "databaseName": "ToDoItems", 
      "collectionName": "Items", 
      "connectionStringSetting": "CosmosDBConnection", 
      "direction": "in", 
      "Id": "{id}", 
      "PartitionKey": "{partitionKeyValue}" 
    },
    { 
      "authLevel": "anonymous", 
      "name": "Request", 
      "type": "httpTrigger", 
      "direction": "in", 
      "methods": [ 
        "get", 
        "post" 
      ], 
      "route": "todoitems/{partitionKeyValue}/{id}" 
    }, 
    { 
      "name": "Response", 
      "type": "http", 
      "direction": "out" 
    }
  ], 
  "disabled": false 
} 
```

The _run.ps1_ file has the PowerShell code which reads the incoming document and outputs changes.

```powershell
using namespace System.Net

param($Request, $ToDoItem, $TriggerMetadata)

Write-Host 'PowerShell HTTP trigger function processed a request'

if (-not $ToDoItem) { 
    Write-Host 'ToDo item not found'

    Push-OutputBinding -Name Response -Value ([HttpResponseContext]@{ 
        StatusCode = [HttpStatusCode]::NotFound 
        Body = $ToDoItem.Description 
    })

} else { 
    Write-Host "Found ToDo item, Description=$($ToDoItem.Description)"

    Push-OutputBinding -Name Response -Value ([HttpResponseContext]@{ 
        StatusCode = [HttpStatusCode]::OK 
        Body = $ToDoItem.Description 
    }) 
} 
```

<a name="queue-trigger-multiple-docs-sqlquery-ps"></a>

### Queue trigger, get multiple docs, using SqlQuery

The following example demonstrates how to read multiple Azure Cosmos DB documents. The function's configuration file (_function.json_) defines the binding properties, which includes the `sqlQuery`. The SQL statement provided to the `sqlQuery` property selects the set of documents provided to the function.

```json
{ 
  "name": "Documents", 
  "type": "cosmosDB", 
  "direction": "in", 
  "databaseName": "MyDb", 
  "collectionName": "MyCollection", 
  "sqlQuery": "SELECT * from c where c.departmentId = {departmentId}", 
  "connectionStringSetting": "CosmosDBConnection" 
} 
```

The _run1.ps1_ file has the PowerShell code which reads the incoming documents.

```powershell
param($QueueItem, $Documents, $TriggerMetadata)

foreach ($Document in $Documents) { 
    # operate on each document 
} 
```

::: zone-end  
::: zone pivot="programming-language-python"  

This section contains the following examples that read a single document by specifying an ID value from various sources:

* [Queue trigger, look up ID from JSON](#queue-trigger-look-up-id-from-json-python)
* [HTTP trigger, look up ID from query string](#http-trigger-look-up-id-from-query-string-python)
* [HTTP trigger, look up ID from route data](#http-trigger-look-up-id-from-route-data-python)
* [Queue trigger, get multiple docs, using SqlQuery](#queue-trigger-get-multiple-docs-using-sqlquery-python)

<a id="queue-trigger-look-up-id-from-json-python"></a>

The examples depend on whether you use the [v1 or v2 Python programming model](functions-reference-python.md).

### Queue trigger, look up ID from JSON

The following example shows an Azure Cosmos DB input binding. The function reads a single document and updates the document's text value. 

# [v2](#tab/python-v2)

```python
import logging
import azure.functions as func

app = func.FunctionApp()

@app.queue_trigger(arg_name="msg", 
                   queue_name="outqueue", 
                   connection="AzureWebJobsStorage")
@app.cosmos_db_input(arg_name="documents", 
                     database_name="MyDatabase",
                     collection_name="MyCollection",
                     id="{msg.payload_property}",
                     partition_key="{msg.payload_property}",
                     connection_string_setting="MyAccount_COSMOSDB")
@app.cosmos_db_output(arg_name="outputDocument", 
                      database_name="MyDatabase",
                      collection_name="MyCollection",
                      connection_string_setting="MyAccount_COSMOSDB")
def test_function(msg: func.QueueMessage,
                  inputDocument: func.DocumentList, 
                  outputDocument: func.Out[func.Document]):
     document = documents[id]
     document["text"] = "This was updated!"
     doc = inputDocument[0]
     doc["text"] = "This was updated!"
     outputDocument.set(doc)
     print(f"Updated document.")
```

# [v1](#tab/python-v1)

Here's the binding data in the *function.json* file:

```json
{
    "name": "documents",
    "type": "cosmosDB",
    "databaseName": "MyDatabase",
    "collectionName": "MyCollection",
    "id" : "{queueTrigger_payload_property}",
    "partitionKey": "{queueTrigger_payload_property}",
    "connectionStringSetting": "MyAccount_COSMOSDB",
    "direction": "in"
},
{
    "name": "$return",
    "type": "cosmosDB",
    "databaseName": "MyDatabase",
    "collectionName": "MyCollection",
    "createIfNotExists": false,
    "partitionKey": "{queueTrigger_payload_property}",
    "connectionStringSetting": "MyAccount_COSMOSDB",
    "direction": "out"
}
```

The [configuration](#configuration) section explains these properties.

Here's the Python code:

```python
import azure.functions as func

def main(queuemsg: func.QueueMessage, documents: func.DocumentList) -> func.Document:
    if documents:
        document = documents[0]
        document['text'] = 'This was updated!'
        return document
```

---

<a id="http-trigger-look-up-id-from-query-string-python"></a>

### HTTP trigger, look up ID from query string

The following example shows a function that retrieves a single document. The function is triggered by an HTTP request that uses a query string to specify the ID and partition key value to look up. That ID and partition key value are used to retrieve a `ToDoItem` document from the specified database and collection.

# [v2](#tab/python-v2)

No equivalent sample for v2 at this time.

# [v1](#tab/python-v1)


Here's the *function.json* file:

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "name": "req",
      "type": "httpTrigger",
      "direction": "in",
      "methods": [
        "get",
        "post"
      ]
    },
    {
      "name": "$return",
      "type": "http",
      "direction": "out"
    },
    {
      "type": "cosmosDB",
      "name": "todoitems",
      "databaseName": "ToDoItems",
      "collectionName": "Items",
      "connectionStringSetting": "CosmosDBConnection",
      "direction": "in",
      "Id": "{Query.id}",
      "PartitionKey": "{Query.partitionKeyValue}"
    }
  ],
  "scriptFile": "__init__.py"
}
```

Here's the Python code:

```python
import logging
import azure.functions as func

def main(req: func.HttpRequest, todoitems: func.DocumentList) -> str:
    if not todoitems:
        logging.warning("ToDo item not found")
    else:
        logging.info("Found ToDo item, Description=%s",
                     todoitems[0]['description'])

    return 'OK'
```

---

<a id="http-trigger-look-up-id-from-route-data-python"></a>

### HTTP trigger, look up ID from route data

The following example shows a function that retrieves a single document. The function is triggered by an HTTP request that uses route data to specify the ID and partition key value to look up. That ID and partition key value are used to retrieve a `ToDoItem` document from the specified database and collection.

# [v2](#tab/python-v2)

No equivalent sample for v2 at this time.

# [v1](#tab/python-v1)

Here's the *function.json* file:

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "name": "req",
      "type": "httpTrigger",
      "direction": "in",
      "methods": [
        "get",
        "post"
      ],
      "route":"todoitems/{partitionKeyValue}/{id}"
    },
    {
      "name": "$return",
      "type": "http",
      "direction": "out"
    },
    {
      "type": "cosmosDB",
      "name": "todoitems",
      "databaseName": "ToDoItems",
      "collectionName": "Items",
      "connection": "CosmosDBConnection",
      "direction": "in",
      "Id": "{id}",
      "PartitionKey": "{partitionKeyValue}"
    }
  ],
  "disabled": false,
  "scriptFile": "__init__.py"
}
```

Here's the Python code:

```python
import logging
import azure.functions as func

def main(req: func.HttpRequest, todoitems: func.DocumentList) -> str:
    if not todoitems:
        logging.warning("ToDo item not found")
    else:
        logging.info("Found ToDo item, Description=%s",
                     todoitems[0]['description'])
    return 'OK'
```

---

<a id="queue-trigger-get-multiple-docs-using-sqlquery-python"></a>

### Queue trigger, get multiple docs, using SqlQuery

The following example shows an Azure Cosmos DB input binding Python function that uses the binding. The function retrieves multiple documents specified by a SQL query, using a queue trigger to customize the query parameters.

The queue trigger provides a parameter `departmentId`. A queue message of `{ "departmentId" : "Finance" }` would return all records for the finance department.

# [v2](#tab/python-v2)

No equivalent sample for v2 at this time.

# [v1](#tab/python-v1)

Here's the binding data in the *function.json* file:

```json
{
    "name": "documents",
    "type": "cosmosDB",
    "direction": "in",
    "databaseName": "MyDb",
    "collectionName": "MyCollection",
    "sqlQuery": "SELECT * from c where c.departmentId = {departmentId}",
    "connectionStringSetting": "CosmosDBConnection"
}
```

---

::: zone-end  
::: zone pivot="programming-language-csharp"
## Attributes

Both [in-process](functions-dotnet-class-library.md) and [isolated worker process](dotnet-isolated-process-guide.md) C# libraries use attributes to define the function. C# script instead uses a function.json configuration file as described in the [C# scripting guide](./functions-reference-csharp.md#azure-cosmos-db-v2-input).

# [Extension 4.x+](#tab/extensionv4/in-process)

[!INCLUDE [functions-cosmosdb-input-attributes-v4](../../includes/functions-cosmosdb-input-attributes-v4.md)]

# [Functions 2.x+](#tab/functionsv2/in-process)

[!INCLUDE [functions-cosmosdb-input-attributes-v3](../../includes/functions-cosmosdb-input-attributes-v3.md)]

# [Extension 4.x+](#tab/extensionv4/isolated-process)

[!INCLUDE [functions-cosmosdb-input-attributes-v4](../../includes/functions-cosmosdb-input-attributes-v4.md)]

# [Functions 2.x+](#tab/functionsv2/isolated-process)

[!INCLUDE [functions-cosmosdb-input-attributes-v3](../../includes/functions-cosmosdb-input-attributes-v3.md)]

---

::: zone-end  

::: zone pivot="programming-language-python"
## Decorators

_Applies only to the Python v2 programming model._

For Python v2 functions defined using a decorator, the following properties on the `cosmos_db_input`:

| Property    | Description |
|-------------|-----------------------------|
|`arg_name` | The variable name used in function code that represents the list of documents with changes. |
|`database_name`  | The name of the Azure Cosmos DB database with the collection being monitored. |
|`collection_name`  | The name of the Azure Cosmos DB collection being monitored. |
|`connection_string_setting` | The connection string of the Azure Cosmos DB being monitored. |
|`partition_key` | The partition key of the Azure Cosmos DB being monitored. |
|`id` | The ID of the document to retrieve. |

For Python functions defined by using *function.json*, see the [Configuration](#configuration) section.
::: zone-end

::: zone pivot="programming-language-java"  
## Annotations

From the [Java functions runtime library](/java/api/overview/azure/functions/runtime), use the `@CosmosDBInput` annotation on parameters that read from Azure Cosmos DB. The annotation supports the following properties:

+ [name](/java/api/com.microsoft.azure.functions.annotation.cosmosdbinput.name)
+ [connectionStringSetting](/java/api/com.microsoft.azure.functions.annotation.cosmosdbinput.connectionstringsetting)
+ [databaseName](/java/api/com.microsoft.azure.functions.annotation.cosmosdbinput.databasename)
+ [collectionName](/java/api/com.microsoft.azure.functions.annotation.cosmosdbinput.collectionname)
+ [dataType](/java/api/com.microsoft.azure.functions.annotation.cosmosdbinput.datatype)
+ [id](/java/api/com.microsoft.azure.functions.annotation.cosmosdbinput.id)
+ [partitionKey](/java/api/com.microsoft.azure.functions.annotation.cosmosdbinput.partitionkey)
+ [sqlQuery](/java/api/com.microsoft.azure.functions.annotation.cosmosdbinput.sqlquery)

::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript,programming-language-powershell,programming-language-python"  
## Configuration
::: zone-end

::: zone pivot="programming-language-python" 
_Applies only to the Python v1 programming model._

::: zone-end
::: zone pivot="programming-language-javascript,programming-language-typescript"  

# [Model v4](#tab/nodejs-v4)

The following table explains the properties that you can set on the `options` object passed to the `input.cosmosDB()` method. The `type`, `direction`, and `name` properties don't apply to the v4 model.

# [Model v3](#tab/nodejs-v3)

The following table explains the binding configuration properties that you set in the *function.json* file, where properties differ by extension version:  

---

::: zone-end
::: zone pivot="programming-language-powershell,programming-language-python"  

The following table explains the binding configuration properties that you set in the *function.json* file, where properties differ by extension version:

::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript,programming-language-powershell,programming-language-python"  

# [Extension 4.x+](#tab/extensionv4)

[!INCLUDE [functions-cosmosdb-settings-v4](../../includes/functions-cosmosdb-input-settings-v4.md)]

# [Functions 2.x+](#tab/functionsv2)

[!INCLUDE [functions-cosmosdb-settings-v3](../../includes/functions-cosmosdb-input-settings-v3.md)]

---
::: zone-end  

See the [Example section](#example) for complete examples.

## Usage

::: zone pivot="programming-language-csharp"  

# [Extension 4.x+](#tab/extensionv4/in-process)

[!INCLUDE [functions-cosmosdb-usage](../../includes/functions-cosmosdb-usage.md)]

# [Functions 2.x+](#tab/functionsv2/in-process)

[!INCLUDE [functions-cosmosdb-usage](../../includes/functions-cosmosdb-usage.md)]

# [Extension 4.x+](#tab/extensionv4/isolated-process)

[!INCLUDE [functions-cosmosdb-usage](../../includes/functions-cosmosdb-usage.md)]

# [Functions 2.x+](#tab/functionsv2/isolated-process)

[!INCLUDE [functions-cosmosdb-usage](../../includes/functions-cosmosdb-usage.md)]

---

The parameter type supported by the Cosmos DB input binding depends on the Functions runtime version, the extension package version, and the C# modality used.

# [Extension 4.x+](#tab/extensionv4/in-process)

See [Binding types](./functions-bindings-cosmosdb-v2.md?tabs=in-process%2Cextensionv4&pivots=programming-language-csharp#binding-types) for a list of supported types.

# [Functions 2.x+](#tab/functionsv2/in-process)

See [Binding types](./functions-bindings-cosmosdb-v2.md?tabs=in-process%2Cfunctionsv2&pivots=programming-language-csharp#binding-types) for a list of supported types.

# [Extension 4.x+](#tab/extensionv4/isolated-process)

[!INCLUDE [functions-bindings-cosmosdb-v2-input-dotnet-isolated-types](../../includes/functions-bindings-cosmosdb-v2-input-dotnet-isolated-types.md)]

# [Functions 2.x+](#tab/functionsv2/isolated-process)

See [Binding types](./functions-bindings-cosmosdb-v2.md?tabs=isolated-process%2Cfunctionsv2&pivots=programming-language-csharp#binding-types) for a list of supported types.

---

::: zone-end
<!--Any of the below pivots can be combined if the usage info is identical.-->
::: zone pivot="programming-language-java"
From the [Java functions runtime library](/java/api/overview/azure/functions/runtime), the [@CosmosDBInput](/java/api/com.microsoft.azure.functions.annotation.cosmosdbinput) annotation exposes Azure Cosmos DB data to the function. This annotation can be used with native Java types, POJOs, or nullable values using `Optional<T>`.
::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript"  

# [Model v4](#tab/nodejs-v4)

Access the document by using `context.extraInputs.get()`.

# [Model v3](#tab/nodejs-v3)

Access the document by using `context.bindings.<name>` where `<name>` is the value specified in the `name` property of *function.json*.

---

::: zone-end  
::: zone pivot="programming-language-powershell"  
Updates to documents are not made automatically upon function exit. To update documents in a function use an [output binding](./functions-bindings-cosmosdb-v2-input.md). See the [PowerShell example](#example) for more detail.
::: zone-end   
::: zone pivot="programming-language-python"  
Data is made available to the function via a `DocumentList` parameter. Changes made to the document are not automatically persisted.
::: zone-end  

[!INCLUDE [functions-cosmosdb-connections](../../includes/functions-cosmosdb-connections.md)]

## Next steps

- [Run a function when an Azure Cosmos DB document is created or modified (Trigger)](./functions-bindings-cosmosdb-v2-trigger.md)
- [Save changes to an Azure Cosmos DB document (Output binding)](./functions-bindings-cosmosdb-v2-output.md)
