---
title: Troubleshoot Azure Cosmos DB service unavailable exceptions
description: Learn how to diagnose and fix Azure Cosmos DB service unavailable exceptions.
author: rothja
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.date: 08/19/2022
ms.author: jroth
ms.topic: troubleshooting
ms.reviewer: mjbrown
---

# Diagnose and troubleshoot Azure Cosmos DB service unavailable exceptions
[!INCLUDE[appliesto-sql-api](../includes/appliesto-sql-api.md)]

The SDK wasn't able to connect to Azure Cosmos DB. This scenario can be transient or permanent depending on the network conditions.

It is important to make sure the application design is following our [guide for designing resilient applications with Azure Cosmos DB SDKs](conceptual-resilient-sdk-applications.md) to make sure it correctly reacts to different network conditions. Your application should have retries in place for service unavailable errors.

When evaluating the case for service unavailable errors:

* What is the impact measured in volume of operations affected compared to the operations succeeding? Is it within the service SLAs?
* Is the P99 latency affected?
* Are the failures affecting all your application instances or only a subset? When the issue is reduced to a subset of instances, it's commonly a problem related to those instances.

## Troubleshooting steps
The following list contains known causes and solutions for service unavailable exceptions.

### The required ports are being blocked
Verify that all the [required ports](sql-sdk-connection-modes.md#service-port-ranges) are enabled.

### Client-side transient connectivity issues
Service unavailable exceptions can surface when there are transient connectivity problems that are causing timeouts and can be safely retried following the [design recommendations](conceptual-resilient-sdk-applications.md#timeouts-and-connectivity-related-failures-http-408503).

Follow the [request timeout troubleshooting steps](troubleshoot-dot-net-sdk-request-timeout.md#troubleshooting-steps) to resolve it.

### Service outage
Check the [Azure status](https://azure.status.microsoft/status) to see if there's an ongoing issue.


## Next steps
* [Diagnose and troubleshoot](troubleshoot-dot-net-sdk.md) issues when you use the Azure Cosmos DB .NET SDK.
* [Diagnose and troubleshoot](troubleshoot-java-sdk-v4-sql.md) issues when you use the Azure Cosmos DB Java SDK.
* Learn about performance guidelines for [.NET](performance-tips-dotnet-sdk-v3-sql.md).
* Learn about performance guidelines for [Java](performance-tips-java-sdk-v4-sql.md).
