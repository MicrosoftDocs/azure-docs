---
title: Troubleshoot Azure Cosmos DB slow requests with the .NET SDK
description: Learn how to diagnose and fix slow requests when using Azure Cosmos DB .NET SDK.
author: j82w
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.date: 06/15/2021
ms.author: jawilley
ms.topic: troubleshooting
ms.reviewer: sngun
---

# Diagnose and troubleshoot Azure Cosmos DB .NET SDK slow requests
[!INCLUDE[appliesto-sql-api](includes/appliesto-sql-api.md)]

Azure Cosmos DB slow requests can happen for multiple reasons such as request throttling or the way your application is designed. This article explains the different root causes for this issue. 

## Request rate too large (429 throttles)

Request throttling is the most common reason for slow requests. Azure Cosmos DB will throttle requests if they exceed the allocated RUs for the database or container. The SDK has built-in logic to retry these requests. The [request rate too large](troubleshoot-request-rate-too-large.md#how-to-investigate) troubleshooting article explains how to check if the requests are being throttled and how to scale your account to avoid these issues in the future.

## Application design

If your application doesn't follow the SDK best practices, it can result in different issues that will cause slow or failed requests. Follow the [.NET SDK best practices](performance-tips-dotnet-sdk-v3-sql.md) for the best performance.

Consider the following when developing your application:
* Application should be in the same region as your Azure Cosmos DB account.
* Singleton instance of the SDK instance. The SDK has several caches that have to be initialized which may slow down the first few requests. 
* Use Direct + TCP connectivity mode
* Avoid High CPU. Make sure to look at Max CPU and not average, which is the default for most logging systems. Anything above roughly 40% can increase the latency.


## <a name="capture-diagnostics"></a>Capture the diagnostics

All the responses in the SDK including `CosmosException` have a Diagnostics property. This property records all the information related to the single request including if there were retries or any transient failures. 

The Diagnostics are returned as a string. The string changes with each version as it is improved to better troubleshooting different scenarios. With each version of the SDK, the string will have breaking changes to the formatting. Do not parse the string to avoid breaking changes. The following code sample shows how to read diagnostic logs using the .NET SDK:

```c#
try
{
    ItemResponse<Book> response = await this.Container.CreateItemAsync<Book>(item: testItem);
    if (response.Diagnostics.GetClientElapsedTime() > ConfigurableSlowRequestTimeSpan)
    {
        // Log the diagnostics and add any additional info necessary to correlate to other logs 
        Console.Write(response.Diagnostics.ToString());
    }
}catch(CosmosException cosmosException){
    // Log the full exception including the stack trace 
    Console.Write(cosmosException.ToString());
    // The Diagnostics can be logged separately if required.
    Console.Write(cosmosException.Diagnostics.ToString());
}

ResponseMessage response = await this.Container.CreateItemStreamAsync(partitionKey, stream);
if (response.Diagnostics.GetClientElapsedTime() > ConfigurableSlowRequestTimeSpan || IsFailureStatusCode(response.StatusCode))
{
    // Log the diagnostics and add any additional info necessary to correlate to other logs 
    Console.Write(response.Diagnostics.ToString());
}
```


## Diagnostics in version 3.19 and higher
The JSON structure has breaking changes with each version of the SDK. This makes it unsafe to be parsed. The JSON represents a tree structure of the request going through the SDK. This covers a few key things to look at:

### <a name="cpu-history"></a>CPU history
High CPU utilization is the most common cause for slow requests. For optimal latency, CPU usage should be roughly 40 percent. Use 10 seconds as the interval to monitor maximum (not average) CPU utilization. CPU spikes are more common with cross-partition queries where the requests might do multiple connections for a single query.

If the error contains `TransportException` information, it might contain also `CPU History`:

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

* If the CPU utilization is over 70%, the timeout is likely to be caused by CPU exhaustion. In this case, the solution is to investigate the source of the high CPU utilization and reduce it or scale the machine to a larger resource size.
* If the CPU measurements are not happening every 10 seconds, the gaps or measurement times indicate larger times in between measurements. In such a case, the cause is thread starvation. The solution is to investigate the source/s of the thread starvation (potentially locked threads), or scale the machine/s to a larger resource size.

#### Solution:
The client application that uses the SDK should be scaled up or out.


### <a name="httpResponseStats"></a>HttpResponseStats
HttpResponseStats are request going to [gateway](sql-sdk-connection-modes.md). Even in Direct mode the SDK gets all the meta data information from the gateway.

If the request is slow, first verify all the suggestions above don't yield results.

If it is still slow different patterns point to different issues:

Single store result for a single request

| Number of requests | Scenario | Description | 
|----------|-------------|-------------|
| Single to all | Request Timeout or HttpRequestExceptions | Points to [SNAT Port exhaustion](troubleshoot-dot-net-sdk.md#snat) or lack of resources on the machine to process request in time. |
| Single or small percentage (SLA is not violated) | All | A single or small percentage of slow requests can be caused by several different transient issues and should be expected. | 
| All | All | Points to an issue with the infrastructure or networking. |
| SLA Violated | No changes to application and SLA dropped | Points to an issue with the Azure Cosmos DB service. |

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
StoreResult represents a single request to Azure Cosmos DB using Direct mode with TCP protocol.

If it is still slow different patterns point to different issues:

Single store result for a single request

| Number of requests | Scenario | Description | 
|----------|-------------|-------------|
| Single to all | StoreResult contains TransportException | Points to [SNAT Port exhaustion](troubleshoot-dot-net-sdk.md#snat) or lack of resources on the machine to process request in time. |
| Single or small percentage (SLA is not violated) | All | A single or small percentage of slow requests can be caused by several different transient issues and should be expected. | 
| All | All | An issue with the infrastructure or networking. |
| SLA Violated | Requests contain multiple failure error codes like 410 and IsValid is true | Points to an issue with the Cosmos DB service |
| SLA Violated | Requests contain multiple failure error codes like 410 and IsValid is false | Points to an issue with the machine |
| SLA Violated | StorePhysicalAddress is the same with no failure status code | Likely an issue with Cosmos DB service |
| SLA Violated | StorePhysicalAddress have the same partition ID but different replica IDs with no failure status code | Likely an issue with the Cosmos DB service |
| SLA Violated | StorePhysicalAddress are random with no failure status code | Points to an issue with the machine |

Multiple StoreResults for single request:

* Strong and bounded staleness consistency will always have at least two store results
* Check the status code of each StoreResult. The SDK retries automatically on multiple different [transient failures](troubleshoot-dot-net-sdk-request-timeout.md). The SDK is constantly being improved to cover more scenarios. 

### <a name="rntbdRequestStats"></a>RntbdRequestStats 
Show the time for the different stages of sending and receiving a request in the transport layer.

* ChannelAcquisitionStarted: The time to get or create a new connection. New connections can be created for numerous different regions. For example, a connection was unexpectedly closed or too many requests were getting sent through the existing connections so a new connection is being created. 
* Pipelined time is large points to possibly a large request.
* Transit time is large, which leads to a networking issue. Compare this number to the `BELatencyInMs`. If the BELatencyInMs is small, then the time was spent on the network and not on the Azure Cosmos DB service.
* Received time is large this points to a thread starvation issue. This the time between having the response and returning the result.

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
Contact [Azure Support](https://aka.ms/azure-support).

## Next steps
* [Diagnose and troubleshoot](troubleshoot-dot-net-sdk.md) issues when you use the Azure Cosmos DB .NET SDK.
* Learn about performance guidelines for [.NET v3](performance-tips-dotnet-sdk-v3-sql.md) and [.NET v2](performance-tips.md).
