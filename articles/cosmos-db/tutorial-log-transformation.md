---
title: |
  Tutorial: Add a transformation for workspace data
titleSuffix: Azure Cosmos DB
description: In this tutorial, add a custom transformation to data flowing through Azure Monitor Logs from Azure Cosmos DB by using the Azure portal.
author: StefArroyo
ms.author: esarroyo
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.topic: tutorial
ms.date: 03/22/2023
---

# Tutorial: Add a transformation for Azure Cosmos DB workspace data by using the Azure portal

This tutorial walks you through configuration of a sample [transformation in a workspace data collection rule (DCR)](../azure-monitor/essentials/data-collection-transformations.md) by using the Azure portal.

> [!NOTE]
> To help improve costs for enabling Log Analytics, we now support adding Data Collection Rules and transformations on your Log Analytics resources to filter out columns, reduce number of results returned, and create new columns before the data is sent to the destination.

Workspace transformations are stored together in a single [DCR](../azure-monitor/essentials/data-collection-rule-overview.md) for the workspace, which is called the workspace DCR. Each transformation is associated with a particular table. The transformation is applied to all data sent to this table from any workflow not using a DCR.

> [!NOTE]
> This tutorial uses the Azure portal to configure a workspace transformation. For the same tutorial using Azure Resource Manager templates and REST API, see [Tutorial: Add transformation in workspace data collection rule to Azure Monitor using resource manager templates](../azure-monitor/logs/tutorial-workspace-transformations-api.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - Configure a [workspace transformation](../azure-monitor/essentials/data-collection-transformations.md#workspace-transformation-dcr) for a table in a Log Analytics workspace.
> - Write a log query for a workspace transformation.
>

## Prerequisites

To complete this tutorial, you need:

- A Log Analytics workspace where you have at least [contributor rights](../azure-monitor/logs/manage-access.md#azure-rbac).
- [Permissions to create DCR objects](../azure-monitor/essentials/data-collection-rule-create-edit.md#permissions) in the workspace.
- A table that already has some data.
- The table can't be linked to the [workspace transformation DCR](../azure-monitor/essentials/data-collection-transformations.md#workspace-transformation-dcr).

## Overview of the tutorial

In this tutorial, you reduce the storage requirement for the `CDBDataPlaneRequests` table by filtering out certain records. You also remove the contents of a column while parsing the column data to store a piece of data in a custom column. The [CDBDataPlaneRequests table](monitor-resource-logs.md) is created when you enable [log analytics](monitor-resource-logs.md) in a workspace.

This tutorial uses the Azure portal, which provides a wizard to walk you through the process of creating an ingestion-time transformation. After you finish the steps, you'll see that the wizard:

- Updates the table schema with any other columns from the query.
- Creates a `WorkspaceTransformation` DCR and links it to the workspace if a default DCR isn't already linked to the workspace.
- Creates an ingestion-time transformation and adds it to the DCR.

## Enable query audit logs

You need to enable [log analytics](monitor-resource-logs.md) for your workspace to create the `CDBDataPlaneRequests` table that you're working with. This step isn't required for all ingestion time transformations. It's just to generate the sample data that we're working with.

## Add a transformation to the table

Now that the table's created, you can create the transformation for it.

1. On the **Log Analytics workspaces** menu in the Azure portal, select **Tables**. Locate the `CDBDataPlaneRequests` table and select **Create transformation**.

    :::image type="content" source="media/tutorial-log-transformation/create-transformation.png" lightbox="media/tutorial-log-transformation/create-transformation.png" alt-text="Screenshot that shows creating a new transformation.":::

1. Because this transformation is the first one in the workspace, you must create a [workspace transformation DCR](../azure-monitor/essentials/data-collection-transformations.md#workspace-transformation-dcr). If you create transformations for other tables in the same workspace, they're stored in this same DCR. Select **Create a new data collection rule**. The **Subscription** and **Resource group** are already populated for the workspace. Enter a name for the DCR and select **Done**.

1. Select **Next** to view sample data from the table. As you define the transformation, the result is applied to the sample data. For this reason, you can evaluate the results before you apply it to actual data. Select **Transformation editor** to define the transformation.

    :::image type="content" source="media/tutorial-log-transformation/transformation-query-results.png" lightbox="media/tutorial-log-transformation/transformation-query-results.png" alt-text="Screenshot that shows sample data from the log table.":::

1. In the transformation editor, you can see the transformation that is applied to the data prior to its ingestion into the table. A virtual table named `source` represents the incoming data, which has the same set of columns as the destination table itself. The transformation initially contains a simple query that returns the `source` table with no changes.

1. Modify the query to the following example:

    ``` kusto
    source
    | where StatusCode != 200 // searching for requests that are not successful
    | project-away Type, TenantId
    ```

    The modification makes the following changes:

   - Rows related to querying the `CDBDataPlaneRequests` table itself were dropped to save space because these log entries aren't useful.
   - Data from the `TenantId` and `Type` columns were removed to save space.
   - Transformations also support adding columns using the `extend` operator in your query.

    > [!Note]
    > Using the Azure portal, the output of the transformation will initiate changes to the table schema if required. Columns will be added to match the transformation output if they don't already exist. Make sure that your output doesn't contain any columns that you don't want added to the table. If the output doesn't include columns that are already in the table, those columns won't be removed, but data won't be added.
    >
    > Any custom columns added to a built-in table must end in `_CF`. Columns added to a custom table don't need to have this suffix. A custom table has a name that ends in `_CL`.

1. Copy the query into the transformation editor and select **Run** to view results from the sample data. You can verify that the new `Workspace_CF` column is in the query.

    :::image type="content" source="media/tutorial-log-transformation/select-transformation-editor.png" lightbox="media/tutorial-log-transformation/select-transformation-editor.png" alt-text="Screenshot that shows the transformation editor.":::

1. Select **Apply** to save the transformation and then select **Next** to review the configuration. Select **Create** to update the DCR with the new transformation.

    :::image type="content" source="media/tutorial-log-transformation/transformation-configuration-created.png" lightbox="media/tutorial-log-transformation/transformation-configuration-created.png" alt-text="Screenshot that shows saving the transformation.":::

## Test the transformation

Allow about 30 minutes for the transformation to take effect and then test it by running a query against the table. This transformation affects only data sent to the table after the transformation was applied.

For this tutorial, run some sample queries to send data to the `CDBDataPlaneRequests` table. Include some queries against `CDBDataPlaneRequests` so that you can verify that the transformation filters these records.

## Troubleshooting

This section describes different error conditions you might receive and how to correct them.

### IntelliSense in Log Analytics not recognizing new columns in the table

The cache that drives IntelliSense might take up to 24 hours to update.

### Transformation on a dynamic column isn't working

A known issue currently affects dynamic columns. A temporary workaround is to explicitly parse dynamic column data by using `parse_json()` prior to performing any operations against them.

## Next steps

> [!div class="nextstepaction"]
> [Data collection transformations](../azure-monitor/essentials/data-collection-transformations.md)
