---
title: Add API connectors to self-service sign-up flows
description: Configure a web API to be used in a user flow.
services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: how-to
ms.date: 01/16/2023

ms.author: mimart
author: msmimart
manager: celestedg
ms.custom: "it-pro"
ms.collection: M365-identity-device-management
---

# Add an API connector to a user flow

To use an [API connector](api-connectors-overview.md), you first create the API connector and then enable it in a user flow.

> [!IMPORTANT]
>
> - **Starting July 12, 2021**,  if Microsoft Entra B2B customers set up new Google integrations for use with self-service sign-up for their custom or line-of-business applications, authentication with Google identities won’t work until authentications are moved to system web-views. [Learn more](google-federation.md#deprecation-of-web-view-sign-in-support).
> - **Starting September 30, 2021**, Google is [deprecating embedded web-view sign-in support](https://developers.googleblog.com/2016/08/modernizing-oauth-interactions-in-native-apps.html). If your apps authenticate users with an embedded web-view and you're using Google federation with [Azure AD B2C](/azure/active-directory-b2c/identity-provider-google) or Microsoft Entra B2B for [external user invitations](google-federation.md) or [self-service sign-up](identity-providers.md), Google Gmail users won't be able to authenticate. [Learn more](google-federation.md#deprecation-of-web-view-sign-in-support).

## Create an API connector

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [User Administrator](../roles/permissions-reference.md#user-administrator).
1. Browse to **Identity** > **External Identities** > **Overview**.
1. Select **All API connectors**, and then select **New API connector**.

    :::image type="content" source="media/self-service-sign-up-add-api-connector/api-connector-new.png" alt-text="Screenshot of adding a new API connector to External Identities.":::

1. Provide a display name for the call. For example, **Check approval status**.
1. Provide the **Endpoint URL** for the API call.
1. Choose the **Authentication type** and configure the authentication information for calling your API. Learn how to [Secure your API Connector](self-service-sign-up-secure-api-connector.md).

    :::image type="content" source="media/self-service-sign-up-add-api-connector/api-connector-config.png" alt-text="Screenshot of configuring an API connector.":::

1. Select **Save**.

## The request sent to your API
An API connector materializes as an **HTTP POST** request, sending user attributes ('claims') as key-value pairs in a JSON body. Attributes are serialized similarly to [Microsoft Graph](/graph/api/resources/user#properties) user properties. 

**Example request**
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

Only user properties and custom attributes listed in the **Identity** > **External Identities** > **Overview** > **Custom user attributes** experience are available to be sent in the request.

Custom attributes exist in the **extension_\<extensions-app-id>_AttributeName**  format in the directory. Your API should expect to receive claims in this same serialized format. For more information on custom attributes, see [define custom attributes for self-service sign-up flows](user-flow-add-custom-attributes.md).

Additionally, the claims are typically sent in all request:
- **UI Locales ('ui_locales')** -  An end-user's locale(s) as configured on their device. This can be used by your API to return internationalized responses.
<!-- - **Step ('step')** - The step or point on the user flow that the API connector was invoked for. Values include:
  - `PostFederationSignup` - corresponds to "After federating with an identity provider during sign-up"
  - `PostAttributeCollection` - corresponds to "Before creating the user"
- **Client ID ('client_id')** - The `appId` value of the application that an end-user is authenticating to in a user flow. This is *not* the resource application's `appId` in access tokens. -->
- **Email Address ('email')** or [**identities ('identities')**](/graph/api/resources/objectidentity) - these claims can be used by your API to identify the end-user that is authenticating to the application.

> [!IMPORTANT]
> If a claim does not have a value at the time the API endpoint is called, the claim will not be sent to the API. Your API should be designed to explicitly check and handle the case in which a claim is not in the request.

## Enable the API connector in a user flow

Follow these steps to add an API connector to a self-service sign-up user flow.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [User Administrator](../roles/permissions-reference.md#user-administrator).
1. Browse to **Identity** > **External Identities** > **Overview**.
4. Select **User flows**, and then select the user flow you want to add the API connector to.
5. Select **API connectors**, and then select the API endpoints you want to invoke at the following steps in the user flow:

   - **After federating with an identity provider during sign-up**
   - **Before creating the user**

    :::image type="content" source="media/self-service-sign-up-add-api-connector/api-connectors-user-flow-select.png" alt-text="Selecting which API connector to use for a step in the user flow like 'Before creating the user'.":::

6. Select **Save**.

## After federating with an identity provider during sign-up

An API connector at this step in the sign-up process is invoked immediately after the user authenticates with an identity provider (like Google, Facebook, or Microsoft Entra ID). This step precedes the ***attribute collection page***, which is the form presented to the user to collect user attributes.

### Example request sent to the API at this step
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
 "lastName":"Smith",
 "ui_locales":"en-US"
}
```

The exact claims sent to the API depend on which information is provided by the identity provider. 'email' is always sent.

### Expected response types from the web API at this step

When the web API receives an HTTP request from Microsoft Entra ID during a user flow, it can return these responses:

- Continuation response
- Blocking response

#### Continuation response

A continuation response indicates that the user flow should continue to the next step: the attribute collection page.

In a continuation response, the API can return claims. If a claim is returned by the API, the claim does the following:

- Pre-fills the input field in the attribute collection page.

See an example of a [continuation response](#example-of-a-continuation-response).

#### Blocking Response

A blocking response exits the user flow. It can be purposely issued by the API to stop the continuation of the user flow by displaying a block page to the user. The block page displays the `userMessage` provided by the API.

See an example of a [blocking response](#example-of-a-blocking-response).

## Before creating the user

An API connector at this step in the sign-up process is invoked after the attribute collection page, if one is included. This step is always invoked before a user account is created in Microsoft Entra ID. 

### Example request sent to the API at this step

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

### Expected response types from the web API at this step

When the web API receives an HTTP request from Microsoft Entra ID during a user flow, it can return these responses:

- Continuation response
- Blocking response
- Validation response

#### Continuation response
A continuation response indicates that the user flow should continue to the next step: create the user in the directory.

In a continuation response, the API can return claims. If a claim is returned by the API, the claim does the following:

- Overrides any value that has already been assigned to the claim from the attribute collection page.

See an example of a [continuation response](#example-of-a-continuation-response).

#### Blocking Response
A blocking response exits the user flow. It can be purposely issued by the API to stop the continuation of the user flow by displaying a block page to the user. The block page displays the `userMessage` provided by the API.

See an example of a [blocking response](#example-of-a-blocking-response).

### Validation-error response
 When the API responds with a validation-error response, the user flow stays on the attribute collection page, and a `userMessage` is displayed to the user. The user can then edit and resubmit the form. This type of response can be used for input validation.

See an example of a [validation-error response](#example-of-a-validation-error-response).

## Example responses

### Example of a continuation response

```http
HTTP/1.1 200 OK
Content-type: application/json

{
    "version": "1.0.0",
    "action": "Continue",
    "postalCode": "12349", // return claim
    "extension_<extensions-app-id>_CustomAttribute": "value" // return claim
}
```

| Parameter                                          | Type              | Required | Description                                                                                                                                                                                                                                                                            |
| -------------------------------------------------- | ----------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| version                                            | String            | Yes      | The version of your API.                                                                                                                                                                                                                                                                |
| action                                             | String            | Yes      | Value must be `Continue`.                                                                                                                                                                                                                                                              |
| \<builtInUserAttribute>                            | \<attribute-type> | No       | Values can be stored in the directory if they selected as a **Claim to receive** in the API connector configuration and **User attributes** for a user flow. Values can be returned in the token if selected as an **Application claim**.                                              |
| \<extension\_{extensions-app-id}\_CustomAttribute> | \<attribute-type> | No       | The claim doesn't need to contain `_<extensions-app-id>_`, it's *optional*. Returned values can overwrite values collected from a user.  |

### Example of a blocking response

```http
HTTP/1.1 200 OK
Content-type: application/json

{
    "version": "1.0.0",
    "action": "ShowBlockPage",
    "userMessage": "There was an error with your request. Please try again or contact support.",
}

```

| Parameter   | Type   | Required | Description                                                                |
| ----------- | ------ | -------- | -------------------------------------------------------------------------- |
| version     | String | Yes      | The version of your API.                                                    |
| action      | String | Yes      | Value must be `ShowBlockPage`                                              |
| userMessage | String | Yes      | Message to display to the user.                                            |

**End-user experience with a blocking response**

:::image type="content" source="media/api-connectors-overview/blocking-page-response.png" alt-text="An example image of what the end-user experience looks like after an API returns a blocking response.":::

### Example of a validation-error response

```http
HTTP/1.1 400 Bad Request
Content-type: application/json

{
    "version": "1.0.0",
    "status": 400,
    "action": "ValidationError",
    "userMessage": "Please enter a valid Postal Code.",
}
```

| Parameter   | Type    | Required | Description                                                                |
| ----------- | ------- | -------- | -------------------------------------------------------------------------- |
| version     | String  | Yes      | The version of your API.                                                    |
| action      | String  | Yes      | Value must be `ValidationError`.                                           |
| status      | Integer / String | Yes      | Must be value `400`, or `"400"` for a ValidationError response.  |
| userMessage | String  | Yes      | Message to display to the user.                                            |

> [!NOTE]
> HTTP status code has to be "400" in addition to the "status" value in the body of the response.

**End-user experience with a validation-error response**

:::image type="content" source="media/api-connectors-overview/validation-error-postal-code.png" alt-text="An example image of what the end-user experience looks like after an API returns a validation-error response.":::

## Best practices and how to troubleshoot

### Using serverless cloud functions

Serverless functions, like [HTTP triggers in Azure Functions](/azure/azure-functions/functions-bindings-http-webhook-trigger), provide a way create API endpoints to use with the API connector. You can use the serverless cloud function to, [for example](code-samples-self-service-sign-up.md#api-connector-azure-function-quickstarts), perform validation logic and limit sign-ups to specific email domains. The serverless cloud function can also call and invoke other web APIs, data stores, and other cloud services for complex scenarios.

### Best practices
Ensure that:
* Your API is following the API request and response contracts as outlined above. 
* The **Endpoint URL** of the API connector points to the correct API endpoint.
* Your API explicitly checks for null values of received claims that it depends on.
* Your API implements an authentication method outlined in [secure your API Connector](self-service-sign-up-secure-api-connector.md).
* Your API responds as quickly as possible to ensure a fluid user experience.
    * Microsoft Entra ID will wait for a maximum of *20 seconds* to receive a response. If none is received, it will make *one more attempt (retry)* at calling your API.
    * If using a serverless function or scalable web service, use a hosting plan that keeps the API "awake" or "warm" in production. For Azure Functions, it's recommended to use at minimum the [Premium plan](/azure/azure-functions/functions-scale#overview-of-plans)
* Ensure high availability of your API.
* Monitor and optimize performance of downstream APIs, databases, or other dependencies of your API.
* Your endpoints must comply with the Microsoft Entra TLS and cipher security requirements. For more information, see [TLS and cipher suite requirements](/azure/active-directory-b2c/https-cipher-tls-requirements). 
 
### Use logging

In general, it's helpful to use the logging tools enabled by your web API service, like [Application insights](/azure/azure-functions/functions-monitoring), to monitor your API for unexpected error codes, exceptions, and poor performance.
* Monitor for HTTP status codes that aren't HTTP 200 or 400.
* A 401 or 403 HTTP status code typically indicates there's an issue with your authentication. Double-check your API's authentication layer and the corresponding configuration in the API connector.
* Use more aggressive levels of logging (for example "trace" or "debug") in development if needed.
* Monitor your API for long response times. 

## Next steps
- Learn how to [add a custom approval workflow to self-service sign-up](self-service-sign-up-add-approvals.md)
- Get started with our [quickstart samples](code-samples-self-service-sign-up.md#api-connector-azure-function-quickstarts).
