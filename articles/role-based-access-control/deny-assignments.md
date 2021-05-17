---
title: Understand Azure deny assignments - Azure RBAC
description: Learn about Azure deny assignments in Azure role-based access control (Azure RBAC).
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman

ms.assetid: 
ms.service: role-based-access-control
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 03/26/2020
ms.author: rolyon
ms.reviewer: bagovind
ms.custom: 
---
# Understand Azure deny assignments

Similar to a role assignment, a *deny assignment* attaches a set of deny actions to a user, group, or service principal at a particular scope for the purpose of denying access. Deny assignments block users from performing specific Azure resource actions even if a role assignment grants them access.

This article describes how deny assignments are defined.

## How deny assignments are created

Deny assignments are created and managed by Azure to protect resources. Azure Blueprints and Azure managed apps use deny assignments to protect system-managed resources. Azure Blueprints and Azure managed apps are the only way that deny assignments can be created. You can't directly create your own deny assignments. For more information about how Blueprints uses deny assignments to lock resources, see [Understand resource locking in Azure Blueprints](../governance/blueprints/concepts/resource-locking.md).

> [!NOTE]
> You can't directly create your own deny assignments.

## Compare role assignments and deny assignments

Deny assignments follow a similar pattern as role assignments, but also have some differences.

| Capability | Role assignment | Deny assignment |
| --- | --- | --- |
| Grant access | :heavy_check_mark: |  |
| Deny access |  | :heavy_check_mark: |
| Can be directly created | :heavy_check_mark: |  |
| Apply at a scope | :heavy_check_mark: | :heavy_check_mark: |
| Exclude principals |  | :heavy_check_mark: |
| Prevent inheritance to child scopes |  | :heavy_check_mark: |
| Apply to [classic subscription administrator](rbac-and-directory-admin-roles.md) assignments |  | :heavy_check_mark: |

## Deny assignment properties

 A deny assignment has the following properties:

> [!div class="mx-tableFixed"]
> | Property | Required | Type | Description |
> | --- | --- | --- | --- |
> | `DenyAssignmentName` | Yes | String | The display name of the deny assignment. Names must be unique for a given scope. |
> | `Description` | No | String | The description of the deny assignment. |
> | `Permissions.Actions` | At least one Actions or one DataActions | String[] | An array of strings that specify the management operations to which the deny assignment blocks access. |
> | `Permissions.NotActions` | No | String[] | An array of strings that specify the management operations to exclude from the deny assignment. |
> | `Permissions.DataActions` | At least one Actions or one DataActions | String[] | An array of strings that specify the data operations to which the deny assignment blocks access. |
> | `Permissions.NotDataActions` | No | String[] | An array of strings that specify the data operations to exclude from the deny assignment. |
> | `Scope` | No | String | A string that specifies the scope that the deny assignment applies to. |
> | `DoNotApplyToChildScopes` | No | Boolean | Specifies whether the deny assignment applies to child scopes. Default value is false. |
> | `Principals[i].Id` | Yes | String[] | An array of Azure AD principal object IDs (user, group, service principal, or managed identity) to which the deny assignment applies. Set to an empty GUID `00000000-0000-0000-0000-000000000000` to represent all principals. |
> | `Principals[i].Type` | No | String[] | An array of object types represented by Principals[i].Id. Set to `SystemDefined` to represent all principals. |
> | `ExcludePrincipals[i].Id` | No | String[] | An array of Azure AD principal object IDs (user, group, service principal, or managed identity) to which the deny assignment does not apply. |
> | `ExcludePrincipals[i].Type` | No | String[] | An array of object types represented by ExcludePrincipals[i].Id. |
> | `IsSystemProtected` | No | Boolean | Specifies whether this deny assignment was created by Azure and cannot be edited or deleted. Currently, all deny assignments are system protected. |

## The All Principals principal

To support deny assignments, a system-defined principal named *All Principals* has been introduced. This principal represents all users, groups, service principals, and managed identities in an Azure AD directory. If the principal ID is a zero GUID `00000000-0000-0000-0000-000000000000` and the principal type is `SystemDefined`, the principal represents all principals. In Azure PowerShell output, All Principals looks like the following:

```azurepowershell
Principals              : {
                          DisplayName:  All Principals
                          ObjectType:   SystemDefined
                          ObjectId:     00000000-0000-0000-0000-000000000000
                          }
```

All Principals can be combined with `ExcludePrincipals` to deny all principals except some users. All Principals has the following constraints:

- Can be used only in `Principals` and cannot be used in `ExcludePrincipals`.
- `Principals[i].Type` must be set to `SystemDefined`.

## Next steps

* [Tutorial: Protect new resources with Azure Blueprints resource locks](../governance/blueprints/tutorials/protect-new-resources.md)
* [List Azure deny assignments using the Azure portal](deny-assignments-portal.md)
