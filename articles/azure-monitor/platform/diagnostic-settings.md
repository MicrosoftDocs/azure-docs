---
title: Use diagnostic settings to collect platform metrics and logs and in Azure
description: Send Azure Monitor platform metrics and logs to Azure Monitor Logs, Azure storage, or Azure Event Hubs using a diagnostic setting.
author: bwren
ms.author: bwren
services: azure-monitor
ms.topic: conceptual
ms.date: 04/27/2020
ms.subservice: logs
---

# Create diagnostic setting to collect resource logs and metrics in Azure

[Platform logs](platform-logs-overview.md) in Azure, including the Azure Activity log and resource logs, provide detailed diagnostic and auditing information for Azure resources and the Azure platform they depend on. [Platform metrics](data-platform-metrics.md) are collected by default and typically stored in the Azure Monitor metrics database.

This article provides details on creating and configuring diagnostic settings to send platform metrics and platform logs to different destinations.

> [!IMPORTANT]
> Before you create a diagnostic setting to collect the Activity log, you should first disable any legacy configuration. See [Collect Azure Activity log with legacy settings](diagnostic-settings-legacy.md) for details.

Each Azure resource requires its own diagnostic setting, which defines the following criteria:

- Categories of logs and metric data sent to the destinations defined in the setting. The available categories will vary for different resource types.
- One or more destinations to send the logs. Current destinations include Log Analytics workspace, Event Hubs, and Azure Storage.

A single diagnostic setting can define no more than one of each of the destinations. If you want to send data to more than one of a particular destination type (for example, two different Log Analytics workspaces), then create multiple settings. Each resource can have up to 5 diagnostic settings.

> [!NOTE]
> [Platform metrics](metrics-supported.md) are collected automatically to [Azure Monitor Metrics](data-platform-metrics.md). Diagnostic settings can be used to collect metrics for certain Azure services into Azure Monitor Logs for analysis with other monitoring data using [log queries](../log-query/log-query-overview.md) with certain limitations. 
>  
>  
> Sending multi-dimensional metrics via diagnostic settings is not currently supported. Metrics with dimensions are exported as flattened single dimensional metrics, aggregated across dimension values. *For example*: The 'IOReadBytes' metric on an Blockchain can be explored and charted on a per node level. However, when exported via diagnostic settings, the metric exported represents as all read bytes for all nodes. In addition, due to internal limitations not all metrics are exportable to Azure Monitor Logs / Log Analytics. For more information, see the [list of exportable metrics](metrics-supported-export-diagnostic-settings.md). 
>  
>  
> To get around these limitations for specific metrics, we suggest you manually extract them using the [Metrics REST API](https://docs.microsoft.com/rest/api/monitor/metrics/list) and import them into Azure Monitor Logs using the [Azure Monitor Data collector API](data-collector-api.md).  

## Destinations

Platform logs and metrics can be sent to the destinations in the following table. Follow each link in the following table for details on sending data to that destination.

| Destination | Description |
|:---|:---|
| [Log Analytics workspace](resource-logs-collect-workspace.md) | Collecting logs and metrics into a Log Analytics workspace allows you to analyze them with other monitoring data collected by Azure Monitor using powerful log queries and also to leverage other Azure Monitor features such as alerts and visualizations. |
| [Event hubs](resource-logs-stream-event-hubs.md) | Sending logs and metrics to Event Hubs allows you to stream data to external systems such as third-party SIEMs and other log analytics solutions. |
| [Azure storage account](resource-logs-collect-storage.md) | Archiving logs and metrics to an Azure storage account is useful for audit, static analysis, or backup. Compared to Azure Monitor Logs and a Log Analytics workspace, Azure storage is less expensive and logs can be kept there indefinitely. |

## Create diagnostic settings in Azure portal

You can configure diagnostic settings in the Azure portal either from the Azure Monitor menu or from the menu for the resource.

1. Where you configure diagnostic settings in the Azure portal depends on the resource.

   - For a single resource, click **Diagnostic settings** under **Monitor** in the resource's menu.

        ![Diagnostic settings](media/diagnostic-settings/menu-resource.png)

   - For one or more resources, click **Diagnostic settings** under **Settings** in the Azure Monitor menu and then click on the resource.

      ![Diagnostic settings](media/diagnostic-settings/menu-monitor.png)

   - For the Activity log, click **Activity log** in the **Azure Monitor** menu and then **Diagnostic settings**. Make sure you disable any legacy configuration for the Activity log. See [Disable existing settings](/azure/azure-monitor/platform/activity-log-collect#collecting-activity-log) for details.

        ![Diagnostic settings](media/diagnostic-settings/menu-activity-log.png)

2. If no settings exist on the resource you have selected, you are prompted to create a setting. Click **Add diagnostic setting**.

   ![Add diagnostic setting - no existing settings](media/diagnostic-settings/add-setting.png)

   If there are existing settings on the resource, you see a list of settings already configured. Either click **Add diagnostic setting** to add a new setting or **Edit setting** to edit an existing one. Each setting can have no more than one of each of the destination types.

   ![Add diagnostic setting - existing settings](media/diagnostic-settings/edit-setting.png)

3. Give your setting a name if it doesn't already have one.

    ![Add diagnostic setting](media/diagnostic-settings/setting-new-blank.png)

4. **Category details (what to route)** - Check the box for each category of data you want to send to destinations specified later. The list of categories varies for each Azure service.

     - **AllMetrics** routes a resource's platform metrics into the Azure Logs store, but in log form. These metrics are usually sent only to the Azure Monitor metrics time-series database. Sending them to the Azure Monitor Logs store (which is searchable via Log Analytics) you to integrate them into queries which search across other logs. This option may not be available for all resource types. When it is supported, [Azure Monitor supported metrics](metrics-supported.md) lists what metrics are collected for what resource types.

       > [!NOTE]
       > See limitatation for routing metrics to Azure Monitor Logs earlier in this article.  


     - **Logs** lists the different categories available depending on the resource type. Check any categories that you would like to route to a destination.

5. **Destination details** - Check the box for each destination. When you check each box, options appear to allow you to add additional information.

      ![Send to Log Analytics or Event Hubs](media/diagnostic-settings/send-to-log-analytics-event-hubs.png)

    1. **Log Analytics** - Enter the subscription and workspace.  If you don't have a workspace, you need to [create one before proceeding](../learn/quick-create-workspace.md).

    1. **Event hubs** - Specify the following criteria:
       - The subscription which the event hub is part of
       - The Event hub namespace - If you do not yet have one, you'll need [to create one](../../event-hubs/event-hubs-create.md)
       - An Event hub name (optional) to send all data to. If you don't specify a name, an event hub is created for each log category. If you are sending multiple categories, you may want to specify a name to limit the number of event hubs created. See [Azure Event Hubs quotas and limits](../../event-hubs/event-hubs-quotas.md) for details.
       - An Event Hub policy (optional) A policy defines the permissions that the streaming mechanism has. For more information, see [Event-hubs-features](../../event-hubs/event-hubs-features.md#publisher-policy).

    1. **Storage** - Choose the subscription, storage account, and retention policy.

        ![Send to Storage](media/diagnostic-settings/storage-settings-new.png)

        > [!TIP]
        > Consider setting the retention policy to 0 and manually deleting your data from storage using a scheduled job to avoid possible confusion in the future.
        >
        > First, if you are using storage for archiving, you generally want your data around for more than 365 days. Second, if you choose a retention policy that is greater than 0, the expiration date is attached to the logs at the time of storage. You can't change the date for those logs once stored.
        >
        > For example, if you set the retention policy for *WorkflowRuntime* to 180 days and then 24 hours later set it to 365 days, the logs stored during those first 24 hours will be automatically deleted after 180 days, while all subsequent logs of that type will be automatically deleted after 365 days. Changing the retention policy later doesn't make the first 24 hours of logs stay around for 365 days.

6. Click **Save**.

After a few moments, the new setting appears in your list of settings for this resource, and logs are streamed to the specified destinations as new event data is generated. It may take up to 15 minutes between when an event is emitted and when it [appears in a Log Analytics workspace](data-ingestion-time.md).

## Create diagnostic settings using PowerShell

Use the [Set-AzDiagnosticSetting](https://docs.microsoft.com/powershell/module/az.monitor/set-azdiagnosticsetting) cmdlet to create a diagnostic setting with [Azure PowerShell](powershell-quickstart-samples.md). See the documentation for this cmdlet for descriptions of its parameters.

> [!IMPORTANT]
> You cannot use this method for the Azure Activity log. Instead, use [Create diagnostic setting in Azure Monitor using a Resource Manager template](diagnostic-settings-template.md) to create a Resource Manager template and deploy it with PowerShell.

Following is an example PowerShell cmdlet to create a diagnostic setting using all three destinations.

```powershell
Set-AzDiagnosticSetting -Name KeyVault-Diagnostics -ResourceId /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myresourcegroup/providers/Microsoft.KeyVault/vaults/mykeyvault -Category AuditEvent -MetricCategory AllMetrics -Enabled $true -StorageAccountId /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myresourcegroup/providers/Microsoft.Storage/storageAccounts/mystorageaccount -WorkspaceId /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/oi-default-east-us/providers/microsoft.operationalinsights/workspaces/myworkspace  -EventHubAuthorizationRuleId /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myresourcegroup/providers/Microsoft.EventHub/namespaces/myeventhub/authorizationrules/RootManageSharedAccessKey
```

## Create diagnostic settings using Azure CLI

Use the [az monitor diagnostic-settings create](https://docs.microsoft.com/cli/azure/monitor/diagnostic-settings?view=azure-cli-latest#az-monitor-diagnostic-settings-create) command to create a diagnostic setting with [Azure CLI](https://docs.microsoft.com/cli/azure/monitor?view=azure-cli-latest). See the documentation for this command for descriptions of its parameters.

> [!IMPORTANT]
> You cannot use this method for the Azure Activity log. Instead, use [Create diagnostic setting in Azure Monitor using a Resource Manager template](diagnostic-settings-template.md) to create a Resource Manager template and deploy it with CLI.

Following is an example CLI command to create a diagnostic setting using all three destinations.

```azurecli
az monitor diagnostic-settings create  \
--name KeyVault-Diagnostics \
--resource /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myresourcegroup/providers/Microsoft.KeyVault/vaults/mykeyvault \
--logs    '[{"category": "AuditEvent","enabled": true}]' \
--metrics '[{"category": "AllMetrics","enabled": true}]' \
--storage-account /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myresourcegroup/providers/Microsoft.Storage/storageAccounts/mystorageaccount \
--workspace /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/oi-default-east-us/providers/microsoft.operationalinsights/workspaces/myworkspace \
--event-hub-rule /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myresourcegroup/providers/Microsoft.EventHub/namespaces/myeventhub/authorizationrules/RootManageSharedAccessKey
```

## Configure diagnostic settings using REST API

See [Diagnostic Settings](https://docs.microsoft.com/rest/api/monitor/diagnosticsettings) to create or update diagnostic settings using the [Azure Monitor REST API](https://docs.microsoft.com/rest/api/monitor/).

## Configure diagnostic settings using Resource Manager template

See [Create diagnostic setting in Azure Monitor using a Resource Manager template](diagnostic-settings-template.md) to create or update diagnostic settings with a Resource Manager template.

## Next steps

- [Read more about Azure platform Logs](platform-logs-overview.md)
