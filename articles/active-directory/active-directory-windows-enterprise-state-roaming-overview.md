<properties
	pageTitle="Enterprise State Roaming Overview | Microsoft Azure"
	description="Provides information about Enterprise State Roaming Settings in Windows devices. Enterprise State Roaming provides users with a unified experience across their Windows devices and reduces the time needed for configuring a new device."
	services="active-directory"
    keywords="enterprise settings sync, windows cloud"
	documentationCenter=""
	authors="femila"
	manager="stevenpo"
	editor="curtand"/>

<tags
	ms.service="active-directory"  
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="02/02/2016"
	ms.author="femila"/>

# Enterprise State Roaming Overview

With Windows 10, Azure Active Directory (Azure AD) users gain the ability to securely synchronize their user settings and application settings data to the cloud. Enterprise State Roaming provides users with a unified experience across their Windows devices and reduces the time needed for configuring a new device. Enterprise State Roaming operates similar to the standard consumer settings sync that was first introduced in Windows 8. Additionally, Enterprise State Roaming offers:

- **Separation of corporate and consumer data** – Organizations are in control of their data, and there is no mixing of corporate data in a consumer cloud account or consumer data in an enterprise cloud account. 
- **Enhanced security** – Data is automatically encrypted before leaving the user’s Windows 10 device by using Azure Rights Management (Azure RMS), and data stays encrypted at rest in the cloud. All content stays encrypted at rest in the cloud, except for the namespaces, like settings names and Windows app names.  
- **Management and monitoring services** – More control and visibility over who syncs settings in your organization and on which devices. 
- **Geographic location of data in the cloud** – Data will be stored in an Azure region based on the country of the Azure AD domain. 



| Topic                                            | Description                                                                                                                                                                                             |
|--------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Enable Enterprise State Roaming in Azure Active Directory](active-directory-windows-enterprise-state-roaming-enable.md) | Enterprise State Roaming is available to any organization with a Premium Azure Active Directory (Azure AD) subscription. For more details on how to get an Azure AD subscription, see the Azure AD product page. |
| [Settings and data roaming FAQ](active-directory-windows-enterprise-sync-faqs.md)                    | This topic answers some questions IT administrators might have about settings and app data sync.                                                                                                        |
| [Group Policy and MDM settings for settings sync](active-directory-windows-enterprise-sync-overview.md)  | Windows 10 provides Group Policy and mobile device management (MDM) policy settings to limit settings sync.                                                                                             |
| [Windows 10 roaming settings reference](active-directory-windows-enterprise-sync-windows-settings-reference.md)            | The following is a complete list of all the settings that will be roamed and/or backed-up in Windows 10.                                                                                                |