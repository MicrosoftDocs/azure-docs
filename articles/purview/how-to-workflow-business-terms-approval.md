---
title: Business terms approval workflow
description: This article describes how to create and manage workflows to approve business terms in Azure Purview.
author: nayenama
ms.author: nayenama
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 03/01/2022
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---


# Approval workflow for business terms

This guide will take you through the creation and management of approval workflows for business terms. 


## Create and enable a new approval workflow for business terms

1. Sign in to the Azure Purview studio and select Management center. You'll see two new icons in the table of contents. 

    :::image type="content" source="./media/how-to-workflow-business-terms-approval/workflow-section.png" alt-text="Management center left menu with the new workflow section highlighted.":::

1. To create new workflows, select **Authoring** in workflow section. This will take you to the workflow authoring experiences.

    :::image type="content" source="./media/how-to-workflow-business-terms-approval/workflow-authoring-experience.png" alt-text="Authoring workflows page, showing a list of all workflows.":::

    >[!NOTE]
    >If Authoring is greyed out, the account you are using does not have sufficient permissions.

1. To create a new workflow, select ‘+New’ button and you'll be presented with different categories of workflows in Purview. To create ‘Approval workflows for business terms’ Select ‘Data Catalog’ and select ‘Continue’

    :::image type="content" source="./media/how-to-workflow-business-terms-approval/workflow-authoring-select-new.png" alt-text="Authoring workflows page, with the + New button highlighted.":::

    :::image type="content" source="./media/how-to-workflow-business-terms-approval/select-data-catalog.png" alt-text="New workflows menu, with Data Catalog selected.":::

1. In the next screen, you'll see all the templates provided by Azure Purview to create a workflow. Select the template using which you want to start your authoring experiences and select ‘Continue’. In the screenshot below we've selected ‘Create glossary term’.  The four different templates available for business glossary are:
    * Create glossary term 
    * Update glossary term 
    * Delete glossary term 
    * Import terms
    
    :::image type="content" source="./media/how-to-workflow-business-terms-approval/create-glossary-term-select-continue.png" alt-text="New data catalog workflow menu, showing template options, with the Continue button selected.":::

1. You'll be now presented with a window where you need to enter workflow name and optionally add a description. Once you've populated the same, select ‘Continue’.

    :::image type="content" source="./media/how-to-workflow-business-terms-approval/name-and-continue.png" alt-text="New data catalog workflow menu with a name entered into the name textbox.":::

1. You'll now be presented with a canvas where the selected template is loaded by default.
    
    :::image type="content" source="./media/how-to-workflow-business-terms-approval/workflow-authoring-canvas-inline.png" alt-text="Workflow authoring canvas, with the selected template workflow populated in the central workspace." lightbox="./media/how-to-workflow-business-terms-approval/workflow-authoring-canvas-expanded.png":::

1. The default template can be used as it is by just populating the approver’s email address in ‘Start and Wait for approval’ Connector. 

    :::image type="content" source="./media/how-to-workflow-business-terms-approval/add-approver-email-inline.png" alt-text="Workflow authoring canvas, with the start and wait for an approval step opened, and the Assigned to textbox highlighted." lightbox="./media/how-to-workflow-business-terms-approval/add-approver-email-expanded.png":::

    The default template has the following steps: 
    1. Trigger when a glossary term is created/updated/deleted/Import depending on the template selected.
    1. Approval connector
    1. Condition to check approval status 
        - If approved:
            1. CUD glossary term
            1. Send an email to requestor that their request is approved, and term CUD operation is successful.
        - If rejected:
            1. Send email to requestor that their request is denied. 

1. You can also modify the template by adding more connectors to suit your organizational needs by adding available connectors. Add a new step to the end of the template by selecting the **New step** button. Add steps between any already existing steps by selecting the arrow icon between any steps.

    :::image type="content" source="./media/how-to-workflow-business-terms-approval/modify-template-inline.png" alt-text="Workflow authoring canvas, with a + button highlighted on the arrow between the two top steps, and the Next Step button highlighted at the bottom of the workspace." lightbox="./media/how-to-workflow-business-terms-approval/modify-template-expanded.png":::

1. Once you're done with defining a workflow, you need to bind the workflow to a glossary hierarchy path. The binding implies that this workflow is triggered only for CUD operations within the glossary hierarchy path to which it's associated. A workflow can be bound to only one hierarchy path. To bind a workflow or to apply a scope to a workflow, you need to select ‘Apply workflow’. Select the scopes you want this workflow to be associated with and select ‘OK’.

    :::image type="content" source="./media/how-to-workflow-business-terms-approval/select-apply-workflow.png" alt-text="New data catalog workflow menu with the Apply Workflow button highlighted at the top of the workspace.":::

    :::image type="content" source="./media/how-to-workflow-business-terms-approval/select-okay.png" alt-text="Apply workflow window, showing a list of items that the workflow can be applied to. At the bottom of the window, the O K button is selected.":::

    >[!NOTE]
    > - Purview workflow engine will always resolve to the closest workflow to which the term hierarchy path is associated with. In case a direct binding is not found, it will traverse up in the tree to find the workflow associated with the closest parent in the glossary tree. 
    > - Import terms can only be bound to root glossary path as the .CSV can contain terms from different hierarchy paths.

1. By default, the workflow will be enabled. Finally select ‘Save and close’ to create and enable the workflow.

    :::image type="content" source="./media/how-to-workflow-business-terms-approval/workflow-enabled.png" alt-text="Workflow authoring page, showing the newly created workflow listed among all other workflows.":::

## Edit an existing workflow 

To modify an existing workflow by selecting the workflow and then select ‘Edit’ button. You'll be now presented with the canvas containing workflow definition. Modify the workflow and select ‘Save’ to commit changes.

:::image type="content" source="./media/how-to-workflow-business-terms-approval/select-edit.png" alt-text="Workflow authoring page, with the Edit button highlighted in the top menu.":::

## Disable a workflow

To disable a workflow, you can select the workflow and select ‘Disable’. You can also disable the workflow by clicking on ‘Edit’ and saving the workflow by changing the enable toggle in workflow canvas.

:::image type="content" source="./media/how-to-workflow-business-terms-approval/select-disable.png" alt-text="Workflow authoring page, with the Disable button highlighted in the top menu.":::

## Delete a workflow

To delete a workflow, select the workflow and select ‘Delete’.NET

:::image type="content" source="./media/how-to-workflow-business-terms-approval/select-delete.png" alt-text="Workflow authoring page, with the Delete button highlighted in the top menu.":::

## Limitations for business terms with approval workflow enabled  

* Non- Approved glossary terms aren't saved in Purview catalog. 
* The behavior of tagging terms to assets/schemas is same as of today that is, previously created draft terms can be tagged to assets/schemas. 

## Next steps

For more information about workflows, see these articles:

- [What are Azure Purview workflows](concept-workflow.md)
- [Self-service data access workflow for hybrid data estates](how-to-workflow-self-service-data-access-hybrid.md)
- [Manage workflow requests and approvals](how-to-workflow-manage-requests-approvals.md)
