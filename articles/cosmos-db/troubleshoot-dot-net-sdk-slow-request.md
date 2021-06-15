---
title: Troubleshoot Azure Cosmos DB slow requests with the .NET SDK
description: Learn how to diagnose and fix .NET SDK slow requests.
author: j82w
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.date: 06/15/2021
ms.author: jawilley
ms.topic: troubleshooting
ms.reviewer: sngun
ms.custom: devx-track-dotnet
---

# Diagnose and troubleshoot Azure Cosmos DB .NET SDK slow requests
[!INCLUDE[appliesto-sql-api](includes/appliesto-sql-api.md)]

Cosmos DB slow requests can happen for multiple reasons. This guide is to help root cause the different issues.

## Application design

Most issues are caused by not following these guidelines. Follow the [performance guide](performance-tips-dotnet-sdk-v3-sql). 

Key points:
1. Application in same region as Cosmos DB service
2. Singleton instance of the SDK instance. The SDK has several caches that have to be initialized which may slow down the first few requests. 
3. Use Direct + TCP connectivity mode
4. Avoid High CPU. Make sure to look at Max CPU and not average, which is the default for most logging systems. Anything above roughly 40% can cause the latency to start to increase.

## 429 or Throttles

This is the most common reason for slow requests. Cosmos DB will throttle requests if it exceeds the allocated RUs for the database or container. The SDK has built in logic to retry on these requests. The [request rate too large](troubleshoot-request-rate-too-large#how-to-investigate) troubleshooting explains how to check if the requests are being throttled and how to scale the Cosmos DB service to avoid the issue in the future.

## Capture the diagnostics

All responses in the SDK including CosmosException have a Diagnostics property. The diagnostics records all the information related to the single request including if there was retries or any transient failures. This is needed for the Cosmos DB team to be able to root cause any latency issues.

The Diagnostics is returned as a string and should not be parsed. The string changes with each version as it is improved to better troubleshoot different scenarios.

```c#
ItemResponse<Book> response = await this.Container.CreateItemAsync<Book>(item: testItem);
if (response.Diagnostics.GetClientElapsedTime() > ConfigurableSlowRequestTimeSpan)
{
    // Log the diagnostics and add any additional info necessary to correlate to other logs 
    Console.Write(response.Diagnostics.ToString());
}
```

## Understanding the diagnostics in 3.19 and greater
The json structure should not be parsed as it will change with each version of the SDK. The json represents a tree structure of the request going through the SDK. This is covering a few key things to look.

## CPU History
High CPU is a very common cause to slow requests. Most logging systems record an average over a minute or sometime longer duration. It's possible for the SDK to have a spike in workload that causes the CPU to go to 100% for only a few seconds then drop back down. The SDK does a best effort to log the CPU history at a 10-second interval to ensure high CPU is not an issue. If the CPU is high based the values in the diagnostics then it is likely the cause of the extra latency. Try scaling the application hosting process to reduce workload for a single instance.

```json
{
    "CPU Load History": {
        "CPU History": "(2021-06-15T13:53:08.8699893Z 75.000)"
    }
},
```

### HttpResponseStats
HttpResponseStats are request going to gateway. Even in Direct mode the SDK gets all the meta data information from the gateway.

If the request is slow first verify all the suggestions above.

If it is still slow different patterns point to different issues:
* Always consistently slow this points to a networking issue or infrastructure issue.
* Slow only for a short period of time. This points to an issue with Cosmos DB service.
* Single request this likely a transient networking issues.
* First request shows multiple HttpResponseStats. This is expected to initialize caches.
* Direct mode shows multiple HttpResponseStats on a few requests. The cache is stale and the SDK is refreshing the caches.

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

### StoreResult
StoreResult represents a single request to Cosmos DB using Direct + TCP.

If it is still slow different patterns point to different issues:

Single StoreResult is slow:

* Always consistently slow requests points to a networking or infrastructure issue.
* Single request or a very small percentage that does not violate Cosmos DB SLA. These should be ignored as it doesn't violate the Cosmos DB SLA. 
* Multiple StoreResults with the same StorePhysicalAddress. This points to an issue with the Cosmos DB service. 
* Multiple StoreResults to multiple StorePhysicalAddress from a single machine. There is something wrong with the machine

| Number of requests | Scenario | Description | 
|----------|-------------|-------------|
| Single or small percentage | All | This doesn't violate the Cosmos DB SLA. A single or small percentage of slow requests can be caused by several different transient issues and should be expected | 
| All | All | An issue with the infrastructure or networking. |
| SLA Violated | Requests contain multiple failure error codes like 410 | This likely points to an issue with the Cosmos DB service |
| SLA Violated | StorePhysicalAddress is the same with no failure status code  | This likely an issue with Cosmos DB service |
| SLA Violated | StorePhysicalAddress have the same partition ID but different replica IDs with no failure status code | This likely is an issue with the Cosmos DB service |
| SLA Violated | StorePhysicalAddress are random with no failure status code | This likely points to an issue with the machine |

RntbdRequestStats show the time for the different stages of sending and receiving a request.

* ChannelAcquisitionStarted: This is the time to get or create a new connection. New connections can be created for numerous different regions. This can be caused by multiple scenarios like another connection was unexpectedly closed or to many requests where getting sent through the existing connection so additional connections are being created.
* Pipelined time is large this points to possibly a very large request.
* Transit Time is large this points to a networking issue. Compare this number to the BELatencyInMs. If the BELatencyInMs is small then the time was spent on the network and not on the Cosmos DB service.

Multiple StoreResults for single request:

* Strong and bounded staleness consistency will always have at least 2 store results
* Check the status code of each StoreResult. The SDK retries automatically on multiple different [transient failures](troubleshoot-dot-net-sdk-request-timeout). The SDK is constantly being improved to cover more scenarios. 

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