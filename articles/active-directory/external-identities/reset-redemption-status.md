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

To manage these scenarios previously, you would have had to delete the guest user’s account in your directory and re-create or reinvite them. Now you can reset their redemption status instead. The user object and object ID remains the same. Just the UPN will change to the new email you use to reinvite them.

You can reset a guest user's redemption status by either using PowerShell or the Microsoft Graph API. When you reset a user's redemption status, you select the user you want to reset and choose the email you want them to use when re-redeeming your invitation. This email must be the original email you used to invite them, or it must be added to the `otherMails` property in the the user's object in your directory. After you reset the user's redemption status, the object ID remains the same, but the UPN changes to the email address you use to invite the user.

## Powershell

```powershell  
Uninstall-Module AzureADPreview 
Install-Module AzureADPreview 
Connect-AzureAD 
$ADGraphUser = Get-AzureADUser -objectID "UPN of User to Reset"  
$msGraphUser = New-Object Microsoft.Open.MSGraph.Model.User -ArgumentList $ADGraphUser.ObjectId 
New-AzureADMSInvitation -InvitedUserEmailAddress <<external email>> -SendInvitationMessage $True -InviteRedirectUrl "http://myapps.microsoft.com" -InvitedUser $msGraphUser -ResetRedemption $True 
```

## Microsoft Graph API

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