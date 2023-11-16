---
title: Credential manager in Azure API Management - process flows
description: Learn about the management and runtime process flows for managing OAuth 2.0 connections using credential manager in Azure API Management
author: dlepow
ms.service: api-management
ms.topic: conceptual
ms.date: 11/14/2023
ms.author: danlep
ms.custom: 
---

# OAuth 2.0 connections in credential manager - process details and flows

This article provides details about the process flows for managing OAuth 2.0 connections using credential manager in Azure API Management. The process flows are divided into two parts: **management** and **runtime**.

For background about credential manager in API Management, see [About credential manager and API credentials in API Management](credentials-overview.md).

## Management of connections
    
The **management** part of connections in credential manager takes care of setting up and configuring a *credential provider* for OAuth 2.0 tokens, enabling the consent flow for the provider, and setting up one or more *connections* to the credential provider for access to the credentials. 

The following image summarizes the process flow for creating a connection in API Management that uses the authorization code grant type.

:::image type="content" source="media/credentials-process-flow/get-token.svg" alt-text="Diagram showing process flow for creating credentials." border="false":::

| Step | Description |
| --- | --- |
| 1 | Client sends a request to create a credential provider |
| 2 | Credential provider is created, and a response is sent back |
| 3| Client sends a request to create a connection |
| 4| Connection is created, and a response is sent back with the information that the connection isn't "connected"| 
|5| Client sends a request to retrieve a login URL to start the OAuth 2.0 consent at the identity provider. The request includes a post-redirect URL to be used in the last step|  
|6|Response is returned with a login URL that should be used to start the consent flow. |
|7|Client opens a browser with the login URL that was provided in the previous step. The browser is redirected to the identity provider OAuth 2.0 consent flow | 
|8|After the consent is approved, the browser is redirected with a credential code to the redirect URL configured at the identity provider| 
|9|API Management uses the authorization code to fetch access and refresh tokens| 
|10|API Management receives the tokens and encrypts them|
|11 |API Management redirects to the provided URL from step 5|

### Credential provider

When configuring your credential provider, you can choose between different [OAuth providers](credentials-configure-common-providers.md) and grant types (authorization code or client credential). Each provider requires specific configurations. Important things to keep in mind:

* A credential provider configuration can only have one grant type.
* One credential provider configuration can have [multiple connections](configure-credential-connection.md). 

> [!NOTE]
> With the Generic OAuth 2.0 provider, other identity providers that support the standards of [OAuth 2.0 flow](https://oauth.net/2/) can be used.
> 

When you configure a credential provider, behind the scenes credential manager creates a *credential store* that is used to cache the provider's OAuth 2.0 access tokens and refresh tokens.

### Connection to a credential provider

To access and use tokens for a provider, client apps need a connection to the credential provider. A given connection is permitted by *access policies* based on Microsoft Entra ID identities. You can configure multiple connections for a provider. 

The process of configuring a connection differs based on the configured grant and is specific to the credential provider configuration. For example, if you want to configure Microsoft Entra ID to use both grant types, two credential provider configurations are needed. The following table summarizes the two grant types.


|Grant type  |Description  |
|---------|---------|
|Authorization code     | Bound to a user context, meaning a user needs to consent to the connection. As long as the refresh token is valid, API Management can retrieve new access and refresh tokens. If the refresh token becomes invalid, the user needs to reauthorize. All credential providers support authorization code. [Learn more](https://www.rfc-editor.org/rfc/rfc6749?msclkid=929b18b5d0e611ec82a764a7c26a9bea#section-1.3.1)         |
|Client credentials     |  Isn't bound to a user and is often used in application-to-application scenarios. No consent is required for client credentials grant type, and the connection doesn't become invalid. [Learn more](https://www.rfc-editor.org/rfc/rfc6749?msclkid=929b18b5d0e611ec82a764a7c26a9bea#section-1.3.4)   |

### Consent

For connections based on the authorization code grant type, you must authenticate to the provider and *consent* to authorization. After successful login and authorization by the credential provider, the provider returns valid access and refresh tokens, which are encrypted and saved by API Management. 

### Access policy

You configure one or more *access policies* for each connection. The access policies determine which [Microsoft Entra ID identities](../active-directory/develop/app-objects-and-service-principals.md) can gain access to your credentials at runtime. Connections currently support access using service principals, your API Management instance's identity, users, and groups.


|Identity  |Description  | Benefits | Considerations |
|---------|---------|-----|----|
|Service principal     |   Identity whose tokens can be used to authenticate and grant access to specific Azure resources, when an organization is using Microsoft Entra ID. By using a service principal, organizations avoid creating fictitious users to manage authentication when they need to access a resource. A service principal is a Microsoft Entra identity that represents a registered Microsoft Entra application. | Permits more tightly scoped access to connection and user delegation scenarios. Isn't tied to specific API Management instance. Relies on Microsoft Entra ID for permission enforcement. | Getting the [authorization context](get-authorization-context-policy.md) requires a Microsoft Entra ID token.     |
| Managed identity `<Your API Management instance name>` | This option corresponds to a managed identity tied to your API Management instance.  |  By default, access is provided to the system-assigned managed identity for the corresponding API management instance.  | Identity is tied to your API Management instance. Anyone with Contributor access to API Management instance can access any connection granting managed identity permissions.     |
| Users or groups | Users or groups in your Microsoft Entra ID tenant. |  Allows you to limit access to specific users or groups of users.  |  Requires that users have a Microsoft Entra ID account.  |


## Runtime of connections

The **runtime** part requires a backend OAuth 2.0 API to be configured with the [`get-authorization-context`](get-authorization-context-policy.md) policy. At runtime, the policy fetches and stores access and refresh tokens from the credential store. When a call comes into API Management, and the `get-authorization-context` policy is executed, it will first validate if the existing authorization token is valid. If the authorization token has expired, API Management uses an OAuth 2.0 flow to refresh the stored tokens from the credential provider. Then the access token is used to authorize access to the backend service. 
   
During the policy execution, access to the tokens is also validated using access policies.

The following image shows an example process flow to fetch and store authorization and refresh tokens based on a connection that uses the authorization code grant type. After the tokens have been retrieved, a call is made to the backend API. 

:::image type="content" source="media/credentials-process-flow/get-token-for-backend.svg" alt-text="Diagram that shows the process flow for retrieving token at runtime." border="false":::

| Step | Description
| --- | --- |
| 1 |Client sends request to API Management instance|
|2|The [`get-authorization-context`](get-authorization-context-policy.md) policy checks if the access token is valid for the current connection|
|3|If the access token has expired but the refresh token is valid, API Management tries to fetch new access and refresh tokens from the configured credential provider|
|4|The credential provider returns both an access token and a refresh token, which are encrypted and saved to API Management| 
|5|After the tokens have been retrieved, the access token is attached using the `set-header` policy as an authorization header to the outgoing request to the backend API|
|6| Response is returned to API Management|
|7| Response is returned to the client|



## Related content

- [Credential manager overview](credentials-overview.md)
- Configure [credential providers](credentials-configure-common-providers.md) for credential manager
- Configure and use a connection for the [Microsoft Graph API](credentials-how-to-azure-ad.md) or the [GitHub API](credentials-how-to-github.md)
- Configure [multiple authorization connections](configure-credential-connection.md) for a provider
- Configure a connection for [user-delegated access](credentials-how-to-user-delegated.md)
