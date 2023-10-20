---
title: Container app to container app policies
titleSuffix: Azure Container Apps
description: Learn how to apply container app to container app resiliency in Azure Container Apps.
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

# Container app to container app policies

Azure Container Apps resiliency provides developers with the capability to proactively prevent, detect, and recover from service-to-service request failures using simple resiliency policies. 

Resiliency policies are configured as a sub-resource to a container app. When a container app is requested and that request fails, the resiliency behavior is determined by the policies associated to the container app being called (callee). This ensures that retries, timeouts, and other resiliency policies are enforced as appropriate and are tailored to the specific requirement of the requested application.  

In Azure Container Apps, you can apply resiliency policies to two styles of service-to-service communication: 

- **Container App FQDN:** When initiating requests from one container app to another using the application’s Fully Qualified Domain Name (FQDN), Azure Container Apps resiliency policies can be configured and applied. 
- **Dapr Service Invocation API:** When leveraging Dapr’s Service Invocation API for container app-to-container app communication, Dapr’s resiliency policies can be configured and applied. 

::: zone pivot="non-dapr"

:::image type="content" source="media/container-app-resiliency/container-to-container-resiliency.png" alt-text="Diagram demonstrating container app to container app resiliency for container apps without Dapr enabled.":::

The supported resiliency policies include:

- Timeouts
- Retries (HTTP and TCP)
- Circuit breakers
- Connection pools (HTTP and TCP)

::: zone-end

::: zone pivot="dapr"

:::image type="content" source="media/container-app-resiliency/sidecar-to-sidecar-resiliency.png" alt-text="Diagram demonstrating sidecar to sidecar resiliency for container apps with Dapr enabled.":::

The supported resiliency policies include:

- Timeouts
- Retries (HTTP)
- Circuit breakers

::: zone-end

## Resiliency policy structure

::: zone pivot="non-dapr"

Create and apply resiliency policies using Bicep, the CLI, and the Azure portal.

# [Bicep](#tab/bicep)

You can create your resiliency resource in Bicep. The following resiliency example demonstrates all of the available configurations. 

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

::: zone-end

::: zone pivot="dapr"

Create and apply resiliency policies using Bicep, the CLI, and the Azure portal.

# [Bicep](#tab/bicep)

You can create your resiliency resource in Bicep. The following resiliency example demonstrates all of the available configurations. 

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

::: zone-end

## Policy definitions

::: zone pivot="non-dapr"

The following examples demonstrate how resiliency policies are defined to provide resilient communication between your container apps.

### Timeouts

Timeouts are used to early-terminate long-running operations. The timeout policy includes the following metadata.

```bicep
properties: {
  timeoutPolicy: {
      responseTimeoutInSeconds: 15
      connectionTimeoutInSeconds: 5
  }
}
```

| Metadata | Required | Description | Example |
| -------- | -------- | ----------- | ------- |
| `responseTimeoutInSeconds` |  | Timeout waiting for a response from the upstream container app. | `15` |
| `connectionTimeoutInSeconds` |  | Timeout to establish a connection to the upstream container app. | `5` |

### Retries

Define a `tcpRetryPolicy` or an `httpRetryPolicy` strategy for failed operations, including failures due to a failed timeout or circuit breaker policy. The retry policy includes the following configurations.

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
| `maxConnectAttempts` | Set the maximum connection attempts (`maxConnectionAttempts`) to retry on failed connections. You can use HTTP and TCP retry policies in the same resiliency resource. | `3` |


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

::: zone-end

::: zone pivot="dapr"

The following examples demonstrate how resiliency policies are defined to provide resilient communication between your Dapr sidecars.

### Timeouts

Timeouts are used to early-terminate long-running operations. The timeout policy includes the following metadata.

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

Define a `tcpRetryPolicy` or an `httpRetryPolicy` strategy for failed operations, including failures due to a failed timeout or circuit breaker policy. The retry policy includes the following configurations.

#### `httpRetryPolicy`

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

| Metadata | Description | Example |
| -------- | ----------- | ------- |
| `maxRetries` | Maximum retries to be executed for a failed http-request. | `5` |
| `retryBackOff` | Monitor the requests and shut off all traffic to the impacted service when timeout and retry criteria are met. | N/A |
| `retryBackOff.initialDelayInMilliseconds` | Delay between first error and first retry. | `1000` |
| `retryBackOff.maxIntervalInMilliseconds` | Maximum delay between retries. | `10000` |

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

::: zone-end

## Resiliency observability

### Resiliency creation via system logs

### Resiliency metrics

## Related content

[See how resiliency works for Dapr components in Azure Container Apps](./dapr-resiliency.md)