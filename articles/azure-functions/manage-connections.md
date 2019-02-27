---
title: How to manage connections in Azure Functions
description: Learn how to avoid performance problems in Azure Functions by using static connection clients.
services: functions
author: ggailey777
manager: jeconnoc
ms.service: azure-functions
ms.topic: conceptual
ms.date: 02/25/2018
ms.author: glenga
#Customer intent: As a developer, I want to know how to write my Azure Functions code so that I efficiently use connections and avoid potential bottlenecks.
---

# How to manage connections in Azure Functions

Functions in a function app share resources, and among those shared resources are connections &mdash; HTTP connections, database connections, and connections to Azure services such as Storage. When many functions are running concurrently, it's possible to run out of available connections. This article explains how to code your functions to avoid using more connections than they actually need.

## Connections limit

The number of available connections is limited partly because a function app runs in a [sandbox environment](https://github.com/projectkudu/kudu/wiki/Azure-Web-App-sandbox). One of the restrictions that the sandbox imposes on your code is a [cap on the number of connections (currently at 600 active connections, 1200 total connections)](https://github.com/projectkudu/kudu/wiki/Azure-Web-App-sandbox#numerical-sandbox-limits) per instance. When you reach this limit, the functions runtime creates a log with the following message: `Host thresholds exceeded: Connections`.

This limit is per instance.  When the [scale controller adds function app instances](functions-scale.md#how-the-consumption-plan-works) to handle more requests, each instance has an independent connection limit.  That means there is no global connection limit, and in total you can have much more than 600 active connections across all active instances.

## Use static clients

To avoid holding more connections than necessary, reuse client instances rather than creating new ones with each function invocation.  Reusing client connections is recommended for any language you may write your function in. For example, .NET clients like the [HttpClient](https://msdn.microsoft.com/library/system.net.http.httpclient(v=vs.110).aspx), [DocumentClient](https://docs.microsoft.com/dotnet/api/microsoft.azure.documents.client.documentclient
), and Azure Storage clients can manage connections if you use a single, static client.

Here are some guidelines to follow when using a service-specific client in an Azure Functions application:

- **DO NOT** create a new client with every function invocation.
- **DO** create a single, static client that can be used by every function invocation.
- **CONSIDER** creating a single, static client in a shared helper class if different functions use the same service.

## Client code examples

This section demonstrates best practices for creating and using clients from your function code.

### HttpClient example (C#)

Here's an example of C# function code that creates a static [HttpClient](https://msdn.microsoft.com/library/system.net.http.httpclient(v=vs.110).aspx):

```cs
// Create a single, static HttpClient
private static HttpClient httpClient = new HttpClient();

public static async Task Run(string input)
{
    var response = await httpClient.GetAsync("https://example.com");
    // Rest of function
}
```

A common question about the .NET [HttpClient](https://msdn.microsoft.com/library/system.net.http.httpclient(v=vs.110).aspx) is "Should I be disposing my client?" In general, you dispose objects that implement `IDisposable` when you're done using them. But you don't dispose a static client because you aren't done using it when the function ends. You want the static client to live for the duration of your application.

### HTTP agent examples (Node.js)

Because it provides better connection management options, you should use the native [`http.agent`](https://nodejs.org/dist/latest-v6.x/docs/api/http.html#http_class_http_agent) class instead of non-native methods, such as the `node-fetch` module. Connection parameters are configured using options on the `http.agent` class. See [new Agent(\[options\])](https://nodejs.org/dist/latest-v6.x/docs/api/http.html#http_new_agent_options) for the detailed options available with the HTTP agent.

The global `http.globalAgent` used by `http.request()` has all of these values set to their respective defaults. The recommended way to configure connection limits in Functions is to set a maximum number globally. The following example sets the maximum number of sockets for the function app:

```js
http.globalAgent.maxSockets = 200;
```

 The following example creates a new HTTP request with a custom HTTP agent only for that request.

```js
var http = require('http');
var httpAgent = new http.Agent();
httpAgent.maxSockets = 200;
options.agent = httpAgent;
http.request(options, onResponseCallback);
```

### DocumentClient code example (C#)

[DocumentClient](https://docs.microsoft.com/dotnet/api/microsoft.azure.documents.client.documentclient
) connects to an Azure Cosmos DB instance. The Azure Cosmos DB documentation recommends that you [use a singleton Azure Cosmos DB client for the lifetime of your application](https://docs.microsoft.com/azure/cosmos-db/performance-tips#sdk-usage). The following example shows one pattern for doing that in a function:

```cs
#r "Microsoft.Azure.Documents.Client"
using Microsoft.Azure.Documents.Client;

private static Lazy<DocumentClient> lazyClient = new Lazy<DocumentClient>(InitializeDocumentClient);
private static DocumentClient documentClient => lazyClient.Value;

private static DocumentClient InitializeDocumentClient()
{
    // Perform any initialization here
    var uri = new Uri("example");
    var authKey = "authKey";
    
    return new DocumentClient(uri, authKey);
}

public static async Task Run(string input)
{
    Uri collectionUri = UriFactory.CreateDocumentCollectionUri("database", "collection");
    object document = new { Data = "example" };
    await documentClient.UpsertDocumentAsync(collectionUri, document);
    
    // Rest of function
}
```

## SqlClient connections

Your function code may use the .NET Framework Data Provider for SQL Server ([SqlClient](https://msdn.microsoft.com/library/system.data.sqlclient(v=vs.110).aspx)) to make connections to a SQL relational database. This is also the underlying provider for data frameworks that rely on ADO.NET, such as Entity Framework. Unlike [HttpClient](https://msdn.microsoft.com/library/system.net.http.httpclient(v=vs.110).aspx) and [DocumentClient](https://docs.microsoft.com/dotnet/api/microsoft.azure.documents.client.documentclient
) connections, ADO.NET implements connection pooling by default. However, because you can still run out of connections, you should optimize connections to the database. For more information, see [SQL Server Connection Pooling (ADO.NET)](https://docs.microsoft.com/dotnet/framework/data/adonet/sql-server-connection-pooling).

> [!TIP]
> Some data frameworks, such as [Entity Framework](https://msdn.microsoft.com/library/aa937723(v=vs.113).aspx), typically get connection strings from the **ConnectionStrings** section of a configuration file. In this case, you must explicitly add SQL database connection strings to the **Connection strings** collection of your function app settings and in the [local.settings.json file](functions-run-local.md#local-settings-file) in your local project. If you are creating a [SqlConnection](https://msdn.microsoft.com/library/system.data.sqlclient.sqlconnection(v=vs.110).aspx) in your function code, you should store the connection string value in **Application settings** with your other connections.

## Next steps

For more information about why static clients are recommended, see [Improper instantiation antipattern](https://docs.microsoft.com/azure/architecture/antipatterns/improper-instantiation/).

For more Azure Functions performance tips, see [Optimize the performance and reliability of Azure Functions](functions-best-practices.md).
