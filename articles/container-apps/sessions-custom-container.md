---
title: Custom container sessions in Azure Container Apps
description: Learn about custom container sessions in Azure Container Apps, including container probes for session pools.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.custom:
  - ignite-2024
ms.topic: concept-article
ms.date: 03/18/2026
ms.update-cycle: 180-days
ms.author: cshoe
ms.collection: ce-skilling-ai-copilot

#customer intent: As an application developer using Azure Container Apps, I want to use custom container sessions, including container probes for session pools.
---

# Azure Container Apps custom container sessions

In addition to the built-in code interpreter that Azure Container Apps dynamic sessions provide, you can also use custom containers to define your own session sandboxes.

> [!NOTE]
> This article applies only to custom container session pools. Unless otherwise noted, features described here aren't available for code interpreter session pools.

## Uses for custom container sessions

Custom containers allow you to build solutions tailored to your needs. They enable you to run code or applications in environments that are fast and ephemeral. They offer secure, sandboxed spaces with Hyper-V. Also, they can be configured with optional network isolation. Some examples include:

- **Code interpreters**: Use if you run untrusted code in secure sandboxes by a language not supported in the built-in interpreter, or you need full control over the code interpreter environment.

- **Isolated execution**: Use if you run applications in hostile, multitenant scenarios where each tenant or user has their own sandboxed environment. These environments are isolated from each other and from the host application. Some examples include applications that run user-provided code, code that grants end user access to a cloud-based shell, AI agents, and development environments.

## Using custom container sessions

To use custom container sessions, create a session pool with a custom container image. Azure Container Apps automatically starts containers in their own Hyper-V sandboxes using the provided image. After the container starts up, it's available to the session pool.

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

If your session pool isn't maintaining the expected number of healthy `readySessionInstances`, consider the following fixes:

- **Check container logs**. Review session container logs to identify issues with probe endpoints or container startup. See [View logs for custom container session pools](troubleshooting.md#view-logs).
- **Verify probe configuration**. Ensure probe paths, ports, and thresholds are configured correctly for your application.
- **Review container health**. Check for issues inside your container that prevent probe endpoints from responding successfully.

## Stop a session

Use the Stop Session API to terminate a session in a custom container session pool.

Session pools support automatic session management through `lifecycleConfiguration`, which handles session lifecycle based on your configuration. However, there are scenarios where you might need more control.

After allocating a session, you can call this API to manually terminate it at any time. This approach is useful when:

- You need to clean up resources before a session reaches its time-to-live.
- Your session pool reaches its maximum concurrent sessions limit and you need to free up capacity for new sessions.
- A session completes its work and you want to release resources immediately.

### API reference

#### Request

```http
POST <POOL_MANAGEMENT_ENDPOINT>/.management/stopSession?api-version=2025-02-02-preview&identifier=<SESSION_ID>
```

#### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `api-version` | string | Yes | The API version to use (for example, `2025-02-02-preview`). |
| `identifier` | string | Yes | The unique identifier of the session to stop. |

### Examples

#### Request

```http
POST https://<SESSION_POOL_NAME>.<ENVIRONMENT_ID>.<REGION>.azurecontainerapps.io/.management/stopSession?api-version=2025-02-02-preview&identifier=testSessionIdentifier
```

#### Response

```text
HTTP/1.1 200 OK
Content-Type: text/plain

Session testSessionIdentifier in session pool testSessionPool stopped.
```

## Retrieve session information

You can query your session pool to check session status, get expiration details, and list all active sessions. This capability is useful for monitoring session health, tracking resource usage, and implementing custom cleanup workflows.

### Get a single session

To retrieve details about a specific session, use the `getSession` endpoint:

```http
POST <POOL_MANAGEMENT_ENDPOINT>/.management/getSession?identifier=<SESSION_ID>&api-version=2025-02-02-preview
Authorization: Bearer <TOKEN>
```

The `getSession` endpoint returns session metadata including the session identifier, current expiration time, and creation timestamp.

#### SessionView response schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `identifier` | string | Yes | The session identifier you provided |
| `etag` | string | Yes | Opaque version identifier for the session. You can use this identifier for change detection. |
| `expiresAt` | DateTime | Yes | UTC timestamp when the session will be terminated |
| `createdAt` | DateTime | No | Session creation timestamp |
| `lastAccessedAt` | DateTime | No | Timestamp of the last request to this session |

#### Example request and response

```bash
curl -X POST "https://my-pool.env-id.westus2.azurecontainerapps.io/.management/getSession?identifier=user-123&api-version=2025-02-02-preview" \
  -H "Authorization: Bearer $TOKEN"
```

Success response (HTTP 200):

```json
{
  "identifier": "user-123",
  "etag": "a1b2c3d4",
  "expiresAt": "2026-04-30T14:30:00Z",
  "createdAt": "2026-04-30T13:30:00Z",
  "lastAccessedAt": "2026-04-30T14:29:00Z"
}
```

### List all sessions in a pool

To retrieve a list of all sessions in your session pool, use the `listSessions` endpoint:

```text
POST <POOL_MANAGEMENT_ENDPOINT>/.management/listSessions?skip=0&api-version=2025-02-02-preview
Authorization: Bearer <TOKEN>
```

#### Pagination

The list endpoint supports skip-based pagination. By default, each page returns up to 300 sessions. Use the `skip` query parameter to navigate through results.

| Parameter | Description |
|-----------|-------------|
| `skip` | Number of sessions to skip from the beginning (default: 0) |
| `nextLink` | Full URL for the next page of results (included in response when more results exist) |

#### ApiCollectionEnvelope response schema

| Field | Type | Description |
|-------|------|-------------|
| `value` | SessionView[] | Array of session objects |
| `count` | integer | Number of sessions in the current page |
| `nextLink` | string | URL for the next page (null if no more results) |

#### Example pagination loop

```bash
POOL_URL="https://my-pool.env-id.westus2.azurecontainerapps.io"
next_url="$POOL_URL/.management/listSessions?skip=0&api-version=2025-02-02-preview"

while [ -n "$next_url" ]; do
  response=$(curl -s -X POST "$next_url" \
    -H "Authorization: Bearer $TOKEN")

  echo "$response" | jq '.value[] | {identifier, expiresAt}'

  next_url=$(echo "$response" | jq -r '.nextLink // empty')
done
```

Example response (HTTP 200):

```json
{
  "value": [
    {
      "identifier": "user-123",
      "etag": "a1b2c3d4",
      "expiresAt": "2026-04-30T14:30:00Z",
      "createdAt": "2026-04-30T13:30:00Z",
      "lastAccessedAt": "2026-04-30T14:29:00Z"
    },
    {
      "identifier": "user-456",
      "etag": "e5f6a7b8",
      "expiresAt": "2026-04-30T14:30:00Z",
      "createdAt": "2026-04-30T13:30:00Z",
      "lastAccessedAt": "2026-04-30T14:29:00Z"
    }
  ],
  "count": 2,
  "nextLink": "https://my-pool.env-id.westus2.azurecontainerapps.io/.management/listSessions?skip=300"
}
```

## Logging

Custom container session pools integrate with Azure Monitor and Log Analytics. Application logs are captured only if your container writes output to `stdout` or `stderr`, so make sure your app emits logs to the console.

### Prerequisites

- An Azure Container Apps environment with a custom container session pool
- A Log Analytics workspace, or create one during setup

### Configure logging

#### Enable Azure Monitor logging

1. In the Azure portal, navigate to your **Container Apps Environment**.
1. Under **Monitoring**, select **Logging options**.
1. Set **Logs Destination** to **Azure Monitor**.

#### Configure diagnostic settings

1. In your Container Apps Environment, under **Monitoring**, select **Diagnostic settings**.
1. Select **+ Add diagnostic setting**.
1. Provide a name for your diagnostic setting.
1. Under **Logs**, select the session-related log categories you want to capture.
1. Under **Destination details**, select **Send to Log Analytics workspace**.
1. Choose your Log Analytics workspace, or create a new one.
1. Select **Save**.

### Log Analytics tables

| Log category | Log Analytics table | Description |
|-------------|---------------------|-------------|
| Application logs | `AppEnvSessionConsoleLogs` | Standard output (`stdout`) and standard error (`stderr`) emitted by the containerized application. |
| Platform logs | `AppEnvSessionLifecycleLogs`, `AppEnvSessionPoolEvents` | Platform-generated events related to session pool allocation, lifecycle, and operational state. |

If logs are sent directly to Log Analytics, the tables use the _CL suffix, for example, `AppEnvSessionConsoleLogs_CL`. When logs are routed through Azure Monitor diagnostic settings, the table names don't include the _CL suffix.

### View session logs

After diagnostic settings are configured, logs are sent to your Log Analytics workspace.

#### Query logs in Log Analytics

1. In the Azure portal, navigate to your **Log Analytics workspace**.
1. In the left menu, select **Logs**.
1. If the query is in **Simple mode**, select **KQL mode**.
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

#### Azure Monitor Metrics

1. Open the [Azure Monitor Metrics page](https://portal.azure.com/#view/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/~/metrics).
1. Use **Scope** to select your custom container session pool.
1. Choose a metric and aggregation to view.

#### Container Apps environment metrics

1. In the Azure portal, open your Container Apps Environment.
1. Under **Monitoring**, select **Metrics**.
1. Use **Scope** to select your custom container session pool.
1. Choose a metric and aggregation to view.

## Related content

- [Serverless code interpreter sessions in Azure Container Apps](sessions-code-interpreter.md)
- [Dynamic sessions custom container sample (GitHub)](https://github.com/Azure-Samples/dynamic-sessions-custom-container)
