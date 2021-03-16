---
title: Data protection for Blob Storage and Data Lake Storage Gen2
titleSuffix: Azure Storage
description: The data protection options available for your blob and Azure Data Lake Storage Gen2 data enables you to protect your data from accidental or malicious deletes or updates. If you should need to recover data that has been deleted or overwritten, this guide can help you to choose the recovery option that's best for your scenario.
services: storage
author: tamram

ms.service: storage
ms.date: 03/15/2021
ms.topic: conceptual
ms.author: tamram
ms.reviewer: prishet
ms.subservice: common
---

# Data protection for Blob Storage and Data Lake Storage Gen2

Azure Storage provides data protection options for your blob and Azure Data Lake Storage Gen2 data to help you to prepare for scenarios where you need to recover data that has been deleted or overwritten. It's important to think about how to best protect your data before an incident occurs that could compromise your data. This guide can help you decide in advance which data protection features your scenario requires, and how to implement them. If you should need to recover data that has been deleted or overwritten, this overview also provides guidance on how to proceed, based on your scenario.

The best time to plan for data protection is before an incident that requires data recovery. Whether you are anticipating that data could be deleted or overwritten by accident in the normal course of business, or intentionally, by a malicious actor, preparing your storage account so that your data is protected in advance can provide peace of mind, and simplify the act of recovery should it ever be necessary.

In the Azure Storage documentation, *data protection* refers to strategies for protecting the storage account and data within it from being deleted or modified, or for restoring data after it has been deleted or modified. Azure Storage also offers options for *disaster recovery*, including multiple levels of redundancy to protect your data from service outages due to hardware problems or natural disasters, and customer-managed failover in the event that the data center in the primary region becomes unavailable. For more information about how your data is protected from service outages, see [Disaster recovery](#disaster-recovery).

## Recommendations for basic data protection

If you are looking for basic data protection coverage for your storage account and the data that it contains, then Microsoft recommends:

- Configuring an Azure Resource Manager lock on the storage account to protect the account from deletion or configuration changes. [[Learn more...](../common/lock-account-resource.md)]
- Enabling container soft delete for the storage account to recover a deleted container and its contents. [[Learn more...](soft-delete-container-enable.md)]
- Enabling blob versioning for the storage account to recover a deleted or overwritten blob. [[Learn more...](versioning-enable.md)]

These options, as well as additional data protection options for other scenarios, are described in more detail in the following section.

## Overview of data protection options

The following table summarizes the options available in Azure Storage for common data protection scenarios. Choose the scenarios that are applicable to your situation to learn more about the options available to you. Note that not all features are available at this time for storage accounts with a hierarchical namespace enabled.

| Scenario | Action | Available for Data Lake Storage | Protection benefit | Recommendation |
|--|--|--|--|--|
| Prevent a storage account from being deleted or modified. | [Configure an Azure Resource Manager lock on the storage account](#configure-an-azure-resource-manager-lock-on-the-storage-account) | Yes | Protects the storage account against accidental or malicious deletes or configuration changes. Does not protect data in the account from being deleted or overwritten. | Recommended for scenarios where you need to prevent deletion of a storage accounts. |
| Prevent a container and its blobs from being deleted or modified for an interval that you control. | [Set a time-based retention policy or a legal hold on a container](#set-a-time-based-retention-policy-or-a-legal-hold-on-a-container) | Yes, in preview | Protects blob data from accidental or malicious deletes or updates. | Recommended when your scenario requires preventing all updates and deletes to the blobs in a container for a period of time, for example for legal documents or regulatory compliance purposes. |
| A container can be deleted, but a copy of the deleted container is maintained for a specified interval. | [Configure container soft delete for the storage account](#configure-container-soft-delete-for-the-storage-account) | Yes, in preview | Protects a container from accidental deletes. | Recommended for scenarios where you may need to restore a deleted container. The minimum recommended retention period of 7 days. |
| A blob can be deleted or updated, but its state is automatically saved in a previous version. | [Configure blob versioning for the storage account](#configure-blob-versioning-for-the-storage-account) | No | Protects blob data from accidental deletes and updates. A previous version of a blob can be read or referenced. | Recommended for storage accounts where you need to preserve earlier versions of blob data. |
| A blob can be deleted or updated, or a blob version can be deleted, but a copy of the blob or version is maintained for a specified interval. | [Configure blob soft delete for the storage account](#configure-blob-soft-delete-for-the-storage-account) | No | Protects blob data from accidental deletes and updates. | Recommended for scenarios where you may need to restore a deleted blob or version. The minimum recommended retention period of 7 days. |
| Blobs can be deleted or updated, but all updates and deletes are tracked so that data can be restored to a previous point in time. | [Configure point-in-time restore for the storage account](#configure-point-in-time-restore-for-the-storage-account) | No | Protects blob data from accidental deletes and updates. Does not protect against malicious deletion or corruption of data. | Recommended when your scenario requires recovering data within a certain range of time. |
| A blob can be updated, but the state of a blob is saved manually at a given point in time. | [Take a manual snapshot of a blob](#take-a-manual-snapshot-of-a-blob) | Yes, in preview | Preserves the state of a blob at a particular time. A blob snapshot can be read or referenced. | Recommended when blob versioning is not appropriate for your scenario, due to cost or other considerations. |
| A blob can be updated or deleted, but the data is regularly copied to a second storage account by using object replication or a tool like AzCopy or Azure Data Factory. | [Object replication for block blobs](object-replication-overview.md)<br /><br />[Get started with AzCopy](../common/storage-use-azcopy-v10.md)<br /><br />[Introduction to Azure Data Factory](../../data-factory/introduction.md) | AzCopy and Azure Data Factory are supported.<br /><br />Object replication is not supported. | Protects blob data from accidental or malicious deletes or updates. | Recommended for peace-of-mind protection against malicious actions or unpredictable scenarios. |

### Configure an Azure Resource Manager lock on the storage account

To prevent users from deleting a storage account or modifying its configuration, you can apply an Azure Resource Manager lock. There are two types of Azure Resource Manager resource locks:

- A **CannotDelete** lock prevents users from deleting a storage account, but permits reading and modifying its configuration.
- A **ReadOnly** lock prevents users from deleting a storage account or modifying its configuration, but permits reading the configuration.

To learn how to configure a lock for a storage account, see [Apply an Azure Resource Manager lock to a storage account](../common/lock-account-resource.md). For more information about Azure Resource Manager locks, see [Lock resources to prevent changes](../../azure-resource-manager/management/lock-resources.md).

#### Recommendation summary

- Lock all of your storage accounts with an Azure Resource Manager lock to prevent accidental or malicious deletion of the storage account.
- Locking a storage account does not protect the data within that account from being updated or deleted. Use the other data protection features described in this guide to protect your data.

To learn how to configure a lock on a storage account, see [Apply an Azure Resource Manager lock to a storage account](../common/lock-account-resource.md).

#### Cost considerations

There is no cost to configure a lock on a storage account.

### Set a time-based retention policy or a legal hold on a container

To prevent updates or deletes to blob data, you can configure an immutability policy on a container. Immutability policies store business-critical data in a Write Once, Read Many (WORM) state. When an immutability policy is in effect on a container, blobs in that container can be created or read by users with appropriate permissions, but cannot be modified or deleted. Azure Storage provides two types of immutability policies:

- *A time-based retention policy* prevents write or delete operations for a specified period of time.
- A *legal hold* prevents write or delete operations until the legal hold is explicitly cleared.

A time-based retention policy may be locked or unlocked. Locking the policy is necessary to meet compliance requirements. Use an unlocked policy for testing purposes only.

A legal hold protects against deletion of the container, its blobs, and the storage account. A time-based retention policy  protects against container deletion only if at least one blob exists within the container, and protects against storage account deletion only if the time-based retention policy is locked.

Immutability policies are available for both Blob storage and Azure Data Lake Storage Gen2 (preview). For more information about immutability policies, see [Store business-critical blob data with immutable storage](storage-blob-immutable-storage.md).

#### Recommendation summary

- Set an immutability policy on a container to protect business-critical documents, for example, in order to meet legal or regulatory compliance requirements.
- Use a legal hold to protect the container, its blobs, and the storage account from write and delete operations.
- Use a locked time-based retention policy to protect the container, its blobs, and the storage account from write and delete operations. Make sure that the container contains at least one blob in order to protect the container from deletion.

To learn how to configure an immutability policy on a container, see [Set and manage immutability policies for Blob storage](storage-blob-immutability-policies-manage.md).

#### Cost considerations

There is no cost to configure an immutability policy on a container.

### Configure container soft delete for the storage account

Container soft delete (preview) protects your blob data from accidental deletion by maintaining a deleted container, its blobs, and its metadata in the system for a specified period of time. The retention interval may be up to one year and is configured when you enable container soft delete for the storage account. After the retention period has expired, the container and its blobs are permanently deleted.

If needed, you can restore the deleted container during the retention interval by calling the Restore Container operation. Restoring a soft-deleted container restores all of the blobs within it to their state at the point when the container was deleted.

When a container is deleted, the retention period that is currently specified for the storage account is in effect for that container. The retention period countdown starts at the time that the container is deleted. If you change the retention period, that change applies only to subsequently deleted containers. It does not apply to any containers that have already been deleted.

When container soft delete is enabled for the storage account, it protects all containers in that account with the same retention period. If you have containers that require different retention periods, then Microsoft recommends storing them in different storage accounts. Store containers in the same storage account only if they can all be served by the same soft delete retention period.

Container soft delete can restore only whole containers and the blobs they contained at the time of deletion. You cannot restore a deleted blob within a container by using container soft delete. To protect the blobs in your containers from accidental deletion, enable blob versioning and blob soft delete.

Container soft delete is available for both Blob storage and Azure Data Lake Storage Gen2 in preview. For more information about container soft delete, see [Soft delete for containers (preview)](soft-delete-container-overview.md).

#### Recommendation summary

- Enable container soft delete for all storage accounts, with a minimum retention interval of 7 days.
- Enable blob versioning and blob soft delete together with container soft delete to protect individual blobs in a container.
- Store containers that require different retention periods in separate storage accounts.

To learn how to enable container soft delete, see [Enable and manage soft delete for containers (preview)](soft-delete-container-enable.md).

#### Cost considerations

There is no charge to enable container soft delete for a storage account. Data in soft-deleted containers is billed at same rate as active data. You are billed for soft-deleted containers and their data until the retention period expires.

### Configure blob versioning for the storage account

Blob versioning automatically saves a read-only copy of the previous state of a blob each time the blob is updated or when the blob is deleted. Each version is assigned a unique version ID. The data in a previous version can be read and referenced by calling Get Blob with the version ID. To restore a previous version, you can promote it to be the current version, which makes it writable again.

When blob versioning is enabled for the storage account, every write and delete operation to a blob in that account creates a new version. Versions are maintained until they are explicitly deleted. Having a large number of versions per blob can increase costs and decrease performance for blob listing operations. To mitigate  impacts related to storing versions, use lifecycle management to delete older versions. For more information, see [Optimize costs by automating Azure Blob Storage access tiers](storage-lifecycle-management-concepts.md).

Be sure that you understand the billing implications of enabling blob versioning. For more information, see [Pricing and billing](versioning-overview.md#pricing-and-billing).

Blob versioning is not currently available for Azure Data Lake Storage Gen2. However, you can take manual snapshots of blob data in a storage account for which a hierarchical namespace is enabled (preview). For more information about blob versioning, see [Blob versioning](versioning-overview.md).

#### Recommendation summary

- Enable blob versioning, together with container soft delete and blob soft delete, for storage accounts where you need optimal protection for blob data. Enabling blob soft delete together with versioning provides an additional level of protection for deleted versions, and should not increase costs in most scenarios.
- When blob versioning is enabled, a new version is created for every write or delete operation on every blob in that storage account. If you have data that may generate a large number of versions and your scenario does not require that capability, then consider storing that data in another account where versioning is not enabled.
- Use lifecycle management to delete older versions as needed to control costs and reduce latency for blob listing operations.
- For storage accounts with a hierarchical namespace enabled, use blob snapshots to capture blob data at a given point in time.

To learn how to enable blob versioning, see [Enable and manage blob versioning](versioning-enable.md).

#### Cost considerations

There is no charge to enable blob versioning for a storage account. After blob versioning is enabled, every write or delete operation on a blob in that account creates a new version. Use lifecycle management to delete older versions as needed to control costs. For more information, see [Optimize costs by automating Azure Blob Storage access tiers](storage-lifecycle-management-concepts.md).

A blob version is billed based on unique blocks or pages. Costs therefore increase as the base blob diverges from a particular version. Changing a blob or blob version's tier may have a billing impact. For more information, see [Pricing and billing](versioning-overview.md#pricing-and-billing) for blob versions.

### Configure blob soft delete for the storage account

Blob soft delete protects an individual blob, its versions, and its metadata from accidental deletion by maintaining the deleted data in the system for a specified period of time. The retention interval may be up to one year and is configured when you enable blob soft delete for the storage account. After the retention period has expired, the blob is permanently deleted.

If needed, you can restore a deleted blob or version during the retention interval by calling the Undelete Blob operation.

When a blob or version is deleted, the retention period that is currently specified for the storage account is in effect for that blob or version. The retention period countdown starts at the time that the object is deleted. If you change the retention period, that change applies only to subsequently deleted objects. It does not apply to any objects that have already been deleted.

When blob soft delete is enabled for the storage account, it protects all blobs and versions in that account with the same retention period. If you have blobs that require different retention periods, then Microsoft recommends storing them in different storage accounts. Store blobs in the same storage account only if they can all be served by the same soft delete retention period.

Blob soft delete is not currently available for Azure Data Lake Storage Gen2.

For more information about blob soft delete, see [Soft delete for blobs](soft-delete-blob-overview.md).

#### Recommendation summary

- Enable blob soft delete for all storage accounts, with a minimum retention interval of 7 days.
- Enable blob versioning and container soft delete together with blob soft delete for optimal protection of blob data. Enabling blob soft delete together with versioning provides an additional level of protection for deleted versions, and should not increase costs in most scenarios.
- Store blobs that require different retention periods in separate storage accounts.

To learn how to enable blob soft delete, see [Enable and manage soft delete for blobs](soft-delete-blob-enable.md).

#### Cost considerations

There is no charge to enable blob soft delete for a storage account. Data in soft-deleted blobs is billed at same rate as active data. You are billed for soft-deleted blobs until the retention period expires.

### Configure point-in-time restore for the storage account

Point-in-time restore is a convenient option for automatically restoring block blob data to an earlier point in time. When point-in-time restore is enabled for a storage account, you can restore sets of block blobs to their earlier state at a specified point in time. The retention interval is configured when you enable point-in-time restore for the storage account.

If you need greater control or higher precision when restoring data, or if you need to restore a container, page blob, or append blob, then Microsoft recommends restoring manually from a soft-deleted container or blob, or from a previous version of a blob.

Point-in-time restore is not currently available for Azure Data Lake Storage Gen2.

For more information about point-in-time restore, see [Point-in-time restore for block blobs](point-in-time-restore-overview.md).

#### Recommendation summary

- Use point-in-time restore to restore block blob data that has been accidentally overwritten or deleted to a specific point in the past.
- Point-in-time restore supports restoring against operations that acted on block blobs only. Any operations that acted on containers cannot be restored. For example, if you delete a container from the storage account by calling the [Delete Container](/rest/api/storageservices/delete-container) operation, that container cannot be restored with a point-in-time restore operation. Rather than deleting an entire container, delete individual blobs if you may want to restore them later.
- If you need greater control over the recovery process, then use one or more of the manual restoration options. In addition to implementing the data protection features described in this guide, consider copying data to a second storage account on a regular basis. You can use a utility like [AzCopy](../common/storage-use-azcopy-v10.md), a service like [Azure Data Factory](../../data-factory/introduction.md), or Azure Storage [object replication](object-replication-overview.md).

To learn how to enable point-in-time restore and how to perform a restore operation, see [Point-in-time restore for block blobs](point-in-time-restore-overview.md).

#### Cost considerations

There is no charge to enable point-in-time restore for a storage account. You are billed when you perform a restore operation. The cost of a restore operation and the length of time that operation will require depends on the amount of data being restored. Using a manual restore method may be more cost-effective, but it may also take more time. For more information, see [Pricing and billing](point-in-time-restore-overview.md#pricing-and-billing) for point-in-time restore.

### Take a manual snapshot of a blob

A snapshot is a read-only copy of a blob that's taken manually at a particular point in time. Blob snapshots are available for both Blob storage and Azure Data Lake Storage Gen2. For more information about blob snapshots, see [Blob snapshots](snapshots-overview.md).

Microsoft recommends enabling blob versioning when possible, because blob versions are created automatically when a blob is updated or deleted. Taking a snapshot, on the other hand, must be handled by your application logic.

#### Recommendation summary

- Use snapshots to capture blob data at a given point in time if blob versioning is not appropriate for your scenario or if your  storage account has a hierarchical namespace enabled.
- Avoid taking snapshots of data that is protected by blob versioning. Taking snapshots does not offer any additional protections to your block blob data if blob versioning is enabled, and may increase costs and application complexity.
- Use lifecycle management to delete older snapshots as needed to control costs.

To learn how to take a snapshot of a blob in .NET, see [Create and manage a blob snapshot in .NET](snapshots-manage-dotnet.md).

#### Cost considerations

Data in a snapshot is billed based on unique blocks or pages. Costs therefore increase as the base blob diverges from the snapshot. Changing a blob or snapshot's tier may have a billing impact. Use lifecycle management to delete older snapshots as needed to control costs. For more information, see [Pricing and billing](snapshots-overview.md#pricing-and-billing) for blob snapshots.

## Recover deleted or overwritten data

If you should need to recover data that was overwritten or deleted, think about each of the following questions in the context of your scenario:

- Was the storage account itself deleted?
- Was data deleted or overwritten maliciously, or by accident?
- What level of control do you require over the recovery process?
- What degree of precision does your scenario require for the recovery process?
- What costs can you incur for data recovery?

### Recover a deleted storage account

The best way to prevent a storage account from being accidentally or maliciously deleted is by applying an Azure Resource Manager lock. For more information, see [Configure an Azure Resource Manager lock on the storage account](#configure-an-azure-resource-manager-lock-on-the-storage-account).

Should a storage account be deleted, it may be recovered in some cases, either through the Azure portal or via a support ticket. To recover a deleted storage account, the following conditions must be true:

- The storage account was deleted within the past 14 days.
- The storage account was created with the Azure Resource Manager deployment model.
- A new storage account with the same name has not been created since the original account was deleted.

For more information, see [Recover a deleted storage account](../common/storage-account-recover.md).

### Recover from a malicious action

The best way to protect against malicious activity is to prevent write and delete operations altogether. However, the need to prevent malicious activity for a set of data must be balanced against the needs of clients that write to that data. If you cannot prevent write and delete operations, then consider how you can best recover in the event of a malicious act.

A good way to protect against malicious activity is to regularly copy your data to a second storage account. You can copy data by using a utility like [AzCopy](../common/storage-use-azcopy-v10.md) or a service such as [Azure Data Factory](../../data-factory/introduction.md). You can also use Azure Storage [object replication](object-replication-overview.md). Then if the data in your storage account is compromised, you can update your application to point to the endpoints for the second storage account.

While this strategy may incur additional costs, it can provide peace of mind that your data is safe. If the second storage account is located in the same region as the source storage account, then you will not be charged for data egress from the source to the copy. If you decide to locate the second storage account in a different region, then you will incur egress charges when copying data to the second account.

Point-in-time restore is a convenient way to restore data to a previous point in time, but it uses information from the same storage account to perform the restore. In the case of a malicious act, this information might also be compromised. If you don't have a second storage account that serves as a copy of your data, your best option may be try to recover your data manually by restoring soft-deleted containers and blobs or promoting a previous version of a blob to the current version.

### Recover from an accidental action

If data is accidentally overwritten or deleted, then point-in-time restore may be a good option for restoring it to a previous state. However, performing a point-in-time restore operation may be more expensive and less precise than using a manual method to recover data.

If your recovery scenario requires greater precision or you are looking for a lower-cost solution, then use a manual restore method to recover the data. To restore soft-deleted containers, call the [Restore Container](/rest/api/storageservices/restore-container) operation. To recover a deleted or overwritten blob, promote a previous blob version to be the current version, or use the [Undelete Blob](/rest/api/storageservices/undelete-blob) operation. You can also call **Undelete Blob** to restore a deleted blob version.  

## Summary of cost considerations

The following table summarizes the cost considerations for the various data protection options described in this guide.

| Data protection option | Cost considerations |
|-|-|
| Azure Resource Manager lock for a storage account | None |
| Immutability policies (time-based retention policy or legal hold for a container) | None |
| Container soft delete | No charge to enable. Data in soft-deleted containers is billed at same rate as active data. |
| Blob versioning | No charge to enable. A blob version is billed based on unique blocks or pages. Costs therefore increase as the base blob diverges from a particular version. Changing a blob or blob version's tier may have a billing impact. For more information, see [Pricing and billing](versioning-overview.md#pricing-and-billing). |
| Blob soft delete | No charge to enable. Data in soft-deleted blobs is billed at same rate as active data. |
| Point-in-time restore | No charge to enable. You are billed when you perform a restore operation. The cost of a restore operation depends on the amount of data being restored. Using a manual restore method may be more cost-effective. For more information, see [Pricing and billing](point-in-time-restore-overview.md#pricing-and-billing). |
| Blob snapshots | Data in a snapshot is billed based on unique blocks or pages. Costs therefore increase as the base blob diverges from the snapshot. Changing a blob or snapshot's tier may have a billing impact. For more information, see [Pricing and billing](snapshots-overview.md#pricing-and-billing). |
| Copy data to a second storage account | Maintaining data in a second storage account will incur capacity and transaction costs. If the second storage account is located in a different region than the source account, then copying data to that second account will additionally incur egress charges. |

## Disaster recovery

Azure Storage always maintains multiple copies of your data so that it is protected from planned and unplanned events, including transient hardware failures, network or power outages, and massive natural disasters. Redundancy ensures that your storage account meets its availability and durability targets even in the face of failures. For more information about how to configure your storage account for high availability, see [Azure Storage redundancy](../common/storage-redundancy.md).

In the event that a failure occurs in a data center, if your storage account is redundant across two geographical regions (geo-redundant), then you have the option to fail over your account from the primary region to the secondary region. For more information, see [Disaster recovery and storage account failover](../common/storage-disaster-recovery-guidance.md).

## Next steps

- [Azure Storage redundancy](../common/storage-redundancy.md)
- [Disaster recovery and storage account failover](../common/storage-disaster-recovery-guidance.md)
