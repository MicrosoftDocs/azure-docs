---
title: Combined password policy and weak password ckeck in Azure Active Directory
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

Beginning in October 2021, Azure Active Directory (Azure AD) validation for compliance with password policies includes a check for known weak passwords and their variants. 
As the combined password check is rolled out to customers gradually, users may see differences when they create, change, or reset their password. This topc explains details about the password policy criteria checked by Aure AD and some cases where the user experience is changed by the combined check. 

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
| Password expiry duration (Maximum password age) |<ul><li>Default value: **90** days.</li><li>The value is configurable by using the `Set-MsolPasswordPolicy` cmdlet from the Azure Active Directory Module for Windows PowerShell.</li></ul> |
| Password expiry notification (When users are notified of password expiration) |<ul><li>Default value: **14** days (before password expires).</li><li>The value is configurable by using the `Set-MsolPasswordPolicy` cmdlet.</li></ul> |
| Password expiry (Let passwords never expire) |<ul><li>Default value: **false** (indicates that password's have an expiration date).</li><li>The value can be configured for individual user accounts by using the `Set-MsolUser` cmdlet.</li></ul> |
| Password change history | The last password *can't* be used again when the user changes a password. |
| Password reset history | The last password *can* be used again when the user resets a forgotten password. |

