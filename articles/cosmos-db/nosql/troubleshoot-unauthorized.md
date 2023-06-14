---
title: Troubleshoot Azure Cosmos DB unauthorized exceptions
description: Learn how to diagnose and fix unauthorized exceptions.
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.date: 07/13/2020
ms.author: sidandrews
ms.topic: troubleshooting
ms.reviewer: mjbrown
---

# Diagnose and troubleshoot Azure Cosmos DB unauthorized exceptions
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

HTTP 401: The MAC signature found in the HTTP request isn't the same as the computed signature.
If you received the 401 error message "The MAC signature found in the HTTP request is not the same as the computed signature", it can be caused by the following scenarios.

For older SDKs, the exception can appear as an invalid JSON exception instead of the correct 401 unauthorized exception. Newer SDKs properly handle this scenario and give a valid error message.

## Troubleshooting steps
The following list contains known causes and solutions for unauthorized exceptions.

### The key wasn't properly rotated is the most common scenario
The 401 MAC signature is seen shortly after a key rotation and eventually stops without any changes. 

#### Solution:
The key was rotated and didn't follow the [best practices](../secure-access-to-data.md#key-rotation). The Azure Cosmos DB account key rotation can take anywhere from a few seconds to possibly days depending on the Azure Cosmos DB account size.

### The key is misconfigured 
The 401 MAC signature issue will be consistent and happens for all calls using that key.

#### Solution:
The key is misconfigured on the application and is using the wrong key for the account, or the entire key wasn't copied.

### The application is using the read-only keys for write operations
The 401 MAC signature issue only occurs for write operations like create or replace, but read requests succeed.

#### Solution:
Switch the application to use a read/write key to allow the operations to complete successfully.

### Race condition with create container
The 401 MAC signature issue is seen shortly after a container creation. This issue occurs only until the container creation is completed.

#### Solution:
There's a race condition with container creation. An application instance is trying to access the container before the container creation is complete. The most common scenario for this race condition is if the application is running and the container is deleted and re-created with the same name. The SDK attempts to use the new container, but the container creation is still in progress so it doesn't have the keys.

### Bulk mode enabled 
When using [Bulk mode enabled](https://devblogs.microsoft.com/cosmosdb/introducing-bulk-support-in-the-net-sdk/), read and write operations are optimized for best network performance and sent to the backend through a dedicated Bulk API. 401 errors while performing read operations with Bulk mode enabled often mean that the application is using the [read-only keys](../secure-access-to-data.md#primary-keys).

#### Solution
Use the read/write keys or authorization mechanism with write access when performing operations with Bulk mode enabled.

## Next steps
* [Diagnose and troubleshoot](troubleshoot-dotnet-sdk.md) issues when you use the Azure Cosmos DB .NET SDK.
* Learn about performance guidelines for [.NET v3](performance-tips-dotnet-sdk-v3.md) and [.NET v2](performance-tips.md).
* [Diagnose and troubleshoot](troubleshoot-java-sdk-v4.md) issues when you use the Azure Cosmos DB Java v4 SDK.
* Learn about performance guidelines for [Java v4 SDK](performance-tips-java-sdk-v4.md).