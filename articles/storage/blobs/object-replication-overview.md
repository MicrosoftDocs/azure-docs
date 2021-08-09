---
title: Object replication overview
titleSuffix: Azure Storage
description: Object replication asynchronously copies block blobs between a source storage account and a destination account. Use object replication to minimize latency on read requests, to increase efficiency for compute workloads, to optimize data distribution, and to minimize costs.
services: storage
author: tamram

ms.service: storage
ms.topic: conceptual
ms.date: 05/11/2021
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

Object replication is supported only for general-purpose v2 storage accounts. Both the source and destination accounts must be general-purpose v2. 

## How object replication works

Object replication asynchronously copies block blobs in a container according to rules that you configure. The contents of the blob, any versions associated with the blob, and the blob's metadata and properties are all copied from the source container to the destination container.

> [!IMPORTANT]
> Because block blob data is replicated asynchronously, the source account and destination account are not immediately in sync. There's currently no SLA on how long it takes to replicate data to the destination account. You can check the replication status on the source blob to determine whether replication is complete. For more information, see [Check the replication status of a blob](object-replication-configure.md#check-the-replication-status-of-a-blob).

### Blob versioning

Object replication requires that blob versioning is enabled on both the source and destination accounts. When a replicated blob in the source account is modified, a new version of the blob is created in the source account that reflects the previous state of the blob, before modification. The current version (or base blob) in the source account reflects the most recent updates. Both the updated current version and the new previous version are replicated to the destination account. For more information about how write operations affect blob versions, see [Versioning on write operations](versioning-overview.md#versioning-on-write-operations).

When a blob in the source account is deleted, the current version of the blob is captured in a previous version, and then deleted. All previous versions of the blob persist even after the current version is deleted. This state is replicated to the destination account. For more information about how delete operations affect blob versions, see [Versioning on delete operations](versioning-overview.md#versioning-on-delete-operations).

### Snapshots

Object replication does not support blob snapshots. Any snapshots on a blob in the source account are not replicated to the destination account.

### Blob tiering

Object replication is supported when the source and destination accounts are in the hot or cool tier. The source and destination accounts may be in different tiers. However, object replication will fail if a blob in either the source or destination account has been moved to the archive tier. For more information on blob tiers, see [Access tiers for Azure Blob Storage - hot, cool, and archive](storage-blob-storage-tiers.md).

### Immutable blobs

Object replication does not support immutable blobs. If a source or destination container has a time-based retention policy or legal hold, then object replication fails. For more information about immutable blobs, see [Store business-critical blob data with immutable storage](immutable-storage-overview.md).

## Object replication policies and rules

When you configure object replication, you create a replication policy that specifies the source storage account and the destination account. A replication policy includes one or more rules that specify a source container and a destination container and indicate which block blobs in the source container will be replicated.

After you configure object replication, Azure Storage checks the change feed for the source account periodically and asynchronously replicates any write or delete operations to the destination account. Replication latency depends on the size of the block blob being replicated.

### Replication policies

When you configure object replication, a replication policy is created on both the source account and the destination account via the Azure Storage resource provider. The replication policy is identified by a policy ID. The policy on the source and destination accounts must have the same policy ID in order for replication to take place.

A source account can replicate to no more than two destination accounts, with one policy for each destination account. Similarly, an account may serve as the destination account for no more than two replication policies.

The source and destination accounts may be in the same region or in different regions. They may also reside in different subscriptions and in different Azure Active Directory (Azure AD) tenants. Only one replication policy may be created for each source account/destination account pair.

### Replication rules

Replication rules specify how Azure Storage will replicate blobs from a source container to a destination container. You can specify up to 10 replication rules for each replication policy. Each replication rule defines a single source and destination container, and each source and destination container can be used in only one rule, meaning that a maximum of 10 source containers and 10 destination containers may participate in a single replication policy.

When you create a replication rule, by default only new block blobs that are subsequently added to the source container are copied. You can specify that both new and existing block blobs are copied, or you can define a custom copy scope that copies block blobs created from a specified time onward.

You can also specify one or more filters as part of a replication rule to filter block blobs by prefix. When you specify a prefix, only blobs matching that prefix in the source container will be copied to the destination container.

The source and destination containers must both exist before you can specify them in a rule. After you create the replication policy, write operations to the  destination container are not permitted. Any attempts to write to the destination container fail with error code 409 (Conflict). To write to a destination container for which a replication rule is configured, you must either delete the rule that is configured for that container, or remove the replication policy. Read and delete operations to the destination container are permitted when the replication policy is active.

You can call the [Set Blob Tier](/rest/api/storageservices/set-blob-tier) operation on a blob in the destination container to move it to the archive tier. For more information about the archive tier, see [Azure Blob storage: hot, cool, and archive access tiers](storage-blob-storage-tiers.md#archive-access-tier).

## Replication status

You can check the replication status for a blob in the source account. For more information, see [Check the replication status of a blob](object-replication-configure.md#check-the-replication-status-of-a-blob).

If the replication status for a blob in the source account indicates failure, then investigate the following possible causes:

- Make sure that the object replication policy is configured on the destination account.
- Verify that the destination container still exists.
- If the source blob has been encrypted with a customer-provided key as part of a write operation, then object replication will fail. For more information about customer-provided keys, see [Provide an encryption key on a request to Blob storage](encryption-customer-provided-keys.md).

## Billing

Object replication incurs additional costs on read and write transactions against the source and destination accounts, as well as egress charges for the replication of data from the source account to the destination account and read charges to process change feed.

## Next steps

- [Configure object replication](object-replication-configure.md)
- [Change feed support in Azure Blob Storage](storage-blob-change-feed.md)
- [Enable and manage blob versioning](versioning-enable.md)
