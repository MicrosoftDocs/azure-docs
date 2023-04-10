---
title: Scale Dapr components with KEDA scalers for Azure Container Apps
description: Learn how to use KEDA scalers to scale an Azure Container App and its Dapr sidecar. 
author: hhunter-ms
ms.author: hannahhunter
ms.service: container-apps
ms.topic: how-to 
ms.date: 04/10/2023
---

# Scale Dapr components with KEDA scalers for Azure Container Apps

When scale rules are omitted on an Azure Container Apps resource, the container app is created with a default scale rule. If the resource receives no incoming traffic over a duration of five minutes, that default rule scales all replicas down to zero. This behavior can be problematic and unexpected when leveraging Dapr components, specifically pub/sub subscriptions and input bindings. 

Using KEDA scalers, you can scale your application and its Dapr sidecar when it has scaled to zero with inbound events and messages. However, configuring _both_ a Dapr component and a corresponding KEDA scaler is not intuitive.

todo: solution - if it's redundant or complex, then why?

## Configure container apps for scaling

In this scenario:
1. In a loop, a `checkout` publisher container app continuously publishes messages via the Dapr pub/sub API to the `orders` topic in Azure Service Bus.
1. An `order-processor` subscriber container app subscribed to the `orders` topic receives and processes messages as they arrive.

Let’s look at the Bicep for:
- The `checkout` and `order-processor` container apps
- The Dapr Azure Serivce Bus component

todo: need actual steps - so far it's more of a scenario concept, user isn't walking through any steps.

### Publisher container app

The `checkout` publisher is a headless services that you want to run indefinitely and never scale down to zero. 

Set the `minReplicas` to "1", which ensures the container app does not follow the default behavior. 

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

### Dapr component

Next, configure the Dapr component for connecting to Azure Service Bus via a connection string.

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

### Subscriber container app

In the `order-processor` subscriber, you'll add a custom scale rule on the resource for the type `azure-servicebus`. With this scale rule, KEDA can scale up the container app and its Dapr sidecar, allowing incoming messages to be processed again while order-processor is scaled to zero.

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

## Next steps

[Learn more about using Dapr components with Azure Container Apps.](./dapr-overview.md)