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

Azure Files offers fully managed file shares in the cloud that are accessible via the industry-standard [Server Message Block (SMB) protocol](https://msdn.microsoft.com/library/windows/desktop/aa365233.aspx) (also known as Common Internet File System or CIFS). Azure Files supports integration with Azure Active Directory (Azure AD), leveraging [Azure AD Domain Services](https://docs.microsoft.com/azure/active-directory-domain-services/active-directory-ds-overview). Azure AD integration enables authentication for access to Azure Files shares over SMB from domain-joined Windows virtual machines (VMs). 

Azure Active Directory (Azure AD) authorizes access rights to secured resources through [role-based access control (RBAC)](https://docs.microsoft.com/azure/role-based-access-control/overview). Using role-based access control (RBAC), you can control access to Azure Files at the share, directory, and file level.

Azure Files also supports preserving, inheriting, and enforcing [NTFS DACLs](https://technet.microsoft.com/library/2006.01.howitworksntfs.aspx) on all files and directories in a file share. If you copy data from a file share to Azure Files, you can specify that NTFS DACLs are maintained, enabling backup scenarios. 

> [!NOTE]
> Azure AD integration with Azure Files is not supported for Linux VMs for the preview.

