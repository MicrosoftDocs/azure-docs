---
title: Known issues with SFTP in Azure Blob Storage (preview) | Microsoft Docs
description: Learn about limitations and known issues of Secure File Transfer Protocol (SFTP) support in Azure Blob Storage.
author: normesta
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: conceptual
ms.date: 09/07/2021
ms.author: normesta
ms.reviewer: ylunagaria

---

# Known issues with Secure File Transfer Protocol (SFTP) support in Azure Blob Storage (preview)

This article describes limitations and known issues of SFTP support in Azure Blob Storage.

> [!IMPORTANT]
> SFTP support is currently in PREVIEW and is available in [these regions](secure-file-transfer-protocol-support.md#regional-availability).
> 
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>
> To enroll in the preview, see [this form](https://forms.office.com/r/gZguN0j65Y).

## Data redundancy options

- Geo-redundant storage (GRS), and Geo-zone-redundant storage (GZRS) are not yet supported in accounts that have SFTP enabled?

## Authorization

- Local users are the only form of identity management that is currently supported.

- Azure Active Directory (Azure AD), shared access signature (SAS) and account key authorization are not yet supported.

- POSIX-like access control lists (ACLs) are not yet supported.

- Root/account level operations such as listing, putting/getting, creating/deleting root directories are not supported.
 
## Networking

- Partitioned DNS endpoints are not supported.

- Private endpoints are supported.

- To access the storage account using SFTP, your network must allow traffic on port 22.

- When a firewall is configured, connections from non-whitelisted IPs are not rejected as expected. However, if there is a successful connection for an authenticated user then all data plane operations will be rejected.

## Supported encryption algorithms

- Host key: rsa-sha2-256,rsa-sha2-512,ecdsa-sha2-nistp256,ecdsa-sha2-nistp384

- Key exchange: ecdh-sha2-nistp384,ecdh-sha2-nistp256,diffie-hellman-group14-sha256,diffie-hellman-group16-sha512

- Ciphers/encryption: aes128-gcm@openssh.com,aes256-gcm@openssh.com,aes128-cbc,aes192-cbc,aes256-cbc

- Integrity/MAC: hmac-sha2-256,hmac-sha2-512

- Public key: ssh-rsa,ecdsa-sha2-nistp256,ecdsa-sha2-nistp384

## Security

- Host keys are published [here](https://microsoft.sharepoint.com/:x:/t/StorageABACPrivatePreview/EYTTmCjT63dCunstkPh66bIBQpYF9DR-X0jqee202VaaEA?e=MSO9CU). During the public preview, host keys will rotate up to once per month.

- There a few different reasons for "remote host identification has changed" warning:

  - The remote host key was updated (host keys are periodically rotated).
  
  - The client selected a different host key algorithm than the one stored in the local ssh "known_hosts" file. OpenSSH will use an already trusted key if the host (account.blob.core.windows.net) matches, even when the algorithm doesn't necessarily match.
  
  - The storage account failed over to a different region.
  
  - The remote host (account.blob.core.windows.net) is being faked.

## Integrations

- Change feed is not yet supported. Once it is supported, it will allow you to monitor connection activity.

- Account metrics such as transactions and capacity are available. Filter logs by operations to see SFTP activity.

## Performance

- Upload performance with default settings for some clients can be slow. Some of this is expected because of the many small blocks that are written by default. For OpenSSH, increasing the buffer size option to 100,000 will help (`For example: sftp -B 100000 testaccount.user1@testaccount.blob.core.windows.net`). Also consider using multiple connections to transfer data. For example, if you use WinSCP, you can use a maximum of 9 concurrent connections to upload multiple files.

- A buffer size of 262000 can be used for OpenSSH on Linux accompanied by -R 32.

- There's a 4 minute timeout for idle or inactive connections. OpenSSH will appear to hang and then disconnect. Some clients reconnect automatically.

- Maximum file size upload is limited by client message size:

  - 32k message (OpenSSH default) * 50k blocks = 1.52GB
  - 100k message (OpenSSH Windows max) * 50k = 4.77GB
  - 256k message (OpenSSH Linux max) * 50k = 12.20GB

## Other

- Cross-container rename (move) is not yet supported.

- Symbolic links are not supported.

- PowerShell and Azure CLI and not yet supported. You can leverage Portal and ARM templates for Public Preview.

## See also

- [Secure File Transfer (SFTP) protocol support in Azure Blob Storage](secure-file-transfer-protocol-support.md)
- [Mount Blob storage by using Secure File Transfer (SFTP) protocol](network-file-system-protocol-support-how-to.md)