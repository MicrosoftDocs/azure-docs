---
title: Custom container sessions in Azure Container Apps
description: Learn to run custom container session in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.custom:
  - ignite-2024
ms.topic: conceptual
ms.date: 04/07/2025
ms.update-cycle: 180-days
ms.author: cshoe
ms.collection: ce-skilling-ai-copilot
---

# Azure Container Apps custom container sessions

In addition to the built-in code interpreter that Azure Container Apps dynamic sessions provide, you can also use custom containers to define your own session sandboxes.

> [!NOTE]
> This article applies only to custom container session pools. Unless noted, features described here aren't available for code interpreter session pools.

## Uses for custom container sessions

Custom containers allow you to build solutions tailored to your needs. They enable you to execute code or run applications in environments that are fast and ephemeral and offer secure, sandboxed spaces with Hyper-V. Additionally, they can be configured with optional network isolation. Some examples include:

* **Code interpreters**: When you need to execute untrusted code in secure sandboxes by a language not supported in the built-in interpreter, or you need full control over the code interpreter environment.

* **Isolated execution**: When you need to run applications in hostile, multitenant scenarios where each tenant or user has their own sandboxed environment. These environments are isolated from each other and from the host application. Some examples include applications that run user-provided code, code that grants end user access to a cloud-based shell, AI agents, and development environments.

## Using custom container sessions

To use custom container sessions, you first create a session pool with a custom container image. Azure Container Apps automatically starts containers in their own Hyper-V sandboxes using the provided image. Once the container starts up, it's available to the session pool.

When your application requests a session, an instance is instantly allocated from the pool. The session remains active until it enters an idle state, which is then automatically stopped and destroyed.

## Container probes for session pools

Use container probes to configure health checks for custom container session pools and maintain healthy session instances.

> [!NOTE]
> Container probes require API version `2025-02-02-preview` or later.

Container probes let you define health checks for session containers, similar to health probes in Azure Container Apps. When configured, the session pool monitors each session instance and removes unhealthy instances.

The session pool:

- Ensures ready session instances are healthy based on the probes.
- Automatically removes unhealthy session instances.
- Scales up to maintain the configured `readySessionInstances` count with healthy sessions.

Session pools support **Liveness** and **Startup** probe types. For more information about how probes work, see [Health probes in Azure Container Apps](health-probes.md?tabs=arm-template).

### Configuration

When you create or update a session pool, specify probes in the `properties.customContainerTemplate.containers` section of your request payload.

For the full API specification, see [SessionPools API](/rest/api/resource-manager/containerapps/container-apps-session-pools/create-or-update?view=rest-resource-manager-containerapps-2025-07-01&tabs=HTTP&preserve-view=true).

#### Example

```json
{
  "properties": {
    "customContainerTemplate": {
      "containers": [
        {
          "name": "my-session-container",
          "image": "myregistry.azurecr.io/my-session-image:latest",
          "probes": [
            {
              "type": "Liveness",
              "httpGet": {
                "path": "/health",
                "port": 8080
              },
              "periodSeconds": 10,
              "failureThreshold": 3
            },
            {
              "type": "Startup",
              "httpGet": {
                "path": "/ready",
                "port": 8080
              },
              "periodSeconds": 5,
              "failureThreshold": 30
            }
          ]
        }
      ]
    },
    "dynamicPoolConfiguration": {
      "readySessionInstances": 5
    }
  }
}
```

### Troubleshooting

If your session pool isn't maintaining the expected number of healthy `readySessionInstances`, consider the following:

1. **Check container logs** - Review session container logs to identify issues with probe endpoints or container startup. See [View logs for custom container session pools](troubleshooting.md#view-logs).
1. **Verify probe configuration** - Ensure probe paths, ports, and thresholds are configured correctly for your application.
1. **Review container health** - Check for issues inside your container that prevent probe endpoints from responding successfully.

## Stop a session

Use the Stop Session API to terminate a session in a custom container session pool.



Session pools support automatic session management through `lifecycleConfiguration`, which handles session lifecycle based on your configuration. However, there are scenarios where you may need more control.

After allocating a session, you can call this API to manually terminate it at any time. This is useful when:

- You need to clean up resources before a session reaches its time-to-live.
- Your session pool has reached its maximum concurrent sessions limit and you need to free up capacity for new sessions.
- A session has completed its work and you want to release resources immediately.

### API reference

#### Request

```http
POST {PoolManagementEndpoint}/.management/stopSession?api-version=2025-10-02-preview&identifier={SessionIdentifier}
```

#### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `api-version` | string | Yes | The API version to use (for example, `2025-10-02-preview`). |
| `identifier` | string | Yes | The unique identifier of the session to stop. |

### Examples

#### Request

```http
POST https://{PoolManagementEndpoint}/.management/stopSession?api-version=2025-10-02-preview&identifier=testSessionIdentifier
```

#### Response

```text
HTTP/1.1 200 OK
Content-Type: text/plain

Session testSessionIdentifier in session pool testSessionPool stopped.
```

## Logging

Custom container session pools integrate with Azure Monitor and Log Analytics. Application logs are captured only if your container writes output to `stdout` or `stderr`, so make sure your app emits logs to the console.

### Prerequisites

- An Azure Container Apps environment with a custom container session pool
- A Log Analytics workspace (or create one during setup)

### Configure logging

#### Step 1: Enable Azure Monitor logging

1. Navigate to your **Container Apps Environment** in the Azure portal.
1. Under **Monitoring**, select **Logging options**.
1. Set the logs destination to **Azure Monitor**.

#### Step 2: Configure diagnostic settings

1. In your Container Apps Environment, navigate to **Diagnostic settings** under **Monitoring**.
1. Select **+ Add diagnostic setting**.
1. Provide a name for your diagnostic setting.
1. Under **Logs**, select the session-related log categories you want to capture.
1. Under **Destination details**, select **Send to Log Analytics workspace**.
1. Choose your Log Analytics workspace (or create a new one).
1. Select **Save**.

### Log Analytics tables

| Log category | Log Analytics table | Description |
|-------------|---------------------|-------------|
| Application logs | `AppEnvSessionConsoleLogs` | Standard output (`stdout`) and standard error (`stderr`) emitted by the containerized application. |
| Platform logs | `AppEnvSessionLifecycleLogs`, `AppEnvSessionPoolEvents` | Platform-generated events related to session pool allocation, lifecycle, and operational state. |

If logs are sent directly to Log Analytics, the tables use the _CL suffix (for example, `AppEnvSessionConsoleLogs_CL`). When logs are routed through Azure Monitor diagnostic settings, the table names don't include the _CL suffix.

### View session logs

Once diagnostic settings are configured, logs are sent to your Log Analytics workspace.

#### Query logs in Log Analytics

1. Navigate to your **Log Analytics workspace** in the Azure portal.
1. Select **Logs** under **General**.
1. Use [Kusto Query Language (KQL)](/azure/data-explorer/kusto/query/) to query session logs.

#### Example queries

**View recent console logs from sessions:**

```kusto
AppEnvSessionConsoleLogs
| where TimeGenerated > ago(1h)
| order by TimeGenerated desc
| take 100
```

**View session lifecycle events:**

```kusto
AppEnvSessionLifecycleLogs
| where TimeGenerated > ago(1h)
| order by TimeGenerated desc
```

**View session pool events:**

```kusto
AppEnvSessionPoolEvents
| where TimeGenerated > ago(1h)
| order by TimeGenerated desc
```

## Metrics

Azure Container Apps emits Azure Monitor metrics for custom container session pools. Use these metrics to track pool capacity and activity over time.

### Supported metrics

For the complete list, see [Supported metrics - Microsoft.App/sessionpools - Azure Monitor](/azure/azure-monitor/reference/supported-metrics/microsoft-app-sessionpools-metrics).

| Metric | Name in REST API | Unit | Aggregation | Dimensions | Time Grains | DS Export |
| --- | --- | --- | --- | --- | --- | --- |
| **Executing Sessions Count**<br>Number of executing session pods in the session pool | `PoolExecutingPodCount` | Count | Total (Sum), Average, Maximum, Minimum | `poolName` | PT1M | Yes |
| **Creating Sessions Count**<br>Number of creating session pods in the session pool | `PoolPendingPodCount` | Count | Total (Sum), Average, Maximum, Minimum | `poolName` | PT1M | Yes |
| **Ready Sessions Count**<br>Number of ready session pods in the session pool | `PoolReadyPodCount` | Count | Total (Sum), Average, Maximum, Minimum | `poolName` | PT1M | Yes |

### View session metrics
You can either use Azure Monitor or Container Apps environment metrics to view session-based metrics.
#### Option 1: Azure Monitor Metrics

1. Open the [Azure Monitor Metrics page](https://ms.portal.azure.com/#view/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/~/metrics).
1. Select your custom container session pool as the scope.
1. Choose a metric and aggregation to view.

#### Option 2: Container Apps environment metrics

1. In the Azure portal, open your Container Apps environment.
1. Select **Metrics**.
1. Use **Scope** to select your custom container session pool.
1. Choose a metric and aggregation to view.

## Related content

* [Serverless code interpreter sessions in Azure Container Apps](sessions-code-interpreter.md)
* [Dynamic sessions custom container sample (GitHub)](https://github.com/Azure-Samples/dynamic-sessions-custom-container)
