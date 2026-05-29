---
title: Create a StandardV2 NAT Gateway
titlesuffix: Azure NAT Gateway
description: This quickstart shows how to create a StandardV2 NAT gateway by using the Azure portal, Azure PowerShell, and the Azure CLI.
author: asudbring
ms.author: allensu
ms.service: azure-nat-gateway
ms.topic: quickstart 
ms.date: 11/06/2025
ms.custom: template-quickstart, FY23 content-maintenance, linux-related-content
#customer intent: As a cloud engineer, I want to create a NAT gateway by using various deployment methods so that I can facilitate outbound internet connectivity for virtual machines in Azure.
---

# Quickstart: Create a StandardV2 NAT gateway

In this quickstart, learn how to create a network address translation (NAT) gateway for the StandardV2 SKU of Azure NAT Gateway by using the Azure portal, Azure PowerShell, or the Azure CLI. The Azure NAT Gateway service provides scalable outbound connectivity for virtual machines in Azure.

## Prerequisites

### [Portal](#tab/portal)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

### [PowerShell](#tab/powershell)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- Azure Cloud Shell or Azure PowerShell.

  The steps in this quickstart run the Azure PowerShell cmdlets interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code, and then paste it into Cloud Shell to run it. You can also run Cloud Shell from within the Azure portal.

  You can also [install Azure PowerShell locally](/powershell/azure/install-azure-powershell) to run the cmdlets. The steps in this article require Azure PowerShell module version 5.4.1 or later. To find your installed version, run `Get-Module -ListAvailable Az`. If you need to upgrade, see [`Update-AzModule`](/powershell/module/az.tools.installer/update-azmodule).

### [CLI](#tab/cli)

- [!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

- To run CLI reference commands locally, [install the Azure CLI](/cli/azure/install-azure-cli). If you're running on Windows or macOS, consider [running the Azure CLI in a Docker container](/cli/azure/run-azure-cli-docker).

  - If you're using a local installation, sign in to the Azure CLI by using the [`az login`](/cli/azure/reference-index#az-login) command. To finish the authentication process, follow the steps displayed in your terminal. For other sign-in options, see [Authenticate to Azure using Azure CLI](/cli/azure/authenticate-azure-cli).

  - When you're prompted, install the Azure CLI extension on first use. For more information about extensions, see [Use and manage extensions with the Azure CLI](/cli/azure/azure-cli-extensions-overview).

  - To find the version and dependent libraries that are installed, run [`az version`](/cli/azure/reference-index?#az-version). To upgrade to the latest version, run [`az upgrade`](/cli/azure/reference-index?#az-upgrade).

---

## Create a resource group

Create a resource group to contain all resources for this quickstart.

### [Portal](#tab/portal)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter **Resource group**. Select **Resource groups** in the search results.

1. Select **+ Create**.

1. On the **Basics** tab of **Create a resource group**, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | **Subscription** | Select your subscription. |
    | **Resource group** | Enter **test-rg**. |
    | **Region** | Enter **East US**. |

1. Select **Review + create**.

1. Select **Create**.

### [PowerShell](#tab/powershell)

Create a resource group by using [`New-AzResourceGroup`](/powershell/module/az.resources/new-azresourcegroup). An Azure resource group is a logical container into which Azure resources are deployed and managed.

The following example creates a resource group named `test-rg` in the `eastus` location:

```azurepowershell-interactive
$rsg = @{
    Name = 'test-rg'
    Location = 'eastus'
}
New-AzResourceGroup @rsg
```

### [CLI](#tab/cli)

Create a resource group by using [`az group create`](/cli/azure/group#az-group-create). An Azure resource group is a logical container into which Azure resources are deployed and managed.

The following example creates a resource group named `test-rg` in the `eastus` location:

```azurecli-interactive
az group create \
    --name test-rg \
    --location eastus
```

---

## Create the NAT gateway

In this section, create the NAT gateway and supporting resources.

Azure NAT Gateway supports multiple deployment options for IP addresses and redundancy configurations to meet your connectivity and availability requirements.

### Zone-redundant IPv4 address

#### [Portal](#tab/portal)

1. Sign in to the [Azure preview portal](https://preview.portal.azure.com).

1. In the search box at the top of the portal, enter **Public IP address**. Select **Public IP addresses** in the search results.

1. Select **Create**.

1. In **Create public IP address**, enter the following information.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** | |
    | **Subscription** | Select your subscription. |
    | **Resource group** | Select your resource group. This example uses **test-rg**. |
    | **Instance details** | |
    | **Region** | Select a region. This example uses **East US**. |
    | **Configuration details** | |
    | **Name** | Enter **public-ip-nat**. |
    | **IP version** | Select **IPv4**. |
    | **SKU** | Select **Standard V2 (For use with Standard V2 NAT Gateway)**. |
    | **Tier** | Select **Regional**. |

1. Select **Review + create**, and then select **Create**.

1. In the search box at the top of the Azure portal, enter **NAT gateway**. Select **NAT gateways** in the search results.

1. Select **Create**.

1. On the **Basics** tab of **Create network address translation (NAT) gateway**, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** | |
    | **Subscription** | Select your subscription. |
    | **Resource group** | Select **test-rg** or your resource group. |
    | **Instance details** | |
    | **NAT gateway name** | Enter **nat-gateway**. |
    | **Region** | Select your region. This example uses **East US**. |
    | **SKU** | Select **Standard V2**. |
    | **TCP idle timeout (minutes)** | Leave the default of **4**. |

1. Select **Next**.

1. On the **Outbound IP** tab, select **+ Add public IP addresses or prefixes**.

1. In **Add public IP addresses or prefixes**, select **Public IP addresses**. Select the public IP address that you created earlier, **public-ip-nat**.

1. Select **Save**.

1. Select **Review + create**, and then select **Create**.

#### [PowerShell](#tab/powershell)

Create a zone-redundant IPv4 public IP address for the NAT gateway by using [`New-AzPublicIpAddress`](/powershell/module/az.network/new-azpublicipaddress).

```azurepowershell-interactive
## Create a public IP address for the NAT gateway ##
$ip = @{
    Name = 'public-ip-nat'
    ResourceGroupName = 'test-rg'
    Location = 'eastus'
    Sku = 'StandardV2'
    AllocationMethod = 'Static'
    IpAddressVersion = 'IPv4'
    Zone = 1,2,3
}
$publicIPIPv4 = New-AzPublicIpAddress @ip
```

Create the NAT gateway resource by using [`New-AzNatGateway`](/powershell/module/az.network/new-aznatgateway).

```azurepowershell
## Create the NAT gateway resource ##
$nat = @{
    ResourceGroupName = 'test-rg'
    Name = 'nat-gateway'
    IdleTimeoutInMinutes = '4'
    Sku = 'StandardV2'
    Location = 'eastus'
    PublicIpAddress = $publicIPIPv4
    Zone = 1,2,3
}
$natGateway = New-AzNatGateway @nat
```

#### [CLI](#tab/cli)

Create a zone-redundant IPv4 public IP address for the NAT gateway by using [`az network public-ip create`](/cli/azure/network/public-ip#az-network-public-ip-create).

```azurecli-interactive
az network public-ip create \
    --resource-group test-rg \
    --name public-ip-nat \
    --location eastus \
    --sku StandardV2 \
    --allocation-method Static \
    --version IPv4 \
    --zone 1 2 3
```

Create the NAT gateway resource by using [`az network nat gateway create`](/cli/azure/network/nat/gateway#az-network-nat-gateway-create).

```azurecli-interactive
az network nat gateway create \
    --resource-group test-rg \
    --name nat-gateway \
    --location eastus \
    --public-ip-addresses public-ip-nat \
    --idle-timeout 4 \
    --sku StandardV2 \
    --zone 1 2 3
```

---

### Zone-redundant IPv4 prefix

#### [Portal](#tab/portal)

1. Sign in to the [Azure preview portal](https://preview.portal.azure.com).

1. In the search box at the top of the portal, enter **Public IP prefix**. Select **Public IP Prefixes** in the search results.

1. Select **Create**.

1. On the **Basics** tab of **Create a public IP prefix**, enter the following information.

   | Setting | Value |
   | ------- | ----- |
   | **Project details** | |
   | **Subscription** | Select your subscription. |
   | **Resource group** | Select your resource group. This example uses **test-rg**. |
   | **Instance details** | |
   | **Name** | Enter **public-ip-prefix-nat**. |
   | **Region** | Select your region. This example uses **East US**. |
   | **Sku** | Select **Standard V2**. |
   | **IP version** | Select **IPv4**. |
   | **Prefix ownership** | Select **Microsoft owned**. |
   | **Prefix size** | Select a prefix size. This example uses **/28 (16 addresses)**. |

1. Select **Review + create**, and then select **Create**.

1. In the search box at the top of the Azure portal, enter **NAT gateway**. Select **NAT gateways** in the search results.

1. Select **Create**.

1. On the **Basics** tab of **Create network address translation (NAT) gateway**, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** | |
    | **Subscription** | Select your subscription. |
    | **Resource group** | Select **test-rg** or your resource group. |
    | **Instance details** | |
    | **NAT gateway name** | Enter **nat-gateway**. |
    | **Region** | Select your region. This example uses **East US**. |
    | **SKU** | Select **Standard V2**. |
    | **TCP idle timeout (minutes)** | Leave the default of **4**. |

1. Select **Next**.

1. On the **Outbound IP** tab, select **+ Add public IP addresses or prefixes**.

1. In **Add public IP addresses or prefixes**, select **Public IP prefixes**. Select the public IP prefix that you created earlier, **public-ip-prefix-nat**.

1. Select **Review + create**, and then select **Create**.

#### [PowerShell](#tab/powershell)

Create a zone-redundant IPv4 public IP prefix for the NAT gateway by using [`New-AzPublicIpPrefix`](/powershell/module/az.network/new-azpublicipprefix).

```azurepowershell
## Create a public IP prefix for the NAT gateway ##
$ip = @{
    Name = 'public-ip-prefix-nat'
    ResourceGroupName = 'test-rg'
    Location = 'eastus'
    Sku = 'StandardV2'
    PrefixLength = '31'
    IpAddressVersion = 'IPv4'
    Zone = 1,2,3
}
$publicIPIPv4prefix = New-AzPublicIpPrefix @ip
```

Create the NAT gateway resource by using [`New-AzNatGateway`](/powershell/module/az.network/new-aznatgateway).

```azurepowershell
## Create the NAT gateway resource ##
$nat = @{
    ResourceGroupName = 'test-rg'
    Name = 'nat-gateway'
    IdleTimeoutInMinutes = '4'
    Sku = 'StandardV2'
    Location = 'eastus'
    PublicIpPrefix = $publicIPIPv4prefix
    Zone = 1,2,3
}
$natGateway = New-AzNatGateway @nat
```

#### [CLI](#tab/cli)

Create a zone-redundant IPv4 public IP prefix for the NAT gateway by using [`az network public-ip prefix create`](/cli/azure/network/public-ip/prefix#az-network-public-ip-prefix-create).

```azurecli-interactive
az network public-ip prefix create \
    --resource-group test-rg \
    --name public-ip-prefix-nat \
    --location eastus \
    --length 31 \
    --sku StandardV2 \
    --version IPv4 \
    --zone 1 2 3
```

Create the NAT gateway resource by using [`az network nat gateway create`](/cli/azure/network/nat/gateway#az-network-nat-gateway-create).

```azurecli-interactive
az network nat gateway create \
    --resource-group test-rg \
    --name nat-gateway \
    --location eastus \
    --public-ip-prefixes public-ip-prefix-nat \
    --idle-timeout 4 \
    --sku StandardV2 \
    --zone 1 2 3
```

---

## Create virtual network and subnet configurations

Create the virtual network and subnets that you need for this quickstart.

### [Portal](#tab/portal)

1. In the search box at the top of the Azure portal, enter **Virtual network**. Select **Virtual networks** in the search results.

1. Select **Create**.

1. On the **Basics** tab of **Create virtual network**, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** | |
    | **Subscription** | Select your subscription. |
    | **Resource group** | Select **test-rg** or your resource group. |
    | **Instance details** | |
    | **Name** | Enter **vnet-1**. |
    | **Region** | Select your region. This example uses **East US**. |

1. Select the **IP Addresses** tab, or select **Next** > **Next**.

1. In **Subnets**, select the **default** subnet.

1. In **Edit subnet**, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | **Subnet purpose** | Leave the default. |
    | **Name** | Enter **subnet-1**. |
    | **Private subnet** | |
    | **Enable private subnet (no default outbound access)** | Select the checkbox. |
    | **Security** | |
    | **NAT gateway** | Select **nat-gateway**. |

1. Select **Save**.

1. Select **+ Add a subnet**.

1. In **Add a subnet**, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | **Subnet purpose** | Select **Azure Bastion**. |

1. Leave the rest of the settings as default, and then select **Add**.

1. Select **Review + create**, and then select **Create**.

### [PowerShell](#tab/powershell)

Create the subnet configurations by using [`New-AzVirtualNetworkSubnetConfig`](/powershell/module/az.network/new-azvirtualnetworksubnetconfig). Create the virtual network by using [`New-AzVirtualNetwork`](/powershell/module/az.network/new-azvirtualnetwork).

```azurepowershell
## Create the subnet configuration and associate the NAT gateway with the subnet ##
$subnet = @{
    Name = 'subnet-1'
    AddressPrefix = '10.0.0.0/24'
    NatGateway = $natGateway
    DefaultOutboundAccess = $false
}
$subnetConfig = New-AzVirtualNetworkSubnetConfig @subnet 

## Create the Azure Bastion subnet ##
$bastsubnet = @{
    Name = 'AzureBastionSubnet' 
    AddressPrefix = '10.0.1.0/26'
}
$bastsubnetConfig = New-AzVirtualNetworkSubnetConfig @bastsubnet

## Create the virtual network ##
$net = @{
    Name = 'vnet-1'
    ResourceGroupName = 'test-rg'
    Location = 'eastus'
    AddressPrefix = '10.0.0.0/16'
    Subnet = $subnetConfig,$bastsubnetConfig
}
$vnet = New-AzVirtualNetwork @net
```

### [CLI](#tab/cli)

Create the virtual network by using [`az network vnet create`](/cli/azure/network/vnet#az-network-vnet-create). Create and configure the subnet by using [`az network vnet subnet create`](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-create) and [`az network vnet subnet update`](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-update).

```azurecli-interactive
## Create the virtual network ##
az network vnet create \
    --resource-group test-rg \
    --name vnet-1 \
    --location eastus \
    --address-prefix 10.0.0.0/16 \
    --subnet-name subnet-1 \
    --subnet-prefix 10.0.0.0/24

## Associate the NAT gateway with the subnet and disable default outbound access ##
az network vnet subnet update \
    --resource-group test-rg \
    --vnet-name vnet-1 \
    --name subnet-1 \
    --nat-gateway nat-gateway \
    --default-outbound false

## Create the Azure Bastion subnet ##
az network vnet subnet create \
    --resource-group test-rg \
    --vnet-name vnet-1 \
    --name AzureBastionSubnet \
    --address-prefix 10.0.1.0/26
```

---

## Create an Azure Bastion host

Create an Azure Bastion host to securely connect to the virtual machine.

### [Portal](#tab/portal)

1. In the search box at the top of the Azure portal, enter **Bastion**. Select **Bastions** in the search results.

1. Select **Create**.

1. On the **Basics** tab of **Create a Bastion**, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** | |
    | **Subscription** | Select your subscription. |
    | **Resource group** | Select **test-rg** or your resource group. |
    | **Instance details** | |
    | **Name** | Enter **bastion**. |
    | **Region** | Select your region. This example uses **East US**. |
    | **Tier** | Select **Developer**. |
    | **Virtual network** | Select **vnet-1**. |
    | **Subnet** | Select **AzureBastionSubnet**. |

1. Select **Review + create**, and then select **Create**.

### [PowerShell](#tab/powershell)

Create the Azure Bastion host by using [`New-AzBastion`](/powershell/module/az.network/new-azbastion).

```azurepowershell
## Create a public IP address for the Azure Bastion host ##
$ip = @{
    Name = 'public-ip-bastion'
    ResourceGroupName = 'test-rg'
    Location = 'eastus'
    Sku = 'Standard'
    AllocationMethod = 'Static'
    Zone = 1,2,3
}
$publicipbastion = New-AzPublicIpAddress @ip

## Create the Azure Bastion host ##
$bastion = @{
    Name = 'bastion'
    ResourceGroupName = 'test-rg'
    PublicIpAddressRgName = 'test-rg'
    PublicIpAddressName = 'public-ip-bastion'
    VirtualNetworkRgName = 'test-rg'
    VirtualNetworkName = 'vnet-1'
    Sku = 'Basic'
}
New-AzBastion @bastion
```

### [CLI](#tab/cli)

Create a public IP address for the Azure Bastion host by using [`az network public-ip create`](/cli/azure/network/public-ip#az-network-public-ip-create). Create the Azure Bastion host by using [`az network bastion create`](/cli/azure/network/bastion#az-network-bastion-create).

```azurecli-interactive
## Create a public IP address for the Azure Bastion host ##
az network public-ip create \
    --resource-group test-rg \
    --name public-ip-bastion \
    --location eastus \
    --sku Standard \
    --allocation-method Static \
    --zone 1 2 3

## Create the Azure Bastion host ##
az network bastion create \
    --resource-group test-rg \
    --name bastion \
    --location eastus \
    --vnet-name vnet-1 \
    --public-ip-address public-ip-bastion \
    --sku Basic
```

---

The Azure Bastion host can take several minutes to deploy. Wait for the bastion host to deploy before you move on to the next section.

## Create a virtual machine

In this section, you create a virtual machine to test the NAT gateway and verify the public IP address of the outbound connection.

The following command creates Secure Shell (SSH) keys for authentication. You need the private key later to sign in to the virtual machine through Azure Bastion.

The username and password credentials are required for the command. You don't use the password to sign in to the virtual machine.

### [Portal](#tab/portal)

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **Create** > **Virtual machine**.

1. In **Create a virtual machine**, enter or select the following information on the **Basics** tab.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** | |
    | **Subscription** | Select your subscription. |
    | **Resource group** | Select **test-rg** or your resource group. |
    | **Instance details** | |
    | **Virtual machine name** | Enter **vm-1**. |
    | **Region** | Select your region. This example uses **East US**. |
    | **Availability options** | Leave the default of **No infrastructure redundancy required**. |
    | **Security type** | Select **Standard**. |
    | **Image** | Select **Ubuntu Server 24.04 LTS - Gen2**. |
    | **Size** | Select a size. |
    | **Authentication type** | Select **SSH public key**. |
    | **Username** | Enter a username of your choice. You need this username to sign in to the virtual machine later. |
    | **SSH public key source** | Select **Generate new key pair**. |
    | **Key pair name** | Enter **ssh-key**. |
    | **Public inbound ports** | Select **None**. |

1. Select **Next: Disks**, and then select **Next: Networking**.

1. On the **Networking** tab, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | **Network interface** | |
    | **Virtual network** | Select **vnet-1**. |
    | **Subnet** | Select **subnet-1**. |
    | **Public IP** | Select **None**. |
    | **NIC network security group** | Select **Basic**. |
    | **Public inbound ports** | Leave the default of **None**. |

1. Select **Review + create**, and then select **Create**.

### [PowerShell](#tab/powershell)

Create a username and password for the virtual machine by using [`Get-Credential`](/powershell/module/microsoft.powershell.security/get-credential). Create a network interface for the virtual machine by using [`New-AzNetworkInterface`](/powershell/module/az.network/new-aznetworkinterface). Create the virtual machine configuration by using [`New-AzVMConfig`](/powershell/module/az.compute/new-azvmconfig). Create the virtual machine by using [`New-AzVM`](/powershell/module/az.compute/new-azvm).

```azurepowershell-interactive
## Get credentials for the virtual machine ##
$cred = Get-Credential

## Create the network interface for the virtual machine ##
$nic = @{
    Name = "nic-1"
    ResourceGroupName = 'test-rg'
    Location = 'eastus'
    Subnet = $vnet.Subnets[0]
}
$nicVM = New-AzNetworkInterface @nic

## Create the virtual machine configuration ##
$vmsz = @{
    VMName = 'vm-1'
    VMSize = 'Standard_DS1_v2'  
}
$vmos = @{
    ComputerName = 'vm-1'
    Credential = $cred
    DisablePasswordAuthentication = $true
}
$vmimage = @{
    PublisherName = 'Canonical'
    Offer = '0001-com-ubuntu-server-jammy'
    Skus = '22_04-lts-gen2'
    Version = 'latest'     
}
$vmConfig = New-AzVMConfig @vmsz `
    | Set-AzVMOperatingSystem @vmos -Linux `
    | Set-AzVMSourceImage @vmimage `
    | Add-AzVMNetworkInterface -Id $nicVM.Id

## Create the virtual machine ##
$vm = @{
    ResourceGroupName = 'test-rg'
    Location = 'eastus'
    VM = $vmConfig
    SshKeyName = 'ssh-key'
}
New-AzVM @vm -GenerateSshKey
```

### [CLI](#tab/cli)

Create a network interface for the virtual machine by using [`az network nic create`](/cli/azure/network/nic#az-network-nic-create). Create the virtual machine by using [`az vm create`](/cli/azure/vm#az-vm-create).

```azurecli-interactive
## Create a network interface for the virtual machine ##
az network nic create \
    --resource-group test-rg \
    --name nic-1 \
    --vnet-name vnet-1 \
    --subnet subnet-1

## Create the virtual machine ##
az vm create \
    --resource-group test-rg \
    --name vm-1 \
    --location eastus \
    --nics nic-1 \
    --image Canonical:0001-com-ubuntu-server-jammy:22_04-lts-gen2:latest \
    --size Standard_DS1_v2 \
    --admin-username azureuser \
    --generate-ssh-keys \
    --public-ip-address ""
```

---

Wait for the virtual machine creation to finish before you move on to the next section.

> [!IMPORTANT]
> Ensure that you download the SSH private key to the virtual machine. You need the private key to sign in to the virtual machine through Azure Bastion.

## Test the NAT gateway

To test the NAT gateway, you first discover the public IP of the NAT gateway. You then connect to the test virtual machine and verify the outbound connection through the NAT gateway's public IP.

1. In the search box at the top of the portal, enter **NAT gateway**. Select **NAT gateways** in the search results.

1. Select **nat-gateway**.

1. Expand **Settings**, and then select **Outbound IP**.

1. Make note of the outbound IP address. Individual public IPs and public IP prefixes configured for the NAT gateway appear here.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **vm-1**.

1. On the **Overview** page, select **Connect**, and then select **Connect via Bastion**.

1. In the **Authentication** list, select **SSH Private Key From Local File**.

1. In **Username**, enter the username that you entered during virtual machine creation.

1. In **Local File**, select the SSH private key file that you downloaded earlier.

1. Select **Connect**.

1. In the Bash prompt, enter the following command:

    ```bash
    curl ifconfig.me
    ```

1. Verify that the IP address returned by the command matches the public IP address of the NAT gateway that you noted earlier.

    ```output
    azureuser@vm-1:~$ curl ifconfig.me
    203.0.113.0.25
    ```

## Clean up resources

### [Portal](#tab/portal)

[!INCLUDE [portal-clean-up.md](~/reusable-content/ce-skilling/azure/includes/portal-clean-up.md)]

### [PowerShell](#tab/powershell)

If you no longer need this application, delete the virtual network, virtual machine, and NAT gateway by using the following command:

```azurepowershell-interactive
Remove-AzResourceGroup -Name 'test-rg' -Force
```

### [CLI](#tab/cli)

If you no longer need this application, delete the virtual network, virtual machine, and NAT gateway by using the following command:

```azurecli-interactive
az group delete \
    --name test-rg \
    --yes \
    --no-wait
```

---

## Related content

- [Azure NAT Gateway overview](nat-overview.md)
- [NAT gateway resource](nat-gateway-resource.md)
