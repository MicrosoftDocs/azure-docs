---
title: Configure authorization providers - Azure API Management | Microsoft Docs
description: Learn how to configure common identity providers for authorizations in Azure API Management. Example providers are Azure Active Directory and a generic OAuth 2.0 provider. An authorization manages authorization tokens to an OAuth 2.0 backend service. 
services: api-management
author: dlepow
ms.service: api-management
ms.topic: how-to
ms.date: 02/07/2023
ms.author: danlep
---

# Configure identity providers for API authorizations

In this article, you learn about configuring identity providers for [authorizations](authorizations-overview.md) in your API Management instance. Settings for the following common providers are shown:

* Azure AD provider
* Generic OAuth 2.0 provider

You add identity provider settings when configuring an authorization in your API Management instance. For a step-by-step example of configuring an Azure AD provider and authorization, see:

* [Create an authorization with the Microsoft Graph API](authorizations-how-to-azure-ad.md)

## Prerequisites

To configure any of the supported providers in API Management, first configure an OAuth 2.0 app in the identity provider that will be used to authorize API access. For configuration details, see the provider's developer documentation.

* If you're creating an authorization that uses the authorization code grant type, configure a **Redirect URL** (sometimes called Authorization Callback URL or a similar name) in the app. For the value, enter `https://authorization-manager.consent.azure-apim.net/redirect/apim/<YOUR-APIM-SERVICENAME>`.

* Depending on your scenario, configure app settings such as scopes (API permissions).
    
* Minimally, retrieve the following app credentials that will be configured in API Management: the app's **client id** and **client secret**.

* Depending on the provider and your scenario, you might need to retrieve other settings such as authorization endpoint URLs or scopes.

## Azure AD provider

Authorizations support the Azure AD identity provider, which is the identity service in Microsoft Azure that provides identity management and access control capabilities. It allows users to securely sign in using industry-standard protocols.

* **Supported grant types**: authorization code, client credentials

> [!NOTE]
>  Currently, the Azure AD authorization provider supports only the Azure AD v1.0 endpoints.
 

### Azure AD provider settings
    
[!INCLUDE [api-management-authorization-azure-ad-provider](../../includes/api-management-authorization-azure-ad-provider.md)]


## Generic OAuth 2.0 providers

Authorizations support two generic providers:
* Generic OAuth 2.0
* Generic OAuth 2.0 with PKCE 

A generic provider allows you to use your own OAuth 2.0 identity provider based on your specific needs. 

> [!NOTE]
> We recommend using the generic OAuth 2.0 with PKCE provider for improved security if your identity provider supports it. [Learn more](https://oauth.net/2/pkce/)

* **Supported grant types**: authorization code, client credentials

### Generic authorization provider settings

[!INCLUDE [api-management-authorization-generic-provider](../../includes/api-management-authorization-generic-provider.md)]

## Other identity providers

API Management supports several providers for popular SaaS offerings, such as GitHub. You can select from a list of these providers in the Azure portal when you create an authorization.

:::image type="content" source="media/authorizations-configure-common-providers/saas-providers.png" alt-text="Screenshot of identity providers listed in the portal.":::

**Supported grant types**: authorization code, client credentials (depends on provider)

Required settings for these providers differ from provider to provider but are similar to those for the [generic OAuth 2.0 providers](#generic-oauth-20-providers). Consult the developer documentation for each provider.

## Next steps

* Learn more about [authorizations](authorizations-overview.md) in API Management.
* Create an authorization for [Azure AD](authorizations-how-to-azure-ad.md) or [GitHub](authorizations-how-to-github.md).