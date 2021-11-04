---
title: How to deploy Azure AD Kerberos authentication  (Preview)
description: Learn how to deploy Azure AD Kerberos authentication  

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 11/03/2021

ms.author: justinha
author: justinha
manager: daveba
ms.reviewer: rhicock

ms.collection: M365-identity-device-management
ms.custom: contperf-fy20q4
---
# Azure AD Kerberos authentication (Preview)

Azure AD supports Kerberos authentication so you can use SMB to access files using Azure AD credentials from devices and virtual machines (VMs) joined to Azure AD or hybrid environments. This allows Azure AD users to access resources like file shares that require Kerberos authentication in the cloud. 

Enterprises can move their traditional services that require Kerberos authentication to the cloud while maintaining a seamless user experience. No changes are made to the authentication stack. No domain services need to be set up or managed, and no new infrastructure is required on premises. End users can access resources like Azure Files over the internet without requiring a line-of-sight to domain controllers. 

Azure AD Kerberos authentication is supported as part of a public preview. For more information about previews, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## How Azure AD Kerberos authentication works 
<!---This list of scenarios will grow after they have SQL online, native Azure Files support, and then app proxy. Only Azure Files scenario requires AAD or hybrid domain join. SQL will require only domain join.--->

This feature allows customers to access Azure AD resources using Kerberos. This is achieved by flipping the traditional trust model to where Azure AD becomes the trusted source for both cloud and on-premises authentication. 

Azure AD becomes an independent Kerberos realm (KERBEROS.MICROSOFTONLINE.COM) that can issue service tickets and ticket-granting tickets (TGTs). Windows clients running Insider build are enlightened to allow clients to access Azure AD Kerberos. This enables:

- Traditional on-premises applications to move to the cloud without changing their fundamental authentication scheme.
- Applications trust Azure AD directly and there is no need for traditional AD.

For step-by-step guidance to deploy Azure AD Kerberos authentication for Azure Files, see [Create a profile container with Azure Files and Azure Active Directory](https://review.docs.microsoft.com/en-us/azure/virtual-desktop/create-profile-container-azure-ad?branch=pr-en-us-173530).

<!--- add image--->

## Prerequisites for Azure AD Kerberos authentication

|Prerequisite | Description |
|-------------|-------------|
| Windows 10 Insider build 21304 or higher | Download Windows Insider Preview builds Guide to Windows Insider Program<br>Until an ISO is available for download, you will have to install a current OS and upgrade to the Windows Insiders Dev Channel as needed. |
| Device | For for Azure Files, the end user device must be joined to either Azure AD or a hybrid environment. |
| Azure AD connect installed | Hybrid environments where identities exist both in Azure AD and Active Directory Domain Services. Only hybrid identities are supported. |

## Limitations

### Azure AD cached logon 

In the case of an upgrade or new deployment, there is potential that user accounts do not have refreshed TGTs immediately. This is because Azure AD relies on caching certain logon properties to provide better user experiences and can take up to 4 hours to refresh, resulting in failed ticket requests from Azure AD. To trigger an online logon immediately, run the following command and then lock and unlock the user session to get a refreshed TGT:

```cmd
dsregcmd.exe /RefreshPrt
```
<!---device CA and --->
## Azure AD set up 

There is no Azure AD set up required for enabling native Azure AD Authentication for accessing Azure AD Kerberos resources. You need enable the following Group Policy setting for hybrid-joined devices:

**Administrative Templates\System\Kerberos\Allow retrieving the cloud kerberos ticket during the logon**

![Screenshot of group policy setting Allow retrieving the cloud kerberos ticket during the logon.](media\how-to-kerberos-authentication-azure-files\gp.png)

Set the following registry key for Intune-managed devices:

HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Lsa\Kerberos\Parameters!CloudKerberosTicketRetrievalEnabled dword=1

Note that users with existing logon sessions may need to refresh their PRT if they attempt to use this feature immediately after it’s enabled. It can take up to a few hours for the PRT to refresh on its own. Administrators should consider scheduling this outside of normal working hours for the cache to expire. Otherwise, run the following command to refresh it manually:

```cmd
dsregcmd.exe /RefreshPrt
```

## Validation 

Verify tickets are getting cached by running the following command to return a ticket from the on-premises realm.

```cmd
klist get krbtgt
```

## Next steps

For more information about moving file shares to Azure, see [Migrate to Azure file shares](/storage/files/storage-files-migration-overview.md).
