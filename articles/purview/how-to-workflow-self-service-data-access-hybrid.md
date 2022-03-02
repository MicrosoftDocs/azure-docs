---
title: Self-service hybrid data access workflows
description: This article describes how to create and manage hybrid self-service data access workflows in Azure Purview.
author: nayenama
ms.author: nayenama
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 03/01/2022
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# Self-service data access workflows for hybrid data estates

This guide will take you through the creation and management of Self-Service data access workflow for hybrid data estate. 

## Create and enable self-service data access workflow

1. Sign in to Azure Purview studio and select the Management center. You'll see two new icons in the table of contents. 

1. To create new workflows, select Workflows. This will take you to the workflow authoring experiences.  

1. To create a new self-service workflow, select ‘+New’ button and you'll be presented with different categories of workflows in Purview. To create ‘Approval workflows for business terms’ Select ‘Governance’ and select ‘Continue’.

1. In the next screen, you'll see all the templates provided by Azure Purview to create a self-service data access workflow. Select the template ‘Data access request’ and select ‘Continue’. 

1. You'll now be presented with a window where you need to enter workflow name and optionally add a description. Once you've populated the same, select ‘Continue’. 

1. You'll now be presented with a canvas where the selected template is loaded by default.  

1. The template has the following steps: 
    1. Trigger when a data access request is made. 
    1. Approval connector 
    1. Condition to check approval status 
        - If approved:
            1. Condition to check if data source is registered for use governance (policy) 
                1. If a data source is registered with policy:
                    1. Create self-service policy 
                    1. Send email to requestor that access is provided 
                1. If data source isn't registered with policy:
                    1. Task connector to assign a task to a user or Microsoft Azure Active Directory group to manually provide access to requestor. 
                    1. Send an email to requestor that access is provided once the task is complete. 
        - If rejected:
            1. Send an email to requestor that data access request is denied.
1. The default template can be used as it is by just populating two fields  
    1. The approver’s email address or Microsoft Azure Active Directory group in ‘Start and Wait for approval’ Connector 
    1. User email address or Microsoft Azure Active Directory group in ‘Create task’ connector who is responsible for manually providing access if the source isn't registered with policy. 
1. You can also modify the template by adding more connectors to suit your organizational needs by adding available connectors. 
1. Once you're done with defining a workflow, you need to bind the workflow to collection hierarchy path. The binding implies that this workflow is triggered only for data access requests in that collection. To bind a workflow or to apply a scope to a workflow, you need to select on ‘Apply workflow’. Select the scopes you want this workflow to be associated with and select ‘OK’. 
    >[!NOTE]
    > Purview workflow engine will always resolve to the closest workflow to which the collection hierarchy path is associated with. In case a direct binding is not found, it will traverse up in the tree to find the workflow associated with the closest parent in the collection tree.
1. By default, the workflow will be enabled. Finally select on ‘Save and close’ to create and enable the workflow. 

## Edit an existing workflow

To modify an existing workflow by selecting the workflow and then select on ‘Edit’ button. You'll now be presented with the canvas containing workflow definition. Modify the workflow and select on ‘Save’ to commit changes.

## Disable a workflow

To disable a workflow, you can select the workflow and select ‘Disable’. You can also disable the workflow by clicking on ‘Edit’ and saving the workflow by changing the enable toggle in workflow canvas. 

## Delete a workflow

To delete a workflow, select the workflow and select on ‘Delete’.

## Next steps

For more information about workflows, see these articles:

- [What are Azure Purview workflows](concept-workflow.md)
- [Approval workflow for business terms](how-to-workflow-business-terms-approval.md)
- [Manage workflow requests and approvals](how-to-workflow-manage-requests-approvals.md)
