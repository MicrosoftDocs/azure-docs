---
title: Post-processing in Business Process Solutions
titleSuffix: SAP on Azure
description: Learn how to import lakehouse views, reset checkpoints for delta tables, and configure semantic model refresh in Business Process Solutions.
author: ritikesh-vali
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.topic: how-to
ms.date: 04/07/2026
ms.author: tpounjula
---

# Post-processing in Business Process Solutions

After you deploy insights, complete these post-processing tasks to import lakehouse views, reset checkpoints for delta tables, and configure semantic model refresh.

## Connection for Semantic Model Refreshes

To refresh the semantic model automatically through pipelines, set up a connection in Microsoft Fabric.

1. Open the semantic model item. Select **File** > **Settings**.
   :::image type="content" source="./media/post-processing/model-settings.png" alt-text="Screenshot showing how to open the semantic model settings." lightbox="./media/post-processing/model-settings.png":::
2. Open **Gateway and cloud connections**. Under **Cloud connections**, select **Create a connection**.
3. Enter a unique name for your connection. Multiple reports can use this connection. Select **OAuth 2.0** as the authentication method.
   :::image type="content" source="./media/post-processing/lakehouse-connection.png" alt-text="Screenshot showing how to create a Microsoft Fabric lakehouse connection." lightbox="./media/post-processing/lakehouse-connection.png":::
4. Select **Edit credentials**. Provide the credentials. Then select **Create**.
5. After the connection is created, return to the semantic model. Associate the connection.
   :::image type="content" source="./media/post-processing/associate-connection.png" alt-text="Screenshot showing how to associate a connection to the semantic model." lightbox="./media/post-processing/associate-connection.png":::
6. Refresh the semantic model. Confirm that it completes successfully.

## Import Lakehouse Views

Some insights require SQL views on top of the lakehouse. To deploy these views, run the provided notebook from your workspace:

1. Navigate to your workspace.
2. Open the notebook **bps_gold_view_creation**.
   :::image type="content" source="./media/post-processing/gold-view-notebook.png" alt-text="Screenshot showing how to open the bps_gold_view_creation notebook." lightbox="./media/post-processing/gold-view-notebook.png":::
3. Select **Run all**.
   :::image type="content" source="./media/post-processing/run-gold-view-notebook.png" alt-text="Screenshot showing how to run the bps_gold_view_creation notebook." lightbox="./media/post-processing/run-gold-view-notebook.png":::
4. When the notebook run finishes, you should see the SQL views in your gold lakehouse.

## Reset Checkpoint for Delta Tables

If you need to reinitialize delta extraction for a table, you can reset its checkpoint from the dataset explorer.

1. In **Datasets**, navigate to the required dataset and select the delta table.
2. Select the ellipsis (**...**) next to the table, and then select **Reset Checkpoint**.
   :::image type="content" source="./media/post-processing/reset-checkpoint-menu.png" alt-text="Screenshot showing the table actions menu with the Reset Checkpoint option selected for a delta table." lightbox="./media/post-processing/reset-checkpoint-menu.png":::
3. Confirm that the notification appears showing that the checkpoint reset is in progress.
   :::image type="content" source="./media/post-processing/resetting-checkpoint.png" alt-text="Screenshot showing the Resetting checkpoint notification for the selected table." lightbox="./media/post-processing/resetting-checkpoint.png":::
4. Verify that the success notification appears after the operation completes.
   :::image type="content" source="./media/post-processing/reset-checkpoint-success.png" alt-text="Screenshot showing the Successfully reset checkpoint notification for the selected table." lightbox="./media/post-processing/reset-checkpoint-success.png":::
5. Rerun the relevant extraction or processing pipeline if you want to reload the table after the checkpoint reset.

## Summary

This article described the post-processing tasks for insights in Business Process Solutions. You learned how to import lakehouse views, reset checkpoints for delta tables, and configure a connection for semantic model refresh.
