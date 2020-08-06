---
title: Troubleshoot Azure Cosmos DB request rate to large exception
description: How to diagnose and fix request rate to large exception
author: j82w
ms.service: cosmos-db
ms.date: 07/13/2020
ms.author: jawilley
ms.topic: troubleshooting
ms.reviewer: sngun
---

# Diagnose and troubleshoot Cosmos DB too many requests
'Request rate too large' or error code 429 indicates that your requests are being throttled.

## Troubleshooting steps
The following list contains known causes and solutions for too many requests.

### 1. Check the Metrics
The customer should check the [Azure Cosmos DB monitoring](monitor-cosmos-db.md) to check if the number 429 exceptions.

## Cause:
The consumed throughput (RU/s) has exceeded the [provisioned throughput](set-throughput.md). The SDK will automatically retry requests based on the specified retry policy. If you get this failure often, consider increasing the throughput on the collection. Check the portal's metrics to see if you are getting 429 errors. Review your partition key to ensure it results in an [even distribution of storage and request volume](partition-data.md).

## Solution:
1. Use the [portal or the SDK](set-throughput.md) to increase the provisioned throughput.
2. Switch the database or container to [Autoscale](provision-throughput-autoscale.md).

## Next steps
* [Diagnose and troubleshoot](troubleshoot-dot-net-sdk.md) issues when using Azure Cosmos DB .NET SDK
* Learn about performance guidelines for [.NET V3](performance-tips-dotnet-sdk-v3-sql.md) and [.NET V2](performance-tips.md)