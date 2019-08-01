---
title: 'Understand Azure Digital Twins role-based access control | Microsoft Docs'
description: Learn authentication in Digital Twins with role-based access control.
author: lyrana
manager: alinast
ms.service: digital-twins
services: digital-twins
ms.topic: conceptual
ms.date: 12/27/2018
ms.author: lyhughes
---

# Role-based access control in Azure Digital Twins

Azure Digital Twins enables precise access control to specific data, resources, and actions in your spatial graph. It does so through granular role and permission management called role-based access control (RBAC). RBAC consists of _roles_ and _role assignments_. Roles identify the level of permissions. Role assignments associate a role with a user or device.

Using RBAC, permission can be granted to:

- A user.
- A device.
- A service principal.
- A user-defined function.
- All users who belong to a domain.
- A tenant.

The degree of access can also be fine-tuned.

RBAC is unique in that permissions are inherited down the spatial graph.

## What can I do with RBAC?

A developer might use RBAC to:

- Grant a user the ability to manage devices for an entire building, or only for a specific room or floor.
- Grant an administrator global access to all spatial graph nodes for an entire graph, or only for a section of the graph.
- Grant a support specialist read access to the graph, except for access keys.
- Grant every member of a domain read access to all graph objects.

## RBAC best practices

[!INCLUDE [digital-twins-permissions](../../includes/digital-twins-rbac-best-practices.md)]

## Roles

### Role definitions

A role definition is a collection of permissions and other attributes that constitute a role. A role definition lists the allowed operations, which include *CREATE*, *READ*, *UPDATE*, and *DELETE* that any object with that role may perform. It also specifies to which object types permissions apply to.

[!INCLUDE [digital-twins-roles](../../includes/digital-twins-roles.md)]

>[!NOTE]
> To retrieve the full definitions for the previous roles, query the system/roles API.
> Learn more by reading [Creating and managing role assignments](./security-create-manage-role-assignments.md#all).

### Object identifier types

[!INCLUDE [digital-twins-object-types](../../includes/digital-twins-object-id-types.md)]

>[!TIP]
> Learn how to grant permissions to your service principal by reading [Creating and managing role assignments](./security-create-manage-role-assignments.md#grant).

The following reference documentation articles describe:

- How to [Query or the object ID for a user](https://docs.microsoft.com/powershell/module/azuread/get-azureaduser?view=azureadps-2.0).
- How to [Obtain the object ID for a service principal](https://docs.microsoft.com/powershell/module/az.resources/get-azadserviceprincipal).
- How to [Retrieve the object ID for an Azure AD tenant](../active-directory/develop/quickstart-create-new-tenant.md).

## Role assignments

An Azure Digital Twins role assignment associates an object, such as a user or an Azure AD tenant, with a role and a space. Permissions are granted to all objects that belong to that space. The space includes the entire spatial graph beneath it.

For example, a user is given a role assignment with the role `DeviceInstaller` for the root node of a spatial graph, which represents a building. The user can then read and update devices for that node and all other child spaces in the building.

To grant permissions to a recipient, create a role assignment. To revoke permissions, remove the role assignment.

>[!IMPORTANT]
> Learn more about role assignments by reading [Creating and managing role assignments](./security-create-manage-role-assignments.md).

## Next steps

- To learn more about creating and managing Azure Digital Twins role assignments, read [Create and manage role assignments](./security-create-manage-role-assignments.md).
