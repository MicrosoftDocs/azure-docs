---
title: 'Azure Active Directory Connect: Troubleshoot Seamless Single Sign-On | Microsoft Docs'
description: This topic describes how to troubleshoot Azure Active Directory Seamless Single Sign-On
services: active-directory
keywords: what is Azure AD Connect, install Active Directory, required components for Azure AD, SSO, Single Sign-on
documentationcenter: ''
author: swkrish
manager: femila
ms.assetid: 9f994aca-6088-40f5-b2cc-c753a4f41da7
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/19/2017
ms.author: billmath
---

# Troubleshoot Azure Active Directory Seamless Single Sign-On

This article helps you find troubleshooting information about common problems regarding Azure Active Directory (Azure AD) Seamless Single Sign-On (Seamless SSO).

## Known problems

- In a few cases, enabling Seamless SSO can take up to 30 minutes.
- Edge browser support is not available.
- Starting Office clients, especially in shared computer scenarios, causes extra sign-in prompts for users. Users must enter their usernames frequently, but not their passwords.
- If Seamless SSO succeeds, the user does not have the opportunity to select "Keep me signed in." Due to this behavior, SharePoint and OneDrive mapping scenarios don't work.
- Seamless SSO doesn't work in private browsing mode on Firefox.
- Seamless SSO doesn't work in Internet Explorer when enhanced protection mode is turned on.
- Seamless SSO doesn't work on mobile browsers on iOS and Android.
- If you're synchronizing 30 or more Active Directory forests, you can't enable Seamless SSO through Azure AD Connect. As a workaround, you can [manually enable](#manual-reset-of-azure-ad-seamless-sso) the feature on your tenant.
- Adding Azure AD service URLs (https://autologon.microsoftazuread-sso.com, https://aadg.windows.net.nsatc.net) to the Trusted sites zone instead of the Local intranet zone *blocks users from signing in*.

## Check the status of the feature

Ensure that the Seamless SSO feature is still **Enabled** on your tenant. You can check the status by going to the **Azure AD Connect** pane in [Azure Active Directory admin center](https://aad.portal.azure.com/).

![Azure Active Directory admin center: Azure AD Connect pane](./media/active-directory-aadconnect-sso/sso10.png)

## Sign-in failure reasons in the Azure Active Directory admin center (needs a Premium license)

If your tenant has an Azure AD Premium license associated with it, you can also look at the [sign-in activity report](../active-directory-reporting-activity-sign-ins.md) in the [Azure Active Directory admin center](https://aad.portal.azure.com/).

![Azure Active Directory admin center: Sign-ins report](./media/active-directory-aadconnect-sso/sso9.png)

Browse to **Azure Active Directory** > **Sign-ins** on the [Azure Active Directory admin center](https://aad.portal.azure.com/), and then select a specific user's sign-in activity. Look for the **SIGN-IN ERROR CODE** field. Map the value of that field to a failure reason and resolution by using the following table:

|Sign-in error code|Sign-in failure reason|Resolution
| --- | --- | ---
| 81001 | User's Kerberos ticket is too large. | Reduce the user's group memberships and try again.
| 81002 | Unable to validate the user's Kerberos ticket. | See the [troubleshooting checklist](#troubleshooting-checklist).
| 81003 | Unable to validate the user's Kerberos ticket. | See the [troubleshooting checklist](#troubleshooting-checklist).
| 81004 | Kerberos authentication attempt failed. | See the [troubleshooting checklist](#troubleshooting-checklist).
| 81008 | Unable to validate the user's Kerberos ticket. | See the [troubleshooting checklist](#troubleshooting-checklist).
| 81009 | Unable to validate the user's Kerberos ticket. | See the [troubleshooting checklist](#troubleshooting-checklist).
| 81010 | Seamless SSO failed because the user's Kerberos ticket has expired or is invalid. | The user needs to sign in from a domain-joined device inside your corporate network.
| 81011 | Unable to find the user object based on the information in the user's Kerberos ticket. | Use Azure AD Connect to synchronize the user's information into Azure AD.
| 81012 | The user trying to sign in to Azure AD is different from the user that is signed in to the device. | The user needs to sign in from a different device.
| 81013 | Unable to find the user object based on the information in the user's Kerberos ticket. |Use Azure AD Connect to synchronize the user's information into Azure AD. 

## Troubleshooting checklist

Use the following checklist to troubleshoot Seamless SSO problems:

- Ensure the Seamless SSO feature is enabled in Azure AD Connect. If you can't enable the feature (for example, due to a blocked port), ensure that you have all the [prerequisites](active-directory-aadconnect-sso-quick-start.md#step-1-check-the-prerequisites) in place.
- Ensure that both of these Azure AD URLs (https://autologon.microsoftazuread-sso.com and https://aadg.windows.net.nsatc.net) are part of the user's Intranet zone settings.
- Ensure that the corporate device is joined to the Active Directory domain.
- Ensure that the user is logged on to the device through an Active Directory domain account.
- Ensure that the user's account is from an Active Directory forest where Seamless SSO has been set up.
- Ensure that the device is connected to the corporate network.
- Ensure that the device's time is synchronized with the Active Directory's and the domain controllers' time and that they are within five minutes of each other.
- List the existing Kerberos tickets on the device by using the `klist` command from a command prompt. Ensure that the tickets issued for the `AZUREADSSOACCT` computer account are present. Users' Kerberos tickets are typically valid for 12 hours. You might have different settings in your Active Directory.
- Purge existing Kerberos tickets from the device by using the `klist purge` command, and try again.
- To determine if there are JavaScript-related problems, review the console logs of the browser (under **Developer Tools**).
- Review the [domain controller logs](#domain-controller-logs) as well.

### Domain controller logs

If you enable success auditing on your domain controller, then every time a user signs in through Seamless SSO a security entry is recorded in the event log. You can find these security events by using the following query (look for event **4769** associated with the computer account **AzureADSSOAcc$**):

```
	<QueryList>
	  <Query Id="0" Path="Security">
	<Select Path="Security">*[EventData[Data[@Name='ServiceName'] and (Data='AZUREADSSOACC$')]]</Select>
	  </Query>
	</QueryList>
```

## Manual reset of the feature

If troubleshooting didn't help, you can manually reset the feature on your tenant. Follow these steps on the on-premises server where you're running Azure AD Connect:

### Step 1: Import the Seamless SSO PowerShell module

1. First, download, and then install the [Microsoft Online Services Sign-In Assistant](http://go.microsoft.com/fwlink/?LinkID=286152).
2. Then download and install the [64-bit Azure Active Directory module for Windows PowerShell](http://go.microsoft.com/fwlink/p/?linkid=236297).
3. Browse to the `%programfiles%\Microsoft Azure Active Directory Connect` folder.
4. Import the Seamless SSO PowerShell module by using this command: `Import-Module .\AzureADSSO.psd1`.

### Step 2: Get the list of Active Directory forests on which Seamless SSO has been enabled

1. Run PowerShell as the Administrator. In PowerShell, call `New-AzureADSSOAuthenticationContext`. When prompted, enter your tenant's global administrator credentials.
2. Call `Get-AzureADSSOStatus`. This command provides you with the list of Active Directory forests (look at the "Domains" list) on which this feature has been enabled.

### Step 3: Disable Seamless SSO for each Active Directory forest that it was set it up on

1. Call `$creds = Get-Credential`. When prompted, enter the domain administrator credentials for the intended Active Directory forest.
2. Call `Disable-AzureADSSOForest -OnPremCredentials $creds`. This command removes the `AZUREADSSOACCT` computer account from the on-premises domain controller for this specific Active Directory forest.
3. Repeat the preceding steps for each Active Directory forest that you’ve set up the feature on.

### Step 4: Enable Seamless SSO for each Active Directory forest

1. Call `Enable-AzureADSSOForest`. When prompted, enter the domain administrator credentials for the intended Active Directory forest.
2. Repeat the preceding steps for each Active Directory forest that you want to set up the feature on.

### Step 5. Enable the feature on your tenant

Call `Enable-AzureADSSO` and enter **true** at the `Enable: ` prompt to turn on the feature on your tenant.
