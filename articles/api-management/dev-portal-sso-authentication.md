---
title: Single sign-on (SSO) authentication
titleSuffix: Azure API Management
description: Learn how to use single sign-on (SSO) authentication with your self-hosted developer portal.
author: erikadoyle
ms.author: apimpm
ms.date: 11/30/2020
ms.service: api-management
ms.topic: how-to
---

# Single sign-on (SSO) authentication

Among other authentication methods, the Developer portal supports Single sign-on (SSO). In order to authenticate with this method you need to make a call to `/signin-sso` with the token in the query parameter:
```
https://contoso.com/signin-sso?token=[user-specific token]
```
You can generate *user-specific token* (including admin tokens) using [Get Shared Access Token](/rest/api/apimanagement/2019-12-01/user/getsharedaccesstoken) operation of [API Management REST API](/rest/api/apimanagement/apimanagementrest/api-management-rest).

> [!NOTE]
> The token must be URL-encoded.

## Next steps

- [Configuring OAuth 2.0](dev-portal-configure-oauth-2-0.md)
