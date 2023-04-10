---
title: Scale Dapr components with KEDA scalers for Azure Container Apps
description: Learn how to use KEDA scalers to scale an Azure Container App and its Dapr sidecar. 
author: hhunter-ms
ms.author: hannahhunter
ms.service: container-apps
ms.topic: how-to 
ms.date: 04/07/2023
---

# Scale Dapr components with KEDA scalers for Azure Container Apps

When scale rules are omitted on an Azure Container Apps resource, the container app is created with a default scale rule. If the resource receives no incoming traffic over a duration of five minutes, that default rule scales all replicas down to zero.

This behavior can be problematic and unexpected when leveraging Dapr components, specifically pub/sub subscriptions and input bindings. This is due to how the mechanism for subscriptions and input bindings work. Unlike normal http flows, subscriptions and input bindings follow a "pull" message/event exchange model. In this case the Dapr sidecar from the subscriber service "pulls" messages rather than waiting for the message broker/event deliverer to initiate a connection. As a result, since the "puller" logic is in the Dapr sidecar, when it scales down to zero, the "puller" is stopped and there's no mechanism for it to know when to resume or scale back up from zero.

KEDA scalers is one possible solution for scaling an application and its sidecar when it has scaled to 0 and incoming events and messages are inbound. With KEDA, there is a process that's outside of the application, which is never scaled down to zero that can wawtch for new messages/incoming events. It can then scale the receiving application as needed based on the number of incoming messages/events.

However, there is complexity and redudancncy with the experience that is offered today. A Dapr component and a corresponding KEDA scaler are two separate configurations and it's not intuative that a KEDA scaler is often needed.

The following scenario outlines a simple scenario with two microservices - a publisher and subscriber. In a loop, the publisher is continuously publishing messages via the Dapr pub/sub API to the topic ‘orders’ in Azure Service Bus. The order-processor container app is subscribed to the ‘orders’ topic and is receiving  and processing the messages as they arrive. 

Let’s look at the Bicep for both Container Apps – the checkout and order-processor service as well as the Dapr Azure Serivce Bus component:

#### Checkout Container App (Publisher)

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

Since the checkout container app is a headless services that we want to run indefinitely and never scale down to 0, we are setting the min replicas to 1, which ensures the container app does not follow the default behavior of scaling to 0 after 5 minutes. 

Next, we will look at the configuration for the Dapr component for connecting to Azure Service Bus:

#### Order-Processor Container App (Subscriber)
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

In the above example, the component is configured to connect to Azure Service Bus via a connection string. 

Lastly, we'll review the `order-processor` container app:

#### Order-Processor Container App (Subscriber)

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

Notice the scale property on the resource:

```bicep
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
```

This is a custom scale rule for the type “azure-servicebus”. This scale rule is needed to ensure that when a message comes into the Azure Service Bus while the order-processor is scaled to 0, that KEDA can scale up the container app, along with its Dapr sidecar so messages can be processed again. 
