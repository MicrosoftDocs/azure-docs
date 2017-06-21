---
title: 'Azure Active Directory B2C: Single-page apps using implicit flow | Microsoft Docs'
description: Learn how to build single-page apps directly by using OAuth 2.0 implicit flow.
services: active-directory-b2c
documentationcenter: ''
author: parakhj
manager: krassk
editor: parakhj

ms.assetid: a45cc74c-a37e-453f-b08b-af75855e0792
ms.service: active-directory-b2c
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/06/2017
ms.author: parakhj

---
# Azure Active Directory B2C: Sign-in for single-page apps by using OAuth 2.0 implicit flow

> [!NOTE]
> This feature is in preview.
> 

Many modern apps have a single-page app front end that primarily is written in JavaScript. Often, the app is written by using a framework like AngularJS, Ember.js, or Durandal. Single-page apps and other JavaScript apps that run primarily in a browser have a few interesting challenges for authentication:

* The security characteristics of these apps are significantly different from traditional server-based web applications.
* Many authorization servers and identity providers do not support cross-origin resource sharing (CORS) requests.
* Full-page browser redirects away from the app can be significantly invasive to the user experience.

To support these applications, Azure Active Directory (Azure AD) B2C uses the OAuth 2.0 implicit flow. The OAuth 2.0 authorization implicit grant flow is described in [section 4.2 of the OAuth 2.0 specification](http://tools.ietf.org/html/rfc6749). In this flow, the app receives tokens directly from the Azure AD authorize endpoint, without any server-to-server exchanges. All authentication logic and session handling takes place entirely in the JavaScript client, without additional page redirects.

Azure AD B2C extends the standard OAuth 2.0 implicit flow to do more than simple authentication and authorization. It introduces the [policy parameter](active-directory-b2c-reference-policies.md), through which you can use OAuth 2.0 to add user experiences to your app, such as sign-up, sign-in, and profile management. In this article, we show how to use the implicit flow and Azure AD to implement each of these experiences in your single-page applications. To help you get started, see our [Node.js](https://github.com/Azure-Samples/active-directory-b2c-javascript-singlepageapp-nodejs-webapi) and [Microsoft .NET](https://github.com/Azure-Samples/active-directory-b2c-javascript-singlepageapp-dotnet-webapi) samples.

In the example HTTP requests in this article, we use our sample Azure AD B2C directory, **fabrikamb2c.onmicrosoft.com**. We also use our sample application and policies. You can try the requests yourself by using these values, or you can replace them with your own values.
Learn how to [get your own Azure AD B2C directory, application, and policies](#use-your-own-b2c-tenant).


## Protocol diagram

The implicit sign-in flow looks something like the following figure. Each step is described in detail later in the article.

![OpenID Connect swimlanes](../media/active-directory-v2-flows/convergence_scenarios_implicit.png)

## Send authentication requests
When your web app needs to authenticate the user and execute a policy, it directs the user to the `/authorize` endpoint. This is the interactive portion of the flow, where the user takes action, depending on the policy. The user gets an ID token from the Azure AD endpoint.

In this request, the client indicates in the `scope` parameter the permissions that it needs to acquire from the user. In the `p` parameter, it indicates the policy to execute. The following three examples (with line breaks for readability) each use a different policy. To get a feel for how each request works, try pasting the request into a browser and running it.

### Use a sign-in policy
```
GET https://login.microsoftonline.com/fabrikamb2c.onmicrosoft.com/oauth2/v2.0/authorize?
client_id=90c0fe63-bcf2-44d5-8fb7-b8bbc0b29dc6
&response_type=id_token+token
&redirect_uri=https%3A%2F%2Faadb2cplayground.azurewebsites.net%2F
&response_mode=fragment
&scope=openid%20offline_access
&state=arbitrary_data_you_can_receive_in_the_response
&nonce=12345
&p=b2c_1_sign_in
```

### Use a sign-up policy
```
GET https://login.microsoftonline.com/fabrikamb2c.onmicrosoft.com/oauth2/v2.0/authorize?
client_id=90c0fe63-bcf2-44d5-8fb7-b8bbc0b29dc6
&response_type=id_token+token
&redirect_uri=https%3A%2F%2Faadb2cplayground.azurewebsites.net%2F
&response_mode=fragment
&scope=openid%20offline_access
&state=arbitrary_data_you_can_receive_in_the_response
&nonce=12345
&p=b2c_1_sign_up
```

### Use an edit-profile policy
```
GET https://login.microsoftonline.com/fabrikamb2c.onmicrosoft.com/oauth2/v2.0/authorize?
client_id=90c0fe63-bcf2-44d5-8fb7-b8bbc0b29dc6
&response_type=id_token+token
&redirect_uri=https%3A%2F%2Faadb2cplayground.azurewebsites.net%2F
&response_mode=fragment
&scope=openid%20offline_access
&state=arbitrary_data_you_can_receive_in_the_response
&nonce=12345
&p=b2c_1_edit_profile
```

| Parameter | Required? | Description |
| --- | --- | --- |
| client_id |Required |The application ID assigned to your app in the [Azure portal](https://portal.azure.com). |
| response_type |Required |Must include `id_token` for OpenID Connect sign-in. It also can include the response type `token`. If you use `token`, your app can receive an access token immediately from the authorize endpoint without having to make a second request to the authorize endpoint.  If you use the `token` response type, the `scope` parameter must contain a scope that indicates which resource to issue the token for. |
| redirect_uri |Recommended |The redirect URI of your app, where authentication responses can be sent and received by your app. It must exactly match one of the redirect URIs that you registered in the portal, except that it must be URL-encoded. |
| response_mode |Recommended |Specifies the method to use to send the resulting token back to your app.  For the implicit flows, use `fragment`. |
| scope |Required |A space-separated list of scopes. A single scope value indicates to Azure AD both of the permissions that are being requested. The `openid` scope indicates a permission to sign in the user and get data about the user in the form of ID tokens. (We'll talk about this more later in the article.) The `offline_access` scope is optional for web apps. It indicates that your app needs a refresh token for long-lived access to resources. |
| state |Recommended |A value included in the request that also is returned in the token response. It can be a string of any content that you want to use. Usually, a randomly generated, unique value is used, to prevent cross-site request forgery attacks. The state is also used to encode information about the user's state in the app before the authentication request occurred, like the page they were on. |
| nonce |Required |A value included in the request (generated by the app) that is included in the resulting ID token as a claim. The app can then verify this value to mitigate token replay attacks. Usually, the value is a randomized, unique string that can be used to identify the origin of the request. |
| p |Required |The policy to executed. It's the name of a policy that is created in your Azure AD B2C tenant. The policy name value should begin with **b2c\_1\_**. For more information, see [Azure AD B2C built-in policies](active-directory-b2c-reference-policies.md). |
| prompt |Optional |The type of user interaction that's required. Currently, the only valid value is `login`. This forces the user to enter their credentials on that request. Single sign-on will not take effect. |

At this point, the user is asked to complete the policy's workflow. This might involve the user entering their username and password, signing in with a social identity, signing up for the directory, or any other number of steps. User actions depend on how the policy is defined.

After the user completes the policy, Azure AD returns a response to your app at the value you used for `redirect_uri`. It uses the method specified in the `response_mode` parameter. The response is exactly the same for each of the user action scenarios, independent of the policy that was executed.

### Successful response
A successful response that uses `response_mode=fragment` and `response_type=id_token+token` looks like the following, with line breaks for legibility:

```
GET https://aadb2cplayground.azurewebsites.net/#
access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik5HVEZ2ZEstZnl0aEV1Q...
&token_type=Bearer
&expires_in=3599
&scope="90c0fe63-bcf2-44d5-8fb7-b8bbc0b29dc6 offline_access",
&id_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik5HVEZ2ZEstZnl0aEV1Q...
&state=arbitrary_data_you_sent_earlier
```

| Parameter | Description |
| --- | --- |
| access_token |The access token that the app requested.  The access token should not be decoded or otherwise inspected. It can be treated as an opaque string. |
| token_type |The token type value. The only type that Azure AD supports is Bearer. |
| expires_in |The length of time that the access token is valid (in seconds). |
| scope |The scopes that the token is valid for. You also can use scopes to cache tokens for later use. |
| id_token |The ID token that the app requested. You can use the ID token to verify the user's identity and begin a session with the user. For more information about ID tokens and their contents, see the [Azure AD B2C token reference](active-directory-b2c-reference-tokens.md). |
| state |If a `state` parameter is included in the request, the same value should appear in the response. The app should verify that the `state` values in the request and response are identical. |

### Error response
Error responses might also be sent to the redirect URI so the app can handle them appropriately:

```
GET https://aadb2cplayground.azurewebsites.net/#
error=access_denied
&error_description=the+user+canceled+the+authentication
&state=arbitrary_data_you_can_receive_in_the_response
```

| Parameter | Description |
| --- | --- |
| error |An error code string used to classify types of errors that occur. You also can use the error code for error handling. |
| error_description |A specific error message that can help you identify the root cause of an authentication error. |
| state |See the full description in the preceding table. If a `state` parameter is included in the request, the same value should appear in the response. The app should verify that the `state` values in the request and response are identical.|

## Validate the ID token
Just receiving an ID token is not enough to authenticate the user. You must validate the ID token's signature and verify the claims in the token per your app's requirements. Azure AD B2C uses [JSON Web Tokens (JWTs)](http://self-issued.info/docs/draft-ietf-oauth-json-web-token.html) and public key cryptography to sign tokens and verify that they are valid.

Many open-source libraries are available for validating JWTs, depending on the language you prefer. Consider exploring those options rather than implementing your own validation logic. You can use the information in this article to help you figure out how to properly use those libraries.

Azure AD B2C has an OpenID Connect metadata endpoint, with which an app can fetch information about Azure AD B2C at runtime. This information includes endpoints, token contents, and token signing keys. There is a JSON metadata document for each policy in your Azure AD B2C tenant. For example, the metadata document for the b2c_1_sign_in policy in the fabrikamb2c.onmicrosoft.com tenant is located at:

`https://login.microsoftonline.com/fabrikamb2c.onmicrosoft.com/v2.0/.well-known/openid-configuration?p=b2c_1_sign_in`

One of the properties of this configuration document is the `jwks_uri`, whose value for the same policy would be:

`https://login.microsoftonline.com/fabrikamb2c.onmicrosoft.com/discovery/v2.0/keys?p=b2c_1_sign_in`.

To determine which policy was used in signing an ID token (and where to fetch the metadata from), you have two options. First, the policy name is included in the `acr` claim in `id_token`. For information about how to parse the claims from an ID token, see the [Azure AD B2C token reference](active-directory-b2c-reference-tokens.md). Your other option is to encode the policy in the value of the `state` parameter when you issue the request. Then, decode it to determine which policy was used. Either method is perfectly valid.

After you've acquired the metadata document from the OpenID Connect metadata endpoint, you can use the RSA-256 public keys (which are located at this endpoint) to validate the signature of the ID token. There might be multiple keys listed at this endpoint at any given time, each identified by a `kid`. The header of `id_token` also contains a `kid` claim. It indicates which of these keys was used to sign the ID token. For more information, including learning about [validating tokens](active-directory-b2c-reference-tokens.md#token-validation), see the [Azure AD B2C token reference](active-directory-b2c-reference-tokens.md).
<!--TODO: Improve the information on this-->

After validating the signature of the ID token, several claims require verification. For example:

* Validate the `nonce` claim to prevent token replay attacks. Its value should be what you specified in the sign-in request.
* Validate the `aud` claim to ensure that the ID token was issued for your app. Its value should be the application ID of your app.
* Validate the `iat` and `exp` claims to ensure that the ID token has not expired.

There are several more validations that you should perform, described in detail in the [OpenID Connect Core Spec](http://openid.net/specs/openid-connect-core-1_0.html). You might also want to validate additional claims, depending on your scenario. Some common validations include:

* Ensuring that the user or organization has signed up for the app.
* Ensuring that the user has proper authorization and privileges.
* Ensuring that a certain strength of authentication has occurred, such as Azure Multi-Factor Authentication.

For more information about the claims in an ID token, see the [Azure AD B2C token reference](active-directory-b2c-reference-tokens.md).

After you have completely validated the ID token, you can begin a session with the user. Use the claims in the ID token to obtain information about the user in your app. This information can be used for display, records, authorization, and so on.

## Get access tokens
If the only thing your web apps needs to do is execute policies, you can skip the next few sections. These sections are applicable only to web apps that need to make authenticated calls to a web API, and which are protected by Azure AD B2C.

Now that you've signed the user into your single page app, you can get access tokens for calling web APIs secured by Azure AD. Even if you already received a token using the `token` response type, you can use this method to acquire tokens to additional resources without redirecting the user to sign in again.

In the normal web app flow, you would do this by making a request to the `/token` endpoint.  However, the endpoint does not support CORS requests, so making AJAX calls to get and refresh tokens is not an option. Instead, you can use the implicit flow in a hidden HTML iframe element to get new tokens for other web APIs. Here's an example, with line breaks for legibility:

```

https://login.microsoftonline.com/fabrikamb2c.onmicrosoft.com/oauth2/v2.0/authorize?
client_id=90c0fe63-bcf2-44d5-8fb7-b8bbc0b29dc6
&response_type=token
&redirect_uri=https%3A%2F%2Faadb2cplayground.azurewebsites.net%2F
&scope=https%3A%2F%2Fapi.contoso.com%2Ftasks.read
&response_mode=fragment
&state=arbitrary_data_you_can_receive_in_the_response
&nonce=12345
&prompt=none
&domain_hint=organizations
&login_hint=myuser@mycompany.com
&p=b2c_1_sign_in
```

| Parameter | Required? | Description |
| --- | --- | --- |
| client_id |Required |The application ID assigned to your app in the [Azure portal](https://portal.azure.com). |
| response_type |Required |Must include `id_token` for OpenID Connect sign-in.  It might also include the response type `token`. If you use `token` here, your app can receive an access token immediately from the authorize endpoint without making a second request to the authorize endpoint. If you use the `token` response type, the `scope` parameter must contain a scope that indicates which resource to issue the token for. |
| redirect_uri |Recommended |The redirect URI of your app, where authentication responses can be sent and received by your app. It must exactly match one of the redirect URIs you registered in the portal, except that it must be URL-encoded. |
| scope |Required |A space-separated list of scopes.  For getting tokens, include all scopes that you require for the intended resource. |
| response_mode |Recommended |Specifies the method that is used to send the resulting token back to your app.  Can be `query`, `form_post`, or `fragment`. |
| state |recommended |A value included in the request that is returned in the token response.  It can be a string of any content that you want to use.  Usually, a randomly generated, unique value is used, to prevent cross-site request forgery attacks.  The state also is used to encode information about the user's state in the app before the authentication request occurred. For example, the page or view they were on. |
| nonce |Required |A value included in the request, generated by the app, that is included in the resulting ID token as a claim.  The app can then verify this value to mitigate token replay attacks. Usually, the value is a randomized, unique string that identifies the origin of the request. |
| prompt |Required |To refresh and get tokens in a hidden iframe, use `prompt=none` to ensure that the iframe does not get stuck on the sign-in page, and returns immediately. |
| login_hint |Required |To refresh and get tokens in a hidden iframe, include the username of the user in this hint to distinguish between multiple sessions the user might have at a given  time. You can extract the username from a previous sign-in by using the `preferred_username` claim. |
| domain_hint |Required |Can be `consumers` or `organizations`.  For refreshing and getting tokens in a hidden iframe, you must include the `domain_hint` value in the request.  Extract the `tid` claim from the ID token of an earlier sign-in to determine which value to use.  If the `tid` claim value is `9188040d-6c67-4c5b-b112-36a304b66dad`,  use `domain_hint=consumers`.  Otherwise, use `domain_hint=organizations`. |

By setting the `prompt=none` parameter, this request either succeeds or fails immediately, and returns to your application.  A successful response is sent to your app at the indicated redirect URI, by using the method specified in the `response_mode` parameter.

### Successful response
A successful response by using `response_mode=fragment` looks like this:

```
GET https://aadb2cplayground.azurewebsites.net/#
access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik5HVEZ2ZEstZnl0aEV1Q...
&state=arbitrary_data_you_sent_earlier
&token_type=Bearer
&expires_in=3599
&scope=https%3A%2F%2Fapi.contoso.com%2Ftasks.read
```

| Parameter | Description |
| --- | --- |
| access_token |The token that the app requested. |
| token_type |Will always be Bearer. |
| state |If a `state` parameter is included in the request, the same value should appear in the response. The app should verify that the `state` values in the request and response are identical. |
| expires_in |How long the access token is valid (in seconds). |
| scope |The scopes that the access token is valid for. |

### Error response
Error responses might also be sent to the redirect URI so that the app can handle them appropriately.  For `prompt=none`, an expected error looks like this:

```
GET https://aadb2cplayground.azurewebsites.net/#
error=user_authentication_required
&error_description=the+request+could+not+be+completed+silently
```

| Parameter | Description |
| --- | --- |
| error |An error code string that can be used to classify types of errors that occur. You also can use the string to react to errors. |
| error_description |A specific error message that can help you identify the root cause of an authentication error. |

If you receive this error in the iframe request, the user must interactively sign in again to retrieve a new token. You can handle this in a way that makes sense for your application.

## Refresh tokens
ID tokens and access tokens both expire after a short period of time. Your app must be prepared to refresh these tokens periodically.  To refresh either type of token, perform the same hidden iframe request we used in an earlier example, by using the `prompt=none` parameter to control Azure AD steps.  To receive a new `id_token` value, be sure to use `response_type=id_token` and `scope=openid`, and a `nonce` parameter.

## Send a sign-out request
When you want to sign the user out of the app, redirect the user to Azure AD to sign out. If you don't do this, the user might be able to reauthenticate to your app without entering their credentials again. This is because they will have a valid single sign-on session with Azure AD.

You can simply redirect the user to the `end_session_endpoint` that is listed in the same OpenID Connect metadata document described in the section "Validate the ID token":

```
GET https://login.microsoftonline.com/fabrikamb2c.onmicrosoft.com/oauth2/v2.0/logout?
p=b2c_1_sign_in
&post_logout_redirect_uri=https%3A%2F%2Faadb2cplayground.azurewebsites.net%2F
```

| Parameter | Required? | Description |
| --- | --- | --- |
| p |Required |The policy to use to sign the user out of your application. |
| post_logout_redirect_uri |Recommended |The URL that the user should be redirected to after successful sign-out. If it is not included, the user is shown a generic message by Azure AD B2C. |

> [!NOTE]
> Directing the user to the `end_session_endpoint` clears some of the user's single sign-on state with Azure AD B2C. However, it doesn't sign the user out of the user's social identity provider session. If the user selects the same identify provider during a subsequent sign-in, the user is reauthenticated, without entering their credentials. If a user wants to sign out of your Azure AD B2C application, it does not necessarily mean they want to completely sign out of their Facebook account. However, for local accounts, the user's session will be ended properly.
> 
> 

## Use your own Azure AD B2C tenant
To try these requests yourself, complete the following three steps. Then, replace the example values we use in this article with your own values:

1. [Create an Azure AD B2C tenant](active-directory-b2c-get-started.md). Use the name of your tenant in the requests.
2. [Create an application](active-directory-b2c-app-registration.md) to obtain an application ID and a `redirect_uri` value. Include a web app/web API in your app. Optionally, you can create an application secret.
3. [Create your policies](active-directory-b2c-reference-policies.md) to obtain your policy names.

## Samples

* [Create a single-page app by using Node.js](https://github.com/Azure-Samples/active-directory-b2c-javascript-singlepageapp-nodejs-webapi)
* [Create a single-page app by using .NET](https://github.com/Azure-Samples/active-directory-b2c-javascript-singlepageapp-dotnet-webapi)

