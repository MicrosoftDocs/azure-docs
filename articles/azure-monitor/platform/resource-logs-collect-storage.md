---
title: Archive Azure resource logs to storage account | Microsoft Docs
description: Learn how to archive your Azure resource logs for long-term retention in a storage account.
author: bwren
services: azure-monitor
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 09/20/2019
ms.author: bwren
ms.subservice: logs
---
# Archive Azure resource logs to storage account
[Resource logs](resource-logs-overview.md) in Azure provide rich, frequent data about the internal operation of an Azure resource. This article describes collecting resource logs to an Azure storage account to retain data for archiving.

## Prerequisites
You need to [create an Azure storage account](../../storage/common/storage-quickstart-create-account.md) if you don't already have one. The storage account does not have to be in the same subscription as the resource sending logs as long as the user who configures the setting has appropriate RBAC access to both subscriptions.

You should not use an existing storage account that has other, non-monitoring data stored in it so that you can better control access to monitoring data. If you are also archiving the [Activity log](activity-logs-overview.md) to a storage account though, you may choose to use that same storage account to keep all monitoring data in a central location.

## Create a diagnostic setting
Resource logs are not collected by default. Collect them in an Azure storage account and other destinations by creating a diagnostic setting for an Azure resource. See [Create diagnostic setting to collect logs and metrics in Azure](diagnostic-settings.md) for details.


## Data retention
The retention policy defines the number of days to retain the data from each log category and metric data stored in a storage account. A retention policy can be any number of days between 0 and 365. A retention policy of zero specifies that the events for that log category are stored indefinitely.

Retention policies are applied per-day, so at the end of a day (UTC), logs from the day that is now beyond the retention policy will be deleted. For example, if you had a retention policy of one day, at the beginning of the day today the logs from the day before yesterday would be deleted. The delete process begins at midnight UTC, but note that it can take up to 24 hours for the logs to be deleted from your storage account. 


## Schema of resource logs in storage account

Once you have created the diagnostic setting, a storage container is created in the storage account as soon as an event occurs in one of the enabled log categories. The blobs within the container use the following naming convention:

```
insights-logs-{log category name}/resourceId=/SUBSCRIPTIONS/{subscription ID}/RESOURCEGROUPS/{resource group name}/PROVIDERS/{resource provider name}/{resource type}/{resource name}/y={four-digit numeric year}/m={two-digit numeric month}/d={two-digit numeric day}/h={two-digit 24-hour clock hour}/m=00/PT1H.json
```

For example, the blob for a network security group might have a name similar to the following:

```
insights-logs-networksecuritygrouprulecounter/resourceId=/SUBSCRIPTIONS/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/RESOURCEGROUPS/TESTRESOURCEGROUP/PROVIDERS/MICROSOFT.NETWORK/NETWORKSECURITYGROUP/TESTNSG/y=2016/m=08/d=22/h=18/m=00/PT1H.json
```

Each PT1H.json blob contains a JSON blob of events that occurred within the hour specified in the blob URL (for example, h=12). During the present hour, events are appended to the PT1H.json file as they occur. The minute value (m=00) is always 00, since resource log events are broken into individual blobs per hour.

Within the PT1H.json file, each event is stored with the following format. This will use a common top level schema but be unique for each Azure services as described in [Resource logs schema](resource-logs-overview.md#resource-logs-schema).

``` JSON
{"time": "2016-07-01T00:00:37.2040000Z","systemId": "46cdbb41-cb9c-4f3d-a5b4-1d458d827ff1","category": "NetworkSecurityGroupRuleCounter","resourceId": "/SUBSCRIPTIONS/s1id1234-5679-0123-4567-890123456789/RESOURCEGROUPS/TESTRESOURCEGROUP/PROVIDERS/MICROSOFT.NETWORK/NETWORKSECURITYGROUPS/TESTNSG","operationName": "NetworkSecurityGroupCounters","properties": {"vnetResourceGuid": "{12345678-9012-3456-7890-123456789012}","subnetPrefix": "10.3.0.0/24","macAddress": "000123456789","ruleName": "/subscriptions/ s1id1234-5679-0123-4567-890123456789/resourceGroups/testresourcegroup/providers/Microsoft.Network/networkSecurityGroups/testnsg/securityRules/default-allow-rdp","direction": "In","type": "allow","matchedConnections": 1988}}
```

> [!NOTE]
> Platform logs are written to blob storage using [JSON lines](http://jsonlines.org/), where each event is a line and the newline character indicates a new event. This format was implemented in November 2018. Prior to this date, logs were written to blob storage as a json array of records as described in [Prepare for format change to Azure Monitor platform logs archived to a storage account](resource-logs-blob-format.md).

## Next steps

* [Download blobs for analysis](../../storage/blobs/storage-quickstart-blobs-dotnet.md).
* [Archive Azure Active Directory logs with Azure Monitor](../../active-directory/reports-monitoring/quickstart-azure-monitor-route-logs-to-storage-account.md).
* [Read more about resource logs](../../azure-monitor/platform/resource-logs-overview.md).

