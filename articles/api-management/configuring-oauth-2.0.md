---
title: placeholder title
description: placeholder description text
author: apimpm
ms.author: edoyle
ms.date: 11/30/2020
ms.service: api-management
ms.topic: how-to
---

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
