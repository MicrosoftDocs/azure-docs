---
title: Migrate from Data Collector API and custom fields-enabled tables to DCR-based custom log collection
description: Steps that you must perform when migrating from Data Collector API and custom fields-enabled tables to DCR-based custom log collection.
ms.topic: conceptual
ms.date: 01/06/2022

---

# Migrate from Data Collector API and custom fields-enabled tables to DCR-based custom log collection
This article describes how to migrate from [Data Collector API](data-collector-api.md) or [custom fields](custom-fields.md) in Azure Monitor to [DCR-based custom log collection](../essentials/data-collection-rule-overview.md). It includes configuration required for custom tables created in your Log Analytics workspace so that they can be used by [Logs ingestion API](logs-ingestion-api-overview.md) and [workspace transformations](../essentials/data-collection-transformations.md#workspace-transformation-dcr).

> [!IMPORTANT]
> You do not need to follow this article if you are configuring your DCR-based custom logs [using the Azure Portal](tutorial-workspace-transformations-portal.md) since the configuration will be performed for you. This article only applies if you're configuring using Resource Manager templates APIs.

## Background
To use a table with the [Logs ingestion API](logs-ingestion-api-overview.md) or with a [workspace transformation](../essentials/data-collection-transformations.md#workspace-transformation-dcr), it must be configured to support new features. When you complete the process described in this article, the following actions are taken:

- The table is reconfigured to enable all DCR-based custom logs features. This includes DCR and DCE support and management with the new **Tables** control plane.
- Any previously defined custom fields will stop populating.
- The Data Collector API will continue to work but won't create any new columns. Data will only populate into any columns that was created prior to migration.
- The schema and historic data is preserved and can be accessed the same way it was previously.

## Applicable scenarios
This article is only applicable if all of the following criteria apply:  

- You're going to send data to the table using the [Logs ingestion API](logs-ingestion-api-overview.md) or configure a transformation for the table in the [workspace transformation DCR](../essentials/data-collection-transformations.md#workspace-transformation-dcr), preserving both schema and historical data in that table.
- The table was either created using the Data Collector API, or has custom fields defined in it. 
- You want to migrate using the APIs instead of the Azure portal as described in [Send custom logs to Azure Monitor Logs using the Azure portal](tutorial-logs-ingestion-portal.md) or [Add transformation in workspace data collection rule using the Azure portal](tutorial-workspace-transformations-portal.md).

If all of these conditions aren't true, then you can use DCR-based log collection without following the procedure described here.

## Migration procedure
If the table that you're targeting with DCR-based log collection fits the criteria above, then you must perform the following steps:

1. Configure your data collection rule (DCR) following procedures at [Send data to Azure Monitor using Logs ingestion API (Resource Manager templates)](tutorial-logs-ingestion-api.md) or [Add transformation in workspace data collection rule to Azure Monitor using Resource Manager templates](tutorial-workspace-transformations-api.md).

1. If using the Logs ingestion API, also [configure the data collection endpoint (DCE)](tutorial-logs-ingestion-api.md#create-data-collection-endpoint) and the agent or component that will be sending data to the API.

1. Issue the following API call against your table. This call is idempotent, so there will be no effect if the table has already been migrated. 

    ```rest
    POST https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/tables/{tableName}/migrate?api-version=2021-12-01-preview
    ```

1. Discontinue use of the Data Collector API and start using the new Logs ingestion API.

## Next steps

- [Walk through a tutorial sending custom logs using the Azure portal.](tutorial-logs-ingestion-portal.md)
- [Walk through a tutorial sending custom logs using Resource Manager templates and REST API.](tutorial-logs-ingestion-api.md)
