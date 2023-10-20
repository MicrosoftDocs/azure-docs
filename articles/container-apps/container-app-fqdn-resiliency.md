---
title: Container app FQDN resiliency
titleSuffix: Azure Container Apps
description: Learn how to apply container app to container app resiliency when using the application's FQDN in Azure Container Apps.
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

# Container app FQDN resiliency

In Azure Container Apps, you can apply resiliency policies to two styles of service-to-service communication: your container app's fully qualified domain name (FQDN) or [Dapr service invocation](./dapr-invoke-resiliency.md). This guide focuses on configuring Azure Container Apps resiliency policies when initiating requests from one container app to another using the application’s FQDN.

:::image type="content" source="media/container-app-fqdn-resiliency/container-fqdn-resiliency.png" alt-text="Diagram demonstrating container app to container app resiliency for container apps using an application's fully qualified domain name.":::

## How Azure Container Apps resiliency works

With Azure Container Apps resiliency, you can proactively prevent, detect, and recover from service-to-service request failures using simple resiliency policies. 

Resiliency policies are configured as a sub-resource to a container app. When a container app request request fails, the resiliency behavior is determined by the policies associated with the container app being called (callee). Thus retries, timeouts, and other resiliency policies are appropriately enforced and tailored to the specific requirement of the requested application. 

### Supported resiliency policies

- Timeouts
- Retries (HTTP and TCP)
- Circuit breakers
- Connection pools (HTTP and TCP)

## Creating resiliency policies

Create and apply resiliency policies using Bicep, the CLI, and the Azure portal.

# [Bicep](#tab/bicep)

You can create your resiliency policy in Bicep. The following resiliency example demonstrates all of the available configurations. 

```bicep
resource myPolicyDoc 'Microsoft.App/containerApps/appResiliencyPolicy@version' = {
  name: 'myResiliencyPolicy'
  parent: '${appName}'
  properties: {
    timeoutPolicy: {
        responseTimeoutInSeconds: 15
        connectionTimeoutInSeconds: 5
    }
    rateLimitPolicy: {}
    httpRetryPolicy: {
        maxRetries: 5
        retryBackOff: {
          initialDelayInMilliseconds: 1000
          maxIntervalInMilliseconds: 10000
        }
        matches: {
            headers: [
                {
                    headerMatch: {
                        header: 'X-Content-Type'
                        match: { 
                            prefixMatch: 'GOATS'
                        }
                    }
                }
            ]
            httpStatusCodes: [
                502
                503
            ]
            errors: [
                5xx
                connect-failure
                reset          
            ]
        }
    } 
    tcpRetryPolicy: {
        maxConnectAttempts: 3
    }
    circuitBreakerPolicy: {
        consecutiveErrors: 5
        intervalInSeconds: 10
        maxEjectionPercent: 50
    }
    tcpConnectionPool: {
        maxConnections: 100
    }
    httpConnectionPool: {
        http1MaxPendingRequests: 1024
        http2MaxRequests: 1024
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
circuitBreakerPolicy:
  consecutiveErrors: 5
  intervalInSeconds: 10
tcpConnectionPool:
  maxConnections: 100
httpConnectionPool:
  http1MaxPendingRequests: 1024
  http2MaxRequests: 1024
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

| Metadata | Description | Example |
| -------- | ----------- | ------- |
| `responseTimeoutInSeconds` | Timeout waiting for a response from the upstream container app. | `15` |
| `connectionTimeoutInSeconds` | Timeout to establish a connection to the upstream container app. | `5` |

### Retries

Define a `tcpRetryPolicy` or an `httpRetryPolicy` strategy for failed operations. The retry policy includes the following configurations.

#### `httpRetryPolicy`

```bicep
properties: {
    httpRetryPolicy: {
        maxRetries: 5
        retryBackOff: {
          initialDelayInMilliseconds: 1000
          maxIntervalInMilliseconds: 10000
        }
        matches: {
            headers: [
                {
                    headerMatch: {
                        header: 'X-Content-Type'
                        match: { 
                            prefixMatch: 'GOATS'
                        }
                    }
                }
            ]
            httpStatusCodes: [
                502
                503
            ]
            errors: [
                5xx
                connect-failure
                reset          
            ]
        }
    } 
}
```

| Metadata | Description | Example |
| -------- | ----------- | ------- |
| `maxRetries` | Maximum retries to be executed for a failed http-request. | `5` |
| `retryBackOff` | Monitor the requests and shut off all traffic to the impacted service when timeout and retry criteria are met. | N/A |
| `retryBackOff.initialDelayInMilliseconds` | Delay between first error and first retry. | `1000` |
| `retryBackOff.maxIntervalInMilliseconds` | Maximum delay between retries. | `10000` |
| `matches` | Set match values to limit when the app should attempt a retry. | N/A |
| `matches.headers` | Retry on any status code defined in retriable headers. | `X-Content-Type` |
| `matches.httpStatusCodes` | Retry on any status code defined in additional status codes, | `502`, `503` |
| `matches.errors` | Only retries when the app returns a specific error message. | `connect-failure`, `reset` |

#### `tcpRetryPolicy`

```bicep
properties: {
    tcpRetryPolicy: {
        maxConnectAttempts: 3
    }
}
```

| Metadata | Description | Example |
| -------- | ----------- | ------- |
| `maxConnectAttempts` | Set the maximum connection attempts (`maxConnectionAttempts`) to retry on failed connections. You can use HTTP and TCP retry policies in the same resiliency policy. | `3` |


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

| Metadata | Description | Example |
| -------- | ----------- | ------- |
| `consecutiveErrors` | Consecutive number of errors before an upstream container app is temporarily removed from load balancing. | `5` |
| `intervalInSeconds` | Interval between evaluation to eject or restore an upstream container app. | `10` |
| `maxEjectionPercent` | Maximum percent of failing replicas to eject from load balancing. | `50` |

### Connection pools

#### `httpConnectionPool`

```bicep
properties: {
    httpConnectionPool: {
        http1MaxPendingRequests: 1024
        http2MaxRequests: 1024
    }
}
```

| Metadata | Description | Example |
| -------- | ----------- | ------- |
| `http1MaxPendingRequests` | Used for http1 requests. Maximum number of open connections to an upstream container app. | `1024` |
| `http2MaxRequests` | Used for http2 requests. Maximum number of concurrent requests to an upstream container app. | `1024` |

#### `tcpConnectionPool`

```bicep
properties: {
    tcpConnectionPool: {
        maxConnections: 100
    }
}
```

| Metadata | Description | Example |
| -------- | ----------- | ------- |
| `maxConnections` | Maximum number of concurrent connections to an upstream container app. | `100` |

## Resiliency observability

### Resiliency creation via system logs

### Resiliency metrics

## Related content

See how resiliency works for:
- [Container apps using Dapr Service Invocation API](./dapr-invoke-resiliency.md)
- [Dapr components in Azure Container Apps](./dapr-resiliency.md)
