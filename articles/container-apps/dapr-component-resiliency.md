---
title: Dapr component resiliency
titleSuffix: Azure Container Apps
description: Learn how to make your Dapr components resilient in Azure Container Apps.
services: container-apps
author: hhunter-ms
ms.service: container-apps
ms.topic: conceptual
ms.date: 10/23/2023
ms.author: hannahhunter
ms.custom: ignite-fall-2023
# Customer Intent: As a developer, I'd like to learn how to make my container apps resilient using Azure Container Apps.
---

# Dapr component resiliency

If your container app uses a Dapr component (for example, Azure Service Bus), the Dapr sidecar determines how to apply timeout and retry policies to your API calls.

:::image type="content" source="media/dapr-component-resiliency/dapr-component-resiliency.png" alt-text="Diagram demonstrating resiliency for container apps with Dapr components.":::

You can configure resiliency policies for the following outbound and inbound operation directions via a Dapr component: 

- **Outbound operations:** Calls from the sidecar to a component, such as:
   - Persisting or retrieving state
   - Publishing a message
   - Invoking an output binding
- **Inbound operations:** Calls from the sidecar to your container app, such as:
   - Subscriptions when delivering a message
   - Input bindings delivering an event

## Supported resiliency policies

- [Timeouts](#timeouts)
- [Retries (HTTP and TCP)](#retries)
- [Circuit breakers](#circuit-breakers)

## Creating resiliency policies

Create resiliency policies using Bicep, the CLI, and the Azure portal. 

> [!IMPORTANT]
> Once you've applied all the resiliency policies that use Dapr, restart your Dapr applications.

# [Bicep](#tab/bicep)

You can create your resiliency policies in Bicep. The following resiliency example demonstrates all of the available configurations. 

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

To create a resiliency policy with recommended settings for timeouts and retries, run the following command:

```azurecli
az containerapp resiliency-policy create -g MyResourceGroup -n MyContainerApp –default​
```

To create resiliency policies for your container app from a resiliency YAML you've created, run the following command:

```azurecli
az containerapp resiliency-policy create -g MyResourceGroup –n MyContainerApp –yaml MyYAMLPath
```

This command passes a YAML file similar to the following:

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

To show your existing resiliency policies in your resource group, run:

```azurecli
az containerapp resiliency-policies show -g MyResourceGroup –name MyContainerApp​
```

To update a resiliency policy, run the following command:

```azurecli
todo
```

To delete a resiliency policy, run:

```azurecli
az containerapp resiliency-policies remove -g MyResourceGroup –name MyContainerApp​
```

# [Azure portal](#tab/portal)

Need

---

## Policy descriptions

### Timeouts

Timeouts are used to early-terminate long-running operations. The timeout policy includes the following properties.

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

| Metadata | Required? | Description | Example |
| -------- | --------- | ----------- | ------- |
| `responseTimeoutInSeconds` | Y | Timeout waiting for a response from the upstream container app (or Dapr component). | `15` |

### Retries

Define an `httpRetryPolicy` strategy for failed operations, including failures due to a failed timeout or circuit breaker policy. The retry policy includes the following configurations.


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

| Metadata | Required? | Description | Example |
| -------- | --------- | ----------- | ------- |
| `maxRetries` | Y | Maximum retries to be executed for a failed http-request. | `5` |
| `retryBackOff` | Y | Monitor the requests and shut off all traffic to the impacted service when timeout and retry criteria are met. | N/A |
| `retryBackOff.initialDelayInMilliseconds` | Y | Delay between first error and first retry. | `1000` |
| `retryBackOff.maxIntervalInMilliseconds` | Y | Maximum delay between retries. | `10000` |

## Resiliency observability

### Resiliency creation via system logs

### Resiliency metrics

## Related content

See how resiliency works for:
- [Container apps using the application's service name](./service-name-resiliency.md)
- [Container apps using Dapr Service Invocation API](./dapr-invoke-resiliency.md)
