---
title: Workflows in Microsoft Purview
description: This article describes workflows in Microsoft Purview, the roles they play, and who can create and manage them.
author: nayenama
ms.author: nayenama
ms.service: purview
ms.subservice: purview-workflows
ms.topic: conceptual
ms.date: 10/17/2022
ms.custom: template-concept
---

# Workflows in Microsoft Purview

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

Workflows are automated, repeatable business processes that users can create within Microsoft Purview to validate and orchestrate CUD (create, update, delete) operations on their data entities. Enabling these processes allow organizations to track changes, enforce policy compliance, and ensure quality data across their data landscape.

Since the workflows are created and managed within Microsoft Purview, manual change monitoring or approval are no longer required to ensure quality updates to the data catalog.

## What are workflows?

Workflows are automated processes that are made up of [connectors](#workflow-connectors) that contain a common set of pre-established actions and are run when specified operations occur in your data catalog.

For example: A user attempts to delete a business glossary term that is bound to a workflow. When the user submits this operation, the workflow runs through its actions instead of, or before, the original delete operation.

Workflow [actions](#workflow-connectors) include things like generating approval requests or sending a notification, that allow users to automate validation and notification systems across their organization.

Currently, there are two kinds of workflows:

* **Data governance** - for data policy, access governance, and loss prevention. [Scoped](#workflow-scope) at the collection level.
* **Data catalog** - to manage approvals for CUD (create, update, delete) operations for glossary terms. [Scoped](#workflow-scope) at the glossary level.

These workflows can be built from pre-established [workflow templates](#workflow-templates) provided in the Microsoft Purview governance portal, but are fully customizable using the available workflow connectors.


## Workflow templates

For all the different types of user defined workflows enabled and available for your use, Microsoft Purview provides templates to help [workflow administrators](#who-can-manage-workflows) create workflows without needing to build them from scratch. The templates are built into the authoring experience and automatically populate based on the workflow being created, so there's no need to search for them.

Templates are available to launch the workflow authoring experience. However, a workflow admin can customize the template to meet the requirements in their organization. 

## Workflow connectors

Workflow connectors are a common set of actions applicable across some workflows. They can be used in any workflow in Microsoft Purview to create processes customized to your organization. To view the list of existing workflow connectors in Microsoft Purview, see [Workflow connectors](how-to-use-workflow-connectors.md).

## Workflow scope

Once a workflow is created and enabled, it can be bound to a particular scope. This gives you the flexibility to run different workflows for different areas/departments in your organization.

Data governance workflows are scoped to collections, and can be bound to the root collection to govern the whole Microsoft Purview catalog, or any subcollection.

Data catalog workflows are scoped to the glossary and can be bound to the entire glossary, any single term, or any parent term to manage child-terms.

If there's no workflow directly associated with a scope, the workflow engine will traverse upward in the scope hierarchy to determine closest workflow, and run that workflow for the operation.  

For example, the AdatumCorp Purview account has the following collection hierarchy: 

Root Collection > Sales | Finance | Marketing

- **Root collection** has the workflow _Self-Service data access default workflow_ defined and bound.
- **Sales** has _Self-Service data access for sales collection_ defined and bound.
- **Finance** has _Self-Service data access for finance collection_ defined and bound.
- **Marketing** has no workflows directly bound. 

In the above setup, when an access request is made for a data asset in Finance collection, the _Self-Service data access for finance collection_ workflow is run. 

However, when a request access is made for a data asset in Marketing collection, _Self-Service data access default workflow_ is triggered. Because there are no workflows bound at the Marketing scope, the workflow engine traverses to the next level in the scope hierarchy, which is Marketing's parent: the root collection. The workflow at the parent scope, the root collection scope, is run.

## Who can manage workflows?

A new role, **Workflow Admin** is being introduced with workflow functionality.  

A Workflow admin defined for a collection can create self-service workflows and bind these workflows to the collections they have access to. 

A Workflow admin defined for any collection can create approval workflows for the business glossary. In order to bind the glossary workflows to a term you need to have at least [Data reader permissions](catalog-permissions.md).

## Next steps

Now that you understand what workflows are, you can follow these guides to use them in your Microsoft Purview account:

- [Self-service data access workflow for hybrid data estates](how-to-workflow-self-service-data-access-hybrid.md)
- [Approval workflow for business terms](how-to-workflow-business-terms-approval.md)
- [Manage workflow requests and approvals](how-to-workflow-manage-requests-approvals.md)

