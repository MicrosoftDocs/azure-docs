---
title: Self-service hybrid data access workflows
description: This article describes how to create and manage hybrid self-service data access workflows in Microsoft Purview.
author: nayenama
ms.author: nayenama
ms.service: purview
ms.subservice: purview-workflows
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 03/09/2022
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# Self-service access workflows for hybrid data estates

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

You can use [workflows](concept-workflow.md) to automate some business processes through Microsoft Purview. Self-service access workflows allow you to create a process for your users to request access to datasets they've discovered in Microsoft Purview.

Let's say your team has a new data analyst who will do some business reporting. You add that data analyst to your department's collection in Microsoft Purview. From there, they can browse through the data assets and read descriptions about the data your department has available. 

The data analyst notices that one of the Azure Data Lake Storage Gen2 accounts seems to have the exact data that they need to get started. Because a self-service access workflow has been set up for that resource, they can [request access](how-to-request-access.md) to that Azure Data Lake Storage account from within Microsoft Purview.

:::image type="content" source="./media/how-to-workflow-self-service-data-access-hybrid/request-access.png" alt-text="Screenshot of a data asset's overview page, with the button for requesting access highlighted.":::

You can create these workflows for any of your resources across your data estate to automate the access request process. Workflows are assigned at the [collection](reference-azure-purview-glossary.md#collection) level, so they automate business processes along the same organizational lines as your permissions.

This guide will show you how to create and manage self-service access workflows in Microsoft Purview.

>[!NOTE]
> To create or edit a workflow, you'll need the [workflow admin role](catalog-permissions.md) in Microsoft Purview. You can also contact the workflow admin in your collection, or reach out to your collection administrator, for permissions.

## Create and enable the self-service access workflow

1. Sign in to [the Microsoft Purview governance portal](https://web.purview.azure.com/resource/) and select the management center. Three new icons appear in the table of contents.

    :::image type="content" source="./media/how-to-workflow-self-service-data-access-hybrid/workflow-section.png" alt-text="Screenshot that shows the management center left menu with the new workflow section highlighted.":::

1. To create new workflows, select **Authoring**. This step takes you to the workflow authoring experience.

    :::image type="content" source="./media/how-to-workflow-self-service-data-access-hybrid/workflow-authoring-experience.png" alt-text="Screenshot that shows the authoring workflows page and a list of all workflows.":::

    >[!NOTE]
    >If the **Authoring** tab is unavailable, you don't have the permissions to author workflows. You need the [workflow admin role](catalog-permissions.md).

1. To create a new self-service workflow, select the **+New** button.

    :::image type="content" source="./media/how-to-workflow-self-service-data-access-hybrid/workflow-authoring-select-new.png" alt-text="Screenshot that shows the authoring workflows page, with the + New button highlighted.":::

1. You're presented with categories of workflows that you can create in Microsoft Purview. To create an access request workflow, select **Governance**, and then select **Continue**.

    :::image type="content" source="./media/how-to-workflow-self-service-data-access-hybrid/select-governance.png" alt-text="Screenshot that shows the new workflow window, with the Governance option selected.":::

1. The next screen shows all the templates that Microsoft Purview provides to create a self-service data access workflow. Select the **Data access request** template, and then select **Continue**.

    :::image type="content" source="./media/how-to-workflow-self-service-data-access-hybrid/select-data-access-request.png" alt-text="Screenshot that shows the new workflow window, with the Data access request option selected.":::

1. Enter workflow a name and optionally add a description. Then select **Continue**.

    :::image type="content" source="./media/how-to-workflow-self-service-data-access-hybrid/name-and-continue.png" alt-text="Screenshot that shows the new workflow window, with a name entered in the textbox.":::

1. You're presented with a canvas where the selected template is loaded by default.

    :::image type="content" source="./media/how-to-workflow-self-service-data-access-hybrid/workflow-canvas-inline.png" alt-text="Screenshot that shows the workflow canvas with the selected template workflow steps displayed." lightbox="./media/how-to-workflow-self-service-data-access-hybrid/workflow-canvas-expanded.png":::

    The template has the following steps: 
    1. Trigger when a data access request is made. 
    1. Get an approval connector that specifies a user or group that will be contacted to approve the request.
    
   Assign Data owners as approvers. Using the dynamic variable **Asset.Owner** as approvers in the approval connector will send approval requests to the data owners on the entity. 
   
    >[!Note]
    > Because entities might not have the data owner field populated, using the **Asset.Owner** variable might result in errors if no data owner is found. 
    
1. If the condition to check approval status is approved, take the following steps: 
           
    * If a data source is registered for [data use management](how-to-enable-data-use-governance.md) with the policy:
       1. Create a [self-service policy](concept-self-service-data-access-policy.md). 
       1. Send email to the requestor that access is provided. 
    * If a data source isn't registered with policy:
       1. Task a connector to assign [a task](how-to-workflow-manage-requests-approvals.md#tasks) to a user or an Azure Active Directory group to manually provide access to the requestor. 
       1. Send an email to requestor to explain that access is provided after the task is marked as complete. 
    
    If the condition to check approval status is rejected, send an email to requestor that the data access request is denied.

1. The default template can be used as it is by populating two fields:  
    * Adding an approver's email address or Microsoft Azure Active Directory group in **Start and Wait for approval** Connector 
    * Adding a user's email address or Microsoft Azure Active Directory group in **Create task** connector to denote who is responsible for manually providing access if the source isn't registered with policy.

    :::image type="content" source="./media/how-to-workflow-self-service-data-access-hybrid/required-fields-for-template-inline.png" alt-text="Screenshot that shows the workflow canvas with the start and wait for an approval step, and the Create Task and wait for task completion steps highlighted, and the Assigned to textboxes highlighted within those steps." lightbox="./media/how-to-workflow-self-service-data-access-hybrid/required-fields-for-template-expanded.png":::

    > [!NOTE]
    > Please configure the workflow to create self-service policies ONLY for sources supported by Microsoft Purview's policy feature. To see what's supported by policy, check the [Data owner policies documentation](tutorial-data-owner-policies-storage.md).
    >
    > If your source isn't supported by Microsoft Purview's policy feature, use the Task connector to assign [tasks](how-to-workflow-manage-requests-approvals.md#tasks) to users or groups that can provide access.

1. You can also modify the template by adding more connectors to suit your organizational needs. 

    :::image type="content" source="./media/how-to-workflow-self-service-data-access-hybrid/more-connectors-inline.png" alt-text="Screenshot that shows the workflow authoring canvas, with a + button highlighted on the arrow between the two top steps, and the Next Step button highlighted at the bottom of the workspace." lightbox="./media/how-to-workflow-self-service-data-access-hybrid/more-connectors-expanded.png":::

1. Once you're done defining a workflow, you need to bind the workflow to a collection hierarchy path. The binding (or scoping) implies that this workflow is triggered only for data access requests in that collection. To bind a workflow or to apply a scope to a workflow, you need to select **Apply workflow**. Select the scope you want this workflow to be associated with and select **OK**.

    :::image type="content" source="./media/how-to-workflow-self-service-data-access-hybrid/apply-workflow.png" alt-text="Screenshot that shows the workflow workspace with a list of items on the menu for applying a workflow.":::

    >[!NOTE]
    > Purview workflow engine will always resolve to the closest workflow that the collection hierarchy path is associated with. In case a direct binding is not found, it will traverse up in the tree to find the workflow associated with the closest parent in the collection tree.

1. By default, the workflow will be enabled. You can disable by selecting the Enable toggle.
1. Finally select **Save and close** to create and enable the workflow.

    :::image type="content" source="./media/how-to-workflow-self-service-data-access-hybrid/completed-workflows.png" alt-text="Screenshot that shows the workflow authoring page with the newly created workflow listed among the other workflows.":::

## Edit an existing workflow

To modify an existing workflow, select the workflow and then select the **Edit** button. You'll now be presented with the canvas containing workflow definition. Modify the workflow and select **Save** to commit changes.

:::image type="content" source="./media/how-to-workflow-self-service-data-access-hybrid/select-edit.png" alt-text="Screenshot that shows the workflow authoring page, with the Edit button highlighted in the top menu.":::

## Disable a workflow

To disable a workflow, you can select the workflow and then select **Disable**. You can also disable the workflow by selecting **Edit** and changing the enable toggle in workflow canvas then saving.

:::image type="content" source="./media/how-to-workflow-self-service-data-access-hybrid/select-disable.png" alt-text="Screenshot that shows the workflow authoring page, with the Disable button highlighted in the top menu.":::

## Delete a workflow

To delete a workflow, select the workflow and then select **Delete**.

:::image type="content" source="./media/how-to-workflow-self-service-data-access-hybrid/select-delete.png" alt-text="Screenshot that shows the workflow authoring page, with the Delete button highlighted in the top menu.":::

## Next steps

For more information about workflows, see these articles:

- [Workflows in Microsoft Purview](concept-workflow.md)
- [Approval workflow for business terms](how-to-workflow-business-terms-approval.md)
- [Manage workflow requests and approvals](how-to-workflow-manage-requests-approvals.md)

