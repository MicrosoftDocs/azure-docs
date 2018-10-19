---
title: Create an Azure virtual network peering - different deployment models - same subscription | Microsoft Docs
description: Learn how to create a virtual network peering between virtual networks created through different Azure deployment models that exist in the same Azure subscription.
services: virtual-network
documentationcenter: ''
author: jimdial
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/25/2017
ms.author: jdial;anavin

---
# Create a virtual network peering - different deployment models, same subscription

In this tutorial, you learn to create a virtual network peering between virtual networks created through different deployment models. Both virtual networks exist in the same subscription. Peering two virtual networks enables resources in different virtual networks to communicate with each other with the same bandwidth and latency as though the resources were in the same virtual network. Learn more about [Virtual network peering](virtual-network-peering-overview.md).

The steps to create a virtual network peering are different, depending on whether the virtual networks are in the same, or different, subscriptions, and which [Azure deployment model](../azure-resource-manager/resource-manager-deployment-model.md?toc=%2fazure%2fvirtual-network%2ftoc.json) the virtual networks are created through. Learn how to create a virtual network peering in other scenarios by clicking the scenario from the following table:

|Azure deployment model  | Azure subscription  |
|--------- |---------|
|[Both Resource Manager](tutorial-connect-virtual-networks-portal.md) |Same|
|[Both Resource Manager](create-peering-different-subscriptions.md) |Different|
|[One Resource Manager, one classic](create-peering-different-deployment-models-subscriptions.md) |Different|

A virtual network peering cannot be created between two virtual networks deployed through the classic deployment model. If you need to connect virtual networks that were both created through the classic deployment model, you can use an Azure [VPN Gateway](../vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json) to connect the virtual networks.

This tutorial peers virtual networks in the same region. You can also peer virtual networks in different [supported regions](virtual-network-manage-peering.md#cross-region). It's recommended that you familiarize yourself with the [peering requirements and constraints](virtual-network-manage-peering.md#requirements-and-constraints) before peering virtual networks.

You can use the [Azure portal](#portal), the Azure [command-line interface](#cli) (CLI), Azure [PowerShell](#powershell), or an [Azure Resource Manager template](#template) to create a virtual network peering. Click any of the previous tool links to go directly to the steps for creating a virtual network peering using your tool of choice.

## Create peering - Azure portal

1. Log in to the [Azure portal](https://portal.azure.com). The account you log in with must have the necessary permissions to create a virtual network peering. For a list of permissions, see [Virtual network peering permissions](virtual-network-manage-peering.md#requirements-and-constraints).
2. Click **+ New**, click **Networking**, then click **Virtual network**.
3. In the **Create virtual network** blade, enter, or select values for the following settings, then click **Create**:
    - **Name**: *myVnet1*
    - **Address space**: *10.0.0.0/16*
    - **Subnet name**: *default*
    - **Subnet address range**: *10.0.0.0/24*
    - **Subscription**: Select your subscription
    - **Resource group**: Select **Create new** and enter *myResourceGroup*
    - **Location**: *East US*
4. Click **+ New**. In the **Search the Marketplace** box, type *Virtual network*. Click **Virtual network** when it appears in the search results. 
5. In the **Virtual network** blade, select **Classic** in the **Select a deployment model** box, and then click **Create**.
6. In the **Create virtual network** blade, enter, or select values for the following settings, then click **Create**:
    - **Name**: *myVnet2*
    - **Address space**: *10.1.0.0/16*
    - **Subnet name**: *default*
    - **Subnet address range**: *10.1.0.0/24*
    - **Subscription**: Select your subscription
    - **Resource group**: Select **Use existing** and select *myResourceGroup*
    - **Location**: *East US*
7. In the **Search resources** box at the top of the portal, type *myResourceGroup*. Click **myResourceGroup** when it appears in the search results. A blade appears for the **myresourcegroup** resource group. The resource group contains the two virtual networks created in previous steps.
8. Click **myVNet1**.
9. In the **myVnet1** blade that appears, click **Peerings** from the vertical list of options on the left side of the blade.
10. In the **myVnet1 - Peerings** blade that appeared, click **+ Add**
11. In the **Add peering** blade that appears, enter, or select the following options, then click **OK**:
     - **Name**: *myVnet1ToMyVnet2*
     - **Virtual network deployment model**:  Select **Classic**. 
     - **Subscription**: Select your subscription
     - **Virtual network**:  Click **Choose a virtual network**, then click **myVnet2**.
     - **Allow virtual network access:** Ensure that **Enabled** is selected.
    No other settings are used in this tutorial. To learn about all peering settings, read [Manage virtual network peerings](virtual-network-manage-peering.md#create-a-peering).
12. After clicking **OK** in the previous step, the **Add peering** blade closes and you see the **myVnet1 - Peerings** blade again. After a few seconds, the peering you created appears in the blade. **Connected** is listed in the **PEERING STATUS** column for the **myVnet1ToMyVnet2** peering you created.

    The peering is now established. Any Azure resources you create in either virtual network are now able to communicate with each other through their IP addresses. If you're using default Azure name resolution for the virtual networks, the resources in the virtual networks are not able to resolve names across the virtual networks. If you want to resolve names across virtual networks in a peering, you must create your own DNS server. Learn how to set up [Name resolution using your own DNS server](virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server).
13. **Optional**: Though creating virtual machines is not covered in this tutorial, you can create a virtual machine in each virtual network and connect from one virtual machine to the other, to validate connectivity.
14. **Optional**: To delete the resources that you create in this tutorial, complete the steps in the [Delete resources](#delete-portal) section of this article.

## <a name="cli"></a>Create peering - Azure CLI

Complete the following steps using the Azure classic CLI and the Azure CLI. You can complete the steps from the Azure Cloud Shell, by just selecting the **Try it** button in any of the following steps, or by installing the [classic CLI](/cli/azure/install-cli-version-1.0.md?toc=%2fazure%2fvirtual-network%2ftoc.json) and [CLI](/cli/azure/install-azure-cli.md?toc=%2fazure%2fvirtual-network%2ftoc.json) and running the commands on your local computer.

1. If using the Cloud Shell, skip to step 2, because the Cloud Shell automatically signs you in to Azure. Open a command session and sign in to Azure using the `azure login` command.
2. Run the CLI in Service Management mode by entering the `azure config mode asm` command.
3. Enter the following command to create the virtual network (classic):

   ```azurecli-interactive
   azure network vnet create --vnet myVnet2 --address-space 10.1.0.0 --cidr 16 --location "East US"
   ```

4. Execute the following bash CLI script using the CLI, not the classic CLI. For options on running bash CLI scripts on Windows computer, see [Install the Azure CLI on Windows](/cli/azure/install-azure-cli-windows).

   ```azurecli-interactive
   #!/bin/bash

   # Create a resource group.
   az group create \
     --name myResourceGroup \
     --location eastus

   # Create the virtual network (Resource Manager).
   az network vnet create \
     --name myVnet1 \
     --resource-group myResourceGroup \
     --location eastus \
     --address-prefix 10.0.0.0/16
   ```

5. Create a virtual network peering between the two virtual networks created through the different deployment models using the CLI. Copy the following script to a text editor on your PC. Replace `<subscription id>` with your subscription Id. If you don't know your subscription Id, enter the `az account show` command. The value for **id** in the output is your subscription Id. Paste the modified script in to your CLI session, and then press `Enter`.

   ```azurecli-interactive
   # Get the id for VNet1.
   vnet1Id=$(az network vnet show \
     --resource-group myResourceGroup \
     --name myVnet1 \
     --query id --out tsv)

   # Peer VNet1 to VNet2.
   az network vnet peering create \
     --name myVnet1ToMyVnet2 \
     --resource-group myResourceGroup \
     --vnet-name myVnet1 \
     --remote-vnet-id /subscriptions/<subscription id>/resourceGroups/Default-Networking/providers/Microsoft.ClassicNetwork/virtualNetworks/myVnet2 \
     --allow-vnet-access
   ```

6. After the script executes, review the peering for the virtual network (Resource Manager). Copy the following command, paste it in your CLI session, and then press `Enter`:

   ```azurecli-interactive
   az network vnet peering list \
     --resource-group myResourceGroup \
     --vnet-name myVnet1 \
     --output table
   ```

   The output shows **Connected** in the **PeeringState** column.

   Any Azure resources you create in either virtual network are now able to communicate with each other through their IP addresses. If you're using default Azure name resolution for the virtual networks, the resources in the virtual networks are not able to resolve names across the virtual networks. If you want to resolve names across virtual networks in a peering, you must create your own DNS server. Learn how to set up [Name resolution using your own DNS server](virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server).
7. **Optional**: Though creating virtual machines is not covered in this tutorial, you can create a virtual machine in each virtual network and connect from one virtual machine to the other, to validate connectivity.
8. **Optional**: To delete the resources that you create in this tutorial, complete the steps in [Delete resources](#delete-cli) in this article.

## <a name="powershell"></a>Create peering - PowerShell

1. Install the latest version of the PowerShell [Azure](https://www.powershellgallery.com/packages/Azure) and [AzureRm](https://www.powershellgallery.com/packages/AzureRM/) modules. If you're new to Azure PowerShell, see [Azure PowerShell overview](/powershell/azure/overview?toc=%2fazure%2fvirtual-network%2ftoc.json).
2. Start a PowerShell session.
3. In PowerShell, log in to Azure by entering the `Add-AzureAccount` command. The account you log in with must have the necessary permissions to create a virtual network peering. For a list of permissions, see [Virtual network peering permissions](virtual-network-manage-peering.md#requirements-and-constraints).
4. To create a virtual network (classic) with PowerShell, you must create a new, or modify an existing, network configuration file. Learn how to [export, update, and import network configuration files](virtual-networks-using-network-configuration-file.md). The file should include the following **VirtualNetworkSite** element for the virtual network used in this tutorial:

    ```xml
    <VirtualNetworkSite name="myVnet2" Location="East US">
      <AddressSpace>
        <AddressPrefix>10.1.0.0/16</AddressPrefix>
      </AddressSpace>
      <Subnets>
        <Subnet name="default">
          <AddressPrefix>10.1.0.0/24</AddressPrefix>
        </Subnet>
      </Subnets>
    </VirtualNetworkSite>
    ```

    > [!WARNING]
    > Importing a changed network configuration file can cause changes to existing virtual networks (classic) in your subscription. Ensure you only add the previous virtual network and that you don't change or remove any existing virtual networks from your subscription. 
5. Log in to Azure to create the virtual network (Resource Manager) by entering the `Connect-AzureRmAccount` command. The account you log in with must have the necessary permissions to create a virtual network peering. For a list of permissions, see [Virtual network peering permissions](virtual-network-manage-peering.md#requirements-and-constraints).
6. Create a resource group and a virtual network (Resource Manager). Copy the script, paste it into PowerShell, and then press `Enter`.

    ```powershell
    # Create a resource group.
      New-AzureRmResourceGroup -Name myResourceGroup -Location eastus

    # Create the virtual network (Resource Manager).
      $vnet1 = New-AzureRmVirtualNetwork `
      -ResourceGroupName myResourceGroup `
      -Name 'myVnet1' `
      -AddressPrefix '10.0.0.0/16' `
      -Location eastus
    ```

7. Create a virtual network peering between the two virtual networks created through the different deployment models. Copy the following script to a text editor on your PC. Replace `<subscription id>` with your subscription Id. If you don't know your subscription Id, enter the `Get-AzureRmSubscription` command to view it. The value for **Id** in the returned output is your subscription ID. To execute the script, copy the modified script from your text editor, then right-click in your PowerShell session, and then press `Enter`.

    ```powershell
    # Peer VNet1 to VNet2.
    Add-AzureRmVirtualNetworkPeering `
      -Name myVnet1ToMyVnet2 `
      -VirtualNetwork $vnet1 `
      -RemoteVirtualNetworkId /subscriptions/<subscription Id>/resourceGroups/Default-Networking/providers/Microsoft.ClassicNetwork/virtualNetworks/myVnet2
    ```

8. After the script executes, review the peering for the virtual network (Resource Manager). Copy the following command, paste it in your PowerShell session, and then press `Enter`:

    ```powershell
    Get-AzureRmVirtualNetworkPeering `
      -ResourceGroupName myResourceGroup `
      -VirtualNetworkName myVnet1 `
      | Format-Table VirtualNetworkName, PeeringState
    ```

    The output shows **Connected** in the **PeeringState** column.

    Any Azure resources you create in either virtual network are now able to communicate with each other through their IP addresses. If you're using default Azure name resolution for the virtual networks, the resources in the virtual networks are not able to resolve names across the virtual networks. If you want to resolve names across virtual networks in a peering, you must create your own DNS server. Learn how to set up [Name resolution using your own DNS server](virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server).

9. **Optional**: Though creating virtual machines is not covered in this tutorial, you can create a virtual machine in each virtual network and connect from one virtual machine to the other, to validate connectivity.
10. **Optional**: To delete the resources that you create in this tutorial, complete the steps in [Delete resources](#delete-powershell) in this article.
 
## <a name="delete"></a>Delete resources
When you've finished this tutorial, you might want to delete the resources you created in the tutorial, so you don't incur usage charges. Deleting a resource group also deletes all resources that are in the resource group.

### <a name="delete-portal"></a>Azure portal

1. In the portal search box, enter **myResourceGroup**. In the search results, click **myResourceGroup**.
2. On the **myResourceGroup** blade, click the **Delete** icon.
3. To confirm the deletion, in the **TYPE THE RESOURCE GROUP NAME** box, enter **myResourceGroup**, and then click **Delete**.

### <a name="delete-cli"></a>Azure CLI

1. Use the Azure CLI to delete the virtual network (Resource Manager) with the following command:

    ```azurecli-interactive
    az group delete --name myResourceGroup --yes
    ```

2. Use the clasic CLI to delete the virtual network (classic) with the following commands:

    ```azurecli-interactive
    azure config mode asm

    azure network vnet delete --vnet myVnet2 --quiet
    ```

### <a name="delete-powershell"></a>PowerShell

1. Enter the following command to delete the virtual network (Resource Manager):

    ```powershell
    Remove-AzureRmResourceGroup -Name myResourceGroup -Force
    ```

2. To delete the virtual network (classic) with PowerShell, you must modify an existing network configuration file. Learn how to [export, update, and import network configuration files](virtual-networks-using-network-configuration-file.md). Remove the following VirtualNetworkSite element for the virtual network used in this tutorial:

    ```xml
    <VirtualNetworkSite name="myVnet2" Location="East US">
      <AddressSpace>
        <AddressPrefix>10.1.0.0/16</AddressPrefix>
      </AddressSpace>
      <Subnets>
        <Subnet name="default">
          <AddressPrefix>10.1.0.0/24</AddressPrefix>
        </Subnet>
      </Subnets>
    </VirtualNetworkSite>
    ```

    > [!WARNING]
    > Importing a changed network configuration file can cause changes to existing virtual networks (classic) in your subscription. Ensure you only remove the previous virtual network and that you don't change or remove any other existing virtual networks from your subscription. 

## Next steps

- Thoroughly familiarize yourself with important [virtual network peering constraints and behaviors](virtual-network-manage-peering.md#requirements-and-constraints) before creating a virtual network peering for production use.
- Learn about all [virtual network peering settings](virtual-network-manage-peering.md#create-a-peering).
- Learn how to [create a hub and spoke network topology](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke?toc=%2fazure%2fvirtual-network%2ftoc.json#vnet-peering) with virtual network peering.