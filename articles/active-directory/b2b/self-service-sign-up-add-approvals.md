---
title: Use API connectors for approvals in self-service sign-up - Azure AD
description: Federate with Facebook to enable external users (guests) to sign in to your Azure AD apps with their own Facebook accounts.

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: conceptual
ms.date: 05/19/2020

ms.author: edgomezc
author: edgomezc
manager: kexia
ms.reviewer: mal
ms.custom: "it-pro, seo-update-azuread-jan"
ms.collection: M365-identity-device-management
---
 
# Add approvals to the self-service sign-up user flow

API connectors enable you to implement your own approvals logic to your self-service sign-up user flow. This lets you manage which users are successfully created in your tenant.


In this example, we connect to the external approval system so we can collect user data during the sign-up process, pass it to the approval system, and allow someone to review and approve the request.

Once an approval request has been created, someone in your organization approves, denies, or deletes the request. If a request is approved, the approval system uses Microsoft Graph to provision the user and notify the user that the user that their account has been approved.

## Register an application for your approval system
Your approval system will need to be registered as an App in your Azure AD tenant so that it can create a user if the approval request is granted.

1. Sign in to the [Azure portal](https://portal.azure.com) as an Azure AD administrator.
2. Under **Azure services**, select **Azure Active Directory**.
3. In the left menu, select **App registrations**.
4. Select **New registration**.
5. Enter a **Name**.

   ![Register an application for the approvals system](./media/self-service-sign-up-approvals/register-an-approvals-application.png)

6. Select **Register**.
7. Select **API permissions**.
8. Select **Add a permission**.
9. Select **Microsoft Graph** > **Application permissions**.
10. Under *Select permissions*, expand **User**, and then select the **User.ReadWrite.All** check box.
    - This permission is needed so that your approval system can create the user on approval. 
11. Select **Add permissions**.
12. On the **API permissions** page, select **Grant admin consent for <tenant-name>**, and then select **Yes**.
13. In the left menu, select **Certificates & Secrets**.
14. Select **New client secret**.
15. Enter a **Description**, and then select the duration for when the client secret **Expires**.
16. Configure your approval system to use the **client ID** and the **client secret**.

## Create the API connectors

Your approval system needs two endpoints to:

- **Check approval status** - Send a call to the approval system immediately after a user signs in with an identity provider to check if the user has an existing approval request.

![Check approval status  API connector configuration](./media/self-service-sign-up-approvals/check-approval-status-api-connector-config.png)



- **Create approval request** - Send a call to the approval system after a user completes the attribute collection page, before the user is created, to create a new approval request.

![Create approval request API connector configuration](./media/self-service-sign-up-approvals/create-approval-request-api-connector-config.png)

Learn to [create an API connector](api-connectors-set-up-api.md#create-an-api-connector).

## Enable the API connectors in a user flow

These steps show how to add the API connectors to a self-service sign-up user flow:

1. Sign in to the [Azure portal](https://portal.azure.com/) as an Azure AD administrator.
2. Under **Azure services**, select **Azure Active Directory**.
3. In the left menu, select **External Identities**.
4. Select **User flows (Preview)**, and then select the user flow you want to add the API connector to.
5. Select **API connectors**, and then select the API endpoints you want to invoke at the following steps in the user flow:
   - **After signing in with an identity provider**: 'Check approval status'
   - **Before creating the user**: 'Create approval request'

   ![Add APIs to the user flow](./media/api-connectors-user-flow/api-connectors-user-flow-api.png)

6. Select **Save**.

## Control the sign up flow with endpoint responses

Your approval system can leverage the [valid API responses](api-connectors-overview.md) from the two API endpoints to control the sign up flow.

### Check approval status - responses

#### Continuation response
The check approval status API endpoint should return a **continuation response** if:
- User has not previously requested an approval.

*Example response*
```http
Response 
Status code: 200 
{ 
    "version": "1.0.0", 
    "action": "Allow",  
};  
```

#### Exit  response
The check approval status API endpoint should return an **exit response** if:
- User approval is pending
- User was denied and shouldn't be allowed to request approval again

*Example responses*
```http
Response 
Status code: 200 
{ 
    "version": "1.0.0", 
    "action": "ShowBlockPage", 
    "userMessage": "Your access request is already processing. You'll be notified when your request has been approved.", 
    "code": "CONTOSO-APPROVAL-PENDING", 
} 
```

```http
Response 
Status code: 200 
{ 
    "version": "1.0.0", 
    "action": "ShowBlockPage", 
    "userMessage": "Your sign up request has been denied. Please contact an administrator if you believe this is an error.", 
    "code": "CONTOSO-APPROVAL-DENIED", 
} 
```

### Create approval - responses
#### Continuation response
The create approval request should return a **continuation response** if:
- the user can automatically be approved. 


*Example response*
```http
Response 
Status code: 200 
{ 
    "version": "1.0.0", 
    "action": "Allow",  
};  
```

> [!IMPORTANT]
> Azure AD will create the user an account and take the redirect the user to the application that invoked the sign up flow.

#### Exit Response
The create approval request should return an **exit response** if:
- User approval request was created and is now pending.
- User approval request was automatically denied.

*Example responses*
```http
Response 
Status code: 200 
{ 
    "version": "1.0.0", 
    "action": "ShowBlockPage", 
    "userMessage": "Your account is now waiting for approval. You'll be notified when your request has been approved.", 
    "code": "CONTOSO-APPROVAL-REQUESTED", 
} 
```

```http
Response 
Status code: 200 
{ 
    "version": "1.0.0", 
    "action": "ShowBlockPage", 
    "userMessage": "Your sign up request has been denied. Please contact an administrator if you believe this is an error.", 
    "code": "CONTOSO-APPROVAL-AUTO-DENIED", 
} 
```

## Create a user account
After obtaining the approval, a [user](https://docs.microsoft.com/graph/azuread-users-concept-overview) account can be created using  [Microsoft Graph](https://docs.microsoft.com/graph/use-the-api).

The way in which your approval systems provisions the user account depends on the identity provider that the user used. 

### For a federated Azure Active Directory user
If a user signs in with a federated Azure Active Directory account,  you must use the [invitation API](https://docs.microsoft.com/en-us/graph/api/invitation-post?view=graph-rest-1.0) to create the user and then optionally the [user update API](https://docs.microsoft.com/en-us/graph/api/user-update?view=graph-rest-1.0) to assign more attributes to the user.

1. Create the invitation using the **email_address** provided by the API connector.

```http
POST https://graph.microsoft.com/v1.0/invitations 
{ 

    "invitedUserEmailAddress":"johnsmith@fabrikam.onmicrosoft.com", 
    "inviteRedirectUrl" : "https://myapp.com"
} 

Response 
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

{ 
    "displayName": "John Smith",
    "givenName": "John",
    "surname": "Smith",
    "city": "Redmond",
    "country": "United States",
    "extension_<app-id>_customAttribute": "custom attribute value"
} 
```

> [!NOTE]
> These parameters, including custom attributes, are the same format as what that of the claims sent by the API connector. 

> [!NOTE]
> **mail** can't be set using the PATCH method, but is already set by the **invitedUserEmailAddress** value.

### For a federated Google or Facebook user

If your user signed in with a Google or Facebook account, you can use the [User creation API](https://docs.microsoft.com/en-us/graph/api/user-post-users?view=graph-rest-1.0&tabs=http).


The following REST POST call can be used to create a user account:

```http
{
 "userPrincipalName": "johnsmith_gmail.com#EXTERNAL@contoso.onmicrosoft.com",
 "accountEnabled": true,
 "mail": "johnsmith@fabrikam.onmicrosoft.com",
 "mailNickname": "unknown",
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
 "extension_<app-id>_customAttribute": "custom attribute value"
}
```

> [!IMPORTANT]
> The approval system should explicitly check that **identities.issuer** is present and equals to 'facebook' or 'google' to use this method. 

> [!NOTE]
> The **userPrincipalName** parameter can be generated by taking the **'email_address'** claim sent from a user flow, replacing the **'@** character with **'_'**, and pre-pending it to **'#EXTERNAL@\<tenant-name\>'**.

> [!NOTE]
> The **'mail'** parameter should be equivalent to **'email_address'** claim sent from a user flow. 

> [!NOTE]
> Aside from **userPrincipalName**, **accountEnabled**, **mail**, and **mailNickname**, the rest of the parameters, including custom attributes, are the same format as what that of the claims sent by the API connector.

#### Custom Attributes
Custom attributes can be created for the user using the **extension_\<app-id>_\<attributeName>** format. More information regarding custom & extension attributes, see [Add custom data to users using open extensions](https://docs.microsoft.com/graph/extensibility-open-users).

