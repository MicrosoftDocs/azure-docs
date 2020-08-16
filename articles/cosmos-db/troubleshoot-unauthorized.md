---
title: Troubleshoot Azure Cosmos DB unauthorized exception
description: How to diagnose and fix unauthorized exception
author: j82w
ms.service: cosmos-db
ms.date: 07/13/2020
ms.author: jawilley
ms.topic: troubleshooting
ms.reviewer: sngun
---

# Diagnose and troubleshoot Azure Cosmos DB unauthorized exception

HTTP 401: The MAC signature found in the HTTP request is not the same as the computed signature.
If you received the following 401 error message: "The MAC signature found in the HTTP request is not the same as the computed signature." it can be caused by the following scenarios.

Older SDKs the exception can appear as an invalid json exception instead of the correct 401 unauthorized exception. Newer SDKs properly handle this scenario and give a valid error message.

## Troubleshooting steps
The following list contains known causes and solutions for unauthorized exception.

### 1. Key was not properly rotated is the most common scenario.
401 MAC signature is seen shortly after a key rotation and eventually stops without any changes. 

#### Solution:
The key was rotated and did not follow the [best practices](secure-access-to-data.md#key-rotation). The Cosmos DB account key rotation can take anywhere from a few seconds to possibly days depending on the Cosmos DB account size.

### 2. The key is misconfigured 
401 MAC signature issue will be consistent and happens for all calls using that key

#### Solution:
The key is misconfigured on the application, and is using the wrong key for the account or entire key was not copied.

### 3. The application is using the read-only keys for write operations
401 MAC signature issue is only occurring for write operations like create or replace, but read request succeed.

#### Solution:
Switch the application to use a read/write key to allow the operations to complete successfully.

### 4. Race condition with create container
401 MAC signature issue is seen shortly after a container creation. This only occurs until the container creation is completed.

#### Solution:
There is a race condition with container creation. An application instance is trying to access the container before container creation is complete. The most common scenario for this race condition is if the application is running, and the container is deleted and recreated with the same name. The SDK will attempt to use the new container, but the container creation is still in progress so it does not have the keys.

## Next steps
* [Diagnose and troubleshoot](troubleshoot-dot-net-sdk.md) issues when using Azure Cosmos DB .NET SDK
* Learn about performance guidelines for [.NET V3](performance-tips-dotnet-sdk-v3-sql.md) and [.NET V2](performance-tips.md)