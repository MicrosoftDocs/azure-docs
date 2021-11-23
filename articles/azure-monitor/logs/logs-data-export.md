---
title: Log Analytics workspace data export in Azure Monitor (preview)
description: Log Analytics data export allows you to continuously export data of selected tables from your Log Analytics workspace to an Azure storage account or Azure Event Hubs as it's collected. 
ms.topic: conceptual
ms.custom: references_regions, devx-track-azurecli, devx-track-azurepowershell
author: yossi-y
ms.author: yossiy
ms.date: 10/17/2021

---

# Log Analytics workspace data export in Azure Monitor (preview)
Log Analytics workspace data export in Azure Monitor allows you to continuously export data from selected tables in your Log Analytics workspace to an Azure storage account or Azure Event Hubs as it's collected. This article provides details on this feature and steps to configure data export in your workspaces.

## Overview
Once data export is configured for your Log Analytics workspace, any new data sent to the selected tables in the workspace is automatically exported to your storage account in hourly append blobs or to your event hub in near-real-time.

![Data export overview](media/logs-data-export/data-export-overview.png)

All data from included tables is exported without a filter. For example, when you configure a data export rule for *SecurityEvent* table, all data sent to the *SecurityEvent* table is exported starting from the configuration time.


## Other export options
Log Analytics workspace data export continuously exports data from a Log Analytics workspace. Other options to export data for particular scenarios include the following:

- Scheduled export from a log query using a Logic App. This is similar to the data export feature but allows you to send filtered or aggregated data to Azure storage. This method though is subject to [log query limits](../service-limits.md#log-analytics-workspaces), see [Archive data from Log Analytics workspace to Azure storage using Logic App](logs-export-logic-app.md).
- One time export to local machine using PowerShell script. See [Invoke-AzOperationalInsightsQueryExport](https://www.powershellgallery.com/packages/Invoke-AzOperationalInsightsQueryExport).

## Limitations

- You can use Azure portal, CLI, or REST requests in data export configuration. PowerShell isn't supported yet.
- All tables will be supported in export, but support is currently limited to those specified in the [supported tables](#supported-tables) section below. 
- A new custom log preview is planned for February 2022 and will be supported in export. The existing custom log tables won’t be supported in export. 
- You can define up to 10 enabled rules in your workspace. More rules are allowed when disabled. 
- Destination must be unique across all export rules in your workspace.
- Destinations must be in the same region as the Log Analytics workspace.
- Tables names can be no longer than 60 characters when exporting to storage account and 47 characters to event hub. Tables with longer names will not be exported.
- Data export will be available in all regions, but currently supported in: 
    - Australia Central
    - Australia East
    - Australia Southeast
    - Brazil South
    - Canada Central
    - Central India
    - Central US
    - East Asia
    - East US
    - East US 2
    - France Central
    - Germany West Central
    - Japan East
    - Korea Central
    - North Central US
    - North Europe
    - South Africa North
    - South Central US
    - Southeast Asia
    - Switzerland North
    - Switzerland West
    - UAE North
    - UK South
    - UK West
    - West Central US
    - West Europe
    - West US
    - West US 2

## Data completeness
Data export is optimized for moving large data volume to your destinations and in certain retry conditions, can include a fraction of duplicated records. The export operation to your destination could fail when ingress limits are reached, see details under [Create or update data export rule](#create-or-update-data-export-rule). Export continues to retry for up to 30 minutes and if destination is unavailable to accept data, data will be discarded until the destination becomes available.

## Cost
Currently, there are no other charges for the data export feature. Pricing for data export will be announced in the future and a notice period provided prior to the start of billing. If you choose to continue using data export after the notice period, you will be billed at the applicable rate.

## Export destinations

Data export destination must be created before creating the export rule in your workspace. Destinations don't have to be in the same subscription as your workspace. When using Azure Lighthouse, it is also possible to have data sent to a destination in another Azure Active Directory tenant.

### Storage account

You need to have 'write' permissions to both workspace and destination to configure data export rule. 

Don't use an existing storage account that has other, non-monitoring data stored in it to better control access to the data and prevent reaching storage ingress rate limit, failures, and latency. 

To send data to immutable storage, set the immutable policy for the storage account as described in [Set and manage immutability policies for Blob storage](../../storage/blobs/immutable-policy-configure-version-scope.md). You must follow all steps in this article, including enabling protected append blobs writes.

The storage account must be StorageV1 or above and in the same region as your workspace. If you need to replicate your data to other storage accounts in other regions, you can use any of the [Azure Storage redundancy options](../../storage/common/storage-redundancy.md#redundancy-in-a-secondary-region) including GRS and GZRS.

Data is sent to storage accounts as it reaches Azure Monitor and stored in hourly append blobs. A container is created for each table in the storage account with the name *am-* followed by the name of the table. For example, the table *SecurityEvent* would sent to a container named *am-SecurityEvent*.

Starting 15-October 2021, blobs are stored in 5-minutes folders in the following path structure: *WorkspaceResourceId=/subscriptions/subscription-id/resourcegroups/\<resource-group\>/providers/microsoft.operationalinsights/workspaces/\<workspace\>/y=\<four-digit numeric year\>/m=\<two-digit numeric month\>/d=\<two-digit numeric day\>/h=\<two-digit 24-hour clock hour\>/m=\<two-digit 60-minute clock minute\>/PT05M.json*. Append blobs is limited to 50-K writes and could be reached, the naming pattern for blobs in such case would be PT05M_#.json*, where # is incremental blob count.

The storage account data format is in [JSON lines](../essentials/resource-logs-blob-format.md), where each record is delimited by a newline, with no outer records array and no commas between JSON records. 

[![Storage sample data](media/logs-data-export/storage-data.png)](media/logs-data-export/storage-data.png#lightbox)

### Event hub

You need to have 'write' permissions to both workspace and destination to configure data export rule. The shared access policy for the event hub namespace defines the permissions that the streaming mechanism has. Streaming to event hub requires Manage, Send, and Listen permissions. To update the export rule, you must have the ListKey permission on that Event Hubs authorization rule.

Don't use an existing event hub that has other, non-monitoring data stored in it to better control access to the data and prevent reaching event hub namespace ingress rate limit, failures, and latency. 

The event hub namespace needs to be in the same region as your workspace.

Data is sent to your event hub as it reaches Azure Monitor. An event hub is created for each data type that you export with the name *am-* followed by the name of the table. For example, the table *SecurityEvent* would sent to an event hub named *am-SecurityEvent*. If you want the exported data to reach a specific event hub, or if you have a table with a name that exceeds the 47 character limit, you can provide your own event hub name and export all data for defined tables to it.

> [!NOTE]
> - 'Basic' event hub tier is limited--there is lower event size [limit](../../event-hubs/event-hubs-quotas.md#basic-vs-standard-vs-premium-vs-dedicated-tiers) and no [Auto-inflate](../../event-hubs/event-hubs-auto-inflate.md) support. Since data volume to your workspace increases over time and consequence event hub scaling is required, use 'Standard', 'Premium' or 'Dedicated' event hub tiers with **Auto-inflate** feature enabled to automatically scale up and increase the number of throughput units to meet usage needs. See [Automatically scale up Azure Event Hubs throughput units](../../event-hubs/event-hubs-auto-inflate.md).
> - The [number of supported event hubs per 'Basic' and 'Standard' namespaces tiers is 10](../../event-hubs/event-hubs-quotas.md#common-limits-for-all-tiers). If you export more than 10 tables, either split the tables between several export rules to different event hub namespaces, or provide event hub name in the export rule and export all tables to that event hub.
> - Data export can't reach event hub resources when virtual networks are enabled. You have to enable the **Allow trusted Microsoft services** to bypass this firewall setting in event hub, to grant access to your Event Hubs resources.

## Enable data export
The following steps must be performed to enable Log Analytics data export. See the following sections for more details on each.

- Register resource provider.
- Allow trusted Microsoft services.
- Create one or more data export rules that define the tables to export and their destination.

### Register resource provider
The following Azure resource provider needs to registered for your subscription to enable Log Analytics data export. 

- Microsoft.Insights

This resource provider will probably already be registered for most Azure Monitor users. To verify, go to **Subscriptions** in the Azure portal. Select your subscription and then click **Resource providers** in the **Settings** section of the menu. Locate **Microsoft.Insights**. If its status is **Registered**, then it's already registered. If not, click **Register** to register it.

You can also use any of the available methods to register a resource provider as described in [Azure resource providers and types](../../azure-resource-manager/management/resource-providers-and-types.md). Following is a sample command using PowerShell:

```PowerShell
Register-AzResourceProvider -ProviderNamespace Microsoft.insights
```

### Allow trusted Microsoft services
If you have configured your Storage Account to allow access from selected networks, you need to add an exception to allow Azure Monitor to write to the account. From **Firewalls and virtual networks** for your storage account, select **Allow trusted Microsoft services to access this storage account**.

[![Storage account firewalls and virtual networks](media/logs-data-export/storage-account-vnet.png)](media/logs-data-export/storage-account-vnet.png#lightbox)

### Create or update data export rule
Data export rule defines the tables for which data is exported and destination. You can have 10 enabled rules in your workspace, more rules can be added, but in 'disable' state. Destinations must be unique across all export rules in workspace.

> [!NOTE]
> - If export rule includes unsupported tables, no data will be exported for that tables until the tables becomes supported.
> - If export rule includes tables that don't exist in your workspace, it will fail with error `Table <tableName> does not exist in the workspace`.

> [!IMPORTANT]
> Export destinations have limits and should be monitored to minimize throttling, failures, and latency. See [storage accounts scalability](../../storage/common/scalability-targets-standard-account.md#scale-targets-for-standard-storage-accounts) and [event hub namespace quota](../../event-hubs/event-hubs-quotas.md).

#### Monitoring storage account

1. Use separate storage account for export
1. Configure alert on the metric below: 

    | Scope | Metric Namespace | Metric | Aggregation | Threshold |
    |:---|:---|:---|:---|:---|
    | storage-name | Account | Ingress | Sum | 80% of max ingress per alert evaluation period. For example: limit is 60 Gbps for general-purpose v2 in West US. Threshold is 14,400 Gb per 5-minutes evaluation period |
  
1. Alert remediation actions
    - Use separate storage account for export.
    - Azure Storage standard accounts support higher ingress limit by request. To request an increase, contact [Azure Support](https://azure.microsoft.com/support/faq/).
    - Split tables between more storage accounts.

#### Monitoring event hub

1. Configure alerts on the [metrics](../../event-hubs/monitor-event-hubs-reference.md) below:
  
    | Scope | Metric Namespace | Metric | Aggregation | Threshold |
    |:---|:---|:---|:---|:---|
    | namespaces-name | Event Hub standard metrics | Incoming bytes | Sum | 80% of max ingress per alert evaluation period. For example, limit is 1 MB/s per unit (TU or PU) and five units used. Threshold is 1200 MB per 5-minutes evaluation period |
    | namespaces-name | Event Hub standard metrics | Incoming requests | Count | 80% of max events per alert evaluation period. For example, limit is 1000/s per unit (TU or PU) and five units used. Threshold is 1200000 per 5-minutes evaluation period |
    | namespaces-name | Event Hub standard metrics | Quota Exceeded Errors | Count | Between 1% of request. For example, requests per 5 minutes is 600000. Threshold is 6000 per 5-minutes evaluation period |

1. Alert remediation actions
   - Configure [Auto-inflate](../../event-hubs/event-hubs-auto-inflate.md) feature to automatically scale up and increase the number of throughput units to meet usage needs
   - Verify increase of throughput units to accommodate the load
   - Split tables between other namespaces
   - Use 'Premium' or 'Dedicated' tiers for higher throughput

Export rule should include tables that you have in your workspace. Run this query for a list of available tables in your workspace.

```kusto
find where TimeGenerated > ago(24h) | distinct Type
```

# [Azure portal](#tab/portal)

In the **Log Analytics workspace** menu in the Azure portal, select **Data Export** from the **Settings** section and click **New export rule** from the top of the middle pane.

![export create](media/logs-data-export/export-create-1.png)

Follow the steps, then click **Create**. 

<img src="media/logs-data-export/export-create-2.png" alt="export rule configuration" title="export rule configuration" width="80%"/>


# [PowerShell](#tab/powershell)

N/A

# [Azure CLI](#tab/azure-cli)

Use the following command to create a data export rule to a storage account using CLI.

```azurecli
$storageAccountResourceId = '/subscriptions/subscription-id/resourceGroups/resource-group-name/providers/Microsoft.Storage/storageAccounts/storage-account-name'
az monitor log-analytics workspace data-export create --resource-group resourceGroupName --workspace-name workspaceName --name ruleName --tables SecurityEvent Heartbeat --destination $storageAccountResourceId
```

Use the following command to create a data export rule to an event hub using CLI. A separate event hub is created for each table.

```azurecli
$eventHubsNamespacesResourceId = '/subscriptions/subscription-id/resourceGroups/resource-group-name/providers/Microsoft.EventHub/namespaces/namespaces-name'
az monitor log-analytics workspace data-export create --resource-group resourceGroupName --workspace-name workspaceName --name ruleName --tables SecurityEvent Heartbeat --destination $eventHubsNamespacesResourceId
```

Use the following command to create a data export rule to a specific event hub using CLI. All tables are exported to the provided event hub name. 

```azurecli
$eventHubResourceId = '/subscriptions/subscription-id/resourceGroups/resource-group-name/providers/Microsoft.EventHub/namespaces/namespaces-name/eventhubs/eventhub-name'
az monitor log-analytics workspace data-export create --resource-group resourceGroupName --workspace-name workspaceName --name ruleName --tables SecurityEvent Heartbeat --destination $eventHubResourceId
```

# [REST](#tab/rest)

Use the following request to create a data export rule using the REST API. The request should use bearer token authorization and content type application/json.

```rest
PUT https://management.azure.com/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/Microsoft.operationalInsights/workspaces/<workspace-name>/dataexports/<data-export-name>?api-version=2020-08-01
```

The body of the request specifies the tables destination. Following is a sample body for the REST request for a storage account.

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

Following is a sample body for the REST request for an event hub.

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

Following is a sample body for the REST request for an event hub where event hub name is provided. In this case, all exported data is sent to this event hub.

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

Use the following command to create a data export rule to a storage account using template.

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

Use the following command to create a data export rule to an event hub using template. A separate event hub is created for each table.

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

Use the following command to create a data export rule to a specific event hub using template. All tables are exported to the provided event hub name.

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

![export rules view](media/logs-data-export/export-view-1.png)

Click a rule for configuration view.

<img src="media/logs-data-export/export-view-2.png" alt="export rule settings" title= "export rule settings" width="65%"/>


# [PowerShell](#tab/powershell)

N/A

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

## Disable an export rule

# [Azure portal](#tab/portal)

Export rules can be disabled to let you stop the export when you don’t need to retain data for a certain period such as when testing is being performed. In the **Log Analytics workspace** menu in the Azure portal, select **Data Export** from the **Settings** section and click the status toggle to disable or enable export rule.

![export rule disable](media/logs-data-export/export-disable.png)


# [PowerShell](#tab/powershell)

N/A

# [Azure CLI](#tab/azure-cli)

Export rules can be disabled to let you stop the export when you don’t need to retain data for a certain period such as when testing is being performed. Use the following command to disable a data export rule using CLI.

```azurecli
az monitor log-analytics workspace data-export update --resource-group resourceGroupName --workspace-name workspaceName --name ruleName --tables SecurityEvent Heartbeat --enable false
```

# [REST](#tab/rest)

Export rules can be disabled to let you stop the export when you don’t need to retain data for a certain period such as when testing is being performed. Use the following request to disable a data export rule using the REST API. The request should use bearer token authorization.

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

Export rules can be disabled to let you stop the export when you don’t need to retain data for a certain period such as when testing is being performed. Set ```"enable": false``` in template to disable a data export.

---

## Delete an export rule

# [Azure portal](#tab/portal)

In the **Log Analytics workspace** menu in the Azure portal, select *Data Export* from the **Settings** section, then click the ellipsis to the right of the rule and click **Delete**. 

![export rule delete](media/logs-data-export/export-delete.png)


# [PowerShell](#tab/powershell)

N/A

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

![export rules](media/logs-data-export/export-view.png)


# [PowerShell](#tab/powershell)

N/A

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

If the data export rule includes a table that doesn't exist, it will fail with the error "Table \<tableName\> does not exist in the workspace".


## Supported tables
Supported tables are currently limited to those specified below. All data from the table will be exported unless limitations are specified. This list is updated as more tables are added.

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
| AADRiskyUsers |  |
| AADServicePrincipalSignInLogs |  |
| AADUserRiskEvents |  |
| ABSBotRequests |  |
| ACSAuthIncomingOperations |  |
| ACSBillingUsage |  |
| ACRConnectedClientList |  |
| ACRConnectedClientList |  |
| ACSCallDiagnostics |  |
| ACSCallSummary |  |
| ACSChatIncomingOperations |  |
| ACSSMSIncomingOperations |  |
| ADAssessmentRecommendation |  |
| ADFActivityRun |  |
| ADFPipelineRun |  |
| ADFSSignInLogs |  |
| ADFTriggerRun |  |
| ADPAudit |  |
| ADPDiagnostics |  |
| ADPRequests |  |
| ADReplicationResult |  |
| ADSecurityAssessmentRecommendation |  |
| ADTDigitalTwinsOperation |  |
| ADTEventRoutesOperation |  |
| ADTModelsOperation |  |
| ADTQueryOperation |  |
| ADXCommand |  |
| ADXQuery |  |
| AegDeliveryFailureLogs |  |
| AegPublishFailureLogs |  |
| AEWAuditLogs |  |
| AgriFoodApplicationAuditLogs |  |
| AgriFoodApplicationAuditLogs |  |
| AgriFoodFarmManagementLogs |  |
| AgriFoodFarmManagementLogs |  |
| AgriFoodFarmOperationLogs |  |
| AgriFoodInsightLogs |  |
| AgriFoodJobProcessedLogs |  |
| AgriFoodModelInferenceLogs |  |
| AgriFoodProviderAuthLogs |  |
| AgriFoodSatelliteLogs |  |
| AgriFoodWeatherLogs |  |
| Alert |  |
| AlertEvidence |  |
| AmlOnlineEndpointConsoleLog |  |
| ApiManagementGatewayLogs |  |
| AppCenterError |  |
| AppPlatformSystemLogs |  |
| AppServiceAppLogs |  |
| AppServiceAuditLogs |  |
| AppServiceConsoleLogs |  |
| AppServiceFileAuditLogs |  |
| AppServiceHTTPLogs |  |
| AppServicePlatformLogs |  |
| ATCExpressRouteCircuitIpfix |  |
| AuditLogs |  |
| AutoscaleEvaluationsLog |  |
| AutoscaleScaleActionsLog |  |
| AWSCloudTrail |  |
| AWSGuardDuty |  |
| AWSVPCFlow |  |
| AzureAssessmentRecommendation |  |
| AzureDevOpsAuditing |  |
| BehaviorAnalytics |  |
| BlockchainApplicationLog |  |
| BlockchainProxyLog |  |
| CDBCassandraRequests |  |
| CDBControlPlaneRequests |  |
| CDBDataPlaneRequests |  |
| CDBGremlinRequests |  |
| CDBMongoRequests |  |
| CDBPartitionKeyRUConsumption |  |
| CDBPartitionKeyStatistics |  |
| CDBQueryRuntimeStatistics |  |
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
| DeviceNetworkInfo |  |
| DnsEvents |  |
| DnsInventory |  |
| DummyHydrationFact |  |
| Dynamics365Activity |  |
| EmailAttachmentInfo |  |
| EmailEvents |  |
| EmailPostDeliveryEvents |  |
| EmailUrlInfo |  |
| Event | Partial support – data arriving from Log Analytics agent (MMA) or Azure Monitor Agent (AMA) is fully supported in export. Data arriving via Diagnostics Extension agent is collected though storage while this path isn’t supported in export.2 |
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
| HDInsightHiveTezAppStats |  |
| HDInsightJupyterNotebookEvents |  |
| HDInsightKafkaMetrics |  |
| HDInsightOozieLogs |  |
| HDInsightRangerAuditLogs |  |
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
| MCCEventLogs |  |
| MicrosoftAzureBastionAuditLogs |  |
| MicrosoftDataShareReceivedSnapshotLog |  |
| MicrosoftDataShareSentSnapshotLog |  |
| MicrosoftDataShareShareLog |  |
| MicrosoftHealthcareApisAuditLogs |  |
| NWConnectionMonitorPathResult |  |
| NWConnectionMonitorTestResult |  |
| OfficeActivity | Partial support in government clouds – some of the data to ingested via webhooks from O365 into LA. This portion is missing in export currently. |
| Operation | Partial support – some of the data is ingested through internal services that aren't supported in export. This portion is missing in export currently. |
| Perf | Partial support – only windows perf data is currently supported. The Linux perf data is missing in export currently. |
| PowerBIDatasetsWorkspace |  |
| HDInsightRangerAuditLogs |  |
| PurviewScanStatusLogs |  |
| SCCMAssessmentRecommendation |  |
| SCOMAssessmentRecommendation |  |
| SecurityAlert |  |
| SecurityBaseline |  |
| SecurityBaselineSummary |  |
| SecurityDetection |  |
| SecurityEvent | Partial support – data arriving from Log Analytics agent (MMA) or Azure Monitor Agent (AMA) is fully supported in export. Data arriving via Diagnostics Extension agent is collected though storage while this path isn’t supported in export. |
| SecurityIncident |  |
| SecurityIoTRawEvent |  |
| SecurityNestedRecommendation |  |
| SecurityRecommendation |  |
| SentinelHealth |  |
| SfBAssessmentRecommendation |  |
| SfBOnlineAssessmentRecommendation |  |
| SharePointOnlineAssessmentRecommendation |  |
| SignalRServiceDiagnosticLogs |  |
| SigninLogs |  |
| SPAssessmentRecommendation |  |
| SQLAssessmentRecommendation |  |
| SQLSecurityAuditEvents |  |
| SucceededIngestion |  |
| SynapseBigDataPoolApplicationsEnded |  |
| SynapseBuiltinSqlPoolRequestsEnded |  |
| SynapseGatewayApiRequests |  |
| SynapseIntegrationActivityRuns |  |
| SynapseIntegrationPipelineRuns |  |
| SynapseIntegrationTriggerRuns |  |
| SynapseRbacOperations |  |
| SynapseSqlPoolDmsWorkers |  |
| SynapseSqlPoolExecRequests |  |
| SynapseSqlPoolRequestSteps |  |
| SynapseSqlPoolSqlRequests |  |
| SynapseSqlPoolWaits |  |
| Syslog | Partial support – data arriving from Log Analytics agent (MMA) or Azure Monitor Agent (AMA) is fully supported in export. Data arriving via Diagnostics Extension agent is collected though storage while this path isn’t supported in export. |
| ThreatIntelligenceIndicator |  |
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
