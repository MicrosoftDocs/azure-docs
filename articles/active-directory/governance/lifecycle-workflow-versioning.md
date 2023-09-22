---
title: Workflow Versioning
description: An article discussing Lifecycle workflow versioning and history
author: owinfreyATL
ms.author: owinfrey
manager: amycolannino
ms.service: active-directory
ms.subservice: compliance
ms.workload: identity
ms.topic: conceptual 
ms.date: 05/31/2023
ms.custom: template-concept
---

# Lifecycle Workflows Versioning



Workflows created using Lifecycle Workflows can be updated as needed to satisfy organizational requirements in terms of auditing the lifecycle of users in your organization. To manage updates in workflows, Lifecycle Workflows introduce the concept of workflow versioning. Workflow versions are new versions of existing workflows, triggered by updating execution conditions or its tasks. Workflow versions can change the actions or even scope of an existing workflow.  Understanding how workflow versioning is handled during the workflow update process allows you to strategically set up workflows so that workflows tasks, and conditions, are always relevant for users processed by a workflow.


## Versioning benefits

Versioning with Lifecycle Workflows provides many benefits over the alternative of creating a new workflow for each use case. These benefits show up in its ability to improve the reporting process for both troubleshooting, and record keeping, capabilities in the following ways:

- **Long-term retention**- Versioning allows for longer retention of workflow information than by only using the audit logs. While the audit logs only store information from the previous 30 days, with versioning you're able to keep track of workflow details from creation.
- **Traceability**- Allows tracking of which specific version of a workflow processed a user.

## Workflow properties and versions

While updates to workflows can trigger the creation of a new version, this isn't always the case. There are parameters of workflows known as basic properties, that 's changeable without creating a new version of the workflow. The list of these parameters are as follows:

- displayName     
- description    
- isEnabled    
- IsSchedulingEnabled  
- task name
- task description


You'll find these corresponding parameters in the Microsoft Entra admin center under the **Properties** section of the workflow you're updating.
:::image type="content" source="media/lifecycle-workflow-versioning/basic-updateable-properties.png" alt-text="Screenshot of updated basic properties LCW" lightbox="media/lifecycle-workflow-versioning/basic-updateable-properties.png":::

For a step by step guide on updating these properties using both the Microsoft Entra admin center and the API via Microsoft Graph, see: [Manage workflow properties](manage-workflow-properties.md).

Properties that will trigger the creation of a new version are as follows:

- tasks     
- executionConditions     
 


While new versions of these workflows are made as soon as you make the updates in the Microsoft Entra admin center, creating a new version of a workflow using the API with Microsoft Graph requires running the createNewVersion method. For a step by step guide for updating either tasks, or execution conditions, see: [Manage Workflow Versions](manage-workflow-tasks.md).

> [!NOTE]
> If the workflow is on-demand, the configure information associated with execution conditions will not be present.

## What details are contained in workflow version history

Unlike with changing basic properties of a workflow, newly created workflow versions can be vastly different from previous versions. Tasks can be added or removed, and who the workflow runs for can be different. Due to the vast changes that can happen to a workflow between versions, version details are also there to give detailed information about not only the current version of the workflow, but also its previous iterations.

Details contained in version information as shown in the Microsoft Entra admin center:

:::image type="content" source="media/lifecycle-workflow-versioning/workflow-version-information.png" alt-text="Screenshot of workflow versioning information.":::


Detailed **Version information** are as follows:


|parameter  |description  |
|---------|---------|
|Version Number     | An integer denoting which version of the workflow the information is for. Sequentially goes up with each new workflow version.        |
|Last modified date     | The last time the workflow was updated. For previous versions of workflows, the last modified date will always be the time the next version was created.      |
|Last modified by     | Who last modified this workflow version.      |
|Created date     |  The date and time for when a workflow version was created.   |
|Created by     | Who created this specific version of the workflow.       |
|Name     | Name of the workflow at this version.       |
|Description     | Description of the workflow at this version.      |
|Category     | Category of the workflow.      |
|Execution Conditions    | Defines for who and when the workflow runs in this version.     |
|Tasks   | The tasks present in this workflow version. If viewing through the API, you're also able to see task arguments. For specific task definitions, see: [Lifecycle Workflow tasks and definitions](lifecycle-workflow-tasks.md)    |



## Next steps

- [workflowVersion resource type](/graph/api/resources/identitygovernance-workflowversion?view=graph-rest-beta&preserve-view=true)
- [Manage workflow Properties](manage-workflow-properties.md)
- [Manage workflow versions](manage-workflow-tasks.md)

