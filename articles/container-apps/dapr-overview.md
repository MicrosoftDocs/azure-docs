---
title: Dapr integration with Azure Container Apps (preview)
description: Learn more about using Dapr on your Azure Container App service to develop applications.
ms.author: hannahhunter
author: hhunter-ms
ms.service: container-apps
ms.topic: conceptual
ms.date: 04/20/2022
---

# Dapr integration with Azure Container Apps (preview)

Distributed Application Runtime ([Dapr][dapr-concepts]) is a programming model that simplifies microservice implementation by addressing complexities you often encounter when authoring a distributed microservice app. For example, how your application intercommunicates, whether through messaging via pubsub or reliable, direct service-to-service calls. 

In Container Apps, Dapr offers a fully managed, incrementally adoptable set of HTTP or gRPC APIs that you can plug into your Container Apps to help with implementing types of cloud-native patterns. Once you enable Dapr on the container, Dapr's programming model and sidecars are automatically available to you.

Thanks to Dapr, you can simply plug the Dapr HTTP or gRPC APIs you need into your application. Dapr abstracts away typical complexities and performs the heavy lifting for you, while adhering to industry best practices.

## How Dapr works in Container Apps

In Container Apps, Dapr exposes these HTTP and gRPC APIs, or building blocks, to your Container Apps as a sidecar: a process that runs in tandem with each of your Container Apps. 

### Dapr building blocks available to Container Apps

Dapr's portable building blocks are built on best practice industry standards, that:

- Seamlessly fit with your preferred language or framework.
- Are incrementally adoptable; you can use one, several, or all of the building blocks depending on your needs.

<!--:::image type="content" source="media/dapr-overview/building_blocks.png" alt-text="Visualization of Dapr building blocks"::: -->

| Building block | Description |
| -------------- | ----------- |
| [**Service-to-service invocation**][dapr-serviceinvo] | Discover services and perform direct service-to-service calls with automatic mTLS authentication and encryption. |
| [**State management**][dapr-statemgmt] | Provides state management capabilities for: <ul><li>CRUD operations</li><li>Transactions</li></ul> |
| [**Pub/sub**][dapr-pubsub] | Allows publisher and subscriber container apps to intercommunicate via an intermediary message broker. |
| [**Bindings**][dapr-bindings] | Trigger your application with incoming or outgoing events, without SDK or library dependencies. |
| [**Actors**][dapr-actors] | Dapr actors apply the scalability and reliability that the underlying platform provides. |
| **Observability** | Send tracing information to an Application Insights backend. |

### Dapr settings in Container Apps

:::image type="content" source="media/dapr-overview/aca_dapr_architecture.png" alt-text="diagram demonstrating Dapr pub/sub":::

| # | Core concepts 
| - | ------------- 
| 1 | [Container App environment](#container-app-environment) | 
| 2 | [Container App with Dapr enabled]() | 
| 3 | [Dapr sidecar](#dapr-sidecar) | 
| 4 | [Dapr component scoped to each Container App](#dapr-components) | 
| 5 | [External Azure service integrated with your Container App](#external-azure-service-integrated-with-your-container-app) | 


#### Container App environment

#### Container App with Dapr enabled

Define Dapr sidecars or control plane settings for your container app using a YAML file, bicep, or ARM template. With the following settings, you enable Dapr on your app:

| Field | Description |
| ----- | ----------- |
| `enabled` | Enables Dapr on the container app. |
| `appPort` | Identifies on which port your application is listening. |
| `appProtocol` | Tells Dapr which protocol your application is using. Valid options are `http` or `grpc`. Default is `http`. |
| `appId` | The unique ID of the application. Used for service discovery, state encapsulation, and the pub/sub consumer ID. |

# [Dapr OSS](#tab/oss)

# [YAML](#tab/yaml)

When defining a component via the `<component>.yml` spec, you pass it to the Azure CLI.

```azurecli
--enable-dapr \
--dapr-app-port 3000 \
--dapr-app-protocol http \
--dapr-app-id nodeapp \
--dapr-components ./components.yaml
```

# [Bicep](#tab/bicep)

```bicep
dapr: {
      enabled: true
      appPort: 3000
      appProtocol: 'http'
      appId: 'nodeapp'
    }
```

# [ARM](#tab/arm)

```json
"dapr": {
    "enabled": true,
    "appPort": 3000,
    "appProtocol": "http",
    "appId": "nodeapp",
}
```

---

Since Dapr settings are considered application-scope changes, new revisions won't be created when you change Dapr settings. However, when changing a Dapr setting, you'll trigger an automatic restart of that container app instance and revisions.

#### Dapr components

Dapr components are scoped to a Container App environment and are pluggable modules that:

- Allow you to use the individual Dapr building block APIs.
- Can be scoped to specific Container Apps.
- Can be easily swapped out at the environment level of your Container App.

Based on your needs, you can "plug in" certain Dapr component types like state stores, pub/sub brokers, and more. In the examples below, view the various schemas you can define for a Dapr component in Azure Container Apps and compare with the schema provided with Dapr OSS.

# [Dapr OSS](#tab/oss)

In Dapr OSS, running `dapr init` generates the following `<component>.yml` spec in the Dapr components directory.

```yml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: statestore
spec:
  type: state.redis
  version: v1
  metadata:
  - name: redisHost
    value: localhost:6379
  - name: redisPassword
    value: ""
  - name: actorStateStore
    value: "true"
```

# [YAML](#tab/yaml)

When defining a component via the `<component>.yml` spec, you pass it to the Azure CLI.

```yaml
# components.yaml for Azure Blob storage component
- name: statestore
  type: state.azure.blobstorage
  version: v1
  metadata:
  # Note that in a production scenario, account keys and secrets 
  # should be securely stored. For more information, see
  # https://docs.dapr.io/operations/components/component-secrets
  - name: accountName
    secretRef: storage-account-name
  - name: accountKey
    secretRef: storage-account-key
  - name: containerName
    value: mycontainer
```

# [Bicep](#tab/bicep)

```bicep
param location string = 'canadacentral'
param environment_name string
param storage_account_name string
param storage_account_key string
param storage_container_name string

resource nodeapp 'Microsoft.Web/containerapps@2021-03-01' = {
  name: 'nodeapp'
  kind: 'containerapp'
  location: location
  properties: {
    kubeEnvironmentId: resourceId('Microsoft.Web/kubeEnvironments', environment_name)
    configuration: {
      ingress: {
        external: true
        targetPort: 3000
      }
      secrets: [
        {
          name: 'storage-key'
          value: storage_account_key
        }
      ]
    }
    template: {
      containers: [
        {
          image: 'dapriosamples/hello-k8s-node:latest'
          name: 'hello-k8s-node'
          resources: {
            cpu: '0.5'
            memory: '1Gi'
          }
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 1
      }
      dapr: {
        enabled: true
        appPort: 3000
        appId: 'nodeapp'
        components: [
          {
            name: 'statestore'
            type: 'state.azure.blobstorage'
            version: 'v1'
            metadata: [
              {
                name: 'accountName'
                value: storage_account_name
              }
              {
                name: 'accountKey'
                secretRef: 'storage-key'
              }
              {
                name: 'containerName'
                value: storage_container_name
              }
            ]
          }
        ]
      }
    }
  }
}

```

# [ARM](#tab/arm)

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-08-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "location": {
            "defaultValue": "canadacentral",
            "type": "String"
        },
        "environment_name": {
            "type": "String"
        },
        "storage_account_name": {
            "type": "String"
        },
        "storage_account_key": {
            "type": "String"
        },
        "storage_container_name": {
            "type": "String"
        }
    },
    "variables": {},
    "resources": [
        {
            "name": "nodeapp",
            "type": "Microsoft.Web/containerApps",
            "apiVersion": "2021-03-01",
            "kind": "containerapp",
            "location": "[parameters('location')]",
            "properties": {
                "kubeEnvironmentId": "[resourceId('Microsoft.Web/kubeEnvironments', parameters('environment_name'))]",
                "configuration": {
                    "ingress": {
                        "external": true,
                        "targetPort": 3000
                    },
                    "secrets": [
                        {
                            "name": "storage-key",
                            "value": "[parameters('storage_account_key')]"
                        }
                    ]
                },
                "template": {
                    "containers": [
                        {
                            "image": "dapriosamples/hello-k8s-node:latest",
                            "name": "hello-k8s-node",
                            "resources": {
                                "cpu": 0.5,
                                "memory": "1Gi"
                            }
                        }
                    ],
                    "scale": {
                        "minReplicas": 1,
                        "maxReplicas": 1
                    },
                    "dapr": {
                        "enabled": true,
                        "appPort": 3000,
                        "appId": "nodeapp",
                        "components": [
                            {
                                "name": "statestore",
                                "type": "state.azure.blobstorage",
                                "version": "v1",
                                "metadata": [
                                    {
                                        "name": "accountName",
                                        "value": "[parameters('storage_account_name')]"
                                    },
                                    {
                                        "name": "accountKey",
                                        "secretRef": "storage-key"
                                    },
                                    {
                                        "name": "containerName",
                                        "value": "[parameters('storage_container_name')]"
                                    }
                                ]
                            }
                        ]
                    }
                }
            }
        }
    ]
}
```

---

> [!NOTE]
> Since Dapr components and settings aren't revisionable, all running instances of a revision share the same set of Dapr components. 

By default, every Container App will load the Dapr component. Limit which Container App will load the component by adding application scopes.

Scope the Dapr component to particular Container Apps by adding the `scopes` property and providing the necessary app ids. 


#### Dapr sidecar

#### External Azure service integrated with your Container App

### Current supported Dapr version

Currently, Azure Container Apps supports Dapr version 1.4.2. 

Version upgrades are handled transparently by the Container Apps platform. You can find the current version via the Azure portal and the CLI. See [known limitations](#limitations) around versioning.

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
