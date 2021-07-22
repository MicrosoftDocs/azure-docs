---
title: Use managed identities in Windows VMs | Microsoft Docs 
description: Learn how to use managed identities with Windows VMs using the Azure Portal, CLI, PowerShell, Azure resource manager template  
services: active-directory
documentationcenter: ''
author: barclayn
manager: daveba
editor: ''

ms.service: active-directory
ms.subservice: msi
ms.workload: integration
ms.topic: how-to
ms.date: 07/21/2021
ms.author: barclayn
ms.custom: ep-msia

---

# How to use managed identities with Windows Virtual machines

<!--
Remove all the comments in this template before you sign-off or merge to the main branch.
-->

This article shows you how to use managed identities with a [service name] instance.` [!INCLUDE [managed identities](../../includes/managed-identities-definition.md)] `.

## Prerequisites

- <!-- prerequisite 1 -->
- <!-- prerequisite 2 -->
- <!-- prerequisite n -->
<!-- remove this section if prerequisites are not needed -->

## Create an instance of [service name] with a system assigned managed identity

<!-- Show the steps required to create an instance of your service with a system assigned managed identity enabled using as many of the options show below as possible. You can see additional tab options https://review.docs.microsoft.com/en-us/help/contribute/validation-ref/tabbed-conceptual?branch=master -->

# [Portal](#tab/azure-portal)


# [PowerShell](#tab/azure-powershell)

# [Azure CLI](#tab/azure-cli)

To create an Azure VM with the system-assigned managed identity enabled, your account needs the [Virtual Machine Contributor](../../role-based-access-control/built-in-roles.md#virtual-machine-contributor) role assignment.  No additional Azure AD directory role assignments are required.

1. Create a [resource group](../../azure-resource-manager/management/overview.md#terminology) for containment and deployment of your VM and its related resources, using [az group create](/cli/azure/group/#az_group_create). You can skip this step if you already have resource group you would like to use instead:

   ```azurecli-interactive 
   az group create --name myResourceGroup --location westus
   ```

1. Create a VM using [az vm create](/cli/azure/vm/#az_vm_create). The following example creates a VM named *myVM* with a system-assigned managed identity, as requested by the `--assign-identity` parameter. The `--admin-username` and `--admin-password` parameters specify the administrative user name and password account for virtual machine sign-in. Update these values as appropriate for your environment: 

   ```azurecli-interactive 
   az vm create --resource-group myResourceGroup --name myVM --image win2016datacenter --generate-ssh-keys --assign-identity --admin-username azureuser --admin-password myPassword12
   ```

# [Resource Manager Template](#tab/azure-resource-manager)

---

## Assign a user-assigned managed identity to a service instance

User-assigned managed identities can be used on multiple resources. To learn more about managed identities, for information on how to create or delete user-assigned managed identities you can review [Manage user-assigned managed identities](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots)

<!-- Show the steps required to create an instance of your service using a user-assigned managed identity -->

# [Portal](#tab/azure-portal)

# [PowerShell](#tab/azure-powershell)

# [Azure CLI](#tab/azure-cli)

# [Resource Manager Template](#tab/azure-resource-manager)


---

## Supported scenarios using managed identities

<!-- If there are differences between the support available for user assigned managed identities versus system assigned managed identities call that out here-->

<!--

### User assigned managed identities


### System assigned managed identities


-->

### Grant access to a managed identity

Cosmos DB uses RBAC roles to grant access to either data plan or management plane operations. The article titled [Configure role-based access control with Azure Active Directory for your Azure Cosmos DB account](https://docs.microsoft.com/azure/cosmos-db/how-to-setup-rbac) helps you configure access to data plane operations. 

## Clean up steps

# [Portal](#tab/azure-portal)

1. In the [portal](https://portal.azure.com), select the resource you want to delete.

1. Select **Delete**. 

1. When prompted, confirm the deletion.


# [PowerShell](#tab/azure-powershell)


```azurepowershell-interactive
Remove-AzResource `
  -ResourceGroupName ExampleResourceGroup `
  -ResourceName ExampleVM `
  -ResourceType Microsoft.Compute/virtualMachines
```


# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az resource delete \
  --resource-group ExampleResourceGroup \
  --name ExampleVM \
  --resource-type "Microsoft.Compute/virtualMachines"
```

# [Resource Manager Template](#tab/azure-resource-manager)

TBD what we would show here

## Next steps

Learn more about managed identities for Azure resources:

* [What are managed identities for Azure resources?](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview)
* [Azure Resource Manager templates](https://github.com/Azure/azure-quickstart-templates)


<!--
Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->