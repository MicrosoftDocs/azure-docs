---
title: Dapr integration with Azure Container Apps (preview)
description: Learn more about using Dapr on your Azure Container App service to develop applications.
ms.author: hannahhunter
author: hhunter-ms
ms.service: container-apps
ms.topic: conceptual
ms.date: 05/02/2022
---

# Dapr integration with Azure Container Apps (preview)

The Distributed Application Runtime ([Dapr][dapr-concepts]) is a set of incrementally adoptable APIs that simplify the authoring of distributed, microservice-based applications. For example, Dapr provides capabilities for enabling application intercommunication, whether through messaging via pubsub or reliable and secure service-to-service calls. Once enabled in Container Apps, Dapr exposes its HTTP and gRPC APIs via a sidecar: a process that runs in tandem with each of your Container Apps. 

Dapr APIs, also referred to as building blocks, are built on best practice industry standards, that:

- Seamlessly fit with your preferred language or framework
- Are incrementally adoptable; you can use one, several, or all of the building blocks depending on your needs

Thanks to Dapr, you can plug the Dapr HTTP or gRPC APIs you need into your application. Dapr abstracts away typical complexities and performs the heavy lifting for you.

## Dapr building blocks in Container Apps

:::image type="content" source="media/dapr-overview/building_blocks.png" alt-text="Visualization of Dapr building blocks":::

| Building block | Description |
| -------------- | ----------- |
| [**Service-to-service invocation**][dapr-serviceinvo] | Discover services and perform reliable, direct service-to-service calls with automatic mTLS authentication and encryption. |
| [**State management**][dapr-statemgmt] | Provides state management capabilities for: <ul><li>CRUD operations</li><li>Transactions</li></ul> |
| [**Pub/sub**][dapr-pubsub] | Allows publisher and subscriber container apps to intercommunicate via an intermediary message broker. |
| [**Bindings**][dapr-bindings] | Trigger your application with incoming or outgoing events, without SDK or library dependencies. |
| [**Actors**][dapr-actors] | Dapr actors apply the scalability and reliability that the underlying platform provides. |
| [**Observability**](./observability.md) | Send tracing information to an Application Insights backend. |

## Dapr settings in Container Apps

The following Pub/sub example demonstrates how:
- Dapr is enabled in your container app.
- Dapr components are plugged into and scoped to your container app and Dapr sidecar.
- Dapr APIs are exposed to your container app.

:::image type="content" source="media/dapr-overview/dapr-in-aca.png" alt-text="Diagram demonstrating Dapr pub/sub and how it works with Container Apps":::

### 1 - Container Apps with Dapr enabled

Define Dapr sidecars or control plane settings for your container app within a bicep or ARM template, or by passing to a YAML component via the Azure CLI. 

With the following settings, you enable Dapr on your app:

| Field | Description |
| ----- | ----------- |
| `--enable-dapr` / `enabled` | Enables Dapr on the container app. |
| `appPort` | Identifies on which port your application is listening. |
| `appProtocol` | Tells Dapr which protocol your application is using. Valid options are `http` or `grpc`. Default is `http`. |
| `appId` | The unique ID of the application. Used for service discovery, state encapsulation, and the pub/sub consumer ID. |

# [YAML](#tab/yaml)

When defining a YAML component via the `components.yaml` spec, you pass the Dapr enablement settings to the Azure CLI. For the publisher container app:

```azurecli
--enable-dapr \
--dapr-app-id publisher-app \
--dapr-app-port 80 \
--dapr-app-protocol http \
--dapr-components ./components.yaml
```

For the subscriber container app:

```azurecli
--enable-dapr \
--dapr-app-id subscriber-app \
--dapr-app-port 80 \
--dapr-app-protocol http \
--dapr-components ./components.yaml
```

These settings define the `components.yaml` spec with which the Dapr sidecar and your container app will communicate.


# [Bicep](#tab/bicep)

Plug the following Dapr enablement into your container app bicep code:

For the publisher container app:

```bicep
dapr: {
      enabled: true
      appId: 'publisher-app'
      appPort: 80
      appProtocol: 'http'
    }
```

For the subscriber container app:

```bicep
dapr: {
      enabled: true
      appId: 'subscriber-app'
      appPort: 80
      appProtocol: 'http'
    }
```

# [ARM](#tab/arm)

Plug the following Dapr enablement into your container app ARM code:

For the publisher container app:

```json
"dapr": {
    "enabled": true,
    "appId": "publisher-app",
    "appPort": 80,
    "appProtocol": "http",
}
```
For the subscriber container app:

```json
"dapr": {
    "enabled": true,
    "appId": "subscriber-app",
    "appPort": 80,
    "appProtocol": "http",
}
```

---

Since Dapr settings are considered application-scope changes, new revisions aren't created when you change Dapr settings. However, when changing a Dapr setting, the container app instance and revisions are automatically restarted.

### 2 - Dapr sidecar

:::image type="content" source="media/dapr-overview/sidecar_architecture.png" alt-text="Visualization of Dapr sidecar architecture":::

The Dapr APIs are run and exposed alongside your containerized application on a separate process, called the Dapr sidecar. These APIs are available through HTTP and gRPC protocols.  

### 3 - Dapr components

Dapr components are scoped to a container app environment and are pluggable modules that:

- Allow you to use the individual Dapr building block APIs.
- Can be scoped to specific container apps.
- Can be easily swapped out at the environment level of your container app.

Based on your needs, you can "plug in" certain Dapr component types like state stores, pub/sub brokers, and more. In the examples below, view the various schemas you can define for a Dapr component in Azure Container Apps and compare with the schema provided with Dapr OSS.

> [!NOTE]
> By default, every container app will load the Dapr component. You can limit which container app loads the component by adding application scopes.

**Dapr in Azure Container Apps**

# [YAML](#tab/yaml)

When you enabled Dapr via the Azure CLI, you defined the following `components.yaml` file:

```yaml
# components.yaml for Azure Service Bus component
- name: dapr-pubsub
  type: pubsub.azure.servicebus
  version: v1
  metadata:
  - name: connectionString
    secretRef: sb-root-connectionstring
  # Application scopes  
  scopes:
  - publisher-app
  - subscriber-app
```

# [Bicep](#tab/bicep)

```bicep
resource daprComponent 'daprComponents@2022-01-01-preview' = {
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

**Dapr OSS**

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
      name: bus-secret
      key: sb-root-connectionstring
# Application scopes
scopes:
- publisher-app
- subscriber-app
```

> [!NOTE]
> Since Dapr components and settings aren't revisionable, all running instances of a revision share the same set of Dapr components. 


## Current supported Dapr version

Azure Container Apps supports Dapr version 1.4.2. 

Version upgrades are handled transparently by Azure Container Apps. You can find the current version via the Azure portal and the CLI. See [known limitations](#limitations) around versioning.

<!-- command -->

## Limitations

- **Versions**  
   Version upgrades currently don't guarantee full support for all Dapr features in a given version.  

- **Secrets**  
   While Azure Container Apps currently doesn't support Dapr secrets, you can provide secrets to your components using the [Container Apps secret mechanism][aca-secrets].  

- **Configuration CRD**  
   While we expose the ability for customers to use Dapr components, Container Apps doesn't currently expose Dapr configuration CRD.  

- **Observability**  
   While we don't currently expose the ability for you to customize your tracing backend, you are able to use Application Insights as your tracing backend.  

- **Pub/sub**  
   Currently, Container Apps supports Dapr's programmatic subscription model, but not Dapr's declarative Subscription spec.  

- **ACL policies**  
  Setting ACL policies on the Dapr sidecar configuration is currently not supported.

> [!TIP]
> **Actor Reminders**
> If you use actor reminders, set `minReplicas` to at least 1 to ensure reminders will always be active and thus fire correctly.

## Next Steps

Now that you've learned about Dapr and some of the challenges it solves, try [Deploying a Dapr application to Azure Container Apps using the Azure CLI][dapr-quickstart] or [Azure Resource Manager][dapr-arm-quickstart].

<!-- Links Internal -->
[dapr-quickstart]: ./microservices-dapr.md
[dapr-arm-quickstart]: ./microservices-dapr-azure-resource-manager.md
[aca-secrets]: ./manage-secrets.md

<!-- Links External -->
[dapr-concepts]: https://docs.dapr.io/concepts/overview/
[dapr-pubsub]: https://docs.dapr.io/developing-applications/building-blocks/pubsub/pubsub-overview
[dapr-statemgmt]: https://docs.dapr.io/developing-applications/building-blocks/state-management/state-management-overview/
[dapr-serviceinvo]: https://docs.dapr.io/developing-applications/building-blocks/service-invocation/service-invocation-overview/
[dapr-bindings]: https://docs.dapr.io/developing-applications/building-blocks/bindings/bindings-overview/
[dapr-actors]: https://docs.dapr.io/developing-applications/building-blocks/actors/actors-overview/
