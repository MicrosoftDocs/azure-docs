---
title: Self-service hybrid data access workflows
description: This article describes how to create and manage hybrid self-service data access workflows in Microsoft Purview.
author: nayenama
ms.author: nayenama
ms.service: purview
ms.subservice: purview-workflows
ms.topic: how-to
ms.date: 02/20/2023
ms.custom: template-how-to
---

# Self-service access workflows for hybrid data estates

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

You can use [workflows](concept-workflow.md) to automate some business processes through Microsoft Purview. Self-service access workflows allow you to create a process for your users to request access to datasets they've discovered in Microsoft Purview.

Let's say your team has a new data analyst who will do some business reporting. You add that data analyst to your department's collection in Microsoft Purview. From there, they can browse through the data assets and read descriptions about the data that your department has available. 

The data analyst notices that one of the Azure Data Lake Storage Gen2 accounts seems to have the exact data that they need to get started. Because a self-service access workflow has been set up for that resource, they can [request access](how-to-request-access.md) to that Azure Data Lake Storage account from within Microsoft Purview.

:::image type="content" source="./media/how-to-workflow-self-service-data-access-hybrid/request-access.png" alt-text="Screenshot of a data asset's overview page, with the button for requesting access highlighted.":::

You can create these workflows for any of your resources across your data estate to automate the access request process. Workflows are assigned at the [collection](reference-azure-purview-glossary.md#collection) level, so they automate business processes along the same organizational lines as your permissions.

This guide shows you how to create and manage self-service access workflows in Microsoft Purview.

>[!NOTE]
> To create or edit a workflow, you need the [workflow admin role](catalog-permissions.md) in Microsoft Purview. You can also contact the workflow admin in your collection, or reach out to your collection administrator, for permissions.

## Create and enable the self-service access workflow

1. Sign in to [the Microsoft Purview governance portal](https://web.purview.azure.com/resource/) and select the management center. Three new icons appear in the table of contents.

    :::image type="content" source="./media/how-to-workflow-self-service-data-access-hybrid/workflow-section.png" alt-text="Screenshot that shows the management center menu with the new workflow section highlighted.":::

1. To create new workflows, select **Authoring**. This step takes you to the workflow authoring experience.

    :::image type="content" source="./media/how-to-workflow-self-service-data-access-hybrid/workflow-authoring-experience.png" alt-text="Screenshot that shows the page for authoring workflows and a list of all workflows.":::

    >[!NOTE]
    >If the **Authoring** tab is unavailable, you don't have the permissions to author workflows. You need the [workflow admin role](catalog-permissions.md).

1. To create a new self-service workflow, select the **+New** button.

    :::image type="content" source="./media/how-to-workflow-self-service-data-access-hybrid/workflow-authoring-select-new.png" alt-text="Screenshot that shows the page for authoring workflows, with the New button highlighted.":::

1. You're presented with categories of workflows that you can create in Microsoft Purview. To create an access request workflow, select **Governance**, and then select **Continue**.

    :::image type="content" source="./media/how-to-workflow-self-service-data-access-hybrid/select-governance.png" alt-text="Screenshot that shows the new workflow panel, with the Governance option selected.":::

1. The next screen shows all the templates that Microsoft Purview provides to create a self-service data access workflow. Select the **Data access request** template, and then select **Continue**.

    :::image type="content" source="./media/how-to-workflow-self-service-data-access-hybrid/select-data-access-request.png" alt-text="Screenshot that shows the new workflow panel, with the data access request template selected.":::

1. Enter a workflow name, optionally add a description, and then select **Continue**.

    :::image type="content" source="./media/how-to-workflow-self-service-data-access-hybrid/name-and-continue.png" alt-text="Screenshot that shows the name and description boxes for a new workflow.":::

1. You're presented with a canvas where the selected template is loaded by default.

    :::image type="content" source="./media/how-to-workflow-self-service-data-access-hybrid/workflow-canvas-inline.png" alt-text="Screenshot that shows the workflow canvas with the selected template workflow steps displayed." lightbox="./media/how-to-workflow-self-service-data-access-hybrid/workflow-canvas-expanded.png":::

    The template has the following steps: 
    1. Trigger when a data access request is made. 
    1. Get an approval connector that specifies a user or group that will be contacted to approve the request.
    
   Assign data owners as approvers. Using the dynamic variable **Asset.Owner** as approvers in the approval connector will send approval requests to the data owners on the entity. 
   
    >[!Note]
    > Using the **Asset.Owner** variable might result in errors if an entity doesn't have a data owner. 
    
1. If the condition to check approval status is approved, take the following steps: 
           
    * If a data source is registered for [data use management](how-to-enable-data-use-governance.md) with the policy:
       1. Create a [self-service policy](concept-self-service-data-access-policy.md). 
       1. Send email to the requestor that confirms access. 
    * If a data source isn't registered with the policy:
       1. Use a connector to assign [a task](how-to-workflow-manage-requests-approvals.md#tasks) to a user or an Azure Active Directory (Azure AD) group to manually provide access to the requestor. 
       1. Send an email to requestor to explain that access is provided after the task is marked as complete. 
    
    If the condition to check approval status is rejected, send an email to the requestor to say that the data access request is denied.

1. You can use the default template as it is by populating two fields:  
    * Add an approver's email address or Azure AD group in the **Start and wait for an approval** connector. 
    * Add a user's email address or Azure AD group in the **Create task and wait for task completion** connector to denote who is responsible for manually providing access if the source isn't registered with the policy.

    :::image type="content" source="./media/how-to-workflow-self-service-data-access-hybrid/required-fields-for-template-inline.png" alt-text="Screenshot that shows the workflow canvas with the connector for starting an approval and the connector for creating a task, along with the text boxes for assigning them." lightbox="./media/how-to-workflow-self-service-data-access-hybrid/required-fields-for-template-expanded.png":::

    > [!NOTE]
    > Configure the workflow to create self-service policies only for sources that the Microsoft Purview policy supports. To see what the policy supports, check the [documentation about data owner policies](tutorial-data-owner-policies-storage.md).
    >
    > If the Microsoft Purview policy doesn't support your source, use the **Create task and wait for task completion** connector to assign [tasks](how-to-workflow-manage-requests-approvals.md#tasks) to users or groups that can provide access.

    You can also modify the template by adding more connectors to suit your organizational needs. 

    :::image type="content" source="./media/how-to-workflow-self-service-data-access-hybrid/more-connectors-inline.png" alt-text="Screenshot that shows the workflow authoring canvas, with the button for adding a connector and the button for saving the new conditions." lightbox="./media/how-to-workflow-self-service-data-access-hybrid/more-connectors-expanded.png":::

1. After you define a workflow, you need to bind the workflow to a collection hierarchy path. The binding (or scoping) implies that this workflow is triggered only for data access requests in that collection. 

   To bind a workflow or to apply a scope to a workflow, select **Apply workflow**. Select the scope that you want to associate with this workflow, and then select **OK**.

    :::image type="content" source="./media/how-to-workflow-self-service-data-access-hybrid/apply-workflow.png" alt-text="Screenshot that shows the workflow workspace with a list of items on the menu for applying a workflow.":::

    >[!NOTE]
    > The Microsoft Purview workflow engine will always resolve to the closest workflow that the collection hierarchy path is associated with. If the workflow engine doesn't find a direct binding, it will look for the workflow that's associated with the closest parent in the collection tree.

1. Make sure that the **Enable** toggle is on. The workflow should be enabled by default.
1. Select **Save and close** to create and enable the workflow.

   Your new workflow now appears in the list of workflows.

    :::image type="content" source="./media/how-to-workflow-self-service-data-access-hybrid/completed-workflows.png" alt-text="Screenshot that shows the workflow authoring page with the newly created workflow listed among the other workflows.":::

## Edit an existing workflow

To modify an existing workflow, select the workflow, and then select the **Edit** button. You're presented with the canvas that contains the workflow definition. Modify the workflow, and then select **Save** to commit the changes.

:::image type="content" source="./media/how-to-workflow-self-service-data-access-hybrid/select-edit.png" alt-text="Screenshot that shows the workflow authoring page, with the Edit button highlighted on the top menu.":::

## Disable a workflow

To disable a workflow, select the workflow, and then select **Disable**.

:::image type="content" source="./media/how-to-workflow-self-service-data-access-hybrid/select-disable.png" alt-text="Screenshot that shows the workflow authoring page, with the Disable button highlighted on the top menu.":::

Another way is to select the workflow, select **Edit**, turn off the **Enable** toggle in the workflow canvas, and then select **Save and close**.

## Delete a workflow

To delete a workflow, select the workflow, and then select **Delete**.

:::image type="content" source="./media/how-to-workflow-self-service-data-access-hybrid/select-delete.png" alt-text="Screenshot that shows the workflow authoring page, with the Delete button highlighted on the top menu.":::

## Next steps

For more information about workflows, see these articles:

- [Workflows in Microsoft Purview](concept-workflow.md)
- [Approval workflow for business terms](how-to-workflow-business-terms-approval.md)
- [Manage workflow requests and approvals](how-to-workflow-manage-requests-approvals.md)
- [Self-service access policies](concept-self-service-data-access-policy.md)
