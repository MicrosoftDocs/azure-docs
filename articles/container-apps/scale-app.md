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

Azure container Apps supports the following scale triggers:

- HTTP traffic: the number of concurrent HTTP requests to your microservices
- Event-based triggers such as messages in an Azure Service Bus
- CPU or Memory usage
- (Kubernetes Event-driven Autoscaling) [KEDA Scalers](https://keda.sh/docs/scalers/)

> [!NOTE]
> KEDA templates are in YAML, while Azure Container Apps ARM templates are in JSON. Make sure to switch property names from [kebab](https://en.wikipedia.org/wiki/Naming_convention_(programming)#Delimiter-separated_words) case to [camel](https://en.wikipedia.org/wiki/Naming_convention_(programming)#Letter_case-separated_words) casing when you convert KEDA rules.

## HTTP

With an HTTP scaling rule, you have control over the threshold that determines when to scale out.

| Scale property | Description | Default value | Min value | Max value |
|---|---|---|---|---|
| `concurrentRequests`| Once the number of requests exceeds this value, then more replicas are added, up to the `maxReplicas` amount. | 100 | 1 | n/a |

In the following example, the container app scales out up to five replicas and can scale down to zero instances. The scaling threshold is set to 100 concurrent requests per second.

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

## Add a HTTP scale trigger

1. In Azure Portal, select **Revision management** and then select your revision.

    :::image type="content" source="media/scalers/revisions.png" alt-text="A screenshot showing container apps revisions.":::

1. Select **Edit and deploy**.

    :::image type="content" source="media/scalers/edit-revision.png.png" alt-text="A screenshot showing how to edit a revision.":::

1. Select **Scale**, and then select **Add**.

    :::image type="content" source="media/scalers/add-scale-rule.png" alt-text="A screenshot showing how to add a scale rule.":::

1. Select **HTTP scaling** and enter a **Rule name** and the number of **Concurrent requests** for your scale rule and then select **Add**.

    :::image type="content" source="media/scalers/http-scale-rule.png" alt-text="A screenshot showing how to add a http scale rule.":::

1. Select **Create** when you are done.

    :::image type="content" source="media/scalers/create-http-scale-rule.png" alt-text="A screenshot showing the newly created http scale rule.":::

## Event-driven

Container Apps can scale based of a wide variety of event types. Any event supported by [KEDA](https://keda.sh/docs/scalers/), is supported in Container Apps.

Each event type features different properties in the `metadata` section of the KEDA definition. Use these properties to define a scale rule in Container Apps.

The following example shows how to create a scale rule based on an [Azure Service Bus](https://keda.sh/docs/scalers/azure-service-bus/) trigger. 

The container app scales according to the following behavior:

- As the messages count in the queue exceeds 20, new replicas are created.
- The connection string to the queue is provided as a parameter to the configuration file and referenced via the `secretRef` property.

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

## Add a custom scale trigger

To set up a custom scale trigger, we must create a connection string to authenticate with the different KEDA scalers. Jump to the [next section](#set-up-authentication) to set up authentication if you haven't done so already.

1. In Azure Portal, select **Revision management** and then select your revision.

    :::image type="content" source="media/scalers/revisions.png" alt-text="A screenshot showing container apps revisions.":::

1. Select **Edit and deploy**.

    :::image type="content" source="media/scalers/edit-revision.png.png" alt-text="A screenshot showing how to edit a revision.":::

1. Select **Scale**, and then select **Add**.

    :::image type="content" source="media/scalers/add-scale-rule.png" alt-text="A screenshot showing how to add a scale rule.":::

1. Enter a **Rule name**, select **Custom** and enter a **Custom rule type**. Enter your **Secret reference** and **Trigger parameter** and then add your **Metadata** parameters. select **Add** when you are done.

    :::image type="content" source="media/scalers/custom-scaler.png" alt-text="A screenshot showing how to configure a custom scale rule.":::

1. Select **Create** when you are done.

## Set up authentication

Follow these steps to create a connection string to authenticate with KEDA scalers

1. In Azure portal, navigate to your container app and then select **Secrets**.

1. Select **Add**, and then enter your secret key/value information.

1. Select **Add** when you are done.

    :::image type="content" source="media/scalers/connection-string.png" alt-text="A screenshot showing how to create a connection string.":::

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

## KEDA scalers conversion

Azure container apps supports all the available [scalers](https://keda.sh/docs/scalers/) from KEDA. To convert KEDA templates, it's easier to start with a boiler Container apps custom JSON template and add the parameters you need based on the scenario and the scale trigger we want to set up.

```json
{
  ...
  "resources": {
    ...
    "properties": {
      "configuration": {
        "secrets": [{
          "name": "<YOUR_CONNECTION_STRING_NAME>",
          "value": "<YOUR-CONNECTION-STRING>"
        }],
      },
      "template": {
        ...
        "scale": {
          "minReplicas": "0",
          "maxReplicas": "10",
          "rules": [
          {
            "name": "<YOUR_TRIGGER_NAME>",
            "custom": {
              "type": "<TRIGGER_TYPE>",
              "metadata": {    #Add the metadata parameters here
              },
              "auth": [{
                "secretRef": "<YOUR_CONNECTION_STRING_NAME>",
                "triggerParameter": "<TRIGGER_PARAMETER>" #E.G connection
              }]
        }
    }]
}
```

Let's go through an example of setting up an [Azure Storage Queue](https://keda.sh/docs/scalers/azure-storage-queue/) scaler where we will be auto scaling based on Azure Storage Queues.

Below is the Azure Storage Queue trigger specification from Keda docs. For this example, we will need the trigger type `azure-queue`, the `accountName` and the name of the cloud environment that the queue belongs to `cloud` to set up our scaler in Azure Container Apps.  

```yml
triggers:
- type: azure-queue
  metadata:
    queueName: orders
    queueLength: '5'
    connectionFromEnv: STORAGE_CONNECTIONSTRING_ENV_NAME
    accountName: storage-account-name
    cloud: AzureUSGovernmentCloud
```

Now our JSON config file should look like this:

```json
{
  ...
  "resources": {
    ...
    "properties": {
      "configuration": {
        "secrets": [{
          "name": "my-connection-string",
          "value": "*********"
        }],
      },
      "template": {
        ...
        "scale": {
          "minReplicas": "0",
          "maxReplicas": "10",
          "rules": [
          {
            "name": "queue-trigger",
            "custom": {
              "type": "azure-queue",
              "metadata": { 
                "accountName": "my-storage-account-name",
                "cloud": "AzurePublicCloud"
              },
              "auth": [{
                "secretRef": "my-connection-string",
                "triggerParameter": "connection"
              }]
        }
    }]
}
```

## Considerations

- Vertical scaling is not supported.
- Replica quantities are a target amount, not a guarantee.
  - Even if you set `maxReplicas` to `1`, there is no assurance of thread safety.

## Next steps

> [!div class="nextstepaction"]
> [Manage secrets](manage-secrets.md)
