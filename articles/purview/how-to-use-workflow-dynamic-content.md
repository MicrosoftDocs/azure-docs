---
title: Workflow dynamic content
description: This article describes how to use connectors in Purview dynamic content
author: zeinam
ms.author: zeinam
ms.service: purview
ms.subservice: purview-workflows
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 11/11/2022
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

#  Workflow dynamic content 

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

You can use dynamic content inside Microsoft Purview workflows to associate certain variables in the workflow. 

## Current workflow dynamic content

Currently, the following dynamic content options are available for a workflow connector in Microsoft Purview:

|Prerequisite connector  |Built-in dynamic content  |Functionality  |
|---------|---------|---------|
|When data access request is submitted |Workflow.Requestor |The requestor of the workflow |
| |Workflow.RequestRecepient |The request recipient of the workflow |
| |Asset.Name  |The name of the asset  |
| |Asset.Description |The description of the asset |
| |Asset.Type	|The type of the asset  |
| |Asset.FullyQualifiedName |The fully qualified name of the asset |
| |Asset.Owner	|The owner of the asset  |
| |Asset.Classification	|The display names of classifications of the asset |
| |Asset.Certified	|The indicator of whether the asset meets your organization's quality standards and can be regarded as reliable  |
|Start and wait for an approval |Approval.Outcome |The outcome of the approval  |
| |Approval.Assigned To  |The IDs of the approvers |
| |Approval.Comments |The IDs of the approvers |
|Check data source registration for data use governance |DataUseGovernance |The result of the data use governance check|
|When term creation request is submitted  |Workflow.Requestor |The requestor of the workflow  |
| |Term.Name |The name of the term |
| |Term.Formal Name  |The formal name of the term |
| |Term.Definition	|The definition of the term  |
| |Term.Experts	|The experts of the term |
| |Term.Stewards |The stewards of the term  |
| |Term.Parent.Name	|The name of parent term if exists |
| |Term.Parent.Formal Name |The formal name of parent term if exists  |
|When term update request is submitted <br> When term deletion request is submitted |	Workflow.Requestor  |The requestor of the workflow  |
| |Term.Name |The name of the term  |
| |Term.Formal Name	|The formal name of the term |
| |Term.Definition	|The definition of the term  |
| |Term.Experts	|The experts of the term |
| |Term.Stewards	|The stewards of the term  |
| |Term.Parent.Name	|The name of parent term if exists |
| |Term.Parent.Formal Name	|The formal name of parent term if exists  |
| |Term.Created By	|The creator of the term |
| |Term.Last Updated By	|The last updator of the term  |
|When term import request is submitted	|Workflow.Requestor	|The requestor of the workflow |
| |Import File.Name  |The name of the file to import  |

## Next steps

For more information about workflows, see these articles:

- [Workflows in Microsoft Purview](concept-workflow.md)
- [Approval workflow for business terms](how-to-workflow-business-terms-approval.md)
- [Manage workflow requests and approvals](how-to-workflow-manage-requests-approvals.md)
