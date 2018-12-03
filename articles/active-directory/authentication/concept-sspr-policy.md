---
title: Azure AD Self-service password reset policies
description: Configure Azure AD self-service password reset policy options

services: active-directory
ms.service: active-directory
ms.component: authentication
ms.topic: conceptual
ms.date: 07/11/2018

ms.author: joflore
author: MicrosoftGuyJFlo
manager: mtillman
ms.reviewer: sahenry
---
# Password policies and restrictions in Azure Active Directory

This article describes the password policies and complexity requirements associated with user accounts stored in your Azure Active Directory (Azure AD) tenant.

## Administrator reset policy differences

**Microsoft enforces a strong default *two-gate* password reset policy for any Azure administrator role** this policy may be different from the one you have defined for your users and cannot be changed. You should always test password reset functionality as a user without any Azure administrator roles assigned.

With a two-gate policy, **administrators don't have the ability to use security questions**.

A two-gate policy requires two pieces of authentication data, such as an email address *and* a phone number. A two-gate policy applies in the following circumstances:

* All the following Azure administrator roles are affected:
  * Helpdesk administrator
  * Service support administrator
  * Billing administrator
  * Partner Tier1 Support
  * Partner Tier2 Support
  * Exchange service administrator
  * Lync service administrator
  * User account administrator
  * Directory writers
  * Global administrator or company administrator
  * SharePoint service administrator
  * Compliance administrator
  * Application administrator
  * Security administrator
  * Privileged role administrator
  * Microsoft Intune service administrator
  * Application proxy service administrator
  * CRM service administrator
  * Power BI service administrator

* If 30 days have elapsed in a trial subscription; or
* A vanity domain is present, such as contoso.com; or
* Azure AD Connect is synchronizing identities from your on-premises directory

### Exceptions

A one-gate policy requires one piece of authentication data, such as an email address *or* phone number. A one-gate policy applies in the following circumstances:

* It's within the first 30 days of a trial subscription; or
* A vanity domain isn't present (*.onmicrosoft.com); and
* Azure AD Connect isn't synchronizing identities

## UserPrincipalName policies that apply to all user accounts

Every user account that needs to sign in to Azure AD must have a unique user principal name (UPN) attribute value associated with their account. The following table outlines the policies that apply to both on-premises Active Directory user accounts that are synchronized to the cloud and to cloud-only user accounts:

| Property | UserPrincipalName requirements |
| --- | --- |
| Characters allowed |<ul> <li>A – Z</li> <li>a - z</li><li>0 – 9</li> <li> ' \. - \_ ! \# ^ \~</li></ul> |
| Characters not allowed |<ul> <li>Any "\@\" character that's not separating the username from the domain.</li> <li>Can't contain a period character "." immediately preceding the "\@\" symbol</li></ul> |
| Length constraints |<ul> <li>The total length must not exceed 113 characters</li><li>There can be up to 64 characters before the "\@\" symbol</li><li>There can be up to 48 characters after the "\@\" symbol</li></ul> |

## Password policies that only apply to cloud user accounts

The following table describes the available password policy settings that can be applied to user accounts that are created and managed in Azure AD:

| Property | Requirements |
| --- | --- |
| Characters allowed |<ul><li>A – Z</li><li>a - z</li><li>0 – 9</li> <li>@ # $ % ^ & * - _ ! + = [ ] { } &#124; \ : ‘ , . ? / ` ~ " ( ) ;</li></ul> |
| Characters not allowed |<ul><li>Unicode characters.</li><li>Spaces.</li><li> Strong passwords only</li></ul> |
| Password restrictions |<ul><li>A minimum of 8 characters and a maximum of 16 characters.</li><li>Strong passwords only: Requires three out of four of the following:<ul><li>Lowercase characters.</li><li>Uppercase characters.</li><li>Numbers (0-9).</li><li>Symbols (see the previous password restrictions).</li></ul></li></ul> |
| Password expiry duration |<ul><li>Default value: **90** days.</li><li>The value is configurable by using the `Set-MsolPasswordPolicy` cmdlet from the Azure Active Directory Module for Windows PowerShell.</li></ul> |
| Password expiry notification |<ul><li>Default value: **14** days (before password expires).</li><li>The value is configurable by using the `Set-MsolPasswordPolicy` cmdlet.</li></ul> |
| Password expiry |<ul><li>Default value: **false** days (indicates that password expiry is enabled).</li><li>The value can be configured for individual user accounts by using the `Set-MsolUser` cmdlet.</li></ul> |
| Password change history |The last password *can't* be used again when the user changes a password. |
| Password reset history | The last password *can* be used again when the user resets a forgotten password. |
| Account lockout |After 10 unsuccessful sign-in attempts with the wrong password, the user is locked out for one minute. Further incorrect sign-in attempts lock out the user for increasing durations of time. |

## Set password expiration policies in Azure AD

A global administrator for a Microsoft cloud service can use the Microsoft Azure AD Module for Windows PowerShell to set user passwords not to expire. You can also use Windows PowerShell cmdlets to remove the never-expires configuration or to see which user passwords are set to never expire. 

This guidance applies to other providers, such as Intune and Office 365, which also rely on Azure AD for identity and directory services. Password expiration is the only part of the policy that can be changed.

> [!NOTE]
> Only passwords for user accounts that are not synchronized through directory synchronization can be configured to not expire. For more information about directory synchronization, see [Connect AD with Azure AD](https://docs.microsoft.com/azure/active-directory/connect/active-directory-aadconnect).
>

## Set or check the password policies by using PowerShell

To get started, you need to [download and install the Azure AD PowerShell module](https://docs.microsoft.com/powershell/module/Azuread/?view=azureadps-2.0). After you have it installed, you can use the following steps to configure each field.

### Check the expiration policy for a password

1. Connect to Windows PowerShell by using your company administrator credentials.
1. Execute one of the following commands:

   * To see if a single user’s password is set to never expire, run the following cmdlet by using the UPN (for example, *aprilr@contoso.onmicrosoft.com*) or the user ID of the user you want to check: `Get-AzureADUser -ObjectId <user ID> | Select-Object @{N="PasswordNeverExpires";E={$_.PasswordPolicies -contains "DisablePasswordExpiration"}}`
   * To see the **Password never expires** setting for all users, run the following cmdlet: `Get-AzureADUser -All $true | Select-Object UserPrincipalName, @{N="PasswordNeverExpires";E={$_.PasswordPolicies -contains "DisablePasswordExpiration"}}`

### Set a password to expire

1. Connect to Windows PowerShell by using your company administrator credentials.
1. Execute one of the following commands:

   * To set the password of one user so that the password expires, run the following cmdlet by using the UPN or the user ID of the user: `Set-AzureADUser -ObjectId <user ID> -PasswordPolicies None`
   * To set the passwords of all users in the organization so that they expire, use the following cmdlet: `Get-AzureADUser -All $true | Set-AzureADUser -PasswordPolicies None`

### Set a password to never expire

1. Connect to Windows PowerShell by using your company administrator credentials.
1. Execute one of the following commands:

   * To set the password of one user to never expire, run the following cmdlet by using the UPN or the user ID of the user: `Set-AzureADUser -ObjectId <user ID> -PasswordPolicies DisablePasswordExpiration`
   * To set the passwords of all the users in an organization to never expire, run the following cmdlet: `Get-AzureADUser -All $true | Set-AzureADUser -PasswordPolicies DisablePasswordExpiration`

   > [!WARNING]
   > Passwords set to `-PasswordPolicies DisablePasswordExpiration` still age based on the `pwdLastSet` attribute. If you set the user passwords to never expire and then 90+ days go by, the passwords expire. Based on the `pwdLastSet` attribute, if you change the expiration to `-PasswordPolicies None`, all passwords that have a `pwdLastSet` older than 90 days require the user to change them the next time they sign in. This change can affect a large number of users. 

## Next steps

The following articles provide additional information about password reset through Azure AD:

* [How do I complete a successful rollout of SSPR?](howto-sspr-deployment.md)
* [Reset or change your password](../user-help/active-directory-passwords-update-your-own-password.md).
* [Register for self-service password reset](../user-help/active-directory-passwords-reset-register.md).
* [Do you have a licensing question?](concept-sspr-licensing.md)
* [What data is used by SSPR and what data should you populate for your users?](howto-sspr-authenticationdata.md)
* [What authentication methods are available to users?](concept-sspr-howitworks.md#authentication-methods)
* [What is password writeback and why do I care about it?](howto-sspr-writeback.md)
* [How do I report on activity in SSPR?](howto-sspr-reporting.md)
* [What are all of the options in SSPR and what do they mean?](concept-sspr-howitworks.md)
* [I think something is broken. How do I troubleshoot SSPR?](active-directory-passwords-troubleshoot.md)
* [I have a question that was not covered somewhere else](active-directory-passwords-faq.md)
