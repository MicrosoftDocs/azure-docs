<properties
	pageTitle="Password policies and restrictions in Azure Active Directory | Microsoft Azure"
	description="Describes the policies that apply to passwords in Azure Active Directory, including allowed characters, length, and expiration"
  services="active-directory"
	documentationCenter=""
	authors="curtand"
	manager="femila"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/12/2016"
	ms.author="curtand"/>


# Password policies and restrictions in Azure Active Directory

This article describes the password policies and complexity	requirements associated with user accounts stored in your Azure AD directory.

> [AZURE.IMPORTANT] **Are you here because you're having problems signing in?** If so, [here's how you can change and reset your own password](active-directory-passwords-update-your-own-password.md).

## UserPrincipalName policies that apply to all user accounts

Every user account that needs to sign in to the Azure AD authentication	system must have a unique user principal name (UPN) attribute value	associated with that account. The following table outlines the polices	that apply to both on-premises Active Directory-sourced user accounts	(synced to the cloud) and to cloud-only user accounts.

|   Property           |     UserPrincipalName requirements  |
|   ----------------------- |   ----------------------- |
|  Characters allowed    |  <ul> <li>A – Z</li> <li>a -z </li><li>0 – 9</li> <li> . - \_ ! \# ^ \~</li></ul> |
|  Characters not allowed  | <ul> <li>Any '@' character that is not separating the user name from the domain.</li> <li>Cannot contain a period character '.' immediately preceding the '@' symbol</li></ul> |
| Length constraints  |       <ul> <li>Total length must not exceed 113 characters</li><li>64 characters before the ‘@’ symbol</li><li>48 characters after the ‘@’ symbol</li></ul>

## Password policies that apply only to cloud user accounts

The following table describes the available password policy settings that can be applied to user accounts that are created and managed in	Azure AD.

|  Property       |    Requirements          |
|   ----------------------- |   ----------------------- |
|  Characters allowed   |   <ul><li>A – Z</li><li>a -z </li><li>0 – 9</li> <li>@ # $ % ^ & * - _ ! + = [ ] { } &#124; \ : ‘ , . ? / ` ~ “ ( ) ;</li></ul> |
|  Characters not allowed   |       <ul><li>Unicode characters</li><li>Spaces</li><li> **Strong passwords only**: Cannot contain a dot character '.' immediately preceding the '@' symbol</li></ul> |
|   Password restrictions | <ul><li>8 characters minimum and 16 characters maximum</li><li>**Strong passwords only**: Requires 3 out of 4 of the following:<ul><li>Lowercase characters</li><li>Uppercase characters</li><li>Numbers (0-9)</li><li>Symbols (see password restrictions above)</li></ul></li></ul> |
| Password expiry duration      | <ul><li>Default value: **90** days </li><li>Value is configurable using the Set-MsolPasswordPolicy cmdlet from the Azure Active Directory Module for Windows PowerShell.</li></ul> |
| Password expiry notification |  <ul><li>Default value: **14** days (before password expires)</li><li>Value is configurable using the Set-MsolPasswordPolicy cmdlet.</li></ul> |
| Password Expiry |  <ul><li>Default value: **false** days (indicates that password expiry is enabled) </li><li>Value can be configured for individual user accounts using the Set-MsolUser cmdlet. </li></ul> |
|  Password history  | Last password cannot be used again. |
|  Password history duration | Forever |
|  Account Lockout | After 10 unsuccessful sign-in attempts (wrong password), the user will be locked out for one minute. Further incorrect sign-in attempts will lock out the user for increasing durations. |


## Next Steps

* **Are you here because you're having problems signing in?** If so, [here's how you can change and reset your own password](active-directory-passwords-update-your-own-password.md).
* [Manage your passwords from anywhere](active-directory-passwords.md)
* [How Password Management works](active-directory-passwords-how-it-works.md)
* [Getting started with Password Mangement](active-directory-passwords-getting-started.md)
* [Customize Password Management](active-directory-passwords-customize.md)
* [Password Management Best Practices](active-directory-passwords-best-practices.md)
* [How to get Operational Insights with Password Management Reports](active-directory-passwords-get-insights.md)
* [Password Management FAQ](active-directory-passwords-faq.md)
* [Troubleshoot Password Management](active-directory-passwords-troubleshoot.md)
* [Learn More](active-directory-passwords-learn-more.md)
