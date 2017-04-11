---
title: How to configure automatic registration of Windows domain-joined devices with Azure Active Directory | Microsoft Docs
description: Set up your domain-joined Windows devices to register automatically and silently with Azure Active Directory.
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: femila
editor: ''

ms.assetid: 54e1b01b-03ee-4c46-bcf0-e01affc0419d
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/09/2017
ms.author: markvi

---
# Get started with Azure Active Directory device registration

Azure Active Directory device registration is the foundation for device-based conditional access scenarios. 
When a device is registered, Azure Active Directory device registration provides the device with an identity which is used 
to authenticate the device when the user signs in. 
The authenticated device, and the attributes of the device, can then be used to enforce conditional access policies for applications that are hosted 
in the cloud and on-premises.

When combined with a mobile device management(MDM) solution such as Microsoft Intune, the device attributes in Azure Active Directory 
are updated with additional information about the device. 
This allows you to create conditional access rules that enforce access from devices to meet your standards for security and compliance. For more information on enrolling devices in Microsoft Intune, see Enroll devices for management in Intune.
Scenarios enabled by Azure Active Directory Device Registration
Azure Active Directory Device Registration includes support for iOS, Android, and Windows devices. 
The individual scenarios that utilize Azure AD Device Registration may have more specific requirements and platform support. 

These scenarios are as follows:

- **Conditional access for Office 365 applications with Microsoft Intune:** IT admins can provision conditional access device policies to secure 
  corporate resources, while at the same time allowing information workers on compliant devices to access the services. For more information, see Conditional Access Device Policies for Office 365 services.

- **Conditional access to applications that are hosted on-premises:** You can use registered devices with access policies for applications that are configured 
to use AD FS with Windows Server 2012 R2. For more information about setting up conditional access for on-premises, see 
[Setting up On-premises Conditional Access using Azure Active Directory device registration](active-directory-device-registration-on-premises-setup.md).

## Setting up Azure Active Directory Device Registration

To setup device registration, you have multiple options:

- Devices can register when joined to Azure AD domain. For more on this topic, you can Learn more about Azure AD Join and the settings required for users to join Azure AD domain.

- Devices can be registered when users add work or school accounts to Windows on a personal device or when mobile devices connect to a work resources requiring registration. To ensure this, you must enable Azure AD Device Registration in the Azure Portal. 

- Devices can be registered using automatic device registration for traditional domain-joined machines. To ensure this, you must first Setup Azure AD Connect before you continue with automatic device registration.

For latest instructions, see [How to configure automatic registration of Windows domain-joined devices with Azure Active Directory](active-directory-conditional-access-automatic-device-registration-setup.md).  
You can also review and enable or disable registered devices using the Administrator Portal in Azure Active Directory.

## Enable the Azure Active Directory device registration service

**To enable the Azure Active Directory device registration service:**

1.	Sign in to the Microsoft Azure portal as administrator.

2.	On the left pane, select **Active Directory**.

3.	On the Directory tab, select your directory.

4.	Click **Configure**.

5.	Scroll to **Devices**.

6.	Select ALL for USERS MAY REGISTER THEIR DEVICES WITH AZURE AD.

7.	Select the maximum number of devices you want to authorize per user.

The enrollment with Microsoft Intune or Mobile Device Management for Office 365 requires device registration. If you have configured either of these services, **ALL** is selected and **NONE** is disabled. 
Please ensure that they are configured correctly and have the appropriate licensing.

By default, two-factor authentication is not enabled for the service. However, two-factor authentication is recommended when registering a device.

- Before requiring two-factor authentication for this service, you must configure a two-factor authentication provider in Azure Active Directory and configure your user accounts for Multi-Factor Authentication, see Adding Multi-Factor Authentication to Azure Active Directory

- If you are using AD FS with Windows Server 2012 R2, you must configure a two-factor authentication module in AD FS, see Using Multi-Factor Authentication with Active Directory Federation Services.

## View and manage device objects in Azure Active Directory

From the Azure Administrator portal, you can view, block, and unblock devices. 
A device that is blocked will no longer have access to applications that are configured to allow only registered devices.

**To view and manage device objects in Azure Active Directory:**
 
1.	Log on to the Microsoft Azure portal as administrator.

2.	On the left pane, select **Active Directory**.

3.	Select your directory.

4.	Select **Users**. 

5.  Click the user for which you want to see the devices.

6.	Select **Devices**.

7.	Select **Registered Devices**.

Now, you can review, block, or unblock the user's registered devices.
Windows 10 devices that are on-premises domain-joined and automatically registered do not appear under the Users tab. Please use the Get-MsolDevice PowerShell command to find all your enterprise devices. 


## Next steps

To setup automated device registration, see [How to configure automatic registration of Windows domain-joined devices with Azure Active Directory](active-directory-conditional-access-automatic-device-registration-setup.md).


