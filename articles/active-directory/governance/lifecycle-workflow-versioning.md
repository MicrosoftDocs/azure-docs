---
title: Workflow Versioning - Azure Active Directory
description: An article discussing Lifecycle workflow versioning and history
author: owinfreyATL
ms.author: owinfrey
ms.service: active-directory
ms.workload: identity
ms.topic: conceptual 
ms.date: 07/06/2022
ms.custom: template-concept
---

# Workflow versioning



Workflows created using Lifecycle Workflows can be updated as needed to satisfy the needs of users as they move through their lifecycle in your organization. To manage updates in workflows, Lifecycle Workflows introduce the concept of workflow versioning and history. Understanding how workflow versioning is handled during the update process allows you to strategically set up workflows so that workflows tasks and conditions are always relevant for users the workflow runs for.


## Workflow properties that won't trigger the creation of a new workflow version

While updates to workflows created using Lifecycle Workflows can trigger the creation of a new version, this isn't always the case. There are parameters of workflows, known as basic properties, that can be updated without a new version of the workflow being created. The list of these parameters, as shown in the API, are as follows:


|parameter  |description  |
|---------|---------|
|displayName     | A unique string that identifies the workflow.        |
|description     | A string that describes the purpose of the workflow for administrative use. (Optional) |
|isEnabled     | A boolean value that denotes whether the workflow is set to run or not. If set to “true" then the workflow can run as on schedule, or be run on demand.        |
|IsSchedulingEnabled  | A Boolean value that denotes whether scheduling is enabled or not. Unlike isEnbaled, a workflow can still be run on demand if this value is set to false.        |


You'll find these corresponding parameters in the Azure portal under the **Properties** section of the workflow you're updating. For a step by step guide on updating these properties using both the Azure portal and the API via Microsoft Graph, see: [Manage workflow properties](manage-workflow-properties.md).

## Workflow properties that will trigger the creation of a new workflow version

Updates made to argument properties of a workflow will trigger the creation of a new version of that workflow. These arguments in the API include:


|parameters  |description  |
|---------|---------|
|tasks     | An argument in a workflow that has a unique displayName and a description. It defines the specific tasks to be executed in the workflow.         |
|executionConditions     | An argument defining when and for who the workflow will run.        |

Unlike 

While new versions of these workflows are made as soon as you make the updates in the Azure portal, making a new version of a workflow using the API with Microsoft Graph requires running the workflow creation call again with the changes included. For a step by step guide for both processes, see: [Manage Workflow Versions](manage-workflow-tasks.md).

## What information is contained in workflow version history

Unlike with just changing basic properties of a workflow, newly created workflow versions can be radically different from previous versions. Workflows can be added or removed, and who even for the workflow runs can be very different. Due to the vast changes that can happen to a workflow between versions, version information is also there to give detailed information about not only the current version of the workflow, but also its previous iterations.

Information contained in version information as shown in the Azure portal:

:::image type="content" source="media/lifecycle-workflow-versioning/lcw-workflow-version-information.png" alt-text="lcw workflow versioning information":::


Detailed **Version information** are as follows:


|parameter  |description  |
|---------|---------|
|Version Number     | An integer denoting which version of the workflow the information is for. Sequentially goes up with each new workflow version. This parameter is version specific.        |
|Last modified date     | The last time the workflow was updated. If a new version of a workflow is created, this time will still show the creation time of the newest version of the workflow. This parameter isn't version specific.        |
|Last modified by     | Who last modified this workflow. Not dependent on workflow version.        |
|Created date     |  The date and time for when a workflow version was created. This parameter is version specific.     |
|Created by     | Who created this specific version of the workflow. This parameter is version specific.        |


Detailed information for **BASICS** information are as follows:


|parameter  |description  |
|---------|---------|
|Name     | Name of the workflow at this version. This is version specific.        |
|Description     | Description of the workflow at this version. This is version specific.        |
|Category     | Category of the workflow. This isn't editable.      |
|Trigger type     | The trigger type for the workflow. This is version specific        |
|Days from event     | Number of days before or after event timing. This is version specific. Won't appear if the trigger type is set to on-demand.        |
|Event timing     | Defines timing as before or after the days from event parameter. This is version specific. Won't appear if the trigger type is set to on-demand.        |
|Event user attribute     | Attribute used for the trigger. Not editable and is version specific. Won't appear if the trigger type is set to on-demand.        |

Detailed information for **Configure** information are as follows:

> [!NOTE]
> If the workflow is on-demand, the configure information will not be present.


|parameter  |description  |
|---------|---------|
|Scope type     | The user scope for executing the workflow.        |
|Rule     |  Rules for the scope for executing a workflow.       |



For the **Review tasks** section you'll see a list of tasks included in the specific version of the workflow, and their enabled status. For specific task definitions, see: [Lifecycle Workflow tasks and definitions](lifecycle-workflow-tasks.md).


## Next steps

- [Manage workflow Properties (Preview)](manage-workflow-properties.md)
- [Manage workflow versions (Preview)](manage-workflow-tasks.md)

