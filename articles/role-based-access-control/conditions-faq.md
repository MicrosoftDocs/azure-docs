---
title: FAQ for Azure role assignment conditions - Azure ABAC
description: Frequently asked questions for Azure role assignment conditions
services: active-directory
author: rolyon
manager: amycolannino
ms.service: role-based-access-control
ms.subservice: conditions
ms.topic: conceptual
ms.workload: identity
ms.date: 10/24/2022
ms.author: rolyon

#Customer intent: 
---

# FAQ for Azure role assignment conditions

## Frequently asked questions

**Can you pick the storage container names or blob path in the condition builder in the Azure portal?**

You must write the storage container name, blob path, tag name, or values in the condition. There is no picking experience for the attribute values.

**Can you group expressions?**

If you add three or more expressions for a targeted action, you must define the logical grouping of those expressions in the code editor, Azure PowerShell, or Azure CLI. A logical grouping of `a AND b OR c` can be either `(a AND b) OR c` or `a AND (b OR c )`.

**Are conditions supported via Azure AD Privileged Identity Management (Azure AD PIM) for Azure resources?**

Yes, for specific roles. For more information, see [Assign Azure resource roles in Privileged Identity Management](../active-directory/privileged-identity-management/pim-resource-roles-assign-roles.md).

**Are conditions supported for classic administrators?**

No. 

**Can you add conditions to custom role assignments?**

Yes, as long as the custom role includes [actions that support conditions](conditions-format.md#actions).
 
**Do the conditions increase latency for access to storage blobs?**

No, based on our benchmark tests, conditions are not expected to add any user perceivable latency.

**What new properties have been introduced in the role assignment schema to support conditions?**

Here are the new condition properties:

- `condition`: Condition statement built using one or more actions from role definition and attributes.
- `conditionVersion`: A condition version number. Defaults to 2.0 and is the only publicly supported version.

There is also a new description property for role assignments:

- `description`: The description for the role assignment that can be used to describe the condition.

**Is a condition applied to the entire role assignment or specific actions?**

A condition is only applied to the specific targeted actions.

**What are the limits for a condition?**

A condition can be up to to 8 KB long.

**What are the limits for a description?**

A description can be up to 2 KB long.

**Is it possible to create a role assignment with and without a condition, but using the same tuple of security principal, role definition, and scope?**

No, if you try to create this role assignment, an error is displayed.

**Are conditions in role assignments offering an explicit deny effect?**

No, conditions in role assignments do not have an explicit deny effect. Conditions in role assignments filter down access granted in a role assignment, which can result in access not allowed. Explicit deny effect is part of deny assignments.

## Next steps

- [Azure role assignment condition format and syntax](conditions-format.md)
- [Troubleshoot Azure role assignment conditions](conditions-troubleshoot.md)
