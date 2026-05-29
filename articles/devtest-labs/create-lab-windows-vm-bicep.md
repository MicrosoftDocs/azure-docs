---
title: Create a lab in Azure DevTest Labs using Bicep
description: Use Bicep to create a lab that has a virtual machine in Azure DevTest Labs.
ms.author: rosemalcolm
author: RoseHJM
ms.topic: quickstart
ms.custom: subject-armqs, mode-arm, devx-track-bicep, UpdateFrequency2
ms.date: 12/15/2025
#customer intent: As a DevTest Labs administrator, I want to learn about how to use a Bicep template so I can use Bicep to quickly and easily create labs with VMs.
---

# Quickstart: Use Bicep to create a lab in DevTest Labs

This quickstart uses Bicep to create a lab in Azure DevTest Labs that has one Windows Server 2019 Datacenter virtual machine (VM) in it.

[!INCLUDE [About Bicep](~/reusable-content/ce-skilling/azure/includes/resource-manager-quickstart-bicep-introduction.md)]

In this quickstart, you:

> [!div class="checklist"]
> * Review the Bicep file.
> * Deploy the Bicep file to create a lab and VM.
> * Verify the deployment.
> * Clean up resources.

## Prerequisites

- An Azure subscription where you have permissions to create and manage resources. If you don't have one, [create a free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

# [Azure CLI](#tab/CLI)

- [Azure CLI installed](/cli/azure/install-azure-cli-windows)

# [Azure PowerShell](#tab/PowerShell)

- [Azure PowerShell installed](/powershell/scripting/install/install-powershell-on-windows)
- [Bicep installed](/azure/azure-resource-manager/bicep/install#windows)

---

## Review the Bicep file

Review the Bicep file. The file uses the following resource types to take the following actions:

- [Microsoft.DevTestLab/labs](/azure/templates/microsoft.devtestlab/labs) creates the lab.
- [Microsoft.DevTestLab/labs/virtualnetworks](/azure/templates/microsoft.devtestlab/labs/virtualnetworks) creates a virtual network.
- [Microsoft.DevTestLab/labs/virtualmachines](/azure/templates/microsoft.devtestlab/labs/virtualmachines) creates the lab VM.

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.devtestlab/dtl-create-lab-windows-vm-claimed/main.bicep":::

## Deploy the Bicep file

1. Save the Bicep file as *main.bicep* to your local computer.
1. Run the following commands using either Azure CLI or Azure PowerShell from the folder where you saved the Bicep file. In the commands, replace the following placeholders:
   - `<location>`: Azure region you want to use.
   - `<lab-name>`: Name for the new lab.
   - `<vm-name>`: Name for the new VM.
   - `<user-name>`: Username of a local account to create on the new VM. You're prompted to enter a password for the local account. Be sure not to use any disallowed usernames or passwords listed in the **OSProfile** section of [Virtual Machines - Create or Update](/rest/api/compute/virtual-machines/create-or-update).

   # [Azure CLI](#tab/CLI)

   ```azurecli
   az group create --name exampleRG --location <location>
   az deployment group create --resource-group exampleRG --template-file main.bicep --parameters labName=<lab-name> vmName=<vm-name> userName=<user-name>
   ```

   # [Azure PowerShell](#tab/PowerShell)

   ```azurepowershell
   New-AzResourceGroup -Name exampleRG -Location <location>
   New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -labName "<lab-name>" -vmName "<vm-name>" -userName "<user-name>"
   ```

---

The deployment also creates a resource group for the VM named `<lab-name>`-`<vm-name>`-`<numerical-string>`. This resource group contains VM resources like the IP address, network interface, and disk.

When the deployment completes, the output shows data about the resources and the deployment.

## Validate the deployment

Use Azure CLI or Azure PowerShell to list the deployed resources in the resource group. You can also use the Azure portal.

# [Azure CLI](#tab/CLI)

```azurecli
az resource list --resource-group exampleRG
```

# [Azure PowerShell](#tab/PowerShell)

```azurepowershell
Get-AzResource -ResourceGroupName exampleRG
```

---

## Clean up resources

You can use Azure CLI or Azure PowerShell to delete the resource group and all of its resources when you don't need them anymore. You can also use the Azure portal.

If you want to manually delete the lab's resource group, you must delete the lab first. You can't delete a resource group that has a lab in it.

# [CLI](#tab/CLI)

```azurecli
az group delete --name exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell
Remove-AzResourceGroup -Name exampleRG
```

---

## Next step

To connect to lab VMs, see the next tutorial.

> [!div class="nextstepaction"]
> [Access, claim, and connect to a DevTest Labs VM](tutorial-use-custom-lab.md)

## Related content

- [Tutorial: Create a lab and VM and add a user in DevTest Labs](tutorial-create-custom-lab.md)
- [Azure DevTest Labs scenarios](devtest-lab-guidance-get-started.md)
