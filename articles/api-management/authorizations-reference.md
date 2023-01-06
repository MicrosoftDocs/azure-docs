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
This article is a reference for the supported identity providers in API Management [authorizations](authorizations-overview.md) (preview) and their configuration options.

## Azure Active Directory  


**Supported grant types**: authorization code and client credentials 


### Authorization provider - Authorization code grant type

| Name | Required | Description | Default |
|---|---|---|---|
| Provider name | Yes | Name of Authorization provider. | |
| Client id | Yes | The id used to identify this application with the service provider. | |
| Client secret | Yes | The shared secret used to authenticate this application with the service provider. ||
| Login URL | No | The Azure Active Directory login URL. | https://login.windows.net |
| Tenant ID | No | The tenant ID of your Azure Active Directory application. | common |  
| Resource URL | Yes | The resource to get authorization for. |  | 
| Scopes | No | Scopes used for the authorization. Multiple scopes could be defined separate with a space, for example, "User.Read User.ReadBasic.All" |  | 


### Authorization - Authorization code grant type
| Name | Required | Description | Default |
|---|---|---|---|
| Authorization name | Yes | Name of Authorization. |  | 

--- 

### Authorization provider - Client credentials code grant type
| Name | Required | Description | Default |
|---|---|---|---|
| Provider name | Yes | Name of Authorization provider. | |
| Login URL | No | The Azure Active Directory login URL. | https://login.windows.net |
| Tenant ID | No | The tenant ID of your Azure Active Directory application. | common |  
| Resource URL | Yes | The resource to get authorization for. |  | 


### Authorization - Client credentials code grant type
| Name | Required | Description | Default |
|---|---|---|---|
| Authorization name | Yes | Name of Authorization. |  | 
| Client id | Yes | The id used to identify this application with the service provider. | |
| Client secret | Yes | The shared secret used to authenticate this application with the service provider. ||

--- 

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

## Generic OAuth 2  

**Supported grant types**: authorization code


### Authorization provider - Authorization code grant type
| Name | Required | Description | Default |
|---|---|---|---|
| Provider name | Yes | Name of Authorization provider. | |
| Client id | Yes | The id used to identify this application with the service provider. | |
| Client secret | Yes | The shared secret used to authenticate this application with the service provider. ||
| Authorization URL | No | The authorization endpoint URL. | |
| Token URL | No | The token endpoint URL. |  |  
| Refresh URL | No | The token refresh endpoint URL. |  | 
| Scopes | No | Scopes used for the authorization. Depending on the identity provider, multiple scopes are separated by space or comma. Default for most identity providers is space. |  | 


### Authorization - Authorization code grant type
| Name | Required | Description | Default |
|---|---|---|---|
| Authorization name | Yes | Name of Authorization. |  | 

## Next steps

Learn more about [authorizations](authorizations-overview.md) and how to [create and use authorizations](authorizations-how-to.md)
