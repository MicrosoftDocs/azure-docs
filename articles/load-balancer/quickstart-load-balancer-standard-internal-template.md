---
title: 'Quickstart: Create an internal load balancer - ARM template'
description: This quickstart creates an internal Azure load balancer using an Azure Resource Manager template (ARM template).
services: load-balancer
author: mbender-ms
ms.service: load-balancer
ms.topic: quickstart
ms.author: mbender
ms.date: 05/01/2024
ms.custom: subject-armqs, mode-arm, template-quickstart, engagement-fy23, devx-track-arm-template
---

# Quickstart: Create an internal load balancer to load balance VMs using an ARM template

In this quickstart, you learn to use an Azure Resource Manager template (ARM template) to create an internal Azure load balancer. The internal load balancer distributes traffic to virtual machines in a virtual network located in the load balancer's backend pool. Along with the internal load balancer, this template creates a virtual network, network interfaces, a NAT Gateway, and an Azure Bastion instance.

:::image type="content" source="media/quickstart-load-balancer-standard-public-portal/public-load-balancer-resources.png" alt-text="Diagram of resources deployed for a standard public load balancer." lightbox="media/quickstart-load-balancer-standard-public-portal/public-load-balancer-resources.png":::

Using an ARM template takes fewer steps comparing to other deployment methods.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template opens in the Azure portal.

:::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.network%2Finternal-loadbalancer-create%2Fazuredeploy.json":::

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the template

The template used in this quickstart is from the [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/internal-loadbalancer-create/).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.network/internal-loadbalancer-create/azuredeploy.json":::

Multiple Azure resources have been defined in the template:

- [**Microsoft.Network/virtualNetworks**](/azure/templates/microsoft.network/virtualNetworks): Virtual network for load balancer and virtual machines.
- [**Microsoft.Network/networkInterfaces**](/azure/templates/microsoft.network/networkInterfaces): Network interfaces for virtual machines.
- [**Microsoft.Network/loadBalancers**](/azure/templates/microsoft.network/loadBalancers): Internal load balancer.
- [**Microsoft.Network/natGateways**](/azure/templates/microsoft.network/natGateways)
- [**Microsoft.Network/publicIPAddresses**](/azure/templates/microsoft.network/publicipaddresses): Public IP addresses for the NAT Gateway and Azure Bastion.
- [**Microsoft.Compute/virtualMachines**](/azure/templates/microsoft.compute/virtualmachines): Virtual machines in the backend pool.
- [**Microsoft.Network/bastionHosts**](/azure/templates/microsoft.network/bastionhosts): Azure Bastion instance.
- [**Microsoft.Network/virtualNetworks/subnets**](/azure/templates/microsoft.network/virtualnetworks/subnets): Subnets for the virtual network.
- [**Microsoft.Storage/storageAccounts**](/azure/templates/microsoft.storage/storageaccounts): Storage account for the virtual machines.

To find more templates that are related to Azure Load Balancer, see [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Network&pageNumber=1&sort=Popular).

## Deploy the template

In this step, you deploy the template using Azure PowerShell with the `[New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment)` command. 

1. Select **Try it** from the following code block to open Azure Cloud Shell, and then follow the instructions to sign in to Azure.

1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

   # [CLI](#tab/CLI)

   ```azurecli
    echo "Enter a project name with 12 or less letters or numbers that is used to generate Azure resource names"
    read projectName
    echo "Enter the location (i.e. centralus)"
    read location
    
    resourceGroupName="${projectName}rg"
    templateUri="https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.network/internal-loadbalancer-create/azuredeploy.json"
    
    az group create --name $resourceGroupName --location $location
    az deployment group create --resource-group $resourceGroupName --template-uri $templateUri --name $projectName --parameters location=$location
    
    read -p "Press [ENTER] to continue."
   ```

   # [PowerShell](#tab/PowerShell)

   ```azurepowershell
   $projectName = Read-Host -Prompt "Enter a project name with 12 or less letters or numbers that is used to generate Azure resource names"
   $location = Read-Host -Prompt "Enter the location (i.e. centralus)"

   $resourceGroupName = "${projectName}rg"
   $templateUri = "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.network/internal-loadbalancer-create/azuredeploy.json"

   New-AzResourceGroup -Name $resourceGroupName -Location $location
   New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri $templateUri -Name $projectName -location $location

   Write-Host "Press [ENTER] to continue."
    ```
    ---

    You're prompted to enter the following values:

    - **projectName**: used for generating resource names.
    - **adminUsername**: virtual machine administrator username.
    - **adminPassword**: virtual machine administrator password.

It takes about 10 minutes to deploy the Bicep file.

Wait until you see the prompt from the console.

2. Select **Copy** from the previous code block to copy the PowerShell script.

3. Right-click the shell console pane and then select **Paste**.

4. Enter the values.

   The resource group name is the project name with **`rg`** appended. You need the resource group name in the next section.

It takes about 10 minutes to deploy the template. When completed, the output is similar to:

![Azure Standard Load Balancer Resource Manager template PowerShell deployment output](./media/quickstart-load-balancer-standard-internal-template/deployment-commands-output.png)

Azure PowerShell is used to deploy the template. You can also use the Azure portal, Azure CLI, and REST API. To learn other deployment methods, see [Deploy templates](../azure-resource-manager/templates/deploy-portal.md).

## Review deployed resources

Use the Azure portal, Azure CLI, or Azure PowerShell to list the deployed resources in the resource group.

# [CLI](#tab/CLI)

```azurecli-interactive
az resource list --resource-group $resourceGroupName
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Get-AzResource -ResourceGroupName $resourceGroupName
```
# [Azure portal](#tab/portal)
1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Resource groups** from the left pane.

1. Select the resource group that you created in the previous section. The default resource group name is **myResourceGroupLB**

1. Verify the following resources were created in the resource group:

:::image type="content" source="media/quickstart-load-balancer-standard-internal-template/verify-creation.png" alt-text="User Azure portal to verify creation of resources." border="true":::
---

## Clean up resources

When no longer needed, use the Azure portal, Azure CLI, or Azure PowerShell to delete the resource group and its resources.

# [CLI](#tab/CLI)

```azurecli-interactive
Remove-AzResourceGroup -Name "${projectName}rg"
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Remove-AzResourceGroup -Name CreateIntLBQS-rg
```
---

## Next steps

For a step-by-step tutorial that guides you through the process of creating a template, see:

> [!div class="nextstepaction"]
> [Tutorial: Create and deploy your first ARM template](../azure-resource-manager/templates/template-tutorial-create-first-template.md)