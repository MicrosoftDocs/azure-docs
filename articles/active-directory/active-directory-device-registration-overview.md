---
title: Azure Active Directory device registration overview | Microsoft Docs
description: Azure Active Directory device registration is the foundation for device-based conditional access scenarios. When a device is registered, Azure Active Directory device registration provisions the device with an identity which is used to authenticate the device when the user signs in.
services: active-directory
keywords: device registration, enable device registration, device registration and MDM
documentationcenter: ''
author: MarkusVi
manager: femila
editor: ''

ms.assetid: 1e92c1a2-01b8-4225-950b-373cd601b035
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 03/08/2017
ms.author: markvi

---
# Get started with Azure Active Directory device registration
Azure Active Directory device registration is the foundation for device-based conditional access scenarios. When a device is registered, Azure Active Directory device registration provides the device with an identity which is used to authenticate the device when the user signs in. The authenticated device, and the attributes of the device, can then be used to enforce conditional access policies for applications that are hosted in the cloud and on-premises.

When combined with a mobile device management(MDM) solution such as Microsoft Intune, the device attributes in Azure Active Directory are updated with additional information about the device. This allows you to create conditional access rules that enforce access from devices to meet your standards for security and compliance. For more information on enrolling devices in Microsoft Intune, see [Enroll devices for management in Intune](https://docs.microsoft.com/intune/deploy-use/enroll-devices-in-microsoft-intune).

## Scenarios enabled by Azure Active Directory device registration
Azure Active Directory device registration includes support for iOS, Android, and Windows devices. The individual scenarios that utilize Azure AD device registration may have more specific requirements and platform support. These scenarios are as follows:

* **Conditional access to applications that are hosted on-premises**: You can use registered devices with access policies for applications that are configured to use AD FS with Windows Server 2012 R2. For more information about setting up conditional access for on-premises, see [Setting up On-premises Conditional Access using Azure Active Directory device registration](active-directory-device-registration-on-premises-setup.md).
* **Conditional access for Office 365 applications with Microsoft Intune** : IT admins can provision conditional access device policies to secure corporate resources, while at the same time allowing information workers on compliant devices to access the services. For more information, see [Conditional Access Device Policies for Office 365 services](active-directory-conditional-access-device-policies.md).

## Setting up Azure Active Directory device registration
You need to enable Azure AD device registration in the Azure Portal so that mobile devices  can discover the service by looking for well-known DNS records. You must configure your company DNS so that Windows 10, Windows 8.1, Windows 7, Android and iOS devices can discover and use the service.
You can view and enable/disable registered devices using the Administrator Portal in Azure Active Directory.

> [!NOTE]
> For latest instructions on how to set up automatic device registration see, [How to setup automatic registration of Windows domain joined devices with Azure Active Directory](active-directory-conditional-access-automatic-device-registration-setup.md).
> 
> 

### Enable Azure Active Directory device registration Service
1. Sign in to the Microsoft Azure portal as Administrator.
2. On the left pane, select **Active Directory**.
3. On the **Directory** tab, select your directory.
4. Select the **Configure** tab.
5. Scroll to the section called **Devices**.
6. Select **ALL** for **USERS MAY WORKPLACE JOIN DEVICES**.
7. Select the maximum number of devices you want to authorize per user.

> [!NOTE]
> Enrollment with Microsoft Intune or Mobile Device Management for Office 365 requires Workplace Join. If you have configured either of these services, ALL is selected and the NONE button is disabled.
> 
> 

By default, two-factor authentication is not enabled for the service. However, two-factor authentication is recommended when registering a device.

* Before requiring two-factor authentication for this service, you must configure a two-factor authentication provider in Azure Active Directory and configure your user accounts for Multi-Factor Authentication, see [Adding Multi-Factor Authentication to Azure Active Directory](../multi-factor-authentication/multi-factor-authentication-get-started-cloud.md)
* If you are using AD FS with Windows Server 2012 R2, you must configure a two-factor authentication module in AD FS, see [Using Multi-Factor Authentication with Active Directory Federation Services](../multi-factor-authentication/multi-factor-authentication-get-started-server.md).

## Configure Azure Active Directory device registration discovery
Windows 7 and Windows 8.1 devices will discover the device registration service by combining the user account name with a well-known device registration server name.

You must create a DNS CNAME record that points to the A record associated with your Azure Active Directory device registration service. The CNAME record must use the well-known prefix enterpriseregistration followed by the UPN suffix used by the user accounts at your organization. If your organization uses multiple UPN suffixes, multiple CNAME records must be created in DNS.

For example, if you use two UPN suffixes at your organization named @contoso.com and @region.contoso.com, you will create the following DNS records.

| Entry | Type | Address |
| --- | --- | --- |
| enterpriseregistration.contoso.com |CNAME |enterpriseregistration.windows.net |
| enterpriseregistration.region.contoso.com |CNAME |enterpriseregistration.windows.net |

## View and manage device objects in Azure Active Directory
1. From the Azure Administrator portal, you can view, block, and unblock devices. A device that is blocked will no longer have access to applications that are configured to allow only registered devices.
2. Log on to the Microsoft Azure Portal as Administrator.
3. On the left pane, select **Active Directory**.
4. Select your directory.
5. Select the **Users** tab. Then select a user to view their devices
6. Select the **Devices** tab.
7. Select **Registered Devices** from the drop down menu.
8. Here you can view, block, or unblock the users registered devices.

## Additional topics
You can register your Windows 7 and Windows 8.1 Domain Joined devices with Azure AD device registration. The following topics provides more information about the prerequisites and the steps required to configure device registration on Windows 7 and Windows 8.1 devices.

* [Automatic device registration with Azure Active Directory for Windows Domain-Joined Devices](active-directory-conditional-access-automatic-device-registration.md)
* [Automatic device registration with Azure Active Directory for Windows 10 domain-joined devices](active-directory-azureadjoin-devices-group-policy.md)

