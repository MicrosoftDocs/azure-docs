---
title: Troubleshoot request header too large
description: How to diagnose and fix request header too large exception
author: j82w
ms.service: cosmos-db
ms.date: 07/13/2020
ms.author: jawilley
ms.topic: troubleshooting
ms.reviewer: sngun
---

# Diagnose and troubleshoot Cosmos DB 400 bad request with mesage "request header too large"

## Description
The request header too large message is thrown with an HTTP error code 400. This error occurs if the size of the request header has grown too large and is exceeding the maximum allowed size. We recommend you to use the latest version of the SDK. Make sure to use at least version 3.x or 2.x, because these versions add header size tracing to the exception message.

## Troubleshooting steps

### 1. Session Token too large

#### Cause:
The 400 bad request is happening on point operations where the continuation token is not being used. The exception started without making any changes to the application. The session token grows as the number of partitions increase in the container. The numbers of partition increase as the amount of data increase or if the throughput is increased.

#### Temporary mitigation: 
Restart your client application to reset all the session tokens. The session token will eventually grow back to the previous size that caused the issue. So use the solution in the next section to avoid this issue completely.

#### Solution:
1. Follow the guidance in [performance tips](performance-tips-dotnet-sdk-v3-sql.md) article and convert the application to use direct connection mode with TCP protocol. Direct mode with TCP protocol does not have the header size restriction like the HTTP protocol, so it avoids this issue. Make sure to use the latest version of SDK, which has a fix for query operations when the service interop is not available.
2. If Direct + TCP is not an option then mitigation can be done by changing the [client consistency level](how-to-manage-consistency.md). The session token is only used for session consistency, which is the default for Cosmos DB. Any other consistency level will not use the session token.

### 2. Continuation token too large

#### Cause:
The 400 bad request is happening on query operations where the continuation token is being passed in. The continuation token has grown too large. Different queries will have different continuation token sizes.
    
#### Solution:
1. Follow the performance tips and convert the application to Direct + TCP connection mode. Direct + TCP does not have the header size restriction like HTTP does which avoids this issue.
3. If Direct + TCP is not an option then try setting the ResponseContinuationTokenLimitInKb option. The option can be found in the FeedOptions for v2 or the QueryRequestOptions in v3.
