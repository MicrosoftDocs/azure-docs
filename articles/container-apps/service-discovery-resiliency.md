---
title: Service discovery resiliency (preview)
titleSuffix: Azure Container Apps
description: Learn how to apply container app to container app resiliency when using the application's service name in Azure Container Apps.
services: container-apps
author: hhunter-ms
ms.service: container-apps
ms.topic: conceptual
ms.date: 11/03/2023
ms.author: hannahhunter
ms.custom: ignite-fall-2023
# Customer Intent: As a developer, I'd like to learn how to make my container apps resilient using Azure Container Apps.
---

# Service discovery resiliency (preview)

With Azure Container Apps resiliency, you can proactively prevent, detect, and recover from service request failures using simple resiliency policies. In this article, you learn how to configure Azure Container Apps resiliency policies when initiating requests using Azure Container Apps service discovery.

> [!NOTE]
> Currently, resiliency policies can't be applied to requests made using the Dapr Service Invocation API. 

Policies are in effect for each request to a container app. You can tailor policies to the container app accepting requests with configurations like:
- The number of retries
- Retry and timeout duration
- Retry matches
- Circuit breaker consecutive errors, and others

The following screenshot shows how an application uses a retry policy to attempt to recover from failed requests. 

:::image type="content" source="media/service-discovery-resiliency/service-discovery-resiliency.png" alt-text="Diagram demonstrating container app to container app resiliency using a container app's service name.":::

## Supported resiliency policies

- [Timeouts](#timeouts)
- [Retries (HTTP and TCP)](#retries)
- [Circuit breakers](#circuit-breakers)
- [Connection pools (HTTP and TCP)](#connection-pools)

## Configure resiliency policies

Whether you configure resiliency policies using Bicep, the CLI, or the Azure portal, you can only apply one policy per container app. 

When you apply a policy to a container app, the rules are applied to all requests made to that container app, _not_ to requests made from that container app. For example, a retry policy is applied to a container app named `App B`. All inbound requests made to App B automatically retry on failure. However, outbound requests sent by App B are not guaranteed to retry in failure. 

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
        matches: {
            headers: [
                {
                    header: 'x-ms-retriable'
                    match: { 
                        exactMatch: 'true'
                    }
                }
            ]
            httpStatusCodes: [
                502
                503
            ]
            errors: [
                'retriable-status-codes'
                '5xx'
                'reset'
                'connect-failure'
                'retriable-4xx'
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

To begin, log-in to the Azure CLI:

```azurecli
az login
```

### Create policies with recommended settings

To create a resiliency policy with recommended settings for timeouts and retries, run the `resiliency create` command:

```azurecli
az containerapp resiliency create -g MyResourceGroup -n MyResiliencyName --container-app-name MyContainerApp --default
```

### Create policies with resiliency YAML

To apply the resiliency policies from a YAML file you created for your container app, run the following command:

```azurecli
az containerapp resiliency create -g MyResourceGroup –n MyResiliencyName --container-app-name MyContainerApp –yaml MyYAMLPath
```

This command passes the resiliency policy YAML file, which might look similar to the following example:

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
  maxEjectionPercent: 50
tcpConnectionPool:
  maxConnections: 100
httpConnectionPool:
  http1MaxPendingRequests: 1024
  http2MaxRequests: 1024
```

### Update specific policies

Update your resiliency policies by targeting an individual policy. For example, to update the `timeout-response-in-seconds` policy, run the following command.

```azurecli
az containerapp resiliency update --name MyResiliency -g MyResourceGroup --container-app-name MyContainerApp --timeout-response-in-seconds 20
```

### Update policies with resiliency YAML

You can also update existing resiliency policies by updating the resiliency YAML you created earlier.

```azurecli
az containerapp resiliency update --name MyResiliency -g MyResourceGroup --container-app-name MyContainerApp --yaml MyYAMLPath
```

### View policies

Use the `resiliency list` command to list all the resiliency policies attached to a container app.

```azurecli
az containerapp resiliency list --group MyResourceGroup -–name MyContainerApp​
```

Use `resiliency show` command to show a single policy by name.

```azurecli
az containerapp resiliency show --name MyResiliency --group MyResourceGroup --container-app-name MyContainerApp
```

### Delete policies

To delete resiliency policies, run the following command. 

```azurecli
az containerapp resiliency delete --group MyResourceGroup –-name MyResiliencyName --container-app-name ​MyContainerApp
```

# [Azure portal](#tab/portal)

Navigate into your container app in the Azure portal. In the left side menu under **Settings**, select **Resiliency (preview)** to open the resiliency pane.

:::image type="content" source="media/service-discovery-resiliency/resiliency-pane.png" alt-text="Screenshot demonstrating how to access the service discovery resiliency pane.":::

To add a resiliency policy, select the corresponding checkbox and enter parameters. For example, you can set a timeout policy by selecting **Timeouts** and entering the duration in seconds for either a connection timeout, a response timeout, or both.

:::image type="content" source="media/service-discovery-resiliency/service-discovery-resiliency-example.png" alt-text="Screenshot of setting the service discovery resiliency policies.":::

Select **Apply** once you've added all the policies you'd like to apply to your container app. Select **Continue** to confirm.

:::image type="content" source="media/service-discovery-resiliency/confirm-apply.png" alt-text="Screenshot of pop-up window confirming applying the new resiliency policies.":::


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
| `responseTimeoutInSeconds` | Yes | Timeout waiting for a response from the container app. | `15` |
| `connectionTimeoutInSeconds` | Yes | Timeout to establish a connection to the container app. | `5` |

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
                    header: 'x-ms-retriable'
                    match: { 
                       exactMatch: 'true'
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

| Metadata | Required | Description | Example |
| -------- | --------- | ----------- | ------- |
| `maxRetries` | Yes | Maximum retries to be executed for a failed http-request. | `5` |
| `retryBackOff` | Yes | Monitor the requests and shut off all traffic to the impacted service when timeout and retry criteria are met. | N/A |
| `retryBackOff.initialDelayInMilliseconds` | Yes | Delay between first error and first retry. | `1000` |
| `retryBackOff.maxIntervalInMilliseconds` | Yes | Maximum delay between retries. | `10000` |
| `matches` | Yes | Set match values to limit when the app should attempt a retry.  | `headers`, `httpStatusCodes`, `errors` |
| `matches.headers` | Y* | Retry when the error response includes a specific header. *Headers are only required properties if you specify the `retriable-headers` error property. [Learn more about available header matches.](#header-matches) | `X-Content-Type` |
| `matches.httpStatusCodes` | Y* | Retry when the response returns a specific status code. *Status codes are only required properties if you specify the `retriable-status-codes` error property. | `502`, `503` |
| `matches.errors` | Yes | Only retries when the app returns a specific error. [Learn more about available errors.](#errors) | `connect-failure`, `reset` |

##### Header matches

If you specified the `retriable-headers` error, you can use the following header match properties to retry when the response includes a specific header.

```bicep
matches: {
  headers: [
    { 
      header: 'x-ms-retriable'
      match: {
        exactMatch: 'true'
      }
    }
  ]
}
```

| Metadata | Description |
| -------- | ----------- |
| `prefixMatch` | Retries are performed based on the prefix of the header value. |
| `exactMatch` | Retries are performed based on an exact match of the header value. |
| `suffixMatch` | Retries are performed based on the suffix of the header value. |
| `regexMatch` | Retries are performed based on a regular expression rule where the header value must match the regex pattern. |

##### Errors

You can perform retries on any of the following errors:

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
| `retriable-headers` | HTTP response headers that trigger a retry. A retry are performed if any of the header matches match the response headers. Required if you'd like to retry on any matching headers. |
| `retriable-status-codes` | HTTP status codes that should trigger retries. Required if you'd like to retry on any matching status codes. |
| `5xx` | Retry if server responds with any 5xx response codes. |
| `reset` | Retry if the server doesn't respond. |
| `connect-failure` | Retry if a request failed due to a faulty connection with the container app. |
| `retriable-4xx` | Retry if the container app responds with a 400-series response code, like `409`. |

#### tcpRetryPolicy

```bicep
properties: {
    tcpRetryPolicy: {
        maxConnectAttempts: 3
    }
}
```

| Metadata | Required | Description | Example |
| -------- | --------- | ----------- | ------- |
| `maxConnectAttempts` | Yes | Set the maximum connection attempts (`maxConnectionAttempts`) to retry on failed connections. | `3` |


### Circuit breakers

Circuit breaker policies specify whether a container app replica is temporarily removed from the load balancing pool, based on triggers like the number of consecutive errors.  

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
| `consecutiveErrors` | Yes | Consecutive number of errors before a container app replica is temporarily removed from load balancing. | `5` |
| `intervalInSeconds` | Yes | The amount of time given to determine if a replica is removed or restored from the load balance pool. | `10` |
| `maxEjectionPercent` | Yes | Maximum percent of failing container app replicas to eject from load balancing. Will eject at least one host regardless of the value. | `50` |

### Connection pools

Azure Container App's connection pooling maintains a pool of established and reusable connections to container apps. This connection pool reduces the overhead of creating and tearing down individual connections for each request.

Connection pools allow you to specify the maximum number of requests or connections allowed for a service. These limits control the total number of concurrent connections for each service. When this limit is reached, new connections aren't established to that service until existing connections are released or closed. This process of managing connections prevents resources from being overwhelmed by requests and maintains efficient connection management.

#### httpConnectionPool

```bicep
properties: {
    httpConnectionPool: {
        http1MaxPendingRequests: 1024
        http2MaxRequests: 1024
    }
}
```

| Metadata | Required | Description | Example |
| -------- | --------- | ----------- | ------- |
| `http1MaxPendingRequests` | Yes | Used for `http1` requests. Maximum number of open connections to a container app. | `1024` |
| `http2MaxRequests` | Yes | Used for `http2` requests. Maximum number of concurrent requests to a container app. | `1024` |

#### tcpConnectionPool

```bicep
properties: {
    tcpConnectionPool: {
        maxConnections: 100
    }
}
```

| Metadata | Required | Description | Example |
| -------- | --------- | ----------- | ------- |
| `maxConnections` | Yes | Maximum number of concurrent connections to an container app. | `100` |

## Resiliency observability

You can perform resiliency observability via your container app's metrics and system logs. 

### Resiliency logs

From the *Monitoring* section of your container app, select **Logs**.

In the Logs pane, write and run a query to find resiliency via your container app system logs. For example, to query for all actions logged within the past hour, write a query like the following:

```
ContainerAppsSystemLogs_CL
| where TimeGenerated > ago(1h)
```

Click **Run** to run the query and view results.

:::image type="content" source="media/service-discovery-resiliency/resiliency-logs-pane.png" alt-text="Screenshot demonstrating how to query for resiliency in your container app system logs.":::

The corresponding message:

Container App 'testapp-2' has applied resiliency '{"target":"testapp-2","httpRetryPolicy":{"maxRetries":3,"retryBackOff":{"initialDelayInMilliseconds":100,"maxIntervalInMilliseconds":1000},"matches":{"errors":["5xx"]}}}'

### Resiliency metrics

From the *Monitoring* menu of your container app, select **Metrics**. 

:::image type="content" source="media/service-discovery-resiliency/resiliency-metrics-pane.png" alt-text="Screenshot demonstrating how to access the resiliency metrics filters for your container app.":::

In the Metrics pane:

- Set the scope filter to the name of your container app.
- Select the **Standard metrics** metrics namespace.
- Select the metrics you'd like to filter from the drop-down menu.
- Select how you'd like the data aggregated in the results (by average, by maximum, etc).

Need image
:::image type="content" source="media/service-discovery-resiliency/resiliency-metrics-pane.png" alt-text="Screenshot demonstrating how to access the resiliency metrics filters for your container app.":::


## Related content

See how resiliency works for [Dapr components in Azure Container Apps](./dapr-component-resiliency.md).
