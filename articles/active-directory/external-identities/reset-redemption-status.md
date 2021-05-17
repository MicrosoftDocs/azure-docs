---

title: Reset a guest user's redemption status - Azure AD
description: Learn how to reset the invitation redemption status for an Azure Active Directory B2B guest users in Azure AD External Identities.

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: how-to
ms.date: 04/06/2021

ms.author: mimart
author: msmimart
manager: celestedg

ms.collection: M365-identity-device-management
---

# Reset redemption status for a guest user (Preview)

After a guest user has redeemed your invitation for B2B collaboration, there might be times when you'll need to update their sign-in information, for example when:

- The user wants to sign in using a different email and identity provider
- The account for the user in their home tenant has been deleted and re-created
- The user has moved to a different company, but they still need the same access to your resources
- The user’s responsibilities have been passed along to another user

To manage these scenarios previously, you had to manually delete the guest user’s account from your directory and reinvite the user. Now you can use PowerShell or the Microsoft Graph invitation API to reset the user's redemption status and reinvite the user while retaining the user's object ID, group memberships, and app assignments. When the user redeems the new invitation, the UPN of the user doesn't change, but the user's sign-in name changes to the new email. The user can subsequently sign in using the new email or an email you've added to the `otherMails` property of the user object.

## Reset the email address used for sign-in

If a user wants to sign in using a different email:

1. Make sure the new email address is added to the `mail` or `otherMails` property of the user object. 
2.  Replace the email address in the `InvitedUserEmailAddress` property with the new email address.
3. Use one of the methods below to reset the user's redemption status.

> [!NOTE]
>During public preview, we have two recommendations:
>- When you're resetting the user's email address to a new address, we recommend setting the `mail` property. This way the user can redeem the invitation by signing into your directory in addition to using the redemption link in the invitation.
>- When you're resetting the status for a B2B guest user, be sure to do so under the user context. App-only calls are currently not supported.
>
## Use PowerShell to reset redemption status

Install the latest AzureADPreview PowerShell module and create a new invitation with `InvitedUserEmailAddress` set to the new email address, and `ResetRedemption` set to `true`.

```powershell  
Uninstall-Module AzureADPreview 
Install-Module AzureADPreview 
Connect-AzureAD 
$ADGraphUser = Get-AzureADUser -objectID "UPN of User to Reset"  
$msGraphUser = New-Object Microsoft.Open.MSGraph.Model.User -ArgumentList $ADGraphUser.ObjectId 
New-AzureADMSInvitation -InvitedUserEmailAddress <<external email>> -SendInvitationMessage $True -InviteRedirectUrl "http://myapps.microsoft.com" -InvitedUser $msGraphUser -ResetRedemption $True 
```

## Use Microsoft Graph API to reset redemption status

Using the [Microsoft Graph invitation API](/graph/api/resources/invitation?view=graph-rest-beta&preserve-view=true), set the `resetRedemption` property  to `true` and specify the new email address in the `invitedUserEmailAddress` property.

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
