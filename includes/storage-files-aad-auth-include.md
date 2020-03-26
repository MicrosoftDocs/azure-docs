---
 title: include file
 description: include file
 services: storage
 author: tamram
 ms.service: storage
 ms.topic: include
 ms.date: 07/30/2019
 ms.author: tamram
 ms.custom: include file
---

[Azure Files](../articles/storage/files/storage-files-introduction.md) supports identity-based authentication over Server Message Block (SMB) through [Active Directory (AD)](https://docs.microsoft.com/windows-server/identity/ad-ds/get-started/virtual-dc/active-directory-domain-services-overview) (preview) and [Azure Active Directory Domain Services (Azure AD DS)](../articles/active-directory-domain-services/overview.md) (GA). This article focuses on how Azure Files can leverage domain services, either on-premises or in Azure, to support identity-based access to Azure Files over SMB. This allows you to easily replace your existing file servers with Azure Files and continue to use your existing directory service, maintaining seamless user access to shares. 

Azure Files enforces authorization on the user access to both the share and the directory/file level. Share-level permission assignment can be assigned to Azure AD users or groups managed through the typical [role-based access control (RBAC)](../articles/role-based-access-control/overview.md) model. With RBAC, the credentials you use for file access should be available or synced to Azure AD. You can assign built-in RBAC roles like Storage File Data SMB Share Reader to users or groups in Azure AD to grant read access to an Azure file share.

At the directory/file level, Azure Files supports preserving, inheriting, and enforcing [Windows DACLs](https://docs.microsoft.com/windows/win32/secauthz/access-control-lists) just like any Windows file servers. If you copy data over SMB from a file share to Azure Files, or vice versa, you can choose to keep Windows DACLs. Whether you plan to enforce authorization or not, you can leverage Azure Files to backup ACLs along with your data. 
