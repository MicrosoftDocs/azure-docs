---
title: Resiliency in Azure Container Apps
titleSuffix: Azure Container Apps
description: Learn how to make your container apps resilient in Azure Container Apps.
services: container-apps
author: hhunter-ms
ms.service: container-apps
ms.topic: conceptual
ms.date: 08/31/2023
ms.author: hannahhunter
ms.custom: ignite-fall-2023
# Customer Intent: As a developer, I'd like to learn how to make my container apps resilient using Azure Container Apps.
---

# Resiliency in Azure Container Apps

Detect, mitigate, and respond to failure in your container app using resiliency policies. Resiliency policies allow you to add retries, timeouts, circuit breakers, and outlier detection on service-to-service calls within a Container Apps Environment. Since policies are configured and enforced transparently by [Envoy proxies](https://www.envoyproxy.io/), you don't need to implement service-to-service resiliency in code.

## How do resiliency policies work?

Rather than placed directly on a container app spec, policies are created and deployed as separate resources to allow flexibility for the policy target. The resiliency polices applied to the upstream application (the application being called) define:
- The resiliency API, behaviors, and scale limits
- Which APIs are retriable
- How long an operation should take
- When to cut connections to prevent overloading. 

All downstream applications (the applications making calls) should use the policies defined by the upstream application they are calling.

The policies are the children of a container app. Each container app should only have one policy. 

> [!NOTE]
> You can apply resiliency policies to any container app. For Dapr-enabled container apps, use a separate resource and schema for Dapr components, which support a different set of resiliency policies.

## Policies spec

The resiliency policies for Azure Container Apps include:

| Policy | Description |
| ------ | ----------- |
| `timeoutPolicy` | Optional. Used to early-terminate long-running operations. |
| `circuitBreakerPolicy` | Monitor the requests and shut off all traffic to the impacted service when timeout and retry criteria are met. |
| `rateLimitPolicy` |  |
| `httpRetryPolicy` |  |
| `tcpRetryPolicy` |  |

The following code puts the resiliency policies into context.

```json
resource myPolicyDoc 'Microsoft.App/containerApps/appResiliencyPolicy@version' = {
  name: '${appName}/myResiliencyPolicy'
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

## REST API spec


The REST API supports the following endpoints:

```
PUT {{baseUrl}}/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.App/containerApps/{appName}/appResiliency/{name}?api-version=2023-08-01-preview
```

```
GET {{baseUrl}}/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.App/containerApps/{appName}/appResiliency/{name}?api-version=2023-08-01-preview
```

```
DELETE {{baseUrl}}/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.App/containerApps/{appName}/appResiliency/{name}?api-version=2023-08-01-preview
```

Refer to the policy spec for the body for the PUT/response for the GET/requests.

## Related content