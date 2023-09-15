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

Detect, mitigate, and respond to failure in your container app using resiliency policy configurations powered by [Dapr](https://docs.dapr.io/operations/resiliency/). Resiliency policies allow you to add retries, timeouts, circuit breakers, and connection pools on service-to-service calls within a Container Apps Environment. 

## How do resiliency policies work?

Rather than placed directly on a container app spec, policies are created and deployed as separate resources to allow flexibility for the policy target. The resiliency policies applied to the upstream application (the application being called) define:
- The resiliency API, behaviors, and scale limits
- Which APIs are retry-able
- How long an operation should take
- When to cut connections to prevent overloading. 

All applications making calls use the policies defined by the application they're calling. For example, in the following diagram, App A uses the policies defined by App B.

:::image type="content" source="media/microservices-dapr/azure-container-apps-microservices-dapr.png" alt-text="Architecture diagram for Dapr Hello World microservices on Azure Container Apps":::

> [!NOTE]
> All policy configurations are children of either a Dapr component or a container app. You can apply resiliency policies to any container app and Dapr component. Container apps and Dapr components can have one resiliency resource associated to each. 

## Policy configuration spec

Whether or not you're using a Dapr with your container app, the resiliency configuration remains the same across Azure Container Apps. Resiliency policies include the following values:

| Policy | Description |
| ------ | ----------- |
| `name` | The name of your resiliency policy. This name will be tied to container apps and Dapr components. |
| `parent` | The name of your container app or Dapr component. | 
| `timeoutPolicy` | Optional. Used to early-terminate long-running operations. |
| `rateLimitPolicy` |  |
| `httpRetryPolicy` | Set retry limitations, like only retrying if specific errors (`errors`), status codes (`httpStatusCodes`), or headers (`headers`) are returned. You can use HTTP and TCP retry policies in the same resiliency resource. |
| `tcpRetryPolicy` | Set the maximum connection attempts (`maxConnectionAttempts`) to retry on failed connections. You can use HTTP and TCP retry policies in the same resiliency resource. |
| `circuitBreakerPolicy` | Monitor the requests and shut off all traffic to the impacted service when timeout and retry criteria are met. |
| `httpConnectionPool` |  |
| `tcpConnectionPool` |  |

You can create resiliency policies for your container app via the CLI, Bicep, and the Azure portal. 

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

# [Azure portal](#tab/portal)

Need

---

## REST API endpoints

You can pass the following endpoints supported by the REST API.

```sh
PUT {{baseUrl}}/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.App/containerApps/{appName}/appResiliency/{name}?api-version=2023-08-01-preview
```

```sh
GET {{baseUrl}}/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.App/containerApps/{appName}/appResiliency/{name}?api-version=2023-08-01-preview
```

```sh
DELETE {{baseUrl}}/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.App/containerApps/{appName}/appResiliency/{name}?api-version=2023-08-01-preview
```


## Related content

[See how resiliency works in Azure Container Apps](todo)