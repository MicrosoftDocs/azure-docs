---
title: Configure Credential Providers - Azure API Management | Microsoft Docs
description: Learn how to configure common credential providers in the Azure API Management credential manager. Providers include Microsoft Entra and generic OAuth.  
services: api-management
author: dlepow
ms.service: azure-api-management
ms.topic: how-to
ms.date: 12/05/2025
ms.author: danlep
ms.custom: sfi-image-nochange
# Customer intent: As an Azure service administrator, I want to learn how to configure common credential providers in the API Management credential manager.
---

# Configure common credential providers in credential manager

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

In this article, you learn about configuring identity providers for managed [connections](credentials-overview.md) in your Azure API Management instance. Settings for the following common providers are shown:

* Microsoft Entra 
* Generic OAuth 2

You configure a credential provider in the credential manager in your API Management instance. For a step-by-step example of configuring a Microsoft Entra provider and connection, see [Configure credential manager - Microsoft Graph API](authorizations-how-to-azure-ad.md).

## Prerequisites

To configure any of the supported providers in API Management, first configure an OAuth 2.0 app in the identity provider that will be used to authorize API access. For configuration details, see the provider's developer documentation.

* If you're creating a credential provider that uses the authorization code grant type, configure a redirect URL (sometimes called an Authorization Callback URL or a similar name) in the app. For the value, enter `https://authorization-manager.consent.azure-apim.net/redirect/apim/<API-management-instance-name>`.

* Depending on your scenario, configure app settings like scopes (API permissions).
    
* Minimally, retrieve the following app credentials that will be configured in API Management: the app's **client ID** and **client secret**.

* Depending on the provider and your scenario, you might need to retrieve other settings, like authorization endpoint URLs or scopes.

* The provider's authorization endpoints must be reachable over the internet from your API Management instance. If your API Management instance is secured in a virtual network, configure network or firewall rules to allow access to the provider's endpoints.

## Microsoft Entra provider

API Management credential manager supports the Microsoft Entra identity provider, which is the identity service in Azure that provides identity management and access control capabilities. It enables users to securely sign in via industry-standard protocols.

**Supported grant types**: authorization code, client credentials

> [!NOTE]
>  Currently, the Microsoft Entra credential provider supports only Azure Active Directory v1.0 endpoints.
 

### Microsoft Entra provider settings
    
[!INCLUDE [api-management-authorization-azure-ad-provider](../../includes/api-management-authorization-azure-ad-provider.md)]


## Generic OAuth providers

You can use three generic providers for configuring connections:

* Generic OAuth 2.0
* Generic OAuth 2.0 with PKCE 
* Generic OAuth 2.1 with PKCE with DCR

A generic provider enables you to use your own OAuth identity provider, based on your specific needs. 

> [!NOTE]
> We recommend using a PKCE provider for improved security if your identity provider supports it. For more information, see [Proof Key for Code Exchange](https://oauth.net/2/pkce/).

**Supported grant types**: authorization code, client credentials (depends on provider)

### Generic credential provider settings

[!INCLUDE [api-management-authorization-generic-provider](../../includes/api-management-authorization-generic-provider.md)]

## Other identity providers

API Management supports several providers for popular SaaS offerings, including GitHub, LinkedIn, and others. You can select from a list of these providers in the Azure portal when you create a credential provider.

:::image type="content" source="media/credentials-configure-common-providers/saas-providers.png" alt-text="Screenshot of identity providers listed in the portal.":::

**Supported grant types**: authorization code 

Required settings for these providers differ, depending on the provider, but are similar to those for the [generic OAuth providers](#generic-oauth-providers). Consult the developer documentation for each provider.

> [!NOTE]
> Currently, the Salesforce provider doesn't include an expiry claim in its tokens. As a result, Credential Manager can't detect when these tokens expire and doesn't expose a mechanism to force refresh. With the Salesforce provider, you need custom refresh logic to manually reauthorize the connection to get a new token when the current token expires.


## Related content

* Learn more about managing [connections](credentials-overview.md) in API Management.
* Create a connection for [Microsoft Graph API](credentials-how-to-azure-ad.md) or [GitHub API](credentials-how-to-github.md).
