---
title: Associate a public IP address to a virtual machine
titlesuffix: Azure Virtual Network
description: Learn how to associate a public IP address to a virtual machine (VM) by using the Azure portal, the Azure CLI, or Azure PowerShell.
services: virtual-network
author: asudbring
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 03/07/2023
ms.author: allensu
ms.custom: template-how-to, engagement-fy23
---

# Associate a public IP address to a virtual machine

In this article, you learn how to associate a public IP address to an existing virtual machine (VM). Specifically, you associate the public IP address to an IP configuration of a network interface attached to a VM.

 If you want to create a new VM with a public IP address, you can use the [Azure portal](virtual-network-deploy-static-pip-arm-portal.md), the [Azure CLI](virtual-network-deploy-static-pip-arm-cli.md), or [Azure PowerShell](virtual-network-deploy-static-pip-arm-ps.md).

To associate a public IP address to an existing VM, you can use the [Azure portal](#azure-portal), the [Azure CLI](#azure-cli), or [Azure PowerShell](#powershell).

Public IP addresses have a nominal fee. For details, see [pricing](https://azure.microsoft.com/pricing/details/ip-addresses/). There's a limit to the number of public IP addresses that you can use per subscription. For details, see [limits](../../azure-resource-manager/management/azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#publicip-address).

[!INCLUDE [ephemeral-ip-note.md](../../../includes/ephemeral-ip-note.md)]

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for and select the VM that you want to add the public IP address to.
1. Under **Settings** in the left pane, select **Networking**, and then select the network interface you want to add the public IP address to.

    :::image type="content" source="./media/associate-public-ip-address-vm/select-nic.png" alt-text="Screenshot showing how to select the network interface of a VM.":::

   > [!NOTE]
   > Public IP addresses are associated to the network interfaces that are attached to a VM. In this screenshot, the VM has only one network interface. If the VM had multiple network interfaces, they would all appear, and you'd select the network interface you want to associate the public IP address to.

1. From the **Network interface** window, select **IP configurations** under **Setting**, and then select an IP configuration from the list.

    :::image type="content" source="./media/associate-public-ip-address-vm/select-ip-configuration.png" alt-text="Screenshot showing how to select the I P configuration of a network interface.":::

   > [!NOTE]
   > Public IP addresses are associated to the IP configurations for a network interface. In this screenshot, the network interface has one IP configuration. If the network interface had multiple IP configurations, they would all appear in the list, and you'd select the IP configuration that you want to associate the public IP address to.

1. Select **Associate**, then select **Public IP address** to choose an existing public IP address from the drop-down list. If no public IP addresses are listed, you need to create one. To learn how, see [Create a public IP address](virtual-network-public-ip-address.md#create-a-public-ip-address).

    :::image type="content" source="./media/associate-public-ip-address-vm/choose-public-ip-address.png" alt-text="Screenshot showing how to select and associate an existing public I P.":::

1. Select **Save**, and then close the IP configuration window.

    :::image type="content" source="./media/associate-public-ip-address-vm/enable-public-ip-address.png" alt-text="Screenshot showing the selected public I P.":::

   > [!NOTE]
   > The public IP addresses that appear are those that exist in the same region as the VM. If you have multiple public IP addresses created in the region, all will appear here. If any are grayed out, it's because the address is already associated to a different resource.

1. View the public IP address assigned to the IP configuration. It might take a few seconds for an IP address to appear.

    :::image type="content" source="./media/associate-public-ip-address-vm/view-assigned-public-ip-address.png" alt-text="Screenshot showing the newly assigned public I P.":::

   > [!NOTE]
   > The address is assigned from a pool of addresses used in each Azure region. For a list of address pools used in each region, see [Azure IP Ranges and Service Tags](https://www.microsoft.com/download/details.aspx?id=56519). The address assigned can be any address in the pools used for the region. If you need the address to be assigned from a specific pool in the region, use a [Public IP address prefix](public-ip-address-prefix.md).

1. Open the necessary ports in your security groups by adjusting the security rules in the network security groups. For information, see [Allow network traffic to the VM](#allow-network-traffic-to-the-vm).

## Azure CLI

Install the [Azure CLI](/cli/azure/install-azure-cli?toc=%2fazure%2fvirtual-network%2ftoc.json) on your machine, or use the Azure Cloud Shell. The Azure Cloud Shell is a free Bash shell that you can run directly within the Azure portal. It includes the Azure CLI preinstalled and configured to use with your Azure account. Select the **Try it** button in the Azure CLI code examples that follow. When you select **Try it**, Azure Cloud Shell loads in your browser and automatically signs into your Azure account.

1. If you're using the Azure CLI locally in Bash, sign in to Azure with `az login`.

1. Use the [az network nic ip-config update](/cli/azure/network/nic/ip-config#az-network-nic-ip-config-update) command to associate a public IP address to an IP configuration. The following example associates an existing public IP address named *myPublicIP* to an IP configuration named *ipconfig1*. This IP configuration belongs to an existing network interface named *myVMNic* in a resource group named *myResourceGroup*.
  
   ```azurecli-interactive
   az network nic ip-config update \
     --name ipconfig1 \
     --nic-name myVMNic \
     --resource-group myResourceGroup \
     --public-ip-address myPublicIP
   ```

1. If you don't have an existing public IP address, use the [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create) command to create one. For example, the following command creates a public IP address named *myPublicIP* in a resource group named *myResourceGroup*.
  
     ```azurecli-interactive
     az network public-ip create --name myPublicIP --resource-group myResourceGroup
     ```

     > [!NOTE]
     > This command creates a public IP address with default values for several settings that you may want to customize. For more information about public IP address settings, see [Create a public IP address](virtual-network-public-ip-address.md#create-a-public-ip-address). The address is assigned from a specific pool of public IP addresses that's used for each Azure region. To see a list of address pools used in each region, see [Azure IP Ranges and Service Tags](https://www.microsoft.com/download/details.aspx?id=56519).

1. If you don't know the names of the network interfaces attached to your VM, use the [az vm nic list](/cli/azure/vm/nic#az-vm-nic-list) command to view them. For example, the following command lists the network interfaces attached to a VM named *myVM* in a resource group named *myResourceGroup*:

     ```azurecli-interactive
     az vm nic list --vm-name myVM --resource-group myResourceGroup
     ```

     The output includes one or more lines that are similar to the following example, where *myVMNic* is the name of the network interface:
  
     ```output
     "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/myVMNic",
     ```

1. If you don't know the names of the IP configurations for a network interface, use the [az network nic ip-config list](/cli/azure/network/nic/ip-config#az-network-nic-ip-config-list) command to retrieve them. For example, the following command lists the names of the IP configurations for a network interface named *myVMNic* in a resource group named *myResourceGroup*:

     ```azurecli-interactive
     az network nic ip-config list --nic-name myVMNic --resource-group myResourceGroup --out table
     ```

1. View the public IP address assigned to the IP configuration with the [az vm list-ip-addresses](/cli/azure/vm#az-vm-list-ip-addresses) command. The following example shows the IP addresses assigned to an existing VM named *myVM* in a resource group named *myResourceGroup*.

   ```azurecli-interactive
   az vm list-ip-addresses --name myVM --resource-group myResourceGroup --out table
   ```

   > [!NOTE]
   > The IP address is assigned from a specific pool of addresses used in each Azure region. For a list of address pools used in each region, see [Azure IP Ranges and Service Tags](https://www.microsoft.com/download/details.aspx?id=56519). The address assigned can be any address in the pools used for the region. If you need the address to be assigned from a specific pool in the region, use a [Public IP address prefix](public-ip-address-prefix.md).

1. Open the necessary ports in your security groups by adjusting the security rules in the network security groups. For information, see [Allow network traffic to the VM](#allow-network-traffic-to-the-vm).

## PowerShell

Install [Azure PowerShell](/powershell/azure/install-az-ps) on your machine, or use the Azure Cloud Shell. The Azure Cloud Shell is a free Bash shell that you can run directly within the Azure portal. It includes Azure PowerShell preinstalled and configured to use with your Azure account. Select the **Try it** button in the Azure PowerShell code examples that follow. When you select **Try it**, Azure Cloud Shell loads in your browser and automatically signs into your Azure account.

1. If you're using Azure PowerShell locally, sign in to Azure with `Connect-AzAccount`.

1. Use the [Get-AzVirtualNetwork](/powershell/module/Az.Network/Get-AzVirtualNetwork) and [Get-AzVirtualNetworkSubnetConfig](/powershell/module/Az.Network/Get-AzVirtualNetworkSubnetConfig) commands to get the virtual network and subnet that the network interface is in.

1. Use the [Get-AzNetworkInterface](/powershell/module/Az.Network/Get-AzNetworkInterface) command to get a network interface and the [Get-AzPublicIpAddress](/powershell/module/az.network/get-azpublicipaddress) command to get an existing public IP address.

1. Use the [Set-AzNetworkInterfaceIpConfig](/powershell/module/Az.Network/Set-AzNetworkInterfaceIpConfig) command to associate the public IP address to the IP configuration and the [Set-AzNetworkInterface](/powershell/module/Az.Network/Set-AzNetworkInterface) command to write the new IP configuration to the network interface.

   The following example associates an existing public IP address named *myPublicIP* to an IP configuration named *ipconfig1*. This IP configuration belongs to an existing network interface named *myVMNic* that exists in a subnet named *mySubnet* in a virtual network named *myVNet*. All resources are in a resource group named *myResourceGroup*.
  
   ```azurepowershell-interactive
   $vnet = Get-AzVirtualNetwork -Name myVNet -ResourceGroupName myResourceGroup
   $subnet = Get-AzVirtualNetworkSubnetConfig -Name mySubnet -VirtualNetwork $vnet
   $nic = Get-AzNetworkInterface -Name myVMNic -ResourceGroupName myResourceGroup
   $pip = Get-AzPublicIpAddress -Name myPublicIP -ResourceGroupName myResourceGroup
   $nic | Set-AzNetworkInterfaceIpConfig -Name ipconfig1 -PublicIPAddress $pip -Subnet $subnet
   $nic | Set-AzNetworkInterface
   ```

1. If you don't have an existing public IP address, use the [New-AzPublicIpAddress](/powershell/module/Az.Network/New-AzPublicIpAddress) command to create one. For example, the following command creates a dynamic public IP address named *myPublicIP* in a resource group named *myResourceGroup* in the *eastus* region.
  
     ```azurepowershell-interactive
     New-AzPublicIpAddress -Name myPublicIP -ResourceGroupName myResourceGroup -AllocationMethod Dynamic -Location eastus
     ```

     > [!NOTE]
     > This command creates a public IP address with default values for several settings that you may want to customize. For more information about public IP address settings, see [Create a public IP address](virtual-network-public-ip-address.md#create-a-public-ip-address). The address is assigned from a specific pool of public IP addresses that's used for each Azure region. To see a list of address pools used in each region, see [Azure IP Ranges and Service Tags](https://www.microsoft.com/download/details.aspx?id=56519).

1. If you don't know the names of the network interfaces attached to your VM, use the [Get-AzVM](/powershell/module/Az.Compute/Get-AzVM) command to view them. For example, the following command lists the network interfaces attached to a VM named *myVM* in a resource group named *myResourceGroup*:

     ```azurepowershell-interactive
     $vm = Get-AzVM -name myVM -ResourceGroupName myResourceGroup
     $vm.NetworkProfile
     ```

     The output includes one or more lines that are similar to the example that follows. In the example output, *myVMNic* is the name of the network interface.
  
     ```output
     "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/myVMNic",
     ```

1. If you don't know the name of the virtual network or subnet that the network interface is in, use the `Get-AzNetworkInterface` command to view the information. For example, the following command gets the virtual network and subnet information for a network interface named *myVMNic* in a resource group named *myResourceGroup*:

     ```azurepowershell-interactive
     $nic = Get-AzNetworkInterface -Name myVMNic -ResourceGroupName myResourceGroup
     $ipConfigs = $nic.IpConfigurations
     $ipConfigs.Subnet | Select Id
     ```

     The output includes one or more lines that are similar to the example that follows. In the example output, *myVNet* is the name of the virtual network and *mySubnet* is the name of the subnet.
  
     ```output
     "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myVNet/subnets/mySubnet",
     ```

1. If you don't know the name of an IP configuration for a network interface, use the [Get-AzNetworkInterface](/powershell/module/Az.Network/Get-AzNetworkInterface) command to retrieve them. For example, the following command lists the names of the IP configurations for a network interface named *myVMNic* in a resource group named *myResourceGroup*:

     ```azurepowershell-interactive
     $nic = Get-AzNetworkInterface -Name myVMNic -ResourceGroupName myResourceGroup
     $nic.IPConfigurations
     ```

     The output includes one or more lines that are similar to the example that follows. In the example output, *ipconfig1* is the name of an IP configuration.
  
     ```output
     Id : /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/myVMNic/ipConfigurations/ipconfig1
     ```

1. View the public IP address assigned to the IP configuration with the [Get-AzPublicIpAddress](/powershell/module/az.network/get-azpublicipaddress) command. The following example shows the address assigned to a public IP address named *myPublicIP* in a resource group named *myResourceGroup*.

   ```azurepowershell-interactive
   Get-AzPublicIpAddress -Name myPublicIP -ResourceGroupName myResourceGroup | Select IpAddress
   ```

1. If you don't know the names of the public IP addresses assigned to an IP configuration, run the following commands to list them:

   ```azurepowershell-interactive
   $nic = Get-AzNetworkInterface -Name myVMNic -ResourceGroupName myResourceGroup
   $nic.IPConfigurations
   $address = $nic.IPConfigurations.PublicIpAddress
   $address | Select Id
   ```

   The output includes one or more lines that are similar to the example that follows. In the example output, *myPublicIP* is the name of the public IP address assigned to the IP configuration.

   ```output
   "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Network/publicIPAddresses/myPublicIP"
   ```

   > [!NOTE]
   > The address is assigned from a specific pool of addresses used in each Azure region. To see a list of address pools used in each region, see [Azure IP Ranges and Service Tags](https://www.microsoft.com/download/details.aspx?id=56519). The address assigned can be any address in the pools used for the region. If you need the address to be assigned from a specific pool in the region, use a [Public IP address prefix](public-ip-address-prefix.md).

1. Open the necessary ports in your security groups by adjusting the security rules in the network security groups. For information, see [Allow network traffic to the VM](#allow-network-traffic-to-the-vm).

## Allow network traffic to the VM

Before you can connect to a public IP address from the internet, you must open the necessary ports in your security groups. These ports must be open in any network security group that you might have associated to the network interface, the subnet of the network interface, or both. Although security groups filter traffic to the private IP address of the network interface, after inbound internet traffic arrives at the public IP address, Azure translates the public address to the private IP address. Therefore, if a network security group prevents the traffic flow, the communication with the public IP address fails.

You can view the effective security rules for a network interface and its subnet for the [Azure portal](../../virtual-network/diagnose-network-traffic-filter-problem.md#diagnose-using-azure-portal), the [Azure CLI](../../virtual-network/diagnose-network-traffic-filter-problem.md#diagnose-using-azure-cli), or [Azure PowerShell](../../virtual-network/diagnose-network-traffic-filter-problem.md#diagnose-using-powershell).

## Next steps

In this article, you learned how to associate a public IP address to a VM using the Azure portal, Azure CLI, or Azure PowerShell.

- Use a [network security group](../../virtual-network/network-security-groups-overview.md) to allow inbound internet traffic to your VM.

- Learn how to [create a network security group](../../virtual-network/manage-network-security-group.md#work-with-network-security-groups).
