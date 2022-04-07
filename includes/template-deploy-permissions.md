---

ms.author: daphnemamsft
ms.service: bicep, arm-templates
ms.topic: include
ms.date: 1/07/2022

---

## Required permissions 

To deploy a Bicep file or ARM template, you need write access on the resources you're deploying and access to all operations on the Microsoft.Resources/deployments resource type. For example, to deploy a virtual machine, you need `Microsoft.Compute/virtualMachines/write` and `Microsoft.Resources/deployments/*` permissions.

For a list of roles and permissions, see [Azure built-in roles](../articles/role-based-access-control/built-in-roles.md).
