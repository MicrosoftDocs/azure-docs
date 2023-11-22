---
title: About credential manager in Azure API Management
description: Learn about using credential manager in Azure API Management to create and manage connections to backend SaaS APIs
author: dlepow
ms.service: api-management
ms.topic: conceptual
ms.date: 11/14/2023
ms.author: danlep
ms.custom: references_regions
---

# About API credentials and credential manager

To help you manage access to backend APIs, your API Management instance includes a *credential manager*. Use credential manager to manage, store, and control access to API credentials from your API Management instance.

> [!NOTE]
> * Currently, you can use credential manager to configure and manage connections (formerly called *authorizations*) for backend OAuth 2.0 APIs. 
> * No breaking changes are introduced with credential manager. OAuth 2.0 credential providers and connections use the existing API Management [authorization](/rest/api/apimanagement/authorization) APIs and resource provider.

## Managed connections for OAuth 2.0 APIs

Using credential manager, you can greatly simplify the process of authenticating and authorizing users, groups, and service principals across one or more backend or SaaS services that use OAuth 2.0. Using API Management's credential manager, easily configure OAuth 2.0, consent, acquire tokens, cache tokens in a credential store, and refresh tokens without writing a single line of code. Use access policies to delegate authentication to your API Management instance, service principals, users, or groups. For background about the OAuth 2.0, see [Microsoft identity platform and OAuth 2.0 authorization code flow](/entra/identity-platform/v2-oauth2-auth-code-flow).

This feature enables APIs to be exposed with or without a subscription key, use OAuth 2.0 authorizations for backend services, and reduce development costs in ramping up, implementing, and maintaining security features with service integrations.

:::image type="content" source="media/credentials-overview/overview-providers.png" alt-text="Diagram of API Management credential manager and supported SaaS identity providers." border="true":::

### Example use cases

Using OAuth connections managed in API Management, customers can easily connect to SaaS providers or backend services that are using OAuth 2.0. Here are some examples:

* Easily connect to a SaaS backend by attaching the stored authorization token and proxying requests

* Proxy requests to an Azure App Service web app or Azure Functions backend by attaching the authorization token, which can later send requests to a SaaS backend applying transformation logic

* Proxy requests to GraphQL federation backends by attaching multiple access tokens to easily perform federation

* Expose a retrieve token endpoint, acquire a cached token, and call a SaaS backend on behalf of user from any compute, for example, a console app or Kubernetes daemon. Combine your favorite SaaS SDK in a supported language.

* Azure Functions unattended scenarios when connecting to multiple SaaS backends.

* Durable Functions gets a step closer to Logic Apps with SaaS connectivity.

* With OAuth 2.0 connections, every API in API Management can act as a Logic Apps custom connector.

## How does credential manager work?

Token credentials in credential manager consist of two parts: **management** and **runtime**.

* The **management** part in credential manager takes care of setting up and configuring a *credential provider* for OAuth 2.0 tokens, enabling the consent flow for the identity provider, and setting up one or more *connections* to the credential provider for access to the credentials. For details, see [Management of connections](credentials-process-flow.md#management-of-connections).


* The **runtime** part uses the [`get-authorization-context`](get-authorization-context-policy.md) policy to fetch and store the connection's access and refresh tokens. When a call comes into API Management, and the `get-authorization-context` policy is executed, it first validates if the existing authorization token is valid. If the authorization token has expired, API Management uses an OAuth 2.0 flow to refresh the stored tokens from the identity provider. Then the access token is used to authorize access to the backend service. For details, see [Runtime of connections](credentials-process-flow.md#runtime-of-connections).  
   
## When to use credential manager?

The following are three scenarios for using credential manager.

### Configuration scenario

After configuring the credential provider and a connection, the API manager can test the connection. The API manager configures a test backend OAuth API to use the `get-authorization-context` policy using the instance's managed identity. The API manager can then test the connection by calling the test API.

:::image type="content" source="media/credentials-overview/configuration-scenario.png" alt-text="Diagram of initial configuration scenario for credential manager.":::


### Managed identity scenario

By default when a connection is created, an access policy is preconfigured for the managed identity of the API Management instance. To use such a connection, different users may sign in to a client application such as a static web app, which then calls a backend API exposed through API Management. To make this call, connections are applied using the `get-authorization-context` policy. Because the API call uses a preconfigured connection that's not related to the user context, the same data is returned to all users.

:::image type="content" source="media/credentials-overview/managed-identity-scenario.png" alt-text="Diagram of managed identity scenario for credential manager.":::


### User-delegated scenario

To enable a simplified authentication experience for users of client applications, such as static web apps, that call backend SaaS APIs that require a user context, you can enable access to a connection on behalf of a Microsoft Entra user or group identity. In this case, a configured user needs to login and provide consent only once, and the API Management instance will manage their connection after that. When API Management gets an incoming call to be forwarded to an external service, it attaches the access token from the connection to the request. This is ideal for when API requests and responses are geared towards an individual (for example, retrieving user-specific profile information).

:::image type="content" source="media/credentials-overview/user-delegated-scenario.png" alt-text="Diagram of user-delegated scenario for credential manager.":::

## How to configure credential manager?

### Requirements

* Managed system-assigned identity must be enabled for the API Management instance.

* API Management instance must have outbound connectivity to internet on port 443 (HTTPS).

### Availability

* All API Management service tiers

* Not supported in self-hosted gateway

* Not supported in sovereign clouds or in the following regions: australiacentral, australiacentral2, indiacentral

### Step-by-step examples

* [Configure credential manager - GitHub API](credentials-how-to-github.md)
* [Configure credential manager - Microsoft Graph API](credentials-how-to-azure-ad.md)
* [Configure credential manager - user-delegated access](credentials-how-to-user-delegated.md)

## Security considerations

The access token and other secrets (for example, client secrets) are encrypted with an envelope encryption and stored in an internal, multitenant storage. The data are encrypted with AES-128 using a key that is unique per data. Those keys are encrypted asymmetrically with a master certificate stored in Azure Key Vault and rotated every month.

### Limits

| Resource | Limit |
| --------------------| ----|
| Maximum number of credential providers per service instance| 1,000 |
| Maximum number of connections per credential provider| 10,000 |
| Maximum number of access policies per connection | 100 |
| Maximum number of authorization requests per minute per connection | 250 |


## Frequently asked questions (FAQ)


### When are the access tokens refreshed?

For a connection of type authorization code, access tokens are refreshed as follows: When the `get-authorization-context` policy is executed at runtime, API Management checks if the stored access token is valid. If the token has expired or is near expiry, API Management uses the refresh token to fetch a new access token and a new refresh token from the configured identity provider. If the refresh token has expired, an error is thrown, and the connection needs to be reauthorized before it will work.

### What happens if the client secret expires at the identity provider?

At runtime API Management can't fetch new tokens, and an error occurs. 

* If the connection is of type authorization code, the client secret needs to be updated on credential provider level.

* If the connection is of type client credentials, the client secret needs to be updated on the connection level.

### Is this feature supported using API Management running inside a VNet?

Yes, as long as outbound connectivity on port 443 is enabled to the **AzureConnectors** service tag. For more information, see [Virtual network configuration reference](virtual-network-reference.md#required-ports).

### What happens when a credential provider is deleted?

All underlying connections and access policies are also deleted.

### Are the access tokens cached by API Management?

In the dedicated service tiers, the access token is cached by the API Management instance until 3 minutes before the token expiration time. If the access token is less than 3 minutes away from expiration, the cached time will be until the access token expires.

Access tokens aren't cached in the Consumption tier.

## Related content

- Configure [credential providers](credentials-configure-common-providers.md) for connections
- Configure and use a connection for the [Microsoft Graph API](credentials-how-to-azure-ad.md) or the [GitHub API](credentials-how-to-github.md)
- Configure a connection for [user-delegated access](credentials-how-to-user-delegated.md)
- Configure [multiple connections](configure-credential-connection.md) for a credential provider
