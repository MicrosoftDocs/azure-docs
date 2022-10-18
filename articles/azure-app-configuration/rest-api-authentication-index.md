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

## Azure Active Directory

[Azure Active Directory (Azure AD) authentication](../active-directory/authentication/overview-authentication.md) utilizes a bearer token that is obtained from Azure Active Directory to authenticate requests. Details on how requests using this authentication method are authorized can be found in the [Azure AD authorization](./rest-api-authorization-azure-ad.md) section.