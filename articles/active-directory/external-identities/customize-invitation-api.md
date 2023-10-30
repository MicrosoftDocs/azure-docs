---
title: B2B collaboration API and customization
description: Microsoft Entra B2B collaboration supports your cross-company relationships by enabling business partners to selectively access your corporate applications.

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.custom: has-azure-ad-ps-ref
ms.topic: how-to
ms.date: 12/02/2022

ms.author: cmulligan
author: csmulligan
manager: celestedg

ms.collection: engagement-fy23, M365-identity-device-management
# Customer intent: As a tenant administrator, I want to customize the invitation process with the API.
---
# Microsoft Entra B2B collaboration API and customization

[With the Microsoft Graph REST API](/graph/api/resources/invitation), you can customize the invitation process in a way that works best for your organization.

## Capabilities of the invitation API

The API offers the following capabilities:

1. Invite an external user with *any* email address.

    ```
    "invitedUserDisplayName": "Taylor"
    "invitedUserEmailAddress": "taylor@fabrikam.com"
    ```

2. Customize where you want your users to land after they accept their invitation.

    ```
    "inviteRedirectUrl": "https://myapps.microsoft.com/"
    ```

3. Choose to send the standard invitation mail through us.

    ```
    "sendInvitationMessage": true
    ```

   with a message to the recipient that you can customize.

    ```
    "customizedMessageBody": "Hello Sam, let's collaborate!"
    ```

4. And choose to cc: people you want to keep in the loop about your inviting this collaborator.

5. Or completely customize your invitation and onboarding workflow by choosing not to send notifications through Microsoft Entra ID.

    ```
    "sendInvitationMessage": false
    ```

   In this case, you get back a redemption URL from the API that you can embed in an email template, IM, or other distribution method of your choice.

6. Finally, if you're an admin, you can choose to invite the user as member.

    ```
    "invitedUserType": "Member"
    ```

## Determine if a user was already invited to your directory

You can use the invitation API to determine if a user already exists in your resource tenant. This can be useful when you're developing an app that uses the invitation API to invite a user. If the user already exists in your resource directory, they won't receive an invitation, so you can run a query first to determine whether the email already exists as a UPN or other sign-in property.

1. Make sure the user's email domain isn't part of your resource tenant's verified domain.
2. In the resource tenant, use the following get user query where {0} is the email address you're inviting:

   ```
   “userPrincipalName eq '{0}' or mail eq '{0}' or proxyAddresses/any(x:x eq 'SMTP:{0}') or signInNames/any(x:x eq '{0}') or otherMails/any(x:x eq '{0}')"
   ```

## Authorization model

The API can be run in the following authorization modes:

### App + User mode

In this mode, whoever is using the API needs to have the permissions to be create B2B invitations.

### App only mode

In app only context, the app needs the User.Invite.All scope for the invitation to succeed.

For more information, see: https://developer.microsoft.com/graph/docs/authorization/permission_scopes

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
> Make sure you have the latest version of the Azure AD PowerShell module or AzureADPreview PowerShell module. 

## See also

Check out the invitation API reference in [https://developer.microsoft.com/graph/docs/api-reference/v1.0/resources/invitation](/graph/api/resources/invitation).

## Next steps

- [What is Microsoft Entra B2B collaboration?](what-is-b2b.md)
- [Add and invite guest users](add-users-administrator.md)
- [The elements of the B2B collaboration invitation email](invitation-email-elements.md)
