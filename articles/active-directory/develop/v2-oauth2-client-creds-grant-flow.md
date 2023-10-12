---
title: OAuth 2.0 client credentials flow on the Microsoft identity platform
description: Build web applications by using the Microsoft identity platform implementation of the OAuth 2.0 authentication protocol.
services: active-directory
author: OwenRichards1
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: conceptual
ms.date: 02/13/2023
ms.author: owenrichards
ms.reviewer: ludwignick
ms.custom: aaddev, identityplatformtop40
---

# Microsoft identity platform and the OAuth 2.0 client credentials flow

The OAuth 2.0 client credentials grant flow permits a web service (confidential client) to use its own credentials, instead of impersonating a user, to authenticate when calling another web service. The grant specified in [RFC 6749](https://tools.ietf.org/html/rfc6749#section-4.4), sometimes called *two-legged OAuth*, can be used to access web-hosted resources by using the identity of an application. This type is commonly used for server-to-server interactions that must run in the background, without immediate interaction with a user, and is often referred to as *daemons* or *service accounts*.

In the client credentials flow, permissions are granted directly to the application itself by an administrator. When the app presents a token to a resource, the resource enforces that the app itself has authorization to perform an action since there is no user involved in the authentication. This article covers both the steps needed to: 

- [Authorize an application to call an API](#application-permissions)
- [How to get the tokens needed to call that API](#get-a-token).

This article describes how to program directly against the protocol in your application. When possible, we recommend you use the supported Microsoft Authentication Libraries (MSAL) instead to [acquire tokens and call secured web APIs](authentication-flows-app-scenarios.md#scenarios-and-supported-authentication-flows). You can also refer to the [sample apps that use MSAL](sample-v2-code.md). As a side note, refresh tokens will never be granted with this flow as `client_id` and `client_secret` (which would be required to obtain a refresh token) can be used to obtain an access token instead.

For a higher level of assurance, the Microsoft identity platform also allows the calling service to authenticate using a [certificate](#second-case-access-token-request-with-a-certificate) or federated credential instead of a shared secret.  Because the application's own credentials are being used, these credentials must be kept safe. _Never_ publish that credential in your source code, embed it in web pages, or use it in a widely distributed native application. 

[!INCLUDE [try-in-postman-link](includes/try-in-postman-link.md)]

## Protocol diagram

The entire client credentials flow looks similar to the following diagram. We describe each of the steps later in this article.

![Diagram showing the client credentials flow](./media/v2-oauth2-client-creds-grant-flow/convergence-scenarios-client-creds.svg)

## Get direct authorization

An app typically receives direct authorization to access a resource in one of two ways:

* [Through an access control list (ACL) at the resource](#access-control-lists)
* [Through application permission assignment in Microsoft Entra ID](#application-permissions)

These two methods are the most common in Microsoft Entra ID and we recommend them for clients and resources that perform the client credentials flow. A resource can also choose to authorize its clients in other ways. Each resource server can choose the method that makes the most sense for its application.

### Access control lists

A resource provider might enforce an authorization check based on a list of application (client) IDs that it knows and grants a specific level of access to. When the resource receives a token from the Microsoft identity platform, it can decode the token and extract the client's application ID from the `appid` and `iss` claims. Then it compares the application against an access control list (ACL) that it maintains. The ACL's granularity and method might vary substantially between resources.

A common use case is to use an ACL to run tests for a web application or for a web API. The web API might grant only a subset of full permissions to a specific client. To run end-to-end tests on the API, you can create a test client that acquires tokens from the Microsoft identity platform and then sends them to the API. The API then checks the ACL for the test client's application ID for full access to the API's entire functionality. If you use this kind of ACL, be sure to validate not only the caller's `appid` value but also validate that the `iss` value of the token is trusted.

This type of authorization is common for daemons and service accounts that need to access data owned by consumer users who have personal Microsoft accounts. For data owned by organizations, we recommend that you get the necessary authorization through application permissions.

#### Controlling tokens without the `roles` claim

In order to enable this ACL-based authorization pattern, Microsoft Entra ID doesn't require that applications be authorized to get tokens for another application. Thus, app-only tokens can be issued without a `roles` claim. Applications that expose APIs must implement permission checks in order to accept tokens.

If you'd like to prevent applications from getting role-less app-only access tokens for your application, [ensure that assignment requirements are enabled for your app](../manage-apps/what-is-access-management.md#requiring-user-assignment-for-an-app). This will block users and applications without assigned roles from being able to get a token for this application. 

### Application permissions

Instead of using ACLs, you can use APIs to expose a set of **application permissions**. These are granted to an application by an organization's administrator, and can be used only to access data owned by that organization and its employees. For example, Microsoft Graph exposes several application permissions to do the following:

* Read mail in all mailboxes
* Read and write mail in all mailboxes
* Send mail as any user
* Read directory data

To use app roles (application permissions) with your own API (as opposed to Microsoft Graph), you must first [expose the app roles](./howto-add-app-roles-in-apps.md) in the API's app registration in the Microsoft Entra admin center. Then, [configure the required app roles](./howto-add-app-roles-in-apps.md#assign-app-roles-to-applications) by selecting those permissions in your client application's app registration. If you haven't exposed any app roles in your API's app registration, you won't be able to specify application permissions to that API in your client application's app registration in the Microsoft Entra admin center.

When authenticating as an application (as opposed to with a user), you can't use *delegated permissions* because there is no user for your app to act on behalf of. You must use application permissions, also known as app roles, that are granted by an admin or by the API's owner.

For more information about application permissions, see [Permissions and consent](./permissions-consent-overview.md#permission-types).

#### Recommended: Sign the admin into your app to have app roles assigned

Typically, when you build an application that uses application permissions, the app requires a page or view on which the admin approves the app's permissions. This page can be part of the app's sign-in flow, part of the app's settings, or a dedicated *connect* flow. It often makes sense for the app to show this *connect* view only after a user has signed in with a work or school Microsoft account.

If you sign the user into your app, you can identify the organization to which the user belongs to before you ask the user to approve the application permissions. Although not strictly necessary, it can help you create a more intuitive experience for your users. To sign the user in, follow the [Microsoft identity platform protocol tutorials](./v2-protocols.md).

#### Request the permissions from a directory admin

When you're ready to request permissions from the organization's admin, you can redirect the user to the Microsoft identity platform *admin consent endpoint*.

```HTTP
// Line breaks are for legibility only.

GET https://login.microsoftonline.com/{tenant}/adminconsent?
client_id=6731de76-14a6-49ae-97bc-6eba6914391e
&state=12345
&redirect_uri=http://localhost/myapp/permissions
```

Pro tip: Try pasting the following request in a browser.

```
https://login.microsoftonline.com/common/adminconsent?client_id=6731de76-14a6-49ae-97bc-6eba6914391e&state=12345&redirect_uri=http://localhost/myapp/permissions
```

|    Parameter   |  Condition  | Description |
| -------------- | ----------- | ----------- |
|    `tenant`    |  Required   | The directory tenant that you want to request permission from. This can be in GUID or friendly name format. If you don't know which tenant the user belongs to and you want to let them sign in with any tenant, use `common`. |
|  `client_id`   |  Required   | The **Application (client) ID** that the [Microsoft Entra admin center – App registrations](https://go.microsoft.com/fwlink/?linkid=2083908) experience assigned to your app. |
| `redirect_uri` |  Required   | The redirect URI where you want the response to be sent for your app to handle. It must exactly match one of the redirect URIs that you registered in the portal, except that it must be URL-encoded, and it can have additional path segments. |
|    `state`     | Recommended | A value that's included in the request that's also returned in the token response. It can be a string of any content that you want. The state is used to encode information about the user's state in the app before the authentication request occurred, such as the page or view they were on. |

At this point, Microsoft Entra ID enforces that only a tenant administrator can sign in to complete the request. The administrator will be asked to approve all the direct application permissions that you have requested for your app in the app registration portal.

##### Successful response

If the admin approves the permissions for your application, the successful response looks like this:

```HTTP
GET http://localhost/myapp/permissions?tenant=a8990e1f-ff32-408a-9f8e-78d3b9139b95&state=state=12345&admin_consent=True
```

|    Parameter    | Description |
| --------------- | ----------- |
|     `tenant`    | The directory tenant that granted your application the permissions that it requested, in GUID format. |
|     `state`     | A value that is included in the request that also is returned in the token response. It can be a string of any content that you want. The state is used to encode information about the user's state in the app before the authentication request occurred, such as the page or view they were on. |
| `admin_consent` | Set to **True**. |

NOTE: Don't use tenant ID value of tenant parameter to authenticate or authorize users as the value can be updated and sent by anyone. It can occuer security incident for your application. 

##### Error response

If the admin does not approve the permissions for your application, the failed response looks like this:

```HTTP
GET http://localhost/myapp/permissions?error=permission_denied&error_description=The+admin+canceled+the+request
```

|      Parameter      | Description |
| ------------------- | ----------- |
|       `error`       | An error code string that you can use to classify types of errors, and which you can use to react to errors. |
| `error_description` | A specific error message that can help you identify the root cause of an error. |

After you've received a successful response from the app provisioning endpoint, your app has gained the direct application permissions that it requested. Now you can request a token for the resource that you want.

## Get a token

After you've acquired the necessary authorization for your application, proceed with acquiring access tokens for APIs. To get a token by using the client credentials grant, send a POST request to the `/token` Microsoft identity platform. There are a few different cases:

- [Access token request with a shared secret](#first-case-access-token-request-with-a-shared-secret)
- [Access token request with a certificate](#second-case-access-token-request-with-a-certificate)
- [Access token request with a federated credential](#third-case-access-token-request-with-a-federated-credential)

### First case: Access token request with a shared secret

```HTTP
POST /{tenant}/oauth2/v2.0/token HTTP/1.1           //Line breaks for clarity
Host: login.microsoftonline.com:443
Content-Type: application/x-www-form-urlencoded

client_id=535fb089-9ff3-47b6-9bfb-4f1264799865
&scope=https%3A%2F%2Fgraph.microsoft.com%2F.default
&client_secret=sampleCredentia1s
&grant_type=client_credentials
```

```bash
# Replace {tenant} with your tenant!
curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -d 'client_id=535fb089-9ff3-47b6-9bfb-4f1264799865&scope=https%3A%2F%2Fgraph.microsoft.com%2F.default&client_secret=qWgdYAmab0YSkuL1qKv5bPX&grant_type=client_credentials' 'https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token'
```

|    Parameter    | Condition | Description |
| --------------- | --------- | ----------- |
|     `tenant`    |  Required | The directory tenant the application plans to operate against, in GUID or domain-name format. |
|    `client_id`  |  Required | The application ID that's assigned to your app. You can find this information in the portal where you registered your app. |
|     `scope`     |  Required | The value passed for the `scope` parameter in this request should be the resource identifier (application ID URI) of the resource you want, affixed with the `.default` suffix. All scopes included must be for a single resource. Including scopes for multiple resources will result in an error. <br/>For the Microsoft Graph example, the value is `https://graph.microsoft.com/.default`. This value tells the Microsoft identity platform that of all the direct application permissions you have configured for your app, the endpoint should issue a token for the ones associated with the resource you want to use. To learn more about the `/.default` scope, see the [consent documentation](./permissions-consent-overview.md#the-default-scope). |
| `client_secret` |  Required | The client secret that you generated for your app in the app registration portal. The client secret must be URL-encoded before being sent. The Basic auth pattern of instead providing credentials in the Authorization header, per [RFC 6749](https://datatracker.ietf.org/doc/html/rfc6749#section-2.3.1) is also supported. |
|  `grant_type`   |  Required | Must be set to `client_credentials`. |

### Second case: Access token request with a certificate

```HTTP
POST /{tenant}/oauth2/v2.0/token HTTP/1.1               // Line breaks for clarity
Host: login.microsoftonline.com:443
Content-Type: application/x-www-form-urlencoded

scope=https%3A%2F%2Fgraph.microsoft.com%2F.default
&client_id=97e0a5b7-d745-40b6-94fe-5f77d35c6e05
&client_assertion_type=urn%3Aietf%3Aparams%3Aoauth%3Aclient-assertion-type%3Ajwt-bearer
&client_assertion=eyJhbGciOiJSUzI1NiIsIng1dCI6Imd4OHRHeXN5amNScUtqRlBuZDdSRnd2d1pJMCJ9.eyJ{a lot of characters here}M8U3bSUKKJDEg
&grant_type=client_credentials
```

|         Parameter       | Condition | Description |
| ----------------------- | --------- | ----------- |
|         `tenant`        |  Required | The directory tenant the application plans to operate against, in GUID or domain-name format. |
|       `client_id`       |  Required | The application (client) ID that's assigned to your app. |
|         `scope`         |  Required | The value passed for the `scope` parameter in this request should be the resource identifier (application ID URI) of the resource you want, affixed with the `.default` suffix. All scopes included must be for a single resource. Including scopes for multiple resources will result in an error. <br/>For the Microsoft Graph example, the value is `https://graph.microsoft.com/.default`. This value tells the Microsoft identity platform that of all the direct application permissions you have configured for your app, the endpoint should issue a token for the ones associated with the resource you want to use. To learn more about the `/.default` scope, see the [consent documentation](./permissions-consent-overview.md#the-default-scope). |
| `client_assertion_type` |  Required | The value must be set to `urn:ietf:params:oauth:client-assertion-type:jwt-bearer`. |
|    `client_assertion`   |  Required | An assertion (a JSON web token) that you need to create and sign with the certificate you registered as credentials for your application. Read about [certificate credentials](./certificate-credentials.md) to learn how to register your certificate and the format of the assertion.|
|      `grant_type`       |  Required | Must be set to `client_credentials`. |

The parameters for the certificate-based request differ in only one way from the shared secret-based request: the `client_secret` parameter is replaced by the `client_assertion_type` and `client_assertion` parameters.

### Third case: Access token request with a federated credential

```HTTP
POST /{tenant}/oauth2/v2.0/token HTTP/1.1               // Line breaks for clarity
Host: login.microsoftonline.com:443
Content-Type: application/x-www-form-urlencoded

scope=https%3A%2F%2Fgraph.microsoft.com%2F.default
&client_id=97e0a5b7-d745-40b6-94fe-5f77d35c6e05
&client_assertion_type=urn%3Aietf%3Aparams%3Aoauth%3Aclient-assertion-type%3Ajwt-bearer
&client_assertion=eyJhbGciOiJSUzI1NiIsIng1dCI6Imd4OHRHeXN5amNScUtqRlBuZDdSRnd2d1pJMCJ9.eyJ{a lot of characters here}M8U3bSUKKJDEg
&grant_type=client_credentials
```

|      Parameter     | Condition | Description |
| ------------------ | --------- | ----------- |
| `client_assertion` |  Required | An assertion (a JWT, or JSON web token) that your application gets from another identity provider outside of Microsoft identity platform, like  Kubernetes. The specifics of this JWT must be registered on your application as a [federated identity credential](../workload-identities/workload-identity-federation-create-trust.md). Read about [workload identity federation](../workload-identities/workload-identity-federation.md) to learn how to setup and use assertions generated from other identity providers.|

Everything in the request is the same as the certificate-based flow, with the crucial exception of the source of the `client_assertion`. In this flow, your application does not create the JWT assertion itself.  Instead, your app uses a JWT created by another identity provider.  This is called *[workload identity federation](../workload-identities/workload-identity-federation.md)*, where your apps identity in another identity platform is used to acquire tokens inside the Microsoft identity platform.  This is best suited for cross-cloud scenarios, such as hosting your compute outside Azure but accessing APIs protected by Microsoft identity platform.  For information about the required format of JWTs created by other identity providers, read about the [assertion format](./certificate-credentials.md#assertion-format).

### Successful response

A successful response from any method looks like this:

```json
{
  "token_type": "Bearer",
  "expires_in": 3599,
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik1uQ19WWmNBVGZNNXBP..."
}
```

|    Parameter   | Description |
| -------------- | ----------- |
| `access_token` | The requested access token. The app can use this token to authenticate to the secured resource, such as to a web API. |
|  `token_type`  | Indicates the token type value. The only type that the Microsoft identity platform supports is `bearer`. |
|  `expires_in`  | The amount of time that an access token is valid (in seconds). |

[!INCLUDE [remind-not-to-validate-access-tokens](includes/remind-not-to-validate-access-tokens.md)]

### Error response

An error response (400 Bad Request) looks like this:

```json
{
  "error": "invalid_scope",
  "error_description": "AADSTS70011: The provided value for the input parameter 'scope' is not valid. The scope https://foo.microsoft.com/.default is not valid.\r\nTrace ID: 255d1aef-8c98-452f-ac51-23d051240864\r\nCorrelation ID: fb3d2015-bc17-4bb9-bb85-30c5cf1aaaa7\r\nTimestamp: 2016-01-09 02:02:12Z",
  "error_codes": [
    70011
  ],
  "timestamp": "YYYY-MM-DD HH:MM:SSZ",
  "trace_id": "255d1aef-8c98-452f-ac51-23d051240864",
  "correlation_id": "fb3d2015-bc17-4bb9-bb85-30c5cf1aaaa7"
}
```

|      Parameter      | Description |
| ------------------- | ----------- |
|       `error`       | An error code string that you can use to classify types of errors that occur, and to react to errors. |
| `error_description` | A specific error message that might help you identify the root cause of an authentication error. |
|    `error_codes`    | A list of STS-specific error codes that might help with diagnostics. |
|     `timestamp`     | The time when the error occurred. |
|     `trace_id`      | A unique identifier for the request to help with diagnostics. |
|   `correlation_id`  | A unique identifier for the request to help with diagnostics across components. |

## Use a token

Now that you've acquired a token, use the token to make requests to the resource. When the token expires, repeat the request to the `/token` endpoint to acquire a fresh access token.

```HTTP
GET /v1.0/users HTTP/1.1
Host: graph.microsoft.com:443
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik5HVEZ2ZEstZnl0aEV1Q...
```
Try the following command in your terminal, ensuring to replace the token with your own.

```bash
curl -X GET -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbG...." 'https://graph.microsoft.com/v1.0/users'
```

## Code samples and other documentation

Read the [client credentials overview documentation](https://aka.ms/msal-net-client-credentials) from the Microsoft Authentication Library

| Sample | Platform |Description |
|--------|----------|------------|
|[active-directory-dotnetcore-daemon-v2](https://github.com/Azure-Samples/active-directory-dotnetcore-daemon-v2) | .NET Core 6.0+ | A .NET Core application that displays the users of a tenant querying the Microsoft Graph using the identity of the application, instead of on behalf of a user. The sample also illustrates the variation using certificates for authentication. |
|[active-directory-dotnet-daemon-v2](https://github.com/Azure-Samples/active-directory-dotnet-daemon-v2)| ASP.NET MVC | A web application that syncs data from the Microsoft Graph using the identity of the application, instead of on behalf of a user. |
|[ms-identity-javascript-nodejs-console](https://github.com/Azure-Samples/ms-identity-javascript-nodejs-console)| Node.js Console | A Node.js application that displays the users of a tenant by querying the Microsoft Graph using the identity of the application |
