---
title: How to manage connections in Azure Functions
description: Learn how to avoid performance problems in Azure Functions by using static connection clients.
services: functions
documentationcenter: 
author: ggailey777
manager: jeconnoc

ms.service: azure-functions
ms.topic: conceptual

ms.date: 07/13/2018
ms.author: glenga
---

# How to manage connections in Azure Functions

Functions in a function app share resources, and among those shared resources are connections &mdash; HTTP connections, database connections, and connections to Azure services such as Storage. When many functions are running concurrently, it's possible to run out of available connections. This article explains how to code your functions to avoid using more connections than they actually need.

## Connections limit

The number of available connections is limited partly because a function app runs in the [Azure App Service sandbox](https://github.com/projectkudu/kudu/wiki/Azure-Web-App-sandbox). One of the restrictions that the sandbox imposes on your code is a [cap on the number of connections, currently 300](https://github.com/projectkudu/kudu/wiki/Azure-Web-App-sandbox#numerical-sandbox-limits). When you reach this limit, the functions runtime creates a log with the following message: `Host thresholds exceeded: Connections`.

The likelihood of exceeding the limit goes up when the [scale controller adds function app instances](functions-scale.md#how-the-consumption-plan-works) to handle more requests. Each function app instance can be running many functions at once, all of which are using connections that count toward the 300 limit.

## Use static clients

To avoid holding more connections than necessary, reuse client instances rather than creating new ones with each function invocation. .NET clients like the [HttpClient](https://msdn.microsoft.com/library/system.net.http.httpclient(v=vs.110).aspx), [DocumentClient](https://docs.microsoft.com/dotnet/api/microsoft.azure.documents.client.documentclient
), and Azure Storage clients can manage connections if you use a single, static client.

Here are some guidelines to follow when using a service-specific client in an Azure Functions application:

- **DO NOT** create a new client with every function invocation.
- **DO** create a single, static client that can be used by every function invocation.
- **CONSIDER** creating a single, static client in a shared helper class if different functions use the same service.

## HttpClient code example

Here's an example of function code that creates a static [HttpClient](https://msdn.microsoft.com/library/system.net.http.httpclient(v=vs.110).aspx):

```cs
// Create a single, static HttpClient
private static HttpClient httpClient = new HttpClient();

public static async Task Run(string input)
{
    var response = await httpClient.GetAsync("http://example.com");
    // Rest of function
}
```

A common question about the .NET [HttpClient](https://msdn.microsoft.com/library/system.net.http.httpclient(v=vs.110).aspx) is "Should I be disposing my client?" In general, you dispose objects that implement `IDisposable` when you're done using them. But you don't dispose a static client because you aren't done using it when the function ends. You want the static client to live for the duration of your application.

## DocumentClient code example

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
