---
title: Understand deny assignments in Azure RBAC | Microsoft Docs
description: Learn about deny assignments in role-based access control (RBAC) for resources in Azure.
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
ms.date: 09/24/2018
ms.author: rolyon
ms.reviewer: bagovind
ms.custom: 
---
# Understand deny assignments

Similar to a role assignment, a *deny assignment* binds a set of deny actions to a user, group, or service principal at a particular scope for the purpose of denying access. A deny assignment can also exclude principals and prevent inheritance to child scopes, which is different than role assignments. Currently, deny assignments are **read-only** and can only be set by Azure. This article describes how deny assignments are defined.

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
> | `Principals[i].Id` | Yes | String[] | An array of Azure AD principal object IDs (user, group, or service principal) to which the deny assignment applies. Set to an empty GUID `00000000-0000-0000-0000-000000000000` to represent everyone. |
> | `Principals[i].Type` | No | String[] | An array of object types represented by Principals[i].Id. Set to `Everyone` to represent everyone. |
> | `ExcludePrincipals[i].Id` | No | String[] | An array of Azure AD principal object IDs (user, group, or service principal) to which the deny assignment does not apply. |
> | `ExcludePrincipals[i].Type` | No | String[] | An array of object types represented by ExcludePrincipals[i].Id. |
> | `IsSystemProtected` | No | Boolean | Specifies whether this deny assignment was created by Azure and cannot be edited or deleted. Currently, all deny assignments are system protected. |

## Everyone principal

To support deny assignments, the everyone principal has been introduced. The everyone principal represents all users, groups, and service principals in an Azure AD directory. If the principal ID is a zero GUID `00000000-0000-0000-0000-000000000000` and the principal type is `Everyone`, the principal represents everyone. The everyone principal can be combined with `ExcludePrincipals` to deny everyone except some users. The everyone principal has the following constraints:

- Can be used only in `Principals` and cannot be used in `ExcludePrincipals`.
- `Principals[i].Type` must be set to `Everyone`.

## Next steps

* [List deny assignments using RBAC and the REST API](deny-assignments-rest.md)
* [Understand role definitions](role-definitions.md)
