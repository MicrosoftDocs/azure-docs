---
title: Object replication overview
titleSuffix: Azure Storage
description: Object replication asynchronously copies block blobs between a source storage account and a destination account. Use object replication to minimize latency on read requests, to increase efficiency for compute workloads, to optimize data distribution, and to minimize costs.
services: storage
author: tamram

ms.service: storage
ms.topic: conceptual
ms.date: 09/08/2020
ms.author: tamram
ms.subservice: blobs 
ms.custom: devx-track-azurepowershell
---

# Object replication for block blobs

Object replication asynchronously copies block blobs between a source storage account and a destination account. Some scenarios supported by object replication include:

- **Minimizing latency.** Object replication can reduce latency for read requests by enabling clients to consume data from a region that is in closer physical proximity.
- **Increase efficiency for compute workloads.** With object replication, compute workloads can process the same sets of block blobs in different regions.
- **Optimizing data distribution.** You can process or analyze data in a single location and then replicate just the results to additional regions.
- **Optimizing costs.** After your data has been replicated, you can reduce costs by moving it to the archive tier using life cycle management policies.

The following diagram shows how object replication replicates block blobs from a source storage account in one region to destination accounts in two different regions.

:::image type="content" source="media/object-replication-overview/object-replication-diagram.svg" alt-text="Diagram showing how object replication works":::

To learn how to configure object replication, see [Configure object replication](object-replication-configure.md).

[!INCLUDE [storage-data-lake-gen2-support](../../../includes/storage-data-lake-gen2-support.md)]

## Prerequisites for object replication

Object replication requires that the following Azure Storage features are also enabled:

- [Change feed](storage-blob-change-feed.md): Must be enabled on the source account. To learn how to enable change feed, see [Enable and disable the change feed](storage-blob-change-feed.md#enable-and-disable-the-change-feed).
- [Blob versioning](versioning-overview.md): Must be enabled on both the source and destination accounts. To learn how to enable versioning, see [Enable and manage blob versioning](versioning-enable.md).

Enabling change feed and blob versioning may incur additional costs. For more details, refer to the [Azure Storage pricing page](https://azure.microsoft.com/pricing/details/storage/).

## Object replication policies and rules

When you configure object replication, you create a replication policy that specifies the source storage account and the destination account. A replication policy includes one or more rules that specify a source container and a destination container and indicate which block blobs in the source container will be replicated.

After you configure object replication, Azure Storage checks the change feed for the source account periodically and asynchronously replicates any write or delete operations to the destination account. Replication latency depends on the size of the block blob being replicated.

> [!IMPORTANT]
> Because block blob data is replicated asynchronously, the source account and destination account are not immediately in sync. There's currently no SLA on how long it takes to replicate data to the destination account.

### Replication policies

When you configure object replication, a replication policy is created on both the source account and the destination account via the Azure Storage resource provider. The replication policy is identified by a policy ID. The policy on the source and destination accounts must have the same policy ID in order for replication to take place.

A storage account can serve as the source account for up to two destination accounts. The source and destination accounts may be in the same region or in different regions. They may also reside in different subscriptions and in different Azure Active Directory (Azure AD) tenants. Only one replication policy may be created for each source account/destination account pair.

### Replication rules

Replication rules specify how Azure Storage will replicate blobs from a source container to a destination container. You can specify up to 10 replication rules for each replication policy. Each replication rule defines a single source and destination container, and each source and destination container can be used in only one rule.

When you create a replication rule, by default only new block blobs that are subsequently added to the source container are copied. You can specify that both new and existing block blobs are copied, or you can define a custom copy scope that copies block blobs created from a specified time onward.

You can also specify one or more filters as part of a replication rule to filter block blobs by prefix. When you specify a prefix, only blobs matching that prefix in the source container will be copied to the destination container.

The source and destination containers must both exist before you can specify them in a rule. After you create the replication policy, the destination container becomes read-only. Any attempts to write to the destination container fail with error code 409 (Conflict). However, you can call the [Set Blob Tier](/rest/api/storageservices/set-blob-tier) operation on a blob in the destination container to move it to the archive tier. For more information about the archive tier, see [Azure Blob storage: hot, cool, and archive access tiers](storage-blob-storage-tiers.md#archive-access-tier).

## Billing

Object replication incurs additional costs on read and write transactions against the source and destination accounts, as well as egress charges for the replication of data from the source account to the destination account and read charges to process change feed.

## Next steps

- [Configure object replication](object-replication-configure.md)
- [Change feed support in Azure Blob Storage](storage-blob-change-feed.md)
- [Enable and manage blob versioning](versioning-enable.md)
