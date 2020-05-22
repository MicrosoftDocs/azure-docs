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

The UserInfo endpoint is part of the [OpenID Connect standard](https://openid.net/specs/openid-connect-core-1_0.html#UserInfo), designed to return claims about the user that authenticated.  For the Microsoft identity platform, the UserInfo endpoint is hosted on Microsoft Graph (https://graph.microsoft.com/oidc/UserInfo). 

> [!Note]
> You can programmatically discover the UserInfo endpoint using the OpenID Connect discovery document, at `https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration`. It’s listed in the `UserInfo_endpoint` field, and this pattern can be used across clouds to help point to the right endpoint.  We do not recommend hard-coding the UserInfo endpoint in your app – use the OIDC discovery document to find this endpoint at runtime instead.

As part of the OpenID Connect specification, the UserInfo endpoint is often automatically checked by [OIDC compliant libraries](https://openid.net/developers/certified/) to get information about the user.  Without hosting such an endpoint, Microsoft identity platform would not be standards compliant and some libraries would fail.  From the [list of claims identified in the OIDC standard](https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims) we produce the name claims, subject claim, and email when available and consented for.  This is the same information available in the ID token that your app can receive while it requests a token to call the UserInfo endpoint, so we suggest that you use that ID token to get information about the user instead of calling the UserInfo endpoint.  Using the ID token will eliminate one to two network requests from your application launch, reducing latency in your application.

If you require more details about the user, you should call the [MS Graph /user API](https://docs.microsoft.com/graph/api/user-get) to get information like office number or job title.   You can also use [optional claims](active-directory-optional-claims.md) to include additional user information in your ID and access tokens.

## Calling the UserInfo endpoint

UserInfo is a standard OAuth Bearer token API – called like any other MS Graph API using the access token received when getting a token for MS Graph. It returns a JSON response containing claims about the user.

### Permissions

The following [OIDC permissions](v2-permissions-and-consent.md#openid-connect-scopes) are used to call this API. `openid` is required, and the `profile` and `email` scopes ensure that additional information is provided in the response.

|Permission type      | Permissions    |
|:--------------------|:---------------------------------------------------------|
|Delegated (work or school account) | openid (required), profile, email |
|Delegated (personal Microsoft account) | openid (required), profile, email |
|Application | Not applicable |

> [!TIP]
> Click or copy this URL in your browser to get a token for the UserInfo endpoint as well as an [ID token](id-tokens.md). Note that it only requests scopess for OpenID or Graph scopes, and nothing else.  This is required, since you cannot request permissions for two different resources in the same token request.
>
> `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=6731de76-14a6-49ae-97bc-6eba6914391e&response_type=token+id_token&redirect_uri=http%3A%2F%2Flocalhost%2Fmyapp%2F&scope=usr.read+openid+profile+email&response_mode=fragment&state=12345&nonce=678910`
>
> You can use this access token in the next section.

As with any other MS Graph token, the token you receive here may not be a JWT.  If you signed in a Microsoft account user, it will be an encrypted token format.   This is because MS Graph has a special token issuance pattern. This does not impact your ability to use the access token to call the UserInfo endpoint.

### Calling the API

The API supports both GET and POST, per the OIDC spec.

```http
GET or POST /oidc/userinfo HTTP/1.1
Host: graph.microsoft.com
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJub25jZSI6Il…..
```

### UserInfo response

```json
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
