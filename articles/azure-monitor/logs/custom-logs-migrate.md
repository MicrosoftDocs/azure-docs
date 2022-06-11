---
title: Migrate from Data Collector API and custom fields-enabled tables to DCR-based custom logs
description: Steps that you must perform when migrating from Data Collector API and custom fields-enabled tables to DCR-based custom logs.
ms.topic: conceptual
ms.date: 01/06/2022

---

# Migrate from Data Collector API and custom fields-enabled tables to DCR-based custom logs
This article describes how to migrate from [Data Collector API](data-collector-api.md) or [custom fields](custom-fields.md) in Azure Monitor to [DCR-based custom logs](custom-logs-overview.md). It includes configuration required for tables in your Log Analytics workspace and applies to both [direct ingestion](custom-logs-overview.md) and [ingestion-time transformations](ingestion-time-transformations.md).

> [!IMPORTANT]
> You do not need to follow this article if you are defining your DCR-based custom logs using the Azure Portal. This article only applies if you are using Resource Manager templates and the custom logs API.

## Background
To use a table with the [direct ingestion](custom-logs-overview.md), and [ingestion-time transformations](ingestion-time-transformations.md), it must be configured to support these new features. When you complete the process described in this article, the following actions are taken:

- The table will be reconfigured to enable all DCR-based custom logs features. This includes DCR and DCE support and management with the new Tables control plane.
- Any previously defined custom fields will stop populating.
- The Data Collector API will continue to work but won't create any new columns. Data will only populate into any columns that was created prior to migration.
- The schema and historic data is preserved and can be accessed the same way it was previously.

## Applicable scenarios
This article is only applicable if all of the following criteria apply:  

- You need to use the DCR-based custom logs functionality to send data to an existing table, preserving both schema and historical data in that table.
- The table in question was either created using the Data Collector API, or has custom fields defined in it  
- You want to migrate using the custom logs API instead of the Azure portal.

If all of these conditions aren't true, then you can use DCR-based custom logs without following the procedure described here.

## Migration procedure
If the table that you're targeting with DCR-based custom logs does indeed falls under the criteria described above, the following strategy is required for a graceful migration:

1. Configure your data collection rule (DCR) following procedures at [Send custom logs to Azure Monitor Logs using Resource Manager templates (preview)](tutorial-custom-logs-api.md) or [Add ingestion-time transformation to Azure Monitor Logs using Resource Manager templates (preview)](tutorial-ingestion-time-transformations-api.md).

1. If using the DCR-based API, also [configure the data collection endpoint (DCE)](tutorial-custom-logs-api.md#create-data-collection-endpoint) and the agent or component that will be sending data to the API.

1. Issue the following API call against your table. This call is idempotent, so there will be no effect if the table has already been migrated. 

    ```rest
    POST /subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/microsoft.operationalinsights/workspaces/{workspaceName}/tables/{tableName}/migrate?api-version=2021-03-01-privatepreview
    ```

1. Discontinue use of the Data Collector API and start using the new custom logs API.

## Next steps

- [Walk through a tutorial sending custom logs using the Azure portal.](tutorial-custom-logs.md)
- [Walk through a tutorial sending custom logs using Resource Manager templates and REST API.](tutorial-custom-logs-api.md)