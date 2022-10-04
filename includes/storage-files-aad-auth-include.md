---
 title: include file
 description: include file
 services: storage
 author: khdownie
 ms.service: storage
 ms.topic: include
 ms.date: 10/03/2022
 ms.author: kendownie
 ms.custom: include file
---

Azure Files supports identity-based authentication over Server Message Block (SMB) using the Kerberos authentication protocol through the following three methods:

- On-premises Active Directory Domain Services (AD DS)
- Azure Active Directory Domain Services (Azure AD DS)
- Azure Active Directory Kerberos (Azure AD) for hybrid user identities only (preview)

## Access control
Azure Files enforces authorization on user access to both the share and the directory/file levels. Share-level permission assignment can be performed on Azure AD users or groups managed through the [Azure role-based access control (Azure RBAC)](../articles/role-based-access-control/overview.md) model. With RBAC, the credentials you use for file access should be available or synced to Azure AD. You can assign Azure built-in roles like Storage File Data SMB Share Reader to users or groups in Azure AD to grant read access to an Azure file share.

At the directory/file level, Azure Files supports preserving, inheriting, and enforcing [Windows ACLs](/windows/win32/secauthz/access-control-lists) just like any Windows file servers. You can choose to keep Windows ACLs when copying data over SMB between your existing file share and your Azure file shares. Whether you plan to enforce authorization or not, you can use Azure file shares to back up ACLs along with your data.