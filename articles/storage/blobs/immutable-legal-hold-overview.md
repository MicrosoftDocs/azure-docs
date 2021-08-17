---
title: Legal holds for immutable blob data 
titleSuffix: Azure Storage
description: A legal hold stores blob data in a Write-Once, Read-Many (WORM) format until it is explicitly cleared. Use a legal hold when the period of time that the data must be kept in a WORM state is unknown.
services: storage
author: tamram

ms.service: storage
ms.topic: conceptual
ms.date: 07/22/2021
ms.author: tamram
ms.subservice: blobs
---

# Legal holds for immutable blob data

A legal hold is a temporary immutability policy that can be applied for legal investigation purposes or general protection policies. A legal hold stores blob data in a Write-Once, Read-Many (WORM) format until it is explicitly cleared. When a legal hold is in effect, blobs can be created and read, but not modified or deleted. Use a legal hold when the period of time that the data must be kept in a WORM state is unknown.

For more information about immutability policies for Blob Storage, see [Store business-critical blob data with immutable storage](immutable-storage-overview.md).

## Legal hold scope

A legal hold policy can be configured at either of the following scopes:

- Version-level policy (preview): A legal hold can be configured on an individual blob version level for granular management of sensitive data.
- Container-level policy: A legal hold that is configured at the container level applies to all blobs in that container. Individual blobs cannot be configured with their own immutability policies.

### Version-level policy scope (preview)

To configure a legal hold on a blob version, you must first enable version-level immutability on the parent container. Version-level immutability cannot be disabled after it is enabled. For more information, see [Enable support for version-level immutability on a container](immutable-policy-configure-version-scope.md#enable-support-for-version-level-immutability-on-a-container).

After version-level immutability is enabled for a container, a legal hold can no longer be set at the container level. Legal holds must be applied to individual blob versions. A legal hold may be configured for the current version or a previous version of a blob.

Version-level legal hold policies require that blob versioning is enabled for the storage account. To learn how to enable blob versioning, see [Enable and manage blob versioning](versioning-enable.md). Keep in mind that enabling versioning may have a billing impact. For more information, see the **Pricing and billing** section in [Blob versioning](versioning-overview.md#pricing-and-billing).

To learn more about enabling a version-level legal hold, see [Configure or clear a legal hold](immutable-policy-configure-version-scope.md#configure-or-clear-a-legal-hold).

### Container-level scope

When you configure a legal hold for a container, that hold applies to all objects in the container. When the legal hold is cleared, clients can once again write and delete objects in the container, unless there is also a time-based retention policy in effect for the container.

When a legal hold is applied to a container, all existing blobs move into an immutable WORM state in less than 30 seconds. All new blobs that are uploaded to that policy-protected container will also move into an immutable state. Once all blobs are in an immutable state, overwrite or delete operations in the immutable container are not allowed. In the case of an account with a hierarchical namespace, blobs cannot be renamed or moved to a different directory.

To learn how to configure a legal hold with container-level scope, see [Configure or clear a legal hold](immutable-policy-configure-container-scope.md#configure-or-clear-a-legal-hold).

#### Legal hold tags

A container-level legal hold must be associated with one or more user-defined alphanumeric tags that serve as identifier strings. For example, a tag may include a case ID or event name.

#### Audit logging

Each container with a legal hold in effect provides a policy audit log.  the log contains the user ID, command type, time stamps, and legal hold tags. The audit log is retained for the lifetime of the policy, in accordance with the SEC 17a-4(f) regulatory guidelines.

The [Azure Activity log](../../azure-monitor/essentials/platform-logs-overview.md) provides a more comprehensive log of all management service activities. [Azure resource logs](../../azure-monitor/essentials/platform-logs-overview.md) retain information about data operations. It is the user's responsibility to store those logs persistently, as might be required for regulatory or other purposes.

#### Limits

The following limits apply to container-level legal holds:

- For a storage account, the maximum number of containers with a legal hold setting is 10,000.
- For a container, the maximum number of legal hold tags is ten.
- The minimum length of a legal hold tag is three alphanumeric characters. The maximum length is 23 alphanumeric characters.
- For a container, a maximum of ten legal hold policy audit logs are retained for the duration of the policy.

## Next steps

- [Data protection overview](data-protection-overview.md)
- [Store business-critical blob data with immutable storage](immutable-storage-overview.md)
- [Time-based retention policies for immutable blob data](immutable-time-based-retention-policy-overview.md)
- [Configure immutability policies for blob versions (preview)](immutable-policy-configure-version-scope.md)
- [Configure immutability policies for containers](immutable-policy-configure-container-scope.md)
