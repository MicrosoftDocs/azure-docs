---
title: Combined password policy and weak password check in Azure Active Directory
description: Learn how to dynamically ban weak passwords from your environment with Azure Active Directory Password Protection

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 10/13/2021

ms.author: justinha
author: justinha
manager: daveba
ms.reviewer: rogoya

ms.collection: M365-identity-device-management
---
# Combined password policy and weak password check in Azure Active Directory

Beginning in October 2021, Azure Active Directory (Azure AD) validation for compliance with password policies also includes a check for known weak passwords and their variants. 
As the combined check for password policy and banned passwords gets rolled out to tenants, users may see differences when they create, change, or reset their passwords. This topic explains details about the password policy criteria checked by Aure AD and some cases where the user experience is changed by the combined check. 

## Azure AD password policies

A password policy is applied to all user and admin accounts that are created and managed directly in Azure AD. You can ban weak passwords and define parameters to lock out an account after repeated bad password attempts. Other password policy settings can't be modified.

The Azure AD password policy doesn't apply to user accounts synchronized from an on-premises AD DS environment using Azure AD Connect, unless you enable EnforceCloudPasswordPolicyForPasswordSyncedUsers.

The following Azure AD password policy requirements apply for all passwords that are created, changed, or reset in Azure AD. This includes during user provisioning, password change, and password reset flows. Unless noted, you can't change these settings:

| Property | Requirements |
| --- | --- |
| Characters allowed |Uppercase characters (A - Z)<br>Lowercase characters (a - z)<br>Numbers (0 - 9)<br>Symbols:<br>- @ # $ % ^ & * - _ ! + = [ ] { } &#124; \ : ' , . ? / \` ~ " ( ) ; < ><br>- blank space |
| Characters not allowed | Unicode characters |
| Password length |Passwords require<br>- A minimum of 8 characters<br>- A maximum of 256 characters</li> |
| Password complexity |Passwords require three out of four of the following:<br>- Uppercase characters<br>- Lowercase characters<br>- Numbers <br>- Symbols<br> Note: This check is not required for Education tenants. |
| Password not recently used | When a user changes or resets their password, the new password cannot be the same as the current or recently used passwords. |
| Password is not banned by Azure AD Password Protection | The password cannot be on the global list of banned passwords for Azure AD Password Protection, or on a customizable list of banned passwords specific to your organization. |

## Password expiration policies

A *global administrator* or *user administrator* can use the [Microsoft Azure AD Module for Windows PowerShell](/powershell/module/Azuread/) to set user passwords not to expire.

> [!NOTE]
> By default only passwords for user accounts that aren't synchronized through Azure AD Connect can be configured to not expire. For more information about directory synchronization, see [Connect AD with Azure AD](../hybrid/how-to-connect-password-hash-synchronization.md#password-expiration-policy).

You can also use PowerShell to remove the never-expires configuration or to see which user passwords are set to never expire.

The following expiration requirements apply to other providers that use Azure AD for identity and directory services, such as Intune and Microsoft 365. 

| Property | Requirements |
| --- | --- |
| Password expiry duration (Maximum password age) |<ul><li>Default value: **90** days.</li><li>The value is configurable by using the `Set-MsolPasswordPolicy` cmdlet from the Azure Active Directory Module for Windows PowerShell.</li></ul> |
| Password expiry notification (When users are notified of password expiration) |<ul><li>Default value: **14** days (before password expires).</li><li>The value is configurable by using the `Set-MsolPasswordPolicy` cmdlet.</li></ul> |
| Password expiry (Let passwords never expire) |<ul><li>Default value: **false** (indicates that password's have an expiration date).</li><li>The value can be configured for individual user accounts by using the `Set-MsolUser` cmdlet.</li></ul> |

