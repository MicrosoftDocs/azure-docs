---
title: Customer-owned storage accounts for log ingestion
description: Use your own storage account for ingestion of log data into a Log Analytics workspace in Azure Monitor.
ms.subservice: logs
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 05/20/2020

---

# Customer-owned storage accounts for log ingestion in Azure Monitor

Azure Monitor uses storage accounts in the ingestion process of some data types such as [custom logs](data-sources-custom-logs.md) and some [Azure logs](azure-storage-iis-table.md). During the ingestion process, logs are first sent to a storage account and later ingested into Log Analytics or Application Insights. If you want control over your data during ingestion, you can use your own storage accounts instead of the service-managed storage. Using your own storage account gives you control over the access, content, encryption, and retention of the logs during ingestion. We refer to this as Bring Your Own Storage, or BYOS. 

One scenario that requires BYOS is network isolation through Private Links. When using a VNet, network isolation is often a requirement, and access to the public internet is limited. In such cases, accessing Azure Monitor service storage for log ingestion is either completely blocked, or considered a bad practice. Instead, Logs should be ingested through a customer-owned storage account inside the VNet or easily accessible from it.

Another scenario is the encryption of logs with Customer-Managed Keys (CMK). Customers can encrypt logged data by using CMK on the clusters that store the logs. The same key can also be used to encrypt logs during the ingestion process.

## Data types supported

Data types that are ingested from a storage account include the following. See [Collect data from Azure diagnostics extension to Azure Monitor Logs](azure-storage-iis-table.md) for more information about the ingestion of these types.

| Type | Table information |
|:-----|:------------------|
| IIS logs | Blob: wad-iis-logfiles|
|Windows event logs | Table: WADWindowsEventLogsTable |
| Syslog | Table: LinuxsyslogVer2v0 |
| Windows ETW logs | Table: WADETWEventTable|
| Service fabric | Table: WADServiceFabricSystemEventTable <br/> WADServiceFabricReliableActorEventTable<br/> WADServiceFabricReliableServicEventTable |
| Custom logs | n/a |
| Azure Security Center Watson dump files | n/a|  

## Storage account requirements 
The storage account must meet the following requirements:

- Accessible to resources on your VNet that write logs to the storage.
- Must be on the same region as the workspace it’s linked to.
- Explicitly allowed Log Analytics to read logs from the storage account by selecting *allow trusted MS services to access this storage account*.

## Process to configure customer-owned storage
The basic process of using your own storage account for ingestion is as follows:

1. Create a storage account or select an existing account.
2. Link the storage account to a Log Analytics workspace.
3. Manage the storage by reviewing its load and retention to ensure sure it’s functioning as expected.

The only method available to create and remove links is through the REST API. Details on the specific API request required for each process are provided in the sections below.

## API request values

#### dataSourceType 

- AzureWatson - Use this value for Azure Security Center Azure Watson dump files.
- CustomLogs – Use this value for the following data types:
  - Custom logs
  - IIS Logs
  - Events (Windows)
  - Syslog (Linux)
  - ETW Logs
  - Service Fabric Events
  - Assessment data  

#### storage_account_resource_id
This value uses the following structure:

```
subscriptions/{subscriptionId}/resourcesGroups/{resourceGroupName}/providers/Microsoft.Storage/storageAccounts/{storageAccountName1}
```



## Get current links

### Get linked storage accounts for a specific data source type

#### API request

```
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/linkedStorageAccounts/{dataSourceType}?api-version=2019-08-01-preview  
```

#### Response 

```json
{
    "properties":
    {
        "dataSourceType": "CustomLogs",
        "storageAccountIds  ": 
        [  
            "<storage_account_resource_id_1>",
            "<storage_account_resource_id_2>"
        ],
    },
    "id":"/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/microsoft. operationalinsights/workspaces/{resourceName}/linkedStorageAccounts/CustomLogs",
    "name": "CustomLogs",
    "type": "Microsoft.OperationalInsights/workspaces/linkedStorageAccounts"
}
```

### Get all linked storage accounts

#### API request

```
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/linkedStorageAccounts?api-version=2019-08-01-preview  
```

#### Response

```json
{
    [
        {
            "properties":
            {
                "dataSourceType": "CustomLogs",
                "storageAccountIds  ": 
                [  
                    "<storage_account_resource_id_1>",
                    "<storage_account_resource_id_2>"
                ],
            },
            "id":"/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/microsoft. operationalinsights/workspaces/{resourceName}/linkedStorageAccounts/CustomLogs",
            "name": "CustomLogs",
            "type": "Microsoft.OperationalInsights/workspaces/linkedStorageAccounts"
        },
        {
            "properties":
            {
                "dataSourceType": " AzureWatson "
                "storageAccountIds  ": 
                [  
                    "<storage_account_resource_id_3>",
                    "<storage_account_resource_id_4>"
                ],
            },
            "id":"/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/microsoft. operationalinsights/workspaces/{resourceName}/linkedStorageAccounts/AzureWatson",
            "name": "AzureWatson",
            "type": "Microsoft.OperationalInsights/workspaces/linkedStorageAccounts"
        }
    ]
}
```

## Create or modify a link

Once you link a storage account to a workspace, Log Analytics will start using it instead of the storage account owned by the service. You can register a list of storage accounts at the same time, and you can use the same storage account for multiple workspaces.

If your workspace handles both VNet resources and resources outside a VNet, you should make sure it’s not rejecting traffic coming from the internet. Your storage should have the same settings as your workspace and be made available to resources outside your VNet. 

### API request

```
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/linkedStorageAccounts/{dataSourceType}?api-version=2019-08-01-preview  
```

### Payload

```json
{
    "properties":
    {
        "storageAccountIds  " : 
        [  
            "<storage_account_resource_id_1>",
            "<storage_account_resource_id_2>"
        ],
    }
}
```

### Response

```json
{
    "properties":
    {
        "dataSourceType": "CustomLogs"
        "storageAccountIds  ": 
        [  
            "<storage_account_resource_id_1>",
            "<storage_account_resource_id_2>"
        ],
    },
"id":"/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/microsoft. operationalinsights/workspaces/{resourceName}/linkedStorageAccounts/CustomLogs",
"name": "CustomLogs",
"type": "Microsoft.OperationalInsights/workspaces/linkedStorageAccounts"
}
```


## Unlink a storage account
If you decide to stop using a storage account for ingestion, or replace the workspace you use, you should unlink the storage from the workspace.

Unlinking all storage accounts from a workspace means ingestion will attempt to rely on service-managed storage accounts. If your agents run on a VNet with limited access to the internet, ingestion is expected to fail. The workspace must have a linked storage account that is reachable from your monitored resources.

Before deleting a storage account, you should make sure that all the data it contains has been ingested to the workspace. As a precaution, keep your storage account available after linking an alternative storage. Only delete it once all of its content has been ingested, and you can see new data is written to the newly connected storage account.


### API request
```
DELETE https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/linkedStorageAccounts/{dataSourceType}?api-version=2019-08-01-preview  
```

## Replace a storage account

To replace a storage account used for ingestion, first create a link for a new storage account. The logging agents will get the updated configuration and start sending data to the new storage as well.

Next unlink the old storage account so agents will stop writing to the removed account. The ingestion process keeps reading data from this account until it’s all ingested. Don’t delete the storage account until you see all logs were ingested.

Agent configuration will be refreshed after a few minutes, and they will switch to the new storage.

## Manage storage account

### Load

Storage accounts can handle a certain load of read and write requests before they start throttling requests. Throttling affects the time it takes to ingest logs and may result in lost data. If your storage is overloaded, register additional storage accounts and spread the load between them. 

### Related charges

Storage accounts are charged by the volume of stored data, types of storage, and type of redundancy. For details see [Block blob pricing](https://azure.microsoft.com/pricing/details/storage/blobs/) and [Table Storage pricing](https://azure.microsoft.com/pricing/details/storage/tables/).

If the registered storage account of your workspace is on another region, you will be charged for egress according to these [Bandwidth Pricing Details](https://azure.microsoft.com/pricing/details/bandwidth/).



## Next steps

- For more information on setting up a private link, see [Use Azure Private Link to securely connect networks to Azure Monitor](private-link-security.md)
