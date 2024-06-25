---
title: Durable Functions v3 - Azure Functions
description: Learn about Durable Functions v3.
author: naiyuantian
ms.topic: conceptual
ms.date: 06/24/2024
ms.author: azfuncdf
---

# Durable Functions v3

*Durable Functions* is an extension of [Azure Functions](../functions-overview.md) and [Azure WebJobs](../../app-service/webjobs-create.md) that lets you write stateful functions in a serverless environment. The extension manages state, checkpoints, and restarts for you. If you aren't already familiar with Durable Functions, see the [overview documentation](durable-functions-overview.md). This page introduces the new features and enhancements in Durable Functions v3.

## New features in 3.x

### New Azure Storage SDK

By default, Durable Functions use Azure Storage as storage backend to durably save application state. In Durable Functions v3, the Azure Storage backend has been upgraded to use the latest versions of the Azure Storage SDKs: Azure.Data.Tables, Azure.Storage.Blobs, and Azure.Storage.Queues. The new Azure Storage SDK offers better performance, more efficient data handling, and enhanced support for the latest storage features. 

### Improved Partition Management for the Azure Storage

In the [Azure Storage backend](./durable-functions-azure-storage-provider.md), the Partition Manager is responsible for distributing [partitions/control queues](./durable-functions-azure-storage-provider.md#control-queues) among workers. In Durable Functions v3, we default the new partition manager, called Partition Manager V3, which uses Azure Tables to manage partition assignments instead of Azure Blob leases. By leveraging Azure Tables, the new design significantly reduces storage costs. Additionally, this new implementation is easier to debug compared to previous versions, making it more efficient and user-friendly. As [a new Table](./durable-functions-azure-storage-provider.md#partitions-table), named "Partition", will be introduced to your storage account, allowing you to easily check the partition information.

### Improved Identity-Based Connection

Durable Functions v3 introduces a more robust implementation of identity-based connections, improving the security and reliability of your applications. For detailed guidance on how to use identity-based connections, refer to the instructions [here](./durable-functions-configure-durable-functions-with-credentials.md).

### Drop Functions Host v1 Support

Durable Functions v3 no longer supports Functions Host v1. If you require Functions Host v1, please use a Durable Functions extension version lower than v2.11.0.

## Migration from Durable Functions v2.x to v3.x

Migrating from Durable Functions v2.x to v3.x is designed to be straightforward and hassle-free. No code changes are required, making the transition smooth for existing applications. Simply update your dependencies to start taking advantage of the new features and improvements in v3.x.

- For .NET in-process users: update to Microsoft.Azure.WebJobs.Extensions.DurableTask version 3.0.0 or later.
- For .NET out-of-process users: update to Microsoft.Azure.Functions.Worker.Extensions.DurableTask version 1.2.0 or later.
- For users of other languages with extension bundles, you need to opt out of bundles to manually update to Microsoft.Azure.WebJobs.Extensions.DurableTask version 3.0.0 or later. Please follow the instructions [here](./durable-functions-extension-upgrade.md#upgrade-the-extension-bundle).

## Future Support and Maintenance

Durable Functions v2.x will continue to receive security updates and bug fixes, ensuring that your existing applications remain secure and stable. However, all new features and enhancements will be added exclusively to v3.x. We encourage users to upgrade to Durable Functions v3 to take advantage of the latest capabilities and ongoing improvements.
