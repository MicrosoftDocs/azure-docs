---
title: Configure OAuth 2.0
titleSuffix: Azure API Management
description: Learn how to configure OAuth 2.0 to work with your self-hosted portal.
author: erikadoyle
ms.author: apimpm
ms.date: 11/30/2020
ms.service: api-management
ms.topic: how-to
---

# Configure OAuth 2.0

This article provides an example of what your Azure Active Directory endpoints and scope will look like as well as the callback URLs.

## Azure Active Directory example

**Authorization endpoint**

`https://login.microsoftonline.com/{tenantId}/oauth2/v2.0/authorize`

**Token endpoint**

`https://login.microsoftonline.com/{tenantId}/oauth2/v2.0/token`

**Scope**

`https://graph.microsoft.com/.default`

<img width="657" alt="oauth-config-example" src="https://user-images.githubusercontent.com/2320302/86863788-bef07d00-c080-11ea-98a9-f35ed4f77fd7.png">

## Callback URLs

**Authorization code grant flow**:

`/signin-oauth/code/callback/{authServerName}`

**Implicit grant flow**:

`/signin-oauth/implicit/callback`

## Next steps

This article is the last step in the process of creating a self-hosted developer portal. I you'd like to learn more about general information about the developer portal, see these articles:

- [Migrate to the new developer portal](developer-portal-deprecated-migration.md)

- [Authenticate with Azure AD](api-management-howto-aad.md)

- [Authenticate with Azure AD B2C](api-management-howto-aad-b2c.md)

- [Delegated authentication](api-management-howto-setup-delegation.md)


