<properties 
	pageTitle="DocumentDB Scale and Performance Testing | Microsoft Azure" 
	description="Learn how to perform scale and performance testing with Azure DocumentDB"
	keywords="documentdb, azure, Microsoft azure, scale, performance, provisioned throughput, latency"
	services="documentdb" 
	authors="arramac" 
	manager="jhubbard" 
	editor="cgronlun" 
	documentationCenter=""/>

<tags 
	ms.service="documentdb" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="05/16/2016" 
	ms.author="arramac"/>

# Performance and Scale Testing with Azure DocumentDB
[Microsoft Azure DocumentDB](https://azure.microsoft.com/services/documentdb/) is designed to help you achieve fast, predictable performance and scale seamlessly along with your application as it grows. This article describes how you can perform performance and scale testing with DocumentDB using a .NET console app. 

After reading this article, you will be able to answer the following questions:   

- Where can I find a client driver or benchmark application for performance testing of Azure DocumentDB?
- What are the key factors that affect end to end performance of requests made to Azure DocumentDB? 
- How do I achieve high throughput levels with Azure DocumentDB from my application?

To get started with code, please download the project from [DocumentDB Performance Testing Driver Sample](https://github.com/Azure/azure-documentdb-dotnet/tree/a2d61ddb53f8ab2a23d3ce323c77afcf5a608f52/samples/documentdb-benchmark). 

## Configurations for Best End-to-End Performance
In order to get the best end-to-end performance with DocumentDB, the following are the key client-side configuration options:

- **Increase the number of Threads/Tasks**: Since calls to DocumentDB are over the network, you should increase the degree of parallelism so that the client driver spends very little time waiting between requests. For example, if you're using .NET's [Task Parallel Library](https://msdn.microsoft.com//library/dd460717.aspx), please create ~100 Tasks reading or writing to DocumentDB.
- **Test within the same Azure region**: When possible, run within a Virtual Machine or App Service deployed in the same Azure Region. You should be able to achieve the same throughput levels outside Azure, but will need more parallelism to compensate for network latency between requests. For a ballpark, within Azure regions the latency to a DocumentDB account is 1-2 ms, but the latency between the West and East coast of the US is about 50 ms.
- **Increase System.Net MaxConnections per host**: DocumentDB requests are made over HTTPS/REST by default and subject to the default connection limits per hostname or IP address. Increase this to a high value (100-1000) so that the client library can make multiple simultaneous connections to DocumentDB. In .NET, this is [ServicePointManager.DefaultConnectionLimit](https://msdn.microsoft.com/library/system.net.servicepointmanager.defaultconnectionlimit.aspx).
- **Turn Server-side GC on**: Reducing the frequency of garbage collection might help in some cases. In .NET, set [gcServer](https://msdn.microsoft.com/library/ms229357.aspx) to true.
- **Use Direct Connectivity with TCP protocol**: Use [Direct connectivity](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.connectionmode.aspx) with [TCP protocol](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.protocol.aspx) for best performance. 
- **Implement Backoff at RetryAfter intervals**: Backoff/retry on throttle with the server-specified retry interval to minimize the number of throttled errors. See [RetryAfter](https://msdn.microsoft.com/library/microsoft.azure.documents.documentclientexception.retryafter.aspx).
- **Scale out your client-workload**: If you are testing at very high throughput levels (>50,000 RU/s), the client app becomes the bottleneck usually due to CPU or Network utilization, and you'll be unable to utilize the DocumentDB account’s provisioned throughput. You can get linear throughput increases by running more client instances across multiple VMs.

## Get Started
The quickest way to get started is to run the DocumentDB Performance Testing Driver, as described in the steps below. You can also review the source code and make changes to your own client drivers.

**Step 1:** Please download the project from [DocumentDB Performance Testing Driver Sample](https://github.com/Azure/azure-documentdb-dotnet/tree/a2d61ddb53f8ab2a23d3ce323c77afcf5a608f52/samples/documentdb-benchmark), or fork the Github repository.

**Step 2:** Modify the settings for EndpointUrl, AuthorizationKey, CollectionThroughput and DocumentTemplate (optional) in App.config.

> [AZURE.INFO] Before provisioning collections with high throughput, please refer to the [Pricing Page](https://azure.microsoft.com/pricing/details/documentdb/) to estimate the costs per collection. DocumentDB bills storage and throughput independently on an hourly basis, so you can save costs by deleting or lowering the throughput of your DocumentDB collections after testing.

**Step 3:** Compile and run the console app from the command line. You should see output like the following:

	Summary:
	---------------------------------------------------------------------
	Endpoint: https://docdb-scale-demo.documents.azure.com:443/
	Collection : db.testdata at 50000 request units per second
	Document Template*: Player.json
	Degree of parallelism*: 500
	---------------------------------------------------------------------

	DocumentDBBenchmark starting...
	Creating database db
	Creating collection testdata
	Creating metric collection metrics
	Retrying after sleeping for 00:03:34.1720000
	Starting Inserts with 500 tasks
	Inserted 661 docs @ 656 writes/s, 6860 RU/s (18B max monthly 1KB reads)
	Inserted 6505 docs @ 2668 writes/s, 27962 RU/s (72B max monthly 1KB reads)
	Inserted 11756 docs @ 3240 writes/s, 33957 RU/s (88B max monthly 1KB reads)
	Inserted 17076 docs @ 3590 writes/s, 37627 RU/s (98B max monthly 1KB reads)
	Inserted 22106 docs @ 3748 writes/s, 39281 RU/s (102B max monthly 1KB reads)
	Inserted 28430 docs @ 3902 writes/s, 40897 RU/s (106B max monthly 1KB reads)
	Inserted 33492 docs @ 3928 writes/s, 41168 RU/s (107B max monthly 1KB reads)
	Inserted 38392 docs @ 3963 writes/s, 41528 RU/s (108B max monthly 1KB reads)
	Inserted 43371 docs @ 4012 writes/s, 42051 RU/s (109B max monthly 1KB reads)
	Inserted 48477 docs @ 4035 writes/s, 42282 RU/s (110B max monthly 1KB reads)
	Inserted 53845 docs @ 4088 writes/s, 42845 RU/s (111B max monthly 1KB reads)
	Inserted 59267 docs @ 4138 writes/s, 43364 RU/s (112B max monthly 1KB reads)
	Inserted 64703 docs @ 4197 writes/s, 43981 RU/s (114B max monthly 1KB reads)
	Inserted 70428 docs @ 4216 writes/s, 44181 RU/s (115B max monthly 1KB reads)
	Inserted 75868 docs @ 4247 writes/s, 44505 RU/s (115B max monthly 1KB reads)
	Inserted 81571 docs @ 4280 writes/s, 44852 RU/s (116B max monthly 1KB reads)
	Inserted 86271 docs @ 4273 writes/s, 44783 RU/s (116B max monthly 1KB reads)
	Inserted 91993 docs @ 4299 writes/s, 45056 RU/s (117B max monthly 1KB reads)
	Inserted 97469 docs @ 4292 writes/s, 44984 RU/s (117B max monthly 1KB reads)
	Inserted 99736 docs @ 4192 writes/s, 43930 RU/s (114B max monthly 1KB reads)
	Inserted 99997 docs @ 4013 writes/s, 42051 RU/s (109B max monthly 1KB reads)
	Inserted 100000 docs @ 3846 writes/s, 40304 RU/s (104B max monthly 1KB reads)

	Summary:
	---------------------------------------------------------------------
	Inserted 100000 docs @ 3834 writes/s, 40180 RU/s (104B max monthly 1KB reads)
	---------------------------------------------------------------------
	DocumentDBBenchmark completed successfully.


**Step 4 (if necessary):** The throughput reported (RU/s) from the tool should be the same as the provisioned throughput of the collection. If it's below the provisioned throughput, try increasing the DegreeOfParallelism in increments until you reach the limit. If you've reached the CPU or network limits of your client machine, you can launch multiple instances of the app from multiple machines. If you need help with this step, please reach out to us via [Ask DocumentDB](askdocdb@microsoft.com) or by filing a support ticket.

In this article, we looked at how you can perform performance and scale testing with DocumentDB using a .NET console app and reviewed key configuration options to get the best performance from DocumetntDB.

## References
* [DocumentDB Performance Testing Driver Sample](https://github.com/Azure/azure-documentdb-dotnet/tree/a2d61ddb53f8ab2a23d3ce323c77afcf5a608f52/samples/documentdb-benchmark)
* [Server-side Partitioning in DocumentDB](documentdb-partition-data.md)
* [DocumentDB collections and performance levels](documentdb-performance-levels.md)
* [DocumentDB .NET SDK Documentation at MSDN](https://msdn.microsoft.com/library/azure/dn948556.aspx)
* [DocumentDB .NET samples](https://github.com/Azure/azure-documentdb-net)
* [DocumentDB Blog on Performance Tips](https://azure.microsoft.com/blog/2015/01/20/performance-tips-for-azure-documentdb-part-1-2/)