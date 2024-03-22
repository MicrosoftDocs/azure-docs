---
title: Azure App Configuration REST API - Authentication
description: Reference pages for authentication using the Azure App Configuration REST API
author: maud-lv
ms.author: malev
ms.service: azure-app-configuration
ms.topic: reference
ms.date: 08/17/2020
---

# Authentication

All HTTP requests must be authenticated. The following authentication schemes are supported.

## HMAC

[HMAC authentication](./rest-api-authentication-hmac.md) uses a randomly generated secret to sign request payloads. Details on how requests using this authentication method are authorized can be found in the [HMAC authorization](./rest-api-authorization-hmac.md) section.

<a name='azure-active-directory'></a>

## Microsoft Entra ID

[Microsoft Entra authentication](../active-directory/authentication/overview-authentication.md) utilizes a bearer token that is obtained from Microsoft Entra ID to authenticate requests. Details on how requests using this authentication method are authorized can be found in the [Microsoft Entra authorization](./rest-api-authorization-azure-ad.md) section.
