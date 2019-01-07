---
title: Create an Azure virtual network (classic) with multiple subnets | Microsoft Docs
description: Learn how to create a virtual network (classic) with multiple subnets in Azure.
services: virtual-network
documentationcenter: ''
author: genlin
manager: cshepard
editor: ''
tags: azure-service-management

ms.assetid: 
ms.service: virtual-network
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 10/31/2018
ms.author: genli
ms.custom: 

---
# Create a virtual network (classic) with multiple subnets

> [!IMPORTANT]
> Azure has two [different deployment models](../azure-resource-manager/resource-manager-deployment-model.md?toc=%2fazure%2fvirtual-network%2ftoc.json) for creating and working with resources: Resource Manager and classic. This article covers using the classic deployment model. Microsoft recommends creating most new virtual networks through the [Resource Manager](quick-create-portal.md) deployment model.

In this tutorial, learn how to create a basic Azure virtual network (classic) that has separate public and private subnets. You can create Azure resources, like Virtual machines and Cloud services in a subnet. Resources created in virtual networks (classic) can communicate with each other, and with resources in other networks connected to a virtual network.

Learn more about all [virtual network](manage-virtual-network.md) and [subnet](virtual-network-manage-subnet.md) settings.

> [!WARNING]
> Virtual networks (classic) are immediately deleted by Azure when a [subscription is disabled](../billing/billing-subscription-become-disable.md?toc=%2fazure%2fvirtual-network%2ftoc.json#you-reached-your-spending-limit). Virtual networks (classic) are deleted regardless of whether resources exist in the virtual network. If you later re-enable the subscription, resources that existed in the virtual network must be recreated.

You can create a virtual network (classic) by using the [Azure portal](#portal), the [Azure command-line interface (CLI) 1.0](#azure-cli), or [PowerShell](#powershell).

## Portal

1. In an Internet browser, go to the [Azure portal](https://portal.azure.com). Log in using your [Azure account](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#account). If you don't have an Azure account, you can sign up for a [free trial](https://azure.microsoft.com/offers/ms-azr-0044p).
2. Click **Create a resource** in the portal.
3. Enter *Virtual network* in the **Search the Marketplace** box at the top of the **New** pane that appears. Click **Virtual network** when it appears in the search results.
4. Select **Classic** in the **Select a deployment model** box in the **Virtual Network** pane that appears, then click **Create**. 
5. Enter the following values on the **Create virtual network (classic)** pane and then click **Create**:

    |Setting|Value|
    |---|---|
    |Name|myVnet|
    |Address space|10.0.0.0/16|
    |Subnet name|Public|
    |Subnet address range|10.0.0.0/24|
    |Resource group|Leave **Create new** selected, and then enter **myResourceGroup**.|
    |Subscription and location|Select your subscription and location.

    If you're new to Azure, learn more about [resource groups](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#resource-group), [subscriptions](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#subscription), and [locations](https://azure.microsoft.com/regions) (also referred to as *regions*).
4. In the portal, you can create only one subnet when you create a virtual network. In this tutorial, you create a second subnet after you create the virtual network. You might later create Internet-accessible resources in the **Public** subnet. You also might create resources that aren't accessible from the Internet in the **Private** subnet. To create the second subnet, enter **myVnet** in the **Search resources** box at the top of the page. Click **myVnet** when it appears in the search results.
5. Click **Subnets** (in the **SETTINGS** section) on the **Create virtual network (classic)** pane that appears.
6. Click **+Add** on the **myVnet - Subnets** pane that appears.
7. Enter **Private** for **Name** on the **Add subnet** pane. Enter **10.0.1.0/24** for **Address range**.  Click **OK**.
8. On the **myVnet - Subnets** pane, you can see the **Public** and **Private** subnets that you created.
9. **Optional**: When you finish this tutorial, you might want to delete the resources that you created, so that you don't incur usage charges:
    - Click **Overview** on the **myVnet** pane.
    - Click the **Delete** icon on the **myVnet** pane.
    - To confirm the deletion, click **Yes** in the **Delete virtual network** box.

## Azure CLI

1. You can either [install and configure the Azure CLI](../cli-install-nodejs.md?toc=%2fazure%2fvirtual-network%2ftoc.json), or use the CLI within the Azure Cloud Shell. The Azure Cloud Shell is a free Bash shell that you can run directly within the Azure portal. It has the Azure CLI preinstalled and configured to use with your account. To get help for CLI commands, type `azure <command> --help`. 
2. In a CLI session, log in to Azure with the command that follows. If you click **Try it** in the box below, a Cloud Shell opens. You can log in to your Azure subscription, without entering the following command:

    ```azurecli-interactive
    azure login
    ```

3. To ensure the CLI is in Service Management mode, enter the following command:

    ```azurecli-interactive
    azure config mode asm
    ```

4. Create a virtual network with a private subnet:

    ```azurecli-interactive
    azure network vnet create --vnet myVnet --address-space 10.0.0.0 --cidr 16  --subnet-name Private --subnet-start-ip 10.0.0.0 --subnet-cidr 24 --location "East US"
    ```

5. Create a public subnet within the virtual network:

    ```azurecli-interactive
    azure network vnet subnet create --name Public --vnet-name myVnet --address-prefix 10.0.1.0/24
    ```    
    
6. Review the virtual network and subnets:

    ```azurecli-interactive
    azure network vnet show --vnet myVnet
    ```

7. **Optional**: You might want to delete the resources that you created when you finish this tutorial, so that you don't incur usage charges:

    ```azurecli-interactive
    azure network vnet delete --vnet myVnet --quiet
    ```

> [!NOTE]
> Though you can't specify a resource group to create a virtual network (classic) in using the CLI, Azure creates the virtual network in a resource group named *Default-Networking*.

## PowerShell

1. Install the latest version of the PowerShell [Azure](https://www.powershellgallery.com/packages/Azure) module. If you're new to Azure PowerShell, see [Azure PowerShell overview](/powershell/azure/overview?toc=%2fazure%2fvirtual-network%2ftoc.json).
2. Start a PowerShell session.
3. In PowerShell, log in to Azure by entering the `Add-AzureAccount` command.
4. Change the following path and filename, as appropriate, then export your existing network configuration file:

    ```powershell
    Get-AzureVNetConfig -ExportToFile c:\azure\NetworkConfig.xml
    ```

5. To create a virtual network with public and private subnets, use any text editor to add the **VirtualNetworkSite** element that follows to the network configuration file.

    ```xml
    <VirtualNetworkSite name="myVnet" Location="East US">
        <AddressSpace>
          <AddressPrefix>10.0.0.0/16</AddressPrefix>
        </AddressSpace>
        <Subnets>
          <Subnet name="Private">
            <AddressPrefix>10.0.0.0/24</AddressPrefix>
          </Subnet>
          <Subnet name="Public">
            <AddressPrefix>10.0.1.0/24</AddressPrefix>
          </Subnet>
        </Subnets>
      </VirtualNetworkSite>
    ```

    Review the full [network configuration file schema](https://msdn.microsoft.com/library/azure/jj157100.aspx).

6. Import the network configuration file:

    ```powershell
    Set-AzureVNetConfig -ConfigurationPath c:\azure\NetworkConfig.xml
    ```

    > [!WARNING]
    > Importing a changed network configuration file can cause changes to existing virtual networks (classic) in your subscription. Ensure you only add the previous virtual network and that you don't change or remove any existing virtual networks from your subscription. 

7. Review the virtual network and subnets:

    ```powershell
    Get-AzureVNetSite -VNetName "myVnet"
    ```

8. **Optional**: You might want to delete the resources that you created when you finish this tutorial, so that you don't incur usage charges. To delete the virtual network, complete steps 4-6 again, this time removing the **VirtualNetworkSite** element you added in step 5.
 
> [!NOTE]
> Though you can't specify a resource group to create a virtual network (classic) in using PowerShell, Azure creates the virtual network in a resource group named *Default-Networking*.

---

## Next steps

- To learn about all virtual network and subnet settings, see [Manage virtual networks](manage-virtual-network.md) and [Manage virtual network subnets](virtual-network-manage-subnet.md). You have various options for using virtual networks and subnets in a production environment to meet different requirements.
- Create a [Windows](../virtual-machines/windows/classic/createportal-classic.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or a [Linux](../virtual-machines/linux/classic/createportal-classic.md?toc=%2fazure%2fvirtual-network%2ftoc.json) virtual machine, and then connect it to an existing virtual network.
- To connect two virtual networks in the same Azure location, create a  [virtual network peering](create-peering-different-deployment-models.md) between the virtual networks. You can peer a virtual network (Resource Manager) to a virtual network (classic), but you cannot create a peering between two virtual networks (classic).
- Connect the virtual network to an on-premises network by using a [VPN Gateway](../vpn-gateway/vpn-gateway-howto-multi-site-to-site-resource-manager-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [Azure ExpressRoute](../expressroute/expressroute-howto-linkvnet-portal-resource-manager.md?toc=%2fazure%2fvirtual-network%2ftoc.json) circuit.
