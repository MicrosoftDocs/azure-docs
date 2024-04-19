---
title: Azure Resource Graph alerts sample queries
description: Sample queries that can be used to create alerts for your Azure resources using an Azure Resource Graph query and a Log Analytics workspace.
ms.date: 03/20/2024
ms.topic: sample
---

# Azure Resource Graph alerts sample queries

This article includes sample queries that can be used to create alerts for Azure resources using Azure Resource Graph and a Log Analytics workspace. The samples must be run from a Log Analytics workspace.

For more information about alert queries, go to [Quickstart: Create alerts with Azure Resource Graph and Log Analytics](../alerts-query-quickstart.md).

> [!NOTE]
> Azure Resource Graph alerts integration with Log Analytics is in public preview.

## Verify virtual machines health

This query finds virtual machines marked as critical that had a heartbeat more than 24 hours ago, but with no heartbeat in the last two minutes. Replace `11111111-1111-1111-1111-111111111111` with your Azure subscription ID.

```kusto
arg("").Resources
| where type == "microsoft.compute/virtualmachines"
| where tags.BusinessCriticality =~ 'critical' and subscriptionId == '11111111-1111-1111-1111-111111111111'
| join kind=leftouter (
    Heartbeat
    | where TimeGenerated > ago(24h)
    )
    on $left.name == $right.Resource
| summarize LastCall = max(case(isnull(TimeGenerated), make_datetime(1970, 1, 1), TimeGenerated)) by name, id
| extend SystemDown = case(LastCall < ago(2m), 1, 0)
| where SystemDown == 1
```

## Filter virtual machines to monitor

This query filters virtual machines that need to be monitored.

```kusto
let RuleGroupTags = dynamic(['Linux']);
Perf | where ObjectName == 'Processor' and CounterName == '% Idle Time' and (InstanceName in ('Total','total'))
| extend CpuUtilisation = (100 - CounterValue)   
| join kind=inner hint.remote=left (arg("").Resources
    | where type =~ 'Microsoft.Compute/virtualMachines'
    | project _ResourceId=tolower(id), tags
    )
    on _ResourceId
| project-away _ResourceId1
| where  (tostring(tags.monitorRuleGroup) in (RuleGroupTags))
```

## Find resources with certificates

This query finds resources with certificates that expire within 30 days.

```kusto
arg("").Resources
| where type == "microsoft.web/certificates"
| extend ExpirationDate = todatetime(properties.expirationDate)
| project ExpirationDate, name, resourceGroup, properties.expirationDate
| where ExpirationDate < now() + 30d
| order by ExpirationDate asc
```

## Alerts when new resource created in subscription

This query alerts when a new resource is created in an Azure subscription.

```kusto
arg("").resourcechanges
| extend changeTime = todatetime(properties.changeAttributes.timestamp),
    changeType = tostring(properties.changeType),targetResourceType = tostring(properties.targetResourceType),
    changedBy = tostring(properties.changeAttributes.changedBy)
| where changeType == "Create" and changeTime <ago(1h)
| project changeTime, targetResourceType, changedBy
```

## Next steps

For more information about the query language or how to explore resources, go to the following articles.

- [Understanding the Azure Resource Graph query language](../concepts/query-language.md)
- [Explore your Azure resources with Resource Graph](../concepts/explore-resources.md)
