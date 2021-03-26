---
title: Single sign-on (SSO) authentication to developer portal
titleSuffix: Azure API Management
description: Learn how to use single sign-on (SSO) authentication with your self-hosted developer portal in Azure API Management.
author: dlepow
ms.author: apimpm
ms.date: 03/25/2021
ms.service: api-management
ms.topic: how-to
---

# Single sign-on (SSO) authentication to self-hosted developer portal

Among other authentication methods, the developer portal supports single sign-on (SSO). To authenticate with this method, you need to make a call to `/signin-sso` with the token in the query parameter:

```html
https://contoso.com/signin-sso?token=[user-specific token]
```
## Generate user tokens
You can generate *user-specific tokens* (including admin tokens) using the [Get Shared Access Token](/rest/api/apimanagement/2019-12-01/user/getsharedaccesstoken) operation of the [API Management REST API](/rest/api/apimanagement/apimanagementrest/api-management-rest).

> [!NOTE]
> The token must be URL-encoded.

## Next steps

Learn more about the developer portal:

- [Azure API Management developer portal overview](api-management-howto-developer-portal.md)
- [Self-host the developer portal](developer-portal-self-host.md)