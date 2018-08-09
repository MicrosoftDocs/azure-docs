---
title: Eligible assignments and resource visibility for Azure in Privileged Identity Management | Microsoft Docs
description: Describes how to assign members as eligible for resource roles when using PIM.
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


# Eligible assignments and resource visibility with Privileged Identity Management

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

## Next steps

[Assign roles in Privileged Identity Manager](pim-resource-roles-assign-roles.md)
