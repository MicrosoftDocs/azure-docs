---
title: Troubleshoot Azure Cosmos DB request rate too large exceptions
description: Learn how to diagnose and fix request rate too large exceptions.
author: j82w
ms.service: cosmos-db
ms.date: 07/13/2020
ms.author: jawilley
ms.topic: troubleshooting
ms.reviewer: sngun
---

# Diagnose and troubleshoot Azure Cosmos DB request rate too large exceptions
[!INCLUDE[appliesto-sql-api](includes/appliesto-sql-api.md)]

A "Request rate too large" message or error code 429 indicates that your requests are being throttled.

## Troubleshooting steps
The following section contains known causes and solutions for too many requests.

### Check the metrics
Check [Azure Cosmos DB monitoring](monitor-cosmos-db.md) to see the number of 429 exceptions.

#### Cause:
The consumed throughput (Request Units per second) has exceeded the [provisioned throughput](set-throughput.md). The SDK automatically retries requests based on the specified retry policy. If you get this failure often, consider increasing the throughput on the collection. Check the portal's metrics to see if you're getting 429 errors. Review your partition key to ensure it results in an [even distribution of storage and request volume](partitioning-overview.md).

#### Solution:
1. Use the [portal or the SDK](set-throughput.md) to increase the provisioned throughput.
1. Switch the database or container to [Autoscale](provision-throughput-autoscale.md).

## Next steps
* [Diagnose and troubleshoot](troubleshoot-dot-net-sdk.md) issues when you use the Azure Cosmos DB .NET SDK.
* Learn about performance guidelines for [.NET v3](performance-tips-dotnet-sdk-v3-sql.md) and [.NET v2](performance-tips.md).
* Learn about performance guidelines for [Java v4 SDK](performance-tips-java-sdk-v4-sql.md).