---
title: 'Azure Active Directory B2C: SPA Using Implicit Flow | Microsoft Docs'
description: How to build single-page apps directly by using implicit flow.
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
# Azure Active Directory B2C: Sign-in for Single-Page Apps using OAuth 2.0 Implicit Flow

> [!NOTE]
> This feature is still in preview.
> 

Many modern apps have a single-page app front end that primarily is written in JavaScript. Often, it's written by using a framework like AngularJS, Ember.js, or Durandal.js. Single page and other JavaScript apps that run primarily in a browser face a few interesting challenges when it comes to authentication:

* The security characteristics of these apps are significantly different from traditional server-based web applications.
* Many authorization servers & identity providers do not support CORS requests.
* Full page browser redirects away from the app become particularly invasive to the user experience.

To support these applications, Azure AD B2C uses the OAuth 2.0 implicit flow.  The OAuth 2.0 authorization implicit grant flow is described in [section 4.2 of the OAuth 2.0 specification](http://tools.ietf.org/html/rfc6749).  In this flow, the app receives tokens directly from the Azure AD authorize endpoint, without any server-to-server exchanges. All authentication logic and session handling takes place entirely in the JavaScript client, without extra page redirects.

Azure AD B2C extends the standard OAuth 2.0 implicit flows to do more than simple authentication and authorization. It introduces the [**policy parameter**](active-directory-b2c-reference-policies.md), which enables you to use OAuth 2.0 to add user experiences to your app, such as sign-up, sign-in, and profile management. Here we show how to use the implicit flow and Azure AD to implement each of these experiences in your single-page applications.  You can also look at our [Node.JS](https://github.com/Azure-Samples/active-directory-b2c-javascript-singlepageapp-nodejs-webapi) or [.NET](https://github.com/Azure-Samples/active-directory-b2c-javascript-singlepageapp-dotnet-webapi) samples to help you get started.

The example HTTP requests below use our sample B2C directory, **fabrikamb2c.onmicrosoft.com**, and our sample application and policies. You're free to try out the requests yourself by using these values, or you can replace them with your own.
Learn how to [get your own B2C directory, application, and policies](#use-your-own-b2c-tenant).

## Protocol diagram
The entire implicit sign-in flow looks something like this - each of the steps are described in detail below.

![OpenId Connect Swimlanes](../media/active-directory-v2-flows/convergence_scenarios_implicit.png)

## Send authentication requests
When your web app needs to authenticate the user and execute a policy, it directs the user to the `/authorize` endpoint. This is the interactive portion of the flow, where the user actually takes action, depending on the policy, and gets an `id_token` from the Azure AD endpoint.

In this request, the client indicates the permissions that it needs to acquire from the user in the `scope` parameter and the policy to execute in the `p` parameter. Three examples are provided below (with line breaks for readability),
each using a different policy. To get a feel for how each request works, try pasting the request into a browser and running it.

#### Use a sign-in policy
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

#### Use a sign-up policy
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

#### Use an edit-profile policy
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

| Parameter |  | Description |
| --- | --- | --- |
| client_id |Required |The application ID that the [Azure portal](https://portal.azure.com/) assigned to your app. |
| response_type |required |Must include `id_token` for OpenID Connect sign-in.  It may also include the response_type `token`. Using `token` here allows your app to receive an access token immediately from the authorize endpoint without having to make a second request to the authorize endpoint.  If you use the `token` response_type, the `scope` parameter must contain a scope indicating which resource to issue the token for. |
| redirect_uri |Recommended |The redirect_uri of your app, where authentication responses can be sent and received by your app. It must exactly match one of the redirect_uris that you registered in the portal, except that it must be URL encoded. |
| response_mode |recommended |Specifies the method that should be used to send the resulting token back to your app.  Should be `fragment` for the implicit flow. |
| scope |Required |A space-separated list of scopes. A single scope value indicates to Azure AD both of the permissions that are being requested. The `openid` scope indicates a permission to sign in the user and get data about the user in the form of **id_tokens** (more to come on this later in the article). The `offline_access` scope is optional for web apps. It indicates that your app will need a **refresh_token** for long-lived access to resources. |
| state |Recommended |A value included in the request that will also be returned in the token response. It can be a string of any content that you want. A randomly generated unique value is typically used for preventing cross-site request forgery attacks. The state is also used to encode information about the user's state in the app before the authentication request occurred, such as the page they were on. |
| nonce |Required |A value included in the request (generated by the app) that will be included in the resulting id_token as a claim. The app can then verify this value to mitigate token replay attacks. The value is typically a randomized, unique string that can be used to identify the origin of the request. |
| p |Required |The policy that will be executed. It is the name of a policy that is created in your B2C tenant. The policy name value should begin with "b2c\_1\_". Learn more about policies in [Extensible policy framework](active-directory-b2c-reference-policies.md). |
| prompt |Optional |The type of user interaction that is required. The only valid value at this time is 'login', which forces the user to enter their credentials on that request. Single sign-on will not take effect. |

At this point, the user will be asked to complete the policy's workflow. This may involve the user entering their user name and password, signing in with a social identity, signing up for the directory, or any other number of steps, depending on how the policy is defined.

After the user completes the policy, Azure AD will return a response to your app at the indicated `redirect_uri`, by using the method that is specified in the `response_mode` parameter. The response will be exactly the same for each of the above cases, independent of the policy that was executed.

#### Successful response
A successful response using `response_mode=fragment` and `response_type=id_token+token` looks like the following, with line breaks for legibility:

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
| access_token |The access token that the app requested.  The access token should not be decoded or otherwise inspected, it can be treated as an opaque string. |
| token_type |The token type value. The only type that Azure AD supports is Bearer. |
| expires_in |The length of time that the access_token is valid (in seconds). |
| scope |Scopes for which the token is valid, which can be used for caching tokens for later use. |
| id_token |The id_token that the app requested. You can use the id_token to verify the user's identity and begin a session with the user. More details on id_tokens and their contents are included in the [Azure AD B2C token reference](active-directory-b2c-reference-tokens.md). |
| state |If a state parameter is included in the request, the same value should appear in the response. The app should verify that the state values in the request and response are identical. |

#### Error response
Error responses may also be sent to the `redirect_uri` so the app can handle them appropriately:

```
GET https://aadb2cplayground.azurewebsites.net/#
error=access_denied
&error_description=the+user+canceled+the+authentication
&state=arbitrary_data_you_can_receive_in_the_response
```

| Parameter | Description |
| --- | --- |
| error |An error code string used to classify types of errors that occur. The error code can be used for error handling. |
| error_description |A specific error message that can help a developer identify the root cause of an authentication error. |
| state |See the full description in the previous table. If a state parameter is included in the request, the same value should appear in the response. The app should verify that the state values in the request and response are identical.|

## Validate the id_token
Just receiving an id_token is not enough to authenticate the user--you must validate the id_token's signature and verify the claims in the token as per your app's requirements. Azure AD B2C uses [JSON Web Tokens (JWTs)](http://self-issued.info/docs/draft-ietf-oauth-json-web-token.html) and public key cryptography to sign tokens and verify that they are valid.

There are many open-source libraries that are available for validating JWTs, depending on your language of preference. Consider exploring those options rather than implementing your own validation logic. The information here will be useful in figuring out how to properly use those libraries.

Azure AD B2C has an OpenID Connect metadata endpoint, which allows an app to fetch information about Azure AD B2C at runtime. This information includes endpoints, token contents, and token signing keys. There is a JSON metadata document for each policy in your B2C tenant. For example the metadata document for the `b2c_1_sign_in` policy in the `fabrikamb2c.onmicrosoft.com` is located at:

`https://login.microsoftonline.com/fabrikamb2c.onmicrosoft.com/v2.0/.well-known/openid-configuration?p=b2c_1_sign_in`

One of the properties of this configuration document is the `jwks_uri`, whose value for the same policy would be:

`https://login.microsoftonline.com/fabrikamb2c.onmicrosoft.com/discovery/v2.0/keys?p=b2c_1_sign_in`.

In order to determine which policy was used in signing an id_token (and where to fetch the metadata from), you have two options. First, the policy name is included in the `acr` claim in the id_token. For information on how to parse the claims from an id_token, see the [Azure AD B2C token reference](active-directory-b2c-reference-tokens.md). Your other option is to encode the policy in the value of the `state` parameter when you issue the request, and then decode it to determine which policy was used. Either method is perfectly valid.

After you've acquired the metadata document from the OpenID Connect metadata endpoint, you can use the RSA 256 public keys (which are located at this endpoint) to validate the signature of the id_token. There may be multiple keys listed at this endpoint at any given point in time, each identified by a `kid`. The header of the id_token also contains a `kid` claim, which indicates which of these keys was used to sign the id_token. See the [Azure AD B2C token reference](active-directory-b2c-reference-tokens.md) for more information, including [validating tokens](active-directory-b2c-reference-tokens.md#token-validation).
<!--TODO: Improve the information on this-->

After validating the signature of the id_token, several claims also require verification, for instance:

* Validate the `nonce` claim to prevent token replay attacks. Its value should be what you specified in the sign-in request.
* Validate the `aud` claim to ensure that the id_token was issued for your app. Its value should be the application ID of your app.
* Validate the `iat` and `exp` claims to ensure that the id_token has not expired.

There are also several more validations that you should perform, described in detail in the [OpenID Connect Core Spec](http://openid.net/specs/openid-connect-core-1_0.html).  You might also want to validate additional claims, depending on your scenario. Some common validations include:

* Ensuring that the user/organization has signed up for the app.
* Ensuring that the user has proper authorization/privileges.
* Ensuring that a certain strength of authentication has occurred, such as Azure Multi-Factor Authentication.

For more information on the claims in an id_token, see the [Azure AD B2C token reference](active-directory-b2c-reference-tokens.md).

After you have completely validated the id_token, you can begin a session with the user and use the claims in the id_token to obtain information about the user in your app. This information can be used for display, records, authorization, and so on.

## Get access tokens
If all that your web app needs to do is to execute policies, you can skip the next few sections. These sections are only applicable to web apps that need to make authenticated calls to a web API and are also protected by Azure AD B2C.

Now that you've signed the user into your single page app, you can get access tokens for calling web APIs secured by Azure AD.  Even if you already received a token using the `token` response_type, you can use this method to acquire tokens to additional resources without having to redirect the user to sign in again.

In the normal web app flow, you would do this by making a request to the `/token` endpoint.  However, the endpoint does not support CORS requests, so making AJAX calls to get and refresh tokens is out of the question.  Instead, you can use the implicit flow in a hidden iframe to get new tokens for other web APIs:

```
// Line breaks for legibility only

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

| Parameter |  | Description |
| --- | --- | --- |
| client_id |Required |The application ID that the [Azure portal](https://portal.azure.com/) assigned to your app. |
| response_type |required |Must include `id_token` for OpenID Connect sign-in.  It may also include the response_type `token`. Using `token` here will allow your app to receive an access token immediately from the authorize endpoint without having to make a second request to the authorize endpoint.  If you use the `token` response_type, the `scope` parameter must contain a scope indicating which resource to issue the token for. |
| redirect_uri |recommended |The redirect_uri of your app, where authentication responses can be sent and received by your app.  It must exactly match one of the redirect_uris you registered in the portal, except it must be url encoded. |
| scope |required |A space-separated list of scopes.  For getting tokens, include all scopes you require for the resource of interest. |
| response_mode |recommended |Specifies the method that is used to send the resulting token back to your app.  Can be one of `query`, `form_post`, or `fragment`. |
| state |recommended |A value included in the request that is returned in the token response.  It can be a string of any content that you wish.  A randomly generated unique value is typically used for preventing cross-site request forgery attacks.  The state is also used to encode information about the user's state in the app before the authentication request occurred, such as the page or view they were on. |
| nonce |required |A value included in the request, generated by the app, that is included in the resulting id_token as a claim.  The app can then verify this value to mitigate token replay attacks.  The value is typically a randomized, unique string that identifies the origin of the request. |
| prompt |required |For refreshing & getting tokens in a hidden iframe, use `prompt=none` to ensure that the iframe does not hang on the sign-in page, and returns immediately. |
| login_hint |required |For refreshing & getting tokens in a hidden iframe, you must include the username of the user in this hint in order to distinguish between multiple sessions the user may have at a given point in time. You can extract the username from a previous sign-in using the `preferred_username` claim. |
| domain_hint |required |Can be one of `consumers` or `organizations`.  For refreshing & getting tokens in a hidden iframe, you must include the domain_hint in the request.  Extract the `tid` claim from the id_token of a previous sign-in to determine which value to use.  If the `tid` claim value is `9188040d-6c67-4c5b-b112-36a304b66dad`, you should use `domain_hint=consumers`.  Otherwise, use `domain_hint=organizations`. |

By setting the `prompt=none` parameter, this request will either succeed or fail immediately and return to your application.  A successful response will be sent to your app at the indicated `redirect_uri`, using the method specified in the `response_mode` parameter.

#### Successful response
A successful response using `response_mode=fragment` looks like:

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
| token_type |Will always be `Bearer`. |
| state |If a state parameter is included in the request, the same value should appear in the response. The app should verify that the state values in the request and response are identical. |
| expires_in |How long the access token is valid (in seconds). |
| scope |The scopes that the access token is valid for. |

#### Error response
Error responses may also be sent to the `redirect_uri` so the app can handle them appropriately.  In the case of `prompt=none`, an expected error will be:

```
GET https://aadb2cplayground.azurewebsites.net/#
error=user_authentication_required
&error_description=the+request+could+not+be+completed+silently
```

| Parameter | Description |
| --- | --- |
| error |An error code string that can be used to classify types of errors that occur, and can be used to react to errors. |
| error_description |A specific error message that can help a developer identify the root cause of an authentication error. |

If you receive this error in the iframe request, the user must interactively sign in again to retrieve a new token.  You can choose to handle this case in whatever way makes sense for your application.

## Refreshing tokens
Both `id_token`s and `access_token`s expires after a short period of time, so your app must be prepared to refresh these tokens periodically.  To refresh either type of token, perform the same hidden iframe request from above using the `prompt=none` parameter to control Azure AD's behavior.  To receive a new `id_token`, be sure to use `response_type=id_token` and `scope=openid`, as well as a `nonce` parameter.

## Send a sign-out request
When you want to sign the user out of the app, redirect the user to Azure AD to sign out. If you fail to do so, the user might be able to reauthenticate to your app without entering their credentials again. This is because they will have a valid single sign-on session with Azure AD.

You can simply redirect the user to the `end_session_endpoint` that is listed in the same OpenID Connect metadata document described in the earlier section "Validate the id_token":

```
GET https://login.microsoftonline.com/fabrikamb2c.onmicrosoft.com/oauth2/v2.0/logout?
p=b2c_1_sign_in
&post_logout_redirect_uri=https%3A%2F%2Faadb2cplayground.azurewebsites.net%2F
```

| Parameter | Required? | Description |
| --- | --- | --- |
| p |Required |The policy to use to sign the user out of your application. |
| post_logout_redirect_uri |Recommended |The URL that the user should be redirected to after successful sign-out. If it is not included, the user will be shown a generic message by Azure AD B2C. |

> [!NOTE]
> While directing the user to the `end_session_endpoint` clears some of the user's single sign-on state with Azure AD B2C, it does not sign the user out of the user's social identity provider (IDP) session. If the user selects the same IDP during a subsequent sign-in, they will be reauthenticated, without entering their credentials. If a user wants to sign out of your B2C application, it does not necessarily mean they want to sign out of their Facebook account entirely. However, in the case of local accounts, the user's session will be ended properly.
> 
> 

## Use your own B2C tenant
If you want to try these requests for yourself, you must first perform these three steps, and then replace the example values above with your own:

* [Create a B2C tenant](active-directory-b2c-get-started.md), and use the name of your tenant in the requests.
* [Create an application](active-directory-b2c-app-registration.md) to obtain an application ID and a redirect_uri. You will want to include a **web app/web api** in your app, and optionally create an **application secret**.
* [Create your policies](active-directory-b2c-reference-policies.md) to obtain your policy names.

## Samples

* [Create a single-page app using Node.JS](https://github.com/Azure-Samples/active-directory-b2c-javascript-singlepageapp-nodejs-webapi)
* [Create a single-page app using .NET](https://github.com/Azure-Samples/active-directory-b2c-javascript-singlepageapp-dotnet-webapi)

