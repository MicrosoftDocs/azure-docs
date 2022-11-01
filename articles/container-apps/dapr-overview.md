---
title: Dapr integration with Azure Container Apps
description: Learn more about using Dapr on your Azure Container App service to develop applications.
ms.author: hannahhunter
author: hhunter-ms
ms.service: container-apps
ms.custom: event-tier1-build-2022
ms.topic: conceptual
ms.date: 08/18/2022
---

# Dapr integration with Azure Container Apps

The Distributed Application Runtime ([Dapr][dapr-concepts]) is a set of incrementally adoptable APIs that simplify the authoring of distributed, microservice-based applications. For example, Dapr provides capabilities for enabling application intercommunication, whether through messaging via pub/sub or reliable and secure service-to-service calls. Once Dapr is enabled in Container Apps, it exposes its HTTP and gRPC APIs via a sidecar: a process that runs in tandem with each of your Container Apps.

Dapr APIs, also referred to as building blocks, are built on best practice industry standards, that:

- Seamlessly fit with your preferred language or framework
- Are incrementally adoptable; you can use one, several, or all of the building blocks depending on your needs

## Dapr building blocks

:::image type="content" source="media/dapr-overview/building_blocks.png" alt-text="Diagram that shows Dapr building blocks.":::

| Building block | Description |
| -------------- | ----------- |
| [**Service-to-service invocation**][dapr-serviceinvo] | Discover services and perform reliable, direct service-to-service calls with automatic mTLS authentication and encryption. |
| [**State management**][dapr-statemgmt] | Provides state management capabilities for transactions and CRUD operations. |
| [**Pub/sub**][dapr-pubsub] | Allows publisher and subscriber container apps to intercommunicate via an intermediary message broker. |
| [**Bindings**][dapr-bindings] | Trigger your application with incoming or outgoing events, without SDK or library dependencies. |
| [**Actors**][dapr-actors] | Dapr actors apply the scalability and reliability that the underlying platform provides. |
| [**Observability**](./observability.md) | Send tracing information to an Application Insights backend. |

## Dapr settings

The following Pub/sub example demonstrates how Dapr works alongside your container app:

:::image type="content" source="media/dapr-overview/dapr-in-aca.png" alt-text="Diagram demonstrating Dapr pub/sub and how it works with Container Apps.":::

| Label | Dapr settings | Description |  
| ----- | ------------- | ----------- |
| 1 | Container Apps with Dapr enabled | Dapr is enabled at the container app level by configuring Dapr settings. Dapr settings apply across all revisions of a given container app. |
| 2 | Dapr sidecar | Fully managed Dapr APIs are exposed to your container app via the Dapr sidecar. These APIs are available through HTTP and gRPC protocols. By default, the sidecar runs on port 3500 in Container Apps. |
| 3 | Dapr component | Dapr components can be shared by multiple container apps. The Dapr sidecar uses scopes to determine which components to load for a given container app at runtime. |

### Enable Dapr

You can define the Dapr configuration for a container app through the Azure CLI or using Infrastructure as Code templates like a bicep or an Azure Resource Manager (ARM) template.  You can enable Dapr in your app with the following settings:

| CLI Parameter | Template field | Description |
| ----- | ----------- | ----------- |
| `--enable-dapr` | `dapr.enabled` | Enables Dapr on the container app. |
| `--dapr-app-port` | `dapr.appPort` | Identifies which port your application is listening. |
| `--dapr-app-protocol` | `dapr.appProtocol` | Tells Dapr which protocol your application is using. Valid options are `http` or `grpc`. Default is `http`. |
| `--dapr-app-id` | `dapr.appId` | The unique ID of the application. Used for service discovery, state encapsulation, and the pub/sub consumer ID. |

The following example shows how to define a Dapr configuration in a template by adding the Dapr configuration to the `properties.configuration` section of your container apps resource declaration.

# [Bicep](#tab/bicep1)

```bicep
 dapr: {
   enabled: true
   appId: 'nodeapp'
   appProtocol: 'http'
   appPort: 3000
 }
```

# [ARM](#tab/arm1)

```json
  "dapr": {
    "enabled": true,
    "appId": "nodeapp",
    "appProcotol": "http",
    "appPort": 3000
  }
 
```

---

Since Dapr settings are considered application-scope changes, new revisions aren't created when you change Dapr setting. However, when changing Dapr settings, the container app revisions and replicas are automatically restarted.

### Configure Dapr components

Once Dapr is enabled on your container app, you're able to plug in and use the [Dapr APIs](#dapr-building-blocks) as needed. You can also create **Dapr components**, which are specific implementations of a given building block. Dapr components are environment-level resources, meaning they can be shared across Dapr-enabled container apps. Components are pluggable modules that:

- Allow you to use the individual Dapr building block APIs.
- Can be scoped to specific container apps.
- Can be easily modified to point to any one of the component implementations.
- Can reference secure configuration values using Container Apps secrets.

Based on your needs, you can "plug in" certain Dapr component types like state stores, pub/sub brokers, and more. In the examples below, you'll find the various schemas available for defining a Dapr component in Azure Container Apps. The Container Apps manifests differ sightly from the Dapr OSS manifests in order to simplify the component creation experience.

> [!NOTE]
> By default, all Dapr-enabled container apps within the same environment will load the full set of deployed components. By adding scopes to a component, you tell the Dapr sidecars for each respective container app which components to load at runtime. Using scopes is recommended for production workloads.

# [YAML](#tab/yaml)

When defining a Dapr component via YAML, you'll pass your component manifest into the Azure CLI. For example, deploy a `pubsub.yaml` component using the following command:

```azurecli
az containerapp env dapr-component set --name ENVIRONMENT_NAME --resource-group RESOURCE_GROUP_NAME --dapr-component-name pubsub --yaml "./pubsub.yaml"
```

The `pubsub.yaml` spec will be scoped to the dapr-enabled container apps with app IDs `publisher-app` and `subscriber-app`.

```yaml
# pubsub.yaml for Azure Service Bus component
componentType: pubsub.azure.servicebus
version: v1
metadata:
- name: connectionString
  secretRef: sb-root-connectionstring
secrets:
- name: sb-root-connectionstring
  value: "value"
# Application scopes  
scopes:
  - publisher-app
  - subscriber-app
```

# [Bicep](#tab/bicep)

This resource defines a Dapr component called `dapr-pubsub` via Bicep. The Dapr component is defined as a child resource of your Container Apps environment. The `dapr-pubsub` component is scoped to the Dapr-enabled container apps with app IDs `publisher-app` and `subscriber-app`:

```bicep
resource daprComponent 'daprComponents@2022-03-01' = {
  name: 'dapr-pubsub'
  properties: {
    componentType: 'pubsub.azure.servicebus'
    version: 'v1'
    secrets: [
      {
        name: 'sb-root-connectionstring'
        value: 'value'
      }
    ]
    metadata: [
      {
        name: 'connectionString'
        secretRef: 'sb-root-connectionstring'
      }
    ]
    // Application scopes
    scopes: [
      'publisher-app'
      'subscriber-app'
    ]
  }
}
```

# [ARM](#tab/arm)

This resource defines a Dapr component called `dapr-pubsub` via ARM. The Dapr component is defined as a child resource of your Container Apps environment. The `dapr-pubsub` component will be scoped to the Dapr-enabled container apps with app IDs `publisher-app` and `subscriber-app`:

```json
{
  "resources": [
    {
      "type": "daprComponents",
      "name": "dapr-pubsub",
      "properties": {
        "componentType": "pubsub.azure.servicebus",
        "version": "v1",
        "secrets": [
          {
            "name": "sb-root-connectionstring",
            "value": "value"
          }
        ],
        "metadata": [
          {
            "name": "connectionString",
            "secretRef": "sb-root-connectionstring"
          }
        ],
        // Application scopes
        "scopes": ["publisher-app", "subscriber-app"]

      }
    }
  ]
}
```

---

For comparison, a Dapr OSS `pubsub.yaml` file would include: 

```yml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: dapr-pubsub
spec:
  type: pubsub.azure.servicebus
  version: v1
  metadata:
  - name: connectionString
    secretKeyRef:
      name: sb-root-connectionstring
      key: "value"
# Application scopes
scopes:
- publisher-app
- subscriber-app
```

## Current supported Dapr version

Azure Container Apps supports Dapr version 1.8.3. 

Version upgrades are handled transparently by Azure Container Apps. You can find the current version via the Azure portal and the CLI. 

## Limitations

### Unsupported Dapr capabilities

- **Dapr Secrets Management API**: Use [Container Apps secret mechanism][aca-secrets] as an alternative.
- **Custom configuration for Dapr Observability**: Instrument your environment with Application Insights to visualize distributed tracing.
- **Dapr Configuration spec**: Any capabilities that require use of the Dapr configuration spec.
- **Advanced Dapr sidecar configurations**: Container Apps allows you to specify sidecar settings including `app-protocol`, `app-port`, and `app-id`. For a list of unsupported configuration options, see [the Dapr documentation](https://docs.dapr.io/reference/arguments-annotations-overview/).

### Known limitations

- **Declarative pub/sub subscriptions**
- **Actor reminders**: Require a minReplicas of 1+ to ensure reminders will always be active and fire correctly.

## Next Steps

Now that you've learned about Dapr and some of the challenges it solves:

- Try [Deploying a Dapr application to Azure Container Apps using the Azure CLI][dapr-quickstart] or [Azure Resource Manager][dapr-arm-quickstart].
- Walk through a tutorial [using GitHub Actions to automate changes for a multi-revision, Dapr-enabled container app][dapr-github-actions].

<!-- Links Internal -->
[dapr-quickstart]: ./microservices-dapr.md
[dapr-arm-quickstart]: ./microservices-dapr-azure-resource-manager.md
[aca-secrets]: ./manage-secrets.md
[dapr-github-actions]: ./dapr-github-actions.md

<!-- Links External -->
[dapr-concepts]: https://docs.dapr.io/concepts/overview/
[dapr-pubsub]: https://docs.dapr.io/developing-applications/building-blocks/pubsub/pubsub-overview
[dapr-statemgmt]: https://docs.dapr.io/developing-applications/building-blocks/state-management/state-management-overview/
[dapr-serviceinvo]: https://docs.dapr.io/developing-applications/building-blocks/service-invocation/service-invocation-overview/
[dapr-bindings]: https://docs.dapr.io/developing-applications/building-blocks/bindings/bindings-overview/
[dapr-actors]: https://docs.dapr.io/developing-applications/building-blocks/actors/actors-overview/
