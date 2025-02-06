---
title: Dapr components in Azure Container Apps
description: Learn more about how Dapr components work on your Azure Container App service to develop applications.
ms.author: hannahhunter
author: hhunter-ms
ms.service: azure-container-apps
ms.custom: build-2023
ms.topic: conceptual
ms.date: 12/03/2024
---

# Dapr components in Azure Container Apps

Dapr uses a modular design where functionality is delivered as a [component][dapr-component]. The use of Dapr components is optional and dictated exclusively by the needs of your application.

Dapr components in container apps are environment-level resources that:

- Can provide a pluggable abstraction model for connecting to supporting external services.
- Can be shared across container apps or scoped to specific container apps.
- Can use [Dapr secrets][dapr-components-connect-services] to securely retrieve configuration metadata.

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
> Dapr component scopes provide better security measures and correspond to the Dapr application ID of a container app, not the container app name.

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
        name: 'namespaceName'
        // Required when using Azure Authentication.
        // Must be a fully-qualified domain name
        value: '[your_servicebus_namespace.servicebus.windows.net]'
        name: 'azureTenantId'
        value: '[your_tenant_id]'
        name: 'azureClientId' 
        value: '[your_client_id]'
        name: 'azureClientSecret'
        secretRef: 'azClientSecret'
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
            "name": "namespaceName",
            "value": "[your_servicebus_namespace.servicebus.windows.net]",
            "name": "azureTenantId",
            "value": "[your_tenant_id]",
            "name": "azureClientId",
            "value": "[your_client_id]",
            "name": "azureClientSecret",
            "secretRef": "azClientSecret"
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

[Learn how to connect to Azure and external services via Dapr components.][dapr-components-connect-services]

<!-- Links Internal -->

[dapr-component-connection]: ./dapr-component-connection.md
[dapr-keda]: ./dapr-keda-scaling.md
[aca-managed-id]: ./managed-identity.md
[dapr-resiliency]: ./dapr-component-resiliency.md
[dapr-components-connect-services]: ./dapr-component-connect-services.md
[dapr-component]: ./dapr-overview.md#dapr-components

<!-- Links External -->

[dapr-component-spec]: https://docs.dapr.io/reference/resource-specs/
