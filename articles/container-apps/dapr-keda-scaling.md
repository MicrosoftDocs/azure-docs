---
title: Scale Dapr applications with KEDA scalers
description: Learn how to use KEDA scalers to scale an Azure Container App and its Dapr sidecar. 
author: hhunter-ms
ms.author: hannahhunter
ms.service: container-apps
ms.topic: conceptual 
ms.date: 04/11/2023
---

# Scale Dapr applications with KEDA scalers

Using [KEDA scalers](https://keda.sh/), you can scale your application and its [Dapr](https://docs.dapr.io/) sidecar when it has scaled to zero with inbound events and messages. In this guide, we demonstrate scaling a Dapr pub/sub application by setting up a KEDA scaler to watch for messages coming into the queue and triggers the Dapr sidecar to spin up. 

In the following scenario, we examine the Bicep for:
1. A `checkout` publisher container app continuously publishes messages via the Dapr pub/sub API to the `orders` topic in Azure Service Bus.
1. The Dapr Azure Service Bus component.
1. An `order-processor` subscriber container app subscribed to the `orders` topic receives and processes messages as they arrive.
1. The scale rule for Azure Service Bus, which is responsible for scaling up the `order-processor` service and its Dapr sidecar when messages start to arrive to the`orders` topic.

## Publisher container app

The `checkout` publisher is a headless service that runs indefinitely and never scales down to zero. 

Below, we've set the `minReplicas` to "1", which ensures the container app doesn't follow the default behavior of scaling to zero with no incoming HTTP traffic. 

```bicep
resource checkout 'Microsoft.App/containerApps@2022-03-01' = {
  name: 'ca-checkout-${resourceToken}'
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    managedEnvironmentId: containerAppsEnvironment.id
    configuration: {
      activeRevisionsMode: 'single'
      dapr: {
        enabled: true
        appId: 'checkout'
        appProtocol: 'http'
      }
      secrets: [
        {
          name: 'registry-password'
          value: containerRegistry.listCredentials().passwords[0].value
        }
      ]
      registries: [
        {
          server: '${containerRegistry.name}.azurecr.io'
          username: containerRegistry.name
          passwordSecretRef: 'registry-password'
        }
      ]
    }
    template: {
      containers: [
        {
          image: imageName
          name: 'checkoutsvc'
          env: [
            {
              name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
              value: appInsights.properties.InstrumentationKey
            }
            {
              name: 'AZURE_KEY_VAULT_ENDPOINT'
              value: keyVault.properties.vaultUri
            }
          ]
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 1
      }
    }
  }
}
```

## Dapr Azure Service Bus component

Next, take a look at the Dapr component for connecting to Azure Service Bus via a connection string.

```bicep
resource daprComponent 'daprComponents' = {
    name: 'orderpubsub'
    properties: {
      componentType: 'pubsub.azure.servicebus'
      version: 'v1'
      secrets: [
        {
          name: 'sb-root-connectionstring'
          value: '${listKeys('${sb.id}/AuthorizationRules/RootManageSharedAccessKey', sb.apiVersion).primaryConnectionString};EntityPath=orders'
        }
      ]
      metadata: [
        {
          name: 'connectionString'
          secretRef: 'sb-root-connectionstring'
        }
        {
          name: 'consumerID'
          value: 'orders'
        }
      ]
      scopes: []
    }
  }
```

## Subscriber container app

In the `order-processor` subscriber, we've added a custom scale rule on the resource for the type `azure-servicebus`. With this scale rule, KEDA can scale up the container app and its Dapr sidecar, allowing incoming messages to be processed.

```bicep
resource orders 'Microsoft.App/containerApps@2022-03-01' = {
  name: 'ca-orders-${resourceToken}'
  location: location
  tags: union(tags, {
      'azd-service-name': 'orders'
    })
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    managedEnvironmentId: containerAppsEnvironment.id
    configuration: {
      activeRevisionsMode: 'single'
      ingress: {
        external: true
        targetPort: 5001
        transport: 'auto'
      }
      dapr: {
        enabled: true
        appId: 'orders'
        appProtocol: 'http'
        appPort: 5001
      }
      secrets: [
        {
          name: 'registry-password'
          value: containerRegistry.listCredentials().passwords[0].value
        }
        {
          name: 'sb-root-connectionstring'
          value: '${listKeys('${sb.id}/AuthorizationRules/RootManageSharedAccessKey', sb.apiVersion).primaryConnectionString};EntityPath=orders'
        }
      ]
      registries: [
        {
          server: '${containerRegistry.name}.azurecr.io'
          username: containerRegistry.name
          passwordSecretRef: 'registry-password'
        }
      ]
    }
    template: {
      containers: [
        {
          image: imageName
          name: 'orderssvc'
          env: [
            {
              name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
              value: appInsights.properties.InstrumentationKey
            }
            {
              name: 'AZURE_KEY_VAULT_ENDPOINT'
              value: keyVault.properties.vaultUri
            }
          ]
        }
      ]
      // Set the scale property on the order-processor resource
      scale: {
        minReplicas: 0
        maxReplicas: 10
        rules: [
          {
            name: 'topic-based-scaling'
            custom: {
              type: 'azure-servicebus'
              metadata: {
                topicName: 'orders'
                subscriptionName: 'orders'
                messageCount: '30'
              }
              auth: [
                {
                  secretRef: 'sb-root-connectionstring'
                  triggerParameter: 'connection'
                }
              ]
            }
          }
        ]
      }
    }
  }
}
```

## What happened?

By default, [Container Apps assigns an http-based scale rule to applications](./scale-app.md), scaling apps based on the number of incoming http requests. However, since the `order-processor` application is using the Dapr pub/sub abstraction to pull messages from a queue, it needs to define a custom scaler based on the number of messages waiting to be processed.

Behind the scenes, KEDA scales our `order-processor` appropriately (even down to zero). Notice the `messageCount` property on the scaler's configuration:

```bicep
metadata: {
  //...
  messageCount: '30'
}
```

This property tells KEDA how many messages each instance of our application can process at the same time. Since the application is single-threaded, we'd normally set this value to 1, resulting in KEDA scaling up our application to match the number of messages waiting in the queue. For example, if five messages are waiting, KEDA scales our app up to five instances. In our scenario, we set a `maxReplicas` value of 10, so KEDA scales up the `order-processor` container app to a max of 10 replicas.

## Next steps

[Learn more about using Dapr components with Azure Container Apps.](./dapr-overview.md)