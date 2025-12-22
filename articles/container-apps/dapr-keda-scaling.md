---
title: Scale Dapr Applications with KEDA Scalers Using Bicep
titleSuffix: Azure Container Apps
description: Find out how you can use a KEDA scaler to scale a container app and its Dapr sidecar in Azure Container Apps based on the message count in a service bus topic. 
author: hhunter-ms
ms.author: hannahhunter
ms.service: azure-container-apps
ms.custom: devx-track-bicep
ms.topic: concept-article 
ms.date: 12/02/2025
# customer intent: As a developer, I want to become familiar with the configuration of scaling rules in Azure Container Apps so that I can use KEDA scalers to scale my container apps and their Dapr sidecars.
---

# Scale Dapr applications with KEDA scalers

Azure Container Apps automatically scales applications to zero when there's no incoming HTTP traffic. However, you can also use other scaling triggers for apps that have non-HTTP traffic. For example, apps that use the [Distributed Application Runtime (Dapr)](https://docs.dapr.io/) publish and subscribe (pub/sub) and bindings building block APIs can benefit from event-driven scaling. In these scenarios, you can use [Kubernetes event-driven autoscaling (KEDA) scalers](https://keda.sh/) to scale your application and its Dapr sidecar out and in, based on the number of pending inbound events and messages.

This article introduces you to scaling rules for a Dapr pub/sub application that uses a KEDA messaging scaler.

## Sample pub/sub applications

For sample pub/sub applications, see the following GitHub repositories:

- [Microservice communication using pub/sub in C#](https://github.com/Azure-Samples/pubsub-dapr-csharp-servicebus)
- [Microservice communication using pub/sub in JavaScript](https://github.com/Azure-Samples/pubsub-dapr-nodejs-servicebus)
- [Microservice communication using pub/sub in Python](https://github.com/Azure-Samples/pubsub-dapr-python-servicebus)

In the preceding samples, each application uses the following elements:

- A `checkout` publisher. This container app is meant to run indefinitely. It doesn't scale in to zero, despite never receiving any incoming HTTP traffic.
- A Dapr Azure Service Bus pub/sub component.
- An `order-processor` subscriber. This container app picks up and processes messages that it receives via the service bus `orders` topic.

:::image type="content" source="media/dapr-keda-scaling/scaling-dapr-apps-keda.png" alt-text="Architecture diagram that shows the message flow from a publisher with a Dapr sidecar to a service bus and then to subscribers with a Dapr sidecar.":::

This article discusses a scaling rule for Service Bus in a Dapr application. The rule specifies conditions for scaling out the `order-processor` service and its Dapr sidecar when the message count in the `orders` service bus topic crosses a given threshold.

## Publisher container app

The `checkout` publisher is a headless service that runs indefinitely and never scales in to zero. 

By default, the [Container Apps runtime assigns an HTTP-based scale rule to applications](./scale-app.md), which drives scaling based on the number of incoming HTTP requests. In the following example, `minReplicas` is set to `1`. This setting configures the container app not to follow the default behavior of scaling in to zero when there's no incoming HTTP traffic. 

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
      // Set the minimum number of replicas to 1.
      scale: {
        minReplicas: 1
        maxReplicas: 1
      }
    }
  }
}
```

## Subscriber container app

The following `order-processor` subscriber app includes a custom scale rule for monitoring a resource of type `azure-servicebus`. This rule defines conditions for the app and its sidecar to scale out and in as needed, based on the number of pending messages in the service bus. When you define a scaling rule, KEDA runs automatically in your container app. You don't need to install KEDA or turn it on.

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
      // Enable Dapr on the container app.
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
      // Set the scale property on the order-processor resource.
      scale: {
        minReplicas: 0
        maxReplicas: 10
        rules: [
          {
            name: 'topic-based-scaling'
            custom: {
              type: 'azure-servicebus'
              identity: 'system'
              metadata: {
                topicName: 'orders'
                subscriptionName: 'membership-orders'
                messageCount: '30'
              }
            }
          }
        ]
      }
    }
  }
}
```

## How the scaler works

In the subscriber app, the scaler configuration contains a `messageCount` property:

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

This property specifies the number of messages each instance of the application can process at the same time. In this example, the value is set to `30`. As a result, the scaler creates one instance of the application for each group of 30 messages waiting in the topic. For example, if 150 messages are waiting, KEDA scales the app out to five instances.

The `maxReplicas` property is set to `10`. Even with a large number of messages in the topic, the scaler never creates more than `10` instances of this application. This setting helps ensure you don't scale out too much and accrue too much cost.

## Next step

[Microservice APIs powered by Dapr](./dapr-overview.md)
