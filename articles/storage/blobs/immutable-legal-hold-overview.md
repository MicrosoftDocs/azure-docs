---
title: Legal holds for immutable blob data 
titleSuffix: Azure Storage
description: Azure Storage offers WORM (Write Once, Read Many) support for Blob (object) storage that enables users to store data in a non-erasable, non-modifiable state for a specified interval. Learn how to create time-based retention policies.
services: storage
author: tamram

ms.service: storage
ms.topic: conceptual
ms.date: 06/18/2021
ms.author: tamram
ms.reviewer: hux
ms.subservice: blobs
---

# Legal holds for immutable blob data

Immutable storage for Azure Blob Storage enables users to store business-critical data in a WORM (Write Once, Read Many) state. This state makes the data non-erasable and non-modifiable for a user-specified interval. While an immutability policy is in effect, objects can be created and read, but cannot be modified or deleted.

Immutable storage for Azure Blob storage supports two types of immutability policies:

- **[Time-based retention policies](#time-based-retention-policies)**: With a time-based retention policy, users can set policies to store data for a specified interval. When a time-based retention policy is set, objects can be created and read, but not modified or deleted. After the retention period has expired, objects can be deleted but not overwritten.

- **[Legal hold policies](#legal-holds)**: A legal hold stores immutable data until the legal hold is explicitly cleared. Use a legal hold when the period of time that the data must be kept in a WORM state is unknown. When a legal hold policy is set, objects can be created and read, but not modified or deleted. Each legal hold is associated with a user-defined alphanumeric tag that serves as an identifier, such as a case ID or event name.

For information about how to configure immutability policies using the Azure portal, PowerShell, or Azure CLI, see [Set and manage immutability policies for Blob storage](storage-blob-immutability-policies-manage.md).

[!INCLUDE [storage-multi-protocol-access-preview](../../../includes/storage-multi-protocol-access-preview.md)]

## Immutability scenarios

The following table provides an overview of the types of Blob Storage operations that are forbidden in different immutable scenarios. For more information, see the [Azure Blob Service REST API](/rest/api/storageservices/blob-service-rest-api) documentation.

| Scenario | Blob state | Blob operations denied | Container and account protection |
|--|--|--|--|
| An active time-based retention policy is in effect, and/or a legal hold has been set | Immutable: both delete and write-protected | Put Blob<sup>1</sup>, Put Block<sup>1</sup>, Put Block List<sup>1</sup>, Delete Container, Delete Blob, Set Blob Metadata, Put Page, Set Blob Properties, Snapshot Blob, Incremental Copy Blob, Append Block<sup>2</sup> | The storage account and container are protected from deletion. |
| The retention interval for a time-based retention policy has expired and no legal hold is set | Write-protected only (delete operations are allowed) | Put Blob<sup>1</sup>, Put Block<sup>1</sup>, Put Block List<sup>1</sup>, Set Blob Metadata, Put Page, Set Blob Properties, Snapshot Blob, Incremental Copy Blob, Append Block<sup>2</sup> | The container is protected from deletion if at least one blob exists within protected container. The atorage account is protected from deletion only for *locked* time-based retention policies. |
| No immutability policy has been applied (no time-based retention and no legal hold tag) | Mutable | None | None |

<sup>1</sup> Azure Storage permits these operations to create a new blob. All subsequent overwrite operations on an existing blob path in an immutable container are not allowed.

<sup>2</sup> Append Block is only permitted for time-based retention policies with the `allowProtectedAppendWrites` property enabled. For more information, see the [Allow Protected Append Blobs Writes](#allow-protected-append-blobs-writes) section.

> [!IMPORTANT]
> Some workloads, such as [SQL Backup to URL](/sql/relational-databases/backup-restore/sql-server-backup-to-url), create a blob and then add to it. If the container has an active time-based retention policy or legal hold in place, this pattern will not succeed.

## Legal holds

For legal holds, the log contains the user ID, command type, time stamps, and legal hold tags. 

Legal holds are temporary holds that can be used for legal investigation purposes or general protection policies. Each legal hold policy needs to be associated with one or more tags. Tags are used as a named identifier, such as a case ID or event, to categorize and 
describe the purpose of the hold.

A container can have both a legal hold and a time-based retention policy at the same time. All blobs in that container stay in the immutable state until all legal holds are cleared, even if their effective retention period has expired. Conversely, a blob stays in an immutable state until the effective retention period expires, even though all legal holds have been cleared.

The following limits apply to legal holds:

- For a storage account, the maximum number of containers with a legal hold setting is 10,000.
- For a container, the maximum number of legal hold tags is 10.
- The minimum length of a legal hold tag is three alphanumeric characters. The maximum length is 23 alphanumeric characters.
- For a container, a maximum of 10 legal hold policy audit logs are retained for the duration of the policy.


**Are legal hold policies only for legal proceedings or are there other use scenarios?**

No, Legal Hold is just the general term used for a non-time-based retention policy. It does not need to only be used for litigation-related proceedings. Legal Hold policies are useful for disabling overwrite and deletes for protecting important enterprise WORM data, where the retention period is unknown. You may use it as an enterprise policy to protect your mission critical WORM workloads or use it as a staging policy before a custom event trigger requires the use of a time-based retention policy. 


## Pricing

There is no additional charge for using this feature. Immutable data is priced in the same way as mutable data. For pricing details on Azure Blob storage, see the [Azure Storage pricing page](https://azure.microsoft.com/pricing/details/storage/blobs/).

## Next steps

- [Set and manage immutability policies for Blob storage](storage-blob-immutability-policies-manage.md)
- [Set rules to automatically tier and delete blob data with lifecycle management](storage-lifecycle-management-concepts.md)
- [Soft delete for Azure Storage blobs](./soft-delete-blob-overview.md)
- [Protect subscriptions, resource groups, and resources with Azure Resource Manager locks](../../azure-resource-manager/management/lock-resources.md).
