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
	ms.date="07/20/2016" 
	ms.author="arramac"/>

# Client configuration options to improve DocumentDB performance

Azure DocumentDB is a fast and flexible distributed database that scales seamlessly with guaranteed latency and throughput. You do not have to make major architecture changes or write complex code to scale your database tier with DocumentDB. Scaling up and down is as easy as making a single API call or [SDK method call](documentdb-performance-levels.md#changing-performance-levels-using-the-net-sdk). However, when testing at scale, it is important to note that DocumentDB is accessed via network calls. If you are writing a standalone client application to performance test DocumentDB, you must configure it appropriately to counter the impact of network latency on your performance measurements.

## How to improve DocumentDB database performance

In order to get the best end-to-end performance with DocumentDB, consider the following client configuration options:

- **Install the most recent SDK**: The DocumentDB SDKs are constantly being improved to provide the most performant APIs. See the [DocumentDB SDK](documentdb-sdk-dotnet.md) pages to determine the most recent SDK and review improvements. 
- **Increase number of threads/tasks**: Since calls to DocumentDB are over the network, you may need to vary the degree of parallelism of your requests so that the client application spends very little time waiting between requests. For example, if you're using .NET's [Task Parallel Library](https://msdn.microsoft.com//library/dd460717.aspx), please create in the order of 100s of Tasks reading or writing to DocumentDB.
- **Test within the same Azure region**: When possible, test from a Virtual Machine or App Service deployed in the same Azure region. For a ballpark comparison, calls to DocumentDB within the same region complete within 1-2 ms, but the latency between the West and East coast of the US is >50 ms.
- **Increase System.Net MaxConnections per host**: DocumentDB requests are made over HTTPS/REST by default and subject to the default connection limits per hostname or IP address. You may need to set this to a higher value (100-1000) so that the client library can utilize multiple simultaneous connections to DocumentDB. In .NET, this is [ServicePointManager.DefaultConnectionLimit](https://msdn.microsoft.com/library/system.net.servicepointmanager.defaultconnectionlimit.aspx).
- **Turn server-side GC on**: Reducing the frequency of garbage collection may help in some cases. In .NET, set [gcServer](https://msdn.microsoft.com/library/ms229357.aspx) to true.
- **Use Direct Connectivity**: Use [Direct connectivity](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.connectionmode.aspx) for the best performance. Direct connectivity is the default connection mode in DocumentDB .NET SDK versions 1.9.0 and above.
- **Implement backoff at RetryAfter intervals**: During performance testing, you should increase load until a small rate of requests get throttled. If throttled, the client application should backoff on throttle for the server-specified retry interval. This ensures that you  spend minimal amount of time waiting between retries. See [RetryAfter](https://msdn.microsoft.com/library/microsoft.azure.documents.documentclientexception.retryafter.aspx). Retry policy support is included in Version 1.8.0 and above of the [DocumentDB .NET SDK](documentdb-sdk-dotnet.md) and [DocumentDB Java SDK](documentdb-sdk-java.md), and version 1.9.0 and above of the [DocumentDB Node.js SDK](documentdb-sdk-nodejs.md) and [DocumentDB Python SDK](documentdb-sdk-python.md). For more information about throttling, see [Exceeding reserved throughput limits](documentdb-request-units.d#exceeding-reserved-throughput-limits). 
- **Scale out your client-workload**: If you are testing at high throughput levels (>50,000 RU/s), the client application may become the bottleneck due to the machine capping out on CPU or Network utilization. If you reach this point, you can continue to push the DocumentDB account further by scaling out your client applications across multiple servers.

## Next steps

For a sample application used to evaluate DocumentDB for high-performance scenarios on a small number of client machines, see [Performance and scale testing with Azure DocumentDB](documentdb-performance-testing.md).

Also, to learn more about designing your application for scale and high performance, see [Partitioning and scaling in Azure DocumentDB](documentdb-partition-data).
