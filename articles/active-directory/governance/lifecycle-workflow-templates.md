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

# Lifecycle Workflow templates


Lifecycle Workflows allows you to automate the lifecycle management process for your organization by creating workflows that contain both built-in tasks, and custom task extensions. These workflows, and the tasks within them, all fall into categories based on the Joiner-Mover-Leaver(JML) model of lifecycle management. To make this process even more efficient, Lifecycle Workflows also provide you templates, which you can use to quickly automate common parts of the lifecycle management process. These templates can be run out of the box as is, or you can customize them even further to match the requirements for users within your organization. In this article you'll get the complete list of workflow templates, common template parameters, default template parameters for specific templates, and the list of compatible tasks for each template. For full task definitions, see [Lifecycle Workflow tasks and definitions](lifecycle-workflow-tasks.md).


## Lifecycle Workflow Templates

Lifecycle Workflows currently have three built-in templates you can use or customize:

- Onboard pre-hire employee
- Onboard new hire employee
- Real-time employee termination  

No matter which template you select, these common parameters are available:


|parameter  |description  |
|---------|---------|
|Name     | A unique string that identifies the workflow.        |
|Description     | A string that describes the purpose of the workflow for administrative use. (Optional)        |
|Category     | Either Joiner or Leaver. **Can not be customized**.        |
|Trigger Type     | Conditions for when the workflow runs. **Can not be customized**.        |



### Onboard pre-hire employee

 The **Onboard pre-hire employee** template is designed to configure tasks that must be completed before an employee's start date.
:::image type="content" source="media/lifecycle-workflow-templates/lcw-onboard-prehire-template.png" alt-text="onboard pre-hire template":::

The default specific parameters for the **Onboard pre-hire employee** template are as follows:


|parameter  |description  |
|---------|---------|
|Category     | Joiner. **Can not be customized**.        |
|Trigger Type     | Trigger and Scope Based. **Can not be customized**         |
|Days from event     |  -7. **Customizable**       |
|Event timing     |  Before. **Can not be customized**       |
|Event User attribute     | EmployeeHireDate. **Can not be customized**       |
|Scope type     | Rule based. **Can not be customized**        |
|Rule    | (department eq 'Marketing'). **Customizable**        |


The current tasks are supported with the **Onboard pre-hire employee** template:

> [!NOTE]
> Bold tasks are default tasks for the template.

- **Generate TAP And Send Email**
- Add User To Group
- Disable User Account
- Enable User Account
- Remove user from selected groups
- Send Welcome Email
- Add User To Team
- Remove user from selected Teams
- Run a Custom Task Extension

### Onboard new hire employee

The **Onboard new-hire employee** template is designed to configure tasks that will be completed on an employee's start date.
:::image type="content" source="media/lifecycle-workflow-templates/lcw-onboard-newhire-template.png" alt-text="lcw onboard new hire template":::

The default specific parameters for the **Onboard new hire employee** template are as follows:

|parameter  |description  |
|---------|---------|
|Category     | Joiner. **Can not be customized**.        |
|Trigger Type     | Trigger and Scope Based. **Can not be customized**         |
|Days from event     |  0. **Customizable**       |
|Event timing     |  Before. **Can not be customized**       |
|Event User attribute     | EmployeeHireDate. **Can not be customized**       |
|Scope type     | Rule based. **Can not be customized**        |
|Rule    | (department eq 'Marketing'). **Customizable**        |

The current tasks are supported with the **Onboard new hire employee** template:

- Generate TAP And Send Email
- **Add User To Group**
- Disable User Account
- **Enable User Account**
- Remove user from selected groups
- **Send Welcome Email**
- Add User To Team
- Remove user from selected Teams
- Run a Custom Task Extension


### Real-time employee termination

The **Real-time employee termination** template is designed to configure tasks that will be completed immediately when an employee is terminated.
:::image type="content" source="media/lifecycle-workflow-templates/lcw-ondemand-termination-template.png" alt-text="lcw ondemand termination template":::

The default specific parameters for the **Real-time employee termination** template are as follows:

|parameter  |description  |
|---------|---------|
|Category     | Leaver. **Can not be customized**.        |
|Trigger Type     | On-demand. **Can not be customized**         |

The current tasks are supported with the **Real-time employee termination** template:


- Add User To Group
- Disable User Account
- Enable User Account
- Remove user from selected groups
- **Remove user from all groups**
- **Delete User Account**
- Add User To Team
- Remove user from selected Teams
- **Remove user from all Teams**
- Remove all licenses for a user
- Run a Custom Task Extension

## Next steps

- [Lifecycle Workflow tasks and definitions](lifecycle-workflow-tasks.md)
- [Create a Lifecycle workflow](create-lifecycle-workflow.md)


