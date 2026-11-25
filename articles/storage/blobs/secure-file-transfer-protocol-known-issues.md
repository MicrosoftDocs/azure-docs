---
title: SFTP Limitations and Issues in Azure Blob Storage
titleSuffix: Azure Storage
description: Explore limitations and known issues with SFTP in Azure Blob Storage to troubleshoot file transfers, verify client compatibility, and plan your setup.
author: normesta

ms.service: azure-blob-storage
ms.topic: concept-article
ms.date: 08/31/2026
ms.author: normesta

# Customer intent: "As a cloud storage administrator, I want to understand the limitations and known issues of SFTP support in Blob Storage, so that I can effectively manage file transfers and ensure compatibility with my existing workflows and clients."
---

# Limitations and known issues with SSH File Transfer Protocol (SFTP) support for Azure Blob Storage

This article describes limitations and known issues with SFTP in Azure Blob Storage so you can troubleshoot file transfers and verify client and workflow compatibility.

> [!IMPORTANT]
> Because you must enable hierarchical namespace to use SFTP, the issues in [Known issues with Azure Data Lake Storage](data-lake-storage-known-issues.md) also apply to your account.

## Unsupported clients

The following clients are known to be incompatible with SFTP for Azure Blob Storage. For more information, see [Supported algorithms](secure-file-transfer-protocol-support.md#supported-algorithms).

- Kemp
- paramiko 1.16.0
- SSH.NET 2016.1.0 or older
- Renci SSH.NET 2014.6.0

This list isn't exhaustive and might change over time.

## Client settings

To transfer files to or from Azure Blob Storage via SFTP clients, see the following recommended settings.

- WinSCP

  - In the **Preferences** dialog, select **Transfer** > **Endurance**, and then set **Enable transfer resume/transfer to temporary filename** to **Disable**.
  
> [!CAUTION]
> Leaving this option enabled can cause failures or degraded performance during large file uploads.

## Unsupported operations

| Category | Unsupported operations |
|---|---|
| Random writes | Operations that include both READ and WRITE flags. For example: [SSH.NET create API](https://github.com/sshnet/SSH.NET/blob/develop/src/Renci.SshNet/SftpClient.cs#:~:text=public%20SftpFileStream-,Create,-(string%20path)) |
| Links |<li>`symlink` - creating symbolic links<li>`ln` - creating hard links<li>Reading links not supported |
| Capacity Information | `df` - usage info for filesystem |
| Extensions | Unsupported extensions include but aren't limited to: fsync@openssh.com, limits@openssh.com, lsetstat@openssh.com, statvfs@openssh.com |
| SSH Commands | SFTP is the only supported subsystem. Shell requests after key exchange fail. |
| Multi-protocol writes | Random writes and appends (`PutBlock`,`PutBlockList`, `GetBlockList`, `AppendBlock`, `AppendFile`)  aren't allowed from other protocols (NFS, Blob REST, Data Lake Storage REST) on blobs that are created by using SFTP. Full overwrites are allowed.|
| Rename Operations | Rename operations where the target file name already exists is a protocol violation. Attempting such an operation returns an error. See [Removing and Renaming Files](https://datatracker.ietf.org/doc/html/draft-ietf-secsh-filexfer-02#section-6.5) for more information.|
| Cross Container Operations | Traversing between containers or performing operations on multiple containers from the same connection are unsupported.
| Undelete | You can't restore a soft-deleted blob by using SFTP. Use the `Undelete` REST API.|

### Access ACLs and default ACLs

- SFTP doesn't currently support **Default ACLs** or additional **Access ACLs** (ACL entries beyond the POSIX `user::`, `group::`, and `other::` entries, such as named users or named groups).

- If any directory in the access path (including the user's home directory) has Default ACLs or additional Access ACLs set, SFTP operations fail with `Permission denied`, even when the connecting user has required permissions.

**Workaround:** Remove Default ACLs and additional Access ACLs from all directories in the SFTP access path (including the user's home directory) so that only POSIX `user::`, `group::`, and `other::` entries remain.

For more details about ACLs and how you can edit them, see [Access control lists (ACLs)](data-lake-storage-access-control.md).

## Networking

- To access the storage account by using SFTP, your network must allow traffic on port 22.
 
- Storage accounts don't support static IP addresses. This limitation isn't specific to SFTP.

- Idle or inactive connections time out after two minutes. OpenSSH stops responding and then disconnects. Some clients reconnect automatically.

## Additional SFTP limitations

- For performance issues and considerations, see [SSH File Transfer Protocol (SFTP) performance considerations in Azure Blob storage](secure-file-transfer-protocol-performance.md).

- By default, the Content-MD5 property of blobs uploaded by using SFTP is null. To populate this property with an MD5 hash, your client must calculate the hash and set the Content-MD5 property before uploading the blob.
  
- The maximum file upload size via the SFTP endpoint is 500 GB.

- Customer-managed planned failover is supported for standard general-purpose v2 accounts and at the preview level for premium block blob accounts. For more information, see [Azure storage disaster recovery planning and failover](../common/storage-disaster-recovery-guidance.md).

- To change the storage account's redundancy or replication settings, you must disable SFTP. You can re-enable SFTP after the conversion finishes.

- You can't access special containers such as `$logs`, `$blobchangefeed`, `$root`, and `$web` via the SFTP endpoint.

- FTPS and FTP aren't supported.
  
- SFTP doesn't use TLS or SSL.

- Only SSH version 2 is supported.

- Avoid blob or directory names that end with a dot (.), a forward slash (/), a backslash (\), or a sequence or combination of the two. No path segments should end with a dot (.). For more information, see [Naming and Referencing Containers, Blobs, and Metadata](/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata).

## Blob Storage features

When you enable SFTP support, some Blob Storage features are fully supported, but some features might be supported only at the preview level or not yet supported at all.

To see how each Blob Storage feature is supported in accounts that have SFTP support enabled, see [Blob Storage feature support for Azure Storage accounts](storage-feature-support-in-storage-accounts.md).

## Troubleshooting

- To resolve the `Failed to update SFTP settings for account 'accountname'. Error: The value 'True' isn't allowed for property isSftpEnabled.` error, verify that the storage account meets the following prerequisites:

  - The account is a general-purpose v2 or premium block blob account.
  
  - Hierarchical namespace is enabled for the account.

- To resolve the `Home Directory not accessible` error, check that:
  
  - The user has appropriate permissions to the container.
  
  - The connection string specifies the container name for local users who don't have a home directory.
  
  - The connection string specifies the container name for local users whose home directory doesn't exist.

- To resolve the `Received disconnect from XX.XXX.XX.XXX port 22:11:` when connecting, check that:
  
  - Public network access is `Enabled from all networks` or `Enabled from selected virtual networks and IP addresses`.
  
  - The client IP address is allowed by the firewall.

## See also

- [SSH File Transfer Protocol (SFTP) support for Azure Blob Storage](secure-file-transfer-protocol-support.md)
- [Connect to Azure Blob Storage by using the SSH File Transfer Protocol (SFTP)](secure-file-transfer-protocol-support-how-to.md)
- [Host keys for SSH File Transfer Protocol (SFTP) support for Azure Blob Storage](secure-file-transfer-protocol-host-keys.md)
- [SSH File Transfer Protocol (SFTP) performance considerations in Azure Blob storage](secure-file-transfer-protocol-performance.md)
