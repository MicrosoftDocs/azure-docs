---
title: 'Tutorial: Use a NAT gateway with a hub and spoke network'
titleSuffix: Azure NAT Gateway
description: Learn how to integrate a NAT gateway into a hub and spoke network with a network virtual appliance. 
author: asudbring
ms.author: allensu
ms.service: azure-nat-gateway
ms.topic: tutorial 
ms.date: 03/06/2025
ms.custom: template-tutorial 
# Customer intent: "As a network engineer, I want to implement a NAT gateway in a hub and spoke network, so that I can securely route and inspect outbound internet traffic while ensuring efficient inter-spoke communication."
---

# Tutorial: Use a NAT gateway with a hub and spoke network

A hub and spoke network is one of the building blocks of a highly available multiple location network infrastructure. The most common deployment of a hub and spoke network is done with the intention of routing all inter-spoke and outbound internet traffic through the central hub. The purpose is to inspect all of the traffic traversing the network with a Network Virtual Appliance (NVA) for security scanning and packet inspection.

For outbound traffic to the internet, the network virtual appliance would typically have one network interface with an assigned public IP address. The NVA after inspecting the outbound traffic forwards the traffic out the public interface and to the internet. Azure NAT Gateway eliminates the need for the public IP address assigned to the NVA. Associating a NAT gateway with the public subnet of the NVA changes the routing for the public interface to route all outbound internet traffic through the NAT gateway. The elimination of the public IP address increases security and allows for the scaling of outbound source network address translation (SNAT) with multiple public IP addresses and or public IP prefixes.

> [!IMPORTANT]
> The NVA used in this article is for demonstration purposes only and is simulated with an Ubuntu virtual machine. The solution doesn't include a load balancer for high availability of the NVA deployment. Replace the Ubuntu virtual machine in this article with an NVA of your choice. Consult the vendor of the chosen NVA for routing and configuration instructions. A load balancer and availability zones are recommended for a highly available NVA infrastructure.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a NAT gateway.
> * Create a hub and spoke virtual network.
> * Create a simulated Network Virtual Appliance (NVA).
> * Force all traffic from the spokes through the hub.
> * Force all internet traffic in the hub and the spokes out the NAT gateway.
> * Test the NAT gateway and inter-spoke routing.

## Prerequisites

# [**Portal**](#tab/portal)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

# [**Powershell**](#tab/powershell)

- An Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

[!INCLUDE [cloud-shell-try-it.md](~/reusable-content/ce-skilling/azure/includes/cloud-shell-try-it.md)]

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 1.0.0 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

# [**CLI**](#tab/cli)

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- This article requires version 2.0.28 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

---

## Create a NAT gateway

All outbound internet traffic traverses the NAT gateway to the internet. Use the following example to create a NAT gateway for the hub and spoke network.

# [**Portal**](#tab/portal)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter **NAT gateway**. Select **NAT gateways** in the search results.

1. Select **+ Create**.

1. In the **Basics** tab of **Create network address translation (NAT) gateway** enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new**. </br> Enter **test-rg** in **Name**. </br> Select **OK**. |
    | **Instance details** |  |
    | NAT gateway name | Enter **nat-gateway**. |
    | Region | Select **East US 2**. |
    | Availability zone | Select a **Zone** or **No zone**. |
    | TCP idle timeout (minutes) | Leave the default of **4**. |

1. Select **Next: Outbound IP**.

1. In **Outbound IP** in **Public IP addresses**, select **Create a new public IP address**.

1. Enter **public-ip-nat** in **Name**.

1. Select **OK**.

1. Select **Review + create**. 

1. Select **Create**.

# [**Powershell**](#tab/powershell)

Use [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) to create a resource group.

```powershell
$rgParams = @{
    Name = "test-rg"
    Location = "eastus2"
}
New-AzResourceGroup @rgParams
```

Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to create a public IP address for the NAT gateway.

```powershell
$publicIpParams = @{
    ResourceGroupName = "test-rg"
    Name = "public-ip-nat"
    Sku = "Standard"
    AllocationMethod = "Static"
    Location = "eastus2"
    Zone = 1,2,3
}
$publicIp = New-AzPublicIpAddress @publicIpParams
```

Use [New-AzNatGateway](/powershell/module/az.network/new-aznatgateway) to create the NAT gateway.

```powershell
$natGatewayParams = @{
    ResourceGroupName = "test-rg"
    Name = "nat-gateway"
    PublicIpAddress = $publicIp
    Sku = 'Standard'
    IdleTimeoutInMinutes = 4
    Location = "eastus2"
}
New-AzNatGateway @natGatewayParams
```

# [**CLI**](#tab/cli)

Use [az group create](/cli/azure/group#az_group_create) to create a resource group.

```azurecli
az group create \
    --name test-rg \
    --location eastus2
```

Use [az network public-ip create](/cli/azure/network/public-ip#az_network_public_ip_create) to create a public IP address for the NAT gateway. 

```azurecli
az network public-ip create \
    --resource-group test-rg \
    --name public-ip-nat \
    --sku Standard \
    --allocation-method Static \
    --zone 1 2 3
```

Use [az network nat gateway create](/cli/azure/network/nat/gateway#az_network_nat_gateway_create) to create the NAT gateway.

```azurecli
az network nat gateway create \
    --resource-group test-rg \
    --name nat-gateway \
    --public-ip-addresses public-ip-nat \
    --idle-timeout 4 \
    --location eastus2
```

---

## Create hub virtual network

The hub virtual network is the central network of the solution. The hub network contains the NVA appliance and a public and private subnet. The NAT gateway is assigned to the public subnet during the creation of the virtual network. An Azure Bastion host is configured as part of the following example. The bastion host is used to securely connect to the NVA virtual machine and the test virtual machines deployed in the spokes later in the article.

# [**Portal**](#tab/portal)

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

1. Select **+ Create**.

1. In the **Basics** tab of **Create virtual network**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |   |
    | Name | Enter **vnet-hub**. |
    | Region | Select **East US 2**. |

1. Select **Next** to proceed to the **Security** tab.

1. Select **Enable Azure Bastion** in the **Azure Bastion** section of the **Security** tab.

    Azure Bastion uses your browser to connect to VMs in your virtual network over secure shell (SSH) or remote desktop protocol (RDP) by using their private IP addresses. The VMs don't need public IP addresses, client software, or special configuration. For more information about Azure Bastion, see [Azure Bastion](/azure/bastion/bastion-overview)

    >[!NOTE]
    >[!INCLUDE [Pricing](~/reusable-content/ce-skilling/azure/includes/bastion-pricing.md)]

1. Enter or select the following information in **Azure Bastion**:

    | Setting | Value |
    |---|---|
    | Azure Bastion host name | Enter **bastion**. |
    | Azure Bastion public IP address | Select **Create a public IP address**. </br> Enter **public-ip-bastion** in Name. </br> Select **OK**. |

1. Select **Next** to proceed to the **IP Addresses** tab.

1. In the address space box in **Subnets**, select the **default** subnet.

1. In **Edit subnet**, enter or select the following information:

    | Setting | Value |
    |---|---|
    | Subnet purpose | Leave the default **Default**. |
    | Name | Enter **subnet-private**. |
    | **IPv4** |   |
    | IPv4 address range | Leave the default of **10.0.0.0/16**. |
    | Starting address | Leave the default of **10.0.0.0**. |
    | Size | Leave the default of **/24(256 addresses)**. |

1. Select **Save**.

1. Select **+ Add a subnet**.

1. In **Add subnet**, enter or select the following information:

    | Setting | Value |
    |---|---|
    | Subnet purpose | Leave the default **Default**. |
    | Name | Enter **subnet-public**. |
    | **IPv4** |   |
    | IPv4 address range | Leave the default of **10.0.0.0/16**. |
    | Starting address | Enter **10.0.253.0**. |
    | Size | Select **/28(16 addresses)**. |
    | **Security** |   |
    | NAT gateway | Select **nat-gateway**. |

1. Select **Add**.

1. Select **Review + create**.

1. Select **Create**.

It takes a few minutes for the bastion host to deploy. When the virtual network is created as part of the deployment, you can proceed to the next steps.

# [**Powershell**](#tab/powershell)

Use [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/add-azvirtualnetworksubnetconfig) to create the subnets.

```powershell
$subnetPrivateParams = @{
    Name = "subnet-private"
    AddressPrefix = "10.0.0.0/24"
}
$privateSubnetConfig = New-AzVirtualNetworkSubnetConfig @subnetPrivateParams

$subnetBastionParams = @{
    Name = "AzureBastionSubnet"
    AddressPrefix = "10.0.1.0/26"
}
$bastionSubnetConfig = New-AzVirtualNetworkSubnetConfig @subnetBastionParams

$subnetPublicParams = @{
    Name = "subnet-public"
    AddressPrefix = "10.0.253.0/28"
    NatGateway = (Get-AzNatGateway -ResourceGroupName "test-rg" -Name "nat-gateway")
}
$publicSubnetConfig = New-AzVirtualNetworkSubnetConfig @subnetPublicParams
```

Use [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork) to create the virtual network.

```powershell
$vNetParams = @{
    ResourceGroupName = "test-rg"
    Name = "vnet-hub"
    AddressPrefix = "10.0.0.0/16"
    Location = "eastus2"
    Subnet = $privateSubnetConfig, $bastionSubnetConfig, $publicSubnetConfig
}
$vNet = New-AzVirtualNetwork @vNetParams
```

Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to create a public IP address for the Azure Bastion host.

```powershell
$publicIpParams = @{
    ResourceGroupName = "test-rg"
    Name = "public-ip-bastion"
    Sku = "Standard"
    AllocationMethod = "Static"
    Location = "eastus2"
    Zone = 1,2,3
}
New-AzPublicIpAddress @publicIpParams
```

Use [New-AzBastion](/powershell/module/az.network/new-azbastion) to create the Azure Bastion host.

```powershell
$bastionParams = @{
    ResourceGroupName = "test-rg"
    Name = "bastion"
    VirtualNetworkName = "vnet-hub"
    PublicIpAddressName = "public-ip-bastion"
    PublicIPAddressRgName = "test-rg"
    VirtualNetworkRgName = "test-rg"
}
New-AzBastion @bastionParams
```

# [**CLI**](#tab/cli)

Use [az network vnet create](/cli/azure/network/vnet#az_network_vnet_create) to create the virtual network.

```azurecli
az network vnet create \
    --resource-group test-rg \
    --name vnet-hub \
    --address-prefix 10.0.0.0/16 \
    --location eastus2
```

Use [az network vnet subnet create](/cli/azure/network/vnet/subnet#az_network_vnet_subnet_create) to create the subnets.

```azurecli
az network vnet subnet create \
    --resource-group test-rg \
    --vnet-name vnet-hub \
    --name subnet-private \
    --address-prefix 10.0.0.0/24

az network vnet subnet create \
    --resource-group test-rg \
    --vnet-name vnet-hub \
    --name AzureBastionSubnet \
    --address-prefix 10.0.1.0/26

az network vnet subnet create \
    --resource-group test-rg \
    --vnet-name vnet-hub \
    --name subnet-public \
    --address-prefix 10.0.253.0/28 \
    --nat-gateway nat-gateway
```

Use [az network public-ip create](/cli/azure/network/public-ip#az_network_public_ip_create) to create a public IP address for the Azure Bastion host.

```azurecli
az network public-ip create \
    --resource-group test-rg \
    --name public-ip-bastion \
    --sku Standard \
    --allocation-method Static \
    --zone 1 2 3
```

Use [az network bastion create](/cli/azure/network/bastion#az_network_bastion_create) to create the Azure Bastion host.

```azurecli
az network bastion create \
    --resource-group test-rg \
    --name bastion \
    --vnet-name vnet-hub \
    --public-ip-address public-ip-bastion \
    --location eastus2
```

---

## Create simulated NVA virtual machine

The simulated NVA acts as a virtual appliance to route all traffic between the spokes and hub and traffic outbound to the internet. An Ubuntu virtual machine is used for the simulated NVA. Use the following example to create the simulated NVA and configure the network interfaces.

# [**Portal**](#tab/portal)

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **+ Create** then **Azure virtual machine**.

1. In **Create a virtual machine** enter or select the following information in the **Basics** tab:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |   |
    | Virtual machine name | Enter **vm-nva**. |
    | Region | Select **(US) East US 2**. |
    | Availability options | Select **No infrastructure redundancy required**. |
    | Security type | Select **Standard**. |
    | Image | Select **Ubuntu Server 24.04 LTS - x64 Gen2**. |
    | VM architecture | Leave the default of **x64**. |
    | Size | Select a size. |
    | **Administrator account** |   |
    | Authentication type | Select **SSH public key**. |
    | Username | Enter a username. |
    | SSH public key source | Select **Generate new key pair**. |
    | SSH Key Type | Leave the default of **RSA SSH Format**. |
    | Key pair name | Enter **ssh-key**. |
    | **Inbound port rules** |  |
    | Public inbound ports | Select **None**. |

1. Select **Next: Disks** then **Next: Networking**.

1. In the Networking tab, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Network interface** |   |
    | Virtual network | Select **vnet-hub**. |
    | Subnet | Select **subnet-public (10.0.253.0/28)**. |
    | Public IP | Select **None**. |
    | NIC network security group | Select **Advanced**. |
    | Configure network security group | Select **Create new**. </br> In **Name** enter **nsg-nva**. </br> Select **OK**. |

1. Leave the rest of the options at the defaults and select **Review + create**.

1. Select **Create**.

1. The **Generate new key pair** dialog box appears. Select **Download private key and create resource**.

The private key will download to your local machine. The private key is needed in later steps for connecting to the virtual machine with Azure Bastion. The name of the private key file is the name you entered in the **Key pair name** field. In this example, the private key file is named **ssh-key**.

# [**Powershell**](#tab/powershell)

Use [New-AzNetworkSecurityGroup](/powershell/module/az.network/new-aznetworksecuritygroup) to create the network security group.

```powershell
$nsgParams = @{
    ResourceGroupName = "test-rg"
    Name = "nsg-nva"
    Location = "eastus2"
}
New-AzNetworkSecurityGroup @nsgParams
```

Use [New-AzNetworkInterface](/powershell/module/az.network/new-aznetworkinterface) to create the network interface.

```powershell
$nicParams = @{
    ResourceGroupName = "test-rg"
    Name = "nic-public"
    SubnetId = (Get-AzVirtualNetwork -ResourceGroupName "test-rg" -Name "vnet-hub").Subnets[1].Id
    NetworkSecurityGroupId = (Get-AzNetworkSecurityGroup -ResourceGroupName "test-rg" -Name "nsg-nva").Id
    Location = "eastus2"
}
New-AzNetworkInterface @nicParams
```

Use [Get-Credential](/powershell/module/microsoft.powershell.security/get-credential) to set a user name and password for the VM and store them in the `$cred` variable.

```azurepowershell
$cred = Get-Credential
```

> [!NOTE]
> A username is required for the VM. The password is optional and won't be used if set. SSH key configuration is recommended for Linux VMs.

Use [New-AzVMConfig](/powershell/module/az.compute/new-azvmconfig) to define a VM.

```azurepowershell
$vmConfigParams = @{
    VMName = "vm-nva"
    VMSize = "Standard_DS4_v2"
    }
$vmConfig = New-AzVMConfig @vmConfigParams
```

Use [Set-AzVMOperatingSystem](/powershell/module/az.compute/set-azvmoperatingsystem) and [Set-AzVMSourceImage](/powershell/module/az.compute/set-azvmsourceimage) to create the rest of the VM configuration. The following example creates an Ubuntu Server virtual machine:

```azurepowershell
$osParams = @{
    VM = $vmConfig
    ComputerName = "vm-nva"
    Credential = $cred
    }
$vmConfig = Set-AzVMOperatingSystem @osParams -Linux -DisablePasswordAuthentication

$imageParams = @{
    VM = $vmConfig
    PublisherName = "Canonical"
    Offer = "ubuntu-24_04-lts"
    Skus = "server"
    Version = "latest"
    }
$vmConfig = Set-AzVMSourceImage @imageParams
```

Use [Add-AzVMNetworkInterface](/powershell/module/az.compute/add-azvmnetworkinterface) to attach the NIC that you previously created to the VM.

```azurepowershell
# Get the network interface object
$nicParams = @{
    ResourceGroupName = "test-rg"
    Name = "nic-public"
    }
$nic = Get-AzNetworkInterface @nicParams

$vmConfigParams = @{
    VM = $vmConfig
    Id = $nic.Id
    }
$vmConfig = Add-AzVMNetworkInterface @vmConfigParams
```

Use [New-AzVM](/powershell/module/az.compute/new-azvm) to create the VM. The command will generate SSH keys for the virtual machine for login. Make note of the location of the private key. The private key is needed in later steps for connecting to the virtual machine with Azure Bastion.

```azurepowershell
$vmParams = @{
    VM = $vmConfig
    ResourceGroupName = "test-rg"
    Location = "eastus2"
    SshKeyName = "ssh-key"
    }
New-AzVM @vmParams -GenerateSshKey
```

# [**CLI**](#tab/cli)

Use [az network nsg create](/cli/azure/network/nsg#az_network_nsg_create) to create the network security group.

```azurecli
az network nsg create \
    --resource-group test-rg \
    --name nsg-nva \
    --location eastus2
```

Use [az network nic create](/cli/azure/network/nic#az_network_nic_create) to create the network interface.

```azurecli
az network nic create \
    --resource-group test-rg \
    --name nic-public \
    --vnet-name vnet-hub \
    --subnet subnet-public \
    --network-security-group nsg-nva
```

Use [az vm create](/cli/azure/vm#az_vm_create) to create the virtual machine. The command will generate SSH keys for the virtual machine for login. Make note of the location of the private key. The private key is needed in later steps for connecting to the virtual machine with Azure Bastion.

```azurecli
az vm create \
   --resource-group test-rg \
   --name vm-nva \
   --image Ubuntu2204 \
   --size Standard_DS4_v2\
   --admin-username azureuser \
   --generate-ssh-keys \
   --nics nic-public
```

---

### Configure virtual machine network interfaces

The IP configuration of the primary network interface of the virtual machine is set to dynamic by default. Use the following example to change the primary network interface IP configuration to static and add a secondary network interface for the private interface of the NVA.

# [**Portal**](#tab/portal)

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **vm-nva**.

1. In the **Overview** select **Stop** if the virtual machine is running.

1. Expand **Networking** then select **Network settings**.

1. In **Network settings** select the network interface name next to **Network Interface:**. The interface name is the virtual machine name and random numbers and letters. In this example, the interface name is **vm-nva271**. 

1. In the network interface properties, select **IP configurations** in **Settings**.

1. Select the box next to **Enable IP forwarding**.

1. Select **Apply**.

1. When the apply action completes, select **ipconfig1**.

1. In **Private IP address settings** in **ipconfig1** select **Static**.

1. In **Private IP address** enter **10.0.253.10**.

1. Select **Save**.

1. When the save action completes, return to the networking configuration for **vm-nva**.

1. In **Network settings** of **vm-nva** select **Attach network interface**.

1. Select **Create and attach network interface**.

1. In **Create network interface** enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |  |
    | Resource group | Select **test-rg**. |
    | **Network interface** |  |
    | Name | Enter **nic-private**. |
    | Subnet | Select **subnet-private (10.0.0.0/24)**. |
    | NIC network security group | Select **Advanced**. |
    | Configure network security group | Select **nsg-nva**. |
    | Private IP address assignment | Select **Static**. |
    | Private IP address | Enter **10.0.0.10**. |

1. Select **Create**.

1. Start the virtual machine.
 
# [**Powershell**](#tab/powershell)

Use [Set-AzNetworkInterface](/powershell/module/az.network/set-aznetworkinterface) to enable IP forwarding on the primary network interface.

```powershell
$nicParams = @{
    ResourceGroupName = "test-rg"
    Name = "nic-public"
}
$nic = Get-AzNetworkInterface @nicParams
$nic.EnableIPForwarding = $true
Set-AzNetworkInterface -NetworkInterface $nic
```

Use [Set-AzNetworkInterfaceIpConfig](/powershell/module/az.network/set-aznetworkinterfaceipconfig) to statically set the private IP address of the virtual machine for the public interface.

```powershell
$nicParams = @{
    ResourceGroupName = "test-rg"
    Name = "nic-public"
}
$nic = Get-AzNetworkInterface @nicParams
$nic.IpConfigurations[0].PrivateIpAllocationMethod = "Static"
$nic.IpConfigurations[0].PrivateIpAddress = "10.0.253.10"
Set-AzNetworkInterface -NetworkInterface $nic
```

Use [Update-AzVM](/powershell/module/az.compute/update-azvm) to designate the **nic-public** interface as the primary interface.

```powershell
$vmParams = @{
    ResourceGroupName = "test-rg"
    Name = "vm-nva"
}
$vm = Get-AzVM @vmParams

$nicParams = @{
    ResourceGroupName = "test-rg"
    Name = "nic-public"
}
$nic = Get-AzNetworkInterface @nicParams

$vm.NetworkProfile.NetworkInterfaces | ForEach-Object {
    $_.Primary = $false
}
$vm.NetworkProfile.NetworkInterfaces | Where-Object { $_.Id -eq $nic.Id } | ForEach-Object {
    $_.Primary = $true
}

$updateParams = @{
    ResourceGroupName = "test-rg"
    VM = $vm
}
Update-AzVM @updateParams
```

Use [New-AzNetworkInterface](/powershell/module/az.network/new-aznetworkinterface) to create the secondary network interface.

```powershell
$nicParams = @{
    ResourceGroupName = "test-rg"
    Name = "nic-private"
    SubnetId = (Get-AzVirtualNetwork -ResourceGroupName "test-rg" -Name "vnet-hub").Subnets[0].Id
    PrivateIpAddress = "10.0.0.10"
    Location = "eastus2"
}
New-AzNetworkInterface @nicParams
```

Use [Stop-AzVM](/powershell/module/az.compute/stop-azvm) to shutdown and deallocate the virtual machine.

```powershell
$vmParams = @{
    ResourceGroupName = "test-rg"
    Name = "vm-nva"
    Force = $true
}
Stop-AzVM @vmParams
```

Use [Add-AzVMNetworkInterface](/powershell/module/az.compute/add-azvmnetworkinterface) to attach the secondary network interface to the virtual machine.

```powershell
$vmParams = @{
    ResourceGroupName = "test-rg"
    Name = "vm-nva"
}
$vm = Get-AzVM @vmParams

$nicParams = @{
    ResourceGroupName = "test-rg"
    Name = "nic-private"
}
$nic = Get-AzNetworkInterface @nicParams

$vm = Add-AzVMNetworkInterface -VM $vm -Id $nic.Id

$updateParams = @{
    ResourceGroupName = "test-rg"
    VM = $vm
}
Update-AzVM @updateParams
```

Use [Start-AzVM](/powershell/module/az.compute/start-azvm) to start the virtual machine.

```powershell
$startVmParams = @{
    ResourceGroupName = "test-rg"
    Name = "vm-nva"
}
Start-AzVM @startVmParams
```

# [**CLI**](#tab/cli)

Use [az network nic update](/cli/azure/network/nic#az_network_nic_update) to enable IP forwarding on the primary network interface.

```azurecli
az network nic update \
    --resource-group test-rg \
    --name nic-public \
    --ip-forwarding true
```

Use [az network nic ip-config update](/cli/azure/network/nic/ip-config#az_network_nic_ip_config_update) to statically set the private IP address of the virtual machine.

```azurecli
az network nic ip-config update \
    --resource-group test-rg \
    --nic-name nic-public \
    --name ipconfig1 \
    --private-ip-address 10.0.253.10 \
    --private-ip-address-version IPv4
```

Use [az network nic create](/cli/azure/network/nic#az_network_nic_create) to create the secondary network interface.

```azurecli
az network nic create \
    --resource-group test-rg \
    --name nic-private \
    --vnet-name vnet-hub \
    --subnet subnet-private \
    --private-ip-address 10.0.0.10
```

Use [az vm deallocate](/cli/azure/vm#az_vm_deallocate) to shutdown and deallocate the virtual machine.

```azurecli
az vm deallocate \
    --resource-group test-rg \
    --name vm-nva
```

Use [az vm nic add](/cli/azure/vm/nic#az_vm_nic_add) to attach the secondary network interface to the virtual machine.

```azurecli
az vm nic add \
    --resource-group test-rg \
    --vm-name vm-nva \
    --nics nic-private
```

Use [az vm start](/cli/azure/vm#az_vm_start) to start the virtual machine.

```azurecli
az vm start \
    --resource-group test-rg \
    --name vm-nva
```

---

### Configure virtual machine software

The routing for the simulated NVA uses IP tables and internal NAT in the Ubuntu virtual machine. Connect to the NVA virtual machine with Azure Bastion to configure IP tables and the routing configuration.

1. In the [Azure portal](https://portal.azure.com), search for and select *virtual machines*.

1. On the **Virtual machines** page, select **vm-nva**.

1. On the VM's **Overview** page, select **Connect** then **Connect via Bastion**.

1. In the Bastion connection screen, change **Authentication Type** to **SSH Private Key from Local File**.

1. Enter the **Username** that you used when creating the virtual machine. In this example, the user is named **azureuser**, replace with the username you created.

1. In **Local File**, select the folder icon and browse to the private key file that was generated when you created the VM. The private key file is typically named `id_rsa` or `id_rsa.pem` or `ssh-key.pem`.

1. Select **Connect**.

1. Enter the following information at the prompt of the virtual machine to enable IP forwarding:

    ```bash
    sudo nano /etc/sysctl.conf
    ``` 

1. In the Nano editor, remove the **`#`** from the line **`net.ipv4.ip_forward=1`**:

    ```bash
    # Uncomment the next line to enable packet forwarding for IPv4
    net.ipv4.ip_forward=1
    ```

    Press **Ctrl + O** to save the file.

    Press **Ctrl + X** to exit the editor.

1. Enter the following information to enable internal NAT in the virtual machine:

    ```bash
    sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
    sudo apt-get update
    sudo apt install iptables-persistent
    ```

    Select **Yes** twice.

    ```bash
    sudo su
    iptables-save > /etc/iptables/rules.v4
    exit
    ```

1. Use Nano to edit the configuration with the following information:

    ```bash
    sudo nano /etc/rc.local
    ```

    Add the following line to the configuration file:
    
    ```bash
    /sbin/iptables-restore < /etc/iptables/rules.v4
    ```

    Press **Ctrl + O** to save the file.

    Press **Ctrl + X** to exit the editor.

1. Reboot the virtual machine:

    ```bash
    sudo reboot
    ```

## Create hub network route table

Route tables are used to overwrite Azure's default routing. Create a route table to force all traffic within the hub private subnet through the simulated NVA.

# [**Portal**](#tab/portal)

1. In the search box at the top of the portal, enter **Route table**. Select **Route tables** in the search results.

1. Select **+ Create**.

1. In **Create Route table** enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |   |
    | Region | Select **East US 2**. |
    | Name | Enter **route-table-nat-hub**. |
    | Propagate gateway routes | Leave the default of **Yes**. |

1. Select **Review + create**. 

1. Select **Create**.

1. In the search box at the top of the portal, enter **Route table**. Select **Route tables** in the search results.

1. Select **route-table-nat-hub**.

1. Expand **Settings** then select **Routes**.

1. Select **+ Add** in **Routes**.

1. Enter or select the following information in **Add route**:

    | Setting | Value |
    | ------- | ----- |
    | Route name | Enter **default-via-nat-hub**. |
    | Destination type | Select **IP Addresses**. |
    | Destination IP addresses/CIDR ranges | Enter **0.0.0.0/0**. |
    | Next hop type | Select **Virtual appliance**. |
    | Next hop address | Enter **10.0.0.10**. </br> **_This is the IP address you added to the private interface of the NVA in the previous steps._**. |

1. Select **Add**.

1. Select **Subnets** in **Settings**.

1. Select **+ Associate**.

1. Enter or select the following information in **Associate subnet**:

    | Setting | Value |
    | ------- | ----- |
    | Virtual network | Select **vnet-hub (test-rg)**. |
    | Subnet | Select **subnet-private**. |

1. Select **OK**.
 
# [**Powershell**](#tab/powershell)

Use [New-AzRouteTable](/powershell/module/az.network/new-azroutetable) to create the route table.

```powershell
$routeTableParams = @{
    ResourceGroupName = "test-rg"
    Name = "route-table-nat-hub"
    Location = "eastus2"
}
New-AzRouteTable @routeTableParams
```

Use [Add-AzRouteConfig](/powershell/module/az.network/add-azrouteconfig) to create the route in the route table.

```powershell
$routeConfigParams = @{
    Name = "default-via-nat-hub"
    AddressPrefix = "0.0.0.0/0"
    NextHopType = "VirtualAppliance"
    NextHopIpAddress = "10.0.0.10"
}

$routeTableParams = @{
    ResourceGroupName = "test-rg"
    Name = "route-table-nat-hub"
}
$routeTable = Get-AzRouteTable @routeTableParams

$routeTable | Add-AzRouteConfig @routeConfigParams | Set-AzRouteTable

```

Use [Set-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/set-azvirtualnetworksubnetconfig) to associate the route table with the subnet.

```powershell
$vnetParams = @{
    ResourceGroupName = "test-rg"
    Name = "vnet-hub"
}
$vnet = Get-AzVirtualNetwork @vnetParams

$subnetParams = @{
    VirtualNetwork = $vnet
    Name = "subnet-private"
}
$subnet = Get-AzVirtualNetworkSubnetConfig @subnetParams

$subnet.RouteTable = $routeTable

Set-AzVirtualNetwork -VirtualNetwork $vnet
```

# [**CLI**](#tab/cli)

Use [az network route-table create](/cli/azure/network/route-table#az_network_route_table_create) to create the route table.

```azurecli
az network route-table create \
    --resource-group test-rg \
    --name route-table-nat-hub \
    --location eastus2
```

Use [az network route-table route create](/cli/azure/network/route-table/route#az_network_route_table_route_create) to create the route in the route table.

```azurecli
az network route-table route create \
    --resource-group test-rg \
    --route-table-name route-table-nat-hub \
    --name default-via-nat-hub \
    --address-prefix 0.0.0.0/0 \
    --next-hop-type VirtualAppliance \
    --next-hop-ip-address 10.0.0.10
```

Use [az network vnet subnet update](/cli/azure/network/vnet/subnet#az_network_vnet_subnet_update) to associate the route table with the subnet.

```azurecli
az network vnet subnet update \
    --resource-group test-rg \
    --vnet-name vnet-hub \
    --name subnet-private \
    --route-table route-table-nat-hub
```

---

## Create spoke one virtual network

Create another virtual network in a different region for the first spoke of the hub and spoke network.

# [**Portal**](#tab/portal)

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

1. Select **+ Create**.

1. In the **Basics** tab of **Create virtual network**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |   |
    | Name | Enter **vnet-spoke-1**. |
    | Region | Select **(US) South Central US**. |

1. Select **Next** to proceed to the **Security** tab.

1. Select **Next** to proceed to the **IP addresses** tab.

1. In the **IP Addresses** tab in **IPv4 address space**, select **Delete address space** to delete the address space that is auto populated.

1. Select **Add IPv4 address space**.

1. In **IPv4 address space** enter **10.1.0.0**. Leave the default of **/16 (65,536 addresses)** in the mask selection.

1. Select **+ Add a subnet**.

1. In **Add a subnet** enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Subnet purpose | Leave the default **Default**. |
    | Name | Enter **subnet-private**. |
    | **IPv4** |   |
    | IPv4 address range| Leave the default of **10.1.0.0/16**. |
    | Starting address | Leave the default of **10.1.0.0**. |
    | Size | Leave the default of **/24(256 addresses)**. |

1. Select **Add**.

1. Select **Review + create**.

1. Select **Create**.

# [**Powershell**](#tab/powershell)

Use [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork) to create the virtual network.

```powershell
$vnetParams = @{
    ResourceGroupName = "test-rg"
    Name = "vnet-spoke-1"
    AddressPrefix = "10.1.0.0/16"
    Location = "southcentralus"
}
New-AzVirtualNetwork @vnetParams
```

Use [Add-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/add-azvirtualnetworksubnetconfig) to create the subnet.

```powershell
$vnetParams = @{
    ResourceGroupName = "test-rg"
    Name = "vnet-spoke-1"
}
$vnet = Get-AzVirtualNetwork @vnetParams

$subnetParams = @{
    VirtualNetwork = $vnet
    Name = "subnet-private"
    AddressPrefix = "10.1.0.0/24"
}
Add-AzVirtualNetworkSubnetConfig @subnetParams

Set-AzVirtualNetwork -VirtualNetwork $vnet
```

# [**CLI**](#tab/cli)

Use [az network vnet create](/cli/azure/network/vnet#az_network_vnet_create) to create the virtual network.

```azurecli
az network vnet create \
    --resource-group test-rg \
    --name vnet-spoke-1 \
    --address-prefix 10.1.0.0/16 \
    --location southcentralus
```

Use [az network vnet subnet create](/cli/azure/network/vnet/subnet#az_network_vnet_subnet_create) to create the subnet.

```azurecli
az network vnet subnet create \
    --resource-group test-rg \
    --vnet-name vnet-spoke-1 \
    --name subnet-private \
    --address-prefix 10.1.0.0/24
```

---

## Create peering between hub and spoke one

A virtual network peering is used to connect the hub to spoke one and spoke one to the hub. Use the following example to create a two-way network peering between the hub and spoke one.

# [**Portal**](#tab/portal)

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

1. Select **vnet-hub**.

1. Expand **Settings**, then select **Peerings**.

1. Select **+ Add**.

1. Enter or select the following information in **Add peering**:

    | Setting | Value |
    | ------- | ----- 
    | **Remote virtual network summary** |   |
    | Peering link name | Enter **vnet-spoke-1-to-vnet-hub**. |
    | Virtual network deployment model | Leave the default of **Resource manager**. |
    | Subscription | Select your subscription. |
    | Virtual network | Select **vnet-spoke-1 (test-rg)**. |
    | **Remote virtual network peering settings** |   |
    | Allow 'vnet-spoke-1' to access 'vnet-hub' | Leave the default of **Selected**. |
    | Allow 'vnet-spoke-1' to receive forwarded traffic from 'vnet-hub' | Select the checkbox. |
    | Allow gateway or route server in 'vnet-spoke-1' to forward traffic to 'vnet-hub' | Leave the default of **Unselected**. |
    | Enable 'vnet-spoke-1' to use 'vnet-hub's' remote gateway or route server | Leave the default of **Unselected**. |
    | **Local virtual network summary** |   |
    | Peering link name | Enter **vnet-hub-to-vnet-spoke-1**. |
    | **Local virtual network peering settings** |   |
    | Allow 'vnet-hub' to access 'vnet-spoke-1' | Leave the default of **Selected**. |
    | Allow 'vnet-hub' to receive forwarded traffic from 'vnet-spoke-1' | Select the checkbox. |
    | Allow gateway or route server in 'vnet-hub' to forward traffic to 'vnet-spoke-1' | Leave the default of **Unselected**. |
    | Enable 'vnet-hub' to use 'vnet-spoke-1's' remote gateway or route server | Leave the default of **Unselected**. |
    
1. Select **Add**.

1. Select **Refresh** and verify **Peering status** is **Connected**.

# [**Powershell**](#tab/powershell)

Use [Add-AzVirtualNetworkPeering](/powershell/module/az.network/add-azvirtualnetworkpeering) to create the peering from the hub to spoke one.

```powershell
# Create peering from hub to spoke one
$hubVnetParams = @{
    ResourceGroupName = "test-rg"
    Name = "vnet-hub"
}
$hubVnet = Get-AzVirtualNetwork @hubVnetParams

$spokeVnetParams = @{
    ResourceGroupName = "test-rg"
    Name = "vnet-spoke-1"
}
$spokeVnet = Get-AzVirtualNetwork @spokeVnetParams

$hubToSpokeParams = @{
    Name = "vnet-hub-to-vnet-spoke-1"
    VirtualNetwork = $hubVnet
    RemoteVirtualNetworkId = $spokeVnet.Id
    AllowForwardedTraffic = $true
}
Add-AzVirtualNetworkPeering @hubToSpokeParams

# Create peering from spoke one to hub
$spokeToHubParams = @{
    Name = "vnet-spoke-1-to-vnet-hub"
    VirtualNetwork = $spokeVnet
    RemoteVirtualNetworkId = $hubVnet.Id
    AllowForwardedTraffic = $true
}
Add-AzVirtualNetworkPeering @spokeToHubParams
```

# [**CLI**](#tab/cli)

Use [az network vnet peering create](/cli/azure/network/vnet/peering#az_network_vnet_peering_create) to create the peering from the hub to spoke one.

```azurecli
# Create peering from hub to spoke one
az network vnet peering create \
    --name vnet-hub-to-vnet-spoke-1 \
    --resource-group test-rg \
    --vnet-name vnet-hub \
    --remote-vnet vnet-spoke-1 \
    --allow-vnet-access \
    --allow-forwarded-traffic

# Create peering from spoke one to hub
az network vnet peering create \
    --name vnet-spoke-1-to-vnet-hub \
    --resource-group test-rg \
    --vnet-name vnet-spoke-1 \
    --remote-vnet vnet-hub \
    --allow-vnet-access \
    --allow-forwarded-traffic
```

---

## Create spoke one network route table

Create a route table to force all inter-spoke and internet egress traffic through the simulated NVA in the hub virtual network.

# [**Portal**](#tab/portal)

1. In the search box at the top of the portal, enter **Route table**. Select **Route tables** in the search results.

1. Select **+ Create**.

1. In **Create Route table** enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |   |
    | Region | Select **South Central US**. |
    | Name | Enter **route-table-nat-spoke-1**. |
    | Propagate gateway routes | Leave the default of **Yes**. |

1. Select **Review + create**. 

1. Select **Create**.

1. In the search box at the top of the portal, enter **Route table**. Select **Route tables** in the search results.

1. Select **route-table-nat-spoke-1**.

1. Expand **Settings**, then select **Routes**.

1. Select **+ Add** in **Routes**.

1. Enter or select the following information in **Add route**:

    | Setting | Value |
    | ------- | ----- |
    | Route name | Enter **default-via-nat-spoke-1**. |
    | Destination type | Select **IP Addresses**. |
    | Destination IP addresses/CIDR ranges | Enter **0.0.0.0/0**. |
    | Next hop type | Select **Virtual appliance**. |
    | Next hop address | Enter **10.0.0.10**. </br> **_This is the IP address you added to the private interface of the NVA in the previous steps._**. |

1. Select **Add**.

1. Select **Subnets** in **Settings**.

1. Select **+ Associate**.

1. Enter or select the following information in **Associate subnet**:

    | Setting | Value |
    | ------- | ----- |
    | Virtual network | Select **vnet-spoke-1 (test-rg)**. |
    | Subnet | Select **subnet-private**. |

1. Select **OK**.

# [**Powershell**](#tab/powershell)

Use [New-AzRouteTable](/powershell/module/az.network/new-azroutetable) to create the route table.

```powershell
$routeTableParams = @{
    ResourceGroupName = "test-rg"
    Name = "route-table-nat-spoke-1"
    Location = "southcentralus"
}
New-AzRouteTable @routeTableParams
```

Use [Add-AzRouteConfig](/powershell/module/az.network/add-azrouteconfig) to create the route in the route table.

```powershell
$routeConfigParams = @{
    Name = "default-via-nat-spoke-1"
    AddressPrefix = "0.0.0.0/0"
    NextHopType = "VirtualAppliance"
    NextHopIpAddress = "10.0.0.10"
}

$routeTableParams = @{
    ResourceGroupName = "test-rg"
    Name = "route-table-nat-spoke-1"
}
$routeTable = Get-AzRouteTable @routeTableParams

$routeTable | Add-AzRouteConfig @routeConfigParams | Set-AzRouteTable
```

Use [Set-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/set-azvirtualnetworksubnetconfig) to associate the route table with the subnet.

```powershell
$vnetParams = @{
    ResourceGroupName = "test-rg"
    Name = "vnet-spoke-1"
}
$vnet = Get-AzVirtualNetwork @vnetParams

$subnetParams = @{
    VirtualNetwork = $vnet
    Name = "subnet-private"
}
$subnet = Get-AzVirtualNetworkSubnetConfig @subnetParams

$subnet.RouteTable = $routeTable

Set-AzVirtualNetwork -VirtualNetwork $vnet
```

# [**CLI**](#tab/cli)

Use [az network route-table create](/cli/azure/network/route-table#az_network_route_table_create) to create the route table.

```azurecli
az network route-table create \
    --resource-group test-rg \
    --name route-table-nat-spoke-1 \
    --location southcentralus
```

Use [az network route-table route create](/cli/azure/network/route-table/route#az_network_route_table_route_create) to create the route in the route table.

```azurecli
az network route-table route create \
    --resource-group test-rg \
    --route-table-name route-table-nat-spoke-1 \
    --name default-via-nat-spoke-1 \
    --address-prefix 0.0.0.0/0 \
    --next-hop-type VirtualAppliance \
    --next-hop-ip-address 10.0.0.10
```

Use [az network vnet subnet update](/cli/azure/network/vnet/subnet#az_network_vnet_subnet_update) to associate the route table with the subnet.

```azurecli
az network vnet subnet update \
    --resource-group test-rg \
    --vnet-name vnet-spoke-1 \
    --name subnet-private \
    --route-table route-table-nat-spoke-1
```

---

## Create spoke one test virtual machine

A Windows Server 2022 virtual machine is used to test the outbound internet traffic through the NAT gateway and inter-spoke traffic in the hub and spoke network. Use the following example to create a Windows Server 2022 virtual machine.

# [**Portal**](#tab/portal)

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **+ Create** then **Azure virtual machine**.

1. In **Create a virtual machine** enter or select the following information in the **Basics** tab:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |   |
    | Virtual machine name | Enter **vm-spoke-1**. |
    | Region | Select **(US) South Central US**. |
    | Availability options | Select **No infrastructure redundancy required**. |
    | Security type | Select **Standard**. |
    | Image | Select **Windows Server 2022 Datacenter - x64 Gen2**. |
    | VM architecture | Leave the default of **x64**. |
    | Size | Select a size. |
    | **Administrator account** |   |
    | Authentication type | Select **Password**. |
    | Username | Enter a username. |
    | Password | Enter a password. |
    | Confirm password | Reenter password. |
    | **Inbound port rules** |  |
    | Public inbound ports | Select **None**. |

1. Select **Next: Disks** then **Next: Networking**.

1. In the Networking tab, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Network interface** |   |
    | Virtual network | Select **vnet-spoke-1**. |
    | Subnet | Select **subnet-private (10.1.0.0/24)**. |
    | Public IP | Select **None**. |
    | NIC network security group | Select **Advanced**. |
    | Configure network security group | Select **Create new**. </br> Enter **nsg-spoke-1**. |
    | Inbound rules | Select **+ Add an inbound rule**. </br> Select **HTTP** in **Service**. </br> Select **Add**. </br> Select **OK**. |

1. Select **OK**.

1. Leave the rest of the options at the defaults and select **Review + create**.

1. Select **Create**.

# [**Powershell**](#tab/powershell)

Use [New-AzNetworkSecurityGroup](/powershell/module/az.network/new-aznetworksecuritygroup) to create the network security group.

```powershell
$nsgParams = @{
    ResourceGroupName = "test-rg"
    Name = "nsg-spoke-1"
    Location = "southcentralus"
}
New-AzNetworkSecurityGroup @nsgParams
```

Use [New-AzNetworkSecurityRuleConfig](/powershell/module/az.network/new-aznetworksecurityruleconfig) to create an inbound NSG rule for HTTP.

```powershell
$nsgParams = @{
    ResourceGroupName = "test-rg"
    Name = "nsg-spoke-1"
}
$nsg = Get-AzNetworkSecurityGroup @nsgParams

$ruleParams = @{
    Name = "allow-http"
    Priority = 1000
    Direction = "Inbound"
    Access = "Allow"
    Protocol = "Tcp"
    SourceAddressPrefix = "*"
    SourcePortRange = "*"
    DestinationAddressPrefix = "*"
    DestinationPortRange = "80"
}
$nsg | Add-AzNetworkSecurityRuleConfig @ruleParams

Set-AzNetworkSecurityGroup -NetworkSecurityGroup $nsg
```

Use [New-AzNetworkInterface](/powershell/module/az.network/new-aznetworkinterface) to create the network interface.

```powershell
$nicParams = @{
    ResourceGroupName = "test-rg"
    Name = "nic-1"
    SubnetId = (Get-AzVirtualNetwork -ResourceGroupName "test-rg" -Name "vnet-spoke-1").Subnets[0].Id
    NetworkSecurityGroupId = (Get-AzNetworkSecurityGroup -ResourceGroupName "test-rg" -Name "nsg-spoke-1").Id
    Location = "southcentralus"
}
New-AzNetworkInterface @nicParams
```

Use [Get-Credential](/powershell/module/microsoft.powershell.security/get-credential) to set a user name and password for the VM and store them in the `$cred` variable.

```azurepowershell
$cred = Get-Credential
```

Use [New-AzVMConfig](/powershell/module/az.compute/new-azvmconfig) to define a VM.

```azurepowershell
$vmConfigParams = @{
    VMName = "vm-spoke-1"
    VMSize = "Standard_DS4_v2"
    }
$vmConfig = New-AzVMConfig @vmConfigParams
```

Use [Set-AzVMOperatingSystem](/powershell/module/az.compute/set-azvmoperatingsystem) and [Set-AzVMSourceImage](/powershell/module/az.compute/set-azvmsourceimage) to create the rest of the VM configuration. The following example creates a Windows Server virtual machine:

```azurepowershell
$osParams = @{
    VM = $vmConfig
    ComputerName = "vm-spoke-1"
    Credential = $cred
    }
$vmConfig = Set-AzVMOperatingSystem @osParams -Windows

$imageParams = @{
    VM = $vmConfig
    PublisherName = "MicrosoftWindowsServer"
    Offer = "WindowsServer"
    Skus = "2022-Datacenter"
    Version = "latest"
    }
$vmConfig = Set-AzVMSourceImage @imageParams
```

Use [Add-AzVMNetworkInterface](/powershell/module/az.compute/add-azvmnetworkinterface) to attach the NIC that you previously created to the VM.

```azurepowershell
# Get the network interface object
$nicParams = @{
    ResourceGroupName = "test-rg"
    Name = "nic-1"
    }
$nic = Get-AzNetworkInterface @nicParams

$vmConfigParams = @{
    VM = $vmConfig
    Id = $nic.Id
    }
$vmConfig = Add-AzVMNetworkInterface @vmConfigParams
```

Use [New-AzVM](/powershell/module/az.compute/new-azvm) to create the VM.

```azurepowershell
$vmParams = @{
    VM = $vmConfig
    ResourceGroupName = "test-rg"
    Location = "southcentralus"
    }
New-AzVM @vmParams
```

# [**CLI**](#tab/cli)

Use [az network nsg create](/cli/azure/network/nsg#az_network_nsg_create) to create the network security group.

```azurecli
az network nsg create \
    --resource-group test-rg \
    --name nsg-spoke-1 \
    --location eastus2
```

Use [az network nsg rule create](/cli/azure/network/nsg/rule#az_network_nsg_rule_create) to create an inbound NSG rule for HTTP.

```azurecli
az network nsg rule create \
    --resource-group test-rg \
    --nsg-name nsg-spoke-1 \
    --name allow-http \
    --priority 1000 \
    --direction Inbound \
    --access Allow \
    --protocol Tcp \
    --destination-port-ranges 80
```

Use [az network nic create](/cli/azure/network/nic#az_network_nic_create) to create the network interface.

```azurecli
az network nic create \
    --resource-group test-rg \
    --name nic-1 \
    --vnet-name vnet-1 \
    --subnet subnet-private \
    --network-security-group nsg-spoke-1
```

Use [az vm create](/cli/azure/vm#az_vm_create) to create the Windows Server 2022 virtual machine.

```azurecli
az vm create \
    --resource-group test-rg \
    --name vm-spoke-1 \
    --image Win2022Datacenter \
    --size Standard_DS2_v2 \
    --admin-username azureuser \
    --nics nic-1
```

---

Wait for the virtual machine to finishing deploying before continuing to the next steps.

## Install IIS on spoke one test virtual machine

IIS is installed on the Windows Server 2022 virtual machine to test outbound internet traffic through the NAT gateway and inter-spoke traffic in the hub and spoke network.

# [**Portal**](#tab/portal)

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **vm-spoke-1**.

1. Expand **Operations** then select **Run command**.

1. Select **RunPowerShellScript**.

1. Enter the following script in **Run Command Script**:

    ```powershell
    # Install IIS server role
    Install-WindowsFeature -name Web-Server -IncludeManagementTools
    
    # Remove default htm file
    Remove-Item  C:\inetpub\wwwroot\iisstart.htm
    
    # Add a new htm file that displays server name
    Add-Content -Path "C:\inetpub\wwwroot\iisstart.htm" -Value $("Hello World from " + $env:computername)
    ```

1. Select **Run**.

1. Wait for the script to complete before continuing to the next step. It can take a few minutes for the script to complete.

1. When the script completes, the **Output** displays the following:

    ```output
    Success Restart Needed Exit Code      Feature Result                               
    ------- -------------- ---------      --------------                               
    True    No             Success        {Common HTTP Features, Default Document, D...
    ```

# [**Powershell**](#tab/powershell)

Use [Set-AzVMExtension](/powershell/module/az.compute/set-azvmextension) to install IIS on the virtual machine.

```powershell
$vmExtensionParams = @{
    ResourceGroupName = "test-rg"
    VMName = "vm-spoke-1"
    Name = "CustomScriptExtension"
    Publisher = "Microsoft.Compute"
    Type = "CustomScriptExtension"
    TypeHandlerVersion = "1.10"
    Settings = @{
        "commandToExecute" = "powershell Add-WindowsFeature Web-Server; powershell Add-Content -Path 'C:\inetpub\wwwroot\default.htm' -Value vm-spoke-1"
    }
}
Set-AzVMExtension @vmExtensionParams
```

# [**CLI**](#tab/cli)

Use [az vm extension set](/cli/azure/vm/extension#az_vm_extension_set) to install IIS on the virtual machine.

```azurecli
az vm extension set \
    --publisher Microsoft.Compute \
    --version 1.8 \
    --name CustomScriptExtension \
    --vm-name vm-spoke-1 \
    --resource-group test-rg \
    --settings '{"commandToExecute":"powershell Add-WindowsFeature Web-Server; powershell Add-Content -Path \"C:\\inetpub\\wwwroot\\default.htm\" -Value $($env:computername)"}'
```

---

## Create the second spoke virtual network

Create the second virtual network for the second spoke of the hub and spoke network. 

# [**Portal**](#tab/portal)

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

1. Select **+ Create**.

1. In the **Basics** tab of **Create virtual network**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |   |
    | Name | Enter **vnet-spoke-2**. |
    | Region | Select **(US) West US 2**. |

1. Select **Next** to proceed to the **Security** tab.

1. Select **Next** to proceed to the **IP addresses** tab.

1. In the **IP Addresses** tab in **IPv4 address space**, select **Delete address space** to delete the address space that is auto populated.

1. Select **Add IPv4 address space**.

1. In **IPv4 address space** enter **10.2.0.0**. Leave the default of **/16 (65,536 addresses)** in the mask selection.

1. Select **+ Add a subnet**.

1. In **Add a subnet** enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Subnet purpose | Leave the default **Default**. |
    | Name | Enter **subnet-private**. |
    | **IPv4** |   |
    | IPv4 address range | Leave the default of **10.2.0.0/16**. |
    | Starting address | Leave the default of **10.2.0.0**. |
    | Size | Leave the default of **/24(256 addresses)**. |

1. Select **Add**.

1. Select **Review + create**.

1. Select **Create**.

# [**Powershell**](#tab/powershell)

Use [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork) to create the virtual network.

```powershell
$vnetParams = @{
    ResourceGroupName = "test-rg"
    Name = "vnet-spoke-2"
    AddressPrefix = "10.2.0.0/16"
    Location = "westus2"
}
New-AzVirtualNetwork @vnetParams
```

Use [Add-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/add-azvirtualnetworksubnetconfig) to create the subnet.

```powershell
$vnetParams = @{
    ResourceGroupName = "test-rg"
    Name = "vnet-spoke-2"
}
$vnet = Get-AzVirtualNetwork @vnetParams

$subnetParams = @{
    VirtualNetwork = $vnet
    Name = "subnet-private"
    AddressPrefix = "10.2.0.0/24"
}
Add-AzVirtualNetworkSubnetConfig @subnetParams

Set-AzVirtualNetwork -VirtualNetwork $vnet
```

# [**CLI**](#tab/cli)

Use [az network vnet create](/cli/azure/network/vnet#az_network_vnet_create) to create the virtual network.

```azurecli
az network vnet create \
    --resource-group test-rg \
    --name vnet-spoke-2 \
    --address-prefix 10.2.0.0/16 \
    --location westus2
```

Use [az network vnet subnet create](/cli/azure/network/vnet/subnet#az_network_vnet_subnet_create) to create the subnet.

```azurecli
az network vnet subnet create \
    --resource-group test-rg \
    --vnet-name vnet-spoke-2 \
    --name subnet-private \
    --address-prefix 10.2.0.0/24
```

---

## Create peering between hub and spoke two

Create a two-way virtual network peer between the hub and spoke two.

# [**Portal**](#tab/portal)

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

1. Select **vnet-hub**.

1. Select **Peerings** in **Settings**.

1. Select **+ Add**.

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

1. Select **vnet-hub**.

1. Select **Peerings** in **Settings**.

1. Select **+ Add**.

1. Enter or select the following information in **Add peering**:

    | Setting | Value |
    | ------- | ----- 
    | **Remote virtual network summary** |   |
    | Peering link name | Enter **vnet-spoke-2-to-vnet-hub**. |
    | Virtual network deployment model | Leave the default of **Resource manager**. |
    | Subscription | Select your subscription. |
    | Virtual network | Select **vnet-spoke-2 (test-rg)**. |
    | **Remote virtual network peering settings** |   |
    | Allow 'vnet-spoke-2' to access 'vnet-hub' | Leave the default of **Selected**. |
    | Allow 'vnet-spoke-2' to receive forwarded traffic from 'vnet-hub' | Select the checkbox. |
    | Allow gateway or route server in 'vnet-spoke-2' to forward traffic to 'vnet-hub' | Leave the default of **Unselected**. |
    | Enable 'vnet-spoke-2' to use 'vnet-hub's' remote gateway or route server | Leave the default of **Unselected**. |
    | **Local virtual network summary** |   |
    | Peering link name | Enter **vnet-hub-to-vnet-spoke-2**. |
    | **Local virtual network peering settings** |   |
    | Allow 'vnet-hub' to access 'vnet-spoke-2' | Leave the default of **Selected**. |
    | Allow 'vnet-hub' to receive forwarded traffic from 'vnet-spoke-2' | Select the checkbox. |
    | Allow gateway or route server in 'vnet-hub' to forward traffic to 'vnet-spoke-2' | Leave the default of **Unselected**. |
    | Enable 'vnet-hub' to use 'vnet-spoke-2's' remote gateway or route server | Leave the default of **Unselected**. |

1. Select **Add**.

1. Select **Refresh** and verify **Peering status** is **Connected**.

# [**Powershell**](#tab/powershell)

Use [Add-AzVirtualNetworkPeering](/powershell/module/az.network/add-azvirtualnetworkpeering) to create the peering from the hub to spoke two.

```powershell
# Create peering from hub to spoke two
$hubVnetParams = @{
    ResourceGroupName = "test-rg"
    Name = "vnet-hub"
}
$hubVnet = Get-AzVirtualNetwork @hubVnetParams

$spokeVnetParams = @{
    ResourceGroupName = "test-rg"
    Name = "vnet-spoke-2"
}
$spokeVnet = Get-AzVirtualNetwork @spokeVnetParams

$hubToSpokeParams = @{
    Name = "vnet-hub-to-vnet-spoke-2"
    VirtualNetwork = $hubVnet
    RemoteVirtualNetworkId = $spokeVnet.Id
    AllowForwardedTraffic = $true
}
Add-AzVirtualNetworkPeering @hubToSpokeParams

# Create peering from spoke two to hub
$spokeToHubParams = @{
    Name = "vnet-spoke-2-to-vnet-hub"
    VirtualNetwork = $spokeVnet
    RemoteVirtualNetworkId = $hubVnet.Id
    AllowForwardedTraffic = $true
}
Add-AzVirtualNetworkPeering @spokeToHubParams
```

# [**CLI**](#tab/cli)

Use [az network vnet peering create](/cli/azure/network/vnet/peering#az_network_vnet_peering_create) to create the peering from the hub to spoke two.

```azurecli
# Create peering from hub to spoke two
az network vnet peering create \
    --name vnet-hub-to-vnet-spoke-2 \
    --resource-group test-rg \
    --vnet-name vnet-hub \
    --remote-vnet vnet-spoke-2 \
    --allow-vnet-access \
    --allow-forwarded-traffic

# Create peering from spoke two to hub
az network vnet peering create \
    --name vnet-spoke-2-to-vnet-hub \
    --resource-group test-rg \
    --vnet-name vnet-spoke-2 \
    --remote-vnet vnet-hub \
    --allow-vnet-access \
    --allow-forwarded-traffic
```

---

## Create spoke two network route table

Create a route table to force all outbound internet and inter-spoke traffic through the simulated NVA in the hub virtual network.

# [**Portal**](#tab/portal)

1. In the search box at the top of the portal, enter **Route table**. Select **Route tables** in the search results.

1. Select **+ Create**.

1. In **Create Route table** enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |   |
    | Region | Select **West US 2**. |
    | Name | Enter **route-table-nat-spoke-2**. |
    | Propagate gateway routes | Leave the default of **Yes**. |

1. Select **Review + create**. 

1. Select **Create**.

1. In the search box at the top of the portal, enter **Route table**. Select **Route tables** in the search results.

1. Select **route-table-nat-spoke-2**.

1. In **Settings** select **Routes**.

1. Select **+ Add** in **Routes**.

1. Enter or select the following information in **Add route**:

    | Setting | Value |
    | ------- | ----- |
    | Route name | Enter **default-via-nat-spoke-2**. |
    | Destination type | Select **IP Addresses**. |
    | Destination IP addresses/CIDR ranges | Enter **0.0.0.0/0**. |
    | Next hop type | Select **Virtual appliance**. |
    | Next hop address | Enter **10.0.0.10**. </br> **_This is the IP address you added to the private interface of the NVA in the previous steps._**. |

1. Select **Add**.

1. Select **Subnets** in **Settings**.

1. Select **+ Associate**.

1. Enter or select the following information in **Associate subnet**:

    | Setting | Value |
    | ------- | ----- |
    | Virtual network | Select **vnet-spoke-2 (test-rg)**. |
    | Subnet | Select **subnet-private**. |

1. Select **OK**.

# [**Powershell**](#tab/powershell)

Use [New-AzRouteTable](/powershell/module/az.network/new-azroutetable) to create the route table.

```powershell
$routeTableParams = @{
    ResourceGroupName = "test-rg"
    Name = "route-table-nat-spoke-2"
    Location = "westus2"
}
New-AzRouteTable @routeTableParams
```

Use [Add-AzRouteConfig](/powershell/module/az.network/add-azrouteconfig) to create the route in the route table.

```powershell
$routeParams = @{
    Name = "default-via-nat-spoke-2"
    AddressPrefix = "0.0.0.0/0"
    NextHopType = "VirtualAppliance"
    NextHopIpAddress = "10.0.0.10"
}

$routeTableParams = @{
    ResourceGroupName = "test-rg"
    Name = "route-table-nat-spoke-2"
}
$routeTable = Get-AzRouteTable @routeTableParams

$routeTable | Add-AzRouteConfig @routeParams | Set-AzRouteTable
```

Use [Set-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/set-azvirtualnetworksubnetconfig) to associate the route table with the subnet.

```powershell
$vnetParams = @{
    ResourceGroupName = "test-rg"
    Name = "vnet-spoke-2"
}
$vnet = Get-AzVirtualNetwork @vnetParams

$subnetParams = @{
    VirtualNetwork = $vnet
    Name = "subnet-private"
}
$subnet = Get-AzVirtualNetworkSubnetConfig @subnetParams

$subnet.RouteTable = $routeTable

Set-AzVirtualNetwork -VirtualNetwork $vnet
```

# [**CLI**](#tab/cli)

Use [az network route-table create](/cli/azure/network/route-table#az_network_route_table_create) to create the route table.

```azurecli
az network route-table create \
    --resource-group test-rg \
    --name route-table-nat-spoke-2 \
    --location westus2
```

Use [az network route-table route create](/cli/azure/network/route-table/route#az_network_route_table_route_create) to create the route in the route table.

```azurecli
az network route-table route create \
    --resource-group test-rg \
    --route-table-name route-table-nat-spoke-2 \
    --name default-via-nat-spoke-2 \
    --address-prefix 0.0.0.0/0 \
    --next-hop-type VirtualAppliance \
    --next-hop-ip-address 10.0.0.10
```

Use [az network vnet subnet update](/cli/azure/network/vnet/subnet#az_network_vnet_subnet_update) to associate the route table with the subnet.

```azurecli
az network vnet subnet update \
    --resource-group test-rg \
    --vnet-name vnet-spoke-2 \
    --name subnet-private \
    --route-table route-table-nat-spoke-2
```

---

## Create spoke two test virtual machine

Create a Windows Server 2022 virtual machine for the test virtual machine in spoke two.

# [**Portal**](#tab/portal)

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **+ Create** then **Azure virtual machine**.

1. In **Create a virtual machine** enter or select the following information in the **Basics** tab:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |   |
    | Virtual machine name | Enter **vm-spoke-2**. |
    | Region | Select **(US) West US 2**. |
    | Availability options | Select **No infrastructure redundancy required**. |
    | Security type | Select **Standard**. |
    | Image | Select **Windows Server 2022 Datacenter - x64 Gen2**. |
    | VM architecture | Leave the default of **x64**. |
    | Size | Select a size. |
    | **Administrator account** |   |
    | Authentication type | Select **Password**. |
    | Username | Enter a username. |
    | Password | Enter a password. |
    | Confirm password | Reenter password. |
    | **Inbound port rules** |  |
    | Public inbound ports | Select **None**. |

1. Select **Next: Disks** then **Next: Networking**.

1. In the Networking tab, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Network interface** |   |
    | Virtual network | Select **vnet-spoke-2**. |
    | Subnet | Select **subnet-private (10.2.0.0/24)**. |
    | Public IP | Select **None**. |
    | NIC network security group | Select **Advanced**. |
    | Configure network security group | Select **Create new**. </br> Enter **nsg-spoke-2**. |
    | Inbound rules | Select **+ Add an inbound rule**. </br> Select **HTTP** in **Service**. </br> Select **Add**. </br> Select **OK**. |

1. Leave the rest of the options at the defaults and select **Review + create**.

1. Select **Create**.

# [**Powershell**](#tab/powershell)

Use [New-AzNetworkSecurityGroup](/powershell/module/az.network/new-aznetworksecuritygroup) to create the network security group.

```powershell
$nsgParams = @{
    ResourceGroupName = "test-rg"
    Name = "nsg-spoke-2"
    Location = "westus2"
}
New-AzNetworkSecurityGroup @nsgParams
```

Use [New-AzNetworkSecurityRuleConfig](/powershell/module/az.network/new-aznetworksecurityruleconfig) to create an inbound NSG rule for HTTP.

```powershell
$ruleParams = @{
    Name = "allow-http"
    Priority = 1000
    Direction = "Inbound"
    Access = "Allow"
    Protocol = "Tcp"
    SourceAddressPrefix = "*"
    SourcePortRange = "*"
    DestinationAddressPrefix = "*"
    DestinationPortRange = "80"
}
$nsg = Get-AzNetworkSecurityGroup -ResourceGroupName "test-rg" -Name "nsg-spoke-2"

$nsg | Add-AzNetworkSecurityRuleConfig @ruleParams

Set-AzNetworkSecurityGroup -NetworkSecurityGroup $nsg
```

Use [New-AzNetworkInterface](/powershell/module/az.network/new-aznetworkinterface) to create the network interface.

```powershell
$nicParams = @{
    ResourceGroupName = "test-rg"
    Name = "nic-2"
    SubnetId = (Get-AzVirtualNetwork -ResourceGroupName "test-rg" -Name "vnet-spoke-2").Subnets[0].Id
    NetworkSecurityGroupId = (Get-AzNetworkSecurityGroup -ResourceGroupName "test-rg" -Name "nsg-spoke-2").Id
    Location = "westus2"
}
New-AzNetworkInterface @nicParams
```

Use [Get-Credential](/powershell/module/microsoft.powershell.security/get-credential) to set a user name and password for the VM and store them in the `$cred` variable.

```azurepowershell
$cred = Get-Credential
```

Use [New-AzVMConfig](/powershell/module/az.compute/new-azvmconfig) to define a VM.

```azurepowershell
$vmConfigParams = @{
    VMName = "vm-spoke-2"
    VMSize = "Standard_DS4_v2"
    }
$vmConfig = New-AzVMConfig @vmConfigParams
```

Use [Set-AzVMOperatingSystem](/powershell/module/az.compute/set-azvmoperatingsystem) and [Set-AzVMSourceImage](/powershell/module/az.compute/set-azvmsourceimage) to create the rest of the VM configuration. The following example creates a Windows Server virtual machine:

```azurepowershell
$osParams = @{
    VM = $vmConfig
    ComputerName = "vm-spoke-2"
    Credential = $cred
    }
$vmConfig = Set-AzVMOperatingSystem @osParams -Windows

$imageParams = @{
    VM = $vmConfig
    PublisherName = "MicrosoftWindowsServer"
    Offer = "WindowsServer"
    Skus = "2022-Datacenter"
    Version = "latest"
    }
$vmConfig = Set-AzVMSourceImage @imageParams
```

Use [Add-AzVMNetworkInterface](/powershell/module/az.compute/add-azvmnetworkinterface) to attach the NIC that you previously created to the VM.

```azurepowershell
# Get the network interface object
$nicParams = @{
    ResourceGroupName = "test-rg"
    Name = "nic-2"
    }
$nic = Get-AzNetworkInterface @nicParams

$vmConfigParams = @{
    VM = $vmConfig
    Id = $nic.Id
    }
$vmConfig = Add-AzVMNetworkInterface @vmConfigParams
```

Use [New-AzVM](/powershell/module/az.compute/new-azvm) to create the VM.

```azurepowershell
$vmParams = @{
    VM = $vmConfig
    ResourceGroupName = "test-rg"
    Location = "westus2"
    }
New-AzVM @vmParams
```

# [**CLI**](#tab/cli)

Use [az network nsg create](/cli/azure/network/nsg#az_network_nsg_create) to create the network security group.

```azurecli
az network nsg create \
    --resource-group test-rg \
    --name nsg-spoke-2 \
    --location eastus2
```

Use [az network nsg rule create](/cli/azure/network/nsg/rule#az_network_nsg_rule_create) to create an inbound NSG rule for HTTP.

```azurecli
az network nsg rule create \
    --resource-group test-rg \
    --nsg-name nsg-spoke-2 \
    --name allow-http \
    --priority 1000 \
    --direction Inbound \
    --access Allow \
    --protocol Tcp \
    --destination-port-ranges 80
```

Use [az network nic create](/cli/azure/network/nic#az_network_nic_create) to create the network interface.

```azurecli
az network nic create \
    --resource-group test-rg \
    --name nic-2 \
    --vnet-name vnet-1 \
    --subnet subnet-private \
    --network-security-group nsg-spoke-2
```

Use [az vm create](/cli/azure/vm#az_vm_create) to create the Windows Server 2022 virtual machine.

```azurecli
az vm create \
    --resource-group test-rg \
    --name vm-spoke-2 \
    --image Win2022Datacenter \
    --size Standard_DS2_v2 \
    --admin-username azureuser \
    --nics nic-2
```

---

Wait for the virtual machine to finish deploying before continuing to the next steps.

## Install IIS on spoke two test virtual machine

IIS is installed on the Windows Server 2022 virtual machine to test outbound internet traffic through the NAT gateway and inter-spoke traffic in the hub and spoke network.

# [**Portal**](#tab/portal)

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **vm-spoke-2**.

1. In **Operations**, select **Run command**.

1. Select **RunPowerShellScript**.

1. Enter the following script in **Run Command Script**:

    ```powershell
    # Install IIS server role
    Install-WindowsFeature -name Web-Server -IncludeManagementTools
    
    # Remove default htm file
    Remove-Item  C:\inetpub\wwwroot\iisstart.htm
    
    # Add a new htm file that displays server name
    Add-Content -Path "C:\inetpub\wwwroot\iisstart.htm" -Value $("Hello World from " + $env:computername)
    ```

1. Select **Run**.

1. Wait for the script to complete before continuing to the next step. It can take a few minutes for the script to complete.

1. When the script completes, the **Output*** displays the following:

    ```output
    Success Restart Needed Exit Code      Feature Result                               
    ------- -------------- ---------      --------------                               
    True    No             Success        {Common HTTP Features, Default Document, D...
    ```

# [**Powershell**](#tab/powershell)

Use [Set-AzVMExtension](/powershell/module/az.compute/set-azvmextension) to install IIS on the virtual machine.

```powershell
$vmExtensionParams = @{
    ResourceGroupName = "test-rg"
    VMName = "vm-spoke-2"
    Name = "CustomScriptExtension"
    Publisher = "Microsoft.Compute"
    Type = "CustomScriptExtension"
    TypeHandlerVersion = "1.10"
    Settings = @{
        "commandToExecute" = "powershell Add-WindowsFeature Web-Server; powershell Add-Content -Path 'C:\inetpub\wwwroot\default.htm' -Value vm-spoke-2"
    }
}
Set-AzVMExtension @vmExtensionParams
```

# [**CLI**](#tab/cli)

Use [az vm extension set](/cli/azure/vm/extension#az_vm_extension_set) to install IIS on the virtual machine.

```azurecli
az vm extension set \
    --publisher Microsoft.Compute \
    --version 1.8 \
    --name CustomScriptExtension \
    --vm-name vm-spoke-2 \
    --resource-group test-rg \
    --settings '{"commandToExecute":"powershell Add-WindowsFeature Web-Server; powershell Add-Content -Path \"C:\\inetpub\\wwwroot\\Default.htm\" -Value $($env:computername)"}'
```

---

## Test NAT gateway

To verify that the outbound internet traffic is leaving the NAT gateway, connect to the Windows Server 2022 virtual machines you created in the previous steps.

### Obtain NAT gateway public IP address

Obtain the NAT gateway public IP address for verification of the steps later in the article.

1. Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com).

1. In the search box at the top of the portal, enter **Public IP**. Select **Public IP addresses** in the search results.

1. Select **public-ip-nat**.

1. Make note of value in **IP address**. The example used in this article is **203.0.113.25**.

### Test NAT gateway from spoke one

Use Microsoft Edge on the Windows Server 2022 virtual machine to connect to https://whatsmyip.com to verify the functionality of the NAT gateway.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **vm-spoke-1**.

1. In **Overview**, select **Connect** then **Connect via Bastion**.

1. Enter the username and password you entered when the virtual machine was created.

1. Select **Connect**.

1. Open **Microsoft Edge** when the desktop finishes loading.

1. In the address bar, enter **https://whatsmyip.com**.

1. Verify the outbound IP address displayed is the same as the IP of the NAT gateway you obtained previously.

    :::image type="content" source="./media/tutorial-hub-spoke-route-nat/outbound-ip-address.png" alt-text="Screenshot of outbound IP address.":::

1. Leave the bastion connection open to **vm-spoke-1**.

### Test NAT gateway from spoke two

Use Microsoft Edge on the Windows Server 2022 virtual machine to connect to https://whatsmyip.com to verify the functionality of the NAT gateway.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **vm-spoke-2**.

1. In **Overview**, select **Connect** then **Connect via Bastion**.

1. Enter the username and password you entered when the virtual machine was created.

1. Select **Connect**.

1. Open **Microsoft Edge** when the desktop finishes loading.

1. In the address bar, enter **https://whatsmyip.com**.

1. Verify the outbound IP address displayed is the same as the IP of the NAT gateway you obtained previously.

    :::image type="content" source="./media/tutorial-hub-spoke-route-nat/outbound-ip-address.png" alt-text="Screenshot of outbound IP address.":::

1. Leave the bastion connection open to **vm-spoke-2**.

## Test routing between the spokes

Traffic from spoke one to spoke two and spoke two to spoke one route through the simulated NVA in the hub virtual network. Use the following examples to verify the routing between spokes of the hub and spoke network.

### Test routing from spoke one to spoke two

Use Microsoft Edge to connect to the web server on **vm-spoke-2** you installed in the previous steps.

1. Return to the open bastion connection to **vm-spoke-1**.

1. Open **Microsoft Edge** if it's not open.

1. In the address bar, enter **10.2.0.4**.

1. Verify the IIS page is displayed from **vm-spoke-2**.

    :::image type="content" source="./media/tutorial-hub-spoke-route-nat/iis-myvm-spoke-1.png" alt-text="Screenshot of default IIS page on vm-spoke-1.":::

1. Close the bastion connection to **vm-spoke-1**.

### Test routing from spoke two to spoke one

Use Microsoft Edge to connect to the web server on **vm-spoke-1** you installed in the previous steps.

1. Return to the open bastion connection to **vm-spoke-2**.

1. Open **Microsoft Edge** if it's not open.

1. In the address bar, enter **10.1.0.4**.

1. Verify the IIS page is displayed from **vm-spoke-1**.

    :::image type="content" source="./media/tutorial-hub-spoke-route-nat/iis-myvm-spoke-2.png" alt-text="Screenshot of default IIS page on vm-spoke-2.":::

1. Close the bastion connection to **vm-spoke-1**.

# [**Portal**](#tab/portal)

[!INCLUDE [portal-clean-up.md](~/reusable-content/ce-skilling/azure/includes/portal-clean-up.md)]

# [**Powershell**](#tab/powershell)

Use [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) to delete the resource group.

```powershell
$rgParams = @{
    Name = "test-rg"
    Force = $true
}
Remove-AzResourceGroup @rgParams
```

# [**CLI**](#tab/cli)

Use [az group delete](/cli/azure/group#az_group_delete) to delete the resource group.

```azurecli
az group delete \
    --name test-rg \
    --yes \
    --no-wait
```

---

## Next steps

Advance to the next article to learn how to use an Azure Gateway Load Balancer for highly available network virtual appliances:
> [!div class="nextstepaction"]
> [Gateway Load Balancer](../load-balancer/gateway-overview.md)
