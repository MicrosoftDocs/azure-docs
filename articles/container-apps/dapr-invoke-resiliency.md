---
title: Dapr service invocation API resiliency (preview)
titleSuffix: Azure Container Apps
description: Learn how to apply container app to container app resiliency when using Dapr service invocation API in Azure Container Apps.
services: container-apps
author: hhunter-ms
ms.service: container-apps
ms.topic: conceptual
ms.date: 10/30/2023
ms.author: hannahhunter
ms.custom: ignite-fall-2023
# Customer Intent: As a developer, I'd like to learn how to make my container apps resilient using Azure Container Apps.
---

# Dapr service invocation API resiliency (preview)

Using simple resiliency policies, you can proactively prevent, detect, and recover from service-to-service request failures. In this article, you learn how to configure Dapr's resiliency policies when using Dapr’s Service Invocation API for container app-to-container app communication. 

Policies are in effect for each request to a container app. You can tailor policies to the container app accepting requests with configurations like:

- The number of retries
- Retry and timeout duration
- Circuit breaker consecutive errors, and others 

The following screenshot shows how an application uses a retry policy to attempt to recover from failed requests. 

:::image type="content" source="media/dapr-invoke-resiliency/dapr-invoke-resiliency.png" alt-text="Diagram demonstrating sidecar to sidecar resiliency for container apps using Dapr service invocation API.":::

> [!NOTE]
> To configure resiliency policies for service-to-service communication using the Azure Container Apps built-in service discovery, refer to [Service discovery resiliency](./service-discovery-resiliency.md). 

## Supported resiliency policies

- [Timeouts](#timeouts)
- [Retries (HTTP)](#retries)
- [Circuit breakers](#circuit-breakers)

## Creating resiliency policies

You have the option to create resiliency policies using Bicep, the CLI, or the Azure portal.  

> [!IMPORTANT]
> Once you've applied all the resiliency policies, restart your Dapr applications.

# [Bicep](#tab/bicep)

The following resiliency example demonstrates all of the available configurations. 

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
  timeoutPolicy: {
      responseTimeoutInSeconds: 15
      connectionTimeoutInSeconds: 5
  }
}
```

| Metadata | Required | Description | Example |
| -------- | --------- | ----------- | ------- |
| `responseTimeoutInSeconds` | Yes | Timeout waiting for a response from the upstream container app. | `15` |
| `connectionTimeoutInSeconds` | Yes | Timeout to establish a connection to the upstream container app. | `5` |

### Retries

Define an `httpRetryPolicy` strategy for failed operations. The retry policy includes the following configurations.

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

| Metadata | Required | Description | Example |
| -------- | --------- | ----------- | ------- |
| `maxRetries` | Yes | Maximum retries to be executed for a failed http-request. | `5` |
| `retryBackOff` | Yes | Monitor the requests and shut off all traffic to the impacted service when timeout and retry criteria are met. | N/A |
| `retryBackOff.initialDelayInMilliseconds` | Yes | Delay between first error and first retry. | `1000` |
| `retryBackOff.maxIntervalInMilliseconds` | Yes | Maximum delay between retries. | `10000` |

### Circuit breakers

Circuit breaker policies determine whether some number of upstream container app hosts (replicas) are unhealthy and removing them from load balancing. 

```bicep
properties: {
    circuitBreakerPolicy: {
        consecutiveErrors: 5
        intervalInSeconds: 10
        maxEjectionPercent: 50
    }
}
```

| Metadata | Required | Description | Example |
| -------- | --------- | ----------- | ------- |
| `consecutiveErrors` | Yes | Consecutive number of errors before an upstream container app replica is temporarily removed from load balancing. | `5` |
| `intervalInSeconds` | Yes | Interval between evaluation to eject or restore an upstream container app replica. | `10` |
| `maxEjectionPercent` | Yes | Maximum percent of failing container app replicas to eject from load balancing. | `50` |

## Resiliency observability

### Resiliency creation via system logs

### Resiliency metrics

## Related content

See how resiliency works for:
- [Service to service communication using Azure Container Apps built in service discovery](./service-discovery-resiliency.md)
- [Dapr components in Azure Container Apps](./dapr-component-resiliency.md)