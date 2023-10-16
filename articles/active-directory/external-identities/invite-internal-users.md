---
title: Invite internal users to B2B collaboration
description: If you have internal user accounts for partners, distributors, suppliers, vendors, and other guests, you can change to Microsoft Entra B2B collaboration by inviting them to sign in with their own external credentials or sign-in. Use either PowerShell or the Microsoft Graph invitation API.

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.custom: has-azure-ad-ps-ref
ms.topic: how-to
ms.date: 07/27/2023

ms.author: cmulligan
author: csmulligan
manager: CelesteDG

ms.collection: engagement-fy23, M365-identity-device-management
# Customer intent: As a tenant administrator, I want to know how to invite internal users to B2B collaboration.
---

# Invite internal users to B2B collaboration

Before the availability of Microsoft Entra B2B collaboration, organizations could collaborate with distributors, suppliers, vendors, and other guest users by setting up internal credentials for them. If you have internal guest users like these, you can invite them to use B2B collaboration instead. These B2B guest users will be able to sign in using their own identities and credentials, eliminating the need for password maintenance or account lifecycle management.


Sending an invitation to an existing internal account lets you retain that user’s object ID, UPN, group memberships, and app assignments. You don’t need to manually delete and re-invite the user or reassign resources. To invite the user, you use the invitation API to pass both the internal user object and the guest user’s email address along with the invitation. When the user accepts the invitation, the B2B service changes the existing internal user object to a B2B user. Going forward, the user must sign in to cloud resources services using their B2B credentials.

## Things to consider

- **Access to on-premises resources**: After the user is invited to B2B collaboration, they can still use their internal credentials to access on-premises resources. You can prevent this by resetting or changing the password on the internal account. The exception is email one-time passcode authentication; if the user's authentication method is changed to one-time passcode, they won't be able to use their internal credentials anymore.

- **Billing**: This feature doesn't change the UserType for the user, so it doesn't automatically switch the user's billing model to [External Identities monthly active user (MAU) pricing](external-identities-pricing.md). To activate MAU pricing for the user, change the UserType for the user to `guest`. Also note that your Microsoft Entra tenant must be linked to an Azure subscription to activate MAU billing.

- **Invitation is one-way**: You can invite internal users to use B2B collaboration, but you can’t remove the B2B credentials once they’re added. To change the user back to an internal-only user, you’ll need to delete the user object and create a new one.

- **Teams**: When the user accesses Teams using their external credentials, their tenant won't be available initially in the Teams tenant picker. The user can access Teams using a URL that contains the tenant context, for example: `https://teams.microsoft.com/?tenantId=<TenantId>`. After that, the tenant will become available in the Teams tenant picker.

- **On-premises synced users**: For user accounts that are synced between on-premises and the cloud, the on-premises directory remains the source of authority after they’re invited to use B2B collaboration. Any changes you make to the on-premises account will sync to the cloud account, including disabling or deleting the account. Therefore, you can’t prevent the user from signing into their on-premises account while retaining their cloud account by simply deleting the on-premises account. Instead, you can set the on-premises account password to a random GUID or other unknown value.

> [!NOTE]
> In Microsoft Entra Connect Sync, there’s a default rule that writes the onPremisesUserPrincipalName attribute to the user object. Because the presence of this attribute can prevent a user from signing in using external credentials, we block internal-to-external conversions for user objects with this attribute. If you’re using Microsoft Entra Connect and you want to be able to invite internal users to B2B collaboration, you'll need to [modify the default rule](../hybrid/connect/how-to-connect-sync-change-the-configuration.md) so the onPremisesUserPrincipalName attribute isn’t written to the user object.
## How to invite internal users to B2B collaboration

You can use the Microsoft Entra admin center, PowerShell, or the invitation API to send a B2B invitation to the internal user. Some things to note:

- Before you invite the user, make sure the `User.Mail` property of the internal user object (the user's **Email** property in the Microsoft Entra admin center) is set to the external email address they'll use for B2B collaboration. If the internal user has an existing mailbox, you can't change this property to an external email address. You must update their attributes in the [Exchange admin center](/exchange/exchange-admin-center).

- When you invite the user, an invitation is sent to the user via email. If you're using PowerShell or the invitation API, you can suppress this email by setting `SendInvitationMessage` to `False`. Then you can notify the user in another way. [Learn more about the invitation API](customize-invitation-api.md).

- When the user redeems the invitation, the account they're using must match the domain in the `User.Mail` property. Otherwise, some services, such as Teams, won't be able to authenticate the user.

## Use the Microsoft Entra admin center to send a B2B invitation

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [External Identity Provider administrator](../roles/permissions-reference.md#external-identity-provider-administrator).
1. Browse to **Identity** > **Users** > **All users**.
1. Find the user in the list or use the search box. Then select the user.
1. In the **Overview** tab, under **My Feed**, select **Convert to external user**. 

    :::image type="content" source="media/invite-internal-users/manage-b2b-collaboration-link.png" alt-text="Screenshot of user profile Overview tab with B2B collaboration card.":::

   > [!NOTE] 
   > If the card says “Resend this B2B user's invitation or reset their redemption status.” the user has already been invited to use external credentials for B2B collaboration.

1. Add an external email address and select **Send**. 

    :::image type="content" source="media/invite-internal-users/invite-internal-user-selector.png" alt-text="Screenshot showing the convert to external user page.":::

   > [!NOTE]
   > If the option is unavailable, make sure the user's **Email** property is set to the external email address they should use for B2B collaboration.

1. A confirmation message appears and an invitation is sent to the user via email. The user is then able to redeem the invitation using their external credentials.

## Use PowerShell to send a B2B invitation

You'll need Azure AD PowerShell module version 2.0.2.130 or later. Use the following command to update to the latest module and invite the internal user to B2B collaboration:

```powershell
Uninstall-Module AzureAD
Install-Module AzureAD
$ADGraphUser = Get-AzureADUser -objectID "UPN of Internal User"
$msGraphUser = New-Object Microsoft.Open.MSGraph.Model.User -ArgumentList $ADGraphUser.ObjectId
New-AzureADMSInvitation -InvitedUserEmailAddress <<external email>> -SendInvitationMessage $True -InviteRedirectUrl "http://myapps.microsoft.com" -InvitedUser $msGraphUser
```

## Use the invitation API to send a B2B invitation

The sample below illustrates how to call the invitation API to invite an internal user as a B2B user.

```json
POST https://graph.microsoft.com/v1.0/invitations
Authorization: Bearer eyJ0eX...
ContentType: application/json
{
    "invitedUserEmailAddress": "<<external email>>",
    "sendInvitationMessage": true,
    "invitedUserMessageInfo": {
        "messageLanguage": "en-US",
        "ccRecipients": [
            {
                "emailAddress": {
                    "name": null,
                    "address": "<<optional additional notification email>>"
                }
            }
        ],
        "customizedMessageBody": "<<custom message>>"
    },
    "inviteRedirectUrl": "https://myapps.microsoft.com?tenantId=",
    "invitedUser": {
        "id": "<<ID for the user you want to convert>>"
    }
}
```

The response to the API is the same response you get when you invite a new guest user to the directory.
## Next steps

- [Add and invite guest users](add-users-administrator.md)
- [Customize invitations using API](customize-invitation-api.md)
- [B2B collaboration invitation redemption](redemption-experience.md)
