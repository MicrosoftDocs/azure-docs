---
title: Data export in Log Analytics
description: 
ms.subservice: logs
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 09/09/2020

---

# Data export in Log Analytics (preview)
Log Analytics data export allows you to continuously export data of selected tables from your Log Analytics workspace to Azure Storage Account or Event Hub as it's collected. This article provides background information and steps to configure data export in your workspaces.

## Overview
Once data export is configured for your workspace, any new data sent to the selected tables in your Log Analytics workspace is exported to your storage account hourly or to event hub in near-real-time. Export rules can be disabled to let you stop the export when you don’t need to retain data during certain time, for example, during testing. 

There is no a way to filter data or to limit the export to certain events. For example, when you configure a data export rule for *SecurityEvent* table, all data sent to the *SecurityEvent* table is exported starting from the configuration time.

## Other export options
Log Analytics data export continuously exports data from a Log Analytics workspace. Other options to export data for particular scenarios include the following:

- One time export to local machine using [PowerShell script](https://www.powershellgallery.com/packages/Invoke-AzOperationalInsightsQueryExport).
- One time batch export using [Logic App connector](logicapp-flow-connector.md).

## Current limitations

- Configuration may only be performed using REST requests. You cannot use the Azure portal or with PowerShell or CLI.
- Supported tables are currently limited to *Heartbeat*, *SecurityEvent*, and *Perf*. 
- Your Log Analytics workspace must in one of the following regions:
  - East US
  - West Europe
  - Central Canada
- Sending data to Azure Data Lake Storage Gen2 is not currently supported.
- The destination storage account or event hub must be in the same region as the Log Analytics workspace.
- Names of tables to be exported can be no longer than 60 characters for a storage account and no more than 47 characters to an event hub. Tables with longer names will not be exported.

## Cost
There are currently no additional charges for the preview feature Data export.  Pricing for features that are in preview will be announced in the future and a notice provided prior to start of billing. Should you choose to continue using Data export after the notice period, you will be billed at the applicable rate. 

## Prerequisites

- The storage account and event hub must already be created and must be in the same region as the Log Analytics workspace.
- The storage account must be StorageV1 or StorageV2. Classic storage is not supported  
- Export to storage requires that you register your subscription ID where your storage account is located with the *Microsoft.Insights* resource provider namespace. 
- If you have configured your storage account to allow access from selected networks, you need to add an exception in your storage account settings to allow Azure Monitor to write to your storage.

Azure Monitor lets you export data of selected tables from your Log Analytics workspace as it reaches ingestion, and continuously send it to Azure Storage Account and Event Hub. Log Analytics data export can write append blobs to immutable storage accounts when time-based retention policies have the allowProtectedAppendWrites setting enabled. This allows writing new blocks to an append blob, while maintaining immutability protection and compliance.

See [Allow protected append blobs writes](../storage/blobs/storage-blob-immutable-storage.md#allow-protected-append-blobs-writes)




## Regions
The Log Analytics workspace and destination storage account and event hub must be located in the same region. If you need to replicate your data to other storage accounts, you can use any of the [Azure Storage redundancy options](../../storage/common/storage-redundancy.md).  

Log Analytics continuous export is supported in the following regions:

  
- Register resource provider
- Allow trusted services
- Create data export rule

## Register resource provider

The following Azure resource providers need to registered for your subscription to enable Azure Monitor for VMs guest health.

- Microsoft.Insights

You can use any of the available methods to register a resource provider as described in [Azure resource providers and types](../..azure-resource-manager/management/resource-providers-and-types.md). You can also use the following sample command using PowerShell to make authenticated call to ARM:

```PowerShell
Register-AzResourceProvider -ProviderNamespace Microsoft.insights
```

## Allow trusted Microsoft services
If you have configured your Storage Account to allow access from selected networks, you need to add an exception to allow Azure Monitor to write to the account. From **Firewalls and virtual networks** for your storage account, select **Allow trusted Microsoft services to access this storage account**.

[![Storage account firewalls and virtual networks](media/logs-data-export/storage-account-vnet.png)](media/logs-data-export/storage-account-vnet.png#lightbox)



## Storage account details
Data is sent to any storage accounts every hour. The export creates a container for each table in the storage account with the name *am-* followed by the name of the table. For example, the table *SecurityEvent* would sent to a container named *am-SecurityEvent*. 

The storage account blob path is *WorkspaceResourceId=/subscriptions/subscription-id/resourcegroups/\<resource-group\>/providers/microsoft.operationalinsights/workspaces/\<workspace\>/y=\<four-digit numeric year\>/m=\<two-digit numeric month\>/d=\<two-digit numeric day\>/h=\<two-digit 24-hour clock hour\>/m=00/PT1H.json*. Since append blobs are limited to 50K writes in storage, the number of exported blobs may extend if the number of appends is high. The naming pattern for blobs in such a case would be PT1H_#.json, where # is the incremental blob count.

The storage account data format is [JSON lines](diagnostic-logs-append-blobs.md). This means each record is delimited by a newline, with no outer records array and no commas between JSON records. example:

## Event hub details
Data is sent to each event hub in near real time as it's collected by the Log Analytics workspace. An Event Hub is created for each data type that you export with the name *am-* followed by the name of the table. For example, the table *SecurityEvent* would sent to an event hub named *am-SecurityEvent*. If you want the exported data to reach a specific Event Hub, or if you have a table with a name that exceeds the 47 character limit, you can provide your own Event Hub name and export all tables to it.


Your volume of exported data often increase over time, and the event hub scale needs to be increased to handle larger transfer rates and avoid throttling scenarios and data latency. You should use the auto-inflate feature of event hubs to automatically scale up and increase the number of throughput units and meet usage needs. See [Automatically scale up Azure Event Hubs throughput units](../event-hubs/event-hubs-auto-inflate.md) for details.


## Create or update data export rule
A data export defines data to be exported to a single storage account, a single event hub, or both. If you need to send to multiple destinations of the same type, then you can create multiple rules. A single rule can specify all tables or a certain set of tables to be sent to each destination.

Use the following commands to create a data export rule.

```azurecli
az monitor log-analytics workspace data-export create --resource-group resourceGroupName --workspace-name workspaceName --name ruleName --tables SecurityEvent Heartbeat --destination $EventHubsNamespacesId
```



```rest
PUT https://management.azure.com/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/Microsoft.operationalInsights/workspaces/<workspace-name>/dataexports/<data-export-name>?api-version=2020-08-01
Authorization: Bearer <token>
Content-type: application/json

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


## View data export configuration
Use the following commands to view the configuration of a data export rule.

```azurecli
az monitor log-analytics workspace data-export show --resource-group resourceGroupName --workspace-name workspaceName --name ruleName
```

```rest
GET https://management.azure.com/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/Microsoft.operationalInsights/workspaces/<workspace-name>/dataexports/<data-export-name>?api-version=2020-08-01
```

## Disable an export rule
Use the following commands to disable an data export rule.

```azurecli
az monitor log-analytics workspace data-export update --resource-group resourceGroupName --workspace-name workspaceName --name ruleName --enable false
```


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

## Delete an export rule
Use the following commands to delete an export rule.

```azurecli
az monitor log-analytics workspace data-export delete --resource-group resourceGroupName --workspace-name workspaceName --name ruleName
```


```rest
DELETE https://management.azure.com/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/Microsoft.operationalInsights/workspaces/<workspace-name>/dataexports/<data-export-name>?api-version=2020-08-01
```

## View all data export rules in a workspace
Use the following commands to view all data export rules in a workspace.

```azurecli
az monitor log-analytics workspace data-export list --resource-group resourceGroupName --workspace-name workspaceName
```

```rest
GET https://management.azure.com/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/Microsoft.operationalInsights/workspaces/<workspace-name>/dataexports?api-version=2020-08-01
```


