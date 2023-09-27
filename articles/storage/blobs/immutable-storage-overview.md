---
title: Overview of immutable storage for blob data
titleSuffix: Azure Storage
description: Azure Storage offers WORM (Write Once, Read Many) support for Blob Storage that enables users to store data in a non-erasable, non-modifiable state. Time-based retention policies store blob data in a WORM state for a specified interval, while legal holds remain in effect until explicitly cleared.
services: storage
author: normesta

ms.service: azure-blob-storage
ms.topic: conceptual
ms.date: 09/20/2023
ms.author: normesta
---

# Store business-critical blob data with immutable storage

Immutable storage for Azure Blob Storage enables users to store business-critical data in a WORM (Write Once, Read Many) state. While in a WORM state, data cannot be modified or deleted for a user-specified interval. By configuring immutability policies for blob data, you can protect your data from overwrites and deletes.

Immutable storage for Azure Blob Storage supports two types of immutability policies:

- **Time-based retention policies**: With a time-based retention policy, users can set policies to store data for a specified interval. When a time-based retention policy is set, objects can be created and read, but not modified or deleted. After the retention period has expired, objects can be deleted but not overwritten. To learn more about time-based retention policies, see [Time-based retention policies for immutable blob data](immutable-time-based-retention-policy-overview.md).

- **Legal hold policies**: A legal hold stores immutable data until the legal hold is explicitly cleared. When a legal hold is set, objects can be created and read, but not modified or deleted. To learn more about legal hold policies, see [Legal holds for immutable blob data](immutable-legal-hold-overview.md).

The following diagram shows how time-based retention policies and legal holds prevent write and delete operations while they are in effect.

:::image type="content" source="media/immutable-storage-overview/worm-diagram.png" alt-text="Diagram showing how retention policies and legal holds prevent write and delete operations":::

## About immutable storage for blobs

Immutable storage helps healthcare organization, financial institutions, and related industries&mdash;particularly broker-dealer organizations&mdash;to store data securely. Immutable storage can be leveraged in any scenario to protect critical data against modification or deletion.

Typical applications include:

- **Regulatory compliance**: Immutable storage for Azure Blob Storage helps organizations address SEC 17a-4(f), CFTC 1.31(d), FINRA, and other regulations.

- **Secure document retention**: Immutable storage for blobs ensures that data can't be modified or deleted by any user, not even by users with account administrative privileges.

- **Legal hold**: Immutable storage for blobs enables users to store sensitive information that is critical to litigation or business use in a tamper-proof state for the desired duration until the hold is removed. This feature is not limited only to legal use cases but can also be thought of as an event-based hold or an enterprise lock, where the need to protect data based on event triggers or corporate policy is required.

## Regulatory compliance

Microsoft retained a leading independent assessment firm that specializes in records management and information governance, Cohasset Associates, to evaluate immutable storage for blobs and its compliance with requirements specific to the financial services industry. Cohasset validated that immutable storage, when used to retain blobs in a WORM state, meets the relevant storage requirements of CFTC Rule 1.31(c)-(d), FINRA Rule 4511, and SEC Rule 17a-4(f). Microsoft targeted this set of rules because they represent the most prescriptive guidance globally for records retention for financial institutions.

The Cohasset report is available in the [Microsoft Service Trust Center](https://aka.ms/AzureWormStorage). The [Azure Trust Center](https://www.microsoft.com/trustcenter/compliance/compliance-overview) contains detailed information about Microsoft's compliance certifications. To request a letter of attestation from Microsoft regarding WORM immutability compliance, please contact [Azure Support](https://azure.microsoft.com/support/options/).

## Immutability policy scope

Immutability policies can be scoped to a blob version or to a container. How an object behaves under an immutability policy depends on the scope of the policy. For more information about policy scope for each type of immutability policy, see the following sections:

- [Time-based retention policy scope](immutable-time-based-retention-policy-overview.md#time-based-retention-policy-scope)
- [Legal hold scope](immutable-legal-hold-overview.md#legal-hold-scope)

You can configure both a time-based retention policy and a legal hold for a resource (container or blob version), depending on the scope.

### Version-level scope

To configure an immutability policy that is scoped to a blob version, you must enable support for version-level immutability on either the storage account or a container. After you enable support for version-level immutability on a storage account, you can configure a default policy at the account level that applies to all objects subsequently created in the storage account. If you enable support for version-level immutability on an individual container, you can configure a default policy for that container that applies to all objects subsequently created in the container.

The following table summarizes which immutability policies are supported for each resource scope:

| Resource | Enable version-level immutability policies | Policy support |
|--|--|--|
| Account | Yes, at account creation only. | Supports one default version-level immutability policy. The default policy applies to any new blob versions created in the account after the policy is configured.<br /><br /> Does not support legal hold. |
| Container | Yes, at container creation. Existing containers must be migrated to support version-level immutability policies. | Supports one default version-level immutability policy. The default policy applies to any new blob versions created in the container after the policy is configured.<br /><br /> Does not support legal hold. |
| Blob version | N/A | Supports one version-level immutability policy and one legal hold. A policy on a blob version can override a default policy specified on the account or container. |

### Container-level scope

When support for version-level immutability policies has not been enabled for a storage account or a container, then any immutability policies are scoped to the container. A container supports one immutability policy and one legal hold. Policies apply to all objects within the container.

## Summary of immutability scenarios

The protection afforded by an immutability policy depends on the scope of the immutability policy and, in the case of a time-based retention policy, whether it is locked or unlocked and whether it is active or expired.

### Scenarios with version-level scope

The following table provides a summary of protections provided by version-level immutability policies.

| Scenario | Prohibited operations | Blob protection | Container protection | Account protection |
|--|--|--|--|--|
| A blob version is protected by an *active* retention policy and/or a legal hold is in effect | [Delete Blob](/rest/api/storageservices/delete-blob), [Set Blob Metadata](/rest/api/storageservices/set-blob-metadata), [Put Page](/rest/api/storageservices/put-page), and [Append Block](/rest/api/storageservices/append-block)<sup>1</sup> | The blob version cannot be deleted. User metadata cannot be written. <br /><br /> Overwriting a blob with [Put Blob](/rest/api/storageservices/put-blob), [Put Block List](/rest/api/storageservices/put-block-list), or [Copy Blob](/rest/api/storageservices/copy-blob) creates a new version.<sup>2</sup> | Container deletion fails if at least one blob exists in the container, regardless of whether policy is locked or unlocked. | Storage account deletion fails if there is at least one container with version-level immutable storage enabled, or if it is enabled for the account. |
| A blob version is protected by an *expired* retention policy and no legal hold is in effect | [Set Blob Metadata](/rest/api/storageservices/set-blob-metadata), [Put Page](/rest/api/storageservices/put-page), and [Append Block](/rest/api/storageservices/append-block)<sup>1</sup> | The blob version can be deleted. User metadata cannot be written. <br /><br /> Overwriting a blob with [Put Blob](/rest/api/storageservices/put-blob), [Put Block List](/rest/api/storageservices/put-block-list), or [Copy Blob](/rest/api/storageservices/copy-blob) creates a new version<sup>2</sup>. | Container deletion fails if at least one blob exists in the container, regardless of whether policy is locked or unlocked. | Storage account deletion fails if there is at least one container that contains a blob version with a locked time-based retention policy.<br /><br />Unlocked policies do not provide delete protection. |

<sup>1</sup> The [Append Block](/rest/api/storageservices/append-block) operation is permitted only for policies with the **allowProtectedAppendWrites** or **allowProtectedAppendWritesAll** property enabled. For more information, see [Allow protected append blobs writes](immutable-time-based-retention-policy-overview.md#allow-protected-append-blobs-writes).
<sup>2</sup> Blob versions are always immutable for content. If versioning is enabled for the storage account, then a write operation to a block blob creates a new version, with the exception of the [Put Block](/rest/api/storageservices/put-block) operation.

### Scenarios with container-level scope

The following table provides a summary of protections provided by container-level immutability policies.

| Scenario | Prohibited operations | Blob protection | Container protection | Account protection |
|--|--|--|--|--|
| A container is protected by an *active* time-based retention policy with container scope and/or a legal hold is in effect | [Delete Blob](/rest/api/storageservices/delete-blob), [Put Blob](/rest/api/storageservices/put-blob)<sup>1</sup>, [Set Blob Metadata](/rest/api/storageservices/set-blob-metadata), [Put Page](/rest/api/storageservices/put-page), [Set Blob Properties](/rest/api/storageservices/set-blob-properties), [Snapshot Blob](/rest/api/storageservices/snapshot-blob), [Incremental Copy Blob](/rest/api/storageservices/incremental-copy-blob), [Append Block](/rest/api/storageservices/append-block)<sup>2</sup> | All blobs in the container are immutable for content and user metadata | Container deletion fails if a container-level policy is in effect. | Storage account deletion fails if there is a container with at least one blob present. |
| A container is protected by an *expired* time-based retention policy with container scope and no legal hold is in effect | [Put Blob](/rest/api/storageservices/put-blob)<sup>1</sup>, [Set Blob Metadata](/rest/api/storageservices/set-blob-metadata), [Put Page](/rest/api/storageservices/put-page), [Set Blob Properties](/rest/api/storageservices/set-blob-properties), [Snapshot Blob](/rest/api/storageservices/snapshot-blob), [Incremental Copy Blob](/rest/api/storageservices/incremental-copy-blob), [Append Block](/rest/api/storageservices/append-block)<sup>2</sup> | Delete operations are allowed. Overwrite operations are not allowed. | Container deletion fails if at least one blob exists in the container, regardless of whether policy is locked or unlocked. | Storage account deletion fails if there is at least one container with a locked time-based retention policy.<br /><br />Unlocked policies do not provide delete protection. |

<sup>1</sup> Azure Storage permits the [Put Blob](/rest/api/storageservices/put-blob) operation to create a new blob. Subsequent overwrite operations on an existing blob path in an immutable container are not allowed.

<sup>2</sup> The [Append Block](/rest/api/storageservices/append-block) operation is permitted only for policies with the **allowProtectedAppendWrites** or **allowProtectedAppendWritesAll** property enabled. For more information, see [Allow protected append blobs writes](immutable-time-based-retention-policy-overview.md#allow-protected-append-blobs-writes).

> [!NOTE]
> Some workloads, such as [SQL Backup to URL](/sql/relational-databases/backup-restore/sql-server-backup-to-url), create a blob and then add to it. If a container has an active time-based retention policy or legal hold in place, this pattern will not succeed.

## Supported account configurations

Immutability policies are supported for both new and existing storage accounts. The following table shows which types of storage accounts are supported for each type of policy:

| Type of immutability policy | Scope of policy | Types of storage accounts supported | Supports hierarchical namespace |
|--|--|--|--|
| Time-based retention policy | Version-level scope | General-purpose v2<br />Premium block blob | No |
| Time-based retention policy | Container-level scope | General-purpose v2<br />Premium block blob<br />General-purpose v1 (legacy)<sup>1</sup><br> Blob storage (legacy) | Yes |
| Legal hold | Version-level scope | General-purpose v2<br />Premium block blob | No |
| Legal hold | Container-level scope | General-purpose v2<br />Premium block blob<br />General-purpose v1 (legacy)<sup>1</sup><br> Blob storage (legacy) | Yes |

> [!NOTE]
> Immutability policies are not supported in accounts that have the Network File System (NFS) 3.0 protocol or the SSH File Transfer Protocol (SFTP) enabled on them.

<sup>1</sup> Microsoft recommends upgrading general-purpose v1 accounts to general-purpose v2 so that you can take advantage of more features. For information on upgrading an existing general-purpose v1 storage account, see [Upgrade a storage account](../common/storage-account-upgrade.md).

### Access tiers

All blob access tiers support immutable storage. You can change the access tier of a blob with the Set Blob Tier operation. For more information, see [Hot, Cool, and Archive access tiers for blob data](access-tiers-overview.md).

### Redundancy configurations

All redundancy configurations support immutable storage. For more information about redundancy configurations, see [Azure Storage redundancy](../common/storage-redundancy.md).

### Hierarchical namespace support

Accounts that have a hierarchical namespace support immutability policies that are scoped to the container. However, you cannot rename or move a blob when the blob is in the immutable state and the account has a hierarchical namespace enabled. Both the blob name and the directory structure provide essential container-level data that cannot be modified once the immutable policy is in place.

## Recommended blob types

Microsoft recommends that you configure immutability policies mainly for block blobs and append blobs. Configuring an immutability policy for a page blob that stores a VHD disk for an active virtual machine is discouraged as writes to the disk will be blocked. Microsoft recommends that you thoroughly review the documentation and test your scenarios before locking any time-based policies.

## Immutable storage with blob soft delete

When blob soft delete is configured for a storage account, it applies to all blobs within the account regardless of whether a legal hold or time-based retention policy is in effect. Microsoft recommends enabling soft delete for additional protection before any immutability policies are applied.

If you enable blob soft delete and then configure an immutability policy, any blobs that have already been soft deleted will be permanently deleted once the soft delete retention policy has expired. Soft-deleted blobs can be restored during the soft delete retention period. A blob or version that has not yet been soft deleted is protected by the immutability policy and cannot be soft deleted until after the time-based retention policy has expired or the legal hold has been removed.

## Use blob inventory to track immutability policies

Azure Storage blob inventory provides an overview of the containers in your storage accounts and the blobs, snapshots, and blob versions within them. You can use the blob inventory report to understand the attributes of blobs and containers, including whether a resource has an immutability policy configured.

When you enable blob inventory, Azure Storage generates an inventory report on a daily basis. The report provides an overview of your data for business and compliance requirements.

For more information about blob inventory, see [Azure Storage blob inventory](blob-inventory.md).

## Pricing

There is no additional capacity charge for using immutable storage. Immutable data is priced in the same way as mutable data. For pricing details on Azure Blob Storage, see the [Azure Storage pricing page](https://azure.microsoft.com/pricing/details/storage/blobs/).

Creating, modifying, or deleting a time-based retention policy or legal hold on a blob version results in a write transaction charge.

If you fail to pay your bill and your account has an active time-based retention policy in effect, normal data retention policies will apply as stipulated in the terms and conditions of your contract with Microsoft. For general information, see [Data management at Microsoft](https://www.microsoft.com/trust-center/privacy/data-management).

## Feature support

[!INCLUDE [Blob Storage feature support in Azure Storage accounts](../../../includes/azure-storage-feature-support.md)]

## Next steps

- [Data protection overview](data-protection-overview.md)
- [Time-based retention policies for immutable blob data](immutable-time-based-retention-policy-overview.md)
- [Legal holds for immutable blob data](immutable-legal-hold-overview.md)
- [Configure immutability policies for blob versions](immutable-policy-configure-version-scope.md)
- [Configure immutability policies for containers](immutable-policy-configure-container-scope.md)
