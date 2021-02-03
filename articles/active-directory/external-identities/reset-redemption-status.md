---

title: Reset a guest user's redemption status - Azure AD
description: Learn how to reset the invitation redemption status for an Azure Active Directory B2B guest users in Azure AD External Identities.

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: how-to
ms.date: 02/03/2021

ms.author: mimart
author: msmimart
manager: celestedg

ms.collection: M365-identity-device-management
---

# Reset redemption status for a guest user

After a guest user has redeemed your invitation for B2B collaboration, there might be instances where you'll need to update their user object or sign-in information, for example when:

- The user has changed the identity provider they want to use to sign in.
- The account for the user in their home tenant was deleted and re-created
- The user has moved to a different company, but they still need the same access to your resources.
- The user’s responsibilities are being passed along to another user.

To manage these scenarios previously, you had to manually delete the guest user’s account from your directory and reinvite the user. Now you can use PowerShell or the Microsoft Graph invitations API to reset the user's redemption status and reinvite the user with their new email address in one step. By resetting the redemption status, you can retain the user's object ID, group memberships, and app assignments. When the user redeems the new invitation, the new email address becomes the user's UPN. The user can subsequently sign in using the new email or an email you've added to the `otherMails` property of the user object.

When you reset the user's redemption status, the object ID remains the same, but the UPN changes to the email address you use when creating the new invitation.

## Powershell

Install the latest AzureADPreview PowerShell module and create a new invitation with `InvitedUserEMailAddress` set to the new email address, and `ResetRedemption` set to `true`.

```powershell  
Uninstall-Module AzureADPreview 
Install-Module AzureADPreview 
Connect-AzureAD 
$ADGraphUser = Get-AzureADUser -objectID "UPN of User to Reset"  
$msGraphUser = New-Object Microsoft.Open.MSGraph.Model.User -ArgumentList $ADGraphUser.ObjectId 
New-AzureADMSInvitation -InvitedUserEmailAddress <<external email>> -SendInvitationMessage $True -InviteRedirectUrl "http://myapps.microsoft.com" -InvitedUser $msGraphUser -ResetRedemption $True 
```

## Microsoft Graph API

In the Microsoft Graph API, set the `resetRedemption` property  to `true` and specify the new email address in the `invitedUserEmailAddress` property. The user's object ID remains the same, but the UPN will change to the new email you use to reinvite them.

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