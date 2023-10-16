---
title: Troubleshoot "request header too large" or "bad request"
titleSuffix: Azure Cosmos DB
description: Learn how to diagnose and fix either the HTTP request header too large or bad request (400) exceptions.
author: seesharprun
ms.author: sidandrews
ms.reviewer: mjbrown
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: troubleshooting
ms.date: 02/27/2023
ms.custom: devx-track-dotnet, ignite-2022
---

# Diagnose and troubleshoot "request header too large" or "bad request" messages in Azure Cosmos DB SDK for .NET

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

The "Request header too large" message is thrown with an HTTP error code 400. This error occurs if the size of the request header has grown so large that it exceeds the maximum-allowed size. We recommend that you use the latest version of the Azure Cosmos DB SDK for .NET. We recommend that you use version 3.x because this major version adds header size tracing to the exception message.

## Troubleshooting steps

The "Request header too large" message occurs if the session or the continuation token is too large. The following sections describe the cause of the issue and its solution in each category.

### Session token is too large

This section reviews scenarios where the session token is too large.

#### Cause

A 400 bad request most likely occurs because the session token is too large. If the following statements are true, the session token is too large:

* The error occurs on point operations like create, read, and update where there isn't a continuation token.
* The exception started without making any changes to the application. The session token grows as the number of partitions increases in the container. The number of partitions increases as the amount of data increases or if the throughput is increased.

#### Temporary mitigation

Restart your client application to reset all the session tokens. Eventually, the session token grows back to the previous size that caused the issue. To avoid this issue completely, use the solution in the next section.

#### Solution

> [!IMPORTANT]
> Upgrade to at least .NET [v3.20.1](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/changelog.md) or [v2.16.1](https://github.com/Azure/azure-cosmos-dotnet-v2/blob/master/changelog.md). These minor versions contain optimizations to reduce the session token size to prevent the header from growing and hitting the size limit.

1. Follow the guidance in the [.NET v3](performance-tips-dotnet-sdk-v3.md) or [.NET v2](performance-tips.md) performance tips articles. Convert the application to use the direct connection mode with the Transmission Control Protocol (TCP). The direct connection mode with the TCP protocol doesn't have the header size restriction like the HTTP protocol, so it avoids this issue. Make sure to use the latest version of the SDK, which has a fix for query operations when the service interop isn't available.
1. If the direct connection mode with the TCP protocol isn't an option for your workload, mitigate it by changing the [client consistency level](how-to-manage-consistency.md). The session token is only used for session consistency, which is the default consistency level for Azure Cosmos DB. Other consistency levels don't use the session token.

### Continuation token is too large

This section reviews scenarios where the continuation token is too large.

#### Cause

The 400 bad request occurs on query operations where the continuation token is used if the token has grown too large. This error can also occur if different queries have different continuation token sizes.

#### Solution

1. Follow the guidance in the [.NET v3](performance-tips-dotnet-sdk-v3.md) or [.NET v2](performance-tips.md) performance tips articles. Convert the application to use the direct connection mode with the TCP protocol. The direct connection mode with the TCP protocol doesn't have the header size restriction like the HTTP protocol, so it avoids this issue.
1. If the direct connection mode with the TCP protocol isn't an option for your workload, set the `ResponseContinuationTokenLimitInKb` option. You can find this option in `FeedOptions` in v2 or `QueryRequestOptions` in v3.

## Next steps

* [Diagnose and troubleshoot](troubleshoot-dotnet-sdk.md) issues when you use the Azure Cosmos DB .NET SDK.
* Learn about performance guidelines for [.NET v3](performance-tips-dotnet-sdk-v3.md) and [.NET v2](performance-tips.md).
