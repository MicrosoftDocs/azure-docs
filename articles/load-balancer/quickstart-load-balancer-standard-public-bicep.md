---
title: "Quickstart: Create a public load balancer - Bicep"
titleSuffix: Azure Load Balancer
description: This quickstart shows how to create a load balancer using a Bicep file.
services: load-balancer
author: mbender-ms
ms.service: azure-load-balancer
ms.topic: quickstart
ms.date: 12/06/2024
ms.author: mbender
ms.custom: mvc, subject-bicepqs, mode-arm, template-quickstart, devx-track-bicep
#Customer intent: I want to create a load balancer by using a Bicep file so that I can load balance internet traffic to VMs.
---

# Quickstart: Create a public load balancer to load balance VMs using a Bicep file

In this quickstart, you learn to use a BICEP file to create a public Azure load balancer. The public load balancer distributes traffic to virtual machines in a virtual network located in the load balancer's backend pool. Along with the public load balancer, this template creates a virtual network, network interfaces, a NAT Gateway, and an Azure Bastion instance.

:::image type="content" source="media/quickstart-load-balancer-standard-public-portal/public-load-balancer-resources.png" alt-text="Diagram of resources deployed for a standard public load balancer." lightbox="media/quickstart-load-balancer-standard-public-portal/public-load-balancer-resources.png":::

Using a Bicep file takes fewer steps comparing to other deployment methods.

[!INCLUDE [About Bicep](~/reusable-content/ce-skilling/azure/includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the Bicep file

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/load-balancer-standard-create/).

Load balancer and public IP SKUs must match. When you create a standard load balancer, you must also create a new standard public IP address that is configured as the frontend for the standard load balancer. If you want to create a basic load balancer, use [this template](https://azure.microsoft.com/resources/templates/2-vms-loadbalancer-natrules/). Microsoft recommends using standard SKU for production workloads.

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.network/load-balancer-standard-create/main.bicep":::

Multiple Azure resources have been defined in the bicep file:

- [**Microsoft.Network/loadBalancers**](/azure/templates/microsoft.network/loadbalancers)
- [**Microsoft.Network/publicIPAddresses**](/azure/templates/microsoft.network/publicipaddresses): for the load balancer, bastion host, and the NAT gateway.
- [**Microsoft.Network/bastionHosts**](/azure/templates/microsoft.network/bastionhosts)
- [**Microsoft.Network/networkSecurityGroups**](/azure/templates/microsoft.network/networksecuritygroups)
- [**Microsoft.Network/virtualNetworks**](/azure/templates/microsoft.network/virtualnetworks)
- [**Microsoft.Compute/virtualMachines**](/azure/templates/microsoft.compute/virtualmachines) (3).
- [**Microsoft.Network/networkInterfaces**](/azure/templates/microsoft.network/networkinterfaces) (3).
- [**Microsoft.Compute/virtualMachine/extensions**](/azure/templates/microsoft.compute/virtualmachines/extensions) (3): use to configure the Internet Information Server (IIS), and the web pages.
- [**Microsoft.Network/natGateways**](/azure/templates/microsoft.network/natgateways): for the NAT gateway.

> [!IMPORTANT]
> [!INCLUDE [Pricing](~/reusable-content/ce-skilling/azure/includes/bastion-pricing.md)]

To find more Bicep files or ARM templates that are related to Azure Load Balancer, see [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Network&pageNumber=1&sort=Popular).

## Deploy the Bicep file

1. Save the Bicep file as **main.bicep** to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    az group create --name exampleRG --location EastUS
    az deployment group create --resource-group exampleRG --template-file main.bicep
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location EastUS
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep
    ```
    ---

    > [!NOTE]
    > The Bicep file deployment creates three availability zones. Availability zones are supported only in [certain regions](../reliability/availability-zones-overview.md). Use one of the supported regions. If you aren't sure, enter **EastUS**.

    You're prompted to enter the following values:

    - **projectName**: used for generating resource names.
    - **adminUsername**: virtual machine administrator username.
    - **adminPassword**: virtual machine administrator password.

It takes about 10 minutes to deploy the Bicep file.

## Review deployed resources

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Resource groups** from the left pane.

1. Select the resource group that you created in the previous section. The default resource group name is **exampleRG**.

1. Select the load balancer. Its default name is the project name with **-lb** appended.

1. Copy only the IP address part of the public IP address, and then paste it into the address bar of your browser.

    :::image type="content" source="./media/quickstart-load-balancer-standard-public-template/azure-standard-load-balancer-resource-manager-template-deployment-public-ip.png" alt-text="Screenshot of Azure standard load balancer Resource Manager template public IP.":::

    The browser displays the default page of the Internet Information Services (IIS) web server.

    :::image type="content" source="./media/quickstart-load-balancer-standard-public-template/load-balancer-test-web-page.png" alt-text="Screenshot of IIS web server.":::

To see the load balancer distribute traffic across all three VMs, you can force a refresh of your web browser from the client machine.

## Clean up resources

When you no longer need them, delete the:

- Resource group
- Load balancer
- Related resources

Go to the Azure portal, select the resource group that contains the load balancer, and then select **Delete resource group**.

## Next steps

In this quickstart, you:

- Created a virtual network for the load balancer and virtual machines.
- Created an Azure Bastion host for management.
- Created a standard load balancer and attached VMs to it.
- Configured the load-balancer traffic rule, and the health probe.
- Tested the load balancer.

To learn more, continue to the tutorials for Azure Load Balancer.

> [!div class="nextstepaction"]
> [Azure Load Balancer tutorials](./quickstart-load-balancer-standard-public-portal.md)
