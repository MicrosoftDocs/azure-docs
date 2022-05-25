---
title: Tutorial - Add ingestion-time transformation to Azure Monitor Logs using Azure portal
description: This article describes how to add a custom transformation to data flowing through Azure Monitor Logs using the Azure portal.
ms.topic: tutorial
ms.date: 02/20/2022
---

# Add ingestion-time transformation to Azure Monitor Logs using the Azure portal (preview)
[Ingestion-time transformations](ingestion-time-transformations.md) allow you to manipulate incoming data before it's stored in a Log Analytics workspace. You can add data filtering, parsing and extraction, and control the structure of the data that gets ingested. This tutorial walks you through configuration of a sample ingestion time transformation using the Azure portal.

[!INCLUDE [Sign up for preview](../../../includes/azure-monitor-custom-logs-signup.md)]

> [!NOTE]
> This tutorial uses the Azure portal to configure an ingestion-time transformation. See [Tutorial: Add ingestion-time transformation to Azure Monitor Logs using resource manager templates (preview)](tutorial-ingestion-time-transformations-api.md) for the same tutorial using resource manager templates and REST API.

In this tutorial, you learn to:

> [!div class="checklist"]
> * Configure [ingestion-time transformation](ingestion-time-transformations.md) for a table in Azure Monitor Logs
> * Write a log query for an ingestion-time transform


## Prerequisites
To complete this tutorial, you need the following: 

- A Log Analytics workspace where you have at least [contributor rights](manage-access.md#manage-access-using-azure-permissions).
- A [supported Azure table](../logs/tables-feature-support.md) in the workspace.
    
    To configure this table for ingestion-time transformations, the table must already have some data.
    
    The table can't be linked to the workspace’s default DCR.
  
- [Permissions to create Data Collection Rule objects](../essentials/data-collection-rule-overview.md#permissions) in the workspace. 


## Overview of tutorial
In this tutorial, you'll reduce the storage requirement for the `LAQueryLogs` table by filtering out certain records. You'll also remove the contents of a column while parsing the column data to store a piece of data in a custom column. The [LAQueryLogs table](query-audit.md#audit-data) is created when you enable [log query auditing](query-audit.md) in a workspace. You can use this same basic process to create a transformation for any [supported table](tables-feature-support.md) in a Log Analytics workspace.  

This tutorial will use the Azure portal which provides a wizard to walk you through the process of creating an ingestion-time transformation. The following actions are performed for you when you complete this wizard:

- Updates the table schema with any additional columns from the query.
- Creates a `WorkspaceTransforms` data collection rule (DCR) and links it to the workspace if a default DCR isn't already linked to the workspace.
- Creates an ingestion-time transformation and adds it to the DCR.


## Enable query audit logs
You need to enable [query auditing](query-audit.md) for your workspace to create the `LAQueryLogs` table that you'll be working with. This is not required for all ingestion time transformations. It's just to generate the sample data that we'll be working with. 

1. From the **Log Analytics workspaces** menu in the Azure portal, select **Diagnostic settings** and then **Add diagnostic setting**.

    :::image type="content" source="media/tutorial-ingestion-time-transformations/diagnostic-settings.png" lightbox="media/tutorial-ingestion-time-transformations/diagnostic-settings.png" alt-text="Screenshot of diagnostic settings.":::

2. Provide a name for the diagnostic setting and select the workspace so that the auditing data is stored in the same workspace. Select the **Audit** category and  then click **Save** to save the diagnostic setting and close the diagnostic setting page.

    :::image type="content" source="media/tutorial-ingestion-time-transformations/new-diagnostic-setting.png" lightbox="media/tutorial-ingestion-time-transformations/new-diagnostic-setting.png" alt-text="Screenshot of new diagnostic setting.":::

3. Select **Logs** and then run some queries to populate `LAQueryLogs` with some data. These queries don't need to return data to be added to the audit log.

    :::image type="content" source="media/tutorial-ingestion-time-transformations/sample-queries.png" lightbox="media/tutorial-ingestion-time-transformations/sample-queries.png" alt-text="Screenshot of sample log queries.":::

## Add transformation to the table
Now that the table's created, you can add the transformation to it.

1. From the **Log Analytics workspaces** menu in the Azure portal, select **Tables (preview)**. Locate the `LAQueryLogs` table and select **Create transformation**.

    :::image type="content" source="media/tutorial-ingestion-time-transformations/create-transformation.png" lightbox="media/tutorial-ingestion-time-transformations/create-transformation.png" alt-text="Screenshot of creating a new transformation.":::


2. Since this is the first transformation in the workspace, you need to create a [workspace transformation DCR](../essentials/data-collection-rule-overview.md#types-of-data-collection-rules). If you create transformations for other tables in the same workspace, they will be stored in this same DCR. Click **Create a new data collection rule**. The **Subscription** and **Resource group** will already be populated for the workspace. Provide a name for the DCR and click **Done**.

    :::image type="content" source="media/tutorial-ingestion-time-transformations/new-data-collection-rule.png" lightbox="media/tutorial-ingestion-time-transformations/new-data-collection-rule.png" alt-text="Screenshot of creating a new data collection rule.":::

3. Click **Next** to view sample data from the table. As you define the transformation, the result will be applied to the sample data allowing you to evaluate the results before applying it to actual data. Click **Transformation editor** to define the transformation.

    :::image type="content" source="media/tutorial-ingestion-time-transformations/sample-data.png" lightbox="media/tutorial-ingestion-time-transformations/sample-data.png" alt-text="Screenshot of sample data from the log table.":::

4. In the transformation editor, you can see the transformation that will be applied to the data prior to its ingestion into the table. The incoming data is represented by a virtual table named `source`, which has the same set of columns as the destination table itself. The transformation initially contains a simple query returning the `source` table with no changes.

5. Modify the query to the following:

    ``` kusto
    source
    | where QueryText !contains 'LAQueryLogs'
    | extend Context = parse_json(RequestContext)
    | extend Workspace_CF = tostring(Context['workspaces'][0])
    | project-away RequestContext, Context
    ```

    This makes the following changes:

   - Drop rows related to querying the `LAQueryLogs` table itself to save space since these log entries aren't useful.
   - Add a column for the name of the workspace that was queried.
   - Remove data from the `RequestContext` column to save space.



    > [!Note]
    > Using the Azure portal, the output of the transformation will initiate changes to the table schema if required. Columns will be added to match the transformation output if they don't already exist. Make sure that your output doesn't contain any additional columns that you don't want added to the table. If the output does not include columns that are already in the table, those columns will not be removed, but data will not be added.
    > 
    > Any custom columns added to a built-in table must end in *_CF*. Columns added to a custom table (a table with a name that ends in *_CL*) does not need to have this suffix.

6. Copy the query into the transformation editor and click **Run** to view results from the sample data. You can verify that the new `Workspace_CF` column is in the query.

    :::image type="content" source="media/tutorial-ingestion-time-transformations/transformation-editor.png" lightbox="media/tutorial-ingestion-time-transformations/transformation-editor.png" alt-text="Screenshot of transformation editor.":::

7. Click **Apply** to save the transformation and then **Next** to review the configuration. Click **Create** to update the data collection rule with the new transformation.

    :::image type="content" source="media/tutorial-ingestion-time-transformations/save-transformation.png" lightbox="media/tutorial-ingestion-time-transformations/save-transformation.png" alt-text="Screenshot of saving transformation.":::

## Test transformation
Allow about 30 minutes for the transformation to take effect and then test it by running a query against the table. Only data sent to the table after the transformation was applied will be affected. 

For this tutorial, run some sample queries to send data to the `LAQueryLogs` table. Include some queries against `LAQueryLogs` so you can verify that the transformation filters these records. Notice that the output has the new `Workspace_CF` column, and there are no records for `LAQueryLogs`.

## Troubleshooting
This section describes different error conditions you may receive and how to correct them.

### IntelliSense in Log Analytics not recognizing new columns in the table
The cache that drives IntelliSense may take up to 24 hours to update.

### Transformation on a dynamic column isn't working
There is currently a known issue affecting dynamic columns. A temporary workaround is to explicitly parse dynamic column data using `parse_json()` prior to performing any operations against them.

## Next steps

- [Read more about ingestion-time transformations](ingestion-time-transformations.md)
- [See which tables support ingestion-time transformations](tables-feature-support.md)
- [Learn more about writing transformation queries](../essentials/data-collection-rule-transformations.md)
