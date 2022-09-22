---
title: Scaling in Azure Container Apps
description: Learn how applications scale in and out in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 06/10/2022
ms.author: cshoe
ms.custom: ignite-fall-2021
---

# Set scaling rules in Azure Container Apps

Azure Container Apps manages automatic horizontal scaling through a set of declarative scaling rules. As a container app scales out, new instances of the container app are created on-demand. These instances are known as replicas. When you first create a container app, the scale rule is set to zero. No usage charges are incurred when an application scales to zero. For more pricing information, see [Billing in Azure Container Apps](billing.md).

Scaling rules are defined in `resources.properties.template.scale` section of the JSON configuration file. When you add or edit existing scaling rules, a new revision of your container is automatically created with the new configuration. A revision is an immutable snapshot of your container app and it gets created automatically when certain aspects of your application are updated (scaling rules, Dapr settings, template configuration etc.). See the [Change types](./revisions.md#change-types) section to learn about the type of changes that do or don't trigger a new revision.

There are two scale properties that apply to all rules in your container app:

| Scale property | Description | Default value | Min value | Max value |
|---|---|---|---|---|
| `minReplicas` | Minimum number of replicas running for your container app. | 0 | 0 | 30 |
| `maxReplicas` | Maximum number of replicas running for your container app. | 10 | 1 | 30 |

- If your container app scales to zero, then you aren't billed usage charges.
- Individual scale rules are defined in the `rules` array.
- If you want to ensure that an instance of your application is always running, set `minReplicas` to 1 or higher.
- Replicas not processing, but that remain in memory are billed in the "idle charge" category.
- Changes to scaling rules are a [revision-scope](revisions.md#revision-scope-changes) change.
- It's recommended to set the  `properties.configuration.activeRevisionsMode` property of the container app to `single`, when using non-HTTP event scale rules.
- Container Apps implements the KEDA [ScaledObject](https://keda.sh/docs/concepts/scaling-deployments/#details) and HTTP scaler with the following default settings.
  - pollingInterval: 30 seconds
  - cooldownPeriod: 300 seconds

## Scale triggers

Azure Container Apps supports the following scale triggers:

- [HTTP traffic](#http): Scaling based on the number of concurrent HTTP requests to your revision.
- [Event-driven](#event-driven): Event-based triggers such as messages in an Azure Service Bus.
- [CPU](#cpu) or [Memory](#memory) usage: Scaling based on the amount of CPU or memory consumed by a replica.

## HTTP

With an HTTP scaling rule, you have control over the threshold that determines when to scale out.

| Scale property | Description | Default value | Min value | Max value |
|---|---|---|---|---|
| `concurrentRequests`| When the number of requests exceeds this value, then another replica is added. Replicas will continue to be added up to the `maxReplicas` amount as the number of concurrent requests increase. | 10 | 1 | n/a |

In the following example, the container app scales out up to five replicas and can scale down to zero. The scaling threshold is set to 100 concurrent requests per second.

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

### Add an HTTP scale trigger to a Container App in single-revision mode

> [!NOTE]
> Revisions are immutable. Changing scale rules automatically generates a new revision.

1. Open Azure portal, and navigate to your container app.

1. Select **Scale**, then select your revision from the dropdown menu.

    :::image type="content" source="media/scalers/scale-revisions.png" alt-text="A screenshot showing revisions scale.":::

1. Select **Edit and deploy**.

1. Select **Scale**, and then select **Add**.

    :::image type="content" source="media/scalers/add-scale-rule.png" alt-text="A screenshot showing how to add a scale rule.":::

1. Select **HTTP scaling** and enter a **Rule name** and the number of **Concurrent requests** for your scale rule and then select **Add**.

    :::image type="content" source="media/scalers/http-scale-rule.png" alt-text="A screenshot showing how to add an h t t p scale rule.":::

1. Select **Create** when you're done.

    :::image type="content" source="media/scalers/create-http-scale-rule.png" alt-text="A screenshot showing the newly created http scale rule.":::

## Event-driven

Container Apps can scale based of a wide variety of event types. Any event supported by [KEDA](https://keda.sh/docs/scalers/) is supported in Container Apps.

Each event type features different properties in the `metadata` section of the KEDA definition. Use these properties to define a scale rule in Container Apps.

The following example shows how to create a scale rule based on an [Azure Service Bus](https://keda.sh/docs/scalers/azure-service-bus/) trigger.

The container app scales according to the following behavior:

- For every 20 messages placed in the queue, a new replica is created.
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
          "maxReplicas": "30",
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

> [!NOTE]
> Upstream KEDA scale rules are defined using Kubernetes YAML, while Azure Container Apps supports ARM templates, Bicep Templates and Container Apps specific YAML. The following example uses an ARM template and therefore the rules need to switch property names from [kebab](https://en.wikipedia.org/wiki/Naming_convention_(programming)#Delimiter-separated_words) case to [camel](https://en.wikipedia.org/wiki/Naming_convention_(programming)#Letter_case-separated_words) when translating from existing KEDA manifests.

### Set up a connection string secret

To create a custom scale trigger, first create a connection string secret to authenticate with the different custom scalers.

1. In Azure portal, navigate to your container app and then select **Secrets**.

1. Select **Add**, and then enter your secret key/value information.

1. Select **Add** when you're done.

    :::image type="content" source="media/scalers/connection-string.png" alt-text="A screenshot showing how to create a connection string.":::

### Add a custom scale trigger

1. In Azure portal, select **Scale** and then select your revision from the dropdown menu.

    :::image type="content" source="media/scalers/scale-revisions.png" alt-text="A screenshot showing the revisions scale page.":::

1. Select **Edit and deploy**.

1. Select **Scale**, and then select **Add**.

    :::image type="content" source="media/scalers/add-scale-rule.png" alt-text="A screenshot showing how to add a scale rule.":::

1. Enter a **Rule name**, select **Custom** and enter a **Custom rule type**. Enter your **Secret reference** and **Trigger parameter** and then add your **Metadata** parameters. select **Add** when you're done.

    :::image type="content" source="media/scalers/custom-scaler.png" alt-text="A screenshot showing how to configure a custom scale rule.":::

1. Select **Create** when you're done.

> [!NOTE]
> In multiple revision mode, adding a new scale trigger creates a new revision of your application but your old revision remains available with the old scale rules. Use the **Revision management** page to manage their traffic allocations.

### KEDA scalers conversion

Azure Container Apps supports KEDA ScaledObjects and all of the available [KEDA scalers](https://keda.sh/docs/scalers/). To convert KEDA templates, it's easier to start with a custom JSON template and add the parameters you need based on the scenario and the scale trigger you want to set up.

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
          "maxReplicas": "30",
          "rules": [
          {
            "name": "<YOUR_TRIGGER_NAME>",
            "custom": {
              "type": "<TRIGGER_TYPE>",
              "metadata": {
              },
              "auth": [{
                "secretRef": "<YOUR_CONNECTION_STRING_NAME>",
                "triggerParameter": "<TRIGGER_PARAMETER>"
              }]
        }
    }]
}
```

The following YAML is an example of setting up an [Azure Storage Queue](https://keda.sh/docs/scalers/azure-storage-queue/) scaler that you can configure to auto scale based on Azure Storage Queues.

Below is the KEDA trigger specification for an Azure Storage Queue. To set up a scale rule in Azure Container Apps, you'll need the trigger `type` and any other required parameters. You can also add other optional parameters, which vary based on the scaler you're using.

In this example, you need the `accountName` and the name of the cloud environment that the queue belongs to `cloud` to set up your scaler in Azure Container Apps.

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

Now your JSON config file should look like this:

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
          "maxReplicas": "30",
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

> [!NOTE]
> KEDA ScaledJobs are not supported. For more information, see [KEDA Scaling Jobs](https://keda.sh/docs/concepts/scaling-jobs/#overview).

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

## Considerations

- Vertical scaling isn't supported.

- Replica quantities are a target amount, not a guarantee.
 
- If you're using [Dapr actors](https://docs.dapr.io/developing-applications/building-blocks/actors/actors-overview/) to manage states, you should keep in mind that scaling to zero isn't supported. Dapr uses virtual actors to manage asynchronous calls, which means their in-memory representation isn't tied to their identity or lifetime.

## Next steps

> [!div class="nextstepaction"]
> [Manage secrets](manage-secrets.md)
