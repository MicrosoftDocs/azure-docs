---
title: Tutorial: Tutorial - Add ingestion-time transformation to Azure Monitor Logs
description: This article describes how to add a custom transformation to data flowing through Azure Monitor Logs using table management features of Log Analytics workspace.
ms.subservice: logs
ms.topic: tutorial
author: bwren
ms.author: bwren
ms.date: 01/19/2022
---

# Tutorial: Add ingestion-time transformation to Azure Monitor Logs
[Ingestion-time transformations](ingestion-time-transformations.md) allow you to manipulate incoming data before it's stored in a Log Analytics workspace. You can add data filtering, parsing and extraction and control the structure of the data that gets ingested. 

In this tutorial, you learn to:

> [!div class="checklist"]
> * Configure [ingestion-time transformation](ingestion-time-transformations.md) for a table in Azure Monitor Logs
> * Write a log query for an ingestion-time transform


## Prerequisites
To complete this tutorial, you need the following: 

- Log Analytics workspace where you have at least contributor rights. 
- Permissions to create Data Collection Rule objects.


## Overview of tutorial
The [LAQueryLogs table](https://docs.microsoft.com/azure/azure-monitor/logs/query-audit#audit-data) is created when you enable [log query auditing](query-audit.md) in a workspace. In this tutorial, we'll add a column to the `LAQueryLogs` table and reduce its storage requirement table by filtering out certain records and removing the contents of a column. You can use this same basic process for any [supported table](ingestion-time-transformations-supported-tables.md) in a Log Analytics workspace.  

This tutorial will use the Azure portal which provides a wizard to walk you through the process of creating an ingestion-time transformation. The following actions are performed when you complete this wizard:

- Updates the table schema with any additional columns from the query
- Creates a `WorkspaceTransforms` data collection rule (DCR) and links it to the workspace if a default DCR isn't already linked to the workspace
- Creats an ingestion-time transformation and adds it to the DCR


## Enable query audit logs
You need to enable [query auditing](query-audit.md) for your workspace to create the `LAQueryLogs` table that we'll be working with. This is not required for ingestion time transformations. It's just to generate the sample data that we'll be working with. 

From the **Log Analytics workspaces** menu in the Azure portal, select **Diagnostic settings** and then **Add diagnostic setting**.

:::image type="content" source="media/tutorial-ingestion-time-transformations/diagnostic-settings.png" lightbox="media/tutorial-ingestion-time-transformations/diagnostic-settings.png" alt-text="Screenshot of diagnostic settings":::

Provide a name for the diagnostic setting and select the workspace so that the auditing data is stored in the same workspace. Select the **Audit** category and  then click **Save** to save the diagnostic setting and close the diagnostic setting page.

:::image type="content" source="media/tutorial-ingestion-time-transformations/new-diagnostic-setting.png" lightbox="media/tutorial-ingestion-time-transformations/new-diagnostic-settings.png" alt-text="Screenshot of new diagnostic setting":::

Select **Logs** and then run some queries to populate `LAQuery Logs` with some data. These queries don't need to return data to be added to the audit log.

:::image type="content" source="media/tutorial-ingestion-time-transformations/sample-queries.png" lightbox="media/tutorial-ingestion-time-transformations/sample-queries.png" alt-text="Screenshot of sample log queries":::

## Add ingestion-time transformation to the table
The '`LAQueryLogs` table should now exist in your workspace, so you can create a transformation for it. Select **Tables (preview)** and then locate the `LAQueryLogs` table and select **Create transformation**.

:::image type="content" source="media/tutorial-ingestion-time-transformations/create-transformation.png" lightbox="media/tutorial-ingestion-time-transformations/create-transformation.png" alt-text="Screenshot of creating a new transformation":::


Since this is the first transformation in the workspace, you need to add a new data collection rule (DCR). If you create other transformations, you can store them in this same DCR. Click **Create a new data collection rule**. The **Subscription** and **Resource group** will already be populated for the workspace. Provide a name for the DCR and click **Done**.

:::image type="content" source="media/tutorial-ingestion-time-transformations/new-data-collection-rule.png" lightbox="media/tutorial-ingestion-time-transformations/new-data-collection-rule.png" alt-text="Screenshot of creating a new data collection rule":::

Click **Next** to view sample data from the table. As you define the transformation, the result will be applied to the sample data allowing you to evaluate the results before applying it to actual data. Click **Transformation editor** to define the transformation.

:::image type="content" source="media/tutorial-ingestion-time-transformations/sample-data.png" lightbox="media/tutorial-ingestion-time-transformations/sample-data.png" alt-text="Screenshot of sample data from the log table":::

In the transformation editor, you can see the transformation that will be applied to the data prior to its ingestion into the table. The incoming data is represented by a virtual table named `source`, which has the same set of columns as the destination table itself. The transformation initially contains a simple query returning the `source` table with no changes. The transformation just passes through the data from the input stream to the destination table.

You're going to modify this transformation to perform the following:

- Drop rows related to querying the `LAQueryLogs` table itself to save space since these log entries aren't useful.
- Add a column for the name of the workspace that was queried.
- Remove data from the `RequestContext` column to save space.

The following query will provide these results. 

``` kusto
source
| where QueryText !contains 'LAQueryLogs'
| extend Context = parse_json(RequestContext)
| extend Workspace_CF = tostring(Context['workspaces'][0])
| project-away RequestContext, Context
```

> [!NOTE]
> The output of the transformation will initiate changes to the table schema. Columns will be added to match the transformation output if they don't already exist. Make sure that your output doesn't contain any additional columns that you don't want added to the table. If the output does not include columns that are already in the table, those columns will not be removed, but data will not be added.

Copy the query into the transformation editor and click **Run** to view results from the sample data. You can verify that the new `Workspace_CF` column is in the query.

:::image type="content" source="media/transformation-editor/sample-data.png" lightbox="media/transformation-editor/sample-data.png" alt-text="Screenshot of transformation editor":::

Click **Apply** to save the transformation and then **Next** to review the configuration. Click **Create** to update the data collection rule with the new transformation.

:::image type="content" source="media/transformation-editor/save-transformation.png" lightbox="media/transformation-editor/save-transformation.png" alt-text="Screenshot of saving transformation":::

## Test transformation
Allow about 30 minutes for the transformation to take effect, and you can then test it by running a query against the table. Only data sent to the table after the transformation was applied will be affected. 

Run some sample queries to send data to the `LAQueryLogs` table. These can't include queries for `LAQueryLogs` itself since the transformation is filtering these records.

Notice that the output has the new `Workspace_CF` column, and there are no records for `LAQueryLogs`.