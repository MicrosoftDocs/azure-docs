---
title: Invite internal users to B2B collaboration - Azure AD
description: If you have internal user accounts for partners, distributors, suppliers, vendors, and other guests, you can change to Azure AD B2B collaboration by inviting them to sign in with their own external credentials or login. Use either PowerShell or the Microsoft Graph invitation API.

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: conceptual
ms.date: 04/12/2020

ms.author: mimart
author: msmimart
manager: celestedg
ms.reviewer: mal

ms.collection: M365-identity-device-management
---

# Invite internal users to B2B collaboration

|     |
| --- |
| Inviting internal users to use B2B collaboration is a public preview feature of Azure Active Directory. For more information about previews, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). |
|     |

Before the availability of Azure AD B2B collaboration, organizations could collaborate with distributors, suppliers, vendors, and other guest users by setting up internal credentials for them. If you have internal guest users like this, you can invite them to use B2B collaboration so you can take advantage of Azure AD B2B benefits. Your B2B guest users will be able to use their own identities and credentials to sign in, and you won’t need to maintain passwords or manage account lifecycles.

Sending an invitation to an existing internal account lets you retain that user’s object ID, UPN, group memberships, and app assignments. You don’t need to manually delete and re-invite the user or reassign resources. To invite the user, you’ll use the invitation API to pass both the internal user object and the guest user’s email address along with the invitation. When the user accepts the invitation, the B2B service changes the existing internal user object to a B2B user. Going forward, the user must sign in to cloud resources services using their B2B credentials. They can still use their internal credentials to access on premises resources, but you can prevent this by resetting or changing the password on the internal account.

> [!NOTE]
> Invitation is one-way. You can invite internal users to use B2B collaboration, but you can’t remove the B2B credentials once they’re added. To change the user back to an internal-only user, you’ll need to delete the user object and create a new one.

While in public preview, the method described in this article for inviting internal users to B2B collaboration can’t be used in these instances:

- The internal user has already been assigned an Exchange license.
- The user is from a domain that is set up for direct federation in your directory.
- The internal user is a cloud-only account, and their main account isn't in Azure AD.

In these instances, if the internal user must be changed to a B2B user, you should delete the internal account and send the user an invitation for B2B collaboration.

**On-premises synced users**: For user accounts that are synced between on-premises and the cloud, the on-premises directory remains the source of authority after they’re invited to use B2B collaboration. Any changes you make to the on-premises account will sync to the cloud account, including disabling or deleting the account. Therefore, you can’t prevent the user from signing into their on-premises account while retaining their cloud account by simply deleting the on-premises account. Instead, you can set the on-premises account password to a random GUID or other unknown value.

## How to invite internal users to B2B collaboration

You can use PowerShell or the invitation API to send a B2B invitation to the internal user. Make sure the email address you want to use for the invitation is set as the external email address on the internal user object.

- For a cloud-only user, use the email address in the User.OtherMails property for the invitation.
- For an on-premises synced user, you must use the value in the User.Mail property for the invitation.
- The domain in the user’s Mail property must match the account they’re using to sign in. Otherwise, some services such as Teams won't be able to authenticate the user.

By default, the invitation will send the user an email letting them know they’ve been invited, but you can suppress this email and send your own instead.

> [!NOTE]
> To send your own email or other communication, you can use New-AzureADMSInvitation with -SendInvitationMessage:$false to invite users silently, and then send your own email message to the converted user. See [Azure AD B2B collaboration API and customization](customize-invitation-api.md).

## Use PowerShell to send a B2B invitation

Use the following command to invite the user to B2B collaboration:

```powershell
Uninstall-Module AzureADPreview
Install-Module AzureADPreview
$ADGraphUser = Get-AzureADUser -searchstring "<<external email>>"
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

- [B2B collaboration invitation redemption](redemption-experience.md)
