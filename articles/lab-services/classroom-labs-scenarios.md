---
title: Use labs for trainings
titleSuffix: Azure Lab Services
description: This article describes how to use Azure DevTest Labs for creating labs on Azure for training scenarios.
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: conceptual
ms.date: 01/17/2023
---

# Use labs for trainings

In this article, you learn about the different features and steps for using Azure Lab Services for conducting classes. Azure Lab Services allows educators (teachers, professors, trainers, or teaching assistants, etc.) to quickly and easily create an online lab to provision preconfigured learning environments for the trainees. Each trainee can use identical and isolated environments for the training. Apply policies to ensure that the training environments are available to each trainee only when they need them, and contain enough resources - such as virtual machines - required for the training.

:::image type="content" source="./media/classroom-labs-scenarios/classroom.png" alt-text="Conceptual artwork that shows a teacher and students in a classroom, using Azure Lab Services.":::

Labs meet the following requirements for conducting training in any virtual environment:

- Trainees can quickly provision their training environments
- Every training machine should be identical
- Trainees can't see VMs created by other trainees
- Control cost by ensuring that trainees can't get more VMs than they need for the training and also shutdown VMs when they aren't using them
- Easily share the training lab with each trainee
- Reuse the training lab again and again

## Mapping organizational roles to permissions

Azure Lab Services uses Azure Role-Based Access (Azure RBAC) to manage access to Azure Lab Services. For more information, see the [Azure Lab Services built-in roles](./administrator-guide.md#rbac-roles). Using Azure RBAC lets you clearly separate roles and responsibilities for creating and managing labs across different teams and people in your organization.

Depending on your organizational structure, responsibilities, and skill level, there might be different options to map these permissions to your organizational roles or personas, such as administrators, or educators. The scenarios and diagrams also include students to show where they fit in the process, although they don't require Azure AD permissions.

The following sections give different examples of assigning permissions across an organization. Azure Lab Services enables you to flexibly assign permissions beyond these typical scenarios to match your organizational set up.

### Scenario 1: Splitting responsibilities between IT department and educators

In this scenario, the IT department, service providers, or administrators manage the Azure subscription(s). They're responsible for creating the Azure Lab Services lab plan and then grant the educators permission to create labs in the lab plan. The educator invites students to register for and connect to a lab VM.

In your organization structure, the administrator activities might be further split across subteams. For example, one team might be responsible for the configuration of virtual networks for advanced networking (central IT). And the creation of the lab plan and other Azure resources might be the responsibility of another team (department IT).

Get started as an administrator with the [Quickstart: set up the resources for creating labs](./quick-create-resources.md).

Get started as an educator with the [Tutorial: set up a lab for classroom training](./tutorial-setup-lab.md).

:::image type="content" source="./media/classroom-labs-scenarios/lab-services-process-education-roles-scenario1.png" alt-text="Diagram that shows lab creation steps where admins create the lab plan and educators create the lab.":::

The following table shows the corresponding mapping of organization roles to Azure AD roles:

| Org. role | Azure AD role | Description |
| --- | --- | --- |
| Administrator | - Subscription Owner<br/>- Subscription Contributor | Create lab plan in Azure portal. |
|               | Lab Operator | Optionally, assign to other administrator to manage lab users & schedules, publish labs, and reset/start/stop/connect lab VMs. |
| Educator      | Lab Creator | Create and manage the labs they created. |
|               | Lab Contributor | Optionally, assign to an educator to create and manage all labs (when assigned at the resource group level). |
|               | Lab Operator | Optionally, assign to other educators to manage lab users & schedules, publish labs, and reset/start/stop/connect lab VMs. |
|               | Lab Assistant | Optionally, assign to other educators to help support lab students by allowing reset/start/stop/connect lab VMs. |
| Student       |  | Students don't need an Azure AD role. Educators [grant students access](./how-to-configure-student-usage.md) in the lab configuration or students are automatically granted access, for example when using [Teams](./how-to-manage-labs-within-teams.md#manage-lab-user-lists-in-teams) or [Canvas](./how-to-manage-labs-within-canvas.md#manage-lab-user-lists-in-canvas). |
| Others        | Lab Services Reader | Optionally, provide access to see all lab plans and labs without permission to modify. |

### Scenario 2: The IT department owns the entire lab creation process

In this scenario, the IT department (administrators) creates both the Azure Lab Services lab plan and lab. Optionally, the administrator grants educators permissions to manage lab users and configure lab settings, such as quotas and schedules. This scenario might be useful in cases where educators can't or don't want to set up and customize the lab.

As mentioned in [scenario 1](#scenario-1-splitting-responsibilities-between-it-department-and-educators), the administrator tasks for creating the lab plan might also be split across multiple subteams.

Get started as an administrator with the [Quickstart: create and connect to a lab](./quick-create-connect-lab.md).

Get started as an educator and [add students to a lab](./how-to-configure-student-usage.md), or [create a lab schedule](./how-to-create-schedules.md).

:::image type="content" source="./media/classroom-labs-scenarios/lab-services-process-education-roles-scenario2.png" alt-text="Diagram that shows lab creation steps where admins own the entire process.":::

The following table shows the corresponding mapping of organization roles to Azure AD roles:

| Org. role | Azure AD role | Description |
| --- | --- | --- |
| Administrator | - Subscription Owner<br/>- Subscription Contributor | Create lab plan in Azure portal. |
|               | Lab Operator | Optionally, assign to other administrator to manage lab users & schedules, publish labs, and reset/start/stop/connect lab VMs. |
| Educator      | Lab Operator | Manage lab users & schedules, publish labs, and reset/start/stop/connect lab VMs. |
|               | Lab Assistant | Optionally, assign to other educators to help support lab students by allowing reset/start/stop/connect lab VMs. |
| Student       |  | Students don't need an Azure AD role. Educators [grant students access](./how-to-configure-student-usage.md) in the lab configuration or students are automatically granted access, for example when using [Teams](./how-to-manage-labs-within-teams.md#manage-lab-user-lists-in-teams) or [Canvas](./how-to-manage-labs-within-canvas.md#manage-lab-user-lists-in-canvas). |
| Others        | Lab Services Reader | Optionally, provide access to see all lab plans and labs without permission to modify. |

### Scenario 3: The educator owns the entire lab creation process

In this scenario, the educator manages their Azure subscription and manages the entire process of creating the Azure Lab Services lab plan and lab. This scenario might be useful in cases where educators are comfortable with creating Azure resources, and creating and customizing labs.

Get started as an administrator with the [Quickstart: create and connect to a lab](./quick-create-connect-lab.md) and then [add students to a lab](./how-to-configure-student-usage.md), and [create a lab schedule](./how-to-create-schedules.md).

:::image type="content" source="./media/classroom-labs-scenarios/lab-services-process-education-roles-scenario3.png" alt-text="Diagram that shows lab creation steps where educators own the entire process.":::

The following table shows the corresponding mapping of organization roles to Azure AD roles:

| Org. role | Azure AD role | Description |
| --- | --- | --- |
| Educator      | - Subscription Owner<br/>- Subscription Contributor | Create lab plan in Azure portal. As an Owner, you can also fully manage all labs.  |
|               | Lab Assistant | Optionally, assign to other educators to help support lab students by allowing reset/start/stop/connect lab VMs. |
| Student       |  | Students don't need an Azure AD role. Educators [grant students access](./how-to-configure-student-usage.md) in the lab configuration or students are automatically granted access, for example when using [Teams](./how-to-manage-labs-within-teams.md#manage-lab-user-lists-in-teams) or [Canvas](./how-to-manage-labs-within-canvas.md#manage-lab-user-lists-in-canvas). |
| Others        | Lab Services Reader | Optionally, provide access to see all lab plans and labs without permission to modify. |

## Create the lab plan as a lab plan administrator

The first step in using Azure Lab Services is to create a lab plan in the Azure portal. After a lab plan administrator creates the lab plan, the admin adds the Lab Creator role to users who want to create labs, such as educators. 

The lab creator can then create labs with virtual machines for students to do exercises for the course they're teaching. For details, see [Create and manage lab plan](how-to-manage-lab-plans.md).

## Create and manage labs

If you have the Lab Creator role for a lab plan, you can create one or more labs in the lab plan. You create and configure a template VM with all the required software for doing exercises in your course. You select a ready-made image from the available images for creating a lab and then optionally customize it by installing the software required for the lab. For details, see [Create and manage labs](how-to-manage-labs.md).

## Set up and publish a template VM

A template VM in a lab is a base virtual machine image from which all users’ VMs are created. Set up the template VM so that it's configured with exactly what you want to provide to the training attendees. You can provide a name and description of the template that the lab users see.

Then, you publish the template to make instances of the template VM available to your lab users. When you publish a template, Azure Lab Services creates VMs in the lab by using the template. The number of VMs created in this process is the same as the maximum number of users allowed into the lab, which you can set in the usage policy of the lab. All virtual machines have the same configuration as the template. For details, see [Set up and publish template virtual machines](how-to-create-manage-template.md).

## Configure usage settings and policies

The lab creator can add or remove users to the lab, get a registration link to invite lab users, set up policies such as setting individual quotas per user, update the number of VMs available in the lab, and more. For details, see [Configure usage settings and policies](how-to-configure-student-usage.md).

When you use Azure Lab Services with [Microsoft Teams](./how-to-manage-labs-within-teams.md) or [Canvas](./how-to-manage-labs-within-canvas.md), Azure Lab Services automatically synchronizes the lab user list with the membership in Teams or Canvas.

## Create and manage schedules

Schedules allow you to configure a lab such that VMs in the lab automatically start and shut down at a specified time. You can define a one-time schedule or a recurring schedule. For details, see [Create and manage schedules for labs](how-to-create-schedules.md).

## Use VMs in the lab

A student or training attendee registers to the lab by using the registration link they received from the lab creator. They can then connect to the VM to do the exercises for the course. For details, see [How to access a lab](how-to-use-lab.md).

## Next steps

- Get started by following the steps in the tutorial [Set up a lab for classroom training](./tutorial-setup-lab.md).
