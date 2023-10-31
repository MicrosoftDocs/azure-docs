---
title: Dapr component resiliency (preview)
titleSuffix: Azure Container Apps
description: Learn how to make your Dapr components resilient in Azure Container Apps.
services: container-apps
author: hhunter-ms
ms.service: container-apps
ms.topic: conceptual
ms.date: 10/30/2023
ms.author: hannahhunter
ms.custom: ignite-fall-2023
# Customer Intent: As a developer, I'd like to learn how to make my container apps resilient using Azure Container Apps.
---

# Dapr component resiliency (preview)

Resiliency policies proactively prevent, detect, and recover from your container app failures. In this article, you learn how to apply resiliency policies for applications that use Dapr to integrate with different cloud services, like state stores, pub/sub message brokers, secret stores, and more. 

You can configure resiliency policies like retries and timeouts for the following outbound and inbound operation directions via a Dapr component: 

- **Outbound operations:** Calls from the Dapr sidecar to a component, such as:
   - Persisting or retrieving state
   - Publishing a message
   - Invoking an output binding
- **Inbound operations:** Calls from the Dapr sidecar to your container app, such as:
   - Subscriptions when delivering a message
   - Input bindings delivering an event

The following screenshot shows how an application uses a retry policy to attempt to recover from failed requests. 

:::image type="content" source="media/dapr-component-resiliency/dapr-component-resiliency.png" alt-text="Diagram demonstrating resiliency for container apps with Dapr components.":::

## Supported resiliency policies

- [Timeouts](#timeouts)
- [Retries (HTTP)](#retries)

## Creating resiliency policies

You have the option to create resiliency policies using Bicep, the CLI, or the Azure portal.  

> [!IMPORTANT]
> Once you've applied all the resiliency policies, restart your Dapr applications.

# [Bicep](#tab/bicep)

The following resiliency example demonstrates all of the available configurations. 

```bicep
resource myPolicyDoc 'Microsoft.App/managedEnvironments/daprComponents/resiliencyPolicies@2023-08-01-preview' = {
  name: 'my-component-resiliency-policies'
  parent: '${componentName}'
  properties: {
    outboundPolicy: {
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
    inboundPolicy: {
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

To begin, log-in to the Azure CLI:

```azurecli
az login
```

To create a resiliency policy with recommended settings for timeouts and retries, run the following command:

```azurecli
az containerapp resiliency-policy create -g MyResourceGroup -n MyContainerApp –default​
```

To apply the resiliency policies from a YAML file you've created for your container app, run the following command:

```azurecli
az containerapp resiliency-policy create -g MyResourceGroup –n MyContainerApp –yaml MyYAMLPath
```

This command passes the resiliency policy YAML file, which may look similar to the following example:

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
Use the `resiliency-policies show` command to list resiliency policies for a container app.

```azurecli
az containerapp resiliency-policies show -g MyResourceGroup –name MyContainerApp​
```

To update a resiliency policy, run the following command:

```azurecli
todo
```

To delete resiliency policies, run:

```azurecli
az containerapp resiliency-policies remove -g MyResourceGroup –name MyContainerApp​
```

# [Azure portal](#tab/portal)

Need

---

## Policy specifications

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

| Metadata | Required | Description | Example |
| -------- | --------- | ----------- | ------- |
| `responseTimeoutInSeconds` | Yes | Timeout waiting for a response from the upstream container app (or Dapr component). | `15` |

### Retries

Define an `httpRetryPolicy` strategy for failed operations. The retry policy includes the following configurations.


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

| Metadata | Required | Description | Example |
| -------- | --------- | ----------- | ------- |
| `maxRetries` | Yes | Maximum retries to be executed for a failed http-request. | `5` |
| `retryBackOff` | Yes | Monitor the requests and shut off all traffic to the impacted service when timeout and retry criteria are met. | N/A |
| `retryBackOff.initialDelayInMilliseconds` | Yes | Delay between first error and first retry. | `1000` |
| `retryBackOff.maxIntervalInMilliseconds` | Yes | Maximum delay between retries. | `10000` |

## Resiliency observability

### Resiliency creation via system logs

### Resiliency metrics

## Related content

See how resiliency works for:
- [Service to service communication using Azure Container Apps built in service discovery](./service-discovery-resiliency.md)
- [Service to service communication using Dapr service invocation](./dapr-invoke-resiliency.md)
