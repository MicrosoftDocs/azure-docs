---
title: Create a virtual network with encryption - Azure portal
titleSuffix: Azure Virtual Network
description: Learn how to create an encrypted virtual network using the Azure portal. A virtual network lets Azure resources communicate with each other and with the internet. 
author: asudbring
ms.service: azure-virtual-network
ms.topic: how-to
ms.date: 08/15/2024
ms.author: allensu

---

# Create a virtual network with encryption using the Azure portal

Azure Virtual Network encryption is a feature of Azure Virtual Network. Virtual network encryption allows you to seamlessly encrypt and decrypt internal network traffic over the wire, with minimal effect to performance and scale. Azure Virtual Network encryption protects data traversing your virtual network virtual machine to virtual machine and virtual machine to on-premises.

## Prerequisites

### [Portal](#tab/portal)

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

### [PowerShell](#tab/powershell)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Azure PowerShell installed locally or Azure Cloud Shell.

- Sign in to Azure PowerShell and ensure you've selected the subscription with which you want to use this feature.  For more information, see [Sign in with Azure PowerShell](/powershell/azure/authenticate-azureps).

- Ensure your `Az.Network` module is 4.3.0 or later. To verify the installed module, use the command Get-InstalledModule -Name `Az.Network`. If the module requires an update, use the command Update-Module -Name `Az.Network` if necessary.

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-Az-ps). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

### [CLI](#tab/cli)

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- The how-to article requires version 2.31.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

---

## Create a virtual network

### [Portal](#tab/portal)

[!INCLUDE [virtual-network-create.md](~/reusable-content/ce-skilling/azure/includes/virtual-network-create.md)]

### [PowerShell](#tab/powershell)

Create a resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) named **test-rg** in the **eastus2** location.

```azurepowershell-interactive
$rg =@{
    Name = 'test-rg'
    Location = 'eastus2'
}
New-AzResourceGroup @rg
```

Use [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork) and [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig) to create a virtual network.

```azurepowershell-interactive
## Create backend subnet config ##
$subnet = @{
    Name = 'subnet-1'
    AddressPrefix = '10.0.0.0/24'
}
$subnetConfig = New-AzVirtualNetworkSubnetConfig @subnet 

## Create the virtual network ##
$net = @{
    Name = 'vnet-1'
    ResourceGroupName = 'test-rg'
    Location = 'eastus2'
    AddressPrefix = '10.0.0.0/16'
    Subnet = $subnetConfig
    EnableEncryption = 'true'
    EncryptionEnforcementPolicy = 'AllowUnencrypted'
}
New-AzVirtualNetwork @net
```

### [CLI](#tab/cli)

Create a resource group with [az group create](/cli/azure/group#az-group-create) named **test-rg** in the **eastus2** location.

```azurecli-interactive
  az group create \
    --name test-rg \
    --location eastus2
```

Use [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create) to create a virtual network.

```azurecli-interactive
  az network vnet create \
    --resource-group test-rg \
    --location eastus2 \
    --name vnet-1 \
    --enable-encryption true \
    --encryption-enforcement-policy allowUnencrypted \
    --address-prefixes 10.0.0.0/16 \
    --subnet-name subnet-1 \
    --subnet-prefixes 10.0.0.0/24 
```

---

> [!IMPORTANT]
> Azure Virtual Network encryption requires supported virtual machine SKUs in the virtual network for traffic to be encrypted. The setting **dropUnencrypted** will drop traffic between unsupported virtual machine SKUs if they are deployed in the virtual network. For more information, see [Azure Virtual Network encryption requirements](virtual-network-encryption-overview.md#requirements).

## Enable encryption on a virtual network

### [Portal](#tab/portal)

Use the following steps to enable encryption for a virtual network.

1. In the search box at the top of the portal, begin typing **Virtual networks**. When **Virtual networks** appears in the search results, select it.

1. Select **vnet-1**.

1. In the **Overview** of **vnet-1**, select the **Properties** tab.

1. Select **Disabled** next to **Encryption**:

    :::image type="content" source="./media/how-to-create-encryption-portal/virtual-network-properties.png" alt-text="Screenshot of properties of the virtual network.":::

1. Select the box next to **Virtual network encryption**.

1. Select **Save**.

### [PowerShell](#tab/powershell)

You can also enable encryption on an existing virtual network using [Set-AzVirtualNetwork](/powershell/module/az.network/set-azvirtualnetwork). **This step isn't necessary if you created the virtual network with encryption enabled in the previous steps.**

```azurepowershell-interactive
## Place the virtual network configuration into a variable. ##
$net = @{
    Name = 'vnet-1'
    ResourceGroupName = 'test-rg'
}
$vnet = Get-AzVirtualNetwork @net

## Enable encryption on the virtual network ##
$vnet.Encryption = @{
    Enabled = 'true'
    Enforcement = 'allowUnencrypted'
}
$vnet | Set-AzVirtualNetwork
```

### [CLI](#tab/cli)

You can also enable encryption on an existing virtual network using [az network vnet update](/cli/azure/network/vnet#az-network-vnet-update). **This step isn't necessary if you created the virtual network with encryption enabled in the previous steps.**

```azurecli-interactive
  az network vnet update \
    --resource-group test-rg \
    --name vnet-1 \
    --enable-encryption true \
    --encryption-enforcement-policy allowUnencrypted
```

---

## Verify encryption enabled

### [Portal](#tab/portal)

1. In the search box at the top of the portal, begin typing **Virtual networks**. When **Virtual networks** appears in the search results, select it.

1. Select **vnet-1**.

1. In the **Overview** of **vnet-1**, select the **Properties** tab.

1. Verify that **Encryption** is set to **Enabled**.

    :::image type="content" source="./media/how-to-create-encryption-portal/virtual-network-properties-encryption-enabled.png" alt-text="Screenshot of properties of the virtual network with encryption enabled.":::

### [PowerShell](#tab/powershell)

Use [Get-AzVirtualNetwork](/powershell/module/az.network/get-azvirtualnetwork) to view the encryption parameter for the virtual network you created previously.

```azurepowershell-interactive
## Place the virtual network configuration into a variable. ##
$net = @{
    Name = 'vnet-1'
    ResourceGroupName = 'test-rg'
}
$vnet = Get-AzVirtualNetwork @net
```

To view the parameter for encryption, enter the following information.

```azurepowershell-interactive
$vnet.Encryption
```

```output
Enabled Enforcement
------- -----------
True   allowUnencrypted
```

### [CLI](#tab/cli)

Use [az network vnet show](/cli/azure/network/vnet#az-network-vnet-show) to view the encryption parameter for the virtual network you created previously.

```azurecli-interactive
  az network vnet show \
    --resource-group test-rg \
    --name vnet-1 \
    --query encryption \
    --output tsv
```

```output
user@Azure:~$ az network vnet show \
    --resource-group test-rg \
    --name vnet-1 \
    --query encryption \
    --output tsv
True   AllowUnencrypted
```

---

### [Portal](#tab/portal)

[!INCLUDE [portal-clean-up.md](~/reusable-content/ce-skilling/azure/includes/portal-clean-up.md)]

### [PowerShell](#tab/powershell)

When no longer needed, you can use [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) to remove the resource group and all of the resources it contains:

```azurepowershell-interactive 
$cleanup = @{
  Name  = "test-rg"
}
Remove-AzResourceGroup @cleanup -Force
```

### [CLI](#tab/cli)

When you're done with the virtual network, use [az group delete](/cli/azure/group#az-group-delete) to remove the resource group and all its resources.

```azurecli-interactive
az group delete \
    --name test-rg \
    --yes
```

---

## Next steps

- For more information about Azure Virtual Networks, see [What is Azure Virtual Network?](/azure/virtual-network/virtual-networks-overview)

- For more information about Azure Virtual Network encryption, see [What is Azure Virtual Network encryption?](virtual-network-encryption-overview.md)
