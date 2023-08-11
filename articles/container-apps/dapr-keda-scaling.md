---
title: Scale Dapr applications with KEDA scalers using Bicep
titleSuffix: "Azure Container Apps"
description: Learn how to use KEDA scalers to scale an Azure Container App and its Dapr sidecar. 
author: hhunter-ms
ms.author: hannahhunter
ms.service: container-apps
ms.custom: devx-track-bicep
ms.topic: conceptual 
ms.date: 04/17/2023
---

# Scale Dapr applications with KEDA scalers

[Azure Container Apps automatically scales HTTP traffic to zero.](./scale-app.md) However, to scale non-HTTP traffic (like [Dapr](https://docs.dapr.io/) pub/sub and bindings), you can use [KEDA scalers](https://keda.sh/) to scale your application and its Dapr sidecar up and down, based on the number of pending inbound events and messages. 

This guide demonstrates how to configure the scale rules of a Dapr pub/sub application with a KEDA messaging scaler. For context, refer to the corresponding sample pub/sub applications:
- [Microservice communication using pub/sub in **C#**](https://github.com/Azure-Samples/pubsub-dapr-csharp-servicebus)
- [Microservice communication using pub/sub in **JavaScript**](https://github.com/Azure-Samples/pubsub-dapr-nodejs-servicebus)
- [Microservice communication using pub/sub in **Python**](https://github.com/Azure-Samples/pubsub-dapr-python-servicebus)


In the above samples, the application uses the following elements:
1. The `checkout` publisher is an application that is meant to run indefinitely and never scale down to zero, despite never receiving any incoming HTTP traffic.
1. The Dapr Azure Service Bus pub/sub component.
1. An `order-processor` subscriber container app picks up messages received via the `orders` topic and processed as they arrive.
1. The scale rule for Azure Service Bus, which is responsible for scaling up the `order-processor` service and its Dapr sidecar when messages start to arrive to the `orders` topic.

:::image type="content" source="media/dapr-keda-scaling/scaling-dapr-apps-keda.png" alt-text="Diagram showing the scaling architecture of the order processing application.":::

Let's take a look at how to apply the scaling rules in a Dapr application.

## Publisher container app

The `checkout` publisher is a headless service that runs indefinitely and never scales down to zero. 

By default, [the Container Apps runtime assigns an HTTP-based scale rule to applications](./scale-app.md), which drives scaling based on the number of incoming HTTP requests. In the following example, `minReplicas` is set to `1`. This configuration ensures the container app doesn't follow the default behavior of scaling to zero with no incoming HTTP traffic. 

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

## Subscriber container app

The following `order-processor` subscriber app includes a custom scale rule that monitors a resource of type `azure-servicebus`. With this rule, the app (and its sidecar) scales up and down as needed based on the number of pending messages in the Bus.

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

## How the scaler works

Notice the `messageCount` property on the scaler's configuration in the subscriber app:

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

This property tells the scaler how many messages each instance of the application can process at the same time. In this example, the value is set to `30`, indicating that there should be one instance of the application created for each group of 30 messages waiting in the topic.

For example, if 150 messages are waiting, KEDA scales the app out to five instances. The `maxReplicas` property is set to `10`, meaning even with a large number of messages in the topic, the scaler never creates more than `10` instances of this application. This setting ensures you don't scale up too much and accrue too much cost.

## Next steps

[Learn more about using Dapr components with Azure Container Apps.](./dapr-overview.md)
