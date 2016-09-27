<properties
   pageTitle="Azure Storage Scalability and Performance Targets | Microsoft Azure"
   description="Learn about the scalability and performance targets for Azure Storage, including capacity, request rate, and inbound and outbound bandwidth for both standard and premium storage accounts. Understand performance targets for partitions within each of the Azure Storage services."
   services="storage"
   documentationCenter="na"
   authors="robinsh"
   manager="carmonm"
   editor="tysonn" />
<tags
   ms.service="storage"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="storage"
   ms.date="08/03/2016"
   ms.author="robinsh" />

# Azure Storage Scalability and Performance Targets

## Overview

This topic describes the scalability and performance topics for Microsoft Azure Storage. For a summary of other Azure limits, see [Azure Subscription and Service Limits, Quotas, and Constraints](../azure-subscription-service-limits.md).

>[AZURE.NOTE] All storage accounts run on the new flat network topology and support the scalability and performance targets outlined below, regardless of when they were created. For more information on the Azure Storage flat network architecture and on scalability, see [Microsoft Azure Storage: A Highly Available Cloud Storage Service with Strong Consistency](http://blogs.msdn.com/b/windowsazurestorage/archive/2011/11/20/windows-azure-storage-a-highly-available-cloud-storage-service-with-strong-consistency.aspx).

>[AZURE.IMPORTANT] The scalability and performance targets listed here are high-end targets, but are achievable. In all cases, the request rate and bandwidth achieved by your storage account depends upon the size of objects stored, the access patterns utilized, and the type of workload your application performs. Be sure to test your service to determine whether its performance meets your requirements. If possible, avoid sudden spikes in the rate of traffic and ensure that traffic is well-distributed across partitions.

>When your application reaches the limit of what a partition can handle for your workload, Azure Storage will begin to return error code 503 (Server Busy) or error code 500 (Operation Timeout) responses. When this occurs, the application should use an exponential backoff policy for retries. The exponential backoff allows the load on the partition to decrease, and to ease out spikes in traffic to that partition.

If the needs of your application exceed the scalability targets of a single storage account, you can build your application to use multiple storage accounts, and partition your data objects across those storage accounts. See [Azure Storage Pricing](https://azure.microsoft.com/pricing/details/storage/) for information on volume pricing.


## Scalability targets for blobs, queues, tables, and files

[AZURE.INCLUDE [azure-storage-limits](../../includes/azure-storage-limits.md)]

## Scalability targets for virtual machine disks

[AZURE.INCLUDE [azure-storage-limits-vm-disks](../../includes/azure-storage-limits-vm-disks.md)]

See [Windows VM sizes](../virtual-machines/virtual-machines-windows-sizes.md) or [Linux VM sizes](../virtual-machines/virtual-machines-linux-sizes.md) for additional details.

### Standard storage accounts

[AZURE.INCLUDE [azure-storage-limits-vm-disks-standard](../../includes/azure-storage-limits-vm-disks-standard.md)]

### Premium storage accounts

[AZURE.INCLUDE [azure-storage-limits-vm-disks-premium](../../includes/azure-storage-limits-vm-disks-premium.md)]

## Scalability targets for Azure resource manager

[AZURE.INCLUDE [azure-storage-limits-azure-resource-manager](../../includes/azure-storage-limits-azure-resource-manager.md)]

## Partitions in Azure Storage

Every object that holds data that is stored in Azure Storage (blobs, messages, entities, and files) belongs to a partition, and is identified by a partition key. The partition determines how Azure Storage load balances blobs, messages, entities, and files across servers to meet the traffic needs of those objects. The partition key is unique and is used to locate a blob, message, or entity.

The table shown above in [Scalability Targets for Standard Storage Accounts](#standard-storage-accounts) lists the performance targets for a single partition for each service.

Partitions affect load balancing and scalability for each of the storage services in the following ways:

- **Blobs**: The partition key for a blob is account name + container name + blob name. This means that each blob can have its own partition if load on the blob demands it. Blobs can be distributed across many servers in order to scale out access to them, but a single blob can only be served by a single server. While blobs can be logically grouped in blob containers, there are no partitioning implications from this grouping.

- **Files**: The partition key for a file is account name + file share name. This means all files in a file share are also in a single partition.

- **Messages**: The partition key for a message is the account name + queue name, so all messages in a queue are grouped into a single partition and are served by a single server. Different queues may be processed by different servers to balance the load for however many queues a storage account may have.

- **Entities**: The partition key for an entity is account name + table name + partition key, where the partition key is the value of the required user-defined **PartitionKey** property for the entity. All entities with the same partition key value are grouped into the same partition and are served by the same partition server. This is an important point to understand in designing your application. Your application should balance the scalability benefits of spreading entities across multiple partitions with the data access advantages of grouping entities in a single partition.  

A key advantage to grouping a set of entities in a table into a single partition is that it's possible to perform atomic batch operations across entities in the same partition, since a partition exists on a single server. Therefore, if you wish to perform batch operations on a group of entities, consider grouping them with the same partition key. 

On the other hand, entities that are in the same table but have different partition keys can be load balanced across different servers, making it possible to have greater scalability.

Detailed recommendations for designing partitioning strategy for tables can be found [here](https://msdn.microsoft.com/library/azure/hh508997.aspx).

## See Also

- [Storage Pricing Details](https://azure.microsoft.com/pricing/details/storage/)
- [Azure Subscription and Service Limits, Quotas, and Constraints](../azure-subscription-service-limits.md)
- [Premium Storage: High-Performance Storage for Azure Virtual Machine Workloads](storage-premium-storage.md)
- [Azure Storage Replication](storage-redundancy.md)
- [Microsoft Azure Storage Performance and Scalability Checklist](storage-performance-checklist.md)
- [Microsoft Azure Storage: A Highly Available Cloud Storage Service with Strong Consistency](http://blogs.msdn.com/b/windowsazurestorage/archive/2011/11/20/windows-azure-storage-a-highly-available-cloud-storage-service-with-strong-consistency.aspx)
