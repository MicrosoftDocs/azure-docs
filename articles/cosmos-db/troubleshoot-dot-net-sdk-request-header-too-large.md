---
title: Troubleshoot request header too large or 400 bad request in Azure Cosmos DB 
description: How to diagnose and fix request header too large exception
author: j82w
ms.service: cosmos-db
ms.date: 07/13/2020
ms.author: jawilley
ms.topic: troubleshooting
ms.reviewer: sngun
---

# Diagnose and troubleshoot Azure Cosmos DB request header too large message
The request header too large message is thrown with an HTTP error code 400. This error occurs if the size of the request header has grown too large and is exceeding the maximum allowed size. We recommend you to use the latest version of the SDK. Make sure to use at least version 3.x or 2.x, because these versions add header size tracing to the exception message.

## Troubleshooting steps
The request header too large message occurs if the session or the continuation token is too large. The following sections describe the cause and solution to the issue in each category.

### 1. Session token too large

#### Cause:
400 bad request is most likely caused by the session token being to large. If the following statements are true then it confirms that the session token is too large.

* The error occurs on point operation like create, read, update, and etc. where there is not a continuation token.
* The exception started without making any changes to the application. The session token grows as the number of partitions increase in the container. The numbers of partition increase as the amount of data increase or if the throughput is increased.

#### Temporary mitigation: 
Restart your client application to reset all the session tokens. The session token will eventually grow back to the previous size that caused the issue. So use the solution in the next section to avoid this issue completely.

#### Solution:
1. Follow the guidance in [.NET V3](performance-tips-dotnet-sdk-v3-sql.md) or [.NET V2](performance-tips.md) performance tips article and convert the application to use direct connection mode with TCP protocol. Direct mode with TCP protocol does not have the header size restriction like the HTTP protocol, so it avoids this issue. Make sure to use the latest version of SDK, which has a fix for query operations when the service interop is not available.
2. If Direct connection mode with TCP protocol is not an option for your workload, mitigate it by changing the [client consistency level](how-to-manage-consistency.md). The session token is only used for session consistency, which is the default consistency level for Azure Cosmos DB. Other consistency levels don't not use the session token.

### 2. Continuation token too large

#### Cause:
The 400 bad request is happening on query operations where the continuation token is used. If the continuation token has grown too large or if different queries have different continuation token sizes.
    
#### Solution:
1. Follow the guidance in [.NET V3](performance-tips-dotnet-sdk-v3-sql.md) or [.NET V2](performance-tips.md) performance tips article and convert the application to use direct connection mode with TCP protocol. Direct mode with TCP protocol does not have the header size restriction like the HTTP protocol, so it avoids this issue. 
3. If Direct connection mode with TCP protocol is not an option for your workload, then try setting the `ResponseContinuationTokenLimitInKb` option. You can find this option in the `FeedOptions` for v2 or the `QueryRequestOptions` in v3.

## Next steps
* [Diagnose and troubleshoot](troubleshoot-dot-net-sdk.md) issues when using Azure Cosmos DB .NET SDK
* Learn about performance guidelines for [.NET V3](performance-tips-dotnet-sdk-v3-sql.md) and [.NET V2](performance-tips.md)
