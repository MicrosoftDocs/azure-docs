---
title: Dapr components in Azure Container Apps
description: Learn more about how Dapr components work on your Azure Container App service to develop applications.
ms.author: hannahhunter
author: hhunter-ms
ms.service: container-apps
ms.custom: build-2023
ms.topic: conceptual
ms.date: 04/29/2024
---

# Dapr components in Azure Container Apps

Dapr uses a modular design where functionality is delivered as a [component][dapr-component]. The use of Dapr components is optional and dictated exclusively by the needs of your application.

Dapr components in container apps are environment-level resources that:

- Can provide a pluggable abstraction model for connecting to supporting external services.
- Can be shared across container apps or scoped to specific container apps.
- Can use Dapr secrets to securely retrieve configuration metadata.

In this guide, you learn how to configure Dapr components for your Azure Container Apps services. 

## Component schema

In the Dapr open-source project, all components conform to the following basic [schema][dapr-component-spec].

```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: [COMPONENT-NAME]
  namespace: [COMPONENT-NAMESPACE]
spec:
  type: [COMPONENT-TYPE]
  version: v1
  initTimeout: [TIMEOUT-DURATION]
  ignoreErrors: [BOOLEAN]
  metadata:
    - name: [METADATA-NAME]
      value: [METADATA-VALUE]
```

In Azure Container Apps, the above schema is slightly simplified to support Dapr components and remove unnecessary fields, including `apiVersion`, `kind`, and redundant metadata and spec properties.

```yaml
componentType: [COMPONENT-TYPE]
version: v1
initTimeout: [TIMEOUT-DURATION]
ignoreErrors: [BOOLEAN]
metadata:
  - name: [METADATA-NAME]
    value: [METADATA-VALUE]
```

## Component scopes

By default, all Dapr-enabled container apps within the same environment load the full set of deployed components. To ensure only the appropriate container apps load components at runtime, application scopes should be used. In the following example, the component is only loaded by the two Dapr-enabled container apps with Dapr application IDs `APP-ID-1` and `APP-ID-2`:

```yaml
componentType: [COMPONENT-TYPE]
version: v1
initTimeout: [TIMEOUT-DURATION]
ignoreErrors: [BOOLEAN]
metadata:
  - name: [METADATA-NAME]
    value: [METADATA-VALUE]
scopes:
  - [APP-ID-1]
  - [APP-ID-2]
```

> [!NOTE]
> Dapr component scopes correspond to the Dapr application ID of a container app, not the container app name.

## Connecting to external services via Dapr

There are a few approaches supported in container apps to securely establish connections to external services for Dapr components.

1. [Using managed identity](#using-managed-identity)
1. Using a Dapr secret store component reference by creating either:
   - [An Azure Key Vault secret store](#azure-key-vault-secret-stores), which uses managed identity, or
   - [Platform-Managed Kubernetes secrets](#platform-managed-kubernetes-secrets)

### Using managed identity

For Azure-hosted services, Dapr can use [the managed identity of the scoped container apps][aca-managed-id] to authenticate to the backend service provider. When using managed identity, you don't need to include secret information in a component manifest. Using managed identity is preferred as it eliminates storage of sensitive input in components and doesn't require managing a secret store.

> [!NOTE]
> The `azureClientId` metadata field (the client ID of the managed identity) is **required** for any component authenticating with user-assigned managed identity.

### Using a Dapr secret store component reference

When you create Dapr components for non-Entra ID enabled services, certain metadata fields require sensitive input values. The recommended approach for retrieving these secrets is to reference an existing Dapr secret store component that securely accesses secret information.

To set up a reference:

1. [Create a Dapr secret store component using the Azure Container Apps schema.](#creating-a-dapr-secret-store-component) The component type for all supported Dapr secret stores begins with `secretstores.`.
1. [Create extra components (as needed) which reference the Dapr secret store component](#referencing-dapr-secret-store-components) you created to retrieve the sensitive metadata input.

#### Creating a Dapr secret store component

When creating a secret store component in Azure Container Apps, you can provide sensitive information in the metadata section in either of the following ways:

- [For an **Azure Key Vault secret store**,](#using-managed-identity) use managed identity to establish the connection. 
- [For **non-Azure secret stores**,](#platform-managed-kubernetes-secrets) use platform-managed Kubernetes secrets that are defined directly as part of the component manifest.

##### Azure Key Vault secret stores

The following component showcases the simplest possible secret store configuration using an Azure Key Vault secret store. In this example, publisher and subscriber applications are configured to both have a system or user-assigned managed identity with appropriate permissions on the Azure Key Vault instance.

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

##### Platform-managed Kubernetes secrets

Kubernetes secrets, Local environment variables, and Local file Dapr secret stores aren't supported in Azure Container Apps. As an alternative for the upstream Dapr default Kubernetes secret store, Azure Container Apps provides a platform-managed approach for creating and leveraging Kubernetes secrets.

This component configuration defines the sensitive value as a secret parameter that can be referenced from the metadata section. This approach can be used to connect to non-Azure services or in dev/test scenarios for quickly deploying components via the CLI without setting up a secret store or managed identity.

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

#### Referencing Dapr secret store components

Once you [create a Dapr secret store using one of the previous approaches](#creating-a-dapr-secret-store-component), you can reference that secret store from other Dapr components in the same environment. In the following example, the `secretStoreComponent` field is populated with the name of the secret store specified in the previous examples, where the `sb-root-connectionstring` is stored.

```yaml
componentType: pubsub.azure.servicebus.queue
version: v1
secretStoreComponent: "my-secret-store"
metadata:
  - name: connectionString
    secretRef: sb-root-connectionstring
scopes:
  - publisher-app
  - subscriber-app
```

## Component examples

# [YAML](#tab/yaml)

To create a Dapr component via the Container Apps CLI, you can use a container apps YAML manifest. When configuring multiple components, you must create and apply a separate YAML file for each component.

```azurecli
az containerapp env dapr-component set --name ENVIRONMENT_NAME --resource-group RESOURCE_GROUP_NAME --dapr-component-name pubsub --yaml "./pubsub.yaml"
```

```yaml
# pubsub.yaml for Azure Service Bus component
componentType: pubsub.azure.servicebus.queue
version: v1
secretStoreComponent: "my-secret-store"
metadata:
  - name: connectionString
    secretRef: sb-root-connectionstring
scopes:
  - publisher-app
  - subscriber-app
```

# [Bicep](#tab/bicep)

This resource defines a Dapr component called `dapr-pubsub` via Bicep. The Dapr component is defined as a child resource of the Container Apps environment. To define multiple components, you can add a `daprComponent` resource for each.

```bicep
resource daprComponent 'daprComponents@2022-03-01' = {
  name: 'dapr-pubsub'
  properties: {
    componentType: 'pubsub.azure.servicebus.queue'
    version: 'v1'
    secretStoreComponent: 'my-secret-store'
    metadata: [
      {
        name: 'connectionString'
        secretRef: 'sb-root-connectionstring'
      }
    ]
    scopes: [
      'publisher-app'
      'subscriber-app'
    ]
  }
}
```

# [ARM](#tab/arm)

This resource defines a Dapr component called `dapr-pubsub` via ARM.

```json
{
  "resources": [
    {
      "type": "daprComponents",
      "name": "dapr-pubsub",
      "properties": {
        "componentType": "pubsub.azure.servicebus.queue",
        "version": "v1",
        "secretScoreComponent": "my-secret-store",
        "metadata": [
          {
            "name": "connectionString",
            "secretRef": "sb-root-connectionstring"
          }
        ],
        "scopes": ["publisher-app", "subscriber-app"]
      }
    }
  ]
}
```

---

## Next steps

[Learn how to set Dapr component resiliency.][dapr-resiliency]

<!-- Links Internal -->

[dapr-component-connection]: ./dapr-component-connection.md
[dapr-keda]: ./dapr-keda-scaling.md
[aca-managed-id]: ./managed-identity.md
[dapr-resiliency]: ./dapr-component-resiliency.md

<!-- Links External -->

[dapr-component]: https://docs.dapr.io/concepts/components-concept/
[dapr-component-spec]: https://docs.dapr.io/reference/resource-specs/
