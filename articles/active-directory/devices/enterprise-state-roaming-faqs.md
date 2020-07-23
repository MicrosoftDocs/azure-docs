---
title: Enterprise State Roaming FAQ - Azure Active Directory
description: Frequently asked questions about ESR

services: active-directory
ms.service: active-directory
ms.subservice: devices
ms.topic: troubleshooting
ms.date: 02/12/2020

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: na

ms.collection: M365-identity-device-management
---
# Settings and data roaming FAQ

This article answers some questions IT administrators might have about settings and app data sync.

## What data roams?

**Windows settings**:
the PC settings that are built into the Windows operating system. Generally, these are settings that personalize your PC, and they include the following broad categories:

* *Theme*, which includes features such as desktop theme and taskbar settings.
* *Internet Explorer settings*, including recently opened tabs and favorites.
* *Microsoft Edge browser settings*, such as favorites and reading list.
* *Passwords*, including Internet passwords, Wi-Fi profiles, and others.
* *Language preferences*, which include settings for keyboard layouts, system language, date and time, and more.
* *Ease of access features*, such as high-contrast theme, Narrator, and Magnifier.
* *Other Windows settings*, such as mouse settings.

> [!NOTE]
> This article applies to the Microsoft Edge Legacy HTML-based browser launched with Windows 10 in July 2015. The article does not apply to the new Microsoft Edge Chromium-based browser released on January 15, 2020. For more information on the Sync behavior for the new Microsoft Edge, see the article [Microsoft Edge Sync](/deployedge/microsoft-edge-enterprise-sync).

**Application data**: Universal Windows apps can write settings data to a roaming folder, and any data written to this folder will automatically be synced. It’s up to the individual app developer to design an app to take advantage of this capability. For more information about how to develop a Universal Windows app that uses roaming, see the [appdata storage API](https://msdn.microsoft.com/library/windows/apps/mt299098.aspx) and the [Windows 8 appdata roaming developer blog](https://blogs.msdn.com/b/windowsappdev/archive/2012/07/17/roaming-your-app-data.aspx).

## What account is used for settings sync?

In Windows 8.1, settings sync always used consumer Microsoft accounts. Enterprise users had the ability to connect a Microsoft account to their Active Directory domain account to gain access to settings sync. In Windows 10, this connected Microsoft account functionality is being replaced with a primary/secondary account framework.

The primary account is defined as the account used to sign in to Windows. This can be a Microsoft account, an Azure Active Directory (Azure AD) account, an on-premises Active Directory account, or a local account. In addition to the primary account, Windows 10 users can add one or more secondary cloud accounts to their device. A secondary account is generally a Microsoft account, an Azure AD account, or some other account such as Gmail or Facebook. These secondary accounts provide access to additional services such as single sign-on and the Windows Store, but they are not capable of powering settings sync.

In Windows 10, only the primary account for the device can be used for settings sync (see
[How do I upgrade from Microsoft account settings sync in Windows 8 to Azure AD settings sync in Windows 10?](enterprise-state-roaming-faqs.md#how-do-i-upgrade-from-microsoft-account-settings-sync-in-windows-8-to-azure-ad-settings-sync-in-windows-10)).

Data is never mixed between the different user accounts on the device. There are two rules for settings sync:

* Windows settings will always roam with the primary account.
* App data will be tagged with the account used to acquire the app. Only apps tagged with the primary account will sync. App ownership tagging is determined when an app is side-loaded through the Windows Store or mobile device management (MDM).

If an app’s owner cannot be identified, it will roam with the primary account. If a device is upgraded from Windows 8 or Windows 8.1 to Windows 10, all the apps will be tagged as acquired by the Microsoft account. This is because most users acquire apps through the Windows Store, and there was no Windows Store support for Azure AD accounts prior to Windows 10. If an app is installed via an offline license, the app will be tagged using the primary account on the device.

> [!NOTE]
> Windows 10 devices that are enterprise-owned and are connected to Azure AD can no longer connect their Microsoft accounts to a domain account. The ability to connect a Microsoft account to a domain account and have all the user's data sync to the Microsoft account (that is, the Microsoft account roaming via the connected Microsoft account and Active Directory functionality) is removed from Windows 10 devices that are joined to a connected Active Directory or Azure AD environment.

## How do I upgrade from Microsoft account settings sync in Windows 8 to Azure AD settings sync in Windows 10?

If you are joined to the Active Directory domain running Windows 8.1 with a connected Microsoft account, you will sync settings through your Microsoft account. After upgrading to Windows 10, you will continue to sync user settings via Microsoft account as long as you are a domain-joined user and the Active Directory domain does not connect with Azure AD.

If the on-premises Active Directory domain does connect with Azure AD, your device will attempt to sync settings using the connected Azure AD account. If the Azure AD administrator does not enable Enterprise State Roaming, your connected Azure AD account will stop syncing settings. If you are a Windows 10 user and you sign in with an Azure AD identity, you will start syncing windows settings as soon as your administrator enables settings sync via Azure AD.

If you stored any personal data on your corporate device, you should be aware that Windows OS and application data will begin syncing to Azure AD. This has the following implications:

* Your personal Microsoft account settings will drift apart from the settings on your work or school Azure AD accounts. This is because the Microsoft account and Azure AD settings sync are now using separate accounts.
* Personal data such as Wi-Fi passwords, web credentials, and Internet Explorer favorites that were previously synced via a connected Microsoft account will be synced via Azure AD.

## How do Microsoft account and Azure AD Enterprise State Roaming interoperability work?

In the November 2015 or later releases of Windows 10, Enterprise State Roaming is only supported for a single account at a time. If you sign in to Windows by using a work or school Azure AD account, all data will sync via Azure AD. If you sign in to Windows by using a personal Microsoft account, all data will sync via the Microsoft account. Universal appdata will roam using only the primary sign-in account on the device, and it will roam only if the app’s license is owned by the primary account. Universal appdata for the apps owned by any secondary accounts will not be synced.

## Do settings sync for Azure AD accounts from multiple tenants?

When multiple Azure AD accounts from different Azure AD tenants are on the same device, you must update the device's registry to communicate with the Azure Rights Management service for each Azure AD tenant.  

1. Find the GUID for each Azure AD tenant. Open the Azure portal and select an Azure AD tenant. The GUID for the tenant is on the Properties page for the selected tenant (https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Properties), labeled **Directory ID**. 
2. After you have the GUID, you will need to add the registry key
   **HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\SettingSync\WinMSIPC\<tenant ID GUID>**.
   From the **tenant ID GUID** key, create a new Multi-String value (REG-MULTI-SZ) named **AllowedRMSServerUrls**. For its data, specify the licensing distribution point URLs of the other Azure tenants that the device accesses.
3. You can find the licensing distribution point URLs by running the **Get-AadrmConfiguration** cmdlet from the AADRM module. If the values for the **LicensingIntranetDistributionPointUrl** and **LicensingExtranetDistributionPointUrl** are different, specify both values. If the values are the same, specify the value just once.

## What are the roaming settings options for existing Windows desktop applications?

Roaming only works for Universal Windows apps. There are two options available for enabling roaming on an existing Windows desktop application:

* The [Desktop Bridge](https://aka.ms/desktopbridge) helps you bring your existing Windows desktop apps to the Universal Windows Platform. From here, minimal code changes will be required to take advantage of Azure AD app data roaming. The Desktop Bridge provides your apps with an app identity, which is needed to enable app data roaming for existing desktop apps.
* [User Experience Virtualization (UE-V)](https://technet.microsoft.com/library/dn458947.aspx) helps you create a custom settings template for existing Windows desktop apps and enable roaming for Win32 apps. This option does not require the app developer to change code of the app. UE-V is limited to on-premises Active Directory roaming for customers who have purchased the Microsoft Desktop Optimization Pack.

Administrators can configure UE-V to roam Windows desktop app data by changing roaming of Windows OS settings and Universal app data through [UE-V group policies](https://technet.microsoft.com/itpro/mdop/uev-v2/configuring-ue-v-2x-with-group-policy-objects-both-uevv2), including:

* Roam Windows settings group policy
* Do not synchronize Windows Apps group policy
* Internet Explorer roaming in the applications section

In the future, Microsoft may investigate ways to make UE-V deeply integrated into Windows and extend UE-V to roam settings through the Azure AD cloud.

## Can I store synced settings and data on-premises?

Enterprise State Roaming stores all synced data in the Microsoft cloud. UE-V offers an on-premises roaming solution.

## Who owns the data that’s being roamed?

The enterprises own the data roamed via Enterprise State Roaming. Data is stored in an Azure datacenter. All user data is encrypted both in transit and at rest in the cloud using the Azure Rights Management service from Azure Information Protection. This is an improvement compared to Microsoft account-based settings sync, which encrypts only certain sensitive data such as user credentials before it leaves the device.

Microsoft is committed to safeguarding customer data. An enterprise user’s settings data is automatically encrypted by the Azure Rights Management service before it leaves a Windows 10 device, so no other user can read this data. If your organization has a paid subscription for the Azure Rights Management service, you can use other protection features, such as track and revoke documents, automatically protect emails that contain sensitive information, and manage your own keys (the "bring your own key" solution, also known as BYOK). For more information about these features and how this protection service works, see [What is Azure Rights Management](/azure/information-protection/what-is-information-protection).

## Can I manage sync for a specific app or setting?

In Windows 10, there is no MDM or Group Policy setting to disable roaming for an individual application. Tenant administrators can disable appdata sync for all apps on a managed device, but there is no finer control at a per-app or within-app level.

## How can I enable or disable roaming?

In the **Settings** app, go to **Accounts** > **Sync your settings**. From this page, you can see which account is being used to roam settings, and you can enable or disable individual groups of settings to be roamed.

## What is Microsoft’s recommendation for enabling roaming in Windows 10?

Microsoft has a few different settings roaming solutions available, including Roaming User Profiles, UE-V, and Enterprise State Roaming.  Microsoft is committed to making an investment in Enterprise State Roaming in future versions of Windows. If your organization is not ready or comfortable with moving data to the cloud, then we recommend that you use UE-V as your primary roaming technology. If your organization requires roaming support for existing Windows desktop applications but is eager to move to the cloud, we recommend that you use both Enterprise State Roaming and UE-V. Although UE-V and Enterprise State Roaming are very similar technologies, they are not mutually exclusive. They complement each other to help ensure that your organization provides the roaming services that your users need.  

When using both Enterprise State Roaming and UE-V, the following rules apply:

* Enterprise State Roaming is the primary roaming agent on the device. UE-V is being used to supplement the “Win32 gap.”
* UE-V roaming for Windows settings and modern UWP app data should be disabled when using the UE-V group policies. These are already covered by Enterprise State Roaming.

## How does Enterprise State Roaming support virtual desktop infrastructure (VDI)?

Enterprise State Roaming is supported on Windows 10 client SKUs, but not on server SKUs. If a client VM is hosted on a hypervisor machine and you remotely sign in to the virtual machine, your data will roam. If multiple users share the same OS and users remotely sign in to a server for a full desktop experience, roaming might not work. The latter session-based scenario is not officially supported.

## What happens when my organization purchases a subscription that includes Azure Rights Management after using roaming?

If your organization is already using roaming in Windows 10 with the Azure Rights Management limited-use free subscription, purchasing a [paid subscription](https://azure.microsoft.com/pricing/details/information-protection/) that includes the Azure Rights Management protection service will not have any impact on the functionality of the roaming feature, and no configuration changes will be required by your IT administrator.

## Known issues

See the documentation in the [troubleshooting](enterprise-state-roaming-troubleshooting.md) section for a list of known issues. 

## Next steps 

For an overview, see [enterprise state roaming overview](enterprise-state-roaming-overview.md)
