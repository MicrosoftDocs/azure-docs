---
title: Business terms approval workflow
description: This article describes how to create and manage workflows to approve business terms in Microsoft Purview.
author: nayenama
ms.author: nayenama
ms.service: purview
ms.subservice: purview-workflows
ms.topic: how-to
ms.date: 02/20/2023
ms.custom: template-how-to
---


# Approval workflow for business terms

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

This guide will take you through the creation and management of approval workflows for business terms.

## Create and enable a new approval workflow for business terms

1. Sign in to the [Microsoft Purview governance portal](https://web.purview.azure.com/resource/) and select the Management center. You'll see three new icons in the table of contents. 

    :::image type="content" source="./media/how-to-workflow-business-terms-approval/workflow-section.png" alt-text="Screenshot showing the management center left menu with the new workflow section highlighted.":::

1. To create new workflows, select **Authoring** in the workflow section. This will take you to the workflow authoring experiences.

    :::image type="content" source="./media/how-to-workflow-business-terms-approval/workflow-authoring-experience.png" alt-text="Screenshot showing the authoring workflows page, showing a list of all workflows.":::

    >[!NOTE]
    >If the authoring tab is greyed out, you don't have the permissions to be able to author workflows. You'll need the [workflow admin role](catalog-permissions.md).

1. To create a new workflow, select **+New** button. 

    :::image type="content" source="./media/how-to-workflow-business-terms-approval/workflow-authoring-select-new.png" alt-text="Screenshot showing the authoring workflows page, with the + New button highlighted.":::

1. To create **Approval workflows for business terms** Select **Data Catalog** and select **Continue**

    :::image type="content" source="./media/how-to-workflow-business-terms-approval/select-data-catalog.png" alt-text="Screenshot showing the new workflows menu, with Data Catalog selected.":::

1. In the next screen, you'll see all the templates provided by Microsoft Purview to create a workflow. Select the template using which you want to start your authoring experiences and select **Continue**. Each of these templates specifies the kind of action that will trigger the workflow. In the screenshot below we've selected **Create glossary term**.  The four different templates available for business glossary are:
    * Create glossary term - when a term is created, approval will be requested.
    * Update glossary term - when a term is updated, approval will be requested.
    * Delete glossary term - when a term is deleted, approval will be requested.
    * Import terms - when terms are imported, approval will be requested.
    
    :::image type="content" source="./media/how-to-workflow-business-terms-approval/create-glossary-term-select-continue.png" alt-text="Screenshot showing the new data catalog workflow menu, showing template options, with the Continue button selected.":::

1. Next, enter a workflow name and optionally add a description. Then select **Continue**.

    :::image type="content" source="./media/how-to-workflow-business-terms-approval/name-and-continue.png" alt-text="Screenshot showing the new data catalog workflow menu with a name entered into the name textbox.":::

1. You'll now be presented with a canvas where the selected template is loaded by default.
    
    :::image type="content" source="./media/how-to-workflow-business-terms-approval/workflow-authoring-canvas-inline.png" alt-text="Screenshot showing the workflow authoring canvas, with the selected template workflow populated in the central workspace." lightbox="./media/how-to-workflow-business-terms-approval/workflow-authoring-canvas-expanded.png":::

1. The default template can be used as it is by populating the approver's email address in **Start and Wait for approval** Connector. 

    :::image type="content" source="./media/how-to-workflow-business-terms-approval/add-approver-email-inline.png" alt-text="Screenshot showing the workflow authoring canvas, with the start and wait for an approval step opened, and the Assigned to textbox highlighted." lightbox="./media/how-to-workflow-business-terms-approval/add-approver-email-expanded.png":::

    The default template has the following steps: 
    1. Trigger when a glossary term is created/updated/deleted/imported depending on the template selected.
    1. Approval connector that specifies a user or group that will be contacted to approve the request.
    1. Condition to check approval status 
        - If approved:
            1. Create/update/delete/import the glossary term
            1. Send an email to requestor that their request is approved, and term CUD (create, update, delete) operation is successful.
        - If rejected:
            1. Send email to requestor that their request is denied. 

1. You can also modify the template by adding more connectors to suit your organizational needs. Add a new step to the end of the template by selecting the **New step** button. Add steps between any already existing steps by selecting the arrow icon between any steps.

    :::image type="content" source="./media/how-to-workflow-business-terms-approval/modify-template-inline.png" alt-text="Screenshot showing the workflow authoring canvas, with a + button highlighted on the arrow between the two top steps, and the Next Step button highlighted at the bottom of the workspace." lightbox="./media/how-to-workflow-business-terms-approval/modify-template-expanded.png":::

1. Once you're done defining a workflow, you need to bind the workflow to a glossary hierarchy path. The binding implies that this workflow is triggered only for CUD operations within the specified glossary hierarchy path. A workflow can be bound to only one hierarchy path. To bind a workflow or to apply a scope to a workflow, you need to select ‘Apply workflow’. Select the scopes you want this workflow to be associated with and select **OK**.

    :::image type="content" source="./media/how-to-workflow-business-terms-approval/select-apply-workflow.png" alt-text="Screenshot showing the new data catalog workflow menu with the Apply Workflow button highlighted at the top of the workspace.":::

    :::image type="content" source="./media/how-to-workflow-business-terms-approval/select-okay.png" alt-text="Screenshot showing the apply workflow window, showing a list of items that the workflow can be applied to. At the bottom of the window, the O K button is selected.":::

    >[!NOTE]
    > - The Microsoft Purview workflow engine will always resolve to the closest workflow that the term hierarchy path is associated with. In case a direct binding is not found, it will traverse up in the tree to find the workflow associated with the closest parent in the glossary tree. 
    > - Import terms can only be bound to root glossary path as the .CSV can contain terms from different hierarchy paths.

1. By default, the workflow will be enabled. To disable, toggle the Enable button in the top menu.

1. Finally select **Save and close** to create and the workflow.

    :::image type="content" source="./media/how-to-workflow-business-terms-approval/workflow-enabled.png" alt-text="Screenshot showing the workflow authoring page, showing the newly created workflow listed among all other workflows.":::

## Edit an existing workflow 

To modify an existing workflow, select the workflow and then select **Edit** in the top menu. You'll then be presented with the canvas containing workflow definition. Modify the workflow and select **Save** to commit changes.

:::image type="content" source="./media/how-to-workflow-business-terms-approval/select-edit.png" alt-text="Screenshot showing the workflow authoring page, with the Edit button highlighted in the top menu.":::

## Disable a workflow

To disable a workflow, select the workflow and then select **Disable** in the top menu. You can also disable the workflow by selecting **Edit** and changing the enable toggle in workflow canvas.

:::image type="content" source="./media/how-to-workflow-business-terms-approval/select-disable.png" alt-text="Screenshot showing the workflow authoring page, with the Disable button highlighted in the top menu.":::

## Delete a workflow

To delete a workflow, select the workflow and then select **Delete** in the top menu.

:::image type="content" source="./media/how-to-workflow-business-terms-approval/select-delete.png" alt-text="Screenshot showing the workflow authoring page, with the Delete button highlighted in the top menu.":::

## Limitations for business terms with approval workflow enabled  

* Non-approved glossary terms aren't saved in Purview catalog. 
* The behavior of tagging terms to assets/schemas is same as today. That is, previously created draft terms can be tagged to assets/schemas. 

## Next steps

For more information about workflows, see these articles:

- [What are Microsoft Purview workflows](concept-workflow.md)
- [Self-service data access workflow for hybrid data estates](how-to-workflow-self-service-data-access-hybrid.md)
- [Manage workflow requests and approvals](how-to-workflow-manage-requests-approvals.md)
