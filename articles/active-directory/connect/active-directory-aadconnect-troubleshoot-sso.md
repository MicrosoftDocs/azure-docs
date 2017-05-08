---
title: 'Azure AD Connect: Troubleshoot Seamless Single Sign On | Microsoft Docs'
description: This topic describes how to troubleshoot Azure Active Directory Seamless Single Sign On (Azure AD Seamless SSO).
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
ms.date: 05/08/2017
ms.author: billmath
---

# How to troubleshoot Azure Active Directory Seamless Single Sign On

## Known issues

- If you are synchronizing more than 30 AD forests using Azure AD Connect, the wizard used to setup Seamless SSO doesn't work properly. As a workaround, you can [manually enable](#manual-reset-of-azure-ad-seamless-sso) the Seamless SSO feature on your tenant.
- Adding Azure AD service URLs (https://autologon.microsoftazuread-sso.com, https://aadg.windows.net.nsatc.net) to the "Trusted sites" zone instead of the "Local intranet" zone.

## Troubleshooting checklist

Use the following checklist for troubleshooting Azure AD Seamless SSO:

1. Check if the Seamless SSO feature is enabled on your tenant in the Azure AD Connect tool. If you can't enable the feature (for example, due to a blocked port), make sure that you have all the [pre-requisites](active-directory-aadconnect-sso.md#pre-requisites) in place. If you are still facing issues with enabling the feature, contact Microsoft Support.
2. Both the service URLs (https://autologon.microsoftazuread-sso.com and https://aadg.windows.net.nsatc.net) are defined to be part of the Intranet zone settings.
3. Ensure the corporate desktop is joined to the AD domain.
4. Ensure the user is logged on to the desktop using an AD domain account.
5. Ensure that the user's account is from an AD forest where Seamless SSO has been setup.
6. Ensure the desktop is connected on the corporate network.
7. Ensure that the desktop's time is synchronized with the Active Directory's and the Domain Controllers' time and is within 5 minutes of each other.
8. Purge existing Kerberos tickets from their desktop. This can be done by running the **klist purge** command from a command prompt. Users' Kerberos tickets are typically valid for 12 hours; note that you may have set it up differently in Active Directory.
9. Review the console logs of the browser (under "Developer Tools") to help determine potential issues.
10. Review the [Domain Controller logs](#domain-controller-logs) as well.

### Domain Controller logs

If success auditing is enabled on your Domain Controller, then every time a user signs in using Seamless SSO a security entry (event 4769 associated with computer account **AzureADSSOAcc$**) is recorded in the Event log. You can find these security events by using the following query:

```
	<QueryList>
	  <Query Id="0" Path="Security">
	<Select Path="Security">*[EventData[Data[@Name='ServiceName'] and (Data='AZUREADSSOACC$')]]</Select>
	  </Query>
	</QueryList>
```

## Manual reset of Azure AD Seamless SSO

If troubleshooting doesn't help, use the following steps to manually reset / enable the feature on your tenant:

### 1. Import the Seamless SSO PowerShell module

- First, download and install the [Microsoft Online Services Sign-In Assistant](http://go.microsoft.com/fwlink/?LinkID=286152).
- Then download and install the [64-bit Azure Active Directory module for Windows PowerShell](http://go.microsoft.com/fwlink/p/?linkid=236297).
- Navigate to the `%programfiles%\Microsoft Azure Active Directory Connect` folder.
- Import the Seamless SSO PowerShell module using this command: `Import-Module .\AzureADSSO.psd1`.

### 2. Get the list of AD forests on which Seamless SSO has been enabled

- In PowerShell, call `New-AzureADSSOAuthenticationContext`. This should give you a popup to enter your Azure AD tenant administrator credentials.
- Call `Get-AzureADSSOStatus`. This will provide you the list of AD forests (look at the "Domains" list) on which this feature has been enabled.

### 3. Disable Seamless SSO for each AD forest that it was set it up on

- In PowerShell, call `New-AzureADSSOAuthenticationContext`. This should give you a popup to enter your Azure AD tenant administrator credentials.
- Call `$creds = Get-Credential`. This should give you a popup to enter the domain administrator credentials for the intended AD forest.
- Call `Disable-AzureADSSOForest -OnPremCredentials $creds`. This will both remove the AZUREADSSOACCT computer account from the on-premises DC as well as disable this feature for this specific AD forest.
- Repeat the above steps for each AD forest that you’ve set up the feature on.

### 4. Enable Seamless SSO for each AD forest

- Call `New-AzureADSSOAuthenticationContext`. This should give you a popup to enter your Azure AD tenant administrator credentials.
- Call `Enable-AzureADSSOForest`. This should give you a popup to enter domain administrator credentials for the intended AD forest.
- Repeat the above steps for each AD forest that you want to set up the feature on.

### 5. Enable Seamless SSO on your tenant

- Call `New-AzureADSSOAuthenticationContext`. This should give you a popup to enter your Azure AD tenant administrator credentials.
- Call `Enable-AzureADSSO` and type in "true" at the `Enable: ` prompt to turn the feature on in your tenant.
