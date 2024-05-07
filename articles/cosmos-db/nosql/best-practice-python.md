---
title: Best practices for Python SDK
titleSuffix: Azure Cosmos DB
description: Review a list of best practices for using the Azure Cosmos DB Python SDK in a performant manner.
author: kushagraThapar
ms.author: kuthapar
ms.service: cosmos-db
ms.subservice: nosql
ms.custom: devx-track-python
ms.topic: best-practice
ms.date: 04/08/2024
---

# Best practices for Python SDK in Azure Cosmos DB for NoSQL

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

This guide includes best practices for solutions built using the latest version of the Python SDK for Azure Cosmos DB for NoSQL. The best practices included here helps improve latency, improve availability, and boost overall performance for your solutions.

## Account configuration

- Make sure to run your application in the same [Azure region](../distribute-data-globally.md) as your Azure Cosmos DB account, whenever possible to reduce latency. Enable replication in 2+ regions in your accounts for [best availability](../distribute-data-globally.md). For production workloads, enable [service-managed failover](../how-to-manage-database-account.yml). In the absence of this configuration, the account experiences loss of write availability for all the duration of the write region outage, as manual failover can't succeed due to lack of region connectivity. For more information on how to add multiple regions using the Python SDK, see the [global distribution tutorial](tutorial-global-distribution.md).

## SDK usage

- Always use the [latest version](sdk-python.md) of the Azure Cosmos DB SDK available for optimal performance.
- Use a single instance of `CosmosClient` for the lifetime of your application for better performance.
- Set the `preferred_locations` configuration on the [cosmos client](https://azuresdkdocs.blob.core.windows.net/$web/python/azure-cosmos/latest/azure.cosmos.html#azure.cosmos.CosmosClient). During failovers, write operations are sent to the current write region and all reads are sent to the first region within your preferred locations list. For more information about regional failover mechanics, see [availability troubleshooting](troubleshoot-sdk-availability.md).
- A transient error is an error that has an underlying cause that soon resolves itself. Applications that connect to your database should be built to expect these transient errors. To handle them, implement retry logic in your code instead of surfacing them to users as application errors. The SDK has built-in logic to handle these transient failures on retryable requests like read or query operations. The SDK can't retry on writes for transient failures as writes aren't idempotent. The SDK does allow users to configure retry logic for throttles. For details on which errors to retry on [visit here](conceptual-resilient-sdk-applications.md#should-my-application-retry-on-errors).
- Use SDK logging to [capture diagnostic information](troubleshoot-python-sdk.md#logging-and-capturing-the-diagnostics) and troubleshoot latency issues.

## Data design

- The request charge of a specified operation correlates directly to the size of the document. We recommend reducing the size of your documents as operations on large documents cost more than operations on smaller documents.
- Some characters are restricted and can't be used in some identifiers: '/', '\\', '?', '#'. The general recommendation is to not use any special characters in identifiers like database name, collection name, item ID, or partition key to avoid any unexpected behavior.
- The Azure Cosmos DB indexing policy also allows you to specify which document paths to include or exclude from indexing by using indexing paths. Ensure that you exclude unused paths from indexing for faster writes. For more information, see [creating indexes using the SDK sample](performance-tips-python-sdk.md#indexing-policy).

## Host characteristics

- You may run into connectivity/availability issues due to lack of resources on your client machine. Monitor your CPU utilization on nodes running the Azure Cosmos DB client, and scale up/out if usage is high.
- If using a virtual machine to run your application, enable [Accelerated Networking](../../virtual-network/create-vm-accelerated-networking-powershell.md) on your VM to help with bottlenecks due to high traffic and reduce latency or CPU jitter. You might also want to consider using a higher end Virtual Machine where the max CPU usage is under 70%.
- By default, query results are returned in chunks of 100 items or 4 MB, whichever limit is hit first. If a query returns more than 100 items, increase the page size to reduce the number of round trips required. Memory consumption increases as page size increases.


## Next steps
To learn more about performance tips for Python SDK, see [Performance tips for Azure Cosmos DB Python SDK](performance-tips-python-sdk.md).

To learn more about designing your application for scale and high performance, see [Partitioning and scaling in Azure Cosmos DB](../partitioning-overview.md).

Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
* If all you know is the number of vCores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md) 
* If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md)
