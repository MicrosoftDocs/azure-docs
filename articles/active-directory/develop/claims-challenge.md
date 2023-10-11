---
title: Claims challenges, claims requests, and client capabilities
description: Explanation of claims challenges, claims requests, and client capabilities in the Microsoft identity platform.
services: active-directory
author: davidmu1
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: reference
ms.workload: identity
ms.date: 01/19/2023
ms.author: davidmu
ms.reviewer: kkrishna, kylemar
# Customer intent: As an application developer, I want to learn how to handle claims challenges returned from APIs protected by the Microsoft identity platform. 
---

# Claims challenges, claims requests, and client capabilities

A *claims challenge* is a response sent from an API indicating that an access token sent by a client application has insufficient claims. This can be because the token does not satisfy the Conditional Access policies set for that API, or the access token has been revoked.

A *claims request* is made by the client application to redirect the user back to the identity provider to retrieve a new token with claims that will satisfy the additional requirements that were not met.

Applications that use enhanced security features like [Continuous Access Evaluation (CAE)](../conditional-access/concept-continuous-access-evaluation.md) and [Conditional Access authentication context](https://techcommunity.microsoft.com/t5/azure-active-directory-identity/granular-conditional-access-for-sensitive-data-and-actions/ba-p/1751775) must be prepared to handle claims challenges.

Your application will receive claims challenges from popular services like [Microsoft Graph](/graph/overview) only if it declares its [client capabilities](#client-capabilities) in its calls to the service.

## Claims challenge header format

The claims challenge is a directive as a `www-authenticate` header returned by an API when an [access token](access-tokens.md) presented to it isn't authorized, and a new access token with the right capabilities is required instead. The claims challenge comprises multiple parts: the HTTP status code of the response and the `www-authenticate` header, which itself has multiple parts and must contain a claims directive.

Here's an example:

```https
HTTP 401; Unauthorized

www-authenticate =Bearer realm="", authorization_uri="https://login.microsoftonline.com/common/oauth2/authorize", error="insufficient_claims", claims="eyJhY2Nlc3NfdG9rZW4iOnsiYWNycyI6eyJlc3NlbnRpYWwiOnRydWUsInZhbHVlIjoiY3AxIn19fQ=="
```

 **HTTP Status Code**: Must be **401 Unauthorized**.

**www-authenticate response header** containing:

| Parameter    | Required/optional | Description |
|--------------|-------------|--------------|
| Authentication type | Required | Must be **Bearer.**|
| Realm | Optional | The tenant ID or tenant domain name (for example, microsoft.com) being accessed. MUST be an empty string in the case where the authentication goes through the [common endpoint](howto-convert-app-to-be-multi-tenant.md#update-your-code-to-send-requests-to-common). |
| `authorization_uri` | Required | The URI of the authorize endpoint where an interactive authentication can be performed if necessary. If specified in realm, the tenant information MUST be included in the authorization_uri. If realm is an empty string, the authorization_uri MUST be against the [common endpoint](howto-convert-app-to-be-multi-tenant.md#update-your-code-to-send-requests-to-common). |
| `error` | Required | Must be "insufficient_claims" when a claims challenge should be generated. | 
| `claims` | Required when error is "insufficient_claims". | A quoted string containing a base 64 encoded [claims request](https://openid.net/specs/openid-connect-core-1_0.html#ClaimsParameter). The claims request should request claims for the "access_token" at the top level of the JSON object. The value (claims requested) will be context-dependent and specified later in this document. For size reasons, relying party applications SHOULD minify the JSON before base 64 encoding. The raw JSON of the example above is {"access_token":{"acrs":{"essential":true,"value":"cp1"}}}. |

The **401** response may contain more than one `www-authenticate` header. All fields in the preceding table must be contained within the same `www-authenticate` header. The `www-authenticate` header that contains the claims challenge *can* contain other fields. Fields in the header are unordered. According to RFC 7235, each parameter name must occur only once per authentication scheme challenge.

## Claims request

When an application receives a claims challenge, it indicates that the prior access token is no longer considered valid. In this scenario, the application should clear the token from any local cache or user session. Then, it should redirect the signed-in user back to Microsoft Entra ID to retrieve a new token by using the [OAuth 2.0 authorization code flow](v2-oauth2-auth-code-flow.md) with a *claims* parameter that will satisfy the additional requirements that were not met.

Here's an example:

```https
GET https://login.microsoftonline.com/14c2f153-90a7-4689-9db7-9543bf084dad/oauth2/v2.0/authorize
?client_id=2810aca2-a927-4d26-8bca-5b32c1ef5ea9
&redirect_uri=https%3A%2F%contoso.com%3A44321%2Fsignin-oidc
&response_type=code
&scope=openid%20profile%20offline_access%20user.read%20Sites.Read.All
&response_mode=form_post
&login_hint=kalyan%ccontoso.onmicrosoft.com
&domain_hint=organizations
&claims=%7B%22access_token%22%3A%7B%22acrs%22%3A%7B%22essential%22%3Atrue%2C%22value%22%3A%22c1%22%7D%7D%7D
```

The claims challenge should be passed as a part of all calls to a Microsoft Entra [/authorize](v2-oauth2-auth-code-flow.md#request-an-authorization-code) endpoint until a token is successfully retrieved, after which it is no longer needed.

To populate the claims parameter, the developer has to:

1. Decode the base64 string received earlier.
2. URL-encode the string and add again to the **claims** parameter.

Upon completion of this flow, the application will receive an Access Token that has the additional claims that prove that the user satisfied the conditions required.

## Client capabilities

Client capabilities help a resources provider like a Web API detect whether the calling client application understands the claims challenge and can then customize its response accordingly. This capability might be useful when not all API clients are capable of handling claim challenges, and some earlier versions still expect a different response.

Some popular applications like [Microsoft Graph](/graph/overview) send claims challenges only if the calling client app declares that it's capable of handling them by using *client capabilities*.

To avoid extra traffic or impacts to user experience, Microsoft Entra ID does not assume that your app can handle claims challenged unless you explicitly opt in. An application will not receive claims challenges (and will not be able to use the related features such as CAE tokens) unless it declares it is ready to handle them with the "cp1" capability.

<a name='how-to-communicate-client-capabilities-to-azure-ad'></a>

### How to communicate client capabilities to Microsoft Entra ID

The following example claims parameter shows how a client application communicates its capability to Microsoft Entra ID in an [OAuth 2.0 authorization code flow](v2-oauth2-auth-code-flow.md).

```json
Claims: {"access_token":{"xms_cc":{"values":["cp1"]}}}
```

#### [.NET](#tab/dotnet)

Those using MSAL library will use the following code:

```c#
_clientApp = PublicClientApplicationBuilder.Create(App.ClientId)
 .WithDefaultRedirectUri()
 .WithAuthority(authority)
 .WithClientCapabilities(new [] {"cp1"})
 .Build();
```

Those using Microsoft.Identity.Web can add the following code to the configuration file:

```c#
{
  "AzureAd": {
    "Instance": "https://login.microsoftonline.com/",
    "ClientId": 'Enter_the_Application_Id_Here' 
    "ClientCapabilities": [ "cp1" ],
    // remaining settings...
},
```
#### [JavaScript](#tab/JavaScript)

Those using MSAL.js or MSAL Node can add `clientCapabilities` property to the configuration object. Note: this option is available to both public and confidential cient applications.

```javascript
const msalConfig = {
    auth: {
        clientId: 'Enter_the_Application_Id_Here', 
        clientCapabilities: ["CP1"]
        // remaining settings...
    }
}

const msalInstance = new msal.PublicClientApplication(msalConfig);
```

---

An example of how the request to Microsoft Entra ID will look like:

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

When you already have an existing payload for claims parameter, then you would add this to the existing set.

For example, if you already have the following response from a Condition Access authentication context operation

```json
{"access_token":{"acrs":{"essential":true,"value":"c25"}}}
```

You would prepend the client capability in the existing **claims** payload.

```json
{"access_token":{"xms_cc":{"values":["cp1"]},"acrs":{"essential":true,"value":"c25"}}}
```

## Receiving xms_cc claim in an access token

To receive information about whether client applications can handle claims challenges, an API implementer must request **xms_cc** as an optional claim in its application manifest.

The **xms_cc** claim with a value of "cp1" in the access token is the authoritative way to identify a client application is capable of handling a claims challenge. **xms_cc** is an optional claim that will not always be issued in the access token, even if the client sends a claims request with "xms_cc". In order for an access token to contain the **xms_cc** claim, the resource application (that is, the API implementer) must request xms_cc as an [optional claim](./optional-claims.md) in its application manifest. When requested as an optional claim, **xms_cc** will be added to the access token only if the client application sends **xms_cc** in the claims request. The value of the **xms_cc** claim request will be included as the value of the **xms_cc** claim in the access token, if it is a known value. The only currently known value is **cp1**.

The values are not case-sensitive and unordered. If more than one value is specified in the **xms_cc** claim request, those values will be a multi-valued collection as the value of the **xms_cc** claim.

A request of:

```json
{ "access_token": { "xms_cc":{"values":["cp1","foo", "bar"] } }}
```

will result in a claim of

```json
"xms_cc": ["cp1", "foo", "bar"]
```

in the access token, if **cp1**, **foo** and **bar** are known capabilities.

This is how the app's manifest looks like after the **xms_cc** [optional claim](./optional-claims.md) has been requested

```c#
"optionalClaims":
{
    "accessToken": [
    {
        "additionalProperties": [],
        "essential": false,
        "name": "xms_cc",
        "source": null
    }],
    "idToken": [],
    "saml2Token": []
}
```

The API can then customize their responses based on whether the client is capable of handling claims challenge or not.

### [.NET](#tab/dotnet)

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

### [JavaScript](#tab/JavaScript)

The following snippet illustrates a custom Express.js middleware:

```javascript
const checkIsClientCapableOfClaimsChallenge = (req, res, next) => {
    // req.authInfo contains the decoded access token payload
    if (req.authInfo['xms_cc'] && req.authInfo['xms_cc'].includes('CP1')) {
          // Return formatted claims challenge as this client understands this
    } else {
          return res.status(403).json({ error: 'Client is not capable' });
    }
}

```

---

## Code samples

- [Enable your Angular single-page application to sign in users and call Microsoft Graph](https://github.com/Azure-Samples/ms-identity-javascript-angular-tutorial/tree/main/2-Authorization-I/1-call-graph)
- [Enable your React single-page application to sign in users and call Microsoft Graph](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/tree/main/2-Authorization-I/1-call-graph)
- [Enable your ASP.NET Core web app to sign in users and call Microsoft Graph](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/2-WebApp-graph-user/2-1-Call-MSGraph)

## Next steps

- [Microsoft identity platform and OAuth 2.0 authorization code flow](v2-oauth2-auth-code-flow.md#request-an-authorization-code)
- [How to use Continuous Access Evaluation enabled APIs in your applications](app-resilience-continuous-access-evaluation.md)
- [Granular Conditional Access for sensitive data and actions](https://techcommunity.microsoft.com/t5/azure-active-directory-identity/granular-conditional-access-for-sensitive-data-and-actions/ba-p/1751775)
