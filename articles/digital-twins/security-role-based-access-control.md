---
title: Understanding Azure Digital Twins Role-Based Access Control | Microsoft Docs
description: Using Azure Digital Twins Role-Based Access Control
author: adgera
manager: alinast
ms.service: azure-digital-twins
services: azure-digital-twins
ms.topic: conceptual
ms.date: 09/28/2018
ms.author: adgera
---

# Role-based access control

Azure Digital Twins security enables precise access to specific resources and actions in your IoT topology. It does so through granular role and permission management called Digital Twins role-based access control.

Using role-based access control, permission can be granted to the specific user, users, or service principal as needed. Additionally, the degree of access can also be fine-tuned.

Role-based access control is unique in that permissions are inherited down the topology tree.

## What can I do with role-based access control?

* Grant a user the ability to manage devices for an entire building, or only a particular room or floor.
* Grant an admin global access to all topology nodes for an entire topology, or only a section.
* Grant a support specialist read access to the topology, except for access keys.
* Grant every member of a domain read access to all topology objects.

## Role-based access control best practices

[!INCLUDE [digital-twins-permissions](../../includes/digital-twins-rbac-best-practices.md)]

## Role-based access control components

Role-based access control consists of several components that specify what resources can do.

### Role definitions

A **role definition** is a collection of permissions and is sometimes called a **role**.

A **role definition** lists allowed operations including *read*, *write*, and *delete*. It also specifies a set of conditions that might exclude certain object types in the topology.

The following roles are available in role-based access control:

* **Space Administrator**: Global access able to run all operations for the specified space and all nodes underneath.
* **User Administrator**: CRUD for users and user-related objects. Read for spaces.
* **Device Administrator**: CRUD for devices and device-related objects. Read for spaces.
* **Key Administrator**: CRUD for access keys. Read for spaces.
* **Token Administrator**: Read and Update for access keys. Read for spaces.
* **User**: Read access for spaces, sensors, and users, including their corresponding related objects.
* **Support Specialist**: Read access for everything except access keys.
* **Device Installer**: Read and Update for devices and sensors, including their corresponding related objects. Read access for spaces.
* **Gateway Device**: Create access for sensors. Read access for devices and sensors, including their corresponding related objects.

>[!NOTE]
> *The full definitions for the above can be retrieved by querying the system/roles API.*

### Object types

The `ObjectIdType` refers to the type of identity that is being given a role. Apart from the `DeviceId` and `UserDefinedFunctionId` types, the types correspond to a property of an Azure Active Directory (AAD) object:
  
* The `UserId` type assigns a role to a user.
* The `DeviceId` type assigns a role to a device.
* The `DomainName` type assigns a role to a domain name. Each user with the specified domain name will have the access rights of the corresponding role.
* The `TenantId` type assigns a role to a tenant. Each user belonging to the specified AAD tenant id will have the access rights of the corresponding role.
* The `ServicePrincipalId` type assigns a role to a service principal object id.
* The `UserDefinedFunctionId` type assigns a role to a User-Defined Function (UDF).

> [!div class="nextstepaction"]
> [Query or the object id for a user](https://docs.microsoft.com/powershell/module/azuread/get-azureaduser?view=azureadps-2.0)

> [!div class="nextstepaction"]
> [Obtain the object id for a service principal](https://docs.microsoft.com/powershell/module/azurerm.resources/get-azurermadserviceprincipal?view=azurermps-6.8.1)

> [!div class="nextstepaction"]
> [Retrieve the object id for an AAD tenant](https://docs.microsoft.com/azure/active-directory/develop/quickstart-create-new-tenant)

## Role assignments

Permissions are granted by created a role assignment, and revoked by removing a role assignment. A Digital Twins role assignment associates an object (user, AAD tenant, etc.), role, and a space. Permissions are then inherited by any child spaces.

For example, a user is given a role assignment with role `DeviceInstaller` for the root node of a topology, which represents a building. They are then able to read and update devices not only for that node, but all other child spaces in the building.

## Next steps

Read more about Azure Digital Twins security:

> [!div class="nextstepaction"]
> [Create and manage role assignments] (./security-create-manage-role-assignments.md)