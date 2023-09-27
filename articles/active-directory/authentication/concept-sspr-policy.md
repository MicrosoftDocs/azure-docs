---
title: Self-service password reset policies
description: Learn about the different Microsoft Entra self-service password reset policy options

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 04/29/2023

ms.author: justinha
author: justinha
manager: amycolannino
ms.reviewer: tilarso

ms.collection: M365-identity-device-management
ms.custom: contperf-fy20q4, has-azure-ad-ps-ref
---
# Password policies and account restrictions in Microsoft Entra ID

In Microsoft Entra ID, there's a password policy that defines settings like the password complexity, length, or age. There's also a policy that defines acceptable characters and length for usernames.

When self-service password reset (SSPR) is used to change or reset a password in Microsoft Entra ID, the password policy is checked. If the password doesn't meet the policy requirements, the user is prompted to try again. Azure administrators have some restrictions on using SSPR that are different to regular user accounts, and there are minor exceptions for trial and free versions of Microsoft Entra ID.

This article describes the password policy settings and complexity requirements associated with user accounts. It also covers how to use PowerShell to check or set password expiration settings.

## Username policies

Every account that signs in to Microsoft Entra ID must have a unique user principal name (UPN) attribute value associated with their account. In hybrid environments with an on-premises Active Directory Domain Services (AD DS) environment synchronized to Microsoft Entra ID using Microsoft Entra Connect, by default the Microsoft Entra UPN is set to the on-premises UPN.

The following table outlines the username policies that apply to both on-premises AD DS accounts that are synchronized to Microsoft Entra ID, and for cloud-only user accounts created directly in Microsoft Entra ID:

| Property | UserPrincipalName requirements |
| --- | --- |
| Characters allowed |A – Z<br>a - z<br>0 – 9<br>' \. - \_ ! \# ^ \~ |
| Characters not allowed |Any "\@\" character that's not separating the username from the domain.<br>Can't contain a period character "." immediately preceding the "\@\" symbol |
| Length constraints |The total length must not exceed 113 characters<br>There can be up to 64 characters before the "\@\" symbol<br>There can be up to 48 characters after the "\@\" symbol |

<a name='azure-ad-password-policies'></a>

## Microsoft Entra password policies

A password policy is applied to all user accounts that are created and managed directly in Microsoft Entra ID. Some of these password policy settings can't be modified, though you can [configure custom banned passwords for Microsoft Entra password protection](tutorial-configure-custom-password-protection.md) or account lockout parameters.

By default, an account is locked out after 10 unsuccessful sign-in attempts with the wrong password. The user is locked out for one minute. Further incorrect sign-in attempts lock out the user for increasing durations of time. [Smart lockout](howto-password-smart-lockout.md) tracks the last three bad password hashes to avoid incrementing the lockout counter for the same password. If someone enters the same bad password multiple times, they won't get locked out. You can define the smart lockout threshold and duration.

The Microsoft Entra password policy doesn't apply to user accounts synchronized from an on-premises AD DS environment using Microsoft Entra Connect, unless you enable *EnforceCloudPasswordPolicyForPasswordSyncedUsers*.

The following Microsoft Entra password policy options are defined. Unless noted, you can't change these settings:

| Property | Requirements |
| --- | --- |
| Characters allowed |A – Z<br>a - z<br>0 – 9<br>@ # $ % ^ & * - _ ! + = [ ] { } &#124; \ : ' , . ? / \` ~ " ( ) ; < ><br>Blank space |
| Characters not allowed | Unicode characters |
| Password restrictions |A minimum of 8 characters and a maximum of 256 characters.<br>Requires three out of four of the following types of characters:<br>- Lowercase characters<br>- Uppercase characters<br>- Numbers (0-9)<br>- Symbols (see the previous password restrictions) |
| Password expiry duration (Maximum password age) |Default value: **90** days. If the tenant was created after 2021, it has no default expiration value. You can check current policy with [Get-MsolPasswordPolicy](/powershell/module/msonline/get-msolpasswordpolicy).<br>The value is configurable by using the `Set-MsolPasswordPolicy` cmdlet from the Azure AD module for PowerShell.|
| Password expiry (Let passwords never expire) |Default value: **false** (indicates that passwords have an expiration date).<br>The value can be configured for individual user accounts by using the `Set-MsolUser` cmdlet. |
| Password change history | The last password *can't* be used again when the user changes a password. |
| Password reset history | The last password *can* be used again when the user resets a forgotten password. |

## Administrator reset policy differences

By default, administrator accounts are enabled for self-service password reset, and a strong default *two-gate* password reset policy is enforced. This policy may be different from the one you have defined for your users, and this policy can't be changed. You should always test password reset functionality as a user without any Azure administrator roles assigned.

The two-gate policy requires two pieces of authentication data, such as an email address, authenticator app, or a phone number, and it prohibits security questions. Office and mobile voice calls are also prohibited for trial or free versions of Microsoft Entra ID. 

A two-gate policy applies in the following circumstances:

* All the following Azure administrator roles are affected:
  * Application administrator
  * Application proxy service administrator
  * Authentication administrator
  * Azure AD Joined Device Local Administrator
  * Billing administrator
  * Compliance administrator
  * Device administrators
  * Directory synchronization accounts
  * Directory writers
  * Dynamics 365 administrator
  * Exchange administrator
  * Global administrator or company administrator
  * Helpdesk administrator
  * Intune administrator
  * Mailbox Administrator
  * Partner Tier1 Support
  * Partner Tier2 Support
  * Password administrator
  * Power BI service administrator
  * Privileged Authentication administrator
  * Privileged role administrator
  * Security administrator
  * Service support administrator
  * SharePoint administrator
  * Skype for Business administrator
  * User administrator

* If 30 days have elapsed in a trial subscription; or
* A custom domain has been configured for your Microsoft Entra tenant, such as *contoso.com*; or
* Microsoft Entra Connect is synchronizing identities from your on-premises directory

You can disable the use of SSPR for administrator accounts using the [Update-MgPolicyAuthorizationPolicy](/powershell/module/microsoft.graph.identity.signins/update-mgpolicyauthorizationpolicy) PowerShell cmdlet. The `-AllowedToUseSspr:$true|$false ` parameter enables/disables SSPR for administrators. Policy changes to enable or disable SSPR for administrator accounts can take up to 60 minutes to take effect. 

### Exceptions

A one-gate policy requires one piece of authentication data, such as an email address or phone number. A one-gate policy applies in the following circumstances:

- It's within the first 30 days of a trial subscription 

  -Or-

- A custom domain isn't configured (the tenant is using the default **.onmicrosoft.com*, which isn't recommended for production use) and Microsoft Entra Connect isn't synchronizing identities.

## Password expiration policies

A *Global Administrator* or *User Administrator* can use the [Azure Active Directory module for PowerShell](/powershell/module/Azuread/) to set user passwords not to expire.

You can also use PowerShell cmdlets to remove the never-expires configuration or to see which user passwords are set to never expire.

This guidance applies to other providers, such as Intune and Microsoft 365, which also rely on Microsoft Entra ID for identity and directory services. Password expiration is the only part of the policy that can be changed.

> [!NOTE]
> By default only passwords for user accounts that aren't synchronized through Microsoft Entra Connect can be configured to not expire. For more information about directory synchronization, see [Connect AD with Microsoft Entra ID](../hybrid/connect/how-to-connect-password-hash-synchronization.md#password-expiration-policy).

### Set or check the password policies by using PowerShell

To get started, [download and install the Azure AD PowerShell module](/powershell/module/Azuread/) and [connect it to your Microsoft Entra tenant](/powershell/module/azuread/connect-azuread#examples).

After the module is installed, use the following steps to complete each task as needed.

### Check the expiration policy for a password

1. Open a PowerShell prompt and [connect to your Microsoft Entra tenant](/powershell/module/azuread/connect-azuread#examples) using a *Global Administrator* or *User Administrator* account.

1. Run one of the following commands for either an individual user or for all users:

   * To see if a single user's password is set to never expire, run the following cmdlet. Replace `<user ID>` with the user ID of the user you want to check, such as *driley\@contoso.onmicrosoft.com*:

       ```powershell
       Get-AzureADUser -ObjectId <user ID> | Select-Object @{N="PasswordNeverExpires";E={$_.PasswordPolicies -contains "DisablePasswordExpiration"}}
       ```

   * To see the **Password never expires** setting for all users, run the following cmdlet:

       ```powershell
       Get-AzureADUser -All $true | Select-Object UserPrincipalName, @{N="PasswordNeverExpires";E={$_.PasswordPolicies -contains "DisablePasswordExpiration"}}
       ```

### Set a password to expire

1. Open a PowerShell prompt and [connect to your Microsoft Entra tenant](/powershell/module/azuread/connect-azuread#examples) using a *Global Administrator* or *User Administrator* account.

1. Run one of the following commands for either an individual user or for all users:

   * To set the password of one user so that the password expires, run the following cmdlet. Replace `<user ID>` with the user ID of the user you want to check, such as *driley\@contoso.onmicrosoft.com*

       ```powershell
       Set-AzureADUser -ObjectId <user ID> -PasswordPolicies None
       ```

   * To set the passwords of all users in the organization so that they expire, use the following cmdlet:

       ```powershell
       Get-AzureADUser -All $true | Set-AzureADUser -PasswordPolicies None
       ```

### Set a password to never expire

1. Open a PowerShell prompt and [connect to your Microsoft Entra tenant](/powershell/module/azuread/connect-azuread#examples) using a *Global Administrator* or *User Administrator* account.
1. Run one of the following commands for either an individual user or for all users:

   * To set the password of one user to never expire, run the following cmdlet. Replace `<user ID>` with the user ID of the user you want to check, such as *driley\@contoso.onmicrosoft.com*

       ```powershell
       Set-AzureADUser -ObjectId <user ID> -PasswordPolicies DisablePasswordExpiration
       ```

   * To set the passwords of all the users in an organization to never expire, run the following cmdlet:

       ```powershell
       Get-AzureADUser -All $true | Set-AzureADUser -PasswordPolicies DisablePasswordExpiration
       ```

   > [!WARNING]
   > Passwords set to `-PasswordPolicies DisablePasswordExpiration` still age based on the `pwdLastSet` attribute. Based on the `pwdLastSet` attribute, if you change the expiration to `-PasswordPolicies None`, all passwords that have a `pwdLastSet` older than 90 days require the user to change them the next time they sign in. This change can affect a large number of users.

## Next steps

To get started with SSPR, see [Tutorial: Enable users to unlock their account or reset passwords using Microsoft Entra self-service password reset](tutorial-enable-sspr.md).

If you or users have problems with SSPR, see [Troubleshoot self-service password reset](./troubleshoot-sspr.md)
