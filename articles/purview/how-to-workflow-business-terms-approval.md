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

1. Sign in to the Azure Purview studio and select on Management center. You'll see two new icons in the table of contents. 
1. To create new workflows, select on Workflows. This will take you to the workflow authoring experiences.  
1. To create a new workflow, select on ‘+New’ button and you'll be presented with different categories of workflows in Purview. To create ‘Approval workflows for business terms’ Select ‘Data Catalog’ and select ‘Continue’
1. In the next screen, you'll see all the templates provided by Azure Purview to create a workflow. Select the template using which you want to start your authoring experiences and select on ‘Continue’. In the screenshot below we've selected ‘Create glossary term’.  The four different templates available for business glossary are:
    1. Create glossary term 
    1. Update glossary term 
    1. Delete glossary term 
    1. Import terms
1. You'll be now presented with a window where you need to enter workflow name and optionally add a description. Once you've populated the same, select ‘Continue’. 
1. You'll now be presented with a canvas where the selected template is loaded by default.  
1. The default template can be used as it is by just populating the approver’s email address in ‘Start and Wait for approval’ Connector. The default template has the following steps: 
    1. Trigger when a glossary term is created/updated/deleted/Import depending on the template selected.
    1. Approval connector
    1. Condition to check approval status 
        - If approved:
            1. CUD glossary term
            1. Send an email to requestor that their request is approved, and term CUD operation is successful.
        - If rejected:
            1. Send email to requestor that their request is denied. 
1. You can also modify the template by adding more connectors to suit your organizational needs by adding available connectors.
1. Once you're done with defining a workflow, you need to bind the workflow to a glossary hierarchy path. The binding implies that this workflow is triggered only for CUD operations within the glossary hierarchy path to which it's associated. A workflow can be bound to only one hierarchy path. To bind a workflow or to apply a scope to a workflow, you need to select on ‘Apply workflow’. Select the scopes you want this workflow to be associated with and select ‘OK’. 
    >[!NOTE]
    > - Purview workflow engine will always resolve to the closest workflow to which the term hierarchy path is associated with. In case a direct binding is not found, it will traverse up in the tree to find the workflow associated with the closest parent in the glossary tree. 
    > - Import terms can only be bound to root glossary path as the .CSV can contain terms from different hierarchy paths.
1. By default, the workflow will be enabled. Finally select on ‘Save and close’ to create and enable the workflow. 

## Edit an existing workflow 

To modify an existing workflow by selecting the workflow and then select on ‘Edit’ button. You'll be now presented with the canvas containing workflow definition. Modify the workflow and select on ‘Save’ to commit changes. 

## Disable a workflow

To disable a workflow, you can select the workflow and select ‘Disable’. You can also disable the workflow by clicking on ‘Edit’ and saving the workflow by changing the enable toggle in workflow canvas. 

## Delete a workflow

To delete a workflow, select the workflow and select on ‘Delete’ 

## Limitations for business terms with approval workflow enabled  

1. Non- Approved glossary terms aren't saved in Purview catalog. 
1. The behavior of tagging terms to assets/schemas is same as of today that is, previously created draft terms can be tagged to assets/schemas. 

## Next steps

For more information about workflows, see these articles:

- [What are Azure Purview workflows](concept-workflow.md)
- [Self-service data access workflow for hybrid data estates](how-to-workflow-self-service-data-access-hybrid.md)
- [Manage workflow requests and approvals](how-to-workflow-manage-requests-approvals.md)
