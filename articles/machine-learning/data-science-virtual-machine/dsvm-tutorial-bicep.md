---
title: 'Quickstart: Create an Azure Data Science VM - Bicep'
titleSuffix: Azure Data Science Virtual Machine
description: In this quickstart, you use Bicep to quickly deploy a Data Science Virtual Machine.
services: machine-learning
author: s-polly
ms.author: scottpolly
ms.reviewer: franksolomon
ms.date: 04/22/2024
ms.topic: quickstart
ms.service: data-science-vm
ms.custom: subject-armqs, mode-arm, devx-track-bicep
---

# Quickstart: Create an Ubuntu Data Science Virtual Machine using Bicep

This quickstart shows how to create an Ubuntu Data Science Virtual Machine using Bicep. A Data Science Virtual Machine (DSVM) is a cloud-based virtual machine, preloaded with a suite of data science and machine learning frameworks and tools. When deployed on GPU-powered compute resources, all tools and libraries are configured to use the GPU.

[!INCLUDE [About Bicep](../../../includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/services/machine-learning/) before you begin.

## Review the Bicep file

This quickstart uses the Bicep file from the [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/vm-ubuntu-DSVM-GPU-or-CPU/).

:::code language="bicep" source="~/quickstart-templates/application-workloads/datascience/vm-ubuntu-DSVM-GPU-or-CPU/main.bicep":::

The Bicep file defines these resources:

* [Microsoft.Network/networkInterfaces](/azure/templates/microsoft.network/networkinterfaces)
* [Microsoft.Network/networkSecurityGroups](/azure/templates/microsoft.network/networksecuritygroups)
* [Microsoft.Network/virtualNetworks](/azure/templates/microsoft.network/virtualnetworks)
* [Microsoft.Network/publicIPAddresses](/azure/templates/microsoft.network/publicipaddresses)
* [Microsoft.Storage/storageAccounts](/azure/templates/microsoft.storage/storageaccounts)
* [Microsoft.Compute/virtualMachines](/azure/templates/microsoft.compute/virtualmachines): Create a cloud-based virtual machine. In this template, the virtual machine is configured as a Data Science Virtual Machine that runs Ubuntu.

## Deploy the Bicep file

1. Save the Bicep file as **main.bicep** to your local computer
1. Deploy the Bicep file with either Azure CLI or Azure PowerShell

    # [Azure CLI](#tab/CLI)

    ```azurecli
    az group create --name exampleRG --location eastus
    az deployment group create --resource-group exampleRG --template-file main.bicep --parameters adminUsername=<admin-user> vmName=<vm-name>
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location eastus
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -adminUsername "<admin-user>" -vmName "<vm-name>" 
    ```

    ---

    > [!NOTE]
    > Replace **\<admin-user\>** with the username for the administrator account. Replace **\<vm-name\>** with the name of your virtual machine.

    When the deployment finishes, you should see a message indicating that the deployment succeeded.

## Review deployed resources

Use the Azure portal, Azure CLI, or Azure PowerShell to list the deployed resources in the resource group.

# [Azure CLI](#tab/CLI)

```azurecli-interactive
az resource list --resource-group exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Get-AzResource -ResourceGroupName exampleRG
```

---

## Clean up resources

When you no longer need your resources, use the Azure portal, Azure CLI, or Azure PowerShell to delete both the resource group and its resources.

# [Azure CLI](#tab/CLI)

```azurecli-interactive
az group delete --name exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Remove-AzResourceGroup -Name exampleRG
```

---

## Next steps

In this quickstart, you created a Data Science Virtual Machine using Bicep.

> [!div class="nextstepaction"]
> [Sample programs & ML walkthroughs](dsvm-samples-and-walkthroughs.md)
