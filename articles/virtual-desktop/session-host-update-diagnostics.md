---
title: Example diagnostic queries for session host update - Azure Virtual Desktop
description: Some example queries you can use with Log Analytics in Azure Monitor to view diagnostics information about session host update.
ms.topic: how-to
author: dknappettmsft
ms.author: daknappe
ms.date: 10/01/2024
---

# Example diagnostic queries for session host update in Azure Virtual Desktop

> [!IMPORTANT]
> Session host update for Azure Virtual Desktop is currently in PREVIEW. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Session host update uses [Log Analytics in Azure Monitor](/azure/azure-monitor/logs/log-analytics-overview) to store information about updates. This article has some example Kusto queries you can use with Log Analytics to see information about session host updates.

## Prerequisites

Before you can use these queries, you need:

- An existing host pool with a session host configuration.

- Configured [diagnostic settings](diagnostics-log-analytics.md) on each host pool you use with session host update to send logs and metrics to a Log Analytics workspace. The categories **Checkpoint**, **Error**, and **Session Host Management Activity Logs** must be enabled as a minimum.

- A previously [scheduled and run a session host update](session-host-update-configure.md) on the session hosts in the host pool.

## Diagnostic data location

Once you configure diagnostic settings on a host pool, diagnostic data for session host update is stored in the tables `WVDSessionHostManagement` and `WVDCheckpoints` of your Log Analytics workspace. Log entries use the existing *Management* activity type, which comes from the Azure Resource Manager (ARM) provider.

The table `WVDSessionHostManagement` is specific to session host update and is created once you enable the category **Session Host Management Activity Logs** on the diagnostic settings for each host pool you use with session host update, and session host update runs. If you previously configured diagnostic settings for a host pool, you need to enable the category **Session Host Management Activity Logs**. For more information  [Configure diagnostic settings to capture platform logs and metrics for Azure Virtual Desktop](diagnostics-log-analytics.md).

The rest of this article has some example queries you can run. You can use them as a basis to create your own queries. You need to run each of these queries in Log Analytics. For more information on how to run queries, see [Start Log Analytics](/azure/azure-monitor/logs/log-analytics-overview#start-log-analytics).

## Session host updates that completed successfully

This query correlates the tables `WVDSessionHostManagement` and `WVDCheckpoints` to provide the time taken to complete an update and the median time to update a single session host in minutes in last 30 days:

```kusto
let timeRange                               = ago(30d);
let succeededStatus                         = "Succeeded";
let hostPoolUpdateCompletedCheckpoint       = "HostPoolUpdateCompleted";
let sessionHostUpdateCompletedCheckpoint    = "SessionHostUpdateCompleted";
let provisioningTypeUpdate                  = "Update";
WVDSessionHostManagement
| where ProvisioningStatus == succeededStatus and TimeGenerated >= timeRange and ProvisioningType == provisioningTypeUpdate
| join kind = inner (
      // Get number of session hosts updated
    WVDCheckpoints
    | where Name == hostPoolUpdateCompletedCheckpoint
    | extend ParametersParsed = parse_json(Parameters)
    | extend SessionHostUpdateCount = ParametersParsed["SessionHostsUpdateCompleted"], UpdateCompletionTime = todatetime(ParametersParsed["TimeCompleted"]), UpdateStartTime = todatetime(ParametersParsed["TimeStarted"])
    | project CorrelationId, SessionHostUpdateCount, UpdateStartTime, UpdateCompletionTime
) on CorrelationId
| join kind = inner
(
      // Get time to update individual session hosts
    WVDCheckpoints
    | where Name == sessionHostUpdateCompletedCheckpoint
    | extend ParametersParsed = parse_json(Parameters)
    | extend SessionHostUpdateTime = todecimal(ParametersParsed["TimeTakenToUpdateSessionHostInSeconds"])
    // Calculate median time to update session host
    | summarize SessionHostMedianUpdateTime = percentile(SessionHostUpdateTime, 50) by CorrelationId
) on CorrelationId
| project TimeGenerated, _SubscriptionId, _ResourceId, CorrelationId, UpdateStartDateTime = UpdateStartTime, UpdateEndDateTime = UpdateCompletionTime, ['UpdateDuration [InMinutes]'] = datetime_diff('minute', UpdateCompletionTime, UpdateStartTime), SessionHostUpdateCount, ['MedianSessionHostUpdateTime [InMinutes]'] = toint(SessionHostMedianUpdateTime/(60 * 1.0)), UpdateBatchSize = UpdateMaxVmsRemoved, FromSessionHostConfigVer, ToSessionHostConfigVer, UpdateDeleteOriginalVm
```

The dataset returned is as follows:

| Column | Definition |
|--|--|
| TimeGenerated | System generated event timestamp |
| _SubscriptionId | Subscription ID of a host pool |
| _ResourceId | Resource ID of a host pool |
| CorrelationId | Unique identifier assigned to every image update performed on a host pool |
| UpdateStartDateTime | Session host update start timestamp in UTC |
| UpdateEndDateTime | Session host update completion timestamp in UTC |
| UpdateDuration | Time taken to complete to update the image of all session hosts in a host pool in minutes |
| SessionHostUpdateCount | Number of session hosts updated |
| MedianSessionHostUpdateTime | Median time to update the image of a single session host in minutes |
| UpdateBatchSize | Number of session hosts that were in a single batch during an update of the image |
| FromSessionHostConfigVer | Session host configuration before an update of the image |
| ToSessionHostConfigVer | Session host configuration after an update of the image |
| UpdateDeleteOriginalVm | Whether the original virtual machine was preserved after the completion of an update of the image |

## Errors during a session host update

This query correlates the tables `WVDSessionHostManagement` and `WVDErrors` to provide information you can use to troubleshoot errors during session host updates in the last 30 days:

```kusto
let timeRange               = ago(30d);
let provisioningTypeUpdate  = "Update";
WVDSessionHostManagement
| where ProvisioningStatus  in ("Failed", "Error", "Canceled") and TimeGenerated >= timeRange and ProvisioningType == provisioningTypeUpdate
| summarize arg_max(TimeGenerated, _ResourceId, _SubscriptionId, FromSessionHostConfigVer, ToSessionHostConfigVer) by CorrelationId
| join kind = inner 
(
      // Get image update errors
    WVDErrors
    | where TimeGenerated >= timeRange
    | extend IsSessionHostResourceIdAvailable = iif(Message startswith "SessionHostResourceId", 1, 0)
    | extend startIndex = iif(IsSessionHostResourceIdAvailable == 1, indexof(Message, ":") + 1, 0)
    | extend length = iif(IsSessionHostResourceIdAvailable == 1, indexof(Message, ";") - startIndex, 0)
    // Get Session host ResourceId when available
    | extend SessionHostResourceId = iif(IsSessionHostResourceIdAvailable == 1, substring(Message, startIndex, length), "")
    | project TimeGenerated, CorrelationId, SessionHostResourceId, CodeSymbolic, Message
) on CorrelationId
| project TimeGenerated, _SubscriptionId, _ResourceId, CorrelationId, CodeSymbolic, SessionHostResourceId, Message, FromSessionHostConfigVer, ToSessionHostConfigVer

```

The dataset returned is as follows:

| Column | Definition |
|--|--|
| TimeGenerated | System generated event timestamp |
| _SubscriptionId | Subscription ID of a host pool |
| _ResourceId | Resource ID of a host pool |
| CorrelationId | Unique identifier assigned to every image update performed on a host pool |
| CodeSymbolic | Error code |
| SessionHostResourceId | Resource ID of a session host, if applicable |
| Message | Error information |
| FromSessionHostConfigVer | Session host configuration version before an image update |
| ToSessionHostConfigVer | Session host configuration version to which session hosts were updated where the update process failed |

## Session host updates canceled by an administrator before the scheduled time

This query correlates the tables `WVDSessionHostManagement` and `WVDCheckpoints` to provide session host updates that were scheduled, but then canceled by an administrator before they started, in the last 30 days:

```kusto
let timeRange                           = ago(30d);
let canceledStatus                      = "Canceled";
let scheduledStatus                     = "Scheduled";
let hostPoolUpdateCanceledCheckpoint    = "HostPoolUpdateCanceled";
let provisioningTypeUpdate              = "Update";
WVDSessionHostManagement
| where ProvisioningStatus == canceledStatus and TimeGenerated >= timeRange and ProvisioningType == provisioningTypeUpdate
| join kind = inner
(
    WVDCheckpoints
    | where Name == "HostPoolUpdateCanceled"
    | project TimeGenerated, CorrelationId, Name, Parameters
    | extend ParametersParsed = parse_json(Parameters)
    | extend StateFrom = tostring(ParametersParsed["StateFrom"]), StateTo = tostring(ParametersParsed["StateTo"]), CanceledTime = todatetime(ParametersParsed["TimeCanceled"])
    | where StateFrom == scheduledStatus and StateTo == canceledStatus
) on CorrelationId
| project TimeGenerated, _SubscriptionId, _ResourceId, CorrelationId, ScheduledDateTime = todatetime(ScheduledDateTime), CanceledDateTime = CanceledTime, UpdateBatchSize = UpdateMaxVmsRemoved
```

The dataset returned is as follows:

| Column | Definition |
|--|--|
| TimeGenerated | System generated event timestamp |
| _SubscriptionId | Subscription ID of a host pool |
| _ResourceId | Resource ID of a host pool |
| CorrelationId | Unique identifier assigned to every update of the image of a host pool |
| ScheduledDateTime | Session host update scheduled time in UTC |
| CanceledDateTime | Time in UTC when an update of the image was canceled by an administrator |
| UpdateBatchSize | Number of session hosts that were in a single batch during an update of the image |

## Session host updates that were in progress or failed, then later canceled by an administrator

This query correlates the tables `WVDSessionHostManagement` and `WVDCheckpoints` to provide session host updates that were in progress or failed, then later canceled by an administrator in the last 30 days:

```kusto
let timeRange                           = ago(30d);
let canceledStatus                      = "Canceled";
let scheduledStatus                     = "Scheduled";
let hostPoolUpdateCanceledCheckpoint    = "HostPoolUpdateCanceled";
let provisioningTypeUpdate              = "Update";
WVDSessionHostManagement
| where ProvisioningStatus == canceledStatus and TimeGenerated >= timeRange and ProvisioningType == provisioningTypeUpdate
| join kind = inner
(
    WVDCheckpoints
    | where Name == hostPoolUpdateCanceledCheckpoint
    | project TimeGenerated, CorrelationId, Name, Parameters
    | extend ParametersParsed = parse_json(Parameters)
    | extend StateFrom = tostring(ParametersParsed["StateFrom"]), StateTo = tostring(ParametersParsed["StateTo"]), CanceledTime = todatetime(ParametersParsed["TimeCanceled"]), TotalSessionHostsInHostPool = toint(ParametersParsed["TotalSessionHostsInHostPool"]), SessionHostUpdateCount = ParametersParsed["SessionHostsUpdateCompleted"]
    | where StateFrom != scheduledStatus and StateTo == canceledStatus
) on CorrelationId
| project TimeGenerated, _SubscriptionId, _ResourceId, CorrelationId, ScheduledDateTime = todatetime(ScheduledDateTime), CanceledDateTime = CanceledTime, TotalSessionHostsInHostPool, SessionHostUpdateCount, UpdateBatchSize = UpdateMaxVmsRemoved
```

The dataset returned is as follows:

| Column | Definition |
|--|--|
| TimeGenerated | System generated event timestamp |
| _SubscriptionId | Subscription ID of a host pool |
| _ResourceId | Resource ID of a host pool |
| CorrelationId | Unique identifier assigned to every update of the session host of a host pool |
| ScheduledDateTime | Session host update scheduled time in UTC |
| CanceledDateTime | Time in UTC when an administrator canceled an update of the session host |
| TotalSessionHostsInHostPool | Total number of session hosts in a host pool |
| SessionHostUpdateCount | Number of session hosts that were updated before canceling a session host update |
| UpdateBatchSize | Number of session hosts in a single batch during an update of the session host |

## Status of every session host update

This query correlates the tables `WVDSessionHostManagement` and `WVDCheckpoints` to provide the latest status of every session host update in the last 30 days:

```kusto
let timeRange                               = ago(30d);
let sessionHostUpdateCompletedCheckpoint    = "SessionHostUpdateCompleted";
let provisioningTypeUpdate                  = "Update";
WVDSessionHostManagement
| where TimeGenerated >= timeRange and ProvisioningType == provisioningTypeUpdate
| join kind = leftouter (
      // Get number of session hosts updated if available
    WVDCheckpoints
    | where Name == sessionHostUpdateCompletedCheckpoint
    | summarize SessionHostUpdateCount = count() by CorrelationId
) on CorrelationId
| summarize arg_max(TimeGenerated, _SubscriptionId, _ResourceId, ScheduledDateTime, UpdateMaxVmsRemoved, SessionHostUpdateCount, ProvisioningStatus) by CorrelationId
| project TimeGenerated, _SubscriptionId, _ResourceId, CorrelationId, ProvisioningStatus, ScheduledDateTime = todatetime(ScheduledDateTime), UpdateBatchSize = UpdateMaxVmsRemoved, SessionHostUpdateCount = iif(isempty(SessionHostUpdateCount), 0, SessionHostUpdateCount)
```

The dataset returned is as follows:

| Column | Definition |
|--|--|
| TimeGenerated | System generated event timestamp |
| _SubscriptionId | Subscription ID for a host pool |
| _ResourceId | Resource ID of a host pool |
| CorrelationId | Unique identifier assigned to every update of the image of a host pool |
| ProvisioningStatus | Current status of an update of the image of a host pool |
| ScheduledDateTime | Session host update scheduled time in UTC |
| UpdateBatchSize | Number of session hosts in a single batch during an update of the image |
| SessionHostUpdateCount | Number of session hosts that were updated |

## Next steps

For troubleshooting guidance for session host update, see [Troubleshoot session host update](troubleshoot-session-host-update.md).
