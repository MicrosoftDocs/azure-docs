---
 title: include file
 description: include file
 services: storage
 author: tamram
 ms.service: storage
 ms.topic: include
 ms.date: 07/03/2018
 ms.author: tamram
 ms.custom: include file
---

[Azure Files](../articles/storage/files/storage-files-introduction.md) supports integration with Azure Active Directory (Azure AD) (Preview) through [Azure AD Domain Services](../articles/active-directory-domain-services/active-directory-ds-overview.md). Using Azure AD integration for Azure Files, your domain-joined Windows virtual machines (VMs) can access Azure file shares using identity-based authentication over SMB (Server Message Block). 

Azure Active Directory (Azure AD) authenticates a user, group, or service principal with [role-based access control (RBAC)](../articles/role-based-access-control/overview.md). Using RBAC, you can control access to Azure Files at the share, directory, and file level.

Azure Files also supports preserving, inheriting, and enforcing [NTFS DACLs](https://technet.microsoft.com/library/2006.01.howitworksntfs.aspx) on all files and directories in a file share. If you copy data from a file share to Azure Files, or vice versa, you can specify that NTFS DACLs are maintained. You can implement backup scenarios using Azure Files, preserving your NTFS DACLS between your on-premises file share and your cloud file share. 

> [!NOTE]
> Azure AD integration with Azure Files is not supported for Linux VMs for the preview. Only Windows Server VMs are supported.
