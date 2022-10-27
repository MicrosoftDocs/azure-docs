---
title: Combined password policy and check for weak passwords in Azure Active Directory
description: Learn about the combined password policy and check for weak passwords in Azure Active Directory

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 05/04/2022

ms.author: justinha
author: sajiang
manager: amycolannino
ms.reviewer: sajiang

ms.collection: M365-identity-device-management
---
# Combined password policy and check for weak passwords in Azure Active Directory

Beginning in October 2021, Azure Active Directory (Azure AD) validation for compliance with password policies also includes a check for [known weak passwords](concept-password-ban-bad.md) and their variants. 
As the combined check for password policy and banned passwords gets rolled out to tenants, Azure AD and Office 365 admin center users may see differences when they create, change, or reset their passwords. This topic explains details about the password policy criteria checked by Azure AD. 

## Azure AD password policies

A password policy is applied to all user and admin accounts that are created and managed directly in Azure AD. You can [ban weak passwords](concept-password-ban-bad.md) and define parameters to [lock out an account](howto-password-smart-lockout.md) after repeated bad password attempts. Other password policy settings can't be modified.

The Azure AD password policy doesn't apply to user accounts synchronized from an on-premises AD DS environment using Azure AD Connect unless you enable EnforceCloudPasswordPolicyForPasswordSyncedUsers.

The following Azure AD password policy requirements apply for all passwords that are created, changed, or reset in Azure AD. Requirements are applied during user provisioning, password change, and password reset flows. You can't change these settings except as noted.

| Property | Requirements |
| --- | --- |
| Characters allowed |Uppercase characters (A - Z)<br>Lowercase characters (a - z)<br>Numbers (0 - 9)<br>Symbols:<br>- @ # $ % ^ & * - _ ! + = [ ] { } &#124; \ : ' , . ? / \` ~ " ( ) ; < ><br>- blank space |
| Characters not allowed | Unicode characters |
| Password length |Passwords require<br>- A minimum of eight characters<br>- A maximum of 256 characters</li> |
| Password complexity |Passwords require three out of four of the following categories:<br>- Uppercase characters<br>- Lowercase characters<br>- Numbers <br>- Symbols<br> Note: Password complexity check isn't required for Education tenants. |
| Password not recently used | When a user changes or resets their password, the new password can't be the same as the current or recently used passwords. |
| Password isn't banned by [Azure AD Password Protection](concept-password-ban-bad.md) | The password can't be on the global list of banned passwords for Azure AD Password Protection, or on the customizable list of banned passwords specific to your organization. |

## Password expiration policies

Password expiration policies are unchanged but they're included in this topic for completeness. A *global administrator* or *user administrator* can use the [Microsoft Azure AD Module for Windows PowerShell](/powershell/module/Azuread/) to set user passwords not to expire.

> [!NOTE]
> By default, only passwords for user accounts that aren't synchronized through Azure AD Connect can be configured to not expire. For more information about directory synchronization, see [Connect AD with Azure AD](../hybrid/how-to-connect-password-hash-synchronization.md#password-expiration-policy).

You can also use PowerShell to remove the never-expires configuration, or to see user passwords that are set to never expire.

The following expiration requirements apply to other providers that use Azure AD for identity and directory services, such as Microsoft Endpoint Manager and Microsoft 365. 

| Property | Requirements |
| --- | --- |
| Password expiry duration (Maximum password age) |<ul><li>Default value: **90** days.</li><li>The value is configurable by using the `Set-MsolPasswordPolicy` cmdlet from the Azure Active Directory Module for Windows PowerShell.</li></ul> |
| Password expiry notification (When users are notified of password expiration) |<ul><li>Default value: **14** days (before password expires).</li><li>The value is configurable by using the `Set-MsolPasswordPolicy` cmdlet.</li></ul> |
| Password expiry (Let passwords never expire) |<ul><li>Default value: **false** (indicates that password's have an expiration date).</li><li>The value can be configured for individual user accounts by using the `Set-MsolUser` cmdlet.</li></ul> |

## Next steps

- [Password policies and account restrictions in Azure Active Directory](concept-sspr-policy.md)
- [Eliminate bad passwords using Azure Active Directory Password Protection](concept-password-ban-bad.md)
