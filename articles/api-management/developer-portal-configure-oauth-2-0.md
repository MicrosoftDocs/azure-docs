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

This article provides an example of configuring OAuth 2.0 for a self-hosted developer portal. The example includes the Azure Active Directory endpoints and scope, and the callback URLs.

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

:::image type="content" source="media/developer-portal-configure-oauth-2-0/configure-oauth.png" alt-text="Screenshot of OAuth configuration":::

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

Learn more about the developer portal:

- [Azure API Management developer portal overview](api-management-howto-developer-portal.md)
- [Self-host the developer portal](developer-portal-self-host.md)

