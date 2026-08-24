---
title: Secure your Azure Files
description: Learn how to secure Azure Files, with best practices specific to file shares, SMB and NFS protocols, and identity-based access.
author: msmbaldwin
ms.author: mbaldwin
ms.service: azure-file-storage
ms.topic: best-practice
ms.custom: horz-security
ms.date: 08/19/2026
ai-usage: ai-assisted
# Customer intent: As an administrator using Azure Files, I want to implement file-share-specific security best practices.
---

# Secure your Azure Files

Azure Files provides fully managed SMB and NFS file shares in the cloud. Because file shares are typically mounted directly by end-user workstations, application servers, and hybrid workloads, they demand strong identity-based authentication, protocol-level protection, and share-scoped authorization.

> [!NOTE]
> This article covers security practices specific to Azure Files. For account-level security guidance, see [Secure your Azure Storage account](../common/secure-storage.md).

## Network security

### SMB protocol hardening

- **Require SMB channel encryption**: Configure the file share's SMB security settings to require encrypted SMB 3.x connections and reject unencrypted SMB 2.x. This protects data in transit at the protocol level, in addition to the account's HTTPS requirement. For more information, see [SMB security settings for Azure file shares](../files/files-smb-protocol.md).

- **Restrict permitted SMB versions and authentication mechanisms**: Disable NTLMv2 in favor of Kerberos, and disable SMB 2.1 in favor of SMB 3.1.1. Older versions lack modern encryption and integrity protection. For more information, see [SMB security settings for Azure file shares](../files/files-smb-protocol.md).

- **Require AES-256 Kerberos ticket encryption**: In the file share's SMB security settings, restrict Kerberos ticket encryption to AES-256 and disallow RC4-HMAC. RC4-HMAC is deprecated and vulnerable to known attacks. For more information, see [SMB security settings for Azure file shares](../files/files-smb-protocol.md).

- **Reset the storage account's Kerberos key on a defined cadence**: When AD DS or Entra Kerberos authentication is enabled, the storage account maintains a Kerberos key that authenticates the account to the directory. Rotate the key periodically and after any suspected compromise of directory admin credentials. For more information, see [Update the password of your storage account identity in AD DS](../files/storage-files-identity-ad-ds-update-password.md).

### NFS 4.1 file shares

- **Restrict NFS shares to private endpoints or service endpoints**: NFS 4.1 shares don't support internet clients and require a private connection from a virtual network. Configure a private endpoint and disable the account's public network access. For more information, see [Azure Files networking overview](../files/storage-files-networking-overview.md).

- **Configure root squash to limit client privileges**: NFS root squash maps root operations from mounting clients to a less-privileged UID/GID, reducing the impact of a compromised client. For more information, see [Root squashing for NFS Azure file shares](../files/nfs-root-squash.md).

- **Encrypt NFS traffic in transit**: Configure encryption in transit for NFS file shares to protect data as it moves between the client and the file share. For more information, see [Encryption in transit for NFS Azure file shares](../files/encryption-in-transit-for-nfs-shares.md).

## Identity and access management

### Identity-based authentication for SMB file shares

Storage account keys grant unrestricted access to every share in an account. For SMB shares, use identity-based authentication so that access is authorized by a directory identity, not by a shared secret.

- **Use Microsoft Entra Kerberos for hybrid users accessing SMB shares from Entra-joined clients**: Microsoft Entra Kerberos supports hybrid identities and doesn't require line-of-sight to a domain controller from the client. Prefer it for cloud-first and hybrid environments. For more information, see [Enable Microsoft Entra Kerberos authentication for hybrid identities on Azure Files](../files/storage-files-identity-auth-hybrid-identities-enable.md).

- **Use on-premises Active Directory Domain Services for domain-joined workloads**: When clients are already domain-joined to on-premises AD DS, integrate Azure Files directly with AD DS so users authenticate with their existing corporate identities. For more information, see [Enable AD DS authentication for Azure file shares](../files/storage-files-identity-ad-ds-enable.md).

- **Use Microsoft Entra Domain Services when no on-premises directory exists**: Entra Domain Services provides a fully managed domain in Azure for cloud-only workloads that need Kerberos-based SMB authentication. For more information, see [Enable Microsoft Entra Domain Services authentication on Azure Files](../files/storage-files-identity-auth-domain-services-enable.md).

- **Don't use storage account keys as a substitute for identity-based authentication**: Account keys can't be scoped to a user, share, directory, or file, and can't be logged as a specific identity. Reserve keys for administrative scenarios (share creation, permission bootstrap) and disable them for data-plane use where possible.

### Share-level and NTFS permissions

- **Assign share-level RBAC roles at the smallest reasonable scope**: Use the built-in **Storage File Data SMB Share Reader**, **Contributor**, and **Elevated Contributor** roles at the specific file share (not the storage account) so that a role assignment on one share doesn't leak to another. For more information, see [Assign share-level permissions to an identity](../files/storage-files-identity-assign-share-level-permissions.md).

- **Configure NTFS permissions on directories and files, not on the share root**: After granting share-level access with RBAC, restrict which files and directories users can read or modify with standard NTFS ACLs. Set ACLs on directories with inheritance rather than on every file. For more information, see [Configure directory and file-level permissions over SMB](../files/storage-files-identity-configure-file-level-permissions.md).

- **Reserve the elevated contributor role for administrative accounts**: **Storage File Data SMB Share Elevated Contributor** grants the ability to modify NTFS ACLs. Restrict it to identities that manage share permissions.

## Backup and recovery

- **Enable soft delete for file shares**: Soft delete retains deleted shares for a configurable retention period, protecting against accidental or malicious share deletion. Soft delete for shares works alongside share snapshots for file-level recovery. For more information, see [Prevent accidental deletion of Azure file shares](../files/storage-files-prevent-file-share-deletion.md).

- **Take share snapshots on a defined schedule**: Share snapshots capture the state of a share at a point in time and let users restore individual files without a full share restore. Automate snapshots with Azure Backup or a runbook. For more information, see [Overview of share snapshots for Azure Files](../files/storage-snapshots-files.md).

- **Use Azure Backup for centrally managed file-share recovery**: Azure Backup adds centralized policy, alerting, and long-term retention on top of share snapshots, plus separation of duties between backup operators and share administrators. For more information, see [About Azure file share backup](/azure/backup/azure-file-share-backup-overview).

## Logging and monitoring

- **Alert on failed identity-based authentication and NTLM attempts**: When identity-based authentication is enabled, log and alert on Kerberos preauth failures and any NTLM attempts (especially after NTLMv2 is disabled). Unexpected NTLM traffic is a signal that a client isn't properly domain-configured or that account keys are being used where identity should be. For more information, see [Monitor Azure Files](../files/storage-files-monitoring.md).

- **Alert on storage-account-key mount attempts against identity-enabled shares**: After identity-based authentication is the intended path, shared-key mounts represent a bypass. Query storage logs for `AuthenticationType == "AccountKey"` on file share endpoints and alert on any hits. For more information, see [Monitor Azure Files](../files/storage-files-monitoring.md).

- **Audit Kerberos key rotation events on the storage account identity**: Successful rotations should be planned and expected. Unplanned rotations might indicate credential compromise response by a different admin. Log key-rotation activity from Activity Log. For more information, see [Update the password of your storage account identity in AD DS](../files/storage-files-identity-ad-ds-update-password.md).

- **Alert on unexpected share deletion or snapshot deletion**: Combine soft delete with alerts on `DeleteShare` and `DeleteShareSnapshot` operations to catch malicious or accidental destruction quickly, before soft-delete retention windows expire. For more information, see [Monitor Azure Files](../files/storage-files-monitoring.md).

## Azure File Sync

For hybrid workloads that use Azure File Sync to tier or cache Azure Files locally, secure both the cloud and the on-premises endpoints.

- **Use managed identities for File Sync registered servers**: Enable a system-assigned managed identity on each registered File Sync server so that the agent authenticates to the Azure File Sync service and the storage account without a stored shared key. For more information, see [Use managed identities with Azure File Sync](../file-sync/file-sync-managed-identities.md).

- **Restrict File Sync management-plane access with Azure RBAC**: Assign built-in Storage Sync roles at the specific Storage Sync Service resource rather than at subscription scope, so that operators can manage sync groups without broader permissions. For more information, see [Planning for an Azure File Sync deployment](../file-sync/file-sync-planning.md).

## Related security articles

- [Secure your Azure Storage account](../common/secure-storage.md) - Cross-cutting Azure Storage security guidance.
- [Secure your Azure Blob Storage](../blobs/secure-blobs.md) - Blob-specific security.
- [Secure your Azure Queue Storage](../queues/secure-queues.md) - Queue-specific security.
- [Secure your Azure Table Storage](../tables/secure-tables.md) - Table-specific security.

## Next steps

- [What is Azure Files?](../files/storage-files-introduction.md)
- [Planning for an Azure Files deployment](../files/storage-files-planning.md)
- [Azure Files networking overview](../files/storage-files-networking-overview.md)
