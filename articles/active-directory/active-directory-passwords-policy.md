---
title: 'Policy: Azure AD SSPR | Microsoft Docs'
description: Azure AD self-service password reset policy options
services: active-directory
keywords: Active directory password management, password management, Azure AD self service password reset
documentationcenter: ''
author: MicrosoftGuyJFlo
manager: femila
ms.reviewer: gahug

ms.assetid: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/26/2017
ms.author: joflore
ms.custom: it-pro

---
# Password policies and restrictions in Azure Active Directory

This article describes the password policies and complexity requirements associated with user accounts stored in your Azure AD tenant.

## Administrator password policy differences

Microsoft enforces a strong default **two gate** password reset policy for any Azure administrator role (Example: Global Administrator, Helpdesk Administrator, Password Administrator, etc.)

This disables administrators from using security questions and enforces the following.

Two gate policy, requiring two pieces of authentication data (email address **and** phone number), applies in the following circumstances

* All Azure administrator roles
  * Helpdesk Administrator
  * Service Support Administrator
  * Billing Administrator
  * Partner Tier1 Support
  * Partner Tier2 Support
  * Exchange Service Administrator
  * Lync Service Administrator
  * User Account Administrator
  * Directory Writers
  * Global Administrator/Company Administrator
  * SharePoint Service Administrator
  * Compliance Administrator
  * Application Administrator
  * Security Administrator
  * Privileged Role Administrator
  * Intune Service Administrator
  * Application Proxy Service Administrator
  * CRM Service Administrator
  * Power BI Service Administrator
  
* 30 days have elapsed in a trial **OR**
* Vanity domain is present (contoso.com) **OR**
* Azure AD Connect is synchronizing identities from your on-premises directory

### Exceptions
One gate policy, requiring one piece of authentication data (email address **or** phone number), applies in the following circumstances

* First 30 days of a trial **OR**
* Vanity domain is not present (*.onmicrosoft.com) **AND** Azure AD Connect is not synchronizing identities


## UserPrincipalName policies that apply to all user accounts

Every user account that needs to sign in to Azure AD must have a unique user principal name (UPN) attribute value associated with their account. The table below outlines the polices that apply to both on-premises Active Directory user accounts synchronized to the cloud and to cloud-only user accounts.

| Property | UserPrincipalName requirements |
| --- | --- |
| Characters allowed |<ul> <li>A – Z</li> <li>a - z</li><li>0 – 9</li> <li> . - \_ ! \# ^ \~</li></ul> |
| Characters not allowed |<ul> <li>Any '@' character that is not separating the user name from the domain.</li> <li>Cannot contain a period character '.' immediately preceding the '@' symbol</li></ul> |
| Length constraints |<ul> <li>Total length must not exceed 113 characters</li><li>64 characters before the ‘@’ symbol</li><li>48 characters after the ‘@’ symbol</li></ul> |

## Password policies that apply only to cloud user accounts

The following table describes the available password policy settings that can be applied to user accounts that are created and managed in Azure AD.

| Property | Requirements |
| --- | --- |
| Characters allowed |<ul><li>A – Z</li><li>a - z</li><li>0 – 9</li> <li>@ # $ % ^ & * - _ ! + = [ ] { } &#124; \ : ‘ , . ? / ` ~ “ ( ) ;</li></ul> |
| Characters not allowed |<ul><li>Unicode characters</li><li>Spaces</li><li> **Strong passwords only**: Cannot contain a dot character '.' immediately preceding the '@' symbol</li></ul> |
| Password restrictions |<ul><li>8 characters minimum and 16 characters maximum</li><li>**Strong passwords only**: Requires 3 out of 4 of the following:<ul><li>Lowercase characters</li><li>Uppercase characters</li><li>Numbers (0-9)</li><li>Symbols (see password restrictions above)</li></ul></li></ul> |
| Password expiry duration |<ul><li>Default value: **90** days </li><li>Value is configurable using the Set-MsolPasswordPolicy cmdlet from the Azure Active Directory Module for Windows PowerShell.</li></ul> |
| Password expiry notification |<ul><li>Default value: **14** days (before password expires)</li><li>Value is configurable using the Set-MsolPasswordPolicy cmdlet.</li></ul> |
| Password Expiry |<ul><li>Default value: **false** days (indicates that password expiry is enabled) </li><li>Value can be configured for individual user accounts using the Set-MsolUser cmdlet. </li></ul> |
| Password **change** history |Last password **cannot** be used again when **changing** a password. |
| Password **reset** history | Last password **may** be used again when **resetting** a forgotten password. |
| Account Lockout |After 10 unsuccessful sign-in attempts (wrong password), the user will be locked out for one minute. Further incorrect sign-in attempts lock out the user for increasing durations. |

## Set password expiration policies in Azure Active Directory

A global administrator for a Microsoft cloud service can use the Microsoft Azure Active Directory Module for Windows PowerShell to set up user passwords not to expire. You can also use Windows PowerShell cmdlets to remove the never-expires configuration, or to see which user passwords are set up not to expire. This guidance applies to other providers such as Microsoft Intune and Office 365, which also rely on Microsoft Azure Active Directory for identity and directory services.

> [!NOTE]
> Only passwords for user accounts that are not synchronized through directory synchronization can be configured to not expire. For more information about directory synchronization see[Connect AD with Azure AD](https://docs.microsoft.com/azure/active-directory/connect/active-directory-aadconnect).
>
>

## Set or check password policies using PowerShell

To get started, you need to [download and install the Azure AD PowerShell module](https://msdn.microsoft.com/library/azure/jj151815.aspx#bkmk_installmodule). Once you have it installed, you can follow the steps below to configure each field.

### How to check expiration policy for a password
1. Connect to Windows PowerShell using your company administrator credentials.
2. Execute one of the following commands:

   * To see whether a single user’s password is set to never expire, run the following cmdlet by using the user principal name (UPN) (for example, aprilr@contoso.onmicrosoft.com) or the user ID of the user you want to check: `Get-MSOLUser -UserPrincipalName <user ID> | Select PasswordNeverExpires`
   * To see the "Password never expires" setting for all users, run the following cmdlet: `Get-MSOLUser | Select UserPrincipalName, PasswordNeverExpires`

### Set a password to expire

1. Connect to Windows PowerShell using your company administrator credentials.
2. Execute one of the following commands:

   * To set the password of one user so that the password expires, run the following cmdlet by using the user principal name (UPN) or the user ID of the user: `Set-MsolUser -UserPrincipalName <user ID> -PasswordNeverExpires $false`
   * To set the passwords of all users in the organization so that they expire, use the following cmdlet: `Get-MSOLUser | Set-MsolUser -PasswordNeverExpires $false`

### Set a password to never expire

1. Connect to Windows PowerShell using your company administrator credentials.
2. Execute one of the following commands:

   * To set the password of one user to never expire, run the following cmdlet by using the user principal name (UPN) or the user ID of the user: `Set-MsolUser -UserPrincipalName <user ID> -PasswordNeverExpires $true`
   * To set the passwords of all the users in an organization to never expire, run the following cmdlet: `Get-MSOLUser | Set-MsolUser -PasswordNeverExpires $true`

## Next steps

The following links provide additional information regarding password reset using Azure AD

* [**Quick Start**](active-directory-passwords-getting-started.md) - Get up and running with Azure AD self service password management 
* [**Licensing**](active-directory-passwords-licensing.md) - Configure your Azure AD Licensing
* [**Data**](active-directory-passwords-data.md) - Understand the data that is required and how it is used for password management
* [**Rollout**](active-directory-passwords-best-practices.md) - Plan and deploy SSPR to your users using the guidance found here
* [**Customize**](active-directory-passwords-customize.md) - Customize the look and feel of the SSPR experience for your company.
* [**Reporting**](active-directory-passwords-reporting.md) - Discover if, when, and where your users are accessing SSPR functionality
* [**Technical Deep Dive**](active-directory-passwords-how-it-works.md) - Go behind the curtain to understand how it works
* [**Frequently Asked Questions**](active-directory-passwords-faq.md) - How? Why? What? Where? Who? When? - Answers to questions you always wanted to ask
* [**Troubleshoot**](active-directory-passwords-troubleshoot.md) - Learn how to resolve common issues that we see with SSPR
