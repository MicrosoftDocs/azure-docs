---
title: OpenID Connect (OIDC) on the Microsoft identity platform
description: Sign in Microsoft Entra users by using the Microsoft identity platform's implementation of the OpenID Connect extension to OAuth 2.0.
author: OwenRichards1
manager: CelesteDG
ms.custom: aaddev, identityplatformtop40
ms.date: 09/13/2023
ms.author: owenrichards
ms.reviewer: ludwignick
ms.service: active-directory
ms.subservice: develop
ms.topic: reference
---

# OpenID Connect on the Microsoft identity platform

OpenID Connect (OIDC) extends the OAuth 2.0 authorization protocol for use as an additional authentication protocol. You can use OIDC to enable single sign-on (SSO) between your OAuth-enabled applications by using a security token called an *ID token*. 

The full specification for OIDC is available on the OpenID Foundation's website at [OpenID Connect Core 1.0 specification](https://openid.net/specs/openid-connect-core-1_0.html).

## Protocol flow: Sign-in

The following diagram shows the basic OpenID Connect sign-in flow. The steps in the flow are described in more detail in later sections of the article.

![Swim-lane diagram showing the OpenID Connect protocol's sign-in flow.](./media/v2-protocols-oidc/convergence-scenarios-webapp.svg)

[!INCLUDE [try-in-postman-link](includes/try-in-postman-link.md)]

## Enable ID tokens

The *ID token* introduced by OpenID Connect is issued by the authorization server, the Microsoft identity platform, when the client application requests one during user authentication. The ID token enables a client application to verify the identity of the user and to get other information (claims) about them.

ID tokens aren't issued by default for an application registered with the Microsoft identity platform. ID tokens for an application are enabled by using one of the following methods:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com).
1. Browse to **Identity** > **Applications** > **App registrations** > *\<your application\>* > **Authentication**.
1. Under **Platform configurations**, select **Add a platform**. 
1. In the pane that opens, select the appropriate platform for your application. For example, select **Web** for a web application.
1. Under Redirect URIs, add the redirect URI of your application. For example, `https://localhost:8080/`.
1. Under **Implicit grant and hybrid flows**, select the **ID tokens (used for implicit and hybrid flows)** checkbox.

Or:

1. Select **Identity** > **Applications** > **App registrations** > *\<your application\>* > **Manifest**.
1. Set `oauth2AllowIdTokenImplicitFlow` to `true` in the app registration's [application manifest](reference-app-manifest.md).

If ID tokens are not enabled for your app and one is requested, the Microsoft identity platform returns an `unsupported_response` error similar to:

> *The provided value for the input parameter 'response_type' isn't allowed for this client. Expected value is 'code'*.

Requesting an ID token by specifying a `response_type` of `id_token` is explained in [Send the sign-in request](#send-the-sign-in-request) later in the article.

## Fetch the OpenID configuration document

OpenID providers like the Microsoft identity platform provide an [OpenID Provider Configuration Document](https://openid.net/specs/openid-connect-discovery-1_0.html) at a publicly accessible endpoint containing the provider's OIDC endpoints, supported claims, and other metadata. Client applications can use the metadata to discover the URLs to use for authentication and the authentication service's public signing keys.

Authentication libraries are the most common consumers of the OpenID configuration document, which they use for discovery of authentication URLs, the provider's public signing keys, and other service metadata. If an authentication library is used in your app, you likely won't need to hand-code requests to and responses from the OpenID configuration document endpoint.

### Find your app's OpenID configuration document URI

Every app registration in Microsoft Entra ID is provided a publicly accessible endpoint that serves its OpenID configuration document. To determine the URI of the configuration document's endpoint for your app, append the *well-known OpenID configuration* path to your app registration's *authority URL*.

* Well-known configuration document path: `/.well-known/openid-configuration`
* Authority URL: `https://login.microsoftonline.com/{tenant}/v2.0`

The value of `{tenant}` varies based on the application's sign-in audience as shown in the following table. The authority URL also varies by [cloud instance](authentication-national-cloud.md#azure-ad-authentication-endpoints).

| Value | Description |
| --- | --- |
| `common` |Users with both a personal Microsoft account and a work or school account from Microsoft Entra ID can sign in to the application. |
| `organizations` |Only users with work or school accounts from Microsoft Entra ID can sign in to the application. |
| `consumers` |Only users with a personal Microsoft account can sign in to the application. |
| `8eaef023-2b34-4da1-9baa-8bc8c9d6a490` or `contoso.onmicrosoft.com` | Only users from a specific Microsoft Entra tenant (directory members with a work or school account or directory guests with a personal Microsoft account) can sign in to the application. <br/><br/>The value can be the domain name of the Microsoft Entra tenant or the tenant ID in GUID format. You can also use the consumer tenant GUID, `9188040d-6c67-4c5b-b112-36a304b66dad`, in place of `consumers`.  |

> [!TIP]
> Note that when using the `common` or `consumers` authority for personal Microsoft accounts, the consuming resource application must be configured to support such type of accounts in accordance with [signInAudience](./supported-accounts-validation.md).

To find the OIDC configuration document in the Microsoft Entra admin center, sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) and then:

1. Browse to **Identity** > **Applications** > **App registrations** > *\<your application\>* > **Endpoints**.
1. Locate the URI under **OpenID Connect metadata document**.

### Sample request

The following request gets the OpenID configuration metadata from the `common` authority's OpenID configuration document endpoint on the Azure public cloud:

```http
GET /common/v2.0/.well-known/openid-configuration
Host: login.microsoftonline.com
```

> [!TIP]
> Try it! To see the OpenID configuration document for an application's `common` authority, navigate to [https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration](https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration).

### Sample response

The configuration metadata is returned in JSON format as shown in the following example (truncated for brevity). The metadata returned in the JSON response is described in detail in the [OpenID Connect 1.0 discovery specification](https://openid.net/specs/openid-connect-discovery-1_0.html#rfc.section.4.2).

```json
{
  "authorization_endpoint": "https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize",
  "token_endpoint": "https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token",
  "token_endpoint_auth_methods_supported": [
    "client_secret_post",
    "private_key_jwt"
  ],
  "jwks_uri": "https://login.microsoftonline.com/{tenant}/discovery/v2.0/keys",
  "userinfo_endpoint": "https://graph.microsoft.com/oidc/userinfo",
  "subject_types_supported": [
      "pairwise"
  ],
  ...
}
```
## Send the sign-in request

To authenticate a user and request an ID token for use in your application, direct their user-agent to the Microsoft identity platform's _/authorize_ endpoint. The request is similar to the first leg of the [OAuth 2.0 authorization code flow](v2-oauth2-auth-code-flow.md) but with these distinctions:

* Include the `openid` scope in the `scope` parameter.
* Specify `id_token` in the `response_type` parameter.
* Include the `nonce` parameter.

Example sign-in request (line breaks included only for readability):

```HTTP
GET https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize?
client_id=6731de76-14a6-49ae-97bc-6eba6914391e
&response_type=id_token
&redirect_uri=http%3A%2F%2Flocalhost%2Fmyapp%2F
&response_mode=form_post
&scope=openid
&state=12345
&nonce=678910
```

| Parameter | Condition | Description |
| --- | --- | --- |
| `tenant` | Required | You can use the `{tenant}` value in the path of the request to control who can sign in to the application. The allowed values are `common`, `organizations`, `consumers`, and tenant identifiers. For more information, see [protocol basics](./v2-protocols.md#endpoints). Critically, for guest scenarios where you sign a user from one tenant into another tenant, you *must* provide the tenant identifier to correctly sign them into the resource tenant.|
| `client_id` | Required | The **Application (client) ID** that the [Microsoft Entra admin center – App registrations](https://go.microsoft.com/fwlink/?linkid=2083908) experience assigned to your app. |
| `response_type` | Required | Must include `id_token` for OpenID Connect sign-in. |
| `redirect_uri` | Recommended | The redirect URI of your app, where authentication responses can be sent and received by your app. It must exactly match one of the redirect URIs you registered in the portal, except that it must be URL-encoded. If not present, the endpoint will pick one registered `redirect_uri` at random to send the user back to. |
| `scope` | Required | A space-separated list of scopes. For OpenID Connect, it must include the scope `openid`, which translates to the **Sign you in** permission in the consent UI. You might also include other scopes in this request for requesting consent. |
| `nonce` | Required | A value generated and sent by your app in its request for an ID token. The same `nonce` value is included in the ID token returned to your app by the Microsoft identity platform. To mitigate token replay attacks, your app should verify the `nonce` value in the ID token is the same value it sent when requesting the token. The value is typically a unique, random string. |
| `response_mode` | Recommended | Specifies the method that should be used to send the resulting authorization code back to your app. Can be `form_post` or `fragment`. For web applications, we recommend using `response_mode=form_post`, to ensure the most secure transfer of tokens to your application. |
| `state` | Recommended | A value included in the request that also will be returned in the token response. It can be a string of any content you want. A randomly generated unique value typically is used to [prevent cross-site request forgery attacks](https://tools.ietf.org/html/rfc6749#section-10.12). The state also is used to encode information about the user's state in the app before the authentication request occurred, such as the page or view the user was on. |
| `prompt` | Optional | Indicates the type of user interaction that is required. The only valid values at this time are `login`, `none`, `consent`, and `select_account`. The `prompt=login` claim forces the user to enter their credentials on that request, which negates single sign-on. The `prompt=none` parameter is the opposite, and should be paired with a `login_hint` to indicate which user must be signed in. These parameters ensure that the user isn't presented with any interactive prompt at all. If the request can't be completed silently via single sign-on, the Microsoft identity platform returns an error. Causes include no signed-in user, the hinted user isn't signed in, or multiple users are signed in but no hint was provided. The `prompt=consent` claim triggers the OAuth consent dialog after the user signs in. The dialog asks the user to grant permissions to the app. Finally, `select_account` shows the user an account selector, negating silent SSO but allowing the user to pick which account they intend to sign in with, without requiring credential entry. You can't use both `login_hint` and `select_account`.|
| `login_hint` | Optional | You can use this parameter to pre-fill the username and email address field of the sign-in page for the user, if you know the username ahead of time. Often, apps use this parameter during reauthentication, after already extracting the `login_hint` [optional claim](./optional-claims.md) from an earlier sign-in. |
| `domain_hint` | Optional | The realm of the user in a federated directory.  This skips the email-based discovery process that the user goes through on the sign-in page, for a slightly more streamlined user experience. For tenants that are federated through an on-premises directory like AD FS, this often results in a seamless sign-in because of the existing login session. |

At this point, the user is prompted to enter their credentials and complete the authentication. The Microsoft identity platform verifies that the user has consented to the permissions indicated in the `scope` query parameter. If the user hasn't consented to any of those permissions, the Microsoft identity platform prompts the user to consent to the required permissions. You can read more about [permissions, consent, and multi-tenant apps](./permissions-consent-overview.md).

After the user authenticates and grants consent, the Microsoft identity platform returns a response to your app at the indicated redirect URI by using the method specified in the `response_mode` parameter.

### Successful response

A successful response when you use `response_mode=form_post` is similar to:

```HTTP
POST /myapp/ HTTP/1.1
Host: localhost
Content-Type: application/x-www-form-urlencoded

id_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik1uQ19WWmNB...&state=12345
```

| Parameter | Description |
| --- | --- |
| `id_token` | The ID token that the app requested. You can use the `id_token` parameter to verify the user's identity and begin a session with the user. For more information about ID tokens and their contents, see the [ID token reference](id-token-claims-reference.md). |
| `state` | If a `state` parameter is included in the request, the same value should appear in the response. The app should verify that the state values in the request and response are identical. |

### Error response

Error responses might also be sent to the redirect URI so the app can handle them, for example:

```HTTP
POST /myapp/ HTTP/1.1
Host: localhost
Content-Type: application/x-www-form-urlencoded

error=access_denied&error_description=the+user+canceled+the+authentication
```

| Parameter | Description |
| --- | --- |
| `error` | An error code string that you can use to classify types of errors that occur, and to react to errors. |
| `error_description` | A specific error message that can help you identify the root cause of an authentication error. |

### Error codes for authorization endpoint errors

The following table describes error codes that can be returned in the `error` parameter of the error response:

| Error code | Description | Client action |
| --- | --- | --- |
| `invalid_request` | Protocol error like a missing required parameter. |Fix and resubmit the request. This development error should be caught during application testing. |
| `unauthorized_client` | The client application can't request an authorization code. |This error can occur when the client application isn't registered in Microsoft Entra ID or isn't added to the user's Microsoft Entra tenant. The application can prompt the user with instructions to install the application and add it to Microsoft Entra ID. |
| `access_denied` | The resource owner denied consent. |The client application can notify the user that it can't proceed unless the user consents. |
| `unsupported_response_type` |The authorization server doesn't support the response type in the request. |Fix and resubmit the request. This development error should be caught during application testing. |
| `server_error` | The server encountered an unexpected error. |Retry the request. These errors can result from temporary conditions. The client application might explain to the user that its response is delayed because of a temporary error. |
| `temporarily_unavailable` | The server is temporarily too busy to handle the request. |Retry the request. The client application might explain to the user that its response is delayed because of a temporary condition. |
| `invalid_resource` | The target resource is invalid because it doesn't exist, Microsoft Entra ID can't find it, or it's configured incorrectly. |This error indicates that the resource, if it exists, hasn't been configured in the tenant. The application can prompt the user with instructions for installing the application and adding it to Microsoft Entra ID. |

## Validate the ID token

Receiving an ID token in your app might not always be sufficient to fully authenticate the user. You might also need to validate the ID token's signature and verify its claims per your app's requirements. Like all OpenID providers, the Microsoft identity platform's ID tokens are [JSON Web Tokens (JWTs)](https://tools.ietf.org/html/rfc7519) signed by using public key cryptography.

Web apps and web APIs that use ID tokens for authorization must validate them because such applications get access to data. Other types of application might not benefit from ID token validation, however. Native and single-page apps (SPAs), for example, rarely benefit from ID token validation because any entity with physical access to the device or browser can potentially bypass the validation.

Two examples of token validation bypass are:

* Providing fake tokens or keys by modifying network traffic to the device
* Debugging the application and stepping over the validation logic during program execution.

If you validate ID tokens in your application, we recommend *not* doing so manually. Instead, use a token validation library to parse and validate tokens. Token validation libraries are available for most development languages, frameworks, and platforms.

### What to validate in an ID token

In addition to validating ID token's signature, you should validate several of its claims as described in [Validating an ID token](id-tokens.md#validate-tokens). Also see [Important information about signing key-rollover](./signing-key-rollover.md).

Several other validations are common and vary by application scenario, including:

* Ensuring the user/organization has signed up for the app.
* Ensuring the user has proper authorization/privileges
* Ensuring a certain strength of authentication has occurred, such as [multi-factor authentication](../authentication/concept-mfa-howitworks.md).

Once you've validated the ID token, you can begin a session with the user and use the information in the token's claims for app personalization, display, or for storing their data.

## Protocol diagram: Access token acquisition

Many applications need not only to sign in a user, but also access a protected resource like a web API on behalf of the user. This scenario combines OpenID Connect to get an ID token for authenticating the user and OAuth 2.0 to get an access token for a protected resource.

The full OpenID Connect sign-in and token acquisition flow looks similar to this diagram:

![OpenID Connect  protocol: Token acquisition](./media/v2-protocols-oidc/convergence-scenarios-webapp-webapi.svg)

## Get an access token for the UserInfo endpoint

In addition to the ID token, the authenticated user's information is also made available at the OIDC [UserInfo endpoint](userinfo.md).

To get an access token for the OIDC UserInfo endpoint, modify the sign-in request as described here:

```HTTP
// Line breaks are for legibility only.

GET https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize?
client_id=6731de76-14a6-49ae-97bc-6eba6914391e        // Your app registration's Application (client) ID
&response_type=id_token%20token                       // Requests both an ID token and access token
&redirect_uri=http%3A%2F%2Flocalhost%2Fmyapp%2F       // Your application's redirect URI (URL-encoded)
&response_mode=form_post                              // 'form_post' or 'fragment'
&scope=openid+profile+email                           // 'openid' is required; 'profile' and 'email' provide information in the UserInfo endpoint as they do in an ID token. 
&state=12345                                          // Any value - provided by your app
&nonce=678910                                         // Any value - provided by your app
```

You can use the [authorization code flow](v2-oauth2-auth-code-flow.md), the [device code flow](v2-oauth2-device-code.md), or a [refresh token](v2-oauth2-auth-code-flow.md#refresh-the-access-token) in place of `response_type=token` to get an access token for your app.

<!-- UNCOMMENT WHEN/IF THE TEST APP REGISTRATION IS RE-ENABLED -->
<!--
> [!TIP]
> Click the following link to execute this request. After you sign in, your browser is redirected to `https://localhost/myapp/`, with an ID token and a token in the address bar. Note that this request uses `response_mode=fragment` for demonstration purposes only - for a webapp we recommend using `form_post` for additional security where possible. 
> <a href="https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=6731de76-14a6-49ae-97bc-6eba6914391e&response_type=id_token%20token&redirect_uri=http%3A%2F%2Flocalhost%2Fmyapp%2F&response_mode=fragment&scope=openid+profile+email&state=12345&nonce=678910" target="_blank">https://login.microsoftonline.com/common/oauth2/v2.0/authorize...</a>
-->

### Successful token response

A successful response from using `response_mode=form_post`:

```HTTP
POST /myapp/ HTTP/1.1
Host: localhost
Content-Type: application/x-www-form-urlencoded
 access_token=eyJ0eXAiOiJKV1QiLCJub25jZSI6I....
 &token_type=Bearer
 &expires_in=3598
 &scope=email+openid+profile
 &id_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI....
 &state=12345
```

Response parameters mean the same thing regardless of the flow used to acquire them.

| Parameter | Description |
| --- | --- |
| `access_token` | The token that will be used to call the UserInfo endpoint.|
| `token_type` | Always "Bearer" |
| `expires_in`| How long until the access token expires, in seconds. |
| `scope` | The permissions granted on the access token. Because the UserInfo endpoint is hosted on Microsoft Graph, it's possible for `scope` to contain others previously granted to the application (for example, `User.Read`). |
| `id_token` | The ID token that the app requested. You can use the ID token to verify the user's identity and begin a session with the user. You'll find more details about ID tokens and their contents in the [ID token reference](id-token-claims-reference.md). |
| `state` | If a state parameter is included in the request, the same value should appear in the response. The app should verify that the state values in the request and response are identical. |

[!INCLUDE [remind-not-to-validate-access-tokens](includes/remind-not-to-validate-access-tokens.md)]

### Error response

Error responses might also be sent to the redirect URI so that the app can handle them appropriately:

```HTTP
POST /myapp/ HTTP/1.1
Host: localhost
Content-Type: application/x-www-form-urlencoded

error=access_denied&error_description=the+user+canceled+the+authentication
```

| Parameter | Description |
| --- | --- |
| `error` | An error code string that you can use to classify types of errors that occur, and to react to errors. |
| `error_description` | A specific error message that can help you identify the root cause of an authentication error. |

For a description of possible error codes and recommended client responses, see [Error codes for authorization endpoint errors](#error-codes-for-authorization-endpoint-errors).

When you have an authorization code and an ID token, you can sign the user in and get access tokens on their behalf. To sign the user in, you must validate the ID token as described in the [validate tokens](id-tokens.md#validate-tokens). To get access tokens, follow the steps described in [OAuth code flow documentation](v2-oauth2-auth-code-flow.md#redeem-a-code-for-an-access-token).

### Calling the UserInfo endpoint

Review the [UserInfo documentation](userinfo.md#calling-the-api) to look over how to call the UserInfo endpoint with this token.

## Send a sign-out request

To sign out a user, perform both of these operations:

* Redirect the user's user-agent to the Microsoft identity platform's logout URI
* Clear your app's cookies or otherwise end the user's session in your application.

If you fail to perform either operation, the user may remain authenticated and not be prompted to sign-in the next time they use your app.

Redirect the user-agent to the `end_session_endpoint` as shown in the OpenID Connect configuration document. The `end_session_endpoint` supports both HTTP GET and POST requests.

```HTTP
GET https://login.microsoftonline.com/common/oauth2/v2.0/logout?
post_logout_redirect_uri=http%3A%2F%2Flocalhost%2Fmyapp%2F
```

| Parameter | Condition | Description |
| ----------------------- | ------------------------------- | ------------ |
| `post_logout_redirect_uri` | Recommended | The URL that the user is redirected to after successfully signing out. If the parameter isn't included, the user is shown a generic message that's generated by the Microsoft identity platform. This URL must match one of the redirect URIs registered for your application in the app registration portal. |
| `logout_hint` | Optional | Enables sign-out to occur without prompting the user to select an account. To use `logout_hint`, enable the `login_hint` [optional claim](./optional-claims.md) in your client application and use the value of the `login_hint` optional claim as the `logout_hint` parameter. Don't use UPNs or phone numbers as the value of the `logout_hint` parameter. 

> [!NOTE]
> After successful sign-out, the active sessions will be set to inactive. If a valid Primary Refresh Token (PRT) exists for the signed-out user and a new sign-in is executed, SSO will be interrupted and user will see a prompt with an account picker. If the option selected is the connected account that refers to the PRT, sign-in will proceed automatically without the need to insert fresh credentials.  

## Single sign-out

When you redirect the user to the `end_session_endpoint`, the Microsoft identity platform clears the user's session from the browser. However, the user may still be signed in to other applications that use Microsoft accounts for authentication. To enable those applications to sign the user out simultaneously, the Microsoft identity platform sends an HTTP GET request to the registered `LogoutUrl` of all the applications that the user is currently signed in to. Applications must respond to this request by clearing any session that identifies the user and returning a `200` response. If you wish to support single sign-out in your application, you must implement such a `LogoutUrl` in your application's code. You can set the `LogoutUrl` from the app registration portal.

## Next steps

* Review the [UserInfo endpoint documentation](userinfo.md).
* [Populate claim values in a token](./saml-claims-customization.md) with data from on-premises systems. 
* [Include your own claims in tokens](./optional-claims.md).
