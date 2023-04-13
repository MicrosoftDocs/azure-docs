---
title: Scale Dapr applications with KEDA scalers using Bicep
description: Learn how to use KEDA scalers to scale an Azure Container App and its Dapr sidecar. 
author: hhunter-ms
ms.author: hannahhunter
ms.service: container-apps
ms.topic: conceptual 
ms.date: 04/13/2023
---

# Scale Dapr applications with KEDA scalers

[Azure Container Apps automatically scales HTTP traffic to zero.](./scale-app.md) Since Dapr pub/sub and bindings are not HTTP traffic, you can use [KEDA scalers](https://keda.sh/) to scale out your application and its [Dapr](https://docs.dapr.io/) sidecar when it has scaled to zero with inbound events and messages. This guide demonstrates how to configure the scale rules of a Dapr pub/sub application with a KEDA messaging scaler. The scaler watches for incoming messages and scales the application in and out as needed. 

In this scenario, the application includes the following elements:
1. A `checkout` publisher container app that continuously publishes messages to the `orders` Azure Service Bus.
1. The Dapr Azure Service Bus pub/sub component.
1. An `order-processor` subscriber container app picks up messages received via the `orders` topic and processed as they arrive.
1. The scale rule for Azure Service Bus, which is responsible for scaling up the `order-processor` service and its Dapr sidecar when messages start to arrive to the `orders` topic.

## Publisher container app

The `checkout` publisher is a headless service that runs indefinitely and never scales out to zero. 

By default, [the Container Apps runtime assigns an HTTP-based scale rule to applications](./scale-app.md) which drives scaling based on the number of incoming HTTP requests. In the following example, `minReplicas` is set to `1`. This configuration ensures the container app doesn't follow the default behavior of scaling to zero when there is no incoming HTTP traffic. 

```bicep
resource checkout 'Microsoft.App/containerApps@2022-03-01' = {
  name: 'ca-checkout-${resourceToken}'
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    //...
    template: {
      //...
      // Scale the minReplicas to 1
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

The `order-processor` subscriber includes a custom scale rule on the resource for the type `azure-servicebus`. With this scale rule, KEDA scales out the container app and its Dapr sidecar. This scale behavior allows incoming messages to process as they arrive.

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
      //...
      // Enable Dapr on the container app
      dapr: {
        enabled: true
        appId: 'orders'
        appProtocol: 'http'
        appPort: 5001
      }
      //...
    }
    template: {
      //...
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
                subscriptionName: 'membership-orders'
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

Behind the scenes, KEDA scales the `order-processor` in or out to meet demand.

Notice the `messageCount` property on the scaler's configuration:

```bicep
{
  //...
  properties: {
    //...
    template: {
      //...
      scale: {
        //...
        rules: [
          //...
          custom: {
            //...
            metadata: {
              //...
              messageCount: '30'
            }
          }
        ]
      }
    }
  }
}
```

This property tells KEDA how many messages each instance of the application to process at the same time. In this example, the value is set to `30`, making KEDA scale out the application to match the number of messages waiting in the topic.

For example, if five messages are waiting, KEDA scales the app out to five instances. In this scenario, `maxReplicas` is set to `10`, so KEDA scales up the `order-processor` container app to a max of 10 replicas.

## Next steps

[Learn more about using Dapr components with Azure Container Apps.](./dapr-overview.md)