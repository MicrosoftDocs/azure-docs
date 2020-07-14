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

# Diagnose and troubleshoot Cosmos DB request header too large exception

| Http Status Code | Name | Category |
|---|---|---|
|400|CosmosRequestHeaderTooLarge|Service|

## Description
The size of the header has grown to large and is exceeding the maximum allowed size. It's always recommended to use the latest SDK. Make sure to use at least version 3.x or 2.x, which adds header size tracing to the exception message.

## Troubleshooting steps

### 1. Session Token too large

#### Cause:
The 400 bad request is happening on point operations where the continuation token is not being used. The exception started without making any changes to the application. The session token grows as the number of partitions increase in the container. The numbers of partition increase as the amount of data increase or if the throughput is increased.

#### Temporary mitigation: 
Restart the application will reset all the session tokens. This session token will eventually grow back to the previous size that causes the issue.

#### Solution:
1. Follow the performance tips and convert the application to Direct + TCP connection mode. Direct + TCP does not have the header size restriction like HTTP does which avoids this issue. Make sure to use the latest SDK version, which has a fix for query operations when the service interop is not available.
2. If Direct + TCP is not an option then mitigation can be done by changing the client consistency level. The session token is only used for session consistency, which is the default for Cosmos DB. Any other consistency level will not use the session token.

### 2. Continuation token too large

#### Cause:
The 400 bad request is happening on query operations where the continuation token is being passed in. The continuation token has grown to large. Different queries will have different continuation token sizes.
    
#### Solution:
1. Follow the performance tips and convert the application to Direct + TCP connection mode. Direct + TCP does not have the header size restriction like HTTP does which avoids this issue.
3. If Direct + TCP is not an option then try setting the ResponseContinuationTokenLimitInKb option. The option can be found in the FeedOptions for v2 or the QueryRequestOptions in v3.