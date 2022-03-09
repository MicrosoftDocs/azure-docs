---
title: 'Quickstart: Use a Bicep file to create an Ubuntu Linux VM'
description: In this quickstart, you learn how to use a Bicep file to create a Linux virtual machine
author: v-eschaffer
ms.service: virtual-machines
ms.collection: linux
ms.topic: quickstart
ms.workload: infrastructure
ms.date: 06/04/2020
ms.author: v-eschaffer
ms.custom: subject-armqs, mode-arm
tags: azure-resource-manager, bicep
---

# Quickstart: Create an Ubuntu Linux virtual machine using a Bicep file

**Applies to:** :heavy_check_mark: Linux VMs 

This quickstart shows you how to use a Bicep file to deploy an Ubuntu Linux virtual machine (VM) in Azure.

[!INCLUDE [About Bicep](../../../includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the Bicep file

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/vm-simple-linux/).

:::code language="bicep" source="~/azure-quickstart-templates/quickstarts/microsoft.compute/vm-simple-linux/main.bicep":::


Several resources are defined in the Bicep file:

- [**Microsoft.Network/virtualNetworks/subnets**](/azure/templates/Microsoft.Network/virtualNetworks/subnets): create a subnet.
- [**Microsoft.Storage/storageAccounts**](/azure/templates/Microsoft.Storage/storageAccounts): create a storage account.
- [**Microsoft.Network/networkInterfaces**](/azure/templates/Microsoft.Network/networkInterfaces): create a NIC.
- [**Microsoft.Network/networkSecurityGroups**](/azure/templates/Microsoft.Network/networkSecurityGroups): create a network security group.
- [**Microsoft.Network/virtualNetworks**](/azure/templates/Microsoft.Network/virtualNetworks): create a virtual network.
- [**Microsoft.Network/publicIPAddresses**](/azure/templates/Microsoft.Network/publicIPAddresses): create a public IP address.
- [**Microsoft.Compute/virtualMachines**](/azure/templates/Microsoft.Compute/virtualMachines): create a virtual machine.

## Deploy the Bicep file

1. Save the Bicep file as **main.bicep** to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    az group create --name exampleRG --location eastus

    az deployment group create --resource-group exampleRG --template-file main.bicep --parameters serverName=<analysis-service-name>
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location eastus

    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -serverName "<analysis-service-name>"
    ```

    ---

    > [!NOTE]
    > Replace **\<analysis-service-name\>** with a unique analysis service name.

    When the deployment finishes, you should see a message indicating the deployment succeeded.

## Review deployed resources

You can use the Azure portal to check on the VM and other resource that were created. After the deployment is finished, select **Go to resource group** to see the VM and other resources.


## Clean up resources

When no longer needed, delete the resource group, which deletes the VM and all of the resources in the resource group.

1. Select the **Resource group**.
1. On the page for the resource group, select **Delete**.
1. When prompted, type the name of the resource group and then select **Delete**.


## Next steps

In this quickstart, you deployed a simple virtual machine using a Bicep file. To learn more about Azure virtual machines, continue to the tutorial for Linux VMs.


> [!div class="nextstepaction"]
> [Azure Linux virtual machine tutorials](./tutorial-manage-vm.md)
