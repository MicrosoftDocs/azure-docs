<properties 
	pageTitle="DocumentDB performance tips | Microsoft Azure" 
	description="Learn client configuration options to improve Azure DocumentDB database performance"
	keywords="how to improve database performance"
	services="documentdb" 
	authors="arramac" 
	manager="jhubbard" 
	editor="" 
	documentationCenter=""/>

<tags 
	ms.service="documentdb" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="07/21/2016" 
	ms.author="arramac"/>

# DocumentDB performance tips

Azure DocumentDB is a fast and flexible distributed database that scales seamlessly with guaranteed latency and throughput. You do not have to make major architecture changes or write complex code to scale your database tier with DocumentDB. Scaling up and down is as easy as making a single API call or [SDK method call](documentdb-performance-levels.md#changing-performance-levels-using-the-net-sdk). However, because DocumentDB is accessed via network calls there are client-side optimizations you can make to achieve peak performance.

So if you're asking "How can I improve my database performance?", consider the following client configuration options:

1. **Install the most recent SDK**: The DocumentDB SDKs are constantly being improved to provide the best performance. See the [DocumentDB SDK](documentdb-sdk-dotnet.md) pages to determine the most recent SDK and review improvements. 
2. **Increase number of threads/tasks**: Since calls to DocumentDB are over the network, you may need to vary the degree of parallelism of your requests so that the client application spends very little time waiting between requests. For example, if you're using .NET's [Task Parallel Library](https://msdn.microsoft.com//library/dd460717.aspx), please create in the order of 100s of Tasks reading or writing to DocumentDB.
3. **Test within the same Azure region**: When possible, test from a Virtual Machine or App Service deployed in the same Azure region. For a ballpark comparison, calls to DocumentDB within the same region complete within 1-2 ms, but the latency between the West and East coast of the US is >50 ms.
4. **Increase System.Net MaxConnections per host**: DocumentDB requests are made over HTTPS/REST by default and subject to the default connection limits per hostname or IP address. You may need to set this to a higher value (100-1000) so that the client library can utilize multiple simultaneous connections to DocumentDB. In the .NET SDK, the default value for [ServicePointManager.DefaultConnectionLimit](https://msdn.microsoft.com/library/system.net.servicepointmanager.defaultconnectionlimit.aspx) is 50. 
5. **Turn server-side GC on**: Reducing the frequency of garbage collection may help in some cases. In .NET, set [gcServer](https://msdn.microsoft.com/library/ms229357.aspx) to true.
- **Use Direct Connectivity**: Use [Direct connectivity](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.connectionmode.aspx) for the best performance. Direct connectivity is the default connection mode in DocumentDB .NET SDK versions 1.9.0 and above.
6. **Implement backoff at RetryAfter intervals**: During performance testing, you should increase load until a small rate of requests get throttled. If throttled, the client application should backoff on throttle for the server-specified retry interval. This ensures that you  spend minimal amount of time waiting between retries. See [RetryAfter](https://msdn.microsoft.com/library/microsoft.azure.documents.documentclientexception.retryafter.aspx). Retry policy support is included in Version 1.8.0 and above of the [DocumentDB .NET SDK](documentdb-sdk-dotnet.md) and [DocumentDB Java SDK](documentdb-sdk-java.md), and version 1.9.0 and above of the [DocumentDB Node.js SDK](documentdb-sdk-nodejs.md) and [DocumentDB Python SDK](documentdb-sdk-python.md). For more information about throttling, see [Exceeding reserved throughput limits](documentdb-request-units.md#exceeding-reserved-throughput-limits). 
7. **Scale out your client-workload**: If you are testing at high throughput levels (>50,000 RU/s), the client application may become the bottleneck due to the machine capping out on CPU or Network utilization. If you reach this point, you can continue to push the DocumentDB account further by scaling out your client applications across multiple servers.
8. **Cache document URIs for lower read latency**: Cache document URIs whenever possible for the best read performance.
9. **Tune the page size for queries/read feeds for better performance**: When performing a bulk read of documents using read feed functionality (i.e. ReadDocumentFeedAsync) or when issuing a DocumentDB SQL query, the results are returned in a segmented fashion if the result set is too large. By default, results are returned in chunks of 100 items or 1 MB, whichever limit is hit first. 

    In order to reduce the number of network round trips required to retrieve all applicable results, you can increase the page size using x-ms-max-item-count request header to up to 1000. In cases where you need to display only a few results, e.g., if your user interface or application API returns only ten results a time, you can also decrease the page size to 10 in order to reduce the throughput consumed for reads and queries.

    You may also set the page size using the available DocumentDB SDKs.  For example:
    
        IQueryable<dynamic> authorResults = client.CreateDocumentQuery(documentCollection.SelfLink, "SELECT p.Author FROM Pages p WHERE p.Title = 'About Seattle'", new FeedOptions { MaxItemCount = 1000 });

For a sample application used to evaluate DocumentDB for high-performance scenarios on a small number of client machines, see [Performance and scale testing with Azure DocumentDB](documentdb-performance-testing.md).

Also, to learn more about designing your application for scale and high performance, see [Partitioning and scaling in Azure DocumentDB](documentdb-partition-data).
