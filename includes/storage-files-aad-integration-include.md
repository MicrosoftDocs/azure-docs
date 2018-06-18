---
 title: include file
 description: include file
 services: storage
 author: tamram
 ms.service: storage
 ms.topic: include
 ms.date: 06/19/2018
 ms.author: tamram
 ms.custom: include file
---

Azure Files offers fully managed file shares in the cloud that are accessible via the industry-standard [Server Message Block (SMB) protocol](https://msdn.microsoft.com/library/windows/desktop/aa365233.aspx) (also known as Common Internet File System or CIFS). Azure Files supports integration with Azure Active Directory (Azure AD) leveraging [Azure Active Directory Domain Services](https://docs.microsoft.com/azure/active-directory-domain-services/active-directory-ds-overview)
in preview. Azure AD integration enables access to Azure Files shares over SMB from Windows Virtual Machines (VMs). Azure Files supports preserving and enforcing [NTFS DACLs](https://technet.microsoft.com/library/2006.01.howitworksntfs.aspx) on all files and directories under a file share.
