---
title: What are lifecycle workflows?
description: Get an overview of the lifecycle workflow feature of Microsoft Entra ID.
services: active-directory
author: owinfreyATL
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.topic: overview
ms.date: 06/22/2023
ms.subservice: compliance
ms.author: owinfrey
ms.collection: M365-identity-device-management
---

# What are lifecycle workflows?

Lifecycle workflows are a new identity governance feature that enables organizations to manage Microsoft Entra users by automating these three basic lifecycle processes:

- **Joiner**: When an individual enters the scope of needing access. An example is a new employee joining a company or organization.
- **Mover**: When an individual moves between boundaries within an organization. This movement might require more access or authorization. An example is a user who was in marketing and is now a member of the sales organization.
- **Leaver**: When an individual leaves the scope of needing access. This movement might require the removal of access. Examples are an employee who's retiring or an employee who's terminated.

Workflows contain specific processes that run automatically against users as they move through their lifecycle. Workflows consist of [tasks](lifecycle-workflow-tasks.md) and [execution conditions](understanding-lifecycle-workflows.md#understanding-lifecycle-workflows).

Tasks are specific actions that run automatically when a workflow is triggered. An execution condition defines the scope of who's affected and the trigger of when a workflow will be performed. For example, sending a manager an email seven days before the value in the `employeeHireDate` attribute of new employees can be described as a workflow. It consists of:

- Task: Send email.
- Who (scope): New employees.
- When (trigger): Seven days before the `employeeHireDate` attribute value.

An automatic workflow schedules a [trigger](understanding-lifecycle-workflows.md#trigger-details) based on user attributes. Scoping of automatic workflows is possible through a wide range of user and extended attributes, such as the department that a user belongs to.

Lifecycle workflows can even [integrate with the ability of logic apps tasks to extend workflows](lifecycle-workflow-extensibility.md) for more complex scenarios through your existing logic apps.

:::image type="content" source="media/what-are-lifecycle-workflows/intro-2.png" alt-text="Diagram of lifecycle workflows." lightbox="media/what-are-lifecycle-workflows/intro-2.png":::

## Why to use lifecycle workflows

Anyone who wants to modernize an identity lifecycle management process for employees needs to ensure:

- That when users join the organization, they're ready to go on day one. They have the correct access to information, group memberships, and applications that they need.
- That users who are no longer tied to the company for various reasons (termination, separation, leave of absence, or retirement) have their access revoked in a timely way.
- That the process for providing or revoking access isn't overly burdensome or time consuming for administrators.
- That administrators and employees can easily troubleshoot problems, and that logging is sufficient to help with troubleshooting, auditing, and compliance.

Key reasons to use lifecycle workflows include:

- Extend your HR-driven provisioning process with other workflows that simplify and automate tasks.
- Centralize your workflow process so you can easily create and manage workflows in one location.
- Easily troubleshoot workflow scenarios with the workflow history and audit logs.
- Manage user lifecycle at scale. As your organization grows, the need for other resources to manage user lifecycles decreases.
- Reduce or remove manual tasks.
- Apply logic apps to extend workflows for more complex scenarios with your existing logic apps.

Those capabilities can help ensure a holistic experience by allowing you to remove other dependencies and applications to achieve the same result. You can then increase efficiency in new employee orientation and in removal of former employees from the system.

## When to use lifecycle workflows

You can use lifecycle workflows to address any of the following conditions:

- **Automating and extending user orientation and HR provisioning**: Use lifecycle workflows when you want to extend your HR provisioning scenarios by automating tasks such as generating temporary passwords and emailing managers. If you currently have a manual process for orientation, use lifecycle workflows as part of an automated process.
- **Automating group membership**: When groups in your organization are well defined, you can automate user membership in those groups. Benefits and differences from dynamic groups include:
  - Lifecycle workflows manage static groups, where you don't need a dynamic group rule.
  - There's no need to have one rule per group. Lifecycle workflow rules determine the scope of users to execute workflows against, not which group.
  - Lifecycle workflows help manage users' lifecycle beyond attributes supported in dynamic groups--for example, a certain number of days before the `employeeHireDate` attribute value.
  - Lifecycle workflows can perform actions on the group, not just the membership.
- **Workflow history and auditing**: Use lifecycle workflows when you need to create an audit trail of user lifecycle processes. By using the Microsoft Entra admin Center, you can view history and audits for orientation and departure scenarios.
- **Automating user account management**: A key part of the identity lifecycle process is making sure that users who are leaving have their access to resources revoked. You can use lifecycle workflows to automate the disabling and removal of user accounts.
- **Integrating with logic apps**: You can apply logic apps to extend workflows for more complex scenarios.

## License requirements

[!INCLUDE [Microsoft Entra ID Governance license](../../../includes/active-directory-entra-governance-license.md)]

With Lifecycle Workflows, you can:

- Create, manage, and delete workflows up to the total limit of 50 workflows.
- Trigger on-demand and scheduled workflow execution.
- Manage and configure existing tasks to create workflows that are specific to your needs.
- Create up to 100 custom task extensions to be used in your workflows.

## Next steps

- [Create a custom workflow by using the Microsoft Entra admin center](tutorial-onboard-custom-workflow-portal.md)
- [Create a lifecycle workflow](create-lifecycle-workflow.md)
