---
title: Limitations & known issues with SFTP in Azure Blob Storage (preview) | Microsoft Docs
description: Learn about limitations and known issues of SSH File Transfer Protocol (SFTP) support for Azure Blob Storage.
author: normesta
ms.subservice: blobs
ms.service: storage
ms.topic: conceptual
ms.date: 03/04/2022
ms.author: normesta
ms.reviewer: ylunagaria

---

# Limitations and known issues with SSH File Transfer Protocol (SFTP) support for Azure Blob Storage (preview)

This article describes limitations and known issues of SFTP support for Azure Blob Storage.

> [!IMPORTANT]
> SFTP support is currently in PREVIEW and is available on general-purpose v2 and premium block blob accounts. Complete [this form](https://forms.office.com/r/gZguN0j65Y) BEFORE using the feature in preview. Registration via 'preview features' is NOT required and confirmation email will NOT be sent after filling out the form. You can IMMEDIATELY access the feature.
>
> After testing your end-to-end scenarios with SFTP, please share your experience via [this form](https://forms.office.com/r/MgjezFV1NR).
> 
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Known unsupported clients

The following clients are known to be incompatible with SFTP for Azure Blob Storage (preview). See [Supported algorithms](secure-file-transfer-protocol-support.md#supported-algorithms) for more information.

- Axway
- Five9
- Kemp
- Moveit
- Mule
- paramiko 1.16.0
- Salesforce
- SSH.NET 2016.1.0
- XFB.Gateway

> [!NOTE]
> The unsupported client list above is not exhaustive and may change over time.

## Unsupported operations

| Category | Unsupported operations |
|---|---|
| ACLs | <li>`chgrp` - change group<li>`chmod` - change permissions/mode<li>`chown` - change owner<li>`put/get -p` - preserving permissions |
| Resume operations |<li>`reget`, `get -a`- resume download<li>`reput`. `put -a` - resume upload |
| Random writes and appends | <li>Operations that include both READ and WRITE flags. For example: [SSH.NET create API](https://github.com/sshnet/SSH.NET/blob/develop/src/Renci.SshNet/SftpClient.cs#:~:text=public%20SftpFileStream-,Create,-(string%20path))<li>Operations that include APPEND flag. For example: [SSH.NET append API](https://github.com/sshnet/SSH.NET/blob/develop/src/Renci.SshNet/SftpClient.cs#:~:text=public%20void-,AppendAllLines,-(string%20path%2C%20IEnumerable%3Cstring%3E%20contents)). |
| Links |<li>`symlink` - creating symbolic links<li>`ln` - creating hard links<li>Reading links not supported |
| Capacity Information | `df` - usage info for filesystem |
| Extensions | Unsupported extensions include but are not limited to: fsync@openssh.com, limits@openssh.com, lsetstat@openssh.com, statvfs@openssh.com |
| SSH Commands | SFTP is the only supported subsystem. Shell requests after the completion of the key exchange will fail. |
| Multi-protocol writes | Random writes and appends (`PutBlock`,`PutBlockList`, `GetBlockList`, `AppendBlock`, `AppendFile`)  are not allowed from other protocols on blobs that are created by using SFTP. Full overwrites are allowed.|

## Authentication and authorization

- _Local users_ is the only form of identity management that is currently supported for the SFTP endpoint.

- Azure Active Directory (Azure AD) is not supported for the SFTP endpoint.

- POSIX-like access control lists (ACLs) are not supported for the SFTP endpoint.

  > [!NOTE]
  > After your data is ingested into Azure Storage, you can use the full breadth of Azure storage security settings. While authorization mechanisms such as role-based access control (RBAC) and access control lists aren't supported as a means to authorize a connecting SFTP client, they can be used to authorize access via Azure tools (such Azure portal, Azure CLI, Azure PowerShell commands, and AzCopy) as well as Azure SDKS, and Azure REST APIs. 

- Account and container level operations are not supported for the SFTP endpoint.
 
## Networking

- To access the storage account using SFTP, your network must allow traffic on port 22.

- When a firewall is configured, connections from non-allowed IPs are not rejected as expected. However, if there is a successful connection for an authenticated user then all data plane operations will be rejected.

- There's a 4 minute timeout for idle or inactive connections. OpenSSH will appear to stop responding and then disconnect. Some clients reconnect automatically. 

## Security

- Host keys are published [here](secure-file-transfer-protocol-host-keys.md). During the public preview, host keys may rotate frequently.

## Integrations

- Change feed and Event Grid notifications are not supported.

- Network File System (NFS) 3.0 and SFTP can't be enabled on the same storage account.

## Performance

For performance issues and considerations, see [SSH File Transfer Protocol (SFTP) performance considerations in Azure Blob storage](secure-file-transfer-protocol-performance.md).

## Other

- Special containers such as $logs, $blobchangefeed, $root, $web are not accessible via the SFTP endpoint. 

- Symbolic links are not supported.

- `ssh-keyscan` is not supported.

- SSH and SCP commands, that are not SFTP, are not supported.

- FTPS and FTP are not supported.

## Troubleshooting

- To resolve the `Failed to update SFTP settings for account 'accountname'. Error: The value 'True' is not allowed for property isSftpEnabled.` error, ensure that the following pre-requisites are met at the storage account level:

  - The account needs to be a general-purpose v2 and premium block blob accounts.
  
  - The account needs to have hierarchical namespace enabled on it.

- To resolve the `Home Directory not accessible error.` error, check that:
  
  - The user has been assigned appropriate permissions to the container.
  
  -	The container name is specified in the connection string for local users don't have a home directory.
  
  -	The container name is specified in the connection string for local users that have a home directory that doesn't exist.

## See also

- [SSH File Transfer Protocol (SFTP) support for Azure Blob Storage](secure-file-transfer-protocol-support.md)
- [Connect to Azure Blob Storage by using the SSH File Transfer Protocol (SFTP)](secure-file-transfer-protocol-support-how-to.md)
- [Host keys for SSH File Transfer Protocol (SFTP) support for Azure Blob Storage](secure-file-transfer-protocol-host-keys.md)
- [SSH File Transfer Protocol (SFTP) performance considerations in Azure Blob storage](secure-file-transfer-protocol-performance.md)
