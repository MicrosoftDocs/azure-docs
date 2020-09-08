---
title: B2B collaboration API and customization - Azure Active Directory
description: Azure Active Directory B2B collaboration supports your cross-company relationships by enabling business partners to selectively access your corporate applications

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: how-to
ms.date: 04/11/2017

ms.author: mimart
author: msmimart
manager: celestedg
ms.reviewer: elisolMS

ms.collection: M365-identity-device-management
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

In app only context, the app needs the User.Invite.All scope for the invitation to succeed.

For more information, refer to: https://developer.microsoft.com/graph/docs/authorization/permission_scopes


## PowerShell

You can use PowerShell to add and invite external users to an organization easily. Create an invitation using the cmdlet:

```powershell
New-AzureADMSInvitation
```

You can use the following options:

* -InvitedUserDisplayName
* -InvitedUserEmailAddress
* -SendInvitationMessage
* -InvitedUserMessageInfo

### Invitation status

After you send an external user an invitation, you can use the **Get-AzureADUser** cmdlet to see if they've accepted it. The following properties of Get-AzureADUser are populated when an external user is sent an invitation:

* **UserState** indicates whether the invitation is **PendingAcceptance** or **Accepted**.
* **UserStateChangedOn** shows the timestamp for the latest change to the **UserState** property.

You can use the **Filter** option to filter the results by **UserState**. The example below shows how to filter results to show only users who have a pending invitation. The example also shows the **Format-List** option, which lets you specify the properties to display. 
 

```powershell
Get-AzureADUser -Filter "UserState eq 'PendingAcceptance'" | Format-List -Property DisplayName,UserPrincipalName,UserState,UserStateChangedOn
```

> [!NOTE]
> Make sure you have the latest version of the AzureAD PowerShell module or AzureADPreview PowerShell module. 

## See also

Check out the invitation API reference in [https://developer.microsoft.com/graph/docs/api-reference/v1.0/resources/invitation](https://developer.microsoft.com/graph/docs/api-reference/v1.0/resources/invitation).

## Next steps

- [What is Azure AD B2B collaboration?](what-is-b2b.md)
- [The elements of the B2B collaboration invitation email](invitation-email-elements.md)
- [B2B collaboration invitation redemption](redemption-experience.md)
- [Add B2B collaboration users without an invitation](add-user-without-invite.md)