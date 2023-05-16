---
title: 'Deploy Bastion:PowerShell'
titleSuffix: Azure Bastion
description: Learn how to deploy Azure Bastion using PowerShell.
author: cherylmc
ms.service: bastion
ms.topic: how-to
ms.date: 03/14/2022
ms.author: cherylmc
ms.custom: ignite-fall-2021, devx-track-azurepowershell
# Customer intent: As someone with a networking background, I want to deploy Bastion and connect to a VM.
---

# Deploy Bastion using Azure PowerShell

This article shows you how to deploy Azure Bastion with the Standard SKU using PowerShell. Azure Bastion is a PaaS service that's maintained for you, not a bastion host that you install on your VM and maintain yourself. An Azure Bastion deployment is per virtual network, not per subscription/account or virtual machine. For more information about Azure Bastion, see [What is Azure Bastion?](bastion-overview.md)

Once you deploy Bastion to your virtual network, you can connect to your VMs via private IP address. This seamless RDP/SSH experience is available to all the VMs in the same virtual network. If your VM has a public IP address that you don't need for anything else, you can remove it.

You can also deploy Bastion by using the following other  methods:

* [Azure portal](./tutorial-create-host-portal.md)
* [Azure CLI](create-host-cli.md)
* [Quickstart - deploy with default settings](quickstart-host-portal.md)

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

> [!NOTE]
> The use of Azure Bastion with Azure Private DNS Zones is not supported at this time. Before you begin, please make sure that the virtual network where you plan to deploy your Bastion resource is not linked to a private DNS zone.
>

## Prerequisites

The following prerequisites are required.

### Azure PowerShell

[!INCLUDE [PowerShell](../../includes/vpn-gateway-cloud-shell-powershell-about.md)]

### <a name="values"></a>Example values

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

1. Create an Azure resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup). A resource group is a logical container into which Azure resources are deployed and managed. If you're running PowerShell locally, open your PowerShell console with elevated privileges and connect to Azure using the `Connect-AzAccount` command.

   ```azurepowershell-interactive
      New-AzResourceGroup -Name TestRG1 -Location EastUS
   ```

1. Create a virtual network.

   ```azurepowershell-interactive
      $virtualNetwork = New-AzVirtualNetwork `
      -ResourceGroupName TestRG1 `
      -Location EastUS `
      -Name VNet1 `
      -AddressPrefix 10.1.0.0/16
   ```

1. Set the configuration for the virtual network.

   ```azurepowershell-interactive
      $virtualNetwork | Set-AzVirtualNetwork
   ```

1. Configure and set a subnet for your virtual network. This will be the subnet to which you'll deploy a VM. The variable used for *-VirtualNetwork* was set in the previous steps.

   ```azurepowershell-interactive
      $subnetConfig = Add-AzVirtualNetworkSubnetConfig `
      -Name 'FrontEnd' `
      -AddressPrefix 10.1.0.0/24 `
      -VirtualNetwork $virtualNetwork
   ```

   ```azurepowershell-interactive
      $virtualNetwork | Set-AzVirtualNetwork
   ```

1. Configure and set the Azure Bastion subnet for your virtual network. This subnet is reserved exclusively for Azure Bastion resources. You must create the Azure Bastion subnet using the name value **AzureBastionSubnet**. This value lets Azure know which subnet to deploy the Bastion resources to. The example below also helps you add an Azure Bastion subnet to an existing VNet.

   [!INCLUDE [Important about BastionSubnet size.](../../includes/bastion-subnet-size.md)]

   Declare the variable.

   ```azurepowershell-interactive
      $virtualNetwork = Get-AzVirtualNetwork -Name "VNet1" `
      -ResourceGroupName "TestRG1"
   ```

   Add the configuration.

   ```azurepowershell-interactive
      Add-AzVirtualNetworkSubnetConfig -Name "AzureBastionSubnet" `
      -VirtualNetwork $virtualNetwork -AddressPrefix "10.1.1.0/26" ` 
   ```

   Set the configuration.

   ```azurepowershell-interactive
      $virtualNetwork | Set-AzVirtualNetwork
   ```

1. Create a public IP address for Azure Bastion. The public IP is the public IP address the Bastion resource on which RDP/SSH will be accessed (over port 443). The public IP address must be in the same region as the Bastion resource you're creating.

   ```azurepowershell-interactive
      $publicip = New-AzPublicIpAddress -ResourceGroupName "TestRG1" -name "VNet1-ip" -location "EastUS" -AllocationMethod Static -Sku Standard
   ```

1. Create a new Azure Bastion resource in the AzureBastionSubnet using the [New-AzBastion](/powershell/module/az.network/new-azbastion) command. The following example uses the **Standard SKU**. The Standard SKU lets you configure more Bastion features and connect to VMs using more connection types. For more information, see [Bastion SKUs](configuration-settings.md#skus). If you want to deploy using the Basic SKU, change the -Sku value to "Basic".

   ```azurepowershell-interactive
      New-AzBastion -ResourceGroupName "TestRG1" -Name "VNet1-bastion" `
      -PublicIpAddressRgName "TestRG1" -PublicIpAddressName "VNet1-ip" `
      -VirtualNetworkRgName "TestRG1" -VirtualNetworkName "VNet1" `
      -Sku "Standard"
   ```

1. It takes about 10 minutes for the Bastion resources to deploy. You can create a VM in the next section while Bastion deploys to your virtual network.

## <a name="create-vm"></a>Create a VM

You can create a VM using the [Quickstart: Create a VM using PowerShell](../virtual-machines/windows/quick-create-powershell.md) or  [Quickstart: Create a VM using the portal](../virtual-machines/windows/quick-create-portal.md) articles. Be sure you deploy the VM to the virtual network to which you deployed Bastion. The VM you create in this section isn't a part of the Bastion configuration and doesn't become a bastion host. You connect to this VM later in this tutorial via Bastion.

The following required roles for your resources.

* Required VM roles:

  * Reader role on the virtual machine.
  * Reader role on the NIC with private IP of the virtual machine.

* Required inbound ports:

  * For Windows VMS - RDP (3389)
  * For Linux VMs - SSH (22)

## <a name="connect"></a>Connect to a VM

You can use the [Connection steps](#steps) in the section below to connect to your VM. You can also use any of the following articles to connect to a VM. Some connection types require the Bastion [Standard SKU](configuration-settings.md#skus).

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
