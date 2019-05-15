---
title: Controlled rollout of hybrid Azure AD join - Azure AD
description: Learn how to phase the hybrid Azure AD join rollout of your devices in Azure Active Directory

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
# Phased hybrid Azure AD join rollout

Organizations may not want to enable Azure AD join across their entire organization all at once. This article will explain how to accomplish a phased rollout of hybrid Azure AD join. Most organizations should use the standard recommended guidance found in the following articles:

* [Configure hybrid Azure Active Directory join for managed domains](hybrid-azuread-join-managed-domains.md)
* [Configure hybrid Azure Active Directory join for federated domains](hybrid-azuread-join-federated-domains.md)

When all of the pre-requisites are in place, by default all Windows 10 version 1607 or later devices will automatically register as devices in your Azure AD tenant. The state of these device identities in Azure AD is referred as hybrid Azure AD join. More information about the concepts covered in this article can be found in the articles [Introduction to device management in Azure Active Directory](overview.md) and [Plan your hybrid Azure Active Directory join implementation](hybrid-azuread-join-plan.md).

## Control hybrid Azure AD join on Windows 10 devices

Windows 10 devices, running Windows 10 version 1607 or later, are supported in hybrid Azure AD joined environments. For the best experience, we recommend organizations upgrade to the latest version.

To control this behavior on Windows current devices, you need to:

1. Clear the Service Connection Point (SCP) entry from Active Directory (AD) if it exists
1. Configure client-side registry setting for SCP on your domain-joined computers using a Group Policy Object (GPO)
1. If you are using AD FS, you must also:
   1. Configure the client-side registry setting for SCP on you’re an AD FS server using a GPO  
   1. Uncheck “Automatically remove unused devices” under Services > Device Registration > Properties  

> [!NOTE]
> Ensure default configuration remains unchanged for “Register domain-joined computers as devices” GPO set to “Not Configured” and “Automatically register new Windows 10 domain joined devices with Azure Active Directory” set to “Yes” when using Configuration Manager.

After you verify that everything works as expected in a controlled environment, you can automatically register the rest of your Windows current devices with Azure AD by configuring SCP using Azure AD Connect as explained in the section [Complete rollout](#complete-rollout).

### Clear the SCP from AD

Use the Active Directory Services Interfaces Editor (ADSI Edit) to modify the SCP objects in AD.

1. Launch the **ADSI Edit** desktop application from and administrative workstation or a domain controller as an Enterprise Administrator.
1. Connect to the **Configuration Naming Context** of your domain.
1. Browse to **CN=Configuration,DC=contoso,DC=com** > **CN=Services** > **CN=Device Registration Configuration**
1. Right click on the leaf object under **CN=Device Registration Configuration** and select **Properties**
   1. Select **keywords** from the **Attribute Editor** window and click **Edit**
   1. Select the values of **azureADId** and **azureADName** (one at a time) and click **Remove**
1. Close **ADSI Edit**

> [!NOTE]
> If a SCP is not configured in AD, then you should follow the same approach as described to [Configure client-side registry setting for SCP](#configure-client-side-registry-setting-for-scp)) on your domain-joined computers using a Group Policy Object (GPO).

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
      1. Value data: Your verified **domain name** in Azure AD (for example, `contoso.onmicrosoft.com` or any other verified domain name in your directory)
   1. Click **OK**
1. Close the editor for the newly created GPO
1. Link the newly created GPO to the desired OU containing domain-joined computers that belong to your controlled rollout population

### Configure AD FS settings

If you are using AD FS, you first need to configure client-side SCP using the instructions mentioned above but linking the GPO to your AD FS servers. This configuration is needed for AD FS to establish the source for device identities as Azure AD. In addition, you need to make sure in AD FS that the device purge background task is disabled. To do that:

1. Open **AD FS Management**
1. Navigate to **Services** > **Device Registration** > **Properties**
1. Make sure that **Automatically remove unused devices** is NOT checked.

## Microsoft Workplace Join for non-Windows 10 computers

To register Windows down-level devices, organizations must install [Microsoft Workplace Join for non-Windows 10 computers](https://www.microsoft.com/download/details.aspx?id=53554) available on the Microsoft Download Center.

You can deploy the package by using a software distribution system like [System Center Configuration Manager](https://www.microsoft.com/cloud-platform/system-center-configuration-manager). The package supports the standard silent installation options with the quiet parameter. The current branch of Configuration Manager offers benefits over earlier versions, like the ability to track completed registrations.

The installer creates a scheduled task on the system that runs in the user context. The task is triggered when the user signs in to Windows. The task silently joins the device with Azure AD with the user credentials after authenticating with Azure AD.

To control the device registration, you should deploy the Windows Installer package to your selected group of Windows down-level devices.  

## Complete rollout

After you verify that everything works as expected in a controlled environment, you can automatically register the rest of your Windows down-level devices with Azure AD by deploying the package to all down-level devices and [configuring SCP using Azure AD Connect](hybrid-azuread-join-managed-domains.md#configure-hybrid-azure-ad-join).

## Next steps

[Plan your hybrid Azure Active Directory join implementation](hybrid-azuread-join-plan.md)
