---
title: Understand resource locking in Azure Blueprints
description: Learn about the locking options to protect resources when assigning a blueprint.
services: blueprints
author: DCtheGeek
ms.author: dacoulte
ms.date: 09/18/2018
ms.topic: conceptual
ms.service: blueprints
manager: carmonm
---
# Understand resource locking in Azure Blueprints

The creation of consistent environments at scale is only truly valuable if there's a mechanism to
ensure that consistency is persisted. This article explains how resource locking works in Azure
Blueprints.

## Locking modes and states

Locking Mode applies to the blueprint assignment and it only has two options: **None** or **All
Resources**. This is configured during blueprint assignment and can't be changed once the
assignment is successfully applied to the subscription.

Resources created by artifact definitions within the blueprint assigned to the subscription have
three states: **Not Locked**, **Read Only**, or **Cannot Edit / Delete**. Any kind of artifact can
have the **Not Locked** state. However, non-resource group artifacts are as **Read Only** and
resource groups are as **Cannot Edit / Delete**. This is an important distinction in how these
resources are managed.

The **Read Only** state is exactly as defined: the resource can't be altered in any way -- no
changes and it can't be deleted. The **Cannot Edit / Delete** is more nuanced because of the
"container" nature of resource groups. The resource group object is read only, but it's possible to
create, update, and delete resources within the resource group -- so long as they aren't part of
any blueprint assignment with the **Read Only** lock state.

## Overriding locking states

While it's typically possible for someone with appropriate [role-based access
control](../../../role-based-access-control/overview.md) (RBAC) on the subscription, such as the
'Owner' role, to be capable of altering or deleting any resource, this isn't the case when
Blueprints applies locking as part of a deployed assignment. If the assignment was set with the
**Lock** option, not even the subscription owner can change the included resources.

This protects the consistency of the defined blueprint and the environment it was designed to
create from accidental or programmatic deletion or alteration.

## Removing locking states

If it becomes necessary to delete the resources created by an assignment, then the only way to
delete them is to first remove the assignment. When the assignment is removed, the locks created by
Blueprints are removed. The resource, however, is left behind and would then need to be deleted
through normal means by someone with appropriate permissions.

## How blueprint locks work

An RBAC role `denyAssignments` is applied to artifact resources during assignment of a blueprint if
the assignment selected the **Lock** option. The role is added by the managed identity of the
blueprint assignment and can only be removed from the artifact resources by the same managed
identity. This enforces the locking mechanism and prevents attempts to remove the blueprint lock
outside Blueprints. Removal of the role and the lock is only possible by removing the blueprint
assignment, which can only be performed by individuals with appropriate rights.

## Next steps

- Learn about the [blueprint life-cycle](lifecycle.md)
- Understand how to use [static and dynamic parameters](parameters.md)
- Learn to customize the [blueprint sequencing order](sequencing-order.md)
- Learn how to [update existing assignments](../how-to/update-existing-assignments.md)
- Resolve issues during the assignment of a blueprint with [general troubleshooting](../troubleshoot/general.md)