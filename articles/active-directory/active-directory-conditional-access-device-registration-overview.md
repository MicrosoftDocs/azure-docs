<properties
	pageTitle="Azure Active Directory Device Registration Overview| Microsoft Azure"
	description="is the foundation for device-based conditional access scenarios. When a device is registered, Azure Active Directory Device Registration provisions the device with an identity which is used to authenticate the device when the user signs in."
	services="active-directory"
	documentationCenter=""
	authors="femila"
	manager="stevenpo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/02/2015"
	ms.author="femila"/>

# Azure Active Directory Device Registration overview

Azure Active Directory Device Registration is the foundation for device-based conditional access scenarios. When a device is registered, Azure Active Directory Device Registration provisions the device with an identity which is used to authenticate the device when the user signs in. The authenticated device, and the attributes of the device, can then be used to enforce conditional access policies for applications that are hosted in the cloud and on-premises.
When combined with a Mobile Device Management solution such as Intune, the device attributes in Azure Active Directory will be updated with additional information about the device. This allows you to create conditional access rules that enforce access from devices will meet your standards for security and compliance.
Azure Active Directory Device Registration is available in your Azure Active Directory. The service includes support for iOS, Android, and Windows devices. The individual scenarios that utilize Azure Active Directory Device Registration may have more specific requirements and platform support. Read on to learn more about the specific scenarios that are available to you today.

## Scenarios enabled by Azure Active Directory Device Registration

Azure AD Device Registration can be thought of as the foundation for a variety of scenarios. In general, the service includes support for iOS, Android, and Windows devices. The individual scenarios that utilize Azure AD Device Registration may have more specific requirements and platform support. These scenarios are as follows:
Conditional Access to applications that are hosted on-premises: You can use registered devices with access policies for applications that are configured to use AD FS with Windows Server 2012 R2. For more information about setting up conditional access for on-premises, see Setting up On-premises Conditional Access using Azure Active Directory Device Registration. 

Conditional Access for Office 365 applications with Microsoft Intune: : IT admins can provision conditional access device policies to secure corporate resources, while at the same time allowing information workers on compliant devices to access the services. For more information, see Conditional Access Device Policies for Office 365 services

##Setting up Azure Active Directory Device Registration

The following settings are available for the Azure Active Directory Device Registration service:
Enable Azure AD Device Registration in the Azure Portal.

Windows Devices discover the service by looking for well-known DNS records. You must configure your company DNS so that Windows 7 and Windows 8.1 devices can discover and use the service.

You can view and enable/disable registered devices using the Administrator Portal in Azure Active Directory. 

## Enable Azure Active Directory Device Registration
The following section describes how to enable the Azure Active Directory Device Registration Service for your directory.
To enable Azure Active Directory Device Registration Service
-------------------------------------------------------------
1. Log on to the Azure Portal as Administrator.
1. On the left pane, select **Active Directory**.
1. On the **Directory** tab, select your directory.
1. Select the **Configure** tab.
1. Scroll to the section called **Devices**.
1. Select **ALL** for **USERS MAY WORKPLACE JOIN DEVICES**.
1. Select the maximum number of devices you want to authorize per user.

>[AZURE.NOTE]
>Enrollment with Microsoft Intune or Mobile Device Management for Office 365 requires Workplace Join. If you have configured either of these services, ALL is selected and the NONE button is disabled.


By default, two-factor authentication is not enabled for the service. However, two-factor authentication is recommended when registering a device.

* Before requiring two-factor authentication for this service, you must configure a two-factor authentication provider in Azure Active Directory and configure your user accounts for Multi-Factor Authentication, see Adding Multi-Factor Authentication to Azure Active Directory

* If you are using AD FS with Windows Server 2012 R2, you must configure a two-factor authentication module in AD FS, see Using Multi-Factor Authentication with Active Directory Federation Services

## Configure Azure Active Directory Device Registration discovery
Windows 7 and Windows 8.1 devices will discover the Device Registration Server by combining the user account name with a well-known Device Registration server name.
You must create a DNS CNAME record that points to the A record associated with your Azure Active Directory Device Registration Service. The CNAME record must use the well-known prefix enterpriseregistration followed by the UPN suffix used by the user accounts at your organization. If your organization uses multiple UPN suffixes, multiple CNAME records must be created in DNS.

For example, if you use two UPN suffixes at your organization named @contoso.com and @region.contoso.com, you will create the following DNS records.
 
| Entry                                     | Type  | Address                            |
|-------------------------------------------|-------|------------------------------------|
| enterpriseregistration.contoso.com        | CNAME | enterpriseregistration.windows.net |
| enterpriseregistration.region.contoso.com | CNAME | enterpriseregistration.windows.net |

## View and manage device objects in Azure Active Directory
1. From the Azure Administrator portal, you can view, block, and unblock devices. A device that is blocked will no longer have access to applications that are configured to allow only registered devices.
1. Log on to the Microsoft Azure Portal as Administrator.
1. On the left pane, select **Active Directory**.
1. Select your directory.
1. Select the **Users** tab. Then select a user to view their devices
1. Select the **Devices** tab.
1. Select **Registered Devices** from the drop down menu.
1. Here you can view, block, or unblock the users registered devices. 

## Additional Topics

You can register your Windows 7 and Windows 8.1 Domain Joined devices with Azure AD Device Registration. The following topic provides more information about the prerequisites and the steps required to configure device registration on Windows 7 and Windows 8.1 devices.
Automatic Device Registration with Azure Active Directory for Windows Domain-Joined Devices 
