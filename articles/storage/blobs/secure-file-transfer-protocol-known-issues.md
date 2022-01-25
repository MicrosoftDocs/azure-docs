---
title: Known issues with SFTP in Azure Blob Storage (preview) | Microsoft Docs
description: Learn about limitations and known issues of SSH File Transfer Protocol (SFTP) support in Azure Blob Storage.
author: normesta
ms.subservice: blobs
ms.service: storage
ms.topic: conceptual
ms.date: 11/22/2021
ms.author: normesta
ms.reviewer: ylunagaria

---

# Known issues with SSH File Transfer Protocol (SFTP) support in Azure Blob Storage (preview)

This article describes limitations and known issues of SFTP support in Azure Blob Storage.

> [!IMPORTANT]
> SFTP support is currently in PREVIEW and is available in [these regions](secure-file-transfer-protocol-support.md#regional-availability).
> 
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>
> To enroll in the preview, complete [this form](https://forms.office.com/r/gZguN0j65Y) AND request to join via 'Preview features' in Azure portal.

## Data redundancy options

- Geo-redundant storage (GRS), Geo-zone-redundant storage (GZRS), Read-access geo-redundant storage (RA-GRS), and Read-access geo-zone-redundant storage (RA-GZRS) are not supported in accounts that have SFTP enabled.

## Authorization

- Local users are the only form of identity management that is currently supported for the SFTP endpoint.

- Azure Active Directory (Azure AD), shared access signature (SAS) and account key authorization are not supported for the SFTP endpoint.

- POSIX-like access control lists (ACLs) are not supported for the SFTP endpoint.

  > [!NOTE]
  > After your data is ingested into Azure Storage, you can use the full breadth of Azure storage security settings. While authorization mechanisms such as role-based access control (RBAC) and access control lists aren't supported as a means to authorize a connecting SFTP client, they can be used to authorize access via Azure tools (such Azure portal, Azure CLI, Azure PowerShell commands, and AzCopy) as well as Azure SDKS, and Azure REST APIs. 

- Account level operations such as listing, putting/getting, creating/deleting containers are not supported.
 
## Networking

- Partitioned DNS endpoints are not supported.

- To access the storage account using SFTP, your network must allow traffic on port 22.

- When a firewall is configured, connections from non-allowed IPs are not rejected as expected. However, if there is a successful connection for an authenticated user then all data plane operations will be rejected.

## Supported algorithms

| Host key | Key exchange | Ciphers/encryption | Integrity/MAC | Public key |
|----------|--------------|--------------------|---------------|------------|
| rsa-sha2-256 | ecdh-sha2-nistp384 | aes128-gcm@openssh.com | hmac-sha2-256 | ssh-rsa |
| rsa-sha2-512 | ecdh-sha2-nistp256 | aes256-gcm@openssh.com | hmac-sha2-512 | ecdsa-sha2-nistp256 |
| ecdsa-sha2-nistp256 | diffie-hellman-group14-sha256 | aes128-cbc| | ecdsa-sha2-nistp384 |
| ecdsa-sha2-nistp384| diffie-hellman-group16-sha512 | aes256-cbc |  | 
||| aes192-cbc ||

SFTP support in Azure Blob Storage currently limits its cryptographic algorithm support in accordance to the Microsoft Security Development Lifecycle (SDL). We strongly recommend that customers utilize SDL approved algorithms to securely access their data. More details can be found [here](/security/sdl/cryptographic-recommendations)

## Security

- Host keys are published [here](secure-file-transfer-protocol-host-keys.md). During the public preview, host keys will rotate up to once per month.

- There a few different reasons for "remote host identification has changed" warning:

  - The remote host key was updated (host keys are periodically rotated).
  
  - The client selected a different host key algorithm than the one stored in the local ssh "known_hosts" file. OpenSSH will use an already trusted key if the host (account.blob.core.windows.net) matches, even when the algorithm doesn't necessarily match.
  
  - The storage account failed over to a different region.
  
  - The remote host (account.blob.core.windows.net) is being faked.

## Integrations

- Change feed is not supported.

- Account metrics such as transactions and capacity are available. Filter logs by operations to see SFTP activity.

- Network File System (NFS) 3.0 and SFTP can't be enabled on the same storage account.

## Performance

- Upload performance with default settings for some clients can be slow. Some of this is expected because SFTP is a chatty protocol and sends small message requests. Increasing the buffer size and using multiple concurrent connections can significantly improve speed. 

  - For WinSCP, you can use a maximum of 9 concurrent connections to upload multiple files. 

  - For OpenSSH on Windows, you can increase buffer size to 100000: sftp -B 100000 testaccount.user1@testaccount.blob.core.windows.net 

  - For OpenSSH on Linux, you can increase buffer size to 262000: sftp -B 262000 -R 32 testaccount.user1@testaccount.blob.core.windows.net 

- There's a 4 minute timeout for idle or inactive connections. OpenSSH will appear to stop responding and then disconnect. Some clients reconnect automatically. 

- Maximum file size upload is limited by client message size. A few examples below: 

  - 32KB message (OpenSSH default) * 50k blocks = 1.52GB 

  - 100KB message (OpenSSH Windows max) * 50k blocks = 4.77GB 

  - 256KB message (OpenSSH Linux max) * 50k blocks = 12.20GB 

## Other

- Symbolic links are not supported.

- PowerShell and Azure CLI are not supported. You can leverage Portal and ARM templates for Public Preview.

- `ssh-keycan` is not supported.

## Troubleshooting

- To resolve the `Failed to update SFTP settings for account 'accountname'. Error: The value 'True' is not allowed for property isSftpEnabled.` error, ensure that the following pre-requisites are met at the storage account level:

  - The account needs to be a GPv2 or Block Blob Storage account.
  
  - The account needs to have LRS or ZRS replication setup.
  
  - The account needs to have hierarchical namespace enabled on it.
  
  - The account needs to be in a [supported regions](secure-file-transfer-protocol-support.md#regional-availability).
  
  - Customer's subscription needs to be signed up for the preview. To enroll in the preview, complete [this form](https://forms.office.com/r/gZguN0j65Y) *and* request to join via 'Preview features' in the Azure portal.

- To resolve the `Home Directory not accessible error.` error, check that:
  
  - The user has been assigned appropriate permissions to the container.
  
  -	The container name is specified in the connection string if you have not configured (set home directory) and provisioned (create the directory inside the container) a home directory for the user.

## See also

- [SSH File Transfer Protocol (SFTP) support in Azure Blob Storage](secure-file-transfer-protocol-support.md)
- [Connect to Azure Blob Storage by using the SSH File Transfer Protocol (SFTP) (preview)](secure-file-transfer-protocol-support-how-to.md)
