---
title: Workflows in Azure Purview
description: This article describes workflows in Azure Purview, the roles they play, and who can create and manage them.
author: nayenama
ms.author: nayenama
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: conceptual #Required; leave this attribute/value as-is.
ms.date: 03/04/2022
ms.custom: template-concept
---

# Workflows in Azure Purview

Workflows enable Azure Purview customers to orchestrate the CUD operations, validation, and approval of data entities using repeatable business processes that result in high quality data, policy compliance, user collaboration, and change awareness across their organization.  

Workflows empower our customers to achieve data quality with more control and less effort, because they won't need to use manual controls like emails or worksheets to review and approve the changes to entities in their catalog.

## Types of Workflows

- **User defined**: Workflows defined by the customer based on their organizational needs for governance process in Purview. For example, approval workflow for CUD operation of glossary terms, approval flow for publishing a Purview policy.
- **System defined**: Workflows built into the Purview platform for governance of Purview processes such as requesting access to Purview Studio.

## Who can manage workflows?
Users with ‘Workflow Admin’ role assign to a collection can manage ‘Self-service data access for hybrid data estate’ workflows for that collection. 

Users with ‘Workflow Admin’ role assign to any collection can manage ‘Approval workflows for business terms’ for Azure Purview catalog. 

## Who can create self-service data access workflows?

A new role ‘Workflow Admin’ is being introduced with workflow functionality.  

A ‘Workflow Admin’ defined for a collection can create self-service workflows and bind to the collection they have access to. 

A ‘Workflow Admin’ defined for any collection can create approval workflow for business glossary and bind the same to glossary hierarchy path. 

## Workflow Templates
For all the different types of user defined workflows enabled and available for your use, Azure Purview will provide templates to assist workflow admin to create and enable workflows easily instead of building it from scratch. The goal of templates is to bootstrap the workflow authoring experiences. However, a workflow admin can customize the template to meet the requirements in their organization. 

## Workflow binding (Scope)
Once a workflow is created and enabled, it can be bound to a scope. This gives you the flexibility to have different workflows for different areas/departments in your organization.   

If there's no workflow directly associated with a scope, the workflow engine will traverse upward in the hierarchy to determine closest workflow.  For example, AdatumCorp’ Purview account has the following collection hierarchy: 

Root Collection > Sales | Finance | Marketing


Root collection has a workflow ‘Self-Service data access default workflow’ defined and bound, Finance collection has ‘Self-Service data access for finance collection’ bound whereas w ‘Self-Service data access for sales collection’ is bound to ‘Sales’ collection. Marketing collection has no workflows directly bound. In the above setup, when a request access is made for a data asset in Finance collection, ‘Self-Service data access for finance collection’ workflow is run. However, when a request access is made for a data asset in Marketing collection, ‘Self-Service data access default workflow’ is triggered. The reason being there are no workflows bound at ‘Marketing’ scope but the parent of ‘Marketing', which is ‘Root collection’, has a workflow associated with it. 

## Workflow actions
Workflow connectors are a common set of actions applicable across all workflows. They can be used in any workflow in Azure Purview. The current available connectors are: 

1. Approval connector – Ability to generate approval requests and assign the same to individual users or Microsoft Azure Active Directory groups. 

    Azure Purview workflow approval connector currently supports two types of approval types: 
    * First to Respond – This implies that the first approver’s outcome (Approve/Reject) is considered final. 
    * Everyone must approve – This implies everyone identified as approver must approve the term to be considered ‘Approved’. 

1. Task Connector - Ability to create, assign and track a task to a user or Azure AD group as part of workflow.  

1. Send Email – Ability to send emails as part of workflow 

## Next steps

Now that you understand what workflows are, you can follow these guides to use them in your Azure Purview account:
- [Self-service data access workflow for hybrid data estates](how-to-workflow-self-service-data-access-hybrid.md)
- [Approval workflow for business terms](how-to-workflow-business-terms-approval.md)
- [Manage workflow requests and approvals](how-to-workflow-manage-requests-approvals.md)

