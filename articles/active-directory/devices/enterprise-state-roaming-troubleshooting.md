---
title: Troubleshoot Enterprise State Roaming in Azure Active Directory
description: Provides answers to some questions IT administrators might have about settings and app data sync.

services: active-directory
ms.service: active-directory
ms.subservice: devices
ms.topic: troubleshooting
ms.date: 02/12/2020

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: tanning

ms.collection: M365-identity-device-management
---
# Troubleshooting Enterprise State Roaming settings in Azure Active Directory

This topic provides information on how to troubleshoot and diagnose issues with Enterprise State Roaming, and provides a list of known issues.

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

> [!NOTE]
> This article applies to the Microsoft Edge Legacy HTML-based browser launched with Windows 10 in July 2015. The article does not apply to the new Microsoft Edge Chromium-based browser released on January 15, 2020. For more information on the Sync behavior for the new Microsoft Edge, see the article [Microsoft Edge Sync](/deployedge/microsoft-edge-enterprise-sync).

## Preliminary steps for troubleshooting 

Before you start troubleshooting, verify that the user and device have been configured properly, and that all the requirements of Enterprise State Roaming are met by the device and the user. 

1. Windows 10, with the latest updates, and a minimum Version 1511 (OS Build 10586 or later) is installed on the device. 
1. The device is Azure AD joined or hybrid Azure AD joined. For more information, see [how to get a device under the control of Azure AD](overview.md).
1. Ensure that **Enterprise State Roaming** is enabled for the tenant in Azure AD as described in [To enable Enterprise State Roaming](enterprise-state-roaming-enable.md). You can enable roaming for all users or for only a selected group of users.
1. The user is assigned an Azure Active Directory Premium license.  
1. The device must be restarted and the user must sign in again to access Enterprise State Roaming features.

## Information to include when you need help
If you cannot solve your issue with the guidance below, you can contact our support engineers. When you contact them, include the following information:

* **General description of the error**: Are there error messages seen by the user? If there was no error message, describe the unexpected behavior you noticed, in detail. What features are enabled for sync and what is the user expecting to sync? Are multiple features not syncing or is it isolated to one?
* **Users affected** – Is sync working/failing for one user or multiple users? How many devices are involved per user? Are all of them not syncing or are some of them syncing and some not syncing?
* **Information about the user** – What identity is the user using to sign in to the device? How is the user signing in to the device? Are they part of a selected security group allowed to sync? 
* **Information about the device** – Is this device Azure AD-joined or domain-joined? What build is the device on? What are the most recent updates?
* **Date / Time / Timezone** – What was the precise date and time you saw the error (include the timezone)?

Including this information helps us solve your problem as quickly as possible.

## Troubleshooting and diagnosing issues

This section gives suggestions on how to troubleshoot and diagnose problems related to Enterprise State Roaming.

## Verify sync, and the “Sync your settings” settings page 

1. After joining your Windows 10 PC to a domain that is configured to allow Enterprise State Roaming, sign on with your work account. Go to **Settings** > **Accounts** > **Sync Your Settings** and confirm that sync and the individual settings are on, and that the top of the settings page indicates that you are syncing with your work account. Confirm the same account is also used as your login account in **Settings** > **Accounts** > **Your Info**. 
1. Verify that sync works across multiple machines by making some changes on the original machine, such as moving the taskbar to the right or top side of the screen. Watch the change propagate to the second machine within five minutes. 

   * Locking and unlocking the screen (Win + L) can help trigger a sync.
   * You must be signing in with the same account on both PCs for sync to work – as Enterprise State Roaming is tied to the user account and not the machine account.

**Potential issue**: If the controls in the **Settings** page are not available, and you see the message “Some Windows features are only available if you are using a Microsoft account or work account.” This issue might arise for devices that are set up to be domain-joined and registered to Azure AD, but the device has not yet successfully authenticated to Azure AD. A possible cause is that the device policy must be applied, but this application happens asynchronously, and could be delayed by a few hours. 

### Verify the device registration status

Enterprise State Roaming requires the device to be registered with Azure AD. Although not specific to Enterprise State Roaming, following the instructions below can help confirm that the Windows 10 Client is registered, and confirm thumbprint, Azure AD settings URL, NGC status, and other information.

1. Open the command prompt unelevated. To do this in Windows, open the Run launcher (Win + R) and type “cmd” to open.
1. Once the command prompt is open, type “*dsregcmd.exe /status*”.
1. For expected output, the **AzureAdJoined** field value should be “YES”, **WamDefaultSet** field value should be “YES”, and the **WamDefaultGUID** field value should be a GUID with “(AzureAd)” at the end.

**Potential issue**: **WamDefaultSet** and **AzureAdJoined** both have “NO” in the field value, the device was domain-joined and registered with Azure AD, and the device does not sync. If it is showing this, the device may need to wait for policy to be applied or the authentication for the device failed when connecting to Azure AD. The user may have to wait a few hours for the policy to be applied. Other troubleshooting steps may include retrying autoregistration by signing out and back in, or launching the task in Task Scheduler. In some cases, running “*dsregcmd.exe /leave*” in an elevated command prompt window, rebooting, and trying registration again may help with this issue.

**Potential issue**: The field for **SettingsUrl** is empty and the device does not sync. The user may have last logged in to the device before Enterprise State Roaming was enabled in the Azure Active Directory Portal. Restart the device and have the user login. Optionally, in the portal, try having the IT Admin navigate to **Azure Active Directory** > **Devices** > **Enterprise State Roaming** disable and re-enable **Users may sync settings and app data across devices**. Once re-enabled, restart the device and have the user login. If this does not resolve the issue, **SettingsUrl** may be empty if there is a bad device certificate. In this case, running “*dsregcmd.exe /leave*” in an elevated command prompt window, rebooting, and trying registration again may help with this issue.

## Enterprise State Roaming and Multi-Factor Authentication 

Under certain conditions, Enterprise State Roaming can fail to sync data if Azure Multi-Factor Authentication is configured. For more information on these symptoms, see the support document [KB3193683](https://support.microsoft.com/kb/3193683). 

**Potential issue**: If your device is configured to require Multi-Factor Authentication on the Azure Active Directory portal, you may fail to sync settings while signing in to a Windows 10 device using a password. This type of Multi-Factor Authentication configuration is intended to protect an Azure administrator account. Admin users may still be able to sync by signing in to their Windows 10 devices with their Microsoft Passport for Work PIN or by completing Multi-Factor Authentication while accessing other Azure services like Office 365.

**Potential issue**: Sync can fail if the admin configures the Active Directory Federation Services Multi-Factor Authentication Conditional Access policy and the access token on the device expires. Ensure that you sign in and sign out using the Microsoft Passport for Work PIN or complete Multi-Factor Authentication while accessing other Azure services like Office 365.

### Event Viewer

For advanced troubleshooting, Event Viewer can be used to find specific errors. These are documented in the table below. The events can be found under Event Viewer > **Applications and Services Logs** > **Microsoft** > **Windows** > **SettingSync-Azure** and for identity-related issues with sync **Applications and Services Logs** > **Microsoft** > **Windows** > **AAD**.

## Known issues

### Sync does not work on devices that have apps side-loaded using MDM software

Affects devices running the Windows 10 Anniversary Update (Version 1607). In Event Viewer under the SettingSync-Azure logs, the Event ID 6013 with error 80070259 is frequently seen.

**Recommended action**  
Make sure the Windows 10 v1607 client has the August 23, 2016 Cumulative Update ([KB3176934](https://support.microsoft.com/kb/3176934) OS Build 14393.82). 

---

### Internet Explorer Favorites do not sync

Affects devices running the Windows 10 November Update (Version 1511).

**Recommended action**  
Make sure the Windows 10 v1511 client has the July 2016 Cumulative Update ([KB3172985](https://support.microsoft.com/kb/3172985) OS Build 10586.494).

---

### Theme is not syncing, as well as data protected with Windows Information Protection 

To prevent data leakage, data that is protected with [Windows Information Protection](https://technet.microsoft.com/itpro/windows/keep-secure/protect-enterprise-data-using-wip) will not sync through Enterprise State Roaming for devices using the Windows 10 Anniversary Update.

**Recommended action**  
None. Future updates to Windows may resolve this issue.

---

### Date, Time, and Region settings do not sync on domain-joined device 
  
Devices that are domain-joined will not experience sync for the setting Date, Time, and Region: automatic time. Using automatic time may override the other Date, Time, and Region settings and cause those settings not to sync. 

**Recommended action**  
None. 

---

### UAC Prompts when syncing passwords

Affects devices running the Windows 10 November Update (Version 1511) with a wireless NIC that is configured to sync passwords.

**Recommended action**  
Make sure the Windows 10 v1511 client has the Cumulative Update ([KB3140743](https://support.microsoft.com/kb/3140743) OS Build 10586.494).

---

### Sync does not work on devices that use smart card for login

If you attempt to sign in to your Windows device using a smart card or virtual smart card, settings sync will stop working. 	

**Recommended action**  
None. Future updates to Windows may resolve this issue.

---

### Domain-joined device is not syncing after leaving corporate network 	

Domain-joined devices registered to Azure AD may experience sync failure if the device is off-site for extended periods of time, and domain authentication can't complete.

**Recommended action**  
Connect the device to a corporate network so that sync can resume.

---

### Azure AD Joined device is not syncing and the user has a mixed case User Principal Name.

If the user has a mixed case UPN (for example, UserName instead of username) and the user is on an Azure AD Joined device, which has upgraded from Windows 10 Build 10586 to 14393, the user's device may fail to sync. 

**Recommended action**  
The user will need to unjoin and rejoin the device to the cloud. To do this, login as the Local Administrator user and unjoin the device by going to **Settings** > **System** > **About** and select "Manage or disconnect from work or school". Clean up the files below, and then Azure AD Join the device again in **Settings** > **System** > **About** and selecting "Connect to Work or School". Continue to join the device to Azure Active Directory and complete the flow.

In the cleanup step, clean up the following files:
- Settings.dat in `C:\Users\<Username>\AppData\Local\Packages\Microsoft.AAD.BrokerPlugin_cw5n1h2txyewy\Settings\`
- All the files under the folder `C:\Users\<Username>\AppData\Local\Packages\Microsoft.AAD.BrokerPlugin_cw5n1h2txyewy\AC\TokenBroker\Account`

---

### Event ID 6065: 80070533 This user can’t sign in because this account is currently disabled	

In Event Viewer under the SettingSync/Debug logs, this error can be seen when the user's credentials have expired. In addition, it can occur when the tenant did not automatically have AzureRMS provisioned. 

**Recommended action**  
In the first case, have the user update their credentials and login to the device with the new credentials. To solve the AzureRMS issue, proceed with the steps listed in [KB3193791](https://support.microsoft.com/kb/3193791). 

---

### Event ID 1098: Error: 0xCAA5001C Token broker operation failed	

In Event Viewer under the AAD/Operational logs, this error may be seen with Event 1104: AAD Cloud AP plugin call Get token returned error: 0xC000005F. This issue occurs if there are missing permissions or ownership attributes. 	

**Recommended action**  
Proceed with the steps listed [KB3196528](https://support.microsoft.com/kb/3196528).  

## Next steps

For an overview, see [enterprise state roaming overview](enterprise-state-roaming-overview.md).
