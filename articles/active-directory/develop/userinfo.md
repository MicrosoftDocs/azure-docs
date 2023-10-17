---
title: Microsoft identity platform UserInfo endpoint
description: Learn about the UserInfo endpoint on the Microsoft identity platform.
services: active-directory
author: Dickson-Mwendia
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: reference
ms.date: 08/26/2022
ms.author: dmwendia
ms.reviewer: ludwignick
ms.custom: aaddev
---

# Microsoft identity platform UserInfo endpoint

As part of the OpenID Connect (OIDC) standard, the [UserInfo endpoint](https://openid.net/specs/openid-connect-core-1_0.html#UserInfo) returns information about an authenticated user. 

## Find the .well-known configuration endpoint

You can find the UserInfo endpoint programmatically by reading the `userinfo_endpoint` field of the OpenID configuration document at `https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration`. We don't recommend hard-coding the UserInfo endpoint in your applications. Instead, use the OIDC configuration document to find the endpoint at runtime.

The UserInfo endpoint is typically called automatically by [OIDC-compliant libraries](https://openid.net/certified-open-id-developer-tools/) to get information about the user. From the [list of claims identified in the OIDC standard](https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims), the Microsoft identity platform produces the name claims, subject claim, and email when available and consented to. 

## Consider using an ID token instead

The information in an ID token is a superset of the information available on UserInfo endpoint. Because you can get an ID token at the same time you get a token to call the UserInfo endpoint, we suggest getting the user's information from the token instead of calling the UserInfo endpoint. Using the ID token instead of calling the UserInfo endpoint eliminates up to two network requests, reducing latency in your application.

If you require more details about the user like manager or job title, call the [Microsoft Graph `/user` API](/graph/api/user-get). You can also use [optional claims](./optional-claims.md) to include additional user information in your ID and access tokens.

## Calling the UserInfo endpoint

UserInfo is a standard OAuth bearer token API hosted by Microsoft Graph. Call the UserInfo endpoint as you would call any Microsoft Graph API by using the access token your application received when it requested access to Microsoft Graph. The UserInfo endpoint returns a JSON response containing claims about the user.

### Permissions

Use the following [OIDC permissions](./permissions-consent-overview.md#openid-connect-scopes) to call the UserInfo API. The `openid` claim is required, and the `profile` and `email` scopes ensure that additional information is provided in the response.

| Permission type                        | Permissions                       |
|:---------------------------------------|:----------------------------------|
| Delegated (work or school account)     | `openid` (required), `profile`, `email` |
| Delegated (personal Microsoft account) | `openid` (required), `profile`, `email` |
| Application                            | Not applicable                    |

> [!TIP]
> Copy this URL in your browser to get an access token for the UserInfo endpoint and an [ID token](id-tokens.md). Replace the client ID and redirect URI with values from an app registration.
>
> `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=<yourClientID>&response_type=token+id_token&redirect_uri=<YourRedirectUri>&scope=user.read+openid+profile+email&response_mode=fragment&state=12345&nonce=678910`
>
> You can use the access token that's returned in the query in the next section.

Microsoft Graph uses a special token issuance pattern that may impact your app's ability to read or validate it. As with any other Microsoft Graph token, the token you receive here may not be a JWT and your app should consider it opaque. If you signed in a Microsoft account user, it will be an encrypted token format. None of these factors, however, impact your app's ability to use the access token in a request to the UserInfo endpoint.

### Calling the API

The UserInfo API supports both GET and POST requests.

```http
GET or POST /oidc/userinfo HTTP/1.1
Host: graph.microsoft.com
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJub25jZSI6Il…
```

### UserInfo response

```jsonc
{
    "sub": "OLu859SGc2Sr9ZsqbkG-QbeLgJlb41KcdiPoLYNpSFA",
    "name": "Mikah Ollenburg", // all names require the “profile” scope.
    "family_name": " Ollenburg",
    "given_name": "Mikah",
    "picture": "https://graph.microsoft.com/v1.0/me/photo/$value",
    "email": "mikoll@contoso.com" // requires the “email” scope.
}
```

The claims shown in the response are all those that the UserInfo endpoint can return. These values are the same values included in an [ID token](id-tokens.md). 

## Notes and caveats on the UserInfo endpoint

You can't add to or customize the information returned by the UserInfo endpoint.

To customize the information returned by the identity platform during authentication and authorization, use [claims mapping](./saml-claims-customization.md) and [optional claims](./optional-claims.md) to modify security token configuration.

## Next steps

* [Review the contents of ID tokens](id-tokens.md).
* [Customize the contents of an ID token using optional claims](./optional-claims.md).
* [Request an access token and ID token using the OAuth 2 protocol](v2-protocols-oidc.md).
