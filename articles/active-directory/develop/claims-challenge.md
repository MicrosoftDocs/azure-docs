---
title: "Claims challenges"
titleSuffix: Microsoft identity platform
description: Claims challenges, how to handle them with claims requests, and how to let Azure AD know your application can handle them by declaring the right client capabilities
services: active-directory
author: knicholasa
manager: martinco

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 04/30/2021
ms.author: nichola
ms.reviewer: kkrishna, kylemar
# Customer intent: As an application developer, I want to learn how to claims challenges returned from APIs protected by the Microsoft identity platform. 
---

# Claims challenges

A claims challenge is a response indicating that an access token sent by a client application does not satisfy the conditional access policies set for an API, or that the access token has been revoked. Applications that use enhanced security features such as [Continuous Access Evaluation (CAE)](../conditional-access/concept-continuous-access-evaluation.md) and [Conditional Access authentication context](https://techcommunity.microsoft.com/t5/azure-active-directory-identity/granular-conditional-access-for-sensitive-data-and-actions/ba-p/1751775) must be prepared to handle claims challenges.

This document explains:

- What a claims challenge is and how applications handle them with claims requests
- How to let Azure AD know your application can handle claims challenges by declaring the right client capabilities

## Claims Challenge Header Format

The claims challenge is a directive in the www-authenticate header returned by an API when an access token is not authorized, and a new access token is required. The claims challenge comprises multiple parts: the HTTP status code of the response and the www-authenticate header, which itself has multiple parts and must contain a claims directive.

``` https
HTTP 401; Unauthorized

www-authenticate =Bearer realm="", authorization_uri="https://login.microsoftonline.com/common/oauth2/authorize", error="insufficient_claims", claims="eyJhY2Nlc3NfdG9rZW4iOnsiYWNycyI6eyJlc3NlbnRpYWwiOnRydWUsInZhbHVlIjoidXJuOm1pY3Jvc29mdDpyZXExIn19fQ=="
```

 **HTTP Status Code**: Must be 401 Unauthorized.

**www-authenticate response header** containing:

1. **Authentication type** Required. Muse be **Bearer.**</br>
1. **Realm** Optional. The tenant ID or tenant domain name (for example, microsoft.com) being accessed. MUST be an empty string in the case where the authentication goes through the [common endpoint](howto-convert-app-to-be-multi-tenant.md#update-your-code-to-send-requests-to-common).</br>
1. **Authorization_uri** Required. The URI of the authorize endpoint where an interactive authentication can be performed if necessary. If specified in realm, the tenant information MUST be included in the authorization_uri. If realm is an empty string, the authorization_uri MUST be against the [common endpoint](howto-convert-app-to-be-multi-tenant.md#update-your-code-to-send-requests-to-common).</br>
1. **error** Required. Must be "insufficient_claims" when a claims challenge should be generated.</br>
1. **claims** Required if error is "insufficient_claims". A quoted string containing a base 64 encoded [claims request](https://openid.net/specs/openid-connect-core-1_0.html#ClaimsParameter). The claims request should request claims for the "access_token" at the top level of the JSON object. The value (claims requested) will be context dependent and specified later in this document. For size reasons, relying party applications SHOULD minify the JSON before base 64 encoding. The raw JSON of the example above is {"access_token":{"acrs":{"essential":true,"value":"cp1"}}}.





The 401 response may contain more than one www-authenticate header. All above fields must be contained within the same www-authenticate header. The www-authenticate header with the claims challenge MAY contain other fields. Fields in the header are unordered. According to RFC 7235, each parameter name must occur only once per authentication scheme challenge.

## Claims request format

The claims challenge indicates that the prior access token is no longer considered valid. The application should clear the token from any local cache or user session. To respond to a claims challenge, an application must redirect the signed-in user back to Azure AD to retrieve a new token using the [OAuth 2.0 authorization code flow](v2-oauth2-auth-code-flow.md) with a **claims** parameter that will satisfy the additional requirements that were not met.

An example is provided below:

``` https
GET https://login.microsoftonline.com/14c2f153-90a7-4689-9db7-9543bf084dad/oauth2/v2.0/authorize
?client_id=2810aca2-a927-4d26-8bca-5b32c1ef5ea9
&redirect_uri=https%3A%2F%contoso.com%3A44321%2Fsignin-oidc
&response_type=code
&scope=openid%20profile%20offline_access%20user.read%20Sites.Read.All
&response_mode=form_post
&login_hint=kalyan%ccontoso.onmicrosoft.com
&domain_hint=organizations
claims=%7B%22access_token%22%3A%7B%22acrs%22%3A%7B%22essential%22%3Atrue%2C%22value%22%3A%22urn%3Amicrosoft%3Areq1%22%7D%7D%7D**
```

The claims challenge should be passed as a part of all calls to Azure AD's [/authorize](https://docs.microsoft.com/azure/active-directory/develop/v2-oauth2-auth-code-flow#request-an-authorization-code) endpoint until a token is successfully retrieved, after which it is no longer needed.

To populate the claims parameter, the developer has to:

1. Decode the base64 string received earlier.
2. URL Encode the string and add again to the **claims** parameter.

Upon completion of this flow, the application will receive an Access Token that has the additional claims that proves that the user satisfied the conditions required.

## Client Capabilities

To avoid extra traffic or impacts to user experience, Azure AD does not assume that your app can handle claims challenged unless you explicitly opt in. An application will not receive claims challenges (and will not be able to use the related features such as CAE tokens) unless it declares it is ready to handle them with the "cp1" capability.

### How to Communicate client capabilities to Azure AD

The following example claims parameter shows how a client applications communicates its capability to Azure AD in an [OAuth 2.0 authorization code flow](v2-oauth2-auth-code-flow.md).

```https
Claims: {"access_token":{"xms_cc":{"values":["cp1"]}}}
```

Those using MSAL library will use the following code:

```c#
_clientApp = PublicClientApplicationBuilder.Create(App.ClientId)
 .WithDefaultRedirectUri()
 .WithAuthority(authority)
 .WithClientCapabilities(new [] {"cp1"})
 .Build();*
```

Those using Microsoft.Identity.Web can add the following code to the configuration file:

```c#
{
  "AzureAd": {
    "Instance": "https://login.microsoftonline.com/",
    // the remaining settings
    // ... 
    "ClientCapabilities": [ "cp1" ]
},
```

An example of how the request to Azure AD will look like:

```https
GET https://login.microsoftonline.com/14c2f153-90a7-4689-9db7-9543bf084dad/oauth2/v2.0/authorize
?client_id=2810aca2-a927-4d26-8bca-5b32c1ef5ea9
&redirect_uri=https%3A%2F%contoso.com%3A44321%2Fsignin-oidc
&response_type=code
&scope=openid%20profile%20offline_access%20user.read%20Sites.Read.All
&response_mode=form_post
&login_hint=kalyan%ccontoso.onmicrosoft.com
&domain_hint=organizations
&claims=%7B%22access_token%22%3A%7B%22xms_cc%22%3A%7B%22values%22%3A%5B%22cp1%22%5D%7D%7D%7D
```

When you already have an existing payload for claims parameter, then you'd add this to the existing set.

For example, if you already have the following response from a CAE operation

```https
{"access_token":{"acrs":{"essential":true,"value":"c25"}}}
```

You'd append the client capability in the existing **claims** payload.

```https
{"access_token":{"xms_cc":{"values":["cp1"]},{"acrs":{"essential":true,"value":"c25"}}}}
```

### Receiving xms_cc claim in the access token

The **xms_cc** claim with a value of "CP1" in the access token is the authoritative way to identify a client application is capable of handling a claims challenge. **xms_cc** is an optional claim that will not always be issued in the access token, even if the client sends a claims request with "xms_cc". In order for an access token to contain the **xms_cc** claim, the resource application (that is, the API implementer) must request xms_cc as an [optional claim](active-directory-optional-claims.md) in its application manifest. When requested as an optional claim, **xms_cc** will be added to the access token only if the client application sends **xms_cc** in the claims request. The value of the **xms_cc** claim request will be included as the value of the **xms_cc** claim in the access token, if it is a known value. The currently known values are

- CP1

These values are not case sensitive and unordered. If more than one value is specified in the **xms_cc** claim request, those values will be a multi-valued collection as the value of the **xms_cc** claim.

A request of :

```https
{ "access_token": { "xms_cc":{"values":["CP1","foo", "bar"] } }}
```

will result in a claim of

```https
"xms_cc": ["CP1", "foo", "bar"]
```

in the access token, if **CP1**, **foo** and **bar** are known capabilities.

This is how the app's manifest looks like after the **xms_cc** [optional claim](active-directory-optional-claims.md) has been requested

```c#
"optionalClaims":
{
    "accessToken": [
    {
        "additionalProperties": [],
        "essential": false,
        "name": "xms_cc",
        "source": null
    ],
    "idToken": [],
    "saml2Token": []
}
```

The client can then customize their responses based on whether the client is capable of handling claims challenge or not.

An example in C#

```c#
Claim ccClaim = context.User.FindAll(clientCapabilitiesClaim).FirstOrDefault(x => x.Type == "xms_cc");
if (ccClaim != null && ccClaim.Value == "cp1")
{
    // Return formatted claims challenge as this client understands this
}
else
{
    // Throw generic exception
    throw new UnauthorizedAccessException("The caller does not meet the authentication bar to carry our this operation. The service cannot allow this operation");
}
```
