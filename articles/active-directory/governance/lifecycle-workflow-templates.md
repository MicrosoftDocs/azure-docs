---
title: Workflow Templates and categories - Azure Active Directory
description: Conceptual article discussing workflow templates and categories with Lifecycle Workflows
author: owinfreyATL
ms.author: owinfrey
ms.service: active-directory
ms.workload: identity
ms.topic: conceptual 
ms.date: 07/06/2022
ms.custom: template-concept
---

# Lifecycle Workflows templates (Preview)


Lifecycle Workflows allows you to automate the lifecycle management process for your organization by creating workflows that contain both built-in tasks, and custom task extensions. These workflows, and the tasks within them, all fall into categories based on the Joiner-Mover-Leaver(JML) model of lifecycle management. To make this process even more efficient, Lifecycle Workflows also provide you templates, which you can use to quickly automate common parts of the lifecycle management process. You can create workflows based on these templates as is, or you can customize them even further to match the requirements for users within your organization. In this article you'll get the complete list of workflow templates, common template parameters, default template parameters for specific templates, and the list of compatible tasks for each template. For full task definitions, see [Lifecycle Workflow tasks and definitions](lifecycle-workflow-tasks.md).


## Lifecycle Workflow Templates

Lifecycle Workflows currently have three built-in templates you can use or customize:

- [Onboard pre-hire employee](lifecycle-workflow-templates.md#onboard-pre-hire-employee)
- [Onboard new hire employee](lifecycle-workflow-templates.md#onboard-new-hire-employee)
- [Real-time employee termination](lifecycle-workflow-templates.md#real-time-employee-termination)  
- [Pre-Offboarding of an employee](lifecycle-workflow-templates.md#pre-offboarding-of-an-employee)
- [Offboard an employee](lifecycle-workflow-templates.md#offboard-an-employee)
- [Post-Offboarding of an employee](lifecycle-workflow-templates.md#post-offboarding-of-an-employee)


While these templates have specific properties which can be configured for them, they also contain basic properties which are common among each of them. Basic properties of the templates are as follows:


|parameter  |description  |
|---------|---------|
|Name     | A unique string that identifies the workflow.        |
|Description     | A string that describes the purpose of the workflow for administrative use. (Optional)        |
|Category     | A read-only string that determines which tasks are apart of, or can be added, to the template.      |
|Trigger Type     | Conditions for when the workflow runs. Can be customized via changes to scope and days from event.    |



### Onboard pre-hire employee

 The **Onboard pre-hire employee** template is designed to configure tasks that must be completed before an employee's start date.
:::image type="content" source="media/lifecycle-workflow-templates/lcw-onboard-prehire-template.png" alt-text="onboard pre-hire template":::

The default specific parameters and properties for the **Onboard pre-hire employee** template are as follows:



|parameter  |description  |Customizable  |
|---------|---------|---------|
|Category     |  Joiner       |  ❌       |
|Trigger Type     | Trigger and Scope Based        |  ❌       |
|Days from event     | -7        | ✔️        |
|Event timing     | Before        |  ❌       |
|Event User attribute     | EmployeeHireDate        |   ❌      |
|Scope type     | Rule based        | ❌        |
|Rule     | (department eq 'Marketing')        |  ✔️       |





The default task for the **Onboard pre-hire employee** template:

- **Generate TAP And Send Email**


### Onboard new hire employee

The **Onboard new-hire employee** template is designed to configure tasks that will be completed on an employee's start date.
:::image type="content" source="media/lifecycle-workflow-templates/lcw-onboard-newhire-template.png" alt-text="lcw onboard new hire template":::

The default specific parameters for the **Onboard new hire employee** template are as follows:


|parameter  |description  |Customizable  |
|---------|---------|---------|
|Category     |  Joiner       |  ❌       |
|Trigger Type     | Trigger and Scope Based        |  ❌       |
|Days from event     | 0        | ✔️        |
|Event timing     | Before        |  ❌       |
|Event User attribute     | EmployeeHireDate        |   ❌      |
|Scope type     | Rule based        | ❌        |
|Rule     | (department eq 'Marketing')        |  ✔️       |




The default tasks for the **Onboard new hire employee** template:

- **Add User To Group**
- **Enable User Account**
- **Send Welcome Email**


### Real-time employee termination

The **Real-time employee termination** template is designed to configure tasks that will be completed immediately when an employee is terminated.
:::image type="content" source="media/lifecycle-workflow-templates/lcw-ondemand-termination-template.png" alt-text="lcw ondemand termination template":::

The default specific parameters for the **Real-time employee termination** template are as follows:


|parameter  |description  |Customizable  |
|---------|---------|---------|
|Category     |  Leaver       |  ❌       |
|Trigger Type     | On-demand        |  ❌       |



The default tasks for the **Real-time employee termination** template:

- **Remove user from all groups**
- **Delete User Account**
- **Remove user from all Teams**


### Pre-Offboarding of an employee

The **Pre-Offboarding of an employee** template is designed to configure tasks that will be completed before an employee's last day of work.
:::image type="content" source="media/lifecycle-workflow-templates/lcw-offboard-pre-employee-template.png" alt-text="lcw offboarding of an employee":::


The default specific parameters for the **Pre-Offboarding of an employee** template are as follows:


|parameter  |description  |Customizable  |
|---------|---------|---------|
|Category     |  Leaver       |  ❌       |
|Trigger Type     | Trigger and Scope Based        |  ❌       |
|Days from event     | 7        | ✔️        |
|Event timing     | Before        |  ❌       |
|Event User attribute     | EmployeeHireDate        |   ❌      |
|Scope type     | Rule based        | ❌        |
|Rule     | None       |  ✔️       |

The default tasks for the **Pre-Offboarding of an employee** template:

- Remove user from selected groups
- Remove user from selected Teams

### Offboard an employee

The **Offboard an employee** template is designed to configure tasks that will be completed on an employee's last day of work.
:::image type="content" source="media/lifecycle-workflow-templates/lcw-offboard-employee-template.png" alt-text="offboard employee template":::

The default specific parameters for the **Offboard an employee** template are as follows:


|parameter  |description  |Customizable  |
|---------|---------|---------|
|Category     |  Leaver       |  ❌       |
|Trigger Type     | Trigger and Scope Based        |  ❌       |
|Days from event     | 0        | ✔️        |
|Event timing     | On        |  ❌       |
|Event User attribute     | employeeLeaveDateTime      |   ❌      |
|Scope type     | Rule based        | ❌        |
|Rule     | (department eq 'Marketing')        |  ✔️       |

The default tasks for the **Offboard an employee** template:

- **Disable User Account**
- **Remove user from all groups**
- **Remove user from all Teams**

### Post-Offboarding of an employee

The **Post-Offboarding of an employee** template is designed to configure tasks that will be completed after an employee's last day of work.
:::image type="content" source="media/lifecycle-workflow-templates/lcw-offboard-post-employee-template.png" alt-text="lcw post offboarding employee template":::


|parameter  |description  |Customizable  |
|---------|---------|---------|
|Category     |  Leaver       |  ❌       |
|Trigger Type     | Trigger and Scope Based        |  ❌       |
|Days from event     | 7        | ✔️        |
|Event timing     | After        |  ❌       |
|Event User attribute     | employeeLeaveDateTime      |   ❌      |
|Scope type     | Rule based        | ❌        |
|Rule     | (department eq 'Marketing')        |  ✔️       |

The default tasks for the **Post-Offboarding of an employee** template:

- **Remove all licenses for user**
- **Remove user from all Teams**
- **Delete User Account**


## Next steps

- [Lifecycle Workflow tasks and definitions](lifecycle-workflow-tasks.md)
- [Create a Lifecycle workflow](create-lifecycle-workflow.md)


