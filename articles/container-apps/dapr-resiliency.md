---
title: Dapr component policies
titleSuffix: Azure Container Apps
description: Learn how to make your Dapr components resilient in Azure Container Apps.
services: container-apps
author: hhunter-ms
ms.service: container-apps
ms.topic: conceptual
ms.date: 10/16/2023
ms.author: hannahhunter
ms.custom: ignite-fall-2023
# Customer Intent: As a developer, I'd like to learn how to make my container apps resilient using Azure Container Apps.
---

# Dapr component policies

When using `dapr invoke` for service-to-service invocation between your Dapr sidecar and a component (for example, Azure Service Bus), the Dapr sidecar determines how to apply timeout and retry policies to your API calls.

:::image type="content" source="media/container-app-resiliency/container-to-container-resiliency.png" alt-text="Diagram demonstrating container app to container app resiliency for container apps with or without Dapr enabled.":::

Dapr component policies include outbound and inbound operation directions. 

- **Outbound operations:** Calls from the sidecar to a component, such as:
   - Persisting or retrieving state
   - Publishing a message
   - Invoking an output binding
- **Inbound operations:** Calls from the sidecar to your container app, such as:
   - Subscriptions when delivering a message
   - Input bindings delivering an event

## Spec metadata

For pub/sub, service invocation, and input/output bindings, define timeouts and retries using the following metadata.

### Timeouts

Timeouts are used to early-terminate long-running operations. The timeout policy includes the following metadata.

```bicep
properties: {
  outbound: {
    timeoutPolicy: {
        responseTimeoutInSeconds: 15
    }
  },
  inbound: {
    timeoutPolicy: {
        responseTimeoutInSeconds: 15
    }
  }
}
```

| Metadata | Description | Example |
| -------- | ----------- | ------- |
| `responseTimeoutInSeconds` |  |  |

### Retries

Define a `tcpRetryPolicy` or an `httpRetryPolicy` strategy for failed operations, including failures due to a failed timeout or circuit breaker policy. The retry policy includes the following configurations.

#### `httpRetryPolicy`

```bicep
properties: {
  outbound: {
    httpRetryPolicy: {
        maxRetries: 5
        retryBackOff: {
          initialDelayInMilliseconds: 1000
          maxIntervalInMilliseconds: 10000
        }
    }
  },
  inbound: {
    httpRetryPolicy: {
        maxRetries: 5
        retryBackOff: {
          initialDelayInMilliseconds: 1000
          maxIntervalInMilliseconds: 10000
        }
    }
  } 
}
```

| Metadata | Description |
| ------ | ----------- |
| `maxRetries` |  |
| `retryBackOff` | Monitor the requests and shut off all traffic to the impacted service when timeout and retry criteria are met. |
| `retryBackOff.initialDelayInMilliseconds` |  |
| `retryBackOff.maxIntervalInMilliseconds` |  |

## Define your resiliency policies

Create and apply resiliency policies using Bicep, the CLI, and the Azure portal.

# [Bicep](#tab/bicep)

You can create your resiliency resource in Bicep. The following resiliency example demonstrates all of the available configurations. 

```bicep
resource myPolicyDoc 'Microsoft.App/containerApps/appResiliencyPolicy@version' = {
  name: 'myResiliencyPolicy'
  parent: '${appName}'
  properties: {
    outbound: {
      timeoutPolicy: {
          responseTimeoutInSeconds: 15
      }
      httpRetryPolicy: {
          maxRetries: 5
          retryBackOff: {
            initialDelayInMilliseconds: 1000
            maxIntervalInMilliseconds: 10000
          }
      } 
    }, 
    inbound: {
      timeoutPolicy: {
        responseTimeoutInSeconds: 15
      }
      httpRetryPolicy: {
        maxRetries: 5
        retryBackOff: {
          initialDelayInMilliseconds: 1000
          maxIntervalInMilliseconds: 10000
        }
      } 
    }
  }
}
```

# [CLI](#tab/cli)

Before you begin, make sure you're logged into the Azure CLI:

```azurecli
az login
```

To create a default resiliency resource with basic timeout and retry values, run the following command:

```azurecli
az containerapp resiliency-policy create -g MyResourceGroup -n MyContainerApp –default​
```

To create a resiliency YAML that you can customize for your Dapr component or container app, run the following command instead:

```azurecli
az containerapp resiliency-policy create -g MyResourceGroup –n MyContainerApp –yaml MyYAMLPath
```
This command produces a YAML file that you can edit and save.

```yaml
spec:
  policies:
    timeoutPolicy:
      responseTimeoutInSeconds: 30
      connectionTimeoutInSeconds: 5
    httpRetryPolicy:
      maxRetries: 5
      retryBackOff:
        initialDelayInMilliseconds: 1000
        maxIntervalInMilliseconds: 10000
      matches:
        errors:
          - 5xx
          - connect-failure
          - reset
    tcpRetryPolicy:
      maxConnectAttempts: 3
```

To show your existing resiliency resources in your resource group, run:

```azurecli
az containerapp resiliency-policies show -g MyResourceGroup –name MyContainerApp​
```

To delete a resiliency resource, run:

```azurecli
az containerapp resiliency-policies remove -g MyResourceGroup –name MyContainerApp​
```

# [Azure portal](#tab/portal)

Need

---

## Related content

[See how resiliency works for Dapr components in Azure Container Apps](./container-app-resiliency.md)

