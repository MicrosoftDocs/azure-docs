---
ms.author: mumian
ms.service: bicep, arm-templates
ms.topic: include
ms.date: 08/19/2025
---

### Required permissions

To deploy a Bicep file or Azure Resource Manager (ARM) template, you need write access on the resources you're deploying and access to all operations on the `Microsoft.Resources/deployments` resource type. For example, to deploy a virtual machine, you need `Microsoft.Compute/virtualMachines/write` and `Microsoft.Resources/deployments/*` permissions.  The what-if operation has the same permission requirements.

Azure CLI version **2.76.0 or later** and Azure PowerShell version **13.4.0 or later** introduce the ValidationLevel switch to determine how thoroughly ARM validates the Bicep template during this process. For more information, see [What-if commands](../articles/azure-resource-manager/bicep/deploy-what-if.md#what-if-commands)

For a list of roles and permissions, see [Azure built-in roles](../articles/role-based-access-control/built-in-roles.md).
