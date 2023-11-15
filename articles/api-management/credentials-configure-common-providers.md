---
title: Configure credential providers - Azure API Management | Microsoft Docs
description: Learn how to configure common credential providers in Azure API Management's credential manager. Example providers are Microsoft Entra ID and generic OAuth 2.0.  
services: api-management
author: dlepow
ms.service: api-management
ms.topic: how-to
ms.date: 11/10/2023
ms.author: danlep
---

# Configure common credential providers in credential manager

In this article, you learn about configuring identity providers for managed [connections](credentials-overview.md) in your API Management instance. Settings for the following common providers are shown:

* Microsoft Entra provider
* Generic OAuth 2.0 provider

You configure a credential provider in your API Management instance's credential manager. For a step-by-step example of configuring a Microsoft Entra provider and connection, see:

* [Configure credential manager - Microsoft Graph API](authorizations-how-to-azure-ad.md)

## Prerequisites

To configure any of the supported providers in API Management, first configure an OAuth 2.0 app in the identity provider that will be used to authorize API access. For configuration details, see the provider's developer documentation.

* If you're creating a credential provider that uses the authorization code grant type, configure a **Redirect URL** (sometimes called Authorization Callback URL or a similar name) in the app. For the value, enter `https://authorization-manager.consent.azure-apim.net/redirect/apim/<YOUR-APIM-SERVICENAME>`.

* Depending on your scenario, configure app settings such as scopes (API permissions).
    
* Minimally, retrieve the following app credentials that will be configured in API Management: the app's **client ID** and **client secret**.

* Depending on the provider and your scenario, you might need to retrieve other settings such as authorization endpoint URLs or scopes.

## Microsoft Entra provider

API credentials support the Microsoft Entra identity provider, which is the identity service in Microsoft Azure that provides identity management and access control capabilities. It allows users to securely sign in using industry-standard protocols.

* **Supported grant types**: authorization code, client credentials

> [!NOTE]
>  Currently, the Microsoft Entra credential provider supports only the Azure AD v1.0 endpoints.
 

### Microsoft Entra provider settings
    
[!INCLUDE [api-management-authorization-azure-ad-provider](../../includes/api-management-authorization-azure-ad-provider.md)]


## Generic OAuth 2.0 providers

You can use two generic providers for configuring connections:

* Generic OAuth 2.0
* Generic OAuth 2.0 with PKCE 

A generic provider allows you to use your own OAuth 2.0 identity provider based on your specific needs. 

> [!NOTE]
> We recommend using the generic OAuth 2.0 with PKCE provider for improved security if your identity provider supports it. [Learn more](https://oauth.net/2/pkce/)

* **Supported grant types**: authorization code, client credentials

### Generic credential provider settings

[!INCLUDE [api-management-authorization-generic-provider](../../includes/api-management-authorization-generic-provider.md)]

## Other identity providers

API Management supports several providers for popular SaaS offerings, including GitHub, LinkedIn, and others. You can select from a list of these providers in the Azure portal when you create a credential provider.

:::image type="content" source="media/credentials-configure-common-providers/saas-providers.png" alt-text="Screenshot of identity providers listed in the portal.":::

**Supported grant types**: authorization code, client credentials (depends on provider)

Required settings for these providers differ from provider to provider but are similar to those for the [generic OAuth 2.0 providers](#generic-oauth-20-providers). Consult the developer documentation for each provider.

## Related content

* Learn more about managing [connections](credentials-overview.md) in API Management.
* Create a connection for [Microsoft Entra ID](authorizations-how-to-azure-ad.md) or [GitHub](authorizations-how-to-github.md).
