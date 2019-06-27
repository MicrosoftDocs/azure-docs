---
 title: include file
 description: include file
 services: storage
 author: tamram
 ms.service: storage
 ms.topic: include
 ms.date: 06/18/2019
 ms.author: tamram
 ms.custom: include file
---

[Azure Files](../articles/storage/files/storage-files-introduction.md) supports identity-based authentication over SMB (Server Message Block) (preview) through [Azure Active Directory (Azure AD) Domain Services](../articles/active-directory-domain-services/overview.md). Your domain-joined Windows virtual machines (VMs) can access Azure file shares using [Azure AD](../articles/active-directory/fundamentals/active-directory-whatis.md) credentials. 

You can manage Azure Files share level access to an identity such as a user, group in Azure AD with [role-based access control (RBAC)](../articles/role-based-access-control/overview.md). You can define custom RBAC roles that encompass common sets of permissions used to access Azure Files. When you assign your custom RBAC role to an Azure AD identity, that identity is granted access to an Azure file share according to those permissions.

As part of the preview, Azure Files also supports preserving, inheriting, and enforcing [NTFS DACLs](https://technet.microsoft.com/library/2006.01.howitworksntfs.aspx) on all files and directories in a file share. If you copy data from a file share to Azure Files, or vice versa, you can specify that NTFS DACLs are maintained. In this way you can implement backup scenarios using Azure Files, preserving your NTFS DACLS between your on-premises file share and your cloud file share. 

> [!NOTE]
> - Azure AD Domain Service authentication for SMB access is not supported for Linux VMs. Only Windows VMs are supported.
> - Azure AD Domain Service authentication for SMB access is not supported for Active Directory domain joined machine. In the interim, you can consider to leverage [Azure Files Sync](https://docs.microsoft.com/azure/storage/files/storage-sync-files-planning) to start migrating your data to Azure Files and continue to enforce access control using AD credentails from your on-prem AD domain joined machines. 
> - Azure AD Domain Service authentication for SMB access is available only for storage accounts created after September 24, 2018.
> - Azure AD Domain Service authentication for SMB access and NTFS DACL persistent is not supported on Azure file shares managed by Azure File Sync Service. 
