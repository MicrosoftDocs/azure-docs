---
title: Troubleshoot .NET SDK request timeout exception
description: How to diagnose and fix .NET SDK request timeout exception
author: j82w
ms.service: cosmos-db
ms.date: 07/13/2020
ms.author: jawilley
ms.topic: troubleshooting
ms.reviewer: sngun
---

# Diagnose and troubleshoot Cosmos DB request timeout

| Http Status Code | Name | Category |
|---|---|---|
|408|CosmosDotNetRequestTimeout|Service|

## Issue

The SDK was not able to connect to the Azure Cosmos DB service.

## Troubleshooting steps
These are the known causes for this issue.

### 1. High CPU utilization (most common case)
For optimal latency it is recommended that CPU usage should be roughly 40%. It is recommended to look at CPU utilization at 10 second intervals. If the interval is larger then CPU spikes can be missed by getting averaged in with lower values. This is more common with cross partition queries where it might do multiple connections for a single request.

#### Solution:
The application should be scaled up/out.

### 2. Socket / Port availability might be low
When running in Azure, clients using the .NET SDK can hit Azure SNAT (PAT) port exhaustion.

#### Solution 1:
Follow the CosmosSNATPortExhuastion guide.

#### Solution 2:
If you use an HTTP proxy, make sure it can support the number of connections configured in the SDK `ConnectionPolicy`.
Otherwise, you face connection issues.

### 3. Creating multiple Client instances
This might lead to connection contention and timeout issues.

#### Solution:
Follow the [performance tips](https://docs.microsoft.com/azure/cosmos-db/performance-tips), and use a single CosmosClient instance across an entire process.

### 4. Hot partition key
Azure Cosmos DB distributes the overall provisioned throughput evenly across physical partitions. One partition is having all of it's resources consumed while other partitions go unused. Check portal metrics to see if the workload is encountering a hot [partition key](https://docs.microsoft.com/azure/cosmos-db/partition-data). This will cause the aggregate consumed throughput (RU/s) to be appear to be under the provisioned RUs, but a single partition consumed throughput (RU/s) will exceed the provisioned throughput

#### Solution:
The partition key should be changed to avoid the heavily used value.

### 5. High degree of concurrency
The application is doing a high level of conccurrency which can lead to contention on the channel

#### Solution:
Try to scale the application up/out.

### 6. Large requests and/or responses
Large requests or responses can lead to head-of-line blocking on the channel and exacerbate contention, even with a relatively low degree of concurrency.

#### Solution:
Try to scale the application up/out.

### 7. Failure rate is within Cosmos DB SLA
The application should be able to handle transient failures and retry when necessary. 408 excpetions are not retried because on create paths its not possible to know if the service created the item or if it did not. Sending the same item again for create will cause a conflict exception. User applications business logic might have custom logic to handle conflicts which would break from the ambiguity of an existing item vs conflict from a create retry.

### 8. Failure rate is violating the Cosmos DB SLA
Please contact Azure support.