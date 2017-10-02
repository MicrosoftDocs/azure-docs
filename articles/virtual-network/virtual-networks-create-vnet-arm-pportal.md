---
title: Create an Azure virtual network with multiple subnets | Microsoft Docs
description: Learn how to create a virtual network with multiple subnets in Azure.
services: virtual-network
documentationcenter: ''
author: jimdial
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 4ad679a4-a959-4e48-a317-d9f5655a442b
ms.service: virtual-network
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 07/26/2017
ms.author: jdial
ms.custom: 

---
# Create a virtual network with multiple subnets

In this tutorial, learn how to create a basic Azure virtual network that has separate public and private subnets. Resources in virtual networks can communicate with each other, and with resources in other networks connected to a virtual network. You can create Azure resources, like Virtual machines, App Service environments, Virtual machine scale sets, Azure HDInsight, and Cloud services in the same, or different subnets within a virtual network. Creating resources in different subnets enables you to filter network traffic in and out of subnets independently with [network security groups](virtual-networks-create-nsg-arm-pportal.md), and to [route traffic between subnets](virtual-network-create-udr-arm-ps.md) through network virtual appliances, such as a firewall, if you choose to. 

The following sections include steps that you can take to create a virtual network by using the [Azure portal](#portal), the Azure command-line interface ([Azure CLI](#azure-cli)), [Azure PowerShell](#powershell), and an [Azure Resource Manager template](#resource-manager-template). The result is the same, regardless of which tool you use to create the virtual network. Click a tool link to go to that section of the tutorial. Learn more about all [virtual network](virtual-network-manage-network.md) and [subnet](virtual-network-manage-subnet.md) settings.

This article provides steps to create a virtual network through the Resource Manager deployment model, which is the deployment model we recommend using when creating new virtual networks. If you need to create a virtual network (classic), see [Create a virtual network (classic)](create-virtual-network-classic.md). If you're not familiar with Azure's deployment models, see [Understand Azure deployment models](../azure-resource-manager/resource-manager-deployment-model.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

## <a name="portal"></a>Azure portal

1. In an Internet browser, go to the [Azure portal](https://portal.azure.com). Log in using your [Azure account](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#account). If you don't have an Azure account, you can sign up for a [free trial](https://azure.microsoft.com/offers/ms-azr-0044p).
2. In the portal, click **+New** > **Networking** > **Virtual network**.
3. On the **Create virtual network** blade, enter the following values, and then click **Create**:

    |Setting|Value|
    |---|---|
    |Name|myVnet|
    |Address space|10.0.0.0/16|
    |Subnet name|Public|
    |Subnet address range|10.0.0.0/24|
    |Resource group|Leave **Create new** selected, and then enter **myResourceGroup**.|
    |Subscription and location|Select your subscription and location.

    If you're new to Azure, learn more about [resource groups](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#resource-group), [subscriptions](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#subscription), and [locations](https://azure.microsoft.com/regions) (also referred to as *regions*).
4. In the portal, you can create only one subnet when you create a virtual network. In this tutorial, you create a second subnet after you create the virtual network. You might later create Internet-accessible resources in the **Public** subnet. You also might create resources that aren't accessible from the Internet in the **Private** subnet. 
To create the second subnet, in the **Search resources** box at the top of the page, enter **myVnet**. In the search results, click **myVnet**. If you have multiple virtual networks with the same name in your subscription, check the resource groups that are listed under each virtual network. Ensure that you click the **myVnet** search result that has the resource group **myResourceGroup**.
5. On the **myVnet** blade, under **SETTINGS**, click **Subnets**.
6. On the **myVnet - Subnets** blade, click **+Subnet**.
7. On the **Add subnet** blade, for **Name**, enter **Private**. For **Address range**, enter **10.0.1.0/24**.  Click **OK**.
8. On the **myVnet - Subnets** blade, review the subnets. You can see the **Public** and **Private** subnets that you created.
9. **Optional:** Complete additional tutorials listed under [Next steps](#next-steps) to filter network traffic in and out of each subnet with network security groups, to route traffic between subnets through a network virtual appliance, or to connect the virtual network to other virtual networks or on-premises networks.
10. **Optional:** Delete the resources that you create in this tutorial by completing the steps in [Delete resources](#delete-portal).

## Azure CLI

Azure CLI commands are the same, whether you execute the commands from Windows, Linux, or macOS. However, there are scripting differences between operating system shells. The script in the following steps executes in a Bash shell. 

1. [Install and configure the Azure CLI](/cli/azure/install-azure-cli?toc=%2fazure%2fvirtual-network%2ftoc.json). Ensure you have the most recent version of the Azure CLI installed. To get help for CLI commands, type `az <command> --help`. Rather than installing the CLI and its pre-requisites, you can use the Azure Cloud Shell. The Azure Cloud Shell is a free Bash shell that you can run directly within the Azure portal. The Cloud Shell has the Azure CLI preinstalled and configured to use with your account. To use the Cloud Shell, click the Cloud Shell (**>_**) button at the top of the [portal](https://portal.azure.com) or just click the *Try it* button in the steps that follow. 
2. If running the CLI locally, log in to Azure with the `az login` command. If using the Cloud Shell, you're already logged in.
3. Review the following script and its comments. In your browser, copy the script and paste it into your CLI session:

    ```azurecli-interactive
    #!/bin/bash
    
    # Create a resource group.
    az group create \
      --name myResourceGroup \
      --location eastus
    
    # Create a virtual network with one subnet named Public.
    az network vnet create \
      --name myVnet \
      --resource-group myResourceGroup \
      --subnet-name Public
    
    # Create an additional subnet named Private in the virtual network.
    az network vnet subnet create \
      --name Private \
      --address-prefix 10.0.1.0/24 \
      --vnet-name myVnet \
      --resource-group myResourceGroup
    ```
    
4. When the script is finished running, review the subnets for the virtual network. Copy the following command, and then paste it into your CLI session:

    ```azurecli
    az network vnet subnet list --resource-group myResourceGroup --vnet-name myVnet --output table
    ```

5. **Optional:** Complete additional tutorials listed under [Next steps](#next-steps) to filter network traffic in and out of each subnet with network security groups, to route traffic between subnets through a network virtual appliance, or to connect the virtual network to other virtual networks or on-premises networks.
6. **Optional**: Delete the resources that you create in this tutorial by completing the steps in [Delete resources](#delete-cli).

## PowerShell

1. Install the latest version of the PowerShell [AzureRm](https://www.powershellgallery.com/packages/AzureRM/) module. If you're new to Azure PowerShell, see [Azure PowerShell overview](/powershell/azure/overview?toc=%2fazure%2fvirtual-network%2ftoc.json).
2. In a PowerShell session, log in to Azure with your [Azure account](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#account) using the `login-azurermaccount` command.

3. Review the following script and its comments. In your browser, copy the script and paste it into your PowerShell session:

    ```powershell
    # Create a resource group.
    New-AzureRmResourceGroup `
      -Name myResourceGroup `
      -Location eastus
    
    # Create the public and private subnets.
    $Subnet1 = New-AzureRmVirtualNetworkSubnetConfig `
      -Name Public `
      -AddressPrefix 10.0.0.0/24
    $Subnet2 = New-AzureRmVirtualNetworkSubnetConfig `
      -Name Private `
      -AddressPrefix 10.0.1.0/24
    
    # Create a virtual network.
    $Vnet=New-AzureRmVirtualNetwork `
      -ResourceGroupName myResourceGroup `
      -Location eastus `
      -Name myVnet `
      -AddressPrefix 10.0.0.0/16 `
      -Subnet $Subnet1,$Subnet2
    ```

4. To review the subnets for the virtual network, copy the following command, and then paste it into your PowerShell session:

    ```powershell
    $Vnet.subnets | Format-Table Name, AddressPrefix
    ```

5. **Optional:** Complete additional tutorials listed under [Next steps](#next-steps) to filter network traffic in and out of each subnet with network security groups, to route traffic between subnets through a network virtual appliance, or to connect the virtual network to other virtual networks or on-premises networks.
6. **Optional**: Delete the resources that you create in this tutorial by completing the steps in [Delete resources](#delete-powershell).

## Resource Manager template

You can deploy a virtual network by using an Azure Resource Manager template. To learn more about templates, see [What is Resource Manager](../azure-resource-manager/resource-group-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#template-deployment). To access the template and to learn about its parameters, see the [Create a virtual network with two subnets](https://azure.microsoft.com/resources/templates/101-vnet-two-subnets/) template. You can deploy the template by using the [portal](#template-portal), [Azure CLI](#template-cli), or [PowerShell](#template-powershell).

Optional steps after you deploy the template:

1. Complete additional tutorials listed under [Next steps](#next-steps) to filter network traffic in and out of each subnet with network security groups, to route traffic between subnets through a network virtual appliance, or to connect the virtual network to other virtual networks or on-premises networks.
2. Delete the resources that you create in this tutorial by completing the steps in any subsections of [Delete resources](#delete).

### <a name="template-portal"></a>Azure portal

1. In your browser, open the [template page](https://azure.microsoft.com/resources/templates/101-vnet-two-subnets).
2. Click the **Deploy to Azure** button. If you're not already logged in to Azure, log in on the Azure portal login screen that appears.
3. Sign in to the portal by using your [Azure account](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#account). If you don't have an Azure account, you can sign up for a [free trial](https://azure.microsoft.com/offers/ms-azr-0044p).
4. Enter the following values for the parameters:

    |Parameter|Value|
    |---|---|
    |Subscription|Select your subscription|
    |Resource group|myResourceGroup|
    |Location|Select a location|
    |Vnet Name|myVnet|
    |Vnet Address Prefix|10.0.0.0/16|
    |Subnet1Prefix|10.0.0.0/24|
    |Subnet1Name|Public|
    |Subnet2Prefix|10.0.1.0/24|
    |Subnet2Name|Private|

5. Agree to the terms and conditions, and then click **Purchase** to deploy the virtual network.

### <a name="template-cli"></a>Azure CLI

1. [Install and configure the Azure CLI](/cli/azure/install-azure-cli?toc=%2fazure%2fvirtual-network%2ftoc.json). Ensure you have the most recent version of the Azure CLI installed. To get help for CLI commands, type `az <command> --help`. Rather than installing the CLI and its pre-requisites, you can use the Azure Cloud Shell. The Azure Cloud Shell is a free Bash shell that you can run directly within the Azure portal. The Cloud Shell has the Azure CLI preinstalled and configured to use with your account. To use the Cloud Shell, click the Cloud Shell **>_** button at the top of the [portal](https://portal.azure.com), or just click the **Try it** button in the steps that follow. 
2. If running the CLI locally, log in to Azure with the `az login` command. If using the Cloud Shell, you're already logged in.
3. To create a resource group for the virtual network, copy the following command and paste it into your CLI session:

    ```azurecli-interactive
    az group create --name myResourceGroup --location eastus
    ```
    
4. You can deploy the template by using one of the following parameters options:
    - **Default parameter values**. Enter the following command:
    
        ```azurecli-interactive
        az group deployment create --resource-group myResourceGroup --name VnetTutorial --template-uri https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/101-vnet-two-subnets/azuredeploy.json`
        ```
    - **Custom parameter values**. Download and modify the template before you deploy the template. You also can deploy the template by using parameters at the command line, or deploy the template with a separate parameters file. To download the template and parameters files, click the **Browse on GitHub** button on the [Create a virtual network with two subnets](https://azure.microsoft.com/resources/templates/101-vnet-two-subnets/) template page. In GitHub, click the **azuredeploy.parameters.json** or **azuredeploy.json** file. Then, click the **Raw** button to display the file. In your browser, copy the contents of the file. Save the contents to a file on your computer. You can modify the parameter values in the template, or deploy the template with a separate parameters file.  

    To learn more about how to deploy templates by using these methods, type `az group deployment create --help`.

### <a name="template-powershell"></a>PowerShell

1. Install the latest version of the PowerShell [AzureRm](https://www.powershellgallery.com/packages/AzureRM/) module. If you're new to Azure PowerShell, see [Azure PowerShell overview](/powershell/azure/overview?toc=%2fazure%2fvirtual-network%2ftoc.json).
2. In a PowerShell session, to sign in with your [Azure account](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#account), enter `login-azurermaccount`.
3. To create a resource group for the virtual network, enter the following command:

    ```powershell
    New-AzureRmResourceGroup -Name myResourceGroup -Location eastus
    ```
    
4. You can deploy the template by using one of the following parameters options:
    - **Default parameter values**. Enter the following command:
    
        ```powershell
        New-AzureRmResourceGroupDeployment -Name VnetTutorial -ResourceGroupName myResourceGroup -TemplateUri https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/101-vnet-two-subnets/azuredeploy.json
        ```
        
    - **Custom parameter values**. Download and modify the template before you deploy it. You also can deploy the template by using parameters at the command line, or deploy the template with a separate parameters file. To download the template and parameters files, click the **Browse on GitHub** button on the [Create a virtual network with two subnets](https://azure.microsoft.com/resources/templates/101-vnet-two-subnets/) template page. In GitHub, click the **azuredeploy.parameters.json**  or **azuredeploy.json** file. Then, click the **Raw** button to display the file. In your browser, copy the contents of the file. Save the contents to a file on your computer. You can modify the parameter values in the template, or deploy the template with a separate parameters file.  

    To learn more about how to deploy templates by using these methods, type `Get-Help New-AzureRmResourceGroupDeployment`. 

## <a name="delete"></a>Delete resources

When you finish this tutorial, you might want to delete the resources that you created, so that you don't incur usage charges. Deleting a resource group also deletes all resources that are in the resource group.

### <a name="delete-portal"></a>Azure portal

1. In the portal search box, enter **myResourceGroup**. In the search results, click **myResourceGroup**.
2. On the **myResourceGroup** blade, click the **Delete** icon.
3. To confirm the deletion, in the **TYPE THE RESOURCE GROUP NAME** box, enter **myResourceGroup**, and then click **Delete**.

### <a name="delete-cli"></a>Azure CLI

In a CLI session, enter the following command:

```azurecli-interactive
az group delete --name myResourceGroup --yes
```

### <a name="delete-powershell"></a>PowerShell

In a PowerShell session, enter the following command:

```powershell
Remove-AzureRmResourceGroup -Name myResourceGroup -Force
```

## Next steps

- To learn about all virtual network and subnet settings, see [Manage virtual networks](virtual-network-manage-network.md#view-vnet) and [Manage virtual network subnets](virtual-network-manage-subnet.md#create-subnet). You have various options for using virtual networks and subnets in a production environment to meet different requirements.
- Filter inbound and outbound subnet traffic by creating and applying [network security groups](virtual-networks-nsg.md) to subnets.
- Route traffic between subnets through a network virtual appliance, by creating [user-defined routes](virtual-network-create-udr-arm-ps.md) and apply the routes to each subnet.
- Create a [Windows](../virtual-machines/virtual-machines-windows-hero-tutorial.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or a [Linux](../virtual-machines/linux/quick-create-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json) virtual machine in an existing virtual network.
- Connect two virtual networks by creating a [virtual network peering](virtual-network-peering-overview.md) between the virtual networks.
- Connect the virtual network to an on-premises network by using a [VPN Gateway](../vpn-gateway/vpn-gateway-howto-multi-site-to-site-resource-manager-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [Azure ExpressRoute](../expressroute/expressroute-howto-linkvnet-portal-resource-manager.md?toc=%2fazure%2fvirtual-network%2ftoc.json) circuit.
