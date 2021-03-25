---
title: Configure OAuth 2.0 for self-hosted developer portal
titleSuffix: Azure API Management
description: Learn how to configure OAuth 2.0 to work with your self-hosted developer portal in Azure API Management.
author: dlepow
ms.author: apimpm
ms.date: 03/25/2021
ms.service: api-management
ms.topic: how-to
---

# Configure OAuth 2.0 for self-hosted developer portal

This article provides an example of what your Azure Active Directory endpoints and scope will look like as well as the callback URLs when configuring OAuth 2.0 for a sel-hosted developer portal..

## Azure Active Directory example

**Authorization endpoint**:

```http
https://login.microsoftonline.com/{tenantId}/oauth2/v2.0/authorize
```

**Token endpoint**:

```http
https://login.microsoftonline.com/{tenantId}/oauth2/v2.0/token
```

**Scope**:
```http
https://graph.microsoft.com/.default
```

`https://graph.microsoft.com/.default`

:::image type="content" source="media/developer-portal-configure-oauth-2-0/configure-oauth.png" alt-text="OAuth configuration example":::

## Callback URLs

**Authorization code grant flow**:

```http
/signin-oauth/code/callback/{authServerName}
```

**Implicit grant flow**:

```http
/signin-oauth/implicit/callback
```

## Next steps

- [Migrate to the new developer portal](developer-portal-deprecated-migration.md)

- [Authenticate with Azure AD](api-management-howto-aad.md)

- [Authenticate with Azure AD B2C](api-management-howto-aad-b2c.md)

- [Delegated authentication](api-management-howto-setup-delegation.md)


