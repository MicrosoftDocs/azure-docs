---
title: Scaling in Azure Container Apps
description: Learn how applications scale in and out in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.custom: devx-track-azurecli
ms.topic: conceptual
ms.date: 12/08/2022
ms.author: cshoe
zone_pivot_groups: arm-azure-cli-portal
---

# Set scaling rules in Azure Container Apps

Azure Container Apps manages automatic horizontal scaling through a set of declarative scaling rules. As a container app revision scales out, new instances of the revision are created on-demand. These instances are known as replicas.

Adding or editing scaling rules creates a new revision of your container app. A revision is an immutable snapshot of your container app. See revision [change types](./revisions.md#change-types) to review which types of changes trigger a new revision.

[Event-driven Container Apps jobs](jobs.md#event-driven-jobs) use scaling rules to trigger executions based on events.

## Scale definition

Scaling is defined by the combination of limits, rules, and behavior.

- **Limits** are the minimum and maximum possible number of replicas per revision as your container app scales.

    | Scale limit | Default value | Min value | Max value |
    |---|---|---|---|
    | Minimum number of replicas per revision | 0 | 0 | 300 |
    | Maximum number of replicas per revision | 10 | 1 | 300 |

    To request an increase in maximum replica amounts for your container app, [submit a support ticket](https://azure.microsoft.com/support/create-ticket/).

- **Rules** are the criteria used by Container Apps to decide when to add or remove replicas.

    [Scale rules](#scale-rules) are implemented as HTTP, TCP, or custom.

- **Behavior** is how the rules and limits are combined together to determine scale decisions over time.

    [Scale behavior](#scale-behavior) explains how scale decisions are calculated.

As you define your scaling rules, keep in mind the following items:

- You aren't billed usage charges if your container app scales to zero.
- Replicas that aren't processing, but remain in memory may be billed at a lower "idle" rate. For more information, see [Billing](./billing.md).
- If you want to ensure that an instance of your revision is always running, set the minimum  number of replicas to 1 or higher.

## Scale rules

Scaling is driven by three different categories of triggers:

- [HTTP](#http): Based on the number of concurrent HTTP requests to your revision.
- [TCP](#tcp): Based on the number of concurrent TCP connections to your revision.
- [Custom](#custom): Based on CPU, memory, or supported event-driven data sources such as:
    - Azure Service Bus
    - Azure Event Hubs
    - Apache Kafka
    - Redis

If you define more than one scale rule, the container app begins to scale once the first condition of any rules is met.

## HTTP

With an HTTP scaling rule, you have control over the threshold of concurrent HTTP requests that determines how your container app revision scales. Every 15 seconds, the number of concurrent requests is calculated as the number of requests in the past 15 seconds divided by 15. [Container Apps jobs](jobs.md) don't support HTTP scaling rules.

In the following example, the revision scales out up to five replicas and can scale in to zero. The scaling property is set to 100 concurrent requests per second.

### Example

::: zone pivot="azure-resource-manager"

The `http` section defines an HTTP scale rule.

| Scale property | Description | Default value | Min value | Max value |
|---|---|---|---|---|
| `concurrentRequests`| When the number of HTTP requests exceeds this value, then another replica is added. Replicas continue to add to the pool up to the `maxReplicas` amount. | 10 | 1 | n/a |

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

> [!NOTE]
> Set the `properties.configuration.activeRevisionsMode` property of the container app to `single`, when using non-HTTP event scale rules.

::: zone-end

::: zone pivot="azure-cli"

Define an HTTP scale rule using the `--scale-rule-http-concurrency` parameter in the [`create`](/cli/azure/containerapp#az-containerapp-create) or [`update`](/cli/azure/containerapp#az-containerapp-update) commands.

| CLI parameter | Description | Default value | Min value | Max value |
|---|---|---|---|---|
| `--scale-rule-http-concurrency`| When the number of concurrent HTTP requests exceeds this value, then another replica is added. Replicas continue to add to the pool up to the `max-replicas` amount. | 10 | 1 | n/a |

```azurecli-interactive
az containerapp create \
  --name <CONTAINER_APP_NAME> \
  --resource-group <RESOURCE_GROUP> \
  --environment <ENVIRONMENT_NAME> \
  --image <CONTAINER_IMAGE_LOCATION>
  --min-replicas 0 \
  --max-replicas 5 \
  --scale-rule-name azure-http-rule \
  --scale-rule-type http \
  --scale-rule-http-concurrency 100
```

::: zone-end

::: zone pivot="azure-portal"

1. Go to your container app in the Azure portal

1. Select **Scale**.

1. Select **Edit and deploy**.

1. Select the **Scale** tab.

1. Select the minimum and maximum replica range.

    :::image type="content" source="media/scale-app/azure-container-apps-scale-slide.png" alt-text="Screenshot of Azure Container Apps scale range slider.":::

1. Select **Add**.

1. In the *Rule name* box, enter a rule name.

1. From the *Type* dropdown, select **HTTP Scaling**.

1. In the *Concurrent requests* box, enter your desired number of concurrent requests for your container app.

::: zone-end

## TCP

With a TCP scaling rule, you have control over the threshold of concurrent TCP connections that determines how your app scales. Every 15 seconds, the number of concurrent connections is calculated as the number of connections in the past 15 seconds divided by 15. [Container Apps jobs](jobs.md) don't support TCP scaling rules.

In the following example, the container app revision scales out up to five replicas and can scale in to zero. The scaling threshold is set to 100 concurrent connections per second.

### Example

::: zone pivot="azure-resource-manager"

The `tcp` section defines a TCP scale rule.

| Scale property | Description | Default value | Min value | Max value |
|---|---|---|---|---|
| `concurrentConnections`| When the number of concurrent TCP connections exceeds this value, then another replica is added. Replicas will continue to be added up to the `maxReplicas` amount as the number of concurrent connections increase. | 10 | 1 | n/a |

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
            "name": "tcp-rule",
            "tcp": {
              "metadata": {
                "concurrentConnections": "100"
              }
            }
          }]
        }
      }
    }
  }
}
```

::: zone-end

::: zone pivot="azure-cli"

Define a TCP scale rule using the `--scale-rule-tcp-concurrency` parameter in the [`create`](/cli/azure/containerapp#az-containerapp-create) or [`update`](/cli/azure/containerapp#az-containerapp-update) commands.

| CLI parameter | Description | Default value | Min value | Max value |
|---|---|---|---|---|
| `--scale-rule-tcp-concurrency`| When the number of concurrent TCP connections exceeds this value, then another replica is added. Replicas will continue to be added up to the `max-replicas` amount as the number of concurrent connections increase. | 10 | 1 | n/a |

```azurecli-interactive
az containerapp create \
  --name <CONTAINER_APP_NAME> \
  --resource-group <RESOURCE_GROUP> \
  --environment <ENVIRONMENT_NAME> \
  --image <CONTAINER_IMAGE_LOCATION>
  --min-replicas 0 \
  --max-replicas 5 \
  --scale-rule-name azure-tcp-rule \
  --scale-rule-type tcp \
  --scale-rule-tcp-concurrency 100
```

::: zone-end

::: zone pivot="azure-portal"

Not supported in the Azure portal. Use the [Azure CLI](scale-app.md?pivots=azure-cli#tcp) or [Azure Resource Manager](scale-app.md?&pivots=azure-resource-manager#tcp) to configure a TCP scale rule.

::: zone-end

## Custom

You can create a custom Container Apps scaling rule based on any [ScaledObject](https://keda.sh/docs/latest/concepts/scaling-deployments/)-based [KEDA scaler](https://keda.sh/docs/latest/scalers/)  with these defaults:

| Defaults | Seconds |
|--|--|
| Polling interval | 30 |
| Cool down period | 300 |

For [event-driven Container Apps jobs](jobs.md#event-driven-jobs), you can create a custom scaling rule based on any [ScaledJob](https://keda.sh/docs/latest/concepts/scaling-jobs/)-based KEDA scalers.

The following example demonstrates how to create a custom scale rule.

### Example

This example shows how to convert an [Azure Service Bus scaler](https://keda.sh/docs/latest/scalers/azure-service-bus/) to a Container Apps scale rule, but you use the same process for any other [ScaledObject](https://keda.sh/docs/latest/concepts/scaling-deployments/)-based [KEDA scaler](https://keda.sh/docs/latest/scalers/) specification.

For authentication, KEDA scaler authentication parameters convert into [Container Apps secrets](manage-secrets.md).

::: zone pivot="azure-resource-manager"

The following procedure shows you how to convert a KEDA scaler to a Container App scale rule. This snippet is an excerpt of an ARM template to show you where each section fits in context of the overall template.

```json
{
  ...
  "resources": {
    ...
    "properties": {
      ...
      "configuration": {
        ...
        "secrets": [
          {
            "name": "<NAME>",
            "value": "<VALUE>"
          }
        ]
      },
      "template": {
        ...
        "scale": {
          "minReplicas": 0,
          "maxReplicas": 5,
          "rules": [
            {
              "name": "<RULE_NAME>",
              "custom": {
                "metadata": {
                  ...
                },
                "auth": [
                  {
                    "secretRef": "<NAME>",
                    "triggerParameter": "<PARAMETER>"
                  }
                ]
              }
            }
          ]
        }
      }
    }
  }
}
```

Refer to this excerpt for context on how the below examples fit in the ARM template.

First, you'll define the type and metadata of the scale rule.

1. From the KEDA scaler specification, find the `type` value.

    :::code language="yml" source="~/azure-docs-snippets-pr/container-apps/keda-azure-service-bus-trigger.yml" highlight="2":::

1. In the ARM template, enter the scaler `type` value into the `custom.type` property of the scale rule.

    :::code language="json" source="~/azure-docs-snippets-pr/container-apps/container-apps-azure-service-bus-rule-0.json" highlight="6":::

1. From the KEDA scaler specification, find the `metadata` values.

    :::code language="yml" source="~/azure-docs-snippets-pr/container-apps/keda-azure-service-bus-trigger.yml" highlight="4,5,6":::

1. In the ARM template, add all metadata values to the `custom.metadata` section of the scale rule.

    :::code language="json" source="~/azure-docs-snippets-pr/container-apps/container-apps-azure-service-bus-rule-0.json" highlight="8,9,10":::

### Authentication

A KEDA scaler may support using secrets in a [TriggerAuthentication](https://keda.sh/docs/latest/concepts/authentication/) that is referenced by the `authenticationRef` property. You can map the TriggerAuthentication object to the Container Apps scale rule.

> [!NOTE]
> Container Apps scale rules only support secret references. Other authentication types such as pod identity are not supported.

1. Find the `TriggerAuthentication` object referenced by the KEDA `ScaledObject` specification.

1. From the KEDA specification, find each `secretTargetRef` of the `TriggerAuthentication` object and its associated secret.

    :::code language="yml" source="~/azure-docs-snippets-pr/container-apps/keda-azure-service-bus-auth.yml" highlight="8,16,17,18":::

1. In the ARM template, add all entries to the `auth` array of the scale rule.

    1. Add a [secret](./manage-secrets.md) to the container app's `secrets` array containing the secret value.

    1. Set the value of the `triggerParameter` property to the value of the `TriggerAuthentication`'s `key` property.

    1. Set the value of the `secretRef` property to the name of the Container Apps secret.

    :::code language="json" source="~/azure-docs-snippets-pr/container-apps/container-apps-azure-service-bus-rule-1.json" highlight="10,11,12,13,32,33,34,35":::

    Some scalers support metadata with the `FromEnv` suffix to reference a value in an environment variable. Container Apps looks at the first container listed in the ARM template for the environment variable.

    Refer to the [considerations section](#considerations) for more security related information.

::: zone-end

::: zone pivot="azure-cli"

1. From the KEDA scaler specification, find the `type` value.

    :::code language="yml" source="~/azure-docs-snippets-pr/container-apps/keda-azure-service-bus-trigger.yml" highlight="2":::

1. In the CLI command, set the `--scale-rule-type` parameter to the specification `type` value.

    :::code language="bash" source="~/azure-docs-snippets-pr/container-apps/container-apps-azure-service-bus-cli.bash" highlight="10":::

1. From the KEDA scaler specification, find the `metadata` values.

    :::code language="yml" source="~/azure-docs-snippets-pr/container-apps/keda-azure-service-bus-trigger.yml" highlight="4,5,6":::

1. In the CLI command, set the `--scale-rule-metadata` parameter to the metadata values.

    You'll need to transform the values from a YAML format to a key/value pair for use on the command line. Separate each key/value pair with a space.

    :::code language="bash" source="~/azure-docs-snippets-pr/container-apps/container-apps-azure-service-bus-cli.bash" highlight="11,12,13":::

### Authentication

A KEDA scaler may support using secrets in a [TriggerAuthentication](https://keda.sh/docs/latest/concepts/authentication/) that is referenced by the authenticationRef property. You can map the TriggerAuthentication object to the Container Apps scale rule.

> [!NOTE]
> Container Apps scale rules only support secret references. Other authentication types such as pod identity are not supported.

1. Find the `TriggerAuthentication` object referenced by the KEDA `ScaledObject` specification. Identify each `secretTargetRef` of the `TriggerAuthentication` object.

    :::code language="yml" source="~/azure-docs-snippets-pr/container-apps/keda-azure-service-bus-auth.yml" highlight="8,16,17,18":::

1. In your container app, create the [secrets](./manage-secrets.md) that match the `secretTargetRef` properties.

1. In the CLI command, set parameters for each `secretTargetRef` entry.

    1. Create a secret entry with the `--secrets` parameter. If there are multiple secrets, separate them with a space.

    1. Create an authentication entry with the `--scale-rule-auth` parameter. If there are multiple entries, separate them with a space.

    :::code language="bash" source="~/azure-docs-snippets-pr/container-apps/container-apps-azure-service-bus-cli.bash" highlight="8,14":::

::: zone-end

::: zone pivot="azure-portal"

1. Go to your container app in the Azure portal.

1. Select **Scale**.

1. Select **Edit and deploy**.

1. Select the **Scale and replicas** tab.

1. Select the minimum and maximum replica range.

    :::image type="content" source="media/scale-app/azure-container-apps-scale-slide.png" alt-text="Screenshot of Azure Container Apps scale range slider.":::

1. Select **Add**.

1. In the *Rule name* box, enter a rule name.

1. From the *Type* dropdown, select **Custom**.

1. From the KEDA scaler specification, find the `type` value.

    :::code language="yml" source="~/azure-docs-snippets-pr/container-apps/keda-azure-service-bus-trigger.yml" highlight="2":::

1. In the *Custom rule type* box, enter the scaler `type` value.

1. From the KEDA scaler specification, find the `metadata` values.

    :::code language="yml" source="~/azure-docs-snippets-pr/container-apps/keda-azure-service-bus-trigger.yml" highlight="4,5,6":::

1. In the portal, find the *Metadata* section and select **Add**. Enter the name and value for each item in the KEDA `ScaledObject` specification metadata section.

### Authentication

A KEDA scaler may support using secrets in a [TriggerAuthentication](https://keda.sh/docs/latest/concepts/authentication/) that is referenced by the authenticationRef property. You can map the TriggerAuthentication object to the Container Apps scale rule.

> [!NOTE]
> Container Apps scale rules only support secret references. Other authentication types such as pod identity are not supported.

1. In your container app, create the [secrets](./manage-secrets.md) that you want to reference.

1. Find the `TriggerAuthentication` object referenced by the KEDA `ScaledObject` specification. Identify each `secretTargetRef` of the `TriggerAuthentication` object.

    :::code language="yml" source="~/azure-docs-snippets-pr/container-apps/keda-azure-service-bus-auth.yml" highlight="16,17,18":::

1. In the *Authentication* section, select **Add** to create an entry for each KEDA `secretTargetRef` parameter.

::: zone-end

## Default scale rule

If you don't create a scale rule, the default scale rule is applied to your container app.

| Trigger | Min replicas | Max replicas |
|--|--|--|
| HTTP | 0 | 10 |

> [!IMPORTANT]
> Make sure you create a scale rule or set `minReplicas` to 1 or more if you don't enable ingress. If ingress is disabled and you don't define a `minReplicas` or a custom scale rule, then your container app will scale to zero and have no way of starting back up.

## Scale behavior

Scaling behavior has the following defaults:

| Parameter | Value |
|--|--|
| Polling interval | 30 seconds |
| Cool down period | 300 seconds |
| Scale up stabilization window | 0 seconds |
| Scale down stabilization window | 300 seconds |
| Scale up step | 1, 4, 100% of current |
| Scale down step | 100% of current |
| Scaling algorithm | `desiredReplicas = ceil(currentMetricValue / targetMetricValue)` |

- **Polling interval** is how frequently event sources are queried by KEDA. This value doesn't apply to HTTP and TCP scale rules.
- **Cool down period** is how long after the last event was observed before the application scales down to its minimum replica count.
- **Scale up stabilization window** is how long to wait before performing a scale up decision once scale up conditions were met.
- **Scale down stabilization window** is how long to wait before performing a scale down decision once scale down conditions were met.
- **Scale up step** is the rate new instances are added at. It starts with 1, 4, 8, 16, 32, ... up to the configured maximum replica count.
- **Scale down step** is the rate at which replicas are removed. By default 100% of replicas that need to shut down are removed.
- **Scaling algorithm** is the formula used to calculate the current desired number of replicas.

### Example

For the following scale rule:

```json
"minReplicas": 0,
"maxReplicas": 20,
"rules": [
  {
    "name": "azure-servicebus-queue-rule",
    "custom": {
      "type": "azure-servicebus",
      "metadata": {
        "queueName": "my-queue",
        "namespace": "service-bus-namespace",
        "messageCount": "5"
      }
    }
  }
]
```

Starting with an empty queue, KEDA takes the following steps in a scale up scenario:

1. Check `my-queue` every 30 seconds.
1. If the queue length equals 0, go back to (1).
1. If the queue length is > 0, scale the app to 1.
1. If the queue length is 50, calculate `desiredReplicas = ceil(50/5) = 10`.
1. Scale app to `min(maxReplicaCount, desiredReplicas, max(4, 2*currentReplicaCount))`
1. Go back to (1).

If the app was scaled to the maximum replica count of 20, scaling goes through the same previous steps. Scale down only happens if the condition was satisfied for 300 seconds (scale down stabilization window). Once the queue length is 0, KEDA waits for 300 seconds (cool down period) before scaling the app to 0.

## Considerations

- In "multiple revisions" mode, adding a new scale trigger creates a new revision of your application but your old revision remains available with the old scale rules. Use the **Revision management** page to manage traffic allocations.

- No usage charges are incurred when an application scales to zero. For more pricing information, see [Billing in Azure Container Apps](billing.md).

- You need to enable data protection for all .NET apps on Azure Container Apps. See [Deploying and scaling an ASP.NET Core app on Azure Container Apps](/aspnet/core/host-and-deploy/scaling-aspnet-apps/scaling-aspnet-apps) for details.

### Known limitations

- Vertical scaling isn't supported.

- Replica quantities are a target amount, not a guarantee.

- If you're using [Dapr actors](https://docs.dapr.io/developing-applications/building-blocks/actors/actors-overview/) to manage states, you should keep in mind that scaling to zero isn't supported. Dapr uses virtual actors to manage asynchronous calls, which means their in-memory representation isn't tied to their identity or lifetime.

## Next steps

> [!div class="nextstepaction"]
> [Manage secrets](manage-secrets.md)
