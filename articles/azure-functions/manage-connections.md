---
title: Manage connections in Azure Functions
description: Learn how to avoid performance problems in Azure Functions by using static connection clients.
ms.topic: conceptual
ms.custom: devx-track-csharp
ms.date: 08/23/2021

# Customer intent: As a developer, I want to know how to write my Azure Functions code so that I efficiently use connections and avoid potential bottlenecks.
---

# Manage connections in Azure Functions

Functions in a function app share resources. Among those shared resources are connections: HTTP connections, database connections, and connections to services such as Azure Storage. When many functions are running concurrently in a Consumption plan, it's possible to run out of available connections. This article explains how to code your functions to avoid using more connections than they need.

> [!NOTE]
> Connection limits described in this article apply only when running in a [Consumption plan](consumption-plan.md). However, the techniques described here may be beneficial when running on any plan.

## Connection limit

The number of available connections in a Consumption plan is limited partly because a function app in this plan runs in a [sandbox environment](https://github.com/projectkudu/kudu/wiki/Azure-Web-App-sandbox). One of the restrictions that the sandbox imposes on your code is a limit on the number of outbound connections, which is currently 600 active (1,200 total) connections per instance. When you reach this limit, the functions runtime writes the following message to the logs: `Host thresholds exceeded: Connections`. For more information, see the [Functions service limits](functions-scale.md#service-limits).

This limit is per instance. When the [scale controller adds function app instances](event-driven-scaling.md) to handle more requests, each instance has an independent connection limit. That means there's no global connection limit, and you can have much more than 600 active connections across all active instances.

When troubleshooting, make sure that you have enabled Application Insights for your function app. Application Insights lets you view metrics for your function apps like executions. For more information, see [View telemetry in Application Insights](analyze-telemetry-data.md#view-telemetry-in-application-insights).  

## Static clients

To avoid holding more connections than necessary, reuse client instances rather than creating new ones with each function invocation. We recommend reusing client connections for any language that you might write your function in. For example, .NET clients like the [HttpClient](/dotnet/api/system.net.http.httpclient?view=netcore-3.1&preserve-view=true), [DocumentClient](/dotnet/api/microsoft.azure.documents.client.documentclient), and Azure Storage clients can manage connections if you use a single, static client.

Here are some guidelines to follow when you're using a service-specific client in an Azure Functions application:

- *Do not* create a new client with every function invocation.
- *Do* create a single, static client that every function invocation can use.
- *Consider* creating a single, static client in a shared helper class if different functions use the same service.

## Client code examples

This section demonstrates best practices for creating and using clients from your function code.

### HTTP requests

# [C#](#tab/csharp)
Here's an example of C# function code that creates a static [HttpClient](/dotnet/api/system.net.http.httpclient?view=netcore-3.1&preserve-view=true) instance:

```cs
// Create a single, static HttpClient
private static HttpClient httpClient = new HttpClient();

public static async Task Run(string input)
{
    var response = await httpClient.GetAsync("https://example.com");
    // Rest of function
}
```

A common question about [HttpClient](/dotnet/api/system.net.http.httpclient?view=netcore-3.1&preserve-view=true) in .NET is "Should I dispose of my client?" In general, you dispose of objects that implement `IDisposable` when you're done using them. But you don't dispose of a static client because you aren't done using it when the function ends. You want the static client to live for the duration of your application.

# [JavaScript](#tab/javascript)

Because it provides better connection management options, you should use the native [`http.agent`](https://nodejs.org/dist/latest-v6.x/docs/api/http.html#http_class_http_agent) class instead of non-native methods, such as the `node-fetch` module. Connection parameters are configured through options on the `http.agent` class. For detailed options available with the HTTP agent, see [new Agent(\[options\])](https://nodejs.org/dist/latest-v6.x/docs/api/http.html#http_new_agent_options).

The global `http.globalAgent` class used by `http.request()` has all of these values set to their respective defaults. The recommended way to configure connection limits in Functions is to set a maximum number globally. The following example sets the maximum number of sockets for the function app:

```js
http.globalAgent.maxSockets = 200;
```

 The following example creates a new HTTP request with a custom HTTP agent only for that request:

```js
var http = require('http');
var httpAgent = new http.Agent();
httpAgent.maxSockets = 200;
const options = { agent: httpAgent };
http.request(options, onResponseCallback);
```

---

### Azure Cosmos DB clients 

# [C#](#tab/csharp)

[CosmosClient](/dotnet/api/microsoft.azure.cosmos.cosmosclient) connects to an Azure Cosmos DB instance. The Azure Cosmos DB documentation recommends that you [use a singleton Azure Cosmos DB client for the lifetime of your application](../cosmos-db/performance-tips-dotnet-sdk-v3-sql.md#sdk-usage). The following example shows one pattern for doing that in a function:

```cs
#r "Microsoft.Azure.Cosmos"
using Microsoft.Azure.Cosmos;

private static Lazy<CosmosClient> lazyClient = new Lazy<CosmosClient>(InitializeCosmosClient);
private static CosmosClient cosmosClient => lazyClient.Value;

private static CosmosClient InitializeCosmosClient()
{
    // Perform any initialization here
    var uri = "https://youraccount.documents.azure.com:443";
    var authKey = "authKey";
   
    return new CosmosClient(uri, authKey);
}

public static async Task Run(string input)
{
    Container container = cosmosClient.GetContainer("database", "collection");
    MyItem item = new MyItem{ id = "myId", partitionKey = "myPartitionKey", data = "example" };
    await container.UpsertItemAsync(document);
   
    // Rest of function
}
```
Also, create a file named "function.proj" for your trigger and add the below content :

```cs

<Project Sdk="Microsoft.NET.Sdk">
    <PropertyGroup>
        <TargetFramework>netcoreapp3.1</TargetFramework>
    </PropertyGroup>
    <ItemGroup>
        <PackageReference Include="Microsoft.Azure.Cosmos" Version="3.23.0" />
    </ItemGroup>
</Project>

```

# [JavaScript](#tab/javascript)

[CosmosClient](/javascript/api/@azure/cosmos/cosmosclient) connects to an Azure Cosmos DB instance. The Azure Cosmos DB documentation recommends that you [use a singleton Azure Cosmos DB client for the lifetime of your application](../cosmos-db/performance-tips.md#sdk-usage). The following example shows one pattern for doing that in a function:

```javascript
const cosmos = require('@azure/cosmos');
const endpoint = process.env.COSMOS_API_URL;
const key = process.env.COSMOS_API_KEY;
const { CosmosClient } = cosmos;

const client = new CosmosClient({ endpoint, key });
// All function invocations also reference the same database and container.
const container = client.database("MyDatabaseName").container("MyContainerName");

module.exports = async function (context) {
    const { resources: itemArray } = await container.items.readAll().fetchAll();
    context.log(itemArray);
}
```

---

## SqlClient connections

Your function code can use the .NET Framework Data Provider for SQL Server ([SqlClient](/dotnet/api/system.data.sqlclient)) to make connections to a SQL relational database. This is also the underlying provider for data frameworks that rely on ADO.NET, such as [Entity Framework](/ef/ef6/). Unlike [HttpClient](/dotnet/api/system.net.http.httpclient) and [DocumentClient](/dotnet/api/microsoft.azure.documents.client.documentclient) connections, ADO.NET implements connection pooling by default. But because you can still run out of connections, you should optimize connections to the database. For more information, see [SQL Server Connection Pooling (ADO.NET)](/dotnet/framework/data/adonet/sql-server-connection-pooling).

> [!TIP]
> Some data frameworks, such as Entity Framework, typically get connection strings from the **ConnectionStrings** section of a configuration file. In this case, you must explicitly add SQL database connection strings to the **Connection strings** collection of your function app settings and in the [local.settings.json file](functions-develop-local.md#local-settings-file) in your local project. If you're creating an instance of [SqlConnection](/dotnet/api/system.data.sqlclient.sqlconnection) in your function code, you should store the connection string value in **Application settings** with your other connections.

## Next steps

For more information about why we recommend static clients, see [Improper instantiation antipattern](/azure/architecture/antipatterns/improper-instantiation/).

For more Azure Functions performance tips, see [Optimize the performance and reliability of Azure Functions](functions-best-practices.md).
