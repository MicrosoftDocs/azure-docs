---
title: Limitations & known issues with SFTP in Azure Blob Storage (preview) | Microsoft Docs
description: Learn about limitations and known issues of SSH File Transfer Protocol (SFTP) support for Azure Blob Storage.
author: normesta
ms.subservice: blobs
ms.service: storage
ms.topic: conceptual
ms.date: 09/13/2022
ms.author: normesta
ms.reviewer: ylunagaria

---

# Limitations and known issues with SSH File Transfer Protocol (SFTP) support for Azure Blob Storage (preview)

This article describes limitations and known issues of SFTP support for Azure Blob Storage.

> [!IMPORTANT]
> SFTP support is currently in PREVIEW. 
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability. 
>
> To help us understand your scenario, please complete [this form](https://forms.office.com/r/gZguN0j65Y) before you begin using SFTP support. After you've tested your end-to-end scenarios with SFTP, please share your experience by using [this form](https://forms.office.com/r/MgjezFV1NR). Both of these forms are optional. 

> [!IMPORTANT]
> Because you must enable hierarchical namespace for your account to use SFTP, all of the known issues that are described in the Known issues with [Azure Data Lake Storage Gen2](data-lake-storage-known-issues.md) article also apply to your account.

## Known unsupported clients

The following clients are known to be incompatible with SFTP for Azure Blob Storage (preview). See [Supported algorithms](secure-file-transfer-protocol-support.md#supported-algorithms) for more information.

- Five9
- Kemp
- Mule
- paramiko 1.16.0
- SSH.NET 2016.1.0

The unsupported client list above is not exhaustive and may change over time.

## Client settings

To transfer files to or from Azure storage via client applications, see the following recommended client settings.

- WinSCP

  - Under the **Preferences** dialog, under **Transfer** - **Endurance**, select **Disable** to disable the **Enable transfer resume/transfer to temporary filename** option.
  
  > [!CAUTION]
  > Leaving this option enabled can cause failures or degraded performance during large file uploads.

## Unsupported operations

| Category | Unsupported operations |
|---|---|
| ACLs | <li>`chgrp` - change group<li>`chmod` - change permissions/mode<li>`chown` - change owner<li>`put/get -p` - preserving permissions |
| Resuming Uploads | `reput`. `put -a` |
| Random writes and appends | <li>Operations that include both READ and WRITE flags. For example: [SSH.NET create API](https://github.com/sshnet/SSH.NET/blob/develop/src/Renci.SshNet/SftpClient.cs#:~:text=public%20SftpFileStream-,Create,-(string%20path))<li>Operations that include APPEND flag. For example: [SSH.NET append API](https://github.com/sshnet/SSH.NET/blob/develop/src/Renci.SshNet/SftpClient.cs#:~:text=public%20void-,AppendAllLines,-(string%20path%2C%20IEnumerable%3Cstring%3E%20contents)). |
| Links |<li>`symlink` - creating symbolic links<li>`ln` - creating hard links<li>Reading links not supported |
| Capacity Information | `df` - usage info for filesystem |
| Extensions | Unsupported extensions include but aren't limited to: fsync@openssh.com, limits@openssh.com, lsetstat@openssh.com, statvfs@openssh.com |
| SSH Commands | SFTP is the only supported subsystem. Shell requests after the completion of key exchange will fail. |
| Multi-protocol writes | Random writes and appends (`PutBlock`,`PutBlockList`, `GetBlockList`, `AppendBlock`, `AppendFile`)  aren't allowed from other protocols (NFS, Blob REST, Data Lake Storage Gen2 REST) on blobs that are created by using SFTP. Full overwrites are allowed.|
| Rename Operations | Rename operations where the target file name already exists is a protocol violation. Attempting such an operation will return an error. See [Removing and Renaming Files](https://datatracker.ietf.org/doc/html/draft-ietf-secsh-filexfer-02#section-6.5) for more information.

## Authentication and authorization
  
- _Local users_ is the only form of identity management that is currently supported for the SFTP endpoint.

- Azure Active Directory (Azure AD) isn't supported for the SFTP endpoint.

- POSIX-like access control lists (ACLs) aren't supported for the SFTP endpoint.

To learn more, see [SFTP permission model](secure-file-transfer-protocol-support.md#sftp-permission-model) and see [Access control model in Azure Data Lake Storage Gen2](data-lake-storage-access-control-model.md).

## Networking

- To access the storage account using SFTP, your network must allow traffic on port 22.
 
- Static IP addresses aren't supported for storage accounts. This is not an SFTP specific limitation.
  
- Internet routing is not supported. Use Microsoft network routing.

- There's a 2 minute timeout for idle or inactive connections. OpenSSH will appear to stop responding and then disconnect. Some clients reconnect automatically.

## Other

- For performance issues and considerations, see [SSH File Transfer Protocol (SFTP) performance considerations in Azure Blob storage](secure-file-transfer-protocol-performance.md).
  
- Special containers such as $logs, $blobchangefeed, $root, $web aren't accessible via the SFTP endpoint. 

- Symbolic links aren't supported.

- SSH and SCP commands that aren't SFTP aren't supported.

- FTPS and FTP aren't supported.
  
- TLS and SSL aren't related to SFTP.

## Troubleshooting

- To resolve the `Failed to update SFTP settings for account 'accountname'. Error: The value 'True' is not allowed for property isSftpEnabled.` error, ensure that the following pre-requisites are met at the storage account level:

  - The account needs to be a general-purpose v2 and premium block blob accounts.
  
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
