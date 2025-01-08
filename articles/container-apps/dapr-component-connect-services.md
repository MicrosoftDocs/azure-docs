---
title: Connect to other Azure or third-party services via Dapr components
description: Learn more about connecting Dapr components with Azure and external services.
ms.author: hannahhunter
author: hhunter-ms
ms.service: azure-container-apps
ms.custom: build-2023
ms.topic: conceptual
ms.date: 12/10/2024
---

# Connect to other Azure or third-party services via Dapr components

Securely establish connections to Azure and third-party services for Dapr components using managed identity or Azure Key Vault secret stores. 

Before getting started, [learn more about the offered support for Dapr components.][supported-dapr-components]

## Recommendations

Whenever possible, it's recommended that you use Azure components that provide managed identity support for the most secure connection. Use Azure Key Vault secret stores *only* when managed identity authentication isn't supported. 

| Service type | Recommendation |
| ------------ | -------------- |
| Azure component with managed identity support | [Use the managed identity flow (recommended)](#using-managed-identity-recommended) |
| Azure component without managed identity support | [Use an Azure Key Vault secret store](#azure-key-vault-secret-stores) |
| Non-Azure components | [Use an Azure Key Vault secret store](#azure-key-vault-secret-stores) |


## Using managed identity (recommended)

For Azure-hosted services, Dapr can use [the managed identity of the scoped container apps][aca-managed-id] to authenticate to the backend service provider. When using managed identity, you don't need to include secret information in a component manifest. **Using managed identity is recommended** as it eliminates storage of sensitive input in components and doesn't require managing a secret store.

> [!NOTE]
> The `azureClientId` metadata field (the client ID of the managed identity) is **required** for any component authenticating with user-assigned managed identity.

## Using a Dapr secret store component reference

When you create Dapr components for non-Entra ID enabled services or components that don't support managed identity authentication, certain metadata fields require sensitive input values. For this approach, retrieve these secrets by referencing an existing Dapr secret store component that securely accesses secret information.

To set up a reference:

1. [Create a Dapr secret store component using the Azure Container Apps schema.](#creating-a-dapr-secret-store-component) The component type for all supported Dapr secret stores begins with `secretstores.`.
1. [Create extra components (as needed) which reference the Dapr secret store component](#referencing-dapr-secret-store-components) you created to retrieve the sensitive metadata input.

### Creating a Dapr secret store component

When creating a secret store component in Azure Container Apps, you can provide sensitive information in the metadata section in either of the following ways:

- [For an **Azure Key Vault secret store**,](#using-managed-identity-recommended) use managed identity to establish the connection. 
- [For **non-Azure secret stores**,](#platform-managed-kubernetes-secrets) use platform-managed Kubernetes secrets that are defined directly as part of the component manifest.

#### Azure Key Vault secret stores

The following component schema showcases the simplest possible secret store configuration using an Azure Key Vault secret store. `publisher-app` and `subscriber-app` are configured to both have a system or user-assigned managed identity with appropriate permissions on the Azure Key Vault instance.

```yaml
componentType: secretstores.azure.keyvault
version: v1
metadata:
  - name: vaultName
    value: [your_keyvault_name]
  - name: azureEnvironment
    value: "AZUREPUBLICCLOUD"
  - name: azureClientId # Only required for authenticating user-assigned managed identity
    value: [your_managed_identity_client_id]
scopes:
  - publisher-app
  - subscriber-app
```

#### Platform-managed Kubernetes secrets

As an alternative to Kubernetes secrets, Local environment variables, and Local file Dapr secret stores, Azure Container Apps provides a platform-managed approach for creating and leveraging Kubernetes secrets. This approach can be used to connect to non-Azure services or in dev/test scenarios for quickly deploying components via the CLI without setting up a secret store or managed identity.

This component configuration defines the sensitive value as a secret parameter that can be referenced from the metadata section. 

```yaml
componentType: secretstores.azure.keyvault
version: v1
metadata:
  - name: vaultName
    value: [your_keyvault_name]
  - name: azureEnvironment
    value: "AZUREPUBLICCLOUD"
  - name: azureTenantId
    value: "[your_tenant_id]"
  - name: azureClientId 
    value: "[your_client_id]"
  - name: azureClientSecret
    secretRef: azClientSecret
secrets:
  - name: azClientSecret
    value: "[your_client_secret]"
scopes:
  - publisher-app
  - subscriber-app
```

### Referencing Dapr secret store components

Once you [create a Dapr secret store using one of the previous approaches](#creating-a-dapr-secret-store-component), you can reference that secret store from other Dapr components in the same environment. The following example demonstrates using Entra ID authentication.

```yaml
componentType: pubsub.azure.servicebus.queue
version: v1
secretStoreComponent: "[your_secret_store_name]"
metadata:
  - name: namespaceName
    # Required when using Azure Authentication.
    # Must be a fully-qualified domain name
    value: "[your_servicebus_namespace.servicebus.windows.net]"
  - name: azureTenantId
    value: "[your_tenant_id]"
  - name: azureClientId 
    value: "[your_client_id]"
  - name: azureClientSecret
    secretRef: azClientSecret
scopes:
  - publisher-app
  - subscriber-app
```

## Next steps

[Learn how to set Dapr component resiliency.][dapr-resiliency]

<!-- Links Internal -->

[dapr-component-connection]: ./dapr-component-connection.md
[dapr-keda]: ./dapr-keda-scaling.md
[aca-managed-id]: ./managed-identity.md
[dapr-resiliency]: ./dapr-component-resiliency.md
[dapr-components-connect-services]: ./dapr-component-connect-services.md
[supported-dapr-components]: ./dapr-overview.md#dapr-components
[dapr-component]: ./dapr-components.md

<!-- Links External -->

[dapr-component-spec]: https://docs.dapr.io/reference/resource-specs/
