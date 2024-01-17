---
title: 'Tutorial: Add a workspace transformation to Azure Monitor Logs by using the Azure portal'
description: Describes how to add a custom transformation to data flowing through Azure Monitor Logs by using the Azure portal.
ms.topic: tutorial
author: bwren
ms.author: bwren
ms.date: 07/17/2023
---

# Tutorial: Add a transformation in a workspace data collection rule by using the Azure portal
This tutorial walks you through configuration of a sample [transformation in a workspace data collection rule (DCR)](../essentials/data-collection-transformations.md) by using the Azure portal. [Transformations](../essentials/data-collection-transformations.md) in Azure Monitor allow you to filter or modify incoming data before it's sent to its destination. Workspace transformations provide support for [ingestion-time transformations](../essentials/data-collection-transformations.md) for workflows that don't yet use the [Azure Monitor data ingestion pipeline](../essentials/data-collection.md).

Workspace transformations are stored together in a single [DCR](../essentials/data-collection-rule-overview.md) for the workspace, which is called the workspace DCR. Each transformation is associated with a particular table. The transformation will be applied to all data sent to this table from any workflow not using a DCR.

> [!NOTE]
> This tutorial uses the Azure portal to configure a workspace transformation. For the same tutorial using Azure Resource Manager templates and REST API, see [Tutorial: Add transformation in workspace data collection rule to Azure Monitor using resource manager templates](tutorial-workspace-transformations-api.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Configure a [workspace transformation](../essentials/data-collection-transformations.md#workspace-transformation-dcr) for a table in a Log Analytics workspace.
> * Write a log query for a workspace transformation.

## Prerequisites
To complete this tutorial, you need:

- A Log Analytics workspace where you have at least [contributor rights](manage-access.md#azure-rbac).
- [Permissions to create DCR objects](../essentials/data-collection-rule-create-edit.md#permissions) in the workspace.
- A table that already has some data.
- The table can't be linked to the [workspace transformation DCR](../essentials/data-collection-transformations.md#workspace-transformation-dcr).

## Overview of the tutorial
In this tutorial, you'll reduce the storage requirement for the `LAQueryLogs` table by filtering out certain records. You'll also remove the contents of a column while parsing the column data to store a piece of data in a custom column. The [LAQueryLogs table](query-audit.md#audit-data) is created when you enable [log query auditing](query-audit.md) in a workspace. You can use this same basic process to create a transformation for any [supported table](tables-feature-support.md) in a Log Analytics workspace.

This tutorial uses the Azure portal, which provides a wizard to walk you through the process of creating an ingestion-time transformation. After you finish the steps, you'll see that the wizard:

- Updates the table schema with any other columns from the query.
- Creates a `WorkspaceTransforms` DCR and links it to the workspace if a default DCR isn't already linked to the workspace.
- Creates an ingestion-time transformation and adds it to the DCR.

## Enable query audit logs
You need to enable [query auditing](query-audit.md) for your workspace to create the `LAQueryLogs` table that you'll be working with. This step isn't required for all ingestion time transformations. It's just to generate the sample data that we'll be working with.

1. On the **Log Analytics workspaces** menu in the Azure portal, select **Diagnostic settings** > **Add diagnostic setting**.

    :::image type="content" source="media/tutorial-workspace-transformations-portal/diagnostic-settings.png" lightbox="media/tutorial-workspace-transformations-portal/diagnostic-settings.png" alt-text="Screenshot that shows diagnostic settings.":::

1. Enter a name for the diagnostic setting. Select the workspace so that the auditing data is stored in the same workspace. Select the **Audit** category and then select **Save** to save the diagnostic setting and close the **Diagnostic setting** page.

    :::image type="content" source="media/tutorial-workspace-transformations-portal/new-diagnostic-setting.png" lightbox="media/tutorial-workspace-transformations-portal/new-diagnostic-setting.png" alt-text="Screenshot that shows the new diagnostic setting.":::

1. Select **Logs** and then run some queries to populate `LAQueryLogs` with some data. These queries don't need to return data to be added to the audit log.

    :::image type="content" source="media/tutorial-workspace-transformations-portal/sample-queries.png" lightbox="media/tutorial-workspace-transformations-portal/sample-queries.png" alt-text="Screenshot that shows sample log queries.":::

## Add a transformation to the table
Now that the table's created, you can create the transformation for it.

1. On the **Log Analytics workspaces** menu in the Azure portal, select **Tables**. Locate the `LAQueryLogs` table and select **Create transformation**.

    :::image type="content" source="media/tutorial-workspace-transformations-portal/create-transformation.png" lightbox="media/tutorial-workspace-transformations-portal/create-transformation.png" alt-text="Screenshot that shows creating a new transformation.":::

1. Because this transformation is the first one in the workspace, you must create a [workspace transformation DCR](../essentials/data-collection-transformations.md#workspace-transformation-dcr). If you create transformations for other tables in the same workspace, they'll be stored in this same DCR. Select **Create a new data collection rule**. The **Subscription** and **Resource group** will already be populated for the workspace. Enter a name for the DCR and select **Done**.

    :::image type="content" source="media/tutorial-workspace-transformations-portal/new-data-collection-rule.png" lightbox="media/tutorial-workspace-transformations-portal/new-data-collection-rule.png" alt-text="Screenshot that shows creating a new data collection rule.":::

1. Select **Next** to view sample data from the table. As you define the transformation, the result will be applied to the sample data. For this reason, you can evaluate the results before you apply it to actual data. Select **Transformation editor** to define the transformation.

    :::image type="content" source="media/tutorial-workspace-transformations-portal/sample-data.png" lightbox="media/tutorial-workspace-transformations-portal/sample-data.png" alt-text="Screenshot that shows sample data from the log table.":::

1. In the transformation editor, you can see the transformation that will be applied to the data prior to its ingestion into the table. The incoming data is represented by a virtual table named `source`, which has the same set of columns as the destination table itself. The transformation initially contains a simple query that returns the `source` table with no changes.

1. Modify the query to the following example:

    ``` kusto
    source
    | where QueryText !contains 'LAQueryLogs'
    | extend Context = parse_json(RequestContext)
    | extend Workspace_CF = tostring(Context['workspaces'][0])
    | project-away RequestContext, Context
    ```

    The modification makes the following changes:

   - Rows related to querying the `LAQueryLogs` table itself were dropped to save space because these log entries aren't useful.
   - A column for the name of the workspace that was queried was added.
   - Data from the `RequestContext` column was removed to save space.

    > [!Note]
    > Using the Azure portal, the output of the transformation will initiate changes to the table schema if required. Columns will be added to match the transformation output if they don't already exist. Make sure that your output doesn't contain any columns that you don't want added to the table. If the output doesn't include columns that are already in the table, those columns won't be removed, but data won't be added.
    > 
    > Any custom columns added to a built-in table must end in `_CF`. Columns added to a custom table don't need to have this suffix. A custom table has a name that ends in `_CL`.

1. Copy the query into the transformation editor and select **Run** to view results from the sample data. You can verify that the new `Workspace_CF` column is in the query.

    :::image type="content" source="media/tutorial-workspace-transformations-portal/transformation-editor.png" lightbox="media/tutorial-workspace-transformations-portal/transformation-editor.png" alt-text="Screenshot that shows the transformation editor.":::

1. Select **Apply** to save the transformation and then select **Next** to review the configuration. Select **Create** to update the DCR with the new transformation.

    :::image type="content" source="media/tutorial-workspace-transformations-portal/save-transformation.png" lightbox="media/tutorial-workspace-transformations-portal/save-transformation.png" alt-text="Screenshot that shows saving the transformation.":::

## Test the transformation
Allow about 30 minutes for the transformation to take effect and then test it by running a query against the table. Only data sent to the table after the transformation was applied will be affected.

For this tutorial, run some sample queries to send data to the `LAQueryLogs` table. Include some queries against `LAQueryLogs` so that you can verify that the transformation filters these records. Now the output has the new `Workspace_CF` column, and there are no records for `LAQueryLogs`.

## Troubleshooting
This section describes different error conditions you might receive and how to correct them.

### IntelliSense in Log Analytics not recognizing new columns in the table
The cache that drives IntelliSense might take up to 24 hours to update.

### Transformation on a dynamic column isn't working
A known issue currently affects dynamic columns. A temporary workaround is to explicitly parse dynamic column data by using `parse_json()` prior to performing any operations against them.

## Next steps

- [Read more about transformations](../essentials/data-collection-transformations.md)
- [See which tables support workspace transformations](tables-feature-support.md)
- [Learn more about writing transformation queries](../essentials/data-collection-transformations-structure.md)
