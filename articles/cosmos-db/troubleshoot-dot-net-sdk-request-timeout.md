---
title: Troubleshoot Azure Cosmos DB HTTP 408 or request timeout issues with the .NET SDK
description: Learn how to diagnose and fix .NET SDK request timeout exceptions.
author: j82w
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.date: 03/05/2021
ms.author: jawilley
ms.topic: troubleshooting
ms.reviewer: sngun
ms.custom: devx-track-dotnet
---

# Diagnose and troubleshoot Azure Cosmos DB .NET SDK request timeout exceptions
[!INCLUDE[appliesto-sql-api](includes/appliesto-sql-api.md)]

The HTTP 408 error occurs if the SDK was unable to complete the request before the timeout limit occurred.

## Customize the timeout on the Azure Cosmos DB .NET SDK

The SDK has two distinct alternatives to control timeouts, each with a different scope.

### RequestTimeout

The `CosmosClientOptions.RequestTimeout` (or `ConnectionPolicy.RequestTimeout` for SDK v2) configuration allows you to set a timeout that affects each individual network request. An operation started by a user can span multiple network requests (for example, there could be throttling). This configuration would apply for each network request on the retry. This timeout isn't an end-to-end operation request timeout.

### CancellationToken

All the async operations in the SDK have an optional CancellationToken parameter. This [CancellationToken](/dotnet/standard/threading/how-to-listen-for-cancellation-requests-by-polling) parameter is used throughout the entire operation, across all network requests. In between network requests, the cancellation token might be checked and an operation canceled if the related token is expired. The cancellation token should be used to define an approximate expected timeout on the operation scope.

> [!NOTE]
> The `CancellationToken` parameter is a mechanism where the library will check the cancellation when it [won't cause an invalid state](https://devblogs.microsoft.com/premier-developer/recommended-patterns-for-cancellationtoken/). The operation might not cancel exactly when the time defined in the cancellation is up. Instead, after the time is up, it cancels when it's safe to do so.

## Troubleshooting steps
The following list contains known causes and solutions for request timeout exceptions.

### High CPU utilization
High CPU utilization is the most common case. For optimal latency, CPU usage should be roughly 40 percent. Use 10 seconds as the interval to monitor maximum (not average) CPU utilization. CPU spikes are more common with cross-partition queries where it might do multiple connections for a single query.

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

* If the CPU measurements are over 70%, the timeout is likely to be caused by CPU exhaustion. In this case, the solution is to investigate the source of the high CPU utilization and reduce it, or scale the machine to a larger resource size.
* If the CPU measurements are not happening every 10 seconds (e.g., gaps or measurement times indicate larger times in between measurements), the cause is thread starvation. In this case the solution is to investigate the source/s of the thread starvation (potentially locked threads), or scale the machine/s to a larger resource size.

#### Solution:
The client application that uses the SDK should be scaled up or out.

### Socket or port availability might be low
When running in Azure, clients using the .NET SDK can hit Azure SNAT (PAT) port exhaustion.

#### Solution 1:
If you're running on Azure VMs, follow the [SNAT port exhaustion guide](troubleshoot-dot-net-sdk.md#snat).

#### Solution 2:
If you're running on Azure App Service, follow the [connection errors troubleshooting guide](../app-service/troubleshoot-intermittent-outbound-connection-errors.md#cause) and [use App Service diagnostics](https://azure.github.io/AppService/2018/03/01/Deep-Dive-into-TCP-Connections-in-App-Service-Diagnostics.html).

#### Solution 3:
If you're running on Azure Functions, verify you're following the [Azure Functions recommendation](../azure-functions/manage-connections.md#static-clients) of maintaining singleton or static clients for all of the involved services (including Azure Cosmos DB). Check the [service limits](../azure-functions/functions-scale.md#service-limits) based on the type and size of your Function App hosting.

#### Solution 4:
If you use an HTTP proxy, make sure it can support the number of connections configured in the SDK `ConnectionPolicy`. Otherwise, you'll face connection issues.

### Create multiple client instances
Creating multiple client instances might lead to connection contention and timeout issues.

#### Solution:
Follow the [performance tips](performance-tips-dotnet-sdk-v3-sql.md#sdk-usage), and use a single CosmosClient instance across an entire process.

### Hot partition key
Azure Cosmos DB distributes the overall provisioned throughput evenly across physical partitions. When there's a hot partition, one or more logical partition keys on a physical partition are consuming all the physical partition's Request Units per second (RU/s). At the same time, the RU/s on other physical partitions are going unused. As a symptom, the total RU/s consumed will be less than the overall provisioned RU/s at the database or container, but you'll still see throttling (429s) on the requests against the hot logical partition key. Use the [Normalized RU Consumption metric](monitor-normalized-request-units.md) to see if the workload is encountering a hot partition. 

#### Solution:
Choose a good partition key that evenly distributes request volume and storage. Learn how to [change your partition key](https://devblogs.microsoft.com/cosmosdb/how-to-change-your-partition-key/).

### High degree of concurrency
The application is doing a high level of concurrency, which can lead to contention on the channel.

#### Solution:
The client application that uses the SDK should be scaled up or out.

### Large requests or responses
Large requests or responses can lead to head-of-line blocking on the channel and exacerbate contention, even with a relatively low degree of concurrency.

#### Solution:
The client application that uses the SDK should be scaled up or out.

### Failure rate is within the Azure Cosmos DB SLA
The application should be able to handle transient failures and retry when necessary. Any 408 exceptions aren't retried because on create paths it's impossible to know if the service created the item or not. Sending the same item again for create will cause a conflict exception. User applications business logic might have custom logic to handle conflicts, which would break from the ambiguity of an existing item versus conflict from a create retry.

### Failure rate violates the Azure Cosmos DB SLA
Contact [Azure Support](https://aka.ms/azure-support).

## Next steps
* [Diagnose and troubleshoot](troubleshoot-dot-net-sdk.md) issues when you use the Azure Cosmos DB .NET SDK.
* Learn about performance guidelines for [.NET v3](performance-tips-dotnet-sdk-v3-sql.md) and [.NET v2](performance-tips.md).