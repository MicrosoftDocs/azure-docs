---
title: Create a VM with a static private IP address using the Azure portal, Azure PowerShell, or Azure CLI
description: Learn to create a virtual machine with a static private IP address using the Azure portal, Azure PowerShell, or Azure CLI.
ms.date: 11/19/2024
ms.author: mbender
author: mbender-ms
ms.service: azure-virtual-network
ms.subservice: ip-services
ms.topic: how-to
ms.custom: template-how-to, engagement-fy23
---

# Create a virtual machine with a static private IP address

When you create a virtual machine (VM), it's automatically assigned a private IP address from a range that you specify. This IP address is based on the subnet in which the VM is deployed, and the VM keeps this address until the VM is deleted. Azure dynamically assigns the next available private IP address from the subnet you create a VM in. If you want to assign a specific IP address in this subnet for your VM, use a static IP address.

[!INCLUDE [ip-services-prerequisites](../../../includes/ip-services-prerequisites.md)]

## Create a resource group and a virtual machine

# [Azure portal](#tab/azureportal)

Use the following steps to create a virtual network along with a resource group and necessary network resources:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the portal, search for and select **Virtual machines**.
1. Select **Create** > **Azure virtual machine**.
1. On the **Basics** tab of the **Create a virtual machine** screen, enter or select the following values:

    | Setting                | Value                                             |
    |------------------------|---------------------------------------------------|
    | **Subscription**       | Keep the default or select a different subscription |
    | **Resource group**     | Select **Create new**, and then name the group *myResourceGroup* |
    | **Virtual machine name** | Enter *myVM*                                     |
    | **Region**             | Select **(US) East US**                           |
    | **Availability options** | Select **No infrastructure redundancy required** |
    | **Image**              | Select **Windows Server 2019 Datacenter - x64 Gen2** |
    | **Size**               | Accept the default, or drop down and select a size |
    | **Username**           | Enter an admin username for the VM                |
    | **Password**           | Enter a password for the VM                       |
    | **Confirm password**   | Confirm the password for the VM                   |
    | **Public inbound ports** | Select **Allow selected ports**                  |
    | **Select inbound ports** | Select **RDP (3389)**                            |

    > [!WARNING]
    > In this example, you open port 3389 to enable remote access to the Windows Server VM from the internet. However, opening port 3389 to the internet is not recommended to manage production workloads. For information about secure access to Azure VMs, see [What is Azure Bastion?](../../bastion/bastion-overview.md).

1. Select the **Networking** tab at the top of the page.
  
1. On the **Networking** page, enter or select the following values:

   - **Virtual network**: Accept the default network name.
   - **Subnet**: Select **default** if not already selected.
   - **Public IP**: Accept the default public IP configuration.
   - **Public inbound ports**: Select **Allow selected ports**.
   - **Select inbound ports**: Select **RDP (3389)**.

1. Select **Review + create**. Review the settings, and then select **Create**.

[!INCLUDE [ephemeral-ip-note.md](~/reusable-content/ce-skilling/azure/includes/ephemeral-ip-note.md)]

# [Azure PowerShell](#tab/azurepowershell)

Use the following steps to create a resource group and a virtual machine.

### Create a resource group

The following command creates a resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup).

```azurepowershell-interactive
## Create resource group. ##
$rg =@{
    Name = 'myResourceGroup'
    Location = 'eastus2'
}
New-AzResourceGroup @rg

```
### Create a virtual machine

The following command creates a Windows Server virtual machine with [New-AzVM](/powershell/module/az.compute/new-azvm). When prompted, provide a username and password to be used as the credentials for the virtual machine:

```azurepowershell-interactive
## Create virtual machine. ##
$vm = @{
    ResourceGroupName = 'myResourceGroup'
    Location = 'East US 2'
    Name = 'myVM'
    PublicIpAddressName = 'myPublicIP'
}
New-AzVM @vm
```

# [Azure CLI](#tab/azurecli)

Use the following steps to create a resource group and a virtual machine.

### Create a resource group

The following command creates a resource group with [az group create](/cli/azure/group#az-group-create):

```azurecli
  az group create --name myResourceGroup --location eastus2
```

### Create a virtual machine

The following command creates a Windows Server virtual machine with [az vm create](/cli/azure/vm#az-vm-create). When prompted, provide a username and password to be used as the credentials for the virtual machine:

```azurecli-interactive
  az vm create \
    --name myVM \
    --resource-group myResourceGroup \
    --public-ip-address myPublicIP \
    --public-ip-sku Standard \
    --image MicrosoftWindowsServer:WindowsServer:2019-Datacenter:latest \
    --admin-username azureuser
```
---

## Change private IP address to static

# [Azure portal](#tab/azureportal)

In the following steps, you change the private IP address **static** for the VM created previously:

1. In the portal, search for and select **Virtual machines**.

2. In **Virtual machines**, select **myVM** from the list.

3. On the **myVM** page, under **Settings**, select **Networking**.

4. In **Networking**, select the name of the network interface next to **Network interface**.

5. On the **Network interface** page, under **Settings**, select **IP configurations**.

6. In **IP configurations**, select **ipconfig1** in the list.

7. Under **Assignment**, select **Static**. Change the private **IP address** if you want a different one, and then select **Save**.

    > [!WARNING]
    > If you change the private IP address, the VM associated with the network interface will be restarted to utilize the new IP address.

> [!WARNING]
> From within the operating system of a VM, avoid associating a static *private* IP address on an Azure VM. Only assign a static private IP when it's necessary, such as when [assigning many IP addresses to VMs](virtual-network-multiple-ip-addresses-portal.md).
>
>If you manually set the private IP address within the operating system, make sure it matches the private IP address assigned to the Azure [network interface](virtual-network-network-interface-addresses.md#change-ip-address-settings). Otherwise, you can lose connectivity to the VM. For more information, see [private IP address settings](virtual-network-network-interface-addresses.md#private).

# [Azure PowerShell](#tab/azurepowershell)

Azure PowerShell cmdlets used to change the private IP address to static are as follows:

| Command | Description |
|---------|-------------|
| `Get-AzVirtualNetwork` | Use [Get-AzVirtualNetwork](/powershell/module/az.network/get-azvirtualnetwork) to place the virtual network configuration into a variable. |
| `Get-AzVirtualNetworkSubnetConfig` | Use [Get-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/get-azvirtualnetworksubnetconfig) to place the subnet configuration into a variable. |
| `Get-AzNetworkInterface` | Use [Get-AzNetworkInterface](/powershell/module/az.network/get-aznetworkinterface) to obtain the network interface configuration and place into a variable. |
| `Set-AzNetworkInterfaceIpConfig` | Use [Set-AzNetworkInterfaceIpConfig](/powershell/module/az.network/set-aznetworkinterfaceipconfig) to set the configuration of the network interface. |
| `Set-AzNetworkInterface` | Finally, use [Set-AzNetworkInterface](/powershell/module/az.network/set-aznetworkinterface) to set the configuration for the virtual machine. |

With the following commands, you change the private IP address of the virtual machine to **static**:

```azurepowershell-interactive
## Place virtual network configuration into a variable. ##
$net = @{
    Name = 'myVM'
    ResourceGroupName = 'myResourceGroup'
}
$vnet = Get-AzVirtualNetwork @net

## Place subnet configuration into a variable. ##
$sub = @{
    Name = 'myVM'
    VirtualNetwork = $vnet
}
$subnet = Get-AzVirtualNetworkSubnetConfig @sub

## Get name of network interface and place into a variable ##
$int1 = @{
    Name = 'myVM'
    ResourceGroupName = 'myResourceGroup'
}
$vm = Get-AzVM @int1

## Place network interface configuration into a variable. ##
$nic = Get-AzNetworkInterface -ResourceId $vm.NetworkProfile.NetworkInterfaces.Id

## Set interface configuration. ##
$config =@{
    Name = 'myVM'
    PrivateIpAddress = '192.168.1.4'
    Subnet = $subnet
}
$nic | Set-AzNetworkInterfaceIpConfig @config -Primary

## Save interface configuration. ##
$nic | Set-AzNetworkInterface
```

> [!WARNING]
> From within the operating system of a VM, you shouldn't statically assign the *private* IP that's assigned to the Azure VM. Only do static assignment of a private IP when it's necessary, such as when [assigning many IP addresses to VMs](virtual-network-multiple-ip-addresses-portal.md). 
>
>If you manually set the private IP address within the operating system, make sure it matches the private IP address assigned to the Azure [network interface](virtual-network-network-interface-addresses.md#change-ip-address-settings). Otherwise, you can lose connectivity to the VM. Learn more about [private IP address](virtual-network-network-interface-addresses.md#private) settings.

# [Azure CLI](#tab/azurecli)

Use [az network nic ip-config update](/cli/azure/network/nic/ip-config#az-network-nic-ip-config-update) to update the network interface configuration.

With the following commands, you change the private IP address of the virtual machine to **static**:

```azurecli-interactive
  az network nic ip-config update \
    --name ipconfigmyVM \
    --resource-group myResourceGroup \
    --nic-name myVMVMNic \
    --private-ip-address 10.0.0.4
```

> [!WARNING]
> From within the operating system of a VM, you shouldn't statically assign the *private* IP that's assigned to the Azure VM. Only do static assignment of a private IP when it's necessary, such as when [assigning many IP addresses to VMs](virtual-network-multiple-ip-addresses-portal.md). 
>
>If you manually set the private IP address within the operating system, make sure it matches the private IP address assigned to the Azure [network interface](virtual-network-network-interface-addresses.md#change-ip-address-settings). Otherwise, you can lose connectivity to the VM. Learn more about [private IP address](virtual-network-network-interface-addresses.md#private) settings.

---

## Clean up resources
# [Azure portal](#tab/azureportal)

When all the resources are no longer need, delete the resource group and all of the resources it contains:

1. In the portal, search for and select **myResourceGroup**.

1. From the **myResourceGroup** screen, select **Delete resource group**.

1. Enter *myResourceGroup* for **Enter resource group name to confirm deletion**, and then select **Delete**.

# [Azure PowerShell](#tab/azurepowershell)

When all the resources are no longer need, use [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) to remove the resource group and all of the resources it contains:

```azurepowershell-interactive
Remove-AzResourceGroup -Name myResourceGroup -Force
```

# [Azure CLI](#tab/azurecli)

When all the resources are no longer need, use [az group delete](/cli/azure/group#az-group-delete) to remove the resource group and all of the resources it contains:

```azurecli-interactive
  az group delete --name myResourceGroup --yes
```

---
## Next steps

- Learn more about [static public IP addresses](public-ip-addresses.md#ip-address-assignment) in Azure.

- Learn more about [public IP addresses](public-ip-addresses.md#public-ip-addresses) in Azure.

- Learn more about Azure [public IP address settings](virtual-network-public-ip-address.md#create-a-public-ip-address).

- Learn more about [private IP addresses](private-ip-addresses.md) and assigning a [static private IP address](virtual-network-network-interface-addresses.md#add-ip-addresses) to an Azure VM.
