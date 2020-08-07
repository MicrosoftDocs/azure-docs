---
title: Troubleshoot Azure Cosmos DB service unavailable exception
description: How to diagnose and fix Cosmos DB service unavailable exception
author: j82w
ms.service: cosmos-db
ms.date: 08/06/2020
ms.author: jawilley
ms.topic: troubleshooting
ms.reviewer: sngun
---

# Diagnose and troubleshoot Azure Cosmos DB service unavailable
The SDK was not able to connect to the Azure Cosmos DB service.

## Troubleshooting steps
The following list contains known causes and solutions for service unavailable exceptions.

### 1. The required ports are being blocked
Verify that all the [required ports](performance-tips-dotnet-sdk-v3-sql.md#networking) are enabled.

### 2. Client-side transient connectivity issues
Service unavailable exceptions surface can surface when there are transient connectivity problems that are causing timeouts. Commonly the stack trace related to this scenario will contain a `TransportException`, for example:

```C#
TransportException: A client transport error occurred: The request timed out while waiting for a server response. 
(Time: xxx, activity ID: xxx, error code: ReceiveTimeout [0x0010], base error: HRESULT 0x80131500
```

Follow the [request timeout troubleshooting](troubleshoot-dot-net-sdk-request-timeout.md#troubleshooting-steps) to resolve it.

### 3. Service outage
Check the [Azure Status](https://status.azure.com/status) to see if there is an ongoing issue.


## Next steps
* [Diagnose and troubleshoot](troubleshoot-dot-net-sdk.md) issues when using Azure Cosmos DB .NET SDK
* Learn about performance guidelines for [.NET V3](performance-tips-dotnet-sdk-v3-sql.md) and [.NET V2](performance-tips.md)