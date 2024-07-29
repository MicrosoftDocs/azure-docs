---
title: Create an Azure virtual machine with a dual-stack network
titleSuffix: Azure Virtual Network
description: In this article, learn how to create a virtual machine with a dual-stack virtual network in Azure using the Azure portal, Azure CLI, or PowerShell.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: how-to
ms.date: 07/24/2024
ms.custom: template-how-to
---

# Create an Azure Virtual Machine with a dual-stack network

In this article, you create a virtual machine in Azure with the Azure portal. The virtual machine is created along with the dual-stack network as part of the procedures. You choose from the Azure portal, Azure CLI, or Azure PowerShell to complete the steps in this article. When completed, the virtual machine supports IPv4 and IPv6 communication.

## Prerequisites

# [Azure portal](#tab/azureportal)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

# [Azure CLI](#tab/azurecli/)

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- This tutorial requires version 2.0.28 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

# [Azure PowerShell](#tab/azurepowershell/)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure PowerShell installed locally or Azure Cloud Shell.
- Sign in to Azure PowerShell and select the subscription you want to use. For more information, see [Sign in with Azure PowerShell](/powershell/azure/authenticate-azureps).
- Ensure your Az. Network module is 4.3.0 or later. To verify the installed module, use the command Get-InstalledModule -Name "Az.Network". If the module requires an update, use the command Update-Module -Name "Az. Network".

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

---

## Create a resource group and virtual network

# [Azure portal](#tab/azureportal)

In this section, you create a resource group and dual-stack virtual network for the virtual machine in the Azure portal.

1. Sign-in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

1. Select **+ Create**.

1. In the **Basics** tab of **Create virtual network**, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new**. </br> In **Name**, enter **myResourceGroup**. </br> Select **OK**. |
    | **Instance details** |   |
    | Name | Enter **myVNet**. |
    | Region | Select **East US 2**. |

1. Select the **IP Addresses** tab, or **Next**>**Next**.

1. Leave the default IPv4 address space of **10.0.0.0/16**. If the default is absent or different, enter an IPv4 address space of **10.0.0.0/16**.

1. Select the **default** subnet.

1. On the **Edit subnet** page, enter **myBackendSubnet** in **Subnet name** and select **Save**.

1. Select **Add IPv6 address space** from the dropdown menu.

1. In **IPv6 address space**, edit the default address space and change its value to **2404:f800:8000:122::/63**.

1. To add an IPv6 subnet, select **+ Add a subnet** and enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Subnet** |   |
    | Subnet name | Enter **myBackendSubnet**. |
    | Address range | Leave default of **2404:f800:8000:122::**. |
    | Size | Leave the default of **/64**. |

1. Select **Add**.

1. Select the **Review + create**.

1. Select **Create**.

# [Azure CLI](#tab/azurecli/)

In this section, you create a resource group dual-stack virtual network for the virtual machine with Azure CLI.

Create a resource group with [az group create](/cli/azure/group#az-group-create) named **myResourceGroup** in the **eastus2** location.

```azurecli-interactive
  az group create \
    --name myResourceGroup \
    --location eastus2
```

Use [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create) to create a virtual network.

```azurecli-interactive
  az network vnet create \
    --resource-group myResourceGroup \
    --location eastus2 \
    --name myVNet \
    --address-prefixes 10.0.0.0/16 2404:f800:8000:122::/63 \
    --subnet-name myBackendSubnet \
    --subnet-prefixes 10.0.0.0/24 2404:f800:8000:122::/64
```

# [Azure PowerShell](#tab/azurepowershell/)


In this section, you create a dual-stack virtual network for the virtual machine with Azure PowerShell.

Create a resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) named **myResourceGroup** in the **eastus2** location.

```azurepowershell-interactive
$rg =@{
    Name = 'myResourceGroup'
    Location = 'eastus2'
}
New-AzResourceGroup @rg
```

Use [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork) and [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig) to create a virtual network.

```azurepowershell-interactive
## Create backend subnet config ##
$subnet = @{
    Name = 'myBackendSubnet'
    AddressPrefix = '10.0.0.0/24','2404:f800:8000:122::/64'
}
$subnetConfig = New-AzVirtualNetworkSubnetConfig @subnet 

## Create the virtual network ##
$net = @{
    Name = 'myVNet'
    ResourceGroupName = 'myResourceGroup'
    Location = 'eastus2'
    AddressPrefix = '10.0.0.0/16','2404:f800:8000:122::/63'
    Subnet = $subnetConfig
}
New-AzVirtualNetwork @net

```
---

## Create public IP addresses

# [Azure portal](#tab/azureportal)

You create two public IP addresses in this section, IPv4 and IPv6 in the Azure portal.

### Create IPv4 public IP address

1. In the search box at the top of the portal, enter **Public IP address**. Select **Public IP addresses** in the search results.

2. Select **+ Create**.

3. Enter or select the following information in **Create public IP address**.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **myResourceGroup**. |
    | Location | Select **East US 2**. |
    | Availability zone | Select **Zone redundant**. |
    | **Instance details** |   |
    | Name | Enter **myPublicIP-IPv4**. |
    | IP version | Select **IPv4**. |
    | SKU | Leave the default of **Standard**. |
    | Tier | Leave the default of **Regional**. |
    | **IP address assignment** |   |
    | Routing preference | Leave the default of **Microsoft network**. |
    | Idle timeout (minutes) | Leave the default of **4**. |
    | DNS name label | Enter **myPublicIP-IPv4**. |

4. Select **Review + create** then **Create**.

### Create IPv6 public IP address
1. In the search box at the top of the portal, enter **Public IP address**. Select **Public IP addresses** in the search results.

2. Select **+ Create**.

3. Enter or select the following information in **Create public IP address**.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **myResourceGroup**. |
    | Location | Select **East US 2**. |
    | Availability zone | Select **Zone redundant**. |
    | **Instance details** |   |
    | Name | Enter **myPublicIP-IPv6**. |
    | IP version | Select **IPv6**. |
    | SKU | Leave the default of **Standard**. |
    | Tier | Leave the default of **Regional**. |
    | **IP address assignment** |   |
    | DNS name label | Enter **myPublicIP-IPv6**. |

4. Select **Review + create** then **Create**.

# [Azure CLI](#tab/azurecli/)

You create two public IP addresses in this section, IPv4 and IPv6 with Azure CLI.

Use [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create) to create the public IP addresses.

```azurecli-interactive
  az network public-ip create \
    --resource-group myResourceGroup \
    --name myPublicIP-Ipv4 \
    --sku Standard \
    --version IPv4 \
    --zone 1 2 3

  az network public-ip create \
    --resource-group myResourceGroup \
    --name myPublicIP-Ipv6 \
    --sku Standard \
    --version IPv6 \
    --zone 1 2 3

```
# [Azure PowerShell](#tab/azurepowershell/)

You create two public IP addresses in this section, IPv4 and IPv6.

Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to create the public IP addresses.

```azurepowershell-interactive
$ip4 = @{
    Name = 'myPublicIP-IPv4'
    ResourceGroupName = 'myResourceGroup'
    Location = 'eastus2'
    Sku = 'Standard'
    AllocationMethod = 'Static'
    IpAddressVersion = 'IPv4'
    Zone = 1,2,3
}
New-AzPublicIpAddress @ip4

$ip6 = @{
    Name = 'myPublicIP-IPv6'
    ResourceGroupName = 'myResourceGroup'
    Location = 'eastus2'
    Sku = 'Standard'
    AllocationMethod = 'Static'
    IpAddressVersion = 'IPv6'
    Zone = 1,2,3
}
New-AzPublicIpAddress @ip6
```
---
## Create virtual machine

In this section, you create the virtual machine and its supporting resources.

# [Azure portal](#tab/azureportal)

### Create virtual machine

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

2. Select **+ Create** then **Azure virtual machine**.

3. In the **Basics** tab, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **myResourceGroup**. |
    | **Instance details** |   |
    | Virtual machine name | Enter **myVM**. |
    | Region | Select **East US 2**. |
    | Availability options | Select **No infrastructure redundancy required**. |
    | Security type | Select **Standard**. |
    | Image | Select **Ubuntu Server 20.04 LTS - Gen2**. |
    | Size | Select the default size. |
    | **Administrator account** |   |
    | Authentication type | Select **SSH public key**. |
    | Username | Enter a username. |
    | SSH public key source | Select **Generate new key pair**. |
    | Key pair name | Enter **mySSHKey**. |
    | **Inbound port rules** |   |
    | Public inbound ports | Select **None**. |

4. Select the **Networking** tab, or **Next: Disks** then **Next: Networking**.

5. Enter or select the following information in the **Networking** tab.

    | Setting | Value |
    | ------- | ----- |
    | **Network interface** |  |
    | Virtual network | Select **myVNet**. |
    | Subnet | Select **myBackendSubnet (10.1.0.0/24,2404:f800:8000:122:/64)**. |
    | Public IP | Select **myPublicIP-IPv4**. |
    | NIC network security group | Select **Advanced**. |
    | Configure network security group | Select **Create new**. </br> Enter **myNSG** in Name. </br> Select **OK**. |

6. Select **Review + create**.

7. Select **Create**.

8. **Generate new key pair** appears. Select **Download private key and create resource**.

9. The private key downloads to your local computer. Copy the private key to a directory on your computer. In the following example, it's **~/.ssh**.

10. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

11. Select **myVM**.

12. Stop **myVM**.

### Configure network interface

A network interface is automatically created and attached to the chosen virtual network during creation. In this section, you add the IPv6 configuration to the existing network interface.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

2. Select **myVM**.

3. Select **Stop**, to stop the virtual machine. Wait for the machine to shut down.

4. Select **Networking** in **Settings**.

5. The name of your default network interface will be **myvmxx**, with xx a random number. In this example, it's **myvm281**. Select **myvm281** next to **Network Interface:**.

6. In the properties of the network interface, select **IP configurations** in **Settings**.

7. In **IP configurations**, select **+ Add**.

8. In **Add IP configuration**, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **Ipv6config**. |
    | IP version | Select **IPv6**. |
    | **Private IP address settings** |  |
    | Allocation | Leave the default of **Dynamic**. |
    | Public IP address | Select **Associate**. |
    | Public IP address | Select **myPublicIP-IPv6**. |

9. Select **OK**.

10. Return to the **Overview** of **myVM** and start the virtual machine.

# [Azure CLI](#tab/azurecli/)

In this section, you create the virtual machine and its supporting resources.

### Create network interface

You use [az network nic create](/cli/azure/network/nic#az-network-nic-create) to create the network interface for the virtual machine. The public IP addresses and the NSG created previously are associated with the NIC. The network interface is attached to the virtual network you created previously.

```azurecli-interactive
  az network nic create \
    --resource-group myResourceGroup \
    --name myNIC1 \
    --vnet-name myVNet \
    --subnet myBackEndSubnet \
    --network-security-group myNSG \
    --public-ip-address myPublicIP-IPv4
```

### Create IPv6 IP configuration

Use [az network nic ip-config create](/cli/azure/network/nic/ip-config#az-network-nic-ip-config-create) to create the IPv6 configuration for the NIC.

```azurecli-interactive
  az network nic ip-config create \
    --resource-group myResourceGroup \
    --name myIPv6config \
    --nic-name myNIC1 \
    --private-ip-address-version IPv6 \
    --vnet-name myVNet \
    --subnet myBackendSubnet \
    --public-ip-address myPublicIP-IPv6
```

### Create virtual machine

Use [az vm create](/cli/azure/vm#az-vm-create) to create the virtual machine.

```azurecli-interactive
  az vm create \
    --resource-group myResourceGroup \
    --name myVM \
    --nics myNIC1 \
    --image Ubuntu2204 \
    --admin-username azureuser \
    --authentication-type ssh \
    --generate-ssh-keys
```

# [Azure PowerShell](#tab/azurepowershell/)

In this section, you create the virtual machine and its supporting resources.

### Create network interface

You use [New-AzNetworkInterface](/powershell/module/az.network/new-aznetworkinterface) and [New-AzNetworkInterfaceIpConfig](/powershell/module/az.network/new-aznetworkinterfaceipconfig) to create the network interface for the virtual machine. The public IP addresses and the NSG created previously are associated with the NIC. The network interface is attached to the virtual network you created previously.

```azurepowershell-interactive
## Place the virtual network into a variable. ##
$net = @{
    Name = 'myVNet'
    ResourceGroupName = 'myResourceGroup'
}
$vnet = Get-AzVirtualNetwork @net

## Place the network security group into a variable. ##
$ns = @{
    Name = 'myNSG'
    ResourceGroupName = 'myResourceGroup'
}
$nsg = Get-AzNetworkSecurityGroup @ns

## Place the IPv4 public IP address into a variable. ##
$pub4 = @{
    Name = 'myPublicIP-IPv4'
    ResourceGroupName = 'myResourceGroup'
}
$pubIPv4 = Get-AzPublicIPAddress @pub4

## Place the IPv6 public IP address into a variable. ##
$pub6 = @{
    Name = 'myPublicIP-IPv6'
    ResourceGroupName = 'myResourceGroup'
}
$pubIPv6 = Get-AzPublicIPAddress @pub6

## Create IPv4 configuration for NIC. ##
$IP4c = @{
    Name = 'ipconfig-ipv4'
    Subnet = $vnet.Subnets[0]
    PrivateIpAddressVersion = 'IPv4'
    PublicIPAddress = $pubIPv4
}
$IPv4Config = New-AzNetworkInterfaceIpConfig @IP4c

## Create IPv6 configuration for NIC. ##
$IP6c = @{
    Name = 'ipconfig-ipv6'
    Subnet = $vnet.Subnets[0]
    PrivateIpAddressVersion = 'IPv6'
    PublicIPAddress = $pubIPv6
}
$IPv6Config = New-AzNetworkInterfaceIpConfig @IP6c

## Command to create network interface for VM ##
$nic = @{
    Name = 'myNIC1'
    ResourceGroupName = 'myResourceGroup'
    Location = 'eastus2'
    NetworkSecurityGroup = $nsg
    IpConfiguration = $IPv4Config,$IPv6Config   
}
New-AzNetworkInterface @nic
```

### Create virtual machine

Use the following commands to create the virtual machine:
    
* [New-AzVM](/powershell/module/az.compute/new-azvm)
    
* [New-AzVMConfig](/powershell/module/az.compute/new-azvmconfig)
    
* [Set-AzVMOperatingSystem](/powershell/module/az.compute/set-azvmoperatingsystem)
    
* [Set-AzVMSourceImage](/powershell/module/az.compute/set-azvmsourceimage)
    
* [Add-AzVMNetworkInterface](/powershell/module/az.compute/add-azvmnetworkinterface)

```azurepowershell-interactive
$cred = Get-Credential

## Place network interface into a variable. ##
$nic = @{
    Name = 'myNIC1'
    ResourceGroupName = 'myResourceGroup'
}
$nicVM = Get-AzNetworkInterface @nic

## Create a virtual machine configuration for VMs ##
$vmsz = @{
    VMName = 'myVM'
    VMSize = 'Standard_DS1_v2'  
}
$vmos = @{
    ComputerName = 'myVM'
    Credential = $cred
}
$vmimage = @{
    PublisherName = 'Debian'
    Offer = 'debian-11'
    Skus = '11'
    Version = 'latest'    
}
$vmConfig = New-AzVMConfig @vmsz `
      | Set-AzVMOperatingSystem @vmos -Linux `
      | Set-AzVMSourceImage @vmimage `
      | Add-AzVMNetworkInterface -Id $nicVM.Id

## Create the virtual machine for VMs ##
$vm = @{
    ResourceGroupName = 'myResourceGroup'
    Location = 'eastus2'
    VM = $vmConfig
    SshKeyName = 'mySSHKey'
    }
New-AzVM @vm -GenerateSshKey
```

---

## Test SSH connection

# [Azure portal](#tab/azureportal)

You connect to the virtual machine with SSH to test the IPv4 public IP address.

1. In the search box at the top of the portal, enter **Public IP address**. Select **Public IP addresses** in the search results.

2. Select **myPublicIP-IPv4**.

3. The public IPv4 address is in the **Overview** in **IP address**. In this example it's, **20.22.46.19**.

4. Open an SSH connection to the virtual machine by using the following command. Replace the IP address with the IP address of your virtual machine. Replace **`azureuser`** with the username you chose during virtual machine creation. The **`-i`** is the path to the private key that you downloaded earlier. In this example, it's **~/.ssh/mySSHKey.pem**.

    ```bash
    ssh -i ~/.ssh/mySSHkey.pem azureuser@20.22.46.19
    ```
# [Azure CLI](#tab/azurecli/)

Use [az network public-ip show](/cli/azure/network/public-ip#az-network-public-ip-show) to display the IP addresses of the virtual machine.

```azurecli-interactive
  az network public-ip show \
    --resource-group myResourceGroup \
    --name myPublicIP-IPv4 \
    --query ipAddress \
    --output tsv
```

```azurecli-interactive
user@Azure:~$ az network public-ip show \
>     --resource-group myResourceGroup \
>     --name myPublicIP-IPv4 \
>     --query ipAddress \
>     --output tsv
20.119.201.208
```

```azurecli-interactive
  az network public-ip show \
    --resource-group myResourceGroup \
    --name myPublicIP-IPv6 \
    --query ipAddress \
    --output tsv
```

```azurecli-interactive
user@Azure:~$ az network public-ip show \
>     --resource-group myResourceGroup \
>     --name myPublicIP-IPv6 \
>     --query ipAddress \
>     --output tsv
2603:1030:408:6::9d
```

Open an SSH connection to the virtual machine by using the following command. Replace the IP address with the IP address of your virtual machine.

```azurecli-interactive
  ssh azureuser@20.119.201.208
```

# [Azure PowerShell](#tab/azurepowershell/)

Use [Get-AzPublicIpAddress](/powershell/module/az.network/get-azpublicipaddress) to display the IP addresses of the virtual machine.

```azurepowershell-interactive
$ip4 = @{
    ResourceGroupName = 'myResourceGroup'
    Name = 'myPublicIP-IPv4'
}  
Get-AzPublicIPAddress @ip4 | select IpAddress
```

```azurepowershell-interactive
PS /home/user> Get-AzPublicIPAddress @ip4 | select IpAddress

IpAddress
---------
20.72.115.187
```

```azurepowershell-interactive
$ip6 = @{
    ResourceGroupName = 'myResourceGroup'
    Name = 'myPublicIP-IPv6'
}  
Get-AzPublicIPAddress @ip6 | select IpAddress
```

```azurepowershell-interactive
PS /home/user> Get-AzPublicIPAddress @ip6 | select IpAddress

IpAddress
---------
2603:1030:403:3::1ca
```

Open an SSH connection to the virtual machine by using the following command. Replace the IP address with the IP address of your virtual machine.

```azurepowershell-interactive
ssh azureuser@20.72.115.187
```

---

## Clean up resources

# [Azure portal](#tab/azureportal)

When your finished with the resources created in this article, delete the resource group and all of the resources it contains:

1. In the search box at the top of the portal, enter **myResourceGroup**. Select **myResourceGroup** in the search results in **Resource groups**.

2. Select **Delete resource group**.

3. Enter **myResourceGroup** for **TYPE THE RESOURCE GROUP NAME** and select **Delete**.


# [Azure CLI](#tab/azurecli/)

When no longer needed, use the [az group delete](/cli/azure/group#az-group-delete) command to remove the resource group, virtual machine, and all related resources.

```azurecli-interactive
  az group delete \
    --name myResourceGroup
```
# [Azure PowerShell](#tab/azurepowershell/)

When no longer needed, use the [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) command to remove the resource group, virtual machine, and all related resources.

```azurepowershell-interactive
Remove-AzResourceGroup -Name 'myResourceGroup'
```
---

## Next steps

In this article, you learned how to create an Azure Virtual machine with a dual-stack network.

For more information about IPv6 and IP addresses in Azure, see:

- [Overview of IPv6 for Azure Virtual Network.](ipv6-overview.md)

- [What is Azure Virtual Network IP Services?](ip-services-overview.md)
