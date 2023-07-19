---
title: Monitor logs in Azure Container Apps with Log Analytics
description: Monitor your container app logs with Log Analytics
services: container-apps
author: v-jaswel
ms.service: container-apps
ms.custom: event-tier1-build-2022, ignite-2022
ms.topic: how-to
ms.date: 08/30/2022
ms.author: v-wellsjason
---

# Monitor logs in Azure Container Apps with Log Analytics

Azure Container Apps is integrated with Azure Monitor Log Analytics to monitor and analyze your container app's logs.  When selected as your log monitoring solution, your Container Apps environment includes a Log Analytics workspace that provides a common place to store the system and application log data from all container apps running in the environment.  

Log entries are accessible by querying Log Analytics tables through the Azure portal or a command shell using the [Azure CLI](/cli/azure/monitor/log-analytics).

There are two types of logs for Container Apps.  

- Console logs, which are emitted by your app.
- System logs, which are emitted by the Container Apps service.


## System Logs

The Container Apps service provides system log messages at the container app level.  System logs emit the following messages:

| Source | Type | Message |
|---------|------|---------|
| Dapr | Info | Successfully created dapr component \<component-name\> with scope \<dapr-component-scope\> |
| Dapr | Info | Successfully updated dapr component \<component-name\> with scope \<component-type\> |
| Dapr | Error | Error creating dapr component \<component-name\> |
| Volume Mounts | Info | Successfully mounted volume \<volume-name\> for revision \<revision-scope\> |
| Volume Mounts | Error | Error mounting volume \<volume-name\> |
| Domain Binding | Info | Successfully bound Domain \<domain\> to the container app \<container app name\> |
| Authentication | Info | Auth enabled on app. Creating authentication config |
| Authentication | Info | Auth config created successfully |
| Traffic weight | Info | Setting a traffic weight of \<percentage>% for revision \<revision-name\\> |
| Revision Provisioning | Info | Creating a new revision: \<revision-name\> |
| Revision Provisioning | Info | Successfully provisioned revision \<name\> |
| Revision Provisioning | Info| Deactivating Old revisions since 'ActiveRevisionsMode=Single' |
| Revision Provisioning | Error | Error provisioning revision \<revision-name>. ErrorCode: \<[ErrImagePull]\|[Timeout]\|[ContainerCrashing]\> |

The system log data is accessible by querying the `ContainerAppSystemLogs_CL` table. The most used Container Apps specific columns in the table are:

| Column  | Description |
|---|---|
| `ContainerAppName_s` | Container app name |
| `EnvironmentName_s` | Container Apps environment name |
| `Log_s` | Log message |
| `RevisionName_s` | Revision name |

## Console Logs

Console logs originate from the `stderr` and `stdout` messages from the containers in your container app and Dapr sidecars.  You can view console logs by querying the `ContainerAppConsoleLogs_CL` table.

> [!TIP]
> Instrumenting your code with well-defined log messages can help you to understand how your code is performing and to debug issues.  To learn more about best practices refer to [Design for operations](/azure/architecture/guide/design-principles/design-for-operations).

The most commonly used Container Apps specific columns in ContainerAppConsoleLogs_CL include:

|Column  |Description |
|---------|---------|
| `ContainerAppName_s` | Container app name |
| `ContainerGroupName_g` | Replica name |
| `ContainerId_s` | Container identifier |
| `ContainerImage_s` | Container image name |
| `EnvironmentName_s` | Container Apps environment name |
| `Log_s` | Log message |
| `RevisionName_s` | Revision name |

## Query Log with Log Analytics

Log Analytics is a tool in the Azure portal that you can use to view and analyze log data. Using Log Analytics, you can write Kusto queries and then sort, filter, and visualize the results in charts to spot trends and identify issues. You can work interactively with the query results or use them with other features such as alerts, dashboards, and workbooks.

### Azure portal

Start Log Analytics from **Logs** in the sidebar menu on your container app page.  You can also start Log Analytics from **Monitor>Logs**.  

You can query the logs using the tables listed in the **CustomLogs** category **Tables** tab.  The tables in this category are the `ContainerAppSystemlogs_CL` and `ContainerAppConsoleLogs_CL` tables.

:::image type="content" source="media/observability/log-analytics-query-page.png" alt-text="Screenshot of the Log Analytics custom log tables.":::

Below is a Kusto query that displays console log entries for the container app named *album-api*. 

```kusto
ContainerAppConsoleLogs_CL
| where ContainerAppName_s == 'album-api'
| project Time=TimeGenerated, AppName=ContainerAppName_s, Revision=RevisionName_s, Container=ContainerName_s, Message=Log_s
| take 100
```

Below is a Kusto query that displays system log entries for the container app named *album-api*. 

```kusto
ContainerAppSystemLogs_CL
| where ContainerAppName_s == 'album-api'
| project Time=TimeGenerated, EnvName=EnvironmentName_s, AppName=ContainerAppName_s, Revision=RevisionName_s, Message=Log_s
| take 100
```

For more information regarding Log Analytics and log queries, see the [Log Analytics tutorial](../azure-monitor/logs/log-analytics-tutorial.md).

### Azure CLI/PowerShell

Container Apps logs can be queried using the [Azure CLI](/cli/azure/monitor/log-analytics).  

These example Azure CLI queries output a table containing log records for the container app name **album-api**.  The table columns are specified by the parameters after the `project` operator.  The `$WORKSPACE_CUSTOMER_ID` variable contains the GUID of the Log Analytics workspace.


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
