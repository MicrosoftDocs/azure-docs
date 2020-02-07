---
title: Controlled validation of hybrid Azure AD join - Azure AD
description: Learn how to do a controlled validation of hybrid Azure AD join before enabling it across the entire organization all at once

services: active-directory
ms.service: active-directory
ms.subservice: devices
ms.topic: conceptual
ms.date: 06/28/2019

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: sandeo

ms.collection: M365-identity-device-management
---
# Controlled validation of hybrid Azure AD join

When all of the pre-requisites are in place, Windows devices will automatically register as devices in your Azure AD tenant. The state of these device identities in Azure AD is referred as hybrid Azure AD join. More information about the concepts covered in this article can be found in the articles [Introduction to device management in Azure Active Directory](overview.md) and [Plan your hybrid Azure Active Directory join implementation](hybrid-azuread-join-plan.md).

Organizations may want to do a controlled validation of hybrid Azure AD join before enabling it across their entire organization all at once. This article will explain how to accomplish a controlled validation of hybrid Azure AD join.

## Controlled validation of hybrid Azure AD join on Windows current devices

For devices running the Windows desktop operating system, the supported version is the Windows 10 Anniversary Update (version 1607) or later. As a best practice, upgrade to the latest version of Windows 10.

To do a controlled validation of hybrid Azure AD join on Windows current devices, you need to:

1. Clear the Service Connection Point (SCP) entry from Active Directory (AD) if it exists
1. Configure client-side registry setting for SCP on your domain-joined computers using a Group Policy Object (GPO)
1. If you are using AD FS, you must also configure the client-side registry setting for SCP on your AD FS server using a GPO  
1. You may also need to [customize synchronization options](../hybrid/how-to-connect-post-installation.md#additional-tasks-available-in-azure-ad-connect) in Azure AD Connect to enable device synchronization. 


### Clear the SCP from AD

Use the Active Directory Services Interfaces Editor (ADSI Edit) to modify the SCP objects in AD.

1. Launch the **ADSI Edit** desktop application from and administrative workstation or a domain controller as an Enterprise Administrator.
1. Connect to the **Configuration Naming Context** of your domain.
1. Browse to **CN=Configuration,DC=contoso,DC=com** > **CN=Services** > **CN=Device Registration Configuration**
1. Right click on the leaf object under **CN=Device Registration Configuration** and select **Properties**
   1. Select **keywords** from the **Attribute Editor** window and click **Edit**
   1. Select the values of **azureADId** and **azureADName** (one at a time) and click **Remove**
1. Close **ADSI Edit**


### Configure client-side registry setting for SCP

Use the following example to create a Group Policy Object (GPO) to deploy a registry setting configuring an SCP entry in the registry of your devices.

1. Open a Group Policy Management console and create a new Group Policy Object in your domain.
   1. Provide your newly created GPO a name (for example, ClientSideSCP).
1. Edit the GPO and locate the following path: **Computer Configuration** > **Preferences** > **Windows Settings** > **Registry**
1. Right-click on the Registry and select **New** > **Registry Item**
   1. On the **General** tab, configure the following
      1. Action: **Update**
      1. Hive: **HKEY_LOCAL_MACHINE**
      1. Key Path: **SOFTWARE\Microsoft\Windows\CurrentVersion\CDJ\AAD**
      1. Value name: **TenantId**
      1. Value type: **REG_SZ**
      1. Value data: The GUID or **Directory ID** of your Azure AD instance (This value can be found in the **Azure portal** > **Azure Active Directory** > **Properties** > **Directory ID**)
   1. Click **OK**
1. Right-click on the Registry and select **New** > **Registry Item**
   1. On the **General** tab, configure the following
      1. Action: **Update**
      1. Hive: **HKEY_LOCAL_MACHINE**
      1. Key Path: **SOFTWARE\Microsoft\Windows\CurrentVersion\CDJ\AAD**
      1. Value name: **TenantName**
      1. Value type: **REG_SZ**
      1. Value data: Your verified **domain name** if you are using federated environment such as AD FS. Your verified **domain name** or your onmicrosoft.com domain name for example, `contoso.onmicrosoft.com` if you are using managed environment
   1. Click **OK**
1. Close the editor for the newly created GPO
1. Link the newly created GPO to the desired OU containing domain-joined computers that belong to your controlled rollout population

### Configure AD FS settings

If you are using AD FS, you first need to configure client-side SCP using the instructions mentioned above by linking the GPO to your AD FS servers. The SCP object defines the source of authority for device objects. It can be on-premises or Azure AD. When client-side SCP is configured for AD FS, the source for device objects is established as Azure AD.

> [!NOTE]
> If you failed to configure client-side SCP on your AD FS servers, the source for device identities would be considered as on-premises. ADFS will then start deleting device objects from on-premises directory after the stipulated period defined in the ADFS Device Registration's attribute "MaximumInactiveDays". ADFS Device Registration objects can be found using the [Get-AdfsDeviceRegistration cmdlet](https://docs.microsoft.com/powershell/module/adfs/get-adfsdeviceregistration?view=win10-ps).

## Controlled validation of hybrid Azure AD join on Windows down-level devices

To register Windows down-level devices, organizations must install [Microsoft Workplace Join for non-Windows 10 computers](https://www.microsoft.com/download/details.aspx?id=53554) available on the Microsoft Download Center.

You can deploy the package by using a software distribution system like [Microsoft Endpoint Configuration Manager](https://docs.microsoft.com/configmgr/). The package supports the standard silent installation options with the quiet parameter. The current branch of Configuration Manager offers benefits over earlier versions, like the ability to track completed registrations.

The installer creates a scheduled task on the system that runs in the user context. The task is triggered when the user signs in to Windows. The task silently joins the device with Azure AD with the user credentials after authenticating with Azure AD.

To control the device registration, you should deploy the Windows Installer package to your selected group of Windows down-level devices.

> [!NOTE]
> If a SCP is not configured in AD, then you should follow the same approach as described to [Configure client-side registry setting for SCP](#configure-client-side-registry-setting-for-scp)) on your domain-joined computers using a Group Policy Object (GPO).


After you verify that everything works as expected, you can automatically register the rest of your Windows current and down-level devices with Azure AD by [configuring SCP using Azure AD Connect](hybrid-azuread-join-managed-domains.md#configure-hybrid-azure-ad-join).

## Next steps

[Plan your hybrid Azure Active Directory join implementation](hybrid-azuread-join-plan.md)
