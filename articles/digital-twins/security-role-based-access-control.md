---
title: Understand Azure Digital Twins role-based access control | Microsoft Docs
description: Learn authentication in Digital Twins with role-based access control.
author: lyrana
manager: alinast
ms.service: digital-twins
services: digital-twins
ms.topic: conceptual
ms.date: 10/10/2018
ms.author: lyrana
---

# Role-based access control

Azure Digital Twins enables precise access control to specific data, resources, and actions in your spatial graph. It does so through granular role and permission management called role-based access control (RBAC). RBAC consists of _roles_ and _role assignments_. Roles identify the level of permissions. Role assignments associate a role with a user or device.

Using RBAC, permission can be granted to:

- A user.
- A device.
- A service principal.
- A user-defined function. 
- All users who belong to a domain. 
- A tenant.
 
The degree of access also can be fine-tuned.

RBAC is unique in that permissions are inherited down the spatial graph.

## What can I do with RBAC?

A developer might use RBAC to:

* Grant a user the ability to manage devices for an entire building, or only for a specific room or floor.
* Grant an administrator global access to all spatial graph nodes for an entire graph, or only for a section of the graph.
* Grant a support specialist read access to the graph, except for access keys.
* Grant every member of a domain read access to all graph objects.

## RBAC best practices

[!INCLUDE [digital-twins-permissions](../../includes/digital-twins-rbac-best-practices.md)]

## Roles

### Role definitions

A role definition is a collection of permissions and is sometimes called a role. The role definition lists the allowed operations, which include create, read, update, and delete. It also specifies to which object types these permissions apply.

The following roles are available in Azure Digital Twins:

* **Space Administrator**: Create, read, update, and delete permission for the specified space and all nodes underneath. Global permission.
* **User Administrator**: Create, read, update, and delete permission for users and user-related objects. Read permission for spaces.
* **Device Administrator**: Create, read, update, and delete permission for devices and device-related objects. Read permission for spaces.
* **Key Administrator**: Create, read, update, and delete permission for access keys. Read permission for spaces.
* **Token Administrator**: Read and update permission for access keys. Read permission for spaces.
* **User**: Read permission for spaces, sensors, and users, which includes their corresponding related objects.
* **Support Specialist**: Read permission for everything except access keys.
* **Device Installer**: Read and update permission for devices and sensors, which includes their corresponding related objects. Read permission for spaces.
* **Gateway Device**: Create permission for sensors. Read permission for devices and sensors, which includes their corresponding related objects.

>[!NOTE]
> To retrieve the full definitions for the previous roles, query the system/roles API.

### Object types

The `ObjectIdType` refers to the type of identity that's given a role. Apart from the `DeviceId` and `UserDefinedFunctionId` types, the types correspond to a property of an Azure Active Directory (Azure AD) object:
  
* The `UserId` type assigns a role to a user.
* The `DeviceId` type assigns a role to a device.
* The `DomainName` type assigns a role to a domain name. Each user with the specified domain name has the access rights of the corresponding role.
* The `TenantId` type assigns a role to a tenant. Each user who belongs to the specified Azure AD tenant ID has the access rights of the corresponding role.
* The `ServicePrincipalId` type assigns a role to a service principal object ID.
* The `UserDefinedFunctionId` type assigns a role to a user-defined function (UDF).

> [!div class="nextstepaction"]
> [Query or the object ID for a user](https://docs.microsoft.com/powershell/module/azuread/get-azureaduser?view=azureadps-2.0)

> [!div class="nextstepaction"]
> [Obtain the object ID for a service principal](https://docs.microsoft.com/powershell/module/azurerm.resources/get-azurermadserviceprincipal?view=azurermps-6.8.1)

> [!div class="nextstepaction"]
> [Retrieve the object ID for an Azure AD tenant](https://docs.microsoft.com/azure/active-directory/develop/quickstart-create-new-tenant)

## Role assignments

To grant permissions to a recipient, create a role assignment. To revoke permissions, remove the role assignment. An Azure Digital Twins role assignment associates an object, such as a user or an Azure AD tenant, with a role and a space. Permissions are granted to all objects that belong to that space. The space includes the entire spatial graph beneath it.

For example, a user is given a role assignment with the role `DeviceInstaller` for the root node of a spatial graph, which represents a building. The user can then read and update devices for that node and all other child spaces in the building.

## Next steps

To learn about Azure Digital Twins security, read [Create and manage role assignments](./security-create-manage-role-assignments.md).
