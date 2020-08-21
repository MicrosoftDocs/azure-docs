---
title: Troubleshoot Azure Cosmos DB service request timeout exception
description: How to diagnose and fix Cosmos DB service request timeout exception
author: j82w
ms.service: cosmos-db
ms.date: 07/13/2020
ms.author: jawilley
ms.topic: troubleshooting
ms.reviewer: sngun
---

# Diagnose and troubleshoot Azure Cosmos DB request timeout
Azure Cosmos DB returned a HTTP 408 request timeout

## Troubleshooting steps
The following list contains known causes and solutions for request timeout exceptions.

### 1. Check the SLA
The customer should check the [Azure Cosmos DB monitoring](monitor-cosmos-db.md) to check if the number 408 exceptions violates the Cosmos DB SLA.

#### Solution 1: It did not violate the Cosmos DB SLA
The application should handle this scenario and retry on these transient failures.

#### Solution 2: It did violate the Cosmos DB SLA
Contact Azure Support: https://aka.ms/azure-support
 
### 2. Hot partition key
Azure Cosmos DB distributes the overall provisioned throughput evenly across physical partitions. When there is a hot partition, one or more logical partition keys on a physical partition are consuming all the physical partition's RU/s, while the RU/s on other physical partitions go unused. As a symptom, the total RU/s consumed will be less than the overall provisioned RU/s at the database or container, but you will still see throttling (429s) on the requests against the hot logical partition key. Use the [Normalized RU Consumption metric](monitor-normalized-request-units.md) to see if the workload is encountering a hot partition. 

#### Solution:
Choose a good partition key that evenly distributes request volume and storage. Learn how to [change your partition key](https://devblogs.microsoft.com/cosmosdb/how-to-change-your-partition-key/).

## Next steps
* [Diagnose and troubleshoot](troubleshoot-dot-net-sdk.md) issues when using Azure Cosmos DB .NET SDK
* Learn about performance guidelines for [.NET V3](performance-tips-dotnet-sdk-v3-sql.md) and [.NET V2](performance-tips.md)