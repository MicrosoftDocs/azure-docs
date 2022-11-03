---

title: Reset a guest user's redemption status - Azure AD
description: Learn how to reset the invitation redemption status for an Azure Active Directory B2B guest users in Azure AD External Identities.

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: how-to
ms.date: 06/16/2022

ms.author: mimart
author: msmimart
manager: celestedg

ms.collection: engagement-fy23, M365-identity-device-management
# Customer intent: As a tenant administrator, I want to update the sign-in information for a guest user.
---

# Reset redemption status for a guest user (Preview)

In this article, you'll learn how to update the [guest user's](user-properties.md) sign-in information after they have redeemed your invitation for B2B collaboration. There might be times when you'll need to update their sign-in information, for example when:

- The user wants to sign in using a different email and identity provider
- The account for the user in their home tenant has been deleted and re-created
- The user has moved to a different company, but they still need the same access to your resources
- The user’s responsibilities have been passed along to another user

To manage these scenarios previously, you had to manually delete the guest user’s account from your directory and reinvite the user. Now you can use the Azure portal, PowerShell or the Microsoft Graph invitation API to reset the user's redemption status and reinvite the user while keeping the user's object ID, group memberships, and app assignments. When the user redeems the new invitation, the [UPN](../hybrid/plan-connect-userprincipalname.md#what-is-userprincipalname) of the user doesn't change, but the user's sign-in name changes to the new email. Then the user can sign in using the new email or an email you've added to the `otherMails` property of the user object.

## Use the Azure portal to reset redemption status

1. Sign in to the [Azure portal](https://portal.azure.com/) using a Global administrator or User administrator account for the directory.
1. Search for and select **Azure Active Directory**.
1. Select **Users**.
1. In the list, select the user's name to open their user profile.
1. If the user wants to sign in using a different email:
   - Select the **Edit properties** tab.
   - Select the **Contact Information** tab.
   - Next to **Email**, type the new email.
   - Update **Other emails** to also include the new email.
   - Select the **Save** button at the bottom of the page.

1. In the **Overview** tab, under **My Feed** > **B2B collaboration** select **Manage (resend invitation / reset status)**. 
    :::image type="content" source="media/reset-redemption-status/user-profile-b2b-collaboration.png" alt-text="Screenshot of the guest user's profile overview.":::    
1. Under **Manage invitations** > **Redemption status** > **Reset invitation status? (Preview)**, select **Yes**.
1. Select **Yes** to confirm.

## Use PowerShell or Microsoft Graph API to reset redemption status

### Reset the email address used for sign-in

If a user wants to sign in using a different email:

1. Make sure the new email address is added to the `mail` or `otherMails` property of the user object. 
1.  Replace the email address in the `InvitedUserEmailAddress` property with the new email address.
1. Use one of the methods below to reset the user's redemption status.

> [!NOTE]
>During public preview, we have two recommendations:
>- When you're resetting the user's email address to a new address, we recommend setting the `mail` property. This way the user can redeem the invitation by signing into your directory in addition to using the redemption link in the invitation.
>- When you're resetting the status for a B2B guest user, be sure to do so under the user context. App-only calls are currently not supported.
>
### Use PowerShell to reset redemption status

```powershell
Install-Module Microsoft.Graph
Select-MgProfile -Name beta
Connect-MgGraph

$user = Get-MgUser -Filter "startsWith(mail, 'john.doe@fabrikam.net')"
New-MgInvitation `
    -InvitedUserEmailAddress $user.Mail `
    -InviteRedirectUrl "http://myapps.microsoft.com" `
    -ResetRedemption `
    -SendInvitationMessage `
    -InvitedUser $user
```

### Use Microsoft Graph API to reset redemption status

Using the [Microsoft Graph invitation API](/graph/api/resources/invitation), set the `resetRedemption` property  to `true` and specify the new email address in the `invitedUserEmailAddress` property.

```json
POST https://graph.microsoft.com/beta/invitations  
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
   "id": "<<ID for the user you want to reset>>"  
}, 
"resetRedemption": true 
}
```

## Next steps

- [Add Azure Active Directory B2B collaboration users by using PowerShell](customize-invitation-api.md#powershell)
- [Properties of an Azure AD B2B guest user](user-properties.md)
- [B2B for Azure AD integrated apps](configure-saas-apps.md)
