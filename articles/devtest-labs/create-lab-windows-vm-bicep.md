---
title: Create a lab in Azure DevTest Labs using Bicep
description: Use Bicep to create a lab that has a virtual machine in Azure DevTest Labs.
ms.author: rosemalcolm
author: RoseHJM
ms.topic: quickstart
ms.custom: subject-armqs, mode-arm, devx-track-bicep, UpdateFrequency2
ms.date: 09/30/2023
---

# Quickstart: Use Bicep to create a lab in DevTest Labs

This quickstart uses Bicep to create a lab in Azure DevTest Labs that has one Windows Server 2019 Datacenter virtual machine (VM) in it.

In this quickstart, you take the following actions:

> [!div class="checklist"]
> * Review the Bicep file.
> * Deploy the Bicep file to create a lab and VM.
> * Verify the deployment.
> * Clean up resources.

## Prerequisites

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the Bicep file

[!INCLUDE [About Bicep](../../includes/resource-manager-quickstart-bicep-introduction.md)]

The Bicep file defines the following resource types:

- [Microsoft.DevTestLab/labs](/azure/templates/microsoft.devtestlab/labs) creates the lab.
- [Microsoft.DevTestLab/labs/virtualnetworks](/azure/templates/microsoft.devtestlab/labs/virtualnetworks) creates a virtual network.
- [Microsoft.DevTestLab/labs/virtualmachines](/azure/templates/microsoft.devtestlab/labs/virtualmachines) creates the lab VM.

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.devtestlab/dtl-create-lab-windows-vm-claimed/main.bicep":::

## Deploy the Bicep file

1. Save the Bicep file as **main.bicep** to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    az group create --name exampleRG --location eastus
    az deployment group create --resource-group exampleRG --template-file main.bicep --parameters labName=<lab-name> vmName=<vm-name> userName=<user-name>
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location eastus
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -labName "<lab-name>" -vmName "<vm-name>" -userName "<user-name>"
    ```

    ---

    > [!NOTE]
    > Replace **\<lab-name\>** with the name of the new lab instance. Replace **\<vm-name\>** with the name of the new VM. Replace **\<user-name\>** with username of the local account that will be created on the new VM. You'll also be prompted to enter a password for the local account.

    When the deployment finishes, you should see a message indicating the deployment succeeded.

## Validate the deployment

Use the Azure portal, Azure CLI, or Azure PowerShell to list the deployed resources in the resource group.

# [CLI](#tab/CLI)

```azurecli-interactive
az resource list --resource-group exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Get-AzResource -ResourceGroupName exampleRG
```

---

> [!NOTE]
> The deployment also creates a resource group for the VM. The resource group contains VM resources like the IP address, network interface, and disk. The resource group appears in your subscription's **Resource groups** list with the name **\<lab name>-\<vm name>-\<numerical string>**.

## Clean up resources

When no longer needed, use the Azure portal, Azure CLI, or Azure PowerShell to delete the resource group and all of its resources.

# [CLI](#tab/CLI)

```azurecli-interactive
az group delete --name exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Remove-AzResourceGroup -Name exampleRG
```

---

## Next steps

In this quickstart, you created a lab that has a Windows VM. To learn how to connect to and manage lab VMs, see the next tutorial:

> [!div class="nextstepaction"]
> [Tutorial: Work with lab VMs](tutorial-use-custom-lab.md)
