<properties
	pageTitle="Settings and data roaming FAQ | Microsoft Azure"
	description="Provides answers to some questions IT administrators might have about settings and app data sync."
	services="active-directory"
    keywords="enterprise state roaming settings, windows cloud, frequently asked questions on enterprise state roaming"
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
	ms.date="02/03/2016"
	ms.author="femila"/>

# Settings and data roaming FAQ

This topic answers some questions IT administrators might have about settings and app data sync.

## What data roams?
**Windows Settings**: the PC settings that are built into the Windows operating system. Generally, these are settings that personalize the user’s PC, and they include the following broad categories:

- **Theme**: desktop theme, taskbar settings, etc. 
- **Internet Explorer settings**: recently opened tabs, favorites, etc.
- **Edge browser settings**: favorites, reading list
- **Passwords**: Internet passwords, Wi-Fi profiles, etc. 
- **Language preferences**: keyboard layouts, system language, dateand time, etc. 
- **Ease of access**: high contrast theme, Narrator, Magnifier, etc. 
- **Other Windows settings**: command prompt settings, application list, etc. 

**Application data**: Universal Windows apps can write settings data to a “roaming” folder, and any data written to this folder will automatically be synced. It’s up to the individual app developer to design an app to take advantage of this capability. For more details on how to develop a Universal Windows app that uses roaming, see the [appdata storage API](https://msdn.microsoft.com/library/windows/apps/mt299098.aspx) and the [Windows 8 appdata roaming developer blog](http://blogs.msdn.com/b/windowsappdev/archive/2012/07/17/roaming-your-app-data.aspx). 

## What account is used for settings sync?
In Windows 8 and Windows 8.1, settings sync always used consumer Microsoft accounts. Enterprise users had the ability to connect a Microsoft account to their Active Directory domain account to gain access to settings sync. In Windows 10, this “connected Microsoft account” functionality is being replaced with a primary/secondary account framework.
 
The primary account is defined as the account used to log into Windows – this can be a Microsoft account, an Azure Active Directory (Azure AD) account, an on-premises Active Directory account, or a local account. In addition to the primary account, Windows 10 users can add one or more secondary cloud accounts to their device. These secondary accounts are generally a Microsoft account, Azure Active Directory account, or some other account such as Gmail or Facebook. These secondary accounts provide access to additional services such as single-sign-on and the Windows Store, but they are not capable of powering settings sync. 

In Windows 10, only the primary account for the device can be used for settings sync (see 
How do I upgrade from Microsoft account settings sync in Windows 8 to Azure AD settings sync in Windows 10? for exception). 

Data is never mixed between the different user accounts on the device. There are two rules for settings sync: 
- Windows settings will always roam with the primary account.
- App data will be tagged with the account used to acquire the app. Only apps tagged with the primary account will sync. App ownership tagging is determined when an app is installed through the Windows Store or when the app is side loaded through mobile device management (MDM). 

If an app’s owner cannot be identified, it will roam with the primary account. If a device is upgraded from Windows 8 or Windows 8.1 to Windows 10, all the apps will be tagged as acquired by the Microsoft account because, in general, most apps were acquired via the Windows Store, and there was no Windows Store support for Azure AD accounts prior to Windows 10. If an app is installed via an offline license, the app will be tagged using the primary account on the device.

>[AZURE.NOTE]  
>The ability to connect a Microsoft Account to a domain account and have all the user's data sync to the Microsoft Account (i.e. Microsoft Account roaming via the “connected Microsoft Account and Active Directory” functionality) is removed from Windows 10 devices that are joined to a connected Active Directory/Azure AD environment.
 
## How do I upgrade from Microsoft account settings sync in Windows 8 to Azure AD settings sync in Windows 10?
A user joined to the Active Directory domain running Windows 8 or Windows 8.1 with a connected Microsoft account will sync settings through the user’s Microsoft account. After upgrading to Windows 10, domain-joined users will continue to sync user settings via Microsoft account as long as the Active Directory domain does not connect with Azure AD. 
If the on-premises Active Directory domain does connect with Azure AD, then the user’s device will begin attempting to sync settings using the connected Azure AD account. If the Azure AD administrator does not enable Enterprise State Roaming, then users with a connected Azure AD account will stop syncing settings. After settings sync via Azure AD has been enabled, Windows 10 users will immediately start syncing Windows settings using Azure AD if the user logs in with an Azure AD identity.

Users who stored any personal data on their corporate device should be aware that Windows OS and application data will begin syncing to Azure AD. This has the following implications:
- Personal Microsoft account users will slowly have their settings “drift apart” from the settings on organizational Azure AD accounts since the Microsoft account and Azure AD settings sync are now using separate accounts. 
- Personal data such as Wi-Fi passwords, web credentials, and Internet Explorer favorites and tabs that were previously synced via a connected Microsoft account will be synced via Azure AD. 


## How does Microsoft account and Azure AD Enterprise State Roaming interoperability work? 
In the 2015 releases of Windows 10, Enterprise State Roaming is only supported for a single account at a time. If the user signs in to Windows using an organizational Azure AD account, all data will sync via Azure AD. If the user signs in to Windows using a personal Microsoft account, all data will sync via Microsoft account. Appdata will roam using the primary sign-in account on the device if the app’s license is owned by the primary account. Apps owned by any secondary accounts will not sync appdata in Windows 10. 

## Do settings sync for Azure AD accounts from multiple tenants?
When multiple Azure AD accounts from different Azure AD tenants are on the same device, you must update the device's registry to communicate with the Azure Rights Management Service (RMS) service for each Azure AD tenant.  

1. First, you need the GUID for each Azure AD tenant. Open the Azure classic portal and select an Azure AD tenant. The GUID for the tenant is in the URL in the address bar of your browser, as follows:
    `https://manage.windowsazure.com/YourAccount.onmicrosoft.com#Workspaces/ActiveDirectoryExtension/Directory/Tenant GUID/directoryQuickStart`
2. After you have the GUID, you will need to add the following registry key:
**HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\SettingSync\WinMSIPC\<tenant ID GUID>** 
From the <**tenant ID GUID**> key, create a new Multi-String Value (REG-MULTI-SZ) named **AllowedRMSServerUrl**s and for its data, specify the licensing distribution point URLs  of the other Azure tenants that the device accesses. 
3. You can find the licensing distribution point URLs by running the **Get-AadrmConfiguration** cmdlet. If the values for the **LicensingIntranetDistributionPointUrl **and **LicenseingExtranetDistributionPointUrl** are different, specify both values. If the values are the same, specify the value just once.


## What are the options for roaming settings for Classic Windows applications?
Roaming only works forUniversal Windows apps. There are two options available for enabling roaming on a Classic Windows application:

- Using Project Centennial, you can easily convert a Classic Windows application into a Universal Windows app. From here, minimal code changes will be required by the app developer to be able to take advantage of Azure AD appdata roaming. This is the recommended path for enabling Win32 appdata roaming. 
- Using the [User Experience Virtualization (UE-V)](https://technet.microsoft.com/library/dn458947.aspx) template generator, you can create a custom settings template and apply it to your app each time it launches. This option does not require the app developer to change code of the app, but in the 2015 releases of Windows 10, UE-V is limited to on-premises Active Directory roaming for customers who have purchased the Microsoft Desktop Optimization Package. In the future, Microsoft may investigate ways to make UE-V deeply integrated into Windows and extend UE-V to roam settings through the Azure AD cloud. 

## Can I store synced settings and data on-premises?
Enterprise State Roaming is designed to store settings data in the Azure cloud. UE-V offers an on-premises roaming solution for Windows 10.

## Who manages the data that’s being roamed?
The tenant administrator will manage the data, and it will be stored in an Azure datacenter. All user data is encrypted both in transit and at rest in the cloud using Azure Rights Management (Azure RMS). This is an improvement compared to Microsoft account-based settings sync, where only certain sensitive data such as user credentials are encrypted before leaving the device. 

Microsoft is committed to safeguarding customer data. An enterprise user’s settings data is automatically encrypted by Azure RMS whenever it leaves a Windows 10 device, so that another user cannot read this data. If your organization has a paid subscription for Azure RMS, you can use other Azure RMS features, such as track and revoke documents, automatically protect emails that contain sensitive information, and manage your own keys (the "bring your own key" solution, also known as BYOK). For more information about these features and how Azure RMS works, see [What is Azure Rights Management](https://technet.microsoft.com/jj585026.aspx)?

## Can I manage sync for a specific app or setting?
In Windows 10, there is no MDM or Group Policy setting to disable roaming for an individual app. Tenant administrators can disable appdata sync for all apps on a managed device, but there is no finer control at a per app or within-app level. 

## What can an individual user do to enable/disable roaming?
In the Settings app, go to Accounts -> Sync your settings. From this page, you can see which account is being used to roam settings, and you can enable or disable individual groups of settings to be roamed.
 
##What is Microsoft’s recommendation for enabling roaming today in Windows 10? 
Microsoft has a few different settings roaming solutions available, including Roaming User Profiles, UE-V, and Azure AD Roaming. If your organization is not ready or comfortable with moving data to the cloud, then Microsoft recommends that you use UE-V as your primary roaming technology. If your organization requires roaming support for Classic Windows applications, but is eager to move to the cloud, Microsoft recommends that you use both enterprise settings sync and UE-V. While UE-V and enterprise settings sync are very similar technologies, they are not mutually exclusive, and today they complement each other to ensure that your organization provides the roaming services that your users need. When using both enterprise settings sync and UE-V, the following rules apply: 

- Enterprise State Roaming is the primary roaming agent on the device. UE-V is being used to supplement the “Win32 gap.” 
- UE-V roaming for Windows settings and modern UWP app data should be disabled because these are already covered via Enterprise State Roaming. 

## What happens when my organization purchases Azure RMS after using roaming for a while? 
If your organization is already using roaming in Windows 10 with the Azure RMS free subscription, purchasing a paid Azure RMS subscription will not have any impact on the functionality of the roaming feature and no configuration changes will be required by your IT administrator. 

## Known Issues

- Smart card or virtual smart card login to Windows causes settings sync to stop working. If you attempt to log into your device using a smart card or Virtual smart card, sync will stop working. Future updates to Windows 10 may resolve this issue.
- There is a problem with syncing **Favorites** in Internet Explorer. IE Favorites sync is temporarily disabled to prevent further issues from arising. Future updates to Windows 10 will resolve this issue.


## Related topics
- [Enterprise state roaming overview](active-directory-windows-enterprise-state-roaming-overview.md)
- [Enable enterprise state roaming in Azure Active Directory](active-directory-windows-enterprise-state-roaming-enable.md)
- [Group policy and MDM settings for settings sync](active-directory-windows-enterprise-state-roaming-group-policy-settings.md)
- [Windows 10 roaming settings reference](active-directory-windows-enterprise-state-roaming-windows-settings-reference.md)