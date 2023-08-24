---
title: Enable per-user Multi-Factor Authentication
description: Learn how to enable per-user Azure AD Multi-Factor Authentication by changing the user state

services: multi-factor-authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 01/29/2023

ms.author: justinha
author: justinha
manager: amycolannino
ms.reviewer: michmcla

ms.collection: M365-identity-device-management 
ms.custom:
---
# Enable per-user Azure AD Multi-Factor Authentication to secure sign-in events

To secure user sign-in events in Azure AD, you can require multi-factor authentication (MFA). Enabling Azure AD Multi-Factor Authentication using Conditional Access policies is the recommended approach to protect users. Conditional Access is an Azure AD Premium P1 or P2 feature that lets you apply rules to require MFA as needed in certain scenarios. To get started using Conditional Access, see [Tutorial: Secure user sign-in events with Azure AD Multi-Factor Authentication](tutorial-enable-azure-mfa.md).

For Azure AD free tenants without Conditional Access, you can [use security defaults to protect users](../fundamentals/security-defaults.md). Users are prompted for MFA as needed, but you can't define your own rules to control the behavior.

If needed, you can instead enable each account for per-user Azure AD Multi-Factor Authentication. When users are enabled individually, they perform multi-factor authentication each time they sign in (with some exceptions, such as when they sign in from trusted IP addresses or when the _remember MFA on trusted devices_ feature is turned on).

Changing [user states](#azure-ad-multi-factor-authentication-user-states) isn't recommended unless your Azure AD licenses don't include Conditional Access and you don't want to use security defaults. For more information on the different ways to enable MFA, see [Features and licenses for Azure AD Multi-Factor Authentication](concept-mfa-licensing.md).

> [!IMPORTANT]
>
> This article details how to view and change the status for per-user Azure AD Multi-Factor Authentication. If you use Conditional Access or security defaults, you don't review or enable user accounts using these steps.
>
> Enabling Azure AD Multi-Factor Authentication through a Conditional Access policy doesn't change the state of the user. Don't be alarmed if users appear disabled. Conditional Access doesn't change the state.
>
> **Don't enable or enforce per-user Azure AD Multi-Factor Authentication if you use Conditional Access policies.**

## Azure AD Multi-Factor Authentication user states

A user's state reflects whether an admin has enrolled them in per-user Azure AD Multi-Factor Authentication. User accounts in Azure AD Multi-Factor Authentication have the following three distinct states:

| State | Description | Legacy authentication affected | Browser apps affected | Modern authentication affected |
|:---:| --- |:---:|:--:|:--:|
| Disabled | The default state for a user not enrolled in per-user Azure AD Multi-Factor Authentication. | No | No | No |
| Enabled | The user is enrolled in per-user Azure AD Multi-Factor Authentication, but can still use their password for legacy authentication. If the user hasn't yet registered MFA authentication methods, they receive a prompt to register the next time they sign in using modern authentication (such as via a web browser). | No. Legacy authentication continues to work until the registration process is completed. | Yes. After the session expires, Azure AD Multi-Factor Authentication registration is required.| Yes. After the access token expires, Azure AD Multi-Factor Authentication registration is required. |
| Enforced | The user is enrolled per-user in Azure AD Multi-Factor Authentication. If the user hasn't yet registered authentication methods, they receive a prompt to register the next time they sign in using modern authentication (such as via a web browser). Users who complete registration while in the *Enabled* state are automatically moved to the *Enforced* state. | Yes. Apps require app passwords. | Yes. Azure AD Multi-Factor Authentication is required at sign-in. | Yes. Azure AD Multi-Factor Authentication is required at sign-in. |

All users start out *Disabled*. When you enroll users in per-user Azure AD Multi-Factor Authentication, their state changes to *Enabled*. When enabled users sign in and complete the registration process, their state changes to *Enforced*. Administrators may move users between states, including from *Enforced* to *Enabled* or *Disabled*.

> [!NOTE]
> If per-user MFA is re-enabled on a user and the user doesn't re-register, their MFA state doesn't transition from *Enabled* to *Enforced* in MFA management UI. The administrator must move the user directly to *Enforced*.

## View the status for a user

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

To view and manage user states, complete the following steps to access the Azure portal page:

1. Sign in to the [Azure portal](https://portal.azure.com) as a Global administrator.
1. Search for and select **Azure Active Directory**, then select **Users** > **All users**.
1. Select **Per-user MFA**. 
   :::image type="content" border="true" source="media/howto-mfa-userstates/selectmfa-cropped.png" alt-text="Screenshot of select Multi-Factor Authentication from the Users window in Azure AD.":::
1. A new page opens that displays the user state, as shown in the following example.
   ![Screenshot that shows example user state information for Azure AD Multi-Factor Authentication](./media/howto-mfa-userstates/userstate1.png)

## Change the status for a user

To change the per-user Azure AD Multi-Factor Authentication state for a user, complete the following steps:

1. Use the previous steps to [view the status for a user](#view-the-status-for-a-user) to get to the Azure AD Multi-Factor Authentication **users** page.
1. Find the user you want to enable for per-user Azure AD Multi-Factor Authentication. You might need to change the view at the top to **users**.
   ![Select the user to change status for from the users tab](./media/howto-mfa-userstates/enable1.png)
1. Check the box next to the name(s) of the user(s) to change the state for.
1. On the right-hand side, under **quick steps**, choose **Enable** or **Disable**. In the following example, the user *John Smith* has a check next to their name and is being enabled for use:
   ![Enable selected user by clicking Enable on the quick steps menu](./media/howto-mfa-userstates/user1.png)

   > [!TIP]
   > *Enabled* users are automatically switched to *Enforced* when they register for Azure AD Multi-Factor Authentication. Don't manually change the user state to *Enforced* unless the user is already registered or if it is acceptable for the user to experience interruption in connections to legacy authentication protocols.

1. Confirm your selection in the pop-up window that opens.

After you enable users, notify them via email. Tell the users that a prompt is displayed to ask them to register the next time they sign in. Also, if your organization uses non-browser apps that don't support modern authentication, they need to create app passwords. For more information, see the [Azure AD Multi-Factor Authentication end-user guide](https://support.microsoft.com/account-billing/how-to-use-the-microsoft-authenticator-app-9783c865-0308-42fb-a519-8cf666fe0acc) to help them get started.

### Convert per-user MFA enabled and enforced users to disabled

If your users were enabled using per-user enabled and enforced Azure AD Multi-Factor Authentication the following PowerShell can assist you in making the conversion to Conditional Access based Azure AD Multi-Factor Authentication.

Run this PowerShell in an ISE window or save as a `.PS1` file to run locally. The operation can only be done by using the [MSOnline module](/powershell/module/msonline#msonline). 

```PowerShell
# Connect to tenant
Connect-MsolService

# Sets the MFA requirement state
function Set-MfaState {
    [CmdletBinding()]
    param(
        [Parameter(ValueFromPipelineByPropertyName=$True)]
        $ObjectId,
        [Parameter(ValueFromPipelineByPropertyName=$True)]
        $UserPrincipalName,
        [ValidateSet("Disabled","Enabled","Enforced")]
        $State
    )
    Process {
        Write-Verbose ("Setting MFA state for user '{0}' to '{1}'." -f $ObjectId, $State)
        $Requirements = @()
        if ($State -ne "Disabled") {
            $Requirement =
                [Microsoft.Online.Administration.StrongAuthenticationRequirement]::new()
            $Requirement.RelyingParty = "*"
            $Requirement.State = $State
            $Requirements += $Requirement
        }
        Set-MsolUser -ObjectId $ObjectId -UserPrincipalName $UserPrincipalName `
                     -StrongAuthenticationRequirements $Requirements
    }
}
# Disable MFA for all users
Get-MsolUser -All | Set-MfaState -State Disabled
```

## Next steps

To configure Azure AD Multi-Factor Authentication settings, see  [Configure Azure AD Multi-Factor Authentication settings](howto-mfa-mfasettings.md).

To manage user settings for Azure AD Multi-Factor Authentication, see [Manage user settings with Azure AD Multi-Factor Authentication](howto-mfa-userdevicesettings.md).

To understand why a user was prompted or not prompted to perform MFA, see [Azure AD Multi-Factor Authentication reports](howto-mfa-reporting.md).
