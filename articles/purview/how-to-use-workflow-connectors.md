---
title: Workflow connectors
description: This article describes how to use connectors in Purview workflows
author: zeinam
ms.author: zeinam
ms.service: purview
ms.subservice: purview-workflows
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 10/14/2022
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

#  Workflow connectors 

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

You can use [workflows](concept-workflow.md) to automate some business processes through Microsoft Purview. A Connector in a workflow provides a way to connect to different systems and leverage a set of prebuilt actions and triggers.

Currently the following connectors are available for a workflow in Microsoft Purview:

|Connector Type  |Functionality  |Parameters  |Customizable  | Workflow templates |
|---------|---------|---------|---------|---------|
|Check data source registration for data use governance     |Validate if data source has been registered with Data Use Management enabled.         |None         |</li><li>Can be renamed: Yes</li><li>Can be deleted: Yes</li><li>Multiple per workflow</li></ul>         |Data access request         |
|Condition     |Evaluate a value to true or false. Based on the evaluation the workflow will be re-directed to different branches         |</li><li>Add row</li><li>Title</li><li>Add group</li></ul>         |</li><li>Can be renamed: Yes</li><li>Can be deleted: Yes</li><li>Multiple per workflow</li></ul>         |All workflows templates         |
|Create Glossary Term     |Create a new glossary term         |None         |</li><li>Can be renamed: Yes</li><li>Can be deleted: Yes</li><li>Multiple per workflow</li></ul>         |Create glossary term template         |
|Create task and wait for task completion     |Creates, assigns, and tracks a task to a user or Azure Active Directory group as part of a workflow         |</li><li>Assigned to</li><li>Task title</li><li>Task body</li></ul>         |</li><li>Can be renamed: Yes</li><li>Can be deleted: Yes</li><li>Multiple per workflow</li></ul>         |All workflows templates         |
|Delete glossary term     |Delete an existing glossary term         |None         |</li><li>Can be renamed: Yes</li><li>Can be deleted: Yes</li><li>Multiple per workflow</li></ul>         |Delete glossary term         |
|Grant access     |Create an access policy to grant access to the requested user.         |None         |</li><li>Can be renamed: Yes</li><li>Can be deleted: Yes</li><li>Multiple per workflow</li></ul>         |Data access request         |
|Http     |Integrate with external applications through http or https call. <br> For more information, see [Workflows HTTP connector](how-to-use-workflow-http-connector.md)         |</li><li>Host</li><li>Method</li><li>Path</li><li>Headers</li><li>Queries</li><li>Body</li><li>Authentication</li></ul>         |</li><li>Can be renamed: Yes</li><li>Can be deleted: Yes</li><li>Settings: Secured Input and Secure outputs (Enabled by default)</li><li>Multiple per workflow</li></ul>         |All workflows templates         |
|Import glossary terms     |Import one or more glossary terms         |None        |</li><li>Can be renamed: Yes</li><li>Can be deleted: No</li><li>OMultiple per workflow</li></ul>         |Import terms         |
|Send email notification     |Send email notification to one or more recipients         |</li><li>Subject</li><li>Message body</li><li>Recipient</li></ul>         |</li><li>Can be renamed: Yes</li><li>Can be deleted: Yes</li><li>Settings: Secured Input and Secure outputs (Enabled by default)</li><li>Multiple per workflow</li></ul>         |All workflows templates         |
|Start and wait for an approval     |Generates approval requests and assign the requests to individual users or Microsoft Azure Active Directory groups. Microsoft Purview workflow approval connector currently supports two types of approval types: </li><li>First to Respond – This implies that the first approver's outcome (Approve/Reject) is considered final.</li><li>Everyone must approve – This implies everyone identified as an approver must approve the request for the request to be considered approved. If one approver rejects the request, regardless of other approvers, the request is rejected.</li></ul>         |</li><li>Approval Type</li><li>Title</li><li>Assigned To</li></ul>         |</li><li>Can be renamed: Yes</li><li>Can be deleted: Yes</li><li>Multiple per workflow</li></ul>         |All workflows templates         | 
|Update glossary term     |Update an existing glossary term         |None         |</li><li>Can be renamed: Yes</li><li>Can be deleted: Yes</li><li>Multiple per workflow</li></ul>         |Update glossary term         |
|When term creation request is submitted     |Triggers a workflow with all term details when a new term request is submitted         |None         |</li><li>Can be renamed: Yes</li><li>Can be deleted: No</li><li>Only one per workflow</li></ul>         |Create glossary term template         |
|When term deletion request is submitted     |Triggers a workflow with all term details when a request to delete an existing term is submitted         |None         |</li><li>Can be renamed: Yes</li><li>Can be deleted: No</li><li>Only one per workflow</li></ul>         |Delete glossary term         |
|When term Import request is submitted     |Triggers a workflow with all term details in a csv file, when a request to impot terms is submitted         |None         |</li><li>Can be renamed: Yes</li><li>Can be deleted: No</li><li>Only one per workflow</li></ul>         |Import terms         |
|When term update request is submitted     |Triggers a workflow with all term details when a request to update an existing term is submitted         |None         |</li><li>Can be renamed: Yes</li><li>Can be deleted: No</li><li>Only one per workflow</li></ul>         |Update glossary term       |

## Next steps

For more information about workflows, see these articles:

- [Workflows in Microsoft Purview](concept-workflow.md)
- [Approval workflow for business terms](how-to-workflow-business-terms-approval.md)
- [Manage workflow requests and approvals](how-to-workflow-manage-requests-approvals.md)
