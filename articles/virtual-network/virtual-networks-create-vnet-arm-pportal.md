---
title: Create an Azure Virtual Network | Microsoft Docs
description: Learn how to create a virtual network with multiple subnets.
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

In this tutorial, you learn how to create a basic Azure Virtual Network (VNet) with separate public and private subnets. You can connect Azure resources such as Virtual Machines (VM), App Service Environments, Virtual Machine Scale Sets, HDInsight, and Cloud Services to subnets. Resources connected to VNets are able to communicate with each other over the private Azure network.

The sections that follow include steps for deploying a VNet using the Azure [portal](#portal), Azure [command-line interface](#cli) (CLI), Azure [PowerShell](#powershell), and Azure Resource Manager [template](#template). The result is the same, regardless of which tool you choose to deploy the VNet with. Clicking the link for any tool takes you directly to that section of the article. To learn more about all VNet and subnet settings, read the [Manage VNets](virtual-network-manage-network.md) and [Manage subnets](virtual-network-manage-subnet.md) articles.

## <a name="portal"></a>Azure portal

1. From an Internet browser, open the Azure [portal](https://portal.azure.com) and sign in with your Azure [account](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#account). If you don't already have an account, you can sign up for a [free trial](https://azure.microsoft.com/offers/ms-azr-0044p).
2. In the portal, click **+ New** > **Networking** > **Virtual network**.
3. In the **Virtual network** blade that appears, leave *Resource Manager* selected in under **Select a deployment model** and click **Create**.
4. In the **Create virtual network** blade that appears, enter the following values and click the **Create** button:

    |Setting|Value|
    |---|---|
    |Name|*MyVnet*|
    |Address space|*10.0.0.0/16*|
    |Subnet name|Public|
    |Subnet address range|*10.0.0.0/24*|
    |Resource group|Leave **Create new** selected and enter *MyResourceGroup*|
    |Subscription and Location|Select your subscription and location.

    If you're new to Azure, learn more about [Resource groups](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#resource-group), [subscriptions](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#subscription), and [locations](https://azure.microsoft.com/regions) (which are also referred to as regions).
6. The portal only enables you to create one subnet when creating a VNet. For this tutorial, a second subnet is created after the VNet is created. You might later connect Internet-accessible resources to the *Public* subnet, and connect resources that aren't accessible from the Internet to a private subnet. To create the second subnet, enter *MyVnet* in the *Search resources* box at the top of the portal. When **MyVnet** appears in the search results, click it. **Note:** If you have multiple VNets in your subscription with the same name, you see resource group names listed under each VNet with the same name. Ensure you click the MyVnet result with *MyResourceGroup* under it.
7. In the **MyVnet** blade that appears, click **Subnets** under **SETTINGS**.
8. In the **MyVnet - Subnets** blade, click **+Subnet**.
9. Enter *Private* for **Name**, *10.0.1.0/24* for **Address range** in the **Add subnet** blade, then click **OK**.
10. Review the subnets in the **MyVnet - Subnets** blade. You see the **Public** and **Private** subnets you created.
11. **Optional:** To delete the resources created in this tutorial, complete the steps in the [Delete resources](#delete-portal) section of this article.

## CLI
Though CLI commands are the same whether you execute the commands from Windows, Linux, or macOS, there are scripting differences across operating system shells. The following instructions are for executing a Bash script that contains CLI commands:

1. From an Internet browser, open the Azure [portal](https://portal.azure.com) and sign in with your Azure [account](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#account). If you don't already have an account, you can sign up for a [free trial](https://azure.microsoft.com/offers/ms-azr-0044p).
2. At the top of the portal, to the right of the *Search resources* bar, click the **>_** icon to start a Bash Azure Cloud Shell (Preview). The cloud shell pane appears at the bottom of the portal and, after a few seconds, presents a **username@Azure:~$** prompt. The cloud shell automatically logs you in to Azure using the credentials you authenticated to the portal with.
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
    
    # Create an additional subnet within the VNet.
    az network vnet subnet create \
      --name Private \
      --address-prefix 10.0.1.0/24 \
      --vnet-name MyVnet \
      --resource-group MyResourceGroup
    ```
4. Create a script file and save it. From the cloud shell prompt, type `nano myscript.sh --nonewlines`. The command starts the GNU nano editor with an empty myscript.sh file. Place your mouse inside the editor window, right-click, then click **Paste**. **Note:** Cloud shell storage does not persist across sessions. If you prefer to persist the script across cloud shell sessions, setup [persistent storage](../cloud-shell/persisting-shell-storage.md?toc=%2fazure%2fvirtual-network%2ftoc.json) for cloud shell. 
5. On your keyboard, hold down the **Ctrl+X** keys, then enter **Y**, then press the **Enter** key to save the file as myscript.sh.
6. From the cloud shell prompt, mark the file as executable with the `chmod +x myscript.sh` command.
7. Execute the script by entering `./myscript.sh`.
8. Once the script is complete, review the subnets for the VNet by copying and pasting the following command in your Bash cloud shell:
    ```azurecli
    az network vnet subnet list --resource-group MyResourceGroup --vnet-name MyVnet --output table
    ```
9. **Optional:** To delete the resources created in this tutorial, complete the steps in the [Delete resources](#delete-cli) section of this article.

## PowerShell
1. Install the latest version of the Azure PowerShell [AzureRm](https://www.powershellgallery.com/packages/AzureRM/) module. If you're new to Azure PowerShell, read the [Azure PowerShell overview](/powershell/azure/overview?toc=%2fazure%2fvirtual-network%2ftoc.json) article.
2. Start a PowerShell session by clicking the Windows Start button, typing **Powershell**, then clicking **PowerShell** from the search results.
3. In your PowerShell window, enter the `login-azurermaccount` command to sign in with your Azure [account](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#account). If you don't already have an account, you can sign up for a [free trial](https://azure.microsoft.com/offers/ms-azr-0044p).
4. In your browser, copy the following script:
    ```powershell
    # Create a resource group
    New-AzureRmResourceGroup `
      -Name MyResourceGroup `
      -Location eastus
    
    # Create two subnets
    $Subnet1 = New-AzureRmVirtualNetworkSubnetConfig `
      -Name Public `
      -AddressPrefix 10.0.0.0/24
    $Subnet2 = New-AzureRmVirtualNetworkSubnetConfig `
      -Name Private `
      -AddressPrefix 10.0.1.0/24
    
    # Create a virtual network
    $Vnet=New-AzureRmVirtualNetwork `
      -ResourceGroupName MyResourceGroup `
      -Location eastus `
      -Name MyVnet `
      -AddressPrefix 10.0.0.0/16 `
      -Subnet $Subnet1,$Subnet2
    #
    ```
5. To execute the script, right-click in your PowerShell window.
6. Review the subnets for the VNet by copying the following command and pasting the command into your PowerShell window:
    ```powershell
    $Vnet = $Vnet.subnets | Format-Table Name, AddressPrefix
    ```
7. **Optional:** To delete the resources created in this tutorial, complete the steps in the [Delete resources](#delete-powershell) section of this article.

## Template

You can deploy a VNet with an Azure Resource Manager template. To learn more about templates, read the [What is Resource Manager](../azure-resource-manager/resource-group-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#template-deployment) article. To access the template and learn about its parameters, view the [Create a VNet with two subnets template](https://azure.microsoft.com/resources/templates/101-vnet-two-subnets/) web page. You can deploy the template using the [portal](#template-portal), [CLI](#template-cli), or [PowerShell](#template-powershell).

**Optional:** To delete the resources created in this tutorial, complete the steps in any subsections of the [Delete resources](#delete) section of this article.

### <a name="template-portal"></a>Portal

1. In your browser, open the template [web page](https://azure.microsoft.com/resources/templates/101-vnet-two-subnets).
2. Click the **Deploy to Azure** button, which opens the Azure portal sign-in page.
3. Sign in to the portal with your Azure [account](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#account). If you don't already have an account, you can sign up for a [free trial](https://azure.microsoft.com/offers/ms-azr-0044p).
4. Enter the following values for the parameters:

    |Parameter|Value|
    |---|---|
    |Subscription|Select your subscription.|
    |Resource group|MyResourceGroup|
    |Location|Select a location.|
    |Vnet Name|MyVnet|
    |Vnet Address Prefix|10.0.0.0/16|
    |Subnet1Prefix|10.0.0.0/24|
    |Subnet1Name|Public|
    |Subnet2Prefix|10.0.1.0/24|
    |Subnet2Name|Private|

5. Agree to the terms and conditions, then click **Purchase** to deploy the VNet.

### <a name="template-cli"></a>CLI

1. From an Internet browser, open the Azure [portal](https://portal.azure.com) and sign in with your Azure [account](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#account). If you don't already have an account, you can sign up for a [free trial](https://azure.microsoft.com/offers/ms-azr-0044p).
2. At the top of the portal, to the right of the *Search resources* bar, click the **>_** icon to start a Bash Azure Cloud Shell (Preview). The cloud shell pane appears at the bottom of the portal and, after a few seconds, presents a **username@Azure:~$** prompt. The cloud shell automatically logs you in to Azure using the credentials you authenticated to the portal with.
3. Create a resource group for the VNet by entering the following command:
    `az group create --name MyResourceGroup --location eastus`
4. You can deploy the template with:
    - **Default parameter values:** Enter the following command: 
        `az group deployment create --resource-group MyResourceGroup --name VnetTutorial --template-uri https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/101-vnet-two-subnets/azuredeploy.json`
    - **Custom parameter values:** Download and modify the template before deploying it, deploy the template with parameters from the command line, or deploy the template using a separate parameters file. You can download the template and parameter files by clicking the **Browse on GitHub** button on the [Create a VNet with two subnets template](https://azure.microsoft.com/resources/templates/101-vnet-two-subnets/) web page. In GitHub, click the **azuredeploy.parameters.json**  or **azuredeploy.json** file, then click the **Raw** button for the file. In your browser, copy the contents and save it to a file on your computer. Modify the parameter values in the template, or deploy the template with the separate parameter file.  

    To learn more about how to deploy templates using these methods, type `az group deployment create --help`.

### <a name="template-powershell"></a>PowerShell

1. Install the latest version of the Azure PowerShell [AzureRm](https://www.powershellgallery.com/packages/AzureRM/) module. If you're new to Azure PowerShell, read the [Azure PowerShell overview](/azure/overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) article.
2. Start a PowerShell session by clicking the Windows Start button, typing **powershell**, then clicking **PowerShell** from the search results.
3. In your PowerShell window, enter the `login-azurermaccount` command to sign in with your Azure [account](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#account). If you don't already have an account, you can sign up for a [free trial](https://azure.microsoft.com/offers/ms-azr-0044p).
4. Create a resource group for the VNet by entering the following command:
    `New-AzureRmResourceGroup -Name MyResourceGroup -Location eastus`
5. You can deploy the template with:
    - **Default parameter values:** To do so, enter the following command: 
        `New-AzureRmResourceGroupDeployment -Name VnetTutorial -ResourceGroupName MyResourceGroup -TemplateUri https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/101-vnet-two-subnets/azuredeploy.json`        
    - **Custom parameter values:** To do so, you can download and modify the template before deploying it, deploy the template with parameters from the command line, or deploy the template using a separate parameters file. You can download the template and parameter files by clicking the **Browse on GitHub** button on the [Create a VNet with two subnets template](https://azure.microsoft.com/resources/templates/101-vnet-two-subnets/) web page. In GitHub, click the **azuredeploy.parameters.json**  or **azuredeploy.json** file, then click the **Raw** button for the file. In your browser, copy the contents and save it to a file on your computer. Modify the parameter values in the template, or deploy the template with the separate parameter file.  

    To learn more about how to deploy templates using these methods, type `Get-Help New-AzureRmResourceGroupDeployment`. 

## <a name="delete"></a>Delete resources
After completing this tutorial, you may want to delete the resource so you don't incur usage charges. Deleting a resource group also deletes all resources within it.

### <a name="delete-portal"></a>Portal

1. In the portal, start typing *MyResourceGroup* in the *Search resources* box at the top of the portal. When **MyResourceGroup** appears in the search results, click it.
2. In the MyResourceGroup blade that appears, click the Delete icon near the top of the blade.
3. To confirm deletion, enter *MyResourceGroup* in the **TYPE THE RESOURCE GROUP NAME:** box and click **Delete**.

### <a name="delete-cli"></a>CLI

From the cloud shell prompt, enter the following command: `az group delete --name MyResourceGroup --yes`

### <a name="delete-powershell"></a>PowerShell

From the PowerShell prompt, enter the following command: `Remove-AzureRmResourceGroup -Name MyResourceGroup`

## Next steps

- To understand all VNet and subnet settings, read the [Manage VNet](virtual-network-manage-network.md#view-vnet) and [Manage subnet](virtual-network-manage-subnet.md#create-subnet) articles. Various options exist that enable you to create production VNets and subnets to meet different requirements.
- Filter inbound and outbound subnet traffic by creating and applying [network security groups](virtual-networks-nsg.md) (NSGs) to subnets.
- Create a [Windows](../virtual-machines/virtual-machines-windows-hero-tutorial.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [Linux](../virtual-machines/linux/quick-create-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json) VM and connect it to the VNet.
- Connect the VNet to another VNet in the same location with [VNet peering](virtual-network-peering-overview.md).
- Connect the VNet to an on-premises network with a [site-to-site virtual private network](../vpn-gateway/vpn-gateway-howto-multi-site-to-site-resource-manager-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json) (VPN) or [ExpressRoute](../expressroute/expressroute-howto-linkvnet-portal-resource-manager.md?toc=%2fazure%2fvirtual-network%2ftoc.json) circuit.