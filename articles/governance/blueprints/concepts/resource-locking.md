---
title: Understand resource locking in Azure Blueprints
description: Learn about the locking options to protect resources when assigning a blueprint.
services: blueprints
author: DCtheGeek
ms.author: dacoulte
ms.date: 10/25/2018
ms.topic: conceptual
ms.service: blueprints
manager: carmonm
---
# Understand resource locking in Azure Blueprints

The creation of consistent environments at scale is only truly valuable if there's a mechanism to
maintain that consistency. This article explains how resource locking works in Azure Blueprints.

## Locking modes and states

Locking Mode applies to the blueprint assignment and it only has two options: **None** or **All
Resources**. The locking mode is configured during blueprint assignment and can't be changed once
the assignment is successfully applied to the subscription.

Resources created by artifacts in a blueprint assignment have three states: **Not Locked**, **Read
Only**, or **Cannot Edit / Delete**. Each artifact can be in the **Not Locked** state. However,
non-resource group artifacts have **Read Only** and resource groups have **Cannot
Edit / Delete** states. This difference is an important distinction in how these resources are managed.

The **Read Only** state is exactly as defined: the resource can't be altered in any way -- no
changes and it can't be deleted. The **Cannot Edit / Delete** is more nuanced because of the
"container" nature of resource groups. The resource group object is read only, but it's possible to
make changes to non-locked resources within the resource group.

## Overriding locking states

It's typically possible for someone with appropriate [role-based access
control](../../../role-based-access-control/overview.md) (RBAC) on the subscription, such as the
'Owner' role, to be allowed to alter or delete any resource. This access isn't the case when
Blueprints applies locking as part of a deployed assignment. If the assignment was set with the
**Lock** option, not even the subscription owner can change the included resources.

This security measure protects the consistency of the defined blueprint and the environment it was
designed to create from accidental or programmatic deletion or alteration.

## Removing locking states

If it becomes necessary to delete the resources created by an assignment, the way to delete them is
to first remove the assignment. When the assignment is removed, the locks created by Blueprints are
removed. However, the resource is left behind and would need to be deleted through normal means.

## How blueprint locks work

An RBAC role `denyAssignments` is applied to artifact resources during assignment of a blueprint if
the assignment selected the **Lock** option. The role is added by the managed identity of the
blueprint assignment and can only be removed from the artifact resources by the same managed
identity. This security measure enforces the locking mechanism and prevents removing the blueprint
lock outside Blueprints. Removal of the role and the lock is only possible by removing the
blueprint assignment, which can only be performed by individuals with appropriate rights.

> [!IMPORTANT]
> Azure Resource Manager caches role assignment details for up to 30 minutes. As a result, `denyAssignments`
> on blueprint resources may not immediately be in full effect. During this period of time, it might be
> possible to delete a resource intended to be protected by blueprint locks.

## Next steps

- Learn about the [blueprint life-cycle](lifecycle.md)
- Understand how to use [static and dynamic parameters](parameters.md)
- Learn to customize the [blueprint sequencing order](sequencing-order.md)
- Learn how to [update existing assignments](../how-to/update-existing-assignments.md)
- Resolve issues during the assignment of a blueprint with [general troubleshooting](../troubleshoot/general.md)