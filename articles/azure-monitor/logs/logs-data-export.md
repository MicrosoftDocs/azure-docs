---
title: Log Analytics workspace data export in Azure Monitor
description: Log Analytics workspace data export in Azure Monitor lets you continuously export data per selected tables in your workspace, to an Azure Storage Account or Azure Event Hubs as it's collected. 
ms.topic: conceptual
ms.custom: references_regions, devx-track-azurecli, devx-track-azurepowershell
author: yossi-y
ms.author: yossiy
ms.date: 02/09/2022

---

# Log Analytics workspace data export in Azure Monitor
Data export in Log Analytics workspace lets you continuously export data per selected tables in your workspace, to an Azure Storage Account or Azure Event Hubs as it arrives to Azure Monitor pipeline. This article provides details on this feature and steps to configure data export in your workspaces.

## Overview
Data in Log Analytics is available for the retention period defined in your workspace, and used in various experiences provided in Azure Monitor and Azure services. There are cases where you need to use other tools:
* Tamper protected store compliance – data can't be altered in Log Analytics once ingested, but can be purged. Export to Storage Account set with [immutability policies](../../storage/blobs/immutable-policy-configure-version-scope.md) to keep data tamper protected.
*  Integration with Azure services and other tools – export to Event Hubs as data arrives and is processed in Azure Monitor.
*  Keep audit and security data for very long time – export to Storage Account in the workspace's region, or replicate data to other regions using any of the [Azure Storage redundancy options](../../storage/common/storage-redundancy.md#redundancy-in-a-secondary-region) including "GRS" and "GZRS".

Once you've configured data export rules in Log Analytics workspace, new data for tables in rules is exported from Azure Monitor pipeline to your Storage Account or Event Hubs as it arrives.

[![Data export overview](media/logs-data-export/data-export-overview.png "Screenshot of data export flow diagram.")](media/logs-data-export/data-export-overview.png#lightbox)

Data is exported without a filter. For example, when you configure a data export rule for *SecurityEvent* table, all data sent to the *SecurityEvent* table is exported starting from the configuration time.


## Other export options
Log Analytics workspace data export continuously exports data that is sent to your Log Analytics workspace. There are other options to export data for particular scenarios:

- Configure Diagnostic Settings in Azure resources. Logs are sent to destination directly and has lower latency compared to data export in Log Analytics.
- Schedule export of data based on a log query you define with the [Log Analytics query API](/rest/api/loganalytics/dataaccess/query/execute). Use services such as Azure Data Factory, Azure Functions, or Azure Logic App to orchestrate queries in your workspace and export data to a destination. This is similar to the data export feature, but allows you to export historical data from your workspace, using filters and aggregation. This method is subject to [log query limits](../service-limits.md#log-analytics-workspaces) and not intended for scale. See [Archive data from Log Analytics workspace to Azure Storage Account using Logic App](logs-export-logic-app.md).
- One time export to local machine using PowerShell script. See [Invoke-AzOperationalInsightsQueryExport](https://www.powershellgallery.com/packages/Invoke-AzOperationalInsightsQueryExport).

## Limitations

- All tables will be supported in export, but currently limited to those specified in the [supported tables](#supported-tables) section.
- Legacy custom log using the [HTTP Data Collector API](./data-collector-api.md) won’t be supported in export, while data for [DCR based custom logs](./logs-ingestion-api-overview.md) can be exported. 
- You can define up to 10 enabled rules in your workspace. More rules are allowed when disabled. 
- Destinations must be in the same region as the Log Analytics workspace.
- Storage Account must be unique across rules in workspace.
- Tables names can be 60 characters long when exporting to Storage Account, and 47 characters to Event Hubs. Tables with longer names won't be exported.
- Data export isn't supported in China currently.

## Data completeness
Data export is optimized for moving large data volume to your destinations, and in certain retry conditions, can include a fraction of duplicated records. The export operation could fail when ingress limits are reached, see details under [Create or update data export rule](#create-or-update-data-export-rule). In such case, a retry continues for up to 30 minutes, and if destination is unavailable yet, data will be discarded until destination becomes available.

## Pricing model
Data export charges are based on the volume of data exported measured in bytes. The size of data exported by Log Analytics Data Export is the number of bytes in the exported JSON formatted data. Data volume is measured in GB (10^9 bytes)

For more information, including the data export billing timeline, see [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/).

## Export destinations

Data export destination must be available before creating export rules in your workspace. Destinations don't have to be in the same subscription as your workspace. When using Azure Lighthouse, it is also possible send data to destinations in another Azure Active Directory tenant.

You need to have 'write' permissions to both workspace and destination to configure data export rule on any table in workspace. The shared access policy for the Event Hubs namespace defines the permissions that the streaming mechanism has. Streaming to Event Hubs requires Manage, Send, and Listen permissions. To update the export rule, you must have the ListKey permission on that Event Hubs authorization rule.

### Storage Account

Don't use an existing Storage Account that has other, non-monitoring data to better control access to the data, and prevent reaching storage ingress rate limit, failures, and latency. 

To send data to immutable Storage Account, set the immutable policy for the Storage Account as described in [Set and manage immutability policies for Blob storage](../../storage/blobs/immutable-policy-configure-version-scope.md). You must follow all steps in this article, including enabling protected append blobs writes.

The Storage Account must be StorageV1 or above and in the same region as your workspace. If you need to replicate your data to other Storage Accounts in other regions, you can use any of the [Azure storage redundancy options](../../storage/common/storage-redundancy.md#redundancy-in-a-secondary-region), including "GRS" and "GZRS".

Data is sent to Storage Accounts as it reaches Azure Monitor and exported to destinations located in workspace region. A container is created for each table in Storage Account, with the name *am-* followed by the name of the table. For example, the table *SecurityEvent* would send to a container named *am-SecurityEvent*.

Blobs are stored in 5-minute folders in path structure: *WorkspaceResourceId=/subscriptions/subscription-id/resourcegroups/\<resource-group\>/providers/microsoft.operationalinsights/workspaces/\<workspace\>/y=\<four-digit numeric year\>/m=\<two-digit numeric month\>/d=\<two-digit numeric day\>/h=\<two-digit 24-hour clock hour\>/m=\<two-digit 60-minute clock minute\>/PT05M.json*. Appends to blobs are limited to 50-K writes. More blobs will be added in folder as: PT05M_#.json*, where # is incremental blob count.

The format of blobs in Storage Account is in [JSON lines](../essentials/resource-logs-blob-format.md), where each record is delimited by a newline, with no outer records array and no commas between JSON records. 

[![Storage sample data](media/logs-data-export/storage-data.png "Screenshot of data format in blob.")](media/logs-data-export/storage-data-expand.png#lightbox)

### Event Hubs

Don't use an existing Event Hubs that has, non-monitoring data to prevent reaching Event Hubs namespace ingress rate limit, failures, and latency.

Data is sent to your Event Hubs as it reaches Azure Monitor and exported to destinations located in workspace region. You can create multiple export rules to the same Event Hubs namespace by providing different `event hub name` in rule. When `event hub name` isn't provided, default Event Hubs is created for tables that you export with name: *am-* followed by the name of the table. For example, the table *SecurityEvent* would be sent to an Event Hubs named: *am-SecurityEvent*. The [number of supported Event Hubs in 'Basic' and 'Standard' namespaces tiers is 10](../../event-hubs/event-hubs-quotas.md#common-limits-for-all-tiers). When exporting more than 10 tables to these tiers, either split the tables between several export rules, to different Event Hubs namespaces, or provide an Event Hubs name to export all tables to it.

> [!NOTE]
> - 'Basic' Event Hubs namespace tier is limited – it supports [lower event size](../../event-hubs/event-hubs-quotas.md#basic-vs-standard-vs-premium-vs-dedicated-tiers) and no [Auto-inflate](../../event-hubs/event-hubs-auto-inflate.md) option to automatically scale up and increase the number of throughput units. Since data volume to your workspace increases over time and consequence Event Hubs scaling is required, use 'Standard', 'Premium' or 'Dedicated' Event Hubs tiers with **Auto-inflate** feature enabled. See [Automatically scale up Azure Event Hubs throughput units](../../event-hubs/event-hubs-auto-inflate.md).
> - Data export can't reach Event Hubs resources when virtual networks are enabled. You have to enable the **Allow trusted Microsoft services** to bypass this firewall setting in event hub, to grant access to your Event Hubs.

## Enable data export
The following steps must be performed to enable Log Analytics data export. See the following sections for more details on each.

- Register resource provider.
- Allow trusted Microsoft services.
- Create one or more data export rules that define the tables to export and their destination.

### Register resource provider
Azure resource provider Microsoft.Insights needs to be registered in your subscription to enable Log Analytics data export.

This resource provider is probably already registered for most Azure Monitor users. To verify, go to **Subscriptions** in the Azure portal. Select your subscription and then click **Resource providers** in the **Settings** section of the menu. Locate **Microsoft.Insights**. If its status is **Registered**, then it's already registered. If not, click **Register** to register it.

You can also use any of the available methods to register a resource provider as described in [Azure resource providers and types](../../azure-resource-manager/management/resource-providers-and-types.md). Following is a sample command using CLI:

```azurecli
az provider register --namespace 'Microsoft.insights'
```

Following is a sample command using PowerShell:

```PowerShell
Register-AzResourceProvider -ProviderNamespace Microsoft.insights
```

### Allow trusted Microsoft services
If you have configured your Storage Account to allow access from selected networks, you need to add an exception to allow Azure Monitor to write to the account. From **Firewalls and virtual networks** for your Storage Account, select **Allow trusted Microsoft services to access this Storage Account**.

[![Storage Account firewalls and networks](media/logs-data-export/storage-account-network.png "Screenshot of allow trusted Microsoft services.")](media/logs-data-export/storage-account-network.png#lightbox)

### Monitor destinations 

> [!IMPORTANT]
> Export destinations have limits and should be monitored to minimize throttling, failures, and latency. See [Storage Accounts scalability](../../storage/common/scalability-targets-standard-account.md#scale-targets-for-standard-storage-accounts) and [Event Hubs namespace quota](../../event-hubs/event-hubs-quotas.md). 

**Monitoring Storage Account**

1. Use separate Storage Account for export
2. Configure alert on the metric: 

    | Scope | Metric Namespace | Metric | Aggregation | Threshold |
    |:---|:---|:---|:---|:---|
    | storage-name | Account | Ingress | Sum | 80% of max ingress per alert evaluation period. For example: limit is 60 Gbps for general-purpose v2 in West US. Threshold is 14,400 Gb per 5-minutes evaluation period |
  
3. Alert remediation actions
    - Use separate Storage Account for export that isn't shared with non-monitoring data.
    - Azure Storage standard accounts support higher ingress limit by request. To request an increase, contact [Azure Support](https://azure.microsoft.com/support/faq/).
    - Split tables between more Storage Accounts.

**Monitoring Event Hubs**

1. Configure alerts on the [metrics](../../event-hubs/monitor-event-hubs-reference.md):
  
    | Scope | Metric Namespace | Metric | Aggregation | Threshold |
    |:---|:---|:---|:---|:---|
    | namespaces-name | Event Hubs standard metrics | Incoming bytes | Sum | 80% of max ingress per alert evaluation period. For example, limit is 1 MB/s per unit ("TU" or "PU") and five units used. Threshold is 1200 MB per 5-minutes evaluation period |
    | namespaces-name | Event Hubs standard metrics | Incoming requests | Count | 80% of max events per alert evaluation period. For example, limit is 1000/s per unit ("TU" or ""PU") and five units used. Threshold is 1200000 per 5-minutes evaluation period |
    | namespaces-name | Event Hubs standard metrics | Quota Exceeded Errors | Count | Between 1% of request. For example, requests per 5-minute is 600000. Threshold is 6000 per 5-minute evaluation period |

2. Alert remediation actions
   - Use separate Event Hubs namespace for export that isn't shared with non-monitoring data.
   - Configure [Auto-inflate](../../event-hubs/event-hubs-auto-inflate.md) feature to automatically scale up and increase the number of throughput units to meet usage needs
   - Verify increase of throughput units to accommodate data volume
   - Split tables between more namespaces
   - Use 'Premium' or 'Dedicated' tiers for higher throughput

### Create or update data export rule
Data export rule defines the destination and tables for which data is exported. You can create 10 rules in 'enable' state in your workspace, more rules are allowed in 'disable' state. Storage Account must be unique across rules in workspace. Multiple rules can use the same Event Hubs namespace when sending to separate Event Hubs.

> [!NOTE]
> - You can include tables that aren't yet supported in rules, but no data will be exported for these until tables get supported.
> - Export to Storage Account - a separate container is created in Storage Account for each table.
> - Export to Event Hubs - if Event Hubs name isn't provided, a separate Event Hubs is created for each table. The [number of supported Event Hubs in 'Basic' and 'Standard' namespaces tiers is 10](../../event-hubs/event-hubs-quotas.md#common-limits-for-all-tiers). When exporting more than 10 tables to these tiers, either split the tables between several export rules to different Event Hubs namespaces, or provide an Event Hubs name in the rule to export all tables to it.

# [Azure portal](#tab/portal)

In the **Log Analytics workspace** menu in the Azure portal, select **Data Export** from the **Settings** section and click **New export rule** from the top of the middle pane.

[![export create](media/logs-data-export/export-create-1.png "Screenshot of data export entry point.")](media/logs-data-export/export-create-1.png#lightbox)

Follow the steps, then click **Create**. 

<img src="media/logs-data-export/export-create-2.png" alt="Screenshot of data export rule configuration." title="Export rule configuration" width="80%"/>


# [PowerShell](#tab/powershell)

Use the following command to create a data export rule to a Storage Account using PowerShell. A separate container is created for each table.

```powershell
$storageAccountResourceId = '/subscriptions/subscription-id/resourceGroups/resource-group-name/providers/Microsoft.Storage/storageAccounts/storage-account-name'
New-AzOperationalInsightsDataExport -ResourceGroupName resourceGroupName -WorkspaceName workspaceName -DataExportName 'ruleName' -TableName 'SecurityEvent,Heartbeat' -ResourceId $storageAccountResourceId
```

Use the following command to create a data export rule to a specific Event Hubs using PowerShell. All tables are exported to the provided Event Hubs name and can be filtered by "Type" field to separate tables.

```powershell
$eventHubResourceId = '/subscriptions/subscription-id/resourceGroups/resource-group-name/providers/Microsoft.EventHub/namespaces/namespaces-name/eventhubs/eventhub-name'
New-AzOperationalInsightsDataExport -ResourceGroupName resourceGroupName -WorkspaceName workspaceName -DataExportName 'ruleName' -TableName 'SecurityEvent,Heartbeat' -ResourceId $eventHubResourceId -EventHubName EventhubName
```

Use the following command to create a data export rule to an Event Hubs using PowerShell. When specific Event Hubs name isn't provided, a separate container is created for each table, up to the [number of Event Hubs supported in Event Hubs tier](../../event-hubs/event-hubs-quotas.md#common-limits-for-all-tiers). To export more tables, provide an Event Hubs name in rule, or set another rule and export the remaining tables to another Event Hubs namespace.

```powershell
$eventHubResourceId = '/subscriptions/subscription-id/resourceGroups/resource-group-name/providers/Microsoft.EventHub/namespaces/namespaces-name'
New-AzOperationalInsightsDataExport -ResourceGroupName resourceGroupName -WorkspaceName workspaceName -DataExportName 'ruleName' -TableName 'SecurityEvent,Heartbeat' -ResourceId $eventHubResourceId
```

# [Azure CLI](#tab/azure-cli)

Use the following command to create a data export rule to a Storage Account using CLI. A separate container is created for each table.

```azurecli
$storageAccountResourceId = '/subscriptions/subscription-id/resourceGroups/resource-group-name/providers/Microsoft.Storage/storageAccounts/storage-account-name'
az monitor log-analytics workspace data-export create --resource-group resourceGroupName --workspace-name workspaceName --name ruleName --tables SecurityEvent Heartbeat --destination $storageAccountResourceId
```

Use the following command to create a data export rule to a specific Event Hubs using CLI. All tables are exported to the provided Event Hubs name and can be filtered by "Type" field to separate tables.

```azurecli
$eventHubResourceId = '/subscriptions/subscription-id/resourceGroups/resource-group-name/providers/Microsoft.EventHub/namespaces/namespaces-name/eventhubs/eventhub-name'
az monitor log-analytics workspace data-export create --resource-group resourceGroupName --workspace-name workspaceName --name ruleName --tables SecurityEvent Heartbeat --destination $eventHubResourceId
```

Use the following command to create a data export rule to an Event Hubs using CLI. When specific Event Hubs name isn't provided, a separate container is created for each table up to the [number of supported Event Hubs for your Event Hubs tier](../../event-hubs/event-hubs-quotas.md#common-limits-for-all-tiers). If you have more tables to export, provide Event Hubs name to export any number of tables, or set another rule to export the remaining tables to another Event Hubs namespace.

```azurecli
$eventHubsNamespacesResourceId = '/subscriptions/subscription-id/resourceGroups/resource-group-name/providers/Microsoft.EventHub/namespaces/namespaces-name'
az monitor log-analytics workspace data-export create --resource-group resourceGroupName --workspace-name workspaceName --name ruleName --tables SecurityEvent Heartbeat --destination $eventHubsNamespacesResourceId
```

# [REST](#tab/rest)

Use the following request to create a data export rule a Storage Account using the REST API. A separate container is created for each table. The request should use bearer token authorization and content type application/json.

```rest
PUT https://management.azure.com/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/Microsoft.operationalInsights/workspaces/<workspace-name>/dataexports/<data-export-name>?api-version=2020-08-01
```

The body of the request specifies the tables destination. Following is a sample body for the REST request.

```json
{
    "properties": {
        "destination": {
            "resourceId": "/subscriptions/subscription-id/resourcegroups/resource-group-name/providers/Microsoft.Storage/storageAccounts/storage-account-name"
        },
        "tablenames": [
            "table1",
            "table2" 
        ],
        "enable": true
    }
}
```

Following is a sample body for the REST request for an Event Hubs.

```json
{
    "properties": {
        "destination": {
            "resourceId": "/subscriptions/subscription-id/resourcegroups/resource-group-name/providers/Microsoft.EventHub/namespaces/eventhub-namespaces-name"
        },
        "tablenames": [
            "table1",
            "table2"
        ],
        "enable": true
    }
}
```

Following is a sample body for the REST request for an Event Hubs where Event Hubs name is provided. In this case, all exported data is sent to it.

```json
{
    "properties": {
        "destination": {
            "resourceId": "/subscriptions/subscription-id/resourcegroups/resource-group-name/providers/Microsoft.EventHub/namespaces/eventhub-namespaces-name",
            "metaData": {
                "EventHubName": "eventhub-name"
        },
        "tablenames": [
            "table1",
            "table2"
        ],
        "enable": true
    }
  }
}
```

# [Template](#tab/json)

Use the following command to create a data export rule to a Storage Account using Resource Manager template.

```
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "workspaceName": {
            "defaultValue": "workspace-name",
            "type": "String"
        },
        "workspaceLocation": {
            "defaultValue": "workspace-region",
            "type": "string"
        },
        "storageAccountRuleName": {
            "defaultValue": "storage-account-rule-name",
            "type": "string"
        },
        "storageAccountResourceId": {
            "defaultValue": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/resource-group-name/providers/Microsoft.Storage/storageAccounts/storage-account-name",
            "type": "String"
        }
    },
    "variables": {},
    "resources": [
        {
            "type": "microsoft.operationalinsights/workspaces",
            "apiVersion": "2020-08-01",
            "name": "[parameters('workspaceName')]",
            "location": "[parameters('workspaceLocation')]",
            "resources": [
                {
                  "type": "microsoft.operationalinsights/workspaces/dataexports",
                  "apiVersion": "2020-08-01",
                  "name": "[concat(parameters('workspaceName'), '/' , parameters('storageAccountRuleName'))]",
                  "dependsOn": [
                      "[resourceId('microsoft.operationalinsights/workspaces', parameters('workspaceName'))]"
                  ],
                  "properties": {
                      "destination": {
                          "resourceId": "[parameters('storageAccountResourceId')]"
                      },
                      "tableNames": [
                          "Heartbeat",
                          "InsightsMetrics",
                          "VMConnection",
                          "Usage"
                      ],
                      "enable": true
                  }
              }
            ]
        }
    ]
}
```

Use the following command to create a data export rule to an Event Hubs using Resource Manager template. A separate Event Hubs is created for each table.

```
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "workspaceName": {
            "defaultValue": "workspace-name",
            "type": "String"
        },
        "workspaceLocation": {
            "defaultValue": "workspace-region",
            "type": "string"
        },
        "eventhubRuleName": {
            "defaultValue": "event-hub-rule-name",
            "type": "string"
        },
        "namespacesResourceId": {
            "defaultValue": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/resource-group-name/providers/microsoft.eventhub/namespaces/namespaces-name",
            "type": "String"
        }
    },
    "variables": {},
    "resources": [
        {
            "type": "microsoft.operationalinsights/workspaces",
            "apiVersion": "2020-08-01",
            "name": "[parameters('workspaceName')]",
            "location": "[parameters('workspaceLocation')]",
            "resources": [
              {
                  "type": "microsoft.operationalinsights/workspaces/dataexports",
                  "apiVersion": "2020-08-01",
                  "name": "[concat(parameters('workspaceName'), '/', parameters('eventhubRuleName'))]",
                  "dependsOn": [
                      "[resourceId('microsoft.operationalinsights/workspaces', parameters('workspaceName'))]"
                  ],
                  "properties": {
                      "destination": {
                          "resourceId": "[parameters('namespacesResourceId')]"
                      },
                      "tableNames": [
                          "Usage",
                          "Heartbeat"
                      ],
                      "enable": true
                  }
              }
            ]
        }
    ]
}
```

Use the following command to create a data export rule to a specific Event Hubs using Resource Manager template. All tables are exported to it.

```
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "workspaceName": {
            "defaultValue": "workspace-name",
            "type": "String"
        },
        "workspaceLocation": {
            "defaultValue": "workspace-region",
            "type": "string"
        },
        "eventhubRuleName": {
            "defaultValue": "event-hub-rule-name",
            "type": "string"
        },
        "namespacesResourceId": {
            "defaultValue": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/resource-group-name/providers/microsoft.eventhub/namespaces/namespaces-name",
            "type": "String"
        },
        "eventhubName": {
            "defaultValue": "event-hub-name",
            "type": "string"
        }
    },
    "variables": {},
    "resources": [
        {
            "type": "microsoft.operationalinsights/workspaces",
            "apiVersion": "2020-08-01",
            "name": "[parameters('workspaceName')]",
            "location": "[parameters('workspaceLocation')]",
            "resources": [
              {
                  "type": "microsoft.operationalinsights/workspaces/dataexports",
                  "apiVersion": "2020-08-01",
                  "name": "[concat(parameters('workspaceName'), '/', parameters('eventhubRuleName'))]",
                  "dependsOn": [
                      "[resourceId('microsoft.operationalinsights/workspaces', parameters('workspaceName'))]"
                  ],
                  "properties": {
                      "destination": {
                          "resourceId": "[parameters('namespacesResourceId')]",
                          "metaData": {
                              "eventHubName": "[parameters('eventhubName')]"
                          }
                      },
                      "tableNames": [
                          "Usage",
                          "Heartbeat"
                      ],
                      "enable": true
                  }
              }
            ]
        }
    ]
}
```

---

## View data export rule configuration

# [Azure portal](#tab/portal)

In the **Log Analytics workspace** menu in the Azure portal, select **Data Export** from the **Settings** section.

[![export rules view](media/logs-data-export/export-view-1.png "Screenshot of data export rules view.")](media/logs-data-export/export-view-1.png#lightbox)

Click a rule for configuration view.

<img src="media/logs-data-export/export-view-2.png" alt="Screenshot of data export rule view." title= "Data export rule configuration view" width="65%"/>


# [PowerShell](#tab/powershell)

Use the following command to view the configuration of a data export rule using PowerShell.

```powershell
Get-AzOperationalInsightsDataExport -ResourceGroupName resourceGroupName -WorkspaceName workspaceName -DataExportName 'ruleName'
```

# [Azure CLI](#tab/azure-cli)

Use the following command to view the configuration of a data export rule using CLI.

```azurecli
az monitor log-analytics workspace data-export show --resource-group resourceGroupName --workspace-name workspaceName --name ruleName
```

# [REST](#tab/rest)

Use the following request to view the configuration of a data export rule using the REST API. The request should use bearer token authorization.

```rest
GET https://management.azure.com/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/Microsoft.operationalInsights/workspaces/<workspace-name>/dataexports/<data-export-name>?api-version=2020-08-01
```

# [Template](#tab/json)

N/A

---

## Disable or update an export rule

# [Azure portal](#tab/portal)

Export rules can be disabled to let you stop the export for a certain period such as when testing is being held. In the **Log Analytics workspace** menu in the Azure portal, select **Data Export** from the **Settings** section and click the status toggle to disable or enable export rule.

[![export rule disable](media/logs-data-export/export-disable.png "Screenshot of disable data export rule.")](media/logs-data-export/export-disable.png#lightbox)


# [PowerShell](#tab/powershell)

Export rules can be disabled to let you stop the export for a certain period such as when testing is being held. Use the following command to disable or update rule parameters using PowerShell.

```powershell
Update-AzOperationalInsightsDataExport -ResourceGroupName resourceGroupName -WorkspaceName workspaceName -DataExportName 'ruleName' -TableName 'SecurityEvent,Heartbeat' -Enable: $false
```

# [Azure CLI](#tab/azure-cli)

Export rules can be disabled to let you stop the export for a certain period such as when testing is being held. Use the following command to disable or update rule parameters using CLI.

```azurecli
az monitor log-analytics workspace data-export update --resource-group resourceGroupName --workspace-name workspaceName --name ruleName --tables SecurityEvent Heartbeat --enable false
```

# [REST](#tab/rest)

Export rules can be disabled to let you stop the export for a certain period such as when testing is being held. Use the following command to disable or update rule parameters using REST API. The request should use bearer token authorization.

```rest
PUT https://management.azure.com/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/Microsoft.operationalInsights/workspaces/<workspace-name>/dataexports/<data-export-name>?api-version=2020-08-01
Authorization: Bearer <token>
Content-type: application/json

{
    "properties": {
        "destination": {
            "resourceId": "/subscriptions/subscription-id/resourcegroups/resource-group-name/providers/Microsoft.Storage/storageAccounts/storage-account-name"
        },
        "tablenames": [
"table1",
    "table2" 
        ],
        "enable": false
    }
}
```

# [Template](#tab/json)

Export rules can be disabled to stop export when testing is performed and you don't need data sent to destination. Set ```"enable": false``` in template to disable a data export.

---

## Delete an export rule

# [Azure portal](#tab/portal)

In the **Log Analytics workspace** menu in the Azure portal, select *Data Export* from the **Settings** section, then click the ellipsis to the right of the rule and click **Delete**. 

[![export rule delete](media/logs-data-export/export-delete.png "Screenshot of delete data export rule.")](media/logs-data-export/export-delete.png#lightbox)


# [PowerShell](#tab/powershell)

Use the following command to delete a data export rule using PowerShell.

```powershell
Remove-AzOperationalInsightsDataExport -ResourceGroupName resourceGroupName -WorkspaceName workspaceName -DataExportName 'ruleName'
```

# [Azure CLI](#tab/azure-cli)

Use the following command to delete a data export rule using CLI.

```azurecli
az monitor log-analytics workspace data-export delete --resource-group resourceGroupName --workspace-name workspaceName --name ruleName
```

# [REST](#tab/rest)

Use the following request to delete a data export rule using the REST API. The request should use bearer token authorization.

```rest
DELETE https://management.azure.com/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/Microsoft.operationalInsights/workspaces/<workspace-name>/dataexports/<data-export-name>?api-version=2020-08-01
```

# [Template](#tab/json)

N/A

---


## View all data export rules in a workspace

# [Azure portal](#tab/portal)

In the **Log Analytics workspace** menu in the Azure portal, select **Data Export** from the **Settings** section to view all export rules in workspace.

[![export rules](media/logs-data-export/export-view.png "Screenshot of data export rules view.")](media/logs-data-export/export-view.png#lightbox)


# [PowerShell](#tab/powershell)

Use the following command to view all data export rules in a workspace using PowerShell.

```powershell
Get-AzOperationalInsightsDataExport -ResourceGroupName resourceGroupName -WorkspaceName workspaceName
```

# [Azure CLI](#tab/azure-cli)

Use the following command to view all data export rules in a workspace using CLI.

```azurecli
az monitor log-analytics workspace data-export list --resource-group resourceGroupName --workspace-name workspaceName
```

# [REST](#tab/rest)

Use the following request to view all data export rules in a workspace using the REST API. The request should use bearer token authorization.

```rest
GET https://management.azure.com/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/Microsoft.operationalInsights/workspaces/<workspace-name>/dataexports?api-version=2020-08-01
```

# [Template](#tab/json)

N/A

---


## Unsupported tables
If the data export rule includes an unsupported table, the configuration will succeed, but no data will be exported for that table. If the table is later supported, then its data will be exported at that time.

## Supported tables
All data from the table will be exported unless limitations are specified. This list is updated as more tables are added.

| Table | Limitations |
|:---|:---|
| AACAudit |  |
| AACHttpRequest |  |
| AADDomainServicesAccountLogon |  |
| AADDomainServicesAccountManagement |  |
| AADDomainServicesDirectoryServiceAccess |  |
| AADDomainServicesLogonLogoff |  |
| AADDomainServicesPolicyChange |  |
| AADDomainServicesPrivilegeUse |  |
| AADManagedIdentitySignInLogs |  |
| AADNonInteractiveUserSignInLogs |  |
| AADProvisioningLogs |  |
| AADRiskyServicePrincipals |  |
| AADRiskyUsers |  |
| AADServicePrincipalRiskEvents |  |
| AADServicePrincipalSignInLogs |  |
| AADUserRiskEvents |  |
| ABSBotRequests |  |
| ACRConnectedClientList |  |
| ACSAuthIncomingOperations |  |
| ACSBillingUsage |  |
| ACSCallDiagnostics |  |
| ACSCallSummary |  |
| ACSChatIncomingOperations |  |
| ACSNetworkTraversalIncomingOperations |  |
| ACSSMSIncomingOperations |  |
| ADAssessmentRecommendation |  |
| ADFActivityRun |  |
| ADFPipelineRun |  |
| ADFSSignInLogs |  |
| ADFTriggerRun |  |
| ADPAudit |  |
| ADPRequests |  |
| ADReplicationResult |  |
| ADSecurityAssessmentRecommendation |  |
| ADTDigitalTwinsOperation |  |
| ADTEventRoutesOperation |  |
| ADTModelsOperation |  |
| ADTQueryOperation |  |
| ADXCommand |  |
| ADXQuery |  |
| AegDataPlaneRequests |  |
| AegDeliveryFailureLogs |  |
| AegPublishFailureLogs |  |
| AEWAuditLogs |  |
| AgriFoodApplicationAuditLogs |  |
| AgriFoodFarmManagementLogs |  |
| AgriFoodFarmOperationLogs |  |
| AgriFoodJobProcessedLogs |  |
| AGSGrafanaLoginEvents |  |
| Alert | Partial support – Data ingestion for Zabbix alerts isn't supported. |
| AlertEvidence |  |
| AlertInfo |  |
| AmlOnlineEndpointConsoleLog |  |
| ApiManagementGatewayLogs |  |
| AppAvailabilityResults |  |
| AppBrowserTimings |  |
| AppCenterError |  |
| AppEvents |  |
| AppExceptions |  |
| AppDependencies |  |
| AppMetrics |  |
| AppPageViews |  |
| AppPerformanceCounters |  |
| AppPlatformSystemLogs |  |
| AppRequests |  |
| AppServiceAppLogs |  |
| AppServiceAuditLogs |  |
| AppServiceConsoleLogs |  |
| AppServiceFileAuditLogs |  |
| AppServiceHTTPLogs |  |
| AppServicePlatformLogs |  |
| AppSystemEvents |  |
| AppTraces |  |
| ASimDnsActivityLogs |  |
| ATCExpressRouteCircuitIpfix |  |
| AuditLogs |  |
| AutoscaleEvaluationsLog |  |
| AutoscaleScaleActionsLog |  |
| AWSCloudTrail |  |
| AWSGuardDuty |  |
| AWSVPCFlow |  |
| AzureAssessmentRecommendation |  |
| AzureAttestationDiagnostics |  |
| AzureDevOpsAuditing |  |
| BehaviorAnalytics |  |
| CassandraLogs |  |
| CDBCassandraRequests |  |
| CDBControlPlaneRequests |  |
| CDBDataPlaneRequests |  |
| CDBGremlinRequests |  |
| CDBMongoRequests |  |
| CDBPartitionKeyRUConsumption |  |
| CDBPartitionKeyStatistics |  |
| CDBQueryRuntimeStatistics |  |
| CIEventsAudit |  |
| CIEventsOperational |  |
| CloudAppEvents |  |
| CommonSecurityLog |  |
| ComputerGroup |  |
| ConfigurationData | Partial support – some of the data is ingested through internal services that aren't supported in export. This portion is missing in export currently. |
| ContainerImageInventory |  |
| ContainerInventory |  |
| ContainerLog |  |
| ContainerLogV2 |  |
| ContainerNodeInventory |  |
| ContainerServiceLog |  |
| CoreAzureBackup |  |
| DatabricksAccounts |  |
| DatabricksClusters |  |
| DatabricksDBFS |  |
| DatabricksInstancePools |  |
| DatabricksJobs |  |
| DatabricksNotebook |  |
| DatabricksSecrets |  |
| DatabricksSQLPermissions |  |
| DatabricksSSH |  |
| DatabricksWorkspace |  |
| DnsEvents |  |
| DnsInventory |  |
| DSMAzureBlobStorageLogs |  |
| DSMDataClassificationLogs |  |
| DSMDataLabelingLogs |  |
| Dynamics365Activity |  |
| EmailAttachmentInfo |  |
| EmailEvents |  |
| EmailPostDeliveryEvents |  |
| EmailUrlInfo |  |
| Event | Partial support – data arriving from Log Analytics agent (MMA) or Azure Monitor Agent (AMA) is fully supported in export. Data arriving via Diagnostics extension agent is collected through storage while this path isn’t supported in export. |
| ExchangeAssessmentRecommendation |  |
| FailedIngestion |  |
| FunctionAppLogs |  |
| HDInsightAmbariClusterAlerts |  |
| HDInsightAmbariSystemMetrics |  |
| HDInsightHadoopAndYarnLogs |  |
| HDInsightHadoopAndYarnMetrics |  |
| HDInsightHBaseLogs |  |
| HDInsightHBaseMetrics |  |
| HDInsightHiveAndLLAPLogs |  |
| HDInsightHiveAndLLAPMetrics |  |
| HDInsightHiveQueryAppStats |  |
| HDInsightHiveTezAppStats |  |
| HDInsightKafkaLogs |  |
| HDInsightKafkaMetrics |  |
| HDInsightOozieLogs |  |
| HDInsightSecurityLogs |  |
| HDInsightSparkApplicationEvents |  |
| HDInsightSparkBlockManagerEvents |  |
| HDInsightSparkEnvironmentEvents |  |
| HDInsightSparkExecutorEvents |  |
| HDInsightSparkJobEvents |  |
| HDInsightSparkLogs |  |
| HDInsightSparkSQLExecutionEvents |  |
| HDInsightSparkStageEvents |  |
| HDInsightSparkStageTaskAccumulables |  |
| HDInsightSparkTaskEvents |  |
| Heartbeat |  |
| HuntingBookmark |  |
| IdentityDirectoryEvents |  |
| IdentityLogonEvents |  |
| IdentityQueryEvents |  |
| InsightsMetrics | Partial support – some of the data is ingested through internal services that aren't supported in export. This portion is missing in export currently. |
| IntuneAuditLogs |  |
| IntuneDevices |  |
| IntuneOperationalLogs |  |
| KubeEvents |  |
| KubeHealth |  |
| KubeMonAgentEvents |  |
| KubeNodeInventory |  |
| KubePodInventory |  |
| KubeServices |  |
| LAQueryLogs |  |
| McasShadowItReporting |  |
| MCVPAuditLogs |  |
| MCVPOperationLogs |  |
| MicrosoftAzureBastionAuditLogs |  |
| MicrosoftDataShareReceivedSnapshotLog |  |
| MicrosoftDataShareSentSnapshotLog |  |
| MicrosoftHealthcareApisAuditLogs |  |
| NWConnectionMonitorPathResult |  |
| NWConnectionMonitorTestResult |  |
| OfficeActivity | Partial support in government clouds – some of the data to ingested via webhooks from O365 into LA. This portion is missing in export currently. |
| OLPSupplyChainEntityOperations |  |
| OLPSupplyChainEvents |  |
| Operation | Partial support – some of the data is ingested through internal services that aren't supported in export. This portion is missing in export currently. |
| Perf | Partial support – only windows perf data is currently supported. The Linux perf data is missing in export currently. |
| PowerBIActivity |  |
| PowerBIDatasetsWorkspace |  |
| ProjectActivity |  |
| PurviewDataSensitivityLogs |  |
| PurviewScanStatusLogs |  |
| ResourceManagementPublicAccessLogs |  |
| SCCMAssessmentRecommendation |  |
| SCOMAssessmentRecommendation |  |
| SecurityAlert |  |
| SecurityBaseline |  |
| SecurityBaselineSummary |  |
| SecurityDetection |  |
| SecurityEvent | Partial support – data arriving from Log Analytics agent (MMA) or Azure Monitor Agent (AMA) is fully supported in export. Data arriving via Diagnostics extension agent is collected through storage while this path isn’t supported in export. |
| SecurityIncident |  |
| SecurityIoTRawEvent |  |
| SecurityNestedRecommendation |  |
| SecurityRecommendation |  |
| SentinelAudit |  |
| SentinelHealth |  |
| SfBAssessmentRecommendation |  |
| SfBOnlineAssessmentRecommendation |  |
| SharePointOnlineAssessmentRecommendation |  |
| SignalRServiceDiagnosticLogs |  |
| SigninLogs |  |
| SPAssessmentRecommendation |  |
| SQLAssessmentRecommendation |  |
| SQLSecurityAuditEvents |  |
| StorageCacheOperationEvents |  |
| SucceededIngestion |  |
| SynapseBigDataPoolApplicationsEnded |  |
| SynapseBuiltinSqlPoolRequestsEnded |  |
| SynapseGatewayApiRequests |  |
| SynapseIntegrationActivityRuns |  |
| SynapseIntegrationPipelineRuns |  |
| SynapseIntegrationTriggerRuns |  |
| SynapseRbacOperations |  |
| SynapseScopePoolScopeJobsEnded |  |
| SynapseScopePoolScopeJobsStateChange |  |
| SynapseSqlPoolDmsWorkers |  |
| SynapseSqlPoolExecRequests |  |
| SynapseSqlPoolRequestSteps |  |
| SynapseSqlPoolSqlRequests |  |
| SynapseSqlPoolWaits |  |
| Syslog | Partial support – data arriving from Log Analytics agent (MMA) or Azure Monitor Agent (AMA) is fully supported in export. Data arriving via Diagnostics extension agent is collected through storage while this path isn’t supported in export. |
| ThreatIntelligenceIndicator |  |
| UCClient |  |
| UCClientUpdateStatus |  |
| UCDeviceAlert |  |
| UCServiceUpdateStatus |  |
| UCUpdateAlert |  |
| Update | Partial support – some of the data is ingested through internal services that aren't supported in export. This portion is missing in export currently. |
| UpdateRunProgress |  |
| UpdateSummary |  |
| Usage |  |
| UserAccessAnalytics |  |
| UserPeerAnalytics |  |
| Watchlist |  |
| WindowsEvent |  |
| WindowsFirewall |  |
| WireData | Partial support – some of the data is ingested through internal services that aren't supported in export. This portion is missing in export currently. |
| WorkloadDiagnosticLogs |  |
| WVDAgentHealthStatus |  |
| WVDCheckpoints |  |
| WVDConnections |  |
| WVDErrors |  |
| WVDFeeds |  |
| WVDManagement |  |


## Next steps

- [Query the exported data from Azure Data Explorer](../logs/azure-data-explorer-query-storage.md).
