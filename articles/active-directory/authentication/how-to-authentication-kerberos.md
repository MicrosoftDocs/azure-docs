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
<!---This list of scenarios will grow after they have SQL online, native Azure Files support, and then app proxy--->

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
|Use a storage account provided by Azure Files team hosted in pre-prod environment |Email Azure Files team @ FilesADAuth@microsoft.com to create the storage account with:<br>- **Subscription ID**: Choose from existing subscriptions<br>- **Resource Group Name**: Choose from existing resource groups<br>- **Storage Account Name**: Provide a new name that you intend to use for your storage account. (If the name is taken, we will append random strings behind the given name.) |
| Azure AD connect installed | Hybrid environments where identities exist both in Azure AD and Active Directory Domain Services |

## Limitations

### Azure AD cached logon 

In case of upgrades and fresh deployment, there is a potential for the user accounts to not have the refreshed TGT (ticket granting ticket) immediately i.e. within 4 hours resulting in failed tickets requests from Azure AD. As Windows tries to limit how often it connects to AAD so during that period there is a possibility that the machine hasn’t gotten a TGT yet. As an administrator, you can trigger an online logon immediately to handle upgrade scenarios by running the command below and then locking and unlocking the user session to get a refreshed TGT.

```cmd
dsregcmd.exe /RefreshPrt
```

### Running on-premises-backed Azure Files and cloud-backed Azure Files in the same environment

There is a known limitation with having two or more different Azure Files services with one backed by an on-premises Active Directory environment and the other backed by Azure AD. This is only needed for customers who already have Azure files services using AD authentication in their environment and are now moving to Azure AD backed Azure files with this preview. Windows relies on the namespace of the service (*.file.core.windows.net) to identify whether it should contact Azure AD for a Kerberos ticket or Active Directory. Since both services use the same namespace, Windows cannot distinguish between an on-prem configuration and a cloud configuration. 

To support both these in the same environment, you can provide the Windows client configuration information to choose the correct realm. This is handled by updating the the following Group Policy setting:

**Computer Configuration\Administrative Templates\System\Kerberos\Define host name-to-Kerberos realm mappings**

By Default, all the Azure Files instances will be configured to on-premises and you will be required to list only the cloud instance separately. 

YOURDOMAIN.COM => .file.core.windows.net

KERBEROS.MICROSOFTONLINE.COM => instance1.file.core.windows.net,instance2.file.core.windows.net

## Deployment steps 

### Azure AD set up 

There is no Azure AD set up required for enabling native Azure AD Authentication for accessing Azure files over Wi-Fi. The prerequisites are mentioned under section 5: the latest Windows client insider builds (21304+) and an Azure AD subscription. With this preview, Azure AD is now its own independent Kerberos realm. The clients are already enlightened and will redirect clients to access Azure AD Kerberos to request a Kerberos ticket. By default, this capability for the clients to access Azure AD Kerberos is switched off and you need the below policy change to enable this feature on the clients. This setting can be used to deploy this feature in a staged manner by choosing specific clients you want to pilot on and then expanding it to all the clients across your environment. 

Enable the following Group Policy setting:

**Administrative Templates\System\Kerberos\Allow retrieving the cloud kerberos ticket during the logon**

![Screenshot of group policy setting Allow retrieving the cloud kerberos ticket during the logon.](media\how-to-kerberos-authentication-azure-files\gp.png)

Note that users with existing logon sessions may need to refresh their PRT if they attempt to use this feature immediately after it’s enabled. It can take up to a few hours for the PRT to refresh on its own. To refresh it manually run this command from a command prompt.

```cmd
dsregcmd.exe /RefreshPrt
```

## Validation Scenarios

Run through the following validation scenarios to confirm Kerberos authentication is working for Azure Files. 

### Share mount

1. To validate share mounting, run the following command from a command line:

   ```comd
   net use <DriveLetter>: \\<your-storage-account-name>.file.core.windows.net\<your-share-name> /persistent:yes
   ```

1. Open the drive letter from Explorer and verify connectivity without any prompts.
1. Reboot the machine and log back into Windows.
1. Verify the drive is reconnected.

### Share-level permissions

In the section to set up Azure Files, there is a guide on how to assign share-level permissions to users’ Azure AD identities using Azure Portal.  We’d want to validate that these permissions are enforced by doing the following:

1. Assign a user **Storage File Data SMB Share Reader** permissions to authorize them read access of the file share.
1. Validate they have mounted the share.
1. Try to add a new file to the share – the expectation is that this fails.

### File-level permissions

In the section to set up Azure Files, there is a guide on how to configure file-level permissions to assign granular access for users at the file and directory level.  We’d want to validate that these permissions are enforced by doing the following:

1. Mount the share using storage account and key.
1. Create a file.
1. Configure the file’s permission such that a user is denied access to that file.
1. Mount the share as the denied user.
1. Verify that they cannot access the file.  

## Troubleshooting 

### Verify tickets are getting cached

1. `klist get krbtgt/kerberos.microsoftonline.com` should return a ticket from on-prem realm.

1. `klist get cifs/<azfiles.host.name.com>` should return a ticket from kerberos.microsoftonline.com realm with SPN to <azfiles.host.name.com>

### Verify and investigate connection issues to Azure Storage

1. Verify connectivity over Port 445 using Test-NetConnection cmdlet, for an example, use [this reference](/storage/files/storage-troubleshoot-windows-file-connection-problems.md#cause-1-port-445-is-blocked).
1. For other issues specific to storage, refer to our [Windows client troubleshooting guide](/storage/files/storage-troubleshoot-windows-file-connection-problems.md).

### Investigate message flow failures

1. Wireshark traffic between client and on-prem KDC. Expect: 
   AS-REQ: Client => on-prem KDC => returns on-prem TGT
   TGS-REQ: Client => on-prem KDC => returns referral to kerberos.microsoftonline.com

1. Fiddler traffic between client and ESTS over HTTPS (run as admin). Expect:
   TGS-REQ: Client => login.msol.com/{tenant}/kerberos => returns ticket to <azfiles.host.name.com>
   Use the [plugin to decode Kerberos messages](https://github.com/dotnet/Kerberos.NET/releases/tag/ext-installer-v1)

### Verify existing commands work as expected

Log collection for troubleshooting.

1. Collect fiddler traces and Request Id or Correlation Id from response headers.
1. Use aka.ms/logsminerto search for traces.
1. Collect Windows ETL traces from client.

## Collect logs with Feedback Hub

Please collect logs by using **Feedback Hub** to share any feedback or report any issues while logging into the client:

1. Open feedback hub and create a new feedback item.
1. Select the **Security and Privacy** category, and then the **Logging into Your PC** subcategory.
1. Click **Start capture** and reproduce the issue. Monitoring persists across Logon/Logoff and reboots.
1. Return to Feedback Hub, click **Stop capture**, and submit your feedback. If you already filed a bug and were asked to collect additional logs, please parent your new feedback to the existing bug.

## Next steps

- For more information about moving file shares to Azure, see [Migrate to Azure file shares](/storage/files/storage-files-migration-overview.md).
