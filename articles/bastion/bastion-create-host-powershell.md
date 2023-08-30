---
title: 'Deploy Bastion:PowerShell'
titleSuffix: Azure Bastion
description: Learn how to deploy Azure Bastion using PowerShell.
author: cherylmc
ms.service: bastion
ms.topic: how-to
ms.date: 06/08/2023
ms.author: cherylmc
ms.custom: ignite-fall-2021, devx-track-azurepowershell
# Customer intent: As someone with a networking background, I want to deploy Bastion and connect to a VM.
---

# Deploy Bastion using Azure PowerShell

This article shows you how to deploy Azure Bastion with the Standard SKU using PowerShell. Azure Bastion is a PaaS service that's maintained for you, not a bastion host that you install on your VM and maintain yourself. An Azure Bastion deployment is per virtual network, not per subscription/account or virtual machine. For more information about Azure Bastion, see [What is Azure Bastion?](bastion-overview.md)

Once you deploy Bastion to your virtual network, you can connect to your VMs via private IP address. This seamless RDP/SSH experience is available to all the VMs in the same virtual network. If your VM has a public IP address that you don't need for anything else, you can remove it.

:::image type="content" source="./media/create-host/host-architecture.png" alt-text="Diagram showing Azure Bastion architecture." lightbox="./media/create-host/host-architecture.png":::

In this article, you create a virtual network (if you don't already have one), deploy Azure Bastion using PowerShell, and connect to a VM. You can also deploy Bastion by using the following other methods:

* [Azure portal](./tutorial-create-host-portal.md)
* [Azure CLI](create-host-cli.md)
* [Quickstart - deploy with default settings](quickstart-host-portal.md)

[!INCLUDE [DNS private zone](../../includes/bastion-private-dns-zones-non-support.md)]

## Before beginning

Verify that you have an Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details) or sign up for a [free account](https://azure.microsoft.com/pricing/free-trial).


### PowerShell

[!INCLUDE [cloudshell powershell](../../includes/vpn-gateway-cloud-shell-powershell.md)]

[!INCLUDE [powershell locally](../../includes/vpn-gateway-powershell-locally.md)]

### Example values

You can use the following example values when creating this configuration, or you can substitute your own.

**Basic VNet and VM values:**

|**Name** | **Value** |
| --- | --- |
| Virtual machine| TestVM |
| Resource group | TestRG1 |
| Region | East US |
| Virtual network | VNet1 |
| Address space | 10.1.0.0/16 |
| Subnets | FrontEnd: 10.1.0.0/24 |

**Azure Bastion values:**

|**Name** | **Value** |
| --- | --- |
| Name | VNet1-bastion |
| Subnet Name | FrontEnd |
| Subnet Name | AzureBastionSubnet|
| AzureBastionSubnet addresses | A subnet within your VNet address space with a subnet mask /26 or larger.<br> For example, 10.1.1.0/26.  |
| Tier/SKU | Standard |
| Public IP address |  Create new |
| Public IP address name | VNet1-ip  |
| Public IP address SKU |  Standard  |
| Assignment  | Static |

## Deploy Bastion

This section helps you create a virtual network, subnets, and deploy Azure Bastion using Azure PowerShell.

> [!IMPORTANT]
> [!INCLUDE [Pricing](../../includes/bastion-pricing.md)]
>

1. Create a resource group, a virtual network, and a front end subnet to which you'll deploy the VMs that you'll connect to via Bastion. If you're running PowerShell locally, open your PowerShell console with elevated privileges and connect to Azure using the `Connect-AzAccount` command.

   ```azurepowershell-interactive
   New-AzResourceGroup -Name TestRG1 -Location EastUS ` 
   $frontendSubnet = New-AzVirtualNetworkSubnetConfig -Name FrontEnd `
   -AddressPrefix "10.1.0.0/24" ` 
   $virtualNetwork = New-AzVirtualNetwork `
   -Name TestVNet1 -ResourceGroupName TestRG1 `
   -Location EastUS -AddressPrefix "10.1.0.0/16" `
   -Subnet $frontendSubnet ` 
   $virtualNetwork | Set-AzVirtualNetwork
   ```

1. Configure and set the Azure Bastion subnet for your virtual network. This subnet is reserved exclusively for Azure Bastion resources. You must create this subnet using the name value **AzureBastionSubnet**. This value lets Azure know which subnet to deploy the Bastion resources to. The example in the following section helps you add an Azure Bastion subnet to an existing VNet.

   [!INCLUDE [Important about BastionSubnet size.](../../includes/bastion-subnet-size.md)]

   Set the variable.

   ```azurepowershell-interactive
   $vnet = Get-AzVirtualNetwork -Name "TestVNet1" -ResourceGroupName "TestRG1"
   ```

   Add the subnet. 

   ```azurepowershell-interactive
   Add-AzVirtualNetworkSubnetConfig `
   -Name "AzureBastionSubnet" -VirtualNetwork $vnet `
   -AddressPrefix "10.1.1.0/26" | Set-AzVirtualNetwork
   ```

1. Create a public IP address for Azure Bastion. The public IP is the public IP address of the Bastion resource on which RDP/SSH will be accessed (over port 443). The public IP address must be in the same region as the Bastion resource you're creating.

   ```azurepowershell-interactive
   $publicip = New-AzPublicIpAddress -ResourceGroupName "TestRG1" `
   -name "VNet1-ip" -location "EastUS" `
   -AllocationMethod Static -Sku Standard
   ```

1. Create a new Azure Bastion resource in the AzureBastionSubnet using the [New-AzBastion](/powershell/module/az.network/new-azbastion) command. The following example uses the **Basic SKU**. However, you can also deploy Bastion using the Standard SKU by changing the -Sku value to "Standard". The Standard SKU lets you configure more Bastion features and connect to VMs using more connection types. For more information, see [Bastion SKUs](configuration-settings.md#skus).

   ```azurepowershell-interactive
   New-AzBastion -ResourceGroupName "TestRG1" -Name "VNet1-bastion" `
   -PublicIpAddressRgName "TestRG1" -PublicIpAddressName "VNet1-ip" `
   -VirtualNetworkRgName "TestRG1" -VirtualNetworkName "TestVNet1" `
   -Sku "Basic"
   ```

1. It takes about 10 minutes for the Bastion resources to deploy. You can create a VM in the next section while Bastion deploys to your virtual network.

## <a name="create-vm"></a>Create a VM

You can create a VM using the [Quickstart: Create a VM using PowerShell](../virtual-machines/windows/quick-create-powershell.md) or [Quickstart: Create a VM using the portal](../virtual-machines/windows/quick-create-portal.md) articles. Be sure you deploy the VM to the same virtual network to which you deployed Bastion. The VM you create in this section isn't a part of the Bastion configuration and doesn't become a bastion host. You connect to this VM later in this tutorial via Bastion.

The following required roles for your resources.

* Required VM roles:

  * Reader role on the virtual machine.
  * Reader role on the NIC with private IP of the virtual machine.

* Required inbound ports:

  * For Windows VMS - RDP (3389)
  * For Linux VMs - SSH (22)

## <a name="connect"></a>Connect to a VM

You can use the [Connection steps](#steps) in the following section to connect to your VM. You can also use any of the following articles to connect to a VM. Some connection types require the Bastion [Standard SKU](configuration-settings.md#skus).

[!INCLUDE [Links to Connect to VM articles](../../includes/bastion-vm-connect-article-list.md)]

### <a name="steps"></a>Connection steps

[!INCLUDE [Connection steps](../../includes/bastion-vm-connect.md)]

### <a name="audio"></a>To enable audio output

[!INCLUDE [Enable VM audio output](../../includes/bastion-vm-audio.md)]

## <a name="ip"></a>Remove VM public IP address

Azure Bastion doesn't use the public IP address to connect to the client VM. If you don't need the public IP address for your VM, you can disassociate the public IP address. See [Dissociate a public IP address from an Azure VM](../virtual-network/ip-services/remove-public-ip-address-vm.md).

## Next steps

* To use Network Security Groups with the Azure Bastion subnet, see [Work with NSGs](bastion-nsg.md).
* To understand VNet peering, see [VNet peering and Azure Bastion](vnet-peering.md).
