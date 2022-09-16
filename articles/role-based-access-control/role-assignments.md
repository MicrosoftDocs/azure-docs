---
title: Understand Azure role assignments - Azure RBAC
description: Learn about Azure role assignments in Azure role-based access control (Azure RBAC) for fine-grained access management of Azure resources.
services: active-directory
documentationcenter: ''
author: johndowns
ms.service: role-based-access-control
ms.topic: conceptual
ms.workload: identity
ms.date: 09/15/2022
ms.author: jodowns
ms.custom:
---
# Understand Azure role assignments

A role assignment is ...

- The *principal*, or *who* is assigned the role.
- The *role definition* that they're assigned.
- The *scope* at which the role is assigned.
- The *name* of the role assignment.

For example, you can use Azure RBAC to assign roles like:

- User Sally has owner access to the storage account *contoso123* in the resource group *ContosoStorage*.
- User Olma has reader access to all resources in the resource group *ContosoStorage*.
- The managed identity associated with an application is allowed to restart virtual machines within Contoso's subscription.

## Scope

TODO

## Name

TODO

## Role to assign

TODO

## Principal

TODO

## Description

TODO

## Resource deletion behavior

TODO

## Next steps

* [Understand role definitions](role-definitions.md)
