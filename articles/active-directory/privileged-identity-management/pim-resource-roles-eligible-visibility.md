---
title: Eligible assignments and resource visibility in PIM - Azure | Microsoft Docs
description: Describes how to assign members as eligible for Azure resource roles in Azure AD Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman
editor: markwahl-msft
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.component: pim
ms.date: 04/02/2018
ms.author: rolyon
ms.custom: pim
---


# Eligible assignments and resource visibility in PIM

Privileged Identity Management (PIM) for Azure resource roles provides enhanced security for organizations that have critical Azure resources. Resource administrators can use PIM to assign members as eligible for resource roles. Learn more about the different assignment types and assignment states for Azure resource roles in the following sections. 

## Assignment types

PIM for Azure resources provides two distinct assignment types:

- Eligible
- Active

Eligible assignments require the member of the role to perform an action to use the role. Actions might include succeeding a multi-factor authentication check, providing a business justification, or requesting approval from designated approvers.

Active assignments don't require the member to perform any action to use the role. Members assigned as active have the privileges assigned to the role at all times.

## Assignment duration

Resource administrators can choose from two options for each assignment type when they configure PIM settings for a role. These options become the default maximum duration when a member is assigned to the role in PIM. 

An administrator can choose one of these assignment types:

- Allow permanent eligible assignment
- Allow permanent active assignment

Or, an administrator can choose one of these assignment types:

- Expire eligible assignments after
- Expire active assignments after

If a resource administrator chooses **Allow permanent eligible assignment** or **Allow permanent active assignment**, all administrators that assign members to the resource can assign permanent memberships.

If a resource administrator chooses **Expire eligible assignments after** or **Expire active assignments after**, the resource administrator controls the assignment lifecycle by requiring that all assignments have a specified start and end date.

> [!NOTE] 
> All assignments that have a specified end date can be renewed by resource administrators. Also, members can initiate self-service requests to [extend or renew assignments](pim-resource-roles-renew-extend.md).


## Assignment states

PIM for Azure resources has two distinct assignment states that appear on the **Active roles** tab in the **My roles**, **Roles**, and **Members** views of PIM. These states are:

- Assigned
- Activated

When you view a membership that's listed in **Active roles**, you can use the value in the **STATE** column to differentiate between users that are **Assigned** as active and users that **Activated** an eligible assignment, and are now active.

## Azure resource role approval workflow

With the approval workflow in PIM for Azure resource roles, administrators can further protect or restrict access to critical resources. That is, administrators can require approval to activate role assignments.

The concept of a resource hierarchy is unique to Azure resource roles. This hierarchy enables the inheritance of role assignments from a parent resource object downward to all child resources within the parent container. 

For example: Bob, a resource administrator, uses PIM to assign Alice as an eligible member to the owner role in the Contoso subscription. With this assignment, Alice is an eligible owner of all resource group containers within the Contoso subscription. Alice is also an eligible owner of all resources (like virtual machines) within each resource group of the subscription.

Let's assume there are three resource groups in the Contoso subscription: Fabrikam Test, Fabrikam Dev, and Fabrikam Prod. Each of these resource groups contains a single virtual machine.

PIM settings are configured for each role of a resource. Unlike assignments, these settings are not inherited, and apply strictly to the  resource role.

Continuing with the example: Bob uses PIM to require all members in the owner role of the Contoso subscription request approval to be activated. To help protect the resources in the Fabrikam Prod resource group, Bob also requires approval for members of the owner role of this resource. The owner roles in Fabrikam Test and Fabrikam Dev do not require approval for activation.

When Alice requests activation of her owner role for the Contoso subscription, an approver must approve or deny her request before she becomes active in the role. If Alice decides to [scope her activation](pim-resource-roles-activate-your-roles.md) to the Fabrikam Prod resource group, an approver must approve or deny this request, too. But if Alice decides to scope her activation to either or both Fabrikam Test or Fabrikam Dev, approval is not required.

The approval workflow might not be necessary for all members of a role. Consider a scenario where your organization hires several contract associates to help with the development of an application that will run in an Azure subscription. As a resource administrator, you want employees to have eligible access without approval required, but the contract associates must request approval. To configure approval workflow for only the contract associates, you can create a custom role with the same permissions as the role assigned to employees. You can require approval to activate that custom role. [Learn more about custom roles](pim-resource-roles-custom-role-policy.md).

## Next steps

- [Assign Azure resource roles in PIM](pim-resource-roles-assign-roles.md)
