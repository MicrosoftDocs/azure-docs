---
title: Revoke user access in an emergency in Azure Active Directory | Microsoft Docs
description: How to revoke all access for a user in Azure Active Directory
services: active-directory 
ms.service: active-directory
ms.subservice: users-groups-roles
ms.workload: identity
ms.topic: how-to
author: curtand
ms.author: curtand
manager: daveba
ms.reviewer: krbain
ms.date: 07/15/2020
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# Revoke user access in Azure Active Directory

Among the scenarios that could require an administrator to revoke all access for a user include compromised accounts, employee termination, and other insider threats. Depending on the complexity of the environment, administrators can take several steps to ensure access is revoked. In some scenarios, there could be a period between initiation of access revocation and when access is effectively revoked.

To mitigate the risks, you must understand how tokens work. There are many kinds of tokens, which fall into one of the patterns mentioned in the sections below.

## Access tokens and refresh tokens

Access tokens and refresh tokens are frequently used with thick client applications, and also used in browser-based applications such as single page apps.

- When users authenticate to Azure AD, authorization policies are evaluated to determine if the user can be granted access to a specific resource.  

- If authorized, Azure AD issues an access token and a refresh token for the resource.  

- Access tokens issued by Azure AD by default last for 1 hour. If the authentication protocol allows, the app can silently reauthenticate the user by passing the refresh token to the Azure AD when the access token expires.

Azure AD then reevaluates its authorization policies. If the user is still authorized, Azure AD issues a new access token and refresh token.

Access tokens can be a security concern if access must be revoked within a time that is shorter than the lifetime of the token, which is usually around an hour. For this reason, Microsoft is actively working to bring [continuous access evaluation](../conditional-access/concept-continuous-access-evaluation.md) to Microsoft 365 applications, which helps ensure invalidation of access tokens in near real time.  

## Session tokens (cookies)

Most browser-based applications use session tokens instead of access and refresh tokens.  

- When a user opens a browser and authenticates to an application via Azure AD, the user receives two session tokens. One from Azure AD and another from the application.  

- Once an application issues its own session token, access to the application is governed by the application’s session. At this point, the user is affected by only the authorization policies that the application is aware of.

- The authorization policies of Azure AD are reevaluated as often as the application sends the user back to Azure AD. Reevaluation usually happens silently, though the frequency depends on how the application is configured. It's possible that the app may never send the user back to Azure AD as long as the session token is valid.

- For a session token to be revoked, the application must revoke access based on its own authorization policies. Azure AD can’t directly revoke a session token issued by an application.  

## Revoke access for a user in the hybrid environment

For a hybrid environment with on-premises Active Directory synchronized with Azure Active Directory, Microsoft recommends IT admins to take the following actions.  

### On-premises Active Directory environment

As an admin in the Active Directory, connect to your on-premises network, open PowerShell, and take the following actions:

1. Disable the user in Active Directory. Refer to [Disable-ADAccount](/powershell/module/addsadministration/disable-adaccount?view=win10-ps).

    ```PowerShell
    Disable-ADAccount -Identity johndoe  
    ```

1. Reset the user’s password twice in the Active Directory. Refer to [Set-ADAccountPassword](/powershell/module/addsadministration/set-adaccountpassword?view=win10-ps).

    > [!NOTE]
    > The reason for changing a user’s password twice is to mitigate the risk of pass-the-hash, especially if there are delays in on-premises password replication. If you can safely assume this account isn't compromised, you may reset the password only once.

    > [!IMPORTANT] 
    > Don't use the example passwords in the following cmdlets. Be sure to change the passwords to a random string.

    ```PowerShell
    Set-ADAccountPassword -Identity johndoe -Reset -NewPassword (ConvertTo-SecureString -AsPlainText "p@ssw0rd1" -Force)
    Set-ADAccountPassword -Identity johndoe -Reset -NewPassword (ConvertTo-SecureString -AsPlainText "p@ssw0rd2" -Force)
    ```

### Azure Active Directory environment

As an administrator in Azure Active Directory, open PowerShell, run ``Connect-AzureAD``, and take the following actions:

1. Disable the user in Azure AD. Refer to [Set-AzureADUser](/powershell/module/azuread/Set-AzureADUser?view=azureadps-2.0).

    ```PowerShell
    Set-AzureADUser -ObjectId johndoe@contoso.com -AccountEnabled $false
    ```
1. Revoke the user’s Azure AD refresh tokens. Refer to [Revoke-AzureADUserAllRefreshToken](/powershell/module/azuread/revoke-azureaduserallrefreshtoken?view=azureadps-2.0).

    ```PowerShell
    Revoke-AzureADUserAllRefreshToken -ObjectId johndoe@contoso.com
    ```

1. Disable the user’s devices. Refer to [Get-AzureADUserRegisteredDevice](/powershell/module/azuread/get-azureaduserregistereddevice?view=azureadps-2.0).

    ```PowerShell
    Get-AzureADUserRegisteredDevice -ObjectId johndoe@contoso.com | Set-AzureADDevice -AccountEnabled $false
    ```

## Optional steps

- [Wipe corporate data from Intune-managed applications](/mem/intune/apps/apps-selective-wipe).

- [Wipe corporate owned devices be resetting device to factory default settings](/mem/intune/remote-actions/devices-wipe).

> [!NOTE]
> Data on the device cannot be recovered after a wipe.

## When access is revoked

Once admins have taken the above steps, the user can't gain new tokens for any application tied to Azure Active Directory. The elapsed time between revocation and the user losing their access depends on how the application is granting access:

- For **applications using access tokens**, the user loses access when the access token expires.

- For **applications that use session tokens**, the existing sessions end as soon as the token expires. If the disabled state of the user is synchronized to the application, the application can automatically revoke the user’s existing sessions if it's configured to do so.  The time it takes depends on the frequency of synchronization between the application and Azure AD.

## Next steps

- [Secure access practices for Azure AD administrators](../roles/security-planning.md)
- [Add or update user profile information](../fundamentals/active-directory-users-profile-azure-portal.md)