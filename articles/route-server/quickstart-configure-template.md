---
title: 'Quickstart: Create an Azure Route Server - ARM template'
description: In this quickstart, you learn how to create an Azure Route Server using Azure Resource Manager template (ARM template).
services: route-server
author: halkazwini
ms.service: route-server
ms.topic: quickstart
ms.date: 04/18/2023
ms.author: halkazwini
ms.custom: template-quickstart, subject-armqs, mode-arm, template-quickstart, devx-track-arm-template, engagement-fy23
---

# Quickstart: Create an Azure Route Server using an ARM template

This quickstart helps you learn how to use an Azure Resource Manager template (ARM template) to deploy an Azure Route Server into a new or existing virtual network.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button to open the template in the Azure portal.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.network%2Froute-server%2Fazuredeploy.json)

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Review the [service limits for Azure Route Server](route-server-faq.md#limitations).

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/route-server).

Using this template, you deploy an Azure Route Server into a new or existing virtual network. A dedicated subnet named `RouteServerSubnet` is created to host the Route Server. The Route Server will also be configured with the Peer ASN and Peer IP to establish a BGP peering.

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.network/route-server/azuredeploy.json" range="001-184" highlight="104-142":::

Multiple Azure resources have been defined in the template:

* [**Microsoft.Network/virtualNetworks**](/azure/templates/microsoft.network/virtualNetworks?pivots=deployment-language-arm-template)
* [**Microsoft.Network/virtualNetworks/subnets**](/azure/templates/microsoft.network/virtualNetworks/subnets?pivots=deployment-language-arm-template) (two subnets, one named `routeserversubnet`)
* [**Microsoft.Network/virtualHubs**](/azure/templates/microsoft.network/virtualhubs?pivots=deployment-language-arm-template) (Route Server deployment)
* [**Microsoft.Network/virtualHubs/ipConfigurations**](/azure/templates/microsoft.network/virtualhubs/ipConfigurations?pivots=deployment-language-arm-template)
* [**Microsoft.Network/virtualHubs/bgpConnections**](/azure/templates/microsoft.network/virtualhubs/bgpconnections?pivots=deployment-language-arm-template) (Peer ASN and Peer IP configuration)


To find more templates, see [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Network&pageNumber=1&sort=Popular).

## Deploy the template

1. Select **Open Cloudshell** from the following code block to open Azure Cloud Shell, and then follow the instructions to sign in to Azure.

    ```azurepowershell-interactive
    $projectName = Read-Host -Prompt "Enter a project name that is used for generating resource names"
    $location = Read-Host -Prompt "Enter the location (i.e. centralus)"
    $templateUri = "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.network/route-server/azuredeploy.json"

    $resourceGroupName = "${projectName}rg"

    New-AzResourceGroup -Name $resourceGroupName -Location "$location"
    New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri $templateUri

    Read-Host -Prompt "Press [ENTER] to continue ..."
    ```

    Wait until you see the prompt from the console.

1. Select **Copy** from the previous code block to copy the PowerShell script.

1. Right-click the shell console pane and then select **Paste**.

1. Enter the values.

    The resource group name is the project name with **rg** appended.

    It takes about 20 minutes to deploy the template. When completed, the output is similar to:

    :::image type="content" source="./media/quickstart-configure-template/powershell-output.png" alt-text="Route Server Resource Manager template PowerShell deployment output.":::

Azure PowerShell is used to deploy the template. In addition to Azure PowerShell, you can also use the Azure portal, Azure CLI, and REST API. To learn other deployment methods, see [Deploy templates](../azure-resource-manager/templates/deploy-portal.md).

## Validate the deployment

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Resource groups** from the left pane.

1. Select the resource group that you created in the previous section. The default resource group name is the project name with **rg** appended.

1. The resource group should contain only the virtual network:

     :::image type="content" source="./media/quickstart-configure-template/resource-group.png" alt-text="Route Server deployment resource group with virtual network.":::

1. Go to https://aka.ms/routeserver.

1. Select the Route Server named **routeserver** to verify that the deployment was successful.

    :::image type="content" source="./media/quickstart-configure-template/deployment.png" alt-text="Screenshot of Route Server overview page.":::

## Clean up resources

When you no longer need the resources that you created with the Route Server, delete the resource group to remove the Route Server and all the related resources.

To delete the resource group, call the `Remove-AzResourceGroup` cmdlet:

```azurepowershell-interactive
Remove-AzResourceGroup -Name <your resource group name>
```

## Next steps

In this quickstart, you created a:

* Virtual Network
* Subnet
* Route Server

After you create the Azure Route Server, continue to learn about how Azure Route Server interacts with ExpressRoute and VPN Gateways: 

> [!div class="nextstepaction"]
> [Azure ExpressRoute and Azure VPN support](expressroute-vpn-support.md)
