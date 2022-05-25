---
title: Diagnostic settings in Azure Monitor
description: Send Azure Monitor platform metrics and logs to Azure Monitor Logs, Azure storage, or Azure Event Hubs using a diagnostic setting.
author: rboucher
ms.author: robb
services: azure-monitor
ms.topic: conceptual
ms.date: 03/07/2022
---

# Diagnostic settings in Azure Monitor
This article provides details on creating and configuring diagnostic settings to send Azure platform metrics and logs to different destinations.

[Platform metrics](./metrics-supported.md) are sent automatically to [Azure Monitor Metrics](./data-platform-metrics.md) by default and without configuration.

[Platform logs](./platform-logs-overview.md) provide detailed diagnostic and auditing information for Azure resources and the Azure platform they depend on. 
   - **Resource logs** are not collected until they are routed to a destination. 
   - The **Activity Log** exists on its own but can be routed to other locations. 

Each Azure resource requires its own diagnostic setting, which defines the following criteria:

- **Sources** - The type of metric and log data to send to the destinations defined in the setting. The available types vary by resource type.
- **Destinations** - One or more destinations to send to.

A single diagnostic setting can define no more than one of each of the destinations. If you want to send data to more than one of a particular destination type (for example, two different Log Analytics workspaces), then create multiple settings. Each resource can have up to 5 diagnostic settings.

The following video walks you through routing resource platform logs with diagnostic settings. The video was done at an earlier time and doesn't include the following:
 - There are now 4 destinations. You can send platform metrics and logs to certain Azure Monitor partners. 
 - A new feature called category groups was introduced in Nov 2021. 

Information on these newer features is included in this article. 

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE4AvVO]

## Sources

Here are the source options.

### Metrics

The **AllMetrics** setting routes a resource's platform metrics to additional destinations. This option may not be present for all resource providers.  

### Resource Logs

With logs, you can select the log categories you want to route individually or choose a category group.

> [!NOTE]
> Category groups do not apply to metrics. Not all resources have category groups available.

**Category groups** allow you to dynamically collect resource logs based on predefined groupings instead of selecting individual log categories. Microsoft defines the groupings to help monitor specific use cases across all Azure services. Over time, the categories in the group may be updated as new logs are rolled out or as assessments change. When logs categories are added or removed from a category group, your log collection is modified automatically without you having to update your diagnostic settings.

When you use category groups, you: 
- No longer can individually select resource logs based on individual category types
- No longer can apply retention settings to logs sent to Azure Storage

Currently, there are two category groups:
- **All** - Every resource log offered by the resource.
- **Audit** - All resource logs that record customer interactions with data or the settings of the service.

### Activity Log
See [Activity Log settings](#activity-log-settings) section below. 

## Destinations
Platform logs and metrics can be sent to the destinations in the following table. 

| Destination | Description |
|:---|:---|
| [Log Analytics workspace](../logs/workspace-design.md) | Metrics are converted to log form. This option may not be available for all resource types. Sending them to the Azure Monitor Logs store (which is searchable via Log Analytics) helps you to integrate them into queries, alerts, and visualizations with existing log data.  
| [Azure storage account](../../storage/blobs/index.yml) | Archiving logs and metrics to an Azure storage account is useful for audit, static analysis, or backup. Compared to Azure Monitor Logs and a Log Analytics workspace, Azure storage is less expensive and logs can be kept there indefinitely.  | 
| [Event Hubs](../../event-hubs/index.yml) | Sending logs and metrics to Event Hubs allows you to stream data to external systems such as third-party SIEMs  and other Log Analytics solutions.  |
| [Azure Monitor partner integrations](../../partner-solutions/overview.md)| Specialized integrations between Azure Monitor and other non-Microsoft monitoring platforms. Useful when you are already using one of the partners.  |

## Activity Log settings

The Activity Log uses a diagnostic setting, but has it's own user interface because it applies to the whole subscription rather than individual resources. The destination information listed below still applies.  For more information, see the [Azure Activity Log](activity-log.md). 

## Requirements and limitations

### Metrics as a source
There are certain limitations with exporting metrics.

- **Sending multi-dimensional metrics via diagnostic settings is not currently supported** - Metrics with dimensions are exported as flattened single dimensional metrics, aggregated across dimension values. *For example*: The 'IOReadBytes' metric on a Blockchain can be explored and charted on a per node level. However, when exported via diagnostic settings, the metric exported shows all read bytes for all nodes.
- **Not all metrics are exportable with diagnostic settings** -  Due to internal limitations not all metrics are exportable to Azure Monitor Logs / Log Analytics. For more information, see the exportable column in the [list of supported metrics](./metrics-supported.md)

To get around these limitations for specific metrics, you can manually extract them using the [Metrics REST API](/rest/api/monitor/metrics/list) and import them into Azure Monitor Logs using the [Azure Monitor Data collector API](../logs/data-collector-api.md).

### Destination limitations

Any destinations for the diagnostic setting must be created before creating the diagnostic settings. The destination does not have to be in the same subscription as the resource sending logs as long as the user who configures the setting has appropriate Azure RBAC access to both subscriptions. Using Azure Lighthouse, it is also possible to have diagnostic settings sent to a workspace, storage account or Event Hub in another Azure Active Directory tenant. The following table provides unique requirements for each destination including any regional restrictions.

| Destination | Requirements |
|:---|:---|
| Log Analytics workspace | The workspace does not need to be in the same region as the resource being monitored.|
| Azure storage account | Do not use an existing storage account that has other, non-monitoring data stored in it so that you can better control access to the data. If you are archiving the Activity log and resource logs together though, you may choose to use the same storage account to keep all monitoring data in a central location.<br><br>To send the data to immutable storage, set the immutable policy for the storage account as described in [Set and manage immutability policies for Blob storage](../../storage/blobs/immutable-policy-configure-version-scope.md). You must follow all steps in this linked article including enabling protected append blobs writes.<br><br>The storage account needs to be in the same region as the resource being monitored if the resource is regional.|
| Event Hubs | The shared access policy for the namespace defines the permissions that the streaming mechanism has. Streaming to Event Hubs requires Manage, Send, and Listen permissions. To update the diagnostic setting to include streaming, you must have the ListKey permission on that Event Hubs authorization rule.<br><br>The event hub namespace needs to be in the same region as the resource being monitored if the resource is regional. <br><br> Diagnostic settings can't access Event Hubs resources when virtual networks are enabled. You have to enable the *Allow trusted Microsoft services* to bypass this firewall setting in Event Hub, so that Azure Monitor (Diagnostic Settings) service is granted access to your Event Hubs resources.|
| Partner integrations | Varies by partner.  Check the [Azure Monitor partner integrations documentation](../../partner-solutions/overview.md) for details.  

## Create diagnostic settings
You can create and edit diagnostic settings using multiple methods.

# [Azure portal](#tab/portal)

You can configure diagnostic settings in the Azure portal either from the Azure Monitor menu or from the menu for the resource.

1. Where you configure diagnostic settings in the Azure portal depends on the resource.

   - For a single resource, click **Diagnostic settings** under **Monitor** in the resource's menu.

        ![Screenshot of the Monitoring section of a resource menu in Azure portal with Diagnostic settings highlighted.](media/diagnostic-settings/menu-resource.png)

   - For one or more resources, click **Diagnostic settings** under **Settings** in the Azure Monitor menu and then click on the resource.

        ![Screenshot of the Settings section in the Azure Monitor menu with Diagnostic settings highlighted.](media/diagnostic-settings/menu-monitor.png)

   - For the Activity log, click **Activity log** in the **Azure Monitor** menu and then **Diagnostic settings**. Make sure you disable any legacy configuration for the Activity log. See [Disable existing settings](./activity-log.md#legacy-collection-methods) for details.

        ![Screenshot of the Azure Monitor menu with Activity log selected and Diagnostic settings highlighted in the Monitor-Activity log menu bar.](media/diagnostic-settings/menu-activity-log.png)

2. If no settings exist on the resource you have selected, you are prompted to create a setting. Click **Add diagnostic setting**.

   ![Add diagnostic setting - no existing settings](media/diagnostic-settings/add-setting.png)

   If there are existing settings on the resource, you see a list of settings already configured. Either click **Add diagnostic setting** to add a new setting or **Edit setting** to edit an existing one. Each setting can have no more than one of each of the destination types.

   :::image type="Add diagnostic setting - existing settings" source="media/diagnostic-settings/edit-setting.png" alt-text="Add a diagnostic setting for existing settings":::

3. Give your setting a name if it doesn't already have one.

      :::image type="Add diagnostic setting" source="media/diagnostic-settings/setting-new-blank.png" alt-text="Name your diagnostic setting":::

4. **Logs and metrics to route** - For logs, either choose a category group or check the individual boxes for each category of data you want to send to the destinations specified later. The list of categories varies for each Azure service. Choose *allMetrics* if you want to store metrics into Azure Monitor Logs as well. 

5. **Destination details** - Check the box for each destination. When you check each box, options appear to allow you to add additional information.

      ![Send to Log Analytics or Event Hubs](media/diagnostic-settings/send-to-log-analytics-event-hubs.png)

    1. **Log Analytics** - Enter the subscription and workspace.  If you don't have a workspace, you need to [create one before proceeding](../logs/quick-create-workspace.md).

    1. **Event Hubs** - Specify the following criteria:
       - The subscription that the event hub is part of
       - The Event Hub namespace - If you do not yet have one, you'll need [to create one](../../event-hubs/event-hubs-create.md)
       - An Event Hub name (optional) to send all data to. If you don't specify a name, an event hub is created for each log category. If you are sending multiple categories, you may want to specify a name to limit the number of event hubs created. See [Azure Event Hubs quotas and limits](../../event-hubs/event-hubs-quotas.md) for details.
       - An Event Hub policy (optional) A policy defines the permissions that the streaming mechanism has. For more information, see [Event-hubs-features](../../event-hubs/event-hubs-features.md#publisher-policy).

    1. **Storage** - Choose the subscription, storage account, and retention policy.

        ![Send to Storage](media/diagnostic-settings/storage-settings-new.png)

        > [!TIP]
        > Consider setting the retention policy to 0 and either use [Azure Storage Lifecycle Policy](../../storage/blobs/lifecycle-management-policy-configure.md) or delete your data from storage using a scheduled job. These strategies are likely to provide more consistent behavior. 
        >
        > First, if you are using storage for archiving, you generally want your data around for more than 365 days. Second, if you choose a retention policy that is greater than 0, the expiration date is attached to the logs at the time of storage. You can't change the date for those logs once stored. For example, if you set the retention policy for *WorkflowRuntime* to 180 days and then 24 hours later set it to 365 days, the logs stored during those first 24 hours will be automatically deleted after 180 days, while all subsequent logs of that type will be automatically deleted after 365 days. Changing the retention policy later doesn't make the first 24 hours of logs stay around for 365 days.

     1. **Partner integration** - You must first install a partner integration into your subscription. Configuration options will vary by partner. For more information, see [Azure Monitor Partner integrations](../../partner-solutions/overview.md). 
    
6. Click **Save**.

After a few moments, the new setting appears in your list of settings for this resource, and logs are streamed to the specified destinations as new event data is generated. It may take up to 15 minutes between when an event is emitted and when it [appears in a Log Analytics workspace](../logs/data-ingestion-time.md).

# [PowerShell](#tab/powershell)

Use the [Set-AzDiagnosticSetting](/powershell/module/az.monitor/set-azdiagnosticsetting) cmdlet to create a diagnostic setting with [Azure PowerShell](../powershell-samples.md). See the documentation for this cmdlet for descriptions of its parameters.

> [!IMPORTANT]
> You cannot use this method for the Azure Activity log. Instead, use [Create diagnostic setting in Azure Monitor using a Resource Manager template](./resource-manager-diagnostic-settings.md) to create a Resource Manager template and deploy it with PowerShell.

Following is an example PowerShell cmdlet to create a diagnostic setting using all three destinations.

```powershell
Set-AzDiagnosticSetting -Name KeyVault-Diagnostics -ResourceId /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myresourcegroup/providers/Microsoft.KeyVault/vaults/mykeyvault -Category AuditEvent -MetricCategory AllMetrics -Enabled $true -StorageAccountId /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myresourcegroup/providers/Microsoft.Storage/storageAccounts/mystorageaccount -WorkspaceId /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/oi-default-east-us/providers/microsoft.operationalinsights/workspaces/myworkspace  -EventHubAuthorizationRuleId /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myresourcegroup/providers/Microsoft.EventHub/namespaces/myeventhub/authorizationrules/RootManageSharedAccessKey
```

# [CLI](#tab/cli)

Use the [az monitor diagnostic-settings create](/cli/azure/monitor/diagnostic-settings#az-monitor-diagnostic-settings-create) command to create a diagnostic setting with [Azure CLI](/cli/azure/monitor). See the documentation for this command for descriptions of its parameters.

> [!IMPORTANT]
> You cannot use this method for the Azure Activity log. Instead, use [Create diagnostic setting in Azure Monitor using a Resource Manager template](./resource-manager-diagnostic-settings.md) to create a Resource Manager template and deploy it with CLI.

Following is an example CLI command to create a diagnostic setting using all three destinations. The syntax is slightly different depending on your client.

**CMD client**

```azurecli
az monitor diagnostic-settings create  ^
--name KeyVault-Diagnostics ^
--resource /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myresourcegroup/providers/Microsoft.KeyVault/vaults/mykeyvault ^
--logs    "[{""category"": ""AuditEvent"",""enabled"": true}]" ^
--metrics "[{""category"": ""AllMetrics"",""enabled"": true}]" ^
--storage-account /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myresourcegroup/providers/Microsoft.Storage/storageAccounts/mystorageaccount ^
--workspace /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/myresourcegroup/providers/microsoft.operationalinsights/workspaces/myworkspace ^
--event-hub-rule /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myresourcegroup/providers/Microsoft.EventHub/namespaces/myeventhub/authorizationrules/RootManageSharedAccessKey
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
--event-hub-rule /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myresourcegroup/providers/Microsoft.EventHub/namespaces/myeventhub/authorizationrules/RootManageSharedAccessKey
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
--event-hub-rule /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myresourcegroup/providers/Microsoft.EventHub/namespaces/myeventhub/authorizationrules/RootManageSharedAccessKey
```

# [Resource Manager](#tab/arm)
See [Resource Manager template samples for diagnostic settings in Azure Monitor](./resource-manager-diagnostic-settings.md) to create or update diagnostic settings with a Resource Manager template.

## [REST API](#tab/api)
See [Diagnostic Settings](/rest/api/monitor/diagnosticsettings) to create or update diagnostic settings using the [Azure Monitor REST API](/rest/api/monitor/).

# [Azure Policy](#tab/policy)
See [Create diagnostic settings at scale using Azure Policy](diagnostic-settings-policy.md) for details on using Azure Policy to create diagnostic settings at scale.

---
## Troubleshooting

### Metric category is not supported

When deploying a diagnostic setting, you receive an error message, similar to *Metric category 'xxxx' is not supported*. You may receive this error even though your previous deployment succeeded. 

The problem occurs when using a Resource Manager template, REST API, Azure CLI, or Azure PowerShell. Diagnostic settings created via the Azure portal are not affected as only the supported category names are presented.

The problem is caused by a recent change in the underlying API. Metric categories other than 'AllMetrics' are not supported and never were except for a few specific Azure services. In the past, other category names were ignored when deploying a diagnostic setting. The Azure Monitor backend redirected these categories to 'AllMetrics'.  As of February 2021, the backend was updated to specifically confirm the metric category provided is accurate. This change has caused some deployments to fail.

If you receive this error, update your deployments to replace any metric category names with 'AllMetrics' to fix the issue. If the deployment was previously adding multiple categories, only one with the 'AllMetrics' reference should be kept. If you continue to have the problem, contact Azure support through the Azure portal. 

### Setting disappears due to non-ASCII characters in resourceID

Diagnostic settings do not support resourceIDs with non-ASCII characters (for example, Preproducción). Since you cannot rename resources in Azure, your only option is to create a new resource without the non-ASCII characters. If the characters are in a resource group, you can move the resources under it to a new one. Otherwise, you'll need to recreate the resource.

## Next steps

- [Read more about Azure platform Logs](./platform-logs-overview.md)
