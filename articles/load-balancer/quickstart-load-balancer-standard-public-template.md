---
title: "Quickstart: Create a public load balancer - ARM template"
titleSuffix: Azure Load Balancer
description: This quickstart shows how to create a load balancer by using an Azure Resource Manager template.
services: load-balancer
author: mbender-ms
manager: KumudD
ms.service: load-balancer
ms.topic: quickstart
ms.workload: infrastructure-services
ms.date: 10/25/2023
ms.author: mbender
ms.custom: mvc, subject-armqs, mode-arm, template-quickstart, engagement-fy23, devx-track-arm-template
#Customer intent: I want to create a load balancer by using an Azure Resource Manager template so that I can load balance internet traffic to VMs.
---

# Quickstart: Create a public load balancer to load balance VMs using an ARM template

Load balancing provides a higher level of availability and scale by spreading incoming requests across multiple virtual machines (VMs).

This quickstart shows you how to deploy a standard load balancer to load balance virtual machines.

:::image type="content" source="media/quickstart-load-balancer-standard-public-portal/public-load-balancer-resources.png" alt-text="Diagram of resources deployed for a standard public load balancer." lightbox="media/quickstart-load-balancer-standard-public-portal/public-load-balancer-resources.png":::

Using an ARM template takes fewer steps comparing to other deployment methods.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.network%2Fload-balancer-standard-create%2Fazuredeploy.json)

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/load-balancer-standard-create/).

Load balancer and public IP SKUs must match. When you create a standard load balancer, you must also create a new standard public IP address that is configured as the frontend for the standard load balancer. If you want to create a basic load balancer, use [this template](https://azure.microsoft.com/resources/templates/2-vms-loadbalancer-natrules/). Microsoft recommends using standard SKU for production workloads.

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.network/load-balancer-standard-create/azuredeploy.json":::

Multiple Azure resources have been defined in the template:

- [**Microsoft.Network/loadBalancers**](/azure/templates/microsoft.network/loadbalancers)
- [**Microsoft.Network/publicIPAddresses**](/azure/templates/microsoft.network/publicipaddresses): for the load balancer, bastion host, and for each of the three virtual machines.
- [**Microsoft.Network/bastionHosts**](/azure/templates/microsoft.network/bastionhosts)
- [**Microsoft.Network/networkSecurityGroups**](/azure/templates/microsoft.network/networksecuritygroups)
- [**Microsoft.Network/virtualNetworks**](/azure/templates/microsoft.network/virtualnetworks)
- [**Microsoft.Compute/virtualMachines**](/azure/templates/microsoft.compute/virtualmachines) (3).
- [**Microsoft.Network/networkInterfaces**](/azure/templates/microsoft.network/networkinterfaces) (3).
- [**Microsoft.Compute/virtualMachine/extensions**](/azure/templates/microsoft.compute/virtualmachines/extensions) (3): use to configure the Internet Information Server (IIS), and the web pages.

> [!IMPORTANT]

> [!INCLUDE [Pricing](../../includes/bastion-pricing.md)]

>

To find more templates that are related to Azure Load Balancer, see [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Network&pageNumber=1&sort=Popular).

## Deploy the template

1. Select **Try it** from the following code block to open Azure Cloud Shell, and then follow the instructions to sign in to Azure.

   ```azurepowershell-interactive
   $projectName = Read-Host -Prompt "Enter a project name with 12 or less letters or numbers that is used to generate Azure resource names"
   $location = Read-Host -Prompt "Enter the location (i.e. centralus)"
   $adminUserName = Read-Host -Prompt "Enter the virtual machine administrator account name"
   $adminPassword = Read-Host -Prompt "Enter the virtual machine administrator password" -AsSecureString

   $resourceGroupName = "${projectName}rg"
   $templateUri = "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.network/load-balancer-standard-create/azuredeploy.json"

   New-AzResourceGroup -Name $resourceGroupName -Location $location
   New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri $templateUri -projectName $projectName -location $location -adminUsername $adminUsername -adminPassword $adminPassword

   Write-Host "Press [ENTER] to continue."
   ```

   Wait until you see the prompt from the console.

1. Select **Copy** from the previous code block to copy the PowerShell script.

1. Right-click the shell console pane and then select **Paste**.

1. Enter the values.

   The template deployment creates three availability zones. Availability zones are supported only in [certain regions](../availability-zones/az-overview.md). Use one of the supported regions. If you aren't sure, enter **centralus**.

   The resource group name is the project name with **`rg`** appended. You need the resource group name in the next section.

It takes about 10 minutes to deploy the template. When completed, the output is similar to:

![Azure Standard Load Balancer Resource Manager template PowerShell deployment output](./media/quickstart-load-balancer-standard-public-template/azure-standard-load-balancer-resource-manager-template-powershell-output.png)

Azure PowerShell is used to deploy the template. You can also use the Azure portal, Azure CLI, and REST API. To learn other deployment methods, see [Deploy templates](../azure-resource-manager/templates/deploy-portal.md).

## Review deployed resources

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Resource groups** from the left pane.

1. Select the resource group that you created in the previous section. The default resource group name is the project name with **-rg** appended.

1. Select the load balancer. Its default name is the project name with **-lb** appended.

1. Copy only the IP address part of the public IP address, and then paste it into the address bar of your browser.

   ![Azure standard load balancer Resource Manager template public IP](./media/quickstart-load-balancer-standard-public-template/azure-standard-load-balancer-resource-manager-template-deployment-public-ip.png)

    The browser displays the default page of the Internet Information Services (IIS) web server.

   ![IIS web server](./media/quickstart-load-balancer-standard-public-template/load-balancer-test-web-page.png)

To see the load balancer distribute traffic across all three VMs, you can force a refresh of your web browser from the client machine.

## Clean up resources

When you no longer need them, delete the:

* Resource group
* Load balancer
* Related resources

Go to the Azure portal, select the resource group that contains the load balancer, and then select **Delete resource group**.

## Next steps

In this quickstart, you:

* Created a virtual network for the load balancer and virtual machines.
* Created an Azure Bastion host for management.
* Created a standard load balancer and attached VMs to it.
* Configured the load-balancer traffic rule, and the health probe.
* Tested the load balancer.

To learn more, continue to the tutorials for Azure Load Balancer.

> [!div class="nextstepaction"]
> [Azure Load Balancer tutorials](./quickstart-load-balancer-standard-public-portal.md)
