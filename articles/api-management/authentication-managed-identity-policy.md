---
title: Azure API Management policy reference - authentication-managed-identity | Microsoft Docs
description: Reference for the authentication-managed-identity policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management

ms.service: azure-api-management
ms.topic: reference
ms.date: 05/05/2026
---

# Authenticate with managed identity

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

Use the `authentication-managed-identity` policy to authenticate with a backend service using the managed identity. This policy essentially uses the managed identity to obtain an access token from Microsoft Entra ID for accessing the specified resource. After successfully obtaining the token, the policy will set the value of the token in the `Authorization` header using the `Bearer` scheme. API Management caches the token until it expires.

On managed gateways, both system-assigned identity and any of the multiple user-assigned identities can be used to request a token. If `client-id` isn't provided, system-assigned identity is assumed. If the `client-id` attribute is provided, a token is requested for that user-assigned identity from Microsoft Entra ID.

On a self-hosted gateway, use Microsoft Entra Workload ID by setting `authentication-provider="WorkloadIdentity"`. The policy uses the identity configured for the gateway's workload, not the managed identity assigned to the API Management instance. Don't specify `client-id` with this provider. See [Self-hosted gateway with workload identity](#self-hosted-gateway-with-workload-identity).

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

> [!CAUTION]
> **Security consideration:** Users with permissions to edit API Management policies can use this policy to authenticate as the service's managed identity. However, they can't gain direct access to resources without first assigning a managed identity to the API Management instance. Once a managed identity is assigned, users who can modify policies may be able to exfiltrate the authentication token, propagate it to a backend, or log it for later use. For detailed security guidance and mitigation strategies, see [Security considerations for managed identities](api-management-howto-use-managed-service-identity.md#security-considerations-for-managed-identities) in the managed identity overview.
  
## Policy statement

```xml
<authentication-managed-identity resource="resource" client-id="clientid of user-assigned identity" authentication-provider="BuiltIn|WorkloadIdentity" output-token-variable-name="token-variable" ignore-error="true|false"/>
```

## Attributes

| Attribute | Description | Required | Default |
| --- | --- | --- | --- |
| resource | String. The application ID of the target web API (secured resource) in Microsoft Entra ID. Policy expressions are allowed. | Yes | N/A |
| authentication-provider | String. The provider used to obtain a token. Allowed values: `BuiltIn` for the gateway's built-in managed identity authentication, or `WorkloadIdentity` for Microsoft Entra Workload ID on a self-hosted gateway. Policy expressions aren't allowed. | No | `BuiltIn` |
| client-id | String. The client ID of the user-assigned identity in Microsoft Entra ID. Only supported with built-in authentication provider. Policy expressions aren't allowed. | No | N/A. With `BuiltIn`, system-assigned identity is used if the attribute isn't present. |
| output-token-variable-name | String. Name of the context variable that will receive token value as an object of type `string`. Policy expressions aren't allowed. | No | N/A |
| ignore-error | Boolean. If set to `true`, the policy pipeline continues to execute even if an access token isn't obtained. | No | `false` |

## Usage

- [**Policy sections:**](./api-management-howto-policies.md#understanding-policy-configuration) inbound
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, product, API, operation
- [**Gateways:**](api-management-gateways-overview.md) classic, v2, consumption, self-hosted

### Usage notes

- If this policy is defined at the global scope, the token obtained will be available in the policy execution context for all APIs, including those in workspaces. If the token should only be available to specific APIs, consider applying the policy at a narrower scope (for example, product or API level) rather than the global policy.

- Token forwarding is the customer's responsibility. When evaluating this policy, API Management obtains a token from Microsoft Entra ID and forwards it to the backend as-is in the `Authorization` header. API Management doesn't validate which backend the token is sent to. It's the customer's responsibility to ensure that tokens are only forwarded to intended and trusted backend services. Configure [backend entities](backends.md) and other policies carefully to prevent tokens from being sent to unintended destinations.

### Self-hosted gateway with workload identity

To use this policy on a self-hosted gateway, configure Microsoft Entra Workload ID for the gateway's workload and set `authentication-provider="WorkloadIdentity"` in the policy. For setup guidance, see [Enable workload identity authentication for the self-hosted gateway](self-hosted-gateway-enable-workload-identity.md).

The linked guide covers authentication to the API Management configuration endpoint. This policy authenticates requests to a backend, so also grant the workload's identity the permissions required to access that backend resource.

## Examples

### Use managed identity to authenticate with a backend service

```xml
<authentication-managed-identity resource="https://graph.microsoft.com"/> 
```

```xml
<authentication-managed-identity resource="https://cognitiveservices.azure.com"/> <!--Azure OpenAI-->
```

```xml
<authentication-managed-identity resource="https://management.azure.com/"/> <!--Azure Resource Manager-->
```

```xml
<authentication-managed-identity resource="https://vault.azure.net"/> <!--Azure Key Vault-->
```

```xml
<authentication-managed-identity resource="https://servicebus.azure.net/"/> <!--Azure Service Bus-->
```

```xml
<authentication-managed-identity resource="https://eventhubs.azure.net/"/> <!--Azure Event Hub-->
```

```xml
<authentication-managed-identity resource="https://storage.azure.com/"/> <!--Azure Blob Storage-->
```

```xml
<authentication-managed-identity resource="https://database.windows.net/"/> <!--Azure SQL-->
```

```xml
<authentication-managed-identity resource="https://signalr.azure.com"/> <!--Azure SignalR-->
```

```xml
<authentication-managed-identity resource="AD_application_id"/> <!--Application (client) ID of your own Azure AD Application-->
```

### Use managed identity and set header manually

```xml
<authentication-managed-identity resource="AD_application_id"
   output-token-variable-name="msi-access-token" ignore-error="false" /> <!--Application (client) ID of your own Azure AD Application-->
<set-header name="Authorization" exists-action="override">
   <value>@("Bearer " + (string)context.Variables["msi-access-token"])</value>
</set-header>
```

### Use managed identity in send-request policy

```xml
<send-request mode="new" timeout="20" ignore-error="false">
    <set-url>https://example.com/</set-url>
    <set-method>GET</set-method>
    <authentication-managed-identity resource="ResourceID"/>
</send-request>
```

### Use workload identity on a self-hosted gateway

The following example authenticates to Azure Key Vault using the gateway workload's identity:

```xml
<authentication-managed-identity resource="https://vault.azure.net" authentication-provider="WorkloadIdentity" />
```

## Related policies

* [Authentication and authorization](api-management-policies.md#authentication-and-authorization)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]
