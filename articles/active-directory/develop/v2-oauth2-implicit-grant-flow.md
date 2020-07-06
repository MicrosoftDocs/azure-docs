---
title: OAuth 2.0 implicit grant flow - Microsoft identity platform | Azure
description: Secure single-page apps using Microsoft identity platform implicit flow.
services: active-directory
author: hpsin
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: conceptual
ms.date: 11/19/2019
ms.author: hirsin
ms.reviewer: hirsin
ms.custom: aaddev
---

# Microsoft identity platform and Implicit grant flow

With the Microsoft identity platform endpoint, you can sign users into your single-page apps with both personal and work or school accounts from Microsoft. Single-page and other JavaScript apps that run primarily in a browser face a few interesting challenges when it comes to authentication:

* The security characteristics of these apps are significantly different from traditional server-based web applications.
* Many authorization servers and identity providers do not support CORS requests.
* Full page browser redirects away from the app become particularly invasive to the user experience.

For these applications (Angular, Ember.js, React.js, and so on), Microsoft identity platform supports the OAuth 2.0 Implicit Grant flow. The implicit flow is described in the [OAuth 2.0 Specification](https://tools.ietf.org/html/rfc6749#section-4.2). Its primary benefit is that it allows the app to get tokens from Microsoft identity platform without performing a backend server credential exchange. This allows the app to sign in the user, maintain session, and get tokens to other web APIs all within the client JavaScript code. There are a few important security considerations to take into account when using the implicit flow specifically around [client](https://tools.ietf.org/html/rfc6749#section-10.3) and [user impersonation](https://tools.ietf.org/html/rfc6749#section-10.3).

This article describes how to program directly against the protocol in your application.  When possible, we recommend you use the supported Microsoft Authentication Libraries (MSAL) instead to [acquire tokens and call secured web APIs](authentication-flows-app-scenarios.md#scenarios-and-supported-authentication-flows).  Also take a look at the [sample apps that use MSAL](sample-v2-code.md).

However, if you prefer not to use a library in your single-page app and send protocol messages yourself, follow the general steps below.

## Suitable scenarios for the OAuth2 implicit grant

The OAuth2 specification declares that the implicit grant has been devised to enable user-agent applications – that is to say, JavaScript applications executing within a browser. The defining characteristic of such applications is that JavaScript code is used for accessing server resources (typically a web API) and for updating the application user experience accordingly. Think of applications like Gmail or Outlook Web Access: when you select a message from your inbox, only the message visualization panel changes to display the new selection, while the rest of the page remains unmodified. This characteristic is in contrast with traditional redirect-based Web apps, where every user interaction results in a full page postback and a full page rendering of the new server response.

Applications that take the JavaScript based approach to its extreme are called single-page applications, or SPAs. The idea is that these applications only serve an initial HTML page and associated JavaScript, with all subsequent interactions being driven by web API calls performed via JavaScript. However, hybrid approaches, where the application is mostly postback-driven but performs occasional JS calls, are not uncommon – the discussion about implicit flow usage is relevant for those as well.

Redirect-based applications typically secure their requests via cookies, however, that approach does not work as well for JavaScript applications. Cookies only work against the domain they have been generated for, while JavaScript calls might be directed toward other domains. In fact, that will frequently be the case: think of applications invoking Microsoft Graph API, Office API, Azure API – all residing outside the domain from where the application is served. A growing trend for JavaScript applications is to have no backend at all, relying 100% on third party web APIs to implement their business function.

Currently, the preferred method of protecting calls to a web API is to use the OAuth2 bearer token approach, where every call is accompanied by an OAuth2 access token. The web API examines the incoming access token and, if it finds in it the necessary scopes, it grants access to the requested operation. The implicit flow provides a convenient mechanism for JavaScript applications to obtain access tokens for a web API, offering numerous advantages in respect to cookies:

* Tokens can be reliably obtained without any need for cross origin calls – mandatory registration of the redirect URI to which tokens are return guarantees that tokens are not displaced
* JavaScript applications can obtain as many access tokens as they need, for as many web APIs they target – with no restriction on domains
* HTML5 features like session or local storage grant full control over token caching and lifetime management, whereas cookies management is opaque to the app
* Access tokens aren't susceptible to Cross-site request forgery (CSRF) attacks

The implicit grant flow does not issue refresh tokens, mostly for security reasons. A refresh token isn't as narrowly scoped as access tokens, granting far more power hence inflicting far more damage in case it is leaked out. In the implicit flow, tokens are delivered in the URL, hence the risk of interception is higher than in the authorization code grant.

However, a JavaScript application has another mechanism at its disposal for renewing access tokens without repeatedly prompting the user for credentials. The application can use a hidden iframe to perform new token requests against the authorization endpoint of Azure AD: as long as the browser still has an active session (read: has a session cookie) against the Azure AD domain, the authentication request can successfully occur without any need for user interaction.

This model grants the JavaScript application the ability to independently renew access tokens and even acquire new ones for a new API (provided that the user previously consented for them). This avoids the added burden of acquiring, maintaining, and protecting a high value artifact such as a refresh token. The artifact that makes the silent renewal possible, the Azure AD session cookie, is managed outside of the application. Another advantage of this approach is a user can sign out from Azure AD, using any of the applications signed into Azure AD, running in any of the browser tabs. This results in the deletion of the Azure AD session cookie, and the JavaScript application will automatically lose the ability to renew tokens for the signed out user.

## Is the implicit grant suitable for my app?

The implicit grant presents more risks than other grants, and the areas you need to pay attention to are well documented (for example, [Misuse of Access Token to Impersonate Resource Owner in Implicit Flow][OAuth2-Spec-Implicit-Misuse] and [OAuth 2.0 Threat Model and Security Considerations][OAuth2-Threat-Model-And-Security-Implications]). However, the higher risk profile is largely due to the fact that it is meant to enable applications that execute active code, served by a remote resource to a browser. If you are planning an SPA architecture, have no backend components or intend to invoke a web API via JavaScript, use of the implicit flow for token acquisition is recommended.

If your application is a native client, the implicit flow isn't a great fit. The absence of the Azure AD session cookie in the context of a native client deprives your application from the means of maintaining a long lived session. Which means your application will repeatedly prompt the user when obtaining access tokens for new resources.

If you are developing a Web application that includes a backend, and consuming an API from its backend code, the implicit flow is also not a good fit. Other grants give you far more power. For example, the OAuth2 client credentials grant provides the ability to obtain tokens that reflect the permissions assigned to the application itself, as opposed to user delegations. This means the client has the ability to maintain programmatic access to resources even when a user is not actively engaged in a session, and so on. Not only that, but such grants give higher security guarantees. For instance, access tokens never transit through the user browser, they don't risk being saved in the browser history, and so on. The client application can also perform strong authentication when requesting a token.

[OAuth2-Spec-Implicit-Misuse]: https://tools.ietf.org/html/rfc6749#section-10.16
[OAuth2-Threat-Model-And-Security-Implications]: https://tools.ietf.org/html/rfc6819

## Protocol diagram

The following diagram shows what the entire implicit sign-in flow looks like and the sections that follow describe each step in more detail.

![Diagram showing the implicit sign-in flow](./media/v2-oauth2-implicit-grant-flow/convergence-scenarios-implicit.svg)

## Send the sign-in request

To initially sign the user into your app, you can send an [OpenID Connect](v2-protocols-oidc.md) authentication request and get an `id_token` from the Microsoft identity platform endpoint.

> [!IMPORTANT]
> To successfully request an ID token and/or an access token, the app registration in the [Azure portal - App registrations](https://go.microsoft.com/fwlink/?linkid=2083908) page must have the corresponding implicit grant flow enabled, by selecting **ID tokens** and.or **access tokens** under the **Implicit grant** section. If it's not enabled, an `unsupported_response` error will be returned: **The provided value for the input parameter 'response_type' is not allowed for this client. Expected value is 'code'**

```
// Line breaks for legibility only

https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize?
client_id=6731de76-14a6-49ae-97bc-6eba6914391e
&response_type=id_token
&redirect_uri=http%3A%2F%2Flocalhost%2Fmyapp%2F
&scope=openid
&response_mode=fragment
&state=12345
&nonce=678910
```

> [!TIP]
> To test signing in using the implicit flow, click <a href="https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=6731de76-14a6-49ae-97bc-6eba6914391e&response_type=id_token&redirect_uri=http%3A%2F%2Flocalhost%2Fmyapp%2F&scope=openid&response_mode=fragment&state=12345&nonce=678910" target="_blank">https://login.microsoftonline.com/common/oauth2/v2.0/authorize...</a> After signing in, your browser should be redirected to `https://localhost/myapp/` with an `id_token` in the address bar.
>

| Parameter | Type | Description |
| --- | --- | --- |
| `tenant` | required |The `{tenant}` value in the path of the request can be used to control who can sign into the application. The allowed values are `common`, `organizations`, `consumers`, and tenant identifiers. For more detail, see [protocol basics](active-directory-v2-protocols.md#endpoints). |
| `client_id` | required | The Application (client) ID that the [Azure portal - App registrations](https://go.microsoft.com/fwlink/?linkid=2083908) page assigned to your app. |
| `response_type` | required |Must include `id_token` for OpenID Connect sign-in. It may also include the response_type `token`. Using `token` here will allow your app to receive an access token immediately from the authorize endpoint without having to make a second request to the authorize endpoint. If you use the `token` response_type, the `scope` parameter must contain a scope indicating which resource to issue the token for (for example, user.read on Microsoft Graph).  |
| `redirect_uri` | recommended |The redirect_uri of your app, where authentication responses can be sent and received by your app. It must exactly match one of the redirect_uris you registered in the portal, except it must be url encoded. |
| `scope` | required |A space-separated list of [scopes](v2-permissions-and-consent.md). For OpenID Connect (id_tokens), it must include the scope `openid`, which translates to the "Sign you in" permission in the consent UI. Optionally you may also want to include the `email` and `profile` scopes for gaining access to additional user data. You may also include other scopes in this request for requesting consent to various resources, if an access token is requested. |
| `response_mode` | optional |Specifies the method that should be used to send the resulting token back to your app. Defaults to query for just an access token, but fragment if the request includes an id_token. |
| `state` | recommended |A value included in the request that will also be returned in the token response. It can be a string of any content that you wish. A randomly generated unique value is typically used for [preventing cross-site request forgery attacks](https://tools.ietf.org/html/rfc6749#section-10.12). The state is also used to encode information about the user's state in the app before the authentication request occurred, such as the page or view they were on. |
| `nonce` | required |A value included in the request, generated by the app, that will be included in the resulting id_token as a claim. The app can then verify this value to mitigate token replay attacks. The value is typically a randomized, unique string that can be used to identify the origin of the request. Only required when an id_token is requested. |
| `prompt` | optional |Indicates the type of user interaction that is required. The only valid values at this time are 'login', 'none', 'select_account', and 'consent'. `prompt=login` will force the user to enter their credentials on that request, negating single-sign on. `prompt=none` is the opposite - it will ensure that the user isn't presented with any interactive prompt whatsoever. If the request can't be completed silently via single-sign on, the Microsoft identity platform endpoint will return an error. `prompt=select_account` sends the user to an account picker where all of the accounts remembered in the session will appear. `prompt=consent` will trigger the OAuth consent dialog after the user signs in, asking the user to grant permissions to the app. |
| `login_hint`  |optional |Can be used to pre-fill the username/email address field of the sign in page for the user, if you know their username ahead of time. Often apps will use this parameter during re-authentication, having already extracted the username from a previous sign-in using the `preferred_username` claim.|
| `domain_hint` | optional |If included, it will skip the email-based discovery process that user goes through on the sign in page, leading to a slightly more streamlined user experience. This is commonly used for Line of Business apps that operate in a single tenant, where they will provide a domain name within a given tenant.  This will forward the user to the federation provider for that tenant.  Note that this will prevent guests from signing into this application.  |

At this point, the user will be asked to enter their credentials and complete the authentication. The Microsoft identity platform endpoint will also ensure that the user has consented to the permissions indicated in the `scope` query parameter. If the user has consented to **none** of those permissions, it will ask the user to consent to the required permissions. For more info, see [permissions, consent, and multi-tenant apps](v2-permissions-and-consent.md).

Once the user authenticates and grants consent, the Microsoft identity platform endpoint will return a response to your app at the indicated `redirect_uri`, using the method specified in the `response_mode` parameter.

#### Successful response

A successful response using `response_mode=fragment` and `response_type=id_token+token` looks like the following (with line breaks for legibility):

```HTTP
GET https://localhost/myapp/#
&token_type=Bearer
&expires_in=3599
&id_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik5HVEZ2ZEstZnl0aEV1Q...
&state=12345
```

| Parameter | Description |
| --- | --- |
| `access_token` |Included if `response_type` includes `token`. The access token that the app requested. The access token shouldn't be decoded or otherwise inspected, it should be treated as an opaque string. |
| `token_type` |Included if `response_type` includes `token`. Will always be `Bearer`. |
| `expires_in`|Included if `response_type` includes `token`. Indicates the number of seconds the token is valid, for caching purposes. |
| `scope` |Included if `response_type` includes `token`. Indicates the scope(s) for which the access_token will be valid. May not include all of the scopes requested, if they were not applicable to the user (in the case of Azure AD-only scopes being requested when a personal account is used to log in). |
| `id_token` | A signed JSON Web Token (JWT). The  app can decode the segments of this token to request information about the user who signed in. The  app can cache the values and display them, but it shouldn't rely on them for any authorization or security boundaries. For more information about id_tokens, see the [`id_token reference`](id-tokens.md). <br> **Note:** Only provided if `openid` scope was requested. |
| `state` |If a state parameter is included in the request, the same value should appear in the response. The app should verify that the state values in the request and response are identical. |

#### Error response

Error responses may also be sent to the `redirect_uri` so the app can handle them appropriately:

```HTTP
GET https://localhost/myapp/#
error=access_denied
&error_description=the+user+canceled+the+authentication
```

| Parameter | Description |
| --- | --- |
| `error` |An error code string that can be used to classify types of errors that occur, and can be used to react to errors. |
| `error_description` |A specific error message that can help a developer identify the root cause of an authentication error. |

## Getting access tokens silently in the background

Now that you've signed the user into your single-page app, you can silently get access tokens for calling web APIs secured by Microsoft identity platform, such as the [Microsoft Graph](https://developer.microsoft.com/graph). Even if you already received a token using the `token` response_type, you can use this method to acquire tokens to additional resources without having to redirect the user to sign in again.

In the normal OpenID Connect/OAuth flow, you would do this by making a request to the Microsoft identity platform `/token` endpoint. However, the Microsoft identity platform endpoint does not support CORS requests, so making AJAX calls to get and refresh tokens is out of the question. Instead, you can use the implicit flow in a hidden iframe to get new tokens for other web APIs:

```
// Line breaks for legibility only

https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize?
client_id=6731de76-14a6-49ae-97bc-6eba6914391e
&response_type=token
&redirect_uri=http%3A%2F%2Flocalhost%2Fmyapp%2F
&scope=https%3A%2F%2Fgraph.microsoft.com%2Fuser.read
&response_mode=fragment
&state=12345
&nonce=678910
&prompt=none
&login_hint=myuser@mycompany.com
```

For details on the query parameters in the URL, see [send the sign in request](#send-the-sign-in-request).

> [!TIP]
> Try copy & pasting the below request into a browser tab! (Don't forget to replace the `login_hint` values with the correct value for your user)
>
>`https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=6731de76-14a6-49ae-97bc-6eba6914391e&response_type=token&redirect_uri=http%3A%2F%2Flocalhost%2Fmyapp%2F&scope=https%3A%2F%2Fgraph.microsoft.com%2Fuser.read&response_mode=fragment&state=12345&nonce=678910&prompt=none&login_hint={your-username}`
>

Thanks to the `prompt=none` parameter, this request will either succeed or fail immediately and return to your application. A successful response will be sent to your app at the indicated `redirect_uri`, using the method specified in the `response_mode` parameter.

#### Successful response

A successful response using `response_mode=fragment` looks like:

```HTTP
GET https://localhost/myapp/#
access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik5HVEZ2ZEstZnl0aEV1Q...
&state=12345
&token_type=Bearer
&expires_in=3599
&scope=https%3A%2F%2Fgraph.microsoft.com%2Fdirectory.read
```

| Parameter | Description |
| --- | --- |
| `access_token` |Included if `response_type` includes `token`. The access token that the app requested, in this case for the Microsoft Graph. The access token shouldn't be decoded or otherwise inspected, it should be treated as an opaque string. |
| `token_type` | Will always be `Bearer`. |
| `expires_in` | Indicates the number of seconds the token is valid, for caching purposes. |
| `scope` | Indicates the scope(s) for which the access_token will be valid. May not include all of the scopes requested, if they were not applicable to the user (in the case of Azure AD-only scopes being requested when a personal account is used to log in). |
| `id_token` | A signed JSON Web Token (JWT). Included if `response_type` includes `id_token`. The  app can decode the segments of this token to request information about the user who signed in. The  app can cache the values and display them, but it shouldn't rely on them for any authorization or security boundaries. For more information about id_tokens, see the [`id_token` reference](id-tokens.md). <br> **Note:** Only provided if `openid` scope was requested. |
| `state` |If a state parameter is included in the request, the same value should appear in the response. The app should verify that the state values in the request and response are identical. |

#### Error response

Error responses may also be sent to the `redirect_uri` so the app can handle them appropriately. In the case of `prompt=none`, an expected error will be:

```HTTP
GET https://localhost/myapp/#
error=user_authentication_required
&error_description=the+request+could+not+be+completed+silently
```

| Parameter | Description |
| --- | --- |
| `error` |An error code string that can be used to classify types of errors that occur, and can be used to react to errors. |
| `error_description` |A specific error message that can help a developer identify the root cause of an authentication error. |

If you receive this error in the iframe request, the user must interactively sign in again to retrieve a new token. You can choose to handle this case in whatever way makes sense for your application.

## Refreshing tokens

The implicit grant does not provide refresh tokens. Both `id_token`s and `access_token`s will expire after a short period of time, so your app must be prepared to refresh these tokens periodically. To refresh either type of token, you can perform the same hidden iframe request from above using the `prompt=none` parameter to control the identity platform's behavior. If you want to receive a new `id_token`, be sure to use `id_token` in the `response_type` and `scope=openid`, as well as a `nonce` parameter.

## Send a sign out request

The OpenID Connect `end_session_endpoint` allows your app to send a request to the Microsoft identity platform endpoint to end a user's session and clear cookies set by the Microsoft identity platform endpoint. To fully sign a user out of a web application, your app should end its own session with the user (usually by clearing a token cache or dropping cookies), and then redirect the browser to:

```
https://login.microsoftonline.com/{tenant}/oauth2/v2.0/logout?post_logout_redirect_uri=https://localhost/myapp/
```

| Parameter | Type | Description |
| --- | --- | --- |
| `tenant` |required |The `{tenant}` value in the path of the request can be used to control who can sign into the application. The allowed values are `common`, `organizations`, `consumers`, and tenant identifiers. For more detail, see [protocol basics](active-directory-v2-protocols.md#endpoints). |
| `post_logout_redirect_uri` | recommended | The URL that the user should be returned to after logout completes. This value must match one of the redirect URIs registered for the application. If not included, the user will be shown a generic message by the Microsoft identity platform endpoint. |

## Next steps

* Go over the [MSAL JS samples](sample-v2-code.md) to get started coding.

[OAuth2-Spec-Implicit-Misuse]: https://tools.ietf.org/html/rfc6749#section-10.16
[OAuth2-Threat-Model-And-Security-Implications]: https://tools.ietf.org/html/rfc6819
