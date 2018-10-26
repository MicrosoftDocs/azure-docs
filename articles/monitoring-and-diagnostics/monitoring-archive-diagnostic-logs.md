---
title: Archive Azure Diagnostic Logs
description: Learn how to archive your Azure Diagnostic Logs for long-term retention in a storage account.
author: johnkemnetz
services: azure-monitor
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 07/18/2018
ms.author: johnkem
ms.component: logs
---
# Archive Azure Diagnostic Logs

In this article, we show how you can use the Azure portal, PowerShell Cmdlets, CLI, or REST API to archive your [Azure diagnostic logs](monitoring-overview-of-diagnostic-logs.md) in a storage account. This option is useful if you would like to retain your diagnostic logs with an optional retention policy for audit, static analysis, or backup. The storage account does not have to be in the same subscription as the resource emitting logs as long as the user who configures the setting has appropriate RBAC access to both subscriptions.

> [!WARNING]
> The format of the log data in the storage account will change to JSON Lines on Nov. 1st, 2018. [See this article for a description of the impact and how to update your tooling to handle the new format.](./monitor-diagnostic-logs-append-blobs.md) 
>
> 

## Prerequisites

Before you begin, you need to [create a storage account](../storage/storage-create-storage-account.md) to which you can archive your diagnostic logs. We highly recommend that you do not use an existing storage account that has other, non-monitoring data stored in it so that you can better control access to monitoring data. However, if you are also archiving your Activity Log and diagnostic metrics to a storage account, it may make sense to use that storage account for your diagnostic logs as well to keep all monitoring data in a central location.

> [!NOTE]
>  You cannot currently archive data to a storage account that behind a secured virtual network.

## Diagnostic settings

To archive your diagnostic logs using any of the methods below, you set a **diagnostic setting** for a particular resource. A diagnostic setting for a resource defines the categories of logs and metric data sent to a destination (storage account, Event Hubs namespace, or Log Analytics). It also defines the retention policy (number of days to retain) for events of each log category and metric data stored in a storage account. If a retention policy is set to zero, events for that log category are stored indefinitely (that is to say, forever). A retention policy can otherwise be any number of days between 1 and 2147483647. [You can read more about diagnostic settings here](monitoring-overview-of-diagnostic-logs.md#diagnostic-settings). Retention policies are applied per-day, so at the end of a day (UTC), logs from the day that is now beyond the retention policy will be deleted. For example, if you had a retention policy of one day, at the beginning of the day today the logs from the day before yesterday would be deleted. The delete process begins at midnight UTC, but note that it can take up to 24 hours for the logs to be deleted from your storage account. 

> [!NOTE]
> Sending multi-dimensional metrics via diagnostic settings is not currently supported. Metrics with dimensions are exported as flattened single dimensional metrics, aggregated across dimension values.
>
> *For example*: The 'Incoming Messages' metric on an Event Hub can be explored and charted on a per queue level. However, when exported via diagnostic settings the metric will be represented as all incoming messages across all queues in the Event Hub.
>
>

## Archive diagnostic logs using the portal

1. In the portal, navigate to Azure Monitor and click on **Diagnostic Settings**

    ![Monitoring section of Azure Monitor](media/monitoring-archive-diagnostic-logs/diagnostic-settings-blade.png)

2. Optionally filter the list by resource group or resource type, then click on the resource for which you would like to set a diagnostic setting.

3. If no settings exist on the resource you have selected, you are prompted to create a setting. Click "Turn on diagnostics."

   ![Add diagnostic setting - no existing settings](media/monitoring-archive-diagnostic-logs/diagnostic-settings-none.png)

   If there are existing settings on the resource, you will see a list of settings already configured on this resource. Click "Add diagnostic setting."

   ![Add diagnostic setting - existing settings](media/monitoring-archive-diagnostic-logs/diagnostic-settings-multiple.png)

3. Give your setting a name and check the box for **Export to Storage Account**, then select a storage account. Optionally, set a number of days to retain these logs by using the **Retention (days)** sliders. A retention of zero days stores the logs indefinitely.

   ![Add diagnostic setting - existing settings](media/monitoring-archive-diagnostic-logs/diagnostic-settings-configure.png)

4. Click **Save**.

After a few moments, the new setting appears in your list of settings for this resource, and diagnostic logs are archived to that storage account as soon as new event data is generated.

## Archive diagnostic logs via Azure PowerShell

```
Set-AzureRmDiagnosticSetting -ResourceId /subscriptions/s1id1234-5679-0123-4567-890123456789/resourceGroups/testresourcegroup/providers/Microsoft.Network/networkSecurityGroups/testnsg -StorageAccountId /subscriptions/s1id1234-5679-0123-4567-890123456789/resourceGroups/myrg1/providers/Microsoft.Storage/storageAccounts/my_storage -Categories networksecuritygroupevent,networksecuritygrouprulecounter -Enabled $true -RetentionEnabled $true -RetentionInDays 90
```

| Property | Required | Description |
| --- | --- | --- |
| ResourceId |Yes |Resource ID of the resource on which you want to set a diagnostic setting. |
| StorageAccountId |No |Resource ID of the Storage Account to which Diagnostic Logs should be saved. |
| Categories |No |Comma-separated list of log categories to enable. |
| Enabled |Yes |Boolean indicating whether diagnostics are enabled or disabled on this resource. |
| RetentionEnabled |No |Boolean indicating if a retention policy are enabled on this resource. |
| RetentionInDays |No |Number of days for which events should be retained between 1 and 2147483647. A value of zero stores the logs indefinitely. |

## Archive diagnostic logs via the Azure CLI

```azurecli
az monitor diagnostic-settings create --name <diagnostic name> \
    --storage-account <name or ID of storage account> \
    --resource <target resource object ID> \
    --resource-group <storage account resource group> \
    --logs '[
    {
        "category": <category name>,
        "enabled": true,
        "retentionPolicy": {
            "days": <# days to retain>,
            "enabled": true
        }
    }]'
```

You can add additional categories to the diagnostic log by adding dictionaries to the JSON array passed as the `--logs` parameter.

The `--resource-group` argument is only required if `--storage-account` is not an object ID. For the full documentation for archiving diagnostic logs to storage, see the [CLI command reference](/cli/azure/monitor/diagnostic-settings#az-monitor-diagnostic-settings-create).

## Archive diagnostic logs via the REST API

[See this document](https://docs.microsoft.com/rest/api/monitor/diagnosticsettings) for information on how you can set up a diagnostic setting using the Azure Monitor REST API.

## Schema of diagnostic logs in the storage account

Once you have set up archival, a storage container is created in the storage account as soon as an event occurs in one of the log categories you have enabled. The blobs within the container follow the same naming convention across Activity Logs and Diagnostic Logs, as illustrated here:

```
insights-logs-{log category name}/resourceId=/SUBSCRIPTIONS/{subscription ID}/RESOURCEGROUPS/{resource group name}/PROVIDERS/{resource provider name}/{resource type}/{resource name}/y={four-digit numeric year}/m={two-digit numeric month}/d={two-digit numeric day}/h={two-digit 24-hour clock hour}/m=00/PT1H.json
```

For example, a blob name might be:

```
insights-logs-networksecuritygrouprulecounter/resourceId=/SUBSCRIPTIONS/s1id1234-5679-0123-4567-890123456789/RESOURCEGROUPS/TESTRESOURCEGROUP/PROVIDERS/MICROSOFT.NETWORK/NETWORKSECURITYGROUP/TESTNSG/y=2016/m=08/d=22/h=18/m=00/PT1H.json
```

Each PT1H.json blob contains a JSON blob of events that occurred within the hour specified in the blob URL (for example, h=12). During the present hour, events are appended to the PT1H.json file as they occur. The minute value (m=00) is always 00, since diagnostic log events are broken into individual blobs per hour.

Within the PT1H.json file, each event is stored in the “records” array, following this format:

``` JSON
{
    "records": [
        {
            "time": "2016-07-01T00:00:37.2040000Z",
            "systemId": "46cdbb41-cb9c-4f3d-a5b4-1d458d827ff1",
            "category": "NetworkSecurityGroupRuleCounter",
            "resourceId": "/SUBSCRIPTIONS/s1id1234-5679-0123-4567-890123456789/RESOURCEGROUPS/TESTRESOURCEGROUP/PROVIDERS/MICROSOFT.NETWORK/NETWORKSECURITYGROUPS/TESTNSG",
            "operationName": "NetworkSecurityGroupCounters",
            "properties": {
                "vnetResourceGuid": "{12345678-9012-3456-7890-123456789012}",
                "subnetPrefix": "10.3.0.0/24",
                "macAddress": "000123456789",
                "ruleName": "/subscriptions/ s1id1234-5679-0123-4567-890123456789/resourceGroups/testresourcegroup/providers/Microsoft.Network/networkSecurityGroups/testnsg/securityRules/default-allow-rdp",
                "direction": "In",
                "type": "allow",
                "matchedConnections": 1988
            }
        }
    ]
}
```

| Element name | Description |
| --- | --- |
| time |Timestamp when the event was generated by the Azure service processing the request corresponding the event. |
| resourceId |Resource ID of the impacted resource. |
| operationName |Name of the operation. |
| category |Log category of the event. |
| properties |Set of `<Key, Value>` pairs (i.e. Dictionary) describing the details of the event. |

> [!NOTE]
> The properties and usage of those properties can vary depending on the resource.

## Next steps

* [Download blobs for analysis](../storage/storage-dotnet-how-to-use-blobs.md)
* [Stream diagnostic logs to an Event Hubs namespace](monitoring-stream-diagnostic-logs-to-event-hubs.md)
* [Archive Azure Active Directory logs with Azure Monitor](../active-directory/reports-monitoring/quickstart-azure-monitor-route-logs-to-storage-account.md)
* [Read more about diagnostic logs](monitoring-overview-of-diagnostic-logs.md)
