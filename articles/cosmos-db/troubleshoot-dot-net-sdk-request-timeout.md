---
title: Troubleshoot Azure Cosmos DB HTTP 408 or request timeout issues with .NET SDK
description: How to diagnose and fix .NET SDK request timeout exception
author: j82w
ms.service: cosmos-db
ms.date: 07/29/2020
ms.author: jawilley
ms.topic: troubleshooting
ms.reviewer: sngun
---

# Diagnose and troubleshoot Azure Cosmos DB .NET SDK request timeout
The HTTP 408 error occurs if the SDK was not able to complete the request before the timeout limit occurs.

## Customizing the timeout on the Azure Cosmos .NET SDK

The SDK has two distinct alternatives to control timeouts, each with a different scope.

### RequestTimeout

The `CosmosClientOptions.RequestTimeout` (or `ConnectionPolicy.RequestTimeout` for SDK V2) configuration allows you to set a timeout that affects each individual network request.  An operation started by a user can span multiple network requests (for example, there could be throttling) and this configuration would apply for each network request on the retry. This is not an end to end operation request timeout.

### CancellationToken

All the async operations in the SDK have an optional CancellationToken parameter. This [CancellationToken](https://docs.microsoft.com/dotnet/standard/threading/how-to-listen-for-cancellation-requests-by-polling) is used throughout the entire operation, across all network requests. In-between network requests, the CancellationToken might be checked and an operation canceled if the related token is expired. CancellationToken should be used to define an approximate expected timeout on the operation scope.

> [!NOTE]
> CancellationToken is a mechanism where the library will check the cancellation when it [won't cause an invalid state](https://devblogs.microsoft.com/premier-developer/recommended-patterns-for-cancellationtoken/). The operation might not cancel exactly when the time defined in the cancellation is up, but rather, after the time is up, it will cancel when it is safe to do so.

## Troubleshooting steps
The following list contains known causes and solutions for request timeout exceptions.

### 1. High CPU utilization (most common case)
For optimal latency, it is recommended that CPU usage should be roughly 40%. It is recommended to use 10 seconds as the interval to monitor max (not average) CPU utilization. CPU spikes are more common with cross partition queries where it might do multiple connections for a single query.

#### Solution:
The client application that uses the SDK should be scaled up/out.

### 2. Socket / Port availability might be low
When running in Azure, clients using the .NET SDK can hit Azure SNAT (PAT) port exhaustion.

#### Solution 1:
Follow the [SNAT Port Exhaustion guide](troubleshoot-dot-net-sdk.md#snat).

#### Solution 2:
If you use an HTTP proxy, make sure it can support the number of connections configured in the SDK `ConnectionPolicy`.
Otherwise, you face connection issues.

### 3. Creating multiple client instances
Creating multiple client instances might lead to connection contention and timeout issues.

#### Solution:
Follow the [performance tips](performance-tips-dotnet-sdk-v3-sql.md#sdk-usage), and use a single CosmosClient instance across an entire process.

### 4. Hot partition key
Azure Cosmos DB distributes the overall provisioned throughput evenly across physical partitions. When there is a hot partition, one or more logical partition keys on a physical partition are consuming all the physical partition's RU/s, while the RU/s on other physical partitions go unused. As a symptom, the total RU/s consumed will be less than the overall provisioned RU/s at the database or container, but you will still see throttling (429s) on the requests against the hot logical partition key. Use the [Normalized RU Consumption metric](monitor-normalized-request-units.md) to see if the workload is encountering a hot partition. 

#### Solution:
Choose a good partition key that evenly distributes request volume and storage. Learn how to [change your partition key](https://devblogs.microsoft.com/cosmosdb/how-to-change-your-partition-key/).

### 5. High degree of concurrency
The application is doing a high level of concurrency, which can lead to contention on the channel

#### Solution:
The client application that uses the SDK should be scaled up/out.

### 6. Large requests and/or responses
Large requests or responses can lead to head-of-line blocking on the channel and exacerbate contention, even with a relatively low degree of concurrency.

#### Solution:
The client application that uses the SDK should be scaled up/out.

### 7. Failure rate is within Cosmos DB SLA
The application should be able to handle transient failures and retry when necessary. 408 exceptions are not retried because on create paths it's not possible to know if the service created the item or if it did not. Sending the same item again for create will cause a conflict exception. User applications business logic might have custom logic to handle conflicts, which would break from the ambiguity of an existing item vs conflict from a create retry.

### 8. Failure rate is violating the Cosmos DB SLA
Please contact Azure support.

## Next steps
* [Diagnose and troubleshoot](troubleshoot-dot-net-sdk.md) issues when using Azure Cosmos DB .NET SDK
* Learn about performance guidelines for [.NET V3](performance-tips-dotnet-sdk-v3-sql.md) and [.NET V2](performance-tips.md)
