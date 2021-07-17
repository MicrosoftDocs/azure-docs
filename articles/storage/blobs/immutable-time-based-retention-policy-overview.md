---
title: Time-based retention policies for immutable blob data 
titleSuffix: Azure Storage
description: Azure Storage offers WORM (Write Once, Read Many) support for Blob (object) storage that enables users to store data in a non-erasable, non-modifiable state for a specified interval. Learn how to create time-based retention policies.
services: storage
author: tamram

ms.service: storage
ms.topic: conceptual
ms.date: 07/17/2021
ms.author: tamram
ms.subservice: blobs
---

# Time-based retention policies for immutable blob data

You can configure a time-based retention policy to store data in a Write-Once, Read-Many (WORM) format for a specified interval. When a time-based retention policy is set, blobs can be created and read, but not modified or deleted. After the retention interval has expired, blobs can be deleted but not overwritten.

For more information about immutability policies for Blob Storage, see [Store business-critical blob data with immutable storage](immutable-storage-overview.md).

## Retention interval for a time-based policy

The minimum retention interval for a time-based retention policy is one day, and the maximum is 146,000 days (400 years).

When you configure a time-based retention policy, the affected objects will stay in the immutable state for the duration of the *effective* retention period. The effective retention period for objects is equal to the difference between the blob's creation time and the user-specified retention interval. Because a policy's retention interval can be extended, immutable storage uses the most recent value of the user-specified retention interval to calculate the effective retention period.

For example, suppose that a user creates a time-based retention policy with a retention interval of five years. An existing blob in that container, _testblob1_, was created one year ago, so the effective retention period for _testblob1_ is four years. When a new blob, _testblob2_, is uploaded to the container, the effective retention period for _testblob2_ is five years from the time of its creation.

## Locked versus unlocked policies

When you first configure a time-based retention policy, the policy is unlocked for testing purposes. When you have finished testing, you can lock the policy so that it is fully compliant with SEC 17a-4(f) and other regulatory compliance.

Both locked and unlocked policies protect against deletes and overwrites. However, you can modify an unlocked policy by shortening or extending the retention period. You can also delete an unlocked policy.

You cannot delete a locked time-based retention policy. You can extend the retention period, but you cannot decrease it. A maximum of five increases to the effective retention period is allowed over the lifetime of the policy.

> [!IMPORTANT]
> A time-based retention policy must be locked for the blob to be in a compliant immutable (write and delete protected) state for SEC 17a-4(f) and other regulatory compliance. Microsoft recommends that you lock the policy in a reasonable amount of time, typically less than 24 hours. While the unlocked state provides immutability protection, using the unlocked state for any purpose other than short-term testing is not recommended.

## Audit logging

Each container with a time-based retention policy enabled provides a policy audit log. The audit log includes up to seven time-based retention commands for locked time-based retention policies. Log entries include the user ID, command type, time stamps, and retention interval. The audit log is retained for the lifetime of the policy, in accordance with the SEC 17a-4(f) regulatory guidelines.

The [Azure Activity Log](../../azure-monitor/essentials/platform-logs-overview.md) provides a more comprehensive log of all management service activities. [Azure Resource Logs](../../azure-monitor/essentials/platform-logs-overview.md) retain information about data operations. It is the user's responsibility to store those logs persistently, as might be required for regulatory or other purposes.

## Policy scope

A time-based retention policy can be configured at either of the following scopes:

- Version-level policy (preview): A time-based retention policy can be configured to apply to a blob version for granular management of sensitive data. You can apply the policy to an individual version, or configure a default policy for a container that will apply by default to all blobs uploaded to that container.
- Container-level policy: A time-based retention policy that is configured at the container level applies to all blobs in that container. Individual blobs cannot be configured with their own policies.

Audit logs are available on the container for both version-level and container-level time-based retention policies.

### Version-level policy (preview)

An version-level time-based retention policy can be applied to an individual blob version. The policy can be applied to the current version of a blob or to a previous version. The current version of a blob can have its own time-based retention policy, or it can inherit a policy from its parent container. Similarly, previous versions of a blob can have their own time-based retention policies, or can inherit a policy from the current version.

Version-level time-based retention policies require that blob versioning is enabled for the storage account. To learn how to enable blob versioning, see [Enable and manage blob versioning](versioning-enable.md). Keep in mind that enabling versioning may have a billing impact. For more information, see the **Pricing and billing** section in [Blob versioning](versioning-overview.md#pricing-and-billing).

When versioning is enabled, then when a blob is first uploaded, that version of the blob is the current version. Each time the blob is overwritten, a new version is created that stores the previous state of the blob. A previous blob version may inherit a time-based retention policy from the current version, or you can configure a custom retention policy for that version. Each version may have only a single time-based retention policy configured.

To configure version-level retention policies, you must first enable version-level immutability on the parent container. Version-level immutability can be easily enabled at create time for a new container. Version-level immutability cannot be disabled after it is enabled, although locked policies can be deleted.

Existing containers must be migrated to support version-level immutability. This process may take some time and is not reversible. To learn more about how to migrate a container to support version-level immutability, see [Configure time-based retention policies for blob data](immutable-time-based-retention-policy-configure.md).

> [!IMPORTANT]
> Version-level time-based retention policies are currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
> It may take up to 30 seconds after version-level immutability is enabled before you can configure version-level time-based retention policies

#### Configure a policy on the current version

After you enable the feature for a container, you have the option to configure a default time-based retention policy for the container. When you configure a default time-based retention policy for the container and upload a blob, the blob inherits that policy by default. You can also choose to override the default policy for any blob on upload by configuring a custom policy for that blob.

If the default time-based retention policy for the container is unlocked, then the current version of a blob that inherits the default policy will also have an unlocked policy. After an individual blob is uploaded, you can shorten or extend the retention period for the policy on the current version of the blob, or delete the current version. You can also lock the policy for the current version, even if the default policy on the container remains unlocked.

If the default time-based retention policy for the container is locked, then the current version of a blob that inherits the default policy will also have an locked policy. However, if you override the default policy when you upload a blob by setting a policy only for that blob, then that blob's policy will remain unlocked until you explicitly lock it. When the policy on the current version is locked, you can extend the retention interval, but you cannot delete the policy or shorten the retention interval.

If there is no default policy configured for a container, then you can upload a blob either with a custom policy or with no policy.

If the default policy on a container is modified, then the policies on objects within that container remain unchanged, even if those policies were inherited from the default policy.

The following table shows the various options available for setting a time-based retention policy on a blob on upload:

| Default policy status on container | Upload a blob with the default policy | Upload a blob with a custom policy | Upload a blob with no policy |
|--|--|--|--|
| Default policy on container (unlocked) | Blob is uploaded with default unlocked policy | Blob is uploaded with custom unlocked policy | Blob is uploaded with no policy |
| Default policy on container (locked) | Blob is uploaded with default locked policy | Blob is uploaded with custom unlocked policy | Blob is uploaded with no policy |
| No default policy on container | N/A | Blob is uploaded with custom unlocked policy | Blob is uploaded with no policy |

#### Configure a policy on a previous version

When versioning is enabled, a write operation to a blob creates a new previous version of that blob that saves the blob's state before the write. By default, a previous version inherits the time-based retention policy on the current version, if there is one. The current version inherits the policy on the container, if there is one.

If the policy inherited by a previous version is unlocked, then the retention interval can be shortened or lengthened, or the policy can be deleted. The policy on a previous version can also be locked for that version, even if the policy on the current version is unlocked.

If the policy inherited by a previous version is locked, then the retention interval can be lengthened. The policy cannot be deleted, nor can the retention interval be shortened.

If there is no policy configured on the current version, then the previous version does not inherit any policy. You can configure a custom policy for the version.  

If the policy on a current version is modified, the policies on existing previous versions remain unchanged, even if the policy was inherited from a current version.

### Container-level policy

A container-level time-based retention policy applies to all objects in a container, both new and existing. For an account with a hierarchical namespace, a container-level policy also applies to all directories in the container.

When a time-based retention policy or legal hold is applied on a container, all existing blobs move into an immutable WORM state in less than 30 seconds. All new blobs that are uploaded to that policy-protected container will also move into an immutable state. Once all blobs are in an immutable state, overwrite or delete operations in the immutable container are not allowed. In the case of an account with a hierarchical namespace, blobs cannot be renamed or moved to a different directory.

The following limits apply to container-level retention policies:

- For a storage account, the maximum number of containers with locked time-based immutable policies is 10,000.
- For a container, the maximum number of edits to extend the retention interval for a locked time-based policy is five.
- For a container, a maximum of seven time-based retention policy audit logs are retained for a locked policy.

## Allow protected append blobs writes

Append blobs are comprised of blocks of data and optimized for data append operations required by auditing and logging scenarios. By design, append blobs only allow the addition of new blocks to the end of the blob. Regardless of immutability, modification or deletion of existing blocks in an append blob is fundamentally not allowed. To learn more about append blobs, see [About Append Blobs](/rest/api/storageservices/understanding-block-blobs--append-blobs--and-page-blobs#about-append-blobs).

Only time-based retention policies have an the **AllowProtectedAppendWrites** property setting that allows for writing new blocks to an append blob while maintaining immutability protection and compliance. If this setting is enabled, you can create an append blob directly in the policy-protected container and then continue to add new blocks of data to the end of the append blob with the Append Block operation. Only new blocks can be added; any existing blocks cannot be modified or deleted. Time-retention immutability protection still applies, preventing deletion of the append blob until the effective retention period has elapsed. Enabling this setting does not affect the immutability behavior of block blobs or page blobs.

As this setting is part of a time-based retention policy, the append blobs remain in the immutable state for the duration of the *effective* retention period. Since new data can be appended beyond the initial creation of the append blob, there is a slight difference in how the retention period is determined. The effective retention is the difference between append blob's last modification time and the user-specified retention interval. Similarly, when the retention interval is extended, immutable storage uses the most recent value of the user-specified retention interval to calculate the effective retention period.

For example, suppose that a user creates a time-based retention policy with the **AllowProtectedAppendWrites** property enabled and a retention interval of 90 days. An append blob, _logblob1_, is created in the container today, new logs continue to be added to the append blob for the next 10 days, so that the effective retention period for _logblob1_ is 100 days from today (the time of its last append + 90 days).

Unlocked time-based retention policies allow the the **AllowProtectedAppendWrites** property setting to be enabled and disabled at any time. Once the time-based retention policy is locked, the **AllowProtectedAppendWrites** property setting cannot be changed.

## Next steps

- [Store business-critical blob data with immutable storage](immutable-storage-overview.md)
- [Legal holds for immutable blob data](immutable-legal-hold-overview.md)
