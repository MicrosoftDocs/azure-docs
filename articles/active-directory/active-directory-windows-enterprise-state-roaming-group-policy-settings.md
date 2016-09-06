<properties
	pageTitle="Group Policy and MDM settings | Microsoft Azure"
	description="Provides information about group policy and mobile device management (MDM) settings that should be used on corporate-owned devices. These policies are applied to the user’s entire device."
	services="active-directory"
    keywords="what are group Policy and MDM settings for Enterprise State Roaming, Enterprise State Roaming, windows cloud"
	documentationCenter=""
	authors="femila"
	manager="swadhwa"
	editor="curtand"/>

<tags
	ms.service="active-directory"  
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/07/2016"
	ms.author="femila"/>

# Group Policy and MDM settings

Use these group policy and mobile device management (MDM) settings only on corporate-owned devices because these policies are applied to the user’s entire device. Applying an MDM policy to disable settings sync for a personal, user-owned device will negatively impact the use of that device. Additionally, other user accounts on the device will also be affected by the policy.

Enterprises that want to manage roaming for personal (unmanaged) devices can use the Azure portal to enable or disable roaming, rather than using Group Policy or MDM.
The following tables describe the policy settings available.

## MDM settings
The MDM policy settings apply to both Windows 10 and Windows 10 Mobile.  Windows 10 Mobile support exists only for Microsoft account based roaming via user’s OneDrive account.  Please refer to “Devices and endpoints” section for details on what devices are supported for Azure AD based syncing.

| Name                               | Description                                                          |
|------------------------------------|----------------------------------------------------------------------|
| Allow Microsoft Account Connection | Allows users to authenticate using a Microsoft account on the device |
| Allow Sync My Settings             | Allows users to roam Windows settings and app data; Disabling this policy will disable sync as well as backups on mobile devices                  |

## Group Policy settings
The Group Policy settings apply to Windows 10 devices that are joined to an Active Directory domain. The table also includes legacy settings that would appear to manage sync settings, but that do not work for Enterprise State Roaming for Windows 10, which are noted with ‘Do not use’ in the description.

| Name                                | Description |
|-------------------------------------|-------------|
| Accounts: Block Microsoft Accounts  |This policy setting prevents users from adding new Microsoft accounts on this computer|
| Do not sync                         |Prevents users to roam Windows settings and app data|
| Do not sync personalize             |Disables syncing of the Themes group|
| Do not sync browser settings        |Disables syncing of the Internet Explorer group|
| Do not sync passwords               |Disables syncing of Passwords group|
| Do not sync other Windows settings  |Disables syncing of Other Windows settings group|
| Do not sync desktop personalization |Do not use; has no effect|
| Do not sync on metered connections  |Disables roaming on metered connections, such as cellular 3G|
| Do not sync apps                    |Do not use; has no effect|
|Do not sync app settings             |Disables roaming of app data|
|Do not sync start settings           |Do not use; has no effect|


## Related topics
- [Enterprise State Roaming overview](active-directory-windows-enterprise-state-roaming-overview.md)
- [Enable enterprise state roaming in Azure Active Directory](active-directory-windows-enterprise-state-roaming-enable.md)
- [Settings and data roaming FAQ](active-directory-windows-enterprise-state-roaming-faqs.md)
- [Windows 10 roaming settings reference](active-directory-windows-enterprise-state-roaming-windows-settings-reference.md)
