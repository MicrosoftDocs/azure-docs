---
title: Privileged Identity Management for Azure Resources - Eligible assignments and resource visibility | Microsoft Docs
description: Describes how to assign members as Eligible to resource roles.
services: active-directory
documentationcenter: ''
author: billmath
manager: mtillman
editor: mwahl
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/02/2018
ms.author: billmath
ms.custom: pim
---


# Eligible assignments and resource visibility

PIM for Azure resource roles provides enhanced security for organizations with critical Azure resoruces. PIM provides resource administrators the ability to assign members as Eligible to resource roles. Read more about the different assignment types and states for Azure resource roles below. 

## Assignment types

PIM for Azure resources provides two distinct assignment types:

- Eligible
- Active

Eligible assignments require the member of the role to perform an action to use the role. These actions may include succeeding a Multi-Factor Authentication check, providing a justification, and requesting approval from designated approvers.

Active assignments do not require the member to perform any action to use the role. Members assigned as Active have the privileges provided by the role at all times.

## Assignment duration

Resource administrators can choose one of two options for each Assignment Type when configuring PIM settings on a role. These options become the default maximum duration when a member is assigned to the role in PIM.

- Allow permanent eligible assignment
- Allow permanent active assignment

or

- Expire eligible assignments after
- Expire active assignments after

If a resource administrator chooses to "Allow permanent eligible assignment" and/or "Allow permanent active assignment", all administrators that assign members to the resource will have the ability to assign permanent memberships.

Choosing "Expire eligible assignments after" and/or "Expire active assignments after" enables control over the assignment lifecycle by requiring all assignments have a specified start and end date.

>[!NOTE] 
>All assignments with a specified end date can be renewed by resource administrators and members can initiate self-service requests to [extend or renew assignments](pim-resource-roles-renew-extend.md).


## Assignment states

PIM for Azure resources has two distinct assignment states that appear on the "Active roles" tab in My roles, Roles, and Members views of PIM. These states are:

- Assigned
- Activated

When viewing a membership listed in "Active roles" the "STATE" column enables you to differentiate between users that are "Assigned" as active versus users that "Activated" an eligible assignment and are now active.

## Next steps

[Assign roles in PIM](pim-resource-roles-assign-roles.md)

