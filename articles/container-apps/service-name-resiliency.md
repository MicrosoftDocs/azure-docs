---
title: Service name resiliency
titleSuffix: Azure Container Apps
description: Learn how to apply container app to container app resiliency when using the application's service name in Azure Container Apps.
services: container-apps
author: hhunter-ms
ms.service: container-apps
ms.topic: conceptual
ms.date: 10/23/2023
ms.author: hannahhunter
ms.custom: ignite-fall-2023
zone_pivot_group_filename: container-apps/dapr-zone-pivot-groups.json
zone_pivot_groups: resiliency-options
# Customer Intent: As a developer, I'd like to learn how to make my container apps resilient using Azure Container Apps.
---

# Service name resiliency

With Azure Container Apps resiliency, you can proactively prevent, detect, and recover from service-to-service request failures using simple resiliency policies. 

For container app resiliency, policies are configured as a sub-resource to a container app. When a container app request fails, the resiliency behavior is determined by the policies associated with the container app being called (callee). 

For example, in the diagram below, the resiliency policies tailored to the specific requirement of the callee, App B, determine how retries, timeouts, and other resiliency policies are applied to both App A and App B. 

:::image type="content" source="media/service-name-resiliency/service-name-resiliency.png" alt-text="Diagram demonstrating container app to container app resiliency using a container app's service name.":::

You can apply resiliency policies to two styles of service-to-service communication: 
- A request to a container app using its service name, such as:
  - Container app's name
  - Container app's fully qualified domain name (FQDN) 
- [Dapr service invocation](./dapr-invoke-resiliency.md). 

This guide focuses on configuring Azure Container Apps resiliency policies when initiating requests using a container app's service name.

## Supported resiliency policies

- [Timeouts](#timeouts)
- [Retries (HTTP and TCP)](#retries)
- [Circuit breakers](#circuit-breakers)
- [Connection pools (HTTP and TCP)](#connection-pools)

## Creating resiliency policies

Create resiliency policies using Bicep, the CLI, and the Azure portal. 

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
                        header: 'Content-Type'
                        match: { 
                            prefixMatch: 'application'
                        }
                    }
                }
            ]
            httpStatusCodes: [
                502
                503
            ]
            errors: [
                'retriable-headers'
                'retriable-status-codes'
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
az containerapp resiliency create -g MyResourceGroup -n MyResiliencyName --container-app-name MyContainerApp --default
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
      - retriable-headers
      - retriable-status-codes
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

| Metadata | Required? | Description | Example |
| -------- | --------- | ----------- | ------- |
| `responseTimeoutInSeconds` | Y | Timeout waiting for a response from the upstream container app. | `15` |
| `connectionTimeoutInSeconds` | Y | Timeout to establish a connection to the upstream container app. | `5` |

### Retries

Define a `tcpRetryPolicy` or an `httpRetryPolicy` strategy for failed operations. The retry policy includes the following configurations.

#### httpRetryPolicy

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
                'retriable-headers'
                'retriable-status-codes'
            ]
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
| `matches` | Y | Set match values to limit when the app should attempt a retry.  | `headers`, `httpStatusCodes`, `errors` |
| `matches.headers` | Y* | Retry on any status code defined in retriable headers. *Headers are only required properties if you've specified the `retriable-headers` error property. [Learn more about available header matches.](#header-matches) | `X-Content-Type` |
| `matches.httpStatusCodes` | Y* | Retry on any status code defined in additional status codes. *Status codes are only required properties if you've specified the `retriable-status-codes` error property. | `502`, `503` |
| `matches.errors` | Y | Only retries when the app returns a specific error message. [Learn more about available errors.](#errors) | `connect-failure`, `reset` |

##### Header matches

If you've specified `retriable-headers` error, you can use any of the following header match properties to retry.

```bicep
matches: {
  headers: [
    { 
      headerMatch: {
        header: 'X-Content-Type'
        match: {
          prefixMatch: 'application'
        }
      }
    }
  ]
}
```

| Metadata | Description | Example |
| -------- | ----------- | ------- |
| `prefixMatch` | Retry on matches to the specified prefix. | `application` |
| `exactMatch` | Retry on exact matches to the header type. | `application/json` |
| `suffixMatch` | Retry on matches to the specified suffix. | `json` |
| `regexMatch` | Retry on matches to the regex pattern. | `application/json` |

##### Errors

You can specify any of the following errors as retriable matches.

```bicep
matches: {
  errors: [
    'retriable-headers'
    'retriable-status-codes'
    '5xx'
    'reset'
    'connect-failure'
    'retriabe-4xx'
  ]
}
```

| Metadata | Description |
| -------- | ----------- |
| `retriable-headers` | Required if you'd like to retry any matching headers. |
| `retriable-status-codes` | Required if you'd like to retry any matching status codes. |
| `5xx` | Retry if upstream server responds with any 5xx response codes. |
| `reset` | Retry if the upstream server doesn't respond. |
| `connect-failure` | Retry if request has failed due to a connection failure with the upstream server. |
| `retriable-4xx` | Retry if upstream server responds with a retriable 4xx respons code, like `409`. |

#### tcpRetryPolicy

```bicep
properties: {
    tcpRetryPolicy: {
        maxConnectAttempts: 3
    }
}
```

| Metadata | Required? | Description | Example |
| -------- | --------- | ----------- | ------- |
| `maxConnectAttempts` | Y | Set the maximum connection attempts (`maxConnectionAttempts`) to retry on failed connections. You can use HTTP and TCP retry policies in the same resiliency policy. | `3` |


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

### Connection pools

#### httpConnectionPool

```bicep
properties: {
    httpConnectionPool: {
        http1MaxPendingRequests: 1024
        http2MaxRequests: 1024
    }
}
```

| Metadata | Required? | Description | Example |
| -------- | --------- | ----------- | ------- |
| `http1MaxPendingRequests` | Y | Used for http1 requests. Maximum number of open connections to an upstream container app. | `1024` |
| `http2MaxRequests` | Y | Used for http2 requests. Maximum number of concurrent requests to an upstream container app. | `1024` |

#### tcpConnectionPool

```bicep
properties: {
    tcpConnectionPool: {
        maxConnections: 100
    }
}
```

| Metadata | Required? | Description | Example |
| -------- | --------- | ----------- | ------- |
| `maxConnections` | Y | Maximum number of concurrent connections to an upstream container app. | `100` |

## Resiliency observability

### Resiliency creation via system logs

### Resiliency metrics

## Related content

See how resiliency works for:
- [Container apps using Dapr Service Invocation API](./dapr-invoke-resiliency.md)
- [Dapr components in Azure Container Apps](./dapr-component-resiliency.md)
