---
title: Understanding Azure Digital Twins role-based access control | Microsoft Docs
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

Azure Digital Twins enables precise access control to specific data, resources, and actions in your spatial graph. It does so through granular role and permission management called _Role-Based Access Control_. Role-Based Access Control consists of _Roles_, or the level of permissions, and _Role Assignments_, or the association of a role to a user or device.

Using Role-Based Access Control, permission can be granted to a user, a device, a service principal, a user-defined function, all users belonging to a domain, or a tenant. Additionally, the degree of access can also be fine-tuned.

Role-Based Access Control is unique in that permissions are inherited down the spatial graph.

## What can I do with role-based access control?

A developer might use Role-Based Access Control to:

* Grant a user the ability to manage devices for an entire building, or only for a particular room or floor.
* Grant an administrator global access to all spatial graph nodes for an entire graph, or only for a section of the graph.
* Grant a support specialist read access to the graph, except for access keys.
* Grant every member of a domain read access to all graph objects.

## Role-based access control best practices

[!INCLUDE [digital-twins-permissions](../../includes/digital-twins-rbac-best-practices.md)]

## Roles

### Role definitions

A **role definition** is a collection of permissions and is sometimes called a **role**. The role definition lists the allowed operations including *create*, *read*, *update*, and *delete*. It also specifies to which object types these permissions apply.

The following roles are available in Azure Digital Twins:

* **Space Administrator**: Create, Read, Update, and Delete permission for the specified space and all nodes underneath. Global permission.
* **User Administrator**: Create, Read, Update, and Delete permission for users and user-related objects. Read permission for spaces.
* **Device Administrator**: Create, Read, Update, and Delete permission for devices and device-related objects. Read permission for spaces.
* **Key Administrator**: Create, Read, Update, and Delete permission for access keys. Read permission for spaces.
* **Token Administrator**: Read and Update permission for access keys. Read permission for spaces.
* **User**: Read permission for spaces, sensors, and users, including their corresponding related objects.
* **Support Specialist**: Read permission for everything except access keys.
* **Device Installer**: Read and Update permission for devices and sensors, including their corresponding related objects. Read permission for spaces.
* **Gateway Device**: Create permission for sensors. Read permission for devices and sensors, including their corresponding related objects.

>[!NOTE]
> *The full definitions for the above can be retrieved by querying the system/roles API.*

### Object types

The `ObjectIdType` refers to the type of identity that is being given a role. Apart from the `DeviceId` and `UserDefinedFunctionId` types, the types correspond to a property of an Azure Active Directory (Azure AD) object:
  
* The `UserId` type assigns a role to a user.
* The `DeviceId` type assigns a role to a device.
* The `DomainName` type assigns a role to a domain name. Each user with the specified domain name will have the access rights of the corresponding role.
* The `TenantId` type assigns a role to a tenant. Each user belonging to the specified Azure AD tenant ID will have the access rights of the corresponding role.
* The `ServicePrincipalId` type assigns a role to a service principal object ID.
* The `UserDefinedFunctionId` type assigns a role to a User-Defined Function (UDF).

> [!div class="nextstepaction"]
> [Query or the object ID for a user](https://docs.microsoft.com/powershell/module/azuread/get-azureaduser?view=azureadps-2.0)

> [!div class="nextstepaction"]
> [Obtain the object ID for a service principal](https://docs.microsoft.com/powershell/module/azurerm.resources/get-azurermadserviceprincipal?view=azurermps-6.8.1)

> [!div class="nextstepaction"]
> [Retrieve the object ID for an Azure AD tenant](https://docs.microsoft.com/azure/active-directory/develop/quickstart-create-new-tenant)

## Role assignments

Permissions are granted to a recipient by creating a role assignment, and revoked by removing a role assignment. An Azure Digital Twins role assignment associates an object (user, Azure AD tenant, etc.), role, and a space. Permissions are then granted to all objects that belong to that space, including the entire spatial graph beneath it.

For example, a user is given a role assignment with role `DeviceInstaller` for the root node of a spatial graph, which represents a building. The user is then able to Read and Update devices not only for that node, but all other child spaces in the building.

## Next steps

To learn about Azure Digital Twins security, read [Create and manage role assignments](./security-create-manage-role-assignments.md).
