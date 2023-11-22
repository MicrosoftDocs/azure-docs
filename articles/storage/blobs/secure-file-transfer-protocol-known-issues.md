---
title: Limitations & known issues with SFTP in Azure Blob Storage
titleSuffix: Azure Storage
description: Learn about limitations and known issues of SSH File Transfer Protocol (SFTP) support for Azure Blob Storage.
author: normesta

ms.service: azure-blob-storage
ms.topic: conceptual
ms.date: 10/20/2022
ms.author: normesta
ms.reviewer: michawil

---

# Limitations and known issues with SSH File Transfer Protocol (SFTP) support for Azure Blob Storage

This article describes limitations and known issues of SFTP support for Azure Blob Storage.

> [!IMPORTANT]
> Because you must enable hierarchical namespace for your account to use SFTP, all of the known issues that are described in the Known issues with [Azure Data Lake Storage Gen2](data-lake-storage-known-issues.md) article also apply to your account.

## Known unsupported clients

The following clients are known to be incompatible with SFTP for Azure Blob Storage. See [Supported algorithms](secure-file-transfer-protocol-support.md#supported-algorithms) for more information.

- Five9
- Kemp
- Mule
- paramiko 1.16.0
- SSH.NET 2016.1.0

The unsupported client list above isn't exhaustive and may change over time.

## Client settings

To transfer files to or from Azure Blob Storage via SFTP clients, see the following recommended settings.

- WinSCP

  - Under the **Preferences** dialog, under **Transfer** - **Endurance**, select **Disable** to disable the **Enable transfer resume/transfer to temporary filename** option.
  
> [!CAUTION]
> Leaving this option enabled can cause failures or degraded performance during large file uploads.

## Unsupported operations

| Category | Unsupported operations |
|---|---|
| ACLs | <li>`chgrp` - change group<li>`chmod` - change permissions/mode<li>`chown` - change owner<li>`put/get -p` - preserving properties such as permissions |
| Resuming Uploads | `reput`. `put -a` |
| Random writes and appends | <li>Operations that include both READ and WRITE flags. For example: [SSH.NET create API](https://github.com/sshnet/SSH.NET/blob/develop/src/Renci.SshNet/SftpClient.cs#:~:text=public%20SftpFileStream-,Create,-(string%20path))<li>Operations that include APPEND flag. For example: [SSH.NET append API](https://github.com/sshnet/SSH.NET/blob/develop/src/Renci.SshNet/SftpClient.cs#:~:text=public%20void-,AppendAllLines,-(string%20path%2C%20IEnumerable%3Cstring%3E%20contents)). |
| Links |<li>`symlink` - creating symbolic links<li>`ln` - creating hard links<li>Reading links not supported |
| Capacity Information | `df` - usage info for filesystem |
| Extensions | Unsupported extensions include but aren't limited to: fsync@openssh.com, limits@openssh.com, lsetstat@openssh.com, statvfs@openssh.com |
| SSH Commands | SFTP is the only supported subsystem. Shell requests after the completion of key exchange will fail. |
| Multi-protocol writes | Random writes and appends (`PutBlock`,`PutBlockList`, `GetBlockList`, `AppendBlock`, `AppendFile`)  aren't allowed from other protocols (NFS, Blob REST, Data Lake Storage Gen2 REST) on blobs that are created by using SFTP. Full overwrites are allowed.|
| Rename Operations | Rename operations where the target file name already exists is a protocol violation. Attempting such an operation will return an error. See [Removing and Renaming Files](https://datatracker.ietf.org/doc/html/draft-ietf-secsh-filexfer-02#section-6.5) for more information.|
| Cross Container Operations | Traversing between containers or performing operations on multiple containers from the same connection are unsupported.

## Authentication and authorization
  
- _Local users_ are the only form of identity management that is currently supported for the SFTP endpoint.

- Microsoft Entra ID isn't supported for the SFTP endpoint.

- POSIX-like access control lists (ACLs) aren't supported for the SFTP endpoint.

To learn more, see [SFTP permission model](secure-file-transfer-protocol-support.md#sftp-permission-model) and see [Access control model in Azure Data Lake Storage Gen2](data-lake-storage-access-control-model.md).

## Networking

- To access the storage account using SFTP, your network must allow traffic on port 22.
 
- Static IP addresses aren't supported for storage accounts. This isn't an SFTP specific limitation.
  
- Internet routing isn't supported. Use Microsoft network routing.

- There's a 2-minute time out for idle or inactive connections. OpenSSH will appear to stop responding and then disconnect. Some clients reconnect automatically.

## Other

- For performance issues and considerations, see [SSH File Transfer Protocol (SFTP) performance considerations in Azure Blob storage](secure-file-transfer-protocol-performance.md).
  
-  By default, the Content-MD5 property of blobs that are uploaded by using SFTP are set to null. Therefore, if you want the Content-MD5 property of those blobs to contain an MD5 hash, your client must calculate that value, and then set the Content-MD5 property of the blob before the uploading the blob.
  
- Maximum file upload size via the SFTP endpoint is 100 GB. 

- To change the storage account's redundancy/replication settings or initiate account failover, SFTP must be disabled. SFTP may be re-enabled once the conversion has completed. 

- Special containers such as $logs, $blobchangefeed, $root, $web aren't accessible via the SFTP endpoint. 

- Symbolic links aren't supported.

- SSH and SCP commands that aren't SFTP aren't supported.

- FTPS and FTP aren't supported.
  
- TLS and SSL aren't related to SFTP.

## Blob Storage features

When you enable SFTP support, some Blob Storage features will be fully supported, but some features might be supported only at the preview level or not yet supported at all.

To see how each Blob Storage feature is supported in accounts that have SFTP support enabled, see [Blob Storage feature support for Azure Storage accounts](storage-feature-support-in-storage-accounts.md).

## Troubleshooting

- To resolve the `Failed to update SFTP settings for account 'accountname'. Error: The value 'True' isn't allowed for property isSftpEnabled.` error, ensure that the following prerequisites are met at the storage account level:

  - The account needs to be a general-purpose v2 or premium block blob account.
  
  - The account needs to have hierarchical namespace enabled on it.

- To resolve the `Home Directory not accessible error.` error, check that:
  
  - The user has been assigned appropriate permissions to the container.
  
  -	The container name is specified in the connection string for local users don't have a home directory.
  
  -	The container name is specified in the connection string for local users that have a home directory that doesn't exist.

- To resolve the `Received disconnect from XX.XXX.XX.XXX port 22:11:` when connecting, check that:
  
  - Public network access is `Enabled from all networks` or `Enabled from selected virtual networks and IP addresses`.
  
  - The client IP address is allowed by the firewall.
  
  - Network Routing is set to `Microsoft network routing`.

## See also

- [SSH File Transfer Protocol (SFTP) support for Azure Blob Storage](secure-file-transfer-protocol-support.md)
- [Connect to Azure Blob Storage by using the SSH File Transfer Protocol (SFTP)](secure-file-transfer-protocol-support-how-to.md)
- [Host keys for SSH File Transfer Protocol (SFTP) support for Azure Blob Storage](secure-file-transfer-protocol-host-keys.md)
- [SSH File Transfer Protocol (SFTP) performance considerations in Azure Blob storage](secure-file-transfer-protocol-performance.md)
