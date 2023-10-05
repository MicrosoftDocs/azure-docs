---
title: Dissociate a public IP address from an Azure VM
titlesuffix: Azure Virtual Network
description: Learn how to dissociate a public IP address from an Azure virtual machine (VM) using the Azure portal, Azure CLI or Azure PowerShell.
services: virtual-network
author: mbender-ms
ms.author: mbender
ms.date: 08/24/2023
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: how-to
ms.workload: infrastructure-services
ms.custom: template-how-to, engagement-fy23, devx-track-azurepowershell, devx-track-azurecli
---

# Dissociate a public IP address from an Azure VM 

In this article, you learn how to dissociate a public IP address from an Azure virtual machine (VM).

You can use the [Azure portal](#azure-portal), the [Azure CLI](#azure-cli), or [Azure PowerShell](#powershell) to dissociate a public IP address from a VM.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Browse to, or search for the virtual machine that you want to disassociate the public IP address from and then select it.
3. In the VM page, select **Overview**, and then select the public IP address.

    :::image type="content" source="./media/remove-public-ip-address-vm/vm-public-ip.png" alt-text="Screenshot of the Overview page of a virtual machine showing of the public IP.":::

4. In the public IP address page, select **Overview**, and then select **Dissociate**.

5. In **Dissociate public IP address**, select **Yes**.

    :::image type="content" source="./media/remove-public-ip-address-vm/dissociate-public-ip.png" alt-text="Screenshot of the Overview page of a public IP address resource showing how to dissociate it from the network interface of a virtual machine.":::

## Azure CLI

Install the [Azure CLI](/cli/azure/install-azure-cli), or use the [Azure Cloud Shell](../../cloud-shell/overview.md). The Azure Cloud Shell is a free shell that you can run directly within the Azure portal. It has the Azure CLI preinstalled and configured to use with your account.

- If using the CLI locally in Bash, sign in to Azure with `az login`.

A public IP address is associated to an IP configuration of a network interface attached to a VM. Use the [az network nic-ip-config update](/cli/azure/network/nic/ip-config#az-network-nic-ip-config-update) command to dissociate a public IP address from an IP configuration.

The following example dissociates a public IP address named *myVMPublicIP* from an IP configuration named *ipconfigmyVM* of an existing network interface named *myVMNic* that is attached to a VM named *myVM* in a resource group named *myResourceGroup*.
  
```azurecli-interactive
az network nic ip-config update \
 --name ipconfigmyVM \
 --resource-group myResourceGroup \
 --nic-name myVMNic \
 --public-ip-address null
```

- If you don't know the name of the network interface attached to your VM, use the [az vm nic list](/cli/azure/vm/nic#az-vm-nic-list) command to view them. For example, the following command lists the names of the network interfaces attached to a VM named *myVM* in a resource group named *myResourceGroup*:

    ```azurecli-interactive
    az vm nic list --vm-name myVM --resource-group myResourceGroup
    ```

    The output includes one or more lines that are similar to the following example:
  
    ```
    "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/myVMNic",
    ```

    In the previous example, *myVMVic* is the name of the network interface.

- If you don't know the name of the IP configuration of a network interface, use the [az network nic ip-config list](/cli/azure/network/nic/ip-config#az-network-nic-ip-config-list) command to retrieve them. For example, the following command lists the names of the IP configurations for a network interface named *myVMNic* in a resource group named *myResourceGroup*:

    ```azurecli-interactive
    az network nic ip-config list --nic-name myVMNic --resource-group myResourceGroup --out table
    ```

    The output is similar to the following example:

    ```
    Name           Primary    PrivateIpAddress    PrivateIpAddressVersion    PrivateIpAllocationMethod    ProvisioningState    ResourceGroup
    ------------   ---------  ------------------  -------------------------  ---------------------------  -------------------  ---------------
    ipconfigmyVM   True       10.0.0.4            IPv4                       Dynamic                      Succeeded            myResourceGroup
    ```

    In the previous example, *ipconfigmyVM* is the name of the IP configuration.

- If you don't know the name of the public IP address associated to an IP configuration, use the [az network nic ip-config show](/cli/azure/network/nic/ip-config#az-network-nic-ip-config-show) command to retrieve them. For example, the following command lists the names of the public IP addresses for a network interface named *myVMNic* in a resource group named *myResourceGroup*:

    ```azurecli-interactive
    az network nic ip-config show --name ipconfigmyVM --nic-name myVMNic --resource-group myResourceGroup --query publicIpAddress.id
    ```
    The output includes one or more lines that are similar to the following example:
  
    ```
    "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Network/publicIPAddresses/myVMPublicIP",
    ```

    In the previous example, *myVMPublicIP* is the name of the public IP address.

## PowerShell

Install [PowerShell](/powershell/azure/install-azure-powershell), or use the [Azure Cloud Shell](../../cloud-shell/overview.md). The Azure Cloud Shell is a free shell that you can run directly within the Azure portal. It has PowerShell preinstalled and configured to use with your account.

- If using PowerShell locally, sign in to Azure with `Connect-AzAccount`.

A public IP address is associated to an IP configuration of a network interface attached to a VM. Use the [Get-AzNetworkInterface](/powershell/module/Az.Network/Get-AzNetworkInterface) command to get a network interface. Set the Public IP address value to null and then use the [Set-AzNetworkInterface](/powershell/module/Az.Network/Set-AzNetworkInterface) command to write the new IP configuration to the network interface.

The following example dissociates a public IP address named *myVMPublicIP* from a network interface named *myVMNic* that is attached to a VM named *myVM*. All resources are in a resource group named *myResourceGroup*.
  
```azurepowershell
$nic = Get-AzNetworkInterface -Name myVMNic -ResourceGroup myResourceGroup
$nic.IpConfigurations[0].PublicIpAddress = $null
Set-AzNetworkInterface -NetworkInterface $nic
```

- If you don't know the name of the network interface attached to your VM, use the [Get-AzVM](/powershell/module/Az.Compute/Get-AzVM) command to view them. For example, the following command lists the names of the network interfaces attached to a VM named *myVM* in a resource group named *myResourceGroup*:

    ```azurepowershell
    $vm = Get-AzVM -name myVM -ResourceGroupName myResourceGroup
    $vm.NetworkProfile
    ```

    The output includes one or more lines that are similar to the following example:

    ```
    "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/myVMNic",
    ```

    In the previous example, *myVMNic* is the name of the network interface.

- If you don't know the name of an IP configuration for a network interface, use the [Get-AzNetworkInterface](/powershell/module/Az.Network/Get-AzNetworkInterface) command to retrieve them. For example, the following command lists the names of the IP configurations for a network interface named *myVMNic* in a resource group named *myResourceGroup*:

    ```azurepowershell-interactive
    $nic = Get-AzNetworkInterface -Name myVMNic -ResourceGroupName myResourceGroup
    $nic.IPConfigurations.Id
    ```

    The output includes one or more lines that are similar to the following example:

    ```
    "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/myVMNic/ipConfigurations/ipconfigmyVM"
    ```

    In the previous example, *ipconfigmyVM* is the name of the IP configuration.

- If you don't know the name of the public IP address associated to an IP configuration, use the [Get-AzNetworkInterface](/powershell/module/Az.Network/Get-AzNetworkInterface) command to retrieve them. For example, the following command lists the name of the public IP addresses for a network interface named *myVMNic* in a resource group named *myResourceGroup*:

    ```azurepowershell-interactive
    $nic = Get-AzNetworkInterface -Name myVMNic -ResourceGroupName myResourceGroup
    $nic.IPConfigurations.PublicIpAddress.Id
    ```

    The output includes one or more lines that are similar to the following example:

    ```
    "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Network/publicIPAddresses/myPublicIP"
    ```

    In the previous example, *myVMPublicIP* is the name of the public IP address.

## Next steps

In this article, you learned how to dissociate a public IP address from a virtual machine.

- Learn more about [public IP addresses](./public-ip-addresses.md) in Azure.

- Learn how to [associate a public IP address to a VM](./associate-public-ip-address-vm.md).

- Learn how to [configure IP addresses for an Azure network interface](./virtual-network-network-interface-addresses.md).
