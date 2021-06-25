---
title: Overview of immutability storage for Blob Storage
titleSuffix: Azure Storage
description: Azure Storage offers WORM (Write Once, Read Many) support for Blob (object) storage that enables users to store data in a non-erasable, non-modifiable state for a specified interval.
services: storage
author: tamram

ms.service: storage
ms.topic: conceptual
ms.date: 06/18/2021
ms.author: tamram
ms.reviewer: hux
ms.subservice: blobs
---

# Store business-critical blob data with immutable storage

Immutable storage for Azure Blob Storage enables users to store business-critical data in a WORM (Write Once, Read Many) state. This state makes the data non-erasable and non-modifiable for a user-specified interval. While an immutability policy is in effect, objects can be created and read, but cannot be modified or deleted.

Immutable storage for Azure Blob storage supports two types of immutability policies:

- **Time-based retention policies**: With a time-based retention policy, users can set policies to store data for a specified interval. When a time-based retention policy is set, objects can be created and read, but not modified or deleted. After the retention period has expired, objects can be deleted but not overwritten. For more information about time-based retention policies, see [Time-based retention policies for immutable blob data](immutable-time-based-retention-policy-overview.md).

- **Legal hold policies**: A legal hold stores immutable data until the legal hold is explicitly cleared. Use a legal hold when the period of time that the data must be kept in a WORM state is unknown. When a legal hold policy is set, objects can be created and read, but not modified or deleted. Each legal hold is associated with a user-defined alphanumeric tag that serves as an identifier, such as a case ID or event name. For more information about legal hold policies, see [Legal holds for immutable blob data](immutable-legal-hold-overview.md).

For information about how to configure immutability policies using the Azure portal, PowerShell, or Azure CLI, see [Set and manage immutability policies for Blob storage](storage-blob-immutability-policies-manage.md).

The following diagram shows how time-based retention policies and legal holds prevent write and delete operations while they are in effect.

:::image type="content" source="media/immutable-storage-overview/worm-diagram.png" alt-text="Diagram showing how retention policies and legal holds prevent write and delete operations":::

[!INCLUDE [storage-multi-protocol-access-preview](../../../includes/storage-multi-protocol-access-preview.md)]

## About immutable storage for blobs

Immutable storage helps healthcare organization, financial institutions, and related industries&mdash;particularly broker-dealer organizations&mdash;to store data securely. Immutable storage can also be leveraged in any scenario to protect critical data against modification or deletion.

Typical applications include:

- **Regulatory compliance**: Microsoft retained a leading independent assessment firm that specializes in records management and information governance, Cohasset Associates, to evaluate immutable storage for blobs and its compliance with requirements specific to the financial services industry. Cohasset validated that immutable storage, when used to retain blobs in a WORM state, meets the relevant storage requirements of CFTC Rule 1.31(c)-(d), FINRA Rule 4511, and SEC Rule 17a-4(f). Microsoft targeted this set of rules because they represent the most prescriptive guidance globally for records retention for financial institutions.

  The Cohasset report is available in the [Microsoft Service Trust Center](https://aka.ms/AzureWormStorage). The [Azure Trust Center](https://www.microsoft.com/trustcenter/compliance/compliance-overview) contains detailed information about Microsoft's compliance certifications. To request a letter of attestation from Microsoft regarding WORM immutability compliance, please contact [Azure Support](https://azure.microsoft.com/support/options/).

- **Secure document retention**: Immutable storage for blobs ensures that data can't be modified or deleted by any user, not even by users with account administrative privileges.

- **Legal hold**: Immutable storage for blobs enables users to store sensitive information that is critical to litigation or business use in a tamper-proof state for the desired duration until the hold is removed. This feature is not limited only to legal use cases but can also be thought of as an event-based hold or an enterprise lock, where the need to protect data based on event triggers or corporate policy is required.

## Policy scope

Immutability policies can be scoped to a blob version (preview) or a container. How a blob behaves under an immutability possibility depends on the scope of the policy. For more information about policy scope, see the following sections:

- The **Policy scope** section in [Policy scope](immutable-time-based-retention-policy-overview.md#policy-scope)  
- ??? for legal hold

Expired vs active
locked vs unlocked

## Summary of immutability scenarios

The following table provides a summary of protections provided by immutability policies. The protection afforded depends on the scope of the immutability policy and, in the case of a time-based retention policy, whether it is locked or unlocked and whether it is active or expired.

| Scenario | Operations denied | Blob protection | Container protection | Account protection |
|--|--|--|--|--|
| A blob version is protected by either an active immutability policy with version-level scope or a legal hold | Write operations on an existing blob version, including Put Blob, Put Page, and Append Blob.<br /><br />Cannot set legal hold on container (with CLW???)<br> <br>Note: < add on versioned> - what does this mean??? | The version is immutable for content and user metadata. (A version is always immutable for content).<br> <br> | Container deletion fails if at least one blob exists in the container. Policy may be locked or unlocked. | Storage account deletion fails if there is at least one container with a locked time-based retention policy.<br /><br />Unlocked policies do not provide delete protection. |
| A blob version is protected by an expired immutability policy with version-level scope and no legal hold is present |  | The version can be deleted.<br /><br />Overwrite allowed as it creates a new version. | Container deletion fails if at least one blob exists in the container. Policy may be locked or unlocked. | Storage account deletion fails if there is at least one container with a locked time-based retention policy.<br /><br />Unlocked policies do not provide delete protection. |
| A container is protected by an active time-based retention policy or by a legal hold | Put (overwrite), Delete, Set Blob Metadata, Put Page, Set Blob Properties, Snapshot Blob, Incremental Copy Blob, Append Block (if allowProtectedAppendWrites not set) | All blobs in the container are immutable for content and user metadata | Container deletion fails. | Storage account deletion fails if there is a container with at least one blob present |
| A container is protected by an expired time-based retention policy and no legal hold is present | Put (overwrite), Set Blob Metadata, Put Page, Set Blob Properties, Snapshot Blob, Incremental Copy Blob, Append Block (if allowProtectedAppendWrites not set) | Delete operations allowed.  <br> <br> Overwrite operations are not allowed. | Container deletion fails if at least one blob exists in the container. Policy may be locked or unlocked. | Storage account deletion fails if there is at least one container with a locked time-based retention policy.<br /><br />Unlocked policies do not provide delete protection. |

<sup>1</sup> Azure Storage permits these operations to create a new blob. Subsequent overwrite operations on an existing blob path in an immutable container are not allowed.

<sup>2</sup> The Append Block operation is only permitted for time-based retention policies with the `allowProtectedAppendWrites` property enabled. For more information, see the [Allow Protected Append Blobs Writes](#allow-protected-append-blobs-writes) section.


> [!IMPORTANT]
> Some workloads, such as [SQL Backup to URL](/sql/relational-databases/backup-restore/sql-server-backup-to-url), create a blob and then add to it. If the container has an active time-based retention policy or legal hold in place, this pattern will not succeed.

## Supported configurations

Immutability policies are supported for both new and existing storage accounts. The following table shows which types of storage accounts are supported for each type of policy:

| Type of immutability policy | Scope of policy | Types of storage accounts supported |
|--|--|--|
| Time-based retention policy | Version-level scope (preview) | General-purpose v2<br> <br>Premium block blob |
| Time-based retention policy | Container-level scope | General-purpose v2<br> <br>Premium block blob<br> <br>General-purpose v1 (legacy)<br> Blob storage (legacy) |
| Legal hold | Version-level scope (preview) | General-purpose v2<br> <br>Premium block blob |
| Legal hold | Container-level scope | General-purpose v2<br> <br>Premium block blob<br> <br>General-purpose v1 (legacy)<br> Blob storage (legacy) |

Microsoft recommends upgrading to general-purpose v2 such that you can take advantage of more features. For information on upgrading an existing general-purpose v1 storage account, see [Upgrade a storage account](../common/storage-account-upgrade.md).

### Recommended blob types

Microsoft recommends that you configure immutability policies mainly for block blobs and append blobs. Configuring an immutability policy for a page blob that stores a VHD disk for an active virtual machine is discouraged as writes to the disk will be blocked. Microsoft recommends that you thoroughly review the documentation and test your scenarios before locking any time-based policies.



## Pricing

There is no additional charge for using immutable storage. Immutable data is priced in the same way as mutable data. For pricing details on Azure Blob storage, see the [Azure Storage pricing page](https://azure.microsoft.com/pricing/details/storage/blobs/).

## FAQ


**Can I apply both a legal hold and time-based retention policy?**

Yes, a container can have both a legal hold and a time-based retention policy at the same time; however, the 'allowProtectedAppendWrites' setting will not apply until the legal hold is cleared. All blobs in that container stay in the immutable state until all legal holds are cleared, even if their effective retention period has expired. Conversely, a blob stays in an immutable state until the effective retention period expires, even though all legal holds have been cleared. 


**Can I remove a _locked_ time-based retention policy or legal hold?**

Only unlocked time-based retention policies can be removed from a container. Once a time-based retention policy is locked, it cannot be removed; only effective retention period extensions are allowed. Legal hold tags can be deleted. When all legal tags are deleted, the legal hold is removed.

**What happens if I try to delete a container with a time-based retention policy or legal hold?**

The Delete Container operation will fail if at least one blob exists within the container with either a locked or unlocked time-based retention policy or if the container has a legal hold. The Delete Container operation will succeed only if no blobs exist within the container and there are no legal holds. 

**What happens if I try to delete a storage account with a container that has a time-based retention policy or legal hold?**

The storage account deletion will fail if there is at least one container with a legal hold set or a **locked** time-based policy. A container with an unlocked time-based policy does not protect against storage account deletion. You must remove all legal holds and delete all **locked** containers before you can delete the storage account. For information on container deletion, see the preceding question. You can also apply further delete protections for your storage account with [Azure Resource Manager locks](../../azure-resource-manager/management/lock-resources.md).

**Can I move the data across different blob tiers (hot, cool, archive) when the blob is in the immutable state?**

Yes, you can use the Set Blob Tier command to move data across the blob tiers while keeping the data in the compliant immutable state. Immutable storage is supported on hot, cool, and archive blob tiers.

**What happens if I fail to pay and my retention interval has not expired?**

In the case of non-payment, normal data retention policies will apply as stipulated in the terms and conditions of your contract with Microsoft. For general information, see [Data management at Microsoft](https://www.microsoft.com/en-us/trust-center/privacy/data-management). 

**Do you offer a trial or grace period for just trying out the feature?**

Yes. When a time-based retention policy is first created, it is in an *unlocked* state. In this state, you can make any desired change to the retention interval, such as increase or decrease and even delete the policy. After the policy is locked, it stays locked until the retention interval expires. This locked policy prevents deletion and modification to the retention interval. We strongly recommend that you use the *unlocked* state only for trial purposes and lock the policy within a 24-hour period. These practices help you comply with SEC 17a-4(f) and other regulations.

**Can I use soft delete alongside immutable blob policies?**

Yes, if your compliance requirements allow for soft delete to be enabled. [Soft delete for Azure Blob storage](./soft-delete-blob-overview.md) applies to all containers within a storage account regardless of whether a legal hold or time-based retention policy is in effect. Microsoft recommends enabling soft delete for additional protection before any immutability policies are applied. If soft delete is enabled on a container and then an immutability policy is added to the container, any blobs that have already been soft deleted will be permanently deleted once the soft delete retention policy has expired. Soft-deleted blobs can be restored during the soft delete retention period. Any blobs that have not yet been soft deleted are protected by the immutability policy and cannot be soft deleted until after the immutable policy has expired (for time-based retention) or removed (for legal holds).

**For an HNS-enabled account, can I rename or move a blob when the blob is in the immutable state?**
No, both the name and the directory structure are considered important container-level data that cannot be modified once the immutable policy is in place. Rename and move are only available for HNS-enabled accounts in general.

## Next steps

- [Set and manage immutability policies for Blob storage](storage-blob-immutability-policies-manage.md)
- [Set rules to automatically tier and delete blob data with lifecycle management](storage-lifecycle-management-concepts.md)
- [Soft delete for Azure Storage blobs](./soft-delete-blob-overview.md)
- [Protect subscriptions, resource groups, and resources with Azure Resource Manager locks](../../azure-resource-manager/management/lock-resources.md).
