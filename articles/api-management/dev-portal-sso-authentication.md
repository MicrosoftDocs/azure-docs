---
title: SSO authentication in developer portal
titleSuffix: Azure API Management
description: Learn how to use single sign-on (SSO) authentication with your self-hosted developer portal.
author: dlepow
ms.author: apimpm
ms.date: 02/15/2021
ms.service: api-management
ms.topic: how-to
---

# SSO authentication in developer portal

Among other authentication methods, the developer portal supports single sign-on (SSO).

## Authenticate with SSO

To authenticate with this method, you need to make a call to `/signin-sso` with the token in the query parameter:

```http
https://contoso.com/signin-sso?token=<user-specific token>
```

> [!NOTE]
> The token must be URL-encoded.

You can generate a user-specific token (including admin tokens) using the [Get Shared Access Token](/rest/api/apimanagement/2019-12-01/user/getsharedaccesstoken) operation of the [API Management REST API](/rest/api/apimanagement/apimanagementrest/api-management-rest).

## Next steps

- [Configuring OAuth 2.0](dev-portal-configure-oauth-2-0.md)
