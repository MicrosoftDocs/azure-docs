---
title: Configure common authorization providers - Azure API Management | Microsoft Docs
description: Learn how to configure common identity providers for authorizations in Azure API Management. Example providers are Azure Active Directory and a generic OAuth 2.0 provider. An authorization manages authorization tokens to an OAuth 2.0 backend service. 
services: api-management
author: dlepow
ms.service: api-management
ms.topic: how-to
ms.date: 02/01/2023
ms.author: danlep
---

# Configure common identity providers for API authorizations

In this article, you learn how to configure common identity providers for [authorizations](authorizations-overview.md) in API Management. The following examples are shown:

* Azure AD provider
* Generic OAuth 2.0 provider

For more supported providers and configuration settings, see [Authorizations reference](authorizations-reference.md).

## Azure AD provider

Authorizations supports the Azure AD identity provider, which is the identity service in Microsoft Azure that provides identity management and access control capabilities. It allows users to securely sign in using industry-standard protocols.

### Prerequisites

* Register an Azure AD app that will be used to manage API authorization. For steps, see [Quickstart: Register an application with the Microsoft identity platform](../active-directory/develop/quickstart-register-app.md).

    * Set the **Redirect URI** to **Web**, and enter `https://authorization-manager.consent.azure-apim.net/redirect/apim/<YOUR-APIM-SERVICENAME>`, substituting the name of the API Management service where you will configure the authorization provider

    * Configure required **API permissions** for your scenario

    * Configure a **Client secret**

Learn more about [authorization code](../active-directory/develop/v2-oauth2-auth-code-flow.md) and [client credentials](../active-directory/develop/v2-oauth2-client-creds-grant-flow.md) grant types (flows) in the Microsoft identity platform.

### Configure authorization provider properties

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to your API Management instance.
1. On the left menu, select **Authorizations** and then select **+ Create**.
1. Set the properties in the following table:
    
    [!INCLUDE [api-management-authorization-azure-ad-provider](../../includes/api-management-authorization-azure-ad-provider.md)]

1. Continue with the steps to authorize the identity provider and to configure an access policy.

## Generic OAuth 2.0 providers

Authorizations supports two generic providers:
* Generic OAuth 2.0
* Generic OAuth 2.0 with PKCE 

A generic provider allows you to use your own OAuth 2.0 identity provider based on your specific needs. 

> [!NOTE]
> We recommend using the OAuth 2.0 with PKCE provider for security purposes if your identity provider supports it.

### Prerequisites

Configure an OAuth 2.0 app in the identity provider to manage API authorizations. Configuration steps depend on the identity provider. 

### Configure authorization provider properties

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to your API Management instance.
1. On the left menu, select **Authorizations** and then select **+ Create**.
1. Set the properties in the following table:

    [!INCLUDE [api-management-authorization-generic-provider](../../includes/api-management-authorization-generic-provider.md)]

1. Continue with the steps to authorize the identity provider and to configure an access policy.

## Next steps

For end-to-end examples of configuring an authorization and using it to manage access to an API, see:

* [Create an authorization with the Microsoft Graph API](authorizations-how-to-azure-ad.md)
* [Create an authorization with the GitHub API](authorizations-how-to-github.md)