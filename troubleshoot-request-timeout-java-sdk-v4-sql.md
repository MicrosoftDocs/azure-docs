---
title: Troubleshoot Azure Cosmos DB HTTP 408 or request timeout issues with the Java v4 SDK
description: Learn how to diagnose and fix Java SDK request timeout exceptions.
author: kushagrathapar
ms.service: cosmos-db
ms.date: 10/28/2020
ms.author: kuthapar
ms.topic: troubleshooting
ms.reviewer: sngun
---

# Diagnose and troubleshoot Azure Cosmos DB Java v4 SDK request timeout exceptions
The HTTP 408 error occurs if the SDK was unable to complete the request before the timeout limit occurred.

## Troubleshooting steps
The following list contains known causes and solutions for request timeout exceptions.

### High CPU utilization
High CPU utilization is the most common case. For optimal latency, CPU usage should be roughly 40 percent. Use 10 seconds as the interval to monitor maximum (not average) CPU utilization. CPU spikes are more common with cross-partition queries where it might do multiple connections for a single query.

#### Solution:
The client application that uses the SDK should be scaled up or out.

### Socket or port availability might be low
When running in Azure, clients using the Java SDK can hit Azure SNAT (PAT) port exhaustion.

#### Solution 1:
If you're running on Azure VMs, follow the [SNAT port exhaustion guide](troubleshoot-java-sdk-v4-sql.md#snat).

#### Solution 2:
If you're running on Azure App Service, follow the [connection errors troubleshooting guide](../app-service/troubleshoot-intermittent-outbound-connection-errors.md#cause) and [use App Service diagnostics](https://azure.github.io/AppService/2018/03/01/Deep-Dive-into-TCP-Connections-in-App-Service-Diagnostics.html).

#### Solution 3:
If you're running on Azure Functions, verify you're following the [Azure Functions recommendation](../azure-functions/manage-connections.md#static-clients) of maintaining singleton or static clients for all of the involved services (including Azure Cosmos DB). Check the [service limits](../azure-functions/functions-scale.md#service-limits) based on the type and size of your Function App hosting.

#### Solution 4:
If you use an HTTP proxy, make sure it can support the number of connections configured in the SDK `GatewayConnectionConfig`. Otherwise, you'll face connection issues.

### Create multiple client instances
Creating multiple client instances might lead to connection contention and timeout issues.

#### Solution:
Follow the [performance tips](performance-tips-java-sdk-v4-sql.md#sdk-usage), and use a single CosmosClient instance across an entire process.

### Hot partition key
Azure Cosmos DB distributes the overall provisioned throughput evenly across physical partitions. When there's a hot partition, one or more logical partition keys on a physical partition are consuming all the physical partition's Request Units per second (RU/s). At the same time, the RU/s on other physical partitions are going unused. As a symptom, the total RU/s consumed will be less than the overall provisioned RU/s at the database or container, but you'll still see throttling (429s) on the requests against the hot logical partition key. Use the [Normalized RU Consumption metric](monitor-normalized-request-units.md) to see if the workload is encountering a hot partition. 

#### Solution:
Choose a good partition key that evenly distributes request volume and storage. Learn how to [change your partition key](https://devblogs.microsoft.com/cosmosdb/how-to-change-your-partition-key/).

### High degree of concurrency
The application is doing a high level of concurrency, which can lead to contention on the channel.

#### Solution:
The client application that uses the SDK should be scaled up or out.

### Large requests or responses
Large requests or responses can lead to head-of-line blocking on the channel and exacerbate contention, even with a relatively low degree of concurrency.

#### Solution:
The client application that uses the SDK should be scaled up or out.

### Failure rate is within the Azure Cosmos DB SLA
The application should be able to handle transient failures and retry when necessary. Any 408 exceptions aren't retried because on create paths it's impossible to know if the service created the item or not. Sending the same item again for create will cause a conflict exception. User applications business logic might have custom logic to handle conflicts, which would break from the ambiguity of an existing item versus conflict from a create retry.

### Failure rate violates the Azure Cosmos DB SLA
Contact [Azure Support](https://aka.ms/azure-support).

## Next steps
* [Diagnose and troubleshoot](troubleshoot-java-sdk-v4-sql.md) issues when you use the Azure Cosmos DB Java v4 SDK.
* Learn about performance guidelines for [Java v4](performance-tips-java-sdk-v4-sql.md).