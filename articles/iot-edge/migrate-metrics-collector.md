---
title: Migrate the metrics collector to Logs Ingestion - Azure IoT Edge
description: Upgrade to Metrics Collector 2.0 and migrate authentication, module configuration, queries, saved workbooks, and alert rules.
author: sethmanheim
ms.author: sethm
ms.date: 09/16/2026
ms.topic: how-to
ms.service: azure-iot-edge
services: iot-edge
---

# Migrate the IoT Edge metrics collector to Logs Ingestion

Metrics Collector 2.0 sends metrics to Azure Monitor through the Logs Ingestion API. This guide upgrades an existing direct-upload deployment to version `2.0.0`.

The migration changes authentication, module configuration, the destination table, and query scope. A module upgrade doesn't update saved workbooks or alert rules.

For a new deployment, start with [Monitor IoT Edge devices](tutorial-monitor-with-workbooks.md).

Azure Monitor ends support for the HTTP Data Collector API on **September 14, 2026**. This date isn't an immediate ingestion shutdown. For retirement details and platform migration procedures, see [Migrate from the HTTP Data Collector API](/azure/azure-monitor/logs/custom-logs-migrate).

## Understand what changes

The comparison uses the pass-through custom-table schema in this guide.

| Configuration or data | Collector 1.x | Collector 2.0 |
| --- | --- | --- |
| Direct upload | HTTP Data Collector API | Logs Ingestion API |
| Authentication | Workspace ID and shared key | Microsoft Entra identity with permission to publish to a data collection rule (DCR) |
| Destination | Built-in `InsightsMetrics` table | DCR-based custom table, `IoTEdgeMetrics_CL` in this guide |
| Numeric value | `Val` | `Value` |
| Resource ID | Platform `_ResourceId` | Ordinary `ResourceId`, with the case supplied in `ResourceId` |
| Queries in this guide | Legacy resource or workspace queries | Workspace queries with an explicit resource filter |

`UploadTarget=IotMessage` still sends metrics through edgeHub to IoT Hub or IoT Central. The collector upgrade doesn't migrate downstream services that process these messages.

## Prepare the migration

1. Inventory the devices, deployment configurations, saved workbooks, and alert rules that use the legacy metrics.
1. Back up the deployment configuration through your secure configuration-management process.
1. Save an unchanged copy of each customized workbook.
1. Choose a representative device for the first upgrade.
1. Plan a UTC cutover boundary for each device group that you upgrade together.

Keep existing `InsightsMetrics` history. The new DCR doesn't copy or convert that history.

### Prepare Azure Monitor resources

Use the [Logs Ingestion portal tutorial](/azure/azure-monitor/logs/tutorial-logs-ingestion-portal) to create the custom table and DCR. Use the collector schema in the next section instead of the tutorial's sample schema.

The [Logs Ingestion API overview](/azure/azure-monitor/logs/logs-ingestion-api-overview) describes endpoint selection, regional requirements, permissions, and service limits. Use a direct DCR endpoint or a data collection endpoint (DCE) as required by your network configuration.

Record these values:

- The destination Log Analytics workspace.
- The DCR logs-ingestion endpoint or DCE logs-ingestion endpoint.
- The DCR immutable ID, which starts with `dcr-`.
- The DCR input-stream name.
- The IoT Hub or IoT Central application ARM resource ID.

Grant the collector identity **Monitoring Metrics Publisher** on the DCR. Give workbook users query access to the destination workspace. These permissions are separate.

### Configure the collector schema

Use the following columns in the DCR input stream and destination table. Configure the DCR to pass these fields through without renaming them.

| Column | Type | Meaning |
| --- | --- | --- |
| `TimeGenerated` | `datetime` | Scrape event time. |
| `Origin` | `string` | Collector origin, `iot.azm.ms`. |
| `Namespace` | `string` | Metric namespace. |
| `Name` | `string` | Metric name. |
| `Value` | `real` | Finite numeric metric value. |
| `Tags` | `string` | JSON-encoded metric dimensions. |
| `ResourceId` | `string` | IoT Hub or application ARM resource ID. |

This guide and the curated workbooks use `IoTEdgeMetrics_CL` by default. You can use another custom table with the same columns and types. Select its name with the workbook's `MetricsTableName` parameter.

This guide uses `Custom-IoTEdgeMetrics` as the input-stream name. The collector doesn't enforce either name. If you choose another table, update the DCR destination and the table references in example queries and alert rules.

Use this JSON sample to define the schema in the table-creation wizard:

```json
[
  {
    "TimeGenerated": "2026-09-11T12:00:00Z",
    "Origin": "iot.azm.ms",
    "Namespace": "metricsmodule",
    "Name": "edgeAgent_total_time_running_correctly_seconds",
    "Value": 300.0,
    "Tags": "{\"edge_device\":\"example-device\",\"module_name\":\"edgeHub\",\"instance_number\":\"example-instance\"}",
    "ResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/example-rg/providers/Microsoft.Devices/IotHubs/example-hub"
  }
]
```

Preserve the scrape timestamp and all metric dimensions. For built-in table capabilities, see [Azure Monitor table feature support](/azure/azure-monitor/reference/tables-features).

### Understand resource matching and query scope

Legacy `InsightsMetrics._ResourceId` can use different casing from the configured ARM ID. The new ordinary `ResourceId` preserves the case supplied in the module's `ResourceId` configuration.

Apply `tolower()` to both the selected ARM ID and stored resource IDs before filtering or grouping. Keep the existing ARM ID in the module configuration.

This guide keeps `ResourceId` as an ordinary column in a pass-through schema. With this configuration, query the **Log Analytics workspace** and filter `ResourceId` for the intended resource.

Azure Monitor also supports resource association for custom logs that indicate a resource ID during ingestion. See [Standard columns in Azure Monitor logs](/azure/azure-monitor/logs/log-standard-columns#_resourceid-column). A query-time alias does not change ingestion-time resource association or access permissions.

## Configure authentication

The collector tries these credential types in order:

1. `EnvironmentCredential`, for an application certificate or client secret.
1. `WorkloadIdentityCredential`, for a federated token.
1. `ManagedIdentityCredential`, for a host identity.

The collector doesn't use an Azure CLI, Visual Studio, or PowerShell sign-in on the host. Configure only one application credential method. For example, remove `AZURE_CLIENT_SECRET` when you use a certificate so that a stale secret doesn't prevent the collector from trying the certificate or a later credential type.

### Certificate authentication

Use an application registration in the tenant that contains the DCR. For certificate registration, see [Add credentials to an application](/entra/identity-platform/howto-create-service-principal-portal#option-1-recommended-upload-a-trusted-certificate-issued-by-a-certificate-authority).

1. Grant the application's service principal **Monitoring Metrics Publisher** on the DCR.
1. Deliver its certificate and private key through your secure certificate-management process.
1. Mount the certificate file read-only inside the collector container.
1. Give the container process read access to the file without granting other users access.
1. Add these environment variables to the module:

```text
AZURE_TENANT_ID=<tenant-id>
AZURE_CLIENT_ID=<application-client-id>
AZURE_CLIENT_CERTIFICATE_PATH=/run/secrets/metrics-collector/client.pfx
```

The path refers to the file inside the container. Use your secure secret-delivery mechanism for certificate passwords or client secrets. Don't place private key content in a deployment manifest.

Plan certificate renewal and distribution before the certificate expires. For credential configuration, see [EnvironmentCredential](/dotnet/api/azure.identity.environmentcredential).

### Client-secret authentication

Use an application registration in the tenant that contains the DCR. Grant its service principal **Monitoring Metrics Publisher** on the DCR. [Create a client secret](/entra/identity-platform/howto-create-service-principal-portal#option-3-create-a-new-client-secret) and use its **value**, not its ID.

> [!WARNING]
> The deployment manifest and the `$edgeAgent` module twin contain the client secret in plain text. Anyone with read access to that configuration can read the secret. Don't commit a manifest that contains a secret to source control. Prefer certificate authentication or workload identity federation for production.

Set the collector module's environment variables in your deployment manifest. Replace the example values with your tenant ID, application client ID, and client secret value:

```json
"env": {
  "AZURE_TENANT_ID": { "value": "<tenant-id>" },
  "AZURE_CLIENT_ID": { "value": "<application-client-id>" },
  "AZURE_CLIENT_SECRET": { "value": "<client-secret-value>" }
}
```

Rotate the secret before it expires. After you verify ingestion with the replacement, revoke the old secret.

### Managed identity

On an Azure virtual machine, direct managed identity is the simplest option when the collector container can reach the host's identity endpoint. Assign **Monitoring Metrics Publisher** on the DCR to that identity.

- For a system-assigned identity, leave `AZURE_CLIENT_ID` unset.
- For a user-assigned identity, set `AZURE_CLIENT_ID` to its client ID.

An IoT Edge device identity isn't an Azure managed identity. Check host and container access requirements in [ManagedIdentityCredential](/dotnet/api/azure.identity.managedidentitycredential).

### Workload identity federation

The collector uses a federated assertion from a token file through `WorkloadIdentityCredential`. It doesn't create or refresh the assertion file.

Set `AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, and `AZURE_FEDERATED_TOKEN_FILE`. Give the application's service principal **Monitoring Metrics Publisher** on the DCR. The token-file producer must refresh the assertion before it expires and keep the file readable by the collector process.

For an Azure VM, see [Configure an application to trust a managed identity](/entra/workload-id/workload-identity-federation-config-app-trust-managed-identity). For other supported issuers, see [Workload identity federation](/entra/workload-id/workload-identity-federation).

## Update the module

Use [Set modules on an IoT Edge device](how-to-deploy-modules-portal.md) to update the existing collector module.

1. Set its image to `mcr.microsoft.com/azureiotedge-metrics-collector:2.0.0`.
1. Replace the legacy workspace configuration with the following environment variables.

   | Environment variable | Value |
   | --- | --- |
   | `UploadTarget` | `AzureMonitor` |
   | `DataCollectionEndpoint` | HTTPS logs-ingestion base endpoint, not an ARM ID or a constructed API request URL. |
   | `DataCollectionRuleId` | DCR immutable ID, not its name or ARM ID. |
   | `DataCollectionStreamName` | Exact input-stream name, such as `Custom-IoTEdgeMetrics`, not the destination table name. |
   | `ResourceId` | Existing IoT Hub or IoT Central application ARM resource ID. |
   | `AzureDomain` | `azure.com` for public Azure, `azure.us` for Azure Government, or `azure.cn` for Azure China. |

1. Add the authentication configuration for your selected identity.
1. Retain `MetricsEndpointsCSV`, `ScrapeFrequencyInSecs`, `AllowedMetrics`, and `BlockedMetrics` as required by your deployment.
1. Remove `LogAnalyticsWorkspaceId` and `LogAnalyticsSharedKey` from this module.
1. Allow access to the configured ingestion endpoint and the identity endpoints required by your authentication method.
1. Apply the deployment to the first device.

The ingestion endpoint must match the cloud selected by `AzureDomain`. For proxy configuration, see [Proxy considerations](how-to-collect-and-transport-metrics.md#proxy-considerations).

## Check new ingestion

Open **Logs** in the destination workspace. Replace the example ARM ID with your resource ID in each query. If you use another table name, replace it throughout the examples.

```kusto
let SelectedResourceId = tolower("/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/example-rg/providers/Microsoft.Devices/IotHubs/example-hub");
IoTEdgeMetrics_CL
| where TimeGenerated > ago(15m) and Origin == "iot.azm.ms"
| where tolower(ResourceId) == SelectedResourceId
| extend Dimensions = parse_json(Tags)
| summarize Rows = count(), FirstEvent = min(TimeGenerated),
    LastEvent = max(TimeGenerated), MetricNames = dcount(Name),
    Series = dcount(strcat(Name, "|", Tags)),
    NullValues = countif(isnull(Value)),
    MissingDevice = countif(isempty(tostring(Dimensions.edge_device)))
```

Check module upload logs, recent event timestamps, expected metric names, and device dimensions. Check that `NullValues` and `MissingDevice` are zero for the built-in metrics.

Metrics Collector 2.0 omits `NaN` and infinity values from direct uploads. Finite `_sum` and `_count` samples can remain even when a summary's base sample is absent.

An accepted upload doesn't prove that every value has the expected type. Check null values and event timestamps as well as upload success.

Check for duplicate event keys:

```kusto
let SelectedResourceId = tolower("/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/example-rg/providers/Microsoft.Devices/IotHubs/example-hub");
IoTEdgeMetrics_CL
| where TimeGenerated > ago(1h) and Origin == "iot.azm.ms"
| extend ResourceId = tolower(ResourceId)
| where ResourceId == SelectedResourceId
| summarize Copies = count() by TimeGenerated, Name, Tags, ResourceId
| where Copies > 1
| order by Copies desc
```

No results means that the query found no duplicate groups in that time window. Upload retries can produce duplicate rows after a partial success. Don't assume exactly-once delivery.

## Switch workbooks to the new data

1. Open a curated workbook from **Monitoring** > **Workbooks** in your IoT Hub or IoT Central application.
1. Select the **Metrics Log Analytics workspace** that contains your metrics.
1. Select the intended IoT resource and time range.
1. Confirm that **Metrics source** is **New only**. If you open an older saved copy that still defaults to **Legacy only**, change it to **New only**.
1. Set `MetricsTableName` to your destination table, or keep the default `IoTEdgeMetrics_CL`.
1. Check the device list and the expected metric charts.

The updated gallery templates default to **New only**, which reads only the selected custom table and doesn't require a cutover time. If a caller omits or clears `MetricsTableName`, the workbook uses `IoTEdgeMetrics_CL`. An invalid name displays an error and also uses this default until you correct it. **Legacy only** always reads `InsightsMetrics`. Existing saved copies keep their saved settings.

To view both histories, select **Combine legacy and new history**. The workbook then shows **Cutover time (UTC)**. Enter the actual boundary in `YYYY-MM-DDTHH:mm:ssZ` format.

Combine mode reads legacy data before the boundary and new data at or after it. It uses one boundary for the selected resources. If devices have different boundaries, use separate selections or customize the queries for each device group.

For workbook views and saved copies, see [Explore curated visualizations](how-to-explore-curated-visualizations.md).

## Preserve history in custom queries

Keep `InsightsMetrics` history for its retention period. Use the actual event-time boundary, not the time that you opened the workbook.

Replace the illustrative `2026-09-11T12:00:00Z` boundary in this example. Select a time range that includes the boundary. This query requires both tables. For a single-table workspace, use only its corresponding branch.

```kusto
let Cutover = datetime(2026-09-11T12:00:00Z);
let SelectedResourceId = tolower("/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/example-rg/providers/Microsoft.Devices/IotHubs/example-hub");
let EdgeMetrics = union
(
    InsightsMetrics
    | where Origin == "iot.azm.ms" and TimeGenerated < Cutover
    | project TimeGenerated, Name, Val, Tags,
        ResourceId = tolower(_ResourceId), SourceTable = "InsightsMetrics"
),
(
    IoTEdgeMetrics_CL
    | where Origin == "iot.azm.ms" and TimeGenerated >= Cutover
    | project TimeGenerated, Name, Val = Value, Tags,
        ResourceId = tolower(ResourceId), SourceTable = "IoTEdgeMetrics_CL"
);
EdgeMetrics
| where TimeGenerated > ago(7d) and ResourceId == SelectedResourceId
| extend Device = tostring(parse_json(Tags).edge_device)
| summarize Rows = count(), FirstEvent = min(TimeGenerated),
    LastEvent = max(TimeGenerated) by ResourceId, Device, SourceTable
```

Both branches expose lowercase `ResourceId` and numeric `Val`. Lowercasing the selected ID and both resource columns keeps one resource in one group.

The boundary excludes overlapping history, but it doesn't remove retries within a table. Preserve all series dimensions, event-time order, counter-reset handling, and histogram `_sum` and `_count` pairs.

Use suitable time bins to combine edgeAgent and edgeHub cycles. Their scrape timestamps can differ within one collection cycle.

### Update no-data checks

A query that checks only `InsightsMetrics` can hide new metrics. Update every no-data check and device-selection query, not only chart queries.

This example requires both tables and uses the same replacement values as the preceding query:

```kusto
let Cutover = datetime(2026-09-11T12:00:00Z);
let SelectedResourceId = tolower("/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/example-rg/providers/Microsoft.Devices/IotHubs/example-hub");
print
    LegacyHasData = toscalar(
        InsightsMetrics
        | where Origin == "iot.azm.ms" and TimeGenerated > ago(7d) and TimeGenerated < Cutover
        | where tolower(_ResourceId) == SelectedResourceId
        | take 1 | count) > 0,
    NewHasData = toscalar(
        IoTEdgeMetrics_CL
        | where Origin == "iot.azm.ms" and TimeGenerated > ago(7d) and TimeGenerated >= Cutover
        | where tolower(ResourceId) == SelectedResourceId
        | take 1 | count) > 0
| extend HasData = LegacyHasData or NewHasData,
    TransitionHasData = LegacyHasData and NewHasData
```

For a single-table workspace, omit the branch for the absent table. Treat query permission errors separately from an empty result.

## Update saved workbooks and alerts

Public template updates don't change workbooks that you previously saved or customized. Work on a separate copy before replacing a saved workbook.

1. Select the workspace as the execution scope for metric queries.
1. Normalize resource IDs and value columns in every metric query, parameter query, and no-data check.
1. Preserve custom metrics, dimensions, thresholds, counter-reset logic, and histogram pairs.
1. Update drill-through links to pass workspace, resource, device, time range, source mode, table name, and cutover time.
1. Check Legacy, New, and Combine modes before replacing the saved copy.

Alert rules are separate resources. Update their queries and workspace scope through [Create alerts](how-to-create-alerts.md). Check device dimensions, target resources, thresholds, firing, resolution, and notification delivery. Avoid duplicate notifications from legacy and new rules during the transition.

## Complete the rollout

1. Check the new data, workbooks, and alerts for the first device.
1. Expand the deployment to the next device group.
1. Record the actual cutover boundary for each group.
1. Remove unused workspace credentials from your deployment system after all dependent consumers migrate.

> [!IMPORTANT]
> Keep both tables and your deployment backup until the migration is complete. Don't delete shared credentials while another collector or cloud workflow still needs them.

If ingestion fails, pause the rollout and use [Monitoring troubleshooting](how-to-troubleshoot-monitoring-and-faq.md). Don't assume that the collector replays failed upload intervals.

If you restore a legacy deployment, account for those resumed legacy intervals in your queries. A single forward cutover boundary excludes them. Restoring the old configuration doesn't extend support for the retired API.

## Next steps

- [Explore curated visualizations](how-to-explore-curated-visualizations.md).
- [Create alert rules](how-to-create-alerts.md).
- [Add custom metrics](how-to-add-custom-metrics.md).
