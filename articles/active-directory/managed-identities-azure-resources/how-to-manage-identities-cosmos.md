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
ms.date: 07/30/2021
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

To create an Azure VM with the system-assigned managed identity enabled, your account needs the [Virtual Machine Contributor](../../role-based-access-control/built-in-roles.md#virtual-machine-contributor) role assignment.  No additional Azure AD directory role assignments are required.

<!-- Show the steps required to create an instance of your service with a system assigned managed identity enabled using as many of the options show below as possible. You can see additional tab options https://review.docs.microsoft.com/en-us/help/contribute/validation-ref/tabbed-conceptual?branch=master -->

# [Portal](#tab/azure-portal)

- From the **Azure portal** search for **virtual machines**.
- Choose **Create**
- In the **Basics** tab provide the required information.
- Choose **Next: Disks >**
- Continue filling out information as needed and in the **Management** tab find the **Identity** section and check the box next to **System assigned managed identity**


:::image type="content" source="media/how-to-manage-identities-vm-cosmos/create-vm-system-assigned-managed-identities.png" alt-text="Image showing how to enable system assigned managed identities while creating a VM":::

For more information, review the Azure virtual machines documentation:

- [Linux](../../virtual-machines/linux/quick-create-portal.md)
- [Windows](../../virtual-machines/windows/quick-create-portal.md)

# [PowerShell](#tab/azure-powershell)

[New-AZVM](https://docs.microsoft.com/powershell/module/az.compute/new-azvm?view=azps-6.3.0) creates resources you reference if they don't exist. To create a VM with a system assigned managed identity enabled pass the parameter **-SystemAssignedIdentity** as shown below. 


```powershell

New-AzVm `
    -ResourceGroupName "My VM" `
    -Name "My resource group" `
    -Location "East US" `
    -VirtualNetworkName "myVnet" `
    -SubnetName "mySubnet" `
    -SecurityGroupName "myNetworkSecurityGroup" `
    -SystemAssignedIdentity
    -OpenPorts 80,3389
```

- [Quickstart: Create a Windows virtual machine in Azure with PowerShell](../..//virtual-machines/windows/quick-create-powershell.md)
- [Quickstart: Create a Linux virtual machine in Azure with PowerShell](../../virtual-machines/linux/quick-create-powershell.md)


# [Azure CLI](#tab/azure-cli)

[Create a Linux virtual machine with a system assigned managed identity](https://docs.microsoft.com/azure/virtual-machines/linux/quick-create-cli)
[Create a Windows virtual machine with a system assigned managed identity](https://docs.microsoft.com/azure/virtual-machines/windows/quick-create-cli)


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

To assign a user-assigned identity to a VM, your account needs the Virtual Machine Contributor and Managed Identity Operator role assignments. No additional Azure AD directory role assignments are required.

<!-- Show the steps required to create an instance of your service using a user-assigned managed identity -->

# [Portal](#tab/azure-portal)

[Configure managed identities for Azure resources on a VM using the Azure portal](qs-configure-portal-windows-vm.md#user-assigned-managed-identity)

# [PowerShell](#tab/azure-powershell)



# [Azure CLI](#tab/azure-cli)

[Configure managed identities for Azure resources on a VM using the Azure portal](qs-configure-cli-windows-vm.md#user-assigned-managed-identity)

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