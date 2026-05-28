---
title: Monitor logs in Azure Container Apps with Log Analytics
description: Monitor your container app logs with Log Analytics
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: how-to
ms.date: 05/02/2025
ms.author: cshoe
---

# Monitor logs in Azure Container Apps with Log Analytics

Azure Container Apps is integrated with Azure Monitor Log Analytics to monitor and analyze your container app's logs. When selected as your log monitoring solution, your Container Apps environment includes a Log Analytics workspace that provides a common place to store system and application log data from all container apps running in the environment.

Log entries are accessible by querying Log Analytics tables through the Azure portal or a command shell using the [Azure CLI](/cli/azure/monitor/log-analytics).

Azure Container Apps provides three log types to help you monitor and troubleshoot:

- **Console logs**: Your application generates these logs.
- **System logs**: The Container Apps service generates these logs.
- **HTTP logs**: The ingress layer emits these logs when HTTP logging is enabled through diagnostic settings.

## System logs

The Container Apps service provides system log messages at the container app level. System logs emit the following messages:

| Source | Type | Message |
|---------|------|---------|
| Dapr | Info | Successfully created dapr component \<component-name\> with scope \<dapr-component-scope\> |
| Dapr | Info | Successfully updated dapr component \<component-name\> with scope \<component-type\> |
| Dapr | Error | Error creating dapr component \<component-name\> |
| Volume Mounts | Info | Successfully mounted volume \<volume-name\> for revision \<revision-scope\> |
| Volume Mounts | Error | Error mounting volume \<volume-name\> |
| Domain Binding | Info | Successfully bound domain \<domain\> to the container app \<container app name\> |
| Authentication | Info | Auth enabled on app. Creating authentication config |
| Authentication | Info | Auth config created successfully |
| Traffic weight | Info | Setting a traffic weight of \<percentage>% for revision \<revision-name\\> |
| Revision Provisioning | Info | Creating a new revision: \<revision-name\> |
| Revision Provisioning | Info | Successfully provisioned revision \<name\> |
| Revision Provisioning | Info| Deactivating old revisions since 'ActiveRevisionsMode=Single' |
| Revision Provisioning | Error | Error provisioning revision \<revision-name>. ErrorCode: \<[ErrImagePull]\|[Timeout]\|[ContainerCrashing]\> |

The system log data is accessible by querying the `ContainerAppSystemLogs_CL` table. The most commonly used Container Apps-specific columns in the table are:

| Column  | Description |
|---|---|
| `ContainerAppName_s` | Container app name |
| `EnvironmentName_s` | Container Apps environment name |
| `Log_s` | Log message |
| `RevisionName_s` | Revision name |

## Console logs

Console logs originate from the `stderr` and `stdout` messages from the containers in your container app and Dapr sidecars. You can view console logs by querying the `ContainerAppConsoleLogs_CL` table.

> [!TIP]
> Instrumenting your code with well-defined log messages can help you to understand how your code is performing and to debug issues. To learn more about best practices, refer to [Design for operations](/azure/architecture/guide/design-principles/design-for-operations).

The most commonly used Container Apps-specific columns in `ContainerAppConsoleLogs_CL` include:

|Column  |Description |
|---------|---------|
| `ContainerAppName_s` | Container app name |
| `ContainerGroupName_g` | Replica name |
| `ContainerId_s` | Container identifier |
| `ContainerImage_s` | Container image name |
| `EnvironmentName_s` | Container Apps environment name |
| `Log_s` | Log message |
| `RevisionName_s` | Revision name |

## HTTP logs

Azure Container Apps can emit HTTP logs by using Azure Monitor diagnostic settings on the Container Apps managed environment.

Use HTTP logs to inspect request volume, paths, methods, and response outcomes when diagnosing API and web traffic behavior.

The `ContainerAppHTTPLogs` schema contains the following fields and descriptions:

 | Field | Type | Description |
   | --- | --- | --- |
   | **Request** | | |
   | `Method` | string | HTTP request method (e.g. `GET`, `POST`). |
   | `Path` | string | Request path including query string. Sensitive values such as tokens or API keys may appear here if your clients pass them in the query — handle accordingly. |
   | `Authority` | string | The HTTP `Host` header (or HTTP/2 `:authority` pseudo-header) sent by the client. |
   | `Protocol` | string | Protocol version observed by ingress, one of `HTTP/1.1`, `HTTP/2`, or `HTTP/3`. |
   | `UserAgent` | string | Client `User-Agent` header. |
   | `XForwardedFor` | string | Client IP chain from the `X-Forwarded-For` header. Contains end-user IPs — treat as PII. |
   | `BytesReceived` | long | Size of the request body received from the client, in bytes([`%BYTES_RECEIVED%`](https://www.envoyproxy.io/docs/envoy/latest/configuration/advanced/substitution_formatter#supported-commands)). |
   | **Response** | | |
   | `StatusCode` | int | HTTP response status code returned to the client. `0` indicates the client disconnected before the response started([`%RESPONSE_CODE%`](https://www.envoyproxy.io/docs/envoy/latest/configuration/advanced/substitution_formatter#supported-commands)). |
   | `ResponseCodeDetails` | string | Short token explaining who set the status code and why — for example `via_upstream`, `direct_response`, `route_not_found`, `upstream_per_try_timeout`([full list](https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_conn_man/response_code_details)). |
   | `ResponseFlags` | string | One or more short codes describing transport-level conditions — for example `-` (none), `UH` (no healthy upstream), `UT` (upstream timeout), `NR` (no route) ([full list](https://www.envoyproxy.io/docs/envoy/latest/configuration/advanced/substitution_formatter#config-access-log-format-response-flags)). |
   | `BytesSent` | long | Size of the response body sent to the client, in bytes([`%BYTES_SENT%`](https://www.envoyproxy.io/docs/envoy/latest/configuration/advanced/substitution_formatter#supported-commands)). |
   | **Timing** | | |
   | `StartTime` | datetime | Time (UTC) ingress began processing the request([`%START_TIME%`](https://www.envoyproxy.io/docs/envoy/latest/configuration/advanced/substitution_formatter#config-access-log-format-start-time)). |
   | `RequestDuration` | long | Total time, in milliseconds, from request start to last response byte sent([`%DURATION%`](https://www.envoyproxy.io/docs/envoy/latest/configuration/advanced/substitution_formatter#config-access-log-format-duration)). |
   | **Identifiers** | | |
   | `RequestId` | string | Request correlation ID. Reflects the `x-request-id` header if the client supplied one; otherwise ingress generates a value. Not guaranteed to be a UUID. |
   | `ConnectionId` | string | Identifier of the downstream connection on which this request arrived. Multiple requests on the same connection share this value([`%CONNECTION_ID%`](https://www.envoyproxy.io/docs/envoy/latest/configuration/advanced/substitution_formatter#config-access-log-format-connection-id)). |
   | **App / Routing** | | |
   | `ContainerAppName` | string | Container App that handled the request. |
   | `RevisionName` | string | Revision of the Container App that served the request. |
   | `ReplicaName` | string | Replica (pod) that served the request. |
   | `EnvironmentName` | string | Container Apps environment hosting the app. |
   | **Upstream** | | |
   | `UpstreamHost` | string | Address (`IP:port`) of the upstream endpoint that served the request([`%UPSTREAM_HOST%`](https://www.envoyproxy.io/docs/envoy/latest/configuration/advanced/substitution_formatter#config-access-log-format-upstream-host)). |
   | `UpstreamRequestAttemptCount` | int | Number of times the request was attempted upstream, including retries. `0` means it was never attempted. |
   | **Ingress diagnostics** | | |
   | `EnvoyPodName` | string | Name of the ingress pod that produced this record. Useful for cross-referencing ingress logs during incident investigation. |
   | `EnvoyContainerId` | string | Container ID of the ingress instance. Useful for cross-referencing ingress logs during incident investigation. |
| --- | --- |
| `StartTime` | UTC timestamp when request processing started at ingress. |
| `ContainerAppName` | Name of the container app that handled the request. |
| `RevisionName` | Revision name for the container app instance that served the request. |
| `EnvironmentName` | Container Apps environment name. |
| `Method` | HTTP method, for example `GET` or `POST`. |
| `Path` | Request path after sanitization and conditional redaction. |
| `Authority` | Host/authority value after sanitization and conditional redaction. |
| `Protocol` | Application protocol observed by ingress, for example `HTTP/1.1` or `HTTP/2`. |
| `StatusCode` | Final HTTP status code returned to the client. |
| `ResponseCodeDetails` | Envoy response classification detail string. |
| `ResponseFlags` | Envoy response flag markers for transport or routing conditions. |
| `RequestDuration` | End-to-end request duration at ingress. |
| `UpstreamHost` | Upstream endpoint selected by Envoy. |
| `UpstreamRequestAttemptCount` | Number of upstream attempts made for the request. |
| `RequestId` | Correlation identifier for the request. |
| `ConnectionId` | Connection identifier, when present. |
| `BytesReceived` | Number of request bytes received. |
| `BytesSent` | Number of response bytes sent. |
| `UserAgent` | User agent value after sanitization and conditional redaction. |
| `XForwardedFor` | Forwarded client IP chain from ingress headers. |
| `EnvoyPodName` | Name of the ingress Envoy pod that produced the log record. |
| `EnvoyContainerId` | Container ID of the ingress Envoy instance. |
| `ReplicaName` | Replica name associated with the request, when present. |

> [!NOTE]
> After you enable HTTP logs, it can take several minutes before the `ContainerAppHTTPLogs` table appears in Log Analytics.


### Query HTTP logs in Log Analytics

Use this query to inspect recent HTTP log records:

```kusto
ContainerAppHTTPLogs
| where TimeGenerated > ago(2h)
| project TimeGenerated, Method, Path, StatusCode, ContainerAppName, EnvironmentName
| order by TimeGenerated desc
| take 100
```

Use the following examples for common HTTP log analysis scenarios.

Status code distribution:

```kusto
ContainerAppHTTPLogs
| where TimeGenerated > ago(24h)
| summarize Count = count() by toint(StatusCode)
| order by Count desc
```

Error-focused view (4xx/5xx):

```kusto
ContainerAppHTTPLogs
| where TimeGenerated > ago(2h)
| extend StatusCodeInt = toint(StatusCode)
| where StatusCodeInt >= 400
| project
    Time=TimeGenerated,
    StatusCode=StatusCodeInt,
    Method,
    Path,
    Details=ResponseCodeDetails,
    EnvName=EnvironmentName,
    AppName=ContainerAppName,
    Revision=RevisionName
| top 100 by Time desc
```

5xx trend by app and path:

```kusto
ContainerAppHTTPLogs
| where TimeGenerated > ago(2h)
| where toint(StatusCode) >= 500
| summarize Count = count() by bin(TimeGenerated, 5m), ContainerAppName, Path
| order by TimeGenerated desc, Count desc
```

Latency (P50/P95/P99) by app and path:

```kusto
ContainerAppHTTPLogs
| where TimeGenerated > ago(2h)
| summarize
    Requests = count(),
    P50 = percentile(RequestDuration, 50),
    P95 = percentile(RequestDuration, 95),
    P99 = percentile(RequestDuration, 99)
  by ContainerAppName, Path
| order by P95 desc
```

Retry-focused view (multiple upstream attempts):

```kusto
ContainerAppHTTPLogs
| where TimeGenerated > ago(2h)
| where toint(UpstreamRequestAttemptCount) > 1
| project
    Time = TimeGenerated,
    ContainerAppName,
    RevisionName,
    ReplicaName,
    Method,
    Path,
    StatusCode,
    UpstreamRequestAttemptCount,
    ResponseFlags,
    ResponseCodeDetails,
    UpstreamHost,
    RequestId,
    ConnectionId
| order by Time desc
| take 200
```


## Query logs with Log Analytics

Log Analytics is a tool in the Azure portal that you can use to view and analyze log data. Using Log Analytics, you can write Kusto queries and then sort, filter, and visualize the results in charts to spot trends and identify issues. You can work interactively with the query results or use them with other features such as alerts, dashboards, and workbooks.

### Azure portal

Start Log Analytics from **Logs** in the sidebar menu on your container app page. You can also start Log Analytics from **Monitor > Logs**.

You can query the logs using the tables listed in the **Custom logs** category on the **Tables** tab. The tables in this category are `ContainerAppSystemLogs_CL` and `ContainerAppConsoleLogs_CL`.

:::image type="content" source="media/observability/log-analytics-query-page.png" alt-text="Screenshot of the Log Analytics custom log tables.":::

The following Kusto query displays console log entries for the container app named *album-api*. 

```kusto
ContainerAppConsoleLogs_CL
| where ContainerAppName_s == 'album-api'
| project Time=TimeGenerated, AppName=ContainerAppName_s, Revision=RevisionName_s, Container=ContainerName_s, Message=Log_s
| take 100
```

The following Kusto query displays system log entries for the container app named *album-api*. 

```kusto
ContainerAppSystemLogs_CL
| where ContainerAppName_s == 'album-api'
| project Time=TimeGenerated, EnvName=EnvironmentName_s, AppName=ContainerAppName_s, Revision=RevisionName_s, Message=Log_s
| take 100
```

For more information about Log Analytics and log queries, see the [Log Analytics tutorial](/azure/azure-monitor/logs/log-analytics-tutorial).

### Azure CLI/PowerShell

Container Apps logs can be queried using the [Azure CLI](/cli/azure/monitor/log-analytics).

These example Azure CLI queries output a table containing log records for the container app name **album-api**. The parameters after the `project` operator specify the table columns. The `$WORKSPACE_CUSTOMER_ID` variable contains the GUID of the Log Analytics workspace.


This example queries the `ContainerAppConsoleLogs_CL` table:

# [Bash](#tab/bash)

```azurecli
az monitor log-analytics query --workspace $WORKSPACE_CUSTOMER_ID --analytics-query "ContainerAppConsoleLogs_CL | where ContainerAppName_s == 'album-api' | project Time=TimeGenerated, AppName=ContainerAppName_s, Revision=RevisionName_s, Container=ContainerName_s, Message=Log_s, LogLevel_s | take 5" --out table
```

# [PowerShell](#tab/powershell)

```powershell
$queryResults = Invoke-AzOperationalInsightsQuery -WorkspaceId $WORKSPACE_CUSTOMER_ID -Query "ContainerAppConsoleLogs_CL | where ContainerAppName_s == 'album-api' | project Time=TimeGenerated, AppName=ContainerAppName_s, Revision=RevisionName_s, Container=ContainerName_s, Message=Log_s, LogLevel_s | take 5"
$queryResults.Results
```

---

This example queries the `ContainerAppSystemLogs_CL` table:

# [Bash](#tab/bash)

```azurecli
az monitor log-analytics query --workspace $WORKSPACE_CUSTOMER_ID --analytics-query "ContainerAppSystemLogs_CL | where ContainerAppName_s == 'album-api' | project Time=TimeGenerated, AppName=ContainerAppName_s, Revision=RevisionName_s, Message=Log_s, LogLevel_s | take 5" --out table
```

# [PowerShell](#tab/powershell)

```powershell
$queryResults = Invoke-AzOperationalInsightsQuery -WorkspaceId $WORKSPACE_CUSTOMER_ID -Query "ContainerAppSystemLogs_CL | where ContainerAppName_s == 'album-api' | project Time=TimeGenerated, AppName=ContainerAppName_s, Revision=RevisionName_s, Message=Log_s, LogLevel_s | take 5"
$queryResults.Results
```

---

## Next steps

> [!div class="nextstepaction"]
> [View log streams from the Azure portal](log-streaming.md)
