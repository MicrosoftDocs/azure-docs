---
title: Create a virtual network with encryption - Azure PowerShell
titleSuffix: Azure Virtual Network
description: In this how-to, learn how to create an encrypted virtual network using Azure PowerShell. A virtual network lets Azure resources communicate with each other and with the internet. 
author: asudbring
ms.service: virtual-network
ms.topic: how-to
ms.date: 05/24/2023
ms.author: allensu

---

# Create a virtual network with encryption using Azure PowerShell

Azure Virtual Network encryption is a feature of Azure Virtual Network. Virtual network encryption allows you to seamlessly encrypt and decrypt internal network traffic over the wire, with minimal effect to performance and scale. Azure Virtual Network encryption protects data traversing your virtual network virtual machine to virtual machine and virtual machine to on-premises.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Azure PowerShell installed locally or Azure Cloud Shell.

- Sign in to Azure PowerShell and ensure you've selected the subscription with which you want to use this feature.  For more information, see [Sign in with Azure PowerShell](/powershell/azure/authenticate-azureps).

- Ensure your Az. Network module is 4.3.0 or later. To verify the installed module, use the command Get-InstalledModule -Name "Az.Network". If the module requires an update, use the command Update-Module -Name "Az. Network" if necessary.

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-Az-ps). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

## Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) named **myResourceGroup** in the **eastus2** location.

```azurepowershell-interactive
$rg =@{
    Name = 'myResourceGroup'
    Location = 'eastus2'
}
New-AzResourceGroup @rg
```

## Create a virtual network

In this section, you'll create a virtual network and enable virtual network encryption.

There are two options for the parameter **`-EncryptionEnforcementPolicy`**:

- **DropUnencrypted** - In this scenario, network traffic that isn’t encrypted by the underlying hardware will be **dropped**. The traffic drop happens if a virtual machine, such as an A-series or B-series, or an older D-series such as Dv2, is in the virtual network.

- **AllowUnencrypted** - In this scenario, network traffic that isn’t encrypted by the underlying hardware will be allowed. This scenario allows incompatible virtual machine sizes to communicate with compatible virtual machine sizes.

Use [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork) and [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig) to create a virtual network.

```azurepowershell-interactive
## Create backend subnet config ##
$subnet = @{
    Name = 'myBackendSubnet'
    AddressPrefix = '10.0.0.0/24'
}
$subnetConfig = New-AzVirtualNetworkSubnetConfig @subnet 

## Create the virtual network ##
$net = @{
    Name = 'myVNet'
    ResourceGroupName = 'myResourceGroup'
    Location = 'eastus2'
    AddressPrefix = '10.0.0.0/16'
    Subnet = $subnetConfig
    EnableEncryption = 'true'
    EncryptionEnforcementPolicy = 'dropUnencrypted'
    
}
New-AzVirtualNetwork @net

```

> [!IMPORTANT]
> Azure Virtual Network encryption requires supported virtual machine SKUs in the virtual network for traffic to be encrypted. The setting **dropUnencrypted** will drop traffic between unsupported virtual machine SKUs if they are deployed in the virtual network. For more information, see [Azure Virtual Network encryption requirements](virtual-network-encryption-overview.md#requirements).

## Verify encryption enabled

You can check the encryption parameter in the virtual network to verify that encryption is enabled on the virtual network.

Use [Get-AzVirtualNetwork](/powershell/module/az.network/get-azvirtualnetwork) to view the encryption parameter for the virtual network you created previously.

```azurepowershell-interactive
## Place the virtual network configuration into a variable. ##
$net = @{
    Name = 'myVNet'
    ResourceGroupName = 'myResourceGroup'
}
$vnet = Get-AzVirtualNetwork @net
```

To view the parameter for encryption, enter the following information.

```azurepowershell-interactive
$vnet.Encryption

Enabled Enforcement
------- -----------
false   allowUnencrypted
```

## Next steps

- For more information about Azure Virtual Networks, see [What is Azure Virtual Network?](/azure/virtual-network/virtual-networks-overview).

- For more information about Azure Virtual Network encryption, see [What is Azure Virtual Network encryption?](virtual-network-encryption-overview.md).