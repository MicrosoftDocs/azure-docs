---
title: Troubleshoot slow requests in Azure Cosmos DB .NET SDK
description: Learn how to diagnose and fix slow requests when you use Azure Cosmos DB .NET SDK.
author: j82w
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.date: 03/09/2022
ms.author: jawilley
ms.topic: troubleshooting
ms.reviewer: sngun
---

# Diagnose and troubleshoot slow requests in Azure Cosmos DB .NET SDK

[!INCLUDE[appliesto-sql-api](../includes/appliesto-sql-api.md)]

In Azure Cosmos DB, you might notice slow requests. Delays can happen for multiple reasons, such as request throttling or the way your application is designed. This article explains the different root causes for this problem. 

## Request rate too large

Request throttling is the most common reason for slow requests. Azure Cosmos DB throttles requests if they exceed the allocated request units for the database or container. The SDK has built-in logic to retry these requests. The [request rate too large](troubleshoot-request-rate-too-large.md#how-to-investigate) troubleshooting article explains how to check if the requests are being throttled. The article also discusses how to scale your account to avoid these problems in the future.

## Application design

When you design your application, [follow the .NET SDK best practices](performance-tips-dotnet-sdk-v3-sql.md) for the best performance. If your application doesn't follow the SDK best practices, you might get slow or failed requests. 

Consider the following when developing your application:

* The application should be in the same region as your Azure Cosmos DB account.
* The SDK has several caches that have to be initialized, which might slow down the first few requests. 
* The connectivity mode should be direct and TCP.
* Avoid high CPU. Make sure to look at the maximum CPU and not the average, which is the default for most logging systems. Anything above roughly 40 percent can increase the latency.

## Metadata operations

If you need to verify that a database or container exists, don't do so by calling `Create...IfNotExistsAsync` or `Read...Async` before doing an item operation. The validation should only be done on application startup when it's necessary, if you expect them to be deleted. These metadata operations generate extra latency, have no service-level agreement (SLA), and have their own separate [limitations](./troubleshoot-request-rate-too-large.md#rate-limiting-on-metadata-requests). They don't scale like data operations.

## Slow requests on bulk mode

[Bulk mode](tutorial-sql-api-dotnet-bulk-import.md) is a throughput optimized mode meant for high data volume operations, not a latency optimized mode; it's meant to saturate the available throughput. If you are experiencing slow requests when using bulk mode make sure that:

* Your application is compiled in Release configuration.
* You are not measuring latency while debugging the application (no debuggers attached).
* The volume of operations is high, don't use bulk for less than 1000 operations. Your provisioned throughput dictates how many operations per second you can process, your goal with bulk would be to utilize as much of it as possible.
* Monitor the container for [throttling scenarios](troubleshoot-request-rate-too-large.md). If the container is getting heavily throttled it means the volume of data is larger than your provisioned throughput, you need to either scale up the container or reduce the volume of data (maybe create smaller batches of data at a time).
* You are correctly using the `async/await` pattern to process all concurrent Tasks and not [blocking any async operation](https://github.com/davidfowl/AspNetCoreDiagnosticScenarios/blob/master/AsyncGuidance.md#avoid-using-taskresult-and-taskwait).

## <a name="capture-diagnostics"></a>Capture the diagnostics

All the responses in the SDK, including `CosmosException`, have a `Diagnostics` property. This property records all the information related to the single request, including if there were retries or any transient failures. 

The diagnostics are returned as a string. The string changes with each version, as it's improved for troubleshooting different scenarios. With each version of the SDK, the string will have breaking changes to the formatting. Don't parse the string to avoid breaking changes. The following code sample shows how to read diagnostic logs by using the .NET SDK:

```c#
try
{
    ItemResponse<Book> response = await this.Container.CreateItemAsync<Book>(item: testItem);
    if (response.Diagnostics.GetClientElapsedTime() > ConfigurableSlowRequestTimeSpan)
    {
        // Log the diagnostics and add any additional info necessary to correlate to other logs 
        Console.Write(response.Diagnostics.ToString());
    }
}
catch (CosmosException cosmosException)
{
    // Log the full exception including the stack trace 
    Console.Write(cosmosException.ToString());
    // The Diagnostics can be logged separately if required.
    Console.Write(cosmosException.Diagnostics.ToString());
}

// When using Stream APIs
ResponseMessage response = await this.Container.CreateItemStreamAsync(partitionKey, stream);
if (response.Diagnostics.GetClientElapsedTime() > ConfigurableSlowRequestTimeSpan || !response.IsSuccessStatusCode)
{
    // Log the diagnostics and add any additional info necessary to correlate to other logs 
    Console.Write(response.Diagnostics.ToString());
}
```

## Diagnostics in version 3.19 and later

The JSON structure has breaking changes with each version of the SDK. This makes it unsafe to be parsed. The JSON represents a tree structure of the request going through the SDK. The following sections cover a few key things to look at.

### <a name="cpu-history"></a>CPU history

High CPU utilization is the most common cause for slow requests. For optimal latency, CPU usage should be roughly 40 percent. Use 10 seconds as the interval to monitor maximum (not average) CPU utilization. CPU spikes are more common with cross-partition queries, where the requests might do multiple connections for a single query.

# [3.21 or later SDK](#tab/cpu-new)

The timeouts include diagnostics, which contain the following, for example:

```json
"systemHistory": [
{
"dateUtc": "2021-11-17T23:38:28.3115496Z",
"cpu": 16.731,
"memory": 9024120.000,
"threadInfo": {
"isThreadStarving": "False",
....
}

},
{
"dateUtc": "2021-11-17T23:38:28.3115496Z",
"cpu": 16.731,
"memory": 9024120.000,
"threadInfo": {
"isThreadStarving": "False",
....
}

},
...
]
```

* If the `cpu` values are over 70 percent, the timeout is likely to be caused by CPU exhaustion. In this case, the solution is to investigate the source of the high CPU utilization and reduce it, or scale the machine to a larger resource size.
* If the `threadInfo/isThreadStarving` nodes have `True` values, the cause is thread starvation. In this case, the solution is to investigate the source or sources of the thread starvation (potentially locked threads), or scale the machine or machines to a larger resource size.
* If the `dateUtc` time between measurements is not approximately 10 seconds, it also indicates contention on the thread pool. CPU is measured as an independent task that is enqueued in the thread pool every 10 seconds. If the time between measurements is longer, it indicates that the async tasks aren't able to be processed in a timely fashion. The most common scenario is when your application code is [blocking calls over async code](https://github.com/davidfowl/AspNetCoreDiagnosticScenarios/blob/master/AsyncGuidance.md#avoid-using-taskresult-and-taskwait).

# [Older SDK](#tab/cpu-old)

If the error contains `TransportException` information, it might also contain `CPU history`:

```
CPU history:
(2020-08-28T00:40:09.1769900Z 0.114),
(2020-08-28T00:40:19.1763818Z 1.732),
(2020-08-28T00:40:29.1759235Z 0.000),
(2020-08-28T00:40:39.1763208Z 0.063),
(2020-08-28T00:40:49.1767057Z 0.648),
(2020-08-28T00:40:59.1689401Z 0.137),
CPU count: 8)
```

* If the CPU measurements are over 70 percent, the timeout is likely to be caused by CPU exhaustion. In this case, the solution is to investigate the source of the high CPU utilization and reduce it, or scale the machine to a larger resource size.
* If the CPU measurements are not happening every 10 seconds (for example, there are gaps, or measurement times indicate longer times in between measurements), the cause is thread starvation. In this case the solution is to investigate the source or sources of the thread starvation (potentially locked threads), or scale the machine or machines to a larger resource size.

---

#### Solution

The client application that uses the SDK should be scaled up or out.

### <a name="httpResponseStats"></a>HttpResponseStats

`HttpResponseStats` are requests that go to the [gateway](sql-sdk-connection-modes.md). Even in direct mode, the SDK gets all the metadata information from the gateway.

If the request is slow, first verify that none of the previous suggestions yield the desired results. If it's still slow, different patterns point to different problems. The following table provides more details.

| Number of requests | Scenario | Description | 
|----------|-------------|-------------|
| Single to all | Request timeout or `HttpRequestExceptions` | Points to [SNAT port exhaustion](troubleshoot-dot-net-sdk.md#snat), or a lack of resources on the machine to process the request in time. |
| Single or small percentage (SLA isn't violated) | All | A single or small percentage of slow requests can be caused by several different transient problems, and should be expected. | 
| All | All | Points to a problem with the infrastructure or networking. |
| SLA violated | No changes to application, and SLA dropped. | Points to a problem with the Azure Cosmos DB service. |

```json
"HttpResponseStats": [
    {
        "StartTimeUTC": "2021-06-15T13:53:09.7961124Z",
        "EndTimeUTC": "2021-06-15T13:53:09.7961127Z",
        "RequestUri": "https://127.0.0.1:8081/dbs/347a8e44-a550-493e-88ee-29a19c070ecc/colls/4f72e752-fa91-455a-82c1-bf253a5a3c4e",
        "ResourceType": "Collection",
        "HttpMethod": "GET",
        "ActivityId": "e16e98ec-f2e3-430c-b9e9-7d99e58a4f72",
        "StatusCode": "OK"
    }
]
```

### <a name="storeResult"></a>StoreResult

`StoreResult` represents a single request to Azure Cosmos DB, by using direct mode with the TCP protocol.

If it's still slow, different patterns point to different problems. The following table provides more details.

| Number of requests | Scenario | Description | 
|----------|-------------|-------------|
| Single to all | `StoreResult` contains `TransportException` | Points to [SNAT port exhaustion](troubleshoot-dot-net-sdk.md#snat), or a lack of resources on the machine to process the request in time. |
| Single or small percentage (SLA isn't violated) | All | A single or small percentage of slow requests can be caused by several different transient problems, and should be expected. | 
| All | All | A problem with the infrastructure or networking. |
| SLA violated | Requests contain multiple failure error codes, like `410` and `IsValid is true`. | Points to a problem with the Azure Cosmos DB service. |
| SLA violated | Requests contain multiple failure error codes, like `410` and `IsValid is false`. | Points to a problem with the machine. |
| SLA violated | `StorePhysicalAddress` are the same, with no failure status code. | Likely a problem with Azure Cosmos DB. |
| SLA violated | `StorePhysicalAddress` have the same partition ID, but different replica IDs, with no failure status code. | Likely a problem with Azure Cosmos DB. |
| SLA violated | `StorePhysicalAddress` is random, with no failure status code. | Points to a problem with the machine. |

For multiple store results for a single request, be aware of the following:

* Strong consistency and bounded staleness consistency always have at least two store results.
* Check the status code of each `StoreResult`. The SDK retries automatically on multiple different [transient failures](troubleshoot-dot-net-sdk-request-timeout.md). The SDK is constantly improved to cover more scenarios. 

### <a name="rntbdRequestStats"></a>RntbdRequestStats 

Show the time for the different stages of sending and receiving a request in the transport layer.

* `ChannelAcquisitionStarted`: The time to get or create a new connection. You can create new connections for numerous different regions. For example, let's say that a connection was unexpectedly closed, or too many requests were getting sent through the existing connections. You create a new connection. 
* *Pipelined time is large* might be caused by a large request.
* *Transit time is large*, which leads to a networking problem. Compare this number to the `BELatencyInMs`. If `BELatencyInMs` is small, then the time was spent on the network, and not on the Azure Cosmos DB service.
* *Received time is large* might be caused by a thread starvation problem. This is the time between having the response and returning the result.

```json
"StoreResult": {
    "ActivityId": "a3d325c1-f4e9-405b-820c-bab4d329ee4c",
    "StatusCode": "Created",
    "SubStatusCode": "Unknown",
    "LSN": 1766,
    "PartitionKeyRangeId": "0",
    "GlobalCommittedLSN": -1,
    "ItemLSN": -1,
    "UsingLocalLSN": false,
    "QuorumAckedLSN": 1765,
    "SessionToken": "-1#1766",
    "CurrentWriteQuorum": 1,
    "CurrentReplicaSetSize": 1,
    "NumberOfReadRegions": 0,
    "IsClientCpuOverloaded": false,
    "IsValid": true,
    "StorePhysicalAddress": "rntbd://127.0.0.1:10253/apps/DocDbApp/services/DocDbServer92/partitions/a4cb49a8-38c8-11e6-8106-8cdcd42c33be/replicas/1p/",
    "RequestCharge": 11.05,
    "BELatencyInMs": "7.954",
    "RntbdRequestStats": [
        {
            "EventName": "Created",
            "StartTime": "2021-06-15T13:53:10.1302477Z",
            "DurationInMicroSec": "6383"
        },
        {
            "EventName": "ChannelAcquisitionStarted",
            "StartTime": "2021-06-15T13:53:10.1366314Z",
            "DurationInMicroSec": "96511"
        },
        {
            "EventName": "Pipelined",
            "StartTime": "2021-06-15T13:53:10.2331431Z",
            "DurationInMicroSec": "50834"
        },
        {
            "EventName": "Transit Time",
            "StartTime": "2021-06-15T13:53:10.2839774Z",
            "DurationInMicroSec": "17677"
        },
        {
            "EventName": "Received",
            "StartTime": "2021-06-15T13:53:10.3016546Z",
            "DurationInMicroSec": "7079"
        },
        {
            "EventName": "Completed",
            "StartTime": "2021-06-15T13:53:10.3087338Z",
            "DurationInMicroSec": "0"
        }
    ],
    "TransportException": null
}
```

### Failure rate violates the Azure Cosmos DB SLA

Contact [Azure support](https://aka.ms/azure-support).

## Next steps

* [Diagnose and troubleshoot](troubleshoot-dot-net-sdk.md) problems when you use the Azure Cosmos DB .NET SDK.
* Learn about performance guidelines for [.NET v3](performance-tips-dotnet-sdk-v3-sql.md) and [.NET v2](performance-tips.md).