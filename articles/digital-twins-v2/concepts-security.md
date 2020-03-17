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

# Understand security best practices

Azure Digital Twins enables precise access control over specific data, resources, and actions in your deployment. It does so through granular role and permission management called **role-based access control (RBAC)**. RBAC consists of roles and role assignments. Roles identify the level of permissions. Role assignments associate a role with a user or device.
Using RBAC, permission can be granted to a user, a group or a service principal.

## What can I do with RBAC?

A developer might use RBAC to:
* Grant a user the ability to manage devices for an entire building, or only for a specific room or floor.
* Grant an administrator global access to the entire graph, or only for a section of the graph.
* Grant a support specialist read access to the graph, except for access keys.
* Grant every member of a domain read access to all graph objects.

Note that ADTv2 Preview supports two roles: Reader and Owner.  There can be configured in the IAM pane of Azure Portal. For details, see <link to tutorial folder in private preview repo>

## RBAC best practices
Role-based access control is a security strategy for managing access, permissions, and roles.  For example, an Administrator might need global access to run all operations for a deployment. On the other hand, an Operator might need only read to monitor devices and sensors.
In every case, roles are granted exactly and no more than the access required to fulfill their tasks per the Principle of Least Privilege. 

According to this principle, an identity is granted only:
* The amount of access needed to complete its job.
* A role appropriate and limited to carrying out its job.

>[!IMPORTANT]
>Always follow the Principle of Least Privilege.

Two other important role-based access control practices to follow:
*    Periodically audit role assignments to verify that each role has the correct permissions.
*    Clean up roles and assignments when individuals change roles or assignments.

## Role assignments

An Azure Digital Twins role assignment associates a user, group or service principal with a role of reader or owner. 
<Screen shot of IAM in Portal with role selection – from Mitigation doc>

To grant permissions to a recipient, create a role assignment in the IAM pane of Azure Portal or via CLI. To revoke permissions, remove the role assignment.

## Next steps
*  To learn more about creating and managing Azure Digital Twins role assignments, read <link to tutorial/how to>.
*  Read more about RBAC for Azure.

