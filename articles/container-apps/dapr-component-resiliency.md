---
title: Dapr component resiliency (preview)
titleSuffix: Azure Container Apps
description: Learn how to make your Dapr components resilient in Azure Container Apps.
services: container-apps
author: hhunter-ms
ms.service: azure-container-apps
ms.topic: conceptual
ms.date: 11/19/2024
ms.author: hannahhunter
ms.custom: ignite-fall-2023, ignite-2023, devx-track-azurecli
# Customer Intent: As a developer, I'd like to learn how to make my container apps resilient using Azure Container Apps.
---

# Dapr component resiliency (preview)

Resiliency policies proactively prevent, detect, and recover from your container app failures. In this article, you learn how to apply resiliency policies for applications that use Dapr to integrate with different cloud services, like state stores, pub/sub message brokers, secret stores, and more. 

You can configure resiliency policies like retries, timeouts, and circuit breakers for the following outbound and inbound operation directions via a Dapr component: 

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
- [Circuit breakers](#circuit-breakers)

## Configure resiliency policies

You can choose whether to create resiliency policies using Bicep, the CLI, or the Azure portal.  

# [Bicep](#tab/bicep)

The following resiliency example demonstrates all of the available configurations. 

```bicep
resource myPolicyDoc 'Microsoft.App/managedEnvironments/daprComponents/resiliencyPolicies@2023-11-02-preview' = {
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
      circuitBreakerPolicy: {  
          intervalInSeconds: 15
          consecutiveErrors: 10
          timeoutInSeconds: 5     
      }  
    } 
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
      circuitBreakerPolicy: {  
          intervalInSeconds: 15
          consecutiveErrors: 10
          timeoutInSeconds: 5     
      }  
    }
  }
}
```

# [CLI](#tab/cli)

### Before you begin

Log in to the Azure CLI:

```azurecli
az login
```

Make sure you have the latest version of the Azure Container App extension.

```azurecli
az extension show --name containerapp
az extension update --name containerapp
```

### Create specific policies

> [!NOTE]
> If all properties within a policy are not set during create or update, the CLI automatically applies the recommended default settings. [Set specific policies using flags.](#create-specific-policies)

Create resiliency policies by targeting an individual policy. For example, to create the `Outbound Timeout` policy, run the following command.

```azurecli
az containerapp env dapr-component resiliency create --group MyResourceGroup --name MyDaprResiliency --environment MyEnvironment --dapr-component-name MyDaprComponentName --out-timeout 20
```

[For a full list of parameters, see the CLI reference guide.](/cli/azure/containerapp/resiliency#az-containerapp-resiliency-create-optional-parameters)

### Create policies with resiliency YAML

To apply the resiliency policies from a YAML file, run the following command:

```azurecli
az containerapp env dapr-component resiliency create --group MyResourceGroup --name MyDaprResiliency --environment MyEnvironment --dapr-component-name MyDaprComponentName --yaml <MY_YAML_FILE>
```

This command passes the resiliency policy YAML file, which might look similar to the following example:

```yml
outboundPolicy:
  httpRetryPolicy:
    maxRetries: 5
    retryBackOff:
      initialDelayInMilliseconds: 1000
      maxIntervalInMilliseconds: 10000
  timeoutPolicy:
    responseTimeoutInSeconds: 15
  circuitBreakerPolicy:
    intervalInSeconds: 15
    consecutiveErrors: 10
    timeoutInSeconds: 5
inboundPolicy:
  httpRetryPolicy:
    maxRetries: 3
    retryBackOff:
      initialDelayInMilliseconds: 500
      maxIntervalInMilliseconds: 5000
  circuitBreakerPolicy:
    intervalInSeconds: 15
    consecutiveErrors: 10
    timeoutInSeconds: 5
```

### Update specific policies

Update your resiliency policies by targeting an individual policy. For example, to update the response timeout of the `Outbound Timeout` policy, run the following command.

```azurecli
az containerapp env dapr-component resiliency update --group MyResourceGroup --name MyDaprResiliency --environment MyEnvironment --dapr-component-name MyDaprComponentName --out-timeout 20
```

### Update policies with resiliency YAML

You can also update existing resiliency policies by updating the resiliency YAML you created earlier.

```azurecli
az containerapp env dapr-component resiliency update --group MyResourceGroup --name MyDaprResiliency --environment MyEnvironment --dapr-component-name MyDaprComponentName --yaml <MY_YAML_FILE>
```

### View policies

Use the `resiliency list` command to list all the resiliency policies attached to a container app.

```azurecli
az containerapp env dapr-component resiliency list --group MyResourceGroup --environment MyEnvironment --dapr-component-name MyDaprComponentName
```

Use `resiliency show` command to show a single policy by name.

```azurecli
az containerapp env dapr-component resiliency show --group MyResourceGroup --name MyDaprResiliency --environment MyEnvironment --dapr-component-name MyDaprComponentName
```

### Delete policies

To delete resiliency policies, run the following command. 

```azurecli
az containerapp env dapr-component resiliency delete --group MyResourceGroup --name MyDaprResiliency --environment MyEnvironment --dapr-component-name MyDaprComponentName
```

# [Azure portal](#tab/portal)

Navigate into your container app environment in the Azure portal. In the left side menu under **Settings**, select **Dapr components** to open the Dapr component pane.

:::image type="content" source="media/dapr-component-resiliency/dapr-component-pane.png" alt-text="Screenshot showing where to access the Dapr components associated with your container app.":::

You can add resiliency policies to an existing Dapr component by selecting **Add resiliency** for that component. 

:::image type="content" source="media/dapr-component-resiliency/add-dapr-component-resiliency.png" alt-text="Screenshot showing where to click to add a resiliency policy to a Dapr component.":::

In the resiliency policy pane, select **Outbound** or **Inbound** to set policies for outbound or inbound operations. For example, for outbound operations, you can set timeout and HTTP retry policies similar to the following. 

:::image type="content" source="media/dapr-component-resiliency/outbound-dapr-resiliency.png" alt-text="Screenshot demonstrating how to set timeout or retry policies for an outbound operation.":::

Click **Save** to save the resiliency policies.

> [!NOTE]
> Currently, you can only set timeout and retry policies via the Azure portal.

You can edit or remove the resiliency policies by selecting **Edit resiliency**. 

:::image type="content" source="media/dapr-component-resiliency/edit-dapr-component-resiliency.png" alt-text="Screenshot showing how you can edit existing resiliency policies for the applicable Dapr component.":::

---

> [!IMPORTANT]
> Once you've applied all the resiliency policies, you need to restart your Dapr applications.

## Policy specifications

### Timeouts

Timeouts are used to early-terminate long-running operations. The timeout policy includes the following properties.

```bicep
properties: {
  outbound: {
    timeoutPolicy: {
        responseTimeoutInSeconds: 15
    }
  }
  inbound: {
    timeoutPolicy: {
        responseTimeoutInSeconds: 15
    }
  }
}
```

| Metadata | Required | Description | Example |
| -------- | --------- | ----------- | ------- |
| `responseTimeoutInSeconds` | Yes | Timeout waiting for a response from the Dapr component. | `15` |

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
  }
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

### Circuit breakers

Define a `circuitBreakerPolicy` to monitor requests causing elevated failure rates and shut off all traffic to the impacted service when a certain criteria is met.

```bicep
properties: {  
  outbound: {  
    circuitBreakerPolicy: {  
        intervalInSeconds: 15
        consecutiveErrors: 10
        timeoutInSeconds: 5     
    }  
  },  
  inbound: {  
    circuitBreakerPolicy: {  
        intervalInSeconds: 15
        consecutiveErrors: 10
        timeoutInSeconds: 5     
    }  
  }  
}
```

| Metadata | Required | Description | Example |
| -------- | --------- | ----------- | ------- |
| `intervalInSeconds` | No | Cyclical period of time (in seconds) used by the circuit breaker to clear its internal counts. If not provided, the interval is set to the same value as provided for `timeoutInSeconds`. | `15` |
| `consecutiveErrors` | Yes | Number of request errors allowed to occur before the circuit trips and opens. | `10` |
| `timeoutInSeconds` | Yes | Time period (in seconds) of open state, directly after failure. | `5` |

#### Circuit breaker process

Specifying `consecutiveErrors` (the circuit trip condition as
`consecutiveFailures > $(consecutiveErrors)-1`) sets the number of errors allowed to occur before the circuit trips and opens halfway. 

The circuit waits half-open for the `timeoutInSeconds` amount of time, during which the `consecutiveErrors` number of requests must consecutively succeed. 
- _If the requests succeed,_ the circuit closes. 
- _If the requests fail,_ the circuit remains in a half-opened state.

If you didn't set any `intervalInSeconds` value, the circuit resets to a closed state after the amount of time you set for `timeoutInSeconds`, regardless of consecutive request success or failure. If you set `intervalInSeconds` to `0`, the circuit never automatically resets, only moving from half-open to closed state by successfully completing `consecutiveErrors` requests in a row.

If you did set an `intervalInSeconds` value, that determines the amount of time before the circuit is reset to closed state, independent of whether the requests sent in half-opened state succeeded or not.

## Resiliency logs

From the *Monitoring* section of your container app, select **Logs**.

:::image type="content" source="media/dapr-component-resiliency/dapr-resiliency-logs-pane.png" alt-text="Screenshot demonstrating where to find the logs for your container app using Dapr component resiliency.":::

In the Logs pane, write and run a query to find resiliency via your container app system logs. For example, to find whether a resiliency policy was loaded:

```
ContainerAppConsoleLogs_CL
| where ContainerName_s == "daprd"
| where Log_s contains "Loading Resiliency configuration:"
| project time_t, Category, ContainerAppName_s, Log_s
| order by time_t desc
```

Click **Run** to run the query and view the result with the log message indicating the policy is loading.

:::image type="content" source="media/dapr-component-resiliency/dapr-resiliency-query-results-loading.png" alt-text="Screenshot showing resiliency query results based on provided query example for checking if resiliency policy has loaded.":::

Or, you can find the actual resiliency policy by enabling debug logs on your container app and querying to see if a resiliency resource is loaded. 

:::image type="content" source="media/dapr-component-resiliency/dapr-debug-logs.png" alt-text="Screenshot demonstrating how to enable debug logs on your container app via the portal.":::

Once debug logs are enabled, use a query similar to the following:

```
ContainerAppConsoleLogs_CL
| where ContainerName_s == "daprd"
| where Log_s contains "Resiliency configuration ("
| project time_t, Category, ContainerAppName_s, Log_s
| order by time_t desc
```

Click **Run** to run the query and view the resulting log message with the policy configuration. 

:::image type="content" source="media/dapr-component-resiliency/dapr-resiliency-query-results-policy.png" alt-text="Screenshot showing resiliency query results based on provided query example for finding the actual resiliency policy.":::

## Related content

See how resiliency works for [Service to service communication using Azure Container Apps built in service discovery](./service-discovery-resiliency.md)
