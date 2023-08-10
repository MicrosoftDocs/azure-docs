---
title: 'Create a NAT gateway - Resource Manager Template'
titleSuffix: Azure NAT Gateway
description: This quickstart shows how to create a NAT gateway by using the Azure Resource Manager template (ARM template).
author: asudbring
ms.service: nat-gateway
ms.topic: how-to
ms.date: 07/21/2023
ms.author: allensu
ms.custom: subject-armqs, devx-track-arm-template, devx-track-azurecli, devx-track-linux
# Customer intent: I want to create a NAT gateway by using an Azure Resource Manager template so that I can provide outbound connectivity for my virtual machines.
---

# Quickstart: Create a NAT gateway - ARM template

Get started with Azure NAT Gateway by using an Azure Resource Manager template (ARM template). This template deploys a virtual network, a NAT gateway resource, and Ubuntu virtual machine. The Ubuntu virtual machine is deployed to a subnet that is associated with the NAT gateway resource.

:::image type="content" source="./media/quickstart-create-nat-gateway-portal/nat-gateway-qs-resources.png" alt-text="Diagram of resources created in nat gateway quickstart.":::

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template opens in the Azure portal.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.network%2Fnat-gateway-1-vm%2Fazuredeploy.json)

## Prerequisites

# [**Portal**](#tab/create-nat-portal)

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

# [**PowerShell**](#tab/create-nat-powershell)

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- Azure PowerShell installed locally or Azure Cloud Shell.

- Sign in to Azure PowerShell and ensure you've selected the subscription with which you want to use this feature.  For more information, see [Sign in with Azure PowerShell](/powershell/azure/authenticate-azureps).

- Ensure your `Az.Network` module is 4.3.0 or later. To verify the installed module, use the command `Get-InstalledModule -Name "Az.Network"`. If the module requires an update, use the command `Update-Module -Name Az.Network` if necessary.

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

# [**Azure CLI**](#tab/create-nat-cli)

 - If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- This how-to article requires version 2.31.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

---
## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/nat-gateway-1-vm).

This template is configured to create a:

* Virtual network

* NAT gateway resource

* Ubuntu virtual machine

The Ubuntu VM is deployed to a subnet that's associated with the NAT gateway resource.

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.network/nat-gateway-1-vm/azuredeploy.json":::

Nine Azure resources are defined in the template:

* **[Microsoft.Network/networkSecurityGroups](/azure/templates/microsoft.network/networksecuritygroups)**: Creates a network security group.

* **[Microsoft.Network/networkSecurityGroups/securityRules](/azure/templates/microsoft.network/networksecuritygroups/securityrules)**: Creates a security rule.

* **[Microsoft.Network/publicIPAddresses](/azure/templates/microsoft.network/publicipaddresses)**: Creates a public IP address.

* **[Microsoft.Network/publicIPPrefixes](/azure/templates/microsoft.network/publicipprefixes)**: Creates a public IP prefix.

* **[Microsoft.Compute/virtualMachines](/azure/templates/Microsoft.Compute/virtualMachines)**: Creates a virtual machine.

* **[Microsoft.Network/virtualNetworks](/azure/templates/microsoft.network/virtualnetworks)**: Creates a virtual network.

* **[Microsoft.Network/natGateways](/azure/templates/microsoft.network/natgateways)**: Creates a NAT gateway resource.

* **[Microsoft.Network/virtualNetworks/subnets](/azure/templates/microsoft.network/virtualnetworks/subnets)**: Creates a virtual network subnet.

* **[Microsoft.Network/networkinterfaces](/azure/templates/microsoft.network/networkinterfaces)**: Creates a network interface.

## Deploy the template

# [**Portal**](#tab/create-nat-portal)

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.network%2Fnat-gateway-1-vm%2Fazuredeploy.json)

## Review deployed resources

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Resource groups** from the left pane.

1. Select the resource group that you created in the previous section. The default resource group name is **myResourceGroupNAT**

1. Verify the following resources were created in the resource group:

    ![Virtual Network NAT resource group](./media/quick-create-template/nat-gateway-template-rg.png)

# [**PowerShell**](#tab/create-nat-powershell)

```azurepowershell-interactive
$location = Read-Host -Prompt "Enter the location (i.e. westcentralus)"
$templateUri = "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.network/nat-gateway-1-vm/azuredeploy.json"

$resourceGroupName = "myResourceGroupNAT"

New-AzResourceGroup -Name $resourceGroupName -Location $location
New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri $templateUri
```

# [**Azure CLI**](#tab/create-nat-cli)

```azurecli-interactive
read -p "Enter the location (i.e. westcentralus): " location
resourceGroupName="myResourceGroupNAT"
templateUri="https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.network/nat-gateway-1-vm/azuredeploy.json"

az group create \
--name $resourceGroupName \
--location $location

az deployment group create \
--resource-group $resourceGroupName \
--template-uri  $templateUri
```

---

## Clean up resources

# [**Portal**](#tab/create-nat-portal)

When no longer needed, delete the resource group, NAT gateway, and all related resources. Select the resource group **myResourceGroupNAT** that contains the NAT gateway, and then select **Delete**.

# [**PowerShell**](#tab/create-nat-powershell)

When no longer needed, you can use the [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) command to remove the resource group and all resources contained within.

```azurepowershell-interactive
Remove-AzResourceGroup -Name myResourceGroupNAT
```

# [**Azure CLI**](#tab/create-nat-cli)

When no longer needed, you can use the [az group delete](/cli/azure/group#az-group-delete) command to remove the resource group and all resources contained within.

```azurecli-interactive
  az group delete \
    --name myResourceGroupNAT
```

---

## Next steps

In this quickstart, you created a:

* NAT gateway resource

* Virtual network

* Ubuntu virtual machine

The virtual machine is deployed to a virtual network subnet associated with the NAT gateway.

To learn more about Azure NAT Gateway and Azure Resource Manager, continue to the following articles.

* Read an [Overview of Azure NAT Gateway](nat-overview.md)

* Read about the [NAT Gateway resource](nat-gateway-resource.md)

* Learn more about [Azure Resource Manager](../azure-resource-manager/management/overview.md)
