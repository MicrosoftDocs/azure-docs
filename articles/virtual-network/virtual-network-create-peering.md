---
title: Create an Azure virtual network peering - Resource Manager - same subscription  | Microsoft Docs
description: Learn how to create a virtual network peering between virtual networks created through Resource Manager that exist in the same Azure subscription.
services: virtual-network
documentationcenter: ''
author: jimdial
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 026bca75-2946-4c03-b4f6-9f3c5809c69a
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 07/17/2017
ms.author: jdial;narayan;annahar

---
# Create a virtual network peering - Resource Manager, same subscription

In this tutorial, you learn to create a virtual network peering between virtual networks created through Resource Manager. Both virtual networks exist in the same subscription. Peering two virtual networks enables resources in different virtual networks to communicate with each other with the same bandwidth and latency as though the resources were in the same virtual network. Learn more about [Virtual network peering](virtual-network-peering-overview.md). 

The steps to create a virtual network peering are different, depending on whether the virtual networks are in the same, or different, subscriptions, and which [Azure deployment model](../azure-resource-manager/resource-manager-deployment-model.md?toc=%2fazure%2fvirtual-network%2ftoc.json) the virtual networks are created through. Learn how to create a virtual network peering in other scenarios by clicking the scenario from the following table:

|Azure deployment model  | Azure subscription  |
|--------- |---------|
|[Both Resource Manager](create-peering-different-subscriptions.md) |Different|
|[One Resource Manager, one classic](create-peering-different-deployment-models.md) |Same|
|[One Resource Manager, one classic](create-peering-different-deployment-models-subscriptions.md) |Different|

A virtual network peering cannot be created between two virtual networks deployed through the classic deployment model. A virtual network peering can only be created between two virtual networks that exist in the same Azure region. If you need to connect virtual networks that were both created through the classic deployment model, or that exist in different Azure regions, you can use an Azure [VPN Gateway](../vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json) to connect the virtual networks. 

You can use the [Azure portal](#portal), the Azure [command-line interface](#cli) (CLI), Azure [PowerShell](#powershell), or an [Azure Resource Manager template](#template) to create a virtual network peering. Click any of the previous tool links to go directly to the steps for creating a virtual network peering using your tool of choice.

## <a name="portal"></a>Create peering - Azure portal

1. Log in to the [Azure portal](https://portal.azure.com). The account you log in with must have the necessary permissions to create a virtual network peering. See the [Permissions](#permissions) section of this article for details.
2. Click **+ New**, click **Networking**, then click **Virtual network**.
3. In the **Create virtual network** blade, enter, or select values for the following settings, then click **Create**:
    - **Name**: *myVnet1*
    - **Address space**: *10.0.0.0/16*
    - **Subnet name**: *default*
    - **Subnet address range**: *10.0.0.0/24*
    - **Subscription**: Select your subscription
    - **Resource group**: Select **Create new** and enter *myResourceGroup*
    - **Location**: *East US*
4. Complete steps 2-3 again specifying the following values in step 3:
    - **Name**: *myVnet2*
    - **Address space**: *10.1.0.0/16*
    - **Subnet name**: *default*
    - **Subnet address range**: *10.1.0.0/24*
    - **Subscription**: Select your subscription
    - **Resource group**: Select **Use existing** and select *myResourceGroup*
    - **Location**: *East US*
5. In the **Search resources** box at the top of the portal, type *myResourceGroup*. Click **myResourceGroup** when it appears in the search results. A blade appears for the **myresourcegroup** resource group. The resource group contains the two virtual networks created in previous steps.
6. Click **myVNet1**.
7. In the **myVnet1** blade that appears, click **Peerings** from the vertical list of options on the left side of the blade.
8. In the **myVnet1 - Peerings** blade that appeared, click **+ Add**
9. In the **Add peering** blade that appears, enter, or select the following options, then click **OK**:
     - **Name**: *myVnet1ToMyVnet2*
     - **Virtual network deployment model**:  Select **Resource Manager**. 
     - **Subscription**: Select your subscription
     - **Virtual network**:  Click **Choose a virtual network**, then click **myVnet2**.
     - **Allow virtual network access:** Ensure that **Enabled** is selected.
    No other settings are used in this tutorial. To learn about all peering settings, read [Manage virtual network peerings](virtual-network-manage-peering.md#create-a-peering).
10. After clicking **OK** in the previous step, the **Add peering** blade closes and you see the **myVnet1 - Peerings** blade again. After a few seconds, the peering you created appears in the blade. **Initiated** is listed in the **PEERING STATUS** column for the **myVnet1ToMyVnet2** peering you created. You've peered Vnet1 to Vnet2, but now you must peer myVnet2 to myVnet1. The peering must be created in both directions to enable resources in the virtual networks to communicate with each other.
11. Complete steps 5-10 again for myVnet2.  Name the peering *myVnet2ToMyVnet1*.
12. A few seconds after clicking **OK** to create the peering for MyVnet2, the **myVnet2ToMyVnet1** peering you just created is listed with **Connected** in the **PEERING STATUS** column.
13. Complete steps 5-7 again for MyVnet1. The **PEERING STATUS** for the **myVnet1ToVNet2** peering is now also **Connected**. The peering is successfully established after you see **Connected** in the **PEERING STATUS** column for both virtual networks in the peering.
14. **Optional**: Though creating virtual machines is not covered in this tutorial, you can create a virtual machine in each virtual network and connect from one virtual machine to the other, to validate connectivity.
15. **Optional**: To delete the resources that you create in this tutorial, complete the steps in the [Delete resources](#delete-portal) section of this article.

Any Azure resources you create in either virtual network are now able to communicate with each other through their IP addresses. If you're using default Azure name resolution for the virtual networks, the resources in the virtual networks are not able to resolve names across the virtual networks. If you want to resolve names across virtual networks in a peering, you must create your own DNS server. Learn how to set up [Name resolution using your own DNS server](virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-using-your-own-dns-server).

## <a name="cli"></a>Create peering - Azure CLI

The following script:

- Requires the Azure CLI version 2.0.4 or later. To find the version, run the `az --version` command. If you need to upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli?toc=%2fazure%2fvirtual-network%2ftoc.json).
- Works in a Bash shell. For options on running Azure CLI scripts on Windows client, see [Running the Azure CLI in Windows](../virtual-machines/windows/cli-options.md?toc=%2fazure%2fvirtual-network%2ftoc.json). 

Instead of installing the CLI and its dependencies, you can use the Azure Cloud Shell. The Azure Cloud Shell is a free Bash shell that you can run directly within the Azure portal. It has the Azure CLI preinstalled and configured to use with your account. Click the **Try it** button in the script that follows, which invokes a Cloud Shell that logs you can log in to your Azure account with. To execute the script, click the **Copy** button and paste the contents into your Cloud Shell.

1. Create a resource group and two virtual networks.

    ```azurecli-interactive
    #!/bin/bash

    # Variables for common values used throughout the script.
    rgName="myResourceGroup"
    location="eastus"

    # Create a resource group.
    az group create \
      --name $rgName \
      --location $location

    # Create virtual network 1.
    az network vnet create \
      --name myVnet1 \
      --resource-group $rgName \
      --location $location \
      --address-prefix 10.0.0.0/16

    # Create virtual network 2.
    az network vnet create \
      --name myVnet2 \
      --resource-group $rgName \
      --location $location \
      --address-prefix 10.1.0.0/16
    ```

2. Create a virtual network peering between the two virtual networks.
 
    ```azurecli-interactive
    # Get the id for VNet1.
    vnet1Id=$(az network vnet show \
      --resource-group $rgName \
      --name myVnet1 \
      --query id --out tsv)

    # Get the id for VNet2.
    vnet2Id=$(az network vnet show \
      --resource-group $rgName \
      --name myVnet2 \
      --query id \
      --out tsv)

    # Peer VNet1 to VNet2.
    az network vnet peering create \
      --name myVnet1ToMyVnet2 \
      --resource-group $rgName \
      --vnet-name myVnet1 \
      --remote-vnet-id $vnet2Id \
      --allow-vnet-access

    # Peer VNet2 to VNet1.
    az network vnet peering create \
      --name myVnet2ToMyVnet1 \
      --resource-group $rgName \
      --vnet-name myVnet2 \
      --remote-vnet-id $vnet1Id \
      --allow-vnet-access
    ```

3. After the script executes, review the peerings for each virtual network. 

    ```azurecli-interactive
    az network vnet peering list \
      --resource-group myResourceGroup \
      --vnet-name myVnet1 \
      --output table
    ```
    
    Run the previous command again, replacing *myVnet1* with *myVnet2*. The output of both commands shows **Connected** in the **PeeringState** column.

     Any Azure resources you create in either virtual network are now able to communicate with each other through their IP addresses. If you're using default Azure name resolution for the virtual networks, the resources in the virtual networks are not able to resolve names across the virtual networks. If you want to resolve names across virtual networks in a peering, you must create your own DNS server. Learn how to set up [Name resolution using your own DNS server](virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-using-your-own-dns-server).

4. **Optional**: Though creating virtual machines is not covered in this tutorial, you can create a virtual machine in each virtual network and connect from one virtual machine to the other, to validate connectivity.
5. **Optional**: To delete the resources that you create in this tutorial, complete the steps in [Delete resources](#delete-cli) in this article.


## <a name="powershell"></a>Create peering - PowerShell

1. Install the latest version of the PowerShell [AzureRm](https://www.powershellgallery.com/packages/AzureRM/) module. If you're new to Azure PowerShell, see [Azure PowerShell overview](/powershell/azure/overview?toc=%2fazure%2fvirtual-network%2ftoc.json).
2. To start a PowerShell session, go to **Start**, enter **powershell**, and then click **PowerShell**.
3. In PowerShell, log in to Azure by entering the `login-azurermaccount` command. The account you log in with must have the necessary permissions to create a virtual network peering. See the [Permissions](#permissions) section of this article for details.
4. Create a resource group and two virtual networks. To execute the script, copy the following script, paste it into PowerShell, and then press `Enter` after the last line appears on the screen:

    ```powershell
    # Variables for common values used throughout the script.
    $rgName='myResourceGroup'
    $location='eastus'

    # Create a resource group.
    New-AzureRmResourceGroup `
      -Name $rgName `
      -Location $location

    # Create virtual network 1.
    $vnet1 = New-AzureRmVirtualNetwork `
      -ResourceGroupName $rgName `
      -Name 'myVnet1' `
      -AddressPrefix '10.0.0.0/16' `
      -Location $location

    # Create virtual network 2.
    $vnet2 = New-AzureRmVirtualNetwork `
      -ResourceGroupName $rgName `
      -Name 'myVnet2' `
      -AddressPrefix '10.1.0.0/16' `
      -Location $location
    ```

5. Create a virtual network peering between the two virtual networks. Copy the following script, paste in to PowerShell, and then press `Enter` after the last line appears on the screen:
    ```powershell
    # Peer VNet1 to VNet2.
    Add-AzureRmVirtualNetworkPeering `
      -Name 'myVnet1ToMyVnet2' `
      -VirtualNetwork $vnet1 `
      -RemoteVirtualNetworkId $vnet2.Id

    # Peer VNet2 to VNet1.
    Add-AzureRmVirtualNetworkPeering `
      -Name 'myVnet2ToMyVnet1' `
      -VirtualNetwork $vnet2 `
      -RemoteVirtualNetworkId $vnet1.Id
    ```
6. To review the subnets for the virtual network, copy the following command, paste in to PowerShell, and then press `Enter`:

    ```powershell
    Get-AzureRmVirtualNetworkPeering `
      -ResourceGroupName myResourceGroup `
      -VirtualNetworkName myVnet1 `
      | Format-Table VirtualNetworkName, PeeringState
    ```

    Run the previous command again, replacing *myVnet1* with *myVnet2*. The output of both commands shows **Connected** in the **PeeringState** column.
7. **Optional**: Though creating virtual machines is not covered in this tutorial, you can create a virtual machine in each virtual network and connect from one virtual machine to the other, to validate connectivity.
8. **Optional**: To delete the resources that you create in this tutorial, complete the steps in [Delete resources](#delete-powershell) in this article.

Any Azure resources you create in either virtual network are now able to communicate with each other through their IP addresses. If you're using default Azure name resolution for the virtual networks, the resources in the virtual networks are not able to resolve names across the virtual networks. If you want to resolve names across virtual networks in a peering, you must create your own DNS server. Learn how to set up [Name resolution using your own DNS server](virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-using-your-own-dns-server).

## <a name="template"></a>Create peering - Resource Manager template

1. Reference [Create a virtual network peering](https://azure.microsoft.com/resources/templates/201-vnet-to-vnet-peering) Resource Manager template. Instructions are provided with the template for deploying the template using the Azure portal, PowerShell, or the Azure CLI. Log in to whichever tool you choose to deploy the template with using an account that has the necessary permissions to create a virtual network peering. See the [Permissions](#permissions) section of this article for details.
2. **Optional**: Though creating virtual machines is not covered in this tutorial, you can create a virtual machine in each virtual network and connect from one virtual machine to the other, to validate connectivity.
3. **Optional**: To delete the resources that you create in this tutorial, complete the steps in the [Delete resources](#delete) section of this article, using either the Azure portal, PowerShell, or the Azure CLI.

## <a name="permissions"></a>Permissions

The accounts you use to create a virtual network peering must have the necessary role or permissions. For example, if you were peering two virtual networks named VNet1 and VNet2, your account must be assigned the following minimum role or permissions for each virtual network:
    
|Virtual network|Role|Permissions|
|---|---|---|
|VNet1|[Network Contributor](../active-directory/role-based-access-built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor)|Microsoft.Network/virtualNetworks/virtualNetworkPeerings/write|
|VNet2|[Network Contributor](../active-directory/role-based-access-built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor)|Microsoft.Network/virtualNetworks/peer|

Learn more about [built-in roles](../active-directory/role-based-access-built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) and assigning specific permissions to [custom roles](../active-directory/role-based-access-control-custom-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json) (Resource Manager only).

## <a name="delete"></a>Delete resources
When you've finished this tutorial, you might want to delete the resources you created in the tutorial, so you don't incur usage charges. Deleting a resource group also deletes all resources that are in the resource group.

### <a name="delete-portal"></a>Azure portal

1. In the portal search box, enter **myResourceGroup**. In the search results, click **myResourceGroup**.
2. On the **myResourceGroup** blade, click the **Delete** icon.
3. To confirm the deletion, in the **TYPE THE RESOURCE GROUP NAME** box, enter **myResourceGroup**, and then click **Delete**.

### <a name="delete-cli"></a>Azure CLI

Enter the following command:

```azurecli-interactive
az group delete --name myResourceGroup --yes
```

### <a name="delete-powershell"></a>PowerShell

Enter the following command:

```powershell
Remove-AzureRmResourceGroup -Name myResourceGroup -force
```

## Next steps

- Thoroughly familiarize yourself with important [virtual network peering constraints and behaviors](virtual-network-manage-peering.md#requirements-and-constraints) before creating a virtual network peering for production use.
- Learn about all [virtual network peering settings](virtual-network-manage-peering.md#create-a-peering).
- Learn how to [create a hub and spoke network topology](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke?toc=%2fazure%2fvirtual-network%2ftoc.json#vnet-peering) with virtual network peering.
