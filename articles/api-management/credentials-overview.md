---
title: About credential manager in Azure API Management
description: Learn about using credential manager in Azure API Management to create and manage credentials to backend SaaS APIs
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
> Currently, you can use credential manager to configure and manage token credentials (formerly called *authorizations*) for backend OAuth 2.0 APIs. Support for other types of API credentials is planned.


## Managing token credentials for OAuth

Using credential manager, you can greatly simplify the process of authenticating and authorizing users across one or more backend or SaaS services that use OAuth 2.0. Using API Management's credential manager, easily configure OAuth 2.0, consent, acquire tokens, cache tokens in a credential store, and refresh tokens without writing a single line of code. Use the token credentials to delegate authentication to your API Management instance. For background about the OAuth 2.0, see [Microsoft identity platform and OAuth 2.0 authorization code flow](/entra/identity-platform/v2-oauth2-auth-code-flow).

This feature enables APIs to be exposed with or without a subscription key, use OAuth 2.0 authorizations to the backend services, and reduce development costs in ramping up, implementing, and maintaining security features with service integrations.

:::image type="content" source="media/credentials-overview/overview-providers.png" alt-text="Diagram of API Management OAuth credentials and supported SaaS providers." border="true":::

### Example use cases

Using OAuth token credentials managed in API Management, customers can easily connect to SaaS providers or backend services that are using OAuth 2.0. Here are some examples:

* Easily connect to a SaaS backend by attaching the stored authorization token and proxying requests

* Proxy requests to an Azure App Service web app or Azure Functions backend by attaching the authorization token, which can later send requests to a SaaS backend applying transformation logic

* Proxy requests to GraphQL federation backends by attaching multiple access tokens to easily perform federation

* Expose a retrieve token endpoint, acquire a cached token, and call a SaaS backend on behalf of user from any compute, for example, a console app or Kubernetes daemon. Combine your favorite SaaS SDK in a supported language.

* Azure Functions unattended scenarios when connecting to multiple SaaS backends.

* Durable Functions gets a step closer to Logic Apps with SaaS connectivity.

* With token credentials, every API in API Management can act as a Logic Apps custom connector.


The credential manager supports the following scenarios, depending on whether the credential connection is preconfigured or created dynamically at runtime. 

* The **management** part in credential manager takes care of setting up and configuring a *credential provider* and its associated *credential store* for OAuth 2.0 tokens, enabling the consent flow for the identity provider, and setting up one or more *connections* for access to the credentials. For details, see [Process flow - management](credentials-process-flow.md#process-flow---management).


* The **runtime** part uses the [`get-authorization-context`](get-authorization-context-policy.md) policy to fetch and store the credential's access and refresh tokens. When a call comes into API Management, and the `get-authorization-context` policy is executed, it will first validate if the existing authorization token is valid. If the authorization token has expired, API Management uses an OAuth 2.0 flow to refresh the stored tokens from the identity provider. Then the access token is used to authorize access to the backend service. For details, see [Process flow - runtime](credentials-process-flow.md#process-flow---runtime).  
   
    During the policy execution, access to the tokens is also validated using access policies.

## When to use token credentials?

Use token credentials in the following three scenarios.

### Configuration scenario

After configuring the credential provider, its associated credential store, and a default credential connection, the API manager can test the credential. The API manager configures a test backend OAuth API to use the `get-authorization-context` using the instances's managed identity. Then API manager can then test the credential by calling the test API.

:::image type="content" source="media/credentials-overview/configuration-scenario.png" alt-text="Diagram of initial configuration scenario for token credential.":::


### Managed identity scenario

By default when a token credential is created, a connection is pre-configured and access is provided to the managed identity of the API Management instance. To use such a connection, different users may sign in to a client application such as a static web app, which then calls a backend API exposed through API Management. To make this call, credentials are applied using the `get-authorization-context` policy. Because the API call uses a pre-configured credential connection that's not related to the user context, the same data is returned to all users.

:::image type="content" source="media/credentials-overview/configuration-scenario.png" alt-text="Diagram of managed identity scenario for token credential.":::


### User-delegated scenario

To enable a simplified authentication experience for users of client applications, such as static web apps, that call backend SaaS APIs that require a user context, you can enable access to a token credential on behalf of a Microsoft Entra user or group identity. In this case, a configured user needs to login and provide consent one time only, and the API Management instance will manage their credential connections after that. When API Management gets an incoming call to be forwarded to an external service, it  attaches the access token credential to the request.     

Each time a new user logs in, a new credential connection is created. This connection is applied to an API call that is being made. So the API call is made on behalf of the connection you previously created, and user context is available.

:::image type="content" source="media/credentials-overview/configuration-scenario.png" alt-text="Diagram of user-delegated scenario for token credential.":::


## How to configure token credentials?

### Requirements

* Managed system-assigned identity must be enabled for the API Management instance.

* API Management instance must have outbound connectivity to internet on port 443 (HTTPS).

### Availability

* All API Management service tiers

* Not supported in self-hosted gateway

* Not supported in sovereign clouds or in the following regions: australiacentral, australiacentral2, indiacentral

## Security considerations

The access token and other secrets (for example, client secrets) are encrypted with an envelope encryption and stored in an internal, multitenant storage. The data are encrypted with AES-128 using a key that is unique per data. Those keys are encrypted asymmetrically with a master certificate stored in Azure Key Vault and rotated every month.

### Limits

| Resource | Limit |
| --------------------| ----|
| Maximum number of credential providers per service instance| 1,000 |
| Maximum number of credential connections per credential provider| 10,000 |
| Maximum number of access policies per credential connection | 100 |
| Maximum number of requests per minute per credential connection | 250 |


## Frequently asked questions (FAQ)


### When are the access tokens refreshed?

For a credential of type authorization code, access tokens are refreshed as follows: When the `get-authorization-context` policy is executed at runtime, API Management checks if the stored access token is valid. If the token has expired or is near expiry, API Management uses the refresh token to fetch a new access token and a new refresh token from the configured identity provider. If the refresh token has expired, an error is thrown, and the credential needs to be reauthorized before it will work.

### What happens if the client secret expires at the identity provider?

At runtime API Management can't fetch new tokens, and an error occurs. 

* If the credential is of type authorization code, the client secret needs to be updated on credential provider level.

* If the credential is of type client credentials, the client secret needs to be updated on credentials level.

### Is this feature supported using API Management running inside a VNet?

Yes, as long as outbound connectivity on port 443 is enabled to the **AzureConnectors** service tag. For more information, see [Virtual network configuration reference](virtual-network-reference.md#required-ports).

### What happens when a credential provider is deleted?

All underlying credentials and access policies are also deleted.

### Are the access tokens cached by API Management?

In the dedicated service tiers, the access token is cached by the API management until 3 minutes before the token expiration time. Access tokens aren't cached in the Consumption tier.

## Related content

Learn how to:
- Configure [identity providers](credentials-configure-common-providers.md) for credentials
- Configure and use a credential for the [Microsoft Graph API](credentials-how-to-azure-ad.md) or the [GitHub API](credentials-how-to-github.md)
- Configure [multiple authorization connections](configure-credential-connection.md) for a provider
