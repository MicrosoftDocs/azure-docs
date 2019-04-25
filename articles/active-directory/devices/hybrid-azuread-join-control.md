---
title: Control the hybrid Azure AD join of your devices | Microsoft Docs
description: Learn how to control the hybrid Azure AD join of your devices in Azure Active Directory.
services: active-directory
documentationcenter: ''
author: MicrosoftGuyJFlo
manager: daveba
editor: ''

ms.assetid: 54e1b01b-03ee-4c46-bcf0-e01affc0419d
ms.service: active-directory
ms.subservice: devices
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/31/2018
ms.author: joflore
ms.reviewer: sandeo

ms.collection: M365-identity-device-management
---
# Control the hybrid Azure AD join of your devices

Hybrid Azure Active Directory (Azure AD) join is a process to automatically register your on-premises domain-joined devices with Azure AD. There are cases where you don't want all your devices to be registered automatically. This is true, for example, during the initial rollout to verify that everything works as expected.

This article provides guidance on how you can control hybrid Azure AD join of your devices. 


## Prerequisites

This article assumes that you're familiar with:

-  [Introduction to device management in Azure Active Directory](../device-management-introduction.md)
 
-  [Plan your hybrid Azure Active Directory join implementation](hybrid-azuread-join-plan.md)

-  [Configure hybrid Azure Active Directory join for managed domains](hybrid-azuread-join-managed-domains.md) or [Configure hybrid Azure Active Directory join for federated domains](hybrid-azuread-join-federated-domains.md)



## Control Windows current devices

For devices running the Windows desktop operating system, the supported version is the Windows 10 Anniversary Update (version 1607) or later. As a best practice, upgrade to the latest version of Windows 10.

All Windows current devices automatically register with Azure AD at device start or user sign-in. You can control this behavior by using either a Group Policy Object (GPO) or System Center Configuration Manager.

To control Windows current devices, you need to: 


1.	**To all devices**: Disable automatic device registration.
2.	**To selected devices**: Enable automatic device registration.

After you verify that everything works as expected, you're ready to enable automatic device registration for all devices again.



### Group Policy Object 

You can control the device registration behavior of your devices by deploying the following GPO: **Register domain-joined computers as devices**.

To set the GPO:

1.	Open **Server Manager**, and then go to **Tools** > **Group Policy Management**.

2.	Go to the domain node that corresponds to the domain where you want to disable or enable the auto-registration.

3.	Right-click **Group Policy Objects**, and then select **New**.

4.	Enter a name (for example, **Hybrid Azure AD join**) for your Group Policy Object. 

5.	Select **OK**.

6.	Right-click your new GPO, and then select **Edit**.

7.	Go to **Computer Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Device Registration**. 

8.	Right-click **Register domain-joined computers as devices**, and then select **Edit**.

    > [!NOTE] 
    > This Group Policy template has been renamed from earlier versions of the Group Policy Management console. If you're using an earlier version of the console, go to **Computer Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Device Registration** > **Register domain joined computer as device**. 

9.	Select one of the following settings, and then select **Apply**:

    - **Disabled**: To prevent automatic device registration.
    - **Enabled**: To enable automatic device registration.

10.	Select **OK**.

You need to link the GPO to a location of your choice. For example, to set this policy for all domain-joined current devices in your organization, link the GPO to the domain. To do a controlled deployment, set this policy to domain-joined Windows current devices that belong to an organizational unit or a security group.

### Configuration Manager controlled deployment 

You can control the device registration behavior of your current devices by configuring the following client setting: **Automatically register new Windows 10 domain joined devices with Azure Active Directory**.

To configure the client setting:

1.	Open **Configuration Manager**, select **Administration**, and then go to **Client Settings**.

2.	Open the properties for **Default Client Settings** and select **Cloud Services**.

3.	Under **Device Settings**, select one of the following settings for **Automatically register new Windows 10 domain joined devices with Azure Active Directory**:

    - **No**: To prevent automatic device registration.
    - **Yes**: To enable automatic device registration.

4.	Select **OK**.

You need to link this client setting to a location of your choice. For example, to configure this client setting for all Windows current devices in your organization, link the client setting to the domain. To do a controlled deployment, you can configure the client setting to domain-joined Windows current devices that belong to an organizational unit or a security group.

> [!Important]
> Although the preceding configuration takes care of existing domain-joined Windows 10 devices, devices that are newly joining the domain might still try to complete the hybrid Azure AD join because of the potential delay in the application of Group Policy or Configuration Manager settings on the devices. 
>
> To avoid this, we recommend that you create a new Sysprep image (used as an example for a provisioning method). Create it from a device that was never previously hybrid Azure AD joined and that already has the Group Policy setting or Configuration Manager client setting applied. You must also use the new image for provisioning new computers that join your organization's domain. 

## Control Windows down-level devices

To register Windows down-level devices, you need to download and install the Windows Installer package (.msi) from Download Center on the [Microsoft Workplace Join for non-Windows 10 computers](https://www.microsoft.com/download/details.aspx?id=53554) page.

You can deploy the package by using a software distribution system like [System Center Configuration Manager](https://www.microsoft.com/cloud-platform/system-center-configuration-manager). The package supports the standard silent installation options with the quiet parameter. The current branch of Configuration Manager offers benefits over earlier versions, like the ability to track completed registrations.

The installer creates a scheduled task on the system that runs in the user’s context. The task is triggered when the user signs in to Windows. The task silently joins the device with Azure AD with the user credentials after authenticating with Azure AD.

To control the device registration, you should deploy the Windows Installer package only to a selected group of Windows down-level devices. If you have verified that everything works as expected, you're ready to roll out the package to all down-level devices.


## Next steps

* [Introduction to device management in Azure Active Directory](../device-management-introduction.md)



