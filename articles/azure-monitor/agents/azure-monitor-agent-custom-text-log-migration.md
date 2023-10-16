---
title: Migrate from custom text log version 1 to DCR agent custom text logs.
description: Steps that you must perform when migrating from custom text log v1 to DCR based AMA custom text logs.
ms.topic: conceptual
ms.date: 05/09/2023
---

# Migrate from MMA custom text log to AMA DCR based custom text logs
This article describes the steps to migrate a [MMA Custom text log](data-sources-custom-logs.md) table so you can use it as a destination for a new [AMA custom text logs](data-collection-text-log.md) DCR. When you follow the steps, you won't lose any data. If you're creating a new AMA custom text log table, then this article doesn't pertain to you.
  
## Background
MMA custom text logs must be configured to support new features in order for AMA custom text log DCRs to write to it. The following actions are taken:
- The table is reconfigured to enable all DCR-based custom logs features.
- All MMA custom fields stop updating in the table. AMA can write data to any column in the table. 
- The MMS Custom text log can write to noncustom fields, but it will not be able to create new columns. The portal table management UI can be used to change the schema after migration.

## Migration procedure
You should follow the steps only if the following criteria are true:  
- You created the original table using the Custom Log Wizard.
- You're going to preserve the existing data in the table.
- You're going to write new data using and [AMA custom text log DCR](data-collection-text-log.md) and possibly configure an [ingestion time transformation](azure-monitor-agent-transformation.md).

1. Configure your data collection rule (DCR) following procedures at [collect text logs with Azure Monitor Agent](data-collection-text-log.md) 
2. Issue the following API call against your existing custom logs table to enable ingestion from Data Collection Rule and manage your table from the portal UI. This call is idempotent and future calls have no effect. Migration is one-way, you can't migrate the table back to MMA. 

```rest

POST
https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/tables/{tableName}/migrate?api-version=2021-12-01-preview
```
3. Discontinue MMA custom text log collection and start using the AMA custom text log. MMA and AMA can both write to the table as you migrate your agents from MMA to AMA.

## Next steps
- [Walk through a tutorial sending custom logs using the Azure portal.](data-collection-text-log.md)
- [Create an ingestion time transform for your custom text data](azure-monitor-agent-transformation.md)
