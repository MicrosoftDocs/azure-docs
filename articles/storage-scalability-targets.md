<properties 
   pageTitle="Azure Storage Scalability and Performance Targets | Azure"
   description="Learn about the scalability and performance targets for an Azure Storage account, including capacity, request rate, and inbound and outbound bandwidth. Understand performance targets for partitions within each of the Azure Storage services."
   services="storage"
   documentationCenter="na"
   authors="tamram"
   manager="na"
   editor="na" />
<tags 
   ms.service="storage"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="storage"
   ms.date="04/24/2015"
   ms.author="tamram" />

# Azure Storage Scalability and Performance Targets

This topic describes the scalability and performance topics for Microsoft Azure Storage. For a summary of other Azure limits, see [Azure Subscription and Service Limits, Quotas, and Constraints](azure-subscription-service-limits.md).

>[AZURE.NOTE] All storage accounts run on the new flat network topology and support the scalability and performance targets outlined below, regardless of when they were created. For more information on the Azure Storage flat network architecture and on scalability, see the Azure Storage Team Blog.

<!-- -->

>[AZURE.IMPORTANT] The scalability and performance targets listed here are high-end targets, but are achievable. In all cases, the request rate and bandwidth achieved by your storage account depends upon the size of objects stored, the access patterns utilized, and the type of workload your application performs. Be sure to test your service to determine whether its performance meets your requirements. If possible, avoid sudden spikes in the rate of traffic and ensure that traffic is well-distributed across partitions.

>When your application reaches the limit of what a partition can handle for your workload, Azure Storage will begin to return error code 503 (Server Busy) or error code 500 (Operation Timeout) responses. When this occurs, the application should use an exponential backoff policy for retries. The exponential backoff allows the load on the partition to decrease, and to ease out spikes in traffic to that partition.

If the needs of your application exceed the scalability targets of a single storage account, you should build your application to use multiple storage accounts, and partition your data objects across those storage accounts. A single Azure subscription is allowed 100 storage accounts. See [Storage Pricing Details](http://azure.microsoft.com/pricing/details/storage/) for information on volume pricing.

## Scalability Targets for Storage Accounts

The scalability targets for a storage account depend on the region where it was created. The following sections outline scalability targets for US regions and for European and Asian regions.

For more details on the architecture and scalability targets for storage accounts, see [the Azure Storage Team Blog](http://blogs.msdn.com/b/windowsazurestorage/archive/2012/11/04/windows-azure-s-flat-network-storage-and-2012-scalability-targets.aspx).

### Scalability Targets for Standard Storage Accounts in US Regions

The following table describes the scalability targets for standard storage accounts in US regions, based on the level of redundancy chosen:

<table>
<tr>
<th>Total Account Capacity</th>
<th>Total Request Rate (assuming 1KB object size)</th>
<th>Total Bandwidth for a Geo-Redundant Storage Account</th>
<th>Total Bandwidth for a Locally Redundant Storage Account</th>
<tr>
<td>500 TB</td>
<td>Up to 20,000 entities or messages per second</td>
<td><ul>
<li>*Inbound: Up to 10 gigabits per second</li>
<li>*Outbound: Up to 20 gigabits per second</li>
</ol>
</td>
<td><ul>
<li>*Inbound: Up to 20 gigabits per second</li>
<li>*Outbound: Up to 30 gigabits per second</li>
</tr>
</table>	

*Inbound refers to all data (requests) being sent to a storage account.  

*Outbound refers to all data (responses) being received from a storage account.  

### Scalability Targets for Standard Storage Accounts in European and Asian Regions

The following table describes the scalability targets for storage accounts in European and Asian regions, based on the level of redundancy chosen:

<table>
<tr>
<th>Total Account Capacity</th>
<th>Total Request Rate (assuming 1KB object size)</th>
<th>Total Bandwidth for a Geo-Redundant Storage Account</th>
<th>Total Bandwidth for a Locally Redundant Storage Account</th>
<tr>
<td>500 TB</td>
<td>Up to 20,000 entities or messages per second</td>
<td><ul>
<li>*Inbound: Up to 5 gigabits per second</li>
<li>*Outbound: Up to 10 gigabits per second</li>
</ol>
</td>
<td><ul>
<li>*Inbound: Up to 10 gigabits per second</li>
<li>*Outbound: Up to 15 gigabits per second</li>
</tr>
</table>	  

*Inbound refers to all data (requests) being sent to a storage account.  

*Outbound refers to all data (responses) being received from a storage account.  

### Scalability Targets for Premium Storage Accounts

The following table describes the scalability targets for Premium Storage accounts available in West US, East US 2, and West Europe regions:

<table>
<tr>
<th>Total Account Capacity</th>
<th>Total Bandwidth for a Locally Redundant Premium Storage Account</th>
<tr>
<td><ul>
<li>Disk capacity: 35 TB</li>
<li>Snapshot capacity: 10 TB</li>
</td>
<td>Up to 50 gigabits per second for Inbound + Outbound</td>
</table>	

*Inbound refers to all data (requests) being sent to a storage account.  

*Outbound refers to all data (responses) being received from a storage account.

For information on Premium Storage disks, see [Premium Storage: High-Performance Storage for Azure Virtual Machine Workloads](storage-premium-storage-preview-portal.md).

## Partitions in Azure Storage

The following table describes the performance targets for a single partition for each service:

<table>
<tr>
<th>Target Throughput for Single Blob</th>
<th>Target Throughput for Single Queue (1 KB messages)</th>
<th>Target Throughput for Single Table Partition (1 KB entities)</th>
<th>Target Throughput for Single File (Preview)</th><tr>
<td>Up to 60 MB per second, or up to 500 requests per second</td>
<td>Up to 2000 messages per second</td>
<td>Up to 2000 entities per second</td>
<td>Up to 60 MB per second</td>
</table>

Every object that holds data that is stored in Azure Storage (blobs, messages, entities, and files) belongs to a partition, and is identified by a partition key. The partition determines how Azure Storage load balances blobs, messages, entities, and files across servers to meet the traffic needs of those objects. The partition key is unique within the storage account and is used to locate a blob, message, or entity.

For tables, all entities with the same partition key value are grouped into the same partition and are stored on the same partition server. This is an important point to understand in designing your application. Your application should balance the scalability benefits of spreading entities across multiple partitions with the data access advantages of grouping entities in a single partition. A key advantage to grouping entities into partitions is that it's possible to perform atomic operations across entities in the same partition, since a partition exists on a single server.

Partitions affect load balancing and scalability for each of the storage services in the following ways:

- **Blobs**: The partition key for a blob is container name + blob name. This means that each blob has its own partition. Blobs can therefore be distributed across many servers in order to scale out access to them. While blobs can be logically grouped in blob containers, there are no partitioning implications from this grouping.

- **Messages**: The partition key for a message is the queue name, so all messages in a queue are grouped into a single partition and are served by a single server. Different queues may be processed by different servers to balance the load for however many queues a storage account may have.

- **Entities**: The partition key for an entity is table name + partition key, where the partition key is the value of the required user-defined **PartitionKey** property for the entity.  

	Entities within a table may have the same partition key values, in which case they are grouped into the same partition. An application can perform atomic batch transactions over entities within the same partition, since they are served from the same server.  

	Entities that are in the same table but that belong to different partitions can be load balanced across different servers, making it possible to have a large table with greater scalability.

## See Also

- [Storage Pricing Details](http://azure.microsoft.com/pricing/details/storage/)
- [Azure Storage: A Highly Available Cloud Storage Service with Strong Consistency](http://blogs.msdn.com/b/windowsazurestorage/archive/2011/11/20/windows-azure-storage-a-highly-available-cloud-storage-service-with-strong-consistency.aspx)
- [Azure Subscription and Service Limits, Quotas, and Constraints](azure-subscription-service-limits.md)

