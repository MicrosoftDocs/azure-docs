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
# How to deploy Azure AD Kerberos authentication (Preview)

Azure AD supports Kerberos authentication so you can use SMB to access files using Azure AD credentials from devices and virtual machines (VMs) joined to Azure AD or hybrid environments. This allows Azure AD users to access a file share that requires Kerberos authentication in the cloud. 

Enterprises can move their traditional services that require Kerberos authentication to the cloud while maintaining a seamless user experience. No changes are made to the authentication stack of the file servers. No domain services need to be set up or managed, and no new infrastructure is required on premises. End users can access traditional file servers or Azure Files over the internet without requiring a line-of-sight to domain controllers. 

Azure AD Kerberos authentication is supported as part of a public preview. For more information about previews, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## How Azure AD Kerberos authentication works 
<!---This list of scenarios will grow after they have SQL online, native Azure Files support, and then app proxy. Only Azure Files scenario requires AAD or hybrid domain join. SQL will require only domain join.--->

This feature allows customer to mount Azure file shares on Azure Virtual Desktop using Kerberos. This is achieved by flipping the traditional trust model to where Azure AD becomes the trusted source for both cloud and on-premises authentication. 

Azure AD becomes an independent Kerberos realm (kerberos.microsoftonline.com) that can issue service tickets and ticket-granting tickets (TGTs). Windows clients running Insider build are enlightened to allow clients to access Azure AD Kerberos. This enables:

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

In case of upgrades and fresh deployment, there is a potential for the user accounts to not have the refreshed TGT (ticket granting ticket) immediately i.e. within 4 hours resulting in failed tickets requests from Azure AD. As Windows tries to limit how often it connects to AAD so during that period there is a possibility that the machine hasn’t gotten a TGT yet. As an administrator, you can trigger an online logon immediately to handle upgrade scenarios by running the command below and then locking and unlocking the user session to get a refreshed TGT.

```cmd
dsregcmd.exe /RefreshPrt
```
<!---device CA and --->
## Azure AD set up 

There is no Azure AD set up required for enabling native Azure AD Authentication for accessing Azure files over Wi-Fi. The prerequisites are mentioned under section 5: the latest Windows client insider builds (21304+) and an Azure AD subscription. With this preview, Azure AD is now its own independent Kerberos realm. The clients are already enlightened and will redirect clients to access Azure AD Kerberos to request a Kerberos ticket. By default, this capability for the clients to access Azure AD Kerberos is switched off and you need the below policy change to enable this feature on the clients. This setting can be used to deploy this feature in a staged manner by choosing specific clients you want to pilot on and then expanding it to all the clients across your environment. 

Enable the following Group Policy setting:

**Administrative Templates\System\Kerberos\Allow retrieving the cloud kerberos ticket during the logon**

![Screenshot of group policy setting Allow retrieving the cloud kerberos ticket during the logon.](media\how-to-kerberos-authentication-azure-files\gp.png)

Note that users with existing logon sessions may need to refresh their PRT if they attempt to use this feature immediately after it’s enabled. It can take up to a few hours for the PRT to refresh on its own. To refresh it manually run this command from a command prompt.

```cmd
dsregcmd.exe /RefreshPrt
```

## Validation 

Verify tickets are getting cached:

1. `klist get krbtgt/kerberos.microsoftonline.com` should return a ticket from on-prem realm.
1. `klist get cifs/<azfiles.host.name.com>` should return a ticket from kerberos.microsoftonline.com realm with SPN to <azfiles.host.name.com>


## Next steps

- For more information about moving file shares to Azure, see [Migrate to Azure file shares](/storage/files/storage-files-migration-overview.md).
