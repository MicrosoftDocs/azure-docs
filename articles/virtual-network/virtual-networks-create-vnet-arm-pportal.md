---
title: Create an Azure virtual network with subnets | Microsoft Docs
description: Learn how to create a virtual network with multiple subnets in Azure.
services: virtual-network
documentationcenter: ''
author: jimdial
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 4ad679a4-a959-4e48-a317-d9f5655a442b
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 05/12/2017
ms.author: jdial
ms.custom: 

---
# Create a virtual network with multiple subnets

In this tutorial, learn how to create a basic Azure virtual network that has separate public and private subnets. You can connect Azure resources, like virtual machines, Azure App Service environments, virtual machine scale sets, Azure HDInsight, and other cloud services to subnets. Resources that are connected to virtual networks can communicate with each other over your private Azure network.

The following sections include steps that you can take to deploy a virtual network by using the [Azure portal](#portal), the Azure command-line interface ([Azure CLI](#azure-cli)), [Azure PowerShell](#powershell), and an [Azure Resource Manager template](#resource-manager-template). The result is the same, regardless of which tool you use to deploy the virtual network. Click a tool link to go to that section of the tutorial. To learn more about all virtual network and subnet settings, see [Manage virtual networks](virtual-network-manage-network.md) and [Manage virtual subnets](virtual-network-manage-subnet.md).

## <a name="portal"></a>Azure portal

1. In an Internet browser, go to the [Azure portal](https://portal.azure.com). Sign in by using your [Azure account](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#account). If you don't have an Azure account, you can sign up for a [free trial](https://azure.microsoft.com/offers/ms-azr-0044p).
2. In the portal, click **+New** > **Networking** > **Virtual network**.
3. On the **Virtual network** blade, under **Select a deployment model**, leave **Resource Manager** selected, and then click **Create**.
4. On the **Create virtual network** blade, enter the following values, and then click **Create**:

    |Setting|Value|
    |---|---|
    |Name|MyVnet|
    |Address space|10.0.0.0/16|
    |Subnet name|Public|
    |Subnet address range|10.0.0.0/24|
    |Resource group|Leave **Create new** selected, and then enter **MyResourceGroup**.|
    |Subscription and location|Select your subscription and location.

    If you're new to Azure, learn more about [resource groups](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#resource-group), [subscriptions](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#subscription), and [locations](https://azure.microsoft.com/regions) (also referred to as *regions*).
6. In the portal, you can create only one subnet when you create a virtual network. In this tutorial, you create a second subnet after you create the virtual network. You might later connect Internet-accessible resources to the **Public** subnet. You also might connect resources that aren't accessible from the Internet to a **Private** subnet. 
To create the second subnet, in the **Search resources** box at the top of the page, enter **MyVnet**. In the search results, click **MyVnet**. If you have multiple virtual networks with the same name in your subscription, check the resource groups that are listed under each virtual network. Ensure that you click the **MyVnet** search result that has the resource group **MyResourceGroup**.
7. On the **MyVnet** blade, under **SETTINGS**, click **Subnets**.
8. On the **MyVnet - Subnets** blade, click **+Subnet**.
9. On the **Add subnet** blade, for **Name**, enter **Private**. For **Address range**, enter **10.0.1.0/24**.  Click **OK**.
10. On the **MyVnet - Subnets** blade, review the subnets. You can see the **Public** and **Private** subnets that you created.
11. **Optional:** To delete the resources that you create in this tutorial, complete the steps in [Delete resources](#delete-portal) in this article.

## Azure CLI

Azure CLI commands are the same, whether you execute the commands from Windows, Linux, or macOS. However, there are scripting differences between operating system shells. The following instructions are for executing a Bash script that has Azure CLI commands:

1. In an Internet browser, open the [Azure portal](https://portal.azure.com). Sign in by using your [Azure account](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#account). If you don't have an Azure account, you can sign up for a [free trial](https://azure.microsoft.com/offers/ms-azr-0044p).
2. At the top of the portal page, to the right of the **Search resources** box, click the **>_** icon to start Bash Azure Cloud Shell (Preview). The Cloud Shell pane appears at the bottom of the portal. After a few seconds, a **username@Azure:~$** prompt appears. Cloud Shell automatically signs you in to Azure by using the credentials you used to sign in to the portal.
3. In your browser, copy the following script:
    ```azurecli
    #!/bin/bash
    
    # Create a resource group.
    az group create \
      --name MyResourceGroup \
      --location eastus
    
    # Create a virtual network with one subnet.
    az network vnet create \
      --name MyVnet \
      --resource-group MyResourceGroup \
      --subnet-name Public
    
    # Create an additional subnet within the virtual network.
    az network vnet subnet create \
      --name Private \
      --address-prefix 10.0.1.0/24 \
      --vnet-name MyVnet \
      --resource-group MyResourceGroup
    ```
4. Create a script file and save it. At the Cloud Shell command prompt, type `nano myscript.sh --nonewlines`. The command starts the GNU nano editor, with an empty myscript.sh file. Place your cursor inside the editor window, right-click, and then click **Paste**.  
5. To save the file as myscript.sh, press Ctrl+X, type **Y**, and then press the Enter key. Cloud Shell storage does not persist saved files across sessions. If you want to persist the script across Cloud Shell sessions, set up [persistent storage](../cloud-shell/persisting-shell-storage.md?toc=%2fazure%2fvirtual-network%2ftoc.json) for Cloud Shell and save the file to persistent storage.
6. At the Cloud Shell command prompt, to mark the file as executable, run the `chmod +x myscript.sh` command.
7. To execute the script, enter `./myscript.sh`.
8. When the script is finished running, to review the subnets for the virtual network, copy the following command, and then paste it in the Bash Cloud Shell pane:
    ```azurecli
    az network vnet subnet list --resource-group MyResourceGroup --vnet-name MyVnet --output table
    ```
9. **Optional**: To delete the resources that you create in this tutorial, complete the steps in [Delete resources](#delete-cli) in this article.

## PowerShell

1. Install the latest version of the PowerShell [AzureRm](https://www.powershellgallery.com/packages/AzureRM/) module. If you're new to Azure PowerShell, see [Azure PowerShell overview](/powershell/azure/overview?toc=%2fazure%2fvirtual-network%2ftoc.json).
2. To start a PowerShell session, go to **Start**, enter **powershell**, and then click **PowerShell**.
3. In the PowerShell window, to sign in with your [Azure account](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#account), enter `login-azurermaccount`.
4. In your browser, copy the following script:
    ```powershell
    # Create a resource group.
    New-AzureRmResourceGroup `
      -Name MyResourceGroup `
      -Location eastus
    
    # Create two subnets.
    $Subnet1 = New-AzureRmVirtualNetworkSubnetConfig `
      -Name Public `
      -AddressPrefix 10.0.0.0/24
    $Subnet2 = New-AzureRmVirtualNetworkSubnetConfig `
      -Name Private `
      -AddressPrefix 10.0.1.0/24
    
    # Create a virtual network.
    $Vnet=New-AzureRmVirtualNetwork `
      -ResourceGroupName MyResourceGroup `
      -Location eastus `
      -Name MyVnet `
      -AddressPrefix 10.0.0.0/16 `
      -Subnet $Subnet1,$Subnet2
    #
    ```
5. To execute the script, right-click in the PowerShell window.
6. To review the subnets for the virtual network, copy the following command, and then paste it in the PowerShell window:
    ```powershell
    $Vnet = $Vnet.subnets | Format-Table Name, AddressPrefix
    ```
7. **Optional**: To delete the resources that you create in this tutorial, complete the steps in [Delete resources](#delete-powershell) in this article.

## Resource Manager template

You can deploy a virtual network by using an Azure Resource Manager template. To learn more about templates, see [What is Resource Manager](../azure-resource-manager/resource-group-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#template-deployment). To access the template and to learn about its parameters, see the [Create a virtual network with two subnets](https://azure.microsoft.com/resources/templates/101-vnet-two-subnets/) template. You can deploy the template by using the [portal](#template-portal), [Azure CLI](#template-cli), or [PowerShell](#template-powershell).

**Optional:** To delete the resources that you create in this tutorial, complete the steps in any subsections of [Delete resources](#delete) in this article.

### <a name="template-portal"></a>Azure portal

1. In your browser, open the [template page](https://azure.microsoft.com/resources/templates/101-vnet-two-subnets).
2. Click the **Deploy to Azure** button. This opens the Azure portal sign-in page.
3. Sign in to the portal by using your [Azure account](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#account). If you don't have an Azure account, you can sign up for a [free trial](https://azure.microsoft.com/offers/ms-azr-0044p).
4. Enter the following values for the parameters:

    |Parameter|Value|
    |---|---|
    |Subscription|Select your subscription|
    |Resource group|MyResourceGroup|
    |Location|Select a location|
    |Vnet Name|MyVnet|
    |Vnet Address Prefix|10.0.0.0/16|
    |Subnet1Prefix|10.0.0.0/24|
    |Subnet1Name|Public|
    |Subnet2Prefix|10.0.1.0/24|
    |Subnet2Name|Private|

5. Agree to the terms and conditions, and then click **Purchase** to deploy the virtual network.

### <a name="template-cli"></a>Azure CLI

1. In the [portal](https://portal.azure.com), sign in with your [Azure account](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#account). If you don't have an Azure account, you can sign up for a [free trial](https://azure.microsoft.com/offers/ms-azr-0044p).
2. To the right of the **Search resources** box, click the **>_** icon to start Bash Azure Cloud Shell (Preview). The Cloud Shell pane appears at the bottom of the portal. After a few seconds, a **username@Azure:~$** prompt appears. Cloud Shell automatically signs you in to Azure by using the credentials you used to sign in to the Azure portal.
3. To create a resource group for the virtual network, enter the following command:
    `az group create --name MyResourceGroup --location eastus`
4. You can deploy the template by using one of the following parameters options:
    - **Default parameter values**. Enter the following command: 
        `az group deployment create --resource-group MyResourceGroup --name VnetTutorial --template-uri https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/101-vnet-two-subnets/azuredeploy.json`
    - **Custom parameter values**. Download and modify the template before you deploy the template. You also can deploy the template by using parameters at the command line, or deploy the template with a separate parameters file. To download the template and parameters files, click the **Browse on GitHub** button on the [Create a virtual network with two subnets](https://azure.microsoft.com/resources/templates/101-vnet-two-subnets/) template page. In GitHub, click the **azuredeploy.parameters.json** or **azuredeploy.json** file. Then, click the **Raw** button to display the file. In your browser, copy the contents of the file. Save the contents to a file on your computer. You can modify the parameter values in the template, or deploy the template with a separate parameters file.  

    To learn more about how to deploy templates by using these methods, type `az group deployment create --help`.

### <a name="template-powershell"></a>PowerShell

1. Install the latest version of the PowerShell [AzureRm](https://www.powershellgallery.com/packages/AzureRM/) module. If you're new to Azure PowerShell, see [Azure PowerShell overview](/powershell/azure/overview?toc=%2fazure%2fvirtual-network%2ftoc.json).
2. To start a PowerShell session, go to **Start**, enter **powershell**, and then click **PowerShell**.
3. In the PowerShell window, to sign in with your [Azure account](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#account), enter `login-azurermaccount`.
4. To create a resource group for the virtual network, enter the following command:
    `New-AzureRmResourceGroup -Name MyResourceGroup -Location eastus`
5. You can deploy the template by using one of the following parameters options:
    - **Default parameter values**. Enter the following command: 
        `New-AzureRmResourceGroupDeployment -Name VnetTutorial -ResourceGroupName MyResourceGroup -TemplateUri https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/101-vnet-two-subnets/azuredeploy.json`        
    - **Custom parameter values**. Download and modify the template before you deploy it. You also can deploy the template by using parameters at the command line, or deploy the template with a separate parameters file. To download the template and parameters files, click the **Browse on GitHub** button on the [Create a virtual network with two subnets](https://azure.microsoft.com/resources/templates/101-vnet-two-subnets/) template page. In GitHub, click the **azuredeploy.parameters.json**  or **azuredeploy.json** file. Then, click the **Raw** button to display the file. In your browser, copy the contents of the file. Save the contents to a file on your computer. You can modify the parameter values in the template, or deploy the template with a separate parameters file.  

    To learn more about how to deploy templates by using these methods, type `Get-Help New-AzureRmResourceGroupDeployment`. 

## <a name="delete"></a>Delete resources
When you've finished this tutorial, you might want to delete the resources that you used for the tutorial, so you don't incur usage charges. Deleting a resource group also deletes all resources that are in the resource group.

### <a name="delete-portal"></a>Azure portal

1. In the portal search box, enter **MyResourceGroup**. In the search results, click **MyResourceGroup**.
2. On the **MyResourceGroup** blade, click the **Delete** icon.
3. To confirm the deletion, in the **TYPE THE RESOURCE GROUP NAME** box, enter **MyResourceGroup**, and then click **Delete**.

### <a name="delete-cli"></a>Azure CLI

At the Cloud Shell command prompt, enter the following command: `az group delete --name MyResourceGroup --yes`

### <a name="delete-powershell"></a>PowerShell

At the PowerShell command prompt, enter the following command: `Remove-AzureRmResourceGroup -Name MyResourceGroup`

## Next steps

- To learn about all virtual network and subnet settings, see [Manage virtual networks](virtual-network-manage-network.md#view-vnet) and [Manage virtual subnets](virtual-network-manage-subnet.md#create-subnet). You have various options for using virtual networks and subnets in a production environment to meet different requirements.
- Create and apply [network security groups](virtual-networks-nsg.md) (NSGs) to subnets to filter inbound and outbound subnet traffic.
- Create a [Windows virtual machine](../virtual-machines/virtual-machines-windows-hero-tutorial.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or a [Linux virtual machine](../virtual-machines/linux/quick-create-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json), and then connect it to the virtual network.
- Connect the virtual network to another virtual network in the same location by using [virtual network peering](virtual-network-peering-overview.md).
- Connect the virtual network to an on-premises network by using a [site-to-site virtual private network](../vpn-gateway/vpn-gateway-howto-multi-site-to-site-resource-manager-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [Azure ExpressRoute](../expressroute/expressroute-howto-linkvnet-portal-resource-manager.md?toc=%2fazure%2fvirtual-network%2ftoc.json) circuit.
