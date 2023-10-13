---
title: Add custom approvals to self-service sign-up flows
description: Add API connectors for custom approval workflows in External Identities self-service sign-up
services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: how-to
ms.date: 01/09/2023

ms.author: mimart
author: msmimart
manager: celestedg
ms.custom: "it-pro"
ms.collection: engagement-fy23, M365-identity-device-management

# Customer intent: As a tenant administrator, I want to add API connectors for custom approval workflows in self-service sign-up.
---

# Add a custom approval workflow to self-service sign-up

With [API connectors](api-connectors-overview.md), you can integrate with your own custom approval workflows with self-service sign-up so you can manage which guest user accounts are created in your tenant.

This article gives an example of how to integrate with an approval system. In this example, the self-service sign-up user flow collects user data during the sign-up process and passes it to your approval system. Then, the approval system can:

- Automatically approve the user and allow Microsoft Entra ID to create the user account.
- Trigger a manual review. If the request is approved, the approval system uses Microsoft Graph to provision the user account. The approval system can also notify the user that their account has been created.

> [!IMPORTANT]
>
> - **Starting July 12, 2021**,  if Microsoft Entra B2B customers set up new Google integrations for use with self-service sign-up for their custom or line-of-business applications, authentication with Google identities won’t work until authentications are moved to system web-views. [Learn more](google-federation.md#deprecation-of-web-view-sign-in-support).
> - **Starting September 30, 2021**, Google is [deprecating embedded web-view sign-in support](https://developers.googleblog.com/2016/08/modernizing-oauth-interactions-in-native-apps.html). If your apps authenticate users with an embedded web-view and you're using Google federation with [Azure AD B2C](/azure/active-directory-b2c/identity-provider-google) or Microsoft Entra B2B for [external user invitations](google-federation.md) or [self-service sign-up](identity-providers.md), Google Gmail users won't be able to authenticate. [Learn more](google-federation.md#deprecation-of-web-view-sign-in-support).

## Register an application for your approval system

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

You need to register your approval system as an application in your Microsoft Entra tenant so it can authenticate with Microsoft Entra ID and have permission to create users. Learn more about [authentication and authorization basics for Microsoft Graph](/graph/auth/auth-concepts).

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [User Administrator](../roles/permissions-reference.md#user-administrator).
1. Browse to **Identity** > **Applications** > **App registrations**, and then select **New registration**.
1. Enter a **Name** for the application, for example, _Sign-up Approvals_.
1. Select **Register**. You can leave other fields at their defaults.

:::image type="content" source="media/self-service-sign-up-add-approvals/register-approvals-app.png" alt-text="Screenshot that highlights the Register button.":::

1. Under **Manage** in the left menu, select **API permissions**, and then select **Add a permission**.
1. On the **Request API permissions** page, select **Microsoft Graph**, and then select **Application permissions**.
1. Under **Select permissions**, expand **User**, and then select the **User.ReadWrite.All** check box. This permission allows the approval system to create the user upon approval. Then select **Add permissions**.

:::image type="content" source="media/self-service-sign-up-add-approvals/request-api-permissions.png" alt-text="Screenshot of requesting API permissions.":::

9. On the **API permissions** page, select **Grant admin consent for (your tenant name)**, and then select **Yes**.
10. Under **Manage** in the left menu, select **Certificates & secrets**, and then select **New client secret**.
11. Enter a **Description** for the secret, for example _Approvals client secret_, and select the duration for when the client secret **Expires**. Then select **Add**.
12. Copy the value of the client secret. Client secret values can be viewed only immediately after creation. Make sure to save the secret when created, before leaving the page.

:::image type="content" source="media/self-service-sign-up-add-approvals/client-secret-value-copy.png" alt-text="Screenshot of copying the client secret. ":::

13. Configure your approval system to use the **Application ID** as the client ID and the **client secret** you generated to authenticate with Microsoft Entra ID.

## Create the API connectors

Next you'll [create the API connectors](self-service-sign-up-add-api-connector.md#create-an-api-connector) for your self-service sign-up user flow. Your approval system API needs two connectors and corresponding endpoints, like the examples shown below. These API connectors do the following:

- **Check approval status**. Send a call to the approval system immediately after a user signs-in with an identity provider to check if the user has an existing approval request or has already been denied. If your approval system only does automatic approval decisions, this API connector may not be needed. Example of a "Check approval status" API connector.

:::image type="content" source="media/self-service-sign-up-add-approvals/check-approval-status-api-connector-config-alt.png" alt-text="Screenshot of check approval status API connector configuration.":::

- **Request approval** - Send a call to the approval system after a user completes the attribute collection page, but before the user account is created, to request approval. The approval request can be automatically granted or manually reviewed. Example of a "Request approval" API connector. 

:::image type="content" source="media/self-service-sign-up-add-approvals/create-approval-request-api-connector-config-alt.png" alt-text="Screenshot of request approval API connector configuration.":::

To create these connectors, follow the steps in [create an API connector](self-service-sign-up-add-api-connector.md#create-an-api-connector).

## Enable the API connectors in a user flow

Now you'll add the API connectors to a self-service sign-up user flow with these steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [User Administrator](../roles/permissions-reference.md#user-administrator).
1. Browse to **Identity** > **External identities** > **User flows**, and then select the user flow you want to enable the API connector for.
1. Select **API connectors**, and then select the API endpoints you want to invoke at the following steps in the user flow:

   - **After federating with an identity provider during sign-up**: Select your approval status API connector, for example _Check approval status_.
   - **Before creating the user**: Select your approval request API connector, for example _Request approval_.

:::image type="content" source="media/self-service-sign-up-add-approvals/api-connectors-user-flow-api.png" alt-text="Screenshot of API connector in a user flow.":::


1. Select **Save**.

## Control the sign-up flow with API responses

Your approval system can use its responses when called to control the sign-up flow. 

### Request and responses for the "Check approval status" API connector

Example of the request received by the API from the "Check approval status" API connector:

```http
POST <API-endpoint>
Content-type: application/json

{
 "email": "johnsmith@fabrikam.onmicrosoft.com",
 "identities": [ //Sent for Google, Facebook, and Email One Time Passcode identity providers 
     {
     "signInType":"federated",
     "issuer":"facebook.com",
     "issuerAssignedId":"0123456789"
     }
 ],
 "displayName": "John Smith",
 "givenName":"John",
 "lastName":"Smith",
 "ui_locales":"en-US"
}
```

The exact claims sent to the API depend on which information is provided by the identity provider. 'email' is always sent.

#### Continuation response for "Check approval status"

The **Check approval status** API endpoint should return a continuation response if:

- The user hasn't previously requested an approval.

Example of the continuation response:

```http
HTTP/1.1 200 OK
Content-type: application/json

{
    "version": "1.0.0",
    "action": "Continue"
}
```

#### Blocking response for "Check approval status"

The **Check approval status** API endpoint should return a blocking response if:

- User approval is pending.
- The user was denied and shouldn't be allowed to request approval again.

The following are examples of blocking responses:

```http
HTTP/1.1 200 OK
Content-type: application/json

{
    "version": "1.0.0",
    "action": "ShowBlockPage",
    "userMessage": "Your access request is already processing. You'll be notified when your request has been approved.",
}
```

```http
HTTP/1.1 200 OK
Content-type: application/json

{
    "version": "1.0.0",
    "action": "ShowBlockPage",
    "userMessage": "Your sign up request has been denied. Please contact an administrator if you believe this is an error",
}
```

### Request and responses for the "Request approval" API connector

Example of an HTTP request received by the API from the "Request approval" API connector:

```http
POST <API-endpoint>
Content-type: application/json

{
 "email": "johnsmith@fabrikam.onmicrosoft.com",
 "identities": [ // Sent for Google, Facebook, and Email One Time Passcode identity providers 
     {
     "signInType":"federated",
     "issuer":"facebook.com",
     "issuerAssignedId":"0123456789"
     }
 ],
 "displayName": "John Smith",
 "givenName":"John",
 "surname":"Smith",
 "jobTitle":"Supplier",
 "streetAddress":"1000 Microsoft Way",
 "city":"Seattle",
 "postalCode": "12345",
 "state":"Washington",
 "country":"United States",
 "extension_<extensions-app-id>_CustomAttribute1": "custom attribute value",
 "extension_<extensions-app-id>_CustomAttribute2": "custom attribute value",
 "ui_locales":"en-US"
}
```

The exact claims sent to the API depend on which information is collected from the user or is provided by the identity provider.

#### Continuation response for "Request approval"

The **Request approval** API endpoint should return a continuation response if:

- The user can be **_automatically approved_**.

Example of the continuation response:

```http
HTTP/1.1 200 OK
Content-type: application/json

{
    "version": "1.0.0",
    "action": "Continue"
}
```

> [!IMPORTANT]
> If a continuation response is received, Microsoft Entra ID creates a user account and directs the user to the application.

#### Blocking Response for "Request approval"

The **Request approval** API endpoint should return a blocking response if:

- A user approval request was created and is now pending.
- A user approval request was automatically denied.

The following are examples of blocking responses:

```http
HTTP/1.1 200 OK
Content-type: application/json

{
    "version": "1.0.0",
    "action": "ShowBlockPage",
    "userMessage": "Your account is now waiting for approval. You'll be notified when your request has been approved.",
}
```

```http
HTTP/1.1 200 OK
Content-type: application/json

{
    "version": "1.0.0",
    "action": "ShowBlockPage",
    "userMessage": "Your sign up request has been denied. Please contact an administrator if you believe this is an error",
}
```

The `userMessage` in the response is displayed to the user, for example:

![Example pending approval page](./media/self-service-sign-up-add-approvals/approval-pending.png)

## User account creation after manual approval

After obtaining manual approval, the custom approval system creates a [user](/graph/azuread-users-concept-overview) account by using [Microsoft Graph](/graph/use-the-api). The way your approval system provisions the user account depends on the identity provider that was used by the user.

### For a federated Google or Facebook user and email one-time passcode

> [!IMPORTANT]
> The approval system should explicitly check that `identities`, `identities[0]` and `identities[0].issuer` are present and that `identities[0].issuer` equals 'facebook', 'google' or 'mail' to use this method.

If your user signed in with a Google or Facebook account or email one-time passcode, you can use the [User creation API](/graph/api/user-post-users?tabs=http).

1. The approval system uses receives the HTTP request from the user flow.

```http
POST <Approvals-API-endpoint>
Content-type: application/json

{
 "email": "johnsmith@outlook.com",
 "identities": [
     {
     "signInType":"federated",
     "issuer":"facebook.com",
     "issuerAssignedId":"0123456789"
     }
 ],
 "displayName": "John Smith",
 "city": "Redmond",
 "extension_<extensions-app-id>_CustomAttribute": "custom attribute value",
 "ui_locales":"en-US"
}
```

2. The approval system uses Microsoft Graph to create a user account.

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
 "city": "Redmond",
 "extension_<extensions-app-id>_CustomAttribute": "custom attribute value"
}
```

| Parameter                                           | Required | Description                                                                                                                                                            |
| --------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| userPrincipalName                                   | Yes      | Can be generated by taking the `email` claim sent to the API, replacing the `@`character with `_`, and pre-pending it to `#EXT@<tenant-name>.onmicrosoft.com`. |
| accountEnabled                                      | Yes      | Must be set to `true`.                                                                                                                                                 |
| mail                                                | Yes      | Equivalent to the `email` claim sent to the API.                                                                                                               |
| userType                                            | Yes      | Must be `Guest`. Designates this user as a guest user.                                                                                                                 |
| identities                                          | Yes      | The federated identity information.                                                                                                                                    |
| \<otherBuiltInAttribute>                            | No       | Other built-in attributes like `displayName`, `city`, and others. Parameter names are the same as the parameters sent by the API connector.                            |
| \<extension\_\{extensions-app-id}\_CustomAttribute> | No       | Custom attributes about the user. Parameter names are the same as the parameters sent by the API connector.                                                            |

<a name='for-a-federated-azure-active-directory-user-or-microsoft-account-user'></a>

### For a federated Microsoft Entra user or Microsoft account user

If a user signs in with a federated Microsoft Entra account or a Microsoft account, you must use the [invitation API](/graph/api/invitation-post) to create the user and then optionally the [user update API](/graph/api/user-update) to assign more attributes to the user.

1. The approval system receives the HTTP request from the user flow.

```http
POST <Approvals-API-endpoint>
Content-type: application/json

{
 "email": "johnsmith@fabrikam.onmicrosoft.com",
 "displayName": "John Smith",
 "city": "Redmond",
 "extension_<extensions-app-id>_CustomAttribute": "custom attribute value",
 "ui_locales":"en-US"
}
```

2. The approval system creates the invitation using the `email` provided by the API connector.

```http
POST https://graph.microsoft.com/v1.0/invitations
Content-type: application/json

{
    "invitedUserEmailAddress": "johnsmith@fabrikam.onmicrosoft.com",
    "inviteRedirectUrl" : "https://myapp.com"
}
```

Example of the response:

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

3. The approval system uses the invited user's ID to update the user's account with collected user attributes (optional).

```http
PATCH https://graph.microsoft.com/v1.0/users/<generated-user-guid>
Content-type: application/json

{
    "displayName": "John Smith",
    "city": "Redmond",
    "extension_<extensions-app-id>_AttributeName": "custom attribute value"
}
```

## Next steps

- [Add a self-service sign-up user flow](self-service-sign-up-user-flow.md)
- [Add an API connector](self-service-sign-up-add-api-connector.md)
- [Secure your API connector](self-service-sign-up-secure-api-connector.md)
- [self-service sign-up for guest users with manual approval sample](code-samples-self-service-sign-up.md#custom-approval-workflows).
