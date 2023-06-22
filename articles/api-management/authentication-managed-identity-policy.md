---
title: Azure API Management policy reference - authentication-managed-identity | Microsoft Docs
description: Reference for the authentication-managed-identity policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 12/06/2022
ms.author: danlep
---

# Authenticate with managed identity

 Use the `authentication-managed-identity` policy to authenticate with a backend service using the managed identity. This policy essentially uses the managed identity to obtain an access token from Azure Active Directory for accessing the specified resource. After successfully obtaining the token, the policy will set the value of the token in the `Authorization` header using the `Bearer` scheme. API Management caches the token until it expires.

Both system-assigned identity and any of the multiple user-assigned identities can be used to request a token. If `client-id` is not provided, system-assigned identity is assumed. If the `client-id` variable is provided, token is requested for that user-assigned identity from Azure Active Directory.

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

  
## Policy statement  
  
```xml  
<authentication-managed-identity resource="resource" client-id="clientid of user-assigned identity" output-token-variable-name="token-variable" ignore-error="true|false"/>  
```  
## Attributes

| Attribute         | Description                                            | Required | Default |
| ----------------- | ------------------------------------------------------ | -------- | ------- |
|resource|String. The application ID of the target web API (secured resource) in Azure Active Directory. Policy expressions are allowed. |Yes|N/A|
|client-id|String. The client ID of the user-assigned identity in Azure Active Directory. Policy expressions aren't allowed. |No|system-assigned identity|
|output-token-variable-name|String. Name of the context variable that will receive token value as an object of type `string`. Policy expressions aren't allowed. |No|N/A|  
|ignore-error|Boolean. If set to `true`, the policy pipeline continues to execute even if an access token isn't obtained.|No|`false`|  


## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, workspace, product, API, operation
- [**Gateways:**](api-management-gateways-overview.md) dedicated, consumption, self-hosted

## Examples

### Use managed identity to authenticate with a backend service
```xml  
<authentication-managed-identity resource="https://graph.microsoft.com"/> 
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

## Related policies

* [API Management authentication policies](api-management-authentication-policies.md)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]
