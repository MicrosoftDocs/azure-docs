---
title: Troubleshoot Azure Cosmos DB HTTP 408 or request timeout issues with the .NET SDK
description: Learn how to diagnose and fix .NET SDK request timeout exceptions.
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.date: 11/16/2023
ms.author: sidandrews
ms.topic: troubleshooting
ms.reviewer: mjbrown
ms.custom: devx-track-dotnet, ignite-2022
---

# Diagnose and troubleshoot Azure Cosmos DB .NET SDK request timeout exceptions
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

The HTTP 408 error occurs if the SDK was unable to complete the request before the timeout limit occurred.

It is important to make sure the application design is following our [guide for designing resilient applications with Azure Cosmos DB SDKs](conceptual-resilient-sdk-applications.md) to make sure it correctly reacts to different network conditions. Your application should have retries in place for timeout errors as these are normally expected in a distributed system.

When evaluating the case for timeout errors:

* What is the impact measured in volume of operations affected compared to the operations succeeding? Is it within the service SLAs?
* Is the P99 latency / availability affected?
* Are the failures affecting all your application instances or only a subset? When the issue is reduced to a subset of instances, it's commonly a problem related to those instances.

## Customize the timeout on the Azure Cosmos DB .NET SDK

The SDK has two distinct alternatives to control timeouts, each with a different scope.

### Request level timeouts

The `CosmosClientOptions.RequestTimeout` (or `ConnectionPolicy.RequestTimeout` for SDK v2) configuration allows you to set a timeout for the network request after the request left the SDK and is on the network, until a response is received.

The `CosmosClientOptions.OpenTcpConnectionTimeout` (or `ConnectionPolicy.OpenTcpConnectionTimeout` for SDK v2) configuration allows you to set a timeout for the time spent opening an initial connection. Once a connection is opened, subsequent requests will use the connection.

An operation started by a user can span multiple network requests, for example, retries. These two configurations are per-request, not end-to-end for an operation.

### CancellationToken

All the async operations in the SDK have an optional CancellationToken parameter. This [CancellationToken](/dotnet/standard/threading/how-to-listen-for-cancellation-requests-by-polling) parameter is used throughout the entire operation, across all network requests and retries. In between network requests, the cancellation token might be checked and an operation canceled if the related token is expired. The cancellation token should be used to define an approximate expected timeout on the operation scope.

> [!NOTE]
> The `CancellationToken` parameter is a mechanism where the library will check the cancellation when it [won't cause an invalid state](https://devblogs.microsoft.com/premier-developer/recommended-patterns-for-cancellationtoken/). The operation might not cancel exactly when the time defined in the cancellation is up. Instead, after the time is up, it cancels when it's safe to do so.

## Troubleshooting steps

The following list contains known causes and solutions for request timeout exceptions.

### CosmosOperationCanceledException

This type of exception is common when your application is passing [CancellationTokens](#cancellationtoken) to the SDK operations. The SDK checks the state of the `CancellationToken` in-between [retries](conceptual-resilient-sdk-applications.md#should-my-application-retry-on-errors) and if the `CancellationToken` is canceled, it will abort the current operation with this exception.

The exception's `Message` / `ToString()` will also indicate the state of your `CancellationToken` through `Cancellation Token has expired: true` and it will also contain [Diagnostics](troubleshoot-dotnet-sdk.md#capture-diagnostics) that contain the context of the cancellation for the involved requests.

These exceptions are safe to retry on and can be treated as [timeouts](conceptual-resilient-sdk-applications.md#timeouts-and-connectivity-related-failures-http-408503) from the retrying perspective.

#### Solution

Verify the configured time in your `CancellationToken`, make sure that it's greater than your [RequestTimeout](#request-level-timeouts) and the [CosmosClientOptions.OpenTcpConnectionTimeout](/dotnet/api/microsoft.azure.cosmos.cosmosclientoptions.opentcpconnectiontimeout) (if you're using [Direct mode](sdk-connection-modes.md)). 
If the available time in the `CancellationToken` is less than the configured timeouts, and the SDK is facing [transient connectivity issues](conceptual-resilient-sdk-applications.md#timeouts-and-connectivity-related-failures-http-408503), the SDK won't be able to retry and will throw `CosmosOperationCanceledException`.

### High CPU utilization

High CPU utilization is the most common case. For optimal latency, CPU usage should be roughly 40 percent. Use 10 seconds as the interval to monitor maximum (not average) CPU utilization. CPU spikes are more common with cross-partition queries where it might do multiple connections for a single query.

# [3.21 and 2.16 or greater SDK](#tab/cpu-new)

The timeouts will contain *Diagnostics*, which contain:

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

* If the `cpu` values are over 70%, the timeout is likely to be caused by CPU exhaustion. In this case, the solution is to investigate the source of the high CPU utilization and reduce it, or scale the machine to a larger resource size.
* If the `threadInfo/isThreadStarving` nodes have `True` values, the cause is thread starvation. In this case the solution is to investigate the source/s of the thread starvation (potentially locked threads), or scale the machine/s to a larger resource size.
* If the `dateUtc` time in-between measurements isn't approximately 10 seconds, it also would indicate contention on the thread pool. CPU is measured as an independent Task that is enqueued in the thread pool every 10 seconds, if the time in-between measurement is longer, it would indicate that the async Tasks aren't able to be processed in a timely fashion. Most common scenarios are when doing [blocking calls over async code](https://github.com/davidfowl/AspNetCoreDiagnosticScenarios/blob/master/AsyncGuidance.md#avoid-using-taskresult-and-taskwait) in the application code.

# [Older SDK](#tab/cpu-old)

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
* If the CPU measurements aren't happening every 10 seconds (e.g., gaps or measurement times indicate larger times in between measurements), the cause is thread starvation. In this case the solution is to investigate the source/s of the thread starvation (potentially locked threads), or scale the machine/s to a larger resource size.

---

#### Solution

The client application that uses the SDK should be scaled up or out.

### Socket or port availability might be low

When running in Azure, clients using the .NET SDK can hit Azure SNAT (PAT) port exhaustion.

#### Solution 1

If you're running on Azure VMs, follow the [SNAT port exhaustion guide](troubleshoot-dotnet-sdk.md#snat).

#### Solution 2

If you're running on Azure App Service, follow the [connection errors troubleshooting guide](../../app-service/troubleshoot-intermittent-outbound-connection-errors.md#cause) and [use App Service diagnostics](https://azure.github.io/AppService/2018/03/01/Deep-Dive-into-TCP-Connections-in-App-Service-Diagnostics.html).

#### Solution 3

If you're running on Azure Functions, verify you're following the [Azure Functions recommendation](../../azure-functions/manage-connections.md#static-clients) of maintaining singleton or static clients for all of the involved services (including Azure Cosmos DB). Check the [service limits](../../azure-functions/functions-scale.md#service-limits) based on the type and size of your Function App hosting.

#### Solution 4

If you use an HTTP proxy, make sure it can support the number of connections configured in the SDK `ConnectionPolicy`. Otherwise, you'll face connection issues.

### Create multiple client instances

Creating multiple client instances might lead to connection contention and timeout issues. The [Diagnostics](./troubleshoot-dotnet-sdk.md#capture-diagnostics) contain two relevant properties:

```json
{
    "NumberOfClientsCreated":X,
    "NumberOfActiveClients":Y,
}
```

`NumberOfClientsCreated` tracks the number of times a `CosmosClient` was created within the same AppDomain, and `NumberOfActiveClients` tracks the active clients (not disposed). The expectation is that if the singleton pattern is followed, `X` would match the number of accounts the application works with and that `X` is equal to `Y`.

If `X` is greater than `Y`, it means the application is creating and disposing client instances. This can lead to [connection contention](#socket-or-port-availability-might-be-low) and/or [CPU contention](#high-cpu-utilization).

#### Solution

Follow the [performance tips](performance-tips-dotnet-sdk-v3.md#sdk-usage), and use a single CosmosClient instance per account across an entire process. Avoid creating and disposing clients.

### Hot partition key

Azure Cosmos DB distributes the overall provisioned throughput evenly across physical partitions. When there's a hot partition, one or more logical partition keys on a physical partition are consuming all the physical partition's Request Units per second (RU/s). At the same time, the RU/s on other physical partitions are going unused. As a symptom, the total RU/s consumed will be less than the overall provisioned RU/s at the database or container, but you'll still see throttling (429s) on the requests against the hot logical partition key. Use the [Normalized RU Consumption metric](../monitor-normalized-request-units.md) to see if the workload is encountering a hot partition. 

#### Solution

Choose a good partition key that evenly distributes request volume and storage. Learn how to [change your partition key](https://devblogs.microsoft.com/cosmosdb/how-to-change-your-partition-key/).

### High degree of concurrency

The application is doing a high level of concurrency, which can lead to contention on the channel.

#### Solution

The client application that uses the SDK should be scaled up or out.

### Large requests or responses

Large requests or responses can lead to head-of-line blocking on the channel and exacerbate contention, even with a relatively low degree of concurrency.

#### Solution
The client application that uses the SDK should be scaled up or out.

### Failure rate is within the Azure Cosmos DB SLA

The application should be able to handle transient failures and retry when necessary. Any 408 exceptions aren't retried because on create paths it's impossible to know if the service created the item or not. Sending the same item again for create will cause a conflict exception. User applications business logic might have custom logic to handle conflicts, which would break from the ambiguity of an existing item versus conflict from a create retry.

### Failure rate violates the Azure Cosmos DB SLA

Contact [Azure Support](https://aka.ms/azure-support).

## Next steps

* [Diagnose and troubleshoot](troubleshoot-dotnet-sdk.md) issues when you use the Azure Cosmos DB .NET SDK.
* Learn about performance guidelines for [.NET v3](performance-tips-dotnet-sdk-v3.md) and [.NET v2](performance-tips.md).
