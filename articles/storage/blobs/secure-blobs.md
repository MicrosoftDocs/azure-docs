---
title: Secure your Azure Blob Storage
description: Learn how to secure Azure Blob Storage, with best practices specific to blob containers, blobs, and Azure Data Lake Storage.
author: msmbaldwin
ms.author: mbaldwin
ms.service: azure-blob-storage
ms.topic: best-practice
ms.custom: horz-security
ms.date: 08/14/2026
ai-usage: ai-assisted
# Customer intent: As a developer or administrator using Azure Blob Storage, I want to implement blob-specific security best practices.
---

# Secure your Azure Blob Storage

Azure Blob Storage stores massive amounts of unstructured object data in containers. It's often the target of exfiltration, ransomware, and public-exposure incidents. This article provides security recommendations specific to blob containers, blobs, and Azure Data Lake Storage hierarchical namespaces.

> [!NOTE]
> This article covers security practices specific to Azure Blob Storage. For account-level security guidance, see [Secure your Azure Storage account](../common/secure-storage.md).

## Network security

- **Front custom domains, static websites, and any publicly served blob content with Azure Front Door**: Terminate TLS at Azure Front Door with a managed certificate, enable WAF, and restrict the storage account's public network access so that only Front Door can reach the origin. Azure Storage's own custom-domain feature doesn't support managed TLS certificates, and Front Door adds WAF protection, rate limiting, and logging that anonymous container access lacks. For more information, see [Use Azure Front Door with Azure Storage blobs](/azure/frontdoor/scenario-storage-blobs).

- **Disable the static website endpoint when not in use**: The `$web` container remains publicly readable while the static website feature is enabled, even if `allowBlobPublicAccess` is `false`. Disable the static website feature on accounts that don't need it. For more information, see [Static website hosting in Azure Storage](storage-blob-static-website.md).

## Identity and access management

### Anonymous public access

- **Disable anonymous public read access at the storage account**: Set the `allowBlobPublicAccess` property to `false` so that no container in the account can be public, regardless of container-level configuration. For more information, see [Overview: Remediating anonymous read access for blob data](anonymous-read-access-overview.md).

- **Audit and remediate any existing anonymous access**: Use the guidance in [Remediate anonymous read access to blob data](anonymous-read-access-prevent.md) to find containers that permit public access and convert them to private access or explicit SAS-based sharing.

### Blob-level SAS and ABAC

- **Prefer user-delegation SAS over service SAS for blob access**: A user-delegation shared access signature (SAS) is signed with a Microsoft Entra credential. Revoking the user delegation key immediately invalidates every SAS issued from it, providing a revocation path that service and account SAS lack. For more information, see [Create a user delegation SAS](../common/storage-sas-overview.md).

- **Scope service SAS with stored access policies for revocability**: If you must use a service SAS, associate it with a stored access policy on the container. You can then modify or delete the policy to revoke every SAS that references it. Without a policy, a service SAS can be revoked only by rotating the account keys, which affects every other SAS in the account. For more information, see [Define a stored access policy](../common/storage-stored-access-policy-define-dotnet.md).

- **Use blob index tags to condition access via ABAC**: Combine blob index tags with attribute-based access control (ABAC) conditions to grant read access only to blobs with specific tag values - for example, `Classification=Public`. This approach lets a single role assignment serve many callers without granting access to sensitive tagged data. For more information, see [Authorize access to blobs using ABAC conditions](storage-auth-abac.md).

## Data protection

- **Use blob encryption scopes to isolate encryption for specific containers or blobs**: Encryption scopes let you apply different keys or key rotation policies at container-level or blob-level granularity within a single account. This feature is useful for multitenant workloads that share an account but need per-tenant key control. For more information, see [Encryption scopes for Blob Storage](encryption-scope-overview.md).

- **Use client-side encryption for blob data that must never appear on the server in plaintext**: Encrypt blob content in the client before upload. The SDK integrates with Azure Key Vault or Managed HSM for key management. Combine with service-side CMK for layered protection. For more information, see [Client-side encryption for blobs](client-side-encryption.md).

### Immutability and WORM

- **Configure time-based retention policies for regulated data**: Apply container-level or version-level time-based retention to prevent modification or deletion of blobs for a fixed period. Version-level immutability provides finer control and you can enable or extend it on individual versions. For more information, see [Store business-critical blob data with immutable storage](immutable-storage-overview.md).

- **Use legal holds for indefinite retention driven by legal or investigative needs**: Legal holds prevent deletion until an authorized user explicitly clears the hold, with no fixed duration. For more information, see [Store business-critical blob data with immutable storage](immutable-storage-overview.md).

- **Lock retention policies to make them non-modifiable**: Users with appropriate permissions can shorten or delete an unlocked retention policy. Locking the policy makes the retention period a one-way commitment. Lock only after you validate the policy's duration. For more information, see [Configure immutability policies for containers](immutable-container-level-worm-policies.md).

### Object replication and copy operations

- **Restrict object replication to source accounts you control**: Configure the destination account's allowed source-account list so that only known, trusted source accounts can push data. For more information, see [Configure object replication](object-replication-configure.md).

- **Prevent cross-tenant object replication**: Disallow replication policies whose source and destination accounts live in different Microsoft Entra tenants. This restriction prevents an authorized user from configuring replication to an external tenant. For more information, see [Prevent object replication across Microsoft Entra tenants](object-replication-prevent-cross-tenant-policies.md).

- **Restrict permitted scope for copy operations**: Configure the account to allow copy operations only from source accounts in the same tenant or the same subscription. This configuration blocks a common exfiltration path - copying from a private account into an attacker-controlled account. For more information, see [Permitted scope for copy operations](../common/security-restrict-copy-operations.md).

## Backup and recovery

- **Enable blob versioning to preserve previous versions on write and delete**: When you enable versioning, each write or delete operation creates a new version and keeps the previous state. You can address and restore versions. For more information, see [Blob versioning](versioning-overview.md).

- **Enable soft delete for blobs and for containers**: Soft delete keeps deleted blobs and containers for a set retention period, so you can restore them during that time. Set up container-level and blob-level soft delete separately, and enable both. For more information, see [Soft delete for blobs](soft-delete-blob-overview.md) and [Soft delete for containers](soft-delete-container-overview.md).

- **Enable point-in-time restore for block blob accounts**: Point-in-time restore works with versioning and soft delete to restore a range of block blobs to a specific past timestamp. This feature is helpful for ransomware recovery. Point-in-time restore requires that you enable versioning, blob soft delete, and change feed. For more information, see [Point-in-time restore for block blobs](point-in-time-restore-overview.md).

- **Enable the change feed for audit and forensics**: The change feed is an ordered, unchangeable log of every change to blobs in the account. Besides enabling point-in-time restore, it provides a durable audit record for investigations. For more information, see [Change feed support in Azure Blob Storage](storage-blob-change-feed.md).

## Azure Data Lake Storage

Data Lake Storage adds a hierarchical namespace and POSIX-like access control lists (ACLs) to Blob Storage. ACLs and RBAC work together - grant coarse access through RBAC and refine within the file system with ACLs.

- **Use RBAC for coarse-grained access and ACLs for fine-grained access**: Assign built-in blob RBAC roles at the container or account level to grant broad access. Then, use ACLs on directories and files to restrict access within the container. Don't use ACLs alone for permissions a user needs across an entire container. RBAC is more efficient to evaluate and audit. For more information, see [Access control model in Azure Data Lake Storage](data-lake-storage-access-control-model.md).

- **Apply default ACLs on directories to inherit permissions on new child items**: Default ACLs apply to files and directories created after you set the ACL. Set them at the directory level to avoid managing ACLs on individual files. For more information, see [Access control lists in Azure Data Lake Storage](data-lake-storage-access-control.md).

- **Enable the hierarchical namespace at account creation**: You can't enable the hierarchical namespace on an existing account without migration. If you know a workload uses Data Lake Storage semantics, enable it up front rather than migrating later. For more information, see [Azure Data Lake Storage hierarchical namespace](data-lake-storage-namespace.md).

## Logging and monitoring

- **Alert on anonymous access hits after you disable anonymous access**: When you set `allowBlobPublicAccess` to `false`, filter storage logs for `AuthenticationType == "Anonymous"` and alert on any hits. These hits indicate either a misconfigured client or a probing attempt. For more information, see [Monitor Azure Storage](/azure/storage/blobs/monitor-blob-storage).

- **Enable and act on Defender for Storage malware-scan verdicts**: When you enable malware scanning, configure automated response (blob deletion, quarantine tag, or downstream workflow suppression) on `MalwareScanningResult` verdicts so that identified malicious blobs can't be served to consumers. For more information, see [Respond to Malware Scanning results in Defender for Storage](/azure/defender-for-cloud/defender-for-storage-configure-malware-scan).

- **Track blob index tag mutations for classification drift**: If you use blob index tags to drive ABAC access conditions, changes to those tags directly change who can read the blob. Log and alert on `SetBlobTags` operations against sensitive containers. For more information, see [Manage and find data on Azure Blob Storage with blob index tags](../blobs/storage-blob-index-how-to.md).

## Related security articles

- [Secure your Azure Storage account](../common/secure-storage.md) - Cross-cutting Azure Storage security guidance.
- [Secure your Azure Files](../files/secure-files.md) - File share security.
- [Secure your Azure Queue Storage](../queues/secure-queues.md) - Queue-specific security.
- [Secure your Azure Table Storage](../tables/secure-tables.md) - Table-specific security.

## Next steps

- [Well-Architected Framework: Azure Blob Storage service guide](/azure/well-architected/service-guides/azure-blob-storage)
- [Introduction to Azure Blob Storage](storage-blobs-introduction.md)
- [Authorize access to blobs using Microsoft Entra ID](authorize-access-azure-active-directory.md)
- [Azure Blob Storage monitoring data reference](monitor-blob-storage-reference.md)
