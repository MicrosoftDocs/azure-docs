---
title: Time-based retention policies for immutable blob data
titleSuffix: Azure Storage
description: Time-based retention policies store blob data in a Write-Once, Read-Many (WORM) state for a specified interval. You can configure a time-based retention policy that is scoped to a blob version or to a container.
services: storage
author: normesta

ms.service: azure-blob-storage
ms.topic: conceptual
ms.date: 09/14/2022
ms.author: normesta
---

# Time-based retention policies for immutable blob data

A time-based retention policy stores blob data in a Write-Once, Read-Many (WORM) format for a specified interval. When a time-based retention policy is set, clients can create and read blobs, but can't modify or delete them. After the retention interval has expired, blobs can be deleted but not overwritten.

For more information about immutability policies for Blob Storage, see [Store business-critical blob data with immutable storage](immutable-storage-overview.md).

## Retention interval for a time-based policy

The minimum retention interval for a time-based retention policy is one day, and the maximum is 146,000 days (400 years).

When you configure a time-based retention policy, the affected objects will stay in the immutable state during the *effective* retention period. The effective retention period for objects is equal to the difference between the blob's creation time and the user-specified retention interval. Because a policy's retention interval can be extended, immutable storage uses the most recent value of the user-specified retention interval to calculate the effective retention period.

For example, suppose that a user creates a time-based retention policy with a retention interval of five years. An existing blob in that container, *testblob1*, was created one year ago, so the effective retention period for *testblob1* is four years. When a new blob, *testblob2*, is uploaded to the container, the effective retention period for *testblob2* is five years from the time of its creation.

## Locked versus unlocked policies

When you first configure a time-based retention policy, the policy is unlocked for testing purposes. When you have finished testing, you can lock the policy so that it's fully compliant with SEC 17a-4(f) and other regulatory compliance.

Both locked and unlocked policies protect against deletes and overwrites. However, you can modify an unlocked policy by shortening or extending the retention period. You can also delete an unlocked policy.

You can't delete a locked time-based retention policy. You can extend the retention period, but you can't decrease it. A maximum of five increases to the effective retention period is allowed over the lifetime of a locked policy that is defined at the container level. For a policy configured for a blob version, there's no limit to the number of increases to the effective period.

> [!IMPORTANT]
> A time-based retention policy must be locked for the blob to be in a compliant immutable (write and delete protected) state for SEC 17a-4(f) and other regulatory compliance. Microsoft recommends that you lock the policy in a reasonable amount of time, typically less than 24 hours. While the unlocked state provides immutability protection, using the unlocked state for any purpose other than short-term testing is not recommended.

## Time-based retention policy scope

A time-based retention policy can be configured at either of the following scopes:

- Version-level policy: A time-based retention policy can be configured to apply to a blob version for granular management of sensitive data. You can apply the policy to an individual version, or configure a default policy for a storage account or individual container that will apply by default to all blobs uploaded to that account or container.
- Container-level policy: A time-based retention policy that is configured at the container level applies to all objects in that container. Individual objects can't be configured with their own immutability policies.

Audit logs are available on the container for both version-level and container-level time-based retention policies. Audit logs aren't available for a policy that is scoped to a blob version.

### Version-level policy scope

To configure version-level retention policies, you must first enable version-level immutability on the storage account or parent container. Version-level immutability can't be disabled after it's enabled, although unlocked policies can be deleted. For more information, see [Enable support for version-level immutability](immutable-policy-configure-version-scope.md#enable-support-for-version-level-immutability).

Version-level immutability on the storage account must be enabled when you create the account. When you enable version-level immutability for a new storage account, all containers later created in that account automatically support version-level immutability. It's not possible to disable support for version-level immutability on a storage account after you've enabled it, nor is it possible to create a container without version-level immutability support when it's enabled for the account.

If you haven't enabled support for version-level immutability on the storage account, then you can enable support for version-level immutability on an individual container at the time that you create the container. Existing containers can also support version-level immutability, but must undergo a migration process first. This process may take some time and isn't reversible. You can migrate 10 containers at a time per storage account. For more information about migrating a container to support version-level immutability, see [Migrate an existing container to support version-level immutability](immutable-policy-configure-version-scope.md#migrate-an-existing-container-to-support-version-level-immutability).

Version-level time-based retention policies require that [blob versioning](versioning-overview.md) is enabled for the storage account. To learn how to enable blob versioning, see [Enable and manage blob versioning](versioning-enable.md). Keep in mind that enabling versioning may have a billing impact. For more information, see the **Pricing and billing** section in [Blob versioning](versioning-overview.md#pricing-and-billing).

After versioning is enabled, when a blob is first uploaded, that version of the blob is the current version. Each time the blob is overwritten, a new version is created that stores the previous state of the blob. When you delete the current version of a blob, the current version becomes a previous version and is retained until explicitly deleted. A previous blob version possesses the time-based retention policy that was in effect when the current version became a previous version.

If a default policy is in effect for the storage account or container, then when an overwrite operation creates a previous version, the new current version inherits the default policy for the account or container.

Each version may have only one time-based retention policy configured. A version may also have one legal hold configured. For more information about supported immutability policy configurations based on scope, see [Immutability policy scope](immutable-storage-overview.md#immutability-policy-scope).

To learn how to configure version-level time-based retention policies, see [Configure immutability policies for blob versions](immutable-policy-configure-version-scope.md).

#### Configure a policy on the current version

After you enable support for version-level immutability for a storage account or container, then you have the option to configure a default time-based retention policy for the account or container. When you configure a default time-based retention policy for the account or container and then upload a blob, the blob inherits that default policy. You can also choose to override the default policy for any blob on upload by configuring a custom policy for that blob.

If the default time-based retention policy for the account or container is unlocked, then the current version of a blob that inherits the default policy will also have an unlocked policy. After an individual blob is uploaded, you can shorten or extend the retention period for the policy on the current version of the blob, or delete the current version. You can also lock the policy for the current version, even if the default policy on the account or container remains unlocked.

If the default time-based retention policy for the account or container is locked, then the current version of a blob that inherits the default policy will also have a locked policy. However, if you override the default policy when you upload a blob by setting a policy only for that blob, then that blob's policy will remain unlocked until you explicitly lock it. When the policy on the current version is locked, you can extend the retention interval, but you can't delete the policy or shorten the retention interval.

If there's no default policy configured for either the storage account or the container, then you can upload a blob either with a custom policy or with no policy.

If the default policy on a storage account or container is modified, policies on objects within that container remain unchanged, even if those policies were inherited from the default policy.

The following table shows the various options available for setting a time-based retention policy on a blob on upload:

| Default policy status on account or container | Upload a blob with the default policy | Upload a blob with a custom policy | Upload a blob with no policy |
|--|--|--|--|
| Default policy on account or container (unlocked) | Blob is uploaded with default unlocked policy | Blob is uploaded with custom unlocked policy | Blob is uploaded with no policy |
| Default policy on account or container (locked) | Blob is uploaded with default locked policy | Blob is uploaded with custom unlocked policy | Blob is uploaded with no policy |
| No default policy on either account or container | N/A | Blob is uploaded with custom unlocked policy | Blob is uploaded with no policy |

#### Configure a policy on a previous version

When versioning is enabled, a write or delete operation to a blob creates a new previous version of that blob that saves the blob's state before the operation. By default, a previous version possesses the time-based retention policy that was in effect for the current version, if any, when the current version became a previous version. The new current version inherits the policy on the container, if there's one.

If the policy inherited by a previous version is unlocked, then the retention interval can be shortened or lengthened, or the policy can be deleted. The policy on a previous version can also be locked for that version, even if the policy on the current version is unlocked.

If the policy inherited by a previous version is locked, then the retention interval can be lengthened. The policy can't be deleted, nor can the retention interval be shortened.

If there's no policy configured on the current version, then the previous version doesn't inherit any policy. You can configure a custom policy for the version.

If the policy on a current version is modified, the policies on existing previous versions remain unchanged, even if the policy was inherited from a current version.

### Container-level policy scope

A container-level time-based retention policy applies to all objects in a container, both new and existing. For an account with a hierarchical namespace, a container-level policy also applies to all directories in the container.

When a time-based retention policy is applied to a container, all existing blobs move into an immutable WORM state in less than 30 seconds. All new blobs that are uploaded to that policy-protected container will also move into an immutable state. Once all blobs are in an immutable state, overwrite or delete operations in the immutable container aren't allowed. In the case of an account with a hierarchical namespace, blobs can't be renamed or moved to a different directory.

The following limits apply to container-level retention policies:

- For a storage account, the maximum number of containers with locked time-based immutable policies is 10,000.
- For a container, the maximum number of edits to extend the retention interval for a locked time-based policy is five.
- For a container, a maximum of seven time-based retention policy audit logs are retained for a locked policy.

To learn how to configure a time-based retention policy on a container, see [Configure immutability policies for containers](immutable-policy-configure-container-scope.md).

## Allow protected append blobs writes

Append blobs are composed of blocks of data and optimized for data append operations required by auditing and logging scenarios. By design, append blobs only allow the addition of new blocks to the end of the blob. Regardless of immutability, modification or deletion of existing blocks in an append blob is fundamentally not allowed. To learn more about append blobs, see [About Append Blobs](/rest/api/storageservices/understanding-block-blobs--append-blobs--and-page-blobs#about-append-blobs).

The **AllowProtectedAppendWrites** property setting allows for writing new blocks to an append blob while maintaining immutability protection and compliance. If this setting is enabled, you can create an append blob directly in the policy-protected container, and then continue to add new blocks of data to the end of the append blob with the Append Block operation. Only new blocks can be added; any existing blocks can't be modified or deleted. Enabling this setting doesn't affect the immutability behavior of block blobs or page blobs. 

The **AllowProtectedAppendWritesAll** property setting provides the same permissions as the **AllowProtectedAppendWrites** property and adds the ability to write new blocks to a block blob. The Blob Storage API doesn't provide a way for applications to do this directly. However, applications can accomplish this by using append and flush methods that are available in the Data Lake Storage Gen2 API. Also, this property enables Microsoft applications such as Azure Data Factory to append blocks of data by using internal APIs. If your workloads depend on any of these tools, then you can use this property to avoid errors that can appear when those tools attempt to append data to blobs.

> [!NOTE]
> This property is available only for container-level policies. This property is not available for version-level policies.

Append blobs remain in the immutable state during the *effective* retention period. Since new data can be appended beyond the initial creation of the append blob, there's a slight difference in how the retention period is determined. The effective retention is the difference between append blob's last modification time and the user-specified retention interval. Similarly, when the retention interval is extended, immutable storage uses the most recent value of the user-specified retention interval to calculate the effective retention period.

For example, suppose that a user creates a time-based retention policy with the **AllowProtectedAppendWrites** property enabled and a retention interval of 90 days. An append blob, *logblob1*, is created in the container today, new logs continue to be added to the append blob for the next 10 days, so that the effective retention period for *logblob1* is 100 days from today (the time of its last append + 90 days).

Unlocked time-based retention policies allow the **AllowProtectedAppendWrites** and the **AllowProtectedAppendWritesAll** property settings to be enabled and disabled at any time. Once the time-based retention policy is locked, the **AllowProtectedAppendWrites** and the **AllowProtectedAppendWritesAll** property settings can't be changed.

## Audit logging

Each container with a time-based retention policy enabled provides a policy audit log. The audit log includes up to seven time-based retention commands for locked time-based retention policies. Log entries include the user ID, command type, time stamps, and retention interval. The audit log is retained for the lifetime of the policy, in accordance with the SEC 17a-4(f) regulatory guidelines.

The [Azure Activity log](../../azure-monitor/essentials/platform-logs-overview.md) provides a more comprehensive log of all management service activities. [Azure resource logs](../../azure-monitor/essentials/platform-logs-overview.md) retain information about data operations. It's the user's responsibility to store those logs persistently, as might be required for regulatory or other purposes.

Changes to time-based retention policies at the version level aren't audited.

## Next steps

- [Data protection overview](data-protection-overview.md)
- [Store business-critical blob data with immutable storage](immutable-storage-overview.md)
- [Legal holds for immutable blob data](immutable-legal-hold-overview.md)
- [Configure immutability policies for blob versions](immutable-policy-configure-version-scope.md)
- [Configure immutability policies for containers](immutable-policy-configure-container-scope.md)
