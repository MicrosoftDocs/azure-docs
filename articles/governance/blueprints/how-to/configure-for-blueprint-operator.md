---
title: Set up your environment for Blueprint Operator
description: Learn how to configure your Azure environment for use with the Blueprint Operator built-in role-based access control (RBAC) role.
ms.date: 05/06/2020
ms.topic: how-to
---
# Configure your environment for a Blueprint Operator

The management of your blueprint definitions and blueprint assignments can be assigned to different
teams. It's common for an architect or governance team to be responsible for the lifecycle
management of your blueprint definitions while an operations team is responsible for managing
assignments of those centrally controlled blueprint definitions.

The **Blueprint Operator** built-in role-based access control (RBAC) is designed specifically for
use in this type of scenario. The role allows for operations type teams to manage the assignment of
the organizations blueprint definitions, but not the ability to modify them. Doing so requires some
configuration in your Azure environment and this article explains the necessary steps.

## Grant permission to the Blueprint Operator

The first step is to grant the **Blueprint Operator** role to the account or security group
(recommended) that is going to be assigning blueprints. This action should be done at the highest
level in the management group hierarchy that encompasses all of the management groups and
subscriptions the operations team should have blueprint assignment access to. It's recommended to
follow the principle of least privilege when granting these permissions.

1. (Recommended) [Create a security group and add members](../../../active-directory/fundamentals/active-directory-groups-create-azure-portal.md)

1. [Add a role assignment](../../../role-based-access-control/role-assignments-portal.md#add-a-role-assignment)
   of **Blueprint Operator** to the account or security group

## User-assign managed identity

A blueprint definition can use either system-assigned or user-assigned managed identities. However,
when using the **Blueprint Operator** role, the blueprint definition needs to be configured to use a
user-assigned managed identity. Additionally, the account or security group being granted the
**Blueprint Operator** role needs to be granted the **Managed Identity Operator** role on the
user-assigned managed identity. Without this permission, blueprint assignments fail because of lack
of permissions.

1. [Create a user-assigned managed identity](../../../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal.md#create-a-user-assigned-managed-identity)
   for use by an assigned blueprint

1. [Add a role assignment](../../../role-based-access-control/role-assignments-portal.md#add-a-role-assignment)
   of **Managed Identity Operator** to the account or security group. Scope the role assignment to
   the new user-assigned managed identity.

1. As the **Blueprint Operator**,
   [assign a blueprint](../create-blueprint-portal.md#assign-a-blueprint) that uses the new
   user-assigned managed identity.

## Next steps

- Learn about the [blueprint lifecycle](../concepts/lifecycle.md).
- Understand how to use [static and dynamic parameters](../concepts/parameters.md).
- Learn to customize the [blueprint sequencing order](../concepts/sequencing-order.md).
- Find out how to make use of [blueprint resource locking](../concepts/resource-locking.md).
- Resolve issues during the assignment of a blueprint with [general troubleshooting](../troubleshoot/general.md).