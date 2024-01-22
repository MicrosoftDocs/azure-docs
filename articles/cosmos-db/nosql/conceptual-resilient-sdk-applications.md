---
title: Designing resilient applications with Azure Cosmos DB SDKs
description: Learn how to build resilient applications using the Azure Cosmos DB SDKs and what all are the expected error status codes to retry on.
author: ealsur
ms.service: cosmos-db
ms.date: 05/05/2022
ms.author: maquaran
ms.subservice: nosql
ms.topic: conceptual
---
# Designing resilient applications with Azure Cosmos DB SDKs
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

When authoring client applications that interact with Azure Cosmos DB through any of the SDKs, it's important to understand a few key fundamentals. This article is a design guide to help you understand these fundamentals and design resilient applications.

## Overview

For a video overview of the concepts discussed in this article, see:

> [!VIDEO https://www.youtube.com/embed/McZIQhZpvew?start=118]
>

## Connectivity modes

Azure Cosmos DB SDKs can connect to the service in two [connectivity modes](sdk-connection-modes.md). The .NET and Java SDKs can connect to the service in both Gateway and Direct mode, while the others can only connect in Gateway mode. Gateway mode uses the HTTP protocol and Direct mode typically uses the TCP protocol.

Gateway mode is always used to fetch metadata such as the account, container, and routing information regardless of which mode SDK is configured to use. This information is cached in memory and is used to connect to the [service replicas](../partitioning-overview.md#replica-sets).

In summary, for SDKs in Gateway mode, you can expect HTTP traffic, while for SDKs in Direct mode, you can expect a combination of HTTP and TCP traffic under different circumstances (like initialization, or fetching metadata, or routing information).

## Client instances and connections

Regardless of the connectivity mode, it's critical to maintain a Singleton instance of the SDK client per account per application. Connections, both HTTP and TCP, are scoped to the client instance. Most compute environments have limitations in terms of the number of connections that can be open at the same time and when these limits are reached, connectivity will be affected.

## Distributed applications and networks

When you design distributed applications, there are three key components:

* Your application and the environment it runs on.
* The network, which includes any component between your application and the Azure Cosmos DB service endpoint.
* The Azure Cosmos DB service endpoint.

When failures occur, they often fall into one of these three areas, and it's important to understand that due to the distributed nature of the system, it's impractical to expect 100% availability for any of these components.

Azure Cosmos DB  has a [comprehensive set of availability SLAs](../high-availability.md#slas), but none of them is 100%. The network components that connect your application to the service endpoint can have transient hardware issues and lose packets. Even the compute environment where your application runs could have a CPU spike affecting operations. These failure conditions can affect the operations of the SDKs and normally surface as errors with particular codes.

Your application should be resilient to a [certain degree](#when-to-contact-customer-support) of potential failures across these components by implementing [retry policies](#should-my-application-retry-on-errors) over the responses provided by the SDKs.

## Should my application retry on errors?

The short answer is **yes**. But not all errors make sense to retry on, some of the error or status codes aren't transient. The table below describes them in detail:

| Status Code | Should add retry | SDKs retry | Description |
|----------|-------------|-------------|
| 400 | No | No | [Bad request](troubleshoot-bad-request.md) |
| 401 | No | No | [Not authorized](troubleshoot-unauthorized.md) |
| 403 | Optional | No | [Forbidden](troubleshoot-forbidden.md) |
| 404 | No | No | [Resource is not found](troubleshoot-not-found.md) |
| 408 | Yes | Yes | [Request timed out](troubleshoot-dotnet-sdk-request-timeout.md) |
| 409 | No | No | Conflict failure is when the identity (ID and partition key) provided for a resource on a write operation has been taken by an existing resource or when a [unique key constraint](../unique-keys.md) has been violated. |
| 410 | Yes | Yes | Gone exceptions (transient failure that shouldn't violate SLA) |
| 412 | No | No | Precondition failure is where the operation specified an eTag that is different from the version available at the server. It's an [optimistic concurrency](database-transactions-optimistic-concurrency.md#optimistic-concurrency-control) error. Retry the request after reading the latest version of the resource and updating the eTag on the request.
| 413 | No | No | [Request Entity Too Large](../concepts-limits.md#per-item-limits) |
| 429 | Yes | Yes | It's safe to retry on a 429. Review the [guide to troubleshoot HTTP 429](troubleshoot-request-rate-too-large.md).|
| 449 | Yes | Yes | Transient error that only occurs on write operations, and is safe to retry. This can point to a design issue where too many concurrent operations are trying to update the same object in Azure Cosmos DB. |
| 500 | No | No | The operation failed due to an unexpected service error. Contact support by filing an [Azure support issue](https://aka.ms/azure-support). |
| 503 | Yes | Yes | [Service unavailable](troubleshoot-service-unavailable.md) |

In the table above, all the status codes marked with **Yes** on the second column should have some degree of retry coverage in your application.

### HTTP 403

The Azure Cosmos DB SDKs don't retry on HTTP 403 failures in general, but there are certain errors associated with HTTP 403 that your application might decide to react to. For example, if you receive an error indicating that [a Partition Key is full](troubleshoot-forbidden.md#partition-key-exceeding-storage), you might decide to alter the partition key of the document you're trying to write based on some business rule.

### HTTP 429

The Azure Cosmos DB SDKs will retry on HTTP 429 errors by default following the client configuration and honoring the service's response `x-ms-retry-after-ms` header, by waiting the indicated time and retrying after.

When the SDK retries are exceeded, the error is returned to your application. Ideally inspecting the `x-ms-retry-after-ms` header in the response can be used as a hint to decide how long to wait before retrying the request. Another alternative would be an exponential back-off algorithm or configuring the client to extend the retries on HTTP 429.

### HTTP 449

The Azure Cosmos DB SDKs will retry on HTTP 449 with an incremental back-off during a fixed period of time to accommodate most scenarios.

When the automatic SDK retries are exceeded, the error is returned to your application. HTTP 449 errors can be safely retried. Because of the highly concurrent nature of write operations, it's better to have a random back-off algorithm to avoid repeating the same degree of concurrency after a fixed interval.

### Timeouts and connectivity related failures (HTTP 408/503)

Network timeouts and connectivity failures are among the most common errors. The Azure Cosmos DB SDKs are themselves resilient and will retry timeouts and connectivity issues across the HTTP and TCP protocols if the retry is feasible:

* For read operations, the SDKs will retry any timeout or connectivity related error.
* For write operations, the SDKs will **not** retry because these operations are **not idempotent**. When a timeout occurs waiting for the response, it's not possible to know if the request reached the service.

If the account has multiple regions available, the SDKs will also attempt a [cross-region retry](troubleshoot-sdk-availability.md#transient-connectivity-issues-on-tcp-protocol).

Because of the nature of timeouts and connectivity failures, these might not appear in your [account metrics](../monitor.md), as they only cover failures happening on the service side.

It's recommended for applications to have their own retry policy for these scenarios and take into consideration how to resolve write timeouts. For example, retrying on a Create timeout can yield an HTTP 409 (Conflict) if the previous request did reach the service, but it would succeed if it didn't.

### Language specific implementation details

For further implementation details regarding a language see:

* [.NET SDK implementation information](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/docs/)
* [Java SDK implementation information](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/cosmos/azure-cosmos/docs/)

## Do retries affect my latency?

From the client perspective, any retries will affect the end to end latency of an operation. When your application P99 latency is being affected, understanding the retries that are happening and how to address them is important.

Azure Cosmos DB SDKs provide detailed information in their logs and diagnostics that can help identify which retries are taking place. For more information, see [how to collect .NET SDK diagnostics](troubleshoot-dotnet-sdk-slow-request.md#capture-diagnostics) and [how to collect Java SDK diagnostics](troubleshoot-java-sdk-v4.md#capture-the-diagnostics).

## What about regional outages?

The Azure Cosmos DB SDKs cover regional availability and can perform retries on another account regions. Refer to the [multiregional environments retry scenarios and configurations](troubleshoot-sdk-availability.md) article to understand which scenarios involve other regions.

## When to contact customer support

Before contacting customer support, go through these steps:

* What is the impact measured in volume of operations affected compared to the operations succeeding? Is it within the service SLAs?
* Is the P99 latency affected?
* Are the failures related to [error codes](#should-my-application-retry-on-errors) that my application should retry on and does the application cover such retries?
* Are the failures affecting all your application instances or only a subset? When the issue is reduced to a subset of instances, it's commonly a problem related to those instances.
* Have you gone through the related troubleshooting documents in the above table to rule out a problem on the application environment?

If all the application instances are affected, or the percentage of affected operations is outside service SLAs, or affecting your own application SLAs and P99s, contact customer support.

## Next steps

* Learn about [multiregional environments retry scenarios and configurations](troubleshoot-sdk-availability.md)
* Review the [Availability SLAs](../high-availability.md#slas)
* Use the latest [.NET SDK](sdk-dotnet-v3.md)
* Use the latest [Java SDK](sdk-java-v4.md)
* Use the latest [Python SDK](sdk-python.md)
* Use the latest [Node SDK](sdk-nodejs.md)
