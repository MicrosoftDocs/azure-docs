---
title: placeholder title
description: placeholder description text
author: apimpm
ms.author: edoyle
ms.date: 11/30/2020
ms.service: api-management
ms.topic: how-to
---

Among other authentication methods, the Developer portal supports Single Sign-On (SSO). In order to authenticate with this method you need to make a call to `/signin-sso` with the token in the query parameter:
```
https://contoso.com/signin-sso?token=[user-specific token]
```
You can generate *user-specific token* (including admin tokens) using [Get Shared Access Token](https://docs.microsoft.com/en-us/rest/api/apimanagement/2019-12-01/user/getsharedaccesstoken) operation of [API Management REST API](https://docs.microsoft.com/rest/api/apimanagement/apimanagementrest/api-management-rest).

**Note:** The token must be URL-encoded.
