---
title: Scaling in Azure Container Apps
description: Learn how applications scale in and out in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 11/02/2021
ms.author: cshoe
ms.custom: ignite-fall-2021
---

# Set scaling rules in Azure Container Apps

Azure Container Apps manages automatic horizontal scaling through a set of declarative scaling rules. As a container app scales out, new instances of the container app are created on-demand. These instances are known as replicas.

Scaling rules are defined in `resources.properties.template.scale` section of the [configuration](overview.md). There are two scale properties that apply to all rules in your container app.

| Scale property | Description | Default value | Min value | Max value |
|---|---|---|---|---|
| `minReplicas` | Minimum number of replicas running for your container app. | 0 | 1 | 25 |
| `maxReplicas` | Maximum number of replicas running for your container app. | n/a | 1 | 25 |

- If your container app scales to zero, then you aren't billed.
- Individual scale rules are defined in the `rules` array.
- If you want to ensure that an instance of your application is always running, set `minReplicas` to 1 or higher.
- Replicas not processing, but that remain in memory are billed in the "idle charge" category.
- Changes to scaling rules are a [revision-scope](overview.md) change.
- When using non-HTTP event scale rules, setting the `activeRevisionMode` to `single` is recommended.

> [!IMPORTANT]
> Replica quantities are a target amount, not a guarantee. Even if you set `maxReplicas` to `1`, there is no assurance of thread safety.

## Scale triggers

Container Apps supports a large number of scale triggers. For more information about supported scale triggers, see [KEDA Scalers](https://keda.sh/docs/scalers/).

The KEDA documentation shows code examples in YAML, while the Container Apps ARM template is in JSON. As you transform examples from KEDA for your needs, make sure to switch property names from [kebab](https://en.wikipedia.org/wiki/Naming_convention_(programming)#Delimiter-separated_words) case to [camel](https://en.wikipedia.org/wiki/Naming_convention_(programming)#Letter_case-separated_words) casing.

## HTTP

With an HTTP scaling rule, you have control over the threshold that determines when to scale out.

| Scale property | Description | Default value | Min value | Max value |
|---|---|---|---|---|
| `concurrentRequests`| Once the number of requests exceeds this value, then more replicas are added, up to the `maxReplicas` amount. | 50 | 1 | n/a |

```json
{
  ...
  "resources": {
    ...
    "properties": {
      ...
      "template": {
        ...
        "scale": {
          "minReplicas": 0,
          "maxReplicas": 5,
          "rules": [{
            "name": "http-rule",
            "http": {
              "metadata": {
                  "concurrentRequests": "100"
              }
            }
          }]
        }
      }
    }
  }
}
```

In this example, the container app scales out up to five replicas and can scale down to zero instances. The scaling threshold is set to 100 concurrent requests per second.

## Event-driven

Container Apps can scale based of a wide variety of event types. Any event supported by [KEDA](https://keda.sh/docs/scalers/), is supported in Container Apps.

Each event type features different properties in the `metadata` section of the KEDA definition. Use these properties to define a scale rule in Container Apps.

The following example shows how to create a scale rule based on an [Azure Service Bus](https://keda.sh/docs/scalers/azure-service-bus/) trigger.

```json
{
  ...
  "resources": {
    ...
    "properties": {
      "configuration": {
        "secrets": [{
          "name": "servicebusconnectionstring",
          "value": "<MY-CONNECTION-STRING-VALUE>"
        }],
      },
      "template": {
        ...
        "scale": {
          "minReplicas": "0",
          "maxReplicas": "10",
          "rules": [
          {
            "name": "queue-based-autoscaling",
            "custom": {
              "type": "azure-servicebus",
              "metadata": {
                "queueName": "myServiceBusQueue",
                "messageCount": "20"
              },
              "auth": [{
                "secretRef": "servicebusconnectionstring",
                "triggerParameter": "connection"
              }]
        }
    }]
}
```

In this example, the container app scales according to the following behavior:

- As the messages count in the queue exceeds 20, new replicas are created.
- The connection string to the queue is provided as a parameter to the configuration file and referenced via the `secretRef` property.

## CPU

CPU scaling allows your app to scale in or out depending on how much the CPU is being used. CPU scaling doesn't allow your container app to scale to 0. For more information about this trigger, see [KEDA CPU scale trigger](https://keda.sh/docs/scalers/cpu/).

The following example shows how to create a CPU scaling rule.

```json
{
  ...
  "resources": {
    ...
    "properties": {
      ...
      "template": {
        ...
        "scale": {
          "minReplicas": "1",
          "maxReplicas": "10",
          "rules": [{
            "name": "cpuScalingRule",
            "custom": {
              "type": "cpu",
              "metadata": {
                "type": "Utilization",
                "value": "50"
              }
            }
          }]
        }
      }
    }
  }
}
```

- In this example, the container app scales when CPU usage exceeds 50%.
- At a minimum, a single replica remains in memory for apps that scale based on CPU utilization.

## Memory

Memory scaling allows your app to scale in or out depending on how much of the memory is being used. Memory scaling doesn't allow your container app to scale to 0. For more information regarding this scaler, see [KEDA Memory scaler](https://keda.sh/docs/scalers/memory/).

The following example shows how to create a memory scaling rule.

```json
{
  ...
  "resources": {
    ...
    "properties": {
      ...
      "template": {
        ...
        "scale": {
          "minReplicas": "1",
          "maxReplicas": "10",
          "rules": [{
            "name": "memoryScalingRule",
            "custom": {
              "type": "memory",
              "metadata": {
                "type": "Utilization",
                "value": "50"
              }
            }
          }]
        }
      }
    }
  }
}
```

- In this example, the container app scales when memory usage exceeds 50%.
- At a minimum, a single replica remains in memory for apps that scale based on memory utilization.

## Azure Pipelines

Azure Pipelines scaling allows your container app to scale in or out depending on the number of jobs in the Azure DevOps agent pool. With Azure Pipelines, your app can scale to zero, but you need [at least one agent registered in the pool schedule additional agents](https://keda.sh/blog/2021-05-27-azure-pipelines-scaler/). For more information regarding this scaler, see [KEDA Azure Pipelines scaler](https://keda.sh/docs/2.4/scalers/azure-pipelines/).

The following example shows how to create a memory scaling rule.

```json
{
  ...
  "resources": {
    ...
    "properties": {
      ...
      "template": {
        ...
        "scale": {
          "minReplicas": "0",
          "maxReplicas": "10",
          "rules": [{
            "name": "azdo-agent-scaler",
            "custom": {
              "type": "azure-pipelines",
              "metadata": {
                  "poolID": "<pool id>",
                  "targetPipelinesQueueLength": "1"
              },
              "auth": [
                  {
                      "secretRef": "<secret reference pat>",
                      "triggerParameter": "personalAccessToken"
                  },
                  {
                      "secretRef": "<secret reference Azure DevOps url>",
                      "triggerParameter": "organizationURL"
                  }
              ]
          }
          }]
        }
      }
    }
  }
}
```

In this example, the container app scales when at least one job is waiting in the pool queue.

## Considerations

- Vertical scaling is not supported.
- Replica quantities are a target amount, not a guarantee.
  - Even if you set `maxReplicas` to `1`, there is no assurance of thread safety.

## Next steps

> [!div class="nextstepaction"]
> [Secure your container app](secure-app.md)
