---
title: Managing Azure Monitor Logs in Azure CLI
description: Learn how to use Azure CLI commands to manage a workspace in Azure Monitor Logs, including how workspaces interact with other Azure services.
ms.topic: sample
ms.date: 08/09/2023
ms.custom: devx-track-azurecli

---
# Managing Azure Monitor Logs in Azure CLI

Use the Azure CLI commands described here to manage your log analytics workspace in Azure Monitor.

[!INCLUDE [Prepare your Azure CLI environment](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Create a workspace for Monitor Logs

Run the [az group create](/cli/azure/group#az-group-create) command to create a resource group or use an existing resource group. To create a workspace, use the [az monitor log-analytics workspace create](/cli/azure/monitor/log-analytics/workspace#az-monitor-log-analytics-workspace-create) command.

```azurecli
az group create --name ContosoRG --location eastus2
az monitor log-analytics workspace create --resource-group ContosoRG \
   --workspace-name ContosoWorkspace
```

For more information about workspaces, see [Azure Monitor Logs overview](./data-platform-logs.md).

## List tables in your workspace

Each workspace contains tables with columns that have multiple rows of data. Each table is defined by a unique set of columns of data provided by the data source.

To see the tables in your workspace, use the [az monitor log-analytics workspace table list](/cli/azure/monitor/log-analytics/workspace/table#az-monitor-log-analytics-workspace-table-list) command:

```azurecli
az monitor log-analytics workspace table list --resource-group ContosoRG \
   --workspace-name ContosoWorkspace --output table
```

The output value `table` presents the results in a more readable format. For more information, see [Output formatting](/cli/azure/use-cli-effectively#output-formatting).

To change the retention time for a table, run the [az monitor log-analytics workspace table update](/cli/azure/monitor/log-analytics/workspace/table#az-monitor-log-analytics-workspace-table-update) command:

```azurecli
az monitor log-analytics workspace table update --resource-group ContosoRG \
   --workspace-name ContosoWorkspace --name Syslog --retention-time 45
```

The retention time is between 30 and 730 days.

For more information about tables, see [Data structure](./log-analytics-workspace-overview.md#data-structure).

## Delete a table

You can delete [Custom Log](logs-ingestion-api-overview.md), [Search Results](search-jobs.md) and [Restored Logs](restore.md) tables.

To delete a table, run the [az monitor log-analytics workspace table delete](/cli/azure/monitor/log-analytics/workspace/table#az-monitor-log-analytics-workspace-data-export-delete) command:

```azurecli
az monitor log-analytics workspace table delete –subscription ContosoSID --resource-group ContosoRG --workspace-name ContosoWorkspace --name MySearchTable_SRCH
```

## Export data from selected tables

You can continuously export data from selected tables to an Azure storage account or Azure Event Hubs. Use the [az monitor log-analytics workspace data-export create](/cli/azure/monitor/log-analytics/workspace/data-export#az-monitor-log-analytics-workspace-data-export-create) command:

```azurecli
az monitor log-analytics workspace data-export create --resource-group ContosoRG \
   --workspace-name ContosoWorkspace --name DataExport --table Syslog \
   --destination /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/ContosoRG/providers/Microsoft.Storage/storageAccounts/exportaccount \
   --enable
```

To see your data exports, run the [az monitor log-analytics workspace data-export list](/cli/azure/monitor/log-analytics/workspace/data-export#az-monitor-log-analytics-workspace-data-export-list) command.

```azurecli
az monitor log-analytics workspace data-export list --resource-group ContosoRG \
   --workspace-name ContosoWorkspace --output table
```

To delete a data export, run the [az monitor log-analytics workspace data-export delete](/cli/azure/monitor/log-analytics/workspace/data-export#az-monitor-log-analytics-workspace-data-export-delete) command. The `--yes` parameter skips confirmation.

```azurecli
az monitor log-analytics workspace data-export delete --resource-group ContosoRG \
   --workspace-name ContosoWorkspace --name DataExport --yes
```

For more information about data export, see [Log Analytics workspace data export in Azure Monitor](./logs-data-export.md).


## Manage a linked service

Linked services define a relation from the workspace to another Azure resource. Azure Monitor Logs and Azure resources use this connection in their operations. Example uses of linked services, including an automation account and a workspace association to customer-managed keys.

To create a linked service, run the [az monitor log-analytics workspace linked-service create](/cli/azure/monitor/log-analytics/workspace/linked-service#az-monitor-log-analytics-workspace-linked-service-create) command:

```azurecli
az monitor log-analytics workspace linked-service create --resource-group ContosoRG \
   --workspace-name ContosoWorkspace --name linkedautomation \
   --resource-id /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/ContosoRG/providers/Microsoft.Web/sites/ContosoWebApp09

az monitor log-analytics workspace linked-service list --resource-group ContosoRG \
   --workspace-name ContosoWorkspace
```

To remove a linked service relation, run the [az monitor log-analytics workspace linked-service delete](/cli/azure/monitor/log-analytics/workspace/linked-service#az-monitor-log-analytics-workspace-linked-service-delete) command:

```azurecli
az monitor log-analytics workspace linked-service delete --resource-group ContosoRG \
   --workspace-name ContosoWorkspace --name linkedautomation
```

For more information, see [az monitor log-analytics workspace linked-service](/cli/azure/monitor/log-analytics/workspace/linked-service).

## Manage linked storage

If you provide and manage your own storage account for log analytics, you can manage it with these Azure CLI commands.

To link your workspace to a storage account, run the [az monitor log-analytics workspace linked-storage create](/cli/azure/monitor/log-analytics/workspace/linked-storage#az-monitor-log-analytics-workspace-linked-storage-create) command:

```azurecli
az monitor log-analytics workspace linked-storage create --resource-group ContosoRG \
   --workspace-name ContosoWorkspace \
   --storage-accounts /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/ContosoRG/providers/Microsoft.Storage/storageAccounts/contosostorage \
   --type Alerts

az monitor log-analytics workspace linked-storage list --resource-group ContosoRG \
   --workspace-name ContosoWorkspace --output table
```

To remove the link to a storage account, run the [az monitor log-analytics workspace linked-storage delete](/cli/azure/monitor/log-analytics/workspace/linked-storage#az-monitor-log-analytics-workspace-linked-storage-delete) command:

```azurecli
az monitor log-analytics workspace linked-storage delete --resource-group ContosoRG \
   --workspace-name ContosoWorkspace --type Alerts
```

For more information, see, [Using customer-managed storage accounts in Azure Monitor Log Analytics](./private-storage.md).

## Manage intelligence packs

To see the available intelligence packs, run the [az monitor log-analytics workspace pack list](/cli/azure/monitor/log-analytics/workspace/pack#az-monitor-log-analytics-workspace-pack-list) command. The command also tells you whether the pack is enabled.

```azurecli
az monitor log-analytics workspace pack list --resource-group ContosoRG \
   --workspace-name ContosoWorkspace
```

Use the [az monitor log-analytics workspace pack enable](/cli/azure/monitor/log-analytics/workspace/pack#az-monitor-log-analytics-workspace-pack-enable) or [az monitor log-analytics workspace pack disable](/cli/azure/monitor/log-analytics/workspace/pack#az-monitor-log-analytics-workspace-pack-disable) commands:

```azurecli
az monitor log-analytics workspace pack enable --resource-group ContosoRG \
   --workspace-name ContosoWorkspace --name NetFlow

az monitor log-analytics workspace pack disable --resource-group ContosoRG \
   --workspace-name ContosoWorkspace --name NetFlow
```

## Manage saved searches

To create a saved search, run the [az monitor log-analytics workspace saved-search](/cli/azure/monitor/log-analytics/workspace/saved-search#az-monitor-log-analytics-workspace-saved-search-create) command:

```azurecli
az monitor log-analytics workspace saved-search create --resource-group ContosoRG \
   --workspace-name ContosoWorkspace --name SavedSearch01 \
   --category "Log Management" --display-name SavedSearch01 \
   --saved-query "AzureActivity | summarize count() by bin(TimeGenerated, 1h)" --fa Function01 --fp "a:string = value"
```

View your saved search by using the [az monitor log-analytics workspace saved-search show](/cli/azure/monitor/log-analytics/workspace/saved-search#az-monitor-log-analytics-workspace-saved-search-show) command. See all saved searches by using [az monitor log-analytics workspace saved-search list](/cli/azure/monitor/log-analytics/workspace/saved-search#az-monitor-log-analytics-workspace-saved-search-list).

```azurecli
az monitor log-analytics workspace saved-search show --resource-group ContosoRG \
   --workspace-name ContosoWorkspace --name SavedSearch01
az monitor log-analytics workspace saved-search list --resource-group ContosoRG \
   --workspace-name ContosoWorkspace
```

To delete a saved search, run the [az monitor log-analytics workspace saved-search delete](/cli/azure/monitor/log-analytics/workspace/saved-search#az-monitor-log-analytics-workspace-saved-search-delete) command:

```azurecli
az monitor log-analytics workspace saved-search delete --resource-group ContosoRG \
   --workspace-name ContosoWorkspace --name SavedSearch01 --yes
```

## Clean up deployment

If you created a resource group to test these commands, you can remove the resource group and all its contents by using the [az group delete](/cli/azure/group#az-group-delete) command:

```azurecli
az group delete --name ContosoRG
```

If you want to remove a new workspace from an existing resource group, run the [az monitor log-analytics workspace delete](/cli/azure/monitor/log-analytics/workspace#az-monitor-log-analytics-workspace-delete) command:

```azurecli
az monitor log-analytics workspace delete --resource-group ContosoRG 
   --workspace-name ContosoWorkspace --yes
```

Log analytics workspaces have a soft delete option. You can recover a deleted workspace for two weeks after deletion. Run the [az monitor log-analytics workspace recover](/cli/azure/monitor/log-analytics/workspace#az-monitor-log-analytics-workspace-recover) command:

```azurecli
az monitor log-analytics workspace recover --resource-group ContosoRG 
   --workspace-name ContosoWorkspace
```

In the delete command, add the `--force` parameter to delete the workspace immediately.

## Azure CLI commands used in this article

- [az group create](/cli/azure/group#az-group-create)
- [az group delete](/cli/azure/group#az-group-delete)
- [az monitor log-analytics workspace create](/cli/azure/monitor/log-analytics/workspace#az-monitor-log-analytics-workspace-create)
- [az monitor log-analytics workspace data-export create](/cli/azure/monitor/log-analytics/workspace/data-export#az-monitor-log-analytics-workspace-data-export-create)
- [az monitor log-analytics workspace data-export delete](/cli/azure/monitor/log-analytics/workspace/data-export#az-monitor-log-analytics-workspace-data-export-delete)
- [az monitor log-analytics workspace data-export list](/cli/azure/monitor/log-analytics/workspace/data-export#az-monitor-log-analytics-workspace-data-export-list)
- [az monitor log-analytics workspace delete](/cli/azure/monitor/log-analytics/workspace#az-monitor-log-analytics-workspace-delete)
- [az monitor log-analytics workspace linked-service create](/cli/azure/monitor/log-analytics/workspace/linked-service#az-monitor-log-analytics-workspace-linked-service-create)
- [az monitor log-analytics workspace linked-service delete](/cli/azure/monitor/log-analytics/workspace/linked-service#az-monitor-log-analytics-workspace-linked-service-delete)
- [az monitor log-analytics workspace linked-storage create](/cli/azure/monitor/log-analytics/workspace/linked-storage#az-monitor-log-analytics-workspace-linked-storage-create)
- [az monitor log-analytics workspace linked-storage delete](/cli/azure/monitor/log-analytics/workspace/linked-storage#az-monitor-log-analytics-workspace-linked-storage-delete)
- [az monitor log-analytics workspace pack disable](/cli/azure/monitor/log-analytics/workspace/pack#az-monitor-log-analytics-workspace-pack-disable)
- [az monitor log-analytics workspace pack enable](/cli/azure/monitor/log-analytics/workspace/pack#az-monitor-log-analytics-workspace-pack-enable)
- [az monitor log-analytics workspace pack list](/cli/azure/monitor/log-analytics/workspace/pack#az-monitor-log-analytics-workspace-pack-list)
- [az monitor log-analytics workspace recover](/cli/azure/monitor/log-analytics/workspace#az-monitor-log-analytics-workspace-recover)
- [az monitor log-analytics workspace saved-search delete](/cli/azure/monitor/log-analytics/workspace/saved-search#az-monitor-log-analytics-workspace-saved-search-delete)
- [az monitor log-analytics workspace saved-search list](/cli/azure/monitor/log-analytics/workspace/saved-search#az-monitor-log-analytics-workspace-saved-search-list)
- [az monitor log-analytics workspace saved-search show](/cli/azure/monitor/log-analytics/workspace/saved-search#az-monitor-log-analytics-workspace-saved-search-show)
- [az monitor log-analytics workspace saved-search](/cli/azure/monitor/log-analytics/workspace/saved-search#az-monitor-log-analytics-workspace-saved-search-create)
- [az monitor log-analytics workspace table list](/cli/azure/monitor/log-analytics/workspace/table#az-monitor-log-analytics-workspace-table-list)
- [az monitor log-analytics workspace table update](/cli/azure/monitor/log-analytics/workspace/table#az-monitor-log-analytics-workspace-table-update)

## Next steps

[Overview of Log Analytics in Azure Monitor](log-analytics-overview.md)
