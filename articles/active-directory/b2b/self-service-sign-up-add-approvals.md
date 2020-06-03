---
title: Use API connectors for approvals in self-service sign-up - Azure AD
description: Federate with Facebook to enable external users (guests) to sign in to your Azure AD apps with their own Facebook accounts.

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: conceptual
ms.date: 05/19/2020

ms.author: mimart
author: msmimart
manager: celestedg
ms.reviewer: mal
ms.custom: "it-pro, seo-update-azuread-jan"
ms.collection: M365-identity-device-management
---
 
# Add a custom approvals system to self-service sign-up user flow

[API connectors](api-connectors-overview.md) enable you to implement your own approvals logic to your self-service sign-up user flow. This lets you manage which users are successfully created in your tenant.

In this example, the self-service sign-up user flow collects user data during the sign-up process and passes it to an approval system. The approval system can then:
1. Automatically approve them.
2. Trigger a manual review. If the request is approved, the approval system can use Microsoft Graph to provision the user. The approval system can also notify the user that their account has been created.

## Register an application for your approval system

Your approval system will need to be registered as an App in your Azure AD tenant so that it can authenticate with Azure AD and have the permission to create a user. Learn more about [authenticating and authorization basics for Microsoft Graph](https://docs.microsoft.com/graph/auth/auth-concepts).

1. Sign in to the [Azure portal](https://portal.azure.com) as an Azure AD administrator.
2. Under **Azure services**, select **Azure Active Directory**.
3. In the left menu, select **App registrations**.
4. Select **New registration**.
5. Enter a **Name**.

   <!-- ![Register an application for the approvals system](./self-service-sign-up-add-approvals/approvals/register-an-approvals-application.png) -->

6. Select **Register**.
7. Select **API permissions**.
8. Select **Add a permission**.
9. Select **Microsoft Graph** > **Application permissions**.
10. Under *Select permissions*, expand **User**, and then select the **User.ReadWrite.All** check box.
    > [!NOTE]
    > This permission is needed so your approval system can create the user upon approval.
11. Select **Add permissions**.
12. On the **API permissions** page, select **Grant admin consent for <tenant-name>**, and then select **Yes**.
13. In the left menu, select **Certificates & Secrets**.
14. Select **New client secret**.
15. Enter a **Description**, and then select the duration for when the client secret **Expires**.
16. Configure your approval system to use the **Application ID** as the client ID and the **client secret** you generated to authenticate with Azure AD.
<!--TODO: what other screenshots are appropriate here?-->

## Create the API connectors

To create the API connectors for your user flow, see [create an API connector](self-service-sign-up-add-api-connector.md#create-an-api-connector). Your approval system API needs two API connectors and corresponding endpoints to:

- **Check approval status** - Send a call to the approval system immediately after a user signs in with an identity provider to check if the user has an existing approval request or has already been denied. If you approval system only does automatic approval decisions, this API connector not be needed.

   ![Check approval status  API connector configuration](./media/self-service-sign-up-add-approvals/check-approval-status-api-connector-config-alt.png)

- **Request approval** - Send a call to the approval system after a user completes the attribute collection page, before the user is created, to request approval. The approval request can be automatically granted or manually reviewed.

   ![Create approval request API connector configuration](./media/self-service-sign-up-add-approvals/create-approval-request-api-connector-config-alt.png)


## Enable the API connectors in a user flow

Follow these steps to add the API connectors to a self-service sign-up user flow:

1. Sign in to the [Azure portal](https://portal.azure.com/) as an Azure AD administrator.
2. Under **Azure services**, select **Azure Active Directory**.
3. In the left menu, select **External Identities**.
4. Select **User flows (Preview)**, and then select the user flow you want to add the API connector to.
5. Select **API connectors**, and then select the API endpoints you want to invoke at the following steps in the user flow:
   - **After signing in with an identity provider**: 'Check approval status'
   - **Before creating the user**: 'Request approval'



6. Select **Save**.

![Add APIs to the user flow](./media/self-service-sign-up-add-approvals/api-connectors-user-flow-api.png)

## Control the sign up flow with API responses

Your approval system can leverage the [ API response types](api-connectors-overview.md) from the two API endpoints to control the sign up flow.

### Check approval status - responses

#### Continuation response
The **Check approval status** API endpoint should return a **continuation response** if:
- User has not previously requested an approval.

*Example response*
```http
HTTP/1.1 200 OK
Content-type: application/json

{ 
    "version": "1.0.0", 
    "action": "Continue"
}
```

#### Blocking response
The **Request approval** API endpoint should return an **Blocking Response** if:
- User approval is pending
- User was denied and shouldn't be allowed to request approval again

*Example responses*
```http
HTTP/1.1 200 OK
Content-type: application/json

{ 
    "version": "1.0.0", 
    "action": "ShowBlockPage", 
    "userMessage": "Your access request is already processing. You'll be notified when your request has been approved."

} 
```

```http
HTTP/1.1 200 OK
Content-type: application/json

{ 
    "version": "1.0.0", 
    "action": "ShowBlockPage", 
    "userMessage": "Your sign up request has been denied. Please contact an administrator if you believe this is an error."
} 
```

### Request approval - responses
#### Continuation response
The create approval request should return a **continuation response** if:
- the user can automatically be approved. 


**Example response**
```http
HTTP/1.1 200 OK
Content-type: application/json

{ 
    "version": "1.0.0", 
    "action": "Continue"
}
```

> [!IMPORTANT]
> Azure AD will create the user an account and take the redirect the user to the application that invoked the sign up flow.

#### Blocking Response
The create approval request should return an **blocking response** if:
- User approval request was created and is now pending.
- User approval request was automatically denied.

**Example responses**
```http
HTTP/1.1 200 OK
Content-type: application/json

{ 
    "version": "1.0.0", 
    "action": "ShowBlockPage", 
    "userMessage": "Your account is now waiting for approval. You'll be notified when your request has been approved." 
} 
```

```http
HTTP/1.1 200 OK
Content-type: application/json

{ 
    "version": "1.0.0", 
    "action": "ShowBlockPage", 
    "userMessage": "Your sign up request has been denied. Please contact an administrator if you believe this is an error."
} 
```

**Example user experience for waiting for approval**
![Example pending approval page](./media/self-service-sign-up-add-approvals/approval-pending.png)

## Create a user account
After obtaining the approval, a [user](https://docs.microsoft.com/graph/azuread-users-concept-overview) account can be created using  [Microsoft Graph](https://docs.microsoft.com/graph/use-the-api).

The way in which your approval systems provisions the user account depends on the identity provider that the user used. 

### For a federated Google or Facebook user

If your user signed in with a Google or Facebook account, you can use the [User creation API](https://docs.microsoft.com/graph/api/user-post-users?view=graph-rest-1.0&tabs=http).

Example HTTP request that the API receives
```http
POST <API-endpoint>
Content-type: application/json

{
 "email_address": "johnsmith@outlook.com",
 "identities": [
     {
     "signInType":"federated",
     "issuer":"facebook.com",
     "issuerAssignedId":"0123456789"
     }
 ],
 "displayName": "John Smith",
 "givenName": "John",
 "surname": "Smith",
 "city": "Redmond",
 "country": "United States",
 "extension_<app-id>_CustomAttribute": "custom attribute value",
 "ui_locales":"en-US"
}
```

The following HTTP POST request can be used to create a user account:

```http
POST https://graph.microsoft.com/v1.0/users
Content-type: application/json

{
 "userPrincipalName": "johnsmith_outlook.com#EXT@contoso.onmicrosoft.com",
 "accountEnabled": true,
 "mail": "johnsmith@outlook.com",
 "userType": "Guest",
 "identities": [
     {
     "signInType":"federated",
     "issuer":"facebook.com",
     "issuerAssignedId":"0123456789"
     }
 ],
 "displayName": "John Smith",
 "givenName": "John",
 "surname": "Smith",
 "city": "Redmond",
 "country": "United States",
 "extension_<app-id>_CustomAttribute": "custom attribute value"
}
```

> [!IMPORTANT]
> The approval system should explicitly check that `identities`, `identities[0]` and `identities[0].issuer` are present and that `identities[0].issuer` equals to 'facebook' or 'google' to use this method. 

> [!NOTE]
> The `userPrincipalName` parameter can be generated by taking the `email_address` claim sent from a user flow, replacing the `@`character with `_`, and pre-pending it to `#EXT@<tenant-name>.onmicrosoft.com`.
>
> The `mail` parameter should be equivalent to `email_address` claim sent from a user flow. 

> [!NOTE]
> Aside from `userPrincipalName`, `accountEnabled`, and `mail`, the rest of the user attributes, including custom attributes, are in the same serialized format as that of the claims sent by the API connector.  

### For a federated Azure Active Directory user
If a user signs in with a federated Azure Active Directory account,  you must use the [invitation API](https://docs.microsoft.com/graph/api/invitation-post?view=graph-rest-1.0) to create the user and then optionally the [user update API](https://docs.microsoft.com/graph/api/user-update?view=graph-rest-1.0) to assign more attributes to the user.

1. Create the invitation using the **email_address** provided by the API connector.

**Request**
```http
POST https://graph.microsoft.com/v1.0/invitations 
Content-type: application/json

{ 
    "invitedUserEmailAddress":"johnsmith@fabrikam.onmicrosoft.com", 
    "inviteRedirectUrl" : "https://myapp.com"
} 
```

**Response**
```http
HTTP/1.1 201 OK
Content-type: application/json

{ 
    ...
    "invitedUser": { 
        "id": "<generated-user-guid>" 
    }
} 
```

2. Use the invited user's ID to update the user's account with collected user attributes.

```http
PATCH https://graph.microsoft.com/v1.0/users/<generated-user-guid>
Content-type: application/json

{ 
    "displayName": "John Smith",
    "givenName": "John",
    "surname": "Smith",
    "city": "Redmond",
    "country": "United States",
    "extension_<app-id>_CamelCaseAttributeName": "custom attribute value"
} 
```

#### Custom Attributes
Custom attributes can be created for the user using the **extension_\<app-id>_\<CamelCaseAttributeName>** format. More information regarding custom & extension attributes, see [Define custom attributes for self-service sign-up flows](user-flow-add-custom-attributes.md).

## Further reference
- See an example approval system with the [Woodgrove self-service sign-up for guest users sample](<enter-sample-link>). <!--TODO: link to sample-->