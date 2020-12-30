---
title: Troubleshoot Azure Cosmos DB service unavailable exceptions
description: Learn how to diagnose and fix Azure Cosmos DB service unavailable exceptions.
author: j82w
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.date: 08/06/2020
ms.author: jawilley
ms.topic: troubleshooting
ms.reviewer: sngun
---

# Diagnose and troubleshoot Azure Cosmos DB service unavailable exceptions
[!INCLUDE[appliesto-sql-api](includes/appliesto-sql-api.md)]

The SDK wasn't able to connect to Azure Cosmos DB.

## Troubleshooting steps
The following list contains known causes and solutions for service unavailable exceptions.

### The required ports are being blocked
Verify that all the [required ports](sql-sdk-connection-modes.md#service-port-ranges) are enabled.

### Client-side transient connectivity issues
Service unavailable exceptions can surface when there are transient connectivity problems that are causing timeouts. Typically, the stack trace related to this scenario will contain a `TransportException` error. For example:

```C#
TransportException: A client transport error occurred: The request timed out while waiting for a server response. 
(Time: xxx, activity ID: xxx, error code: ReceiveTimeout [0x0010], base error: HRESULT 0x80131500
```

Follow the [request timeout troubleshooting steps](troubleshoot-dot-net-sdk-request-timeout.md#troubleshooting-steps) to resolve it.

### Service outage
Check the [Azure status](https://status.azure.com/status) to see if there's an ongoing issue.


## Next steps
* [Diagnose and troubleshoot](troubleshoot-dot-net-sdk.md) issues when you use the Azure Cosmos DB .NET SDK.
* Learn about performance guidelines for [.NET v3](performance-tips-dotnet-sdk-v3-sql.md) and [.NET v2](performance-tips.md).