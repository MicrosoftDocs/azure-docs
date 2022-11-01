---
title: Workflow Templates and categories - Azure Active Directory
description: Conceptual article discussing workflow templates and categories with Lifecycle Workflows
author: owinfreyATL
ms.author: owinfrey
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.topic: conceptual 
ms.date: 07/06/2022
ms.custom: template-concept
---

# Lifecycle Workflows templates (Preview)


Lifecycle Workflows allows you to automate the lifecycle management process for your organization by creating workflows that contain both built-in tasks, and custom task extensions. These workflows, and the tasks within them, all fall into categories based on the Joiner-Mover-Leaver(JML) model of lifecycle management. To make this process even more efficient, Lifecycle Workflows also provide you templates, which you can use to accelerate the set up, creation, and configuration of common lifecycle management processes. You can create workflows based on these templates as is, or you can customize them even further to match the requirements for users within your organization. In this article you'll get the complete list of workflow templates, common template parameters, default template parameters for specific templates, and the list of compatible tasks for each template. For full task definitions, see [Lifecycle Workflow tasks and definitions](lifecycle-workflow-tasks.md).


## Lifecycle Workflow Templates

Lifecycle Workflows currently have six built-in templates you can use or customize:

:::image type="content" source="media/lifecycle-workflow-templates/templates-list.png" alt-text="Screenshot of a list of lifecycle workflow templates." lightbox="media/lifecycle-workflow-templates/templates-list.png":::

The list of templates are as follows:

- [Onboard pre-hire employee](lifecycle-workflow-templates.md#onboard-pre-hire-employee)
- [Onboard new hire employee](lifecycle-workflow-templates.md#onboard-new-hire-employee)
- [Real-time employee termination](lifecycle-workflow-templates.md#real-time-employee-termination)  
- [Pre-Offboarding of an employee](lifecycle-workflow-templates.md#pre-offboarding-of-an-employee)
- [Offboard an employee](lifecycle-workflow-templates.md#offboard-an-employee)
- [Post-Offboarding of an employee](lifecycle-workflow-templates.md#post-offboarding-of-an-employee)

For a complete guide on creating a new workflow from a template, see: [Tutorial: On-boarding users to your organization using Lifecycle workflows with Azure portal](tutorial-onboard-custom-workflow-portal.md).

### Onboard pre-hire employee

 The **Onboard pre-hire employee** template is designed to configure tasks that must be completed before an employee's start date.

:::image type="content" source="media/lifecycle-workflow-templates/onboard-pre-hire-template.png" alt-text="Screenshot of a Lifecycle Workflow onboard pre-hire template.":::

The default specific parameters and properties for the **Onboard pre-hire employee** template are as follows:



|parameter  |description  |Customizable  |
|---------|---------|---------|
|Category     |  Joiner       |  ❌       |
|Trigger Type     | Trigger and Scope Based        |  ❌       |
|Days from event     | -7        | ✔️        |
|Event timing     | Before        |  ❌       |
|Event User attribute     | EmployeeHireDate        |   ❌      |
|Scope type     | Rule based        | ❌        |
|Execution conditions     | (department eq 'Marketing')      |  ✔️       |
|Tasks     | **Generate TAP And Send Email**     |  ✔️       |


### Onboard new hire employee

The **Onboard new-hire employee** template is designed to configure tasks that will be completed on an employee's start date.

:::image type="content" source="media/lifecycle-workflow-templates/onboard-new-hire-template.png" alt-text="Screenshot of a Lifecycle Workflow onboard new hire template.":::

The default specific parameters for the **Onboard new hire employee** template are as follows:


|parameter  |description  |Customizable  |
|---------|---------|---------|
|Category     |  Joiner       |  ❌       |
|Trigger Type     | Trigger and Scope Based        |  ❌       |
|Days from event     | 0        | ✔️        |
|Event timing     | On        |  ❌       |
|Event User attribute     | EmployeeHireDate        |   ❌      |
|Scope type     | Rule based        | ❌        |
|Execution conditions     | (department eq 'Marketing')        |  ✔️       |
|Tasks     | **Add User To Group**, **Enable User Account**, **Send Welcome Email**      |  ✔️       |



### Real-time employee termination

The **Real-time employee termination** template is designed to configure tasks that will be completed immediately when an employee is terminated.

:::image type="content" source="media/lifecycle-workflow-templates/on-demand-termination-template.png" alt-text="Screenshot of a Lifecycle Workflow real time employee termination template.":::

The default specific parameters for the **Real-time employee termination** template are as follows:


|parameter  |description  |Customizable  |
|---------|---------|---------|
|Category     |  Leaver       |  ❌       |
|Trigger Type     | On-demand        |  ❌       |
|Tasks     | **Remove user from all groups**, **Delete User Account**, **Remove user from all Teams**      |  ✔️       |

> [!NOTE]
> As this template is designed to run on-demand, no execution condition is present.



### Pre-Offboarding of an employee

The **Pre-Offboarding of an employee** template is designed to configure tasks that will be completed before an employee's last day of work.

:::image type="content" source="media/lifecycle-workflow-templates/offboard-pre-employee-template.png" alt-text="Screenshot of a pre offboarding employee template.":::

The default specific parameters for the **Pre-Offboarding of an employee** template are as follows:


|parameter  |description  |Customizable  |
|---------|---------|---------|
|Category     |  Leaver       |  ❌       |
|Trigger Type     | Trigger and Scope Based        |  ❌       |
|Days from event     | 7        | ✔️        |
|Event timing     | Before        |  ❌       |
|Event User attribute     | employeeLeaveDateTime        |   ❌      |
|Scope type     | Rule based        | ❌        |
|Execution condition     | None       |  ✔️       |
|Tasks     | **Remove user from selected groups**, **Remove user from selected Teams**     |  ✔️       |




### Offboard an employee

The **Offboard an employee** template is designed to configure tasks that will be completed on an employee's last day of work.

:::image type="content" source="media/lifecycle-workflow-templates/offboard-employee-template.png" alt-text="Screenshot of an offboard employee template lifecycle workflow.":::

The default specific parameters for the **Offboard an employee** template are as follows:


|parameter  |description  |Customizable  |
|---------|---------|---------|
|Category     |  Leaver       |  ❌       |
|Trigger Type     | Trigger and Scope Based        |  ❌       |
|Days from event     | 0        | ✔️        |
|Event timing     | On        |  ❌       |
|Event User attribute     | employeeLeaveDateTime      |   ❌      |
|Scope type     | Rule based        | ❌        |
|Execution condition     | (department eq 'Marketing')        |  ✔️       |
|Tasks     | **Disable User Account**, **Remove user from all groups**, **Remove user from all Teams**     |  ✔️       |


### Post-Offboarding of an employee

The **Post-Offboarding of an employee** template is designed to configure tasks that will be completed after an employee's last day of work.

:::image type="content" source="media/lifecycle-workflow-templates/offboard-post-employee-template.png" alt-text="Screenshot of an offboarding an employee after last day template.":::

The default specific parameters for the **Post-Offboarding of an employee** template are as follows:

|parameter  |description  |Customizable  |
|---------|---------|---------|
|Category     |  Leaver       |  ❌       |
|Trigger Type     | Trigger and Scope Based        |  ❌       |
|Days from event     | 7        | ✔️        |
|Event timing     | After        |  ❌       |
|Event User attribute     | employeeLeaveDateTime      |   ❌      |
|Scope type     | Rule based        | ❌        |
|Execution condition     | (department eq 'Marketing')        |  ✔️       |
|Tasks     | **Remove all licenses for user**, **Remove user from all Teams**, **Delete User Account**     |  ✔️       |




## Next steps

- [workflowTemplate resource type](/graph/api/resources/identitygovernance-workflowtemplate?view=graph-rest-beta)
- [Lifecycle Workflow tasks and definitions](lifecycle-workflow-tasks.md)
- [Create a Lifecycle workflow](create-lifecycle-workflow.md)


