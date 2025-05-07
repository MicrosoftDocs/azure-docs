---
title: Create a VM with a static public IP address using the Azure portal, Azure PowerShell, or Azure CLI
description: Learn how to create a VM with a static public IP address using the Azure portal, Azure PowerShell, or Azure CLI.
services: virtual-network
ms.date: 11/14/2024
ms.author: mbender
author: mbender-ms
ms.service: azure-virtual-network
ms.subservice: ip-services
ms.topic: how-to
ms.custom: template-how-to
---
# Create a virtual machine with a static public IP address using the Azure portal, Azure PowerShell, or Azure CLI

In this article, you create a virtual machine (VM) with a static public IP address. A public IP address enables you to communicate to a VM from the internet. Assign a static public IP address, rather than a dynamic address, to ensure the address never changes. 

Public IP addresses have a [nominal charge](https://azure.microsoft.com/pricing/details/ip-addresses). There's a [limit](../../azure-resource-manager/management/azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits) to the number of public IP addresses that you can use per subscription. 

You can download the list of ranges (prefixes) for the Azure [Public](https://www.microsoft.com/download/details.aspx?id=56519), [US government](https://www.microsoft.com/download/details.aspx?id=57063), [China](https://www.microsoft.com/download/details.aspx?id=57062), and [Germany](https://www.microsoft.com/download/details.aspx?id=57064) clouds.

[!INCLUDE [ip-services-prerequisites](../../../includes/ip-services-prerequisites.md)]

## Create a virtual machine with a static public IP address

In this section, you create a virtual machine with a static public IP address using the Azure portal, Azure PowerShell, or Azure CLI. Along with the virtual machine, you create a public IP address and the other required resources.

# [Azure portal](#tab/azureportal)

### Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

### Create a virtual machine

1. In the search box at the top of the portal, enter *Virtual machine*.

2. In the search results, select **Virtual machines**. 

3. Select **+ Create**, then select **Azure virtual machine**.

4. In **Basics** tab of **Create a virtual machine**, enter or select the following:

    | Setting | Value  |
    | ------- | ------ |
    | **Project Details** |  |
    | Subscription | Select your Azure subscription |
    | Resource Group | Select **Create new**.</br> In **Name**, enter *myResourceGroup*.</br> Select **OK**. |
    | **Instance details** |  |
    | Virtual machine name | Enter *myVM*. |
    | Region | Select **East US**. |
    | Availability Options | Select **No infrastructure redundancy required**. |
    | Security type | Select **Standard**. |
    | Image | Select **Windows Server 2019 Datacenter - x64 Gen2**. |
    | Size | Choose VM size or take default setting. |
    | **Administrator account** |  |
    | Username | Enter a username. |
    | Password | Enter a password. |
    | Confirm password | Reenter password. |
    | Public inbound ports | Select **Allow selected ports**. |
    | Select inbound ports | Select **RDP (3389)**. |

    > [!WARNING]
    > Port 3389 is selected to enable remote access to the Windows Server virtual machine from the internet. Opening port 3389 to the internet is not recommended to manage production workloads.</br> For secure access to Azure virtual machines, see **[What is Azure Bastion?](../../bastion/bastion-overview.md)**.

5. Select the **Networking** tab, or select **Next: Disks**, then **Next: Networking**.
  
6. In the **Networking** tab, enter or select the following:

    | Setting | Value |
    |-|-|
    | **Network interface** |  |
    | Virtual network | Accept the default network name. |
    | Subnet | Accept the default subnet configuration. |
    | Public IP | Select **Create new**.</br> In **Create public IP address**, enter *myPublicIP* in **Name**.</br> **SKU**: select **Standard**.</br> **Assignment**: select **Static**.</br> Select **OK**. |
    | NIC network security group | Select **Basic** |
    | Public inbound ports | Select **Allow selected ports**. |
    | Select inbound ports | Select **RDP (3389)** |
    
    > [!NOTE]
    > The SKU of the virtual machine's public IP address must match the public IP SKU of Azure public load balancer when added to the backend pool of the load balancer. For details, see [Azure Load Balancer](../../load-balancer/skus.md).
   
7. Select **Review + create**. 
  
8. Review the settings, and then select **Create**.

> [!WARNING]
> Do not modify the IP address settings within the virtual machine's operating system. The operating system is unaware of Azure public IP addresses. Though you can add private IP address settings to the operating system, we recommend not doing so unless necessary. For more information, see [Add a private IP address to an operating system](./virtual-network-network-interface-addresses.md#private).

[!INCLUDE [ephemeral-ip-note.md](~/reusable-content/ce-skilling/azure/includes/ephemeral-ip-note.md)]

# [Azure PowerShell](#tab/azurepowershell)

### Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) named **myResourceGroup** in the **eastus2** location.

```azurepowershell-interactive
$rg =@{
    Name = 'myResourceGroup'
    Location = 'eastus2'
}
New-AzResourceGroup @rg

```

### Create a public IP address

Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to create a standard public IPv4 address.

The following command creates a zone-redundant public IP address named **myPublicIP** in **myResourceGroup**.

```azurepowershell-interactive
## Create IP. ##
$ip = @{
    Name = 'myPublicIP'
    ResourceGroupName = 'myResourceGroup'
    Location = 'eastus2'
    Sku = 'Standard'
    AllocationMethod = 'Static'
    IpAddressVersion = 'IPv4'
    Zone = 1,2,3   
}
New-AzPublicIpAddress @ip
```
### Create a virtual machine

Create a virtual machine with [New-AzVM](/powershell/module/az.Compute/new-azvm). 

The following command creates a Windows Server virtual machine. You enter the name of the public IP address created previously in the **`-PublicIPAddressName`** parameter. When prompted, provide a username and password to be used as the credentials for the virtual machine:

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

For more information on public IP SKUs, see [Public IP address SKUs](public-ip-addresses.md#sku). A virtual machine can be added to the backend pool of an Azure Load Balancer. The SKU of the public IP address must match the SKU of a load balancer's public IP. For more information, see [Azure Load Balancer](../../load-balancer/skus.md).

View the public IP address assigned and confirm that it was created as a static address, with [Get-AzPublicIpAddress](/powershell/module/az.network/get-azpublicipaddress):

```azurepowershell-interactive
## Retrieve public IP address settings. ##
$ip = @{
    Name = 'myPublicIP'
    ResourceGroupName = 'myResourceGroup'
}
Get-AzPublicIpAddress @ip | Select "IpAddress","PublicIpAllocationMethod" | Format-Table

```

> [!WARNING]
> Do not modify the IP address settings within the virtual machine's operating system. The operating system is unaware of Azure public IP addresses. Though you can add private IP address settings to the operating system, we recommend not doing so unless necessary, and not until after reading [Add a private IP address to an operating system](virtual-network-network-interface-addresses.md#private).

[!INCLUDE [ephemeral-ip-note.md](~/reusable-content/ce-skilling/azure/includes/ephemeral-ip-note.md)]


# [Azure CLI](#tab/azurecli)

### Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with [az group create](/cli/azure/group#az-group-create) named **myResourceGroup** in the **eastus2** location.

```azurecli-interactive
  az group create \
    --name myResourceGroup \
    --location eastus2
```

### Create a public IP address

Use [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create) to create a standard public IPv4 address.

The following command creates a zone-redundant public IP address named **myPublicIP** in **myResourceGroup**.

```azurecli-interactive
az network public-ip create \
    --resource-group myResourceGroup \
    --name myPublicIP \
    --version IPv4 \
    --sku Standard \
    --zone 1 2 3
```
### Create a virtual machine

Create a virtual machine with [az vm create](/cli/azure/vm#az-vm-create). 

The following command creates a Windows Server virtual machine. You enter the name of the public IP address created previously in the **`-PublicIPAddressName`** parameter. When prompted, provide a username and password to be used as the credentials for the virtual machine:

```azurecli-interactive
  az vm create \
    --name myVM \
    --resource-group TutorVMRoutePref-rg \
    --public-ip-address myPublicIP \
    --size Standard_A2 \
    --image MicrosoftWindowsServer:WindowsServer:2019-Datacenter:latest \
    --admin-username azureuser
```

For more information on public IP SKUs, see [Public IP address SKUs](public-ip-addresses.md#sku). A virtual machine can be added to the backend pool of an Azure Load Balancer. The SKU of the public IP address must match the SKU of a load balancer's public IP. For more information, see [Azure Load Balancer](../../load-balancer/skus.md).

View the public IP address assigned and confirm that it was created as a static address, with [az network public-ip show](/cli/azure/network/public-ip#az-network-public-ip-show):

```azurecli-interactive
  az network public-ip show \
    --resource-group myResourceGroup \
    --name myPublicIP \
    --query [ipAddress,publicIpAllocationMethod,sku] \
    --output table
```

> [!WARNING]
> Do not modify the IP address settings within the virtual machine's operating system. The operating system is unaware of Azure public IP addresses. Though you can add private IP address settings to the operating system, we recommend not doing so unless necessary, and not until after reading [Add a private IP address to an operating system](virtual-network-network-interface-addresses.md#private).

[!INCLUDE [ephemeral-ip-note.md](~/reusable-content/ce-skilling/azure/includes/ephemeral-ip-note.md)]

---


## Clean up resources

When resources are no longer needed, delete all resources created in this article to avoid incurring charges.

# [Azure portal](#tab/azureportal)

Use the Azure portal to delete the resource group and all of the resources it contains:

1. Enter *myResourceGroup* in the search box at the top of the portal. When you see **myResourceGroup** in the search results, select it.

2. Select **Delete resource group**.

3. Enter *myResourceGroup* for **TYPE THE RESOURCE GROUP NAME:** and select **Delete**.

# [Azure PowerShell](#tab/azurepowershell)

Use [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) to remove the resource group and all of the resources it contains:

```azurepowershell-interactive
Remove-AzResourceGroup -Name myResourceGroup -Force
```

# [Azure CLI](#tab/azurecli)

Use [az group delete](/cli/azure/group#az-group-delete) to remove the resource group and all of the resources it contains:

```azurecli-interactive
  az group delete --name myResourceGroup --yes
```
---

## Next steps

In this article, you learned how to create a VM with a static public IP.

- Learn how to [Configure IP addresses for an Azure network interface](./virtual-network-network-interface-addresses.md).

- Learn how to [Assign multiple IP addresses to virtual machines](./virtual-network-multiple-ip-addresses-portal.md) using the Azure portal.

- Learn more about [public IP addresses](./public-ip-addresses.md#public-ip-addresses) in Azure.
