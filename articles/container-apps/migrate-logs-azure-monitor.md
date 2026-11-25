---
title: Change Container Apps logging from Log Analytics to Azure Monitor
description: Learn how to switch an Azure Container Apps environment from the Log Analytics logging destination to Azure Monitor without moving historical logs.
author: jefmarti
ms.author: jefmarti
ms.service: azure-container-apps
ms.topic: how-to
ms.date: 08/12/2026
zone_pivot_groups: azure-cli-or-portal
---

# Change Azure Container Apps logging from Log Analytics to Azure Monitor

The legacy **Log Analytics** logging destination for Azure Container Apps uses the [Azure Monitor HTTP Data Collector API](/previous-versions/azure/azure-monitor/logs/data-collector-api?tabs=powershell) and writes application console and system logs to the custom `ContainerAppConsoleLogs_CL` and `ContainerAppSystemLogs_CL` tables. The [HTTP Data Collector API is on the deprecation path](/azure/azure-monitor/logs/custom-logs-migrate?tabs=cli), and support ends on September 14, 2026.

Existing ingestion continues for TLS-compliant clients, but the API receives only critical security fixes after that date. To avoid disruption, change the environment's logging destination to Azure Monitor.

If your application calls the HTTP Data Collector API directly, follow [Migrate from the HTTP Data Collector API to the Logs Ingestion API](/azure/azure-monitor/logs/custom-logs-migrate?tabs=cli). If you use both ingestion paths, complete both migrations.

Applications that write logs to `stdout` or `stderr` and use Azure Container Apps platform logging don't typically require code changes.

> [!IMPORTANT]
> Azure Monitor is currently unavailable as a logging destination for Express environments. This migration doesn't apply to Container Apps environments that use the Express environment mode.

## Prerequisites

Before you change the logging destination, you need:

- An existing Container Apps environment that uses the **Log Analytics** logging destination.
- The Log Analytics workspace that currently contains `ContainerAppConsoleLogs_CL` and `ContainerAppSystemLogs_CL`.
- Permission to update the Container Apps environment.
- The `Microsoft.Insights` resource provider registered in the subscription that contains the environment, or permission to register it.
- Permission to create or update diagnostic settings at the environment scope and permission to use the selected destination. If the environment and destination are in different subscriptions, you need the required permissions in both subscriptions.
- Access to the existing Log Analytics workspace and permission to retrieve its customer ID and shared key if you need to roll back.
- If you use Azure CLI, the [latest Azure CLI](/cli/azure/install-azure-cli) and Container Apps extension. Sign in with [`az login`](/cli/azure/authenticate-azure-cli-interactively), and then update the extension:

  ```azurecli
  az extension add --name containerapp --upgrade
  ```

If you later create a Log Analytics workspace function to combine historical and new records, you also need permission to save functions in that workspace.

## Plan for the monitoring transition

You can continue to use the same Log Analytics workspace, but you must select it in the diagnostic setting. Azure Monitor doesn't infer or preserve the workspace association from the Log Analytics logging destination.

| Before the change | After the change |
| --- | --- |
| Workspace: your existing Log Analytics workspace | Workspace: the workspace you select in the diagnostic setting |
| Console logs: `ContainerAppConsoleLogs_CL` | Console logs: `ContainerAppConsoleLogs` |
| System logs: `ContainerAppSystemLogs_CL` | System logs: `ContainerAppSystemLogs` |

Changing the logging destination switches routing immediately. Resource logs aren't sent until a diagnostic setting routes them. Plan accordingly because the setting can take up to 90 minutes to activate. If you create it immediately after switching, console logs generated before its creation are buffered and backfilled. Also, alerts that query the `_CL` tables stop receiving new data as soon as the environment switches destinations.

To manage this monitoring gap, follow these steps:

1. Schedule a maintenance window and notify the teams that respond to log alerts.
1. Inventory every query, alert, workbook, dashboard, and automation dependency that uses an `_CL` table.
1. Prepare replacement queries and alert definitions for the resource-specific tables before the maintenance window.
1. Start canary traffic that writes a unique, timestamped marker to `stdout` every five minutes. Start the canary before the change so you can distinguish prechange and postchange records.
1. Verify that you can create a diagnostic setting with a unique name, or prepare a complete update that preserves every property of an existing setting.
1. Switch the logging destination, and then immediately apply the prepared diagnostic setting.
1. Query for fresh canary markers every five minutes after you apply the setting. While you validate routing, use [log streaming](log-streaming.md), [Container Apps metrics](metrics.md), your existing health checks, and the [Azure Activity Log](/azure/azure-monitor/essentials/activity-log).
1. Continue only after at least two postchange canary markers arrive with increasing timestamps and the newest marker is no more than 10 minutes old. Then enable and test replacement alerts before retiring the old alerts.
1. If no fresh canary marker arrives after the 90-minute maximum activation time, don't proceed with the alert cutover. Keep the maintenance window open while you diagnose the route, or use the rollback procedure.

## Change the logging destination

### 1. Inventory dependencies

Search your monitoring resources and automation for these table names:

- `ContainerAppConsoleLogs_CL`
- `ContainerAppSystemLogs_CL`

Record each dependency so you can update and test it after records reach the resource-specific tables. Don't change the existing alerts yet. First, prepare their replacements and plan how you'll monitor the workload during the transition.

A text search alone isn't sufficient. Review workspace functions and aliases, generated queries, infrastructure-as-code templates, deployment pipelines, SIEM rules, and external monitoring integrations that might hide or construct the table names.

### 2. Switch to Azure Monitor and configure routing

Change the environment's logging destination, and then create or update an Azure Monitor diagnostic setting. You need to perform both actions. Changing the logging destination alone doesn't route logs to a Log Analytics workspace.

::: zone pivot="azure-portal"

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the search box, enter **Container Apps Environments**, and then select **Container Apps Environments**.
1. Select the environment that you want to change.
1. Select **Monitoring** > **Logging options**.
1. Under **Logs Destination**, select **Azure Monitor**.
1. Select **Save**.
1. Wait for the update to finish, and then refresh the environment page. **Diagnostic settings** should then appear in the left menu.
1. Select **Monitoring** > **Diagnostic settings**.
1. Complete one of the following actions:
   - To create a setting, select **Add diagnostic setting** and enter a name.
   - To change an existing setting, select **Edit setting**.
1. Under **Logs**, select at least **Container App console logs** and **Container App system logs**. Alternatively, under **Category groups**, select **allLogs** to route every available log category.
1. Under **Destination details**, select **Send to Log Analytics workspace**.
1. Select the subscription and existing Log Analytics workspace that contain `ContainerAppConsoleLogs_CL` and `ContainerAppSystemLogs_CL`.
1. Optionally, select additional destinations.
1. Select **Save**.
1. Return to **Diagnostic settings** and verify that the setting lists the expected categories and destination.

::: zone-end

::: zone pivot="azure-cli"

Select the subscription that contains the Container Apps environment:

```azurecli
az account set --subscription <ENVIRONMENT_SUBSCRIPTION_ID>
```

Register the `Microsoft.Insights` resource provider and wait for registration to finish:

```azurecli
az provider register --namespace Microsoft.Insights --wait
```

Get the environment resource ID before you change the logging destination:

```azurecli
az containerapp env show \
  --name <ENVIRONMENT_NAME> \
  --resource-group <RESOURCE_GROUP_NAME> \
  --query id \
  --output tsv
```

Inspect the existing diagnostic settings in full JSON:

```azurecli
az monitor diagnostic-settings list \
  --resource <ENVIRONMENT_RESOURCE_ID> \
  --output json
```

Count the existing settings to confirm that the environment has capacity for a new one:

```azurecli
az monitor diagnostic-settings list \
  --resource <ENVIRONMENT_RESOURCE_ID> \
  --query "length(@)" \
  --output tsv
```

Verify the supported diagnostic categories:

```azurecli
az monitor diagnostic-settings categories list \
  --resource <ENVIRONMENT_RESOURCE_ID> \
  --output json
```

Get the ARM resource ID of the destination workspace. Specify the workspace subscription explicitly, even when it matches the environment subscription:

```azurecli
az monitor log-analytics workspace show \
  --subscription <WORKSPACE_SUBSCRIPTION_ID> \
  --resource-group <WORKSPACE_RESOURCE_GROUP_NAME> \
  --workspace-name <WORKSPACE_NAME> \
  --query id \
  --output tsv
```

Before the change over, confirm that:

- The account can update the environment and create diagnostic settings at the environment scope.
- The account can use the destination workspace, including when it is in another subscription.
- The environment has fewer than five diagnostic settings if you plan to create a new setting.
- `ContainerAppConsoleLogs` and `ContainerAppSystemLogs` appear in the category output.
- You have chosen a unique setting name and prepared the command that you'll run immediately after the cutover.

If you must edit an existing setting, preserve all its log categories, metric categories, destinations, and destination-specific options. Export and review the full setting first, and prepare a complete [ARM or REST update](/rest/api/monitor/diagnostic-settings/create-or-update). Don't use the partial CLI example that follows to overwrite an existing setting.

Switch the environment to Azure Monitor:

```azurecli
az containerapp env update \
  --name <ENVIRONMENT_NAME> \
  --resource-group <RESOURCE_GROUP_NAME> \
  --logs-destination azure-monitor
```

Immediately create the prepared setting with a new, unique name. Select the same Log Analytics workspace that contains the custom tables.

```azurecli
az monitor diagnostic-settings create \
  --name <NEW_UNIQUE_DIAGNOSTIC_SETTING_NAME> \
  --resource <ENVIRONMENT_RESOURCE_ID> \
  --logs '[{"category":"ContainerAppConsoleLogs","enabled":true},{"category":"ContainerAppSystemLogs","enabled":true}]' \
  --workspace <LOG_ANALYTICS_WORKSPACE_RESOURCE_ID>
```

To route every available log category, replace the `--logs` value with `'[{"categoryGroup":"allLogs","enabled":true}]'`.

::: zone-end

A resource can have up to five diagnostic settings. To change an existing setting, or if the environment already has five settings, edit the setting in the Azure portal or submit a complete ARM or REST update. In either case, preserve every existing log and metric category and every destination, including Log Analytics workspaces, storage accounts, and event hubs. Storage accounts and event hubs have extra regional, network, and authorization requirements. Review [Diagnostic settings in Azure Monitor](/azure/azure-monitor/essentials/diagnostic-settings) before you add these destinations.

> [!TIP]
> Log ingestion and destination charges can apply. Select only the categories and destinations that you need. Choose **allLogs** only when you intend to route every available log category.

### 3. Validate log collection

Diagnostic-setting changes can take up to 90 minutes to begin sending data. Generate application traffic that writes a recognizable console message. In the workspace selected in the diagnostic setting, run the following query. Replace `<ENVIRONMENT_NAME>` with the environment name.

```kusto
ContainerAppConsoleLogs
| where TimeGenerated > ago(2h)
| where _ResourceId contains "<ENVIRONMENT_NAME>"
| where Log contains "<CANARY_MARKER_PREFIX>"
| project TimeGenerated, ContainerAppName, RevisionName, ContainerName, Stream, Log
| order by TimeGenerated desc
| take 20
```

Keep the canary running and repeat the query every five minutes. Continue when at least two markers generated after the change appear with increasing timestamps and the newest marker is no more than 10 minutes old.

Run the system-log query separately:

```kusto
ContainerAppSystemLogs
| where TimeGenerated > ago(2h)
| where _ResourceId contains "<ENVIRONMENT_NAME>"
| project TimeGenerated, ContainerAppName, RevisionName, ReplicaName, Reason, Log
| order by TimeGenerated desc
| take 20
```

System logs appear only when Container Apps produces a platform event. An empty result doesn't establish that routing failed if no system event occurred. Don't make a disruptive production change only to generate a system event. For the go decision, use console-canary arrival and backfill plus configuration evidence: the environment uses the **Azure Monitor** logging destination, the diagnostic setting is enabled for the expected categories, and the setting points to the intended workspace. Confirm the system-log category when the next natural platform event occurs. System-log backfill isn't guaranteed.

If console records don't appear after 90 minutes:

1. Confirm that the environment uses the **Azure Monitor** logging destination.
1. Confirm that the diagnostic setting is enabled for `ContainerAppConsoleLogs`.
1. Confirm that the setting points to the intended workspace.
1. Check Azure activity logs for diagnostic-setting or authorization errors.

Console logs generated in a short window before you created the diagnostic setting, are backfilled when you create the setting immediately after the switch. Azure doesn't guarantee backfill for records outside that window or for records generated during a longer diagnostic-setting activation delay.

### 4. Update queries and alerts

After new records appear, update saved queries, alerts, workbooks, dashboards, and automation to use the resource-specific tables.

| Custom table | Resource-specific table |
| --- | --- |
| `ContainerAppConsoleLogs_CL` | `ContainerAppConsoleLogs` |
| `ContainerAppSystemLogs_CL` | `ContainerAppSystemLogs` |

Column names also change from typed suffixes, such as `_s` and `_g`, to standard Azure Monitor column names.

| Custom-table column | Resource-specific column |
| --- | --- |
| `ContainerAppName_s` | `ContainerAppName` |
| `RevisionName_s` | `RevisionName` |
| `ContainerName_s` | `ContainerName` |
| `Stream_s` | `Stream` |
| `Log_s` | `Log` |

For complete schemas, see the Azure Monitor table references for [`ContainerAppConsoleLogs`](/azure/azure-monitor/reference/tables/containerappconsolelogs) and [`ContainerAppSystemLogs`](/azure/azure-monitor/reference/tables/containerappsystemlogs).

For example, change this query:

```kusto
ContainerAppConsoleLogs_CL
| where ContainerAppName_s == "my-app"
| where Log_s contains "error"
| project TimeGenerated, Log_s, RevisionName_s
```

To use the resource-specific table and columns:

```kusto
ContainerAppConsoleLogs
| where ContainerAppName == "my-app"
| where Log contains "error"
| project TimeGenerated, Log, RevisionName
```

Enable and test the replacement alerts before you close the maintenance window. Confirm that action groups receive a test notification and that dashboards and workbooks display current data.

## Prepare queries for historical and new records

Changing the logging destination doesn't move historical data. Records in `ContainerAppConsoleLogs_CL` and `ContainerAppSystemLogs_CL` remain available for the workspace retention period. New records go to `ContainerAppConsoleLogs` and `ContainerAppSystemLogs` in the workspace selected in the diagnostic setting.

Don't treat a sample projection as a complete compatibility schema. Custom and resource-specific tables can have different columns and data types. Inspect the schemas in your workspace before you write a [`union`](/kusto/query/union-operator) or save a workspace function:

```kusto
ContainerAppConsoleLogs_CL
| getschema
```

```kusto
ContainerAppConsoleLogs
| getschema
```

Repeat the schema check for `ContainerAppSystemLogs_CL` and `ContainerAppSystemLogs`. Compare the columns used by each dependent query. Project only the columns that dependency needs, assign the same output names on both sides, and normalize each differing type explicitly with conversion functions such as [`tostring()`](/kusto/query/tostring-function) or [`todatetime()`](/kusto/query/todatetime-function).

Test the combined query across representative historical and new records before you use it in an alert, workbook, dashboard, or automation. If you save the tested query for reuse, follow [Create a function in Azure Monitor log queries](/azure/azure-monitor/logs/functions) and enter the function alias when you save it.

### Structured JSON logs

The Azure Monitor logging destination doesn't support `dynamicJsonColumns`, so the migration disables it. If your queries depend on dynamically created JSON columns, update them to parse the JSON payload explicitly.

Rolling back to the Log Analytics destination restores only the workspace customer ID and shared key. It doesn't re-enable `dynamicJsonColumns`. If you need dynamic JSON columns on the Log Analytics destination, reconfigure that behavior separately. Validate the log shape and every dependent query after rollback.

If your application writes structured JSON to `stdout`, parse the `Log` column:

```kusto
ContainerAppConsoleLogs
| extend Parsed = parse_json(Log)
| where tostring(Parsed.level) == "Error"
```

Validate rewritten structured-log queries before you update alerts, workbooks, and dashboards.

## Optional: Query historical and new logs together

Use this section only if a query must return both historical records from the custom tables and new records from the Azure Monitor resource-specific tables.

During migration, historical logs stay in `ContainerAppConsoleLogs_CL` and `ContainerAppSystemLogs_CL`, while new logs go to `ContainerAppConsoleLogs` and `ContainerAppSystemLogs`. You can query both sets of data by creating reusable Log Analytics workspace functions.

Two compatibility approaches are available:

1. **Preserve the custom-table schema** by projecting Azure Monitor columns to the column names used by `ContainerAppConsoleLogs_CL` and `ContainerAppSystemLogs_CL`. Use this approach to minimize changes to existing queries, alerts, workbooks, and dashboards.

1. **Adopt the Azure Monitor schema** by projecting columns from `ContainerAppConsoleLogs_CL` and `ContainerAppSystemLogs_CL` to the Azure Monitor column names. This approach is recommended for long-term use.

> [!NOTE]
> These functions provide a unified query result only. They don't move or copy data. Logs routed through Azure Monitor remain in `ContainerAppConsoleLogs` and `ContainerAppSystemLogs`; they aren't written to `ContainerAppConsoleLogs_CL` or `ContainerAppSystemLogs_CL`.

### Option 1: Preserve the custom-table schema

This option combines historical and new records while preserving the custom-table column names. Use this option to minimize immediate changes to existing queries and other monitoring dependencies.

#### Create the console-log compatibility function

Run the following query and save it as a Log Analytics workspace function with the alias `ContainerAppConsoleLogsLegacyCompat`.

```kusto
union
(
    ContainerAppConsoleLogs_CL
    | project
        TimeGenerated,
        ContainerAppName_s,
        EnvironmentName_s,
        RevisionName_s,
        ContainerName_s,
        ContainerGroupName_s,
        ContainerImage_s,
        ContainerGroupId_g = tostring(ContainerGroupId_g),
        ContainerId_g = tostring(ContainerId_g),
        Stream_s,
        Log_s,
        _ResourceId,
        SourceTable = "ContainerAppConsoleLogs_CL"
),
(
    ContainerAppConsoleLogs
    | project
        TimeGenerated,
        ContainerAppName_s = ContainerAppName,
        EnvironmentName_s = EnvironmentName,
        RevisionName_s = RevisionName,
        ContainerName_s = ContainerName,
        ContainerGroupName_s = ContainerGroupName,
        ContainerImage_s = ContainerImage,
        ContainerGroupId_g = ContainerGroupId,
        ContainerId_g = ContainerId,
        Stream_s = Stream,
        Log_s = Log,
        _ResourceId,
        SourceTable = "ContainerAppConsoleLogs"
)
```

After you save the function, existing filters for `ContainerAppConsoleLogs_CL` can continue to use the `_s` and `_g` column names:

```kusto
ContainerAppConsoleLogsLegacyCompat()
| where TimeGenerated > ago(30m)
| where ContainerAppName_s == "my-app"
| where Log_s contains "error"
| project
    TimeGenerated,
    ContainerAppName_s,
    RevisionName_s,
    ContainerName_s,
    Stream_s,
    Log_s,
    SourceTable
| order by TimeGenerated desc
```

#### Create the system-log compatibility function

Run the following query and save it as a workspace function with the alias `ContainerAppSystemLogsLegacyCompat`.

```kusto
union
(
    ContainerAppSystemLogs_CL
    | project
        TimeGenerated,
        EnvironmentName_s,
        ContainerAppName_s,
        RevisionName_s,
        ReplicaName_s,
        JobName_s,
        Log_s,
        Reason_s,
        EventSource_s,
        Count_d,
        _ResourceId,
        SourceTable = "ContainerAppSystemLogs_CL"
),
(
    ContainerAppSystemLogs
    | project
        TimeGenerated,
        EnvironmentName_s = EnvironmentName,
        ContainerAppName_s = ContainerAppName,
        RevisionName_s = RevisionName,
        ReplicaName_s = ReplicaName,
        JobName_s = JobName,
        Log_s = Log,
        Reason_s = Reason,
        EventSource_s = EventSource,
        Count_d = todouble(Count),
        _ResourceId,
        SourceTable = "ContainerAppSystemLogs"
)
```

After you save the function, use it with the `ContainerAppSystemLogs_CL` column names:

```kusto
ContainerAppSystemLogsLegacyCompat()
| where TimeGenerated > ago(30m)
| where ContainerAppName_s == "my-app"
| where Log_s contains "error"
| project
    TimeGenerated,
    ContainerAppName_s,
    RevisionName_s,
    ReplicaName_s,
    Reason_s,
    EventSource_s,
    Count_d,
    Log_s,
    SourceTable
| order by TimeGenerated desc
```

### Option 2: Adopt the Azure Monitor schema

This option exposes records from the custom and resource-specific tables through the Azure Monitor resource-specific schema. Use it to migrate queries to column names without type suffixes.

#### Create the console-log compatibility function

Run the following query and save it as a workspace function with the alias `ContainerAppConsoleLogsStandardCompat`.

```kusto
union
(
    ContainerAppConsoleLogs_CL
    | project
        TimeGenerated,
        ContainerAppName = ContainerAppName_s,
        EnvironmentName = EnvironmentName_s,
        RevisionName = RevisionName_s,
        ContainerName = ContainerName_s,
        ContainerGroupName = ContainerGroupName_s,
        ContainerImage = ContainerImage_s,
        ContainerGroupId = tostring(ContainerGroupId_g),
        ContainerId = tostring(ContainerId_g),
        Stream = Stream_s,
        Log = Log_s,
        _ResourceId,
        SourceTable = "ContainerAppConsoleLogs_CL"
),
(
    ContainerAppConsoleLogs
    | project
        TimeGenerated,
        ContainerAppName,
        EnvironmentName,
        RevisionName,
        ContainerName,
        ContainerGroupName,
        ContainerImage,
        ContainerGroupId,
        ContainerId,
        Stream,
        Log,
        _ResourceId,
        SourceTable = "ContainerAppConsoleLogs"
)
```

After you save the function, query both tables by using the Azure Monitor column names:

```kusto
ContainerAppConsoleLogsStandardCompat()
| where TimeGenerated > ago(30m)
| where ContainerAppName == "my-app"
| where Log contains "error"
| project
    TimeGenerated,
    ContainerAppName,
    RevisionName,
    ContainerName,
    Stream,
    Log,
    SourceTable
| order by TimeGenerated desc
```

#### Create the system-log compatibility function

Run the following query and save it as a workspace function with the alias `ContainerAppSystemLogsStandardCompat`.

```kusto
union
(
    ContainerAppSystemLogs_CL
    | project
        TimeGenerated,
        EnvironmentName = EnvironmentName_s,
        ContainerAppName = ContainerAppName_s,
        RevisionName = RevisionName_s,
        ReplicaName = ReplicaName_s,
        JobName = JobName_s,
        Log = Log_s,
        Reason = Reason_s,
        EventSource = EventSource_s,
        Count = toint(Count_d),
        _ResourceId,
        SourceTable = "ContainerAppSystemLogs_CL"
),
(
    ContainerAppSystemLogs
    | project
        TimeGenerated,
        EnvironmentName,
        ContainerAppName,
        RevisionName,
        ReplicaName,
        JobName,
        Log,
        Reason,
        EventSource,
        Count = toint(Count),
        _ResourceId,
        SourceTable = "ContainerAppSystemLogs"
)
```

After you save the function, query both tables by using the Azure Monitor column names:

```kusto
ContainerAppSystemLogsStandardCompat()
| where TimeGenerated > ago(30m)
| where ContainerAppName == "my-app"
| where Log contains "error"
| project
    TimeGenerated,
    ContainerAppName,
    RevisionName,
    ReplicaName,
    Reason,
    EventSource,
    Count,
    Log,
    SourceTable
| order by TimeGenerated desc
```

## Roll back to Log Analytics

Roll back only if you can't restore required monitoring through Azure Monitor. Treat rollback as a short-term contingency while the Log Analytics destination remains available, not as a long-term alternative to completing the change before the HTTP Data Collector API retirement date.

A rollback starts writing new records to the custom tables again. It doesn't copy or backfill records from the resource-specific tables. Rolling back restores only the workspace customer ID and shared key. It doesn't re-enable `dynamicJsonColumns`. If you need dynamic JSON columns on the Log Analytics destination, reconfigure that behavior separately. Validate the log shape and every dependent query after rollback.

::: zone pivot="azure-portal"

1. Open the Container Apps environment.
1. Select **Monitoring** > **Logging options**.
1. Under **Logs Destination**, select **Log Analytics**.
1. Select the original Log Analytics workspace.
1. Select **Save**.
1. Verify that new records appear in `ContainerAppConsoleLogs_CL` and `ContainerAppSystemLogs_CL`.
1. Validate the log shape and every dependent query before you re-enable the corresponding alerts.

::: zone-end

::: zone pivot="azure-cli"

The `--logs-workspace-id` parameter requires the Log Analytics workspace customer ID GUID, not the workspace ARM resource ID.

Select the workspace subscription and retrieve the customer ID:

```azurecli
az account set --subscription <WORKSPACE_SUBSCRIPTION_ID>

az monitor log-analytics workspace show \
  --resource-group <WORKSPACE_RESOURCE_GROUP_NAME> \
  --workspace-name <WORKSPACE_NAME> \
  --query customerId \
  --output tsv
```

Retrieve the primary shared key. Protect this value as a secret:

```azurecli
az monitor log-analytics workspace get-shared-keys \
  --resource-group <WORKSPACE_RESOURCE_GROUP_NAME> \
  --workspace-name <WORKSPACE_NAME> \
  --query primarySharedKey \
  --output tsv
```

Select the environment subscription:

```azurecli
az account set --subscription <ENVIRONMENT_SUBSCRIPTION_ID>
```

Change the logging destination:

```azurecli
az containerapp env update \
  --name <ENVIRONMENT_NAME> \
  --resource-group <RESOURCE_GROUP_NAME> \
  --logs-destination log-analytics \
  --logs-workspace-id <LOG_ANALYTICS_WORKSPACE_CUSTOMER_ID> \
  --logs-workspace-key <LOG_ANALYTICS_WORKSPACE_KEY>
```

Verify that new records appear in `ContainerAppConsoleLogs_CL` and `ContainerAppSystemLogs_CL`. Validate the log shape and every dependent query before you re-enable the corresponding alerts.

::: zone-end

## Related content

- [Application logging in Azure Container Apps](logging.md)
- [Log storage and monitoring options in Azure Container Apps](log-options.md)
- [Migrate from the HTTP Data Collector API to the Logs Ingestion API](/azure/azure-monitor/logs/custom-logs-migrate)
- [Diagnostic settings in Azure Monitor](/azure/azure-monitor/essentials/diagnostic-settings)
