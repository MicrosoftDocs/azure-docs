---
title: Azure Active Directory B2B collaboration API and customization | Microsoft Docs
description: Azure Active Directory B2B collaboration supports your cross-company relationships by enabling business partners to selectively access your corporate applications
services: active-directory
documentationcenter: ''
author: sasubram
manager: femila
editor: ''
tags: ''

ms.assetid:
ms.service: active-directory
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: identity
ms.date: 04/11/2017
ms.author: sasubram

---

# Azure Active Directory B2B collaboration API and customization

We've had many customers tell us that they want to customize the invitation process in a way that works best for their organizations. With our API, you can do just that. [https://developer.microsoft.com/graph/docs/api-reference/v1.0/resources/invitation](https://developer.microsoft.com/graph/docs/api-reference/v1.0/resources/invitation)

## Capabilities of the invitation API
The API offers the following capabilities:

1. Invite an external user with *any* email address.

    ```
    "invitedUserDisplayName": "Sam"
    "invitedUserEmailAddress": "gsamoogle@gmail.com"
    ```

2. Customize where you want your users to land after they accept their invitation.

    ```
    "inviteRedirectUrl": "https://myapps.microsoft.com/"
    ```

3. Choose to send the standard invitation mail through us

    ```
    "sendInvitationMessage": true
    ```

  with a message to the recipient that you can customize

    ```
    "customizedMessageBody": "Hello Sam, let's collaborate!"
    ```

4. And choose to cc: people you want to keep in the loop about your inviting this collaborator.

5. Or completely customize your invitation and onboarding workflow by choosing not to send notifications through Azure AD.

    ```
    "sendInvitationMessage": false
    ```

  In this case, you get back a redemption URL from the API that you can embed in an email template, IM, or other distribution method of your choice.

6. Finally, if you are an admin, you can choose to invite the user as member.

    ```
    "invitedUserType": "Member"
    ```


## Authorization model
The API can be run in the following authorization modes:

### App + User mode
In this mode, whoever is using the API needs to have the permissions to be create B2B invitations.

### App only mode
In app only context, the app needs the User.ReadWrite.All or Directory.ReadWrite.All scopes for the invitation to succeed.

For more information, refer to: https://graph.microsoft.io/docs/authorization/permission_scopes


## PowerShell
It is now possible to use PowerShell to add and invite external users to an organization easily. Create an invitation using the cmdlet:

```
New-AzureADMSInvitation
```

You can use the following options:

* -InvitedUserDisplayName
* -InvitedUserEmailAddress
* -SendInvitationMessage
* -InvitedUserMessageInfo

You can also check out the invitation API reference in [https://developer.microsoft.com/graph/docs/api-reference/v1.0/resources/invitation](https://developer.microsoft.com/graph/docs/api-reference/v1.0/resources/invitation)

## Next steps

Browse our other articles on Azure AD B2B collaboration:

* [What is Azure AD B2B collaboration?](active-directory-b2b-what-is-azure-ad-b2b.md)
* [How do Azure Active Directory admins add B2B collaboration users?](active-directory-b2b-admin-add-users.md)
* [How do information workers add B2B collaboration users?](active-directory-b2b-iw-add-users.md)
* [The elements of the B2B collaboration invitation email](active-directory-b2b-invitation-email.md)
* [B2B collaboration invitation redemption](active-directory-b2b-redemption-experience.md)
* [Azure AD B2B collaboration licensing](active-directory-b2b-licensing.md)
* [Troubleshooting Azure Active Directory B2B collaboration](active-directory-b2b-troubleshooting.md)
* [Azure Active Directory B2B collaboration frequently asked questions (FAQ)](active-directory-b2b-faq.md)
* [Multi-factor authentication for B2B collaboration users](active-directory-b2b-mfa-instructions.md)
* [Add B2B collaboration users without an invitation](active-directory-b2b-add-user-without-invite.md)
* [Article Index for Application Management in Azure Active Directory](active-directory-apps-index.md)
