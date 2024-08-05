---
title: Migrate from custom text log version 1 to DCR agent custom text logs.
description: Steps that you must perform when migrating from custom text log v1 to DCR based AMA custom text logs.
ms.topic: conceptual
ms.date: 05/09/2023
---

# Migrate from MMA custom text table to AMA DCR based custom text table
This article describes the steps to migrate a [MMA Custom text log](data-sources-custom-logs.md) table so you can use it as a destination for a new [AMA custom text logs](data-collection-log-text.md) DCR. If you're creating a new AMA custom text table, then this article doesn't pertain to you.


> [!Warning]
> Your MMA agents won't be able to write to existing custom tables after migration. If your AMA agent writes to an existing custom table, it is implicitly migrated.


## Background
You must configure MMA custom text logs to support new DCR features that allow AMA agents to write to it. Take the following actions:
- Your table is reconfigured to enable all DCR-based custom logs features.
- Your AMA agents can write data to any column in the table. 
- Your MMA Custom text log will lose the ability to write to the custom log.
To continue to write you custom data from both MMA and AMA each must have its own custom table. Your data queries in LA that process your data must join the two tables until the migration is complete at which point you can remove the join. 
  
## Migration
You should follow the steps only if the following criteria are true:  
- You created the original table using the Custom Log Wizard.
- You're going to preserve the existing data in the table.
- You do not need MMA agents to send data to the existing table
- You're going to exclusively write new data using and [AMA custom text log DCR](data-collection-log-text.md) and possibly configure an [ingestion time transformation](azure-monitor-agent-transformation.md).

## Procedure
1. Configure your data collection rule (DCR) following procedures at [collect text logs with Azure Monitor Agent](data-collection-log-text.md) 
2. Issue the following API call against your existing custom logs table to enable ingestion from Data Collection Rule and manage your table from the portal UI. This call is idempotent and future calls have no effect. Migration is one-way, you can't migrate the table back to MMA. 

```rest
POST
https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/tables/{tableName}/migrate?api-version=2021-12-01-preview
```
3. Discontinue MMA custom text log collection and start using the AMA custom text log. MMA and AMA can both write to the table as you migrate your agents from MMA to AMA.

## Next steps
- [Walk through a tutorial sending custom logs using the Azure portal.](data-collection-log-text.md)
- [Create an ingestion time transform for your custom text data](azure-monitor-agent-transformation.md)
