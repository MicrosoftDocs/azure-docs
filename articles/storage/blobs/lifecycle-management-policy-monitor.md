---
title: Lifecycle management policy monitoring
titleSuffix: Azure Blob Storage
description: Monitor Lifecycle management policy runs
author: normesta

ms.author: normesta
ms.date: 03/10/2025
ms.service: azure-blob-storage
ms.topic: conceptual 

---

# Monitor lifecycle management policy runs

You can determine when a lifecycle management run completes by subscribing to an event. You can use event properties to identify issues and investigate errors by using metrics and logs. 

## Receiving notifications when a run is complete

A client can be notified when a lifecycle management run is complete by subscribing to the `LifecyclePolicyCompleted` event. This event is generated when the actions defined by a lifecycle management policy are performed. A summary section appears for each action that is included in the policy definition. The following json shows an example `LifecyclePolicyCompleted` event for a policy. Because the policy definition includes the `delete`, `tierToCool`, `tierToCold`, and `tierToArchive` actions, a summary section appears for each one. 

```json
{
    "topic": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/contosoresourcegroup/providers/Microsoft.Storage/storageAccounts/contosostorageaccount",
    "subject": "BlobDataManagement/LifeCycleManagement/SummaryReport",
    "eventType": "Microsoft.Storage.LifecyclePolicyCompleted",
    "eventTime": "2022-05-26T00:00:40.1880331",    
    "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "data": {
        "scheduleTime": "2022/05/24 22:57:29.3260160",
        "deleteSummary": {
            "totalObjectsCount": 5,
            "successCount": 3,
            "errorList": ["testFile4.txt", "testFile5.txt"]
        },
        "tierToCoolSummary": {
            "totalObjectsCount": 0,
            "successCount": 0,
            "errorList": ""
        },
        "tierToColdSummary": {
            "totalObjectsCount": 0,
            "successCount": 0,
            "errorList": ""
        },
        "tierToArchiveSummary": {
            "totalObjectsCount": 0,
            "successCount": 0,
            "errorList": ""
        }
    },
    "dataVersion": "1",
    "metadataVersion": "1"
}
```

The following table describes the schema of the `LifecyclePolicyCompleted` event.

|Field|Type|Description|
|---|---|---|
|scheduleTime|string|The time that the lifecycle policy was scheduled|
|deleteSummary|vector\<byte\>|The results summary of blobs scheduled for delete operation|
|tierToCoolSummary|vector\<byte\>|The results summary of blobs scheduled for tier-to-cool operation|
|tierToColdSummary|vector\<byte\>|The results summary of blobs scheduled for tier-to-cold operation|
|tierToArchiveSummary|vector\<byte\>|The results summary of blobs scheduled for tier-to-archive operation|

To learn more about the different ways to subscribe to an event, see [Event handlers in Azure Event Grid](../../event-grid/event-handlers.md?toc=/azure/storage/blobs/toc.json#microsoftstoragelifecyclepolicycompleted-event).

## Investigating errors by using metric and logs

The event response from the previous section shows that the lifecycle management policy attempted to delete five objects, but succeeded with only three of them. The `testFile4.txt` and `testFile5.txt` files were not successfully deleted as part of that run. To diagnose why some objects weren't processed successfully, you can use metrics explorer and query resource logs in Azure Monitor.

### Metrics

To determine exactly _when_ operations failed, use metrics explorer. You can see all transactions that were applied against the account in the timeframe between the `scheduleTime` and `eventTime` value that appear in the `LifecyclePolicyCompleted` properties. 

Use the following metric filters to narrow transactions to those executed by the policy:

| Filter | Operator | Value |
|---|---|---|
| Transaction type | equal | `system` |
| API name | equal | `DeleteBlob` |
| Response type | not equal | `Success` |

The following image shows an example. The line chart shows the time these operations failed. 

  > [!div class="mx-imgBorder"]
  > ![Screenshot showing metrics being applied to determine delete operations that failed.](media/lifecycle-management-policy-monitor/lifecycle-management-policy-metrics.png)

### Logs

To find out why objects weren't successfully processed by the policy, you can look at resource logs. Narrow logs to the time frame of the failures. Then, look at entries where the **UserAgentHeader** field is set to **ObjectLifeCycleScanner** or **OLCMScanner**. If you configured a diagnostic setting to send logs to Azure Monitor Log Analytics workspace, then you can use a Kusto query. The following example query finds log entries for failed delete operations that were initiated by a lifecycle management policy.

```kusto
StorageBlobLogs
| where OperationName contains "DeleteBlob" and UserAgentHeader contains "ObjectLifeCycleScanner"
| project TimeGenerated, StatusCode, StatusText
```

The **StatusCode** and **StatusText** indicates what has caused the failure. The following image shows the output of that query. Both log entries show a **StatusText** value of **LeaseIdMissing**. This means that both objects have an active lease that must be broken or released before the operation can succeed. 

  > [!div class="mx-imgBorder"]
  > ![Screenshot showing a kusto query and the results of the query which shows failed attempts to delete objects.](media/lifecycle-management-policy-monitor/lifecycle-management-policy-logs.png)

## See also

- [Azure Blob Storage lifecycle management overview](lifecycle-management-overview.md)
- [Lifecycle management policies that transition blobs between tiers](lifecycle-management-policy-access-tiers.md)
- [Lifecycle management policies that delete blobs](lifecycle-management-policy-delete.md)
- [Access tiers for blob data](access-tiers-overview.md)
