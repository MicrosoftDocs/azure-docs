---
title: Resiliency policies for Dapr service invocation API
titleSuffix: Azure Container Apps
description: Learn how to apply container app to container app resiliency when using Dapr service invocation API in Azure Container Apps.
services: container-apps
author: hhunter-ms
ms.service: container-apps
ms.topic: conceptual
ms.date: 10/17/2023
ms.author: hannahhunter
ms.custom: ignite-fall-2023
zone_pivot_group_filename: container-apps/dapr-zone-pivot-groups.json
zone_pivot_groups: resiliency-options
# Customer Intent: As a developer, I'd like to learn how to make my container apps resilient using Azure Container Apps.
---

# Resiliency policies for Dapr service invocation API

With Azure Container Apps resiliency, you can proactively prevent, detect, and recover from service-to-service request failures using simple resiliency policies. 

For container app resiliency, policies are configured as a subresource to a container app. Resiliency policies tailored to the specific requirement of the container app being called (App B in the diagram) determine how retries timeouts and other resiliency policies are applied.  

You can apply resiliency policies to two styles of service-to-service communication: your [container app's service name](./service-discovery-resiliency.md) or Dapr service invocation. 

This guide focuses on configuring Dapr's resiliency policies when using Dapr’s Service Invocation API for container app-to-container app communication. 

:::image type="content" source="media/dapr-invoke-resiliency/dapr-invoke-resiliency.png" alt-text="Diagram demonstrating sidecar to sidecar resiliency for container apps using Dapr service invocation API.":::

## Supported resiliency policies

- [Timeouts](#timeouts)
- [Retries (HTTP)](#retries)
- [Circuit breakers](#circuit-breakers)

## Creating resiliency policies

Create resiliency policies using Bicep, the CLI, and the Azure portal. 

> [!IMPORTANT]
> Once you've applied all the resiliency policies that use Dapr, restart your Dapr applications.

# [Bicep](#tab/bicep)

You can create your resiliency policy in Bicep. The following resiliency example demonstrates all of the available configurations. 

```bicep
resource myPolicyDoc 'Microsoft.App/containerApps/resiliencyPolicies@2023-08-01-preview' = {
  name: 'my-app-resiliency-policies'
  parent: '${appName}'
  properties: {
    timeoutPolicy: {
        responseTimeoutInSeconds: 15
        connectionTimeoutInSeconds: 5
    }
    httpRetryPolicy: {
        maxRetries: 5
        retryBackOff: {
          initialDelayInMilliseconds: 1000
          maxIntervalInMilliseconds: 10000
        }
    } 
    circuitBreakerPolicy: {
        consecutiveErrors: 5
        intervalInSeconds: 10
        maxEjectionPercent: 50
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

This command passes a YAML file similar to the following example:

```yaml
timeoutPolicy:
  responseTimeoutInSeconds: 30
  connectionTimeoutInSeconds: 5
httpRetryPolicy:
  maxRetries: 5
  retryBackOff:
    initialDelayInMilliseconds: 1000
    maxIntervalInMilliseconds: 10000
circuitBreakerPolicy:
  consecutiveErrors: 5
  intervalInSeconds: 10
```

To show existing resiliency policies for a container app in your resource group, run:

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

## Policy descriptions

### Timeouts

Timeouts are used to early-terminate long-running operations. The timeout policy includes the following properties.

```bicep
properties: {
  timeoutPolicy: {
      responseTimeoutInSeconds: 15
      connectionTimeoutInSeconds: 5
  }
}
```

| Metadata | Required? | Description | Example |
| -------- | --------- | ----------- | ------- |
| `responseTimeoutInSeconds` | Y | Timeout waiting for a response from the upstream container app. | `15` |
| `connectionTimeoutInSeconds` | Y | Timeout to establish a connection to the upstream container app. | `5` |

### Retries

Define an `httpRetryPolicy` strategy for failed operations, including failures due to a failed timeout or circuit breaker policy. The retry policy includes the following configurations.

```bicep
properties: {
    httpRetryPolicy: {
        maxRetries: 5
        retryBackOff: {
          initialDelayInMilliseconds: 1000
          maxIntervalInMilliseconds: 10000
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

### Circuit breakers

Circuit breaker policies monitor the requests and shut off all traffic to the impacted service when timeout and retry criteria are met. 

```bicep
properties: {
    circuitBreakerPolicy: {
        consecutiveErrors: 5
        intervalInSeconds: 10
        maxEjectionPercent: 50
    }
}
```

| Metadata | Required? | Description | Example |
| -------- | --------- | ----------- | ------- |
| `consecutiveErrors` | Y | Consecutive number of errors before an upstream container app is temporarily removed from load balancing. | `5` |
| `intervalInSeconds` | Y | Interval between evaluation to eject or restore an upstream container app. | `10` |
| `maxEjectionPercent` | Y | Maximum percent of failing replicas to eject from load balancing. | `50` |

## Resiliency observability

### Resiliency creation via system logs

### Resiliency metrics

## Related content

See how resiliency works for:
- [Container apps using the application's service name](./service-discovery-resiliency.md)
- [Dapr components in Azure Container Apps](./dapr-component-resiliency.md)