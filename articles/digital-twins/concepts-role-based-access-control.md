---
title: Understanding Azure Digital Twins role based access control | Microsoft Docs
description: Using Azure Digital Twins role based access control
author: lyranahughes
manager: alinast
ms.service: azure-digital-twins
services: azure-digital-twins
ms.topic: conceptual
ms.date: 09/20/2018
ms.author: lhughes
---

# Azure Digital Twins Role Based Access Control

Digital Twins Role Based Access Control (DT RBAC) is a system that enables very granular regulation of access to specific resources and actions in your topology. Using RBAC you’re able to segregate duties and grant only the specific amount of access that a user, group of users, or service principal needs to perform a task. 
Digital Twins RBAC is unique in that permissions are inherited down the topology tree (need more on this down below…)

## What can I do with Digital Twins RBAC?

* Grant a user the ability to manage devices for an entire building, or only a particular room or floor
* Grant an Admin global access to all topology nodes for an entire topology, or only a section
* Grant a support specialist read access to the topology, except for access keys
* Grant every member of a domain read access to all topology objects

## Best practice for using Digital Twins RBAC

You should always follow the principle of least privilege to grant an identity only the amount of access that it needs to perform its job. This is particularly important given the downward inheritance that is building into DT RBAC. A periodic auditing of the role assignments that are active for your service is recommended, as well as a clean-up process as individuals change roles or assignments.

### RBAC Components

Role definitions
A role definition is a collection of permissions. It's sometimes just called a role. A role definition lists the operations that can be performed, such as read, write, and delete, as well as a set of conditions that might exclude certain object types in the topology.

The following roles are available in Digital Twins RBAC:

* Space Administrator: Global access able to perform all operations for the specified space and all nodes underneath
* User Administrator: CRUD for users and user related objects. Read for spaces.
* Device Administrator: CRUD for devices and device related objects. Read for spaces.
* Key Administrator: CRUD for access keys. Read for spaces.
* Token Administrator: Read and Update for access keys. Read for spaces.
* User: Read access for spaces, sensors, and users, including their corresponding related objects.
* Support Specialist: Read access for everything except access keys.
* Device Installer: Read and Update for devices and sensors, including their corresponding related objects. Read access for spaces.
* Gateway Device: Create access for sensors. Read access for devices and sensors, including their corresponding related objects.

The full definitions for the above can be retrieved by querying the system/roles API

Object Types

The ObjectIdType refers to the type of identity that is being given a role. Apart from the DeviceId and UserDefinedFunctionId types, the types correspond to a property of an Azure Active Directory (AAD) object.
  
* The UserId type assigns a role to a user.
* The DeviceId type assigns a role to a device.
* The DomainName type assigns a role to a domain name. Each user with the specified domain name will have the access rights of the corresponding role.
* The TenantId type assigns a role to a tenant. Each user belonging to the specified AAD tenant id will have the access rights of the corresponding role.
* The ServicePrincipalId type assigns a role to a service principal object id.
* The UserDefinedFunctionId type assigns a role to a User Defined Function (UDF)

To query for the object id for a user reference the documentation here
To obtain the object id for a service principal reference the documentation here
To retrieve the object id for an AAD tenant reference the documentation here

## Role Assignments

Permissions are granted by created a role assignment, and revoked by removing a role assignment. A Digital Twins role assignment associates an object (user, AAD tenant etc.), role, and a space. Permissions are then inherited down for any child spaces.

For example, a user is given a role assignment with role DeviceInstaller for the root node of a topology, which represents a building. She then is able to read and update devices not only for that node, but all other child spaces in the building.

## Next steps

Creating a role assignment (link to the other page)