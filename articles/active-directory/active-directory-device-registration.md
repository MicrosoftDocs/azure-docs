---
title: Automatic device registration with Azure Active Directory for Windows Domain-Joined Devices| Microsoft Docs
description: IT admins can choose to have their domain-joined Windows devices to register automatically and silently with Azure Active Directory (Azure AD) .
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: femila

ms.assetid: cdc25576-37f2-4afb-a786-f59ba4c284c2
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/18/2017
ms.author: markvi

---
# Automatic device registration with Azure Active Directory for Windows domain-joined devices

As an IT Administrator, you can choose to automatically and silently register your domain-joined Windows devices with Azure Active Directory (Azure AD). This can be useful if you have configured device based conditional access polices to Office365 applications or applications managed on-premises by AD FS. You can learn more about the device registration scenarios by reading the [Azure Active Directory Device Registration Overview](active-directory-conditional-access-device-registration-overview.md).

Automatic device registration with Azure Active Directory is available for the following domain-joined devices:

- Windows 10
- Windows 7 
- Windows 8.1 
- Windows Server 2016
- Windows Server 2012 R2
- Windows Server 2012 
- Windows Server 2008 R2

To begin registering your domain joined Windows devices with Azure AD, you need to ensure that you have an up-to-date version of Azure Active Directory Connect (Azure AD Connect) and configured. For more details, see [Integrating your on-premises with Azure Active Directory](connect/active-directory-aadconnect.md). Organizations need to be federated (e.g. using AD FS) for devices that are not Windows 10 or Windows Server 2016.


## Internet Explorer Configuration

Configure the following settings on Internet Explorer on your Windows devices for the Local intranet security zone:

- Don’t prompt for client certificate selection when only one certificate exists: Enable

- Allow scripting: Enable

- Automatic logon only in Intranet zone: Checked

These are the default settings for the Internet Explorer Local intranet security zone. You can view or manage these settings in Internet Explorer by navigating to `Internet Options > Security > Local intranet > Custom level`.  
You can also configure these settings using Active Directory Group Policy.

## Network Connectivity

Domain joined Windows devices must have connectivity to AD FS and an Active Directory Domain Controller to automatically register with Azure AD. This typically means the machine must be connected to the corporate network. This can include a wired connection, a Wi-Fi connection, DirectAccess, or VPN.

## Additional Notes

Device registration with Azure AD provides the broadest set of device capabilities. With Azure AD device registration, you can register both personal (BYOD) mobile devices and company owned, domain joined devices. The devices can be used with both hosted services such as Office365 and services managed on-premises with AD FS.

Companies that use both mobile and traditional devices or that use Office365, Azure AD, or other Microsoft services should register devices in Azure AD using the Azure AD Device Registration service. If your company does not use mobile devices and does not use any Microsoft services such as Office365, Azure AD, or Microsoft Intune and instead hosts only on-premises applications, you can choose to register devices in Active Directory using AD FS. You can learn more about deploying device registration with AD FS here.

## Next step

For detailed instructions on how to configure automated device registration, see [How to configure automatic registration of Windows domain-joined devices with Azure Active Directory](active-directory-conditional-access-automatic-device-registration-setup.md).



