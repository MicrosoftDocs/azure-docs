---
 title: include file
 description: include file
 services: storage
 author: roygara
 ms.service: storage
 ms.topic: include
 ms.date: 09/16/2020
 ms.author: rogarana
 ms.custom: include file
---
SMB Multichannel for Azure file shares currently has the following restrictions:
- Can only be used with locally redundant FileStorage accounts.
- Only supported for Windows clients. 
- Maximum number of channels is four.
- SMB Direct is not supported.
- Private endpoints for storage accounts are not supported.
- For storage accounts with on-premises Active Directory Domain Services (AD DS) or Azure AD DS [identity-based authentication](../articles/storage/files/storage-files-active-directory-overview.md) enabled for Azure Files, SMB clients would not be able to use Windows File Explorer to configure NTFS permissions on directories and files.
    - Use Windows [icacls](/windows-server/administration/windows-commands/icacls) tool or [Set-ACL](/powershell/module/microsoft.powershell.security/set-acl) command instead to configure permissions.

