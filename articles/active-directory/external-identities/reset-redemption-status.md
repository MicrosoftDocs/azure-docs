---

title: Reset a guest user's redemption status - Azure AD
description: Learn how to reset the invitation redemption status for an Azure Active Directory B2B guest users in Azure AD External Identities.

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: how-to
ms.date: 02/01/2021

ms.author: mimart
author: msmimart
manager: celestedg

ms.collection: M365-identity-device-management
---

# Reset redemption status for a guest user

You can now reset the invitation status of an Azure Active Directory B2B guest user. This allows the B2B user to re-redeem their invitation using a different identity provider, a different account, or an account that has been recreated. Before this feature was available it would be common to delete and recreate a B2B user when they had issues logging in, but this would mean that the user would no longer have access to anything shared with their old B2B user object.  

Using this feature can solve a variety of common user issues:

- Account in home tenant was deleted and recreated.
- Change the identity provider used to redeem the account (ex: OTP to MSA, MSA to Google fed, Direct fed to AAD).
- If a user changes companies but needs to maintain the same access.
- If a user’s responsibilities needs to be passed onto another individual.

When you reset the redemption status on a user, you select the user you want to reset and choose the email you want them to re-redeem with. This email needs to be the original one that the user was invited with or needs to be added to the `otherMails` property on the user.

Note that when a reset happens the object Id of the user does not change but the UPN of the user will change to the email you are inviting.  

## Powershell

```
Uninstall-Module AzureADPreview 
Install-Module AzureADPreview 
Connect-AzureAD 
$ADGraphUser = Get-AzureADUser -objectID "UPN of User to Reset"  
$msGraphUser = New-Object Microsoft.Open.MSGraph.Model.User -ArgumentList $ADGraphUser.ObjectId 
New-AzureADMSInvitation -InvitedUserEmailAddress <<external email>> -SendInvitationMessage $True -InviteRedirectUrl "http://myapps.microsoft.com" -InvitedUser $msGraphUser -ResetRedemption $True 
```

## Microsoft Graph API

```
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

## Next steps

- [Add Azure Active Directory B2B collaboration users by using PowerShell](customize-invitation-api.md#powershell)
- [Properties of an Azure AD B2B guest user](user-properties.md)