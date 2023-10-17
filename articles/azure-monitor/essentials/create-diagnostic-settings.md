---
title: Create diagnostic settings in Azure Monitor
description: Learn how to send Azure Monitor platform metrics and logs to Azure Monitor Logs, Azure Storage, or Azure Event Hubs with diagnostic settings.
author: rboucher
ms.author: robb
services: azure-monitor
ms.topic: how-to
ms.custom: devx-track-azurecli, devx-track-azurepowershell
ms.date: 10/17/2023
ms.reviewer: lualderm
---

# Create diagnostic settings in Azure Monitor

Create and edit diagnostic settings in Azure Monitor to send Azure platform metrics and logs to different destinations like Azure Monitor Logs, Azure Storage, or Azure Event Hubs. You can use different methods to work with the diagnostic settings, such as the Azure portal, the Azure CLI, PowerShell, and Azure Resource Manager.

# [Azure portal](#tab/portal)

You can configure diagnostic settings in the Azure portal either from the Azure Monitor menu or from the menu for the resource.

1. Where you configure diagnostic settings in the Azure portal depends on the resource:

   - For a single resource, select **Diagnostic settings** under **Monitoring** on the resource's menu.

      :::image type="content" source="media/diagnostic-settings/menu-resource.png" alt-text="Screenshot that shows the Monitoring section of a resource menu in the Azure portal with Diagnostic settings highlighted." border="false":::

   - For one or more resources, select **Diagnostic settings** under **Settings** on the Azure Monitor menu and then select the resource.

      :::image type="content" source="media/diagnostic-settings/menu-monitor.png" alt-text="Screenshot that shows the Settings section in the Azure Monitor menu with Diagnostic settings highlighted."border="false":::

   - For the activity log, select **Activity log** on the **Azure Monitor** menu and then select **Export Activity Logs**. Make sure you disable any legacy configuration for the activity log. For instructions, see [Disable existing settings](./activity-log.md#legacy-collection-methods).

      :::image type="content" source="media/diagnostic-settings/menu-activity-log.png" alt-text="Screenshot that shows the Azure Monitor menu with Activity log selected and Export activity logs highlighted in the Monitor-Activity log menu bar.":::

1. If no settings exist on the resource you select, you're prompted to create a setting. Select **Add diagnostic setting**.

   :::image type="content" source="media/diagnostic-settings/add-setting.png" alt-text="Screenshot that shows the Add diagnostic setting with no existing settings.":::

   If there are existing settings on the resource, you see a list of settings already configured. Select **Add diagnostic setting** to add a new setting. Or select **Edit setting** to edit an existing one. Each setting can have no more than one of each of the destination types.

   :::image type="Add diagnostic setting - existing settings" source="media/diagnostic-settings/edit-setting.png" alt-text="Screenshot that shows adding a diagnostic setting for existing settings.":::

1. Give your setting a name if it doesn't already have one.

   :::image type="Add diagnostic setting" source="media/diagnostic-settings/setting-new-blank.png" alt-text="Screenshot that shows Diagnostic setting name.":::

1. **Logs and metrics to route**: For logs, either choose a category group or select the individual checkboxes for each category of data you want to send to the destinations specified later. The list of categories varies for each Azure service. Select **AllMetrics** if you want to store metrics in Azure Monitor Logs too.

1. **Destination details**: Select the checkbox for each destination. Options appear so that you can add more information.

   :::image type="content" source="media/diagnostic-settings/send-to-log-analytics-event-hubs.png" alt-text="Screenshot that shows Send to Log Analytics and Stream to an event hub." border="false":::

   1. **Log Analytics**: Enter the subscription and workspace. If you don't have a workspace, you must [create one before you proceed](../logs/quick-create-workspace.md).

   1. **Event Hubs**: Specify the following criteria:

      - **Subscription**: The subscription that the event hub is part of.
      - **Event hub namespace**: If you don't have one, you must [create one](../../event-hubs/event-hubs-create.md).
      - **Event hub name (optional)**: The name to send all data to. If you don't specify a name, an event hub is created for each log category. If you're sending to multiple categories, you might want to specify a name to limit the number of event hubs created. For more information, see [Azure Event Hubs quotas and limits](../../event-hubs/event-hubs-quotas.md).
      - **Event hub policy name** (also optional): A policy defines the permissions that the streaming mechanism has. For more information, see [Event Hubs features](../../event-hubs/event-hubs-features.md#publisher-policy).

   1. **Archive to a storage account**: Select your **Subscription** and the **Storage account** where you want to store the data.

      :::image type="content" source="media/diagnostic-settings/storage-settings-new.png" alt-text="Screenshot that shows storage category and destination details." lightbox="media/diagnostic-settings/storage-settings-new.png":::

      > [!TIP]
      > Use the [Azure Storage Lifecycle Policy](../../storage/blobs/lifecycle-management-policy-configure.md?tabs=azure-portal) to manage the length of time that your logs are retained. The Retention Policy as set in the Diagnostic Setting settings is now deprecated.

   1. **Partner integration**: You must first install partner integration into your subscription. Configuration options vary by partner. For more information, see [Azure Monitor partner integrations](../../partner-solutions/overview.md).

1. If the service supports both [resource-specific](resource-logs.md#resource-specific) and [Azure diagnostics](resource-logs.md#azure-diagnostics-mode) mode, then an option to select the [destination table](resource-logs.md#select-the-collection-mode) displays when you select **Log Analytics workspace** as a destination. You should usually select **Resource specific** since the table structure allows for more flexibility and more efficient queries.

   :::image type="content" source="media/diagnostic-settings/destination-table.png" alt-text="Screenshot of the dialog box to set the destination table.":::

1. Select **Save**.

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
> You can't use this method for an activity log. Instead, use [Create diagnostic setting in Azure Monitor by using a Resource Manager template](./resource-manager-diagnostic-settings.md) to create a Resource Manager template and deploy it with the Azure CLI.

The following example command creates a diagnostic setting by using all three destinations. The syntax is slightly different depending on your client.

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

The following JSON template provides an example for creating a diagnostic setting to send all audit flogs to a log analytics workspace. Keep in mind that the `apiVersion` can change depending on the resource in the scope.

**Template file**

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "scope": {
        "type": "string"
    },
    "workspaceId": {
        "type": "string"
    },
    "settingName": {
        "type": "string"
    }
},
  "resources": [
    {
      "type": "Microsoft.Insights/diagnosticSettings",
      "apiVersion": "2021-05-01-preview",
      "scope": "[parameters('scope')]",
      "name": "[parameters('settingName')]",
      "properties": {
       "workspaceId": "[parameters('workspaceId')]",
      "logs": [
             {
            "category": null,
            "categoryGroup": "audit",
            "enabled": true,
            "retentionPolicy": {
              "enabled": false,
              "days": 0
            }
          }
        ]
      }
    }
  ]
  }
```

**Parameter file**

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "settingName": {
        "value": "audit3"
    },
    "workspaceId": {
      "value": "/subscriptions/<subscription id>/resourcegroups/<resourcegroup name>/providers/microsoft.operationalinsights/workspaces/<workspace name>"
    },
    "scope": {
      "value": "Microsoft.<resource type>/<resourceName>"
    }
  }
}
```

# [REST API](#tab/api)

To create or update diagnostic settings by using the [Azure Monitor REST API](/rest/api/monitor/), see [Diagnostic settings](/rest/api/monitor/diagnosticsettings).


# [Azure Policy](#tab/policy)

For details on using Azure Policy to create diagnostic settings at scale, see [Create diagnostic settings at scale by using Azure Policy](diagnostic-settings-policy.md).

---

## Next steps

- [Review how to work with diagnostic settings in Azure Monitor](./diagnostic-settings.md)

- [Read more about Azure platform logs](./platform-logs-overview.md)
