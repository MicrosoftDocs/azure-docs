---
title: Reference for OAuth 2.0 authorizations - Azure API Management | Microsoft Docs
description: Reference for identity providers supported in authorizations in Azure API Management. API Management authorizations manage OAuth 2.0 authorization tokens to APIs.
author: dlepow
ms.service: api-management
ms.topic: reference
ms.date: 05/02/2022
ms.author: danlep
---

# Authorizations reference
This article is a reference for the supported identity providers in API Management [authorizations](authorizations-overview.md) and their configuration options.

## Azure Active Directory  

* **Supported grant types**: authorization code, client credentials 

* **Provider properties**

[!INCLUDE [api-management-authorization-azure-ad-provider](../../includes/api-management-authorization-azure-ad-provider.md)]

## Google, LinkedIn, Spotify, Dropbox, GitHub   

**Supported grant types**: authorization code

### Authorization provider - Authorization code grant type
| Name | Required | Description | Default |
|---|---|---|---|
| Provider name | Yes | Name of Authorization provider. | |
| Client id | Yes | The id used to identify this application with the service provider. | |
| Client secret | Yes | The shared secret used to authenticate this application with the service provider. ||
| Scopes | No | Scopes used for the authorization. Depending on the identity provider, multiple scopes are separated by space or comma. Default for most identity providers is space. |  | 


### Authorization - Authorization code grant type
| Name | Required | Description | Default |
|---|---|---|---|
| Authorization name | Yes | Name of Authorization. |  |

--- 

## Generic OAuth  

* **Supported grant types**: authorization code, client credentials

* **Provider options**: Generic OAuth 2, Generic OAuth 2 with PKCE

* **Provider properties** 

[!INCLUDE [api-management-authorization-generic-provider](../../includes/api-management-authorization-generic-provider.md)]


## Next steps

Learn more about [authorizations](authorizations-overview.md).