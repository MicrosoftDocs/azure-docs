---
title: Scaling in Azure Container Apps
description: Learn how applications scale in and out in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 11/07/2022
ms.author: cshoe
---

# Set scaling rules in Azure Container Apps

Azure Container Apps manages automatic horizontal scaling through a set of declarative scaling rules. As a container app scales out, new instances of the container app are created on-demand. These instances are known as replicas.

When you first create a container app, the scale rule is set to zero. No usage charges are incurred when an application scales to zero. For more pricing information, see [Billing in Azure Container Apps](billing.md).

Scaling rules are defined in `resources.properties.template.scale` section in your container app's Azure Resource Manager (ARM) template. When you add or edit existing scaling rules, a new revision of your container is created with the new configuration.

A revision is an immutable snapshot of your container app and is created as the  application configuration is updated. See the revision [change types](./revisions.md#change-types) to review which types of changes trigger a new revision.

## Scale definition

Scaling is defined by the minimum and maximum number of replicas paired with one or more scale rules.

| Scale property | Description | Default value | Min value | Max value |
|---|---|---|---|---|
| `minReplicas` | Minimum number of replicas running for your container app. | 0 | 0 | 30 |
| `maxReplicas` | Maximum number of replicas running for your container app. | 10 | 1 | 30 |

Individual scale rules are defined in the `rules` array.

The following ARM template excerpt shows the location and form of a scale definition and rules.

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
          "maxReplicas": 10,
          "rules": [{ ... }]
        }
      }
    }
  }
}
```

- If your container app scales to zero, then you aren't billed usage charges.
- If you want to ensure that an instance of your application is always running, set `minReplicas` to 1 or higher.
- Replicas not processing, but that remain in memory are billed in the "idle charge" category.
- Changes to scaling rules are a [revision-scope](revisions.md#revision-scope-changes) change.
- Set the  `properties.configuration.activeRevisionsMode` property of the container app to `single`, when using non-HTTP event scale rules.
- Container Apps implements the KEDA [ScaledObject](https://keda.sh/docs/concepts/scaling-deployments/#details) and HTTP scaler with the following default settings.
  - `pollingInterval`: 30 seconds
  - `cooldownPeriod`: 300 seconds

## Default scale rule

If you don't create a scale rule, the default scale rule is an HTTP rule with 0 `minReplicas` and 10 `maxReplicas`.

> [!IMPORTANT]
> Make sure you create a scale rule if you don't enable ingress. If ingress is disabled and all you have is the default rule, then your container app will scale to zero and have no way of starting back up.

## Scale triggers

Scaling is driven by various different triggers. Azure Container Apps supports two categories of scale triggers:

- [HTTP](#http): Where scaling based on the number of concurrent HTTP requests to your revision.
- [Custom](#custom): Where scaling is based on any [KEDA supported scaler](https://keda.sh/docs/latest/scalers/).

## HTTP

With an HTTP scaling rule, you have control over the request threshold that determines when the app scales out.

| Scale property | Description | Default value | Min value | Max value |
|---|---|---|---|---|
| `concurrentRequests`| When the number of requests exceeds this value, then another replica is added. Replicas continue to add to the pool up to the `maxReplicas` amount. | 10 | 1 | n/a |

In the following example, the container app scales out up to five replicas and can scale down to zero. The scaling threshold is set to 100 concurrent requests per second.

### Examples

# [ARM](#tab/arm)

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

# [CLI](#tab/cli)

TODO

# [Portal](#tab/portal)

1. Go to your container app in the Azure portal

1. Select **Scale**.

1. Select **Edit and deploy**.

1. Select **Scale**.

1. Select **Add**.

1. In the *Rule name* box, enter a rule name.

1. From the *Type* dropdown, select **HTTP Scaling**.

1. In the *Concurrent requests* box, enter your desired number of concurrent requests for your container app.

---

## Custom

You can create a custom Container Apps scaling rule based on any [KEDA scaler][https://keda.sh/docs/latest/scalers/].

KEDA scalers are defined as [ScaledObject](https://keda.sh/docs/latest/concepts/scaling-deployments/)s with [TriggerAuthentication](https://keda.sh/docs/latest/concepts/authentication/) objects that define security contexts. You can convert a KEDA scaler by mapping values from a `ScaledObject` and `TriggerAuthentication` object to a Container Apps scale rule.

The structure of a Container Apps scale rule follows this form:

```json
...
"rules": [{
    "type": ...,
    "metadata": {...},
    "auth": {...} (optional)
}]
...
```

The `type` and `metadata` values carry over verbatim from a `ScaledObject`, while `auth` values are composed from a KEDA [TriggerAuthentication](https://keda.sh/docs/latest/concepts/authentication/) object. Each `secretTargetRef` from a `TriggerAuthentication` object maps to an object in the Container Apps scale rule `auth` array.

This table shows the mapping between KEDA and Container Apps.

| KEDA `triggerAuthentication` parameter | Container Apps scale rule `auth` object parameter |
|--|--|
| `spec.secretTargetRef.parameter` | `triggerParameter` |
| `spec.secretTargetRef.key` | `secretRef` |

Alternatively, you can use the `connectionFromEnv` metadata parameter to provide a security context for your scale rule. When you set `connectionFromEnv` to an environment variable name, Container Apps looks at the first container listed in the ARM template for a connection string.

Refer to the [considerations section](#considerations) for more security related information.

### Example

This example shows how to convert an [Azure Queue Storage KEDA scaler](https://keda.sh/docs/latest/scalers/azure-storage-blob/) to a Container Apps scale rule, but you use the the same process for any other [KEDA scaler](https://keda.sh/docs/latest/scalers/).

# [ARM](#tab/arm)

TODO

> [!NOTE]
> KEDA scale rules are defined using Kubernetes YAML, while Azure Container Apps supports ARM templates, Bicep templates and Container Apps specific YAML. The following example uses an ARM template and therefore the rules need to switch property names from [kebab](https://en.wikipedia.org/wiki/Naming_convention_(programming)#Delimiter-separated_words) case to [camel](https://en.wikipedia.org/wiki/Naming_convention_(programming)#Letter_case-separated_words) when translating from existing KEDA manifests.

# [CLI](#tab/cli)

TODO

# [Portal](#tab/portal)

1. Go to your container app in the Azure portal

1. Select **Scale**.

1. Select **Edit and deploy**.

1. Select **Scale**.

1. Select **Add**.

1. In the *Rule name* box, enter a rule name.

1. From the *Type* dropdown, select **Custom**.

1. In the *Authentication* section, add... TODO

1. In the *Metadata* section, add... TODO

---

## Considerations

- Vertical scaling isn't supported.

- Replica quantities are a target amount, not a guarantee.

- If you're using [Dapr actors](https://docs.dapr.io/developing-applications/building-blocks/actors/actors-overview/) to manage states, you should keep in mind that scaling to zero isn't supported. Dapr uses virtual actors to manage asynchronous calls, which means their in-memory representation isn't tied to their identity or lifetime.

- Managed identity isn't supported. Use a connection string instead via the `connection` property.

- KEDA ScaledJobs aren't supported. For more information, see [KEDA Scaling Jobs](https://keda.sh/docs/concepts/scaling-jobs/#overview).

- In multiple revision mode, adding a new scale trigger creates a new revision of your application but your old revision remains available with the old scale rules. Use the **Revision management** page to manage traffic allocations.

## Next steps

> [!div class="nextstepaction"]
> [Manage secrets](manage-secrets.md)
