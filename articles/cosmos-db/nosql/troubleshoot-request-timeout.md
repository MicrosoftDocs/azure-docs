---
title: Troubleshoot Azure Cosmos DB service request timeout exceptions
description: Learn how to diagnose and fix Azure Cosmos DB service request timeout exceptions.
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.date: 07/13/2020
ms.author: sidandrews
ms.topic: troubleshooting
ms.reviewer: mjbrown
---

# Diagnose and troubleshoot Azure Cosmos DB request timeout exceptions
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

Azure Cosmos DB returned an HTTP 408 request timeout.

## Troubleshooting steps
The following list contains known causes and solutions for request timeout exceptions.

### Check the SLA
Check [Azure Cosmos DB monitoring](../monitor.md) to see if the number of 408 exceptions violates the Azure Cosmos DB SLA.

#### Solution 1: It didn't violate the Azure Cosmos DB SLA
The application should handle this scenario and retry on these transient failures.

#### Solution 2: It did violate the Azure Cosmos DB SLA
Contact [Azure Support](https://aka.ms/azure-support).
 
### Hot partition key
Azure Cosmos DB distributes the overall provisioned throughput evenly across physical partitions. When there's a hot partition, one or more logical partition keys on a physical partition are consuming all the physical partition's Request Units per second (RU/s). At the same time, the RU/s on other physical partitions are going unused. As a symptom, the total RU/s consumed will be less than the overall provisioned RU/s at the database or container. You'll still see throttling (429s) on the requests against the hot logical partition key. Use the [Normalized RU Consumption metric](../monitor-normalized-request-units.md) to see if the workload is encountering a hot partition. 

#### Solution:
Choose a good partition key that evenly distributes request volume and storage. Learn how to [change your partition key](https://devblogs.microsoft.com/cosmosdb/how-to-change-your-partition-key/).

## Next steps
* [Diagnose and troubleshoot](troubleshoot-dotnet-sdk.md) issues when you use the Azure Cosmos DB .NET SDK.
* Learn about performance guidelines for [.NET v3](performance-tips-dotnet-sdk-v3.md) and [.NET v2](performance-tips.md).
* [Diagnose and troubleshoot](troubleshoot-java-sdk-v4.md) issues when you use the Azure Cosmos DB Java v4 SDK.
* Learn about performance guidelines for [Java v4 SDK](performance-tips-java-sdk-v4.md).