---
title: Manage authentication methods for Azure AD Multi-Factor Authentication
description: Learn how you can configure Azure Active Directory user settings for Azure AD Multi-Factor Authentication

services: multi-factor-authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 07/05/2023

ms.author: justinha
author: justinha
manager: amycolannino
ms.reviewer: michmcla, dawoo

ms.collection: M365-identity-device-management
---

# Manage user authentication methods for Azure AD Multi-Factor Authentication

Users in Azure AD have two distinct sets of contact information:  

- Public profile contact information, which is managed in the user profile and visible to members of your organization. For users synced from on-premises Active Directory, this information is managed in on-premises Windows Server Active Directory Domain Services.
- Authentication methods, which are always kept private and only used for authentication, including multi-factor authentication (MFA). Administrators can manage these methods in a user's authentication method blade and users can manage their methods in Security Info page of MyAccount.

When managing Azure AD Multi-Factor Authentication methods for your users, Authentication administrators can: 

1. Add authentication methods for a specific user, including phone numbers used for MFA.
1. Reset a user's password.
1. Require a user to re-register for MFA.
1. Revoke existing MFA sessions.
1. Delete a user's existing app passwords  

## Add authentication methods for a user 

You can add authentication methods for a user via the Azure portal or Microsoft Graph.  

> [!NOTE]
> For security reasons, public user contact information fields should not be used to perform MFA. Instead, users should populate their authentication method numbers to be used for MFA.  

:::image type="content" source="media/howto-mfa-userdevicesettings/add-authentication-method-detail.png" alt-text="Add authentication methods from the Azure portal":::

To add authentication methods for a user via the Azure portal:  

1. Sign into the **Azure portal**. 
1. Browse to **Azure Active Directory** > **Users** > **All users**. 
1. Choose the user for whom you wish to add an authentication method and select **Authentication methods**.  
1. At the top of the window, select **+ Add authentication method**.
   1. Select a method (phone number or email). Email may be used for self-password reset but not authentication. When adding a phone number, select a phone type and enter phone number with valid format (e.g. +1 4255551234).
   1. Select **Add**.

> [!NOTE]
> The preview experience allows administrators to add any available authentication methods for users, while the original experience only allows updating of phone and alternate phone methods.

### Manage methods using PowerShell

Install the Microsoft.Graph.Identity.Signins PowerShell module using the following commands. 

```powershell
Install-module Microsoft.Graph.Identity.Signins
Connect-MgGraph -Scopes UserAuthenticationMethod.ReadWrite.All
Select-MgProfile -Name beta
```

List phone based authentication methods for a specific user.

```powershell
Get-MgUserAuthenticationPhoneMethod -UserId balas@contoso.com
```

Create a mobile phone authentication method for a specific user.

```powershell
New-MgUserAuthenticationPhoneMethod -UserId balas@contoso.com -phoneType "mobile" -phoneNumber "+1 7748933135"
```

Remove a specific phone method for a user

```powershell
Remove-MgUserAuthenticationPhoneMethod -UserId balas@contoso.com -PhoneAuthenticationMethodId 3179e48a-750b-4051-897c-87b9720928f7
```

Authentication methods can also be managed using Microsoft Graph APIs. For more information, see [Authentication and authorization basics](/graph/auth/auth-concepts).

## Manage user authentication options

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

If you're assigned the *Authentication Administrator* role, you can require users to reset their password, re-register for MFA, or revoke existing MFA sessions from their user object. To manage user settings, complete the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. On the left, select **Azure Active Directory** > **Users** > **All users**.
1. Choose the user you wish to perform an action on and select **Authentication methods**. At the top of the window, then choose one of the following options for the user:
   - **Reset Password** resets the user's password and assigns a temporary password that must be changed on the next sign-in.
   - **Require Re-register MFA** makes it so that when the user signs in next time, they're requested to set up a new MFA authentication method.
      > [!NOTE]
      > The user's currently registered authentication methods aren't deleted when an admin requires re-registration for MFA. After a user re-registers for MFA, we recommend they review their security info and delete any previously registered authentication methods that are no longer usable.
   - **Revoke MFA Sessions** clears the user's remembered MFA sessions and requires them to perform MFA the next time it's required by the policy on the device.
   
    :::image type="content" source="media/howto-mfa-userdevicesettings/manage-authentication-methods-in-azure.png" alt-text="Manage authentication methods from the Azure portal":::

## Delete users' existing app passwords

For users that have defined app passwords, administrators can also choose to delete these passwords, causing legacy authentication to fail in those applications. These actions may be necessary if you need to provide assistance to a user, or need to reset their authentication methods. Non-browser apps that were associated with these app passwords will stop working until a new app password is created. 

To delete a user's app passwords, complete the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. On the left-hand side, select **Azure Active Directory** > **Users** > **All users**.
1. Select **Multi-Factor Authentication**. You may need to scroll to the right to see this menu option. Select the example screenshot below to see the full Azure portal window and menu location:
    [![Select Multi-Factor Authentication from the Users window in Azure AD.](media/howto-mfa-userstates/selectmfa-cropped.png)](media/howto-mfa-userstates/selectmfa.png#lightbox)
1. Check the box next to the user or users that you wish to manage. A list of quick step options appears on the right.
1. Select **Manage user settings**, then check the box for **Delete all existing app passwords generated by the selected users**, as shown in the following example:
   ![Delete all existing app passwords](./media/howto-mfa-userdevicesettings/deleteapppasswords.png)
1. 1. Select **save**, then **close**.

## Next steps

This article showed you how to configure individual user settings. To configure overall Azure AD Multi-Factor Authentication service settings, see [Configure Azure AD Multi-Factor Authentication settings](howto-mfa-mfasettings.md).

If your users need help, see the [User guide for Azure AD Multi-Factor Authentication](https://support.microsoft.com/account-billing/how-to-use-the-microsoft-authenticator-app-9783c865-0308-42fb-a519-8cf666fe0acc).
