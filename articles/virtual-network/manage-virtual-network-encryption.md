---
title: Manage Azure Virtual Network encryption
description: Learn how to enable or disable virtual network encryption and change the encryption enforcement policy.
author: asudbring
ms.author: allensu
ms.service: virtual-network
ms.topic: how-to
ms.date: 05/24/2023
ms.custom: template-how-to
---

# Manage Azure Virtual Network encryption

Management of virtual network encryption consists of enabling or disabling encryption on an existing Azure Virtual Network. The encryption enforcement policy can also be set on an existing virtual network. To manage the options for virtual network encryptions, you can use the Azure CLI or Azure PowerShell.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An existing Azure Virtual Network. For information about creating an Azure Virtual Network, see [Quickstart: Create a virtual network using the Azure portal](/azure/virtual-network/quick-create-portal).
    
    - The example virtual network used in this article is named **myVNet**. Replace the example value with the name of your virtual network. 

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- This how-to article requires version 2.31.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

- Azure PowerShell installed locally or Azure Cloud Shell.

- Sign in to Azure PowerShell and ensure you've selected the subscription with which you want to use this feature.  For more information, see [Sign in with Azure PowerShell](/powershell/azure/authenticate-azureps).

- Ensure your `Az.Network` module is 4.3.0 or later. To verify the installed module, use the command Get-InstalledModule -Name `Az.Network`. If the module requires an update, use the command Update-Module -Name `Az.Network` if necessary.

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-Az-ps). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

## Enable encryption and set enforcement policy

Encryption and the enforcement policy can be set at the same time on an existing Azure Virtual Network.

> [!IMPORTANT]
> Azure Virtual Network encryption requires supported virtual machine SKUs in the virtual network for traffic to be encrypted. The setting **dropUnencrypted** will drop traffic between unsupported virtual machine SKUs if they are deployed in the virtual network. For more information, see [Azure Virtual Network encryption requirements](virtual-network-encryption-overview.md#requirements).

# [**PowerShell**](#tab/manage-encryption-powershell)

There are two options for the encryption enforcement policy parameter:

- **DropUnencrypted** - In this scenario, network traffic that isn’t encrypted by the underlying hardware is **dropped**. The traffic drop happens if a virtual machine, such as an A-series or B-series, or an older D-series such as Dv2, is in the virtual network.

- **AllowUnencrypted** - In this scenario, network traffic that isn’t encrypted by the underlying hardware is allowed. This scenario allows incompatible virtual machine sizes to communicate with compatible virtual machine sizes.

Use [Get-AzVirtualNetwork](/powershell/module/az.network/get-azvirtualnetwork) and [Set-AzVirtualNetwork](/powershell/module/az.network/set-azvirtualnetwork) to enable encryption for the virtual network and set the encryption enforcement policy.

```azurepowershell-interactive
## Place the virtual network configuration into a variable. ##
$net = @{
    Name = 'myVNet'
    ResourceGroupName = 'myResourceGroup'
}
$vnet = Get-AzVirtualNetwork @net

## Update the encryption and enforcement parameter and save the configuration. ##
$vnet.Encryption = @{
Enabled = "true"
Enforcement = "dropUnencrypted"
}
$vnet | Set-AzVirtualNetwork
```

# [**CLI**](#tab/manage-encryption-cli)

There are two options for the parameter **`--encryption-enforcement-policy`**:

- **DropUnencrypted** - In this scenario, network traffic that isn’t encrypted by the underlying hardware is **dropped**. The traffic drop happens if a virtual machine, such as an A-series or B-series, or an older D-series such as Dv2, is in the virtual network.

- **AllowUnencrypted** - In this scenario, network traffic that isn’t encrypted by the underlying hardware is allowed. This scenario allows incompatible virtual machine sizes to communicate with compatible virtual machine sizes.

Use [az network vnet update](/cli/azure/network/vnet#az-network-vnet-update) to enable encryption for the virtual network and set the encryption enforcement policy.

```azurecli-interactive
az network vnet update \
    --name myVNet \
    --resource-group myResourceGroup \
    --enable-encryption true \
    --encryption-enforcement-policy dropUnencrypted
```
---

## Enable encryption

In this section, you enable encryption with PowerShell and the Azure CLI.

> [!IMPORTANT]
> Azure Virtual Network encryption requires supported virtual machine SKUs in the virtual network for traffic to be encrypted. The setting **dropUnencrypted** will drop traffic between unsupported virtual machine SKUs if they are deployed in the virtual network. For more information, see [Azure Virtual Network encryption requirements](virtual-network-encryption-overview.md#requirements).

# [**PowerShell**](#tab/manage-encryption-powershell)

Use [Get-AzVirtualNetwork](/powershell/module/az.network/get-azvirtualnetwork) and [Set-AzVirtualNetwork](/powershell/module/az.network/set-azvirtualnetwork) to enable encryption for the virtual network.

```azurepowershell-interactive
## Place the virtual network configuration into a variable. ##
$net = @{
    Name = 'myVNet'
    ResourceGroupName = 'myResourceGroup'
}
$vnet = Get-AzVirtualNetwork @net

## Update the encryption parameter and save the configuration. ##
$vnet.Encryption = @{
Enabled = "true"
}
$vnet | Set-AzVirtualNetwork
```

# [**CLI**](#tab/manage-encryption-cli)

Use [az network vnet update](/cli/azure/network/vnet#az-network-vnet-update) to enable encryption for the virtual network.

```azurecli-interactive
az network vnet update \
    --name myVNet \
    --resource-group myResourceGroup \
    --enable-encryption true
```
---

## Disable encryption

In this section, you disable encryption with PowerShell and the Azure CLI.

# [**PowerShell**](#tab/manage-encryption-powershell)

Use [Get-AzVirtualNetwork](/powershell/module/az.network/get-azvirtualnetwork) and [Set-AzVirtualNetwork](/powershell/module/az.network/set-azvirtualnetwork) to disable encryption for the virtual network.

```azurepowershell-interactive
## Place the virtual network configuration into a variable. ##
$net = @{
    Name = 'myVNet'
    ResourceGroupName = 'myResourceGroup'
}
$vnet = Get-AzVirtualNetwork @net

## Update the encryption parameter and save the configuration. ##
$vnet.Encryption = @{
Enabled = "false"
}
$vnet | Set-AzVirtualNetwork
```

# [**CLI**](#tab/manage-encryption-cli)

Use [az network vnet update](/cli/azure/network/vnet#az-network-vnet-update) to disable encryption for the virtual network.

```azurecli-interactive
az network vnet update \
    --name myVNet \
    --resource-group myResourceGroup \
    --enable-encryption false
```
---

## Change enforcement policy

The encryption enforcement policy can be changed on the Azure Virtual Network.

# [**PowerShell**](#tab/manage-encryption-powershell)

There are two options for the encryption enforcement policy parameter:

- **DropUnencrypted** - In this scenario, network traffic that isn’t encrypted by the underlying hardware is **dropped**. The traffic drop happens if a virtual machine, such as an A-series or B-series, or an older D-series such as Dv2, is in the virtual network.

- **AllowUnencrypted** - In this scenario, network traffic that isn’t encrypted by the underlying hardware is allowed. This scenario allows incompatible virtual machine sizes to communicate with compatible virtual machine sizes.

Use [Get-AzVirtualNetwork](/powershell/module/az.network/get-azvirtualnetwork) and [Set-AzVirtualNetwork](/powershell/module/az.network/set-azvirtualnetwork) to change the encryption enforcement policy.

```azurepowershell-interactive
## Place the virtual network configuration into a variable. ##
$net = @{
    Name = 'myVNet'
    ResourceGroupName = 'myResourceGroup'
}
$vnet = Get-AzVirtualNetwork @net

## Update the encryption and enforcement parameter and save the configuration. ##
$vnet.Encryption = @{
Enforcement = "allowUnencrypted"
}
$vnet | Set-AzVirtualNetwork
```

# [**CLI**](#tab/manage-encryption-cli)

There are two options for the parameter **`--encryption-enforcement-policy`**:

- **DropUnencrypted** - In this scenario, network traffic that isn’t encrypted by the underlying hardware is **dropped**. The traffic drop happens if a virtual machine, such as an A-series or B-series, or an older D-series such as Dv2, is in the virtual network.

- **AllowUnencrypted** - In this scenario, network traffic that isn’t encrypted by the underlying hardware is allowed. This scenario allows incompatible virtual machine sizes to communicate with compatible virtual machine sizes.

Use [az network vnet update](/cli/azure/network/vnet#az-network-vnet-update) to change the encryption enforcement policy.

```azurecli-interactive
az network vnet update \
    --name myVNet \
    --resource-group myResourceGroup \
    --encryption-enforcement-policy allowUnencrypted
```
---

## Next steps

- For more information about Azure Virtual Networks, see [What is Azure Virtual Network?](/azure/virtual-network/virtual-networks-overview).

- For more information about Azure Virtual Network encryption, see [What is Azure Virtual Network encryption?](virtual-network-encryption-overview.md).