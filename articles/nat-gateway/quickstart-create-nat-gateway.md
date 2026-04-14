---
title: Create an Azure NAT Gateway
titlesuffix: Azure NAT Gateway
description: This quickstart shows how to create a NAT gateway by using the Azure portal.
author: asudbring
ms.author: allensu
ms.service: azure-nat-gateway
ms.topic: quickstart 
ms.date: 04/30/2025
ms.custom: template-quickstart, FY23 content-maintenance, linux-related-content
# Customer intent: As a cloud engineer, I want to create a NAT gateway using various deployment methods, so that I can facilitate outbound internet connectivity for virtual machines in Azure.
---

# Quickstart: Create a NAT gateway

In this quickstart, learn how to create a NAT gateway by using the Azure portal, Azure PowerShell, or Azure CLI. The NAT Gateway service provides scalable outbound connectivity for virtual machines in Azure.

:::image type="content" source="./media/quickstart-create-nat-gateway-portal/nat-gateway-qs-resources.png" alt-text="Diagram of resources created in nat gateway quickstart." lightbox="./media/quickstart-create-nat-gateway-portal/nat-gateway-qs-resources.png":::

## Prerequisites

### [Portal](#tab/portal)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

### [PowerShell](#tab/powershell)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- Azure Cloud Shell or Azure PowerShell.

  The steps in this quickstart run the Azure PowerShell cmdlets interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloudshell** at the upper-right corner of a code block. Select **Copy** to copy the code and then paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

  You can also [install Azure PowerShell locally](/powershell/azure/install-azure-powershell) to run the cmdlets. The steps in this article require Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find your installed version. If you need to upgrade, see [Update the Azure PowerShell module](/powershell/azure/install-Az-ps#update-the-azure-powershell-module).

### [CLI](#tab/cli)

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]


---

## Create a resource group

### [Portal](#tab/portal)

1. In the search box at the top of the portal, enter **Resource groups**. Select **Resource groups** in the search results.

1. Select **+ Create**.

1. In **Create a resource group**, enter or select the following values:

    | Setting | Value |
    | --- | --- |
    | **Project Details** |  |
    | Subscription | Select your Azure subscription. |
    | Resource group | Enter **test-rg**. |
    | **Resource details** |  |
    | Region | Select **(US) East US 2**. |

1. Select **Review + create**.

1. Select **Create**.


### [PowerShell](#tab/powershell)

Create a resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup). An Azure resource group is a logical container into which Azure resources are deployed and managed.

The following example creates a resource group named **test-rg** in the **eastus2** location:

```azurepowershell-interactive
$rsg = @{
    Name = 'test-rg'
    Location = 'eastus2'
}
New-AzResourceGroup @rsg
```


### [CLI](#tab/cli)

Create a resource group with [az group create](/cli/azure/group#az-group-create). An Azure resource group is a logical container into which Azure resources are deployed and managed.

```azurecli-interactive
az group create \
    --name test-rg \
    --location eastus2
```


---

## Create a virtual network

### [Portal](#tab/portal)

The following procedure creates a virtual network with a resource subnet.

1. In the portal, search for and select **Virtual networks**.

1. On the **Virtual networks** page, select **+ Create**.

1. On the **Basics** tab of **Create virtual network**, enter or select the following information:

    | Setting | Value |
    | --- | --- |
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |  |
    | Name | Enter **vnet-1**. |
    | Region | Select **(US) East US 2**. |

1. Select **Next** to proceed to the **Security** tab.

1. Select **Next** to proceed to the **IP Addresses** tab.

1. In the address space box in **Subnets**, select the **default** subnet.

1. In **Edit subnet**, enter or select the following information:

    | Setting | Value |
    | --- | --- |
    | Subnet purpose | Leave the default **Default**. |
    | Name | Enter **subnet-1**. |
    | **IPv4** |  |
    | IPv4 address range | Leave the default of **10.0.0.0/16**. |
    | Starting address | Leave the default of **10.0.0.0**. |
    | Size | Leave the default of **/24 (256 addresses)**. |

1. Select **Save**.

1. Select **Review + create** at the bottom of the screen, and when validation passes, select **Create**.

### [PowerShell](#tab/powershell)

Create a subnet configuration for the virtual machine subnet and a Bastion host subnet using [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig).

```azurepowershell-interactive
$subnet = @{
    Name = 'subnet-1'
    AddressPrefix = '10.0.0.0/24'
}
$subnetConfig = New-AzVirtualNetworkSubnetConfig @subnet

$bastsubnet = @{
    Name = 'AzureBastionSubnet'
    AddressPrefix = '10.0.1.0/26'
}
$bastsubnetConfig = New-AzVirtualNetworkSubnetConfig @bastsubnet
```

Create a virtual network with [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork).

```azurepowershell-interactive
$net = @{
    Name = 'vnet-1'
    ResourceGroupName = 'test-rg'
    Location = 'eastus2'
    AddressPrefix = '10.0.0.0/16'
    Subnet = $subnetConfig, $bastsubnetConfig
}
$vnet = New-AzVirtualNetwork @net
```

### [CLI](#tab/cli)

Create a virtual network named **vnet-1** with a subnet named **subnet-1** using [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create).

```azurecli-interactive
az network vnet create \
    --resource-group test-rg \
    --name vnet-1 \
    --address-prefix 10.0.0.0/16 \
    --subnet-name subnet-1 \
    --subnet-prefixes 10.0.0.0/24
```

Create an Azure Bastion subnet named **AzureBastionSubnet** using [az network vnet subnet create](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-create).

```azurecli-interactive
az network vnet subnet create \
    --name AzureBastionSubnet \
    --resource-group test-rg \
    --vnet-name vnet-1 \
    --address-prefix 10.0.1.0/26
```

---

## Deploy Azure Bastion

### [Portal](#tab/portal)

Azure Bastion uses your browser to connect to VMs in your virtual network over Secure Shell (SSH) or Remote Desktop Protocol (RDP) by using their private IP addresses. The VMs don't need public IP addresses, client software, or special configuration. For more information, see [What is Azure Bastion?](../bastion/bastion-overview.md).

> [!NOTE]
> [!INCLUDE [Pricing](~/reusable-content/ce-skilling/azure/includes/bastion-pricing.md)]

1. In the search box at the top of the portal, enter **Bastion**. Select **Bastions** in the search results.

1. Select **+ Create**.

1. In the **Basics** tab of **Create a Bastion**, enter or select the following information:

    | Setting | Value |
    | --- | --- |
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |  |
    | Name | Enter **bastion**. |
    | Region | Select **(US) East US 2**. |
    | Tier | Select **Developer**. |
    | **Configure virtual networks** |  |
    | Virtual network | Select **vnet-1**. |

    > [!NOTE]
    > The Developer SKU for Azure Bastion is free and doesn't require a dedicated **AzureBastionSubnet**. For more information, see [Quickstart: Deploy Azure Bastion - Developer SKU](../bastion/quickstart-developer-sku.md).

1. Select **Review + create**.

1. Select **Create**.

### [PowerShell](#tab/powershell)

Create a public IP address for the Azure Bastion host with [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress).

```azurepowershell-interactive
$ip = @{
    Name = 'public-ip'
    ResourceGroupName = 'test-rg'
    Location = 'eastus2'
    Sku = 'Standard'
    AllocationMethod = 'Static'
    Zone = 1, 2, 3
}
$publicip = New-AzPublicIpAddress @ip
```

Create an Azure Bastion host with [New-AzBastion](/powershell/module/az.network/new-azbastion).

```azurepowershell-interactive
$bastion = @{
    Name = 'bastion'
    ResourceGroupName = 'test-rg'
    PublicIpAddressRgName = 'test-rg'
    PublicIpAddressName = 'public-ip'
    VirtualNetworkRgName = 'test-rg'
    VirtualNetworkName = 'vnet-1'
    Sku = 'Basic'
}
New-AzBastion @bastion -AsJob
```

The bastion host can take several minutes to deploy.

### [CLI](#tab/cli)

Create a public IP address for the Azure Bastion host using [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create).

```azurecli-interactive
az network public-ip create \
    --resource-group test-rg \
    --name public-ip \
    --sku Standard \
    --location eastus2 \
    --zone 1 2 3
```

Create the Azure Bastion host using [az network bastion create](/cli/azure/network/bastion#az-network-bastion-create).

```azurecli-interactive
az network bastion create \
    --name bastion \
    --public-ip-address public-ip \
    --resource-group test-rg \
    --vnet-name vnet-1 \
    --location eastus2 \
    --sku Basic \
    --no-wait
```

The Bastion host can take several minutes to deploy.

---

## Create a virtual machine

### [Portal](#tab/portal)

The following procedure creates a Linux virtual machine with SSH key authentication.

1. In the search box at the top of the portal, enter **Virtual machines**. Select **Virtual machines** in the search results.

1. Select **+ Create** and then select **Azure virtual machine**.

1. In the **Basics** tab of **Create a virtual machine**, enter or select the following values:

    | Setting | Value |
    | --- | --- |
    | **Project Details** |  |
    | Subscription | Select your Azure subscription. |
    | Resource Group | Select **test-rg**. |
    | **Instance details** |  |
    | Virtual machine name | Enter **vm-1**. |
    | Region | Select **(US) East US 2**. |
    | Availability Options | Select **No infrastructure redundancy required**. |
    | Security type | Select **Standard**. |
    | Image | Select **Ubuntu Server 24.04 LTS - x64 Gen2**. |
    | Size | Choose a size or leave the default setting. |
    | **Administrator account** |  |
    | Authentication type | Select **SSH public key**. |
    | Username | Enter **azureuser**. |
    | SSH public key source | Select **Generate new key pair**. |
    | Key pair name | Enter **vm-1_key**. |

1. Select the **Networking** tab, or select **Next: Disks**, then **Next: Networking**.

1. In the Networking tab, select the following values:

    | Setting | Value |
    | --- | --- |
    | **Network interface** |  |
    | Virtual network | Select **vnet-1**. |
    | Subnet | Select **subnet-1**. |
    | Public IP | Select **None**. |

1. Select **Review + create**.

1. Review the settings, and then select **Create**.

1. When the **Generate new key pair** window opens, select **Download private key and create resource**. The key file downloads as **vm-1_key.pem**. Make sure you know where the `.pem` file was downloaded. You need the path to the key file to connect to the VM.


### [PowerShell](#tab/powershell)

In this section, you create a virtual machine to test the NAT gateway and verify the public IP address of the outbound connection.

Create a virtual machine with [New-AzVM](/powershell/module/az.compute/new-azvm). An SSH key pair is generated during VM creation.

```azurepowershell-interactive
$securePassword = ConvertTo-SecureString ' ' -AsPlainText -Force
$cred = New-Object System.Management.Automation.PSCredential ('azureuser', $securePassword)

$vm = @{
    ResourceGroupName = 'test-rg'
    Location = 'eastus2'
    Name = 'vm-1'
    Image = 'Ubuntu2204'
    Size = 'Standard_DS1_v2'
    VirtualNetworkName = 'vnet-1'
    SubnetName = 'subnet-1'
    PublicIpAddressName = ''
    GenerateSshKey = $true
    SshKeyName = 'vm-1_key'
    Credential = $cred
}
New-AzVM @vm
```

Wait for the virtual machine creation to complete before moving on to the next section.


### [CLI](#tab/cli)

Create a Linux virtual machine named **vm-1** with SSH key authentication using [az vm create](/cli/azure/vm#az-vm-create).

```azurecli-interactive
az vm create \
    --resource-group test-rg \
    --name vm-1 \
    --image Ubuntu2404 \
    --admin-username azureuser \
    --generate-ssh-keys \
    --public-ip-address "" \
    --subnet subnet-1 \
    --vnet-name vnet-1
```

Wait for the virtual machine creation to complete before moving on to the next section.


---

## Create the NAT gateway

### [Portal](#tab/portal)

In this section, you create the NAT gateway resource and associate it with the subnet of the virtual network you created.

1. In the search box at the top of the portal, enter **NAT gateway**. Select **NAT gateways** in the search results.

1. Select **+ Create**.

1. In **Create network address translation (NAT) gateway**, enter or select this information in the **Basics** tab:

    | Setting | Value |
    | --- | --- |
    | **Project Details** |  |
    | Subscription | Select your Azure subscription. |
    | Resource Group | Select **test-rg**. |
    | **Instance details** |  |
    | NAT gateway name | Enter **nat-gateway**. |
    | Region | Select **(US) East US 2**. |
    | SKU | Select **Standard**. |
    | Availability zone | Select **No Zone**. |
    | TCP idle timeout (minutes) | Leave the default of **4**. |

    For information about availability zones and NAT gateway, see [Reliability in Azure NAT Gateway](/azure/reliability/reliability-nat-gateway).

1. Select the **Outbound IP** tab, or select **Next: Outbound IP**.

1. In the **Outbound IP** tab, enter or select the following information:

    | Setting | Value |
    | --- | --- |
    | Public IP addresses | Select **Create a new public IP address**. </br> In **Name**, enter **public-ip-nat**. </br> Select **OK**. |

1. Select the **Networking** tab, or select **Next: Networking**.

1. In **Virtual network**, select **vnet-1**.

1. In **Subnet name**, select the checkbox next to **subnet-1**.

1. Select the **Review + create** tab, or select the **Review + create** button at the bottom of the page.

1. Select **Create**.


### [PowerShell](#tab/powershell)

In this section, you create the NAT gateway resource and associate it with the subnet of the virtual network.

Create a public IP address for the NAT gateway with [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress).

```azurepowershell-interactive
$ip = @{
    Name = 'public-ip-nat'
    ResourceGroupName = 'test-rg'
    Location = 'eastus2'
    Sku = 'Standard'
    AllocationMethod = 'Static'
    Zone = 1, 2, 3
}
$publicIP = New-AzPublicIpAddress @ip
```

Create a NAT gateway resource with [New-AzNatGateway](/powershell/module/az.network/new-aznatgateway).

```azurepowershell-interactive
$nat = @{
    ResourceGroupName = 'test-rg'
    Name = 'nat-gateway'
    IdleTimeoutInMinutes = '10'
    Sku = 'Standard'
    Location = 'eastus2'
    PublicIpAddress = $publicIP
}
$natGateway = New-AzNatGateway @nat
```

Associate the NAT gateway to **subnet-1** with [Set-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/set-azvirtualnetworksubnetconfig) and apply the configuration with [Set-AzVirtualNetwork](/powershell/module/az.network/set-azvirtualnetwork).

```azurepowershell-interactive
$vnet = Get-AzVirtualNetwork -Name 'vnet-1' -ResourceGroupName 'test-rg'

$subnet = @{
    VirtualNetwork = $vnet
    Name = 'subnet-1'
    AddressPrefix = '10.0.0.0/24'
    NatGateway = $natGateway
}
Set-AzVirtualNetworkSubnetConfig @subnet

$vnet | Set-AzVirtualNetwork
```


### [CLI](#tab/cli)

In this section, you create the NAT gateway resource and associate it with the subnet of the virtual network.

Create a public IP address for the NAT gateway using [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create).

```azurecli-interactive
az network public-ip create \
    --resource-group test-rg \
    --name public-ip-nat \
    --sku Standard \
    --allocation-method Static \
    --location eastus2 \
    --zone 1 2 3
```

Create a NAT gateway resource using [az network nat gateway create](/cli/azure/network/nat#az-network-nat-gateway-create).

```azurecli-interactive
az network nat gateway create \
    --resource-group test-rg \
    --name nat-gateway \
    --public-ip-addresses public-ip-nat \
    --idle-timeout 10
```

Associate the NAT gateway to **subnet-1** using [az network vnet subnet update](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-update).

```azurecli-interactive
az network vnet subnet update \
    --resource-group test-rg \
    --vnet-name vnet-1 \
    --name subnet-1 \
    --nat-gateway nat-gateway
```


---

## Test NAT gateway

In this section, you test the NAT gateway. You first discover the public IP of the NAT gateway. You then connect to the test virtual machine and verify the outbound connection through the NAT gateway public IP.
    
1. In the search box at the top of the portal, enter **Public IP**. Select **Public IP addresses** in the search results.

1. Select **public-ip-nat**.

1. Make note of the public IP address:

    :::image type="content" source="./media/quickstart-create-nat-gateway-portal/find-public-ip.png" alt-text="Discover public IP address of NAT gateway" border="true":::

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **vm-1**.

1. On the **Overview** page, select **Connect**, then select the **Bastion** tab.

1. Select **Use Bastion**.

1. Under **Authentication Type**, select **SSH Private Key from Local File**.

1. In **Username**, enter **azureuser**.

1. Select **Browse** and navigate to the **vm-1_key.pem** file downloaded during VM creation.

1. Select **Connect**.

1. In the bash prompt, enter the following command:

    ```bash
    curl ifconfig.me
    ```

1. Verify the IP address returned by the command matches the public IP address of the NAT gateway.

    ```output
    azureuser@vm-1:~$ curl ifconfig.me
    203.0.113.0.25
    ```

## Clean up resources

### [Portal](#tab/portal)

[!INCLUDE [portal-clean-up.md](~/reusable-content/ce-skilling/azure/includes/portal-clean-up.md)]

### [PowerShell](#tab/powershell)

If you're not going to continue to use this application, delete the virtual network, virtual machine, and NAT gateway with the following command:

```azurepowershell-interactive
Remove-AzResourceGroup -Name 'test-rg' -Force
```

### [CLI](#tab/cli)

If you're not going to continue to use this application, delete the virtual network, virtual machine, and NAT gateway with the following command:

```azurecli-interactive
az group delete \
    --name test-rg \
    --yes
```


---

## Next steps

For more information on Azure NAT Gateway, see:
> [!div class="nextstepaction"]
> [Azure NAT Gateway overview](nat-overview.md)
> [Azure NAT Gateway resource](nat-gateway-resource.md)
