---
title: Microsoft identity platform UserInfo endpoint | Azure
titleSuffix: Microsoft identity platform
description: Learn about the UserInfo endpoint on the Microsoft identity platform.
services: active-directory
author: hpsin
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: conceptual
ms.date: 05/22/2020
ms.author: hirsin
ms.reviewer: hirsin
ms.custom: aaddev
---

# Microsoft identity platform UserInfo endpoint

The UserInfo endpoint is part of the [OpenID Connect standard](https://openid.net/specs/openid-connect-core-1_0.html#UserInfo) (OIDC), designed to return claims about the user that authenticated.  For the Microsoft identity platform, the UserInfo endpoint is hosted on Microsoft Graph (https://graph.microsoft.com/oidc/userinfo). 

## Find the .well-known configuration endpoint

You can programmatically discover the UserInfo endpoint using the OpenID Connect discovery document, at `https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration`. It’s listed in the `userinfo_endpoint` field, and this pattern can be used across clouds to help point to the right endpoint.  We do not recommend hard-coding the UserInfo endpoint in your app – use the OIDC discovery document to find this endpoint at runtime instead.

As part of the OpenID Connect specification, the UserInfo endpoint is often automatically called by [OIDC compliant libraries](https://openid.net/developers/certified/)  to get information about the user.  Without hosting such an endpoint, Microsoft identity platform would not be standards compliant and some libraries would fail.  From the [list of claims identified in the OIDC standard](https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims) we produce the name claims, subject claim, and email when available and consented for.  

## Consider: Use an ID Token instead

The information available in the ID token that your app can receive is a superset of the information it can get from the UserInfo endpoint.  Because you can get an ID token at the same time you get a token to call the UserInfo endpoint, we suggest that you use that ID token to get information about the user instead of calling the UserInfo endpoint.  Using the ID token will eliminate one to two network requests from your application launch, reducing latency in your application.

If you require more details about the user, you should call the [Microsoft Graph `/user` API](https://docs.microsoft.com/graph/api/user-get) to get information like office number or job title.   You can also use [optional claims](active-directory-optional-claims.md) to include additional user information in your ID and access tokens.

## Calling the UserInfo endpoint

UserInfo is a standard OAuth Bearer token API, called like any other Microsoft Graph API using the access token received when getting a token for Microsoft Graph. It returns a JSON response containing claims about the user.

### Permissions

Use the following [OIDC permissions](v2-permissions-and-consent.md#openid-connect-scopes) to call the UserInfo API. `openid` is required, and the `profile` and `email` scopes ensure that additional information is provided in the response.

|Permission type      | Permissions    |
|:--------------------|:---------------------------------------------------------|
|Delegated (work or school account) | openid (required), profile, email |
|Delegated (personal Microsoft account) | openid (required), profile, email |
|Application | Not applicable |

> [!TIP]
> Copy this URL in your browser to get a token for the UserInfo endpoint as well as an [ID token](id-tokens.md) and replace the client ID and redirect URI with your own. Note that it only requests scopes for OpenID or Graph scopes, and nothing else.  This is required, since you cannot request permissions for two different resources in the same token request.
>
> `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=<yourClientID>&response_type=token+id_token&redirect_uri=<YourRedirectUri>&scope=user.read+openid+profile+email&response_mode=fragment&state=12345&nonce=678910`
>
> You can use this access token in the next section.

As with any other Microsoft Graph token, the token you receive here may not be a JWT. If you signed in a Microsoft account user, it will be an encrypted token format. This is because Microsoft Graph has a special token issuance pattern. This does not impact your ability to use the access token to call the UserInfo endpoint.

### Calling the API

The UserInfo API supports both GET and POST, per the OIDC spec.

```http
GET or POST /oidc/userinfo HTTP/1.1
Host: graph.microsoft.com
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJub25jZSI6Il…
```

### UserInfo response

```jsonc
{
    "sub": "OLu859SGc2Sr9ZsqbkG-QbeLgJlb41KcdiPoLYNpSFA",
    "name": "Mikah Ollenburg", // names all require the “profile” scope.
    "family_name": " Ollenburg",
    "given_name": "Mikah",
    "email": "mikoll@contoso.com" //requires the “email” scope.
}
```

The claims listed here, including `sub`, are the same claims that the app would see in the [ID token](id-tokens.md) issued to the app.  

## Notes and caveats on the UserInfo endpoint

* If you want to call this UserInfo endpoint you must use the v2.0 endpoint.  If you use the v1.0 endpoint you will get a token for the v1.0 UserInfo endpoint, hosted on login.microsoftonline.com.  We recommend that all OIDC compliant apps and libraries use the v2.0 endpoint to ensure compatibility.
* The response from the UserInfo endpoint cannot be customized.  If you’d like to customize claims, please use [claims mapping]( active-directory-claims-mapping.md) to edit the information returned in the tokens.
* The response from the UserInfo endpoint cannot be added to.  If you’d like to get additional claims about the user, please use [optional claims]( active-directory-optional-claims.md) to add new claims to the tokens.

## Next Steps

* [Review the contents of ID tokens](id-tokens.md)
* [Customize the contents of an ID token using optional claims](active-directory-optional-claims.md)
* [Request an access token and ID token using the OAuth2 protocol](v2-protocols-oidc.md)