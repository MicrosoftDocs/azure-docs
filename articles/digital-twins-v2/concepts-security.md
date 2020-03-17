---
# Mandatory fields.
title: Secure Azure Digital Twins solutions
titleSuffix: Azure Digital Twins
description: Understand security best practices with Azure Digital Twins.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 3/17/2020
ms.topic: conceptual
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Secure Azure Digital Twins with role-based access control

Azure Digital Twins enables precise access control over specific data, resources, and actions in your deployment. It does this through a granular role and permission management strategy called **role-based access control (RBAC)**. 

Here are some sample Azure Digital Twins security requirements that a developer can manage with RBAC:

* Grant a user the ability to manage devices for an entire building, or only for a specific room or floor
* Grant an administrator global access to the entire graph, or only for a section of the graph
* Grant a support specialist read access to the graph, except for access keys
* Grant every member of a domain read access to all graph objects

## How RBAC works

The two main elements of RBAC are:
* **Roles** - These describe a level of permission. Azure Digital Twins Preview supports two roles: *Reader* and *Owner*. 
* **Role assignments** - These associate a role with a user or device.

An Azure Digital Twins role assignment associates a user, group or service principal with a role of *Reader* or *Owner* in order to grant permissions.

To grant permissions to a recipient, create a role assignment in the access control options in the Azure Portal, or via CLI. To revoke permissions, remove the role assignment.

For more details about this process, see [this tutorial](https://github.com/Azure/azure-digital-twins/tree/private-preview/Tutorials).

## RBAC best practices

In most security scenarios, different users require permissions for different things. Consider, for example, an Administrator that needs global access to run all operations for a deployment, and an Operator that only needs read access to monitor devices and sensors. 

In the case above, and in most cases, a best practice for RBAC is to use the **Principle of Least Privilege.** This principle states that roles are granted exactly the access required to fulfill their tasks, and no more.

According to this principle, an identity is granted only:
* The amount of access needed to complete its job
* A role appropriate and limited to carrying out its job

> [!NOTE]
> For the highest level of security, always follow the Principle of Least Privilege.

Another important role-based access control practice is to periodically audit role assignments to verify that each role has the correct permissions. When an individual changes roles or assignments, clean their role/assignment permissions, so that the Principle of Least Privilege is continually being followed.

## Next steps
* To learn more about creating and managing Azure Digital Twins role assignments, visit the tutorial [here](https://github.com/Azure/azure-digital-twins/tree/private-preview/Tutorials).

* Read more about [RBAC for Azure](../role-based-access-control/overview.md).

