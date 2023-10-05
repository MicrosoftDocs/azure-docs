---
title: Container app to container app resiliency
titleSuffix: Azure Container Apps
description: Learn how to apply container app to container app resiliency in Azure Container Apps.
services: container-apps
author: hhunter-ms
ms.service: container-apps
ms.topic: conceptual
ms.date: 08/31/2023
ms.author: hannahhunter
ms.custom: ignite-fall-2023
# Customer Intent: As a developer, I'd like to learn how to make my container apps resilient using Azure Container Apps.
---

## Container app to container app resiliency

Whether your container apps communicate with each other directly, or use `dapr invoke` for service-to-service communication, resiliency policies are configured and applied the same. The following Bicep shows a full resiliency policy example. 

```bicep
resource myPolicyDoc 'Microsoft.App/containerApps/appResiliencyPolicy@2023-08-01-preview' = {
  name: 'myResiliencyPolicy'
  parent: '${appName}'
  properties: {
    target: 'aca-app-name'
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

| Metadata | Description |
| ------ | ----------- |
| `name` | The name of your resiliency policy. This name will be tied to container apps and Dapr components. |
| `parent` | The resiliency policy scope, either your container app or Dapr component. | 
| `target` | The target application of the resiliency configuration (the application being called). |

### Timeouts

Timeouts are used to early-terminate long-running operations. The timeout policy includes the following metadata.

```bicep
properties: {
  target: 'aca-app-name'
  timeoutPolicy: {
      responseTimeoutInSeconds: 15
      connectionTimeoutInSeconds: 5
  }
}
```

| Metadata | Description |
| ------ | ----------- |
| `responseTimeoutInSeconds` |  |
| `connectionTimeoutInSecionds` |  |

### Retries

Define a `tcpRetryPolicy` or an `httpRetryPolicy` strategy for failed operations, including failures due to a failed timeout or circuit breaker policy. The retry policy includes the following configurations.

#### `httpRetryPolicy`

```bicep
properties: {
  target: 'aca-app-name'
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

| Metadata | Description |
| ------ | ----------- |
| `maxRetries` |  |
| `retryBackOff` | Monitor the requests and shut off all traffic to the impacted service when timeout and retry criteria are met. |
| `retryBackOff.initialDelayInMilliseconds` |  |
| `retryBackOff.maxIntervalInMilliseconds` |  |
| `matches` | Set match values to limit when the app should attempt a retry. |
| `matches.headers` | Only retries when the app returns a certain header. |
| `matches.httpStatusCodes` | Only retries when the app returns a specific status code. |
| `matches.errors` | Only retries when the app returns a specific error code. |

#### `tcpRetryPolicy`

```bicep
properties: {
  target: 'aca-app-name'
    tcpRetryPolicy: {
        maxConnectAttempts: 3
    }
}
```

| Metadata | Description |
| ------ | ----------- |
| `maxConnectAttempts` | Set the maximum connection attempts (`maxConnectionAttempts`) to retry on failed connections. You can use HTTP and TCP retry policies in the same resiliency resource. |


### Circuit breakers

Circuit breaker policies monitor the requests and shut off all traffic to the impacted service when timeout and retry criteria are met. 

```bicep
properties: {
  target: 'aca-app-name'
    circuitBreakerPolicy: {
        consecutiveErrors: 5
        intervalInSeconds: 10
    }
}
```

| Metadata | Description |
| ------ | ----------- |
| `consecutiveErrors` |  |
| `intervalInSeconds` |  |

### Connection pools

#### `httpConnectionPool`

```bicep
properties: {
  target: 'aca-app-name'
    httpConnectionPool: {
        http1MaxPendingRequests: 1024
        http2MaxRequests: 1024
    }
}
```

| Metadata | Description |
| ------ | ----------- |
| `http1MaxPendingRequests` |  |
| `http2MaxRequests` |  |

#### `tcpConnectionPool`

```bicep
properties: {
  target: 'aca-app-name'
    tcpConnectionPool: {
        maxConnections: 100
    }
}
```

| Metadata | Description |
| ------ | ----------- |
| `maxConnections` |  |

## Defining resiliency policies

Create and apply resiliency policies using Bicep, the CLI, and the Azure portal.

# [Bicep](#tab/bicep)

You can create your resiliency resource in Bicep. The following resiliency example demonstrates all of the available configurations. 

```bicep
resource myPolicyDoc 'Microsoft.App/containerApps/appResiliencyPolicy@version' = {
  name: 'myResiliencyPolicy'
  parent: '${appName}'
  properties: {
    target: 'aca-app-name'
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

## Related content

[See how resiliency works for Dapr components in Azure Container Apps](./dapr-resiliency.md)