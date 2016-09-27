<properties
	pageTitle="Azure Active Directory Device Registration overview | Microsoft Azure"
	description="is the foundation for device-based conditional access scenarios. When a device is registered, Azure Active Directory Device Registration provisions the device with an identity which is used to authenticate the device when the user signs in."
	services="active-directory"
	keywords="device registration, enable device registration, device registration and MDM"
	documentationCenter=""
	authors="femila"
	manager="swadhwa"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="06/23/2016"
	ms.author="femila"/>

# Get started with Azure Active Directory Device Registration

Azure Active Directory Device Registration is the foundation for device-based conditional access scenarios. When a device is registered, Azure Active Directory Device Registration provides the device with an identity which is used to authenticate the device when the user signs in. The authenticated device, and the attributes of the device, can then be used to enforce conditional access policies for applications that are hosted in the cloud and on-premises.

When combined with a mobile device management(MDM) solution such as Intune, the device attributes in Azure Active Directory are updated with additional information about the device. This allows you to create conditional access rules that enforce access from devices to meet your standards for security and compliance.

Azure Active Directory Device Registration is available in your Azure Active Directory. The service includes support for iOS, Android, and Windows devices. The individual scenarios that utilize Azure Active Directory Device Registration may have more specific requirements and platform support.

## Scenarios enabled by Azure Active Directory Device Registration

Azure Active Directory Device Registration includes support for iOS, Android, and Windows devices. The individual scenarios that utilize Azure AD Device Registration may have more specific requirements and platform support. These scenarios are as follows:

- **Conditional access to applications that are hosted on-premises**: You can use registered devices with access policies for applications that are configured to use AD FS with Windows Server 2012 R2. For more information about setting up conditional access for on-premises, see [Setting up On-premises Conditional Access using Azure Active Directory Device Registration](active-directory-conditional-access-on-premises-setup.md).

- **Conditional access for Office 365 applications with Microsoft Intune** : IT admins can provision conditional access device policies to secure corporate resources, while at the same time allowing information workers on compliant devices to access the services. For more information, see Conditional Access Device Policies for Office 365 services.

##Setting up Azure Active Directory Device Registration

You need to enable Azure AD Device Registration in the Azure Portal so that mobile devices  can discover the service by looking for well-known DNS records. You must configure your company DNS so that Windows 10, Windows 8.1, Windows 7, Android and iOS devices can discover and use the service.
You can view and enable/disable registered devices using the Administrator Portal in Azure Active Directory.

### Enable Azure Active Directory Device Registration Service

1. Sign in to the Microsoft Azure portal as Administrator.
2. On the left pane, select **Active Directory**.
3. On the **Directory** tab, select your directory.
4. Select the **Configure** tab.
5. Scroll to the section called **Devices**.
6. Select **ALL** for **USERS MAY WORKPLACE JOIN DEVICES**.
7. Select the maximum number of devices you want to authorize per user.

>[AZURE.NOTE]
>Enrollment with Microsoft Intune or Mobile Device Management for Office 365 requires Workplace Join. If you have configured either of these services, ALL is selected and the NONE button is disabled.

By default, two-factor authentication is not enabled for the service. However, two-factor authentication is recommended when registering a device.

- Before requiring two-factor authentication for this service, you must configure a two-factor authentication provider in Azure Active Directory and configure your user accounts for Multi-Factor Authentication, see [Adding Multi-Factor Authentication to Azure Active Directory](../multi-factor-authentication/multi-factor-authentication-get-started-cloud.md)

- If you are using AD FS with Windows Server 2012 R2, you must configure a two-factor authentication module in AD FS, see [Using Multi-Factor Authentication with Active Directory Federation Services](../multi-factor-authentication/multi-factor-authentication-get-started-server.md).

## Configure Azure Active Directory Device Registration discovery
Windows 7 and Windows 8.1 devices will discover the Device Registration service by combining the user account name with a well-known Device Registration server name.

You must create a DNS CNAME record that points to the A record associated with your Azure Active Directory Device Registration service. The CNAME record must use the well-known prefix enterpriseregistration followed by the UPN suffix used by the user accounts at your organization. If your organization uses multiple UPN suffixes, multiple CNAME records must be created in DNS.

For example, if you use two UPN suffixes at your organization named @contoso.com and @region.contoso.com, you will create the following DNS records.

| Entry                                     | Type  | Address                            |
|-------------------------------------------|-------|------------------------------------|
| enterpriseregistration.contoso.com        | CNAME | enterpriseregistration.windows.net |
| enterpriseregistration.region.contoso.com | CNAME | enterpriseregistration.windows.net |

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

You can register your Windows 7 and Windows 8.1 Domain Joined devices with Azure AD Device Registration. The following topic provides more information about the prerequisites and the steps required to configure device registration on Windows 7 and Windows 8.1 devices.

- [Automatic Device Registration with Azure Active Directory for Windows Domain-Joined Devices](active-directory-conditional-access-automatic-device-registration.md)
- [Configure automatic device registration for Windows 7 domain joined devices](active-directory-conditional-access-automatic-device-registration-windows7.md)
- [Configure automatic device registration for Windows 8.1 domain joined devices](active-directory-conditional-access-automatic-device-registration-windows-8-1.md)
- [Automatic device registration with Azure Active Directory for Windows 10 domain-joined devices](active-directory-azureadjoin-devices-group-policy.md)
