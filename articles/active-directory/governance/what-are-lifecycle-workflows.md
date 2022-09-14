---
title: 'What are lifecycle workflows? - Azure Active Directory'
description: Describes overview of Lifecycle workflow feature.
services: active-directory
author: owinfreyATL
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.topic: overview
ms.date: 01/20/2022
ms.subservice: compliance
ms.author: owinfrey
ms.collection: M365-identity-device-management
---

# What are Lifecycle Workflows? (Public Preview)

Azure AD Lifecycle Workflows is a new Azure AD Identity Governance service that enables organizations to manage Azure AD users by automating these three basic lifecycle processes: 

- Joiner - When an individual comes into scope of needing access.  An example is a new employee joining a company or organization.
- Mover - When an individual moves between boundaries within an organization. This movement may require more access or authorization.  An example would be a user who was in marketing is now a member of the sales organization.
- Leaver - When an individual leaves the scope of needing access, access may need to be removed. Examples would be an employee who is retiring or an employee who has been terminated.

Workflows contain specific processes, which run automatically against users as they move through their life cycle. Workflows are made up of [Tasks](lifecycle-workflow-tasks.md) and [Execution conditions](understanding-lifecycle-workflows.md#understanding-lifecycle-workflows). 

Tasks are specific actions that run automatically when a workflow is triggered. An Execution condition defines the 'Scope' of "“who” and the 'Trigger' of “when” a workflow will be performed. For example, send a manager an email 7 days before the value in the NewEmployeeHireDate attribute of new employees, can be described as a workflow.  It consists of:
   - Task:  send email
   - When (trigger):  Seven days before the NewEmployeeHireDate attribute value
   - Who (scope):  new employees

Automatic workflow schedules [trigger](understanding-lifecycle-workflows.md#trigger-details) off of user attributes.  Scoping of automatic workflows is possible using a wide range of user and extended attributes; such as the "department" that a user belongs to. 

Finally, Lifecycle Workflows can even [integrate with Logic Apps](lifecycle-workflow-extensibility.md) tasks ability to extend workflows for more complex scenarios using your existing Logic apps.


 :::image type="content" source="media/what-are-lifecycle-workflows/intro-2.png" alt-text="Lifecycle Workflows diagram." lightbox="media/what-are-lifecycle-workflows/intro-2.png":::


## Why use Lifecycle workflows?
Anyone who wants to modernize their identity lifecycle management process for employees, needs to ensure: 

  - **New employee on-boarding** - That when a user joins the organization, they're ready to go on day one.  They have the correct access to the information, membership to groups, and applications they need. 
  - **Employee retirement/terminations/off-boarding** - That users who are no longer tied to the company for various reasons (termination, separation, leave of absence or retirement), have their access revoked in a timely manner
  - **Easy to administer in my organization** - That there's a seamless process to accomplish the above tasks, that isn't overly burdensome or time consuming for Administrators.
  - **Robust troubleshooting/auditing/compliance** - That there's the ability to easily troubleshoot issues when they arise and that there's sufficient logging to help with this and compliance related issues.

The following are key reasons to use Lifecycle workflows.
-  **Extend** your HR-driven provisioning process with other workflows that simplify and automate tasks.  
- **Centralize** your workflow process so you can easily create and manage workflows all in one location.
- Easily **troubleshoot** workflow scenarios with the Workflow history and Audit logs
- **Manage** user lifecycle at scale.  As your organization grows, the need for other resources to manage user lifecycles are reduced.
- **Reduce** or remove manual tasks that were done in the past with automated lifecycle workflows
- **Apply** logic apps to extend workflows for more complex scenarios using your existing Logic apps


All of the above can help ensure a holistic experience by allowing you to remove other dependencies and applications to achieve the same result.  Thus translating into, increased on-boarding and off-boarding efficiency.


## When to use Lifecycle Workflows
You can use Lifecycle workflows to address any of the following conditions.
- **Automating and extending user onboarding/HR provisioning** - Use Lifecycle workflows when you want to extend your HR provisioning scenarios by automating tasks such as generating temporary passwords and emailing managers.  If you currently have a manual process for on-boarding, use Lifecycle workflows as part of an automated process.
- **Automate group membership**: When groups in your organization are well-defined, you can automate user membership of these groups. Some of the benefits and differences from dynamic groups include:
  - LCW manages static groups, where a dynamic group rule isn't needed
  - No need to have one rule per group – the LCW rule determines the set/scope of users to execute workflows against not which group
  - LCW helps manage users ‘ lifecycle beyond attributes supported in dynamic groups – for example, ‘X’ days before the employeeHireDate
  - LCW can perform actions on the group not just the membership.
- **Workflow history and auditing**  Use Lifecycle workflows when you need to create an audit trail of user lifecycle processes.  Using the portal you can view history and audits for on-boarding and off-boarding scenarios.
- **Automate user account management**: Making sure users who are leaving have their access to resources revoked is a key part of the identity lifecycle process. Lifecycle Workflows allow you to automate the disabling and removal of user accounts.
- **Integrate with Logic Apps**: Ability to apply logic apps to extend workflows for more complex scenarios using your existing Logic apps.




## Next steps
- [Create a custom workflow using the Azure portal](tutorial-onboard-custom-workflow-portal.md)
- [Create a Lifecycle workflow](create-lifecycle-workflow.md)