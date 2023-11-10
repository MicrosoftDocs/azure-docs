---
title: About API authorizations in Azure API Management
description: Learn about API authorizations in Azure API Management, a feature that simplifies the process of managing OAuth 2.0 authorization tokens to backend SaaS APIs
author: dlepow
ms.service: api-management
ms.topic: conceptual
ms.date: 04/10/2023
ms.author: danlep
ms.custom: references_regions
---

# What are API authorizations?

API Management *authorizations* provide a simple and reliable way to unbundle and abstract authorizations from web APIs. Authorizations greatly simplify the process of authenticating and authorizing users across one or more backend or SaaS services. With authorizations, easily configure OAuth 2.0, consent, acquire tokens, cache tokens, and refresh tokens without writing a single line of code. Use authorizations to delegate authentication to your API Management instance. 

This feature enables APIs to be exposed with or without a subscription key, use OAuth 2.0 authorizations to the backend services, and reduce development costs in ramping up, implementing, and maintaining security features with service integrations.

:::image type="content" source="media/authorizations-overview/overview-providers.png" alt-text="Diagram of API Management authorizations and supported SaaS providers." border="true":::

## Key scenarios

Using authorizations in API Management, customers can enable different scenarios and easily connect to SaaS providers or backend services that are using OAuth 2.0. Here are some example scenarios where this feature could be used:

* Easily connect to a SaaS backend by attaching the stored authorization token and proxying requests

* Proxy requests to an Azure App Service web app or Azure Functions backend by attaching the authorization token, which can later send requests to a SaaS backend applying transformation logic

* Proxy requests to GraphQL federation backends by attaching multiple access tokens to easily perform federation

* Expose a retrieve token endpoint, acquire a cached token, and call a SaaS backend on behalf of user from any compute, for example, a console app or Kubernetes daemon. Combine your favorite SaaS SDK in a supported language.

* Azure Functions unattended scenarios when connecting to multiple SaaS backends.

* Durable Functions gets a step closer to Logic Apps with SaaS connectivity.

* With authorizations every API in API Management can act as a Logic Apps custom connector.

## How do authorizations work?

Authorizations consist of two parts, **management** and **runtime**.

* The **management** part takes care of configuring identity providers, enabling the consent flow for the identity provider, and managing access to the authorizations. For details, see [Process flow - management](#process-flow---management).

* The **runtime** part uses the [`get-authorization-context` policy](get-authorization-context-policy.md) to fetch and store the authorization's access and refresh tokens. When a call comes into API Management, and the `get-authorization-context` policy is executed, it will first validate if the existing authorization token is valid. If the authorization token has expired, API Management uses an OAuth 2.0 flow to refresh the stored tokens from the identity provider. Then the access token is used to authorize access to the backend service. For details, see [Process flow - runtime](#process-flow---runtime).  
   
    During the policy execution, access to the tokens is also validated using access policies.

### Process flow - management
    
The following image summarizes the process flow for creating an authorization in API Management that uses the authorization code grant type.

:::image type="content" source="media/authorizations-overview/get-token.svg" alt-text="Diagram showing process flow for creating authorizations." border="false":::

| Step | Description
| --- | --- |
| 1 | Client sends a request to create an authorization provider |
| 2 | Authorization provider is created, and a response is sent back |
| 3| Client sends a request to create an authorization |
| 4| Authorization is created, and a response is sent back with the information that the authorization isn't "connected"| 
|5| Client sends a request to retrieve a login URL to start the OAuth 2.0 consent at the identity provider. The request includes a post-redirect URL to be used in the last step|  
|6|Response is returned with a login URL that should be used to start the consent flow. |
|7|Client opens a browser with the login URL that was provided in the previous step. The browser is redirected to the identity provider OAuth 2.0 consent flow | 
|8|After the consent is approved, the browser is redirected with an authorization code to the redirect URL configured at the identity provider| 
|9|API Management uses the authorization code to fetch access and refresh tokens| 
|10|API Management receives the tokens and encrypts them|
|11 |API Management redirects to the provided URL from step 5|

### Process flow - runtime


The following image shows the process flow to fetch and store authorization and refresh tokens based on an authorization that uses the authorization code grant type. After the tokens have been retrieved, a call is made to the backend API. 

:::image type="content" source="media/authorizations-overview/get-token-for-backend.svg" alt-text="Diagram that shows the process flow for creating runtime." border="false":::

| Step | Description
| --- | --- |
| 1 |Client sends request to API Management instance|
|2|The [`get-authorization-context`](get-authorization-context-policy.md) policy checks if the access token is valid for the current authorization|
|3|If the access token has expired but the refresh token is valid, API Management tries to fetch new access and refresh tokens from the configured identity provider|
|4|The identity provider returns both an access token and a refresh token, which are encrypted and saved to API Management| 
|5|After the tokens have been retrieved, the access token is attached using the `set-header` policy as an authorization header to the outgoing request to the backend API|
|6| Response is returned to API Management|
|7| Response is returned to the client|


## How to configure authorizations?

### Requirements

* Managed system-assigned identity must be enabled for the API Management instance.

* API Management instance must have outbound connectivity to internet on port 443 (HTTPS).

### Availability

* All API Management service tiers

* Not supported in self-hosted gateway

* Not supported in sovereign clouds or in the following regions: australiacentral, australiacentral2, jioindiacentral

### Configuration steps

Configuring an authorization in your API Management instance consists of three steps: configuring an authorization provider, consenting to access by logging in, and creating access policies.


:::image type="content" source="media/authorizations-overview/configure-authorization.png" alt-text="Diagram of steps to create an authorization in API Management." border="false":::

#### Step 1: Authorization provider
During Step 1, you configure your authorization provider. You can choose between different [identity providers](authorizations-configure-common-providers.md) and grant types (authorization code or client credential). Each identity provider requires specific configurations. Important things to keep in mind:

* An authorization provider configuration can only have one grant type.
* One authorization provider configuration can have [multiple authorization connections](configure-authorization-connection.md). 

> [!NOTE]
> With the Generic OAuth 2.0 provider, other identity providers that support the standards of [OAuth 2.0 flow](https://oauth.net/2/) can be used.
> 

To use an authorization provider, at least one *authorization* is required. Each authorization is a separate connection to the authorization provider. The process of configuring an authorization differs based on the configured grant type. Each authorization provider configuration only supports one grant type. For example, if you want to configure Microsoft Entra ID to use both grant types, two authorization provider configurations are needed. The following table summarizes the two grant types.


|Grant type  |Description  |
|---------|---------|
|Authorization code     | Bound to a user context, meaning a user needs to consent to the authorization. As long as the refresh token is valid, API Management can retrieve new access and refresh tokens. If the refresh token becomes invalid, the user needs to reauthorize. All identity providers support authorization code. [Learn more](https://www.rfc-editor.org/rfc/rfc6749?msclkid=929b18b5d0e611ec82a764a7c26a9bea#section-1.3.1)         |
|Client credentials     |  Isn't bound to a user and is often used in application-to-application scenarios. No consent is required for client credentials grant type, and the authorization doesn't become invalid. [Learn more](https://www.rfc-editor.org/rfc/rfc6749?msclkid=929b18b5d0e611ec82a764a7c26a9bea#section-1.3.4)   |

#### Step 2: Log in

For authorizations based on the authorization code grant type, you must authenticate to the provider and *consent* to authorization. After successful login and authorization by the identity provider, the provider returns valid access and refresh tokens, which are encrypted and saved by API Management. For details, see [Process flow - runtime](#process-flow---runtime).

#### Step 3: Access policy

You configure one or more *access policies* for each authorization. The access policies determine which [Microsoft Entra identities](../active-directory/develop/app-objects-and-service-principals.md) can gain access to your authorizations at runtime. Authorizations currently support managed identities and service principals.


|Identity  |Description  | Benefits | Considerations |
|---------|---------|-----|----|
|Service principal     |   Identity whose tokens can be used to authenticate and grant access to specific Azure resources, when an organization is using Microsoft Entra ID. By using a service principal, organizations avoid creating fictitious users to manage authentication when they need to access a resource. A service principal is a Microsoft Entra identity that represents a registered Microsoft Entra application. | Permits more tightly scoped access to authorization. Isn't tied to specific API Management instance. Relies on Microsoft Entra ID for permission enforcement. | Getting the [authorization context](get-authorization-context-policy.md) requires a Microsoft Entra token.     |
|Managed identity     |  Service principal of a special type that represents a Microsoft Entra identity for an Azure service. Managed identities are tied to, and can only be used with, an Azure resource. Managed identities eliminate the need for you to manually create and manage service principals directly.<br/><br/>When a system-assigned managed identity is enabled, a service principal representing that managed identity is created in your tenant automatically and tied to your resource's lifecycle.|No credentials are needed.|Identity is tied to specific Azure infrastructure. Anyone with Contributor access to API Management instance can access any authorization granting managed identity permissions.    |
| Managed identity `<Your API Management instance name>` | This option corresponds to a managed identity tied to your API Management instance.  |  Quick selection of system-assigned managed identity for the corresponding API management instance.  | Identity is tied to your API Management instance. Anyone with Contributor access to API Management instance can access any authorization granting managed identity permissions.     |

## Security considerations

The access token and other authorization secrets (for example, client secrets) are encrypted with an envelope encryption and stored in an internal, multitenant storage. The data are encrypted with AES-128 using a key that is unique per data. Those keys are encrypted asymmetrically with a master certificate stored in Azure Key Vault and rotated every month.

### Limits

| Resource | Limit |
| --------------------| ----|
| Maximum number of authorization providers per service instance| 1,000 |
| Maximum number of authorizations per authorization provider| 10,000 |
| Maximum number of access policies per authorization | 100 |
| Maximum number of authorization requests per minute per authorization | 250 |


## Frequently asked questions (FAQ)


### When are the access tokens refreshed?

For an authorization of type authorization code, access tokens are refreshed as follows: When the `get-authorization-context` policy is executed at runtime, API Management checks if the stored access token is valid. If the token has expired or is near expiry, API Management uses the refresh token to fetch a new access token and a new refresh token from the configured identity provider. If the refresh token has expired, an error is thrown, and the authorization needs to be reauthorized before it will work.

### What happens if the client secret expires at the identity provider?

At runtime API Management can't fetch new tokens, and an error occurs. 

* If the authorization is of type authorization code, the client secret needs to be updated on authorization provider level.

* If the authorization is of type client credentials, the client secret needs to be updated on authorizations level.

### Is this feature supported using API Management running inside a VNet?

Yes, as long as outbound connectivity on port 443 is enabled to the **AzureConnectors** service tag. For more information, see [Virtual network configuration reference](virtual-network-reference.md#required-ports).

### What happens when an authorization provider is deleted?

All underlying authorizations and access policies are also deleted.

### Are the access tokens cached by API Management?

In the dedicated service tiers, the access token is cached by the API management until 3 minutes before the token expiration time. Access tokens aren't cached in the Consumption tier.

## Next steps

Learn how to:
- Configure [identity providers](authorizations-configure-common-providers.md) for authorizations
- Configure and use an authorization for the [Microsoft Graph API](authorizations-how-to-azure-ad.md) or the [GitHub API](authorizations-how-to-github.md)
- Configure [multiple authorization connections](configure-authorization-connection.md) for a provider
