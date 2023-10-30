---
title: Diagnostic settings in Azure Monitor
description: Send Azure Monitor platform metrics and logs to Azure Monitor Logs, Azure Storage, or Azure Event Hubs by using a diagnostic setting.
author: rboucher
ms.author: robb
services: azure-monitor
ms.topic: conceptual
ms.custom: devx-track-azurecli, devx-track-azurepowershell
ms.date: 09/06/2023
ms.reviewer: lualderm
---

# Diagnostic settings in Azure Monitor

This article provides details on creating and configuring diagnostic settings to send Azure platform metrics and logs to different destinations.

[Platform metrics](./metrics-supported.md) are sent automatically to [Azure Monitor Metrics](./data-platform-metrics.md) by default and without configuration.

[Platform logs](./platform-logs-overview.md) provide detailed diagnostic and auditing information for Azure resources and the Azure platform they depend on:

   - **Resource logs** aren't collected until they're routed to a destination.
   - **Activity logs** exist on their own but can be routed to other locations.

Each Azure resource requires its own diagnostic setting, which defines the following criteria:

- **Sources**: The type of metric and log data to send to the destinations defined in the setting. The available types vary by resource type.
- **Destinations**: One or more destinations to send to.

A single diagnostic setting can define no more than one of each of the destinations. If you want to send data to more than one of a particular destination type (for example, two different Log Analytics workspaces), create multiple settings. Each resource can have up to five diagnostic settings.

> [!WARNING]
> If you need to delete a resource or migrate it across resource groups or subscriptions, you should first delete its diagnostic settings. Otherwise, if you recreate this resource, the diagnostic settings for the deleted resource could be included with the new resource, depending on the resource configuration for each resource. If the diagnostics settings are included with the new resource, this resumes the collection of resource logs as defined in the diagnostic setting and sends the applicable metric and log data to the previously configured destination. 
>
>Also, it’s a good practice to delete the diagnostic settings for a resource you're going to delete and don't plan on using again to keep your environment clean.

The following video walks you through routing resource platform logs with diagnostic settings. The video was done at an earlier time. Be aware of the following changes:

 - There are now four destinations. You can send platform metrics and logs to certain Azure Monitor partners.
 - A new feature called category groups was introduced in November 2021.

Information on these newer features is included in this article.

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE4AvVO]

## Sources

There are three sources for diagnostic information:
* Metrics
* Resource Logs 
* Activity logs

### Metrics

The **AllMetrics** setting routes a resource's platform metrics to other destinations. This option might not be present for all resource providers.  

### Resource logs

With logs, you can select the log categories you want to route individually or choose a category group.

> [!NOTE]
> Category groups don't apply to all metric resource providers. If a provider doesn't have them available in the diagnostic settings in the Azure portal, then they also won't be available via Azure Resource Manager templates. 

You can use *category groups* to dynamically collect resource logs based on predefined groupings instead of selecting individual log categories. Microsoft defines the groupings to help monitor specific use cases across all Azure services.

Over time, the categories in the group might be updated as new logs are rolled out or as assessments change. When log categories are added or removed from a category group, your log collection is modified automatically without you having to update your diagnostic settings.

When you use category groups, you:

- No longer can individually select resource logs based on individual category types.
- No longer can apply retention settings to logs sent to Azure Storage.

Currently, there are two category groups:

- **All**: Every resource log offered by the resource.
- **Audit**: All resource logs that record customer interactions with data or the settings of the service. Audit logs are an attempt by each resource provider to provide the most relevant audit data, but may not be considered sufficient from an auditing standards perspective.

The "Audit" category is a subset of "All", but the Azure portal and REST API consider them separate settings. Selecting "All" does collect all audit logs regardless of if the "Audit" category is also selected.  

The following image shows the logs category groups on the add diagnostics settings page.
   :::image type="content" source="./media/diagnostic-settings/audit-category-group.png" alt-text="A screenshot showing the logs category groups."::: 


> [!NOTE] 
> Enabling *Audit* for Azure SQL Database does not enable auditing for Azure SQL Database. To enable database auditing, you have to enable it from the auditing blade for Azure Database. 

### Activity log

See the [Activity log settings](#activity-log-settings) section.

## Destinations

Platform logs and metrics can be sent to the destinations listed in the following table.  
  
To ensure the security of data in transit, all destination endpoints are configured to support TLS 1.2.

| Destination | Description |
|:---|:---|
| [Log Analytics workspace](../logs/workspace-design.md) | Metrics are converted to log form. This option might not be available for all resource types. Sending them to the Azure Monitor Logs store (which is searchable via Log Analytics) helps you to integrate them into queries, alerts, and visualizations with existing log data.
| [Azure Storage account](../../storage/blobs/index.yml) | Archiving logs and metrics to a Storage account is useful for audit, static analysis, or back up. Compared to using Azure Monitor Logs or a Log Analytics workspace, Storage is less expensive, and logs can be kept there indefinitely.  | 
| [Azure Event Hubs](../../event-hubs/index.yml) | When you send logs and metrics to Event Hubs, you can stream data to external systems such as third-party SIEMs and other Log Analytics solutions.  |
| [Azure Monitor partner integrations](../../partner-solutions/overview.md)| Specialized integrations can be made between Azure Monitor and other non-Microsoft monitoring platforms. Integration is useful when you're already using one of the partners.  |

## Activity log settings

The activity log uses a diagnostic setting but has its own user interface because it applies to the whole subscription rather than individual resources. The destination information listed here still applies. For more information, see [Azure activity log](activity-log.md).

## Requirements and limitations

This section discusses requirements and limitations.

### Time before telemetry gets to destination

Once you have set up a diagnostic setting, data should start flowing to your selected destination(s) within 90 minutes. If you get no information within 24 hours, then either 
- no logs are being generated or 
- something is wrong in the underlying routing mechanism. Try disabling the configuration and then reenabling it. Contact Azure support through the Azure portal if you continue to have issues. 

### Metrics as a source

There are certain limitations with exporting metrics:

- **Sending multi-dimensional metrics via diagnostic settings isn't currently supported:** Metrics with dimensions are exported as flattened single-dimensional metrics, aggregated across dimension values. For example, the **IOReadBytes** metric on a blockchain can be explored and charted on a per-node level. However, when exported via diagnostic settings, the metric exported shows all read bytes for all nodes.
- **Not all metrics are exportable with diagnostic settings:** Because of internal limitations, not all metrics are exportable to Azure Monitor Logs or Log Analytics. For more information, see the **Exportable** column in the [list of supported metrics](./metrics-supported.md).

To get around these limitations for specific metrics, you can manually extract them by using the [Metrics REST API](/rest/api/monitor/metrics/list). Then you can import them into Azure Monitor Logs by using the [Azure Monitor Data Collector API](../logs/data-collector-api.md).

### Destination limitations

Any destinations for the diagnostic setting must be created before you create the diagnostic settings. The destination doesn't have to be in the same subscription as the resource sending logs if the user who configures the setting has appropriate Azure role-based access control access to both subscriptions. By using Azure Lighthouse, it's also possible to have diagnostic settings sent to a workspace, storage account, or event hub in another Microsoft Entra tenant.

The following table provides unique requirements for each destination including any regional restrictions.

| Destination | Requirements |
|:---|:---|
| Log Analytics workspace | The workspace doesn't need to be in the same region as the resource being monitored.|
| Storage account | Don't use an existing storage account that has other, non-monitoring data stored in it so that you can better control access to the data. If you're archiving the activity log and resource logs together, you might choose to use the same storage account to keep all monitoring data in a central location.<br><br>To send the data to immutable storage, set the immutable policy for the storage account as described in [Set and manage immutability policies for Azure Blob Storage](../../storage/blobs/immutable-policy-configure-version-scope.md). You must follow all steps in this linked article including enabling protected append blobs writes.<br><br>The storage account needs to be in the same region as the resource being monitored if the resource is regional.<br><br> Diagnostic settings can't access storage accounts when virtual networks are enabled. You must enable **Allow trusted Microsoft services** to bypass this firewall setting in storage accounts so that the Azure Monitor diagnostic settings service is granted access to your storage account.<br><br>[Azure DNS zone endpoints (preview)](../../storage/common/storage-account-overview.md#azure-dns-zone-endpoints-preview) and [Azure Premium LRS](../../storage/common/storage-redundancy.md#locally-redundant-storage) (locally redundant storage) storage accounts aren't supported as a log or metric destination.|
| Event Hubs | The shared access policy for the namespace defines the permissions that the streaming mechanism has. Streaming to Event Hubs requires Manage, Send, and Listen permissions. To update the diagnostic setting to include streaming, you must have the ListKey permission on that Event Hubs authorization rule.<br><br>The event hub namespace needs to be in the same region as the resource being monitored if the resource is regional. <br><br> Diagnostic settings can't access Event Hubs resources when virtual networks are enabled. You must enable **Allow trusted Microsoft services** to bypass this firewall setting in Event Hubs so that the Azure Monitor diagnostic settings service is granted access to your Event Hubs resources.|
| Partner integrations | The solutions vary by partner. Check the [Azure Monitor partner integrations documentation](../../partner-solutions/overview.md) for details.

> [!CAUTION]
> If you want to store diagnostic logs in a Log Analytics workspace, there are two points to consider to avoid seeing duplicate data in Application Insights:
> * The destination can't be the same Log Analytics workspace that your Application Insights resource is based on.
> * The Application Insights user can't have access to both workspaces. Set the Log Analytics access control mode to Requires workspace permissions. Through Azure role-based access control, ensure the user only has access to the Log Analytics workspace the Application Insights resource is based on.
>
> These steps are necessary because Application Insights accesses telemetry across Application Insight resources, including Log Analytics workspaces, to provide complete end-to-end transaction operations and accurate application maps. Because diagnostic logs use the same table names, duplicate telemetry can be displayed if the user has access to multiple resources that contain the same data.

## Controlling costs

There's a cost for collecting data in a Log Analytics workspace, so you should only collect the categories you require for each service. The data volume for resource logs varies significantly between services. 

You might also not want to collect platform metrics from Azure resources because this data is already being collected in Metrics. Only configure your diagnostic data to collect metrics if you need metric data in the workspace for more complex analysis with log queries. Diagnostic settings don't allow granular filtering of resource logs.

[!INCLUDE [azure-monitor-cost-optimization](../../../includes/azure-monitor-cost-optimization.md)]

## Create diagnostic settings

You can create and edit diagnostic settings by using multiple methods.

# [Azure portal](#tab/portal)

You can configure diagnostic settings in the Azure portal either from the Azure Monitor menu or from the menu for the resource.

1. Where you configure diagnostic settings in the Azure portal depends on the resource:

   - For a single resource, select **Diagnostic settings** under **Monitoring** on the resource's menu.

        ![Screenshot that shows the Monitoring section of a resource menu in the Azure portal with Diagnostic settings highlighted.](media/diagnostic-settings/menu-resource.png)

   - For one or more resources, select **Diagnostic settings** under **Settings** on the Azure Monitor menu and then select the resource.

        ![Screenshot that shows the Settings section in the Azure Monitor menu with Diagnostic settings highlighted.](media/diagnostic-settings/menu-monitor.png)

   - For the activity log, select **Activity log** on the **Azure Monitor** menu and then select **Export Activity Logs**. Make sure you disable any legacy configuration for the activity log. For instructions, see [Disable existing settings](./activity-log.md#legacy-collection-methods).

        ![Screenshot that shows the Azure Monitor menu with Activity log selected and Export activity logs highlighted in the Monitor-Activity log menu bar.](media/diagnostic-settings/menu-activity-log.png)

1. If no settings exist on the resource you've selected, you're prompted to create a setting. Select **Add diagnostic setting**.

   ![Screenshot that shows the Add diagnostic setting with no existing settings.](media/diagnostic-settings/add-setting.png)

   If there are existing settings on the resource, you see a list of settings already configured. Select **Add diagnostic setting** to add a new setting. Or select **Edit setting** to edit an existing one. Each setting can have no more than one of each of the destination types.

   :::image type="Add diagnostic setting - existing settings" source="media/diagnostic-settings/edit-setting.png" alt-text="Screenshot that shows adding a diagnostic setting for existing settings.":::

1. Give your setting a name if it doesn't already have one.

      :::image type="Add diagnostic setting" source="media/diagnostic-settings/setting-new-blank.png" alt-text="Screenshot that shows Diagnostic setting name.":::

1. **Logs and metrics to route**: For logs, either choose a category group or select the individual checkboxes for each category of data you want to send to the destinations specified later. The list of categories varies for each Azure service. Select **AllMetrics** if you want to store metrics in Azure Monitor Logs too.

1. **Destination details**: Select the checkbox for each destination. Options appear so that you can add more information.

      ![Screenshot that shows Send to Log Analytics and Stream to an event hub.](media/diagnostic-settings/send-to-log-analytics-event-hubs.png)

    1. **Log Analytics**  
      Enter the subscription and workspace. If you don't have a workspace, you must [create one before you proceed](../logs/quick-create-workspace.md).

    1. **Event Hubs**  
       Specify the following criteria:
       - **Subscription**: The subscription that the event hub is part of.
       - **Event hub namespace**: If you don't have one, you must [create one](../../event-hubs/event-hubs-create.md).
       - **Event hub name (optional)**: The name to send all data to. If you don't specify a name, an event hub is created for each log category. If you're sending to multiple categories, you might want to specify a name to limit the number of event hubs created. For more information, see [Azure Event Hubs quotas and limits](../../event-hubs/event-hubs-quotas.md).
       - **Event hub policy name** (also optional): A policy defines the permissions that the streaming mechanism has. For more information, see [Event Hubs features](../../event-hubs/event-hubs-features.md#publisher-policy).

    1. **Archive to a storage account**  
       Select your **Subscription** and the **Storage account** where you want to store the data.

        :::image type="content" source="media/diagnostic-settings/storage-settings-new.png" alt-text="Screenshot that shows storage category and destination details." lightbox="media/diagnostic-settings/storage-settings-new.png":::

        > [!TIP]
        >  Use the [Azure Storage Lifecycle Policy](../../storage/blobs/lifecycle-management-policy-configure.md?tabs=azure-portal) to manage the length of time that your logs are retained.  
        > The Retention Policy as set in the Diagnostic Setting settings is now deprecated.

     1. **Partner integration**: You must first install partner integration into your subscription. Configuration options vary by partner. For more information, see [Azure Monitor partner integrations](../../partner-solutions/overview.md).

1. If the service supports both [resource-specific](resource-logs.md#resource-specific) and [Azure diagnostics](resource-logs.md#azure-diagnostics-mode) mode, then an option to select the [destination table](resource-logs.md#select-the-collection-mode) will be displayed when you select **Log Analytics workspace** as a destination. You should usually select **Resource specific** since the table structure allows for more flexibility and more efficient queries.

    :::image type="content" source="media/diagnostic-settings/destination-table.png" alt-text="Screenshot of dialog box to set destination table." lightbox="media/diagnostic-settings/destination-table.png":::

2. Select **Save**.

After a few moments, the new setting appears in your list of settings for this resource. Logs are streamed to the specified destinations as new event data is generated. It might take up to 15 minutes between when an event is emitted and when it [appears in a Log Analytics workspace](../logs/data-ingestion-time.md).

# [PowerShell](#tab/powershell)

Use the [New-AzDiagnosticSetting](/powershell/module/az.monitor/new-azdiagnosticsetting) cmdlet to create a diagnostic setting with [Azure PowerShell](../powershell-samples.md). See the documentation for this cmdlet for descriptions of its parameters.

> [!IMPORTANT]
> You can't use this method for an activity log. Instead, use [Create diagnostic setting in Azure Monitor by using an Azure Resource Manager template](./resource-manager-diagnostic-settings.md) to create a Resource Manager template and deploy it with PowerShell.

The following example PowerShell cmdlet creates a diagnostic setting for all logs and metrics for a key vault by using Log Analytics Workspace.

```powershell
$KV= Get-AzKeyVault -ResourceGroupName <resource group name> -VaultName <key vault name>
$Law= Get-AzOperationalInsightsWorkspace -ResourceGroupName <resource group name> -Name <workspace name>  #LAW name is case sensitive

$metric = @()
$log = @()
$metric += New-AzDiagnosticSettingMetricSettingsObject -Enabled $true -Category AllMetrics -RetentionPolicyDay 30 -RetentionPolicyEnabled $true
$log += New-AzDiagnosticSettingLogSettingsObject -Enabled $true -CategoryGroup allLogs -RetentionPolicyDay 30 -RetentionPolicyEnabled $true
$log += New-AzDiagnosticSettingLogSettingsObject -Enabled $true -CategoryGroup audit -RetentionPolicyDay 30 -RetentionPolicyEnabled $true
New-AzDiagnosticSetting -Name 'KeyVault-Diagnostics' -ResourceId $KV.ResourceId -WorkspaceId $Law.ResourceId -Log $log -Metric $metric -Verbose
```

# [CLI](#tab/cli)

Use the [az monitor diagnostic-settings create](/cli/azure/monitor/diagnostic-settings#az-monitor-diagnostic-settings-create) command to create a diagnostic setting with the [Azure CLI](/cli/azure/monitor). See the documentation for this command for descriptions of its parameters.

> [!IMPORTANT]
> You can't use this method for an activity log. Instead, use [Create diagnostic setting in Azure Monitor by using a Resource Manager template](./resource-manager-diagnostic-settings.md) to create a Resource Manager template and deploy it with CLI.

The following example CLI command creates a diagnostic setting by using all three destinations. The syntax is slightly different depending on your client.

To specify [resource-specific mode](resource-logs.md#resource-specific) if the service supports it, add the `export-to-resource-specific` parameter with a value of `true`.`

**CMD client**

```azurecli
az monitor diagnostic-settings create  ^
--name KeyVault-Diagnostics ^
--resource /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myresourcegroup/providers/Microsoft.KeyVault/vaults/mykeyvault ^
--logs    "[{""category"": ""AuditEvent"",""enabled"": true}]" ^
--metrics "[{""category"": ""AllMetrics"",""enabled"": true}]" ^
--storage-account /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myresourcegroup/providers/Microsoft.Storage/storageAccounts/mystorageaccount ^
--workspace /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/myresourcegroup/providers/microsoft.operationalinsights/workspaces/myworkspace ^
--event-hub-rule /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myresourcegroup/providers/Microsoft.EventHub/namespaces/myeventhub/authorizationrules/RootManageSharedAccessKey ^
--export-to-resource-specific true
```

**PowerShell client**

```azurecli
az monitor diagnostic-settings create  `
--name KeyVault-Diagnostics `
--resource /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myresourcegroup/providers/Microsoft.KeyVault/vaults/mykeyvault `
--logs    '[{""category"": ""AuditEvent"",""enabled"": true}]' `
--metrics '[{""category"": ""AllMetrics"",""enabled"": true}]' `
--storage-account /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myresourcegroup/providers/Microsoft.Storage/storageAccounts/mystorageaccount `
--workspace /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/myresourcegroup/providers/microsoft.operationalinsights/workspaces/myworkspace `
--event-hub-rule /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myresourcegroup/providers/Microsoft.EventHub/namespaces/myeventhub/authorizationrules/RootManageSharedAccessKey `
--export-to-resource-specific true
```

**Bash client**

```azurecli
az monitor diagnostic-settings create  \
--name KeyVault-Diagnostics \
--resource /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myresourcegroup/providers/Microsoft.KeyVault/vaults/mykeyvault \
--logs    '[{"category": "AuditEvent","enabled": true}]' \
--metrics '[{"category": "AllMetrics","enabled": true}]' \
--storage-account /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myresourcegroup/providers/Microsoft.Storage/storageAccounts/mystorageaccount \
--workspace /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/myresourcegroup/providers/microsoft.operationalinsights/workspaces/myworkspace \
--event-hub-rule /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myresourcegroup/providers/Microsoft.EventHub/namespaces/myeventhub/authorizationrules/RootManageSharedAccessKey \
--export-to-resource-specific true
```

# [Resource Manager](#tab/arm)

To create or update diagnostic settings with a Resource Manager template, see [Resource Manager template samples for diagnostic settings in Azure Monitor](./resource-manager-diagnostic-settings.md).

## [REST API](#tab/api)

To create or update diagnostic settings by using the [Azure Monitor REST API](/rest/api/monitor/), see [Diagnostic settings](/rest/api/monitor/diagnosticsettings).

# [Azure Policy](#tab/policy)

For details on using Azure Policy to create diagnostic settings at scale, see [Create diagnostic settings at scale by using Azure Policy](diagnostic-settings-policy.md).

---
## Troubleshooting

Here are some troubleshooting tips.

### Metric category isn't supported

When you deploy a diagnostic setting, you receive an error message similar to "Metric category 'xxxx' isn't supported." You might receive this error even though your previous deployment succeeded.

The problem occurs when you use a Resource Manager template, REST API, the CLI, or Azure PowerShell. Diagnostic settings created via the Azure portal aren't affected because only the supported category names are presented.

The problem is caused by a recent change in the underlying API. Metric categories other than **AllMetrics** aren't supported and never were except for a few specific Azure services. In the past, other category names were ignored when deploying a diagnostic setting. The Azure Monitor back end redirected these categories to **AllMetrics**. As of February 2021, the back end was updated to specifically confirm the metric category provided is accurate. This change has caused some deployments to fail.

If you receive this error, update your deployments to replace any metric category names with **AllMetrics** to fix the issue. If the deployment was previously adding multiple categories, only keep one with the **AllMetrics** reference. If you continue to have the problem, contact Azure support through the Azure portal.

### Setting disappears because of non-ASCII characters in resourceID

Diagnostic settings don't support resource IDs with non-ASCII characters. For example, consider the term Preproducción. Because you can't rename resources in Azure, your only option is to create a new resource without the non-ASCII characters. If the characters are in a resource group, you can move the resources under it to a new one. Otherwise, you'll need to re-create the resource.

### Possibility of duplicated or dropped data

Every effort is made to ensure all log data is sent correctly to your destinations, however it's not possible guarantee 100% data transfer of logs between endpoints. Retries and other mechanisms are in place to work around these issues and attempt to ensure log data arrives at the endpoint.

## Next steps

[Read more about Azure platform logs](./platform-logs-overview.md)
