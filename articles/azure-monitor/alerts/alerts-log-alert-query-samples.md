---
title: Samples of Azure Monitor log alert rule queries
description: See examples of Azure monitor log alert rule queries.
ms.topic: reference
ms.date: 01/01/2024
author: AbbyMSFT
ms.author: abbyweisberg
ms.reviewer: nolavime
---

# Sample log alert rule queries

You can use Azure Data Explorer and Azure Resource Graph in log alert rule queries.

## Query using an ARG Resources table

This query finds virtual machines that are marked as critical and that had a heartbeat more than 24 hours ago, but haven't had a heartbeat in the last 2 minutes.

```json
{
   "arg("").Resources 
   | where type == "microsoft.compute/virtualmachines" 
   | where tags.BusinessCriticality =~ 'critical' and subscriptionId == ‘XXX-XXX-XXX-XXX' 
   | join kind=leftouter ( 
   Heartbeat 
   | where TimeGenerated > ago(24h) 
   ) 
    on $left.name == $right.Resource 
    | summarize LastCall = max(case(isnull(TimeGenerated), make_datetime(1970, 1, 1), TimeGenerated)) by name, id 
    | extend SystemDown = case(LastCall < ago(2m), 1, 0) 
    | where SystemDown == 1"
}
```

## Query using an ARG tags table

This query filters virtual machines based on tags that marks virtual machines if they need to be monitored. 

```json
{
   "let RuleGroupTags = dynamic([‘Linux’]); 
   Perf | where ObjectName == 'Processor' and CounterName == '% Idle Time' and (InstanceName == '_Total' or InstanceName == 'total')  
   | extend CpuUtilisation = (100 - CounterValue)    
   | join kind=inner hint.remote=left (arg("").Resources 
   | where type =~ 'Microsoft.Compute/virtualMachines' 
   | project _ResourceId=tolower(id), tags) on _ResourceId
   | project-away _ResourceId1  
   | where (isnull(tags.monitored) or tolower(tostring(tags.monitored)) != 'false') and (tostring(tags.monitorRuleGroup) in (RuleGroupTags) or isnull(tags.monitorRuleGroup) or tostring(tags.monitorRuleGroup) == '')"
}
```

## Query using an ARG certificates table

This query finds resources with certificates that are going to expire within 30 days.

```json
{
    "arg("").Resources 
    | where type == "microsoft.web/certificates" 
    | extend ExpirationDate = todatetime(properties.expirationDate) 
    | project ExpirationDate, name, resourceGroup, properties.expirationDate 
    | where ExpirationDate < now() + 30d 
    | order by ExpirationDate asc"
}
```

## Query using a join between an ARG table and a Log Analytics table

This query finds virtual machines that are marked as critical and that had a heartbeat more than 24 hours ago, but haven't had a heartbeat in the last 2 minutes.

```json
{
    "arg("").Resources 
    | where type == "microsoft.compute/virtualmachines" 
    | where tags.BusinessCriticality =~ 'critical' and subscriptionId == ‘XXXX-XXXX-XXXX-XXXX’ 
    | join kind=leftouter ( 
    Heartbeat 
    | where TimeGenerated > ago(2m) 
    | summarize LastCall = max(TimeGenerated) by Resource 
    ) on $left.name == $right.Resource 
    | extend SystemDown = case(isempty(LastCall), 1, 0) 
    | where SystemDown == 1"
    }
```

## Next steps
- [Learn more about creating a log alert rule](./alerts-create-log-alert-rule.md)
- [Learn how to optimize log alert queries](./alerts-log-query.md)
