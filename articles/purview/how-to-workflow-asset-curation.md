---
title: Asset curation approval workflow
description: This article describes how to create and manage workflows to approve data asset curation in Microsoft Purview.
author: nayenama
ms.author: nayenama
ms.service: purview
ms.subservice: purview-workflows
ms.topic: how-to
ms.date: 01/03/2023
ms.custom: template-how-to
---


# Approval workflow for asset curation

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

This guide will take you through the creation and management of approval workflows for asset curation.

## Create and enable a new approval workflow for asset curation

1. Sign in to the [Microsoft Purview governance portal](https://web.purview.azure.com/resource/) and select the Management center. You'll see three new icons in the table of contents. 

    :::image type="content" source="./media/how-to-workflow-asset-curation/workflow-section.png" alt-text="Screenshot showing the management center left menu with the new workflow section highlighted.":::

1. To create new workflows, select **Authoring** in the workflow section. This will take you to the workflow authoring experiences.

    :::image type="content" source="./media/how-to-workflow-asset-curation/workflow-authoring-experience.png" alt-text="Screenshot showing the authoring workflows page, showing a list of all workflows.":::

    >[!NOTE]
    >If the authoring tab is greyed out, you don't have the permissions to be able to author workflows. You'll need the [workflow admin role](catalog-permissions.md).

1. To create a new workflow, select the **+New** button. 

    :::image type="content" source="./media/how-to-workflow-asset-curation/workflow-authoring-select-new.png" alt-text="Screenshot showing the authoring workflows page, with the plus sign New button highlighted.":::

1. To create **Approval workflows for asset curation** Select **Data Catalog** and select **Continue**

    :::image type="content" source="./media/how-to-workflow-asset-curation/select-data-catalog.png" alt-text="Screenshot showing the new workflows menu, with Data Catalog selected.":::

1. In the next screen, you'll see all the templates provided by Microsoft Purview to create a workflow. Select the template using which you want to start your authoring experiences and select **Continue**. Each of these templates specifies the kind of action that will trigger the workflow. In the screenshot below we've selected **Update asset attributes** to create approval workflow for asset updates.
    
    :::image type="content" source="./media/how-to-workflow-asset-curation/update-asset-attributes-continue.png" alt-text="Screenshot showing the new data catalog workflow menu, showing template options, with the Continue button selected." lightbox="./media/how-to-workflow-asset-curation/update-asset-attributes-continue.png":::

1. Next, enter a workflow name and optionally add a description. Then select **Continue**.

    :::image type="content" source="./media/how-to-workflow-asset-curation/name-and-continue.png" alt-text="Screenshot showing the new data catalog workflow menu with a name entered into the name textbox.":::

1. You'll now be presented with a canvas where the selected template is loaded by default.
    
    :::image type="content" source="./media/how-to-workflow-asset-curation/workflow-authoring-canvas-inline.png" alt-text="Screenshot showing the workflow authoring canvas, with the selected template workflow populated in the central workspace." lightbox="./media/how-to-workflow-asset-curation/workflow-authoring-canvas-inline.png":::

1. The default template can be used as it is by populating the approver's email address in **Start and Wait for approval** Connector. 

    :::image type="content" source="./media/how-to-workflow-asset-curation/add-approver-email-inline.png" alt-text="Screenshot showing the workflow authoring canvas, with the start and wait for an approval step opened, and the Assigned to textbox highlighted." lightbox="./media/how-to-workflow-asset-curation/add-approver-email-inline.png":::

    The default template has the following steps: 
    1. Trigger when an asset is updated. The update can be done in overview, schema or contacts tab.
    1. Approval connector that specifies a user or group that will be contacted to approve the request.
    1. Condition to check approval status 
        - If approved:
            1. Update the asset in Purview data catalog.
            1. Send an email to requestor that their request is approved, and asset update operation is successful.
        - If rejected:
            1. Send email to requestor that their asset update request is denied. 

1. You can also modify the template by adding more connectors to suit your organizational needs. Add a new step to the end of the template by selecting the **New step** button. Add steps between any already existing steps by selecting the arrow icon between any steps.

    :::image type="content" source="./media/how-to-workflow-asset-curation/modify-template-inline.png" alt-text="Screenshot showing the workflow authoring canvas, with a plus sign button highlighted on the arrow between the two top steps, and the Next Step button highlighted at the bottom of the workspace." lightbox="./media/how-to-workflow-asset-curation/modify-template-inline.png":::

1. Once you're done defining a workflow, you need to bind the workflow to a collection hierarchy path. The binding implies that this workflow is triggered only for update operation on data assets in that collection. A workflow can be bound to only one hierarchy path. To bind a workflow or to apply a scope to a workflow, you need to select ‘Apply workflow’. Select the scopes you want this workflow to be associated with and select **OK**.

    :::image type="content" source="./media/how-to-workflow-asset-curation/select-apply-workflow.png" alt-text="Screenshot showing the new data catalog workflow menu with the Apply Workflow button highlighted at the top of the workspace." lightbox="./media/how-to-workflow-asset-curation/select-apply-workflow.png":::

    :::image type="content" source="./media/how-to-workflow-asset-curation/select-okay.png" alt-text="Screenshot showing the apply workflow window, showing a list of items that the workflow can be applied to. At the bottom of the window, the O K button is selected." lightbox="./media/how-to-workflow-asset-curation/select-okay.png":::

    >[!NOTE]
    > The Microsoft Purview workflow engine will always resolve to the closest workflow that the collection hierarchy path is associated with. In case a direct binding is not found, it will traverse up in the tree to find the workflow associated with the closest parent in the collection tree.

1. By default, the workflow will be enabled. To disable, toggle the Enable button in the top menu.

1. Finally select **Save and close** to create and the workflow.

    :::image type="content" source="./media/how-to-workflow-asset-curation/workflow-enabled.png" alt-text="Screenshot showing the workflow authoring page, showing the newly created workflow listed among all other workflows." lightbox="./media/how-to-workflow-asset-curation/workflow-enabled.png":::

## Edit an existing workflow 

To modify an existing workflow, select the workflow and then select **Edit** in the top menu. You'll then be presented with the canvas containing workflow definition. Modify the workflow and select **Save** to commit changes.

:::image type="content" source="./media/how-to-workflow-asset-curation/select-edit.png" alt-text="Screenshot showing the workflow authoring page, with the Edit button highlighted in the top menu." lightbox="./media/how-to-workflow-asset-curation/select-edit.png":::

## Disable a workflow

To disable a workflow, select the workflow and then select **Disable** in the top menu. You can also disable the workflow by selecting **Edit** and changing the enable toggle in workflow canvas.

:::image type="content" source="./media/how-to-workflow-asset-curation/select-disable.png" alt-text="Screenshot showing the workflow authoring page, with the Disable button highlighted in the top menu." lightbox="./media/how-to-workflow-asset-curation/select-disable.png":::

## Delete a workflow

To delete a workflow, select the workflow and then select **Delete** in the top menu.

:::image type="content" source="./media/how-to-workflow-asset-curation/select-delete.png" alt-text="Screenshot showing the workflow authoring page, with the Delete button highlighted in the top menu." lightbox="./media/how-to-workflow-asset-curation/select-delete.png":::

## Limitations for asset curation with approval workflow enabled  

- Lineage updates are directly stored in Purview data catalog without any approvals.

## Next steps

For more information about workflows, see these articles:

- [What are Microsoft Purview workflows](concept-workflow.md)
- [Self-service data access workflow for hybrid data estates](how-to-workflow-self-service-data-access-hybrid.md)
- [Manage workflow requests and approvals](how-to-workflow-manage-requests-approvals.md)
