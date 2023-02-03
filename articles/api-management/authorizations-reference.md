---
title: Reference for OAuth 2.0 authorizations - Azure API Management | Microsoft Docs
description: Reference for identity providers supported in authorizations in Azure API Management. API Management authorizations manage OAuth 2.0 authorization tokens to backend APIs.
author: dlepow
ms.service: api-management
ms.topic: reference
ms.date: 05/02/2022
ms.author: danlep
---

# Authorizations reference
This article is a reference for the supported identity providers in API Management [authorizations](authorizations-overview.md) and their configuration settings.

For steps to configure an OAuth app in the identity provider, see the linked documentation for each provider.

* Minimally, you will need the app's client ID and client secret to configure an authorization provider in API Management.
* Depending on the provider and your scenario, you may need other identity provider-specific settings, such as scopes or configuration endpoints.

## Azure Active Directory  

* **Supported grant types**: authorization code, client credentials 

* **Documentation for OAuth app**: [Microsoft Learn](/azure/active-directory/develop/)

* **Provider configuration**

    [!INCLUDE [api-management-authorization-azure-ad-provider](../../includes/api-management-authorization-azure-ad-provider.md)]


## Dropbox

* **Supported grant types**: authorization code 

* **Documentation for OAuth app**: [Dropbox Developers](https://www.dropbox.com/developers/apps)

* **Provider configuration**

    [!INCLUDE [api-management-authorization-default-provider](../../includes/api-management-authorization-default-provider.md)]

## Generic OAuth  

* **Supported grant types**: authorization code, client credentials

* **Provider options**: Generic OAuth 2, Generic OAuth 2 with PKCE

* **Provider configuration** 

    [!INCLUDE [api-management-authorization-generic-provider](../../includes/api-management-authorization-generic-provider.md)]

## GitHub

* **Supported grant types**: authorization code 

* **Documentation for OAuth app**: [GitHub Developers](https://docs.github.com/developers)

* **Provider configuration**

    [!INCLUDE [api-management-authorization-default-provider](../../includes/api-management-authorization-default-provider.md)]


## Google    

**Supported grant types**: authorization code

**Documentation for OAuth app**: [Google Cloud](https://console.developers.google.com/apis/dashboard)

**Provider configuration**

   [!INCLUDE [api-management-authorization-default-provider](../../includes/api-management-authorization-default-provider.md)]

## LinkedIn

**Supported grant types**: authorization code

**Documentation for OAuth app**: [LinkedIn Developers](https://developer.linkedin.com/)

**Provider configuration**

   [!INCLUDE [api-management-authorization-default-provider](../../includes/api-management-authorization-default-provider.md)]

## Salesforce

**Supported grant types**: authorization code

**Documentation for OAuth app**: [LinkedIn Developers](https://developer.linkedin.com/)

**Provider configuration**

   [!INCLUDE [api-management-authorization-salesforce-provider](../../includes/api-management-authorization-salesforce-provider.md)]


## ServiceNow

**Supported grant types**: authorization code

**Documentation for OAuth app**: [ServiceNow Developers](https://developer.linkedin.com/)

**Provider configuration**

   [!INCLUDE [api-management-authorization-servicenow-provider](../../includes/api-management-authorization-servicenow-provider.md)]


## Spotify

**Supported grant types**: authorization code

**Documentation for OAuth app**: [Spotify Developers](https://developer.spotify.com/)    

   [!INCLUDE [api-management-authorization-default-provider](../../includes/api-management-authorization-default-provider.md)]

**Provider configuration**

## Stripe

**Supported grant types**: authorization code

**Documentation for OAuth app**: [Stripe Developers](https://stripe.com/docs/development)

**Provider configuration**

   [!INCLUDE [api-management-authorization-default-provider](../../includes/api-management-authorization-default-provider.md)]


## Twitter

**Supported grant types**: authorization code with PKCE

**Documentation for OAuth app**: [Twitter Developers](https://developer.twitter.com/)

**Provider configuration**

   [!INCLUDE [api-management-authorization-default-provider](../../includes/api-management-authorization-default-provider.md)]

## Zendesk

**Supported grant types**: authorization code

**Documentation for OAuth app**: [Zendesk Developers](https://developer.twitter.com/)

**Provider configuration**

   [!INCLUDE [api-management-authorization-zendesk-provider](../../includes/api-management-authorization-zendesk-provider.md)]


## Next steps

Learn more about [authorizations](authorizations-overview.md)