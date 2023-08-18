---
title: Migration of custom fields to KQL-based transformations in Azure Monitor
description: Learn how to migrate custom fields in a Log Analytics workspace in Azure Monitor with KQL-based custom columns using transformations. 
ms.service: azure-monitor
ms.topic: tutorial 
ms.date: 03/31/2023
---


# Tutorial: Replace custom fields in Log Analytics workspace with KQL-based custom columns

Custom fields is a feature of Azure Monitor that allows you to extract into a separate column data from a different text column of the same table. Creation of new custom fields will be disabled starting March 31st, 2023. Custom fields functionality will be deprecated and existing custom fields will stop functioning on March 31st, 2026.

There are several advantages to using DCR-based [ingestion-time transformations](../essentials/data-collection-transformations.md) to accomplish the same result:

- You can apply full set of [string functions](/azure/data-explorer/kusto/query/scalarfunctions#string-functions) to shape your custom columns.
- You can apply multiple operations to the same data. For example, extract a portion of a value to a separate column and remove the original column.
- You can use ingestion-time transformations in your ARM templates to deploy custom columns at scale.

With the introduction of [data collection rules (DCR)](../essentials/data-collection-rule-overview.md), KQL-based transformations are the standard method of table customization, replacing legacy custom fields.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Locate custom fields that require replacement
> * Understand the content of the custom fields
> * Setup ingestion-time transformation to replace custom fields within the table


## Prerequisites

- Log Analytics workspace with a table containing custom fields
- Sufficient account privilege to create and modify data collection rules  (DCR)



## Locate custom fields for replacement
Start by locating custom fields to replace. If you already know the custom fields  you plan to replace, proceed to the next step.

1. Navigate to the Log Analytics workspace where the table with custom fields is located.
2. In the side menu, select **Tables**. Select **Manage table** from the context menu for the table.

    :::image type="content" source="media/custom-fields-migrate/manage-table.png" alt-text="Screenshot showing the manage table option for a table in a Log Analytics workspace" lightbox="media/custom-fields-migrate/manage-table.png":::

1. Note if any data collection rules (DCRs) are associated with given table. 
   
    - If any DCRs are present in corresponding section, it means that any pre-existing custom fields were either already implemented within these DCRs, or abandoned upon DCR creation. You're going to examine the content of custom fields on the next step of this tutorial and determine whether more updates to DCRs needed.
    - If there are no data collection rules associated with the table, then all columns in given table with names ending with "_CF" will be custom fields subject to replacement.

    :::image type="content" source="media/custom-fields-migrate/manage-table-details.png" alt-text="Screenshot showing the properties of a table including data collection rules associated with the table" lightbox="media/custom-fields-migrate/manage-table-details.png":::

2. Close the table properties dialog and select **Edit schema** from the table context menu. Scroll to the bottom of page where custom columns are listed. These columns end with *_CF*.

    :::image type="content" source="media/custom-fields-migrate/custom-columns.png" alt-text="Screenshot showing the column listing for a table including any custom columns" lightbox="media/custom-fields-migrate/custom-columns.png":::

1. Note the names of these columns since you'll determine their content in the next step.

## Understand custom field content
Since there is no way to examine the custom field definition directly, you need to query the table to determine the custom field formula.

1. Select **Logs** in the side menu and run a query to get a sample of data from the table.

    :::image type="content" source="media/custom-fields-migrate/log-analytics-sample-data.png" alt-text="Screenshot of Log Analytics with query returning sample data" lightbox="media/custom-fields-migrate/log-analytics-sample-data.png":::

1. Locate the columns noted in the previous step and examine their content.
    - If the column *is not empty* and *there are DCRs* associated with the table, then custom field logic has been already implemented with transformation. No action is required
    - If the column *is empty* (or not present in query results) and *there are DCRs* associated with the table, the custom field logic was not implemented with the DCR. Add a transformation to the dataflow in the existing DCR.
    - If the column *is not empty* and *there are no DCRs* associated with the table, the custom field logic needs to implemented as a transformation in the [workspace DCR](../essentials/data-collection-transformations.md#workspace-transformation-dcr).

1. Examine the content of the custom field and determine the logic how it's being calculated. Custom fields usually calculate substrings of other columns in the same table. Determine which column the data comes from and the portion of the string it extracts.

## Create transformation
You're now ready to create the required KQL snippet and add it to a DCR. This logic is applied to each record as it's ingested into the workspace.

1. Modify the query for the table using KQL to replicate the custom field logic. If you have multiple custom fields to replace, you may combine their calculation logic into a single statement.

    - Use [parse](/azure/data-explorer/kusto/query/parseoperator) operator for pattern-based search of a substring within a string.
    - Use [extract()](/azure/data-explorer/kusto/query/extractfunction) function for regex-based substring search.
    - String functions as [split()](/azure/data-explorer/kusto/query/splitfunction), [substring()](/azure/data-explorer/kusto/query/substringfunction) and [many others](/azure/data-explorer/kusto/query/scalarfunctions#string-functions) may also be useful.

    :::image type="content" source="media/custom-fields-migrate/log-analytics-transformation-query.png" alt-text="Screenshot of Log Analytics with query returning data using transformation query" lightbox="media/custom-fields-migrate/log-analytics-transformation-query.png":::

2. Determine where your new KQL definition of the custom column needs to be placed.
 
    - For logs collected using [Azure Monitor Agent (AMA)](../agents/agents-overview.md), [edit the DCR](../essentials/data-collection-rule-edit.md) collecting data for the table, adding a transformation. For an example, see [Samples](../essentials/data-collection-transformations.md#samples). The transformation query is defined in the `transformKql` element.
    - For resource logs collected with [diagnostic settings](../essentials/diagnostic-settings.md), add the transformation to the [workspace default DCR](../essentials/data-collection-transformations.md#workspace-transformation-dcr). The table must [support transformations](../logs/tables-feature-support.md).



## Frequently Asked Questions

### How do I migrate  custom fields for a text log collected with legacy Log Analytics agent (MMA)?

Consider migrating to Azure Monitor Agent (AMA). Log Analytics agent is approaching its end of support, and you should migrate to Azure Monitor Agent (AMA). [Text logs collected with AMA](../agents/data-collection-text-log.md) use log parsing logic defined in form of KQL transformations from the start. Custom fields are not required and not supported in text logs collected by Azure Monitor Agent.

### Is migration of custom fields to KQL mandatory?

No. You need to migrate your custom fields only if you still want your custom columns populated. If you don't migrate your custom fields, corresponding columns will stop being populated when support of custom fields is ended. Data that has been already processed and stored in the table will not be affected and will remain usable.

### Will I lose my existing data in corresponding columns if I don't migrate my custom fields in time?

No. Custom fields are calculated at the time of data ingestion. Deleting the field definition or not migrating them in time will not affect any data previously ingested.

## Next steps

- [Read more about transformations in Azure Monitor.](../essentials/data-collection-transformations.md)

