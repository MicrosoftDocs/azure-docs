---
title: Control the hybrid Azure AD join of your devices - Azure AD
description: Learn how to control the hybrid Azure AD join of your devices in Azure Active Directory.

services: active-directory
ms.service: active-directory
ms.subservice: devices
ms.topic: article
ms.date: 05/14/2019

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: sandeo

ms.collection: M365-identity-device-management
---
# Control the hybrid Azure AD join of your devices

When you have all the pre-requisites in place like Service Connection Point (SCP) in Active Directory (AD) is configured, Active Directory Federation Services(AD FS) claims rules have been configured for Hybrid Azure AD Join and/or Computer OUs are included in Azure AD Connect sync scope, then by default all Windows current domain-joined devices will automatically register devices in your Azure AD tenant. The state of these device identities in Azure AD is referred as Hybrid Azure AD join.

Although not required, customers may want to do a phased rollout of hybrid Azure AD join by deploying to a pilot group before deploying broadly. This article provides guidance on how you can control hybrid Azure AD join of your devices to do a phased rollout.

## Prerequisites

This article assumes that you're familiar with the concepts introduced in the following articles based on your environment:

* [Introduction to device management in Azure Active Directory](overview.md)
* [Plan your hybrid Azure Active Directory join implementation](hybrid-azuread-join-plan.md)
* [Configure hybrid Azure Active Directory join for managed domains](hybrid-azuread-join-managed-domains.md)
* [Configure hybrid Azure Active Directory join for federated domains](hybrid-azuread-join-federated-domains.md)

## Control Windows current devices

For devices running the Windows desktop operating system, the supported version is the Windows 10 version 1607 or later. As a best practice, upgrade to the latest version of Windows 10.

To control this behavior on Windows current devices, you need to:

1. Clear the SCP entry from Active Directory (AD) if it exists.
1. Configure client-side registry setting for SCP on your domain-joined computers using a Group Policy Object (GPO)
1. If you are using AD FS, you must also:
   1. Configure the client-side registry setting for SCP on you’re an AD FS server using a GPO  
   1. Uncheck “Automatically remove unused devices” under Services > Device Registration > Properties  

> [!NOTE]
> Ensure default configuration remains unchanged for “Register domain-joined computers as devices” GPO set to “Not Configured” and “Automatically register new Windows 10 domain joined devices with Azure Active Directory” set to “Yes” when using Configuration Manager.

After you verify that everything works as expected in a controlled environment, you can automatically register the rest of your Windows current devices with Azure AD by configuring SCP using Azure AD Connect.

## Clear the SCP from AD

Here is an example using Active Directory Services Interfaces Editor (ADSI Edit) application that you can use to modify objects in AD.

1. Launch ADSI Edit desktop application as an enterprise administrator on your DC
1. Connect to Configuration Naming Context and expand to the node Device Registration Configuration as shown below
1. Right click on the leaf under CN=Device Registration Configuration and select Properties
1. Select keywords from the Attribute Editor and click Edit
1. Select the values of azureADId and azureADName (one at a time) and click Remove

## Configure client-side registry setting for SCP

Here is an example of how to use GPO to deploy a registry setting.

1. Open a Group Policy Management Console (or gpmc.msc from the command prompt) and create a new Group Policy Object with a name (for example, ClientSideSCP)
1. Edit the GPO and locate the following path: Computer Configuration > Preferences > Windows Settings > Registry
1. Right click on the Registry and select New > Registry Item
   1. In General tab, use
   1. Action as "Update"
   1. Hive as “HKEY_LOCAL_MACHINE”
   1. Key Path as “SOFTWARE\Microsoft\Windows\CurrentVersion\CDJ\AAD
   1. Value name as “TenantId”
   1. Value type as “REG_SZ”
   1. Value data as the GUID of your tenant ID (to find the tenant ID, navigate to Azure portal > Azure Active Directory > Manage/Properties and then copy the “Directory ID”)
1. Right click on the Registry and select New > Registry Item
1. In General tab, use
   1. Action as "Update"
   1. Hive as “HKEY_LOCAL_MACHINE”
   1. Key Path as “SOFTWARE\Microsoft\Windows\CurrentVersion\CDJ\AAD
   1. Value name as “TenantName”
   1. Value type as “REG_SZ”
   1. Value data as your tenant domain (for example, contoso.onmicrosoft.com or any other verified domain name in your tenant)
1. Hit OK and Close the editor
1. Link the GPO to the desired OU containing domain-joined computers that belong to your controlled rollout population

## Configure AD FS settings

If you are using ADFS, you first need to configure client-side SCP using the instructions mentioned above but linking the GPO to your ADFS servers. This is needed for AD FS to establish the source for device identities as Azure AD. In addition, you need to make sure in AD FS that the device purge background task is disabled. To do that:

1. Open AD FS Management
1. Navigate to Services > Device Registration > Properties
1. Make sure that Automatically remove unused devices is NOT checked.

## Microsoft Workplace Join for non-Windows 10 computers

To register Windows down-level devices, organizations must install [Microsoft Workplace Join for non-Windows 10 computers](https://www.microsoft.com/download/details.aspx?id=53554) available on the Microsoft Download Center.

You can deploy the package by using a software distribution system like [System Center Configuration Manager](https://www.microsoft.com/cloud-platform/system-center-configuration-manager). The package supports the standard silent installation options with the quiet parameter. The current branch of Configuration Manager offers benefits over earlier versions, like the ability to track completed registrations.

The installer creates a scheduled task on the system that runs in the user’s context. The task is triggered when the user signs in to Windows. The task silently joins the device with Azure AD with the user credentials after authenticating with Azure AD.

To control the device registration, you should deploy the Windows Installer package only to a selected group of Windows down-level devices.  

> [!NOTE]
> If SCP is not configured in AD, then you should follow the same approach as described above to [Configure client-side registry setting for SCP]([Configure client-side registry setting for SCP](#configure-client-side-registry-setting-for-scp)) on your domain-joined computers using a Group Policy Object (GPO).

After you verify that everything works as expected in a controlled environment, you can automatically register the rest of your Windows down-level devices with Azure AD by deploying the package to all down-level devices and [configuring SCP using Azure AD Connect](hybrid-azuread-join-managed-domains.md#configure-hybrid-azure-ad-join).

## Next steps

[Plan your hybrid Azure Active Directory join implementation](hybrid-azuread-join-plan.md)
